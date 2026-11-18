/* Little Creature — TESTING build only (dist/LittleCreature_full.html). Everything is unlocked, with its own save
 * (so it never touches your real farm), and a few test keys:
 *   ]  sleep now (next day)      [  skip to the next season      \  skip to the next Pesta (Sabtu)      H  full health and energy */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  LC.SAVE_KEY = 'littleCreature.save.full';
  LC.CHEATS = true;
  var State = LC.State;

  function unlock() {
    var S = State.s;
    if (S.flags.cheated || S.guest) return;
    S.flags.cheated = true;
    Object.assign(S.flags, { introDone: true, fedOnce: true, incense: true, tilled: true, planted: true, watered: true, slept: true, harvested: true, cooked: true, metAni: true, guardian: true, keris: true });
    S.kepeng = 99999;
    var g = S.ghost; g.bond = LC.LEVELS[LC.LEVELS.length - 1]; g.level = LC.MAX_LEVEL; g.stage = LC.STAGES.length - 1; g.full = g.joy = g.glow = 100;
    S.pendingLevel = []; S.pendingStage = [];
    LC.SPIRIT_ORDER.forEach(function (sid) { S.spirits[sid] = { friend: true, playDay: 0 }; });
    LC.AREA_ORDER.forEach(function (a) { S.visited[a] = true; });
    ['plotA', 'plotB', 'plotC', 'plotD'].forEach(function (p, i) { S.buildings[p] = { style: ['hut', 'timber', 'brick', 'timber'][i], day: 1, done: true, vid: LC.MOVE_IN[i] }; });
    Object.keys(LC.VILLAGERS).forEach(function (vid) {
      var f = State.folk(vid), gifts = LC.VILLAGERS[vid].gifts || {};
      f.pts = 40; Object.keys(gifts).forEach(function (h) { f.gifts[h] = true; });
    });
    S.quests.bunian = 2; S.wear.glasses = true; S.str = LC.STR_MAX;
    var inv = ['hoe', 'can', 'joran', 'keris', 'trisula', 'basikal', 'kereta', 'cermin_mata', 'peti_ukir',
      'wau_bulan', 'gasing_uri', 'sikat', 'dedak', 'baja', 'nasi_lemak', 'pulut_mangga', 'jamu_kuat', 'canang'];
    var many = { dedak: 99, baja: 99, nasi_lemak: 99, pulut_mangga: 99, jamu_kuat: 20, canang: 20 };
    S.inv = inv.map(function (id) { return { id: id, n: many[id] || 1 }; });
    S.sel = 0;
    if (!S.animals.length) ['ayam', 'ayam', 'serama', 'itik', 'kambing'].forEach(function (k) { var a = State.newAnimal(k); a.love = 20; });
    State.recalc(); S.hp = S.maxHp; S.energy = S.maxEnergy; S.water = S.maxWater;
  }
  var newGame = State.newGame, load = State.load;
  State.newGame = function () { var s = newGame.apply(this, arguments); unlock(); return s; };
  State.load = function () { var ok = load.apply(this, arguments); if (ok) unlock(); return ok; };

  // test keys
  var onKey = LC.UIScene.prototype.onKey;
  LC.UIScene.prototype.onKey = function (ev) {
    var S = this.S, W = this.world, code = ev.code;
    if (this.modal || !W || W.sleeping || W.leaving || S.guest) return onKey.call(this, ev);
    function sleepTo(day) { S.day = day - 1; W.sleep(false); }
    switch (code) {
      case 'BracketRight': sleepTo(S.day + 1); return;
      case 'BracketLeft': { var d = S.day + 1; while (LC.seasonOf(d) === State.season()) d++; this.toast('Skipping to ' + LC.seasonOf(d).name + '...', 'ic_glow'); sleepTo(d); return; }
      case 'Backslash': { var p = S.day + 1; while (p % 7 !== 6) p++; this.toast('Skipping to the next Pesta (Sabtu)...', 'i_wau'); sleepTo(p); return; }
      case 'KeyH': S.hp = S.maxHp; S.energy = S.maxEnergy; S.water = S.maxWater; this.toast('Full health, energy and water.', 'ic_hp'); return;
    }
    return onKey.call(this, ev);
  };
  var create = LC.UIScene.prototype.create;
  LC.UIScene.prototype.create = function () {
    create.apply(this, arguments);
    var self = this;
    this.time.delayedCall(1500, function () { self.toast('TEST BUILD: everything unlocked (separate save). Keys: ] next day, [ next season, \\ next Pesta, H heal.', 'ic_glow'); });
  };
})(window.LC);
