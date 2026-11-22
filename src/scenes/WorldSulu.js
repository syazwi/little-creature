/* World, part 22 (v3.3): Chapter 11, Bulan dan Mutiara, Part 1 (see sulu.js).
 *  - The dark moon over the farm: an eclipse, the Bakunawa rising from the river, a vinta racing upriver with its gongs.
 *  - Lupah Sug: the vinta at the jetty (the helm), the dive to the reef and the old sunken boat (the batu berani).
 *  - Laut Sulu: you captain the vinta. It turns towards where you point and runs fastest with the wind behind it. Reefs
 *    bump the hull, whirlpools spin you, fog hides everything but the pedoman, squalls bring rain, lightning and gusts,
 *    and the dark water round Pulau Bulan swallows the stars. Wind streaks, whitecaps, wake, spray and sea birds.
 *    The chart's three legs (north-east, east, south) lead to Pulau Bulan.
 *  - Pulau Bulan: the Bakunawa circles the island under the water, lunges at you near the shore and raises water spouts.
 *    Strike all three agung while they still ring and it rises, dazed: only then can it be struck. Beaten, it spits out the
 *    Mutiara Kembar, and Pelita gives it a little light of its own.
 * Personal to each player (like the other chapters' scenes). Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var T = 16, proto = LC.WorldScene.prototype, C = LC.C11, X = LC.CH11TEXT, B = LC.C11.boss;
  var ADD = function () { return Phaser.BlendModes.ADD; };
  function Q() { return LC.State.s.quests; }
  function st() { return LC.ch11Step(); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function wrapA(a) { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; }
  function lerpC(a, b, t) { t = clamp(t, 0, 1); var r = (a >> 16 & 255) + ((b >> 16 & 255) - (a >> 16 & 255)) * t, g = (a >> 8 & 255) + ((b >> 8 & 255) - (a >> 8 & 255)) * t, bl = (a & 255) + ((b & 255) - (a & 255)) * t; return (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(bl); }
  function inBox(x, y, b) { return x >= b.x0 * T && x <= (b.x1 + 1) * T && y >= b.y0 * T && y <= (b.y1 + 1) * T; }
  function boxDepth(x, y, b) {   // 0 at the edge of a zone, 1 a few tiles in
    if (!inBox(x, y, b)) return 0;
    var d = Math.min(x - b.x0 * T, (b.x1 + 1) * T - x, y - b.y0 * T, (b.y1 + 1) * T - y);
    return clamp(d / (5 * T), 0, 1);
  }
  var WATER = { o: 1, h: 1 };
  var DIRS = ['Timur', 'Tenggara', 'Selatan', 'Barat Daya', 'Barat', 'Barat Laut', 'Utara', 'Timur Laut'];
  LC.compassName = function (ang) { var k = Math.round(wrapA(ang) / (Math.PI / 4)); return DIRS[(k + 8) % 8]; };

  // ---------------------------------------------------------------- sounds for this chapter
  var sfx = LC.Audio.sfx;
  LC.Audio.sfx = function (name) {
    var A = LC.Audio;
    if (!/11$/.test(name)) return sfx.apply(this, arguments);
    if (!A.ctx || A.ctx.state !== 'running' || !A.vol.sfx) return;
    var t = A.ctx.currentTime + 0.01;
    switch (name) {
      case 'agung11': A.gong(A.freq(-12), t, 3.6, 0.34); A.gong(A.freq(-5), t, 2.4, 0.1); A.noise(t, 0.05, 0.15, 'lowpass', 500); break;
      case 'gongbeat11': A.gong(A.freq(-9), t, 1.4, 0.24); A.gong(A.freq(-7), t + 0.32, 1.2, 0.2); A.tone(t, 'sine', 140, 60, 0.2, 0.2); break;
      case 'roar11': A.noise(t, 1.3, 0.34, 'lowpass', 420, 160); A.tone(t, 'sawtooth', 92, 52, 1.2, 0.1); A.tone(t + 0.1, 'sine', 70, 40, 1.1, 0.22); break;
      case 'wave11': A.noise(t, 1.1, 0.12, 'bandpass', 700, 260); break;
      case 'thunder11': A.noise(t, 2.2, 0.42, 'lowpass', 260, 90); A.tone(t, 'sine', 64, 34, 1.4, 0.28); break;
      case 'creak11': A.tone(t, 'triangle', 190, 150, 0.22, 0.04); A.tone(t + 0.18, 'triangle', 170, 135, 0.2, 0.03); break;
      case 'bump11': A.tone(t, 'sine', 110, 50, 0.3, 0.32); A.noise(t, 0.4, 0.22, 'bandpass', 600, 300); break;
      case 'spout11': A.noise(t, 0.7, 0.26, 'bandpass', 1100, 500); A.noise(t + 0.05, 0.5, 0.12, 'highpass', 3000); break;
    }
  };

  // ---------------------------------------------------------------- hooks
  var createKampong = proto.createKampong;
  proto.createKampong = function () { createKampong.apply(this, arguments); this.createSulu(); };
  var updateKampong = proto.updateKampong;
  proto.updateKampong = function (time, dt) { updateKampong.apply(this, arguments); this.updateSulu(time, dt); };
  var objectAction = proto.objectAction;
  proto.objectAction = function (o, sl, it, isFood) { var a = this.suluObjAction(o); return a !== undefined ? a : objectAction.apply(this, arguments); };
  var sailTo = proto.sailTo;
  proto.sailTo = function (to) {
    if (to !== 'sulu') return sailTo.call(this, to);
    LC.Audio.sfx('splash'); this.goArea('sulu', this.tilePx(LC.AREAS.sulu.home), 'up');
  };
  var updatePlayer = proto.updatePlayer;
  proto.updatePlayer = function (dt, blocked) { if (this.A.sailing && this.c11 && this.c11.ship) return this.updateShip(dt, blocked); return updatePlayer.apply(this, arguments); };
  var getAction = proto.getAction;
  proto.getAction = function () { if (this.A.sailing) return this.shipAction(); return getAction.apply(this, arguments); };
  var updateGhost = proto.updateGhost;
  proto.updateGhost = function () {
    updateGhost.apply(this, arguments);
    if (this.c11 && this.c11.hideGhost) [this.ghost, this.ghostGlow, this.ghostShadow, this.bubble].forEach(function (o) { if (o) o.setVisible(false); });
  };
  // the sky: the dark moon over the farm, the moonlit island, the fog, the squall and the black water at sea
  var skyColor = proto.skyColor;
  proto.skyColor = function (m) {
    var col = skyColor.call(this, m), c = this.c11;
    if (this.area === 'bulan') return 0x46508a;   // (always a moonlit night on the island with no shadow)
    if (!c) return col;
    if (c.eclipseF > 0) col = lerpC(col, 0x3a1210, c.eclipseF * 0.85);
    if (c.ship) {
      var p = this.player;
      col = lerpC(col, 0xb8c0c8, boxDepth(p.x, p.y, C.fog) * 0.35);
      col = lerpC(col, 0x6a7488, boxDepth(p.x, p.y, C.storm) * 0.6);
      col = lerpC(col, 0x2a3256, boxDepth(p.x, p.y, C.dark) * 0.8);
    }
    return col;
  };
  var groupOn = proto.groupOn;
  proto.groupOn = function (g) { return g.kind === 'bakunawa11' ? true : groupOn.call(this, g); };
  var enemyDie = proto.enemyDie;
  proto.enemyDie = function (e) { return e.kind === 'bakunawa11' ? this.bakunawaDown(e) : enemyDie.apply(this, arguments); };

  Object.assign(proto, {
    createSulu: function () {
      var self = this, q = Q(), s = st(), a = this.area;
      var c = this.c11 = { tick: 1, eclipseF: 0, hideGhost: false, ship: null, boss: null, imgs: [], arani: null };
      if (a === 'farm' && s === 1) this.jettyCrew11();
      if (a === 'sulu' && s >= 2 && !q.c11arrive) {
        q.c11arrive = 1;
        this.time.delayedCall(900, function () { if (!self.leaving) self.ui.say(self.ch2Lines(X.arrive)); });
      }
      if (a === 'lautsulu') this.setupSea();
      if (a === 'bulan') this.setupBulan();
      void c;
    },

    updateSulu: function (time, dt) {
      var c = this.c11, S = this.S, q = Q();
      if (!c || !this.player) return;
      var blocked = this.ui.isBlocking() || this.sleeping || this.leaving || this.cutscene;
      if ((c.tick -= dt) <= 0 && !blocked) {
        c.tick = 1;
        if (this.area === 'farm' && st() === 0 && (q.ch10 || 0) >= 8 && !S.guest) {
          if (q.c11wait === undefined) q.c11wait = S.day;           // the chapter opens the night after Chapter 10 ends
          else if (S.day > q.c11wait && S.minutes >= C.hookFrom) this.c11Hook();
        }
      }
      if (c.ship) this.updateSea(time, dt, blocked);
      if (c.boss) this.updateBoss(time, dt, blocked);
      if (c.friend) this.updateFriend(time, dt);
      if (c.serpent) this.updateSerpent(time);
    },

    suluObjAction: function (o) {
      var self = this, q = Q(), s = st();
      switch (o.type) {
        case 'arani11': return s !== 1 ? null : { label: 'Talk to Mbo\' Arani', fn: function () {
          self.ui.say(self.ch2Lines([{ who: 'arani', text: 'The tide is right, the wind is right, and Dinda has packed enough food for a month. Shall we go to Lupah Sug?' }]), { choices: [
            { label: 'Sail to Sulu', fn: function () { q.ch11 = 2; self.ui.say(self.ch2Lines(X.aboard), { onDone: function () { LC.Audio.sfx('splash'); self.goArea('sulu', self.tilePx(LC.AREAS.sulu.home), 'up'); } }); } },
            { label: 'Not yet', fn: function () { self.ui.say(self.ch2Lines(X.notYet)); } }
          ] });
        } };
        case 'helm11':
          if (this.area === 'bulan') return { label: 'Set sail', fn: function () { self.goArea('lautsulu', self.tilePx({ x: C.bulan.x, y: C.bulan.y - 2 }), 'up'); } };
          if (s < 4) return { label: 'The vinta', fn: function () { self.toast(s < 2 ? 'A vinta with sails like a rainbow.' : 'The Sultan\'s vinta. Mbo\' Arani will not let anybody take the helm until she is ready (and neither will Dinda).', 'i_pedoman'); } };
          return { label: 'Take the helm of the vinta', fn: function () { LC.Audio.sfx('creak11'); self.goArea('lautsulu', self.tilePx(LC.AREAS.lautsulu.home), 'right'); } };
        case 'selam11': return { label: 'Dive into the lagoon', fn: function () {
          if (!LC.State.friend('naga')) { self.toast('You would need the Naga\'s blessing to breathe down there.', 'ic_moon'); LC.Audio.sfx('error'); return; }
          LC.Audio.sfx('dive'); self.goArea('terumbu', self.tilePx(LC.AREAS.terumbu.home), 'down');
        } };
        case 'naik11': return { label: 'Swim up to the village', fn: function () { LC.Audio.sfx('water'); self.goArea('sulu', self.tilePx({ x: 50.5, y: 36.4 }), 'down'); } };
        case 'karam11': return { label: 'The old sunken boat', fn: function () {
          if (s === 3 && q.c11dive && !q.c11berani && !LC.State.count('batu_berani')) {
            if (!LC.State.canAdd('batu_berani')) { self.toast('Your bag is full!'); LC.Audio.sfx('error'); return; }
            q.c11berani = 1; LC.State.add('batu_berani', 1); LC.Audio.sfx('chime'); self.fx.sparkle.explode(10, (o.x + 1.5) * T, (o.y + 1) * T);
            self.ui.say([{ text: X.karam.text }]);
            self.toast('+1 Batu Berani. Take it to Mbo\' Arani.', 'i_batu_berani');
          } else self.toast(X.karamDone, 'ic_moon');
        } };
        case 'agung11': return { label: 'Strike the agung', fn: function () { self.ringAgung(o); } };
      }
      return undefined;
    },

    // ================================================================ step 0: the dark moon
    c11Hook: function () {
      var self = this, q = Q(), c = this.c11, cam = this.cameras.main;
      if (st() !== 0) return;
      q.ch11 = 1;   // (first: closing the lines early never loses the chapter)
      this.cutscene = true;
      cam.stopFollow(); cam.pan(19 * T, 28 * T, 900, 'Sine.easeInOut');
      var lines = X.hook.concat([X.rise, X.gongs, X.flee]).concat(X.meet);
      this.ui.say(this.ch2Lines(lines), {
        onLine: function (i) {
          if (self.leaving) return;
          if (i === 1) { self.tweens.add({ targets: c, eclipseF: 1, duration: 3200 }); LC.Audio.sfx('wind'); }
          if (i === 2 && self.ghost) self.tweens.add({ targets: self.ghost, x: '+=2', duration: 60, yoyo: true, repeat: 8 });
          if (i === 3) self.serpentHumps11();
          if (i === 4) self.serpentRise11();
          if (i === 5) self.vintaArrives11();
          if (i === 6) { self.serpentSink11(); self.tweens.add({ targets: c, eclipseF: 0, duration: 3500 }); }
          if (i === 7 && !c.arani) self.jettyCrew11();
          if (i === 7) self.refreshWhen();
        },
        onDone: function () {
          self.cutscene = false; c.eclipseF = 0;
          if (c.serpent) self.serpentSink11(true);
          if (!c.arani) self.jettyCrew11();
          self.refreshWhen();
          c.imgs.forEach(function (im) { if (im.scene && self.objImgs.f_vinta11) im.destroy(); });
          cam.startFollow(self.player, true, 0.2, 0.2);
        }
      });
    },
    serpentHumps11: function () {   // humps of a long back, rolling along the river
      var c = this.c11, self = this;
      c.serpent = { humps: [], head: null, t0: this.time.now };
      for (var i = 0; i < 7; i++) {
        var im = this.add.image((9 + i * 3.2) * T, 31.4 * T, 'bakunawa11_body').setScale(1.4).setDepth(31.4 * T + 1).setAlpha(0);
        c.serpent.humps.push(im);
        this.tweens.add({ targets: im, alpha: 1, duration: 500, delay: i * 120 });
      }
      LC.Audio.sfx('wave11'); this.cameras.main.shake(400, 0.003);
      this.time.delayedCall(300, function () { if (c.serpent) self.fx.drop.explode(14, 20 * T, 31 * T); });
    },
    serpentRise11: function () {
      var c = this.c11, sp = c.serpent;
      if (!sp) return;
      sp.head = this.add.image(23 * T, 32.5 * T, 'bakunawa11_1').setScale(2).setOrigin(0.5, 1).setDepth(33 * T).setAlpha(0).setFlipX(true);
      sp.glow = this.addLight(23 * T, 27 * T, 0x8ae8ff, 2.6, false); sp.glow.base = 0.9;   // (cold light off its scales, so you can see it in the dark)
      this.tweens.add({ targets: sp.head, alpha: 1, y: 30.2 * T, duration: 900, ease: 'Back.easeOut' });
      LC.Audio.sfx('roar11'); this.cameras.main.shake(900, 0.008);
      this.fx.drop.explode(24, 23 * T, 31 * T); this.fx.sparkle.explode(6, 23 * T, 29 * T);
    },
    vintaArrives11: function () {
      var self = this, c = this.c11;
      var v = this.add.image(1 * T, 32 * T, 'vinta11').setOrigin(0.5, 1).setDepth(32 * T + 2);
      c.imgs.push(v);
      var lamp = this.addLight(1 * T, 30 * T, 0xffc070, 1.6, true); lamp.base = 0.95;   // a lantern on the bow
      this.tweens.add({ targets: lamp.img, x: 18 * T, duration: 2600, ease: 'Sine.easeOut' });
      this.tweens.add({ targets: v, x: 18 * T, duration: 2600, ease: 'Sine.easeOut', onComplete: function () { if (self.leaving) return; self.refreshWhen(); if (self.objImgs.f_vinta11) v.destroy(); } });
      var n = 0, ev = this.time.addEvent({ delay: 520, repeat: 9, callback: function () { if (!self.leaving) { LC.Audio.sfx('gongbeat11'); n++; if (c.serpent && c.serpent.head && n % 2) self.tweens.add({ targets: c.serpent.head, angle: n % 4 ? 6 : -6, duration: 120, yoyo: true }); } } });
      void ev;
    },
    serpentSink11: function (now) {
      var c = this.c11, sp = c.serpent, self = this;
      if (!sp) return;
      c.serpent = null;
      var all = sp.humps.concat(sp.head ? [sp.head] : []);
      if (sp.glow) sp.glow.base = 0;
      if (now) { all.forEach(function (im) { im.destroy(); }); return; }
      this.tweens.add({ targets: all, alpha: 0, y: '+=18', duration: 1400, ease: 'Quad.easeIn', onComplete: function () { all.forEach(function (im) { im.destroy(); }); } });
      LC.Audio.sfx('wave11'); this.fx.drop.explode(16, 22 * T, 31 * T);
      void self;
    },
    updateSerpent: function (time) {   // the humps roll along
      var sp = this.c11.serpent;
      sp.humps.forEach(function (im, i) { im.y = 31.4 * T - Math.max(0, Math.sin(time / 260 - i * 0.9)) * 7; });
      if (sp.head) sp.head.setTexture(Math.floor(time / 380) % 2 ? 'bakunawa11_1' : 'bakunawa11_0');
    },
    jettyCrew11: function () {   // Mbo' Arani and Dinda, waiting on the farm jetty beside their vinta
      var c = this.c11;
      if (c.arani) return;
      c.arani = this.add.sprite(20.4 * T, 30.6 * T, 'npc_arani_0').setOrigin(0.5, 1).setDepth(30.6 * T);
      c.dinda = this.add.sprite(21.3 * T, 29.4 * T, 'npc_dinda_0').setOrigin(0.5, 1).setDepth(29.4 * T).setFlipX(true);
      if (this.anims.exists('npc_arani_idle')) c.arani.play('npc_arani_idle');
      if (this.anims.exists('npc_dinda_idle')) c.dinda.play('npc_dinda_idle');
      var L = this.addLight(19 * T, 29.5 * T, 0xffc070, 0.9, true); L.base = 0.7;
    },

    // ================================================================ Laut Sulu: you are the captain
    setupSea: function () {
      var self = this, c = this.c11, p = this.player, cam = this.cameras.main, q = Q();
      cam.setZoom(2);
      p.setVisible(false); this.pShadow.setVisible(false);
      var ang = this.dir === 'up' ? -Math.PI / 2 : this.dir === 'left' ? Math.PI : this.dir === 'down' ? Math.PI / 2 : 0;
      var sh = c.ship = { x: p.x, y: p.y - 6, ang: ang, spd: 0, vx: 0, vy: 0, bumpT: 0, frameT: 0, wakeT: 0, spin: 0, ejectT: 0 };
      sh.img = this.add.image(sh.x, sh.y, 'vinta11_t0').setDepth(sh.y + 4).setRotation(ang);
      sh.shadow = this.add.image(sh.x, sh.y + 3, 'shadow').setScale(3.2, 1.6).setAlpha(0.35).setDepth(sh.y - 1);
      sh.wake = this.add.particles(0, 0, 'foam11', { lifespan: 1500, speed: { min: 2, max: 10 }, scale: { start: 0.5, end: 1.6 }, alpha: { start: 0.55, end: 0 }, emitting: false }).setDepth(2);
      c.wind = { ang: -0.35, base: -0.35 };
      // wind streaks, whitecaps and sea birds
      c.streaks = []; for (var i = 0; i < 18; i++) c.streaks.push({ img: this.add.image(0, 0, 'streak11').setDepth(8998).setAlpha(0), v: 140 + Math.random() * 90, life: 0 });
      c.caps = []; for (var j = 0; j < 16; j++) c.caps.push({ img: this.add.image(0, 0, 'foam11').setDepth(3).setAlpha(0), t: Math.random() * 2 });
      c.birds = [];
      if (this.textures.exists('camar_0')) for (var b = 0; b < 3; b++) { var bd = this.add.sprite(0, 0, 'camar_0').setDepth(9004).setAlpha(0.9); if (this.anims.exists('camar_walk')) bd.play('camar_walk'); c.birds.push({ spr: bd, life: 0 }); }
      // the fog bank (it drifts with the wind), the whirlpools, the rain of the squall
      c.fogs = [];
      for (var f = 0; f < 26; f++) {
        var fx = (C.fog.x0 + Math.random() * (C.fog.x1 - C.fog.x0)) * T, fy = (C.fog.y0 + Math.random() * (C.fog.y1 - C.fog.y0)) * T;
        c.fogs.push({ img: this.add.image(fx, fy, 'fog').setDepth(8997).setScale(3 + Math.random() * 2).setAlpha(0.5 + Math.random() * 0.25), bx: fx, by: fy, ph: Math.random() * 6 });
      }
      c.whirls = C.whirl.map(function (w) {
        var im = self.add.image(w[0] * T, w[1] * T, 'swirl11').setDepth(2).setScale(1.4).setAlpha(0.85);
        self.tweens.add({ targets: im, angle: -360, duration: 3000, repeat: -1 });
        return { x: w[0] * T, y: w[1] * T, img: im };
      });
      c.rain = this.add.particles(0, 0, 'drop', { lifespan: 600, speedY: { min: 260, max: 340 }, speedX: { min: -80, max: -40 }, scale: { start: 1, end: 0.6 }, alpha: { start: 0.7, end: 0.1 }, frequency: 14, emitting: false }).setDepth(9003);
      c.flashT = 3; c.waveT = 2; c.creakT = 4; c.hintT = 0; c.said = {};
      this.dir = 'right';
      if (!q.c11helm) {
        q.c11helm = 1;
        this.time.delayedCall(700, function () { if (!self.leaving) self.ui.say([{ text: X.helmHow }].concat(st() === 4 && (q.c11leg || 0) < 3 ? [{ name: 'The old chart', text: X.leg[q.c11leg || 0] }] : [])); });
      } else if (st() === 4 && (q.c11leg || 0) < 3) this.time.delayedCall(600, function () { if (!self.leaving) self.toast(X.leg[q.c11leg || 0], 'i_pedoman'); });
    },
    seaFree: function (px, py) {
      var tx = Math.floor(px / T), ty = Math.floor(py / T);
      if (tx < 0 || ty < 0 || tx >= this.W || ty >= this.H) return false;
      return !!WATER[this.grid[ty][tx]] && !this.objAt[ty][tx];
    },
    updateShip: function (dt, blocked) {
      var c = this.c11, sh = c.ship, k = this.keys, p = this.player, S = C.ship, time = this.time.now;
      var vx = 0, vy = 0, analog = 1;
      if (!blocked) {
        if (k.A.isDown || k.LEFT.isDown) vx -= 1;
        if (k.D.isDown || k.RIGHT.isDown) vx += 1;
        if (k.W.isDown || k.UP.isDown) vy -= 1;
        if (k.S.isDown || k.DOWN.isDown) vy += 1;
        if (!vx && !vy) { var tv = this.ui.touchVec(); if (tv && Math.hypot(tv.x, tv.y) > 0.15) { vx = tv.x; vy = tv.y; analog = clamp(Math.hypot(vx, vy) * 1.2, 0.4, 1); } }
      }
      var steer = !!(vx || vy);
      if (steer) { var want = Math.atan2(vy, vx), d = wrapA(want - sh.ang); sh.ang = wrapA(sh.ang + clamp(d, -S.turn * dt, S.turn * dt)); }
      // the wind fills the sail: fastest running with it, slowest beating into it
      var wf = 0.62 + 0.38 * Math.cos(wrapA(sh.ang - c.wind.ang));
      var tx = Math.floor(sh.x / T), ty = Math.floor(sh.y / T), shallow = this.grid[ty] && this.grid[ty][tx] === 'h' ? S.shallow : 1;
      var storm = boxDepth(sh.x, sh.y, C.storm), max = S.speed * wf * shallow * (1 - storm * 0.18) * analog;
      if (steer) sh.spd = Math.min(max, sh.spd + S.accel * dt);
      else sh.spd = Math.max(0, sh.spd - S.accel * S.drag * dt);
      if (sh.spd > max) sh.spd = Math.max(max, sh.spd - S.accel * dt);
      // the sea pushes too: whirlpools pull and spin, squalls shove
      var px = 0, py = 0;
      c.whirls.forEach(function (w) {
        var dx = w.x - sh.x, dy = w.y - sh.y, dd = Math.hypot(dx, dy), R = 5.5 * T;
        if (dd < R && dd > 1) {
          var f = 1 - dd / R;
          px += dx / dd * f * 60 - dy / dd * f * 70; py += dy / dd * f * 60 + dx / dd * f * 70;
          sh.ang = wrapA(sh.ang - f * 2.4 * dt);
          if (dd < 1.3 * T && sh.ejectT <= 0) {   // flung out of the eye
            sh.ejectT = 2.5; sh.vx = -dx / dd * 260; sh.vy = -dy / dd * 260; sh.spin = 6;
            LC.Audio.sfx('spout11'); this.cameras.main.shake(260, 0.004);
          }
          if (!c.said.whirl) { c.said.whirl = 1; this.toast(X.whirl, 'ic_moon'); }
        }
      }, this);
      if (storm > 0) { px += Math.sin(time / 700) * 40 * storm; py += Math.cos(time / 900) * 30 * storm; }
      sh.ejectT -= dt;
      if (sh.spin > 0) { sh.ang = wrapA(sh.ang + sh.spin * dt); sh.spin = Math.max(0, sh.spin - dt * 4); }
      sh.vx *= Math.pow(0.15, dt); sh.vy *= Math.pow(0.15, dt);
      var mx = (Math.cos(sh.ang) * sh.spd + px + sh.vx) * dt, my = (Math.sin(sh.ang) * sh.spd + py + sh.vy) * dt;
      // the hull: bow, stern and both outriggers
      var ca = Math.cos(sh.ang), sa = Math.sin(sh.ang), nx = sh.x + mx, ny = sh.y + my;
      var pts = [[nx + ca * 22, ny + sa * 22], [nx - ca * 20, ny - sa * 20], [nx - sa * 10, ny + ca * 10], [nx + sa * 10, ny - ca * 10]];
      var free = pts.every(function (q) { return this.seaFree(q[0], q[1]); }, this);
      if (free) { sh.x = nx; sh.y = ny; }
      else {
        var slideX = pts.every(function (q) { return this.seaFree(q[0], q[1] - my); }, this), slideY = pts.every(function (q) { return this.seaFree(q[0] - mx, q[1]); }, this);
        if (slideX) sh.x = nx; else if (slideY) sh.y = ny;
        if (sh.spd > 40 && sh.bumpT <= 0) {
          sh.bumpT = 1.2; LC.Audio.sfx('bump11'); this.cameras.main.shake(180, 0.004);
          this.fx.drop.explode(10, pts[0][0], pts[0][1]);
          if (!c.said.bump || Math.random() < 0.3) { c.said.bump = 1; this.toast(pick(X.bump), 'ic_moon'); }
        }
        sh.spd *= slideX || slideY ? 0.7 : -0.25;
      }
      sh.bumpT -= dt;
      // draw: the hull rocks a little, the sail ripples (faster in a squall)
      sh.frameT -= dt;
      if (sh.frameT <= 0) { sh.frameT = storm > 0.2 ? 0.12 : sh.spd > 30 ? 0.28 : 0.6; sh.img.setTexture(sh.img.texture.key === 'vinta11_t0' ? 'vinta11_t1' : 'vinta11_t0'); }
      var roll = Math.sin(time / 520) * (0.03 + storm * 0.08);
      sh.img.setPosition(Math.round(sh.x), Math.round(sh.y)).setRotation(sh.ang + roll).setScale(1, 1 + Math.sin(time / 640) * 0.04).setDepth(sh.y + 4);
      sh.shadow.setPosition(Math.round(sh.x), Math.round(sh.y + 4)).setRotation(sh.ang).setDepth(sh.y - 1);
      // the wake behind, and spray at the bow
      sh.wakeT -= dt;
      if (sh.spd > 12 && sh.wakeT <= 0) {
        sh.wakeT = 0.05;
        sh.wake.emitParticleAt(sh.x - ca * 22, sh.y - sa * 22, 1);
        if (sh.spd > 50) { sh.wake.emitParticleAt(sh.x - ca * 12 - sa * 12, sh.y - sa * 12 + ca * 12, 1); sh.wake.emitParticleAt(sh.x - ca * 12 + sa * 12, sh.y - sa * 12 - ca * 12, 1); }
      }
      if (sh.spd > S.speed * 0.62 && Math.random() < dt * 9) this.fx.drop.explode(2, sh.x + ca * 24, sh.y + sa * 24);
      // you, Pelita and the camera ride with the ship
      p.x = sh.x; p.y = sh.y + 6;
      this.moving = sh.spd > 6;
      var dd8 = Math.round(sh.ang / (Math.PI / 2));
      this.dir = ['right', 'down', 'left', 'up'][(dd8 % 4 + 4) % 4];
      this.pShadow.setVisible(false); p.setVisible(false); this.veh.setVisible(false);
    },
    updateSea: function (time, dt, blocked) {
      var self = this, c = this.c11, sh = c.ship, q = Q(), s = st(), cam = this.cameras.main, wv = cam.worldView;
      if (cam.zoom !== 2) cam.setZoom(2);   // (the open sea: a wider view)
      // the wind veers slowly; in a squall it jumps about
      var storm = boxDepth(sh.x, sh.y, C.storm);
      c.wind.ang = wrapA(c.wind.base + Math.sin(time / 38000) * 0.4 + (storm > 0 ? Math.sin(time / 300) * 0.9 * storm : 0));
      // wind streaks across the screen, along the wind
      var wa = c.wind.ang, wc = Math.cos(wa), ws = Math.sin(wa);
      c.streaks.forEach(function (s2) {
        var im = s2.img;
        s2.life -= dt;
        if (s2.life <= 0 || !Phaser.Geom.Rectangle.Contains(wv, im.x, im.y)) {
          s2.life = 1.4 + Math.random() * 1.6;
          im.setPosition(wv.x + Math.random() * wv.width, wv.y + Math.random() * wv.height).setRotation(wa).setAlpha(0).setScale(0.8 + Math.random() * 0.9, 1);
          self.tweens.add({ targets: im, alpha: 0.25 + storm * 0.3, duration: 300, yoyo: true, hold: 600 });
        }
        im.x += wc * (s2.v + storm * 120) * dt; im.y += ws * (s2.v + storm * 120) * dt;
      });
      // whitecaps come and go
      c.caps.forEach(function (cp) {
        cp.t -= dt;
        if (cp.t <= 0) {
          cp.t = 1.6 + Math.random() * 1.8;
          var x = wv.x + Math.random() * wv.width, y = wv.y + Math.random() * wv.height;
          if (!self.seaFree(x, y)) return;
          cp.img.setPosition(x, y).setAlpha(0).setScale(0.8 + Math.random() * 0.8 + storm);
          self.tweens.add({ targets: cp.img, alpha: 0.7, duration: 420, yoyo: true, hold: 200 });
        }
      });
      // sea birds riding the wind
      c.birds.forEach(function (b, i) {
        b.life -= dt;
        if (b.life <= 0 || !Phaser.Geom.Rectangle.Contains(wv, b.spr.x, b.spr.y)) {
          b.life = 6 + Math.random() * 6;
          b.spr.setPosition(wv.centerX - wc * wv.width * 0.6 + (Math.random() - 0.5) * wv.width * 0.6, wv.centerY - ws * wv.height * 0.6 + (Math.random() - 0.5) * wv.height * 0.6);
          b.spr.setFlipX(wc < 0);
        }
        b.spr.x += wc * 46 * dt + Math.sin(time / 600 + i) * 0.3; b.spr.y += ws * 46 * dt + Math.cos(time / 500 + i) * 0.4;
        b.spr.setVisible(boxDepth(sh.x, sh.y, C.dark) < 0.5);
      });
      // the fog bank drifts; the squall rains and flashes
      c.fogs.forEach(function (f) { f.img.x = f.bx + Math.sin(time / 7000 + f.ph) * 40; f.img.y = f.by + Math.cos(time / 9000 + f.ph) * 20; });
      if (storm > 0.05) {
        c.flashT -= dt;
        if (c.flashT <= 0) { c.flashT = 3 + Math.random() * 4; cam.flash(160, 230, 235, 255); this.time.delayedCall(250 + Math.random() * 500, function () { LC.Audio.sfx('thunder11'); }); }
      }
      if (storm > 0.05) for (var rr = 0; rr < 3; rr++) c.rain.emitParticleAt(wv.x + Math.random() * (wv.width + 80), wv.y - 10, 1);
      // the sound of the sea
      if ((c.waveT -= dt) <= 0) { c.waveT = 2.4 + Math.random() * 2.6; LC.Audio.sfx('wave11'); }
      if ((c.creakT -= dt) <= 0) { c.creakT = 5 + Math.random() * 5; if (sh.spd > 20) LC.Audio.sfx('creak11'); }
      // places along the way
      if (!c.said.fog && boxDepth(sh.x, sh.y, C.fog) > 0.3) { c.said.fog = 1; this.toast(X.fog, 'i_pedoman'); }
      if (!c.said.dark && boxDepth(sh.x, sh.y, C.dark) > 0.3) { c.said.dark = 1; this.toast(X.dark, 'ic_moon'); }
      if (!c.said.storm && storm > 0.3) { c.said.storm = 1; this.toast(X.storm, 'ic_moon'); }
      if (blocked) return;
      // the chart's legs
      if (s === 4) {
        var leg = q.c11leg || 0;
        if (leg < C.legs.length) {
          var L = C.legs[leg], dx = L.to[0] * T - sh.x, dy = L.to[1] * T - sh.y;
          if (Math.hypot(dx, dy) < L.r * T) {
            q.c11leg = leg + 1; c.hintT = 0; LC.Audio.sfx('chime');
            this.ui.say(this.ch2Lines(X.legDone[leg]), { onDone: function () { if (!self.leaving && q.c11leg < C.legs.length) self.toast(X.leg[q.c11leg], 'i_pedoman'); } });
          } else {
            // a word from Mbo' Arani when you have wandered off course for a while
            var off = Math.abs(wrapA(Math.atan2(dy, dx) - sh.ang));
            c.hintT += dt * (off > 1 || sh.spd < 10 ? 1 : 0.25);
            if (c.hintT > 26) { c.hintT = 0; this.toast(pick(X.hint[leg]), 'npc_arani_0'); }
          }
        }
      }
    },
    shipAction: function () {
      var self = this, c = this.c11, sh = c && c.ship, q = Q(), s = st();
      if (!sh) return null;
      if (Math.hypot(sh.x - C.harbour.x * T, sh.y - C.harbour.y * T) < C.harbour.r * T)
        return { label: X.harbour, fn: function () { LC.Audio.sfx('creak11'); self.goArea('sulu', self.tilePx({ x: 26.5, y: 34.5 }), 'right'); } };
      var canAnchor = (s === 4 && (q.c11leg || 0) >= C.legs.length) || s >= 5;
      if (canAnchor && Math.hypot(sh.x - C.bulan.x * T, sh.y - C.bulan.y * T) < C.bulan.r * T)
        return { label: X.anchor, fn: function () { LC.Audio.sfx('splash'); if (st() === 4) q.ch11 = 5; self.goArea('bulan', self.tilePx(LC.AREAS.bulan.home), 'up'); } };
      return null;
    },

    // ================================================================ Pulau Bulan: the Bakunawa
    setupBulan: function () {
      var self = this, q = Q(), s = st(), c = this.c11;
      c.gongs = [0, 0, 0]; c.gongLights = [];
      ['bl_agung0', 'bl_agung1', 'bl_agung2'].forEach(function (id, i) {
        var im = self.objImgs[id];
        c.gongLights[i] = im ? self.addLight(im.x, im.y - 16, 0xffd070, 1.3, false) : null;
        if (c.gongLights[i]) c.gongLights[i].base = 0;
      });
      if (s === 5 && !q.c11won) {
        this.makeBakunawa(false);
        this.time.delayedCall(800, function () {
          if (self.leaving) return;
          self.ui.say(self.ch2Lines(X.island), { onDone: function () { if (c.boss) c.boss.ready = true; } });
        });
      } else if (s >= 6 || q.c11won) this.makeBakunawa(true);
    },
    makeBakunawa: function (friend) {   // the head, nine body segments and the tail, on a path round the island
      var c = this.c11, P = B.path, segs = [], th = Math.PI * 0.5;
      var hx = (P.x + Math.cos(th) * P.rx) * T, hy = (P.y + Math.sin(th) * P.ry) * T;
      for (var i = 0; i < 10; i++) segs.push(this.add.image(hx - i * 14, hy, i === 9 ? 'bakunawa11_tail' : 'bakunawa11_body').setAlpha(0.6).setDepth(hy - 2));
      var o = { th: th, segs: segs, mode: 'swim', t: 0, lungeT: B.lungeEvery, spoutT: B.spoutEvery, risenT: 0, e: null, head: null, ready: false, over: false, bar: null, warn: null, hx: hx, hy: hy };
      if (friend) {
        o.head = this.add.image(hx, hy, 'bakunawa11_0').setOrigin(0.5, 0.75).setAlpha(0.7).setDepth(hy);
        o.eye = this.add.image(hx, hy, 'glow').setBlendMode(ADD()).setTint(0xffe08a).setScale(0.35).setDepth(9001);
        c.friend = o;
        return o;
      }
      var e = this.spawnEnemy({ kind: 'bakunawa11', n: 0, fixed: { x: hx / T - 0.5, y: hy / T - 0.8 }, zone: { x0: 2, y0: 2, x1: 37, y1: 27 } }, true);
      e.spr.stop(); e.spr.setTexture('bakunawa11_0').setOrigin(0.5, 0.75).setAlpha(0.6);
      this.enemies.splice(this.enemies.indexOf(e), 1);   // (under the water it cannot be struck)
      o.e = e; o.head = e.spr;
      o.bar = this.add.graphics().setDepth(9602);
      o.warn = this.add.graphics().setDepth(9590);
      c.boss = o;
      return o;
    },
    pathPos: function (th, k) { var P = B.path; k = k || 1; return { x: (P.x + Math.cos(th) * P.rx * k) * T, y: (P.y + Math.sin(th) * P.ry * k) * T }; },
    nearestTh: function (x, y) { var P = B.path; return Math.atan2((y / T - P.y) / P.ry, (x / T - P.x) / P.rx); },
    moveSegs: function (o, hx, hy, time, under) {   // each segment follows the one before it, like a rope
      var prev = { x: hx, y: hy };
      o.segs.forEach(function (sg, i) {
        var dx = prev.x - sg.x, dy = prev.y - sg.y, d = Math.hypot(dx, dy) || 1, gap = i === 0 ? 20 : 13;
        if (d > gap) { sg.x += dx / d * (d - gap); sg.y += dy / d * (d - gap); }
        sg.setRotation(Math.atan2(dy, dx)).setDepth(sg.y - 2);
        var hump = Math.sin(time / 300 - i * 0.8);
        sg.setAlpha(under ? (hump > 0.2 ? 0.75 : 0.18) : 0.95).setScale(under ? 0.9 + Math.max(0, hump) * 0.2 : 1);
        prev = sg;
      });
    },
    updateFriend: function (time, dt) {   // after the chapter: it swims round its island, with Pelita's light in its eye
      var o = this.c11.friend;
      o.th += dt * 0.16;
      var p = this.pathPos(o.th);
      o.head.setPosition(p.x, p.y).setFlipX(Math.sin(o.th) > 0).setDepth(p.y);
      o.eye.setPosition(p.x + (o.head.flipX ? -6 : 6), p.y - 12).setAlpha(0.5 + 0.3 * Math.sin(time / 300));
      this.moveSegs(o, p.x, p.y, time, true);
    },
    ringAgung: function (o) {
      var self = this, c = this.c11, im = this.objImgs[o.id], now = this.time.now, b = c.boss;
      LC.Audio.sfx('agung11'); this.cameras.main.shake(120, 0.002);
      if (im) { this.tweens.add({ targets: im, angle: 4, duration: 70, yoyo: true, repeat: 3 }); this.shockwave(im.x, im.y - 16, 70, 0xffd070); }
      if (!b || b.over || !b.ready || b.mode === 'risen' || b.mode === 'down') return;
      c.gongs[o.i] = now + B.gongFor * 1000;
      var ringing = c.gongs.filter(function (g) { return g > now; }).length;
      if (ringing >= 3) this.bakunawaRise();
      else this.toast(X.gongOne + '  (' + ringing + ' / 3)', 'ic_kulintang11');
      void self;
    },
    bakunawaRise: function () {
      var c = this.c11, b = c.boss, p = this.player;
      b.mode = 'risen'; b.risenT = B.daze; c.gongs = [0, 0, 0];
      b.th = this.nearestTh(p.x, p.y);
      var at = this.pathPos(b.th, 0.74);   // (right at the water's edge, within reach of a blade)
      b.hx = at.x; b.hy = at.y;
      b.head.setPosition(at.x, at.y).setAlpha(1).setTexture('bakunawa11_1').setScale(1.25).setFlipX(at.x > p.x);
      b.e.spr = b.head;
      if (this.enemies.indexOf(b.e) < 0) this.enemies.push(b.e);
      LC.Audio.sfx('roar11'); this.cameras.main.shake(500, 0.006);
      this.fx.drop.explode(26, at.x, at.y); this.shockwave(at.x, at.y - 10, 60, 0x9ae8ff);
      this.toast(X.risen, 'ic_kulintang11');
      LC.Audio.setBattle(true, true);
    },
    bakunawaDive: function () {
      var b = this.c11.boss, i = this.enemies.indexOf(b.e);
      if (i >= 0) this.enemies.splice(i, 1);
      b.mode = 'swim'; b.head.setTexture('bakunawa11_0').setScale(1).setAlpha(0.6).setAngle(0); b.lungeT = B.lungeEvery + 1;
      LC.Audio.sfx('wave11'); this.fx.drop.explode(18, b.hx, b.hy);
      this.toast(X.dive, 'ic_moon');
    },
    spout: function (x, y) {   // a water spout bursts up where the circle warned
      var self = this, b = this.c11.boss, g = this.add.graphics().setDepth(y - 2);
      g.fillStyle(0x9ad8ff, 0.25).fillEllipse(x, y, B.spoutR * 2, B.spoutR * 1.3);
      g.lineStyle(1, 0xe8f8ff, 0.9).strokeEllipse(x, y, B.spoutR * 2, B.spoutR * 1.3);
      this.tweens.add({ targets: g, alpha: 0.4, duration: 150, yoyo: true, repeat: -1 });
      this.time.delayedCall(900, function () {
        g.destroy();
        if (self.leaving || !b || b.over) return;
        var sp = self.add.image(x, y + 2, 'spout11').setOrigin(0.5, 1).setDepth(y + 1).setScale(1, 0.2);
        self.tweens.add({ targets: sp, scaleY: 1.6, duration: 140, yoyo: true, hold: 260, onComplete: function () { sp.destroy(); } });
        self.fx.drop.explode(10, x, y - 10); LC.Audio.sfx('spout11');
        if (Math.hypot(self.player.x - x, self.player.y - 4 - y) < B.spoutR) self.playerHurt(B.spoutDmg, { spr: { x: x, y: y } });
      });
    },
    updateBoss: function (time, dt, blocked) {
      var self = this, c = this.c11, b = c.boss, p = this.player, now = this.time.now;
      // the agung glow while they ring
      c.gongs.forEach(function (g, i) { var L = c.gongLights[i]; if (L) L.base = g > now ? 0.4 + 0.5 * (g - now) / (B.gongFor * 1000) : 0; });
      if (b.over) return;
      var e = b.e;
      // its health bar, over its head while it is up
      b.bar.clear();
      if (b.mode === 'risen' || b.mode === 'lunge' || b.mode === 'warn') {
        var w = 46, bx = Math.round(b.head.x - w / 2), by = Math.round(b.head.y - 40), f = Math.max(0, e.hp / e.def.hp);
        b.bar.fillStyle(0x0a1418, 0.85).fillRect(bx - 1, by - 1, w + 2, 5); b.bar.fillStyle(0x6ae0e8, 1).fillRect(bx, by, Math.max(1, Math.round(w * f)), 3);
      }
      if (blocked || !b.ready || e.stoneT > 0) { this.moveSegs(b, b.head.x, b.head.y, time, b.mode === 'swim'); return; }
      LC.Audio.setBattle(true, true);
      var fast = b.mode === 'risen' ? 1.7 : 1;
      if ((b.spoutT -= dt) <= 0) {
        b.spoutT = B.spoutEvery * fast + Math.random();
        for (var k = 0; k < 3; k++) {
          var a = Math.random() * Math.PI * 2, r = k ? 18 + Math.random() * 34 : 0, sx = p.x + Math.cos(a) * r, sy = p.y - 4 + Math.sin(a) * r * 0.7;
          if (!this.solidPx(sx, sy)) (function (sx, sy, kk) { self.time.delayedCall(kk * 160, function () { self.spout(sx, sy); }); })(sx, sy, k);
        }
      }
      if (b.mode === 'swim') {
        b.th += dt * 0.32;
        var at = this.pathPos(b.th);
        b.hx = at.x; b.hy = at.y;
        b.head.setPosition(at.x, at.y).setFlipX(Math.sin(b.th) > 0).setDepth(at.y).setAlpha(0.6);
        // near the water's edge? it lunges
        var P = B.path, nx = (p.x / T - P.x) / (P.rx * 0.72), ny = (p.y / T - P.y) / (P.ry * 0.72), nearEdge = nx * nx + ny * ny > 0.55;
        if ((b.lungeT -= dt) <= 0 && nearEdge) {
          b.lungeT = B.lungeEvery + Math.random() * 1.5;
          b.th = this.nearestTh(p.x, p.y);
          var from = this.pathPos(b.th);
          b.hx = from.x; b.hy = from.y; b.head.setPosition(from.x, from.y).setAlpha(1).setTexture('bakunawa11_1');
          this.fx.drop.explode(14, from.x, from.y); LC.Audio.sfx('wave11');
          var dx = p.x - from.x, dy = (p.y - 6) - from.y, d = Math.hypot(dx, dy) || 1;
          b.ldx = dx / d; b.ldy = dy / d; b.ll = Math.min(d + 20, 6 * T); b.mode = 'warn'; b.t = 0.75;
        }
      } else if (b.mode === 'warn') {   // a red line shows where it will strike
        b.t -= dt;
        b.warn.clear(); b.warn.lineStyle(3, 0xff4040, 0.35 + 0.35 * Math.sin(time / 50)); b.warn.lineBetween(b.hx, b.hy - 8, b.hx + b.ldx * b.ll, b.hy - 8 + b.ldy * b.ll);
        b.head.x = b.hx + Math.sin(time / 25) * 1.5;
        if (b.t <= 0) { b.warn.clear(); b.mode = 'lunge'; b.t = 0.26; b.lx = b.hx; b.ly = b.hy; LC.Audio.sfx('lunge'); }
      } else if (b.mode === 'lunge') {
        b.t -= dt;
        var k2 = 1 - Math.max(0, b.t) / 0.26;
        b.head.setPosition(b.lx + b.ldx * b.ll * k2, b.ly + b.ldy * b.ll * k2).setDepth(b.head.y);
        if (Math.hypot(p.x - b.head.x, p.y - 6 - (b.head.y - 8)) < 18 && this.invuln <= 0) this.playerHurt(B.dmg, { spr: b.head });
        if (b.t <= 0) { b.mode = 'back'; b.t = 0.6; }
      } else if (b.mode === 'back') {
        b.t -= dt;
        var back = this.pathPos(b.th), kb = Math.min(1, dt * 5);
        b.head.x += (back.x - b.head.x) * kb; b.head.y += (back.y - b.head.y) * kb;
        if (b.t <= 0) { b.mode = 'swim'; b.head.setTexture('bakunawa11_0'); }
      } else if (b.mode === 'risen') {   // dazed by the gongs: it sways, and can be struck
        b.risenT -= dt;
        b.head.setPosition(b.hx + Math.sin(time / 420) * 4, b.hy).setAngle(Math.sin(time / 380) * 7).setDepth(b.hy);
        if (Math.random() < dt * 3) this.fx.sparkle.explode(1, b.head.x + (Math.random() - 0.5) * 30, b.head.y - 34 + Math.random() * 8);
        if (b.risenT <= 0) this.bakunawaDive();
      }
      e.light.img.setPosition(b.head.x, b.head.y - 16);
      this.moveSegs(b, b.head.x, b.head.y, time, b.mode === 'swim');
    },
    bakunawaDown: function (e) {
      var self = this, c = this.c11, b = c.boss, q = Q(), S = this.S;
      e.dead = true; e.respawn = 1e9; e.stoneT = 0;
      var i = this.enemies.indexOf(e); if (i >= 0) this.enemies.splice(i, 1);
      b.over = true; b.bar.clear(); b.warn.clear();
      q.c11won = 1; q.ch11 = 6;
      if (!LC.State.count('mutiara_kembar')) LC.State.add('mutiara_kembar', 1);
      S.stats.kills = (S.stats.kills || 0) + 1;
      LC.Audio.setBattle(false);
      LC.Audio.sfx('roar11'); this.cameras.main.flash(500, 220, 240, 255); this.cameras.main.shake(500, 0.005);
      var hx = b.head.x, hy = b.head.y, p = this.player;
      b.head.setTexture('bakunawa11_1').setAngle(0).clearTint();
      this.tweens.add({ targets: b.head, y: hy + 6, angle: b.head.flipX ? 8 : -8, duration: 800, ease: 'Quad.easeOut' });
      // it spits out the twin pearls
      var pearls = this.add.image(hx, hy - 20, 'mutiara_kembar11').setDepth(9500);
      var glow = this.add.image(hx, hy - 20, 'glow').setBlendMode(ADD()).setTint(0xfff2c0).setScale(0.6).setDepth(9499);
      this.tweens.add({ targets: [pearls, glow], x: p.x, y: p.y - 14, duration: 1100, ease: 'Sine.easeInOut', delay: 500, onComplete: function () {
        pearls.destroy(); glow.destroy();
        LC.Audio.sfx('chime'); self.fx.sparkle.explode(18, p.x, p.y - 14);
      } });
      this.time.delayedCall(1900, function () {
        if (self.leaving) return;
        var fake = null;
        self.ui.say(self.ch2Lines(X.downLines), {
          onLine: function (k) {
            if (k !== 4 || self.leaving) return;
            var g0 = self.ghost;
            c.hideGhost = true;
            fake = self.add.image(g0 ? g0.x : p.x, g0 ? g0.y : p.y - 20, LC.ghostTex(S.ghost.stage, 'happy')).setDepth(9600);
            var fg = self.add.image(fake.x, fake.y, 'glow').setBlendMode(ADD()).setTint(0xffe08a).setScale(0.9).setDepth(9599);
            self.tweens.add({ targets: [fake, fg], x: b.head.x + (b.head.flipX ? -8 : 8), y: b.head.y - 30, duration: 1500, ease: 'Sine.easeInOut', yoyo: true, hold: 900,
              onYoyo: function () { self.fx.sparkle.explode(14, b.head.x, b.head.y - 24); LC.Audio.sfx('pet'); b.eye = self.add.image(b.head.x + (b.head.flipX ? -6 : 6), b.head.y - 12, 'glow').setBlendMode(ADD()).setTint(0xffe08a).setScale(0.35).setDepth(9001); },
              onComplete: function () { fake.destroy(); fg.destroy(); c.hideGhost = false; } });
          },
          onDone: function () {
            c.hideGhost = false; if (fake && fake.scene) fake.destroy();
            var parts = b.segs.concat([b.head]).concat(b.eye ? [b.eye] : []);
            self.tweens.add({ targets: parts, alpha: 0, duration: 2200, delay: 300, onComplete: function () { parts.forEach(function (o2) { o2.destroy(); }); } });
            self.toast('You have the Mutiara Kembar. Sail back to Lupah Sug, to the Sultan.', 'i_mutiara_kembar');
          }
        });
      });
    }
  });
})(window.LC);
