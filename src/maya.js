/* Chapter 19: Harum Sundal Malam (v3.20). An original kampung ghost story built on the Malay folklore of the pontianak
 * (the scent of the sundal malam flower at night, the cry that is loud when she is far and soft when she is near, and
 * the long hair). The owner wrote the outline: a beautiful lady called Maya asks you to find her sisir near the old
 * graveyard; the next night she misses her baby; the kampung is terrorised; the Imam sends you to a rich family's
 * haunted house; you face a pontianak with a jump scare; the rich family turn arrogant; the ghost is Maya; and the real
 * villains are the rich family. Agreed changes: the family is charming at first, the terror is Maya searching (not
 * attacking), Pelita has a part, Khalid is planted early, a clue in the house (Puan Rokiah goes pale at the sisir), and
 * the finale is a choice: Maya wants to take her baby with her, and you have to persuade her to let him grow up.
 * Nothing is taken from the film of a similar name: the cast, places and plot are our own.
 * Kept gentle: Maya's death is told in one line, she never hurts anyone, the family is shamed, not punished.
 * Steps (S.quests.ch19): 0 the scent on the farm (a night after Chapter 18) · 1 meet Maya at the old graveyard ·
 * 2 find her sisir by its scent · 3 the next night, Maya's sorrow · 4 the kampung is afraid (three signs) and the Imam ·
 * 5 help the Hashims (four lamps, the sundal malam at the nursery window, Mak Inah) · 6 the night watch: the pontianak ·
 * 7 the truth, and persuading Maya · 8 done (Hilai Maya on H, 2500 kepeng from Khalid, sundal malam seeds, Mak Kiah). */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var C = LC.C19 = {
    end: 8, night: 19 * 60, watch: 20 * 60,
    ready: function (S) { return !!(S && S.quests && LC.C18 && LC.C18.step(S) >= LC.C18.end); },
    step: function (S) { return (S && S.quests && S.quests.ch19) || 0; },
    // Kampung Tepian: the lane to the graveyard (top right), the big house's gate (top left), the three signs, the Imam
    kuburWay: { x: 42, y: 2 }, besarWay: { x: 10, y: 2 },
    signs: { buaian: { x: 36, y: 13 }, jemuran: { x: 35, y: 21 }, pisang: { x: 42, y: 20 } },
    imam: { x: 5, y: 25 },
    // Tanah Perkuburan Lama
    kubur: { gate: { x: 14, y: 21 }, spawn: { x: 14, y: 19 }, tree: { x: 14, y: 5 }, maya: { x: 17, y: 6 } },
    // where the sisir might be (one is chosen the night you start looking)
    spots: [
      { id: 'kb_nisan3', x: 7, y: 15 }, { id: 'kb_nisan9', x: 21, y: 9 }, { id: 'kb_nisan13', x: 24, y: 17 },
      { id: 'kb_pisang0', x: 4, y: 5 }, { id: 'kb_sundal1', x: 25, y: 5 }, { id: 'kb_nisan6', x: 10, y: 17 }
    ],
    // Rumah Tuan Hashim, and inside it
    besar: { gate: { x: 17, y: 23 }, spawn: { x: 17, y: 21 }, door: { x: 17, y: 11 }, sundal: { x: 22, y: 11 } },
    dalam: { exit: { x: 13, y: 17 }, cradle: { x: 13, y: 4 }, arena: { x0: 3, y0: 3, x1: 24, y1: 8 } },
    lamps: [{ x: 3, y: 10 }, { x: 24, y: 10 }, { x: 3, y: 3 }, { x: 24, y: 3 }],
    // after the chapter: Mak Kiah's stall in Kampung Tepian, and the sundal malam by your spirit house
    kiah: { x: 37, y: 13 }, farmBunga: { x: 11, y: 6 },
    // Hilai Maya (H): the laugh that makes everything around you flee
    hilai: { cd: 25, r: 100, rNight: 150, fear: 3, fearNight: 5, bossFear: 1.2 },
    reward: 2500
  };
  C.isNight = function (S) { return S.minutes >= C.night || S.minutes < 6 * 60; };
  LC.hasHilai = function () { var S = LC.State.s; return !!S && C.step(S) >= C.end; };
  // the pontianak in the nursery: a little above your level, her health counted in your best swings
  C.fight = function (S) {
    var B = LC.BunianTrials, best = B && B.bestWeapon ? B.bestWeapon(S) : null, swing = best ? LC.State.weaponDamage(best) : 2, you = LC.plLevel ? LC.plLevel(S) : 1;
    return { level: you + 3, hp: Math.max(40, Math.round(swing * 16)), dmg: Math.max(4, Math.round((S.maxHp || 60) * 0.07)), lash: Math.max(5, Math.round((S.maxHp || 60) * 0.1)) };
  };

  function st(S) { return C.step(S); }
  function q(S) { return S.quests; }
  function night(S) { return C.isNight(S); }

  // ---------------------------------------------------------------- items, the crop, the enemy
  function addItems(m) { Object.keys(m).forEach(function (id) { var it = m[id]; it.id = id; it.icon = it.icon || 'i_' + id; LC.ITEMS[id] = it; }); }
  addItems({
    sisir_maya: { name: 'Sisir Maya', kind: 'treasure', desc: 'A carved wooden comb with a sundal malam flower on its back, a gift from Khalid to Maya. It still smells faintly sweet at night.' },
    benih_sundal: { name: 'Benih Sundal Malam', kind: 'seed', crop: 'sundal', price: 45, desc: 'Tuberose bulbs from Mak Kiah. 4 days, 2 flowers. The flowers only open at night: harvest them after 7 PM.' },
    bunga_sundal: { name: 'Bunga Sundal Malam', kind: 'offering', glow: 30, joy: 20, bond: 12, sell: 95, desc: 'A stem of tuberose, white and waxy, with the sweetest scent of the night. Pelita loves it more than any other flower.' },
    kuih_kiah: { name: 'Kuih Lompat Tikam', kind: 'dish', price: 40, sell: 55, food: { full: 28, joy: 22 }, desc: 'Mak Kiah\'s kuih: green pandan, red sago and coconut cream in a little banana-leaf boat. Her grandson tries to steal the cream.' }
  });
  LC.FIXED_ITEMS.sisir_maya = 1;
  LC.CROPS.sundal = { name: 'Sundal Malam', days: 4, item: 'bunga_sundal', count: 2 };

  LC.ENEMIES.pontianak19 = { name: 'Pontianak', texture: 'pontianak19', hp: 60, speed: 54, dmg: 6, w: 7, sight: 420, boss: true, floaty: true, drop: [] };
  if (LC.ENEMY_LV) LC.ENEMY_LV.pontianak19 = 40;

  LC.SPEAKERS.maya19 = { name: 'Maya', portrait: 'npc19_maya_0' };
  LC.SPEAKERS.mayasad19 = { name: 'Maya', portrait: 'npc19_maya_sad' };
  LC.SPEAKERS.ponti19 = { name: '???', portrait: 'pontianak19_0' };
  LC.SPEAKERS.hashim19 = { name: 'Tuan Hashim', portrait: 'npc19_hashim_0' };
  LC.SPEAKERS.rokiah19 = { name: 'Puan Rokiah', portrait: 'npc19_rokiah_0' };
  LC.SPEAKERS.inah19 = { name: 'Mak Inah', portrait: 'npc19_inah_0' };
  LC.SPEAKERS.kiah19 = { name: 'Mak Kiah', portrait: 'npc_kiah19_0' };
  LC.SPEAKERS.khalid19 = { name: 'Khalid', portrait: 'npc19_khalid_0' };
  LC.SPEAKERS.pelita19 = { name: 'Pelita', portrait: 'ghost', expr: 'happy' };
  LC.SPEAKERS.imam14 = LC.SPEAKERS.imam14 || { name: 'Tok Imam', portrait: 'npc14_imam_0' };

  // ---------------------------------------------------------------- Mak Kiah, Maya's mother (after the chapter)
  LC.VILLAGERS.kiah19 = {
    name: 'Mak Kiah', role: 'Kuih seller, Maya\'s mother', area: 'kampung', post: C.kiah,
    look: { skin: '#9a6440', shirt: '#7a9a5a', shirt2: '#5a7a3e', bottom: '#6a3a5a', bottom2: '#4e2a42', hair: '#c8c8c8', hat: 'tudung', hatColor: '#e8dcc0' },
    intro: ['You are the one who brought my Maya home. Sit, sit. Have a kuih. Have two.', 'I kept that cradle ready for a year. Everyone said I was a silly old woman. Now look: he fits in it perfectly.'],
    chat: ['He has his mother\'s eyes. And his father\'s appetite.', 'Every night the sundal malam opens, I leave the window open a little. Just in case.', 'Khalid comes every evening to rock him to sleep. He sings badly. The baby does not mind.', 'Pelita came to play today. My grandson laughed so hard he got the hiccups.', 'My Maya always said: a comb is for the hair, and a kind word is for the heart.'],
    tasks: [['padi', 2, 3], ['kelapa', 1, 2], ['pandan', 2, 3]], taskText: 'for her kuih',
    shop: ['kuih_kiah', 'benih_sundal'], buys: { items: ['bunga_sundal', 'kelapa', 'pandan'], mult: 1.3 },
    gifts: { 3: ['benih_sundal', 4], 6: ['kuih_kiah', 4], 10: ['kepeng', 1500] },
    hideIf: function (S) { return st(S) < C.end; }
  };

  // ---------------------------------------------------------------- Kampung Tepian
  function thing(id, type, at, tex, when, extra) { return Object.assign({ id: id, type: type, x: at.x, y: at.y, tex: tex, keep: true, when: when }, extra || {}); }
  var K = LC.AREAS.kampung.objects;
  K.push(thing('k_kubur19', 'maya_way', C.kuburWay, 'pagar_kubur19', function (S) { return C.ready(S) && st(S) >= 1; }, { w: 2, h: 1, to: 'kubur19' }));
  K.push(thing('k_besar19', 'maya_way', C.besarWay, 'pagar19', function (S) { return C.ready(S) && st(S) >= 4; }, { w: 2, h: 1, to: 'besar19' }));
  K.push(thing('k_buaian19', 'maya_sign', C.signs.buaian, 'buaian19_kosong', function (S) { return st(S) === 4; }, { sign: 'buaian' }));
  K.push(thing('k_buaian19b', 'maya_baby', C.signs.buaian, 'buaian19_bayi', function (S) { return st(S) >= C.end; }));
  K.push(thing('k_jemuran19', 'maya_sign', C.signs.jemuran, 'jemuran19', function (S) { return st(S) === 4; }, { w: 3, h: 1, sign: 'jemuran' }));
  K.push(thing('k_pisang19', 'maya_sign', C.signs.pisang, 'pisang19', function (S) { return st(S) === 4; }, { sign: 'pisang' }));
  K.push(thing('k_imam19', 'maya_imam', C.imam, 'npc14_imam_0', function (S) { var s = st(S); return s === 4 || s === 5; }));

  // the farm: after the chapter, a sundal malam blooms beside the spirit house
  LC.OBJECTS.push({ id: 'f_sundal19', type: 'maya_farmbunga', x: C.farmBunga.x, y: C.farmBunga.y, w: 1, h: 1, tex: 'sundal19', keep: true, when: function (S) { return st(S) >= C.end; } });

  // ---------------------------------------------------------------- the places
  function grid(w, h, tile) { return Array.from({ length: h }, function () { return new Array(w).fill(tile); }); }
  function fill(g, x0, y0, x1, y1, tile) { for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) g[y][x] = tile; }
  function nightClock(area, from) {   // the clock stands still here at night, so a scene is never cut short by midnight
    Object.defineProperty(area, 'frozenClock', { configurable: true, get: function () { var S = LC.State.s; return !!(S && (S.minutes >= from)); } });
    return area;
  }

  // Tanah Perkuburan Lama: the old graveyard behind Kampung Tepian
  var KUB = [
    { id: 'kb_back', type: 'maya_back', x: C.kubur.gate.x, y: C.kubur.gate.y, w: 2, h: 1, tex: 'pagar_kubur19', keep: true, to: 'kampung', at: { x: C.kuburWay.x, y: C.kuburWay.y + 2 } },
    { id: 'kb_kemboja', type: 'maya_tree', x: C.kubur.tree.x, y: C.kubur.tree.y, w: 2, h: 1, tex: 'kemboja19', keep: true, light: 0xf4ecff },
    { id: 'kb_maya', type: 'maya_lady', x: C.kubur.maya.x, y: C.kubur.maya.y, tex: 'npc19_maya_0', keep: true, when: function (S) { var s = st(S); return night(S) && s >= 1 && s <= 3 && !(s === 3 && S.day <= (q(S).c19day || 0)); } },
    { id: 'kb_wakaf', type: 'bldg', x: 3, y: 19, w: 3, h: 1, tex: 'wakaf', keep: true, text: 'A little wakaf where mourners rest. Someone has left a jug of water and a folded mat.' }
  ];
  var GRAVES = [[5, 9], [7, 9], [9, 9], [5, 11], [7, 11], [9, 11], [5, 15], [7, 15], [10, 15], [5, 17], [10, 17], [19, 9], [21, 9], [23, 9], [25, 9], [19, 11], [22, 11], [25, 11], [19, 15], [22, 15], [25, 15], [19, 17], [24, 17]];
  var EPI = ['A worn batu nisan, its carving softened by a hundred monsoons.', 'An old grave, kept neat. Someone still sweeps here.', 'A batu nisan with a little jar of water beside it.', 'Two stones, head and foot, under a scatter of kemboja petals.'];
  GRAVES.forEach(function (g, i) { KUB.push({ id: 'kb_nisan' + i, type: 'maya_grave', x: g[0], y: g[1], tex: i % 3 ? 'nisan19' : 'nisan19b', keep: true, text: EPI[i % EPI.length] }); });
  [[4, 5], [26, 13], [3, 13], [26, 19]].forEach(function (b, i) { KUB.push({ id: 'kb_pisang' + i, type: 'maya_grave', x: b[0], y: b[1], tex: 'banana', keep: true, text: 'Banana trees grow thick at the edge of the graveyard. Old folk say not to sit under them at night.' }); });
  [[11, 4], [25, 5], [3, 8], [12, 19], [17, 16]].forEach(function (b, i) { KUB.push({ id: 'kb_sundal' + i, type: 'maya_grave', x: b[0], y: b[1], tex: 'sundal19', keep: true, light: 0xf8f4ff, text: 'A sundal malam bush, its white flowers half open. The scent is so sweet it is almost heavy.' }); });
  LC.AREAS.kubur19 = nightClock({
    name: 'Tanah Perkuburan Lama', sub: 'the old graveyard behind Kampung Tepian', lvl: 2, home: { x: 14.5, y: 19 }, pond: 'river', amb: 'forest', dim: 0.1,
    decor: { n: 22, types: ['lalang', 'fern', 'lalang', 'rock', 'fern'], on: '.' },
    clear: [{ x: 14, y: 6, r: 2 }, { x: 15, y: 18, r: 2 }],
    build: function () {
      var g = grid(30, 24, 'J');
      fill(g, 2, 2, 27, 21, '.');
      fill(g, 14, 7, 15, 21, 'p');   // the path up to the kemboja tree
      fill(g, 4, 13, 26, 13, 'p');   // and across, between the rows of graves
      fill(g, 12, 7, 17, 7, 'p');
      return g;
    },
    objects: KUB, exits: [], ride: {}
  }, C.night);

  // Rumah Tuan Hashim: the big house on the hill
  var BES = [
    { id: 'b_back', type: 'maya_back', x: C.besar.gate.x, y: C.besar.gate.y, w: 2, h: 1, tex: 'pagar19', keep: true, to: 'kampung', at: { x: C.besarWay.x, y: C.besarWay.y + 2 } },
    { id: 'b_rumah19', type: 'maya_house', x: 12, y: 7, w: 12, h: 4, tex: 'rumah19', keep: true, light: 0xffd890 },
    { id: 'b_pintu19', type: 'maya_door', x: C.besar.door.x, y: C.besar.door.y, w: 2, h: 1, tex: 'tangga19', keep: true },
    { id: 'b_sundal19', type: 'maya_bush', x: C.besar.sundal.x, y: C.besar.sundal.y, tex: 'sundal19', keep: true, light: 0xf8f4ff, when: function (S) { return !q(S).c19bunga; } },
    { id: 'b_tunggul19', type: 'bldg', x: C.besar.sundal.x, y: C.besar.sundal.y, tex: 'tunggul19', keep: true, when: function (S) { return !!q(S).c19bunga; }, text: 'Where the sundal malam grew under the nursery window. Already, a new green shoot is pushing up.' },
    { id: 'b_dapur19', type: 'bldg', x: 5, y: 8, w: 2, h: 2, tex: 'senah_dapur', keep: true, light: 0xff9a50, text: 'The big house\'s outdoor kitchen. Everything shines: the pots, the spoons, even the firewood is stacked by size.' },
    { id: 'b_kolam19', type: 'bldg', x: 26, y: 15, w: 3, h: 2, tex: 'kolam19', keep: true, text: 'An ornamental pond with golden carp. The carp look richer than you.' },
    { id: 'b_hashim19', type: 'maya_folk', who: 'hashim', x: 15, y: 13, tex: 'npc19_hashim_0', keep: true, when: function (S) { var s = st(S); return s >= 5 && s !== 7; } },
    { id: 'b_rokiah19', type: 'maya_folk', who: 'rokiah', x: 20, y: 13, tex: 'npc19_rokiah_0', keep: true, when: function (S) { var s = st(S); return s >= 5 && s !== 7; } },
    { id: 'b_inah19', type: 'maya_folk', who: 'inah', x: 8, y: 10, tex: 'npc19_inah_0', keep: true, when: function (S) { return st(S) >= 4; } }
  ];
  [[3, 4], [31, 4], [3, 20], [31, 20], [9, 16], [25, 20]].forEach(function (t, i) { BES.push({ id: 'b_pokok' + i, type: 'bldg', x: t[0], y: t[1], tex: i % 2 ? 'palm' : 'jtree', keep: true, text: i % 2 ? 'A tall coconut palm, trimmed so not one frond is out of place.' : 'A shady old tree. A swing hangs from it, never used.' }); });
  LC.AREAS.besar19 = {
    name: 'Rumah Tuan Hashim', sub: 'the big house on the hill', lvl: 2, home: { x: 17.5, y: 21 }, pond: 'river', amb: 'river',
    decor: { n: 26, types: ['hibiscus', 'bougainvillea', 'bush', 'hibiscus', 'lalang'], on: '.' },
    clear: [{ x: 17, y: 16, r: 3 }, { x: 22, y: 12, r: 1 }],
    build: function () {
      var g = grid(36, 26, 'J');
      fill(g, 2, 2, 33, 23, '.');
      fill(g, 17, 12, 18, 23, 'k');   // the stone path up to the steps
      fill(g, 12, 11, 23, 12, 'k');   // the front terrace
      fill(g, 7, 10, 16, 11, 'p');    // round to the kitchen
      return g;
    },
    objects: BES, exits: [], ride: {}
  };

  // inside the big house: the hall (south) and the nursery (north)
  var DAL = [
    { id: 'd_out19', type: 'maya_back', x: C.dalam.exit.x, y: C.dalam.exit.y, w: 2, h: 1, tex: 'tikar19', keep: true, to: 'besar19', at: { x: C.besar.door.x, y: C.besar.door.y + 1 } },
    { id: 'd_buaian19', type: 'maya_cradle', x: C.dalam.cradle.x, y: C.dalam.cradle.y, w: 2, h: 1, tex: 'buaian19_bayi', keep: true },
    { id: 'd_tingkap19', type: 'maya_window', x: 20, y: 1, w: 2, h: 1, tex: 'tingkap19', keep: true },
    { id: 'd_potret19', type: 'maya_portrait', x: 7, y: 10, w: 2, h: 1, tex: 'potret19', keep: true },
    { id: 'd_meja19', type: 'maya_letters', x: 19, y: 13, w: 2, h: 1, tex: 'meja19', keep: true },
    { id: 'd_almari19', type: 'bldg', x: 4, y: 14, w: 2, h: 1, tex: 'almari19', keep: true, text: 'A tall teak cabinet full of porcelain. Every plate faces the same way.' },
    { id: 'd_kerusi19', type: 'bldg', x: 11, y: 13, w: 3, h: 1, tex: 'kerusi19', keep: true, text: 'A carved settee with velvet cushions. Nobody looks as if they have ever sat on it.' },
    { id: 'd_mainan19', type: 'bldg', x: 7, y: 5, tex: 'mainan19', keep: true, text: 'A wooden rattle and a little cloth tiger. Brand new, never played with.' }
  ];
  C.lamps.forEach(function (l, i) { DAL.push({ id: 'd_lampu19_' + i, type: 'maya_lamp', idx: i, x: l.x, y: l.y, tex: 'lampu19_off', keep: true }); });
  LC.AREAS.dalam19 = nightClock({
    name: 'Rumah Tuan Hashim', sub: 'inside the big house', lvl: 2, home: { x: 13.5, y: 16 }, pond: 'river', amb: 'cave', dim: 0.32,
    decor: { n: 0, types: [], on: 'W' },
    build: function () {
      var g = grid(28, 20, 'H');
      fill(g, 2, 2, 25, 17, 'W');
      fill(g, 2, 9, 25, 9, 'H');      // the wall between the nursery and the hall...
      fill(g, 13, 9, 14, 9, 'W');     // ...and its doorway
      return g;
    },
    objects: DAL, exits: [], ride: {}
  }, C.watch);

  // ---------------------------------------------------------------- the sounds of the night
  var sfx = LC.Audio.sfx;
  LC.Audio.sfx = function (name) {
    var A = LC.Audio;
    if (['tangis19', 'tangisjauh19', 'hilai19', 'jerit19', 'desir19'].indexOf(name) < 0) return sfx.apply(this, arguments);
    if (!A.ctx || A.ctx.state !== 'running' || !A.vol || !A.vol.sfx) return;
    var t = A.ctx.currentTime + 0.01, i;
    if (name === 'tangis19' || name === 'tangisjauh19') {   // a baby's cry: "uwaa... uwaa", loud when she is far, soft when near
      var v = name === 'tangis19' ? 0.05 : 0.13;
      for (i = 0; i < 3; i++) {
        A.tone(t + i * 0.62, 'triangle', 520, 760, 0.18, v);
        A.tone(t + i * 0.62 + 0.18, 'triangle', 760, 430, 0.34, v);
        A.tone(t + i * 0.62, 'sine', 1040, 1300, 0.45, v * 0.35);
      }
    } else if (name === 'hilai19') {   // the pontianak's laugh: hi-hi-hi-hiiii, high and trailing away
      for (i = 0; i < 7; i++) {
        A.tone(t + i * 0.13, 'triangle', 1200 + i * 40, 1050 + i * 30, 0.1, 0.09);
        A.tone(t + i * 0.13, 'sine', 2400 + i * 60, 2100, 0.08, 0.03);
      }
      A.tone(t + 0.95, 'triangle', 1500, 700, 0.9, 0.08);
      A.noise(t + 0.95, 0.8, 0.03, 'bandpass', 3000, 1200);
    } else if (name === 'jerit19') {   // the scream
      A.tone(t, 'sawtooth', 600, 1500, 0.6, 0.1); A.tone(t + 0.03, 'sawtooth', 640, 1450, 0.55, 0.07);
      A.noise(t, 0.6, 0.12, 'bandpass', 2400, 3600); A.tone(t, 'sine', 90, 50, 0.5, 0.2);
    } else {   // a breath of wind through hair and leaves
      A.noise(t, 1.1, 0.06, 'bandpass', 700, 1400); A.tone(t, 'sine', 220, 180, 1, 0.02);
    }
  };

  // ---------------------------------------------------------------- what they say
  LC.MAYA_TEXT = {
    hook: [
      ['', 'The night air on the farm turns heavy and sweet. It smells of sundal malam, but no sundal malam grows here.'],
      ['pelita19', '(Pelita lifts its nose and sniffs, curious rather than afraid. Then it floats a little way east, towards Kampung Tepian, and looks back at you.)'],
      ['', 'The scent drifts from the old graveyard behind the kampung (a lane at the top right of Kampung Tepian, past the shrine).']
    ],
    hookToast: 'A sweet scent of sundal malam drifts from the old graveyard behind Kampung Tepian (top right, past the shrine).',
    dayGrave: 'The graveyard is quiet in daylight: kemboja petals, old stones, a sleepy lizard. The scent only comes at night (after 7 PM).',
    meet: [
      ['', 'Under the great kemboja tree, a young woman in a white baju kurung is searching the grass on her knees. Her long black hair almost touches the ground.'],
      ['maya19', 'Oh! You frightened me. I did not hear you come.'],
      ['maya19', 'My name is Maya. I have lost my sisir somewhere here. A carved comb, with a flower on the back. Someone very dear gave it to me.'],
      ['pelita19', '(Pelita floats right up to her and glows softly. It does not seem afraid of her at all.)'],
      ['maya19', 'Your little light likes me. How strange. Most things run away.'],
      ['maya19', 'Will you help me find it? Follow the scent. Where it is strongest, that is where my comb will be.'],
      ['', 'Find Maya\'s sisir. The scent meter at the top of the screen shows how close you are: the stronger the scent, the closer. Press USE by a grave, a bush or a tree to search there.']
    ],
    wrongSpot: ['Only kemboja petals, damp with dew.', 'An old snail shell. Not a comb.', 'Roots and soft earth. The scent is not strongest here.', 'Nothing but a beetle, who looks offended.'],
    found: [
      ['', 'In the grass, half buried in fallen petals: a carved wooden comb with a sundal malam flower on its back.'],
      ['maya19', 'You found it! Oh, thank you. I thought I had lost him forever.'],
      ['', 'She runs the comb slowly through her long hair, once, twice, and closes her eyes.'],
      ['maya19', 'Will you keep it for me a little while? If you ever see me... lost, show it to me. It will remind me who I am.'],
      ['maya19', 'Go home now. It is late, and the night here is not kind to the living.'],
      ['', 'When you look up, she is gone. Only the scent remains, and the sisir in your hand. (Sisir Maya added to your bag.)']
    ],
    mayaLater: [['maya19', 'Keep my sisir safe. And go home before it is too late.']],
    sorrowWait: [['', 'The kemboja tree stands alone tonight. Maybe she will be here tomorrow night.']],
    sorrow: [
      ['', 'Maya is sitting under the kemboja tree tonight. She is crying, very softly.'],
      ['mayasad19', 'I have a baby boy. He lives in a big house now. They will not let me hold him.'],
      ['mayasad19', 'Every night I hear him crying, and I cannot go to him. Every night I go looking, house after house, window after window...'],
      ['pelita19', '(Pelita floats close and settles on her shoulder, glowing a gentle gold.)'],
      ['mayasad19', 'If you hear crying in the night, remember this: when the cry is loud, I am far away. When it is soft... I am near.'],
      ['', 'A gust of wind sends kemboja petals spinning. When they settle, Maya is gone.'],
      ['', 'Somewhere in Kampung Tepian, a door slams. Someone screams. Go and see what is happening in the kampung.']
    ],
    sorrowAfter: [['', 'The kemboja tree is quiet. A few fresh petals lie where Maya sat.']],
    // the kampung is afraid
    terrorDay: 'In daylight the kampung pretends nothing happened, but every door has garlic and a pair of scissors over it. The strange things happen at night (after 7 PM).',
    signs: {
      buaian: [['', 'An empty baby cradle hangs under a house, rocking all by itself. Back and forth. Back and forth. There is no wind.'],
        ['', 'Wet footprints lead from the cradle to the window, and back again. Small, bare footprints. They stop as if whoever made them simply... rose into the air.'],
        ['pelita19', '(Pelita circles the cradle sadly. Whoever came here was looking for a baby.)']],
      jemuran: [['', 'Someone\'s washing has been pulled off the line and laid out neatly on the grass: every baby\'s sarong in the kampung, folded, as if someone was counting them.'],
        ['pelita19', '(Pelita sniffs a little sarong. The sweet scent of sundal malam clings to it.)']],
      pisang: [['', 'The banana trees shake and rustle, though the air is perfectly still. A long strand of black hair is caught on a leaf.'],
        ['', 'A high, thin laugh floats down from the dark, then turns into something like a sob.']]
    },
    signAfter: 'Tok Imam is waiting by the masjid.',
    cryFar: '(a baby\'s cry, loud and far away)',
    crySoft: '(a baby\'s cry, very soft... and very near)',
    imamWait: [['imam14', 'Something walks our kampung at night. Before we judge it, look at what it leaves behind. (Signs found: {n} / 3.)']],
    imam: [
      ['imam14', 'You have seen the signs. The cradle, the little sarongs, the banana trees.'],
      ['imam14', 'Half the kampung wants a bomoh with iron nails. I do not believe this spirit is evil. I believe it is searching for something, and suffering.'],
      ['imam14', 'And there is one house it returns to every night: the big house on the hill. Tuan Hashim\'s. Their grandson screams until dawn, and the family will not leave their rooms.'],
      ['imam14', 'They have sent every bomoh away. But they will not turn away a guest with a light like Pelita\'s. Will you go to them?'],
      ['', 'The gate to Tuan Hashim\'s house is at the top left of Kampung Tepian, near Tok Penghulu\'s house.']
    ],
    imamLater: [['imam14', 'Go gently. Whatever is in that house, it was someone once.']],
    // the big house
    welcome: [
      ['hashim19', 'A guest! Welcome, welcome to our humble home. Well. Not so humble. I am Hashim. This is my wife.'],
      ['rokiah19', 'You must be the farmer with the little spirit. The Imam sent word. Come, sit, have some kuih. You look thin.'],
      ['hashim19', 'Our grandson has not slept a whole night for a month. Something comes to the nursery window. We are good people. We pay our zakat. We built the kampung its new jetty. Why us?'],
      ['', 'Puan Rokiah\'s eyes fall on the carved comb at your belt. For a moment her face goes as white as rice flour.'],
      ['rokiah19', 'What a... pretty comb. Where did you find it? ...No, never mind. More kuih?'],
      ['hashim19', 'Help us, and you will be well paid. Here: 300 kepeng, for your trouble. There will be more.'],
      ['', 'Help the Hashims: relight the four lamps that keep going out inside, cut the sundal malam that blooms under the nursery window, and ask Mak Inah, the old servant, what she has seen.']
    ],
    folk: {
      hashim: ['The lamps go out every night by themselves. Light them, would you? The servants are too frightened.', 'Our son Khalid is overseas, trading. Good business. A man must make his name.', 'Done? Splendid! Tonight, then: watch the nursery. After 8 PM.'],
      rokiah: ['That flower under the nursery window. Nobody planted it, and every morning it is bigger. Cut it down. Please.', 'Our grandson\'s mother? She... passed away. It was very sad. We do not talk about it.', 'Tonight. The nursery. You will be paid, I promise you.'],
      inah: ['Mak Inah does not look up from her sweeping.', 'Mak Inah\'s broom stops. Then it starts again, faster.', 'Mak Inah stares at the sisir in your hand, and her eyes fill with tears.']
    },
    inah: [
      ['inah19', 'Seen? I have seen nothing. I sweep, I cook, I keep my eyes on the floor. That is what servants are for.'],
      ['', 'She glances at the sisir at your belt, and her broom stops.'],
      ['inah19', 'That comb... Where did you... No. No, I cannot. Not here. Not where they can hear.'],
      ['inah19', 'Watch the nursery tonight. Whatever comes... do not hurt her. Please.'],
      ['', '(Mak Inah said "her".)']
    ],
    inahLater: [['inah19', 'Do not hurt her. Please.']],
    bushCut: [
      ['', 'You cut the sundal malam under the nursery window. The white flowers fall, and the sweet scent rises all at once, so strong it makes your eyes water.'],
      ['pelita19', '(Pelita gathers one fallen flower and holds it carefully, as if it were precious.)']
    ],
    bushLater: 'The cut sundal malam is already putting up a new shoot. Some things will not be stopped.',
    houseText: 'Tuan Hashim\'s house: two storeys of polished chengal wood, carved eaves, glass windows. The nursery window on the right is the only one with its curtains shut.',
    doorLocked: 'The front door is shut. Talk to Tuan Hashim first.',
    lampLit: 'The lamp flares to life.',
    lampsAll: 'All four lamps are lit.',
    lampOn: 'A brass lamp, burning steadily.',
    portrait: [['', 'A family portrait: Tuan Hashim, Puan Rokiah, a young man with kind eyes (Khalid), and beside him a young woman with long black hair... whose face has been scratched out.'],
      ['', 'Only her hand is left. It holds a carved comb, with a flower on the back.']],
    letters: [['', 'A bundle of letters on the desk, all from Khalid, from ports far away. The newest is on top:'],
      ['khalid19', '"Mother, Father. Why does Maya not answer my letters? You promised you would look after her. I am coming home on the next ship."'],
      ['', 'The letter has not been opened. Neither have the five before it.']],
    window: 'The nursery window. Its curtain is drawn, but the scent of sundal malam seeps through anyway.',
    windowCut: 'The nursery window. Even with the flower cut down, the scent seeps through.',
    cradleDay: [['', 'A baby boy sleeps in a carved cradle, his fists curled up by his ears. He has a tiny frown, as if he is waiting for someone.'],
      ['pelita19', '(Pelita hovers over the cradle and makes the softest glow it can. The baby\'s frown smooths away.)']],
    ready: [['hashim19', 'Everything is done? Splendid! Then tonight, guard the nursery. Come back after 8 PM. We will be... in our room. Locked in. For safety.']],
    waitNight: 'The nursery is peaceful in the daytime. Come back after 8 PM to keep watch.',
    // the night watch
    watch: 'The house is silent. The lamps are burning low. Keep watch by the cradle in the nursery.',
    lampsOut: 'WHOOSH! Every lamp in the house goes out at once.',
    scareGentle: [['', 'Slowly, out of the dark beside the cradle, a pale shape rises. Long, long black hair. A white dress. Eyes like two red embers.']],
    scare: [['ponti19', 'HIHIHIHIHIHIIIIIIIII!'], ['', 'The pontianak! She will not let you near the cradle!']],
    fightToast: 'Hold a weapon and press USE to swing. Watch her hair: step aside when the red line shows!',
    cornered: 'She sinks to the floor, shaking. Hold up the sisir (press USE beside her).',
    faint: 'Mak Inah drags you out of the nursery. "Rest, then try again. She is waiting."',
    hold: [
      ['', 'You hold up the carved comb, the sisir she asked you to keep.'],
      ['', 'The pontianak stops. Her terrible face trembles. The scream breaks... into crying.'],
      ['pelita19', '(Pelita floats between you, glowing as softly as it can. It does not attack her. It never wanted to.)']
    ],
    // the truth
    arrive: [
      ['hashim19', 'Is it over? Why is IT still here?! Finish it! I am paying you!'],
      ['rokiah19', 'Disgusting creature! Get away from my grandson! Get OUT of my house!'],
      ['hashim19', 'Do you know who I am? I built this kampung\'s jetty! I could buy this whole graveyard! Kill it, or you will not see one more kepeng!']
    ],
    reveal: [
      ['', 'The pontianak lifts her head. Her hair falls back from her face, and the red fades from her eyes. It is Maya.'],
      ['maya19', '(She takes the sisir from you, gently, and runs it through her hair.) That is my son. You took him from me.'],
      ['rokiah19', 'You... You are dead! We buried you!'],
      ['hashim19', 'Lies! This is a demon\'s trick!']
    ],
    confess: [
      ['inah19', 'No more lies, Tuan. No more.'],
      ['', 'Mak Inah falls to her knees in the doorway, still holding her broom.'],
      ['inah19', 'Maya was a maid in this house, like me. Khalid loved her. He gave her that comb. He promised to marry her.'],
      ['inah19', 'Tuan and Puan said a maid was not good enough. They sent Khalid overseas. And when they learned Maya was carrying his child... they put her out of the house. On a night of storm.'],
      ['inah19', 'She walked to the kemboja tree at the graveyard. The baby was born there. She did not live to see the morning.'],
      ['inah19', 'Puan sent me to bring the baby home. Their only grandson. And they told the kampung Maya had run off with a stranger. I said nothing. For a whole year, I said nothing.'],
      ['', 'Outside, lanterns: Tok Imam and half the kampung have followed the screaming up the hill. They heard every word.'],
      ['imam14', 'So the monster that frightened our children was made in this house.'],
      ['rokiah19', '(Puan Rokiah has nothing to say. For once, neither does Tuan Hashim.)']
    ],
    grief: [
      ['', 'Maya goes to the cradle. She lifts her son for the first time. He stops crying at once.'],
      ['maya19', 'He knows me.'],
      ['', 'Then her hair begins to rise again, slowly, like smoke. The room grows cold.'],
      ['maya19', 'I will take him with me. Where I am going, no one will ever shut a door on us again.'],
      ['pelita19', '(Pelita trembles. If she takes him into the spirit world, he will never grow up.)'],
      ['', 'You have to persuade her to let him live.']
    ],
    // three questions; the right answer sits in a different place each time (never last, so Escape is never the answer)
    rounds: [
      { say: 'He is mine. He belongs with his mother. I will take him with me.', pos: 1,
        right: 'He could never grow up',
        wrong: [['Then take him', 'Pelita darts between Maya and the door, shaking its whole body. That is not the answer.'],
          ['Raise your weapon', 'Maya\'s hair whips up like a storm. Fighting will not end this. Not this time.']],
        after: '"Where you are going, he cannot grow up. He will never run, or climb a tree, or learn to say your name." Maya looks down at his tiny hands. "...Grow up?"' },
      { say: 'Who will love him here? Them?', pos: 0,
        right: 'Your mother, Mak Kiah',
        wrong: [['Tuan Hashim will', 'Tuan Hashim takes a step back. Maya\'s eyes flash red. That is not the answer.'],
          ['I will raise him', '"You? You already have a spirit to feed and a farm to tend." She almost smiles. Almost. Think again.']],
        after: '"Your mother, Mak Kiah. She kept a cradle ready under her house all year. It rocked every night, waiting." Maya\'s lip trembles. "Mak... that cradle in the kampung was hers?"' },
      { say: 'He will not even remember my face.', pos: 1,
        right: 'Hold up the sisir',
        wrong: [['Better he forgets', 'Pelita droops, and the room grows colder. No. Never that.'],
          ['Faces fade anyway', 'Maya clutches the baby closer. "It matters to me." Think again.']],
        after: '"He will have this. And every night the sundal malam blooms, he will know you are near." Maya takes the comb, and for the first time she smiles. Her hair settles softly around her shoulders.' }
    ],
    finale: [
      ['', 'Dawn comes up over the hill. Maya rocks her son in the window, singing a lullaby too quiet to hear.'],
      ['maya19', 'Mak will raise you. And your father is coming home on the next ship. Be good, my little one. Be kind. Not like this house.'],
      ['', 'She lays him in the cradle and kisses his forehead. Then she turns to you.'],
      ['maya19', 'You found my comb, and you found my son, and you found me. Keep my sisir. It has nothing left to remind me of.'],
      ['maya19', 'And when you hear something laughing in the night, do not be afraid. It might only be me.'],
      ['', 'Maya fades into the morning light, and the room fills with the scent of sundal malam. Then it is gone. Just a room, and a sleeping baby, and the sunrise.'],
      ['', 'Three days later, Khalid\'s ship comes in. He takes his son to Mak Kiah\'s house, and he does not go back up the hill.'],
      ['khalid19', 'I was not there when she needed me. I will be there for him, every day. And for the one who brought her peace: take this. It is not enough. Nothing would be.'],
      ['', 'The Hashims lose their good name in the kampung. Nobody shouts at them. Nobody needs to. People simply stop coming to the big house on the hill.'],
      ['', '✦ You learned Hilai Maya! Press H (or tap the white flower beside your hotbar): Maya\'s laugh echoes around you and everything nearby flees in fear. Stronger at night. ✦'],
      ['', '✦ Chapter 19 complete! Khalid\'s thanks: ' + C.reward + ' kepeng. Maya\'s sisir is yours to keep, with 5 Benih Sundal Malam. Mak Kiah now sells kuih and sundal malam bulbs in Kampung Tepian. ✦'],
      ['', 'That night, a sundal malam blooms beside your spirit house. Pelita sleeps beside it.']
    ],
    // after the chapter
    farmBunga: 'The sundal malam beside the spirit house. At night its scent drifts over the whole farm, and Pelita sleeps curled up beside it.',
    farmPick: 'You pick one stem of sundal malam. Another will open tomorrow night.',
    farmDay: 'The sundal malam\'s buds are shut tight in the daylight. They open after 7 PM.',
    baby: ['The baby grabs Pelita\'s glow with both hands and laughs and laughs.', 'The baby is asleep, one fist wrapped around a sundal malam petal.', 'Pelita plays peekaboo. The baby shrieks with delight.'],
    babyDone: 'The baby is asleep. Pelita settles on the cradle\'s edge to keep watch.',
    afterKubur: 'The kemboja tree blooms white. Under it, someone has planted a little sundal malam. It is always in flower at night.',
    afterBesar: {
      hashim: 'Tuan Hashim sits on his steps and stares at his empty garden. He does not offer you kuih now.',
      rokiah: 'Puan Rokiah turns away. Then, very quietly: "Tell Mak Kiah... tell her I am sorry." She does not wait for an answer.',
      inah: 'Mak Inah has packed her bag. "Mak Kiah asked me to help her with the kuih. And with the little one. I think I would like that."'
    },
    cradleAfter: 'The nursery is empty now. The cradle has gone to Mak Kiah\'s house, where it belongs.',
    // Hilai Maya
    hilaiCall: 'Hihihihiii...!',
    hilaiFlee: 'Flees!',
    hilaiNone: 'Your laugh echoes into the night. Somewhere, a dog howls back.',
    hilaiRest: 'Maya\'s laugh is resting... ({s}s)'
  };
})(window.LC);
