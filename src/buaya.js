/* Chapter 20 (the last chapter): Janji Buaya Putih, "the White Crocodile's Promise" (v3.22, Part 1). The owner asked for a
 * finale with the buaya putih, Kampong Ayer, a crocodile who wants to go home to Sabah, and a story that belongs to the
 * player and to Pelita. Three threads tie it together: a white crocodile saved your family nearly a hundred years ago
 * (the baby she carried out of the flood was Nenek's mother); Pelita is a spark of her light; and the shadow that
 * hunts her is Pelita's own (every light casts one). Sang Kancil comes from the old folk tales only.
 * Kept respectful: some people hold the buaya putih to be keramat, so Seri Putih is a dignified guardian, with no
 * offerings and no worship. No crocodile is ever hurt.
 * Part 1 (this file) runs from the farm to Kampong Ayer; Part 2 (Sabah and the finale) raises C.end.
 * Steps (S.quests.ch20): 0 a night after Chapter 19: the river blinks · 1 the cucumber thief (Nenek's sticky scarecrow,
 * a night watch) · 2 follow Sang Kancil to the reeds · 3 feed Seri Putih, then sail by night (the jong) · 4 Kampong Ayer
 * is afraid (calm the village) · 5 help her rest (the cradle, the bell, fish) · 6 the Night of Fire · 7 Pelita, alone ·
 * 8 the send-off (Part 1 complete: the jong waits in Teluk Barunai for the monsoon wind). */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var C = LC.C20 = {
    end: 8, part1: 8, night: 19 * 60, hookAt: 21 * 60, fireAt: 21 * 60, watchAt: 20 * 60,
    ready: function (S) { return !!(S && S.quests && LC.C19 && LC.C19.step(S) >= LC.C19.end); },
    step: function (S) { return (S && S.quests && S.quests.ch20) || 0; },
    // the farm
    farm: {
      patch: { x: 7, y: 12 }, hide: { x: 11, y: 7 }, scare: { x: 8, y: 12 },
      reeds: { x: 38, y: 27 }, croc: { x: 37, y: 29 }, nenekRun: { x: 36, y: 27 },   // (she lies along the bank, in reach from the sand)
      jetty: { nenek: { x: 23, y: 27 }, kancil: { x: 24, y: 27 } },
      kancilHome: { x: 9, y: 12 }
    },
    fishFarm: 5, fishKA: 3,
    // Kampong Ayer (the walkways of Barunai)
    ka: {
      croc: { x: 14, y: 26 }, rakit: { x: 14, y: 25 },
      nenek: { x: 4, y: 20 }, kancil: { x: 3, y: 20 },
      semaun: { x: 26, y: 20 }, berbai: { x: 22, y: 20 }, sari: { x: 7, y: 22 },
      folk: [{ id: 'esah', x: 10, y: 22 }, { id: 'jalil', x: 18, y: 22 }, { id: 'tijah', x: 31, y: 22 }],
      lamps: [{ x: 8, y: 20 }, { x: 14, y: 20 }, { x: 22, y: 22 }, { x: 27, y: 20 }, { x: 33, y: 22 }, { x: 39, y: 20 }],
      fireStart: [{ x: 22, y: 21 }, { x: 23, y: 21 }, { x: 28, y: 23 }],
      zone: { x0: 17, y0: 15, x1: 31, y1: 26 },   // the middle of the village: the fire, and where you fight it
      cuts: [{ x: 16, y: 21 }, { x: 32, y: 21 }, { x: 20, y: 26 }, { x: 28, y: 26 }],
      family: { x: 30, y: 24 }, taxi: { x: 23, y: 19 }, child: { x: 28, y: 25 }, pelita: { x: 17, y: 21 },
      chain: { x: 24, y: 20 }
    },
    fire: { spread: 2.3, cap: 34, hot: 3, chainEvery: 7, outerEvery: 4 },
    // the night voyage
    sea: { W: 204, H: 40, start: { x: 5, y: 20 }, goalX: 194, storm: { x0: 98, x1: 134 },
      isles: [{ x: 52, y: 13, name: 'Pulau Batu Kecil' }, { x: 104, y: 9, name: 'Pulau Pandan' }, { x: 154, y: 17, name: 'Pulau Burung' }] },
    ship: { speed: 74, accel: 60, turn: 2.4 },
    calm: { start: 76, decay: 1.3, stormDecay: 2.6, pet: 10, petCd: 2.2, feed: 40, thunder: 9, bump: 14 },
    croc: { speed: 63, lag: 34, weak: 2.5, drain: 9, heal: 3 },
    reward: 1500
  };
  C.isNight = function (S) { return S.minutes >= C.night || S.minutes < 6 * 60; };
  C.fishCount = function () { return LC.State.count('@fish'); };   // (any fish: the cheapest go first, so rare ones are kept)
  C.ring = function (calm) { return 44 + Math.max(0, Math.min(100, calm)) * 1.05; };
  function st(S) { return C.step(S); }
  function q(S) { return S.quests; }

  // ---------------------------------------------------------------- items, the shadows, who speaks
  function addItems(m) { Object.keys(m).forEach(function (id) { var it = m[id]; it.id = id; it.icon = it.icon || 'i_' + id; LC.ITEMS[id] = it; }); }
  addItems({
    getah20: { name: 'Getah Orang-Orang', kind: 'treasure', desc: 'Nenek\'s old trick: a straw scarecrow and a pot of sticky rubber sap, from her own Nenek\'s time. "Whatever steals from you will stick to it."' },
    loceng20: { name: 'Loceng Tembaga', kind: 'treasure', desc: 'A little brass bell from Dang Kemala\'s workshop in Kampong Ayer, made for Seri Putih\'s cradle, so she can find you in the dark. It rings like a laugh.' }
  });
  LC.FIXED_ITEMS.loceng20 = 1;

  LC.ENEMIES.kelam20 = { name: 'Bayang', texture: 'kelam', hp: 9, speed: 34, dmg: 6, sight: 160, w: 6, drop: [] };
  if (LC.ENEMY_LV) LC.ENEMY_LV.kelam20 = 30;

  LC.SPEAKERS.putih20 = { name: 'Seri Putih', portrait: 'buaya20_face' };
  LC.SPEAKERS.kancil20 = { name: 'Sang Kancil', portrait: 'kancil20_0' };
  LC.SPEAKERS.nenek20 = { name: 'Nenek', portrait: 'npc_nenek_0' };
  LC.SPEAKERS.pelita20 = { name: 'Pelita', portrait: 'ghost', expr: 'sad' };
  LC.SPEAKERS.wira20 = { name: 'Juragan Wira', portrait: 'wira_0' };
  LC.SPEAKERS.semaun20 = { name: 'Awang Semaun', portrait: 'npc_semaun_0' };
  LC.SPEAKERS.berbai20 = { name: 'Pateh Berbai', portrait: 'npc_berbai_0' };
  LC.SPEAKERS.sari20 = { name: 'Damang Sari', portrait: 'npc_sari_0' };
  LC.SPEAKERS.lajak20 = { name: 'Pak Lajak', portrait: 'npc_lajak_0' };
  LC.SPEAKERS.kemala20 = { name: 'Dang Kemala', portrait: 'npc_kemala_0' };
  LC.SPEAKERS.esah20 = { name: 'Mak Esah', portrait: 'npc20_esah_0' };
  LC.SPEAKERS.jalil20 = { name: 'Pak Jalil', portrait: 'npc20_jalil_0' };
  LC.SPEAKERS.tijah20 = { name: 'Kak Tijah', portrait: 'npc20_tijah_0' };
  LC.SPEAKERS.anak20 = { name: 'Awang Kecil', portrait: 'npc20_anak_0' };

  // ---------------------------------------------------------------- the farm
  function thing(id, type, at, tex, when, extra) { return Object.assign({ id: id, type: type, x: at.x, y: at.y, tex: tex, keep: true, when: when }, extra || {}); }
  var F = C.farm;
  LC.OBJECTS.push(
    thing('f_timun20', 'buaya_patch', F.patch, 'timun20', function (S) { return C.ready(S) && st(S) === 0; }, { w: 1 }),
    thing('f_timun20b', 'buaya_patch', F.patch, 'timun20_kosong', function (S) { var s = st(S); return s >= 1; }),
    thing('f_orang20', 'buaya_scare', F.scare, 'orang_getah20', function (S) { return st(S) === 1 && !!q(S).c20set; }),
    thing('f_jerami20', 'buaya_hide', F.hide, 'jerami20', function (S) { return st(S) === 1; }),
    thing('f_rumput20', 'buaya_reeds', F.reeds, 'rumput20', function (S) { var s = st(S); return s >= 2; }, { w: 2 }),
    thing('f_putih20', 'buaya_croc', F.croc, 'buaya20g_0', function (S) { return st(S) === 3; }, { w: 4 }),
    thing('f_nenek20', 'buaya_nenek', F.jetty.nenek, 'npc_nenek_0', function (S) { return st(S) === 3; }),
    thing('f_kancil20', 'buaya_kancil', F.jetty.kancil, 'kancil20_0', function (S) { return st(S) === 3; }),
    thing('f_kancil20b', 'buaya_kancil', F.kancilHome, 'kancil20_0', function (S) { var s = st(S); return s >= C.part1 && !(s >= 9 && s <= 18) && q(S).c20kancil !== 'with'; })   // (v3.23: he comes to Sabah; later he can travel with you)
  );

  // ---------------------------------------------------------------- Kampong Ayer
  var K = C.ka, B = LC.AREAS.barunai.objects;
  function inKA(S) { var s = st(S); return s >= 4 && s <= 7; }
  B.push(
    thing('k_putih20', 'buaya_croc', K.croc, 'buaya20g_0', function (S) { return inKA(S); }, { w: 4 }),
    thing('k_rakit20', 'bldg', K.rakit, 'rakit20', function (S) { return inKA(S) && !!(q(S).c20task || {}).rakit; }, { w: 2, text: 'Pak Lajak\'s floating cradle: a wide raft of belian and nibong, lashed with rotan, padded with nipah. Seri Putih rests her chin on it.' }),
    thing('k_nenek20', 'buaya_nenek', K.nenek, 'npc_nenek_0', function (S) { return inKA(S); }),
    thing('k_kancil20', 'buaya_kancil', K.kancil, 'kancil20_0', function (S) { return inKA(S); }),
    thing('k_semaun20', 'buaya_semaun', K.semaun, 'npc_semaun_0', function (S) { var s = st(S); return s >= 4 && s <= 6; }),
    thing('k_berbai20', 'buaya_berbai', K.berbai, 'npc_berbai_0', function (S) { return st(S) === 4 && (q(S).c20calm || 0) >= 4; }),
    thing('k_sari20', 'buaya_sari', K.sari, 'npc_sari_0', function (S) { return st(S) === 4 && !!q(S).c20proof; }),
    thing('k_taxi20', 'buaya_taxi', K.taxi, 'perahu_kecil', function (S) { return st(S) === 6; })
  );
  K.folk.forEach(function (f) { B.push(thing('k_' + f.id + '20', 'buaya_folk', f, 'npc20_' + f.id + '_0', function (S) { return inKA(S); }, { who: f.id })); });
  K.lamps.forEach(function (l, i) { B.push(thing('k_lampu20_' + i, 'buaya_lamp', l, 'lampu20_on', function (S) { var s = st(S); return (s >= 4 && s <= 7) || s === 18; }, { idx: i })); });   // (v3.23: and the last feast)
  // the shadows that come on the Night of Fire (WorldBuaya.js turns them on and off), and the clock stands still while
  // the village burns, so midnight never cuts the fight short
  LC.AREAS.barunai.enemies = (LC.AREAS.barunai.enemies || []).concat([{ kind: 'kelam20', n: 4, zone: K.zone, c20: true }]);
  Object.defineProperty(LC.AREAS.barunai, 'frozenClock', { configurable: true, get: function () { return !!LC.c20fireOn; } });
  // Teluk Barunai: after Part 1, the jong waits at anchor for the monsoon wind, and Seri Putih rests in the warm shallows
  LC.AREAS.teluk.objects.push(
    thing('t_jong20', 'buaya_wait', { x: 4, y: 8 }, 'jong_majapahit', function (S) { var s = st(S); return s >= C.part1 && s <= 9; }, { w: 5 }),
    thing('t_putih20', 'buaya_wait', { x: 10, y: 12 }, 'buaya20_0', function (S) { var s = st(S); return s >= C.part1 && s <= 9; }, { w: 4 })
  );

  // the people of Kampong Ayer you calm (Chapter 20 only)
  C.folk = {
    esah: { look: { skin: '#a8714a', shirt: '#2e7a6a', shirt2: '#1e5a4e', bottom: '#6a3a2a', bottom2: '#4e2a1e', hair: '#3a2a20', hat: 'tudung', hatColor: '#e9c46a' } },
    jalil: { look: { skin: '#9a6440', shirt: '#7a5a2a', shirt2: '#5a4220', bottom: '#3a3a4a', bottom2: '#2a2a36', hair: '#1a1210', hat: 'headband', beard: '#5a5a5a' } },
    tijah: { look: { skin: '#b5784e', shirt: '#c85a7a', shirt2: '#a03a5a', bottom: '#4a3a6a', bottom2: '#3a2a52', hair: '#1a1210', hat: 'bun' } },
    anak: { look: { skin: '#a8714a', shirt: '#e9c46a', shirt2: '#c4922f', bottom: '#3a5a8a', bottom2: '#2a426a', hair: '#1a1210' } }
  };

  // ---------------------------------------------------------------- the night sea (the voyage)
  function buildSea() {
    var Wd = C.sea.W, Hd = C.sea.H, g = [], x, y;
    for (y = 0; y < Hd; y++) { g.push([]); for (x = 0; x < Wd; x++) g[y].push('o'); }
    function ell(cx, cy, rx, ry, ch) { for (var yy = Math.max(0, Math.floor(cy - ry)); yy <= Math.min(Hd - 1, Math.ceil(cy + ry)); yy++) for (var xx = Math.max(0, Math.floor(cx - rx)); xx <= Math.min(Wd - 1, Math.ceil(cx + rx)); xx++) { var dx = (xx - cx) / rx, dy = (yy - cy) / ry; if (dx * dx + dy * dy <= 1) g[yy][xx] = ch; } }
    // the coast of Borneo along the south, with headlands
    for (x = 0; x < Wd; x++) {
      var top = 33 + Math.round(Math.sin(x / 7) * 1.2 + Math.sin(x / 3.1) * 0.6);
      [[24, 26], [74, 24], [128, 26], [176, 25]].forEach(function (hl) { if (Math.abs(x - hl[0]) <= 6) top = Math.min(top, hl[1] + (Math.abs(x - hl[0]) * 1.2 | 0)); });   // headlands to steer round
      for (y = top; y < Hd; y++) g[y][x] = y <= top + 1 ? 's' : 'J';
      if (g[top - 1]) g[top - 1][x] = 'h';
    }
    // the mouth of the Brunei river at the east end: a channel into the coast
    for (y = 24; y < Hd; y++) for (x = C.sea.goalX; x < Wd; x++) g[y][x] = y < 31 ? 'o' : (x === C.sea.goalX || x === Wd - 1 ? 's' : 'o');
    // islands (and their reefs)
    C.sea.isles.forEach(function (i) { ell(i.x, i.y, 5.5, 3.6, 'h'); ell(i.x, i.y, 3.6, 2.4, 's'); ell(i.x, i.y - 0.5, 2.2, 1.4, 'J'); });
    [[14, 8, 2.5, 1.6], [36, 18, 3, 2], [66, 8, 3, 2], [82, 20, 4, 2.4], [92, 12, 3, 1.8], [116, 22, 3.5, 2], [122, 7, 3, 2], [140, 15, 4, 2.2], [166, 9, 3, 2], [184, 18, 3.5, 2.2]].forEach(function (r) { ell(r[0], r[1], r[2], r[3], 'h'); ell(r[0], r[1], r[2] * 0.4, r[3] * 0.4, 's'); });
    return g;
  }
  LC.AREAS.laut20 = {
    name: 'Laut Malam', sub: 'the night sea, along the coast of Borneo', lvl: 20, build: buildSea, objects: [], voyage20: 'night', frozenClock: true,
    pond: 'sea', amb: 'sea', decor: { n: 0, types: [], on: 's' }, exits: [], home: { x: C.sea.start.x, y: C.sea.start.y }, ride: {}
  };

  // ---------------------------------------------------------------- sounds (a crackling fire, a deep rumble, a squeak)
  var sfx = LC.Audio.sfx;
  LC.Audio.sfx = function (name) {
    var A = LC.Audio;
    if (['api20', 'siram20', 'buaya20', 'kancil20', 'loceng20', 'bayang20', 'retak20'].indexOf(name) < 0) return sfx.apply(this, arguments);
    if (!A.ctx || A.ctx.state !== 'running' || !A.vol || !A.vol.sfx) return;
    var t = A.ctx.currentTime + 0.01, i;
    if (name === 'api20') { for (i = 0; i < 5; i++) A.noise(t + i * 0.07 + Math.random() * 0.05, 0.05, 0.05, 'highpass', 2000, 4000); A.noise(t, 0.5, 0.05, 'lowpass', 600, 300); }
    else if (name === 'siram20') { A.noise(t, 0.45, 0.14, 'bandpass', 1400, 500); A.noise(t + 0.1, 0.6, 0.06, 'highpass', 3000, 1500); }
    else if (name === 'buaya20') { A.tone(t, 'sawtooth', 62, 48, 0.9, 0.16); A.tone(t, 'sine', 90, 60, 1.0, 0.18); A.noise(t + 0.1, 0.8, 0.05, 'lowpass', 300, 120); }
    else if (name === 'kancil20') { A.tone(t, 'triangle', 1300, 1700, 0.07, 0.07); A.tone(t + 0.09, 'triangle', 1500, 1900, 0.07, 0.06); }
    else if (name === 'loceng20') { [1568, 2093, 2637].forEach(function (f, k) { A.tone(t + k * 0.004, 'sine', f, f * 0.998, 1.4, 0.05 / (k + 1)); }); }
    else if (name === 'bayang20') { A.tone(t, 'sine', 180, 90, 0.6, 0.06); A.noise(t, 0.5, 0.04, 'bandpass', 500, 200); }
    else { A.noise(t, 0.3, 0.12, 'lowpass', 900, 200); A.tone(t, 'square', 110, 60, 0.2, 0.05); }
  };

  // ---------------------------------------------------------------- what they say
  LC.BUAYA_TEXT = {
    hook: [
      ['', 'Late at night, a white light flashes once deep under the river behind the farm. Then the water goes black and silent. No frogs. No fish jumping.'],
      ['nenek20', '(Nenek is awake at her window, holding the old family lamp in both hands.)'],
      ['nenek20', 'When my mother was a baby, a great flood came down this river. The water took her basket. Everyone thought she was lost.'],
      ['nenek20', 'Then a white crocodile rose out of the flood and carried the basket to the shore in her mouth. Gently, cucu. Like her own egg.'],
      ['nenek20', 'Without her there would be no me. And no you. Our family promised to look after her river.'],
      ['nenek20', 'My grandmother used to say: when the river turns black, the White One is fading.'],
      ['pelita20', '(Pelita, usually fast asleep by now, is pressed against the window, trembling. It will not look at the river.)']
    ],
    hookToast: 'The river behind the farm has gone black and silent...',
    morning: [
      ['nenek20', 'Cucu! Come and look at my timun! Every vine stripped bare in one night!'],
      ['', 'Nenek\'s cucumber vines by the field are bitten down to the stalks. In the soft earth: tiny pointed hoof prints, no bigger than your thumb.'],
      ['nenek20', 'Something small, and very clever. Well. My Nenek had a trick for clever thieves. Wait here.'],
      ['nenek20', 'A straw scarecrow and a pot of getah. Rubber sap, sticky as a bad debt. Stand it by the vines and hide. Whatever comes to steal will stick fast.'],
      ['', '(You got the Getah Orang-Orang. Set the scarecrow up by Nenek\'s vines, then hide in the straw pile by the spirit house after 8 PM and keep still.)']
    ],
    patchEmpty: 'Nenek\'s cucumber vines, bitten to the stalks. Tiny hoof prints everywhere.',
    patchSet: 'You stand the scarecrow by the vines and paint it all over with getah. It glistens. It smells like a tyre factory.',
    patchFull: 'Nenek\'s cucumber vines, heavy with fruit.',
    patchAfter: 'Nenek\'s cucumber vines are growing back. Sang Kancil swears he is "guarding" them.',
    scareDay: 'The sticky scarecrow stands by the vines. The thief comes at night: hide in the straw pile after 8 PM.',
    hideIn: 'You burrow into the straw. It is prickly and warm. Keep still, and watch the scarecrow.',
    hideOut: 'You climb out of the straw.',
    hideDay: 'A pile of straw by the spirit house. A good place to hide, after dark (8 PM).',
    hideNeed: 'Set up the sticky scarecrow by Nenek\'s vines first.',
    comes: '(A tiny shape tiptoes out of the dark towards the vines...)',
    fled: 'The little thief sees you move and bolts into the dark! Hide again and keep still. It will be back.',
    stuck: [
      ['', 'THWACK. The little thief walks straight into the scarecrow, and sticks fast: front hooves, back hooves and one indignant ear.'],
      ['', 'It is a mousedeer, no bigger than a cat, with enormous dark eyes.'],
      ['kancil20', 'I am not stuck. I am guarding your scarecrow. You are welcome.'],
      ['kancil20', '...All right. I am a little bit stuck. Sang Kancil, at your service. Mostly at my own service, but today, yours.']
    ],
    catchHint: 'The thief is stuck to the scarecrow! Go and catch it (press USE beside the scarecrow).',
    caught: [
      ['kancil20', 'Yes, yes, I ate the cucumbers. But not for me! Look at me. Do I look like I could eat forty cucumbers?'],
      ['kancil20', 'I carried them to someone who is too tired to hunt. Something is wrong with the river. The fish have gone, the frogs have gone, and she is fading.'],
      ['kancil20', 'Unstick me, and I will show you. Down by the reeds, on the east bank. Come quietly. She is shy.'],
      ['', '(You peel Sang Kancil off the scarecrow. He shakes each hoof, very offended, and trots off towards the river. Follow him to the reeds on the east bank.)']
    ],
    reedsHint: 'Follow Sang Kancil to the tall reeds on the east bank of the river.',
    found: [
      ['', 'In the reeds lies a huge crocodile, longer than Nenek\'s sampan. Her scales should be white, but they have gone dull and grey, like old ash.'],
      ['', 'She opens one golden eye. It is very old, and very kind.'],
      ['putih20', 'So. The little thief has brought me a farmer.'],
      ['nenek20', '(Footsteps on the bank. Nenek is running, out of breath, her shawl slipping off her shoulders.)'],
      ['nenek20', 'It is you. It is really you. My mother\'s crocodile.'],
      ['putih20', 'Little family. I remember the basket. I remember a baby who did not cry, but laughed at me.'],
      ['putih20', 'I am Seri Putih. I came to this river in a storm, long, long ago, from far away. And I am old now, and fading.'],
      ['putih20', 'Take me home. To the Kinabatangan, in Sabah, the river where I hatched. I want my eggs to hatch where I did. But I cannot swim the whole sea alone.'],
      ['nenek20', '(Nenek wipes her eyes and stands up very straight.) We are going. All of us.'],
      ['pelita20', '(Pelita hides behind you. It will not go near her. If you look closely, Pelita\'s shadow on the ground is a little longer than it should be.)'],
      ['nenek20', 'First, she must eat. She has been starving herself for weeks. Bring her fish, cucu. Five, at least.']
    ],
    feedMore: '(Seri Putih eats the fish in one gulp, and sighs. Fed: {n} / {need}.)',
    feedNone: 'Seri Putih needs fish: catch some with the joran in the river, or buy them. (Fed: {n} / {need}.)',
    fedFarm: [
      ['putih20', 'Mm. I had forgotten what it is to be full.'],
      ['nenek20', 'Good. Then we sail tonight. Juragan Wira\'s jong is at the jetty. She swims only at night: the sun hurts her tired scales.'],
      ['nenek20', 'Badang will mind the farm. Do not argue with me, cucu. I am coming.'],
      ['', '(When you are ready, after 7 PM, board the Majapahit jong at the farm jetty and sail to Kampong Ayer.)']
    ],
    crocFarm: ['Seri Putih watches the jetty with one eye open.', 'Seri Putih breathes slow and deep. Ripples run out across the black water.', 'Seri Putih rumbles softly when Nenek comes near.'],
    nenekJetty: ['My mother never got to thank her. I will.', 'Sail after dark, cucu. She swims only at night.', 'I packed kuih for the voyage. And a blanket. And another blanket.'],
    kancilJetty: ['I am coming too. Borneo is where my cousins live! Also, the jong has a kitchen.', 'Do not tell the crocodile I said so, but I am a tiny bit scared of crocodiles.', 'If anyone asks, I am the navigator.'],
    sailDay: 'Juragan Wira: "She swims only at night, friend. Come back after 7 PM."',
    sailNeed: 'Juragan Wira: "Feed her first. She will never make it across the sea hungry."',
    // the voyage
    aboard: [
      ['wira20', 'Kampong Ayer, by night, with a crocodile for a sister ship. In forty years at sea I have never had a voyage like this.'],
      ['nenek20', 'Keep her inside Pelita\'s light, cucu. The dark is hungry tonight.']
    ],
    helm: 'You take the helm. Steer with the arrow keys or the stick, and keep Seri Putih inside Pelita\'s ring of light: shadows grab her in the dark. Pelita is frightened: press USE to comfort it (hold a dish to feed it) and its ring grows. Sail east, to the mouth of the Brunei river.',
    isle: '{isle}: a safe harbour. If Seri Putih tires, you will turn back and rest here.',
    weak: 'The shadows have pulled Seri Putih under! You turn back to {isle} and let her rest a while. Keep her in the light!',
    storm: 'A storm! The waves throw the jong about, and every crash of thunder makes Pelita shrink.',
    fishHit: ['A shadow fish slams into the hull! Pelita flinches.', 'BANG! Something dark hits the jong. Pelita\'s light shudders.', 'A shadow fish! Pelita hides its face.'],
    calmLow: 'Pelita is terrified. Comfort it (USE), or its light will shrink to nothing!',
    outside: 'Seri Putih is in the dark! Slow down and bring her back into the light.',
    kancilSea: ['Kancil (from the galley): "Do not mind me, I am navigating the kuih."', 'Kancil: "Is it normal for the sea to have hands? Asking for a friend."', 'Kancil: "Left! No, your other left!"', 'Nenek: "Steady, cucu. Steady."'],
    arrive: [
      ['', 'Far ahead, lamps glimmer on the water: hundreds of them, all at the same height, as if the stars had come down to sit on the river. The water village.'],
      ['', 'Behind you, the sky turns grey, then gold. Seri Putih slips into the calm river, and the jong follows her in.'],
      ['wira20', 'Kampong Ayer. I will anchor at the mouth of the bay. Good luck, friend. You will need it: water people do not love crocodiles.']
    ],
    // Kampong Ayer
    panic: [
      ['', 'Seri Putih glides under the houses to rest in their shade. A little boy on a walkway looks down, and sees her.'],
      ['anak20', 'BUAYA!! BUAYAAA!!'],
      ['', 'Shutters bang shut. Boats scatter. Somebody drops a whole tray of kuih into the river.'],
      ['semaun20', '(Awang Semaun comes thundering down the planks with a spear.) Stand aside! That thing will not take one of our children!'],
      ['nenek20', '(Nenek steps in front of the spear, all one and a half metres of her.) Then you will have to go through an old woman first.'],
      ['', 'Awang Semaun stops. But he does not lower the spear. Calm the water village: talk to the frightened neighbours on the walkways, and to Awang Semaun.']
    ],
    // three neighbours: say the right thing (the right answer is never last)
    folk: {
      esah: { say: 'A crocodile! Under MY house! My grandchildren swim off these steps every morning!', pos: 1,
        right: 'She is here to rest', wrong: [['She is very small', 'Mak Esah looks at the crocodile. She looks at you. "Small?!"'], ['She only eats bad children', 'Mak Esah grabs her broom. That did not help.']],
        after: '"She is old and tired, Mak Esah. She only wants to sleep in the shade, and then go home." Mak Esah lowers her broom. "...She does look tired. Poor old thing."' },
      jalil: { say: 'My father lost a leg to a crocodile! I will not sleep a wink with one under the walkway.', pos: 0,
        right: 'She has never hurt anyone', wrong: [['Then stay awake', 'Pak Jalil goes very red. Wrong thing to say.'], ['Crocodiles are delicious', 'Pak Jalil stares. So does the crocodile.']],
        after: '"She has never hurt anyone, Pak Jalil. She saved my great-grandmother from a flood." Pak Jalil rubs his chin. "...A crocodile that saves babies? I will have to see that."' },
      tijah: { say: 'Everyone says a white crocodile is a bad omen! Or a good omen! Nobody agrees! I am frightened either way!', pos: 1,
        right: 'She is just a guardian', wrong: [['It is a terrible omen', 'Kak Tijah screams and runs indoors. You wait. She comes out again, still screaming.'], ['Omens are not real', '"Then what is THAT?" She points at the enormous white crocodile. Fair point.']],
        after: '"She is not an omen, Kak Tijah. She is a guardian, like an old auntie for a river." Kak Tijah takes a breath. "An auntie. I can manage an auntie."' }
    },
    folkDone: { esah: 'Mak Esah is lowering a basket of fish down to Seri Putih on a rope. Very carefully.', jalil: 'Pak Jalil is sitting on his steps, watching the crocodile. "Still awake," he says. "But calmer."', tijah: 'Kak Tijah calls her "Mak Cik Buaya" now, and tells her the village gossip.' },
    semaun: { say: 'Words are cheap. I have seen what a crocodile\'s jaws can do. Why should I trust her?', pos: 1,
      right: 'Trust her as Nenek does', wrong: [['Because I say so', 'Awang Semaun grips the spear tighter. You are a guest here, and he is not convinced.'], ['Fight me for it', 'Awang Semaun, the strongest man in Borneo, looks at you with real pity.']],
      after: '"Look at Nenek, Awang Semaun. She has known that crocodile her whole life, through her mother. She is not afraid." He looks at Nenek for a long moment. Then the spear point dips. Just a little.' },
    semaunAfter: ['Awang Semaun still holds his spear. But now he leans on it, and watches the water.', 'Awang Semaun: "If she is what you say she is, she will show it. I will be watching."'],
    calmDone: '(The walkways are quiet again. Now Pateh Berbai wants a word: he is on the walkway by the pier.)',
    berbai: [
      ['berbai20', 'They say I think too much. Well, someone has to. Here is what I think.'],
      ['berbai20', 'A frightened village can be calmed with words. A wise village needs proof. Is there anyone here, anyone at all, who knows this crocodile?'],
      ['', '(Damang Sari, the quiet fisherman, has been listening from his boat by the market landing at the west end.)']
    ],
    berbaiLater: [['berbai20', 'Proof. Find me someone who knows her.']],
    sari: [
      ['sari20', 'I would rather fish than talk. But I will talk today.'],
      ['sari20', 'My grandfather swore a white crocodile used to bring lost boats home out of the fog. He would follow a white shape in the water, and there would be the jetty. Nobody believed him.'],
      ['sari20', 'I believed him. I have looked for her in the fog all my life.'],
      ['nenek20', '(Nenek climbs onto an upturned crate in the middle of the floating market.) Then let me tell you all about my mother.'],
      ['', 'Nenek tells the whole market the story of the flood, and the basket, and the crocodile who carried it. The padian women stop selling. The boat taxis stop rowing. Even the children stop splashing.'],
      ['', 'When she finishes, nobody says anything for a long time. Then Mak Esah lowers a fish into the water.'],
      ['berbai20', 'That is proof enough for me. Kampong Ayer, she is our guest. Treat her like one.'],
      ['nenek20', 'Now, cucu. She needs three things to rest properly: a cradle to float on, a bell so she can find us in the dark, and a good meal.']
    ],
    tasksHint: 'Help Seri Putih rest: ask Pak Lajak the boat builder for a floating cradle, ask Dang Kemala the brassmith for a little bell (both work on the craft quarter walkway, at the south of the village), and feed her 3 fish under the houses.',
    lajakAsk: [['lajak20', 'A cradle for a crocodile? Ha! Nobody has ever asked me that, and I have built everything that floats.'], ['lajak20', 'Bring me 6 Tiang Nibong and 3 Kayu Belian, and I will build her a raft so wide she can sleep on it like a queen.']],
    lajakNeed: 'Pak Lajak: "6 Tiang Nibong and 3 Kayu Belian. Nibong grows on the hills above Barunai; belian lies fallen in the deep forest." (You have {nib} nibong and {bel} belian.)',
    lajakDone: [['lajak20', 'Belian for the keel, always. It never rots. There! Fit for a queen. A scaly, enormous queen.'], ['', '(Pak Lajak lashes the raft together in no time, and floats it out beside Seri Putih. She rests her chin on it and sighs.)']],
    kemalaAsk: [['kemala20', 'A bell, so she can find you in the dark? Oh, what a lovely idea. Brass sings when it is beaten properly.'], ['kemala20', 'The brass alone costs me 400 kepeng. I will not charge you a sen for my work.']],
    kemalaNeed: 'Dang Kemala: "400 kepeng for the brass, and I will make it now."',
    kemalaDone: [['kemala20', 'There. Listen.'], ['', '(She rings it once. The note runs across the water, and under the houses Seri Putih lifts her head and rumbles back.)'], ['', '(You got the Loceng Tembaga.)']],
    feedKA: '(Seri Putih takes the fish from your hands, very gently, and the children on the walkway cheer. Fed: {n} / {need}.)',
    restDone: [
      ['nenek20', 'Look at her. A cradle, a bell and a full belly. She is sleeping like a baby.'],
      ['putih20', '(Seri Putih\'s scales have a little of their white back. She is fast asleep.)'],
      ['nenek20', 'Tonight the whole village can sleep too. And tomorrow, we will see.']
    ],
    workshopLook: { lajak: 'The boat builders\' shed. Pak Lajak is planing a plank and singing to it.', kemala: 'The brassmiths\' workshop. Dang Kemala waves a hammer at you.' },
    // the Night of Fire
    fireOut: 'One by one, every lamp in Kampong Ayer goes out. Something cold moves along the walkways...',
    fireStart: [
      ['', 'SHADOWS! Dark shapes slide along the planks, snuffing out every lamp they pass. In the dark, someone knocks over an oil lamp.'],
      ['', 'FIRE! Flames run along the walkway in the middle of the village, towards the houses!'],
      ['nenek20', 'Water, cucu! Buckets! And cut the bridges, or the whole village will burn!']
    ],
    fireHow: 'Put out the fire: scoop water from the river (USE facing the water), then press USE by a fire. Cut the marked planks (USE) to stop it spreading. The neighbours on the pier pass full buckets. A family is trapped on a house: take the boat taxi by the pier.',
    scoop: 'You scoop a bucket of river water.',
    douse: 'Hsssss! The fire dies in a cloud of steam.',
    hot: 'Too hot! Step back from the flames!',
    cutDone: 'You hack through the rotan lashings and kick the planks into the river. The fire cannot cross the gap now.',
    cutBurning: 'That plank is already burning. Put it out first!',
    chainGive: 'The neighbours on the pier hand you a full bucket. "Go! Go!"',
    family: 'A family is trapped on their house: the fire is all around the steps.',
    taxiGo: 'You leap into the boat taxi and row hard through the smoke to the trapped family.',
    taxiDone: [['', 'Pak Jalil\'s neighbours drop one by one into your boat: a grandfather, a mother, her little girl and a very wet cat. You row them back to the pier, coughing.'], ['', '"Thank you! Terima kasih! But my son... Awang Kecil ran back for his kite!"']],
    taxiAfter: 'The boat taxi bobs by the pier, smelling of smoke.',
    shadowsFlee: 'With the fire out, the last shadows slide off the walkways and sink into the black water.',
    child: [
      ['', 'On the burnt end of a walkway, little Awang Kecil is clutching his kite. The plank under his feet cracks.'],
      ['anak20', 'Mak...?'],
      ['', 'SPLASH. He falls into the black water, right where the planks were cut. Before anyone can move...']
    ],
    rescue: [
      ['', '...a great white shape rises from under the houses. Seri Putih glides through the smoke, opens her enormous jaws, and lifts the boy out of the water.'],
      ['', 'Gently. Like an egg.'],
      ['', 'She carries him to the steps of the craft quarter and lets him go. He sits there, dripping, still holding his kite.'],
      ['nenek20', '(Nenek covers her mouth with both hands.) That is how she carried my mother.'],
      ['anak20', '...Thank you, White Grandmother.'],
      ['semaun20', '(Awang Semaun looks at the crocodile for a long time. Then he lays his spear down on the planks, and bows his head.)'],
      ['semaun20', 'Forgive me, Grandmother. Kampong Ayer will never raise a spear to you again.']
    ],
    pelitaAlone: '(Where is Pelita? It is not with you...)',
    pelitaHint: 'Pelita is sitting alone at the end of the burnt walkway (west of the pier). Go to it.',
    pelitaSit: [
      ['', 'Pelita is sitting at the very end of the burnt walkway, where the planks were cut, looking down at the black water. It is small and dim.'],
      ['pelita20', '(It does not look up when you sit down beside it. It is shaking.)'],
      ['', '(Pet Pelita, gently.)']
    ],
    pelitaPet: ['(Pelita leans against you, just a little.)', '(Pelita\'s glow flickers, then steadies.)', '(Pelita curls up against your arm and stops shaking.)'],
    pelitaDone: [
      ['nenek20', '(Nenek has been watching from the walkway. She comes and sits on Pelita\'s other side, slowly, because of her knees.)'],
      ['nenek20', 'It is afraid of something, cucu. I have never seen it like this. Stay close to it.'],
      ['', '(Pelita\'s shadow falls long across the burnt planks. Much longer than a shadow should be.)'],
      ['nenek20', 'Now, sleep. The guest house on the hill is waiting. Tomorrow, the whole village wants to say goodbye.']
    ],
    // the send-off
    sendoff: [
      ['', 'In the morning, the whole of Kampong Ayer comes out on the water: boat taxis, the padian women\'s boats piled with kuih, fishermen, children, the brassmiths with their gongs.'],
      ['', 'From the great hall the gulingtangan begins to play, gong after gong, bright as rain.'],
      ['berbai20', 'Seri Putih. You came to us as a stranger. You leave as family.'],
      ['semaun20', 'We will row with you to the mouth of the bay. All of us.'],
      ['anak20', 'Goodbye, White Grandmother! Come back and see us!'],
      ['putih20', '(Seri Putih lifts her great head, and for the first time the whole village hears her voice.) Kampong Ayer. I will remember every one of your lamps.'],
      ['', 'The fleet rows her out to Teluk Barunai, where Juragan Wira\'s jong waits at anchor. There, she settles in the warm shallows.'],
      ['wira20', 'The monsoon wind turns in a day or two. Until then, she rests here, and grows strong. Then: Sabah.'],
      ['nenek20', 'Come, cucu. We will go home and look after the farm until the wind turns. Kancil, you too. Stop eating the jong\'s kuih.'],
      ['', '✦ Kampong Ayer\'s thanks: ' + C.reward + ' kepeng, and Dang Kemala\'s brass bell is yours to keep. ✦'],
      ['', '(Seri Putih is resting in Teluk Barunai. When the wind turns, in a day or two, word will come: then, Sabah.)']
    ],
    waitJong: 'Juragan Wira\'s jong, riding at anchor. "When the monsoon wind turns, we sail for Sabah," Wira says.',
    waitCroc: ['Seri Putih dozes in the warm shallows. Her scales are whiter every day.', 'Seri Putih opens one eye. "Soon, little farmer. Soon the wind will turn."', 'Seri Putih rumbles. Pelita peeks at her from behind your shoulder, then hides again.'],
    kancilFarm: ['Sang Kancil: "I am guarding the cucumbers. From the inside, mostly."', 'Sang Kancil: "Your Nenek gave me a bowl of my own. Nobody has ever given me a bowl."', 'Sang Kancil: "When we go to Sabah I will introduce you to my cousins. They are much less handsome than me."'],
    nenekKA: ['The water people are good people, cucu. Frightened people are not bad people.', 'Look how she sleeps. Like my mother used to, in the afternoons.', 'My knees do not like walkways. My heart does.'],
    kancilKA: ['Kancil: "The padian lady gave me a kuih for being cute. I am VERY cute."', 'Kancil: "I told the children I am the crocodile\'s bodyguard. Please do not correct them."', 'Kancil: "Everything here floats. Even the cats float. Well. They try."'],
    crocKA: ['Seri Putih is asleep in the shade of the houses. Small fish swim around her nose.', 'Seri Putih rumbles softly. The walkway trembles under your feet.', 'Seri Putih opens one golden eye, and closes it again.'],
    lampLook: 'A lamp on a pole, hung by the villagers so Seri Putih can see the walkways at night.'
  };
})(window.LC);
