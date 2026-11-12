// Network first, cache as the fallback, so the app opens offline after one visit.
const C = "neev-v7";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== C).map((x) => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then((r) => { const copy = r.clone(); caches.open(C).then((c) => c.put(e.request.mode === "navigate" ? "/" : e.request, copy)); return r; })
    .catch(() => caches.match(e.request.mode === "navigate" ? "/" : e.request)));
});
