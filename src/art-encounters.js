/* Pixel art for the old graveyard and the giant of Bukit Pasir. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art, INK = '#181425';
  var coats = [
    ['#688783', '#385a63', '#c2b584'], ['#8d685d', '#583f52', '#c8886d'],
    ['#657858', '#3a593d', '#acaa70'], ['#756b8c', '#4d456c', '#bd97a3'],
    ['#927147', '#624b42', '#d6ba80'], ['#506f84', '#334966', '#92aaa4'],
    ['#877c70', '#524b53', '#d0c4a5'], ['#696042', '#464a3d', '#9cab83']
  ];

  function drawZombie(p, palette, variant, frame) {
    var lean = [0, 1, 2, 1][frame], stride = [0, 1, 0, -1][frame], x = lean + 1;
    var skin = variant % 3 === 1 ? '#99a789' : variant % 3 === 2 ? '#80a39a' : '#a3b59b';
    p.line(8, 17, 7 + stride, 21, '#4d5260', 3);
    p.line(13, 17, 14 - stride, 21, '#65636b', 3);
    p.rect(5 + stride, 21, 5, 2, '#3c3d48');
    p.rect(12 - stride, 21, 5, 2, '#292e42');
    p.poly([[6 + x, 10], [13 + x, 10], [15, 18], [7, 19], [5, 16]], palette[1]);
    p.poly([[7 + x, 11], [12 + x, 11], [14, 15], [10, 17], [8, 16], [7, 17]], palette[0]);
    p.line(7, 16, 12, 16, palette[2]);
    p.line(6 + x, 13, 12, 15, palette[1], 3);
    p.line(12, 15, 18, 15 - lean, '#627875', 3);
    p.rect(17, 14 - lean, 4, 2, skin); p.px(20, 13 - lean, '#c4cead');
    p.line(13 + x, 12, 18, 11 + lean, palette[0], 3);
    p.rect(17, 10 + lean, 4, 2, skin);
    p.ell(9 + x, 7, 5.4, 5.1, '#5a7673');
    p.ell(10 + x, 6, 4.8, 4.5, skin);
    p.poly([[4 + x, 5], [5 + x, 3], [8 + x, 1], [10 + x, 2], [14 + x, 3], [15 + x, 4],
      [12 + x, 4], [10 + x, 5], [7 + x, 4]], '#354452');
    if (variant % 2) p.line(5 + x, 4, 13 + x, 3, palette[2]);
    if (variant === 2 || variant === 5) p.line(6 + x, 8, 11 + x, 9, '#d8d0ab', 2);
    p.rect(8 + x, 5, 3, 2, '#4a535d'); p.rect(12 + x, 6, 2, 2, '#4a535d');
    p.px(9 + x, 6, '#ffedc6'); p.px(13 + x, 6, '#fff8d5');
    p.line(10 + x, 9, 13 + x, 9, '#41414e');
    p.px(11 + x, 9, '#c1cbb0');
  }
  function looseSoil(p, x, y, frame) {
    p.ell(x, y + 1, 9, 2.3, '#54413a');
    p.ell(x - 1, y, 7.5, 1.8, '#8c684f');
    p.line(x - 6, y + 1, x - 2, y - 1, '#ba8e65');
    p.px(x + 5, y + 1, '#bf926a'); p.rect(x + 2, y - 1, 2, 2, '#705142');
    p.px(x - 7 - frame, y + 1, '#9b7855'); p.px(x + 7 + frame, y - frame, '#80624b');
  }

  var SKIN = '#a87456', LIGHT = '#d49c6d', SHADE = '#85533e', HAIR = '#403039', CLOTH = '#35665f', TRIM = '#73977d';
  function giantHead(p, x, y, asleep) {
    p.ell(x - 17, y + 4, 5.2, 6.5, SHADE);
    p.ell(x + 18, y + 4, 5.2, 6.5, SKIN);
    p.ell(x, y, 19, 21, SHADE);
    p.ell(x + 1, y - 3, 17, 18, SKIN);
    p.ell(x - 3, y - 9, 11, 6, LIGHT);
    p.poly([[x - 18, y - 4], [x - 17, y - 15], [x - 11, y - 21], [x + 4, y - 23], [x + 13, y - 18],
      [x + 17, y - 11], [x + 9, y - 13], [x + 2, y - 10], [x - 7, y - 13], [x - 12, y - 7]], HAIR);
    p.line(x - 11, y - 15, x - 3, y - 18, '#655153', 2);
    p.line(x - 11, y - 3, x - 3, y - 1, '#5e3c39', 2);
    p.line(x + 4, y - 2, x + 12, y - 4, '#5e3c39', 2);
    if (asleep) {
      p.line(x - 10, y + 2, x - 5, y + 2, HAIR, 2);
      p.line(x + 5, y + 2, x + 10, y + 1, HAIR, 2);
    } else {
      p.rect(x - 10, y, 6, 4, '#e4d3a9'); p.rect(x + 5, y, 6, 4, '#e4d3a9');
      p.rect(x - 6, y, 2, 4, HAIR); p.rect(x + 9, y, 2, 4, HAIR);
    }
    p.ell(x + 1, y + 6, 5, 4.5, LIGHT);
    p.poly([[x - 15, y + 10], [x - 7, y + 11], [x + 2, y + 10], [x + 13, y + 8], [x + 16, y + 17],
      [x + 10, y + 23], [x - 1, y + 24], [x - 11, y + 20]], HAIR);
    p.line(x - 4, y + 13, x + 7, y + 12, asleep ? '#7f5546' : '#ad745d', 2);
    p.line(x - 11, y + 17, x - 5, y + 20, '#685351', 2);
    p.px(x - 13, y + 6, '#c78967'); p.px(x + 14, y + 5, '#c78967');
  }
  function standingGiant(p, pose) {
    var lean = pose === 2 ? 3 : pose === 1 ? -1 : 0, step = pose === 1 ? -4 : pose === 2 ? 3 : 0;
    p.ell(35 + step, 100, 15, 6.5, '#614339'); p.ell(66 - step, 101, 16, 7, '#573e38');
    p.poly([[24, 76], [75, 76], [83, 86], [73 - step, 100], [53, 98], [50, 88], [44, 100], [20 + step, 99]], '#523d48');
    p.poly([[26, 74], [73, 72], [76, 83], [67, 92], [38, 87], [25, 92]], '#79525a');
    p.poly([[32, 36], [64, 36], [81, 44], [85, 64], [73, 84], [20, 82], [18, 58]], CLOTH);
    p.poly([[32, 39], [63, 38], [76, 46], [78, 59], [66, 61], [49, 54], [33, 64], [24, 55]], TRIM);
    p.poly([[37, 54], [49, 63], [72, 70], [73, 78], [42, 69], [24, 62]], '#b07c4e');
    p.line(32, 63, 65, 75, '#dfb479', 2);
    p.poly([[21, 44], [12, 51], [7, 71], [13, 83], [24, 78], [30, 62], [31, 53]], SHADE);
    p.poly([[21, 47], [15, 53], [11, 67], [17, 70], [23, 64], [28, 53]], SKIN);
    p.poly([[74, 44], [85, 44], [95, 56 - lean], [98, 70 - lean], [87, 76 - lean], [77, 64]], SHADE);
    p.poly([[77, 47], [84, 47], [91, 56 - lean], [92, 65 - lean], [86, 68 - lean], [79, 57]], SKIN);
    p.line(16, 71, 24, 74, '#c99c6e', 3); p.line(85, 68 - lean, 94, 65 - lean, '#c99c6e', 3);
    p.ell(88, 72 - lean, 6.5, 6.5, LIGHT);
    giantHead(p, 51 + lean, 26 + (pose === 1 ? 2 : 0), false);
  }
  function sleepingGiant(p, breath) {
    p.ell(62, 92, 37, 13, '#553b44');
    p.ell(76, 88, 24, 12, '#785257');
    p.ell(54, 80 - breath, 33, 20, CLOTH);
    p.ell(57, 75 - breath, 26, 13, TRIM);
    p.poly([[35, 67], [46, 66], [71, 88], [62, 97]], '#b07c4e');
    p.line(38, 68, 63, 93, '#d8ab71', 2);
    p.ell(45, 97, 22, 7, SHADE);
    p.ell(47, 94, 17, 5, SKIN);
    giantHead(p, 24, 77 - breath, true);
    p.ell(79, 97, 9, 5, '#65423a');
    p.ell(93, 94, 8, 6, '#573b38');
  }
  function treeClub(p) {
    var bark = '#704630', edge = '#c99459';
    p.poly([[3, 13], [20, 10], [38, 10], [52, 8], [65, 7], [69, 3], [78, 2],
      [77, 8], [97, 5], [105, 9], [106, 17], [96, 22], [81, 19], [73, 25], [65, 24], [70, 18],
      [55, 20], [35, 17], [23, 18], [5, 18]], bark);
    p.poly([[15, 12], [49, 10], [64, 9], [73, 5], [75, 5], [74, 10], [97, 7], [102, 10],
      [96, 12], [72, 13], [55, 16], [26, 15]], '#99663f');
    p.line(31, 12, 55, 11, edge, 2); p.line(76, 11, 94, 9, edge, 2);
    p.ell(100, 14, 4.4, 6, '#c99459'); p.ell(101, 14, 2.7, 4.5, '#805736'); p.px(102, 14, '#e9be7e');
    p.line(29, 16, 53, 17, '#4d382e'); p.line(77, 17, 90, 17, '#533a2f', 2);
    for (var x = 6; x <= 18; x += 4) p.line(x, 12, x - 1, 18, '#c0ac83', 2);
    p.poly([[69, 4], [65, 2], [65, 1], [70, 1], [75, 3]], '#60885f');
  }

  Art.generateEncounters = function (scene) {
    var make = Art.make;
    coats.forEach(function (colors, i) {
      var key = 'grave_zombie_' + i, frames = [];
      [0, 1, 2, 3].forEach(function (f) {
        make(scene, key + '_' + f, 24, 24, function (p) { drawZombie(p, colors, i, f); }, INK);
        frames.push({ key: key + '_' + f });
      });
      if (!scene.anims.exists(key + '_walk')) scene.anims.create({ key: key + '_walk', frames: frames, frameRate: 5, repeat: -1 });
      [19, 13, 9, 5, 1].forEach(function (offset, f) {
        make(scene, key + '_rise_' + f, 24, 25, function (p, ctx) {
          ctx.save();
          ctx.beginPath(); ctx.rect(0, 0, 24, 21); ctx.clip(); ctx.translate(0, offset);
          drawZombie(p, colors, i, 0);
          ctx.restore();
          if (f === 0) {
            p.line(14, 21, 16, 15, '#8aa19a', 3);
            p.line(16, 16, 18, 14, '#b5c5a4', 2); p.px(15, 13, '#c8d0ae');
          }
          looseSoil(p, 12, 21, f);
        }, INK);
      });
    });
    make(scene, 'grave_soil', 24, 8, function (p) { looseSoil(p, 12, 4, 1); }, INK);
    [0, 1].forEach(function (f) {
      make(scene, 'dune_giant_sleep_' + f, 108, 108, function (p) { sleepingGiant(p, f * 2); }, INK);
    });
    [0, 1, 2].forEach(function (f) {
      make(scene, 'dune_giant_' + f, 108, 108, function (p) { standingGiant(p, f); }, INK);
    });
    if (!scene.anims.exists('dune_giant_walk')) scene.anims.create({ key: 'dune_giant_walk', frames: [{ key: 'dune_giant_0' }], frameRate: 1 });
    make(scene, 'dune_tree_club', 108, 27, treeClub, INK);
  };
})(window.LC);
