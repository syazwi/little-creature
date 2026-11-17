/* Little Creature — service worker for the hosted web version (e.g. GitHub Pages).
 * Network-first so updates show up straight away; falls back to the cache when offline. */
var CACHE = 'little-creature-v3';
var FILES = [
  './', 'index.html', 'manifest.webmanifest',
  'lib/phaser.min.js', 'lib/peerjs.min.js', 'lib/fonts/PixelifySans-latin.woff2', 'lib/fonts/PixelifySans-latin-ext.woff2',
  'src/data.js', 'src/state.js', 'src/sim.js', 'src/net.js', 'src/art.js', 'src/audio.js', 'src/lobby.js', 'src/main.js',
  'src/scenes/Boot.js', 'src/scenes/Title.js', 'src/scenes/World.js', 'src/scenes/UI.js',
  'icons/icon-192.png', 'icons/icon-512.png'
];
self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(function (r) {
    var copy = r.clone();
    caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
    return r;
  }).catch(function () { return caches.match(e.request, { ignoreSearch: true }); }));
});
