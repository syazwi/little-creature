/* Little Creature — procedural pixel art for Chapter 6 (v2.4): Nenek asleep on the pangkin, young areca palms, the
 * waterfall of Gunung Ledang, the princess's pavilion, the Bunga Ledang, the silat duellists (Hang Tuah, Hang Jebat),
 * Mak Lampir's return, and icons (Nenek's diary, a young areca nut, the Bunga Ledang, the princess's shawl). */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art;

  function drawPangkin(p) {   // 32x20: a bamboo bench, Nenek asleep on it under a batik cloth
    p.rect(2, 13, 28, 3, '#c8b060'); p.rect(2, 13, 28, 1, '#e0c878'); for (var x = 4; x < 30; x += 4) p.px(x, 14, '#a89040');
    p.rect(3, 16, 2, 4, '#8a7030'); p.rect(27, 16, 2, 4, '#8a7030');
    p.ell(7, 10, 4, 2.4, '#f0ece0');                                  // the pillow
    p.disc(8, 8, 3, '#b8875a'); p.ell(7, 6, 3.4, 2, '#e8e4dc'); p.disc(5, 6, 1.6, '#e8e4dc');   // her face, white hair in a bun
    p.px(9, 8, '#5a3a2a'); p.px(7, 8, '#5a3a2a');                       // eyes closed
    p.poly([[10, 8], [29, 8], [29, 13], [10, 13]], '#3a2a6a');          // the batik cloth
    for (var y = 9; y < 13; y += 2) for (x = 12; x < 29; x += 3) p.px(x + (y % 4 ? 1 : 0), y, '#e9c46a');
    p.rect(10, 8, 19, 1, '#5a4a8a');
    p.px(16, 4, '#d8b0ff'); p.px(20, 2, '#d8b0ff'); p.px(23, 5, '#b08ae0');   // a little violet wisp of the curse
  }
  function drawPinang(p) {   // 16x48: a slender young areca palm with a bunch of green nuts
    p.rect(7, 12, 2, 36, '#a89878'); for (var y = 14; y < 48; y += 4) p.rect(7, y, 2, 1, '#8a7a5a');
    [[8, 10, -7, 4], [8, 10, 7, 4], [8, 9, -5, -2], [8, 9, 5, -2], [8, 9, 0, -8]].forEach(function (f) { p.line(f[0], f[1], f[0] + f[2], f[1] + f[3], '#3f8a4a', 2); });
    p.line(1, 14, 4, 12, '#2f6a3a'); p.line(15, 14, 12, 12, '#2f6a3a');
    [[6, 13], [9, 13], [7, 15], [10, 15], [8, 17]].forEach(function (n) { p.disc(n[0], n[1], 1.3, '#6ab04a'); });
  }
  function drawAirTerjun(p) {   // 80x80: a cliff with a waterfall falling into mist
    p.rect(0, 0, 80, 80, '#5a5a62'); p.speck(0, 0, 80, 80, '#4a4a52', 160); p.speck(0, 0, 80, 80, '#6a6a72', 90);
    p.ell(10, 8, 12, 6, '#3f7a4a'); p.ell(70, 6, 14, 6, '#3f7a4a'); p.speck(0, 0, 80, 14, '#5a9a5a', 30);
    p.rect(30, 6, 20, 70, '#9ad0e8'); p.rect(33, 6, 3, 70, '#e8f8ff'); p.rect(42, 6, 2, 70, '#c8ecf8'); p.rect(47, 6, 2, 70, '#78b8d8');
    for (var y = 10; y < 76; y += 7) { p.px(38, y, '#ffffff'); p.px(45, y + 3, '#ffffff'); }
    p.ell(40, 76, 26, 6, '#e8f4f8'); p.ell(40, 75, 18, 4, '#ffffff');
  }
  function drawAstaka(p) {   // 64x48: a garden pavilion of white wood with a gold tiered roof
    p.rect(6, 38, 52, 6, '#e8e0d0'); p.rect(6, 38, 52, 1, '#ffffff'); p.rect(6, 43, 52, 1, '#b8b0a0');
    [10, 24, 40, 54].forEach(function (x) { p.rect(x - 1, 20, 3, 18, '#f2ece0'); p.rect(x - 1, 20, 1, 18, '#ffffff'); p.rect(x - 2, 20, 5, 2, '#e9c46a'); });
    p.poly([[0, 22], [64, 22], [54, 12], [10, 12]], '#c4922f'); p.poly([[10, 13], [54, 13], [46, 5], [18, 5]], '#e9c46a'); p.poly([[20, 6], [44, 6], [36, 0], [28, 0]], '#c4922f');
    p.rect(0, 22, 64, 1, '#8a6420'); p.rect(10, 12, 44, 1, '#8a6420'); p.rect(18, 5, 28, 1, '#8a6420');
    p.px(32, 0, '#fff3b0'); p.px(2, 21, '#fff3b0'); p.px(61, 21, '#fff3b0');
    p.rect(20, 34, 24, 4, '#c8a0c8'); p.rect(20, 34, 24, 1, '#e0c0e0');   // a silk cushion
  }
  function drawBunga(p) {   // 16x20: the Bunga Ledang, glowing gold-white
    p.line(8, 19, 8, 9, '#3f8a4a', 1); p.ell(5, 15, 3, 1.4, '#4f9a4a'); p.ell(11, 13, 3, 1.4, '#4f9a4a');
    for (var a = 0; a < 6; a++) { var t = a / 6 * Math.PI * 2; p.ell(8 + Math.cos(t) * 3.4, 6 + Math.sin(t) * 3.4, 2.2, 2.2, a % 2 ? '#fff6d8' : '#ffe9a8'); }
    p.disc(8, 6, 1.8, '#f2c94c'); p.px(8, 6, '#ffffff');
    p.px(2, 3, '#fff3c0'); p.px(14, 2, '#fff3c0'); p.px(13, 9, '#fff3c0');
  }
  var IC = {
    diari_nenek: function (p) { p.rect(3, 2, 10, 13, '#6a3a2a'); p.rect(4, 3, 8, 11, '#8a4a32'); p.rect(12, 3, 1, 11, '#f0e8d0'); p.rect(6, 6, 4, 1, '#e9c46a'); p.px(8, 1, '#c8673a'); p.line(8, 1, 9, -1, '#4f8a3a'); },
    pinang_muda: function (p) { p.ell(8, 9, 5, 6, '#6ab04a'); p.ell(7, 8, 3, 4, '#8ad06a'); p.rect(7, 2, 2, 2, '#5a7a3a'); p.px(6, 6, '#c8f0a8'); },
    bunga_ledang: function (p) { for (var a = 0; a < 6; a++) { var t = a / 6 * Math.PI * 2; p.ell(8 + Math.cos(t) * 4, 8 + Math.sin(t) * 4, 2.6, 2.6, a % 2 ? '#fff6d8' : '#ffe9a8'); } p.disc(8, 8, 2.2, '#f2c94c'); p.px(8, 8, '#ffffff'); },
    selendang_puteri: function (p) { p.poly([[1, 4], [15, 2], [14, 7], [9, 9], [6, 15], [3, 14], [5, 8]], '#f2e8f8'); p.line(2, 5, 14, 3, '#e9c46a'); p.px(6, 14, '#e9c46a'); p.px(10, 6, '#d8c8f0'); p.px(7, 10, '#d8c8f0'); }
  };

  Art.generate13 = function (scene) {
    var make = Art.make, V = LC.VILLAGERS;
    for (var f = 0; f < 2; f++) (function (f) {
      ['hangtuah', 'jebat'].forEach(function (vid) { make(scene, 'pendekar_' + vid + '_' + f, 16, 20, function (p) { Art.drawVillager(p, V[vid].look, !!f); }); });
      if (Art.drawLampir) make(scene, 'lampir6_' + f, 20, 28, function (p) { Art.drawLampir(p, f); }, true);
    })(f);
    make(scene, 'pangkin_nenek', 32, 20, drawPangkin, true);
    make(scene, 'pokok_pinang', 16, 48, drawPinang, true);
    make(scene, 'air_terjun', 80, 80, drawAirTerjun, false);
    make(scene, 'astaka', 64, 48, drawAstaka, true);
    make(scene, 'bunga_ledang', 16, 20, drawBunga, true);
    Object.keys(IC).forEach(function (id) { make(scene, 'i_' + id, 16, 16, IC[id], true); });
    var a = scene.anims;
    [['pendekar_hangtuah_walk', 'pendekar_hangtuah', 6], ['pendekar_jebat_walk', 'pendekar_jebat', 7], ['lampir6_walk', 'lampir6', 4]].forEach(function (k) {
      if (!a.exists(k[0])) a.create({ key: k[0], frames: [{ key: k[1] + '_0' }, { key: k[1] + '_1' }], frameRate: k[2], repeat: -1 });
    });
  };
})(window.LC);
