/* Chapter 20 (the last chapter): Janji Buaya Putih, Part 2 (v3.23). See buaya.js for Part 1 and the story's threads.
 * Steps (S.quests.ch20) after Part 1 (8): 8 wait for the monsoon wind (two days) · 9 the voyage to Sabah (the strait at
 * the tip of Borneo, towing her raft; the Bajau Laut through the coral; the net, a free-dive) · 10 the Kinabatangan
 * (upriver: monkeys, hornbills, elephants; the crocodile clan: Kancil's count; truth or trick; Tok Sisik) · 11 the nest
 * bank: the vision (Pelita is her spark), the shadow takes Pelita · 12 without Pelita: ring the brass bell, and the lights
 * come · 13 the black river (the shadows on the bank) · 14 ride the White One (the giant shadow on the lake) · 15 Kancil's
 * trick (the heart opens) · 16 inside the shadow: find Pelita, feed it, tell it · 17 letting go (Pelita Putih returns, a
 * hatchling follows you) · 18 Kenduri Terakhir at Kampong Ayer, the group photo, the credits · 19 TAMAT (the epilogue
 * at Nenek's jetty).
 * Rewards: Pelita Putih (it heals you when you are badly hurt; Harimau Cahaya, a tiger of light, once a day on T),
 * Anak Putih (the hatchling grows in your river; grown, it carries you across water: ring the brass bell), a stilt house
 * in Kampong Ayer (sleep there, fish from the steps), Sang Kancil as a companion (finds things, draws enemies off), and
 * the Tamat badge with the group photo in My stats. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var C = LC.C20;
  C.end = 19;
  function st(S) { return C.step(S); }
  function q(S) { return S.quests; }
  Object.assign(C, {
    windDays: 2,
    sabah: { W: 196, H: 44, start: { x: 5, y: 18 }, tow: { x0: 54, x1: 98 }, strait: { x0: 62, x1: 90 }, reef: { x0: 102, x1: 152 }, net: 156, goalX: 186,
      reefPath: [[98, 18], [110, 18], [110, 8], [122, 8], [122, 26], [134, 26], [134, 12], [146, 12], [154, 18]],
      lepa: [[104, 18], [110, 16], [110, 11], [113, 8], [118, 8], [122, 11], [122, 17], [122, 23], [125, 26], [131, 26], [134, 23], [134, 17], [135, 12], [140, 12], [146, 12], [150, 15], [155, 18]] },   // (along the channel, corner by corner)
    river: { W: 150, H: 30, start: { x: 144, y: 15 }, ford: 84, block: 30 },
    nest: { spawn: { x: 6, y: 25 }, nest: { x: 5, y: 11 }, putih: { x: 12, y: 14 }, sisik: { x: 12, y: 20 }, nenek: { x: 4, y: 17 }, kancil: { x: 6, y: 17 },
      bell: { x: 13, y: 7 }, semaun: { x: 10, y: 9 }, badang: { x: 9, y: 22 }, lake: { x: 26, y: 15, rx: 11.5, ry: 9.5 }, zone: { x0: 3, y0: 4, x1: 13, y1: 26 } },
    inside: { spawn: { x: 4, y: 17 }, pelita: { x: 25, y: 5 }, memories: [{ x: 9, y: 13 }, { x: 15, y: 9 }, { x: 20, y: 12 }] },
    rope: { len: 58, strain: 100 },
    ride: { speed: 96, turn: 3.2, lights: 6, waveEvery: 3.6, waveR: 210 },
    kills: 10,
    tiger: { dur: 20, hit: 0.7 }, heal: { below: 0.35, cd: 90, amount: 0.5 },
    anak: { young: 4, grown: 8 },
    rumah: { x: 41, y: 18, door: { x: 41, y: 20 } },
    kancil: { findEvery: 150, decoyCd: 60, decoyDur: 4.5 },
    count: 7
  });
  LC.c20Putih = function (S) { S = S || LC.State.s; return !!(S && S.quests && S.quests.c20putih); };
  LC.c20Anak = function (S) {   // 0 none, 1 baby, 2 young, 3 grown
    S = S || LC.State.s;
    var h = S && S.quests && S.quests.c20hatch;
    if (h === undefined || h === null) return 0;
    var d = S.day - h;
    return d >= C.anak.grown ? 3 : d >= C.anak.young ? 2 : 1;
  };
  LC.c20Tamat = function (S) { S = S || LC.State.s; return !!(S && S.quests && S.quests.c20tamat); };
  // Pelita's last form: Pelita Putih (a white flame with a gold rim), drawn by art34.js from Pelita Purnama
  var ghostTex = LC.ghostTex;
  LC.ghostTex = function (stage, expr) { return LC.c20Putih() ? 'ghost_6_' + (expr || 'normal') : ghostTex.apply(this, arguments); };

  // ---------------------------------------------------------------- speakers, the clan, the shadow
  LC.SPEAKERS.sisik20 = { name: 'Tok Sisik', portrait: 'buayaK20_face' };
  LC.SPEAKERS.lepa20 = { name: 'Nakhoda Lepa', portrait: 'npc20_lepa_0' };
  LC.SPEAKERS.bayang20 = { name: 'The Shadow', portrait: 'bayang20_besar_0' };
  LC.SPEAKERS.pelitaS20 = { name: 'Pelita', portrait: 'ghost', expr: 'sad' };
  LC.SPEAKERS.badang20 = { name: 'Badang', portrait: 'npc_badangK_0' };
  LC.SPEAKERS.bakunawa20 = { name: 'Bakunawa', portrait: 'bakunawa11_1' };
  LC.SPEAKERS.alak20 = { name: 'Awang Alak Betatar', portrait: 'npc_alak_0' };
  C.folk.lepa = { look: { skin: '#8a5a36', shirt: '#e84a6a', shirt2: '#c02a4a', bottom: '#2a6a8a', bottom2: '#1e4e6a', hair: '#1a1210', hat: 'headband' } };
  LC.ENEMIES.kelam20b = { name: 'Bayang', texture: 'kelam', hp: 10, speed: 36, dmg: 6, sight: 200, w: 6, drop: [] };
  if (LC.ENEMY_LV) LC.ENEMY_LV.kelam20b = 32;

  // ---------------------------------------------------------------- the farm, Teluk Barunai and Kampong Ayer, after Part 1
  function thing(id, type, at, tex, when, extra) { return Object.assign({ id: id, type: type, x: at.x, y: at.y, tex: tex, keep: true, when: when }, extra || {}); }
  LC.OBJECTS.push(
    thing('f_anak20', 'buaya_anak', { x: 22, y: 29 }, 'anak20_kecil', function (S) { return st(S) >= C.end && LC.c20Anak(S) > 0; }, { w: 2 })
  );
  // the stilt house Kampong Ayer gives you, at the east end (its steps join the walkway: see syncBarunai below)
  LC.AREAS.barunai.objects.push(thing('k_rumah20', 'buaya_rumah', { x: C.rumah.x, y: C.rumah.y }, 'rumah_air3', function (S) { return !!q(S).c20rumah; }, { w: 3, h: 2, light: 0xffc070 }));
  var sync = LC.syncBarunai;
  LC.syncBarunai = function () {
    sync.apply(this, arguments);
    var g = LC.areaGrid('barunai'), S = LC.State.s, on = !!(S && S.quests && S.quests.c20rumah), d = C.rumah.door;
    g[d.y][d.x] = on ? 'j' : 'w';
  };

  // ---------------------------------------------------------------- the places
  function grid(w, h, tile) { return Array.from({ length: h }, function () { return new Array(w).fill(tile); }); }
  function ell(g, cx, cy, rx, ry, ch) { for (var y = Math.max(0, Math.floor(cy - ry)); y <= Math.min(g.length - 1, Math.ceil(cy + ry)); y++) for (var x = Math.max(0, Math.floor(cx - rx)); x <= Math.min(g[0].length - 1, Math.ceil(cx + rx)); x++) { var dx = (x - cx) / rx, dy = (y - cy) / ry; if (dx * dx + dy * dy <= 1) g[y][x] = ch; } }
  function fill(g, x0, y0, x1, y1, ch) { for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) if (g[y] && x >= 0 && x < g[0].length) g[y][x] = ch; }
  // the voyage to Sabah: north along the coast, through the strait at the tip of Borneo, the coral of the Bajau Laut
  function buildSabah() {
    var A = C.sabah, g = grid(A.W, A.H, 'o'), x, y;
    for (x = 0; x < A.W; x++) {
      var top = 36 + Math.round(Math.sin(x / 6) * 1.2 + Math.sin(x / 2.7) * 0.5);
      if (x >= 64 && x <= 84) top = Math.min(top, 20 + (Math.abs(x - 74) * 1.3 | 0));   // the tip of Borneo
      for (y = top; y < A.H; y++) g[y][x] = y <= top + 1 ? 's' : 'J';
      if (top - 1 >= 0) g[top - 1][x] = 'h';
    }
    ell(g, 74, 6, 7, 6.5, 'h'); ell(g, 74, 5, 5.5, 5, 's'); ell(g, 74, 4, 3.5, 3.2, 'J');   // the island across the strait
    // the coral: a field you can only cross by the Bajau Laut's channel
    for (y = 0; y < A.H; y++) for (x = A.reef.x0; x <= A.reef.x1; x++) if (g[y][x] === 'o' || g[y][x] === 'h') g[y][x] = 'C';
    for (var i = 0; i < A.reefPath.length - 1; i++) {
      var a = A.reefPath[i], b = A.reefPath[i + 1], n = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]));
      for (var k = 0; k <= n; k++) { var px = a[0] + (b[0] - a[0]) * k / n, py = a[1] + (b[1] - a[1]) * k / n; ell(g, px, py, 2.6, 2.6, 'o'); }
    }
    for (y = 0; y < A.H; y++) for (x = A.reef.x0; x <= A.reef.x1; x++) if (g[y][x] === 'C' && ((x * 7 + y * 13) % 11 === 0)) g[y][x] = 'h';   // a few bright patches
    for (y = 0; y < A.H; y++) for (x = A.reef.x0; x <= A.reef.x1; x++) if (g[y][x] === 'h') { var open = 0; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { if (g[y + d[1]] && g[y + d[1]][x + d[0]] === 'o') open++; }); if (!open) g[y][x] = 'C'; }
    // the mouth of the Kinabatangan at the east end
    for (y = 24; y < A.H; y++) for (x = A.goalX; x < A.W; x++) g[y][x] = 'o';
    return g;
  }
  LC.AREAS.laut20b = {
    name: 'Laut Sabah', sub: 'round the tip of Borneo', lvl: 20, build: buildSabah, objects: [], voyage20: 'sabah', frozenClock: true,
    pond: 'sea', amb: 'sea', decor: { n: 0, types: [], on: 's' }, exits: [], home: { x: C.sabah.start.x, y: C.sabah.start.y }, ride: {}
  };
  // the Kinabatangan: upriver (west), between mangroves and rainforest
  function buildRiver() {
    var A = C.river, g = grid(A.W, A.H, 'g'), x;
    fill(g, 0, 0, A.W - 1, 1, 'J'); fill(g, 0, A.H - 2, A.W - 1, A.H - 1, 'J');
    for (x = 0; x < A.W; x++) {
      var c = 15 + Math.round(Math.sin(x / 13) * 3 + Math.sin(x / 5.3)), half = x > 120 ? 6 : 4 + ((x * 3) % 7 === 0 ? 1 : 0);
      fill(g, x, c - half, x, c + half, 'w');
      g[c - half - 1][x] = 'S'; g[c + half + 1][x] = 'S';
    }
    for (x = A.ford - 3; x <= A.ford + 3; x++) for (var y = 2; y < A.H - 2; y++) if (g[y][x] === 'w') g[y][x] = 'h';   // the shallows where the elephants cross
    return g;
  }
  LC.AREAS.kina20 = {
    name: 'Sungai Kinabatangan', sub: 'Sabah: the river where she hatched', lvl: 20, build: buildRiver, objects: [], voyage20: 'river', frozenClock: true,
    pond: 'river', amb: 'river', decor: { n: 40, types: ['fern', 'bush', 'lalang', 'fern'], on: 'g' }, exits: [], home: { x: C.river.start.x, y: C.river.start.y }, ride: {},
    trees: { n: 60, on: 'g', tex: ['jtree', 'jtree2'], text: 'Rainforest crowds the riverbank: figs, dipterocarps, and vines as thick as your arm.' }
  };
  // the nest bank by the oxbow lake (tasik ladam)
  var N = C.nest, NEST = [
    thing('s_sarang20', 'buaya_sarang', N.nest, 'sarang20', null, { w: 2 }),
    thing('s_putih20', 'buaya_croc2', N.putih, 'buaya20_0', null, { w: 4 }),
    thing('s_sisik20', 'buaya_sisik', N.sisik, 'buayaK20_0', function (S) { var s = st(S); return s >= 11 && s <= 17; }, { w: 4 }),
    thing('s_nenek20', 'buaya_nenek2', N.nenek, 'npc_nenek_0', null),
    thing('s_kancil20', 'buaya_kancil2', N.kancil, 'kancil20_0', function (S) { return st(S) !== 15; }),
    thing('s_loceng20', 'buaya_bell', N.bell, 'tiang20', null),
    thing('s_semaun20', 'buaya_ally', N.semaun, 'npc_semaun_0', function (S) { var s = st(S); return s >= 13 && s <= 17; }, { who: 'semaun20' }),
    thing('s_badang20', 'buaya_ally', N.badang, 'npc_badangK_0', function (S) { var s = st(S); return s >= 13 && s <= 17; }, { who: 'badang20' })
  ];
  [[2, 4], [3, 9], [2, 14], [3, 21], [2, 26], [14, 3], [16, 27], [9, 3]].forEach(function (t, i) { NEST.push(thing('s_pokok' + i, 'bldg', { x: t[0], y: t[1] }, i % 2 ? 'bakau20' : 'jtree', null, { text: i % 2 ? 'A mangrove on stilt roots, its feet in the water.' : 'A great fig tree, full of birds by day and fireflies by night.' })); });
  LC.AREAS.sarang20 = {
    name: 'Tebing Sarang', sub: 'the nest bank by the oxbow lake', lvl: 20, pond: 'river', amb: 'river', exits: [], ride: {}, home: N.spawn,
    decor: { n: 18, types: ['fern', 'lalang', 'bush'], on: '.' }, clear: [{ x: 6, y: 18, r: 3 }, { x: 8, y: 12, r: 2 }, { x: 12, y: 8, r: 2 }],
    build: function () {
      var g = grid(40, 30, 'J');
      fill(g, 2, 2, 37, 27, '.');
      fill(g, 3, 5, 15, 26, 's');
      ell(g, N.lake.x, N.lake.y, N.lake.rx, N.lake.ry, 'w');
      ell(g, N.lake.x, N.lake.y, N.lake.rx + 1, N.lake.ry + 1, 'w');
      return g;
    },
    objects: NEST
  };
  Object.defineProperty(LC.AREAS.sarang20, 'frozenClock', { configurable: true, get: function () { var S = LC.State.s, s = S && st(S); return !!(S && s >= 11 && s <= 16); } });
  LC.AREAS.sarang20.enemies = [{ kind: 'kelam20b', n: 5, zone: N.zone, c20b: true }];
  // inside the shadow
  LC.AREAS.dalam20 = {
    name: 'Dalam Bayang', sub: 'inside the shadow', lvl: 20, cave: true, frozenClock: true, pond: 'pond', amb: 'cave', exits: [], ride: {}, home: C.inside.spawn,
    decor: { n: 0, types: [], on: 'c' },
    build: function () { var g = grid(30, 22, 'X'); fill(g, 2, 2, 27, 19, 'c'); return g; },
    objects: [thing('d_pelita20', 'buaya_spark', C.inside.pelita, 'percik20', null)]
  };
  ['laut20b', 'kina20', 'sarang20', 'dalam20'].forEach(function (a) { LC.AREA_HOWTO[a] = 'Chapter 20.'; });

  // ---------------------------------------------------------------- what they say
  LC.BUAYA2_TEXT = {
    wind: [
      ['', 'A boy from Kampong Ayer comes running up the path, out of breath.'],
      ['anak20', 'Juragan Wira says: the wind has turned! The monsoon wind! He says come now!'],
      ['nenek20', 'Then we go, cucu. I packed kuih for the voyage: keep these three for Pelita. It has not been eating.'],
      ['', '(You got 3 Kuih Pandan. Board the jong in Teluk Barunai: row from the west jetty of Kampong Ayer. Or ask at the farm jetty: Juragan Wira\'s crew will row you out.)']
    ],
    windWait: 'Seri Putih rests in Teluk Barunai until the monsoon wind turns (in a day or two).',
    aboard: [
      ['wira20', 'North with the coast, round the tip of Borneo, then east to the Kinabatangan. Three seas in one voyage. My grandfather would be jealous.'],
      ['putih20', 'I am stronger now. I will swim. When I tire, tow me, little farmer.'],
      ['kancil20', 'I have prepared for this voyage by eating all the kuih in the galley. So that it does not go bad.']
    ],
    helm: 'Sail north-east along the coast. In the strait at the tip of Borneo, Seri Putih will rest on her raft: tow her gently. The faster you go in the crossing currents, the more the rope strains. If it snaps, sail back to her.',
    tired: [['putih20', 'The water is fighting itself here. Two seas... I am tired. Let me rest on Pak Lajak\'s cradle.'], ['', '(She climbs onto the raft behind the jong. Tow her through the strait: go slowly where the currents clash. Watch the rope.)']],
    strait: 'The tip of Borneo: here the South China Sea meets the Sulu Sea, and the two crash into each other.',
    strain: 'The rope groans! Slow down, or it will snap!',
    snap: 'SNAP! The rope breaks, and the currents carry her raft away! Sail back to her.',
    retie: 'Kancil leaps onto the raft with a new rope in his teeth. "Navigator! Navigator coming through!" She is tied on again.',
    rested: [['putih20', 'Mmm. I can swim again. Thank you.'], ['', '(She slides off the raft into the calmer sea.)']],
    bajau: [
      ['', 'Out of the dark come little boats with painted prows and patched sails, each with a lamp: the lepa of the Bajau Laut, the people who live on the sea.'],
      ['lepa20', 'You are heading into the coral by night? With a crocodile? Hah! Follow our lamps. The coral bites.'],
      ['', '(Follow the lepa boats through the coral. They wait for you, then glide on.)']
    ],
    lepaSay: ['"This way!"', '"Slowly, slowly..."', '"Left here! The coral is hungry tonight."', '"Good! You steer like a Bajau."'],
    bump: 'CRUNCH! The hull scrapes the coral. Follow the lepa lamps.',
    netHook: [
      ['', 'Beyond the coral, Seri Putih suddenly thrashes and rolls. An old fishing net, lost long ago, has wrapped itself around her tail.'],
      ['putih20', 'It holds me... I cannot swim.'],
      ['lepa20', 'An old ghost net. It kills turtles too. Somebody must dive and cut it! Take a parang, and a breath.'],
      ['', '(Free-dive: press USE when the blade passes the glowing knot. Cut all the knots before your air runs out.)']
    ],
    netFail: 'You burst to the surface, gasping. Breathe... and dive again. The knots you cut stay cut.',
    netDone: [['', 'The last knot parts. The net drifts down into the dark, and Seri Putih rolls free.'], ['lepa20', 'Good dive! Now go: your crocodile wants to go home. Selamat jalan!']],
    kinabalu: [
      ['', 'The sky turns grey, then gold. And there, far inland, a mountain rises out of the morning clouds, taller than anything you have ever seen: Kinabalu.'],
      ['putih20', '(Seri Putih lifts her head out of the water and breathes in, slow and deep.) I can smell home.']
    ],
    arrive: [['wira20', 'The mouth of the Kinabatangan. The jong is too big for the river, so take the ship\'s boat up. I will wait here.'], ['', '(Steer upriver. Seri Putih swims ahead now. She knows the way.)']],
    riverHelm: 'Steer upriver (west). Seri Putih swims ahead: follow her.',
    monkey: ['A proboscis monkey honks from a branch: HONK. His enormous nose wobbles.', 'Monyet belanda! A whole family of proboscis monkeys watches you pass, chewing leaves.', 'A big proboscis monkey leaps from tree to tree across the water. SPLASH. He did not make it.'],
    honk: 'HONK!',
    hornbill: 'A pair of hornbills flies over: whoosh, whoosh, whoosh. Their wings sound like a steam train.',
    elephants: 'Pygmy elephants! A small herd is crossing the shallows, trunks raised. Wait for them to cross.',
    elephantsGone: 'The last little elephant reaches the far bank and trumpets at you. You are allowed to pass.',
    blocked: [
      ['', 'Ahead, the river is full of eyes. Dozens of crocodiles, side by side, from bank to bank. They do not move.'],
      ['putih20', 'They do not know me. I left this river as a hatchling, small and white and strange. Sixty years ago. Seventy.'],
      ['kancil20', '(Sang Kancil cracks his knuckles. Can a mousedeer crack his knuckles? This one can.) Leave it to me. I have done this before.'],
      ['kancil20', 'CROCODILES OF THE KINABATANGAN! By order of the King of the Forest, every crocodile in this river must be COUNTED! Line up, line up!']
    ],
    countHow: 'The crocodiles line up into a bridge. Hop across their backs: press USE on each beat (when the ring meets the circle), and count them!',
    countWrong: 'Oops: a croc sinks under your foot. Back to the start of the line!',
    countAsk: [['sisik20', 'So, little deer. How many are we?']],
    countNo: 'The crocodiles narrow their eyes. "Count again."',
    countWrongPick: '(Tok Sisik\'s eyes narrow. That was not the count. Hop across and count again.)',
    choose: [['kancil20', '(On the far bank, Sang Kancil is grinning from ear to ear.) There is no King\'s order! Ha! Hahaha!']],
    trick: [['', 'Kancil falls about laughing, and you laugh too. The crocodiles do not. Every jaw in the river opens at once.'], ['kancil20', '...Run?'], ['', '(The crocodiles chase the boat! Keep away from them until the old one roars.)']],
    truth: [['', 'You step forward before Kancil can say anything else.'], ['', '"There is no King. I am sorry. We came because we brought your sister home."']],
    chaseEnd: [['', 'A roar shakes the river. The chase stops at once.'], ['', '(Kancil hides behind your legs.) "I would like to apologise. Sincerely. From the bottom of my small heart."']],
    sisik: [
      ['', 'An old, old crocodile swims slowly up out of the brown water. His snout is scarred, one eye is milky, and moss grows on his back.'],
      ['sisik20', 'I am Sisik. I have guarded this river since before your Nenek was born.'],
      ['', 'He looks into Seri Putih\'s eyes for a long, long time.'],
      ['sisik20', '...Sister. You came home.'],
      ['putih20', 'Little brother. You got old.'],
      ['sisik20', 'And you got white. Well. Whiter.'],
      ['', '(The crocodiles part like a curtain. Upriver, on a quiet oxbow lake, is the sandbank where she hatched.)']
    ],
    nestArrive: [['', 'Evening. A sandbank, warm from the sun, by a still lake shaped like a horseshoe. Fireflies wake up in the mangroves.'], ['putih20', 'Here. Here is where I broke my egg. Come, little farmer. Sit with me. There is something you must see.']],
    nestHint: 'Talk to Seri Putih at the edge of the lake.',
    vision: [
      { t: 'A storm, long ago. A young white crocodile is swept out of the Kinabatangan and carried away across the sea for days and days.' },
      { t: 'She comes to a far river, beside a little farm. And then the flood comes.' },
      { t: 'In the brown water, a basket. In the basket, a baby who laughs at her. She carries the basket to the shore, gently, like an egg.' },
      { t: 'The family weeps for joy. And she does something she has never done before: she breaks a spark off her mustika, the pearl of light inside her...' },
      { t: '...and sets it in the family\'s lamp. "Watch over them."' }
    ],
    visionAfter: [
      ['putih20', 'That spark has watched over your family for nearly a hundred years. It grew. It learned to eat and play and sulk.'],
      ['putih20', 'That spark is Pelita.'],
      ['nenek20', '(Nenek\'s hand flies to her mouth.)'],
      ['putih20', 'That is why I have been fading, all this time. A piece of me has always been with you.'],
      ['', 'Pelita stares at Seri Putih. Then at you. You can see it understand: it might have to go back.'],
      ['', 'Pelita turns and flees into the dark trees.']
    ],
    shadowRise: [
      ['', 'Where Pelita\'s shadow lay on the sand, something tears loose. The shadow stretches... and stands up. Then it keeps growing.'],
      ['putih20', 'Every light casts a shadow, child. That one is Pelita\'s.'],
      ['putih20', 'A witch once fed it with anger, and you met it as Si Kelam. Now it feeds on Pelita\'s fear: the fear of leaving you.'],
      ['putih20', 'It wants to swallow my mustika, so that no one can ever take Pelita away from you.'],
      ['bayang20', 'MINE. IT STAYS. IT STAYS.'],
      ['', 'The shadow reaches into the trees, and pulls Pelita out, and swallows it whole. Then it rises over the lake, black against the stars.']
    ],
    alone: 'Pelita is gone. The night is very dark. Your torch is very small.',
    bellHint: 'Ring Dang Kemala\'s brass bell at the river\'s edge (the post by the water).',
    bellNeed: 'You need the brass bell from Kampong Ayer. (Kancil: "Did you leave it in the jong? You left it in the jong." Dang Kemala sends a new one with the next boat... here it is.)',
    bell: [
      ['', 'You ring the little bell. The note runs out across the black water, thin and bright.'],
      ['', 'For a moment, nothing. Then Nenek, sitting on the sand, begins to sing: the old river song her mother sang. Her voice shakes, then steadies.'],
      ['', 'All along the Kinabatangan, crocodiles lift their heads out of the water to listen.'],
      ['', 'And lights appear on the river, one by one. Boats. Dozens of boats, every one with a lamp.'],
      ['semaun20', 'Kampong Ayer heard the bell! Did you think we would let you do this alone? The whole fleet came!'],
      ['badang20', '(Badang wades out of the mangroves with a boulder on each shoulder.) The jong was too slow. I walked. Mostly through the sea.'],
      ['', 'Overhead, something huge and silver slides across the sky. Bakunawa, the moon serpent, pulls the clouds off the moon, and the lake turns to silver.'],
      ['', 'One by one, the others come, or send what they can: Nakhoda Idris\'s ship lights its lanterns at the river mouth; Kudin, Leman and Sani shout a spell from a sampan (it fizzles, then works); Mak Kiah sends sundal malam flowers, and the shadows shrink from their scent; and an old voice cackles from nowhere, "Pepper, child! Throw it in its eyes!": Nek Lampir\'s spirit.'],
      ['nenek20', 'Now, cucu. Go and get our little light back.']
    ],
    fightHow: 'The shadows are coming onto the bank! Fight them with your friends (hold a weapon and press USE).',
    fightLeft: 'Shadows left: {n}.',
    faint: [['nenek20', 'Up, cucu! Up! (Nenek hauls you to your feet. You are not hurt, only winded.)']],
    rideHow: [
      ['putih20', 'Nenek\'s song is in my bones. Climb on my back, little farmer. We will take back what it stole!'],
      ['', '(Ride Seri Putih across the lake. Swim through the stolen lights circling the shadow (6). Keep clear of the dark rings it sends out.)']
    ],
    rideHit: 'A dark wave hits! Seri Putih shudders.',
    rideFail: 'Seri Putih is tired. She carries you back to the bank to catch her breath. Try again!',
    rideLight: 'You burst through a stolen light! The shadow howls. ({n} / {of})',
    rideDone: [['', 'The last light breaks free. The shadow staggers back across the lake, smaller, but still huge.'], ['bayang20', 'NO. NO. IT STAYS. IT STAYS WITH ME.']],
    trickSet: [
      ['kancil20', '(Sang Kancil trots out onto the sand with a jar of fireflies, glowing gold, and Dang Kemala\'s bell tied to it.) My turn. A trick wins once. Let us make it count.'],
      ['kancil20', 'OVER HERE, SHADOW! I have your little light! Ding-a-ling! Count yourself LUCKY!'],
      ['', '(The shadow turns towards the fake light. When it lunges, its heart will open for a moment. Press USE then, and jump in!)']
    ],
    trickMiss: 'Too soon or too late: its heart snaps shut. Kancil rings the bell again: "Over here, you big puddle!"',
    trickDone: 'The shadow lunges for Kancil\'s jar, and its heart opens like a door. You jump.',
    insideArrive: 'Total darkness. No sound at all, except, somewhere, a tiny voice, crying.',
    memories: [
      'A memory floats past: the first night, Nenek\'s letter, and a little light in an empty house.',
      'A memory: Pelita, eating its first meal from your hands. It made such a mess.',
      'A memory: Pelita asleep in Nenek\'s lap, glowing like a sleepy lamp.'
    ],
    pelitaFound: [
      ['', 'There, in the dark, is a spark no bigger than a firefly. It is crying.'],
      ['pelitaS20', 'I don\'t want to leave you.'],
      ['', '(Pelita has never spoken before. Not once.)'],
      ['', '(Hold up its favourite dish and press USE: feed your little creature.)']
    ],
    noDish: 'You have no dish. Then, at the bottom of your pocket, your fingers find the last kuih Nenek packed. Of course she did.',
    fed: '(Pelita eats from your hand, the way it did on the very first day. Its light grows a little.)',
    tellAsk: [['pelitaS20', 'If I go back... you will forget me.']],
    tell: [
      ['Never. You are my family.', 'You are my family, Pelita. Wherever you go.'],
      ['Wherever you go, you are mine', 'Wherever you go, you are my family. Nothing can change that.'],
      ['I will feed you every day', 'Every day. Kuih, nasi lemak, durian if you want it. You are my family.']
    ],
    shrink: [
      ['', 'Pelita\'s light swells. The dark around you shivers, and cracks, and pours away like water.'],
      ['', 'You are standing on the sandbank in the grey light before dawn. The great shadow is gone. At Pelita\'s feet there is only a small, ordinary shadow, the size of a puddle.'],
      ['', 'Pelita looks at it. The little shadow looks back. Then it lies down quietly, where a shadow should be.'],
      ['', 'Nothing was destroyed. It was only ever Pelita\'s.']
    ],
    dawnEggs: [['', 'Dawn. The Kinabatangan runs gold. In the warm sand of the nest, Seri Putih has laid her eggs. But they are cold.'], ['putih20', 'They cannot hatch while my mustika is broken. I will not take the spark. It is not mine to take any more. The choice is yours.']],
    goAsk: [['putih20', 'Little farmer?']],
    goLabels: ['Go home, little light', 'Not yet'],
    notYet: [['putih20', 'Then I will wait. There is no hurry. Rivers are patient.']],
    nenekWait: ['Loving isn\'t holding on, cucu. It\'s knowing they\'ll be all right without you.', 'My mother used to say: a lamp is not for keeping. It is for lighting.', 'Take your time. I am not going anywhere. My knees will not let me.'],
    letGo: [
      ['', 'Pelita looks at you one last time. Then it floats to Seri Putih, and touches the pearl of light in her throat, and is gone inside it.'],
      ['', '...'],
      ['', 'For a long moment there is no Pelita at all. Just the river, and the birds, and the empty air beside your shoulder.']
    ],
    returns: [
      ['', 'Then the mustika blazes, whole, as bright as the morning. In the sand, the eggs begin to crack.'],
      ['', 'And a light rises out of the mustika. It is Pelita: bigger, white as the moon on the lake, with a rim of gold.'],
      ['putih20', 'A light that is loved grows. There is enough of it now for my river, and for you.'],
      ['', 'Pelita chooses for itself. It flies straight back to your shoulder.'],
      ['', 'One white hatchling climbs out of its egg, sneezes, and toddles after Pelita. Then it sits on your foot, and will not move.'],
      ['putih20', '(Seri Putih laughs: a deep, rumbling laugh you feel in your feet.) Then the promise goes on. Look after each other.'],
      ['', '✦ Pelita has become Pelita Putih! When you are badly hurt, Pelita heals you (every ' + C.heal.cd + ' seconds). Once a day, press T (or tap the tiger beside your hotbar): Pelita becomes Harimau Cahaya, a tiger of light, and fights beside you. ✦'],
      ['', '✦ Anak Putih, the white hatchling, comes home with you. It grows a little every day; when it is grown, ring the brass bell beside water to ride it across rivers and the sea. ✦']
    ],
    sisikBye: 'Tok Sisik: "Go well, little farmer. Bring the hatchling to visit. It will want to meet its uncle."',
    homeward: [['wira20', 'Home, then! But first, Kampong Ayer is waiting. Awang Alak Betatar has ordered a kenduri. The biggest one the river has ever seen.']],
    // the last feast
    feastArrive: [
      ['', 'Kampong Ayer at night, and every lamp is lit. Lamps on the walkways, lamps on the boats, lamps on the roofs. The whole river is gold.'],
      ['alak20', 'Welcome home, friend of Barunai! Tonight we feast. And look who came...'],
      ['', 'Everyone you have met is here. Walk the walkways and say goodbye. When you are ready, talk to Nenek: she wants a photo.']
    ],
    photoAsk: [['nenek20', 'Everyone is here, cucu. Everyone. Shall we have a photo? For the wall. My wall is very empty.']],
    photoLabels: ['Take the photo', 'Not yet'],
    photoTaken: [['', 'Everyone squeezes onto the walkway. Badang has to crouch. Kancil stands on Badang. Pelita sits on your shoulder, and Anak Putih sits on your foot. "Senyum!"'], ['', 'FLASH.']],
    childHug: '(Awang Kecil runs to Nenek and hugs her. "White Grandmother saved me. You are her family. So you are my family too.")',
    amin: 'Amin: "One more! Kak Senah left me one last suitcase of bunga api. For the end of the story!"',
    credits: { title: 'Little Creature', thanks: 'Thank you for playing.', tamat: 'TAMAT', after: 'The farm, the kampung and every place you have been are still here. Pelita is waiting. Replay any chapter from Pause > Chapter.' },
    epilogue: [
      ['', 'The next morning, at Nenek\'s jetty.'],
      ['', 'Anak Putih is chasing Pelita round and round the jetty, snapping at its glow and missing every time. Pelita giggles (it can giggle now).'],
      ['', 'And Pelita\'s little shadow runs along beside them, just a shadow now, playing too.'],
      ['nenek20', '(Nenek, on the steps with her tea:) Our family has a crocodile now. My mother would be so pleased.'],
      ['', '✦ TAMAT ✦  You finished Little Creature. Your Tamat badge and the group photo are in My stats. The farm goes on: Pelita, Anak Putih, Sang Kancil and everyone are here, and Kampong Ayer gave you a house on the water. ✦']
    ],
    // after the story
    anakTalk: ['Anak Putih snaps at a dragonfly and misses. It looks very offended.', 'Anak Putih sneezes. It sneezes a lot.', 'Anak Putih rolls over to have its tummy scratched.', 'Anak Putih and Pelita are playing tag. Anak Putih is losing.'],
    anakSize: ['a baby, no longer than your arm', 'half grown, as long as Nenek\'s sampan', 'grown: big enough to carry you'],
    anakGrown: 'Anak Putih is grown! Hold the brass bell and press USE by the water to ride it, across rivers and the sea.',
    rideOn: 'You ring the bell. Anak Putih surges up out of the water, and you climb onto its back.',
    rideOff: 'You slide off Anak Putih\'s back.',
    rideWater: 'Not in the middle of the water! Swim Anak Putih to the shore first.',
    rideNope: 'Anak Putih cannot come here.',
    rideSmall: 'Anak Putih is still too small to carry you. (Grown in {d} more day(s).)',
    rumah: 'Your house on the water: a gift from Kampong Ayer. A woven mat, a mosquito net, and the river talking under the floor all night.',
    kancilCome: 'Sang Kancil: "Adventure? I am VERY good at adventure. Mostly the snack parts."',
    kancilStay: 'Sang Kancil: "I will guard the cucumbers. From the inside."',
    kancilFind: ['Sang Kancil digs in the leaves and finds {item}! "You are welcome."', 'Sang Kancil trots back with {item} in his mouth. "Found it. Do not ask where."', 'Sang Kancil: "Look what I tripped over!" ({item})'],
    decoy: 'Sang Kancil darts away squeaking: "OVER HERE, UGLY!" The enemies chase him!',
    heal: 'Pelita Putih wraps you in white light. (+{n} health)',
    tigerCall: 'Harimau Cahaya!',
    tigerNone: 'Harimau Cahaya only comes when there is something to fight.',
    tigerRest: 'Pelita is resting. Harimau Cahaya comes once a day. (Tomorrow!)',
    tigerGone: 'The tiger of light shakes its mane and becomes Pelita again.',
    tamatRow: 'You finished Little Creature on Day {d}. Select to see the group photo.'
  };
  // the people at the last feast (each says goodbye once); textures that do not exist are left out
  C.feast = [
    ['npc_semaun_0', 'Awang Semaun', 'We will tell this story for a thousand years. I will be taller in it.'],
    ['npc_alak_0', 'Awang Alak Betatar', 'Barunai was built by brothers. Tonight I think it has one more.'],
    ['npc_berbai_0', 'Pateh Berbai', 'I thought about it carefully, and I have decided: you are family.'],
    ['npc_sari_0', 'Damang Sari', 'I found her in the fog at last. Thanks to you.'],
    ['npc_badangK_0', 'Badang', 'When you need a boulder moved, you know where I am.'],
    ['npc_jack12_0', 'Nakhoda Idris', 'A crocodile, a mousedeer and a ghost. That is a crew, mate.'],
    ['npc_kiah19_0', 'Mak Kiah', 'Maya would have loved this. The scent of sundal malam is everywhere tonight.'],
    ['npc_belalang_0', 'Belalang', 'I predicted all of this. (I did not.)'],
    ['npc_tanggang_0', 'Si Tanggang', 'Go home to your Nenek every day. Every single day.'],
    ['npc_penghulu_0', 'Tok Penghulu', 'The kampung has never been so proud. Or so full.'],
    ['npc14_imam_0', 'Tok Imam', 'What a night. Go gently, and be grateful.'],
    ['npc_ani_0', 'Mak Ani', 'I brought kuih for four hundred people. It is not enough.'],
    ['npc14_amin_0', 'Amin', 'Watch the sky! I saved the biggest one for last!'],
    ['npc_bualang_0', 'Sang Bualang', 'I came on the wind. I will leave on the wind. Tonight, I stay.'],
    ['npc_lajak_0', 'Pak Lajak', 'Her cradle is still floating under your house. I could not take it down.'],
    ['npc_kemala_0', 'Dang Kemala', 'Keep the bell. Ring it when you miss her.'],
    ['npc20_esah_0', 'Mak Esah', 'I am still a little scared of crocodiles. But only a little.'],
    ['npc20_jalil_0', 'Pak Jalil', 'I slept the whole night. With a crocodile under the house! Imagine.'],
    ['npc20_tijah_0', 'Kak Tijah', 'Mak Cik Buaya sent a message on the wind. She says hello.'],
    ['npc20_anak_0', 'Awang Kecil', 'I am going to be a crocodile when I grow up.'],
    ['wira_0', 'Juragan Wira', 'Forty years at sea, and that was the best voyage of them all.'],
    ['npc_lampir_0', 'Nek Lampir\'s spirit', 'Hmph. Well done. Do not tell anyone I said so.', true]
  ];
  C.feastSpots = [[7, 20], [9, 20], [12, 20], [13, 20], [17, 20], [18, 20], [22, 20], [26, 20], [31, 20], [32, 20], [36, 20], [38, 20],
    [6, 22], [8, 22], [11, 22], [14, 22], [16, 22], [19, 22], [23, 22], [26, 22], [30, 22], [34, 22], [37, 22], [40, 22]];
  // a picture for every chapter in the credits (a missing one falls back to a little light)
  C.creditArt = { 1: 'ghost_2_happy', 2: 'npc_alak_0', 3: 'rumah_air', 4: 'jong_majapahit', 5: 'ghost_5_happy', 6: 'npc_puteri_ledang_0', 7: 'npc_bualang_0', 8: 'naga_ride_side_0', 9: 'i_mayang_pinang', 10: 'npc_belalang_0',
    11: 'i_mutiara_kembar', 12: 'npc_jack12_0', 13: 'npc_suraya_0', 14: 'npc14_senah_0', 15: 'f_sibara15', 16: 'npc_penghulu_0', 17: 'i_kapak_alibaba', 18: 'i_selempang18', 19: 'npc19_maya_0', 20: 'buaya20_0' };
  C.kancilLoot = [['kelapa', 1], ['herba', 2], ['madu_tualang', 1], ['seed_cili', 2], ['kepeng', 60], ['ikan_kembung', 1], ['rotan', 2], ['pisang', 2]];
})(window.LC);
