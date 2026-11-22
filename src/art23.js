/* Little Creature — art, part 23 (v3.4): Chapter 11 Part 2, 1578. A galleon seen from above, Barunai's perahu with
 * yellow sails, the anchor rope (whole and cut), the flagship's deck (mast, barrels, crates, the hatch, its cannons),
 * the Capitán (a morion helmet, a red doublet and a rapier he never gets to use), the allies who swing across (a Barunai
 * warrior and a Tausug fighter) and the Kalis Sulu. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art, OUT = '#2a1a10', WOOD = '#8a5a2b', WOODD = '#5a3a1e', WOODL = '#a8743e';

  function drawGaleon(p) {   // 88 x 40, bow to the right
    p.ell(44, 21, 42, 14, 'rgba(10,30,60,0.35)');
    p.poly([[6, 12], [70, 9], [86, 20], [70, 31], [6, 28], [2, 20]], '#4a2e1a');
    p.poly([[9, 14], [68, 11.5], [80, 20], [68, 28.5], [9, 26], [6, 20]], '#7a5232');
    for (var x = 12; x < 66; x += 6) p.line(x, 13, x, 27, '#6a4428');                      // deck planks
    p.rect(4, 15, 12, 10, '#5a3a22'); p.rect(5, 16, 10, 8, '#8a6040');                       // the stern castle
    [22, 40, 58].forEach(function (mx, i) {                                                  // three masts, sails seen from above
      var w = i === 1 ? 7 : 6, h = i === 1 ? 30 : 26;
      p.rect(mx - w / 2, 20 - h / 2, w, h, '#f2ece0'); p.rect(mx - w / 2, 20 - h / 2, w, 2, '#d8d0c0'); p.rect(mx - w / 2 + w - 1, 20 - h / 2, 1, h, '#c8c0b0');
      p.rect(mx - 1, 20 - h / 2 - 2, 2, h + 4, WOODD);
    });
    p.line(70, 20, 87, 20, WOODD, 2);                                                        // the bowsprit
    [[22, 4], [40, 2], [58, 6]].forEach(function (f) { p.rect(f[0] - 1, f[1], 6, 3, '#c8323a'); p.rect(f[0] - 1, f[1] + 1, 6, 1, '#f2c94c'); });   // pennants
    [[10, 12], [10, 28], [76, 20]].forEach(function (l) { p.disc(l[0], l[1], 1.5, '#ffd070'); });   // lanterns
    p.outline('#1a1008');
  }
  function drawPerahuTop(p, f) {   // Barunai's perahu from above: like the vinta, with yellow and white sails (56 x 32)
    p.rect(10, 4, 36, 3, '#e0d0a0'); p.rect(10, 25, 36, 3, '#e0d0a0');
    [16, 28, 40].forEach(function (x) { p.rect(x, 5, 2, 22, '#c8b070'); });
    p.poly([[6, 13], [44, 12], [54, 16], [44, 20], [6, 19]], '#4a2e1a'); p.poly([[9, 14], [43, 13.5], [50, 16], [43, 18.5], [9, 18]], '#7a4a28');
    var b = f ? 1 : 0;
    p.poly([[16, 16], [40, 16], [34, 6 - b], [22, 5 + b]], '#f6ecc8');
    for (var i = 0; i < 4; i++) if (i % 2 === 0) p.poly([[17 + i * 6, 16], [21 + i * 6, 16], [21 + i * 5.2, 6 - b], [18 + i * 5.2, 6 - b]], '#f2c430');
    p.line(16, 16, 40, 16, WOODD);
    p.poly([[6, 15], [2, 13 - f], [3, 16]], '#f2c430');
    p.outline(OUT);
  }
  function drawTali(p, cut) {   // an anchor rope down to its anchor (16 x 64), or what is left of it
    if (cut) { p.line(8, 0, 9, 14, '#c8b080', 2); p.line(9, 14, 6, 18, '#c8b080'); p.line(9, 14, 11, 19, '#c8b080'); return; }
    for (var y = 0; y < 50; y++) p.px(7 + Math.round(Math.sin(y / 6) * 1.2), y, y % 3 ? '#c8b080' : '#a89060'), p.px(8 + Math.round(Math.sin(y / 6) * 1.2), y, '#b8a070');
    p.rect(7, 48, 3, 10, '#4a4a52'); p.rect(3, 50, 11, 2, '#4a4a52');                       // the iron anchor
    p.poly([[1, 56], [8, 63], [4, 56]], '#4a4a52'); p.poly([[15, 56], [8, 63], [12, 56]], '#4a4a52'); p.rect(6, 58, 5, 3, '#5a5a62');
    p.disc(8, 47, 2, '#5a5a62');
    p.outline('#14202a');
  }
  function drawTiang(p) {   // a mast with its sail furled on the yard (24 x 96)
    p.ell(12, 94, 8, 2, 'rgba(30,20,10,0.3)');
    p.rect(10, 4, 4, 90, WOODD); p.rect(10, 4, 1, 90, WOOD);
    [20, 52].forEach(function (y) { p.rect(0, y, 24, 3, WOODD); p.ell(12, y + 4, 12, 3, '#e8e0cc'); p.rect(1, y + 3, 22, 2, '#d8d0bc'); });
    p.rect(7, 2, 10, 4, WOOD); p.poly([[12, 0], [20, 2], [12, 4]], '#c8323a');
    p.line(0, 22, 11, 94, 'rgba(60,40,20,0.7)'); p.line(23, 22, 13, 94, 'rgba(60,40,20,0.7)');   // rigging
    p.outline(OUT);
  }
  function drawTong(p) { p.ell(7, 14, 6, 2, 'rgba(30,20,10,0.3)'); p.rect(2, 2, 10, 12, '#8a5a2b'); p.rect(2, 4, 10, 1, '#4a4a52'); p.rect(2, 11, 10, 1, '#4a4a52'); p.ell(7, 2, 5, 1.6, '#a8743e'); p.rect(4, 3, 1, 10, '#a8743e'); p.outline(OUT); }
  function drawPeti(p) { p.ell(8, 13, 7, 2, 'rgba(30,20,10,0.3)'); p.rect(1, 3, 14, 10, '#9a6a36'); p.rect(1, 3, 14, 2, '#b8844a'); p.line(1, 5, 15, 12, '#7a5028'); p.line(15, 5, 1, 12, '#7a5028'); p.rect(6, 6, 4, 3, '#e9c46a'); p.outline(OUT); }
  function drawPalka(p) { p.rect(0, 2, 32, 12, '#5a3a1e'); for (var x = 2; x < 31; x += 4) p.rect(x, 3, 2, 10, '#2a1a10'); for (var y = 4; y < 13; y += 3) p.rect(1, y, 30, 1, '#7a5030'); p.outline(OUT); }
  function drawMeriam(p) { p.ell(8, 13, 7, 2, 'rgba(30,20,10,0.3)'); p.rect(2, 9, 12, 4, '#6a4428'); p.disc(4, 12, 2, '#3a2a1a'); p.disc(12, 12, 2, '#3a2a1a'); p.rect(3, 5, 12, 4, '#3a3a42'); p.rect(3, 5, 12, 1, '#6a6a72'); p.disc(15, 7, 2, '#2a2a32'); p.outline(OUT); }
  function drawKapten(p, f) {   // the Capitán (20 x 26)
    var y = f ? 1 : 0;
    p.ell(10, 25, 7, 1.6, 'rgba(20,14,10,0.35)');
    p.rect(6, 19, 3, 6 - y, '#1e1a1a'); p.rect(11, 19, 3, 5 + y, '#1e1a1a');                // legs and boots
    p.rect(5, 10, 10, 10, '#a82a2a'); p.rect(6, 11, 8, 6, '#9a9aa8'); p.rect(6, 11, 8, 1, '#c8c8d4');   // red doublet, breastplate
    p.rect(5, 17, 10, 2, '#e9c46a');                                                         // a gold sash
    p.rect(7, 9, 6, 2, '#f2ece0');                                                           // the white collar
    p.ell(10, 6, 3.4, 3.4, '#e0b08a'); p.rect(7, 7, 6, 2, '#3a2418'); p.px(8, 5, '#2a1a10'); p.px(12, 5, '#2a1a10');   // face and beard
    p.poly([[4, 4], [16, 4], [13, 1], [7, 1]], '#b8b8c4'); p.poly([[9, 1], [11, 1], [10, -2]], '#d8d8e4'); p.rect(3, 4, 14, 1, '#d8d8e4');   // the morion
    p.line(15, 12, 19, 22, '#d8d8e4'); p.rect(14, 12, 2, 2, '#e9c46a');                       // the rapier
    p.rect(3, 11, 2, 6, '#a82a2a');
    p.outline(OUT);
  }
  Art.generate23 = function (scene) {
    var make = Art.make, dv = Art.drawVillager;
    make(scene, 'galeon11_t', 88, 40, drawGaleon);
    make(scene, 'vintab11_t0', 56, 32, function (p) { drawPerahuTop(p, 0); });
    make(scene, 'vintab11_t1', 56, 32, function (p) { drawPerahuTop(p, 1); });
    make(scene, 'tali11', 16, 64, function (p) { drawTali(p, false); });
    make(scene, 'tali11_cut', 16, 20, function (p) { drawTali(p, true); });
    make(scene, 'tiang11', 24, 96, drawTiang);
    make(scene, 'tong11', 14, 16, drawTong);
    make(scene, 'peti11', 16, 14, drawPeti);
    make(scene, 'palka11', 32, 16, drawPalka);
    make(scene, 'meriam11', 16, 16, drawMeriam);
    make(scene, 'kapten11_0', 20, 26, function (p) { drawKapten(p, 0); });
    make(scene, 'kapten11_1', 20, 26, function (p) { drawKapten(p, 1); });
    function person(key, L) { make(scene, key, 16, 24, function (p) { p.ctx.save(); p.ctx.translate(0, 4); dv(p, L, false); p.ctx.restore(); }); }
    person('npc11_barunai', { skin: '#9a6440', shirt: '#e9c46a', shirt2: '#c4922f', bottom: '#2a2a2a', bottom2: '#1a1a1a', hair: '#1a1210', hat: 'tanjak_gold' });
    person('npc11_tausug', { skin: '#8a5634', shirt: '#2a6a4a', shirt2: '#1e5038', bottom: '#8a1e2a', bottom2: '#6a141e', hair: '#1a1210', hat: 'headband', beard: '#1a1210' });
    make(scene, 'i_kalis', 16, 16, function (p) {
      for (var i = 0; i < 11; i++) { var x = 3 + i, y = 12 - i + Math.round(Math.sin(i * 1.1) * 1); p.px(x, y, '#d8dce8'); p.px(x + 1, y, '#a8acb8'); }
      p.rect(1, 12, 4, 2, '#8a5a2b'); p.rect(0, 13, 2, 3, '#e9c46a'); p.px(5, 11, '#e9c46a');
    }, true);
    var a = scene.anims;
    if (!a.exists('kapten11_walk')) a.create({ key: 'kapten11_walk', frames: [{ key: 'kapten11_0' }, { key: 'kapten11_1' }], frameRate: 5, repeat: -1 });
  };
})(window.LC);
