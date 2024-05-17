
importScripts('/e/uv.bundle.js');
importScripts('/e/uv.config.js');
importScripts(__uv$config.sw || '/e/uv.sw.js');

const sw = new UVServiceWorker();

self.addEventListener('fetch', (event) => event.respondWith(sw.fetch(event)));
