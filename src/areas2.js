/* Little Creature — v1.5 places: Kampung Bunian (the hidden village, seen only through the Bunian glasses) and
 * Lombong Puaka (the haunted gold mine under Gunung Kabus), plus the new things in the old places: the reban and
 * goat pen, the fruit-season orchard, the Pesta pavilion and training stone, wild honey, the hidden gate and the
 * boarded-up mine shaft.
 *
 * New tile characters:  c  cave floor   l  mine rails   X  cave wall (solid) */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  LC.SOLID_TILES.X = 1;

  function blank(W, H, ch) { var g = []; for (var y = 0; y < H; y++) { g.push([]); for (var x = 0; x < W; x++) g[y].push(ch); } return g; }
  function filler(g) {
    var H = g.length, W = g[0].length;
    return {
      fill: function (x0, y0, x1, y1, ch) { for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) if (y >= 0 && y < H && x >= 0 && x < W) g[y][x] = ch; },
      ell: function (cx, cy, rx, ry, ch) {
        for (var y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (var x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
          if (y < 0 || y >= H || x < 0 || x >= W) continue;
          var dx = (x - cx) / rx, dy = (y - cy) / ry;
          if (dx * dx + dy * dy <= 1) g[y][x] = ch;
        }
      }
    };
  }

  // ------------------------------------------------------------------ Kampung Bunian (the hidden village)
  function buildBunian() {
    var W = 44, H = 32, g = blank(W, H, '.'), f = filler(g);
    f.fill(0, 0, W - 1, 1, 'J'); f.fill(0, 0, 1, H - 1, 'J'); f.fill(W - 2, 0, W - 1, H - 1, 'J'); f.fill(0, H - 1, W - 1, H - 1, 'J');
    f.ell(21.5, 7, 7, 3.2, 'k');                 // the stone plaza around the keris
    f.fill(21, 10, 22, H - 1, 'p');              // the path south to the gate
    f.fill(4, 15, 39, 16, 'p');                  // the cross street
    f.fill(3, 8, 14, 14, 'k');                   // the northwestern trial court
    f.fill(8, 15, 9, 15, 'k');                   // the court's entrance from the cross street
    f.fill(11, 17, 12, 19, 'p');                 // the approach to Dang Melur's stall
    f.fill(33, 17, 34, 21, 'p');                 // the approach to the lotus pond
    f.ell(33, 25, 5, 3, 'q');                    // the lotus pond
    f.ell(6, 26, 3, 2.4, 'J'); f.ell(40, 8, 1.8, 2.6, 'J');
    return g;
  }
  var BUNIAN_OBJECTS = [
    { id: 'b_keris', type: 'keris', x: 21, y: 6, w: 2, h: 1, tex: 'keris_batu', keep: true },
    { id: 'b_rumah1', type: 'bldg', x: 4, y: 4, w: 4, h: 3, tex: 'rumah_bunian', keep: true, text: 'A Bunian house, carved and gilded, with lamps that burn without oil. It is far grander than it looked from outside.' },
    { id: 'b_rumah2', type: 'bldg', x: 33, y: 3, w: 4, h: 3, tex: 'rumah_bunian', keep: true, text: 'Kesuma\'s house. A row of training staffs leans by the steps.' },
    { id: 'b_rumah3', type: 'bldg', x: 25, y: 19, w: 4, h: 3, tex: 'rumah_bunian', keep: true, text: 'A Bunian house. Somebody inside is playing a rebab, very softly.' },
    { id: 'b_rumah4', type: 'bldg', x: 3, y: 19, w: 4, h: 3, tex: 'rumah_bunian', keep: true, text: 'A Bunian house with a garden of golden flowers. The air smells of jasmine.' },
    { id: 'b_gerai', type: 'bldg', x: 8, y: 17, w: 3, h: 2, tex: 'gerai_bunian', keep: true, text: 'Dang Melur\'s stall of rare goods, hung with tiny lamps.' },
    { id: 'b_frangi1', type: 'bldg', x: 16, y: 12, w: 1, h: 1, tex: 'frangipani', text: 'A kemboja tree in full bloom, as it is all year round here.' },
    { id: 'b_frangi2', type: 'bldg', x: 31, y: 10, w: 1, h: 1, tex: 'frangipani', text: 'A kemboja tree. Its petals drift down and vanish before they touch the ground.' },
    { id: 'b_trial_sign', type: 'signpost', x: 15, y: 14, tex: 'sign', text: 'The four trial doors are in the stone court to the northwest. Ask Penjaga Pintu for advice.' },
    { type: 'torch', x: 18, y: 12 }, { type: 'torch', x: 25, y: 12 }, { type: 'torch', x: 30, y: 14 },
    { type: 'torch', x: 3, y: 8 }, { type: 'torch', x: 14, y: 8 }, { type: 'torch', x: 3, y: 14 }, { type: 'torch', x: 14, y: 14 }
  ];

  // ------------------------------------------------------------------ Lombong Puaka (the haunted gold mine)
  function buildLombong() {
    var W = 44, H = 34, g = blank(W, H, 'X'), f = filler(g);
    f.fill(21, 0, 22, 5, 'c');                       // the shaft down from the mountain
    f.ell(21.5, 7.5, 6.5, 3, 'c');                   // the entrance hall
    f.fill(6, 8, 37, 9, 'c'); f.fill(10, 9, 33, 9, 'l');   // the long gallery and its rails
    f.ell(8, 15, 5, 5, 'c'); f.ell(35, 15, 5, 5, 'c');     // west and east chambers
    f.ell(21.5, 17, 7, 4.5, 'c');                    // the chamber of the underground pool
    f.fill(12, 15, 15, 16, 'c'); f.fill(28, 15, 31, 16, 'c'); f.fill(20, 10, 23, 13, 'c');
    f.ell(21.5, 17.5, 3.4, 1.8, 'q');
    f.fill(7, 19, 8, 23, 'c'); f.fill(35, 19, 36, 23, 'c');
    f.ell(10, 25, 5, 3.4, 'c'); f.ell(33, 25, 5, 3.4, 'c');
    f.fill(12, 27, 31, 28, 'c');                     // the deep gallery
    f.ell(21.5, 29.5, 7, 2.8, 'c');                  // the guardian's hall
    f.fill(0, H - 1, W - 1, H - 1, 'X');
    return g;
  }
  var LOMBONG_OBJECTS = [
    { id: 'l_sign', type: 'signpost', x: 24, y: 5, w: 1, h: 1, tex: 'sign', text: 'LOMBONG EMAS (closed 1931). DANGER. The shadows do not like light. Turn back.' },
    { id: 'g_vein1', type: 'forage', kind: 'goldvein', x: 5, y: 12 }, { id: 'g_vein2', type: 'forage', kind: 'goldvein', x: 11, y: 18 },
    { id: 'g_vein3', type: 'forage', kind: 'goldvein', x: 38, y: 12 }, { id: 'g_vein4', type: 'forage', kind: 'goldvein', x: 32, y: 18 },
    { id: 'g_vein5', type: 'forage', kind: 'goldvein', x: 16, y: 15 }, { id: 'g_vein6', type: 'forage', kind: 'goldvein', x: 27, y: 19 },
    { id: 'g_vein7', type: 'forage', kind: 'goldvein', x: 7, y: 26 }, { id: 'g_vein8', type: 'forage', kind: 'goldvein', x: 13, y: 24 },
    { id: 'g_vein9', type: 'forage', kind: 'goldvein', x: 30, y: 26 }, { id: 'g_vein10', type: 'forage', kind: 'goldvein', x: 36, y: 24 },
    { id: 'g_vein11', type: 'forage', kind: 'goldvein', x: 16, y: 29 }, { id: 'g_vein12', type: 'forage', kind: 'goldvein', x: 27, y: 29 },
    { id: 'g_crys1', type: 'forage', kind: 'crystal', x: 10, y: 13 }, { id: 'g_crys2', type: 'forage', kind: 'crystal', x: 33, y: 13 },
    { id: 'g_crys3', type: 'forage', kind: 'crystal', x: 25, y: 14 },
    { id: 'g_chest', type: 'forage', kind: 'goldchest', x: 21, y: 31 },
    { id: 'l_cart1', type: 'bldg', x: 35, y: 8, w: 1, h: 1, tex: 'kereta_lombong', text: 'A rusted ore cart, still half full of rock. Nobody came back for it.' },
    { id: 'l_cart2', type: 'bldg', x: 7, y: 8, w: 1, h: 1, tex: 'kereta_lombong', text: 'An old ore cart. Someone scratched "JANGAN" (don\'t) into its side.' },
    { type: 'torch', x: 16, y: 6 }, { type: 'torch', x: 27, y: 6 }, { type: 'torch', x: 5, y: 15 }, { type: 'torch', x: 38, y: 15 },
    { type: 'torch', x: 14, y: 27 }, { type: 'torch', x: 29, y: 27 }
  ];

  LC.AREAS.bunian = {
    name: 'Kampung Bunian', sub: 'the hidden village of the Orang Bunian', lvl: 3, wear: 'glasses', build: buildBunian, objects: BUNIAN_OBJECTS,
    pond: 'stream', amb: 'forest', decor: { n: 44, types: ['fern', 'bougainvillea', 'hibiscus', 'bush', 'fern', 'lalang'], on: '.' },
    critters: [{ kind: 'kancil', n: 2, zone: { x0: 4, y0: 17, x1: 20, y1: 28 } }],
    exits: [{ x0: 21, y0: 31, x1: 22, y1: 31, to: 'forest', sx: 8.5, sy: 19, dir: 'down' }],
    golden: true, frozenClock: true, home: { x: 21.5, y: 29 }, ride: {},
    trees: { n: 12, on: '.', tex: ['jtree', 'jtree2'], text: 'An ancient tree, its leaves edged with gold.' }
  };
  LC.AREAS.lombong = {
    name: 'Lombong Puaka', sub: 'the haunted gold mine', lvl: 9, build: buildLombong, objects: LOMBONG_OBJECTS,
    pond: 'cave', amb: 'cave', decor: { n: 52, types: ['stalagmite', 'stalagmite', 'rubble', 'crystal_s', 'cobweb', 'rubble'], on: 'c' },
    critters: [], cave: true,
    enemies: [
      { kind: 'kelawar', n: 3, zone: { x0: 9, y0: 5, x1: 34, y1: 10 } },
      { kind: 'bayang', n: 2, zone: { x0: 4, y0: 11, x1: 12, y1: 19 } },
      { kind: 'bayang', n: 2, zone: { x0: 31, y0: 11, x1: 39, y1: 19 } },
      { kind: 'bayang', n: 1, zone: { x0: 15, y0: 13, x1: 28, y1: 21 } },
      { kind: 'lipan', n: 2, zone: { x0: 6, y0: 23, x1: 14, y1: 27 } },
      { kind: 'lipan', n: 2, zone: { x0: 29, y0: 23, x1: 37, y1: 27 } },
      { kind: 'penunggu', n: 1, zone: { x0: 17, y0: 28, x1: 26, y1: 31 } }
    ],
    exits: [{ x0: 21, y0: 0, x1: 22, y1: 0, to: 'mountain', sx: 35, sy: 24, dir: 'down' }],
    home: { x: 21.5, y: 3 }, ride: {}
  };
  LC.AREA_ORDER = ['farm', 'kampung', 'forest', 'bunian', 'island', 'laut', 'mountain', 'lombong', 'desert'];
  LC.AREA_HOWTO.bunian = 'Befriend the Orang Bunian in Hutan Rimba and grant its request. Then wear the glasses near the giant tualang in the west of the forest.';
  LC.AREA_HOWTO.lombong = 'Find the boarded-up mine shaft in Gunung Kabus. Bring a weapon!';
  // the land, as drawn on the map (columns and rows of the atlas)
  LC.MAP_POS = { mountain: [2, 0], lombong: [3, 0], forest: [2, 1], bunian: [1, 1], farm: [2, 2], kampung: [3, 2], desert: [4, 2], island: [2, 3], laut: [1, 3] };
  LC.MAP_LINKS = [['farm', 'kampung'], ['kampung', 'desert'], ['farm', 'forest'], ['forest', 'mountain'], ['mountain', 'lombong', 1], ['forest', 'bunian', 1], ['farm', 'island', 1], ['island', 'laut', 1]];

  // ------------------------------------------------------------------ new things in the old places
  LC.AREAS.farm.critters = [{ kind: 'kerbau', n: 1, zone: { x0: 37, y0: 13, x1: 45, y1: 24 } }];   // your own animals live at the reban now
  LC.AREAS.farm.animalZone = { coop: { x0: 16, y0: 5, x1: 27, y1: 8 }, pen: { x0: 22, y0: 5, x1: 28, y1: 8 } };
  LC.OBJECTS.push(
    { id: 'reban', type: 'coop', x: 18, y: 3, w: 3, h: 2, tex: 'reban', keep: true },
    { id: 'kandang', type: 'coop', x: 23, y: 3, w: 4, h: 2, tex: 'kandang', keep: true },
    { id: 'o_rambutan', type: 'tree', kind: 'rambutan', x: 38, y: 15, w: 1, h: 1 },
    { id: 'o_manggis', type: 'tree', kind: 'manggis', x: 44, y: 15, w: 1, h: 1 },
    { id: 'o_duku', type: 'tree', kind: 'duku', x: 38, y: 21, w: 1, h: 1 },
    { id: 'o_cempedak', type: 'tree', kind: 'cempedak', x: 44, y: 21, w: 1, h: 1 }
  );
  LC.AREAS.kampung.objects.push(
    { id: 'k_pesta', type: 'pesta', x: 14, y: 19, w: 5, h: 2, tex: 'gelanggang', keep: true },
    { id: 'k_batu', type: 'lift', x: 8, y: 20, w: 2, h: 1, tex: 'batu_angkat', keep: true }
  );
  LC.AREAS.forest.objects.push(
    { id: 'f_gate', type: 'bunian_gate', x: 8, y: 17, w: 2, h: 2, tex: 'pintu_bunian', hidden: 'glasses', keep: true, to: 'bunian' },
    { id: 'f_honey1', type: 'forage', kind: 'honey', x: 19, y: 4, keep: true },
    { id: 'f_honey2', type: 'forage', kind: 'honey', x: 7, y: 20, keep: true }
  );
  LC.AREAS.mountain.objects.push({ id: 'm_lombong', type: 'portal', x: 34, y: 22, w: 3, h: 2, tex: 'lombong_pintu', to: 'lombong', keep: true });

  // can a storage chest go on this tile? (walkable ground, nothing else there, not in a doorway)
  var NO_CHEST = { f: 1, r: 1, b: 1, j: 1, q: 1 };
  LC.chestSpotOk = function (area, x, y) {
    var A = LC.AREAS[area], g = A && LC.areaGrid(area), S = LC.State.s;
    if (!g || A.underwater || A.cave || !g[y] || g[y][x] === undefined) return false;
    var ch = g[y][x];
    if (LC.SOLID_TILES[ch] || LC.WATER_TILES[ch] || NO_CHEST[ch]) return false;
    if (Math.abs(x - Math.floor(A.home.x)) <= 1 && Math.abs(y - Math.floor(A.home.y)) <= 1) return false;
    var bad = LC.areaObjects(area).some(function (o) { return x >= o.x - (o.type === 'forage' ? 0 : 0) && x < o.x + (o.w || 1) && y >= o.y && y < o.y + (o.h || 1) + (o.type === 'bldg' || o.type === 'coop' || o.type === 'pesta' ? 1 : 0); });
    if (bad) return false;
    if (A.exits.some(function (e) { return x >= e.x0 - 1 && x <= e.x1 + 1 && y >= e.y0 - 1 && y <= e.y1 + 1; })) return false;
    var vil = LC.villagerPosts(area).some(function (p) { return p.x === x && p.y === y; });
    if (vil) return false;
    if (area === 'kampung' && Object.keys(LC.PLOT_POSTS).some(function (k) { var p = LC.PLOT_POSTS[k]; return p.x === x && p.y === y; })) return false;
    if (LC.SPIRIT_ORDER.some(function (sid) { var sp = LC.SPIRITS[sid]; return sp.area === area && sp.x === x && sp.y === y; })) return false;
    return !Object.keys(S.chests || {}).some(function (id) { var c = S.chests[id]; return c.area === area && c.x === x && c.y === y; });
  };
})(window.LC);
