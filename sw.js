/* Little Creature — service worker for the hosted web version (GitHub Pages): how iPhones play it, as a Home Screen app.
 * v2.4.2: it works like an installed app. The first visit saves one complete copy of the game, and the game always
 * starts from that copy, so it opens at once and plays offline. Every build stamps a new CACHE name below, so the phone
 * notices a new version when the game starts, downloads ALL of it in the background (never half old, half new) and
 * swaps it in; the game uses it from the next start, or straight away from "update" (LC.applyUpdate in main.js).
 * dist/ (the version news and the downloads) always comes from the internet. */

// ---- stamped by tools/build-web.mjs on every build (do not edit by hand): the version, and every file the game needs
var CACHE = 'little-creature-51-20261122100402';
var FILES = [
  './', 'index.html', 'manifest.webmanifest', 'lib/phaser.min.js', 'lib/peerjs.min.js', 'src/version.js',
  'src/update.js', 'src/data.js', 'src/areas.js', 'src/folk.js', 'src/data2.js', 'src/areas2.js', 'src/undersea.js',
  'src/battle.js', 'src/badang.js', 'src/home.js', 'src/barunai.js', 'src/kampong.js', 'src/kampong2.js',
  'src/barunai-activities.js', 'src/majapahit.js', 'src/bayang.js', 'src/ledang.js', 'src/neklampir.js',
  'src/santubong.js', 'src/bualang.js', 'src/gelora.js', 'src/mayang.js', 'src/masjid.js', 'src/lombong2.js',
  'src/mine-passages.js', 'src/belalang.js', 'src/sulu.js', 'src/sulu2.js', 'src/state.js', 'src/field.js',
  'src/khemah.js', 'src/posts.js', 'src/bagsort.js', 'src/sim.js', 'src/net.js', 'src/worldview.js', 'src/art.js',
  'src/art2.js', 'src/art3.js', 'src/art4.js', 'src/art5.js', 'src/art6.js', 'src/art7.js', 'src/art8.js',
  'src/art9.js', 'src/art10.js', 'src/art11.js', 'src/art12.js', 'src/art13.js', 'src/art14.js', 'src/art15.js',
  'src/art16.js', 'src/art17.js', 'src/art18.js', 'src/art19.js', 'src/art20.js', 'src/art21.js', 'src/art22.js',
  'src/art23.js', 'src/audio.js', 'src/lagu.js', 'src/lobby.js', 'src/scenes/Boot.js', 'src/scenes/Title.js',
  'src/scenes/World.js', 'src/scenes/WorldLife.js', 'src/scenes/WorldFarm.js', 'src/scenes/WorldCombat.js',
  'src/scenes/WorldTanggang.js', 'src/scenes/WorldBadang.js', 'src/scenes/WorldHome.js', 'src/scenes/WorldBarunai.js',
  'src/scenes/WorldKampong.js', 'src/scenes/WorldKampong2.js', 'src/scenes/WorldMajapahit.js', 'src/scenes/WorldBayang.js',
  'src/scenes/WorldLedang.js', 'src/scenes/WorldNek.js', 'src/scenes/WorldSantubong.js', 'src/scenes/WorldBualang.js',
  'src/scenes/WorldGelora.js', 'src/scenes/WorldNaga.js', 'src/scenes/WorldMayang.js', 'src/scenes/WorldShared.js',
  'src/scenes/WorldMasjid.js', 'src/scenes/WorldLombong.js', 'src/scenes/WorldMinePassages.js', 'src/scenes/WorldBelalang.js',
  'src/scenes/WorldSulu.js', 'src/scenes/WorldSulu2.js', 'src/scenes/UI.js', 'src/scenes/UIMenus.js', 'src/scenes/UIGames.js',
  'src/scenes/UISettings.js', 'src/scenes/UIBadang.js', 'src/scenes/UIHome.js', 'src/scenes/UIBarunai.js',
  'src/scenes/UIKampong.js', 'src/scenes/UIKampong2.js', 'src/scenes/UIBarunaiActivities.js', 'src/scenes/UIMajapahit.js',
  'src/scenes/UIBayang.js', 'src/scenes/UILedang.js', 'src/scenes/UINek.js', 'src/scenes/UISantubong.js',
  'src/scenes/UIBualang.js', 'src/scenes/UIGelora.js', 'src/scenes/UIMayang.js', 'src/scenes/UIGuide.js',
  'src/scenes/UIChecklist.js', 'src/scenes/UIMasjid.js', 'src/scenes/UICompanions.js', 'src/scenes/UIBelalang.js',
  'src/scenes/UISulu.js', 'src/scenes/UISulu2.js', 'src/scenes/WorldField.js', 'src/scenes/WorldKhemah.js',
  'src/main.js', 'lib/fonts/PixelifySans-latin.woff2', 'lib/fonts/PixelifySans-latin-ext.woff2', 'icons/icon-192.png',
  'icons/icon-512.png'
];
// ---- end of stamp

self.addEventListener('install', function (e) {
  self.skipWaiting();
  // {cache: 'reload'} skips the browser's own cache, so the copy is really the new version
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return c.addAll(FILES.map(function (f) { return new Request(f, { cache: 'reload' }); }));
  }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE && k.indexOf('little-creature') === 0; })
      .map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  if (url.pathname.indexOf('/dist/') >= 0) return;   // the version news and the downloads: always the internet
  e.respondWith(caches.open(CACHE).then(function (c) {
    return c.match(req, { ignoreSearch: true }).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (r) {
        if (r && r.ok && r.type === 'basic') c.put(req, r.clone());
        return r;
      });
    });
  }));
});
