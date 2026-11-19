/* Little Creature — service worker for the hosted web version (e.g. GitHub Pages).
 * Network-first so updates show up straight away; falls back to the cache when offline. */
var CACHE = 'little-creature-v17';
var FILES = [
  './', 'index.html', 'manifest.webmanifest',
  'lib/phaser.min.js', 'lib/peerjs.min.js', 'lib/fonts/PixelifySans-latin.woff2', 'lib/fonts/PixelifySans-latin-ext.woff2',
  'src/version.js', 'src/update.js', 'src/data.js', 'src/areas.js', 'src/folk.js', 'src/data2.js', 'src/areas2.js', 'src/undersea.js', 'src/battle.js', 'src/badang.js', 'src/home.js', 'src/barunai.js', 'src/kampong.js', 'src/kampong2.js', 'src/majapahit.js', 'src/bayang.js', 'src/state.js', 'src/sim.js', 'src/net.js', 'src/art.js', 'src/art2.js', 'src/art3.js', 'src/art4.js', 'src/art5.js', 'src/art6.js', 'src/art7.js', 'src/art8.js', 'src/art9.js', 'src/art10.js', 'src/art11.js', 'src/art12.js', 'src/audio.js', 'src/lobby.js', 'src/main.js',
  'src/scenes/Boot.js', 'src/scenes/Title.js', 'src/scenes/World.js', 'src/scenes/WorldLife.js', 'src/scenes/WorldFarm.js', 'src/scenes/WorldCombat.js', 'src/scenes/WorldTanggang.js', 'src/scenes/WorldBadang.js', 'src/scenes/WorldHome.js', 'src/scenes/WorldBarunai.js', 'src/scenes/WorldKampong.js', 'src/scenes/WorldKampong2.js', 'src/scenes/WorldMajapahit.js', 'src/scenes/WorldBayang.js', 'src/scenes/UI.js', 'src/scenes/UIMenus.js', 'src/scenes/UIGames.js', 'src/scenes/UISettings.js', 'src/scenes/UIBadang.js', 'src/scenes/UIHome.js', 'src/scenes/UIBarunai.js', 'src/scenes/UIKampong.js', 'src/scenes/UIKampong2.js', 'src/scenes/UIMajapahit.js', 'src/scenes/UIBayang.js',
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
