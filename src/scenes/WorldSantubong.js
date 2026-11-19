/* World, part 15 (v2.5): Chapter 7, Puteri Santubong (see santubong.js). The mist on the farm, the voyage to Santubong,
 * the princesses at night (they only walk from dusk to dawn until the chapter ends), the dye plants, the loom and the
 * lesung, Sang Bualang's storm over the village, the sampan to Pulau Satang, the boss (gusts, whirlwinds and lightning;
 * halfway through, the mist of Gunung Ledang calms the storm), and the meeting of the three princesses. Personal to
 * each player. Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var T = 16, proto = LC.WorldScene.prototype, C7 = LC.C7, X = LC.CH7TEXT;
  var STORM = { ribut: 1, camar: 1 };
  var ADD = function () { return Phaser.BlendModes.ADD; };
  function Q() { return LC.State.s.quests; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  // ---------------------------------------------------------------- hooks
  var enemyDie = proto.enemyDie;
  proto.enemyDie = function (e) {
    if (e.kind === 'bualang7') return this.bualangDown(e);
    var r = enemyDie.call(this, e);
    if (STORM[e.kind] && this.area === 'santubong' && LC.ch7Step() === 5 && Q().c7storm) this.stormHit();
    return r;
  };
  var createKampong = proto.createKampong;
  proto.createKampong = function () { createKampong.apply(this, arguments); this.createSantubong(); };
  var updateKampong = proto.updateKampong;
  proto.updateKampong = function (time, dt) { updateKampong.apply(this, arguments); this.updateSantubong(time, dt); };
  var kampongObjAction = proto.kampongObjAction;
  proto.kampongObjAction = function (o) { var a = this.santubongObjAction(o); return a !== undefined ? a : kampongObjAction.call(this, o); };
  var sailTo = proto.sailTo;
  proto.sailTo = function (to) {
    if (to !== 'santubong') return sailTo.call(this, to);
    var self = this, q = Q(), st = LC.ch7Step();
    this.ui.say(st <= 2 ? X.sail : X.sailBack, { onDone: function () {
      if (st === 2) { q.ch7 = 3; q.c7arrive = 1; }                 // (before the place is built, so Mak Dayang is there)
      var fin = LC.ch7Step() === 9 && q.c7aboard;
      if (fin) q.c7finaleGo = 1;
      LC.Audio.sfx('splash');
      self.goArea('santubong', self.tilePx(fin ? { x: 23.5, y: 7 } : LC.AREAS.santubong.home), 'up');
    } });
  };
  // the princesses only walk on their mountains from dusk to dawn (until the end of the chapter)
  var updateFolk = proto.updateFolk;
  proto.updateFolk = function (time, dt) {
    updateFolk.apply(this, arguments);
    if (this.area !== 'santubong') return;
    var self = this, show = LC.ch7Step() >= 10 || LC.isDusk(this.S), hide = !!(this.c7 && this.c7.scene);
    ['santubong', 'sejinjang'].forEach(function (vid) {
      var n = self.npcs[vid], want = show && !hide;
      if (!n) return;
      if (n.here !== want) {
        n.here = want; n.spr.setVisible(want); if (n.glow) n.glow.setVisible(want);
        self.solid[n.ty][n.tx] = want; self.objAt[n.ty][n.tx] = want ? n.o : null;
      }
    });
  };

  Object.assign(proto, {
    createSantubong: function () {
      var self = this, q = Q(), st = LC.ch7Step();
      this.c7 = { tick: 1, gustT: 3, twistT: 5, boltT: 3, calm: false, twisters: [], fx: null, scene: false, said: {} };
      if (this.area === 'santubong') {
        if (q.c7arrive) { delete q.c7arrive; this.time.delayedCall(900, function () { if (!self.leaving) self.ui.say(X.arrive); }); }
        if (q.c7finaleGo) { delete q.c7finaleGo; this.time.delayedCall(700, function () { if (!self.leaving) self.c7Finale(); }); }
        if (st === 5 && q.c7storm) this.stormFx(true);
      }
      if (this.area === 'satang' && st === 7) {
        if (!q.c7boss && !q.c7satang) { q.c7satang = 1; this.time.delayedCall(800, function () { if (!self.leaving) self.ui.say(X.satang); }); }
        if (!q.c7boss) this.stormFx(true);
        else this.bossSetup();
      }
    },

    santubongObjAction: function (o) {
      var self = this, q = Q(), st = LC.ch7Step(), S = this.S, night = LC.isDusk(S);
      switch (o.type) {
        case 'batu7': return { label: 'The meeting stone', fn: function () { self.ui.say([{ text: X.stars }]); } };
        case 'rumah7': return { label: st >= 10 ? 'Nenek\'s childhood house' : 'An old house', fn: function () { self.ui.say([{ text: st >= 10 ? X.houseNew : X.houseOld }]); } };
        case 'perahu7': return { label: o.to === 'satang' ? 'Row the sampan to Pulau Satang' : 'Row back to Santubong', fn: function () { self.rowTo(o.to); } };
        case 'pewarna7': return { label: LC.ITEMS[o.dye].name, fn: function () { self.pickDye(o); } };
        case 'karang7':
          if (st === 7 && !q.c7boss) return { label: 'Face Sang Bualang', fn: function () { self.startBoss(); } };
          return { label: 'The crag', fn: function () { self.toast(st >= 8 ? 'A crag carved by six hundred years of wind. It hums when the breeze is up.' : 'A crag of grey rock. The wind howls around it.', 'ic_angin'); } };
        case 'tenun7': {
          var weaveOk = st === 4 && q.c7askS && !q.c7kain;
          if (weaveOk && night) return { label: 'Weave with Puteri Santubong', fn: function () { self.weave7(); } };
          return { label: 'Puteri Santubong\'s loom', fn: function () {
            if (weaveOk) self.toast('The loom is cold and still. Puteri Santubong only weaves after dusk.', 'i_kain_santubong');
            else self.toast(st >= 10 ? 'Puteri Santubong\'s loom. Blue, yellow and red threads hang from it, waiting for tonight.' : 'An old loom of dark wood, half-swallowed by ferns. A cloth hangs on it, blue and yellow and red, never finished.', 'i_kain_santubong');
          } };
        }
        case 'lesung7': {
          var poundOk = st === 4 && q.c7askJ && !q.c7beras;
          if (poundOk && night) return { label: 'Pound rice with Puteri Sejinjang', fn: function () { self.pound7(); } };
          return { label: 'Puteri Sejinjang\'s lesung', fn: function () {
            if (poundOk) self.toast('The antan leans in the lesung, silent. Puteri Sejinjang only pounds rice after dusk.', 'i_beras_sejinjang');
            else self.toast('A wooden lesung worn smooth by a thousand harvests, with a heavy antan standing in it.', 'i_beras_sejinjang');
          } };
        }
      }
      return undefined;
    },

    updateSantubong: function (time, dt) {
      var c = this.c7, S = this.S, q = Q();
      if (!c) return;
      var blocked = this.ui.isBlocking() || this.sleeping || this.leaving || this.cutscene;
      if ((c.tick -= dt) <= 0 && !blocked) {
        c.tick = 1;
        var st = LC.ch7Step();
        if (this.area === 'farm' && st === 0 && (q.ch6 || 0) >= 7) {
          if (q.c7wait === undefined) q.c7wait = S.day;      // the chapter opens the day after Chapter 6 ends
          else if (S.day > q.c7wait && S.minutes >= 7 * 60 && S.minutes < 17 * 60) this.c7Mist();
        }
      }
      this.updateStormFx(time, dt);
      this.updateTwisters(dt, blocked);
      if (this.area !== 'satang') return;
      var w = (this.enemies || []).filter(function (e) { return e.kind === 'bualang7' && !e.dead && !e.away; })[0];
      if (!w || blocked || w.stoneT > 0) return;
      w.light.base = 0.5; w.light.img.setTint(0x9ad0ff);
      if (!c.calm && w.hp <= w.def.hp / 2) this.calmStorm();
      var B = C7.boss;
      if ((c.gustT -= dt) <= 0) { c.gustT = B.gust.cd + Math.random(); this.bossGust(w); }
      if ((c.twistT -= dt) <= 0) { c.twistT = B.twister.cd + Math.random() * 2; this.bossTwister(w); }
      if (!c.calm && (c.boltT -= dt) <= 0) { c.boltT = B.bolt.cd + Math.random(); this.bossBolt(w); }
    },

    // ================================================================ the mist on the farm
    c7Mist: function () {
      var self = this, q = Q(), p = this.player;
      q.ch7 = 1;   // (first: closing the lines early never loses the chapter)
      LC.Audio.sfx('wind');
      var fogs = [];
      for (var i = 0; i < 10; i++) {
        var f = this.add.image(p.x + (Math.random() - 0.5) * 420, p.y + (Math.random() - 0.5) * 260, 'fog').setDepth(9005).setScale(2 + Math.random() * 1.5).setAlpha(0);
        fogs.push(f); this.tweens.add({ targets: f, alpha: 0.45, x: f.x + 30, duration: 1800, delay: i * 120 });
      }
      var pr = this.add.sprite(p.x + 34, p.y, 'npc_puteri_ledang_0').setOrigin(0.5, 1).setDepth(9006).setAlpha(0);
      if (this.anims.exists('npc_puteri_ledang_idle')) pr.play('npc_puteri_ledang_idle');
      var pg = this.add.image(pr.x, pr.y - 10, 'glow').setBlendMode(ADD()).setDepth(9005).setTint(0xfff0d0).setScale(0.9).setAlpha(0);
      this.tweens.add({ targets: [pr, pg], alpha: { from: 0, to: 0.7 }, duration: 1600, delay: 900 });
      this.ui.say(this.ch2Lines(X.mist), { onDone: function () {
        self.tweens.add({ targets: fogs.concat([pr, pg]), alpha: 0, duration: 1500, onComplete: function () { fogs.forEach(function (f) { f.destroy(); }); pr.destroy(); pg.destroy(); } });
      } });
      this.time.delayedCall(9000, function () { if (pr.active && !self.ui.isBlocking()) self.tweens.add({ targets: [pr, pg], alpha: 0, duration: 1200 }); });
    },

    // ================================================================ Santubong
    rowTo: function (to) {
      var self = this;
      LC.Audio.sfx('splash');
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.time.delayedCall(320, function () { self.goArea(to, self.tilePx(LC.AREAS[to].home), to === 'satang' ? 'up' : 'up'); });
    },
    pickDye: function (o) {
      var q = Q(), S = this.S, days = q.c7dye || (q.c7dye = {}), it = LC.ITEMS[o.dye];
      if (LC.ch7Step() < 4 && LC.ch7Step() < 10) { this.toast(it.name + ': ' + it.desc, it.icon); return; }
      if (days[o.i] === S.day) { this.toast('You picked this one today. Try another, or come back tomorrow.', it.icon); return; }
      if (!LC.State.canAdd(o.dye)) { this.toast('Your bag is full!'); LC.Audio.sfx('error'); return; }
      days[o.i] = S.day; LC.State.add(o.dye, 1);
      LC.Audio.sfx('harvest'); this.bump();
      this.toast('+1 ' + it.name + '.' + (LC.ch7Step() === 4 && !q.c7kain ? ' (For Puteri Santubong\'s cloth: ' + this.dyeList() + ')' : ''), it.icon);
    },
    dyeList: function () {
      return C7.dyes.map(function (d) { return (LC.State.count(d) ? '✓ ' : '· ') + LC.ITEMS[d].name; }).join(', ') + ', ' + (LC.State.count('benang_emas') >= C7.thread ? '✓ ' : '· ') + 'Benang Emas';
    },
    dyesReady: function () { return C7.dyes.every(function (d) { return LC.State.count(d) >= 1; }) && LC.State.count('benang_emas') >= C7.thread; },
    weave7: function () {
      var self = this, q = Q();
      if (!this.dyesReady()) { this.toast('For the cloth: ' + this.dyeList() + '.', 'i_kain_santubong'); LC.Audio.sfx('error'); return; }
      if (!LC.State.canAdd('kain_santubong')) { this.toast('Your bag is full!'); LC.Audio.sfx('error'); return; }
      C7.dyes.forEach(function (d) { LC.State.remove(d, 1); }); LC.State.remove('benang_emas', C7.thread);
      LC.State.add('kain_santubong', 1); q.c7kain = 1;   // (first: the cloth, then the lines)
      LC.Audio.sfx('chime');
      var lo = this.objects.filter(function (o) { return o.type === 'tenun7'; })[0];
      if (lo) this.fx.sparkle.explode(18, (lo.x + 1) * T, (lo.y + 1) * T - 12);
      this.ui.say(this.ch2Lines(X.weave), { onDone: function () { self.afterGift(); } });
    },
    pound7: function () {
      var self = this, q = Q();
      if (LC.State.count('padi') < 3) { this.toast('Puteri Sejinjang needs 3 padi in the lesung. (You have ' + LC.State.count('padi') + '.)', 'i_beras_sejinjang'); LC.Audio.sfx('error'); return; }
      this.ui.openLesung(function (won) {
        if (!won) { self.toast(X.poundMiss, 'i_beras_sejinjang'); return; }
        if (!LC.State.canAdd('beras_sejinjang')) { self.toast('Your bag is full!'); LC.Audio.sfx('error'); return; }
        LC.State.remove('padi', 3); LC.State.add('beras_sejinjang', 1); q.c7beras = 1;
        LC.Audio.sfx('cheer');
        self.ui.say(self.ch2Lines(X.pound), { onDone: function () { self.afterGift(); } });
      });
    },
    afterGift: function () {
      var q = Q();
      if (q.c7kain && q.c7beras) this.toast('Both gifts are ready. Talk to either princess, and carry her words in the Kabus Ledang.', 'i_kabus_ledang');
      else this.toast(q.c7kain ? 'Now help Puteri Sejinjang, at her lesung in the east.' : 'Now help Puteri Santubong, at her loom in the west.', 'ic_glow');
    },
    // the Kabus Ledang carries the true words, and the storm begins
    c7Message: function () {
      var self = this, q = Q();
      q.ch7 = 5; q.c7storm = 1; q.c7kills = 0;   // (first: the storm is saved)
      this.ui.say(this.ch2Lines(X.message), { onDone: function () {
        LC.Audio.sfx('wind'); self.cameras.main.shake(500, 0.006);
        self.stormFx(true);
        self.checkGroups();
      } });
    },
    stormHit: function () {
      var self = this, q = Q();
      q.c7kills = (q.c7kills || 0) + 1;
      if (q.c7kills < C7.stormKills) { this.toast('The storm weakens! (' + q.c7kills + ' / ' + C7.stormKills + ')', 'ic_angin'); return; }
      q.ch7 = 6; delete q.c7storm;
      this.enemies.forEach(function (x) {
        if (!STORM[x.kind] || x.dead) return;
        x.dead = true; x.respawn = 1e9; x.light.base = 0;
        self.fx.smoke.explode(8, x.spr.x, x.spr.y - 8);
        self.tweens.add({ targets: x.spr, alpha: 0, duration: 600, onComplete: function () { x.spr.setVisible(false); } });
      });
      LC.Audio.setBattle(false);
      this.stormFx(false);
      this.placeVillager('serapi');   // (he comes down the river path after the storm)
      this.time.delayedCall(700, function () { if (!self.leaving) self.ui.say(self.ch2Lines(X.stormOver)); });
    },

    // ================================================================ the storm (rain, a dark sky, lightning)
    stormFx: function (on) {
      var c = this.c7;
      if (!on) {
        if (c.fx) { var f = c.fx; c.fx = null; this.tweens.add({ targets: f.dark, alpha: 0, duration: 1600, onComplete: function () { f.dark.destroy(); } }); f.rain.stop(); this.time.delayedCall(2000, function () { f.rain.destroy(); }); }
        return;
      }
      if (c.fx) return;
      var W = this.W * T, H = this.H * T;
      var dark = this.add.rectangle(0, 0, W, H, 0x1a2234).setOrigin(0).setDepth(9440).setAlpha(0);
      this.tweens.add({ targets: dark, alpha: 0.42, duration: 1200 });
      var rain = this.add.particles(0, 0, 'drop', { x: { min: 0, max: W }, y: { min: -20, max: H }, speedY: { min: 260, max: 340 }, speedX: { min: -70, max: -40 },
        lifespan: 700, alpha: { start: 0.7, end: 0.2 }, scale: { start: 1, end: 1 }, frequency: 12, quantity: 2 }).setDepth(9445);
      c.fx = { dark: dark, rain: rain, flashT: 3 + Math.random() * 3 };
    },
    updateStormFx: function (time, dt) {
      var f = this.c7.fx;
      if (!f) return;
      if ((f.flashT -= dt) <= 0) {
        f.flashT = 4 + Math.random() * 5;
        this.cameras.main.flash(160, 220, 230, 255);
        var self = this;
        this.time.delayedCall(300 + Math.random() * 500, function () { if (!self.leaving) LC.Audio.sfx('drum'); });
      }
    },

    // ================================================================ Pulau Satang: Sang Bualang
    startBoss: function () {
      var q = Q();
      q.c7boss = 1;   // (saved: if you faint, he is waiting when you come back)
      LC.Audio.sfx('wind'); this.cameras.main.shake(400, 0.004);
      this.checkGroups();
      this.bossSetup();
      this.ui.say(this.ch2Lines(X.bossStart));
    },
    bossSetup: function () {
      var c = this.c7;
      c.gustT = 3; c.twistT = 5; c.boltT = 2.5; c.calm = false;
      this.stormFx(true);
    },
    bossFoe: function () { return (this.enemies || []).filter(function (e) { return e.kind === 'bualang7' && !e.dead && !e.away; })[0] || null; },
    bossGust: function (w) {   // a ring of wind gathers round him... then bursts outward
      var self = this, G = C7.boss.gust, g = this.add.graphics().setDepth(w.spr.y + 1), o = { t: 0 };
      this.ui.floatText(w.spr.x, w.spr.y - 34, 'Hhhhh...', '#d8ecff');
      this.tweens.add({ targets: o, t: 1, duration: G.warn * 1000, onUpdate: function () {
        if (!w.spr.active) return;
        g.clear(); g.lineStyle(2, 0xd8ecff, 0.4 + 0.5 * o.t);
        var R = G.r * (1 - 0.6 * o.t);
        g.strokeEllipse(w.spr.x, w.spr.y - 6, R * 2, R * 1.2);
        g.lineStyle(1, 0xffffff, 0.6); g.strokeEllipse(w.spr.x, w.spr.y - 6, R * 1.4, R * 0.8);
      }, onComplete: function () {
        g.destroy();
        if (self.leaving || w.dead || w.away || !self.player) return;
        LC.Audio.sfx('wind');
        self.shockwave(w.spr.x, w.spr.y - 6, G.r, 0xd8ecff);
        self.fx.leaf.explode(10, w.spr.x, w.spr.y - 6);
        var p = self.player, dx = p.x - w.spr.x, dy = p.y - w.spr.y, d = Math.hypot(dx, dy) || 1;
        self.ui.floatText(w.spr.x, w.spr.y - 34, 'WHOOSH!', '#ffffff');
        if (d > G.r || self.invuln > 0) return;
        self.playerHurt(G.dmg, w);
        self.shove(dx / d, dy / d, G.push);
      } });
    },
    shove: function (ux, uy, dist) {   // push the player along (stopping at walls)
      var p = this.player, moved = 0;
      while (moved < dist) { var nx = p.x + ux * 4, ny = p.y + uy * 4; if (this.blockedAt(nx, ny)) break; p.x = nx; p.y = ny; moved += 4; }
    },
    bossTwister: function (w) {   // a little whirlwind spins off towards you
      var p = this.player, B = C7.boss.twister, dx = p.x - w.spr.x, dy = p.y - w.spr.y, d = Math.hypot(dx, dy) || 1;
      var spr = this.add.sprite(w.spr.x, w.spr.y, 'puting_0').setOrigin(0.5, 1).setAlpha(0.85).setDepth(w.spr.y);
      spr.play('puting_spin');
      this.c7.twisters.push({ spr: spr, vx: dx / d * B.speed, vy: dy / d * B.speed, life: B.life });
      LC.Audio.sfx('wind');
    },
    updateTwisters: function (dt, blocked) {
      var self = this, c = this.c7, p = this.player, B = C7.boss.twister;
      if (!c.twisters.length) return;
      c.twisters = c.twisters.filter(function (t) {
        if (!t.spr.active) return false;
        if (blocked) return true;
        t.life -= dt;
        // it drifts towards you a little as it goes
        var dx = p.x - t.spr.x, dy = p.y - t.spr.y, d = Math.hypot(dx, dy) || 1;
        t.vx += dx / d * 40 * dt; t.vy += dy / d * 40 * dt;
        var sp = Math.hypot(t.vx, t.vy); if (sp > B.speed) { t.vx *= B.speed / sp; t.vy *= B.speed / sp; }
        t.spr.x += t.vx * dt; t.spr.y += t.vy * dt; t.spr.setDepth(t.spr.y);
        if (d < 12 && self.invuln <= 0 && !self.leaving) {
          self.playerHurt(B.dmg, { spr: t.spr });
          self.shove(t.vx / (sp || 1), t.vy / (sp || 1), 30);
          t.life = 0;
        }
        if (t.life <= 0) { self.tweens.add({ targets: t.spr, alpha: 0, scaleY: 0.3, duration: 250, onComplete: function () { t.spr.destroy(); } }); return false; }
        return true;
      });
    },
    bossBolt: function (w) {   // a circle under your feet: the lightning comes down there
      var self = this, B = C7.boss.bolt, p = this.player, mx = p.x, my = p.y - 4;
      var g = this.add.graphics().setDepth(my - 2);
      g.lineStyle(2, 0xfff3a0, 1).strokeEllipse(mx, my, B.r * 2, B.r * 1.3); g.fillStyle(0xfff3a0, 0.2).fillEllipse(mx, my, B.r * 2, B.r * 1.3);
      this.tweens.add({ targets: g, alpha: 0.4, duration: 200, yoyo: true, repeat: 2 });
      this.time.delayedCall(B.warn * 1000, function () {
        g.destroy();
        if (self.leaving || !self.player || w.dead) return;
        var bolt = self.add.graphics().setDepth(9600);
        bolt.lineStyle(3, 0xffffff, 1);
        var x = mx, y = my - 160; bolt.beginPath(); bolt.moveTo(x, y);
        while (y < my) { y += 20; x = mx + (Math.random() - 0.5) * 18; bolt.lineTo(x, Math.min(y, my)); }
        bolt.strokePath();
        self.cameras.main.flash(120, 255, 250, 220);
        LC.Audio.sfx('hit'); self.fx.sparkle.explode(10, mx, my);
        self.tweens.add({ targets: bolt, alpha: 0, duration: 260, onComplete: function () { bolt.destroy(); } });
        if (Math.hypot(self.player.x - mx, self.player.y - 4 - my) < B.r) self.playerHurt(B.dmg, { spr: { x: mx, y: my } });
      });
    },
    calmStorm: function () {   // halfway through: the mist of Gunung Ledang rolls in across the sea
      var self = this, c = this.c7;
      c.calm = true;
      this.stormFx(false);
      LC.Audio.sfx('chime');
      for (var i = 0; i < 8; i++) {
        var f = this.add.image(Math.random() * this.W * T, Math.random() * this.H * T, 'fog').setDepth(8999).setScale(2 + Math.random()).setAlpha(0);
        this.tweens.add({ targets: f, alpha: 0.35, duration: 2000, delay: i * 150 });
      }
      this.toast('Puteri Gunung Ledang (in the mist): "' + X.calm.text.replace(/^\([^)]*\)\s*/, '') + '" The storm is calm: no more lightning!', 'i_kabus_ledang');
      var w = this.bossFoe();
      if (w) this.ui.floatText(w.spr.x, w.spr.y - 36, 'The mist?!', '#d8ecff');
    },
    bualangDown: function (e) {
      var self = this, s = e.spr, q = Q(), S = this.S, c = this.c7;
      e.dead = true; e.respawn = 1e9; e.stoneT = 0; e.light.base = 0;
      if (s.anims.isPaused) s.anims.resume();
      if (LC.ch7Step() !== 7) return;
      this.cutscene = true; LC.Audio.setBattle(false);
      q.ch7 = 8; delete q.c7boss; S.kepeng += C7.reward1; S.stats.earned += C7.reward1;   // (first: the step and the reward)
      this.stormFx(false);
      c.twisters.forEach(function (t) { t.spr.destroy(); }); c.twisters = [];
      this.enemies.forEach(function (x) {
        if (!STORM[x.kind] || x.dead) return;
        x.dead = true; x.respawn = 1e9; x.light.base = 0;
        self.tweens.add({ targets: x.spr, alpha: 0, duration: 700, onComplete: function () { x.spr.setVisible(false); } });
      });
      LC.Audio.sfx('restu'); this.cameras.main.flash(500, 220, 235, 255);
      this.fx.sparkle.explode(30, s.x, s.y - 16);
      this.tweens.add({ targets: s, scaleY: 0.85, duration: 300, yoyo: true });
      this.time.delayedCall(900, function () {
        self.ui.say(self.ch2Lines(X.beaten), { onDone: function () {
          self.cutscene = false;
          self.tweens.add({ targets: s, alpha: 0, duration: 800, onComplete: function () { s.setVisible(false).setAlpha(1); } });
          self.placeVillager('bualang');
          LC.Audio.sfx('stage');
          self.toast('Sang Bualang is sulking on the rocks by the crag. Maybe somebody should talk to him.', 'ic_angin');
        } });
      });
    },

    // ================================================================ the meeting of the three princesses
    c7Finale: function () {
      var self = this, q = Q(), S = this.S, c = this.c7, p = this.player;
      if (LC.ch7Step() !== 9 || !q.c7aboard) return;
      // (first: everything the chapter gives, so a dialogue closed early can never lose it)
      q.ch7 = 10; delete q.c7aboard; q.bualang = 1; q.pelitaSun = 1;
      ['kabus_ledang', 'kain_santubong', 'beras_sejinjang', 'surat_serapi'].forEach(function (id) { if (LC.State.count(id)) LC.State.remove(id, LC.State.count(id)); });
      S.kepeng += C7.reward2; S.stats.earned += C7.reward2;
      LC.State.recalc();
      this.doShared('kind', { n: 25 }, function () {});
      this.cutscene = true; c.scene = true;
      ['santubong', 'sejinjang', 'serapi'].forEach(function (vid) { var n = self.npcs[vid]; if (n) { n.spr.setVisible(false); if (n.glow) n.glow.setVisible(false); } });
      p.setPosition(23.5 * T, 8 * T); this.dir = 'up';
      this.cameras.main.centerOn(p.x, p.y - 20);
      var cast = [];
      function put(tex, anim, tx, ty, tint, flip) {
        var x = tx * T, y = ty * T, spr = self.add.sprite(x, y, tex).setOrigin(0.5, 1).setDepth(y).setAlpha(0).setFlipX(!!flip);
        if (anim && self.anims.exists(anim)) spr.play(anim);
        var gl = tint ? self.add.image(x, y - 10, 'glow').setBlendMode(ADD()).setDepth(9001).setTint(tint).setScale(0.8).setAlpha(0) : null;
        self.tweens.add({ targets: gl ? [spr, gl] : spr, alpha: { from: 0, to: 0.95 }, duration: 1000, delay: cast.length * 350 });
        cast.push(spr); if (gl) cast.push(gl);
        return spr;
      }
      put('npc_santubong_0', 'npc_santubong_idle', 21, 7, 0xb8d8ff);
      put('npc_sejinjang_0', 'npc_sejinjang_idle', 26.2, 7, 0xffd8b0, true);
      put('npc_serapi_0', 'npc_serapi_idle', 20.6, 9.2);
      put('npc_puteri_ledang_0', 'npc_puteri_ledang_idle', 25.2, 9.4, 0xfff0d0, true);
      var bu = put('npc_bualang_0', 'bualang_fly', 27.4, 9.2, 0xd8f0ff, true);
      var wau = this.add.image(bu.x + 18, bu.y - 60, 'i_wau_bualang').setDepth(9550).setAlpha(0);
      this.tweens.add({ targets: wau, alpha: 1, y: wau.y - 6, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      cast.push(wau);
      var fogs = [];
      for (var i = 0; i < 8; i++) { var f = this.add.image(p.x + (Math.random() - 0.5) * 400, p.y + (Math.random() - 0.5) * 220, 'fog').setDepth(9005).setScale(2 + Math.random()).setAlpha(0); fogs.push(f); this.tweens.add({ targets: f, alpha: 0.3, duration: 2000 }); }
      LC.Audio.sfx('chime');
      var lines = this.ch2Lines(X.finale), skyAt = X.finale.findIndex(function (l) { return l.who === 'kayangan'; }) - 1, pelitaAt = skyAt + 4;
      c.sky = null;
      this.ui.say(lines, {
        onLine: function (i) {   // light pours down when Raja Kayangan speaks, and a thread of it winds round Pelita
          if (i === skyAt && !c.sky) {
            c.sky = self.add.image(24 * T, 3 * T, 'glow').setBlendMode(ADD()).setDepth(9450).setTint(0xffe8a0).setScale(0.8, 6).setAlpha(0);
            self.tweens.add({ targets: c.sky, alpha: 0.4, scaleX: 1.8, duration: 1500 });
            self.cameras.main.flash(500, 255, 244, 200);
            LC.Audio.sfx('restu');
          }
          if (i === pelitaAt && self.ghost) { self.fx.sparkle.explode(30, self.ghost.x, self.ghost.y - 8); LC.Audio.sfx('chime'); }
        },
        onDone: function () { self.finaleEnd(cast, fogs); }
      });
      // (if the dialogue is closed some other way, the scene still ends)
      var watch = this.time.addEvent({ delay: 500, loop: true, callback: function () { if (!c.scene) { watch.remove(); return; } if (!self.ui.isBlocking()) { watch.remove(); self.finaleEnd(cast, fogs); } } });
    },
    finaleEnd: function (cast, fogs) {
      var self = this, c = this.c7, sky = c.sky;
      if (!c.scene) return;
      c.scene = false; this.cutscene = false; c.sky = null;
      if (this.ghost) this.fx.sparkle.explode(24, this.ghost.x, this.ghost.y - 8);
      this.tweens.add({ targets: cast.concat(fogs, sky ? [sky] : []), alpha: 0, duration: 1600, onComplete: function () {
        cast.concat(fogs, sky ? [sky] : []).forEach(function (o) { o.destroy(); });
      } });
      ['santubong', 'sejinjang', 'serapi'].forEach(function (vid) { var n = self.npcs[vid]; if (n && n.here !== false) { n.spr.setVisible(true); if (n.glow) n.glow.setVisible(true); } });
      this.placeVillager('bualang');
      LC.Audio.sfx('stage');
      this.ui.drawSkills && this.ui.drawSkills();
    }
  });
})(window.LC);
