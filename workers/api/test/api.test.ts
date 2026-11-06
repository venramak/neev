import { describe, expect, it } from "vitest";
import { parseStruct, weekKey } from "../src/index";

describe("structure-only draft payload", () => {
  const ok = { task: "draft", lang: "en", reason: "memory", people: [{ token: "{P1}", ring: "few" }] };
  it("accepts the exact shape", () => expect(parseStruct(ok)).not.toBeNull());
  it.each([
    ["a name as token", { ...ok, people: [{ token: "Leela", ring: "few" }] }],
    ["an extra free-text field", { ...ok, note: "she is moving to Pune" }],
    ["an extra field on the person", { ...ok, people: [{ token: "{P1}", ring: "few", name: "Leela" }] }],
    ["an unknown reason", { ...ok, reason: "Leela's exam" }],
    ["two people", { ...ok, people: [{ token: "{P1}", ring: "few" }, { token: "{P2}", ring: "few" }] }],
  ])("refuses %s", (_, x) => expect(parseStruct(x)).toBeNull());
});

describe("week key", () => {
  it("is the Monday of the week", () => expect(weekKey(new Date("2026-11-08T10:00:00Z"))).toBe("2026-11-02"));
});
