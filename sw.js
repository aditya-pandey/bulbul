const CACHE = 'bulbul-v3';
const SHELL = [
  './',
  './index.html',
  './styles.css',
  './data.js',
  './export.js',
  './app.js',
  './morph.js',
  './sheet.js',
  './assets/home/branch.webp',
  './assets/home/bulbul.webp',
  './assets/home/bloom-1.webp',
  './assets/home/bloom-2.webp',
  './assets/home/bloom-3.webp',
  './assets/home/bud.webp',
  './snapshot.js',
  './manifest.webmanifest',
  './assets/brand/bulbul-symbol.svg',
  './assets/brand/bulbul-wordmark.svg',
  './assets/brand/bulbul-lockup.svg',
  './assets/brand/bulbul-app-icon.svg',
  './assets/brand/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network-first for shell code (.html/.js/.css) so updates appear immediately; cache-first for static art assets
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  const isCode = /\.(html|js|css|webmanifest)$/.test(url.pathname) || url.pathname.endsWith('/');
  if (isCode) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      if (res && res.status === 200) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }))
  );
});
