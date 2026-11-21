/* Little Creature — art, part 20 (v3.0): Chapter 10, Nujum Pak Belalang. The palace of Tanjung Bunga, Pak Belalang's
 * leaky hut and its tempayan, the ship from Negeri Antah Berantah and its sampan, the glowing grasshoppers and the woven
 * one, footprints in the dark, the thieves' lean-to and fire, the Peti Pusaka Diraja, the Kerengga gang, Belalang
 * himself (a skinny barefoot boy), the herald, Tok Nujum Jambul and Nakhoda Gagah, and the Sumpit and its dart. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art;
  var GOLD = '#e9c46a', GOLDL = '#f6dc8a', GOLDD = '#c4922f', WOOD = '#8a5a2b', WOODD = '#5a3a1e', WOODL = '#a8743e';
  var OUT = '#2a1a10';

  // ---------------------------------------------------------------- the palace (192 x 112; its footprint is the bottom 4 rows)
  function drawIstana(p) {
    p.ell(96, 108, 92, 5, 'rgba(30,20,10,0.25)');
    for (var x = 10; x < 186; x += 16) { p.rect(x, 86, 4, 24, WOODD); p.rect(x, 86, 1, 24, WOOD); }   // the tall posts
    p.rect(4, 80, 184, 7, '#6a4426'); p.rect(4, 80, 184, 1, WOODL); p.rect(4, 86, 184, 1, '#4a2c18');   // the floor
    p.rect(14, 52, 164, 28, '#a8703c'); p.rect(14, 52, 164, 2, '#c8905a');                              // carved walls
    for (var px = 18; px < 176; px += 22) {                                                              // windows with gold frames
      p.rect(px, 58, 12, 15, GOLDD); p.rect(px + 1, 59, 10, 13, '#3a2214'); p.rect(px + 5, 59, 1, 13, '#6a4426'); p.rect(px + 1, 65, 10, 1, '#6a4426');
      p.rect(px - 3, 76, 18, 2, '#8a5a30');
    }
    for (var cx = 16; cx < 178; cx += 6) { p.px(cx, 55, '#d8a868'); p.px(cx + 3, 76, '#7a4a28'); }      // carving dots
    p.rect(14, 78, 164, 2, GOLDD);
    // the roofs, folded one above another
    p.poly([[0, 56], [192, 56], [168, 32], [24, 32]], '#5a3020'); p.rect(0, 54, 192, 3, '#7a4028');
    for (var ry = 36; ry < 54; ry += 4) p.line(26 - (ry - 32), ry, 166 + (ry - 32), ry, '#4a2618');
    p.line(0, 56, 24, 32, GOLD); p.line(192, 56, 168, 32, GOLD); p.rect(0, 56, 192, 1, GOLD);
    p.poly([[36, 34], [156, 34], [132, 8], [60, 8]], '#4a2618'); p.rect(36, 32, 120, 3, '#6a3622');
    for (var r2 = 12; r2 < 32; r2 += 4) p.line(60 - (r2 - 8), r2, 132 + (r2 - 8), r2, '#3a1e12');
    p.line(36, 34, 60, 8, GOLD); p.line(156, 34, 132, 8, GOLD); p.rect(60, 7, 72, 2, GOLD);
    // the gable in front (tebar layar), carved with gold vines
    p.poly([[74, 54], [118, 54], [96, 20]], '#b8783e'); p.poly([[79, 52], [113, 52], [96, 26]], '#c8905a');
    p.line(96, 26, 96, 52, GOLDD); p.line(86, 44, 96, 34, GOLD); p.line(106, 44, 96, 34, GOLD); p.disc(96, 46, 3, GOLD); p.px(96, 46, '#b8322a');
    [[84, 48], [108, 48], [90, 40], [102, 40]].forEach(function (c) { p.px(c[0], c[1], GOLDL); });
    // golden horns at the ends of every ridge (sulur bayung)
    [[60, 8, -1], [132, 8, 1], [24, 32, -1], [168, 32, 1]].forEach(function (h) { p.line(h[0], h[1], h[0] + h[2] * 5, h[1] - 6, GOLD, 2); p.px(h[0] + h[2] * 6, h[1] - 7, GOLDL); });
    p.rect(94, 0, 4, 8, GOLD); p.disc(96, 1, 2, GOLDL);
    // the broad front steps and the great drum
    p.rect(80, 86, 32, 26, '#7a4a28');
    for (var s = 0; s < 6; s++) { p.rect(80, 88 + s * 4, 32, 2, '#a8703c'); p.rect(80, 90 + s * 4, 32, 1, '#5a341c'); }
    p.rect(78, 82, 2, 30, GOLDD); p.rect(112, 82, 2, 30, GOLDD);
    p.ell(124, 94, 6, 5, '#8a2a1e'); p.ell(124, 94, 4.5, 3.5, '#e8d0a0'); p.line(120, 86, 124, 89, WOODD); p.line(128, 86, 124, 89, WOODD);
    p.outline(OUT);
  }

  // ---------------------------------------------------------------- Pak Belalang's hut (64 x 56)
  function drawPondok(p) {
    p.ell(32, 53, 30, 3, 'rgba(30,20,10,0.25)');
    [8, 22, 42, 56].forEach(function (x, i) { p.rect(x, 42, 3, 13 - (i % 2), WOODD); });                 // crooked posts
    p.rect(4, 39, 56, 4, '#7a5232'); p.rect(4, 39, 56, 1, WOODL);
    p.rect(8, 22, 48, 17, '#c8a868');                                                                     // woven bamboo walls
    for (var y = 22; y < 39; y += 2) for (var x = 8 + (y % 4 ? 0 : 2); x < 56; x += 4) p.rect(x, y, 2, 1, '#a88848');
    p.rect(38, 27, 8, 7, '#d8c080'); p.rect(38, 27, 8, 1, '#8a6a38');                                     // a patch in the wall
    p.rect(26, 26, 10, 13, '#3a2a1a'); p.rect(26, 26, 10, 1, WOODD);                                     // the doorway
    p.rect(14, 28, 7, 6, '#3a2a1a'); p.rect(17, 28, 1, 6, '#a88848');
    p.poly([[0, 25], [64, 25], [50, 2], [14, 2]], '#8a7040');                                            // the nipah roof, with holes
    for (var ry = 5; ry < 25; ry += 3) p.line(14 - (ry - 2) * 0.6, ry, 50 + (ry - 2) * 0.6, ry, '#6a5430');
    p.rect(14, 1, 36, 2, '#6a5430');
    [[24, 9], [40, 14], [18, 19], [46, 6]].forEach(function (h) { p.rect(h[0], h[1], 3, 2, '#2a2010'); });
    p.rect(30, 6, 7, 5, '#a8925a'); p.line(30, 6, 36, 10, '#6a5430');                                     // a patch on the roof
    for (var st = 0; st < 4; st++) p.rect(29, 43 + st * 3, 7, 1, WOODL);                                // a rattan-tied ladder
    p.line(29, 42, 29, 55, WOODD); p.line(35, 42, 35, 55, WOODD);
    p.ell(51, 50, 5, 3.6, '#2a2420'); p.ell(51, 48, 4, 1.4, '#4a423a'); p.px(49, 47, '#8a827a');         // the big rice pot
    p.outline(OUT);
  }
  function drawTempayan(p) {   // 16 x 18: a big clay water jar
    p.ell(8, 17, 6, 1.4, 'rgba(30,20,10,0.3)');
    p.ell(8, 11, 6.5, 6, '#9a5a30'); p.ell(7, 9.5, 4.6, 4, '#b8703c'); p.rect(5, 3, 6, 3, '#9a5a30'); p.rect(4, 2, 8, 2, '#c8804a');
    p.ell(8, 3, 3, 0.8, '#3a5a7a'); p.px(6, 9, '#e8a870'); p.px(5, 11, '#d8905a');
    p.line(3, 12, 13, 12, '#7a4220'); p.px(8, 14, '#7a4220');
    p.outline(OUT);
  }

  // ---------------------------------------------------------------- the ship from Negeri Antah Berantah (112 x 84)
  function drawKapal(p) {
    p.ell(56, 80, 54, 3, 'rgba(10,20,40,0.35)');
    function sail(x0, x1, y0, y1, lean) {
      for (var y = y0; y <= y1; y++) {
        var t = (y - y0) / (y1 - y0), a = x0 + lean * (1 - t), b = x1 - lean * (1 - t) * 0.3;
        p.rect(a, y, b - a, 1, ((y >> 2) & 1) ? '#a8322a' : '#1e1a22');
      }
      p.line(x0 + lean, y0, x1, y0, WOODD, 2); p.line(x0, y1, x1, y1, WOODD, 2);
    }
    p.line(40, 4, 40, 58, WOODD, 2); p.line(76, 8, 76, 58, WOODD, 2);
    sail(22, 58, 8, 46, 6); sail(60, 94, 12, 46, 5);
    p.poly([[40, 0], [48, 2], [40, 4]], '#a8322a'); p.poly([[76, 4], [84, 6], [76, 8]], GOLD);
    p.poly([[2, 56], [110, 56], [100, 78], [14, 78]], '#4a2a18');                                     // the hull
    p.rect(6, 58, 100, 4, '#a8322a'); p.rect(6, 62, 98, 1, GOLD); p.rect(10, 66, 92, 1, '#5a3420');
    for (var x = 14; x < 100; x += 12) p.disc(x, 70, 1.4, GOLDD);                                     // little round windows
    p.rect(4, 52, 104, 4, '#6a3a20'); for (var r = 8; r < 106; r += 6) p.rect(r, 50, 1, 3, '#6a3a20');  // the rail
    p.poly([[100, 52], [110, 40], [112, 46], [106, 56]], '#1e1a22');                                    // the hornbill at the bow
    p.poly([[106, 40], [111, 36], [112, 41]], '#f2c94c'); p.rect(108, 42, 3, 1, '#e8a23a'); p.px(106, 43, '#ffffff');
    p.line(6, 78, 104, 78, '#7ab8d8');
    p.outline('#140c08');
  }
  function drawSampan(p) {   // 32 x 14: a little sampan, tied up under the ship
    p.ell(16, 12, 15, 2, 'rgba(10,20,40,0.3)');
    p.poly([[1, 4], [31, 4], [27, 11], [5, 11]], '#7a4a2a'); p.poly([[4, 5], [28, 5], [25, 9], [7, 9]], '#5a3420');
    p.rect(1, 4, 30, 1, WOODL); p.rect(13, 6, 6, 2, '#8a5a32'); p.line(1, 4, 0, 1, '#d8c8a0');
    p.outline(OUT);
  }

  // ---------------------------------------------------------------- grasshoppers, real and woven, and footprints
  function drawBelalang(p, f) {   // 12 x 10: a green grasshopper, glowing faintly gold
    var G = '#7ac84a', G2 = '#4a9a2a';
    p.disc(6, 5, 4.5, 'rgba(255,224,120,0.35)');
    p.ell(6, 5, 4, 1.6, G); p.ell(9, 4, 1.6, 1.4, G); p.px(10, 3, '#1a2a10'); p.line(9, 3, 11, 0, G2); p.line(10, 3, 12, 1, G2);
    p.line(4, 4, 7, 4, '#b8e870');
    if (f) { p.line(4, 6, 1, 9, G2); p.line(6, 6, 7, 9, G2); }                                        // legs out: a hop
    else { p.line(3, 5, 1, 2, G2); p.line(1, 2, 2, 7, G2); p.px(6, 7, G2); p.px(8, 7, G2); }
    p.px(5, 4, '#fff0a0');
  }
  function drawAnyam(p, icon) {   // a little grasshopper woven from strips of coconut leaf
    var L1 = '#d8d070', L2 = '#a8b048', L3 = '#e8e4a0', o = icon ? 1 : 0;
    p.ell(7, 8 + o, 5.5, 2.6, L2);
    for (var x = 2; x < 13; x += 2) { p.line(x, 6 + o, x + 2, 10 + o, L1); p.line(x + 2, 6 + o, x, 10 + o, L3); }
    p.ell(12, 6 + o, 2, 2, L1); p.px(13, 5 + o, '#3a3a10'); p.line(13, 4 + o, 15, 0 + o, L2); p.line(12, 4 + o, 13, 0 + o, L2);
    p.line(3, 10 + o, 1, 13 + o, L2); p.line(9, 10 + o, 10, 13 + o, L2); p.line(4, 6 + o, 1, 3 + o, L2);
    [[4, 8], [9, 7], [11, 9]].forEach(function (c) { p.px(c[0], c[1] + o, '#ffe08a'); });            // Pelita's gold dust
  }
  function drawTapak(p) {   // 8 x 10: a bare footprint, glowing in Pelita's light
    p.ell(4, 6.5, 2.8, 3.4, '#e8b840'); p.ell(4, 6.5, 2, 2.6, '#ffd870'); p.ell(4, 6.5, 1, 1.4, '#fff4c8');
    [[1.5, 2], [3, 1], [4.6, 1], [6.2, 2]].forEach(function (t) { p.disc(t[0], t[1], 0.9, '#ffd870'); });
  }

  // ---------------------------------------------------------------- the thieves' camp, the chest and the clues
  function drawBangsal(p) {   // 64 x 40: a lean-to of nipah leaves on crooked poles
    p.ell(32, 37, 30, 3, 'rgba(30,20,10,0.3)');
    p.rect(8, 28, 48, 8, '#a88a50'); for (var x = 10; x < 56; x += 10) p.rect(x, 29, 8, 6, '#c8a868');   // the mats
    [[6, 10, 36], [58, 14, 36], [20, 6, 30], [44, 8, 30]].forEach(function (c) { p.line(c[0], c[1], c[0] + (c[0] < 32 ? 1 : -1), c[2], WOODD, 2); });
    p.poly([[0, 14], [64, 18], [60, 8], [4, 2]], '#5a7a3a');
    for (var r = 4; r < 17; r += 3) p.line(3, r, 62, r + 3, '#4a6a2a');
    p.line(0, 14, 64, 18, '#3a5a24');
    p.ell(48, 31, 3, 2, '#3a2a20'); p.ell(48, 30, 2, 0.8, '#e8e0d0');                                  // a pot of cold rice
    [[14, 33], [22, 32], [34, 33]].forEach(function (c) { p.ell(c[0], c[1], 2, 1, '#c84a8a'); p.ell(c[0] + 3, c[1], 2, 1, '#c84a8a'); });   // stolen slippers
    p.outline(OUT);
  }
  function drawUnggun(p) {   // 16 x 16: a campfire in a ring of stones
    [[2, 13], [5, 15], [10, 15], [13, 13], [8, 11]].forEach(function (c) { p.ell(c[0], c[1], 2, 1.4, '#7a746a'); });
    p.line(3, 12, 13, 14, WOODD, 2); p.line(4, 14, 12, 11, '#6a4426', 2);
    p.poly([[4, 12], [8, 1], [12, 12]], '#ff8a2a'); p.poly([[6, 12], [8, 4], [10, 12]], '#ffd040'); p.poly([[7, 12], [8, 7], [9, 12]], '#fff6c8');
  }
  function drawPeti(p) {   // 32 x 22: the Peti Pusaka Diraja, royal yellow and gold
    p.ell(16, 20, 14, 2, 'rgba(30,20,10,0.35)');
    p.rect(3, 9, 26, 11, '#c89a2a'); p.rect(3, 9, 26, 2, '#e8c050'); p.rect(3, 18, 26, 2, '#8a6418');
    p.rect(3, 3, 26, 7, '#d8a830'); p.ell(16, 3.5, 13, 3, '#e8c050'); p.rect(4, 2, 24, 1, '#f6dc8a');
    p.rect(7, 2, 2, 18, '#8a2a1e'); p.rect(23, 2, 2, 18, '#8a2a1e'); p.rect(3, 9, 26, 1, '#8a2a1e');
    p.rect(14, 7, 4, 6, GOLDL); p.rect(15, 9, 2, 2, '#3a1a10');
    [[11, 14], [20, 14], [11, 5], [20, 5]].forEach(function (c) { p.disc(c[0], c[1], 1.4, '#ffffff'); p.px(c[0], c[1], '#d8283a'); });
    p.outline(OUT);
  }
  function drawKain(p) {   // 16 x 16: a thorn bush with a scrap of black cloth caught in it
    p.ell(8, 11, 7, 4.5, '#3a6a2a'); p.ell(7, 9, 5, 3, '#4a8a3a'); [[3, 8], [12, 9], [9, 6], [5, 12]].forEach(function (c) { p.px(c[0], c[1], '#d8d0a0'); });
    p.poly([[9, 7], [15, 9], [13, 13], [10, 11]], '#1a1820'); p.px(14, 12, '#3a3840');
    p.outline(OUT);
  }
  function drawSyiling(p) {   // 16 x 16: a gold coin in the leaves
    p.ell(8, 12, 7, 3, '#5a4a2a'); [[3, 11], [11, 13], [7, 13]].forEach(function (c) { p.ell(c[0], c[1], 2.4, 1, '#7a6a3a'); });
    p.disc(8, 10, 3.4, GOLD); p.disc(8, 10, 2.2, GOLDL); p.px(8, 10, '#b8322a'); p.px(7, 9, '#ffffff'); p.px(12, 6, '#ffffff'); p.px(11, 7, GOLDL);
  }
  function drawObor(p) {   // 16 x 16: a burnt-out torch, still smoking
    p.line(2, 13, 12, 9, WOODD, 2); p.ell(13, 9, 2.4, 1.6, '#2a2420'); p.px(13, 8, '#ff8a3a');
    p.disc(13, 5, 1.6, 'rgba(200,200,200,0.5)'); p.disc(12, 2, 1.2, 'rgba(200,200,200,0.35)');
  }

  // ---------------------------------------------------------------- the Kerengga gang
  function drawPencuri(p, f) {   // 16 x 22: black clothes, a black cloth mask, a stick
    var SK = '#9a6440', B = '#22202a', B2 = '#3a3644', leg = f ? 1 : 0;
    p.rect(5, 17, 2, 5 - leg, B); p.rect(9, 17, 2, 4 + leg, B);
    p.rect(4, 12, 8, 6, B2); p.rect(4, 15, 8, 1, '#5a1e1e');
    p.rect(4, 7, 8, 6, B); p.rect(3, 8, 1, 4, SK); p.rect(12, 8, 1, 4, SK);
    p.rect(5, 2, 6, 5, SK); p.rect(5, 1, 6, 2, B); p.rect(5, 5, 6, 2, B);                            // the mask leaves only the eyes
    p.px(6, 4, '#ffffff'); p.px(9, 4, '#ffffff'); p.px(7, 4, '#1a1210'); p.px(10, 4, '#1a1210');
    p.line(13, 3 + leg, 13, 18, WOODL); p.px(13, 2 + leg, WOOD);
    p.outline('#0e0c12');
  }
  function drawKetua(p, f) {   // 20 x 26: Si Kerengga, with a red headcloth and a cudgel
    var SK = '#8a5a38', B = '#22202a', B2 = '#3a3644', leg = f ? 1 : 0;
    p.rect(6, 20, 3, 6 - leg, B); p.rect(11, 20, 3, 5 + leg, B);
    p.rect(4, 14, 12, 7, B2); p.rect(4, 17, 12, 2, '#a8322a');
    p.rect(4, 8, 12, 7, B); p.rect(2, 9, 2, 6, SK); p.rect(16, 9, 2, 6, SK);
    p.rect(6, 2, 8, 6, SK); p.rect(6, 5, 8, 3, B);
    p.px(7, 4, '#ffffff'); p.px(11, 4, '#ffffff'); p.px(8, 4, '#1a1210'); p.px(12, 4, '#1a1210'); p.line(7, 3, 9, 3, '#1a1210'); p.line(11, 3, 13, 3, '#1a1210');
    p.rect(5, 0, 10, 3, '#b8322a'); p.poly([[13, 0], [17, -1], [15, 3]], '#b8322a');
    p.line(18, 2 + leg, 17, 18, WOOD, 2); p.ell(18, 3 + leg, 2, 2.4, WOODD);
    p.outline('#0e0c12');
  }

  // ---------------------------------------------------------------- Belalang (16 x 20: a skinny barefoot boy, smaller than the grown-ups)
  function drawKid(p, blink) {
    var SK = '#a8714a', EYE = '#2a1a10';
    p.rect(6, 17, 1, 3, SK); p.rect(9, 17, 1, 3, SK); p.px(5, 19, SK); p.px(10, 19, SK);             // bare feet
    p.rect(5, 14, 6, 3, '#7a5a3a'); p.rect(5, 16, 6, 1, '#5a4228');                                    // shorts
    p.rect(5, 10, 6, 5, '#5aa83e'); p.rect(9, 10, 2, 5, '#4a8a32'); p.rect(4, 11, 1, 3, SK); p.rect(11, 11, 1, 3, SK);   // a grasshopper-green baju
    p.rect(4, 4, 8, 6, SK);                                                                             // a big head
    if (blink) { p.rect(5, 7, 2, 1, EYE); p.rect(9, 7, 2, 1, EYE); } else { p.px(6, 7, EYE); p.px(9, 7, EYE); p.px(6, 6, '#ffffff'); }
    p.rect(7, 9, 2, 1, '#8a4a3a');
    p.rect(4, 2, 8, 3, '#1a1210'); p.px(3, 3, '#1a1210'); p.px(12, 3, '#1a1210'); p.px(5, 1, '#1a1210'); p.px(9, 1, '#1a1210'); p.px(11, 2, '#1a1210');   // messy hair
    p.line(12, 12, 14, 9, '#d8d070'); p.px(14, 8, '#a8b048');                                          // a woven grasshopper on a stick
    p.outline(OUT);
  }

  // ---------------------------------------------------------------- the Sumpit and its dart
  function drawSumpit(p) {
    p.line(1, 14, 14, 1, '#c8a050', 2); p.line(2, 14, 14, 2, '#a88030');
    [[4, 11], [8, 7], [11, 4]].forEach(function (c) { p.rect(c[0], c[1], 2, 2, '#6a4a20'); });           // rattan bindings
    p.disc(2, 13, 1.6, '#5a3a1e');
    p.line(9, 14, 15, 8, '#e8e0d0'); p.px(9, 14, '#f2f2f2'); p.px(15, 8, '#c8323a');
  }

  Art.generate20 = function (scene) {
    var make = Art.make;
    make(scene, 'istana10', 192, 112, drawIstana);
    make(scene, 'pondok10', 64, 56, drawPondok);
    make(scene, 'tempayan10', 16, 18, drawTempayan);
    make(scene, 'kapal10', 112, 84, drawKapal);
    make(scene, 'sampan10', 32, 14, drawSampan);
    make(scene, 'belalang10_0', 12, 10, function (p) { drawBelalang(p, 0); });
    make(scene, 'belalang10_1', 12, 10, function (p) { drawBelalang(p, 1); });
    make(scene, 'anyam10', 16, 14, function (p) { drawAnyam(p, false); }, true);
    make(scene, 'tapak10', 8, 10, drawTapak);
    make(scene, 'bangsal10', 64, 40, drawBangsal);
    make(scene, 'unggun10', 16, 16, drawUnggun, true);
    make(scene, 'peti_diraja10', 32, 22, drawPeti);
    make(scene, 'kain10', 16, 16, drawKain);
    make(scene, 'syiling10', 16, 16, drawSyiling, true);
    make(scene, 'obor10', 16, 16, drawObor, true);
    make(scene, 'damak10', 10, 3, function (p) { p.line(0, 1, 7, 1, '#e8e0d0'); p.rect(7, 0, 3, 3, '#c8323a'); p.px(0, 1, '#ffffff'); });
    for (var f = 0; f < 2; f++) (function (f) {
      make(scene, 'pencuri10_' + f, 16, 22, function (p) { drawPencuri(p, f); });
      make(scene, 'ketua10_' + f, 20, 26, function (p) { drawKetua(p, f); });
      make(scene, 'npc_belalang_' + f, 16, 20, function (p) { drawKid(p, !!f); });
    })(f);
    // the herald, the foreign fortune teller and his captain (portraits, in the villagers' own style)
    var dv = Art.drawVillager;
    function person(key, L, extra) { make(scene, key, 16, 24, function (p) { p.ctx.save(); p.ctx.translate(0, 4); dv(p, L, false); p.ctx.restore(); if (extra) extra(p); }); }
    person('npc10_bentara', { skin: '#a8714a', shirt: '#2a4a8a', shirt2: '#1e3a6e', bottom: '#c8a040', bottom2: '#a88030', hair: '#1a1210', hat: 'tanjak_red' });
    person('npc10_nakhoda', { skin: '#8a5a38', shirt: '#8a2a2a', shirt2: '#6a1e1e', bottom: '#e8e0d0', bottom2: '#1e1a22', hair: '#1a1210', hat: 'headband', beard: '#1a1210' });
    person('npc10_jambul', { skin: '#b8845a', shirt: '#5a2a6a', shirt2: '#3e1e4e', bottom: '#5a2a6a', bottom2: '#3e1e4e', hair: '#e8e4dc', hat: 'kopiah', beard: '#e8e4dc' }, function (p) {
      p.rect(4, 4, 8, 4, '#f2ece0'); p.rect(4, 6, 8, 1, '#d8cebc'); p.disc(8, 4, 2, '#f2ece0'); p.px(8, 5, '#b8322a');   // a tall white turban...
      p.line(9, 3, 12, 0, '#3a8a6a'); p.line(10, 3, 13, 1, '#5ab88a'); p.px(13, 0, '#f2c94c');                          // ...with a feather on top
    });
    var IC = { belalang_anyam: function (p) { drawAnyam(p, true); }, peti_diraja: function (p) { p.rect(1, 5, 14, 9, '#c89a2a'); p.rect(1, 3, 14, 3, '#e8c050'); p.rect(4, 3, 1, 11, '#8a2a1e'); p.rect(11, 3, 1, 11, '#8a2a1e'); p.rect(7, 6, 2, 3, GOLDL); p.px(7, 11, '#d8283a'); }, sumpit: drawSumpit };
    Object.keys(IC).forEach(function (id) { make(scene, 'i_' + id, 16, 16, IC[id], true); });
    var a = scene.anims;
    [['pencuri10_walk', 'pencuri10', 6], ['ketua10_walk', 'ketua10', 5], ['belalang10_hop', 'belalang10', 3]].forEach(function (k) {
      if (!a.exists(k[0])) a.create({ key: k[0], frames: [{ key: k[1] + '_0' }, { key: k[1] + '_1' }], frameRate: k[2], repeat: -1 });
    });
  };
})(window.LC);
