/**
 * The AI Line, as code. Every model output passes `checkOutput` before it can be shown.
 * If it fails, the caller shows the template instead. Nothing a model writes reaches the screen unchecked.
 */
const BANNED: RegExp[] = [
  /\b(i|we) (understand|know) how you feel\b/i,
  /\byou (are|seem|sound) (depressed|anxious|lonely|traumati[sz]ed|codependent)\b/i,
  /\b(diagnos|therap|psychiatr|medicat|disorder)\w*/i,
  /\bas an ai\b/i,
  /\bi('m| am) (here for you|always here)\b/i,
  /\b(you should|you must|you need to) (leave|confront|cut off|forgive)\b/i,
  /\bi was (just )?thinking (of|about) you\b/i,
  /\b(streak|points|level up|score)\b/i,
];

export type Check = { ok: true } | { ok: false; why: string };

export function checkOutput(text: string, opts: { maxWords?: number; mustKeepBlank?: boolean } = {}): Check {
  if (!text || !text.trim()) return { ok: false, why: "empty" };
  for (const re of BANNED) if (re.test(text)) return { ok: false, why: `banned:${re.source}` };
  if (opts.maxWords && text.trim().split(/\s+/).length > opts.maxWords) return { ok: false, why: "too-long" };
  if (opts.mustKeepBlank && !text.includes("___")) return { ok: false, why: "filled-the-blank" };
  return { ok: true };
}
