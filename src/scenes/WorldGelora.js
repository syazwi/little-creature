/* World, part 16 (v2.6): Chapter 8, Air Pasang (see gelora.js). The flood at the farm (it climbs a row a day; you wade
 * through it, slowly, with splashes, and leaves and a slipper drift past), the dark water in Kampung Karang and the two
 * palaces, and the Selat Gelora at war: soldiers of both sides clashing all over the battlefield, ink drifting from the
 * big broken jar, stray volleys of spears (a red line warns you first), and two dragons fighting beyond a wall of
 * current. Then the boss (the Naga Mother's waves and whirlpools, Ketos's water jet and tail slam, both at once; Nek
 * Lampir's cure calms each one, and the other gets furious), then the Queen and Poseidon's own duel (you watch them
 * fight one against one, then calm the Queen, then Poseidon, and at last tell them the truth), the peace under the
 * arch, and the clean-up with Nek Lampir
 * at her pot by the farm jetty. Personal to each player. Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var T = 16, proto = LC.WorldScene.prototype, C8 = LC.C8, X = LC.CH8TEXT;
  var WAR = { laskar8: 1, hoplit8: 1, tinta8: 1 }, DRAGON = { nagaibu8: 1, ketos8: 1 }, RULER = { ratu8: 1, poseidon8: 1 };
  var PAIRS = [[18, 14], [22, 30], [32, 24], [38, 14], [19, 21], [36, 29]];   // soldiers fighting each other (tile x, y)
  var ADD = function () { return Phaser.BlendModes.ADD; };
  function Q() { return LC.State.s.quests; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function atWar() { var s = LC.ch8Step(); return s >= 2 && s <= 5 && !Q().c8boss; }

  // ---------------------------------------------------------------- hooks
  var enemyDie = proto.enemyDie;
  proto.enemyDie = function (e) {
    if (DRAGON[e.kind]) return this.calmDragon(e);
    if (RULER[e.kind]) return this.calmRuler(e);
    return enemyDie.call(this, e);
  };
  var createKampong = proto.createKampong;
  proto.createKampong = function () { createKampong.apply(this, arguments); this.createGelora(); };
  var updateKampong = proto.updateKampong;
  proto.updateKampong = function (time, dt) { updateKampong.apply(this, arguments); this.updateGelora(time, dt); };
  var kampongObjAction = proto.kampongObjAction;
  proto.kampongObjAction = function (o) { var a = this.geloraObjAction(o); return a !== undefined ? a : kampongObjAction.call(this, o); };

  Object.assign(proto, {
    createGelora: function () {
      var self = this, q = Q(), st = LC.ch8Step();
      this.c8 = { tick: 1, flood: null, murk: null, pairs: [], dragons: null, spears: [], pools: [], volleyT: 4, tok: 1,
        waveT: 3, poolT: 6, beamT: 2.5, slamT: 5, boltT: 3, inkT: 0, splashT: 0, scene: false, nek: null, show: [], aside: null };
      if (this.area === 'farm') {
        this.floodFx();
        if (st === 8) this.nekPot(true);
      }
      if (this.area === 'laut') {
        if (st >= 1 && st <= 5) this.murkFx(0.18, 8, 22 * T, 16 * T, 560);
        var gate = this.objImgs && this.objImgs.l_arus;
        if (gate) this.tweens.add({ targets: gate, alpha: 0.65, scaleX: 1.08, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      }
      if ((this.area === 'kidul' || this.area === 'atlantis') && st >= 2 && st <= 5) this.murkFx(0.1, 4, 22 * T, 16 * T, 600);
      if (this.area !== 'gelora') return;
      if (st >= 2 && st <= 5) this.warFx(true);
      this.pairsFx(st);
      if (st >= 2 && st <= 4) this.dragonsFx();
      var arus = this.objImgs && this.objImgs.ge_arus;
      if (arus) this.tweens.add({ targets: arus, alpha: 0.7, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      if (!q.c8arrived && st >= 2 && st <= 5) { q.c8arrived = 1; this.time.delayedCall(900, function () { if (!self.leaving) self.ui.say(self.ch2Lines(X.arrive)); }); }
      if (st === 5 && !q.c8boss) this.time.delayedCall(1000, function () { if (!self.leaving && !self.ui.isBlocking()) self.toast(X.currentOpen, 'i_air_penawar'); });
      if (st === 5 && q.c8boss) this.bossSetup8();
      if (st === 6 && q.c8duel === 'kidul') { this.c8.aside = this.showRuler(false, 34, 5.4, true); this.duelTimers8(); }
      if (st === 6 && q.c8duel === 'pos') { this.showRuler(true, 21.5, 5.4, false); this.duelTimers8(); }
    },

    geloraObjAction: function (o) {
      var self = this, q = Q(), st = LC.ch8Step();
      switch (o.type) {
        case 'arusgate8':
          if (st < 2) return { label: 'The black current', fn: function () { self.toast('Black water pours out of a crack in the reef here, cold and fast. Ask Tok Duyung about it first.', 'ic_moon'); } };
          return this.seaGateAction(o, 'Follow the black current');
        case 'arus8': return { label: 'The wall of current', fn: function () { self.toast(X.current, 'ic_moon'); } };
        case 'balang8': return { label: 'The big broken jar', fn: function () {
          if (st === 3) self.toast('A huge black jar, cracked open, pouring ink into the sea. Something is scratched on it, but the ink hides it. Broken pieces lie scattered around it.', 'i_serpihan_balang');
          else if (st >= 4) self.toast('Mak Lampir\'s mark, on a jar as big as a cow. It still leaks, slowly.', 'i_serpihan_balang');
          else self.toast('A huge black jar, cracked open, pouring ink into the sea.', 'i_serpihan_balang');
        } };
        case 'serpih8': return { label: 'Pick up the black shard', fn: function () { self.pickShard8(o); } };
        case 'jar8': return { label: 'Pick up the black jar', fn: function () { self.pickJar8(o); } };
        case 'nek8': return { label: LC.State.count('balang_hitam') ? 'Give Nek Lampir the black jars' : 'Talk to Nek Lampir', fn: function () { self.giveJars8(); } };
      }
      return undefined;
    },

    updateGelora: function (time, dt) {
      var c = this.c8, S = this.S, q = Q();
      if (!c) return;
      var blocked = this.ui.isBlocking() || this.sleeping || this.leaving || this.cutscene, st = LC.ch8Step();
      if ((c.tick -= dt) <= 0 && !blocked) {
        c.tick = 1;
        if (this.area === 'farm' && st === 0 && (q.ch7 || 0) >= 10) {
          if (q.c8wait === undefined) q.c8wait = S.day;      // the chapter opens the day after Chapter 7 ends
          else if (S.day > q.c8wait && S.minutes >= 7 * 60 && S.minutes < 17 * 60) this.c8Flood();
        }
        if (this.area === 'farm' && (c.flood ? c.flood.lv : 0) !== this.floodLevel()) this.floodFx();
        if (this.area === 'farm' && st === 8 && !c.nek) this.nekPot(true);
      }
      this.updateFlood(time, dt, blocked);
      this.updateMurk(time, dt);
      if (this.area !== 'gelora') return;
      this.updatePairs(dt, blocked);
      this.updateDragonsFx(dt, blocked);
      if (st < 6 && !blocked && (c.inkT -= dt) <= 0) { c.inkT = 0.4; this.inkPuff8(); }
      if (st === 5 && !q.c8boss && !blocked && this.player && Math.floor((this.player.y - 3) / T) <= 10) this.startBoss8();
      if (!blocked && atWar() && (c.volleyT -= dt) <= 0) { c.volleyT = C8.volley.cd + Math.random() * 2.5; this.volley8(); }
      this.updateSpears(dt, blocked);
      this.updatePools(dt, blocked);
      if (st === 5 && q.c8boss && !blocked) this.updateBoss8(dt);
      c.show.forEach(function (r) { if (r.spr.active) r.gl.setPosition(r.spr.x, r.spr.y - 12); });
      if (st === 6 && !q.c8duel && !blocked && !c.scene && this.player && this.npcs.nagaibu && Math.floor((this.player.y - 3) / T) <= 12) this.c8DuelShow();
      if (st === 6 && (q.c8duel === 'kidul' || q.c8duel === 'pos') && !blocked) this.updateDuel8(dt);
    },

    // ================================================================ the flood at the farm
    floodLevel: function () {
      var q = Q(), st = LC.ch8Step();
      if (st < 1 || st >= 8 || q.c8floodDay === undefined) return 0;
      return Math.max(1, Math.min(C8.floodMax, this.S.day - q.c8floodDay + 1));
    },
    floodFx: function () {
      var self = this, c = this.c8, q = Q(), lv = this.floodLevel();
      if (c.flood) { [c.flood.ts, c.flood.deep, c.flood.foam].concat(c.flood.bits.map(function (b) { return b.img; })).forEach(function (o) { o.destroy(); }); c.flood = null; }
      if (!lv || this.area !== 'farm') return;
      var top = C8.floodBank - lv, W = this.W * T, y0 = top * T, h = (C8.floodBank + 1 - top) * T + 6;
      var ts = this.add.tileSprite(0, y0, W, h, 'banjir').setOrigin(0).setDepth(4).setAlpha(0.95);
      var deep = this.add.graphics().setDepth(4.5);
      for (var r = 0; r <= lv; r++) { deep.fillStyle(0x1e4a5a, 0.06 + 0.07 * r); deep.fillRect(0, y0 + r * T, W, T); }
      deep.fillStyle(0x3a2e1e, 0.35); deep.fillRect(0, y0 - 3, W, 3);
      var foam = this.add.graphics().setDepth(5), bits = [];
      ['leaf', 'i_selipar', 'leaf', 'i_kayu', 'leaf', 'leaf'].forEach(function (k, i) {
        if (!self.textures.exists(k)) return;
        var img = self.add.image(Math.random() * W, y0 + 8 + Math.random() * (h - 16), k).setDepth(6).setScale(k[0] === 'i' ? 0.6 : 1).setAlpha(0.85);
        bits.push({ img: img, vx: 6 + Math.random() * 8, ph: Math.random() * 6, y: img.y });
      });
      c.flood = { ts: ts, deep: deep, foam: foam, bits: bits, top: top, lv: lv, y0: y0, W: W, ft: 0 };
      if (lv > (q.c8lv || 0)) { if (q.c8lv) this.time.delayedCall(1600, function () { if (!self.leaving) self.toast(X.rise, 'ic_moon'); }); q.c8lv = lv; }
    },
    updateFlood: function (time, dt, blocked) {
      var f = this.c8.flood, self = this;
      if (!f) return;
      f.ts.tilePositionX -= dt * 7; f.ts.tilePositionY = Math.sin(time / 1400) * 2;
      if ((f.ft -= dt) <= 0) {   // the foam along the edge of the water
        f.ft = 0.1; f.foam.clear(); f.foam.fillStyle(0xe8f0e0, 0.55);
        for (var x = 0; x < f.W; x += 7) f.foam.fillRect(x, f.y0 - 1 + Math.sin(x / 23 + time / 500) * 1.6, 4, 2);
      }
      f.bits.forEach(function (b) {
        b.img.x += b.vx * dt; if (b.img.x > f.W + 10) b.img.x = -10;
        b.img.y = b.y + Math.sin(time / 700 + b.ph) * 1.5; b.img.setAngle(Math.sin(time / 900 + b.ph) * 20);
      });
      if (!blocked && this.moving && this.wadeMult() < 1 && (this.c8.splashT -= dt) <= 0) { this.c8.splashT = 0.18; self.fx.drop.explode(2, this.player.x, this.player.y - 1); }
    },
    wadeMult: function () {
      var c = this.c8;
      if (!c || !c.flood || this.S.riding === 'naga' || !this.player) return 1;
      var ty = Math.floor((this.player.y - 3) / T);
      return ty >= c.flood.top && ty <= C8.floodBank ? 0.62 : 1;
    },
    c8Flood: function () {
      var self = this, q = Q();
      q.ch8 = 1; q.c8floodDay = this.S.day;   // (first: closing the lines early never loses the chapter)
      LC.Audio.sfx('splash');
      this.floodFx();
      if (this.c8.flood) { var fl = this.c8.flood; [fl.ts, fl.deep].forEach(function (o) { var a = o.alpha; o.setAlpha(0); self.tweens.add({ targets: o, alpha: a, duration: 2500 }); }); }
      this.time.delayedCall(2600, function () { if (!self.leaving && self.ghost) self.fx.sparkle.explode(12, self.ghost.x, self.ghost.y - 8); });
      this.ui.say(this.ch2Lines(X.flood));
    },

    // ================================================================ dark water: the murk and the ink
    murkFx: function (alpha, n, cx, cy, spread) {
      var c = this.c8, W = this.W * T, H = this.H * T, inks = [], rays = [];
      if (c.murk) return;
      var dark = this.add.rectangle(0, 0, W, H, 0x180c2a).setOrigin(0).setDepth(9440).setAlpha(alpha);
      for (var i = 0; i < n; i++) {
        var f = this.add.image(cx + (Math.random() - 0.5) * spread, cy + (Math.random() - 0.5) * spread * 0.6, 'fog').setTint(0x1a0c2c).setDepth(9003).setScale(1.6 + Math.random() * 1.6).setAlpha(0.55);
        inks.push({ img: f, vx: (Math.random() - 0.5) * 8, ph: Math.random() * 6 });
      }
      for (var k = 0; k < 3; k++) {   // shafts of light from far above
        var r = this.add.image(W * (0.2 + 0.3 * k) + Math.random() * 60, 6 * T, 'glow').setBlendMode(ADD()).setDepth(9441).setTint(0x8fd3ff).setScale(0.6, 6).setAlpha(0.08).setAngle(-8 + k * 6);
        rays.push(r);
      }
      c.murk = { dark: dark, inks: inks, rays: rays, alpha: alpha, bt: 0, ink: 0.3 + alpha };
    },
    murkOff: function () {
      var c = this.c8, m = c.murk;
      if (!m) return;
      c.murk = null;
      var all = [m.dark].concat(m.inks.map(function (i) { return i.img; }), m.rays);
      this.tweens.add({ targets: all, alpha: 0, duration: 1800, onComplete: function () { all.forEach(function (o) { o.destroy(); }); } });
    },
    updateMurk: function (time, dt) {
      var m = this.c8.murk;
      if (!m) return;
      m.inks.forEach(function (i) { i.img.x += i.vx * dt; i.img.setAlpha(m.ink + 0.1 * Math.sin(time / 900 + i.ph)); });
      m.rays.forEach(function (r, k) { r.setAlpha(0.06 + 0.04 * Math.sin(time / 1300 + k * 2)); });
      if ((m.bt -= dt) <= 0 && this.player) { m.bt = 0.35; var v = this.cameras.main.worldView; this.fx.bubble.explode(1, v.x + Math.random() * v.width, v.bottom - Math.random() * 40); }
    },
    warFx: function (on) {
      if (!on) { this.murkOff(); return; }
      this.murkFx(0.26, 14, 27.5 * T, 20 * T, 600);
    },
    inkPuff8: function () {   // ink rising from the big broken jar
      var self = this, x = 29.6 * T + (Math.random() - 0.5) * 6, y = 20.4 * T;
      var ink = this.add.image(x, y, 'smoke').setTint(0x12061c).setDepth(9002).setScale(0.7).setAlpha(0.95);
      this.tweens.add({ targets: ink, y: y - 50 - Math.random() * 30, x: x + (Math.random() - 0.5) * 36, scale: 2.6, alpha: 0, duration: 2400, onComplete: function () { ink.destroy(); } });
      void self;
    },

    // ================================================================ the battlefield
    pairsFx: function (st) {
      var self = this, c = this.c8;
      c.pairs = [];
      PAIRS.forEach(function (t) {
        var x = t[0] * T + 8, y = (t[1] + 1) * T, apart = st >= 6 ? 12 : 7;
        var g = self.add.sprite(x - apart, y, 'laskar8_0').setOrigin(0.5, 1).setDepth(y);
        var w = self.add.sprite(x + apart, y, 'hoplit8_0').setOrigin(0.5, 1).setDepth(y).setFlipX(true);
        if (st >= 6) { self.tweens.add({ targets: [g, w], y: y - 1, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' }); }
        c.pairs.push({ g: g, w: w, x: x, y: y, t: Math.random() * 2, peace: st >= 6 });
      });
    },
    updatePairs: function (dt, blocked) {
      var self = this;
      this.c8.pairs.forEach(function (P) {
        if (P.peace || blocked || (P.t -= dt) > 0) return;
        P.t = 0.9 + Math.random() * 1.6;
        var who = Math.random() < 0.5 ? P.g : P.w, other = who === P.g ? P.w : P.g, dir = who === P.g ? 1 : -1, x0 = who.x;
        who.setTexture(who === P.g ? 'laskar8_1' : 'hoplit8_1');
        self.tweens.add({ targets: who, x: x0 + dir * 5, duration: 110, yoyo: true, onYoyo: function () {
          if (self.leaving || P.peace) return;
          var sx = (P.g.x + P.w.x) / 2, sy = P.y - 12;
          var sp = self.add.image(sx, sy, 'hitfx').setDepth(9600).setBlendMode(ADD()).setScale(0.35).setAngle(Math.random() * 90);
          self.tweens.add({ targets: sp, scale: 0.9, alpha: 0, duration: 170, onComplete: function () { sp.destroy(); } });
          self.fx.bubble.explode(2, sx, sy);
          other.setTintFill(0xffffff); self.time.delayedCall(70, function () { if (other.active) other.clearTint(); });
          if (Math.random() < 0.25) self.tweens.add({ targets: other, x: other.x + dir * 8, duration: 140, yoyo: true });   // knocked back a step
          var pl = self.player;
          if (pl && Math.hypot(pl.x - sx, pl.y - sy) < 140 && Math.random() < 0.5) LC.Audio.sfx('hit');
        }, onComplete: function () { if (who.active) { who.x = x0; who.setTexture(who === P.g ? 'laskar8_0' : 'hoplit8_0'); } } });
      });
    },
    pairsCalm: function () {
      var self = this;
      this.c8.pairs.forEach(function (P) {
        P.peace = true;
        P.g.setTexture('laskar8_0'); P.w.setTexture('hoplit8_0');
        self.tweens.add({ targets: P.g, x: P.x - 12, duration: 700 }); self.tweens.add({ targets: P.w, x: P.x + 12, duration: 700 });
        self.time.delayedCall(800 + Math.random() * 600, function () { if (!self.leaving) self.fx.heart.explode(1, P.x, P.y - 22); });
      });
    },
    dragonsFx: function () {   // before the fight: the two dragons, fighting in the deep beyond the current
      var c = this.c8, n = this.add.sprite(24 * T, 10.4 * T, 'nagaibu8_0').setOrigin(0.5, 1).setDepth(10 * T), k = this.add.sprite(31 * T, 10.4 * T, 'ketos8_0').setOrigin(0.5, 1).setDepth(10 * T).setFlipX(true);
      n.play('nagaibu8_walk'); k.play('ketos8_walk');
      this.tweens.add({ targets: n, y: n.y - 4, duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      this.tweens.add({ targets: k, y: k.y - 4, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: 300 });
      c.dragons = { n: n, k: k, t: 2, nx: n.x, kx: k.x };
    },
    updateDragonsFx: function (dt, blocked) {
      var D = this.c8.dragons, self = this;
      if (!D || blocked || (D.t -= dt) > 0) return;
      D.t = 2.6 + Math.random() * 2.4;
      var a = Math.random() < 0.5 ? D.n : D.k, b = a === D.n ? D.k : D.n, dir = a === D.n ? 1 : -1, ax = a === D.n ? D.nx : D.kx, bx = b === D.n ? D.nx : D.kx;
      var mx = (D.nx + D.kx) / 2, my = 10.4 * T - 18;
      this.tweens.add({ targets: a, x: ax + dir * 34, duration: 170, yoyo: true, ease: 'Quad.easeIn', onYoyo: function () {
        if (self.leaving) return;
        self.shockwave(mx, my, 44, a === D.n ? 0x9affd8 : 0x8fd3ff);
        var sp = self.add.image(mx, my, 'hitfx').setDepth(9600).setBlendMode(ADD()).setScale(0.8).setAngle(Math.random() * 90);
        self.tweens.add({ targets: sp, scale: 2.2, alpha: 0, duration: 260, onComplete: function () { sp.destroy(); } });
        self.fx.bubble.explode(10, mx, my); self.fx.sparkle.explode(8, mx, my);
        self.tweens.add({ targets: b, x: bx + dir * 10, duration: 120, yoyo: true, onComplete: function () { b.x = bx; } });
        b.setTintFill(0xffffff); self.time.delayedCall(90, function () { if (b.active) b.clearTint(); });
        var pl = self.player, d = pl ? Math.hypot(pl.x - mx, pl.y - my) : 999;
        if (d < 330) self.cameras.main.shake(140, d < 180 ? 0.004 : 0.002);
        if (d < 420) LC.Audio.sfx('drum');
      }, onComplete: function () { a.x = ax; } });
    },
    // stray spears: a red line warns you, then a volley flies across from one camp or the other
    volley8: function () {
      var self = this, c = this.c8, V = C8.volley, p = this.player, cam = this.cameras.main.worldView, tok = c.tok;
      if (!p) return;
      var fromLeft = Math.random() < 0.5, y = Phaser.Math.Clamp(p.y - 8 + (Math.random() - 0.5) * 40, 14 * T, (this.H - 3) * T);
      var x0 = cam.x, x1 = cam.right, g = this.add.graphics().setDepth(9590), o = { t: 0 };
      this.tweens.add({ targets: o, t: 1, duration: V.warn * 1000, onUpdate: function () {
        g.clear(); var a = 0.25 + 0.5 * Math.abs(Math.sin(o.t * 12));
        g.lineStyle(2, 0xff5a4a, a); for (var x = x0; x < x1; x += 14) g.lineBetween(x, y, x + 8, y);
        var ex = fromLeft ? x0 + 6 : x1 - 6; g.fillStyle(0xff5a4a, a); g.fillTriangle(ex, y - 6, ex, y + 6, ex + (fromLeft ? 12 : -12), y);
      }, onComplete: function () {
        g.destroy();
        if (self.leaving || c.tok !== tok) return;
        for (var i = 0; i < 3; i++) (function (i) {
          self.time.delayedCall(i * 110, function () {
            if (self.leaving || c.tok !== tok) return;
            var sp = self.add.image(fromLeft ? x0 - 30 : x1 + 30, y + (i - 1) * 3, fromLeft ? 'tombak8' : 'lembing8').setDepth(9560).setFlipX(!fromLeft);
            c.spears.push({ spr: sp, vx: fromLeft ? V.speed : -V.speed, end: fromLeft ? x1 + 50 : x0 - 50, hit: false });
            if (i === 0) LC.Audio.sfx('throw');
          });
        })(i);
      } });
    },
    updateSpears: function (dt, blocked) {
      var self = this, c = this.c8, V = C8.volley, p = this.player;
      if (!c.spears.length) return;
      c.spears = c.spears.filter(function (s) {
        if (!s.spr.active) return false;
        if (blocked) return true;
        s.spr.x += s.vx * dt;
        if (Math.random() < 0.3) self.fx.bubble.explode(1, s.spr.x, s.spr.y);
        var tip = s.spr.x + (s.vx > 0 ? 10 : -10);
        if (!s.hit && p && self.invuln <= 0 && !self.leaving && Math.abs(tip - p.x) < 9 && Math.abs(s.spr.y - (p.y - 8)) < V.w) {
          s.hit = true; self.playerHurt(V.dmg, { spr: { x: s.spr.x - (s.vx > 0 ? 20 : -20), y: p.y } });
        }
        if ((s.vx > 0 && s.spr.x > s.end) || (s.vx < 0 && s.spr.x < s.end)) { s.spr.destroy(); return false; }
        return true;
      });
    },
    pickShard8: function (o) {
      var q = Q(), sh = q.c8sh || (q.c8sh = {});
      if (sh[o.i] || LC.ch8Step() !== 3) return;
      var n = Object.keys(sh).length + 1;
      if (n >= C8.shards && !LC.State.canAdd('serpihan_balang')) { this.toast('Your bag is full! Make room first.'); LC.Audio.sfx('error'); return; }
      sh[o.i] = 1;
      this.removeObj8(o);
      LC.Audio.sfx('harvest');
      if (n < C8.shards) { this.toast('A piece of a black clay jar, sticky with ink. (' + n + ' / ' + C8.shards + ')', 'i_serpihan_balang'); return; }
      LC.State.add('serpihan_balang', 1); q.ch8 = 4;   // (first)
      this.ui.say(this.ch2Lines(X.shards));
    },
    removeObj8: function (o) {   // a picked-up thing disappears from the place
      var im = this.objImgs && this.objImgs[o.id], self = this;
      if (im) { this.objImgs[o.id] = null; this.fx.sparkle.explode(6, im.x, im.y - 6); this.tweens.add({ targets: im, alpha: 0, y: im.y - 6, duration: 300, onComplete: function () { im.destroy(); } }); }
      for (var y = o.y; y < o.y + (o.h || 1); y++) for (var x = o.x; x < o.x + (o.w || 1); x++) {
        if (this.objAt[y][x] === o) this.objAt[y][x] = null;
        this.solid[y][x] = !!LC.SOLID_TILES[this.grid[y][x]];
      }
      void self;
    },

    // ================================================================ the two dragons
    startBoss8: function () {
      var q = Q();
      q.c8boss = 1;   // (saved: if you faint, they are waiting when you come back)
      LC.Audio.sfx('drum'); this.cameras.main.shake(500, 0.006);
      var D = this.c8.dragons;
      if (D) { this.tweens.killTweensOf([D.n, D.k]); D.n.destroy(); D.k.destroy(); this.c8.dragons = null; }
      this.c8.spears.forEach(function (s) { s.spr.destroy(); }); this.c8.spears = [];
      this.checkGroups();
      this.bossSetup8();
      this.ui.say(this.ch2Lines(X.bossStart));
    },
    bossSetup8: function () {
      var c = this.c8;
      c.waveT = 3; c.poolT = 6; c.beamT = 2.5; c.slamT = 5;
    },
    dragonFoes: function () { return (this.enemies || []).filter(function (e) { return DRAGON[e.kind] && !e.dead && !e.away; }); },
    updateBoss8: function (dt) {
      var c = this.c8, B = C8.boss, foes = this.dragonFoes(), r = foes.length === 1 ? B.rage : 1;
      foes.forEach(function (e) { if (e.stoneT > 0) return; e.light.base = 0.6; e.light.img.setTint(e.rage ? 0xff6a5a : e.kind === 'nagaibu8' ? 0x9affd8 : 0x8fd3ff); });
      var N = foes.filter(function (e) { return e.kind === 'nagaibu8'; })[0], K = foes.filter(function (e) { return e.kind === 'ketos8'; })[0];
      if (N && !(N.stoneT > 0)) {
        if ((c.waveT -= dt) <= 0) { c.waveT = B.wave.cd * r + Math.random(); this.dragonWave(N); }
        if ((c.poolT -= dt) <= 0) { c.poolT = B.pool.cd * r + Math.random() * 2; this.dragonPool(N); }
      }
      if (K && !(K.stoneT > 0)) {
        if ((c.beamT -= dt) <= 0) { c.beamT = B.beam.cd * r + Math.random(); this.dragonBeam(K); }
        if ((c.slamT -= dt) <= 0) { c.slamT = B.slam.cd * r + Math.random() * 2; this.dragonSlam(K); }
      }
    },
    dragonWave: function (N, say, tint) {   // the Naga Mother (or the Queen) sends a wave across the arena, at your height
      var self = this, c = this.c8, B = C8.boss.wave, A = C8.arena, p = this.player, y = p.y - 6, x0 = A.x0 * T, x1 = (A.x1 + 1) * T, tok = c.tok;
      var g = this.add.graphics().setDepth(9590), o = { t: 0 };
      this.ui.floatText(N.spr.x, N.spr.y - 40, say || 'GRRR...', '#9affd8');
      this.tweens.add({ targets: o, t: 1, duration: B.warn * 1000, onUpdate: function () {
        g.clear(); g.fillStyle(tint || 0x5ab8e8, 0.12 + 0.2 * o.t); g.fillRect(x0, y - B.h / 2, x1 - x0, B.h);
        g.lineStyle(1, 0xd8f0ff, 0.5 + 0.4 * Math.sin(o.t * 20)); g.strokeRect(x0, y - B.h / 2, x1 - x0, B.h);
      }, onComplete: function () {
        g.destroy();
        if (self.leaving || c.tok !== tok) return;
        LC.Audio.sfx('splash');
        var w = self.add.image(x0, y + 8, 'ombak8').setOrigin(0.5, 1).setDepth(y + 8).setScale(1.4), hit = false, ow = { t: 0 };
        if (tint) w.setTint(tint);
        self.tweens.add({ targets: ow, t: 1, duration: 650, onUpdate: function () {
          if (!w.active) return;
          var wx = x0 + (x1 - x0) * ow.t, pl = self.player;
          w.setPosition(wx, y + 8);
          if (Math.random() < 0.6) self.fx.bubble.explode(1, wx, y);
          if (!hit && pl && !self.leaving && self.invuln <= 0 && Math.abs(pl.x - wx) < 14 && Math.abs(pl.y - 6 - y) < B.h / 2 + 4) { hit = true; self.playerHurt(B.dmg, { spr: { x: wx - 20, y: pl.y } }); self.shove(1, 0, B.push); }
        }, onComplete: function () { self.tweens.add({ targets: w, alpha: 0, duration: 200, onComplete: function () { w.destroy(); } }); } });
      } });
    },
    dragonPool: function (N) {   // ...and a whirlpool under your feet, that pulls you in
      var self = this, c = this.c8, B = C8.boss.pool, p = this.player, x = p.x, y = p.y - 4, tok = c.tok;
      var g = this.add.graphics().setDepth(y - 2), o = { t: 0 };
      this.tweens.add({ targets: o, t: 1, duration: B.warn * 1000, onUpdate: function () {
        var k = 1.3 - 0.3 * o.t; g.clear(); g.fillStyle(0x1e4a6a, 0.25 * o.t); g.fillEllipse(x, y, B.r * 2, B.r * 1.2);
        g.lineStyle(2, 0x9affd8, 0.5 + 0.4 * o.t); g.strokeEllipse(x, y, B.r * 2 * k, B.r * 1.2 * k);
      }, onComplete: function () {
        g.destroy();
        if (self.leaving || c.tok !== tok) return;
        LC.Audio.sfx('splash');
        var img = self.add.image(x, y, 'pusaran8').setDepth(y - 1).setScale(0.2).setAlpha(0.9);
        self.tweens.add({ targets: img, scale: 1.3, duration: 300 });
        self.tweens.add({ targets: img, angle: 720, duration: B.dur * 1000 });
        c.pools.push({ img: img, x: x, y: y, t: B.dur, hit: false });
      } });
    },
    updatePools: function (dt, blocked) {
      var self = this, c = this.c8, B = C8.boss.pool, p = this.player;
      if (!c.pools.length) return;
      c.pools = c.pools.filter(function (P) {
        if (!P.img.active) return false;
        if (blocked) return true;
        P.t -= dt;
        if (Math.random() < 0.4) self.fx.bubble.explode(1, P.x + (Math.random() - 0.5) * B.r, P.y);
        var dx = P.x - p.x, dy = P.y - (p.y - 4), d = Math.hypot(dx, dy) || 1;
        if (d < B.r * 1.8 && d > 3) {   // pulled in
          var m = Math.min(d - 2, B.pull * dt), nx = p.x + dx / d * m, ny = p.y + dy / d * m;
          if (!self.blockedAt(nx, p.y)) p.x = nx;
          if (!self.blockedAt(p.x, ny)) p.y = ny;
        }
        if (!P.hit && d < B.r * 0.55 && self.invuln <= 0 && !self.leaving) { P.hit = true; self.playerHurt(B.dmg, { spr: { x: P.x, y: P.y + 4 } }); }
        if (P.t <= 0) { self.tweens.add({ targets: P.img, alpha: 0, scale: 0.2, duration: 300, onComplete: function () { P.img.destroy(); } }); return false; }
        return true;
      });
    },
    dragonBeam: function (K, say, tint, len) {   // Ketos (or the Queen's selendang, or the trident): a jet straight at you (it aims, then fires)
      var self = this, c = this.c8, B = C8.boss.beam, p = this.player, tok = c.tok, L = len || 300, col = tint || 0x5ab8e8;
      var sx = K.spr.x + (K.spr.flipX ? -1 : 1) * (K.def.w + 6), sy = K.spr.y - K.spr.height * 0.6, dx = p.x - sx, dy = (p.y - 8) - sy, d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d;
      var g = this.add.graphics().setDepth(9590), o = { t: 0 };
      this.ui.floatText(K.spr.x, K.spr.y - 40, say || 'Hhhhk...', '#bfe8ff');
      this.tweens.add({ targets: o, t: 1, duration: B.warn * 1000, onUpdate: function () {
        g.clear(); g.lineStyle(1 + 2 * o.t, 0xbfe8ff, 0.3 + 0.5 * o.t); g.lineBetween(sx, sy, sx + ux * L, sy + uy * L);
      }, onComplete: function () {
        g.destroy();
        if (self.leaving || c.tok !== tok || K.dead) return;
        LC.Audio.sfx('splash'); self.cameras.main.shake(120, 0.003);
        var b = self.add.graphics().setDepth(9591).setBlendMode(ADD());
        b.lineStyle(B.w + 4, col, 0.6); b.lineBetween(sx, sy, sx + ux * L, sy + uy * L);
        b.lineStyle(Math.max(2, B.w - 3), 0xe8f8ff, 1); b.lineBetween(sx, sy, sx + ux * L, sy + uy * L);
        for (var k = 0; k < 10; k++) self.fx.bubble.explode(1, sx + ux * L * k / 10, sy + uy * L * k / 10);
        self.tweens.add({ targets: b, alpha: 0, duration: 320, onComplete: function () { b.destroy(); } });
        var pl = self.player, t = Math.max(0, Math.min(L, (pl.x - sx) * ux + (pl.y - 8 - sy) * uy)), qx = sx + ux * t, qy = sy + uy * t;
        if (Math.hypot(pl.x - qx, pl.y - 8 - qy) < B.w && self.invuln <= 0) self.playerHurt(B.dmg, { spr: { x: qx - ux * 10, y: qy - uy * 10 + 8 } });
      } });
    },
    dragonSlam: function (K, say) {   // ...and his tail on the sand: a ring that bursts outwards
      var self = this, c = this.c8, B = C8.boss.slam, tok = c.tok, g = this.add.graphics().setDepth(K.spr.y + 1), o = { t: 0 };
      this.ui.floatText(K.spr.x, K.spr.y - 40, say || 'SKRAAH!', '#bfe8ff');
      this.tweens.add({ targets: o, t: 1, duration: B.warn * 1000, onUpdate: function () {
        if (!K.spr.active) return;
        var R = B.r * (1 - 0.55 * o.t); g.clear();
        g.lineStyle(2, 0xbfe8ff, 0.4 + 0.5 * o.t); g.strokeEllipse(K.spr.x, K.spr.y - 6, R * 2, R * 1.2);
        g.lineStyle(1, 0xffffff, 0.6); g.strokeEllipse(K.spr.x, K.spr.y - 6, R * 1.4, R * 0.8);
      }, onComplete: function () {
        g.destroy();
        if (self.leaving || c.tok !== tok || K.dead) return;
        LC.Audio.sfx('drum'); self.cameras.main.shake(220, 0.006);
        self.shockwave(K.spr.x, K.spr.y - 6, B.r, 0xbfe8ff); self.fx.pebble.explode(12, K.spr.x, K.spr.y - 4); self.fx.bubble.explode(10, K.spr.x, K.spr.y - 10);
        var pl = self.player, dx = pl.x - K.spr.x, dy = pl.y - K.spr.y, d = Math.hypot(dx, dy) || 1;
        if (d <= B.r && self.invuln <= 0) { self.playerHurt(B.dmg, K); self.shove(dx / d, dy / d, B.push); }
      } });
    },
    // worn out: splash Nek Lampir's cure on it, and the anger pours out like ink
    calmDragon: function (e) {
      var self = this, q = Q(), s = e.spr, isN = e.kind === 'nagaibu8', p = this.player;
      e.dead = true; e.respawn = 1e9; e.stoneT = 0; e.windT = 0; e.strikeT = 0; e.light.base = 0;
      if (s.anims.isPaused) s.anims.resume();
      if (LC.ch8Step() !== 5) { s.setVisible(false); return; }
      q[isN ? 'c8calmN' : 'c8calmK'] = 1;   // (first)
      if (LC.State.count('air_penawar')) LC.State.remove('air_penawar', 1);
      this.hitStop = 0.15;
      LC.Audio.sfx('throw');
      var x0 = p.x, y0 = p.y - 14, x1 = s.x, y1 = s.y - s.height / 2, fl = this.add.image(x0, y0, 'i_air_penawar').setDepth(9600).setScale(1.2), o = { t: 0 };
      this.tweens.add({ targets: o, t: 1, duration: 520, onUpdate: function () {
        fl.setPosition(x0 + (x1 - x0) * o.t, y0 + (y1 - y0) * o.t - Math.sin(o.t * Math.PI) * 46).setAngle(o.t * 540);
      }, onComplete: function () {
        fl.destroy();
        if (self.leaving) return;
        LC.Audio.sfx('splash'); LC.Audio.sfx('restu');
        self.shockwave(x1, y1, 54, 0x9affc8);
        self.time.delayedCall(140, function () { if (!self.leaving) self.shockwave(x1, y1, 86, 0xffe8a0); });
        self.fx.sparkle.explode(30, x1, y1); self.fx.bubble.explode(18, x1, y1);
        for (var i = 0; i < 9; i++) {   // the black ink pours out of it
          var ink = self.add.image(x1 + (Math.random() - 0.5) * 30, y1 + (Math.random() - 0.5) * 16, 'smoke').setTint(0x1a0a28).setDepth(9500).setScale(0.8).setAlpha(0.9);
          self.tweens.add({ targets: ink, y: ink.y - 30 - Math.random() * 20, x: ink.x + (Math.random() - 0.5) * 30, scale: 2.2, alpha: 0, duration: 1400 + i * 80, onComplete: (function (k) { return function () { k.destroy(); }; })(ink) });
        }
        s.setTexture(isN ? 'npc_nagaibu_0' : 'npc_ketos_0').play(isN ? 'npc_nagaibu_idle' : 'npc_ketos_idle').clearTint().setScale(1).setAlpha(1);
        self.cameras.main.flash(380, 200, 255, 230);
        self.ui.floatText(x1, y1 - 30, 'Calm again!', '#bfffe0');
        self.tweens.add({ targets: s, alpha: 0, y: s.y - 14, duration: 1500, delay: 1200, onComplete: function () { s.setVisible(false).setAlpha(1); } });
      } });
      var left = this.dragonFoes();
      if (left.length) { left.forEach(function (x) { x.rage = true; }); this.toast(isN ? X.calmN : X.calmK, 'i_air_penawar'); }
      else this.time.delayedCall(1500, function () { if (!self.leaving) self.dragonsCalm(); });
    },
    dragonsCalm: function () {
      var self = this, q = Q(), S = this.S, c = this.c8;
      if (LC.ch8Step() !== 5) return;
      q.ch8 = 6; delete q.c8boss; S.kepeng += C8.reward1; S.stats.earned += C8.reward1;   // (first: the step and the reward)
      LC.Audio.setBattle(false);
      c.tok++;   // (any wave, whirlpool or jet still on its way is cancelled)
      c.pools.forEach(function (P) { P.img.destroy(); }); c.pools = [];
      c.spears.forEach(function (s) { s.spr.destroy(); }); c.spears = [];
      this.enemies.forEach(function (x) {
        if (!WAR[x.kind] || x.dead) return;
        x.dead = true; x.respawn = 1e9; x.light.base = 0;
        self.fx.smoke.explode(6, x.spr.x, x.spr.y - 8);
        self.tweens.add({ targets: x.spr, alpha: 0, duration: 600, onComplete: function () { x.spr.setVisible(false); } });
      });
      this.warFx(false);
      this.pairsCalm();
      LC.Audio.sfx('stage');
      this.time.delayedCall(1000, function () {
        if (self.leaving) return;
        self.placeVillager('nagaibu'); self.placeVillager('ketos');
        ['nagaibu', 'ketos'].forEach(function (v) { var n = self.npcs[v]; if (n) self.fx.sparkle.explode(16, n.spr.x, n.spr.y - 16); });
        self.ui.say(self.ch2Lines(X.calmed));
      });
    },

    // ================================================================ Queen against King (step 6)
    rulerFoe: function () { return (this.enemies || []).filter(function (e) { return RULER[e.kind] && !e.dead && !e.away; })[0] || null; },
    showRuler: function (kidul, tx, ty, fury) {   // a ruler in a scene (not an enemy), with a glow that follows her or him
      var x = tx * T, y = ty * T, key = fury ? (kidul ? 'ratu8' : 'poseidon8') : (kidul ? 'npc_ratukidul' : 'npc_poseidon');
      var spr = this.add.sprite(x, y, key + '_0').setOrigin(0.5, 1).setDepth(y).setFlipX(!kidul && fury);
      var anim = fury ? key + '_walk' : key + '_idle';
      if (this.anims.exists(anim)) spr.play(anim);
      var gl = this.add.image(x, y - 12, 'glow').setBlendMode(ADD()).setDepth(9001).setTint(kidul ? 0x7affc8 : 0x8fd3ff).setScale(fury ? 1.1 : 0.8).setAlpha(fury ? 0.6 : 0.4);
      var r = { spr: spr, gl: gl, x: x, y: y, bob: null };
      r.bob = this.tweens.add({ targets: spr, y: y - 3, duration: kidul ? 1100 : 1300, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      this.c8.show.push(r);
      return r;
    },
    dropRuler: function (r) {
      var c = this.c8;
      if (!r) return;
      c.show = c.show.filter(function (x) { return x !== r; });
      if (r.bob) r.bob.stop();
      this.tweens.add({ targets: [r.spr, r.gl], alpha: 0, duration: 450, onComplete: function () { r.spr.destroy(); r.gl.destroy(); } });
    },
    duelTimers8: function () { var c = this.c8; c.waveT = 2.5; c.beamT = 1.5; c.poolT = 6; c.slamT = 4; c.boltT = 3; },
    // the two rulers fight each other, one against one, and you watch
    c8DuelShow: function () {
      var self = this, c = this.c8, p = this.player;
      if (c.scene || LC.ch8Step() !== 6 || Q().c8duel) return;
      this.cutscene = true; c.scene = true; c.tok++;
      p.setPosition(27.5 * T, 9.2 * T); this.dir = 'up';
      var R = this.showRuler(true, 24, 7, true), P = this.showRuler(false, 31, 7, true);
      [R, P].forEach(function (r, i) { r.spr.setAlpha(0); r.gl.setAlpha(0); self.tweens.add({ targets: r.spr, alpha: 1, duration: 500, delay: i * 300 }); self.tweens.add({ targets: r.gl, alpha: 0.6, duration: 500, delay: i * 300 }); });
      LC.Audio.sfx('drum'); this.cameras.main.flash(300, 160, 255, 220);
      function impact(r, tint, dir) {
        var s = r.spr, x = s.x, y = s.y - 14;
        self.shockwave(x, y, 40, tint);
        var sp = self.add.image(x, y, 'hitfx').setDepth(9600).setBlendMode(ADD()).setScale(0.6).setAngle(Math.random() * 90);
        self.tweens.add({ targets: sp, scale: 1.6, alpha: 0, duration: 220, onComplete: function () { sp.destroy(); } });
        self.fx.sparkle.explode(8, x, y); self.fx.bubble.explode(8, x, y);
        s.setTintFill(0xffffff); self.time.delayedCall(80, function () { if (s.active) s.clearTint(); });
        self.tweens.add({ targets: s, x: r.x + dir * 8, duration: 110, yoyo: true, onComplete: function () { s.x = r.x; } });
        self.cameras.main.shake(140, 0.003); LC.Audio.sfx('hit');
      }
      function kidulHit() {   // her wave, green as jade
        var a = R.spr, b = P.spr;
        self.tweens.add({ targets: a, x: R.x + 6, duration: 120, yoyo: true });
        var w = self.add.image(a.x + 10, a.y - 14, 'ombak8').setTint(0x7affc8).setDepth(9500).setScale(0.8);
        self.tweens.add({ targets: w, x: b.x - 8, scale: 1.25, duration: 300, ease: 'Quad.easeIn', onComplete: function () { w.destroy(); if (!self.leaving) impact(P, 0x7affc8, 1); } });
        LC.Audio.sfx('splash');
        if (Math.random() < 0.6) self.ui.floatText(a.x, a.y - 40, pick(X.shoutR), '#9affd8');
      }
      function posHit() {   // lightning, or a jet from the trident
        var a = P.spr, b = R.spr, g = self.add.graphics().setDepth(9591).setBlendMode(ADD());
        self.tweens.add({ targets: a, x: P.x - 6, duration: 120, yoyo: true });
        if (Math.random() < 0.5) {
          var x = b.x, y = b.y - 130; g.lineStyle(3, 0xffffff, 1); g.beginPath(); g.moveTo(x, y);
          while (y < b.y - 14) { y += 16; x = b.x + (Math.random() - 0.5) * 16; g.lineTo(x, Math.min(y, b.y - 14)); }
          g.strokePath(); self.cameras.main.flash(120, 230, 240, 255);
        } else {
          g.lineStyle(9, 0x5ab8e8, 0.6); g.lineBetween(a.x - 10, a.y - 26, b.x + 6, b.y - 14);
          g.lineStyle(4, 0xe8f8ff, 1); g.lineBetween(a.x - 10, a.y - 26, b.x + 6, b.y - 14);
        }
        self.tweens.add({ targets: g, alpha: 0, duration: 260, onComplete: function () { g.destroy(); } });
        impact(R, 0x8fd3ff, -1);
        if (Math.random() < 0.6) self.ui.floatText(a.x, a.y - 46, pick(X.shoutP), '#bfe8ff');
      }
      function clash() {   // both at once, in the middle
        var mx = 27.5 * T, my = 7 * T - 14;
        self.tweens.add({ targets: R.spr, x: mx - 9, duration: 220, ease: 'Quad.easeIn' });
        self.tweens.add({ targets: P.spr, x: mx + 9, duration: 220, ease: 'Quad.easeIn', onComplete: function () {
          if (self.leaving) return;
          self.cameras.main.flash(260, 255, 255, 255); self.cameras.main.shake(420, 0.009);
          self.shockwave(mx, my, 90, 0x7affc8); self.shockwave(mx, my, 120, 0x8fd3ff);
          var sp = self.add.image(mx, my, 'hitfx').setDepth(9600).setBlendMode(ADD()).setScale(1);
          self.tweens.add({ targets: sp, scale: 4, alpha: 0, duration: 380, onComplete: function () { sp.destroy(); } });
          self.fx.pebble.explode(16, mx, my + 10); self.fx.bubble.explode(20, mx, my); self.fx.sparkle.explode(20, mx, my);
          LC.Audio.sfx('drum'); LC.Audio.sfx('hit');
          self.tweens.add({ targets: R.spr, x: R.x, duration: 400, ease: 'Quad.easeOut' });
          self.tweens.add({ targets: P.spr, x: P.x, duration: 400, ease: 'Quad.easeOut' });
        } });
      }
      var beats = [kidulHit, posHit, kidulHit, posHit, clash, posHit, kidulHit, posHit, kidulHit, clash], n = 0;
      this.time.addEvent({ delay: 650, repeat: beats.length - 1, callback: function () { if (self.leaving || !c.scene) return; self.battleT = 4; beats[n++](); } });
      this.time.delayedCall(650 * (beats.length + 1) + 300, function () { if (!self.leaving && c.scene) self.duelStop8(); });
    },
    duelStop8: function () {   // you swim in between them
      var self = this, q = Q(), done = false;
      q.c8duel = 'kidul';   // (first: saved)
      function go() { if (done) return; done = true; self.duelStart8(); }
      this.ui.say(this.ch2Lines(X.duelStop), { onDone: go });
      var watch = this.time.addEvent({ delay: 500, loop: true, callback: function () { if (done) { watch.remove(); return; } if (!self.ui.isBlocking()) { watch.remove(); go(); } } });
    },
    duelStart8: function () {   // the Queen first; Poseidon steps back to watch
      var self = this, c = this.c8, R = c.show[0], P = c.show[1];
      c.scene = false; this.cutscene = false;
      if (R) { this.fx.sparkle.explode(10, R.spr.x, R.spr.y - 14); this.dropRuler(R); }
      if (P) {
        if (P.bob) P.bob.stop();
        P.x = 34 * T; P.y = 5.4 * T;
        this.tweens.add({ targets: P.spr, x: P.x, y: P.y, duration: 700, onComplete: function () { if (P.spr.active) P.bob = self.tweens.add({ targets: P.spr, y: P.y - 3, duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' }); } });
        c.aside = P;
      }
      this.duelTimers8();
      this.checkGroups();
    },
    updateDuel8: function (dt) {
      var c = this.c8, D = C8.duel, foe = this.rulerFoe();
      if (!foe || foe.stoneT > 0) return;
      foe.light.base = 0.6; foe.light.img.setTint(foe.kind === 'ratu8' ? 0x7affc8 : 0x8fd3ff);
      if (foe.kind === 'ratu8') {
        if ((c.waveT -= dt) <= 0) { c.waveT = D.kidul.wave + Math.random(); this.dragonWave(foe, 'Ombak Selatan!', 0x7affc8); }
        if ((c.beamT -= dt) <= 0) { c.beamT = D.kidul.lash + Math.random(); this.dragonBeam(foe, 'Selendang!', 0x7affc8, D.kidul.lashLen); }
        if ((c.poolT -= dt) <= 0) { c.poolT = D.kidul.pool + Math.random() * 2; this.dragonPool(foe); }
      } else {
        if ((c.beamT -= dt) <= 0) { c.beamT = D.pos.beam + Math.random(); this.dragonBeam(foe, 'Trisula!', 0x8fd3ff, 300); }
        if ((c.slamT -= dt) <= 0) { c.slamT = D.pos.slam + Math.random() * 2; this.dragonSlam(foe, 'GEMPA!'); }
        if ((c.boltT -= dt) <= 0) { c.boltT = D.pos.bolt + Math.random(); if (this.bossBolt) this.bossBolt(foe); }
      }
    },
    // worn out: the anger leaves them, and they yield
    calmRuler: function (e) {
      var self = this, q = Q(), c = this.c8, s = e.spr, isK = e.kind === 'ratu8', done = false;
      e.dead = true; e.respawn = 1e9; e.stoneT = 0; e.windT = 0; e.strikeT = 0; e.light.base = 0;
      if (s.anims.isPaused) s.anims.resume();
      if (LC.ch8Step() !== 6) { s.setVisible(false); return; }
      c.tok++; c.pools.forEach(function (P) { P.img.destroy(); }); c.pools = [];
      if (isK) q.c8duel = 'pos'; else { q.c8duel = 'done'; q.ch8 = 7; }   // (first)
      LC.Audio.setBattle(false); LC.Audio.sfx('restu');
      this.hitStop = 0.15;
      this.cameras.main.flash(400, isK ? 180 : 200, 255, isK ? 220 : 255);
      this.shockwave(s.x, s.y - 14, 60, isK ? 0x7affc8 : 0x8fd3ff);
      this.fx.sparkle.explode(24, s.x, s.y - 14);
      s.setTexture(isK ? 'npc_ratukidul_0' : 'npc_poseidon_0').play(isK ? 'npc_ratukidul_idle' : 'npc_poseidon_idle').clearTint().setScale(1).setAlpha(1).setFlipX(false);
      this.ui.floatText(s.x, s.y - 36, isK ? 'Enough...' : 'I yield!', isK ? '#9affd8' : '#bfe8ff');
      this.cutscene = true;
      function after() {
        if (done) return; done = true; self.cutscene = false;
        if (!isK) { self.c8Truth(s); return; }
        // she steps aside, calm; Poseidon comes forward
        self.tweens.add({ targets: s, x: 21.5 * T, y: 5.4 * T, duration: 800 });
        if (c.aside) { self.dropRuler(c.aside); c.aside = null; }
        self.duelTimers8();
        self.checkGroups();
      }
      this.time.delayedCall(1300, function () {
        if (self.leaving) return;
        if (!isK) { after(); return; }
        self.ui.say(self.ch2Lines(X.kidulWon), { onDone: after });
        var w = self.time.addEvent({ delay: 500, loop: true, callback: function () { if (done) { w.remove(); return; } if (!self.ui.isBlocking()) { w.remove(); after(); } } });
      });
    },
    c8Truth: function (sp) {   // at last they listen
      var self = this, c = this.c8, p = this.player, done = false;
      this.cutscene = true; c.scene = true;
      (this.enemies || []).forEach(function (e) { if (RULER[e.kind]) e.spr.setVisible(false); });
      if (sp) sp.setVisible(false);
      c.show.slice().forEach(function (r) { self.dropRuler(r); });
      var K = this.showRuler(true, 24.5, 7.4, false), P = this.showRuler(false, 30.5, 7.4, false);
      K.spr.setScale(1, 0.94); P.spr.setScale(1, 0.94);   // (sitting down on the sand, worn out)
      p.setPosition(27.5 * T, 9.6 * T); this.dir = 'up';
      function end() {
        if (done) return; done = true; c.scene = false; self.cutscene = false;
        [K, P].forEach(function (r, i) {
          if (r.bob) r.bob.stop();
          c.show = c.show.filter(function (x) { return x !== r; });
          self.tweens.add({ targets: [r.spr, r.gl], x: (i ? 36 : 19) * T, alpha: 0, duration: 1600, onComplete: function () { r.spr.destroy(); r.gl.destroy(); } });
        });
        LC.Audio.sfx('stage');
      }
      this.ui.say(this.ch2Lines(X.truth), { onDone: end });
      var w = this.time.addEvent({ delay: 500, loop: true, callback: function () { if (done) { w.remove(); return; } if (!self.ui.isBlocking()) { w.remove(); end(); } } });
    },

    // ================================================================ peace under the arch
    c8Fetch: function () {   // the Naga Mother goes to fetch Nek Lampir, and the finale begins
      var self = this, n = this.npcs.nagaibu;
      this.toast(X.fetch, 'ic_glow');
      if (n) { this.fx.bubble.explode(20, n.spr.x, n.spr.y - 16); this.tweens.add({ targets: [n.spr].concat(n.glow ? [n.glow] : []), y: '-=60', alpha: 0, duration: 900 }); }
      LC.Audio.sfx('splash');
      this.time.delayedCall(2200, function () { if (!self.leaving) self.c8Finale(); });
    },
    c8Finale: function () {
      var self = this, q = Q(), S = this.S, c = this.c8, p = this.player;
      if (LC.ch8Step() !== 7 || this.area !== 'gelora' || c.scene) return;
      // (first: everything the chapter gives, so a dialogue closed early can never lose it)
      q.ch8 = 8; q.nagaRide = 1; q.c8jar = {}; q.c8sealed = 0;
      ['serpihan_balang', 'air_penawar'].forEach(function (id) { if (LC.State.count(id)) LC.State.remove(id, LC.State.count(id)); });
      if (!LC.State.count('seruling_naga')) { if (LC.State.canAdd('seruling_naga')) LC.State.add('seruling_naga', 1); else q.c8fluteOwed = 1; }
      S.kepeng += C8.reward2; S.stats.earned += C8.reward2;
      LC.State.recalc();
      this.doShared('kind', { n: 25 }, function () {});
      this.cutscene = true; c.scene = true;
      var n = this.npcs.nagaibu;
      if (n) { this.tweens.killTweensOf(n.spr); n.spr.setVisible(false); if (n.glow) n.glow.setVisible(false); }
      p.setPosition(27.5 * T, 9.2 * T); this.dir = 'up';
      this.cameras.main.centerOn(p.x, p.y - 30);
      var cast = [];
      function put(tex, anim, tx, ty, flip, tint) {
        var x = tx * T, y = ty * T, spr = self.add.sprite(x, y, tex).setOrigin(0.5, 1).setDepth(y).setAlpha(0).setFlipX(!!flip);
        if (anim && self.anims.exists(anim)) spr.play(anim);
        var gl = tint ? self.add.image(x, y - 10, 'glow').setBlendMode(ADD()).setDepth(9001).setTint(tint).setScale(0.8).setAlpha(0) : null;
        self.tweens.add({ targets: gl ? [spr, gl] : spr, alpha: { from: 0, to: 0.95 }, duration: 900, delay: cast.length * 250 });
        cast.push(spr); if (gl) cast.push(gl);
        return { spr: spr, gl: gl };
      }
      var ratu = put('npc_ratukidul_0', 'npc_ratukidul_idle', 23, 4.8, false, 0x7affc8);
      var pos = put('npc_poseidon_0', 'npc_poseidon_idle', 33, 4.8, true, 0xbfe8ff);
      var ibu = put('npc_nagaibu_0', 'npc_nagaibu_idle', 23.5, 7.8, false, 0x7affc8);
      var kec = put('sp_naga', null, 25.6, 9.4);
      // Nek Lampir comes down in a bubble
      var nek = this.add.sprite(27.5 * T, 2 * T, 'npc_lampir_0').setOrigin(0.5, 1).setDepth(9004);
      if (this.anims.exists('npc_lampir_idle')) nek.play('npc_lampir_idle');
      var bub = this.add.image(nek.x, nek.y - 10, 'glow').setBlendMode(ADD()).setDepth(9005).setTint(0xbfe8ff).setScale(1.3).setAlpha(0.7);
      var ring = this.add.graphics().setDepth(9005);
      cast.push(nek, bub, ring);
      var bo = { y: nek.y };
      this.tweens.add({ targets: bo, y: 6.6 * T, duration: 2200, ease: 'Sine.easeOut', onUpdate: function () {
        nek.y = bo.y; bub.y = bo.y - 10; ring.clear(); ring.lineStyle(1, 0xe8f8ff, 0.8); ring.strokeCircle(nek.x, bo.y - 10, 15);
      } });
      LC.Audio.sfx('chime');
      var X8 = X.finale;
      function at(fn) { for (var i = 0; i < X8.length; i++) if (fn(X8[i])) return i; return -1; }
      var countAt = at(function (l) { return l.who === 'pelita' && /THREE/.test(l.text); }), sorryAt = at(function (l) { return l.who === 'lampir' && /goodness/.test(l.text); });
      var clearAt = at(function (l) { return /sea will settle/.test(l.text); }), growAt = at(function (l) { return /grows, and grows/.test(l.text); });
      this.ui.say(this.ch2Lines(X8), {
        onLine: function (i) {
          if (i === countAt) {   // one... two... three: both step out at the same moment
            self.time.delayedCall(700, function () {
              if (self.leaving) return;
              self.tweens.add({ targets: [ratu.spr, ratu.gl], x: 26 * T, duration: 600, ease: 'Quad.easeOut' });
              self.tweens.add({ targets: [pos.spr, pos.gl], x: 29.6 * T, duration: 600, ease: 'Quad.easeOut' });
              LC.Audio.sfx('drum');
            });
          }
          if (i === sorryAt) self.tweens.add({ targets: nek, scaleY: 0.82, duration: 260, yoyo: true, hold: 300 });
          if (i === clearAt) {
            self.cameras.main.flash(500, 220, 255, 240);
            var v = self.cameras.main.worldView;
            for (var k = 0; k < 16; k++) self.fx.bubble.explode(2, v.x + Math.random() * v.width, v.bottom - Math.random() * 60);
            LC.Audio.sfx('restu');
          }
          if (i === growAt) {   // Naga Kecil grows
            LC.Audio.sfx('grow');
            self.fx.sparkle.explode(30, kec.spr.x, kec.spr.y - 10);
            self.shockwave(kec.spr.x, kec.spr.y - 8, 40, 0x8fe8ff);
            self.tweens.add({ targets: kec.spr, scaleX: 2, scaleY: 2, duration: 1200, ease: 'Back.easeOut' });
            self.cameras.main.flash(300, 200, 240, 255);
          }
        },
        onDone: function () { self.finaleEnd8(cast); }
      });
      var watch = this.time.addEvent({ delay: 500, loop: true, callback: function () { if (!c.scene) { watch.remove(); return; } if (!self.ui.isBlocking()) { watch.remove(); self.finaleEnd8(cast); } } });
    },
    finaleEnd8: function (cast) {
      var self = this, c = this.c8;
      if (!c.scene) return;
      c.scene = false; this.cutscene = false;
      this.tweens.add({ targets: cast, alpha: 0, duration: 1500, onComplete: function () { cast.forEach(function (o) { o.destroy(); }); } });
      var n = this.npcs.nagaibu;
      if (n) { n.spr.setVisible(true).setAlpha(1).setPosition(n.tx * T + 8, (n.ty + 1) * T); if (n.glow) n.glow.setVisible(true).setPosition(n.tx * T + 8, (n.ty + 1) * T - 10); }
      var jar = this.objImgs && this.objImgs.ge_balang, o = this.objects.filter(function (x) { return x.id === 'ge_balang'; })[0];
      if (jar && o) { LC.Audio.sfx('crumble'); this.fx.pebble.explode(14, jar.x, jar.y - 12); this.removeObj8(o); }
      LC.Audio.sfx('stage');
      this.toast(Q().c8fluteOwed ? 'Your bag was full: the Naga Mother is keeping the Seruling Naga for you. Talk to her to take it.' : 'Hold the Seruling Naga and press USE (or R) to ride Naga Kecil. Now find Nek Lampir\'s 6 black jars!', 'i_seruling_naga');
    },

    // ================================================================ the clean-up, with Nek Lampir
    pickJar8: function (o) {
      var q = Q(), got = q.c8jar || (q.c8jar = {});
      if (got[o.i] || LC.ch8Step() !== 8) return;
      if (!LC.State.canAdd('balang_hitam')) { this.toast('Your bag is full!'); LC.Audio.sfx('error'); return; }
      got[o.i] = 1; LC.State.add('balang_hitam', 1);
      var im = this.objImgs && this.objImgs[o.id];
      if (im) for (var i = 0; i < 4; i++) { var ink = this.add.image(im.x, im.y - 8, 'smoke').setTint(0x24143a).setDepth(9002).setScale(0.5); this.tweens.add({ targets: ink, y: ink.y - 20 - i * 6, alpha: 0, scale: 1.4, duration: 900, onComplete: (function (k) { return function () { k.destroy(); }; })(ink) }); }
      this.removeObj8(o);
      LC.Audio.sfx('harvest');
      var n = Object.keys(got).length;
      this.toast(X.jar + ' (' + n + ' / ' + C8.jars + '). ' + (n >= C8.jars ? 'That is all of them! Take them to Nek Lampir\'s pot by the farm jetty.' : 'Take them to Nek Lampir\'s pot by the farm jetty.'), 'i_balang_hitam');
    },
    nekPot: function (on) {
      var self = this, c = this.c8, N = C8.nek;
      if (!on) {
        if (!c.nek) return;
        var k = c.nek; c.nek = null; k.ev.remove();
        k.tiles.forEach(function (t) { if (self.objAt[t[1]][t[0]] === k.o) self.objAt[t[1]][t[0]] = null; self.solid[t[1]][t[0]] = t[2]; });
        this.fx.smoke.explode(10, k.nek.x, k.nek.y - 10);
        this.tweens.add({ targets: [k.nek, k.pot], alpha: 0, duration: 900, onComplete: function () { k.nek.destroy(); k.pot.destroy(); } });
        return;
      }
      if (c.nek || this.area !== 'farm') return;
      var x = N.x * T + 8, y = (N.y + 1) * T;
      var nek = this.add.sprite(x, y, 'npc_lampir_0').setOrigin(0.5, 1).setDepth(y);
      if (this.anims.exists('npc_lampir_idle')) nek.play('npc_lampir_idle');
      var pot = this.add.image(x + 17, y + 1, 'periuk_nek').setOrigin(0.5, 1).setDepth(y + 1);
      var o = { type: 'nek8' }, tiles = [[N.x, N.y], [N.x + 1, N.y]].map(function (t) { return [t[0], t[1], self.solid[t[1]][t[0]]]; });
      tiles.forEach(function (t) { self.solid[t[1]][t[0]] = true; self.objAt[t[1]][t[0]] = o; });
      var ev = this.time.addEvent({ delay: 650, loop: true, callback: function () {
        if (!pot.active) return;
        var b = self.add.image(pot.x + (Math.random() - 0.5) * 8, pot.y - 15, 'smoke').setTint(0x7aff9a).setDepth(pot.depth + 1).setScale(0.35).setAlpha(0.7);
        self.tweens.add({ targets: b, y: b.y - 18, alpha: 0, scale: 0.9, duration: 1200, onComplete: function () { b.destroy(); } });
      } });
      c.nek = { nek: nek, pot: pot, o: o, tiles: tiles, ev: ev };
    },
    giveJars8: function () {
      var self = this, q = Q(), n = LC.State.count('balang_hitam'), k = this.c8.nek;
      if (LC.ch8Step() !== 8) return;
      if (!n) { this.ui.say(this.ch2Lines([{ who: 'lampir', text: pick(X.nekWait) + ' (' + (q.c8sealed || 0) + ' / ' + C8.jars + ' sealed.)' }])); return; }
      LC.State.remove('balang_hitam', n);
      q.c8sealed = (q.c8sealed || 0) + n;
      LC.Audio.sfx('poof'); LC.Audio.sfx('herbs');
      if (k) {
        this.shockwave(k.pot.x, k.pot.y - 10, 30, 0x7aff9a);
        this.fx.sparkle.explode(16, k.pot.x, k.pot.y - 14);
        this.tweens.add({ targets: k.pot, scaleX: 1.15, scaleY: 0.9, duration: 120, yoyo: true, repeat: 1 });
        this.tweens.add({ targets: k.nek, y: k.nek.y - 3, duration: 140, yoyo: true });
      }
      if (q.c8sealed < C8.jars) { this.toast('FSSSH! Nek Lampir drops ' + (n > 1 ? 'the jars' : 'the jar') + ' into her pot. A puff of green smoke, and sealed for good. (' + q.c8sealed + ' / ' + C8.jars + ')', 'i_balang_hitam'); return; }
      this.c8Done();
    },
    c8Done: function () {
      var self = this, q = Q(), S = this.S;
      if (LC.ch8Step() !== 8) return;
      q.ch8 = 9; q.c8silt = C8.silt; S.kepeng += C8.reward3; S.stats.earned += C8.reward3;   // (first)
      LC.Audio.sfx('cheer');
      this.ui.say(this.ch2Lines(X.done), { onDone: function () { self.nekPot(false); LC.Audio.sfx('stage'); } });
      this.time.delayedCall(30000, function () { if (!self.leaving && !self.ui.isBlocking()) self.nekPot(false); });
    }
  });
})(window.LC);
