/* Neev v3 · core: state, words, layers, people, map, AI pipeline */
var N = window.NEEV;
var KEY = "neev.proto.v3";
var mem = null;

function fresh() {
  return {
    lang: "en", tier: "t0", lastOpen: null, pin: "",
    look: { started: false, th: 0, L: 1, s: 0, a: {}, done: [], unlocked: false, finished: null, fromEp: 0, soft: false, tenderLater: false },
    over: {}, groups: {}, keep: {}, aliases: {},
    extra: [], walk: [], kept: [], dates: [],
    snap: null, start: null, today: null, done: [], vessels: [],
    plan: { signs: "", p1: "", p2: "", say: "", place: "" },
    checkins: {}, nudgeOff: {}, nudgeSeen: {}, rhythmDay: 0,
    cell: null, tasks: {}, raatDraft: ""
  };
}
function load() {
  var s = null;
  try { s = JSON.parse(window.localStorage.getItem(KEY) || "null"); } catch (e) { s = mem; }
  var f = fresh(); if (!s) return f;
  for (var k in f) if (!(k in s)) s[k] = f[k];
  for (var k2 in f.look) if (!(k2 in s.look)) s.look[k2] = f.look[k2];
  return s;
}
function save() { mem = S; try { window.localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
var S = load();
var SIM = { hour: null, dayOffset: 0 };
var V = { route: "look", card: "look", tab: "web", rit: "mine", tog: "few", job: "settle", traces: [], felt: "", felt2: "", role: "tester", benchMsg: "", mapView: "now", sawaal: null, agenda: null, raatShown: false, merge: null, gateSeen: {}, pinIn: "", locked: false, ritual: null };

/* ---------- helpers ---------- */
function T(hi, en) { return S.lang === "hi" ? hi : en; }
function P(pair) { return pair ? (S.lang === "hi" ? pair[0] : pair[1]) : ""; }
function L(o) { if (o == null) return ""; if (typeof o === "string") return o; return o[S.lang] || o.en || o.hi || ""; }
function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
function $(s) { return document.querySelector(s); }
function now() { var d = new Date(Date.now() + SIM.dayOffset * 864e5); if (SIM.hour != null) d.setHours(SIM.hour, 40, 0, 0); return d; }
function nowMs() { return now().getTime(); }
function dstr(d) { d = d || now(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function weekKey(d) { d = new Date(d || now()); var day = (d.getDay() + 6) % 7; d.setDate(d.getDate() - day); return dstr(d); }
function hash32(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function uniq(a) { return a.filter(function (v, i, s) { return v && s.indexOf(v) === i; }); }
function list(arr) { arr = uniq(arr); if (!arr.length) return ""; if (arr.length === 1) return arr[0]; return arr.slice(0, -1).join(", ") + T(" aur ", " and ") + arr[arr.length - 1]; }
function isAre(arr) { return uniq(arr).length > 1 ? T("hain", "are") : T("hai", "is"); }
function vs(arr, one, many) { return uniq(arr).length > 1 ? many : one; }
function toast(msg) { var t = document.createElement("div"); t.className = "toast"; t.textContent = msg; t.setAttribute("role", "status"); $("#phone").appendChild(t); setTimeout(function () { t.remove(); }, 2600); }
function isNone(v) { return /^\s*(no|none|nothing|nobody|no one|na|nil|nahi|nahin|kuch nahi|koi nahi|-)\b/i.test(String(v || "")) || /\bnothing really\b/i.test(String(v || "")); }
var DAYS_HI = ["Itvaar", "Somvaar", "Mangalvaar", "Budhvaar", "Guruvaar", "Shukravaar", "Shanivaar"];
var DAYS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/* ---------- words ---------- */
var RING = {
  few: { name: ["Aapke apne", "Your few"], size: ["lagbhag 3 se 5 log", "about 3 to 5 people"] },
  circle: { name: ["Aapka daayra", "Your circle"], size: ["lagbhag 15 log", "about 15 people"] },
  village: { name: ["Aapka gaon", "Your village"], size: ["lagbhag 150 log", "about 150 people"] }
};
var JOBS = [
  { id: "settle", name: ["Sukoon", "Settle"], what: ["jinke paas aap shaant hote hain", "near whom you grow calm"], from: ["night"] },
  { id: "sharpen", name: ["Sach", "Sharpen"], what: ["jo sach bolte hain", "who tells you the truth"], from: ["truth"] },
  { id: "carry", name: ["Sahara", "Carry"], what: ["jo mushkil mein aate hain", "who comes when it's hard"], from: ["called"] },
  { id: "belong", name: ["Apnapan", "Belong"], what: ["jahan aap 'hum' hain", "where you're part of a 'we'"], from: ["weekly", "notice", "keeper"] },
  { id: "aim", name: ["Disha", "Aim"], what: ["jo raasta dikhate hain", "who shows you the way"], from: ["bigger", "taught", "gave"] }
];
var TERMS = {
  holding: [["Thaamna", "Holding"], ["Jab koi insaan aapke liye woh karta hai jo aap akele nahi kar sakte: sunna, sach bolna, aana, shaamil karna, raasta dikhana. Zyadatar thaamna dikhta nahi.", "When a person does for you what you can't do alone: listen, tell the truth, show up, include you, show the way. Most holding is invisible."]],
  web: [["Thaamne ka jaal", "Your web of holding"], ["Woh log, jagah aur cheezein jo aapko thaamti hain, aur jinhe aap thaamte hain. Yeh naksha woh dikhata hai jo aaj aapko yaad aaya. Yeh koi test ya score nahi hai.", "The people, places and things that hold you, and those you hold. The map shows what came to mind today. It is not a test or a score."]],
  few: [["Aapke apne", "Your few"], ["Woh 3 se 5 log jo sach mein aayenge. Rishton par research batata hai ki rishte parton mein hote hain: kuch bahut kareeb, phir lagbhag 15, phir lagbhag 150. Neev teen parten use karta hai. Jo naam ek hi baar aaya, woh 'shayad' hai, bindu wala.", "The 3 to 5 people who would actually come. Research on friendship networks finds layers: a very few close ones, then about 15, then about 150. Neev uses three. A name that came up only once is a dotted 'maybe'."]],
  circle: [["Aapka daayra", "Your circle"], ["Lagbhag 15 log jo aapko banate hain: sach bolne wale, sikhane wale, jinke saath aap badhte hain.", "About 15 people who shape you: the ones who tell the truth, teach you, and help you grow."]],
  village: [["Aapka gaon", "Your village"], ["Lagbhag 150 log jinhe aap chehre aur naam se jaante hain. Group bhi yahan rehte hain.", "About 150 people you know by face and name. Groups live here too."]],
  jobs: [["Paanch kaam", "Five things people do"], ["Log ek doosre ke liye paanch tarah ke kaam karte hain: Sukoon, Sach, Sahara, Apnapan, Disha. Yeh dono taraf chalta hai. Ek insaan sab nahi karta.", "People do five kinds of things for each other: Settle, Sharpen, Carry, Belong, Aim. It runs both ways, and nobody does all five."]],
  drift: [["Bhatakna", "Drift"], ["Rishte dheere door hote hain jab koi unhe uthaata nahi. Yeh normal hai. Rakhna ek chunav hai.", "Ties drift when nobody carries them. That's normal. Keeping is a choice."]],
  placeholder: [["Jagah lene wali cheez", "Placeholder"], ["Kuch cheezein thodi der thaamti hain par wapas phone nahi kar sakti: scroll, kaam, khaana. Woh buri nahi hain; bas dekhiye kab woh insaan ki jagah le rahi hain.", "Some things hold us for a while but can't call us back: scrolling, work, food. Not bad; just notice when they stand in for a person."]],
  vessel: [["Paatra", "Vessel"], ["Ek chhoti, baar-baar hone wali reet jo logon ke beech thaamna le jaati hai: waqt, jagah, cheez, shabd ya ishaara. Jab aap uska matlab bol dete hain, woh jaan-boojh kar ho jaati hai.", "A small, repeated form that carries holding between people: a time, a place, an object, a word or a gesture. Saying what it's for out loud makes it deliberate."]],
  both: [["Dono taraf", "Both ways"], ["Thaamna dono taraf chalta hai. Aap bhi kisi ke 'apne' hain.", "Holding runs both ways. You are someone's few too."]],
  kept: [["Jinhone rakha", "Kept by"], ["Chhoti cheezein jo kisi ne aapke liye kin, aur aapne dhyaan diya. Yeh hisaab nahi, shukriya ki diary hai.", "Small things someone did for you that you noticed. Not a ledger; a record of being held."]],
  test: [["Ek test", "The one test"], ["Har rishte, aadat aur app ke liye ek sawaal: iske baad main zyada sthir hoon, ya chhota?", "One question for every tie, habit or app: after this, am I steadier, or smaller?"]],
  ai: [["Yeh AI kya karta hai", "What this app's AI does"], ["Yeh aapke liye shabd dhoondhta hai, anuvaad karta hai, aapka naksha padh ke sunata hai, aur sahi kaam chunta hai. Yeh aapse baat nahi karta, salah nahi deta, aur kabhi dost hone ka dikhava nahi karta. Har baar aapko ek insaan tak le jaata hai.", "It finds words, translates, reads your map back and picks a fitting act. It does not chat, advise or pretend to be a friend. Every time, it points you to a person."]]
};
function term(k, label) { return '<button class="term" data-a="term" data-k="' + k + '">' + esc(label || P(TERMS[k][0])) + "</button>"; }

/* ---------- the ten layers ---------- */
var LAYERS = [
  { n: 1, id: "first", min: 1, title: ["Pehla naam", "The first name"], open: ["Ek sawaal se shuru karte hain.", "Let's begin with one question."],
    qs: [{ id: "first", type: "names", tag: "first", q: ["Is pal, sabse pehle kiska naam yaad aata hai? Koi bhi.", "Right now, whose name comes to mind first? Anyone."] }] },
  { n: 2, id: "hands", min: 2, title: ["Haath", "The hands"], open: ["Kisi apne ki baat se pehle, ek mamooli cheez: aaj ki subah.", "Before anyone you love, something ordinary: this morning."],
    qs: [
      { id: "food", type: "text", q: ["Aaj sabse pehle aapne kya khaaya ya piya?", "What was the first thing you ate or drank today?"], ph: ["paani, chai, roti", "water, coffee, bread"] },
      { id: "made", type: "choice", q: ["Woh kisne banaya?", "Who made it?"], opts: [["self", "Maine khud", "I did"], ["home", "Ghar mein kisi ne", "Someone at home"], ["bought", "Kharida", "I bought it"], ["given", "Kisi ne diya", "Someone gave it to me"], ["dk", "Yaad nahi", "I don't remember"]] },
      { id: "hands", type: "choice", q: ["Khet se aapke haath tak, kitne logon ka kaam laga hoga?", "From the field to your hand, how many people's work went into it?"], opts: [["a", "1 se 5", "1 to 5"], ["b", "6 se 20", "6 to 20"], ["c", "21 se 100", "21 to 100"], ["d", "100 se zyada", "More than 100"]] },
      { id: "seen", type: "names", tag: "hand", q: ["Aaj kiske haath aapne sach mein dekhe? Naam, ya woh kaun hain.", "Whose hands did you actually notice today? A name, or who they are."] }
    ] },
  { n: 3, id: "few", min: 3, title: ["Aapke apne", "Your few"], open: ["Ab woh sawaal jo shayad aapne khud se kabhi nahi poocha.", "Now the questions you may never have asked yourself."],
    qs: [
      { id: "night", type: "names", tag: "night", q: ["Haal mein jab neend nahi aayi, sabse pehle kiska naam yaad aaya?", "The last time you couldn't sleep, whose name came to mind?"] },
      { id: "called", type: "names", tag: "called", q: ["Pichhli baar jab sach mein mushkil thi, aapne asal mein kisko bataya?", "The last time life was really hard, who did you actually tell?"] },
      { id: "notice", type: "names", tag: "notice", q: ["Agar aap ek hafte chup ho jaayein, kaun sabse pehle notice karega?", "If you went quiet for a week, who would notice first?"] },
      { id: "would", type: "names", tag: "would", q: ["Kise aap phone karna chahte hain, par abhi tak kiya nahi?", "Who would you like to call, but haven't yet?"] }
    ] },
  { n: 4, id: "village", min: 3, title: ["Aapka hafta aur gaon", "Your week and village"], open: ["Woh cheezein jo bina plan ke hoti hain.", "The things that happen without a plan."],
    qs: [
      { id: "weekly", type: "names", tag: "weekly", q: ["Lagbhag har hafte, bina plan, aap kisse baat karte hain?", "Who do you talk to almost every week, without planning it?"] },
      { id: "place", type: "text", q: ["Koi jagah jahan log aapko naam se jaante hain?", "Is there a place where people know you by name?"], ph: ["dukaan, gate, gym, mandir-masjid-church", "a shop, a gate, a gym, a place of worship"] },
      { id: "ritual", type: "text", q: ["Kaunsi reet aap pehle se nibhate hain, kisi ke saath? Hafte ka khaana, prarthana, ek call.", "Is there a ritual you already keep with someone? A weekly meal, a prayer, a call."], ph: ["Itvaar ka khaana, Maa ke saath", "Sunday lunch with my parents"] },
      { id: "quiet", type: "choice", q: ["Hafte ka kaunsa din sabse khaali lagta hai?", "Which day of the week feels emptiest?"], opts: [["1", "Somvaar", "Monday"], ["2", "Mangalvaar", "Tuesday"], ["3", "Budhvaar", "Wednesday"], ["4", "Guruvaar", "Thursday"], ["5", "Shukravaar", "Friday"], ["6", "Shanivaar", "Saturday"], ["0", "Itvaar", "Sunday"], ["none", "Koi nahi", "None of them"]] }
    ] },
  { n: 5, id: "shape", min: 3, title: ["Jo aapko banate hain", "Who shapes you"], open: ["Woh log jinke saath aap badhte hain.", "The people you grow around."],
    qs: [
      { id: "truth", type: "names", tag: "truth", q: ["Pichhli baar kisne woh sach kaha jo aap sunna nahi chahte the?", "Who last told you something true you didn't want to hear?"] },
      { id: "bigger", type: "names", tag: "bigger", q: ["Kiske saath aap zyada saksham mehsoos karte hain, bina jhoothi taareef?", "Who makes you feel more capable, without flattering you?"] },
      { id: "taught", type: "names", tag: "taught", q: ["Kisne aapko kuch sikhaya jo aap aaj bhi karte hain?", "Who taught you something you still use?"] }
    ] },
  { n: 6, id: "both", min: 2, title: ["Dono taraf", "Both ways"], open: ["Ab ulta dekhiye. Aap bhi kisi ko thaame hue hain.", "Now look the other way. You are holding someone too."],
    qs: [
      { id: "leans", type: "names", tag: "leans", q: ["Mushkil mein raat ko kaun aapko phone karega?", "Who would call you at night if they were in trouble?"] },
      { id: "carryout", type: "names", tag: "carryout", q: ["Abhi aap kiska bojh utha rahe hain?", "Whose weight are you carrying right now?"] },
      { id: "learned", type: "names", tag: "learned", q: ["Kisne aapse kuch seekha?", "Who learned something from you?"] }
    ] },
  { n: 7, id: "drift", min: 3, tender: true, title: ["Jo door ho gaya", "What drifted"], open: ["Yeh hissa khone aur door hone ke baare mein hai. Aaj, ya kisi aur din?", "This part is about loss and distance. Today, or another day?"],
    qs: [
      { id: "lost", type: "names", tag: "lost", q: ["Koi jise aapne khoya, maut ya doori se, jo ab bhi aapke saath chalta hai?", "Someone you've lost, to death or distance, who still goes with you?"] },
      { id: "quietTie", type: "names", tag: "quiet", q: ["Ek rishta jo zinda hai par chup ho gaya.", "A tie that's still alive but has gone quiet."] },
      { id: "mend", type: "names", tag: "mend", q: ["Agar ek insaan ke saath ek cheez theek kar sakte, toh kiske saath?", "If you could set one thing right with one person, who would it be?"] }
    ] },
  { n: 8, id: "stand", min: 2, title: ["Kya thaamta hai, kya jagah leta hai", "What holds, what stands in"], open: ["Logon ke alawa bhi kuch cheezein thaamti hain. Kuch sirf thaamti hui lagti hain.", "Some things beyond people hold us. Some only feel like holding."],
    qs: [
      { id: "beyond", type: "multi", q: ["Logon ke alawa, aapko kya thaamta hai?", "Beyond people, what holds you?"], opts: [["faith", "Ishwar, aastha, prarthana", "God, faith or prayer"], ["place", "Ek jagah", "A place"], ["animal", "Ek jaanwar", "An animal"], ["music", "Sangeet, kala", "Music or art"], ["nature", "Prakriti", "Nature"], ["work", "Kaam jo maayne rakhta hai", "Work that matters"], ["none", "Kuch nahi", "Nothing in particular"]] },
      { id: "reach", type: "multi", q: ["Akele mein sabse pehle kis taraf haath jaata hai?", "When you feel alone, what do you reach for first?"], opts: [["phone", "Phone, scroll", "My phone"], ["work", "Kaam", "Work"], ["food", "Khaana", "Food"], ["screen", "TV, games", "TV or games"], ["sleep", "Neend", "Sleep"], ["person", "Kisi insaan ko", "A person"], ["faith", "Prarthana", "Prayer"], ["walk", "Bahar chalna", "A walk"]] },
      { id: "smaller", type: "names", tag: "smaller", priv: true, q: ["Kiske paas aap chhote mehsoos karte hain? (Chahein toh. Yeh kahin nahi dikhega.)", "Around whom do you feel smaller? (Optional. This is never shown anywhere.)"] }
    ] },
  { n: 9, id: "carry", min: 4, title: ["Jo aap aage le jaate hain", "What you carry on"], open: ["Aapko kisi ne kuch diya. Aap bhi kisi ko de rahe hain.", "Someone gave you something. You're passing something on too."],
    qs: [
      { id: "line", type: "text", q: ["Koi vaakya jo kisi ne diya aur aap aaj bhi jeete hain?", "A sentence someone gave you that you still live by?"], ph: ["'Pehle khaana, phir baat'", "'Eat first, then talk'"] },
      { id: "gave", type: "names", tag: "gave", q: ["Woh vaakya kisne diya?", "Who gave it to you?"] },
      { id: "passon", type: "names", tag: "passon", q: ["Aap kisko kuch de rahe hain jo woh aage le jaayenge?", "Who are you passing something on to?"] }
    ] },
  { n: 10, id: "keepplace", min: 5, title: ["Ek jagah ko rakhna", "Keeping a place"], open: ["Aakhri parat: woh jagah jo bahut logon ko thaamti hai.", "The last layer: a place that holds many people."],
    qs: [
      { id: "kplace", type: "text", q: ["Koi jagah jise aap rakhne mein madad kar sakte hain? Building, team, group, gali.", "Is there a place you could help keep? A building, a team, a group, a street."], ph: ["hamari building", "our building"] },
      { id: "keepers", type: "names", tag: "keeper", q: ["Abhi use kaun rakhta hai? Watchman, secretary, koi jo sabko jodta hai.", "Who keeps it now? The guard, the organiser, the one who connects everyone."] },
      { id: "kwish", type: "choice", q: ["Kya aap use rakhne mein haath batana chahenge?", "Would you like to help keep it?"], opts: [["yes", "Haan", "Yes"], ["maybe", "Shayad, baad mein", "Maybe, later"], ["no", "Abhi nahi", "Not now"]] }
    ] }
];
function layerSteps(Ln) { var Ly = LAYERS[Ln - 1], s = [{ t: "open" }]; Ly.qs.forEach(function (q, i) { s.push({ t: "q", q: i }); }); s.push({ t: "reveal" }, { t: "end" }); return s; }
function namesQs() { var o = []; LAYERS.forEach(function (Ly) { Ly.qs.forEach(function (q) { if (q.type === "names") o.push(q); }); }); return o; }

/* ---------- people (all map defects fixed here) ---------- */
var FEW_T = ["night", "called", "notice"];
var HOLDS_ME = ["first", "night", "called", "notice", "weekly", "truth", "bigger", "taught", "hand", "gave", "keeper"];
var CIRCLE_T = ["first", "truth", "bigger", "taught", "weekly", "carryout", "learned", "would", "mend", "quiet", "gave", "passon", "leans"];
function people(includePrivate, answers) {
  var a = answers || S.look.a, map = {};
  function add(n, tag) {
    n = canon(n); var k = n.toLowerCase();
    if (!map[k]) map[k] = { name: n, tags: [] };
    if (map[k].tags.indexOf(tag) < 0) map[k].tags.push(tag);
  }
  namesQs().forEach(function (q) { (a[q.id] || []).forEach(function (n) { add(n, q.tag); }); });
  if (!answers) { S.extra.forEach(function (n) { add(n, "added"); }); S.walk.forEach(function (w) { add(w.name, "walk"); }); }
  var out = [];
  Object.keys(map).forEach(function (k) {
    var p = map[k], o = (!answers && S.over[k]) || {};
    if (o.removed) return;
    var pub = p.tags.filter(function (t) { return t !== "smaller"; });
    if (!pub.length && !includePrivate) return;          // private-only names never appear
    p.key = k; p.pub = pub;
    p.group = k in S.groups ? !!S.groups[k] : GROUP_RE.test(p.name);
    p.lost = pub.indexOf("lost") >= 0;
    var fewN = pub.filter(function (t) { return FEW_T.indexOf(t) >= 0; }).length;
    if (p.lost) p.ring = "lost";                          // lost always wins
    else if (p.group) p.ring = "village";
    else if (o.ring) p.ring = o.ring;
    else if (fewN) p.ring = "few";
    else if (pub.some(function (t) { return CIRCLE_T.indexOf(t) >= 0; })) p.ring = "circle";
    else p.ring = "village";
    p.maybe = p.ring === "few" && !o.ring && fewN < 2;     // one mention = dotted maybe
    p.jobs = p.lost ? [] : JOBS.filter(function (j) { if (p.group && j.id !== "belong") return false; return j.from.some(function (t) { return pub.indexOf(t) >= 0; }); }).map(function (j) { return j.id; });
    p.many = pub.filter(function (t) { return HOLDS_ME.indexOf(t) >= 0; }).length >= 2;
    p.holdsYou = pub.some(function (t) { return ["leans", "carryout", "learned", "passon"].indexOf(t) >= 0; });
    p.quietOnly = pub.every(function (t) { return ["quiet", "would", "mend"].indexOf(t) >= 0; });
    p.keepClose = !!S.keep[k];
    out.push(p);
  });
  return out;
}
var GROUP_RE = /\b(group|team|gang|club|friends|family|colleagues|juniors|nurses|parivaar|mandali|toli|log|wale)\b/i;
function canon(n) { var k = String(n).toLowerCase(); return S.aliases[k] || n; }
function living(ps) { return (ps || people()).filter(function (p) { return !p.lost; }); }
function oneToOne(ps) { return living(ps).filter(function (p) { return !p.group; }); }
function withTag(tag, ps) { return (ps || people()).filter(function (p) { return p.pub.indexOf(tag) >= 0; }).map(function (p) { return p.name; }); }
function chairs(ps) { ps = living(ps || people()); return JOBS.map(function (j) { return { job: j, names: ps.filter(function (p) { return p.jobs.indexOf(j.id) >= 0; }).map(function (p) { return p.name; }) }; }); }
function jobFor(name) { var p = people().filter(function (x) { return x.name === name; })[0]; return p && p.jobs[0] || "drift"; }
function mergeCandidate(n) {
  var low = n.toLowerCase(), words = low.split(/[\s()]+/).filter(Boolean);
  var hit = people(true).filter(function (p) {
    if (p.key === low) return false;
    var pw = p.key.split(/[\s()]+/).filter(Boolean);
    return words.some(function (w) { return w.length > 2 && pw.indexOf(w) >= 0; });
  })[0];
  return hit ? hit.name : null;
}

/* ---------- the map ---------- */
function mapSVG(opt) {
  opt = opt || {};
  var ps = opt.ps || people(), cx = 170, cy = 170, R = { few: 64, circle: 112, village: 158 }, MID = { few: 42, circle: 89, village: 136 };
  var g = "";
  ["village", "circle", "few"].forEach(function (r) { g += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R[r] + '" fill="' + (r === "few" ? "color-mix(in srgb, var(--amber) 9%, transparent)" : "none") + '" stroke="var(--line)"/>'; });
  if (!opt.small) ["few", "circle", "village"].forEach(function (r) { g += '<text x="' + cx + '" y="' + (cy - R[r] + 13) + '" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9.5" letter-spacing="1" fill="var(--muted)">' + esc(P(RING[r].name).toUpperCase()) + "</text>"; });
  var groups = { few: [], circle: [], village: [], lost: [] };
  ps.forEach(function (p) { (groups[p.ring] || groups.village).push(p); });
  ["few", "circle", "village"].forEach(function (r) {
    var l = groups[r];
    l.forEach(function (p, i) {
      var gap = r === "few" ? 0.9 : 0.6, ang = -Math.PI / 2 + gap + ((i + 0.5) / l.length) * (Math.PI * 2 - 2 * gap) + (r === "circle" ? 0.25 : 0);
      var x = cx + Math.cos(ang) * MID[r], y = cy + Math.sin(ang) * MID[r];
      var dashed = p.quietOnly || p.maybe;
      g += '<line x1="' + cx + '" y1="' + cy + '" x2="' + x.toFixed(1) + '" y2="' + y.toFixed(1) + '" stroke="' + (dashed ? "var(--muted)" : "var(--thread)") + '" stroke-width="' + (p.many ? 1.6 : 0.9) + '" stroke-dasharray="' + (dashed ? "3 4" : "none") + '" opacity="0.6"/>';
      if (p.group) g += '<rect x="' + (x - 6).toFixed(1) + '" y="' + (y - 6).toFixed(1) + '" width="12" height="12" rx="3" fill="var(--bg)" stroke="var(--blue)" stroke-width="1.5"/>';
      else g += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (opt.small ? 3.5 : 5) + '" fill="' + (p.many && !p.maybe ? "var(--amber)" : "var(--bg)") + '" stroke="var(--amber)" stroke-width="1.5" stroke-dasharray="' + (p.maybe ? "2 2" : "none") + '"/>';
      if (p.holdsYou && !opt.small) g += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="9" fill="none" stroke="var(--good)" stroke-width="1.2"/>';
      if (!opt.small) { var lbl = p.name.length > 15 ? p.name.slice(0, 14) + "…" : p.name, anc = x > 235 ? "end" : x < 105 ? "start" : "middle", lx = anc === "end" ? x + 8 : anc === "start" ? x - 8 : x; g += '<text x="' + lx.toFixed(1) + '" y="' + (y - 10).toFixed(1) + '" text-anchor="' + anc + '" font-family="Kalam, cursive" font-size="13.5" fill="var(--ink)">' + esc(lbl) + (p.maybe ? "?" : "") + "</text>"; }
    });
  });
  g += '<circle cx="' + cx + '" cy="' + cy + '" r="14" fill="var(--amber)"/><text x="' + cx + '" y="' + (cy + 3.5) + '" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--amber-ink)">' + T("aap", "you") + "</text>";
  var foot = groups.lost.length && !opt.small ? '<text x="' + cx + '" y="336" text-anchor="middle" font-family="Kalam, cursive" font-size="13" fill="var(--muted)">' + esc(T("Saath chalte hain: ", "Carried with you: ") + groups.lost.map(function (p) { return p.name; }).join(", ")) + "</text>" : "";
  return '<svg viewBox="0 0 340 ' + (foot ? 346 : 340) + '" role="img" aria-label="' + esc(T("Aapka thaamne ka jaal", "Your web of holding")) + '">' + g + foot + "</svg>";
}
function legend() {
  return '<div class="legend"><span><svg width="12" height="12"><circle cx="6" cy="6" r="4.5" fill="var(--amber)"/></svg>' + T("ek se zyada baar", "came up more than once") + '</span><span><svg width="12" height="12"><circle cx="6" cy="6" r="4.5" fill="none" stroke="var(--amber)" stroke-width="1.5" stroke-dasharray="2 2"/></svg>' + T("shayad (ek baar)", "maybe (once)") + '</span><span><svg width="18" height="12"><circle cx="9" cy="6" r="5" fill="none" stroke="var(--good)" stroke-width="1.2"/></svg>' + T("aap par tike", "leans on you") + '</span><span><svg width="12" height="12"><rect x="1" y="1" width="10" height="10" rx="2" fill="none" stroke="var(--blue)" stroke-width="1.5"/></svg>' + T("group", "a group") + "</span></div>";
}

/* ---------- Gate ---------- */
var EXTRA_RISK = ["don't want to live", "dont want to live", "kill me", "end it all", "can't go on", "cant go on", "jeena nahi chahta", "jeena nahi chahti"];
function gateHit(text) { var t = " " + String(text || "").toLowerCase().replace(/\s+/g, " ") + " "; return N.gate.phrases.concat(EXTRA_RISK).some(function (p) { return t.indexOf(p) >= 0; }); }

/* ---------- tier 0 text ---------- */
var SAWAAL = {
  settle: ["{p} ki awaaz aakhri baar kab suni thi?", "When did you last hear {p}'s voice?"],
  sharpen: ["{p} ne aakhri baar aapse kab sach kaha tha?", "When did {p} last tell you something true?"],
  carry: ["Is hafte {p} ke liye kaunsa ek kaam aap utha sakte hain?", "What's one thing you could carry for {p} this week?"],
  belong: ["{p} ko aakhri baar kab laga ki woh aap mein se ek hain?", "When did {p} last feel like one of you?"],
  aim: ["Kya aapne {p} se poocha hai ki woh kahan ja rahe hain?", "Have you asked {p} where they're heading?"],
  drift: ["{p} se aakhri baat kab hui thi?", "When did you last speak to {p}?"]
};
var SHABD = {
  reach: ["{p}, bas yaad aaya. Kaise ho?", "{p}, I just thought of you. How are you?"],
  mend: ["{p}, us din maine jo kaha, woh theek nahi tha. Kya hum baat kar sakte hain?", "{p}, what I said that day wasn't right. Can we talk?"],
  thanks: ["{p}, kabhi kaha nahi, par aapne jo kiya woh mujhe yaad hai. Shukriya.", "{p}, I never said it, but I remember what you did. Thank you."],
  meet: ["{p}, is hafte ek ghanta milein? Phone door, bas baat.", "{p}, an hour this week? Phones away, just talk."],
  few: ["{p}, ek baat kehni thi: aap un logon mein se ho jo mujhe thaamte ho. {j}. Bas itna batana tha.", "{p}, I wanted to tell you: you're one of the people who hold me. {j}. That's all."]
};
var RAAH = ["{p}, kal subah baat kar sakte hain? Thoda bhaari chal raha hai.", "{p}, can we talk tomorrow morning? Things feel heavy."];
function fill(pair, p, extra) { return (S.lang === "hi" ? pair[0] : pair[1]).replace(/\{p\}/g, p || T("Dost", "Friend")).replace(/\{j\}/g, extra || ""); }
function pool(job) { return N.acts.filter(function (a) { return a.job === job; }); }
var JOBLINE = { settle: ["Aapke paas main shaant ho jaata hoon", "I grow calm around you"], sharpen: ["Aap mujhe sach bolte ho", "You tell me the truth"], carry: ["Mushkil mein aap aate ho", "You come when it's hard"], belong: ["Aapke saath main 'hum' hoon", "With you I'm part of a 'we'"], aim: ["Aap mujhe raasta dikhate ho", "You show me the way"] };
var TIER0 = {
  sawaal: function (c) { return { question: c.person ? fill(SAWAAL[c.job] || SAWAAL.drift, c.person) : T("Aaj kaun yaad aaya?", "Who came to mind today?") }; },
  chunna: function (c) { var p = c.candidates, a = p[(hash32(c.seed || "x") + (c.bump || 0)) % p.length]; return { n: a.n, act: a.t }; },
  shabd: function (c) { return { message: fill(SHABD[c.tone] || SHABD.reach, c.person, c.jobline), door: c.tone === "meet" ? "visit" : "message" }; },
  raah: function (c) { return { message: fill(RAAH, c.person), door: "message" }; },
  bhasha: function (c) { return { text: c.text }; },
  explain: function (c) { return { text: P(TERMS[c.k][1]) }; },
  vessel: function (c) { return { words: T("Hum " + (c.what || "yeh") + " karte hain kyunki aise hum ek doosre ko rakhte hain.", "We " + (c.what || "do this") + " because this is how we keep each other.") }; },
  saath: function (c) {
    if (c.kind === "chairs") return { question: T("Main aapko kaise thaamta hoon, aur aap mujhe?", "How do I hold you, and how do you hold me?"), agenda: S.lang === "hi" ? ["Har koi ek tareeka bataye jisse doosra use thaamta hai.", "Har koi ek tareeka bataye jisse woh thaama jaana chahta hai.", "Ek kaam chuniye jo aap dono kisi aur ke liye karenge."] : ["Each says one way the other holds them.", "Each says one way they'd like to be held.", "Choose one act you'll both do for someone else."] };
    if (c.kind === "round") return { question: T("Is hafte kisne aapko thaama?", "Who held you this week?"), agenda: S.lang === "hi" ? ["Har koi ek naam bataye jisne is hafte thaama.", "Har koi ek naam bataye jise unhone thaama.", "Parivaar ghar ke bahar kisi ke liye ek kaam chune."] : ["Everyone names one person who held them this week.", "Everyone names one person they held.", "The family picks one act for someone outside the home."] };
    return { question: T("Is hafte kaun yaad aaya, aur kyun?", "Who came to mind this week, and why?"), agenda: S.lang === "hi" ? ["Har koi ek pehla naam bataye.", "Har koi apne naksha ki ek khaali kursi bataye. Koi salah nahi.", "Har koi ek kaam chune aur agle hafte bataye."] : ["Everyone names one first name: who held you this week?", "Everyone names one open chair on their map. No advice.", "Everyone picks one act and reports back next week."] };
  },
  aaina: function (c) { return { paragraph: c.lines.join(" ") }; }
};

/* ---------- AI pipeline: Gate first, tier, names hidden, free text never sent, schema, fallback ---------- */
var CAP = { sample: null, db: null, downloads: null };
var BANNED = /(i'?m here for you|i understand (how|what) you|as an ai|therap|diagnos|medicat|counsel|you are not alone|main (aapke )?saath hoon|sab theek ho jaayega|everything will be (ok|fine)|i'?m sorry you|attachment style|introvert|extrovert|personality type)/i;
var SCHEMA = { sawaal: { question: 140 }, chunna: { n: 0, act: 170 }, shabd: { message: 420, door: 12 }, raah: { message: 420, door: 12 }, bhasha: { text: 500 }, saath: { question: 200, agenda: 3 }, aaina: { paragraph: 700 }, explain: { text: 500 }, vessel: { words: 200 } };
function rules() {
  return "You write short text for Neev, an app that helps a person see the people who hold them and reach one of them.\n" +
    "Rules:\n- You are a witness, not a friend, counsellor or therapist. Never comfort, reassure, diagnose, label personality, or give health, medication or relationship advice. Never claim to understand feelings.\n" +
    "- Never judge or rank anyone. No scores.\n- Never speak as a person or play another person.\n- Point toward a human: a message, a call, a visit or a meeting.\n" +
    "- [P1], [P2] are placeholders for real people. Keep them exactly; never invent names.\n- Short, plain, warm. No emoji, no exclamation marks.\n" +
    "- Language: " + (S.lang === "hi" ? "Hinglish (Hindi in Latin letters, as people text)" : "plain English") + ".\n- Reply with one JSON object only.\n\n";
}
var TASK = {
  sawaal: function (c) { return "Task: ONE short question (under 20 words) that helps the reader recall a real moment with " + c.ph + ". End with a question mark. Do not probe feelings.\nJSON: {\"question\": \"...\"}"; },
  chunna: function (c) { return "Task: From these acts pick ONE that fits " + c.ph + " and reword it in one sentence for today, keeping its meaning.\nActs:\n" + c.candidates.map(function (a) { return a.n + ". " + a.t; }).join("\n") + "\nJSON: {\"n\": <number>, \"act\": \"...\"}"; },
  shabd: function (c) { return "Task: Draft a short starter message (under 50 words) the reader will edit and send to " + c.ph + ". Purpose: " + ({ reach: "reaching out after a gap", mend: "repairing a rupture, owning their part", thanks: "thanking them", meet: "inviting them to meet", few: "telling them they are one of the people who hold the reader, in this way: " + (c.jobline || "") }[c.tone] || "reaching out") + ". First person. Keep it simple; the reader will add specifics.\nJSON: {\"message\": \"...\", \"door\": \"message\"}"; },
  raah: function (c) { return "Task: Late at night the reader wants a short message to " + c.ph + " for the morning, asking to talk. Under 35 words, in their voice. No advice.\nJSON: {\"message\": \"...\", \"door\": \"call\"}"; },
  bhasha: function (c) { return "Task: Translate into Hindi in Devanagari, natural and simple, keeping placeholders: \"" + c.text + "\".\nJSON: {\"text\": \"...\"}"; },
  explain: function (c) { return "Task: Explain the idea '" + P(TERMS[c.k][0]) + "' in under 70 words for someone who has never heard of it. Base: \"" + P(TERMS[c.k][1]) + "\". Use one everyday example. No advice.\nJSON: {\"text\": \"...\"}"; },
  vessel: function (c) { return "Task: The reader keeps this ritual: \"" + c.what + "\". Write ONE sentence (under 25 words) they could say aloud that names what the ritual is for, starting with 'We'. No advice.\nJSON: {\"words\": \"...\"}"; },
  saath: function (c) { return "Task: Write a 20 to 30 minute guide for " + ({ chairs: "a couple doing a monthly 'Two Chairs' ritual", round: "a family's weekly round at a meal" }[c.kind] || "a small circle of up to eight") + ". One opening question and exactly three short steps (under 20 words each). Never compare or rate anyone.\nJSON: {\"question\": \"...\", \"agenda\": [\"...\", \"...\", \"...\"]}"; },
  aaina: function (c) { return "Task: Read this person's own map back to them in one paragraph (under 90 words), second person. Only restate; no causes, advice or grades. End by saying both are true: they are held, and some places are open.\nWhat they said:\n- " + c.lines.join("\n- ") + "\nJSON: {\"paragraph\": \"...\"}"; }
};
function redact(ctx) {
  var names = people(true).map(function (p) { return p.name; });
  if (ctx.person && names.indexOf(ctx.person) < 0) names.push(ctx.person);
  names.sort(function (a, b) { return b.length - a.length; });
  var map = {}, rev = {};
  names.forEach(function (n, i) { map[n] = "[P" + (i + 1) + "]"; rev["[P" + (i + 1) + "]"] = n; });
  function hide(s) { s = String(s || ""); names.forEach(function (n) { s = s.split(n).join(map[n]); }); return s.replace(/\+?\d[\d\s-]{6,}\d/g, "[number]"); }
  return { hide: hide, ph: ctx.person ? map[ctx.person] : "[P1]", restore: function (s) { return String(s).replace(/\[P\d+\]/g, function (m) { return rev[m] || m; }); } };
}
function validate(fn, o, ctx) {
  if (!o || typeof o !== "object") return "not a JSON object";
  var sc = SCHEMA[fn];
  for (var k in sc) {
    if (!(k in o)) return "missing field: " + k;
    if (k === "n") { if (!ctx.candidates.some(function (a) { return a.n === Number(o.n); })) return "act not from the list"; continue; }
    if (k === "agenda") { if (!Array.isArray(o.agenda) || o.agenda.length !== 3) return "agenda must have 3 steps"; continue; }
    if (typeof o[k] !== "string" || !o[k].trim()) return "empty field: " + k;
    if (o[k].length > sc[k]) return k + " too long";
  }
  var all = JSON.stringify(o);
  if (BANNED.test(all)) return "crosses the AI Line (comfort, therapy, label or advice)";
  if ((fn === "aaina" || fn === "explain") && /(you should|you need to|try to|consider )/i.test(all)) return "gave advice";
  if (fn === "sawaal" && !/\?\s*$/.test(o.question)) return "no question mark";
  return "";
}
function pushTrace(t) { V.traces.unshift(t); V.traces = V.traces.slice(0, 6); if (typeof renderBench === "function") renderBench(); }
function ai(fn, ctx, userText) {
  var t0 = performance.now(), tr = { fn: fn, at: new Date().toLocaleTimeString(), steps: [], result: null };
  if (gateHit(userText || "")) { tr.steps.push(["bad", "Gate check: risk words found. Model not run."]); pushTrace(tr); openGate(); return Promise.resolve(null); }
  tr.steps.push(["ok", "Gate check: clear"]);
  var base = TIER0[fn](ctx);
  if (S.tier !== "t3" || !CAP.sample) { tr.steps.push(["ok", S.tier === "t3" ? "Claude not reachable here: pre-written text (tier 0)" : "Tier 0: pre-written text"]); tr.result = base; tr.ms = Math.round(performance.now() - t0); pushTrace(tr); base._tier = "t0"; return Promise.resolve(base); }
  var R = redact(ctx);
  var c2 = Object.assign({}, ctx, { ph: R.ph, lines: (ctx.lines || []).map(R.hide), text: R.hide(ctx.text || ""), what: R.hide(ctx.what || "") });
  delete c2.intent; // the person's own free text never leaves the phone
  var prompt = rules() + TASK[fn](c2);
  tr.steps.push(["ok", "Names hidden (" + people(true).length + "); your own free text kept on the phone"]);
  tr.prompt = prompt;
  return CAP.sample(prompt, { modelTier: "quick", cache: false }).then(function (res) {
    tr.raw = res.text; var txt = String(res.text || "").trim(), o = null;
    try { o = JSON.parse(txt.slice(txt.indexOf("{"), txt.lastIndexOf("}") + 1)); } catch (e) {}
    var why = validate(fn, o, ctx);
    if (why) { tr.steps.push(["bad", "Schema check failed: " + why + ". Used tier 0."]); tr.result = base; tr.ms = Math.round(performance.now() - t0); pushTrace(tr); base._tier = "t0"; base._fell = why; return base; }
    tr.steps.push(["ok", "Schema and AI Line check passed"]);
    ["question", "act", "message", "text", "paragraph", "words"].forEach(function (k) { if (o[k]) o[k] = R.restore(o[k]); });
    if (o.agenda) o.agenda = o.agenda.map(R.restore);
    if (fn === "chunna") o.n = Number(o.n);
    tr.steps.push(["ok", "Names put back on the phone"]); tr.result = o; tr.ms = Math.round(performance.now() - t0); pushTrace(tr); o._tier = "t3"; return o;
  }).catch(function (e) {
    var code = (e && e.code) || "error"; tr.steps.push(["bad", "Claude call ended (" + code + "). Used tier 0."]);
    if (code === "not_granted") { S.tier = "t0"; save(); }
    tr.result = base; tr.ms = Math.round(performance.now() - t0); pushTrace(tr); base._tier = "t0"; base._fell = code; return base;
  });
}
function srcChip(r) { if (!r) return ""; return '<button class="chip src" data-a="trace">' + esc(r._tier === "t3" ? T("Claude · naam chhupe", "Claude · names hidden") : T("Pehle se likha", "Pre-written")) + (r._fell ? " · fallback" : "") + "</button>"; }
