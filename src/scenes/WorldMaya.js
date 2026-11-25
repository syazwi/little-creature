/* World, Chapter 19: Harum Sundal Malam (v3.20). See maya.js for the story and the steps. Story steps are saved the
 * moment they happen (before any dialogue), and every scene that follows a dialogue runs from the update loop once the
 * dialogue has closed, so closing a conversation early never loses progress.
 *  - The farm: the scent of sundal malam on the night the chapter begins; after it, the flower by the spirit house.
 *  - Tanah Perkuburan Lama: Maya under the kemboja tree; the scent meter that leads to her sisir.
 *  - Kampung Tepian at night (step 4): the cradle that rocks itself, the folded sarongs, the shaking banana trees, a
 *    baby's cry (loud when she is far, soft when she is near) and a pale shape at the edge of your sight; Tok Imam.
 *  - Rumah Tuan Hashim: the family, Mak Inah, the sundal malam under the nursery window; inside, four lamps, the
 *    portrait, Khalid's letters, and the nursery where the pontianak comes after 8 PM (a jump scare, unless Pause >
 *    Jump scares is Gentle). Her hair lashes along a red line, her shriek is a ring; she blinks away when hurt. At a
 *    quarter of her health she sinks down, and you hold up the sisir. Then the family, the truth, and three choices.
 *  - Hilai Maya (H): everything around you flees in fear for a few seconds (longer at night).
 * Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var W = LC.WorldScene.prototype, C = LC.C19, X = LC.MAYA_TEXT, T = 16;
  var NAMES = { hashim: 'Tuan Hashim', rokiah: 'Puan Rokiah', inah: 'Mak Inah' };
  function step(w) { return C.step(w.S); }
  function story(w, n) { w.S.quests.ch19 = n; LC.State.save(); }
  function night(w) { return C.isNight(w.S); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ADD() { return Phaser.BlendModes.ADD; }
  function px(t) { return { x: (t.x + 0.5) * T, y: (t.y + 1) * T }; }   // where a person stands on a tile
  function signs(q) { return Object.keys(q.c19signs || {}).length; }
  function lamps(q) { return Object.keys(q.c19lamps || {}).length; }
  function helped(q) { return lamps(q) >= C.lamps.length && !!q.c19bunga && !!q.c19inah; }
  function gentle(S) { return !!(S.flags && S.flags.noScare9); }

  var create = W.createKampong, update = W.updateKampong;
  W.createKampong = function () { create.apply(this, arguments); this.createMaya(); };
  W.updateKampong = function (time, dt) { update.apply(this, arguments); this.updateMaya(time, dt); };

  // ================================================================ talking, doors and things to look at
  var objectAction = W.objectAction;
  W.objectAction = function (o) {
    var self = this, S = this.S, q = S.quests, s = step(this);
    if (!o) return objectAction.apply(this, arguments);
    switch (o.type) {
      case 'maya_way': return { label: o.to === 'kubur19' ? 'Walk up the lane to the old graveyard' : 'Go up the hill to Tuan Hashim\'s house', fn: function () {
        self.goArea(o.to, self.tilePx(o.to === 'kubur19' ? C.kubur.spawn : C.besar.spawn), 'up');
      } };
      case 'maya_back': return { label: o.to === 'kampung' ? 'Back to Kampung Tepian' : 'Go back outside', fn: function () {
        if (self.maya && self.maya.fight && !self.maya.fight.over) { self.toast('You cannot leave the nursery now!', 'pontianak19_0'); return; }
        self.goArea(o.to, self.tilePx(o.at), 'down');
      } };
      case 'maya_tree': return { label: 'The old kemboja tree', fn: function () {
        if (s >= C.end) self.toast(X.afterKubur, 'i_bunga_sundal');
        else if (s === 2) self.toast('The scent swirls around the tree, but it is not strongest here. Follow it.', 'i_bunga_sundal');
        else self.toast('An old kemboja tree, older than the kampung. Its white flowers fall all year, and never seem to run out.', 'kemboja19');
      } };
      case 'maya_lady': return { label: 'Talk to the woman', fn: function () { self.mayaLady(); } };
      case 'maya_grave': {
        var spot = s === 2 && C.spots.some(function (c) { return c.id === o.id; });
        if (spot) return { label: 'Search here', fn: function () { self.mayaSearch(o); } };
        return { label: 'Look', fn: function () { self.toast(o.text, o.tex); } };
      }
      case 'maya_sign': {
        var seen = !!(q.c19signs && q.c19signs[o.sign]);
        return { label: s === 4 && !seen ? 'Look closer' : 'Look', fn: function () { self.mayaSign(o, seen); } };
      }
      case 'maya_imam': return { label: 'Talk to Tok Imam', fn: function () { self.mayaImam(); } };
      case 'maya_baby': return { label: 'Play with the baby', fn: function () { self.mayaBaby(o); } };
      case 'maya_farmbunga': return { label: night(this) && q.c19pick !== S.day ? 'Pick a sundal malam' : 'The sundal malam', fn: function () { self.mayaFarmBunga(); } };
      case 'maya_house': return { label: 'Tuan Hashim\'s house', fn: function () { self.toast(X.houseText, 'rumah19'); } };
      case 'maya_door': return { label: 'Go inside', fn: function () {
        if (s < 5 || (s === 5 && !q.c19welcome)) { self.toast(s < 5 ? 'The front door is shut. Nobody answers your knock.' : X.doorLocked, 'tangga19'); return; }
        self.goArea('dalam19', self.tilePx({ x: C.dalam.exit.x, y: C.dalam.exit.y - 1 }), 'up');
      } };
      case 'maya_bush': return { label: s === 5 && q.c19welcome ? 'Cut the sundal malam' : 'The sundal malam', fn: function () { self.mayaBush(); } };
      case 'maya_folk': return { label: 'Talk to ' + NAMES[o.who], fn: function () { self.mayaFolk(o); } };
      case 'maya_lamp': {
        var lit = !!(q.c19lamps && q.c19lamps[o.idx]);
        return { label: lit ? 'A brass lamp' : 'Light the lamp', fn: function () { self.mayaLamp(o); } };
      }
      case 'maya_portrait': return { label: 'The family portrait', fn: function () { self.mayaClue('potret', X.portrait); } };
      case 'maya_letters': return { label: 'The letters on the desk', fn: function () { self.mayaClue('surat', X.letters); } };
      case 'maya_window': return { label: 'The nursery window', fn: function () { self.toast(q.c19bunga ? X.windowCut : X.window, 'tingkap19'); } };
      case 'maya_cradle': return { label: 'The cradle', fn: function () {
        if (s >= C.end) { self.toast(X.cradleAfter, 'buaian19_kosong'); return; }
        if (s === 6 && self.S.minutes >= C.watch) { self.mayaScare(); return; }
        self.mayaLines(X.cradleDay);
      } };
      default: return objectAction.apply(this, arguments);
    }
  };
  // hold up the sisir, beside the pontianak once she sinks down
  var getAction = W.getAction;
  W.getAction = function () {
    var F = this.maya && this.maya.fight, self = this;
    if (F && F.cornered && !F.over && F.e && Math.hypot(F.e.spr.x - this.player.x, F.e.spr.y - this.player.y) < 44) {
      return { label: 'Hold up the sisir', fn: function () { self.mayaHold(); } };
    }
    var r = getAction.apply(this, arguments);
    // sundal malam on the farm only opens at night
    if (r && r.label === 'Harvest Sundal Malam' && !night(this)) return { label: 'Sundal Malam (opens at night)', tile: true, fn: function () { self.toast(X.farmDay, 'crop_sundal_3'); } };
    return r;
  };
  // the pontianak never falls: at a quarter of her health she sinks down, and waits for the sisir
  var die = W.enemyDie;
  W.enemyDie = function (e) {
    var F = this.maya && this.maya.fight;
    if (F && e === F.e) { e.hp = Math.max(1, e.hp); if (!F.cornered) this.mayaCorner(F); return; }
    return die.apply(this, arguments);
  };
  var faint = W.faint;
  W.faint = function () {
    if (this.area === 'dalam19' && this.maya && this.maya.fight && !this.maya.fight.over && !this.leaving) { this.mayaLeaveFight(true); return; }
    return faint.apply(this, arguments);
  };
  // the chapter's nights stay dark: Pelita's daylight (Lv 30) rests in the graveyard, the frightened kampung and the
  // big house while the story is there (as it does in Chapter 9's fog)
  W.mayaDark = function () {
    var s = step(this), a = this.area;
    if (!night(this) || !C.ready(this.S) || s >= C.end) return false;
    return (a === 'kubur19' && s >= 1 && s <= 3) || (a === 'kampung' && s === 4) || ((a === 'dalam19' || a === 'besar19') && (s === 6 || s === 7));
  };
  var updateLighting = W.updateLighting;
  W.updateLighting = function () {
    var S = this.S, off = S.flags.sunOff;
    if (!this.mayaDark()) return updateLighting.apply(this, arguments);
    S.flags.sunOff = true;
    try { return updateLighting.apply(this, arguments); } finally { S.flags.sunOff = off; }
  };
  // Hilai Maya: frightened enemies back away and run, and cannot strike
  var updateEnemies = W.updateEnemies;
  W.updateEnemies = function (time, dt, blocked) {
    var list = this.enemies || [];
    list.forEach(function (e) { if (e.fearT > 0 && !e.dead && !e.away) { e.restT = Math.max(e.restT || 0, 0.05); e.windT = 0; e.strikeT = 0; } });
    updateEnemies.apply(this, arguments);
    var p = this.player, self = this;
    if (blocked || this.leaving || this.sleeping) return;
    list.forEach(function (e) {
      if (!(e.fearT > 0)) return;
      e.fearT -= dt;
      var s = e.spr;
      if (e.dead || e.away || e.stoneT > 0) { if (e.fearT <= 0 && !e.dead) s.clearTint(); return; }
      if (e.fearT <= 0) { if (e.hurtT <= 0) s.clearTint(); return; }
      var dx = s.x - p.x, dy = s.y - p.y, d = Math.max(1, Math.hypot(dx, dy)), sp = e.def.speed * 0.9 * dt, D = e.def;
      var nx = s.x + dx / d * sp, ny = s.y + dy / d * sp;
      if (!e.g.fixed) {
        if (!self.solidPx(nx - D.w, s.y - 2) && !self.solidPx(nx + D.w, s.y - 2)) s.x = nx;
        if (!self.solidPx(s.x - D.w, ny - 2) && !self.solidPx(s.x + D.w, ny - 2)) s.y = ny;
        s.setFlipX(dx < 0); s.setDepth(s.y);
      }
      e.atkCd = Math.max(e.atkCd || 0, 0.4);
      if (e.hurtT <= 0) s.setTint(0xdce8ff);
    });
  };

  Object.assign(W, {
    mayaLines: function (lines, opts) {
      this.ui.say(lines.map(function (l) { return Object.assign({ text: l[1] }, LC.SPEAKERS[l[0]] || {}); }), opts);
    },
    mayaPetals: function (x, y, n, spread) {
      var self = this;
      n = LC.Display && LC.Display.effectCount ? LC.Display.effectCount(n) : n;
      for (var i = 0; i < n; i++) (function () {
        var f = self.add.image(x + (Math.random() - 0.5) * (spread || 20), y + (Math.random() - 0.5) * 10, 'glow').setBlendMode(ADD()).setTint(0xfffcf0)
          .setScale(0.035 + Math.random() * 0.03).setDepth(9560);
        self.tweens.add({ targets: f, x: f.x + (Math.random() - 0.5) * 50, y: f.y - 14 - Math.random() * 30, alpha: { from: 1, to: 0 }, duration: 1200 + Math.random() * 1000, ease: 'Sine.easeOut', onComplete: function () { f.destroy(); } });
      })();
    },

    // ================================================================ setting up each place
    createMaya: function () {
      var self = this, S = this.S, q = S.quests, s = step(this), m = this.maya = { born: this.time.now, cryT: 8 + Math.random() * 6, glimpseT: 14, petalT: 0, wasNight: night(this), fight: null, cine: null, lampLights: {} };
      if (this.mayaNote) { var note = this.mayaNote; this.mayaNote = null; this.time.delayedCall(500, function () { self.toast(note, 'npc19_inah_0'); }); }
      if (this.area === 'kubur19' && C.ready(S) && s < C.end && !night(this) && s >= 1) this.time.delayedCall(600, function () { if (self.area === 'kubur19') self.toast(X.dayGrave, 'nisan19'); });
      if (this.area === 'kampung' && s === 4) {
        var cr = this.objImgs.k_buaian19;   // the cradle rocks by itself
        if (cr) { cr.setOrigin(0.5, 0.05); cr.y -= cr.height * 0.95; this.tweens.add({ targets: cr, angle: { from: -9, to: 9 }, duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' }); }
      }
      if (this.area === 'dalam19') {
        C.lamps.forEach(function (l, i) { if (q.c19lamps && q.c19lamps[i]) self.mayaLampOn(i, true); });
        if (s === 6 && S.minutes >= C.watch) this.time.delayedCall(700, function () { if (self.area === 'dalam19' && !self.maya.fight) self.toast(X.watch, 'buaian19_bayi'); });
        if (s === 6 && S.minutes < C.watch) this.time.delayedCall(700, function () { if (self.area === 'dalam19') self.toast(X.waitNight, 'buaian19_bayi'); });
        if (s === 7) m.cine = { phase: 'resume', actors: {} };
      }
      if (this.area === 'farm' && s >= C.end) this.mayaOwed();
    },
    mayaOwed: function () {   // the seeds, if the bag was full at the end
      var q = this.S.quests, n = q.c19seedOwe || 0, got = 0;
      while (n > 0 && LC.State.add('benih_sundal', 1)) { n--; got++; }
      if (got) { q.c19seedOwe = n; LC.State.save(); var self = this; this.time.delayedCall(800, function () { self.toast('Mak Kiah left ' + got + ' Benih Sundal Malam for you by the spirit house.', 'i_benih_sundal'); }); }
    },

    // ================================================================ the graveyard: Maya and her sisir
    mayaLady: function () {
      var S = this.S, q = S.quests, s = step(this);
      if (s === 1) {
        q.c19spot = Math.floor(Math.random() * C.spots.length); q.c19tried = {};
        story(this, 2);
        LC.Audio.sfx('chime');
        this.mayaLines(X.meet);
        return;
      }
      if (s === 2) { this.mayaLines([['maya19', 'Follow the scent. Where it is strongest, that is where my comb will be.']]); return; }
      if (s === 3) {
        if (S.day <= (q.c19day || 0)) { this.mayaLines(X.mayaLater); return; }
        q.c19signs = {};
        story(this, 4);
        var im = this.objImgs.kb_maya;
        if (im) this.mayaPetals(im.x, im.y - 12, 20, 24);
        LC.Audio.sfx('desir19');
        this.maya.vanish = true;
        this.mayaLines(X.sorrow);
      }
    },
    mayaSearch: function (o) {
      var S = this.S, q = S.quests, spot = C.spots[q.c19spot || 0], self = this;
      if (!night(this)) { this.toast(X.dayGrave, 'nisan19'); return; }
      var im = this.objImgs[o.id];
      if (im) this.fx.leaf.explode(6, im.x, im.y - 6);
      if (o.id !== spot.id) {
        q.c19tried = q.c19tried || {}; q.c19tried[o.id] = true; LC.State.save();
        this.toast(pick(X.wrongSpot), 'i_bunga_sundal');
        return;
      }
      q.c19day = S.day;
      if (!LC.State.count('sisir_maya')) LC.State.add('sisir_maya', 1);
      story(this, 3);
      LC.Audio.sfx('chime');
      if (im) this.mayaPetals(im.x, im.y - 6, 18, 16);
      this.maya.vanish = true;
      this.time.delayedCall(10, function () { self.mayaLines(X.found); });
    },

    // ================================================================ Kampung Tepian at night
    mayaSign: function (o, seen) {
      var S = this.S, q = S.quests, s = step(this);
      if (s !== 4) return;
      if (!night(this)) { this.toast(X.terrorDay, 'ic_moon'); return; }
      if (seen) { this.mayaLines(X.signs[o.sign].slice(0, 1)); return; }
      q.c19signs = q.c19signs || {}; q.c19signs[o.sign] = true; LC.State.save();
      var im = this.objImgs[o.id];
      if (im) this.mayaPetals(im.x, im.y - 10, 10, 20);
      if (o.sign === 'pisang' && im) { LC.Audio.sfx('hilai19'); this.tweens.add({ targets: im, x: im.x + 2, duration: 60, yoyo: true, repeat: 7 }); }
      var lines = X.signs[o.sign].slice();
      if (signs(q) >= 3) lines.push(['', X.signAfter]);
      else lines.push(['', '(Signs found: ' + signs(q) + ' / 3.)']);
      this.mayaLines(lines);
    },
    mayaImam: function () {
      var q = this.S.quests, s = step(this);
      if (s === 5) { this.mayaLines(X.imamLater); return; }
      if (signs(q) < 3) { this.mayaLines(X.imamWait.map(function (l) { return [l[0], l[1].replace('{n}', signs(q))]; })); return; }
      story(this, 5);
      this.refreshWhen();
      this.mayaLines(X.imam);
    },
    mayaGlimpse: function () {   // a pale shape at the edge of your sight
      var p = this.player, self = this, ang = Math.random() * Math.PI * 2, d = 120 + Math.random() * 40;
      var x = p.x + Math.cos(ang) * d, y = p.y + Math.sin(ang) * d * 0.6;
      var g = this.add.image(x, y, 'pontianak19_0').setOrigin(0.5, 1).setDepth(y).setAlpha(0);
      this.tweens.add({ targets: g, alpha: 0.55, duration: 400, yoyo: true, hold: 500, onComplete: function () { g.destroy(); } });
      this.tweens.add({ targets: g, x: x + (Math.random() < 0.5 ? -30 : 30), y: y - 8, duration: 1300 });
      void self;
    },
    mayaCry: function () {
      var p = this.player, near = Math.random() < 0.45;
      LC.Audio.sfx(near ? 'tangis19' : 'tangisjauh19');
      this.ui.floatText(p.x, p.y - 30, near ? X.crySoft : X.cryFar, near ? '#e8dcff' : '#c8c0e0');
      if (near) this.time.delayedCall(900, this.mayaGlimpse.bind(this));
    },

    // ================================================================ Rumah Tuan Hashim
    mayaFolk: function (o) {
      var S = this.S, q = S.quests, s = step(this), who = o.who, key = who + '19';
      if (s >= C.end) { this.toast(X.afterBesar[who], o.tex); return; }
      if (who === 'inah') {
        if (s < 5) { this.toast(X.folk.inah[0], o.tex); return; }
        if (!q.c19inah) { q.c19inah = true; LC.State.save(); this.mayaLines(X.inah.concat(helped(q) && s === 5 ? [['', 'Everything is ready. Tell Tuan Hashim.']] : [])); return; }
        this.mayaLines(X.inahLater);
        return;
      }
      if (s === 5 && !q.c19welcome) {
        q.c19welcome = true;
        S.kepeng += 300; S.stats.earned = (S.stats.earned || 0) + 300;
        LC.State.save();
        LC.Audio.sfx('coin');
        this.mayaLines(X.welcome);
        return;
      }
      if (s === 5 && who === 'hashim' && helped(q)) { story(this, 6); this.mayaLines(X.ready); return; }
      var lines = X.folk[who], left = [];
      if (s === 6) { this.mayaLines([[key, lines[2]], ['', S.minutes >= C.watch ? '(Go inside to the nursery, at the back of the house, and keep watch by the cradle.)' : '(Come back after 8 PM and keep watch by the cradle in the nursery.)']]); return; }
      if (lamps(q) < C.lamps.length) left.push('light the lamps inside (' + lamps(q) + ' / ' + C.lamps.length + ')');
      if (!q.c19bunga) left.push('cut the sundal malam under the nursery window');
      if (!q.c19inah) left.push('ask Mak Inah, by the kitchen');
      this.mayaLines([[key, lines[0]], [key, lines[1]]].concat(left.length ? [['', '(Still to do: ' + left.join(', ') + '.)']] : []));
    },
    mayaBush: function () {
      var q = this.S.quests, s = step(this);
      if (s !== 5 || !q.c19welcome || q.c19bunga) { this.toast(s >= 6 ? X.bushLater : 'A sundal malam bush under the nursery window. Nobody planted it, the gardener says.', 'sundal19'); return; }
      q.c19bunga = true; LC.State.save();
      var im = this.objImgs.b_sundal19;
      if (im) { this.fx.leaf.explode(10, im.x, im.y - 8); this.mayaPetals(im.x, im.y - 8, 16, 18); }
      LC.Audio.sfx('harvest');
      this.refreshWhen();
      this.mayaLines(X.bushCut.concat(helped(q) ? [['', 'Everything is ready. Tell Tuan Hashim.']] : []));
    },
    mayaLampOn: function (i, quiet) {
      var m = this.maya, l = C.lamps[i], im = this.objImgs['d_lampu19_' + i];
      if (im) im.setTexture('lampu19_on');
      if (m && !m.lampLights[i]) m.lampLights[i] = this.addLight((l.x + 0.5) * T, l.y * T + 2, 0xffd890, 1.1, true);
      if (!quiet && im) this.fx.sparkle.explode(8, im.x, im.y - 18);
    },
    mayaLampsOut: function () {
      var m = this.maya, self = this;
      Object.keys(m.lampLights).forEach(function (i) { var L = m.lampLights[i]; L.base = 0; L.img.setAlpha(0); delete m.lampLights[i]; });
      C.lamps.forEach(function (l, i) { var im = self.objImgs['d_lampu19_' + i]; if (im) { im.setTexture('lampu19_off'); self.fx.smoke.explode(4, im.x, im.y - 20); } });
    },
    mayaLamp: function (o) {
      var q = this.S.quests, s = step(this);
      if (q.c19lamps && q.c19lamps[o.idx]) { this.toast(X.lampOn, 'lampu19_on'); return; }
      if (s < 5 || (this.maya.fight && !this.maya.fight.over)) { this.toast('A brass lamp. It is cold.', 'lampu19_off'); return; }
      q.c19lamps = q.c19lamps || {}; q.c19lamps[o.idx] = true; LC.State.save();
      LC.Audio.sfx('chime');
      this.mayaLampOn(o.idx);
      var n = lamps(q);
      this.toast(n >= C.lamps.length ? X.lampsAll + (helped(q) && s === 5 ? ' Everything is ready: tell Tuan Hashim.' : '') : X.lampLit + ' (' + n + ' / ' + C.lamps.length + ')', 'lampu19_on');
    },
    mayaClue: function (k, lines) {
      var q = this.S.quests;
      q.c19clue = q.c19clue || {};
      if (!q.c19clue[k]) { q.c19clue[k] = true; LC.State.save(); }
      this.mayaLines(lines);
    },

    // ================================================================ the night watch: the pontianak
    mayaScare: function () {
      var self = this, S = this.S, q = S.quests, m = this.maya;
      if (!m || m.fight || this.leaving) return;
      var F = m.fight = { phase: 'dark', t: 1.3, over: false, cornered: false, e: null, lashT: 2.6, shriekT: 7, tele: null, ring: null, hits: 0, lastHp: 0 };
      F.g = this.add.graphics().setDepth(9590);
      this.mayaLampsOut();
      LC.Audio.sfx('tangis19');
      this.cameras.main.shake(140, 0.002);
      this.toast(X.lampsOut, 'lampu19_off');
      var cr = this.objImgs.d_buaian19;
      if (cr) { cr.setOrigin(0.5, 0.05); cr.y -= cr.height * 0.95; F.rock = this.tweens.add({ targets: cr, angle: { from: -12, to: 12 }, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' }); }
      void q; void self;
    },
    mayaSpawn: function (F) {
      var S = this.S, st = C.fight(S), at = px({ x: C.dalam.cradle.x + 1, y: C.dalam.cradle.y + 2 }), A = C.dalam.arena;
      var e = F.e = this.spawnEnemy({ kind: 'pontianak19', zone: { x0: A.x0, y0: A.y0, x1: A.x1, y1: A.y1 } }, true);
      e.def = Object.assign({}, LC.ENEMIES.pontianak19, { hp: st.hp, dmg: st.dmg, level: st.level });
      e.hp = st.hp; F.max = st.hp; F.lastHp = st.hp; F.lash = st.lash;
      e.spr.setPosition(at.x, at.y).setDepth(at.y).setVisible(true).setAlpha(0);
      e.tx = at.x; e.ty = at.y;
      e.atkCd = 1.5;
      var scare = !gentle(S) && !S.quests.c19scared;
      S.quests.c19scared = true; LC.State.save();
      if (scare) {
        e.spr.setAlpha(1);
        LC.Audio.sfx('jerit19');
        if (this.ui.scare19) this.ui.scare19();
        this.mayaLines(X.scare);
      } else {
        this.tweens.add({ targets: e.spr, alpha: 1, duration: 1600 });
        LC.Audio.sfx('hilai19');
        this.mayaLines(X.scareGentle.concat([X.scare[1]]));
      }
      F.phase = 'fight';
      F.toastPending = true;
    },
    mayaCorner: function (F) {
      var e = F.e;
      F.cornered = true; F.tele = null; F.ring = null; F.g.clear();
      e.g.fixed = true; e.windT = 0; e.strikeT = 0; e.restT = 0; e.kx = 0; e.ky = 0; e.fearT = 0;
      e.spr.clearTint().setTint(0xe8e4f4);
      this.tweens.add({ targets: e.spr, scaleY: 0.82, duration: 500, ease: 'Quad.easeOut' });
      LC.Audio.sfx('tangis19');
      LC.Audio.setBattle(false);
      this.ui.floatText(e.spr.x, e.spr.y - 30, '...', '#e8dcff');
      this.toast(X.cornered, 'i_sisir_maya');
    },
    mayaLeaveFight: function (fainted) {
      var S = this.S, m = this.maya, F = m && m.fight;
      if (F) { F.over = true; if (F.e) { F.e.dead = true; F.e.respawn = Infinity; } }
      if (fainted) { S.hp = S.maxHp; this.player.clearTint().setAlpha(1).setAngle(0); this.mayaNote = X.faint; }
      LC.Audio.setBattle(false);
      LC.State.save();
      this.goArea('besar19', this.tilePx({ x: C.besar.door.x, y: C.besar.door.y + 1 }), 'down');
    },
    updateMayaFight: function (F, dt, time) {
      var self = this, e = F.e, p = this.player, g = F.g;
      if (F.phase === 'dark') { if ((F.t -= dt) <= 0) this.mayaSpawn(F); return; }
      if (F.phase !== 'fight' || !e || F.cornered) return;
      if (F.toastPending) { F.toastPending = false; this.toast(X.fightToast, 'pontianak19_0'); }
      var s = e.spr;
      // hurt three times, and she blinks away to another corner of the nursery
      if (e.hp < F.lastHp) { F.hits += 1; F.lastHp = e.hp; }
      if (e.hp <= F.max * 0.25) { e.hp = Math.max(1, e.hp); this.mayaCorner(F); return; }
      if (F.hits >= 3 && !F.tele && !F.ring) {
        F.hits = 0;
        var A = C.dalam.arena, to = { x: (A.x0 + 1 + Math.random() * (A.x1 - A.x0 - 2)) * T, y: (A.y0 + 1.5 + Math.random() * (A.y1 - A.y0 - 2)) * T };
        LC.Audio.sfx('hilai19');
        this.fx.smoke.explode(8, s.x, s.y - 12);
        this.tweens.add({ targets: s, alpha: 0, duration: 220, onComplete: function () {
          if (!F.e || F.over) return;
          s.setPosition(to.x, to.y); e.tx = to.x; e.ty = to.y; e.kx = 0; e.ky = 0;
          self.tweens.add({ targets: s, alpha: 1, duration: 260 });
        } });
      }
      g.clear();
      // the hair lash: a red line, then the hair
      if (F.tele) {
        var t = F.tele;
        t.t -= dt;
        s.setPosition(t.ox, t.oy);
        var ex = t.ox + Math.cos(t.ang) * t.len, ey = t.oy - 10 + Math.sin(t.ang) * t.len;
        if (t.t > 0) {
          g.lineStyle(6, 0xff2a3a, 0.18 + 0.25 * (1 - t.t / 0.75)); g.lineBetween(t.ox, t.oy - 10, ex, ey);
          g.lineStyle(1, 0xff6a7a, 0.8); g.lineBetween(t.ox, t.oy - 10, ex, ey);
        } else {
          F.tele = null;
          LC.Audio.sfx('desir19');
          var hair = this.add.graphics().setDepth(9591);
          hair.lineStyle(5, 0x0e0a0c, 1); hair.lineBetween(t.ox, t.oy - 10, ex, ey);
          hair.lineStyle(1, 0x3a2a3a, 1); hair.lineBetween(t.ox, t.oy - 12, ex, ey - 2);
          this.tweens.add({ targets: hair, alpha: 0, duration: 380, onComplete: function () { hair.destroy(); } });
          // is the player on the line?
          var vx = ex - t.ox, vy = ey - (t.oy - 10), L2 = vx * vx + vy * vy, u = Math.max(0, Math.min(1, ((p.x - t.ox) * vx + (p.y - 8 - (t.oy - 10)) * vy) / L2));
          var cx = t.ox + vx * u, cy = t.oy - 10 + vy * u;
          if (Math.hypot(p.x - cx, p.y - 8 - cy) < 11) this.playerHurt(F.lash, e);
          F.lashT = 2.6 + Math.random() * 1.6;
        }
        return;
      }
      // the shriek: a ring that grows, then bursts
      if (F.ring) {
        var r = F.ring;
        r.t -= dt;
        s.setPosition(r.x, r.y);
        var k = 1 - r.t / 0.95;
        g.lineStyle(2, 0xe8dcff, 0.35 + 0.4 * k); g.strokeCircle(r.x, r.y - 12, 76 * k);
        g.fillStyle(0xe8dcff, 0.06 + 0.08 * k); g.fillCircle(r.x, r.y - 12, 76);
        if (r.t <= 0) {
          F.ring = null;
          LC.Audio.sfx('hilai19');
          this.shockwave(r.x, r.y - 12, 76, 0xe8dcff);
          this.cameras.main.shake(180, 0.004);
          if (Math.hypot(p.x - r.x, p.y - 8 - (r.y - 12)) < 76) this.playerHurt(e.def.dmg, e);
          F.shriekT = 8 + Math.random() * 3;
        }
        return;
      }
      if (e.windT > 0 || e.strikeT > 0 || e.stoneT > 0 || e.tranceT > 0 || e.fearT > 0) return;
      F.lashT -= dt; F.shriekT -= dt;
      var d = Math.hypot(p.x - s.x, p.y - s.y);
      if (F.shriekT <= 0 && d < 110) { F.ring = { x: s.x, y: s.y, t: 0.95 }; e.atkCd = Math.max(e.atkCd, 1.3); LC.Audio.sfx('tangis19'); this.ui.floatText(s.x, s.y - 30, 'HIHIHI...', '#e8dcff'); return; }
      if (F.lashT <= 0 && d < 150 && d > 20) {
        F.tele = { ox: s.x, oy: s.y, ang: Math.atan2(p.y - 8 - (s.y - 10), p.x - s.x), len: 120, t: 0.75 };
        e.atkCd = Math.max(e.atkCd, 1.2);
      }
      void time;
    },
    mayaHold: function () {
      var m = this.maya, F = m && m.fight, S = this.S;
      if (!F || F.over || !F.cornered) return;
      F.over = true; F.g.clear();
      story(this, 7);   // (saved first)
      S.quests.c19round = 0;
      LC.State.save();
      var e = F.e, s = e.spr, x = s.x, y = s.y;
      e.dead = true; e.respawn = Infinity; e.light.base = 0; s.setVisible(false);
      LC.Audio.setBattle(false);
      var c = m.cine = { phase: 'hold', actors: {} };
      c.actors.ponti = this.add.sprite(x, y, 'pontianak19_0').setOrigin(0.5, 1).setDepth(y).setScale(1, 0.82).setTint(0xe8e4f4);
      this.mayaPetals(x, y - 16, 14, 20);
      LC.Audio.sfx('chime');
      this.mayaLines(X.hold);
    },

    // ---------------------------------------------------------------- the truth, after the dialogue closes each time
    mayaActor: function (key, from, to, delay, done) {
      var self = this, a = this.add.sprite(from.x, from.y, key + '_w1').setOrigin(0.5, 1).setDepth(from.y);
      a.play(key + '_walk');
      this.tweens.add({ targets: a, x: to.x, y: to.y, duration: 1300, delay: delay || 0, onUpdate: function () { a.setDepth(a.y); a.setFlipX(to.x < from.x); },
        onComplete: function () { a.play(key + '_idle'); if (done) done(); } });
      return a;
    },
    mayaCine: function () {
      var c = this.maya.cine, self = this, S = this.S, q = S.quests;
      if (!c || c.wait) return;
      var door = px({ x: 13.5, y: 9 }), cr = px({ x: C.dalam.cradle.x + 1, y: C.dalam.cradle.y + 2 });
      function family() {   // Tuan Hashim, Puan Rokiah and Mak Inah come in through the doorway
        c.wait = true;
        c.actors.hashim = self.mayaActor('npc19_hashim', door, px({ x: 10, y: 7 }), 0);
        c.actors.rokiah = self.mayaActor('npc19_rokiah', door, px({ x: 11.5, y: 7.5 }), 250);
        c.actors.inah = self.mayaActor('npc19_inah', door, px({ x: 14, y: 8 }), 500, function () { c.wait = false; });
      }
      if (c.phase === 'resume') {   // back in the nursery in the middle of it all
        c.actors.maya = this.add.sprite(cr.x + 18, cr.y - 2, 'npc19_maya_0').setOrigin(0.5, 1).setDepth(cr.y);
        c.actors.maya.play('npc19_maya_idle');
        c.actors.hashim = this.add.sprite(10.5 * T, 8 * T, 'npc19_hashim_0').setOrigin(0.5, 1).setDepth(8 * T);
        c.actors.rokiah = this.add.sprite(12 * T, 8.5 * T, 'npc19_rokiah_0').setOrigin(0.5, 1).setDepth(8.5 * T);
        c.actors.inah = this.add.sprite(14.5 * T, 9 * T, 'npc19_inah_0').setOrigin(0.5, 1).setDepth(9 * T);
        c.phase = 'round'; c.asked = false;
        this.mayaLines([['', 'Maya is still by the cradle, her son in her arms. Her hair stirs, slowly, like smoke.']]);
        return;
      }
      if (c.phase === 'hold') { c.phase = 'arrive'; family(); return; }
      if (c.phase === 'arrive') { c.phase = 'reveal'; this.mayaLines(X.arrive); return; }
      if (c.phase === 'reveal') {
        c.phase = 'confess';
        var pt = c.actors.ponti;
        this.cameras.main.flash(500, 240, 236, 255);
        if (pt) {
          this.mayaPetals(pt.x, pt.y - 14, 18, 18);
          var mx = pt.x, my = pt.y;
          pt.destroy();
          c.actors.maya = this.add.sprite(mx, my, 'npc19_maya_0').setOrigin(0.5, 1).setDepth(my);
          c.actors.maya.play('npc19_maya_idle');
        }
        this.mayaLines(X.reveal);
        return;
      }
      if (c.phase === 'confess') { c.phase = 'grief'; this.mayaLines(X.confess); return; }
      if (c.phase === 'grief') {
        c.phase = 'round'; c.asked = false;
        var mm = c.actors.maya;
        if (mm) { c.wait = true; this.tweens.add({ targets: mm, x: cr.x + 18, y: cr.y - 2, duration: 900, onComplete: function () { c.wait = false; self.mayaLines(X.grief); c.asked = false; } }); }
        else this.mayaLines(X.grief);
        return;
      }
      if (c.phase === 'round') {
        var n = q.c19round || 0;
        if (n >= X.rounds.length) { c.phase = 'finale'; this.mayaFinale(); return; }
        if (c.asked) { c.asked = false; return; }   // (the question was closed without an answer: ask again)
        c.asked = true;
        var R = X.rounds[n], opts = R.wrong.map(function (w) { return { t: w[0], ok: false, why: w[1] }; });
        opts.splice(R.pos || 0, 0, { t: R.right, ok: true });
        this.mayaLines([['maya19', R.say]], { choices: opts.map(function (o) {
          return { label: o.t, fn: function () { self.mayaAnswer(o, R); } };
        }) });
        return;
      }
      if (c.phase === 'finale') {
        c.phase = 'gone';
        var ma = c.actors.maya;
        if (ma) { this.mayaPetals(ma.x, ma.y - 14, 26, 26); this.tweens.add({ targets: ma, alpha: 0, y: ma.y - 10, duration: 1800 }); }
        LC.Audio.sfx('desir19');
        ['hashim', 'rokiah', 'inah'].forEach(function (k, i) { var a = c.actors[k]; if (a) self.tweens.add({ targets: a, alpha: 0, duration: 900, delay: 600 + i * 200 }); });
        this.time.delayedCall(2200, function () {
          Object.keys(c.actors).forEach(function (k) { if (c.actors[k] && c.actors[k].active) c.actors[k].destroy(); });
          if (self.maya && self.maya.cine === c) self.maya.cine = null;
          if (self.area === 'dalam19') { self.refreshWhen(); C.lamps.forEach(function (l, i) { self.mayaLampOn(i, true); }); }
        });
        this.cameras.main.flash(900, 255, 244, 220);
      }
    },
    mayaAnswer: function (o, R) {
      var c = this.maya && this.maya.cine, q = this.S.quests, ma = c && c.actors.maya;
      if (!c) return;
      c.asked = false;
      if (o.ok) {
        q.c19round = (q.c19round || 0) + 1; LC.State.save();
        if (ma) { ma.clearTint(); this.mayaPetals(ma.x, ma.y - 14, 10, 14); }
        LC.Audio.sfx('chime');
        this.mayaLines([['', R.after]]);
      } else {
        if (ma) { ma.setTint(0xff9aa8); this.time.delayedCall(700, function () { if (ma.active) ma.clearTint(); }); }
        this.cameras.main.shake(160, 0.003);
        LC.Audio.sfx('desir19');
        this.mayaLines([['', o.why]]);
      }
    },
    mayaFinale: function () {
      var S = this.S, q = S.quests, got = 0;
      story(this, C.end);   // (the rewards first, so closing the story early never loses them)
      S.kepeng += C.reward; S.stats.earned = (S.stats.earned || 0) + C.reward;
      if (!LC.State.count('sisir_maya')) LC.State.add('sisir_maya', 1);
      for (var i = 0; i < 5; i++) if (LC.State.add('benih_sundal', 1)) got++;
      if (got < 5) { q.c19seedOwe = 5 - got; this.toast('Your bag was full: Mak Kiah will leave the other ' + (5 - got) + ' bulbs at your farm.', 'i_benih_sundal'); }
      LC.State.recalc();
      LC.State.save();
      LC.Audio.sfx('cheer');
      this.mayaLines(X.finale);
    },

    // ================================================================ after the chapter
    mayaBaby: function (o) {
      var S = this.S, q = S.quests, im = this.objImgs[o.id], g = S.ghost;
      if (q.c19baby === S.day) { this.toast(X.babyDone, 'buaian19_bayi'); return; }
      q.c19baby = S.day;
      g.joy = Math.min(100, g.joy + 15);
      LC.State.save();
      if (im) { this.mayaPetals(im.x, im.y - 14, 10, 16); this.tweens.add({ targets: im, angle: { from: -8, to: 8 }, duration: 260, yoyo: true, repeat: 3 }); }
      LC.Audio.sfx('chime');
      this.toast(pick(X.baby) + ' (Pelita +15 joy)', 'buaian19_bayi');
    },
    mayaFarmBunga: function () {
      var S = this.S, q = S.quests;
      if (!night(this)) { this.toast(X.farmDay, 'sundal19'); return; }
      if (q.c19pick === S.day) { this.toast(X.farmBunga, 'sundal19'); return; }
      if (!LC.State.add('bunga_sundal', 1)) { this.toast('Your bag is full!'); LC.Audio.sfx('error'); return; }
      q.c19pick = S.day; LC.State.save();
      var im = this.objImgs.f_sundal19;
      if (im) this.mayaPetals(im.x, im.y - 10, 8, 12);
      LC.Audio.sfx('harvest');
      this.toast(X.farmPick, 'i_bunga_sundal');
    },

    // ================================================================ Hilai Maya (H)
    hilaiLeft: function () { return Math.max(0, ((LC.hilaiAt || 0) - Date.now()) / 1000); },
    hilaiKey: function () {
      if (!LC.hasHilai() || this.sleeping || this.leaving || this.cutscene || this.reuniting || (this.ui && this.ui.isBlocking())) return;
      var left = this.hilaiLeft(), K = C.hilai, self = this;
      if (left > 0) { this.toast(X.hilaiRest.replace('{s}', Math.ceil(left)), 'ic_hilai'); LC.Audio.sfx('error'); return; }
      var p = this.player, dark = night(this) || this.A.cave, r = dark ? K.rNight : K.r, dur = dark ? K.fearNight : K.fear;
      var foes = (this.enemies || []).filter(function (e) { return !e.dead && !e.away && e.spr && e.spr.visible && Math.hypot(e.spr.x - p.x, e.spr.y - p.y) < r + e.def.w; });
      LC.hilaiAt = Date.now() + (foes.length ? K.cd : 5) * 1000;
      LC.Audio.sfx('hilai19');
      this.ui.floatText(p.x, p.y - 30, X.hilaiCall, '#f4f0ff');
      // a pale shape with long hair rises behind you for a moment, and the laugh rings outwards
      var ghost = this.add.image(p.x + 10, p.y - 2, 'npc19_maya_0').setOrigin(0.5, 1).setDepth(p.y - 1).setAlpha(0).setTint(0xe8e4ff);
      this.tweens.add({ targets: ghost, alpha: 0.55, y: ghost.y - 8, duration: 350, yoyo: true, hold: 400, onComplete: function () { ghost.destroy(); } });
      this.shockwave(p.x, p.y - 8, r, 0xf4f0ff);
      this.time.delayedCall(140, function () { if (self.player) self.shockwave(p.x, p.y - 8, r * 0.7, 0xc8b8ff); });
      this.mayaPetals(p.x, p.y - 10, 18, 40);
      if (!foes.length) { this.toast(X.hilaiNone, 'ic_hilai'); return; }
      foes.forEach(function (e) {
        e.fearT = e.def.boss ? K.bossFear : dur;
        e.windT = 0; e.strikeT = 0; e.kx = 0; e.ky = 0;
        if (e.hurtT <= 0 && e.stoneT <= 0) e.spr.setTint(0xdce8ff);
        self.ui.floatText(e.spr.x, e.spr.y - e.spr.height - 2, X.hilaiFlee, '#e8e4ff');
      });
    },

    // ================================================================ every frame
    updateMaya: function (time, dt) {
      var self = this, m = this.maya, S = this.S, q = S.quests, s = step(this);
      if (!m) return;
      var blocked = this.ui.isBlocking() || this.leaving || this.sleeping || this.cutscene;
      // the chapter begins on a night after Chapter 18 ends, on the farm or in the kampung
      if (s === 0 && C.ready(S) && !blocked) {
        if (q.c19wait === undefined) { q.c19wait = S.day; LC.State.save(); }
        else if (S.day > q.c19wait && S.minutes >= C.night && (this.area === 'farm' || this.area === 'kampung')) {
          story(this, 1);
          this.refreshWhen();
          this.mayaPetals(this.player.x, this.player.y - 10, 20, 60);
          LC.Audio.sfx('desir19');
          this.toast(X.hookToast, 'i_bunga_sundal');
          this.mayaLines(X.hook);
          return;
        }
      }
      if (m.fight && this.area === 'dalam19' && !this.leaving && !this.sleeping) {
        if (!this.ui.isBlocking()) this.updateMayaFight(m.fight, dt, time);
        else if (m.fight.g && !m.fight.tele && !m.fight.ring) m.fight.g.clear();
      }
      if (blocked) return;
      if (m.cine) { this.mayaCine(); return; }
      // nightfall and dawn change who is out
      var nt = night(this);
      if (nt !== m.wasNight) { m.wasNight = nt; this.refreshWhen(); }
      if (m.vanish) { m.vanish = false; this.refreshWhen(); }
      // the graveyard: drifting petals, and the scent meter while you look for the sisir
      if (this.area === 'kubur19') {
        m.scent = null;
        if (s === 2 && nt) {
          var sp = C.spots[q.c19spot || 0], tx = (sp.x + 0.5) * T, ty = (sp.y + 0.5) * T, d = Math.hypot(this.player.x - tx, this.player.y - 8 - ty);
          var lvl = d < 30 ? 5 : d < 70 ? 4 : d < 125 ? 3 : d < 200 ? 2 : 1;
          m.scent = { lvl: lvl, trend: m.lastD === undefined ? 0 : d < m.lastD - 0.5 ? 1 : d > m.lastD + 0.5 ? -1 : 0 };
          m.lastD = d;
          if ((m.petalT -= dt) <= 0) { m.petalT = 1.4 - lvl * 0.22; this.mayaPetals(this.player.x, this.player.y - 6, lvl, 30); }
        } else if (nt && (m.petalT -= dt) <= 0) {
          m.petalT = 2.5;
          var kb = this.objImgs.kb_kemboja;
          if (kb) this.mayaPetals(kb.x + (Math.random() - 0.5) * 40, kb.y - 50, 2, 30);
        }
      }
      // Kampung Tepian at night, while the kampung is afraid
      if (this.area === 'kampung' && s === 4 && nt) {
        if ((m.cryT -= dt) <= 0) { m.cryT = 16 + Math.random() * 12; this.mayaCry(); }
        if ((m.glimpseT -= dt) <= 0) { m.glimpseT = 22 + Math.random() * 16; this.mayaGlimpse(); }
        var pis = this.objImgs.k_pisang19;
        if (pis && (m.shakeT = (m.shakeT || 0) - dt) <= 0) { m.shakeT = 5 + Math.random() * 4; this.tweens.add({ targets: pis, x: pis.x + 1.5, duration: 70, yoyo: true, repeat: 5 }); }
      }
      // the nursery at night: come near the cradle and she comes
      if (this.area === 'dalam19' && s === 6 && !m.fight && S.minutes >= C.watch) {
        var cr = px({ x: C.dalam.cradle.x + 1, y: C.dalam.cradle.y });
        if (this.player.y < 9 * T && Math.hypot(this.player.x - cr.x, this.player.y - cr.y) < 70) this.mayaScare();
      }
    }
  });

  // her cradle in the nursery is gone once the chapter is over (it is at Mak Kiah's now)
  (LC.AREAS.dalam19.objects || []).forEach(function (o) { if (o.id === 'd_buaian19') o.when = function (S) { return C.step(S) < C.end; }; });
})(window.LC);
