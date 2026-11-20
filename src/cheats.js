/* Little Creature — TESTING build only (dist/LittleCreature_full.html). Everything is unlocked, with its own save
 * (so it never touches your real farm), and a few test keys:
 *   ]  sleep now (next day)      [  skip to the next season      \  skip to the next Pesta (Sabtu)      H  full health and energy
 *   T  replay Si Tanggang's story (switch between "before he meets his mother" and "reunited")
 *   -  replay Badang's story (switch between "skinny, on the night watch" and "the strongest man in the land"; B was this key until v2.5)
 *   K  Chapter 2: jump to its next step
 *   L  Chapter 3: jump to its next step (finishes Chapter 2 first; parts 1 and 2)
 *   O  Chapter 4: jump to its next step or wave (finishes Chapters 2 and 3 first)
 *   P  Chapter 5: jump to its next step (finishes Chapters 2, 3 and 4 first)
 *   Y  Chapter 6: jump to its next step (finishes Chapters 2 to 5 first)
 *   Z  Nek Lampir the helper: switch between "unlocked (press C)" and "10 hearts, ready to make peace with Nenek" (finishes Chapter 6 first)
 *   0  Chapter 7: jump to its next step (finishes Chapters 2 to 6 first); at the end, Sang Bualang (B) and Angin Bualang (U)
 *   =  Chapter 8: jump to its next step (finishes Chapters 2 to 7 first); at the end, riding Naga Kecil (the Seruling Naga) */
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
      case 'KeyH': S.hp = S.maxHp; S.energy = S.maxEnergy; S.water = S.maxWater; this.toast('Full health, energy and water (and abilities ready).', 'ic_hp'); S.restuDay = 0; LC.stoneReadyAt = 0; LC.nekCallAt = LC.nekCircleAt = LC.nekRescueAt = LC.nekTpAt = 0; LC.bualangRestAt = LC.bualangDueAt = LC.anginAt = 0; return;
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
      case 'KeyO': {   // v2.2: jump to the next step (or wave) of Chapter 4
        var Q4 = S.quests, s4 = Q4.ch4 || 0, w4 = Q4.c4wave || 0;
        if ((Q4.ch3 || 0) < 13) { Q4.ch2 = 8; Q4.ch3 = 13; Q4.kaStage = 3; Q4.asmara = 1; Q4.jinn = 1; Q4.ch3day = S.day - 1; State.recalc(); Q4.ch4 = 1; }
        else if (s4 < 2) Q4.ch4 = s4 + 1;
        else if (s4 === 2) { Q4.c4pagar = Q4.c4meriam = Q4.c4allies = 1; Q4.ch4 = 3; Q4.c4wave = 0; }
        else if (s4 === 3 && w4 < 4) { Q4.c4wave = w4 + 1; if (Q4.c4wave >= 3) Q4.c4fires = { 0: 1, 1: 1, 2: 1, 3: 1, 4: 1 }; }
        else if (s4 === 3) { Q4.ch4 = 4; Q4.c4wave = 5; if (!LC.State.count('keris_majapahit')) LC.State.add('keris_majapahit', 1); }
        this.toast('Chapter 4, step ' + Q4.ch4 + (Q4.ch4 === 3 ? ', wave ' + (Q4.c4wave || 0) : '') + ': ' + (LC.ch4Goal() || 'complete').replace(/^Chapter 4: /, '') + ' (Re-enter the place to see it.)', 'ic_glow');
        return;
      }
      case 'KeyP': {   // v2.3: jump to the next step of Chapter 5
        var Q5 = S.quests, s5 = Q5.ch5 || 0;
        if ((Q5.ch4 || 0) < 4) { Q5.ch2 = 8; Q5.ch3 = 13; Q5.kaStage = 3; Q5.asmara = 1; Q5.jinn = 1; Q5.ch3day = S.day - 1; Q5.ch4 = 4; Q5.c4wave = 5; Q5.ch4day = S.day - 1; if (!State.count('keris_majapahit')) State.add('keris_majapahit', 1); Q5.ch5 = 1; }
        else if (s5 < 2) Q5.ch5 = s5 + 1;
        else if (s5 === 2) { Q5.c5wira = Q5.c5lamps = 1; Q5.ch5 = 3; }
        else if (s5 === 3) { Q5.c5king = Q5.c5empu = 1; Q5.ch5 = 4; delete Q5.c5obor; if (!State.count('pelita_purnama')) State.add('pelita_purnama', 1); }
        else if (s5 === 4) Q5.ch5 = 5;
        State.recalc();
        this.toast('Chapter 5, step ' + Q5.ch5 + ': ' + (LC.ch5Goal() || 'complete').replace(/^Chapter 5: /, '') + ' (Re-enter the place to see it. The jong at Nenek\'s jetty sails to Java and Pulau Kelam.)', 'ic_glow');
        return;
      }
      case 'KeyY': {   // v2.4: jump to the next step of Chapter 6
        var Q6 = S.quests, s6 = Q6.ch6 || 0;
        if ((Q6.ch5 || 0) < 5) { Q6.ch2 = 8; Q6.ch3 = 13; Q6.kaStage = 3; Q6.asmara = 1; Q6.jinn = 1; Q6.ch3day = S.day - 3; Q6.ch4 = 4; Q6.c4wave = 5; Q6.ch4day = S.day - 2; Q6.ch5 = 5; Q6.ch5day = S.day - 1; if (!State.count('keris_majapahit')) State.add('keris_majapahit', 1); Q6.ch6 = 1; Q6.c6day = S.day; }
        else if (s6 < 4) { Q6.ch6 = s6 + 1; if (Q6.ch6 === 1) Q6.c6day = S.day; if (Q6.ch6 === 2 && !State.count('diari_nenek')) State.add('diari_nenek', 1); }
        else if (s6 === 4) { Q6.c6asked = 1; Q6.c6tears = { penghulu: 1, mat: 1, lah: 1, leong: 1 }; Q6.c6bridge = 1; LC.syncLedang(); Q6.ch6 = 5; }
        else if (s6 === 5) { delete Q6.c6fight; Q6.ch6 = 6; if (!State.count('bunga_ledang')) State.add('bunga_ledang', 1); }
        else if (s6 === 6) Q6.ch6 = 7;
        State.recalc();
        this.toast('Chapter 6, step ' + Q6.ch6 + ': ' + (LC.ch6Goal() || 'complete').replace(/^Chapter 6: /, '') + ' (Re-enter the place to see it. The jong at the farm jetty sails to Gunung Ledang.)', 'ic_glow');
        return;
      }
      case 'KeyZ': {   // v2.4.1: Nek Lampir the helper (finishes Chapter 6 first)
        var QZ = S.quests;
        if ((QZ.ch6 || 0) < 7) { QZ.ch2 = 8; QZ.ch3 = 13; QZ.kaStage = 3; QZ.asmara = 1; QZ.jinn = 1; QZ.ch3day = S.day - 4; QZ.ch4 = 4; QZ.c4wave = 5; QZ.ch4day = S.day - 3; QZ.ch5 = 5; QZ.ch5day = S.day - 2; QZ.ch6 = 7; QZ.c6day = S.day - 1; if (!State.count('keris_majapahit')) State.add('keris_majapahit', 1); }
        State.folk('lampir').pts = 40;
        if (QZ.nekLampir) delete QZ.nekLampir; else QZ.nekLampir = 1;
        LC.nekCallAt = LC.nekCircleAt = LC.nekRescueAt = LC.nekTpAt = 0;
        State.recalc();
        this.toast(QZ.nekLampir ? 'Nek Lampir is your helper: press C to call her (when you are alone, and not under the sea).' : 'Nek Lampir reset: 10 hearts, ready to make peace with Nenek (talk to her on Gunung Ledang, by the landing).', 'ic_nek');
        return;
      }
      case 'Digit0': {   // v2.5: jump to the next step of Chapter 7 (finishes Chapter 6 first)
        var QZ = S.quests, s7 = QZ.ch7 || 0;
        if ((QZ.ch6 || 0) < 7) { QZ.ch2 = 8; QZ.ch3 = 13; QZ.kaStage = 3; QZ.asmara = 1; QZ.jinn = 1; QZ.ch3day = S.day - 4; QZ.ch4 = 4; QZ.c4wave = 5; QZ.ch4day = S.day - 3; QZ.ch5 = 5; QZ.ch5day = S.day - 2; QZ.ch6 = 7; QZ.c6day = S.day - 1; if (!State.count('keris_majapahit')) State.add('keris_majapahit', 1); }
        else if (s7 === 0) QZ.ch7 = 1;
        else if (s7 === 1) { QZ.ch7 = 2; if (!State.count('kabus_ledang')) State.add('kabus_ledang', 1); }
        else if (s7 === 2) { QZ.ch7 = 3; S.visited.santubong = true; }
        else if (s7 === 3) QZ.ch7 = 4;
        else if (s7 === 4 && !(QZ.c7kain && QZ.c7beras)) { QZ.c7askS = QZ.c7askJ = 1; QZ.c7kain = QZ.c7beras = 1; if (!State.count('kain_santubong')) State.add('kain_santubong', 1); if (!State.count('beras_sejinjang')) State.add('beras_sejinjang', 1); }
        else if (s7 === 4) { QZ.ch7 = 5; QZ.c7storm = 1; QZ.c7kills = 0; }
        else if (s7 === 5) { QZ.ch7 = 6; delete QZ.c7storm; }
        else if (s7 === 6) { QZ.ch7 = 7; if (!State.count('surat_serapi')) State.add('surat_serapi', 1); }
        else if (s7 === 7) { QZ.ch7 = 8; delete QZ.c7boss; }
        else if (s7 === 8) { QZ.c7sat = 1; QZ.ch7 = 9; }
        else if (s7 === 9 && !QZ.c7aboard) QZ.c7aboard = 1;
        else if (s7 === 9) { QZ.ch7 = 10; delete QZ.c7aboard; QZ.bualang = 1; QZ.pelitaSun = 1; ['kabus_ledang', 'kain_santubong', 'beras_sejinjang', 'surat_serapi'].forEach(function (id) { if (State.count(id)) State.remove(id, State.count(id)); }); }
        LC.bualangRestAt = LC.bualangDueAt = LC.anginAt = 0;
        State.recalc();
        this.toast('Chapter 7, step ' + (QZ.ch7 || 0) + ': ' + ((QZ.ch7 || 0) >= 10 ? 'complete! B calls Sang Bualang, U is Angin Bualang.' : (LC.ch7Goal() || '').replace(/^Chapter 7: /, '')) + ' (Re-enter the place to see it. The jong at the farm jetty sails to Gunung Ledang and Santubong.)', 'ic_glow');
        return;
      }
      case 'Equal': {   // v2.6: jump to the next step of Chapter 8 (finishes Chapter 7 first)
        var Q8 = S.quests, s8 = Q8.ch8 || 0;
        if ((Q8.ch7 || 0) < 10) { Q8.ch2 = 8; Q8.ch3 = 13; Q8.kaStage = 3; Q8.asmara = 1; Q8.jinn = 1; Q8.ch3day = S.day - 5; Q8.ch4 = 4; Q8.c4wave = 5; Q8.ch4day = S.day - 4; Q8.ch5 = 5; Q8.ch5day = S.day - 3; Q8.ch6 = 7; Q8.c6day = S.day - 2; Q8.ch7 = 10; Q8.bualang = 1; Q8.pelitaSun = 1; Q8.c8wait = S.day - 1; if (!State.count('keris_majapahit')) State.add('keris_majapahit', 1); }
        else if (s8 === 0) { Q8.ch8 = 1; Q8.c8floodDay = S.day; }
        else if (s8 === 1) Q8.ch8 = 2;
        else if (s8 === 2) { Q8.c8ratu = Q8.c8pos = 1; Q8.ch8 = 3; }
        else if (s8 === 3) { Q8.c8sh = { 0: 1, 1: 1, 2: 1 }; Q8.ch8 = 4; if (!State.count('serpihan_balang')) State.add('serpihan_balang', 1); }
        else if (s8 === 4 && !Q8.c8confess) Q8.c8confess = 1;
        else if (s8 === 4) { Q8.ch8 = 5; if (!State.count('air_penawar')) State.add('air_penawar', 2); }
        else if (s8 === 5) { Q8.ch8 = 6; delete Q8.c8boss; Q8.c8calmN = Q8.c8calmK = 1; }
        else if (s8 === 6) { Q8.c8duel = 'done'; Q8.ch8 = 7; }
        else if (s8 === 7) { Q8.ch8 = 8; Q8.nagaRide = 1; Q8.c8jar = {}; Q8.c8sealed = 0; ['serpihan_balang', 'air_penawar'].forEach(function (id) { if (State.count(id)) State.remove(id, State.count(id)); }); if (!State.count('seruling_naga')) State.add('seruling_naga', 1); }
        else if (s8 === 8) { Q8.ch8 = 9; Q8.c8sealed = 6; Q8.c8silt = LC.C8.silt; if (State.count('balang_hitam')) State.remove('balang_hitam', State.count('balang_hitam')); }
        State.recalc();
        this.toast('Chapter 8, step ' + (Q8.ch8 || 0) + ': ' + ((Q8.ch8 || 0) >= 9 ? 'complete! Hold the Seruling Naga and press USE (or R) to ride Naga Kecil.' : (LC.ch8Goal() || '').replace(/^Chapter 8: /, '')) + ' (Re-enter the place to see it.)', 'ic_glow');
        return;
      }
      case 'Minus': {   // v1.7: replay Badang's story (moved from B in v2.5: B calls Sang Bualang) (skinny, by the forest pool) or make him strong again
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
    this.time.delayedCall(1500, function () { self.toast('TEST BUILD: everything unlocked (separate save). Keys: ] next day, [ next season, \\ next Pesta, H heal, T replay the Tanggang story, - replay the Badang story, K next Chapter 2 step, L next Chapter 3 step, O next Chapter 4 step, P next Chapter 5 step, Y next Chapter 6 step, Z Nek Lampir the helper, 0 next Chapter 7 step.', 'ic_glow'); });
  };
})(window.LC);
