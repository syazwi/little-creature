/* Little Creature — procedural pixel art for v1.5: cave, ship, jade and marble tiles, seasonal crops and orchard
 * trees, the reban and goat pen, chests, the Pesta pavilion, the Bunian village, the haunted mine and its shadows,
 * the deep-sea realms (Si Tanggang's ship, the Palace of the Southern Sea, Atlantis), farm animals and new icons. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art, OUT = '#2a1d18';

  // ================================================================== TILES (after art3's)
  function cave(p, v) { p.rect(0, 0, 16, 16, v ? '#3a3040' : '#352c3a'); p.speck(0, 0, 16, 16, '#2a2230', 18); p.speck(0, 0, 16, 16, '#4a4052', 8); if (v) { p.px(3 + p.ri(10), 3 + p.ri(10), '#6a5a3a'); p.px(3 + p.ri(10), 3 + p.ri(10), '#5a4a60'); } }
  function caveWall(p) {
    p.rect(0, 0, 16, 16, '#1e1822'); p.speck(0, 0, 16, 16, '#2c2430', 30); p.speck(0, 0, 16, 16, '#141018', 14);
    p.line(p.ri(8), p.ri(6), 8 + p.ri(8), 6 + p.ri(8), '#2a2230'); p.rect(0, 14, 16, 2, '#120e16');
    if (p.r() < 0.5) p.px(2 + p.ri(12), 2 + p.ri(10), '#c9a040');
  }
  function rail(p) { cave(p, 0); for (var x = 1; x < 16; x += 5) p.rect(x, 3, 2, 10, '#4a3424'); p.rect(0, 4, 16, 1, '#7a7a82'); p.rect(0, 11, 16, 1, '#7a7a82'); }
  function plank(p) { p.rect(0, 0, 16, 16, '#5a4a3a'); for (var y = 0; y < 16; y += 4) p.rect(0, y, 16, 1, '#3e3226'); p.speck(0, 0, 16, 16, '#6a5a48', 10); p.speck(0, 0, 16, 16, '#3a6a5a', 6); p.px(p.ri(16), p.ri(16), '#2a2018'); }
  function hull(p) { p.rect(0, 0, 16, 16, '#3a2a20'); for (var x = 0; x < 16; x += 5) p.rect(x, 0, 1, 16, '#2a1e16'); p.speck(0, 0, 16, 16, '#2f6a5a', 14); p.speck(0, 0, 16, 16, '#4a3a2c', 8); p.rect(0, 14, 16, 2, '#24180f'); }
  function jade(p) { p.rect(0, 0, 16, 16, '#3aa88a'); p.rect(0, 0, 16, 1, '#5ac8a8'); p.rect(0, 0, 1, 16, '#5ac8a8'); p.rect(15, 0, 1, 16, '#2a8a70'); p.rect(0, 15, 16, 1, '#2a8a70'); p.speck(1, 1, 14, 14, '#6ad8b8', 6); p.px(8, 8, '#e8d070'); }
  function marble(p, v) {
    p.rect(0, 0, 16, 16, v ? '#dce6ee' : '#cfd9e2'); p.line(p.ri(16), 0, p.ri(16), 16, '#b8c4d0'); p.speck(0, 0, 16, 16, '#c0ccd8', 10);
    if (v) { p.rect(0, 0, 16, 1, '#eef4f8'); p.rect(0, 15, 16, 1, '#a8b4c0'); p.rect(0, 0, 1, 16, '#eef4f8'); p.rect(15, 0, 1, 16, '#a8b4c0'); }
    p.speck(0, 0, 16, 16, '#7ab88a', 4);
  }
  Art.extraTiles = (Art.extraTiles || []).concat([
    { fn: function (p) { cave(p, 0); } }, { fn: function (p) { cave(p, 1); } }, { fn: caveWall }, { fn: rail },
    { fn: plank }, { fn: hull }, { fn: jade }, { fn: function (p) { marble(p, 0); } }, { fn: function (p) { marble(p, 1); } }
  ]);
  Object.assign(Art.TI, { CAVE0: 44, CAVE1: 45, CAVEW: 46, RAIL: 47, PLANK: 48, HULL: 49, JADE: 50, MARBLE: 51, MARBLE2: 52 });

  // ================================================================== CROPS (4 stages, 16x16)
  var G1 = '#4f9a3a', G2 = '#6cbf4a', G3 = '#3a7a2c';
  function sprout(p, st) {
    if (st === 0) { p.ell(8, 13, 3.5, 1.6, '#6a4426'); p.px(7, 12, '#e6d28a'); p.px(9, 13, '#e6d28a'); return true; }
    if (st === 1) { p.rect(8, 10, 1, 4, G1); p.px(6, 10, G2); p.px(7, 9, G2); p.px(9, 9, G2); p.px(10, 10, G2); p.outline('#1f3a1a'); return true; }
    return false;
  }
  var CROP = {
    jagung: function (p, st) {
      p.line(8, 15, 8, st === 2 ? 6 : 2, G1, 2);
      [[8, 12, 3, 9], [8, 10, 13, 7], [8, 8, 4, 5], [8, 6, 12, 3]].forEach(function (l, i) { if (st === 2 && i > 2) return; p.line(l[0], l[1], l[2], l[3], i % 2 ? G2 : G3); });
      if (st === 3) { p.ell(11, 9, 1.6, 3.2, '#f2d06b'); p.px(11, 7, '#ffe8a0'); p.line(10, 6, 12, 12, G1); p.px(11, 5, '#c8a060'); p.px(12, 5, '#c8a060'); p.px(8, 1, '#d8c080'); p.px(7, 2, '#d8c080'); p.px(9, 2, '#d8c080'); }
    },
    tembikai: function (p, st) {
      [[4, 10, 3], [12, 9, 3], [8, 7, 2.6]].forEach(function (d) { p.disc(d[0], d[1], d[2], G1); p.px(d[0], d[1] - 1, G2); });
      p.line(1, 12, 15, 11, G3);
      if (st === 3) { p.ell(8, 11, 6, 4, '#3a8a3a'); for (var x = 4; x < 13; x += 3) p.line(x, 8, x - 1, 14, '#2a6a2a'); p.ell(6, 9.6, 2.4, 1.2, '#7ac06a'); }
    },
    kangkung: function (p, st) {
      var n = st === 2 ? 4 : 7;
      for (var i = 0; i < n; i++) { var x = 3 + i * (10 / (n - 1)); p.line(8, 15, x, st === 2 ? 8 : 4 + (i % 2) * 2, '#8fc06a'); p.poly([[x - 2, (st === 2 ? 8 : 4 + (i % 2) * 2) + 1], [x, (st === 2 ? 6 : 2 + (i % 2) * 2)], [x + 2, (st === 2 ? 8 : 4 + (i % 2) * 2) + 1]], i % 2 ? G2 : G1); }
    },
    nanas: function (p, st) {
      for (var i = 0; i < 7; i++) { var a = (-160 + i * 23) * Math.PI / 180; p.line(8, 14, 8 + Math.cos(a) * 7, 14 + Math.sin(a) * (st === 2 ? 6 : 5), i % 2 ? '#5a9a5a' : '#3f7a4a'); }
      if (st === 3) { p.ell(8, 9, 3, 4, '#e8a030'); for (var y = 6; y < 13; y += 2) p.line(5, y, 11, y + 1, '#b8701a'); p.speck(5, 6, 6, 7, '#ffd060', 5); [[8, 2], [6, 3], [10, 3], [7, 4], [9, 4]].forEach(function (c) { p.line(8, 5, c[0], c[1], '#4a9a4a'); }); }
    }
  };

  // ================================================================== ORCHARD TREES (48x64)
  function fruitTree(p, leaf, leaf2, hi, fruitFn, spots) {
    p.rect(21, 40, 6, 24, '#6b4a2a'); p.rect(25, 40, 2, 24, '#5a3a20'); p.line(24, 46, 14, 36, '#6b4a2a', 3); p.line(24, 44, 34, 34, '#6b4a2a', 3);
    var blobs = [[13, 28, 11], [35, 28, 11], [24, 17, 13], [12, 38, 7], [36, 38, 7], [24, 32, 12]];
    blobs.forEach(function (b) { p.disc(b[0], b[1], b[2], leaf2); });
    blobs.forEach(function (b) { p.disc(b[0] - 1, b[1] - 2, b[2] - 2.5, leaf); });
    p.speck(4, 6, 40, 38, hi, 26);
    if (fruitFn) spots.forEach(function (s) { fruitFn(p, s[0], s[1]); });
  }
  var FT_SPOTS = [[10, 30], [18, 22], [30, 20], [37, 31], [24, 36], [14, 40], [33, 40], [26, 26]];
  var TREE = {
    rambutan: function (p, f) { fruitTree(p, '#3f8a3a', '#2e6a2e', '#5aa84a', f && function (p, x, y) { p.disc(x, y, 2.2, '#d62828'); p.px(x - 2, y - 2, '#ff6b6b'); p.px(x + 2, y - 1, '#ff6b6b'); p.px(x - 1, y + 2, '#a81a1a'); p.px(x + 2, y + 2, '#ff6b6b'); p.px(x, y - 1, '#ff9a9a'); }, FT_SPOTS); },
    manggis: function (p, f) { fruitTree(p, '#2f7a3a', '#245a2e', '#4a9a4a', f && function (p, x, y) { p.disc(x, y, 2.4, '#5a1a4a'); p.px(x - 1, y - 1, '#8a3a7a'); p.rect(x - 1, y - 3, 3, 1, '#4a8a3a'); }, FT_SPOTS); },
    duku: function (p, f) { fruitTree(p, '#4a8a3a', '#3a6a2e', '#6aa84a', f && function (p, x, y) { [[0, 0], [2, 1], [-1, 2], [1, 3]].forEach(function (d) { p.disc(x + d[0], y + d[1], 1.4, '#d8b878'); p.px(x + d[0], y + d[1] - 1, '#f0d8a0'); }); }, FT_SPOTS); },
    cempedak: function (p, f) {
      fruitTree(p, '#3a7a3a', '#2a5a2a', '#5a9a4a', null, []);
      if (f) [[20, 44], [28, 46], [18, 36], [30, 38]].forEach(function (c) { p.ell(c[0], c[1], 2.6, 4.2, '#a8a840'); p.ell(c[0] - 1, c[1] - 1, 1.6, 2.6, '#c8c860'); p.speck(c[0] - 2, c[1] - 3, 5, 7, '#7a7a2a', 4); });
    }
  };

  // ================================================================== FARM BUILDINGS, PESTA, CHESTS
  function drawReban(p) {   // 48x40 raised coop
    p.rect(2, 34, 44, 5, 'rgba(30,20,12,0.3)');
    [[6, 26], [40, 26]].forEach(function (s) { p.rect(s[0], s[1], 3, 12, '#5a3a20'); });
    p.rect(4, 14, 40, 14, '#a8743e'); for (var x = 4; x < 44; x += 4) p.rect(x, 14, 1, 14, '#8a5a2b'); p.rect(4, 27, 40, 2, '#6b4423');
    p.rect(18, 18, 10, 10, '#2a1a10'); p.rect(19, 19, 8, 8, '#3a2414');
    p.disc(23, 23, 2.6, '#c0602c'); p.px(24, 22, '#1a1a1a'); p.px(26, 23, '#f2c14e'); p.px(23, 20, '#d62828');   // a hen peeking out
    p.line(28, 28, 36, 38, '#8a5a2b', 3); for (var k = 0; k < 4; k++) p.px(30 + k * 2, 30 + k * 2, '#5a3a20');
    p.poly([[0, 16], [24, 2], [48, 16]], '#b8a070'); for (x = 2; x < 46; x += 3) p.line(x, 16, 24 + (x - 24) * 0.3, 4, '#9a8050');
    p.rect(0, 15, 48, 2, '#7a6040');
    p.rect(32, 20, 8, 5, '#e8dcc0'); p.ell(36, 22, 3, 1.4, '#f5f0e6');   // the nest box
  }
  function drawKandang(p) {   // 64x40 goat shed
    p.rect(2, 34, 60, 5, 'rgba(30,20,12,0.3)');
    [[4], [30], [57]].forEach(function (s) { p.rect(s[0], 14, 3, 24, '#5a3a20'); });
    p.rect(6, 22, 52, 14, '#3a2a1e'); p.ell(18, 34, 9, 3, '#d8c060'); p.ell(42, 34, 8, 2.6, '#c8b050'); p.speck(10, 31, 44, 5, '#f0e090', 12);
    p.rect(2, 28, 60, 2, '#8a5a2b'); p.rect(2, 33, 60, 2, '#8a5a2b');
    p.poly([[0, 16], [32, 3], [64, 16]], '#b8a070'); for (var x = 2; x < 62; x += 3) p.line(x, 16, 32 + (x - 32) * 0.3, 5, '#9a8050'); p.rect(0, 15, 64, 2, '#7a6040');
    p.rect(46, 20, 10, 6, '#7a5030'); p.rect(46, 20, 10, 1, '#9a6a40');   // the feed trough
  }
  function drawGelanggang(p) {   // 80x56 the Pesta pavilion
    p.rect(2, 50, 76, 5, 'rgba(30,20,12,0.3)');
    [6, 26, 52, 72].forEach(function (x) { p.rect(x, 20, 3, 32, '#7a4b28'); p.rect(x + 2, 20, 1, 32, '#5a3720'); });
    p.rect(4, 44, 72, 8, '#c99a5e'); p.rect(4, 44, 72, 2, '#e0b878'); for (var x = 6; x < 76; x += 6) p.rect(x, 46, 1, 6, '#a8743e');
    p.poly([[0, 22], [16, 6], [64, 6], [80, 22]], '#c8323a'); p.poly([[4, 22], [18, 9], [62, 9], [76, 22]], '#e04a4a'); p.rect(0, 21, 80, 2, '#8a1e24');
    p.poly([[30, 6], [40, 0], [50, 6]], '#f2c94c');
    var flags = ['#f2c94c', '#2a7ab8', '#2a9d8f', '#ffffff', '#e86a8a'];
    for (var i = 0; i < 13; i++) { var fx = 4 + i * 6; p.poly([[fx, 24], [fx + 4, 24], [fx + 2, 28]], flags[i % flags.length]); }
    p.line(2, 24, 78, 24, '#f5f0e1');
    p.rect(28, 12, 24, 7, '#f5f0e1'); p.rect(28, 12, 24, 1, '#c8323a');
    [[31, 15], [35, 15], [39, 15], [43, 15], [47, 15]].forEach(function (c, k) { p.rect(c[0], c[1] - 1, 2, 3, ['#c8323a', '#2a7ab8', '#2a9d8f', '#c8323a', '#e9b949'][k]); });
    p.ell(16, 36, 5, 4, '#c8323a'); p.ell(16, 36, 3.4, 2.4, '#f2c94c'); p.line(16, 31, 16, 42, '#5a3a20');   // a wau on display
    p.disc(64, 38, 3.4, '#8a5a2b'); p.disc(64, 38, 2, '#c99a5e'); p.px(64, 34, '#5a3a20');                   // a gasing on display
  }
  function drawBatuAngkat(p) {   // 32x20
    p.rect(4, 14, 24, 5, '#7a5030'); p.rect(4, 14, 24, 1, '#9a6a40'); p.rect(6, 18, 3, 2, '#5a3a20'); p.rect(23, 18, 3, 2, '#5a3a20');
    p.ell(16, 9, 9, 7, '#8d867a'); p.ell(15, 7.6, 7, 5, '#a8a296'); p.ell(12, 5, 2.4, 1.4, '#c8c2b6');
    p.line(7, 10, 25, 10, '#c9a46a'); p.px(16, 10, '#8a6a3a');
  }
  function drawChest(p, big) {
    var w = big ? 20 : 16, h = big ? 18 : 16, A = big ? '#6b3a22' : '#a8743e', B = big ? '#4a2414' : '#8a5a2b', M = big ? '#e9c46a' : '#5a3a20';
    p.rect(1, h - 4, w - 2, 3, 'rgba(30,20,12,0.3)');
    p.rect(1, 6, w - 2, h - 8, A); p.rect(1, 3, w - 2, 4, B); p.rect(1, 3, w - 2, 1, big ? '#8a4a2a' : '#c99a5e');
    p.rect(1, 7, w - 2, 1, M); p.rect(Math.floor(w / 2) - 1, 6, 3, 4, M); p.px(Math.floor(w / 2), 8, '#1a1a1a');
    if (big) { for (var x = 3; x < w - 3; x += 4) { p.px(x, 11, M); p.px(x + 1, 12, M); p.px(x, 13, M); } p.rect(1, 3, 1, h - 5, M); p.rect(w - 2, 3, 1, h - 5, M); }
    else for (var y = 9; y < h - 2; y += 3) p.rect(2, y, w - 4, 1, B);
  }

  // ================================================================== THE BUNIAN VILLAGE
  function drawPintuBunian(p) {   // 32x40 an arch of roots and golden light
    var g = p.ctx.createRadialGradient(16, 22, 1, 16, 22, 14); g.addColorStop(0, 'rgba(255,240,170,0.95)'); g.addColorStop(1, 'rgba(255,220,120,0.1)');
    p.ctx.fillStyle = g; p.ctx.fillRect(4, 8, 24, 30);
    p.line(4, 39, 6, 8, '#5a3a20', 3); p.line(28, 39, 26, 8, '#5a3a20', 3); p.line(6, 8, 16, 2, '#6b4a2a', 3); p.line(26, 8, 16, 2, '#6b4a2a', 3);
    p.line(3, 30, 8, 22, '#4a3018', 2); p.line(29, 28, 24, 18, '#4a3018', 2);
    [[6, 10], [10, 4], [22, 4], [26, 12], [4, 20], [28, 24]].forEach(function (c) { p.disc(c[0], c[1], 2, '#4f9a3a'); p.px(c[0], c[1] - 1, '#9be15d'); });
    [[12, 16], [20, 26], [15, 32], [18, 12]].forEach(function (c) { p.px(c[0], c[1], '#ffffff'); });
  }
  function drawRumahBunian(p) {   // 64x72 a gilded stilt house
    p.rect(2, 66, 60, 5, 'rgba(30,20,12,0.3)');
    [8, 20, 42, 54].forEach(function (x) { p.rect(x, 50, 3, 20, '#5a3720'); });
    p.rect(14, 56, 14, 3, '#8a5a2b'); for (var s = 0; s < 4; s++) p.rect(26 + s * 2, 58 + s * 3, 6, 1, '#8a5a2b');
    p.rect(4, 30, 56, 22, '#3f7a4a'); for (var x = 4; x < 60; x += 4) p.rect(x, 30, 1, 22, '#2f6a3a'); p.rect(4, 50, 56, 2, '#e9c46a');
    [[10, 36], [44, 36]].forEach(function (w) { p.rect(w[0], w[1], 10, 9, '#ffe8a0'); p.rect(w[0], w[1], 10, 1, '#e9c46a'); p.rect(w[0] + 4, w[1], 2, 9, '#c4922f'); });
    p.rect(27, 34, 10, 16, '#2a4a30'); p.rect(27, 34, 10, 2, '#e9c46a'); p.px(35, 42, '#ffe8a0');
    p.poly([[0, 32], [10, 8], [54, 8], [64, 32]], '#2a5a3a'); p.poly([[4, 32], [12, 12], [52, 12], [60, 32]], '#3a7a4a');
    for (x = 6; x < 60; x += 4) p.line(x, 32, 32 + (x - 32) * 0.65, 12, '#2f6a3a');
    p.poly([[22, 8], [32, 0], [42, 8]], '#e9c46a'); p.rect(0, 31, 64, 2, '#e9c46a');
    p.line(10, 8, 6, 2, '#e9c46a', 2); p.line(54, 8, 58, 2, '#e9c46a', 2);   // golden gable horns
    p.disc(32, 4, 1.4, '#fff3b0');
  }
  function drawGeraiBunian(p) {   // 48x40
    p.rect(2, 34, 44, 5, 'rgba(30,20,12,0.3)');
    p.rect(4, 12, 2, 26, '#5a3720'); p.rect(42, 12, 2, 26, '#5a3720');
    p.rect(4, 26, 40, 10, '#6b4a2a'); p.rect(4, 26, 40, 2, '#e9c46a');
    [[10, 24, '#ffd166'], [17, 24, '#e86a8a'], [24, 24, '#9be15d'], [31, 24, '#ffd166'], [38, 24, '#b8a8ff']].forEach(function (c) { p.disc(c[0], c[1], 2.4, c[2]); p.px(c[0] - 1, c[1] - 1, '#ffffff'); });
    p.poly([[0, 14], [6, 4], [42, 4], [48, 14]], '#3f9a5a'); for (var x = 2; x < 48; x += 6) p.poly([[x, 14], [x + 3, 17], [x + 6, 14]], '#e9c46a');
    [[10, 18], [24, 18], [38, 18]].forEach(function (c) { p.line(c[0], 14, c[0], c[1] - 2, '#5a3a20'); p.rect(c[0] - 1, c[1] - 2, 3, 3, '#fff0a0'); });
  }
  function drawKerisBatu(p) {   // 32x34 the keris in the stone
    p.rect(2, 28, 28, 5, 'rgba(30,20,12,0.3)');
    p.ell(16, 24, 13, 8, '#6e6a62'); p.ell(15, 22, 11, 6, '#8d867a'); p.speck(4, 18, 24, 12, '#4f8a3a', 18); p.speck(4, 18, 24, 12, '#a8a296', 8);
    for (var y = 6; y < 20; y++) p.px(16 + Math.round(Math.sin(y * 0.9) * 1.2), y, y % 2 ? '#c8ccd8' : '#9aa0b0');   // the seven-waved blade
    p.rect(13, 4, 7, 2, '#c4922f'); p.rect(14, 0, 4, 4, '#6b3a1e'); p.rect(14, 0, 4, 1, '#8a5a2b'); p.px(18, 1, '#e9c46a');
    p.px(15, 9, '#ffffff'); p.px(17, 14, '#ffffff');
  }

  // ================================================================== THE HAUNTED MINE
  function drawLombongPintu(p, shut) {   // 48x44
    p.ell(24, 30, 24, 16, '#3a3036'); p.ell(24, 28, 21, 14, '#4a4048'); p.speck(2, 14, 44, 30, '#2a2228', 30); p.speck(2, 14, 44, 30, '#5a5058', 12);
    p.rect(12, 14, 24, 30, '#0a080c'); p.ell(24, 15, 12, 5, '#0a080c');
    p.rect(10, 12, 4, 32, '#5a3a20'); p.rect(34, 12, 4, 32, '#5a3a20'); p.rect(8, 10, 32, 4, '#6b4423'); p.rect(8, 10, 32, 1, '#8a5a32');
    if (shut) {
      [[16, 30, 20], [20, 18, 26], [24, 24, 22]].forEach(function (b) { p.rect(12, b[0], 24, 3, '#7a5030'); p.rect(12, b[0], 24, 1, '#9a6a40'); });
      p.line(12, 16, 36, 40, '#8a8a92', 2); p.line(36, 16, 12, 40, '#8a8a92', 2); p.disc(24, 28, 2.4, '#6a6a72');
    } else {
      p.px(19, 30, '#ff3a3a'); p.px(22, 30, '#ff3a3a'); p.px(27, 25, '#c040ff'); p.px(30, 25, '#c040ff');   // eyes in the dark
      p.rect(14, 40, 20, 4, '#2a2228');
    }
    p.rect(17, 4, 14, 6, '#8a6a4a'); p.rect(17, 4, 14, 1, '#a8885a'); p.px(20, 7, '#3a1a10'); p.px(24, 6, '#3a1a10'); p.px(28, 7, '#3a1a10');
  }
  function drawKeretaLombong(p) {   // 20x16
    p.poly([[1, 4], [19, 4], [17, 12], [3, 12]], '#6a4a3a'); p.rect(1, 4, 18, 2, '#8a6a4a'); p.speck(2, 6, 16, 6, '#8a4a2a', 10);
    p.ell(10, 4, 7, 2, '#5a5058'); p.speck(4, 2, 12, 3, '#c9a040', 3);
    p.disc(5, 13, 2.4, '#2a2228'); p.disc(15, 13, 2.4, '#2a2228'); p.px(5, 13, '#6a6a72'); p.px(15, 13, '#6a6a72');
  }

  // ================================================================== THE DEEP (ship, palace, Atlantis)
  function drawTempayan(p) { p.ell(8, 12, 6.4, 7, '#3a5a8a'); p.ell(7, 10, 4.6, 5, '#5a7aaa'); p.rect(4, 3, 8, 3, '#2a4a7a'); p.ell(8, 3, 4, 1.4, '#1a2a4a'); p.line(3, 12, 13, 12, '#e8e0c8'); p.speck(3, 6, 10, 12, '#2f8a6a', 6); }
  function drawKemudi(p) { p.disc(9, 9, 8, '#5a3a20'); p.disc(9, 9, 6, '#00000000'); p.ctx.clearRect(4, 4, 10, 10); p.disc(9, 9, 6.6, '#5a3a20'); p.disc(9, 9, 5, '#2a4a50'); p.disc(9, 9, 1.6, '#8a5a2b'); for (var i = 0; i < 8; i++) { var a = i / 8 * Math.PI * 2; p.line(9, 9, 9 + Math.cos(a) * 8.6, 9 + Math.sin(a) * 8.6, '#7a4b28'); } p.rect(8, 17, 2, 5, '#5a3a20'); p.speck(2, 2, 14, 14, '#2f8a6a', 6); }
  function drawCermin(p) { p.rect(1, 1, 12, 22, '#c4922f'); p.rect(2, 2, 10, 20, '#e9c46a'); p.rect(3, 3, 8, 18, '#5a7a8a'); p.line(4, 5, 8, 4, '#a8c8d8'); p.line(4, 9, 6, 7, '#a8c8d8'); p.rect(3, 23, 8, 3, '#8a5a2b'); p.speck(2, 2, 10, 20, '#2f8a6a', 5); }
  function drawIstana(p) {   // 144x96 the Palace of the Southern Sea
    var W = 144;
    p.rect(4, 88, 136, 7, 'rgba(10,30,30,0.3)');
    for (var s = 0; s < 4; s++) p.rect(44 - s * 4, 80 + s * 3, 56 + s * 8, 3, s % 2 ? '#4ab898' : '#6ad8b8');
    p.rect(12, 44, 120, 38, '#2a8a70'); p.rect(12, 44, 120, 3, '#e9c46a'); p.speck(14, 48, 116, 32, '#3aa88a', 40);
    [16, 34, 52, 88, 106, 124].forEach(function (x) { p.rect(x, 46, 4, 36, '#e8f0e8'); p.rect(x, 46, 4, 2, '#e9c46a'); p.rect(x + 3, 46, 1, 36, '#b8c8c0'); });
    p.rect(62, 52, 20, 30, '#0e3a30'); p.ell(72, 52, 10, 7, '#0e3a30'); p.rect(62, 52, 20, 2, '#e9c46a'); p.px(72, 47, '#fffaf0');
    [[26, 58], [44, 58], [98, 58], [116, 58]].forEach(function (w) { p.rect(w[0], w[1], 8, 12, '#b0ffe8'); p.ell(w[0] + 4, w[1], 4, 3, '#b0ffe8'); });
    function roof(y, x0, x1, h, c, c2) { p.poly([[x0, y], [x0 + 10, y - h], [x1 - 10, y - h], [x1, y]], c); p.poly([[x0 + 4, y], [x0 + 12, y - h + 3], [x1 - 12, y - h + 3], [x1 - 4, y]], c2); p.rect(x0, y - 1, x1 - x0, 2, '#e9c46a'); }
    roof(46, 4, 140, 12, '#1e6a58', '#2a8a70'); roof(32, 24, 120, 11, '#1e6a58', '#2f9a7a'); roof(19, 44, 100, 10, '#1e6a58', '#3aa88a');
    p.ell(72, 9, 9, 7, '#f0f8ff'); p.ell(70, 7, 5, 3.6, '#ffffff'); p.rect(71, 0, 2, 3, '#e9c46a');
    [[8, 34], [136, 34], [26, 21], [118, 21]].forEach(function (c) { p.line(c[0], c[1], c[0] + (c[0] < 72 ? -3 : 3), c[1] - 6, '#e9c46a', 2); });
    p.speck(4, 4, W - 8, 80, '#e8607a', 6);
  }
  function drawGuard(p) {   // 16x22 a merman guard in green
    p.poly([[5, 14], [11, 14], [10, 19], [8, 21], [6, 19]], '#2fa880'); p.poly([[8, 20], [4, 22], [12, 22]], '#3fc8a0');
    p.rect(5, 8, 6, 6, '#2a7a5a'); p.rect(5, 8, 6, 1, '#e9c46a'); p.rect(4, 9, 1, 4, '#c48a5c'); p.rect(11, 9, 1, 4, '#c48a5c');
    p.rect(5, 3, 6, 5, '#c48a5c'); p.px(6, 5, '#1a1a1a'); p.px(9, 5, '#1a1a1a'); p.rect(5, 1, 6, 2, '#2a7a5a'); p.px(8, 0, '#e9c46a');
    p.line(13, 22, 13, 1, '#e8607a', 1); p.poly([[11, 3], [13, 0], [15, 3]], '#f08a9a');
    p.outline('#0e3a30');
  }
  function drawLampuUbur(p) { p.rect(5, 10, 2, 16, '#c8d8d0'); p.rect(3, 24, 6, 2, '#a8b8b0'); p.ell(6, 6, 5, 4, 'rgba(180,255,230,0.9)'); p.ell(6, 5, 3, 2, '#ffffff'); for (var i = 0; i < 3; i++) p.line(3 + i * 3, 9, 2 + i * 3, 14, 'rgba(180,255,230,0.7)'); }
  function drawGerbangKidul(p) {   // 32x28 the green-lit arch
    var g = p.ctx.createRadialGradient(16, 18, 1, 16, 18, 12); g.addColorStop(0, 'rgba(160,255,210,0.95)'); g.addColorStop(1, 'rgba(60,200,150,0.1)');
    p.ctx.fillStyle = g; p.ctx.fillRect(5, 6, 22, 22);
    p.line(4, 27, 6, 6, '#e8607a', 3); p.line(28, 27, 26, 6, '#c070d0', 3); p.line(6, 6, 16, 1, '#f0a050', 3); p.line(26, 6, 16, 1, '#60c0b0', 3);
    [[5, 12], [27, 16], [10, 3], [22, 3]].forEach(function (c) { p.disc(c[0], c[1], 2, '#f0d060'); });
  }
  function drawPalung(p) { p.ell(16, 7, 15, 6, '#1a2a3a'); p.ell(16, 7, 12, 4, '#0a1420'); p.ell(16, 7, 7, 2, '#04080e'); p.speck(2, 2, 28, 10, '#3a5a6a', 10); p.px(10, 6, '#7fd8f0'); p.px(22, 8, '#7fd8f0'); }
  function drawKuil(p) {   // 112x96 the temple of Atlantis
    p.rect(4, 88, 104, 7, 'rgba(10,30,40,0.3)');
    for (var s = 0; s < 3; s++) p.rect(8 - s * 2, 78 + s * 4, 96 + s * 4, 4, s % 2 ? '#c0ccd8' : '#dce6ee');
    p.rect(12, 40, 88, 38, '#9aa8b8');
    [14, 28, 42, 64, 78, 92].forEach(function (x) { p.rect(x, 38, 7, 40, '#e8eef4'); p.rect(x + 5, 38, 2, 40, '#c0ccd8'); for (var y = 40; y < 78; y += 4) p.px(x + 2, y, '#d0dae4'); p.rect(x - 1, 36, 9, 3, '#dce6ee'); });
    p.rect(50, 46, 12, 32, '#2a3a4a'); p.ell(56, 46, 6, 4, '#2a3a4a');
    p.rect(6, 30, 100, 7, '#dce6ee'); p.rect(6, 34, 100, 1, '#a8b4c0');
    for (var x = 10; x < 104; x += 8) p.rect(x, 31, 4, 2, '#7ab8d8');
    p.poly([[4, 30], [56, 6], [108, 30]], '#e8eef4'); p.poly([[14, 28], [56, 10], [98, 28]], '#c8d4e0');
    [[44, 24], [56, 18], [68, 24]].forEach(function (c) { p.ell(c[0], c[1], 3, 2, '#7ab8d8'); });   // dolphins in the pediment
    p.rect(55, 0, 2, 8, '#e9c46a'); p.rect(51, 2, 2, 4, '#e9c46a'); p.rect(59, 2, 2, 4, '#e9c46a'); p.rect(51, 5, 10, 1, '#e9c46a');   // golden trident
    p.speck(6, 30, 100, 50, '#5aa86a', 20); p.speck(6, 30, 100, 50, '#e8607a', 6);
  }
  function drawTiang(p, broken) {
    if (broken) { p.rect(3, 6, 10, 14, '#dce6ee'); p.rect(10, 6, 3, 14, '#c0ccd8'); p.poly([[3, 6], [6, 2], [9, 5], [13, 1], [13, 6]], '#dce6ee'); p.rect(1, 18, 14, 2, '#c0ccd8'); p.speck(2, 2, 12, 18, '#5aa86a', 8); return; }
    p.rect(1, 0, 12, 4, '#e8eef4'); p.rect(3, 4, 8, 32, '#e0e8f0'); p.rect(9, 4, 2, 32, '#c0ccd8'); for (var y = 6; y < 36; y += 4) p.px(5, y, '#d0dae4');
    p.rect(1, 36, 12, 4, '#c8d4e0'); p.speck(1, 0, 12, 40, '#5aa86a', 8);
  }
  function drawPatungKuda(p) {   // 30x34 a sea-horse statue
    p.rect(4, 28, 22, 6, '#c0ccd8'); p.rect(4, 28, 22, 1, '#e8eef4');
    p.ell(15, 18, 5, 8, '#dce6ee'); p.ell(18, 8, 4, 4, '#dce6ee'); p.rect(20, 7, 6, 3, '#dce6ee'); p.px(18, 7, '#8a98a8');
    p.line(12, 24, 10, 28, '#c8d4e0', 3); p.line(10, 28, 14, 27, '#c8d4e0', 2);
    for (var y = 10; y < 24; y += 3) p.px(11, y, '#a8b4c0'); p.speck(4, 2, 22, 30, '#5aa86a', 8);
  }
  function drawRumahAtlantis(p) {   // 64x56
    p.rect(2, 50, 60, 5, 'rgba(10,30,40,0.3)');
    p.rect(4, 18, 56, 34, '#dce6ee'); p.rect(4, 18, 56, 3, '#c0ccd8'); p.speck(6, 22, 52, 28, '#c8d4e0', 20);
    p.rect(26, 30, 12, 22, '#3a4a5a'); p.ell(32, 30, 6, 4, '#3a4a5a');
    [[10, 28], [46, 28]].forEach(function (w) { p.rect(w[0], w[1], 8, 10, '#5a7a9a'); p.ell(w[0] + 4, w[1], 4, 3, '#5a7a9a'); });
    p.poly([[0, 20], [32, 4], [64, 20]], '#7ab8d8'); p.poly([[8, 19], [32, 7], [56, 19]], '#5a98b8');
    p.ctx.clearRect(48, 4, 16, 10); p.speck(2, 6, 60, 46, '#5aa86a', 16); p.speck(2, 6, 60, 46, '#e8607a', 5);
  }

  // ================================================================== DECOR AND FORAGE
  var FG = {
    honey: function (p, ok) { p.line(2, 13, 12, 13, '#6b4a2a', 2); if (!ok) { p.ell(7, 8, 2, 3, '#8a6a3a'); return; } p.ell(7, 7, 4, 5.4, '#c9922a'); for (var y = 3; y < 12; y += 2) p.rect(3, y, 8, 1, '#a8701a'); p.px(6, 5, '#ffe08a'); p.px(11, 3, '#2a2018'); p.px(12, 5, '#2a2018'); p.px(1, 6, '#2a2018'); },
    goldvein: function (p, ok) { p.ell(8, 9, 7.6, 6.4, '#2a2230'); p.ell(8, 8, 6.4, 5, '#3a3040'); if (ok) { [[5, 6], [9, 5], [11, 9], [6, 10], [8, 8]].forEach(function (c) { p.px(c[0], c[1], '#f2c94c'); p.px(c[0] + 1, c[1], '#c9a040'); }); p.px(9, 5, '#fff3b0'); } else p.speck(3, 4, 10, 8, '#5a4a3a', 4); },
    crystal: function (p, ok) { p.ell(7, 13, 6, 2, '#2a2230'); if (!ok) { p.poly([[5, 13], [6, 10], [7, 13]], '#6a4a8a'); return; } [[4, 13, 3, 6], [7, 13, 7, 1], [10, 13, 11, 5]].forEach(function (c, k) { p.poly([[c[0] - 2, c[1]], [c[2], c[3]], [c[0] + 2, c[1]]], k === 1 ? '#c080ff' : '#9a60d8'); p.line(c[0], c[1] - 1, c[2], c[3] + 1, '#e8c8ff'); }); },
    goldchest: function (p, ok) { p.rect(1, 5, 16, 9, '#3a3a42'); p.rect(1, 5, 16, 2, '#5a5a62'); p.rect(1, 9, 16, 1, '#8a8a92'); p.rect(4, 5, 1, 9, '#8a8a92'); p.rect(13, 5, 1, 9, '#8a8a92'); p.rect(8, 8, 2, 3, '#c9a040'); if (ok) { p.px(6, 4, '#ffe060'); p.px(11, 3, '#fff8c0'); } else p.rect(1, 2, 16, 3, '#22222a'); },
    amphora: function (p, ok) { if (!ok) { p.ell(6, 15, 5, 2, '#a8643a'); p.px(4, 14, '#c8844a'); return; } p.ell(6, 11, 4.4, 6, '#c8743a'); p.rect(4, 2, 4, 4, '#b8642a'); p.rect(2, 3, 2, 4, '#a8541a'); p.rect(8, 3, 2, 4, '#a8541a'); p.ell(6, 11, 3, 1, '#1a1a1a'); p.px(4, 11, '#e8d8c8'); p.px(8, 11, '#e8d8c8'); p.speck(2, 6, 8, 10, '#5aa86a', 4); }
  };
  var FG_SIZE = { honey: [14, 14], goldvein: [16, 16], crystal: [14, 16], goldchest: [18, 15], amphora: [12, 18] };

  // ================================================================== ANIMALS
  function drawSerama(p, f) {   // 13x13: tiny, upright, chest out, tail up
    var B = '#1a1a22', R = '#c8322a', G = '#2a6a5a';
    p.poly([[1, 1], [3, 6], [5, 2]], G); p.poly([[2, 0], [4, 6], [6, 1]], B);
    p.ell(6, 7, 3, 3.4, R); p.ell(7, 8, 2.4, 2.6, B); p.px(5, 6, '#e8603a');
    var hy = f === 1 ? 5 : 2;
    p.disc(9, hy, 1.8, R); p.px(9, hy - 2, '#ff3a3a'); p.px(10, hy - 2, '#ff3a3a'); p.px(11, hy, '#f2c14e'); p.px(9, hy, '#1a1a1a'); p.px(10, hy + 2, '#ff3a3a');
    var lx = f === 2 ? [5, 8] : [6, 8]; p.rect(lx[0], 10, 1, 3, '#e2b13c'); p.rect(lx[1], 10, 1, 3, '#e2b13c');
    p.outline(OUT);
  }
  function drawItik(p, f) {   // 14x13 white duck
    p.ell(6, 8, 5, 3, '#f5f5f0'); p.ell(5, 8, 3, 1.8, '#dcdcd4'); p.px(1, 6, '#f5f5f0');
    var hy = f === 1 ? 7 : 4, hx = f === 1 ? 11 : 10;
    p.disc(hx, hy, 2, '#f5f5f0'); p.rect(hx + 1, hy, 3, 1, '#f0a020'); p.rect(hx + 1, hy + 1, 2, 1, '#d88a10'); p.px(hx, hy - 1, '#1a1a1a');
    var lx = f === 2 ? [4, 7] : [5, 7]; p.rect(lx[0], 11, 2, 1, '#f0a020'); p.rect(lx[1], 11, 2, 1, '#f0a020');
    p.outline(OUT);
  }
  function drawKambing(p, f) {   // 20x16 goat
    var B = '#a8743e', W = '#f0e8d8';
    var legs = f ? [4, 6, 13, 15] : [5, 5, 14, 14];
    legs.forEach(function (x) { p.rect(x, 10, 2, 5, '#6b4423'); });
    p.ell(10, 8, 7, 3.6, B); p.ell(9, 9, 5, 2, W); p.px(3, 6, B); p.px(2, 5, B);
    p.ell(17, 5, 2.6, 2.4, B); p.rect(18, 6, 2, 2, W); p.px(18, 4, '#1a1a1a'); p.line(16, 3, 14, 0, '#d8cfbf'); p.line(18, 3, 19, 0, '#d8cfbf'); p.px(19, 9, W);
    p.outline(OUT);
  }
  function drawAnak(p, f) { p.ell(4, 5, 3, 2.4, '#f8d850'); p.disc(6, f ? 4 : 3, 1.8, '#f8e070'); p.px(6, f ? 4 : 3, '#1a1a1a'); p.px(8, f ? 4 : 3, '#f0a020'); p.px(3, 7, '#e2b13c'); p.px(5, 7, '#e2b13c'); p.outline('#5a4a1a'); }

  // ================================================================== SHADOWS OF THE MINE
  function drawKelawar(p, f) {   // 16x10 bat
    p.ell(8, 5, 2.4, 2.6, '#2a1a30');
    if (f) { p.poly([[6, 5], [0, 1], [2, 6], [5, 7]], '#3a2440'); p.poly([[10, 5], [16, 1], [14, 6], [11, 7]], '#3a2440'); }
    else { p.poly([[6, 5], [0, 8], [3, 9], [6, 7]], '#3a2440'); p.poly([[10, 5], [16, 8], [13, 9], [10, 7]], '#3a2440'); }
    p.px(7, 4, '#ff3a3a'); p.px(9, 4, '#ff3a3a'); p.px(7, 2, '#2a1a30'); p.px(9, 2, '#2a1a30');
  }
  function drawBayang(p, f) {   // 14x18 a shadow wisp
    p.ell(7, 7, 5.6, 6, 'rgba(20,10,30,0.92)'); p.rect(2, 7, 11, 6, 'rgba(20,10,30,0.92)');
    for (var x = 2; x < 13; x += 3) p.poly([[x, 12], [x + 1.5, f ? 17 : 15], [x + 3, 12]], 'rgba(20,10,30,0.85)');
    p.ell(7, 6, 4, 4, 'rgba(60,30,80,0.6)');
    p.rect(4, 6, 2, 2, '#ff3a5a'); p.rect(8, 6, 2, 2, '#ff3a5a'); p.px(4, 6, '#ffb0c0'); p.px(8, 6, '#ffb0c0');
  }
  function drawLipan(p, f) {   // 26x9 giant centipede
    for (var i = 0; i < 7; i++) {
      var x = 3 + i * 3.2, y = 4 + Math.sin(i * 1.2 + f * 1.5) * 1;
      p.disc(x, y, 2.2, i % 2 ? '#8a3a1a' : '#a84a22');
      p.line(x, y + 1, x - 1 + (f ? 1 : 0), 8, '#e8a040'); p.line(x, y - 1, x - 1 + (f ? 0 : 1), 0, '#e8a040');
    }
    p.disc(24, 4, 2.4, '#6a2a12'); p.px(25, 3, '#ffe060'); p.line(25, 2, 26, 0, '#e8a040'); p.line(25, 6, 26, 8, '#e8a040');
    p.outline('#2a0a04');
  }
  function drawPenunggu(p, f) {   // 30x32 the stone guardian of the mine
    var S = '#4a4048', S2 = '#5a5058', C = '#ff5a2a';
    p.rect(8 + (f ? 1 : 0), 24, 5, 8, S); p.rect(17 - (f ? 1 : 0), 24, 5, 8, S);
    p.ell(15, 17, 11, 9, S); p.ell(14, 15, 9, 7, S2);
    p.ell(15, 6, 7, 6, S); p.ell(14, 5, 5.4, 4.4, S2);
    p.rect(1, 14 + (f ? 1 : 0), 5, 10, S); p.rect(24, 14 - (f ? 1 : 0), 5, 10, S);
    p.line(10, 12, 13, 20, C); p.line(19, 14, 17, 22, C); p.line(14, 18, 20, 19, C);
    p.rect(11, 5, 2, 2, '#ffd040'); p.rect(17, 5, 2, 2, '#ffd040');
    p.speck(4, 4, 22, 24, '#3a3036', 14); p.speck(4, 4, 22, 24, '#c9a040', 4);
    p.outline('#14101a');
  }

  // ================================================================== DEEP-SEA FOLK (portrait-friendly)
  function drawTanggang(p, blink) {   // 16x22 the ghost of a proud captain
    var A = 'rgba(170,220,255,0.82)', A2 = 'rgba(120,180,230,0.8)';
    p.poly([[3, 12], [13, 12], [13, 18], [11, 21], [9, 18], [7, 21], [5, 18], [3, 21]], A2);
    p.rect(3, 9, 10, 4, A); p.rect(7, 9, 2, 5, 'rgba(240,220,150,0.8)');
    p.rect(5, 3, 6, 6, 'rgba(210,235,255,0.88)');
    if (blink) { p.rect(6, 5, 2, 1, '#2a4a6a'); p.rect(9, 5, 2, 1, '#2a4a6a'); } else { p.px(7, 5, '#2a4a6a'); p.px(9, 5, '#2a4a6a'); p.px(7, 6, '#8fd3ff'); }
    p.px(7, 8, '#4a6a8a'); p.px(8, 8, '#4a6a8a');
    p.rect(3, 1, 10, 2, 'rgba(60,90,140,0.9)'); p.rect(5, 0, 6, 1, 'rgba(60,90,140,0.9)'); p.px(8, 1, 'rgba(240,220,150,0.95)');
    p.outline('#5a8ab8');
  }
  function drawRatu(p, blink) {   // 20x26 the Queen of the Southern Sea
    p.poly([[4, 13], [16, 13], [18, 25], [2, 25]], '#1e8a5a'); p.poly([[6, 15], [14, 15], [15, 25], [5, 25]], '#2aa86a');
    for (var y = 17; y < 25; y += 3) { p.px(7, y, '#e9c46a'); p.px(10, y + 1, '#e9c46a'); p.px(13, y, '#e9c46a'); }
    p.rect(5, 9, 10, 5, '#2aa86a'); p.rect(5, 9, 10, 1, '#e9c46a'); p.rect(3, 10, 2, 5, '#d6a77a'); p.rect(15, 10, 2, 5, '#d6a77a');
    p.rect(1, 4, 3, 16, '#1a1210'); p.rect(16, 4, 3, 16, '#1a1210');
    p.rect(6, 3, 8, 6, '#d6a77a');
    if (blink) { p.rect(7, 5, 2, 1, '#2a1a10'); p.rect(11, 5, 2, 1, '#2a1a10'); } else { p.px(8, 5, '#2a1a10'); p.px(11, 5, '#2a1a10'); }
    p.px(9, 7, '#b84a4a'); p.px(10, 7, '#b84a4a');
    p.rect(5, 1, 10, 2, '#1a1210'); p.rect(5, 0, 10, 2, '#e9c46a'); [6, 9, 12].forEach(function (x) { p.rect(x, -1, 2, 2, '#f2d06b'); }); p.px(10, 0, '#7affc8');
    p.outline('#0e3a30');
  }
  function drawSekar(p, blink) {   // 16x22
    p.rect(3, 12, 10, 10, '#3fb07a'); p.rect(3, 15, 10, 1, '#e9c46a'); p.rect(3, 19, 10, 1, '#e9c46a');
    p.rect(4, 8, 8, 5, '#2a8a5a'); p.rect(3, 9, 1, 4, '#d6a77a'); p.rect(12, 9, 1, 4, '#d6a77a');
    p.rect(5, 3, 6, 5, '#d6a77a'); if (blink) { p.rect(6, 5, 2, 1, '#2a1a10'); p.rect(9, 5, 2, 1, '#2a1a10'); } else { p.px(6, 5, '#2a1a10'); p.px(9, 5, '#2a1a10'); }
    p.rect(4, 1, 8, 3, '#1a1210'); p.rect(3, 3, 2, 7, '#1a1210'); p.rect(11, 3, 2, 7, '#1a1210'); p.px(12, 2, '#ff9ab0'); p.px(11, 1, '#ffffff');
    p.outline('#0e3a30');
  }
  function drawPoseidon(p, blink) {   // 24x32 the sea king
    p.line(21, 31, 21, 2, '#e9c46a', 1); p.rect(18, 1, 7, 1, '#e9c46a'); p.rect(18, 0, 1, 3, '#e9c46a'); p.rect(24, 0, 1, 3, '#e9c46a'); p.rect(21, 0, 1, 2, '#f2d06b');
    p.poly([[3, 16], [19, 16], [20, 31], [2, 31]], '#2a6a9a'); p.poly([[5, 18], [17, 18], [17, 31], [5, 31]], '#3a8aba'); p.line(6, 18, 16, 30, '#e9c46a');
    p.rect(4, 11, 14, 6, '#c8946a'); p.rect(4, 11, 3, 6, '#2a6a9a'); p.rect(18, 12, 3, 4, '#c8946a'); p.rect(1, 12, 3, 5, '#c8946a');
    p.rect(7, 3, 9, 7, '#c8946a');
    if (blink) { p.rect(8, 6, 2, 1, '#1a2a3a'); p.rect(13, 6, 2, 1, '#1a2a3a'); } else { p.px(9, 6, '#1a2a3a'); p.px(13, 6, '#1a2a3a'); }
    p.poly([[6, 8], [17, 8], [15, 16], [11, 19], [8, 16]], '#f0f0f5'); p.px(11, 9, '#a84a4a'); p.px(12, 9, '#a84a4a');
    p.rect(6, 2, 11, 2, '#f0f0f5'); p.rect(6, 0, 11, 2, '#e9c46a'); [7, 10, 13, 16].forEach(function (x) { p.px(x, -0, '#f2d06b'); });
    p.outline('#0e1e2e');
  }
  function drawNerissa(p, blink) {   // 18x24 an Atlantean scholar (a mermaid)
    p.poly([[5, 13], [13, 13], [12, 19], [9, 22], [6, 19]], '#5a6ad8'); p.poly([[9, 21], [4, 24], [14, 24]], '#7a8af0'); p.speck(5, 13, 8, 8, '#b8c8ff', 6);
    p.rect(5, 8, 8, 5, '#f0f0e8'); p.rect(4, 9, 1, 4, '#e2b48a'); p.rect(13, 9, 1, 4, '#e2b48a');
    p.rect(13, 10, 4, 3, '#e8dcb0'); p.rect(13, 10, 1, 3, '#c8b890');   // a scroll
    p.rect(5, 2, 8, 6, '#e2b48a'); if (blink) { p.rect(6, 5, 2, 1, '#2a1a10'); p.rect(10, 5, 2, 1, '#2a1a10'); } else { p.px(7, 5, '#2a1a10'); p.px(10, 5, '#2a1a10'); }
    p.rect(4, 1, 10, 2, '#c8a040'); p.rect(3, 2, 2, 9, '#c8a040'); p.rect(13, 2, 2, 7, '#c8a040'); p.px(9, 1, '#7fd8f0');
    p.outline('#1a2a5a');
  }

  // ================================================================== ICONS (16x16)
  var IC = {};
  function packet(col, mark) { return function (p) { p.rect(3, 2, 10, 13, '#e8dcc0'); p.rect(3, 2, 10, 3, col); p.rect(3, 14, 10, 1, '#c8b890'); mark(p); p.px(12, 3, '#ffffff'); }; }
  IC.seed_jagung = packet('#e9b949', function (p) { p.ell(8, 10, 2, 3.4, '#f2d06b'); p.line(6, 13, 8, 7, '#4f9a3a'); });
  IC.seed_tembikai = packet('#3a8a3a', function (p) { p.ell(8, 10, 3.6, 3, '#3a8a3a'); p.line(6, 8, 6, 12, '#2a6a2a'); p.line(9, 7, 9, 13, '#2a6a2a'); });
  IC.seed_kangkung = packet('#6cbf4a', function (p) { p.poly([[5, 12], [8, 6], [11, 12]], '#6cbf4a'); p.line(8, 13, 8, 8, '#8fc06a'); });
  IC.seed_nanas = packet('#e8a030', function (p) { p.ell(8, 11, 2.6, 3, '#e8a030'); p.line(8, 8, 6, 6, '#4a9a4a'); p.line(8, 8, 10, 6, '#4a9a4a'); });
  IC.jagung = function (p) { p.ell(8, 8, 3.4, 6, '#f2d06b'); for (var y = 4; y < 13; y += 2) for (var x = 6; x < 11; x += 2) p.px(x, y, '#e8b830'); p.poly([[3, 15], [6, 4], [8, 14]], '#5aa83e'); p.poly([[13, 15], [10, 4], [8, 14]], '#4f9a3a'); p.px(8, 1, '#c8a060'); };
  IC.tembikai = function (p) { p.ell(8, 9, 7, 5.4, '#3a8a3a'); for (var x = 3; x < 14; x += 3) p.line(x, 4, x - 1, 14, '#2a6a2a'); p.ell(6, 7, 2.6, 1.4, '#7ac06a'); p.rect(8, 3, 1, 2, '#6b4423'); };
  IC.kangkung = function (p) { for (var i = 0; i < 4; i++) { p.line(8, 15, 3 + i * 3, 4, '#8fc06a'); p.poly([[1 + i * 3, 6], [3 + i * 3, 2], [5 + i * 3, 6]], i % 2 ? '#6cbf4a' : '#4f9a3a'); } p.rect(6, 12, 4, 2, '#c9a46a'); };
  IC.nanas = function (p) { p.ell(8, 10, 4, 5, '#e8a030'); for (var y = 6; y < 15; y += 2) p.line(4, y, 12, y + 1, '#b8701a'); p.speck(5, 6, 7, 8, '#ffd060', 5); [[8, 1], [5, 2], [11, 2], [6, 4], [10, 4]].forEach(function (c) { p.line(8, 5, c[0], c[1], '#4a9a4a'); }); };
  IC.rambutan = function (p) { [[6, 9], [10, 8]].forEach(function (c) { p.disc(c[0], c[1], 3.4, '#d62828'); for (var i = 0; i < 8; i++) { var a = i / 8 * Math.PI * 2; p.px(c[0] + Math.cos(a) * 4, c[1] + Math.sin(a) * 4, '#ff6b6b'); } }); p.disc(10, 12, 2, '#f5f0e6'); p.line(8, 3, 9, 6, '#5a3a20'); };
  IC.manggis = function (p) { p.disc(8, 9, 5.6, '#5a1a4a'); p.disc(7, 8, 3.6, '#7a2a6a'); p.ell(8, 4, 3.4, 1.4, '#4a8a3a'); p.px(8, 2, '#5a3a20'); p.px(6, 7, '#a85a9a'); };
  IC.duku = function (p) { [[5, 7], [10, 6], [7, 11], [12, 11], [9, 9]].forEach(function (c) { p.disc(c[0], c[1], 2.4, '#d8b878'); p.px(c[0] - 1, c[1] - 1, '#f0d8a0'); }); p.line(8, 2, 9, 6, '#5a3a20'); };
  IC.cempedak = function (p) { p.ell(8, 9, 4.6, 6.4, '#a8a840'); p.ell(7, 8, 3, 4.4, '#c8c860'); p.speck(4, 4, 9, 11, '#7a7a2a', 8); p.rect(8, 1, 1, 3, '#5a3a20'); };
  IC.telur = function (p) { p.ell(8, 9, 4.6, 6, '#f0e0c8'); p.ell(7, 7, 2.4, 3, '#fffaf0'); p.px(6, 5, '#ffffff'); };
  IC.telur_itik = function (p) { p.ell(8, 9, 5.2, 6.4, '#d8e8e0'); p.ell(7, 7, 2.6, 3.4, '#f0faf4'); p.speck(4, 4, 8, 10, '#b8c8c0', 4); };
  IC.susu = function (p) { p.rect(5, 4, 6, 11, '#f5f5f0'); p.rect(5, 4, 6, 2, '#d8d8d0'); p.rect(6, 1, 4, 3, '#e8e8e0'); p.rect(5, 8, 6, 4, '#a8743e'); p.px(7, 9, '#f5f5f0'); p.px(8, 10, '#f5f5f0'); };
  IC.dedak = function (p) { p.poly([[3, 6], [13, 6], [12, 15], [4, 15]], '#c9a46a'); p.rect(3, 5, 10, 2, '#a8843e'); p.speck(4, 7, 8, 7, '#a8843e', 8); p.ell(8, 5, 4, 1.4, '#e0c890'); p.speck(4, 3, 8, 3, '#d8b878', 6); };
  IC.sikat = function (p) { p.rect(2, 6, 9, 5, '#a8743e'); p.rect(2, 6, 9, 1, '#c99a5e'); for (var x = 3; x < 11; x += 2) p.rect(x, 11, 1, 3, '#e8dcc0'); p.rect(11, 7, 4, 2, '#8a5a2b'); };
  IC.baja = function (p) { p.poly([[3, 4], [13, 4], [14, 15], [2, 15]], '#5a8a3a'); p.rect(3, 4, 10, 2, '#3a6a2a'); p.ell(8, 10, 3, 2.4, '#6b4423'); p.line(8, 8, 8, 5, '#9be15d'); p.px(7, 6, '#9be15d'); p.px(9, 6, '#9be15d'); };
  IC.daging_ayam = function (p) { p.ell(7, 9, 5, 4.4, '#f0b8a0'); p.ell(6, 8, 3.4, 2.6, '#f8d0c0'); p.line(11, 11, 14, 14, '#f5f0e6', 2); p.disc(14, 14, 1.4, '#f5f0e6'); };
  IC.peti_kayu = function (p) { drawChest(p, false); };
  IC.peti_ukir = function (p) { p.ctx.save(); p.ctx.scale(0.8, 0.85); drawChest(p, true); p.ctx.restore(); };
  function bowl(p, top, top2) { p.ell(8, 8, 5.6, 2.4, top); if (top2) p.speck(4, 6, 8, 4, top2, 6); p.ell(8, 11, 6.5, 3.5, '#e9eef5'); p.rect(2, 9, 13, 2, '#e9eef5'); p.rect(2, 11, 13, 1, '#4a78b8'); }
  function plate(p) { p.ell(8, 11, 7, 3.4, '#e9e4d8'); p.ell(8, 11, 5.6, 2.4, '#f5f0e8'); }
  IC.telur_dadar = function (p) { plate(p); p.ell(8, 10, 5, 2.4, '#f2d06b'); p.speck(4, 9, 8, 3, '#d62828', 3); p.speck(4, 9, 8, 3, '#5aa83e', 3); };
  IC.nasi_goreng = function (p) { plate(p); p.ell(8, 9, 5, 3, '#d8a050'); p.speck(4, 7, 8, 4, '#b87830', 8); p.ell(10, 8, 2, 1.4, '#ffffff'); p.disc(10, 8, 0.8, '#f2b830'); p.px(5, 8, '#d62828'); };
  IC.ayam_goreng = function (p) { plate(p); p.ell(7, 9, 4, 3, '#c8782a'); p.speck(4, 7, 6, 4, '#e8a040', 8); p.line(10, 10, 13, 7, '#f5f0e6', 2); p.px(12, 11, '#5aa83e'); };
  IC.kuih_bahulu = function (p) { [[5, 9], [11, 9], [8, 6]].forEach(function (c) { p.disc(c[0], c[1], 3, '#e8a838'); p.disc(c[0], c[1] - 0.6, 2, '#f8c860'); p.px(c[0], c[1] - 1, '#fff0b0'); }); p.ell(8, 13, 7, 1.6, '#e9e4d8'); };
  IC.telur_masin = function (p) { p.ell(6, 9, 4, 5, '#4a4a4a'); p.ell(11, 9, 4, 5, '#e8e8e0'); p.disc(11, 10, 2, '#f0a020'); p.ell(11, 7, 2, 1.4, '#ffffff'); };
  IC.teh_tarik = function (p) { p.rect(4, 5, 8, 9, '#f5f0e6'); p.rect(5, 6, 6, 3, '#c89a6a'); p.ell(8, 6, 3, 1, '#f0e0c8'); p.rect(12, 7, 2, 4, '#f5f0e6'); p.line(6, 1, 8, 5, '#c89a6a'); p.line(9, 0, 9, 4, '#c89a6a'); };
  IC.jagung_rebus = function (p) { plate(p); p.ell(8, 9, 5, 2.4, '#f2d06b'); for (var x = 4; x < 13; x += 2) p.px(x, 9, '#e8b830'); p.rect(11, 7, 2, 2, '#fff0b0'); };
  IC.jus_tembikai = function (p) { p.poly([[4, 3], [12, 3], [11, 15], [5, 15]], '#ff6b7a'); p.rect(4, 3, 8, 2, '#ffd0d8'); p.line(10, 0, 9, 7, '#3fb07a'); p.poly([[10, 2], [14, 1], [13, 4]], '#3a8a3a'); p.speck(5, 6, 6, 8, '#1a1a1a', 3); };
  IC.rojak = function (p) { bowl(p, '#7a3a1a', '#f2d06b'); p.px(6, 7, '#d62828'); p.px(10, 7, '#5aa83e'); p.px(8, 6, '#f5f0e6'); };
  IC.cempedak_goreng = function (p) { plate(p); [[5, 9], [9, 8], [11, 11]].forEach(function (c) { p.ell(c[0], c[1], 2.6, 1.8, '#d9962e'); p.px(c[0], c[1] - 1, '#f2c96a'); }); };
  IC.kangkung_belacan = function (p) { plate(p); for (var i = 0; i < 6; i++) p.line(4 + i * 1.6, 11, 5 + i * 1.4, 7, i % 2 ? '#3f8a3a' : '#5aa86a'); p.px(6, 9, '#d62828'); p.px(10, 8, '#d62828'); p.speck(4, 8, 8, 3, '#7a3a1a', 3); };
  IC.ais_kacang = function (p) { p.ell(8, 13, 6, 2, '#e9eef5'); p.poly([[3, 12], [8, 2], [13, 12]], '#f8f8ff'); p.poly([[5, 9], [8, 4], [11, 9]], '#ff8aa8'); p.px(6, 10, '#2a9d4a'); p.px(10, 10, '#f2d06b'); p.px(8, 7, '#8a2a2a'); };
  IC.wau = function (p) { p.ell(8, 4, 7, 3, '#c8323a'); p.ell(8, 4, 5, 1.6, '#f2c94c'); p.poly([[2, 7], [8, 6], [14, 7], [8, 15]], '#c8323a'); p.poly([[5, 8], [8, 7.5], [11, 8], [8, 12]], '#2a7ab8'); p.line(8, 0, 8, 15, '#5a3a20'); };
  IC.wau_bulan = function (p) { p.ell(8, 4, 7.4, 3.4, '#2a9d8f'); p.ell(8, 4, 5.4, 1.8, '#f5f0e6'); p.poly([[1, 8], [8, 6], [15, 8], [8, 15]], '#2a9d8f'); p.ell(8, 13, 5, 2.4, '#e9b949'); p.ctx.clearRect(5, 13, 6, 3); p.line(8, 0, 8, 15, '#5a3a20'); p.px(8, 9, '#e9b949'); };
  IC.gasing = function (p) { p.ell(8, 8, 6, 3.4, '#8a5a2b'); p.ell(8, 7, 5, 2.4, '#c99a5e'); p.poly([[3, 9], [8, 15], [13, 9]], '#8a5a2b'); p.rect(7, 2, 2, 4, '#5a3a20'); p.line(9, 3, 14, 1, '#e8dcc0'); };
  IC.gasing_uri = function (p) { p.ell(8, 8, 7, 3.6, '#4a2414'); p.ell(8, 7, 6, 2.6, '#8a4a2a'); p.ell(8, 7, 6, 0.6, '#e9c46a'); p.poly([[2, 9], [8, 15], [14, 9]], '#4a2414'); p.rect(7, 2, 2, 4, '#2a1a10'); };
  function cup(p, mark) { p.rect(4, 13, 8, 2, '#8a8a92'); p.rect(6, 10, 4, 3, '#b8b8c0'); p.poly([[2, 2], [14, 2], [11, 10], [5, 10]], '#d8d8e0'); p.rect(2, 2, 12, 1, '#f0f0f5'); p.line(2, 3, 0, 6, '#b8b8c0'); p.line(14, 3, 16, 6, '#b8b8c0'); mark(p); }
  IC.piala_wau = function (p) { cup(p, function (p) { p.ell(8, 5, 3, 1.4, '#c8323a'); p.poly([[6, 6], [8, 5], [10, 6], [8, 9]], '#c8323a'); }); };
  IC.piala_gasing = function (p) { cup(p, function (p) { p.ell(8, 5, 3, 1.6, '#8a5a2b'); p.poly([[5, 6], [8, 9], [11, 6]], '#8a5a2b'); }); };
  IC.piala_serama = function (p) { cup(p, function (p) { p.disc(8, 6, 2, '#c8322a'); p.px(9, 3, '#ff3a3a'); p.poly([[5, 3], [6, 7], [7, 4]], '#1a1a22'); }); };
  IC.tongkat = function (p) { p.line(3, 15, 13, 1, '#c9a46a', 2); p.line(4, 15, 14, 1, '#9a7a3a'); [[5, 12], [8, 8], [11, 4]].forEach(function (c) { p.px(c[0], c[1], '#6b4423'); p.px(c[0] + 1, c[1], '#6b4423'); }); };
  IC.parang = function (p) { p.poly([[5, 11], [13, 1], [15, 3], [8, 13]], '#c8ccd8'); p.line(6, 11, 14, 2, '#f0f0f5'); p.rect(2, 11, 5, 3, '#5a3a20'); p.rect(2, 11, 5, 1, '#8a5a2b'); p.px(1, 13, '#3a2414'); };
  IC.keris = function (p) { for (var y = 1; y < 12; y++) p.px(8 + Math.round(Math.sin(y * 0.9) * 1.2), y, y % 2 ? '#d8dce8' : '#a8aec0'); p.rect(5, 11, 7, 2, '#c4922f'); p.rect(7, 13, 3, 3, '#6b3a1e'); p.px(9, 14, '#e9c46a'); p.px(8, 4, '#ffffff'); };
  IC.cermin_mata = function (p) { p.disc(4.5, 8, 3.4, '#e9c46a'); p.disc(4.5, 8, 2.4, '#bff2c8'); p.disc(11.5, 8, 3.4, '#e9c46a'); p.disc(11.5, 8, 2.4, '#bff2c8'); p.rect(7, 7, 2, 1, '#e9c46a'); p.px(3, 7, '#ffffff'); p.px(10, 7, '#ffffff'); p.line(1, 7, 0, 4, '#c4922f'); p.line(15, 7, 16, 4, '#c4922f'); };
  IC.madu_tualang = function (p) { p.rect(4, 5, 8, 10, '#c9822a'); p.rect(4, 5, 8, 2, '#e8a840'); p.rect(5, 3, 6, 2, '#6b4423'); p.rect(4, 9, 8, 3, '#f5f0e1'); p.px(7, 10, '#e8a020'); p.px(9, 10, '#2a2018'); };
  IC.jamu_kuat = function (p) { p.rect(5, 4, 6, 11, '#7a2a1a'); p.rect(5, 4, 6, 2, '#a83a22'); p.rect(6, 2, 4, 2, '#2a1a10'); p.rect(6, 8, 4, 4, '#f5f0e1'); p.line(7, 11, 7, 9, '#c8322a'); p.line(9, 11, 9, 9, '#c8322a'); p.rect(7, 9, 3, 1, '#c8322a'); };
  IC.pelita_bunian = function (p) { p.ell(8, 12, 5, 2.4, '#c4922f'); p.ell(8, 11, 4, 1.6, '#e9c46a'); p.disc(8, 7, 3, '#fff3b0'); p.disc(8, 7, 1.6, '#ffffff'); p.rect(7, 3, 2, 2, '#ffd166'); p.px(3, 5, '#fff3b0'); p.px(13, 6, '#fff3b0'); };
  IC.buah_emas = function (p) { p.disc(8, 9, 5.4, '#e9b949'); p.disc(7, 8, 3.4, '#f8d870'); p.px(6, 6, '#ffffff'); p.ell(10, 4, 3, 1.4, '#4f9a3a'); p.rect(8, 2, 1, 3, '#6b4423'); };
  IC.bijih_emas = function (p) { p.ell(8, 9, 6.4, 5, '#5a5058'); p.ell(7, 8, 4.6, 3.4, '#6a6068'); [[5, 7], [9, 6], [10, 10], [6, 10]].forEach(function (c) { p.px(c[0], c[1], '#f2c94c'); p.px(c[0] + 1, c[1], '#c9a040'); }); };
  IC.emas = function (p) { p.poly([[3, 10], [6, 5], [11, 4], [13, 9], [10, 13], [5, 13]], '#e9b949'); p.poly([[5, 9], [7, 6], [10, 6], [11, 9]], '#f8d870'); p.px(7, 7, '#ffffff'); p.px(11, 11, '#c4922f'); };
  IC.kristal = function (p) { [[5, 14, 4, 5], [8, 14, 8, 1], [11, 14, 12, 6]].forEach(function (c, k) { p.poly([[c[0] - 2.4, c[1]], [c[2], c[3]], [c[0] + 2.4, c[1]]], k === 1 ? '#c080ff' : '#9a60d8'); p.line(c[0], c[1] - 1, c[2], c[3] + 1, '#e8c8ff'); }); };
  IC.serpihan_bayang = function (p) { p.poly([[8, 1], [12, 8], [8, 15], [4, 8]], '#2a1a3a'); p.poly([[8, 3], [10, 8], [8, 12], [6, 8]], '#5a3a7a'); p.px(8, 7, '#ff3a5a'); };
  IC.ikan_buta = function (p) { p.poly([[2, 8], [0, 4], [0, 12]], '#c8c0d0'); p.ell(8.5, 8, 6.5, 3.2, '#e8e0f0'); p.ell(9, 9.5, 5, 1.4, '#f8f4ff'); p.poly([[7, 5], [10, 2], [11, 5]], '#d0c8e0'); p.px(13, 7, '#d8b8c8'); p.speck(4, 6, 8, 4, '#f0c0d0', 4); };
  IC.selendang = function (p) { p.poly([[2, 3], [14, 2], [13, 7], [3, 8]], '#c88aa8'); p.poly([[3, 8], [13, 7], [11, 15], [6, 14]], '#a86a88'); for (var x = 3; x < 13; x += 3) p.px(x, 5, '#e9c46a'); p.line(6, 14, 5, 16, '#e9c46a'); p.line(11, 15, 12, 16, '#e9c46a'); };
  IC.amfora = function (p) { p.ell(8, 10, 4.6, 5.6, '#c8743a'); p.rect(6, 1, 4, 4, '#b8642a'); p.rect(3, 2, 2, 5, '#a8541a'); p.rect(11, 2, 2, 5, '#a8541a'); p.ell(8, 10, 3.4, 1, '#1a1a1a'); p.px(6, 10, '#e8d8c8'); p.px(10, 10, '#e8d8c8'); };
  IC.trisula = function (p) { p.line(3, 15, 11, 5, '#e9c46a', 2); p.poly([[9, 4], [15, 1], [13, 7]], '#e9c46a'); p.line(10, 4, 10, 0, '#f2d06b'); p.line(12, 6, 16, 6, '#f2d06b'); p.line(11, 5, 15, 1, '#f8e8a0'); p.px(3, 15, '#7fd8f0'); };
  var HUD = {
    ic_s_menanam: function (p) { p.line(6, 11, 6, 4, '#4f9a3a', 2); p.ell(3.6, 5, 2.4, 1.4, '#6cbf4a'); p.ell(8.4, 4, 2.4, 1.4, '#9be15d'); p.rect(2, 10, 8, 2, '#7b5030'); },
    ic_s_buah: function (p) { p.disc(4, 7, 3, '#d62828'); p.disc(8, 7, 3, '#f2c94c'); p.line(6, 4, 6, 1, '#5a3a20'); p.ell(8, 2, 2, 1, '#4f9a3a'); },
    ic_s_kemarau: function (p) { p.disc(6, 6, 3, '#ffb040'); for (var i = 0; i < 8; i++) { var a = i / 8 * Math.PI * 2; p.px(6 + Math.cos(a) * 5, 6 + Math.sin(a) * 5, '#ffd166'); } },
    ic_s_tengkujuh: function (p) { p.ell(6, 4, 5, 2.6, '#b8c8d8'); p.ell(4, 3, 2.6, 2, '#d8e4ee'); [[3, 8], [6, 9], [9, 8], [4, 11], [8, 11]].forEach(function (c) { p.px(c[0], c[1], '#6fb2dc'); }); },
    ic_str: function (p) { p.rect(3, 5, 6, 5, '#d49b6b'); p.rect(3, 4, 2, 2, '#d49b6b'); p.rect(5, 3, 2, 2, '#d49b6b'); p.rect(7, 4, 2, 2, '#d49b6b'); p.rect(2, 7, 2, 3, '#b37b4d'); p.rect(4, 10, 4, 2, '#cf4f3c'); },
    ic_hp: function (p) { p.str(['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'], { '#': '#ff5a6a' }, 2, 3); p.px(3, 4, '#ffc2d6'); },
    ic_map: function (p) { p.poly([[1, 2], [4, 1], [8, 2], [11, 1], [11, 10], [8, 11], [4, 10], [1, 11]], '#e8dcc0'); p.line(4, 1, 4, 10, '#c8b890'); p.line(8, 2, 8, 11, '#c8b890'); p.px(6, 5, '#d62828'); p.px(9, 7, '#4f9a3a'); }
  };

  // ================================================================== GENERATE
  Art.generate4 = function (scene) {
    var make = Art.make;
    Object.keys(CROP).forEach(function (id) {
      for (var s = 0; s < 4; s++) (function (s) { make(scene, 'crop_' + id + '_' + s, 16, 16, function (p) { if (sprout(p, s)) return; CROP[id](p, s); p.outline('#1f3a1a'); }); })(s);
    });
    Object.keys(TREE).forEach(function (id) {
      make(scene, id, 48, 64, function (p) { TREE[id](p, false); }, true);
      make(scene, id + '_f', 48, 64, function (p) { TREE[id](p, true); }, true);
    });
    make(scene, 'reban', 48, 40, drawReban, true);
    make(scene, 'kandang', 64, 40, drawKandang, true);
    make(scene, 'gelanggang', 80, 56, drawGelanggang, true);
    make(scene, 'batu_angkat', 32, 20, drawBatuAngkat, true);
    make(scene, 'peti_kayu', 16, 16, function (p) { drawChest(p, false); }, true);
    make(scene, 'peti_ukir', 20, 18, function (p) { drawChest(p, true); }, true);
    make(scene, 'pintu_bunian', 32, 40, drawPintuBunian);
    make(scene, 'rumah_bunian', 64, 72, drawRumahBunian, true);
    make(scene, 'gerai_bunian', 48, 40, drawGeraiBunian, true);
    make(scene, 'keris_batu', 32, 34, drawKerisBatu, true);
    make(scene, 'lombong_pintu', 48, 44, function (p) { drawLombongPintu(p, false); }, true);
    make(scene, 'lombong_tutup', 48, 44, function (p) { drawLombongPintu(p, true); }, true);
    make(scene, 'kereta_lombong', 20, 16, drawKeretaLombong, true);
    make(scene, 'peti_kargo', 16, 16, function (p) { p.rect(1, 3, 14, 12, '#7a5030'); p.rect(1, 3, 14, 2, '#9a6a40'); p.line(1, 3, 15, 15, '#5a3a20'); p.line(15, 3, 1, 15, '#5a3a20'); p.speck(1, 3, 14, 12, '#2f6a5a', 6); }, true);
    make(scene, 'tempayan', 16, 20, drawTempayan, true);
    make(scene, 'kemudi', 18, 22, drawKemudi, true);
    make(scene, 'cermin_kapten', 14, 26, drawCermin, true);
    make(scene, 'istana_kidul', 144, 96, drawIstana, true);
    make(scene, 'penjaga_laut', 16, 22, drawGuard);
    make(scene, 'lampu_ubur', 12, 26, drawLampuUbur);
    make(scene, 'gerbang_kidul', 32, 28, drawGerbangKidul);
    make(scene, 'palung', 32, 14, drawPalung);
    make(scene, 'kuil_atlantis', 112, 96, drawKuil, true);
    make(scene, 'tiang_atlantis', 14, 40, function (p) { drawTiang(p, false); }, true);
    make(scene, 'tiang_patah', 16, 20, function (p) { drawTiang(p, true); }, true);
    make(scene, 'patung_kuda', 30, 34, drawPatungKuda, true);
    make(scene, 'rumah_atlantis', 64, 56, drawRumahAtlantis, true);
    // the warung after Mak Ani's Lv 10 expansion: the old stall with fairy lights, a second banner and more goods
    ['back', 'front'].forEach(function (k) {
      make(scene, 'warung2_' + k, 72, 64, function (p, ctx) {
        ctx.drawImage(scene.textures.get('warung_' + k).getSourceImage(), 0, 0);
        if (k === 'front') {
          for (var x = 4; x < 70; x += 5) { p.px(x, 21 + Math.round(Math.sin(x / 6) * 2), ['#ffd166', '#ff6b6b', '#9be15d', '#8fd3ff'][(x / 5 | 0) % 4]); }
          p.rect(46, 30, 22, 7, '#2a9d8f'); p.rect(46, 30, 22, 1, '#f2c94c'); p.rect(49, 33, 16, 1, '#f5f0e1');
          [[8, 46, '#d62828'], [14, 46, '#f2c94c'], [20, 46, '#9be15d'], [26, 46, '#ff9ab0']].forEach(function (c) { p.disc(c[0], c[1], 2.4, c[2]); });
        } else { p.rect(8, 22, 56, 2, '#8a5a2b'); [[12, 20], [22, 20], [32, 20], [42, 20], [52, 20]].forEach(function (c, i) { p.rect(c[0], c[1] - 4, 6, 4, ['#c8323a', '#e9c46a', '#2a7ab8', '#f5f0e1', '#3a8a3a'][i]); }); }
      });
    });
    // decor
    make(scene, 'stalagmite', 12, 16, function (p) { p.poly([[1, 16], [6, 1], [11, 16]], '#3a3040'); p.poly([[4, 16], [6, 4], [8, 16]], '#4a4052'); p.px(6, 2, '#6a5a72'); }, true);
    make(scene, 'rubble', 14, 8, function (p) { [[3, 5, 2.6], [8, 4, 3], [11, 6, 2]].forEach(function (c) { p.disc(c[0], c[1], c[2], '#4a4048'); p.px(c[0] - 1, c[1] - 1, '#5a5058'); }); }, true);
    make(scene, 'crystal_s', 10, 12, function (p) { p.poly([[2, 12], [3, 4], [5, 12]], '#8a50c8'); p.poly([[4, 12], [6, 1], [8, 12]], '#b070f0'); p.line(6, 2, 6, 10, '#e0c0ff'); });
    make(scene, 'cobweb', 16, 14, function (p) { for (var i = 0; i < 5; i++) { var a = i / 4 * Math.PI / 2; p.line(0, 0, Math.cos(a) * 15, Math.sin(a) * 13, 'rgba(220,220,230,0.5)'); } [5, 9, 13].forEach(function (r) { for (var k = 0; k <= 8; k++) { var a = k / 8 * Math.PI / 2; p.px(Math.cos(a) * r, Math.sin(a) * r * 0.86, 'rgba(230,230,240,0.6)'); } }); });
    // forage
    Object.keys(FG).forEach(function (k) {
      var sz = FG_SIZE[k];
      make(scene, 'fg_' + k, sz[0], sz[1], function (p) { FG[k](p, true); }, true);
      make(scene, 'fg_' + k + '_e', sz[0], sz[1], function (p) { FG[k](p, false); }, true);
    });
    // animals
    for (var f = 0; f < 3; f++) (function (f) {
      make(scene, 'serama_' + f, 13, 13, function (p) { drawSerama(p, f); });
      make(scene, 'itik_' + f, 14, 13, function (p) { drawItik(p, f); });
    })(f);
    for (f = 0; f < 2; f++) (function (f) {
      make(scene, 'kambing_' + f, 20, 16, function (p) { drawKambing(p, f); });
      make(scene, 'anak_' + f, 9, 8, function (p) { drawAnak(p, f); });
      make(scene, 'kelawar_' + f, 16, 10, function (p) { drawKelawar(p, f); });
      make(scene, 'bayang_' + f, 14, 18, function (p) { drawBayang(p, f); });
      make(scene, 'lipan_' + f, 26, 9, function (p) { drawLipan(p, f); });
      make(scene, 'penunggu_' + f, 30, 32, function (p) { drawPenunggu(p, f); });
      make(scene, 'gasing_' + f, 16, 16, function (p) { p.ell(8, 8, 7, 3.6, '#8a5a2b'); p.ell(8, 7, 6, 2.6, '#c99a5e'); p.rect(f ? 4 : 10, 6, 2, 2, '#c8323a'); p.rect(f ? 10 : 4, 7, 2, 1, '#2a7ab8'); p.poly([[2, 9], [8, 15], [14, 9]], '#8a5a2b'); p.rect(7, 3, 2, 3, '#5a3a20'); }, true);
    })(f);
    // the people of the deep
    [['tanggang', 16, 22, drawTanggang], ['ratukidul', 20, 26, drawRatu], ['sekar', 16, 22, drawSekar], ['poseidon', 24, 32, drawPoseidon], ['nerissa', 18, 24, drawNerissa]].forEach(function (n) {
      make(scene, 'npc_' + n[0] + '_0', n[1], n[2], function (p) { n[3](p, false); });
      make(scene, 'npc_' + n[0] + '_1', n[1], n[2], function (p) { n[3](p, true); });
    });
    // fx: sword arcs, rain, the Bunian glasses on your face, eyes in the dark
    ['right', 'down', 'up'].forEach(function (d) {
      make(scene, 'slash_' + d, 24, 24, function (p) {
        for (var i = 0; i < 9; i++) {
          var a = (-60 + i * 15) * Math.PI / 180, r = 10, cx = 4, cy = 12;
          var x = d === 'right' ? cx + Math.cos(a) * r : 12 + Math.sin(a) * r, y = d === 'right' ? cy + Math.sin(a) * r : d === 'down' ? 4 + Math.cos(a) * r : 20 - Math.cos(a) * r;
          p.disc(x, y, i === 4 ? 1.6 : 1.1, i % 2 ? '#ffffff' : '#e8f4ff');
        }
      });
    });
    make(scene, 'rain', 2, 7, function (p) { p.rect(0, 0, 1, 7, 'rgba(200,225,255,0.8)'); p.rect(1, 2, 1, 4, 'rgba(160,200,240,0.5)'); });
    make(scene, 'specs', 9, 3, function (p) { p.rect(0, 0, 4, 3, '#e9c46a'); p.rect(5, 0, 4, 3, '#e9c46a'); p.rect(1, 1, 2, 1, '#bff2c8'); p.rect(6, 1, 2, 1, '#bff2c8'); p.px(4, 1, '#c4922f'); });
    make(scene, 'eyes', 6, 2, function (p) { p.rect(0, 0, 2, 2, '#ff3a3a'); p.rect(4, 0, 2, 2, '#ff3a3a'); });
    Object.keys(IC).forEach(function (id) { make(scene, 'i_' + id, 16, 16, IC[id], true); });
    Object.keys(HUD).forEach(function (k) { make(scene, k, 12, 12, HUD[k], true); });
  };
})(window.LC);
