/* Neev v5 · from the eleven-review feedback: one name to one reach, did it land, safety filter, examples for ___, calmer map, reliability */

fresh = (function (orig) { return function () { var f = orig(); f.reaches = []; f.noSuggest = {}; f.weeksSeen = []; return f; }; })(fresh);
if (!S.reaches) S.reaches = [];
if (!S.noSuggest) S.noSuggest = {};
if (!S.weeksSeen) S.weeksSeen = [];

/* ---------- 1. Never suggest reaching someone the person feels smaller around ---------- */
function unsafeName(name) { var p = people(true).filter(function (x) { return x.name === name || x.key === name; })[0]; return !!(p && (p.tags.indexOf("smaller") >= 0 || S.noSuggest[p.key])); }
function safeOne(ps) { return oneToOne(ps).filter(function (p) { return p.tags.indexOf("smaller") < 0 && !S.noSuggest[p.key]; }); }
startOptions = (function (orig) { return function () { return orig().filter(function (o) { return !o.person || !unsafeName(o.person); }); }; })(startOptions);
nudges = (function (orig) { return function () { return orig().filter(function (n) { return !n.person || !unsafeName(n.person); }); }; })(nudges);
openPerson = (function (orig) {
  return function (key) {
    orig(key);
    var sh = document.querySelector(".sheet"); if (!sh) return;
    var on = !!S.noSuggest[key], d = document.createElement("div");
    d.innerHTML = '<div class="card" style="margin-top:12px"><b>' + T("Inhe sujhaav mein mat laaiye", "Don't suggest this person") + '</b><p class="small" style="margin:4px 0 8px">' + T("Neev inke liye kabhi kaam ya message nahi sujhayega. Naksha par rahenge. Yeh sirf aapko dikhta hai.", "Neev will never suggest an act or a message for them. They stay on your map. Only you see this.") + '</p><button class="chip' + (on ? " on" : "") + '" data-a="noSuggest" data-k="' + esc(key) + '">' + (on ? T("Sujhaav band hain", "Suggestions off") : T("Sujhaav band kijiye", "Turn suggestions off")) + "</button></div>";
    sh.insertBefore(d, sh.lastElementChild);
  };
})(openPerson);
A.noSuggest = function (el) { var k = el.dataset.k; if (S.noSuggest[k]) delete S.noSuggest[k]; else S.noSuggest[k] = 1; if (S.today && unsafeName(S.today.person) && !S.today.done) S.today = null; save(); openPerson(k); toast(S.noSuggest[k] ? T("Theek hai. Inke liye koi sujhaav nahi.", "Done. No suggestions for them.") : T("Sujhaav phir chalu.", "Suggestions back on.")); };

/* ---------- 2. One name is enough to start ---------- */
route = (function (orig) {
  return function () {
    var i = LOCKED_UNTIL_L3.indexOf("aaj");
    if (S.look.done.indexOf(1) >= 0) { if (i >= 0) LOCKED_UNTIL_L3.splice(i, 1); } else if (i < 0) LOCKED_UNTIL_L3.push("aaj");
    orig();
  };
})(route);
completeLayer = (function (orig) {
  return function (next) {
    var n = S.look.L;
    if (n < 3 && next === "stop" && !S.look.unlocked) { if (S.look.done.indexOf(n) < 0) S.look.done.push(n); save(); go("aaj"); toast(T("Baaki naksha yahin milega, jab chahein.", "The rest of your map is here whenever you want it.")); return; }
    orig(next);
  };
})(completeLayer);
revealBody = (function (orig) {
  return function (Ln) {
    var h = orig(Ln);
    if (Ln === 1) h = h.replace('<button class="btn" data-a="reachTo"', '<button class="btn primary" data-a="reachTo"').replace(T("Wajah chuniye", "Pick a reason"), T("Wajah chuniye (1 min)", "Pick a reason (1 min)")) + '<p class="small" style="margin-top:6px">' + T("Bas itna bhi kaafi hai. Baaki das parten tab, jab aap chahein.", "This alone is enough. The other layers are there when you want them.") + "</p>";
    return h;
  };
})(revealBody);
viewAaj = (function (orig) {
  return function () {
    var h = orig();
    if (!S.look.unlocked) h = h.replace(/<div class="card"><p class="layerpill">(?:Agli parat|Next layer)/, '<div class="card"><p style="margin:0 0 6px">' + T("Aapka poora naksha parat 3 ke baad khulta hai, lagbhag 5 minute aur.", "Your full map opens after layer 3, about 5 more minutes.") + '</p><p class="layerpill">' + T("Agli parat", "Next layer"));
    return h;
  };
})(viewAaj);

/* ---------- 3. Stealable specifics for the ___ (from the reason only, never from your data) ---------- */
var EXAMPLES = {
  share: [["purani class ki photo", "an old class photo"], ["woh gaana jo hum gaate the", "that song we used to sing"], ["ek reel jo tumhe hasa degi", "a reel that'll make you laugh"]],
  ask: [["achha doctor kaun hai", "a good doctor nearby"], ["woh recipe", "that recipe"], ["naye phone ke liye salah", "which phone to buy"]],
  memory: [["hamara purana school", "our old school"], ["woh train wala safar", "that train trip"], ["college canteen", "the college canteen"]],
  news: [["naya kaam", "the new job"], ["ghar badalna", "the move"], ["beti ka admission", "your daughter's admission"]],
  occasion: [["Diwali", "Diwali"], ["janmdin", "birthday"], ["Eid", "Eid"]],
  plan: [["chai", "chai"], ["subah ki walk", "a morning walk"], ["match dekhna", "watching the match"]],
  thanks: [["bike chalana", "riding a bike"], ["Excel", "Excel"], ["khaana banana", "cooking"]],
  mend: [["us din ki baat", "what happened that day"], ["shaadi wali baat", "the wedding thing"], ["jo maine kaha tha", "what I said"]],
  hello: []
};
openShabd = (function (orig) {
  return function (who, tone) {
    orig(who, tone);
    var opts = $("#sWho"); if (opts && opts.tagName === "SELECT") Array.prototype.slice.call(opts.options).forEach(function (o) { if (unsafeName(o.value)) o.remove(); });
    exRow();
  };
})(openShabd);
function exRow() {
  var old = $("#exRow"); if (old) old.remove();
  var ex = EXAMPLES[V.reach && V.reach.reason] || [], d = $("#draft"); if (!d || !ex.length) return;
  var div = document.createElement("div"); div.id = "exRow"; div.className = "chiprow"; div.style.marginTop = "6px";
  div.innerHTML = '<span class="small">' + T("Jaise:", "For example:") + "</span>" + ex.map(function (e, i) { return '<button class="chip" data-a="exUse" data-i="' + i + '">' + esc(P(e)) + "</button>"; }).join("");
  d.parentNode.insertBefore(div, d.nextSibling);
}
var reasonPick5 = A.reasonPick; A.reasonPick = function (el) { reasonPick5(el); exRow(); };
A.exUse = function (el) { var e = EXAMPLES[V.reach.reason][+el.dataset.i], d = $("#draft"); if (!e || !d) return; if (d.value.indexOf("___") >= 0) d.value = /___ /.test(d.value) && !/___[.?!]/.test(d.value) ? d.value.replace("___ ", P(e) + ". ") : d.value.replace("___", P(e)); syncWa(); d.focus(); };

/* ---------- 4. Did it land? ---------- */
function logReach(who, how) {
  if (!who) return;
  var today = dstr(); if (S.reaches.some(function (r) { return r.who === who && r.d === today; })) return;
  S.reaches.push({ who: who, d: today, t: nowMs(), how: how, out: "", asked: 0 }); S.reaches = S.reaches.slice(-60); save();
}
var reachSent5 = A.reachSent; A.reachSent = function () { reachSent5(); logReach(($("#sWho") || {}).value || V.reach.who, "message"); };
var done5 = A.done; A.done = function () { var p = S.today && S.today.person; done5(); logReach(p, "act"); };
function landPending() {
  var t = nowMs();
  return S.reaches.filter(function (r) { var age = t - r.t; return !r.out && age > 20 * 36e5 && age < 14 * 864e5 && (r.asked === 0 || (r.asked === 1 && age > 4 * 864e5)); }).slice(-1)[0];
}
function landCard() {
  var r = landPending(); if (!r) return "";
  var day = new Date(r.t).toLocaleDateString("en-GB", { weekday: "long" });
  return '<div class="card" style="border-color:var(--amber)"><b>' + T(day + " ko aap " + esc(r.who) + " tak pahunche the. Kaisa raha?", "On " + day + " you reached " + esc(r.who) + ". How did it go?") + '</b><div class="chiprow" style="margin-top:10px">' + [["glad", "Achha laga", "Glad I did"], ["ordinary", "Normal tha", "It was ordinary"], ["waiting", "Abhi jawab nahi", "No reply yet"], ["private", "Nahi batana", "Rather not say"]].map(function (o) { return '<button class="chip" data-a="land" data-o="' + o[0] + '" data-t="' + r.t + '">' + T(o[1], o[2]) + "</button>"; }).join("") + '</div><p class="small" style="margin:8px 0 0">' + T("Sirf aapke liye, is phone par.", "Just for you, on this phone.") + "</p></div>";
}
A.land = function (el) {
  var r = S.reaches.filter(function (x) { return x.t === +el.dataset.t; })[0], o = el.dataset.o; if (!r) return;
  if (o === "waiting") { r.asked += 1; if (r.asked >= 2) r.out = "waiting"; } else r.out = o;
  save(); render(); task("land");
  toast({ glad: T("Yaad rakhenge.", "Noted. Worth remembering."), ordinary: T("Normal bhi thaamna hai.", "Ordinary is how holding mostly looks."), waiting: T("Pahunchna hi kaam tha. Jawab unka hai.", "Reaching was the work. The reply is theirs."), private: T("Theek hai.", "Of course.") }[o]);
};
function gladRecall() {
  var t = nowMs(), g = S.reaches.filter(function (r) { return r.out === "glad" && t - r.t > 7 * 864e5; });
  if (!g.length || hash32(dstr()) % 3) return "";
  var r = g[hash32(dstr() + "g") % g.length], wks = Math.max(1, Math.round((t - r.t) / (7 * 864e5)));
  return '<p class="small" style="margin:0 0 10px">' + T(wks + " hafte pehle " + esc(r.who) + " tak pahunchna achha laga tha.", wks === 1 ? "A week ago, reaching " + esc(r.who) + " felt good." : wks + " weeks ago, reaching " + esc(r.who) + " felt good.") + "</p>";
}

/* ---------- 5. Today: done means done; an honest mirror instead of a streak ---------- */
viewAaj = (function (orig) {
  return function () {
    var wk = weekKey(); if (S.weeksSeen.indexOf(wk) < 0) { S.weeksSeen.push(wk); S.weeksSeen = S.weeksSeen.slice(-52); save(); }
    var h = orig(), top = landCard() + gladRecall();
    var n = S.weeksSeen.length; if (n >= 3) top += '<p class="small" style="margin:0 0 10px">' + T(n + " alag hafton mein aap laute hain.", "You've come back in " + n + " different weeks.") + "</p>";
    h = h.replace("</p>", "</p>" + top);
    h = h.replace(/(<div class="witness"><p style="font-size:19px">[\s\S]*?<\/p>)/, "$1" + '<p class="small" style="margin:6px 0 0">' + T("Aaj ka kaam ho gaya. Phone rakh sakte hain.", "That's today's work. You can put the phone down.") + "</p>");
    return h;
  };
})(viewAaj);

/* ---------- 6. The map is a snapshot, not a verdict ---------- */
var SNAP = ["Yeh woh hai jo in dinon yaad aaya. Ek tasveer, faisla nahi.", "This is what came to mind on these days. A snapshot, not a verdict."];
function summaryCard() {
  var ps = people(), liv = living(ps), one = oneToOne(ps);
  if (!one.length) return '<div class="card"><b>' + T("Sabse patle dhaage se shuru kijiye", "Start with the thinnest thread") + '</b><p style="margin:6px 0 10px">' + T("Abhi naksha khaali hai, aur yeh bhi ek shuruaat hai. Guard, dukaan wale, padosi jinhe aap sar hilate hain: is hafte ek ka naam poochhiye.", "Your map is empty for now, and that's a starting point too. The guard, the shopkeeper, a neighbour you nod at: this week, ask one of them their name.") + '</p><button class="btn" data-a="go" data-to="aaj">' + T("Aaj ka kaam", "Today's act") + "</button></div>";
  var lines = [];
  function cnt(r) { return liv.filter(function (p) { return p.ring === r; }).length; }
  var words = [T("koi nahi", "no one"), T("ek", "one"), T("do", "two"), T("teen", "three"), T("chaar", "four"), T("paanch", "five")];
  function w(n) { return n < words.length ? words[n] : String(n); }
  if (doneL(3)) lines.push(T("Aapke apne: ", "Your few: ") + w(cnt("few")) + " · " + T("daayra: ", "circle: ") + w(cnt("circle")) + " · " + T("gaon: ", "village: ") + w(cnt("village")));
  if (doneL(5)) { var ch = chairs(ps), open = ch.filter(function (c) { return !c.names.length; }).map(function (c) { return P(c.job.name); }); lines.push(open.length ? T("Khaali kursiyan: ", "Open chairs: ") + list(open) : T("Har kursi par koi hai", "Every chair has someone")); }
  if (doneL(4)) lines.push(T("Gaon: ", "Villages: ") + (villageNames().length ? list(villageNames()) : T("abhi koi nahi chuna", "none chosen yet")));
  if (doneL(6)) { var hold = uniq(withTag("leans", ps).concat(withTag("carryout", ps))); if (hold.length) lines.push(T("Aap thaamte hain: ", "You hold: ") + list(hold)); }
  if (doneL(7)) { var q = uniq(withTag("quiet", ps).concat(withTag("mend", ps))); if (q.length) lines.push(T("Chup par zinda: ", "Quiet but alive: ") + list(q)); }
  return '<div class="card"><p class="layerpill">' + T("Ek nazar mein", "At a glance") + '</p><ul class="said" style="margin:6px 0 0">' + lines.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + "</ul></div>";
}
portfolioHTML = (function (orig) {
  return function () {
    var h = orig();
    return h.replace(/^<p class="small">[\s\S]*?<\/p>/, function (m) { return m + '<p class="small" style="margin-top:-4px"><i>' + esc(P(SNAP)) + "</i></p>" + summaryCard() + '<p class="eyebrow" style="margin-top:14px">' + T("Vistaar", "The detail") + "</p>"; });
  };
})(portfolioHTML);
viewMap = (function (orig) {
  return function () { var h = orig(); if (V.tab === "web") h = h.replace(/(<div class="seg">[\s\S]*?<\/div>)/, "$1" + '<p class="small"><i>' + esc(P(SNAP)) + "</i></p>"); return h; };
})(viewMap);

/* ---------- 7. Night: who can I lean on right now ---------- */
viewRaat = (function (orig) {
  return function () {
    var h = orig(), ps = people(), names = uniq(withTag("night", ps).concat(withTag("called", ps))).filter(function (n) { return !unsafeName(n) && safeOne(ps).some(function (p) { return p.name === n; }); }).slice(0, 3);
    if (!names.length) return h;
    var card = '<div class="card"><b>' + T("Abhi kis par tik sakte hain", "Who you can lean on right now") + '</b><p class="small" style="margin:4px 0 8px">' + T("Aapne inke naam kahe the jab poocha ki raat ko kise phone karenge.", "You named them when asked who you'd call at night.") + '</p><div class="stack">' + names.map(function (n) { return '<a class="btn block" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(fill(RAAH, n)) + '">' + T(esc(n) + " ko message", "Message " + esc(n)) + "</a>"; }).join("") + "</div></div>";
    return h.replace('<h2 class="h2">', card + '<h2 class="h2">');
  };
})(viewRaat);

/* ---------- 8. Villages: chosen family ---------- */
LAYERS[3].qs.filter(function (q) { return q.id === "villages"; })[0].opts.splice(1, 0, ["chosen", "Chuna hua parivaar", "Chosen family"]);

/* ---------- 9. Reliability ---------- */
mergeCandidate = function (n) {
  var low = n.toLowerCase().trim(), words = low.split(/[\s()]+/).filter(function (w) { return w.length > 1; });
  if (!words.length) return null;
  var hit = people(true).filter(function (p) {
    if (p.key === low) return false;
    var pw = p.key.split(/[\s()]+/).filter(function (w) { return w.length > 1; });
    var short = words.length <= pw.length ? words : pw, long = short === words ? pw : words;
    return short.every(function (w) { return long.indexOf(w) >= 0; });
  })[0];
  return hit ? hit.name : null;
};
var nmAdd5 = A.nmAdd; A.nmAdd = function () { nmAdd5(); var i = $("#nmIn"); if (i) i.focus(); };
EXTRA_RISK = EXTRA_RISK.concat(["i can't do this anymore", "i cant do this anymore", "no point living", "no reason to live", "want to die", "better off without me", "end my life", "kill myself", "suicide", "khudkushi", "aatmhatya", "mar jaana chahta", "mar jaana chahti", "आत्महत्या", "ख़ुदकुशी", "खुदकुशी", "मरना चाहता", "मरना चाहती", "जीना नहीं चाहता", "जीना नहीं चाहती", "मुझे अब और नहीं जीना"]);
render = (function (orig) {
  return function () {
    try { orig(); }
    catch (e) {
      try { console.error(e); $("#screen").innerHTML = '<p class="eyebrow">Neev</p><h1 class="q" style="font-size:24px">' + T("Kuch gadbad hui. Aapka data surakshit hai.", "Something went wrong. Your data is safe.") + '</h1><div class="card gate">' + gateLines(2) + '</div><div class="row"><button class="btn primary" data-a="go" data-to="aaj">' + T("Aaj par jaaiye", "Go to Today") + '</button><button class="btn" data-a="copyJson">' + T("Data copy kijiye", "Copy my data") + "</button></div>"; } catch (e2) {}
    }
  };
})(render);
(function () {
  var sc = $("#screen"); if (sc) sc.removeAttribute("aria-live");
  var g = $("#gatebar b"); if (g) g.textContent = "Tele-MANAS 14416 · 112";
})();
TASKS.push(["land", "A day after reaching someone, say how it went"]);
TASKS.push(["safe", "Open a person and turn their suggestions off"]);
var noSuggest5 = A.noSuggest; A.noSuggest = function (el) { noSuggest5(el); task("safe"); };


