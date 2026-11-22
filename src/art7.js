/* Little Creature — procedural pixel art for v1.8: the new wings of Nenek's house (verandah, middle room, kitchen
 * wing), the house with carved golden gables, the three helpers, Mak Thuy's pottery yard, Pak Tam's dragon-fruit
 * stall, the dragon-fruit crop, and new icons. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art;
  var WOOD = '#6b4423', WOOD2 = '#4e3018', BEAM = '#5e3a1e', WALL = '#b8834a', WALL2 = '#9a6a38', THATCH = '#8b6b3d', THATCH2 = '#6d522c', GOLD = '#e9c46a';

  // ================================================================== THE HOUSE GROWS (32x96, beside the 80x96 house)
  function stilts(p) {
    [3, 15, 27].forEach(function (x) { p.rect(x, 60, 3, 29, WOOD); p.rect(x + 2, 60, 1, 29, WOOD2); p.rect(x - 1, 87, 5, 2, '#8a8a8a'); });
    p.rect(0, 58, 32, 4, BEAM); p.rect(0, 58, 32, 1, '#7a4f2b');
    p.rect(0, 64, 32, 24, 'rgba(30,20,12,0.25)');
  }
  function inPoly(pts, px, py) {
    var inside = false;
    for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      var xi = pts[i][0], yi = pts[i][1], xj = pts[j][0], yj = pts[j][1];
      if (((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) inside = !inside;
    }
    return inside;
  }
  function thatchRoof(p, pts) {   // attap thatch: rows of darker straw and a few light strands, kept inside the roof
    p.poly(pts, THATCH);
    var minY = Math.min.apply(null, pts.map(function (q) { return q[1]; })), maxY = Math.max.apply(null, pts.map(function (q) { return q[1]; }));
    for (var y = Math.ceil(minY) + 1; y < maxY; y++) for (var x = 0; x < 32; x++) {
      if (!inPoly(pts, x + 0.5, y + 0.5)) continue;
      if (y % 3 === 0 && p.r() < 0.6) p.px(x, y, THATCH2); else if (p.r() < 0.06) p.px(x, y, '#a8854f');
    }
    p.line(pts[pts.length - 1][0], pts[pts.length - 1][1], pts[pts.length - 2][0], pts[pts.length - 2][1], '#5a3a1e');   // the eave
  }
  function wall(p, top) {
    p.rect(0, top, 30, 58 - top, WALL);
    for (var x = 1; x < 30; x += 4) p.rect(x, top, 1, 58 - top, WALL2);
    p.rect(0, top, 30, 2, '#7a4f2b');
  }
  function windowAt(p, x, y) {
    p.rect(x - 3, y, 3, 11, '#9c6a3a'); p.rect(x + 10, y, 3, 11, '#9c6a3a');
    p.rect(x, y, 10, 11, '#5a3720'); p.rect(x + 2, y + 2, 6, 7, '#2a1a10'); p.rect(x + 4, y + 2, 2, 7, '#5a3720');
  }
  function drawWing1(p) {   // the serambi: an open verandah under a lean-to roof
    stilts(p);
    p.rect(0, 52, 30, 6, '#c99a5e'); p.rect(0, 52, 30, 1, '#e0b878');            // the floor, seen through the rails
    p.rect(4, 49, 12, 3, '#d8b878'); p.rect(4, 49, 12, 1, '#c8323a');            // a woven tikar mat
    p.ell(23, 50, 3, 2.4, '#a8503a'); p.disc(23, 46, 3, '#3f8a3a'); p.px(22, 44, '#ff6bb5');   // a potted hibiscus
    p.rect(0, 44, 31, 2, '#7a4f2b');
    for (var x = 1; x < 31; x += 3) p.rect(x, 46, 1, 12, '#8a5a2b');             // balusters
    p.rect(28, 30, 3, 28, WOOD); p.rect(30, 30, 1, 28, WOOD2);
    thatchRoof(p, [[0, 20], [32, 32], [32, 37], [0, 27]]);
  }
  function drawWing2(p) {   // the middle room
    stilts(p);
    wall(p, 34);
    windowAt(p, 10, 39);
    p.rect(8, 50, 16, 2, '#7a4b28'); p.ell(12, 49, 2, 1.4, '#ff6bb5'); p.ell(19, 49, 2, 1.4, '#ffd166');   // a flower box
    thatchRoof(p, [[0, 14], [16, 6], [32, 22], [32, 36], [0, 36]]);
    p.line(0, 14, 16, 6, '#5a3a1e'); p.line(16, 6, 32, 22, '#5a3a1e');
  }
  function drawWing3(p) {   // the grand kitchen wing: carved gable boards, a smoke vent, a lantern
    stilts(p);
    wall(p, 32);
    windowAt(p, 10, 37);
    p.rect(8, 49, 16, 2, '#7a4b28'); p.ell(12, 48, 2, 1.4, '#ff6bb5'); p.ell(19, 48, 2, 1.4, '#ffd166');
    thatchRoof(p, [[0, 12], [16, 2], [32, 20], [32, 34], [0, 34]]);
    for (var i = 0; i < 16; i += 2) { p.px(i, 12 - i * 0.62, GOLD); p.px(32 - i, 20 - i * 1.1 + 0.5, GOLD); }   // tebar layar
    p.line(0, 13, 16, 3, '#c4922f'); p.line(16, 3, 31, 20, '#c4922f');
    p.disc(16, 2, 1.6, GOLD);
    p.rect(22, 6, 4, 6, '#6a5a4a'); p.rect(21, 5, 6, 2, '#4a3a2a');               // smoke vent
    p.disc(25, 2, 1.6, 'rgba(220,220,220,0.6)'); p.disc(28, 0, 1.4, 'rgba(220,220,220,0.4)');
    p.line(5, 34, 5, 38, '#3a2a1a'); p.rect(3, 38, 5, 6, '#c8323a'); p.rect(4, 39, 3, 4, '#ffd166');   // a red lantern
  }

  // ================================================================== BUKIT PASIR: the pottery yard and the fruit stall
  function pot(p, x, y, r, h, c, c2) {
    p.ell(x, y, r, h, c); p.ell(x - r * 0.3, y - h * 0.3, r * 0.45, h * 0.35, c2);
    p.rect(x - r * 0.45, y - h - 1, r * 0.9, 2, c); p.line(x - r + 1, y, x + r - 1, y, 'rgba(60,20,10,0.5)');
  }
  function drawTembikar(p) {   // 32x20 pots drying, and the open firing ring
    p.ell(9, 16, 8, 3, '#3a3a3a'); p.ell(9, 16, 6, 2, '#5a4a40'); p.speck(3, 14, 12, 4, '#ff8a3a', 4); p.speck(3, 14, 12, 4, '#8a8a8a', 5);
    pot(p, 22, 13, 4.5, 4.5, '#a8503a', '#c87a5a'); pot(p, 28, 15, 3, 3, '#8a4030', '#b8684a');
    pot(p, 15, 9, 3.6, 4, '#b86a4a', '#d89a7a'); pot(p, 25, 6, 3, 3.4, '#9a4a34', '#c47a5a');
    p.line(19, 12, 25, 12, '#e8d8b0'); p.line(13, 8, 17, 8, '#e8d8b0');   // painted bands
  }
  function drawGeraiNaga(p) {   // 32x24 Pak Tam's bamboo stall
    p.rect(3, 13, 2, 11, '#a8844a'); p.rect(27, 13, 2, 11, '#a8844a');
    p.rect(1, 12, 30, 3, '#c8a46a'); p.rect(1, 12, 30, 1, '#e0c08a');
    [[6, 10], [10, 9], [14, 10], [18, 9], [22, 10], [26, 10], [8, 7], [12, 6], [16, 7], [20, 6], [24, 7], [14, 4], [18, 4]].forEach(function (f) {
      p.ell(f[0], f[1], 2.4, 2, '#d0306a'); p.px(f[0] - 1, f[1] - 1, '#ff6aa0'); p.px(f[0] + 2, f[1] - 1, '#6abf4a'); p.px(f[0] - 2, f[1] + 1, '#6abf4a');
    });
    p.rect(26, 0, 6, 5, '#f2e6c8'); p.rect(27, 1, 4, 1, '#c8323a'); p.rect(27, 3, 3, 1, '#c8323a'); p.rect(28, 5, 1, 7, '#a8844a');
  }

  // ================================================================== THE DRAGON-FRUIT CROP (16x16, climbing a post)
  function drawNaga(p, st) {
    var C = '#4f9a3a', C2 = '#6cbf4a';
    if (st === 0) { p.ell(8, 13, 3.5, 1.6, '#6a4426'); p.rect(7, 9, 2, 4, C); p.px(8, 9, C2); return; }
    p.rect(7, 4, 2, 11, '#8a6a3a');   // the post it climbs
    if (st === 1) { p.rect(6, 9, 2, 5, C); p.rect(9, 10, 2, 4, C2); return; }
    p.rect(5, 6, 2, 9, C); p.rect(9, 5, 2, 9, C2); p.rect(4, 3, 8, 2, C); p.px(3, 4, C2); p.px(12, 4, C2);
    p.line(3, 5, 2, 9, C); p.line(12, 5, 13, 9, C2);
    if (st === 3) [[3, 9], [13, 9], [5, 2], [11, 2]].forEach(function (f) { p.ell(f[0], f[1], 1.8, 1.6, '#d0306a'); p.px(f[0], f[1] - 1, '#ff6aa0'); });
  }

  // ================================================================== ICONS (16x16)
  var IC = {
    periuk_tanah: function (p) { pot(p, 8, 10, 6, 5, '#a8503a', '#c87a5a'); p.line(3, 9, 13, 9, '#e8d8b0'); },
    tempayan: function (p) { p.ell(8, 9, 5.6, 6.4, '#5a3a2a'); p.ell(6.5, 7, 2.4, 3, '#7a5a42'); p.rect(5, 1, 6, 2, '#5a3a2a'); p.rect(2, 6, 2, 3, '#4a2a1a'); p.rect(12, 6, 2, 3, '#4a2a1a'); p.line(3, 11, 13, 11, '#c8a060'); },
    pelita_tanah: function (p) { p.ell(8, 12, 6, 2.6, '#a8503a'); p.ell(7, 11, 3, 1.2, '#c87a5a'); p.rect(12, 10, 3, 2, '#a8503a'); p.ell(13, 7, 1.6, 2.6, '#ffd166'); p.px(13, 6, '#fff4c0'); },
    seed_buahnaga: function (p) { p.rect(6, 3, 4, 11, '#4f9a3a'); p.rect(7, 3, 1, 11, '#6cbf4a'); p.px(5, 5, '#3a7a2c'); p.px(10, 8, '#3a7a2c'); p.px(5, 11, '#3a7a2c'); p.rect(10, 11, 4, 3, '#e8d8b0'); p.px(11, 12, '#c8323a'); },
    jus_buah_naga: function (p) { p.rect(4, 4, 8, 11, '#e8f4ff'); p.rect(5, 6, 6, 8, '#e0307a'); p.rect(5, 6, 6, 1, '#ff7ab0'); p.line(9, 1, 11, 6, '#6abf4a'); p.px(6, 9, '#2a1a10'); p.px(8, 11, '#2a1a10'); },
    almari: function (p) { p.rect(3, 1, 10, 14, '#8a5a2b'); p.rect(4, 2, 4, 12, '#a8743e'); p.rect(8, 2, 4, 12, '#a8743e'); p.px(7, 8, GOLD); p.px(8, 8, GOLD); },
    almari_besar: function (p) { p.rect(1, 1, 14, 14, '#8a5a2b'); p.rect(2, 2, 6, 12, '#a8743e'); p.rect(8, 2, 6, 12, '#a8743e'); p.px(7, 8, GOLD); p.px(8, 8, GOLD); p.rect(1, 1, 14, 1, GOLD); }
  };

  Art.generate7 = function (scene) {
    var make = Art.make;
    make(scene, 'wing_1', 32, 96, drawWing1, true);
    make(scene, 'wing_2', 32, 96, drawWing2, true);
    make(scene, 'wing_3', 32, 96, drawWing3, true);
    // Nenek's house with carved golden gables and flower boxes (the grand house)
    make(scene, 'house_ukir', 80, 96, function (p, ctx) {
      ctx.drawImage(scene.textures.get('house').getSourceImage(), 0, 0);
      for (var y = 4; y <= 36; y += 2) { var h = Math.round((y - 2) / 36 * 40 + 1); p.px(40 - h, y, GOLD); p.px(39 + h, y, GOLD); }
      p.disc(40, 3, 2, GOLD); p.px(40, 0, '#fff4c0');
      [10, 54].forEach(function (x) { p.rect(x - 2, 52, 16, 3, '#7a4b28'); p.ell(x + 2, 51, 2, 1.4, '#ff6bb5'); p.ell(x + 8, 51, 2, 1.4, '#ffd166'); p.px(x + 5, 50, '#6abf4a'); });
    });
    make(scene, 'tembikar', 32, 20, drawTembikar, true);
    make(scene, 'gerai_naga', 32, 24, drawGeraiNaga, true);
    for (var s = 0; s < 4; s++) (function (s) { make(scene, 'crop_buahnaga_' + s, 16, 16, function (p) { drawNaga(p, s); if (s) p.outline('#1f3a1a'); }); })(s);
    Object.keys(IC).forEach(function (id) { make(scene, 'i_' + id, 16, 16, IC[id], true); });
    // the helpers (they are not villagers: they live and work on the farm)
    var a = scene.anims;
    LC.HELPER_ORDER.forEach(function (k) {
      var L = LC.HELPERS[k].look;
      make(scene, 'npc_h_' + k + '_0', 16, 20, function (p) { Art.drawVillager(p, L, false); });
      make(scene, 'npc_h_' + k + '_1', 16, 20, function (p) { Art.drawVillager(p, L, true); });
      make(scene, 'npc_h_' + k + '_step1', 16, 20, function (p) { Art.drawVillager(p, L, false, 1); });
      make(scene, 'npc_h_' + k + '_step2', 16, 20, function (p) { Art.drawVillager(p, L, false, 2); });
      if (!a.exists('npc_h_' + k + '_idle')) a.create({ key: 'npc_h_' + k + '_idle', frames: [{ key: 'npc_h_' + k + '_0', duration: 2500 }, { key: 'npc_h_' + k + '_1', duration: 140 }], repeat: -1 });
      if (!a.exists('npc_h_' + k + '_walk')) a.create({ key: 'npc_h_' + k + '_walk', frames: [{ key: 'npc_h_' + k + '_step1' }, { key: 'npc_h_' + k + '_step2' }], frameRate: 7, repeat: -1 });
    });
  };
})(window.LC);
