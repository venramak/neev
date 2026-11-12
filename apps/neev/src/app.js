import { RINGS, PLACES, ROLES, LAYERS, NEXT, EPISODES, HELP } from "./content.js";
import * as L from "./logic.js";

const KEY = "neev.v7";
const SITE = "https://neev.twopointsingularity.com";
const SEAT = {};
PLACES.forEach((p) => { SEAT[p.id] = { ...p, kind: "place", place: p.id }; });
ROLES.forEach((r) => { SEAT[r.id] = { ...r, kind: "role" }; });
const SEAT_IDS = Object.keys(SEAT);
const PLACE_IDS = PLACES.map((p) => p.id);
const PLACE = Object.fromEntries(PLACES.map((p) => [p.id, p]));
const RING = Object.fromEntries(RINGS.map((r) => [r.id, r]));
const LAYER = Object.fromEntries(LAYERS.map((l) => [l.n, l]));

let S = load();
const V = { tab: "aaj", sheet: null, card: null, err: "", hint: "" };

function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 7) return s; } catch {}
  return L.fresh();
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} }

const P = (hi, en) => (S.lang === "en" ? en : hi);
const T = (o) => (typeof o === "string" ? o : o[S.lang] || o.hi);
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const $ = (q) => document.querySelector(q);
const val = (id) => { const e = document.getElementById(id); return e ? e.value : ""; };
const pname = (id) => { const p = L.person(S, id); return p ? p.name : ""; };

const OBJ = {
  diya: '<path d="M4 14c0 3.3 3.6 5 8 5s8-1.7 8-5H4z"/><path d="M12 11c-1.6-1.3-1.6-3.2 0-5.2 1.6 2 1.6 3.9 0 5.2z"/>',
  aaina: '<circle cx="12" cy="9" r="6"/><path d="M12 15v6M9 21h6"/>',
  bojh: '<path d="M6 9h12l2 11H4L6 9z"/><path d="M9 9a3 3 0 016 0"/>',
  chaabi: '<circle cx="8" cy="8" r="4"/><path d="M11 11l9 9M16 16l2-2M18.5 18.5l2-2"/>',
  mashaal: '<path d="M10 12h4l-1 9h-2l-1-9z"/><path d="M12 10c-2.6-1.6-2.6-4.6 0-7.2 2.6 2.6 2.6 5.6 0 7.2z"/>',
};
const icon = (placeId) => `<svg class="obj" viewBox="0 0 24 24" aria-hidden="true">${OBJ[PLACE[placeId].obj]}</svg>`;

/* ---------- flow ---------- */
function steps(n) {
  const seat = (s) => ({ t: "seat", id: s.id });
  if (n === 1) return [{ t: "intro" }, { t: "first" }, ...PLACES.map(seat), { t: "mirror" }, { t: "act" }];
  if (n === 3) return [{ t: "intro" }, ...PLACES.map((p) => ({ t: "hold", id: p.id })), { t: "mirror" }, { t: "act" }];
  const ring = LAYER[n].id;
  const out = [{ t: "intro" }, ...ROLES.filter((r) => r.ring === ring).map(seat)];
  if (n === 2) out.push({ t: "sort" });
  return out.concat([{ t: "mirror" }, { t: "act" }]);
}
const step = () => steps(S.flow.layer)[S.flow.i];
function go(d) {
  const st = steps(S.flow.layer);
  S.flow.i = Math.max(0, Math.min(st.length - 1, S.flow.i + d));
  if (st[S.flow.i].t === "sort" && !S.people.some((p) => !p.ring && !p.gone)) S.flow.i += d > 0 ? 1 : -1;
  V.err = ""; save(); render(); const sc = $("#scroll"); if (sc) sc.scrollTop = 0;
}
function ensureAct(n) {
  let a = S.acts.find((x) => x.layer === n);
  if (!a) { a = { id: "a" + n, layer: n, at: Date.now(), doneAt: 0, note: "", kind: "" }; S.acts.push(a); }
  return a;
}
function finishLayer() {
  const n = S.flow.layer;
  if (!S.layers[n]) S.layers[n] = {};
  if (!S.layers[n].doneAt) S.layers[n].doneAt = Date.now();
  S.flow = null; V.tab = "aaj"; save(); render();
}

/* ---------- screens ---------- */
function bar(n, st) {
  const all = steps(n), isSeat = (x) => x.t === "seat" || x.t === "hold";
  const seats = all.filter(isSeat);
  const before = all.slice(0, S.flow.i).filter(isSeat).length;
  const at = isSeat(st) ? before : before >= seats.length ? -1 : -2;
  const back = S.flow.i > 0 ? `<button class="link" data-a="back">‹ ${P("Peechhe", "Back")}</button>` : "<span></span>";
  const out = L.lastLayerDone(S) ? `<button class="link" data-a="home">${P("Baad mein", "Later")}</button>` : "<span></span>";
  const dots = seats.map((x, i) => `<i class="${at === -1 || (at >= 0 && i < at) ? "on" : i === at ? "now" : ""}"></i>`).join("");
  return `<div class="bar">${back}<div class="dots" aria-hidden="true">${st.t === "intro" ? "" : dots}</div>${out}</div>`;
}
const eyebrow = (n) => `${P("Parat", "Layer")} ${n} · ${T(LAYER[n])}`;

function vIntro(n) {
  const l = LAYER[n], d = S.door;
  let line = T(l.q), from = "";
  if (n === 1 && d) {
    if (d.k === "e") { line = T(EPISODES[d.n]); from = P(`Aap Episode ${d.n} se aaye hain.`, `You came from Episode ${d.n}.`); }
    else if (d.k === "s") from = P("Aap ek Short se aaye hain.", "You came from a Short.");
    else if (d.k === "b") from = P("Aap kitaab se aaye hain. Yahan woh jiya jaata hai.", "You came from the book. Here it is lived.");
    else if (d.k === "p") from = P("Aap Parichay se aaye hain.", "You came from the intro film.");
  }
  const note = n === 1 ? `<p class="fine">${P("Koi login nahi. Jo aap likhenge, isi phone mein rahega. Paanch minute.", "No login. What you write stays on this phone. Five minutes.")}</p>` : "";
  return `${bar(n, { t: "intro" })}<div class="stage">
    <p class="eyebrow">${n === 1 ? "Neev" : eyebrow(n)}</p>
    ${from ? `<p class="from">${esc(from)}</p>` : ""}
    <h1 class="q">${esc(line)}</h1>
    <p class="lead">${esc(T(l.lead))}</p>${note}
    <button class="btn" data-a="next">${P("Shuru karein", "Begin")}</button></div>`;
}

function nameChips() {
  const names = S.people.filter((p) => !p.gone).slice(-8);
  return names.length ? `<div class="chips">${names.map((p) => `<button class="chip" data-a="fill" data-v="${esc(p.name)}">${esc(p.name)}</button>`).join("")}</div>` : "";
}

function vFirst() {
  return `${bar(1, step())}<div class="stage">
    <p class="eyebrow">${P("Raat ke 2:40", "2:40 a.m.")}</p>
    <h1 class="q">${P("Raat ke 2:40 baje hain. Kuch ho gaya hai. Sabse pehle kiska naam yaad aata hai?", "It is 2:40 a.m. Something has happened. Whose name comes first?")}</h1>
    <p class="lead">${P("Sochiye mat. Jo naam pehle aaya, wahi.", "Don't think. The name that came first.")}</p>
    <label class="lab" for="nm">${P("Naam", "Name")}</label>
    <input id="nm" class="in" autocomplete="off" maxlength="40" value="${esc(S.first)}" placeholder="${P("Ek naam", "One name")}">
    ${V.err ? `<p class="err" role="alert">${esc(V.err)}</p>` : ""}
    <button class="btn" data-a="firstNext">${P("Aage", "Next")}</button>
    <button class="ghost" data-a="firstNone">${P("Koi naam nahi aaya", "No name came")}</button></div>`;
}

function vSeat(st) {
  const s = SEAT[st.id], n = S.flow.layer, cur = S.seats[s.id] || {};
  const ring = s.kind === "role" ? ` · ${T(RING[s.ring])}` : "";
  return `${bar(n, st)}<div class="stage">
    <p class="eyebrow place">${icon(s.place)}${esc(T(PLACE[s.place]))}${esc(ring)}</p>
    <h1 class="q">${esc(T(s.q))}</h1>
    ${s.ref ? `<p class="ref">${esc(T(s.ref))}</p>` : ""}
    <label class="lab" for="nm">${P("Naam", "Name")}</label>
    <input id="nm" class="in" autocomplete="off" maxlength="40" value="${esc(cur.p ? pname(cur.p) : "")}" placeholder="${P("Ek naam", "One name")}">
    ${nameChips()}
    <label class="lab" for="wd">${P("Aap inhe kya kehte hain? Apne shabdon mein.", "What do you call them? In your own words.")}</label>
    <input id="wd" class="in hand" autocomplete="off" maxlength="60" value="${esc(cur.w || "")}" placeholder="${esc(T(s.chips)[0])}">
    <div class="chips">${T(s.chips).map((c) => `<button class="chip soft" data-a="fillw" data-v="${esc(c)}">${esc(c)}</button>`).join("")}</div>
    ${V.err ? `<p class="err" role="alert">${esc(V.err)}</p>` : ""}
    <button class="btn" data-a="seatNext">${P("Aage", "Next")}</button>
    <button class="ghost" data-a="seatNone">${P("Abhi koi nahi", "No one right now")}</button></div>`;
}

function vHold(st) {
  const p = PLACE[st.id], cur = (S.held[p.id] || []).map(pname).join(", ");
  return `${bar(3, st)}<div class="stage">
    <p class="eyebrow place">${icon(p.id)}${esc(T(p))} · ${P("ulti taraf", "the other side")}</p>
    <h1 class="q">${esc(T(p.mine))}</h1>
    <p class="ref">${P("Ek se zyada naam ho sakte hain. Comma lagakar likhiye.", "There can be more than one name. Separate them with commas.")}</p>
    <label class="lab" for="nm">${P("Naam", "Names")}</label>
    <input id="nm" class="in" autocomplete="off" maxlength="160" value="${esc(cur)}" placeholder="${P("Naam, naam", "Name, name")}">
    ${nameChips().replace(/data-a="fill"/g, 'data-a="fillAdd"')}
    <button class="btn" data-a="holdNext">${P("Aage", "Next")}</button>
    <button class="ghost" data-a="holdNone">${P("Abhi kisi ke liye nahi", "For no one right now")}</button></div>`;
}

function ringPick(p) {
  return `<div class="seg" role="group" aria-label="${esc(p.name)}">${RINGS.map((r) => `<button data-a="ring" data-v="${p.id}:${r.id}" aria-pressed="${p.ring === r.id}">${esc(T(r))}</button>`).join("")}</div>`;
}
function vSort() {
  const list = S.people.filter((p) => !p.gone && (!p.ring || V.sorting));
  V.sorting = true;
  return `${bar(2, step())}<div class="stage">
    <p class="eyebrow">${P("Teen ghere", "Three circles")}</p>
    <h1 class="q">${P("Yeh log aaj kis ghere mein hain?", "Which circle are these people in today?")}</h1>
    <p class="lead">${P("Aaj ki baat hai. Ghere badalte hain: aaj ki rasoi kal ka aangan ho sakti hai. Aap kabhi bhi badal sakte hain.", "Only for today. Circles move: today's kitchen may be tomorrow's courtyard. You can change this any time.")}</p>
    <div class="rows">${list.map((p) => `<div class="row col"><b>${esc(p.name)}</b>${ringPick(p)}</div>`).join("")}</div>
    <button class="btn" data-a="next">${P("Aage", "Next")}</button></div>`;
}

function seatLine(id) {
  const s = SEAT[id], cur = S.seats[id];
  if (!cur) return "";
  if (cur.none) return `<div class="row empty"><span class="tag">${icon(s.place)}${esc(T(PLACE[s.place]))}</span><p>${P("Yeh jagah abhi khaali hai.", "This place is empty for now.")}</p>
    <p class="doors">${P("Do darwaze: kaun yahan tak aa sakta hai? Aur aap kiske liye yeh jagah ban sakte hain?", "Two doors: who could grow into it? And for whom could you be this place?")}</p></div>`;
  return `<div class="row"><span class="tag">${icon(s.place)}${esc(T(PLACE[s.place]))}</span>
    <p class="word">${esc(cur.w || T(s.chips)[0])}</p><p class="who">${esc(pname(cur.p))}</p></div>`;
}
function findingLines() {
  return L.findings(S, PLACE_IDS).map((f) => {
    if (f.k === "load") return P(`${pname(f.p)} aapki ${f.of} mein se ${f.n} jagahein sambhal rahe hain. Itna bojh ek insaan par hai.`, `${pname(f.p)} holds ${f.n} of your ${f.of} places. That is a lot for one person to carry.`);
    if (f.k === "empty") return P(`${f.seats.length} jagah abhi khaali hai. Khaali jagah kami nahi, khula darwaza hai.`, `${f.seats.length} place${f.seats.length > 1 ? "s are" : " is"} empty for now. An empty place is an open door, not a lack.`);
    const names = f.places.map((id) => T(PLACE[id])).join(", ");
    if (f.k === "take") return P(`${names}: yeh aapko milta hai, par aap abhi kisi ke liye yeh jagah nahi hain.`, `${names}: you receive this, and you are not yet this place for anyone.`);
    return P(`${names}: yeh aap dete hain, par aapko abhi kisi se nahi milta.`, `${names}: you give this, and nobody gives it to you yet.`);
  });
}
function vMirror() {
  const n = S.flow.layer, l = LAYER[n];
  let body;
  if (n === 3) {
    body = PLACES.map((p) => { const ids = S.held[p.id] || [];
      return `<div class="row${ids.length ? "" : " empty"}"><span class="tag">${icon(p.id)}${esc(T(p))}</span><p class="who big">${ids.length ? esc(ids.map(pname).join(", ")) : P("Abhi kisi ke liye nahi.", "For no one yet.")}</p></div>`; }).join("");
  } else body = steps(n).filter((x) => x.t === "seat").map((x) => seatLine(x.id)).join("");
  const f = findingLines();
  return `${bar(n, step())}<div class="stage">
    <p class="eyebrow">${eyebrow(n)}</p><h1 class="q">${esc(T(l.mirror))}</h1>
    <div class="rows">${body}</div>
    ${f.length ? `<div class="seen"><p class="eyebrow">${P("Jo dikha", "What showed up")}</p>${f.map((x) => `<p>${esc(x)}</p>`).join("")}</div>` : ""}
    <p class="fine">${P("Yeh aapke shabd hain. Kisi ne aapko yeh nahi bataya.", "These are your words. Nobody told you this.")}</p>
    <button class="btn" data-a="next">${P("Aage", "Next")}</button></div>`;
}

function actBody(a, inFlow) {
  const l = LAYER[a.layer];
  const first = a.layer === 1 && S.first ? `<p class="who big">${esc(S.first)}</p>` : "";
  const msg = l.msg ? `<div class="msg"><p id="msg${a.layer}">${esc(T(l.msg))}</p><div class="pair">
      <button class="mini" data-a="copy" data-v="${esc(T(l.msg))}">${P("Copy karein", "Copy")}</button>
      <a class="mini" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(T(l.msg))}">WhatsApp ↗</a></div></div>` : "";
  const tell = a.layer === 2 ? `<button class="btn alt" data-a="pickTell">${P("Kise batayenge? Chuniye", "Whom will you tell? Choose")}</button>` : "";
  const gone = a.layer === 1 ? `<button class="ghost" data-a="gone">${P("Woh ab nahi rahe", "They are gone")}</button>` : "";
  return `<p class="eyebrow">${P("Is parat ka kaam", "This layer's act")} · ${esc(T(l))}</p>
    <h2 class="act">${esc(T(l.act))}</h2>${first}${msg}${tell}
    <label class="lab" for="note${a.layer}">${P("Ek line apne liye (chahein toh)", "One line for yourself (if you like)")}</label>
    <input id="note${a.layer}" class="in hand" maxlength="140" value="${esc(a.note)}" placeholder="${P("Kya hua?", "What happened?")}">
    <button class="btn" data-a="done" data-v="${a.layer}">${P("Ho gaya", "Done")}</button>
    ${inFlow ? `<button class="ghost" data-a="later">${P("Aaj nahi ho paaya, baad mein", "Not today, later")}</button>` : ""}${gone}`;
}
function vAct() {
  const n = S.flow.layer, a = ensureAct(n);
  return `${bar(n, step())}<div class="stage">
    <p class="lead">${P("Naqsha kaagaz hai. Yeh kaam asli hai. Agli parat isi se khulegi, ya 24 ghante mein.", "The map is paper. This act is real. It opens the next layer, or 24 hours will.")}</p>
    ${actBody(a, true)}</div>`;
}

/* ---------- home ---------- */
function vAaj() {
  const done = L.lastLayerDone(S), next = done + 1, now = Date.now();
  const pending = S.acts.filter((a) => !a.doneAt && S.layers[a.layer] && S.layers[a.layer].doneAt);
  const filled = Object.values(S.seats).filter((s) => s.p).length;
  let nextCard;
  if (S.flow) nextCard = `<div class="card"><p class="eyebrow">${eyebrow(S.flow.layer)}</p><p>${P("Aapne yeh parat beech mein chhodi thi.", "You left this layer midway.")}</p><button class="btn" data-a="resume">${P("Wahin se shuru karein", "Pick up where you left")}</button></div>`;
  else if (!LAYER[next]) nextCard = `<div class="card quiet"><p class="eyebrow">${P("Aage", "Ahead")}</p><p>${esc(T(NEXT))}</p></div>`;
  else if (L.layerOpen(S, next, now)) nextCard = `<div class="card open"><p class="eyebrow">${P("Agli parat khul gayi", "The next layer is open")}</p><h2 class="h2">${esc(T(LAYER[next].q))}</h2><p class="lead">${esc(T(LAYER[next]))} · ${esc(T(LAYER[next].lead))}</p><button class="btn" data-a="start" data-v="${next}">${P("Shuru karein", "Begin")}</button></div>`;
  else { const h = L.hoursLeft(S, next, now);
    nextCard = `<div class="card quiet"><p class="eyebrow">${P("Agli parat", "The next layer")} · ${esc(T(LAYER[next]))}</p><p>${P(`Aaj ka kaam poora karte hi khulegi, ya ${h} ghante mein. Parat ek shaam mein nahi khulti.`, `It opens when today's act is done, or in ${h} hours. A layer does not open in one evening.`)}</p></div>`; }
  return `<div class="home">
    <p class="lead">${P(`Aapke naqshe mein ${S.people.length} log hain, ${filled} jagah bhari.`, `Your map has ${S.people.length} people and ${filled} places filled.`)}</p>
    ${pending.map((a) => `<div class="card">${actBody(a, false)}</div>`).join("")}
    ${nextCard}
    <div class="card quiet"><p class="eyebrow">${P("Kisi aur ko dikhaiye", "Show someone")}</p>
      <p>${P("Apne naqshe ki shakal bhejiye. Bina kisi naam ke.", "Send the shape of your map. With no names on it.")}</p>
      <button class="mini" data-a="shape">${P("Shakal dekhiye", "See the shape")}</button></div></div>`;
}
function vDiary() {
  const done = S.acts.filter((a) => a.doneAt).sort((a, b) => b.doneAt - a.doneAt);
  if (!done.length) return `<div class="home"><h1 class="q">${P("Diary", "Diary")}</h1><p class="lead">${P("Abhi koi panna nahi bhara. Pehla kaam Aaj mein rakha hai. Har kaam ek panna banta hai.", "No page is filled yet. Your first act is waiting under Today. Each act becomes a page.")}</p></div>`;
  const d = (t) => new Date(t).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  return `<div class="home"><h1 class="q">${P("Diary", "Diary")}</h1>${done.map((a) => `<div class="page"><p class="eyebrow">${esc(d(a.doneAt))} · ${esc(T(LAYER[a.layer]))}</p>
    <p>${esc(a.kind === "gone" ? P("Jo ab nahi rahe, unke liye ek line likhi aur rakh li.", "Wrote a line for someone who is gone, and kept it.") : T(LAYER[a.layer].act))}</p>${a.note ? `<p class="word">${esc(a.note)}</p>` : ""}</div>`).join("")}</div>`;
}

function mapSvg(counts) {
  const R = { rasoi: [38, 76, 57], aangan: [76, 120, 98], mohalla: [120, 160, 140] };
  let dots = "", rings = "";
  RINGS.forEach((r, k) => {
    rings += `<circle cx="170" cy="170" r="${R[r.id][1]}" class="ringline"/><text x="170" y="${170 - R[r.id][1] + 12}" class="ringname">${esc(T(r))}</text>`;
    const ppl = counts ? Array.from({ length: Math.min(counts[k], 60) }, () => null) : S.people.filter((p) => p.ring === r.id && !p.gone);
    ppl.forEach((p, i) => {
      const a = (-90 + 28 * k + (360 / ppl.length) * i) * Math.PI / 180, x = 170 + R[r.id][2] * Math.cos(a), y = 170 + R[r.id][2] * Math.sin(a) + 6;
      dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${counts ? 4 : 5}" class="dot d${k}"/>`;
      if (p && ppl.length <= 9) dots += `<text x="${x.toFixed(1)}" y="${(y + 15).toFixed(1)}" class="dotname">${esc(p.name.split(" ")[0].slice(0, 9))}</text>`;
    });
  });
  return `<svg class="map" viewBox="0 0 340 340" role="img" aria-label="${P("Aapka naqsha: teen ghere", "Your map: three circles")}">${rings}<circle cx="170" cy="170" r="20" class="self"/><text x="170" y="174" class="selfname">${P("Aap", "You")}</text>${dots}</svg>`;
}
function vNaksha() {
  const f = findingLines();
  const group = (label, list) => list.length ? `<p class="eyebrow gap">${esc(label)} · ${list.length}</p><div class="rows">${list.map((p) => {
    const words = Object.entries(S.seats).filter(([, s]) => s.p === p.id).map(([id, s]) => s.w || T(SEAT[id].chips)[0]);
    return `<button class="row tap" data-a="person" data-v="${p.id}"><b>${esc(p.name)}</b><span class="word sm">${esc(words.join(" · "))}</span></button>`; }).join("")}</div>` : "";
  const live = S.people.filter((p) => !p.gone);
  return `<div class="home"><h1 class="q">${P("Naqsha", "Map")}</h1>${mapSvg()}
    ${f.length ? `<div class="seen"><p class="eyebrow">${P("Jo dikha", "What showed up")}</p>${f.map((x) => `<p>${esc(x)}</p>`).join("")}</div>` : ""}
    ${RINGS.map((r) => group(T(r), live.filter((p) => p.ring === r.id))).join("")}
    ${group(P("Ghera abhi tay nahi", "Circle not chosen yet"), live.filter((p) => !p.ring))}
    ${group(P("Jo ab nahi rahe", "Those who are gone"), S.people.filter((p) => p.gone))}
    <p class="fine">${P("Ginti maayne nahi rakhti. Ghere maayne rakhte hain, aur log gheron mein chalte rehte hain.", "The counts don't matter. The circles do, and people keep moving between them.")}</p></div>`;
}

/* ---------- sheets ---------- */
function base() { try { return /claude|anthropic|localhost|^$/.test(location.hostname) || location.protocol === "file:" ? SITE : location.origin; } catch { return SITE; } }
const cardUrl = (c) => `${base()}/?c=${L.encodeCard(c)}`;
function shareBox(text, url) {
  const full = `${text} ${url}`;
  return `<div class="msg"><p>${esc(text)}</p><p class="url">${esc(url)}</p><div class="pair">
    <button class="mini" data-a="copy" data-v="${esc(full)}">${P("Copy karein", "Copy")}</button>
    <a class="mini" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(full)}">WhatsApp ↗</a>
    ${navigator.share ? `<button class="mini" data-a="native" data-v="${esc(full)}">${P("Bhejiye", "Share")}</button>` : ""}</div></div>`;
}
const meField = () => `<label class="lab" for="me">${P("Aapka pehla naam (chahein toh)", "Your first name (if you like)")}</label><input id="me" class="in" maxlength="24" value="${esc(S.me)}" data-live="me">`;

function sheet() {
  const s = V.sheet; if (!s) return "";
  let body = "";
  if (s.k === "gate") body = `<h2 class="h2">${P("Abhi kisi insaan se baat kijiye", "Talk to a person now")}</h2>
    <p class="lead">${P("Neev ek app hai. Yeh mushkil ghadi mein kaafi nahi. Yeh log abhi phone uthayenge.", "Neev is an app. It is not enough in a hard hour. These people will pick up now.")}</p>
    ${HELP.map((h) => `<div class="help"><b>${esc(T(h.name))}</b><a href="tel:${h.number}" class="num">${h.number}</a>${h.note ? `<span>${esc(T(h.note))}</span>` : ""}</div>`).join("")}
    <p class="fine">${P("Number dabaane se call na lage toh khud dial kijiye.", "If tapping does not place the call, dial the number yourself.")}</p>`;
  if (s.k === "person") { const p = L.person(S, s.id);
    const seats = Object.entries(S.seats).filter(([, x]) => x.p === p.id);
    body = `<h2 class="h2">${esc(p.name)}</h2>
      ${seats.map(([id, x]) => `<div class="row"><span class="tag">${icon(SEAT[id].place)}${esc(T(PLACE[SEAT[id].place]))}</span><p class="word">${esc(x.w || T(SEAT[id].chips)[0])}</p>
        ${p.gone ? "" : `<button class="mini" data-a="tell" data-v="${id}">${P("Inhe bataiye", "Tell them")}</button>`}</div>`).join("")}
      ${p.gone ? "" : `<p class="lab">${P("Aaj kis ghere mein hain?", "Which circle today?")}</p>${ringPick(p)}`}
      <button class="ghost" data-a="toggleGone" data-v="${p.id}">${p.gone ? P("Yeh galti se laga tha", "That was marked by mistake") : P("Woh ab nahi rahe", "They are gone")}</button>`; }
  if (s.k === "pick") { const seats = Object.entries(S.seats).filter(([, x]) => x.p && !L.person(S, x.p).gone);
    body = `<h2 class="h2">${P("Kise batayenge?", "Whom will you tell?")}</h2><div class="rows">${seats.map(([id, x]) => `<button class="row tap" data-a="tell" data-v="${id}"><b>${esc(pname(x.p))}</b><span class="word sm">${esc(x.w || T(SEAT[id].chips)[0])}</span></button>`).join("")}</div>`; }
  if (s.k === "tell") { const x = S.seats[s.id], w = x.w || T(SEAT[s.id].chips)[0];
    const url = cardUrl({ k: "t", w, s: s.id, f: S.me });
    body = `<h2 class="h2">${P(`${pname(x.p)} ko bataiye`, `Tell ${pname(x.p)}`)}</h2>
      <p class="lead">${P("Unhe sirf yeh ek naam dikhega. Aapka naqsha nahi, koi aur naam nahi.", "They will see only this one name. Not your map, and no one else's name.")}</p>
      ${meField()}${shareBox(P(`Maine apna naqsha banaya: kaun mere liye kya hai. Aapko maine yeh likha hai: "${w}".`, `I drew my map of who is what to me. For you I wrote: "${w}".`), url)}
      <button class="ghost" data-a="preview" data-v="${esc(L.encodeCard({ k: "t", w, s: s.id, f: S.me }))}">${P("Unhe kya dikhega, dekhiye", "See what they will see")}</button>`; }
  if (s.k === "shape") { const c = RINGS.map((r) => S.people.filter((p) => p.ring === r.id && !p.gone).length);
    const card = { k: "s", c, e: Object.values(S.seats).filter((x) => x.none).length, f: S.me };
    body = `<h2 class="h2">${P("Aapke naqshe ki shakal", "The shape of your map")}</h2>${mapSvg(c)}
      <p class="lead">${P("Sirf shakal jaati hai. Koi naam nahi.", "Only the shape travels. No names.")}</p>
      ${meField()}${shareBox(P("Maine apna naqsha banaya: teen ghere, aur kaun mere liye kya hai. Aap bhi banaiye.", "I drew my map: three circles, and who is what to me. Draw yours."), cardUrl(card))}
      <button class="ghost" data-a="preview" data-v="${esc(L.encodeCard(card))}">${P("Unhe kya dikhega, dekhiye", "See what they will see")}</button>`; }
  if (s.k === "gone") body = `<h2 class="h2">${P("Unhe ek line likhiye, aur rakh lijiye.", "Write them one line, and keep it.")}</h2>
      <p class="lead">${P("Jo chale gaye, woh bhi aapki neev mein hain.", "Those who are gone are in your foundation too.")}</p>
      <input id="goneLine" class="in hand" maxlength="140" placeholder="${P("Ek line", "One line")}"><button class="btn" data-a="goneKeep">${P("Rakh lijiye", "Keep it")}</button>`;
  return `<div class="veil" data-a="close"></div><div class="sheet" role="dialog" aria-modal="true"><button class="x" data-a="close" aria-label="${P("Band karein", "Close")}">×</button>${body}</div>`;
}

function vCard() {
  const c = V.card, who = c.f || P("Kisi ne", "Someone");
  const cta = `<p class="ask">${P("Aap unke kis ghere mein hain? Yeh app nahi batayega. Unse poochhiye.", "Which of their circles are you in? This app will not say. Ask them.")}</p>
    <button class="btn" data-a="closeCard">${V.preview ? P("Wapas", "Back") : P("Apna naqsha banaiye", "Draw your own map")}</button>`;
  if (c.k === "t") { const s = SEAT[c.s];
    return `<div class="stage card-view"><p class="eyebrow">Neev</p><p class="lead">${esc(P(`${who} ne apne naqshe mein aapko yeh likha hai`, `${who} wrote this for you on their map`))}</p>
      <p class="bigword">${esc(c.w)}</p><p class="eyebrow place">${icon(s.place)}${esc(T(PLACE[s.place]))}</p><p class="ref">${esc(T(s.q))}</p>${cta}</div>`; }
  return `<div class="stage card-view"><p class="eyebrow">Neev</p><p class="lead">${esc(P(`${who === "Kisi ne" ? "Kisi" : who} ka naqsha. Bina naam ke.`, `${c.f || "Someone"}'s map. Without the names.`))}</p>${mapSvg(c.c)}
    <p class="ref">${RINGS.map((r, i) => `${esc(T(r))} ${c.c[i]}`).join(" · ")}${c.e ? ` · ${P(`${c.e} jagah khaali`, `${c.e} empty`)}` : ""}</p>${cta}</div>`;
}

/* ---------- render ---------- */
function render() {
  const home = !S.flow || V.homeView;
  let main;
  if (V.card) main = vCard();
  else if (!home) { const st = step(); main = st.t === "intro" ? vIntro(S.flow.layer) : st.t === "first" ? vFirst() : st.t === "seat" ? vSeat(st) : st.t === "hold" ? vHold(st) : st.t === "sort" ? vSort() : st.t === "mirror" ? vMirror() : vAct(); }
  else main = V.tab === "diary" ? vDiary() : V.tab === "naksha" ? vNaksha() : vAaj();
  const tabs = home && !V.card ? `<nav class="tabs">${[["aaj", P("Aaj", "Today")], ["diary", "Diary"], ["naksha", P("Naksha", "Map")]].map(([id, t]) => `<button data-a="tab" data-v="${id}" ${V.tab === id ? 'aria-current="page"' : ""}>${t}</button>`).join("")}</nav>` : "";
  document.getElementById("app").innerHTML = `<header class="top"><span class="mark">Neev</span>
      <button class="pill" data-a="lang" aria-label="${P("Switch to English", "Hinglish mein dekhiye")}">${S.lang === "en" ? "Hinglish" : "English"}</button></header>
    <main id="scroll">${main}</main>${V.hint ? `<div class="toast" role="status">${esc(V.hint)}</div>` : ""}${tabs}
    <button class="gatebar" data-a="gate"><span>${P("Abhi mushkil mein hain?", "In a hard moment right now?")}</span><b>Tele-MANAS 14416</b></button>${sheet()}`;
  document.documentElement.lang = S.lang === "en" ? "en" : "hi-Latn";
}
function toast(t) { V.hint = t; render(); setTimeout(() => { V.hint = ""; render(); }, 2200); }
function guard(...texts) { if (texts.some((t) => L.gateHit(t))) { V.sheet = { k: "gate" }; render(); return true; } return false; }

const A = {
  lang() { S.lang = S.lang === "en" ? "hi" : "en"; save(); render(); },
  gate() { V.sheet = { k: "gate" }; render(); },
  close() { V.sheet = null; render(); },
  tab(v) { V.tab = v; render(); $("#scroll").scrollTop = 0; },
  next() { V.sorting = false; go(1); }, back() { V.sorting = false; go(-1); },
  home() { V.homeView = true; V.tab = "aaj"; render(); },
  resume() { V.homeView = false; render(); },
  start(v) { S.flow = { layer: +v, i: 0 }; V.homeView = false; save(); render(); },
  fill(v) { const e = $("#nm"); e.value = v; e.focus(); },
  fillAdd(v) { const e = $("#nm"); const cur = e.value.split(",").map((x) => x.trim()).filter(Boolean); if (!cur.some((x) => L.norm(x) === L.norm(v))) cur.push(v); e.value = cur.join(", "); },
  fillw(v) { const e = $("#wd"); e.value = v; e.focus(); },
  firstNext() { const n = L.clean(val("nm")); if (guard(n)) return; if (!n) { V.err = P("Ek naam likhiye, ya neeche wala button dabaiye.", "Write one name, or use the button below."); return render(); } S.first = n; L.personFor(S, n); go(1); },
  firstNone() { S.first = ""; go(1); },
  seatNext() { const st = step(), n = L.clean(val("nm")), w = L.clean(val("wd"), 60); if (guard(n, w)) return;
    if (!n) { V.err = P("Ek naam likhiye, ya \"Abhi koi nahi\" dabaiye.", "Write one name, or choose \"No one right now\"."); return render(); }
    const s = SEAT[st.id]; S.seats[st.id] = { p: L.personFor(S, n, s.kind === "role" ? s.ring : null), w, none: false }; go(1); },
  seatNone() { S.seats[step().id] = { p: null, w: "", none: true }; go(1); },
  holdNext() { const raw = val("nm"); if (guard(raw)) return; S.held[step().id] = [...new Set(raw.split(",").map((x) => L.personFor(S, x)).filter(Boolean))].slice(0, 12); go(1); },
  holdNone() { S.held[step().id] = []; go(1); },
  ring(v) { const [id, r] = v.split(":"); L.person(S, id).ring = r; save(); render(); },
  later() { finishLayer(); },
  done(v) { const a = ensureAct(+v), note = L.clean(val("note" + v), 140); if (guard(note)) return; a.note = note; a.doneAt = Date.now(); save();
    if (S.flow && S.flow.layer === +v && !V.homeView) finishLayer(); else render(); toast(P("Diary mein ek panna bhar gaya.", "A page is filled in your diary.")); },
  gone() { V.sheet = { k: "gone" }; render(); },
  goneKeep() { const t = L.clean(val("goneLine"), 140); if (guard(t)) return; const a = ensureAct(1); a.kind = "gone"; a.note = t; a.doneAt = Date.now();
    const p = S.people.find((x) => L.norm(x.name) === L.norm(S.first)); if (p) p.gone = true; V.sheet = null; save(); if (S.flow && !V.homeView) finishLayer(); else render(); },
  person(v) { V.sheet = { k: "person", id: v }; render(); },
  toggleGone(v) { const p = L.person(S, v); p.gone = !p.gone; save(); render(); },
  pickTell() { V.sheet = { k: "pick" }; render(); },
  tell(v) { V.sheet = { k: "tell", id: v }; render(); },
  shape() { V.sheet = { k: "shape" }; render(); },
  preview(v) { V.back = V.sheet; V.sheet = null; V.preview = true; V.card = L.decodeCard(v, SEAT_IDS); render(); },
  closeCard() { V.card = null; if (V.preview) { V.sheet = V.back; V.preview = false; } else { try { history.replaceState(null, "", location.pathname); } catch {} } render(); },
  copy(v) { const ok = () => toast(P("Copy ho gaya.", "Copied.")); try { navigator.clipboard.writeText(v).then(ok, () => toast(P("Copy nahi hua. Text ko dabaakar chuniye.", "Could not copy. Press and select the text."))); } catch { toast(P("Copy nahi hua. Text ko dabaakar chuniye.", "Could not copy. Press and select the text.")); } },
  native(v) { try { navigator.share({ text: v }).catch(() => {}); } catch {} },
};

document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-a]"); if (!t) return;
  const me = document.getElementById("me"); if (me) S.me = L.clean(me.value, 24);
  const f = A[t.dataset.a]; if (f) f(t.dataset.v);
});
document.addEventListener("change", (e) => { if (e.target.dataset.live === "me") { S.me = L.clean(e.target.value, 24); save(); render(); } });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && V.sheet) return A.close();
  if (e.key === "Enter" && e.target.matches("input") && !V.sheet) { const b = $(".stage .btn"); if (b) b.click(); }
});

(function boot() {
  try {
    const c = new URLSearchParams(location.search).get("c");
    if (c) V.card = L.decodeCard(c, SEAT_IDS);
    const d = L.doorFrom(location.pathname, location.search);
    if (d && !S.door && !L.lastLayerDone(S)) { S.door = d; save(); }
    if ("serviceWorker" in navigator && location.protocol === "https:" && !/claude|anthropic/.test(location.hostname)) navigator.serviceWorker.register("/sw.js").catch(() => {});
  } catch {}
  render();
})();
