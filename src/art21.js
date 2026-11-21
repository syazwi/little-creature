/* Pixel art for Laluan Gema and Sang Kelembai. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';

  var Art = LC.Art;
  var STONE = '#34363f', EDGE = '#636171', JADE = '#87d6b6', GOLD = '#d1a55c';

  function drawKelembai(p, frame) {
    var y = frame ? 1 : 0;
    p.ell(24, 47, 18, 3, 'rgba(18,14,24,0.55)');
    p.poly([[8, 43], [11, 26], [18, 20], [34, 22], [41, 29], [43, 45], [35, 48], [14, 48]], '#484353');
    p.poly([[11, 45], [15, 28], [25, 23], [30, 29], [32, 48], [21, 48]], '#756674');
    p.poly([[29, 43], [33, 26], [38, 28], [42, 43], [36, 47]], '#5a5367');
    p.poly([[2, 35], [9, 27], [16, 28], [14, 42], [6, 44]], '#665b67');
    p.poly([[35, 27], [44, 29], [47, 39], [41, 43], [35, 35]], '#6c626c');
    p.poly([[7, 28], [8, 14 + y], [17, 6 + y], [32, 6 + y], [39, 12 + y], [40, 27], [34, 34], [12, 33]], STONE);
    p.poly([[13, 14 + y], [18, 9 + y], [31, 8 + y], [36, 15 + y], [32, 17 + y], [20, 16 + y]], EDGE);
    p.poly([[15, 19 + y], [20, 15 + y], [30, 15 + y], [34, 20 + y], [31, 28 + y], [22, 30 + y], [17, 25 + y]], '#a18a84');
    p.rect(18, 20 + y, 5, 2, '#534855'); p.rect(27, 20 + y, 5, 2, '#534855');
    p.px(21, 20 + y, JADE); p.px(29, 20 + y, JADE);
    p.line(24, 21 + y, 23, 24 + y, '#d1b4a2');
    p.rect(23, 26 + y, 5, frame ? 2 : 1, '#503b4a');
    p.disc(15, 24 + y, 2, GOLD); p.disc(34, 24 + y, 2, GOLD);
    p.line(12, 33, 34, 44, '#704f85', 5);
    p.line(12, 32, 34, 43, '#ad80ab');
    [[17, 34], [22, 37], [27, 39], [32, 42]].forEach(function (d) { p.px(d[0], d[1], GOLD); });
    p.line(7, 18, 12, 15, '#668371'); p.line(33, 10, 36, 13, '#668371');
    p.line(6, 37, 10, 34, '#898095'); p.line(40, 33, 44, 36, '#898095');
  }

  Art.generate21 = function (scene) {
    Art.make(scene, 'sang_kelembai_0', 48, 50, function (p) { drawKelembai(p, 0); });
    Art.make(scene, 'sang_kelembai_1', 48, 50, function (p) { drawKelembai(p, 1); });
    Art.make(scene, 'laluan_pintu', 32, 34, function (p) {
      p.ell(16, 15, 15, 13, EDGE); p.rect(1, 15, 30, 19, EDGE);
      p.ell(16, 16, 10, 10, STONE); p.rect(6, 16, 20, 17, STONE);
      p.rect(8, 24, 16, 8, '#1b1a24');
      p.line(10, 33, 13, 27, '#78656d'); p.line(22, 33, 19, 27, '#78656d');
      p.line(4, 22, 4, 31, GOLD, 2); p.line(27, 22, 27, 31, GOLD, 2);
      p.disc(16, 4, 2, JADE);
    });
    Art.make(scene, 'gema_anvil', 16, 18, function (p) {
      p.rect(2, 13, 12, 4, '#6f5652'); p.rect(5, 8, 6, 6, '#524348');
      p.poly([[0, 4], [16, 4], [11, 9], [4, 9]], STONE);
      p.rect(1, 4, 13, 2, EDGE); p.line(5, 2, 11, 2, JADE);
    });
    Art.make(scene, 'gema_merchant', 26, 26, function (p) {
      p.ell(13, 24, 12, 2, '#332731');
      p.rect(8, 12, 10, 9, '#397175'); p.rect(8, 15, 3, 6, '#5ea397');
      p.ell(13, 9, 4.5, 5, '#a1664e'); p.rect(10, 7, 6, 4, '#d6a16c');
      p.px(11, 8, '#3a2a35'); p.px(15, 8, '#3a2a35');
      p.poly([[4, 7], [13, 1], [22, 7]], '#b18a5c');
      p.line(7, 6, 13, 2, '#edd093'); p.line(4, 7, 22, 7, '#754831');
      p.rect(1, 18, 24, 3, '#94664f'); p.rect(3, 21, 20, 4, '#644634');
      p.rect(3, 14, 5, 4, '#b87659'); p.rect(4, 13, 3, 2, '#efcf9a');
      p.rect(17, 14, 6, 4, '#6e976a'); p.line(18, 15, 21, 16, JADE);
      p.rect(11, 21, 4, 3, '#bd854d');
    }, true);
    Art.make(scene, 'gema_seam', 16, 16, function (p) {
      p.poly([[0, 14], [3, 7], [7, 9], [10, 4], [15, 8], [16, 15]], STONE);
      p.line(2, 13, 7, 11, JADE); p.line(7, 11, 10, 8, JADE);
      p.line(10, 8, 14, 10, '#4b9a85'); p.px(10, 7, '#d0ffe1');
    });
    Art.make(scene, 'i_batu_gema', 16, 16, function (p) {
      p.poly([[2, 9], [5, 4], [10, 2], [14, 6], [13, 12], [7, 14], [3, 12]], '#386968');
      p.poly([[5, 4], [10, 2], [14, 6], [7, 8]], JADE);
      p.line(5, 6, 7, 8, '#e0fff0'); p.line(7, 8, 11, 7, '#e0fff0');
    }, true);
    if (!scene.anims.exists('sang_kelembai_walk')) scene.anims.create({
      key: 'sang_kelembai_walk', frames: [{ key: 'sang_kelembai_0' }, { key: 'sang_kelembai_1' }], frameRate: 3, repeat: -1
    });
  };
})(window.LC);
