/* Pilot hardening, loaded before the app.
   1. Ask the browser to keep our storage (no silent eviction).
   2. Mirror the state into IndexedDB; if localStorage was cleared but IndexedDB survived, restore and reload.
   3. Hide the test bench unless the link carries ?bench. */
(function () {
  var KEY = "neev.proto.v3", DB = "neev", STORE = "kv";
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
  function idb(fn) {
    try {
      var req = indexedDB.open(DB, 1);
      req.onupgradeneeded = function () { req.result.createObjectStore(STORE); };
      req.onsuccess = function () { try { fn(req.result); } catch (e) {} };
    } catch (e) {}
  }
  var hasLocal = false;
  try { hasLocal = !!localStorage.getItem(KEY); } catch (e) {}
  if (!hasLocal) idb(function (db) {
    var g = db.transaction(STORE).objectStore(STORE).get(KEY);
    g.onsuccess = function () { if (g.result) { try { localStorage.setItem(KEY, g.result); location.reload(); } catch (e) {} } };
  });
  try {
    var set = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      set.call(this, k, v);
      if (k === KEY) idb(function (db) { db.transaction(STORE, "readwrite").objectStore(STORE).put(v, KEY); });
    };
    var rm = Storage.prototype.removeItem;
    Storage.prototype.removeItem = function (k) {
      rm.call(this, k);
      if (k === KEY) idb(function (db) { db.transaction(STORE, "readwrite").objectStore(STORE).delete(KEY); });
    };
  } catch (e) {}
  /* Inside an iframe on another site, the browser keeps this app's storage separate per site (and Safari may block it),
     so a person's map could vanish. Offer the full app in its own tab, always visible. */
  var framed = false;
  try { framed = window.self !== window.top; } catch (e) { framed = true; }
  if (framed) document.addEventListener("DOMContentLoaded", function () {
    var a = document.createElement("a");
    a.href = location.origin + "/" + location.hash; a.target = "_blank"; a.rel = "noopener";
    a.textContent = "Open Neev full screen \u2197";
    a.setAttribute("style", "position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:99;background:#f2a64a;color:#16130f;font:600 14px system-ui,sans-serif;padding:8px 14px;border-radius:999px;text-decoration:none;box-shadow:0 2px 10px rgba(0,0,0,.25)");
    document.body.appendChild(a);
  });
  var gs = document.createElement("style"); gs.textContent = "#gatebar b{white-space:nowrap}"; document.head.appendChild(gs);
  if (!/[?&]bench\b/.test(location.search)) {
    var st = document.createElement("style");
    st.textContent = "#bench,[data-a=bench]{display:none!important}.stage{grid-template-columns:1fr!important;justify-items:center}";
    document.head.appendChild(st);
  }
})();
