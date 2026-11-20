/* Little Creature — Chapter 2: Barunai (v1.9). It continues the same story, on the same farm, once Pelita becomes a
 * Legend of the Kampung (Lv 20) and a second letter from Nenek turns up.
 * From the Bruneian epic Syair Awang Semaun, told with respect: fourteen brothers, sons of I-Pai Samaring, grew up
 * apart in many villages. Awang Alak Betatar wants to bring them together and build one home on one river.
 *  1. Nenek's second letter            -> 2. meet Awang Alak Betatar and Awang Semaun at their camp
 *  3. find the twelve other brothers across the land (each asks for a little something from home)
 *  4. follow the tembadau's hoofprints  -> 5. "Baru nah!": the water village of Barunai rises on the river
 *  6. Semaun sails to Johor for a princess; her pinggai bird is lost and her ship sank: find the bird, dive for the chest
 *  7. the wedding kenduri (five dishes)  -> 8. Langkah Semaun, Semaun's giant stride (Shift: a dash)
 *  ...and on some nights, a magic tempayan floats in the river.
 * Left out on purpose: the wars of conquest (they cast real peoples as enemies), religion, and any present-day titles. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  function addItems(map) { Object.keys(map).forEach(function (id) { var it = map[id]; it.id = id; it.icon = it.icon || 'i_' + id; LC.ITEMS[id] = it; }); }
  addItems({
    kain_tenun: { name: 'Kain Tenunan', kind: 'treasure', sell: 260, desc: 'Hand-woven cloth shot with gold thread, from the princess\'s dowry chest.' },
    tembaga: { name: 'Kendi Tembaga', kind: 'treasure', sell: 220, desc: 'A gleaming brass water jug, beaten by hand. Barunai\'s brassmiths are famous.' },
    ambuyat: { name: 'Ambuyat', kind: 'dish', price: 45, sell: 30, food: { full: 30, joy: 10 }, desc: 'Sticky sago starch, twirled on a bamboo chandas and dipped in a sour, spicy sauce.' },
    kelupis: { name: 'Kelupis', kind: 'dish', price: 30, sell: 20, food: { full: 18, joy: 8 }, desc: 'Glutinous rice steamed in a tight leaf parcel.' }
  });

  // ================================================================ the map: hills, the old track, the river (and later the water village)
  function buildBarunai() {
    var W = 46, H = 32, g = [], x, y;
    for (y = 0; y < H; y++) { g.push([]); for (x = 0; x < W; x++) g[y].push('.'); }
    function fill(x0, y0, x1, y1, ch) { for (var yy = y0; yy <= y1; yy++) for (var xx = x0; xx <= x1; xx++) if (yy >= 0 && yy < H && xx >= 0 && xx < W) g[yy][xx] = ch; }
    function ell(cx, cy, rx, ry, ch) { for (var yy = 0; yy < H; yy++) for (var xx = 0; xx < W; xx++) { var dx = (xx - cx) / rx, dy = (yy - cy) / ry; if (dx * dx + dy * dy <= 1) g[yy][xx] = ch; } }
    ell(9, 5, 6.5, 3.2, 'g'); ell(36, 5, 6.5, 3.2, 'g');   // wooded hills
    fill(0, 0, W - 1, 1, 'J'); fill(0, 0, 1, 14, 'J'); fill(W - 2, 0, W - 1, 14, 'J');
    fill(2, 9, W - 3, 10, 'p');                             // the old track along the river
    fill(22, 6, 23, 8, 'p');                                // up the knoll
    fill(2, 14, W - 3, 14, 's'); fill(0, 15, W - 1, 15, 'S'); fill(0, 16, W - 1, H - 1, 'w');   // sand, riverbank, the river
    fill(5, 11, 6, 13, 'p'); fill(5, 14, 6, 20, 'j');       // the jetty where your perahu lands
    fill(39, 14, 40, 17, 'j');                              // an old fishing landing
    return g;
  }
  // the water village's walkways, laid down on the day of "Baru nah!"
  LC.BARUNAI_WALKS = [[5, 21, 41, 21], [12, 22, 12, 26], [20, 22, 20, 26], [28, 22, 28, 26], [36, 22, 36, 26], [24, 15, 25, 20]];
  LC.ch2Step = function () { var S = LC.State.s; return (S && S.quests && S.quests.ch2) || 0; };
  LC.ch2Founded = function () { return LC.ch2Step() >= 5; };
  LC.syncBarunai = function () {
    var g = LC.areaGrid('barunai'), on = LC.ch2Founded();
    LC.BARUNAI_WALKS.forEach(function (r) { for (var y = r[1]; y <= r[3]; y++) for (var x = r[0]; x <= r[2]; x++) g[y][x] = on ? 'j' : (y === 15 ? 'S' : 'w'); });
  };
  var founded = function (S) { return (S.quests.ch2 || 0) >= 5; };
  var OBJ = [
    { id: 'b_perahu', type: 'sampan', x: 7, y: 19, w: 2, h: 1, to: 'farm' },
    { id: 'b_khemah', type: 'bldg', x: 21, y: 11, w: 3, h: 2, tex: 'khemah', keep: true, text: 'The brothers\' camp: a lean-to of nipah fronds, a few mats, and a fire that is never allowed to go out.' },
    { id: 'b_balai', type: 'bldg', x: 20, y: 3, w: 5, h: 3, tex: 'balai', keep: true, when: founded, text: 'The Balai, the great hall of Barunai, where the fourteen brothers meet. Its carved roof can be seen from the river mouth.' },
    { type: 'torch', x: 4, y: 11 }, { type: 'torch', x: 19, y: 8 }, { type: 'torch', x: 26, y: 8 }, { type: 'torch', x: 41, y: 11 },
    // v2.7.1: the brothers' guest house on the hill, where you can sleep and wake up in Barunai
    { id: 'b_tamu', type: 'tamu2', x: 13, y: 5, w: 3, h: 2, tex: 'rumah_air', keep: true, light: 0xffc070 }
  ];
  [[9, 'rumah_air'], [13, 'rumah_air2'], [17, 'rumah_air2'], [21, 'rumah_air'], [25, 'rumah_air'], [29, 'rumah_air2'], [33, 'rumah_air2'], [37, 'rumah_air']].forEach(function (h, i) {
    OBJ.push({ id: 'b_rumah' + i, type: 'bldg', x: h[0], y: 23, w: 3, h: 2, tex: h[1], when: founded, text: ['A house on stilts above the river. Washing flaps on the line and a little boat is tied at the steps.', 'A family\'s house over the water. Someone is grilling fish on the veranda.', 'A stilt house with a brass gong hanging by the door.', 'A house over the river, its walls woven from nipah. Children dive from the steps.'][i % 4] });
  });
  LC.AREAS.barunai = {
    name: 'Barunai', sub: 'the river of the fourteen brothers', lvl: 20, build: buildBarunai, objects: OBJ,
    pond: 'river', amb: 'river', decor: { n: 40, types: ['bush', 'hibiscus', 'lalang', 'rock', 'lalang', 'bush'], on: '.' },
    critters: [{ kind: 'chicken', n: 2, zone: { x0: 8, y0: 11, x1: 40, y1: 13 } }],
    exits: [], home: { x: 5.5, y: 16 }, ride: { bike: 1 },
    trees: { n: 14, on: 'g', tex: ['jtree', 'jtree2'], text: 'A tall rainforest tree on the hills above Barunai.' }
  };
  LC.AREA_ORDER.push('barunai');
  LC.AREA_HOWTO.barunai = 'Take the perahu from the farm jetty (Pelita Lv 20).';
  LC.MAP_POS.barunai = [3.5, 3.4];
  LC.MAP_LINKS.push(['farm', 'barunai', 1]);
  LC.LEVEL_REWARDS[20].unlock = 'barunai';
  // Nenek's perahu at the farm jetty (it only appears once Chapter 2 can begin)
  LC.OBJECTS.push({ id: 'perahu_barunai', type: 'sampan', x: 18, y: 31, w: 2, h: 1, to: 'barunai', when: function (S) { return (S.ghost.level || 1) >= 20 || (S.quests.ch2 || 0) >= 1; } });

  // ================================================================ the trails, and where things happen
  LC.CH2 = {
    trail1: [{ x: 31, y: 11 }, { x: 36, y: 8 }, { x: 41, y: 4 }, { x: 30, y: 3 }, { x: 17, y: 3 }, { x: 8, y: 7 }],   // hoofprints, east to west
    temb: { x: 3, y: 7 }, bend: { x: 27, y: 13 }, home: { x: 27, y: 4 },
    trail2: [{ x: 11, y: 22 }, { x: 21, y: 26 }, { x: 27, y: 26 }], bird: { x: 40, y: 22 },   // feathers, along the walkways
    ship: { x: 41, y: 17 }, vase: { x: 26, y: 18 },
    feast: { dish: 5 },
    lines: ['', 'nenek', 'gather', 'trail', 'found', 'voyage', 'pinggai', 'feast', 'done'],
    tamu: { x: 14, y: 7 },   // v2.7.1: where you wake up, outside the guest house
    // v2.7.1: where to find what each brother asks for (shown in the goal line and his Talk row)
    findHow: {
      kayu: 'gather fallen branches in Hutan Rimba, or buy it from Tukang Leong in Kampung Tepian',
      ikan_keli: 'fish in a river or pond; it bites best after dark',
      nasi_lemak: 'cook it at Nenek\'s dapur (padi, cili and kelapa)',
      rotan: 'cut rattan vines in Hutan Rimba',
      madu_tualang: 'collect it from the wild bees\' nests on the giant tualang trees in Hutan Rimba',
      herba: 'pick wild herbs in Hutan Rimba',
      kerang: 'collect seashells on the beaches of Pulau Mutiara',
      kelapa: 'pick it from the coconut palms in Kampung Tepian or on Pulau Mutiara',
      daun_teh: 'pluck it from the tea bushes on Gunung Kabus',
      strawberi: 'pick it from the strawberry patches on Gunung Kabus',
      buah_naga: 'pick it from the dragon fruit cacti in Bukit Pasir (Kak Mai sells it too)',
      padi: 'grow it in the flooded sawah on your farm (5 days)'
    }
  };
  LC.TEXT.tamu2 = 'The brothers\' guest house: a little stilt house on the hill, with a woven mat, a pillow and a mosquito net. "For our friend from across the sea," Awang Alak Betatar says. "Stay as long as you like."';
  LC.AREAS.barunai.clear = LC.CH2.trail1.concat([LC.CH2.temb, LC.CH2.home]).map(function (p) { return { x: p.x, y: p.y, r: 1 }; });
  LC.LANGKAH = { cd: 4, dist: 56 };
  LC.hasLangkah = function () { return LC.ch2Step() >= 8; };

  // ================================================================ the fourteen brothers (and a princess from Johor)
  var POOL = [['nasi', 1, 2], ['kelapa', 1, 2], ['ikan_bakar', 1, 1], ['pisang', 2, 3]];
  var GIFTS = { 3: ['kepeng', 200], 6: ['kain_tenun', 1], 10: ['kepeng', 800] };
  function look(shirt, hat, extra) { return Object.assign({ skin: '#a8714a', shirt: shirt, shirt2: shirt, bottom: '#5a4a3a', bottom2: '#40342a', hair: '#1a1210', hat: hat }, extra || {}); }
  // vid, name, short role, where he waits, his spot there, his spot in Barunai, look, what he asks for, a line about himself
  var BRO = [
    ['berbai', 'Pateh Berbai', 'the thoughtful brother', 'barunai', [6, 5], [9, 12], look('#3a6a4a', 'tanjak', { beard: '#5a5a5a' }), ['kayu', 5], 'They say I think too much. I say someone has to.'],
    ['sari', 'Damang Sari', 'the quiet fisherman', 'barunai', [41, 12], [12, 12], look('#6a4a8a', 'headband'), ['ikan_keli', 2], 'I would rather fish than talk. But here I am, talking.'],
    ['mambang', 'Pateh Mambang', 'the cheerful trader', 'kampung', [31, 15], [15, 12], look('#8a6a2a', 'tanjak'), ['nasi_lemak', 1], 'I trade a little, cook a little, and sing a lot.'],
    ['sindayong', 'Pateh Sindayong', 'the boat mender', 'kampung', [22, 23], [26, 7], look('#3a3a6a', 'tanjak'), ['rotan', 2], 'I mend boats. One day I will build a big one.'],
    ['tuba', 'Pateh Tuba', 'the honey gatherer', 'forest', [16, 10], [28, 12], look('#2a6a6a', 'headband'), ['madu_tualang', 1], 'The forest is my house, and the bees are my neighbours.'],
    ['lebar', 'Damang Lebar Daun', 'the herbalist', 'forest', [24, 20], [31, 12], look('#4a7a3a', 'leaf'), ['herba', 3], 'I know every leaf in the forest, and which ones heal.'],
    ['sangkuna', 'Pateh Sangkuna', 'the tide reader', 'island', [20, 19], [34, 12], look('#3a5a8a', 'terendak'), ['kerang', 3], 'I read the tides the way other people read letters.'],
    ['hapu', 'Hapu Awang', 'the coconut climber', 'island', [27, 22], [37, 12], look('#a85a3a', 'headband'), ['kelapa', 2], 'Coconuts, coconuts. I climb, I crack, I share.'],
    ['manggurun', 'Pateh Manggurun', 'the patient one', 'mountain', [24, 16], [40, 12], look('#5a5a6a', 'tanjak_red'), ['daun_teh', 3], 'The mountain wind taught me to be patient.'],
    ['laila', 'Pateh Laila Langgong', 'the singer', 'mountain', [8, 18], [28, 7], look('#7a3a5a', 'tanjak_gold'), ['strawberi', 3], 'I sing to the mist, and sometimes it sings back.'],
    ['malakai', 'Pateh Malakai', 'the dune walker', 'desert', [20, 9], [17, 7], look('#a8843a', 'headband'), ['buah_naga', 2], 'The dunes are hot, but the people here are warm.'],
    ['pahit', 'Pateh Pahit', 'the farmer', 'farm', [24, 24], [19, 7], look('#5a7a3a', 'terendak'), ['padi', 3], 'Pahit means bitter. I am not bitter! Only my coffee is.']
  ];
  LC.BROTHERS = BRO.map(function (b) { return b[0]; });
  BRO.forEach(function (b) {
    var vid = b[0];
    LC.VILLAGERS[vid] = {
      name: b[1], role: b[2].charAt(0).toUpperCase() + b[2].slice(1), area: b[3], post: { x: b[4][0], y: b[4][1] }, look: b[6], chapter2: true, brother: true, find: b[7],
      intro: ['Salam, friend. I am ' + b[1] + ', ' + b[2] + '. ' + b[8],
        'My mother raised me here. Long ago our father, I-Pai Samaring, passed through on the trail of a tembadau, a wild ox. He stayed long enough for me to be born, then followed the trail on.',
        'They say I have brothers, scattered like seeds across the land. Sometimes I wonder about them.'],
      chat: [b[8], 'Fourteen brothers, one father, many mothers. What a family!', 'A river is a road that never needs mending.'],
      tasks: POOL.concat([[b[7][0], 1, Math.max(1, b[7][1] - 1)]]), taskText: 'for his household', gifts: GIFTS,
      hideIf: function (S) { return (S.quests.ch2 || 0) < 1; },
      aliveIf: function (S) { return !!(S.quests.ch2found && S.quests.ch2found[vid]); },
      alive: { area: 'barunai', post: { x: b[5][0], y: b[5][1] }, role: b[2].charAt(0).toUpperCase() + b[2].slice(1) + ', home in Barunai' }
    };
  });
  Object.assign(LC.VILLAGERS, {
    alak: {
      name: 'Awang Alak Betatar', role: 'The brother who gathers the brothers', area: 'barunai', post: { x: 19, y: 12 }, chapter2: true,
      look: look('#2f5a8a', 'tanjak_gold', { bottom: '#c8a040', bottom2: '#a07a28' }),
      intro: [
        'A traveller from across the sea! Welcome to our little camp. I am Awang Alak Betatar, and this is Awang Semaun, the youngest of us.',
        'Our father, I-Pai Samaring, once followed a tembadau, a wild ox, through thirteen villages. In each one he married, and in each a son was born. Fourteen brothers, scattered like seeds.',
        'I dream of bringing us all together, to build one home on one river. Semaun and I have searched, but the land is wide.',
        'Your little spirit\'s light finds paths that others cannot. Will you help us find our brothers?'
      ],
      chat: ['One river, one people. That is all I want.', 'A leader listens more than he speaks. I am still practising.', 'My brothers are all different. That is our strength.'],
      tasks: POOL, taskText: 'for the camp', gifts: GIFTS, hideIf: function (S) { return (S.quests.ch2 || 0) < 1; }
    },
    semaun: {
      name: 'Awang Semaun', role: 'The strongest of the brothers', area: 'barunai', post: { x: 25, y: 12 }, chapter2: true,
      look: look('#8a2a2a', 'tanjak_red', { skin: '#9a6440' }),
      intro: [
        'Hah! You have strong legs, friend. I am Awang Semaun, the youngest.',
        'They say I once left a footprint between two hills, and a hole in a rock shaped like my ear. They exaggerate. They were small hills.'
      ],
      chat: ['Strength is a gift. Use it to carry, not to crush.', 'I can outrun a tembadau. Not uphill, though.', 'My brother Alak Betatar will make a fine leader. I will make sure of it.'],
      tasks: POOL, taskText: 'for a hungry hero', gifts: GIFTS,
      hideIf: function (S) { var q = S.quests; return (q.ch2 || 0) < 1 || (q.ch2 === 6 && S.day <= (q.ch2day || 0)); }   // away in Johor for a day
    },
    puteri: {
      name: 'Tuan Puteri', role: 'A princess from Johor', area: 'barunai', post: { x: 21, y: 13 }, chapter2: true,
      look: look('#e9c46a', 'bun', { skin: '#c9905e', shirt2: '#c4922f', bottom: '#8a2a5a', bottom2: '#6a1e44' }),
      intro: [
        'Oh! You must be the friend Semaun told me about. I have come from Johor to marry Awang Alak Betatar.',
        'But our ship sank just as it reached the river mouth! Everyone swam ashore, thank goodness, but my pinggai bird flew away in fright, and my mother\'s dowry chest went down with the ship.',
        'Could you find my Si Pinggai? He leaves feathers wherever he goes. And perhaps the chest can still be reached from the old landing, where the bubbles rise.'
      ],
      chat: ['Johor is far, but Barunai already feels like home.', 'Si Pinggai sings every morning. He is a terrible singer.', 'The brothers argue like sparrows, then laugh like children.'],
      tasks: [['melati', 2, 3], ['kain_tenun', 1, 1], ['kuih_pandan', 1, 2]], taskText: 'for the wedding', gifts: GIFTS,
      hideIf: function (S) { var q = S.quests; return !((q.ch2 || 0) >= 6 && S.day > (q.ch2day || 0)); }
    }
  });
  LC.VILLAGERS.hapu.shop = ['ambuyat', 'kelupis'];
  LC.VILLAGERS.berbai.buys = { items: ['emas', 'mutiara', 'kain_tenun', 'tembaga', 'kristal', 'pinggan_lama'], mult: 1.4 };
  // a brother is somewhere else until Chapter 2 begins; Semaun is away for a day; the princess arrives after him
  var baseVillager = LC.villager;
  LC.villager = function (vid) {
    var v = baseVillager(vid), S = LC.State.s;
    if (v && v.chapter2 && S && v.hideIf && v.hideIf(S)) return Object.assign({}, v, { area: 'none' });
    return v;
  };

  // ================================================================ the story, in their words
  LC.CH2TEXT = {
    letter: [
      { text: '✦ Chapter 1 complete: Little Creature ✦  Pelita is a Legend of the Kampung.' },
      { text: 'That night, Pelita\'s light drifts up into the roof of the stilt house and settles on an old tin box wedged behind a beam. Inside is a second letter, in Nenek\'s careful handwriting.' },
      { name: 'Nenek\'s second letter', text: 'My dear cucu, if Pelita\'s light is strong enough to find this, then you have looked after it very well. I am proud of you.' },
      { name: 'Nenek\'s second letter', text: 'When I was a girl, my father rowed me across the sea to Barunai. There I met fourteen brothers who were searching for one another, and for a place to call home. Their story never finished.' },
      { name: 'Nenek\'s second letter', text: 'The old ones say the brothers still wait, between one story and the next, for a friend to bring them together. I have tied a perahu at our jetty for you. Pelita will light the way.  -- Nenek' },
      { text: '✦ Chapter 2: Barunai ✦  Take the perahu at the farm jetty, across the sea to Barunai.' }
    ],
    gatherDone: [
      { who: 'alak', text: 'Look at them all, friend. Fourteen brothers by one fire, for the first time in our lives.' },
      { who: 'semaun', text: 'Now we need a place to build. A good river, deep water, sheltering hills...' },
      { who: 'berbai', text: 'Our father found his way by following a tembadau. Its tracks were seen again in these hills this morning. Perhaps it can guide us too.' },
      { text: 'New task: follow the tembadau\'s hoofprints, starting east of the camp.' }
    ],
    tembadau: [
      { text: 'At the end of the trail stands a tembadau: a great wild ox with a dark coat, white stockings and gentle eyes. It watches you, ready to bolt.' },
      { text: 'You stand very still, and Pelita hums softly. Slowly, the tembadau lowers its head and lets you touch its nose.' },
      { text: 'Then it turns and walks calmly down towards the river, as if it wants you to follow. It stops at a wide bend, and drinks.' },
      { text: 'New task: tell Awang Alak Betatar what the tembadau found.' }
    ],
    founding: [
      { text: 'Fourteen brothers stand together on the riverbank for the first time. The tembadau drinks quietly where the river bends.' },
      { who: 'berbai', text: 'Look: the water is deep enough for big ships, the hills shelter us from storms, and the river is full of fish.' },
      { who: 'alak', text: 'Then this is the place. Brothers!' },
      { text: 'All fourteen voices ring out across the water together: "BARU NAH!"  (Now we have found it!)' }
    ],
    founded: [
      { text: 'And from that day, the place was called Barunai. Houses rise on stilts above the water, joined by long wooden walkways, and the river fills with boats.' },
      { who: 'alak', text: 'Thank you, friend. Without you, we would still be fourteen lonely men in fourteen villages. Barunai will always be your home too.' },
      { text: '✦ The water village of Barunai is founded! (+1000 kepeng) The brothers have shops and tasks now. Talk to Awang Semaun: he has a voyage in mind. ✦' }
    ],
    voyage: [
      { who: 'semaun', text: 'A new home needs a family. My brother should marry, and I hear the Princess of Johor is as wise as she is kind.' },
      { who: 'semaun', text: 'I will sail to Johor and ask for her hand on his behalf. Watch the river for me. I will be back tomorrow!' }
    ],
    bird: [{ text: 'On top of a mooring post sits a small bird with a long, shimmering tail. It cocks its head at you... and hops onto your finger. Si Pinggai!' }],
    ship: [{ text: 'You take a deep breath and dive down through the bubbles. The wreck lies on the riverbed, and the dowry chest is still lashed to its mast. You pull it free and kick back up to the surface!' }],
    feastAsk: 'A wedding needs a feast! Bring 5 cooked dishes for the kenduri, and all of Barunai will celebrate together.',
    feast: [
      { text: 'Drums and gongs, fourteen brothers, a princess from Johor and the whole river village share the kenduri on the walkways over the water. Si Pinggai sings, terribly, from a rooftop.' },
      { who: 'puteri', text: 'Thank you for finding my Si Pinggai, and my mother\'s chest. I will never forget it.' },
      { who: 'semaun', text: 'Friend, you walked the whole land for us. Take something of mine: Langkah Semaun, my giant stride.' },
      { text: '✦ New ability: Langkah Semaun! Press Shift (or tap the footprints beside your hotbar) to leap forward a few steps, even past enemies. (+800 kepeng, 1 Kain Tenunan) ✦' },
      { text: '✦ Chapter 2 complete: Barunai ✦  Visit the brothers any time. And on some nights, look out for something magical floating in the river...' }
    ],
    vase: 'A giant tempayan, glowing softly, floats in the river. The old tales of Barunai speak of a magic jar that rises from the water on quiet nights.'
  };
  Object.assign(LC.TEXT, { jejak: 'Hoofprints of a tembadau, a wild ox.' });
})(window.LC);
