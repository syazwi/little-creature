/* Little Creature — Chapter 3: Kampong Ayer, part 2 (v2.1). It continues straight on from part 1, on the same save.
 *  8 Awang Semaun: a jinn, Bilanapura, has risen in the bay (from the epic Syair Awang Semaun: he, Awang Jerambak and
 *    Damang Sari fought it for nine months, until Jerambak beat it with a magic fish skin taken from an ogre)
 *  9 trade with the gentle old ogre of Gunung Kabus for the magic fish skin   10 the battle on Pulau Pilong-Pilongan
 * 11 Pelita's stone lamp shows the future: 1521, Antonio (Pigafetta), a writer on the first voyage around the world,
 *    finds a city built in salt water, its houses on tall posts, its women selling food from boats: "like Venice"
 * 12 1578: a fleet from Manila under Castilian flags attacks the city (the Castilian War). Fire the brass meriam at the
 *    ships, put out the fires, row families to safety, hold the walkways; then a fever spreads in the invaders' camp
 *    and their fleet sails away   13 Chapter 3 complete.
 * No gore: soldiers tumble into the river and swim back to their ships; the jinn dissolves into sea foam. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  function addItems(map) { Object.keys(map).forEach(function (id) { var it = map[id]; it.id = id; it.icon = it.icon || 'i_' + id; LC.ITEMS[id] = it; }); }
  addItems({
    kulit_ikan: { name: 'Kulit Ikan Sakti', kind: 'treasure', desc: 'The magic fish skin from the old ogre of Gunung Kabus. Bound to a blade, it can harm a spirit of the sea.' },
    catatan_antonio: { name: 'Catatan Antonio', kind: 'treasure', desc: 'A page from Antonio\'s journal, 1521: "The city is built entirely in salt water... like Venice."' },
    lantaka: { name: 'Lantaka', kind: 'treasure', sell: 900, desc: 'A little brass cannon of Kampong Ayer, cast by the brassmiths and given to you in thanks, 1578.' }
  });

  // ================================================================ enemies of part 2
  Object.assign(LC.ENEMIES, {
    bilanapura: { name: 'Bilanapura', hp: 60, speed: 22, dmg: 10, sight: 170, w: 14, boss: true, drop: [] },
    askar: { name: 'Askar Kastila', hp: 8, speed: 26, dmg: 6, sight: 110, w: 6, drop: [] }
  });
  LC.AREAS.teluk.enemies = (LC.AREAS.teluk.enemies || []).concat([{ kind: 'bilanapura', n: 1, zone: { x0: 27, y0: 11, x1: 36, y1: 17 }, when: function (W) { return !!W.jinnOn; } }]);
  LC.JINN_HEROES = [{ vid: 'jerambak', x: 25, y: 12 }, { vid: 'semaun', x: 26, y: 15 }, { vid: 'sari', x: 24, y: 16 }];

  // ================================================================ Pelita's stone lamp by the Balai (it shows the future)
  LC.AREAS.barunai.objects.push({ id: 'b_pelita', type: 'vision', x: 24, y: 7, tex: 'pelita_batu', when: function (S) { var c = S.quests.ch3 || 0; return c === 11 || c === 12; } });

  // ================================================================ Kampong Ayer in its great years (1521, 1578)
  var HOUSE_X = [1, 4, 10, 13, 16, 19, 26, 29, 32, 35, 42], HOUSE_Y = [10, 17, 24];
  function buildKayer() {
    var W = 48, H = 34, g = [], x, y;
    for (y = 0; y < H; y++) { g.push([]); for (x = 0; x < W; x++) g[y].push('.'); }
    function fill(x0, y0, x1, y1, ch) { for (var yy = y0; yy <= y1; yy++) for (var xx = x0; xx <= x1; xx++) g[yy][xx] = ch; }
    function ell(cx, cy, rx, ry, ch) { for (var yy = 0; yy < H; yy++) for (var xx = 0; xx < W; xx++) { var dx = (xx - cx) / rx, dy = (yy - cy) / ry; if (dx * dx + dy * dy <= 1) g[yy][xx] = ch; } }
    fill(0, 0, W - 1, 1, 'J'); fill(0, 0, 1, 6, 'J'); fill(W - 2, 0, W - 1, 6, 'J');
    ell(7, 4, 4, 2, 'g'); ell(40, 4, 4, 2, 'g');
    fill(24, 5, 24, 6, 'p');                                   // the path up to the great hall
    fill(0, 7, W - 1, 7, 's'); fill(0, 8, W - 1, 8, 'S'); fill(0, 9, W - 1, H - 1, 'w');
    fill(1, 12, W - 2, 12, 'j'); fill(1, 19, W - 2, 19, 'j'); fill(1, 26, W - 2, 27, 'j');   // walkways across the river
    [8, 24, 40].forEach(function (xx) { fill(xx, 7, xx, 26, 'j'); });                         // and down from the shore
    return g;
  }
  var HOUSE_TEX = ['rumah_air', 'rumah_air2', 'rumah_air3'];
  var HOUSE_TXT = ['A house on tall posts over the salt water. A family is eating on the veranda.', 'Washing flaps between two houses. A boat is tied at the steps.', 'A house of wood and nipah. Someone inside is playing a gambus.',
    'A brassmith\'s house: kendi jugs shine on the steps.', 'Children dive from the walkway, shrieking with laughter.'];
  var K_OBJ = [
    { id: 'k_balai', type: 'tour', stop: 2, x: 22, y: 2, w: 5, h: 3, tex: 'balai', keep: true, text: 'The great hall of Kampong Ayer, on the hill above the water city.' },
    { id: 'k_back', type: 'vision_back', x: 23, y: 6, tex: 'pelita_batu' },
    { id: 'k_race', type: 'perahu_race', x: 6, y: 28, tex: 'perahu_race_dock', keep: true, when: function (S) { return (S.quests.ch3 || 0) === 11; } },
    { id: 'k_pasar', type: 'tour', stop: 0, x: 30, y: 13, w: 2, h: 1, tex: 'padian_0', when: function (S) { return (S.quests.ch3 || 0) === 11; }, text: 'A padian boat piled with fish and fruit.' },
    { id: 'k_pasar2', type: 'bldg', x: 34, y: 20, w: 2, h: 1, tex: 'padian_1', when: function (S) { return (S.quests.ch3 || 0) === 11; }, text: 'Another padian, selling rice and betel leaves from house to house.' },
    { id: 'k_gajah1', type: 'bldg', x: 13, y: 4, w: 2, h: 2, tex: 'gajah', when: function (S) { return (S.quests.ch3 || 0) === 11; }, text: 'An elephant dressed in red and gold silk, waiting to carry the visitors up to the great hall.' },
    { id: 'k_gajah2', type: 'bldg', x: 33, y: 4, w: 2, h: 2, tex: 'gajah', when: function (S) { return (S.quests.ch3 || 0) === 11; }, text: 'Another silk-draped elephant. It flaps its ears at you, politely.' },
    { id: 'k_kapal', type: 'bldg', x: 40, y: 30, w: 5, h: 4, tex: 'kapal_layar', when: function (S) { return (S.quests.ch3 || 0) === 11; }, text: 'A battered foreign ship, two years out from home on a voyage around the whole world.' }
  ];
  HOUSE_Y.forEach(function (y, r) {
    HOUSE_X.forEach(function (x, i) {
      if (y === 17 && x === 13) { K_OBJ.push({ id: 'k_tembaga', type: 'tour', stop: 1, x: x, y: y, w: 3, h: 2, tex: 'bengkel_tembaga', text: 'The brassmiths\' workshop: gongs, kendi jugs and little cannons, all cast right here.' }); return; }
      K_OBJ.push({ id: 'kh_' + y + '_' + x, type: 'bldg', x: x, y: y, w: 3, h: 2, tex: HOUSE_TEX[(i + r) % 3], text: HOUSE_TXT[(i * 2 + r) % HOUSE_TXT.length] });
    });
  });
  LC.WAR = {
    cannons: [{ x: 7, y: 27 }, { x: 23, y: 27 }, { x: 39, y: 27 }],
    fires: ['kh_10_4', 'kh_10_29', 'kh_17_19', 'kh_17_35', 'kh_24_10', 'kh_24_42'],
    families: [{ x: 1, y: 12 }, { x: 46, y: 19 }, { x: 1, y: 27 }],
    soldiers: 6,
    goals: [null, 'Fire the meriam on the bottom walkway at the three warships (two hits each).', 'Put out the fires! Fill your gembor from the river, then douse each burning roof.',
      'Row the three families at the far ends of the walkways to safety.', 'Hold the walkways: knock the soldiers into the river (6).']
  };
  LC.WAR.cannons.forEach(function (c, i) { K_OBJ.push({ id: 'k_meriam' + i, type: 'meriam', i: i, x: c.x, y: c.y, tex: 'meriam', when: function (S) { return (S.quests.ch3 || 0) === 12; } }); });
  LC.AREAS.kayer = {
    name: 'Kampong Ayer', sub: 'the water city', lvl: 20, build: buildKayer, objects: K_OBJ,
    pond: 'river', amb: 'river', decor: { n: 24, types: ['bush', 'hibiscus', 'lalang', 'rock', 'bougainvillea'], on: '.' },
    critters: [{ kind: 'chicken', n: 2, zone: { x0: 4, y0: 3, x1: 44, y1: 6 } }],
    exits: [], home: { x: 24, y: 6 }, ride: {},
    enemies: [{ kind: 'askar', n: LC.WAR.soldiers, zone: { x0: 1, y0: 12, x1: 46, y1: 27 }, when: function (W) { return !!(W.war && W.war.wave === 4); } }]
  };
  LC.TOUR = [
    { name: 'the floating market', lines: [{ who: 'antonio', text: 'Women selling fish, rice and fruit from their boats, from house to house, when the tide is high! In my country, we must walk to the market. Here, the market rows to you.' }] },
    { name: 'the brassmiths', lines: [{ who: 'antonio', text: 'Gongs, kendi jugs, even cannons, all cast in brass, right here over the water. These smiths are as fine as any in Europe.' }] },
    { name: 'the great hall', lines: [{ who: 'antonio', text: 'From up here you can see it all: thousands of roofs on the water, and walkways like threads between them. I must count them for my journal.' }] }
  ];

  // ================================================================ new faces
  var GIFTS = { 3: ['kepeng', 250], 6: ['kain_tenun', 1], 10: ['kepeng', 900] };
  function look(shirt, hat, extra) { return Object.assign({ skin: '#a8714a', shirt: shirt, shirt2: shirt, bottom: '#5a4a3a', bottom2: '#40342a', hair: '#1a1210', hat: hat }, extra || {}); }
  function ch3(S) { return S.quests.ch3 || 0; }
  Object.assign(LC.VILLAGERS, {
    jerambak: {
      name: 'Awang Jerambak', role: 'A warrior, Awang Semaun\'s closest companion', area: 'barunai', post: { x: 28, y: 13 }, look: look('#4a3a6a', 'tanjak_red', { skin: '#9a6440', beard: '#2a1a10' }),
      intro: ['I am Awang Jerambak. Semaun and I have fought side by side since we were boys. He is stronger. I am cleverer. We agree on neither.'],
      chat: ['A blade is only as brave as the hand that holds it.', 'Semaun snores like a tembadau.', 'Even a jinn has a weakness. Everything does.'],
      tasks: [['ikan_bakar', 1, 2], ['nasi', 1, 2], ['kelapa', 1, 2]], taskText: 'for the night watch', gifts: GIFTS,
      hideIf: function (S) { return ch3(S) < 8; }
    },
    gergasi: {
      name: 'Tok Gergasi', role: 'A gentle old ogre of Gunung Kabus', area: 'mountain', post: { x: 4, y: 8 }, look: look('#5a4a32', 'leaf', { skin: '#7f9a6a', hair: '#3a3a28', beard: '#4a4a30', bottom: '#3a3020', bottom2: '#2a2218' }),
      intro: ['Hmm? A little person, and you are not running away? How nice. I am Tok Gergasi. People think ogres eat people. I eat fish. And coconuts. And ambuyat, if anyone ever brings me some.',
        'The magic fish skin? Yes, yes. I caught that fish when I was young and the mountains were smaller. I keep the skin under my bed. I suppose a hungry ogre could part with it... for a good meal.'],
      chat: ['I am big, so people shout at me. I am not deaf. Just big.', 'The mist up here is my blanket.', 'Fish, coconuts, a nap. A good life.'],
      tasks: [['kelapa', 2, 3], ['ikan_bakar', 1, 2]], taskText: 'for a big appetite', gifts: GIFTS,
      hideIf: function (S) { return ch3(S) < 8; }
    },
    antonio: {
      name: 'Antonio', role: 'A writer on a voyage around the world (1521)', area: 'kayer', post: { x: 42, y: 27 }, look: look('#3a3a4a', 'none', { skin: '#e0b090', hair: '#5a3a1e', beard: '#5a3a1e', bottom: '#2a2a3a', bottom2: '#1e1e2a' }),
      intro: ['Buongiorno! Ah, forgive me: selamat pagi! I am Antonio, from Vicenza, near Venice. I write the journal of a great voyage around the world.',
        'Our ships have been at sea for two years, and I have never seen a city like this one. Will you show me around? I want to write it all down.'],
      chat: ['My ink is running out. I write very small now.', 'Elephants! Dressed in silk! No one at home will believe me.', 'Your city floats like a dream.'],
      tasks: [['kelapa', 1, 2]], taskText: 'for the long voyage', gifts: GIFTS,
      hideIf: function (S) { return ch3(S) !== 11; }
    },
    damit: {
      name: 'Pak Damit', role: 'The cannon master of Kampong Ayer (1578)', area: 'kayer', post: { x: 26, y: 7 }, look: look('#7a3a1e', 'tanjak_red', { skin: '#9a6440', beard: '#d8d4cc' }),
      intro: ['No time for introductions! I am Damit, master of the meriam. Help us, and the city will remember you.'],
      chat: ['Brass does not burn. Remember that.', 'Hold the walkways, and we hold the city.', 'My grandfather\'s grandfather cast this cannon.'],
      tasks: [['nasi', 1, 2]], taskText: 'for the defenders', gifts: GIFTS,
      hideIf: function (S) { return ch3(S) !== 12; }
    }
  });

  // ================================================================ the story, in their words
  LC.CH3TEXT2 = {
    jinn: [
      { who: 'semaun', text: 'Friend, something is wrong in the bay. Storms out of a clear sky, whirlpools, fishing boats pulled under. The fishermen say a jinn has risen near Pulau Pilong-Pilongan. Its name is Bilanapura.' },
      { who: 'semaun', text: 'Awang Jerambak, Damang Sari and I have fought it for nine months! But nothing touches it. Our blades pass through it like smoke.' },
      { who: 'jerambak', text: 'My grandmother told of an old ogre who lives by the cliffs of Gunung Kabus. Long ago he caught a magic fish, and its skin can bind any spirit of the sea. But who would go and visit an ogre?' },
      { text: 'New task: find the old ogre by the cliffs of Gunung Kabus, and ask him for the magic fish skin.' }
    ],
    skin: 'Tok Gergasi pulls a long, shimmering fish skin out from under his bed (and a lot of dust). "Here. Mind the dust. And come back with more ambuyat one day!"',
    jinnStart: [
      { who: 'jerambak', text: 'You brought it! I will bind the fish skin around your blade. Now Bilanapura can be hurt. Ready?' },
      { text: 'The sea in the bay begins to boil. A towering shape of foam and storm cloud rises over the island: Bilanapura!' }
    ],
    jinnWon: [
      { text: 'Bilanapura howls like a gale, shrinks into a whirl of sea foam... and is gone. The clouds part, and the bay is calm again.' },
      { who: 'semaun', text: 'Nine months of fighting, and today, with a friend and a fish skin, it is over! Barunai\'s boats can sail safely again.' },
      { who: 'jerambak', text: 'Take this armband. It belonged to my father. May it keep you as safe as you kept us.' },
      { text: '✦ The bay is safe! Gelang Jerambak: +20 max health. (+2000 kepeng) ✦' }
    ],
    lampHint: 'Pelita has been glowing strangely ever since the jinn was beaten. Look: an old stone lamp by the Balai has lit up by itself.',
    vision1521: [
      { text: 'Pelita\'s light pours into the old stone lamp, and the river shimmers. The years flow past like water: houses multiply, walkways stretch across the river, boats crowd the bay...' },
      { text: 'It is the year 1521. Barunai has grown into a great city on the water. A foreign ship has just arrived, and a curious man is climbing onto the walkway with a notebook.' }
    ],
    venice: [
      { who: 'antonio', text: 'I have counted, and asked, and counted again. Twenty-five thousand households! And every house stands on tall wooden posts in the salt water.' },
      { who: 'antonio', text: 'When the tide is high, the women go through the city in boats, selling everything one needs to eat. I shall write that this city is like Venice.' },
      { text: 'Antonio\'s words travel around the world with his ship. From then on, Kampong Ayer is known as "the Venice of the East".' },
      { text: '✦ Antonio gives you a page of his journal. (+1500 kepeng, Catatan Antonio) ✦' }
    ],
    vision1578: [
      { text: 'Pelita\'s light flickers again, more urgently this time. The years flow past... fifty-seven years later.' },
      { text: 'It is 1578. Smoke hangs over the water. A fleet from Manila, flying Castilian flags, has sailed up the river to take the city.' }
    ],
    warIntro: [
      { text: 'Warships crowd the river below the bottom walkway. Families run along the walkways, and somewhere a gong is beating the alarm.' },
      { who: 'damit', text: 'You came with the little light? Good: we need every pair of hands. First, the meriam, our brass cannons on the bottom walkway. Drive those ships back!' }
    ],
    waves: [null, null,
      { who: 'damit', text: 'The ships are pulling back! But burning arrows have caught the roofs. Fill your gembor from the river and put the fires out before they spread!' },
      { who: 'damit', text: 'The fires are out. Now the families trapped at the far ends of the walkways: row them to safety on the hill!' },
      { who: 'damit', text: 'Soldiers on the walkways! Hold them back. Knock them into the river: they can swim home.' }
    ],
    warEnd: [
      { text: 'The walkways hold. Days pass, and a fever spreads through the invaders\' camp. Within weeks, their fleet sails away down the river, and does not come back.' },
      { who: 'damit', text: 'A burnt roof can be thatched again. A broken walkway can be mended. As long as the people come home, Kampong Ayer comes back.' },
      { text: 'House by house, family by family, the water city is rebuilt. It still stands on the river today, more than six hundred years after the brothers first came.' },
      { text: '✦ Chapter 3: Kampong Ayer, complete! (+5000 kepeng, and a Lantaka, a little brass cannon, from Pak Damit) ✦' }
    ],
    fade: 'Pelita\'s light fades, and you are back by the Balai in Barunai, in your own time.'
  };
  // part 1's last line now points to part 2
  LC.CH3TEXT.peace[LC.CH3TEXT.peace.length - 1] = { text: '✦ Chapter 3, part 1 complete! The story goes on: Awang Semaun has news from the bay. ✦' };
})(window.LC);
