const CACHE_NAME = "Cache-v1.1";
const urlsToCache = [
  "/",
  "./assets/css/index.css",
  "./assets/js/index.js",
  "./index.html",
  "./go.html",
  "./games.html",
  "./assets/json/g.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== "basic"
          ) {
            return networkResponse;
          }

          return caches.open(CACHE_NAME).then((cache) => {
            if (event.request.method === "GET") {
              const responseToCache = networkResponse.clone();
              cache.put(event.request, responseToCache).catch((error) => {
                console.error("Cache put failed:", error);
              });
            }
            return networkResponse;
          });
        })
        .catch((error) => {
          console.error("Fetch failed; returning cached page instead.", error);
          return caches.match(event.request);
        });
    }),
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
