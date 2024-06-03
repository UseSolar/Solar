importScripts("./u/bundle.js");
importScripts("./u/config.js");
importScripts("./u/sw.js");

const sw = new UVServiceWorker();
let userKey = new URL(location).searchParams.get("userkey");

self.addEventListener("fetch", (event) => event.respondWith(sw.fetch(event)));
