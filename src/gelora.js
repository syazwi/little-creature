/* Little Creature — Chapter 8: Air Pasang, "The Rising Tide" (v2.6). It begins a day after Chapter 7, on the same save.
 * The river at Nenek's farm rises day by day, salty and threaded with black ink. Under the sea, Kanjeng Ratu Kidul and
 * Poseidon are at war: their soldiers fight in the Selat Gelora, where the two seas meet, and the Naga Mother (woken from
 * under her pillar in Kampung Karang) fights Poseidon's sea serpent Ketos. Each ruler blames the other for poisoning the
 * sea, and neither will go first. The truth: Nek Lampir, cleaning out her old hut after Chapter 6, threw Mak Lampir's old
 * jars of bottled anger into the stream on Gunung Ledang, and the stream runs to the sea. The magic only makes anger
 * bigger; the pride was the rulers' own. Nobody is a villain here, and nobody is punished: Nek Lampir says sorry and
 * helps clean up. Both rulers stay dignified (proud, then sorry); no religion, no worship, no gore (beaten soldiers swim
 * away, the dragons are calmed with a cure).
 *  0 (a day after Chapter 7) the flood begins at the farm   1 Kampung Karang: Tok Duyung explains the war
 *  2 ask both rulers (they blame each other)   3 the Selat Gelora: find three pieces of a black jar (Mak Lampir's mark)
 *  4 Gunung Ledang: Nek Lampir confesses, and brews Air Penawar (3 rumpai laut, a pearl)
 *  5 the two dragons, at once (calm one, then the other, which gets furious)
 *  6 the rulers come to the strait themselves and fight each other, one against one (you watch); then you step in and
 *    calm them: first Kanjeng Ratu Kidul, then Poseidon (a duel that wears out their anger; nobody is hurt), and at
 *    last you can tell them what really happened (quests.c8duel: 'kidul', 'pos', 'done')
 *  7 the Naga Mother fetches Nek Lampir: peace under the arch; Naga Kecil grows and can carry you (the reward)
 *  8 clean up with Nek Lampir: six black jars from the sea to her pot at the farm jetty   9 complete
 * Rewards: riding Naga Kecil (the Seruling Naga: under the sea, and anywhere a basikal goes; your swings send a water jet
 * too), river silt that waters the field for 7 nights, two dragon friends, 19,000 kepeng in all. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  function addItems(map) { Object.keys(map).forEach(function (id) { var it = map[id]; it.id = id; it.icon = it.icon || 'i_' + id; LC.ITEMS[id] = it; }); }
  addItems({
    serpihan_balang: { name: 'Serpihan Balang', kind: 'treasure', desc: 'Three pieces of a black clay jar, sticky with ink. Pieced together, they show a mark: a crescent moon with a claw through it.' },
    air_penawar: { name: 'Air Penawar', kind: 'treasure', desc: 'Nek Lampir\'s cure, in a little green bottle. It smells of herbs, the sea and an old woman being sorry. One splash takes the anger out of a dragon.' },
    balang_hitam: { name: 'Balang Hitam', kind: 'treasure', desc: 'One of Mak Lampir\'s old jars, fished out of the sea. Nek Lampir will seal it in her pot so it can never leak again.' },
    seruling_naga: { name: 'Seruling Naga', kind: 'vehicle', ride: 'naga', speed: 2.1, desc: 'A little flute of pearl and coral, from the Naga Mother. Hold it and press USE (or R) and Naga Kecil comes to carry you: under the sea, and anywhere a basikal can go. Swing a weapon while you ride and it sends a jet of water too.' }
  });
  ['serpihan_balang', 'air_penawar', 'balang_hitam', 'seruling_naga'].forEach(function (id) { LC.FIXED_ITEMS[id] = 1; });

  function q(S) { return (S && S.quests) || {}; }
  function c8(S) { return q(S).ch8 || 0; }
  LC.ch8Step = function () { return c8(LC.State.s); };
  LC.hasNagaRide = function () { var S = LC.State.s; return !!S && !!q(S).nagaRide; };

  // ================================================================ enemies: both armies, the ink, and the two dragons
  Object.assign(LC.ENEMIES, {
    laskar8: { name: 'Laskar Kidul', hp: 7, speed: 30, dmg: 7, sight: 130, w: 6, drop: [['kepeng', 0.6, 6, 14], ['mutiara', 0.05, 1, 1]] },
    hoplit8: { name: 'Hoplit Atlantis', hp: 9, speed: 26, dmg: 8, sight: 120, w: 7, charge: true, drop: [['kepeng', 0.6, 6, 14], ['amfora', 0.05, 1, 1]] },
    tinta8: { name: 'Tinta Sumpahan', hp: 4, speed: 20, dmg: 5, sight: 100, w: 6, floaty: true, erratic: true, drop: [['rumpai_laut', 0.5, 1, 2]] },
    nagaibu8: { name: 'Naga Ibu', hp: 70, speed: 34, dmg: 10, sight: 320, w: 12, boss: true, floaty: true, drop: [] },
    ketos8: { name: 'Ketos', hp: 70, speed: 30, dmg: 10, sight: 320, w: 12, boss: true, floaty: true, drop: [] },
    ratu8: { name: 'Kanjeng Ratu Kidul', hp: 60, speed: 34, dmg: 9, sight: 320, w: 8, boss: true, floaty: true, drop: [] },   // (a duel to calm her, never to harm)
    poseidon8: { name: 'Poseidon', hp: 70, speed: 30, dmg: 10, sight: 320, w: 9, boss: true, drop: [] }
  });
  LC.C8 = {
    floodMax: 5, floodBank: 28,                           // the flood climbs one row a day from the river bank (row 28), 5 rows at most
    shards: 3,
    cure: { rumpai_laut: 3, mutiara: 1 }, cureN: 2,       // Nek Lampir's Air Penawar: one bottle for each dragon
    jars: 6,
    reward1: 5000, reward2: 10000, reward3: 4000, silt: 7,
    nek: { x: 23, y: 26 },                                 // where Nek Lampir sets her pot down, by the farm jetty
    volley: { cd: 6.5, warn: 1.1, dmg: 6, w: 9, speed: 430 },   // stray spears across the battlefield
    arena: { x0: 20, y0: 3, x1: 35, y1: 10 },
    boss: {
      wave: { cd: 7, warn: 1.1, h: 16, dmg: 7, push: 40 },             // the Naga Mother: a wave across the arena
      pool: { cd: 9.5, warn: 1.0, r: 26, dur: 2.4, pull: 46, dmg: 6 },  // ...and a whirlpool under your feet
      beam: { cd: 6, warn: 0.9, w: 9, dmg: 8 },                         // Ketos: a jet of water
      slam: { cd: 8, warn: 1.0, r: 88, dmg: 7, push: 60 },              // ...and his tail on the sand
      rage: 0.6                                                         // when one is calm, the other attacks this much more often
    },
    duel: {                                                             // step 6: the rulers (seconds between their special moves)
      kidul: { wave: 6.5, lash: 5, pool: 9, lashLen: 170 },             // her wave, her green selendang, her whirlpool
      pos: { beam: 5.5, slam: 7.5, bolt: 4.2 }                          // his trident's jet, his earthquake, lightning
    }
  };

  // ================================================================ the Selat Gelora, where the two seas meet
  function blank(W, H, ch) { var g = []; for (var y = 0; y < H; y++) { g.push([]); for (var x = 0; x < W; x++) g[y].push(ch); } return g; }
  function fill(g, x0, y0, x1, y1, ch) { for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) if (g[y] && x >= 0 && x < g[0].length) g[y][x] = ch; }
  function ell(g, cx, cy, rx, ry, ch) { for (var y = 0; y < g.length; y++) for (var x = 0; x < g[0].length; x++) { var dx = (x - cx) / rx, dy = (y - cy) / ry; if (dx * dx + dy * dy <= 1) g[y][x] = ch; } }
  function buildGelora() {
    var W = 56, H = 36, g = blank(W, H, 'u');
    fill(g, 0, 0, W - 1, 1, 'C'); fill(g, 0, H - 2, W - 1, H - 1, 'C'); fill(g, 0, 0, 1, H - 1, 'C'); fill(g, W - 2, 0, W - 1, H - 1, 'C');
    ell(g, 9, 23, 7, 8, 'n');                            // the Queen's camp (jade), west
    ell(g, 46, 23, 7, 8, 'a');                           // Atlantis's camp (marble), east
    fill(g, 2, 11, 19, 12, 'C'); fill(g, 36, 11, W - 3, 12, 'C');   // the reef wall before the dragons' deep (the current fills the gap)
    ell(g, 10, 6, 4, 2.5, 'C'); ell(g, 45, 6, 4, 2.5, 'C');
    ell(g, 17, 29, 1.6, 1.2, 'C'); ell(g, 38, 29, 1.6, 1.2, 'C'); ell(g, 31, 13.5, 1.2, 0.8, 'C');
    fill(g, 26, 14, 29, 33, 'v');                        // a sandy track up the middle, to the big broken jar
    fill(g, 27, H - 2, 28, H - 1, 'u');                  // the way back to the black current
    return g;
  }
  var G_OBJ = [
    { id: 'ge_gerbang', type: 'bldg', x: 26, y: 2, w: 4, h: 2, tex: 'gerbang_dua', keep: true, light: 0xbfffe8, text: 'An arch of green jade on one side and white marble on the other, where the Southern Sea meets the old sea of Atlantis. Long ago, somebody built it as a gate between friends.' },
    { id: 'ge_arus', type: 'arus8', x: 20, y: 11, w: 16, h: 2, tex: 'arus8', keep: true, when: function (S) { return c8(S) < 5; } },
    { id: 'ge_balang', type: 'balang8', x: 27, y: 19, w: 2, h: 2, tex: 'balang_pecah', keep: true, when: function (S) { return c8(S) < 8; } },
    { id: 'ge_damai', type: 'bldg', x: 27, y: 19, w: 2, h: 1, tex: 'batu_damai', keep: true, when: function (S) { return c8(S) >= 8; }, text: 'The peace stone, where the broken jar used to be. A green handprint and a white handprint, side by side, and a very small, grumpy one beneath them.' },
    { id: 'ge_khemah', type: 'bldg', x: 5, y: 16, w: 4, h: 3, tex: 'khemah_kidul', keep: true, text: 'The Queen\'s war pavilion: green silk on coral poles, and a map of the strait weighed down with pearls.' },
    { id: 'ge_panjiK1', type: 'bldg', x: 13, y: 17, tex: 'panji_kidul', text: 'A green banner with a golden lotus: the Southern Sea.' },
    { id: 'ge_panjiK2', type: 'bldg', x: 13, y: 28, tex: 'panji_kidul', text: 'A green banner, rippling in the current.' },
    { id: 'ge_guardK1', type: 'bldg', x: 15, y: 21, tex: 'penjaga_laut', text: 'A guard of the Southern Sea, holding the line.' },
    { id: 'ge_guardK2', type: 'bldg', x: 15, y: 25, tex: 'penjaga_laut', text: 'A guard of the Southern Sea. He looks tired of fighting.' },
    { id: 'ge_barikade', type: 'bldg', x: 47, y: 16, w: 3, h: 1, tex: 'barikade', keep: true, text: 'A barricade of fallen marble blocks, with bronze shields propped along it.' },
    { id: 'ge_panjiA1', type: 'bldg', x: 42, y: 17, tex: 'panji_atlantis', text: 'A blue-and-white banner with a golden trident: Atlantis.' },
    { id: 'ge_panjiA2', type: 'bldg', x: 42, y: 28, tex: 'panji_atlantis', text: 'A banner of Atlantis, a little torn.' },
    { id: 'ge_tiang1', type: 'bldg', x: 51, y: 22, tex: 'tiang_atlantis', text: 'A marble column the soldiers of Atlantis carried here. Nobody remembers why.' },
    { id: 'ge_tiang2', type: 'bldg', x: 49, y: 28, tex: 'tiang_patah', text: 'A broken column. A spear is still stuck in it.' }
  ];
  [[21, 16], [34, 18], [24, 27]].forEach(function (t, i) {
    G_OBJ.push({ id: 'ge_serpih' + i, type: 'serpih8', i: i, x: t[0], y: t[1], tex: 'serpih8', when: function (S) { return c8(S) === 3 && !(q(S).c8sh || {})[i]; } });
  });
  function war(S) { var s = c8(S); return s >= 2 && s <= 5 && !q(S).c8boss; }
  function boss(S) { return c8(S) === 5 && !!q(S).c8boss; }
  LC.AREAS.gelora = {
    name: 'Selat Gelora', sub: 'where the two seas meet', lvl: 20, needs: 'naga', build: buildGelora, objects: G_OBJ,
    pond: null, amb: 'deep', underwater: true, ride: {},
    decor: { n: 40, types: ['kelp', 'seagrass', 'shellrock', 'rubble', 'anemone', 'kelp'], on: 'u' },
    critters: [{ kind: 'ikan_kecil', n: 3, zone: { x0: 4, y0: 14, x1: 50, y1: 32 } }],
    clear: [{ x: 27, y: 19, r: 3 }, { x: 27, y: 6, r: 6 }, { x: 27, y: 31, r: 2 }],
    exits: [{ x0: 27, y0: 35, x1: 28, y1: 35, to: 'laut', sx: 39.5, sy: 17, dir: 'down' }],
    home: { x: 27.5, y: 32 },
    enemies: [
      { kind: 'laskar8', n: 3, zone: { x0: 14, y0: 14, x1: 25, y1: 31 }, when: function () { return war(LC.State.s); } },
      { kind: 'hoplit8', n: 3, zone: { x0: 30, y0: 14, x1: 41, y1: 31 }, when: function () { return war(LC.State.s); } },
      { kind: 'tinta8', n: 3, zone: { x0: 21, y0: 15, x1: 34, y1: 26 }, when: function () { return war(LC.State.s); } },
      { kind: 'nagaibu8', n: 1, zone: { x0: 21, y0: 4, x1: 25, y1: 8 }, when: function () { var S = LC.State.s; return boss(S) && !q(S).c8calmN; } },
      { kind: 'ketos8', n: 1, zone: { x0: 30, y0: 4, x1: 34, y1: 8 }, when: function () { var S = LC.State.s; return boss(S) && !q(S).c8calmK; } },
      { kind: 'tinta8', n: 2, zone: { x0: 21, y0: 4, x1: 34, y1: 9 }, when: function () { return boss(LC.State.s); } },
      { kind: 'ratu8', n: 1, zone: { x0: 23, y0: 5, x1: 25, y1: 7 }, when: function () { var S = LC.State.s; return c8(S) === 6 && q(S).c8duel === 'kidul'; } },
      { kind: 'poseidon8', n: 1, zone: { x0: 30, y0: 5, x1: 32, y1: 7 }, when: function () { var S = LC.State.s; return c8(S) === 6 && q(S).c8duel === 'pos'; } }
    ]
  };
  LC.AREA_ORDER = LC.AREA_ORDER.slice(0, LC.AREA_ORDER.indexOf('atlantis') + 1).concat(['gelora'], LC.AREA_ORDER.slice(LC.AREA_ORDER.indexOf('atlantis') + 1));
  LC.AREA_HOWTO.gelora = 'Follow the black current at the east of Kampung Karang (Chapter 8).';
  LC.MAP_POS.gelora = [2, 4];
  LC.MAP_LINKS = LC.MAP_LINKS.concat([['laut', 'gelora', 1]]);
  // the way in: a black current that opens at the east of Kampung Karang
  LC.AREAS.laut.objects.push({ id: 'l_arus', type: 'arusgate8', to: 'gelora', x: 39, y: 15, w: 2, h: 1, tex: 'gerbang_arus', keep: true, when: function (S) { return c8(S) >= 1; } });
  // Mak Lampir's old jars, for the clean-up (step 8)
  LC.C8.jarSpots = [['laut', 12, 26], ['laut', 38, 20], ['gelora', 12, 31], ['gelora', 43, 31], ['kidul', 30, 10], ['atlantis', 40, 8]];
  LC.C8.jarSpots.forEach(function (j, i) {
    LC.AREAS[j[0]].objects.push({ id: 'jar8_' + i, type: 'jar8', i: i, x: j[1], y: j[2], tex: 'balang_hitam', when: function (S) { return c8(S) === 8 && !(q(S).c8jar || {})[i]; } });
  });

  // ================================================================ the two dragons, as friends (after step 6)
  Object.assign(LC.VILLAGERS, {
    nagaibu: {
      name: 'Naga Ibu', role: 'The Naga Mother of the reef', area: 'gelora', post: { x: 17, y: 8 }, sprite: true, glow: 0x7affc8,
      intro: ['Child of the little light. I am the Naga Mother of the reef. For a thousand years I slept beneath the pillar in Kampung Karang, keeping the coral alive. The black water woke me, and filled my head with fire.',
        'It is gone now. Thank you. My little one talks about you all the time. Well. It squeaks about you.'],
      chat: ['The reef sings again. Can you hear it?', 'Ketos and I have agreed: he gets the warm rocks in the morning, I get them in the afternoon.', 'My little one is very proud to carry you. Do not tell it that it wobbles.', 'Anger is like ink. A little of it spreads a very long way.'],
      tasks: [['ikan_kembung', 3, 5], ['sotong', 1, 2], ['kerang', 3, 5]], taskText: 'for the Naga Mother', gifts: { 3: ['mutiara', 2], 6: ['kepeng', 1500], 10: ['emas', 3] },
      hideIf: function (S) { return c8(S) < 6; }
    },
    ketos: {
      name: 'Ketos', role: 'Poseidon\'s sea serpent (from the Greek tales)', area: 'gelora', post: { x: 38, y: 8 }, sprite: true, glow: 0x8fd3ff,
      intro: ['Hhhh. Hello. I am Ketos. In the old Greek tales they call me a sea monster. I prefer "sea enthusiast".',
        'Poseidon found me as an egg on a beach, a very long time ago. I am sorry I tried to swallow you. I would not have enjoyed it.'],
      chat: ['I like sunbathing on warm rocks. Under the sea. It is harder than it sounds.', 'The Naga Mother is very wise. And very fast. My tail still hurts.', 'Poseidon cried when he saw me after the war. He says it was seawater. It was not.', 'Do you have any sardines? No? Never mind.'],
      tasks: [['ikan_kembung', 3, 5], ['ikan_kerapu', 1, 2], ['amfora', 1, 1]], taskText: 'for a hungry sea serpent', gifts: { 3: ['amfora', 2], 6: ['kepeng', 1500], 10: ['kristal', 3] },
      hideIf: function (S) { return c8(S) < 6; }
    }
  });
  // while they fight in the strait (step 6), the two rulers are not at home
  LC.VILLAGERS.ratukidul.hideIf = function (S) { return c8(S) === 6; };
  LC.VILLAGERS.poseidon.hideIf = function (S) { return c8(S) === 6; };
  LC.SPEAKERS = Object.assign(LC.SPEAKERS || {}, {
    nagaibuW: { name: 'Naga Ibu', portrait: 'nagaibu_face8' },   // (furious)
    ketosW: { name: 'Ketos', portrait: 'ketos_face8' },
    nagaibu: { name: 'Naga Ibu', portrait: 'nagaibu_face' },
    ketos: { name: 'Ketos', portrait: 'ketos_face' },
    nagakecil: { name: 'Naga Kecil', portrait: 'sp_naga' },
    laskar: { name: 'Laskar Kidul', portrait: 'laskar8_0' },
    hoplit: { name: 'Hoplit of Atlantis', portrait: 'hoplit8_0' }
  });

  // the flood's silt waters the field for a week (host's quests: the farm is shared)
  var dusk = LC.Home.dusk;
  LC.Home.dusk = function (s, lines) {
    var r = dusk.apply(this, arguments), Q = s && s.quests;
    if (Q && Q.c8silt > 0) {
      Q.c8silt--;
      var n = 0;
      Object.keys(s.tiles || {}).forEach(function (k) { var t = s.tiles[k]; if (t.tilled && t.crop && !t.wet) { t.wet = true; n++; } });
      lines.push('The river silt kept the field moist all night' + (n ? ' (' + n + ' crop' + (n > 1 ? 's' : '') + ' watered)' : '') + '.' + (Q.c8silt ? ' (' + Q.c8silt + ' more night' + (Q.c8silt > 1 ? 's' : '') + '.)' : ''));
    }
    return r;
  };

  // ================================================================ the story, in their words
  LC.CH8TEXT = {
    flood: [
      { text: 'In the morning the river is too loud. You go down to the jetty and stop: the water has crept up over the sand and into the grass, brown and cold. It smells of salt.' },
      { who: 'nenek', text: 'Cucu! Seventy years I have lived by this river, and it has never come up like this. Not in the monsoon. Not ever.' },
      { who: 'nenek', text: 'And taste it... no, do not taste it. It is SALT. The sea is pushing up the river. Something is very wrong out there.' },
      { text: 'Pelita drifts out over the water. In its light you see thin black threads winding through the flood, like ink in a glass of water. All of them come up from the sea.' },
      { who: 'pelita', expr: 'sad', text: '(Pelita shivers, and points out to sea: towards Pulau Mutiara, and the reef beneath it.)' },
      { who: 'nenek', text: 'The sea folk will know. Dive down to Kampung Karang and ask old Tok Duyung. And hurry: if this keeps rising, it will be at the field fence in a few days.' },
      { text: '✦ Chapter 8: Air Pasang (The Rising Tide) ✦  Dive at the bubbles off Pulau Mutiara, and ask Tok Duyung in Kampung Karang about the black water.' }
    ],
    rise: 'The flood rose again in the night. Nenek has moved the hens up to the house.',
    duyung: [
      { who: 'duyung', text: 'Mmmm... child. You have come about the water. Of course you have. Look at my reef.' },
      { text: 'The coral of Kampung Karang is grey and quiet. Black threads drift between the houses. Even the clownfish are hiding.' },
      { who: 'duyung', text: 'The Queen of the Southern Sea and Poseidon of Atlantis are at war. Real war, child. Soldiers, spears, and worse.' },
      { who: 'duyung', text: 'When two rulers of the sea are angry, the sea itself gets angry. Every wave they make pushes the water up onto the land. That is your flood.' },
      { who: 'duyung', text: 'And the Naga Mother has woken from under her pillar. She fights for the Queen now, against Poseidon\'s sea serpent, Ketos. Two dragons, tearing at each other. I never thought I would see it.' },
      { who: 'duyung', text: 'Nobody knows how it started. The Queen says Poseidon poisoned her water. Poseidon says she poisoned his. Go and ask them, child. Perhaps they will listen to somebody from the land.' },
      { text: 'New task: talk to Kanjeng Ratu Kidul (through the green arch, south) and to Poseidon (down the deep trench, west). And a black current has opened at the east of the village...' }
    ],
    ratuWar: [
      { who: 'ratukidul', text: 'Child of the land. You find me at war. I do not like it. But I do not run from it.' },
      { who: 'ratukidul', text: 'Black water came into my sea from the north, where the two seas meet. My fish choked. My jellyfish lamps went out. My guards could not sleep for anger.' },
      { who: 'ratukidul', text: 'And who lives beyond that water? Poseidon, with his loud voice and his big fork. He has always envied my sea.' },
      { who: 'ratukidul', text: 'When he says sorry, I will listen. Not one moment before. A queen does not go first.' }
    ],
    posWar: [
      { who: 'poseidon', text: 'YOU! Land-dweller! Good, a witness! Tell the world what she did to my city!' },
      { who: 'poseidon', text: 'Black water, pouring into Atlantis from the south! My columns are stained, my people cannot rest, and Nerissa\'s scrolls are all smudged!' },
      { who: 'poseidon', text: 'And who lives to the south? HER. The Queen, with her green guards and her proud face. She has always thought her sea was better than mine.' },
      { who: 'poseidon', text: 'Let her say sorry first. I am a KING. Kings do not go first. ...Well, go on, then! Go and look at the battle, if you are so curious. Just do not get speared.' }
    ],
    asked: 'Both of them blame each other... but both say the black water came from where the two seas meet. Follow the black current at the east of Kampung Karang, to the Selat Gelora.',
    arrive: [
      { text: 'The black current spits you out into the Selat Gelora, where the two seas meet. And it is a war.' },
      { text: 'Green guards of the Southern Sea and bronze soldiers of Atlantis clash in the murky water. Spears fly. Beyond a wall of churning current, two dragons coil around each other, roaring.' },
      { who: 'pelita', expr: 'sad', text: '(Pelita presses close to you. In its light the black ink glows faintly purple, and it all comes from somewhere in the middle of the battlefield.)' },
      { text: 'The soldiers do not even see who you are. Everybody here is too angry to think.' }
    ],
    shards: [
      { text: 'You fit the three pieces together. They make the neck of a black clay jar, and on it, scratched deep into the clay, a mark: a crescent moon with a claw through it.' },
      { who: 'pelita', expr: 'angry', text: '(Pelita flares up, bright and angry. It knows that mark. It was on Mak Lampir\'s jars on Pulau Kelam, and on her things on Gunung Ledang.)' },
      { text: 'More jars lie half-buried round the big broken one in the middle. All of them leak black ink. All of them carry the same mark.' },
      { text: 'Mak Lampir\'s old magic. But Mak Lampir is gone. There is only Nek Lampir now, growing herbs on Gunung Ledang... isn\'t there?' },
      { text: 'New task: sail to Gunung Ledang on the jong, and show the pieces of the jar to Nek Lampir.' }
    ],
    confess: [
      { who: 'lampir', text: 'What now? I am busy. These chillies will not shout at themselves.' },
      { text: 'You hold out the three pieces of black jar. Nek Lampir looks at them. Then she looks at them for a very long time.' },
      { who: 'lampir', text: '...Ah.' },
      { who: 'lampir', text: 'After the princess took my magic, I cleaned out my old hut. Seventy years of jars. Curses, sulks, bottled tempers. I did not want them near my herbs. I did not want them near ME.' },
      { who: 'lampir', text: 'So I carried them down to the stream and threw them in, one by one. Splash. Splash. It felt wonderful. Like throwing away the old Lampir.' },
      { who: 'lampir', text: '...The stream goes down to the sea. Of course it does. Every stream goes down to the sea. I did not THINK.' },
      { who: 'lampir', text: 'That magic feeds on anger, child. A little temper, a little pride, and it makes them a hundred times bigger. Two proud rulers of the sea? It must have been a feast.' },
      { who: 'lampir', text: 'Hmph. Well. I made this mess, and I will help fix it. I can still brew a penawar, a cure. No magic in it. Just herbs, and the sea, and being sorry.' },
      { who: 'lampir', text: 'Bring me 3 rumpai laut and a pearl. I have the herbs. And do not look at me like that. I KNOW.' }
    ],
    brewed: [
      { text: 'Nek Lampir stirs the seaweed and the pearl into her pot with a bundle of herbs, muttering. The pot bubbles green, then gold, then clear as morning water.' },
      { who: 'lampir', text: 'Air Penawar. Two bottles: one for each of those dragons. Wear them out, then splash them, and the anger will pour out of them like ink out of a squid.' },
      { who: 'lampir', text: 'And when those two rulers stop shouting... send for me. I will say sorry. To their faces. Properly. Hmph.' },
      { text: 'New task: go back to the Selat Gelora, and through the current to the two dragons.' }
    ],
    current: 'A wall of churning current. Beyond it, two dragons roar and coil around each other. You cannot swim through it, and you are not sure you want to.',
    currentOpen: 'The current has worn thin, as if the dragons have tired themselves out. You could swim through to them now.',
    bossStart: [
      { who: 'nagaibuW', text: 'GRRRAAAH! Another of Poseidon\'s creatures! I will drag you down to the bottom of the sea!' },
      { who: 'ketosW', text: 'SKRAAAH! The Queen sends a CHILD? I will swallow you whole!' },
      { who: 'pelita', expr: 'angry', text: '(Pelita blazes up. Wear them down, and Nek Lampir\'s cure will do the rest!)' }
    ],
    calmN: 'The Naga Mother shudders as the black ink pours out of her... and sinks down, calm. Ketos is furious now!',
    calmK: 'Ketos coughs out a cloud of black ink... and goes still, blinking. The Naga Mother is furious now!',
    calmed: [
      { text: 'The last of the ink drifts away. The Selat Gelora goes quiet. Spears stop in the water. Soldiers of both sides lower their weapons and look at each other, puzzled, like people waking from a dream.' },
      { who: 'nagaibu', text: '...My head. It was full of fire. Child? You are my little one\'s friend. What... what have I done?' },
      { who: 'ketos', text: 'Hhhh. I tried to bite a dragon. I do not even LIKE biting. I like sunbathing on rocks.' },
      { who: 'nagakecil', text: '(A small blue-and-gold naga darts out from behind the arch, and wraps itself round the Naga Mother\'s neck.) Ibu!' },
      { who: 'nagaibu', text: 'There, there, little one. It is over. ...It is over, isn\'t it, child? Then the Queen and Poseidon must hear the truth. From you.' },
      { text: 'The water shudders. From the west comes a wall of green light; from the east, a crash of thunder. Kanjeng Ratu Kidul and Poseidon have come to the strait themselves, and they have seen their dragons.' }
    ],
    shoutR: ['You hurt my Naga!', 'The Southern Sea does not bow!', 'Enough of your thunder!', 'Go back to your ruins!'],
    shoutP: ['You hurt my Ketos!', 'Feel the trident!', 'Atlantis does not kneel!', 'Proud old tide!'],
    duelStop: [
      { who: 'pelita', expr: 'angry', text: '(Pelita tugs at your sleeve, then shoves you forward. Somebody has to stop them!)' },
      { text: 'You swim straight in between them, into the middle of the storm.' },
      { who: 'ratukidul', text: 'Stand aside, child of the land. This is between a queen and a king.' },
      { who: 'poseidon', text: 'Ha! Let the little one try. Go on, child: tire her out, and then I will finish this!' },
      { who: 'pelita', expr: 'angry', text: '(Pelita glows fierce and bright. First the Queen, then Poseidon. Calm them both down: their anger, not them!)' }
    ],
    kidulWon: [
      { who: 'ratukidul', text: '...Enough. Enough. You fight like the tide, child: you just keep coming back.' },
      { who: 'ratukidul', text: 'I yield. And I am very tired of being angry.' },
      { who: 'poseidon', text: 'HA! The Queen yields to a child! Now, little one. Try that with a KING!' }
    ],
    truth: [
      { who: 'poseidon', text: 'Hhhh... hhhh. All right. ALL RIGHT. I yield! My arms are like seaweed.' },
      { text: 'The two rulers of the sea sit down on the sand, a long way apart, breathing hard. Neither of them will look at the other.' },
      { text: 'Now they listen. You hold up the pieces of the black jar, and tell them everything: Mak Lampir\'s old jars, the stream on Gunung Ledang, the old woman who threw them away to start a new life, and the black water that makes every anger bigger.' },
      { who: 'ratukidul', text: '...So it was not Poseidon. It was an old woman cleaning her house. And the anger in my sea was my own, made bigger.' },
      { who: 'poseidon', text: 'A witch\'s old jars. Thrown in a stream. By MISTAKE. And I declared WAR.' },
      { who: 'poseidon', text: '(quietly, to you) ...I called her a "puffed-up jellyfish". In front of the dolphins.' },
      { who: 'ratukidul', text: 'I will meet him under the arch, and talk. But I will not go FIRST. A queen arrives at a dignified moment.' },
      { who: 'poseidon', text: 'And a king arrives at exactly the right moment. Which is not first.' },
      { who: 'pelita', expr: 'happy', text: '(Pelita lets out a very small, very patient sigh.)' },
      { text: 'New task: ask the Naga Mother (in the deep, west of the arch) to fetch Nek Lampir, so she can say sorry herself.' }
    ],
    fetch: '"Nek Lampir? On the mountain, with the herbs? I will bring her. Gently. In a bubble." The Naga Mother rises into the deep with a flick of her tail.',
    finale: [
      { text: 'The Naga Mother comes down out of the deep with an enormous bubble held gently in her coils. Inside it, clutching her walking stick, sits a very grumpy old woman.' },
      { who: 'lampir', text: 'I am UNDER THE SEA. In a BUBBLE. At my age. Hmph!' },
      { text: 'From the green side of the arch comes Kanjeng Ratu Kidul. From the white side, Poseidon. Both of them stop just out of sight, each waiting for the other to go first.' },
      { who: 'pelita', expr: 'happy', text: '(Pelita floats up between them and blinks: one... two... THREE!)' },
      { text: 'Both of them step out at exactly the same moment, and find themselves nose to nose under the arch.' },
      { who: 'poseidon', text: '...Your Majesty.' },
      { who: 'ratukidul', text: '...Your Majesty.' },
      { who: 'lampir', text: 'Oh, for goodness\' sake. Listen, both of you. The black water was mine: old jars from my old life, and I threw them in a stream without thinking. I am sorry. Truly. There. I said it.' },
      { who: 'lampir', text: 'But the shouting? The spears? That was yours. My old magic only makes anger bigger. It cannot make it out of nothing.' },
      { who: 'ratukidul', text: '...She is right. I was proud, and I was quick to blame you. I am sorry, Poseidon.' },
      { who: 'poseidon', text: 'And I was loud, and I was quicker. I am sorry too. You are NOT a puffed-up jellyfish.' },
      { who: 'ratukidul', text: 'A what?' },
      { who: 'poseidon', text: 'Nothing! Peace! Let us have peace, and a feast, and somebody please clean up these jars.' },
      { who: 'lampir', text: 'I will clean them up. Every last one. That is what sorry means.' },
      { who: 'nagaibu', text: 'And the sea will settle. The tides will go back down from the land, and the rivers will run clear.' },
      { who: 'nagaibu', text: 'Child of the little light. My little one has followed you since the day you fed it on Pulau Mutiara. In your friendship it has grown strong.' },
      { text: 'Naga Kecil glows... uncoils... and grows, and grows, until it is long enough to carry a rider on its back.' },
      { who: 'nagakecil', text: '(Naga Kecil wriggles happily, and nudges your hand with its nose. It wants you to climb on!)' },
      { who: 'nagaibu', text: 'Take this pearl flute. Play it, and my little one will come to carry you: under the sea, and on land wherever the path is wide enough.' },
      { text: '✦ Naga Kecil can carry you! Hold the Seruling Naga and press USE (or R): under the sea, and anywhere you could ride a basikal. Swing a weapon while you ride, and it sends a jet of water flying too. ✦' },
      { text: 'New task: help Nek Lampir clean up. Find her 6 black jars (two in Kampung Karang, two here in the Selat Gelora, one in the Queen\'s palace, one in Atlantis) and bring them to her pot by the farm jetty.' }
    ],
    jar: 'One of Mak Lampir\'s black jars',
    nekWait: ['Hmph. Well? The jars will not walk here by themselves.', 'Six jars. I counted them going IN, and I will count them coming OUT.', 'Do not just stand there. The sea is big and my knees are old.', 'Two in Kampung Karang, two in that strait, one at the Queen\'s, one in Atlantis. Go!'],
    done: [
      { who: 'lampir', text: 'Six. That is the last one. FSSSH. There.' },
      { text: 'The river runs clear and quiet past the jetty, back where it belongs. The flood has left fine dark silt over the bank and along the edge of the field.' },
      { who: 'nenek', text: 'River silt! My grandmother said the old floods left the best soil in the world. Your crops will drink well this week, cucu.' },
      { who: 'lampir', text: 'Hmph. Do not thank me. It was my mess. ...You can thank me a little.' },
      { who: 'nenek', text: 'Thank you, Lampir. Stay for tea?' },
      { who: 'lampir', text: '...One cup.' },
      { text: '✦ Chapter 8 complete: Air Pasang ✦  The river silt waters your field every night for 7 days. The Selat Gelora is at peace, and its two dragons are your friends.' }
    ],
    nenekFlood: ['The water is at the fence posts, cucu. Go quickly, but go carefully.', 'I have moved the hens up to the house. They are not pleased.', 'Seventy years, and never a flood like this. The sea is angry about something.', 'Take something to eat. You cannot save the world on an empty stomach.'],
    nenekAfter: ['Lampir comes for tea on Sundays now. She complains about my tea. She drinks three cups.', 'A naga, carrying my grandchild about! When I was your age we had a bicycle with one pedal.', 'The river is the clearest I have seen it since I was a girl.', 'The Queen of the Southern Sea sent me a pearl and a very polite letter. I have framed the letter.']
  };
})(window.LC);
