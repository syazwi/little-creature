/* Little Creature — Chapter 5: Bayang Hitam, "Black Shadow" (v2.3). It begins after Chapter 4, on the same save.
 * Mak Lampir, a black-magic witch (v2.3.1, at the user's request; her look, words and story here are this game's own),
 * has whispered in Laksamana Kebo Taruna's ear since the cockfight of Barunai: she fed the anger behind the attack of
 * Chapter 4. Now he guards Pulau Kelam, a black rock far out at sea, and she has bound Si Kelam, a shadow that drinks
 * light (an original creature of this game, not a figure of any faith), to his anger. She wants Pelita's light, a
 * light that never goes out, to stay young for a thousand years.
 *  0 (a night after Chapter 4) the lamps go out on Nenek's farm   1 drive the shadows off the farm
 *  2 show the shadow shard to Juragan Wira on the trading jong; Tukang Leong's guard lamps; sail to Java
 *  3 Java: the king, and Empu Lintang the old lamp-maker, who made Pelita's first lamp. He needs brass from Barunai,
 *    a Cahaya Bunian (the hidden folk wash shadow shards clean) and damar resin from Hutan Rimba
 *  4 Pulau Kelam: light the four stone torches with the Pelita Purnama, then face Si Kelam; then Mak Lampir herself
 *    (quests.c5witch), whose magic snuffs the torches out again
 *  5 Pelita becomes Pelita Purnama, the Full Moon Spirit; the witch flees as a bat; the admiral is freed.
 * While the shadow is loose (steps 1-4) Pelita is pale, the torches of the farm and the kampung will not stay lit,
 * shadows prowl at night, and they wilt crops on the farm unless the guard lamps are burning. No gore anywhere:
 * Si Kelam bursts into sparks, and Mak Lampir turns into a bat and flaps away. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  function addItems(map) { Object.keys(map).forEach(function (id) { var it = map[id]; it.id = id; it.icon = it.icon || 'i_' + id; LC.ITEMS[id] = it; }); }
  addItems({
    serpihan_kelam: { name: 'Serpihan Kelam', kind: 'treasure', desc: 'A shard of Si Kelam, colder than ice. It drinks the light around it, and Pelita will not go near it.' },
    cahaya_bunian: { name: 'Cahaya Bunian', kind: 'treasure', desc: 'Shadow shards, washed in a forest stream under the moon until only light was left. It floats in its little jar.' },
    damar: { name: 'Damar', kind: 'treasure', sell: 40, price: 120, desc: 'Golden resin from the old damar tree. Wrapped in leaves, it burns bright and clean: the oldest torch of the islands.' },
    pelita_purnama: { name: 'Pelita Purnama', kind: 'treasure', desc: 'Empu Lintang\'s full-moon lamp, made of Barunai brass, Bunian light and forest damar. Its flame is the same colour as Pelita.' }
  });
  function q(S) { return (S && S.quests) || {}; }
  function c5(S) { return q(S).ch5 || 0; }
  function isNight(S) { return S.minutes >= 19 * 60 || S.minutes < 5 * 60; }
  LC.ch5Step = function () { return c5(LC.State.s); };
  LC.purnama = function () { return c5(LC.State.s) >= 5; };
  // Pelita's picture everywhere (the world, the HUD, dialogue, the map): the Full Moon Spirit after Chapter 5
  LC.ghostTex = function (stage, expr) { return (LC.purnama() ? 'ghost_5_' : 'ghost_' + stage + '_') + (expr || 'normal'); };
  LC.shadowLoose = function () { var s = c5(LC.State.s); return s >= 1 && s <= 4; };

  // ================================================================ the shadows
  Object.assign(LC.ENEMIES, {
    kelam: { name: 'Bayang Kelam', hp: 6, speed: 30, dmg: 7, sight: 130, w: 6, drop: [] },
    sikelam: { name: 'Si Kelam', hp: 60, speed: 19, dmg: 12, sight: 200, w: 15, boss: true, drop: [] },
    maklampir: { name: 'Mak Lampir', hp: 50, speed: 24, dmg: 10, sight: 200, w: 8, boss: true, drop: [] }
  });
  function shadowNight(farm) { return function () { var S = LC.State.s, s = c5(S); return s >= 2 && s <= 4 && isNight(S) && !(farm && q(S).c5lamps); }; }
  LC.AREAS.farm.enemies = (LC.AREAS.farm.enemies || []).concat([
    { kind: 'kelam', n: 4, zone: { x0: 9, y0: 5, x1: 28, y1: 9 }, when: function () { return c5(LC.State.s) === 1; } },   // the first night
    { kind: 'bayang', n: 3, zone: { x0: 2, y0: 23, x1: 44, y1: 26 }, when: shadowNight(true) }                       // every night after, until the lamps are lit
  ]);
  LC.AREAS.kampung.enemies = (LC.AREAS.kampung.enemies || []).concat([{ kind: 'bayang', n: 3, zone: { x0: 2, y0: 12, x1: 44, y1: 24 }, when: shadowNight(false) }]);

  LC.C5 = {
    lamps: { kayu: 10, tembaga: 2 }, lampKepeng: 1500,
    forge: { tembaga: 3, cahaya_bunian: 1, damar: 2 },
    shards: { serpihan_bayang: 3 },
    obor: [{ x: 11, y: 8 }, { x: 28, y: 8 }, { x: 11, y: 18 }, { x: 28, y: 18 }],
    javaStock: ['kain_batik', 'celengan', 'jamu_kuat', 'damar'],
    reward: 8000,
    witch: { zone: { x0: 13, y0: 7, x1: 26, y1: 17 }, blink: 4.5, snuff: 13 }   // she vanishes and reappears; her magic snuffs a torch
  };
  // Tukang Leong's guard lamps on Nenek's farm, and the old damar tree in Hutan Rimba
  [{ x: 19, y: 12 }, { x: 37, y: 12 }, { x: 4, y: 23 }, { x: 24, y: 26 }].forEach(function (t, i) {
    LC.OBJECTS.push({ id: 'c5_lampu' + i, type: 'bldg', x: t.x, y: t.y, tex: 'tiang_pelita', light: 0xffc870, when: function (S) { return !!q(S).c5lamps; },
      text: 'One of Tukang Leong\'s guard lamps: a brass lantern on a post of belian wood. It burns all night, and the shadows keep away.' });
  });
  LC.AREAS.forest.objects.push({ id: 'f_damar', type: 'damar', x: 20, y: 12, w: 2, h: 2, tex: 'pohon_damar', when: function (S) { return c5(S) >= 3; } });

  // ================================================================ Java: the harbour and court of Majapahit
  function grid(W, H, ch) { var g = []; for (var y = 0; y < H; y++) { g.push([]); for (var x = 0; x < W; x++) g[y].push(ch); } return g; }
  function fill(g, x0, y0, x1, y1, ch) { for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) if (g[y] && x >= 0 && x < g[0].length) g[y][x] = ch; }
  function ell(g, cx, cy, rx, ry, ch) { for (var y = 0; y < g.length; y++) for (var x = 0; x < g[0].length; x++) { var dx = (x - cx) / rx, dy = (y - cy) / ry; if (dx * dx + dy * dy <= 1) g[y][x] = ch; } }
  function buildJawa() {
    var W = 46, H = 32, g = grid(W, H, '.');
    fill(g, 0, 0, W - 1, 1, 'J'); fill(g, 0, 0, 1, 25, 'J'); fill(g, W - 2, 0, W - 1, 25, 'J');
    fill(g, 22, 7, 23, 26, 'k');                       // the brick avenue from the harbour up to the king's pavilion
    fill(g, 2, 23, W - 3, 24, 'k');                    // the market road
    fill(g, 17, 7, 28, 8, 'k');                        // the forecourt
    fill(g, 4, 13, 13, 19, 'q');                       // the great pool
    fill(g, 0, 26, W - 1, 26, 's'); fill(g, 0, 27, W - 1, 27, 'S'); fill(g, 0, 28, W - 1, 28, 'h'); fill(g, 0, 29, W - 1, H - 1, 'o');
    fill(g, 22, 26, 23, H - 1, 'j');                   // the harbour jetty
    return g;
  }
  var J_OBJ = [
    { id: 'jw_pendopo', type: 'bldg', x: 19, y: 3, w: 8, h: 4, tex: 'pendopo', keep: true, text: 'The king\'s pendopo: a great open pavilion on carved pillars, with a roof that rises in steps like a mountain.' },
    { id: 'jw_gapura_l', type: 'bldg', x: 19, y: 10, w: 2, h: 3, tex: 'gapura_l', text: 'A split gate of red brick. Majapahit builds in brick: walls, gates, even its roads.' },
    { id: 'jw_gapura_r', type: 'bldg', x: 24, y: 10, w: 2, h: 3, tex: 'gapura_r', text: 'The other half of the split gate. Walk through the gap, between the two halves.' },
    { id: 'jw_sign', type: 'signpost', x: 14, y: 20, tex: 'sign', text: 'THE GREAT POOL. Dug by the people of the city long ago, lined with red brick, so that no one goes thirsty in the dry season.' },
    { id: 'jw_bengkel', type: 'bldg', x: 31, y: 13, w: 3, h: 2, tex: 'bengkel_tembaga', text: 'Empu Lintang\'s workshop. Lamps of every size hang from the beams: brass, clay, glass, even one made from a coconut.' },
    { id: 'jw_rumah1', type: 'bldg', x: 3, y: 4, w: 3, h: 3, tex: 'rumah_jawa', text: 'A house with a tall roof of red clay tiles, on a base of red brick.' },
    { id: 'jw_rumah2', type: 'bldg', x: 9, y: 4, w: 3, h: 3, tex: 'rumah_jawa', text: 'Someone inside is practising the gamelan. The same bit, again and again.' },
    { id: 'jw_rumah3', type: 'bldg', x: 35, y: 4, w: 3, h: 3, tex: 'rumah_jawa', text: 'Batik cloth dries in the sun on a bamboo pole outside.' },
    { id: 'jw_rumah4', type: 'bldg', x: 40, y: 4, w: 3, h: 3, tex: 'rumah_jawa', text: 'A potter\'s house: terracotta jars and little celengan line the steps.' },
    { id: 'jw_rumah5', type: 'bldg', x: 37, y: 17, w: 3, h: 3, tex: 'rumah_jawa', text: 'A sailor\'s house. A model jong sits on the windowsill.' },
    { id: 'jw_pasar1', type: 'pasar5', x: 6, y: 21, w: 3, h: 2, tex: 'gerai_jawa', text: 'A market stall.' },
    { id: 'jw_pasar2', type: 'pasar5', x: 12, y: 21, w: 3, h: 2, tex: 'gerai_jawa', text: 'A market stall.' },
    { id: 'jw_pasar3', type: 'pasar5', x: 30, y: 21, w: 3, h: 2, tex: 'gerai_jawa', text: 'A market stall.' },
    { id: 'jw_jong', type: 'jong5', x: 24, y: 28, w: 5, h: 3, tex: 'jong_majapahit' }
  ];
  LC.AREAS.jawa = {
    name: 'Majapahit', sub: 'the harbour and court, Java', lvl: 20, build: buildJawa, objects: J_OBJ,
    pond: 'sea', amb: 'sea', decor: { n: 30, types: ['bush', 'hibiscus', 'bougainvillea', 'lalang'], on: '.' },
    critters: [{ kind: 'chicken', n: 3, zone: { x0: 28, y0: 9, x1: 42, y1: 12 } }],
    trees: { n: 10, on: '.', tex: ['jtree'], text: 'A frangipani tree, heavy with sweet white flowers.' },
    exits: [], home: { x: 22.5, y: 25 }, ride: {}, warm: true
  };

  // ================================================================ Pulau Kelam: a black rock far out at sea
  function buildKelam() {
    var W = 40, H = 30, g = grid(W, H, 'o');
    ell(g, 19.5, 12.5, 16, 10.5, 'h');
    ell(g, 19.5, 12.5, 15, 9.5, 'm');
    ell(g, 19.5, 2.5, 7, 1.6, 'M');                    // the crag behind the bound admiral
    fill(g, 16, 22, 23, 23, 's');
    fill(g, 19, 22, 20, H - 2, 'j');
    return g;
  }
  var K_OBJ = [{ id: 'kl_jong', type: 'jong5', x: 21, y: 25, w: 5, h: 3, tex: 'jong_majapahit' }];
  LC.C5.obor.forEach(function (t, i) { K_OBJ.push({ id: 'kl_obor' + i, type: 'obor5', i: i, x: t.x, y: t.y, tex: 'obor_batu' }); });
  LC.AREAS.kelam = {
    name: 'Pulau Kelam', sub: 'the island of shadow', lvl: 20, build: buildKelam, objects: K_OBJ,
    pond: 'sea', amb: 'wind', decor: { n: 26, types: ['rock', 'rubble', 'stalagmite', 'rubble'], on: 'm' },
    critters: [], cave: true,
    enemies: [
      { kind: 'sikelam', n: 1, zone: { x0: 16, y0: 9, x1: 23, y1: 14 }, when: function () { var S = LC.State.s; return c5(S) === 4 && !q(S).c5witch; } },
      { kind: 'maklampir', n: 1, zone: { x0: 15, y0: 8, x1: 24, y1: 14 }, when: function () { var S = LC.State.s; return c5(S) === 4 && !!q(S).c5witch; } },
      { kind: 'kelam', n: 4, zone: { x0: 8, y0: 6, x1: 31, y1: 19 }, when: function () { return c5(LC.State.s) === 4; } }
    ],
    exits: [], home: { x: 19.5, y: 22 }, ride: {}
  };

  // ================================================================ new faces
  function look(shirt, hat, extra) { return Object.assign({ skin: '#a8714a', shirt: shirt, shirt2: shirt, bottom: '#5a4a3a', bottom2: '#40342a', hair: '#1a1210', hat: hat }, extra || {}); }
  var GIFTS = { 3: ['kain_batik', 1], 6: ['damar', 3], 10: ['kepeng', 1000] };
  Object.assign(LC.VILLAGERS, {
    empu: {
      name: 'Empu Lintang', role: 'The old lamp-maker of the Majapahit court', area: 'jawa', post: { x: 32, y: 16 },
      look: look('#4a3a2a', 'tanjak', { skin: '#9a6440', hair: '#e8e4dc', beard: '#e8e4dc', bottom: '#6a4a2a', bottom2: '#4a3420' }),
      intro: ['Hmm? A visitor from across the sea, with a little light floating at their shoulder. Sit, sit. I am Lintang. They call me Empu, because I am old and I make lamps.'],
      chat: ['A lamp is a little piece of the sun that you are allowed to keep.', 'My hands shake now, but not when I work.', 'Never trust a lamp-maker who works in the dark.', 'Brass from Barunai rings like a bell. The best.'],
      tasks: [['damar', 1, 2], ['kelapa', 1, 2], ['madu_tualang', 1, 1]], taskText: 'for his lamps', gifts: GIFTS,
      hideIf: function (S) { return c5(S) < 3; }
    },
    kebo: {
      name: 'Kebo Taruna', role: 'A former admiral, now a harbour hand', area: 'jawa', post: { x: 26, y: 25 },
      look: look('#6a5a4a', 'none', { skin: '#9a6440', hair: '#2a1a10', beard: '#2a1a10', bottom: '#8a3a2a', bottom2: '#6a2a1e' }),
      intro: ['You. Of all the people to walk down this jetty... Please, do not be afraid. The dark has gone out of me. You saw to that.',
        'The king took away my ships and my title, and gave me a rope and a crate. It is honest work. I sleep at night now.'],
      chat: ['If you ever hear an old woman cackling at night, light a lamp. A big one.', 'I wrote to the Penghulu of your kampung. He wrote back. He said "come and thatch my roof again". I think that was a joke.', 'When the lamps go on in the harbour, I always stop and watch.', 'Anger is a door. Be careful what walks through it.'],
      tasks: [['nasi', 1, 2], ['ikan_bakar', 1, 2]], taskText: 'for the harbour crew', gifts: { 3: ['kepeng', 400], 6: ['celengan', 1], 10: ['kepeng', 1200] },
      hideIf: function (S) { return c5(S) < 5; }
    }
  });
  LC.SPEAKERS = Object.assign(LC.SPEAKERS || {}, {
    wira: { name: 'Juragan Wira', portrait: 'wira_0' },
    kelam: { name: 'Si Kelam', portrait: 'sikelam_face' },
    maklampir: { name: 'Mak Lampir', portrait: 'maklampir_face' },
    pelita: { name: 'Pelita', portrait: 'ghost' }
  });

  // ================================================================ the story, in their words
  LC.CH5TEXT = {
    dark: [
      { text: 'One by one, the lights of Nenek\'s farm gutter and go out: the pelita torches, the lamp in the spirit house, even the fireflies. A cold wind blows in from the sea.' },
      { text: 'Shadows peel away from the walls and slide across the yard. Pelita gives a tiny cry, and its light shrinks to a flicker.' },
      { who: 'kelam', text: '...so small... so bright... I will drink it all...' },
      { text: 'Far out over the sea, a thin old voice cackles. Then the wind snatches it away.' },
      { text: '✦ Chapter 5: Bayang Hitam (Black Shadow) ✦  Drive the shadows away from Nenek\'s farm!' }
    ],
    gone: [
      { text: 'The last shadow shrieks and shatters. Where it fell lies a shard of darkness, colder than ice. You pick it up carefully.' },
      { who: 'pelita', expr: 'sad', text: '...co... cold... (Pelita\'s light is thin and pale. It huddles close to you, shivering.)' },
      { text: 'These are not shadows of Borneo. The sailors on the Majapahit jong at Nenek\'s jetty have sailed the whole sea: perhaps they know what this shard is.' }
    ],
    wira: [
      { who: 'wira', text: 'Show me that... Aduh! A shard of Si Kelam! My grandmother told us about it when we were small: a shadow from the old days that drinks light. Lamps, stars, little spirits. It is never full.' },
      { who: 'wira', text: 'And there is worse. After the battle here, the king sent Kebo Taruna to guard Pulau Kelam, a black rock far out at sea. Ships that pass it now say no lamp burns there, and his boat flies a black sail.' },
      { who: 'wira', text: 'And a fisherman from Tuban swears he saw an old woman on that rock, with wild white hair down to her knees, cackling at the moon. If that is Mak Lampir, then this is black magic. They say she keeps shadows the way other people keep dogs.' },
      { who: 'wira', text: 'If she has found Kebo Taruna\'s anger, she has found a door to walk through. And now she wants your Pelita, the brightest little light on these shores.' },
      { who: 'wira', text: 'Only one person can help: Empu Lintang, the old lamp-maker of the king\'s court. He is older than my grandmother. I will sail you to Java whenever you are ready.' },
      { who: 'wira', text: 'But not before your farm is safe. The shadows will come every night now. Ask your carpenter for guard lamps: brass on good wood, burning all night long.' }
    ],
    sailJava: [
      { text: 'The jong raises its sails. Past the river mouth the sea heaves, and the Naga rises beside the hull. It nudges the jong with its great head, and the wind fills the sails.' },
      { text: 'With the Naga swimming beside you, the voyage passes like a dream. Soon a long green coast rises out of the sea, with red-brick walls and terracotta roofs: Java.' }
    ],
    arrive: [{ text: '✦ The harbour of Majapahit ✦  Red-brick gates, terracotta roofs, and a great pool shining in the sun. The king\'s pavilion stands at the top of the avenue.' }],
    king: [
      { who: 'raden', text: 'The friend of Barunai, in Majapahit! You are welcome here. But your little spirit is so pale... So the stories from Pulau Kelam are true.' },
      { who: 'raden', text: 'I sent Kebo Taruna to that rock to think about what he had done. I did not know that something else lived there, in the dark. That is my fault too.' },
      { who: 'raden', text: 'Go to Empu Lintang, at his workshop past the great pool. If anyone in Java knows how to save a light, it is him. Whatever he needs, the court will pay.' }
    ],
    empu: [
      { who: 'empu', text: 'Let me see this little one... Ah. Ahh. I know this light. I have not seen it for seventy years.' },
      { who: 'empu', text: 'When I was a boy, my master made a lamp for a trader from Borneo: a little brass lamp whose flame never went out. One night the flame climbed out of the lamp and floated away into the trees. My master laughed until he cried. "It has gone to find a home," he said.' },
      { who: 'empu', text: 'It found one, I see. With your Nenek, and now with you.' },
      { who: 'empu', text: 'And now Mak Lampir wants it. Hmph. I know that name. Long ago she came to my master\'s workshop, wanting a lamp that could hold a stolen light: a light that never goes out could keep a witch young forever. My master threw her out.' },
      { who: 'empu', text: 'Her shadow, Si Kelam, is drinking its light a little more every night. To save it, I will make a new lamp: a Pelita Purnama, a full-moon lamp. Inside it, Pelita\'s light can grow so bright that no shadow could ever swallow it.' },
      { who: 'empu', text: 'Bring me three things. Three Kendi Tembaga, brass from the smiths of Barunai, for the body. A Cahaya Bunian, a light from the hidden folk: they know how to wash a shadow shard clean. And two lumps of damar resin, from the old damar tree in Hutan Rimba, for the flame.' }
    ],
    batin: [
      { who: 'tokbatin', text: 'Shadow shards? Give them here, child. We wash them in the stream under the moon, and sing to them, and slowly they remember that they were light once.' },
      { who: 'tokbatin', text: 'There. A Cahaya Bunian. Carry it gently, and do not let it get lonely.' }
    ],
    forge: [
      { who: 'empu', text: 'Brass from Barunai, light from the Bunian, damar from the forest. Good. Now sit, and watch an old man work.' },
      { text: 'Empu Lintang works all afternoon, tapping and polishing and humming to himself. At last he holds up a little brass lamp, round as a full moon. When he lights the damar, the flame is exactly the colour of Pelita.' },
      { who: 'empu', text: 'The Pelita Purnama. It is not quite finished: the last part of it is Pelita itself. Take it to Pulau Kelam, and light the four old stone torches on the island. In the light, Si Kelam will have nowhere to hide.' },
      { who: 'empu', text: 'When the shadow is weak, Pelita will know what to do. Juragan Wira will sail you there. Go before the moon wanes.' }
    ],
    sailKelam: [
      { text: 'The jong sails into a black fog. The stars go out, one by one. Even the Naga will not come near: it circles far behind you, its eyes glowing like lanterns.' },
      { text: 'The hull bumps against an old wooden jetty. Pulau Kelam: bare black rock, four cold stone torches, and silence.' }
    ],
    island: [
      { who: 'kelam', text: 'You brought it to me. How kind.' },
      { who: 'maklampir', text: '(cackling, high on the crag) Heh-heh-heh! Good shadow, Kelam! Fetch me that little light, and Mak Lampir will stay young for a thousand years!' },
      { who: 'laksamana', text: '(bound in shadow beside her) Go back! She has whispered in my ear since the night of the cockfight. Every night: you were cheated, you were cheated... Forgive me, and go back!' },
      { text: 'A towering shadow rises from the rocks. Your blade would pass straight through it: light the four stone torches with the Pelita Purnama first!' }
    ],
    witch: [
      { text: 'Si Kelam shrieks and bursts into cold sparks. From the crag comes a furious screech.' },
      { who: 'maklampir', text: 'My shadow! My lovely shadow! Wretched little farmer... Then Mak Lampir will take the light herself!' },
      { text: 'The witch leaps down from the crag, her white hair flying. Her black magic can snuff the torches out: whenever one goes dark, light it again, and strike her while all four burn!' }
    ],
    lit: [{ text: 'The fourth torch roars into flame. Caught in the light from every side, Si Kelam shrinks and hisses. Now it has a shape you can strike!' }],
    finale: [
      { text: 'Mak Lampir staggers back against the rocks. Then Pelita darts into the Pelita Purnama, and the little brass lamp blazes up like a full moon rising over the sea.' },
      { text: 'Light pours over the island. Mak Lampir shields her eyes and shrieks. Her black magic unravels like old thread, and the shadows around Kebo Taruna melt away.' },
      { who: 'maklampir', text: 'Too bright! TOO BRIGHT! This is not the last you will see of Mak Lampir, little light!' },
      { text: 'In a puff of black smoke, the witch turns into a small, bad-tempered bat and flaps away over the dark sea. Her cackle grows fainter, and fainter, and is gone.' },
      { who: 'pelita', expr: 'happy', text: '...Kawan. (Pelita floats out of the lamp, round and bright as the moon. Its light is warmer than it has ever been.)' },
      { who: 'laksamana', text: 'Her voice is gone from my head... It was her all along: at Barunai, on the night I sailed on your kampung, and here. She fed my anger until I could hear nothing else.' },
      { who: 'laksamana', text: 'That is no excuse: I listened. I will go home to Java and serve the king however he wishes, even if he only lets me carry crates at the harbour.' },
      { text: '✦ Chapter 5: Bayang Hitam, complete! Pelita is now Pelita Purnama, the Full Moon Spirit. (+8000 kepeng, +20 max health) Mak Lampir has fled, and the shadows are gone from the farm and the kampung. ✦' }
    ],
    wilt: 'In the night, shadows crept over the field and drank the water from {n}. (Tukang Leong\'s guard lamps would keep them away.)'
  };
})(window.LC);
