/* Neev v6 · The Coherence Audit: "The First Thread"
   A rite, not a form. Every reflection is built from what the person did or said (specificity),
   every universal line is labelled as universal ("almost everyone"), and the machinery is disclosed at the end. */

(function () {
  var css = document.createElement("style");
  css.textContent = ".au{display:flex;flex-direction:column;flex:1 0 auto;padding-top:4px}.au .grow{flex:1}.au .beat{margin:0}.au .uni{border-left:2px solid var(--amber);padding:2px 0 2px 12px;color:var(--muted);font-size:15.5px;margin:18px 0 0}.au .mine{font-family:var(--f-hand);font-size:22px;color:var(--amber);line-height:1.3}.au .obs{font-size:17px;margin:16px 0 0;line-height:1.5}.au .obs b{color:var(--amber);font-weight:500}.thread{display:block;width:100%;height:26px;margin:2px 0 6px}.au .cue{min-height:48px;font-family:var(--f-display);font-size:21px;line-height:1.3;transition:opacity .4s}.au .opts{display:flex;flex-direction:column;gap:8px;margin-top:14px}.au .opts .btn{justify-content:flex-start;text-align:left}.au .opts .btn.on{border-color:var(--amber);color:var(--amber)}.au .seg4{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:8px}.au .seg4 .chip{justify-content:center;min-height:40px}.au .chairrow{border-top:1px solid var(--line);padding:12px 0}.au .chairrow:first-child{border-top:0}.au .glow{font-family:var(--f-hand);font-size:34px;color:var(--amber);text-shadow:0 0 24px color-mix(in srgb,var(--amber) 55%,transparent);margin:6px 0}.au .tiny{font-size:13px;color:var(--faint)}.au details.how{margin-top:12px}.au details.how li{margin:4px 0}.au .web{width:100%;height:auto;display:block;margin:4px 0}.au .lookbar .pill{margin-left:auto}@media (prefers-reduced-motion: reduce){.au .cue{transition:none}}";
  document.head.appendChild(css);
})();

var AU_STEPS = ["threshold", "why", "first", "firstSeen", "names", "sort", "mirror", "rings", "chairs", "chairsSeen", "both", "villages", "gap", "reach", "when", "covenant", "seed", "end"];
function auFresh() { return { step: 0, reason: "", verbatim: "", first: "", fx: null, names: [], cueOf: {}, sortI: 0, warm: {}, last: {}, chairs: { settle: [], sharpen: [], carry: [], belong: [], aim: [] }, answerFor: [], villages: [], gap: "", sent: false, when: "", covenant: false, seed: "", done: false, at: 0, seedSeen: "" }; }
fresh = (function (orig) { return function () { var f = orig(); f.audit = auFresh(); return f; }; })(fresh);
if (!S.audit) S.audit = auFresh();
var AU = function () { return S.audit; };
function auStep() { return AU_STEPS[AU().step]; }
function auGo(name) { AU().step = AU_STEPS.indexOf(name); save(); render(); var s = $("#screen"); if (s) s.scrollTop = 0; }
function auNext() { auGo(AU_STEPS[Math.min(AU().step + 1, AU_STEPS.length - 1)]); }
function auKey(n) { return canon(n).toLowerCase(); }

/* the names the audit has, as an ordinary list (first name included) */
function auAll() { var a = AU(), out = a.first ? [a.first] : []; a.names.forEach(function (n) { if (out.map(auKey).indexOf(auKey(n)) < 0) out.push(n); }); return out; }
function auLiving() { return auAll().filter(function (n) { return AU().warm[auKey(n)] !== "gone"; }); }
function auByWarm(w) { return auAll().filter(function (n) { return AU().warm[auKey(n)] === w; }); }
function auByRing(r) { return auAll().filter(function (n) { return auRingOf(n) === r; }); }

/* ---------- universal lines: each is true of nearly everyone, and says so ---------- */
var UNI = {
  held: ["Aaj zinda har insaan ko kabhi kisi ne thaama tha. Kisi ne khilaaya, uthaaya, naam diya.", "Every person alive was once held by someone. Someone fed them, carried them, gave them a name."],
  quick: ["Lagbhag sabko pehle kuch naam jaldi milte hain. Baaki der se aate hain. Dono sahi hain.", "Almost everyone finds the first few names quickly. The rest come slower. Both are right."],
  knot: ["Agar koi uljha hua naam aaya, rakhiye. Uljhe rishte bhi thaamte hain.", "If a complicated name surfaced, keep it. Complicated people still hold us."],
  drift: ["Lagbhag har naksha aisa hi dikhta hai. Dhyaan shor ke peeche jaata hai, pyaar ke peeche nahi. Aap mein kuch toota nahi hai. Bas ab aap dekh sakte hain, aur jo dikhta hai, use sambhala ja sakta hai.", "Almost every web looks like this. Attention follows what's loud, not what's dear. Nothing in you is broken. Now you can see it, and what you can see, you can tend."],
  chairs: ["Lagbhag har zindagi mein koi kursi kabhi na kabhi khaali hoti hai. Khaali kursi faisla nahi, ek jagah hai jahan koi baith sakta hai.", "Almost every life has a chair standing empty at some point. An open chair isn't a verdict. It's a place someone could sit."],
  both: ["Thaamna barabar nahi hota, aur hona zaroori bhi nahi. Bahut mumkin hai ki aap kisi ke 4 mein hain aur aapko pata bhi nahi.", "Holding isn't mutual, and doesn't need to be. Chances are you sit in someone's four without knowing it."],
  reach: ["Research batata hai ki log kam aankte hain ki achanak aaye ek chhote message ki doosre kitni kadar karte hain.", "Research finds people underestimate how much others appreciate an unexpected small message."]
};
function uni(id) { return '<p class="uni">' + esc(P(UNI[id])) + "</p>"; }

/* ---------- the thread: progress that extends, never fills ---------- */
function threadSVG() {
  var i = AU().step, n = AU_STEPS.length - 1, x = 12 + (i / n) * 316, end = i === n;
  return '<svg class="thread" viewBox="0 0 340 26" aria-hidden="true"><circle cx="12" cy="13" r="4.5" fill="var(--amber)"/>' +
    '<path d="M12 13 C ' + (12 + (x - 12) * 0.33) + ' 4, ' + (12 + (x - 12) * 0.66) + ' 22, ' + x + ' 13" fill="none" stroke="var(--amber)" stroke-width="1.6" stroke-linecap="round" style="transition:all .6s"/>' +
    (end ? '<circle cx="328" cy="13" r="4.5" fill="var(--amber)"/>' : '<circle cx="328" cy="13" r="4" fill="none" stroke="var(--line)" stroke-width="1.4"/>') + "</svg>";
}
function auBar(back) {
  return '<div class="lookbar">' + (back !== false && AU().step > 0 ? '<button class="iconbtn" data-a="auBack" aria-label="' + T("Peeche", "Back") + '">←</button>' : '<span style="width:44px"></span>') + '<span class="where">' + T("Thaamne ki jaanch", "The coherence audit") + '</span><button class="pill" data-a="auPause">' + T("Abhi nahi", "Not now") + "</button></div>" + threadSVG();
}
function foot(inner) { return '<div class="lookfoot">' + inner + "</div>"; }
function btnNext(label, a) { return '<button class="btn primary block" data-a="' + (a || "auNext") + '">' + esc(label) + "</button>"; }

/* ---------- the web: drawn from their own answers ---------- */
var REC_OP = { d: 1, w: 0.8, m: 0.45, y: 0.2 };
var RING_R = { few: 52, circle: 96, village: 138 };
function auRingOf(n) { var w = AU().warm[auKey(n)]; if (w !== "gone" && GROUP_RE.test(n)) return "village"; return w === "come" ? "few" : (w === "answer" || w === "knot") ? "circle" : w === "gone" ? "gone" : "village"; }
function webSVG(opts) {
  opts = opts || {};
  var groups = { few: [], circle: [], village: [], gone: [] };
  auAll().forEach(function (n) { groups[auRingOf(n)].push(n); });
  var s = '<svg class="web" viewBox="0 0 340 330" role="img" aria-label="' + T("Aapka thaamne ka jaal", "Your web of holding") + '">';
  ["village", "circle", "few"].forEach(function (r) { s += '<circle cx="170" cy="165" r="' + RING_R[r] + '" fill="none" stroke="var(--line)" stroke-dasharray="' + (r === "village" ? "2 4" : "none") + '"/>'; });
  ["few", "circle", "village"].forEach(function (r, ri) {
    var g = groups[r], R = RING_R[r];
    g.forEach(function (n, i) {
      var ang = -Math.PI / 2 + (i / Math.max(g.length, 1)) * Math.PI * 2 + ri * 0.55, x = 170 + R * Math.cos(ang), y = 165 + R * Math.sin(ang);
      var k = auKey(n), op = REC_OP[AU().last[k]] || 0.6, knot = AU().warm[k] === "knot", hi = opts.glow && k === auKey(opts.glow);
      s += '<line x1="170" y1="165" x2="' + x.toFixed(1) + '" y2="' + y.toFixed(1) + '" stroke="var(--amber)" stroke-opacity="' + op + '" stroke-width="' + (hi ? 2.4 : 1.3) + '"' + (knot ? ' stroke-dasharray="3 3"' : "") + "/>";
      s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (hi ? 7 : 5) + '" fill="' + (hi ? "var(--amber)" : "var(--surface)") + '" stroke="var(--amber)" stroke-opacity="' + Math.max(op, 0.35) + '"/>';
      var lab = n.length > 12 ? n.slice(0, 11) + "…" : n, anchor = x < 150 ? "end" : x > 190 ? "start" : "middle", dx = anchor === "end" ? -9 : anchor === "start" ? 9 : 0, dy = anchor === "middle" ? (y < 165 ? -10 : 18) : 4;
      s += '<text x="' + (x + dx).toFixed(1) + '" y="' + (y + dy).toFixed(1) + '" text-anchor="' + anchor + '" font-size="11.5" font-family="Hind, sans-serif" fill="var(--ink)" fill-opacity="' + Math.max(op, 0.55) + '">' + esc(lab) + "</text>";
    });
  });
  s += '<circle cx="170" cy="165" r="9" fill="var(--amber)"/><text x="170" y="191" text-anchor="middle" font-size="11" font-family="IBM Plex Mono, monospace" fill="var(--muted)">' + T("aap", "you") + "</text>";
  if (groups.gone.length) s += '<text x="170" y="324" text-anchor="middle" font-size="11.5" font-family="Hind, sans-serif" fill="var(--muted)">' + esc(T("Saath chalte hain: ", "Carried with you: ") + list(groups.gone)) + "</text>";
  return s + "</svg>";
}

/* ---------- reasons people come ---------- */
var WHY = [
  ["drift", "Koi door ho gaya, aur maine hone diya.", "Someone drifted, and I let it happen."],
  ["moved", "Main shift hua. Sab badal gaya.", "I moved. Everything changed."],
  ["gone", "Koi chala gaya.", "Someone is gone."],
  ["knot", "Ek rishta abhi uljha hua hai.", "A relationship is complicated right now."],
  ["busy", "Itna busy hoon ki logon ke liye waqt nahi.", "I'm so busy there's no time for people."],
  ["fine", "Sab theek hai. Bas dekhna chahta tha.", "I'm fine. Just curious."],
  ["pull", "Pata nahi. Bas ek khinchaav.", "I don't know. A pull."]
];
var CUES = [
  ["Aakhri baar kiske saath khaana khaaya?", "Who did you last share a meal with?"],
  ["Kiske message aap sabse pehle kholte hain?", "Whose messages do you open first?"],
  ["Agar aap chup ho jaayein, kaun notice karega?", "If you went quiet, who would notice?"],
  ["Kisne aapko kuch sikhaya jo aap aaj bhi karte hain?", "Who taught you something you still use?"],
  ["Kisse aap kabhi bahut kareeb the?", "Who were you close to, once?"],
  ["Kise aap har hafte bina plan kiye dekhte hain?", "Who do you see every week without planning to?"],
  ["Aapka koi group: parivaar, team, dost?", "A group of yours: family, a team, friends?"]
];
var WARM = [["come", "Woh aa jaayenge", "They'd come"], ["answer", "Woh phone uthaayenge", "They'd pick up"], ["knot", "Uljha hua hai", "It's complicated"], ["nocall", "Main phone nahi karunga", "I wouldn't call them"]];
var LAST = [["d", "Din", "Days"], ["w", "Hafte", "Weeks"], ["m", "Mahine", "Months"], ["y", "Saal", "Years"]];
var LAST_W = { d: ["kuch din", "a few days"], w: ["kuch hafte", "a few weeks"], m: ["mahine", "months"], y: ["saal", "years"] };
var CH = [["settle", "night"], ["sharpen", "truth"], ["carry", "called"], ["belong", "weekly"], ["aim", "bigger"]];

/* ---------- screens ---------- */
function viewAudit() {
  var a = AU(), st = auStep(), h = "";
  if (V.auPaused) return '<div class="au">' + auBar(false) + '<div class="grow"><p class="beat">' + T("Aapka jaal wahin hai jahan chhoda tha.", "Your web is where you left it.") + '</p><p class="sub">' + T("Jo likha, is phone par hai. Jab chahein, wahin se.", "What you wrote stays on this phone. Pick up from the same place, whenever.") + "</p></div>" + foot(btnNext(T("Aage badhiye", "Continue"), "auResume")) + "</div>";
  var door = V.door || (S.look.fromEp ? T("Aap episode " + S.look.fromEp + " se aaye hain.", "You came from episode " + S.look.fromEp + ".") : "");

  if (st === "threshold") {
    if (!V.auTh) return '<div class="au">' + threadSVG() + '<div class="grow" style="padding-top:12vh"><p class="beat fadein">' + T("Kuch, ya koi, aapko yahan laaya hai.", "Something, or someone, brought you here.") + '</p><p class="beat fadein2" style="margin-top:22px;color:var(--muted)">' + T("Shuru karne ke liye itna kaafi hai.", "That's all we need to begin.") + "</p>" + (door ? '<p class="small fadein3" style="margin-top:22px">' + esc(door) + "</p>" : "") + "</div>" + foot(btnNext(T("Aage", "Go on"), "auTh")) + "</div>";
    return '<div class="au">' + threadSVG() + '<div class="grow" style="padding-top:6vh"><p class="beat fadein">' + T("Aap apni zindagi jaante hain.", "You know your life.") + '</p><p class="beat fadein2" style="margin-top:14px">' + T("Par kya aapne kabhi dekha hai ki use thaame kaun hai?", "But have you ever seen what holds it up?") + '</p><p class="sub fadein3">' + T("Saat minute. Koi test nahi, koi score nahi. Aap kuch naam likhenge aur kuch tap karenge. Aakhir mein aapke paas ek naksha hoga, aur ek dhaaga jo aap kisi ki taraf phenkenge.", "Seven minutes. No test, no score. You'll write some names and tap some answers. At the end you'll have a map, and one thread you cast towards someone.") + "</p>" + uni("held") + "</div>" + foot(btnNext(T("Shuru kijiye", "Begin"))) + "</div>";
  }
  if (st === "why") {
    h = '<p class="beat">' + T("Aapko yahan kya laaya?", "What brought you here?") + '</p><p class="sub">' + T("Sabse kareeb wala chuniye, ya apne shabdon mein.", "Pick the closest, or say it your way.") + '</p><div class="opts">' + WHY.map(function (w) { return '<button class="btn' + (a.reason === w[0] ? " on" : "") + '" data-a="auWhy" data-w="' + w[0] + '">' + T(w[1], w[2]) + "</button>"; }).join("") + '</div><label class="f" for="auWhyText">' + T("Ya apne shabd (sirf is phone par)", "Or your own words (stays on this phone)") + '</label><input class="t" id="auWhyText" value="' + esc(a.reason === "own" ? a.verbatim : "") + '" placeholder="' + T("Jo bhi sach ho", "Whatever is true") + '">';
    return '<div class="au">' + auBar() + '<div class="grow">' + h + "</div>" + foot(btnNext(T("Aage", "Continue"), "auWhyGo")) + "</div>";
  }
  if (st === "first") {
    V.auT0 = V.auT0 || performance.now();
    h = '<p class="eyebrow">' + T("Raat ke 2:40", "2:40 at night") + '</p><p class="beat">' + T("Aapka phone bajta hai. Kuch hua hai. Aap ek hi insaan ko phone kar sakte hain.", "Something has happened. You can call one person.") + '</p><p class="beat" style="margin-top:14px;color:var(--amber)">' + T("Kaun?", "Who?") + '</p><p class="sub">' + T("Woh naam nahi jo hona chahiye. Woh jo aata hai.", "Not the name you should say. The one that arrives.") + '</p><input class="t" id="auFirst" autocomplete="off" value="' + esc(a.first) + '" data-autofocus aria-label="' + T("Naam", "Name") + '"><p class="tiny" style="margin-top:8px">' + T("Naam is phone se kabhi bahar nahi jaate.", "Names never leave this phone.") + "</p>";
    return '<div class="au">' + auBar() + '<div class="grow">' + h + "</div>" + foot(btnNext(T("Yahi naam", "That's the name"), "auFirstGo") + '<button class="btn ghost block" data-a="auFirstNone">' + T("Koi naam nahi aaya", "No name came") + "</button>") + "</div>";
  }
  if (st === "firstSeen") {
    var fx = a.fx || {}, n = a.first, s = (fx.ms / 1000);
    if (!n) {
      h = '<p class="beat">' + T("Khaali jagah bhi ek jawab hai.", "An empty space is an answer too.") + '</p><p class="obs">' + T("Kai log is sawaal par ruk jaate hain. Iska matlab yeh nahi ki koi nahi hai. Kabhi kabhi naam ko aane mein waqt lagta hai. Agle kadam mein hum dheere chalenge.", "Many people pause here. It doesn't mean there is no one. Sometimes a name takes longer to arrive. The next step goes slower.") + "</p>";
    } else {
      var obs = fx.ms == null ? "" : s < 2.5 ? T("Aapne " + s.toFixed(1) + " second mein likhna shuru kiya. Yeh naam socha nahi gaya. Yeh pehle se wahan tha.", "You started typing within " + s.toFixed(1) + " seconds. That name wasn't thought of. It was already there.") : s < 9 ? T("Aapne kuch second liye. Kuch naam aate hain, kuch chune jaate hain. Dono imaandaar hain.", "You took a few seconds. Some names arrive; some are chosen. Both are honest.") : T("Aapne waqt liya. Kabhi pehla naam kai naamon ke beech ek faisla hota hai. Yeh bhi dekhne layak hai.", "You took your time. Sometimes the first name is a choice between several. That's worth noticing too.");
      var ed = fx.edits ? '<p class="obs">' + T("Aapne kuch likha, mitaaya, phir yeh likha. Neev ne mitaaya hua naam nahi rakha.", "You wrote something, erased it, and wrote this. Neev kept nothing you erased.") + "</p>" : "";
      h = '<p class="mine">' + esc(n) + '</p><p class="obs">' + obs + "</p>" + ed + '<p class="obs">' + T("Yahin se thaamna shuru hota hai: ek naam jo bina bulaaye aata hai.", "This is where holding starts: a name that arrives without being asked.") + '</p><p class="tiny" style="margin-top:16px">' + T("Neev ne sirf yeh dekha ki kitna waqt laga, is phone par. Aur kuch nahi.", "Neev noticed only how long it took, on this phone. Nothing else.") + "</p>";
    }
    return '<div class="au">' + auBar() + '<div class="grow">' + h + "</div>" + foot(btnNext(T("Aage", "Continue"))) + "</div>";
  }
  if (st === "names") {
    var ci = V.auCue || 0, cnt = a.names.length;
    h = '<p class="beat">' + T("Ab, jo bhi naam aayein. Ek ek karke.", "Now, whatever names come. One at a time.") + '</p><p class="sub">' + T("Log, ya group. Har naam ke baad Enter.", "People, or groups. Enter after each.") + '</p><div class="card" style="margin-top:14px"><p class="tiny" style="margin:0 0 4px">' + T("Ek ishaara", "A cue") + '</p><p class="cue" id="auCue">' + esc(P(CUES[ci % CUES.length])) + '</p><button class="chip" data-a="auCueNext">' + T("Doosra ishaara", "Another cue") + '</button></div><div class="row" style="margin-top:12px"><input class="t" id="auName" autocomplete="off" data-autofocus placeholder="' + T("Naam", "A name") + '" aria-label="' + T("Naam", "A name") + '"><button class="btn" data-a="auAdd">' + T("Jodiye", "Add") + '</button></div><div class="chiprow" id="auNames" style="margin-top:10px">' + a.names.map(function (n, i) { return '<button class="chip on" data-a="auDel" data-i="' + i + '" aria-label="' + T("Hataaiye ", "Remove ") + esc(n) + '">' + esc(n) + " ×</button>"; }).join("") + "</div>" + (cnt >= 3 ? uni("quick") : "") + (cnt >= 6 ? uni("knot") : "");
    var lbl = cnt === 0 && !a.first ? T("Abhi koi nahi", "No one yet") : cnt < 3 ? T("Bas itne", "That's enough") : T("Bas itne (" + (cnt + (a.first ? 1 : 0)) + " naam)", "That's enough (" + (cnt + (a.first ? 1 : 0)) + " names)");
    return '<div class="au">' + auBar() + '<div class="grow">' + h + "</div>" + foot(btnNext(lbl, "auNamesGo") + (cnt < 3 ? '<p class="tiny" style="text-align:center;margin:0">' + T("Ek naam bhi ek jaal hai.", "Even one name is a web.") + "</p>" : "")) + "</div>";
  }
  if (st === "sort") {
    var all = auAll(), i = Math.min(a.sortI, all.length - 1), n2 = all[i], k = auKey(n2), w = a.warm[k], l = a.last[k];
    h = '<p class="tiny">' + (i + 1) + " / " + all.length + '</p><p class="mine" style="margin-top:4px">' + esc(n2) + '</p><p class="beat" style="font-size:23px;margin-top:8px">' + T("Raat 2:40 par agar aap inhe phone karein...", "If you called them at 2:40 at night...") + '</p><div class="opts">' + WARM.map(function (o) { return '<button class="btn' + (w === o[0] ? " on" : "") + '" data-a="auWarm" data-w="' + o[0] + '">' + T(o[1], o[2]) + "</button>"; }).join("") + '<button class="chip" style="align-self:flex-start" data-a="auWarm" data-w="gone">' + T("Woh ab nahi rahe", "They're no longer alive") + "</button></div>";
    if (w && w !== "gone") h += '<p class="beat" style="font-size:20px;margin-top:20px">' + T("Aakhri baar sach mein baat kab hui?", "When did you last really talk?") + '</p><div class="seg4">' + LAST.map(function (o) { return '<button class="chip' + (l === o[0] ? " on" : "") + '" data-a="auLast" data-l="' + o[0] + '">' + T(o[1], o[2]) + "</button>"; }).join("") + "</div>";
    return '<div class="au">' + auBar() + '<div class="grow">' + h + "</div></div>";
  }
  if (st === "mirror") {
    var cap = a.verbatim ? '<p class="small" style="margin:0">' + T("Aap aaye kyunki:", "You came because:") + '</p><p class="mine" style="font-size:20px;margin:2px 0 0">"' + esc(a.verbatim) + '"</p>' : "";
    var warm = auByWarm("come").concat(auByWarm("answer")), far = warm.filter(function (n) { var l2 = a.last[auKey(n)]; return l2 === "m" || l2 === "y"; });
    var obs2 = a.reason === "gone" ? T("Jo chale gaye, woh bhi aapke jaal mein hain, saath chalte hue. Dukh koi kami nahi jise theek karna ho.", "Those who are gone are on your web too, carried with you. Grief isn't a gap to fix.") : far.length ? T(warm.length + " log aapke liye aayenge ya phone uthaayenge. Unmein se " + far.length + " (" + list(far) + ") se mahinon ya saalon se sach mein baat nahi hui.", warm.length + (warm.length === 1 ? " person would come or pick up for you. " : " people would come or pick up for you. ") + "With " + far.length + " of them (" + list(far) + "), you haven't really talked in months or years.") : warm.length ? T("Jo aapke liye aayenge, unse aapki baat abhi zinda hai. Yeh aam nahi hai.", "With the people who'd come for you, the talk is still alive. That's less common than it sounds.") : T("Abhi koi naam 'aayenge' ya 'uthaayenge' mein nahi aaya. Yeh bhi ek tasveer hai, faisla nahi.", "No one landed in 'would come' or 'would pick up' yet. That's a snapshot, not a verdict.");
    h = cap + webSVG() + '<p class="obs">' + esc(obs2) + "</p>" + (a.reason === "gone" ? "" : uni("drift"));
    return '<div class="au">' + auBar() + '<div class="grow">' + h + "</div>" + foot(btnNext(T("Is aakaar ka matlab", "What this shape means"))) + "</div>";
  }
  if (st === "rings") {
    var few = auByRing("few"), circ = auByRing("circle"), vil = auByRing("village");
    function row(t, nm, size, names) { return '<div class="chairrow"><b>' + t + " · " + nm + '</b><p class="small" style="margin:2px 0 4px">' + size + '</p><p style="margin:0">' + (names.length ? esc(list(names)) : '<span class="small">' + T("abhi koi nahi", "none yet") + "</span>") + "</p></div>"; }
    h = '<p class="beat" style="font-size:25px">' + T("Aapne jo banaya, uska aakaar insaanon mein ek jaisa hai.", "What you just drew has a shape humans share.") + '</p><div class="card" style="margin-top:12px">' + row(T("Aapke apne", "Your few"), "~4", T("Jo aayenge. Zyaadatar logon ke lagbhag 4 hote hain (3 se 5).", "Who would come. Most people have about 4 (3 to 5)."), few) + row(T("Daayra", "Your circle"), "~15", T("Jo uthaayenge, jo aapko banate hain. Lagbhag 15.", "Who'd pick up, who shape you. About 15."), circ) + row(T("Gaon", "Your village"), "~150", T("Chehre aur naam. Lagbhag 150.", "Faces and names. About 150."), vil) + '</div><p class="small">' + T("Yeh sankhyaayein research se hain ki logon ke rishte kaise parton mein jamte hain. Yeh ausat hain, lakshya nahi. Kam hona haar nahi, jaankari hai.", "These numbers come from research on how people's ties cluster in layers. They're averages, not targets. Fewer isn't failure; it's information.") + '</p><div class="card"><b>' + T("Coherence kya hai", "What coherence is") + '</b><p style="margin:6px 0 0">' + T("Coherence tab hai jab jo log aapko thaamte hain, aur jahan aapka dhyaan jaata hai, dono ek hi kahani kehte hain.", "Coherence is when the people who hold you and the places your attention goes tell the same story.") + "</p></div>";
    return '<div class="au">' + auBar() + '<div class="grow">' + h + "</div>" + foot(btnNext(T("Ab: woh aapke liye kya karte hain", "Next: what they do for you"))) + "</div>";
  }
  if (st === "chairs") {
    var lv = auLiving();
    h = '<p class="beat" style="font-size:25px">' + T("Log aapke liye paanch alag kaam karte hain. Paanch kursiyan.", "People do five different things for you. Five chairs.") + '</p><p class="sub">' + T("Har kursi par jo baithte hain, unhe tap kijiye. Koi nahi ho toh chhod dijiye.", "Tap whoever sits in each chair. Leave it empty if no one does.") + '</p><div class="card" style="margin-top:12px">' + JOBS.map(function (j) { var sel = a.chairs[j.id] || []; return '<div class="chairrow"><b>' + esc(P(j.name)) + '</b><p class="small" style="margin:2px 0 8px">' + esc(P(j.what)) + '</p><div class="chiprow">' + lv.map(function (n) { return '<button class="chip' + (sel.indexOf(n) >= 0 ? " on" : "") + '" data-a="auChair" data-j="' + j.id + '" data-n="' + esc(n) + '">' + esc(n) + "</button>"; }).join("") + "</div></div>"; }).join("") + "</div>";
    return '<div class="au">' + auBar() + '<div class="grow">' + h + "</div>" + foot(btnNext(T("Dekhiye", "See it"))) + "</div>";
  }
  if (st === "chairsSeen") {
    var filled = JOBS.filter(function (j) { return (a.chairs[j.id] || []).length; }), open = JOBS.filter(function (j) { return !(a.chairs[j.id] || []).length; }), cnts = {};
    JOBS.forEach(function (j) { (a.chairs[j.id] || []).forEach(function (n) { cnts[n] = (cnts[n] || 0) + 1; }); });
    var heavy = Object.keys(cnts).filter(function (n) { return cnts[n] >= 3; }), lines = [];
    lines.push(T(filled.length + " kursiyon par koi hai" + (open.length ? "; khaali: " + list(open.map(function (j) { return P(j.name); })) : "") + ".", (filled.length === 5 ? "Every chair has someone." : filled.length + (filled.length === 1 ? " chair has" : " chairs have") + " someone. Open: " + list(open.map(function (j) { return P(j.name); })) + ".")));
    if (heavy.length) lines.push(T(heavy[0] + " " + cnts[heavy[0]] + " kursiyon par hain. Ek insaan par itna tikna, aapke liye bhi bhaari hai aur unke liye bhi.", heavy[0] + " sits in " + cnts[heavy[0]] + " chairs. That's a lot to rest on one person, for you and for them."));
    if (a.first && heavy[0] !== a.first) lines.push(cnts[a.first] ? T("Aapka pehla naam, " + a.first + ", " + cnts[a.first] + " kursi par hai.", "Your first name, " + a.first + ", sits in " + cnts[a.first] + (cnts[a.first] === 1 ? " chair." : " chairs.")) : T("Aapka pehla naam, " + a.first + ", kisi kursi par nahi. Kuch naam un wajahon se aate hain jo kursiyon mein nahi samaati.", "Your first name, " + a.first + ", sits in no chair. Some names arrive for reasons the chairs don't hold."));
    if (!heavy.length && filled.length >= 4 && Object.keys(cnts).length >= 4) lines.push(T("Aapka thaamna kai logon mein bata hai. Yeh mazboot hai.", "Your holding is spread across several people. That's sturdy."));
    h = '<div class="card">' + JOBS.map(function (j) { var ns = a.chairs[j.id] || []; return '<div class="chair' + (ns.length ? "" : " open") + '" style="margin:6px 0"><span class="j">' + esc(P(j.name)) + '</span> <span class="n">' + (ns.length ? esc(list(ns)) : T("khaali kursi", "open chair")) + "</span></div>"; }).join("") + "</div>" + lines.map(function (l) { return '<p class="obs">' + esc(l) + "</p>"; }).join("") + (open.length ? uni("chairs") : "");
    return '<div class="au">' + auBar() + '<div class="grow">' + h + "</div>" + foot(btnNext(T("Ab doosri taraf", "Now the other side"))) + "</div>";
  }
  if (st === "both") {
    var lv2 = auLiving();
    h = '<p class="beat" style="font-size:25px">' + T("Ab ulta. Kiska 2:40 wala phone aap uthaayenge?", "Now the other way. Whose 2:40 call would you pick up?") + '</p><div class="chiprow" style="margin-top:14px">' + lv2.map(function (n) { return '<button class="chip' + (a.answerFor.indexOf(n) >= 0 ? " on" : "") + '" data-a="auBoth" data-n="' + esc(n) + '">' + esc(n) + "</button>"; }).join("") + '</div><div class="row" style="margin-top:10px"><input class="t" id="auBothIn" placeholder="' + T("Koi aur", "Someone else") + '"><button class="btn" data-a="auBothAdd">' + T("Jodiye", "Add") + "</button></div>";
    if (a.answerFor.length) {
      var notBack = a.answerFor.filter(function (n) { return a.warm[auKey(n)] !== "come"; });
      h += '<p class="obs">' + esc(notBack.length ? T("Aap " + list(notBack) + " ke liye uthaayenge, par aapne unhe un logon mein nahi rakha jo aapke liye aayenge.", "You'd pick up for " + list(notBack) + ", but you didn't put " + (notBack.length === 1 ? "them" : "them") + " among those who'd come for you.") : T("Jinke liye aap uthaayenge, woh aapke liye bhi aayenge. Yeh dono taraf chalta hai.", "The people you'd pick up for would also come for you. It runs both ways.")) + "</p>" + uni("both");
    }
    return '<div class="au">' + auBar() + '<div class="grow">' + h + "</div>" + foot(btnNext(a.answerFor.length ? T("Aage", "Continue") : T("Chhodiye", "Skip"))) + "</div>";
  }
  if (st === "villages") {
    var vq = LAYERS[3].qs.filter(function (q) { return q.id === "villages"; })[0];
    h = '<p class="beat" style="font-size:25px">' + T("Aap kin gaon ka hissa hain?", "Which villages are you part of?") + '</p><p class="sub">' + T("Gaon: log jo aapko chehre aur naam se jaante hain.", "A village: people who know you by face and name.") + '</p><div class="chiprow" style="margin-top:14px">' + vq.opts.map(function (o) { return '<button class="chip' + (a.villages.indexOf(o[0]) >= 0 ? " on" : "") + '" data-a="auVil" data-v="' + o[0] + '">' + T(o[1], o[2]) + "</button>"; }).join("") + "</div>" + (a.villages.length ? '<p class="obs">' + T("Aap " + a.villages.length + " gaon mein hain. Har ek mein koi aapka naam jaanta hai.", "You belong to " + a.villages.length + (a.villages.length === 1 ? " village" : " villages") + ". In each, someone knows your name.") + "</p>" : "");
    return '<div class="au">' + auBar() + '<div class="grow">' + h + "</div>" + foot(btnNext(T("Aage", "Continue"))) + "</div>";
  }
  if (st === "gap") {
    var g = a.gap || auKindest();
    if (!g) {
      h = '<p class="beat" style="font-size:25px">' + T("Sabse patle dhaage se shuru kijiye.", "Start with the thinnest thread.") + '</p><p class="obs">' + T("Is hafte, jo aapka din chalate hain (guard, dukaan wale, padosi) unmein se ek ka naam poochhiye, aur usi naam se shukriya kahiye.", "This week, ask the name of someone who keeps your day running (a guard, a shopkeeper, a neighbour) and thank them by it.") + "</p>";
      return '<div class="au">' + auBar() + '<div class="grow">' + h + "</div>" + foot(btnNext(T("Yeh mera dhaaga hai", "That's my thread"), "auThin")) + "</div>";
    }
    var k2 = auKey(g), l3 = a.last[k2], warmW = a.warm[k2] === "come" ? T("aayenge", "would come") : T("uthaayenge", "would pick up");
    h = '<p class="small">' + T("Sabse narm gap", "The kindest gap") + '</p><p class="glow">' + esc(g) + '</p><p class="obs">' + T(esc(g) + " aapke liye " + warmW + ". Aur baat hue " + P(LAST_W[l3] || LAST_W.w) + " ho gaye.", esc(g) + " " + warmW + " for you. And it's been " + P(LAST_W[l3] || LAST_W.w) + ".") + "</p>" + uni("reach") + webSVG({ glow: g }) + '<p class="small" style="margin-top:6px">' + T("Ya koi aur:", "Or someone else:") + '</p><div class="chiprow">' + auLiving().filter(function (n) { return auKey(n) !== k2 && a.warm[auKey(n)] !== "knot" && !unsafeName(n); }).slice(0, 8).map(function (n) { return '<button class="chip" data-a="auGap" data-n="' + esc(n) + '">' + esc(n) + "</button>"; }).join("") + "</div>";
    a.gap = g;
    return '<div class="au">' + auBar() + '<div class="grow">' + h + "</div>" + foot(btnNext(T(g + " ki taraf ek dhaaga", "A thread to " + g))) + "</div>";
  }
  if (st === "reach") {
    var who = a.gap, order = reasonOrder(), sel = (V.reach && V.reach.who === who && V.reach.reason) || order[0].id;
    V.reach = { who: who, reason: sel };
    h = '<p class="beat" style="font-size:25px">' + T(esc(who) + " ko kya likhenge?", "What will you send " + esc(who) + "?") + '</p><p class="sub">' + T("Ek asli wajah. Ek chhota sawaal. Bas itni si kala hai.", "One real reason. One small question. That's the whole art.") + '</p><div class="chiprow" id="reasons" style="margin-top:12px">' + order.map(function (r) { return '<button class="chip' + (r.id === sel ? " on" : "") + '" data-a="reasonPick" data-r="' + r.id + '">' + esc(P(r.name)) + "</button>"; }).join("") + '</div><p class="small" id="rHint" style="margin:6px 0 0">' + esc(P(reasonById(sel).hint)) + '</p><label class="f" for="draft">' + T("___ mein woh likhiye jo sirf aap jaante hain", "Fill the ___ with what only you know") + '</label><textarea class="t" id="draft" style="min-height:96px">' + esc(fill(reasonById(sel).t, who) + (S.voice.noRush ? P(NORUSH) : "")) + '</textarea><div class="row" style="margin-top:10px"><a class="btn primary" id="waDraft" target="_blank" rel="noopener" data-a="auSend" href="#">' + T("Abhi bhejiye (WhatsApp)", "Send now (WhatsApp)") + '</a></div><p class="tiny">' + T("Aap bhejte hain, Neev nahi. Message is phone se Neev ke zariye kahin nahi jaata.", "You send it, not Neev. Nothing goes anywhere through Neev.") + "</p>";
    setTimeout(function () { syncWa(); exRow(); }, 0);
    return '<div class="au">' + auBar() + '<div class="grow">' + h + "</div>" + foot('<button class="btn block" data-a="auNext">' + T("Baad mein bhejunga", "I'll send it later") + "</button>") + "</div>";
  }
  if (st === "when") {
    if (a.sent) {
      h = '<p class="glow" style="font-size:28px">' + T("Dhaaga phenk diya.", "Thread cast.") + '</p><p class="obs">' + T("Aapne " + esc(a.gap) + " ko likh diya. Jawab unka hai, kab aur kaise. Pahunchna hi kaam tha.", "You wrote to " + esc(a.gap) + ". The reply is theirs, whenever and however. Reaching was the work.") + "</p>";
      return '<div class="au">' + auBar() + '<div class="grow">' + h + "</div>" + foot(btnNext(T("Aage", "Continue"))) + "</div>";
    }
    h = '<p class="beat" style="font-size:25px">' + T("Yeh dhaaga aapke haath se kab nikalega?", "When does this thread leave your hands?") + '</p><div class="opts">' + [["tonight", "Aaj raat, sone se pehle", "Tonight, before I sleep"], ["morning", "Kal subah, chai ke saath", "Tomorrow, with morning chai"], ["weekend", "Is weekend, aaram se", "This weekend, unhurried"]].map(function (o) { return '<button class="btn' + (a.when === o[0] ? " on" : "") + '" data-a="auWhen" data-w="' + o[0] + '">' + T(o[1], o[2]) + "</button>"; }).join("") + "</div>" + (a.when ? '<p class="sub">' + T("Ab diya daba ke rakhiye. Yeh vaada " + esc(a.gap) + " se nahi, khud se hai.", "Now press and hold the diya. The promise is to yourself, not to " + esc(a.gap) + ".") + "</p>" + holdHTML().replace(/<span class="hold-label" id="holdLabel">[\s\S]*?<\/span>/, '<span class="hold-label" id="holdLabel">' + T("Daba ke rakhiye: vaada", "Press and hold: promise") + "</span>") : "");
    return '<div class="au">' + auBar() + '<div class="grow">' + h + "</div>" + foot('<button class="btn ghost block" data-a="auNext">' + T("Vaade ke bina aage", "Go on without a promise") + "</button>") + "</div>";
  }
  if (st === "covenant") {
    h = '<p class="beat" style="font-size:25px">' + T("Ab, Neev ki taraf se vaada.", "Now, Neev's promise to you.") + '</p><ul class="said" style="margin-top:12px"><li>' + T("Aapke naam is phone par rehte hain. Koi account nahi. Contacts nahi uthaaye jaate.", "Your names stay on this phone. No account. No contacts taken.") + "</li><li>" + T("Neev aapko kabhi ginega nahi. Koi streak nahi, koi score nahi, koi khinchne wali notification nahi.", "Neev will never count you. No streaks, no scores, no notifications built to pull you back.") + "</li><li>" + T("Neev aapke shabd kabhi AI ko nahi bhejta. AI sirf dhaancha sujhata hai, naam ke bina.", "Neev never sends your words to an AI. When AI helps, it sees no names.") + "</li><li>" + T("Neev logon ki jagah nahi lega. Uska kaam aapko logon tak pahunchana hai.", "Neev won't stand in for people. Its job is to get you to them.") + "</li><li>" + T("Bahut bhaari lage toh neeche ki patti hamesha hai: Tele-MANAS 14416, ya 112.", "If it ever gets too heavy, the bar below is always there: Tele-MANAS 14416, or 112.") + "</li><li>" + T("Saajha phone ho toh PIN laga sakte hain. Sach: PIN bhoole toh data wapas nahi aayega.", "On a shared phone you can add a PIN. Honestly: forget it, and the data can't come back.") + '</li></ul><details class="how"><summary class="small">' + T("Yeh safar kaise banaya gaya (sab khula)", "How this journey was designed (nothing hidden)") + '</summary><ul class="small"><li>' + T("Jo bhi aapke baare mein kaha gaya, woh aapke apne jawabon se bana. Koi andaaza nahi.", "Everything said about you came from your own answers. No guessing.") + "</li><li>" + T("'Lagbhag sab' wali lines sabke liye sach hain, aur sabke liye kahi gayi hain. Woh aapki 'reading' nahi.", "Lines marked with a bar are true of almost everyone, and say so. They are not a reading of you.") + "</li><li>" + T("Shabd jaan-boojh kar chune gaye: thaamna, dhaaga, kursi. Taaki in baaton ke liye aapke paas shabd hon.", "Words were chosen on purpose (holding, thread, chairs) so you have words for these things.") + "</li><li>" + T("2:40 wala sawaal, chhote kadam, aur 'kab' ka vaada: yeh research par based hain jo dikhata hai ki chhota, tay kiya hua kadam zyada hota hai.", "The 2:40 question, small steps and the 'when' promise draw on research showing small, planned acts are likelier to happen.") + "</li><li>" + T("Har screen par 'Abhi nahi' tha. Rukna hamesha theek tha.", "'Not now' was on every screen. Stopping was always fine.") + "</li></ul></details>" + (a.covenant ? '<p class="obs">' + T("Hum dono ne vaada kar liya.", "We've both promised.") + "</p>" : '<p class="sub">' + T("Agar theek lage, diya daba ke rakhiye. Wahi ishaara jo logon ke liye hai.", "If this sits right, hold the diya. The same gesture you use for people.") + "</p>" + holdHTML().replace(/<span class="hold-label" id="holdLabel">[\s\S]*?<\/span>/, '<span class="hold-label" id="holdLabel">' + T("Daba ke rakhiye: maanta hoon", "Press and hold: agreed") + "</span>"));
    return '<div class="au">' + auBar() + '<div class="grow">' + h + "</div>" + (a.covenant ? foot(btnNext(T("Aage", "Continue"))) : "") + "</div>";
  }
  if (st === "seed") {
    h = '<p class="beat" style="font-size:25px">' + T("Jab aap laut kar aayenge, chupchaap kisi shaam, yahan kya milna chahiye?", "When you come back, quietly, some evening, what do you want to find here?") + '</p><p class="sub">' + T("Ek line. Aapki aawaz, aapke liye. Agli baar sabse pehle yahi dikhega.", "One line. Your voice, for you. It's the first thing you'll see next time.") + '</p><textarea class="t" id="auSeed" style="min-height:90px;margin-top:12px">' + esc(a.seed) + '</textarea><div class="chiprow" style="margin-top:8px">' + [["Yaad ki main kyun aaya tha", "A reminder of why I came"], ["Kisse baat karni hai", "Who I meant to reach"], ["Ki main akela nahi", "That I'm not alone in this"]].map(function (o) { return '<button class="chip" data-a="auSeedEx" data-t="' + esc(T(o[0], o[1])) + '">' + T(o[0], o[1]) + "</button>"; }).join("") + "</div>";
    return '<div class="au">' + auBar() + '<div class="grow">' + h + "</div>" + foot(btnNext(T("Rakh dijiye", "Keep it"), "auSeedGo") + '<button class="btn ghost block" data-a="auSeedSkip">' + T("Chhodiye", "Skip") + "</button>") + "</div>";
  }
  /* end */
  var fewN = auByRing("few").length, circN = auByRing("circle").length, openC = JOBS.filter(function (j) { return !(a.chairs[j.id] || []).length; }).length;
  h = '<p class="glow" style="font-size:30px">' + (a.gap ? T("Pehla dhaaga phenk diya.", "First thread cast.") : T("Pehla dhaaga.", "The first thread.")) + '</p><p class="beat" style="font-size:22px;margin-top:8px">' + T("Ab yahan se sambhaalna hai, shuru karna nahi.", "From here, it's tending, not beginning.") + '</p><ul class="said" style="margin-top:16px"><li>' + T("Aapke apne: " + fewN + " · daayra: " + circN + " · gaon: " + a.villages.length, "Your few: " + fewN + " · circle: " + circN + " · villages: " + a.villages.length) + "</li><li>" + T((5 - openC) + " kursiyon par koi hai", (5 - openC) + " of 5 chairs have someone") + "</li>" + (a.gap ? "<li>" + (a.sent ? T(esc(a.gap) + " ko likh diya", "Wrote to " + esc(a.gap)) : T(esc(a.gap) + " tak: " + (a.when ? "vaada" : "jab man ho"), "To " + esc(a.gap) + ": " + (a.when ? "promised" : "whenever you're ready"))) + "</li>" : "") + '</ul><p class="small">' + T("Yeh aapka portfolio hai, aaj ki tasveer. Ghere badlenge; yahi zindagi hai. Gehraai mein jaana ho toh aath aur parten hain, jab man ho.", "This is your portfolio, a snapshot of today. Rings will move; that's life. When you want more depth, there are more layers, whenever you like.") + "</p>";
  return '<div class="au">' + threadSVG() + '<div class="grow" style="padding-top:4vh">' + h + "</div>" + foot('<button class="btn primary block" data-a="auFinish" data-to="map">' + T("Mera portfolio dekhiye", "See my portfolio") + '</button><button class="btn block" data-a="auFinish" data-to="aaj">' + T("Phone rakh dijiye. Ho gaya.", "Put the phone down. Done.") + "</button>") + "</div>";
}

function auKindest() {
  var a = AU(), rank = { y: 4, m: 3, w: 2, d: 1 };
  var c = auLiving().filter(function (n) { var k = auKey(n); return (a.warm[k] === "come" || a.warm[k] === "answer") && !unsafeName(n) && !GROUP_RE.test(n); });
  c.sort(function (x, y) { var kx = auKey(x), ky = auKey(y); return (rank[a.last[ky]] || 0) - (rank[a.last[kx]] || 0) || (a.warm[kx] === "come" ? -1 : 1); });
  return c[0] || "";
}

/* ---------- writing the audit into the living app ---------- */
function auFinalize() {
  var a = AU(); if (a.done) return;
  var L = S.look.a;
  if (a.first) L.first = [a.first];
  auAll().forEach(function (n) {
    var k = auKey(n), w = a.warm[k];
    if (w === "gone") { L.lost = uniq((L.lost || []).concat([n])); return; }
    if (n !== a.first && S.extra.map(function (x) { return x.toLowerCase(); }).indexOf(k) < 0) S.extra.push(n);
    S.over[k] = S.over[k] || {}; S.over[k].ring = w === "come" ? "few" : (w === "answer" || w === "knot") ? "circle" : "village";
  });
  CH.forEach(function (c) { var ns = a.chairs[c[0]] || []; if (ns.length) L[c[1]] = uniq((L[c[1]] || []).concat(ns)); });
  if (a.answerFor.length) L.leans = uniq((L.leans || []).concat(a.answerFor));
  if (a.villages.length) L.villages = a.villages.slice();
  S.look.started = true; S.look.unlocked = true; S.look.th = 2;
  S.look.done = uniq(S.look.done.concat([1, 3, 5, 6], a.villages.length ? [4] : []));
  S.look.L = 2; S.look.s = 0;
  S.snap = { date: nowMs(), a: JSON.parse(JSON.stringify(L)) };
  a.done = true; a.at = nowMs(); S.lastOpen = nowMs();
  save();
}

/* ---------- actions ---------- */
Object.assign(A, {
  auTh: function () { V.auTh = true; render(); },
  auNext: function () {
    if (auStep() === "reach") { var who = AU().gap; if (who && !AU().sent) { setToday({ person: who, job: "drift", text: T(who + " ko likhiye. Draft taiyaar hai.", "Write to " + who + ". Your draft is ready.") }); S.today.reach = true; S.raatDraft = ($("#draft") || {}).value || ""; save(); } }
    if (auStep() === "end") return;
    auNext();
  },
  auBack: function () { var a = AU(); if (auStep() === "sort" && a.sortI > 0) { a.sortI--; save(); render(); return; } if (auStep() === "threshold") { V.auTh = false; render(); return; } a.step = Math.max(0, a.step - 1); if (AU_STEPS[a.step] === "when" && a.sent) a.step--; save(); render(); },
  auPause: function () { V.auPaused = true; render(); },
  auResume: function () { V.auPaused = false; render(); },
  auWhy: function (el) { var w = WHY.filter(function (x) { return x[0] === el.dataset.w; })[0]; AU().reason = w[0]; AU().verbatim = T(w[1], w[2]); save(); document.querySelectorAll(".au .opts .btn").forEach(function (b) { b.classList.toggle("on", b === el); }); var i = $("#auWhyText"); if (i) i.value = ""; },
  auWhyGo: function () {
    var t = (($("#auWhyText") || {}).value || "").trim();
    if (t) { AU().reason = "own"; AU().verbatim = t.slice(0, 200); if (gateHit(t)) { save(); openGate(); return; } }
    save(); auNext();
  },
  auFirstGo: function () { var v = (($("#auFirst") || {}).value || "").trim(); if (!v) { $("#auFirst").focus(); return; } AU().first = canon(v); AU().fx = { ms: V.auFx ? V.auFx.first - V.auT0 : null, edits: V.auFx ? V.auFx.edits : 0 }; V.auT0 = 0; V.auFx = null; save(); auNext(); },
  auFirstNone: function () { AU().first = ""; AU().fx = null; save(); auNext(); },
  auCueNext: function () { V.auCue = (V.auCue || 0) + 1; var c = $("#auCue"); if (c) { c.style.opacity = 0; setTimeout(function () { c.textContent = P(CUES[V.auCue % CUES.length]); c.style.opacity = 1; }, 200); } },
  auAdd: function () {
    var i = $("#auName"), v = i ? i.value.trim() : ""; if (!v) return;
    if (gateHit(v)) { openGate(); return; }
    var a = AU(), k = auKey(v);
    if (auAll().map(auKey).indexOf(k) < 0) { a.names.push(canon(v)); a.cueOf[k] = (V.auCue || 0) % CUES.length; }
    save(); var cue = V.auCue; render(); V.auCue = cue; var j = $("#auName"); if (j) j.focus();
    if (a.names.length % 3 === 0) A.auCueNext();
  },
  auDel: function (el) { AU().names.splice(+el.dataset.i, 1); save(); render(); },
  auNamesGo: function () {
    var i = $("#auName"); if (i && i.value.trim()) A.auAdd();
    var a = AU(); if (!auAll().length) { a.gap = ""; auGo("villages"); return; }
    a.sortI = 0; save(); auNext();
  },
  auWarm: function (el) {
    var a = AU(), all = auAll(), n = all[a.sortI], k = auKey(n); a.warm[k] = el.dataset.w; save();
    if (el.dataset.w === "gone") { delete a.last[k]; return auSortNext(); }
    if (a.last[k]) return auSortNext();
    render();
  },
  auLast: function (el) { var a = AU(), n = auAll()[a.sortI]; a.last[auKey(n)] = el.dataset.l; save(); render(); setTimeout(auSortNext, 260); },
  auChair: function (el) { var arr = AU().chairs[el.dataset.j], n = el.dataset.n, i = arr.indexOf(n); if (i >= 0) arr.splice(i, 1); else arr.push(n); el.classList.toggle("on"); save(); },
  auBoth: function (el) { var arr = AU().answerFor, n = el.dataset.n, i = arr.indexOf(n); if (i >= 0) arr.splice(i, 1); else arr.push(n); save(); render(); },
  auBothAdd: function () { var v = (($("#auBothIn") || {}).value || "").trim(); if (!v) return; v = canon(v); if (AU().answerFor.indexOf(v) < 0) AU().answerFor.push(v); save(); render(); },
  auVil: function (el) { var arr = AU().villages, v = el.dataset.v, i = arr.indexOf(v); if (i >= 0) arr.splice(i, 1); else arr.push(v); save(); render(); },
  auGap: function (el) { AU().gap = el.dataset.n; save(); render(); },
  auThin: function () { AU().gap = ""; setToday({ text: T("Is hafte, jo aapka din chalate hain unmein se ek ka naam poochhiye, aur usi naam se shukriya kahiye.", "This week, ask the name of someone who keeps your day running, and thank them by it."), job: "belong", promised: true }); auGo("covenant"); },
  auSend: function () { var a = AU(); a.sent = true; A.reachSent(); setToday({ person: a.gap, job: "drift", text: T(a.gap + " ko likha.", "Wrote to " + a.gap + ".") }); S.today.done = true; save(); setTimeout(function () { auGo("when"); }, 400); },
  auWhen: function (el) { AU().when = el.dataset.w; save(); render(); },
  auSeedEx: function (el) { var t = $("#auSeed"); if (t) t.value = el.dataset.t; },
  auSeedGo: function () { var t = (($("#auSeed") || {}).value || "").trim(); AU().seed = t.slice(0, 280); save(); auFinalize(); auNext(); if (t && gateHit(t)) { openGate(); } },
  auSeedSkip: function () { AU().seed = ""; save(); auFinalize(); auNext(); },
  auFinish: function (el) { auFinalize(); AU().closed = true; save(); task("audit"); var to = el.dataset.to; if (to === "map") { V.tab = "portfolio"; V.tabInit = true; } go(to); }
});
function auSortNext() { var a = AU(), all = auAll(); if (a.sortI < all.length - 1) { a.sortI++; save(); render(); } else { save(); auNext(); } }

/* timing of the first name: only how long, never what was erased */
document.addEventListener("keydown", function (ev) {
  if (ev.target.id === "auFirst") {
    V.auFx = V.auFx || { first: 0, edits: 0 };
    if (!V.auFx.first && ev.key.length === 1) V.auFx.first = performance.now();
    if ((ev.key === "Backspace" || ev.key === "Delete") && ev.target.value.length >= 2) V.auFx.edits = 1;
    if (ev.key === "Enter") { ev.preventDefault(); A.auFirstGo(); }
  }
  if (ev.target.id === "auName" && ev.key === "Enter") { ev.preventDefault(); A.auAdd(); }
  if (ev.target.id === "auBothIn" && ev.key === "Enter") { ev.preventDefault(); A.auBothAdd(); }
});

/* promises made inside the audit */
promise = (function (orig) {
  return function () {
    if (V.route === "look" && auActive()) {
      try { if (navigator.vibrate) navigator.vibrate(30); } catch (e) {}
      var a = AU();
      if (auStep() === "when") { setToday({ person: a.gap, job: "drift", text: T(a.gap + " ko likhiye. Draft taiyaar hai.", "Write to " + a.gap + ". Your draft is ready."), promised: true, when: a.when }); S.today.reach = true; task("hold"); save(); toast(T("Vaada rakh liya.", "Promise kept.")); auNext(); return; }
      if (auStep() === "covenant") { a.covenant = true; save(); render(); return; }
    }
    orig();
  };
})(promise);

/* ---------- the audit becomes the first run ---------- */
function auActive() { var a = AU(); if (V.classic) return false; if (a.done) return auStep() === "end" && !a.closed; return !(S.look.started && a.step === 0); }
viewLook = (function (orig) { return function () { if (auActive()) return viewAudit(); return orig(); }; })(viewLook);
screenId = (function (orig) { return function () { if (V.route === "look" && auActive()) return "audit:" + auStep() + (auStep() === "sort" ? AU().sortI : ""); return orig(); }; })(screenId);

/* returning: the seed the person left for themselves */
viewAaj = (function (orig) {
  return function () {
    var h = orig(), a = AU();
    if (a.seed && a.at && dstr(new Date(a.at)) !== dstr() && a.seedSeen !== dstr()) h = h.replace("</p>", '</p><div class="card" style="border-color:var(--amber)"><p class="small" style="margin:0">' + T("Aapne apne liye likha tha:", "You left this for yourself:") + '</p><p class="mine" style="font-family:var(--f-hand);font-size:21px;color:var(--amber);margin:6px 0 8px">' + esc(a.seed) + '</p><button class="chip" data-a="seedSeen">' + T("Dekh liya", "Seen") + "</button></div>");
    return h;
  };
})(viewAaj);
A.seedSeen = function () { AU().seedSeen = dstr(); save(); render(); };

/* bench */
TASKS.unshift(["audit", "Finish the coherence audit (about 7 minutes)"]);
var scCold6 = A.scCold; A.scCold = function () { scCold6(); V.auTh = false; V.classic = false; render(); };
A.scClassic = function () { A.scCold(); V.classic = true; render(); toast("The v5 layered look, for comparison."); };
A.scAuditMid = function () {
  A.scCold(); var a = AU();
  Object.assign(a, { step: AU_STEPS.indexOf("mirror"), reason: "drift", verbatim: "Someone drifted, and I let it happen.", first: "Leela", fx: { ms: 1400, edits: 0 }, names: ["Mum", "Karan", "Tom", "Asha", "Football group", "Dad"], warm: { leela: "come", mum: "come", karan: "answer", tom: "answer", asha: "nocall", "football group": "answer", dad: "gone" }, last: { leela: "w", mum: "d", karan: "m", tom: "y", asha: "w", "football group": "w" } });
  save(); render(); toast("Example answers up to the mirror. Not yours.");
};
renderBench = (function (orig) {
  return function () {
    orig();
    var sc = document.querySelector("#bench .scen");
    if (sc && !sc.querySelector('[data-a="scAuditMid"]')) sc.insertAdjacentHTML("beforeend", '<button class="btn" data-a="scAuditMid">Audit: jump to the mirror</button><button class="btn" data-a="scClassic">Old layered look (compare)</button>');
  };
})(renderBench);

boot();
