/* Little Creature — procedural pixel art for Chapter 4 (v2.2): the soldiers of the Majapahit fleet, Laksamana Kebo
 * Taruna, Tukang Leong's bamboo stockade, and icons (the Keris Majapahit, a terracotta celengan, batik cloth). */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art;

  function drawPrajurit(p, f) {   // 16x24: headcloth, a red-and-white sash, a round wooden shield and a spear
    var leg = f ? 1 : 0, SK = '#a8714a';
    p.rect(5, 18, 2, 5 - leg, SK); p.rect(9, 18, 2, 4 + leg, SK);
    p.rect(4, 15, 8, 5, '#f2ead8'); p.rect(4, 19, 8, 1, '#b8322a'); p.px(6, 17, '#b8322a'); p.px(9, 16, '#b8322a');
    p.rect(5, 10, 6, 6, SK); p.line(5, 10, 10, 15, '#b8322a'); p.line(6, 10, 11, 15, '#f2ead8');
    p.rect(5, 5, 6, 5, SK); p.px(6, 7, '#1a1210'); p.px(9, 7, '#1a1210'); p.rect(7, 9, 2, 1, '#7a4a2a');
    p.rect(4, 3, 8, 3, '#7a1e1a'); p.rect(4, 3, 8, 1, '#a8322a'); p.px(12, 4, '#7a1e1a');
    p.disc(3, 13, 3, '#8a5a2b'); p.disc(3, 13, 1.3, '#e9c46a');
    p.line(13, 1, 13, 22, '#6b4423'); p.poly([[12, 2], [14, 2], [13, -1]], '#c8ccd4');
  }
  function drawLaksamana(p, f) {   // 20x28: a golden headdress, armlets, a red and gold kain, a cape
    var leg = f ? 1 : 0, SK = '#9a6440', G = '#e9c46a', G2 = '#c4922f';
    p.poly([[3, 11], [17, 11], [18, 25], [2, 25]], '#5a1414');                 // the cape
    p.rect(6, 21, 3, 6 - leg, SK); p.rect(11, 21, 3, 5 + leg, SK);
    p.rect(5, 17, 10, 6, '#b8322a'); p.rect(5, 17, 10, 1, G); p.rect(5, 22, 10, 1, G); p.px(8, 19, G); p.px(12, 20, G);
    p.rect(6, 11, 8, 7, SK); p.rect(6, 16, 8, 1, G2);
    p.rect(4, 12, 2, 5, SK); p.rect(14, 12, 2, 5, SK); p.rect(4, 13, 2, 1, G); p.rect(14, 13, 2, 1, G);
    p.line(13, 17, 16, 21, '#5a3a1e'); p.rect(12, 16, 2, 2, G);                 // a kris at his belt
    p.rect(7, 5, 6, 6, SK); p.px(8, 7, '#1a1210'); p.px(11, 7, '#1a1210'); p.rect(8, 9, 4, 1, '#3a2010'); p.rect(7, 10, 6, 1, '#2a1a10');
    p.rect(6, 3, 8, 2, G); p.poly([[6, 3], [8, 0], [10, 3]], G); p.poly([[10, 3], [12, 0], [14, 3]], G); p.px(10, 2, '#b8322a'); p.rect(6, 4, 8, 1, G2);
  }
  function drawPagar(p) {   // 48x16: sharpened bamboo poles lashed with rattan
    for (var x = 1; x < 48; x += 4) {
      p.rect(x, 3, 3, 13, '#a8b04a'); p.rect(x, 3, 1, 13, '#c8d06a'); p.poly([[x, 3], [x + 3, 3], [x + 1.5, 0]], '#8a9a3a');
      p.rect(x, 8, 3, 1, '#7a8a2a');
    }
    p.rect(0, 6, 48, 1, '#8a5a2b'); p.rect(0, 11, 48, 1, '#8a5a2b');
  }
  var IC = {
    keris_majapahit: function (p) {
      p.line(3, 13, 5, 11, '#e9c46a', 2); p.rect(4, 10, 3, 2, '#c4922f');
      var pts = [[6, 10], [8, 9], [8, 7], [10, 6], [10, 4], [12, 3], [13, 1]];
      for (var i = 0; i < pts.length - 1; i++) p.line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], '#c8ccd4', 2);
      p.px(13, 1, '#ffffff'); p.px(5, 12, '#b8322a');
    },
    celengan: function (p) {
      p.ell(8, 9, 6, 4.5, '#c8673a'); p.ell(7, 8, 3.5, 2.4, '#e08a5a');
      p.disc(13, 8, 2.2, '#c8673a'); p.px(14, 8, '#7a3a1e'); p.px(12, 6, '#1a1210');
      p.rect(4, 12, 2, 3, '#a8502a'); p.rect(10, 12, 2, 3, '#a8502a'); p.rect(6, 4, 4, 1, '#5a2a14'); p.px(2, 8, '#a8502a');
    },
    kain_batik: function (p) {
      p.rect(2, 4, 12, 9, '#3a2a6a'); p.rect(2, 4, 12, 1, '#5a4a8a'); p.rect(2, 12, 12, 1, '#2a1e4a');
      for (var y = 6; y < 12; y += 3) for (var x = 4; x < 13; x += 3) { p.disc(x, y, 1, '#e9c46a'); p.px(x, y, '#3a2a6a'); }
    }
  };

  Art.generate11 = function (scene) {
    var make = Art.make;
    for (var f = 0; f < 2; f++) (function (f) {
      make(scene, 'prajurit_' + f, 16, 24, function (p) { drawPrajurit(p, f); }, true);
      make(scene, 'laksamana_' + f, 20, 28, function (p) { drawLaksamana(p, f); }, true);
    })(f);
    make(scene, 'pagar_buluh', 48, 16, drawPagar, true);
    Object.keys(IC).forEach(function (id) { make(scene, 'i_' + id, 16, 16, IC[id], true); });
    var a = scene.anims;
    [['prajurit_walk', 'prajurit', 6], ['laksamana_walk', 'laksamana', 5]].forEach(function (k) {
      if (!a.exists(k[0])) a.create({ key: k[0], frames: [{ key: k[1] + '_0' }, { key: k[1] + '_1' }], frameRate: k[2], repeat: -1 });
    });
  };
})(window.LC);
