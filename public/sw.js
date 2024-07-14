importScripts("./u/bundle.js?v=2");
importScripts("./u/config.js?v=2");
importScripts("./u/sw.js?v=2");

const uv = new UVServiceWorker();
let userKey = new URL(location).searchParams.get("userkey");

async function handleRequest(event) {
    if (uv.route(event)) {
        return await uv.fetch(event);
    }
    
    return await fetch(event.request)
}

self.addEventListener('fetch', (event) => {
    event.respondWith(handleRequest(event));
});
