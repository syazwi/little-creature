/* Little Creature — v1.5 under the sea, deeper: inside the sunken junk (the ghost of Si Tanggang), the Palace of the
 * Southern Sea (Kanjeng Ratu Kidul, from the Javanese legend of Nyi Roro Kidul) and the sunken city of Atlantis
 * (Poseidon, king of the sea in the old Greek tales). All three are reached from Kampung Karang.
 *
 * New tile characters:  W  wet deck planks   H  ship's hull (solid)   n  jade palace floor   a  marble   A  marble avenue */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  LC.SOLID_TILES.H = 1;

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
  function addItems(map) { Object.keys(map).forEach(function (id) { var it = map[id]; it.id = id; it.icon = 'i_' + id; LC.ITEMS[id] = it; }); }

  addItems({
    selendang: { name: 'Selendang Ibu', kind: 'quest', desc: 'A faded old shawl that the tide carried to Tok Duyung long ago. It smells faintly of pandan.' },
    amfora:    { name: 'Amfora', kind: 'treasure', sell: 220, desc: 'A tall clay jar from Atlantis, painted with dolphins. Still sealed!' },
    trisula:   { name: 'Trisula Laut', kind: 'weapon', dmg: 5, reach: 27, cd: 0.4, desc: 'The three-pronged spear of the sea king. It hums like a storm and hits like a wave.' }
  });
  LC.FORAGE.amphora = { name: 'Fallen amphora', verb: 'Lift the old amphora', item: 'amfora', count: 1, regrow: 3, energy: 1, rare: ['emas', 0.25] };

  // ------------------------------------------------------------------ inside the sunken junk
  function buildKapal() {
    var W = 30, H = 18, g = blank(W, H, 'H'), f = filler(g);
    f.fill(2, 3, 27, 13, 'W');
    f.fill(10, 3, 10, 13, 'H'); f.fill(10, 7, 10, 9, 'W');      // bulkheads with doorways
    f.fill(20, 3, 20, 13, 'H'); f.fill(20, 6, 20, 8, 'W');
    f.fill(13, 14, 16, H - 1, 'W');                            // the hole in the hull: the way out
    return g;
  }
  var KAPAL_OBJECTS = [
    { id: 'kp_crate1', type: 'bldg', x: 3, y: 3, w: 1, h: 1, tex: 'peti_kargo', text: 'A cargo crate stamped with a merchant\'s seal. Spices once, mud now.' },
    { id: 'kp_crate2', type: 'bldg', x: 4, y: 11, w: 1, h: 1, tex: 'peti_kargo', text: 'Crates of rotten cloves. The smell is still faintly there.' },
    { id: 'kp_jar1', type: 'bldg', x: 12, y: 3, w: 1, h: 1, tex: 'tempayan', text: 'A great glazed tempayan (storage jar), big enough to hide in.' },
    { id: 'kp_jar2', type: 'bldg', x: 18, y: 12, w: 1, h: 1, tex: 'tempayan', text: 'A tempayan of blue-and-white porcelain plates, packed in rice husk.' },
    { id: 'kp_wheel', type: 'bldg', x: 26, y: 4, w: 1, h: 1, tex: 'kemudi', text: 'The ship\'s great wheel, crusted with barnacles. It still turns, a little.' },
    { id: 'kp_mirror', type: 'bldg', x: 22, y: 3, w: 1, h: 1, tex: 'cermin_kapten', text: 'A tall mirror in a golden frame. The captain must have admired himself in it every morning.' },
    { id: 'kp_chest', type: 'forage', kind: 'wreck', x: 6, y: 7 },
    { id: 'kp_chest2', type: 'forage', kind: 'goldchest', x: 24, y: 12 },
    { type: 'torch', x: 8, y: 3 }, { type: 'torch', x: 14, y: 13 }, { type: 'torch', x: 22, y: 13 }
  ];

  // ------------------------------------------------------------------ the Palace of the Southern Sea
  function buildKidul() {
    var W = 44, H = 32, g = blank(W, H, 'u'), f = filler(g);
    f.fill(0, 0, W - 1, 1, 'C'); f.fill(0, H - 2, W - 1, H - 1, 'C'); f.fill(0, 0, 1, H - 1, 'C'); f.fill(W - 2, 0, W - 1, H - 1, 'C');
    f.fill(21, 0, 22, 1, 'v'); f.fill(21, 2, 22, 18, 'v');
    f.ell(21.5, 24, 13, 6, 'n');                        // the jade courtyard
    f.ell(6, 8, 2.6, 3, 'C'); f.ell(37, 9, 3, 2.4, 'C'); f.ell(8, 22, 1.6, 2.4, 'C'); f.ell(36, 22, 1.6, 2.4, 'C');
    f.fill(0, H - 2, W - 1, H - 1, 'C');
    return g;
  }
  var KIDUL_OBJECTS = [
    { id: 'ki_istana', type: 'bldg', x: 17, y: 20, w: 9, h: 3, tex: 'istana_kidul', keep: true, light: 0x7affc8, text: 'The Palace of the Southern Sea, built of green jade and pearl. Its gates are carved with waves and lotus flowers.' },
    { id: 'ki_guard1', type: 'bldg', x: 16, y: 25, w: 1, h: 1, tex: 'penjaga_laut', text: 'A palace guard in green, holding a coral spear. He bows to you, very slightly.' },
    { id: 'ki_guard2', type: 'bldg', x: 27, y: 25, w: 1, h: 1, tex: 'penjaga_laut', text: 'A palace guard in green. Fishermen on Java\'s southern coast say never to wear green on the beach, for green is the Queen\'s colour.' },
    { id: 'ki_lamp1', type: 'bldg', x: 19, y: 16, w: 1, h: 1, tex: 'lampu_ubur', light: 0xb0ffe8, text: 'A lamp made of a glowing jellyfish, which seems quite happy about it.' },
    { id: 'ki_lamp2', type: 'bldg', x: 24, y: 16, w: 1, h: 1, tex: 'lampu_ubur', light: 0xb0ffe8, text: 'A jellyfish lamp, glowing softly green.' },
    { id: 'ki_lamp3', type: 'bldg', x: 11, y: 26, w: 1, h: 1, tex: 'lampu_ubur', light: 0xb0ffe8, text: 'A jellyfish lamp.' },
    { id: 'ki_lamp4', type: 'bldg', x: 32, y: 26, w: 1, h: 1, tex: 'lampu_ubur', light: 0xb0ffe8, text: 'A jellyfish lamp.' },
    { id: 'ki_weed1', type: 'forage', kind: 'seaweed', x: 5, y: 14 }, { id: 'ki_weed2', type: 'forage', kind: 'seaweed', x: 38, y: 15 },
    { id: 'ki_weed3', type: 'forage', kind: 'seaweed', x: 14, y: 6 },
    { id: 'ki_clam1', type: 'forage', kind: 'clam', x: 30, y: 5 }, { id: 'ki_clam2', type: 'forage', kind: 'clam', x: 9, y: 17 },
    { id: 'ki_clam3', type: 'forage', kind: 'clam', x: 34, y: 17 }
  ];

  // ------------------------------------------------------------------ the sunken city of Atlantis
  function buildAtlantis() {
    var W = 46, H = 34, g = blank(W, H, 'u'), f = filler(g);
    f.fill(0, 0, W - 1, 1, 'C'); f.fill(0, H - 2, W - 1, H - 1, 'C'); f.fill(0, 0, 1, H - 1, 'C'); f.fill(W - 2, 0, W - 1, H - 1, 'C');
    f.ell(23, 17, 19, 13, 'a');                          // the marble city
    f.fill(8, 16, 45, 17, 'A');                          // the great avenue, out to the east gate
    f.ell(10, 16, 6, 5, 'A');                            // the plaza before the temple
    f.ell(31, 7, 3, 1.6, 'C'); f.ell(33, 27, 3, 1.6, 'C'); f.ell(18, 28, 2, 1.4, 'C');
    return g;
  }
  var ATLANTIS_OBJECTS = [
    { id: 'at_kuil', type: 'bldg', x: 5, y: 9, w: 7, h: 3, tex: 'kuil_atlantis', keep: true, light: 0xbfe8ff, text: 'The great temple of Atlantis. Its columns are white marble, its roof is crowned with a golden trident.' },
    { id: 'at_tiang1', type: 'bldg', x: 17, y: 13, w: 1, h: 1, tex: 'tiang_atlantis', text: 'A marble column, still standing after thousands of years under the sea.' },
    { id: 'at_tiang2', type: 'bldg', x: 22, y: 13, w: 1, h: 1, tex: 'tiang_atlantis', text: 'A marble column carved with leaping dolphins.' },
    { id: 'at_tiang3', type: 'bldg', x: 27, y: 13, w: 1, h: 1, tex: 'tiang_patah', text: 'A broken column. Little fish live in its cracks.' },
    { id: 'at_tiang4', type: 'bldg', x: 17, y: 20, w: 1, h: 1, tex: 'tiang_patah', text: 'A fallen column, half buried in sand.' },
    { id: 'at_tiang5', type: 'bldg', x: 22, y: 20, w: 1, h: 1, tex: 'tiang_atlantis', text: 'A marble column. Someone carved a tiny octopus near the base. Ha!' },
    { id: 'at_tiang6', type: 'bldg', x: 27, y: 20, w: 1, h: 1, tex: 'tiang_atlantis', text: 'A marble column, glowing faintly blue.' },
    { id: 'at_patung', type: 'bldg', x: 33, y: 13, w: 2, h: 1, tex: 'patung_kuda', text: 'A statue of a great sea horse, rearing out of the waves.' },
    { id: 'at_rumah1', type: 'bldg', x: 31, y: 20, w: 4, h: 3, tex: 'rumah_atlantis', text: 'An Atlantean house of white stone. A mosaic of an octopus covers the floor.' },
    { id: 'at_rumah2', type: 'bldg', x: 35, y: 8, w: 4, h: 3, tex: 'rumah_atlantis', text: 'An Atlantean house. On the wall, a map of an island that no longer exists.' },
    { id: 'at_crys1', type: 'forage', kind: 'crystal', x: 14, y: 6 }, { id: 'at_crys2', type: 'forage', kind: 'crystal', x: 40, y: 22 },
    { id: 'at_crys3', type: 'forage', kind: 'crystal', x: 24, y: 28 },
    { id: 'at_amph1', type: 'forage', kind: 'amphora', x: 20, y: 9 }, { id: 'at_amph2', type: 'forage', kind: 'amphora', x: 28, y: 25 },
    { id: 'at_amph3', type: 'forage', kind: 'amphora', x: 12, y: 24 }, { id: 'at_amph4', type: 'forage', kind: 'amphora', x: 39, y: 12 },
    { id: 'at_clam1', type: 'forage', kind: 'clam', x: 6, y: 21 }, { id: 'at_clam2', type: 'forage', kind: 'clam', x: 38, y: 27 }
  ];

  var SEA = { pond: null, amb: 'deep', underwater: true, ride: {}, needs: 'naga' };
  LC.AREAS.kapal = Object.assign({
    name: 'Kapal Karam', sub: 'inside the sunken junk', lvl: 5, build: buildKapal, objects: KAPAL_OBJECTS,
    decor: { n: 16, types: ['shellrock', 'seagrass', 'anemone', 'shellrock'], on: 'W' },
    critters: [{ kind: 'ikan_kecil', n: 2, zone: { x0: 3, y0: 4, x1: 26, y1: 12 } }],
    exits: [{ x0: 13, y0: 17, x1: 16, y1: 17, to: 'laut', sx: 33, sy: 22, dir: 'down' }],
    dim: 0.3, home: { x: 14.5, y: 15 }
  }, SEA);
  LC.AREAS.kidul = Object.assign({
    name: 'Istana Laut Selatan', mapName: 'Istana Laut', sub: 'the Palace of the Southern Sea', lvl: 12, build: buildKidul, objects: KIDUL_OBJECTS,
    decor: { n: 46, types: ['kelp', 'kelp', 'seagrass', 'anemone', 'shellrock', 'seagrass'], on: 'u' },
    critters: [{ kind: 'ikan_kecil', n: 4, zone: { x0: 3, y0: 3, x1: 40, y1: 28 } }, { kind: 'ubur', n: 3, zone: { x0: 3, y0: 3, x1: 40, y1: 16 } }],
    exits: [{ x0: 21, y0: 0, x1: 22, y1: 0, to: 'laut', sx: 24.5, sy: 27, dir: 'up' }],
    jade: true, home: { x: 21.5, y: 3 }
  }, SEA);
  LC.AREAS.atlantis = Object.assign({
    name: 'Kota Atlantis', sub: 'the sunken city', lvl: 15, build: buildAtlantis, objects: ATLANTIS_OBJECTS,
    decor: { n: 40, types: ['kelp', 'seagrass', 'shellrock', 'rubble', 'anemone'], on: 'a' },
    critters: [{ kind: 'ikan_kecil', n: 5, zone: { x0: 6, y0: 4, x1: 40, y1: 29 } }, { kind: 'penyu', n: 1, zone: { x0: 20, y0: 22, x1: 40, y1: 29 } }],
    exits: [{ x0: 45, y0: 16, x1: 45, y1: 17, to: 'laut', sx: 5, sy: 16, dir: 'right' }],
    home: { x: 42.5, y: 16 }
  }, SEA);
  LC.AREA_ORDER = LC.AREA_ORDER.slice(0, LC.AREA_ORDER.indexOf('laut') + 1).concat(['kapal', 'kidul', 'atlantis'], LC.AREA_ORDER.slice(LC.AREA_ORDER.indexOf('laut') + 1));
  LC.AREA_HOWTO.kapal = 'Swim into the sunken junk in Kampung Karang.';
  LC.AREA_HOWTO.kidul = 'Swim through the green-lit arch at the south of Kampung Karang (Pelita Lv 12).';
  LC.AREA_HOWTO.atlantis = 'Dive into the deep trench at the west of Kampung Karang (Pelita Lv 15).';
  Object.assign(LC.MAP_POS, { kapal: [0, 3], kidul: [1, 4], atlantis: [0, 4] });
  LC.MAP_LINKS = LC.MAP_LINKS.concat([['laut', 'kapal', 1], ['laut', 'kidul', 1], ['laut', 'atlantis', 1]]);

  // the way in, from Kampung Karang
  var laut = LC.AREAS.laut.objects;
  laut.forEach(function (o) { if (o.id === 'l_wreck') { o.type = 'wreck'; o.to = 'kapal'; } });
  laut.push(
    { id: 'l_kidul', type: 'seagate', x: 24, y: 28, w: 2, h: 1, tex: 'gerbang_kidul', to: 'kidul', keep: true },
    { id: 'l_palung', type: 'seagate', x: 3, y: 16, w: 2, h: 1, tex: 'palung', to: 'atlantis', keep: true }
  );

  // ------------------------------------------------------------------ the people of the deep
  Object.assign(LC.VILLAGERS, {
    tanggang: {
      name: 'Si Tanggang', role: 'Ghost of a proud captain', area: 'kapal', post: { x: 25, y: 7 }, sprite: true, glow: 0x8fd3ff,
      intro: [
        '...Who swims in my ship? A living child? Do not be afraid. I am only Si Tanggang, or what is left of him.',
        'I was a poor boy from a little kampung by the river. I sailed away, and became a rich captain, with a ship of gold and a noble wife.',
        'One day my ship came home. My old mother rowed out in her little sampan, with her old selendang and a parcel of my favourite food.',
        'And I... I was ashamed of her. Of her poor clothes. In front of everyone, I said: "That woman is not my mother."',
        'She wept and prayed, and the sky went black, and the sea swallowed my ship and me. I have waited here ever since, to say I am sorry.'
      ],
      chat: ['Be kind to your mother. Be kind to your Nenek. Gold is nothing.', 'Every morning I look in that mirror, and I do not like what I see.', 'My mother sang to me when the river flooded. I still remember the tune.', 'The fish do not mind a ghost. They are good company.'],
      tasks: [['melati', 2, 3], ['nasi', 1, 2], ['kerang', 3, 5], ['krathong', 1, 1]],
      taskText: 'in his mother\'s memory', gifts: { 3: ['pinggan_lama', 1], 6: ['duit_lama', 4], 10: ['emas', 2] }
    },
    ratukidul: {
      name: 'Kanjeng Ratu Kidul', role: 'Queen of the Southern Sea', area: 'kidul', post: { x: 21, y: 25 }, sprite: true,
      intro: [
        'Welcome to my palace, child of the land. Few who breathe air ever see these halls.',
        'I am the Queen of the Southern Sea. On Java they tell stories of me: Nyi Roro Kidul, Kanjeng Ratu Kidul. Some of the stories are even true.',
        'The waves bring me everything the land loses: ships, songs, and the tears of fishermen\'s wives. I keep them all.',
        'I love the scent of melati, the jasmine of the land. Bring me flowers, and the sea will be generous to you.'
      ],
      chat: ['The southern sea is wild, and so am I. But I am fair.', 'Respect the waves and they will carry you home.', 'Jasmine is the scent of the land I left long ago.', 'My guards wear green, as I do. It is the colour of the deep.'],
      tasks: [['melati', 3, 5], ['malai', 1, 2], ['canang', 1, 1], ['mutiara', 1, 1]],
      taskText: 'as a gift for the palace', gifts: { 3: ['mutiara', 2], 6: ['kepeng', 600], 10: ['emas', 3] }
    },
    sekar: {
      name: 'Dayang Sekar', role: 'Lady of the palace', area: 'kidul', post: { x: 13, y: 24 }, sprite: true,
      intro: [
        'Oh! A visitor. Please, do not stare at the Queen too long, it is rude. I am Sekar, her lady-in-waiting.',
        'I keep the palace treasury. I trade fine things, and I pay very well for rare fish and treasures from the land.'
      ],
      chat: ['The Queen likes jasmine garlands best. Phuang malai!', 'Palace gossip: the seahorse guards are terribly vain.', 'Ikan emas from the mountain lake? The Queen would adore one.', 'The tide brings us news of every village on the coast.'],
      tasks: [['ikan_kerapu', 1, 2], ['gamat', 1, 2], ['rumpai_laut', 3, 5], ['agar_agar', 1, 2]],
      taskText: 'for the palace kitchens', shop: ['mutiara', 'kristal', 'agar_agar'], buys: { items: ['ikan_kerapu', 'ikan_emas', 'ikan_kelah', 'ikan_buta', 'mutiara', 'pinggan_lama', 'gamat', 'amfora'], mult: 1.5 },
      gifts: { 3: ['agar_agar', 3], 6: ['mutiara', 1], 10: ['kepeng', 700] }
    },
    poseidon: {
      name: 'Poseidon', role: 'King of the sea (from the Greek tales)', area: 'atlantis', post: { x: 8, y: 14 }, sprite: true,
      intro: [
        'HA! A tiny land-dweller in MY city! Brave or foolish? Both, I hope. I like both.',
        'I am Poseidon, lord of the waves in the old tales of Greece. This was Atlantis, the shining island city, until it sank into the sea.',
        'My people sleep now, mostly. But I still sit on my throne, and I still love a gift worthy of a king.',
        'Bring me tribute: pearls, cave crystals and a golden fish from a mountain lake. Do that, and my trident is yours!'
      ],
      chat: ['Earthquakes? Ah. That might have been me. Sorry.', 'Your Naga friend has excellent manners. Unlike some squid I know.', 'Atlantis had the finest baths in the world. Now it IS a bath.', 'A king without a city is just a man with a fork. A very big fork.'],
      tasks: [['ikan_kembung', 3, 5], ['sotong', 2, 3], ['amfora', 1, 1], ['kristal', 1, 2]],
      taskText: 'for his feast', gifts: { 3: ['amfora', 2], 6: ['emas', 2], 10: ['kepeng', 1000] }
    },
    nerissa: {
      name: 'Nerissa', role: 'Atlantean scholar', area: 'atlantis', post: { x: 30, y: 18 }, sprite: true,
      intro: [
        'A visitor! I have so many questions. Do you still have libraries up there? Do you still argue about everything? Wonderful.',
        'I am Nerissa. I study the old scrolls of Atlantis, the ones the water has not eaten yet. I trade, too: crystals and golden fruit.'
      ],
      chat: ['Atlantis sank in a single day and night. Or so the stories say.', 'We used crystals for light. Very clever, very fragile.', 'Poseidon is louder than he is fierce. Mostly.', 'An amphora full of olive oil was worth a fortune here.'],
      tasks: [['kristal', 1, 2], ['amfora', 1, 1], ['pinggan_lama', 1, 1], ['teh_o', 1, 2]],
      taskText: 'for her studies', shop: ['kristal', 'buah_emas', 'jamu_kuat'], buys: { items: ['amfora', 'kristal', 'emas', 'mutiara', 'duit_lama'], mult: 1.5 },
      gifts: { 3: ['kristal', 2], 6: ['buah_emas', 2], 10: ['emas', 3] }
    }
  });
  // the deep quests
  LC.KIDUL_GIFT = { melati: 7, malai: 2, canang: 1 };          // the Queen's blessing: sea forage gives one extra
  LC.POSEIDON_TRIBUTE = { mutiara: 3, kristal: 2, ikan_emas: 1 };   // the trident, and +20 max HP
})(window.LC);
