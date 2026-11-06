/* Neev v3 · views, flows, actions, bench, boot */
if (window.claude && typeof window.claude.use === "function") {
  window.claude.use("sample").then(function (s) { CAP.sample = s; renderBench(); }).catch(function () {});
  window.claude.use("db").then(function (d) { CAP.db = d; refreshChorus(); renderBench(); }).catch(function () {});
  window.claude.use("downloads").then(function (d) { CAP.downloads = d; }).catch(function () {});
}

/* =================== routing =================== */
var ROUTES = ["look", "start", "aaj", "map", "rituals", "together", "learn", "raat", "phirse", "knows"];
var LOCKED_UNTIL_L3 = ["aaj", "map", "rituals", "together", "start"];
function go(r) { if (location.hash !== "#" + r) location.hash = r; else route(); }
function route() {
  var h = (location.hash || "").replace("#", "");
  var ep = /^e([1-5])$/.exec(h);
  if (ep) { var n = +ep[1]; S.look.fromEp = n; save(); h = S.look.unlocked ? "aaj" : "look"; if (S.look.unlocked) { var lay = EP_LAYER[n]; if (S.look.done.indexOf(lay) < 0) { startLayer(lay); h = "look"; } } }
  if (/^act-\d+$/.test(h)) { var a = N.acts[+h.split("-")[1] - 1]; if (a && S.look.unlocked) setToday({ text: a.t, n: a.n, job: a.job, person: (S.today && S.today.person) || "" }); h = "aaj"; }
  if (ROUTES.indexOf(h) < 0) h = S.look.unlocked ? "aaj" : "look";
  if (!S.look.unlocked && LOCKED_UNTIL_L3.indexOf(h) >= 0) h = "look";
  if (h === "look" && V.route !== "look") V.paused = false;
  V.route = h; render();
}
var EP_LAYER = { 1: 1, 2: 9, 3: 4, 4: 8, 5: 10 };

/* =================== render =================== */
var ICON = {
  aaj: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3c2 3 3 4.5 3 6.5a3 3 0 0 1-6 0C9 7.5 10 6 12 3z"/><path d="M5 15h14l-2 5H7z"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="2.5"/><circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="10"/></svg>',
  rituals: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 10h14v3a7 7 0 0 1-14 0z"/><path d="M9 6c0-1 1-2 1-3M13 6c0-1 1-2 1-3"/></svg>',
  together: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="9" r="3"/><circle cx="16" cy="9" r="3"/><path d="M3 20c0-3 2.5-5 5-5s5 2 5 5M11 20c0-3 2.5-5 5-5s5 2 5 5"/></svg>',
  learn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 5h7a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H3zM21 5h-7a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h7z"/></svg>'
};
function render() {
  $("#langBtn").textContent = S.lang === "hi" ? "Hinglish" : "English";
  $("#knowsBtn").textContent = T("Aapka data", "Your data");
  $("#gateText").textContent = T("Bahut bhaari lag raha hai?", "Feeling too heavy?");
  var tabs = [["aaj", "Aaj", "Today"], ["map", "Naksha", "Map"], ["rituals", "Reetein", "Rituals"], ["together", "Saath", "Together"], ["learn", "Samjhiye", "Learn"]];
  $("#tabs").innerHTML = tabs.map(function (t) { return '<button class="tab" data-a="go" data-to="' + t[0] + '"' + (V.route === t[0] ? ' aria-current="page"' : "") + ">" + ICON[t[0]] + "<span>" + T(t[1], t[2]) + "</span></button>"; }).join("");
  var ph = $("#phone");
  ph.classList.toggle("night", V.route === "raat");
  ph.classList.toggle("immersive", V.locked || V.route === "look" || V.route === "phirse" || V.route === "start");
  var fn = { look: viewLook, start: viewStart, aaj: viewAaj, map: viewMap, rituals: viewRituals, together: viewTogether, learn: viewLearn, raat: viewRaat, phirse: viewPhirse, knows: viewKnows }[V.route];
  $("#screen").innerHTML = V.locked ? viewLock() : fn();
  $("#screen").scrollTop = 0;
  if (V.route === "together" && V.tog === "pass") drawCard();
  if (V.route === "together" && V.tog === "cell" && S.cell) refreshCell();
  if (V.route === "aaj") refreshChorus();
  var f = $("#screen [data-autofocus]"); if (f && window.innerWidth > 900) { try { f.focus({ preventScroll: true }); } catch (e) {} }
  renderBench();
}

/* =================== the look =================== */
function curLayer() { return LAYERS[S.look.L - 1]; }
function curStep() { return layerSteps(S.look.L)[S.look.s] || { t: "reveal" }; }
function curQ() { var st = curStep(); return st.t === "q" ? curLayer().qs[st.q] : null; }
function startLayer(n) { S.look.L = n; S.look.s = 0; S.look.started = true; S.look.th = 2; save(); }
function lookBar() {
  var Ly = curLayer(), st = curStep();
  var back = (S.look.started && (S.look.s > 0 || S.look.L > 1)) ? '<button class="iconbtn" data-a="lkBack" aria-label="' + T("Peeche", "Back") + '">←</button>' : '<span style="width:44px"></span>';
  var dots = '<div class="chapdots" aria-hidden="true">' + LAYERS.map(function (l) { return '<i class="' + (S.look.done.indexOf(l.n) >= 0 ? "on" : l.n === S.look.L ? "now" : "") + '"></i>'; }).join("") + "</div>";
  var where = S.look.started ? T("Parat ", "Layer ") + Ly.n + " / 10 · " + P(Ly.title) + " · " + T("lagbhag " + Ly.min + " min", "about " + Ly.min + " min") : "Neev";
  return '<div class="lookbar">' + back + (S.look.started ? dots : '<span class="chapdots"></span>') + '<span class="where">' + esc(where) + "</span>" + (!S.look.started ? '<button class="iconbtn" data-a="lang">' + (S.lang === "hi" ? "English" : "Hinglish") + "</button>" : '<button class="iconbtn" data-a="lkPause">' + T("Rukiye", "Pause") + "</button>") + "</div>";
}
function viewLook() {
  if (V.paused) return viewPaused();
  if (!S.look.started) return lookBar() + '<div class="lookbody">' + viewThreshold() + "</div>";
  var st = curStep(), h;
  if (st.t === "open") h = viewOpen(); else if (st.t === "q") h = viewQ(); else h = viewReveal();
  return lookBar() + '<div class="lookbody">' + h + "</div>";
}
function viewThreshold() {
  var ep = S.look.fromEp ? N.episodes[S.look.fromEp - 1] : null;
  if (S.look.th === 0) {
    return '<div class="grow"><p class="beat fadein">' + T("Aaj zinda har insaan ko kabhi kisi ne thaama tha.", "Every person alive was once held by someone.") + '</p><p class="beat small2 fadein2" style="margin-top:20px;color:var(--muted)">' + T("Aaj bhi koi thaame hue hai. Bas woh dikhta nahi.", "Someone is still holding you. It just doesn't show.") + "</p>" + (ep ? '<p class="small fadein3">' + T("Aap Episode " + ep.n + " se aaye hain: \"" + L(ep.q) + "\" Uska kaam aapke liye taiyaar hai.", "You came from Episode " + ep.n + ": \"" + L(ep.q) + "\" Its act is ready for you.") + "</p>" : "") + '</div><div class="lookfoot fadein3"><button class="btn primary block" data-a="thNext" data-autofocus>' + T("Dikhaiye", "Show me") + "</button></div>";
  }
  return '<div class="grow"><p class="beat small2">' + T("Yeh ek nazar hai: aapko kaun thaamta hai, kaise, aur kahan jagah khaali hai.", "This is a look at who holds you, how, and where there's room.") + '</p><ul class="said" style="margin-top:20px"><li>' + T("Das chhoti parten. Pehli teen mein lagbhag 6 minute. Aage jaana aapki marzi.", "Ten short layers. The first three take about 6 minutes. How far you go is up to you.") + "</li><li>" + T("Har parat apne aap mein poori hai. Kahin bhi ruk sakte hain.", "Every layer is complete on its own. Stop anywhere.") + "</li><li>" + T("Therapy nahi, test nahi, koi score nahi. Naam is phone se bahar nahi jaate.", "Not therapy, not a test, no score. Names never leave this phone.") + "</li><li>" + T("'Koi nahi' bhi sachcha jawab hai. Madad ke number hamesha neeche hain.", "'No one' is an honest answer. Help numbers are always at the bottom.") + '</li></ul></div><div class="lookfoot"><button class="btn primary block" data-a="thBegin" data-autofocus>' + T("Shuru kijiye", "Begin") + "</button></div>";
}
function viewOpen() {
  var Ly = curLayer();
  var tender = Ly.tender, soft = S.look.soft;
  var h = '<div class="grow"><p class="eyebrow" style="margin-top:10vh">' + T("Parat ", "Layer ") + Ly.n + " · " + esc(P(Ly.title)) + '</p><p class="beat small2" style="margin-top:10px">' + esc(P(Ly.open)) + "</p>";
  if (soft && tender) h += '<p class="reveal-line" style="color:var(--muted)">' + T("Aaj pehle bhaari pal aaya tha. Yeh hissa kisi aur din ke liye rakhna theek hai.", "Something heavy came up earlier today. It's fine to keep this part for another day.") + "</p>";
  h += '</div><div class="lookfoot">';
  if (tender) h += (soft ? '<button class="btn primary block" data-a="tenderLater">' + T("Kisi aur din", "Another day") + '</button><button class="btn ghost block" data-a="lkNext">' + T("Aaj", "Today") + "</button>" : '<button class="btn primary block" data-a="lkNext">' + T("Aaj", "Today") + '</button><button class="btn ghost block" data-a="tenderLater">' + T("Kisi aur din", "Another day") + "</button>");
  else h += '<button class="btn primary block" data-a="lkNext" data-autofocus>' + T("Aage", "Continue") + "</button>";
  return h + "</div>";
}
function viewQ() {
  var q = curQ(), a = S.look.a[q.id], showMap = S.look.L >= 3;
  var h = '<div class="grow">' + (showMap ? '<div class="minimap" aria-hidden="true">' + mapSVG({ small: true }) + "</div>" : "");
  h += '<h1 class="q" style="font-size:25px;margin-top:' + (showMap ? "4px" : "6vh") + '">' + esc(P(q.q)) + "</h1>";
  if (q.type === "text") {
    h += '<input class="t hand" id="qText" data-autofocus autocomplete="off" style="font-size:21px" placeholder="' + esc(P(q.ph)) + '" value="' + esc(a || "") + '">';
  } else if (q.type === "names") {
    var cur = Array.isArray(a) ? a : [];
    h += '<div class="namebox">' + cur.map(function (n, i) { var k = n.toLowerCase(); return '<span class="namechip">' + esc(n) + ((k in S.groups ? S.groups[k] : GROUP_RE.test(n)) ? ' <span class="tag">' + T("group", "group") + "</span>" : "") + '<button data-a="nmGroup" data-n="' + esc(n) + '" title="' + T("Yeh ek group hai", "This is a group") + '" aria-label="' + T("Group hai", "Mark as a group") + '">⧉</button><button data-a="nmDel" data-i="' + i + '" aria-label="' + T("Hataiye ", "Remove ") + esc(n) + '">×</button></span>'; }).join("") + "</div>";
    if (V.merge) h += '<div class="ask"><p style="margin:0 0 8px">' + T("Kya \"" + esc(V.merge.n) + "\" aur \"" + esc(V.merge.ex) + "\" ek hi insaan hain?", "Is \"" + esc(V.merge.n) + "\" the same person as \"" + esc(V.merge.ex) + "\"?") + '</p><div class="row"><button class="btn" data-a="mergeYes">' + T("Haan, wahi", "Yes, the same") + '</button><button class="btn ghost" data-a="mergeNo">' + T("Nahi, alag", "No, different") + "</button></div></div>";
    h += '<div class="row" style="margin-top:10px"><input class="t hand" id="nmIn" data-autofocus autocomplete="off" style="flex:1;font-size:20px" placeholder="' + T("Pehla naam, ya woh kaun hain", "A first name, or who they are") + '" aria-label="' + T("Naam jodiye", "Add a name") + '"><button class="btn" data-a="nmAdd">' + T("Jodiye", "Add") + "</button></div>";
    var sug = people(true).filter(function (p) { return p.pub.length && (!p.lost || q.tag === "lost"); }).map(function (p) { return p.name; }).filter(function (n) { return cur.map(function (x) { return x.toLowerCase(); }).indexOf(n.toLowerCase()) < 0; });
    if (sug.length && !q.priv) h += '<p class="small" style="margin:12px 0 0">' + T("Pehle aaye naam (wahi insaan ho toh inhe chuniye):", "Names you've written (tap if it's the same person):") + '</p><div class="suggest">' + sug.slice(0, 10).map(function (n) { return '<button class="chip" data-a="nmPick" data-n="' + esc(n) + '">+ ' + esc(n) + "</button>"; }).join("") + "</div>";
    h += '<p class="small" style="margin-top:10px">' + (q.priv ? T("Sirf aapke liye. Naksha, card ya kahin aur nahi dikhega.", "Only for you. Never shown on the map, a card or anywhere else.") : T("⧉ dabaiye agar yeh ek group hai (team, parivaar, dost-mandali).", "Tap ⧉ if it's a group (a team, a family, a gang of friends).")) + "</p>";
  } else {
    var multi = q.type === "multi", sel = multi ? (Array.isArray(a) ? a : []) : a;
    h += '<div class="stack" role="group">' + q.opts.map(function (o) { var on = multi ? sel.indexOf(o[0]) >= 0 : sel === o[0]; return '<button class="opt" data-a="opt" data-v="' + o[0] + '" aria-pressed="' + on + '"><span class="tick"></span>' + esc(S.lang === "hi" ? o[1] : o[2]) + "</button>"; }).join("") + "</div>";
  }
  h += '</div><div class="lookfoot"><button class="btn primary block" data-a="qNext">' + T("Aage", "Continue") + "</button>";
  if (q.type === "names") h += '<button class="btn ghost block" data-a="qNone">' + T("Koi naam nahi aata", "No one comes to mind") + "</button>";
  else h += '<button class="btn ghost block" data-a="qSkip">' + T("Chhodiye", "Skip") + "</button>";
  return h + "</div>";
}
function revealBody(Ln) {
  var a = S.look.a, ps = people(), h = "";
  if (Ln === 1) {
    var f = withTag("first", ps);
    if (f.length) {
      h += '<p class="reveal-line"><span class="hand" style="font-size:24px">' + esc(f[0]) + "</span>. " + T("Thaamna yahin se shuru hota hai: ek naam jo bina bulaye aata hai.", "This is where holding starts: a name that arrives without being asked.") + "</p>";
      h += '<div class="card"><p style="margin:0 0 8px">' + T("Chahein toh abhi ek line bhejiye:", "If you like, send one line now:") + '</p><p class="hand" style="font-size:19px;margin:0 0 10px">' + esc(fill(SHABD.reach, f[0])) + '</p><a class="btn" target="_blank" rel="noopener" data-a="sentLine" href="https://wa.me/?text=' + encodeURIComponent(fill(SHABD.reach, f[0])) + '">' + T("WhatsApp mein kholiye", "Open in WhatsApp") + "</a></div>";
    } else h += '<p class="reveal-line">' + T("Koi naam nahi aaya. Yeh sachcha jawab hai. Agli parat woh haath dikhayegi jo shayad aapne dekhe nahi.", "No name came. That's an honest answer. The next layer shows hands you may not have noticed.") + "</p>";
  } else if (Ln === 2) {
    var seen = withTag("hand", ps);
    h += '<p class="reveal-line"><b>' + T("Jo bhi andaaza tha, asal mein zyada hai.", "Whatever you guessed, it's more.") + "</b> " + T("Kisi ne ugaaya, toda, pack kiya, chalaaya, becha. Darjanon log, aksar sainkdon.", "Someone grew it, picked it, packed it, drove it, sold it. Dozens of people, often hundreds.") + "</p>";
    h += '<p class="reveal-line">' + (seen.length ? T("Aapne in haathon ko dekha: ", "You noticed: ") + '<span class="hand" style="font-size:21px">' + esc(list(seen)) + "</span>. " : T("Aaj kisi ko naam se notice nahi kiya. Zyadatar din koi nahi karta. ", "You didn't notice anyone by name today. Most days nobody does. ")) + T("Phir bhi unhone aapki subah thaami.", "They held your morning anyway.") + "</p>";
    h += '<div class="card"><p style="margin:0">' + T("Neev ka pehla sach: zyadatar ", "Neev's first fact: most ") + term("holding", T("thaamna", "holding")) + T(" dikhta nahi.", " is invisible.") + "</p></div>";
  } else if (Ln === 3) {
    var few = ps.filter(function (p) { return p.ring === "few"; }), solid = few.filter(function (p) { return !p.maybe; }).map(function (p) { return p.name; }), maybe = few.filter(function (p) { return p.maybe; }).map(function (p) { return p.name; }), would = withTag("would", ps).filter(function (n) { return solid.indexOf(n) < 0 && maybe.indexOf(n) < 0; });
    h += '<div class="minimap">' + mapSVG() + "</div>";
    if (solid.length) h += '<p class="reveal-line"><span class="hand" style="font-size:22px">' + esc(list(solid)) + "</span> " + T("ek se zyada sawaal mein aaye. Yeh woh hain jo shayad sach mein aayenge.", vs(solid, "came up in more than one question. This is someone who would likely come.", "came up in more than one question. These are people who would likely come.")) + "</p>";
    if (maybe.length) h += '<p class="reveal-line">' + T("Ek baar aaye: ", "Came up once: ") + '<span class="hand">' + esc(list(maybe)) + "</span>. " + T("Bindu wale 'shayad' hain: aaj yaad aaye, par aur pakka nahi.", "The dotted ones are a 'maybe': they came to mind today, nothing more certain.") + "</p>";
    if (!few.length) h += '<p class="reveal-line">' + T("In sawaalon par abhi koi naam nahi aaya. Yeh sachcha jawab hai, aur jitna lagta hai usse zyada aam.", "No names came for these questions right now. That's an honest answer, and more common than it feels.") + "</p>";
    if (would.length) h += '<p class="reveal-line">' + '<span class="hand">' + esc(list(would)) + "</span>" + T(": ek darwaza jo khula lagta hai, par abhi tak andar nahi gaye.", ": a door that feels open, which you haven't walked through yet.") + "</p>";
    h += '<div class="card"><p style="margin:0">' + T("Neev inhe kehta hai ", "Neev calls them ") + term("few", P(RING.few.name).toLowerCase()) + T(". Yeh naksha woh dikhata hai jo aaj yaad aaya, koi test nahi. ", ". The map shows what came to mind today; it is not a test. ") + term("web", T("Aur jaaniye", "More")) + "</p></div>";
  } else if (Ln === 4) {
    var wk = withTag("weekly", ps), place = a.place, rit = a.ritual;
    h += '<p class="reveal-line">' + T("Aapka ek rhythm pehle se hai. Kisi ne design nahi kiya.", "You already have a rhythm. Nobody designed it.") + '</p><ul class="said">' + (wk.length ? "<li>" + T("Har hafte: ", "Every week: ") + '<span class="hand">' + esc(list(wk)) + "</span></li>" : "") + (place && !isNone(place) ? "<li>" + T("Jahan aapko naam se jaante hain: ", "Known by name at: ") + '<span class="hand">' + esc(place) + "</span></li>" : "<li>" + T("Abhi koi jagah nahi jahan aapko naam se jaante hon. Shahar badalne ya ghar se kaam karne par yeh aam hai.", "No place yet where you're known by name. That's common after a move, or when work is from home.") + "</li>") + "</ul>";
    if (rit && !isNone(rit)) h += '<div class="card"><p style="margin:0">' + T("Aap pehle se ek ", "You already keep a ") + term("vessel", T("paatra", "vessel")) + T(" nibhate hain: ", ": ") + '<span class="hand" style="font-size:19px">' + esc(rit) + "</span>. " + T("Baad mein ise jaan-boojh kar rakh sakte hain.", "Later you can keep it on purpose.") + "</p></div>";
    h += '<p class="reveal-line">' + T("Routine se thaamne wale log aapka ", "The people who hold you through routine are your ") + term("village", P(RING.village.name).toLowerCase()) + T(" hain.", ".") + "</p>";
  } else if (Ln === 5) {
    h += '<div class="minimap">' + mapSVG() + '</div><p class="reveal-line">' + T("Jo aapko banate hain, woh aapka ", "The people who shape you are your ") + term("circle", P(RING.circle.name).toLowerCase()) + T(" hain. Ab dekhiye, aapke jawab pehle se kya dikhate hain: log alag-alag kaam karte hain.", ". Now see what your answers already show: people do different things for you.") + "</p>" + chairsHTML(ps) + '<p class="small">' + T("Khaali kursi kami nahi hai. Woh dikhati hai ki agla haath kahan badh sakta hai. ", "An open chair isn't a failing. It shows where a hand could reach next. ") + term("jobs", T("Paanch kaam", "Five things")) + "</p>";
  } else if (Ln === 6) {
    var hold = uniq(withTag("leans", ps).concat(withTag("carryout", ps), withTag("learned", ps)));
    h += '<div class="minimap">' + mapSVG() + '</div><p class="reveal-line">' + (hold.length ? T("Hare ghere wale aap par tike hain: ", "Circled in green, the people who lean on you: ") + '<span class="hand" style="font-size:21px">' + esc(list(hold)) + "</span>. " + T("Aap bhi kisi ke apne hain.", "You are someone's few too.") : T("Abhi koi naam nahi aaya. Shayad koi aap par tika hai aur aapko pata nahi.", "No names came. Someone may lean on you without you knowing.")) + '</p><div class="card"><p style="margin:0">' + term("both", T("Thaamna dono taraf chalta hai.", "Holding runs both ways.")) + "</p></div>";
  } else if (Ln === 7) {
    var lost = withTag("lost", ps), qt = uniq(withTag("quiet", ps).concat(withTag("mend", ps))).filter(function (n) { return lost.indexOf(n) < 0; });
    if (lost.length) h += '<p class="reveal-line">' + T("Saath chalte hain: ", "Carried with you: ") + '<span class="hand" style="font-size:21px">' + esc(list(lost)) + "</span>. " + T("Woh kisi ghere mein nahi, aapke saath hain. Jo chale gaye, woh bhi aapko banate hain.", "They're not placed in a ring; they go with you. Those who are gone still shape you.") + "</p>";
    if (qt.length) h += '<p class="reveal-line"><span class="hand" style="font-size:21px">' + esc(list(qt)) + "</span> " + T("abhi bhi pahunch mein " + isAre(qt) + ". Dhaaga toota nahi, bas dheela hai.", isAre(qt) + " still within reach. The thread isn't broken, just slack.") + "</p>";
    if (!lost.length && !qt.length) h += '<p class="reveal-line">' + T("Abhi koi naam nahi aaya. Theek hai.", "No names came right now. That's fine.") + "</p>";
    h += '<div class="card"><p style="margin:0">' + term("drift", T("Rishte bhatakte hain", "Ties drift")) + T(" jab koi unhe uthaata nahi. Rakhna ek chunav hai.", " when nobody carries them. Keeping is a choice.") + "</p></div>";
  } else if (Ln === 8) {
    var b = (a.beyond || []).filter(function (x) { return x !== "none"; }), q8 = LAYERS[7].qs;
    var bl = b.map(function (v) { var o = q8[0].opts.filter(function (x) { return x[0] === v; })[0]; return o ? (S.lang === "hi" ? o[1] : o[2]).toLowerCase() : v; });
    var r = (a.reach || []).filter(function (x) { return ["phone", "work", "food", "screen", "sleep"].indexOf(x) >= 0; });
    var rl = r.map(function (v) { var o = q8[1].opts.filter(function (x) { return x[0] === v; })[0]; return o ? (S.lang === "hi" ? o[1] : o[2]).toLowerCase() : v; });
    if (bl.length) h += '<p class="reveal-line">' + T("Yeh bhi aapko thaamte hain: ", "These hold you too: ") + "<b>" + esc(list(bl)) + "</b>. " + T("Thaamna sirf logon se nahi hota.", "Holding doesn't only come from people.") + "</p>";
    if (rl.length) h += '<p class="reveal-line">' + T("Akele mein aap pahunchte hain: ", "When alone, you reach for: ") + "<b>" + esc(list(rl)) + "</b>. " + T("Yeh thodi der thaamte hain, par wapas phone nahi kar sakte. ", "These hold for a while, but can't call you back. ") + term("placeholder", T("Jagah lene wali cheezein", "Placeholders")) + "</p>";
    if ((a.reach || []).indexOf("person") >= 0) h += '<p class="reveal-line">' + T("Aapne 'kisi insaan ko' bhi chuna. Woh sabse mazboot dhaaga hai.", "You also chose 'a person'. That's the strongest thread.") + "</p>";
    h += '<div class="card"><p style="margin:0">' + term("test", T("Ek test", "The one test")) + T(": iske baad main zyada sthir hoon, ya chhota?", ": after this, am I steadier, or smaller?") + "</p></div>";
  } else if (Ln === 9) {
    var gave = withTag("gave", ps), pass = withTag("passon", ps);
    if (a.line && !isNone(a.line)) h += '<p class="reveal-line">' + T("Aap yeh shabd saath le kar chalte hain: ", "You carry these words: ") + '<span class="hand" style="font-size:21px">' + esc(a.line) + "</span>" + (gave.length ? T(", " + list(gave) + " se.", ", from " + list(gave) + ".") : ".") + "</p>";
    h += '<p class="reveal-line">' + (pass.length ? T("Aur aap kuch de rahe hain ", "And you're passing something on to ") + '<span class="hand">' + esc(list(pass)) + "</span>. " + T("Yahi thaamne ki zanjeer hai.", "That is how holding travels.") : T("Jo aapko mila, woh kabhi kisi ko milega. Abhi bhi.", "What you were given will reach someone through you, even now.")) + "</p>";
  } else {
    var kp = a.kplace, kps = withTag("keeper", ps);
    h += '<p class="reveal-line">' + (kp && !isNone(kp) ? '<span class="hand" style="font-size:21px">' + esc(kp) + "</span> " + (kps.length ? T("ko abhi " + list(kps) + " rakhte hain.", "is kept now by " + list(kps) + ".") : T("ko koi na koi rakhta hai, chahe dikhe na.", "is kept by someone, even if it doesn't show.")) : T("Har jagah ko koi rakhta hai: ek gate, ek group, ek gali.", "Every place is kept by someone: a gate, a group, a street.")) + "</p>";
    h += '<p class="reveal-line">' + T("Logon ko thaamna ek hissa hai. Jagah ko rakhna, taaki bahut log thaame ja sakein, agla hissa hai.", "Holding people is one part. Keeping a place, so many people can be held, is the next.") + "</p>";
    if (a.kwish === "yes" || a.kwish === "maybe") h += '<div class="card"><p style="margin:0 0 8px">' + T("Shuruaat ke liye: 'Swagat' aur 'Vidaai' ki reetein, ya ek Cell.", "To begin: the Welcome and Farewell rituals, or a Cell.") + '</p><div class="row"><button class="btn" data-a="go" data-to="rituals">' + T("Reetein", "Rituals") + '</button><button class="btn" data-a="goTog" data-t="cell">Cell</button></div></div>';
  }
  return h;
}
function viewReveal() {
  var Ly = curLayer(), next = LAYERS[Ly.n], h = '<div class="grow"><p class="eyebrow" style="margin-top:8px">' + T("Aapne jo dikhaya", "What you showed") + "</p>" + revealBody(Ly.n) + "</div>";
  h += '<div class="lookfoot"><p class="small" style="margin:0 0 4px">' + T("Parat " + Ly.n + " poori. Yahin rukna bhi ek poora ant hai.", "Layer " + Ly.n + " is complete. Stopping here is a whole ending too.") + "</p>";
  if (Ly.n === 3 && !S.look.unlocked) h += '<button class="btn primary block" data-a="layerDone" data-next="start">' + T("Aapka naksha taiyaar hai. Kahan se shuru karein?", "Your map is ready. Where would you like to start?") + "</button>";
  else if (next) h += '<button class="btn primary block" data-a="layerDone" data-next="layer">' + T("Agli parat: ", "Next layer: ") + esc(P(next.title)) + " · " + T(next.min + " min", next.min + " min") + '</button><button class="btn ghost block" data-a="layerDone" data-next="stop">' + T("Yahin rukiye", "Stop here") + "</button>";
  else h += '<button class="btn primary block" data-a="layerDone" data-next="stop">' + T("Poora naksha dekhiye", "See your whole map") + "</button>";
  return h + "</div>";
}
function viewPaused() {
  return '<div class="lookbar"><span style="width:44px"></span><span class="where">' + T("Ruke hue", "Paused") + '</span></div><div class="lookbody"><div class="grow"><p class="beat small2">' + T("Aap parat " + S.look.L + " par ruke hain. Jawab is phone par hain.", "You paused at layer " + S.look.L + ". Your answers are kept on this phone.") + '</p><div class="minimap" style="max-width:220px">' + mapSVG({ small: true }) + '</div></div><div class="lookfoot"><button class="btn primary block" data-a="lkResume">' + T("Aage dekhiye", "Continue the look") + "</button>" + (S.look.unlocked ? '<button class="btn ghost block" data-a="go" data-to="aaj">' + T("App par jaaiye", "Go to the app") + "</button>" : '<button class="btn ghost block" data-a="go" data-to="learn">' + T("Pehle samjhiye ki yeh kya hai", "First, read what this is about") + "</button>") + '<button class="btn ghost block" data-a="go" data-to="knows">' + T("Aapka data", "Your data") + "</button></div></div>";
}
function chairsHTML(ps) {
  return '<div class="chairs">' + chairs(ps).map(function (c) { return '<div class="chair' + (c.names.length ? "" : " open") + '"><span class="j">' + esc(P(c.job.name)) + '</span><span><span class="n">' + (c.names.length ? esc(list(c.names.slice(0, 3))) : T("khaali kursi", "open chair")) + '</span><br><span class="small">' + esc(P(c.job.what)) + "</span></span></div>"; }).join("") + "</div>";
}

/* =================== start: choice and promise =================== */
function startOptions() {
  var ps = people(), o = [], ep = S.look.fromEp ? N.episodes[S.look.fromEp - 1] : null;
  var one = oneToOne(ps), solidFew = one.filter(function (p) { return p.ring === "few" && !p.maybe; }), anyFew = one.filter(function (p) { return p.ring === "few"; });
  var quiet = uniq(withTag("quiet", ps).concat(withTag("mend", ps), withTag("would", ps))).filter(function (n) { return one.some(function (p) { return p.name === n; }); });
  var open = chairs(ps).filter(function (c) { return !c.names.length; });
  var hands = withTag("hand", ps).filter(function (n) { return !S.groups[n.toLowerCase()]; }), lean = uniq(withTag("leans", ps).concat(withTag("carryout", ps))).filter(function (n) { return one.some(function (p) { return p.name === n; }); });
  var first = withTag("first", ps).filter(function (n) { return one.some(function (p) { return p.name === n; }); });
  if (ep) o.push({ k: "ep", person: first[0] || "", job: "drift", label: T("Episode " + ep.n + " ka kaam", "Episode " + ep.n + "'s act"), act: L(ep.act), why: L(ep.q) });
  if (quiet.length) { var qIsWould = withTag("would", ps).indexOf(quiet[0]) >= 0 && withTag("quiet", ps).indexOf(quiet[0]) < 0 && withTag("mend", ps).indexOf(quiet[0]) < 0; o.push({ k: "quiet", person: quiet[0], job: "drift", label: qIsWould ? T("Jise phone karna chahte the: " + quiet[0], "Someone you've meant to call: " + quiet[0]) : T("Ek chup rishta: " + quiet[0], "A quiet tie: " + quiet[0]), act: T("Bhejiye: ", "Send: ") + fill(SHABD.reach, quiet[0]), why: qIsWould ? T("Darwaza khula hai; bas andar jaana hai.", "The door is open; you only have to walk in.") : T("Dhaaga dheela hai, toota nahi.", "The thread is slack, not broken.") }); }
  var f0 = solidFew[0] || anyFew[0];
  if (f0) o.push({ k: "few", person: f0.name, job: f0.jobs[0] || "settle", label: f0.maybe ? T("Jo aaj yaad aaye: " + f0.name, "Someone who came to mind: " + f0.name) : T("Apnon mein se: " + f0.name, "One of your few: " + f0.name), act: T(f0.name + " ko teen minute ka phone. Bas 'yaad aaya'.", "Call " + f0.name + " for three minutes. Just 'I thought of you.'"), why: T("Jo kareeb hain, unhe bhi uthaana padta hai.", "Even the closest ties need carrying.") });
  if (lean.length) o.push({ k: "lean", person: lean[0], job: "carry", label: T("Jo aap par tike hain: " + lean[0], "Someone who leans on you: " + lean[0]), act: T(lean[0] + " se poochhiye: 'Is hafte main kya utha sakta hoon?'", "Ask " + lean[0] + ": 'What could I take off your plate this week?'"), why: T("Thaamna dono taraf chalta hai.", "Holding runs both ways.") });
  if (hands.length) o.push({ k: "hand", person: hands[0], job: "belong", label: T("Ek haath jo aapne dekha: " + hands[0], "A hand you noticed: " + hands[0]), act: T(hands[0] + " ko naam se shukriya kahiye. Naam nahi pata, toh poochhiye.", "Thank " + hands[0] + " by name. If you don't know their name, ask it."), why: T("Gaon naam se banta hai.", "A village is made of names.") });
  if (open.length && one.length) { var j = open[0].job, act = pool(j.id)[hash32(dstr() + j.id) % pool(j.id).length]; o.push({ k: "chair", person: "", job: j.id, label: T("Khaali kursi: " + P(j.name), "An open chair: " + P(j.name)), act: act.t, n: act.n, why: T("Kisi naye ki taraf ek chhota haath.", "One small reach toward someone new.") }); }
  if (!one.length) {
    o.push({ k: "thank", person: "", job: "belong", label: T("Ek haath ko shukriya", "Thank one hand"), act: T("Aaj jo bhi aapki madad kare, guard, driver, dukaan wale, unka naam poochhiye aur shukriya kahiye.", "Today, ask the name of someone who helps your day run, a guard, a driver, a shopkeeper, and thank them by it."), why: T("Zyadatar thaamna yahin se shuru hota hai.", "Most holding starts right here.") });
    o.push({ k: "name", person: "", job: "drift", label: T("Ek naam, bas", "One name, that's all"), act: T("Aaj ek naam likhiye jo yaad aaye, purana ya naya.", "Write down one name that comes to mind today, old or new."), why: T("Shuruaat itni hi chhoti hoti hai.", "That's how small a start is.") });
  }
  return o;
}
function viewStart() {
  if (V.stage === "promise") return viewPromise();
  var o = startOptions(), sel = S.start ? S.start.k : o[0].k;
  var h = '<div class="lookbar"><span style="width:44px"></span><span class="where">' + T("Shuruaat", "Where to start") + '</span></div><div class="lookbody"><div class="grow"><div class="minimap" style="max-width:220px">' + mapSVG({ small: true }) + '</div><h1 class="q" style="font-size:25px">' + T("Aapke naksha mein kuch jagah bhari hain, kuch khaali. Kahan se shuru karein?", "Some places on your map are full, some open. Where would you like to start?") + '</h1><p class="small">' + T("Salah: ", "A suggestion: ") + "<b>" + esc(o[0].label) + "</b>. " + T("Chunav aapka.", "Your call.") + '</p><div class="stack">' + o.map(function (x) { return '<button class="opt" data-a="pickStart" data-k="' + x.k + '" aria-pressed="' + (x.k === sel) + '"><span class="tick"></span><span><b>' + esc(x.label) + '</b><br><span class="small">' + esc(x.why) + "</span></span></button>"; }).join("") + '</div></div><div class="lookfoot"><button class="btn primary block" data-a="choiceGo">' + T("Yahan se", "Start here") + '</button><button class="btn ghost block" data-a="notToday">' + T("Abhi nahi. Pehle naksha dekhna hai.", "Not yet. I'd like to sit with my map.") + "</button></div></div>";
  return h;
}
function viewPromise() {
  var x = S.start || startOptions()[0];
  return '<div class="lookbar"><button class="iconbtn" data-a="backChoice">←</button><span class="where">' + T("Ek kaam", "One act") + '</span></div><div class="lookbody"><div class="grow"><div class="act"><p class="act-text">' + esc(x.act) + '</p><label class="f">' + T("Kab?", "When?") + '</label><div class="chiprow" id="whens">' + [["today", "Aaj", "Today"], ["morning", "Kal subah", "Tomorrow morning"], ["weekend", "Is weekend", "This weekend"]].map(function (w) { return '<button class="chip' + (x.when === w[0] ? " on" : "") + '" data-a="when" data-w="' + w[0] + '">' + T(w[1], w[2]) + "</button>"; }).join("") + '</div><label class="f" for="jabIn">' + T("Kis pal ke baad? (chahein toh)", "Right after what? (optional)") + '</label><input class="t" id="jabIn" placeholder="' + T("pehli chai ke baad", "after my first coffee") + '"><p class="small" style="margin-top:10px">' + T("Research batata hai ki 'kab aur kis pal ke baad' likh dene se kaam hone ke chances kaafi badhte hain.", "Research on 'when-then' plans shows that writing down when, and right after what, makes follow-through much more likely.") + "</p>" + holdHTML() + '</div></div><div class="lookfoot"><button class="btn ghost block" data-a="notToday">' + T("Aaj nahi. Seedha app par.", "Not today. Take me to the app.") + "</button></div></div>";
}
function holdHTML() { return '<div class="hold-wrap"><button class="hold" id="hold" aria-label="' + T("Daba ke rakhiye: vaada", "Press and hold to promise") + '"><svg viewBox="0 0 112 112"><circle cx="56" cy="56" r="52" fill="none" stroke="var(--line)" stroke-width="4"/><circle id="ring" cx="56" cy="56" r="52" fill="none" stroke="var(--amber)" stroke-width="4" stroke-linecap="round" stroke-dasharray="326.7" stroke-dashoffset="326.7" transform="rotate(-90 56 56)"/></svg><span class="diya">' + diyaSVG(44) + '</span></button><span class="hold-label" id="holdLabel">' + T("Diya daba ke rakhiye: khud se ek chhota vaada.", "Press and hold the diya: a small promise to yourself.") + '</span><button class="btn ghost" data-a="twoTap" id="twoTap" style="min-height:40px">' + T("Ya do baar tap kijiye", "Or tap twice") + "</button></div>"; }
function diyaSVG(size) { return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 6c3 4.5 4.5 6.8 4.5 9.6a4.5 4.5 0 0 1-9 0C15.5 12.8 17 10.5 20 6z" fill="var(--amber)"/><path d="M7 23h26c-1.4 6-6 9-13 9S8.4 29 7 23z" fill="none" stroke="var(--ink)" stroke-width="2"/></svg>'; }

/* =================== today =================== */
function setToday(o) { S.today = { date: dstr(), person: o.person || "", job: o.job || "drift", n: o.n || 0, text: o.text, promised: !!o.promised, done: false, skipped: false, src: "t0", swaps: 0, when: o.when || "" }; save(); }
function ensureToday() {
  if (S.today && S.today.date === dstr()) return;
  var all = oneToOne(), d = dstr(), near = all.filter(function (p) { return p.ring !== "village"; }), ps = near.length ? near : all;
  if (!ps.length) { setToday({ text: T("Aaj ek haath ko naam se shukriya kahiye.", "Today, thank one hand by name."), job: "belong" }); return; }
  var p = ps[hash32(d) % ps.length], job = p.jobs[0] || (p.ring === "village" ? "belong" : "drift");
  var cands = pool(job).filter(function (x) { return !/let go|release|end (a|one|the)|walk away|step back/i.test(x.t); });
  var a = TIER0.chunna({ candidates: cands.length ? cands : pool(job), seed: d + p.name });
  setToday({ person: p.name, job: job, n: a.n, text: a.act });
}
function nudges() {
  var out = [], ps = people(), d = now(), wk = weekKey();
  if (!S.checkins[wk] && d.getDay() === +S.rhythmDay || (!S.checkins[wk] && d.getDay() > +S.rhythmDay && +S.rhythmDay !== 0)) out.push({ k: "checkin:" + wk, kind: "checkin", title: T("Aapka hafte ka ek minute", "Your weekly minute"), why: T("Aapne apna din chuna: " + (S.lang === "hi" ? DAYS_HI : DAYS_EN)[+S.rhythmDay] + ".", "You chose " + DAYS_EN[+S.rhythmDay] + " for your rhythm."), act: "checkin" });
  ps.filter(function (p) { return p.keepClose && !p.lost; }).forEach(function (p) {
    var last = lastTouch(p.name), since = S.keep[p.key] || dstr(), days = Math.floor((nowMs() - Date.parse(last || since)) / 864e5);
    if (days >= 42) out.push({ k: "quiet:" + p.key + ":" + wk, kind: "quiet", title: T(p.name + " ko kaafi din ho gaye. Ek line?", "It's been a while since " + p.name + ". One line?"), why: T("Aapne " + p.name + " ko 'kareeb rakhiye' chuna; " + Math.floor(days / 7) + " hafte ho gaye.", "You marked " + p.name + " 'keep close'; it's been " + Math.floor(days / 7) + " weeks."), act: "line", person: p.name });
  });
  if (d.getDate() <= 3) out.push({ k: "month:" + d.getFullYear() + "-" + d.getMonth(), kind: "fresh", title: T("Naya mahina. Ek reet se shuru karein?", "A new month. Begin with one ritual?"), why: T("Naye mahine achhi shuruaat hote hain.", "New months make good starting points."), act: "rituals" });
  var md = dstr().slice(5), tm = dstr(new Date(nowMs() + 864e5)).slice(5);
  S.dates.forEach(function (x) { var xm = x.date.slice(5); if (xm === md || xm === tm) out.push({ k: "date:" + x.date + ":" + d.getFullYear(), kind: "date", title: (xm === md ? T("Aaj: ", "Today: ") : T("Kal: ", "Tomorrow: ")) + x.label, why: T("Yeh tareekh aapne rakhi thi.", "You saved this date."), act: "rituals" }); });
  for (var n = 1; n <= 5; n++) { var r = N.releases[n]; if (r && r <= dstr() && (nowMs() - Date.parse(r)) < 7 * 864e5) out.push({ k: "ep:" + n, kind: "episode", title: T("Episode " + n + ": ", "Episode " + n + ": ") + L(N.episodes[n - 1].q), why: T("Naya episode aaya hai; ek parat khulti hai.", "A new episode is out; it opens one layer."), act: "ep", ep: n }); }
  if (S.snap && (nowMs() - S.snap.date) > 90 * 864e5) out.push({ k: "relook:" + weekKey(), kind: "relook", title: T("Aapka naksha teen mahine purana hai. Phir se dekhein?", "Your map is three months old. Look again?"), why: T("Mausam badalte hain; naksha bhi.", "Seasons change; maps do too."), act: "relook" });
  return out.filter(function (x) { return !S.nudgeOff[x.kind] && !S.nudgeSeen[x.k]; }).slice(0, 2);
}
function lastTouch(name) {
  var t = null;
  S.done.forEach(function (x) { if (x.person === name && (!t || x.date > t)) t = x.date; });
  Object.keys(S.checkins).forEach(function (w) { var c = S.checkins[w]; if ((c.hold || []).concat(c.held || []).indexOf(name) >= 0 && (!t || w > t)) t = w; });
  return t;
}
function actCard() {
  var a = S.today, job = JOBS.filter(function (j) { return j.id === a.job; })[0];
  var h = '<div class="act"><div class="chiprow"><span class="eyebrow">' + esc(job ? P(job.name) : T("Rakhna", "Keeping")) + "</span>" + (a.person ? '<span class="small">·</span><button class="chip" data-a="pickPerson">' + T("Kiske liye: ", "For: ") + '<span class="who">' + esc(a.person) + "</span></button>" : "") + '</div><p class="act-text">' + esc(a.text) + "</p>";
  if (a.when) h += '<p class="small" style="margin:-4px 0 10px">' + T("Aapne kaha: ", "You said: ") + esc({ today: T("aaj", "today"), morning: T("kal subah", "tomorrow morning"), weekend: T("is weekend", "this weekend") }[a.when] || a.when) + "</p>";
  h += '<div class="chiprow">' + srcChip({ _tier: a.src, _fell: a.fell }) + (!a.promised ? '<button class="chip" data-a="swap">' + T("Doosra kaam", "Another act") + "</button>" : "") + (S.lang === "hi" ? '<button class="chip" data-a="hindi">हिंदी में</button>' : "") + "</div>";
  if (a.hindi) h += '<p class="act-text" lang="hi" style="font-size:20px;margin-top:12px">' + esc(a.hindi) + "</p>";
  if (!a.promised && !a.done) h += holdHTML();
  return h + "</div>";
}
function viewAaj() {
  ensureToday();
  var a = S.today, ps = people(), wk = weekKey();
  var h = '<p class="eyebrow">' + T("Aaj", "Today") + " · " + now().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" }) + "</p>";
  nudges().forEach(function (n) { h += '<div class="nudge" role="note"><b>' + esc(n.title) + '</b><button class="iconbtn" data-a="nudgeX" data-k="' + esc(n.k) + '" aria-label="' + T("Hataiye", "Dismiss") + '">×</button><span class="why">' + T("Kyun: ", "Why: ") + esc(n.why) + ' <button class="linkbtn" data-a="nudgeOff" data-kind="' + n.kind + '">' + T("aisa band kijiye", "turn these off") + '</button></span><div class="row"><button class="btn" data-a="nudgeGo" data-act="' + n.act + '" data-p="' + esc(n.person || "") + '" data-ep="' + (n.ep || "") + '" data-k="' + esc(n.k) + '">' + T("Kholiye", "Open") + "</button></div></div>"; });
  if (!S.plan.p1) h += '<div class="nudge"><b>' + T("Mushkil din ke liye ek yojana", "A plan for hard days") + '</b><span></span><span class="why">' + T("Shaant din par likhi jaati hai: kisko phone karna hai, aur kya kehna hai.", "Written on a calm day: who to call, and what to say.") + '</span><div class="row"><button class="btn" data-a="planEdit">' + T("Likhiye (2 min)", "Write it (2 min)") + "</button></div></div>";
  h += actCard();
  if (a.promised && !a.done && !a.skipped) h += '<div class="stack" style="margin-top:14px"><button class="btn primary block" data-a="done">' + T("Ho gaya", "Done") + '</button><div class="row"><button class="btn" data-a="shabd">' + T("Kehne mein madad", "Help me say it") + '</button><button class="btn ghost" data-a="skip">' + T("Aaj nahi", "Not today") + "</button></div></div>";
  if (a.done) h += '<div class="witness"><p style="font-size:19px">' + (a.person ? T("Aap " + esc(a.person) + " tak pahunche.", "You reached " + esc(a.person) + ".") : T("Aapne kar diya.", "You did it.")) + '</p><p class="small" id="chorus"></p></div>';
  if (a.skipped) h += '<div class="witness" style="border-color:var(--line)"><p>' + T("Koi baat nahi. Kal phir.", "That's fine. Tomorrow again.") + "</p></div>";
  if (!S.checkins[wk]) h += checkinCard();
  else h += '<div class="card"><p class="small" style="margin:0">' + T("Is hafte ka minute ho gaya. Shukriya.", "This week's minute is done.") + "</p></div>";
  h += '<div class="row" style="margin-top:12px"><button class="btn ghost" data-a="shaky">' + T("Mann bhaari hai", "I'm feeling shaky") + '</button><button class="btn ghost" data-a="go" data-to="map">' + T("Mera naksha", "My map") + "</button></div>";
  var nextL = LAYERS.filter(function (l) { return S.look.done.indexOf(l.n) < 0; })[0];
  if (nextL) h += '<div class="card"><p class="layerpill">' + T("Agli parat", "Next layer") + " · " + nextL.n + '/10</p><p style="margin:4px 0 8px"><b>' + esc(P(nextL.title)) + "</b> · " + T(nextL.min + " min", "about " + nextL.min + " min") + '</p><button class="btn" data-a="openLayer" data-n="' + nextL.n + '">' + T("Gehra dekhiye", "Go deeper") + "</button></div>";
  return h;
}
function checkinCard() {
  var ps = living().filter(function (p) { return !p.group; }).slice(0, 12), c = V.ci || { held: [], hold: [] };
  function chips(kind) { return ps.map(function (p) { return '<button class="chip' + (c[kind].indexOf(p.name) >= 0 ? " on" : "") + '" data-a="ciTog" data-kind="' + kind + '" data-n="' + esc(p.name) + '">' + esc(p.name) + "</button>"; }).join(""); }
  return '<div class="card"><p class="layerpill">' + T("Hafte ka ek minute", "The weekly minute") + '</p><p style="margin:6px 0 6px"><b>' + T("Is hafte kisne aapko thaama?", "Who held you this week?") + '</b></p><div class="chiprow">' + chips("held") + '</div><input class="t" id="ciWhat" style="margin-top:8px" placeholder="' + T("Kya kiya? (chahein toh)", "What did they do? (optional)") + '"><p style="margin:12px 0 6px"><b>' + T("Aapne kisko thaama?", "Who did you hold?") + '</b></p><div class="chiprow">' + chips("hold") + '</div><button class="btn" style="margin-top:10px" data-a="ciSave">' + T("Rakhiye", "Keep it") + "</button></div>";
}

/* =================== map: three views =================== */
function viewMap() {
  var ps = people(), first = S.snap ? people(false, S.snap.a) : null;
  var h = '<p class="eyebrow">' + T("Naksha", "Map") + '</p><h1 class="q" style="font-size:25px">' + T("Aapka thaamne ka jaal", "Your web of holding") + "</h1>";
  h += '<div class="seg">' + [["web", "Jaal", "Web"], ["kept", "Jinhone rakha", "Kept by"], ["around", "Aas-paas", "Around me"]].map(function (s) { return '<button data-a="mapTab" data-t="' + s[0] + '" aria-pressed="' + (V.tab === s[0]) + '">' + T(s[1], s[2]) + "</button>"; }).join("") + "</div>";
  if (V.tab === "kept") return h + viewKept();
  if (V.tab === "around") return h + viewAround();
  if (first) h += '<div class="seg"><button data-a="mapView" data-v="now" aria-pressed="' + (V.mapView === "now") + '">' + T("Aaj", "Now") + '</button><button data-a="mapView" data-v="first" aria-pressed="' + (V.mapView === "first") + '">' + T("Pehli nazar", "First look") + " · " + new Date(S.snap.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) + "</button></div>";
  h += '<div class="card" style="padding:6px">' + mapSVG({ ps: V.mapView === "first" && first ? first : ps }) + "</div>" + legend();
  h += '<p class="small">' + T("Yeh woh hai jo aapko yaad aaya. Kisi naam ko chhoo kar badaliye: ghera, group, 'kareeb rakhiye', ya tareekh. ", "This is what came to mind. Tap a name to change it: ring, group, 'keep close', or a date to remember. ") + term("web", T("Yeh kya hai?", "What is this?")) + "</p>";
  h += '<div class="chiprow">' + ps.map(function (p) { return '<button class="chip' + (p.keepClose ? " on" : "") + '" data-a="person" data-k="' + esc(p.key) + '">' + esc(p.name) + (p.lost ? " ·" + T("saath", "carried") : "") + "</button>"; }).join("") + "</div>";
  h += '<div class="row" style="margin-top:12px"><input class="t hand" id="addName" style="flex:1" placeholder="' + T("Naya naam", "Add a name") + '"><button class="btn" data-a="addName">' + T("Jodiye", "Add") + "</button></div>";
  if (first) h += changeCard(first, ps);
  h += '<h2 class="h2">' + term("jobs", T("Paanch kaam", "Five things people do")) + "</h2>" + chairsHTML(ps);
  h += '<div class="card"><div class="chiprow" style="justify-content:space-between"><b>' + T("Apna naksha padh ke suniye", "Hear your map read back") + '</b><button class="chip" data-a="aaina">' + T("Suniye", "Read it") + '</button></div><div id="aainaOut"></div></div>';
  h += '<h2 class="h2">' + T("Das parten", "The ten layers") + '</h2><ul class="layers">' + LAYERS.map(function (l) { var d = S.look.done.indexOf(l.n) >= 0; return '<li class="' + (d ? "done" : "") + '"><span><span class="layerpill">' + l.n + "</span> " + esc(P(l.title)) + '</span><button class="chip" data-a="openLayer" data-n="' + l.n + '">' + (d ? T("phir se", "again") : T(l.min + " min", l.min + " min")) + "</button></li>"; }).join("") + "</ul>";
  return h;
}
function changeCard(first, ps) {
  var fn = first.map(function (p) { return p.name; }), nn = ps.map(function (p) { return p.name; });
  var added = nn.filter(function (n) { return fn.indexOf(n) < 0; });
  var moved = ps.filter(function (p) { var f = first.filter(function (x) { return x.name === p.name; })[0]; return f && f.ring !== p.ring; }).map(function (p) { return p.name; });
  var fc = chairs(first).filter(function (c) { return c.names.length; }).length, nc = chairs(ps).filter(function (c) { return c.names.length; }).length;
  var lines = [];
  if (added.length) lines.push(T("Naye naam: ", "New on your map: ") + list(added));
  if (moved.length) lines.push(T("Ghera badla: ", "Moved ring: ") + list(moved));
  if (nc !== fc) lines.push(T("Bhari kursiyan: " + fc + " se " + nc, "Chairs with a name: " + fc + " then, " + nc + " now"));
  if (!lines.length) return "";
  return '<div class="card"><p class="layerpill">' + T("Pehli nazar se ab tak", "Since your first look") + '</p><ul class="said">' + lines.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + '</ul><p class="small" style="margin:0">' + T("Koi score nahi; bas jo badla.", "No score; only what changed.") + "</p></div>";
}
function viewKept() {
  var h = '<p class="lead">' + term("kept", T("Jinhone rakha", "Kept by")) + T(": chhoti cheezein jo kisi ne aapke liye kin. Sirf aapke liye.", ": small things someone did for you. Only for you.") + "</p>";
  h += '<div class="card"><label class="f" for="kWho" style="margin-top:0">' + T("Kisne?", "Who?") + '</label><input class="t hand" id="kWho" list="kList"><datalist id="kList">' + living().map(function (p) { return "<option>" + esc(p.name) + "</option>"; }).join("") + '</datalist><label class="f" for="kWhat">' + T("Kya kiya?", "What did they do?") + '</label><input class="t" id="kWhat" placeholder="' + T("bina kahe khaana le aayi", "brought food without being asked") + '"><button class="btn" style="margin-top:10px" data-a="keptAdd">' + T("Rakhiye", "Keep it") + "</button></div>";
  if (S.kept.length) h += '<ul class="kept">' + S.kept.slice().reverse().map(function (k, i) { return '<li><span class="hand" style="font-size:18px">' + esc(k.who) + "</span> · " + esc(k.what || T("thaama", "held me")) + '<br><span class="small">' + esc(k.date) + (k.src === "card" ? " · " + T("unka card", "their card") : "") + (k.src === "checkin" ? " · " + T("hafte ka minute", "weekly minute") : "") + "</span></li>"; }).join("") + "</ul>";
  else h += '<p class="small">' + T("Abhi kuch nahi. Is hafte ek cheez likhiye.", "Nothing yet. Note one thing this week.") + "</p>";
  if (S.kept.length) { var who = S.kept[S.kept.length - 1].who; h += '<div class="nudge"><b>' + T(who + " ko bataiye?", "Tell " + who + "?") + '</b><span></span><span class="why">' + T("Jab hum batate hain ki kisi ne kaise thaama, woh bhi dikhta hai.", "Telling someone how they held you lets them be seen too.") + '</span><div class="row"><button class="btn" data-a="fewCard" data-n="' + esc(who) + '">' + T("Card banaiye", "Make a card") + "</button></div></div>"; }
  return h;
}
function viewAround() {
  var vill = living().filter(function (p) { return p.ring === "village"; }), a = S.look.a;
  var h = '<p class="lead">' + T("Aapka gaon: woh chehre aur jagah jo roz aapko thaamte hain.", "Your village: the faces and places that hold you every day.") + "</p>";
  if (a.place && !isNone(a.place)) h += '<div class="card"><p class="layerpill">' + T("Jahan aapko jaante hain", "Where you're known") + '</p><p class="hand" style="font-size:19px;margin:4px 0 0">' + esc(a.place) + "</p></div>";
  h += '<div class="card"><p class="layerpill">' + T("Gaon ki sair", "The village walk") + '</p><p style="margin:6px 0">' + T("Is hafte apne raste par ek naam seekhiye, aur agli baar use bolkar bulaiye.", "Learn one name on your route this week, and use it next time.") + '</p><div class="row"><input class="t hand" id="wName" style="flex:1" placeholder="' + T("Naam", "Name") + '"><input class="t" id="wWhere" style="flex:1" placeholder="' + T("Kahan", "Where") + '"></div><button class="btn" style="margin-top:8px" data-a="walkAdd">' + T("Seekh liya", "Learned it") + "</button></div>";
  h += vill.length ? '<ul class="kept">' + vill.map(function (p) { var w = S.walk.filter(function (x) { return x.name === p.name; })[0]; return '<li><span class="hand" style="font-size:18px">' + esc(p.name) + "</span>" + (p.group ? ' <span class="tag">group</span>' : "") + (w && w.where ? ' <span class="small">· ' + esc(w.where) + "</span>" : "") + "</li>"; }).join("") + "</ul>" : '<p class="small">' + T("Abhi gaon mein koi naam nahi. Pehla naam is hafte.", "No names in your village yet. The first one this week.") + "</p>";
  return h;
}

/* =================== rituals (vessels) =================== */
var CATALOGUE = [
  ["line", "Ek line", "The one line", "pair", "word", "Kabhi bhi: 'Bas yaad aaya. Kaise ho?'", "Any time: send 'I just thought of you.'"],
  ["few", "Tum mere apne ho", "You're in my few", "pair", "word", "Ek baar har insaan ko: bataiye ki woh aapko kaise thaamte hain.", "Once per person: tell them how they hold you."],
  ["chairs", "Do kursiyan", "Two Chairs", "couple", "time", "Mahine mein ek baar: ek tareeka jisse doosra thaamta hai, ek jisse aap thaame jaana chahte hain.", "Monthly: one way the other holds you, one way you'd like to be held."],
  ["round", "Ghar ka chakkar", "The round", "household", "time", "Hafte mein ek baar khaane par: kisne thaama, kisko thaama, aur ghar ke bahar ek kaam.", "Weekly at a meal: who held you, whom you held, and one act for someone outside the home."],
  ["walk", "Gaon ki sair", "The village walk", "one", "place", "Hafte mein ek naam seekhiye apne raste par.", "Learn one name on your route each week."],
  ["thanks", "Haathon ka shukriya", "Thank the hands", "one", "gesture", "Hafte mein ek baar kisi ko naam se shukriya.", "Weekly: thank one person by name."],
  ["welcome", "Swagat", "Welcome", "place", "gesture", "Koi naya aaye: ek dastak, ek dish, teen naam jinse madad maangi ja sake.", "When someone arrives: a knock, a dish, and three names to ask for help."],
  ["farewell", "Vidaai", "Farewell", "place", "word", "Koi jaaye: bataiye unhone is jagah ke liye kya rakha.", "When someone leaves: say what they kept for the place."],
  ["carried", "Saath chalte hain", "Carried with you", "one", "time", "Barsi par: jo woh aaj bhi dete hain, uska naam lijiye; ek kaam jo woh karte.", "On an anniversary: name what they still give you; do one thing they would have done."],
  ["mend", "Jodna", "Mend", "pair", "word", "Ek vaakya mein apna hissa maaniye, baat maangiye, waqt tay kijiye.", "Own your part in one sentence, ask to talk, set a time."],
  ["look", "Phir se dekhna", "Look again", "one", "time", "Har mausam: parten jo aap chahein, phir se.", "Each season: re-run the layers you choose."]
];
var FORMS = [["time", "Waqt", "Time"], ["place", "Jagah", "Place"], ["object", "Cheez", "Object"], ["word", "Shabd", "Word"], ["gesture", "Ishaara", "Gesture"]];
function viewRituals() {
  var h = '<p class="eyebrow">' + T("Reetein", "Rituals") + '</p><h1 class="q" style="font-size:25px">' + term("vessel", T("Paatra", "Vessels")) + T(": jo thaamna logon ke beech le jaate hain", ": the forms that carry holding between people") + "</h1>";
  h += '<div class="seg">' + [["mine", "Meri", "Mine"], ["cat", "Sujhaav", "Ideas"], ["acts", "150 kaam", "150 acts"], ["plan", "Yojana", "Hard-day plan"]].map(function (s) { return '<button data-a="ritTab" data-t="' + s[0] + '" aria-pressed="' + (V.rit === s[0]) + '">' + T(s[1], s[2]) + "</button>"; }).join("") + "</div>";
  if (V.rit === "cat") return h + '<ul class="list">' + CATALOGUE.map(function (c) { return '<li class="card" style="margin:0;display:block"><div class="chiprow" style="justify-content:space-between"><b>' + esc(T(c[1], c[2])) + '</b><span class="tag">' + esc(c[4]) + '</span></div><p style="margin:6px 0 8px" class="small">' + esc(T(c[5], c[6])) + '</p><button class="chip" data-a="vesselFrom" data-id="' + c[0] + '">' + T("Apnaiye", "Keep this one") + "</button></li>"; }).join("") + "</ul>";
  if (V.rit === "acts") return h + viewActs();
  if (V.rit === "plan") return h + planHTML(false);
  var rit = S.look.a.ritual;
  if (rit && !isNone(rit) && !S.vessels.some(function (v) { return v.what === rit; })) h += '<div class="nudge"><b>' + T("Aap pehle se yeh nibhate hain: ", "You already keep this: ") + esc(rit) + '</b><span></span><span class="why">' + T("Aapne nazar mein bataya tha. Ise jaan-boojh kar rakhein?", "You mentioned it in the look. Keep it on purpose?") + '</span><div class="row"><button class="btn" data-a="vesselNew" data-what="' + esc(rit) + '">' + T("Paatra banaiye", "Make it a vessel") + "</button></div></div>";
  h += S.vessels.length ? '<ul class="list">' + S.vessels.map(function (v, i) { return '<li class="card" style="margin:0;display:block"><div class="chiprow" style="justify-content:space-between"><b>' + esc(v.what) + '</b><span class="tag">' + esc(v.form) + '</span></div><p class="small" style="margin:4px 0">' + esc((v.who ? T("Kiske saath: ", "With: ") + v.who + " · " : "") + (v.when || "")) + '</p><p class="hand" style="font-size:18px;margin:4px 0 8px">“' + esc(v.words) + '”</p><div class="row"><button class="chip" data-a="vesselKept" data-i="' + i + '">' + T("Aaj nibhaya", "Kept it today") + '</button><button class="chip" data-a="vesselDel" data-i="' + i + '">' + T("Chhodiye", "Let it go") + '</button></div><p class="small" style="margin:6px 0 0">' + (v.lastKept ? T("Pichhli baar: ", "Last kept: ") + esc(v.lastKept) : "") + "</p></li>"; }).join("") + "</ul>" : '<p class="small">' + T("Abhi koi paatra nahi. Ek se shuru kijiye.", "No vessels yet. Start with one.") + "</p>";
  h += '<button class="btn block" style="margin-top:12px" data-a="vesselNew">' + T("Naya paatra", "New vessel") + "</button>";
  return h;
}
function vesselSheet(pre) {
  pre = pre || {};
  sheet('<div class="sheet" role="dialog"><div class="grab"></div><h2 class="h2" style="margin-top:4px">' + T("Ek paatra", "A vessel") + '</h2><p class="small">' + T("Jo aadat ko reet banata hai: uska matlab, zor se bola gaya.", "What turns a habit into a vessel: its meaning, said aloud.") + '</p><label class="f" for="vWhat">' + T("Kya karte hain?", "What do you do?") + '</label><input class="t" id="vWhat" value="' + esc(pre.what || "") + '"><label class="f" for="vWho">' + T("Kiske saath?", "With whom?") + '</label><input class="t" id="vWho" value="' + esc(pre.who || "") + '"><label class="f" for="vWhen">' + T("Kab, kitni baar?", "When, how often?") + '</label><input class="t" id="vWhen" value="' + esc(pre.when || "") + '" placeholder="' + T("har Itvaar dopahar", "every Sunday lunch") + '"><label class="f">' + T("Kis roop mein?", "Which form?") + '</label><div class="chiprow" id="forms">' + FORMS.map(function (f, i) { return '<button class="chip' + ((pre.form || "time") === f[0] ? " on" : "") + '" data-a="formPick" data-f="' + f[0] + '">' + T(f[1], f[2]) + "</button>"; }).join("") + '</div><label class="f" for="vWords">' + T("Iska matlab, ek vaakya mein", "What it's for, in one sentence") + '</label><textarea class="t hand" id="vWords" style="min-height:70px;font-size:18px">' + esc(pre.words || "") + '</textarea><div class="chiprow" style="margin-top:6px"><button class="chip" data-a="vesselWords">' + T("Shabd sujhaiye", "Suggest words") + '</button><span id="vSrc"></span></div><button class="btn primary block" style="margin-top:12px" data-a="vesselSave">' + T("Rakhiye", "Keep it") + '</button><button class="btn ghost block" style="margin-top:8px" data-a="close">' + T("Band kijiye", "Close") + "</button></div>");
  V.form = pre.form || "time";
}
function viewActs() {
  var jobs = JOBS.concat([{ id: "drift", name: ["Bhatakne ke khilaaf", "Against drift"], what: ["rishte chalte rakhna", "keeping ties going"] }]);
  var open = chairs().filter(function (c) { return !c.names.length; }).map(function (c) { return c.job.id; });
  return '<p class="small">' + T("Har kaam paanch mein se ek ke liye hai. ● = aapke naksha par khaali kursi.", "Each act serves one of the five. ● = an open chair on your map.") + '</p><div class="chiprow" style="margin:8px 0 6px">' + jobs.map(function (j) { return '<button class="chip' + (V.job === j.id ? " on" : "") + '" data-a="job" data-j="' + j.id + '">' + (open.indexOf(j.id) >= 0 ? "● " : "") + esc(P(j.name)) + "</button>"; }).join("") + '</div><ul class="list">' + pool(V.job).map(function (a) { return '<li class="card" style="margin:0;justify-content:space-between"><span><span class="mono small">' + a.n + "</span> " + esc(a.t) + '</span><button class="chip" data-a="pick" data-n="' + a.n + '">' + T("Aaj", "Today") + "</button></li>"; }).join("") + "</ul>";
}
function planHTML(inGate) {
  var p = S.plan;
  if (inGate) {
    if (!p.p1) return "";
    return '<div class="card" style="background:#111;border-color:#333;color:#fff"><p class="small" style="margin:0 0 4px;color:#bbb">' + T("Aapki apni yojana", "Your own plan") + "</p>" + (p.signs ? '<p style="margin:0 0 6px">' + esc(p.signs) + "</p>" : "") + '<p style="margin:0 0 6px"><b>' + esc(p.p1) + "</b>" + (p.p2 ? " · <b>" + esc(p.p2) + "</b>" : "") + '</p><p class="hand" style="font-size:18px;margin:0 0 8px">“' + esc(p.say || T("Kya aap das minute phone par reh sakte ho?", "Can you stay on the phone for ten minutes?")) + '”</p><a class="btn" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(p.say || T("Kya aap das minute phone par reh sakte ho?", "Can you stay on the phone for ten minutes?")) + '">' + T("Message kholiye", "Open a message") + "</a>" + (p.place ? '<p class="small" style="margin:8px 0 0;color:#bbb">' + T("Jo shaant karta hai: ", "What settles me: ") + esc(p.place) + "</p>" : "") + "</div>";
  }
  var few = oneToOne().filter(function (x) { return x.ring === "few"; }).map(function (x) { return x.name; });
  return '<p class="lead">' + T("Shaant din par likhiye. Bhaari din par yeh sabse pehle dikhega, aapke apne shabdon mein. Yeh crisis yojanaon ke ek jaane-maane tareeke se liya gaya hai.", "Write it on a calm day. On a hard day it appears first, in your own words. It's adapted from an established crisis-planning method.") + '</p><label class="f" for="plSigns">1. ' + T("Mere sanket ki main hil raha hoon", "Signs that I'm getting shaky") + '</label><input class="t" id="plSigns" value="' + esc(p.signs) + '"><label class="f" for="plP1">2. ' + T("Do log jinhe phone kar sakta hoon", "Two people I can call") + '</label><div class="row"><input class="t" id="plP1" style="flex:1" list="plList" value="' + esc(p.p1) + '"><input class="t" id="plP2" style="flex:1" list="plList" value="' + esc(p.p2) + '"></div><datalist id="plList">' + few.map(function (n) { return "<option>" + esc(n) + "</option>"; }).join("") + '</datalist><label class="f" for="plSay">' + T("Main kya kahunga", "What I'll say") + '</label><input class="t" id="plSay" value="' + esc(p.say) + '" placeholder="' + T("Kya aap das minute phone par reh sakte ho?", "Can you stay on the phone for ten minutes?") + '"><label class="f" for="plPlace">3. ' + T("Ek jagah ya reet jo mujhe shaant karti hai", "One place or ritual that settles me") + '</label><input class="t" id="plPlace" value="' + esc(p.place) + '"><p class="small" style="margin-top:10px">4. ' + T("Madad ke number hamesha aakhir mein, hamesha maujood.", "The helpline numbers, always last and always there.") + '</p><button class="btn primary block" data-a="planSave">' + T("Yojana rakhiye", "Keep the plan") + "</button>";
}

/* =================== together =================== */
function viewTogether() {
  var h = '<p class="eyebrow">' + T("Saath", "Together") + '</p><h1 class="q" style="font-size:25px">' + T("Thaamna dono taraf, aur saath mein", "Holding both ways, and together") + '</h1><p class="small">' + T("Jo aap saath karte hain wahi saath hota hai. Kisi ka nijee naksha kabhi share nahi hota.", "Only what you do together is shared. Nobody's private map is ever shared.") + "</p>";
  h += '<div class="seg" style="flex-wrap:wrap">' + [["few", "Apne ho", "In my few"], ["got", "Mila", "Received"], ["chairs", "Do kursiyan", "Two Chairs"], ["round", "Ghar", "Family"], ["cell", "Cell", "Cell"], ["pass", "Nazar", "Pass it on"]].map(function (s) { return '<button data-a="togTab" data-t="' + s[0] + '" aria-pressed="' + (V.tog === s[0]) + '">' + T(s[1], s[2]) + "</button>"; }).join("") + "</div>";
  if (V.tog === "few") {
    var ps = oneToOne(), sel = V.fewWho || (ps[0] && ps[0].name) || "", p = ps.filter(function (x) { return x.name === sel; })[0], jobs = V.fewJobs || (p ? p.jobs.slice(0, 1) : []);
    h += '<p class="lead">' + T("Kisi ko bataiye ki woh un logon mein hain jo aapko thaamte hain, aur kaise. Yeh unhe bhi apni nazar ka mauka deta hai.", "Tell someone they're one of the people who hold you, and how. It gives them a reason to look too.") + "</p>";
    h += ps.length ? '<label class="f">' + T("Kisko", "To") + '</label><div class="chiprow">' + ps.slice(0, 12).map(function (x) { return '<button class="chip' + (x.name === sel ? " on" : "") + '" data-a="fewWho" data-n="' + esc(x.name) + '">' + esc(x.name) + "</button>"; }).join("") + '</div><label class="f">' + T("Woh aapke liye kya karte hain", "What they do for you") + '</label><div class="chiprow">' + JOBS.map(function (j) { return '<button class="chip' + (jobs.indexOf(j.id) >= 0 ? " on" : "") + '" data-a="fewJob" data-j="' + j.id + '">' + esc(P(j.name)) + "</button>"; }).join("") + '</div><button class="btn primary block" style="margin-top:12px" data-a="fewMake">' + T("Card banaiye", "Make the card") + '</button><div id="fewOut"></div>' : '<p class="small">' + T("Pehle naksha par ek naam chahiye.", "You need a name on your map first.") + "</p>";
    return h;
  }
  if (V.tog === "got") return h + '<p class="lead">' + T("Kisi ne aapko 'tum mere apne ho' bheja? Use yahan rakhiye; yeh sirf is phone par rahega, 'Jinhone rakha' mein.", "Did someone send you 'you're in my few'? Keep it here. It stays on this phone, in Kept by.") + '</p><label class="f" for="gWho">' + T("Kisne bheja", "Who sent it") + '</label><input class="t hand" id="gWho"><label class="f" for="gMsg">' + T("Unka message", "Their message") + '</label><textarea class="t" id="gMsg" style="min-height:90px"></textarea><button class="btn primary block" style="margin-top:10px" data-a="gotSave">' + T("Sambhaal ke rakhiye", "Keep it") + "</button>";
  if (V.tog === "chairs" || V.tog === "round") return h + ritualFlow(V.tog);
  if (V.tog === "cell") return h + cellHTML();
  return h + '<p class="lead">' + T("Apna naksha nahi, unhe unka dekhne ka mauka bhejiye. Card par kabhi naam nahi.", "Send the chance to see their own map, not yours. No names on any card.") + '</p><div class="seg">' + [["look", "Nazar", "The look"], ["line", "Ek line", "The line"], ["map", "Khaali naksha", "Blank map"]].map(function (t) { return '<button data-a="cardType" data-t="' + t[0] + '" aria-pressed="' + (V.card === t[0]) + '">' + T(t[1], t[2]) + "</button>"; }).join("") + '</div><canvas class="cardprev" id="cv" width="1080" height="1350" aria-label="Card"></canvas><div class="row" style="margin-top:10px"><a class="btn primary" target="_blank" rel="noopener" data-a="shared" href="https://wa.me/?text=' + encodeURIComponent(cardText() + "\n" + N.appUrl) + '">WhatsApp</a><button class="btn" data-a="savePng">' + T("Image save", "Save image") + "</button></div>";
}
function ritualFlow(kind) {
  var R = V.ritual && V.ritual.kind === kind ? V.ritual : (V.ritual = { kind: kind, step: 0, a: "", b: "", ag: null });
  var ag = R.ag || TIER0.saath({ kind: kind === "chairs" ? "chairs" : "round" });
  if (kind === "round") {
    return '<div class="card"><p class="layerpill">' + T("Ghar ka chakkar · ek phone, sab saath", "The round · one phone, everyone together") + '</p><p class="ritualstep">' + esc(ag.question) + '</p><ol style="padding-left:20px;margin:0">' + ag.agenda.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ol><div class="chiprow" style="margin-top:10px">' + srcChip(R.ag || { _tier: "t0" }) + '<button class="chip" data-a="ritualAgenda">' + T("Naya dhaancha", "New guide") + '</button></div><label class="f" for="rAct">' + T("Ghar ke bahar kisi ke liye is hafte ka kaam", "This week's act for someone outside the home") + '</label><input class="t" id="rAct"><button class="btn primary block" style="margin-top:10px" data-a="roundSave">' + T("Kaam rakhiye", "Keep the act") + '</button><p class="small" style="margin-top:8px">' + T("Bachchon ke jawab kabhi save nahi hote. Kisi ki tulna nahi.", "Children's answers are never saved. No one is compared.") + "</p></div>";
  }
  var h = '<div class="card"><p class="layerpill">' + T("Do kursiyan · mahine mein ek baar", "Two Chairs · once a month") + "</p>";
  if (R.step === 0) h += '<p class="ritualstep">' + T("Do kursiyan, aamne-saamne. Phone beech mein. Shikayat nahi, sirf yeh do baatein.", "Two chairs, facing each other. The phone between you. No complaints, only these two things.") + '</p><ol style="padding-left:20px;margin:0">' + ag.agenda.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ol><p class="small">' + T("Pehle har koi chupke se likhega; phir dono saath padhenge.", "Each writes privately first; then you read both together.") + '</p><button class="btn primary block" data-a="chairsNext">' + T("Pehla likhe", "First person writes") + "</button>";
  else if (R.step === 1 || R.step === 2) h += '<p class="ritualstep">' + (R.step === 1 ? T("Pehla: ", "First: ") : T("Doosra: ", "Second: ")) + T("doosre ki taraf mat dikhaiye.", "keep this away from the other.") + '</p><label class="f" for="rA">' + T("Ek tareeka jisse woh mujhe thaamte hain", "One way they hold me") + '</label><textarea class="t" id="rA" style="min-height:70px"></textarea><label class="f" for="rB">' + T("Ek tareeka jisse main thaama jaana chahta hoon", "One way I'd like to be held") + '</label><textarea class="t" id="rB" style="min-height:70px"></textarea><button class="btn primary block" style="margin-top:10px" data-a="chairsNext">' + (R.step === 1 ? T("Chhupaiye aur phone doosre ko dijiye", "Hide it and pass the phone") : T("Dono saath dekhiye", "Reveal both together")) + "</button>";
  else h += '<p class="ritualstep">' + T("Dono ke shabd", "Both of your words") + '</p><div class="kept"><li><b>' + T("Pehla", "First") + "</b><br>" + esc(R.a1) + "<br><i>" + esc(R.b1) + '</i></li><li><b>' + T("Doosra", "Second") + "</b><br>" + esc(R.a2) + "<br><i>" + esc(R.b2) + '</i></li></div><p class="small">' + T("Yeh save nahi hota. Band karte hi mit jaata hai.", "Nothing here is saved. It disappears when you close it.") + '</p><button class="btn block" data-a="chairsEnd">' + T("Poora hua", "We're done") + "</button>";
  return h + "</div>";
}
function cellHTML() {
  if (!S.cell) return '<p class="lead">' + T("8 tak log, hafte mein ek baar, aamne-saamne. App sirf dhaancha deta hai.", "Up to 8 people, once a week, in person. The app gives only the shape of the talk.") + '</p><label class="f" for="cName">' + T("Cell ka naam", "Cell name") + '</label><input class="t" id="cName"><button class="btn" style="margin-top:10px" data-a="cellNew">' + T("Naya Cell", "Start a Cell") + '</button><label class="f" for="cCode">' + T("Ya code se judiye", "Or join with a code") + '</label><div class="row"><input class="t" id="cCode" style="flex:1;text-transform:uppercase" maxlength="6"><button class="btn" data-a="cellJoin">' + T("Judiye", "Join") + "</button></div>";
  var ag = V.agenda || TIER0.saath({});
  return '<div class="card"><div class="chiprow"><b>' + esc(S.cell.name) + '</b><span class="mono small" style="margin-left:auto">' + esc(S.cell.code) + '</span></div><a class="btn" style="margin-top:10px" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(T("Neev Cell. Pehle apni nazar, phir code: ", "Neev Cell. First take your own look, then the code: ") + S.cell.code + "\n" + N.appUrl) + '">' + T("Code bhejiye", "Send the code") + '</a></div><div class="card"><p style="font-family:var(--f-display);font-size:19px;margin:0 0 6px">' + esc(ag.question) + '</p><ol style="margin:0;padding-left:20px">' + ag.agenda.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ol><div class="chiprow" style="margin-top:10px">' + srcChip(V.agenda || { _tier: "t0" }) + '<button class="chip" data-a="agenda">' + T("Naya agenda", "New agenda") + '</button></div></div><div class="card"><p style="margin:0">' + T("Is hafte kitno ne apna kaam kiya", "Who did their act this week") + '</p><div class="dots" id="ticks"></div><p class="small" style="margin:6px 0 10px">' + T("Bina naam. Koi ranking nahi.", "No names. No ranking.") + '</p><button class="btn" data-a="tick">' + T("Mera ho gaya", "Mine is done") + '</button> <button class="linkbtn" data-a="cellLeave">' + T("Cell chhodiye", "Leave Cell") + "</button></div>";
}
function cardText() { if (V.card === "line") return L(N.oneLine); if (V.card === "map") return T("Aapke apne, daayra, gaon. Inmein kaun hai?", "Your few, your circle, your village. Who's in them?"); return T("Aapko kaun thaame hue hai? Chhe minute ki ek nazar.", "Who is holding you? A six-minute look."); }
function wrapText(c, text, w) { var ws = text.split(" "), out = [], cur = ""; ws.forEach(function (x) { var t = cur ? cur + " " + x : x; if (c.measureText(t).width > w && cur) { out.push(cur); cur = x; } else cur = t; }); if (cur) out.push(cur); return out; }
function drawCard() {
  var cv = $("#cv"); if (!cv) return;
  var draw = function () {
    var c = cv.getContext("2d"); c.fillStyle = "#13110F"; c.fillRect(0, 0, 1080, 1350);
    c.fillStyle = "#F2A54A"; c.font = "64px 'Rozha One', Georgia, serif"; c.textAlign = "left"; c.fillText("Neev", 90, 150);
    if (V.card !== "line") {
      c.strokeStyle = "#3A3129"; c.lineWidth = 3; [300, 205, 110].forEach(function (r) { c.beginPath(); c.arc(540, 640, r, 0, Math.PI * 2); c.stroke(); });
      c.fillStyle = "#F2A54A"; c.beginPath(); c.arc(540, 640, 22, 0, Math.PI * 2); c.fill();
      c.fillStyle = "#F3EBDD"; c.font = "54px 'Rozha One', Georgia, serif"; wrapText(c, cardText(), 900).forEach(function (l, i) { c.fillText(l, 90, 1050 + i * 66); });
    } else { c.fillStyle = "#F3EBDD"; c.font = "86px 'Rozha One', Georgia, serif"; var ls = wrapText(c, cardText(), 900), y0 = 675 - ls.length * 52 + 60; ls.forEach(function (l, i) { c.fillText(l, 90, y0 + i * 104); }); }
    c.fillStyle = "#B3A592"; c.font = "28px 'Hind', sans-serif"; c.fillText(N.appUrl.replace(/^https?:\/\//, "").replace(/\/$/, ""), 90, 1270);
  };
  if (document.fonts && document.fonts.load) Promise.all(["86px 'Rozha One'", "28px 'Hind'"].map(function (f) { return document.fonts.load(f); })).then(draw, draw); else draw();
}

/* =================== learn =================== */
var LEARN = [["holding", 1], ["web", 1], ["few", 1], ["circle", 3], ["village", 3], ["jobs", 2], ["both", 2], ["kept", 2], ["vessel", 3], ["drift", 5], ["placeholder", 4], ["ai", 4], ["test", 4]];
function viewLearn() {
  var h = (S.look.unlocked ? "" : '<button class="btn block" style="margin:6px 0 14px" data-a="go" data-to="look">' + T("← Nazar par wapas", "← Back to your look") + "</button>") + '<p class="eyebrow">' + T("Samjhiye", "Learn") + '</p><h1 class="q" style="font-size:25px">' + T("Jo aapne dekha, uske peeche ke vichaar", "The ideas behind what you saw") + "</h1>";
  h += LEARN.map(function (x) { var t = TERMS[x[0]], ep = N.episodes[x[1] - 1]; return '<details class="learn"><summary><b>' + esc(P(t[0])) + '</b><span class="small">' + T("kholiye", "open") + '</span></summary><div class="body"><p style="margin:0">' + esc(P(t[1])) + '</p><div class="chiprow" style="margin-top:8px"><button class="chip" data-a="explain" data-k="' + x[0] + '">' + T("Aur saral shabdon mein", "Say it more simply") + '</button></div><div id="ex-' + x[0] + '"></div><p class="small" style="margin:10px 0 0">' + T("Gehra: ", "Deeper: ") + "Episode " + ep.n + " · " + esc(ep.title) + "</p></div></details>"; }).join("");
  h += '<h2 class="h2">' + T("Series", "The series") + "</h2>" + N.episodes.map(function (e) { var out = N.releases[e.n] <= dstr(); return '<div class="card"><div class="chiprow"><span class="mono small">EP ' + e.n + "</span><b>" + esc(e.title) + '</b><span class="small" style="margin-left:auto">' + (out ? '<a href="' + esc(N.seriesUrl) + '" target="_blank" rel="noopener">' + T("Dekhiye", "Watch") + "</a>" : new Date(N.releases[e.n] + "T12:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" })) + '</span></div><p style="margin:6px 0 4px;font-family:var(--f-display);font-size:18px">' + esc(L(e.q)) + '</p><p class="small" style="margin:0">' + T("Kholti hai: parat ", "Opens: layer ") + EP_LAYER[e.n] + " · " + esc(P(LAYERS[EP_LAYER[e.n] - 1].title)) + "</p></div>"; }).join("");
  h += '<h2 class="h2">' + T("Kitaabein", "Books") + "</h2>" + N.books.map(function (b) { return '<details class="card"><summary style="cursor:pointer"><b>' + esc(b.title) + '</b><br><span class="small">' + esc(b.sub || "") + "</span></summary><p>" + esc(b.summary) + '</p><a class="btn" target="_blank" rel="noopener" href="' + esc(b.url) + '">' + T("Kitaab dekhiye", "See the book") + "</a></details>"; }).join("");
  return h + '<p class="small" style="margin-top:16px">' + T("Neev muft hai. ", "Neev is free. ") + '<a href="' + esc(N.patreonUrl) + '" target="_blank" rel="noopener">Patreon</a></p>';
}

/* =================== night, return, data, lock =================== */
function viewRaat() {
  var p = S.plan.p1 || (oneToOne().filter(function (x) { return x.ring === "few"; })[0] || {}).name || "";
  var h = '<p class="eyebrow">' + T("Raat", "Night") + " · " + now().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) + '</p><h1 class="q" style="font-size:27px">' + T("Is waqt akele nahi rehna hai.", "You don't have to be alone with this right now.") + "</h1>" + planHTML(true);
  h += '<div class="card gate" style="border-color:#333"><p class="small" style="margin:0 0 4px">' + T("Abhi baat kijiye, muft, 24 ghante:", "Talk now, free, 24 hours:") + "</p>" + gateLines(2) + "</div>";
  if (p && !S.plan.p1) h += '<div class="card"><a class="btn block" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(fill(RAAH, p)) + '">' + T(esc(p) + " ko message", "Message " + esc(p)) + "</a></div>";
  h += '<h2 class="h2">' + T("Saans", "Breathe") + '</h2><div class="saans" id="saans"></div><p class="saans-label" id="saansL"></p><button class="btn block" data-a="saans" id="saansBtn">' + T("Ek minute, shuru kijiye", "One minute: begin") + '</button><h2 class="h2">' + T("Subah ke liye likhiye", "Write it for the morning") + '</h2><textarea class="t hand" id="raatDraft" style="font-size:18px">' + esc(S.raatDraft) + '</textarea><div class="row" style="margin-top:10px"><button class="btn" data-a="raah">' + T("Ek shuruaati line", "A starter line") + '</button></div><div id="raahOut"></div><button class="btn ghost block" style="margin-top:22px" data-a="go" data-to="' + (S.look.unlocked ? "aaj" : "look") + '">' + T("Wapas", "Back") + "</button>";
  return h;
}
function viewPhirse() {
  var ps = oneToOne();
  return '<div class="lookbar"><span style="width:44px"></span><span class="where">' + T("Phir se", "Again") + '</span></div><div class="lookbody"><div class="grow"><p class="beat fadein">' + T("Wapas aaye. Kuch nahi khoya.", "Welcome back. Nothing was lost.") + '</p><p class="reveal-line fadein2" style="color:var(--muted)">' + T("Aapka naksha wahin hai. Kitne din hue, isse farak nahi padta.", "Your map is where you left it. How long it's been doesn't matter.") + '</p><div class="minimap fadein2" style="max-width:200px">' + mapSVG({ small: true }) + "</div>" + (ps.length ? '<p class="reveal-line fadein3">' + T("Inmein se aaj kaun yaad aaya?", "Which of them came to mind today?") + '</p><div class="chiprow fadein3">' + ps.slice(0, 8).map(function (p) { return '<button class="chip" data-a="phPick" data-n="' + esc(p.name) + '">' + esc(p.name) + "</button>"; }).join("") + "</div>" : "") + '</div><div class="lookfoot"><button class="btn ghost block" data-a="phDone">' + T("Seedha Aaj par", "Straight to Today") + "</button></div></div>";
}
function viewLock() {
  return '<div class="lookbody"><div class="grow" style="text-align:center"><p class="beat small2" style="margin-top:12vh">Neev</p><p class="small">' + T("PIN daliye", "Enter your PIN") + '</p><div class="pindots">' + [0, 1, 2, 3].map(function (i) { return '<i class="' + (V.pinIn.length > i ? "on" : "") + '"></i>'; }).join("") + '</div><div class="pinpad">' + [1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "⌫"].map(function (d) { return d === "" ? "<span></span>" : '<button data-a="pinKey" data-d="' + d + '">' + d + "</button>"; }).join("") + '</div><button class="linkbtn" style="margin-top:20px" data-a="pinForgot">' + T("PIN bhool gaye? Sab mitaiye", "Forgot it? Delete everything") + "</button></div></div>";
}
function viewKnows() {
  var ps = people(true), gpu = !!navigator.gpu, memGb = navigator.deviceMemory || null;
  var h = (S.look.unlocked ? "" : '<button class="btn block" style="margin:6px 0 14px" data-a="go" data-to="look">' + T("← Nazar par wapas", "← Back to your look") + "</button>") + '<p class="eyebrow">' + T("Aapka data", "Your data") + '</p><h1 class="q" style="font-size:25px">' + T("Yeh app aapke baare mein kya jaanta hai", "What this app knows about you") + '</h1><p class="lead">' + T("Sab sirf is phone par. Koi account nahi, koi analytics nahi.", "Everything is on this phone only. No account, no analytics.") + "</p>";
  h += '<div class="card"><b>' + T("Naam", "Names") + " (" + ps.length + ')</b><p class="hand" style="font-size:18px;margin:6px 0 0">' + (ps.map(function (p) { return esc(p.name); }).join(", ") || "—") + '</p><p class="small" style="margin:6px 0 0">' + T(Object.keys(S.look.a).length + " jawab · " + S.kept.length + " 'Jinhone rakha' · " + S.vessels.length + " paatra · " + S.done.length + " kaam", Object.keys(S.look.a).length + " answers · " + S.kept.length + " Kept-by notes · " + S.vessels.length + " vessels · " + S.done.length + " acts") + "</p></div>";
  h += '<div class="card"><b>' + T("Saajha phone?", "Shared phone?") + '</b><p class="small" style="margin:4px 0 8px">' + T("PIN se aam nazron se bachaav hota hai. Yeh encryption nahi hai.", "A PIN keeps casual eyes out. It is not encryption.") + '</p><div class="row"><input class="t" id="pinSet" inputmode="numeric" maxlength="4" style="flex:1" placeholder="' + (S.pin ? T("PIN laga hai", "PIN is set") : "4 digits") + '"><button class="btn" data-a="pinSave">' + (S.pin ? T("Badliye", "Change") : T("Lagaiye", "Set")) + "</button>" + (S.pin ? '<button class="btn ghost" data-a="pinClear">' + T("Hataiye", "Remove") + "</button>" : "") + "</div></div>";
  h += '<div class="card"><b>' + T("Hafte ka din", "Your weekly day") + '</b><select class="t" id="rhythm" style="margin-top:8px">' + DAYS_EN.map(function (d, i) { return '<option value="' + i + '"' + (+S.rhythmDay === i ? " selected" : "") + ">" + (S.lang === "hi" ? DAYS_HI[i] : d) + "</option>"; }).join("") + '</select><button class="btn" style="margin-top:8px" data-a="ics">' + T("Calendar mein jodiye", "Add to my calendar") + "</button></div>";
  h += '<div class="card"><b>' + T("AI kaise chale", "How the AI runs") + '</b><div class="seg" style="margin-top:10px"><button data-a="tier" data-t="t0" aria-pressed="' + (S.tier === "t0") + '">' + T("Sirf pehle se likha", "Pre-written only") + '</button><button data-a="tier" data-t="t3" aria-pressed="' + (S.tier === "t3") + '">' + T("Claude, naam chhupe", "Claude, names hidden") + '</button></div><p class="small" style="margin:0">' + T("Nazar aur naksha bina AI ke chalte hain. AI ko naam nahi jaate, aur aapke apne likhe vaakya bhi nahi.", "The look and the map work without AI. The AI never receives names, or sentences you typed yourself.") + " " + (S.tier === "t3" && !CAP.sample ? "<b>" + T("Is view mein Claude tak pahunch nahi; pehle se likha use ho raha hai.", "Claude isn't reachable in this view; pre-written text is used.") + "</b> " : "") + '</p><p class="small">' + T("Is phone par model: ", "On-device model here: ") + "WebGPU " + (gpu ? "✓" : "✗") + " · RAM " + (memGb ? memGb + " GB" : "?") + " · " + term("ai", T("AI kya karta hai", "What the AI does")) + "</p></div>";
  h += '<div class="card"><b>' + T("Data", "Data") + '</b><div class="row" style="margin-top:10px"><button class="btn" data-a="copyJson">' + T("Sab copy (JSON)", "Copy all (JSON)") + '</button><button class="btn ghost" data-a="wipe">' + T("Sab mitaiye", "Delete everything") + '</button></div></div><div class="card"><div class="row"><button class="btn" data-a="lang">' + (S.lang === "hi" ? "English" : "Hinglish") + '</button><button class="btn" data-a="theme">' + T("Roshni badliye", "Light / dark") + "</button></div></div>";
  return h;
}

/* =================== sheets =================== */
function gateLines(limit) { return N.gate.numbers.slice(0, limit || 4).map(function (g) { return '<div class="gl"><div><div class="num">' + esc(g.num) + '</div><div class="small">' + esc(L(g.label)) + '</div></div><button class="btn" data-a="copy" data-v="' + esc(g.num) + '">Copy</button></div>'; }).join(""); }
function sheet(html) { $("#layer").innerHTML = '<div class="sheet-back" data-a="backdrop">' + html + "</div>"; }
function closeSheet() { $("#layer").innerHTML = ""; }
function openGate() {
  task("gate");
  sheet('<div class="sheet gate" role="dialog" aria-label="Gate"><div class="grab"></div><h2 style="font-family:var(--f-display);font-weight:400;font-size:26px;margin:4px 0 8px">' + T("Abhi kisi se baat kijiye", "Talk to someone now") + "</h2>" + planHTML(true) + gateLines() + '<p class="small">' + esc(L(N.gate.elsewhere)) + '</p><p class="small">' + T("Ghar mein darr ya hinsa ho toh: 181 (mahila helpline, Bharat).", "If you're afraid at home: 181 (women's helpline, India).") + '</p><button class="btn ghost block" data-a="close" style="margin-top:8px">' + T("Band kijiye", "Close") + "</button></div>");
}
function openTerm(k) {
  var t = TERMS[k]; task("term");
  sheet('<div class="sheet" role="dialog"><div class="grab"></div><p class="eyebrow">' + T("Matlab", "What it means") + '</p><h2 class="h2" style="margin-top:4px">' + esc(P(t[0])) + '</h2><p style="font-size:18px">' + esc(P(t[1])) + '</p><button class="btn ghost block" data-a="close">' + T("Samajh gaya", "Got it") + "</button></div>");
}
function openPerson(key) {
  var p = people(true).filter(function (x) { return x.key === key; })[0]; if (!p) return;
  var TAGW = { first: ["pehla naam", "first to mind"], hand: ["aaj dekha", "noticed today"], weekly: ["har hafte", "every week"], night: ["raat ko yaad", "came to mind at night"], called: ["mushkil mein bataya", "told when it was hard"], notice: ["notice karega", "would notice"], would: ["phone karna chahte", "you'd like to call"], truth: ["sach bola", "told you the truth"], bigger: ["saksham mehsoos", "makes you capable"], taught: ["sikhaya", "taught you"], leans: ["aapko phone karega", "would call you"], carryout: ["aap unka bojh uthate", "you carry them"], learned: ["aapse seekha", "learned from you"], lost: ["saath chalte hain", "carried with you"], quiet: ["chup rishta", "gone quiet"], mend: ["theek karna chahte", "you'd set right"], gave: ["vaakya diya", "gave you words"], passon: ["aap unhe de rahe", "you pass on to"], keeper: ["jagah rakhte", "keeps a place"], walk: ["gaon ki sair", "village walk"], added: ["baad mein joda", "added later"] };
  sheet('<div class="sheet" role="dialog"><div class="grab"></div><h2 class="h2" style="margin-top:4px;font-family:var(--f-hand)">' + esc(p.name) + '</h2><p class="small">' + T("Aapke jawabon mein: ", "In your answers: ") + esc(p.pub.map(function (t) { return P(TAGW[t] || [t, t]); }).join(" · ")) + "</p>" + (p.lost ? '<p class="small">' + T("Yeh kisi ghere mein nahi, aapke saath chalte hain.", "Not placed in a ring; carried with you.") + "</p>" : '<label class="f">' + T("Kis ghere mein?", "Which ring?") + '</label><div class="chiprow">' + ["few", "circle", "village"].map(function (r) { return '<button class="chip' + (p.ring === r ? " on" : "") + '" data-a="setRing" data-k="' + esc(key) + '" data-r="' + r + '">' + esc(P(RING[r].name)) + "</button>"; }).join("") + "</div>") + '<div class="chiprow" style="margin-top:12px"><button class="chip' + (p.group ? " on" : "") + '" data-a="toggleGroup" data-k="' + esc(key) + '">⧉ ' + T("Group hai", "It's a group") + '</button>' + (!p.lost && !p.group ? '<button class="chip' + (p.keepClose ? " on" : "") + '" data-a="toggleKeep" data-k="' + esc(key) + '">' + T("Kareeb rakhiye", "Keep close") + "</button>" : "") + '</div><label class="f">' + T("Yaad rakhne ki tareekh (janmdin, barsi)", "A date to remember (birthday, anniversary)") + '</label><div class="row"><input class="t" type="date" id="pDate" style="flex:1"><button class="btn" data-a="dateAdd" data-n="' + esc(p.name) + '">' + T("Jodiye", "Add") + '</button></div><div class="row" style="margin-top:14px">' + (!p.lost && !p.group ? '<button class="btn" data-a="personAct" data-n="' + esc(p.name) + '">' + T("Aaj inke liye ek kaam", "One act for them today") + "</button>" : "") + '<button class="btn ghost" data-a="removePerson" data-k="' + esc(key) + '">' + T("Naksha se hataiye", "Remove") + '</button></div><button class="btn ghost block" style="margin-top:10px" data-a="close">' + T("Band kijiye", "Close") + "</button></div>");
}
function openShabd(who, tone) {
  var ps = oneToOne(), p = who || (S.today && S.today.person) || (ps[0] && ps[0].name) || "";
  V.shabd = { tone: tone || "reach" };
  sheet('<div class="sheet" role="dialog"><div class="grab"></div><h2 class="h2" style="margin-top:4px">' + T("Kehne mein madad", "Help me say it") + '</h2><label class="f" for="sWho">' + T("Kisko", "To") + "</label>" + (ps.length ? '<select class="t" id="sWho">' + ps.map(function (x) { return "<option" + (x.name === p ? " selected" : "") + ">" + esc(x.name) + "</option>"; }).join("") + "</select>" : '<input class="t" id="sWho">') + '<label class="f">' + T("Kis liye", "What for") + '</label><div class="chiprow" id="tones">' + [["reach", "Yaad", "Reach out"], ["mend", "Maafi", "Mend"], ["thanks", "Shukriya", "Thank"], ["meet", "Milna", "Meet"]].map(function (t) { return '<button class="chip' + (V.shabd.tone === t[0] ? " on" : "") + '" data-a="tone" data-t="' + t[0] + '">' + T(t[1], t[2]) + "</button>"; }).join("") + '</div><label class="f" for="sIntent">' + T("Apne shabd (sirf aapke liye; AI ko nahi jaate)", "Your own words (only for you; never sent to the AI)") + '</label><textarea class="t" id="sIntent" style="min-height:70px"></textarea><button class="btn primary block" style="margin-top:12px" data-a="shabdGo" id="shabdGo">' + T("Shuruaati line", "A starter line") + '</button><div id="shabdOut"></div><button class="btn ghost block" style="margin-top:10px" data-a="close">' + T("Band kijiye", "Close") + "</button></div>");
}
function draftBlock(r, intent) {
  return (intent ? '<p class="small" style="margin:12px 0 0">' + T("Aapne likha tha: ", "You wrote: ") + "<i>" + esc(intent) + "</i></p>" : "") + '<label class="f" for="draft">' + T("Badaliye, apni baat jodiye, phir bhejiye", "Edit it, add your own words, then send") + '</label><textarea class="t" id="draft">' + esc(r.message) + '</textarea><div class="chiprow" style="margin:8px 0">' + srcChip(r) + '</div><div class="row"><button class="btn" data-a="copyDraft">Copy</button><a class="btn primary" id="waDraft" target="_blank" rel="noopener" data-a="sentLine" href="https://wa.me/?text=' + encodeURIComponent(r.message) + '">' + T("WhatsApp mein kholiye", "Open in WhatsApp") + '</a></div><p class="small">' + T("Aap bhejenge, app nahi.", "You send it, not the app.") + "</p>";
}

/* =================== db, files =================== */
function chorusAdd(kind) { if (!CAP.db) return; try { CAP.db.collection("chorus").add({ d: dstr(), k: kind }).then(refreshChorus, function () {}); } catch (e) {} }
function refreshChorus() { var el = $("#chorus"); if (!el) return; if (!CAP.db) { el.textContent = T("Live app mein: aaj kitni baar kisi ne kisi tak haath badhaya.", "In the live app: how many times today someone reached someone."); return; } try { CAP.db.collection("chorus").where("d", "==", dstr()).get().then(function (q) { el.textContent = T("Aaj Neev par " + q.size + " baar kisi ne kisi tak haath badhaya.", "Today on Neev, someone reached someone " + q.size + " times."); }, function () {}); } catch (e) {} }
function refreshCell() { var el = $("#ticks"); if (!el || !S.cell) return; if (!CAP.db) { el.innerHTML = "<i></i>"; return; } try { CAP.db.collection("cellticks").where("c", "==", S.cell.code).get().then(function (q) { var wk = weekKey(), n = q.docs.filter(function (d) { var x = d.data(); return x && x.w === wk; }).length; el.innerHTML = Array.from({ length: n }, function () { return "<i></i>"; }).join("") || '<span class="small">—</span>'; }, function () {}); } catch (e) {} }
function saveFile(name, data, ok) { if (!CAP.downloads) { toast(T("Is view mein file save nahi hoti.", "Saving files isn't available in this view.")); return; } CAP.downloads.save({ filename: name, data: data }).then(function (r) { if (r && r.status === "saved") toast(ok); }, function () {}); }
function ics() {
  var day = +S.rhythmDay, d = new Date(), add = (day - d.getDay() + 7) % 7 || 7; d.setDate(d.getDate() + add);
  var ds = dstr(d).replace(/-/g, "") + "T200000", BY = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"][day];
  saveFile("neev-weekly.ics", ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Neev//Prototype//EN", "BEGIN:VEVENT", "UID:neev-" + Date.now() + "@neev", "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z", "DTSTART:" + ds, "DURATION:PT15M", "RRULE:FREQ=WEEKLY;BYDAY=" + BY, "SUMMARY:Neev · " + T("hafte ka ek minute", "your weekly minute"), "DESCRIPTION:" + L(N.oneLine), "END:VEVENT", "END:VCALENDAR"].join("\r\n"), T("Calendar file save ho gayi.", "Calendar file saved."));
}
