/* Little Creature — Chapter 11: Bulan dan Mutiara, "The Moon and the Pearls" (v3.3). Part 1. It begins the night after
 * Chapter 10, on the same save. The user asked for the Sultan of Sulu, for Barunai and Sulu fighting a foreign fleet
 * together (Part 2, in 1578, the year of the Castilian War), for a scene where you captain a ship on the open sea and find
 * your way with a compass, and for a fight on a ship's deck (Part 2). Sea and wind effects everywhere.
 * Sources: the Sultanate of Sulu (Lupah Sug), its pearl trade and its old ties to Brunei; the Sama Dilaut (Bajau) sea
 * people, their lepa boats and their navigators; the kulintang gongs; and the Bakunawa, the sea serpent of Philippine
 * legend that swallows the moon in an eclipse until people bang gongs and pots to make it spit the moon out.
 * Respect: the Sultan is invented and lived long ago (no real sultan, no present-day claims, no Sabah claim), there is no
 * religion, no group is shown as villains, and nobody is hurt for good: the Bakunawa becomes a friend.
 *  0 (the night after Chapter 10) rest at the farm. After 8 PM the moon goes dark: the Bakunawa rises from the river and
 *    lunges at Pelita, who shines like a full moon. A vinta comes upriver with its gongs beating, and drives it off
 *  1 talk to Mbo' Arani, the old Sama Dilaut navigator, at the farm jetty, and sail with him to Sulu
 *  2 the Sultan of Sulu: the Bakunawa swallowed his heirloom pearls, the Mutiara Kembar, that shine like two little moons
 *  3 ready the vinta: learn the kulintang with Mak Jaliha, dive with Dinda for the batu berani (a lodestone) so Mbo' Arani
 *    can make a pedoman (a compass), and bring provisions for the crew (2 Tiyula Itum)
 *  4 take the helm: sail the open Sulu Sea by the pedoman and the old chart (north-east to Batu Kembar, east through the
 *    fog, south in the dark water) to Pulau Bulan, the island with no shadow
 *  5 the Bakunawa: strike the three agung gongs together and it rises, dazed. When it is beaten it spits out the pearls;
 *    it is lonely, and Pelita gives it a little light of its own
 *  6 bring the Mutiara Kembar home to the Sultan   7 Part 1 complete (Part 2 comes next)
 * Reward: your own vinta to sail the Sulu Sea, 12,000 kepeng, 3 pearls, new friends, Tiyula Itum and Panyalam. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  function addItems(map) { Object.keys(map).forEach(function (id) { var it = map[id]; it.id = id; it.icon = it.icon || 'i_' + id; LC.ITEMS[id] = it; }); }
  addItems({
    batu_berani: { name: 'Batu Berani', kind: 'treasure', desc: 'A lodestone: a black stone that always turns to the north. The old navigators of the Sama Dilaut kept one on a sliver of wood in a bowl of water.' },
    pedoman: { name: 'Pedoman', kind: 'treasure', desc: 'Mbo\' Arani\'s compass: the batu berani in a little brass bowl, with the eight winds painted round the rim in Malay. At sea, it shows you the way.' },
    mutiara_kembar: { name: 'Mutiara Kembar', kind: 'treasure', desc: 'The twin pearls of the Sultan of Sulu, each as big as a quail\'s egg. In the dark they shine like two little moons.' },
    tiyula_itum: { name: 'Tiyula Itum', kind: 'dish', price: 90, sell: 120, food: { full: 50, joy: 18 }, desc: 'The black soup of the Tausug: meat simmered with burnt coconut, turmeric, ginger and lemongrass. Dark as the night sea, and warming.' },
    panyalam: { name: 'Panyalam', kind: 'dish', price: 50, sell: 70, food: { full: 30, joy: 24 }, desc: 'A lacy rice pancake from Sulu, crisp at the edges and sweet in the middle.' }
  });
  ['batu_berani', 'pedoman', 'mutiara_kembar'].forEach(function (id) { LC.FIXED_ITEMS[id] = 1; });
  LC.RECIPES.push({ out: 'tiyula_itum', inp: { daging_ayam: 1, kelapa: 1, herba: 1 } });
  LC.RECIPES.push({ out: 'panyalam', inp: { padi: 2, kelapa: 1 } });
  LC.FORAGE.tiram11 = { name: 'Pearl oyster', verb: 'Open the pearl oyster', item: 'mutiara', count: 1, regrow: 4, energy: 1 };

  function q(S) { return (S && S.quests) || {}; }
  function c11(S) { return q(S).ch11 || 0; }
  LC.ch11Step = function () { return c11(LC.State.s); };
  LC.CH11_END = 7;

  var T = 16;
  LC.C11 = {
    hookFrom: 20 * 60,                                   // the night after Chapter 10, from 8 PM
    gongs: 5, patterns: [3, 4, 5],                       // the kulintang lesson: three rounds
    provisions: { tiyula_itum: 2 },
    // the open sea (tiles): the harbour, then the chart's three legs
    harbour: { x: 8.5, y: 40.5, r: 4.5 },
    legs: [
      { to: [40.5, 17.5], r: 6, dir: 'Timur Laut', en: 'north-east' },
      { to: [91, 22], r: 8, dir: 'Timur', en: 'east' },
      { to: [97.5, 49.5], r: 5.5, dir: 'Selatan', en: 'south' }
    ],
    bulan: { x: 97.5, y: 49.5, r: 5 },                    // where you drop anchor at Pulau Bulan
    fog: { x0: 48, y0: 4, x1: 88, y1: 34 },
    dark: { x0: 86, y0: 12, x1: 119, y1: 79 },
    storm: { x0: 54, y0: 50, x1: 80, y1: 78 },
    whirl: [[70, 43], [83, 38], [104, 70]],
    ship: { speed: 88, turn: 1.9, accel: 70, drag: 0.55, shallow: 0.55 },
    // Pulau Bulan: the Bakunawa
    boss: { hp: 90, dmg: 10, spoutDmg: 8, path: { x: 20, y: 13, rx: 15.5, ry: 11.5 }, gongFor: 13, daze: 8, lungeEvery: 4.2, spoutEvery: 3.4, spoutR: 15 },
    reward: 12000
  };

  function grid(W, H, ch) { var g = []; for (var y = 0; y < H; y++) { g.push([]); for (var x = 0; x < W; x++) g[y].push(ch); } return g; }
  function fill(g, x0, y0, x1, y1, ch) { for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) if (g[y] && x >= 0 && x < g[0].length) g[y][x] = ch; }
  function ell(g, cx, cy, rx, ry, ch) { for (var y = 0; y < g.length; y++) for (var x = 0; x < g[0].length; x++) { var dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry; if (dx * dx + dy * dy <= 1) g[y][x] = ch; } }

  // ================================================================ Lupah Sug: the town, the astana, the market and the Sama Dilaut village on the water
  function buildSulu() {
    var W = 58, H = 42, g = grid(W, H, '.');
    fill(g, 0, 0, W - 1, 1, 'J'); fill(g, 0, 0, 1, 31, 'J');
    fill(g, 18, 2, 37, 11, 'k'); fill(g, 27, 12, 28, 13, 'k');            // the astana's yard on the hill
    fill(g, 5, 4, 13, 10, 'k');                                            // the gong hall's yard
    fill(g, 2, 14, 39, 15, 'p');                                           // the town road
    fill(g, 8, 17, 22, 22, 'k');                                           // the market
    fill(g, 26, 16, 27, 29, 'p');                                          // down to the harbour
    fill(g, 0, 30, 39, 31, 's'); fill(g, 0, 32, W - 1, H - 1, 'o');        // the beach and the sea
    fill(g, 38, 12, 39, 31, 's'); fill(g, 40, 12, W - 1, 31, 'o');         // the lagoon of the Sama Dilaut
    fill(g, 38, 22, 54, 23, 'j');                                          // the boardwalk
    fill(g, 46, 14, 47, 21, 'j'); fill(g, 50, 24, 51, 37, 'j');
    fill(g, 26, 30, 27, 39, 'j');                                          // the jetty
    return g;
  }
  var SL_OBJ = [
    { id: 'sl_astana', type: 'bldg', x: 22, y: 3, w: 11, h: 4, tex: 'astana11', keep: true, text: 'The Astana of the Sultan of Sulu: a palace of hardwood on tall posts, its eaves carved with okir, curling leaves and waves in red, yellow and green. Long banners stir on their poles.' },
    { id: 'sl_panji1', type: 'bldg', x: 20, y: 9, tex: 'panji11', text: 'A tall banner of the Astana, snapping in the sea wind.' },
    { id: 'sl_panji2', type: 'bldg', x: 35, y: 9, tex: 'panji11', text: 'A tall banner of the Astana, snapping in the sea wind.' },
    { id: 'sl_lampu1', type: 'bldg', x: 25, y: 9, tex: 'pelita9', light: 0xffc070, text: 'A brass lamp by the Astana steps.' },
    { id: 'sl_lampu2', type: 'bldg', x: 30, y: 9, tex: 'pelita9', light: 0xffc070, text: 'A brass lamp by the Astana steps.' },
    { id: 'sl_balai', type: 'bldg', x: 6, y: 5, w: 5, h: 3, tex: 'balai11', keep: true, text: 'The gong hall: an open pavilion with a kulintang (a row of eight little brass gongs on a carved frame), two big agung, and a drum. Somebody is always playing.' },
    { id: 'sl_gerai1', type: 'bldg', x: 9, y: 18, w: 3, h: 2, tex: 'gerai11', text: 'A market stall piled with dried fish, sea grapes and baskets of cassava.' },
    { id: 'sl_gerai2', type: 'bldg', x: 13, y: 18, w: 3, h: 2, tex: 'gerai11b', text: 'A stall of woven mats and bright cloth: the squares of a pis syabit headcloth, every one a different pattern.' },
    { id: 'sl_gerai3', type: 'bldg', x: 17, y: 18, w: 3, h: 2, tex: 'gerai11', text: 'Pearls! Little ones in dishes, and the shells they came from, shining like the inside of the moon.' },
    { id: 'sl_rumah1', type: 'bldg', x: 3, y: 24, w: 4, h: 3, tex: 'rumah9', keep: true, text: 'A Tausug house on stilts, with carved posts. A cat sleeps on the top step.' },
    { id: 'sl_rumah2', type: 'bldg', x: 14, y: 24, w: 4, h: 3, tex: 'rumah9b', keep: true, text: 'A house with a yard of cassava and chillies.' },
    { id: 'sl_rumah3', type: 'bldg', x: 31, y: 18, w: 4, h: 3, tex: 'rumah9', keep: true, text: 'A boat builder\'s house: half a vinta lies in the yard, waiting for its outriggers.' },
    { id: 'sl_rumah4', type: 'bldg', x: 31, y: 24, w: 4, h: 3, tex: 'rumah9b', keep: true, text: 'A house with fishing nets hung out to dry.' },
    { id: 'sl_sign', type: 'signpost', x: 3, y: 13, tex: 'sign', text: 'LUPAH SUG.  North: the Astana.  West: the gong hall.  East: the village of the Sama Dilaut.  South: the harbour.' },
    { id: 'sl_jong', type: 'jong5', x: 21, y: 33, w: 5, h: 3, tex: 'jong_majapahit' },
    { id: 'sl_vinta', type: 'helm11', x: 28, y: 35, w: 4, h: 2, tex: 'vinta11', keep: true },
    // the village on the water
    { id: 'sl_air1', type: 'bldg', x: 41, y: 18, w: 3, h: 3, tex: 'rumah11', keep: true, text: 'A Sama Dilaut house on stilts over the lagoon. Children dive from the doorstep.' },
    { id: 'sl_air2', type: 'bldg', x: 48, y: 18, w: 3, h: 3, tex: 'rumah11', keep: true, text: 'A house on the water, with a lepa tied to every post.' },
    { id: 'sl_air3', type: 'bldg', x: 52, y: 19, w: 3, h: 3, tex: 'rumah11', keep: true, text: 'Seaweed is drying on the rail, and a grandmother is mending a net.' },
    { id: 'sl_air4', type: 'bldg', x: 43, y: 26, w: 3, h: 3, tex: 'rumah11', keep: true, text: 'A house on the water. Someone inside is singing to a baby, very softly.' },
    { id: 'sl_air5', type: 'bldg', x: 53, y: 28, w: 3, h: 3, tex: 'rumah11', keep: true, text: 'Dinda\'s family house. Her wooden diving goggles hang on a nail by the door.' },
    { id: 'sl_lepa1', type: 'bldg', x: 44, y: 30, w: 3, h: 1, tex: 'lepa11', text: 'A lepa, a Sama Dilaut houseboat, with its bow carved like a curling wave. Some families still live on theirs.' },
    { id: 'sl_lepa2', type: 'bldg', x: 54, y: 34, w: 3, h: 1, tex: 'lepa11', text: 'A lepa, rocking gently. A rooster stands on its roof as if he owns it.' },
    { id: 'sl_lepa3', type: 'bldg', x: 41, y: 34, w: 3, h: 1, tex: 'lepa11', text: 'A lepa with a little clay stove on its deck, and fish grilling.' },
    { id: 'sl_selam', type: 'selam11', x: 50, y: 38, tex: 'selam11' }
  ];
  [[3, 29], [10, 28], [20, 29], [33, 29], [36, 13], [4, 17], [23, 21], [37, 26]].forEach(function (t, i) { SL_OBJ.push({ id: 'sl_palm' + i, type: 'bldg', x: t[0], y: t[1], tex: 'palm', text: 'A coconut palm, leaning out over the sea.' }); });
  LC.AREAS.sulu = {
    name: 'Lupah Sug', sub: 'Sulu: the land of the Tausug and the Sama Dilaut', lvl: 20, build: buildSulu, objects: SL_OBJ,
    pond: 'sea', amb: 'beach', decor: { n: 40, types: ['hibiscus', 'bush', 'lalang', 'bougainvillea', 'rock'], on: '.' },
    critters: [{ kind: 'ketam', n: 2, zone: { x0: 4, y0: 30, x1: 36, y1: 31 } }],
    clear: [{ x: 27, y: 10, r: 2 }, { x: 9, y: 10, r: 2 }, { x: 12, y: 22, r: 2 }, { x: 25, y: 31, r: 2 }],
    exits: [], home: { x: 26.5, y: 30.5 }, ride: {}
  };

  // ================================================================ the reef under the village: pearl oysters, and an old sunken boat
  function buildTerumbu() {
    var W = 34, H = 26, g = grid(W, H, 'u');
    fill(g, 0, 0, W - 1, 0, 'C'); fill(g, 0, H - 1, W - 1, H - 1, 'C'); fill(g, 0, 0, 0, H - 1, 'C'); fill(g, W - 1, 0, W - 1, H - 1, 'C');
    ell(g, 12, 13, 3, 2, 'C'); ell(g, 26, 18, 2.5, 2, 'C'); ell(g, 18, 5, 2, 1.5, 'C'); ell(g, 5, 19, 2, 2, 'C');
    fill(g, 3, 5, 28, 6, 'v'); fill(g, 16, 6, 17, 22, 'v');
    return g;
  }
  var TR_OBJ = [
    { id: 'tr_naik', type: 'naik11', x: 4, y: 3, tex: 'selam11' },
    { id: 'tr_karam', type: 'karam11', x: 24, y: 8, w: 3, h: 2, tex: 'karam11', keep: true },
    { id: 'tr_tiram1', type: 'forage', kind: 'tiram11', x: 8, y: 10 }, { id: 'tr_tiram2', type: 'forage', kind: 'tiram11', x: 21, y: 13 },
    { id: 'tr_tiram3', type: 'forage', kind: 'tiram11', x: 9, y: 21 }, { id: 'tr_tiram4', type: 'forage', kind: 'tiram11', x: 28, y: 22 },
    { id: 'tr_kima1', type: 'forage', kind: 'clam', x: 13, y: 17 }, { id: 'tr_kima2', type: 'forage', kind: 'clam', x: 24, y: 4 },
    { id: 'tr_rumpai1', type: 'forage', kind: 'seaweed', x: 4, y: 14 }, { id: 'tr_rumpai2', type: 'forage', kind: 'seaweed', x: 30, y: 12 }
  ];
  LC.AREAS.terumbu = {
    name: 'Terumbu Sulu', sub: 'the pearl beds under the village', lvl: 20, needs: 'naga', build: buildTerumbu, objects: TR_OBJ,
    pond: null, amb: 'deep', decor: { n: 40, types: ['kelp', 'seagrass', 'anemone', 'shellrock', 'kelp'], on: 'u' },
    critters: [{ kind: 'ikan_kecil', n: 5, zone: { x0: 2, y0: 2, x1: 31, y1: 23 } }],
    exits: [], underwater: true, home: { x: 4.5, y: 4.8 }, ride: {}
  };

  // ================================================================ Laut Sulu: the open sea (you are the captain here)
  function buildLaut() {
    var W = 120, H = 80, g = grid(W, H, 'o');
    for (var y = 0; y < H; y++) {                                          // the coast of Lupah Sug, ragged
      var cx = 4 + Math.round(Math.sin(y * 0.45) * 1.2 + Math.sin(y * 0.17) * 1.4);
      if (y >= 36 && y <= 45) cx = 2;                                      // (the harbour bay)
      fill(g, 0, y, cx, y, '.'); fill(g, cx + 1, y, cx + 1, y, 's'); fill(g, cx + 2, y, cx + 3, y, 'h');
    }
    fill(g, 3, 40, 6, 41, 'j');                                            // the harbour pier
    ell(g, 40.5, 17.5, 3.6, 3.2, 'h');                                     // shallows round Batu Kembar
    ell(g, 28, 60, 6, 3.4, 'h'); ell(g, 28, 60, 4.2, 2, 's');              // Pulau Pasir, a sandbar
    ell(g, 63, 10, 7, 4.6, 'h'); ell(g, 63, 10, 5.2, 3.2, 's'); ell(g, 63, 10, 3.6, 2.2, '.');   // Pulau Kecil
    ell(g, 77, 64, 6, 4.4, 'h'); ell(g, 77, 64, 4.2, 3, 's'); ell(g, 77, 64, 2.8, 1.8, '.');     // Pulau Tiga
    ell(g, 97.5, 57, 8, 6.4, 'h'); ell(g, 97.5, 57, 6, 4.6, 's'); ell(g, 97.5, 57, 4.2, 3.2, '.'); // Pulau Bulan
    ell(g, 108, 30, 5, 3.4, 'h'); ell(g, 108, 30, 3.2, 2, 's');            // a nameless sandbar in the dark water
    return g;
  }
  var LS_OBJ = [
    { id: 'ls_kembar', type: 'bldg', x: 40, y: 17, w: 2, h: 1, tex: 'batu_kembar11', text: 'Batu Kembar: two tall rocks standing together in the sea, like two sisters holding hands.' },
    { id: 'ls_bulan', type: 'bldg', x: 97, y: 57, tex: 'batu_bulan11', text: 'Pulau Bulan.' }
  ];
  [[44, 20], [37, 14], [52, 42], [56, 45], [60, 41], [54, 48], [92, 45], [102, 47], [90, 52], [105, 54], [72, 22], [80, 14], [33, 52], [22, 30], [112, 40]].forEach(function (t, i) {
    LS_OBJ.push({ id: 'ls_karang' + i, type: 'bldg', x: t[0], y: t[1], tex: 'karang11', text: 'A reef rock, white with foam. Mind the hull!' });
  });
  LS_OBJ.push({ id: 'ls_rumah1', type: 'bldg', x: 0, y: 33, w: 3, h: 3, tex: 'rumah11', text: 'The houses of Lupah Sug, on their stilts.' }, { id: 'ls_rumah2', type: 'bldg', x: 0, y: 46, w: 3, h: 3, tex: 'rumah11', text: 'The houses of Lupah Sug, on their stilts.' });
  [[62, 9], [65, 11], [76, 63], [78, 65], [95, 56], [100, 58], [1, 10], [1, 22], [1, 54], [1, 66]].forEach(function (t, i) {
    LS_OBJ.push({ id: 'ls_palm' + i, type: 'bldg', x: t[0], y: t[1], tex: 'palm', text: 'A coconut palm on a little island.' });
  });
  LC.AREAS.lautsulu = {
    name: 'Laut Sulu', sub: 'the open sea', lvl: 20, build: buildLaut, objects: LS_OBJ, sailing: true,
    pond: 'sea', amb: 'beach', decor: { n: 0, types: ['rock'], on: '.' },
    exits: [], home: { x: 10.5, y: 40.5 }, ride: {}
  };

  // ================================================================ Pulau Bulan: the island with no shadow (the Bakunawa's island)
  function buildBulan() {
    var W = 40, H = 30, g = grid(W, H, 'o');
    ell(g, 20, 13, 12.5, 9, 'h'); ell(g, 20, 13, 11, 7.8, 's'); ell(g, 20, 12.5, 9, 6, '.');
    fill(g, 19, 21, 20, 27, 'j');                                          // the landing
    return g;
  }
  var BL_OBJ = [
    { id: 'bl_agung0', type: 'agung11', i: 0, x: 11, y: 11, tex: 'agung11' },
    { id: 'bl_agung1', type: 'agung11', i: 1, x: 29, y: 11, tex: 'agung11' },
    { id: 'bl_agung2', type: 'agung11', i: 2, x: 20, y: 7, tex: 'agung11' },
    { id: 'bl_batu1', type: 'bldg', x: 15, y: 8, tex: 'batu_bulan11', text: 'A stone as white as moonlight, carved with a crescent. Seven crescents, all round the island.' },
    { id: 'bl_batu2', type: 'bldg', x: 25, y: 8, tex: 'batu_bulan11', text: 'A white stone carved with a crescent moon.' },
    { id: 'bl_batu3', type: 'bldg', x: 14, y: 16, tex: 'batu_bulan11', text: 'A white stone carved with a crescent moon.' },
    { id: 'bl_batu4', type: 'bldg', x: 26, y: 16, tex: 'batu_bulan11', text: 'A white stone carved with a crescent moon.' },
    { id: 'bl_vinta', type: 'helm11', x: 21, y: 25, w: 4, h: 2, tex: 'vinta11', keep: true }
  ];
  [[10, 14], [30, 14], [17, 5], [23, 5], [12, 8], [28, 8]].forEach(function (t, i) { BL_OBJ.push({ id: 'bl_palm' + i, type: 'bldg', x: t[0], y: t[1], tex: 'palm', text: 'A palm, silver in the moonlight. It casts no shadow at all.' }); });
  LC.AREAS.bulan = {
    name: 'Pulau Bulan', sub: 'the island with no shadow', lvl: 20, build: buildBulan, objects: BL_OBJ,
    pond: 'sea', amb: 'beach', decor: { n: 18, types: ['lalang', 'rock', 'pebbles'], on: '.' },
    clear: [{ x: 20, y: 12, r: 4 }],
    exits: [], home: { x: 19.5, y: 21.5 }, ride: {}
  };
  LC.AREA_HOWTO.sulu = 'Sail on the jong from Nenek\'s jetty (Chapter 11).';
  LC.AREA_HOWTO.terumbu = 'Dive at the end of the boardwalk in the Sama Dilaut village, Lupah Sug (Chapter 11).';
  LC.AREA_HOWTO.lautsulu = 'Take the helm of the vinta at the jetty of Lupah Sug (Chapter 11).';
  LC.AREA_HOWTO.bulan = 'Sail the Sulu Sea by the old chart (Chapter 11).';

  // the vinta, tied up at the farm jetty after the dark moon
  LC.OBJECTS.push({ id: 'f_vinta11', type: 'arani11', x: 16, y: 30, w: 4, h: 2, tex: 'vinta11', keep: true, when: function (S) { return c11(S) === 1; } });

  // the Bakunawa (only its head can be struck, and only when it rises)
  LC.ENEMIES.bakunawa11 = { name: 'Bakunawa', hp: LC.C11.boss.hp, speed: 0, dmg: LC.C11.boss.dmg, sight: 520, w: 18, boss: true, drop: [] };

  // ================================================================ the people of Lupah Sug
  function look(shirt, hat, extra) { return Object.assign({ skin: '#a8714a', shirt: shirt, shirt2: shirt, bottom: '#5a4a3a', bottom2: '#40342a', hair: '#1a1210', hat: hat }, extra || {}); }
  function from(st) { return function (S) { return c11(S) < st; }; }
  Object.assign(LC.VILLAGERS, {
    sultan_sulu: {
      name: 'The Sultan of Sulu', role: 'The Sultan of Lupah Sug', area: 'sulu', post: { x: 27, y: 9 },
      look: look('#2a6a4a', 'tanjak_gold', { skin: '#9a6440', shirt2: '#c4922f', bottom: '#8a1e2a', bottom2: '#6a141e', beard: '#2a1a10' }),
      intro: ['So. The friend of spirits, the one who made peace under the sea. Welcome to Lupah Sug.', 'Forgive me if I do not smile. Seven nights ago the sea took something from me that no sultan before me ever lost.'],
      chat: ['Our pearls have gone to China, to Melaka, to Barunai. The sea gives, and we trade, and the sea gives again.', 'A Tausug says: the sea is not a wall between islands. It is the road.', 'My grandmother could dive deeper than any man in the palace guard. She never let them forget it.', 'Listen to the kulintang in the evening. It tells you how the day went.'],
      tasks: [['ikan_kerapu', 1, 2], ['mangga', 2, 3], ['tiyula_itum', 1, 1]], taskText: 'for the Astana kitchen', gifts: { 3: ['kepeng', 1500], 6: ['mutiara', 2], 10: ['kepeng', 5000] },
      hideIf: from(2)
    },
    arani: {
      name: 'Mbo\' Arani', role: 'Navigator of the Sama Dilaut', area: 'sulu', post: { x: 25, y: 31 },
      look: look('#3a5a7a', 'headband', { skin: '#7a4a2e', shirt2: '#2a4460', bottom: '#c8a040', bottom2: '#a88030', beard: '#d8d0c0', hair: '#d8d0c0' }),
      intro: ['Hah! The farmer with the little moon. I am Arani. The children call me Mbo\'. Grandfather.', 'I was born on a lepa and I will die on one. I have never once been lost at sea. Twice, maybe. Three times.'],
      chat: ['The stars are the oldest chart. The batu berani is the second oldest. Your eyes are the worst.', 'When the water is green, it is shallow. When it is black, it is deep. When it is white, turn round.', 'My granddaughter Dinda dives better than I ever did. Do not tell her.', 'Utara, Timur Laut, Timur, Tenggara, Selatan, Barat Daya, Barat, Barat Laut. Say it with me. Again.'],
      tasks: [['ikan_bakar', 1, 2], ['tiyula_itum', 1, 1], ['kelapa', 2, 3]], taskText: 'for the crew of the vinta', gifts: { 3: ['kepeng', 800], 6: ['mutiara', 1], 10: ['kepeng', 2500] },
      hideIf: from(2)
    },
    dinda: {
      name: 'Dinda', role: 'Pearl diver of the Sama Dilaut', area: 'sulu', post: { x: 45, y: 23 },
      look: look('#d8506a', 'flower', { skin: '#8a5634', shirt2: '#b83a54', bottom: '#2a7a8a', bottom2: '#1e5a68' }),
      intro: ['You can hold your breath? Good. Most land people go purple in ten seconds.', 'I am Dinda. Mbo\' Arani is my grandfather. I dive for pearls, and for things the sea forgot.'],
      chat: ['Under water, everything is slow and blue and quiet. Up here, everybody talks too much. (She grins.)', 'My goggles are wood and glass. My father carved them. They fit nobody\'s face but mine.', 'An oyster that is holding a pearl sits a little higher. You learn to see it.', 'Grandfather says the Bakunawa ate six moons once. I say it should eat fish like everybody else.'],
      tasks: [['kuih_pandan', 1, 2], ['agar_agar', 1, 2], ['ikan_kembung', 2, 3]], taskText: 'for the diver\'s supper', gifts: { 3: ['mutiara', 1], 6: ['kepeng', 1500], 10: ['mutiara', 3] },
      hideIf: from(2)
    },
    jaliha: {
      name: 'Mak Jaliha', role: 'Kulintang master', area: 'sulu', post: { x: 9, y: 9 },
      look: look('#e9a03a', 'tudung', { skin: '#9a6440', shirt2: '#c47a22', hatColor: '#3a6aa8', bottom: '#6a2a7a', bottom2: '#4a1e58' }),
      intro: ['Shh. Listen. ...No, not to me. To the gongs. They are still ringing.', 'I am Jaliha. I have played the kulintang since my feet did not reach the floor.'],
      chat: ['Eight gongs, one heart. If your heart is in a hurry, the gongs will tell everybody.', 'The agung is the big brother. He does not say much, but everybody listens when he does.', 'In the old days the gongs called the boats home in a storm. They still would, if anybody asked.', 'Your rhythm is not bad. For a farmer. (High praise, Dinda says.)'],
      tasks: [['pisang_goreng', 1, 2], ['teh_o', 1, 2], ['panyalam', 1, 2]], taskText: 'for the musicians', gifts: { 3: ['kepeng', 600], 6: ['kepeng', 1500], 10: ['mutiara', 2] },
      hideIf: from(2)
    },
    salma: {
      name: 'Mak Salma', role: 'Cook at the market', area: 'sulu', post: { x: 12, y: 21 },
      look: look('#4a8a4a', 'tudung', { skin: '#a8714a', shirt2: '#3a6e3a', hatColor: '#e8c050', bottom: '#8a5a2a', bottom2: '#6a441e' }),
      intro: ['Hungry? Of course you are hungry, look at you. Sit. Eat.', 'I am Salma. My tiyula itum is the blackest on the island. Black is good! Black means the coconut was burnt properly.'],
      chat: ['Burn the coconut until it is black, not until it is ash. That is the whole secret. (It is not the whole secret.)', 'Sailors eat like three people. Navigators eat like four. Mbo\' Arani eats like six.', 'Panyalam for breakfast, tiyula itum for supper, and the sea in between.', 'You are from Nenek\'s farm? Tell your nenek my soup is better than hers. Then run.'],
      tasks: [['daging_ayam', 1, 2], ['kelapa', 2, 3], ['herba', 2, 3]], taskText: 'for the market kitchen', shop: ['tiyula_itum', 'panyalam'], buys: { cat: 'fish', mult: 1.3 },
      gifts: { 3: ['tiyula_itum', 2], 6: ['kepeng', 1200], 10: ['kepeng', 2500] },
      hideIf: from(2)
    }
  });
  LC.SPEAKERS = LC.SPEAKERS || {};
  Object.assign(LC.SPEAKERS, {
    bakunawa: { name: 'The Bakunawa', portrait: 'bakunawa11_0' },
    kru11: { name: 'A sailor of the vinta', portrait: 'npc_arani_0' }
  });

  // ================================================================ the words
  LC.CH11TEXT = {
    // ---- the dark moon over the farm
    hook: [
      { text: 'The night is warm and still. The full moon hangs over the river, so bright that the palms cast shadows.' },
      { text: '...Then a bite is missing from the moon. Then another. A shadow is sliding over it, and the light on the farm turns the colour of rust.' },
      { who: 'pelita', expr: 'sad', text: '(Pelita\'s light flickers. It drifts close to you, trembling.)' },
      { text: 'Something enormous moves under the river. The water bulges, and a long back covered in scales slides up into the red light...' }
    ],
    rise: { text: 'A serpent as long as the river itself rears up, gills wide, mouth open wide enough to swallow a house. Its eyes fix on Pelita: the little full moon on your shoulder.' },
    gongs: { text: 'DONG. DONG-DONG. Gongs! A boat with striped sails is racing up the river, and everybody aboard is beating something: gongs, pots, a frying pan.' },
    flee: { text: 'The serpent flinches at the noise, shakes its great head, and slides back under the black water. Slowly, the shadow slips off the moon.' },
    meet: [
      { who: 'arani', text: 'Ha! It does not like the gongs. Nobody likes the gongs at night. Are you hurt? Is the little moon hurt?' },
      { who: 'arani', text: 'That was the Bakunawa, child. The serpent of the deep. When it wants the moon, it swallows the moon, and we beat our gongs until it spits it out again.' },
      { who: 'dinda', text: 'It followed us all the way from Sulu. It has been chasing every light on the sea. Lanterns. Pearls. ...And now your spirit.' },
      { who: 'arani', text: 'Seven nights ago it swallowed the Mutiara Kembar, the Sultan\'s twin pearls, that shine like little moons. Since then it is hungry for more.' },
      { who: 'arani', text: 'The Sultan sent us to find the friend of spirits who made peace under the sea. Tomorrow, the day after, whenever you are ready: our vinta is at your jetty.' }
    ],
    aboard: [{ who: 'arani', text: 'Good! Untie her, Dinda. Mind the outriggers. Next stop: Lupah Sug.' }],
    notYet: [{ who: 'arani', text: 'Take your time. The Bakunawa is not going anywhere. That is the problem.' }],
    // ---- Lupah Sug
    arrive: [{ text: '✦ Lupah Sug ✦  Sulu, the land of the Tausug and the Sama Dilaut. Kulintang music drifts down from the hill, and the lagoon is full of houses on stilts and boats that people live on.' }],
    sultan: [
      { who: 'sultan_sulu', text: 'The Mutiara Kembar came to my family from the sea, and every sultan has kept them. When the moon is dark, they shine on their own. My grandmother said they were two moons that fell.' },
      { who: 'sultan_sulu', text: 'The Bakunawa came up through the floor of the sea and took them from the Astana window as if they were sweets. Since then it has eaten every light it could reach.' },
      { who: 'sultan_sulu', text: 'Mbo\' Arani knows where it sleeps, in a way: the old chart of the Sama Dilaut shows an island that no living sailor has seen. Pulau Bulan, the island with no shadow.' },
      { who: 'sultan_sulu', text: 'Get the vinta ready. Learn the gongs from Jaliha: the Bakunawa hates the agung. Dive with Dinda. Feed the crew. And then, friend of spirits... take the helm.' }
    ],
    // ---- getting the vinta ready
    gongLesson: [{ who: 'jaliha', text: 'The Sultan says you will ring the agung at the Bakunawa? Then first you learn to listen. I play, you answer. Three phrases, longer each time.' }],
    gongWon: [{ who: 'jaliha', text: 'There. Your hands know it now. When you strike the agung on that island, strike them together, all three, so the sound fills the whole sky. Even a serpent cannot think through that.' }],
    gongQuit: [{ who: 'jaliha', text: 'Rest your hands. The gongs will wait. They have waited four hundred years.' }],
    diveAsk: [
      { who: 'arani', text: 'A navigator needs a pedoman. Mine went over the side in a storm, years ago, with my old boat. It is still down there, on the reef under the village.' },
      { who: 'dinda', text: 'I know the place! The batu berani is in a little box on the stern. Come on, land person. Dive at the end of the boardwalk.' }
    ],
    karam: { text: 'The old boat lies on its side in the sand, soft with weed. In a little box on the stern, wrapped in oilcloth, is a smooth black stone. When you turn round, it turns back to face the north.' },
    karamDone: 'The old boat sleeps in the sand. Fish live in it now.',
    pedoman: [
      { who: 'arani', text: 'My batu berani! Look at it, still pointing north after twenty years in the dark. More loyal than my first wife.' },
      { who: 'arani', text: 'A sliver of wood, a brass bowl of water... and there. A pedoman. The eight winds are painted round the rim: Utara at the top, Selatan at the bottom, Timur to the right, Barat to the left.' }
    ],
    provisions: [{ who: 'arani', text: 'Tiyula itum! Now that is a crew that will sail all night. Dinda, hide one from me. Hide it well.' }],
    helmGive: [
      { who: 'arani', text: 'Everything is ready. The pedoman, the gongs, the soup. ...Except a captain. My eyes are old. Yours are not.' },
      { who: 'arani', text: 'The chart says: from the harbour, sail Timur Laut until two rocks stand together, Batu Kembar. From there, Timur through the fog. When the water turns black, Selatan, to the island with no shadow.' },
      { who: 'arani', text: 'Take the helm, Nakhoda. The vinta is at the jetty.' }
    ],
    // ---- at sea
    helmHow: 'Steer with WASD or the arrow keys (on a phone, drag): the vinta turns towards where you point. The pedoman (top right) shows your heading in Malay; the little arrow shows the wind. Sailing with the wind is fastest.',
    leg: [
      'Leg 1: sail Timur Laut (north-east) until two rocks stand together: Batu Kembar.',
      'Leg 2: from Batu Kembar, sail Timur (east) through the fog. Trust the pedoman, not your eyes. The water turns black where the island is near.',
      'Leg 3: in the black water, turn Selatan (south) to Pulau Bulan, the island with no shadow.'
    ],
    legDone: [
      [{ who: 'arani', text: 'Batu Kembar! Two sisters holding hands. Now: Timur. Into the fog. Keep the pedoman on Timur and do not look at anything else.' }],
      [{ who: 'dinda', text: 'The water... it has gone black. And the stars have gone out, look.' }, { who: 'arani', text: 'We are close. Now Selatan, Nakhoda. Slowly.' }],
      [{ who: 'arani', text: 'There. An island, and the moon on it, and not one shadow anywhere. Drop anchor by the landing.' }]
    ],
    hint: [
      ['Mbo\' Arani taps the pedoman: "Timur Laut, Nakhoda! Up and to the right!"', 'Mbo\' Arani squints at the horizon: "Batu Kembar is north-east of the harbour. Timur Laut."'],
      ['Mbo\' Arani taps the pedoman: "Timur! East! Keep the needle on Timur, fog or no fog."', 'Dinda: "Grandfather says east until the water goes black."'],
      ['Mbo\' Arani taps the pedoman: "Selatan, Nakhoda. South, through the black water."', 'Dinda: "Down, down, down. The island is to the south."']
    ],
    bump: ['CRUNCH! The hull scrapes the reef. Mbo\' Arani says a word that Dinda pretends not to hear.', 'Careful! Rocks!', 'The outrigger bumps a rock. Dinda: "Captain? The water is for the BOAT. The rocks are for the crabs."'],
    whirl: 'A whirlpool! The vinta spins round, sails flapping. Sail hard to break free!',
    storm: 'A squall! Rain lashes the deck and the wind jumps from side to side.',
    fog: 'Fog closes in. You can barely see the bow. Only the pedoman knows the way now.',
    dark: 'The sea turns black, and the stars go out one by one.',
    harbour: 'Sail into the harbour of Lupah Sug',
    anchor: 'Drop anchor at Pulau Bulan',
    noChart: 'Without the old chart and the pedoman, Mbo\' Arani says, nobody can find Pulau Bulan. (Sail where you like!)',
    // ---- Pulau Bulan
    island: [
      { text: '✦ Pulau Bulan ✦  White sand, white stones carved with crescents, and a full moon overhead. Nothing here casts a shadow: not the palms, not the stones, not you.' },
      { who: 'arani', text: 'Three agung, look, on the hill. Somebody put them here long ago, for exactly this. Strike all three, Nakhoda, quickly, so they ring together.' },
      { who: 'dinda', text: 'And stay away from the edge of the water. Please.' }
    ],
    gongOne: 'DONNNG... The agung rings out over the sea. (Strike all three while they still ring!)',
    risen: 'All three agung ring together! The Bakunawa rears up out of the sea, dazed by the sound. Strike now!',
    dive: 'The Bakunawa shakes off the ringing and dives. Strike the agung again!',
    downLines: [
      { text: 'The Bakunawa sways, coughs... and spits out two shining pearls. They roll across the white sand and come to rest at your feet: the Mutiara Kembar.' },
      { text: 'The great serpent lays its chin on the beach. Close up, it does not look fierce at all. It looks very old, and very tired.' },
      { who: 'bakunawa', text: '...Once, the sky had seven moons. I swallowed six of them, because they were so beautiful and so far away, and I wanted them close.' },
      { who: 'bakunawa', text: 'But inside me they went dark. Everything I swallow goes dark. And the sea is so very black at the bottom.' },
      { who: 'pelita', expr: 'happy', text: '(Pelita floats out over the water, right up to the Bakunawa\'s great nose. It glows, and a little spark of its light drifts into the serpent\'s eye, and stays there.)' },
      { who: 'bakunawa', text: '...Oh. It is warm. It does not go dark. ...Thank you, little moon. I will not chase your light again. Or the moon. Mostly not the moon.' },
      { text: 'The Bakunawa slides back into the sea, and for a long time you can see a tiny golden light, far down, going home.' }
    ],
    // ---- home to the Sultan
    home: [
      { who: 'sultan_sulu', text: 'The Mutiara Kembar! ...Look, they are shining again. Two little moons, home.' },
      { who: 'sultan_sulu', text: 'And the Bakunawa has a light of its own now? Then it will not need ours. That is the best ending a sultan could ask for. Better than a dead serpent, and much better than a hungry one.' },
      { who: 'jaliha', text: 'Tonight the whole island plays. All the gongs! Not to frighten anybody. Just because.' },
      { who: 'arani', text: 'Keep the vinta, Nakhoda. She likes you. Sail her wherever you want: the Sulu Sea is yours to wander. Only... come back for supper.' },
      { text: '✦ Part 1 of Chapter 11 is complete! ✦  You received 12,000 kepeng and 3 pearls. The vinta is yours: take the helm at the jetty of Lupah Sug any time. Tiyula Itum and Panyalam are in Nenek\'s recipes.' }
    ],
    nenek: ['A serpent that eats the moon? In my day we just banged the pots and went back to sleep.', 'Sulu! Your grandfather traded with a Tausug captain once. He came home with pearls and an awful sunburn.', 'Pelita gave the serpent some of its light? Of course it did. It gave me some once, when I was a little girl, and I never once felt cold again.'],
    lampir: 'A serpent that eats moons? Pfft. Amateur. I once ate a whole durian in one bite. (She did not.)',
    away: 'Pelita peeks out from behind your shoulder at every big wave. It is not scared of the sea. Just of things in it.'
  };
})(window.LC);
