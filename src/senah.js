/* Chapter 14: Hantu Kak Senah? (v3.13). An original kampung comedy ghost story. The user asked for a chapter in the
 * spirit of Malaysian comedy-horror films; the cast, place and story here are our own.
 * Kak Senah, Kampung Tepian's loud and loving kuih seller, has gone away, and every night her house laughs, smells of
 * kuih and shows a white figure at the window. The kampung is sure she has become a ghost. Pelita does not glow at it.
 * Steps (S.quests.ch14): 0 the whispers at the pondok (night) · 1 peek through her window (night) · 2 three clues
 * (night): the bedsheet on the line, Si Tiong the myna, Amin at the stove · 3 the pots rattle: the Penunggu Rumah ·
 * 4 the next night after 10 PM: the mob, and Kak Senah comes home in her bedak sejuk · 5 round up the runaways ·
 * 6 Pelita's light shows her honest shadow · 7 done (seri muka and its recipe, 800 kepeng, +15 max energy).
 * Kak Senah's lane starts at the top of Kampung Tepian, between the two vegetable plots (x 32, y 2). */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var C = LC.C14 = {
    end: 7, night: 19 * 60, late: 22 * 60,
    ready: function (S) { return !!(S && S.quests && LC.C13 && LC.C13.step(S) >= LC.C13.end); },
    step: function (S) { return (S && S.quests && S.quests.ch14) || 0; },
    gate: { x: 15, y: 21 }, spawn: { x: 15, y: 19 }, yard: { x: 16, y: 14 },
    kak: { x: 16, y: 11 }, palm: { x: 25, y: 13 }, reban: { x: 24, y: 17 }, pisang: { x: 7, y: 8 }
  };
  function st(S) { return C.step(S); }
  function q(S) { return S.quests; }
  function folk(id, who, x, y, when) { return { id: id, type: 'senah_folk', who: who, x: x, y: y, tex: 'npc14_' + who + '_0', keep: true, when: when }; }
  function found(S, who) { return !!(q(S).c14found || {})[who]; }
  function back(who) { return function (S) { var s = st(S); return s === 6 || s >= C.end || (s === 5 && found(S, who)); }; }
  function hiding(who) { return function (S) { return st(S) === 5 && !found(S, who); }; }
  function notHiding(who) { var h = hiding(who); return function (S) { return !h(S); }; }

  // ---------------------------------------------------------------- the place
  function grid(w, h, tile) { return Array.from({ length: h }, function () { return new Array(w).fill(tile); }); }
  function fill(g, x0, y0, x1, y1, tile) { for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) g[y][x] = tile; }
  var OBJ = [
    { id: 'sn_back', type: 'senah_back', x: 15, y: 21, w: 2, h: 1, tex: 'senah_gate', keep: true },
    { id: 'sn_rumah', type: 'senah_house', x: 12, y: 7, w: 6, h: 4, tex: 'senah_rumah', keep: true, light: 0xffc070 },
    { id: 'sn_line', type: 'senah_line', x: 20, y: 9, w: 3, h: 1, tex: 'senah_line_0', keep: true },
    { id: 'sn_sangkar', type: 'senah_sangkar', x: 11, y: 10, tex: 'senah_sangkar_0', keep: true },
    { id: 'sn_dapur', type: 'senah_dapur', x: 19, y: 6, w: 2, h: 2, tex: 'senah_dapur', keep: true, light: 0xff9a50 },
    { id: 'sn_tempayan', type: 'bldg', x: 18, y: 11, tex: 'tempayan', keep: true, text: 'A big clay tempayan of rainwater. Something has drawn a smiley face in the dust on its lid.' },
    { id: 'sn_pondok', type: 'bldg', x: 4, y: 15, w: 4, h: 3, tex: 'pondok', keep: true, text: 'A little pondok where the neighbours sit and talk in the evening. Tonight it is mostly whispering.' },
    { id: 'sn_penunggu', type: 'senah_penunggu', x: 13, y: 11, tex: 'senah_penunggu_0', keep: true, when: function (S) { return st(S) >= 3; } },
    // the banana grove, the palm and the coop (where three runaways hide on the last night)
    { id: 'sn_pisang0', type: 'bldg', x: 4, y: 5, tex: 'banana', keep: true, text: 'Kak Senah\'s banana grove. The leaves whisper whenever the wind blows. Only the wind, surely.' },
    { id: 'sn_pisang1', type: 'bldg', x: 6, y: 3, tex: 'banana', keep: true, text: 'A banana tree, heavy with green fruit.' },
    { id: 'sn_pisang2', type: 'bldg', x: 3, y: 9, tex: 'banana', keep: true, text: 'Banana leaves, for wrapping Kak Senah\'s kuih.' },
    { id: 'sn_pisang3', type: 'bldg', x: 7, y: 8, tex: 'banana', keep: true, when: notHiding('amin'), text: 'A banana tree. Its leaves rustle.' },
    { id: 'sn_pisang_amin', type: 'senah_hide', who: 'amin', x: 7, y: 8, tex: 'senah_pisang_amin', keep: true, when: hiding('amin') },
    { id: 'sn_palm', type: 'bldg', x: 25, y: 13, tex: 'palm', keep: true, when: notHiding('jusoh'), text: 'A tall coconut palm. The trunk has fresh scratch marks, as if someone climbed it in a great hurry once.' },
    { id: 'sn_palm_jusoh', type: 'senah_hide', who: 'jusoh', x: 25, y: 13, tex: 'senah_palm_jusoh', keep: true, when: hiding('jusoh') },
    { id: 'sn_reban', type: 'bldg', x: 24, y: 17, w: 3, h: 2, tex: 'reban', keep: true, when: notHiding('bahar'), text: 'Kak Senah\'s chicken coop. The hens look unimpressed.' },
    { id: 'sn_reban_bahar', type: 'senah_hide', who: 'bahar', x: 24, y: 17, w: 3, h: 2, tex: 'senah_reban_bahar', keep: true, when: hiding('bahar') },
    // the people: frightened at the pondok on the first night, back in the yard at the end
    folk('sn_jusoh0', 'jusoh', 8, 16, function (S) { return st(S) <= 1; }),
    folk('sn_bahar0', 'bahar', 9, 17, function (S) { return st(S) <= 1; }),
    folk('sn_imam0', 'imam', 8, 18, function (S) { return st(S) <= 1; }),
    folk('sn_amin1', 'amin', 19, 8, function (S) { var s = st(S); return s === 3 || (s === 2 && !!q(S).c14amin); }),
    folk('sn_jusoh1', 'jusoh', 20, 13, back('jusoh')),
    folk('sn_bahar1', 'bahar', 21, 14, back('bahar')),
    folk('sn_amin2', 'amin', 18, 13, back('amin')),
    folk('sn_imam1', 'imam', 14, 13, function (S) { return st(S) >= C.end; }),
    { id: 'sn_kak_mask', type: 'senah_kak', x: 16, y: 11, tex: 'npc14_senah_mask_0', keep: true, when: function (S) { var s = st(S); return s >= 5 && s < C.end; } },
    { id: 'sn_kak', type: 'senah_kak', x: 16, y: 11, tex: 'npc14_senah_0', keep: true, when: function (S) { return st(S) >= C.end; } }
  ];
  [[27, 4], [28, 9], [27, 20], [3, 20], [10, 3]].forEach(function (t, i) { OBJ.push({ id: 'sn_tree' + i, type: 'bldg', x: t[0], y: t[1], tex: i % 2 ? 'palm' : 'banana', keep: true, text: i % 2 ? 'A coconut palm.' : 'A banana tree at the edge of the jungle.' }); });
  LC.AREAS.senah = {
    name: 'Rumah Kak Senah', sub: 'the house at the end of the lane', lvl: 2, home: { x: 15, y: 19 }, pond: 'river', amb: 'river',
    decor: { n: 18, types: ['bush', 'hibiscus', 'lalang', 'bush'], on: '.' },
    build: function () {
      var g = grid(32, 24, 'J');
      fill(g, 2, 2, 29, 21, '.');
      fill(g, 15, 14, 16, 21, 'p');            // the lane
      fill(g, 11, 11, 22, 14, 'p');            // the swept yard
      fill(g, 8, 15, 14, 16, 'p');             // the path to the pondok
      fill(g, 19, 8, 21, 10, 'p');             // to the kitchen
      return g;
    },
    objects: OBJ, exits: [], ride: {}
  };
  // the lane from Kampung Tepian (at the top, between the two vegetable plots)
  LC.AREAS.kampung.objects.push({ id: 'k_senah_lane', type: 'senah_way', x: 32, y: 2, w: 2, h: 1, tex: 'senah_gate', keep: true, when: C.ready });

  // ---------------------------------------------------------------- Kak Senah's seri muka
  function addItems(map) { Object.keys(map).forEach(function (id) { var it = map[id]; it.id = id; it.icon = it.icon || 'i_' + id; LC.ITEMS[id] = it; }); }
  addItems({ seri_muka: { name: 'Seri Muka', kind: 'dish', sell: 130, food: { full: 45, joy: 32 }, desc: 'Kak Senah\'s famous kuih: sticky rice below, smooth green pandan custard on top. The whole kampung can smell when she makes it.' } });
  var RECIPE = { out: 'seri_muka', inp: { padi: 1, pandan: 1, kelapa: 1 } };
  LC.senahRecipe = function (S) {   // the recipe is at the dapur once Kak Senah has taught it (and gone again if another save is loaded)
    var want = !!(S && C.step(S) >= C.end), i = LC.RECIPES.indexOf(RECIPE);
    if (want && i < 0) LC.RECIPES.push(RECIPE);
    if (!want && i >= 0) LC.RECIPES.splice(i, 1);
  };
  // the Penunggu Rumah's blessing: home-cooked warmth, +15 max energy
  var recalc = LC.State.recalc;
  LC.State.recalc = function () {
    recalc.apply(this, arguments);
    var s = this.s;
    if (s && s.quests && C.step(s) >= C.end) s.maxEnergy += 15;
  };

  // ---------------------------------------------------------------- the sounds of a haunted house
  var sfx = LC.Audio.sfx;
  LC.Audio.sfx = function (name) {
    var A = LC.Audio;
    if (name !== 'laugh14' && name !== 'clang14' && name !== 'scream14') return sfx.apply(this, arguments);
    if (!A.ctx || A.ctx.state !== 'running' || !A.vol || !A.vol.sfx) return;
    var t = A.ctx.currentTime + 0.01, i;
    if (name === 'laugh14') for (i = 0; i < 6; i++) {   // HA-HA-HA-HA, rolling down
      A.tone(t + i * 0.15, 'triangle', 560 - i * 28, 470 - i * 30, 0.11, 0.14);
      A.tone(t + i * 0.15, 'sine', 1120 - i * 56, 940 - i * 60, 0.08, 0.04);
      A.noise(t + i * 0.15, 0.06, 0.05, 'bandpass', 1600);
    }
    else if (name === 'clang14') { A.noise(t, 0.25, 0.22, 'bandpass', 3200, 1800); A.tone(t, 'square', 880, 840, 0.3, 0.06); A.tone(t, 'sine', 1320, 1250, 0.4, 0.06); }
    else { A.tone(t, 'sawtooth', 420, 980, 0.55, 0.07); A.tone(t + 0.05, 'sawtooth', 380, 900, 0.5, 0.05); A.noise(t, 0.5, 0.08, 'bandpass', 2000, 3000); }
  };

  // ---------------------------------------------------------------- who speaks
  LC.SPEAKERS.senah14 = { name: 'Kak Senah', portrait: 'npc14_senah_0' };
  LC.SPEAKERS.senahmask14 = { name: 'Kak Senah?', portrait: 'npc14_senah_mask_0' };
  LC.SPEAKERS.jusoh14 = { name: 'Jusoh', portrait: 'npc14_jusoh_0' };
  LC.SPEAKERS.bahar14 = { name: 'Cikgu Bahar', portrait: 'npc14_bahar_0' };
  LC.SPEAKERS.amin14 = { name: 'Amin', portrait: 'npc14_amin_0' };
  LC.SPEAKERS.imam14 = { name: 'Tok Imam', portrait: 'npc14_imam_0' };
  LC.SPEAKERS.penunggu14 = { name: 'Penunggu Rumah', portrait: 'senah_penunggu_0' };
  LC.SPEAKERS.tiong14 = { name: 'Si Tiong', portrait: 'senah_sangkar_0' };
  LC.SPEAKERS.pelita14 = { name: 'Pelita', portrait: 'ghost', expr: 'happy' };

  LC.SENAH_TEXT = {
    day: [['', 'In daylight the house is quiet: shutters closed, the stove cold. Whatever happens here happens after dark (7 PM).']],
    night1: [
      ['jusoh14', 'I saw her with my own eyes! Kak Senah, white as rice flour, floating past her window! I wasn\'t scared. I was... running to warn everyone.'],
      ['bahar14', 'Nonsense. Ghosts do not exist. There is a scientific explanation for everything.'],
      ['', 'HAHAHAHA! A laugh rolls out of the dark house. Everyone dives behind the pondok. Cikgu Bahar gets there first.'],
      ['bahar14', 'I was... inspecting the floorboards. Scientifically.'],
      ['imam14', 'Enough. Kak Senah may simply be away. We do not spread stories about someone who is not here to answer.'],
      ['imam14', 'You and Pelita are not easily frightened. Will you go and see what is really in that house?']
    ],
    folk0: {
      jusoh14: 'Me? Go in there? I would, of course. But someone brave has to guard the pondok.',
      bahar14: 'My detector crackles near the house. It is probably the battery. Probably.',
      imam14: 'Look with your own eyes before you believe what you hear.'
    },
    peek: [
      ['', 'Through the window: a pot of kuih steaming on the stove... and a white shape drifting slowly past the glass.'],
      ['', 'HAHAHAHA!'],
      ['pelita14', '(Pelita tilts its head. It does not glow at all. Whatever is in there, it is not a spirit.)'],
      ['', 'Look around the house for clues: the clothesline, the birdcage, the kitchen.']
    ],
    house: [['', 'Kak Senah\'s house on its stilts, with blue shutters and a jar of bunga raya by the steps.']],
    sheet: [
      ['', 'A big white bedsheet hangs on the line. Every time the wind blows, it billows up and floats past the window like a ghost.'],
      ['pelita14', '(Pelita pokes the sheet. The "ghost" flaps back at it. Clue one: solved.)']
    ],
    sheetAfter: [['', 'Just a bedsheet. Kak Senah\'s best one, with little flowers on it.']],
    tiong: [
      ['tiong14', 'HAHAHAHA! Kuih! Kuih! Seri muka panas!'],
      ['', 'A burung tiong, a hill myna, in a rattan cage. Mynas copy any voice they hear, and this one copies Kak Senah\'s laugh perfectly. Clue two: solved.']
    ],
    tiongAfter: [['tiong14', 'HAHAHAHA! Siapa tu? Siapa tu?']],
    amin: [
      ['', 'A boy jumps out from behind the stove with flour all over his face!'],
      ['amin14', 'Don\'t tell Mak Long! She asked me to feed Si Tiong while she visits her sister in Kuala Lipis.'],
      ['amin14', 'I\'ve been using her stove at night to make kuih for the pasar pagi. I\'m saving up for a bicycle. The white thing is just her bedsheet!'],
      ['amin14', 'She comes home tomorrow night on the last bus. Please don\'t tell her about the stove...'],
      ['pelita14', '(Pelita giggles. Its light flickers like a wink. Clue three: solved.)']
    ],
    dapurDay: [['', 'An outdoor kitchen: a clay stove, a steamer and a basket of pandan leaves. The ashes are still warm.']],
    rattle: 'CLANG! CLATTER! The pots in the kitchen rattle on their own... and Pelita starts to glow. Something real is here.',
    penunggu: [
      ['', 'Under the house, a small shy spirit peeks out from between the stilts, clutching a wooden spoon.'],
      ['penunggu14', 'I am the Penunggu of this house. I have kept it safe since Kak Senah\'s mother was a little girl.'],
      ['penunggu14', 'She went away without saying goodbye... so I rattled the pots to call her home. Did I frighten anyone?'],
      ['pelita14', '(Pelita glows softly. It knows how it feels to wait for someone.)'],
      ['', 'Kak Senah comes home tomorrow night. Come back after 10 PM, so the house is not alone when she arrives.']
    ],
    penungguWait: [['penunggu14', 'Tomorrow night. I have polished every spoon.']],
    penungguAfter: [['penunggu14', 'She is home. The pots are quiet now. Well, mostly. Amin is still learning.']],
    waitNight: [['', 'The house is quiet tonight. Kak Senah\'s bus comes tomorrow night, after 10 PM.']],
    mob: [
      ['jusoh14', 'Ghost of Kak Senah! Leave our kampung! (CLANG CLANG)'],
      ['bahar14', 'My detector is crackling! There is definitely... interference.'],
      ['amin14', 'Abang Jusoh, I told you, it\'s only me and the bird!'],
      ['jusoh14', 'That is exactly what a ghost would make you say!']
    ],
    arrive: [
      ['', 'Footsteps on the lane. A figure with a white face and wild hair drags a suitcase out of the dark.'],
      ['senahmask14', 'Assalamualaikum... why is everybody standing in my yard at midnight?'],
      ['jusoh14', 'AAAAAAAAH! SHE\'S BACK!'],
      ['senahmask14', 'AAAAAAAAH! Who\'s that?! Thieves! THIEVES!'],
      ['', 'Everyone runs in every direction at once.']
    ],
    hidden: 'Round up the runaways: Jusoh, Cikgu Bahar and Amin are hiding somewhere around the yard.',
    found: {
      jusoh: [['jusoh14', 'I\'m not hiding! I\'m... counting the coconuts. For the ghost. Is it gone?'], ['', 'You help Jusoh down. He lands on his bottom, then dusts himself off with great dignity.']],
      bahar: [['bahar14', 'Scientifically speaking, chickens are excellent ghost detectors. They stayed calm, so I stayed... with them.'], ['', 'Cikgu Bahar climbs out with a feather in his songkok.']],
      amin: [['amin14', 'That wasn\'t a ghost, was it? That was Mak Long in her bedak sejuk...'], ['', 'Amin crawls out of the banana leaves.']]
    },
    kakCross: [['senahmask14', 'Thieves in my yard, a boy in my kitchen and a myna that won\'t stop laughing. Find everyone and bring them here!']],
    finale: [
      ['', 'Pelita rises above the yard and shines as bright as a lantern.'],
      ['', 'Kak Senah\'s shadow stretches long across the yard: a real, honest shadow. Ghosts have none.'],
      ['imam14', 'There. As I said: she was only travelling.'],
      ['senah14', 'A ghost?! Me? I went to visit my sister in Kuala Lipis! And this is bedak sejuk, for my skin. That bus was so hot!'],
      ['jusoh14', 'I knew it all along. I was only testing how fast a ghost can run.'],
      ['bahar14', 'As I said from the start. Science.'],
      ['amin14', 'Mak Long... I used your stove every night to make kuih to sell. I\'m sorry.'],
      ['senah14', 'Every night? ...Then from tomorrow you are my partner, and you will learn my seri muka properly. Not that lumpy thing I can smell from here!'],
      ['', 'Kak Senah laughs her famous laugh: HAHAHAHA! From the cage, Si Tiong laughs right back.'],
      ['penunggu14', '(Under the house, the Penunggu claps its tiny hands. The house is not alone any more. It blesses you: home-cooked warmth, +15 max energy.)'],
      ['senah14', 'For finding my runaways, take some seri muka. And the recipe. Don\'t tell Jusoh, he\'ll want his for free.'],
      ['', '✦ Chapter 14 complete! ✦ You got Seri Muka x5, Kak Senah\'s recipe (cook it at the dapur) and 800 kepeng.'],
      ['', 'As everyone heads home, the famous laugh rings out once more from the dark banana grove... HAHAHAHA!'],
      ['', 'But Kak Senah is right here, and Si Tiong is in its cage. Slowly, everyone turns to look at Pelita.'],
      ['pelita14', '(Pelita whistles a little tune, and looks the other way.)']
    ],
    after: {
      senah14: 'Come back any time. There is always seri muka for the one who found my runaways. HAHAHAHA!',
      jusoh14: 'Next time there is a ghost, I will be first in line. Right behind you.',
      bahar14: 'I have written a paper: "On the Ghost-Detecting Properties of the Common Hen".',
      amin14: 'Mak Long says my seri muka is less lumpy now. I\'ve saved half the bicycle already!',
      imam14: 'A rumour runs faster than the truth. Good thing you were faster than both.'
    },
    fireworks: 'Kak Senah: “Eh, budak ni main bunga api pulak!” (Eh, this kid is playing with fireworks now!)'
  };
})(window.LC);
