/* Little Creature — procedural pixel art for Chapter 2, Barunai (v1.9): houses on stilts over the water, the Balai,
 * the brothers' camp, hoofprints and feathers for the trails, the tembadau (wild ox), the pinggai bird on its post,
 * the magic tempayan, and the new icons. (The brothers and the princess are villager sprites from art2.js.) */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art, WOOD = '#6b4423', WOOD2 = '#4e3018', WALL = '#b8834a', WALL2 = '#9a6a38';

  function stilts(p, xs, top, bottom) {
    xs.forEach(function (x) { p.rect(x, top, 3, bottom - top, WOOD); p.rect(x + 2, top, 1, bottom - top, WOOD2); });
    p.rect(0, bottom - 3, p.w, 1, 'rgba(220,240,255,0.55)');   // the waterline
    for (var x = 2; x < p.w; x += 7) p.px(x, bottom - 1, 'rgba(220,240,255,0.5)');
  }
  function thatch(p, x0, x1, top, bottom, c, c2) {
    for (var y = top; y <= bottom; y++) {
      var half = Math.round((y - top) / (bottom - top) * ((x1 - x0) / 2 + 3)), cx = (x0 + x1) / 2;
      for (var x = Math.round(cx - half); x < Math.round(cx + half); x++) p.px(x, y, (y % 3 === 0) ? c2 : c);
    }
    p.line(cx - half, bottom, cx + half, bottom, '#4a2e18');
  }
  function drawRumahAir(p, alt) {   // 48x48 a house on stilts above the river
    stilts(p, [5, 21, 39], 30, 48);
    p.rect(1, 28, 46, 4, '#5e3a1e'); p.rect(1, 28, 46, 1, '#7a4f2b');                   // the veranda floor
    p.rect(4, 14, 40, 14, alt ? '#c99a5e' : WALL);
    for (var x = 5; x < 44; x += 3) p.rect(x, 14, 1, 14, alt ? '#a8784a' : WALL2);
    p.rect(9, 17, 8, 7, '#5a3720'); p.rect(10, 18, 6, 5, '#2a1a10'); p.rect(12, 18, 2, 5, '#5a3720');   // window
    p.rect(28, 16, 9, 12, '#5a3720'); p.rect(29, 17, 7, 11, '#7a4b28'); p.px(34, 22, '#d9a73a');      // door
    thatch(p, 2, 46, 1, 15, alt ? '#7a7a3d' : '#8b6b3d', alt ? '#5a5a2a' : '#6d522c');
    p.rect(1, 25, 2, 6, '#7a4f2b'); p.rect(45, 25, 2, 6, '#7a4f2b');
    if (alt) { p.line(6, 26, 20, 26, '#e8e0d0'); p.rect(8, 27, 3, 2, '#c8323a'); p.rect(14, 27, 3, 2, '#3a7ab8'); }   // washing on the line
    else { p.rect(40, 24, 3, 4, '#d9a73a'); p.disc(41, 23, 2, '#e9c46a'); }   // a brass gong
  }
  function drawBalai(p) {   // 80x48 the great hall, with a two-tiered roof
    [6, 22, 38, 54, 70].forEach(function (x) { p.rect(x, 36, 4, 12, WOOD); p.rect(x + 3, 36, 1, 12, WOOD2); });
    p.rect(2, 34, 76, 4, '#5e3a1e'); p.rect(2, 34, 76, 1, '#7a4f2b');
    p.rect(6, 22, 68, 12, WALL); for (var x = 7; x < 74; x += 4) p.rect(x, 22, 1, 12, WALL2);
    [14, 30, 46, 60].forEach(function (x) { p.rect(x, 25, 7, 6, '#2a1a10'); p.rect(x, 25, 7, 1, '#d9a73a'); });
    p.rect(34, 38, 12, 10, '#7a4b28'); for (var y = 39; y < 48; y += 3) p.rect(34, y, 12, 1, '#5a3720');   // steps
    thatch(p, 2, 78, 10, 23, '#8b6b3d', '#6d522c');
    thatch(p, 18, 62, 0, 11, '#9a7a45', '#6d522c');
    p.rect(37, 0, 6, 2, '#e9c46a'); p.line(18, 11, 2, 23, '#e9c46a'); p.line(62, 11, 78, 23, '#e9c46a');   // golden trims
    p.rect(8, 34, 64, 1, '#c8323a');
  }
  function drawKhemah(p) {   // 48x32 the brothers' camp: a nipah lean-to and the fire
    p.poly([[2, 28], [6, 6], [30, 2], [34, 26]], '#7a8a3a'); p.poly([[6, 26], [9, 9], [28, 5], [31, 24]], '#8a9a4a');
    for (var y = 6; y < 26; y += 3) p.line(8, y + 1, 30, y - 2, '#5a6a2a');
    p.rect(4, 26, 30, 2, '#5a3a1e'); p.rect(10, 22, 14, 4, '#c8a46a'); p.rect(10, 22, 14, 1, '#c8323a');   // a mat
    p.ell(41, 27, 6, 2.6, '#5a5a5a'); p.ell(41, 26, 4, 1.6, '#3a2a1a');
    p.line(37, 26, 45, 24, '#6b4423'); p.line(37, 24, 45, 26, '#6b4423');
    p.ell(41, 21, 3, 4.6, '#ff8a3a'); p.ell(41, 22, 1.8, 2.6, '#ffd166'); p.px(41, 19, '#fff4c0');
  }
  function drawJejak(p) {   // 14x10 two cloven hoofprints
    [[3, 6], [10, 3]].forEach(function (h) { p.ell(h[0] - 1, h[1], 1.2, 2, '#5a3a20'); p.ell(h[0] + 1.5, h[1], 1.2, 2, '#5a3a20'); });
  }
  function drawBulu(p) {   // 10x10 a shimmering feather
    p.line(1, 9, 8, 1, '#e8e0d0'); p.line(2, 7, 7, 1, '#8fd3ff'); p.line(3, 8, 8, 3, '#8fd3ff'); p.px(8, 1, '#ffd166'); p.px(7, 2, '#ffd166');
  }
  function drawTembadau(p, f) {   // 30x20 a wild ox: dark coat, white stockings and rump, curved horns
    var B = '#3a2a22', B2 = '#4e3a2e', W = '#f0e8d8';
    (f ? [6, 9, 19, 22] : [7, 8, 20, 21]).forEach(function (x) { p.rect(x, 13, 2, 5, B); p.rect(x, 16, 2, 2, W); });
    p.ell(14, 10, 10, 5, B); p.ell(13, 9, 8, 3, B2); p.ell(5, 10, 3, 3.6, W);   // white rump
    p.ell(25, 9, 3.6, 3.2, B); p.rect(26, 10, 3, 3, '#5a4a40');                    // head and muzzle
    p.line(23, 6, 21, 3, '#d8d0c0'); p.line(21, 3, 23, 1, '#d8d0c0'); p.line(27, 6, 29, 3, '#d8d0c0'); p.line(29, 3, 27, 1, '#d8d0c0');   // horns
    p.px(26, 8, '#1a120c'); p.px(3, 9, B); p.px(2, 11, B);
    p.outline('#1a120c');
  }
  function drawPinggai(p, f) {   // 16x20 the pinggai bird on a mooring post
    p.rect(6, 10, 4, 10, WOOD); p.rect(9, 10, 1, 10, WOOD2); p.rect(5, 9, 6, 2, '#7a4f2b');
    p.ell(8, 6, 3.4, 2.6, '#3ab0a0'); p.disc(10, 4, 2, '#3ab0a0'); p.px(11, 3, '#1a120c'); p.px(12, 4, '#ffd166');
    p.line(5, 6, 1, 9 - f, '#2a8a9a'); p.line(5, 7, 1, 10 - f, '#8fd3ff'); p.px(9, 1 + f, '#ffd166'); p.px(10, 1, '#ffd166');   // tail and crest
    p.ell(7, 6, 1.6, 1.2, '#e9c46a');
  }
  function drawVase(p) {   // 26x30 the magic tempayan, glowing in the river
    p.ell(13, 17, 11, 11, '#3a2a3a'); p.ell(11, 14, 5, 6, '#5a4a6a'); p.rect(8, 3, 10, 4, '#3a2a3a'); p.rect(7, 2, 12, 2, '#5a4a5a');
    p.line(4, 16, 22, 16, '#e9c46a'); p.line(5, 20, 21, 20, '#e9c46a');
    for (var x = 6; x < 21; x += 4) { p.px(x, 18, '#ffd166'); p.px(x + 2, 17, '#ffd166'); }   // a golden wave pattern
    p.ell(13, 27, 12, 2.4, 'rgba(200,240,255,0.6)');
  }
  var IC = {
    kain_tenun: function (p) { p.rect(2, 4, 12, 9, '#7a1e3a'); p.rect(2, 4, 12, 2, '#a83a5a'); for (var x = 3; x < 14; x += 3) { p.px(x, 8, '#e9c46a'); p.px(x + 1, 10, '#e9c46a'); } p.rect(2, 12, 12, 1, '#e9c46a'); },
    tembaga: function (p) { p.ell(8, 10, 5, 4.6, '#c8902a'); p.ell(6.5, 8.5, 2, 2, '#f2c860'); p.rect(6, 3, 4, 3, '#a87020'); p.line(13, 8, 15, 5, '#a87020'); p.line(3, 8, 1, 10, '#a87020'); },
    ambuyat: function (p) { p.ell(8, 11, 7, 3.4, '#e8e0d0'); p.ell(8, 10, 5.6, 2.2, '#d8d0b8'); p.line(10, 2, 9, 9, '#c8a46a'); p.line(12, 2, 10, 9, '#c8a46a'); p.ell(4, 13, 2, 1, '#c84a2a'); },
    kelupis: function (p) { p.ell(8, 9, 5.4, 4, '#4f9a3a'); p.line(3, 9, 13, 9, '#3a7a2c'); p.line(5, 6, 11, 12, '#3a7a2c'); p.rect(6, 4, 4, 1, '#c8a46a'); p.rect(6, 13, 4, 1, '#c8a46a'); }
  };
  var HUD = {
    ic_langkah: function (p) {   // two big footprints and motion lines
      p.ell(4, 7, 2, 3, '#e9c46a'); p.disc(4, 3, 1, '#e9c46a'); p.ell(9, 5, 2, 3, '#ffd166'); p.disc(9, 1.4, 1, '#ffd166');
      p.line(0, 10, 2, 10, '#8fd3ff'); p.line(0, 8, 1, 8, '#8fd3ff');
    }
  };

  Art.generate8 = function (scene) {
    var make = Art.make;
    make(scene, 'rumah_air', 48, 48, function (p) { drawRumahAir(p, false); }, true);
    make(scene, 'rumah_air2', 48, 48, function (p) { drawRumahAir(p, true); }, true);
    make(scene, 'balai', 80, 48, drawBalai, true);
    make(scene, 'khemah', 48, 32, drawKhemah, true);
    make(scene, 'jejak', 14, 10, drawJejak);
    make(scene, 'bulu', 10, 10, drawBulu, true);
    for (var f = 0; f < 2; f++) (function (f) {
      make(scene, 'tembadau_' + f, 30, 20, function (p) { drawTembadau(p, f); });
      make(scene, 'pinggai_' + f, 16, 20, function (p) { drawPinggai(p, f); }, true);
    })(f);
    make(scene, 'tempayan_ajaib', 26, 30, drawVase, true);
    Object.keys(IC).forEach(function (id) { make(scene, 'i_' + id, 16, 16, IC[id], true); });
    Object.keys(HUD).forEach(function (k) { make(scene, k, 12, 12, HUD[k], true); });
    var a = scene.anims;
    if (!a.exists('tembadau_walk')) a.create({ key: 'tembadau_walk', frames: [{ key: 'tembadau_0' }, { key: 'tembadau_1' }], frameRate: 3, repeat: -1 });
    if (!a.exists('pinggai_idle')) a.create({ key: 'pinggai_idle', frames: [{ key: 'pinggai_0', duration: 900 }, { key: 'pinggai_1', duration: 300 }], repeat: -1 });
  };
})(window.LC);
