/* Little Creature — procedural pixel art for Chapter 7 (v2.5): Gunung Santubong (with its crack) and Bukit Sejinjang,
 * the meeting stone, Santubong's loom and Sejinjang's lesung, Mak Dayang's house and Nenek's childhood house (fallen in,
 * then repaired), the dye plants, the crag of Pulau Satang, Sang Bualang (the sulking villager, the boss, the friend),
 * the storm creatures, a little whirlwind, Raja Kayangan's face, item icons and the two new HUD buttons. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art;

  function drawGunung(p) {   // 224x112: a tall green mountain with a long crack down its face
    var W = 224, H = 112;
    p.poly([[0, H], [10, 60], [40, 30], [70, 12], [92, 4], [112, 0], [132, 6], [158, 22], [190, 46], [214, 70], [W, H]], '#2f5a3a');
    p.poly([[20, H], [40, 52], [70, 26], [96, 10], [112, 4], [128, 10], [150, 28], [180, 56], [200, H]], '#3a6a44');
    p.poly([[70, 30], [96, 12], [112, 6], [126, 12], [110, 22], [90, 30]], '#4f8a52');
    p.speck(0, 20, W, H - 20, '#24482e', 240); p.speck(10, 30, W - 20, H - 30, '#5a9a5a', 120);
    for (var i = 0; i < 22; i++) { var x = 12 + (i * 37) % 200, y = 60 + (i * 23) % 48; p.disc(x, y, 3 + i % 3, '#2a5232'); p.disc(x - 1, y - 1, 2 + i % 2, '#4a8a4a'); }
    // the crack: Sejinjang's antan
    p.line(98, 18, 92, 34, '#1a2a1e', 2); p.line(92, 34, 96, 50, '#1a2a1e', 2); p.line(96, 50, 88, 66, '#1a2a1e', 2); p.line(88, 66, 92, 80, '#1a2a1e', 1);
    p.line(99, 18, 93, 34, '#6a8a6a', 1); p.line(97, 50, 89, 66, '#6a8a6a', 1);
    // mist round the peak
    p.ell(112, 8, 26, 4, '#e8eef0'); p.ell(88, 14, 14, 3, '#dfe8ea'); p.ell(140, 16, 16, 3, '#dfe8ea');
    p.rect(0, H - 6, W, 6, '#2a4a30');
  }
  function drawBukit(p) {   // 224x80: a lower, rounder hill
    var W = 224, H = 80;
    p.ell(112, 70, 112, 62, '#386a40'); p.ell(112, 66, 96, 48, '#447a4a'); p.ell(100, 44, 52, 22, '#5a9258');
    p.rect(0, H - 8, W, 8, '#2a4a30');
    p.speck(4, 14, W - 8, H - 18, '#2a5232', 180); p.speck(10, 20, W - 20, H - 24, '#64a060', 90);
    for (var i = 0; i < 16; i++) { var x = 20 + (i * 41) % 184, y = 30 + (i * 17) % 40; p.disc(x, y, 3, '#2a5232'); p.disc(x - 1, y - 1, 2, '#4f8a4a'); }
    p.ell(112, 12, 22, 3, '#e8eef0');
  }
  function drawBatuTemu(p) {   // 32x24: the meeting stone: a flat, mossy slab with two small handprints side by side
    p.ell(16, 20, 15, 4, '#55555c'); p.ell(16, 18, 15, 4.5, '#8a8a92'); p.ell(15, 17, 12, 3, '#a2a2aa');
    p.rect(3, 18, 26, 3, '#7a7a82');
    p.speck(3, 15, 26, 6, '#6a6a72', 12);
    [[5, 18], [8, 19], [24, 19], [27, 18], [14, 20]].forEach(function (m) { p.px(m[0], m[1], '#5a8a4a'); p.px(m[0] + 1, m[1], '#4a7a3a'); });   // moss
    [[11, 16], [19, 16]].forEach(function (h) { p.rect(h[0], h[1], 2, 2, '#8a8a92'); p.px(h[0] - 1, h[1] - 1, '#8a8a92'); p.px(h[0] + 1, h[1] - 1, '#8a8a92'); p.px(h[0] + 2, h[1], '#8a8a92'); });
    p.px(16, 12, '#fff3c0'); p.px(9, 13, '#d8e8ff');
  }
  function drawTenun(p) {   // 32x28: a wooden loom with a half-woven cloth (blue, yellow, red, gold)
    p.rect(2, 4, 2, 24, '#6a4a2a'); p.rect(28, 4, 2, 24, '#6a4a2a'); p.rect(0, 3, 32, 3, '#8a6a3a'); p.rect(0, 22, 32, 3, '#8a6a3a');
    p.rect(5, 6, 22, 16, '#d8d0c0');
    for (var x = 6; x < 27; x += 2) p.line(x, 6, x, 21, '#c8c0b0');
    [['#2a5a9a', 7], ['#e9c43a', 10], ['#c83a3a', 13]].forEach(function (b) { p.rect(5, b[1], 22, 3, b[0]); });
    p.rect(5, 16, 22, 1, '#e9c46a'); for (x = 6; x < 27; x += 4) p.px(x, 12, '#fff3b0');
    p.rect(4, 23, 24, 2, '#a07a4a'); p.px(16, 1, '#e9c46a');
  }
  function drawLesung(p) {   // 20x28: a wooden mortar of padi, with the antan standing in it
    p.rect(8, 0, 4, 22, '#b08a5a'); p.rect(8, 0, 1, 22, '#d0aa7a'); p.rect(7, 0, 6, 3, '#8a6a3a');
    p.ell(10, 21, 9, 4, '#6a4a2a'); p.rect(2, 20, 16, 7, '#7a5a32'); p.rect(2, 20, 16, 1, '#9a7a4a'); p.ell(10, 20, 7, 2, '#e8dcb0');
    p.rect(2, 26, 16, 2, '#5a3a20'); p.px(5, 23, '#5a3a20'); p.px(14, 24, '#5a3a20');
  }
  function drawRumah(p, kind) {   // 48x52: a Malay stilt house with a long attap roof (dayang · lama (fallen in) · nenek)
    var old = kind === 'lama', wall = old ? '#7a6a5a' : '#a8784a', wall2 = old ? '#5a4e44' : '#8a5a32', roof = old ? '#5a5048' : kind === 'nenek' ? '#8a5a2a' : '#7a6a3a';
    [6, 18, 30, 42].forEach(function (x) { p.rect(x, 38, 2, 14, '#4a3a2a'); });
    p.rect(4, 22, 40, 17, wall); p.rect(4, 22, 40, 2, wall2); for (var x = 6; x < 44; x += 4) p.rect(x, 24, 1, 14, wall2);
    p.rect(18, 26, 10, 13, old ? '#2a2420' : '#3a2a1a'); p.rect(8, 27, 6, 5, old ? '#2a2420' : '#ffe8a8'); p.rect(34, 27, 6, 5, old ? '#2a2420' : '#ffe8a8');
    p.rect(20, 39, 6, 2, '#6a4a2a'); p.rect(21, 42, 6, 2, '#6a4a2a'); p.rect(22, 45, 6, 2, '#6a4a2a'); p.rect(23, 48, 6, 2, '#6a4a2a');
    if (old) {
      p.poly([[0, 23], [22, 6], [24, 8], [10, 23]], roof); p.poly([[30, 10], [48, 23], [36, 23]], roof);
      p.line(22, 8, 30, 12, '#3a3028', 1); p.speck(2, 8, 44, 14, '#3a3530', 20); p.px(25, 14, '#2a2420'); p.px(27, 16, '#2a2420');
      p.line(8, 34, 14, 38, '#3a3028'); p.px(24, 30, '#c8a040');   // the little carved lamp, dusty
    } else {
      p.poly([[0, 23], [24, 4], [48, 23]], roof); p.poly([[4, 22], [24, 7], [44, 22]], kind === 'nenek' ? '#a8703a' : '#9a8a4a');
      for (var r = 9; r < 22; r += 3) p.line(24 - (r - 4) * 1.2, r, 24 + (r - 4) * 1.2, r, kind === 'nenek' ? '#7a4a1e' : '#6a5a2a');
      p.rect(23, 2, 2, 4, '#4a3a2a');
      if (kind === 'dayang') { p.rect(36, 34, 8, 4, '#2a5a9a'); p.rect(38, 34, 2, 4, '#e9c43a'); p.rect(41, 34, 1, 4, '#c83a3a'); }   // cloth drying on the rail
      if (kind === 'nenek') { p.disc(23, 30, 1.6, '#ffd166'); p.px(23, 28, '#fff3b0'); p.rect(26, 27, 1, 5, '#e85a8a'); p.px(27, 31, '#e85a8a'); }   // the gold lamp, and a ribbon
    }
  }
  function drawTarum(p) { p.ell(8, 11, 7, 5, '#2f6a3a'); p.ell(7, 9, 5, 4, '#3f8a4a'); p.speck(2, 6, 12, 9, '#2a4a8a', 10); p.px(5, 7, '#4a6ab8'); p.px(11, 9, '#4a6ab8'); p.rect(7, 14, 2, 2, '#4a3a2a'); }
  function drawKunyit(p) { [[4, 2, 6, 12], [8, 1, 9, 12], [12, 3, 10, 12]].forEach(function (l) { p.line(l[0], l[1], l[2], l[3], '#4f9a4a', 2); }); p.ell(8, 13, 5, 2, '#6a4a2a'); p.ell(7, 13, 2.4, 1.4, '#f2b83a'); p.px(10, 13, '#f2b83a'); }
  function drawKesumba(p) {   // 24x30: a bush with red seed pods
    p.rect(11, 18, 2, 12, '#6a4a2a'); p.ell(12, 14, 11, 9, '#2f6a3a'); p.ell(11, 12, 8, 7, '#3f8a4a');
    [[6, 10], [16, 8], [12, 16], [18, 15], [7, 17], [13, 7]].forEach(function (c) { p.ell(c[0], c[1], 1.8, 2.4, '#c83a3a'); p.px(c[0], c[1] - 2, '#e86a5a'); });
  }
  function drawKarang(p) {   // 32x40: the wind-carved crag of Pulau Satang
    p.poly([[2, 40], [6, 20], [12, 6], [18, 0], [24, 8], [28, 22], [30, 40]], '#6a6a72');
    p.poly([[8, 40], [10, 22], [15, 8], [18, 4], [22, 12], [24, 40]], '#8a8a92');
    p.line(12, 14, 20, 18, '#5a5a62'); p.line(10, 26, 22, 30, '#5a5a62'); p.speck(4, 6, 24, 34, '#a2a2aa', 18);
    p.ell(16, 38, 15, 3, '#4a4a52');
  }

  // Sang Bualang: a young man made of wind (pale, silver-blue hair streaming one way, a sash that never stops moving)
  function drawBualang(p, f, big) {
    var s = big ? 1 : 0, SK = '#e8dcd0', HR = '#c8d8f0', HR2 = '#8aa8d8', SH = '#d8ecff', SH2 = '#9ac0e8';
    var ox = big ? 2 : 0, oy = big ? 6 : 0;
    p.rect(5 + ox, 18 + oy, 2, 2, '#6a7a9a'); p.rect(9 + ox, 18 + oy, 2, 2, '#6a7a9a');
    p.rect(4 + ox, 13 + oy, 8, 5, '#3a4a6a'); p.rect(10 + ox, 13 + oy, 2, 5, '#2a3a5a');
    p.rect(4 + ox, 8 + oy, 8, 6, SH); p.rect(10 + ox, 8 + oy, 2, 6, SH2); p.rect(3 + ox, 9 + oy, 1, 4, SH); p.rect(12 + ox, 9 + oy, 1, 4, SH2);
    p.px(3 + ox, 13 + oy, SK); p.px(12 + ox, 13 + oy, SK);
    // the sash, streaming behind (it flaps between the two frames)
    p.rect(4 + ox, 12 + oy, 8, 1, '#5a8ad8');
    if (f) { p.line(12 + ox, 12 + oy, 15 + ox, 10 + oy, '#5a8ad8'); p.px(15 + ox, 9 + oy, '#8ab8ff'); } else { p.line(12 + ox, 12 + oy, 15 + ox, 13 + oy, '#5a8ad8'); p.px(15 + ox, 14 + oy, '#8ab8ff'); }
    p.rect(5 + ox, 3 + oy, 6, 5, SK);
    if (big) { p.px(6 + ox, 5 + oy, '#2a3a6a'); p.px(9 + ox, 5 + oy, '#2a3a6a'); p.rect(6 + ox, 4 + oy, 2, 1, '#4a5a8a'); p.rect(9 + ox, 4 + oy, 2, 1, '#4a5a8a'); p.px(7 + ox, 7 + oy, '#8a5a6a'); p.px(8 + ox, 7 + oy, '#8a5a6a'); }
    else { p.px(6, 5, '#2a3a6a'); p.px(9, 5, '#2a3a6a'); p.px(7, 7, '#a07a7a'); }
    // hair blown sideways
    p.rect(4 + ox, 1 + oy, 8, 3, HR); p.rect(11 + ox, 2 + oy, 3, 2, HR); p.px(14 + ox, f ? 1 + oy : 3 + oy, HR2); p.px(13 + ox, 4 + oy, HR2); p.rect(4 + ox, 3 + oy, 1, 3, HR);
    if (big) {   // a ring of wind around the boss
      p.line(0, 10, 3, 6, '#d8ecff'); p.line(19, 14, 16, 8, '#d8ecff'); p.line(1, 22, 5, 26, '#c8e0ff'); p.line(19, 24, 15, 27, '#c8e0ff');
      p.px(f ? 1 : 18, f ? 16 : 12, '#ffffff'); p.px(f ? 17 : 2, f ? 4 : 18, '#ffffff');
    } else { p.px(f ? 1 : 2, f ? 6 : 9, '#e0f0ff'); p.px(f ? 14 : 13, 17, '#e0f0ff'); }
    void s;
  }
  function drawRibut(p, f) {   // 16x16: an angry little storm cloud
    p.ell(8, 8, 7, 5, '#5a6278'); p.ell(6, 6, 4, 3.4, '#6e7690'); p.ell(11, 6, 3.6, 3, '#6e7690'); p.ell(8, 9, 6, 2.6, '#4a5066');
    p.px(6, 8, '#ffe070'); p.px(10, 8, '#ffe070'); p.rect(7, 10, 3, 1, '#2a2e3a');
    if (f) { p.line(9, 12, 7, 15, '#ffe070'); p.px(8, 13, '#fff8c0'); } else { p.px(3, 13, '#8fd3ff'); p.px(12, 14, '#8fd3ff'); p.px(8, 15, '#8fd3ff'); }
  }
  function drawCamar(p, f) {   // 16x12: a storm gull
    p.ell(8, 7, 4, 2.4, '#e8ecf0'); p.ell(8, 8, 3, 1.4, '#c8ccd4'); p.disc(12, 6, 1.8, '#e8ecf0'); p.px(13, 6, '#2a2a2a'); p.px(14, 6, '#e8a03a');
    if (f) { p.line(6, 6, 1, 1, '#9aa2b0', 2); p.line(9, 6, 13, 1, '#9aa2b0', 2); } else { p.line(6, 7, 1, 9, '#9aa2b0', 2); p.line(9, 7, 13, 10, '#9aa2b0', 2); }
    p.px(4, 7, '#7a8290');
  }
  function drawPuting(p, f) {   // 16x24: a little whirlwind
    [[8, 2, 7], [8, 6, 6], [8, 10, 5], [8, 14, 4], [8, 18, 3], [8, 21, 2]].forEach(function (r, i) {
      var dx = (i % 2 ? 1 : -1) * (f ? 1 : -1);
      p.ell(r[0] + dx, r[1], r[2], 1.6, i % 2 ? '#d8ecff' : '#b8d4f0');
      p.px(r[0] + dx + r[2] - 1, r[1], '#ffffff');
    });
    p.px(f ? 2 : 13, 9, '#e0f0ff'); p.px(f ? 13 : 3, 15, '#e0f0ff');
  }
  function drawKayangan(p) {   // 16x20: Raja Kayangan's face, in the clouds
    p.ell(8, 15, 8, 5, '#e8eef8'); p.rect(4, 4, 8, 9, '#f2d8b8'); p.rect(4, 4, 8, 2, '#e9c46a'); [5, 8, 11].forEach(function (x) { p.px(x, 2, '#f2c94c'); p.px(x, 3, '#e9c46a'); });
    p.px(6, 8, '#3a2a1a'); p.px(9, 8, '#3a2a1a'); p.ell(8, 13, 4, 3, '#ffffff'); p.px(7, 11, '#d8c8b8'); p.px(8, 11, '#d8c8b8');
    p.ell(2, 12, 2.4, 2, '#ffffff'); p.ell(14, 12, 2.4, 2, '#ffffff'); p.px(1, 2, '#fff3c0'); p.px(14, 1, '#fff3c0');
  }

  var IC = {
    kabus_ledang: function (p) { p.rect(4, 6, 8, 9, '#b8865a'); p.rect(4, 6, 8, 1, '#d8a878'); p.rect(5, 4, 6, 2, '#8a5a3a'); p.ell(8, 3, 5, 2, '#f0f4f8'); p.ell(6, 1, 2, 1, '#e0e8f0'); p.ell(11, 2, 2, 1, '#e0e8f0'); p.px(7, 10, '#fff8e0'); },
    tarum: function (p) { p.ell(8, 8, 5, 6, '#2f6a3a'); p.line(8, 2, 8, 14, '#1f4a2a'); p.speck(4, 4, 8, 8, '#2a4a9a', 6); p.px(6, 6, '#5a7ad8'); },
    kunyit_hutan: function (p) { p.ell(7, 9, 5, 3, '#c8822a'); p.ell(7, 8, 4, 2, '#f2b83a'); p.ell(12, 7, 2, 1.6, '#f2b83a'); p.line(5, 6, 3, 3, '#4f9a4a'); p.line(8, 6, 9, 2, '#4f9a4a'); },
    kesumba: function (p) { [[5, 7], [10, 6], [8, 11], [12, 11], [4, 12]].forEach(function (c) { p.disc(c[0], c[1], 2, '#c83a3a'); p.px(c[0] - 1, c[1] - 1, '#ff8a7a'); }); },
    benang_emas: function (p) { p.ell(8, 8, 5, 6, '#e9c46a'); for (var y = 4; y < 13; y += 2) p.line(4, y, 12, y + 1, '#c4922f'); p.line(12, 9, 15, 13, '#f2d06b'); },
    kain_santubong: function (p) { p.rect(2, 3, 12, 10, '#2a5a9a'); p.rect(2, 6, 12, 3, '#e9c43a'); p.rect(2, 9, 12, 2, '#c83a3a'); p.rect(2, 5, 12, 1, '#e9c46a'); p.rect(2, 11, 12, 1, '#e9c46a'); p.px(2, 13, '#fff3b0'); p.px(13, 3, '#fff3b0'); },
    beras_sejinjang: function (p) { p.ell(8, 11, 6, 3, '#8a6a3a'); p.ell(8, 9, 6, 3, '#f8f2e0'); p.speck(3, 7, 10, 4, '#ffffff', 10); p.px(8, 6, '#fff8c0'); },
    surat_serapi: function (p) { p.poly([[2, 4], [12, 3], [14, 12], [4, 13]], '#7aa84a'); p.line(4, 6, 11, 5, '#4a6a2a'); p.line(5, 8, 12, 7, '#4a6a2a'); p.line(5, 10, 12, 9, '#4a6a2a'); p.px(13, 12, '#e9c46a'); },
    wau_bualang: function (p) { p.poly([[8, 1], [14, 6], [8, 9], [2, 6]], '#2a8a9a'); p.ell(8, 11, 5, 2.4, '#e9c43a'); p.line(8, 1, 8, 13, '#8a6a3a'); p.line(2, 6, 14, 6, '#8a6a3a'); p.px(8, 6, '#c83a3a'); p.line(8, 13, 11, 15, '#e9c46a'); },
    kain_tenun: function (p) { p.rect(2, 3, 12, 10, '#7a2a4a'); p.rect(2, 5, 12, 1, '#e9c46a'); p.rect(2, 10, 12, 1, '#e9c46a'); for (var x = 3; x < 14; x += 3) p.px(x, 7, '#e9c46a'); p.px(4, 8, '#2a5a9a'); p.px(10, 8, '#2a5a9a'); },
    tepung_beras: function (p) { p.rect(4, 5, 8, 9, '#e8dcc0'); p.rect(4, 5, 8, 2, '#c8b890'); p.ell(8, 4, 3, 1.4, '#ffffff'); p.px(6, 9, '#a89870'); p.px(9, 11, '#a89870'); },
    kuih_lapis: function (p) { ['#e85a8a', '#ffffff', '#5ab86a', '#ffffff', '#e85a8a', '#f2c94c'].forEach(function (c, i) { p.rect(4, 4 + i * 2, 9, 2, c); }); p.rect(4, 4, 1, 12, '#c84a6a'); }
  };
  var HUD = {
    ic_wau: function (p) { p.poly([[6, 0], [11, 4], [6, 7], [1, 4]], '#2a8a9a'); p.ell(6, 9, 4, 1.8, '#e9c43a'); p.line(6, 0, 6, 10, '#8a6a3a'); p.line(1, 4, 11, 4, '#8a6a3a'); p.px(6, 4, '#c83a3a'); },
    ic_angin: function (p) { p.line(0, 3, 8, 3, '#d8ecff'); p.line(8, 3, 10, 1, '#d8ecff'); p.line(1, 6, 10, 6, '#ffffff'); p.line(10, 6, 11, 8, '#ffffff'); p.line(0, 9, 7, 9, '#b8d4f0'); p.line(7, 9, 9, 11, '#b8d4f0'); }
  };

  Art.generate15 = function (scene) {
    var make = Art.make;
    make(scene, 'gunung_santubong', 224, 112, drawGunung, false);
    make(scene, 'bukit_sejinjang', 224, 80, drawBukit, false);
    make(scene, 'batu_temu', 32, 24, drawBatuTemu, true);
    make(scene, 'kek_tenun', 32, 28, drawTenun, true);
    make(scene, 'lesung_antan', 20, 28, drawLesung, true);
    ['dayang', 'lama', 'nenek'].forEach(function (k) { make(scene, 'rumah_' + k, 48, 52, function (p) { drawRumah(p, k); }, true); });
    make(scene, 'pokok_tarum', 16, 16, drawTarum, true);
    make(scene, 'pokok_kunyit', 16, 16, drawKunyit, true);
    make(scene, 'pokok_kesumba', 24, 30, drawKesumba, true);
    make(scene, 'batu_karang', 32, 40, drawKarang, true);
    make(scene, 'kayangan_face', 16, 20, drawKayangan, true);
    for (var f = 0; f < 2; f++) (function (f) {
      make(scene, 'npc_bualang_' + f, 16, 20, function (p) { drawBualang(p, f, false); }, true);
      make(scene, 'bualang7_' + f, 20, 28, function (p) { drawBualang(p, f, true); }, true);
      make(scene, 'ribut_' + f, 16, 16, function (p) { drawRibut(p, f); }, true);
      make(scene, 'camar_' + f, 16, 12, function (p) { drawCamar(p, f); }, true);
      make(scene, 'puting_' + f, 16, 24, function (p) { drawPuting(p, f); }, false);
    })(f);
    Object.keys(IC).forEach(function (id) { make(scene, 'i_' + id, 16, 16, IC[id], true); });
    Object.keys(HUD).forEach(function (k) { make(scene, k, 12, 12, HUD[k], true); });
    var a = scene.anims;
    [['ribut_walk', 'ribut', 4], ['camar_walk', 'camar', 8], ['bualang7_walk', 'bualang7', 5], ['puting_spin', 'puting', 10], ['bualang_fly', 'npc_bualang', 6]].forEach(function (k) {
      if (!a.exists(k[0])) a.create({ key: k[0], frames: [{ key: k[1] + '_0' }, { key: k[1] + '_1' }], frameRate: k[2], repeat: -1 });
    });
  };
})(window.LC);
