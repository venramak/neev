/* Neev v7 · Doors. Every episode, Short, book QR code and email is its own short, permanent link.
   neev.<domain>/1 … /5   episodes          /p        the Parichay film
   /s/01 … /s/32          Shorts            /b/<id>   a book's QR code
   /m/<campaign>          an email          /c        a course
   The door decides the first words the person sees; nothing about them is recorded.
   If N.countUrl is set, the app sends one anonymous "door opened" count per install, and only the door's name. */

N.parichayTitle = "Neev · Ek Parichay";
/* Which episode each Short belongs to. Fill in as the Shorts are cut; unknown Shorts still work. */
N.shorts = N.shorts || {};
N.countUrl = N.countUrl || "";

function doorFromPath(path) {
  var m;
  path = (path || "/").replace(/\/+$/, "") || "/";
  if ((m = /^\/([1-5])$/.exec(path))) return { kind: "ep", n: +m[1], key: "e" + m[1] };
  if (path === "/p") return { kind: "parichay", key: "p" };
  if ((m = /^\/s\/(\d{1,2})$/.exec(path))) { var k = ("0" + m[1]).slice(-2); return { kind: "short", n: +m[1], ep: N.shorts[k] || 0, key: "s" + k }; }
  if ((m = /^\/b\/([a-z]+)$/.exec(path)) && N.books.some(function (b) { return b.id === m[1]; })) return { kind: "book", id: m[1], key: "b-" + m[1] };
  if ((m = /^\/m\/([a-z0-9-]{1,24})$/.exec(path))) return { kind: "mail", id: m[1], key: "m-" + m[1] };
  if (path === "/c") return { kind: "course", key: "c" };
  return null;
}

function doorLine(d) {
  function ep(n) { var e = N.episodes.filter(function (x) { return x.n === n; })[0]; return e; }
  if (d.kind === "ep" || (d.kind === "short" && d.ep)) {
    var e = ep(d.kind === "ep" ? d.n : d.ep);
    return T((d.kind === "short" ? "Ek Short se, " : "") + "Episode " + e.n + ", " + e.title + ': "' + e.q.hi + '" Iska jawab yahan, aapke apne naamon mein.', (d.kind === "short" ? "From a Short of " : "From ") + "Episode " + e.n + ", " + e.title + ': "' + e.q.en + '" Here you answer it, with your own names.');
  }
  if (d.kind === "short") return T("Aap ek Neev Short se aaye hain. Ek sawaal se shuru karte hain.", "You came from a Neev Short. Let's start with one question.");
  if (d.kind === "parichay") return T("Aapne Parichay dekha. Ab apna parichay.", "You watched the introduction. Now, yours.");
  if (d.kind === "book") { var b = N.books.filter(function (x) { return x.id === d.id; })[0]; return T("\"" + b.title + "\" ke panne se. Kitaab ne batana shuru kiya; yahan aap dekhenge.", "From the pages of \"" + b.title + "\". The book began the telling; here you see it for yourself."); }
  if (d.kind === "course") return T("Aap course se aaye hain. Pehle apni nazar; course usi par tikega.", "You came from the course. Take your own look first; the course builds on it.");
  return T("Aap Neev ke email se aaye hain.", "You came from a Neev email.");
}

function countDoor(d) {
  if (!N.countUrl) return;
  try {
    if (localStorage.getItem("neev.door")) return;
    localStorage.setItem("neev.door", "1");
    var body = JSON.stringify({ kind: "door:" + d.key });
    if (navigator.sendBeacon) navigator.sendBeacon(N.countUrl, new Blob([body], { type: "application/json" }));
    else fetch(N.countUrl, { method: "POST", headers: { "content-type": "application/json" }, body: body, keepalive: true });
  } catch (e) {}
}

(function () {
  var d = doorFromPath(location.pathname);
  if (!d) return;
  /* The series speaks Hinglish; a first visit from a video or Short opens in Hinglish. Books open in English. */
  var fresh = !S.look.started && !(S.audit && S.audit.step);
  if (fresh && (d.kind === "ep" || d.kind === "short" || d.kind === "parichay")) { S.lang = "hi"; save(); }
  V.door = doorLine(d);
  countDoor(d);
  var hash = d.kind === "ep" ? "#e" + d.n : d.kind === "short" && d.ep ? "#e" + d.ep : d.kind === "book" ? "#book-" + d.id : "#look";
  if (d.kind === "book" && !S.look.unlocked) hash = "#look";
  try { history.replaceState(null, "", "/" + hash); } catch (e) { location.hash = hash; }
})();

boot();
