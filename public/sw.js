importScripts("./u/bundle.js?v=1");
importScripts("./u/config.js?v=1");
importScripts("./u/sw.js?v=1");

const sw = new UVServiceWorker();
let userKey = new URL(location).searchParams.get("userkey");

self.addEventListener("fetch", (event) => event.respondWith(sw.fetch(event)));
