self.addEventListener("install", (e) => {
    e.waitUntil(
      caches.open("static").then((cache) => {
        return Promise.all([
          cache.add("./"),
          cache.add("./index.html"),
          cache.add("./style.css"),
          cache.add("./images/Rune-List198.png")
        ]).catch(err => {
          console.error("Failed to cache during install:", err);
        });
      })
    );
  });

self.addEventListener("fetch", (e) => {
   e.respondWith(
    caches.match(e.request).then(response => {
        return response || fetch(e.request)
    })
   )
})