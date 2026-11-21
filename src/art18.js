/* Little Creature — art, part 18 (v2.7.4): the masjid of Kampung Tepian (and v2.7.5: the khemah, a tent) (a Malay kampung masjid with a tiered roof,
 * a slim menara and a beduk drum on the serambi) and its small map icon. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art;
  var WALL = '#f4efe2', WALL2 = '#ddd4c0', ROOF = '#2e7a5a', ROOF2 = '#22624a', ROOFE = '#1a4a38', GOLD = '#e9c46a', GOLD2 = '#f6dc8a';
  var GLASS = '#33525e', WOOD = '#6a4428', WOOD2 = '#4a2e1a', STONE = '#d6cebe', STONE2 = '#b9b09e';

  function arch(p, x, y, w, h, col) { p.rect(x, y + w / 2, w, h - w / 2, col); p.ell(x + w / 2, y + w / 2, w / 2, w / 2, col); }
  function tier(p, x0, x1, y0, y1, inset) {   // one sloping roof skirt, darker on the right, a gold rim along the eaves
    p.poly([[x0, y1], [x0 + inset, y0], [x1 - inset, y0], [x1, y1]], ROOF);
    p.poly([[(x0 + x1) / 2 + 6, y0], [x1 - inset, y0], [x1, y1], [(x0 + x1) / 2 + 12, y1]], ROOF2);
    for (var x = x0 + 4; x < x1 - 2; x += 5) p.line(x, y1 - 1, x + (x < (x0 + x1) / 2 ? 2 : -2), y0 + 2, ROOFE);
    p.rect(x0, y1, x1 - x0, 2, ROOFE); p.rect(x0 + 1, y1 + 1, x1 - x0 - 2, 1, GOLD);
  }

  function drawMasjid(p) {   // 96 x 96: the bottom 48 px are the footprint (6 x 3 tiles)
    p.rect(2, 90, 92, 5, 'rgba(30,20,12,0.3)');
    // the raised stone floor and the front steps
    p.rect(4, 80, 82, 10, STONE); p.rect(4, 80, 82, 1, '#ece5d6'); p.rect(4, 88, 82, 2, STONE2);
    p.rect(36, 88, 20, 3, STONE); p.rect(38, 91, 16, 3, STONE2);
    // the prayer hall
    p.rect(12, 52, 66, 28, WALL); p.rect(12, 52, 66, 3, WALL2); p.rect(12, 74, 66, 6, '#e6dcc6'); p.rect(12, 74, 66, 1, WALL2);
    [16, 27, 57, 68].forEach(function (x) { arch(p, x, 59, 7, 13, GLASS); p.rect(x + 3, 60, 1, 12, '#4a6e7a'); p.rect(x - 1, 72, 9, 1, GOLD); });
    arch(p, 38, 57, 15, 23, WOOD); p.rect(45, 62, 1, 18, WOOD2); p.rect(40, 66, 3, 1, GOLD); p.rect(48, 66, 3, 1, GOLD);
    [[37, 63], [53, 63]].forEach(function (c) { p.rect(c[0], c[1], 1, 17, GOLD); });
    // the serambi lamps
    [[22, 56], [69, 56]].forEach(function (c) { p.rect(c[0], c[1], 1, 2, WOOD2); p.rect(c[0] - 1, c[1] + 2, 3, 3, '#ffd166'); p.px(c[0], c[1] + 3, '#fff6c8'); });
    // three tiers of roof, each with a band of carved vents beneath
    tier(p, 2, 90, 42, 54, 12);
    p.rect(24, 36, 44, 6, WALL); for (var x = 27; x < 66; x += 4) p.rect(x, 38, 2, 2, '#a89a7a');
    tier(p, 16, 76, 26, 38, 11);
    p.rect(34, 21, 24, 5, WALL); for (x = 37; x < 56; x += 4) p.rect(x, 22, 2, 2, '#a89a7a');
    p.poly([[28, 24], [46, 8], [64, 24]], ROOF); p.poly([[46, 8], [64, 24], [52, 24]], ROOF2);
    p.rect(28, 24, 36, 2, ROOFE); p.rect(29, 25, 34, 1, GOLD);
    // the mustaka on the very top, and a small crescent
    p.rect(45, 3, 2, 6, GOLD); p.ell(46, 5, 2, 1.6, GOLD2);
    p.str(['.yy', 'y..', 'y..', '.yy'], { y: GOLD2 }, 47, 0);
    // the beduk on the serambi: a big drum on a wooden frame
    p.rect(1, 63, 10, 1, WOOD2); p.rect(1, 63, 1, 17, WOOD2); p.rect(10, 63, 1, 17, WOOD2);
    p.ell(6, 71, 4.6, 4.4, '#b07a40'); p.rect(3, 67, 6, 1, '#7a5030'); p.rect(3, 75, 6, 1, '#7a5030');
    p.ell(2.4, 71, 1.4, 4, '#ece0c4'); p.line(4, 64, 6, 67, WOOD2);
    // the menara, a slim tower at the corner
    p.rect(80, 81, 14, 8, STONE); p.rect(80, 88, 14, 1, STONE2);
    p.rect(83, 22, 9, 59, WALL); p.rect(90, 22, 2, 59, WALL2);
    p.rect(86, 44, 2, 6, GLASS); p.rect(86, 62, 2, 6, GLASS);
    p.rect(81, 36, 13, 2, ROOFE); p.rect(81, 34, 13, 2, ROOF); p.rect(82, 37, 11, 1, GOLD);
    p.poly([[82, 23], [87.5, 11], [93, 23]], ROOF); p.poly([[87.5, 11], [93, 23], [89, 23]], ROOF2); p.rect(82, 22, 11, 1, GOLD);
    p.rect(87, 6, 1, 6, GOLD); p.str(['.y', 'y.', '.y'], { y: GOLD2 }, 88, 3);
    p.speck(12, 55, 66, 18, '#ece5d4', 14);
  }

  // 12 x 12 map icon: a little masjid with a dome and a tower
  function iconMasjid(p) {
    p.str(['....y.....', '...ggg...g', '..ggggg..w', '.ggggggg.w', '.wwwwwww.w', '.wdwwwdw.w', '.wwwdwww.w', '.wwwdwww.w', 'ssssssssss'],
      { y: '#ffd166', g: '#2e8a5a', w: '#f4f0e4', d: '#3a4a5a', s: '#b8b0a0' }, 1, 2);
  }

  // v2.7.5: the khemah, a canvas A-frame tent (32 x 28; the bottom 16 px are its two-tile footprint) and its bag icon
  var CAN = '#d9893a', CAN2 = '#b86a28', CAN3 = '#8a4a1c', DOOR = '#3a2418', ROPE = '#e8dcc0', PEG = '#6a4a2a';
  function drawKhemah(p) {
    p.ell(16, 26, 15, 2.4, 'rgba(30,20,12,0.3)');
    // the guy ropes and the pegs at the corners
    p.line(3, 13, 0, 25, ROPE); p.line(29, 13, 31, 25, ROPE); p.rect(0, 24, 1, 2, PEG); p.rect(31, 24, 1, 2, PEG);
    // the fly sheet: lit on the left, in shade on the right, a seam along the ridge
    p.poly([[3, 25], [16, 5], [16, 25]], CAN); p.poly([[16, 5], [29, 25], [16, 25]], CAN2);
    p.line(16, 5, 16, 25, CAN3); p.line(3, 25, 16, 5, '#e9a456'); p.rect(3, 24, 27, 2, CAN3);
    // the open door flap, tied back
    p.poly([[11, 25], [16, 12], [21, 25]], DOOR); p.line(16, 12, 12, 25, '#f0b060'); p.rect(19, 18, 2, 1, ROPE);
    // the pole tip and a little pennant
    p.rect(15, 2, 2, 4, PEG); p.poly([[17, 2], [22, 3.5], [17, 5]], '#c8323a');
  }
  function iconKhemah(p) {   // 16 x 16: a folded-up tent with its pole
    p.poly([[1, 13], [8, 2], [15, 13]], CAN); p.poly([[8, 2], [15, 13], [8, 13]], CAN2);
    p.poly([[5.5, 13], [8, 7], [10.5, 13]], DOOR); p.rect(1, 13, 14, 2, CAN3); p.rect(7, 0, 2, 3, PEG);
  }

  Art.generate18 = function (scene) {
    var make = Art.make;
    make(scene, 'masjid', 96, 96, drawMasjid, true);
    make(scene, 'ic_masjid', 12, 12, iconMasjid, true);
    make(scene, 'khemah_tent', 32, 28, drawKhemah, true);   // (v2.7.6: not 'khemah', which is the brothers' camp in Barunai)
    make(scene, 'i_khemah', 16, 16, iconKhemah, true);
  };
})(window.LC);
