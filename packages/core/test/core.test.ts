import { describe, expect, it } from "vitest";
import {
  assertNoLeak, checkOutput, draftMessage, gateHit, kindestGap, moveRing, pendingLanding, portfolio, ringOf,
  type Engine, type Person, type Reach,
} from "../src";

const NOW = Date.parse("2026-11-07T12:00:00Z");
const DAY = 864e5;
const P = (o: Partial<Person> & { id: string }): Person => ({
  name: o.id, aliases: [], group: false, chairs: [], holdFor: false, noSuggest: false, smaller: false, ringLog: [], ...o,
});

describe("rings", () => {
  it("loss wins over everything, then override, then groups", () => {
    expect(ringOf(P({ id: "dad", warmth: "gone", ringOverride: "few" }))).toBe("carried");
    expect(ringOf(P({ id: "a", warmth: "nocall", ringOverride: "few" }))).toBe("few");
    expect(ringOf(P({ id: "team", group: true, warmth: "come" }))).toBe("village");
    expect(ringOf(P({ id: "k", warmth: "knot" }))).toBe("circle");
  });
  it("records ring movement", () => {
    const p = moveRing(P({ id: "a", warmth: "answer" }), "few", "2026-11-07");
    expect(p.ringLog).toEqual([{ at: "2026-11-07", from: "circle", to: "few" }]);
  });
  it("portfolio finds open chairs and heavy people", () => {
    const pf = portfolio([P({ id: "leela", warmth: "come", chairs: ["settle", "sharpen", "carry"] }), P({ id: "dad", warmth: "gone", chairs: ["aim"] })]);
    expect(pf.openChairs).toEqual(["belong", "aim"]);
    expect(pf.heavy.map((p) => p.id)).toEqual(["leela"]);
  });
});

describe("kindest gap", () => {
  const people = [
    P({ id: "tom", warmth: "answer", recency: "y" }),
    P({ id: "mum", warmth: "come", recency: "d" }),
    P({ id: "rohan", warmth: "knot", recency: "y" }),
    P({ id: "coach", warmth: "come", recency: "y", smaller: true }),
    P({ id: "group", warmth: "come", recency: "y", group: true }),
    P({ id: "papa", warmth: "gone" }),
  ];
  it("picks the longest warm silence and never an unsafe, knotted, grouped or lost tie", () => {
    expect(kindestGap(people, [], NOW)?.id).toBe("tom");
  });
  it("does not nag: a reach in the last five days removes them", () => {
    const r: Reach[] = [{ personId: "tom", at: NOW - 2 * DAY, reason: "ask", via: "message", asked: 0 }];
    expect(kindestGap(people, r, NOW)?.id).toBe("mum");
  });
  it("asks how it went once after a day, once more after four, then stops", () => {
    const r: Reach = { personId: "tom", at: NOW - 2 * DAY, reason: "ask", via: "message", asked: 0 };
    expect(pendingLanding([r], NOW)).toBe(r);
    expect(pendingLanding([{ ...r, asked: 1 }], NOW)).toBeUndefined();
    expect(pendingLanding([{ ...r, asked: 1, at: NOW - 5 * DAY }], NOW)).toBeDefined();
    expect(pendingLanding([{ ...r, asked: 2, at: NOW - 5 * DAY }], NOW)).toBeUndefined();
  });
});

describe("crisis gate", () => {
  it.each([
    "I can't do this anymore", "honestly i want to die", "मुझे अब और नहीं जीना", "आत्महत्या के बारे में सोचता हूँ",
    "kabhi kabhi mar jaana chahta hoon", "Suicide.",
  ])("opens for %s", (t) => expect(gateHit(t)).toBe(true));
  it.each(["Leela", "I'm tired after work", "Diwali at mum's", "Kenji from football"])("stays shut for %s", (t) =>
    expect(gateHit(t)).toBe(false));
});

describe("charter", () => {
  it("rejects therapy talk, companion talk, diagnosis and the banned opener", () => {
    for (const t of ["I understand how you feel ___", "You seem depressed", "I'm always here for you", "As an AI, ___", "I was just thinking of you ___"])
      expect(checkOutput(t).ok).toBe(false);
  });
  it("requires the blank to survive", () => {
    expect(checkOutput("Saw this and thought of our trip", { mustKeepBlank: true }).ok).toBe(false);
    expect(checkOutput("Saw this: ___", { mustKeepBlank: true }).ok).toBe(true);
  });
});

describe("device boundary", () => {
  it("throws if a name reaches an outgoing payload", () => {
    expect(() => assertNoLeak({ task: "draft", lang: "en", people: [{ token: "Leela", ring: "few" }] }, ["Leela"])).toThrow();
    expect(() => assertNoLeak({ task: "draft", lang: "en", people: [{ token: "{P1}", ring: "few" }] }, ["Leela"])).not.toThrow();
  });
});

describe("draft orchestration", () => {
  const eng = (id: string, out: string, kind: Engine["kind"] = "on-device", ok = true): Engine => ({
    id, kind, available: async () => ok, draft: async (p) => { expect(JSON.stringify(p)).not.toContain("Leela"); return out; },
  });
  it("uses the first engine whose output passes the charter, restoring the name", async () => {
    const r = await draftMessage([eng("bad", "I understand how you feel {P1} ___"), eng("good", "{P1}, found ___ today. Remember?")],
      { name: "Leela", secrets: [], reason: "memory", lang: "en" });
    expect(r).toMatchObject({ text: "Leela, found ___ today. Remember?", source: "good" });
    expect(r.reasons[0]).toMatch(/^bad:banned/);
  });
  it("falls back to the template when every engine fails or is absent", async () => {
    const r = await draftMessage([eng("off", "", "on-device", false), eng("fills", "{P1}, saw our photo!")],
      { name: "Leela", secrets: [], reason: "share", lang: "hi" });
    expect(r).toMatchObject({ source: "template", fellBack: true, text: "Leela, yeh dekha aur tumhari yaad aa gayi: ___" });
  });
});
