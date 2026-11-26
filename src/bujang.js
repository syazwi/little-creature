/* Chapter 18: Bujang Belajar Mantera? (v3.19). An original kampung comedy (the owner asked for three bachelor
 * pendekar who want to learn magic, with the player invited as their fourth member; the cast, places and jokes are our
 * own). Kudin (the self-appointed leader with the too-big tanjak), Leman (always hungry: his spells make food) and Sani
 * (scared of the dark, the best voice in the kampung) turn Tok Penghulu's rooster purple, then beg you, a graduate of
 * Sekolah Mantera, to join them. Suraya gives them one term because you vouch for them: Ilmu Terapung (keep a feather up
 * while Leman's durians fall), Kelas Gelap (lead Sani through the dark room to light three runes) and Kelas Pantul
 * (shield them from the practice rune). By the fire they tell you why they really want magic. The exam hall opens only
 * for four voices together, and inside is Ujian Cermin: each bachelor's mirror is the flaw he hides (the owner asked
 * for mirror fights like Bayang Diri). Three rounds of two against one, where the real bachelor lands the last blow,
 * then four against four with your own Bayang Diri. They pass, barely, and teach you Mantera Empat Sekawan (Y).
 * Steps (S.quests.ch18): 0 rest after Chapter 17 · 1 the bachelors in Kampung Tepian · 2 Suraya's interview
 * · 3 Ilmu Terapung · 4 Kelas Gelap · 5 Kelas Pantul · 6 by the fire, the exam door · 7 Ujian Cermin · 8 done. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var C = LC.C18 = {
    end: 8,
    who: ['kudin', 'leman', 'sani'],
    ready: function (S) { return !!(S && S.quests && LC.C17 && LC.C17.step(S) >= LC.C17.end); },
    step: function (S) { return (S && S.quests && S.quests.ch18) || 0; },
    kampung: [{ x: 8, y: 17 }, { x: 10, y: 17 }, { x: 12, y: 17 }],         // where they practise in Kampung Tepian (below the plots)
    court: [{ x: 25, y: 9 }, { x: 26, y: 9 }, { x: 27, y: 9 }],             // in the school courtyard
    yard: [{ x: 10, y: 15 }, { x: 12, y: 15 }, { x: 14, y: 15 }],           // in front of the practice rune (Kelas Pantul)
    rune: { x: 12, y: 12 },
    cellar: { x: 31, y: 16 }, saniWait: { x: 32, y: 16 },                   // the dark room's trapdoor, and Sani beside it
    door: { x: 18, y: 6, w: 3 },                                            // the exam hall's Pintu Empat Penjuru
    feather: { x0: 18.5, x1: 28.5, y0: 15.2, y1: 19.3, lifts: 6 },          // Ilmu Terapung, in the south of the courtyard
    pantul: 5, runes: [{ x: 3, y: 3 }, { x: 20, y: 3 }, { x: 3, y: 12 }],
    mirrors: [{ x: 5, y: 3 }, { x: 10, y: 3 }, { x: 16, y: 3 }, { x: 21, y: 3 }],   // in the exam hall: Kudin, Leman, Sani, you
    colors: { kudin: 0xc8b8ff, leman: 0x9be15d, sani: 0x7fb4ff, diri: 0xff5a7a },
    // Mantera Empat Sekawan: your three friends pop in for a moment
    sekawan: { cd: 30, stay: 3.6, smoke: { r: 72, blind: 2.2, bossBlind: 0.8 }, durian: { reach: 170, stun: 1.4, bossStun: 0.5 }, song: { r: 100, dur: 2.5, bossDur: 0.9 } }
  };
  C.durianDamage = function (L) { return 4 + Math.floor((L || 1) / 4); };
  LC.hasSekawan = function () { var S = LC.State.s; return !!S && C.step(S) >= C.end; };
  function st(S) { return C.step(S); }
  function done(S) { return st(S) >= C.end; }
  // the mirrors in the exam: the bachelors' a little below your level, their health counted in your best swings
  C.fight = function (S, round) {
    var B = LC.BunianTrials, best = B.bestWeapon(S), swing = best ? LC.State.weaponDamage(best) : 1, you = LC.plLevel ? LC.plLevel(S) : 1, fin = round >= 3;
    return {
      mirror: { level: you + (fin ? 2 : 4), hp: Math.max(fin ? 20 : 30, Math.round(swing * (fin ? 7 : 12))), dmg: Math.max(3, Math.round((S.maxHp || 60) * (fin ? 0.05 : 0.07))), speed: 46, sight: 400, w: 6 },
      twin: { level: you + 6, hp: Math.max(30, Math.round(swing * 12)), dmg: Math.max(3, Math.round((S.maxHp || 60) * 0.06)), speed: 50, sight: 600, w: 6 },
      allyHit: Math.max(1, Math.round(swing * 0.6))
    };
  };

  LC.SPEAKERS.kudin18 = { name: 'Kudin', portrait: 'npc18_kudin_0' };
  LC.SPEAKERS.leman18 = { name: 'Leman', portrait: 'npc18_leman_0' };
  LC.SPEAKERS.sani18 = { name: 'Sani', portrait: 'npc18_sani_0' };
  LC.SPEAKERS.bkudin18 = { name: 'Bayang Kudin', portrait: 'mirror18_kudin_0' };
  LC.SPEAKERS.bleman18 = { name: 'Bayang Leman', portrait: 'mirror18_leman_0' };
  LC.SPEAKERS.bsani18 = { name: 'Bayang Sani', portrait: 'mirror18_sani_0' };

  function addItems(m) { Object.keys(m).forEach(function (id) { var it = m[id]; it.id = id; it.icon = it.icon || 'i_' + id; LC.ITEMS[id] = it; }); }
  addItems({
    selempang18: { name: 'Selempang Bujang', kind: 'treasure', desc: 'The bachelors\' sash, gold and black. Kudin tied it on you himself, with a knot nobody can untie. "One to lead, one to fight, one to cook, one to carry the bags."' }
  });
  LC.FIXED_ITEMS.selempang18 = 1;
  ['kudin', 'leman', 'sani'].forEach(function (who) {
    LC.ENEMIES['bayang18_' + who] = { name: 'Bayang ' + who.charAt(0).toUpperCase() + who.slice(1), texture: 'mirror18_' + who, hp: 40, speed: 46, dmg: 6, w: 6, sight: 400, drop: [] };
  });
  LC.ENEMIES.bayang18_diri = { name: 'Bayang Diri', texture: 'mirror0_down', hp: 60, speed: 50, dmg: 6, w: 6, sight: 600, drop: [] };

  // first win: +15 max energy, for keeping up with three bachelors
  var recalc = LC.State.recalc;
  LC.State.recalc = function () {
    var s = this.s, en = s && s.energy;
    recalc.apply(this, arguments);
    if (!s || !done(s)) return;
    s.maxEnergy += 15;
    if (typeof en === 'number') s.energy = Math.min(en, s.maxEnergy);
  };

  // ---------------------------------------------------------------- where they stand
  function person(id, type, at, who, when) { return { id: id, type: type, who: who, x: at.x, y: at.y, tex: 'npc18_' + who + '_0', keep: true, when: when }; }
  C.who.forEach(function (who, i) {
    LC.AREAS.kampung.objects.push(person('k_bujang18_' + who, 'bujang18', C.kampung[i], who, function (S) { var s = st(S); return s === 1 || s >= C.end; }));
    LC.AREAS.mantera.objects.push(person('m_bujang18_' + who, 'bujang18', C.court[i], who, function (S) {
      var s = st(S); return s === 2 || s === 3 || s === 6 || s === 7 || s === 4 && who !== 'sani';
    }));
    LC.AREAS.mantera.objects.push(person('m_bujang18p_' + who, 'bujang18', C.yard[i], who, function (S) { return st(S) === 5; }));
  });
  LC.AREAS.mantera.objects.push(person('m_bujang18w_sani', 'bujang18', C.saniWait, 'sani', function (S) { return st(S) === 4; }));
  LC.AREAS.mantera.objects.push({ id: 'm_gelap18', type: 'bujang18_cellar', x: C.cellar.x, y: C.cellar.y, tex: 'pintu_gelap18', keep: true, when: function (S) { return st(S) >= 4; } });
  LC.AREAS.mantera.objects.push({ id: 'm_pintu18', type: 'bujang18_door', x: C.door.x, y: C.door.y, w: C.door.w, tex: 'pintu18_tutup', keep: true, when: function (S) { return st(S) >= 6; } });

  // ---------------------------------------------------------------- Bilik Gelap, the dark room under the courtyard
  function grid(w, h, tile) { return Array.from({ length: h }, function () { return new Array(w).fill(tile); }); }
  function fill(g, x0, y0, x1, y1, tile) { for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) g[y][x] = tile; }
  LC.AREAS.gelap18 = {
    name: 'Bilik Gelap', sub: 'the dark room beneath Sekolah Mantera', lvl: 21, home: { x: 11, y: 12 }, pond: 'cave', amb: 'cave', cave: true,
    decor: { n: 12, types: ['stalagmite', 'cobweb', 'rubble', 'cobweb'], on: 'c' },
    build: function () {
      var g = grid(24, 18, 'X');   // (rock below the stairs, so they never hide under the toolbar)
      fill(g, 2, 2, 21, 13, 'c');
      fill(g, 6, 4, 7, 11, 'X'); fill(g, 15, 2, 16, 9, 'X'); fill(g, 9, 7, 13, 8, 'X');
      return g;
    },
    objects: C.runes.map(function (r, i) { return { id: 'g18_rune' + i, type: 'bujang18_rune', idx: i, x: r.x, y: r.y, tex: 'rune18_off', keep: true }; })
      .concat([{ id: 'g18_out', type: 'bujang18_out', x: 11, y: 13, tex: 'tangga18', keep: true }]),
    exits: [], ride: {}
  };
  // ---------------------------------------------------------------- the exam hall: four mirrors
  LC.AREAS.ujian18 = {
    name: 'Dewan Ujian', sub: 'Ujian Cermin, the mirror exam', lvl: 21, home: { x: 13, y: 11 }, pond: 'river', amb: 'cave', frozenClock: true,
    decor: { n: 0, types: [], on: '.' },
    build: function () {
      var g = grid(27, 23, 'X');
      fill(g, 2, 2, 24, 18, 'k');
      return g;
    },
    objects: C.mirrors.map(function (m, i) { return { id: 'u18_cermin' + i, type: 'bujang18_mirror', idx: i, x: m.x, y: m.y, tex: 'cermin18', keep: true }; })
      .concat([{ id: 'u18_out', type: 'bujang18_exit', x: 13, y: 18, tex: 'tangga18', keep: true }]),
    exits: [], ride: {}
  };

  // ---------------------------------------------------------------- what they say
  LC.BUJANG_TEXT = {
    start: 'News from Kampung Tepian: Tok Penghulu\'s rooster has turned purple! Three young men by the vegetable plots look very guilty.',
    meet: [
      ['kudin18', 'Stand back, stand back! Watch a master at work. Abraca... no. Hocus... no. Ah, this one: "HOCUS KELAPA!"'],
      ['', 'POP! A cloud of confetti bursts out of the coconut palm. The coconut does not move. Tok Penghulu\'s rooster, already purple since this morning, now wears a little hat of confetti.'],
      ['leman18', 'Purple. Like a mangosteen. Now I am hungry.'],
      ['sani18', 'D-did we curse it again? Will it curse us back? I am going home. I am going home right now.'],
      ['kudin18', 'Calm down, Sani. Every great pendekar fails a little at first. Hang Tuah probably turned a few roosters purple too.'],
      ['kudin18', 'Wait. YOU. You graduated from Sekolah Mantera! We saw you throw a little sun at a shadow once. Sani fainted.'],
      ['sani18', 'I did not faint. I sat down. Very fast.'],
      ['kudin18', 'We are Kudin, Leman and Sani. Three bachelors, three pendekar in training, zero spells. Suraya has failed us three times.'],
      ['leman18', 'Four times. You forgot the time I ate the exam paper.'],
      ['kudin18', 'So we need a fourth member! Every band of pendekar needs four: one to lead, one to fight, one to cook... and one to carry the bags. Will you join us?']
    ],
    later: [['kudin18', 'We will wait right here. Practising. Stand well back from the rooster.']],
    oath: [
      ['kudin18', 'Then we swear the Sumpah Bujang! Everyone, one hand on the nasi lemak.'],
      ['', 'Leman has one hand on the nasi lemak. Leman\'s other hand is also on the nasi lemak. The nasi lemak is getting smaller.'],
      ['kudin18', 'We swear to stick together, through every spell, every exam and every purple rooster! Whoever gives up first... washes the plates.'],
      ['sani18', 'W-we swear!'],
      ['leman18', 'Mmf. Swear. (There is no more nasi lemak.)'],
      ['', '✦ You joined the bachelors! Kudin ties a sash around your arm: the Selempang Bujang. ✦  Take Idris\'s enchanted letter at the farm to Sekolah Mantera. The three of them are already running there.']
    ],
    // in Kampung Mantera, before and after each lesson
    talk: {
      2: { kudin: 'Suraya is in the courtyard. You talk. I will stand behind you, looking confident.', leman: 'Do they have a canteen here? A school must have a canteen.', sani: 'She looked at me last time and I forgot my own name.' },
      3: { kudin: 'Levitation! I will levitate my tanjak. It is already halfway there.', leman: 'Terapung, durian, terapung! ...it is not floating. It is falling. Mind your head.', sani: 'I will watch from here. Feathers are scary when they fall on you.' },
      4: { kudin: 'Sani is down in the dark room? Brave boy. I would go too, but somebody has to guard the courtyard.', leman: 'I sent Sani a curry puff for courage. I ate it on the way. The courage is in me now.', sani: 'The d-dark room is down there. You go first. No, together. Together is good.' },
      5: { kudin: 'The rune is aiming at me. I can feel it. It knows I am the handsome one.', leman: 'If it fires at me, I will catch it in my mouth.', sani: 'Please stand in front of me. A little more. A little more.' },
      6: { kudin: 'Sit with us by the fire. Before the exam. Please.', leman: 'Sit, sit. I saved you a spot. I did not save you any food.', sani: 'Tonight is the exam. My legs know it already.' },
      7: { kudin: 'The exam hall is open. If I run, you have permission to bring me back.', leman: 'Whatever is in there, I hope it is not hungry.', sani: 'I am ready. My legs are not. They are coming anyway.' }
    },
    after: {
      kudin: ['Mak\'s warung roof? I fixed it! A ladder, some nails and no magic at all. Turns out that works too.', 'The rooster likes being purple now. It walks around the kampung like a sultan.', 'One to lead, one to fight, one to cook, one to carry the bags. We are still four, you know. Even when you are far away.'],
      leman: ['I made food appear today! I cooked it, and it appeared on the plate. Same thing.', 'Next kenduri, the whole kampung eats. I have been practising. With pots.', 'Nasi lemak? For you? ...I will share. Half. Okay, a third.'],
      sani: ['I sang at the Pesta! My legs tried to walk me down again. I told them no.', 'I still do not like the dark. But I sing to it now, and it listens.', 'If you hear singing in the dark, it is just me. Probably.']
    },
    show: [['', 'The bachelors put on a magic show by the vegetable plots! Kudin blows smoke rings, Leman "summons" a durian (from behind his back), and Sani sings the finale. The kampung claps, and Pelita bounces happily.']],
    interview: [
      ['suraya13', 'You again. And... oh no. Kudin, Leman and Sani. The three who set the library curtains on fire.'],
      ['kudin18', 'Twice, Cikgu! That shows commitment!'],
      ['suraya13', 'Why do you want to learn magic?'],
      ['kudin18', 'To be handsome.'],
      ['leman18', 'Food.'],
      ['', 'Sani has fainted. Sitting down. Very fast.'],
      ['suraya13', '...'],
      ['suraya13', 'You are a graduate of this school. If you vouch for them, I will give them one term. One. Three lessons and an exam.']
    ],
    vouch: [['suraya13', 'Very well. On your head be it. Literally, when Leman does levitation.']],
    hopeless: [['suraya13', 'Honest. I like that. One term, then. On your head be it.']],
    firstLesson: [['suraya13', 'First lesson: Ilmu Terapung, levitation. Come and see me in the courtyard when you are ready. Kudin, put the coconut DOWN.']],
    float: [
      ['suraya13', 'Ilmu Terapung. Keep this feather in the air. When it sinks low, stand under it and blow it back up (press USE). Six times.'],
      ['leman18', 'I will practise too! Levitating... a durian! For lunch!'],
      ['suraya13', 'Leman, no. Leman. LEMAN.'],
      ['', 'Watch the shadows on the ground: that is where a durian is about to land. Keep the feather up six times!']
    ],
    floatFail: 'The feather touched the ground. Suraya floats it back up. "Again. Patience is half of every spell."',
    floatWin: [
      ['suraya13', 'Six! Good. The feather is still floating. So is Kudin\'s tanjak, somehow.'],
      ['leman18', 'And I levitated eleven durians! They just came down in... unhelpful places.'],
      ['suraya13', 'Second lesson: Kelas Gelap. Sani, you will take it in the dark room beneath the courtyard. Your new friend goes with you.'],
      ['sani18', 'The d-dark room? Can... can Pelita come?'],
      ['', 'Pelita glows a little brighter, as if to say yes. The trapdoor is on the east side of the courtyard.']
    ],
    dark: [
      ['sani18', 'It is so dark. Stay close. Not that close. Okay, that close.'],
      ['', 'Light the three rune stones. Sani has to be right beside you when you touch a rune, so he can sing it awake. Do not leave him behind in the dark!']
    ],
    wait: ['TUNGGU! Wait for me!', 'Is something breathing? ...that was me.', 'Pelita, don\'t go!', 'H-hello? Anyone?'],
    eek: ['EEEK! A bat!', '...a very small bat.', 'It touched my hair!'],
    tooFar: 'Sani is too far away! Bring him close: he is scared of the dark.',
    runeLit: 'This rune is already shining.',
    rune: [
      [['sani18', '(Sani sings, very quietly. The rune glows silver.) It... it worked? I did a spell!']],
      [['sani18', '(A little louder this time. The second rune lights up.) The dark is not so dark when you sing to it.']],
      [['sani18', '(Sani sings at the top of his voice. All three runes blaze, and the dark room fills with silver light.) I AM NOT SCARED! ...okay, a bit scared. But I am singing anyway!'],
        ['', '✦ Kelas Gelap passed! Climb the stairs and see Suraya for the last lesson. ✦']]
    ],
    pantul: [
      ['suraya13', 'Last lesson: Mantera Pantul. The practice rune in the west yard will fire at these three. Stand in front of the one it aims at, and send the bolt back (press P) just before it reaches you.'],
      ['kudin18', 'I am not afraid! ...is it hot? It looks hot.'],
      ['suraya13', 'It is warm. Send five bolts back to the rune.']
    ],
    sooted: { kudin: 'Aduh! My eyebrows!', leman: 'Aduh! ...smells like satay.', sani: 'Aduh! I am fine! I am fine.' },
    pantulWin: [
      ['suraya13', 'Five. You protected them. So that is what the fourth member is for.'],
      ['suraya13', 'The final exam is tonight: Ujian Cermin. Sit with your friends by the fire first. You will want to.']
    ],
    fire: [
      ['', 'The four of you sit by a small fire in the courtyard. Nobody says anything for a while. Then Kudin clears his throat.'],
      ['kudin18', 'I never told you why I want magic. It is not to be handsome. I am already handsome. It is my mother\'s warung. The roof leaks every monsoon, and I cannot afford to fix it. I thought: one spell, and it stays dry.'],
      ['leman18', 'Mine is the kenduri. Every year I want to cook for the whole kampung, and every year there is not enough. If I could make food appear... nobody would go home hungry.'],
      ['sani18', 'I want to sing at the Pesta. I have wanted to for ten years. But every time I walk up to the stage, my legs walk me back down.'],
      ['kudin18', 'And you? Oh, you already have magic. You are just here to carry the bags.'],
      ['', 'Pelita drifts into the middle of the circle and glows softly. Somehow that is the right answer.'],
      ['suraya13', 'The exam hall opens only for four voices together. That is why you needed a fourth. Stand at the door, one at each corner, and say the words.']
    ],
    chant: ['Empat...', 'sekawan...', 'satu...', 'HATI!'],
    doorShut: 'Pintu Empat Penjuru: four corner stones, one for each friend. It will not open for one voice.',
    doorAfter: 'The exam hall is quiet now. Four cracked mirrors lean against the wall, and someone has drawn a smiley face on one.',
    exam: [['suraya13', 'Ujian Cermin. Every mirror here shows the part of yourself you hide. Beat it, and you pass. Lose, and you try again. I am not a monster.']],
    rounds: {
      kudin: {
        intro: [['', 'The first mirror shivers. Kudin\'s reflection steps out, puffing out its chest.'],
          ['bkudin18', 'HAH! I am the REAL Kudin! Brave! Handsome! Never afraid! Hit me and watch me... run away!'],
          ['kudin18', 'Is that how I look? ...that is how I look.']],
        finish: [['bkudin18', '(cornered) Wait wait wait! Kudin, you run too! You always run! Admit it!'],
          ['kudin18', '...Yes. I run. I am scared all the time. But I am not running today.'],
          ['', 'Kudin blows the biggest smoke ring of his life.']]
      },
      leman: {
        intro: [['', 'The second mirror shivers. Leman\'s reflection steps out, chewing.'],
          ['bleman18', 'Mine! Your food is mine! Their food is mine! The FLOOR is mine, if it is crunchy!'],
          ['leman18', 'Hey. I do not eat floors. Often.']],
        finish: [['bleman18', '(full and wobbling) More... I need... more...'],
          ['leman18', 'Here. My last nasi lemak. I was saving it. You can have it.'],
          ['', 'The reflection stops. It looks at the nasi lemak, then at Leman. It gives half back.']]
      },
      sani: {
        intro: [['', 'The third mirror shivers. Sani\'s reflection steps out, stomping.'],
          ['bsani18', 'I am the Sani who is NEVER scared! I shout! I stomp! I sing so loud your ears will cry!'],
          ['sani18', 'That is not brave. That is just loud.']],
        finish: [['bsani18', '(hoarse) Why... are you not... scared of me?'],
          ['sani18', 'I am scared. I am singing anyway.'],
          ['', 'Sani sings, soft and clear. His reflection closes its eyes and listens.']]
      }
    },
    returned: 'Everything Bayang Leman ate pops back into your bag.',
    between: 'A warm light from the mirrors heals you.',
    finale: [['suraya13', 'One mirror left. The fourth one. It is yours.'],
      ['', 'All four mirrors shine at once. Out step Bayang Kudin, Bayang Leman, Bayang Sani... and Bayang Diri, your own reflection.'],
      ['kudin18', 'Everyone, your own mirror! And if anyone is losing, shout!']],
    twinLine: 'Four against four. Shall we?',
    finishers: { kudin: 'Not running!', leman: 'Here, share!', sani: '(sings)' },
    help: 'Tolong!', ok: 'I am okay!',
    win: [['', 'The last mirror cracks. All four reflections smile, the same smile as the four of you, and break into a cloud of fireflies.'],
      ['suraya13', 'Come out to the courtyard. All of you.']],
    faint: 'Suraya pulls you out of the hall. "Rest, then try again. The mirrors will wait."',
    grad: [
      ['suraya13', 'Kudin. Leman. Sani. And their fourth.'],
      ['suraya13', 'You pass. Barely. The lowest marks in three hundred years.'],
      ['kudin18', 'WE PASSED!'],
      ['leman18', 'The lowest marks! A record! Nobody can ever take that away from us!'],
      ['', 'Sani is crying. Sitting down. Very fast. Happily.'],
      ['suraya13', 'One more thing. A band of four should always be able to find each other. Hold out your hands.'],
      ['', '✦ You learned Mantera Empat Sekawan! Press Y (or tap the four friends beside your hotbar): Kudin, Leman and Sani pop in to help. Kudin\'s smoke ring blinds, Leman\'s durian stuns, and Sani\'s song makes them sway. ✦'],
      ['', '✦ Chapter 18 complete! +2000 kepeng and +15 max energy. The bachelors go home to Kampung Tepian (the rooster stays purple). ✦']
    ],
    // Mantera Empat Sekawan
    calls: { kudin: 'Serah pada aku!', leman: 'Durian, terbang!', sani: '(sings)' },
    nothing: 'Nothing to fight? Then we are off to eat!',
    blind: 'Blinded!', bonk: 'BONK!'
  };
})(window.LC);
