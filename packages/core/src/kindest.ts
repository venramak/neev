import type { Person, Reach } from "./types";
import { suggestable } from "./rings";

const SILENCE = { y: 4, m: 3, w: 2, d: 1 } as const;
const DAY = 864e5;

/**
 * The kindest gap: someone who would come or pick up, with the longest silence.
 * Never a complicated tie, a group, someone gone, someone private-smaller, or someone switched off.
 * Learns only from the person's own outcomes: a recent "glad" reach lowers urgency (the thread is alive),
 * a reach in the last 5 days removes them (don't nag).
 */
export function kindestGap(people: Person[], reaches: Reach[], now: number): Person | undefined {
  const recent = new Set(reaches.filter((r) => now - r.at < 5 * DAY).map((r) => r.personId));
  const gladLately = new Set(reaches.filter((r) => r.outcome === "glad" && now - r.at < 30 * DAY).map((r) => r.personId));
  const score = (p: Person) =>
    (p.recency ? SILENCE[p.recency] : 2) * 10 + (p.warmth === "come" ? 3 : 0) - (gladLately.has(p.id) ? 15 : 0);
  return people
    .filter((p) => suggestable(p) && (p.warmth === "come" || p.warmth === "answer") && !recent.has(p.id))
    .sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name))[0];
}

/** A reach waiting for "how did it go?": older than 20 hours, younger than 14 days, asked at most twice. */
export function pendingLanding(reaches: Reach[], now: number): Reach | undefined {
  return reaches
    .filter((r) => {
      const age = now - r.at;
      return !r.outcome && age > 20 * 36e5 && age < 14 * DAY && (r.asked === 0 || (r.asked === 1 && age > 4 * DAY));
    })
    .sort((a, b) => b.at - a.at)[0];
}
