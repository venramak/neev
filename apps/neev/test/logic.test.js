import { describe, it, expect } from "vitest";
import * as L from "../src/logic.js";
import { PLACES, ROLES, LAYERS } from "../src/content.js";

const ids = [...PLACES, ...ROLES].map((x) => x.id);
describe("canon", () => {
  it("has three circles' worth of roles under five places", () => {
    expect(PLACES).toHaveLength(5); expect(ROLES).toHaveLength(13);
    expect(ROLES.filter((r) => r.ring === "rasoi")).toHaveLength(4);
    expect(ROLES.filter((r) => r.ring === "aangan")).toHaveLength(5);
    expect(ROLES.filter((r) => r.ring === "mohalla")).toHaveLength(4);
    ROLES.forEach((r) => expect(PLACES.some((p) => p.id === r.place)).toBe(true));
    expect(new Set(ids).size).toBe(18);
  });
  it("every seat and layer speaks both languages", () => {
    [...PLACES, ...ROLES].forEach((s) => { expect(s.q.hi && s.q.en).toBeTruthy(); expect(s.chips.hi.length && s.chips.en.length).toBeTruthy(); });
    LAYERS.forEach((l) => expect(l.act.hi && l.act.en && l.mirror.hi && l.lead.en).toBeTruthy());
  });
});
describe("people", () => {
  it("matches the same person across spellings of case and space", () => {
    const S = L.fresh(); const a = L.personFor(S, " Meera  Tai "), b = L.personFor(S, "meera tai", "rasoi");
    expect(a).toBe(b); expect(S.people).toHaveLength(1); expect(S.people[0].ring).toBe("rasoi");
    expect(L.personFor(S, "   ")).toBeNull();
  });
  it("strips markup from names", () => { expect(L.clean("<b>Ravi</b>")).toBe("bRavi/b"); });
});
describe("layers open by act or by 24 hours", () => {
  const S = L.fresh(); const t0 = 1_000_000;
  it("layer 1 is always open, layer 2 is not until layer 1 is finished", () => { expect(L.layerOpen(S, 1, t0)).toBe(true); expect(L.layerOpen(S, 2, t0)).toBe(false); });
  it("stays shut the same evening without the act", () => { S.layers[1] = { doneAt: t0 }; S.acts.push({ layer: 1, doneAt: 0 }); expect(L.layerOpen(S, 2, t0 + 3 * 3600e3)).toBe(false); expect(L.hoursLeft(S, 2, t0 + 3 * 3600e3)).toBe(21); });
  it("opens after 24 hours", () => { expect(L.layerOpen(S, 2, t0 + L.DAY)).toBe(true); });
  it("opens at once when the act is done", () => { S.acts[0].doneAt = t0 + 60e3; expect(L.layerOpen(S, 2, t0 + 61e3)).toBe(true); expect(L.lastLayerDone(S)).toBe(1); });
});
describe("findings", () => {
  const place = PLACES.map((p) => p.id);
  it("names one person carrying most of the places", () => {
    const S = L.fresh(); const a = L.personFor(S, "Asha"), b = L.personFor(S, "Ravi");
    S.seats = { sukoon: { p: a }, sach: { p: a }, sahara: { p: a }, apnapan: { p: b }, disha: { none: true, p: null } };
    const f = L.findings(S, place);
    expect(f.find((x) => x.k === "load")).toMatchObject({ p: a, n: 3, of: 4 });
    expect(f.find((x) => x.k === "empty").seats).toEqual(["disha"]);
  });
  it("shows one-way places only after the both-ways layer", () => {
    const S = L.fresh(); const a = L.personFor(S, "Asha");
    S.seats = { sukoon: { p: a } }; S.held = { sach: [a] };
    expect(L.findings(S, place).some((x) => x.k === "take")).toBe(false);
    S.layers[3] = { doneAt: 1 };
    const f = L.findings(S, place);
    expect(f.find((x) => x.k === "take").places).toEqual(["sukoon"]);
    expect(f.find((x) => x.k === "give").places).toEqual(["sach"]);
  });
});
describe("share cards", () => {
  it("round-trips a told name, including Devanagari", () => {
    const c = L.decodeCard(L.encodeCard({ k: "t", w: "मेरा सुकून", s: "sukoon", f: "Venki" }), ids);
    expect(c).toEqual({ k: "t", w: "मेरा सुकून", s: "sukoon", f: "Venki" });
  });
  it("carries only the shape, clamped", () => {
    expect(L.decodeCard(L.encodeCard({ k: "s", c: [4, 9999, -3], e: 2, f: "", names: ["x"] }), ids)).toEqual({ k: "s", c: [4, 200, 0], e: 2, f: "" });
  });
  it("rejects junk, unknown seats and markup", () => {
    expect(L.decodeCard("not-base64!!", ids)).toBeNull();
    expect(L.decodeCard(L.encodeCard({ k: "t", w: "x", s: "nope" }), ids)).toBeNull();
    expect(L.decodeCard(L.encodeCard({ k: "t", w: "<img src=x>", s: "sach" }), ids).w).toBe("img src=x");
    expect(L.decodeCard("a".repeat(700), ids)).toBeNull();
  });
});
describe("doors and the gate", () => {
  it("reads every kind of door", () => {
    expect(L.doorFrom("/3", "")).toEqual({ k: "e", n: 3 });
    expect(L.doorFrom("/s/07", "")).toEqual({ k: "s", n: 7 });
    expect(L.doorFrom("/b/village", "")).toEqual({ k: "b", id: "village" });
    expect(L.doorFrom("/", "?d=m/jan-launch")).toEqual({ k: "m", id: "jan-launch" });
    expect(L.doorFrom("/9", "")).toBeNull(); expect(L.doorFrom("/", "")).toBeNull();
  });
  it("opens the gate on crisis words in three scripts and stays quiet otherwise", () => {
    expect(L.gateHit("I want to die")).toBe(true); expect(L.gateHit("jeena nahi chahta ab")).toBe(true); expect(L.gateHit("आत्महत्या")).toBe(true);
    expect(L.gateHit("Meera tai")).toBe(false);
  });
});
