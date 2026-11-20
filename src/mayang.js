/* Little Creature — Chapter 9: Ulek Mayang, "The Song from the Sea" (v2.7). It begins a day after Chapter 8, on the same
 * save. Based on the Terengganu legend of Ulek Mayang: a fisherman caught in a storm at sea is taken by a sea princess who
 * fell in love with him, and a healer sings the Ulek Mayang on the beach to call the princesses, one after another, until
 * the eldest of the seven comes and sends him home ("what belongs to the sea goes back to the sea, what belongs to the
 * land goes back to the land"). The user asked for it to be scary, like horror: dark, a chase, small jump scares,
 * spooky; the song is sung, and you must find where it comes from; the voice is the fisherman's own, singing in a
 * woman's voice, out in the black sea. No gore, nobody is hurt for good, no religion, no worship: the meal is food for
 * guests, as the old manners say, and the verses here are the game's own, not the traditional lyrics.
 *  0 (a day after Chapter 8) at night, a woman's voice singing over the river, and an empty Terengganu boat at the jetty
 *  1 sail on the jong to Kampung Pantai Kabus (where the sun has not come up for days); Mak Som: her husband is gone
 *  2 Pantai Bakau, in the fog: find where the song comes from (an empty boat, a well, a swing... and Pak Awang, singing
 *    in the sea)
 *  3 Tok Pawang: the youngest of the seven sea princesses took Awang's spirit. Bring a mayang from the old pinang palm
 *    in the mangrove (she hunts you on the way back: when her singing stops, do not move; the lamps keep you safe), and
 *    Nasi Kunyit for seven guests (Mak Som: 7 nasi, 1 kelapa)
 *  4 the Ulek Mayang on the beach: sing the verses back; five princesses rise, then Puteri Bongsu (she flees with his
 *    spirit), then the eldest, Puteri Sulung
 *  5 Gua Puteri Tujuh, under the sea: seven giant clams; find the one where Awang's spirit hums; Bongsu lets him go
 *  6 back in the village: give the spirit back to Pak Awang, and the sun comes up at last   7 complete
 * Reward: Lagu Mayang (L): sing, and every enemy around you falls into a trance, swaying, for a few seconds.
 * Plus 12,000 kepeng, pearls from Puteri Bongsu, and four new friends. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  function addItems(map) { Object.keys(map).forEach(function (id) { var it = map[id]; it.id = id; it.icon = it.icon || 'i_' + id; LC.ITEMS[id] = it; }); }
  addItems({
    mayang_pinang: { name: 'Mayang Pinang', kind: 'treasure', desc: 'The blossom of the old pinang palm in the mangrove, still in its long pale sheath. Tok Pawang needs it for the Ulek Mayang. It smells of rain.' },
    nasi_kunyit: { name: 'Nasi Kunyit', kind: 'treasure', desc: 'Yellow turmeric rice from Mak Som\'s kitchen, in seven little bowls. "You never call a guest without food," she says. "Not even a guest from the sea."' },
    semangat_awang: { name: 'Semangat Awang', kind: 'treasure', desc: 'Pak Awang\'s spirit: a warm little light in a giant clam\'s pearl-white shell. It hums very softly, a fisherman\'s song, a little out of tune.' }
  });
  ['mayang_pinang', 'nasi_kunyit', 'semangat_awang'].forEach(function (id) { LC.FIXED_ITEMS[id] = 1; });

  function q(S) { return (S && S.quests) || {}; }
  function c9(S) { return q(S).ch9 || 0; }
  LC.ch9Step = function () { return c9(LC.State.s); };
  LC.hasLagu = function () { var S = LC.State.s; return !!S && !!q(S).laguMayang; };
  LC.HORROR9 = { kabus: 1, bakau: 1, guatujuh: 1 };
  // the fog and the dark hold Pantai Kabus from the moment you arrive until Pak Awang wakes
  LC.horror9 = function (area) { var s = LC.ch9Step(); return !!LC.HORROR9[area] && s >= 1 && s <= 6; };

  LC.C9 = {
    night: 20 * 60,                                        // the song is first heard at the farm after 8 PM
    hear: 460, near: 30,                                    // how far away you can hear the song (px), and how close is "found"
    find: [[44.5, 27.6], [14.5, 11.6], [31.5, 24.6], [24.5, 31.4]],   // Pantai Bakau: the boat, the well, the swing, Pak Awang
    chase: { speed: 58, sprint: 100, far: 170, every: 6, every2: 9, quiet: 2.4, grace: 0.4, lampR: 46, catchR: 13, dmg: 10, endX: 52 },
    lamps: [[48, 13], [38, 13], [27, 13], [16, 13]],        // the chase: the old pelita lamps along the boardwalk
    palm: { x: 5, y: 4 },
    nasi: { nasi: 7, kelapa: 1 },
    verses: [4, 5, 6],                                      // notes in each verse of the Ulek Mayang
    clams: [[10, 9], [14, 6], [21, 6], [26, 9], [27, 15], [18, 17], [9, 15]],
    reward: 12000,
    lagu: { cd: 20, r: 110, dur: 5, bossDur: 1.5 }        // Lagu Mayang: seconds between songs, reach, trance length
  };

  // ================================================================ Kampung Pantai Kabus (the village)
  function grid(W, H, ch) { var g = []; for (var y = 0; y < H; y++) { g.push([]); for (var x = 0; x < W; x++) g[y].push(ch); } return g; }
  function fill(g, x0, y0, x1, y1, ch) { for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) if (g[y] && x >= 0 && x < g[0].length) g[y][x] = ch; }
  function ell(g, cx, cy, rx, ry, ch) { for (var y = 0; y < g.length; y++) for (var x = 0; x < g[0].length; x++) { var dx = (x - cx) / rx, dy = (y - cy) / ry; if (dx * dx + dy * dy <= 1) g[y][x] = ch; } }
  function buildKabus() {
    var W = 48, H = 36, g = grid(W, H, 's');
    fill(g, 0, 0, W - 1, 2, 'J'); fill(g, 0, 0, 1, 27, 'J'); fill(g, W - 2, 0, W - 1, 27, 'J');
    fill(g, 0, 13, 1, 15, 'p');                            // the path west, into the mangrove
    fill(g, 2, 14, W - 3, 15, 'p');                        // the village lane
    fill(g, 23, 16, 24, 28, 'p');                          // down to the jetty
    fill(g, 2, 3, W - 3, 11, '.'); fill(g, 6, 4, 13, 9, '.');
    fill(g, 0, 29, W - 1, 29, 'h'); fill(g, 0, 30, W - 1, H - 1, 'o');
    fill(g, 23, 29, 24, H - 2, 'j');                       // the jetty
    return g;
  }
  var K_OBJ = [
    { id: 'kb_som', type: 'bldg', x: 17, y: 8, w: 4, h: 3, tex: 'rumah9', keep: true, light: 0xffb060, text: 'Mak Som and Pak Awang\'s house, on tall posts, with carved panels under the roof. One lamp burns in the window, all night, every night.' },
    { id: 'kb_pawang', type: 'bldg', x: 37, y: 8, w: 3, h: 3, tex: 'pondok9', keep: true, light: 0xffc070, text: 'Tok Pawang\'s hut. Bundles of dried leaves hang from the eaves, and a row of little lamps along the steps.' },
    { id: 'kb_rumah1', type: 'bldg', x: 5, y: 8, w: 4, h: 3, tex: 'rumah9b', keep: true, text: 'A house with every shutter closed. Someone inside is whispering, very fast.' },
    { id: 'kb_rumah2', type: 'bldg', x: 27, y: 8, w: 4, h: 3, tex: 'rumah9b', keep: true, text: 'The shutters are shut, but there are fingers on the edge of one of them. They pull back when you look.' },
    { id: 'kb_rumah3', type: 'bldg', x: 42, y: 4, w: 4, h: 3, tex: 'rumah9b', keep: true, text: 'An empty house. The door swings open and shut in the wind... but there is no wind.' },
    { id: 'kb_para1', type: 'bldg', x: 6, y: 21, w: 3, h: 1, tex: 'para9', text: 'A rack of salted fish, drying. Nothing dries here any more: there has been no sun for days.' },
    { id: 'kb_para2', type: 'bldg', x: 33, y: 21, w: 3, h: 1, tex: 'para9', text: 'Fish on the drying rack, and a little crab picking at them. Even the crab looks nervous.' },
    { id: 'kb_perahu1', type: 'bldg', x: 12, y: 24, w: 3, h: 1, tex: 'perahu9', keep: true, text: 'A Terengganu fishing boat, painted red, green and gold, with a carved bangau bird at the bow. Nobody has taken it out since the storm.' },
    { id: 'kb_perahu2', type: 'bldg', x: 38, y: 25, w: 3, h: 1, tex: 'perahu9', keep: true, text: 'Another painted boat, pulled high up the sand. Its net is still wet. It is always wet.' },
    { id: 'kb_sign', type: 'signpost', x: 3, y: 12, tex: 'sign', text: 'KAMPUNG PANTAI KABUS.  West: Pantai Bakau, the mangrove. (Somebody has scratched underneath: JANGAN DENGAR. Do not listen.)' },
    { id: 'kb_jong', type: 'jong5', x: 25, y: 31, w: 5, h: 3, tex: 'jong_majapahit' },
    // Pak Awang, lying on a mat by his house, cold and still (from when you find him until he wakes)
    { id: 'kb_awang', type: 'awang9', x: 21, y: 11, w: 2, h: 1, tex: 'awang_tidur', keep: true, when: function (S) { var s = c9(S); return s >= 3 && s <= 6; } }
  ];
  // the sleepers: fishermen standing on the beach with their eyes shut, facing the sea, humming
  [[9, 27, 0], [30, 27, 1], [41, 26, 2]].forEach(function (t, i) {
    K_OBJ.push({ id: 'kb_tidur' + i, type: 'tidur9', i: i, x: t[0], y: t[1], tex: 'tidur9_' + t[2], when: function (S) { return c9(S) < 7; } });
  });
  [[3, 26], [17, 27], [28, 26], [45, 27], [20, 4], [33, 5]].forEach(function (t, i) { K_OBJ.push({ id: 'kb_palm' + i, type: 'bldg', x: t[0], y: t[1], tex: 'palm', text: i < 4 ? 'A coconut palm. Its fronds hang dead still, as if it is listening too.' : 'A coconut palm. Something pale is tied to the trunk: a strip of white cloth, wet with sea water.' }); });
  LC.AREAS.kabus = {
    name: 'Kampung Pantai Kabus', sub: 'the misty fishing village, Terengganu', lvl: 20, build: buildKabus, objects: K_OBJ,
    pond: 'sea', amb: 'beach', fog: true, decor: { n: 26, types: ['dunegrass', 'shellrock', 'pebbles', 'dunegrass', 'bush'], on: 's' },
    critters: [{ kind: 'ketam', n: 2, zone: { x0: 4, y0: 24, x1: 43, y1: 28 } }],
    clear: [{ x: 22, y: 12, r: 2 }, { x: 38, y: 13, r: 2 }, { x: 19, y: 13, r: 2 }],
    exits: [{ x0: 0, y0: 13, x1: 0, y1: 15, to: 'bakau', sx: 53.5, sy: 14.5, dir: 'left' }],
    home: { x: 23.5, y: 27.5 }, ride: {}
  };

  // ================================================================ Pantai Bakau (the mangrove and its beach)
  function buildBakau() {
    var W = 56, H = 36, g = grid(W, H, 'g');
    fill(g, 0, 0, W - 1, 1, 'J'); fill(g, 0, 0, 1, H - 1, 'J'); fill(g, W - 2, 0, W - 1, 26, 'J');
    fill(g, W - 2, 13, W - 1, 15, 'W');                    // the way back east, to the village
    fill(g, 7, 13, W - 3, 15, 'W');                        // the old boardwalk through the mangrove
    fill(g, 7, 5, 8, 15, 'W');                             // ...and up to the old pinang palm
    fill(g, 2, 20, 41, 21, 'w'); fill(g, 40, 2, 41, 21, 'w');   // tidal channels, black and still
    fill(g, 12, 20, 13, 21, 'W'); fill(g, 30, 20, 31, 21, 'W'); fill(g, 40, 9, 41, 10, 'W'); fill(g, 40, 13, 41, 15, 'W');   // plank bridges
    fill(g, 13, 9, 16, 12, 'g'); fill(g, 30, 22, 33, 26, 'g');
    fill(g, 2, 27, W - 3, 29, 's'); fill(g, 0, 28, 1, 29, 's'); fill(g, W - 2, 27, W - 1, 29, 's');
    fill(g, 0, 30, W - 1, H - 1, 'o');
    fill(g, 23, 15, 24, 26, 'W');                          // the walk down to the beach
    return g;
  }
  var B_OBJ = [
    { id: 'bk_pinang', type: 'pinang9', x: 5, y: 3, w: 2, h: 2, tex: 'pinang_tua', keep: true },
    { id: 'bk_perahu', type: 'cari9', i: 0, x: 43, y: 27, w: 3, h: 1, tex: 'perahu9', keep: true },
    { id: 'bk_perigi', type: 'cari9', i: 1, x: 14, y: 10, w: 2, h: 2, tex: 'perigi9', keep: true },
    { id: 'bk_buaian', type: 'cari9', i: 2, x: 31, y: 23, w: 2, h: 2, tex: 'buaian9', keep: true },
    { id: 'bk_sign', type: 'signpost', x: 51, y: 12, tex: 'sign', text: 'PANTAI BAKAU.  (Underneath, in charcoal: Kalau dengar orang menyanyi, jangan jawab. If you hear somebody singing, do not answer.)' },
    // the Ulek Mayang, on the beach (step 4), and the whirlpool to the princesses' cave (from step 5)
    { id: 'bk_pawang', type: 'pawang9', x: 22, y: 27, tex: 'npc_tok_pawang_0', when: function (S) { return c9(S) === 4; } },
    { id: 'bk_upacara', type: 'bldg', x: 24, y: 27, w: 2, h: 1, tex: 'upacara9', keep: true, light: 0xffd080, when: function (S) { return c9(S) === 4; }, text: 'The mayang, standing in a jar of sea water between two lamps, and seven little bowls of yellow rice in a row.' },
    { id: 'bk_pusaran', type: 'dive9', x: 24, y: 30, w: 2, h: 1, tex: 'pusaran9', keep: true, when: function (S) { var s = c9(S); return s >= 5; } }
  ];
  LC.C9.lamps.forEach(function (t, i) { B_OBJ.push({ id: 'bk_lamp' + i, type: 'lampu9', i: i, x: t[0], y: t[1], tex: 'pelita9', light: 0xffc070 }); });
  LC.AREAS.bakau = {
    name: 'Pantai Bakau', sub: 'the mangrove and its black beach', lvl: 20, build: buildBakau, objects: B_OBJ,
    pond: 'sea', amb: 'river', fog: true, dim: true, decor: { n: 50, types: ['akar9', 'akar9', 'nipah9', 'fern', 'akar9b'], on: 'g' },
    trees: { n: 70, on: 'g', tex: ['bakau9', 'bakau9b', 'bakau9'], text: 'A mangrove tree, standing on its roots like a thing about to walk. Its roots drip.' },
    clear: [{ x: 5, y: 5, r: 3 }, { x: 14, y: 11, r: 3 }, { x: 31, y: 24, r: 3 }, { x: 30, y: 18, r: 2 }, { x: 12, y: 18, r: 2 }, { x: 44, y: 26, r: 2 }, { x: 24, y: 27, r: 3 }].concat(LC.C9.lamps.map(function (t) { return { x: t[0], y: t[1] + 1, r: 2 }; })),
    exits: [{ x0: 55, y0: 13, x1: 55, y1: 15, to: 'kabus', sx: 2.5, sy: 14.5, dir: 'right' }],
    home: { x: 53.5, y: 14.5 }, ride: {}
  };

  // ================================================================ Gua Puteri Tujuh (under the sea, beneath the whirlpool)
  function buildGua() {
    var W = 36, H = 26, g = grid(W, H, 'X');
    ell(g, 18, 12, 14.5, 9.5, 'u');
    ell(g, 18, 12, 4, 2.5, 'C');                           // the black rock in the middle, where Bongsu sits and weeps
    fill(g, 17, 21, 18, 23, 'u');
    return g;
  }
  var G_OBJ = [
    { id: 'gt_naik', type: 'naik9', x: 17, y: 22, w: 2, h: 1, tex: 'pusaran9', keep: true },
    { id: 'gt_cermin', type: 'bldg', x: 5, y: 10, w: 2, h: 2, tex: 'cermin9', keep: true, text: 'A mirror of polished shell, taller than you. In it, behind your shoulder, something moves. When you turn around, nothing is there.' },
    { id: 'gt_cermin2', type: 'bldg', x: 29, y: 10, w: 2, h: 2, tex: 'cermin9', keep: true, text: 'Another shell mirror. Your reflection blinks a moment after you do.' }
  ];
  LC.C9.clams.forEach(function (t, i) { G_OBJ.push({ id: 'gt_kima' + i, type: 'kima9', i: i, x: t[0], y: t[1], w: 2, h: 1, tex: 'kima9' }); });
  LC.AREAS.guatujuh = {
    name: 'Gua Puteri Tujuh', sub: 'the cave of the seven princesses, under the sea', lvl: 20, needs: 'naga', build: buildGua, objects: G_OBJ,
    pond: null, amb: 'cave', underwater: true, ride: {}, decor: { n: 18, types: ['shellrock', 'anemone', 'seagrass', 'shellrock'], on: 'u' },
    clear: [{ x: 18, y: 21, r: 2 }], exits: [], home: { x: 18, y: 20.6 }
  };
  LC.AREA_HOWTO.kabus = 'Sail on the jong from Nenek\'s jetty (Chapter 9).';
  LC.AREA_HOWTO.bakau = 'Walk west from Kampung Pantai Kabus (Chapter 9).';
  LC.AREA_HOWTO.guatujuh = 'Dive into the whirlpool off Pantai Bakau (Chapter 9).';
  // the empty boat that drifts to Nenek's jetty at the start
  LC.OBJECTS.push({ id: 'f_perahu9', type: 'hanyut9', x: 18, y: 30, w: 2, h: 1, tex: 'perahu9s', keep: true, when: function (S) { return c9(S) === 1; } });

  // ================================================================ the people of Pantai Kabus, and the princess
  function look(shirt, hat, extra) { return Object.assign({ skin: '#a8714a', shirt: shirt, shirt2: shirt, bottom: '#5a4a3a', bottom2: '#40342a', hair: '#1a1210', hat: hat }, extra || {}); }
  Object.assign(LC.VILLAGERS, {
    mak_som: {
      name: 'Mak Som', role: 'Pak Awang\'s wife', area: 'kabus', post: { x: 19, y: 12 },
      look: look('#7a3a5a', 'tudung', { skin: '#a8714a', shirt2: '#c8a040', hatColor: '#3a2a4a', bottom: '#4a3a6a', bottom2: '#342a4e' }),
      intro: ['You came off that big jong? From across the sea? Then you did not hear it on the way. Good. Good.', 'I am Som. My husband is Awang, the fisherman. Was. Is. I do not know what he is any more.'],
      chat: ['Awang hums when he mends the nets. Always the same song, always out of tune. I used to tease him for it.', 'Turmeric, coconut, a pinch of salt. Rice for guests. My mother taught me, and her mother taught her.', 'The sea gives us everything. Sometimes it wants something back.', 'Keropok lekor! If you are ever hungry, there is always keropok lekor in this house.'],
      tasks: [['ikan_kembung', 3, 4], ['kelapa', 2, 3], ['nasi', 2, 3]], taskText: 'for Mak Som\'s kitchen', gifts: { 3: ['kepeng', 800], 6: ['mutiara', 1], 10: ['kepeng', 2000] }
    },
    tok_pawang: {
      name: 'Tok Pawang', role: 'The old healer of Pantai Kabus', area: 'kabus', post: { x: 38, y: 12 },
      look: look('#3a4a3a', 'tanjak', { skin: '#9a6440', hair: '#d8d4cc', beard: '#d8d4cc', bottom: '#5a3a2a', bottom2: '#40281e' }),
      intro: ['So. The little light has come, and a child with it. Sit. Do not look at the sea while we talk.', 'They call me Tok Pawang. I know the old songs of this coast: the ones for the rice, the ones for the boats... and the one we do not sing.'],
      chat: ['Every song is a door. Some doors should stay shut.', 'The sea folk are not wicked. They are lonely, and they are old, and they forget how small we are.', 'My grandfather sang the Ulek Mayang once, sixty years ago. He never sang again. He said once was enough for a lifetime.', 'Mayang for the dance, rice for the guests, and a steady voice. That is all the old ways ask.'],
      tasks: [['herba', 2, 3], ['kayu', 3, 4], ['pinang_muda', 1, 2]], taskText: 'for the old healer', gifts: { 3: ['herba', 3], 6: ['kepeng', 1500], 10: ['mutiara', 2] },
      hideIf: function (S) { return c9(S) === 4; }
    },
    pak_awang: {
      name: 'Pak Awang', role: 'The fisherman who came back', area: 'kabus', post: { x: 22, y: 12 },
      look: look('#2a4a6a', 'terendak', { skin: '#8a5a38', bottom: '#7a2a2a', bottom2: '#5a1e1e', beard: '#3a2a1a' }),
      intro: ['You! You are the one who brought me home. Som told me everything. Well. She told me twice, and cried both times.', 'I remember the storm. I remember singing, to keep my courage up. After that... cold water, and somebody holding my hand. Very tightly.'],
      chat: ['I still hum that song when I mend the nets. Quietly. Very quietly.', 'Some nights I see a light out past the reef. I wave. It waves back.', 'Ikan kembung are best fried with turmeric. Do not let Som tell you otherwise.', 'I will never sing in a storm again. I will whistle. Whistling is safer.'],
      tasks: [['ikan_kembung', 4, 6], ['ikan_kerapu', 1, 2], ['kayu', 2, 3]], taskText: 'for the fisherman\'s boat', gifts: { 3: ['ikan_kerapu', 2], 6: ['kepeng', 1500], 10: ['mutiara', 3] },
      hideIf: function (S) { return c9(S) < 7; }
    },
    puteri_bongsu: {
      name: 'Puteri Bongsu', role: 'The youngest of the seven sea princesses', area: 'bakau', post: { x: 27, y: 28 }, sprite: true, glow: 0x9ae8e0,
      intro: ['...You came back. I thought you would not. Everybody goes back to the land in the end.', 'I am Bongsu, the youngest of seven. I am sorry I frightened you. I am sorry about Awang. I only wanted somebody to sing to me.'],
      chat: ['The sea is very big, and very quiet. You would sing too, if you lived here.', 'My sister Sulung says I must make friends on land the proper way. With manners. And food.', 'Awang waves at me some nights. I wave back. That is enough. That is allowed.', 'Teach me a land song? Not that one. Any other one.'],
      tasks: [['mutiara', 1, 1], ['nasi_lemak', 1, 2], ['kerang', 2, 4]], taskText: 'for the youngest princess', gifts: { 3: ['mutiara', 2], 6: ['kepeng', 1500], 10: ['mutiara', 4] },
      hideIf: function (S) { return c9(S) < 7 || !LC.isDusk(S); }
    }
  });
  LC.SPEAKERS = Object.assign(LC.SPEAKERS || {}, {
    bongsu: { name: 'Puteri Bongsu', portrait: 'bongsu_face' },
    bongsuW: { name: 'Puteri Bongsu', portrait: 'bongsu_face9' },     // (her wild face)
    sulung: { name: 'Puteri Sulung', portrait: 'sulung_face' },
    lima: { name: 'The five princesses', portrait: 'puteri_face9' },
    suara: { name: '???', portrait: 'awang_face9' },                   // the woman's voice, in Awang's mouth
    awang: { name: 'Pak Awang', portrait: 'npc_pak_awang_0' }
  });

  // ================================================================ the story, in their words
  LC.CH9TEXT = {
    hook: [
      { text: 'It is late, and the farm is quiet. Then, under the crickets, under the river, you hear it.' },
      { text: 'Somebody is singing. A woman\'s voice, high and slow and very sad, coming from somewhere out over the water. The words are too far away to make out.' },
      { who: 'pelita', expr: 'sad', text: '(Pelita\'s light shrinks to a tiny flicker. It hides behind your shoulder and will not come out.)' },
      { text: 'Something bumps against the jetty. A fishing boat, painted red, green and gold, with a carved bird at the bow, drifts in out of the dark. There is nobody in it.' },
      { who: 'nenek', text: '(Nenek comes down from the house with a lamp, in her sleeping kain.) Cucu? Who is singing at this hour? ...Aduh, where did THAT come from?' },
      { who: 'nenek', text: 'That is a Terengganu boat, from the east coast. See the bangau bird on the bow? The fishermen of Pantai Kabus paint them like that.' },
      { who: 'nenek', text: 'Boats do not cross the sea by themselves, cucu. And songs do not come across the sea by themselves either.' },
      { text: '✦ Chapter 9: Ulek Mayang (The Song from the Sea) ✦  Look inside the empty boat at the farm jetty, then sail on the jong to Kampung Pantai Kabus.' }
    ],
    boat: 'An empty Terengganu fishing boat. Inside: a torn net, a wet sarong, and a long pale palm blossom, a mayang, laid very carefully across the seat. Painted on the side: PANTAI KABUS.',
    boatHint: 'An empty Terengganu fishing boat, bumping against the jetty. Painted on the side: PANTAI KABUS. (The jong can sail there now.)',
    sail: [
      { text: 'The jong sails east all night. Juragan Wira does not let his sailors sing their usual songs. "Not on this sea," he says. "Not tonight."' },
      { text: 'Towards morning, a wall of grey fog rises out of the water. The jong sails into it, and the morning never comes.' }
    ],
    sailBack: [{ text: 'The jong slides back into the fog. On the shore, every lamp in Pantai Kabus is lit, though it should be the middle of the day.' }],
    arrive: [
      { text: 'Kampung Pantai Kabus. By the sun it should be morning, but there is no sun: only fog, and a sky as dark as midnight.' },
      { text: 'Down on the beach, three fishermen stand at the edge of the water with their eyes shut, swaying, humming. None of them turns to look at you.' },
      { who: 'pelita', expr: 'sad', text: '(Pelita presses against your neck, cold and trembling.)' },
      { text: 'Up by the houses, a woman with a lamp is waving at you, fast, as if to say: come away from the beach. Quickly.' }
    ],
    som: [
      { who: 'mak_som', text: 'Do not stand on the sand like that! Come up here, by the lamps. ...You came on that jong? From the west? Then the sea let you through. Good.' },
      { who: 'mak_som', text: 'Four nights ago there was a storm. My husband Awang was out at sea in it. He always sings when he is scared, out of tune, to keep his courage up.' },
      { who: 'mak_som', text: 'He came home at dawn. He walked up the beach, sat down on the steps, and did not say one word. Not one. And the sun has not come up since.' },
      { who: 'mak_som', text: 'Every night he walks into the sea. And every night he SINGS. Not his song. Not his voice. A woman\'s voice, coming out of my husband\'s mouth.' },
      { who: 'mak_som', text: 'And now the other men stand on the beach and hum along, with their eyes shut. Tonight Awang did not come back at all. I can hear him. Out there, past the mangrove.' },
      { text: 'She stops. Far away to the west, a woman\'s voice is singing.' },
      { who: 'mak_som', text: 'Please. I cannot go in there. Nobody here will. Find him. Follow the song, and bring my husband home.' },
      { text: 'New task: go west into Pantai Bakau, the mangrove, and find where the song is coming from. (Listen: the song is louder the closer you get, and it comes from one side. A faint light at the edge of the screen shows the way.)' }
    ],
    enter: [
      { text: 'Pantai Bakau. The mangrove trees stand on their roots in the black mud like things that are about to walk. The fog is so thick you can barely see the boardwalk under your feet.' },
      { text: 'And everywhere, nowhere, the song.' }
    ],
    // the three wrong places
    find0: 'The song stops dead. An empty perahu, rocking on the sand. A wet mayang blossom lies inside... and someone giggles, right behind you.',
    find1: 'The song stops. You lean over the old well. In the black water, a pale face looks up at you...',
    find1b: '...and it is gone. Only your own reflection. Isn\'t it? The song starts again, somewhere else.',
    find2: 'An old swing hangs from a mangrove branch, creaking back and forth, back and forth. Nobody is on it. The singing is behind you now: out on the sea.',
    find3: 'There. Out in the black water, up to his waist, a man stands with his back to the shore. He is the one singing.',
    found: [
      { text: 'The song stops. In the silence, the man in the sea turns his head. Slowly. Much too far.' },
      { who: 'suara', text: '...Dia milik aku. He is MINE. He sang to me in the storm. He sang to ME.' },
      { text: 'His eyes are white, like the moon on water. Then the light goes out of them, and Pak Awang falls face down into the sea.' },
      { text: 'A lamp bobs towards you along the beach: an old man, wading into the water, hauling Pak Awang out by the collar, puffing.' },
      { who: 'tok_pawang', text: 'Help me, child, help me! Get his arms. Do not look at the water. Whatever you hear, do not answer it.' },
      { text: 'Together you drag Pak Awang up the sand. He is breathing. But he is as cold as a fish, and his eyes will not open.' },
      { who: 'tok_pawang', text: 'He is alive. His body is alive. But his semangat, his spirit... that is still out there. Bring him back to the village. Then come to my hut. We must talk.' }
    ],
    pawang: [
      { who: 'tok_pawang', text: 'Sit. And thank you for not answering her. Most people answer. You must never answer.' },
      { who: 'tok_pawang', text: 'Out past the reef live seven sisters: the seven princesses of the sea. They are older than this village. They are not wicked. But they are very old, and very lonely.' },
      { who: 'tok_pawang', text: 'The youngest of them, Puteri Bongsu, heard Awang singing in the storm. Out of tune, scared, alone in his little boat. She thought he was singing for HER.' },
      { who: 'tok_pawang', text: 'So she kept him. His body came home. His semangat stayed with her. She sings through him at night, so we will know she has him.' },
      { who: 'tok_pawang', text: 'There is a song that calls the princesses up onto the beach. The Ulek Mayang. My grandfather sang it once. He told me never to sing it unless a life depended on it.' },
      { who: 'tok_pawang', text: '...A life depends on it.' },
      { who: 'tok_pawang', text: 'I need a mayang: the blossom of the old pinang palm, deep in the mangrove, at the end of the old boardwalk. And food for seven guests, as the old manners say: Nasi Kunyit. Som will cook it, if you bring her rice.' },
      { who: 'tok_pawang', text: 'And child. Bongsu will not like you taking that mayang. If she comes for you: when her singing stops, do not move. Not a finger. And stay near the old lamps. She hates the lamps.' },
      { text: 'New task: take the mayang from the old pinang palm in Pantai Bakau (north-west, at the end of the boardwalk), and ask Mak Som to cook Nasi Kunyit (7 nasi, 1 kelapa).' }
    ],
    palm: 'The old pinang palm leans out over the black water. High up, a long pale mayang hangs in its sheath, like a closed hand.',
    palmTake: 'You reach up and pull the mayang free. It comes away with a soft wet snap. All around you, the mangrove goes silent. Even the frogs.',
    chaseGo: 'Right behind you, somebody begins to sing. RUN! Back along the boardwalk to the village. When her singing stops, DO NOT MOVE. The old lamps keep you safe.',
    shh: 'Shhh... she is listening. Do not move.',
    caught: 'Cold hands! You stumble back to the last lamp, gasping.',
    lampSafe: 'The lamp\'s light holds her back. She circles at the edge of it, singing.',
    chaseEnd: 'You burst out of the mangrove into the lamplight of the village. Behind you, among the trees, a long, furious wail... and then silence. She cannot follow you here.',
    somNasi: 'Rice for seven guests from the sea. Yellow, with turmeric, and coconut milk, the way my mother made it. They will be hungry, Tok says. They are always hungry.',
    ready: [
      { who: 'tok_pawang', text: 'The mayang. And the rice. Good. Then it will be tonight. Well. It is always tonight, here, now.' },
      { who: 'tok_pawang', text: 'We sing on the beach at Pantai Bakau, where Awang stood. I will sing a line, and you will sing it back. Not one note wrong: the sea is listening.' },
      { who: 'tok_pawang', text: 'Five will come first. Then the one who took him. Then, if we are lucky, the eldest. Only the eldest can make Bongsu let go.' },
      { text: 'New task: meet Tok Pawang on the beach at Pantai Bakau, and sing the Ulek Mayang with him.' }
    ],
    ritualStart: [
      { text: 'Tok Pawang sets the mayang in a jar of sea water, between two little lamps, and lays out the seven bowls of yellow rice on the sand.' },
      { who: 'tok_pawang', text: 'Watch the lamps, and listen. I sing, then you sing it back. One note at a time. Steady, now.' }
    ],
    verse: [
      { my: 'Ulek mayang, ku ulek mayang... lima puteri, naiklah ke pantai.', en: '(I sway the mayang, I sway it... five princesses, come up to the shore.)' },
      { my: 'Ulek mayang, ku ulek mayang... puteri bongsu, pulangkan semangat.', en: '(I sway the mayang, I sway it... youngest princess, give back his spirit.)' },
      { my: 'Ulek mayang, ku ulek mayang... puteri sulung, damaikan lautan.', en: '(I sway the mayang, I sway it... eldest princess, bring peace to the sea.)' }
    ],
    wrong: 'A wrong note! The sea hisses. Something out in the dark laughs. Again...',
    five: [
      { text: 'Out in the black water, five pale shapes rise, one after another. Five women, with long wet hair, and eyes that shine like fish scales. They drift towards the shore without walking.' },
      { who: 'lima', text: 'Who calls us? Who sings our song on the sand? We are hungry, land-child. We have been hungry for a hundred years.' },
      { who: 'tok_pawang', text: '(whispering) The rice. Serve them the rice. Bowl by bowl. And smile, child. Guests must be welcomed.' },
      { text: 'You set the bowls of yellow rice at the water\'s edge, one by one. The five princesses bend over them. When they rise, the bowls are empty and their eyes are a little less cold.' },
      { who: 'lima', text: '...Kind. Kind land-child. But you did not call us for rice. You want what our little sister took. Sing, then. Call her, if you dare.' }
    ],
    bongsuRise: [
      { who: 'bongsuW', text: 'NO! He is MINE! He sang to me! Nobody ever sings to me!' },
      { text: 'Puteri Bongsu rises out of the sea in a burst of black water, hair streaming, holding a small warm light against her chest: Pak Awang\'s spirit.' },
      { who: 'bongsuW', text: 'You cannot have him! I will hide him where you will NEVER find him!' },
      { text: 'She dives. The sea where she vanished begins to turn, slowly, then faster: a whirlpool, glowing faintly from far below.' },
      { who: 'tok_pawang', text: 'Sing, child! The last verse! Call the eldest, before Bongsu takes him too deep!' }
    ],
    sulung: [
      { text: 'The sea goes still. Perfectly still, like glass. Out of it rises the seventh princess, the eldest, crowned with coral and pearl, and the fog draws back from her like a curtain.' },
      { text: 'The five princesses bow low. Tok Pawang drops to his knees in the sand. Even the whirlpool slows.' },
      { who: 'sulung', text: 'Child of the little light. You sang our song well, and you fed my sisters with good manners. Few on the land remember how.' },
      { who: 'sulung', text: 'My youngest sister has done a foolish, lonely thing. She has gone down to our cave, beneath the whirlpool, with the fisherman\'s spirit.' },
      { who: 'sulung', text: 'Go after her. Ride your little naga, or swim. She will not harm you while I am watching. Bring the fisherman\'s spirit home.' },
      { text: 'New task: dive into the whirlpool off Pantai Bakau, and find Pak Awang\'s spirit in Gua Puteri Tujuh.' }
    ],
    cave: [
      { text: 'Gua Puteri Tujuh. A cave under the sea, as black as ink, lined with mirrors of polished shell. In every mirror, something moves just behind you.' },
      { text: 'Seven giant clams lie around the black rock in the middle. On the rock, somebody is crying, very softly, and singing between the sobs.' },
      { text: 'And under her singing, from one of the clams, a second voice: a man, humming, out of tune.' },
      { text: 'New task: find the clam where Pak Awang\'s spirit is humming. Listen carefully: the wrong clams do not like being opened.' }
    ],
    clamWrong: ['SNAP! The clam slams shut, an inch from your fingers. Inside: cold black water, and a whisper: "Wrong..."', 'The clam opens on nothing but a pale eye, which blinks, and is gone. SNAP.', 'Empty. Only a long strand of wet black hair... which slithers back into the dark. SNAP!'],
    clamDone: 'This clam is shut tight. It is not this one.',
    spirit: [
      { text: 'The clam opens slowly. Inside, curled up on a bed of pearls, a small warm light hums a fisherman\'s song, a little out of tune.' },
      { who: 'bongsu', text: '...Please. Please do not take him. He is the only one who ever sang to me.' },
      { text: 'Puteri Bongsu is standing behind you. Up close, without the storm in her hair, she looks very young.' },
      { who: 'bongsu', text: 'I live at the bottom of the sea. It is so quiet. Nobody sings down here. And then, in the storm, a little boat, and a little voice, singing...' },
      { who: 'bongsu', text: 'I only wanted to keep the song. I thought, if I keep HIM, I can keep the song for always.' },
      { who: 'sulung', text: 'Bongsu.' },
      { text: 'The eldest princess is there, in the doorway of the cave, though you never saw her come in.' },
      { who: 'sulung', text: 'You cannot keep a song by keeping the singer, little sister. A caged bird does not sing. Yang laut balik ke laut, yang darat balik ke darat.' },
      { who: 'sulung', text: '(to you) What belongs to the sea goes back to the sea. What belongs to the land goes back to the land. That is the oldest law there is.' },
      { who: 'bongsu', text: '...I know. I know. I am sorry.' },
      { text: 'Bongsu lifts the little light out of the clam with both hands, and gives it to you. It is warm, like a cup of tea.' },
      { who: 'bongsu', text: 'Tell him... tell him he sings very badly. And that I liked it.' },
      { text: 'New task: take Pak Awang\'s spirit back to him, in Kampung Pantai Kabus.' }
    ],
    awangCold: 'Pak Awang lies on a mat by his house, wrapped in a sarong, as cold and still as a fish on ice. Mak Som sits beside him, holding his hand.',
    finale: [
      { text: 'You kneel beside Pak Awang and open your hands. The little light hums, floats up... and sinks gently into his chest.' },
      { text: 'For a moment, nothing. Then Pak Awang gasps, coughs up a mouthful of sea water, and sits bolt upright.' },
      { who: 'awang', text: 'Som? SOM! Why is everybody staring? Why am I wet? Why do I taste of SEAWEED?' },
      { who: 'mak_som', text: 'Awang! You old fool, you stupid old fool! (She hugs him so hard he squeaks.)' },
      { text: 'Down on the beach, the three fishermen open their eyes, blink at the sea, and wander home, scratching their heads, asking each other why their feet are wet.' },
      { text: 'And then, over the sea, for the first time in five days, the sky turns grey... then pink... then gold. The sun comes up over Pantai Kabus, and the fog melts away like sugar in tea.' },
      { who: 'tok_pawang', text: 'Well. Well, well. Sixty years I have waited to hear the end of that song. It was worth the wait.' },
      { text: 'Out past the reef, two pale figures stand on the water in the sunrise: the eldest princess, and a smaller one, waving. Pak Awang squints at them, and waves back.' },
      { who: 'sulung', text: '(Her voice comes over the water, close as a whisper.) Child of the little light. The song that calls us can also calm. Keep it. Sing it, and anything angry around you will forget its anger, for a while.' },
      { who: 'pelita', expr: 'happy', text: '(Pelita bursts out from behind your shoulder, blazing gold, and does three loops in the sunrise.)' },
      { text: '✦ You learned Lagu Mayang! Press L (or tap the mayang button above the wau) to sing: every enemy around you falls into a trance, swaying, for a few seconds. ✦' },
      { text: '✦ Chapter 9 complete: Ulek Mayang ✦  Pak Awang is home, the sun is up over Pantai Kabus, and Puteri Bongsu walks the beach of Pantai Bakau on quiet nights.' }
    ],
    nenekSong: ['I could not sleep, after that singing. I sat up with the lamp and sang the old lullabies, loudly. To show the night who is boss.', 'My grandmother said: if you hear singing over the water, put a lamp in the window and do not answer. Good advice, I think.', 'Pantai Kabus... I went there once, when I was a girl. The keropok lekor! I still dream about it.', 'Be careful, cucu. The sea folk are not wicked. But they do not always know their own strength.'],
    nenekAfter: ['A princess of the sea, fell in love with a fisherman for his singing? Hah! Your grandfather sang like a frog in a well. Nobody ever stole him.', 'Mak Som sent keropok lekor all the way across the sea! Pelita ate three before I could stop it.', 'Sing me that song? ...No. No, on second thoughts, do not. Some songs are for emergencies.', 'Every lamp in my house is lit tonight. Not because I am scared. Because it is pretty.'],
    lagu: ['Lagu Mayang!', 'Ulek mayang...', 'Hmmm mmm mmm...'],
    entranced: ['~ ~ ~', '(swaying)', 'Hmm...']
  };
})(window.LC);
