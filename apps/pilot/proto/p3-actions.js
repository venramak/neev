/* Neev v3 · actions, hold, bench, events, boot */
var HOLD = { t: 0, raf: 0, armed: 0 };
function holdStart() {
  var b = $("#hold"); if (!b || HOLD.t) return; b.classList.add("holding"); HOLD.t = performance.now(); var ring = $("#ring");
  (function tick() { var p = Math.min(1, (performance.now() - HOLD.t) / 1200); if (ring) ring.setAttribute("stroke-dashoffset", String(326.7 * (1 - p))); if (p >= 1) { HOLD.t = 0; promise(); return; } HOLD.raf = requestAnimationFrame(tick); })();
}
function holdEnd() { if (!HOLD.t) return; cancelAnimationFrame(HOLD.raf); HOLD.t = 0; var b = $("#hold"), ring = $("#ring"); if (b) b.classList.remove("holding"); if (ring) ring.setAttribute("stroke-dashoffset", "326.7"); var l = $("#holdLabel"); if (l) l.textContent = T("Thoda aur der.", "Hold a little longer."); }
function promise() {
  try { if (navigator.vibrate) navigator.vibrate(30); } catch (e) {}
  task("hold");
  if (V.route === "start") {
    var x = S.start || startOptions()[0], jab = $("#jabIn") ? $("#jabIn").value.trim() : "";
    setToday({ person: x.person, job: x.job, n: x.n, text: x.act, promised: true, when: x.when });
    if (jab) S.today.jab = jab;
    V.stage = null; save(); go("aaj"); toast(T("Vaada rakh liya. Aapka naksha ab yahan rehta hai.", "Promise kept. Your map lives here now.")); return;
  }
  S.today.promised = true; save(); render();
}

/* ---------- look actions ---------- */
function commitInputs() {
  var q = curQ(); if (!q) return true;
  if (q.type === "text") {
    var v = (($("#qText") || {}).value || "").trim(); S.look.a[q.id] = v; save();   // save first, always
    if (gateHit(v) && !V.gateSeen[v]) { V.gateSeen[v] = 1; S.look.soft = true; save(); openGate(); return false; }
  }
  if (q.type === "names") { var inp = $("#nmIn"); if (inp && inp.value.trim()) { if (!addName(inp.value, true)) return false; } }
  return true;
}
function addName(raw, silent) {
  var q = curQ(), n = String(raw || "").trim().replace(/\s+/g, " ").slice(0, 40); if (!n) return true;
  if (gateHit(n)) { if (!V.gateSeen[n]) { V.gateSeen[n] = 1; S.look.soft = true; save(); openGate(); return false; } return true; }
  n = canon(n);
  var exact = people(true).filter(function (p) { return p.name.toLowerCase() === n.toLowerCase(); })[0];
  if (exact) n = exact.name;
  else { var mc = mergeCandidate(n); if (mc && !silent) { V.merge = { n: n, ex: mc }; render(); return false; } }
  var cur = S.look.a[q.id] = Array.isArray(S.look.a[q.id]) ? S.look.a[q.id] : [];
  if (cur.map(function (x) { return x.toLowerCase(); }).indexOf(n.toLowerCase()) < 0) cur.push(n);
  save(); return true;
}
function lookNext() {
  var steps = layerSteps(S.look.L);
  if (S.look.s < steps.length - 1) { S.look.s++; save(); render(); return; }
}
function completeLayer(next) {
  var n = S.look.L;
  if (S.look.done.indexOf(n) < 0) S.look.done.push(n);
  if (n >= 3 && !S.look.unlocked) { S.look.unlocked = true; S.look.finished = nowMs(); S.snap = { date: nowMs(), a: JSON.parse(JSON.stringify(S.look.a)) }; S.lastOpen = nowMs(); task("look"); }
  save();
  if (next === "start") { V.stage = null; go("start"); return; }
  if (next === "layer" && LAYERS[n]) { startLayer(n + 1); render(); return; }
  if (S.look.unlocked) { go("map"); toast(T("Yahin rukna bhi poora hai.", "Stopping here is complete too.")); }
  else { V.paused = true; render(); }
}

var A = {
  go: function (el) { closeSheet(); document.body.classList.remove("bench-open"); if (el.dataset.to === "knows") task("knows"); go(el.dataset.to); },
  goTog: function (el) { V.tog = el.dataset.t; go("together"); },
  lang: function () { S.lang = S.lang === "hi" ? "en" : "hi"; save(); V.sawaal = null; V.agenda = null; render(); },
  theme: function () { var r = document.documentElement, cur = r.getAttribute("data-theme"); var dark = cur ? cur === "dark" : !matchMedia("(prefers-color-scheme: light)").matches; r.setAttribute("data-theme", dark ? "light" : "dark"); },
  bench: function () { document.body.classList.toggle("bench-open"); },
  gate: openGate, close: closeSheet,
  backdrop: function (el, ev) { if (ev.target === el) closeSheet(); },
  copy: function (el) { copyText(el.dataset.v); },
  term: function (el) { openTerm(el.dataset.k); },
  thNext: function () { S.look.th = 1; save(); render(); },
  thBegin: function () { S.look.started = true; S.look.L = S.look.fromEp ? EP_LAYER[S.look.fromEp] > 3 ? 1 : 1 : 1; S.look.s = 0; save(); render(); },
  lkNext: function () { lookNext(); },
  lkBack: function () { commitInputs(); V.merge = null; if (S.look.s > 0) S.look.s--; else if (S.look.L > 1) { S.look.L--; S.look.s = layerSteps(S.look.L).length - 1; } save(); render(); },
  lkPause: function () { commitInputs(); save(); V.paused = true; render(); },
  lkResume: function () { V.paused = false; render(); },
  tenderLater: function () { S.look.tenderLater = true; save(); if (LAYERS[S.look.L]) { startLayer(S.look.L + 1); render(); } else completeLayer("stop"); toast(T("Theek hai. Yeh parat kabhi bhi.", "Fine. This layer is here any day.")); },
  qNext: function () { if (V.merge) return; if (commitInputs()) lookNext(); },
  qSkip: function () { lookNext(); },
  qNone: function () { var q = curQ(); S.look.a[q.id] = []; save(); lookNext(); },
  nmAdd: function () { var i = $("#nmIn"); if (addName(i.value)) render(); },
  nmPick: function (el) { if (addName(el.dataset.n, true)) render(); },
  nmDel: function (el) { var q = curQ(); S.look.a[q.id].splice(+el.dataset.i, 1); save(); render(); },
  nmGroup: function (el) { var k = el.dataset.n.toLowerCase(), cur = k in S.groups ? S.groups[k] : GROUP_RE.test(el.dataset.n); S.groups[k] = !cur; save(); render(); },
  mergeYes: function () { var m = V.merge; S.aliases[m.n.toLowerCase()] = m.ex; V.merge = null; save(); addName(m.ex, true); render(); },
  mergeNo: function () { var m = V.merge; V.merge = null; var q = curQ(), cur = S.look.a[q.id] = Array.isArray(S.look.a[q.id]) ? S.look.a[q.id] : []; if (cur.indexOf(m.n) < 0) cur.push(m.n); save(); render(); },
  opt: function (el) {
    var q = curQ(), v = el.dataset.v;
    if (q.type === "multi") { var arr = Array.isArray(S.look.a[q.id]) ? S.look.a[q.id] : []; var i = arr.indexOf(v); if (i >= 0) arr.splice(i, 1); else arr.push(v); S.look.a[q.id] = arr; save(); render(); }
    else { S.look.a[q.id] = v; save(); render(); setTimeout(function () { if (curQ() === q) lookNext(); }, 260); }
  },
  layerDone: function (el) { completeLayer(el.dataset.next); },
  openLayer: function (el) { startLayer(+el.dataset.n); go("look"); },
  pickStart: function (el) { var o = startOptions().filter(function (x) { return x.k === el.dataset.k; })[0]; S.start = Object.assign({}, o, { when: S.start && S.start.when }); save(); render(); },
  choiceGo: function () { if (!S.start) S.start = startOptions()[0]; V.stage = "promise"; save(); render(); },
  backChoice: function () { V.stage = null; render(); },
  notToday: function () { V.stage = null; if (S.start && !S.today) setToday({ person: S.start.person, job: S.start.job, n: S.start.n, text: S.start.act }); go("map"); toast(T("Koi jaldi nahi. Naksha yahin hai.", "No rush. Your map is here.")); },
  when: function (el) { if (!S.start) S.start = startOptions()[0]; S.start.when = el.dataset.w; save(); document.querySelectorAll("#whens .chip").forEach(function (c) { c.classList.toggle("on", c === el); }); },
  twoTap: function () { if (HOLD.armed && Date.now() - HOLD.armed < 4000) { HOLD.armed = 0; promise(); return; } HOLD.armed = Date.now(); var b = $("#twoTap"); if (b) b.textContent = T("Ek baar aur", "Once more to promise"); },

  /* today */
  nudgeX: function (el) { S.nudgeSeen[el.dataset.k] = 1; save(); render(); },
  nudgeOff: function (el) { S.nudgeOff[el.dataset.kind] = 1; save(); render(); toast(T("Band kar diya.", "Turned off.")); },
  nudgeGo: function (el) {
    var act = el.dataset.act; S.nudgeSeen[el.dataset.k] = 1; save();
    if (act === "checkin") { render(); var c = document.querySelector(".card .layerpill"); if (c) c.scrollIntoView({ block: "center" }); }
    else if (act === "line") openShabd(el.dataset.p, "reach");
    else if (act === "rituals") go("rituals");
    else if (act === "ep") { var lay = EP_LAYER[+el.dataset.ep]; startLayer(lay); go("look"); }
    else if (act === "relook") { startLayer(3); go("look"); }
  },
  ciTog: function (el) { V.ci = V.ci || { held: [], hold: [] }; var arr = V.ci[el.dataset.kind], n = el.dataset.n, i = arr.indexOf(n); if (i >= 0) arr.splice(i, 1); else arr.push(n); el.classList.toggle("on"); },
  ciSave: function () {
    var c = V.ci || { held: [], hold: [] }, what = ($("#ciWhat") || {}).value || "";
    if (gateHit(what)) { openGate(); }
    S.checkins[weekKey()] = { held: c.held.slice(), hold: c.hold.slice() };
    c.held.forEach(function (n) { S.kept.push({ date: dstr(), who: n, what: what.trim(), src: "checkin" }); });
    V.ci = null; save(); task("checkin"); render(); toast(T("Rakh liya.", "Kept."));
  },
  shaky: function () { openGate(); },
  planEdit: function () { V.rit = "plan"; go("rituals"); },
  planSave: function () { S.plan = { signs: $("#plSigns").value.trim(), p1: $("#plP1").value.trim(), p2: $("#plP2").value.trim(), say: $("#plSay").value.trim(), place: $("#plPlace").value.trim() }; save(); task("plan"); toast(T("Yojana rakh li. Mushkil din par yeh pehle dikhegi.", "Plan kept. It will appear first on a hard day.")); render(); },
  swap: function () { var a = S.today; a.swaps = (a.swaps || 0) + 1; var cands = pool(a.job || "drift"), pick = []; for (var i = 0; i < 5; i++) pick.push(cands[(hash32(a.date + a.person) + a.swaps * 5 + i) % cands.length]); ai("chunna", { candidates: pick, person: a.person, job: a.job, seed: a.date + a.person, bump: a.swaps }).then(function (r) { if (!r) return; a.text = r.act; a.n = r.n; a.src = r._tier; a.fell = r._fell; a.hindi = ""; save(); render(); }); },
  hindi: function () { var a = S.today; ai("bhasha", { text: a.text, person: a.person }).then(function (r) { if (!r) return; if (r._tier === "t0") { toast(T("Hindi ke liye Claude chalu kijiye.", "Turn on Claude for Hindi.")); return; } a.hindi = r.text; save(); render(); }); },
  pickPerson: function () { var ps = oneToOne(); if (ps.length < 2) return; var i = ps.findIndex(function (p) { return p.name === S.today.person; }); var p = ps[(i + 1) % ps.length]; S.today.person = p.name; S.today.job = p.jobs[0] || "drift"; save(); render(); },
  done: function () { var a = S.today; a.done = true; S.done.push({ date: a.date, person: a.person, text: a.text, job: a.job }); save(); chorusAdd("done"); task("act"); render(); },
  skip: function () { S.today.skipped = true; save(); render(); },
  sentLine: function () { chorusAdd("line"); },
  shared: function () { task("card"); chorusAdd("card"); },
  shabd: function () { openShabd(); },
  tone: function (el) { document.querySelectorAll("#tones .chip").forEach(function (c) { c.classList.toggle("on", c === el); }); V.shabd.tone = el.dataset.t; },
  shabdGo: function () {
    var who = ($("#sWho").value || "").trim(), intent = $("#sIntent").value || "", btn = $("#shabdGo");
    btn.disabled = true;
    ai("shabd", { person: who, tone: V.shabd.tone }, intent).then(function (r) { btn.disabled = false; if (!r) return; $("#shabdOut").innerHTML = draftBlock(r, intent.trim()); task("shabd"); });
  },
  copyDraft: function () { copyText($("#draft").value); },
  aaina: function () { var out = $("#aainaOut"); ai("aaina", { lines: portraitLines() }).then(function (r) { if (!r) return; out.innerHTML = '<p style="margin:8px 0 0;font-size:18px">' + esc(r.paragraph) + '</p><div class="chiprow" style="margin-top:8px">' + srcChip(r) + "</div>"; }); },
  explain: function (el) { var k = el.dataset.k, out = $("#ex-" + k); ai("explain", { k: k }).then(function (r) { if (!r || !out) return; out.innerHTML = '<p style="margin:8px 0 0">' + esc(r.text) + '</p><div class="chiprow">' + srcChip(r) + "</div>"; }); },

  /* map */
  mapTab: function (el) { V.tab = el.dataset.t; render(); },
  mapView: function (el) { V.mapView = el.dataset.v; render(); },
  person: function (el) { openPerson(el.dataset.k); },
  setRing: function (el) { var k = el.dataset.k; S.over[k] = Object.assign({}, S.over[k], { ring: el.dataset.r }); save(); task("person"); closeSheet(); render(); },
  toggleGroup: function (el) { var k = el.dataset.k, p = people(true).filter(function (x) { return x.key === k; })[0]; S.groups[k] = !(p && p.group); save(); render(); openPerson(k); },
  toggleKeep: function (el) { var k = el.dataset.k; if (S.keep[k]) delete S.keep[k]; else S.keep[k] = dstr(); save(); render(); openPerson(k); },
  dateAdd: function (el) { var d = $("#pDate").value; if (!d) return; S.dates.push({ date: d, label: el.dataset.n }); save(); toast(T("Tareekh rakh li.", "Date kept.")); },
  removePerson: function (el) { var k = el.dataset.k; S.over[k] = Object.assign({}, S.over[k], { removed: true }); save(); closeSheet(); render(); },
  personAct: function (el) { var n = el.dataset.n, job = jobFor(n), a = TIER0.chunna({ candidates: pool(job), seed: dstr() + n }); setToday({ person: n, job: job, n: a.n, text: a.act }); closeSheet(); go("aaj"); },
  addName: function () { var v = ($("#addName").value || "").trim(); if (!v) return; if (gateHit(v)) { openGate(); return; } S.extra.push(v.slice(0, 40)); delete S.over[v.toLowerCase()]; save(); render(); },
  keptAdd: function () { var w = $("#kWho").value.trim(), t = $("#kWhat").value.trim(); if (!w) { toast(T("Naam likhiye.", "Add a name.")); return; } if (gateHit(t)) openGate(); S.kept.push({ date: dstr(), who: w.slice(0, 40), what: t.slice(0, 200), src: "note" }); save(); task("kept"); render(); },
  walkAdd: function () { var n = $("#wName").value.trim(), w = $("#wWhere").value.trim(); if (!n) return; S.walk.push({ name: n.slice(0, 40), where: w.slice(0, 60), date: dstr() }); save(); task("walk"); render(); },

  /* rituals */
  ritTab: function (el) { V.rit = el.dataset.t; render(); },
  vesselNew: function (el) { vesselSheet({ what: el.dataset.what || "" }); },
  vesselFrom: function (el) { var c = CATALOGUE.filter(function (x) { return x[0] === el.dataset.id; })[0]; vesselSheet({ what: T(c[1], c[2]), form: c[4], when: T(c[5], c[6]) }); },
  formPick: function (el) { V.form = el.dataset.f; document.querySelectorAll("#forms .chip").forEach(function (c) { c.classList.toggle("on", c === el); }); },
  vesselWords: function () { var what = $("#vWhat").value.trim(); ai("vessel", { what: what }).then(function (r) { if (!r) return; $("#vWords").value = r.words; $("#vSrc").innerHTML = srcChip(r); }); },
  vesselSave: function () { var v = { what: $("#vWhat").value.trim(), who: $("#vWho").value.trim(), when: $("#vWhen").value.trim(), form: V.form || "time", words: $("#vWords").value.trim(), created: dstr(), lastKept: "" }; if (!v.what) { toast(T("Kya karte hain, likhiye.", "Say what you do.")); return; } if (!v.words) v.words = TIER0.vessel({ what: v.what }).words; S.vessels.push(v); save(); task("vessel"); closeSheet(); V.rit = "mine"; render(); },
  vesselKept: function (el) { S.vessels[+el.dataset.i].lastKept = dstr(); save(); render(); toast(T("Nibhaya.", "Kept.")); },
  vesselDel: function (el) { S.vessels.splice(+el.dataset.i, 1); save(); render(); },
  job: function (el) { V.job = el.dataset.j; render(); },
  pick: function (el) { var a = N.acts[+el.dataset.n - 1]; setToday({ person: (S.today && S.today.person) || "", job: a.job, n: a.n, text: a.t }); go("aaj"); },

  /* together */
  togTab: function (el) { V.tog = el.dataset.t; V.ritual = null; render(); },
  fewWho: function (el) { V.fewWho = el.dataset.n; V.fewJobs = null; render(); },
  fewJob: function (el) { var j = el.dataset.j, p = oneToOne().filter(function (x) { return x.name === (V.fewWho || (oneToOne()[0] || {}).name); })[0]; V.fewJobs = V.fewJobs || (p ? p.jobs.slice(0, 1) : []); var i = V.fewJobs.indexOf(j); if (i >= 0) V.fewJobs.splice(i, 1); else V.fewJobs.push(j); render(); },
  fewCard: function (el) { V.tog = "few"; V.fewWho = el.dataset.n; V.fewJobs = null; go("together"); },
  fewMake: function () {
    var ps = oneToOne(), who = V.fewWho || (ps[0] && ps[0].name), p = ps.filter(function (x) { return x.name === who; })[0], jobs = V.fewJobs || (p ? p.jobs.slice(0, 1) : []);
    var jl = jobs.map(function (j) { return P(JOBLINE[j]); }).join(T("; ", "; "));
    ai("shabd", { person: who, tone: "few", jobline: jl }).then(function (r) { if (!r) return; $("#fewOut").innerHTML = draftBlock(r) + '<p class="small">' + T("Unke liye bhi: ", "For them too: ") + esc(N.appUrl) + "</p>"; task("few"); });
  },
  gotSave: function () { var w = $("#gWho").value.trim(), m = $("#gMsg").value.trim(); if (!w) { toast(T("Naam likhiye.", "Add who sent it.")); return; } S.kept.push({ date: dstr(), who: w.slice(0, 40), what: m.slice(0, 300), src: "card" }); save(); toast(T("Sambhaal liya. 'Jinhone rakha' mein hai.", "Kept, in Kept by.")); V.tab = "kept"; go("map"); },
  ritualAgenda: function () { var R = V.ritual; ai("saath", { kind: R.kind === "chairs" ? "chairs" : "round" }).then(function (r) { if (!r) return; R.ag = r; render(); }); },
  chairsNext: function () { var R = V.ritual; if (R.step === 1) { R.a1 = $("#rA").value; R.b1 = $("#rB").value; } if (R.step === 2) { R.a2 = $("#rA").value; R.b2 = $("#rB").value; } R.step++; task("ritual"); render(); },
  chairsEnd: function () { V.ritual = null; render(); toast(T("Agle mahine phir.", "Again next month.")); },
  roundSave: function () { var t = $("#rAct").value.trim(); if (!t) return; S.done.push({ date: dstr(), person: T("parivaar", "family"), text: t, job: "belong" }); save(); task("ritual"); toast(T("Ghar ka kaam rakh liya.", "Family act kept.")); },
  cellNew: function () { var name = ($("#cName").value || "").trim() || T("Mera Cell", "My Cell"), al = "ABCDEFGHJKMNPQRSTUVWXYZ23456789", code = ""; for (var i = 0; i < 6; i++) code += al[Math.floor(Math.random() * al.length)]; S.cell = { name: name, code: code }; save(); render(); },
  cellJoin: function () { var c = ($("#cCode").value || "").trim().toUpperCase(); if (c.length !== 6) { toast(T("Code 6 akshar ka hota hai.", "Codes have 6 characters.")); return; } S.cell = { name: "Cell " + c, code: c }; save(); render(); },
  cellLeave: function () { S.cell = null; save(); render(); },
  tick: function () { if (!CAP.db) { toast(T("Tick rakh liya.", "Tick kept.")); return; } try { CAP.db.collection("cellticks").add({ c: S.cell.code, w: weekKey() }).then(refreshCell, function () {}); } catch (e) {} },
  agenda: function () { ai("saath", { kind: "cell" }).then(function (r) { if (!r) return; V.agenda = r; render(); }); },
  cardType: function (el) { V.card = el.dataset.t; render(); },
  savePng: function () { task("card"); $("#cv").toBlob(function (bl) { if (bl) saveFile("neev-card.png", bl, T("Card save ho gaya.", "Card saved.")); }, "image/png"); },

  /* night, return, data, lock */
  saans: function () { runSaans(); },
  raah: function () { var t = $("#raatDraft").value || ""; S.raatDraft = t; save(); var p = S.plan.p1 || (oneToOne().filter(function (x) { return x.ring === "few"; })[0] || {}).name || ""; ai("raah", { person: p }, t).then(function (r) { if (!r) return; $("#raahOut").innerHTML = draftBlock(r); }); },
  phPick: function (el) { var n = el.dataset.n; setToday({ person: n, job: jobFor(n), text: T("Bhejiye: ", "Send: ") + fill(SHABD.reach, n) }); S.lastOpen = nowMs(); save(); go("aaj"); },
  phDone: function () { S.lastOpen = nowMs(); save(); go("aaj"); },
  tier: function (el) { S.tier = el.dataset.t; save(); render(); },
  ics: function () { S.rhythmDay = +$("#rhythm").value; save(); ics(); },
  pinSave: function () { var v = ($("#pinSet").value || "").trim(); if (!/^\d{4}$/.test(v)) { toast(T("4 ank ka PIN.", "Use 4 digits.")); return; } S.pin = v; save(); task("pin"); toast(T("PIN laga.", "PIN set.")); render(); },
  pinClear: function () { S.pin = ""; save(); render(); },
  pinKey: function (el) { var d = el.dataset.d; if (d === "⌫") V.pinIn = V.pinIn.slice(0, -1); else if (V.pinIn.length < 4) V.pinIn += d; if (V.pinIn.length === 4) { if (V.pinIn === S.pin) { V.locked = false; V.pinIn = ""; route(); return; } toast(T("Galat PIN.", "Wrong PIN.")); V.pinIn = ""; } render(); },
  pinForgot: function (el) { if (el.dataset.armed) { wipeAll(); return; } el.dataset.armed = "1"; el.textContent = T("Pakka? Sab mit jaayega. Phir dabaiye.", "Sure? Everything is deleted. Press again."); },
  copyJson: function () { copyText(JSON.stringify(S, null, 2)); },
  wipe: function (el) { if (el.dataset.armed) { wipeAll(); return; } el.dataset.armed = "1"; el.textContent = T("Pakka? Phir dabaiye", "Sure? Press again"); },
  trace: function () { if (window.innerWidth <= 900) document.body.classList.add("bench-open"); var t = $("#lastAI"); if (t) t.scrollIntoView({ block: "start" }); },

  /* bench */
  taskBox: function (el) { S.tasks[el.dataset.id] = el.checked; save(); },
  felt: function (el) { V.felt = el.dataset.f; renderBench(); },
  felt2: function (el) { V.felt2 = el.dataset.f; renderBench(); },
  role: function () { V.role = $("#roleSel").value; renderBench(); },
  xr: function (el) { V.xr = V.xr || {}; V.xr[el.dataset.q] = +el.dataset.v; renderBench(); },
  fbSend: function () {
    var note = ($("#fbNote").value || "").trim(); if (!note && !V.felt && !V.felt2 && !V.xr) { V.benchMsg = "Pick something or write a note first."; renderBench(); return; }
    var rec = { at: new Date().toISOString(), v: 3, role: V.role, screen: screenId(), felt: V.felt || "", clarity: V.felt2 || "", ratings: V.xr || null, note: note.slice(0, 2000), tier: S.tier, lang: S.lang, width: window.innerWidth };
    var done = function (m) { V.benchMsg = m; V.felt = ""; V.felt2 = ""; V.xr = null; renderBench(); };
    if (!CAP.db) { try { var k = "neev.proto.fb"; var arr = JSON.parse(localStorage.getItem(k) || "[]"); arr.push(rec); localStorage.setItem(k, JSON.stringify(arr)); } catch (e) {} done("Saved on this device only (no shared store in this view)."); return; }
    CAP.db.collection("feedback").add(rec).then(function () { done("Sent. Thank you."); }, function (e) { V.benchMsg = "Could not send (" + ((e && e.code) || "error") + ")."; renderBench(); });
  },
  scCold: function () { wipeAll(true); go("look"); },
  scEp: function () { wipeAll(true); location.hash = "e1"; },
  scFill3: function () { fillExample(3); S.look.L = 3; S.look.s = layerSteps(3).length - 1; save(); closeSheet(); go("look"); toast("Example answers to layer 3. Not yours."); },
  scFill10: function () { fillExample(10); S.look.done = [1, 2, 3, 4, 5, 6, 7, 8, 9]; S.look.unlocked = true; S.snap = { date: nowMs() - 100 * 864e5, a: JSON.parse(JSON.stringify(S.look.a)) }; S.look.a.weekly = (S.look.a.weekly || []).concat(["Priya"]); S.look.L = 10; S.look.s = layerSteps(10).length - 1; save(); closeSheet(); go("look"); },
  scDay: function () { if (!S.look.unlocked) { fillExample(5); S.look.done = [1, 2, 3, 4, 5]; S.look.unlocked = true; S.snap = { date: nowMs() - 30 * 864e5, a: JSON.parse(JSON.stringify(S.look.a)) }; S.keep["mum"] = dstr(new Date(nowMs() - 50 * 864e5)); S.dates.push({ date: dstr(new Date(nowMs() + 864e5)), label: "Grandpa's anniversary" }); } SIM.hour = null; V.raatShown = true; S.today = null; S.lastOpen = nowMs(); S.rhythmDay = now().getDay(); S.nudgeSeen = {}; save(); closeSheet(); go("aaj"); },
  scNight: function () { SIM.hour = 2; closeSheet(); go("raat"); },
  scAway: function () { if (!S.look.unlocked) A.scDay(); S.lastOpen = nowMs() - 8 * 864e5; save(); closeSheet(); boot(); },
  scGate: function () { wipeAll(true); S.look.started = true; S.look.L = 2; S.look.s = 1; save(); go("look"); setTimeout(function () { var i = $("#qText"); if (i) i.value = "nothing. I don't want to live like this"; toast("Now tap Continue."); }, 100); },
  scPin: function () { if (!S.look.unlocked) A.scDay(); S.pin = "1234"; save(); V.locked = true; V.pinIn = ""; render(); toast("Shared phone: PIN is 1234"); },
  scReset: function (el) { if (el.dataset.armed) { wipeAll(true); go("look"); return; } el.dataset.armed = "1"; el.textContent = "Press again to reset"; }
};
function copyText(v) { try { navigator.clipboard.writeText(v).then(function () { toast("Copied"); }, function () { toast(T("Copy nahi hua.", "Couldn't copy.")); }); } catch (e) { toast(T("Copy nahi hua.", "Couldn't copy.")); } }
function wipeAll(keepLang) { var lang = S.lang; try { localStorage.removeItem(KEY); } catch (e) {} S = fresh(); if (keepLang) S.lang = lang; save(); V.traces = []; V.locked = false; V.paused = false; V.merge = null; V.stage = null; V.gateSeen = {}; SIM.hour = null; SIM.dayOffset = 0; closeSheet(); if (!keepLang) go("look"); }
function fillExample(upto) {
  var A0 = { first: ["Leela"], food: "Coffee", made: "bought", hands: "b", seen: ["Guard at the gate", "Asha"], night: ["Mum", "Leela"], called: ["Leela"], notice: ["Mum", "Karan"], would: ["Tom"], weekly: ["Mum", "Karan", "Football group"], place: "The corner bakery", ritual: "Sunday lunch with Mum", quiet: "0", truth: ["Karan"], bigger: ["Ms. Rao"], taught: ["Grandpa"], leans: ["Ishaan"], carryout: ["Mum"], learned: ["Ishaan"], lost: ["Grandpa"], quietTie: ["Tom"], mend: [], beyond: ["faith", "music"], reach: ["phone", "person"], smaller: ["Mr. Shah"], line: "Eat first, then talk", gave: ["Grandpa"], passon: ["Ishaan"], kplace: "Our building", keepers: ["Bahadur"], kwish: "maybe" };
  var keep = {}; LAYERS.slice(0, upto).forEach(function (Ly) { Ly.qs.forEach(function (q) { if (q.id in A0) keep[q.id] = A0[q.id]; }); });
  S.look.a = keep; S.groups = { "football group": true }; S.look.started = true; S.look.th = 2; S.look.done = []; for (var i = 1; i < upto; i++) S.look.done.push(i);
  S.over = {}; S.extra = []; S.aliases = {};
}
function screenId() { if (V.locked) return "lock"; if (V.route === "look") { var st = curStep(); return "look:L" + S.look.L + ":" + (S.look.started ? st.t + (st.q != null ? st.q : "") : "threshold" + S.look.th); } if (V.route === "map") return "map:" + V.tab; if (V.route === "rituals") return "rituals:" + V.rit; if (V.route === "together") return "together:" + V.tog; return V.route; }
function portraitLines(ps) {
  ps = ps || people(); var a = S.look.a, out = [], liv = living(ps);
  var nP = liv.filter(function (p) { return !p.group; }).length, nG = liv.length - nP;
  out.push(liv.length ? T("Aapne " + nP + " logon" + (nG ? " aur " + nG + " group" : "") + " ke naam liye.", "You named " + nP + (nP === 1 ? " person" : " people") + (nG ? " and " + nG + (nG === 1 ? " group" : " groups") : "") + ".") : T("Aapne abhi koi naam nahi liya. Yeh sachcha jawab hai.", "You haven't named anyone yet. That's an honest answer."));
  var many = liv.filter(function (p) { return p.many && !p.group; }).map(function (p) { return p.name; }); if (many.length) out.push(T(list(many) + " ek se zyada tarah se thaamte hain.", list(many) + " " + vs(many, "holds", "hold") + " you in more than one way."));
  var few = liv.filter(function (p) { return p.ring === "few" && !p.maybe; }).map(function (p) { return p.name; }); if (few.length) out.push(T("Aapke apne: " + list(few) + ".", "Your few: " + list(few) + "."));
  var ch = chairs(ps), open = ch.filter(function (c) { return !c.names.length; }); out.push(open.length ? T("Khaali kursiyan: " + list(open.map(function (c) { return P(c.job.name); })) + ".", "Open chairs: " + list(open.map(function (c) { return P(c.job.name); })) + ".") : T("Paancho kaamon ke saath naam hai.", "All five things people do have a name."));
  var lean = uniq(withTag("leans", ps).concat(withTag("carryout", ps))); if (lean.length) out.push(T(list(lean) + " aap par tike hain.", list(lean) + " " + vs(lean, "leans", "lean") + " on you."));
  var lost = withTag("lost", ps); if (lost.length) out.push(T("Saath chalte hain: " + list(lost) + ".", "Carried with you: " + list(lost) + "."));
  if (a.place && !isNone(a.place)) out.push(T("Jahan aapko jaante hain: " + a.place + ".", "Known by name at: " + a.place + "."));
  return out;
}
var SAANS = null;
function runSaans() {
  var c = $("#saans"), l = $("#saansL"), b = $("#saansBtn"); if (!c) return;
  if (SAANS) { clearTimeout(SAANS); SAANS = null; c.className = "saans"; l.textContent = ""; b.textContent = T("Shuru kijiye", "Begin"); return; }
  b.textContent = T("Rokiye", "Stop"); var n = 0;
  (function breath() { if (!$("#saans")) { SAANS = null; return; } if (n >= 6) { c.className = "saans"; l.textContent = T("Ek minute ho gaya.", "One minute done."); b.textContent = T("Phir se", "Again"); SAANS = null; return; } n++; c.className = "saans in"; l.textContent = T("Andar…", "In…") + " " + n + "/6"; SAANS = setTimeout(function () { c.className = "saans out"; l.textContent = T("Bahar…", "Out…"); SAANS = setTimeout(breath, 6000); }, 4000); })();
}

/* ---------- bench ---------- */
var TASKS = [
  ["look", "Reach your map (layer 3) without help"],
  ["term", "Find out what 'your few' means without leaving the screen"],
  ["hold", "Promise an act, or choose 'Not today'"],
  ["checkin", "Do the weekly minute: who held you, who you held"],
  ["few", "Make a 'you're in my few' card for someone"],
  ["vessel", "Turn something you already do into a vessel"],
  ["plan", "Write your hard-day plan"],
  ["gate", "Find the help numbers from any screen"]
];
var ROLES = ["tester", "product designer", "UX or HCI", "behavioural scientist", "psychologist or clinician", "psychometrician", "neurologist or cognitive scientist", "AI expert", "philosopher or ethicist", "sociologist", "religious scholar", "privacy and security"];
function task(id) { if (!S.tasks[id]) { S.tasks[id] = true; save(); renderBench(); } }
function renderBench() {
  var b = $("#bench"); if (!b) return;
  var tr = V.traces[0], expert = V.role !== "tester";
  var h = '<h2>Test bench</h2><p class="small" style="margin:0">Not part of the app. Version 3. Set up a moment, try the tasks, then record what you saw. Every note is tagged with the exact screen.</p>';
  h += '<h3>Who is testing</h3><select class="t" id="roleSel" data-a="role">' + ROLES.map(function (r) { return "<option" + (V.role === r ? " selected" : "") + ">" + r + "</option>"; }).join("") + "</select>";
  h += '<h3>Scenarios</h3><div class="scen">' + [["scCold", "Cold open: a shared link"], ["scEp", "Arriving from Episode 1"], ["scFill3", "Example answers to layer 3"], ["scFill10", "All ten layers, 100 days later"], ["scDay", "An ordinary day (nudges on)"], ["scNight", "It is 2:40 a.m."], ["scAway", "Back after 8 days"], ["scGate", "Risk words typed in the look"], ["scPin", "Shared phone with a PIN"]].map(function (s) { return '<button class="btn" data-a="' + s[0] + '">' + s[1] + "</button>"; }).join("") + '</div><button class="btn ghost" style="margin-top:8px" data-a="scReset">Reset everything</button><p class="small" style="margin-top:8px">Now: ' + esc(screenId()) + "</p>";
  h += '<h3>AI tier</h3><div class="seg"><button data-a="tier" data-t="t0" aria-pressed="' + (S.tier === "t0") + '">Tier 0 · pre-written</button><button data-a="tier" data-t="t3" aria-pressed="' + (S.tier === "t3") + '">Tier 3 · Claude</button></div><p class="small" style="margin:0">' + (CAP.sample ? "Claude is reachable; first use asks permission and uses your own Claude usage." : "Claude is not reachable in this view; tier 3 falls back to tier 0.") + " The look never uses AI. Names and your own sentences are never sent.</p>";
  h += "<h3>Tasks to try</h3>" + TASKS.map(function (t) { return '<label class="task"><input type="checkbox" data-a="taskBox" data-id="' + t[0] + '"' + (S.tasks[t[0]] ? " checked" : "") + "><span>" + t[1] + "</span></label>"; }).join("");
  h += '<h3 id="lastAI">Last AI request</h3>';
  if (!tr) h += '<p class="small">Nothing yet. Try “A starter line”, “Hear your map read back” or “Say it more simply”.</p>';
  else h += '<div class="trace"><div>' + esc(tr.fn) + " · " + esc(tr.at) + (tr.ms != null ? " · " + tr.ms + " ms" : "") + '</div><ul class="steps">' + tr.steps.map(function (s) { return '<li><span class="' + s[0] + '">' + (s[0] === "ok" ? "✓" : "✗") + "</span><span>" + esc(s[1]) + "</span></li>"; }).join("") + "</ul>" + (tr.prompt ? '<details><summary>What Claude saw</summary><pre class="box">' + esc(tr.prompt) + "</pre></details>" : "") + (tr.raw ? '<details><summary>Raw reply</summary><pre class="box">' + esc(tr.raw) + "</pre></details>" : "") + (tr.result ? '<details><summary>Shown on screen</summary><pre class="box">' + esc(JSON.stringify(tr.result, null, 1)) + "</pre></details>" : "") + "</div>";
  if (!expert) h += '<h3>How did that feel?</h3><p class="small" style="margin:0 0 8px">After this screen: steadier or smaller? Did it make sense without the video?</p><div class="felt">' + [["steadier", "Steadier"], ["same", "Same"], ["smaller", "Smaller"]].map(function (f) { return '<button data-a="felt" data-f="' + f[0] + '" aria-pressed="' + (V.felt === f[0]) + '">' + f[1] + "</button>"; }).join("") + '</div><div class="felt" style="margin-top:6px">' + [["clear", "Clear"], ["unclear", "Confusing"], ["seen", "I saw something new"]].map(function (f) { return '<button data-a="felt2" data-f="' + f[0] + '" aria-pressed="' + (V.felt2 === f[0]) + '">' + f[1] + "</button>"; }).join("") + "</div>";
  else h += '<h3>Expert review of this screen</h3><p class="small" style="margin:0 0 8px">1 = serious problem, 5 = no concern, from your discipline.</p>' + [["clear", "Clear and usable"], ["safe", "Safe for a vulnerable person"], ["true", "Honest: claims nothing it can't support"], ["human", "Leads to a human, not to the screen"]].map(function (q) { return '<p class="small" style="margin:8px 0 4px">' + q[1] + '</p><div class="felt" style="grid-template-columns:repeat(5,1fr)">' + [1, 2, 3, 4, 5].map(function (v) { return '<button data-a="xr" data-q="' + q[0] + '" data-v="' + v + '" aria-pressed="' + (V.xr && V.xr[q[0]] === v) + '">' + v + "</button>"; }).join("") + "</div>"; }).join("");
  h += '<label class="f" for="fbNote">' + (expert ? "Finding (what, why it matters, what you'd change)" : "What happened?") + '</label><textarea class="t" id="fbNote" style="min-height:80px"></textarea><button class="btn" style="margin-top:8px" data-a="fbSend">' + (CAP.db ? "Send to the team" : "Save note") + '</button><p class="small">' + esc(V.benchMsg) + "</p>";
  var keep = $("#fbNote") ? $("#fbNote").value : "";
  b.innerHTML = h; if (keep) $("#fbNote").value = keep;
}

/* ---------- events ---------- */
document.addEventListener("click", function (ev) {
  var el = ev.target.closest("[data-a]"); if (!el) return;
  var fn = A[el.dataset.a]; if (!fn || el.tagName === "SELECT") return;
  if (el.tagName === "A" || el.dataset.a === "taskBox") { fn(el, ev); return; }
  ev.preventDefault(); fn(el, ev);
});
document.addEventListener("change", function (ev) { if (ev.target.id === "roleSel") A.role(); });
document.addEventListener("keydown", function (ev) {
  if (ev.key === "Enter" && ev.target.id === "nmIn") { ev.preventDefault(); if (addName(ev.target.value)) { render(); var i = $("#nmIn"); if (i) i.focus(); } return; }
  if (ev.key === "Enter" && ev.target.id === "qText") { ev.preventDefault(); A.qNext(); return; }
  if ((ev.key === " " || ev.key === "Enter") && document.activeElement && document.activeElement.id === "hold") { ev.preventDefault(); if (!ev.repeat) holdStart(); }
});
document.addEventListener("keyup", function (ev) { if ((ev.key === " " || ev.key === "Enter") && document.activeElement && document.activeElement.id === "hold") holdEnd(); });
document.addEventListener("pointerdown", function (ev) { if (ev.target.closest("#hold")) { ev.preventDefault(); holdStart(); } });
["pointerup", "pointercancel"].forEach(function (t) { document.addEventListener(t, function () { if (HOLD.t) holdEnd(); }, true); });
document.addEventListener("contextmenu", function (ev) { if (ev.target.closest("#hold")) ev.preventDefault(); });
var tmr;
document.addEventListener("input", function (ev) {
  var el = ev.target;
  if (el.id === "raatDraft") { S.raatDraft = el.value; clearTimeout(tmr); tmr = setTimeout(save, 400); }
  else if (el.id === "draft") { var w = $("#waDraft"); if (w) w.href = "https://wa.me/?text=" + encodeURIComponent(el.value); }
});
document.addEventListener("focusout", function (ev) { var el = ev.target; if ((el.tagName === "INPUT" || el.tagName === "TEXTAREA") && el.id !== "fbNote" && el.id !== "qText" && el.id !== "nmIn" && gateHit(el.value) && !V.gateSeen[el.value]) { V.gateSeen[el.value] = 1; openGate(); } });
window.addEventListener("hashchange", route);

/* ---------- boot ---------- */
function boot() {
  if (S.pin) { V.locked = true; render(); return; }
  var away = S.look.unlocked && S.lastOpen && (nowMs() - S.lastOpen > 7 * 864e5);
  if (away) { V.route = "phirse"; if (location.hash !== "#phirse") location.hash = "phirse"; else render(); return; }
  if (S.look.unlocked) S.lastOpen = nowMs();
  save();
  var h = now().getHours();
  if (S.look.unlocked && h >= 0 && h < 5 && !V.raatShown) { V.raatShown = true; go("raat"); return; }
  route();
}
boot();
