/* Chapter 17: Penyamun Empat Puluh? (v3.17). An original kampung comedy that borrows only from the old Ali Baba
 * folktale (the owner asked for the spirit of a Malaysian comedy film; the cast, places, jokes and the cave's voice
 * password, which the owner chose, are our own). Things vanish from Kampung Tepian with a note from "the Forty", but
 * Jusoh counts only four pairs of footprints. Ali Baba, a shy firewood man, saw four masked men open a cliff at Bukit
 * Kapur with a mantera. You say it yourself (into the microphone, or by tapping the words), step inside... and the rock
 * slams shut. Tok Batu, the door's guardian, wants today's word in the gang's secret code: find the word (DODOL), the
 * Roda Rahsia (a cipher wheel) and the key (4, how many they really are, not 40), then ENCRYPT it: HSHSP. Kopak's coded
 * diary tells you their plan: jars of "honey" for Kampung Tepian, with thieves inside. Find the three jars, then duel
 * Panglima Garong. Nobody is hurt; the four become the kampung's night watchmen.
 * Steps (S.quests.ch17): 0 rest after Chapter 16 · 1 Tok Penghulu's news · 2 Ali Baba at the farm · 3 hide at Bukit
 * Kapur · 4 say the mantera · 5 stuck in the cave · 6 warn Tok Penghulu · 7 the twelve jars · 8 the duel · 9 done. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var C = LC.C17 = {
    end: 9, key: 4, word: 'DODOL', tries: 3,
    ready: function (S) { return !!(S && S.quests && LC.C16 && LC.C16.step(S) >= LC.C16.end); },
    step: function (S) { return (S && S.quests && S.quests.ch17) || 0; },
    mantera: 'Niat enson matakaji semar ngiseng',
    words: ['Niat', 'enson', 'matakaji', 'semar', 'ngiseng'],
    decoys: ['Bijan', 'jagung'],
    gang: ['garong', 'kopak', 'senget', 'kecik'],
    // the twelve jars in front of the gelanggang (the "forty"), three with a thief inside
    jars: [[10, 21], [12, 21], [14, 21], [16, 21], [18, 21], [20, 21], [10, 23], [12, 23], [14, 23], [16, 23], [18, 23], [20, 23]],
    thief: { 2: 'kopak', 7: 'senget', 10: 'kecik' },
    arena: { x0: 8, y0: 17, x1: 23, y1: 25 },
    door: { x: 16, y: 7 },   // where you stand outside the cliff door at Bukit Kapur
    // Kopak's diary, written in the gang's code (each letter four along)
    diary: [
      ['KAMI MALU NAK BALIK', 'We are too ashamed to go home.'],
      ['LOMBONG TUTUP DUIT HABIS', 'The mine closed. The money is gone.'],
      ['MALAM INI TEMPAYAN KE KAMPUNG TEPIAN', 'Tonight: the jars go to Kampung Tepian.'],
      ['AMBIL TABUNG KAMPUNG', 'Take the kampung fund.']
    ]
  };
  // the gang's code: every letter moves k places along the alphabet (and back again with -k)
  C.shift = function (s, k) {
    k = ((k % 26) + 26) % 26;
    return String(s).toUpperCase().replace(/[A-Z]/g, function (ch) { return String.fromCharCode((ch.charCodeAt(0) - 65 + k) % 26 + 65); });
  };
  C.code = C.shift(C.word, C.key);   // HSHSP
  function st(S) { return C.step(S); }
  function map(S, k) { return (S.quests && S.quests[k]) || {}; }
  C.count = function (S, k) { return Object.keys(map(S, k)).length; };
  C.triesLeft = function (S) { var t = S.quests.c17tries; return t === undefined ? C.tries : t; };
  function between(a, b) { return function (S) { var s = st(S); return s >= a && s <= b; }; }
  function done(S) { return st(S) >= C.end; }

  // ---------------------------------------------------------------- the farm: Ali Baba and his squeaky bicycle
  LC.OBJECTS.push(
    { id: 'f_alibaba17', type: 'penyamun_ali', x: 36, y: 9, tex: 'npc17_alibaba_0', keep: true, when: function (S) { return st(S) === 2 || done(S); } },
    { id: 'f_basikal17', type: 'bldg', x: 35, y: 9, tex: 'basikal17', keep: true, when: function (S) { return st(S) === 2 || done(S); },
      text: 'Ali Baba\'s old bicycle, with a bundle of firewood tied on the back. The bell has not rung since 1987, but the chain squeaks enough for both.' }
  );

  // ---------------------------------------------------------------- Kampung Tepian
  LC.AREAS.kampung.objects.push(
    { id: 'k_tokp17', type: 'penyamun_tokp', x: 16, y: 21, tex: 'npc_penghulu_0', keep: true, when: function (S) { var s = st(S); return s === 1 || s === 6; } },
    { id: 'k_tokp17b', type: 'penyamun_tokp', x: 23, y: 22, tex: 'npc_penghulu_0', keep: true, when: between(7, 8) },
    { id: 'k_alibaba17', type: 'penyamun_ali', x: 22, y: 24, tex: 'npc17_alibaba_0', keep: true, when: between(7, 8) },
    { id: 'k_saudagar17', type: 'penyamun_saudagar', x: 21, y: 22, tex: 'npc17_saudagar_0', keep: true, when: function (S) { return st(S) === 7; } },
    { id: 'k_kereta17', type: 'bldg', x: 20, y: 24, w: 2, h: 1, tex: 'kereta17', keep: true, when: between(7, 8),
      text: 'Datuk Saudagar\'s cart. Painted on the side, in gold: "FORTY JARS OF THE FINEST HONEY". Somebody has crossed out "FORTY" and written "12".' }
  );
  C.jars.forEach(function (j, i) {
    LC.AREAS.kampung.objects.push({ id: 'k_jar17_' + i, type: 'penyamun_jar', i: i, x: j[0], y: j[1], tex: 'tempayan17', keep: true,
      when: function (S) { var who = C.thief[i]; return st(S) === 7 && !(who && map(S, 'c17caught')[who]); } });
  });
  [['kopak', 19], ['senget', 20], ['kecik', 21]].forEach(function (t) {   // caught under Pak Mat's fishing net
    LC.AREAS.kampung.objects.push({ id: 'k_jaring17_' + t[0], type: 'penyamun_caught', who: t[0], x: t[1], y: 25, tex: 'jaring17_' + t[0], keep: true,
      when: function (S) { var s = st(S); return (s === 7 || s === 8) && !!map(S, 'c17caught')[t[0]]; } });
  });
  [['garong', 29], ['kopak', 30], ['senget', 31], ['kecik', 32]].forEach(function (t) {   // afterwards: the kampung's night watchmen
    LC.AREAS.kampung.objects.push({ id: 'k_peronda17_' + t[0], type: 'penyamun_peronda', who: t[0], x: t[1], y: 18, tex: 'npc17_' + t[0] + '_0', keep: true, when: done });
  });

  // ---------------------------------------------------------------- Hutan Rimba: the eastern trail
  LC.AREAS.forest.objects.push({ id: 'fr_kapur17', type: 'penyamun_way', x: 40, y: 27, w: 2, h: 1, tex: 'kapur_gate17', keep: true, when: function (S) { return st(S) >= 3; } });
  LC.AREAS.forest.clear = (LC.AREAS.forest.clear || []).concat([{ x: 40, y: 28, r: 1 }]);   // (no tree where you come back out)

  // ---------------------------------------------------------------- the places
  function grid(w, h, tile) { return Array.from({ length: h }, function () { return new Array(w).fill(tile); }); }
  function fill(g, x0, y0, x1, y1, tile) { for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) if (g[y] && g[y][x] !== undefined) g[y][x] = tile; }
  function ell(g, cx, cy, rx, ry, tile) {
    for (var y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (var x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
      if (!g[y] || g[y][x] === undefined) continue;
      var dx = (x - cx) / rx, dy = (y - cy) / ry;
      if (dx * dx + dy * dy <= 1) g[y][x] = tile;
    }
  }
  // Bukit Kapur: a grey limestone cliff above a little valley, past the eastern trail of Hutan Rimba
  var KP_OBJ = [
    { id: 'kp_pintu17', type: 'penyamun_door', x: 15, y: 5, w: 3, h: 1, tex: 'pintu17_tutup', keep: true },
    { id: 'kp_back17', type: 'penyamun_back', x: 16, y: 22, w: 2, h: 1, tex: 'kapur_gate17', keep: true },
    { id: 'kp_semak17', type: 'penyamun_bush', x: 10, y: 11, w: 2, h: 1, tex: 'semak17', keep: true },
    { id: 'kp_alibaba17', type: 'penyamun_ali', x: 12, y: 12, tex: 'npc17_alibaba_0', keep: true, when: between(3, 6) },
    { id: 'kp_kayu17', type: 'bldg', x: 7, y: 14, tex: 'kayu17', keep: true, text: 'A neat pile of chopped wood, and an old tree with a very good view of the cliff. Ali Baba\'s favourite hiding place.' },
    { id: 'kp_batu0', type: 'bldg', x: 4, y: 8, w: 2, h: 1, tex: 'kapur17', keep: true, text: 'A pillar of grey limestone, streaked with ferns. Rain has carved it like candle wax for a million years.' },
    { id: 'kp_batu1', type: 'bldg', x: 27, y: 14, w: 2, h: 1, tex: 'kapur17', keep: true, text: 'A limestone pillar. Swiftlets dart in and out of the cracks.' },
    { id: 'kp_batu2', type: 'bldg', x: 5, y: 19, w: 2, h: 1, tex: 'kapur17', keep: true, text: 'Limestone. Tap it and it rings, very faintly.' },
    { id: 'kp_batu3', type: 'bldg', x: 26, y: 20, w: 2, h: 1, tex: 'kapur17', keep: true, text: 'A limestone pillar with a monkey on top. The monkey is judging you.' }
  ];
  LC.AREAS.kapur = {
    name: 'Bukit Kapur', sub: 'the limestone hills', lvl: 3, home: { x: 16.5, y: 20 }, pond: 'stream', amb: 'forest',
    decor: { n: 30, types: ['fern', 'rock', 'bush', 'lalang', 'pebbles', 'fern'], on: 'g' },
    trees: { n: 9, on: 'g', tex: ['jtree', 'jtree2'], text: 'A tree clinging to the limestone, its roots like fingers in the rock.' },
    build: function () {
      var g = grid(34, 26, 'g');   // (the bottom rows are jungle, so the trail sign never hides under the toolbar)
      fill(g, 0, 0, 33, 4, 'M');                 // the cliff
      ell(g, 5, 5, 5, 1.6, 'M'); ell(g, 28, 5, 5, 1.8, 'M');
      fill(g, 12, 5, 21, 6, 'm');                // the rock apron in front of the door
      fill(g, 0, 0, 1, 25, 'J'); fill(g, 32, 0, 33, 25, 'J'); fill(g, 0, 23, 33, 25, 'J');
      fill(g, 16, 6, 17, 22, 'p');               // the trail up from Hutan Rimba
      fill(g, 18, 9, 33, 10, 'p');               // the thieves' path, off to the east
      ell(g, 9, 17, 2.4, 1.4, 'q');              // a spring
      return g;
    },
    objects: KP_OBJ, exits: [], ride: { bike: 1 }
  };
  // Gua Empat Puluh: the thieves' cave
  var G_OBJ = [
    { id: 'g17_pintu', type: 'penyamun_batu', x: 14, y: 20, w: 2, h: 1, tex: 'batu17_0', keep: true },
    { id: 'g17_celah', type: 'penyamun_crack', x: 17, y: 20, tex: 'celah17', keep: true, light: 0xfff2c0 },
    { id: 'g17_kapur', type: 'penyamun_chalk', x: 14, y: 3, w: 3, h: 1, tex: 'tulis17', keep: true },
    { id: 'g17_harta', type: 'penyamun_pile', x: 10, y: 7, w: 3, h: 2, tex: 'harta17', keep: true, when: function (S) { return !done(S); } },
    { id: 'g17_senarai', type: 'penyamun_list', x: 4, y: 7, tex: 'senarai17', keep: true },
    { id: 'g17_dapur', type: 'bldg', x: 5, y: 5, w: 2, h: 1, tex: 'dapur17', keep: true, text: 'The thieves\' little stove, and a pot of plain rice, cold. There is no dodol anywhere. Poor Panglima.' },
    { id: 'g17_diari', type: 'penyamun_diary', x: 25, y: 7, tex: 'diari17', keep: true },
    { id: 'g17_tikar', type: 'bldg', x: 23, y: 9, w: 3, h: 1, tex: 'tikar16', keep: true, text: 'Four sleeping mats and four lumpy pillows. A teddy bear sits on the biggest one. It must be Kecik\'s.' },
    { id: 'g17_roda', type: 'penyamun_wheel', x: 8, y: 14, tex: 'roda17', keep: true, when: function (S) { return !map(S, 'c17clue').roda; } },
    { type: 'torch', x: 9, y: 9 }, { type: 'torch', x: 21, y: 9 }, { type: 'torch', x: 12, y: 17 }
  ];
  LC.AREAS.gua17 = {
    name: 'Gua Empat Puluh', sub: 'the thieves\' cave', lvl: 3, home: { x: 14.5, y: 18 }, pond: 'cave', amb: 'cave', cave: true,
    decor: { n: 26, types: ['stalagmite', 'stalagmite', 'rubble', 'cobweb', 'rubble'], on: 'c' },
    enemies: [{ kind: 'kelawar', n: 2, zone: { x0: 3, y0: 14, x1: 9, y1: 18 } }],
    build: function () {
      var g = grid(30, 24, 'X');   // (rock below the door, so Tok Batu never hides under the toolbar)
      ell(g, 15, 16, 6, 3.5, 'c');               // the entrance hall, behind the door
      fill(g, 13, 8, 16, 13, 'c');               // up to the treasure hall
      ell(g, 15, 8, 8, 4.6, 'c');                // the treasure hall, with the chalk wall at the top
      ell(g, 5, 8, 4, 3.5, 'c'); fill(g, 8, 8, 9, 9, 'c');      // the kitchen corner
      ell(g, 25, 8, 4, 3.5, 'c'); fill(g, 21, 8, 22, 9, 'c');   // the sleeping corner
      ell(g, 6, 16, 4, 3, 'c'); fill(g, 9, 15, 10, 16, 'c');    // the bats' tunnel and its pool
      ell(g, 5.5, 16.5, 1.6, 1, 'q');
      return g;
    },
    objects: G_OBJ, exits: [], ride: {}
  };

  // ---------------------------------------------------------------- items and the recipe
  function addItems(m) { Object.keys(m).forEach(function (id) { var it = m[id]; it.id = id; it.icon = it.icon || 'i_' + id; LC.ITEMS[id] = it; }); }
  addItems({
    kapak_alibaba: { name: 'Kapak Ali Baba', kind: 'weapon', dmg: 5, reach: 22, cd: 0.48, sell: 400, desc: 'Ali Baba\'s old woodcutter\'s axe. A sturdy weapon, and with it in your bag, fallen branches give you twice the wood.' },
    roda_rahsia: { name: 'Roda Rahsia', kind: 'treasure', desc: 'Kopak\'s secret wheel: two rings of letters, the inner one turns. Turn it four steps and you can read the gang\'s code. Turn it back to write it.' },
    bijan: { name: 'Bijan', kind: 'produce', price: 12, sell: 6, desc: 'Sesame seeds from Ali Baba\'s little patch across the river. Yes, really. Bijan.' },
    kuih_bijan: { name: 'Kuih Bijan', kind: 'dish', sell: 70, food: { full: 22, joy: 30 }, desc: 'Crunchy sesame cookies, the kind that disappear from the jar at Hari Raya. Ali Baba\'s mother\'s recipe.' }
  });
  LC.FIXED_ITEMS.roda_rahsia = 1;
  var RECIPE = { out: 'kuih_bijan', inp: { padi: 1, bijan: 2, telur: 1 } };
  LC.penyamunRecipe = function (S) {
    var want = !!(S && done(S)), i = LC.RECIPES.indexOf(RECIPE);
    if (want && i < 0) LC.RECIPES.push(RECIPE);
    if (!want && i >= 0) LC.RECIPES.splice(i, 1);
  };
  LC.ENEMIES.garong17 = { name: 'Panglima Garong', texture: 'garong17', hp: 70, speed: 40, dmg: 7, w: 7, sight: 190, boss: true, drop: [] };
  LC.ENEMY_LV.garong17 = 37;

  // ---------------------------------------------------------------- sounds: the rock, the shouting, the jars
  var sfx = LC.Audio.sfx;
  LC.Audio.sfx = function (name) {
    var A = LC.Audio;
    if (['grind17', 'slam17', 'knock17', 'ssst17', 'net17'].indexOf(name) < 0) return sfx.apply(this, arguments);
    if (!A.ctx || A.ctx.state !== 'running' || !A.vol || !A.vol.sfx) return;
    var t = A.ctx.currentTime + 0.01, i;
    if (name === 'grind17') { A.noise(t, 1.1, 0.3, 'lowpass', 500, 180); A.tone(t, 'sawtooth', 55, 40, 1.0, 0.07); for (i = 0; i < 6; i++) A.noise(t + 0.12 + i * 0.15, 0.05, 0.08, 'bandpass', 900); }
    else if (name === 'slam17') { A.noise(t, 0.5, 0.42, 'lowpass', 700, 90); A.tone(t, 'sine', 70, 30, 0.45, 0.3); }
    else if (name === 'knock17') { A.tone(t, 'sine', 260, 200, 0.09, 0.2); A.tone(t + 0.14, 'sine', 250, 190, 0.09, 0.18); }
    else if (name === 'ssst17') A.noise(t, 0.45, 0.12, 'highpass', 4200);
    else { A.noise(t, 0.35, 0.12, 'bandpass', 1400, 600); A.tone(t, 'triangle', 600, 300, 0.25, 0.05); }   // the net, swooshing
  };

  // ---------------------------------------------------------------- who speaks
  LC.SPEAKERS.alibaba17 = { name: 'Ali Baba', portrait: 'npc17_alibaba_0' };
  LC.SPEAKERS.garong17 = { name: 'Panglima Garong', portrait: 'npc17_garong_0' };
  LC.SPEAKERS.kopak17 = { name: 'Kopak', portrait: 'npc17_kopak_0' };
  LC.SPEAKERS.senget17 = { name: 'Senget', portrait: 'npc17_senget_0' };
  LC.SPEAKERS.kecik17 = { name: 'Kecik', portrait: 'npc17_kecik_0' };
  LC.SPEAKERS.saudagar17 = { name: 'Datuk Saudagar', portrait: 'npc17_saudagar_0' };
  LC.SPEAKERS.tokbatu17 = { name: 'Tok Batu', portrait: 'batu17_0' };

  LC.PENYAMUN_TEXT = {
    start: 'Things went missing in Kampung Tepian overnight! Tok Penghulu is waiting at the gelanggang.',
    news: [
      ['penghulu15', 'Abang Zul\'s sacks of gula. Tukang Leong\'s best hammer. The bell from Pak Mat\'s buffalo. Even the brass dulang from the majlis. All gone in one night!'],
      ['', 'Pinned to Tok Penghulu\'s door is a note: "Thank you. From the Geng Empat Puluh."'],
      ['senah14', 'FORTY thieves?! In OUR kampung?!'],
      ['', 'Kak Senah faints, very dramatically, onto Cikgu Bahar.'],
      ['jusoh14', 'I followed the footprints all the way to the river. Er... I only count four. Four pairs.'],
      ['penghulu15', 'Four or forty, we need to find our things. Keep your eyes open, and ask around.'],
      ['', 'Back at your farm, somebody with a very squeaky bicycle is selling firewood...']
    ],
    tokp: { 1: 'Ask around. Somebody must have seen something.', 7: 'Twelve jars, three thieves. Careful, now.', 8: 'Panglima Garong! Be brave, and don\'t hurt him too much.' },
    ali: [
      ['alibaba17', 'Kayu api! Firewood, good and dry! ...Oh. Hello. I am Ali Baba. I chop wood across the river and sell it from my bicycle.'],
      ['sibara15', '(Si Bara sniffs the air.) He smells like smoke! I like him already!'],
      ['alibaba17', 'Smoke, yes. Who would marry a man who smells of smoke?'],
      ['sibara15', 'I would!'],
      ['alibaba17', '...Thank you, little fire. Listen. Something happened at Bukit Kapur, and I have told nobody.'],
      ['alibaba17', 'I was chopping wood when four men in masks came up the trail, carrying sacks. I hid up a tree. The biggest one shouted at the cliff: "Niat enson matakaji semar ngiseng!"'],
      ['alibaba17', 'And the rock... OPENED. In went the sacks. Sacks of gula! A brass dulang! I nearly fell out of my tree.'],
      ['alibaba17', 'Bukit Kapur is past Hutan Rimba, at the end of the eastern trail. I will meet you there. Quietly. Very, very quietly.']
    ],
    aliKapur: {
      3: 'There, the grey cliff. They come back every afternoon. Hide in the bushes, quick!',
      4: '(whispering) You heard him. Say it exactly like he did. Go on, I\'ll keep watch.',
      5: 'Are you still in there? I will think of the word for you! Buka... buka...',
      6: 'You\'re out! I thought the rock had eaten you! Quick, warn the kampung!'
    },
    aliKampung: 'Tap the jars and listen! The honey ones go "tok tok". Thieves go "ssst".',
    aliAfter: [['alibaba17', 'Kayu api, fresh this morning! And a little bijan from my patch. Si Bara says hello. Loudly.']],
    aliTomorrow: [['alibaba17', 'That is all the wood for today. Come back tomorrow morning!']],
    // the thieves at the cliff
    march: '♪ We are the Forty, the fearsome Forty... ♪',
    gang1: [
      ['garong17', 'Halt! Line up! Count off!'],
      ['kopak17', 'One.'],
      ['senget17', 'Two.'],
      ['kecik17', '...Three. Is it dark in there again? I don\'t like the dark.'],
      ['garong17', 'And I am four. We are... the FORTY!'],
      ['kopak17', 'We are four, Panglima.'],
      ['garong17', 'Four... and the forty is on its way. Now stand back!']
    ],
    chant: 'NIAT ENSON MATAKAJI SEMAR NGISENG!',
    gang2: [['', 'GRRRIND! The rock rolls aside. The four thieves carry their sacks into the dark.']],
    gang3: [
      ['', 'A little later they come out empty-handed, and the rock rumbles shut behind them by itself.'],
      ['garong17', 'Tomorrow, the big job! Then we will be rich enough to go home.'],
      ['', 'They march off along the eastern path, singing badly.']
    ],
    hideFirst: 'Hide in the bushes first, or they will see you!',
    door: [['', 'A wall of grey limestone, with a crack shaped like a door. It is not a door you can push.']],
    doorOpen: [['', 'GRRRIND! The rock rolls aside. You step into the dark, with Pelita lighting the way...']],
    doorAfter: [['', 'Tok Batu rumbles hello and rolls aside for you. The cave is yours now.']],
    // stuck in the cave
    stuck: [
      ['', 'BOOM! The rock slams shut behind you.'],
      ['pelita15', '(Pelita glows brighter. It does not like this at all.)'],
      ['', 'Two eyes open in the stone. A grumpy face scowls down at you.'],
      ['tokbatu17', 'Hmph. Visitors. I am Tok Batu, the guardian of this door.'],
      ['tokbatu17', 'From outside, the mantera opens me. From inside, Panglima trusts nobody: you must give me TODAY\'S WORD, written in the gang\'s SECRET CODE.'],
      ['tokbatu17', 'Three wrong tries and I take a nap. A long one.'],
      ['', 'Find today\'s word and the gang\'s code, then encrypt the word yourself. Search the cave!']
    ],
    shouts: ['Buka, jagung!', 'Buka, kacang!', 'Buka... beras?', 'Buka, bijik sawi!'],
    shoutHint: 'Ali Baba is shouting the wrong words outside, and wasting your tries! Send Pelita out through the glowing crack by the door.',
    crack: [
      ['', 'Pelita squeezes through the crack, out into the daylight...'],
      ['alibaba17', '(from outside) Ah! The little light! Am I being too loud? Okay, okay. I will be quiet.'],
      ['alibaba17', '(whispering) ...buka, kerepek?'],
      ['tokbatu17', 'I HEARD THAT.'],
      ['', 'Pelita squeezes back in, glowing very smugly.']
    ],
    crackAfter: [['', 'A thin crack in the rock. Daylight, and the faint sound of Ali Baba humming to himself outside.']],
    nap: 'Tok Batu snores for an hour, then wakes up grumpy. "Three more tries. Think first, this time."',
    list: [['', 'A shopping list, pinned to a sack: "Gula. Beras. Ikan bilis. DODOL. DODOL. DODOL!" The word DODOL is circled three times. Somebody really wants dodol.']],
    chalk: [
      ['', 'Chalk scribbles cover the wall. "PANGLIMA\'S RULES."'],
      ['', '"1. TODAY\'S WORD = WHAT THE PANGLIMA IS CRAVING."'],
      ['', '"2. KUNCI = 40." (The key is 40.)'],
      ['', '"3. AN EXAMPLE, FOR KECIK, WHO KEEPS FORGETTING: BIJAN = FMNER."'],
      ['pelita15', '(Pelita traces the letters with its glow: B... C, D, E, F. Then it tilts its head at the 40.)']
    ],
    wheel: [
      ['', 'Half-buried in the sand by the pool: a wooden wheel with two rings of letters. The inner ring turns. Scratched on the back: "KOPAK\'S. NO TOUCHING."'],
      ['', 'You got the Roda Rahsia! Use it on Kopak\'s diary, and at Tok Batu\'s door.']
    ],
    diaryLocked: [['', 'Kopak\'s diary. Every word is in code: "OEQM QEPY REO FEPMO..." You need something to read it with.']],
    diaryRead: [
      ['', 'Kopak\'s diary, decoded:'],
      ['', '"We are too ashamed to go home. The mine closed. The money is gone."'],
      ['', '"Tonight: the jars go to Kampung Tepian. Take the kampung fund."'],
      ['pelita15', '(Pelita gasps. The tabung kampung: the savings for rebuilding the houses that burned!)']
    ],
    pile: [
      ['', 'The kampung\'s things, piled high: Abang Zul\'s gula, Tukang Leong\'s hammer, Pak Mat\'s buffalo bell, the brass dulang from the majlis... and a jar of Kak Senah\'s sambal.'],
      ['', 'Far too heavy to carry out now. First, find a way out of here.']
    ],
    batu: { 6: 'Out you go. Mind the bats.', end: 'Hmph. Welcome back. Your chest is where you left it. I watched it. All night.' },
    wrong: 'SALAH! (Wrong!)',
    plain: 'That is the word, yes. But not in the code!',
    outside: 'That is the outside word. In here I want TODAY\'S word.',
    forty: 'Forty?! The forty is a lie, even in here. Hmph.',
    free: [
      ['tokbatu17', 'H... S... H... S... P. Hush-hush. Clever!'],
      ['', 'GRRRIND! The rock rolls aside, and late-afternoon light floods into the cave.']
    ],
    // the jars
    warn: [
      ['penghulu15', 'A cave? A secret code? And they want the tabung kampung?! That money is for the burned houses!'],
      ['', 'Just then, a cart creaks up the road. A merchant with a long white beard waves cheerfully.']
    ],
    merchant: [
      ['saudagar17', 'Salam, good people! I am Datuk Saudagar. A gift for your brave kampung: FORTY jars of the finest honey!'],
      ['jusoh14', '...I count twelve.'],
      ['saudagar17', 'Twelve... and the other twenty-eight are on their way. Now, where do you keep your tabung kampung? No reason.'],
      ['mat16', 'I\'ll get my fishing net ready. Just in case.'],
      ['', 'Find the three jars hiding thieves. Tap a jar and listen. Pelita\'s glow shows a hidden thief\'s breath.']
    ],
    honey: 'Tok, tok. Just honey.',
    ssst: 'Ssst!',
    lid: 'Lift the lid',
    caught: {
      kopak: [['kopak17', 'Ah! Don\'t look at me, I\'m... honey. Very sticky honey.'], ['', 'SWOOSH! Pak Mat\'s fishing net lands on Kopak.']],
      senget: [['senget17', '(Senget tumbles out sideways.) I wasn\'t hiding! I was leaning. In a jar.'], ['', 'SWOOSH! Pak Mat\'s net again!']],
      kecik: [['kecik17', 'Is it over? It was so DARK in there!'], ['', 'The biggest thief climbs out and hugs Pak Mat. Pak Mat nets them both by accident, then wriggles out himself.']]
    },
    reveal: [
      ['saudagar17', 'Grrr...!'],
      ['', 'The merchant rips off his long white beard. Under it: a huge black moustache.'],
      ['garong17', 'Datuk Saudagar? Pfft! I am PANGLIMA GARONG! Nobody nets my Forty!'],
      ['kopak17', '(from under the net) Four, Panglima.'],
      ['garong17', 'QUIET! You, little farmer. A duel!']
    ],
    giveUp: 'Okay, okay! I give up!',
    finale: [
      ['garong17', 'Okay, okay! I give up! Ow. My moustache.'],
      ['', 'The kampung gathers around the four thieves under Pak Mat\'s net.'],
      ['penghulu15', 'Why? Why steal from a kampung that just lost its houses to a fire?'],
      ['kopak17', 'The old tin mine closed. No work, no money... We were too ashamed to go home with nothing.'],
      ['garong17', 'We are not really panglima. Or a gang. Or forty. We are four bachelors with no jobs and one teddy bear.'],
      ['kecik17', 'It\'s mine.'],
      ['penghulu15', 'Then here is a fair deal. Give back everything and say sorry to every house. Help rebuild the burned homes. And after that...'],
      ['penghulu15', 'Become our night watchmen. Who better to stop thieves than four thieves?'],
      ['garong17', '...Peronda? With a torch? And a whistle?'],
      ['penghulu15', 'And a salary.'],
      ['garong17', '(sniff) We accept!'],
      ['alibaba17', 'And I will never climb a tree again.'],
      ['penghulu15', 'Ali Baba, you are the bravest firewood man in the land. Nenek needs firewood every day. Will you bring it?'],
      ['sibara15', 'Yes! Every day! Smoke every day!'],
      ['alibaba17', 'Every morning, then. And take my old kapak, and some bijan from my patch. Kuih bijan, my mother\'s recipe!'],
      ['', 'At Bukit Kapur, Tok Batu admits that he likes you. The cave is yours now: it opens whenever you come, and it keeps a big storage chest safe for you.'],
      ['', '✦ Chapter 17 complete! ✦ Kapak Ali Baba (a weapon, and twice the wood from fallen branches), the Roda Rahsia, the Kuih Bijan recipe (padi, bijan, telur) and 10 Bijan, 1000 kepeng, and Gua Empat Puluh as your storage vault.']
    ],
    peronda: {
      garong: 'Peronda Garong, on patrol! (He blows his whistle. Twice. Just because he can.)',
      kopak: 'I have a salary now. I have never had a salary. I keep counting it.',
      senget: 'I lean on the lamppost. Professionally.',
      kecik: 'I asked for the night shift near the torch. It is not dark at all here.'
    },
    caughtLook: { kopak: 'Kopak, under the net, counting the holes in it.', senget: 'Senget, under the net, leaning on nothing.', kecik: 'Kecik, under the net, perfectly happy. It is not dark out here.' },
    saudagar: 'Lovely honey, lovely honey. Pay no attention to the jars. Where did you say the tabung kampung was?'
  };
})(window.LC);
