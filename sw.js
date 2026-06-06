const CACHE_NAME = 'aurora-english-v2-clean';
const APP_SHELL = [
  './', './index.html', './style.css',
  './db.js', './player.js', './lyrics.js', './sleep.js', './app.js',
  './manifest.json', './icons/icon-192.png', './icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || event.request.url.startsWith('blob:')) return;
  if (event.request.url.includes('archive.org') || event.request.url.includes('lrclib.net')) return;

  if (event.request.url.includes('fonts.googleapis') || event.request.url.includes('fonts.gstatic') || event.request.url.includes('cdn.jsdelivr')) {
    event.respondWith(
      fetch(event.request).then(response => {
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
        return response;
      }).catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
