/* Pure logic for Neev: no DOM, no storage. Everything here is unit-tested. */

export const DAY = 24 * 60 * 60 * 1000;

export function fresh() {
  return { v: 7, lang: "hi", me: "", door: null, first: "", people: [], seats: {}, held: {}, layers: {}, acts: [], flow: { layer: 1, i: 0 } };
}

export function norm(name) {
  return String(name || "").normalize("NFC").replace(/\s+/g, " ").trim().toLowerCase();
}
export function clean(name, max = 40) {
  return String(name || "").replace(/[\u0000-\u001f<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max);
}

/** Find a person by name, or add them. Returns the person's id, or null for an empty name. */
export function personFor(S, name, ring) {
  const n = clean(name);
  if (!n) return null;
  let p = S.people.find((x) => norm(x.name) === norm(n));
  if (!p) {
    p = { id: "p" + (S.people.reduce((m, x) => Math.max(m, +x.id.slice(1)), 0) + 1), name: n, ring: ring || null, gone: false };
    S.people.push(p);
  } else if (!p.ring && ring) p.ring = ring;
  return p.id;
}
export const person = (S, id) => S.people.find((p) => p.id === id) || null;

/* The crisis gate. Biased toward false positives: a wrongly shown helpline costs a tap.
   Starter lists only; each language needs review by a native-speaking counsellor before release. */
const PHRASES = ["kill myself", "end my life", "want to die", "suicide", "no reason to live", "no point living",
  "better off without me", "can't do this anymore", "cant do this anymore", "hurt myself", "self harm",
  "आत्महत्या", "ख़ुदकुशी", "खुदकुशी", "मरना चाहता", "मरना चाहती", "जीना नहीं चाहता", "जीना नहीं चाहती", "अब और नहीं जीना", "खुद को खत्म",
  "khudkushi", "aatmhatya", "atmahatya", "mar jaana chahta", "mar jaana chahti", "marna chahta", "marna chahti",
  "jeena nahi chahta", "jeena nahi chahti", "khud ko khatam"];
const flat = (t) => " " + String(t || "").normalize("NFC").toLowerCase().replace(/[’']/g, "'").replace(/[^\p{L}\p{M}\p{N}' ]+/gu, " ").replace(/\s+/g, " ").trim() + " ";
export function gateHit(text) {
  const t = flat(text);
  return PHRASES.some((p) => t.includes(flat(p).trim()));
}

/** A layer opens when the one before it is finished AND (its act is done OR 24 hours have passed). */
export function layerOpen(S, n, now) {
  if (n <= 1) return true;
  const prev = S.layers[n - 1];
  if (!prev || !prev.doneAt) return false;
  const act = S.acts.find((a) => a.layer === n - 1);
  return !!(act && act.doneAt) || now - prev.doneAt >= DAY;
}
export function hoursLeft(S, n, now) {
  const prev = S.layers[n - 1];
  if (!prev || !prev.doneAt) return null;
  return Math.max(0, Math.ceil((prev.doneAt + DAY - now) / (60 * 60 * 1000)));
}
export function lastLayerDone(S) {
  let n = 0;
  for (const k of Object.keys(S.layers)) if (S.layers[k].doneAt) n = Math.max(n, +k);
  return n;
}

/** What the map shows, without a score: empty seats, one person carrying too much, one-way places. */
export function findings(S, placeIds) {
  const out = [];
  const filled = Object.entries(S.seats).filter(([, s]) => s.p);
  const empty = Object.entries(S.seats).filter(([, s]) => s.none).map(([id]) => id);
  if (empty.length) out.push({ k: "empty", seats: empty });
  const count = {};
  filled.forEach(([, s]) => { count[s.p] = (count[s.p] || 0) + 1; });
  const top = Object.entries(count).sort((a, b) => b[1] - a[1])[0];
  if (top && filled.length >= 4 && top[1] >= 3 && top[1] / filled.length >= 0.5) out.push({ k: "load", p: top[0], n: top[1], of: filled.length });
  if (S.layers[3] && S.layers[3].doneAt) {
    const take = [], give = [];
    placeIds.forEach((id) => {
      const got = !!(S.seats[id] && S.seats[id].p), gave = (S.held[id] || []).length > 0;
      if (got && !gave) take.push(id);
      if (!got && gave) give.push(id);
    });
    if (take.length) out.push({ k: "take", places: take });
    if (give.length) out.push({ k: "give", places: give });
  }
  return out;
}

/* Share cards. The link carries only what the sender chose to say: a word, a place, an optional first name,
   or the bare shape of a map. Never the map itself, never anyone else's name. */
const b64 = {
  enc(s) { const b = new TextEncoder().encode(s); let x = ""; b.forEach((c) => { x += String.fromCharCode(c); }); return btoa(x).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); },
  dec(s) { const x = atob(s.replace(/-/g, "+").replace(/_/g, "/")); return new TextDecoder().decode(Uint8Array.from(x, (c) => c.charCodeAt(0))); },
};
export function encodeCard(card) { return b64.enc(JSON.stringify(card)); }
export function decodeCard(str, seatIds) {
  try {
    if (!str || str.length > 600) return null;
    const c = JSON.parse(b64.dec(str));
    const f = clean(c.f, 24);
    if (c.k === "t") {
      const w = clean(c.w, 60);
      if (!w || !seatIds.includes(c.s)) return null;
      return { k: "t", w, s: c.s, f };
    }
    if (c.k === "s") {
      if (!Array.isArray(c.c) || c.c.length !== 3) return null;
      const num = (v) => Math.max(0, Math.min(200, Math.floor(+v) || 0));
      return { k: "s", c: c.c.map(num), e: num(c.e), f };
    }
    return null;
  } catch { return null; }
}

/** Which door did they come through? /1../5 episodes, /p intro, /s/07 Shorts, /b/village books, /m/x emails, /c coaching. */
export function doorFrom(path, search) {
  const q = new URLSearchParams(search || "").get("d");
  const seg = (q || path || "").replace(/^\/+|\/+$/g, "").toLowerCase().split("/");
  if (/^[1-5]$/.test(seg[0])) return { k: "e", n: +seg[0] };
  if (seg[0] === "p") return { k: "p" };
  if (seg[0] === "c") return { k: "c" };
  if (seg[0] === "s" && /^\d{2}$/.test(seg[1] || "")) return { k: "s", n: +seg[1] };
  if (seg[0] === "b" && /^[a-z]{2,16}$/.test(seg[1] || "")) return { k: "b", id: seg[1] };
  if (seg[0] === "m" && /^[a-z0-9-]{1,24}$/.test(seg[1] || "")) return { k: "m", id: seg[1] };
  return null;
}
