/* Chapter 16: Kampung Mamai? (v3.16). The owner's story, improved together: after the fire, the kampung holds a majlis
 * doa kesyukuran and asks you to host it. You invite everyone, find hands for the kitchen, and Nek Lampir's spirit
 * (her lantern from Chapter 13) volunteers to make amends. The doa itself is peaceful and untouched. The next morning,
 * everyone who ate the ayam masak merah sleepwalks ("zombies!"): they can't be hurt, only cured. The clues lead to
 * Nek Lampir: a ghost cannot smell, and she sprinkled her old Serbuk Lena (sleeping powder) thinking it was kunyit.
 * She knows the cure, Jamu Bangun, brewed on Si Bara's fire. Wake everyone; the kampung forgives her.
 * Steps (S.quests.ch16): 0 rest after Chapter 15 · 1 Tok Penghulu's request · 2 invite six people · 3 hire Amin and
 * Si Bara (then Nek Lampir arrives) · 4 cook three pots · 5 the majlis (after 6 PM) · 6 rest · 7 the sleepwalkers and
 * three clues · 8 Nek Lampir's confession · 9 brew Jamu Bangun · 10 wake six people · 11 done. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var C = LC.C16 = {
    end: 11, majlis: 18 * 60,
    ready: function (S) { return !!(S && S.quests && LC.C15 && LC.C15.step(S) >= LC.C15.end); },
    step: function (S) { return (S && S.quests && S.quests.ch16) || 0; },
    invites: [
      { who: 'mat', name: 'Pak Mat', obj: 'k_pondok' }, { who: 'zul', name: 'Abang Zul', obj: 'k_kedai' },
      { who: 'leong', name: 'Tukang Leong', obj: 'k_bengkel' }, { who: 'imam', name: 'Tok Imam', obj: 'k_masjid' },
      { who: 'senah', name: 'Kak Senah', obj: 'sn_kak' }, { who: 'jusoh', name: 'Jusoh', obj: 'sn_jusoh1' }
    ],
    pots: {
      nasi: { name: 'Nasi Minyak', need: { padi: 3 }, where: 'Padi grows in your sawah.' },
      ayam: { name: 'Ayam Masak Merah', need: { cili: 3 }, where: 'Grow cili in your field.' },
      seri: { name: 'Seri Muka', need: { seri_muka: 2 }, where: 'Cook Seri Muka at the dapur (padi, pandan, kelapa).' }
    },
    jamu: { madu_tualang: 1, herba: 2, pandan: 1 },
    sleepers: [
      { who: 'jusoh', name: 'Jusoh', tex: 'npc14_jusoh_0', x: 10, y: 13 }, { who: 'bahar', name: 'Cikgu Bahar', tex: 'npc14_bahar_0', x: 20, y: 13 },
      { who: 'senah', name: 'Kak Senah', tex: 'npc14_senah_0', x: 30, y: 13 }, { who: 'mat', name: 'Pak Mat', tex: 'npc_mat_0', x: 28, y: 19 },
      { who: 'zul', name: 'Abang Zul', tex: 'npc_zul_0', x: 37, y: 17 }, { who: 'leong', name: 'Tukang Leong', tex: 'npc_leong_0', x: 22, y: 13 }
    ],
    gelanggang: { x: 16.5, y: 18 }
  };
  function st(S) { return C.step(S); }
  function map(S, k) { return (S.quests && S.quests[k]) || {}; }
  C.count = function (S, k) { return Object.keys(map(S, k)).length; };
  C.asleep = function (S, who) { var s = st(S); return s >= 7 && s <= 10 && !map(S, 'c16woke')[who]; };

  // ---------------------------------------------------------------- the farm kitchen, the kampung, and who is where
  function between(a, b) { return function (S) { var s = st(S); return s >= a && s <= b; }; }
  LC.OBJECTS.push(
    { id: 'f_lampir16', type: 'mamai_lampir', x: 10, y: 8, tex: 'npc_lampir_0', keep: true, when: between(4, 10) },
    { id: 'f_balang16', type: 'mamai_jar', x: 9, y: 7, tex: 'balang16', keep: true, when: between(7, 10) },
    { id: 'f_tanglung16', type: 'mamai_lantern', x: 5, y: 8, tex: 'tanglung16', keep: true, light: 0xbfe0ff, when: function (S) { return st(S) >= C.end; } }
  );
  [['nasi', 11], ['ayam', 12], ['seri', 13]].forEach(function (p) {
    var key = p[0];
    LC.OBJECTS.push(
      { id: 'f_periuk16_' + key + '0', type: 'mamai_pot', pot: key, x: p[1], y: 7, tex: 'periuk16_kosong', keep: true, when: function (S) { return st(S) === 4 && !map(S, 'c16cook')[key]; } },
      { id: 'f_periuk16_' + key + '1', type: 'mamai_pot', pot: key, x: p[1], y: 7, tex: 'periuk16_' + key, keep: true, when: function (S) { var s = st(S); return (s === 4 && !!map(S, 'c16cook')[key]) || s === 5; } }
    );
  });
  LC.AREAS.kampung.objects.push(
    { id: 'k_tokp16', type: 'mamai_tokp', x: 16, y: 21, tex: 'npc_penghulu_0', keep: true, when: function (S) { var s = st(S); return s === 1 || s === 5; } },
    { id: 'k_amin16', type: 'mamai_amin', x: 14, y: 17, tex: 'npc14_amin_0', keep: true, when: between(7, 10) },
    { id: 'k_imam16', type: 'mamai_imam', x: 11, y: 18, tex: 'npc14_imam_0', keep: true, when: between(7, 10) }
  );
  // while they sleepwalk in Kampung Tepian, they are not at home too
  var SN = { sn_jusoh1: 'jusoh', sn_bahar1: 'bahar', sn_kak: 'senah' };
  LC.AREAS.senah.objects.forEach(function (o) {
    var who = SN[o.id], when = o.when;
    if (who) o.when = function (S) { return (!when || when(S)) && !C.asleep(S, who); };
  });
  var villager = LC.villager, VID = { mat: 1, zul: 1, leong: 1 };
  LC.villager = function (vid) {
    var v = villager.apply(this, arguments), S = LC.State.s;
    if (v && S && VID[vid] && C.asleep(S, vid)) return Object.assign({}, v, { area: 'none' });
    return v;
  };

  // ---------------------------------------------------------------- items, the recipe, Nek Lampir's senduk
  function addItems(m) { Object.keys(m).forEach(function (id) { var it = m[id]; it.id = id; it.icon = it.icon || 'i_' + id; LC.ITEMS[id] = it; }); }
  addItems({
    jamu_bangun: { name: 'Jamu Bangun', kind: 'dish', sell: 90, energy: 70, food: { full: 14, joy: 6 }, desc: 'Nek Lampir\'s wake-up tonic: wild honey, herbs and pandan, brewed hot on Si Bara\'s fire. One sip and your eyes open wide.' },
    senduk_lampir: { name: 'Senduk Lampir', kind: 'treasure', desc: 'Nek Lampir\'s old wooden ladle. With it in your bag, home-cooked dishes give you half as much energy again.' }
  });
  LC.FIXED_ITEMS.senduk_lampir = 1;
  var RECIPE = { out: 'jamu_bangun', inp: { madu_tualang: 1, herba: 1, pandan: 1 } };
  LC.mamaiRecipe = function (S) {
    var want = !!(S && st(S) >= C.end), i = LC.RECIPES.indexOf(RECIPE);
    if (want && i < 0) LC.RECIPES.push(RECIPE);
    if (!want && i >= 0) LC.RECIPES.splice(i, 1);
  };

  LC.SPEAKERS.lampirspirit16 = { name: 'Nek Lampir (spirit)', portrait: 'npc_lampir_0' };
  LC.SPEAKERS.leong16 = { name: 'Tukang Leong', portrait: 'npc_leong_0' };
  LC.SPEAKERS.mat16 = { name: 'Pak Mat', portrait: 'npc_mat_0' };
  LC.SPEAKERS.zul16 = { name: 'Abang Zul', portrait: 'npc_zul_0' };

  LC.MAMAI_TEXT = {
    start: 'Tok Penghulu is waiting for you at the gelanggang in Kampung Tepian.',
    request: [
      ['penghulu15', 'Everyone is safe, the roofs are mended, and the rain has come. The kampung wants to give thanks together.'],
      ['penghulu15', 'A majlis doa kesyukuran, at the gelanggang. And since you saved the kampung, we would like you to host it.'],
      ['penghulu15', 'Invite everyone: Pak Mat, Abang Zul, Tukang Leong, Tok Imam to lead the doa, and Kak Senah and Jusoh down the lane. Then the food!']
    ],
    invite: {
      mat: [['mat16', 'A majlis? With food? I\'ll be there, and I\'ll bring ikan bakar!']],
      zul: [['zul16', 'I\'ll close the shop early. And I\'ll fix everyone\'s bicycle bells for free on the way.']],
      leong: [['leong16', 'I\'ll carve a new stand for the food trays. Hand-made, of course.']],
      imam: [['imam14', 'It would be an honour to lead the doa. Gratitude is the best way to end a hard week.']],
      senah: [['senah14', 'A majlis? You\'re cooking? Then I\'ll come and taste. Critically. HAHAHAHA!']],
      jusoh: [['jusoh14', 'Will there be ghosts? No? Fire? No? Then I\'ll sit near the food. Bravely.']]
    },
    invited: 'Everyone is invited! Now the kitchen needs more hands: ask Amin at Kak Senah\'s house, and Si Bara at your dapur.',
    hire: {
      amin: [['amin14', 'Me? In your kitchen? I\'ll bring my own apron! Mak Long says I can go if I\'m home by Isyak.']],
      bara: [['sibara15', 'Keep the kitchen fire? That\'s my favourite job in the whole world! Not too hot, not too small. Just right.']]
    },
    arrive: [
      ['', 'A cold breeze blows through the kitchen. A lantern you have never seen sits by the dapur, glowing softly blue.'],
      ['lampirspirit16', 'Don\'t scream. I\'m only a little bit dead.'],
      ['lampirspirit16', 'Suraya let me out of my old lantern for a few nights. I caused this kampung so much trouble once... Let me help make it right. Give me the ladle.'],
      ['pelita15', '(Pelita spins around the lantern, glowing with joy.)'],
      ['', 'Nek Lampir joins your kitchen. Cook the feast: three pots beside the dapur.']
    ],
    pot: {
      nasi: [['amin14', 'Ghee, cinnamon, star anise... The rice is turning golden! Nasi minyak, done!']],
      ayam: [['lampirspirit16', 'I brought the chicken from the pasar. You bring the cili. Masak merah needs fire, and fire we have.'],
        ['', '(Nek Lampir reaches for a little jar on the shelf and sprinkles in a yellow powder.)'],
        ['lampirspirit16', 'A pinch of kunyit, for colour. Pretty, isn\'t it?']],
      seri: [['', 'You lay Kak Senah\'s seri muka on the trays in neat green-and-white rows.']]
    },
    cooked: 'The feast is ready! The majlis begins at the gelanggang in Kampung Tepian after 6 PM.',
    early: [['penghulu15', 'The guests come after 6 PM. Rest a little; a host needs strength too.']],
    majlis: [
      ['penghulu15', 'Welcome, everyone. Tonight we give thanks: the fire is out, and not one of us was hurt.'],
      ['', 'Tok Imam leads the doa kesyukuran. The whole kampung is quiet and grateful, and hopes the fire never comes again.'],
      ['', 'Then the dulang are uncovered: golden nasi minyak, ayam masak merah and rows of seri muka. Everyone eats together.'],
      ['jusoh14', 'Second helping of the ayam! Look how yellow and pretty the sauce is!'],
      ['amin14', 'No ayam for me. The cili makes my ears hot.'],
      ['', 'Nek Lampir watches everyone eat. For the first time in years, she smiles.'],
      ['', 'The majlis ends with full bellies and warm goodbyes. Go home and rest.']
    ],
    morning: 'Dawn... A strange mumbling drifts over from Kampung Tepian: "nasiii... nasiii..."',
    shakeHint: 'They won\'t wake up! Nobody is hurt, but they are deeply, deeply asleep. Find out why.',
    mumble: {
      jusoh: ['zombiii...', 'nasiii...', 'not... scared...'], bahar: ['fine... particulate... matter...', 'sci... ence...'],
      senah: ['HA... HA... HA...', 'seri... muka...'], mat: ['ikan... besar...', 'nasiii...'],
      zul: ['basikal... saya...', 'ting... ting...'], leong: ['kayu... jati...', 'smooth... very... smooth...']
    },
    shake: ['Mmm... five more minutes...', 'Nasiii...', '(a sleepy snore)'],
    clue: {
      amin: [['amin14', 'Everyone is sleepwalking except me and Tok Imam! I didn\'t eat the ayam masak merah, and Tok Imam only had the seri muka.'],
        ['', 'Clue: only the people who ate the ayam masak merah are sleepwalking.']],
      jar: [['', 'Behind the dapur: an empty little jar. The label, in spidery old handwriting, says: "SERBUK LENA. For sleepless nights. NOT FOR FOOD!!"']],
      bara: [['sibara15', 'During the cooking I saw a floating old lady sprinkle yellow powder into the red pot. She said it was for colour.']]
    },
    clued: 'Every clue points to the kitchen... and to Nek Lampir.',
    imam: [['imam14', 'Let us not blame anyone before we know what happened. Find out gently, and help them first.']],
    aminAfter: [['amin14', 'Mak Long is walking in circles round the well. Please hurry!']],
    jarAfter: [['', 'The empty jar of Serbuk Lena. Somebody should really label their jars better.']],
    confess: [
      ['lampirspirit16', 'Serbuk Lena? In MY handwriting? ...Oh no.'],
      ['lampirspirit16', 'I thought it was kunyit. I only wanted the ayam to be a pretty colour. But a ghost can\'t smell anything... not even her own sleeping powder.'],
      ['lampirspirit16', 'I made it years ago, for nights when the kampung kept me awake. Nobody is hurt: they are only asleep on their feet.'],
      ['pelita15', '(Pelita pats her shoulder. She sniffs.)'],
      ['lampirspirit16', 'There is a cure: Jamu Bangun. Bring me Madu Tualang from the wild bees of Hutan Rimba, two Herba from the same forest, and one Pandan. Only Si Bara\'s fire is hot enough to brew it.']
    ],
    brewed: [
      ['sibara15', 'Hotter? HOTTER? Yes!'],
      ['lampirspirit16', 'Six cups of Jamu Bangun. One for each sleepwalker. Go! And don\'t let Jusoh have seconds.']
    ],
    lampir: {
      4: 'Chop, chop! The guests won\'t feed themselves.',
      5: 'Go, go, enjoy the majlis. I\'ll keep an eye on the pots.',
      6: 'Such a lovely majlis. Go home and sleep. I\'ll tidy up.',
      7: 'Hmm? Why is everyone so quiet today?',
      10: 'One cup each. Gently. They\'re asleep, not cross.'
    },
    give: 'Give the Jamu Bangun to the sleepwalkers in Kampung Tepian.',
    woke: {
      jusoh: [['jusoh14', 'Why am I holding a coconut? ...I was NOT a zombie. I was practising walking slowly.']],
      bahar: [['bahar14', 'Collective somnambulism! Fascinating! Also, why are my shoes on my hands?']],
      senah: [['senah14', 'HAHAHAHA! I dreamed I was a seri muka. A very sleepy seri muka.']],
      mat: [['mat16', 'I dreamed of the biggest ikan in the river... Why am I standing in the chicken coop?']],
      zul: [['zul16', 'Was my radio playing all morning? No? That was me humming? For three hours?']],
      leong: [['leong16', 'I have been sanding the same post since dawn. It is very smooth now.']]
    },
    finale: [
      ['', 'The last sleepwalker blinks awake. All over the kampung, people are rubbing their eyes.'],
      ['lampirspirit16', 'I am sorry, everyone. I only wanted to help.'],
      ['penghulu15', 'And you did help. You cooked for the whole kampung. Next time, just label your jars.'],
      ['imam14', 'We gave thanks that everyone was safe, and everyone is safe still. Let us forgive, as we hope to be forgiven.'],
      ['senah14', 'From today, she is the kampung\'s Honorary Grandmother! HAHAHAHA!'],
      ['', 'And for the first time anyone can remember, Nek Lampir laughs.'],
      ['lampirspirit16', 'Take my senduk. Home cooking will warm you even more now. And keep my lantern on Nenek\'s porch... I\'ll visit on quiet nights.'],
      ['', '✦ Chapter 16 complete! ✦ The Senduk Lampir (home-cooked dishes give half as much energy again), the Jamu Bangun recipe, 1000 kepeng, and Nek Lampir\'s lantern on the farm porch.'],
      ['pelita15', '(Pelita and the lantern glow together.)']
    ],
    lantern: [['', 'Nek Lampir\'s lantern. On quiet nights it glows a little brighter, and the dapur smells faintly of kunyit. The real kind.']]
  };
})(window.LC);
