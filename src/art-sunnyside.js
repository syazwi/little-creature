/* Selected Sunnyside World V2.1 art by Daniel Diggle (https://danieldiggle.itch.io/sunnyside).
 * The atlas is embedded to support WebGL when the game is opened from disk. */
window.LC = window.LC || {};
(function (Art) {
  'use strict';
  var TILES = [
    'G0', 'G1', 'G2', 'G3', 'PATH', 'FIELD',
    'TILLED', 'WET', 'PADDY0', 'PADDY1', 'BUND', 'RIV0',
    'RIV1', 'RIV2', 'SAND', 'JETTY', 'JUN0', 'JUN1',
    'FH', 'FV', 'FC', 'SHORE0', 'SHORE1', 'FG0', 'FG1',
    'POND0', 'POND1', 'SEA0', 'SEA1', 'SEA2', 'SHAL0', 'SHAL1', 'HGRASS', 'PLANK', 'STONEP'
  ];
  var SPRITES = {
    jtree: [0, 48, 40, 48],
    jtree2: [40, 48, 40, 48],
    pine: [80, 48, 28, 44],
    chicken_0: [108, 48, 16, 16],
    chicken_1: [124, 48, 16, 16],
    chicken_2: [140, 48, 16, 16],
    itik_0: [156, 48, 16, 16],
    itik_1: [172, 48, 16, 16],
    itik_2: [188, 48, 16, 16],
    bush: [204, 48, 20, 17],
    hibiscus: [224, 48, 20, 18],
    rock: [244, 48, 12, 10],
    lalang: [256, 48, 12, 12],
    well: [268, 48, 24, 32],
    peti_kayu: [292, 48, 16, 16],
    tempayan: [308, 48, 16, 20],
    i_kayu: [324, 48, 16, 16],
    i_batu: [340, 48, 16, 16],
    i_telur: [356, 48, 16, 16],
    i_susu: [372, 48, 16, 16],
    crop_ubi_0: [388, 48, 16, 16],
    crop_ubi_1: [404, 48, 16, 16],
    crop_ubi_2: [420, 48, 16, 16]
  };

  Art.SUNNYSIDE_PATH_TILES = 32;

  Art.paintSunnysideTiles = function (ctx, sheet, pathStart) {
    TILES.forEach(function (name, i) {
      ctx.drawImage(sheet, (i % 32) * 16, Math.floor(i / 32) * 16, 16, 16, Art.TI[name] * 16, 0, 16, 16);
    });
    var width = Art.SUNNYSIDE_PATH_TILES * 16;
    ctx.drawImage(sheet, 0, 32, width, 16, pathStart * 16, 0, width, 16);
  };

  Art.sunnysidePathIndex = function (grid, x, y) {
    if (!Art.sunnysidePathStart) return Art.TI.PATH;
    var row = grid[y], north = grid[y - 1], south = grid[y + 1];
    var mask = (north && north[x] === '.' ? 1 : 0) | (row[x + 1] === '.' ? 2 : 0) |
      (south && south[x] === '.' ? 4 : 0) | (row[x - 1] === '.' ? 8 : 0);
    var variation = (x * 17 + y * 31 + x * y) % 11 < 3 ? 16 : 0;
    return Art.sunnysidePathStart + mask + variation;
  };

  Art.paintSunnysideSprites = function (scene, sheet) {
    Object.keys(SPRITES).forEach(function (key) {
      var r = SPRITES[key], w = r[2], h = r[3];
      Art.make(scene, key, w, h, function (_, ctx) {
        ctx.drawImage(sheet, r[0], r[1], w, h, 0, 0, w, h);
      });
    });
  };
  Art.sunnysideImage = 'data:image/png;base64,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';
})(window.LC.Art);
