/* Story checkpoints shared by the two standalone developer builds. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var State = LC.State, full = !!LC.CHEATS;
  var slot = LC.SAVE_SLOTS + 1;
  LC.DEVELOPER_HTML = true;
  LC.SAVE_SLOTS = slot;
  if (!full) LC.SAVE_KEY = 'littleCreature.save.developer-web';

  function unlimited(s) {
    Object.defineProperty(s, 'kepeng', { configurable: true, enumerable: false,
      get: function () { return Infinity; }, set: function () {} });
  }
  var newGame = State.newGame, load = State.load, slotInfo = State.slotInfo;
  State.newGame = function () {
    var s = newGame.apply(this, arguments);
    if (!full) unlimited(s);
    return s;
  };
  State.load = function () {
    var ok = load.apply(this, arguments);
    if (ok && (!full || this.s.flags.devCheckpoint)) unlimited(this.s);
    return ok;
  };
  State.slotInfo = function (n) {
    var info = slotInfo.apply(this, arguments);
    if (info && (!full || info.kepeng === undefined)) info.kepeng = '∞';
    return info;
  };
  // Each HTML file is self-contained and runs under its own save namespace.
  LC.Update.check = function (cb) { if (cb) cb(false); };
  LC.UIScene.prototype.updateRow = function () { return null; };

  var chapters = [{ n: 1, name: 'Little Creature', end: 1, steps: ['Help Pelita become a Legend of the Kampung'] }].concat(LC.CHAPTER_LIST);
  var entryHours = { 5: 19.5, 9: 20.5, 11: 20.5, 14: 19 };
  var delays = { 4: 'ch3day', 5: 'ch4day', 6: 'ch5day', 7: 'c7wait', 8: 'c8wait', 9: 'c9wait', 10: 'c10wait', 11: 'c11wait', 15: 'c15wait', 16: 'c16wait', 17: 'c17wait' };
  function grant(map) {
    Object.keys(map).forEach(function (id) {
      if (!LC.ITEMS[id]) throw new Error('Unknown chapter reward ' + id);
      var count = map[id] - State.count(id);
      if (count > 0 && (State.room(id) < count || !State.add(id, count))) throw new Error('The developer bag is full.');
    });
  }
  function visit(s, areas) { areas.forEach(function (area) { s.visited[area] = true; }); }
  function earn(s, amount) { s.kepeng += amount; s.stats.earned += amount; }
  function pelita(s, level) {
    var before = State.level(), g = s.ghost;
    if (before >= level) return;
    g.bond = LC.LEVELS[level - 1];
    g.level = level;
    g.stage = LC.STAGES.reduce(function (stage, info, i) { return g.bond >= info.bond ? i : stage; }, 0);
    State.recalc();
    for (var n = before + 1; n <= level; n++) State.levelGift(n);
  }

  var endings = {
    1: function (s) {
      var q = s.quests;
      Object.assign(s.flags, { introDone: true, fedOnce: true, incense: true, tilled: true, planted: true,
        watered: true, slept: true, harvested: true, cooked: true, metAni: true, keris: true, guardian: true, kidul: true, poseidon: true });
      Object.assign(q, { bunian: 2, tanggang: 4, stoneTold: 1, badang: 3 });
      LC.SPIRIT_ORDER.forEach(function (id) { s.spirits[id] = { friend: true, playDay: 0 }; });
      s.wear.glasses = true;
      s.str = Math.max(s.str, LC.STR_KERIS);
      s.ghost.full = s.ghost.joy = s.ghost.glow = 85;
      pelita(s, LC.LEGEND_LEVEL);
      s.fieldStage = LC.fieldStageFor(State.level());
      grant({ joran: 1, keris: 1, trisula: 1, cermin_mata: 1, basikal: 1, bubu: 2, nasi_lemak: 6 });
      visit(s, ['kampung', 'forest', 'bunian', 'island', 'laut', 'kapal', 'kidul', 'atlantis', 'mountain', 'lombong', 'desert']);
    },
    2: function (s) {
      var brothers = {};
      LC.BROTHERS.forEach(function (id) { brothers[id] = 1; State.addFriendship(id, 4); });
      Object.assign(s.quests, { ch2found: brothers, ch2t1: LC.CH2.trail1.length, ch2t2: LC.CH2.trail2.length,
        ch2bird: 1, ch2ship: 1, ch2day: s.day - 1 });
      grant({ kain_tenun: 2, tembaga: 1, emas: 1 });
      visit(s, ['barunai']); earn(s, 1000);
    },
    3: function (s) {
      Object.assign(s.quests, { kaStage: 3, ch3train: 3, buluMutiara: 1, asmara: 1, tempered: 1, gembor: 1,
        perahu: 1, ch3day: s.day, jinn: 1, tourOn: 1, tour: { 0: 1, 1: 1, 2: 1 }, lantakaGot: 1 });
      grant({ bulu_mutiara: 1, emas: State.count('emas') + 3, kain_tenun: State.count('kain_tenun') + 2, catatan_antonio: 1, lantaka: 1 });
      visit(s, ['teluk', 'kayer']); earn(s, 9500);
    },
    4: function (s) {
      Object.assign(s.quests, { ch4day: s.day, c4pagar: 1, c4meriam: 1, c4allies: 1, c4wave: 5 });
      grant({ keris_majapahit: 1 }); earn(s, 6000);
    },
    5: function (s) {
      Object.assign(s.quests, { ch5day: s.day, c5lamps: 1, c5witch: 1 });
      grant({ pelita_purnama: 1 }); visit(s, ['jawa', 'kelam']); earn(s, LC.C5.reward);
    },
    6: function (s) {
      Object.assign(s.quests, { c6day: s.day, c6bridge: 1, nekLampir: 1, c7wait: s.day });
      State.folk('lampir').pts = Math.max(State.folk('lampir').pts, 40);
      grant({ diari_nenek: 1 }); visit(s, ['ledang']); earn(s, LC.C6.reward1 + LC.C6.reward2);
    },
    7: function (s) {
      Object.assign(s.quests, { c7sat: 1, bualang: 1, pelitaSun: 1, c8wait: s.day });
      pelita(s, LC.MAX_LEVEL); visit(s, ['santubong', 'satang']); earn(s, LC.C7.reward1 + LC.C7.reward2);
    },
    8: function (s) {
      Object.assign(s.quests, { c8floodDay: s.day - LC.C8.floodMax, c8calmN: 1, c8calmK: 1, c8duel: 'done', nagaRide: 1,
        c8sealed: LC.C8.jarSpots.length, c8silt: LC.C8.silt, c9wait: s.day });
      grant({ seruling_naga: 1 }); visit(s, ['gelora']); earn(s, LC.C8.reward1 + LC.C8.reward2 + LC.C8.reward3);
    },
    9: function (s) {
      Object.assign(s.quests, { laguMayang: 1, c10wait: s.day });
      grant({ mutiara: State.count('mutiara') + 3 });
      visit(s, ['kabus', 'bakau', 'guatujuh']); earn(s, LC.C9.reward);
    },
    10: function (s) {
      Object.assign(s.quests, { c10sultan: 1, c10won: 1, c10heard: 1, c11wait: s.day });
      grant({ sumpit: 1, delima: 2 }); visit(s, ['tanjung']); earn(s, LC.C10.reward + LC.C10.onTime);
    },
    11: function (s) {
      Object.assign(s.quests, { c11arrive: 1, c11gong: 1, c11pedoman: 1, c11prov: 1, c11helm: 1, c11leg: 3,
        c11won: 1, c11p2arrive: 1, c11p2leg: 2, c11rope: { 0: 1, 1: 1, 2: 1 }, c11cut: 1, c11signal: 1, c11won2: 1 });
      grant({ pedoman: 1, kalis: 1, mutiara: State.count('mutiara') + 5 }); visit(s, ['sulu', 'bulan', 'sauh11', 'kapal11']);
      earn(s, LC.C11.reward + LC.C11.p2.reward);
    },
    12: function (s) {
      Object.assign(s.quests, { c12Rescued: 7, c12Jack: true, stormVoyage: 0 });
      visit(s, ['stormsea', 'stormdeck']);
    },
    13: function (s) {
      Object.assign(s.quests, { c13Learned: true, c13Lesson: true, c13Reflected: 3, c13Golems: true, c13NekGone: true });
      visit(s, ['mantera', 'manteraVault']);
    },
    14: function (s) {
      s.quests.c14found = { jusoh: true, bahar: true, amin: true };
      grant({ seri_muka: 5 }); visit(s, ['senah']); earn(s, 800);
    },
    15: function (s) {
      s.quests.siBara = 1;
      s.quests.c15calm = {};
      s.quests.c15fuses = {};
      LC.C15.people.forEach(function (person) { s.quests.c15calm[person.id] = true; });
      LC.C15.fuses.forEach(function (_, i) { s.quests.c15fuses[i] = true; });
      grant({ topeng_jerebu: 1 }); earn(s, 1000);
    },
    16: function (s) {
      Object.assign(s.quests, { c16inv: {}, c16help: { amin: true, bara: true }, c16cook: {},
        c16clue: { amin: true, jar: true, bara: true }, c16woke: {}, c16jamu: 0 });
      LC.C16.invites.forEach(function (v) { s.quests.c16inv[v.who] = true; });
      Object.keys(LC.C16.pots).forEach(function (key) { s.quests.c16cook[key] = true; });
      LC.C16.sleepers.forEach(function (v) { s.quests.c16woke[v.who] = true; });
      grant({ senduk_lampir: 1 }); earn(s, 1000);
    }
  };

  function complete(s, chapter) {
    if (chapter.key) s.quests[chapter.key] = chapter.end;
    endings[chapter.n](s);
    State.recalc();
    s.hp = s.maxHp;
    s.energy = s.maxEnergy;
    s.water = s.maxWater;
  }
  function entry(s, n) {
    var areas = { 3: 'barunai', 14: 'kampung' };
    s.area = areas[n] || 'farm';
    s.minutes = (entryHours[n] || 7) * 60 + 5;
    if (delays[n]) s.quests[delays[n]] = s.day - 1;
    return { area: s.area };
  }
  function checkpoint(n) {
    var s = State.newGame(slot);
    s.flags.devCheckpoint = true;
    unlimited(s);
    for (var i = 0; i < n - 1; i++) {
      complete(s, chapters[i]);
      s.day++;
    }
    return s;
  }
  LC.DevStory = { slot: slot, chapters: chapters, checkpoint: checkpoint, entry: entry };
})(window.LC);
