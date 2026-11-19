/* Little Creature — procedural pixel art for Nek Lampir the helper (v2.4.1): her button (a grumpy old face under wild
 * white hair), the green circle of herbs, and the little pouch of pepper powder she throws. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art;
  var HUD = {
    ic_nek: function (p) {   // Nek Lampir: wild white hair, a cross frown, a hooked nose
      p.ell(6, 5, 5.6, 4.6, '#ecebe4'); p.px(0, 3, '#ecebe4'); p.px(11, 2, '#ecebe4'); p.px(1, 0, '#ecebe4'); p.px(10, 0, '#ecebe4');
      p.ell(6, 7, 3.6, 3.8, '#a88a6a'); p.ell(5.4, 6.4, 2.4, 2.4, '#b89a7a');
      p.line(3, 5, 5, 6, '#3a2a1e'); p.line(9, 5, 7, 6, '#3a2a1e');   // the frown
      p.px(4, 7, '#2a1a10'); p.px(8, 7, '#2a1a10');
      p.px(6, 8, '#8a6a4a'); p.px(6, 9, '#8a6a4a'); p.rect(5, 10, 3, 1, '#5a3a2a');
    },
    ic_bulatan: function (p) {   // the green circle of crushed herbs
      for (var a = 0; a < 24; a++) { var t = a / 24 * Math.PI * 2; p.px(Math.round(6 + Math.cos(t) * 5), Math.round(6 + Math.sin(t) * 4.4), a % 3 ? '#7ae06a' : '#c8ffb0'); }
      p.ell(6, 6, 3.4, 2.8, '#2f7a3a'); p.ell(4.6, 5.6, 1.6, 1, '#5ac85a'); p.ell(7.4, 6.6, 1.6, 1, '#4ab04a'); p.px(6, 4, '#c8ffb0');
    }
  };
  function drawPouch(p) {   // 7x8: a little cloth pouch of pepper, tied at the top, red dust puffing out
    p.ell(3.5, 5, 3, 2.6, '#c8a878'); p.ell(3, 4.6, 1.6, 1.4, '#e0c8a0'); p.rect(2, 1, 3, 2, '#c8a878'); p.rect(2, 2, 3, 1, '#7a4a2a');
    p.px(1, 0, '#e86a3a'); p.px(5, 0, '#f2904a'); p.px(3, 0, '#d84a2a');
  }

  Art.generate14 = function (scene) {
    var make = Art.make;
    Object.keys(HUD).forEach(function (k) { make(scene, k, 12, 12, HUD[k], true); });
    make(scene, 'serbuk_lada', 7, 8, drawPouch, true);
  };
})(window.LC);
