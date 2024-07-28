importScripts("u/bundle.js?v=3");
importScripts("u/config.js?v=3");
importScripts(__uv$config.sw || "u/sw.js?v=3");

const uv = new UVServiceWorker();

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      if (uv.route(event)) {
        return await uv.fetch(event);
      }
      return await fetch(event.request);
    })(),
  );
});
