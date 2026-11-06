/**
 * The crisis gate. Deliberately biased toward false positives: a wrongly shown helpline costs a tap,
 * a missed one can cost far more. Each language's list must be reviewed by a native-speaking counsellor
 * before release; these are starter lists, not a validated lexicon.
 */
import type { Lang } from "./types";

const PHRASES: Record<Lang | "hi_latn", string[]> = {
  en: ["kill myself", "end my life", "want to die", "suicide", "no reason to live", "no point living",
    "better off without me", "can't do this anymore", "cant do this anymore", "hurt myself", "self harm"],
  hi: ["आत्महत्या", "ख़ुदकुशी", "खुदकुशी", "मरना चाहता", "मरना चाहती", "जीना नहीं चाहता", "जीना नहीं चाहती",
    "अब और नहीं जीना", "खुद को खत्म"],
  hi_latn: ["khudkushi", "aatmhatya", "atmahatya", "mar jaana chahta", "mar jaana chahti", "marna chahta", "marna chahti",
    "jeena nahi chahta", "jeena nahi chahti", "khud ko khatam"],
};

export const HELPLINES = {
  IN: [{ name: "Tele-MANAS", number: "14416" }, { name: "Emergency", number: "112" }, { name: "Women's helpline", number: "181" }],
  UK: [{ name: "NHS", number: "111" }, { name: "Emergency", number: "999" }],
} as const;

export function normalise(text: string): string {
  return " " + text.normalize("NFC").toLowerCase().replace(/[’']/g, "'").replace(/[^\p{L}\p{M}\p{N}' ]+/gu, " ").replace(/\s+/g, " ").trim() + " ";
}

export function gateHit(text: string): boolean {
  const t = normalise(text);
  return Object.values(PHRASES).some((list) => list.some((p) => t.includes(normalise(p).trim())));
}
