/* Little Creature — procedural pixel art for the wider world (v1.3): new tiles, kampung buildings, villagers,
 * critters, folk spirits, forage spots, fishing bits and item icons. Same rules as art.js: no image files. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art, OUT = '#2a1d18';

  // ================================================================== TILES (appended after art.js's 23 tiles)
  function fg(p, v) {
    p.rect(0, 0, 16, 16, '#3f6e35'); p.speck(0, 0, 16, 16, '#355f2d', 22); p.speck(0, 0, 16, 16, '#4b7c3c', 12);
    for (var i = 0; i < 3; i++) { var x = p.ri(14), y = p.ri(14); p.px(x, y, '#8f6a36'); p.px(x + 1, y, '#7a5a2e'); }
    if (v) { p.px(3 + p.ri(10), 3 + p.ri(10), '#f0e6a0'); p.speck(0, 0, 16, 16, '#5a8c45', 6); }
  }
  function pond(p, f) {
    p.rect(0, 0, 16, 16, '#2f6f78'); p.speck(0, 0, 16, 16, '#285f68', 18);
    for (var i = 0; i < 3; i++) { var x = (i * 6 + f * 3) % 13, y = 2 + i * 5; p.rect(x, y, 3, 1, '#62aeb0'); }
  }
  function sea(p, f) {
    p.rect(0, 0, 16, 16, '#2a6db0'); p.speck(0, 0, 16, 16, '#25619e', 18);
    for (var i = 0; i < 4; i++) { var x = (i * 5 + f * 3 + (i % 2) * 6) % 14, y = 1 + i * 4; p.rect(x, y, 3, 1, '#5fa8e0'); p.px((x + 8) % 15, y + 2, '#1f5a96'); }
  }
  function shallow(p, f) {
    p.rect(0, 0, 16, 16, '#3fb5c4'); p.speck(0, 0, 16, 16, '#4fc4cf', 14); p.speck(0, 0, 16, 16, '#a8e6e0', 4);
    for (var i = 0; i < 3; i++) { var x = (i * 6 + f * 4) % 13, y = 2 + i * 5; p.rect(x, y, 2, 1, '#bff2f2'); }
  }
  function rock(p, v) {
    p.rect(0, 0, 16, 16, '#8a8378'); p.speck(0, 0, 16, 16, '#776f64', 20); p.speck(0, 0, 16, 16, '#9d968a', 14);
    for (var i = 0; i < 2; i++) { var x = 1 + p.ri(13), y = 1 + p.ri(13); p.rect(x, y, 2, 1, '#a8a296'); p.px(x, y + 1, '#655e55'); }
    if (v) p.speck(0, 0, 16, 16, '#6f8a4a', 8);
  }
  function cliff(p) {
    p.rect(0, 0, 16, 16, '#5a5048'); p.speck(0, 0, 16, 16, '#4e453e', 16);
    [3, 8, 13].forEach(function (y) { p.rect(0, y, 16, 1, '#463e37'); p.rect(0, y - 1, 16, 1, '#746a5f'); });
    p.speck(0, 0, 16, 16, '#6a7a4a', 4);
  }
  function stonePath(p) {
    p.rect(0, 0, 16, 16, '#7f786e');
    [[1, 1, 6, 6], [8, 1, 7, 5], [1, 8, 5, 7], [7, 7, 8, 8]].forEach(function (s) { p.rect(s[0], s[1], s[2], s[3], '#a39d92'); p.rect(s[0], s[1], s[2], 1, '#b8b2a6'); });
  }
  function hgrass(p) {
    p.rect(0, 0, 16, 16, '#6aa84f'); p.speck(0, 0, 16, 16, '#5c9844', 18); p.speck(0, 0, 16, 16, '#7cbc5c', 10);
    p.rect(0, 14, 16, 2, '#4f8a3a'); p.rect(0, 13, 16, 1, '#86c466');
  }
  function dune(p, v) {
    p.rect(0, 0, 16, 16, v ? '#dc8f56' : '#d9894f'); p.speck(0, 0, 16, 16, '#c47640', 14); p.speck(0, 0, 16, 16, '#eeb27a', 10);
    for (var i = 0; i < 3; i++) { var y = 2 + i * 5 + p.ri(2); for (var x = 0; x < 16; x++) if ((x + i * 3) % 7 < 4) p.px(x, y + (x % 7 === 2 ? 1 : 0), '#c97c45'); }
  }
  function redRock(p) {
    p.rect(0, 0, 16, 16, '#9a4a32'); p.speck(0, 0, 16, 16, '#7a3524', 16); p.speck(0, 0, 16, 16, '#b55e40', 12);
    p.rect(0, 5, 16, 1, '#7a3524'); p.rect(0, 11, 16, 1, '#7a3524'); p.rect(0, 4, 16, 1, '#c06a48');
  }
  Art.extraTiles = [
    { fn: function (p) { fg(p, 0); } }, { fn: function (p) { fg(p, 1); } },
    { fn: function (p) { pond(p, 0); }, seed: 7001 }, { fn: function (p) { pond(p, 1); }, seed: 7001 },
    { fn: function (p) { sea(p, 0); }, seed: 7002 }, { fn: function (p) { sea(p, 1); }, seed: 7002 }, { fn: function (p) { sea(p, 2); }, seed: 7002 },
    { fn: function (p) { shallow(p, 0); }, seed: 7003 }, { fn: function (p) { shallow(p, 1); }, seed: 7003 },
    { fn: function (p) { rock(p, 0); } }, { fn: function (p) { rock(p, 1); } }, { fn: cliff }, { fn: stonePath }, { fn: hgrass },
    { fn: function (p) { dune(p, 0); } }, { fn: function (p) { dune(p, 1); } }, { fn: redRock }
  ];
  Object.assign(Art.TI, { FG0: 23, FG1: 24, POND0: 25, POND1: 26, SEA0: 27, SEA1: 28, SEA2: 29, SHAL0: 30, SHAL1: 31,
    ROCK0: 32, ROCK1: 33, CLIFF: 34, STONEP: 35, HGRASS: 36, DUNE0: 37, DUNE1: 38, REDROCK: 39 });

  // ================================================================== BUILDINGS
  // a stilt or ground house, w x h, with thatch / zinc / tile roof
  function house(p, o) {
    var W = p.w, H = p.h, x, y, wallTop = o.wallTop, floor = o.floor, cx = W / 2;
    p.rect(4, H - 10, W - 8, 8, 'rgba(30,20,12,0.4)');
    if (o.stilts) {
      [5, Math.round(W * 0.3), Math.round(W * 0.68), W - 8].forEach(function (sx) { p.rect(sx, floor, 3, H - floor - 2, '#6b4423'); p.rect(sx + 2, floor, 1, H - floor - 2, '#4e3018'); p.rect(sx - 1, H - 3, 5, 2, '#8a8a8a'); });
      p.rect(2, floor - 3, W - 4, 3, '#5e3a1e'); p.rect(2, floor - 3, W - 4, 1, '#7a4f2b');
    } else {
      p.rect(3, floor - 4, W - 6, H - floor + 2, '#9a9590'); p.rect(3, floor - 4, W - 6, 1, '#b8b2a8');
      for (y = floor - 1; y < H - 2; y += 3) for (x = 4 + (y % 2) * 3; x < W - 4; x += 6) p.rect(x, y, 1, 2, '#7d7872');
    }
    var wb = o.stilts ? floor - 3 : floor - 4;
    p.rect(5, wallTop, W - 10, wb - wallTop, o.wall);
    if (o.planks) for (x = 5; x < W - 5; x += 4) p.rect(x, wallTop, 1, wb - wallTop, o.wall2);
    else { p.rect(5, wb - 3, W - 10, 3, o.wall2); }
    p.rect(5, wallTop, W - 10, 1, o.trim || '#7a4f2b');
    // windows
    var wy = wallTop + 4, ww = Math.max(6, Math.round(W * 0.12));
    [Math.round(W * 0.18), Math.round(W * 0.82) - ww].forEach(function (wx) {
      p.rect(wx, wy, ww, ww, '#3a2414'); p.rect(wx + 1, wy + 1, ww - 2, ww - 2, '#24160c'); p.rect(wx + Math.floor(ww / 2) - 1, wy + 1, 1, ww - 2, o.trim || '#7a4f2b');
      p.rect(wx - 2, wy, 2, ww, o.shutter || '#9c6a3a'); p.rect(wx + ww, wy, 2, ww, o.shutter || '#9c6a3a');
    });
    // door
    var dw = Math.max(8, Math.round(W * 0.16)), dx = Math.round(cx - dw / 2);
    p.rect(dx, wb - Math.round((wb - wallTop) * 0.85), dw, Math.round((wb - wallTop) * 0.85), '#5a3720');
    p.rect(dx + 1, wb - Math.round((wb - wallTop) * 0.85) + 1, dw - 2, Math.round((wb - wallTop) * 0.85) - 1, o.door || '#7a4b28');
    // roof
    var rt = o.roofTop, rb = wallTop + 2;
    for (y = rt; y <= rb; y++) {
      var half = Math.round((y - rt) / (rb - rt) * (W / 2 - 1) + 3);
      for (x = Math.max(0, Math.round(cx - half)); x < Math.min(W, Math.round(cx + half)); x++) {
        var c;
        if (o.roof === 'zinc') c = (x % 3 === 0) ? '#7d8288' : '#9aa0a6';
        else if (o.roof === 'tile') c = (y % 3 === 0) ? '#9a3a24' : ((x + y) % 4 === 0 ? '#c85a3a' : '#b44a30');
        else c = (y % 3 === 0) ? '#6d522c' : (p.r() < 0.08 ? '#a8854f' : '#8b6b3d');
        p.px(x, y, c);
      }
    }
    if (o.roof === 'zinc') p.speck(4, rt + 4, W - 8, rb - rt - 4, '#a0522d', 12);
    p.rect(0, rb, W, 2, o.roof === 'tile' ? '#7a2e1c' : '#5a4222');
    if (o.gable) { p.line(cx - 6, rt - 1, cx + 5, rt + 10, '#5a3720', 2); p.line(cx + 6, rt - 1, cx - 5, rt + 10, '#5a3720', 2); }
    if (o.stilts) {   // stairs
      p.rect(cx - 6, wb, 2, H - wb - 1, '#7a4b28'); p.rect(cx + 4, wb, 2, H - wb - 1, '#7a4b28');
      for (y = wb + 3; y < H - 2; y += 5) { p.rect(cx - 4, y, 8, 2, '#a8743e'); p.rect(cx - 4, y + 2, 8, 1, '#6b4423'); }
    } else {
      p.rect(cx - 8, H - 6, 16, 2, '#d8d0c4'); p.rect(cx - 6, H - 9, 12, 3, '#e8e0d4');
      for (x = cx - 8; x < cx + 8; x += 2) p.px(x, H - 5, (x % 4 === 0) ? '#3a7ab8' : '#e8c060');   // painted tiles on the steps
    }
    if (o.flowers) [[8, H - 8], [W - 10, H - 8]].forEach(function (f) { p.disc(f[0], f[1], 3, '#3f8a3a'); p.px(f[0] - 1, f[1] - 1, '#e0283a'); p.px(f[0] + 1, f[1], '#ff6bb5'); });
  }
  function drawBengkel(p) {
    p.rect(4, 48, 72, 6, 'rgba(30,20,12,0.35)');
    [4, 38, 72].forEach(function (x) { p.rect(x, 18, 3, 36, '#6b4423'); p.rect(x + 2, 18, 1, 36, '#4e3018'); });
    p.rect(6, 22, 66, 18, '#a5713f'); for (var x = 6; x < 72; x += 5) p.rect(x, 22, 1, 18, '#8a5a32');
    [[10, 26], [18, 26], [26, 26]].forEach(function (t) { p.rect(t[0], t[1], 1, 8, '#9aa3ad'); p.rect(t[0] - 1, t[1], 3, 2, '#6b4423'); });
    p.line(32, 26, 36, 34, '#c9c2ad', 2);
    for (var i = 0; i < 4; i++) { p.rect(44, 42 - i * 3, 26, 3, i % 2 ? '#c08a4e' : '#b07a42'); p.rect(44, 42 - i * 3, 26, 1, '#d8a868'); }
    p.rect(12, 44, 18, 2, '#9c6a3a'); p.rect(13, 46, 2, 7, '#7a4b28'); p.rect(27, 46, 2, 7, '#7a4b28');
    p.poly([[0, 20], [8, 4], [72, 4], [80, 20]], '#9aa0a6');
    for (x = 0; x < 80; x += 3) p.line(x, 20, x + (40 - x) * 0.1, 4, '#7d8288');
    p.speck(4, 6, 72, 12, '#a0522d', 18); p.rect(0, 20, 80, 2, '#6b6f75');
    p.rect(26, 8, 28, 9, '#f2e6c9'); p.rect(26, 8, 28, 1, '#2a6a9a'); p.rect(29, 11, 22, 1, '#5a3720'); p.rect(29, 13, 16, 1, '#5a3720');
  }
  function drawPondok(p) {
    p.rect(4, 48, 56, 6, 'rgba(30,20,12,0.35)');
    [6, 28, 54].forEach(function (x) { p.rect(x, 34, 3, 20, '#6b4423'); });
    p.rect(3, 31, 58, 3, '#5e3a1e');
    p.rect(8, 16, 48, 15, '#c9a46a'); for (var x = 8; x < 56; x += 3) p.rect(x, 16, 1, 15, '#a8834f');
    p.rect(26, 18, 10, 13, '#5a3720');
    for (var y = 0; y < 12; y++) for (x = 40; x < 54; x++) if ((x + y) % 3 === 0 || (x - y) % 3 === 0) p.px(x, 36 + y, '#d8d0b0');
    p.poly([[0, 18], [32, 2], [64, 18]], '#8b6b3d'); for (y = 4; y < 18; y += 3) p.rect(32 - y * 2, y, y * 4, 1, '#6d522c');
  }
  function drawBeringin(p) {
    p.rect(30, 50, 12, 28, '#7a6a58'); p.rect(38, 50, 4, 28, '#5e5040');
    for (var i = 0; i < 9; i++) { var x = 14 + i * 5 + (i % 2); p.line(x, 34 + (i % 3) * 3, x + (i % 2 ? 1 : -1), 76, i % 2 ? '#8a7a66' : '#6e604f'); }
    var blobs = [[36, 26, 22], [16, 32, 13], [56, 32, 13], [24, 16, 13], [48, 16, 13], [36, 10, 11]];
    blobs.forEach(function (b) { p.disc(b[0], b[1] + 2, b[2], '#2a5a24'); });
    blobs.forEach(function (b) { p.disc(b[0], b[1], b[2] - 1, '#3a7a32'); });
    blobs.forEach(function (b) { p.disc(b[0] - 3, b[1] - 3, b[2] - 6, '#4c9040'); });
    p.speck(4, 0, 64, 46, '#5aa04a', 40); p.speck(4, 6, 64, 40, '#25501f', 30);
    p.rect(26, 60, 20, 3, '#e8c040'); p.rect(26, 60, 20, 1, '#f8e070');   // a yellow cloth tied round the trunk
  }
  function drawWakaf(p) {
    p.rect(2, 34, 44, 4, 'rgba(30,20,12,0.35)');
    [6, 40].forEach(function (x) { p.rect(x, 14, 3, 22, '#6b4423'); });
    p.rect(3, 26, 42, 4, '#a5713f'); p.rect(3, 26, 42, 1, '#c99a5e');
    p.poly([[0, 16], [10, 3], [38, 3], [48, 16]], '#8b6b3d'); for (var y = 5; y < 16; y += 3) p.rect(4, y, 40, 1, '#6d522c');
    p.rect(22, 0, 4, 4, '#e2b33c');
  }
  function drawPlot(p) {
    p.rect(4, 10, 56, 34, '#a77848'); p.speck(4, 10, 56, 34, '#93663b', 50); p.speck(4, 10, 56, 34, '#6aa04a', 12);
    [[4, 10], [59, 10], [4, 43], [59, 43]].forEach(function (s) { p.rect(s[0] - 1, s[1] - 7, 2, 9, '#c9a46a'); p.px(s[0] - 1, s[1] - 7, '#e0c08a'); });
    p.rect(4, 5, 56, 1, '#f5f0e1'); p.rect(4, 38, 56, 1, '#f5f0e1'); p.rect(3, 5, 1, 34, '#f5f0e1'); p.rect(60, 5, 1, 34, '#f5f0e1');
    p.rect(26, 18, 2, 14, '#6b4423'); p.rect(18, 14, 18, 9, '#d9b98a'); p.rect(18, 14, 18, 1, '#c8323a');
    p.rect(20, 17, 14, 1, '#6b4423'); p.rect(20, 19, 10, 1, '#6b4423');
  }
  function drawScaffold(p) {
    p.rect(4, 62, 56, 8, '#a77848');
    for (var x = 6; x < 60; x += 12) p.rect(x, 12, 2, 58, '#d4c06a');
    for (var y = 20; y < 66; y += 14) p.rect(4, y, 56, 2, '#b9a24e');
    p.rect(10, 40, 44, 22, '#c08a4e'); for (x = 10; x < 54; x += 4) p.rect(x, 40, 1, 22, '#9a6a38');
    p.poly([[4, 30], [32, 12], [60, 30]], '#8b6b3d');
    p.rect(30, 6, 4, 8, '#c8323a'); p.px(29, 6, '#e85a5a'); p.px(34, 7, '#e85a5a');
    p.rect(16, 56, 6, 6, '#7a4b28'); p.rect(42, 58, 10, 4, '#9aa0a6');
  }
  function drawSampan(p) {
    p.poly([[0, 3], [32, 3], [28, 11], [4, 11]], '#8c5c31'); p.rect(2, 3, 28, 2, '#a26f3f'); p.rect(4, 9, 24, 2, '#5e3a1d');
    p.rect(14, 4, 4, 2, '#c9a46a'); p.line(20, 2, 30, 0, '#6b4423');
  }
  function drawGateVines(p) {
    for (var i = 0; i < 26; i++) { var x = p.ri(32), y = 6 + p.ri(20); p.line(x, y, x + p.ri(9) - 4, y - 6 + p.ri(3), i % 3 ? '#3f7a32' : '#2a5a24', 2); }
    p.speck(0, 4, 32, 24, '#5aa04a', 30); p.speck(0, 4, 32, 24, '#8a6a3a', 10);
    p.disc(16, 14, 4, '#e8dcff'); p.disc(16, 14, 2.5, '#b8a8ff'); p.px(16, 14, '#ffffff');   // a faint spirit seal
  }
  function drawGateRocks(p) {
    [[6, 18, 6], [16, 16, 7], [26, 18, 6], [11, 10, 5], [22, 10, 5], [16, 5, 4]].forEach(function (r) { p.disc(r[0], r[1], r[2], '#6e675e'); p.disc(r[0] - 1, r[1] - 1, r[2] - 2, '#8d867a'); p.px(r[0] - 2, r[1] - 2, '#a8a296'); });
    p.disc(16, 13, 3, '#e8dcff'); p.px(16, 13, '#ffffff');
  }
  function drawGateDune(p) {
    p.ell(8, 22, 8, 10, '#d9894f'); p.ell(7, 20, 6, 8, '#e4a066'); p.speck(0, 12, 16, 20, '#c47640', 14);
    p.rect(6, 4, 2, 14, '#6b4423'); p.rect(2, 4, 12, 5, '#b07a45'); p.disc(8, 26, 2.5, '#e8dcff'); p.px(8, 26, '#ffffff');
  }
  function drawShrine(p) {
    p.rect(6, 24, 6, 3, '#8d8f94'); p.rect(8, 14, 2, 11, '#efe6d2');
    p.rect(3, 12, 12, 2, '#7a2e22'); p.rect(4, 6, 10, 6, '#b8332a'); p.rect(7, 8, 4, 4, '#3a1410'); p.rect(4, 6, 10, 1, '#e2b33c');
    p.poly([[2, 6], [9, 1], [16, 6]], '#c8402f'); p.rect(8, 0, 2, 2, '#f2c94c');
    p.px(6, 13, '#ffd166'); p.px(11, 13, '#ffffff');
  }
  function drawTualang(p) {
    var W = p.w, H = p.h;
    p.rect(24, 30, 9, H - 30, '#b8ad98'); p.rect(30, 30, 3, H - 30, '#9a8f7c'); p.rect(25, 30, 1, H - 30, '#d0c6b0');
    p.poly([[24, H - 22], [12, H], [24, H]], '#a89e8a'); p.poly([[33, H - 22], [46, H], [33, H]], '#958b78');
    p.poly([[26, H - 14], [20, H], [27, H]], '#c0b6a2');
    var blobs = [[28, 20, 18], [12, 26, 10], [44, 26, 10], [20, 10, 10], [36, 10, 10]];
    blobs.forEach(function (b) { p.disc(b[0], b[1] + 2, b[2], '#245a25'); });
    blobs.forEach(function (b) { p.disc(b[0], b[1], b[2] - 1, '#357a30'); });
    blobs.forEach(function (b) { p.disc(b[0] - 2, b[1] - 3, b[2] - 5, '#4a9040'); });
    p.speck(2, 0, W - 4, 38, '#5aa04a', 26);
    p.ell(40, 46, 4, 3, '#c9a03a'); p.px(39, 45, '#e8c060');   // wild honeycomb
  }
  function drawRafflesia(p) {
    for (var i = 0; i < 5; i++) { var a = i / 5 * Math.PI * 2 - Math.PI / 2; p.ell(16 + Math.cos(a) * 8, 9 + Math.sin(a) * 4, 6, 3.4, '#b8322a'); }
    for (i = 0; i < 5; i++) { a = i / 5 * Math.PI * 2 - Math.PI / 2; var cx = 16 + Math.cos(a) * 8, cy = 9 + Math.sin(a) * 4; p.px(cx - 1, cy, '#f5e0d0'); p.px(cx + 2, cy - 1, '#f5e0d0'); p.px(cx, cy + 1, '#f5e0d0'); }
    p.ell(16, 9, 5, 2.6, '#6a1a14'); p.ell(16, 8.5, 3.4, 1.6, '#3a0e0a'); p.rect(10, 13, 2, 3, '#5a3a20'); p.rect(21, 13, 2, 3, '#5a3a20');
  }
  function drawPine(p) {
    p.rect(11, 34, 3, 10, '#5a3a20');
    for (var t = 0; t < 4; t++) { var y = 4 + t * 8, w = 4 + t * 3; p.poly([[12, y - 4], [12 - w, y + 7], [12 + w, y + 7]], t % 2 ? '#2e5a3a' : '#356a42'); p.rect(12 - w + 1, y + 6, w * 2 - 2, 1, '#24482e'); }
    p.speck(2, 0, 20, 36, '#d8e8e0', 8);
  }
  function drawLighthouse(p) {
    p.rect(8, 58, 16, 6, '#9a9590');
    for (var y = 14; y < 58; y++) { var w = 6 + Math.round((y - 14) / 44 * 4); p.rect(16 - w, y, w * 2, 1, (Math.floor((y - 14) / 8) % 2) ? '#c8323a' : '#f5f0e6'); }
    p.rect(9, 8, 14, 6, '#3a3a40'); p.rect(11, 9, 10, 4, '#ffe08a'); p.poly([[8, 8], [16, 1], [24, 8]], '#c8323a'); p.rect(15, 0, 2, 2, '#3a3a40');
    p.rect(14, 44, 4, 8, '#5a3720');
  }
  function drawBeachHut(p) {
    p.rect(2, 30, 44, 5, 'rgba(30,20,12,0.3)');
    [5, 40].forEach(function (x) { p.rect(x, 14, 3, 20, '#8a6a45'); });
    p.rect(4, 24, 40, 3, '#c9a46a'); p.rect(4, 24, 40, 1, '#e0c08a');
    p.rect(12, 21, 12, 3, '#c8323a'); p.rect(30, 20, 5, 4, '#9aa3ad');
    p.poly([[0, 15], [24, 2], [48, 15]], '#b8a070'); for (var y = 4; y < 15; y += 2) p.rect(24 - y * 2, y, y * 4, 1, '#a08858');
  }
  function drawChamTower(p) {
    var H = p.h;
    p.rect(6, H - 8, 36, 8, '#8a3a24');
    for (var t = 0; t < 4; t++) {
      var y0 = H - 8 - (t + 1) * 13, w = 32 - t * 7, x0 = 24 - w / 2;
      p.rect(x0, y0, w, 13, t % 2 ? '#b85a3a' : '#a84e32');
      for (var y = y0 + 2; y < y0 + 13; y += 3) p.rect(x0, y, w, 1, '#8a3a24');
      p.rect(x0 - 2, y0, w + 4, 2, '#c86a48'); p.rect(x0 + 2, y0 + 3, 2, 8, '#7a3020'); p.rect(x0 + w - 4, y0 + 3, 2, 8, '#7a3020');
    }
    p.rect(19, H - 21, 10, 13, '#4a1a10'); p.rect(20, H - 22, 8, 1, '#c86a48');
    p.poly([[18, 6], [24, 0], [30, 6]], '#c86a48');
    p.speck(4, 4, 40, H - 8, '#6a8a4a', 10);   // a little grass in the cracks
  }
  function drawJungleTree(p, v) {
    var H = p.h;
    p.rect(17, 30, 6, H - 30, '#6b5a44'); p.rect(21, 30, 2, H - 30, '#4e4030'); p.line(14, H - 1, 18, H - 8, '#6b5a44', 2); p.line(26, H - 1, 22, H - 8, '#5a4a36', 2);
    var blobs = v ? [[20, 18, 14], [9, 24, 8], [31, 22, 9], [20, 8, 9]] : [[20, 20, 13], [10, 16, 9], [30, 16, 9], [20, 7, 8]];
    blobs.forEach(function (b) { p.disc(b[0], b[1] + 2, b[2], '#1f4a1e'); });
    blobs.forEach(function (b) { p.disc(b[0], b[1], b[2] - 1, v ? '#2e6a2a' : '#33702e'); });
    blobs.forEach(function (b) { p.disc(b[0] - 2, b[1] - 3, b[2] - 5, '#468a3a'); });
    p.speck(2, 0, 36, 32, '#5a9a48', 16); p.speck(2, 4, 36, 28, '#183a18', 14);
    if (v) { p.line(8, 26, 7, 40, '#3f7a32'); p.line(32, 24, 33, 38, '#3f7a32'); }   // hanging vines
  }
  function drawDurianTree(p, fruit) {
    p.rect(21, 34, 6, 30, '#6b4423'); p.rect(25, 34, 2, 30, '#4e3018');
    p.line(23, 40, 14, 28, '#6b4423', 3); p.line(25, 38, 34, 26, '#6b4423', 3);
    var blobs = [[24, 22, 15], [11, 26, 9], [37, 26, 9], [17, 12, 9], [31, 12, 9]];
    blobs.forEach(function (b) { p.disc(b[0], b[1] + 2, b[2], '#2a5a24'); });
    blobs.forEach(function (b) { p.disc(b[0], b[1], b[2] - 1, '#3a7a32'); });
    blobs.forEach(function (b) { p.disc(b[0] - 2, b[1] - 3, b[2] - 5, '#4f9a42'); });
    if (fruit) [[14, 32], [30, 34], [22, 28], [38, 30]].forEach(function (f) { p.ell(f[0], f[1], 2.6, 3.2, '#8aa83a'); p.px(f[0] - 1, f[1] - 2, '#b8d060'); p.px(f[0] + 1, f[1], '#5a7a2a'); p.px(f[0], f[1] + 2, '#5a7a2a'); p.px(f[0], f[1] - 4, '#5a3a20'); });
  }

  // ================================================================== VILLAGERS (16x20)
  function drawVillager(p, L, blink) {
    var SK = L.skin, EYE = '#2a1a10';
    p.rect(5, 18, 2, 2, '#4a3020'); p.rect(9, 18, 2, 2, '#4a3020');
    p.rect(4, 13, 8, 5, L.bottom); p.rect(10, 13, 2, 5, L.bottom2); p.rect(4, 15, 8, 1, L.bottom2);
    p.rect(4, 8, 8, 6, L.shirt); p.rect(10, 8, 2, 6, L.shirt2); p.rect(3, 9, 1, 4, L.shirt); p.rect(12, 9, 1, 4, L.shirt2);
    p.px(3, 13, SK); p.px(12, 13, SK);
    if (L.hat === 'flower') p.rect(5, 9, 6, 1, L.shirt2);   // batik sash
    p.rect(5, 3, 6, 5, SK);
    if (blink) { p.rect(6, 5, 2, 1, EYE); p.rect(9, 5, 2, 1, EYE); } else { p.px(6, 5, EYE); p.px(9, 5, EYE); }
    p.px(7, 7, '#8a4a3a'); p.px(8, 7, '#8a4a3a');
    var HR = L.hair;
    switch (L.hat) {
      case 'songkok': p.rect(5, 1, 6, 2, '#1a1a1e'); p.rect(5, 1, 6, 1, '#34343c'); p.px(5, 3, HR); p.px(10, 3, HR); break;
      case 'terendak': [[6, 9, 0], [4, 11, 1], [2, 13, 2], [1, 14, 3]].forEach(function (r) { p.rect(r[0], r[2], r[1] - r[0] + 1, 1, r[2] === 3 ? '#a88a44' : '#ecd28a'); }); break;
      case 'nonla': [[7, 8, 0], [5, 10, 1], [3, 12, 2], [1, 14, 3]].forEach(function (r) { p.rect(r[0], r[2], r[1] - r[0] + 1, 1, r[2] === 3 ? '#c9b070' : '#f2e6b8'); }); break;
      case 'cap': p.rect(5, 2, 6, 2, '#c8323a'); p.rect(4, 3, 8, 1, '#a81e24'); p.px(10, 1, '#f5f0e1'); break;
      case 'headband': p.rect(5, 2, 6, 2, HR); p.rect(5, 3, 6, 1, '#c8323a'); p.px(11, 3, '#c8323a'); break;
      case 'tudung': p.rect(4, 2, 8, 2, L.hatColor); p.rect(4, 3, 1, 6, L.hatColor); p.rect(11, 3, 1, 6, L.hatColor); p.rect(4, 8, 8, 2, L.hatColor); p.rect(5, 2, 6, 1, '#fff0f6'); break;
      case 'bun': p.rect(5, 2, 6, 2, HR); p.disc(8, 1, 1.6, HR); p.px(4, 4, HR); p.px(11, 4, HR); p.px(10, 1, '#e9b949'); break;
      case 'flower': p.rect(4, 2, 8, 2, HR); p.rect(4, 3, 1, 6, HR); p.rect(11, 3, 1, 6, HR); p.px(11, 2, '#ff6bb5'); p.px(12, 3, '#ff6bb5'); p.px(11, 3, '#ffd166'); break;
      case 'kopiah': p.rect(5, 1, 6, 2, '#f5f0e6'); p.rect(5, 2, 6, 1, '#d8d2c4'); p.px(5, 3, HR); p.px(10, 3, HR); break;
      case 'tanjak': case 'tanjak_gold': case 'tanjak_red': {   // the folded Malay headcloth
        var tc = L.hat === 'tanjak_gold' ? '#e9c46a' : L.hat === 'tanjak_red' ? '#b8322a' : '#c8a040', tc2 = L.hat === 'tanjak_gold' ? '#c4922f' : L.hat === 'tanjak_red' ? '#7a1e1a' : '#8a6a28';
        p.rect(5, 2, 6, 2, tc); p.rect(5, 3, 6, 1, tc2); p.poly([[9, 2], [12, -1], [11, 3]], tc); p.px(11, 0, tc2); p.px(5, 3, HR); break;
      }
      case 'leaf': p.poly([[3, 4], [8, -1], [13, 4]], '#3f8a3a'); p.line(8, -1, 8, 4, '#2a6a24'); p.px(8, 0, '#9be15d'); break;
      default: p.rect(5, 2, 6, 2, HR);
    }
    if (L.beard) { p.rect(6, 7, 4, 2, L.beard); p.px(7, 9, L.beard); }
    p.outline(OUT);
  }

  Art.drawVillager = drawVillager;

  // ================================================================== CRITTERS
  function drawKancil(p, f) {
    var B = '#a8743e', B2 = '#8a5a2b', L = '#e8d0a8';
    var legs = f ? [4, 6, 12, 14] : [5, 5, 13, 13];
    legs.forEach(function (x, i) { p.rect(x, 9, 1, 5, B2); });
    p.ell(9, 7, 6, 3, B); p.ell(9, 8, 5, 1.6, L); p.px(4, 6, '#f5f0e6'); p.px(3, 7, '#f5f0e6');
    p.rect(14, 3, 2, 4, B); p.ell(16, 3, 2, 1.6, B); p.px(17, 3, '#2a1a10'); p.px(15, 1, B2); p.px(14, 1, B2);
    p.outline(OUT);
  }
  function drawKetam(p, f) {
    p.ell(6, 5, 4, 2.4, '#d6502a'); p.ell(6, 4.5, 3, 1.4, '#ee7040');
    p.px(4, 2, '#2a1a10'); p.px(8, 2, '#2a1a10'); p.px(4, 3, '#d6502a'); p.px(8, 3, '#d6502a');
    p.disc(1, f ? 3 : 4, 1.4, '#d6502a'); p.disc(11, f ? 4 : 3, 1.4, '#d6502a');
    [2, 3, 9, 10].forEach(function (x, i) { p.px(x, 7 + (f && i % 2 ? 0 : 0), '#a83a1e'); });
    p.outline(OUT);
  }
  function drawPenyu(p, f) {
    p.ell(9, 6, 7, 4, '#5a7a3a'); p.ell(9, 5.5, 5.5, 3, '#7a9a4a');
    [[6, 4], [10, 3], [12, 6], [7, 7]].forEach(function (c) { p.px(c[0], c[1], '#4a6a2a'); });
    p.ell(17, 6, 2.4, 2, '#a8b878'); p.px(18, 5, '#2a1a10');
    p.ell(4, f ? 2 : 3, 2, 1.2, '#98a868'); p.ell(4, f ? 10 : 9, 2, 1.2, '#98a868'); p.ell(14, f ? 10 : 9, 2, 1.2, '#98a868');
    p.outline(OUT);
  }
  function drawBiawak(p, f) {
    var B = '#5a5a42', S = '#d8c878';
    p.line(1, 6, 8, 5, B, 2); p.ell(13, 5, 6, 2.2, B); p.ell(21, 4, 3, 1.6, B); p.px(22, 3, '#e8d050');
    [[9, 2], [12, 3], [15, 2], [11, 6], [16, 6]].forEach(function (c) { p.px(c[0], c[1], S); });
    p.rect(10, f ? 7 : 6, 1, 3, B); p.rect(16, f ? 6 : 7, 1, 3, B);
    p.px(24, 4, '#c84a4a');
    p.outline(OUT);
  }

  // ================================================================== SPIRITS (folk neighbours)
  function drawSemangat(p) {
    p.ell(10, 13, 5, 6, '#f2d06b'); p.ell(9, 12, 3.6, 4.6, '#ffe8a0'); p.px(8, 9, '#fff8dc');
    [[6, 6], [10, 3], [14, 6]].forEach(function (t) { p.line(10, 8, t[0], t[1], '#c9a23a'); p.px(t[0], t[1], '#f2d06b'); p.px(t[0], t[1] - 1, '#ffe8a0'); });
    p.px(8, 13, '#5a3a1a'); p.px(11, 13, '#5a3a1a'); p.px(9, 15, '#c8705a'); p.px(10, 15, '#c8705a');
    p.px(6, 14, '#ffb0a0'); p.px(13, 14, '#ffb0a0');
    p.outline('#a8802a');
  }
  function drawBunian(p) {
    p.rect(7, 13, 6, 6, '#6aa84f'); p.rect(11, 13, 2, 6, '#4f8a3a'); p.rect(7, 18, 2, 2, '#4a3020'); p.rect(11, 18, 2, 2, '#4a3020');
    p.rect(7, 8, 6, 5, '#e2b48a'); p.px(8, 10, '#2a1a10'); p.px(11, 10, '#2a1a10'); p.px(9, 12, '#c8705a');
    p.poly([[3, 9], [10, 1], [17, 9]], '#3f8a3a'); p.line(10, 1, 10, 9, '#2a6a24'); p.px(10, 0, '#9be15d');
    p.outline('#2a4a1a');
  }
  function drawNaga(p) {
    p.ell(12, 18, 9, 3, '#2a8aa0');   // coils in the water
    p.ell(12, 17, 7, 2, '#3fb0c0');
    p.rect(13, 7, 4, 10, '#3fb0c0'); p.rect(16, 7, 1, 10, '#2a8aa0');
    p.ell(15, 6, 4, 3, '#3fb0c0'); p.px(16, 5, '#2a1a10'); p.px(18, 7, '#f2c94c');
    [[12, 2], [14, 1], [16, 1], [18, 2]].forEach(function (c) { p.rect(c[0], c[1], 1, 3, '#f2c94c'); });
    for (var y = 9; y < 16; y += 2) p.px(14, y, '#a8e8f0');
    p.px(4, 17, '#f2c94c'); p.px(20, 18, '#a8e8f0');
    p.outline('#1a5a6a');
  }
  function drawKenyalang(p) {
    p.ell(11, 13, 6, 5, '#2a2a30'); p.ell(10, 15, 4, 2.4, '#f5f0e6');
    p.rect(5, 16, 3, 6, '#2a2a30'); p.rect(5, 19, 3, 3, '#f5f0e6');
    p.ell(16, 7, 3.4, 3, '#2a2a30'); p.px(17, 6, '#f5e070'); p.px(17, 7, '#2a1a10');
    p.poly([[18, 7], [26, 9], [19, 10]], '#f2c94c'); p.poly([[17, 4], [25, 6], [19, 7]], '#e8701e');
    p.px(10, 18, '#e8701e'); p.px(13, 18, '#e8701e');
    p.outline('#14141a');
  }
  function drawNuno(p) {
    p.ell(13, 21, 12, 4, '#b8582f'); p.ell(13, 20, 10, 3, '#d27040');   // the punso (mound)
    p.rect(9, 11, 8, 7, '#8a5a2b'); p.rect(15, 11, 2, 7, '#6b4423');
    p.rect(10, 5, 6, 6, '#c99060'); p.px(11, 7, '#2a1a10'); p.px(14, 7, '#2a1a10'); p.rect(11, 6, 2, 1, '#f5f5f5'); p.rect(14, 6, 2, 1, '#f5f5f5');
    p.poly([[10, 9], [16, 9], [13, 18]], '#f5f5f0'); p.px(13, 17, '#d8d8d0');
    p.rect(10, 3, 6, 2, '#6b4423'); p.rect(9, 4, 8, 1, '#5a3a20');
    p.line(19, 6, 19, 18, '#6b4423'); p.px(19, 5, '#8a5a2b');
    p.outline('#4a2a14');
  }

  // ================================================================== FORAGE (ready / picked)
  var FG = {
    branches: function (p, ok) { if (!ok) { p.px(4, 9, '#6b4423'); p.px(10, 10, '#6b4423'); return; } p.line(1, 9, 14, 6, '#7a4b28', 2); p.line(3, 6, 13, 10, '#8a5a32', 2); p.line(5, 10, 9, 4, '#6b4423'); p.px(9, 3, '#4f9a3a'); p.px(13, 5, '#4f9a3a'); },
    rattan: function (p, ok) { p.line(8, 15, 6, 2, '#5a8a3a', 2); p.line(8, 15, 11, 3, '#4f7a30', 2); if (ok) { p.line(3, 4, 13, 12, '#b9a24e', 2); p.line(2, 10, 14, 6, '#c9b45a'); } p.speck(2, 1, 12, 8, '#6aa84f', 6); },
    mushroom: function (p, ok) { if (!ok) { p.px(4, 9, '#c9c0a8'); p.px(8, 9, '#c9c0a8'); return; } [[4, 7, 3], [9, 6, 3.4]].forEach(function (m) { p.rect(m[0] - 1, m[1], 2, 3, '#efe6d2'); p.ell(m[0], m[1], m[2], 2, '#c8502a'); p.px(m[0] - 1, m[1] - 1, '#f5f0e6'); p.px(m[0] + 1, m[1], '#f5f0e6'); }); },
    herbs: function (p, ok) { for (var i = 0; i < (ok ? 6 : 2); i++) p.line(7, 11, 2 + i * 2, ok ? 2 + (i % 3) : 8, i % 2 ? '#6fbf4a' : '#3d8a3a'); if (ok) { p.px(4, 3, '#f5d76e'); p.px(10, 2, '#f5d76e'); } },
    nipa: function (p, ok) { p.rect(14, 26, 4, 6, '#6b5a3a'); var n = ok ? 8 : 4; for (var i = 0; i < n; i++) { var a = (-170 + i * (160 / (n - 1))) * Math.PI / 180; for (var s = 2; s < 16; s++) p.disc(16 + Math.cos(a) * s, 24 + Math.sin(a) * s + s * s / 30, 1.4, i % 2 ? '#5aa83e' : '#4a9a3a'); } },
    shells: function (p, ok) { if (!ok) { p.px(6, 6, '#f0e0c8'); return; } p.ell(3, 5, 2.4, 2, '#f5d0c0'); p.px(3, 4, '#e8a090'); p.poly([[7, 7], [10, 2], [13, 7]], '#f0e6d0'); p.line(10, 2, 10, 7, '#d8c0a0'); p.disc(6, 5, 1.4, '#a8d0e8'); },
    tea: function (p, ok) { p.ell(8, 8, 7.6, 4.6, '#2e6a2e'); p.ell(8, 7, 6.6, 3.6, '#3f8a3a'); if (ok) p.speck(2, 3, 12, 6, '#8fd06a', 14); },
    strawberry: function (p, ok) { p.ell(8, 8, 7, 3.6, '#3f8a3a'); p.speck(2, 5, 12, 5, '#5aa83e', 8); if (ok) [[4, 8], [8, 9], [12, 7], [6, 6]].forEach(function (b) { p.ell(b[0], b[1], 1.4, 1.8, '#e0283a'); p.px(b[0], b[1] - 2, '#3a8a2a'); p.px(b[0] - 1, b[1], '#ffd0d0'); }); },
    boulder: function (p, ok) { if (!ok) { p.ell(10, 12, 6, 3, '#8d867a'); p.ell(9, 11, 4, 2, '#a8a296'); return; } p.ell(10, 10, 9, 6, '#6e675e'); p.ell(9, 9, 7.4, 4.6, '#8d867a'); p.ell(7, 7, 3, 2, '#a8a296'); p.line(12, 6, 15, 11, '#5a544c'); },
    dragon: function (p, ok) {
      [[10, 22, 10, 8], [10, 14, 4, 6], [10, 14, 16, 5]].forEach(function (s) { p.line(s[0], s[1], s[2], s[3], '#4f8a3a', 3); });
      p.px(9, 12, '#7ab85a'); p.px(14, 7, '#7ab85a');
      if (ok) [[10, 6], [4, 4], [16, 3]].forEach(function (f) { p.ell(f[0], f[1], 2.4, 2.8, '#d8288a'); p.px(f[0] - 1, f[1] - 1, '#ff70b8'); p.px(f[0] + 2, f[1], '#5aa83e'); });
    },
    clay: function (p, ok) { p.ell(8, 6, 7, 3.6, '#8a3a24'); p.ell(8, 6, 5.4, 2.4, ok ? '#c8603a' : '#6a2a1a'); if (ok) p.px(6, 5, '#e08050'); },
    glint: function (p, ok) { p.ell(6, 5, 5, 2.4, '#c47640'); if (ok) { p.px(6, 3, '#fff8c0'); p.px(5, 4, '#ffe060'); p.px(7, 4, '#ffe060'); p.px(6, 2, '#ffffff'); } }
  };
  var FG_SIZE = { branches: [16, 12], rattan: [16, 16], mushroom: [12, 10], herbs: [14, 12], nipa: [32, 32], shells: [14, 8], tea: [16, 13], strawberry: [16, 12], boulder: [20, 16], dragon: [20, 24], clay: [16, 10], glint: [12, 8] };

  // ================================================================== ICONS (16x16)
  var IC = {};
  function fish(body, belly, fin, opt) {
    return function (p) {
      opt = opt || {};
      p.poly([[2, 8], [0, 4], [0, 12]], fin); p.ell(8.5, 8, 6.5, opt.tall || 3.2, body); p.ell(9, 9.5, 5, 1.4, belly);
      p.poly([[7, 5], [10, 2], [11, 5]], fin); p.px(13, 7, '#ffffff'); p.px(13, 7, '#1a1a1a');
      if (opt.stripe) for (var x = 5; x < 12; x += 3) p.rect(x, 6, 1, 3, opt.stripe);
      if (opt.spots) p.speck(4, 6, 8, 4, opt.spots, 6);
      if (opt.whisker) { p.line(14, 9, 16, 11, opt.whisker); p.line(14, 8, 16, 7, opt.whisker); }
    };
  }
  IC.ikan_tilapia = fish('#7a8a7a', '#c8d0c0', '#5a6a5a', { stripe: '#5a6a5a' });
  IC.ikan_keli = fish('#4a4038', '#8a7a68', '#3a3028', { whisker: '#2a2018' });
  IC.ikan_puyu = fish('#7a7a3a', '#c8c080', '#5a5a2a', { spots: '#4a4a20' });
  IC.ikan_haruan = fish('#5a5048', '#b0a890', '#3a3430', { spots: '#2a2420' });
  IC.ikan_kelah = fish('#c8a040', '#f0e0a0', '#c8502a', { tall: 3.6 });
  IC.ikan_kembung = fish('#4a7ab0', '#e0e8f0', '#2a5a90', { stripe: '#2a4a7a' });
  IC.ikan_kerapu = fish('#c8603a', '#f0c0a0', '#a84a2a', { spots: '#7a2a1a', tall: 3.8 });
  IC.ikan_sebarau = fish('#a8b0a0', '#e8e8e0', '#c8322a', { stripe: '#2a2a2a' });
  IC.ikan_emas = fish('#f2b830', '#ffe890', '#e88a1a', { tall: 3.8 });
  IC.udang = function (p) { for (var i = 0; i < 5; i++) p.disc(4 + i * 2, 9 - Math.sin(i / 4 * Math.PI) * 3, 2, i % 2 ? '#e88a6a' : '#f0a080'); p.line(12, 5, 15, 2, '#5a8ac8', 1); p.line(13, 6, 16, 4, '#5a8ac8'); p.px(12, 6, '#1a1a1a'); p.poly([[2, 10], [0, 8], [0, 12]], '#d06a4a'); };
  IC.sotong = function (p) { p.ell(8, 5, 4, 4.6, '#e8d0e0'); p.ell(7, 4, 2.4, 2.6, '#f8ecf4'); for (var i = 0; i < 5; i++) p.line(5 + i * 1.5, 9, 4 + i * 2, 15, '#d8b8d0'); p.px(6, 7, '#1a1a1a'); p.px(10, 7, '#1a1a1a'); };
  IC.selipar = function (p) { p.ell(8, 9, 4.4, 6.4, '#3a7ab8'); p.ell(8, 9, 3.4, 5.4, '#5a9ad8'); p.line(6, 5, 8, 8, '#e8e8e0'); p.line(10, 5, 8, 8, '#e8e8e0'); p.px(4, 14, '#5aa83e'); };
  IC.joran = function (p) { p.line(2, 15, 14, 2, '#c9b45a', 2); p.line(3, 15, 14, 3, '#9e8c3c'); p.line(14, 2, 15, 12, '#e8e8e8'); p.disc(14, 13, 1.5, '#e8323a'); p.rect(3, 11, 3, 3, '#5a3a20'); };
  IC.kayu = function (p) { [[3, 9], [8, 11], [13, 9]].forEach(function (c) { p.disc(c[0], c[1], 2.8, '#8a5a2b'); p.disc(c[0], c[1], 1.6, '#c9925a'); p.px(c[0], c[1], '#8a5a2b'); }); p.rect(2, 4, 12, 3, '#a8743e'); p.rect(2, 4, 12, 1, '#c99a5e'); };
  IC.batu = function (p) { p.ell(8, 10, 6.4, 4.4, '#7d7872'); p.ell(7, 9, 4.8, 3, '#9d968a'); p.px(5, 7, '#b8b2a6'); p.ell(12, 5, 2.4, 2, '#8d867a'); };
  IC.atap = function (p) { for (var i = 0; i < 6; i++) p.line(2 + i * 2, 14, 4 + i * 2, 2, i % 2 ? '#b8a070' : '#9a8050', 2); p.rect(1, 6, 14, 2, '#7a6040'); };
  IC.tanah_liat = function (p) { p.ell(8, 10, 6, 4, '#a8442a'); p.ell(7, 9, 4.4, 2.6, '#c8603a'); p.px(5, 8, '#e08050'); p.rect(10, 3, 4, 4, '#b85030'); p.rect(10, 3, 4, 1, '#d87050'); };
  IC.rotan = function (p) { for (var i = 0; i < 3; i++) p.line(2, 4 + i * 4, 14, 2 + i * 4, i % 2 ? '#c9b45a' : '#b9a24e', 2); p.rect(6, 1, 2, 14, '#8a6a3a'); };
  IC.cendawan = function (p) { p.rect(7, 8, 3, 6, '#efe6d2'); p.ell(8, 7, 6, 3.6, '#c8502a'); p.px(6, 5, '#f5f0e6'); p.px(10, 6, '#f5f0e6'); p.px(8, 4, '#f5f0e6'); p.rect(3, 12, 2, 3, '#efe6d2'); p.ell(4, 11, 2.4, 1.6, '#b8402a'); };
  IC.herba = function (p) { p.line(8, 15, 4, 3, '#3d8a3a', 2); p.line(8, 15, 12, 2, '#5cbf4f', 2); p.line(8, 15, 8, 4, '#4f9a3a'); p.ell(11, 12, 2, 1.4, '#e8a020'); p.rect(5, 12, 6, 2, '#c9a46a'); };
  IC.durian = function (p) { p.ell(8, 9, 6, 6.4, '#8aa83a'); p.ell(7, 8, 4, 4.4, '#a8c050'); for (var i = 0; i < 10; i++) { var a = i / 10 * Math.PI * 2; p.px(8 + Math.cos(a) * 6.2, 9 + Math.sin(a) * 6.6, '#5a7a2a'); } p.rect(8, 1, 1, 3, '#6b4423'); p.px(6, 8, '#5a7a2a'); p.px(10, 10, '#5a7a2a'); };
  IC.daun_teh = function (p) { p.ell(6, 8, 3.4, 5.6, '#3f8a3a'); p.ell(11, 7, 3, 5, '#5cbf4f'); p.line(6, 3, 6, 13, '#2e6a2e'); p.line(11, 3, 11, 12, '#3f8a3a'); p.rect(7, 13, 3, 2, '#6b4423'); };
  IC.strawberi = function (p) { p.poly([[3, 6], [13, 6], [8, 15]], '#e0283a'); p.ell(8, 7, 5, 2.4, '#e0283a'); p.speck(4, 6, 8, 7, '#fff0a0', 7); p.rect(5, 3, 6, 3, '#3a8a2a'); p.px(8, 1, '#3a8a2a'); };
  IC.buah_naga = function (p) { p.ell(8, 9, 5.6, 6, '#d8288a'); p.ell(7, 8, 3.6, 4, '#ff58a8'); [[3, 5], [12, 4], [2, 11], [14, 10], [8, 2]].forEach(function (c) { p.line(8, 9, c[0], c[1], '#5aa83e'); p.px(c[0], c[1], '#8fd06a'); }); p.ell(8, 9, 2.6, 3, '#f5f0f0'); p.speck(6, 7, 5, 5, '#1a1a1a', 5); };
  IC.kerang = function (p) { p.poly([[2, 12], [8, 2], [14, 12]], '#f0d8c0'); for (var x = 4; x < 13; x += 2) p.line(8, 3, x, 12, '#d8b090'); p.rect(3, 12, 10, 2, '#e8c8a8'); };
  IC.mutiara = function (p) { p.ell(8, 10, 6, 4, '#c8a8b8'); p.ell(8, 9, 4.6, 2.6, '#e8d0e0'); p.disc(8, 8, 3, '#fbf8ff'); p.px(7, 7, '#ffffff'); p.px(9, 9, '#d8d0f0'); };
  IC.duit_lama = function (p) { p.disc(8, 8, 6, '#8a7040'); p.disc(7.5, 7.5, 4.8, '#b0904a'); p.clear(7, 7, 2, 2); p.rect(6, 6, 4, 1, '#6a5430'); p.rect(6, 9, 4, 1, '#6a5430'); p.speck(3, 3, 10, 10, '#4a8a6a', 6); p.clear(7, 7, 2, 2); };
  function plate(p, col) { p.ell(8, 11, 7, 3.4, '#e9e4d8'); p.ell(8, 11, 5.6, 2.4, col || '#f5f0e8'); }
  IC.ikan_bakar = function (p) { p.ell(8, 11, 7, 3.4, '#5aa83e'); p.ell(8, 9, 5.4, 2.6, '#8a5a2b'); p.ell(8, 8.5, 4.4, 1.8, '#b07a42'); p.poly([[2, 9], [0, 6], [0, 12]], '#6b4423'); for (var x = 5; x < 12; x += 2) p.px(x, 8, '#3a2412'); p.px(12, 8, '#f5f0e6'); };
  IC.asam_pedas = function (p) { p.ell(8, 8, 5.6, 2.4, '#d8502a'); p.ell(7, 8, 3, 1.2, '#7a8a7a'); p.px(10, 7, '#3a8a2a'); p.px(5, 8, '#f2c94c'); p.ell(8, 11, 6.5, 3.5, '#a0623a'); p.rect(2, 9, 13, 2, '#a0623a'); p.rect(2, 11, 13, 1, '#7a4426'); };
  IC.sambal_udang = function (p) { plate(p); [[5, 9], [9, 8], [11, 10]].forEach(function (c) { p.ell(c[0], c[1], 2.4, 1.6, '#e8603a'); p.px(c[0] - 1, c[1] - 1, '#ff9070'); }); p.speck(3, 7, 10, 4, '#a81a1a', 6); };
  IC.sotong_goreng = function (p) { plate(p); [[5, 9], [9, 8], [11, 11], [7, 11]].forEach(function (c) { p.disc(c[0], c[1], 2, '#d9962e'); p.px(c[0], c[1], '#f5f0e6'); }); p.px(12, 7, '#3a8a2a'); };
  IC.sup_cendawan = function (p) { p.ell(8, 8, 5.6, 2.4, '#d8b890'); p.ell(6, 8, 1.6, 1, '#c8502a'); p.ell(10, 7, 1.6, 1, '#c8502a'); p.px(8, 8, '#9a58a0'); p.ell(8, 11, 6.5, 3.5, '#e9eef5'); p.rect(2, 9, 13, 2, '#e9eef5'); p.rect(2, 11, 13, 1, '#4a78b8'); };
  IC.pengat_durian = function (p) { p.ell(8, 8, 5.6, 2.4, '#f2e0a0'); p.ell(7, 8, 2.6, 1.4, '#e8c860'); p.px(10, 7, '#c8a040'); p.ell(8, 11, 6.5, 3.5, '#a0623a'); p.rect(2, 9, 13, 2, '#a0623a'); p.rect(2, 11, 13, 1, '#7a4426'); };
  IC.teh_o = function (p) { p.rect(4, 6, 8, 8, '#f5f0e6'); p.rect(4, 6, 8, 1, '#d8d0c0'); p.rect(5, 7, 6, 2, '#9a4a1a'); p.rect(12, 8, 2, 4, '#f5f0e6'); p.px(13, 9, '#d8d0c0'); p.ell(8, 15, 6, 1, '#d8d0c0'); p.px(6, 4, '#e8e8f0'); p.px(8, 2, '#e8e8f0'); p.px(10, 4, '#e8e8f0'); };
  IC.jamu = function (p) { p.rect(5, 4, 6, 11, '#c88a20'); p.rect(5, 4, 6, 2, '#e8b040'); p.rect(6, 2, 4, 2, '#6b4423'); p.rect(6, 8, 4, 4, '#f5f0e1'); p.px(7, 9, '#3a8a2a'); p.px(8, 10, '#e8a020'); };
  IC.krathong = function (p) { p.ell(8, 12, 7, 3, '#3f8a3a'); for (var i = 0; i < 7; i++) { var x = 2 + i * 2; p.poly([[x, 11], [x + 1, 6], [x + 2, 11]], i % 2 ? '#5aa83e' : '#4a9a3a'); } p.disc(8, 8, 2.4, '#f08a24'); p.disc(6, 9, 1.4, '#ffffff'); p.line(10, 9, 11, 2, '#b8322a'); p.px(11, 1, '#ffd166'); };

  // ================================================================== GENERATE
  Art.generate2 = function (scene) {
    var make = Art.make;
    // buildings
    make(scene, 'house_penghulu', 80, 96, function (p) { house(p, { stilts: true, wallTop: 40, floor: 66, roofTop: 6, roof: 'zinc', wall: '#c99a5e', wall2: '#a8743e', trim: '#2f5f8f', shutter: '#3a6a9a', planks: true, gable: true, flowers: true }); }, true);
    make(scene, 'house_hut', 64, 72, function (p) { house(p, { stilts: true, wallTop: 30, floor: 50, roofTop: 4, roof: 'thatch', wall: '#d4c06a', wall2: '#b9a24e', trim: '#8a6a3a', shutter: '#b9a24e', planks: true }); }, true);
    make(scene, 'house_timber', 64, 76, function (p) { house(p, { stilts: true, wallTop: 30, floor: 54, roofTop: 2, roof: 'thatch', wall: '#b8834a', wall2: '#9a6a38', trim: '#5a3720', shutter: '#9c6a3a', planks: true, gable: true, flowers: true }); }, true);
    make(scene, 'house_brick', 64, 72, function (p) { house(p, { stilts: false, wallTop: 32, floor: 62, roofTop: 6, roof: 'tile', wall: '#f2ecdc', wall2: '#d8d0bc', trim: '#2e7a5a', shutter: '#2e7a5a', door: '#3a7a5a', flowers: true }); }, true);
    make(scene, 'bengkel', 80, 56, drawBengkel, true);
    make(scene, 'pondok', 64, 56, drawPondok, true);
    make(scene, 'beringin', 72, 80, drawBeringin, true);
    make(scene, 'wakaf', 48, 40, drawWakaf, true);
    make(scene, 'plot', 64, 48, drawPlot, true);
    make(scene, 'scaffold', 64, 72, drawScaffold, true);
    make(scene, 'sampan', 32, 12, drawSampan, true);
    make(scene, 'gate_vines', 32, 28, drawGateVines, true);
    make(scene, 'gate_rocks', 32, 24, drawGateRocks, true);
    make(scene, 'gate_dune', 16, 32, drawGateDune, true);
    make(scene, 'shrine', 18, 28, drawShrine, true);
    make(scene, 'tualang', 56, 112, drawTualang, true);
    make(scene, 'rafflesia', 32, 16, drawRafflesia, true);
    make(scene, 'pine', 24, 44, drawPine, true);
    make(scene, 'rumah_api', 32, 64, drawLighthouse, true);
    make(scene, 'beach_hut', 48, 36, drawBeachHut, true);
    make(scene, 'cham_tower', 48, 72, drawChamTower, true);
    make(scene, 'jtree', 40, 60, function (p) { drawJungleTree(p, 0); }, true);
    make(scene, 'jtree2', 40, 60, function (p) { drawJungleTree(p, 1); }, true);
    make(scene, 'durian', 48, 64, function (p) { drawDurianTree(p, false); }, true);
    make(scene, 'durian_f', 48, 64, function (p) { drawDurianTree(p, true); }, true);
    // decor
    make(scene, 'fern', 16, 11, function (p) { for (var i = 0; i < 6; i++) { var a = (-160 + i * 28) * Math.PI / 180; p.line(8, 10, 8 + Math.cos(a) * 7, 10 + Math.sin(a) * 8, i % 2 ? '#4f9a3a' : '#3d7a30', 2); } }, true);
    make(scene, 'bougainvillea', 16, 13, function (p) { p.disc(5, 8, 4, '#3f8a3a'); p.disc(11, 8, 4, '#3f8a3a'); p.disc(8, 6, 4, '#4f9a42'); p.speck(2, 2, 12, 9, '#e0288a', 14); p.speck(2, 2, 12, 9, '#ff70b8', 6); }, true);
    make(scene, 'coral', 12, 9, function (p) { p.line(3, 8, 2, 2, '#e87a8a', 2); p.line(6, 8, 7, 1, '#f09a6a', 2); p.line(9, 8, 10, 3, '#e87a8a', 2); }, true);
    make(scene, 'pebbles', 12, 6, function (p) { [[3, 3], [7, 4], [10, 2]].forEach(function (c) { p.ell(c[0], c[1], 1.8, 1.2, '#9d968a'); }); }, true);
    make(scene, 'dunegrass', 12, 10, function (p) { for (var i = 0; i < 5; i++) p.line(6, 9, 1 + i * 2.4, 1 + (i % 2) * 2, i % 2 ? '#b8a858' : '#9a9048'); }, true);
    make(scene, 'deadbush', 14, 10, function (p) { p.line(7, 9, 3, 2, '#7a5a3a'); p.line(7, 9, 11, 1, '#7a5a3a'); p.line(7, 9, 7, 3, '#8a6a4a'); p.line(5, 5, 2, 4, '#7a5a3a'); }, true);
    make(scene, 'punso', 26, 12, function (p) { p.ell(13, 8, 12, 4, '#b8582f'); p.ell(13, 7, 10, 3, '#d27040'); }, true);
    // forage
    Object.keys(FG).forEach(function (k) {
      var sz = FG_SIZE[k];
      make(scene, 'fg_' + k, sz[0], sz[1], function (p) { FG[k](p, true); }, true);
      make(scene, 'fg_' + k + '_e', sz[0], sz[1], function (p) { FG[k](p, false); }, true);
    });
    // villagers
    Object.keys(LC.VILLAGERS).forEach(function (vid) {
      if (LC.VILLAGERS[vid].sprite) return;   // the sea folk have their own sprites (art3.js)
      var L = LC.VILLAGERS[vid].look;
      make(scene, 'npc_' + vid + '_0', 16, 20, function (p) { drawVillager(p, L, false); });
      make(scene, 'npc_' + vid + '_1', 16, 20, function (p) { drawVillager(p, L, true); });
    });
    // critters
    [['kancil', 18, 14, drawKancil], ['ketam', 12, 9, drawKetam], ['penyu', 20, 12, drawPenyu], ['biawak', 26, 11, drawBiawak]].forEach(function (c) {
      make(scene, c[0] + '_0', c[1], c[2], function (p) { c[3](p, 0); });
      make(scene, c[0] + '_1', c[1], c[2], function (p) { c[3](p, 1); });
    });
    // spirits
    make(scene, 'sp_semangat', 20, 20, drawSemangat);
    make(scene, 'sp_bunian', 20, 21, drawBunian);
    make(scene, 'sp_naga', 24, 22, drawNaga);
    make(scene, 'sp_kenyalang', 28, 24, drawKenyalang);
    make(scene, 'sp_nuno', 26, 26, drawNuno);
    // fishing and fx
    make(scene, 'bobber', 5, 7, function (p) { p.rect(1, 0, 3, 3, '#e8323a'); p.rect(1, 3, 3, 3, '#f5f5f0'); p.px(2, 6, '#5a5a5a'); });
    make(scene, 'bang', 5, 11, function (p) { p.rect(1, 0, 3, 7, '#ffd166'); p.rect(1, 8, 3, 3, '#ffd166'); }, '#3a2a10');
    make(scene, 'wau', 26, 22, function (p) {
      p.ell(13, 6, 12, 5, '#c8323a'); p.ell(13, 6, 9, 3, '#f2c94c'); p.poly([[3, 11], [13, 9], [23, 11], [13, 20]], '#c8323a'); p.poly([[8, 12], [13, 11], [18, 12], [13, 17]], '#2a7ab8');
      p.ell(13, 4, 4, 2, '#2a7ab8'); p.line(13, 0, 13, 21, '#5a3a20');
    }, true);
    make(scene, 'wau2', 26, 22, function (p) {
      p.ell(13, 6, 12, 5, '#2a9d8f'); p.ell(13, 6, 9, 3, '#f5f0e6'); p.poly([[3, 11], [13, 9], [23, 11], [13, 20]], '#2a9d8f'); p.poly([[8, 12], [13, 11], [18, 12], [13, 17]], '#e9b949');
      p.line(13, 0, 13, 21, '#5a3a20');
    }, true);
    make(scene, 'krathong_fl', 12, 9, function (p) { p.ell(6, 7, 6, 2, '#3f8a3a'); for (var i = 0; i < 5; i++) p.poly([[1 + i * 2, 6], [2 + i * 2, 2], [3 + i * 2, 6]], i % 2 ? '#5aa83e' : '#4a9a3a'); p.disc(6, 4, 1.4, '#f08a24'); p.px(6, 1, '#ffd166'); p.px(6, 0, '#fff3b0'); });
    var fc = document.createElement('canvas'); fc.width = 96; fc.height = 48;
    var fx = fc.getContext('2d');
    fx.save(); fx.scale(1, 0.5);
    var gr = fx.createRadialGradient(48, 48, 0, 48, 48, 46);
    gr.addColorStop(0, 'rgba(235,240,245,0.85)'); gr.addColorStop(0.5, 'rgba(235,240,245,0.35)'); gr.addColorStop(1, 'rgba(235,240,245,0)');
    fx.fillStyle = gr; fx.fillRect(0, 0, 96, 96); fx.restore();
    if (scene.textures.exists('fog')) scene.textures.remove('fog');
    scene.textures.addCanvas('fog', fc); scene.textures.get('fog').setFilter(Phaser.Textures.FilterMode.LINEAR);
    // item icons
    Object.keys(IC).forEach(function (id) { make(scene, 'i_' + id, 16, 16, IC[id], true); });
  };
})(window.LC);
