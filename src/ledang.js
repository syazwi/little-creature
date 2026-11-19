/* Little Creature — Chapter 6: Puteri Gunung Ledang (v2.4). It begins after Chapter 5, on the same save.
 * Nenek comes home at last. That night Mak Lampir (this game's own version of the witch; see bayang.js), still a bat,
 * spends her last spell on revenge: Nenek falls into a sleep she cannot wake from. Seventy years ago, a little girl
 * from Borneo chased a lost light up Gunung Ledang while the witch was hunting it; the princess of the mountain sent
 * the witch away, Hang Tuah carried the girl down, and the light went home with her: Pelita.
 *  0 (a day after Chapter 5) Nenek comes home   1 that night, the curse (Nenek's diary)   2 sail to Gunung Ledang
 *  3 Hang Tuah, guardian of the mountain (legend says he never died): a friendly silat test, three touches
 *  4 Puteri Gunung Ledang's demands again, but paid by love: a jar of happy tears (the Penghulu, Pak Mat, Pak Lah,
 *    Tukang Leong), a bridge of gold and silver over her stream (Leong, and the whole kampung), 3 young areca nuts
 *  5 the Bunga Ledang: Mak Lampir attacks, Hang Tuah fights beside you; the princess takes her magic away for good
 *  6 home with the flower   7 Nenek wakes, and stays on the farm for good.
 * Optional: a friendly spar with Hang Jebat, who in this telling made peace with Tuah instead of dying.
 * No gore (the princess's cruellest old demand is never named), no religion; the Sultan is only a proud king. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  function addItems(map) { Object.keys(map).forEach(function (id) { var it = map[id]; it.id = id; it.icon = it.icon || 'i_' + id; LC.ITEMS[id] = it; }); }
  addItems({
    diari_nenek: { name: 'Diari Nenek', kind: 'treasure', desc: 'Nenek\'s old diary, soft with age. A dried flower marks the page about Gunung Ledang.' },
    pinang_muda: { name: 'Pinang Muda', kind: 'treasure', sell: 15, desc: 'A young green areca nut from the palms of Gunung Ledang.' },
    bunga_ledang: { name: 'Bunga Ledang', kind: 'treasure', desc: 'A flower from the princess\'s garden. It glows like a little sunrise, and one petal wakes anyone from any spell.' },
    selendang_puteri: { name: 'Selendang Puteri', kind: 'treasure', sell: 1500, desc: 'A silk shawl as light as mountain mist, a gift from the princess of Gunung Ledang.' }
  });
  function q(S) { return (S && S.quests) || {}; }
  function c6(S) { return q(S).ch6 || 0; }
  function isNight(S) { return S.minutes >= 19 * 60 || S.minutes < 5 * 60; }
  LC.ch6Step = function () { return c6(LC.State.s); };

  // ================================================================ enemies: the witch again, and two friendly duels
  Object.assign(LC.ENEMIES, {
    lampir6: { name: 'Mak Lampir', hp: 80, speed: 26, dmg: 11, sight: 220, w: 8, boss: true, drop: [] },
    pendekar_hangtuah: { name: 'Hang Tuah', hp: 999, speed: 30, dmg: 4, sight: 160, w: 6, drop: [] },   // (a duel counts touches, not health)
    pendekar_jebat: { name: 'Hang Jebat', hp: 999, speed: 34, dmg: 4, sight: 160, w: 6, drop: [] }
  });
  LC.C6 = {
    home: { x: 3, y: 9 },                                       // Nenek's pangkin in front of the house
    tears: ['penghulu', 'mat', 'lah', 'leong'],
    bridge: { emas: 2, belian: 6, kayu: 10 }, bridgeKepeng: 3000,
    bridgeTiles: [[33, 10], [34, 10], [33, 11], [34, 11]],
    pinang: [{ x: 4, y: 28 }, { x: 15, y: 22 }, { x: 38, y: 22 }],
    garden: { x0: 26, y0: 3, x1: 40, y1: 8 },
    ally: { x: 31, y: 6 },
    reward1: 5000, reward2: 10000
  };

  // ================================================================ Gunung Ledang
  function grid(W, H, ch) { var g = []; for (var y = 0; y < H; y++) { g.push([]); for (var x = 0; x < W; x++) g[y].push(ch); } return g; }
  function fill(g, x0, y0, x1, y1, ch) { for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) if (g[y] && x >= 0 && x < g[0].length) g[y][x] = ch; }
  function buildLedang() {
    var W = 44, H = 40, g = grid(W, H, 'G');
    fill(g, 0, 0, W - 1, 1, 'M'); fill(g, 0, 0, 1, 33, 'M'); fill(g, W - 2, 0, W - 1, 33, 'M');
    fill(g, 2, 2, W - 3, 9, '.');                      // the princess's garden, above the stream
    fill(g, 2, 2, 6, 6, 'M'); fill(g, 2, 7, 6, 9, 'q');   // the cliff with the waterfall, and its pool
    fill(g, 2, 10, W - 3, 11, 'w');                    // the stream (the bridge crosses it at x 33-34)
    fill(g, 21, 26, 22, 33, 'k'); fill(g, 8, 25, 22, 26, 'k'); fill(g, 8, 15, 9, 24, 'k');   // the path up from the landing
    fill(g, 8, 14, 39, 15, 'k'); fill(g, 33, 2, 34, 9, 'k'); fill(g, 33, 12, 34, 13, 'k');
    fill(g, 0, 34, W - 1, 34, 's'); fill(g, 0, 35, W - 1, 35, 'S'); fill(g, 0, 36, W - 1, H - 1, 'w');
    fill(g, 21, 34, 22, H - 1, 'j');                   // the landing
    return g;
  }
  // the bridge of gold and silver: once Tukang Leong has built it, the stream can be crossed (called before a place is built)
  LC.syncLedang = function () {
    var S = LC.State.s, g = LC.areaGrid('ledang'), ch = q(S).c6bridge ? 'j' : 'w';
    LC.C6.bridgeTiles.forEach(function (t) { g[t[1]][t[0]] = ch; });
  };
  var L_OBJ = [
    { id: 'ld_air_terjun', type: 'bldg', x: 2, y: 2, w: 5, h: 5, tex: 'air_terjun', keep: true, text: 'A waterfall pours off the cliff into a clear, cold pool. The mist from it smells of flowers.' },
    { id: 'ld_astaka', type: 'bldg', x: 36, y: 12, w: 3, h: 1, tex: 'astaka', text: 'The princess\'s pavilion of white wood and gold, leaning out over the stream.' },
    { id: 'ld_pondok', type: 'bldg', x: 11, y: 18, w: 4, h: 3, tex: 'pondok', text: 'Hang Tuah\'s hut. A keris rack, a mat, a pot of tea, and nothing else at all.' },
    { id: 'ld_sign', type: 'signpost', x: 23, y: 33, tex: 'sign', text: 'GUNUNG LEDANG. The path is steep and the mist is thick. Respect the mountain.' },
    { id: 'ld_bunga', type: 'bunga6', x: 37, y: 4, tex: 'bunga_ledang', when: function (S) { return c6(S) >= 4; } },
    { id: 'ld_jong', type: 'jong5', x: 23, y: 36, w: 5, h: 3, tex: 'jong_majapahit' }
  ];
  LC.C6.pinang.forEach(function (t, i) { L_OBJ.push({ id: 'ld_pinang' + i, type: 'pinang6', i: i, x: t.x, y: t.y, tex: 'pokok_pinang' }); });
  function path(S) { var s = c6(S); return s >= 3 && s <= 5; }
  LC.AREAS.ledang = {
    name: 'Gunung Ledang', sub: 'the mountain of the princess', lvl: 20, build: buildLedang, objects: L_OBJ,
    pond: 'stream', amb: 'forest', fog: true, decor: { n: 40, types: ['fern', 'bush', 'hibiscus', 'lalang', 'rock', 'fern'], on: 'G' },
    critters: [{ kind: 'kancil', n: 1, zone: { x0: 26, y0: 18, x1: 40, y1: 30 } }],
    trees: { n: 30, on: 'G', tex: ['pine', 'jtree'], text: 'A mountain pine, beaded with mist.' },
    exits: [], home: { x: 21.5, y: 33 }, ride: {},
    enemies: [
      { kind: 'kelawar', n: 3, zone: { x0: 3, y0: 16, x1: 40, y1: 30 }, when: function (W) { var S = LC.State.s; return path(S) && !W.c6duel && !q(S).c6fight; } },
      { kind: 'kelam', n: 2, zone: { x0: 12, y0: 16, x1: 38, y1: 31 }, when: function (W) { var S = LC.State.s; return path(S) && !W.c6duel && isNight(S); } },
      { kind: 'lampir6', n: 1, zone: LC.C6.garden, when: function () { var S = LC.State.s; return c6(S) === 5 && !!q(S).c6fight; } },
      { kind: 'kelawar', n: 2, zone: LC.C6.garden, when: function () { var S = LC.State.s; return c6(S) === 5 && !!q(S).c6fight; } },
      { kind: 'pendekar_hangtuah', n: 1, zone: { x0: 8, y0: 21, x1: 10, y1: 24 }, when: function (W) { return W.c6duel === 'hangtuah'; } },
      { kind: 'pendekar_jebat', n: 1, zone: { x0: 24, y0: 16, x1: 29, y1: 19 }, when: function (W) { return W.c6duel === 'jebat'; } }
    ]
  };

  // ================================================================ the people of the mountain, and Nenek
  function look(shirt, hat, extra) { return Object.assign({ skin: '#a8714a', shirt: shirt, shirt2: shirt, bottom: '#5a4a3a', bottom2: '#40342a', hair: '#1a1210', hat: hat }, extra || {}); }
  Object.assign(LC.VILLAGERS, {
    hangtuah: {
      name: 'Hang Tuah', role: 'The guardian of Gunung Ledang', area: 'ledang', post: { x: 10, y: 21 },
      look: look('#22224a', 'tanjak_gold', { skin: '#9a6440', hair: '#bdbdb5', beard: '#bdbdb5', bottom: '#c8a040', bottom2: '#a07a28' }),
      intro: ['Stop there, traveller. I am Tuah, guardian of this mountain. Yes, that Tuah. People say I never died. People say a lot of things.',
        'You carry a little moon on your shoulder, and the smell of black magic on your clothes. Before I let you climb to the princess, show me your silat.'],
      chat: ['Takkan Melayu hilang di dunia. I said that once. People still repeat it, which is embarrassing.', 'Silat is a conversation, not a fight.', 'The mist keeps the mountain quiet. I like quiet.', 'Jebat cheats at congkak. Do not tell him I said so.'],
      tasks: [['nasi_lemak', 1, 1], ['ikan_bakar', 1, 2], ['kelapa', 1, 2]], taskText: 'for the guardian\'s supper', gifts: { 3: ['kepeng', 600], 6: ['jamu_kuat', 2], 10: ['kepeng', 1500] },
      hideIf: function (S) { return c6(S) < 3; }
    },
    jebat: {
      name: 'Hang Jebat', role: 'Hang Tuah\'s oldest friend', area: 'ledang', post: { x: 26, y: 17 },
      look: look('#7a1e1a', 'tanjak_red', { skin: '#a8714a', hair: '#2a2a2a', beard: '#5a5a5a', bottom: '#2a2a2a', bottom2: '#1e1e1e' }),
      intro: ['Hang Jebat. Tuah\'s oldest friend, and once his worst enemy. In Melaka we fought, over a great wrong that was done to him. It should have ended with one of us dead.',
        'It did not. He put down his keris, and I put down mine, and we talked until the sun came up. Then we came here, the two of us. Fancy a spar?'],
      chat: ['Tuah snores. Like a buffalo in a well.', 'A friend who tells you that you are wrong is worth ten who agree.', 'I win at congkak because I am clever. Not because I cheat. Mostly.', 'Anger is quick. Making peace is quicker than you think.'],
      tasks: [['ikan_bakar', 1, 2], ['nasi', 1, 2]], taskText: 'for a hungry warrior', gifts: { 3: ['kepeng', 500], 6: ['jamu_kuat', 2], 10: ['kepeng', 1200] },
      hideIf: function (S) { return c6(S) < 4; }
    },
    puteri: {
      name: 'Puteri Gunung Ledang', role: 'The princess of the mountain', area: 'ledang', post: { x: 37, y: 13 }, glow: 0xfff0d0,
      look: look('#f2e8d8', 'flower', { skin: '#e8c4a0', shirt2: '#e9c46a', hair: '#1a1210', bottom: '#e9c46a', bottom2: '#c4922f' }),
      intro: ['...Welcome, child of the little light. I am the princess of this mountain. Kings have called me many things. You may call me Puteri.'],
      chat: ['The mist remembers everyone who climbs this mountain.', 'A gift that is demanded is not a gift.', 'Your Nenek was a very brave little girl. She bit the witch.', 'Tuah and Jebat argue every evening. It is the most peaceful sound in the world.'],
      tasks: [['melati', 2, 3], ['marigold', 2, 3]], taskText: 'for her garden', gifts: { 3: ['herba', 4], 6: ['kepeng', 800], 10: ['selendang_puteri', 1] },
      hideIf: function (S) { return c6(S) < 4; }
    },
    nenek: {
      name: 'Nenek', role: 'Your grandmother, home at last', area: 'farm', post: { x: 3, y: 9 },
      look: look('#7a4a8a', 'none', { skin: '#b8875a', shirt2: '#5a3a6a', hair: '#e8e4dc', bottom: '#4a3a5a', bottom2: '#3a2a48' }),
      intro: ['Cucu! Sit, sit. Have you eaten? You are still too thin.'],
      chat: ['Eat! You are still too thin.', 'Pelita sleeps in my lap every afternoon. It did that when it was no bigger than a firefly.', 'Tuah carried me down the mountain on his back. He complained the whole way.', 'Seventy years, and that witch still could not take my light.', 'Your field is better than mine ever was. Do not tell the Penghulu I said so.'],
      tasks: [['ubi_rebus', 1, 2], ['kuih_pandan', 1, 1], ['nasi_lemak', 1, 1]], taskText: 'for her tea', gifts: { 3: ['kuih_pandan', 3], 6: ['kepeng', 1000], 10: ['selendang_puteri', 1] },
      hideIf: function (S) { return c6(S) < 7; }
    },
    lampir: {
      name: 'Nek Lampir', role: 'An ordinary old woman who grows herbs', area: 'ledang', post: { x: 5, y: 30 },
      look: look('#5a5a4a', 'none', { skin: '#a88a6a', hair: '#ecebe4', bottom: '#3e3a30', bottom2: '#2e2a22' }),
      intro: ['What do you want? ...No, I am not going to curse you. I cannot even curse a mosquito now. The princess saw to that.',
        'I grow herbs. They are surprisingly difficult. If you want some, you will pay, like everybody else. ...Hmph. Thank you for asking nicely.'],
      chat: ['Herbs do not care who you used to be. I find that restful.', 'Do not tell your Nenek I said so, but she was a brave little girl.', 'Hmph.', 'Tuah brings me soup. I pretend not to like it.'],
      tasks: [['kuih_pandan', 1, 1]], taskText: 'for a grumpy old neighbour', shop: ['herba', 'jamu_kuat'], gifts: { 3: ['herba', 5], 6: ['jamu_kuat', 2], 10: ['kepeng', 600] },
      hideIf: function (S) { return c6(S) < 7; }
    }
  });

  // ================================================================ the story, in their words
  LC.CH6TEXT = {
    home: [
      { text: 'A sampan bumps against the jetty. A small old woman in a purple baju kurung climbs out, slowly, with a cloth bundle under her arm, and looks up at the farm for a long, long moment.' },
      { who: 'nenek', text: 'Cucu! Look at you! Taller, browner, and still too thin. Come here, let me hold you.' },
      { who: 'nenek', text: 'The doctors in town finally said I am strong enough to visit. And look at my farm: a reban full of hens, a field full of rice, and the whole kampung talking about you.' },
      { who: 'pelita', expr: 'happy', text: '!!! (Pelita shoots out of the spirit house and spins round and round Nenek\'s head, shining like the full moon.)' },
      { who: 'nenek', text: 'Pelita! Oh, how bright you are now! When I found you, you were no bigger than a firefly, hiding in the ferns on Gunung Ledang... but that is a long story. Tonight we sit on the pangkin, like the old days, and I will tell it.' },
      { text: '✦ Chapter 6: Puteri Gunung Ledang ✦  Nenek is home! Spend the day with her on the farm.' }
    ],
    visit: ['Tonight we sit on the pangkin and I tell you the story of Gunung Ledang. Bring something to eat.', 'You kept my reban full and my field green. I always knew you would.', 'Pelita will not leave me alone! It keeps checking I am still here.', 'Mak Ani\'s kuih are still the best in the kampung. Do not tell her I said so.'],
    night: [
      { text: 'Night falls. Nenek sits on the pangkin in front of the house, humming an old song, with Pelita curled up in her lap.' },
      { text: 'Then a small, bad-tempered bat flaps out of the dark and lands on the roof. It cackles.' }
    ],
    morning: [{ text: 'In the morning, Nenek is asleep on the pangkin in front of the house, and she does not wake when you call. On the roof sits a small, bad-tempered bat. It cackles.' }],
    curse: [
      { who: 'maklampir', text: 'Heh-heh-heh! So THIS is the little girl who stole my light, seventy years ago! All grown old and soft.' },
      { who: 'maklampir', text: 'You broke my magic, farmer, but a witch always keeps one last spell. Sleep, old woman. Sleep, and never wake!' },
      { text: 'A thread of violet smoke curls from the bat\'s mouth and wraps around Nenek. The bat cackles once more, and flaps away into the dark.' },
      { who: 'pelita', expr: 'sad', text: '...Nenek? ...Nenek! (Pelita tugs at her sleeve, glowing as bright as it can. She does not wake.)' },
      { text: 'Nenek\'s cloth bundle has fallen open on the pangkin. Inside is an old diary, its cover soft with age. It falls open at a page marked with a dried flower.' },
      { name: 'Nenek\'s diary', text: '"Gunung Ledang. Today I chased a little lost light up the mountain, into the mist. An ugly old witch was hunting it too. A princess made of moonlight sent her away, and a warrior with grey hair carried me down on his back. The light came home with me. I will call it Pelita."' },
      { name: 'Nenek\'s diary', text: '"The princess said: if ever the witch comes back, come to the mountain. A flower grows in her garden that can wake anyone from any spell."' },
      { text: '✦ Nenek is under Mak Lampir\'s curse. Sail to Gunung Ledang on the Majapahit jong, and find the princess of the mountain. ✦' }
    ],
    asleep: 'Nenek is fast asleep under a batik cloth. Pelita has curled up by her pillow and will not leave her.',
    sail: [{ text: 'Juragan Wira turns the jong west, across the sea to the long green coast of the peninsula. Above the jungle rises a great blue mountain, its top wrapped in mist: Gunung Ledang.' }],
    arrive: [{ text: '✦ Gunung Ledang ✦  Mist drifts between the pines. Far above, a waterfall sings. Somewhere up the path, someone is practising silat.' }],
    duelStart: { hangtuah: 'Three touches. No more, no less, and nobody gets hurt. Begin!', jebat: 'Three touches, friend. Try to keep up!' },
    duelLose: { hangtuah: 'Three touches to me. Breathe, stand properly, and try again. Silat is a conversation, not a fight.', jebat: 'Ha! Too slow! Again, whenever you like.' },
    tuahWin: [
      { who: 'hangtuah', text: 'Hah! Good. Your heart is quicker than your feet, but your feet will learn. Sit a moment, and I will tell you a story.' },
      { who: 'hangtuah', text: 'Long ago, my Sultan in Melaka wished to marry the princess of this mountain. He sent me to ask for her hand. I climbed for days through the mist, and in her garden she gave me her answer.' },
      { who: 'hangtuah', text: 'She asked for a bridge of gold and a bridge of silver, all the way from Melaka to Gunung Ledang. Seven trays of mosquito hearts. Seven trays of the hearts of germs. A jar of tears. A jar of the juice of young areca nuts. And one more thing, so cruel that no father could ever give it.' },
      { who: 'hangtuah', text: 'It was her way of saying no without shaming a king. My Sultan understood, in the end. I did not go back. I stayed, to guard the mountain and the princess who was wise enough to refuse him.' },
      { who: 'hangtuah', text: 'And seventy years ago, I carried a crying little girl down this mountain on my back. She was holding a light no bigger than a firefly. Your Nenek. Go up the path, to the stream. The princess is expecting you.' }
    ],
    jebatWin: [{ who: 'jebat', text: 'Ha! You fight like Tuah: far too polite. Here, take a little of my strength, and all of my respect. (+5 strength, +1500 kepeng)' }],
    ask: [
      { who: 'puteri', text: 'I know. The mist told me. Mak Lampir has hated your Nenek since the night that little girl took the light the witch was hunting. A light that never goes out could keep a witch young forever. Pelita chose a child instead.' },
      { who: 'puteri', text: 'The Bunga Ledang grows in my garden across the stream. One petal wakes anyone from any spell. But my bridge washed away long ago, and the flower only opens for someone who comes with gifts.' },
      { who: 'puteri', text: 'Once, a Sultan asked for my hand, and I asked him for impossible things: a bridge of gold and silver, a jar of tears, the juice of young areca nuts... He could not buy them. Let us see if love can.' },
      { who: 'puteri', text: 'Bring me a jar of tears, but happy ones, from the people who love your Nenek. Build me a bridge of gold and silver across my stream. And bring me three young areca nuts from the palms on this mountain.' },
      { who: 'puteri', text: '(she smiles) And seven trays of mosquito hearts? No, no. I only asked the Sultan for those because I knew he would never find them.' }
    ],
    tears: {
      penghulu: 'Your Nenek? Under a witch\'s curse? (He wipes his eyes.) When I was a boy, she patched my sarong every year before the Pesta, and pretended not to see the holes I made climbing trees. ...Hm. Here: one tear, for her jar.',
      mat: 'Nenek taught me to mend nets when I was six. She laughed at my knots for a whole year. (He sniffs.) Take it, take it. And tell her Mat is waiting to hear her laugh again.',
      lah: 'She gave me my very first hen. Did you know that? A scruffy brown thing called Comel. Oh dear... (a tear rolls down his nose) There. For the jar.',
      leong: 'When I came to this kampung with nothing but a saw, your Nenek fed me nasi lemak every morning for a month. (Leong blows his nose, loudly.) For the jar. And I will build her bridge.'
    },
    gifts: [
      { who: 'puteri', text: 'A jar of tears that taste of laughter. A bridge that a whole kampung built together. Young areca nuts, picked by your own hand. A Sultan could not buy these things. You were given them.' },
      { who: 'puteri', text: 'Cross your bridge, child. The Bunga Ledang is waiting for you in my garden.' }
    ],
    fight: [
      { text: 'As you reach for the Bunga Ledang, the garden goes cold. Bats pour out of the pines, and a familiar cackle rings across the mountain.' },
      { who: 'maklampir', text: 'Heh-heh-heh! Did you think I would let you wake her? I have waited seventy years for this mountain to lose its little light!' },
      { text: 'Mak Lampir rises out of the mist, her stick blazing violet. She has scraped together some magic from somewhere.' },
      { who: 'hangtuah', text: '(running up the path) Not on my mountain, witch! Friend, together!' },
      { text: 'When a violet circle appears under your feet, step out of it! And when she drinks the light, keep your nerve.' }
    ],
    beaten: [
      { text: 'Mak Lampir staggers. Hang Tuah knocks the stick from her hand, and Pelita\'s full-moon light washes over her.' },
      { text: 'The mist parts. The princess walks across the bridge, and the witch shrinks back from her.' },
      { who: 'puteri', text: 'Enough, Lampir. Seventy years of hunting little lights, of feeding on anger and taking what you could not earn. Give it back.' },
      { text: 'The princess holds out her hand. Thread by thread, the black magic unwinds from Mak Lampir like old cotton from a spindle, and drifts away into the mist.' },
      { who: 'maklampir', text: '...My magic. My beautiful magic. (Without it, she is only a small, tired old woman with wild white hair.) What am I now?' },
      { who: 'puteri', text: 'Only Lampir. An old woman who can still learn to grow herbs, and to say sorry. Stay on the lower slopes, if you like. The mountain is patient.' },
      { text: 'The princess picks a single Bunga Ledang and places it in your hands. It glows like a little sunrise.' },
      { who: 'puteri', text: 'Go home, child of the little light. Your Nenek has slept long enough.' }
    ],
    wake: [
      { text: 'You lay the Bunga Ledang on Nenek\'s pillow. Its petals open one by one, and a warm golden light spreads over the pangkin.' },
      { text: 'Nenek\'s eyelids flutter. She yawns, enormously, and sits up.' },
      { who: 'nenek', text: '...Cucu? Why is everybody staring at me? Did I fall asleep in the middle of my story again?' },
      { who: 'pelita', expr: 'happy', text: '!!! (Pelita bursts into light and spins round and round Nenek\'s head.)' },
      { who: 'nenek', text: 'A Bunga Ledang? You climbed the mountain? You met her... and that grumpy old warrior, still guarding the path? (She laughs until she cries.)' },
      { who: 'nenek', text: 'I am not going back to town, cucu. I have decided. I want to grow old on my own farm, with my own cucu and my own little light. If you will have me.' },
      { text: '✦ Chapter 6: Puteri Gunung Ledang, complete! Nenek has come home for good. (+10000 kepeng, +20 max energy) ✦' }
    ]
  };
})(window.LC);
