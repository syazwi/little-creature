/* Little Creature — Chapter 3: Kampong Ayer, part 1 (v2.0). It continues Chapter 2 on the same save.
 * Building the water village (from the history of Kampong Ayer) and the cockfight of the two roosters (from the
 * Bruneian epic Syair Awang Semaun and the legends of Brunei Bay):
 *  0 Pateh Berbai explains why they build on the water   1-3 build the craft quarter, the floating market landing
 *  and new homes (nibong poles from the Barunai hills, belian ironwood from the deep forest, atap, rotan, kepeng)
 *  4 the Majapahit fleet arrives with a challenge   5 train Mutiara with Awang Senuai (3 days)
 *  6 the cockfight: Asmara flees and becomes Pulau Pilong-Pilongan; Mutiara is turned to stone, Lumut Lunting
 *  7 Teluk Barunai: lay the ghost of Asmara to rest (a golden plate, and a feather from Mutiara's stone)
 *  8 part 1 complete (the wars come in part 2).
 * The cockfight is shown as a legend (feints, wing-beats, a mighty crow), with no blood. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  function addItems(map) { Object.keys(map).forEach(function (id) { var it = map[id]; it.id = id; it.icon = it.icon || 'i_' + id; LC.ITEMS[id] = it; }); }
  addItems({
    nibong: { name: 'Tiang Nibong', kind: 'material', sell: 12, desc: 'A straight, tough pole from the nibong palm. Kampong Ayer stands on thousands of them.' },
    belian: { name: 'Kayu Belian', kind: 'material', sell: 45, desc: 'Borneo ironwood: so hard it sinks, and it never rots in water. Rare, from the oldest forest.' },
    pinggan_emas: { name: 'Pinggan Emas', kind: 'treasure', sell: 500, desc: 'A golden plate from Awang Kilau\'s workshop, fit for a royal rooster.' },
    bulu_mutiara: { name: 'Bulu Mutiara', kind: 'treasure', desc: 'A single feather of stone from Lumut Lunting, where Mutiara stands guard over the river mouth.' }
  });
  LC.ITEMS.tembaga.price = 300; LC.ITEMS.kain_tenun.price = 360;   // now sold in the craft quarter
  Object.assign(LC.FORAGE, {
    nibong: { name: 'Nibong palm', verb: 'Cut nibong poles', item: 'nibong', count: 2, regrow: 2, energy: 3 },
    belian: { name: 'Fallen belian', verb: 'Saw belian ironwood', item: 'belian', count: 1, regrow: 3, energy: 4 }
  });
  [['b_nibong1', 4, 4], ['b_nibong2', 12, 3], ['b_nibong3', 13, 7], ['b_nibong4', 32, 5], ['b_nibong5', 39, 7]].forEach(function (n) { LC.AREAS.barunai.objects.push({ id: n[0], type: 'forage', kind: 'nibong', x: n[1], y: n[2] }); });
  LC.AREAS.barunai.objects.push({ id: 'b_belian1', type: 'forage', kind: 'belian', x: 41, y: 6 });
  LC.AREAS.forest.objects.push({ id: 'f_belian1', type: 'forage', kind: 'belian', x: 35, y: 30 }, { id: 'f_belian2', type: 'forage', kind: 'belian', x: 40, y: 24 });

  // ================================================================ the water village grows (personal, like the founding)
  LC.ch3Step = function () { var S = LC.State.s; return (S && S.quests && S.quests.ch3) || 0; };
  LC.kaStage = function () { var S = LC.State.s; return (S && S.quests && S.quests.kaStage) || 0; };
  LC.KA_STAGES = [null,
    { name: 'the craft quarter', desc: 'A double walkway on the south side, with five workshops: a blacksmith, a brassmith, a weaver, a boat builder and a goldsmith.', cost: { nibong: 10, belian: 4, atap: 10 }, kepeng: 1500 },
    { name: 'the floating market landing', desc: 'A wide landing by the west jetty, where the padian women moor their boats every morning.', cost: { nibong: 8, rotan: 8 }, kepeng: 2000 },
    { name: 'new homes over the river', desc: 'Five new sets of pilings between the shore and the walkway. You choose which to build on, and how.', cost: { nibong: 15, belian: 6, atap: 12 }, kepeng: 4000 }
  ];
  LC.KA_WALKS = [null,
    [[8, 27, 40, 28]],                                                               // the craft quarter walkway
    [[2, 21, 4, 26]],                                                                // the market landing (the padian moor just west of it)
    [[10, 20, 10, 20], [15, 20, 15, 20], [20, 20, 20, 20], [29, 20, 29, 20], [34, 20, 34, 20]]   // steps up to the new pilings
  ];
  var baseSync = LC.syncBarunai;
  LC.syncBarunai = function () {
    baseSync();
    var g = LC.areaGrid('barunai'), st = (LC.worldQuests ? LC.worldQuests() : LC.State.s.quests).kaStage || 0;   // (v2.7.1: shared looks)
    for (var n = 1; n < LC.KA_WALKS.length; n++) LC.KA_WALKS[n].forEach(function (r) { for (var y = r[1]; y <= r[3]; y++) for (var x = r[0]; x <= r[2]; x++) g[y][x] = st >= n ? 'j' : 'w'; });
  };
  var stage = function (n) { return function (S) { return (S.quests.kaStage || 0) >= n; }; };
  [['b_besi', 9, 'bengkel_besi', 'The blacksmiths\' workshop: a glowing forge, an anvil, and a rack of blades. This end of the village will be called Kampong Pandai Besi.'],
   ['b_tembaga', 15, 'bengkel_tembaga', 'The brassmiths\' workshop. Kendi jugs, gongs and little cannons shine in the sun.'],
   ['b_tenun', 21, 'bengkel_tenun', 'The weavers\' house. A wooden loom clacks inside, weaving kain tenunan with gold thread.'],
   ['b_perahu', 27, 'bengkel_perahu', 'The boat builders\' shed, with a half-finished perahu on trestles.'],
   ['b_emas', 33, 'kedai_emas', 'The goldsmith\'s house. Through the window: tiny hammers, gold leaf, and a very careful old man.']].forEach(function (w) {
    LC.AREAS.barunai.objects.push({ id: w[0], type: 'bldg', x: w[1], y: 30, w: 3, h: 2, tex: w[2], keep: true, shared: true, when: stage(1), text: w[3] });
  });
  LC.KA_PLOTS = [{ id: 'kp0', x: 9 }, { id: 'kp1', x: 14 }, { id: 'kp2', x: 19 }, { id: 'kp3', x: 28 }, { id: 'kp4', x: 33 }];
  LC.KA_PLOTS.forEach(function (p) { LC.AREAS.barunai.objects.push({ id: p.id, type: 'kplot', x: p.x, y: 18, w: 3, h: 2, tex: 'tiang_kosong', shared: true, when: stage(3) }); });
  LC.KA_HOUSES = { rumah_air: 'Rumah Atap Nipah (a palm-thatched house)', rumah_air2: 'Rumah Atap Hijau (a house with a green roof)', rumah_air3: 'Rumah Papan Biru (a blue plank house)' };
  LC.KA_HOUSE_COST = { nibong: 4, atap: 3 }; LC.KA_HOUSE_KEPENG = 300;
  LC.AREAS.barunai.objects.push(
    { id: 'b_jong', type: 'bldg', x: 39, y: 29, w: 5, h: 3, tex: 'jong_majapahit', when: function (S) { var c = S.quests.ch3 || 0; return c >= 4 && c <= 6; }, text: 'The flagship of Majapahit, its sails painted red and white. Forty more ships wait at the river mouth.' },
    { id: 'b_perahu_teluk', type: 'sampan', x: 3, y: 19, w: 2, h: 1, to: 'teluk', when: function (S) { return (S.quests.ch3 || 0) >= 7; } }
  );
  LC.PADIAN = [{ x: 1, y: 22 }, { x: 1, y: 25 }];
  LC.PADIAN_POOL = ['kangkung', 'jagung', 'cili', 'ikan_kembung', 'kuih_pandan', 'pisang', 'kelapa', 'telur', 'ambuyat', 'kelupis', 'nasi_lemak', 'padi'];

  // ================================================================ Teluk Barunai: the bay of the two roosters
  function buildTeluk() {
    var W = 44, H = 32, g = [], x, y;
    for (y = 0; y < H; y++) { g.push([]); for (x = 0; x < W; x++) g[y].push('o'); }
    function ell(cx, cy, rx, ry, ch) { for (var yy = 0; yy < H; yy++) for (var xx = 0; xx < W; xx++) { var dx = (xx - cx) / rx, dy = (yy - cy) / ry; if (dx * dx + dy * dy <= 1) g[yy][xx] = ch; } }
    function fill(x0, y0, x1, y1, ch) { for (var yy = y0; yy <= y1; yy++) for (var xx = x0; xx <= x1; xx++) g[yy][xx] = ch; }
    ell(31, 13, 11, 9, 'h'); ell(31, 13, 9.5, 7.5, 's'); ell(31, 13, 8, 6, 'm'); ell(33, 10, 2.5, 2, 'M');   // Pulau Pilong-Pilongan
    ell(10, 25, 4.5, 2.6, 'h'); ell(10, 25, 3.2, 1.6, 's');                                                // Lumut Lunting, a sandbank
    fill(18, 13, 22, 14, 'j');                                                                               // the island's jetty
    return g;
  }
  LC.AREAS.teluk = {
    name: 'Teluk Barunai', sub: 'the bay of the two roosters', lvl: 20, build: buildTeluk,
    objects: [
      { id: 't_back', type: 'sampan', x: 16, y: 13, w: 2, h: 1, to: 'barunai' },
      { id: 't_hop1', type: 'hop', x: 19, y: 15, tex: 'perahu_kecil', to: { x: 10, y: 25 }, dir: 'up', label: 'Row over to Lumut Lunting' },
      { id: 't_hop2', type: 'hop', x: 10, y: 27, tex: 'perahu_kecil', to: { x: 20, y: 13 }, dir: 'right', label: 'Row back to Pulau Pilong-Pilongan' },
      { id: 't_batu_ayam', type: 'batu_ayam', x: 10, y: 24, w: 1, h: 1, tex: 'batu_ayam' },
      { id: 't_shell1', type: 'forage', kind: 'shells', x: 24, y: 9 }, { id: 't_shell2', type: 'forage', kind: 'shells', x: 38, y: 16 },
      { id: 't_shell3', type: 'forage', kind: 'shells', x: 27, y: 19 }, { id: 't_shell4', type: 'forage', kind: 'shells', x: 8, y: 25 },
      { id: 't_rock1', type: 'forage', kind: 'boulder', x: 28, y: 11 }, { id: 't_rock2', type: 'forage', kind: 'boulder', x: 36, y: 15 }
    ],
    pond: 'sea', amb: 'sea', decor: { n: 24, types: ['rock', 'coral', 'lalang', 'rock'], on: 's' },
    critters: [{ kind: 'ketam', n: 3, zone: { x0: 24, y0: 8, x1: 38, y1: 18 } }],
    exits: [], home: { x: 20.5, y: 13 }, ride: {}
  };
  LC.AREA_ORDER.push('teluk');
  LC.AREA_HOWTO.teluk = 'Row from the west jetty of Barunai (Chapter 3).';
  LC.MAP_POS.teluk = [4.4, 3.9];
  LC.MAP_LINKS.push(['barunai', 'teluk', 1]);
  LC.GHOST_SPOT = { x: 33, y: 13 };

  // ================================================================ new neighbours: the craftspeople, Awang Senuai, the King of Majapahit
  var POOL = [['nasi', 1, 2], ['kelapa', 1, 2], ['ikan_bakar', 1, 1], ['pisang', 2, 3]];
  var GIFTS = { 3: ['kepeng', 250], 6: ['kain_tenun', 1], 10: ['kepeng', 900] };
  function look(shirt, hat, extra) { return Object.assign({ skin: '#a8714a', shirt: shirt, shirt2: shirt, bottom: '#5a4a3a', bottom2: '#40342a', hair: '#1a1210', hat: hat }, extra || {}); }
  function craftsman(name, role, x, lk, intro, chat, extra) {
    return Object.assign({ name: name, role: role, area: 'barunai', post: { x: x, y: 28 }, look: lk, intro: intro, chat: chat, tasks: POOL, taskText: 'for the workshop', gifts: GIFTS, craft: true,
      hideIf: function (S) { return (S.quests.kaStage || 0) < 1; } }, extra || {});
  }
  Object.assign(LC.VILLAGERS, {
    juru: craftsman('Wak Juru', 'Blacksmith', 10, look('#3a3a3a', 'headband', { beard: '#5a5a5a' }),
      ['Clang! Clang! Oh, hello. I am Wak Juru. Iron listens to fire, and fire listens to me.', 'Bring me stone for the furnace and I will temper your blades. A tempered edge bites deeper.'],
      ['Hot iron is honest. It shows every mistake.', 'My grandfather forged nails for the first houses here.', 'Mind the sparks!'], { shop: ['parang', 'tongkat'] }),
    kemala: craftsman('Dang Kemala', 'Brassmith', 16, look('#c8902a', 'tudung', { hatColor: '#7a3a2a', skin: '#b9825a' }),
      ['Welcome! I am Dang Kemala. I beat brass into kendi, gongs, and anything that should shine.', 'I could make you a brass watering can that holds far more than your old gembor.'],
      ['Brass sings when it is beaten properly.', 'One day Barunai\'s brass will be famous across the seas.', 'A gong should be heard across the whole river.'], { shop: ['tembaga'] }),
    // (v3.2.4: her id was 'dayang', which Chapter 7's Mak Dayang of Santubong also used, and replaced her)
    dayang_barunai: craftsman('Mak Dayang', 'Weaver', 22, look('#7a1e3a', 'tudung', { hatColor: '#e9c46a', skin: '#c9905e' }),
      ['Shh, the loom is counting. One, two... there. I am Mak Dayang. I weave kain tenunan, threads of silk and gold.', 'A good cloth takes a month. A great one takes a lifetime.'],
      ['Every pattern has a name. This one is "bunga bertabur", scattered flowers.', 'Gold thread is patient. Silk is not.', 'My daughter weaves faster than me now. Do not tell her I said so.'], { shop: ['kain_tenun'] }),
    lajak: craftsman('Pak Lajak', 'Boat builder', 28, look('#4a6a8a', 'terendak'),
      ['Ah, a customer! I am Pak Lajak. Every family here needs a boat, and every boat needs me.', 'Bring me wood and belian, and I will build you your own perahu. Then you can ride the water taxis to anywhere in the village.'],
      ['A perahu is a house that walks on water.', 'Belian for the keel, always. It never rots.', 'The tide is your engine, if you are patient.']),
    kilau: craftsman('Awang Kilau', 'Goldsmith', 34, look('#e9c46a', 'tanjak_gold', { beard: '#e8e4dc', skin: '#b9825a' }),
      ['Gently, gently. I am Awang Kilau. Gold is soft, so a goldsmith must be softer.', 'Bring me gold, and I will make something worthy of a king. Or of a rooster, if it comes to that.'],
      ['Gold remembers every fingerprint.', 'The Majapahit court eats from golden plates, they say. Imagine the washing up.', 'Measure twice, hammer once.'], { buys: { items: ['emas', 'bijih_emas', 'mutiara', 'kristal'], mult: 1.5 } }),
    senuai: {
      name: 'Awang Senuai', role: 'Awang Alak Betatar\'s clever nephew', area: 'barunai', post: { x: 16, y: 13 }, look: look('#3a7a6a', 'headband', { skin: '#b07850' }),
      intro: ['Salam! I am Awang Senuai, Uncle Alak Betatar\'s nephew. And this is Mutiara, the finest rooster in Borneo. He has never lost a fight. Never!', 'If Majapahit wants a contest, Mutiara and I are ready. Well... almost ready. Will you help me train him?'],
      chat: ['Mutiara eats better than I do.', 'A rooster\'s courage is in his crow.', 'Uncle is worried. I am not. Mostly.'], tasks: [['padi', 2, 3], ['jagung', 1, 2], ['dedak', 3, 5]], taskText: 'for Mutiara', gifts: GIFTS,
      hideIf: function (S) { return (S.quests.ch3 || 0) < 4; }
    },
    raden: {
      name: 'Raden Angsuka Dewa', role: 'The King of Majapahit', area: 'barunai', post: { x: 33, y: 13 }, look: look('#b8322a', 'tanjak_gold', { bottom: '#e9c46a', bottom2: '#c4922f', skin: '#c9905e' }),
      intro: ['So you are the friend of Barunai. I am Raden Angsuka Dewa, King of Majapahit. My rooster Asmara eats from a golden plate, and when he crows, every rooster on this river falls silent.', 'Let this be a fair and equal contest. My honour depends on it, as does Barunai\'s.'],
      chat: ['Majapahit is great because it is fair. Or so I tell my ministers.', 'Asmara has never even been scratched.', 'Your river is beautiful. I see why the brothers chose it.'], tasks: [['kain_tenun', 1, 1], ['emas', 1, 1]], taskText: 'for the royal ship', gifts: GIFTS,
      hideIf: function (S) { var c = S.quests.ch3 || 0; return c < 4 || c > 6; }
    }
  });

  // ================================================================ the story, in their words
  LC.CH3TEXT = {
    why: [
      { who: 'berbai', text: 'Friend, the brothers keep asking me: why do we build over the water, and not on the hills?' },
      { who: 'berbai', text: 'On land, the floods take our rice and the forest takes our goats. On the water, the river is our road. Fish swim under our floors, trading boats come right to our steps, and the sea breeze keeps us cool.' },
      { who: 'berbai', text: 'We drive poles of nibong palm deep into the riverbed, and for the strongest posts, belian ironwood: it never rots in water. Then floors, walls of nipah, and walkways joining house to house.' },
      { who: 'berbai', text: 'Help us build, and Barunai will become the greatest village on the water. First, a craft quarter, so every family has a trade.' },
      { text: '✦ Chapter 3: Kampong Ayer ✦  Gather nibong poles in the hills of Barunai and belian ironwood in the deep forest, then build with Pateh Berbai.' }
    ],
    built: ['The brothers and their neighbours work from dawn to dusk: poles hammered into the mud, planks laid, roofs raised. By evening, the village has grown!'],
    fleet: [
      { text: 'One morning, the whole river goes quiet. Forty ships with red and white sails fill the river mouth. The fleet of Majapahit!' },
      { who: 'raden', text: 'Awang Alak Betatar! Barunai has grown rich, I see. Every year you send Majapahit forty ships of camphor as tribute. Today I propose a contest instead.' },
      { who: 'raden', text: 'My rooster, Asmara, against your best. If Asmara loses, I return all forty ships of goods. If Asmara wins, more of Barunai\'s land becomes Majapahit\'s.' },
      { who: 'alak', text: '...He is a king, and his fleet is at our door. We accept. My nephew Awang Senuai has a rooster who has never lost: Mutiara.' },
      { text: 'New task: help Awang Senuai train Mutiara for the great cockfight (once a day, three days).' }
    ],
    fight: [
      { text: 'A circle is drawn in the sand by the river. The whole village crowds the walkways and the boats. Asmara struts in, black and green, eating from a golden plate. Mutiara answers with a crow that shakes the leaves.' },
      { who: 'raden', text: 'Let this be a fair and equal fight. Good luck!' }
    ],
    won: [
      { text: 'Mutiara feints, leaps and beats his wings so hard the sand flies. Asmara loses his nerve, bolts out of the circle and flies out over the sea, crying, until he tumbles into the waves far out in the bay.' },
      { text: 'Where Asmara fell, the sea boils, and a great rock rises from the water: Pulau Pilong-Pilongan.' },
      { who: 'raden', text: 'Asmara! ...You! You have cost me my finest bird!' },
      { text: 'In his grief and anger, the king points at Mutiara and speaks a curse. Mutiara, chasing Asmara to the river mouth, slows... stiffens... and turns to stone on a little sandbank. Lumut Lunting.' },
      { who: 'raden', text: '...Forgive me. A king should not curse in anger. A wager is a wager: take back your forty ships of goods. Barunai is free of tribute.' },
      { who: 'alak', text: 'Thank you, Raden. Go in peace. Our rivers will always welcome yours.' },
      { text: '✦ Barunai is free! (+3000 kepeng, 3 Emas, 2 Kain Tenunan) A new perahu waits at the west jetty: row out to Teluk Barunai, the bay of the two roosters. ✦' }
    ],
    stone: 'A rooster of grey stone stands on a little sandbank at the river mouth: Mutiara, still guarding Barunai. The elders say Lumut Lunting never sinks, however high the tide. If it ever does, something terrible will happen to the kingdom.',
    stoneFeather: 'As you touch the stone rooster, a single feather of stone comes loose in your hand, as if Mutiara wants you to have it.',
    ghostHint: 'A see-through rooster, faintly glowing, stands on the rock and crows sadly towards the west, towards Java. It pecks at the bare stone, as if looking for its golden plate, and keeps glancing towards the river mouth where Mutiara stands.',
    peace: [
      { text: 'You set the golden plate on the rock, and lay Mutiara\'s stone feather beside it. The ghost of Asmara stares at them for a long time.' },
      { text: 'Then it crows: not sadly this time, but a loud, proud crow. Far away across the bay, you could swear the stone rooster of Lumut Lunting crows back.' },
      { text: 'The ghost glows gold, rises into the night sky like a spark from a fire, and is gone. Two old rivals, at peace at last.' },
      { text: '✦ Asmara\'s blessing! Its dawn crow wakes you full of energy (+15 max energy), and your hens sometimes lay an extra egg. ✦' },
      { text: '✦ Chapter 3, part 1 complete. Kampong Ayer\'s story continues soon... ✦' }
    ]
  };
  Object.assign(LC.TEXT, { kplot: 'Empty pilings over the river, waiting for a house.' });
  // a villager hidden until their part of the story (generalises Chapter 2's hiding)
  var vbase = LC.villager;
  LC.villager = function (vid) {
    var v = vbase(vid), S = LC.State.s;
    if (v && S && v.hideIf && !v.chapter2 && v.hideIf(v.craft && LC.worldS ? LC.worldS() : S)) return Object.assign({}, v, { area: 'none' });   // (v2.7.1: the craftspeople live in the shared craft quarter)
    return v;
  };
})(window.LC);
