// Naikkan nomor versi ini setiap perubahan agar cache lama diganti.
const CACHE = 'vytrade-v9';
const FILES = [
  './', './index.html', './manifest.webmanifest',
  './css/style.css',
  './js/app.js', './js/chart.js', './js/setup.js', './js/latihan.js', './js/jurnal.js',
  './data/concepts.js', './data/examples/util.js', './data/examples/candlestick.js',
  './data/examples/swing.js', './data/examples/bos.js', './data/examples/choch.js',
  './data/examples/fvg.js', './data/examples/ifvg.js', './data/examples/ob.js', './data/examples/entry.js', './data/examples/sl.js', './data/examples/tp.js', './data/examples/noentry.js', './data/examples/liquidity.js', './data/examples/premdisc.js', './data/examples/smt.js',
  './data/topdown.js', './data/setup.js', './data/quiz.js', './data/flashcards.js', './data/glossary.js',
  './assets/icons/icon-180.png', './assets/icons/icon-192.png', './assets/icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Cache-first: pakai cache dulu, kalau tidak ada baru ke jaringan.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
