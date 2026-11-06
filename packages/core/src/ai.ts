/**
 * Engine orchestration. Engines are tried best-first; each output is checked against the charter;
 * any failure falls through, and the template is the floor that always works.
 */
import { checkOutput } from "./charter";
import { assertNoLeak, restore, tokenise, type StructPayload } from "./redact";
import { template } from "./reasons";
import type { Lang, ReasonId } from "./types";

export type EngineKind = "on-device" | "cloud-relay";
export interface Engine {
  id: string;
  kind: EngineKind;
  available(): Promise<boolean>;
  /** Receives tokens, never names. Returns text that may contain the tokens. */
  draft(p: StructPayload): Promise<string>;
}

export interface DraftResult { text: string; source: "template" | string; fellBack: boolean; reasons: string[] }

export async function draftMessage(
  engines: Engine[],
  req: { name: string; secrets: string[]; reason: ReasonId; lang: Lang; register?: "elder" | "peer" | "casual" },
): Promise<DraftResult> {
  const { tokens, map } = tokenise([req.name]);
  const payload: StructPayload = { task: "draft", lang: req.lang, reason: req.reason, people: [{ token: tokens[0]!, ring: "circle" }] };
  if (req.register) payload.register = req.register;
  const reasons: string[] = [];
  for (const e of engines) {
    try {
      if (!(await e.available())) { reasons.push(`${e.id}:unavailable`); continue; }
      if (e.kind === "cloud-relay") assertNoLeak(payload, [req.name, ...req.secrets]);
      const raw = await e.draft(payload);
      const c = checkOutput(raw, { maxWords: 40, mustKeepBlank: req.reason !== "hello" });
      if (!c.ok) { reasons.push(`${e.id}:${c.why}`); continue; }
      return { text: restore(raw, map), source: e.id, fellBack: false, reasons };
    } catch (err) {
      reasons.push(`${e.id}:error:${(err as Error).message}`);
    }
  }
  return { text: template(req.reason, req.lang, req.name), source: "template", fellBack: engines.length > 0, reasons };
}
