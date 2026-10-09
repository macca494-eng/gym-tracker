const CACHE = "reptrace-v8-9";
const ASSETS = [
  "./","index.html","styles.css?v=8.9","anatomy-data.js?v=8.9","app.js?v=8.9","manifest.json","anatomy-front.webp","anatomy-back.webp","ANATOMY-LICENSE.txt",
  "reptrace-icon-192.png","reptrace-icon-512.png","reptrace-apple-touch-icon.png"
];
self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(response=>{
      const clone=response.clone();
      caches.open(CACHE).then(c=>c.put(e.request,clone));
      return response;
    }).catch(()=>caches.match("index.html")))
  );
});
