/**
 * The device boundary. A `StructPayload` is the ONLY shape that may leave the phone.
 * It has no field that can carry free text or a name: people become tokens, everything else is an enum or a number.
 * `assertNoLeak` is run on every outgoing payload as a second lock.
 */
import type { Lang, ReasonId, Recency, Ring, Warmth } from "./types";

export interface StructPerson { token: string; ring: Ring; warmth?: Warmth; recency?: Recency }
export interface StructPayload {
  task: "draft" | "monthly-sentence" | "ritual-name";
  lang: Lang;
  register?: "elder" | "peer" | "casual";
  reason?: ReasonId;
  people: StructPerson[];
  counts?: Record<string, number>;
}

export interface TokenMap { [token: string]: string }

export function tokenise(names: string[]): { tokens: string[]; map: TokenMap } {
  const map: TokenMap = {};
  const tokens = names.map((n, i) => { const t = `{P${i + 1}}`; map[t] = n; return t; });
  return { tokens, map };
}

export function restore(text: string, map: TokenMap): string {
  return Object.entries(map).reduce((s, [t, n]) => s.split(t).join(n), text);
}

/** Throws if any known name, alias or free text from the person appears anywhere in the payload. */
export function assertNoLeak(payload: StructPayload, secrets: string[]): void {
  const json = JSON.stringify(payload).toLowerCase();
  for (const s of secrets) {
    const v = s.trim().toLowerCase();
    if (v.length >= 2 && json.includes(v)) throw new Error("device-boundary: private text in outgoing payload");
  }
}
