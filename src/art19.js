/* Little Creature — art, part 19 (v2.9): the deep of Lombong Puaka. The hidden Bunian door, the vault's pillars, heaps
 * of old gold and its chest, the Puaka Emas (a hulking spirit of dark smoke studded with gold coins, crowned with gold,
 * with fists of raw ore), the ore that falls from the roof, an old miner's pickaxe and lamp, and two new treasures. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art;
  var G = '#e9b949', G2 = '#f8d870', G3 = '#b8862a', GOLD = '#e9c46a', GOLDL = '#f6dc8a', RUBY = '#d8283a', RUBYL = '#ff6a6a';

  function flower(p, x, y) { [[0, -2], [2, 0], [0, 2], [-2, 0]].forEach(function (d) { p.px(x + d[0], y + d[1], GOLD); }); p.px(x, y, GOLDL); [[1, -1], [1, 1], [-1, 1], [-1, -1]].forEach(function (d) { p.px(x + d[0], y + d[1], '#c4922f'); }); }
  function nugget(p, x, y, r) {
    p.poly([[x - r, y + r * 0.4], [x - r * 0.6, y - r * 0.7], [x + r * 0.3, y - r], [x + r, y - r * 0.1], [x + r * 0.6, y + r * 0.8], [x - r * 0.3, y + r]], G);
    p.poly([[x - r * 0.5, y - r * 0.1], [x - r * 0.2, y - r * 0.6], [x + r * 0.4, y - r * 0.5], [x + r * 0.3, y]], G2);
    p.px(x - r * 0.2, y - r * 0.3, '#ffffff'); p.px(x + r * 0.4, y + r * 0.5, G3);
  }

  function drawPintu(p) {   // 32 x 40: a door of black stone and gold in the rock (the bottom 16 px are its 2-tile footprint)
    var gl = p.ctx.createRadialGradient(16, 26, 2, 16, 26, 19); gl.addColorStop(0, 'rgba(255,220,130,0.6)'); gl.addColorStop(1, 'rgba(255,200,100,0)');
    p.ctx.fillStyle = gl; p.ctx.fillRect(0, 2, 32, 38);
    p.rect(3, 13, 26, 27, '#1e1a22'); p.ell(16, 13, 13, 10.5, '#1e1a22');           // the carved stone arch
    p.rect(5, 14, 22, 26, GOLD); p.ell(16, 14, 11, 9, GOLD);                        // its gold rim
    p.rect(6, 15, 20, 25, '#14403e'); p.ell(16, 15, 10, 8, '#14403e');              // the two leaves of the door
    p.rect(15, 8, 2, 32, '#c4922f');
    [[8, 20], [18, 20], [8, 30], [18, 30]].forEach(function (r) { p.rect(r[0], r[1], 6, 7, '#1c524e'); p.rect(r[0], r[1], 6, 1, '#2a6a64'); });
    flower(p, 11, 23); flower(p, 21, 23); flower(p, 16, 11);
    [[9, 12], [7, 17], [23, 12], [25, 17]].forEach(function (c) { p.px(c[0], c[1], GOLDL); });   // a vine up the arch
    p.line(7, 18, 10, 11, '#c4922f'); p.line(25, 18, 22, 11, '#c4922f');
    p.disc(13.5, 33, 1.3, GOLDL); p.disc(18.5, 33, 1.3, GOLDL);                       // ring handles
    p.rect(6, 38, 20, 2, '#fff0b0');                                                   // light under the door
    [[4, 8], [28, 10], [2, 26], [30, 30], [16, 3]].forEach(function (c) { p.px(c[0], c[1], '#ffffff'); });
  }

  function drawPuaka(p, f) {   // 44 x 44: the Puaka Emas (two frames)
    var B = 'rgba(34,18,44,0.97)', B2 = 'rgba(62,36,78,0.95)';
    for (var x = 8; x < 36; x += 5) p.poly([[x, 33], [x + 2.5, (x / 5 + f) % 2 ? 43 : 40], [x + 5, 33]], B);   // smoky wisps: it floats
    p.ell(22, 27, 15, 10.5, B); p.ell(21, 25, 11, 7.5, B2);
    p.ell(7, 23 + (f ? 1 : -1), 4, 6.5, B); p.ell(37, 23 - (f ? 1 : -1), 4, 6.5, B);   // arms...
    nugget(p, 6, 30 + (f ? 1 : -1), 4.6); nugget(p, 38, 30 - (f ? 1 : -1), 4.6);      // ...with fists of raw gold ore
    p.ell(22, 13, 9, 7.5, B); p.ell(21, 12, 6.5, 5, B2);                               // the head
    [[[14, 8], [16, 1], [18, 7]], [[19, 6], [22, 0], [25, 6]], [[26, 7], [28, 1], [30, 8]]].forEach(function (s) { p.poly(s, GOLD); });
    p.rect(14, 6, 16, 3, GOLD); p.rect(14, 6, 16, 1, GOLDL); p.px(18, 7, RUBY); p.px(22, 7, RUBYL); p.px(26, 7, RUBY);   // its crown
    p.rect(17, 12, 3, 2, '#ffd040'); p.rect(24, 12, 3, 2, '#ffd040'); p.px(18, 12, '#fff6c8'); p.px(25, 12, '#fff6c8');   // ember eyes
    p.line(16, 10, 20, 11, '#140a18'); p.line(28, 10, 24, 11, '#140a18');
    p.rect(19, 17, 6, 1, f ? '#ff9a3a' : '#ffb84a');
    [[14, 22], [27, 21], [19, 28], [31, 27], [11, 29], [24, 32], [16, 33], [29, 33], [22, 24], [34, 22]].forEach(function (c, i) {   // coins stuck all over it
      p.disc(c[0], c[1], i % 3 ? 1.6 : 2, G); p.px(c[0] - 1, c[1] - 1, G2); p.px(c[0] + 1, c[1] + 1, G3);
    });
    p.outline('#140a18');
  }

  function drawPeti(p) {   // 32 x 24: the vault's chest (2 tiles wide)
    p.ell(16, 22, 14, 2.2, 'rgba(20,12,8,0.35)');
    p.rect(3, 11, 26, 11, '#6a2418'); p.rect(3, 11, 26, 2, '#8a3424'); p.rect(3, 20, 26, 2, '#4a160e');
    p.rect(3, 5, 26, 7, '#7a2a1c'); p.ell(16, 5.5, 13, 3, '#8a3424'); p.rect(4, 4, 24, 1, '#a04a34');
    p.rect(3, 11, 26, 1, GOLD); p.rect(7, 3, 2, 19, GOLD); p.rect(23, 3, 2, 19, GOLD); p.rect(3, 21, 26, 1, '#c4922f');
    p.rect(14, 9, 4, 6, GOLD); p.rect(15, 11, 2, 2, '#3a1a10'); p.px(14, 9, GOLDL);
    p.px(11, 7, RUBY); p.px(20, 7, RUBY); p.px(11, 16, '#4ab0e0'); p.px(20, 16, '#4ab0e0');
    [[5, 22], [27, 22], [10, 23]].forEach(function (c) { p.disc(c[0], c[1], 1.4, G); p.px(c[0], c[1] - 1, G2); });
  }
  function drawTiang(p) {   // 16 x 44: a carved pillar of black stone banded with gold
    p.ell(8, 42, 7, 2, 'rgba(20,12,8,0.35)');
    p.rect(1, 37, 14, 6, '#2a2630'); p.rect(1, 37, 14, 1, GOLD); p.rect(1, 42, 14, 1, '#1a1620');
    p.rect(3, 7, 10, 30, '#24202a'); p.rect(3, 7, 3, 30, '#34303a'); p.rect(11, 7, 2, 30, '#1a1620');
    p.rect(3, 12, 10, 1, GOLD); p.rect(3, 31, 10, 1, GOLD);
    flower(p, 8, 21); p.px(8, 26, '#c4922f'); p.px(8, 16, '#c4922f');
    p.rect(1, 2, 14, 5, '#2a2630'); p.rect(1, 6, 14, 1, GOLD); p.rect(0, 0, 16, 2, '#1e1a22'); p.rect(2, 3, 12, 1, '#3a3640');
  }
  function drawTimbun(p) {   // 32 x 18: a heap of old gold (2 tiles wide)
    p.ell(16, 15.5, 15, 2.5, 'rgba(20,12,8,0.35)');
    p.ell(16, 12, 14.5, 5.5, G3); p.ell(15, 10, 11, 5, G); p.ell(14, 8, 7, 3.4, G2);
    p.speck(4, 7, 24, 9, G2, 20); p.speck(4, 9, 24, 8, G3, 14);
    [[6, 13], [12, 14], [20, 13], [26, 12], [9, 10], [18, 9]].forEach(function (c) { p.disc(c[0], c[1], 1.5, G); p.px(c[0] - 1, c[1] - 1, '#fff2c0'); });
    p.rect(23, 3, 3, 4, GOLD); p.rect(22, 2, 5, 1, GOLDL); p.rect(24, 7, 1, 2, GOLD); p.rect(23, 9, 3, 1, '#c4922f');   // a goblet
    p.px(9, 8, RUBY); p.px(17, 6, '#4ab0e0'); p.px(13, 6, '#ffffff'); p.px(27, 10, '#ffffff');
  }
  function drawBeliung(p) {   // 16 x 16: an old pickaxe and a miner's lamp, left by the wall
    p.line(3, 15, 10, 4, '#6a4428', 2);
    p.poly([[5, 4], [10, 2], [15, 5], [11, 4], [9, 6]], '#7a7680'); p.px(10, 3, '#a8a4b0');
    p.rect(11, 9, 4, 5, '#5a5058'); p.rect(12, 10, 2, 3, '#ffcf6a'); p.rect(11, 8, 4, 1, '#3a3438'); p.rect(12, 7, 2, 1, '#3a3438'); p.rect(10, 14, 6, 1, '#3a3438');
  }
  function drawBatu(p) {   // 12 x 10: ore falling from the roof
    p.ell(6, 5, 5.4, 4.2, '#5a5058'); p.ell(5, 4, 3.6, 2.6, '#6e6670'); p.px(4, 3, '#8a8290');
    p.px(7, 6, G); p.px(3, 6, G2); p.px(8, 3, G);
  }

  var IC = {
    mahkota_emas: function (p) {
      p.rect(2, 10, 12, 4, GOLD); p.rect(2, 10, 12, 1, GOLDL); p.rect(2, 13, 12, 1, '#c4922f');
      p.poly([[2, 10], [2, 4], [5, 8]], GOLD); p.poly([[5, 10], [8, 2], [11, 10]], GOLD); p.poly([[11, 8], [14, 4], [14, 10]], GOLD);
      p.px(2, 4, GOLDL); p.px(8, 2, GOLDL); p.px(14, 4, GOLDL);
      p.px(5, 12, RUBY); p.px(8, 11, RUBYL); p.px(8, 12, RUBY); p.px(11, 12, RUBY); p.px(7, 6, '#ffffff');
    },
    delima: function (p) {
      p.poly([[4, 6], [6, 3], [10, 3], [12, 6], [8, 14]], RUBY);
      p.poly([[4, 6], [12, 6], [8, 14]], '#b01a2a');
      p.poly([[6, 3], [10, 3], [9, 6], [7, 6]], RUBYL);
      p.px(7, 4, '#ffffff'); p.px(6, 7, '#ff8a8a');
    }
  };

  Art.generate19 = function (scene) {
    var make = Art.make;
    make(scene, 'pintu_rahsia', 32, 40, drawPintu);
    make(scene, 'puaka_emas_0', 44, 44, function (p) { drawPuaka(p, 0); });
    make(scene, 'puaka_emas_1', 44, 44, function (p) { drawPuaka(p, 1); });
    make(scene, 'peti_harta', 32, 24, drawPeti, true);
    make(scene, 'tiang_rahsia', 16, 44, drawTiang, true);
    make(scene, 'timbun_emas', 32, 18, drawTimbun, '#5a3a10');
    make(scene, 'beliung_lama', 16, 16, drawBeliung, true);
    make(scene, 'batu_jatuh', 12, 10, drawBatu, true);
    make(scene, 'syiling_s', 10, 6, function (p) { [[2, 3], [5, 2], [7, 4], [4, 4.5]].forEach(function (c, i) { p.ell(c[0], c[1], 1.6, 1, i % 2 ? G : G3); p.px(c[0], c[1] - 0.5, G2); }); });
    Object.keys(IC).forEach(function (id) { make(scene, 'i_' + id, 16, 16, IC[id], true); });
    var a = scene.anims;
    if (!a.exists('puaka_emas_walk')) a.create({ key: 'puaka_emas_walk', frames: [{ key: 'puaka_emas_0' }, { key: 'puaka_emas_1' }], frameRate: 4, repeat: -1 });
  };
})(window.LC);
