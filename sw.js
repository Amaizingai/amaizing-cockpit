// sw.js — cache app-filer til offline-brug
const CACHE = 'cockpit-v1';
const FILES = ['./amaizing-cockpit.html', './styles.css', './capture.js',
               './store.js', './ai.js', './ideas.js', './nav.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
