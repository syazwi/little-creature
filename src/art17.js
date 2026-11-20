/* Little Creature — procedural pixel art for Chapter 9 (v2.7): Kampung Pantai Kabus (Terengganu houses on posts, the old
 * healer's hut, fish racks, painted boats with the bangau bird at the bow, the sleepers on the beach, Pak Awang on his
 * mat), Pantai Bakau (mangrove trees on their stilt roots, root clumps, nipah, the old pinang palm and its mayang, the
 * well, the swing, the lamps on poles), the princesses' cave (shell mirrors, giant clams), the seven princesses (the
 * five sisters, Puteri Bongsu calm and wild, Puteri Sulung), dialogue faces, Pak Awang standing in the sea, the jump
 * scare face, the dark vignette, the whirlpool, the ritual, music notes, and item and skill icons. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art;

  // ---------------------------------------------------------------- Kampung Pantai Kabus
  function drawRumah(p, lit) {   // 64x48: a Terengganu house on tall posts, with carved panels and a clay-tile roof
    var WD = lit ? '#8a5a34' : '#5a3c26', WD2 = lit ? '#7a4e2c' : '#4a321e', RF = lit ? '#8a3a2a' : '#5a2a22', RF2 = lit ? '#6a2a1e' : '#42201a', GD = lit ? '#c8a040' : '#7a6a3a', PO = '#3a2618';
    [8, 22, 40, 54].forEach(function (x) { p.rect(x, 33, 2, 15, PO); });
    p.line(9, 46, 23, 36, '#2e1e14'); p.line(41, 36, 55, 46, '#2e1e14');
    p.rect(4, 31, 56, 3, '#6a4a2a');
    p.rect(6, 18, 52, 13, WD);
    for (var x = 8; x < 58; x += 4) p.line(x, 20, x, 30, WD2);
    p.rect(6, 18, 52, 2, GD); for (x = 8; x < 58; x += 4) p.px(x, 19, WD2);
    p.poly([[0, 19], [32, 2], [64, 19]], RF);
    for (var r = 6; r < 19; r += 3) p.line(32 - r * 1.75, r, 32 + r * 1.75, r, RF2);
    p.poly([[24, 16], [32, 8], [40, 16]], GD); p.poly([[27, 15], [32, 10], [37, 15]], RF2); p.px(32, 12, GD);
    p.line(0, 19, 32, 2, '#2e140e'); p.line(32, 2, 64, 19, '#2e140e');
    if (lit) {
      p.rect(13, 22, 9, 7, '#ffc870'); p.rect(13, 25, 9, 1, '#a8641e'); p.rect(17, 22, 1, 7, '#a8641e'); p.px(15, 23, '#fff0c0');
      p.rect(42, 22, 9, 7, '#2a1a10'); p.rect(42, 22, 4, 7, '#4a2e1e');
    } else {
      p.rect(13, 22, 9, 7, '#3a2418'); p.rect(17, 22, 1, 7, '#2a1a10');
      p.rect(42, 22, 9, 7, '#3a2418'); p.rect(45, 22, 1, 7, '#0a0604'); p.px(46, 24, '#d8c8b8'); p.px(46, 26, '#d8c8b8');   // somebody's fingers, on the edge of the shutter
    }
    p.rect(28, 21, 8, 10, '#2a1a10'); p.rect(28, 21, 8, 1, GD);
    for (var s = 0; s < 5; s++) p.rect(29 + s * 0.6, 34 + s * 2.6, 6, 1, '#6a4a2a');
    p.outline('#140c08');
  }
  function drawPondok(p) {   // 48x48: the healer's hut: thatch, hanging herbs, little lamps on the steps
    var PO = '#3a2618';
    [6, 22, 40].forEach(function (x) { p.rect(x, 36, 2, 12, PO); });
    p.rect(3, 34, 42, 3, '#6a4a2a');
    p.rect(5, 20, 38, 14, '#7a5a3a'); for (var x = 7; x < 43; x += 3) p.line(x, 21, x, 33, '#6a4a2e');
    p.poly([[0, 22], [24, 4], [48, 22]], '#8a7a4a'); for (var r = 8; r < 22; r += 3) p.line(24 - r * 1.3, r, 24 + r * 1.3, r, '#6a5a34');
    for (x = 1; x < 48; x += 2) p.line(x, 22, x, 24 + (x % 4 ? 0 : 1), '#6a5a34');
    [[9, 25], [14, 26], [34, 25], [39, 26]].forEach(function (h, i) { p.line(h[0], 24, h[0], h[1] + 3, '#4a3a2a'); p.rect(h[0] - 1, h[1] + 3, 3, 4, i % 2 ? '#5a7a3a' : '#7a6a3a'); p.px(h[0], h[1] + 7, '#3a5a2a'); });
    p.rect(20, 24, 8, 10, '#ffb860'); p.rect(20, 24, 8, 1, '#5a3a20'); p.px(23, 27, '#ffe0a0');
    [[18, 40], [30, 40], [16, 45], [32, 45]].forEach(function (l) { p.rect(l[0], l[1], 2, 2, '#8a6a3a'); p.px(l[0], l[1] - 1, '#ffd080'); p.px(l[0] + 1, l[1] - 2, '#fff0b0'); });
    for (var s = 0; s < 4; s++) p.rect(21, 37 + s * 2.6, 6, 1, '#6a4a2a');
    p.outline('#140c08');
  }
  function drawPara(p) {   // 48x16: a rack of drying fish
    p.line(2, 15, 6, 3, '#5a4030'); p.line(10, 15, 6, 3, '#5a4030'); p.line(38, 15, 42, 3, '#5a4030'); p.line(46, 15, 42, 3, '#5a4030');
    p.line(4, 4, 44, 4, '#7a5a3a');
    for (var x = 9; x < 40; x += 4) { p.line(x, 4, x, 6, '#5a4030'); p.ell(x, 9, 1.4, 3, '#a8b0b8'); p.px(x, 7, '#d8e0e8'); p.px(x, 12, '#7a8088'); }
    p.outline('#1e140c');
  }
  function drawPerahu(p, w) {   // a Terengganu boat on the sand: red, green and gold, the bangau bird at the bow
    var k = w / 48;
    p.poly([[2 * k, 6], [8 * k, 13], [36 * k, 13], [44 * k, 6]], '#b8322a');
    p.poly([[3 * k, 6], [44 * k, 6], [42 * k, 9], [5 * k, 9]], '#2a7a4a');
    p.line(3 * k, 6, 44 * k, 6, '#e9c46a'); p.line(7 * k, 12, 37 * k, 12, '#7a1e1a');
    p.line(44 * k, 6, 46 * k, 1, '#e9c46a', 2); p.ell(46.5 * k, 1.5, 1.6, 1.2, '#f4f0e8'); p.line(47 * k, 2, w - 1, 3, '#e9c46a');   // the bangau's head and long beak
    p.line(2 * k, 6, 1, 2, '#e9c46a', 2);
    p.rect(14 * k, 4, 2, 2, '#7a5a3a'); p.rect(30 * k, 4, 2, 2, '#7a5a3a');
    for (var x = 10; x < 36; x += 6) p.px(x * k, 8, '#e9c46a');
    p.outline('#1e0c08');
  }
  function drawTidur(p, v) {   // 16x24: a fisherman on the beach, from behind, with his eyes shut, facing the sea
    var SH = ['#4a6a8a', '#8a6a4a', '#5a7a5a'][v], KN = ['#6a2a3a', '#2a3a6a', '#4a4a2a'][v], SK = '#b8a898';
    p.rect(5, 15, 6, 8, KN); for (var y = 16; y < 23; y += 2) p.line(5, y, 10, y, '#2a1a1a'); p.line(7, 15, 7, 22, '#2a1a1a');
    p.rect(5, 8, 6, 7, SH); p.rect(4, 9, 1, 6, SK); p.rect(11, 9, 1, 6, SK); p.px(4, 15, SK); p.px(11, 15, SK);
    p.rect(5, 2, 6, 6, '#1a1210'); p.rect(4, 4, 1, 3, SK); p.rect(11, 4, 1, 3, SK);
    if (v === 1) { p.rect(4, 1, 8, 2, '#c8b070'); }
    p.outline('#0e0a08');
  }
  function drawAwangTidur(p) {   // 32x14: Pak Awang on a woven mat, cold and still
    p.rect(1, 5, 30, 8, '#c8a878'); for (var x = 2; x < 31; x += 3) p.line(x, 5, x, 12, '#a8885a'); p.line(1, 8, 30, 8, '#a8885a');
    p.ell(6, 7, 3, 3, '#a8b0a0'); p.rect(3, 4, 6, 2, '#1a1210'); p.px(5, 7, '#5a5a5a'); p.px(7, 7, '#5a5a5a');
    p.rect(9, 5, 19, 5, '#2a4a7a'); for (x = 10; x < 28; x += 3) p.line(x, 5, x, 9, '#c83a3a'); p.line(9, 7, 27, 7, '#1e2a4a');
    p.rect(27, 6, 3, 3, '#a8b0a0');
    p.outline('#2a1e14');
  }

  // ---------------------------------------------------------------- Pantai Bakau
  function drawBakau(p, w, h, v) {   // a mangrove tree, up on its stilt roots, dark at night
    var TR = '#3a2e24', RT = '#2e241c', L1 = '#1e3a2a', L2 = '#2a4a34', L3 = '#3a5a44', cx = w / 2;
    for (var i = 0; i < 6; i++) { var bx = 2 + i * (w - 4) / 5, top = h - 14 + (i % 2) * 2; p.line(cx, h - 18, bx, h - 1, RT, 2); p.line(bx, h - 1, bx + (i < 3 ? 1 : -1), top + 8, RT); }
    p.line(cx, h - 18, cx, h * 0.45, TR, 3);
    p.ell(cx, h * 0.34, w * 0.48, h * 0.3, L1);
    p.ell(cx - w * 0.12, h * 0.28, w * 0.3, h * 0.18, L2); p.ell(cx + w * 0.15, h * 0.36, w * 0.26, h * 0.16, L2);
    p.speck(3, 3, w - 6, h * 0.5, L3, v ? 18 : 24); p.speck(3, h * 0.3, w - 6, h * 0.25, '#14281e', 16);
    p.outline('#0a120c');
  }
  function drawAkar(p, b) {   // 16x10: arching roots (or a bed of root spikes) in the mud
    if (!b) { p.line(1, 9, 5, 3, '#2e241c', 2); p.line(5, 3, 9, 9, '#2e241c', 2); p.line(7, 9, 11, 4, '#3a2e24'); p.line(11, 4, 15, 9, '#3a2e24'); }
    else { [2, 5, 7, 10, 13].forEach(function (x, i) { p.line(x, 9, x + (i % 2 ? 1 : 0), 4 + (i % 3), '#3a2e24'); }); p.rect(1, 8, 14, 2, '#1e1a14'); }
    p.outline('#0a0806');
  }
  function drawNipah(p) {   // 16x16: nipah palm fronds rising out of the water's edge
    [[8, 15, 1, 2], [8, 15, 4, 0], [8, 15, 12, 1], [8, 15, 15, 4], [8, 15, 8, 0]].forEach(function (l) { p.line(l[0], l[1], l[2], l[3], '#2a4a2a', 2); p.line(l[0], l[1], l[2], l[3], '#3a5a34'); });
    p.outline('#0a120a');
  }
  function drawPinangTua(p) {   // 32x48: the old pinang palm, leaning out over the black water, its mayang hanging pale
    for (var i = 0; i <= 20; i++) { var t = i / 20, x = 12 + t * 9, y = 47 - t * 38; p.disc(x, y, 1.6, '#6a5a44'); if (i % 3 === 0) p.px(x - 1, y, '#4a3e2e'); }
    [[21, 9, 5, 2], [21, 9, 2, 10], [21, 9, 31, 3], [21, 9, 30, 13], [21, 9, 14, 0], [21, 9, 27, 0], [21, 9, 10, 14]].forEach(function (l) { p.line(l[0], l[1], l[2], l[3], '#1e3a24', 2); p.line(l[0], l[1], l[2], l[3], '#2e4a30'); });
    p.ell(18, 17, 2.2, 6, '#e8dcc0'); p.ell(18.5, 16, 1.2, 4.6, '#fff8e8'); p.px(17, 23, '#c8b890'); p.px(18, 24, '#c8b890');
    p.disc(21, 10, 2.6, '#3a5a34');
    p.outline('#0a0e08');
  }
  function drawPerigi(p) {   // 32x28: an old stone well, mossy, with black water far down
    p.ell(16, 18, 14, 8, '#5a5a5e'); p.ell(16, 16, 12, 6, '#6a6a70'); p.ell(16, 16, 9, 4, '#0a1418'); p.ell(15, 15.5, 4, 1.2, '#1a2a30');
    for (var x = 4; x < 30; x += 5) p.line(x, 19, x + 1, 25, '#46464a');
    p.speck(3, 12, 26, 12, '#3a5a3a', 14);
    p.line(4, 15, 4, 3, '#5a4030', 2); p.line(28, 15, 28, 3, '#5a4030', 2); p.line(3, 3, 29, 3, '#6a4a30', 2);
    p.line(16, 3, 16, 9, '#a8987a'); p.rect(14, 9, 4, 3, '#6a4a30');
    p.outline('#0e0e10');
  }
  function drawBuaian(p) {   // 32x40: a mangrove trunk with a branch reaching out (the swing hangs from it: buaian9s)
    var TR = '#3a2e24';
    p.line(5, 39, 6, 6, TR, 4); p.line(6, 6, 30, 3, TR, 3); p.line(18, 4, 22, 0, TR);
    [[0, 39], [3, 39], [9, 39], [12, 39]].forEach(function (r) { p.line(6, 30, r[0], r[1], '#2e241c', 2); });
    p.ell(10, 4, 8, 4, '#1e3a2a'); p.ell(26, 2, 6, 2.5, '#1e3a2a'); p.speck(3, 1, 30, 6, '#2a4a34', 14);
    p.outline('#0a120c');
  }
  function drawSwing(p) {   // 12x26: two ropes and a plank seat (it creaks, all by itself)
    p.line(2, 0, 2, 23, '#a8987a'); p.line(9, 0, 9, 23, '#a8987a');
    p.rect(0, 23, 12, 2, '#7a5a3a'); p.rect(0, 25, 12, 1, '#4a3420');
    p.outline('#140e08');
  }
  function drawPelitaPole(p) {   // 16x32: an old oil lamp on a pole
    p.line(8, 31, 8, 10, '#5a4030', 2); p.rect(5, 30, 6, 2, '#3a2a1e');
    p.rect(5, 8, 6, 3, '#c8a040'); p.rect(6, 6, 4, 2, '#e9c46a'); p.line(4, 11, 11, 11, '#8a6a2a');
    p.ell(8, 3, 2, 3, '#ffb040'); p.ell(8, 3.6, 1, 1.8, '#fff0b0');
    p.outline('#1a120a');
  }
  function drawUpacara(p) {   // 32x16: the mayang in a jar between two lamps, and seven bowls of yellow rice
    p.ell(16, 10, 4, 4, '#8a5a3a'); p.rect(13, 5, 6, 2, '#7a4a2e');
    for (var i = 0; i < 7; i++) p.line(16, 6, 10 + i * 2, 0 + (i % 2), '#f4ecd8');
    [3, 29].forEach(function (x) { p.rect(x - 1, 10, 3, 3, '#c8a040'); p.px(x, 8, '#ffb040'); p.px(x, 7, '#fff0b0'); });
    for (i = 0; i < 7; i++) { var bx = 4 + i * 4; p.rect(bx, 14, 3, 2, '#d8d0c0'); p.px(bx + 1, 13, '#f2c94c'); p.px(bx, 14, '#f2c94c'); p.px(bx + 2, 14, '#e0a830'); }
    p.outline('#140c08');
  }
  function drawPusaran(p) {   // 32x18: a whirlpool, glowing faintly from far below
    p.ell(16, 9, 15, 8, '#0e2a3a'); p.ell(16, 9, 11, 6, '#123a4e'); p.ell(16, 9, 7, 3.6, '#1a5068'); p.ell(16, 9, 3, 1.6, '#7ae8e0');
    for (var a = 0; a < 6; a++) { var t = a / 6 * Math.PI * 2; p.line(16 + Math.cos(t) * 4, 9 + Math.sin(t) * 2, 16 + Math.cos(t + 0.9) * 13, 9 + Math.sin(t + 0.9) * 7, '#c8f0f0'); }
  }

  // ---------------------------------------------------------------- Gua Puteri Tujuh
  function drawCermin(p) {   // 32x32: a mirror of polished shell (with something faint in it)
    for (var i = 0; i < 9; i++) { var a = Math.PI + i / 8 * Math.PI; p.disc(16 + Math.cos(a) * 12, 14 + Math.sin(a) * 12, 3.2, i % 2 ? '#f4d8e0' : '#e8c8d0'); }
    p.rect(4, 14, 24, 16, '#e8c8d0'); p.ell(16, 16, 10, 12, '#2a3a5a'); p.rect(6, 16, 20, 13, '#2a3a5a'); p.ell(16, 14, 9, 10, '#3a4e70');
    p.ell(19, 18, 2, 3, 'rgba(220,240,255,0.35)'); p.rect(18, 20, 3, 8, 'rgba(220,240,255,0.25)');   // ...a pale shape, behind your shoulder
    p.line(10, 8, 13, 6, '#8ab0d8');
    p.rect(2, 29, 28, 3, '#c8a8b0');
    p.outline('#2a1a24');
  }
  function drawKima(p, open, lit) {   // 32x16 (closed) or 32x22 (open): a giant clam
    var SH = '#d8d0c0', RG = '#a89a88', LIP = '#2a7a9a';
    if (!open) {
      p.ell(16, 10, 15, 6, SH); for (var x = 3; x < 30; x += 4) p.line(16, 15, x, 5, RG);
      for (x = 2; x < 31; x += 4) { p.line(x, 9, x + 2, 11, LIP); p.line(x + 2, 11, x + 4, 9, LIP); }
      p.ell(16, 13, 13, 3, '#b8ae9c');
    } else {
      p.ell(16, 7, 14, 6, SH); for (x = 4; x < 29; x += 4) p.line(16, 1, x, 11, RG);
      p.ell(16, 16, 14, 5, '#f4d8e0'); p.ell(16, 16, 11, 3.4, lit ? '#fff0c0' : '#c8b8c8');
      p.ell(16, 19, 15, 3, SH);
      if (lit) { p.disc(16, 15, 2.6, '#ffe8a0'); p.disc(16, 15, 1.4, '#ffffff'); [[10, 17], [21, 17], [13, 18], [19, 18]].forEach(function (c) { p.px(c[0], c[1], '#ffffff'); }); }
    }
    p.outline('#2a2018');
  }

  // ---------------------------------------------------------------- the seven princesses
  function drawPuteri(p, f, o) {   // o: { w, h, dress, dress2, hair, glow, crown, wild, calm, eye }
    var w = o.w, cx = Math.floor(w / 2), h = o.h, SK = o.skin || '#d8e4e0', top = o.crown ? 6 : 3;
    var sw = f ? 1 : 0;
    // the dress fades into the water at the hem
    p.poly([[cx - 4, top + 11], [cx + 4, top + 11], [cx + 6, h - 3], [cx - 6, h - 3]], o.dress);
    p.poly([[cx - 6, h - 3], [cx + 6, h - 3], [cx + 5, h - 1], [cx - 5, h - 1]], o.dress2);
    p.rect(cx - 5, h - 2, 1, 1, o.dress2); p.rect(cx + 4, h - 1, 1, 1, o.dress2);
    p.rect(cx - 3, top + 8, 6, 4, o.dress); p.rect(cx - 3, top + 8, 6, 1, o.trim || '#e9c46a');
    // long hair, falling down the back and over the shoulders
    var HR = o.hair;
    if (o.wild) {
      for (var i = 0; i < 6; i++) p.line(cx, top + 1, cx - 10 + i * 4 + (f ? 1 : -1), top - 3 + (i % 2) * 2 + (f ? 0 : 1), HR, 2);
      p.line(cx - 4, top + 4, 1, top + 14 + sw, HR, 2); p.line(cx + 4, top + 4, w - 2, top + 13 - sw, HR, 2);
      p.line(cx - 3, top + 9, 0, top + 9 + sw, SK); p.line(cx + 3, top + 9, w - 1, top + 8 - sw, SK);   // arms, reaching
    } else {
      p.rect(cx - 4, top + 2, 8, 12 + (o.longHair || 4), HR); p.px(cx - 5 + sw, top + 14, HR); p.px(cx + 4 - sw, top + 15, HR);
      p.rect(cx - 4, top + 9, 1, 4, SK); p.rect(cx + 3, top + 9, 1, 4, SK);
    }
    p.rect(cx - 3, top + 1, 6, 6, SK); p.rect(cx - 3, top, 6, 2, HR); p.px(cx - 3, top + 2, HR); p.px(cx + 2, top + 2, HR);
    if (o.wild) { p.rect(cx - 2, top + 3, 2, 2, '#ffffff'); p.rect(cx + 1, top + 3, 2, 2, '#ffffff'); p.rect(cx - 1, top + 5, 2, 2, '#1a0a14'); }
    else if (o.calm) { p.px(cx - 2, top + 3, '#2a3a4a'); p.px(cx + 1, top + 3, '#2a3a4a'); p.px(cx - 1, top + 5, '#c88a8a'); }
    else { p.px(cx - 2, top + 3, o.eye || '#9affff'); p.px(cx + 1, top + 3, o.eye || '#9affff'); }
    if (o.flower) { p.px(cx + 3, top + 1, '#ff9ac8'); p.px(cx + 4, top + 2, '#ff9ac8'); p.px(cx + 3, top + 2, '#ffe08a'); }
    if (o.crown) {
      [[cx - 4, 2], [cx - 2, 0], [cx, 1], [cx + 2, 0], [cx + 4, 2]].forEach(function (c, k) { p.line(c[0], top, c[0], c[1], k % 2 ? '#f07a8a' : '#e85a6a'); });
      [[cx - 3, top - 1], [cx + 1, top - 1], [cx + 3, top - 1]].forEach(function (c) { p.px(c[0], c[1], '#ffffff'); });
      p.line(cx - 4, top, cx + 4, top, '#f4ecd8');
    }
    p.outline(o.out || '#0a1a20');
  }
  var SIS = { w: 16, h: 28, dress: '#8ab8b0', dress2: 'rgba(138,184,176,0.45)', hair: '#0e1418', trim: '#c8e8e0', longHair: 6 };
  var BONGSU = { w: 16, h: 26, dress: '#a8d8e8', dress2: 'rgba(168,216,232,0.5)', hair: '#1a1a22', calm: true, flower: true, skin: '#e8e0d8', trim: '#ffffff', longHair: 4, out: '#14242c' };
  var BONGSUW = { w: 24, h: 30, dress: '#6a9aa8', dress2: 'rgba(106,154,168,0.45)', hair: '#06080a', wild: true, skin: '#c8d8d8', trim: '#c8e8e0', out: '#04080a' };
  var SULUNG = { w: 18, h: 32, dress: '#2a8a8a', dress2: 'rgba(42,138,138,0.5)', hair: '#0e1418', crown: true, calm: true, skin: '#e8dcd0', trim: '#f2c94c', longHair: 8, out: '#06201e' };
  function drawFace(p, o) {   // 24x24 portraits
    var SK = o.skin, HR = o.hair;
    if (!o.man) { p.rect(3, 4, 18, 20, HR); p.rect(1, 12, 3, 12, HR); p.rect(20, 12, 3, 12, HR); }
    p.ell(12, 13, 7, 8, SK); p.rect(5, 4, 14, 4, HR); p.px(5, 8, HR); p.px(18, 8, HR);
    if (o.wild) {
      p.rect(7, 10, 4, 3, '#ffffff'); p.rect(13, 10, 4, 3, '#ffffff'); p.px(9, 11, '#1a0a14'); p.px(15, 11, '#1a0a14');
      p.ell(12, 18, 2.4, 2.6, '#1a0a14'); p.line(4, 7, 0, 15, HR, 2); p.line(20, 7, 23, 16, HR, 2); p.line(5, 5, 0, 7, HR); p.line(19, 5, 23, 8, HR);   // hair, streaming out sideways
    } else if (o.white) {
      p.rect(7, 11, 3, 2, '#ffffff'); p.rect(14, 11, 3, 2, '#ffffff'); p.line(10, 18, 14, 18, '#5a4a4a'); p.speck(6, 9, 12, 10, '#a8b8b8', 6);
    } else {
      p.rect(8, 11, 2, 2, o.eye || '#2a3a4a'); p.rect(14, 11, 2, 2, o.eye || '#2a3a4a'); p.px(8, 11, '#ffffff'); p.px(14, 11, '#ffffff');
      p.line(10, 17, 13, 17, o.mouth || '#b87a7a');
    }
    if (o.flower) { p.disc(19, 6, 2, '#ff9ac8'); p.px(19, 6, '#ffe08a'); }
    if (o.crown) { [[6, 4], [9, 1], [12, 0], [15, 1], [18, 4]].forEach(function (c, k) { p.line(c[0], 5, c[0], c[1], k % 2 ? '#f07a8a' : '#e85a6a', 2); }); [[8, 4], [12, 3], [16, 4]].forEach(function (c) { p.px(c[0], c[1], '#ffffff'); }); }
    if (o.man) { p.rect(5, 3, 14, 4, '#1a1210'); p.rect(4, 6, 2, 5, '#1a1210'); p.rect(18, 6, 2, 5, '#1a1210'); p.rect(8, 20, 8, 2, '#3a2a1a'); p.rect(6, 23, 12, 1, '#2a4a6a'); }
    p.outline(o.out || '#0a1418');
  }
  function drawAwangLaut(p, turned) {   // 16x20: Pak Awang, waist-deep in the black sea (from behind; or with his head turned)
    var SK = '#a8a898';
    p.rect(4, 7, 8, 8, '#2a4a6a'); p.rect(3, 8, 1, 6, SK); p.rect(12, 8, 1, 6, SK);
    p.rect(5, 1, 6, 6, '#1a1210');
    if (turned) { p.rect(5, 2, 4, 5, SK); p.rect(5, 1, 6, 2, '#1a1210'); p.px(6, 3, '#ffffff'); p.px(8, 3, '#ffffff'); p.px(7, 5, '#2a1a1a'); }
    p.rect(0, 15, 16, 5, '#0a1a24'); p.line(0, 15, 15, 15, '#5a8aa0'); p.px(2, 16, '#3a6a80'); p.px(13, 17, '#3a6a80');
    p.outline('#06080a');
  }
  function drawWajah(p, ctx) {   // 64x64: the face in the dark (a jump scare, but no gore: just pale, wet and very close)
    p.rect(0, 0, 64, 64, '#05070a');
    p.ell(32, 30, 22, 26, '#0a0d10'); p.rect(10, 30, 44, 34, '#0a0d10');                 // long black hair behind the head
    p.ell(32, 35, 13, 17, '#aab6b6'); p.ell(32, 33, 12, 15, '#c4d0ce'); p.ell(31, 30, 9, 9, '#d2dcda');   // a pale, wet face
    p.speck(21, 22, 22, 26, '#9aa8a8', 22);
    p.ell(26, 31, 3.8, 4.6, '#0a0c10'); p.ell(38, 31, 3.8, 4.6, '#0a0c10');             // dark hollow eyes...
    p.rect(26, 31, 2, 2, '#e8ffff'); p.rect(38, 31, 2, 2, '#e8ffff');                 // ...with a cold light in each
    p.px(27, 30, '#9affff'); p.px(39, 30, '#9affff');
    p.line(32, 33, 31, 39, '#9aa6a6');
    p.ell(32, 45, 2.6, 4, '#0a0c10'); p.ell(32, 44, 1.4, 1.6, '#1a1014');              // the mouth, open, as if singing
    for (var i = 0; i < 9; i++) { var x = 20 + i * 3; p.line(x, 12, x + (i % 2 ? 1 : -1), 20 + (i % 3) * 3, '#06080a', 2); }   // wet hair over the forehead
    p.line(19, 14, 17, 62, '#06080a', 4); p.line(45, 14, 47, 62, '#06080a', 4);      // ...and down both sides
    p.line(22, 24, 20, 56, '#06080a', 2); p.line(42, 24, 44, 58, '#06080a', 2);
    var g = ctx.createRadialGradient(32, 34, 12, 32, 34, 40); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.85)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64);
  }
  function drawVignette(p, ctx) {   // 256x160: dark at the edges of the screen, clear in the middle
    var g = ctx.createRadialGradient(128, 80, 44, 128, 80, 150);
    g.addColorStop(0, 'rgba(4,6,12,0)'); g.addColorStop(0.55, 'rgba(4,6,12,0.45)'); g.addColorStop(1, 'rgba(2,3,8,0.96)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 160);
  }

  var IC = {
    mayang_pinang: function (p) { p.ell(7, 8, 3, 7, '#c8b890'); p.ell(7.5, 7, 2, 5.5, '#f4ecd8'); for (var i = 0; i < 5; i++) p.line(8, 9, 11 + i, 2 + i * 2, '#fff8e8'); p.px(14, 3, '#ffffff'); p.px(15, 7, '#ffffff'); },
    nasi_kunyit: function (p) { p.ell(8, 9, 6, 4, '#f2c94c'); p.disc(8, 8, 4, '#f2c94c'); p.px(6, 6, '#fff0a0'); p.px(9, 5, '#e0a830'); p.rect(2, 10, 12, 4, '#d8d0c0'); p.rect(3, 13, 10, 2, '#b8b0a0'); p.px(12, 6, '#5a8a3a'); },
    semangat_awang: function (p) { p.ell(8, 11, 7, 4, '#d8d0c0'); p.ell(8, 10, 5, 2.4, '#f4d8e0'); p.disc(8, 7, 4, 'rgba(255,232,160,0.6)'); p.disc(8, 7, 2.6, '#ffe8a0'); p.disc(8, 7, 1.2, '#ffffff'); },
    mayang: function (p) { p.ell(5, 9, 2.4, 6, '#f4ecd8'); for (var i = 0; i < 4; i++) p.line(6, 10, 8 + i, 3 + i * 2, '#fff8e8'); p.disc(12, 12, 2, '#9ae8e0'); p.line(13, 12, 13, 4, '#9ae8e0', 2); p.line(13, 4, 15, 6, '#9ae8e0', 2); }
  };

  Art.generate17 = function (scene) {
    var make = Art.make;
    make(scene, 'rumah9', 64, 48, function (p) { drawRumah(p, true); });
    make(scene, 'rumah9b', 64, 48, function (p) { drawRumah(p, false); });
    make(scene, 'pondok9', 48, 48, drawPondok);
    make(scene, 'para9', 48, 16, drawPara);
    make(scene, 'perahu9', 48, 16, function (p) { drawPerahu(p, 48); });
    make(scene, 'perahu9s', 32, 16, function (p) { drawPerahu(p, 32); });
    for (var v = 0; v < 3; v++) (function (v) { make(scene, 'tidur9_' + v, 16, 24, function (p) { drawTidur(p, v); }); })(v);
    make(scene, 'awang_tidur', 32, 14, drawAwangTidur);
    make(scene, 'bakau9', 32, 40, function (p) { drawBakau(p, 32, 40, 0); });
    make(scene, 'bakau9b', 24, 36, function (p) { drawBakau(p, 24, 36, 1); });
    make(scene, 'akar9', 16, 10, function (p) { drawAkar(p, false); });
    make(scene, 'akar9b', 16, 10, function (p) { drawAkar(p, true); });
    make(scene, 'nipah9', 16, 16, drawNipah);
    make(scene, 'pinang_tua', 32, 48, drawPinangTua);
    make(scene, 'perigi9', 32, 28, drawPerigi);
    make(scene, 'buaian9', 32, 40, drawBuaian);
    make(scene, 'buaian9s', 12, 26, drawSwing);
    make(scene, 'pelita9', 16, 32, drawPelitaPole);
    make(scene, 'upacara9', 32, 16, drawUpacara);
    make(scene, 'pusaran9', 32, 18, drawPusaran);
    make(scene, 'cermin9', 32, 32, drawCermin);
    make(scene, 'kima9', 32, 16, function (p) { drawKima(p, false); });
    make(scene, 'kima9o', 32, 22, function (p) { drawKima(p, true, false); });
    make(scene, 'kima9l', 32, 22, function (p) { drawKima(p, true, true); });
    for (var f = 0; f < 2; f++) (function (f) {
      make(scene, 'puteri9_' + f, 16, 28, function (p) { drawPuteri(p, f, SIS); });
      make(scene, 'npc_puteri_bongsu_' + f, 16, 26, function (p) { drawPuteri(p, f, BONGSU); });
      make(scene, 'bongsu9w_' + f, 24, 30, function (p) { drawPuteri(p, f, BONGSUW); });
      make(scene, 'sulung9_' + f, 18, 32, function (p) { drawPuteri(p, f, SULUNG); });
    })(f);
    make(scene, 'bongsu_face', 24, 24, function (p) { drawFace(p, { skin: '#e8e0d8', hair: '#1a1a22', flower: true, mouth: '#c88a8a', out: '#14242c' }); });
    make(scene, 'bongsu_face9', 24, 24, function (p) { drawFace(p, { skin: '#c8d8d8', hair: '#06080a', wild: true, out: '#04080a' }); });
    make(scene, 'sulung_face', 24, 24, function (p) { drawFace(p, { skin: '#e8dcd0', hair: '#0e1418', crown: true, eye: '#1a5a5a', out: '#06201e' }); });
    make(scene, 'puteri_face9', 24, 24, function (p) { drawFace(p, { skin: '#d8e4e0', hair: '#0e1418', eye: '#5affff', mouth: '#6a8a8a' }); });
    make(scene, 'awang_face9', 24, 24, function (p) { drawFace(p, { skin: '#a8a898', hair: '#1a1210', white: true, man: true, out: '#06080a' }); });
    make(scene, 'awang_laut9_0', 16, 20, function (p) { drawAwangLaut(p, false); });
    make(scene, 'awang_laut9_1', 16, 20, function (p) { drawAwangLaut(p, true); });
    make(scene, 'wajah9', 64, 64, drawWajah);
    make(scene, 'vignette9', 256, 160, drawVignette);
    make(scene, 'nasi9', 8, 6, function (p) { p.rect(0, 3, 8, 3, '#d8d0c0'); p.ell(4, 3, 3, 2, '#f2c94c'); p.px(3, 2, '#fff0a0'); }, true);
    make(scene, 'orb9', 12, 12, function (p) { p.disc(6, 6, 5, 'rgba(255,232,160,0.5)'); p.disc(6, 6, 3.4, '#ffe8a0'); p.disc(6, 6, 1.6, '#ffffff'); });
    make(scene, 'note9', 7, 10, function (p) { p.ell(2, 8, 2, 1.6, '#ffffff'); p.line(4, 8, 4, 0, '#ffffff'); p.line(4, 0, 6, 2, '#ffffff'); }, false);
    Object.keys(IC).forEach(function (id) { make(scene, (id === 'mayang' ? 'ic_' : 'i_') + id, 16, 16, IC[id], true); });
    var a = scene.anims;
    [['puteri9_walk', 'puteri9', 3], ['sulung9_walk', 'sulung9', 2], ['bongsu9w_walk', 'bongsu9w', 6]].forEach(function (k) {
      if (!a.exists(k[0])) a.create({ key: k[0], frames: [{ key: k[1] + '_0' }, { key: k[1] + '_1' }], frameRate: k[2], repeat: -1 });
    });
  };
})(window.LC);
