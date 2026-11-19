/* Little Creature — TESTING build only (dist/LittleCreature_full.html). Everything is unlocked, with its own save
 * (so it never touches your real farm), and a few test keys:
 *   ]  sleep now (next day)      [  skip to the next season      \  skip to the next Pesta (Sabtu)      H  full health and energy
 *   T  replay Si Tanggang's story (switch between "before he meets his mother" and "reunited")
 *   B  replay Badang's story (switch between "skinny, on the night watch" and "the strongest man in the land")
 *   K  Chapter 2: jump to its next step
 *   L  Chapter 3: jump to its next step (finishes Chapter 2 first; parts 1 and 2) */
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
    S.quests.tanggang = 4; S.quests.stoneTold = 1;   // v1.6: Sumpahan Batu and Restu Ibu
    S.quests.badang = 3;                              // v1.7: Badang is already strong (B replays his story)
    S.house = 3; LC.Home.applyStage(3);               // v1.8: Nenek's house fully grown (hire the helpers to test them)
    var inv = ['hoe', 'can', 'joran', 'keris', 'trisula', 'basikal', 'kereta', 'cermin_mata', 'peti_ukir',
      'wau_bulan', 'gasing_uri', 'sikat', 'dedak', 'baja', 'nasi_lemak', 'pulut_mangga', 'jamu_kuat', 'canang', 'bubu'];
    var many = { dedak: 99, baja: 99, nasi_lemak: 99, pulut_mangga: 99, jamu_kuat: 20, canang: 20, bubu: 3 };
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
      case 'KeyH': S.hp = S.maxHp; S.energy = S.maxEnergy; S.water = S.maxWater; this.toast('Full health, energy and water (and abilities ready).', 'ic_hp'); S.restuDay = 0; LC.stoneReadyAt = 0; return;
      case 'KeyT': {
        var re = (S.quests.tanggang || 0) >= 4;
        S.quests.tanggang = re ? 2 : 4; S.escort = null; S.restuDay = 0;
        if (re) delete S.folk.deruma;
        this.toast(re ? 'Tanggang story reset: talk to Si Tanggang in the sunken junk (Kampung Karang) to guide him to his mother.' : 'Si Tanggang and Mak Deruma reunited: Restu Ibu unlocked.', 'ic_restu');
        return;
      }
      case 'KeyK': {   // v1.9: jump to the next step of Chapter 2 (gathers every brother at once)
        var Q = S.quests, st = Q.ch2 || 0;
        if (st === 2) { Q.ch2found = {}; LC.BROTHERS.forEach(function (b) { Q.ch2found[b] = 1; }); }
        if (st === 3) Q.ch2t1 = LC.CH2.trail1.length;
        if (st === 6) { Q.ch2day = S.day - 1; Q.ch2bird = 1; Q.ch2ship = 1; }
        Q.ch2 = Math.min(8, st + 1);
        if (Q.ch2 === 6) Q.ch2day = S.day - 1;
        LC.syncBarunai();
        this.toast('Chapter 2, step ' + Q.ch2 + ': ' + (LC.ch2Goal() || 'complete') + ' (Re-enter Barunai to see it.)', 'ic_glow');
        return;
      }
      case 'KeyL': {   // v2.0: jump to the next step of Chapter 3
        var Q3 = S.quests, s3 = Q3.ch3 || 0;
        if ((Q3.ch2 || 0) < 8) { Q3.ch2 = 8; s3 = -1; }
        if (s3 === 5) Q3.ch3train = 3;
        if (s3 === 7) { Q3.buluMutiara = 1; Q3.asmara = 1; State.recalc(); }
        if (s3 === 9 && !LC.State.count('kulit_ikan')) LC.State.add('kulit_ikan', 1);
        if (s3 === 10) { Q3.jinn = 1; LC.State.remove('kulit_ikan', 1); State.recalc(); }
        if (s3 === 11) { Q3.tourOn = 1; Q3.tour = { 0: 1, 1: 1, 2: 1 }; }
        if (s3 === 12) Q3.lantakaGot = 0;
        Q3.ch3 = Math.min(13, s3 + 1);
        Q3.kaStage = Math.max(Q3.kaStage || 0, Math.min(3, Q3.ch3 - 1));
        LC.syncBarunai();
        this.toast('Chapter 3, step ' + Q3.ch3 + ': ' + (LC.ch3Goal() || 'complete').replace(/^Chapter 3: /, '') + ' (Re-enter Barunai to see it.)', 'ic_glow');
        return;
      }
      case 'KeyB': {   // v1.7: replay Badang's story (skinny, by the forest pool) or make him strong again
        var strong = (S.quests.badang || 0) >= 3;
        S.quests.badang = strong ? 2 : 3; S.buddy = null;
        this.toast(strong ? 'Badang story reset: he is skinny again, keeping watch at the forest pool in Hutan Rimba. Go after 7 PM and grab the hantu! (Re-enter the forest to see it.)' : 'Badang is the strongest man in the land again (Kampung Tepian).', 'ic_badang');
        return;
      }
    }
    return onKey.call(this, ev);
  };
  var create = LC.UIScene.prototype.create;
  LC.UIScene.prototype.create = function () {
    create.apply(this, arguments);
    var self = this;
    this.time.delayedCall(1500, function () { self.toast('TEST BUILD: everything unlocked (separate save). Keys: ] next day, [ next season, \\ next Pesta, H heal, T replay the Tanggang story, B replay the Badang story, K next Chapter 2 step, L next Chapter 3 step.', 'ic_glow'); });
  };
})(window.LC);
