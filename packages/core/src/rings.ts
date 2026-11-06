import type { Person, Ring, Warmth } from "./types";

const BY_WARMTH: Record<Exclude<Warmth, "gone">, Ring> = { come: "few", answer: "circle", knot: "circle", nocall: "village" };

/** Where a person sits. Order matters: loss first, then the person's own override, then groups, then warmth. */
export function ringOf(p: Person): Ring {
  if (p.warmth === "gone") return "carried";
  if (p.ringOverride) return p.ringOverride;
  if (p.group) return "village";
  return p.warmth ? BY_WARMTH[p.warmth] : "village";
}

/** Typical sizes from research on how ties cluster in layers. Averages, never targets. */
export const TYPICAL: Record<Exclude<Ring, "carried">, { about: number; range: [number, number] }> = {
  few: { about: 4, range: [3, 5] },
  circle: { about: 15, range: [12, 20] },
  village: { about: 150, range: [100, 250] },
};

export function moveRing(p: Person, to: Ring, at: string): Person {
  const from = ringOf(p);
  if (from === to) return p;
  return { ...p, ringOverride: to, ringLog: [...p.ringLog, { at, from, to }] };
}

/** Safe to suggest an act or message for: alive, not a group, not private-smaller, not switched off. */
export function suggestable(p: Person): boolean {
  return p.warmth !== "gone" && !p.group && !p.smaller && !p.noSuggest;
}

export interface Portfolio {
  few: Person[]; circle: Person[]; village: Person[]; carried: Person[];
  openChairs: string[];
  /** People sitting in three or more chairs: a lot to rest on one person. */
  heavy: Person[];
  holdFor: Person[];
}

export function portfolio(people: Person[]): Portfolio {
  const by = (r: Ring) => people.filter((p) => ringOf(p) === r);
  const chairs = ["settle", "sharpen", "carry", "belong", "aim"] as const;
  const living = people.filter((p) => p.warmth !== "gone");
  return {
    few: by("few"), circle: by("circle"), village: by("village"), carried: by("carried"),
    openChairs: chairs.filter((c) => !living.some((p) => p.chairs.includes(c))),
    heavy: living.filter((p) => p.chairs.length >= 3),
    holdFor: living.filter((p) => p.holdFor),
  };
}
