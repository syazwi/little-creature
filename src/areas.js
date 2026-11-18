/* Little Creature — the wider world (v1.3): every place you can walk to, its tile map, objects, exits and wildlife.
 *
 * Tile characters
 *   .  grass         p  dirt path      f  farm field     r  rice paddy      b  paddy bund     F  fence (solid)
 *   w  river (solid) S  river shore    s  sand           j  jetty           J  jungle wall (solid)
 *   g  forest floor  q  pond (solid)   o  deep sea       h  shallow sea     m  mountain rock   M  cliff (solid)
 *   k  stone path    G  highland grass d  dune sand      R  red rock (solid)
 * Exits are walk-off zones at a map edge. A locked exit shows a gate until Pelita reaches the place's level. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';

  LC.SOLID_TILES = { J: 1, w: 1, S: 1, F: 1, q: 1, o: 1, h: 1, M: 1, R: 1 };
  LC.WATER_TILES = { w: 'river', S: 'river', q: 'pond', o: 'sea', h: 'sea' };

  function blank(W, H, ch) { var g = []; for (var y = 0; y < H; y++) { g.push([]); for (var x = 0; x < W; x++) g[y].push(ch); } return g; }
  function filler(g) {
    var H = g.length, W = g[0].length;
    return {
      fill: function (x0, y0, x1, y1, ch) {
        for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) if (y >= 0 && y < H && x >= 0 && x < W) g[y][x] = ch;
      },
      ell: function (cx, cy, rx, ry, ch, only) {
        for (var y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (var x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
          if (y < 0 || y >= H || x < 0 || x >= W) continue;
          var dx = (x - cx) / rx, dy = (y - cy) / ry;
          if (dx * dx + dy * dy <= 1 && (!only || g[y][x] === only)) g[y][x] = ch;
        }
      }
    };
  }

  // ------------------------------------------------------------------ Kampung Tepian (the village)
  function buildKampung() {
    var W = 46, H = 32, g = blank(W, H, '.'), f = filler(g);
    f.fill(0, 0, W - 1, 1, 'J'); f.fill(0, 0, 0, H - 1, 'J'); f.fill(W - 1, 0, W - 1, H - 1, 'J');
    f.fill(0, 26, W - 1, 26, 's'); f.fill(0, 27, W - 1, 27, 'S'); f.fill(0, 28, W - 1, H - 1, 'w');
    f.fill(0, 10, W - 1, 11, 'p');                 // the main road
    f.fill(24, 12, 25, 25, 'p'); f.fill(24, 26, 25, 30, 'j');   // lane and jetty
    f.fill(12, 8, 19, 9, 'p'); f.fill(5, 8, 9, 9, 'p'); f.fill(22, 8, 25, 9, 'p'); f.fill(29, 8, 30, 9, 'p'); f.fill(36, 8, 37, 9, 'p');
    f.fill(5, 12, 6, 13, 'p'); f.fill(12, 12, 13, 13, 'p');
    return g;
  }
  var KAMPUNG_OBJECTS = [
    { id: 'k_penghulu_house', type: 'bldg', x: 3, y: 2, w: 5, h: 6, tex: 'house_penghulu', text: 'Tok Penghulu\'s house. The carved gable shows a pair of fighting cocks.' },
    { id: 'k_beringin', type: 'bldg', x: 14, y: 5, w: 2, h: 2, tex: 'beringin', text: 'A huge banyan tree (pokok beringin). The elders say a spirit has lived in it for three hundred years.' },
    { id: 'k_wakaf', type: 'bldg', x: 17, y: 6, w: 3, h: 1, tex: 'wakaf', text: 'A wakaf: a little open pavilion where villagers rest and chat in the shade.' },
    { id: 'k_bengkel', type: 'bldg', x: 21, y: 4, w: 5, h: 3, tex: 'bengkel', text: 'Tukang Leong\'s workshop. It smells of fresh sawdust.' },
    { id: 'plotA', type: 'plot', x: 28, y: 4, w: 4, h: 3 },
    { id: 'plotB', type: 'plot', x: 35, y: 4, w: 4, h: 3 },
    { id: 'plotC', type: 'plot', x: 4, y: 14, w: 4, h: 3 },
    { id: 'plotD', type: 'plot', x: 11, y: 14, w: 4, h: 3 },
    { id: 'k_pondok', type: 'bldg', x: 27, y: 21, w: 4, h: 3, tex: 'pondok', text: 'Pak Mat\'s fishing hut. Nets hang drying in the sun.' },
    { id: 'k_well', type: 'well', x: 19, y: 15, w: 1, h: 1, tex: 'well' },
    { id: 'k_shrine', type: 'shrine', x: 40, y: 6, w: 1, h: 1, tex: 'shrine' },
    { id: 'k_sign', type: 'signpost', x: 41, y: 9, w: 1, h: 1, tex: 'sign', text: 'BUKIT PASIR (the red dunes) >>  Sand has buried the road. Pelita at Lv 11 could light the way.' },
    { id: 'k_banana1', type: 'tree', kind: 'banana', x: 2, y: 20, w: 1, h: 1 },
    { id: 'k_mango', type: 'tree', kind: 'mango', x: 34, y: 16, w: 1, h: 1 },
    { id: 'k_palm1', type: 'tree', kind: 'palm', x: 9, y: 24, w: 1, h: 1 },
    { id: 'k_palm2', type: 'tree', kind: 'palm', x: 38, y: 24, w: 1, h: 1 },
    { type: 'torch', x: 10, y: 12 }, { type: 'torch', x: 20, y: 12 }, { type: 'torch', x: 27, y: 9 }, { type: 'torch', x: 33, y: 12 },
    { type: 'torch', x: 23, y: 25 }, { type: 'torch', x: 26, y: 25 }
  ];

  // ------------------------------------------------------------------ Hutan Rimba (rainforest)
  function buildForest() {
    var W = 44, H = 34, g = blank(W, H, 'g'), f = filler(g);
    f.fill(0, 0, W - 1, 1, 'J'); f.fill(0, 0, 1, H - 1, 'J'); f.fill(W - 2, 0, W - 1, H - 1, 'J'); f.fill(0, H - 1, W - 1, H - 1, 'J');
    f.ell(6, 12, 3.2, 2.6, 'J'); f.ell(37, 7, 3, 2.4, 'J'); f.ell(5, 28, 2.6, 2.2, 'J'); f.ell(40, 15, 2.2, 3, 'J'); f.ell(16, 30, 2.4, 1.6, 'J');
    f.ell(34, 22, 5, 3.6, 'q');                    // forest pool
    f.fill(21, 22, 22, 33, 'p'); f.fill(12, 21, 22, 22, 'p'); f.fill(12, 8, 13, 22, 'p'); f.fill(12, 8, 30, 9, 'p'); f.fill(29, 0, 30, 9, 'p');
    f.fill(22, 23, 28, 24, 'p');
    return g;
  }
  var FOREST_OBJECTS = [
    { id: 'f_tualang1', type: 'bldg', x: 17, y: 4, w: 2, h: 1, tex: 'tualang', text: 'A tualang tree, taller than any other in the rainforest. Wild bees nest high in its branches.' },
    { id: 'f_tualang2', type: 'bldg', x: 5, y: 19, w: 2, h: 1, tex: 'tualang', text: 'A giant tualang. Its buttress roots are taller than you.' },
    { id: 'f_tualang3', type: 'bldg', x: 26, y: 14, w: 2, h: 1, tex: 'tualang', text: 'A giant tualang. Hornbills call from the canopy.' },
    { id: 'f_tualang4', type: 'bldg', x: 38, y: 28, w: 2, h: 1, tex: 'tualang', text: 'A giant tualang, older than the kampung.' },
    { id: 'f_rafflesia', type: 'bldg', x: 8, y: 24, w: 2, h: 1, tex: 'rafflesia', text: 'A rafflesia, the biggest flower in the world! It smells... like old fish. Phew.' },
    { id: 'f_durian1', type: 'tree', kind: 'durian', x: 16, y: 15, w: 1, h: 1 },
    { id: 'f_durian2', type: 'tree', kind: 'durian', x: 33, y: 12, w: 1, h: 1 },
    { id: 'f_branch1', type: 'forage', kind: 'branches', x: 25, y: 26 }, { id: 'f_branch2', type: 'forage', kind: 'branches', x: 8, y: 6 },
    { id: 'f_branch3', type: 'forage', kind: 'branches', x: 19, y: 30 }, { id: 'f_branch4', type: 'forage', kind: 'branches', x: 37, y: 18 },
    { id: 'f_branch5', type: 'forage', kind: 'branches', x: 4, y: 16 },
    { id: 'f_mush1', type: 'forage', kind: 'mushroom', x: 4, y: 8 }, { id: 'f_mush2', type: 'forage', kind: 'mushroom', x: 24, y: 18 },
    { id: 'f_mush3', type: 'forage', kind: 'mushroom', x: 30, y: 30 },
    { id: 'f_rattan1', type: 'forage', kind: 'rattan', x: 34, y: 4 }, { id: 'f_rattan2', type: 'forage', kind: 'rattan', x: 3, y: 23 },
    { id: 'f_herb1', type: 'forage', kind: 'herbs', x: 15, y: 11 }, { id: 'f_herb2', type: 'forage', kind: 'herbs', x: 25, y: 4 },
    { id: 'f_herb3', type: 'forage', kind: 'herbs', x: 28, y: 27 },
    { id: 'f_shrine', type: 'shrine', x: 24, y: 30, w: 1, h: 1, tex: 'shrine' },
    { id: 'f_sign', type: 'signpost', x: 31, y: 4, w: 1, h: 1, tex: 'sign', text: 'GUNUNG KABUS (the misty mountain) ^  Rockfall blocks the trail. Pelita at Lv 8 could light the way.' }
  ];

  // ------------------------------------------------------------------ Pulau Mutiara (Pearl Island)
  function buildIsland() {
    var W = 44, H = 32, g = blank(W, H, 'o'), f = filler(g);
    f.ell(22, 17, 19.5, 12.5, 'h'); f.ell(22, 17, 17, 10, 's'); f.ell(22, 18, 11, 6, '.');
    f.ell(21, 13, 4, 2, '.');
    f.fill(21, 3, 22, 8, 'j');
    return g;
  }
  var ISLAND_OBJECTS = [
    { id: 'sampan_island', type: 'sampan', x: 23, y: 4, w: 2, h: 1, to: 'farm' },
    { id: 'i_palm1', type: 'tree', kind: 'palm', x: 12, y: 14, w: 1, h: 1 }, { id: 'i_palm2', type: 'tree', kind: 'palm', x: 31, y: 12, w: 1, h: 1 },
    { id: 'i_palm3', type: 'tree', kind: 'palm', x: 33, y: 20, w: 1, h: 1 }, { id: 'i_palm4', type: 'tree', kind: 'palm', x: 10, y: 21, w: 1, h: 1 },
    { id: 'i_palm5', type: 'tree', kind: 'palm', x: 24, y: 23, w: 1, h: 1 },
    { id: 'i_nipa1', type: 'forage', kind: 'nipa', x: 6, y: 17 }, { id: 'i_nipa2', type: 'forage', kind: 'nipa', x: 37, y: 15 },
    { id: 'i_nipa3', type: 'forage', kind: 'nipa', x: 16, y: 25 }, { id: 'i_nipa4', type: 'forage', kind: 'nipa', x: 30, y: 25 },
    { id: 'i_shell1', type: 'forage', kind: 'shells', x: 8, y: 12 }, { id: 'i_shell2', type: 'forage', kind: 'shells', x: 35, y: 10 },
    { id: 'i_shell3', type: 'forage', kind: 'shells', x: 19, y: 27 }, { id: 'i_shell4', type: 'forage', kind: 'shells', x: 38, y: 21 },
    { id: 'i_shell5', type: 'forage', kind: 'shells', x: 5, y: 21 },
    { id: 'i_hut', type: 'bldg', x: 16, y: 15, w: 3, h: 2, tex: 'beach_hut', text: 'An old fishermen\'s rest hut. Someone left a woven mat and a kettle.' },
    { id: 'i_lighthouse', type: 'bldg', x: 28, y: 15, w: 2, h: 1, tex: 'rumah_api', text: 'A little rumah api (lighthouse). Its lamp guides the night fishing boats home.' },
    { id: 'i_shrine', type: 'shrine', x: 25, y: 9, w: 1, h: 1, tex: 'shrine' }
  ];

  // ------------------------------------------------------------------ Gunung Kabus (misty mountain)
  function buildMountain() {
    var W = 44, H = 34, g = blank(W, H, 'm'), f = filler(g);
    f.fill(0, 0, W - 1, 1, 'M'); f.fill(0, 0, 1, H - 1, 'M'); f.fill(W - 2, 0, W - 1, H - 1, 'M'); f.fill(0, H - 1, W - 1, H - 1, 'M');
    f.ell(32, 9, 6.5, 4.2, 'q');                   // mountain lake
    f.fill(3, 20, 18, 21, 'G'); f.fill(3, 24, 18, 25, 'G'); f.fill(3, 28, 18, 29, 'G');   // tea terraces
    f.ell(9, 8, 3, 2.4, 'M'); f.ell(39, 26, 2.5, 3, 'M'); f.fill(19, 13, 25, 15, 'M'); f.ell(3, 13, 1.5, 3, 'M');
    f.fill(29, 17, 30, 33, 'k'); f.fill(12, 17, 30, 18, 'k'); f.fill(12, 5, 13, 18, 'k'); f.fill(12, 5, 24, 6, 'k');
    f.fill(19, 22, 20, 28, 'k'); f.fill(12, 19, 13, 30, 'k');
    return g;
  }
  var MOUNTAIN_OBJECTS = [
    { id: 'm_tea1', type: 'forage', kind: 'tea', x: 4, y: 20 }, { id: 'm_tea2', type: 'forage', kind: 'tea', x: 8, y: 20 },
    { id: 'm_tea3', type: 'forage', kind: 'tea', x: 16, y: 20 }, { id: 'm_tea4', type: 'forage', kind: 'tea', x: 5, y: 24 },
    { id: 'm_tea5', type: 'forage', kind: 'tea', x: 9, y: 24 }, { id: 'm_tea6', type: 'forage', kind: 'tea', x: 16, y: 24 },
    { id: 'm_berry1', type: 'forage', kind: 'strawberry', x: 5, y: 28 }, { id: 'm_berry2', type: 'forage', kind: 'strawberry', x: 9, y: 28 },
    { id: 'm_berry3', type: 'forage', kind: 'strawberry', x: 16, y: 28 },
    { id: 'm_rock1', type: 'forage', kind: 'boulder', x: 23, y: 24 }, { id: 'm_rock2', type: 'forage', kind: 'boulder', x: 35, y: 30 },
    { id: 'm_rock3', type: 'forage', kind: 'boulder', x: 25, y: 9 }, { id: 'm_rock4', type: 'forage', kind: 'boulder', x: 6, y: 15 },
    { id: 'm_rock5', type: 'forage', kind: 'boulder', x: 40, y: 5 },
    { id: 'm_pine1', type: 'bldg', x: 16, y: 3, w: 1, h: 1, tex: 'pine', text: 'A highland pine, beaded with mist.' },
    { id: 'm_pine2', type: 'bldg', x: 22, y: 20, w: 1, h: 1, tex: 'pine', text: 'A highland pine, beaded with mist.' },
    { id: 'm_pine3', type: 'bldg', x: 34, y: 18, w: 1, h: 1, tex: 'pine', text: 'A highland pine, beaded with mist.' },
    { id: 'm_pine4', type: 'bldg', x: 37, y: 31, w: 1, h: 1, tex: 'pine', text: 'A highland pine, beaded with mist.' },
    { id: 'm_pine5', type: 'bldg', x: 25, y: 29, w: 1, h: 1, tex: 'pine', text: 'A highland pine, beaded with mist.' },
    { id: 'm_pine6', type: 'bldg', x: 3, y: 4, w: 1, h: 1, tex: 'pine', text: 'A highland pine, beaded with mist.' },
    { id: 'm_shrine', type: 'shrine', x: 32, y: 29, w: 1, h: 1, tex: 'shrine' }
  ];

  // ------------------------------------------------------------------ Bukit Pasir (the red dunes)
  function buildDesert() {
    var W = 46, H = 32, g = blank(W, H, 'd'), f = filler(g);
    f.fill(0, 0, W - 1, 1, 'R'); f.fill(0, H - 2, W - 1, H - 1, 'R'); f.fill(0, 0, 0, H - 1, 'R'); f.fill(W - 2, 0, W - 1, H - 1, 'R');
    f.fill(0, 10, 9, 11, 'p');
    f.ell(30, 20, 6.5, 4.6, '.'); f.ell(30, 20, 4, 2.8, 'q');   // oasis
    f.ell(14, 23, 2.6, 2, 'R'); f.ell(39, 8, 2.4, 2, 'R'); f.ell(22, 5, 1.8, 1.4, 'R'); f.ell(6, 18, 1.6, 1.4, 'R');
    return g;
  }
  var DESERT_OBJECTS = [
    { id: 'd_dragon1', type: 'forage', kind: 'dragon', x: 11, y: 14 }, { id: 'd_dragon2', type: 'forage', kind: 'dragon', x: 14, y: 16 },
    { id: 'd_dragon3', type: 'forage', kind: 'dragon', x: 18, y: 13 }, { id: 'd_dragon4', type: 'forage', kind: 'dragon', x: 37, y: 14 },
    { id: 'd_dragon5', type: 'forage', kind: 'dragon', x: 41, y: 19 },
    { id: 'd_clay1', type: 'forage', kind: 'clay', x: 20, y: 26 }, { id: 'd_clay2', type: 'forage', kind: 'clay', x: 7, y: 25 },
    { id: 'd_clay3', type: 'forage', kind: 'clay', x: 41, y: 26 },
    { id: 'd_glint1', type: 'forage', kind: 'glint', x: 26, y: 12 }, { id: 'd_glint2', type: 'forage', kind: 'glint', x: 8, y: 5 },
    { id: 'd_glint3', type: 'forage', kind: 'glint', x: 36, y: 26 },
    { id: 'd_palm1', type: 'tree', kind: 'palm', x: 25, y: 18, w: 1, h: 1 }, { id: 'd_palm2', type: 'tree', kind: 'palm', x: 35, y: 22, w: 1, h: 1 },
    { id: 'd_tower', type: 'bldg', x: 33, y: 4, w: 3, h: 2, tex: 'cham_tower', text: 'An old brick tower of the Cham people, glowing red in the sun. It has watched the dunes for a thousand years.' },
    { id: 'd_shrine', type: 'shrine', x: 5, y: 7, w: 1, h: 1, tex: 'shrine' }
  ];

  // ------------------------------------------------------------------ the atlas
  LC.AREAS = {
    farm: {
      name: 'Nenek\'s Farm', sub: 'home by the river', lvl: 1, build: function () { return LC.buildMap(); },
      objects: null,   // LC.OBJECTS (data.js)
      pond: 'river', amb: 'river', decor: { n: 55, types: ['rock', 'bush', 'hibiscus', 'lalang', 'lalang', 'bush'], on: '.' },
      critters: [{ kind: 'chicken', n: 3, zone: { x0: 6, y0: 8, x1: 18, y1: 12 } }, { kind: 'kerbau', n: 1, zone: { x0: 37, y0: 13, x1: 45, y1: 24 } }],
      exits: [
        { x0: 29, y0: 0, x1: 30, y1: 0, to: 'forest', sx: 21.5, sy: 31.5, dir: 'up', gate: { x: 29, y: 3, w: 2, h: 1, tex: 'gate_vines' } },
        { x0: 47, y0: 10, x1: 47, y1: 11, to: 'kampung', sx: 1.5, sy: 10.5, dir: 'right', gate: { x: 46, y: 10, w: 1, h: 2, tex: 'barrier' } }
      ],
      home: { x: 4.5, y: 8 }
    },
    kampung: {
      name: 'Kampung Tepian', sub: 'the riverside village', lvl: 2, build: buildKampung, objects: KAMPUNG_OBJECTS,
      pond: 'river', amb: 'river', decor: { n: 40, types: ['bush', 'hibiscus', 'lalang', 'rock', 'bush', 'bougainvillea'], on: '.' },
      critters: [{ kind: 'chicken', n: 3, zone: { x0: 14, y0: 12, x1: 22, y1: 14 } }, { kind: 'kerbau', n: 1, zone: { x0: 32, y0: 18, x1: 42, y1: 23 } }],
      exits: [
        { x0: 0, y0: 10, x1: 0, y1: 11, to: 'farm', sx: 44.5, sy: 10.5, dir: 'left' },
        { x0: 45, y0: 10, x1: 45, y1: 11, to: 'desert', sx: 1.5, sy: 10.5, dir: 'right', gate: { x: 43, y: 10, w: 1, h: 2, tex: 'gate_dune' } }
      ],
      kites: true, home: { x: 2.5, y: 10.5 },
      trees: { n: 6, on: '.', tex: ['jtree'], text: 'A shady tree. Children climb it after school.' }
    },
    forest: {
      name: 'Hutan Rimba', sub: 'the old rainforest', lvl: 3, build: buildForest, objects: FOREST_OBJECTS,
      pond: 'stream', amb: 'forest', decor: { n: 60, types: ['fern', 'fern', 'bush', 'rock', 'fern', 'lalang'], on: 'g' },
      critters: [{ kind: 'kancil', n: 2, zone: { x0: 4, y0: 4, x1: 40, y1: 30 } }],
      exits: [
        { x0: 21, y0: 33, x1: 22, y1: 33, to: 'farm', sx: 29.5, sy: 1.5, dir: 'down' },
        { x0: 29, y0: 0, x1: 30, y1: 0, to: 'mountain', sx: 29.5, sy: 31.5, dir: 'up', gate: { x: 29, y: 3, w: 2, h: 1, tex: 'gate_rocks' } }
      ],
      dim: 0.12, home: { x: 21.5, y: 31.5 },
      trees: { n: 34, on: 'g', tex: ['jtree', 'jtree2'], text: 'A rainforest tree, wrapped in vines and humming with insects.' }
    },
    island: {
      name: 'Pulau Mutiara', sub: 'pearl island', lvl: 5, build: buildIsland, objects: ISLAND_OBJECTS,
      pond: 'sea', amb: 'sea', decor: { n: 26, types: ['rock', 'lalang', 'bush', 'coral'], on: 's' },
      critters: [{ kind: 'ketam', n: 3, zone: { x0: 8, y0: 9, x1: 36, y1: 26 } }, { kind: 'penyu', n: 1, zone: { x0: 12, y0: 24, x1: 32, y1: 26 } }],
      exits: [], home: { x: 21.5, y: 4.5 }
    },
    mountain: {
      name: 'Gunung Kabus', sub: 'the misty mountain', lvl: 8, build: buildMountain, objects: MOUNTAIN_OBJECTS,
      pond: 'lake', amb: 'wind', decor: { n: 45, types: ['rock', 'rock', 'lalang', 'fern', 'pebbles'], on: 'm' },
      critters: [],
      exits: [{ x0: 29, y0: 33, x1: 30, y1: 33, to: 'forest', sx: 29.5, sy: 1.5, dir: 'down' }],
      fog: true, home: { x: 29.5, y: 31.5 },
      trees: { n: 14, on: 'm', tex: ['pine'], text: 'A highland pine, beaded with mist.' }
    },
    desert: {
      name: 'Bukit Pasir', sub: 'the red dunes', lvl: 11, build: buildDesert, objects: DESERT_OBJECTS,
      pond: 'oasis', amb: 'wind', decor: { n: 45, types: ['dunegrass', 'dunegrass', 'pebbles', 'rock', 'deadbush'], on: 'd' },
      critters: [{ kind: 'biawak', n: 2, zone: { x0: 4, y0: 4, x1: 42, y1: 28 } }],
      exits: [{ x0: 0, y0: 10, x1: 0, y1: 11, to: 'kampung', sx: 43.5, sy: 10.5, dir: 'left' }],
      warm: true, home: { x: 1.5, y: 10.5 }
    }
  };
  LC.AREA_ORDER = ['farm', 'kampung', 'forest', 'island', 'mountain', 'desert'];
  LC.AREA_HOWTO = {
    farm: 'Home. Sleep in the stilt house.',
    kampung: 'Follow the road east from the farm.',
    forest: 'Take the trail north of the farm.',
    island: 'Row Nenek\'s sampan from the farm jetty.',
    mountain: 'Follow the trail north through Hutan Rimba.',
    desert: 'Follow the road east through the kampung.'
  };

  var grids = {};
  LC.areaGrid = function (id) { if (!grids[id]) grids[id] = LC.AREAS[id].build(); return grids[id]; };
  LC.areaObjects = function (id) { return id === 'farm' ? LC.OBJECTS : LC.AREAS[id].objects; };
  LC.areaOpen = function (id, level) { return level >= LC.AREAS[id].lvl; };

  // every object with an id, across all places (trees and forage share S.trees by id)
  var index = null;
  LC.objById = function (id) {
    if (!index) {
      index = {};
      LC.AREA_ORDER.forEach(function (a) { LC.areaObjects(a).forEach(function (o) { if (o.id) { index[o.id] = o; o.area = a; } }); });
    }
    return index[id];
  };
  LC.allHarvestables = function () {
    var out = [];
    LC.AREA_ORDER.forEach(function (a) { LC.areaObjects(a).forEach(function (o) { if (o.type === 'tree' || o.type === 'forage') out.push(o); }); });
    return out;
  };
})(window.LC);
