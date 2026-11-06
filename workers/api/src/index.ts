/**
 * Neev's only server code. Two routes, no user data:
 *   POST /api/chorus  { kind }        -> anonymous weekly count (no IDs, no IPs stored)
 *   GET  /api/chorus                  -> this week's counts
 *   POST /api/draft   StructPayload   -> a structure-only draft from a hosted model, charter-checked
 * Nothing is logged. The draft route refuses any payload that could carry free text.
 */
import { checkOutput, type StructPayload } from "@neev/core";

export interface Env { DB: D1Database; AI: Ai }

const KINDS = new Set(["line", "act", "audit"]);
const TASKS = new Set(["draft"]);
const LANGS = new Set(["en", "hi"]);
const REASONS = new Set(["share", "ask", "memory", "news", "occasion", "plan", "thanks", "mend", "hello"]);
const RINGS = new Set(["few", "circle", "village", "carried"]);
const REGISTERS = new Set(["elder", "peer", "casual"]);

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

export function weekKey(d = new Date()): string {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  t.setUTCDate(t.getUTCDate() - ((t.getUTCDay() + 6) % 7));
  return t.toISOString().slice(0, 10);
}

/** Accepts only the exact StructPayload shape; any extra key or free string is a refusal. */
export function parseStruct(x: unknown): StructPayload | null {
  if (!x || typeof x !== "object") return null;
  const o = x as Record<string, unknown>;
  const allowed = new Set(["task", "lang", "register", "reason", "people"]);
  if (Object.keys(o).some((k) => !allowed.has(k))) return null;
  if (!TASKS.has(o.task as string) || !LANGS.has(o.lang as string) || !REASONS.has(o.reason as string)) return null;
  if (o.register !== undefined && !REGISTERS.has(o.register as string)) return null;
  if (!Array.isArray(o.people) || o.people.length !== 1) return null;
  const p = o.people[0] as Record<string, unknown>;
  if (Object.keys(p).some((k) => !["token", "ring"].includes(k))) return null;
  if (p.token !== "{P1}" || !RINGS.has(p.ring as string)) return null;
  return o as unknown as StructPayload;
}

function prompt(p: StructPayload): string {
  const reg = p.register === "elder" ? "respectful, to an elder" : p.register === "casual" ? "casual, between friends" : "warm and plain";
  return [
    `Write ONE short text message (under 30 words) in ${p.lang === "hi" ? "Hinglish (Hindi in Latin script)" : "English"}, ${reg}.`,
    `Address it to {P1}. Reason for writing: ${p.reason}.`,
    "Keep the literal ___ where the sender will add the specific thing only they know.",
    "No feelings, no 'thinking of you', no advice, no questions about wellbeing beyond a simple 'how are you'.",
    "Reply with the message only.",
  ].join(" ");
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    if (url.pathname === "/api/chorus" && req.method === "GET") {
      const rows = await env.DB.prepare("SELECT kind, n FROM chorus WHERE week = ?").bind(weekKey()).all<{ kind: string; n: number }>();
      return json(Object.fromEntries(rows.results.map((r) => [r.kind, r.n])));
    }
    if (url.pathname === "/api/chorus" && req.method === "POST") {
      const b = (await req.json().catch(() => null)) as { kind?: string } | null;
      if (!b || !KINDS.has(b.kind ?? "")) return json({ error: "kind" }, 400);
      await env.DB.prepare("INSERT INTO chorus (week, kind, n) VALUES (?, ?, 1) ON CONFLICT(week, kind) DO UPDATE SET n = n + 1")
        .bind(weekKey(), b.kind).run();
      return json({ ok: true });
    }
    if (url.pathname === "/api/draft" && req.method === "POST") {
      const p = parseStruct(await req.json().catch(() => null));
      if (!p) return json({ error: "payload must be structure-only" }, 400);
      const out = (await env.AI.run("@cf/meta/llama-3.1-8b-instruct", { prompt: prompt(p), max_tokens: 80 })) as { response?: string };
      const text = (out.response ?? "").trim().replace(/^"|"$/g, "");
      const c = checkOutput(text, { maxWords: 40, mustKeepBlank: p.reason !== "hello" });
      return c.ok ? json({ text }) : json({ error: "charter", why: c.why }, 422);
    }
    return json({ error: "not found" }, 404);
  },
};
