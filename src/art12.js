/* Little Creature — procedural pixel art for Chapter 5 (v2.3): the shadows and Si Kelam, Juragan Wira, Pelita's
 * full-moon form, Tukang Leong's guard lamps, the old damar tree, the stone torches of Pulau Kelam, the court of
 * Majapahit (the king's pendopo, the split brick gate, houses with clay-tile roofs, market stalls) and icons. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art;
  var BRICK = '#b8563a', BRICK2 = '#8a3a26', BRICK3 = '#d8805a', TILE = '#9a3a24', TILE2 = '#7a2a1a', WOOD = '#7a5030', WOOD2 = '#5a3820';

  function drawKelam(p, f) {   // 16x22: a wisp of shadow with violet eyes, swaying
    var s = f ? 1 : 0, D = '#1e1428', M = '#2e2040', L = '#46325e';
    p.ell(8, 9, 5, 6, D);
    p.poly([[3, 10], [13, 10], [14 - s, 18], [11, 21], [8, 18 + s], [5, 21], [2 + s, 18]], D);
    p.ell(7, 7, 3, 3.4, M); p.px(5, 5, L); p.px(6, 4, L);
    p.line(3, 11, 0 + s, 15, D, 2); p.line(13, 11, 16 - s, 14, D, 2);
    p.rect(5, 8, 2, 1, '#c8a8ff'); p.rect(9, 8, 2, 1, '#c8a8ff'); p.px(5, 8, '#ffffff'); p.px(9, 8, '#ffffff');
  }
  function drawSiKelam(p, f) {   // 44x52: a towering shadow, ragged as smoke, with two great pale eyes
    var s = f ? 1 : 0, D = '#140c1e', M = '#22163a', L = '#3a2a58', E = '#d8c8ff';
    p.ell(22, 18, 14, 15, D);
    p.poly([[8, 20], [36, 20], [40 - s, 40], [35, 50], [30, 44 + s], [25, 51], [20, 45 - s], [15, 51], [10, 44], [5 + s, 48], [4, 38]], D);
    p.ell(20, 14, 9, 8, M); p.ell(18, 11, 4, 3, L);
    p.poly([[9, 22], [2 - s, 30], [0, 38], [5, 33], [10, 28]], D);       // smoky arms
    p.poly([[35, 22], [42 + s, 30], [44, 37], [39, 33], [34, 28]], D);
    p.speck(6, 24, 32, 22, M, 26);
    p.ell(15, 18, 3.6, 2.2, E); p.ell(29, 18, 3.6, 2.2, E); p.disc(15, 18, 1.2, '#7a5ac8'); p.disc(29, 18, 1.2, '#7a5ac8');
    p.px(14, 17, '#ffffff'); p.px(28, 17, '#ffffff');
    p.line(17, 26, 27, 26, '#3a2a58', 1); p.px(16, 25, '#3a2a58'); p.px(28, 25, '#3a2a58');
  }
  function drawSiKelamFace(p) {   // 24x26 for the dialogue box
    var D = '#140c1e', M = '#22163a', E = '#d8c8ff';
    p.ell(12, 13, 11, 12, D); p.ell(10, 9, 6, 5, M);
    p.ell(7, 12, 2.6, 1.6, E); p.ell(17, 12, 2.6, 1.6, E); p.px(7, 12, '#7a5ac8'); p.px(17, 12, '#7a5ac8');
    p.line(8, 18, 16, 18, '#3a2a58'); p.speck(3, 4, 18, 18, M, 12);
  }

  // Mak Lampir (v2.3.1): this game's own drawing of the witch. Hunched, wild white hair to her knees, glowing eyes,
  // a ragged dark kebaya, bare feet, and a crooked stick with a violet glow in its knot.
  function drawLampir(p, f) {   // 20x28
    var s = f ? 1 : 0, H = '#ecebe4', H2 = '#c8c6bc', SK = '#a88a6a', SK2 = '#86684c', C = '#2a2a24', C2 = '#3e3a30';
    p.poly([[3, 6], [12, 4], [15, 12], [16, 25 + s], [13, 22], [11, 26], [8, 22], [5, 26 - s], [2, 20], [1, 12]], H2);   // the hair, behind
    p.poly([[5, 12], [14, 12], [15, 24], [12, 27], [9, 24], [6, 27], [4, 24]], C);                                  // the ragged kebaya
    p.rect(6, 14, 7, 1, C2); p.px(8, 18, C2); p.px(11, 20, C2); p.px(6, 22, C2);
    p.rect(6, 26, 2, 2, SK2); p.rect(11, 26, 2, 2, SK2);                                                           // bare feet
    p.ell(8, 9, 4, 4, SK); p.poly([[4, 10], [2, 12 + s], [5, 11]], SK);                                            // a face bent forward, a hooked nose
    p.px(6, 8, '#b8ff9a'); p.px(9, 8, '#b8ff9a'); p.px(6, 7, '#3a2a1a'); p.px(9, 7, '#3a2a1a');                     // glowing eyes, heavy brows
    p.rect(6, 11, 3, 1, '#4a2a20'); p.px(7, 11, '#f0e8d0');                                                         // a grin with one tooth
    p.line(5, 6, 10, 6, SK2);
    p.poly([[3, 4], [12, 3], [14, 6], [10, 5], [6, 6], [3, 8]], H); p.px(13, 2, H); p.px(2, 5, H); p.px(15, 8 + s, H);   // the wild fringe
    p.line(2, 14, 4, 13, SK, 1); p.line(15, 14, 17, 13 - s, SK, 1);                                                 // bony arms
    p.line(17, 4 - s, 18, 27, '#5a3a20', 1); p.line(16, 4 - s, 18, 3 - s, '#5a3a20', 1);                           // the crooked stick
    p.disc(17, 3 - s, 1.6, '#9a5aff'); p.px(17, 3 - s, '#e8d0ff');
  }
  function drawLampirFace(p) {   // 24x26 for the dialogue box
    var H = '#ecebe4', H2 = '#c8c6bc', SK = '#a88a6a', SK2 = '#86684c';
    p.poly([[2, 4], [21, 2], [23, 24], [17, 20], [12, 25], [7, 20], [1, 24]], H2);
    p.ell(11, 13, 7, 8, SK); p.poly([[5, 13], [2, 17], [6, 16]], SK);
    p.rect(7, 11, 2, 1, '#b8ff9a'); p.rect(13, 11, 2, 1, '#b8ff9a'); p.line(6, 9, 9, 10, '#3a2a1a'); p.line(16, 9, 13, 10, '#3a2a1a');
    p.line(8, 17, 14, 17, '#4a2a20'); p.px(10, 17, '#f0e8d0'); p.line(7, 15, 9, 14, SK2); p.line(15, 15, 13, 14, SK2);
    p.poly([[3, 6], [20, 3], [21, 8], [15, 6], [8, 8], [3, 10]], H); p.px(22, 2, H); p.px(1, 7, H);
  }

  // Pelita Purnama, the Full Moon Spirit (20x22, the same expressions as the other forms)
  function drawPurnama(p, ex) {
    var B = '#fffdf4', S = '#f6e7b8', D = '#c89a3a', EYE = '#3b2f5c', BL = '#f5a3c7', MO = '#7a3a5a';
    var R = 6, cx = 10, cy = 12, bot = 19, x;
    p.disc(cx, cy, R, S); p.rect(cx - R, cy, 2 * R, bot - cy, S);
    for (x = cx - R; x < cx + R; x++) if (((x - (cx - R)) % 4) < 2) p.px(x, bot, S);
    p.disc(cx - 0.7, cy - 0.7, R - 1.2, B); p.rect(cx - R + 1, cy, 2 * R - 3, bot - cy - 1, B);
    p.disc(cx + 3, cy + 4, 1, '#fff3c0');                                          // a little moon on its tummy
    p.rect(9, 3, 2, 3, '#ffd27a'); p.px(9, 2, '#fff3c0'); p.px(10, 1, '#fff3c0'); p.px(9, 4, '#fff3c0');   // a lamp flame on its head
    p.rect(8, 5, 4, 1, '#e2b33c');
    p.outline(D);
    for (var a = 0; a < 64; a++) {   // the halo of the full moon, behind it
      var t = a / 64 * Math.PI * 2, hx = Math.round(cx + Math.cos(t) * 9.5), hy = Math.round(11 + Math.sin(t) * 9.5);
      if (hy < 5 || hx < 3 || hx > 16) p.px(hx, hy, a % 3 ? '#ffe9a8' : '#fff6d8');
    }
    var eL = 7, eR = 12, ey = cy + 1;
    if (ex === 'happy') {
      [eL, eR].forEach(function (e) { p.px(e - 1, ey + 1, EYE); p.px(e, ey, EYE); p.px(e + 1, ey + 1, EYE); });
      p.rect(cx - 1, ey + 2, 2, 1, MO); p.rect(cx - 1, ey + 3, 2, 1, '#e8799a');
      p.px(eL - 1, ey + 3, BL); p.px(eR + 1, ey + 3, BL);
    } else if (ex === 'sad') {
      p.rect(eL, ey, 1, 2, EYE); p.rect(eR, ey, 1, 2, EYE);
      p.px(cx - 2, ey + 4, MO); p.px(cx - 1, ey + 3, MO); p.px(cx, ey + 3, MO); p.px(cx + 1, ey + 4, MO);
      p.px(eR, ey + 2, '#8fd3ff'); p.px(eR, ey + 3, '#8fd3ff');
    } else if (ex === 'sleepy') {
      p.rect(eL - 1, ey + 1, 2, 1, EYE); p.rect(eR, ey + 1, 2, 1, EYE); p.px(cx, ey + 3, MO);
      p.px(eL - 1, ey + 2, BL); p.px(eR + 1, ey + 2, BL);
    } else {
      p.rect(eL, ey, 1, 2, EYE); p.rect(eR, ey, 1, 2, EYE);
      p.px(cx - 1, ey + 3, MO); p.px(cx, ey + 3, MO);
      p.px(eL - 1, ey + 2, BL); p.px(eR + 1, ey + 2, BL);
    }
  }

  function drawTiangPelita(p) {   // 16x32: a brass lantern on a belian post
    p.rect(7, 12, 3, 20, WOOD2); p.rect(7, 12, 1, 20, WOOD); p.rect(5, 29, 7, 3, '#6a6a6a');
    p.rect(4, 3, 9, 9, '#c4922f'); p.rect(5, 4, 7, 7, '#ffe8a0'); p.rect(6, 5, 5, 5, '#fff6d0'); p.disc(8.5, 7.5, 1.5, '#ffb84a');
    p.rect(3, 2, 11, 2, '#a8782a'); p.poly([[4, 2], [13, 2], [8.5, -1]], '#8a5a1e'); p.rect(4, 11, 9, 1, '#a8782a');
  }
  function drawDamar(p) {   // 32x48: a tall straight damar tree with golden resin on its pale bark
    p.rect(13, 18, 6, 30, '#b8a890'); p.rect(13, 18, 2, 30, '#d0c4ac'); p.rect(18, 18, 1, 30, '#8a7a64');
    p.rect(10, 45, 12, 3, '#8a7a64');
    [[14, 24], [17, 30], [15, 36], [16, 41]].forEach(function (d) { p.rect(d[0], d[1], 2, 3, '#e9a83a'); p.px(d[0], d[1] + 3, '#f2c94c'); });
    p.ell(16, 11, 15, 10, '#2f6a3a'); p.ell(12, 8, 9, 6, '#3f8a4a'); p.ell(22, 12, 8, 6, '#2a5a32');
    p.speck(3, 3, 26, 16, '#58a85a', 24);
  }
  function drawObor(p) {   // 16x32: an old stone torch with a bowl on top
    p.rect(5, 12, 6, 18, '#5a5664'); p.rect(5, 12, 2, 18, '#706c7a'); p.rect(3, 28, 10, 4, '#48444f');
    p.rect(2, 8, 12, 4, '#6a6676'); p.rect(3, 7, 10, 1, '#7a7686'); p.rect(4, 12, 8, 1, '#3a3640');
    p.speck(5, 14, 6, 14, '#3e3a46', 8); p.px(7, 18, '#8a5a8a'); p.px(8, 22, '#8a5a8a');
  }

  function drawPendopo(p) {   // 128x64: the king's open pavilion, its roof rising in steps
    p.rect(4, 52, 120, 12, BRICK); p.rect(4, 52, 120, 2, BRICK3); for (var x = 6; x < 124; x += 8) p.rect(x, 57, 1, 6, BRICK2);
    p.rect(4, 60, 120, 1, BRICK2);
    [14, 36, 58, 70, 92, 114].forEach(function (x) { p.rect(x - 2, 28, 4, 24, '#6a4020'); p.rect(x - 2, 28, 1, 24, '#8a5a30'); p.rect(x - 3, 28, 6, 2, '#c4922f'); });
    p.rect(30, 46, 68, 6, '#c8a878'); p.rect(30, 46, 68, 1, '#e0c898');                      // a floor mat in the shade
    p.poly([[0, 30], [128, 30], [112, 18], [16, 18]], TILE2);
    p.poly([[16, 19], [112, 19], [96, 8], [32, 8]], TILE);
    p.poly([[40, 9], [88, 9], [76, 0], [52, 0]], TILE2);
    for (var r = 21; r < 30; r += 3) p.rect(6 + (30 - r) * 1.2, r, 116 - (30 - r) * 2.4, 1, '#5a1e12');
    for (r = 11; r < 19; r += 3) p.rect(34 - (19 - r) * -1.5, r, 60 + (19 - r) * -3, 1, '#b8503a');
    p.rect(0, 30, 128, 2, '#c4922f'); p.rect(16, 18, 96, 1, '#c4922f'); p.rect(32, 8, 64, 1, '#c4922f');
    p.rect(62, 0, 4, 2, '#e9c46a');
  }
  function drawGapura(p, mirror) {   // 32x48: one half of a split gate of red brick (the cut face is straight and plain)
    function X(x) { return mirror ? 31 - x : x; }
    var steps = [[2, 30, 40], [4, 30, 30], [6, 30, 20], [9, 30, 12], [12, 30, 5], [16, 30, 0]];
    steps.forEach(function (s) { for (var y = (s[2] || 0); y < 48; y++) for (var x = s[0]; x <= s[1]; x++) p.px(X(x), y, y % 4 === 0 ? BRICK2 : ((x + (y >> 2) * 3) % 6 === 0 ? BRICK2 : BRICK)); });
    for (var y = 0; y < 48; y++) { p.px(X(30), y, BRICK3); p.px(X(31), y, BRICK2); }
    p.rect(mirror ? 1 : 20, 22, 10, 2, '#e9c46a'); p.rect(mirror ? 1 : 20, 38, 10, 2, BRICK3);
  }
  function drawRumahJawa(p) {   // 48x48: a house with a tall red clay-tile roof on a brick base
    p.rect(2, 40, 44, 8, BRICK); p.rect(2, 40, 44, 1, BRICK3); for (var x = 4; x < 46; x += 6) p.rect(x, 43, 1, 4, BRICK2);
    p.rect(6, 24, 36, 16, '#c8a070'); p.rect(6, 24, 36, 2, '#a88050'); for (x = 8; x < 42; x += 4) p.rect(x, 26, 1, 14, '#b89060');
    p.rect(20, 28, 8, 12, WOOD2); p.rect(21, 29, 6, 11, WOOD); p.rect(10, 28, 6, 5, '#3a2a1a'); p.rect(32, 28, 6, 5, '#3a2a1a');
    p.poly([[0, 25], [48, 25], [38, 8], [10, 8]], TILE); p.poly([[10, 9], [38, 9], [30, 0], [18, 0]], TILE2);
    for (var r = 12; r < 25; r += 3) p.rect(4 + (25 - r) * 0.5, r, 40 - (25 - r), 1, TILE2);
    p.rect(0, 25, 48, 1, '#5a1e12'); p.rect(18, 0, 12, 1, '#c4922f');
  }
  function drawGerai(p) {   // 48x32: a market stall with a striped awning
    p.rect(4, 12, 2, 20, WOOD2); p.rect(42, 12, 2, 20, WOOD2);
    for (var x = 0; x < 48; x += 6) { p.rect(x, 4, 6, 9, (x / 6) % 2 ? '#e9d8b0' : '#b8322a'); p.poly([[x, 13], [x + 6, 13], [x + 3, 16]], (x / 6) % 2 ? '#e9d8b0' : '#b8322a'); }
    p.rect(0, 3, 48, 1, '#7a1e1a');
    p.rect(2, 22, 44, 8, WOOD); p.rect(2, 22, 44, 1, '#9a6a40');
    p.ell(10, 21, 4, 2.5, '#3a2a6a'); p.rect(7, 20, 6, 1, '#e9c46a');                       // a fold of batik
    p.ell(22, 20, 3, 3, '#c8673a'); p.disc(25, 19, 1.2, '#c8673a');                          // a celengan
    p.ell(33, 21, 4, 2.4, '#4f8a3a'); p.disc(32, 20, 1.3, '#e9c46a'); p.disc(36, 20, 1.3, '#e9c46a');   // fruit
    p.rect(40, 18, 4, 4, '#a8502a');
  }

  var IC = {
    serpihan_kelam: function (p) { p.poly([[8, 0], [13, 6], [10, 15], [5, 13], [3, 5]], '#140c1e'); p.poly([[8, 2], [11, 6], [9, 12], [6, 6]], '#2e2040'); p.px(8, 6, '#c8a8ff'); p.px(2, 2, '#c8a8ff'); p.px(14, 11, '#8a7aa8'); },
    cahaya_bunian: function (p) { p.rect(5, 4, 6, 10, '#a8d8c8'); p.rect(6, 5, 4, 8, '#e8fff4'); p.disc(8, 9, 2, '#fff6b0'); p.px(8, 9, '#ffffff'); p.rect(4, 2, 8, 2, '#4f8a3a'); p.rect(5, 14, 6, 1, '#7aa898'); p.px(2, 6, '#fff6b0'); p.px(13, 10, '#fff6b0'); },
    damar: function (p) { p.ell(8, 10, 6, 4, '#4f8a3a'); p.ell(8, 9, 4.5, 3.4, '#e9a83a'); p.ell(7, 8, 2.5, 1.6, '#f6d27a'); p.px(6, 7, '#fff3c0'); p.line(3, 12, 13, 12, '#3a6a2a'); },
    pelita_purnama: function (p) { p.ell(8, 12, 6, 2.4, '#a8782a'); p.disc(8, 8, 5, '#e2b33c'); p.disc(8, 8, 3.6, '#fff3c0'); p.disc(8, 8, 2, '#ffffff'); p.rect(7, 1, 2, 3, '#ffd27a'); p.px(8, 0, '#fff6d8'); p.px(2, 4, '#fff3c0'); p.px(14, 5, '#fff3c0'); }
  };
  var WIRA = { skin: '#9a6440', shirt: '#2a5a7a', shirt2: '#1e4a68', bottom: '#8a3a2a', bottom2: '#6a2a1e', hair: '#1a1210', hat: 'tanjak', beard: '#3a2a1a' };

  Art.generate12 = function (scene) {
    var make = Art.make;
    for (var f = 0; f < 2; f++) (function (f) {
      make(scene, 'kelam_' + f, 16, 22, function (p) { drawKelam(p, f); });
      make(scene, 'sikelam_' + f, 44, 52, function (p) { drawSiKelam(p, f); });
      make(scene, 'maklampir_' + f, 20, 28, function (p) { drawLampir(p, f); }, true);
    })(f);
    make(scene, 'sikelam_face', 24, 26, drawSiKelamFace);
    make(scene, 'maklampir_face', 24, 26, drawLampirFace, true);
    ['normal', 'happy', 'sad', 'sleepy'].forEach(function (ex) { make(scene, 'ghost_5_' + ex, 20, 22, function (p) { drawPurnama(p, ex); }); });
    make(scene, 'wira_0', 16, 20, function (p) { Art.drawVillager(p, WIRA, false); });
    make(scene, 'tiang_pelita', 16, 32, drawTiangPelita, true);
    make(scene, 'pohon_damar', 32, 48, drawDamar, true);
    make(scene, 'obor_batu', 16, 32, drawObor, true);
    make(scene, 'pendopo', 128, 64, drawPendopo, true);
    make(scene, 'gapura_l', 32, 48, function (p) { drawGapura(p, false); }, true);
    make(scene, 'gapura_r', 32, 48, function (p) { drawGapura(p, true); }, true);
    make(scene, 'rumah_jawa', 48, 48, drawRumahJawa, true);
    make(scene, 'gerai_jawa', 48, 32, drawGerai, true);
    Object.keys(IC).forEach(function (id) { make(scene, 'i_' + id, 16, 16, IC[id], true); });
    var a = scene.anims;
    [['kelam_walk', 'kelam', 5], ['sikelam_walk', 'sikelam', 3], ['maklampir_walk', 'maklampir', 4]].forEach(function (k) {
      if (!a.exists(k[0])) a.create({ key: k[0], frames: [{ key: k[1] + '_0' }, { key: k[1] + '_1' }], frameRate: k[2], repeat: -1 });
    });
  };
})(window.LC);
