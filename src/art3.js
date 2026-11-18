/* Little Creature — procedural pixel art for v1.4: bicycles and cars, and Kampung Karang under the sea
 * (sea-floor tiles, coral, shell houses, the shipwreck, sea folk, fish schools, jellyfish, bubbles, light rays). */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art, OUT = '#2a1d18';

  // ================================================================== TILES (after art2's)
  function seafloor(p, v) {
    p.rect(0, 0, 16, 16, v ? '#c9b98c' : '#c2b183'); p.speck(0, 0, 16, 16, '#b09e70', 16); p.speck(0, 0, 16, 16, '#d8caa0', 10);
    for (var i = 0; i < 2; i++) { var y = 3 + i * 7 + p.ri(2); for (var x = 0; x < 16; x++) if ((x + i * 4) % 6 < 3) p.px(x, y, '#b3a274'); }
    if (v) { p.px(3 + p.ri(10), 3 + p.ri(10), '#f0e0e8'); p.px(2 + p.ri(12), 2 + p.ri(12), '#e88a9a'); }
  }
  function lane(p) { p.rect(0, 0, 16, 16, '#e2d6b0'); p.speck(0, 0, 16, 16, '#d2c49a', 14); p.speck(0, 0, 16, 16, '#f0e8cc', 10); }
  function coral(p) {
    p.rect(0, 0, 16, 16, '#5a4a6a'); p.speck(0, 0, 16, 16, '#4a3c5a', 14);
    var cols = ['#e8607a', '#f0a050', '#c070d0', '#60c0b0', '#f0d060'];
    for (var i = 0; i < 7; i++) p.disc(p.ri(16), p.ri(16), 1.6 + p.r() * 1.8, cols[i % cols.length]);
    p.speck(0, 0, 16, 16, '#ffffff', 3);
  }
  Art.extraTiles = (Art.extraTiles || []).concat([
    { fn: function (p) { seafloor(p, 0); } }, { fn: function (p) { seafloor(p, 1); } }, { fn: lane }, { fn: coral }
  ]);
  Object.assign(Art.TI, { SEAF0: 40, SEAF1: 41, SEALANE: 42, CORAL: 43 });

  // ================================================================== VEHICLES
  var BIKE = '#c8323a', BIKE2 = '#8a1e24', TYRE = '#26222a', SPOKE = '#b8b8c0';
  function wheel(p, cx, cy, r, f) {
    p.disc(cx, cy, r, TYRE);
    p.ctx.globalCompositeOperation = 'destination-out'; p.disc(cx, cy, r - 1.3, '#000'); p.ctx.globalCompositeOperation = 'source-over';
    if (f) { p.line(cx - r + 1.5, cy, cx + r - 1.5, cy, SPOKE); p.line(cx, cy - r + 1.5, cx, cy + r - 1.5, SPOKE); }
    else { p.line(cx - r + 2, cy - r + 2, cx + r - 2, cy + r - 2, SPOKE); p.line(cx - r + 2, cy + r - 2, cx + r - 2, cy - r + 2, SPOKE); }
    p.px(cx, cy, '#e8e8f0');
  }
  function bikeSide(p, f) {      // 24x14, facing right
    wheel(p, 5, 9, 4.5, f); wheel(p, 19, 9, 4.5, f);
    p.line(5, 9, 10, 5, BIKE, 2); p.line(10, 5, 17, 5, BIKE, 2); p.line(10, 5, 12, 9, BIKE); p.line(12, 9, 5, 9, BIKE2); p.line(17, 5, 19, 9, BIKE, 2);
    p.rect(8, 3, 4, 1, '#3a2a20'); p.line(17, 5, 18, 2, '#9aa0a8'); p.rect(17, 1, 4, 1, '#9aa0a8');
    p.rect(19, 2, 4, 3, '#c9a46a'); p.rect(19, 2, 4, 1, '#e0c08a');   // front basket
    p.disc(12, 9, 1.4, '#9aa0a8');
  }
  function bikeFront(p, f, back) {   // 12x14
    p.ell(6, 9, 1.6, 4.4, TYRE); p.px(6, f ? 7 : 11, SPOKE);
    p.rect(1, 3, 10, 1, '#9aa0a8'); p.rect(5, 4, 2, 4, BIKE);
    if (!back) { p.rect(3, 4, 6, 3, '#c9a46a'); p.rect(3, 4, 6, 1, '#e0c08a'); p.px(6, 8, '#fff3b0'); }
    else { p.rect(4, 5, 4, 1, '#3a2a20'); p.px(6, 9, '#e83a3a'); }
    p.px(0, 3, '#3a3a40'); p.px(11, 3, '#3a3a40');
  }
  function carSide(p, col, col2, f) {   // 34x22, facing right
    var b = f ? 1 : 0;
    p.rect(2, 9 + b, 30, 7, col); p.rect(2, 15 + b, 30, 1, col2);
    p.poly([[8, 9 + b], [12, 2 + b], [24, 2 + b], [28, 9 + b]], col);
    p.poly([[11, 9 + b], [13, 4 + b], [17, 4 + b], [17, 9 + b]], '#a8d8f0'); p.poly([[19, 9 + b], [19, 4 + b], [23, 4 + b], [26, 9 + b]], '#a8d8f0');
    p.rect(18, 3 + b, 1, 6, col2);
    [[20, 4], [19, 5], [21, 5], [18, 6], [22, 6]].forEach(function (c) { p.px(c[0], c[1] + b, '#ecd28a'); });   // the driver's conical hat
    p.rect(31, 10 + b, 2, 2, '#fff3b0'); p.rect(1, 10 + b, 2, 2, '#e83a3a'); p.rect(2, 13 + b, 30, 1, '#e8e8f0');
    p.disc(9, 17, 3.4, TYRE); p.disc(9, 17, 1.6, '#b8b8c0'); p.disc(26, 17, 3.4, TYRE); p.disc(26, 17, 1.6, '#b8b8c0');
  }
  function carFront(p, col, col2, f, back) {   // 24x24
    var b = f ? 1 : 0;
    p.rect(2, 11 + b, 20, 8, col); p.rect(2, 18 + b, 20, 1, col2);
    p.poly([[5, 11 + b], [7, 3 + b], [17, 3 + b], [19, 11 + b]], col);
    p.poly([[7, 10 + b], [8, 5 + b], [16, 5 + b], [17, 10 + b]], back ? '#88b8d0' : '#a8d8f0');
    [[12, 6], [11, 7], [13, 7], [10, 8], [14, 8], [9, 9], [15, 9]].forEach(function (c) { p.px(c[0], c[1] + b, '#ecd28a'); });
    if (!back) { p.disc(5, 14 + b, 1.6, '#fff3b0'); p.disc(19, 14 + b, 1.6, '#fff3b0'); p.rect(8, 15 + b, 8, 2, '#3a3a40'); for (var x = 9; x < 16; x += 2) p.px(x, 15 + b, '#9aa0a8'); }
    else { p.rect(4, 13 + b, 3, 2, '#e83a3a'); p.rect(17, 13 + b, 3, 2, '#e83a3a'); p.rect(9, 15 + b, 6, 2, '#f5f0e1'); }
    p.rect(1, 19, 4, 4, TYRE); p.rect(19, 19, 4, 4, TYRE); p.rect(2, 19 + b, 20, 1, '#e8e8f0');
  }

  // ================================================================== UNDERWATER BUILDINGS
  function drawKedai(p) {   // Abang Zul's bicycle shop, 64x48
    p.rect(2, 40, 60, 6, 'rgba(30,20,12,0.35)');
    p.rect(4, 18, 56, 26, '#e8dcc0'); p.rect(4, 18, 56, 2, '#3a6a9a');
    p.rect(10, 26, 26, 18, '#4a4a52'); for (var y = 27; y < 44; y += 2) p.rect(10, y, 26, 1, '#5a5a62');   // rolling shutter, half up
    p.rect(10, 26, 26, 6, '#2a2a30');
    p.rect(40, 24, 14, 10, '#7ab8d8'); p.rect(46, 24, 1, 10, '#e8dcc0'); p.rect(40, 29, 14, 1, '#e8dcc0');
    [[16, 36], [26, 36]].forEach(function (w) { p.disc(w[0], w[1], 4, '#26222a'); p.disc(w[0], w[1], 2.6, '#e8dcc0'); });   // a bike in the doorway
    p.line(16, 36, 21, 32, '#c8323a', 2); p.line(21, 32, 26, 36, '#c8323a', 2);
    p.poly([[0, 20], [6, 6], [58, 6], [64, 20]], '#3a6a9a'); for (var x = 0; x < 64; x += 4) p.line(x, 20, x + (32 - x) * 0.18, 6, '#2a4e74');
    p.rect(14, 8, 36, 9, '#f5f0e1'); p.rect(14, 8, 36, 1, '#c8323a'); p.rect(14, 16, 36, 1, '#c8323a');
    p.disc(20, 12, 2.4, '#3a3a40'); p.disc(20, 12, 1, '#f5f0e1'); p.rect(25, 11, 20, 1, '#3a3a40'); p.rect(25, 13, 14, 1, '#3a3a40');
  }
  function drawNagaShrine(p) {   // 36x60
    var H = p.h;
    p.rect(4, H - 8, 28, 8, '#8a8a92'); p.rect(4, H - 8, 28, 1, '#a8a8b0');
    p.rect(11, 14, 14, H - 22, '#9a9aa2'); p.rect(22, 14, 3, H - 22, '#7a7a82'); p.rect(11, 14, 14, 2, '#b8b8c0');
    for (var t = 0; t < 4; t++) { var y = 20 + t * 9; p.ell(18, y, 10, 2.6, '#2f9a7a'); p.ell(18, y - 0.6, 9, 1.4, '#4fc0a0'); for (var k = 0; k < 4; k++) p.px(10 + k * 5, y, '#f2c94c'); }
    p.ell(18, 9, 6, 5, '#2f9a7a'); p.ell(18, 8, 4.6, 3.6, '#4fc0a0'); p.px(16, 8, '#ffd166'); p.px(20, 8, '#ffd166');
    [[13, 3], [15, 1], [18, 0], [21, 1], [23, 3]].forEach(function (c) { p.rect(c[0], c[1], 1, 4, '#f2c94c'); });
    p.speck(4, 14, 28, H - 22, '#e88a9a', 6); p.speck(4, 14, 28, H - 22, '#60c0b0', 6);
  }
  function drawKimaHouse(p) {   // giant clam house, 52x40
    p.ell(26, 30, 24, 9, '#7a8aa8'); p.ell(26, 29, 22, 7.6, '#a8b8d0');
    for (var x = 6; x < 48; x += 5) p.line(26, 34, x, 24, '#8898b8');
    p.ell(26, 15, 21, 13, '#a8b8d0'); p.ell(26, 15, 19, 11, '#c8d4e8');
    for (x = 8; x < 46; x += 5) p.line(26, 3, x, 26, '#a8b8d0');
    p.ell(26, 26, 16, 4, '#ffe0f0'); p.disc(26, 24, 3.4, '#fffaff'); p.px(25, 23, '#ffffff');   // the pearl doorway glow
    p.rect(22, 25, 8, 9, '#4a3a5a'); p.ell(26, 25, 4, 3, '#4a3a5a');
    p.line(6, 30, 10, 18, '#8a6a45', 2); p.line(46, 30, 42, 18, '#8a6a45', 2);
  }
  function drawCoralHouse(p) {   // 48x44
    p.ell(24, 26, 22, 17, '#e8607a'); p.ell(22, 24, 18, 13, '#f07890');
    p.speck(4, 10, 40, 30, '#c84a64', 30); p.speck(4, 10, 40, 30, '#ffb0c0', 14);
    [[8, 10, 3], [40, 12, 3.4], [24, 6, 4], [14, 7, 2.4], [34, 7, 2.6]].forEach(function (b) { p.disc(b[0], b[1], b[2], ['#f0a050', '#c070d0', '#60c0b0'][Math.round(b[0]) % 3]); });
    p.rect(18, 28, 12, 15, '#5a3a4a'); p.ell(24, 28, 6, 4, '#5a3a4a'); p.rect(19, 29, 10, 1, '#f2c94c');
    p.disc(10, 25, 3.4, '#ffe8a0'); p.disc(10, 25, 2.2, '#5a8ac8'); p.disc(38, 25, 3.4, '#ffe8a0'); p.disc(38, 25, 2.2, '#5a8ac8');
    p.rect(34, 30, 8, 3, '#8a6a45'); p.px(36, 29, '#f08020'); p.px(37, 29, '#ffffff'); p.px(38, 29, '#f08020');   // clownfish window box
  }
  function drawWreck(p) {   // shipwreck, 100x56
    var H = p.h;
    p.poly([[6, 30], [96, 24], [90, 50], [14, 54]], '#5a4030');
    p.poly([[10, 32], [92, 27], [88, 46], [16, 50]], '#6e5038');
    for (var x = 14; x < 90; x += 8) p.line(x, 32 - (x - 10) * 0.06, x + 2, 50 - (x - 14) * 0.05, '#4a3424');
    p.poly([[40, 38], [52, 36], [50, 46], [42, 47]], '#1a1418');   // the hole in the hull
    p.line(52, 28, 46, 2, '#5a4030', 3); p.line(46, 6, 30, 12, '#4a3424', 2);
    p.poly([[47, 6], [64, 10], [60, 24], [50, 22]], '#a89878'); p.line(50, 12, 60, 16, '#8a7a5a'); p.line(49, 17, 60, 20, '#8a7a5a');   // a tattered junk sail
    p.speck(8, 26, 88, 28, '#3a7a5a', 30); p.speck(8, 26, 88, 28, '#e88a9a', 8);
    p.rect(70, 44, 8, 4, '#d8e0f0'); p.rect(71, 44, 6, 1, '#3a6ab8'); p.ell(28, 50, 4, 1.6, '#d8e0f0'); p.px(28, 50, '#3a6ab8');   // spilled porcelain
  }
  function drawSurface(p) {   // a column of light and bubbles to swim up (32x40)
    for (var y = 0; y < 40; y++) { var a = 0.5 - y / 80; p.rect(4 + y / 10, y, 24 - y / 5, 1, 'rgba(220,245,255,' + a.toFixed(2) + ')'); }
    [[10, 30, 2], [20, 24, 1.6], [14, 16, 1.4], [22, 10, 2], [12, 6, 1.2], [18, 36, 1.4]].forEach(function (b) { p.disc(b[0], b[1], b[2], '#e8f8ff'); p.px(b[0] - 1, b[1] - 1, '#ffffff'); });
  }
  function drawDiveRing(p) {   // bubbles on the island's surface (16x12)
    p.ell(8, 7, 7, 3.6, '#bff2f2'); p.ell(8, 7, 5.4, 2.4, '#3fb5c4');
    [[4, 6], [10, 4], [12, 8], [7, 9]].forEach(function (b) { p.disc(b[0], b[1], 1.2, '#ffffff'); });
  }
  function drawTurtleNet(p, free) {   // 26x18
    p.ell(13, 10, 9, 5.6, '#5a7a3a'); p.ell(13, 9.4, 7, 4.2, '#7a9a4a');
    [[10, 8], [14, 7], [16, 10], [11, 11]].forEach(function (c) { p.px(c[0], c[1], '#4a6a2a'); });
    p.ell(23, 9, 3, 2.4, '#a8b878'); p.px(24, 8, '#2a1a10');
    p.ell(6, 4, 3, 1.4, '#98a868'); p.ell(6, 16, 3, 1.4, '#98a868'); p.ell(19, 16, 2.6, 1.3, '#98a868');
    if (!free) { for (var i = 0; i < 26; i += 3) { p.line(i, 0, i + 6, 18, '#e8e0c8'); p.line(i + 6, 0, i, 18, '#e8e0c8'); } p.disc(3, 3, 1.4, '#3a8ac8'); }
  }

  // ================================================================== SEA FOLK (portrait-friendly sizes)
  function drawDugong(p, blink) {   // Tok Duyung, 26x20
    p.ell(14, 12, 11, 7, '#9a8a92'); p.ell(13, 11, 9.6, 5.6, '#b8a8b0');
    p.ell(14, 15, 8, 2.4, '#d8c8cc');
    p.poly([[2, 10], [0, 6], [0, 15]], '#8a7a82');
    p.ell(9, 17, 3, 1.6, '#8a7a82'); p.ell(19, 17, 3, 1.6, '#8a7a82');
    p.ell(22, 10, 4, 3.6, '#b8a8b0'); p.ell(24, 12, 2.6, 2, '#d8c8cc');
    if (blink) p.rect(21, 8, 2, 1, '#2a1a20'); else { p.px(21, 8, '#2a1a20'); p.px(22, 8, '#2a1a20'); }
    p.px(25, 13, '#f5f5f0'); p.px(24, 14, '#f5f5f0'); p.px(23, 14, '#f5f5f0');   // white whiskers
    p.rect(18, 4, 7, 2, '#3f8a3a'); p.px(19, 3, '#5aa83e'); p.px(23, 3, '#5aa83e');   // a sea-grass crown
    p.outline('#4a3a42');
  }
  function drawMermaid(p, blink) {   // Nila, 18x24
    p.poly([[5, 13], [13, 13], [12, 19], [9, 22], [6, 19]], '#2fa8a0'); p.poly([[9, 21], [4, 24], [14, 24]], '#3fc8b8');
    p.speck(5, 13, 8, 8, '#7fe8d8', 6);
    p.rect(5, 8, 8, 5, '#c9905e'); p.rect(5, 9, 8, 3, '#e86a8a'); p.rect(4, 9, 1, 4, '#c9905e'); p.rect(13, 9, 1, 4, '#c9905e');
    p.rect(5, 2, 8, 6, '#c9905e');
    p.rect(4, 1, 10, 3, '#1e140e'); p.rect(3, 3, 2, 10, '#1e140e'); p.rect(13, 3, 2, 10, '#1e140e');
    if (blink) { p.rect(6, 5, 2, 1, '#2a1a10'); p.rect(10, 5, 2, 1, '#2a1a10'); } else { p.px(7, 5, '#2a1a10'); p.px(10, 5, '#2a1a10'); }
    p.px(8, 7, '#a84a4a'); p.px(9, 7, '#a84a4a');
    p.disc(13, 2, 1.4, '#ffe0f0'); p.px(13, 2, '#ffffff');   // a pearl hair clip
    p.outline('#1a3a3a');
  }
  function drawCrab(p, blink) {   // Pak Ketam, 22x18
    p.ell(11, 11, 8, 5, '#d6502a'); p.ell(11, 10, 6.6, 3.6, '#ee7040');
    p.disc(2, 7, 2.6, '#d6502a'); p.disc(20, 7, 2.6, '#d6502a'); p.px(1, 5, '#a83a1e'); p.px(21, 5, '#a83a1e');
    for (var i = 0; i < 3; i++) { p.line(5 - i, 13 + i, 2 - i, 17, '#a83a1e'); p.line(17 + i, 13 + i, 20 + i, 17, '#a83a1e'); }
    p.rect(7, 3, 1, 4, '#d6502a'); p.rect(14, 3, 1, 4, '#d6502a');
    if (blink) { p.rect(6, 3, 3, 1, '#1a1a1a'); p.rect(13, 3, 3, 1, '#1a1a1a'); } else { p.disc(7, 3, 1.4, '#f5f5f0'); p.disc(14, 3, 1.4, '#f5f5f0'); p.px(7, 3, '#1a1a1a'); p.px(14, 3, '#1a1a1a'); }
    p.rect(8, 0, 6, 2, '#f5f0e1'); p.rect(8, 1, 6, 1, '#d8d0c0');   // a little white kopiah
    p.rect(9, 11, 4, 1, '#a83a1e');
    p.outline('#5a1a0a');
  }

  // ================================================================== FORAGE (ready / picked)
  var FG = {
    seaweed: function (p, ok) { for (var i = 0; i < (ok ? 5 : 2); i++) { var x = 3 + i * 2.5; p.line(x, 15, x + Math.sin(i) * 2, ok ? 2 + (i % 2) * 3 : 10, i % 2 ? '#3f8a5a' : '#5aa86a', 2); } },
    seacuke: function (p, ok) { if (!ok) { p.px(6, 6, '#a89870'); return; } p.ell(7, 5, 6, 2.6, '#6a3a2a'); p.ell(7, 4.4, 5, 1.6, '#8a5a3a'); p.speck(2, 3, 10, 4, '#e8c060', 6); },
    clam: function (p, ok) { p.ell(9, 8, 8, 4.4, '#7a8aa8'); p.ell(9, 7, 7, 3.4, '#a8b8d0'); for (var x = 3; x < 16; x += 3) p.line(9, 11, x, 4, '#8898b8'); if (ok) { p.ell(9, 8, 5, 1.2, '#2a6ab8'); p.disc(9, 8, 1.4, '#fffaff'); } else p.ell(9, 8, 5, 0.8, '#4a5a78'); },
    rubbish: function (p, ok) { if (!ok) { p.px(6, 6, '#c2b183'); return; } p.rect(2, 4, 4, 7, '#a8d8e8'); p.rect(2, 4, 4, 1, '#3a8ac8'); for (var i = 0; i < 12; i += 3) { p.line(6 + i * 0.5, 2, 14, 4 + i * 0.6, '#e8e0c8'); p.line(7, 10 - i * 0.5, 14, 2 + i * 0.5, '#d8d0b8'); } },
    wreck: function (p, ok) { p.rect(1, 5, 16, 9, '#5a3a20'); p.rect(1, 5, 16, 2, '#7a5030'); p.rect(1, 9, 16, 1, '#c9a040'); p.rect(8, 8, 2, 3, '#c9a040'); if (ok) { p.px(4, 4, '#ffe060'); p.px(12, 3, '#fff8c0'); p.px(13, 4, '#d8e0f0'); } else p.rect(1, 2, 16, 3, '#3a2414'); }
  };
  var FG_SIZE = { seaweed: [16, 16], seacuke: [14, 9], clam: [18, 12], rubbish: [16, 13], wreck: [18, 15] };

  // ================================================================== ICONS
  var IC = {};
  IC.basikal = function (p) { p.disc(4, 11, 3.4, '#26222a'); p.disc(4, 11, 2, '#00000000'); p.disc(12, 11, 3.4, '#26222a'); p.line(4, 11, 7, 6, '#c8323a', 2); p.line(7, 6, 11, 6, '#c8323a', 2); p.line(11, 6, 12, 11, '#c8323a'); p.line(7, 6, 8, 11, '#c8323a'); p.rect(6, 4, 3, 1, '#3a2a20'); p.rect(11, 3, 3, 1, '#9aa0a8'); p.rect(12, 4, 3, 2, '#c9a46a'); p.disc(4, 11, 1.2, '#b8b8c0'); p.disc(12, 11, 1.2, '#b8b8c0'); };
  IC.kereta = function (p) { p.rect(1, 7, 14, 5, '#c8323a'); p.poly([[4, 7], [6, 3], [11, 3], [13, 7]], '#c8323a'); p.rect(6, 4, 2, 3, '#a8d8f0'); p.rect(9, 4, 2, 3, '#a8d8f0'); p.disc(4, 12, 2, '#26222a'); p.disc(12, 12, 2, '#26222a'); p.rect(14, 8, 1, 1, '#fff3b0'); p.rect(1, 10, 14, 1, '#8a1e24'); };
  IC.rumpai_laut = function (p) { for (var i = 0; i < 5; i++) p.line(3 + i * 2.5, 15, 4 + i * 2.5 + Math.sin(i * 2) * 2, 2 + (i % 2) * 3, i % 2 ? '#3f8a5a' : '#5aa86a', 2); };
  IC.gamat = function (p) { p.ell(8, 9, 7, 3.4, '#6a3a2a'); p.ell(8, 8, 6, 2.2, '#8a5a3a'); p.speck(2, 6, 12, 6, '#e8c060', 8); p.px(14, 9, '#4a2414'); };
  IC.pinggan_lama = function (p) { p.ell(8, 9, 7, 5, '#e8eef5'); p.ell(8, 9, 5.6, 3.8, '#f5f8fc'); p.ell(8, 9, 3, 2, '#3a6ab8'); p.px(8, 9, '#f5f8fc'); for (var i = 0; i < 8; i++) { var a = i / 8 * Math.PI * 2; p.px(8 + Math.cos(a) * 6, 9 + Math.sin(a) * 4.3, '#3a6ab8'); } };
  IC.sampah = function (p) { p.rect(3, 4, 5, 9, '#a8d8e8'); p.rect(3, 4, 5, 2, '#3a8ac8'); for (var i = 0; i < 10; i += 3) { p.line(7, 3 + i, 15, 6 + i * 0.4, '#e8e0c8'); p.line(8, 14 - i, 15, 3 + i, '#d8d0b8'); } };
  IC.kerabu_rumpai = function (p) { p.ell(8, 11, 7, 3.4, '#e9e4d8'); p.ell(8, 11, 5.6, 2.4, '#f5f0e8'); for (var i = 0; i < 6; i++) p.line(4 + i * 1.5, 11, 5 + i * 1.4, 7, i % 2 ? '#3f8a5a' : '#5aa86a'); p.px(6, 9, '#d62828'); p.px(10, 8, '#d62828'); p.disc(12, 8, 1.4, '#9be15d'); };
  IC.agar_agar = function (p) { p.ell(8, 13, 7, 2, '#e9e4d8'); p.rect(3, 4, 10, 9, '#f5f0e1'); p.rect(3, 4, 10, 3, '#e86a8a'); p.rect(3, 7, 10, 3, '#f5f0e1'); p.rect(3, 10, 10, 3, '#5aa86a'); p.rect(3, 4, 10, 1, '#ff9ab0'); p.rect(12, 4, 1, 9, '#d8d0c0'); };

  // ================================================================== GENERATE
  Art.generate3 = function (scene) {
    var make = Art.make;
    // vehicles: one bicycle, and a car in each player's outfit colour
    ['', '_1'].forEach(function (s, f) {
      make(scene, 'bike_side_' + f, 24, 14, function (p) { bikeSide(p, f); });
      make(scene, 'bike_down_' + f, 12, 14, function (p) { bikeFront(p, f, false); });
      make(scene, 'bike_up_' + f, 12, 14, function (p) { bikeFront(p, f, true); });
    });
    var CAR = [['#c8323a', '#8a1e24'], ['#2a9d8f', '#1f7a70'], ['#e9b949', '#c4922f'], ['#8e5cc4', '#6c4398']];
    CAR.forEach(function (c, i) {
      for (var f = 0; f < 2; f++) {
        (function (f) {
          make(scene, 'car' + i + '_side_' + f, 34, 22, function (p) { carSide(p, c[0], c[1], f); }, true);
          make(scene, 'car' + i + '_down_' + f, 24, 24, function (p) { carFront(p, c[0], c[1], f, false); }, true);
          make(scene, 'car' + i + '_up_' + f, 24, 24, function (p) { carFront(p, c[0], c[1], f, true); }, true);
        })(f);
      }
    });
    // buildings and things under the sea
    make(scene, 'kedai_basikal', 64, 48, drawKedai, true);
    make(scene, 'naga_shrine', 36, 60, drawNagaShrine, true);
    make(scene, 'rumah_kima', 52, 40, drawKimaHouse, true);
    make(scene, 'rumah_karang', 48, 44, drawCoralHouse, true);
    make(scene, 'kapal_karam', 100, 56, drawWreck, true);
    make(scene, 'surface', 32, 40, drawSurface);
    make(scene, 'dive_ring', 16, 12, drawDiveRing);
    make(scene, 'turtle_net', 26, 18, function (p) { drawTurtleNet(p, false); }, true);
    make(scene, 'turtle_free', 26, 18, function (p) { drawTurtleNet(p, true); }, true);
    // decor
    make(scene, 'kelp', 12, 30, function (p) { for (var y = 29; y > 1; y--) { var x = 6 + Math.sin(y / 4) * 2.4; p.rect(x - 1, y, 2, 1, y % 5 ? '#2f7a4a' : '#4a9a5a'); if (y % 6 === 0) p.px(x + 2, y, '#5aa86a'); } }, true);
    make(scene, 'seagrass', 14, 12, function (p) { for (var i = 0; i < 6; i++) p.line(2 + i * 2, 11, 1 + i * 2.2 + (i % 2), 2 + (i % 3), i % 2 ? '#4a9a5a' : '#3a8a4a'); }, true);
    make(scene, 'anemone', 14, 10, function (p) { p.ell(7, 8, 5, 2, '#c84a8a'); for (var i = 0; i < 7; i++) p.line(7, 8, 1 + i * 2, 1 + (i % 2) * 2, '#f08ac0'); p.px(9, 5, '#f08020'); p.px(10, 5, '#ffffff'); }, true);
    make(scene, 'shellrock', 14, 9, function (p) { p.ell(7, 6, 6, 3, '#8a8a92'); p.ell(6, 5, 4, 2, '#a8a8b0'); p.disc(10, 4, 1.4, '#f0d0b8'); p.px(4, 4, '#e88a9a'); }, true);
    // forage
    Object.keys(FG).forEach(function (k) {
      var sz = FG_SIZE[k];
      make(scene, 'fg_' + k, sz[0], sz[1], function (p) { FG[k](p, true); }, true);
      make(scene, 'fg_' + k + '_e', sz[0], sz[1], function (p) { FG[k](p, false); }, true);
    });
    // sea folk
    [['duyung', 26, 20, drawDugong], ['nila', 18, 24, drawMermaid], ['ketam', 22, 18, drawCrab]].forEach(function (n) {
      make(scene, 'npc_' + n[0] + '_0', n[1], n[2], function (p) { n[3](p, false); });
      make(scene, 'npc_' + n[0] + '_1', n[1], n[2], function (p) { n[3](p, true); });
    });
    // sea critters
    for (var f = 0; f < 2; f++) {
      (function (f) {
        make(scene, 'ikan_kecil_' + f, 16, 10, function (p) {
          [[4, 3], [10, 2], [7, 7]].forEach(function (c, k) { var dx = f && k === 1 ? 1 : 0; p.ell(c[0] + dx, c[1], 2.6, 1.3, k % 2 ? '#f0a020' : '#5ab8e8'); p.px(c[0] - 3 + dx, c[1], k % 2 ? '#c87a10' : '#3a8ac8'); p.px(c[0] + 1 + dx, c[1] - 1, '#ffffff'); });
        });
        make(scene, 'ubur_' + f, 12, 14, function (p) {
          p.ell(6, 4, 5, 3.6 - f * 0.6, 'rgba(240,170,220,0.85)'); p.ell(6, 3.4, 3.4, 2, 'rgba(255,220,240,0.9)');
          for (var i = 0; i < 4; i++) p.line(2 + i * 2.6, 6, 2 + i * 2.6 + (f ? 1 : -1), 13, 'rgba(240,170,220,0.7)');
        });
      })(f);
    }
    // fx
    make(scene, 'bubble', 5, 5, function (p) { p.disc(2.5, 2.5, 2.4, 'rgba(220,245,255,0.5)'); p.px(1, 1, '#ffffff'); }, '#bfe8ff');
    make(scene, 'mask', 9, 4, function (p) { p.rect(0, 1, 9, 2, '#26222a'); p.rect(1, 0, 3, 3, '#7fd8f0'); p.rect(5, 0, 3, 3, '#7fd8f0'); p.px(1, 0, '#ffffff'); p.px(5, 0, '#ffffff'); });
    var rc = document.createElement('canvas'); rc.width = 32; rc.height = 128;
    var rx = rc.getContext('2d'), gr = rx.createLinearGradient(0, 0, 0, 128);
    gr.addColorStop(0, 'rgba(230,250,255,0.55)'); gr.addColorStop(1, 'rgba(230,250,255,0)');
    rx.fillStyle = gr; rx.beginPath(); rx.moveTo(10, 0); rx.lineTo(22, 0); rx.lineTo(32, 128); rx.lineTo(0, 128); rx.closePath(); rx.fill();
    if (scene.textures.exists('ray')) scene.textures.remove('ray');
    scene.textures.addCanvas('ray', rc); scene.textures.get('ray').setFilter(Phaser.Textures.FilterMode.LINEAR);
    Object.keys(IC).forEach(function (id) { make(scene, 'i_' + id, 16, 16, IC[id], true); });
  };
})(window.LC);
