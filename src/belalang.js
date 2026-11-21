/* Little Creature — Chapter 10: Nujum Pak Belalang (v3.0). It begins the day after Chapter 9, on the same save.
 * Based on the Malay folk tale of Pak Belalang: a lazy father and his clever son Belalang. The boy finds lost things
 * (a buffalo the thieves hid), the father "divines" them like a nujum (a fortune teller), word reaches the king, the
 * king sets harder tests (stolen treasure, riddles from a foreign king's seer), and the son overhears the answers.
 * In one old telling, Pak Belalang ends it by saying his powers were used up. This game keeps only the folk tale (not
 * the 1959 film), with its own kingdom, Sultan and words. The user's twist: Pelita suddenly disappears, because it
 * followed Belalang home and loves him. The lesson is honesty, and that a friend who loves you can let you go home.
 *  0 (the day after Chapter 9) Pelita is gone, and a grasshopper glowing with Pelita's gold sits on the spirit house
 *  1 follow the glowing grasshoppers across the farm to the jetty: a grasshopper woven from coconut leaf (Tanjung Bunga)
 *  2 sail on the jong to Negeri Tanjung Bunga: Pelita and a boy are playing hide-and-seek. Find them (three places)
 *  3 Belalang's chores: three buckets from the town well into the tempayan, 3 kayu and 2 kelapa. His secret: he finds
 *    the lost things, his father takes the credit. Then the palace drum: the royal heirloom chest is stolen
 *  4 the Sultan gives Pak Belalang until Ahad (7 days; late is forgiven, but the bonus is lost). Take Belalang and
 *    Pelita into Hutan Merbau: the thieves' footprints show only in Pelita's light. Beat the Kerengga gang at their camp
 *  5 carry the Peti Pusaka Diraja back to the Sultan; a ship from Negeri Antah Berantah challenges with riddles
 *  6 after dark, hide in the sampan under the foreign ship and overhear the answers; then the riddle contest (buttons)
 *  7 help Pak Belalang tell the truth. The Sultan laughs, and rewards honesty. Pelita says goodbye to Belalang, and
 *    comes home   8 complete
 * Pelita is away from the moment it vanishes until it comes home (its needs wait for it, untouched).
 * Reward: Belalang's Sumpit (a blowpipe, the first weapon that shoots from far away), 15,000 kepeng (+5,000 on time),
 * Batu Delima, and three new friends. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  function addItems(map) { Object.keys(map).forEach(function (id) { var it = map[id]; it.id = id; it.icon = it.icon || 'i_' + id; LC.ITEMS[id] = it; }); }
  addItems({
    belalang_anyam: { name: 'Belalang Anyaman', kind: 'treasure', desc: 'A little grasshopper woven from strips of coconut leaf, the way the children of Tanjung Bunga make them. It is dusted with Pelita\'s gold.' },
    peti_diraja: { name: 'Peti Pusaka Diraja', kind: 'treasure', desc: 'The royal heirloom chest of Tanjung Bunga: carved, gilded, and heavy. Something inside rattles. (Slippers, probably.)' },
    sumpit: { name: 'Sumpit', kind: 'weapon', ranged: true, dmg: 3, reach: 16, range: 168, speed: 300, cd: 0.62, desc: 'Belalang\'s blowpipe, made by his grandfather from a straight length of bamboo. Hold it and press USE to shoot a dart at whatever is in front of you, far away.' }
  });
  ['belalang_anyam', 'peti_diraja', 'sumpit'].forEach(function (id) { LC.FIXED_ITEMS[id] = 1; });

  function q(S) { return (S && S.quests) || {}; }
  function c10(S) { return q(S).ch10 || 0; }
  LC.ch10Step = function () { return c10(LC.State.s); };
  // Pelita is with Belalang from the moment it vanishes until it comes home (never for a co-op guest: theirs is the host's)
  LC.pelitaAway = function () { var S = LC.State.s, st = c10(S); return !!S && !S.guest && st >= 1 && st <= 7; };

  var T = 16;
  LC.C10 = {
    hookFrom: 6 * 60, hookTo: 20 * 60,                                  // the morning after Chapter 9 (any time the farm is awake)
    hops: [[10.5, 5.7], [15.5, 11.6], [20.5, 13.6], [21.5, 20.6], [20.5, 26.8]],   // the glowing grasshopper on the farm: the spirit house roof, then on to the jetty
    hopNear: 30,
    seek: [[20.6, 18.6], [46.5, 12.6], [30.6, 10.6]],                   // Tanjung Bunga: hide-and-seek (behind the well, by a house, the palace yard)
    seekNear: 32,
    water: 3, give: { kayu: 3, kelapa: 2 },
    days: 7,                                                            // until Ahad
    trail: [[46, 16.5], [43, 17.5], [40, 19.5], [37, 21.5], [34, 22.5], [31, 21.5], [28, 19.5], [26.2, 16.5], [23, 15.5], [20, 15.5], [18, 13.5], [16, 11.5], [13.5, 10.5]],
    printR: 70,                                                         // how far Pelita's light reaches on the forest floor
    gang: 5,                                                            // the Kerengga gang: four thieves and Si Kerengga
    camp: { x: 15.5, y: 10 },
    night: 19 * 60, dawn: 5 * 60,                                       // the sailors rehearse after dark
    reward: 15000, onTime: 5000, chestGift: 3000
  };

  // ================================================================ Negeri Tanjung Bunga (the town, the palace, the harbour)
  function grid(W, H, ch) { var g = []; for (var y = 0; y < H; y++) { g.push([]); for (var x = 0; x < W; x++) g[y].push(ch); } return g; }
  function fill(g, x0, y0, x1, y1, ch) { for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) if (g[y] && x >= 0 && x < g[0].length) g[y][x] = ch; }
  function ell(g, cx, cy, rx, ry, ch) { for (var y = 0; y < g.length; y++) for (var x = 0; x < g[0].length; x++) { var dx = (x - cx) / rx, dy = (y - cy) / ry; if (dx * dx + dy * dy <= 1) g[y][x] = ch; } }
  function buildTanjung() {
    var W = 56, H = 40, g = grid(W, H, '.');
    fill(g, 0, 0, W - 1, 1, 'J'); fill(g, 0, 0, 1, 29, 'J'); fill(g, W - 2, 0, W - 1, 29, 'J');
    fill(g, 0, 13, 1, 14, 'p');                            // the road west, into Hutan Merbau
    fill(g, 2, 13, W - 3, 14, 'p');                        // the town road
    fill(g, 18, 2, 37, 11, 'k');                           // the palace yard
    fill(g, 27, 12, 28, 12, 'k');
    fill(g, 27, 15, 28, 29, 'p');                          // down to the harbour
    fill(g, 0, 30, W - 1, 31, 's'); fill(g, 0, 32, W - 1, H - 1, 'o');
    fill(g, 27, 30, 28, H - 2, 'j');                       // the jetty
    return g;
  }
  var TJ_OBJ = [
    { id: 'tj_istana', type: 'bldg', x: 22, y: 3, w: 12, h: 4, tex: 'istana10', keep: true, text: 'The Istana of Tanjung Bunga: a palace of carved chengal wood on tall posts, its roofs folded one above another like hands at prayer. The great drum hangs by the steps.' },
    { id: 'tj_lampu1', type: 'bldg', x: 23, y: 9, tex: 'pelita9', light: 0xffc070, text: 'A tall brass lamp by the palace steps.' },
    { id: 'tj_lampu2', type: 'bldg', x: 32, y: 9, tex: 'pelita9', light: 0xffc070, text: 'A tall brass lamp by the palace steps.' },
    { id: 'tj_pondok', type: 'bldg', x: 5, y: 7, w: 4, h: 3, tex: 'pondok10', keep: true, text: 'Pak Belalang\'s hut. The atap roof has holes in it, the steps are tied together with rattan, and there is a large rice pot by the door. Belalang has swept the yard very neatly.' },
    { id: 'tj_tempayan', type: 'tempayan10', x: 9, y: 9, tex: 'tempayan10' },
    { id: 'tj_kelapa', type: 'bldg', x: 11, y: 9, tex: 'palm', text: 'Pak Belalang\'s coconut palm. There is a dent in the grass under it, exactly the shape of Pak Belalang.' },
    { id: 'tj_rumah1', type: 'bldg', x: 14, y: 8, w: 4, h: 3, tex: 'rumah9', keep: true, text: 'Mak Jah\'s house. A goat is tied to the steps, chewing a flower. (It was lost last week. Belalang found it.)' },
    { id: 'tj_rumah2', type: 'bldg', x: 40, y: 8, w: 4, h: 3, tex: 'rumah9b', keep: true, text: 'A house of carved wood. A row of woven grasshoppers hangs drying from the window.' },
    { id: 'tj_rumah3', type: 'bldg', x: 46, y: 8, w: 4, h: 3, tex: 'rumah9', keep: true, text: 'The Penghulu\'s house. Someone inside is practising the gendang, badly.' },
    { id: 'tj_rumah4', type: 'bldg', x: 8, y: 18, w: 4, h: 3, tex: 'rumah9b', keep: true, text: 'A house with a garden of bunga tanjung trees. The little star-shaped flowers smell sweet all the way down the road.' },
    { id: 'tj_rumah5', type: 'bldg', x: 40, y: 18, w: 4, h: 3, tex: 'rumah9', keep: true, text: 'A fisherman\'s house, with nets hanging from the posts.' },
    { id: 'tj_perigi', type: 'perigi10', x: 19, y: 17, tex: 'well' },
    { id: 'tj_para', type: 'bldg', x: 33, y: 18, w: 3, h: 1, tex: 'para9', text: 'A rack of salted fish drying in the sun. Tanjung Bunga\'s ikan masin is famous all along the coast.' },
    { id: 'tj_sign', type: 'signpost', x: 3, y: 12, tex: 'sign', text: 'NEGERI TANJUNG BUNGA.  West: Hutan Merbau.  (Underneath, in a child\'s writing: LOST SOMETHING? ASK NUJUM PAK BELALANG!)' },
    { id: 'tj_jong', type: 'jong5', x: 29, y: 34, w: 5, h: 3, tex: 'jong_majapahit' },
    // the ship from Negeri Antah Berantah, and the little sampan tied up under it
    { id: 'tj_kapal', type: 'bldg', x: 18, y: 33, w: 7, h: 3, tex: 'kapal10', keep: true, when: function (S) { var s = c10(S); return s === 6 || s === 7; }, text: 'The ship from Negeri Antah Berantah: tall, with black and red sails and a carved hornbill at the bow. Sailors in striped sarongs are polishing everything.' },
    { id: 'tj_sampan', type: 'sampan10', x: 25, y: 34, w: 2, h: 1, tex: 'sampan10', keep: true, when: function (S) { var s = c10(S); return s === 6 || s === 7; } },
    // v3.0.1: Nek Lampir, come for a reading (once the town calls Pak Belalang a great nujum; also after the chapter)
    { id: 'tj_nek', type: 'nek10', x: 14, y: 11, tex: 'npc_lampir_0', keep: true, when: function (S) { return c10(S) >= 5 && !q(S).c10nek && (q(S).ch6 || 0) >= 7; } }
  ];
  [[4, 26], [15, 27], [36, 26], [48, 27], [20, 22], [44, 23], [52, 16], [38, 16]].forEach(function (t, i) { TJ_OBJ.push({ id: 'tj_palm' + i, type: 'bldg', x: t[0], y: t[1], tex: 'palm', text: 'A coconut palm, leaning towards the sea. The children of Tanjung Bunga weave grasshoppers from its leaves.' }); });
  LC.AREAS.tanjung = {
    name: 'Negeri Tanjung Bunga', sub: 'a little kingdom of flowers by the sea', lvl: 20, build: buildTanjung, objects: TJ_OBJ,
    pond: 'sea', amb: 'beach', decor: { n: 40, types: ['hibiscus', 'bush', 'lalang', 'bougainvillea', 'hibiscus'], on: '.' },
    critters: [{ kind: 'ketam', n: 2, zone: { x0: 4, y0: 30, x1: 50, y1: 31 } }],
    clear: [{ x: 8, y: 11, r: 2 }, { x: 12, y: 11, r: 2 }, { x: 26, y: 10, r: 2 }, { x: 20, y: 18, r: 2 }, { x: 46, y: 12, r: 2 }, { x: 10, y: 10, r: 2 }],
    exits: [{ x0: 0, y0: 13, x1: 0, y1: 14, to: 'merbau', sx: 47.5, sy: 16.5, dir: 'left' }],
    home: { x: 27.5, y: 29.5 }, ride: {}
  };

  // ================================================================ Hutan Merbau (the dark forest, and the thieves' camp)
  function buildMerbau() {
    var W = 50, H = 34, g = grid(W, H, 'g');
    fill(g, 0, 0, W - 1, 1, 'J'); fill(g, 0, H - 2, W - 1, H - 1, 'J'); fill(g, 0, 0, 1, H - 1, 'J'); fill(g, W - 2, 0, W - 1, H - 1, 'J');
    fill(g, W - 2, 15, W - 1, 17, 'g');                    // the way back east, to the town
    fill(g, 24, 2, 25, H - 3, 'w');                        // a black stream
    fill(g, 24, 15, 25, 16, 'W');                          // an old log bridge
    fill(g, 24, 27, 25, 27, 'W');
    ell(g, 9, 9, 6.5, 4.6, 'p');                           // the thieves' clearing
    return g;
  }
  var M_OBJ = [
    { id: 'mb_sign', type: 'signpost', x: 46, y: 14, tex: 'sign', text: 'HUTAN MERBAU.  (Scratched into the post: KERENGGA WAS HERE. And under it, in a child\'s writing: NO HE WASN\'T.)' },
    { id: 'mb_bangsal', type: 'bldg', x: 4, y: 5, w: 4, h: 2, tex: 'bangsal10', keep: true, text: 'The thieves\' lean-to: a roof of nipah leaves on four crooked poles. Inside, five mats, a pot of cold rice, and a great many stolen slippers.' },
    { id: 'mb_unggun', type: 'bldg', x: 10, y: 8, tex: 'unggun10', light: 0xff9040, text: 'The thieves\' campfire.' },
    { id: 'mb_peti', type: 'peti10', x: 6, y: 9, w: 2, h: 1, tex: 'peti_diraja10', keep: true, light: 0xffd070, when: function (S) { return c10(S) === 4 && !!q(S).c10won; } },
    { id: 'mb_jejak0', type: 'jejak10', i: 0, x: 39, y: 18, tex: 'kain10' },
    { id: 'mb_jejak1', type: 'jejak10', i: 1, x: 29, y: 22, tex: 'syiling10' },
    { id: 'mb_jejak2', type: 'jejak10', i: 2, x: 19, y: 12, tex: 'obor10' }
  ];
  LC.AREAS.merbau = {
    name: 'Hutan Merbau', sub: 'the dark forest west of Tanjung Bunga', lvl: 20, build: buildMerbau, objects: M_OBJ,
    pond: 'stream', amb: 'forest', dim: true, decor: { n: 60, types: ['fern', 'fern', 'bush', 'rock', 'fern', 'lalang'], on: 'g' },
    trees: { n: 78, on: 'g', tex: ['jtree', 'jtree2', 'jtree'], text: 'A giant merbau tree. Its trunk is as wide as a house, and its roots wander off in every direction.' },
    // (whole tiles only: the tree scatter marks clear ground tile by tile)
    clear: [{ x: 9, y: 9, r: 7 }, { x: 46, y: 16, r: 3 }, { x: 24, y: 15, r: 3 }, { x: 24, y: 27, r: 2 }].concat(LC.C10.trail.map(function (t) { return { x: Math.round(t[0]), y: Math.round(t[1]), r: 2 }; })),
    enemies: [
      { kind: 'pencuri10', n: 4, zone: { x0: 4, y0: 7, x1: 15, y1: 13 }, when: function (W) { return c10(W.S) === 4 && !q(W.S).c10won; } },
      { kind: 'ketua10', n: 1, zone: { x0: 7, y0: 8, x1: 12, y1: 11 }, when: function (W) { return c10(W.S) === 4 && !q(W.S).c10won; } }
    ],
    exits: [{ x0: 49, y0: 15, x1: 49, y1: 17, to: 'tanjung', sx: 2.5, sy: 13.9, dir: 'right' }],
    home: { x: 47.5, y: 16.5 }, ride: {}
  };
  LC.AREA_HOWTO.tanjung = 'Sail on the jong from Nenek\'s jetty (Chapter 10).';
  LC.AREA_HOWTO.merbau = 'Walk west from Negeri Tanjung Bunga (Chapter 10).';

  // the Kerengga gang: thieves in black, with masks of black cloth and sticks (no gore: they drop their sticks and run)
  Object.assign(LC.ENEMIES, {
    pencuri10: { name: 'Kerengga thief', hp: 12, speed: 34, dmg: 7, sight: 135, w: 6, drop: [['kepeng', 0.8, 30, 80]] },
    ketua10: { name: 'Si Kerengga', hp: 46, speed: 30, dmg: 10, sight: 170, w: 8, charge: true, drop: [] }
  });

  // v3.0.1: the stray cat that followed Nek Lampir home from Tanjung Bunga, by her herbs on Gunung Ledang
  LC.AREAS.ledang.objects.push({ id: 'ld_kucing10', type: 'kucing10', x: 7, y: 31, tex: 'kucing10', when: function (S) { return !!q(S).c10nek; } });

  // on the farm: the glowing grasshoppers, and the woven one at the end of the jetty
  LC.OBJECTS.push({ id: 'f_anyam10', type: 'anyam10', x: 21, y: 29, tex: 'anyam10', keep: true, when: function (S) { return c10(S) === 1 && (q(S).c10hop || 0) >= LC.C10.hops.length; } });

  // ================================================================ the people of Tanjung Bunga
  function look(shirt, hat, extra) { return Object.assign({ skin: '#a8714a', shirt: shirt, shirt2: shirt, bottom: '#5a4a3a', bottom2: '#40342a', hair: '#1a1210', hat: hat }, extra || {}); }
  Object.assign(LC.VILLAGERS, {
    belalang: {
      name: 'Belalang', role: 'A clever boy of Tanjung Bunga', area: 'tanjung', post: { x: 8, y: 11 }, sprite: true,
      intro: ['Hello! I\'m Belalang. Like the grasshopper! Because I\'m small, and I jump, and I\'m everywhere.', 'Did you lose something? I can find it. I find everything. (Don\'t tell anyone. Father is supposed to be the one who finds things.)'],
      chat: ['If you lose something, think about where you were happy last. That\'s usually where it is.', 'I wove forty grasshoppers yesterday. Then the goat ate eleven.', 'Father says work is bad for his back. I think lying down is bad for his back.', 'When I grow up I want to be a real nujum. One who looks at REAL things. Like footprints.'],
      tasks: [['kuih_pandan', 1, 2], ['pisang_goreng', 1, 2], ['kelapa', 2, 3]], taskText: 'for the clever boy', gifts: { 3: ['kepeng', 600], 6: ['kelapa', 4], 10: ['kepeng', 2000] },
      hideIf: function (S) { return c10(S) < 3 || (c10(S) === 4 && !!q(S).c10with); }
    },
    pak_belalang: {
      name: 'Pak Belalang', role: 'The famous fortune teller (or so they say)', area: 'tanjung', post: { x: 12, y: 11 },
      look: look('#e8e2d0', 'kopiah', { skin: '#9a6440', shirt2: '#c8c0a8', bottom: '#3a4a7a', bottom2: '#2a3458', beard: '#8a8478', hair: '#8a8478' }),
      intro: ['Mmm? A visitor? Do not tell me why you have come. I... already know. (He clearly does not know.)', 'I am Pak Belalang, the famous nujum of Tanjung Bunga. Do not wake me unless it is very important. Or lunch.'],
      chat: ['The clouds tell me... that it is a good day for a nap. The clouds are very wise.', 'Work? I worked once. I did not care for it.', 'My Belalang is a good boy. Too clever. He gets it from his mother. Also the hard work.', 'Shhh. I am reading the stars. ...Yes, it is daytime. That makes it harder.'],
      tasks: [['nasi_lemak', 1, 2], ['pisang', 3, 5], ['kelapa', 2, 3]], taskText: 'for the lazy fortune teller', gifts: { 3: ['kepeng', 500], 6: ['kepeng', 1200], 10: ['delima', 1] }
    },
    sultan_muzaffar: {
      name: 'Sultan Muzaffar', role: 'The Sultan of Tanjung Bunga', area: 'tanjung', post: { x: 25, y: 9 },
      look: look('#e9c46a', 'tanjak_gold', { skin: '#a8714a', shirt2: '#c4922f', bottom: '#7a1e1a', bottom2: '#5a1414', beard: '#2a1a10' }),
      intro: ['Welcome, welcome, traveller! Welcome to Tanjung Bunga, the sweetest-smelling kingdom on the whole coast!', 'I am Sultan Muzaffar. You may bow. Or not! I am not fussy. Do you like riddles? I LOVE riddles.'],
      chat: ['Why did the chicken cross the road? To visit the palace, of course! Ha! I made that up myself.', 'My grandfather planted the first bunga tanjung tree in this town. Now there are hundreds. He would be so pleased.', 'A king must listen, my grandmother said. Mostly to people who disagree with him. She disagreed with me a great deal.', 'Mangoes! Mangoes are the finest fruit. I will hear no argument. ...Unless it is a good argument.'],
      tasks: [['mangga', 2, 3], ['pulut_mangga', 1, 1], ['kuih_pandan', 1, 2]], taskText: 'for the palace kitchen', gifts: { 3: ['kepeng', 1500], 6: ['delima', 1], 10: ['kepeng', 5000] }
    }
  });
  LC.SPEAKERS = Object.assign(LC.SPEAKERS || {}, {
    bentara: { name: 'The royal herald', portrait: 'npc10_bentara' },
    jambul: { name: 'Tok Nujum Jambul', portrait: 'npc10_jambul' },
    nakhoda: { name: 'Nakhoda Gagah', portrait: 'npc10_nakhoda' },
    kerengga: { name: 'Si Kerengga', portrait: 'ketua10_0' }
  });

  // ================================================================ the story, in their words
  LC.CH10TEXT = {
    hook: [
      { text: 'You turn round to say something to Pelita... and Pelita is not there.' },
      { text: 'Not by your shoulder. Not in the spirit house. Not curled up in Nenek\'s lamp. The little light is just... gone.' },
      { who: 'nenek', text: 'Cucu? Why do you look like that? ...Where is Pelita?' },
      { text: 'On the roof of the spirit house sits a grasshopper: a small green belalang, glowing faintly gold, the same gold as Pelita\'s light. It looks at you. Then it hops away.' },
      { who: 'nenek', text: 'A belalang, glowing like that? It has been rubbing shoulders with Pelita! Follow it, cucu. Quickly!' },
      { text: '✦ Chapter 10: Nujum Pak Belalang ✦  Follow the glowing grasshoppers across the farm.' }
    ],
    hop: ['The grasshopper hops away, leaving a little trail of gold dust in the air.', 'Hop! Another one, further on, glowing in the grass.', 'Hop, hop... down towards the river.', 'Hop! It is heading for the jetty.', 'The last grasshopper hops to the end of the jetty... and is gone. Something is lying there.'],
    anyam: [
      { text: 'Lying at the end of the jetty: a little grasshopper woven from strips of coconut leaf, the way children make them. It is dusted all over with Pelita\'s gold.' },
      { who: 'nenek', text: 'A belalang anyaman! Only one place weaves them like that: Tanjung Bunga, down the coast. Its children make them while they mind the buffalo.' },
      { who: 'nenek', text: 'Yesterday a trading perahu from Tanjung Bunga stopped here to sell coconuts. There was a boy aboard. A skinny little thing, all knees and elbows, and he laughed at everything.' },
      { who: 'nenek', text: '...I think our Pelita liked him. I think our Pelita went home with him.' },
      { text: 'New task: sail on the jong (at the farm jetty) to Negeri Tanjung Bunga, and find Pelita.' }
    ],
    anyamHint: 'The woven grasshopper from Tanjung Bunga. (The jong at the farm jetty can sail there now.)',
    sail: [
      { text: 'The jong sails down the coast. The sailors say Tanjung Bunga is famous for two things: its sweet-smelling bunga tanjung trees, and its fortune teller.' },
      { text: '"Nujum Pak Belalang," says Juragan Wira. "They say he can find anything. Lost goats, lost rings, lost husbands. He just looks at the sky... and knows."' }
    ],
    sailBack: [{ text: 'The jong ties up at the jetty of Tanjung Bunga. The air smells of flowers and salt fish.' }],
    arrive: [
      { text: 'Negeri Tanjung Bunga. A town of carved wooden houses and flowering trees, and a palace with roofs like folded hands.' },
      { text: 'And there, zipping between the houses at the top of the road: a little gold light. Pelita! And behind it, a skinny barefoot boy, laughing.' },
      { who: 'pelita', expr: 'happy', text: '(Pelita sees you, squeaks, and darts behind the well. The boy giggles and runs after it.)' },
      { text: 'They are playing hide-and-seek. With you. New task: find Pelita and the boy (look for the gold glow).' }
    ],
    seek: ['Giggles behind the well! A flash of gold, bare feet... and they are gone again, squealing, up the road.', 'Found you! ...No. A gold glow and a laugh, and they are off again, towards the palace.'],
    found: [
      { text: 'Got you! The boy tumbles out from behind the palace lamp, laughing so hard he gets hiccups. Pelita bounces on his head.' },
      { who: 'belalang', text: 'Hic! You\'re good at this! Nobody ever finds me. Hic! I\'m Belalang. That\'s my name, like the grasshopper. Because I\'m small, and I jump.' },
      { who: 'belalang', text: 'Is... is he YOURS? The little light? He followed me off the boat. I said "go home", but he wouldn\'t. He just wanted to play.' },
      { who: 'pelita', expr: 'happy', text: '(Pelita circles Belalang, glowing brighter than you have seen it for days. Then it sees your face, stops, and hides behind his ear.)' },
      { who: 'belalang', text: 'He likes it here. Nobody here can see spirits. I can, though. I see all sorts of things nobody else sees.' },
      { who: 'belalang', text: 'Can he stay a little bit? Just a little? ...I have so many chores, and Father never helps, and Pelita makes them fun.' },
      { text: 'Pelita peeks out at you, then at Belalang, then back at you. It does not want to choose.' },
      { text: 'New task: help Belalang with his chores (talk to him, by his father\'s hut). Maybe then Pelita will listen.' }
    ],
    chores: [
      { who: 'belalang', text: 'You\'ll help? Really? Okay! Two jobs. The tempayan by our hut is empty: three buckets of water from the town well.' },
      { who: 'belalang', text: 'And Father wants a fire for his rice tonight, but there\'s no firewood and no coconuts. Three kayu and two kelapa.' },
      { who: 'belalang', text: 'Father? Father\'s... resting. Under the coconut tree. He\'s been resting since I was born, I think.' }
    ],
    bucket: 'You fill a bucket at the town well. Now carry it to the tempayan by Pak Belalang\'s hut.',
    bucketHave: 'You already have a full bucket. Pour it into the tempayan by Pak Belalang\'s hut.',
    pour: 'Splash! You pour the bucket into the big clay tempayan.',
    jarFull: 'The tempayan is full to the brim. Belalang will be pleased.',
    giveText: 'Firewood and coconuts, for Pak Belalang\'s rice. (He will not help carry them.)',
    secret: [
      { who: 'belalang', text: 'Done! All done! You and Pelita are the best. Can I tell you a secret? A real one?' },
      { who: 'belalang', text: 'You know Father is famous? Nujum Pak Belalang, the fortune teller. People come from all over. "Pak Belalang, where is my goat?" And he looks at the sky, and goes "hmmmm", and tells them.' },
      { who: 'belalang', text: 'But it\'s me. I find things. I look everywhere, and I listen, and I follow the tracks. Then I whisper it to Father, and he says it out loud.' },
      { who: 'belalang', text: 'And since Pelita came, it\'s even easier. His light shows the tracks in the dark! We found Mak Jah\'s goat in ten minutes.' },
      { who: 'pelita', expr: 'happy', text: '(Pelita looks extremely proud of itself.)' },
      { text: 'BOOM. BOOM. BOOM. Up at the palace, the great drum is beating. A herald comes running down the road, holding up his sarong.' },
      { who: 'bentara', text: 'Hear ye, hear ye! The Peti Pusaka Diraja, the royal heirloom chest, has been STOLEN in the night! His Majesty summons Nujum Pak Belalang to the palace, AT ONCE!' },
      { who: 'pak_belalang', text: '(Under the coconut tree, a loud snore stops dead.) ...Me? The palace? NOW? Belalang! BELALANG!' },
      { text: 'New task: go to the Sultan, in front of the palace. (Pak Belalang is coming. Slowly.)' }
    ],
    sultan: [
      { who: 'sultan_muzaffar', text: 'Ah! The famous Nujum Pak Belalang! And... his friends? Good, good. Come, all of you. We have a terrible problem.' },
      { who: 'sultan_muzaffar', text: 'Last night someone climbed my garden wall and took the Peti Pusaka Diraja, the heirloom chest of my grandfathers. My crown. My grandmother\'s betel box. My... my favourite slippers.' },
      { who: 'pak_belalang', text: 'Hmmmm. Yes. Yes, I see it. In the... clouds. The clouds say... the chest is... somewhere.' },
      { who: 'sultan_muzaffar', text: 'Marvellous! Then you have until next Ahad: seven days. Bring my chest home by then, and you will be rewarded beyond your dreams.' },
      { who: 'sultan_muzaffar', text: 'And if not... well. I will be very, very disappointed. And so will my grandmother. She is ninety-four, and she is VERY good at being disappointed.' },
      { who: 'belalang', text: '(whispering) Footprints, by the garden wall, going west into Hutan Merbau. I saw them this morning. But it\'s too dark under the merbau trees to follow them... unless Pelita lights the way.' },
      { text: 'New task: talk to Belalang to take him (and Pelita) into Hutan Merbau, west of the town, and follow the thieves\' tracks. You have seven days, until Ahad.' }
    ],
    withYou: [{ who: 'belalang', text: 'Let\'s go! Pelita, light! ...Stay close to Pelita in the forest: the tracks only show where his light falls.' }],
    enter: [
      { text: 'Hutan Merbau. Giant merbau trees shut out the sky. It is as dim as dusk down here, even at noon.' },
      { who: 'belalang', text: 'Look! Where Pelita shines... footprints! Bare feet, five people, and something heavy dragged along. This way!' }
    ],
    noLight: 'It is too dark under the merbau trees to see any tracks. Belalang and Pelita could light them for you (talk to Belalang in Tanjung Bunga).',
    clue: ['A scrap of black cloth, caught on a thorn. Belalang whispers: "Their masks! Thieves wear black."', 'A gold coin in the leaves, stamped with a flower: the royal seal of Tanjung Bunga. They dropped it running.', 'A burnt-out torch, still warm. Belalang: "They\'re close. Ssshh!"'],
    camp: 'Voices ahead, and firelight! The thieves\' camp: five of them round a fire, counting the Sultan\'s treasure. "OI! Who\'s there?!"',
    belalangHide: '(Belalang ducks behind a tree with Pelita.) "You fight. I\'ll... supervise!"',
    won: [
      { who: 'kerengga', text: 'Ow! Ow! Enough! We give up! Take your silly chest! It\'s mostly slippers anyway!' },
      { text: 'Torches through the trees: the palace guards, led by a very out-of-breath Belalang. He ran all the way to fetch them, with Pelita lighting the path.' },
      { who: 'belalang', text: 'Got them! The Kerengga gang! They bite like kerengga ants, so everybody calls them that.' },
      { who: 'kerengga', text: '(as the guards tie his wrists) A fortune teller\'s CHILD. And a little LIGHT. My mother will never let me hear the end of it.' },
      { text: 'The Peti Pusaka Diraja sits by the fire, safe. New task: take it, and carry it back to the Sultan.' }
    ],
    peti: 'You lift the Peti Pusaka Diraja. It is heavy, carved and gilded, and something inside it rattles. (Slippers, probably.)',
    late: [
      { who: 'bentara', text: 'Hear ye! It is Ahad, and the Peti Pusaka Diraja is still lost! His Majesty is... (he checks a note) ...very, very disappointed.' },
      { who: 'sultan_muzaffar', text: '(from the palace steps) Oh, very well. ONE more week. But my grandmother says she is disappointed too, and she is VERY good at it.' }
    ],
    giveBack: [
      { who: 'sultan_muzaffar', text: 'MY CHEST! My crown! My grandmother\'s betel box! My SLIPPERS! (He hugs the chest.)' },
      { who: 'pak_belalang', text: 'Ahem. Yes. I saw it all in the stars, Tuanku. The stars said: west. The stars said: forest. The stars said...' },
      { who: 'belalang', text: '(He rolls his eyes at you, very slowly.)' },
      { who: 'sultan_muzaffar', text: 'Nujum Pak Belalang, you are a marvel! From today you are Nujum Diraja, my Royal Fortune Teller! And your brave friends must have a reward.' },
      { text: 'HOOOOONK. A great horn sounds out at sea. A tall ship with black and red sails is gliding into the harbour.' },
      { who: 'bentara', text: 'Tuanku! A ship from Negeri Antah Berantah! Their famous fortune teller, Tok Nujum Jambul, challenges our Royal Fortune Teller to a contest of riddles!' },
      { who: 'nakhoda', text: '(from the deck, very loudly) Three riddles! If your nujum fails, Tanjung Bunga sends Antah Berantah a ship of treasure every year! If ours fails, the treasure in this ship is yours!' },
      { who: 'sultan_muzaffar', text: 'Accepted! Our Royal Fortune Teller fears nothing! ...Er. Do you, Pak Belalang?' },
      { text: 'Pak Belalang faints, quietly, into a flowerbed.' },
      { who: 'belalang', text: '(tugging your sleeve) Riddles. You can\'t find riddle answers with footprints... But sailors practise on deck at night. If someone hid in that little sampan under the ship, they could hear everything.' },
      { text: 'New task: after dark (7 PM), hide in the sampan under the foreign ship, by the jetty, and listen.' }
    ],
    onTime: 'And so quickly, days before Ahad! Take this too, with my thanks.',
    sampanDay: 'A little sampan, tied up under the foreign ship. In daylight the sailors would see you. Belalang says they practise on deck after dark (7 PM).',
    sampanDone: 'The little sampan bobs under the foreign ship. You already know what they are planning.',
    hear1: [
      { text: 'You slip down into the little sampan under the foreign ship, and lie flat. Above you, on the deck, two voices.' },
      { who: 'nakhoda', text: 'Again, Tok Nujum! From the top! If you forget the answers tomorrow, we\'ll be the laughing stock of the seven seas.' },
      { who: 'jambul', text: 'Yes, yes. Riddle one: a stick, the same at both ends. Which end is the root? Answer: float it in water. The root end is heavier. It sinks.' },
      { text: 'A sailor leans over the rail with a lantern. Its light swings slowly towards the sampan...' }
    ],
    hearStill: 'You hold your breath. The light passes right over you... and moves on. Phew.',
    hearPeek: 'You peek over the edge... straight into the eyes of the ship\'s cat. It yawns. The sailor shrugs and turns away. Phew.',
    hear2: [
      { who: 'jambul', text: 'Riddle two: "Small, it wears clothes. Grown, it goes bare." Answer: rebung, the bamboo shoot. Small, it is wrapped in sheaths. The tall bamboo is bare.' },
      { who: 'jambul', text: 'Riddle three: "What grows longer, the more you cut it?" Answer: a parit. A ditch! Every cut of the cangkul makes it longer. Ha! Nobody ever gets that one.' },
      { who: 'nakhoda', text: 'Good. Now go to sleep. And no more durian before bed, Tok Nujum. You snore.' },
      { text: 'You slip away along the jetty with the three answers ringing in your head: the stick that sinks, the bamboo shoot, the ditch.' },
      { text: 'New task: go to the Sultan for the riddle contest.' }
    ],
    contest: [
      { text: 'The whole town has crowded into the palace yard. Tok Nujum Jambul, in a turban with a tall feather, bows to the Sultan. Pak Belalang is shaking so hard his sarong rattles.' },
      { who: 'belalang', text: '(whispering) Father, you just say what our friend says. Okay? OKAY?' }
    ],
    riddles: [
      { q: 'Riddle the first! Here is a stick of kayu, smooth and straight, the same at both ends. Which end is the root, and which is the tip?', a: ['Float it in water: the root end sinks', 'Ask the stick, politely', 'Whichever end points at the Sultan', 'Cut it in half and see'],
        right: [{ who: 'pak_belalang', text: '(very fast) Float-it-in-water-the-root-end-sinks!' }, { text: 'A servant brings a jar of water. The stick floats... and one end slowly tips down. The crowd gasps, then cheers.' }] },
      { q: 'Riddle the second! Kecil berbaju, besar bertelanjang. Small, it wears clothes. Grown, it goes bare. What is it?', a: ['A bamboo shoot (rebung)', 'A banana', 'A baby', 'A coconut'],
        right: [{ who: 'pak_belalang', text: 'The re... re... REBUNG! The bamboo shoot! Wrapped up when it is small, bare when it is tall!' }, { who: 'jambul', text: '(His feather droops.) ...Correct.' }] },
      { q: 'Riddle the THIRD! Nobody EVER gets this one! Apa yang makin dipotong, makin panjang? What grows longer, the more you cut it?', a: ['A ditch (parit)', 'Your hair', 'A rope', 'The queue at the warung'],
        right: [{ who: 'pak_belalang', text: 'A parit! A ditch! The more you dig it, the longer it gets!' }] }
    ],
    wrong: [{ who: 'jambul', text: 'HA! Wrong!' }, { who: 'sultan_muzaffar', text: '(coughing loudly) Think again, Royal Fortune Teller. Think... much harder.' }],
    won6: [
      { text: 'Silence. Then the whole palace yard explodes: drums! Gongs! Somebody throws flowers. Tok Nujum Jambul sits down on the steps with his head in his hands.' },
      { who: 'jambul', text: 'Thirty years... thirty years nobody has beaten me. And today, a man who was asleep under a coconut tree this morning.' },
      { who: 'nakhoda', text: 'A deal is a deal. The ship\'s treasure is yours, Tuanku. Er... could we keep the ship? To get home?' },
      { who: 'sultan_muzaffar', text: 'Keep your ship, and come back as friends, with more riddles! Pak Belalang, you have saved Tanjung Bunga twice in one week!' },
      { who: 'sultan_muzaffar', text: 'From now on you will sit at my right hand, every day, and solve ALL of my problems! Every single one! Forever!' },
      { who: 'pak_belalang', text: '(very faintly) ...Forever?' },
      { who: 'belalang', text: '(to you, worried) He can\'t pretend forever. Something will go wrong, and the Sultan will be so angry... Father has to tell the truth. But he\'s scared. Will you talk to him?' },
      { text: 'New task: talk to Pak Belalang, under his coconut tree.' }
    ],
    truthAsk: [{ who: 'pak_belalang', text: 'The truth? To the SULTAN? Are you mad? He will throw me in the river! He will feed me to the crocodiles! He will... he will...' }],
    finale: [
      { who: 'pak_belalang', text: '...He will find out anyway, won\'t he. Sooner or later. Ah, Belalang. My clever boy. You are always right. It is very annoying.' },
      { text: 'Pak Belalang stands up. He brushes off his sarong. He walks up the road to the palace, very slowly, and you and Belalang walk with him.' },
      { who: 'pak_belalang', text: 'Tuanku... I am not a fortune teller. I never was. I cannot see anything in the clouds. I mostly see clouds.' },
      { who: 'pak_belalang', text: 'My son found the lost goats. My son and a little spirit found the thieves\' tracks. And this friend from across the sea hid under the ship, and gave me the answers to the riddles.' },
      { text: 'The palace yard goes very quiet. The Sultan stares at Pak Belalang for a long, long moment.' },
      { who: 'sultan_muzaffar', text: '...HA! HA HA HA! (He laughs so hard his tengkolok falls off.) Oh, I KNEW! I knew from the very first day, Pak Belalang. You said the chest was "somewhere"!' },
      { who: 'sultan_muzaffar', text: 'But in thirty years, no fortune teller has ever told me the truth. And THAT is worth more than any riddle.' },
      { who: 'sultan_muzaffar', text: 'So. Belalang, clever boy: from tomorrow you will study at the palace with my own teachers. And you, Pak Belalang, will be keeper of the royal orchards. A real job! With real work! Every morning!' },
      { who: 'pak_belalang', text: '(weakly) ...Work? Every MORNING?' },
      { who: 'belalang', text: 'Hee hee hee!' },
      { text: 'That evening, Belalang walks you down to the jetty. Pelita floats between you, very quiet, its light flickering.' },
      { who: 'belalang', text: 'Pelita. You have to go home now. Your family is waiting. Nenek, and the farm, and... and your best friend. (He looks at you.)' },
      { who: 'belalang', text: 'I\'ll be okay. I\'m going to the palace school! And you can visit. Lots. Promise?' },
      { who: 'pelita', expr: 'sad', text: '(Pelita presses against Belalang\'s cheek, warm as a cup of tea. Then it floats slowly across... and settles on your shoulder, exactly where it belongs.)' },
      { who: 'pelita', expr: 'happy', text: '(It glows. Brighter, and brighter, until the whole jetty is gold.)' },
      { who: 'belalang', text: 'Oh! And this is for you. My sumpit, my blowpipe. Grandfather made it. I\'m the best shot in Tanjung Bunga, but I\'ll be too busy at school now.' },
      { text: '✦ You got Belalang\'s Sumpit! A blowpipe: the first weapon that hits from far away. Hold it and press USE to shoot a dart at whatever is in front of you. ✦' },
      { text: '✦ Chapter 10 complete: Nujum Pak Belalang ✦  Pelita is home, the Sultan has an honest friend, and Belalang is going to school.' }
    ],
    spiritEmpty: 'The spirit house is empty. Pelita\'s little cushion is still warm... but Pelita is not here.',
    night: 'Pelita\'s spirit house stays dark tonight. Somewhere down the coast, a little light is keeping a boy called Belalang company.',
    nenekLost: ['Pelita will come home, cucu. Spirits always know the way home. Sometimes they just take the long way round.', 'I keep turning round to talk to it. Then I remember. Aduh.', 'A child who can see spirits... I knew a girl like that once, in Santubong. She grew up to be your Nenek.', 'Bring Pelita home, cucu. And bring that boy some kuih from me. Anyone Pelita loves that much must be a good child.'],
    nenekAfter: ['Pelita has been glued to your shoulder all day. I think it missed you more than it will admit.', 'A fortune teller who tells the truth! Now THAT is a wonder.', 'The Sultan made the lazy one keeper of the royal orchards? Hah! That Sultan is wiser than he looks.', 'Belalang sent a letter. He has learned to write! It says: PELITA IS MY SECOND BEST FRIEND. Underlined three times.'],
    shoot: ['Phoo!', 'Thwip!', 'Pfft!'],
    // v3.0.1: Nek Lampir's fortune (the user asked for a little humour: she wants Pak Belalang to read her future)
    nek: {
      hint: 'Somebody under Pak Belalang\'s coconut tree is shouting for "a READING, nujum, and be quick about it". That voice sounds familiar...',
      helperGo: 'Hmph. A nujum? I will go and sit in front of him myself. (She stomps off towards the coconut tree.)',
      intro: [
        { text: 'A crowd has gathered under Pak Belalang\'s coconut tree. In the middle, on a mat, sits a familiar old woman with a basket of herbs and a very sour face.' },
        { who: 'lampir', text: 'Hmph. YOU again. Do not look at me like that. I came for a reading. The whole coast says this Pak Belalang is the greatest nujum alive.' },
        { who: 'pak_belalang', text: '(whispering, terrified) Who is she? Why does she smell of pepper? Why is she looking at me like a cat looks at a fish?' },
        { who: 'belalang', text: '(whispering to you) She\'s YOUR friend! Quick: whisper Father something true about her, and he\'ll say it out loud.' }
      ],
      introAfter: [
        { text: 'A crowd has gathered under Pak Belalang\'s coconut tree. In the middle, on a mat, sits a familiar old woman with a basket of herbs and a very sour face.' },
        { who: 'lampir', text: 'Hmph. YOU again. I hear this Pak Belalang is not a real nujum. I do not care. A fake nujum is cheaper than a real one. I want a reading.' },
        { who: 'pak_belalang', text: '(whispering) I am retired! I keep ORCHARDS now! ...Why is she looking at me like a cat looks at a fish?' },
        { who: 'belalang', text: '(whispering to you) Just one more time, Father. For fun! Our friend whispers, you talk. Like the riddles!' }
      ],
      qs: [
        { q: 'First question, nujum. I used to be a great witch. The princess of Gunung Ledang took my magic away. Will I ever get it back?',
          opts: [
            { label: 'Whisper: her magic lives in her herbs now', good: true, res: [
              { who: 'pak_belalang', text: '(eyes closed, swaying) Your magic... is not gone! It has gone... into your HERBS!' },
              { who: 'lampir', text: '...Hm. That is not stupid. My pepper powder IS very magical. It once made Badang sneeze for a whole afternoon.' }] },
            { label: 'Whisper: she has a soft spot for cats', res: [
              { who: 'pak_belalang', text: '(eyes closed, swaying) I see... a cat. Many cats. So, so many cats.' },
              { who: 'lampir', text: 'I HATE cats.' },
              { text: 'Somewhere behind the hut, a cat says "meow". Nek Lampir glares at the hut until it stops.' }] },
            { label: 'Whisper: yes, but very slowly', good: true, res: [
              { who: 'pak_belalang', text: 'Yes! ...Slowly. Very, very slowly. A little bit... every... hundred... years.' },
              { who: 'lampir', text: 'A hundred years. Hmph. I have waited longer for worse things.' }] }
          ] },
        { q: 'Second question. Hang Tuah threw me off my own mountain. Will he ever say sorry?',
          opts: [
            { label: 'Whisper: yes, one day, if she is patient', good: true, res: [
              { who: 'pak_belalang', text: 'He will say sorry! The stars say so! In... (he counts on his fingers, twice) ...three hundred years.' },
              { who: 'lampir', text: 'Three hundred years. Good. I can wait. I am VERY good at waiting. And at holding grudges.' }] },
            { label: 'Whisper: he forgot all about her', res: [
              { who: 'pak_belalang', text: 'He has... forgotten you completely! He does not even remember your name!' },
              { who: 'lampir', text: 'FORGOTTEN?!' },
              { text: 'A jar of pepper explodes in her basket. The whole front row sneezes. Pak Belalang sneezes twice, and once more for luck.' }] }
          ] },
        { q: 'Last question. (She lowers her voice.) Will I ever find... true love?',
          opts: [
            { label: 'Whisper: someone tall and handsome', res: [
              { who: 'pak_belalang', text: 'Someone tall! Someone handsome! Someone with... (he panics) ...a great many teeth! A tall, handsome... CROCODILE!' }] },
            { label: 'Whisper: anything, quick!', res: [
              { who: 'pak_belalang', text: '(in a panic) Love! Yes! A... a... CROCODILE! A big one! In a river! Very handsome. For a crocodile.' }] }
          ],
          after: [
            { text: 'The crowd holds its breath. Nek Lampir is silent for a long, long moment.' },
            { who: 'lampir', text: '...A crocodile.' },
            { who: 'lampir', text: '...Is he rich?' }
          ] }
      ],
      pay: [
        { who: 'lampir', text: 'Here. Payment. My famous jamu: bitter leaf, black pepper, and one ingredient I will not name. Drink it. ALL of it. Now. While I watch.' },
        { text: 'Pak Belalang drinks it. His face goes green, then purple, then a colour nobody in Tanjung Bunga has a name for.' },
        { who: 'pak_belalang', text: '(faintly) ...Delicious. Truly. I can see... through time.' },
        { who: 'belalang', text: 'Hee hee hee!' }
      ],
      good: 'Hmph. A good nujum. Better than I expected. (She almost smiles.) And you, child: here, for the whispering. Do not think I did not see.',
      bad: 'Hmph. A terrible nujum. But an entertaining one. (She almost smiles.) And you, child: here, for the whispering. Do not think I did not see.',
      leave: 'Nek Lampir stomps off towards the jetty with her basket. A skinny ginger cat trots after her. She shoos it. It follows her anyway.',
      callback: [
        { who: 'lampir', text: '(from the back of the crowd) WAIT. So my fortune was FAKE?!' },
        { who: 'pak_belalang', text: '...Mostly fake. The crocodile part might be true! Who knows? Nobody knows! That is the beauty of crocodiles.' },
        { who: 'lampir', text: '...Hmph. I am keeping the crocodile.' }
      ],
      cat: ['A skinny ginger cat, curled up beside Nek Lampir\'s herbs. It followed her all the way home from Tanjung Bunga. She calls it "Kucing". (It means "cat".)', 'The cat is asleep in Nek Lampir\'s basket of pepper leaves. It sneezes in its sleep.', 'Nek Lampir says the cat is NOT hers. The cat has its own bowl, its own cushion, and a little blanket she knitted.'],
      talk: ['Do NOT mention the crocodile.', 'The cat is not mine. It just lives here. And eats here. And sleeps on my feet. That is all.', 'Three hundred years until Hang Tuah says sorry. I have marked it on my calendar.', 'That jamu I gave the fake nujum? Mostly harmless. Mostly.', 'If you ever meet a tall, handsome crocodile... tell him I am busy. But not TOO busy.']
    }
  };
})(window.LC);
