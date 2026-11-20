/* Little Creature — static game data: items, crops, recipes, map, dialogue */
window.LC = window.LC || {};
(function (LC) {
  'use strict';

  LC.TILE = 16;
  LC.MAP_W = 48;
  LC.MAP_H = 34;
  LC.TIME_SCALE = 3;        // in-game minutes per real second
  LC.DAY_START = 6 * 60;    // 06:00
  LC.DAY_END = 24 * 60;     // midnight: you pass out
  LC.SHOP_OPEN = 7 * 60;
  LC.SHOP_CLOSE = 20 * 60;
  LC.INV_SIZE = 18;         // first 9 = hotbar
  LC.FONT = '"Pixelify Sans", "Courier New", monospace';
  LC.SAVE_KEY = 'littleCreature.save.v1';
  LC.WEEKDAYS = ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu', 'Ahad'];

  // ---------------------------------------------------------------- items
  // kind: tool | seed | crop | flower | fruit | dish | drink | offering
  LC.ITEMS = {
    hoe:   { name: 'Cangkul', kind: 'tool', desc: 'A sturdy hoe. Tills soil inside the fenced field.' },
    can:   { name: 'Gembor', kind: 'tool', desc: 'Watering can. Refill at the well or the river.' },

    seed_ubi:      { name: 'Ubi Cuttings', kind: 'seed', crop: 'ubi', price: 10, desc: 'Sweet potato. Ready in 3 days.' },
    seed_pandan:   { name: 'Pandan Shoots', kind: 'seed', crop: 'pandan', price: 12, desc: 'Fragrant pandan. Ready in 3 days.' },
    seed_cili:     { name: 'Cili Seeds', kind: 'seed', crop: 'cili', price: 15, desc: 'Fiery chili. Ready in 4 days.' },
    seed_marigold: { name: 'Marigold Seeds', kind: 'seed', crop: 'marigold', price: 15, desc: 'Offering flower. Ready in 3 days.' },
    seed_melati:   { name: 'Melati Cuttings', kind: 'seed', crop: 'melati', price: 20, desc: 'Jasmine. Offering flower. Ready in 4 days.' },
    seed_padi:     { name: 'Padi Seedlings', kind: 'seed', crop: 'padi', price: 20, desc: 'Rice. Plant in the flooded sawah, no watering needed. 5 days.' },

    ubi:      { name: 'Ubi', kind: 'crop', sell: 25, food: { full: 12, joy: 2 }, desc: 'Sweet potato, earthy and sweet.' },
    pandan:   { name: 'Pandan', kind: 'crop', sell: 28, food: { full: 6, joy: 4 }, desc: 'Fragrant leaves. The vanilla of Southeast Asia.' },
    cili:     { name: 'Cili', kind: 'crop', sell: 35, food: { full: 4, joy: -8 }, desc: 'Fiery red chili. Maybe not for a little spirit...' },
    marigold: { name: 'Marigold', kind: 'flower', sell: 30, desc: 'Bright golden flower, loved at every shrine.' },
    melati:   { name: 'Melati', kind: 'flower', sell: 45, desc: 'Jasmine. Its scent is said to calm wandering spirits.' },
    padi:     { name: 'Padi', kind: 'crop', sell: 15, food: { full: 6, joy: 1 }, desc: 'Harvested rice. The heart of every meal.' },
    pisang:   { name: 'Pisang', kind: 'fruit', sell: 20, food: { full: 14, joy: 6 }, desc: 'Banana from the grove.' },
    kelapa:   { name: 'Kelapa', kind: 'fruit', sell: 22, food: { full: 10, joy: 4 }, desc: 'Coconut. Grated for rich santan.' },
    mangga:   { name: 'Mangga', kind: 'fruit', sell: 30, food: { full: 14, joy: 10 }, desc: 'Sweet golden mango.' },

    nasi:          { name: 'Nasi', kind: 'dish', sell: 40, food: { full: 25, joy: 5 }, desc: 'Steamed white rice. Simple and filling.' },
    ubi_rebus:     { name: 'Ubi Rebus', kind: 'dish', sell: 45, food: { full: 25, joy: 5 }, desc: 'Boiled sweet potato. Nenek\'s rainy-day snack.' },
    pisang_goreng: { name: 'Pisang Goreng', kind: 'dish', sell: 70, food: { full: 35, joy: 15 }, desc: 'Crispy banana fritters.' },
    bubur_ubi:     { name: 'Bubur Ubi', kind: 'dish', sell: 75, food: { full: 40, joy: 15 }, desc: 'Sweet potato porridge in coconut milk.' },
    kuih_pandan:   { name: 'Kuih Pandan', kind: 'dish', sell: 110, food: { full: 40, joy: 25 }, desc: 'Soft green layered cake, fragrant with pandan.' },
    nasi_lemak:    { name: 'Nasi Lemak', kind: 'dish', sell: 115, food: { full: 55, joy: 20 }, desc: 'Coconut rice with sambal, wrapped in banana leaf.' },
    pulut_mangga:  { name: 'Pulut Mangga', kind: 'dish', sell: 120, food: { full: 50, joy: 30 }, desc: 'Mango sticky rice drizzled with santan.' },

    air_merah: { name: 'Air Merah', kind: 'drink', price: 25, sell: 10, food: { full: 15, joy: 30 }, desc: 'Red soda with a straw. Spirits adore it.' },
    colok:     { name: 'Colok', kind: 'offering', price: 15, glow: 20, bond: 4, desc: 'Incense sticks. Light them at the spirit house.' },
    malai:     { name: 'Phuang Malai', kind: 'offering', price: 70, glow: 35, bond: 6, sell: 60, desc: 'A garland of jasmine, threaded by hand.' },
    canang:    { name: 'Canang', kind: 'offering', price: 80, glow: 45, joy: 10, bond: 8, sell: 70, desc: 'A palm-leaf tray of flowers. A daily gift to the spirits.' },
    krathong:  { name: 'Krathong', kind: 'float', price: 60, sell: 50, desc: 'A lotus float of banana leaf, flowers and incense. Set it on any water after dark.' },

    // ---- v1.3: fishing, foraging, building
    joran: { name: 'Joran', kind: 'tool', price: 60, desc: 'A bamboo fishing rod. Face any water and press USE to cast.' },

    kayu:       { name: 'Kayu', kind: 'material', price: 15, sell: 6, desc: 'Sturdy timber for building.' },
    batu:       { name: 'Batu', kind: 'material', price: 20, sell: 8, desc: 'Mountain stone for steps and walls.' },
    atap:       { name: 'Atap', kind: 'material', price: 20, sell: 8, desc: 'Nipa-palm thatch for roofs.' },
    tanah_liat: { name: 'Tanah Liat', kind: 'material', price: 25, sell: 10, desc: 'Red clay from the dunes, for roof tiles and pots.' },
    rotan:      { name: 'Rotan', kind: 'material', sell: 14, desc: 'Rattan cane. Weavers and builders love it.' },

    cendawan:  { name: 'Cendawan', kind: 'forage', sell: 18, food: { full: 8, joy: 2 }, desc: 'Wild forest mushrooms.' },
    herba:     { name: 'Herba', kind: 'forage', sell: 24, desc: 'Fragrant wild herbs: serai, kunyit and daun kaduk.' },
    durian:    { name: 'Durian', kind: 'fruit', price: 70, sell: 60, food: { full: 18, joy: -6 }, desc: 'The king of fruits. Spiky, creamy... and very smelly.' },
    daun_teh:  { name: 'Daun Teh', kind: 'forage', sell: 15, desc: 'Fresh tea leaves from the misty highlands.' },
    strawberi: { name: 'Strawberi', kind: 'fruit', sell: 30, food: { full: 6, joy: 12 }, desc: 'Highland strawberries, sweet and cold.' },
    buah_naga: { name: 'Buah Naga', kind: 'fruit', price: 50, sell: 40, food: { full: 12, joy: 10 }, desc: 'Dragon fruit: magenta skin, speckled sweet flesh.' },
    kerang:    { name: 'Kerang', kind: 'forage', sell: 15, desc: 'Pretty seashells from Pulau Mutiara.' },
    mutiara:   { name: 'Mutiara', kind: 'treasure', sell: 250, desc: 'A real pearl! It shimmers like moonlight.' },
    duit_lama: { name: 'Duit Lama', kind: 'treasure', sell: 80, desc: 'An old coin from a forgotten trading port.' },

    ikan_tilapia:  { name: 'Tilapia', kind: 'fish', cat: 'fish', sell: 30, diff: 1, desc: 'A plump river fish. Common and tasty.' },
    ikan_keli:     { name: 'Ikan Keli', kind: 'fish', cat: 'fish', sell: 25, diff: 1, night: true, desc: 'Whiskered catfish. Bites best after dark.' },
    udang:         { name: 'Udang Galah', kind: 'fish', cat: 'fish', sell: 40, diff: 2, desc: 'Giant river prawn with long blue claws.' },
    ikan_puyu:     { name: 'Ikan Puyu', kind: 'fish', cat: 'fish', sell: 20, diff: 1, desc: 'Climbing perch. It can wriggle over land!' },
    ikan_haruan:   { name: 'Ikan Haruan', kind: 'fish', cat: 'fish', sell: 45, diff: 2, desc: 'Snakehead. Made into a healing soup.' },
    ikan_kelah:    { name: 'Ikan Kelah', kind: 'fish', cat: 'fish', sell: 120, diff: 3, desc: 'Mahseer, the king of the forest rivers. Rare!' },
    ikan_kembung:  { name: 'Ikan Kembung', kind: 'fish', cat: 'fish', sell: 30, diff: 1, desc: 'Silvery mackerel from the sea.' },
    sotong:        { name: 'Sotong', kind: 'fish', cat: 'fish', sell: 40, diff: 2, night: true, desc: 'Squid. Drawn to lights on the water at night.' },
    ikan_kerapu:   { name: 'Ikan Kerapu', kind: 'fish', cat: 'fish', sell: 110, diff: 3, desc: 'Spotted grouper from the coral. Rare!' },
    ikan_sebarau:  { name: 'Ikan Sebarau', kind: 'fish', cat: 'fish', sell: 60, diff: 2, desc: 'Hampala barb with a black band. A fighter.' },
    ikan_emas:     { name: 'Ikan Emas', kind: 'fish', cat: 'fish', sell: 150, diff: 3, desc: 'A golden carp from the mountain lake. Very lucky!' },
    selipar:       { name: 'Old Selipar', kind: 'junk', sell: 1, desc: 'Somebody\'s lost flip-flop. Ha!' },

    ikan_bakar:    { name: 'Ikan Bakar', kind: 'dish', sell: 70, food: { full: 35, joy: 10 }, desc: 'Fish grilled in banana leaf over coals.' },
    asam_pedas:    { name: 'Asam Pedas', kind: 'dish', sell: 120, food: { full: 50, joy: 15 }, desc: 'Sour, spicy fish stew from Melaka.' },
    sambal_udang:  { name: 'Sambal Udang', kind: 'dish', sell: 130, food: { full: 45, joy: 18 }, desc: 'Prawns in a fiery chilli sambal.' },
    sotong_goreng: { name: 'Sotong Goreng', kind: 'dish', sell: 110, food: { full: 40, joy: 20 }, desc: 'Crispy fried squid rings.' },
    sup_cendawan:  { name: 'Sup Cendawan', kind: 'dish', sell: 90, food: { full: 40, joy: 12 }, desc: 'Warm mushroom and sweet-potato soup.' },
    pengat_durian: { name: 'Pengat Durian', kind: 'dish', sell: 160, food: { full: 45, joy: 30 }, desc: 'Durian simmered in coconut milk and palm sugar.' },
    teh_o:         { name: 'Teh O', kind: 'drink', price: 20, sell: 30, food: { full: 5, joy: 20 }, desc: 'Hot sweet highland tea, no milk.' },
    jamu:          { name: 'Jamu', kind: 'drink', price: 35, sell: 20, energy: 70, food: { full: 4, joy: -2 }, desc: 'Bitter herbal tonic from Java. Eat it (X) for +70 energy.' },

    // ---- v1.4: getting around, and the village beneath the waves
    basikal: { name: 'Basikal', kind: 'vehicle', ride: 'bike', price: 250, speed: 1.75, desc: 'A sturdy kampung bicycle with a basket and a bell. Hold it and press USE (or R) to ride.' },
    rumpai_laut:  { name: 'Rumpai Laut', kind: 'forage', price: 12, sell: 14, food: { full: 4, joy: 2 }, desc: 'Seaweed from the reef. Crunchy, salty, good for you.' },
    gamat:        { name: 'Gamat', kind: 'forage', sell: 45, desc: 'A sea cucumber. Langkawi folk make a famous healing oil from it.' },
    pinggan_lama: { name: 'Pinggan Lama', kind: 'treasure', sell: 180, desc: 'Blue-and-white porcelain from a trading junk that sank centuries ago.' },
    sampah:       { name: 'Sampah', kind: 'junk', desc: 'A tangle of plastic and old fishing net. It does not belong in the sea! Tok Duyung will take it.' },
    kerabu_rumpai: { name: 'Kerabu Rumpai', kind: 'dish', price: 60, sell: 80, food: { full: 30, joy: 12 }, desc: 'Fresh seaweed salad with chilli and lime, Sabah style.' },
    agar_agar:     { name: 'Agar-agar', kind: 'dish', price: 70, sell: 90, food: { full: 25, joy: 28 }, desc: 'Wobbly coconut jelly made from seaweed. Pelita adores it.' }
  };
  Object.keys(LC.ITEMS).forEach(function (id) { LC.ITEMS[id].id = id; LC.ITEMS[id].icon = 'i_' + id; });
  LC.CATS = { fish: 'any fish' };   // recipe inputs like '@fish' accept any item of that category

  LC.LOVES = ['pulut_mangga', 'kuih_pandan', 'air_merah', 'pisang_goreng', 'pengat_durian', 'teh_o', 'agar_agar'];
  LC.DISLIKES = ['cili', 'durian'];

  // ---------------------------------------------------------------- crops
  LC.CROPS = {
    ubi:      { name: 'Ubi', days: 3, item: 'ubi', count: 1 },
    pandan:   { name: 'Pandan', days: 3, item: 'pandan', count: 1 },
    cili:     { name: 'Cili', days: 4, item: 'cili', count: 2 },
    marigold: { name: 'Marigold', days: 3, item: 'marigold', count: 2 },
    melati:   { name: 'Melati', days: 4, item: 'melati', count: 2 },
    padi:     { name: 'Padi', days: 5, item: 'padi', count: 3, paddy: true }
  };
  LC.cropStage = function (c) {
    var d = LC.CROPS[c.id].days;
    if (c.g >= d) return 3;
    if (c.g <= 0) return 0;
    return c.g < d / 2 ? 1 : 2;
  };

  // ---------------------------------------------------------------- recipes
  LC.RECIPES = [
    { out: 'nasi', inp: { padi: 1 } },
    { out: 'ubi_rebus', inp: { ubi: 1 } },
    { out: 'pisang_goreng', inp: { pisang: 1, padi: 1 } },
    { out: 'bubur_ubi', inp: { ubi: 1, kelapa: 1 } },
    { out: 'kuih_pandan', inp: { pandan: 1, kelapa: 1, padi: 1 } },
    { out: 'nasi_lemak', inp: { padi: 1, cili: 1, kelapa: 1 } },
    { out: 'pulut_mangga', inp: { padi: 1, mangga: 1, kelapa: 1 } },
    { out: 'ikan_bakar', inp: { '@fish': 1 } },
    { out: 'asam_pedas', inp: { '@fish': 1, cili: 2 } },
    { out: 'sambal_udang', inp: { udang: 2, cili: 1 } },
    { out: 'sotong_goreng', inp: { sotong: 1, padi: 1 } },
    { out: 'sup_cendawan', inp: { cendawan: 2, ubi: 1 } },
    { out: 'pengat_durian', inp: { durian: 1, kelapa: 1 } },
    { out: 'teh_o', inp: { daun_teh: 2 } },
    { out: 'kerabu_rumpai', inp: { rumpai_laut: 2, cili: 1 } },
    { out: 'agar_agar', inp: { rumpai_laut: 1, kelapa: 1 } }
  ];
  LC.CRAFTS = [
    { out: 'malai', inp: { melati: 2 } },
    { out: 'canang', inp: { marigold: 1, melati: 1 } },
    { out: 'krathong', inp: { pisang: 1, marigold: 1, colok: 1 } }
  ];
  LC.SHOP = ['seed_ubi', 'seed_pandan', 'seed_cili', 'seed_marigold', 'seed_melati', 'seed_padi', 'colok', 'air_merah'];

  // ---------------------------------------------------------------- spirit
  LC.STAGES = [
    { name: 'Flicker', short: 'Flicker', bond: 0 },
    { name: 'Little Spirit', short: 'Little Spirit', bond: 30 },
    { name: 'Lantern Spirit', short: 'Lantern Spirit', bond: 150 },
    { name: 'Garden Spirit', short: 'Garden Spirit', bond: 380 },
    { name: 'Guardian of the Kampung', short: 'Guardian', bond: 750 }
  ];

  // Pelita's levels (v1.3). LEVELS[i] is the bond needed for level i+1. Evolutions land on Lv 3, 6, 9 and 12
  // (the same bond as the stages above), and new places open on the way.
  LC.LEVELS = [0, 12, 30, 60, 100, 150, 210, 290, 380, 470, 570, 750, 900, 1080, 1280, 1500, 1750, 2050, 2400, 2800];
  LC.MAX_LEVEL = LC.LEVELS.length;
  LC.levelFor = function (bond) {
    var l = 1;
    for (var i = 1; i < LC.LEVELS.length; i++) if (bond >= LC.LEVELS[i]) l = i + 1;
    return l;
  };
  // what each level brings (gifts are given to every player on the farm)
  LC.LEVEL_REWARDS = {
    2: { unlock: 'kampung' },
    3: { stage: 1, unlock: 'forest' },
    4: { kepeng: 60, text: 'Pelita found 60 kepeng for you.' },
    5: { unlock: 'island' },
    6: { stage: 2 },
    7: { paths: true, item: ['colok', 3], text: 'Spirit paths: wayside shrines can now carry you home, and the spirit house can send you to any place you have visited.' },
    8: { unlock: 'mountain' },
    9: { stage: 3 },
    10: { water: 10, text: 'Your gembor now holds 30 waterings.' },
    11: { unlock: 'desert' },
    12: { stage: 4 },
    13: { kepeng: 150, text: 'Pelita found 150 kepeng under the stilts.' },
    14: { energy: 20, text: 'Pelita\'s warm light gives you +20 max energy.' },
    15: { item: ['mutiara', 1], text: 'Pelita brought you a pearl from the river bed.' },
    16: { item: ['canang', 3], text: 'The spirits of the kampung send 3 canang.' },
    17: { kepeng: 250, text: 'Pelita found 250 kepeng in an old jar.' },
    18: { energy: 20, text: '+20 max energy.' },
    19: { item: ['mutiara', 2], text: 'Two pearls glitter on your doorstep.' },
    20: { kepeng: 500, legend: true, text: 'Pelita is now a Legend of the Kampung! Its light reaches every corner of the land.' }
  };

  LC.STAGE_TEXT = [
    null,
    ['Pelita\'s faint flicker swells into a little round spirit!',
      'It blinks at you... and giggles. Pelita will follow you now, and its thought bubbles show what it craves.'],
    ['Pelita found Nenek\'s old oil lamp under the house and now carries it everywhere.',
      'Blessing: on nights when its Glow is 50 or more, Pelita waters your crops while you sleep.'],
    ['A kemboja flower blooms on Pelita\'s head. The whole yard smells sweet.',
      'Blessing: crops sometimes grow an extra stage overnight, and Pelita finds lost kepeng.'],
    null // Guardian: festival cutscene
  ];

  LC.TREES = {
    banana: { fruit: 'pisang', count: 2, regrow: 3, name: 'Banana tree' },
    palm:   { fruit: 'kelapa', count: 2, regrow: 3, name: 'Coconut palm' },
    mango:  { fruit: 'mangga', count: 2, regrow: 4, name: 'Mango tree' },
    durian: { fruit: 'durian', count: 1, regrow: 4, name: 'Durian tree' }
  };

  // Things to gather in the wider world. They regrow like fruit trees (state lives in S.trees, keyed by object id).
  LC.FORAGE = {
    branches:   { name: 'Fallen branches', verb: 'Gather branches', item: 'kayu', count: 2, regrow: 1, energy: 1 },
    rattan:     { name: 'Rattan vine', verb: 'Cut rattan', item: 'rotan', count: 1, regrow: 2, energy: 1 },
    mushroom:   { name: 'Mushrooms', verb: 'Pick mushrooms', item: 'cendawan', count: 2, regrow: 2, energy: 0 },
    herbs:      { name: 'Wild herbs', verb: 'Pick herbs', item: 'herba', count: 1, regrow: 2, energy: 0 },
    nipa:       { name: 'Nipa palm', verb: 'Cut nipa thatch', item: 'atap', count: 2, regrow: 2, energy: 1 },
    shells:     { name: 'Seashells', verb: 'Collect shells', item: 'kerang', count: 2, regrow: 1, energy: 0, rare: ['mutiara', 0.08] },
    tea:        { name: 'Tea bush', verb: 'Pluck tea leaves', item: 'daun_teh', count: 2, regrow: 1, energy: 0 },
    strawberry: { name: 'Strawberry patch', verb: 'Pick strawberries', item: 'strawberi', count: 2, regrow: 2, energy: 0 },
    boulder:    { name: 'Boulder', verb: 'Break off stone', item: 'batu', count: 2, regrow: 2, energy: 3 },
    dragon:     { name: 'Dragon fruit cactus', verb: 'Pick dragon fruit', item: 'buah_naga', count: 2, regrow: 3, energy: 0 },
    clay:       { name: 'Clay pit', verb: 'Dig clay', item: 'tanah_liat', count: 2, regrow: 2, energy: 3 },
    glint:      { name: 'Something glinting', verb: 'Dig it up', item: 'duit_lama', count: 1, regrow: 3, energy: 2, rare: ['mutiara', 0.12] },
    seaweed:    { name: 'Seaweed', verb: 'Gather seaweed', item: 'rumpai_laut', count: 2, regrow: 1, energy: 0 },
    seacuke:    { name: 'Sea cucumber', verb: 'Pick up the gamat', item: 'gamat', count: 1, regrow: 2, energy: 0 },
    clam:       { name: 'Giant clam', verb: 'Peek inside the clam', item: 'kerang', count: 2, regrow: 2, energy: 0, rare: ['mutiara', 0.2] },
    rubbish:    { name: 'Rubbish', verb: 'Clean up the rubbish', item: 'sampah', count: 1, regrow: 1, energy: 1 },
    wreck:      { name: 'Shipwreck chest', verb: 'Open the old chest', item: 'duit_lama', count: 2, regrow: 3, energy: 1, rare: ['pinggan_lama', 0.4] }
  };

  // Fishing: what bites in each kind of water. [item, weight]. Night fish bite twice as often after dark.
  LC.FISHING = {
    river:  [['ikan_tilapia', 40], ['ikan_keli', 32], ['udang', 18], ['selipar', 6]],
    stream: [['ikan_puyu', 40], ['ikan_haruan', 30], ['ikan_kelah', 12], ['selipar', 5]],
    sea:    [['ikan_kembung', 45], ['sotong', 25], ['ikan_kerapu', 12], ['selipar', 5]],
    lake:   [['ikan_puyu', 30], ['ikan_sebarau', 30], ['ikan_emas', 12], ['selipar', 5]],
    oasis:  [['ikan_puyu', 45], ['ikan_keli', 25], ['duit_lama', 8], ['selipar', 10]]
  };
  LC.WATER_NAMES = { river: 'river', stream: 'forest pool', sea: 'sea', lake: 'mountain lake', oasis: 'oasis' };

  // Houses the kampung raises together (gotong-royong) on an empty plot. Ready the next morning.
  LC.HOUSES = {
    hut:    { name: 'Pondok Buluh', desc: 'A breezy bamboo hut on stilts.', cost: { kayu: 6, atap: 6 }, kepeng: 120 },
    timber: { name: 'Rumah Kayu', desc: 'A carved timber stilt house, like Nenek\'s.', cost: { kayu: 12, atap: 4, batu: 4 }, kepeng: 250 },
    brick:  { name: 'Rumah Batu', desc: 'A Melaka-style house with clay roof tiles and tiled stone steps.', cost: { kayu: 6, batu: 10, tanah_liat: 6 }, kepeng: 400 }
  };

  // ---------------------------------------------------------------- map
  LC.buildMap = function () {
    var W = LC.MAP_W, H = LC.MAP_H, g = [], x, y;
    for (y = 0; y < H; y++) { g.push([]); for (x = 0; x < W; x++) g[y].push('.'); }
    function fill(x0, y0, x1, y1, ch) {
      for (var yy = y0; yy <= y1; yy++) for (var xx = x0; xx <= x1; xx++)
        if (yy >= 0 && yy < H && xx >= 0 && xx < W) g[yy][xx] = ch;
    }
    // jungle border
    fill(0, 0, W - 1, 1, 'J'); fill(0, 0, 0, H - 1, 'J'); fill(W - 2, 0, W - 1, H - 1, 'J');
    // river (flows across the south)
    fill(0, 28, W - 1, 28, 's'); fill(0, 29, W - 1, 29, 'S'); fill(0, 30, W - 1, H - 1, 'w');
    fill(1, 27, 7, 27, 's'); fill(13, 27, 16, 27, 's'); fill(30, 27, 38, 27, 's');
    // paths
    fill(2, 10, W - 1, 11, 'p');
    fill(4, 8, 4, 9, 'p');
    fill(11, 12, 12, 12, 'p');
    fill(20, 12, 21, 27, 'p');
    fill(39, 9, 42, 9, 'p');
    fill(29, 0, 30, 9, 'p');      // v1.3: the north trail into Hutan Rimba
    // fenced farm field (v2.7.4: bigger, 15 x 9 = 135 tiles, was 12 x 8 = 96; the torches by the gate stand on the fence)
    fill(3, 12, 19, 12, 'F'); fill(3, 22, 19, 22, 'F'); fill(3, 12, 3, 22, 'F'); fill(19, 12, 19, 22, 'F');
    fill(11, 12, 12, 12, 'p');
    fill(4, 13, 18, 21, 'f');
    // sawah (rice paddy) with bunds
    fill(23, 13, 36, 22, 'b'); fill(24, 14, 35, 21, 'r');
    fill(24, 17, 35, 17, 'b'); fill(29, 14, 30, 21, 'b'); fill(29, 12, 30, 12, 'b');
    // jetty
    fill(20, 28, 21, 32, 'j');
    return g;
  };

  LC.OBJECTS = [
    { id: 'house', type: 'house', x: 2, y: 2, w: 5, h: 6, tex: 'house' },
    { id: 'spirit', type: 'spirit', x: 10, y: 6, w: 1, h: 1, tex: 'spirit_house' },
    { id: 'frangi', type: 'frangipani', x: 12, y: 6, w: 1, h: 1, tex: 'frangipani' },
    { id: 'dapur', type: 'dapur', x: 7, y: 8, w: 2, h: 1, tex: 'dapur' },
    { id: 'wood', type: 'woodpile', x: 9, y: 8, w: 1, h: 1, tex: 'woodpile' },
    { id: 'well', type: 'well', x: 15, y: 8, w: 1, h: 1, tex: 'well' },
    { id: 'warung', type: 'warung', x: 39, y: 7, w: 4, h: 2 },
    { id: 'sign', type: 'sign', x: 44, y: 9, w: 1, h: 1, tex: 'sign' },
    { id: 'sampan_farm', type: 'sampan', x: 22, y: 31, w: 2, h: 1, to: 'island' },
    { id: 'sign_north', type: 'signpost', x: 31, y: 4, w: 1, h: 1, tex: 'sign', text: 'HUTAN RIMBA (the old rainforest) ^  The trail north is overgrown. Pelita at Lv 3 could light the way.' },

    { id: 'banana1', type: 'tree', kind: 'banana', x: 2, y: 14, w: 1, h: 1 },
    { id: 'banana2', type: 'tree', kind: 'banana', x: 2, y: 17, w: 1, h: 1 },   // (v2.7.4: one step west, for the bigger field)
    { id: 'banana3', type: 'tree', kind: 'banana', x: 2, y: 20, w: 1, h: 1 },
    { id: 'banana4', type: 'tree', kind: 'banana', x: 2, y: 23, w: 1, h: 1 },
    { id: 'palm1', type: 'tree', kind: 'palm', x: 4, y: 26, w: 1, h: 1 },
    { id: 'palm2', type: 'tree', kind: 'palm', x: 10, y: 26, w: 1, h: 1 },
    { id: 'palm3', type: 'tree', kind: 'palm', x: 15, y: 26, w: 1, h: 1 },
    { id: 'palm4', type: 'tree', kind: 'palm', x: 26, y: 26, w: 1, h: 1 },
    { id: 'palm5', type: 'tree', kind: 'palm', x: 34, y: 25, w: 1, h: 1 },
    { id: 'palm6', type: 'tree', kind: 'palm', x: 42, y: 26, w: 1, h: 1 },
    { id: 'mango', type: 'tree', kind: 'mango', x: 41, y: 17, w: 1, h: 1 },

    { type: 'torch', x: 13, y: 9 }, { type: 'torch', x: 19, y: 9 }, { type: 'torch', x: 26, y: 9 },
    { type: 'torch', x: 33, y: 9 }, { type: 'torch', x: 38, y: 9 }, { type: 'torch', x: 43, y: 9 },
    { type: 'torch', x: 10, y: 12 }, { type: 'torch', x: 13, y: 12 },
    { type: 'torch', x: 19, y: 27 }, { type: 'torch', x: 22, y: 27 }
  ];

  LC.ZONES = {
    chickens: { x0: 6, y0: 8, x1: 18, y1: 11 },
    kerbau: { x0: 37, y0: 13, x1: 45, y1: 24 }
  };

  // ---------------------------------------------------------------- dialogue
  LC.TEXT = {
    intro: [
      { text: 'A letter waits on the doorstep of the old stilt house, tied shut with a pandan leaf...' },
      { name: 'Nenek\'s letter', text: 'My dear cucu, if you are reading this, the farm is yours now. Water the plants, mind the river, and eat properly. You are too thin!' },
      { name: 'Nenek\'s letter', text: 'And please look after Pelita. That little one lives in the spirit house beside the stairs. I named it Pelita because it used to shine like a lamp on Raya nights.' },
      { name: 'Nenek\'s letter', text: 'Since I fell sick, nobody has fed it. Its light must be very faint now. Give it a bowl of nasi and light a stick of colok, and it will remember you.  -- Nenek' },
      { name: 'Pelita', portrait: 'ghost', text: '...?' }
    ],
    makAniFirst: [
      { name: 'Mak Ani', portrait: 'npc_ani_0', text: 'Eh! You must be Nenek\'s cucu! Come, come. I am Mak Ani. This warung has been here longer than the jetty!' },
      { name: 'Mak Ani', portrait: 'npc_ani_0', text: 'Your Nenek bought colok from me every week, for that little spirit of hers. Pelita, yes? It used to steal my kuih, hehe.' },
      { name: 'Mak Ani', portrait: 'npc_ani_0', text: 'I sell seeds, incense and air merah. Bring me your harvest and cooking too, I pay fair price!' }
    ],
    makAniTips: [
      'Pelita likes sweet things. Your Nenek always made pulut mangga for it on Fridays.',
      'Rice only grows in the sawah. Plant the seedlings straight into the water, no need to water them.',
      'On Ahad night the hungry ghosts wander. Feed your little one well, and every kindness counts double!',
      'Jasmine and marigold make a lovely canang. Spirits feel so honoured by it.',
      'The kelip-kelip (fireflies) dance by the river at night. Very romantic, hehe.',
      'If Pelita gets lonely it will play tricks on you. Spirits are like children, you know.',
      'Coconut milk, rice and a little chili. Nasi lemak! The best breakfast in the world.',
      'Cooked food fills a spirit far more than raw crops. Use Nenek\'s dapur!'
    ],
    sign: 'KE KAMPUNG TEPIAN (To the village) >>  The villagers are rebuilding after the monsoon floods. Pelita at Lv 2 can light the road.',
    barrier: 'The road to the village is closed for repairs. Maybe next season.',
    frangipani: 'Bunga kemboja (frangipani). Its sweet scent drifts strongest at night, when the spirits wander.',
    woodpile: 'Nenek\'s firewood for the dapur. Neatly stacked, as always.',
    river: 'The river glitters. Sampans drift by on their way to the morning market.',
    kerbau: 'The kerbau chews thoughtfully and lets out a long, happy "Moooo."',
    chicken: 'Kok-kok-kok! The ayam kampung pecks at your sandals.',
    kancil: 'Sang Kancil, the clever mouse deer from the old tales! It twitches its nose and darts away.',
    ketam: 'A little ketam (crab) waves its claws at you. Snip snip!',
    penyu: 'A sea turtle (penyu) rests on the warm sand. Its eggs may be buried nearby. Best to let it be.',
    biawak: 'A biawak (monitor lizard) flicks its tongue and suns itself. It seems quite unbothered.',
    ikan_kecil: 'A shimmering school of little fish swirls around you, then darts away.',
    ubur: 'An ubur-ubur (jellyfish) pulses gently past. Better not touch it!'
  };
})(window.LC);
