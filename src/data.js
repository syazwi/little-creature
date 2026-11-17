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
    malai:     { name: 'Phuang Malai', kind: 'offering', glow: 35, bond: 6, sell: 60, desc: 'A garland of jasmine, threaded by hand.' },
    canang:    { name: 'Canang', kind: 'offering', glow: 45, joy: 10, bond: 8, sell: 70, desc: 'A palm-leaf tray of flowers. A daily gift to the spirits.' }
  };
  Object.keys(LC.ITEMS).forEach(function (id) { LC.ITEMS[id].id = id; LC.ITEMS[id].icon = 'i_' + id; });

  LC.LOVES = ['pulut_mangga', 'kuih_pandan', 'air_merah', 'pisang_goreng'];
  LC.DISLIKES = ['cili'];

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
    { out: 'pulut_mangga', inp: { padi: 1, mangga: 1, kelapa: 1 } }
  ];
  LC.CRAFTS = [
    { out: 'malai', inp: { melati: 2 } },
    { out: 'canang', inp: { marigold: 1, melati: 1 } }
  ];
  LC.SHOP = ['seed_ubi', 'seed_pandan', 'seed_cili', 'seed_marigold', 'seed_melati', 'seed_padi', 'colok', 'air_merah'];

  // ---------------------------------------------------------------- spirit
  LC.STAGES = [
    { name: 'Flicker', bond: 0 },
    { name: 'Little Spirit', bond: 30 },
    { name: 'Lantern Spirit', bond: 150 },
    { name: 'Garden Spirit', bond: 380 },
    { name: 'Guardian of the Kampung', bond: 750 }
  ];
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
    mango:  { fruit: 'mangga', count: 2, regrow: 4, name: 'Mango tree' }
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
    // fenced farm field
    fill(5, 13, 18, 13, 'F'); fill(5, 22, 18, 22, 'F'); fill(5, 13, 5, 22, 'F'); fill(18, 13, 18, 22, 'F');
    fill(11, 13, 12, 13, 'p');
    fill(6, 14, 17, 21, 'f');
    // sawah (rice paddy) with bunds
    fill(23, 13, 36, 22, 'b'); fill(24, 14, 35, 21, 'r');
    fill(24, 17, 35, 17, 'b'); fill(29, 14, 30, 21, 'b'); fill(29, 12, 30, 12, 'b');
    // jetty
    fill(20, 28, 21, 32, 'j');
    return g;
  };
  LC.SOLID_TILES = { J: 1, w: 1, S: 1, F: 1 };

  LC.OBJECTS = [
    { id: 'house', type: 'house', x: 2, y: 2, w: 5, h: 6, tex: 'house' },
    { id: 'spirit', type: 'spirit', x: 10, y: 6, w: 1, h: 1, tex: 'spirit_house' },
    { id: 'frangi', type: 'frangipani', x: 12, y: 6, w: 1, h: 1, tex: 'frangipani' },
    { id: 'dapur', type: 'dapur', x: 7, y: 8, w: 2, h: 1, tex: 'dapur' },
    { id: 'wood', type: 'woodpile', x: 9, y: 8, w: 1, h: 1, tex: 'woodpile' },
    { id: 'well', type: 'well', x: 15, y: 8, w: 1, h: 1, tex: 'well' },
    { id: 'warung', type: 'warung', x: 39, y: 7, w: 4, h: 2 },
    { id: 'sign', type: 'sign', x: 44, y: 9, w: 1, h: 1, tex: 'sign' },
    { id: 'barrier', type: 'barrier', x: 47, y: 10, w: 1, h: 2, tex: 'barrier' },

    { id: 'banana1', type: 'tree', kind: 'banana', x: 2, y: 14, w: 1, h: 1 },
    { id: 'banana2', type: 'tree', kind: 'banana', x: 3, y: 17, w: 1, h: 1 },
    { id: 'banana3', type: 'tree', kind: 'banana', x: 2, y: 20, w: 1, h: 1 },
    { id: 'banana4', type: 'tree', kind: 'banana', x: 3, y: 23, w: 1, h: 1 },
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
    chickens: { x0: 6, y0: 8, x1: 18, y1: 12 },
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
    sign: 'KE KAMPUNG (To the village) >>  The bridge is being repaired after the monsoon floods.',
    barrier: 'The road to the village is closed for repairs. Maybe next season.',
    frangipani: 'Bunga kemboja (frangipani). Its sweet scent drifts strongest at night, when the spirits wander.',
    woodpile: 'Nenek\'s firewood for the dapur. Neatly stacked, as always.',
    river: 'The river glitters. Sampans drift by on their way to the morning market.',
    kerbau: 'The kerbau chews thoughtfully and lets out a long, happy "Moooo."',
    chicken: 'Kok-kok-kok! The ayam kampung pecks at your sandals.'
  };
})(window.LC);
