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
  if (!/[?&]bench\b/.test(location.search)) {
    var st = document.createElement("style");
    st.textContent = "#bench,[data-a=bench]{display:none!important}.stage{grid-template-columns:1fr!important;justify-items:center}";
    document.head.appendChild(st);
  }
})();
