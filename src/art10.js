/* Little Creature — procedural pixel art for Chapter 3, part 2 (v2.1): Bilanapura (a towering spirit of sea foam and
 * storm cloud), the Castilian soldiers of 1578, a tall foreign ship, the brass meriam, flames, a silk-draped elephant,
 * Pelita's stone lamp, three families, and icons. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art;

  function drawJinn(p, f) {   // 40x44
    var D = '#33456e', M = '#46598a', L = '#6a80b4', F = '#e8f4f8', s = f ? 1 : 0;
    p.poly([[11, 28], [29, 28], [26, 36], [21, 43], [18, 39], [14, 34]], D);          // a whirling tail instead of legs
    p.poly([[14, 32], [24, 32], [21, 39], [19, 41]], M);
    [[12, 36], [26, 34], [20, 42], [9, 31], [30, 30]].forEach(function (c, i) { p.ell(c[0] + (i % 2 ? s : -s), c[1], 2.4, 1.3, F); });
    p.ell(20, 22, 12, 10, D); p.ell(19, 20, 9, 7, M); p.ell(17, 18, 4, 3, L);            // the storm-cloud body
    p.ell(6, 20 - s * 2, 4, 7, D); p.ell(34, 20 + s * 2, 4, 7, D);                      // great arms
    p.disc(5, 26 - s * 2, 3, M); p.disc(35, 26 + s * 2, 3, M);
    p.ell(20, 9, 7, 6.5, M); p.ell(19, 8, 4.5, 4, L);                                    // the head
    p.poly([[13, 6], [9, 0 + s], [15, 3]], F); p.poly([[27, 6], [31, 0 + s], [25, 3]], F);  // two crests of foam
    p.rect(15, 8, 4, 2, '#ffe066'); p.rect(22, 8, 4, 2, '#ffe066'); p.px(16, 8, '#fff8c0'); p.px(23, 8, '#fff8c0');
    p.rect(17, 13, 7, 1, '#1e2a48');
    p.speck(6, 12, 28, 18, F, 9);
  }
  function drawAskar(p, f) {   // 16x24: helmet, breastplate, puffed sleeves, a long pike
    var leg = f ? 1 : 0;
    p.rect(5, 18, 2, 5 - leg, '#3a3a4a'); p.rect(9, 18, 2, 4 + leg, '#3a3a4a');
    p.rect(4, 22 - leg, 3, 2, '#2a1e14'); p.rect(9, 21 + leg, 3, 2, '#2a1e14');
    p.rect(4, 11, 8, 7, '#a8322a'); p.rect(5, 11, 6, 5, '#b8bcc4'); p.rect(5, 11, 6, 1, '#dfe2e8');
    p.ell(3, 13, 1.8, 2.2, '#e9c46a'); p.ell(12, 13, 1.8, 2.2, '#e9c46a');
    p.rect(5, 7, 6, 4, '#e0b090'); p.px(6, 8, '#2a1e14'); p.px(9, 8, '#2a1e14'); p.rect(6, 10, 4, 1, '#5a3a1e');
    p.ell(8, 5, 4.6, 2.6, '#c8ccd4'); p.rect(2, 6, 12, 1, '#a8acb4'); p.rect(7, 1, 2, 3, '#c8ccd4'); p.px(6, 4, '#eef0f4');
    p.line(14, 3, 14, 22, '#6b4423'); p.rect(13, 0, 3, 3, '#c8ccd4');
  }
  function drawShip(p) {   // 80x64: a tall foreign ship with three masts
    p.rect(0, 59, 80, 1, 'rgba(220,240,255,0.55)'); for (var x = 3; x < 80; x += 8) p.px(x, 61, 'rgba(220,240,255,0.5)');
    p.poly([[4, 44], [76, 44], [68, 58], [12, 58]], '#6b3f1e'); p.rect(10, 48, 62, 2, '#8a5a2b'); p.rect(14, 53, 52, 1, '#4e3018');
    p.rect(56, 34, 18, 11, '#7a4a24'); p.rect(56, 34, 18, 1, '#a8743e'); [59, 64, 69].forEach(function (x) { p.rect(x, 37, 3, 3, '#2a1a10'); });
    p.rect(4, 38, 12, 7, '#7a4a24'); p.rect(4, 38, 12, 1, '#a8743e');
    [20, 30, 40, 50].forEach(function (x) { p.disc(x, 51, 1.3, '#2a1a10'); });
    [[24, 6, 39], [42, 2, 43], [62, 12, 23]].forEach(function (m) { p.rect(m[0], m[1], 2, m[2], '#4e3018'); });
    [[15, 10, 20, 13], [33, 6, 20, 15], [54, 15, 17, 11]].forEach(function (s) {
      p.rect(s[0], s[1], s[2], s[3], '#f2ead8'); p.rect(s[0], s[1] + s[3] - 2, s[2], 2, '#d8ccb0'); p.rect(s[0], s[1], s[2], 1, '#c8b890');
    });
    p.rect(26, 2, 5, 2, '#b8322a'); p.rect(44, 0, 6, 2, '#e9c46a'); p.rect(64, 9, 4, 2, '#b8322a');
    p.line(4, 38, 0, 30, '#4e3018');
  }
  function drawMeriam(p) {   // 16x18: a brass cannon on a wooden carriage, pointing at the river
    p.rect(1, 3, 14, 6, '#6b4423'); p.rect(1, 3, 14, 1, '#8a5a2b');
    p.disc(2, 9, 2.4, '#4e3018'); p.disc(13, 9, 2.4, '#4e3018'); p.px(2, 9, '#8a5a2b'); p.px(13, 9, '#8a5a2b');
    p.rect(5, 1, 6, 13, '#c8902a'); p.rect(5, 1, 2, 13, '#f2c860'); p.rect(4, 13, 8, 3, '#a87020'); p.rect(6, 14, 4, 2, '#2a1a10');
    p.rect(5, 5, 6, 1, '#a87020'); p.rect(5, 9, 6, 1, '#a87020');
  }
  function drawFire(p, f) {   // 16x20
    var s = f ? 1 : -1;
    p.poly([[2, 19], [14, 19], [13, 10], [10 + s, 2], [8, 8], [5 - s, 3], [3, 11]], '#e0582a');
    p.poly([[4, 19], [12, 19], [11, 12], [9 + s, 6], [7, 11], [5, 8]], '#ff9a3a');
    p.poly([[6, 19], [10, 19], [9, 14], [8, 11 + f], [7, 15]], '#ffe066');
  }
  function drawGajah(p) {   // 36x28: an elephant dressed in silk
    var G = '#8a8a92', G2 = '#74747c';
    [7, 12, 21, 26].forEach(function (x, i) { p.rect(x, 19, 4, 8, i % 2 ? G2 : G); p.rect(x, 26, 4, 1, '#5a5a62'); });
    p.ell(17, 15, 13, 8, G); p.ell(16, 12, 9, 4, '#9a9aa2');
    p.ell(29, 11, 6, 6, G); p.ell(26, 11, 4, 5.4, G2);
    p.line(33, 13, 34, 20, G, 2); p.line(34, 20, 32, 24, G, 2);
    p.line(31, 15, 34, 17, '#f2ead8'); p.px(31, 9, '#1a1a1a');
    p.rect(9, 6, 15, 10, '#b8322a'); p.rect(9, 6, 15, 1, '#e9c46a'); p.rect(9, 15, 15, 1, '#e9c46a');
    for (var x = 10; x < 24; x += 2) p.px(x, 16, '#e9c46a');
    p.rect(14, 8, 5, 5, '#e9c46a'); p.rect(15, 9, 3, 3, '#b8322a');
    p.line(4, 14, 2, 19, G2);
  }
  function drawLamp(p) {   // 14x24: Pelita's old stone lamp
    p.rect(2, 21, 10, 3, '#7a7680'); p.rect(3, 20, 8, 1, '#8e8a94');
    p.rect(4, 9, 6, 11, '#8e8a94'); p.rect(4, 9, 2, 11, '#a8a4ae');
    p.rect(3, 7, 8, 2, '#a8a4ae');
    p.rect(5, 2, 4, 5, '#ffe08a'); p.rect(6, 3, 2, 3, '#fffbe0'); p.rect(4, 2, 1, 5, '#8e8a94'); p.rect(9, 2, 1, 5, '#8e8a94');
    p.poly([[2, 2], [12, 2], [7, -2]], '#7a7680');
    p.speck(4, 10, 6, 10, '#6aa84f', 2);
  }
  var FAMILY = [
    { skin: '#b9825a', shirt: '#2a7a6a', shirt2: '#1e5a4e', bottom: '#7a1e3a', bottom2: '#5a1428', hair: '#1a1210', hat: 'tudung', hatColor: '#e9c46a' },
    { skin: '#a8714a', shirt: '#e9e4d8', shirt2: '#c8c2b4', bottom: '#3a3a5a', bottom2: '#2a2a40', hair: '#d8d4cc', hat: 'none', beard: '#d8d4cc' },
    { skin: '#c9905e', shirt: '#e07a5f', shirt2: '#b85a40', bottom: '#5a4a8a', bottom2: '#40346a', hair: '#1a1210', hat: 'bun' }
  ];
  var IC = {
    kulit_ikan: function (p) {
      p.poly([[1, 8], [5, 4], [11, 4], [13, 7], [15, 4], [15, 12], [13, 9], [11, 12], [5, 12]], '#7ab8c8');
      for (var x = 4; x < 12; x += 2) { p.px(x, 6, '#b8e8f2'); p.px(x + 1, 8, '#4a8a9a'); p.px(x, 10, '#b8e8f2'); }
      p.px(3, 7, '#1a2a30');
    },
    catatan_antonio: function (p) {
      p.rect(2, 2, 11, 13, '#f2e6c8'); p.rect(2, 2, 11, 1, '#d8c8a0'); p.rect(2, 14, 11, 1, '#c8b890');
      [5, 7, 9, 11].forEach(function (y) { p.line(4, y, 11, y, '#8a7a6a'); });
      p.line(10, 0, 15, 7, '#e8e8f0'); p.line(11, 0, 15, 5, '#c8c8d8'); p.px(10, 1, '#2a2a3a');
    },
    lantaka: function (p) {
      p.rect(1, 6, 12, 4, '#c8902a'); p.rect(1, 6, 12, 1, '#f2c860'); p.rect(12, 5, 3, 6, '#a87020'); p.rect(14, 7, 1, 2, '#2a1a10');
      p.rect(4, 6, 1, 4, '#a87020'); p.rect(8, 6, 1, 4, '#a87020');
      p.rect(2, 10, 10, 2, '#6b4423'); p.disc(4, 13, 2, '#4e3018'); p.disc(10, 13, 2, '#4e3018');
    }
  };

  Art.generate10 = function (scene) {
    var make = Art.make;
    for (var f = 0; f < 2; f++) (function (f) {
      make(scene, 'bilanapura_' + f, 40, 44, function (p) { drawJinn(p, f); }, true);
      make(scene, 'askar_' + f, 16, 24, function (p) { drawAskar(p, f); }, true);
      make(scene, 'api_' + f, 16, 20, function (p) { drawFire(p, f); });
    })(f);
    make(scene, 'kapal_layar', 80, 64, drawShip, true);
    make(scene, 'meriam', 16, 18, drawMeriam, true);
    make(scene, 'gajah', 36, 28, drawGajah, true);
    make(scene, 'pelita_batu', 14, 24, drawLamp, true);
    FAMILY.forEach(function (L, i) { make(scene, 'kel' + i + '_0', 16, 20, function (p) { Art.drawVillager(p, L, false); }); });
    Object.keys(IC).forEach(function (id) { make(scene, 'i_' + id, 16, 16, IC[id], true); });
    var a = scene.anims;
    [['bilanapura_walk', 'bilanapura', 4], ['askar_walk', 'askar', 6], ['api_burn', 'api', 7]].forEach(function (k) {
      if (!a.exists(k[0])) a.create({ key: k[0], frames: [{ key: k[1] + '_0' }, { key: k[1] + '_1' }], frameRate: k[2], repeat: -1 });
    });
  };
})(window.LC);
