/* World, part 12 (v2.3): Chapter 5, Bayang Hitam. The night the lamps go out, the shadows on the farm, Pelita growing
 * pale, the voyages on the Majapahit jong (Java, Pulau Kelam, home), the king and the damar tree, the four stone
 * torches of Pulau Kelam, Si Kelam, and Pelita's new form. Personal to each player. Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var T = 16, proto = LC.WorldScene.prototype;
  function Q() { return LC.State.s.quests; }
  function isNight(S) { return S.minutes >= 19 * 60 || S.minutes < 5 * 60; }

  // ---------------------------------------------------------------- hooks
  var enemyDie = proto.enemyDie;
  proto.enemyDie = function (e) {
    if (e.kind === 'kelam') return this.shadowDown(e);
    if (e.kind === 'sikelam') return this.kelamDown(e);
    return enemyDie.call(this, e);
  };
  var createKampong = proto.createKampong;
  proto.createKampong = function () { createKampong.call(this); this.createBayang(); };
  var updateKampong = proto.updateKampong;
  proto.updateKampong = function (time, dt) { updateKampong.call(this, time, dt); this.updateBayang(time, dt); };
  var kampongObjAction = proto.kampongObjAction;
  proto.kampongObjAction = function (o) { var a = this.bayangObjAction(o); return a !== undefined ? a : kampongObjAction.call(this, o); };
  var ch2Lines = proto.ch2Lines;   // (Pelita's lines keep their expression)
  proto.ch2Lines = function (arr) { return ch2Lines.call(this, arr).map(function (l, i) { if (arr[i].expr) l.expr = arr[i].expr; return l; }); };
  // while the shadow is loose Pelita is pale and small; afterwards it shines like the full moon
  var updateGhost = proto.updateGhost;
  proto.updateGhost = function (time, dt, blocked) {
    updateGhost.call(this, time, dt, blocked);
    if (!this.ghost || !this.ghost.visible) return;
    if (LC.shadowLoose()) {
      this.ghost.setAlpha(this.ghost.alpha * (0.5 + 0.08 * Math.sin(time / 160)));
      this.ghostGlow.setScale(this.ghostGlow.scaleX * 0.55).setAlpha(this.ghostGlow.alpha * 0.6).setTint(0x9a90c8);
    } else if (LC.purnama()) {
      this.ghost.setAlpha(Math.max(this.ghost.alpha, 0.94));
      this.ghostGlow.setScale(this.ghostGlow.scaleX * 1.2).setTint(0xfff0c0);
    }
  };
  // ...and the torches of the farm and the kampung will not stay lit (the guard lamps keep the farm's burning)
  var updateLighting = proto.updateLighting;
  proto.updateLighting = function (time, dt) {
    updateLighting.call(this, time, dt);
    if (!LC.shadowLoose() || !(this.area === 'farm' || this.area === 'kampung') || (this.area === 'farm' && Q().c5lamps)) return;
    this.torches.forEach(function (t) { t.spr.setTexture('torch_off'); if (t.light) t.light.img.setAlpha(0); });
    if (this.spiritLight) this.spiritLight.img.setAlpha(this.spiritLight.img.alpha * 0.3);
  };
  // the shadows drink the water from the crops at night, unless Tukang Leong's guard lamps are burning
  var endDay = LC.State.endDay;
  LC.State.endDay = function (fainted) {
    var s = this.s, q = s.quests || {}, wilted = 0;
    if ((q.ch5 || 0) >= 2 && (q.ch5 || 0) <= 4 && !q.c5lamps) {
      var wet = Object.keys(s.tiles).filter(function (k) { var t = s.tiles[k], d = t.crop && LC.CROPS[t.crop.id]; return d && t.wet && !d.paddy && t.crop.g < d.days; });
      for (var i = 0; i < 2 && wet.length; i++) { var k = wet.splice(Math.floor(Math.random() * wet.length), 1)[0]; s.tiles[k].wet = false; wilted++; }
    }
    var sum = endDay.apply(this, arguments);
    if (wilted && sum && sum.lines) sum.lines.push(LC.CH5TEXT.wilt.replace('{n}', wilted === 1 ? 'one crop' : wilted + ' crops'));
    return sum;
  };

  Object.assign(proto, {
    createBayang: function () {
      var self = this, q = Q(), st = LC.ch5Step();
      this.c5 = { tick: 1, boss: null, shieldT: 0 };
      if (this.area === 'jawa') {
        this.kaThing('raja5', { x: 22, y: 7 }, 'npc_raden_0', { type: 'raja5' }, 'npc_raden_idle');
        if (q.c5arrive) {   // (the first landing: the step moved on before the place was built, so Empu Lintang is here)
          delete q.c5arrive;
          this.time.delayedCall(900, function () { if (!self.leaving) self.ui.say(LC.CH5TEXT.arrive); });
        }
      }
      if (this.area === 'kelam') {
        var lit = q.c5obor || {};
        LC.C5.obor.forEach(function (t, i) { if (lit[i]) self.oborFlame(i, false); });
        if (st === 4) {
          var kb = this.kaThing('kebo5', { x: 19, y: 5 }, 'laksamana_0', { type: 'kebo5' });
          kb.spr.setTint(0x5a4a7a);
          this.tweens.add({ targets: kb.spr, x: kb.hx + 1, duration: 120, yoyo: true, repeat: -1 });
          this.time.delayedCall(800, function () { if (!self.leaving) self.ui.say(self.ch2Lines(LC.CH5TEXT.island)); });
        }
      }
    },
    updateBayang: function (time, dt) {
      var c = this.c5, S = this.S, q = Q();
      if (!c) return;
      var blocked = this.ui.isBlocking() || this.sleeping || this.leaving || this.cutscene;
      if ((c.tick -= dt) <= 0 && !blocked) {
        c.tick = 1;
        if (this.area === 'farm' && LC.ch5Step() === 0 && (q.ch4 || 0) >= 4 && S.day > (q.ch4day || 0) && isNight(S)) this.c5Dark();
      }
      // Si Kelam cannot be hurt until all four stone torches burn
      if (this.area !== 'kelam') return;
      if (!c.boss && this.enemies) c.boss = this.enemies.filter(function (e) { return e.kind === 'sikelam'; })[0] || null;
      var b = c.boss;
      if (!b || b.dead || b.away) return;
      var open = this.litCount() >= LC.C5.obor.length;
      b.spr.setAlpha(open ? 1 : 0.72);
      if (!open && b.hp < b.def.hp) {
        b.hp = b.def.hp;
        if (time > c.shieldT) {
          c.shieldT = time + 2500;
          this.ui.floatText(b.spr.x, b.spr.y - 60, 'It passes through!', '#b8a8ff');
          this.toast('Your blade passes straight through the shadow! Light the ' + LC.C5.obor.length + ' stone torches first (' + this.litCount() + ' lit).', 'ic_moon');
        }
      }
    },
    bayangObjAction: function (o) {
      var self = this, st = LC.ch5Step(), q = Q();
      switch (o.type) {
        case 'jong_dagang': if (st < 2) return undefined; return { label: 'The Majapahit jong', fn: function () { self.ui.openJong5('farm'); } };
        case 'jong5': return { label: 'The Majapahit jong', fn: function () { self.ui.openJong5(self.area); } };
        case 'pasar5': return { label: 'Shop at the market stall', fn: function () { self.ui.openPasar5(); } };
        case 'obor5': return { label: (q.c5obor || {})[o.i] ? 'A stone torch' : 'Light the stone torch', fn: function () { self.lightObor(o.i); } };
        case 'damar': return { label: 'The old damar tree', fn: function () { self.tapDamar(); } };
        case 'raja5': return { label: 'Talk to the King of Majapahit', fn: function () { self.talkKing5(); } };
        case 'kebo5': return { label: 'Kebo Taruna', fn: function () { self.ui.say(self.ch2Lines([{ who: 'laksamana', text: '...the torches... light the torches, and it cannot hide...' }])); } };
      }
      return undefined;
    },

    // ================================================================ the night the lamps go out
    c5Dark: function () {
      var q = Q();
      q.ch5 = 1;   // (the shadows come at once; the lines play over them)
      LC.Audio.sfx('wind');
      this.cameras.main.flash(600, 10, 6, 24);
      this.cameras.main.shake(300, 0.002);
      this.checkGroups();
      this.ui.say(this.ch2Lines(LC.CH5TEXT.dark));
    },
    shadowDown: function (e) {
      var self = this, s = e.spr, q = Q();
      e.dead = true; e.stoneT = 0; e.light.base = 0;
      if (s.anims.isPaused) s.anims.resume();
      s.clearTint();
      LC.Audio.sfx('poof');
      this.fx.smoke.explode(10, s.x, s.y - 10); this.fx.sparkle.explode(6, s.x, s.y - 10);
      this.tweens.add({ targets: s, alpha: 0, scaleY: 0.2, duration: 600, onComplete: function () { s.setVisible(false).setAlpha(1).setScale(1); } });
      if (this.area !== 'farm' || LC.ch5Step() !== 1) { e.respawn = 16 + Math.random() * 10; return; }   // (on Pulau Kelam they keep coming)
      e.respawn = 1e9;
      var all = this.enemies.filter(function (x) { return x.kind === 'kelam'; }), down = all.filter(function (x) { return x.dead; }).length;
      if (down < all.length) { this.toast('The shadow shatters into cold sparks. (' + down + ' / ' + all.length + ')', 'ic_moon'); return; }
      q.ch5 = 2;
      LC.State.add('serpihan_kelam', 1);
      this.time.delayedCall(900, function () { if (!self.leaving) self.ui.say(self.ch2Lines(LC.CH5TEXT.gone)); });
    },

    // ================================================================ the voyages
    sailTo: function (to) {
      var self = this, T5 = LC.CH5TEXT;
      var lines = to === 'jawa' ? T5.sailJava : to === 'kelam' ? T5.sailKelam : [{ text: 'The jong turns for home. The Naga swims alongside, and before long Nenek\'s jetty comes into view.' }];
      this.ui.say(lines, { onDone: function () {
        var q = Q();
        if (to === 'jawa' && LC.ch5Step() === 2) { q.ch5 = 3; q.c5arrive = 1; }
        LC.Audio.sfx('splash');
        var spot = to === 'farm' ? { x: 21, y: 27 } : LC.AREAS[to].home;
        self.goArea(to, self.tilePx(spot), 'up');
      } });
    },

    // ================================================================ Java
    talkKing5: function () {
      var q = Q(), st = LC.ch5Step(), T5 = LC.CH5TEXT;
      if (st === 3 && !q.c5king) { q.c5king = 1; this.ui.say(this.ch2Lines(T5.king)); return; }
      var line = st === 3 ? 'Empu Lintang\'s workshop is past the great pool, to the east. Whatever he needs, the court will pay.'
        : st === 4 ? 'The lamp is ready? Then the court\'s best wishes sail with you, friend. Bring that little light home safe.'
        : 'Kebo Taruna carries crates at the harbour now. I think the work is good for him. Thank you, friend. Majapahit will not forget.';
      this.ui.say(this.ch2Lines([{ who: 'raden', text: line }]));
    },
    tapDamar: function () {
      var q = Q(), S = this.S, st = LC.ch5Step(), spr = this.objImgs.f_damar;
      if (st < 3 || (st === 3 && !q.c5empu)) { this.toast('An old damar tree. Golden resin glistens in the cracks of its bark.', 'i_damar'); return; }
      if (q.c5damarDay === S.day) { this.toast('You tapped the damar tree today. Let it rest until tomorrow.', 'i_damar'); return; }
      if (!LC.State.canAdd('damar')) { this.toast('Your bag is full!'); LC.Audio.sfx('error'); return; }
      q.c5damarDay = S.day; LC.State.add('damar', 2);
      LC.Audio.sfx('harvest'); this.bump();
      if (spr) this.fx.leaf.explode(8, spr.x, spr.y - 20);
      this.toast('+2 Damar. Golden resin oozes from a notch in the bark. It smells of pine and honey.', 'i_damar');
    },

    // ================================================================ Pulau Kelam
    litCount: function () { return Object.keys(Q().c5obor || {}).length; },
    lightObor: function (i) {
      var q = Q(), n;
      if ((q.c5obor || {})[i]) { this.toast('The stone torch burns bright and steady.', 'ic_glow'); return; }
      if (LC.ch5Step() !== 4) { this.toast('An old stone torch, cold for a very long time.', 'ic_moon'); return; }
      if (!LC.State.count('pelita_purnama')) { this.toast('You need a flame the shadow cannot drink: the Pelita Purnama from Empu Lintang.', 'ic_moon'); LC.Audio.sfx('error'); return; }
      (q.c5obor = q.c5obor || {})[i] = 1;
      this.oborFlame(i, true);
      n = this.litCount();
      if (n < LC.C5.obor.length) { this.toast('The stone torch blazes up! (' + n + ' / ' + LC.C5.obor.length + ')', 'ic_glow'); return; }
      LC.Audio.sfx('restu'); this.cameras.main.flash(400, 255, 230, 170);
      if (this.c5.boss) this.c5.boss.spr.setScale(0.85);
      this.ui.say(LC.CH5TEXT.lit);
    },
    oborFlame: function (i, fresh) {
      var t = LC.C5.obor[i], x = (t.x + 0.5) * T, y = (t.y + 1) * T - 20;
      this.add.sprite(x, y, 'api_0').setOrigin(0.5, 1).setDepth((t.y + 1) * T + 1).play('api_burn').setScale(0.8);
      this.addLight(x, y - 6, 0xffc060, 2.6, true);
      if (fresh) { LC.Audio.sfx('chime'); this.fx.sparkle.explode(14, x, y - 8); }
    },
    kelamDown: function (e) {
      var self = this, s = e.spr, q = Q(), S = this.S, kebo = this.k2.things.kebo5;
      e.dead = true; e.respawn = 1e9; e.stoneT = 0; e.light.base = 0;
      if (s.anims.isPaused) s.anims.resume();
      if (q.ch5 !== 4) return;
      this.cutscene = true; LC.Audio.setBattle(false);
      // the reward comes first, so a dialogue closed early can never lose it
      q.ch5 = 5; S.kepeng += LC.C5.reward; S.stats.earned += LC.C5.reward;
      LC.State.recalc(); S.hp = S.maxHp;
      this.doShared('kind', { n: 25 }, function () {});
      this.enemies.forEach(function (x) {
        if (x.kind !== 'kelam' || x.dead) return;
        x.dead = true; x.respawn = 1e9; x.light.base = 0;
        self.tweens.add({ targets: x.spr, alpha: 0, duration: 700, onComplete: function () { x.spr.setVisible(false); } });
      });
      LC.Audio.sfx('restu'); LC.Audio.sfx('poof');
      this.cameras.main.flash(900, 255, 244, 200);
      this.fx.sparkle.explode(60, s.x, s.y - 24); this.fx.smoke.explode(18, s.x, s.y - 24);
      s.clearTint();
      this.tweens.add({ targets: s, alpha: 0, scaleX: 1.8, scaleY: 1.8, duration: 1100, onComplete: function () { s.setVisible(false).setScale(1).setAlpha(1); } });
      var gp = this.ghostHere ? { x: this.ghost.x, y: this.ghost.y } : { x: this.player.x, y: this.player.y - 22 };
      var moon = this.add.image(gp.x, gp.y, 'glow').setBlendMode(Phaser.BlendModes.ADD).setDepth(9500).setTint(0xfff2c0).setScale(0.3).setAlpha(0.95);
      this.tweens.add({ targets: moon, scale: 7, alpha: 0, duration: 2400, ease: 'Sine.easeOut', onComplete: function () { moon.destroy(); } });
      this.time.delayedCall(1300, function () {
        if (kebo) { self.tweens.killTweensOf(kebo.spr); kebo.spr.setPosition(kebo.hx, kebo.hy).clearTint(); }
        self.ui.say(self.ch2Lines(LC.CH5TEXT.finale), { onDone: function () {
          self.cutscene = false;
          LC.Audio.sfx('stage');
          self.time.delayedCall(700, function () { if (!self.leaving) self.sailTo('farm'); });
        } });
      });
    }
  });
})(window.LC);
