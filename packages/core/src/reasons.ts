import type { Lang, ReasonId } from "./types";

/** Reasons to get in touch. The person brings the specifics (the ___); the app only holds the door open. */
export const REASONS: Record<ReasonId, Record<Lang, string>> = {
  share: { en: "{p}, saw this and it made me think of you: ___", hi: "{p}, yeh dekha aur tumhari yaad aa gayi: ___" },
  ask: { en: "{p}, quick question, you'd know this: ___? No rush.", hi: "{p}, ek sawaal, tumhe pata hoga: ___? Koi jaldi nahi." },
  memory: { en: "{p}, came across ___ today. Remember that?", hi: "{p}, aaj ___ dekha, woh din yaad aa gaye." },
  news: { en: "{p}, heard about ___. How did it go?", hi: "{p}, ___ ke baare mein suna. Kaisa raha?" },
  occasion: { en: "Happy ___, {p}! How's everyone at home?", hi: "{p}, ___ ki shubhkaamnayein! Ghar mein sab kaise hain?" },
  plan: { en: "{p}, ___ this week? Somewhere near you.", hi: "{p}, is hafte ___ chalein? Tumhare paas hi." },
  thanks: { en: "{p}, was ___ today and remembered you taught me that. Thanks, still.", hi: "{p}, aaj ___ karte hue yaad aaya ki yeh tumne sikhaya tha. Shukriya." },
  mend: { en: "{p}, I've been thinking about ___. Could we talk sometime?", hi: "{p}, ___ ke baare mein sochta raha. Kabhi baat kar sakte hain?" },
  hello: { en: "Hi {p}! How are you? It's been a while.", hi: "Hi {p}, kaise ho? Kaafi din ho gaye." },
};

export function template(reason: ReasonId, lang: Lang, name: string): string {
  return REASONS[reason][lang].replaceAll("{p}", name);
}
