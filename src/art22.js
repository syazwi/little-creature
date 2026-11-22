/* Little Creature — art, part 22 (v3.3): Chapter 11, Bulan dan Mutiara. The Astana of Sulu with its okir carvings and
 * banners, the gong hall, market stalls, Sama Dilaut houses on stilts and lepa houseboats, the vinta (side view at the
 * jetty, and from above when you sail her), the reef: an old sunken boat and pearl oysters; the open sea: Batu Kembar,
 * reef rocks, a whirlpool, foam and wind streaks; Pulau Bulan's white stones and agung gongs; the Bakunawa (head, body,
 * tail); the moon and the eclipse; the Mutiara Kembar; and the chapter's icons. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art;
  var OUT = '#2a1a10', WOOD = '#8a5a2b', WOODD = '#5a3a1e', WOODL = '#a8743e', GOLD = '#e9c46a', GOLDD = '#c4922f';
  var OKR = '#c8323a', OKY = '#f2c94c', OKG = '#3a9a5a', OKB = '#2a6aa8';   // okir colours
  var SAIL = ['#d8323a', '#f2c94c', '#3a9a5a', '#2a6aa8', '#f2ece0'];

  // ---------------------------------------------------------------- the Astana (176 x 112; footprint: the bottom 4 rows)
  function drawAstana(p) {
    p.ell(88, 108, 84, 5, 'rgba(30,20,10,0.25)');
    for (var x = 8; x < 170; x += 14) { p.rect(x, 84, 4, 26, WOODD); p.rect(x, 84, 1, 26, WOOD); }
    p.rect(2, 78, 172, 7, '#6a4426'); p.rect(2, 78, 172, 1, WOODL);
    p.rect(12, 46, 152, 32, '#b07a44'); p.rect(12, 46, 152, 2, '#d09a62');
    for (var wx = 18; wx < 160; wx += 20) { p.rect(wx, 54, 11, 16, '#3a2214'); p.rect(wx - 1, 53, 13, 1, GOLDD); p.rect(wx + 5, 54, 1, 16, '#6a4426'); }
    // okir: a band of curling leaves along the walls and eaves
    for (var ox = 14; ox < 162; ox += 8) {
      p.px(ox, 49, OKR); p.px(ox + 1, 48, OKR); p.px(ox + 2, 49, OKY); p.px(ox + 3, 50, OKG); p.px(ox + 4, 49, OKG); p.px(ox + 5, 48, OKB);
      p.px(ox + 2, 74, OKG); p.px(ox + 3, 73, OKY); p.px(ox + 4, 74, OKR);
    }
    p.rect(12, 76, 152, 2, GOLDD);
    // the great roof, high and steep, with flaring ends (and a second roof on top)
    p.poly([[0, 50], [176, 50], [150, 22], [26, 22]], '#4a3020'); p.rect(0, 48, 176, 3, '#6a4028');
    for (var ry = 26; ry < 48; ry += 4) p.line(26 - (ry - 22) * 0.95, ry, 150 + (ry - 22) * 0.95, ry, '#3a2418');
    p.poly([[40, 24], [136, 24], [118, 2], [58, 2]], '#3e2618'); for (var r2 = 6; r2 < 24; r2 += 4) p.line(58 - (r2 - 2) * 0.8, r2, 118 + (r2 - 2) * 0.8, r2, '#2e1c12');
    // carved okir boards along the eaves, and the flaring panolong ends
    for (var ex = 4; ex < 172; ex += 6) { p.px(ex, 51, OKY); p.px(ex + 2, 52, OKR); p.px(ex + 4, 51, OKG); }
    [[0, 50, -1], [176, 50, 1], [40, 24, -1], [136, 24, 1]].forEach(function (h) {
      p.line(h[0], h[1], h[0] + h[2] * 7, h[1] - 7, OKR, 2); p.line(h[0] + h[2] * 7, h[1] - 7, h[0] + h[2] * 4, h[1] - 11, OKY, 2); p.px(h[0] + h[2] * 3, h[1] - 12, OKG);
    });
    p.rect(58, 1, 60, 2, GOLD); p.rect(86, -1, 4, 4, GOLD);
    // the gable, carved
    p.poly([[70, 48], [106, 48], [88, 26]], '#c08a52'); p.poly([[75, 46], [101, 46], [88, 31]], '#d8a868');
    p.disc(88, 40, 3, OKR); p.px(88, 40, OKY); p.line(80, 44, 88, 36, OKG); p.line(96, 44, 88, 36, OKG);
    // steps
    p.rect(74, 84, 28, 26, '#7a4a28'); for (var s = 0; s < 6; s++) { p.rect(74, 86 + s * 4, 28, 2, '#a8703c'); p.rect(74, 88 + s * 4, 28, 1, '#5a341c'); }
    p.rect(72, 80, 2, 30, OKR); p.rect(102, 80, 2, 30, OKR);
    p.outline(OUT);
  }
  function drawPanji(p) {   // a tall banner (12 x 40)
    p.rect(1, 2, 2, 38, WOODD); p.disc(2, 2, 1.5, GOLD);
    p.poly([[3, 4], [11, 6], [11, 22], [7, 19], [3, 22]], OKR); p.rect(3, 9, 8, 2, OKY); p.rect(3, 14, 8, 2, OKG);
  }
  // the gong hall (80 x 56)
  function drawBalai(p) {
    p.ell(40, 53, 38, 3, 'rgba(30,20,10,0.25)');
    [6, 26, 52, 72].forEach(function (x) { p.rect(x, 22, 3, 32, WOODD); });
    p.rect(2, 44, 76, 4, '#7a5232'); p.rect(2, 44, 76, 1, WOODL);
    // the kulintang inside: a row of little gongs on a carved frame
    p.rect(14, 38, 40, 4, '#8a2a1e'); p.rect(14, 38, 40, 1, OKY);
    for (var i = 0; i < 8; i++) { p.disc(17 + i * 5, 37, 2.2, '#c89a2a'); p.px(17 + i * 5, 36, '#f6dc8a'); }
    // two agung hanging at the side, and a drum
    p.rect(58, 26, 14, 2, WOODD); p.disc(61, 33, 4, '#b8862a'); p.disc(61, 33, 1.5, '#e8c050'); p.disc(69, 33, 4, '#b8862a'); p.disc(69, 33, 1.5, '#e8c050');
    p.ell(10, 40, 4, 3, '#8a2a1e'); p.ell(10, 39, 3, 1.5, '#e8d0a0');
    // the roof
    p.poly([[0, 24], [80, 24], [64, 4], [16, 4]], '#5a3a22'); for (var ry = 8; ry < 24; ry += 3) p.line(16 - (ry - 4) * 0.8, ry, 64 + (ry - 4) * 0.8, ry, '#4a2e1a');
    for (var ex = 2; ex < 78; ex += 6) { p.px(ex, 24, OKY); p.px(ex + 2, 25, OKR); p.px(ex + 4, 24, OKG); }
    p.line(0, 24, -2, 18, OKR, 2); p.line(80, 24, 82, 18, OKR, 2);
    p.outline(OUT);
  }
  function drawGerai(p, alt) {   // a market stall (48 x 36)
    p.ell(24, 34, 22, 2, 'rgba(30,20,10,0.25)');
    p.rect(4, 12, 2, 22, WOODD); p.rect(42, 12, 2, 22, WOODD);
    p.rect(2, 22, 44, 6, '#8a5a30'); p.rect(2, 22, 44, 1, WOODL);
    var goods = alt ? ['#c8323a', '#3a6aa8', '#f2c94c', '#3a9a5a', '#a03a8a'] : ['#c8a050', '#7a8a3a', '#e8e0d0', '#5a8aa8', '#d8a050'];
    for (var i = 0; i < 8; i++) { var c = goods[i % goods.length]; if (alt) p.rect(4 + i * 5, 17, 4, 5, c); else p.disc(6 + i * 5, 20, 2.2, c); }
    for (var s = 0; s < 6; s++) p.poly([[s * 8, 4], [s * 8 + 8, 4], [s * 8 + 8, 13], [s * 8, 13]], s % 2 ? '#f2ece0' : (alt ? '#3a6aa8' : '#c8323a'));
    for (var t = 0; t < 6; t++) p.poly([[t * 8, 13], [t * 8 + 8, 13], [t * 8 + 4, 16]], t % 2 ? '#f2ece0' : (alt ? '#3a6aa8' : '#c8323a'));
    p.outline(OUT);
  }
  // a Sama Dilaut house on stilts over the water (48 x 52)
  function drawRumah(p) {
    p.ell(24, 50, 22, 2, 'rgba(10,30,50,0.3)');
    [5, 16, 30, 42].forEach(function (x) { p.rect(x, 34, 2, 18, WOODD); p.rect(x - 1, 47, 4, 1, 'rgba(200,230,255,0.6)'); });
    p.rect(2, 32, 44, 3, '#7a5232'); p.rect(2, 32, 44, 1, WOODL);
    p.rect(5, 16, 38, 16, '#a8784a'); for (var y = 17; y < 32; y += 3) p.rect(5, y, 38, 1, '#8a5e36');
    p.rect(19, 21, 8, 11, '#3a2a1a'); p.rect(8, 21, 7, 6, '#3a2a1a'); p.rect(31, 21, 7, 6, '#3a2a1a');
    p.poly([[0, 18], [48, 18], [38, 2], [10, 2]], '#8a7040'); for (var ry = 5; ry < 18; ry += 3) p.line(10 - (ry - 2) * 0.6, ry, 38 + (ry - 2) * 0.6, ry, '#6a5430');
    p.rect(30, 30, 10, 2, '#3a8a8a'); p.rect(33, 30, 2, 2, '#e8c050');   // cloth drying on the rail
    p.rect(20, 35, 2, 14, WOODL); p.rect(24, 35, 2, 14, WOODL); for (var l = 37; l < 49; l += 3) p.rect(20, l, 6, 1, WOOD);   // a ladder down to the water
    p.outline(OUT);
  }
  // a lepa houseboat (48 x 22)
  function drawLepa(p) {
    p.ell(24, 20, 22, 2, 'rgba(10,30,50,0.3)');
    p.poly([[2, 12], [46, 12], [42, 19], [6, 19]], '#7a4a28'); p.rect(4, 12, 40, 2, '#a8703c');
    p.line(2, 12, 0, 6, '#7a4a28', 2); p.line(0, 6, 3, 3, OKR, 2); p.px(4, 4, OKY); p.px(1, 2, OKG);   // the carved bow (jungal), curling like a wave
    p.line(46, 12, 47, 8, '#7a4a28', 2);
    p.poly([[14, 12], [34, 12], [32, 5], [16, 5]], '#a88a50'); for (var x = 17; x < 32; x += 3) p.rect(x, 6, 1, 6, '#8a6e3a');   // the little roof of nipa
    p.rect(36, 9, 4, 3, '#5a4a3a');
    p.outline(OUT);
  }
  // the vinta from the side, tied up (64 x 40)
  function drawVintaSide(p) {
    p.ell(32, 37, 30, 2, 'rgba(10,30,50,0.3)');
    p.rect(2, 30, 60, 2, '#d8c890'); p.rect(2, 31, 60, 1, '#a89860');                      // the outrigger float
    [12, 30, 48].forEach(function (x) { p.line(x, 31, x + 2, 26, '#c8b070'); });
    p.poly([[4, 25], [60, 25], [54, 32], [10, 32]], '#5a3a22'); p.rect(6, 25, 52, 2, '#8a5a30'); p.rect(10, 29, 44, 1, OKR);
    p.line(4, 25, 1, 21, '#5a3a22', 2); p.line(60, 25, 63, 20, '#5a3a22', 2);
    p.rect(31, 2, 2, 24, WOODD);                                                            // the mast and the boom
    p.line(8, 24, 58, 22, WOODD);
    // the sail: tall, in bright vertical stripes
    var pts = [[10, 23], [56, 21], [33, 3]];
    p.poly(pts, SAIL[4]);
    for (var i = 0; i < 5; i++) {
      var x0 = 12 + i * 9;
      p.poly([[x0, 23], [x0 + 5, 23], [33 + (x0 + 2.5 - 33) * 0.2, 5]], SAIL[i % 4]);
    }
    p.line(10, 23, 33, 3, '#c8b8a0'); p.line(56, 21, 33, 3, '#c8b8a0');
    p.poly([[33, 1], [40, 3], [33, 5]], OKY);                                               // a pennant
    p.outline(OUT);
  }
  // the vinta from above (56 x 32, bow to the right): two frames, the sail rippling
  function drawVintaTop(p, f) {
    p.rect(10, 4, 36, 3, '#e0d0a0'); p.rect(10, 25, 36, 3, '#e0d0a0');                     // bamboo outriggers
    p.rect(10, 5, 36, 1, '#b8a070'); p.rect(10, 26, 36, 1, '#b8a070');
    [16, 28, 40].forEach(function (x) { p.rect(x, 5, 2, 22, '#c8b070'); });                 // cross poles
    p.poly([[6, 13], [44, 12], [54, 16], [44, 20], [6, 19]], '#5a3a22');                     // the hull
    p.poly([[9, 14], [43, 13.5], [50, 16], [43, 18.5], [9, 18]], '#8a5a30');
    p.rect(12, 16, 30, 1, OKR);
    p.disc(28, 16, 1.6, WOODD);                                                             // the mast
    // the sail, seen from above, bellying out to one side
    var bow = f ? 1 : 0;
    p.poly([[16, 16], [40, 16], [34, 6 - bow], [22, 5 + bow]], SAIL[4]);
    for (var i = 0; i < 4; i++) p.poly([[17 + i * 6, 16], [21 + i * 6, 16], [21 + i * 5.2, 6 - bow + (i % 2)], [18 + i * 5.2, 6 - bow + (i % 2)]], SAIL[i]);
    p.line(16, 16, 40, 16, WOODD);
    p.disc(10, 16, 1.6, '#3a2a1a'); p.px(10, 15, '#e8c090');                                // the captain at the helm
    p.poly([[6, 15], [2, 13 - f], [3, 16]], OKY);                                           // a little flag at the stern
    p.outline(OUT);
  }
  // a ring of bubbles, where you can dive (16 x 16)
  function drawSelam(p) {
    [[8, 8, 6], [4, 5, 2], [12, 4, 1.5], [11, 12, 2]].forEach(function (b) { p.disc(b[0], b[1], b[2], 'rgba(220,245,255,0.55)'); p.px(b[0] - 1, b[1] - 1, '#ffffff'); });
    p.disc(8, 8, 4, 'rgba(120,200,230,0.35)');
  }
  // the old sunken boat on the reef (48 x 30)
  function drawKaram(p) {
    p.ell(24, 27, 22, 3, 'rgba(10,30,50,0.35)');
    p.poly([[2, 16], [44, 12], [40, 26], [8, 27]], '#4a3a2a'); p.poly([[6, 17], [40, 14], [37, 23], [10, 24]], '#3a2e22');
    for (var x = 10; x < 40; x += 6) p.line(x, 15, x - 2, 25, '#5a4a36');
    p.line(26, 14, 34, 2, '#4a3a2a', 2);                                                    // a broken mast
    [[8, 14], [20, 11], [36, 10], [42, 18]].forEach(function (w) { p.line(w[0], w[1], w[0] + 1, w[1] - 7, '#3a8a5a'); p.px(w[0] + 1, w[1] - 8, '#5ab87a'); });   // weed
    p.rect(36, 18, 6, 5, '#6a4a2a'); p.rect(36, 18, 6, 1, GOLDD);                           // the little box on the stern
    p.outline('#14202a');
  }
  // a pearl oyster: open with a pearl, or shut (16 x 12)
  function drawTiram(p, full) {
    p.ell(8, 9, 7, 3, '#7a6a5a'); p.ell(8, 8.5, 6, 2.3, '#a8988a');
    for (var x = 3; x < 14; x += 2) p.px(x, 9, '#5a4a3a');
    if (full) { p.poly([[2, 8], [14, 8], [12, 2], [4, 2]], '#8a7a6a'); p.poly([[3, 8], [13, 8], [11, 3], [5, 3]], '#d8d0e0'); p.disc(8, 7, 2, '#f6f2ff'); p.px(7, 6, '#ffffff'); }
  }
  function drawKembar(p) {   // Batu Kembar: two sea stacks (32 x 44)
    p.ell(16, 41, 15, 3, 'rgba(240,250,255,0.7)');
    p.poly([[2, 42], [4, 14], [8, 6], [13, 12], [14, 42]], '#6a6a72'); p.poly([[5, 40], [6, 16], [8, 10], [11, 15], [11, 40]], '#8a8a92');
    p.poly([[16, 42], [18, 20], [23, 12], [28, 18], [30, 42]], '#5e5e68'); p.poly([[19, 40], [20, 22], [23, 16], [26, 21], [27, 40]], '#7e7e88');
    p.line(12, 24, 19, 26, '#4a4a52'); p.line(12, 25, 19, 27, '#4a4a52');                   // holding hands
    [[3, 42], [10, 43], [18, 42], [26, 43], [30, 41]].forEach(function (f) { p.disc(f[0], f[1], 1.5, '#ffffff'); });
    p.outline('#2a2a32');
  }
  function drawKarang(p) {   // a reef rock (16 x 12)
    p.ell(8, 9, 7.5, 3, 'rgba(240,250,255,0.75)');
    p.poly([[2, 9], [4, 4], [8, 2], [12, 4], [14, 9]], '#6e6a62'); p.poly([[4, 8], [6, 5], [9, 4], [11, 6], [12, 8]], '#8e8a80');
    p.px(6, 9, '#ffffff'); p.px(11, 10, '#ffffff');
    p.outline('#2a2a2a');
  }
  function drawBatuBulan(p) {   // a moon-white stone, carved with a crescent (16 x 18)
    p.ell(8, 16, 7, 2, 'rgba(30,30,60,0.25)');
    p.poly([[2, 16], [3, 5], [8, 1], [13, 5], [14, 16]], '#d8dce8'); p.poly([[4, 15], [5, 6], [8, 3], [11, 6], [12, 15]], '#eef0f8');
    p.disc(8, 9, 3, '#9aa2c0'); p.disc(9.4, 8.2, 2.6, '#eef0f8');
    p.outline('#5a6080');
  }
  function drawAgung(p) {   // a big gong on a frame (24 x 30)
    p.ell(12, 28, 11, 2, 'rgba(30,20,10,0.3)');
    p.rect(2, 4, 2, 24, WOODD); p.rect(20, 4, 2, 24, WOODD); p.rect(0, 3, 24, 3, WOOD); p.rect(0, 3, 24, 1, WOODL);
    p.px(0, 2, OKR); p.px(23, 2, OKR);
    p.line(12, 6, 12, 9, '#3a2a1a');
    p.disc(12, 17, 8, '#9a6a1e'); p.disc(12, 17, 7, '#c8902a'); p.disc(12, 17, 3.2, '#a8741e'); p.disc(12, 16.5, 2.4, '#f2c94c'); p.px(11, 15, '#fff2c0');
    p.line(6, 13, 9, 11, '#f6dc8a');
    p.outline(OUT);
  }
  // ---------------------------------------------------------------- the Bakunawa
  var SC = '#2a7a8a', SCD = '#1a5462', SCL = '#4aa8b0', BELLY = '#d8e8c8', FIN = '#c8323a';
  function drawHead(p, open) {   // 48 x 40, facing right
    p.ell(22, 24, 18, 12, SCD); p.ell(22, 23, 16, 10.5, SC);
    for (var i = 0; i < 6; i++) p.ell(12 + i * 4, 18 + (i % 2), 1.6, 1.2, SCL);           // scales
    // the long snout and jaws
    if (open) {
      p.poly([[30, 16], [47, 12], [46, 18], [32, 22]], SC); p.poly([[30, 28], [46, 34], [45, 38], [28, 32]], SCD);
      p.poly([[32, 21], [45, 18], [44, 33], [30, 28]], '#5a1a22'); p.poly([[33, 24], [44, 22], [43, 30], [33, 27]], '#c8323a');   // the throat and tongue
      for (var t = 0; t < 4; t++) { p.px(35 + t * 3, 19 - t * 0.5, '#f6f2e8'); p.px(35 + t * 3, 30 + t * 0.6, '#f6f2e8'); }
    } else {
      p.poly([[30, 16], [47, 19], [47, 26], [30, 30]], SC); p.line(32, 24, 46, 23, SCD);
      for (var u = 0; u < 4; u++) p.px(34 + u * 3, 25, '#f6f2e8');
    }
    p.ell(26, 30, 9, 4, BELLY);
    p.disc(28, 18, 3, '#f2c94c'); p.disc(28.6, 18, 1.4, '#1a1010'); p.px(27, 17, '#ffffff');   // the great eye
    p.line(40, 14, 46, 6, GOLD); p.line(41, 15, 47, 9, GOLDD);                               // whiskers
    p.line(36, 28, 44, 37, GOLD);
    // gills and the red frill (its "wings")
    [[14, 14], [10, 22], [14, 30]].forEach(function (g) { p.line(g[0], g[1] - 3, g[0] - 2, g[1] + 3, SCD); });
    p.poly([[8, 10], [2, 2], [6, 14]], FIN); p.poly([[14, 8], [12, 0], [18, 10]], FIN); p.poly([[20, 9], [22, 1], [24, 10]], FIN);
    p.poly([[6, 32], [0, 38], [10, 34]], FIN);
    p.outline('#0e2a32');
  }
  function drawBody(p) {   // a body segment (24 x 22)
    p.ell(12, 13, 11, 8, SCD); p.ell(12, 12, 10, 7, SC); p.ell(12, 16, 7, 3, BELLY);
    p.poly([[8, 6], [12, 0], [16, 6]], FIN); p.px(12, 2, '#f26a6a');
    for (var i = 0; i < 4; i++) p.ell(6 + i * 4, 10, 1.4, 1, SCL);
    p.outline('#0e2a32');
  }
  function drawTail(p) {   // the tail fin (28 x 20)
    p.ell(8, 10, 7, 5, SC); p.poly([[12, 8], [27, 0], [22, 10], [27, 20], [12, 12]], FIN); p.poly([[14, 9], [24, 3], [20, 10], [24, 17], [14, 11]], '#e85a5a');
    p.outline('#0e2a32');
  }
  // ---------------------------------------------------------------- the sea and the sky
  function drawSwirl(p) {   // a whirlpool (64 x 64)
    p.disc(32, 32, 30, 'rgba(10,40,80,0.35)'); p.disc(32, 32, 20, 'rgba(6,24,56,0.45)'); p.disc(32, 32, 8, 'rgba(2,10,30,0.6)');
    for (var arm = 0; arm < 4; arm++) for (var k = 0; k < 60; k++) {
      var a = arm * Math.PI / 2 + k * 0.11, r = 4 + k * 0.45;
      p.px(32 + Math.cos(a) * r, 32 + Math.sin(a) * r, k % 3 ? 'rgba(220,245,255,0.75)' : 'rgba(160,210,240,0.6)');
    }
  }
  function drawMoon(p) {   // the full moon (36 x 36)
    p.disc(18, 18, 17, '#f6f0d0'); p.disc(18, 18, 15.5, '#fffbe6');
    [[11, 12, 3], [23, 9, 2], [24, 22, 4], [13, 25, 2], [19, 16, 1.5]].forEach(function (c) { p.disc(c[0], c[1], c[2], '#e8e0bc'); });
  }
  Art.generate22 = function (scene) {
    var make = Art.make;
    make(scene, 'astana11', 176, 112, drawAstana);
    make(scene, 'panji11', 12, 40, drawPanji, true);
    make(scene, 'balai11', 82, 56, drawBalai);
    make(scene, 'gerai11', 48, 36, function (p) { drawGerai(p, false); });
    make(scene, 'gerai11b', 48, 36, function (p) { drawGerai(p, true); });
    make(scene, 'rumah11', 48, 52, drawRumah);
    make(scene, 'lepa11', 48, 22, drawLepa);
    make(scene, 'vinta11', 64, 40, drawVintaSide);
    make(scene, 'vinta11_t0', 56, 32, function (p) { drawVintaTop(p, 0); });
    make(scene, 'vinta11_t1', 56, 32, function (p) { drawVintaTop(p, 1); });
    make(scene, 'selam11', 16, 16, drawSelam);
    make(scene, 'karam11', 48, 30, drawKaram);
    make(scene, 'fg_tiram11', 16, 12, function (p) { drawTiram(p, true); }, true);
    make(scene, 'fg_tiram11_e', 16, 12, function (p) { drawTiram(p, false); }, true);
    make(scene, 'batu_kembar11', 32, 44, drawKembar);
    make(scene, 'karang11', 16, 12, drawKarang);
    make(scene, 'batu_bulan11', 16, 18, drawBatuBulan);
    make(scene, 'agung11', 24, 30, drawAgung);
    make(scene, 'bakunawa11_0', 48, 40, function (p) { drawHead(p, false); });
    make(scene, 'bakunawa11_1', 48, 40, function (p) { drawHead(p, true); });
    make(scene, 'bakunawa11_body', 24, 22, drawBody);
    make(scene, 'bakunawa11_tail', 28, 20, drawTail);
    make(scene, 'swirl11', 64, 64, drawSwirl);
    make(scene, 'foam11', 8, 6, function (p) { p.ell(4, 3, 3.6, 2.4, 'rgba(255,255,255,0.9)'); p.px(2, 2, '#ffffff'); p.px(6, 3, 'rgba(255,255,255,0.6)'); });
    make(scene, 'streak11', 24, 2, function (p) { for (var x = 0; x < 24; x++) p.px(x, x > 6 && x < 18 ? 0 : 1, 'rgba(255,255,255,' + (0.25 + 0.6 * Math.sin(x / 23 * Math.PI)).toFixed(2) + ')'); });
    make(scene, 'spout11', 16, 26, function (p) { p.ell(8, 22, 7, 3.6, 'rgba(220,245,255,0.85)'); p.poly([[4, 22], [12, 22], [10, 2], [6, 2]], 'rgba(200,235,255,0.75)'); p.disc(8, 3, 3, 'rgba(255,255,255,0.9)'); [[3, 8], [13, 6], [2, 14], [14, 15]].forEach(function (d) { p.disc(d[0], d[1], 1.2, '#ffffff'); }); });
    make(scene, 'bulan11', 36, 36, drawMoon);
    make(scene, 'gerhana11', 36, 36, function (p) { p.disc(18, 18, 17.5, '#0a0610'); });
    make(scene, 'mutiara_kembar11', 14, 8, function (p) { p.disc(4, 4, 3.2, '#f6f2ff'); p.disc(10, 4, 3.2, '#fff6e6'); p.px(3, 3, '#ffffff'); p.px(9, 3, '#ffffff'); });
    // icons
    var IC = {
      batu_berani: function (p) { p.ell(8, 10, 6, 4.4, '#2a2a32'); p.ell(7, 9, 4.4, 3, '#4a4a56'); p.px(5, 8, '#9a9aa8'); p.line(8, 4, 8, 7, '#c8323a'); p.poly([[6, 5], [10, 5], [8, 2]], '#c8323a'); },
      pedoman: function (p) { p.disc(8, 8, 7, '#a8741e'); p.disc(8, 8, 5.6, '#d8e8f0'); p.line(8, 3, 8, 8, '#c8323a'); p.line(8, 8, 8, 13, '#2a2a32'); p.px(8, 2, '#c8323a'); p.px(2, 8, '#5a5a5a'); p.px(14, 8, '#5a5a5a'); p.px(8, 14, '#5a5a5a'); },
      mutiara_kembar: function (p) { p.disc(5, 9, 4, '#f6f2ff'); p.disc(11, 8, 4, '#fff6e6'); p.px(4, 7, '#ffffff'); p.px(10, 6, '#ffffff'); p.disc(8, 13, 2, 'rgba(255,240,180,0.5)'); },
      tiyula_itum: function (p) { p.ell(8, 10, 7, 4, '#e8e0d0'); p.ell(8, 9, 6, 2.4, '#2a2420'); p.px(6, 9, '#c8a040'); p.px(10, 9, '#7a8a3a'); p.rect(4, 12, 8, 2, '#c8b8a0'); p.line(10, 3, 9, 6, 'rgba(255,255,255,0.6)'); },
      panyalam: function (p) { p.disc(8, 9, 6.4, '#d8a050'); p.disc(8, 9, 4.6, '#e8c070'); [[5, 7], [10, 6], [8, 11], [11, 10], [6, 11]].forEach(function (h) { p.px(h[0], h[1], '#a8702a'); }); }
    };
    Object.keys(IC).forEach(function (id) { make(scene, 'i_' + id, 16, 16, IC[id], true); });
    make(scene, 'ic_kulintang11', 16, 16, function (p) { p.rect(1, 10, 14, 3, '#8a2a1e'); for (var i = 0; i < 4; i++) { p.disc(3 + i * 3.4, 9, 1.6, '#e8b040'); } p.line(4, 2, 7, 7, WOODL); p.disc(4, 2, 1.4, '#c8323a'); }, true);
    var a = scene.anims;
    if (!a.exists('bakunawa11_walk')) a.create({ key: 'bakunawa11_walk', frames: [{ key: 'bakunawa11_0' }, { key: 'bakunawa11_0' }], frameRate: 2, repeat: -1 });
  };
})(window.LC);
