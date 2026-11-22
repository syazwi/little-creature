/* Little Creature — Chapter 7: Puteri Santubong (v2.5). It begins a day after Chapter 6, on the same save.
 * From the Sarawak legend of Puteri Santubong (the weaver) and Puteri Sejinjang (the rice-pounder): two princesses of
 * Kayangan, the sky kingdom, sent down to keep the peace, who quarrelled over Putera Serapi and were turned into Gunung
 * Santubong and Bukit Sejinjang. Versions of the legend differ; the game keeps the parts most of them share and adds
 * Sang Bualang (the suitor Sejinjang turned down, from one telling) as a wind spirit. Linking Puteri Gunung Ledang and
 * Nenek's childhood to Santubong is this game's own story. No gore (the old fight is told gently), no religion: Raja
 * Kayangan is a sky king of the old tales, never worshipped.
 *  0 (a day after Chapter 6) mist on the farm: Puteri Gunung Ledang's message; Nenek was born in Santubong
 *  1 sail to Gunung Ledang: the princess gives you the Kabus Ledang (mist that carries words truly)
 *  2 sail to Santubong   3 Mak Dayang the weaver tells the legend
 *  4 at night, help both sisters: Santubong's last weaving (three dyes, golden thread), Sejinjang's rice (pound it
 *    with her); then carry their words to each other in the Kabus Ledang, and the truth comes out
 *  5 Sang Bualang's storm hits the village: drive it off   6 Putera Serapi's messages
 *  7 Pulau Satang: Sang Bualang (boss; halfway through, the mist of Gunung Ledang calms the storm)
 *  8 Bualang sulks on the rocks: sit with him, and give him a wau
 *  9 bring Puteri Gunung Ledang across the sea on the jong   10 the three princesses (complete)
 * Rewards: Bualang the wind helper (B) and Angin Bualang (U, see bualang.js), Pelita's daylight at Lv 30, weaving and
 * rice flour at the dapur, Pulau Satang's fishing, Nenek's childhood house, and four new friends. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  function addItems(map) { Object.keys(map).forEach(function (id) { var it = map[id]; it.id = id; it.icon = it.icon || 'i_' + id; LC.ITEMS[id] = it; }); }
  addItems({
    kabus_ledang: { name: 'Kabus Ledang', kind: 'treasure', desc: 'A little jar of mist from Gunung Ledang. Words spoken into it arrive exactly as they were said. No wind can twist them.' },
    tarum: { name: 'Daun Tarum', kind: 'material', sell: 12, cat: 'dye', desc: 'Indigo leaves. Soaked and beaten, they dye thread a deep sea blue.' },
    kunyit_hutan: { name: 'Kunyit Hutan', kind: 'material', sell: 12, cat: 'dye', desc: 'Wild turmeric root. It dyes thread (and your fingers) a bright sunny yellow.' },
    kesumba: { name: 'Biji Kesumba', kind: 'material', sell: 14, cat: 'dye', desc: 'Red seeds from the kesumba bush on Pulau Satang. They dye thread the red of a sunset.' },
    benang_emas: { name: 'Benang Emas', kind: 'material', price: 60, sell: 25, desc: 'Golden thread for weaving. Mak Dayang keeps a few skeins.' },
    kain_santubong: { name: 'Kain Santubong', kind: 'treasure', desc: 'The last weaving of Puteri Santubong, finished after centuries: blue sea, yellow sun and red sunset, with a gold thread through it all.' },
    beras_sejinjang: { name: 'Beras Sejinjang', kind: 'treasure', desc: 'Rice pounded by Puteri Sejinjang\'s own antan. Every grain shines like a little pearl.' },
    surat_serapi: { name: 'Surat Serapi', kind: 'treasure', desc: 'Two folded leaves of nipah, one for each princess, in Putera Serapi\'s careful hand.' },
    wau_bualang: { name: 'Wau Bualang', kind: 'treasure', desc: 'A moon kite of rattan and golden thread, made for someone who has never been given anything.' },
    tepung_beras: { name: 'Tepung Beras', kind: 'material', sell: 20, desc: 'Fine rice flour, pounded in Sejinjang\'s lesung. For kuih.' },
    kuih_lapis: { name: 'Kuih Lapis', kind: 'dish', sell: 45, food: { full: 18, joy: 14 }, desc: 'Steamed layers of rice flour and santan, in every colour, peeled off one at a time.' }
  });
  // v3.2.4: Kain Tenun already exists (Chapter 2: the dowry chest, and Mak Dayang's loom in Barunai sells it). This file
  // used to define it again, which threw away its shop price. Santubong's looms weave the same cloth: keep the one item.
  Object.assign(LC.ITEMS.kain_tenun, { name: 'Kain Tenun', kind: 'goods', sell: 220, desc: 'Hand-woven cloth shot with gold thread, the pride of the weavers of Barunai and Santubong. Traders pay well for it.' });
  LC.CATS.dye = 'any dye (tarum, kunyit or kesumba)';
  // the chapter's treasures stay with you until the story uses them
  ['kabus_ledang', 'kain_santubong', 'beras_sejinjang', 'surat_serapi', 'wau_bualang'].forEach(function (id) { LC.FIXED_ITEMS[id] = 1; });
  LC.RECIPES.push({ out: 'kuih_lapis', inp: { tepung_beras: 1, kelapa: 1 } });
  function done7(S) { return ((S && S.quests && S.quests.ch7) || 0) >= 10; }
  LC.MAKES.push({ out: 'kain_tenun', inp: { benang_emas: 2, '@dye': 1 }, when: done7 });   // Santubong's loom, at the dapur
  LC.MAKES.push({ out: 'tepung_beras', inp: { padi: 2 }, when: done7 });                   // Sejinjang's lesung and antan

  function q(S) { return (S && S.quests) || {}; }
  function c7(S) { return q(S).ch7 || 0; }
  LC.ch7Step = function () { return c7(LC.State.s); };
  LC.isDusk = function (S) { return S.minutes >= 18 * 60 || S.minutes < 6 * 60; };   // the princesses walk from dusk to dawn

  // ================================================================ enemies: the storm, and Sang Bualang himself
  Object.assign(LC.ENEMIES, {
    ribut: { name: 'Angin Ribut', hp: 4, speed: 30, dmg: 6, sight: 130, w: 6, floaty: true, erratic: true, drop: [['kepeng', 0.6, 4, 10]] },
    camar: { name: 'Camar Ribut', hp: 2, speed: 56, dmg: 4, sight: 150, w: 5, erratic: true, drop: [['kepeng', 0.4, 2, 6]] },
    bualang7: { name: 'Sang Bualang', hp: 90, speed: 32, dmg: 10, sight: 280, w: 8, boss: true, floaty: true, drop: [] }
  });
  LC.C7 = {
    stormKills: 8,                                        // storm creatures to drive off the village
    dyes: ['tarum', 'kunyit_hutan', 'kesumba'], thread: 1,
    beats: 12, needHits: 9,                               // Sejinjang's rice: pound in time
    wau: { rotan: 3, benang_emas: 1 }, wauKepeng: 200,
    batu: { x: 23, y: 6 },                                // where you stand to face the meeting stone
    reward1: 4000, reward2: 12000,
    boss: {
      gust: { cd: 6.5, warn: 1.0, r: 100, dmg: 6, push: 70 },
      twister: { cd: 8, speed: 72, life: 3.6, dmg: 7 },
      bolt: { cd: 5, warn: 1.2, r: 20, dmg: 8 }
    }
  };

  function grid(W, H, ch) { var g = []; for (var y = 0; y < H; y++) { g.push([]); for (var x = 0; x < W; x++) g[y].push(ch); } return g; }
  function fill(g, x0, y0, x1, y1, ch) { for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) if (g[y] && x >= 0 && x < g[0].length) g[y][x] = ch; }
  function ell(g, cx, cy, rx, ry, ch) { for (var y = 0; y < g.length; y++) for (var x = 0; x < g[0].length; x++) { var dx = (x - cx) / rx, dy = (y - cy) / ry; if (dx * dx + dy * dy <= 1) g[y][x] = ch; } }

  // ================================================================ Kampung Santubong
  function buildSantubong() {
    var W = 48, H = 36, g = grid(W, H, 'G');
    fill(g, 0, 0, W - 1, 2, 'M');                       // the mountains fill the sky
    fill(g, 0, 3, 19, 6, 'M');                          // Gunung Santubong (west)
    fill(g, 28, 3, W - 1, 5, 'M');                      // Bukit Sejinjang (east), lower
    fill(g, 20, 3, 27, 6, 'G');                         // the green saddle between them, where they meet
    fill(g, 0, 0, 1, 25, 'M'); fill(g, W - 2, 0, W - 1, 25, 'M');
    fill(g, 0, 16, 4, 17, 'k');                         // the path inland, to Gunung Serapi
    fill(g, 4, 15, 43, 16, 'k');                        // the village street
    fill(g, 23, 6, 24, 27, 'k');                        // from the jetty up to the meeting stone
    fill(g, 10, 7, 11, 14, 'k'); fill(g, 36, 6, 37, 14, 'k');   // up to each princess's foot of the mountain
    fill(g, 2, 26, W - 3, 27, 's'); fill(g, 0, 28, W - 1, 29, 's');
    fill(g, 0, 30, W - 1, H - 1, 'o');
    fill(g, 23, 28, 24, H - 2, 'j');                    // the jetty
    return g;
  }
  var S_OBJ = [
    { id: 'st_gunung', type: 'bldg', x: 3, y: 3, w: 14, h: 4, tex: 'gunung_santubong', keep: true, text: 'Gunung Santubong. Halfway up its green face runs a long crack, like a scar on a cheek. The old people say it is where Sejinjang\'s antan struck.' },
    { id: 'st_bukit', type: 'bldg', x: 30, y: 3, w: 14, h: 3, tex: 'bukit_sejinjang', keep: true, text: 'Bukit Sejinjang, lower and rounder than its sister. Out at sea lie little islands, like stones that were thrown and never picked up.' },
    { id: 'st_batu', type: 'batu7', x: 23, y: 5, w: 2, h: 1, tex: 'batu_temu', keep: true },
    { id: 'st_tenun', type: 'tenun7', x: 13, y: 8, w: 2, h: 1, tex: 'kek_tenun', keep: true },
    { id: 'st_lesung', type: 'lesung7', x: 33, y: 8, w: 1, h: 1, tex: 'lesung_antan', keep: true },
    { id: 'st_dayang', type: 'bldg', x: 6, y: 11, w: 3, h: 3, tex: 'rumah_dayang', keep: true, text: 'Mak Dayang\'s house. Through the open door you can see a loom, and skeins of thread in every colour hanging from the rafters.' },
    { id: 'st_lama', type: 'rumah7', x: 39, y: 11, w: 3, h: 3, tex: 'rumah_lama', keep: true, when: function (S) { return c7(S) < 10; } },
    { id: 'st_nenek', type: 'rumah7', x: 39, y: 11, w: 3, h: 3, tex: 'rumah_nenek', keep: true, when: function (S) { return c7(S) >= 10; } },
    { id: 'st_pondok1', type: 'bldg', x: 15, y: 19, w: 3, h: 2, tex: 'beach_hut', text: 'A fisherman\'s house on low stilts. Nets hang drying under the eaves.' },
    { id: 'st_pondok2', type: 'bldg', x: 30, y: 19, w: 3, h: 2, tex: 'beach_hut', text: 'A house with a garden of chillies and lemongrass. Someone inside is singing.' },
    { id: 'st_sign', type: 'signpost', x: 4, y: 14, tex: 'sign', text: 'KAMPUNG SANTUBONG.  West: the path to Gunung Serapi.  North: the meeting stone, between the two mountains.' },
    { id: 'st_sampan', type: 'perahu7', to: 'satang', x: 21, y: 31, w: 2, h: 1, tex: 'sampan' },
    { id: 'st_jong', type: 'jong5', x: 25, y: 31, w: 5, h: 3, tex: 'jong_majapahit' }
  ];
  [[5, 20, 'tarum'], [8, 23, 'tarum'], [19, 12, 'kunyit_hutan'], [27, 12, 'kunyit_hutan']].forEach(function (t, i) {
    S_OBJ.push({ id: 'st_dye' + i, type: 'pewarna7', i: i, dye: t[2], x: t[0], y: t[1], tex: t[2] === 'tarum' ? 'pokok_tarum' : 'pokok_kunyit' });
  });
  [[6, 25], [14, 25], [33, 25], [42, 25]].forEach(function (t, i) { S_OBJ.push({ id: 'st_palm' + i, type: 'bldg', x: t[0], y: t[1], tex: 'palm', text: 'A coconut palm leaning out over the sand.' }); });
  function storm(S) { return c7(S) === 5 && !!q(S).c7storm; }
  LC.AREAS.santubong = {
    name: 'Kampung Santubong', sub: 'the village between two mountains', lvl: 20, build: buildSantubong, objects: S_OBJ,
    pond: 'sea', amb: 'beach', decor: { n: 34, types: ['fern', 'bush', 'hibiscus', 'lalang', 'rock', 'bougainvillea'], on: 'G' },
    critters: [{ kind: 'ketam', n: 2, zone: { x0: 4, y0: 26, x1: 43, y1: 28 } }],
    trees: { n: 18, on: 'G', tex: ['jtree', 'jtree2'], text: 'A rainforest tree, loud with cicadas.' },
    clear: [{ x: 23, y: 5, r: 3 }, { x: 12, y: 8, r: 2 }, { x: 35, y: 8, r: 2 }, { x: 2, y: 17, r: 2 }],
    exits: [], home: { x: 24, y: 28 }, ride: {},
    enemies: [
      { kind: 'ribut', n: 4, zone: { x0: 4, y0: 17, x1: 43, y1: 27 }, when: function () { return storm(LC.State.s); } },
      { kind: 'camar', n: 3, zone: { x0: 4, y0: 18, x1: 43, y1: 28 }, when: function () { return storm(LC.State.s); } }
    ]
  };

  // ================================================================ Pulau Satang
  function buildSatang() {
    var W = 36, H = 26, g = grid(W, H, 'o');
    ell(g, 17.5, 11.5, 15.5, 9.5, 's');
    ell(g, 17.5, 10.5, 12.5, 6.8, 'G');
    ell(g, 17.5, 4.2, 5, 2.2, 'M');                     // the crag at the top of the island
    fill(g, 17, 20, 18, H - 2, 'j');
    return g;
  }
  var T_OBJ = [
    { id: 'sa_karang', type: 'karang7', x: 17, y: 6, w: 2, h: 1, tex: 'batu_karang', keep: true },
    { id: 'sa_kesumba', type: 'pewarna7', i: 4, dye: 'kesumba', x: 8, y: 9, tex: 'pokok_kesumba' },
    { id: 'sa_sampan', type: 'perahu7', to: 'santubong', x: 15, y: 22, w: 2, h: 1, tex: 'sampan' },
    { id: 'sa_palm0', type: 'bldg', x: 26, y: 13, tex: 'palm', text: 'A wind-bent palm. All its fronds point the same way.' },
    { id: 'sa_palm1', type: 'bldg', x: 11, y: 14, tex: 'palm', text: 'A coconut palm. Its trunk is scarred by a hundred storms.' }
  ];
  function boss(S) { return c7(S) === 7 && !!q(S).c7boss; }
  LC.AREAS.satang = {
    name: 'Pulau Satang', sub: 'the windy island off Santubong', lvl: 20, build: buildSatang, objects: T_OBJ,
    pond: 'sea', amb: 'wind', decor: { n: 22, types: ['rock', 'shellrock', 'dunegrass', 'pebbles'], on: 'G' },
    critters: [{ kind: 'penyu', n: 1, zone: { x0: 8, y0: 15, x1: 26, y1: 18 } }],
    clear: [{ x: 18, y: 7, r: 3 }],
    exits: [], home: { x: 17.5, y: 20 }, ride: {},
    enemies: [
      { kind: 'ribut', n: 2, zone: { x0: 6, y0: 8, x1: 29, y1: 16 }, when: function () { var S = LC.State.s; return c7(S) === 7 && !q(S).c7boss; } },
      { kind: 'camar', n: 2, zone: { x0: 6, y0: 8, x1: 29, y1: 17 }, when: function () { var S = LC.State.s; return c7(S) === 7; } },
      { kind: 'bualang7', n: 1, zone: { x0: 13, y0: 7, x1: 22, y1: 12 }, when: function () { return boss(LC.State.s); } },
      { kind: 'ketam_batu', n: 2, zone: { x0: 6, y0: 14, x1: 29, y1: 18 }, when: function () { return c7(LC.State.s) >= 10; } }
    ]
  };

  // ================================================================ the people of Santubong
  function look(shirt, hat, extra) { return Object.assign({ skin: '#a8714a', shirt: shirt, shirt2: shirt, bottom: '#5a4a3a', bottom2: '#40342a', hair: '#1a1210', hat: hat }, extra || {}); }
  Object.assign(LC.VILLAGERS, {
    dayang: {
      name: 'Mak Dayang', role: 'The old weaver of Santubong', area: 'santubong', post: { x: 9, y: 14 },
      look: look('#2a5a8a', 'tudung', { skin: '#a8714a', shirt2: '#e9c46a', hatColor: '#7a2a4a', bottom: '#7a2a4a', bottom2: '#5a1e36' }),
      intro: ['Eh? A stranger, off a Majapahit jong? Come, come, sit on my steps. I am Dayang. I have woven cloth in this village for sixty years.',
        'You want to know about the thunder? Everybody here knows about the thunder. Sit down properly and I will tell you.'],
      chat: ['A good weaver counts every thread. A good friend counts nothing at all.', 'Tarum for the sea, kunyit for the sun, kesumba for the sunset. That is the whole world, in three colours.', 'My grandmother said the thunder only started the year the princesses were turned to stone. Before that, the wind was kind.', 'Santubong was a trading port when Melaka was still a fishing village. My beads came from as far away as India.'],
      tasks: [['kuih_pandan', 1, 1], ['ikan_bakar', 1, 2], ['kelapa', 2, 2]], taskText: 'for the weaver\'s tea', shop: ['benang_emas'],
      gifts: { 3: ['benang_emas', 2], 6: ['kain_tenun', 1], 10: ['kepeng', 1500] },
      hideIf: function (S) { return c7(S) < 3; }
    },
    santubong: {
      name: 'Puteri Santubong', role: 'The weaving princess of the mountain', area: 'santubong', post: { x: 12, y: 8 }, glow: 0xb8d8ff,
      look: look('#3a6aa8', 'flower', { skin: '#e8c4a0', shirt2: '#e9c46a', hair: '#1a1210', bottom: '#2a4a7a', bottom2: '#1e3a62' }),
      intro: ['...You can see me? Few can, these days. I am Santubong, princess of Kayangan, once. Now I am mostly mountain.'],
      chat: ['Every night I weave a little, and every morning it is gone. That is what being a mountain is like.', 'I can see the whole sea from my shoulder. I can see my sister. I do not look.', 'Thread remembers the hands that held it.', 'Sejinjang used to sing while she pounded the rice. I wove to her rhythm.'],
      tasks: [['melati', 2, 3], ['kain_tenun', 1, 1]], taskText: 'for a princess of Kayangan', gifts: { 3: ['benang_emas', 3], 6: ['kepeng', 1200], 10: ['kepeng', 2500] },
      hideIf: function (S) { return c7(S) < 4; }
    },
    sejinjang: {
      name: 'Puteri Sejinjang', role: 'The rice-pounding princess of the hill', area: 'santubong', post: { x: 35, y: 8 }, glow: 0xffd8b0,
      look: look('#a83a4a', 'bun', { skin: '#e8c4a0', shirt2: '#e9c46a', hair: '#2a1a14', bottom: '#7a2a3a', bottom2: '#5a1e2a' }),
      intro: ['Hah! A visitor! Nobody climbs up to me any more. I am Sejinjang. Princess of Kayangan, best rice-pounder on the whole coast, and the shorter of the two mountains. Do not mention that last part.'],
      chat: ['Tum, tum, tum! The antan never lies. Either the rice is pounded or it is not.', 'I can see the whole bay from here. Very boring. Lots of water.', 'Santubong was always the clever one. I was the loud one.', 'The wind tells me things. Mostly unkind things. I do not know why I listen.'],
      tasks: [['padi', 3, 2], ['kuih_lapis', 1, 1]], taskText: 'for a princess of Kayangan', gifts: { 3: ['tepung_beras', 4], 6: ['kepeng', 1200], 10: ['kepeng', 2500] },
      hideIf: function (S) { return c7(S) < 4; }
    },
    serapi: {
      name: 'Putera Serapi', role: 'The shy prince of Gunung Serapi', area: 'santubong', post: { x: 1, y: 17 },
      look: look('#3a6a3a', 'tanjak_gold', { skin: '#b8875a', shirt2: '#e9c46a', hair: '#1a1210', bottom: '#2a4a2a', bottom2: '#1e361e' }),
      intro: ['Oh! Ah. Hello. I am... Serapi. From the mountain inland. I come down to the river path sometimes, to look at the sea. And at, um. The two mountains.'],
      chat: ['I am not very good at talking. I am better at standing very still and being a mountain.', 'The hornbills nest on my slopes. They are much louder than me.', 'I should have said something, all those years ago. I am still learning how.', 'Santubong. Sejinjang. I say their names to the river sometimes.'],
      tasks: [['teh_o', 1, 2], ['pisang_goreng', 1, 2]], taskText: 'for a shy prince', gifts: { 3: ['kepeng', 600], 6: ['jamu_kuat', 2], 10: ['kepeng', 1500] },
      hideIf: function (S) { return c7(S) < 6; }
    },
    bualang: {
      name: 'Sang Bualang', role: 'The wind of Pulau Satang, sulking', area: 'satang', post: { x: 20, y: 7 }, glow: 0xd8f0ff, sprite: true,
      intro: ['...What. Have you come to laugh at me? Go on. Everybody else does. Well, they would, if anybody ever talked to me.'],
      chat: ['The wind goes where it likes. That is the whole trouble with the wind.', '...I am not sulking. I am resting. Angrily.', 'Nobody ever gave me anything. Not once, in all those years.', 'A kite! You know what a kite is? It is the wind and a person, holding hands.'],
      tasks: [['kuih_lapis', 1, 2], ['ikan_bakar', 1, 2]], taskText: 'for the wind', gifts: { 3: ['kepeng', 500], 6: ['benang_emas', 3], 10: ['kepeng', 1500] },
      hideIf: function (S) { return c7(S) < 8; },
      aliveIf: function (S) { return c7(S) >= 10; },
      alive: { role: 'The wind of Santubong, your friend', area: 'santubong', post: { x: 31, y: 25 },
        chat: ['The sailors say the bay has never had kinder winds. I say nothing. I just blow.', 'Want me? Fly the wau (B). I will come as fast as the wind can. Which is not always fast. Forests are very tangled.', 'Sejinjang said good morning to me today. GOOD MORNING. To ME.', 'Your little lamp is very bright for something so small.'] }
    }
  });
  LC.SPEAKERS = Object.assign(LC.SPEAKERS || {}, {
    ledang: { name: 'Puteri Gunung Ledang', portrait: 'npc_puteri_ledang_0' },
    kayangan: { name: 'Raja Kayangan', portrait: 'kayangan_face' },
    bualangW: { name: 'Sang Bualang', portrait: 'npc_bualang_0' },
    wira: { name: 'Juragan Wira', portrait: 'wira_0' }
  });

  // ================================================================ the story, in their words
  LC.CH7TEXT = {
    mist: [
      { text: 'Early in the morning, a white mist rolls up from the river and over Nenek\'s farm, thick and cool and smelling of mountain flowers. Pelita blinks at it.' },
      { text: 'The mist gathers by the pangkin into a shape: a princess, faint as moonlight, with flowers in her hair.' },
      { who: 'ledang', text: 'Forgive me for coming like this, child of the little light. I cannot leave my mountain, so I send my mist instead.' },
      { who: 'ledang', text: 'Far across the sea, in Borneo, two old friends of mine are fighting again: the princesses of Santubong and Sejinjang. Every night their thunder rolls over the bay. Now their storms are reaching the sea lanes, and the fishermen are afraid to sail.' },
      { who: 'ledang', text: 'Something is wrong. They quarrelled long ago, but they are sisters. Sisters do not stay angry for six hundred years without help. Come to my mountain. I have something for you.' },
      { text: 'The mist thins, and the princess is gone. Nenek is standing in the doorway, very pale, holding her cup of tea.' },
      { who: 'nenek', text: '...Santubong. She said Santubong. Cucu, that is where I was born.' },
      { who: 'nenek', text: 'My father was a trader. He sailed from Santubong to Barunai, to Java, to Melaka, and he took me along. In Java he bought a little brass lamp whose flame never went out... and one night the flame floated away. I chased it all the way up Gunung Ledang. You know the rest.' },
      { who: 'nenek', text: 'When I was small, I fell asleep every night to the thunder between the two mountains. My mother said it was the princesses arguing. I thought it was a story.' },
      { who: 'nenek', text: 'Go, cucu. Go to the princess, and then go to Santubong. And if Mak Dayang the weaver is still alive, tell her little Minah says hello.' },
      { text: '✦ Chapter 7: Puteri Santubong ✦  Sail to Gunung Ledang on the Majapahit jong at the farm jetty, and see the princess.' }
    ],
    kabus: [
      { who: 'ledang', text: 'You came. Good. Listen, child: the princesses of Santubong and Sejinjang talk to each other every night, but always on the wind. The wind carries their words across the bay.' },
      { who: 'ledang', text: 'I do not trust the wind. Words that travel too far change on the way. Take this: a jar of my mist. Speak into it, and the words arrive exactly as they were said.' },
      { text: 'The princess places a little clay jar in your hands. Inside, the mist moves slowly, like something asleep.' },
      { who: 'hangtuah', text: 'Borneo? Ah, the sea there is kind in this season. Keep your keris close and your words gentle, friend.' },
      { who: 'lampir', text: 'Sisters. SISTERS. Worse than witches. Six hundred years of sulking over one boy. Hmph. ...Go on, then. Fix it.' },
      { text: '✦ You received the Kabus Ledang. Sail to Kampung Santubong on the jong. ✦' }
    ],
    sail: [{ text: 'Juragan Wira turns the jong east, across the open sea to Borneo. On the third morning two mountains rise out of the haze: a tall one with a crack down its face, and a smaller, rounder one beside it.' }],
    sailBack: [{ text: 'The jong slips into the river mouth below the two mountains. Fishing boats bob at the jetty.' }],
    arrive: [{ text: '✦ Kampung Santubong ✦  Stilt houses along the shore, nets drying in the sun, and above it all, two mountains. Thunder grumbles between them, though the sky is clear.' }],
    legend: [
      { who: 'dayang', text: 'Little Minah? MINAH! The trader\'s girl who ran after fireflies? She is alive? Oh, my goodness. (She wipes her eyes on her sleeve.) We were girls together. Tell her Dayang still has her hair ribbon.' },
      { who: 'dayang', text: 'Now. The thunder. Long ago, when the world was younger, two villages on this coast, Pasir Kuning and Pasir Putih, could not stop fighting. So Raja Kayangan, the king of the sky, sent down two princesses to keep the peace.' },
      { who: 'dayang', text: 'Puteri Santubong could weave cloth so fine you could see the sea through it. Puteri Sejinjang could pound a whole field of rice before breakfast. They promised Raja Kayangan never to quarrel, and for years the coast was happy.' },
      { who: 'dayang', text: 'Then a prince came down from Gunung Serapi, gentle and handsome, and both sisters fell in love with him. They argued. They argued more. And one day, in anger, Sejinjang swung her antan, and Santubong struck back with her belida.' },
      { who: 'dayang', text: 'Raja Kayangan was so sad that he turned them both into mountains, right where they stood. The crack on Gunung Santubong is where the antan struck. The little islands out there are the stones that flew into the sea.' },
      { who: 'dayang', text: 'People say their spirits still walk on the mountains at night. And every night, the thunder. My grandmother said it was worse lately. It is. It is MUCH worse.' },
      { text: '✦ After dusk, climb to the foot of each mountain: Puteri Santubong in the west, by her loom, and Puteri Sejinjang in the east, by her lesung. ✦' }
    ],
    santubongAsk: [
      { who: 'santubong', text: 'You carry mist from Gunung Ledang. You are her messenger, then. Did she send you to scold me? She would be right to.' },
      { who: 'santubong', text: 'Every night my sister sends me cruel words on the wind. "Santubong the proud." "Santubong the thief." And every night I send back worse. I am so tired of it, little messenger.' },
      { who: 'santubong', text: 'Before the end, I was weaving a cloth for her. Blue for the sea she loved, yellow for the sun, red for the sunsets we watched together. It was never finished. I cannot finish it alone. My hands are mostly stone.' },
      { who: 'santubong', text: 'Bring me the colours: tarum leaves and wild kunyit from the village, and kesumba seeds from Pulau Satang. And one skein of golden thread from Dayang. Then weave it with me, at my loom, at night.' }
    ],
    sejinjangAsk: [
      { who: 'sejinjang', text: 'Mist from Ledang? So the old princess is poking her nose in. Typical. Well, if you are here, you can make yourself useful.' },
      { who: 'sejinjang', text: 'Every night my sister\'s words come over the bay. "Sejinjang the loud." "Sejinjang the brute." I send back worse. Of course I do. ...I did not used to be like this.' },
      { who: 'sejinjang', text: 'Long ago I promised her rice for her wedding feast. Whoever she married. I never pounded it. Help me now: bring three padi, and pound it with me at my lesung, in time with my antan. Tum, tum, tum. Can you keep a rhythm?' }
    ],
    weave: [
      { text: 'Puteri Santubong\'s stone hands move over the loom, slowly at first, then faster. You pass her the threads, one colour at a time: tarum blue, kunyit yellow, kesumba red, and the gold through it all.' },
      { who: 'santubong', text: 'There. Six hundred years late. It is the most beautiful thing I have ever made, and I did not make it alone.' },
      { text: '✦ You received the Kain Santubong. ✦' }
    ],
    pound: [
      { who: 'sejinjang', text: 'TUM! Ha! You have good arms, little farmer. That is the best rice this coast has seen in six hundred years.' },
      { who: 'sejinjang', text: 'Keep it safe. It was always meant for her.' },
      { text: '✦ You received the Beras Sejinjang. ✦' }
    ],
    poundMiss: 'Sejinjang: "Hm. You pound like a sleepy kerbau. Again! Tum... tum... tum."',
    message: [
      { text: 'You open the Kabus Ledang. The mist curls up out of the jar.' },
      { who: 'santubong', text: '(into the mist) Sejinjang. I finished the cloth. The one I was weaving for you. I miss you. I have missed you for six hundred years.' },
      { text: 'The mist drifts across the bay, white in the moonlight, and settles on Bukit Sejinjang. A long silence. Then the mist comes back, and in it is Sejinjang\'s voice:' },
      { who: 'sejinjang', text: '(from the mist) ...You MISS me? But every night the wind said... "Santubong says you are a brute, a thief, a nothing." Every night!' },
      { who: 'santubong', text: 'I never said that. Not once. I said I was sorry. Every night, I said I was sorry, and the wind brought back...' },
      { text: 'Both princesses fall silent. The thunder stops. And in the quiet, somewhere out over the sea, the wind begins to laugh.' },
      { who: 'bualangW', text: 'HA HA HA HA! Six hundred years! Six hundred years of carrying your little words and making them sharper! Did you really never guess?' },
      { who: 'sejinjang', text: 'Bualang. BUALANG! The one I turned down, before Serapi ever came! You twisted our words?!' },
      { who: 'bualangW', text: 'You said NO to me, Sejinjang! Nobody says no to the wind! If you will not be mine, you will not be happy either! And now, little messenger, I will blow your village into the sea!' },
      { text: '✦ A storm is coming! Drive Sang Bualang\'s storm out of Kampung Santubong. ✦' }
    ],
    stormOver: [
      { text: 'The last of the storm creatures tears apart into rain. The wind howls away out to sea, towards the little islands, and the village comes out of its houses, dripping and blinking.' },
      { who: 'dayang', text: 'He has gone to Pulau Satang, I think. The rocks out there are his. He will be back, bigger and angrier. Oh, these princesses and their admirers!' },
      { who: 'dayang', text: 'You know who else was there, that day, six hundred years ago? The prince. Putera Serapi. He comes down the river path in the west, sometimes, to look at the mountains. Ask him what really happened.' }
    ],
    serapi: [
      { who: 'serapi', text: 'You... you know the princesses? Both of them? Are they... well? Do they ever mention me? No. Do not tell me. I do not deserve to know.' },
      { who: 'serapi', text: 'I will tell you the truth, because nobody ever asked me. I came down from my mountain to see the sea, that was all. They were kind to me, both of them. I liked them both very much.' },
      { who: 'serapi', text: 'But I never chose either of them. I never asked. I was too shy to say anything at all. And while I was trying to find the right words, they decided for me, and fought, and...' },
      { who: 'serapi', text: 'I have written to each of them. Every year, I write, and every year I am too afraid to send it. Will you carry them? Please. Not on the wind.' },
      { text: '✦ You received the Surat Serapi. Sang Bualang is gathering a storm on Pulau Satang. Take the sampan at the jetty and stop him. ✦' }
    ],
    satang: [{ text: '✦ Pulau Satang ✦  The wind tears at your clothes. On the crag at the top of the island, someone is laughing.' }],
    bossStart: [
      { text: 'On top of the crag stands a young man made of wind: hair streaming, sash snapping, eyes like the grey sky before rain. Sang Bualang.' },
      { who: 'bualangW', text: 'The little messenger! Come to scold the wind? You cannot catch the wind!' },
      { text: 'Stay out of his gusts, and step out of the circles before the lightning strikes!' }
    ],
    calm: { who: 'ledang', text: '(Across the sea, a soft voice in the mist) Enough storm, Bualang. Let them see you clearly.' },
    beaten: [
      { text: 'Sang Bualang staggers and drops onto the rocks. The storm sputters out. Without it, he looks very young, and very tired.' },
      { who: 'bualangW', text: '...Fine. FINE. You win. Go and tell everybody. Go and tell them all about the stupid wind who could not take no for an answer.' },
      { text: 'He turns his back, sits on a rock at the edge of the crag, and stares out at the sea.' }
    ],
    sit: [
      { text: 'You sit down beside him on the rock. For a long time, neither of you says anything. The waves come and go.' },
      { who: 'bualang', text: '...Why are you still here? Everybody else always goes away.' },
      { who: 'bualang', text: 'I loved her, you know. Sejinjang. She was so loud and so happy. I asked her to come and fly with me, and she laughed and said no, kindly. And I could not bear it. A no felt like the end of the world.' },
      { who: 'bualang', text: 'So I took their words and made them sharp. Six hundred years. It did not make me happy. Nothing makes the wind happy. Nobody gives the wind anything. They just shut their windows.' },
      { text: 'Maybe somebody should give him something. Mak Dayang in the village knows how to make a wau: a moon kite of rattan and thread.' }
    ],
    wauGive: [
      { text: 'You hold out the wau. Its golden tail snaps in the breeze.' },
      { who: 'bualang', text: '...For me? A kite? For ME?' },
      { text: 'He takes the string very carefully, as if it might break. The wau leaps into the sky and hangs there, humming, perfectly still, held up by the wind and by him.' },
      { who: 'bualang', text: 'Six hundred years, and nobody ever... (he scrubs at his eyes) The wind does not cry. That is just spray.' },
      { who: 'bualang', text: 'I will say sorry to them. To both of them. I do not know how. But I will.' },
      { text: '✦ Bring Puteri Gunung Ledang to Santubong: sail the jong to Gunung Ledang and ask her to come. Then everyone meets at the stone between the mountains. ✦' }
    ],
    ledangAsk: [
      { who: 'ledang', text: 'Leave my mountain? I have not left it since before Melaka had a name.' },
      { who: 'ledang', text: '...But they are my friends, and they need someone who knows what it is to refuse a love that is demanded. Very well. Tuah, look after the garden. Lampir, do not touch my flowers.' },
      { who: 'lampir', text: 'Hmph. I would not DREAM of it. (She is already looking at the flowers.)' },
      { text: '✦ Puteri Gunung Ledang is aboard the jong. Sail to Santubong. ✦' }
    ],
    finale: [
      { text: 'As the jong drops anchor, the mist of Gunung Ledang spreads over the whole bay, white and shining. Through it you climb to the green saddle between the mountains, to the meeting stone.' },
      { text: 'Down from the west comes Puteri Santubong. Down from the east comes Puteri Sejinjang. Up the river path comes Putera Serapi, and down from the sky drops Sang Bualang, holding his kite very tightly. And Puteri Gunung Ledang steps out of the mist.' },
      { text: 'You give Puteri Santubong\'s cloth to Sejinjang, and Sejinjang\'s rice to Santubong. Then you give each of them a letter from Putera Serapi.' },
      { who: 'sejinjang', text: '(reading) "...I never chose. I was too shy to speak, and you were both too quick..." ...Oh. Oh, SERAPI. Six hundred years!' },
      { who: 'serapi', text: 'I am sorry. I am so sorry. I should have said something.' },
      { who: 'ledang', text: 'Listen to me, all of you. Once a Sultan asked for my hand, and I asked him for impossible things, because I did not love him. He learned to accept no. It made him a better king.' },
      { who: 'ledang', text: 'Love that is demanded is not love. Not by a Sultan, not by the wind, and not by two sisters fighting over a boy who never asked either of them. Let it go.' },
      { who: 'bualang', text: 'Sejinjang. Santubong. I twisted your words for six hundred years because I could not bear a no. I am sorry. I do not expect you to forgive me.' },
      { who: 'sejinjang', text: '...You are an idiot, Bualang. But I was cruel to you too, after. (she sighs) Fly your kite where I can see it, and we will talk.' },
      { who: 'santubong', text: 'Sister.' },
      { who: 'sejinjang', text: 'Sister.' },
      { text: 'The two princesses hold each other, and the whole bay goes quiet. Then light pours down from above the clouds, and a voice like distant thunder, but warm, speaks from the sky.' },
      { who: 'kayangan', text: 'My daughters. I turned you to stone because I did not know how else to stop your anger. A farmer, a little light, a mist and a kite have done what I could not.' },
      { who: 'kayangan', text: 'You will stay mountains: the coast needs you. But you will not stay apart. Walk together on your slopes every night, and let the thunder be gone from this bay.' },
      { who: 'kayangan', text: 'And you, little light of Nenek\'s house. You have carried true words across the sea. Take a little of the sky with you. When you have grown as bright as you can grow, you will turn night into day.' },
      { text: 'A thread of golden light comes down out of the clouds and winds itself around Pelita. Pelita glows like a small sun, and laughs.' },
      { who: 'bualang', text: 'Farmer. Whenever you need me, fly a wau and I will come. On the wind, of course, so it takes a moment. Forests are very tangled. And here, take a little of me: when you are surrounded, push. Like this. WHOOSH!' },
      { text: '✦ Chapter 7: Puteri Santubong, complete! (+12000 kepeng) ✦' },
      { text: '✦ New friend and helper: Sang Bualang! Press B (or tap the wau beside your hotbar) to call him. He rides the wind, so he takes about 10 seconds to arrive (20 in forests and caves). In a fight he spins enemies into a dizzy whirlwind. ✦' },
      { text: '✦ New power: Angin Bualang! Press U (or tap the gust button) to blow back every enemy around you and leave them dizzy. It also blows away darkness and fog. ✦' },
      { text: '✦ Pelita has a thread of Kayangan\'s light: at Lv ' + LC.MAX_LEVEL + ', the nights are as bright as day wherever Pelita is with you (you can switch it off in the pause menu). ✦' },
      { text: '✦ Also: weave Kain Tenun and pound Tepung Beras at the dapur\'s Craft tab, cook Kuih Lapis, and fish off Pulau Satang. Nenek\'s childhood house in Santubong has been repaired by the village. ✦' }
    ],
    houseOld: 'An old stilt house, its roof half fallen in. Carved on the doorpost, very small, is a little lamp. Someone in this house, long ago, loved lights.',
    houseNew: 'Nenek\'s childhood house, repaired by the whole village. On the doorpost, the little carved lamp has been painted gold. Mak Dayang has hung a hair ribbon on the door.',
    nenekAfter: ['Dayang still has my ribbon? That old cat! I lost that ribbon in 1950-something and accused my brother for a week.', 'The thunder has stopped? Truly? I think I will sleep very well tonight.', 'A wind spirit for a friend! In my day we only had the chickens.', 'Pelita is so bright now. I need my sunglasses at night. What are sunglasses? Never mind.'],
    stars: 'The meeting stone between the two mountains. Two small handprints are pressed into the rock, side by side.'
  };
})(window.LC);
