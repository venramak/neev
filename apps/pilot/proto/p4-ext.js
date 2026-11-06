/* Neev v4 · reasons not scripts, the universe made explicit, holding portfolio, villages, moving rings, doors */

/* ---------- state additions ---------- */
fresh = (function (orig) { return function () { var f = orig(); f.voice = { reasons: {}, openers: [], notfor: {}, skipActs: {}, noRush: true }; f.ringLog = {}; return f; }; })(fresh);
if (!S.voice) S.voice = { reasons: {}, openers: [], notfor: {}, skipActs: {}, noRush: true };
if (!S.ringLog) S.ringLog = {};

/* ---------- 1. Plain, normal language ---------- */
N.oneLine = { hi: "Hi, kaise ho? Kaafi din ho gaye.", en: "Hi! How are you? It's been a while." };
N.episodes[0].act = { hi: "Jo naam sabse pehle yaad aaya, is hafte us tak pahunchiye. Ek sachchi wajah chuniye: ek photo, ek sawaal, ek plan.", en: "Get in touch with the first name that came to mind, this week. Pick a real reason: a photo, a question, a plan." };
SHABD.reach = ["Hi {p}! Kaise ho? Kaafi din ho gaye.", "Hi {p}! How are you? It's been a while."];

var REASONS = [
  { id: "share", name: ["Kuch dikhana", "Share something"], hint: ["ek photo, gaana, link", "a photo, a song, a link"], t: ["{p}, yeh dekha aur tumhari yaad aa gayi: ___", "{p}, saw this and it made me think of you: ___"] },
  { id: "ask", name: ["Ek chhota sawaal", "A small question"], hint: ["kuch jo sirf woh jaante hain", "something they'd know"], t: ["{p}, ek sawaal, tumhe pata hoga: ___? Koi jaldi nahi.", "{p}, quick question, you'd know this: ___? No rush."] },
  { id: "memory", name: ["Ek yaad", "A memory"], hint: ["purani photo, jagah, kissa", "an old photo, a place, a story"], t: ["{p}, aaj ___ dekha, woh din yaad aa gaye.", "{p}, came across ___ today. Remember that?"] },
  { id: "news", name: ["Unki khabar", "Their news"], hint: ["naya kaam, safar, bachche", "a new job, a trip, the kids"], t: ["{p}, ___ ke baare mein suna. Kaisa raha?", "{p}, heard about ___. How did it go?"] },
  { id: "occasion", name: ["Ek mauka", "An occasion"], hint: ["tyohaar, janmdin, match", "a festival, a birthday, a match"], t: ["{p}, ___ ki shubhkaamnayein! Ghar mein sab kaise hain?", "Happy ___, {p}! How's everyone at home?"] },
  { id: "plan", name: ["Milne ka plan", "A plan to meet"], hint: ["chai, walk, match", "coffee, a walk, a game"], t: ["{p}, is hafte ___ chalein? Tumhare paas hi.", "{p}, ___ this week? Somewhere near you."] },
  { id: "thanks", name: ["Ek shukriya", "A thank-you"], hint: ["kuch jo unhone sikhaya ya kiya", "something they taught or did"], t: ["{p}, aaj ___ karte hue yaad aaya ki yeh tumne sikhaya tha. Shukriya.", "{p}, was ___ today and remembered you taught me that. Thanks, still."] },
  { id: "mend", name: ["Baat saaf karni", "Clear the air"], hint: ["koi purani baat", "something left unsaid"], t: ["{p}, ___ ke baare mein sochta raha. Kabhi baat kar sakte hain?", "{p}, I've been thinking about ___. Could we talk sometime?"] },
  { id: "hello", name: ["Seedha hello", "A plain hello"], hint: ["koi wajah zaroori nahi", "no reason needed"], t: ["Hi {p}! Kaise ho? Kaafi din ho gaye.", "Hi {p}! How are you? It's been a while."] }
];
var NORUSH = [" Jawab ki koi jaldi nahi.", " No need to reply."];
function reasonById(id) { return REASONS.filter(function (r) { return r.id === id; })[0]; }
function reasonOrder() {
  var used = S.voice.reasons || {};
  return REASONS.filter(function (r) { return !S.voice.notfor[r.id]; }).sort(function (a, b) { return (used[b.id] || 0) - (used[a.id] || 0); });
}
var TIER0_SHABD0 = TIER0.shabd;
TIER0.shabd = function (c) { var r = reasonById(c.tone); if (r) return { message: fill(r.t, c.person), door: "message" }; return TIER0_SHABD0(c); };
var TASK_SHABD0 = TASK.shabd;
TASK.shabd = function (c) {
  var r = reasonById(c.tone);
  if (!r) return TASK_SHABD0(c);
  return "Task: Write ONE short, ordinary message (under 30 words) the reader will send to " + c.ph + ". Reason for writing: " + r.name[1].toLowerCase() + " (" + r.hint[1] + "). Sound like a normal text between people who know each other, not a greeting card. Never say 'I was thinking of you' or talk about feelings. Leave '___' where the reader adds the specific thing only they know. No question about wellbeing beyond a simple 'how are you'.\nJSON: {\"message\": \"...\", \"door\": \"message\"}";
};

/* The reach sheet: the person brings the context, the app holds the door open */
openShabd = function (who, tone) {
  var ps = safeOne(), p = who || (S.today && S.today.person) || (ps[0] && ps[0].name) || "";
  var order = reasonOrder(), sel = (tone && reasonById(tone)) ? tone : order[0].id;
  V.reach = { who: p, reason: sel };
  var own = (S.voice.openers || []).slice(-4).reverse();
  sheet('<div class="sheet" role="dialog" aria-label="Get in touch"><div class="grab"></div><h2 class="h2" style="margin-top:4px">' + T("Kisi tak pahunchna", "Get in touch") + '</h2><p class="small">' + T("Neev aapka sandarbh nahi jaanta. Wajah aur shabd aapke; app sirf darwaza khula rakhta hai.", "Neev can't know your context. You choose the reason and the words; it only holds the door open.") + "</p>" +
    '<label class="f" for="sWho">' + T("Kisko", "To") + "</label>" + (ps.length ? '<select class="t" id="sWho">' + ps.map(function (x) { return "<option" + (x.name === p ? " selected" : "") + ">" + esc(x.name) + "</option>"; }).join("") + "</select>" : '<input class="t" id="sWho">') +
    '<label class="f">' + T("Abhi kyun? Ek sachchi wajah chuniye", "Why now? Pick a reason that's real for you") + '</label><div class="chiprow" id="reasons">' + order.map(function (r) { return '<button class="chip' + (r.id === sel ? " on" : "") + '" data-a="reasonPick" data-r="' + r.id + '">' + esc(P(r.name)) + "</button>"; }).join("") + '</div><p class="small" id="rHint" style="margin:6px 0 0">' + esc(P(reasonById(sel).hint)) + "</p>" +
    '<label class="f" for="draft">' + T("Aapka message: ___ mein woh likhiye jo sirf aap jaante hain", "Your message: fill the ___ with what only you know") + '</label><textarea class="t" id="draft" style="min-height:96px">' + esc(fill(reasonById(sel).t, p) + (S.voice.noRush ? P(NORUSH) : "")) + "</textarea>" +
    (own.length ? '<p class="small" style="margin:8px 0 4px">' + T("Aapke apne pichhle shabd:", "Your own words from before:") + '</p><div class="chiprow">' + own.map(function (o, i) { return '<button class="chip" data-a="ownUse" data-i="' + i + '">' + esc(o.length > 34 ? o.slice(0, 33) + "…" : o) + "</button>"; }).join("") + "</div>" : "") +
    '<div class="chiprow" style="margin-top:8px"><button class="chip' + (S.voice.noRush ? " on" : "") + '" data-a="noRush">' + T("'Jawab ki jaldi nahi' jodiye", "Add 'No need to reply'") + '</button><button class="chip" data-a="reachAI">' + T("Shabd sujhaiye", "Suggest wording") + '</button><button class="chip" data-a="reasonNot">' + T("Yeh wajah mere liye nahi", "Not a reason I'd use") + '</button><span id="rSrc"></span></div>' +
    '<div class="row" style="margin-top:12px"><button class="btn" data-a="copyDraft">Copy</button><a class="btn primary" id="waDraft" target="_blank" rel="noopener" data-a="reachSent" href="https://wa.me/?text=' + encodeURIComponent(fill(reasonById(sel).t, p)) + '">' + T("WhatsApp mein kholiye", "Open in WhatsApp") + '</a></div><p class="small">' + T("Aap bhejenge, app nahi. Research batata hai ki log kam aankte hain ki doosre achanak aaye message ki kitni kadar karte hain.", "You send it, not the app. Research finds people underestimate how much others appreciate an unexpected message.") + '</p><button class="btn ghost block" style="margin-top:6px" data-a="close">' + T("Band kijiye", "Close") + "</button></div>");
  syncWa();
};
function syncWa() { var d = $("#draft"), w = $("#waDraft"); if (d && w) w.href = "https://wa.me/?text=" + encodeURIComponent(d.value.replace(/___/g, "").replace(/\s+/g, " ").trim()); }
function setDraftFromReason() {
  var r = reasonById(V.reach.reason), who = ($("#sWho") || {}).value || V.reach.who;
  $("#draft").value = fill(r.t, who) + (S.voice.noRush ? P(NORUSH) : ""); $("#rHint").textContent = P(r.hint); syncWa();
}
Object.assign(A, {
  shabd: function () { openShabd(); },
  reasonPick: function (el) { V.reach.reason = el.dataset.r; document.querySelectorAll("#reasons .chip").forEach(function (c) { c.classList.toggle("on", c === el); }); setDraftFromReason(); },
  noRush: function (el) { S.voice.noRush = !S.voice.noRush; save(); el.classList.toggle("on", S.voice.noRush); setDraftFromReason(); },
  reasonNot: function () { S.voice.notfor[V.reach.reason] = 1; save(); toast(T("Samajh gaya. Yeh wajah ab nahi dikhegi.", "Got it. That reason won't be suggested again.")); openShabd(($("#sWho") || {}).value); },
  ownUse: function (el) { var o = (S.voice.openers || []).slice(-4).reverse()[+el.dataset.i]; if (o) { $("#draft").value = o; syncWa(); } },
  reachAI: function () { var who = ($("#sWho") || {}).value || V.reach.who; ai("shabd", { person: who, tone: V.reach.reason }).then(function (r) { if (!r) return; $("#draft").value = r.message + (S.voice.noRush ? P(NORUSH) : ""); $("#rSrc").innerHTML = srcChip(r); syncWa(); }); },
  reachSent: function () {
    var d = ($("#draft") || {}).value || "", first = d.replace(/___/g, "").split(/(?<=[.?!])\s/)[0].trim();
    S.voice.reasons[V.reach.reason] = (S.voice.reasons[V.reach.reason] || 0) + 1;
    if (first && S.voice.openers.indexOf(first) < 0) { S.voice.openers.push(first.slice(0, 120)); S.voice.openers = S.voice.openers.slice(-12); }
    save(); chorusAdd("line"); task("shabd");
  },
  actNot: function () { var a = S.today; if (a.n) S.voice.skipActs[a.n] = 1; a.swaps = (a.swaps || 0) + 1; save(); A.swap(); toast(T("Theek hai. Aise kaam kam dikhenge.", "Fine. Fewer acts like that.")); }
});
document.addEventListener("input", function (ev) { if (ev.target.id === "draft") syncWa(); });

/* Today's act: alternate between 'get in touch, with a reason' and a catalogue act the person hasn't turned down */
ensureToday = (function () {
  return function () {
    if (S.today && S.today.date === dstr()) return;
    var all = safeOne(), d = dstr(), near = all.filter(function (p) { return p.ring !== "village"; }), ps = near.length ? near : all;
    if (!ps.length) { setToday({ text: T("Aaj jo aapka din chalate hain, unmein se ek ka naam poochhiye aur usi naam se shukriya kahiye.", "Today, ask the name of one person who keeps your day running, and thank them by it."), job: "belong" }); return; }
    var p = ps[hash32(d) % ps.length];
    if (hash32(d + "k") % 2 === 0) { setToday({ person: p.name, job: p.jobs[0] || "drift", text: T(p.name + " se is hafte baat kijiye. Ek sachchi wajah chuniye: ek photo, ek sawaal, ek plan.", "Get in touch with " + p.name + " this week. Pick a real reason: a photo, a question, a plan."), reach: true }); S.today.reach = true; save(); return; }
    var job = p.jobs[0] || (p.ring === "village" ? "belong" : "drift");
    var cands = pool(job).filter(function (x) { return !S.voice.skipActs[x.n] && !/let go|release|end (a|one|the)|walk away|step back/i.test(x.t); });
    var a = TIER0.chunna({ candidates: cands.length ? cands : pool(job), seed: d + p.name });
    setToday({ person: p.name, job: job, n: a.n, text: a.act });
  };
})();

/* ---------- 2. The universe, explained explicitly ---------- */
RING.few.size = ["lagbhag 4 log (3 se 5)", "about 4 people (3 to 5)"];
RING.few.n = "4"; RING.circle.n = "15"; RING.village.n = "150";
function universeHTML(compact) {
  var svg = '<svg viewBox="0 0 340 250" role="img" aria-label="' + T("Thaamne ke teen ghere", "Three rings of holding") + '" style="width:100%;height:auto;display:block"><circle cx="125" cy="125" r="112" fill="none" stroke="var(--line)"/><circle cx="125" cy="125" r="74" fill="none" stroke="var(--line)"/><circle cx="125" cy="125" r="38" fill="color-mix(in srgb, var(--amber) 14%, transparent)" stroke="var(--amber)"/><circle cx="125" cy="125" r="10" fill="var(--amber)"/>' +
    '<text x="125" y="104" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="13" fill="var(--ink)">4</text><text x="125" y="66" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="13" fill="var(--ink)">15</text><text x="125" y="28" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="13" fill="var(--ink)">150</text>' +
    '<line x1="160" y1="118" x2="246" y2="64" stroke="var(--muted)"/><line x1="198" y1="138" x2="246" y2="128" stroke="var(--muted)"/><line x1="235" y1="160" x2="246" y2="192" stroke="var(--muted)"/>' +
    '<text x="250" y="60" font-size="12" font-family="Hind, sans-serif" fill="var(--ink)">' + esc(P(RING.few.name)) + '</text><text x="250" y="74" font-size="10.5" font-family="Hind, sans-serif" fill="var(--muted)">' + T("jo aayenge", "who would come") + '</text><text x="250" y="124" font-size="12" font-family="Hind, sans-serif" fill="var(--ink)">' + esc(P(RING.circle.name)) + '</text><text x="250" y="138" font-size="10.5" font-family="Hind, sans-serif" fill="var(--muted)">' + T("jo banate hain", "who shape you") + '</text><text x="250" y="188" font-size="12" font-family="Hind, sans-serif" fill="var(--ink)">' + esc(P(RING.village.name)) + '</text><text x="250" y="202" font-size="10.5" font-family="Hind, sans-serif" fill="var(--muted)">' + T("chehre aur naam", "faces and names") + "</text></svg>";
  var h = '<div class="card">' + svg + '<p style="margin:8px 0 0"><b>' + T("Teen ghere: 4, 15, 150.", "Three rings: 4, 15, 150.") + "</b> " + T("Insaan ke rishte parton mein hote hain. Research yahi pattern dikhata hai: kuch bahut kareeb, phir lagbhag 15, phir lagbhag 150 jinhe hum chehre aur naam se jaante hain.", "Human ties come in layers. Research on friendship networks finds this pattern: a very few close ones, then about 15, then about 150 we know by face and name.") + "</p></div>";
  h += '<div class="card"><p style="margin:0 0 6px"><b>' + T("Paanch kursiyan: log aapke liye paanch kaam karte hain.", "Five chairs: five things people do for you.") + '</b></p><div class="chairs">' + JOBS.map(function (j) { return '<div class="chair"><span class="j">' + esc(P(j.name)) + '</span><span class="small">' + esc(P(j.what)) + "</span></div>"; }).join("") + "</div></div>";
  h += '<div class="card"><p style="margin:0 0 6px"><b>' + T("Do taraf, aur badalte hue.", "Two sides, always moving.") + "</b></p><ul class=\"said\" style=\"margin:0\"><li>" + T("Aap thaame jaate hain, aur aap thaamte hain. Dono aapke naksha par hain.", "You are held, and you hold. Both are on your map.") + "</li><li>" + T("Ghere badalte hain: aaj ke 4 kal ke 15 ho sakte hain, aur ulta bhi.", "Rings move: today's 4 can be tomorrow's 15, and back again.") + "</li><li>" + T("Yeh barabar nahi hota: aap kisi ke 4 mein ho sakte hain jabki woh aapke 15 mein hain. Yeh normal hai.", "It isn't mutual: you can be in someone's 4 while they're in your 15. That's normal.") + "</li><li>" + T("Aap kai gaon ka hissa hain: parivaar, kaam, building, aastha, dost.", "You belong to several villages: family, work, building, faith, friends.") + "</li></ul></div>";
  return h;
}

/* threshold: add 'how it works' */
viewThreshold = (function (orig) {
  return function () {
    if (V.universe) return '<div class="grow"><p class="eyebrow" style="margin-top:6px">' + T("Thaamne ka naksha", "The map of holding") + "</p>" + universeHTML() + '</div><div class="lookfoot"><button class="btn primary block" data-a="thBegin">' + T("Ab apna dekhiye", "Now see yours") + "</button></div>";
    var h = orig();
    if (S.look.th === 1) h = h.replace('<div class="lookfoot">', '<div class="lookfoot"><button class="btn block" data-a="universe">' + T("Pehle: yeh kaise kaam karta hai (1 min)", "First: how it works (1 min)") + "</button>");
    var door = V.door;
    if (door && S.look.th === 0) h = h.replace('<div class="lookfoot', '<p class="small fadein3">' + esc(door) + '</p><div class="lookfoot');
    return h;
  };
})(viewThreshold);
A.universe = function () { V.universe = true; render(); };
var thBegin0 = A.thBegin; A.thBegin = function (el) { V.universe = false; thBegin0(el); };

/* ---------- 3. Villages ---------- */
LAYERS[3].qs.splice(2, 0, { id: "villages", type: "multi", q: ["Aap kin-kin gaon ka hissa hain? Gaon matlab woh log jinhe aap chehre aur naam se jaante hain.", "Which villages do you belong to? A village is a group of people you know by face and name."], opts: [["family", "Bada parivaar", "Extended family"], ["building", "Building ya mohalla", "Building or neighbourhood"], ["work", "Kaam ki jagah", "Work"], ["faith", "Aastha ka samudaay", "A faith community"], ["school", "School ya college ke dost", "School or college friends"], ["sport", "Khel ya shauk ka group", "A sport or hobby group"], ["online", "Online samudaay", "An online community"], ["home", "Apna gaon ya shahar", "Your hometown"]] });
function villageNames() { var q = LAYERS[3].qs.filter(function (x) { return x.id === "villages"; })[0]; return (S.look.a.villages || []).map(function (v) { var o = q.opts.filter(function (x) { return x[0] === v; })[0]; return o ? (S.lang === "hi" ? o[1] : o[2]) : v; }); }

/* ---------- 4. What each layer adds to the portfolio ---------- */
var GIVES = { 1: ["Pehla naam", "Your first name"], 2: ["Dikhne wale haath", "The hands you noticed"], 3: ["Aapke apne, aur aapka naksha", "Your few, and your map"], 4: ["Aapke gaon aur rhythm", "Your villages and rhythm"], 5: ["Paanch kursiyan", "The five chairs"], 6: ["Jinhe aap thaamte hain", "The people you hold"], 7: ["Chup rishte aur jo saath chalte hain", "Quiet ties, and those carried with you"], 8: ["Jo logon ke alawa thaamta hai", "What holds you beyond people"], 9: ["Jo aap aage le jaate hain", "What you pass on"], 10: ["Jagah jo aap rakhte hain", "A place you keep"] };
revealBody = (function (orig) {
  return function (Ln) {
    var h = orig(Ln);
    if (Ln === 1) {
      var f = withTag("first", people());
      h = h.replace(/<div class="card"><p style="margin:0 0 8px">(?:Chahein toh abhi ek line bhejiye:|If you like, send one line now:)[\s\S]*?<\/a><\/div>/, f.length ? '<div class="card"><p style="margin:0 0 8px">' + T("Is hafte " + esc(f[0]) + " tak pahunchna chahenge? Ek sachchi wajah se: ek photo, ek sawaal, ek plan.", "Want to get in touch with " + esc(f[0]) + " this week? With a real reason: a photo, a question, a plan.") + '</p><button class="btn" data-a="reachTo" data-n="' + esc(f[0]) + '">' + T("Wajah chuniye", "Pick a reason") + "</button></div>" : "");
    }
    if (Ln === 4) { var vn = villageNames(); if (vn.length) h = '<p class="reveal-line">' + T("Aap " + vn.length + " gaon ka hissa hain: ", "You belong to " + vn.length + (vn.length === 1 ? " village: " : " villages: ")) + "<b>" + esc(list(vn)) + "</b>. " + T("Har ek mein kuch log aapko chehre aur naam se jaante hain.", "In each, some people know you by face and name.") + "</p>" + h; }
    return h + '<p class="small" style="margin-top:14px">' + T("Aapke portfolio mein juda: ", "Added to your portfolio: ") + "<b>" + esc(P(GIVES[Ln])) + "</b></p>";
  };
})(revealBody);
A.reachTo = function (el) { openShabd(el.dataset.n); };

/* ---------- 5. Holding portfolio ---------- */
function lockedCard(title, n) { var Ly = LAYERS[n - 1]; return '<div class="card" style="opacity:.75;border-style:dashed"><div class="chiprow" style="justify-content:space-between"><b>' + esc(title) + '</b><span class="tag">' + T("parat ", "layer ") + n + '</span></div><p class="small" style="margin:6px 0 8px">' + T("Parat " + n + " mein khulta hai · lagbhag " + Ly.min + " min", "Opens at layer " + n + " · about " + Ly.min + " min") + '</p><button class="chip" data-a="openLayer" data-n="' + n + '">' + T("Kholiye", "Open it") + "</button></div>"; }
function doneL(n) { return S.look.done.indexOf(n) >= 0; }
function portfolioHTML() {
  var ps = people(), liv = living(ps), one = oneToOne(ps);
  var h = '<p class="small">' + T("Jaise paise ka portfolio dikhata hai ki paisa kahan rakha hai, yeh dikhata hai ki aapka thaamna kahan hai: kahan aap thaame jaate hain, aur kahan aap thaamte hain. Koi score nahi, kuch jeetna nahi.", "Like a money portfolio shows where your money sits, this shows where your holding sits: where you are held, and where you hold. No score, nothing to win.") + "</p>";
  function ringRow(r) { var l = liv.filter(function (p) { return p.ring === r; }), named = l.map(function (p) { return p.name + (p.maybe ? T(" (shayad)", " (maybe)") : ""); }); return '<div class="chair' + (l.length ? "" : " open") + '"><span class="j">' + esc(P(RING[r].name)) + " · " + RING[r].n + '</span><span><span class="n">' + (l.length ? esc(list(named)) : T("abhi koi nahi", "none yet")) + '</span><br><span class="small">' + T(l.length + " naam · aam taur par " + P(RING[r].size), l.length + " named · typically " + P(RING[r].size)) + "</span></span></div>"; }
  if (doneL(3)) h += '<div class="card"><p class="layerpill">' + T("Jahan aap thaame jaate hain", "Where you are held") + '</p><div class="chairs">' + ringRow("few") + ringRow("circle") + ringRow("village") + "</div></div>"; else h += lockedCard(T("Jahan aap thaame jaate hain", "Where you are held"), 3);
  if (doneL(5)) {
    var ch = chairs(ps), filled = ch.filter(function (c) { return c.names.length; }).length, conc = one.filter(function (p) { return p.jobs.length >= 3; });
    h += '<div class="card"><p class="layerpill">' + T("Paanch kursiyan", "The five chairs") + " · " + filled + "/5</p>" + chairsHTML(ps) + (conc.length ? '<p class="small" style="margin:8px 0 0">' + T(conc[0].name + " " + conc[0].jobs.length + " kursiyon par hain. Jab thaamna kai logon mein bata ho, toh woh zyada mazboot hota hai, aur unke liye bhi halka.", conc[0].name + " sits in " + conc[0].jobs.length + " chairs. Holding spread across several people is sturdier, and lighter for them too.") + "</p>" : "") + "</div>";
  } else h += lockedCard(T("Paanch kursiyan", "The five chairs"), 5);
  if (doneL(6)) { var hold = uniq(withTag("leans", ps).concat(withTag("carryout", ps), withTag("learned", ps), withTag("passon", ps))); h += '<div class="card"><p class="layerpill">' + T("Jahan aap thaamte hain", "Where you hold") + '</p><p class="hand" style="font-size:19px;margin:6px 0">' + (hold.length ? esc(list(hold)) : "—") + '</p><p class="small" style="margin:0">' + T("Yeh barabar nahi hota: aap kisi ke 4 mein ho sakte hain jabki woh aapke 15 mein hain.", "It isn't mutual: you may be in someone's 4 while they're in your 15.") + "</p></div>"; } else h += lockedCard(T("Jahan aap thaamte hain", "Where you hold"), 6);
  if (doneL(4)) { var vn = villageNames(); h += '<div class="card"><p class="layerpill">' + T("Aapke gaon", "Your villages") + " · " + vn.length + '</p><p style="margin:6px 0 0">' + (vn.length ? esc(list(vn)) : T("Abhi koi nahi chuna.", "None chosen yet.")) + "</p>" + (S.look.a.place && !isNone(S.look.a.place) ? '<p class="small" style="margin:6px 0 0">' + T("Naam se jaante hain: ", "Known by name at: ") + esc(S.look.a.place) + "</p>" : "") + "</div>"; } else h += lockedCard(T("Aapke gaon", "Your villages"), 4);
  if (doneL(7)) { var qt = uniq(withTag("quiet", ps).concat(withTag("mend", ps))), lost = withTag("lost", ps); h += '<div class="card"><p class="layerpill">' + T("Chup aur saath", "Quiet and carried") + '</p><p style="margin:6px 0 0">' + T("Chup par zinda: ", "Quiet but alive: ") + (qt.length ? esc(list(qt)) : "—") + "</p><p style=\"margin:4px 0 0\">" + T("Saath chalte hain: ", "Carried with you: ") + (lost.length ? esc(list(lost)) : "—") + "</p></div>"; } else h += lockedCard(T("Chup rishte, aur jo saath chalte hain", "Quiet ties, and those carried with you"), 7);
  if (!doneL(8)) h += lockedCard(T("Logon ke alawa kya thaamta hai", "What holds you beyond people"), 8);
  if (!doneL(9)) h += lockedCard(T("Jo aap aage le jaate hain", "What you pass on"), 9);
  if (!doneL(10)) h += lockedCard(T("Jagah jo aap rakhte hain", "A place you keep"), 10);
  var moves = 0; Object.keys(S.ringLog).forEach(function (k) { moves += S.ringLog[k].length; });
  h += '<div class="card"><p class="layerpill">' + T("Badlaav", "Movement") + '</p><p class="small" style="margin:6px 0 0">' + (S.snap ? T("Pehli nazar: ", "First look: ") + new Date(S.snap.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) + " · " : "") + T(moves + " baar kisi ka ghera badla. Ghere badalte rehte hain; yahi zindagi hai.", moves + (moves === 1 ? " ring change" : " ring changes") + " so far. Rings keep moving; that's life.") + "</p></div>";
  return h;
}
viewMap = (function (orig) {
  return function () {
    if (!V.tabInit) { V.tab = "portfolio"; V.tabInit = true; }
    var seg = '<div class="seg">' + [["portfolio", "Portfolio", "Portfolio"], ["web", "Jaal", "Web"], ["kept", "Jinhone rakha", "Kept by"], ["around", "Aas-paas", "Around me"]].map(function (s) { return '<button data-a="mapTab" data-t="' + s[0] + '" aria-pressed="' + (V.tab === s[0]) + '">' + T(s[1], s[2]) + "</button>"; }).join("") + "</div>";
    var head = '<p class="eyebrow">' + T("Naksha", "Map") + '</p><h1 class="q" style="font-size:25px">' + T("Aapka thaamne ka portfolio", "Your holding portfolio") + "</h1>";
    if (V.tab === "portfolio") return head + seg + portfolioHTML();
    return orig().replace(/<div class="seg">[\s\S]*?<\/div>/, seg);
  };
})(viewMap);

/* ---------- 6. Rings move; holding isn't mutual ---------- */
var setRing0 = A.setRing;
A.setRing = function (el) { var k = el.dataset.k, p = people(true).filter(function (x) { return x.key === k; })[0]; S.ringLog[k] = (S.ringLog[k] || []).concat([{ d: dstr(), from: p ? p.ring : "", to: el.dataset.r }]); setRing0(el); };
openPerson = (function (orig) {
  return function (key) {
    orig(key);
    var sh = document.querySelector(".sheet"); if (!sh) return;
    var log = S.ringLog[key] || [], div = document.createElement("div");
    div.innerHTML = (log.length ? '<p class="small" style="margin:12px 0 0"><b>' + T("Ghere ka safar", "How this tie has moved") + "</b><br>" + log.map(function (x) { return esc(x.d) + ": " + esc(P((RING[x.from] || { name: [x.from, x.from] }).name)) + " → " + esc(P(RING[x.to].name)); }).join("<br>") + "</p>" : "") + '<p class="small" style="margin:10px 0 0">' + T("Ghere badalte hain, aur barabar nahi hote. Aap unke naksha par kahan hain, yeh sirf unka naksha bata sakta hai.", "Rings move, and they aren't mutual. Where you sit on their map, only their map can say.") + "</p>";
    sh.insertBefore(div, sh.lastElementChild);
  };
})(openPerson);
nudges = (function (orig) {
  return function () {
    var out = orig(), wks = Object.keys(S.checkins).sort().slice(-3), count = {};
    wks.forEach(function (w) { (S.checkins[w].held || []).forEach(function (n) { count[n] = (count[n] || 0) + 1; }); });
    people().forEach(function (p) { if (count[p.name] >= 2 && p.ring !== "few" && !p.lost && !p.group) { var k = "move:" + p.key + ":" + weekKey(); if (!S.nudgeSeen[k] && !S.nudgeOff.move) out.push({ k: k, kind: "move", title: T(p.name + " ne kai hafte thaama. Unhe kareeb rakhein?", p.name + " has held you several weeks running. Move them closer?"), why: T("Aapke hafte ke minute mein " + count[p.name] + " baar aaye.", "They came up in " + count[p.name] + " of your weekly minutes."), act: "move", person: p.key }); } });
    return out.slice(0, 2);
  };
})(nudges);
var nudgeGo0 = A.nudgeGo;
A.nudgeGo = function (el) { if (el.dataset.act === "move") { S.nudgeSeen[el.dataset.k] = 1; save(); openPerson(el.dataset.p); return; } if (el.dataset.act === "line") { S.nudgeSeen[el.dataset.k] = 1; save(); openShabd(el.dataset.p); return; } nudgeGo0(el); };

/* ---------- 7. Doors: every episode, book and course is an entry ---------- */
var BOOK_LAYER = { coherence: 5, village: 4, noht: 10, tps: 8, tdor: 9, lhq: 6 };
ROUTES.push("course");
route = (function (orig) {
  return function () {
    var h = (location.hash || "").replace("#", ""), m = /^book-(\w+)$/.exec(h);
    if (m && BOOK_LAYER[m[1]]) { var b = N.books.filter(function (x) { return x.id === m[1]; })[0]; V.door = T("Aap \"" + b.title + "\" se aaye hain. Yeh kitaab parat " + BOOK_LAYER[m[1]] + " se judti hai.", "You came from \"" + b.title + "\". This book connects to layer " + BOOK_LAYER[m[1]] + "."); if (S.look.unlocked) { startLayer(BOOK_LAYER[m[1]]); } location.replace("#look"); return; }
    if (h === "course") { V.door = T("Aap ek course se aaye hain. Pehle apni nazar; course ki baatein usi par tikengi.", "You came from a course. Take your own look first; the course builds on it."); location.replace("#look"); return; }
    orig();
  };
})(route);

/* ---------- 8. Learn: the universe first, and words to talk about it ---------- */
viewLearn = (function (orig) {
  return function () {
    var h = orig();
    var top = '<p class="eyebrow" style="margin-top:4px">' + T("Thaamne ka naksha", "The map of holding") + "</p>" + universeHTML() +
      '<details class="learn"><summary><b>' + T("Iske baare mein baat kaise karein", "How to talk about it") + '</b><span class="small">' + T("kholiye", "open") + '</span></summary><div class="body"><p style="margin:0 0 6px">' + T("Log akelepan aur thakaan ki baat karte hain. Thaamne ki kami ke liye shabd kam hain. Yeh kuch hain:", "People talk about loneliness and burnout. There are few words for missing holding. Here are some:") + '</p><ul class="said" style="margin:0"><li>' + T("\"Aajkal tumhare 4 kaun hain?\"", "\"Who are your four these days?\"") + "</li><li>" + T("\"Shift ke baad mera daayra patla ho gaya.\"", "\"My circle got thin after the move.\"") + "</li><li>" + T("\"Mere paas sach bolne wala koi nahi raha.\"", "\"I'm missing someone who tells me the truth.\"") + "</li><li>" + T("\"Yeh hamara paatra hai: Itvaar ka khaana.\"", "\"Sunday lunch is our vessel.\"") + "</li></ul></div></details>";
    h = h.replace(/(<h1 class="q"[^>]*>[\s\S]*?<\/h1>)/, "$1" + top);
    return h.replace(/<a class="btn" target="_blank" rel="noopener" href="([^"]+)">(See the book|Kitaab dekhiye)<\/a><\/details>/g, function (m0, url, lbl) { return m0; });
  };
})(viewLearn);

/* ---------- 9. What Neev has learned, visible and erasable ---------- */
viewKnows = (function (orig) {
  return function () {
    var v = S.voice, used = Object.keys(v.reasons).filter(function (k) { return v.reasons[k]; }).map(function (k) { return P(reasonById(k).name) + " ×" + v.reasons[k]; });
    var card = '<div class="card"><b>' + T("Neev ne aapse kya seekha", "What Neev has learned from you") + '</b><p class="small" style="margin:6px 0">' + T("Sirf is phone par. AI ko kabhi nahi bheja jaata.", "Only on this phone. Never sent to the AI.") + "</p><p style=\"margin:0\">" + T("Wajahen jo aap use karte hain: ", "Reasons you use: ") + (used.length ? esc(used.join(", ")) : "—") + '</p><p style="margin:4px 0 0">' + T("Aapke apne shabd: ", "Your own openers: ") + (v.openers.length ? esc(v.openers.length + "") : "—") + '</p><p style="margin:4px 0 0">' + T("Jo aapne mana kiya: ", "Things you turned down: ") + esc(Object.keys(v.notfor).length + Object.keys(v.skipActs).length + "") + '</p><button class="btn ghost" style="margin-top:8px" data-a="forgetVoice">' + T("Yeh sab bhool jaaiye", "Forget all of this") + "</button></div>";
    return orig().replace('<div class="card"><b>' + T("Saajha phone?", "Shared phone?"), card + '<div class="card"><b>' + T("Saajha phone?", "Shared phone?"));
  };
})(viewKnows);
A.forgetVoice = function () { S.voice = { reasons: {}, openers: [], notfor: {}, skipActs: {}, noRush: true }; save(); render(); toast(T("Bhool gaya.", "Forgotten.")); };

/* ---------- small wiring ---------- */
actCard = (function (orig) {
  return function () {
    var h = orig(), a = S.today;
    if (a.reach && !a.done) h = h.replace(/<\/div>$/, '<button class="btn primary block" style="margin-top:12px" data-a="reachTo" data-n="' + esc(a.person) + '">' + T("Wajah aur shabd chuniye", "Pick a reason and words") + "</button></div>");
    if (!a.done) h = h.replace('<div class="chiprow">' + srcChip({ _tier: a.src, _fell: a.fell }), '<div class="chiprow">' + srcChip({ _tier: a.src, _fell: a.fell }) + '<button class="chip" data-a="actNot">' + T("Yeh mere liye nahi", "Not for me") + "</button>");
    return h;
  };
})(actCard);
startOptions = (function (orig) {
  return function () { return orig().map(function (o) { if (o.k === "few") o.act = T(o.person + " ko teen minute ka phone. Ek baat saath rakhiye: koi khabar, sawaal ya plan.", "Call " + o.person + " for three minutes. Bring one thing: some news, a question, a plan."); if (o.k === "quiet") o.act = T(o.person + " se is hafte baat kijiye, ek sachchi wajah se: ek photo, ek sawaal, ek plan.", "Get in touch with " + o.person + " this week, with a real reason: a photo, a question, a plan."); return o; }); };
})(startOptions);
A.phPick = function (el) { var n = el.dataset.n; setToday({ person: n, job: jobFor(n), text: T(n + " se is hafte baat kijiye. Ek sachchi wajah chuniye.", "Get in touch with " + n + " this week. Pick a real reason.") }); S.today.reach = true; S.lastOpen = nowMs(); save(); go("aaj"); };
cardText = (function (orig) { return function () { if (V.card === "line") return T("Aajkal tumhare 4 kaun hain? Chhe minute ki ek nazar.", "Who are your four these days? A six-minute look."); return orig(); }; })(cardText);
TASKS.splice(4, 0, ["shabd", "Get in touch with someone using a reason that's real for you"]);
TASKS.push(["portfolio", "Open your portfolio and find what opens at the next layer"]);
var mapTab0 = A.mapTab; A.mapTab = function (el) { if (el.dataset.t === "portfolio") task("portfolio"); mapTab0(el); };


