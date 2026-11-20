/* Little Creature — procedural pixel art for Chapter 8 (v2.6): the soldiers of the Southern Sea and of Atlantis, the ink
 * creatures, the Naga Mother and Ketos (furious and calm, with faces for the dialogue), Naga Kecil grown big enough to
 * ride (side, front and back), the Selat Gelora (the arch of two seas, the war pavilion, banners, the barricade, the
 * wall of current, the big broken jar, the peace stone), the black current gate, the jars, Nek Lampir's pot, spears,
 * a wave, a whirlpool, a water jet, the flood water, and item icons. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art;

  // ---------------------------------------------------------------- the soldiers (16x22, facing right)
  function drawLaskar(p, f) {   // a merman guard of the Southern Sea in green, with a coral spear
    p.poly([[5, 14], [11, 14], [10, 19], [8, 21], [6, 19]], '#2fa880'); p.poly([[8, 20], [4, 22], [12, 22]], '#3fc8a0');
    p.rect(5, 8, 6, 6, '#2a7a5a'); p.rect(5, 8, 6, 1, '#e9c46a'); p.rect(5, 12, 6, 1, '#e9c46a'); p.rect(4, 9, 1, 4, '#c48a5c');
    p.rect(5, 3, 6, 5, '#c48a5c'); p.px(9, 5, '#1a1a1a'); p.px(6, 5, '#1a1a1a'); p.line(8, 4, 10, 4, '#5a3a2a');
    p.rect(5, 1, 6, 2, '#2a7a5a'); p.rect(4, 2, 1, 2, '#2a7a5a'); p.px(8, 0, '#e9c46a');
    if (!f) { p.line(13, 21, 13, 2, '#e8607a'); p.poly([[11, 3], [13, 0], [15, 3]], '#f08a9a'); p.rect(11, 10, 2, 1, '#c48a5c'); }
    else { p.line(5, 11, 13, 11, '#e8607a'); p.poly([[12, 9], [15, 11], [12, 13]], '#f08a9a'); p.rect(11, 10, 1, 2, '#c48a5c'); }
    p.outline('#0e3a30');
  }
  function drawHoplit(p, f) {   // a merman soldier of Atlantis: bronze helmet with a red crest, a round shield, a little trident
    p.poly([[5, 14], [11, 14], [10, 19], [8, 21], [6, 19]], '#3a6ab0'); p.poly([[8, 20], [4, 22], [12, 22]], '#5a8ad8');
    p.line(3, 21, 3, 4, '#a08060'); p.rect(2, 3, 3, 1, '#c8a040'); p.px(2, 2, '#c8a040'); p.px(4, 2, '#c8a040'); p.px(3, 1, '#c8a040');
    p.rect(5, 8, 6, 6, '#ece8e0'); p.rect(5, 12, 6, 2, '#c8a040'); p.rect(4, 9, 1, 4, '#d6a77a');
    p.rect(5, 3, 6, 5, '#d6a77a'); p.px(9, 5, '#1a1a2a'); p.line(8, 4, 10, 4, '#7a5a3a');
    p.rect(4, 1, 8, 3, '#c8a040'); p.rect(4, 3, 2, 3, '#c8a040'); p.rect(5, 0, 6, 1, '#c83a3a'); p.px(4, 0, '#c83a3a'); p.px(11, 1, '#e8c060');
    var sx = f ? 13 : 11;
    p.disc(sx, 12, 3.5, '#c8a040'); p.disc(sx, 12, 2.2, '#e0b850'); p.px(sx, 12, '#8a6a2a');
    p.outline('#1a2a4a');
  }
  function drawTinta(p, f) {   // 16x14: a blob of the cursed ink, with angry little eyes
    var s = f ? 1 : 0;
    p.ell(8, 9 + s * 0.5, 7 + s, 4.5 - s * 0.5, '#1e1028'); p.ell(7, 7.5 + s, 5, 3, '#2e1a3e');
    p.rect(3, 11, 1, 2 + s, '#1e1028'); p.rect(12, 11, 1, 2 - s, '#1e1028'); p.px(8, 13, '#1e1028');
    p.rect(5, 6 + s, 2, 2, '#ffffff'); p.rect(9, 6 + s, 2, 2, '#ffffff'); p.px(6, 7 + s, '#c83a3a'); p.px(10, 7 + s, '#c83a3a');
    p.line(4, 5 + s, 6, 6 + s, '#8a5ab8'); p.line(11, 5 + s, 9, 6 + s, '#8a5ab8'); p.px(4, 9, '#5a3a7a'); p.px(12, 8, '#5a3a7a');
    p.outline('#0a0410');
  }

  // ---------------------------------------------------------------- the dragons (48x36, facing right)
  function body(p, pts, B, B2, BL, SC) {
    pts.forEach(function (c) { p.disc(c[0], c[1], c[2], B2); });
    pts.forEach(function (c) { p.disc(c[0] - 0.5, c[1] - 0.8, c[2] - 1, B); });
    pts.forEach(function (c, i) { if (i > 1) p.ell(c[0] + 1, c[1] + c[2] - 2, Math.max(1, c[2] - 1.5), 1.2, BL); });
    pts.forEach(function (c, i) { if (i % 2) { p.px(c[0] - 1, c[1] - 2, SC); p.px(c[0] + 1, c[1] - 1, SC); } });
  }
  function drawNagaIbu(p, f, fury) {   // the Naga Mother: a great teal-and-gold naga with a crown of golden spines
    var B = fury ? '#3e5a5a' : '#2f9a7a', B2 = fury ? '#2a3a40' : '#1f7a5e', BL = fury ? '#7a6a4a' : '#e9c46a', SC = fury ? '#1a0a28' : '#7adcb8',
      CR = fury ? '#9a8a5a' : '#f2c94c', w = f ? 1 : -1;
    p.poly([[0, 26], [6, 29], [1, 34]], CR);
    body(p, [[5, 30, 2.4], [10, 31, 3.2], [16, 31, 4], [21, 29, 4.6], [25, 25 + w, 5], [24, 20, 5], [22, 16 - w, 4.6], [25, 12, 4.6], [30, 10, 4.6], [34, 10, 4.2]], B, B2, BL, SC);
    p.ell(38, 9, 6, 4.5, B2); p.ell(37.5, 8.3, 5.5, 3.8, B);
    p.ell(43, 10.5, 3.5, 2.4, B); p.ell(44, 12.4, 2.8, 1, BL); p.px(46, 10, B2); p.px(45, 9, '#1a3a30');
    p.rect(38, 7, 2, 2, fury ? '#ffd0d0' : '#fff8e0'); p.px(39, 7, fury ? '#ff2a2a' : '#2a1a10');
    if (fury) p.line(37, 6, 40, 7, '#1a1a1a');
    [[33, 4], [35, 2], [37, 1], [39, 2], [41, 4]].forEach(function (s) { p.rect(s[0], s[1], 1, 4, CR); p.px(s[0], s[1] - 1, CR); });
    p.line(45, 13, 47, 15 + (f ? 1 : 0), CR); p.line(42, 13, 43, 16 + (f ? 0 : 1), CR);
    if (fury) { p.speck(6, 8, 36, 24, '#1a0a28', 30); p.px(40, 12, '#c83a3a'); }
    p.outline(fury ? '#140a1e' : '#0e3a30');
  }
  function drawKetos(p, f, fury) {   // Ketos: Poseidon's sea serpent: blue, with a fish tail, spiky fins and a bronze collar
    var B = fury ? '#4a4a62' : '#4a7ab8', B2 = fury ? '#2e2e44' : '#2f5a92', BL = fury ? '#8a8aa0' : '#c8e0f0', SC = fury ? '#1a0a28' : '#8fc0ef',
      FIN = fury ? '#5a3a6a' : '#8fd3ff', BR = fury ? '#7a6a3a' : '#c8a040', w = f ? 1 : -1;
    p.poly([[0, 19 + w], [9, 25], [1, 32 - w]], FIN); p.line(1, 21 + w, 7, 25, B2);
    [[14, 23], [20, 24], [26, 21], [30, 16]].forEach(function (s) { p.poly([[s[0] - 2, s[1]], [s[0], s[1] - 5 - (f ? 1 : 0)], [s[0] + 2, s[1]]], FIN); });
    body(p, [[9, 25, 3.6], [14, 27, 4.5], [20, 28, 5], [25, 26 + w, 5.5], [29, 22, 5.5], [31, 17 - w, 5], [33, 13, 5]], B, B2, BL, SC);
    p.rect(32, 15, 6, 2, BR); p.px(35, 17, BR); p.px(33, 15, '#f2d06b');
    p.poly([[33, 7], [35, 2], [37, 6], [39, 1], [41, 6]], FIN);
    p.ell(39, 11, 7, 5, B2); p.ell(38.5, 10.4, 6.5, 4.4, B);
    p.ell(44, 13.5, 4, 2.5, B); p.rect(41, 15, 6, 2, BL); [41, 43, 45].forEach(function (x) { p.px(x, 14, '#ffffff'); });
    p.rect(38, 8, 2, 2, fury ? '#ffd0d0' : '#ffffff'); p.px(39, 8, fury ? '#ff2a2a' : '#1a1a2a');
    if (fury) { p.line(37, 7, 40, 8, '#1a1a1a'); p.speck(6, 10, 36, 22, '#1a0a28', 30); }
    p.outline(fury ? '#140a1e' : '#0e1e3a');
  }
  function drawNagaFace(p, fury) {   // 24x24 portraits
    var B = fury ? '#3e5a5a' : '#2f9a7a', B2 = fury ? '#2a3a40' : '#1f7a5e', CR = fury ? '#9a8a5a' : '#f2c94c';
    p.disc(10, 18, 6, B2); p.ell(12, 12, 9, 6.5, B2); p.ell(11.5, 11, 8.4, 5.8, B); p.ell(19, 14, 4.5, 3.2, B); p.ell(20, 16.5, 3.5, 1.2, '#e9c46a');
    p.rect(12, 8, 3, 3, fury ? '#ffd0d0' : '#fff8e0'); p.rect(13, 9, 1, 2, fury ? '#ff2a2a' : '#2a1a10'); p.px(22, 13, '#1a3a30');
    [[5, 3], [8, 1], [11, 0], [14, 1], [17, 3]].forEach(function (s) { p.rect(s[0], s[1], 2, 5, CR); });
    p.line(21, 17, 23, 21, CR);
    if (fury) { p.line(11, 7, 15, 8, '#1a1a1a'); p.speck(3, 6, 18, 14, '#1a0a28', 12); }
    p.outline(fury ? '#140a1e' : '#0e3a30');
  }
  function drawKetosFace(p, fury) {
    var B = fury ? '#4a4a62' : '#4a7ab8', B2 = fury ? '#2e2e44' : '#2f5a92', FIN = fury ? '#5a3a6a' : '#8fd3ff';
    p.poly([[2, 10], [5, 1], [8, 8], [11, 0], [13, 8]], FIN);
    p.disc(8, 19, 6, B2); p.rect(5, 17, 8, 3, fury ? '#7a6a3a' : '#c8a040');
    p.ell(12, 12, 9, 6.5, B2); p.ell(11.5, 11, 8.4, 5.8, B); p.ell(19, 14.5, 4.6, 3.2, B); p.rect(15, 17, 8, 2, '#c8e0f0');
    [16, 18, 20].forEach(function (x) { p.px(x, 16, '#ffffff'); });
    p.rect(12, 8, 3, 3, fury ? '#ffd0d0' : '#ffffff'); p.rect(13, 9, 1, 2, fury ? '#ff2a2a' : '#1a1a2a');
    if (fury) { p.line(11, 7, 15, 8, '#1a1a1a'); p.speck(3, 6, 18, 14, '#1a0a28', 12); }
    p.outline(fury ? '#140a1e' : '#0e1e3a');
  }

  // ---------------------------------------------------------------- Naga Kecil, grown big enough to ride
  var NB = '#3fb0c0', NB2 = '#2a8aa0', NBL = '#e9c46a', NG = '#f2c94c', NO = '#1a5a6a';
  function drawRideSide(p, f) {   // 40x18, facing right; you sit in the middle (on the red saddle cloth)
    for (var x = 4; x <= 30; x += 2) { var y = 12 + Math.sin((x + (f ? 4 : 0)) / 4.5) * 1.6; p.disc(x, y, 3.2, NB2); p.disc(x - 0.3, y - 0.6, 2.4, NB); p.px(x, y + 2, NBL); }
    p.poly([[0, 9], [5, 12], [0, 16]], NG);
    p.disc(31, 10, 3.2, NB2); p.disc(31, 9.4, 2.6, NB);
    p.ell(35, 6, 4, 3, NB2); p.ell(34.8, 5.5, 3.5, 2.5, NB); p.ell(38, 7, 2, 1.4, NB); p.px(35, 5, '#2a1a10'); p.px(39, 7, NO);
    [[32, 1], [34, 0], [36, 1]].forEach(function (s) { p.rect(s[0], s[1], 1, 3, NG); });
    p.line(38, 8, 39, 10 + (f ? 1 : 0), NG);
    p.rect(16, 8, 8, 2, '#c83a3a'); p.rect(16, 8, 8, 1, NG);
    p.outline(NO);
  }
  function drawRideDown(p, f) {   // 24x30, coming towards you: the head in front, the coils either side of you
    var s = f ? 1 : 0;
    [[3, 10 + s], [3, 15], [4, 20 - s], [20, 10 - s], [20, 15], [19, 20 + s]].forEach(function (c) { p.disc(c[0], c[1], 3, NB2); p.disc(c[0] - 0.3, c[1] - 0.5, 2.2, NB); });
    p.disc(12, 22, 4, NB2); p.disc(12, 21.5, 3.4, NB);
    p.ell(12, 26, 5, 3.6, NB2); p.ell(12, 25.6, 4.4, 3, NB); p.px(10, 25, '#2a1a10'); p.px(14, 25, '#2a1a10'); p.rect(11, 28, 3, 1, NBL);
    [[8, 20], [10, 19], [14, 19], [16, 20]].forEach(function (c) { p.rect(c[0], c[1], 1, 3, NG); });
    p.rect(7, 14, 10, 2, '#c83a3a'); p.rect(7, 14, 10, 1, NG);
    p.outline(NO);
  }
  function drawRideUp(p, f) {   // 24x30, going away: the tail below you, the head up ahead
    var s = f ? 1 : 0;
    [[3, 12 - s], [3, 17], [4, 22 + s], [20, 12 + s], [20, 17], [19, 22 - s]].forEach(function (c) { p.disc(c[0], c[1], 3, NB2); p.disc(c[0] - 0.3, c[1] - 0.5, 2.2, NB); });
    p.disc(12, 25, 3.4, NB2); p.disc(12, 24.5, 2.8, NB); p.poly([[9, 27], [12, 30], [15, 27]], NG);
    p.ell(12, 4, 4, 3.4, NB2); p.ell(12, 3.6, 3.4, 2.8, NB); [[9, 0], [11, 0], [13, 0], [15, 0]].forEach(function (c) { p.rect(c[0], c[1], 1, 2, NG); });
    p.disc(12, 8, 2.6, NB2);
    p.rect(7, 14, 10, 2, '#c83a3a'); p.rect(7, 14, 10, 1, NG);
    p.outline(NO);
  }

  // ---------------------------------------------------------------- the Selat Gelora
  function drawArus(p) {   // 256x32: a wall of churning current
    var c = p.ctx;
    for (var x = 0; x < 256; x++) for (var y = 0; y < 32; y++) {
      var a = 0.42 + 0.22 * Math.sin(x / 6 + y / 3) * Math.cos(x / 17 - y / 9);
      c.fillStyle = 'rgba(20,40,74,' + a.toFixed(2) + ')'; c.fillRect(x, y, 1, 1);
    }
    for (var i = 0; i < 30; i++) {
      var cx = (i * 37) % 248 + 4, cy = 6 + (i * 13) % 20;
      p.line(cx - 4, cy, cx, cy - 3, '#bfe8ff'); p.line(cx, cy - 3, cx + 4, cy, '#8fc8ef'); p.px(cx + 5, cy + 1, '#ffffff');
    }
    p.speck(0, 0, 256, 32, 'rgba(60,30,90,0.8)', 80);
  }
  function drawBalangPecah(p) {   // 32x32: the big broken jar, leaking ink
    p.ell(16, 28, 15, 4, '#1a0e24'); p.ell(20, 29, 9, 2, '#2a1638');
    p.ell(13, 18, 10, 9, '#2a2230'); p.ell(12, 16, 8, 7, '#3a3242'); p.px(8, 12, '#6a6a7a'); p.px(9, 11, '#5a5a6a');
    p.rect(21, 13, 5, 6, '#2a2230'); p.rect(25, 12, 3, 8, '#3a3242'); p.rect(25, 12, 3, 1, '#4a4252');
    p.line(7, 11, 11, 20, '#0a0610'); p.line(11, 20, 9, 26, '#0a0610'); p.line(15, 9, 17, 15, '#0a0610'); p.line(17, 15, 15, 19, '#0a0610');
    p.ell(14, 17, 2, 2.4, '#8a5ab8'); p.ell(15, 17, 2, 2.4, '#3a3242'); p.line(12, 15, 17, 20, '#b88ae8');   // the crescent and the claw
    p.rect(28, 14, 3, 9, '#1e1028'); p.ell(29, 25, 4, 2, '#1e1028'); p.px(29, 18, '#5a3a7a'); p.px(30, 21, '#5a3a7a');
  }
  function drawBatuDamai(p) {   // 32x18: the peace stone
    p.ell(16, 13, 15, 4.5, '#5a6a6a'); p.ell(16, 11, 14, 4.5, '#9aa8a8'); p.ell(15, 10, 11, 3, '#b0bcbc');
    [[9, 9, '#3fc8a0'], [21, 9, '#ffffff']].forEach(function (h) { p.rect(h[0], h[1], 3, 2, h[2]); p.px(h[0] - 1, h[1] - 1, h[2]); p.px(h[0] + 1, h[1] - 1, h[2]); p.px(h[0] + 3, h[1] - 1, h[2]); p.px(h[0] + 3, h[1] + 1, h[2]); });
    p.rect(15, 13, 2, 1, '#6a6a6a'); p.px(14, 12, '#6a6a6a'); p.px(17, 12, '#6a6a6a');
    p.px(6, 14, '#5a8a6a'); p.px(26, 13, '#5a8a6a');
  }
  function drawGerbangDua(p) {   // 64x52: the arch of two seas (jade on the left, marble on the right)
    p.rect(4, 14, 10, 38, '#2a8a5a'); p.rect(4, 14, 3, 38, '#3fa870'); p.rect(12, 14, 2, 38, '#1e6a46');
    p.rect(50, 14, 10, 38, '#e8e4dc'); p.rect(50, 14, 3, 38, '#ffffff'); p.rect(58, 14, 2, 38, '#b8b4ac');
    for (var y = 18; y < 50; y += 6) { p.px(8, y, '#e9c46a'); p.line(51, y + 2, 58, y + 2, '#c8c4bc'); }
    p.rect(2, 46, 14, 6, '#1e6a46'); p.rect(48, 46, 14, 6, '#b8b4ac');
    p.poly([[2, 16], [8, 6], [32, 0], [32, 8], [10, 16]], '#2a8a5a'); p.poly([[62, 16], [56, 6], [32, 0], [32, 8], [54, 16]], '#e8e4dc');
    p.line(8, 7, 31, 1, '#e9c46a'); p.line(56, 7, 33, 1, '#c8a040');
    p.disc(32, 5, 4, '#f4f0ff'); p.px(31, 4, '#ffffff'); p.disc(32, 5, 1.6, '#d8e8ff');
  }
  function drawKhemah(p) {   // 64x48: the Queen's war pavilion of green silk on coral poles
    [6, 22, 42, 58].forEach(function (x) { p.rect(x - 1, 16, 3, 32, '#e8607a'); p.px(x, 16, '#f08a9a'); });
    p.poly([[0, 18], [32, 0], [64, 18]], '#1e8a5a'); p.poly([[6, 17], [32, 3], [58, 17]], '#2aa86a');
    p.line(0, 18, 64, 18, '#e9c46a'); for (var x = 2; x < 64; x += 6) p.px(x, 19, '#e9c46a');
    p.rect(14, 34, 36, 4, '#7a5a3a'); p.rect(16, 30, 32, 4, '#e8dcb0'); p.line(20, 31, 30, 32, '#5a8ab8'); p.line(32, 31, 44, 33, '#5a8ab8'); p.disc(26, 32, 1, '#ffffff'); p.disc(40, 31, 1, '#ffffff');
    p.rect(16, 38, 2, 8, '#5a3a20'); p.rect(46, 38, 2, 8, '#5a3a20');
    p.disc(32, 2, 2, '#f2d06b');
  }
  function drawPanji(p, kidul) {   // 16x40: a tall banner
    p.rect(2, 2, 2, 38, '#8a6a3a'); p.disc(3, 2, 1.6, kidul ? '#e9c46a' : '#c8a040');
    var c1 = kidul ? '#1e8a5a' : '#2a5a9a', c2 = kidul ? '#2aa86a' : '#ece8e0';
    p.poly([[4, 4], [15, 5], [13, 12], [15, 20], [4, 19]], c1); p.poly([[4, 7], [13, 8], [12, 12], [13, 16], [4, 16]], c2);
    if (kidul) { p.disc(8.5, 12, 2, '#e9c46a'); p.px(8, 9, '#f2d06b'); p.px(6, 12, '#f2d06b'); p.px(11, 12, '#f2d06b'); }
    else { p.line(8, 9, 8, 15, '#c8a040'); p.line(6, 10, 6, 12, '#c8a040'); p.line(10, 10, 10, 12, '#c8a040'); p.line(6, 12, 10, 12, '#c8a040'); }
    p.rect(1, 38, 4, 2, '#5a4a3a');
  }
  function drawBarikade(p) {   // 48x22: marble blocks and bronze shields
    p.rect(0, 10, 16, 12, '#d8d4cc'); p.rect(15, 6, 18, 16, '#e8e4dc'); p.rect(32, 11, 16, 11, '#d0ccc4');
    p.line(0, 10, 15, 10, '#ffffff'); p.line(15, 6, 32, 6, '#ffffff'); p.speck(0, 8, 48, 14, '#b8b4ac', 20);
    [[8, 14], [24, 12], [40, 15]].forEach(function (c) { p.disc(c[0], c[1], 4, '#c8a040'); p.disc(c[0], c[1], 2.6, '#e0b850'); p.px(c[0], c[1], '#8a6a2a'); });
  }
  function drawSerpih(p) { p.poly([[2, 9], [6, 2], [12, 4], [14, 10], [8, 11]], '#2a2230'); p.poly([[4, 8], [7, 4], [11, 5], [12, 9]], '#3a3242'); p.px(8, 6, '#b88ae8'); p.px(9, 7, '#8a5ab8'); p.ell(8, 11, 6, 1, 'rgba(30,16,40,0.8)'); }
  function drawBalangHitam(p) {   // 14x16: a small black jar with Mak Lampir's mark
    p.ell(7, 10, 6, 5.5, '#2a2230'); p.ell(6, 9, 4.5, 4, '#3a3242'); p.rect(5, 2, 4, 4, '#2a2230'); p.rect(4, 1, 6, 2, '#8a6a3a'); p.rect(5, 0, 4, 1, '#6a4a2a');
    p.px(7, 9, '#b88ae8'); p.px(8, 10, '#8a5ab8'); p.px(6, 10, '#8a5ab8'); p.px(4, 7, '#6a6a7a'); p.ell(7, 15, 5, 1, '#1e1028');
  }
  function drawGerbangArus(p) {   // 32x28: the black current, swirling down into the deep
    for (var i = 0; i < 4; i++) p.ell(16, 18, 14 - i * 3, 9 - i * 2, ['#1a1028', '#2a1a40', '#3a2a5a', '#1a0a20'][i]);
    for (var a = 0; a < 6.28; a += 0.9) p.line(16 + Math.cos(a) * 4, 18 + Math.sin(a) * 2.6, 16 + Math.cos(a + 0.7) * 12, 18 + Math.sin(a + 0.7) * 7.6, '#8a6ab8');
    p.px(6, 12, '#b88ae8'); p.px(26, 22, '#b88ae8'); p.px(16, 9, '#d8c8ff');
  }
  function drawPeriuk(p) {   // 22x20: Nek Lampir's big pot on three stones, bubbling green
    [[4, 17], [11, 18], [18, 17]].forEach(function (s) { p.ell(s[0], s[1], 3, 2, '#7a7a82'); });
    p.ell(11, 11, 9, 7, '#2a2a30'); p.ell(11, 10, 8, 6, '#3a3a42'); p.ell(11, 6, 8, 2.4, '#1a1a1e'); p.ell(11, 6, 7, 1.8, '#5ac85a');
    p.disc(8, 5, 1.2, '#9aff9a'); p.disc(14, 6, 1, '#9aff9a'); p.px(11, 4, '#ffffff'); p.rect(2, 7, 2, 2, '#2a2a30'); p.rect(18, 7, 2, 2, '#2a2a30');
  }
  function drawSpear(p, coral) {   // 24x6, pointing right
    p.line(0, 3, 18, 3, coral ? '#e8607a' : '#a08060'); p.line(0, 2, 3, 2, coral ? '#f08a9a' : '#c8a040');
    p.poly([[17, 0], [23, 3], [17, 6]], coral ? '#f08a9a' : '#c8a040'); p.px(21, 3, '#ffffff');
  }
  function drawOmbak(p) {   // 32x20: a wave crest, rolling right
    p.poly([[0, 20], [4, 10], [12, 4], [22, 2], [30, 6], [26, 8], [20, 7], [16, 10], [20, 20]], '#5ab8e8');
    p.poly([[4, 18], [8, 10], [14, 6], [22, 4], [28, 6], [22, 7], [16, 10], [14, 18]], '#8fd3ff');
    p.line(12, 5, 28, 5, '#ffffff'); p.px(30, 6, '#ffffff'); p.px(26, 9, '#ffffff'); p.speck(2, 10, 18, 9, '#d8f0ff', 10);
  }
  function drawPusaran(p) {   // 40x24: a whirlpool
    for (var i = 0; i < 5; i++) p.ell(20, 12, 19 - i * 3.6, 11 - i * 2.1, i % 2 ? 'rgba(90,184,232,0.55)' : 'rgba(30,70,120,0.6)');
    for (var a = 0; a < 6.28; a += 0.5) { var r = 4 + a * 2.3; p.px(20 + Math.cos(a * 2) * r, 12 + Math.sin(a * 2) * r * 0.55, '#d8f0ff'); }
  }
  function drawJet(p) { p.ell(9, 4, 7, 3, 'rgba(143,211,255,0.85)'); p.ell(11, 4, 4, 2, '#d8f0ff'); p.px(14, 3, '#ffffff'); p.px(3, 2, '#bfe8ff'); p.px(2, 6, '#bfe8ff'); }
  function drawBanjir(p) {   // 16x16, tiles: muddy flood water
    p.ctx.fillStyle = 'rgba(74,112,118,0.86)'; p.ctx.fillRect(0, 0, 16, 16);
    p.line(1, 3, 6, 3, 'rgba(214,236,232,0.75)'); p.line(9, 8, 14, 8, 'rgba(214,236,232,0.6)'); p.line(3, 13, 7, 13, 'rgba(214,236,232,0.7)'); p.px(12, 12, 'rgba(255,255,255,0.7)');
    p.px(12, 2, 'rgba(60,80,70,0.8)'); p.px(5, 9, 'rgba(60,80,70,0.8)'); p.px(14, 14, 'rgba(40,20,50,0.6)');
  }

  var IC = {
    serpihan_balang: function (p) { p.poly([[1, 9], [4, 3], [8, 5], [7, 11]], '#2a2230'); p.poly([[9, 4], [14, 3], [15, 8], [10, 9]], '#3a3242'); p.poly([[5, 12], [10, 11], [12, 15], [6, 15]], '#2a2230'); p.px(5, 7, '#b88ae8'); p.px(12, 6, '#8a5ab8'); },
    air_penawar: function (p) { p.rect(6, 1, 4, 2, '#8a6a3a'); p.rect(6, 3, 4, 3, '#9ad89a'); p.ell(8, 10, 5, 5, '#3a9a5a'); p.ell(8, 10, 4, 4, '#6ad87a'); p.ell(7, 9, 2, 2, '#c8ffc8'); p.px(10, 12, '#f2d06b'); },
    balang_hitam: function (p) { p.ell(8, 10, 6, 5, '#2a2230'); p.ell(7, 9, 4.5, 3.6, '#3a3242'); p.rect(6, 2, 4, 4, '#2a2230'); p.rect(5, 1, 6, 2, '#8a6a3a'); p.px(8, 9, '#b88ae8'); p.px(7, 10, '#8a5ab8'); },
    seruling_naga: function (p) { p.line(2, 13, 12, 3, '#f4f0e8', 3); p.line(2, 13, 12, 3, '#ffffff'); [[5, 10], [8, 7]].forEach(function (c) { p.px(c[0], c[1], '#e8607a'); }); p.disc(13, 3, 2.4, '#3fb0c0'); p.px(14, 2, '#2a1a10'); p.px(12, 0, '#f2c94c'); p.px(15, 1, '#f2c94c'); }
  };

  Art.generate16 = function (scene) {
    var make = Art.make;
    for (var f = 0; f < 2; f++) (function (f) {
      make(scene, 'laskar8_' + f, 16, 22, function (p) { drawLaskar(p, f); });
      make(scene, 'hoplit8_' + f, 16, 22, function (p) { drawHoplit(p, f); });
      make(scene, 'tinta8_' + f, 16, 14, function (p) { drawTinta(p, f); });
      make(scene, 'nagaibu8_' + f, 48, 36, function (p) { drawNagaIbu(p, f, true); });
      make(scene, 'npc_nagaibu_' + f, 48, 36, function (p) { drawNagaIbu(p, f, false); });
      make(scene, 'ketos8_' + f, 48, 36, function (p) { drawKetos(p, f, true); });
      make(scene, 'npc_ketos_' + f, 48, 36, function (p) { drawKetos(p, f, false); });
      make(scene, 'naga_ride_side_' + f, 40, 18, function (p) { drawRideSide(p, f); });
      make(scene, 'naga_ride_down_' + f, 24, 30, function (p) { drawRideDown(p, f); });
      make(scene, 'naga_ride_up_' + f, 24, 30, function (p) { drawRideUp(p, f); });
    })(f);
    make(scene, 'nagaibu_face', 24, 24, function (p) { drawNagaFace(p, false); });
    make(scene, 'nagaibu_face8', 24, 24, function (p) { drawNagaFace(p, true); });
    make(scene, 'ketos_face', 24, 24, function (p) { drawKetosFace(p, false); });
    make(scene, 'ketos_face8', 24, 24, function (p) { drawKetosFace(p, true); });
    make(scene, 'arus8', 256, 32, drawArus, false);
    make(scene, 'balang_pecah', 32, 32, drawBalangPecah, true);
    make(scene, 'batu_damai', 32, 18, drawBatuDamai, true);
    make(scene, 'gerbang_dua', 64, 52, drawGerbangDua, true);
    make(scene, 'khemah_kidul', 64, 48, drawKhemah, true);
    make(scene, 'panji_kidul', 16, 40, function (p) { drawPanji(p, true); }, true);
    make(scene, 'panji_atlantis', 16, 40, function (p) { drawPanji(p, false); }, true);
    make(scene, 'barikade', 48, 22, drawBarikade, true);
    make(scene, 'serpih8', 16, 12, drawSerpih, true);
    make(scene, 'balang_hitam', 14, 16, drawBalangHitam, true);
    make(scene, 'gerbang_arus', 32, 28, drawGerbangArus, false);
    make(scene, 'periuk_nek', 22, 20, drawPeriuk, true);
    make(scene, 'tombak8', 24, 6, function (p) { drawSpear(p, true); }, false);
    make(scene, 'lembing8', 24, 6, function (p) { drawSpear(p, false); }, false);
    make(scene, 'ombak8', 32, 20, drawOmbak, false);
    make(scene, 'pusaran8', 40, 24, drawPusaran, false);
    make(scene, 'jet8', 16, 8, drawJet, false);
    make(scene, 'banjir', 16, 16, drawBanjir, false);
    Object.keys(IC).forEach(function (id) { make(scene, 'i_' + id, 16, 16, IC[id], true); });
    // the two rulers, in the duel: their own pictures (art4.js) inside a glowing aura; her green selendang streams out, his trident sparks
    for (var g = 0; g < 2; g++) (function (f) {
      make(scene, 'ratu8_' + f, 28, 34, function (p, ctx) {
        p.ell(14, 20, 13, 15, 'rgba(122,255,200,0.18)'); p.ell(14, 20, 10, 12, 'rgba(122,255,200,0.16)');
        if (scene.textures.exists('npc_ratukidul_' + f)) ctx.drawImage(scene.textures.get('npc_ratukidul_' + f).getSourceImage(), 4, 6);
        var y = f ? 15 : 18, y2 = 34 - y;
        p.line(6, 16, 1, y, '#3fe8a0'); p.line(1, y, 2, y + 6, '#3fe8a0'); p.line(22, 16, 27, y2, '#3fe8a0'); p.line(27, y2, 26, y2 + 6, '#3fe8a0');
        p.px(1, y - 1, '#c8ffe8'); p.px(27, y2 - 1, '#c8ffe8'); p.px(f ? 3 : 25, 4, '#ffffff');
      });
      make(scene, 'poseidon8_' + f, 32, 40, function (p, ctx) {
        p.ell(16, 24, 15, 17, 'rgba(143,211,255,0.18)'); p.ell(16, 24, 11, 13, 'rgba(143,211,255,0.16)');
        if (scene.textures.exists('npc_poseidon_' + f)) ctx.drawImage(scene.textures.get('npc_poseidon_' + f).getSourceImage(), 4, 6);
        [[25, 5], [29, 8], [27, 2], [30, 4], [23, 9]].forEach(function (s, i) { p.px(s[0], s[1], (i + f) % 2 ? '#ffffff' : '#bfe8ff'); });
        p.line(27, 1, 29, 4, f ? '#fff3a0' : '#bfe8ff'); p.line(30, 9, 31, 12, f ? '#bfe8ff' : '#fff3a0');
      });
    })(g);
    var a = scene.anims;
    [['laskar8_walk', 'laskar8', 6], ['hoplit8_walk', 'hoplit8', 5], ['tinta8_walk', 'tinta8', 5], ['nagaibu8_walk', 'nagaibu8', 4], ['ketos8_walk', 'ketos8', 4],
     ['npc_nagaibu_idle', 'npc_nagaibu', 2], ['npc_ketos_idle', 'npc_ketos', 2], ['ratu8_walk', 'ratu8', 3], ['poseidon8_walk', 'poseidon8', 3]].forEach(function (k) {
      if (!a.exists(k[0])) a.create({ key: k[0], frames: [{ key: k[1] + '_0' }, { key: k[1] + '_1' }], frameRate: k[2], repeat: -1 });
    });
  };
})(window.LC);
