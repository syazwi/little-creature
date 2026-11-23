/* World, part 13 (v2.4): Chapter 6, Puteri Gunung Ledang. Nenek's homecoming and Mak Lampir's sleeping curse, the
 * voyage to Gunung Ledang, the friendly silat duels with Hang Tuah and Hang Jebat (three touches; nobody gets hurt),
 * the areca palms and the bridge of gold and silver, the last fight with Mak Lampir (curse circles, stolen light,
 * Hang Tuah at your side), and waking Nenek. Personal to each player. Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var T = 16, proto = LC.WorldScene.prototype;
  function Q() { return LC.State.s.quests; }
  var FIGHT = { lampir6: 1, kelawar: 1 };

  // ---------------------------------------------------------------- hooks
  var enemyDie = proto.enemyDie;
  proto.enemyDie = function (e) {
    if (e.kind === 'lampir6') return this.lampirDown6(e);
    if (e.kind === 'pendekar_hangtuah' || e.kind === 'pendekar_jebat') { e.hp = e.def.hp; return; }   // (a duel never ends in a fall)
    return enemyDie.call(this, e);
  };
  var createKampong = proto.createKampong;
  proto.createKampong = function () { createKampong.call(this); this.createLedang(); };
  var updateKampong = proto.updateKampong;
  proto.updateKampong = function (time, dt) { updateKampong.call(this, time, dt); this.updateLedang(time, dt); };
  var kampongObjAction = proto.kampongObjAction;
  proto.kampongObjAction = function (o) { var a = this.ledangObjAction(o); return a !== undefined ? a : kampongObjAction.call(this, o); };
  var sailTo = proto.sailTo;
  proto.sailTo = function (to) {
    if (to !== 'ledang') return sailTo.call(this, to);
    var self = this;
    this.ui.say(LC.CH6TEXT.sail, { onDone: function () {
      var q = Q();
      if (LC.ch6Step() === 2) { q.ch6 = 3; q.c6arrive = 1; }   // (before the place is built, so Hang Tuah is there)
      LC.Audio.sfx('splash');
      self.goArea('ledang', self.tilePx(LC.AREAS.ledang.home), 'up');
    } });
  };

  Object.assign(proto, {
    createLedang: function () {
      var self = this, q = Q(), st = LC.ch6Step();
      this.c6 = { tick: 1, duel: null, allyT: 2, spellT: 5, darkT: 13, blinkT: 4, ally: null, dark: null };
      this.c6duel = null;
      if (this.area === 'farm' && st >= 1 && st <= 6) this.placeNenek();
      if (this.area !== 'ledang') return;
      if (q.c6arrive) { delete q.c6arrive; this.time.delayedCall(900, function () { if (!self.leaving) self.ui.say(LC.CH6TEXT.arrive); }); }
      if (q.c6bridge) this.drawBridge();
      if (st === 5 && q.c6fight) this.placeTuahAlly();
    },
    placeNenek: function () {
      var st = LC.ch6Step(), awake = st === 1;
      if (this.k2.things.nenek6) this.kaRemove('nenek6', false);
      var th = this.kaThing('nenek6', LC.C6.home, awake ? 'npc_nenek_0' : 'pangkin_nenek', { type: 'nenek6' }, awake ? 'npc_nenek_idle' : null);
      if (!awake) th.spr.setTint(0xe8e0ff);
      return th;
    },
    drawBridge: function () {   // gold and silver rails along Tukang Leong's bridge
      var g = this.add.graphics().setDepth(12 * T);
      g.fillStyle(0xe9c46a, 1).fillRect(33 * T - 2, 10 * T - 4, 3, 2 * T + 6);
      g.fillStyle(0xd8dce4, 1).fillRect(35 * T - 1, 10 * T - 4, 3, 2 * T + 6);
      g.fillStyle(0xfff3b0, 1).fillRect(33 * T - 2, 10 * T - 4, 3, 2).fillRect(35 * T - 1, 10 * T - 4, 3, 2);
    },
    ledangObjAction: function (o) {
      var self = this, st = LC.ch6Step();
      switch (o.type) {
        case 'nenek6':
          if (st === 1) return { label: 'Talk to Nenek', fn: function () { self.ui.say(self.ch2Lines([{ who: 'nenek', text: LC.CH6TEXT.visit[Math.floor(Math.random() * LC.CH6TEXT.visit.length)] }])); } };
          if (st === 6 && LC.State.count('bunga_ledang')) return { label: 'Wake Nenek with the Bunga Ledang', fn: function () { self.wakeNenek(); } };
          return { label: 'Nenek, asleep', fn: function () { self.ui.say([{ text: LC.CH6TEXT.asleep }]); } };
        case 'pinang6': return { label: 'The young areca palm', fn: function () { self.pickPinang(o.i); } };
        case 'bunga6': return { label: st === 5 && !Q().c6fight ? 'Pick the Bunga Ledang' : 'The Bunga Ledang', fn: function () { self.pickBunga(); } };
        case 'ally6': return { label: 'Hang Tuah', fn: function () { self.toast('Hang Tuah: "Stay light on your feet, friend!"', 'ic_str'); } };
      }
      return undefined;
    },

    updateLedang: function (time, dt) {
      var c = this.c6, S = this.S, q = Q();
      if (!c) return;
      var blocked = this.ui.isBlocking() || this.sleeping || this.leaving || this.cutscene;
      if ((c.tick -= dt) <= 0 && !blocked) {
        c.tick = 1;
        var st = LC.ch6Step();
        if (this.area === 'farm' && st === 0 && (q.ch5 || 0) >= 5 && S.day > (q.ch5day || 0) && S.minutes >= 7 * 60 && S.minutes < 18 * 60) this.c6Home();
        else if (this.area === 'farm' && st === 1 && (S.minutes >= 20 * 60 || S.minutes < 5 * 60 || S.day > (q.c6day || 0))) this.c6Curse();
      }
      if (this.area !== 'ledang') return;
      if (c.duel) this.updateDuel();
      // the last fight: Mak Lampir's spells, and Hang Tuah at your side
      var w = (this.enemies || []).filter(function (e) { return e.kind === 'lampir6' && !e.dead && !e.away; })[0];
      if (!w) return;
      w.light.base = 0.3; w.light.img.setTint(0x8a6aff);
      if (blocked || w.stoneT > 0) return;
      if (c.ally && (c.allyT -= dt) <= 0) { c.allyT = 2.4; this.tuahStrike(); }
      if ((c.blinkT -= dt) <= 0) { c.blinkT = 5 + Math.random() * 2; this.lampirBlink(w); }
      if ((c.spellT -= dt) <= 0) { c.spellT = 6.5; this.curseMark(w); }
      if ((c.darkT -= dt) <= 0) { c.darkT = 16; this.stealLight(w); }
    },

    // ================================================================ Nenek comes home, and the curse
    c6Home: function () {
      var q = Q(), S = this.S, th;
      q.ch6 = 1; q.c6day = S.day;   // (she is here at once; the lines play over it)
      th = this.placeNenek();
      th.spr.setAlpha(0); this.tweens.add({ targets: th.spr, alpha: 1, duration: 900 });
      LC.Audio.sfx('chime'); this.fx.sparkle.explode(16, th.spr.x, th.spr.y - 12);
      this.ui.say(this.ch2Lines(LC.CH6TEXT.home));
    },
    c6Curse: function () {
      var self = this, q = Q(), S = this.S, night = S.day <= (q.c6day || 0), T6 = LC.CH6TEXT;
      q.ch6 = 2;   // (the curse lands at once: closing the lines early cannot undo it)
      if (!LC.State.count('diari_nenek')) LC.State.add('diari_nenek', 1);
      var th = this.placeNenek();
      var bat = this.add.sprite(th.spr.x + 140, th.spr.y - 120, 'kelawar_0').setDepth(9550);
      if (this.anims.exists('kelawar_walk')) bat.play('kelawar_walk');
      this.tweens.add({ targets: bat, x: th.spr.x + 18, y: th.spr.y - 70, duration: 1400, ease: 'Sine.easeOut', onComplete: function () {
        LC.Audio.sfx('wind'); self.fx.smoke.explode(14, th.spr.x, th.spr.y - 8);
        self.tweens.add({ targets: bat, x: th.spr.x - 220, y: th.spr.y - 200, alpha: 0, duration: 2200, delay: 600, ease: 'Sine.easeIn', onComplete: function () { bat.destroy(); } });
      } });
      this.cameras.main.flash(500, 60, 30, 90);
      this.ui.say(this.ch2Lines((night ? T6.night : T6.morning).concat(T6.curse)));
    },
    wakeNenek: function () {
      var self = this, q = Q(), S = this.S, th = this.k2.things.nenek6;
      if (LC.ch6Step() !== 6 || !LC.State.count('bunga_ledang')) return;
      LC.State.remove('bunga_ledang', 1);
      q.ch6 = 7; S.kepeng += LC.C6.reward2; S.stats.earned += LC.C6.reward2;   // (the reward first, as always)
      LC.State.recalc(); S.energy = S.maxEnergy;
      this.doShared('kind', { n: 25 }, function () {});
      this.cutscene = true;
      LC.Audio.sfx('restu');
      if (th) {
        var glow = this.add.image(th.spr.x, th.spr.y - 8, 'glow').setBlendMode(Phaser.BlendModes.ADD).setDepth(9500).setTint(0xffe8a0).setScale(0.3);
        this.tweens.add({ targets: glow, scale: 4, alpha: 0, duration: 2400, ease: 'Sine.easeOut', onComplete: function () { glow.destroy(); } });
        this.fx.sparkle.explode(30, th.spr.x, th.spr.y - 10);
      }
      this.time.delayedCall(900, function () {
        if (self.k2.things.nenek6) self.kaRemove('nenek6', false);
        self.placeVillager('nenek');
        self.ui.say(self.ch2Lines(LC.CH6TEXT.wake), { onDone: function () { self.cutscene = false; LC.Audio.sfx('stage'); } });
      });
    },

    // ================================================================ Gunung Ledang
    pickPinang: function (i) {
      var q = Q(), S = this.S, days = q.c6pinang || (q.c6pinang = {});
      if (LC.ch6Step() !== 4 || !q.c6asked) { this.toast('A young areca palm, its green nuts high above your head.', 'i_pinang_muda'); return; }
      if (days[i] === S.day) { this.toast('You picked this palm today. Try another one, or come back tomorrow.', 'i_pinang_muda'); return; }
      if (!LC.State.canAdd('pinang_muda')) { this.toast('Your bag is full!'); LC.Audio.sfx('error'); return; }
      days[i] = S.day; LC.State.add('pinang_muda', 1);
      LC.Audio.sfx('harvest'); this.bump();
      var n = LC.State.count('pinang_muda');
      this.toast('+1 Pinang Muda (' + Math.min(n, 3) + ' / 3 for the princess).', 'i_pinang_muda');
    },
    pickBunga: function () {
      var self = this, q = Q(), st = LC.ch6Step();
      if (st < 5) { this.toast('The Bunga Ledang, closed tight like a fist. It only opens for someone who comes with gifts.', 'i_bunga_ledang'); return; }
      if (st > 5 || q.c6fight) { this.toast('The Bunga Ledang glows softly, like a little sunrise.', 'i_bunga_ledang'); return; }
      q.c6fight = 1;   // (saved: if you faint, she is waiting when you come back)
      LC.Audio.sfx('wind'); this.cameras.main.shake(400, 0.004);
      this.checkGroups();
      this.placeTuahAlly();
      this.c6.blinkT = 4; this.c6.spellT = 6; this.c6.darkT = 14;
      this.ui.say(this.ch2Lines(LC.CH6TEXT.fight));
    },
    placeTuahAlly: function () {
      var c = this.c6, n = this.npcs.hangtuah;
      if (n) n.spr.setVisible(false);   // (he has run up the path to help)
      if (this.k2.things.ally6) this.kaRemove('ally6', false);
      c.ally = this.kaThing('ally6', LC.C6.ally, 'npc_hangtuah_0', { type: 'ally6' }, 'npc_hangtuah_idle');
      c.ally.name = 'Hang Tuah';
    },
    tuahStrike: function () {
      var self = this, th = this.c6.ally, best = null, bd = 260;
      if (!th) return;
      this.enemies.forEach(function (e) { if (!FIGHT[e.kind] || e.dead || e.away) return; var d = Math.hypot(e.spr.x - th.hx, e.spr.y - th.hy); if (d < bd) { bd = d; best = e; } });
      if (!best) return;
      var e = best, side = th.hx < e.spr.x ? -1 : 1;
      th.spr.setFlipX(side > 0);
      this.tweens.add({ targets: th.spr, x: e.spr.x + side * 14, y: e.spr.y, duration: 240, ease: 'Quad.easeIn', onComplete: function () {
        if (!e.dead && !e.away) {
          var n = e.def.boss ? 2 : 3;
          e.hp -= n; e.hurtT = 0.1; e.spr.setTintFill(0xffffff);
          LC.Audio.sfx('hit'); self.fx.sparkle.explode(5, e.spr.x, e.spr.y - 14);
          self.ui.floatText(e.spr.x, e.spr.y - e.spr.height - 4, 'Tuah! ' + n, '#ffd166');
          if (e.hp <= 0) self.enemyDie(e);
        }
        self.tweens.add({ targets: th.spr, x: th.hx, y: th.hy, duration: 400, ease: 'Quad.easeOut' });
      } });
    },
    lampirBlink: function (w) {
      var p = this.player, t = this.randomFree(LC.C6.garden);
      for (var k = 0; k < 6 && Math.hypot(t.x - p.x, t.y - p.y) < 50; k++) t = this.randomFree(LC.C6.garden);
      LC.Audio.sfx('poof');
      this.fx.smoke.explode(12, w.spr.x, w.spr.y - 14);
      w.spr.setPosition(t.x, t.y); w.tx = t.x; w.ty = t.y; w.kx = 0; w.ky = 0; w.windT = 0;
      this.fx.smoke.explode(12, t.x, t.y - 14);
      if (Math.random() < 0.35) this.ui.floatText(t.x, t.y - 34, 'Heh-heh-heh!', '#c8ffb0');
    },
    curseMark: function (w) {   // a violet circle under your feet: step out before it bursts
      var self = this, p = this.player, mx = p.x, my = p.y - 4, R = 22;
      var g = this.add.graphics().setDepth(my - 2);
      g.lineStyle(2, 0xb07aff, 1).strokeCircle(mx, my, R); g.fillStyle(0x6a3aaa, 0.35).fillCircle(mx, my, R);
      this.tweens.add({ targets: g, alpha: 0.4, duration: 220, yoyo: true, repeat: 2 });
      this.ui.floatText(w.spr.x, w.spr.y - 34, 'Kutuk!', '#d8b0ff');
      this.time.delayedCall(1300, function () {
        g.destroy();
        if (self.leaving || !self.player) return;
        self.fx.smoke.explode(14, mx, my);
        LC.Audio.sfx('poof');
        if (Math.hypot(self.player.x - mx, self.player.y - 4 - my) < R) self.playerHurt(9, { spr: { x: mx, y: my } });
      });
    },
    stealLight: function (w) {   // she drinks the light: everything goes dark for a few seconds
      var self = this, c = this.c6;
      if (c.dark) return;
      c.dark = this.add.rectangle(0, 0, this.W * T, this.H * T, 0x0a0614).setOrigin(0).setDepth(9450).setAlpha(0);
      LC.Audio.sfx('wind');
      this.toast('Mak Lampir drinks the light! Keep your nerve: it comes back.', 'ic_moon');
      this.tweens.add({ targets: c.dark, alpha: 0.6, duration: 500, hold: 2600, yoyo: true, onComplete: function () { if (c.dark) { c.dark.destroy(); c.dark = null; } } });
    },
    lampirDown6: function (e) {
      var self = this, s = e.spr, q = Q(), S = this.S, c = this.c6, puteri = null;
      e.dead = true; e.respawn = 1e9; e.stoneT = 0; e.light.base = 0;
      if (s.anims.isPaused) s.anims.resume();
      if (LC.ch6Step() !== 5) return;
      this.cutscene = true; LC.Audio.setBattle(false);
      q.ch6 = 6; delete q.c6fight; S.kepeng += LC.C6.reward1; S.stats.earned += LC.C6.reward1;   // (first: the reward and the flower)
      if (!LC.State.add('bunga_ledang', 1)) q.c6bungaOwed = 1;
      if (c.dark) { c.dark.destroy(); c.dark = null; }
      this.enemies.forEach(function (x) {
        if (x.kind !== 'kelawar' || x.dead) return;
        x.dead = true; x.respawn = 1e9; x.light.base = 0;
        self.tweens.add({ targets: x.spr, alpha: 0, duration: 700, onComplete: function () { x.spr.setVisible(false); } });
      });
      LC.Audio.sfx('restu'); this.cameras.main.flash(700, 255, 244, 210);
      this.fx.sparkle.explode(40, s.x, s.y - 20);
      s.clearTint().setTint(0xd8d0c8);
      this.time.delayedCall(1200, function () {
        var pt = { x: s.x + 30, y: s.y };
        puteri = self.add.sprite(pt.x, pt.y, 'npc_puteri_ledang_0').setOrigin(0.5, 1).setDepth(9002).setAlpha(0);
        if (self.anims.exists('npc_puteri_ledang_idle')) puteri.play('npc_puteri_ledang_idle');
        var pg = self.add.image(pt.x, pt.y - 10, 'glow').setBlendMode(Phaser.BlendModes.ADD).setDepth(9001).setTint(0xfff0d0).setScale(0.9).setAlpha(0);
        self.tweens.add({ targets: [puteri, pg], alpha: { from: 0, to: 0.9 }, duration: 900 });
        self.ui.say(self.ch2Lines(LC.CH6TEXT.beaten), { onDone: function () {
          self.cutscene = false;
          LC.Audio.sfx('stage');
          if (q.c6bungaOwed) self.toast('Your bag is full: the princess is keeping the Bunga Ledang for you.', 'i_bunga_ledang');
          self.tweens.add({ targets: s, x: s.x - 120, alpha: 0, duration: 2600, onComplete: function () { s.setVisible(false).setAlpha(1).clearTint(); } });
          self.tweens.add({ targets: [puteri, pg], alpha: 0, duration: 1400, delay: 400, onComplete: function () { puteri.destroy(); pg.destroy(); } });
          if (c.ally) { self.kaRemove('ally6', true); c.ally = null; }
          var n = self.npcs.hangtuah; if (n) n.spr.setVisible(n.here !== false);
          self.toast('Hurry home and wake Nenek with the Bunga Ledang!', 'i_bunga_ledang');
        } });
      });
    },

    // ================================================================ the friendly duels (three touches)
    startDuel: function (who) {
      var self = this, c = this.c6, S = this.S, n = this.npcs[who], k = 'pendekar_' + who;
      if (!c || this.c6duel || this.area !== 'ledang' || !n) return;
      this.c6duel = who;
      c.duel = { who: who, hits: 0, taken: 0, hp: S.hp, startHp: S.hp };
      n.spr.setVisible(false); this.solid[n.ty][n.tx] = false; this.objAt[n.ty][n.tx] = null;
      this.enemies.forEach(function (e) { if (e.kind === k) { e.dead = false; e.away = true; } });   // (a second duel starts fresh)
      this.checkGroups();
      var e = this.duelFoe();
      if (e) { e.spr.setPosition(n.spr.x, n.spr.y).setAlpha(1); e.tx = n.spr.x; e.ty = n.spr.y; }
      LC.Audio.sfx('drum');
      this.ui.say(this.ch2Lines([{ who: who, text: LC.CH6TEXT.duelStart[who] }]));
    },
    duelFoe: function () {
      var k = 'pendekar_' + this.c6duel;
      return (this.enemies || []).filter(function (e) { return e.kind === k && !e.dead && !e.away; })[0] || null;
    },
    updateDuel: function () {
      var d = this.c6.duel, S = this.S, e = this.duelFoe();
      if (e && e.hp < e.def.hp) {
        e.hp = e.def.hp; d.hits++;
        LC.Audio.sfx('chime');
        this.ui.floatText(e.spr.x, e.spr.y - 28, 'Touch! ' + d.hits + ' / 3', '#ffd166');
        if (d.hits >= 3) { this.endDuel(true); return; }
      }
      if (S.hp < d.hp) {
        d.taken++; d.hp = S.hp;
        this.ui.floatText(this.player.x, this.player.y - 32, 'Touched! ' + d.taken + ' / 3', '#ffb0b0');
        if (d.taken >= 3) this.endDuel(false);
      } else d.hp = S.hp;
    },
    endDuel: function (win) {
      var self = this, c = this.c6, d = c.duel, who = d.who, e = this.duelFoe(), n = this.npcs[who], q = Q(), S = this.S, T6 = LC.CH6TEXT;
      c.duel = null; this.c6duel = null;
      if (e) { e.dead = true; e.respawn = 1e9; e.light.base = 0; this.fx.smoke.explode(6, e.spr.x, e.spr.y - 10); e.spr.setVisible(false); }
      if (n && n.here !== false) { n.spr.setVisible(true); this.solid[n.ty][n.tx] = true; this.objAt[n.ty][n.tx] = n.o; }
      S.hp = Math.max(S.hp, d.startHp); this.invuln = 0; this.player.setAlpha(1).clearTint();
      LC.Audio.setBattle(false);
      this.checkGroups();
      if (!win) { this.ui.say(this.ch2Lines([{ who: who, text: T6.duelLose[who] }])); return; }
      LC.Audio.sfx('cheer');
      if (who === 'hangtuah') {
        if (LC.ch6Step() === 3) {
          q.ch6 = 4;
          this.placeVillager('puteri_ledang');
          this.placeVillager('jebat');
        }
        this.ui.say(this.ch2Lines(T6.tuahWin), { onDone: function () { self.toast('Climb to the stream at the top of the path: the princess is waiting.', 'ic_glow'); } });
      } else {
        if (!q.c6jebat) { q.c6jebat = 1; LC.State.gainStr(5); S.kepeng += 1500; S.stats.earned += 1500; }
        this.ui.say(this.ch2Lines(T6.jebatWin));
      }
    }
  });
})(window.LC);
