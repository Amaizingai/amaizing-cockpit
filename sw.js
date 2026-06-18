// sw.js — cache app-filer til offline-brug
const CACHE = 'cockpit-v3';
const FILES = ['./amaizing-cockpit.html', './styles.css', './capture.js',
               './store.js', './ai.js', './ideas.js', './nav.js', './roi.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  // Aktivér ny version med det samme — vent ikke på at alle tabs lukkes
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // Slet gamle cache-versioner
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  // Overtag alle åbne tabs uden genindlæsning
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
