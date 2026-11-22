/* World, part 23 (v3.4): Chapter 11, Part 2, 1578 (see sulu2.js).
 *  - Pelita glows like old brass the day after Part 1; Pelita's stone lamp in Barunai opens on Kampong Ayer, 1578.
 *  - At sea in 1578 (LC.c11Past): both fleets sail behind you in a V; the Castilian galleons wait at anchor in the fog
 *    and you find them by their bells (louder the closer you are); later they lie aground on the reef. No docking: let
 *    Pelita's light fade to go home.
 *  - Under the galleons: cut three anchor ropes while lantern light sweeps the water (stay in the light and you are
 *    seen, and swim back to the start).
 *  - The flagship's deck: it rocks; allies swing across and strike beside you; two waves of sailors (they tumble
 *    overboard and swim for the boats), then the Capitán, while the other galleons fire at the deck (shadows warn you).
 *    He yields; the eclipse, the Bakunawa with Pelita's light in its eye, the fleet sails home, the pearls are split.
 * Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var T = 16, proto = LC.WorldScene.prototype, C = LC.C11, P2 = LC.C11.p2, X = LC.CH11TEXT2;
  var ADD = function () { return Phaser.BlendModes.ADD; };
  var PAST = { kayer: 1, lautsulu: 1, sauh11: 1, kapal11: 1 };
  function Q() { return LC.State.s.quests; }
  function st() { return LC.ch11Step(); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function past() { var s = st(); return !!LC.c11Past && s >= 9 && s <= 12; }
  function flagPos() { var q = Q(), f = P2.fleet; return q.c11cut ? { x: (f.x - 4 + 2.5) * T, y: (f.y + 9 + 1) * T } : { x: (f.x + 2.5) * T, y: (f.y + 1) * T }; }

  // the galleons only exist in 1578
  LC.AREAS.lautsulu.objects.forEach(function (o) { if (o.type !== 'galeon11') return; var w = o.when; o.when = function (S) { return !!LC.c11Past && w(S); }; });

  // ---------------------------------------------------------------- sounds
  var sfx = LC.Audio.sfx;
  LC.Audio.sfx = function (name) {
    var A = LC.Audio;
    if (name !== 'boom11') return sfx.apply(this, arguments);
    if (!A.ctx || A.ctx.state !== 'running' || !A.vol.sfx) return;
    var t = A.ctx.currentTime + 0.01;
    A.noise(t, 0.9, 0.38, 'lowpass', 380, 120); A.tone(t, 'sine', 90, 38, 0.6, 0.34);
  };
  LC.Audio.loceng11 = function (vol) {   // a ship's bell in the fog
    var A = LC.Audio;
    if (!A.ctx || A.ctx.state !== 'running' || !A.vol.sfx) return;
    var t = A.ctx.currentTime + 0.01;
    A.bell(A.freq(13), t, 1.1, vol); A.bell(A.freq(13), t + 0.42, 1.1, vol * 0.8);
  };

  // ---------------------------------------------------------------- hooks
  var createKampong = proto.createKampong;
  proto.createKampong = function () { createKampong.apply(this, arguments); this.createSulu2(); };
  var updateKampong = proto.updateKampong;
  proto.updateKampong = function (time, dt) { updateKampong.apply(this, arguments); this.updateSulu2(time, dt); };
  var objectAction = proto.objectAction;
  proto.objectAction = function (o, sl, it, isFood) { var a = this.sulu2ObjAction(o); return a !== undefined ? a : objectAction.apply(this, arguments); };
  var seeFuture = proto.seeFuture;
  proto.seeFuture = function () { var s = st(); if (s >= 8 && s <= 12) return this.vision11(); return seeFuture.apply(this, arguments); };
  var shipAction = proto.shipAction;
  proto.shipAction = function () { return past() ? this.shipAction2() : shipAction.apply(this, arguments); };
  var enemyDie = proto.enemyDie;
  proto.enemyDie = function (e) {
    if (this.area === 'kapal11' && e.kind === 'kapten11') return this.kaptenYield(e);
    if (this.area === 'kapal11' && e.kind === 'askar') return this.overboard(e);
    return enemyDie.apply(this, arguments);
  };
  var skyColor = proto.skyColor;
  proto.skyColor = function (m) {
    var col = skyColor.call(this, m);
    return this.area === 'sauh11' ? 0x3a4a7a : col;   // (deep, dark water under the galleons)
  };

  Object.assign(proto, {
    createSulu2: function () {
      var self = this, q = Q(), s = st(), a = this.area, c = this.c11;
      if (!PAST[a]) LC.c11Past = false;
      this.cameras.main.setRotation(0);
      c.p2 = { tick: 1, bellT: 1, hintT: 0, fleet: [], surround: false, sauh: null, deck: null };
      if (a === 'kayer' && s >= 8 && s <= 12) {
        LC.c11Past = true;
        if (s === 8 || !q.c11p2arrive) {
          q.c11p2arrive = 1; if (s === 8) { q.ch11 = 9; this.refreshWhen(); }   // (first; and the lead vinta appears at the walkway)
          this.time.delayedCall(900, function () { if (!self.leaving) self.ui.say(self.ch2Lines(X.arrive)); });
        } else this.time.delayedCall(900, function () { if (!self.leaving) self.toast(X.again, 'i_mutiara_kembar'); });
      }
      if (a === 'lautsulu' && past()) this.setupFleet();
      if (a === 'sauh11') this.setupSauh();
      if (a === 'kapal11' && s === 12) this.setupDeck();
    },
    updateSulu2: function (time, dt) {
      var c = this.c11, p2 = c && c.p2, S = this.S, q = Q();
      if (!p2 || !this.player) return;
      var blocked = this.ui.isBlocking() || this.sleeping || this.leaving;
      if ((p2.tick -= dt) <= 0 && !blocked && !this.cutscene) {
        p2.tick = 1;
        if (this.area === 'farm' && st() === 7 && !S.guest) {
          if (q.c11p2wait === undefined) q.c11p2wait = S.day;   // Part 2 opens the day after Part 1
          else if (S.day > q.c11p2wait && S.minutes >= P2.hookFrom && S.minutes < P2.hookTo) this.c11Hook2();
        }
      }
      if (p2.fleet.length) this.updateFleet(time, dt, blocked);
      if (p2.sauh) this.updateSauh(time, dt, blocked);
      if (p2.deck) this.updateDeck(time, dt, blocked);
    },
    sulu2ObjAction: function (o) {
      var self = this, s = st(), q = Q();
      if (o.type === 'helm11' && this.area === 'kayer') return { label: 'Take the helm of the lead vinta', fn: function () {
        LC.c11Past = true; LC.Audio.sfx('creak11'); self.goArea('lautsulu', self.tilePx({ x: 16.5, y: 40.5 }), 'right');
      } };
      if (o.type === 'helm11' && s >= 9 && s <= 12 && this.area !== 'kayer') return { label: 'The vinta', fn: function () { self.toast('Your fleet is waiting for you in 1578. (Pelita\'s stone lamp, by the Balai in Barunai.)', 'i_pedoman'); } };
      if (o.type === 'naik11b') return { label: 'Swim back up to the vinta', fn: function () { self.surface11(); } };
      if (o.type === 'tali11') return { label: q.c11rope && q.c11rope[o.i] ? 'A cut rope' : X.cut, fn: function () { self.cutRope(o); } };
      return undefined;
    },

    // ================================================================ step 7: Pelita glows again; step 8: the stone lamp
    c11Hook2: function () {
      var q = Q();
      if (st() !== 7) return;
      q.ch11 = 8;   // (first)
      LC.Audio.sfx('restu');
      if (this.ghost && this.ghost.visible) this.fx.sparkle.explode(16, this.ghost.x, this.ghost.y);
      this.ui.say(this.ch2Lines(X.hook));
    },
    vision11: function () {
      var self = this, A = LC.AREAS.kayer;
      A.sub = '1578: two kingdoms, one sea';
      LC.Audio.sfx('restu');
      this.ui.say(X.vision, { onDone: function () { LC.c11Past = true; self.cameras.main.flash(700, 255, 220, 150); self.goArea('kayer', self.tilePx(A.home), 'down'); } });
    },
    endVision11: function (lines) {
      var self = this;
      LC.c11Past = false; LC.Audio.sfx('chime');
      this.ui.say(lines || [{ text: LC.CH3TEXT2.fade }], { onDone: function () { self.goArea('barunai', self.tilePx({ x: 24, y: 8 }), 'down'); } });
    },

    // ================================================================ at sea, 1578: the fleets, the bells, the galleons
    setupFleet: function () {
      var self = this, c = this.c11, sh = c.ship, q = Q();
      var keys = ['vinta11_t0', 'vintab11_t0', 'vinta11_t0', 'vintab11_t0', 'vinta11_t0'], offs = [[-44, -30], [-44, 30], [-88, -58], [-88, 58], [-128, 0]];
      c.p2.fleet = keys.map(function (k, i) {
        var o = offs[i], ca = Math.cos(sh.ang), sa = Math.sin(sh.ang);
        var img = self.add.image(sh.x + o[0] * ca - o[1] * sa, sh.y + o[0] * sa + o[1] * ca, k).setRotation(sh.ang).setDepth(sh.y + 3);
        return { img: img, off: o, key: k.replace(/0$/, ''), ang: sh.ang, ph: Math.random() * 6 };
      });
      c.p2.surround = st() >= 11 && !!q.c11signal;
      if (!q.c11p2sea) { q.c11p2sea = 1; this.time.delayedCall(700, function () { if (!self.leaving) self.ui.say(self.ch2Lines(X.seaStart), { onDone: function () { if (!self.leaving) self.toast(X.legA, 'i_pedoman'); } }); }); }
      if (st() === 11 && q.c11cut && !q.c11drift) {
        q.c11drift = 1;
        this.time.delayedCall(800, function () { if (!self.leaving) self.ui.say(self.ch2Lines(X.drift)); });
      }
    },
    updateFleet: function (time, dt, blocked) {
      var self = this, c = this.c11, sh = c.ship, p2 = c.p2, q = Q(), s = st(), fp = flagPos();
      p2.fleet.forEach(function (f, i) {
        var tx, ty;
        if (p2.surround) { var a = i / p2.fleet.length * Math.PI * 2 + 0.4; tx = fp.x + Math.cos(a) * 92; ty = fp.y + Math.sin(a) * 70; }
        else { var ca = Math.cos(sh.ang), sa = Math.sin(sh.ang); tx = sh.x + f.off[0] * ca - f.off[1] * sa; ty = sh.y + f.off[0] * sa + f.off[1] * ca; }
        var dx = tx - f.img.x, dy = ty - f.img.y, d = Math.hypot(dx, dy), k = Math.min(1, dt * (p2.surround ? 0.6 : 1.6));
        f.img.x += dx * k; f.img.y += dy * k;
        if (d > 4) { var want = Math.atan2(dy, dx), da = want - f.ang; while (da > Math.PI) da -= Math.PI * 2; while (da < -Math.PI) da += Math.PI * 2; f.ang += clamp(da, -dt * 2, dt * 2); }
        f.img.setRotation(f.ang + Math.sin(time / 600 + f.ph) * 0.03).setDepth(f.img.y + 3);
        if (Math.floor(time / 300 + i) % 2 !== f.fr) { f.fr = Math.floor(time / 300 + i) % 2; f.img.setTexture(f.key + f.fr); }
        if (d > 6 && Math.random() < dt * 6) c.ship.wake.emitParticleAt(f.img.x - Math.cos(f.ang) * 20, f.img.y - Math.sin(f.ang) * 20, 1);
      });
      if (blocked) return;
      // the bells of the galleons in the fog
      if (s === 9) {
        var d = Math.hypot(sh.x - fp.x, sh.y - fp.y) / T;
        if ((q.c11p2leg || 0) < 1 && Math.hypot(sh.x - P2.legA.to[0] * T, sh.y - P2.legA.to[1] * T) < P2.legA.r * T) {
          q.c11p2leg = 1; LC.Audio.sfx('chime');
          this.ui.say(this.ch2Lines(X.kembar), { onDone: function () { if (!self.leaving) self.toast(X.legB, 'i_pedoman'); } });
          return;
        }
        if (d < P2.bellR && (p2.bellT -= dt) <= 0) { p2.bellT = 2.4; LC.Audio.loceng11(0.025 + 0.13 * (1 - d / P2.bellR)); }
        if (d < P2.find) {
          q.ch11 = 10; LC.Audio.sfx('drum');   // (first)
          this.ui.say(this.ch2Lines(X.found));
          return;
        }
        p2.hintT += dt;
        if (p2.hintT > 30) { p2.hintT = 0; this.toast((q.c11p2leg || 0) < 1 ? X.legA : X.legB, 'npc_lela11_0'); }
      }
    },
    shipAction2: function () {
      var self = this, c = this.c11, sh = c && c.ship, q = Q(), s = st();
      if (!sh) return null;
      var fp = flagPos(), near = Math.hypot(sh.x - fp.x, sh.y - fp.y) < 10 * T;   // (a galleon is big: anywhere alongside it)
      if (Math.hypot(sh.x - C.harbour.x * T, sh.y - C.harbour.y * T) < C.harbour.r * T) return { label: X.fade, fn: function () { self.endVision11(); } };
      if (!near) return null;
      if (s === 10 && !q.c11cut) return { label: X.dive, fn: function () { LC.Audio.sfx('dive'); self.goArea('sauh11', self.tilePx(LC.AREAS.sauh11.home), 'right'); } };
      if (s === 11 && !q.c11signal) return { label: X.signal, fn: function () {
        self.ui.openKulintang(function () {
          q.c11signal = 1; c.p2.surround = true; LC.Audio.sfx('cheer');
          self.ui.say(self.ch2Lines(X.signalWon));
        }, null, [P2.signal], 'The signal');
      } };
      if ((s === 11 && q.c11signal) || s === 12) return { label: X.board, fn: function () { q.ch11 = 12; LC.Audio.sfx('splash'); self.goArea('kapal11', self.tilePx(LC.AREAS.kapal11.home), 'right'); } };
      return null;
    },

    // ================================================================ under the galleons: the anchor ropes
    setupSauh: function () {
      var self = this, c = this.c11, q = Q();
      q.c11rope = q.c11rope || {};
      var pools = [[12, 7.5, 5, 2, 0.55], [18, 13.5, 6, 2.2, 0.42], [24.5, 9, 3.5, 4, 0.5]].map(function (P, i) {
        var img = self.add.image(P[0] * T, P[1] * T, 'glow').setBlendMode(ADD()).setTint(0xffd070).setScale(1.7).setDepth(9001).setAlpha(0.75);
        var ray = self.add.image(P[0] * T, -10, 'ray').setOrigin(0.5, 0).setBlendMode(ADD()).setTint(0xffe0a0).setScale(1.4, 3.5).setDepth(8998).setAlpha(0.35);
        return { img: img, ray: ray, cx: P[0] * T, cy: P[1] * T, ax: P[2] * T, ay: P[3] * T, sp: P[4], ph: i * 2.1 };
      });
      c.p2.sauh = { pools: pools, spot: 0, cut: null, bar: this.add.graphics().setDepth(9602) };
      this.objects.forEach(function (o) { if (o.type === 'tali11' && q.c11rope[o.i]) { var im = self.objImgs[o.id]; if (im) im.setTexture('tali11_cut'); } });
      if (!q.c11sauh) { q.c11sauh = 1; this.time.delayedCall(700, function () { if (!self.leaving) self.ui.say(X.sauh); }); }
    },
    updateSauh: function (time, dt, blocked) {
      var self = this, c = this.c11, sa = c.p2.sauh, p = this.player, R = 30, inLight = false;
      sa.pools.forEach(function (L) {
        var t = time / 1000 * L.sp + L.ph;
        L.img.setPosition(L.cx + Math.sin(t) * L.ax, L.cy + Math.cos(t * 0.7) * L.ay).setAlpha(0.6 + 0.15 * Math.sin(time / 200 + L.ph));
        L.ray.setPosition(L.img.x + 14, -10).setAngle(-8 + Math.sin(t) * 6);
        if (Math.hypot(p.x - L.img.x, (p.y - 8) - L.img.y) < R) inLight = true;
      });
      sa.bar.clear();
      if (blocked && !sa.cut) return;
      sa.spot = clamp(sa.spot + (inLight ? dt * P2.spotFill : -dt * P2.spotDrain), 0, 1);
      if (sa.spot > 0.02) {   // how close you are to being seen
        sa.bar.fillStyle(0x0a1418, 0.8).fillRect(p.x - 12, p.y - 34, 24, 4);
        sa.bar.fillStyle(sa.spot > 0.66 ? 0xff5040 : 0xffd070, 1).fillRect(p.x - 11, p.y - 33, Math.round(22 * sa.spot), 2);
      }
      if (sa.cut) {   // sawing through a rope
        sa.cut.t -= dt;
        var f = 1 - sa.cut.t / 1.6;
        sa.bar.fillStyle(0x0a1418, 0.85).fillRect(p.x - 16, p.y - 42, 32, 5); sa.bar.fillStyle(0x9ad8ff, 1).fillRect(p.x - 15, p.y - 41, Math.round(30 * f), 3);
        if (Math.random() < dt * 8) this.fx.bubble.explode(1, p.x + 6, p.y - 12);
        if (sa.cut.t <= 0) this.ropeCut(sa.cut.o);
      }
      if (sa.spot >= 1) {
        sa.spot = 0; sa.cut = null; this.cutscene = false;
        this.cameras.main.flash(300, 255, 230, 160); LC.Audio.sfx('splash');
        p.x = (LC.AREAS.sauh11.home.x + 0.5) * T; p.y = (LC.AREAS.sauh11.home.y + 0.8) * T;
        this.toast(X.spotted, 'ic_moon');
      }
    },
    cutRope: function (o) {
      var q = Q(), sa = this.c11.p2.sauh;
      if (!sa || (q.c11rope && q.c11rope[o.i])) { this.toast('This rope is already cut.', 'ic_moon'); return; }
      if (st() !== 10) return;
      sa.cut = { o: o, t: 1.6 }; this.cutscene = true;
      LC.Audio.sfx('swing'); this.toast(X.cutting, 'i_parang');
    },
    ropeCut: function (o) {
      var self = this, q = Q(), sa = this.c11.p2.sauh, im = this.objImgs[o.id];
      sa.cut = null; this.cutscene = false;
      q.c11rope = q.c11rope || {}; q.c11rope[o.i] = 1;
      if (im) { im.setTexture('tali11_cut'); this.tweens.add({ targets: im, angle: 6, duration: 200, yoyo: true }); }
      this.fx.bubble.explode(10, (o.x + 0.5) * T, (o.y + 0.5) * T); LC.Audio.sfx('chime');
      var n = Object.keys(q.c11rope).length;
      if (n >= P2.ropes) { q.c11cut = 1; q.ch11 = 11; this.toast(X.allCut, 'ic_glow'); }   // (first)
      else this.toast(X.cutDone.replace('%n', n), 'ic_glow');
      void self;
    },
    surface11: function () {
      var q = Q(), f = P2.fleet, sx = q.c11cut ? f.x - 10 : f.x - 6, sy = q.c11cut ? f.y + 10.5 : f.y + 0.5;
      LC.c11Past = true; LC.Audio.sfx('water');
      this.goArea('lautsulu', this.tilePx({ x: sx, y: sy }), 'right');
    },

    // ================================================================ the flagship's deck
    setupDeck: function () {
      var self = this, c = this.c11, q = Q(), cam = this.cameras.main;
      var d = c.p2.deck = { wave: 0, down: 0, need: 0, called: false, broadT: P2.deck.broadside, sprayT: 0.5, allyT: 2.5, allies: [], over: false, g: this.add.graphics().setDepth(1) };
      // the hull round the deck, and the rails
      var g = d.g, x0 = 6 * T, y0 = 7 * T, x1 = 40 * T, y1 = 19 * T;
      g.fillStyle(0x3a2414, 1); g.fillRect(x0 - 8, y0 - 6, x1 - x0 + 16, 6); g.fillRect(x0 - 8, y1, x1 - x0 + 16, 10);
      g.fillStyle(0x3a2414, 1); g.fillRect(4 * T - 6, 9 * T - 4, 2 * T + 6, 8 * T + 8); g.fillRect(40 * T, 9 * T - 4, 2 * T + 6, 8 * T + 8);
      g.lineStyle(3, 0x8a5a2b, 1); g.strokeRect(x0 - 2, y0 - 2, x1 - x0 + 4, y1 - y0 + 4);
      for (var px = x0; px <= x1; px += 24) { g.fillStyle(0x5a3a1e, 1); g.fillRect(px - 1, y0 - 5, 3, 5); g.fillRect(px - 1, y1, 3, 6); }
      // the other galleons and the allied fleet, all around
      [[-1, 2, 0.2], [22, 23.5, 3.1], [44, 3, 2.9]].forEach(function (G) { self.add.image(G[0] * T, G[1] * T, 'galeon11_t').setRotation(G[2]).setDepth(2).setAlpha(0.95); });
      [[2, 22, 0.4, 'vinta11_t0'], [14, 2.5, -0.2, 'vintab11_t0'], [38, 23.5, 3.4, 'vinta11_t0'], [30, 2, 0.1, 'vintab11_t0']].forEach(function (V) { self.add.image(V[0] * T, V[1] * T, V[3]).setRotation(V[2]).setDepth(2); });
      // your allies swing across on ropes
      var spots = [[10, 10, 'npc_damit_0', 'Damit'], [10, 15, 'npc_lela11_0', 'Lela'], [16, 9, 'npc11_barunai', 'Barunai'], [16, 16, 'npc11_tausug', 'Sulu'], [12, 12.6, 'npc11_tausug', 'Sulu'], [18, 12.8, 'npc11_barunai', 'Barunai']];
      this.cutscene = true;
      spots.forEach(function (sp, i) {
        var hx = sp[0] * T + 8, hy = (sp[1] + 1) * T, spr = self.add.sprite(hx, -20, sp[2]).setOrigin(0.5, 1).setDepth(hy);
        var rope = self.add.graphics().setDepth(hy - 1);
        var o = { t: 0 };
        self.tweens.add({ targets: o, t: 1, duration: 900, delay: 200 + i * 220, ease: 'Sine.easeIn', onUpdate: function () {
          var ax = hx - 60 + o.t * 60, ay = -20 + o.t * (hy + 20) - Math.sin(o.t * Math.PI) * 30;
          spr.setPosition(ax, ay); rope.clear(); rope.lineStyle(1, 0xc8b080, 0.9); rope.lineBetween(hx - 60, -40, ax, ay - 18);
        }, onComplete: function () { rope.destroy(); self.fx.dirt.explode(5, hx, hy); } });
        d.allies.push({ spr: spr, hx: hx, hy: hy, name: sp[3], busy: false });
      });
      LC.Audio.sfx('cheer');
      this.time.delayedCall(200 + spots.length * 220 + 900, function () {
        if (self.leaving) return;
        self.cutscene = false; d.ready = true;   // (the fight starts when these lines close, however they are closed)
        self.ui.say(X.boarding);
      });
      void cam; void q;
    },
    deckWave: function (n) {
      var d = this.c11.p2.deck;
      d.wave = n; d.down = 0; d.need = n === 3 ? 1 : P2.deck.waves[n - 1];
      if (n === 2) this.toast(X.wave2, 'askar_0');
      if (n === 3) { this.toast(X.wave3, 'kapten11_0'); LC.Audio.sfx('drum'); }
      if (n === 2) this.ropeSwingers(3);
      this.checkGroups();
      LC.Audio.setBattle(true, n === 3);
    },
    ropeSwingers: function (n) {   // sailors from the other galleons swing across (just for show: the real ones land)
      var self = this;
      for (var i = 0; i < n; i++) (function (i) {
        var spr = self.add.image(44 * T, 2 * T, 'askar_0').setOrigin(0.5, 1).setDepth(9000), tx = (26 + i * 4) * T, ty = (9 + i * 3) * T, o = { t: 0 };
        self.tweens.add({ targets: o, t: 1, duration: 800, delay: i * 250, onUpdate: function () { spr.setPosition(44 * T + (tx - 44 * T) * o.t, 2 * T + (ty - 2 * T) * o.t - Math.sin(o.t * Math.PI) * 40).setFlipX(true); }, onComplete: function () { spr.destroy(); self.fx.dirt.explode(4, tx, ty); } });
      })(i);
    },
    overboard: function (e) {
      var self = this, d = this.c11.p2.deck, s = e.spr, edgeY = s.y < 13 * T ? 6 * T : 20.5 * T;
      e.dead = true; e.respawn = 1e9; e.stoneT = 0; e.light.base = 0;
      if (s.anims.isPaused) s.anims.resume();
      LC.Audio.sfx('hit'); this.S.stats.kills = (this.S.stats.kills || 0) + 1;
      this.tweens.add({ targets: s, x: s.x + (Math.random() - 0.5) * 20, y: edgeY, angle: 200, duration: 520, ease: 'Quad.easeIn', onComplete: function () {
        self.fx.drop.explode(14, s.x, edgeY); LC.Audio.sfx('splash');
        s.setVisible(false).setAngle(0);
      } });
      if (Math.random() < 0.35) this.ui.floatText(s.x, s.y - 26, 'Splash!', '#9ad8ff');
      if (!d || d.over) return;
      if (e.g && e.g.when && d.wave === 3) return;   // (the Capitán's helpers do not count)
      d.down++;
      if (d.wave < 3 && d.down >= d.need) { var nx = d.wave + 1; this.time.delayedCall(1300, function () { if (!self.leaving && !d.over) self.deckWave(nx); }); }
    },
    broadside: function () {   // the other galleons fire at the deck: shadows show where the shot will fall
      var self = this, p = this.player, d = this.c11.p2.deck;
      LC.Audio.sfx('boom11'); this.cameras.main.shake(200, 0.003);
      this.toast(X.broadside, 'meriam11');
      for (var i = 0; i < 4; i++) {
        var x = p.x + (i ? (Math.random() - 0.5) * 120 : 0), y = p.y - 4 + (i ? (Math.random() - 0.5) * 70 : 0);
        x = clamp(x, 7 * T, 39 * T); y = clamp(y, 8 * T, 18.5 * T);
        (function (x, y, k) { self.time.delayedCall(k * 180, function () {
          if (self.leaving || d.over) return;
          var g = self.add.graphics().setDepth(y - 2);
          g.fillStyle(0x1a1008, 0.45).fillEllipse(x, y, P2.deck.shotR * 2, P2.deck.shotR * 1.3); g.lineStyle(1, 0xff7040, 0.9).strokeEllipse(x, y, P2.deck.shotR * 2, P2.deck.shotR * 1.3);
          self.tweens.add({ targets: g, alpha: 0.4, duration: 150, yoyo: true, repeat: -1 });
          self.time.delayedCall(1000, function () {
            g.destroy();
            if (self.leaving || d.over) return;
            var ball = self.add.image(x, y - 90, 'pebble').setScale(3).setTint(0x2a2a32).setDepth(9599);
            self.tweens.add({ targets: ball, y: y, duration: 180, ease: 'Quad.easeIn', onComplete: function () {
              ball.destroy(); LC.Audio.sfx('boom11'); self.fx.pebble.explode(10, x, y - 2); self.fx.smoke.explode(6, x, y - 6); self.cameras.main.shake(90, 0.003);
              if (Math.hypot(self.player.x - x, self.player.y - 4 - y) < P2.deck.shotR) self.playerHurt(P2.deck.shotDmg, { spr: { x: x, y: y } });
            } });
          });
        }); })(x, y, i);
      }
    },
    allyStrike: function () {
      var self = this, d = this.c11.p2.deck, live = (this.enemies || []).filter(function (e) { return !e.dead && !e.away && e.spr.visible; });
      if (!live.length) return;
      var free = d.allies.filter(function (a) { return !a.busy; });
      if (!free.length) return;
      var a = pick(free), e = live.reduce(function (b, x) { return !b || Math.hypot(x.spr.x - a.hx, x.spr.y - a.hy) < Math.hypot(b.spr.x - a.hx, b.spr.y - a.hy) ? x : b; }, null);
      var side = a.hx < e.spr.x ? -1 : 1;
      a.busy = true; a.spr.setFlipX(side > 0);
      this.tweens.add({ targets: a.spr, x: e.spr.x + side * 14, y: e.spr.y, duration: 280, ease: 'Quad.easeIn', onComplete: function () {
        if (!e.dead && !e.away) {
          var dmg = e.def.boss ? 1 : 2;
          e.hp -= dmg; e.hurtT = 0.1; e.spr.setTintFill(0xffffff);
          LC.Audio.sfx('hit'); self.fx.sparkle.explode(5, e.spr.x, e.spr.y - 14);
          self.ui.floatText(e.spr.x, e.spr.y - 30, a.name + '! ' + dmg, '#ffd166');
          if (e.hp <= 0) self.enemyDie(e);
        }
        self.tweens.add({ targets: a.spr, x: a.hx, y: a.hy, duration: 420, ease: 'Quad.easeOut', onComplete: function () { a.busy = false; } });
      } });
    },
    updateDeck: function (time, dt, blocked) {
      var self = this, d = this.c11.p2.deck, cam = this.cameras.main;
      cam.setRotation(Math.sin(time / 1500) * 0.014);   // the deck rolls
      if ((d.sprayT -= dt) <= 0) { d.sprayT = 0.4 + Math.random() * 0.5; var top = Math.random() < 0.5; this.fx.drop.explode(3, (6 + Math.random() * 34) * T, top ? 6.5 * T : 19.8 * T); }
      d.allies.forEach(function (a) { if (!a.busy) a.spr.setY(a.hy + Math.sin(time / 500 + a.hx) * 0.6).setDepth(a.hy); });
      // Each part of the story moves on when its lines close: a dialogue closed early (the pause button, say) skips its
      // onDone, so nothing important waits for one.
      var talking = this.ui.isBlocking() || this.leaving;
      if (d.ready && !d.wave && !talking) { this.deckWave(1); this.toast(X.deckHint, 'ic_glow'); }
      if (d.over && !talking) {
        if (d.phase === 'yield') this.deckEclipse();
        else if (d.phase === 'eclipse') this.deckPearls();
        else if (d.phase === 'pearls') { d.phase = 'leaving'; LC.Audio.sfx('stage'); this.toast('+1 Kalis Sulu, +15,000 kepeng, +2 Mutiara.', 'i_kalis'); this.cutscene = false; this.endVision11(X.end); }
        else if (d.phase === 'leaving') { d.phase = 'gone'; this.goArea('barunai', this.tilePx({ x: 24, y: 8 }), 'down'); }
      }
      if (blocked || this.cutscene || d.over || !d.wave) return;
      if ((d.allyT -= dt) <= 0) { d.allyT = 1.8 + Math.random(); this.allyStrike(); }
      if (d.wave === 3) {
        var boss = (this.enemies || []).filter(function (e) { return e.kind === 'kapten11' && !e.dead; })[0];
        if (boss && !boss.away) {
          if ((d.broadT -= dt) <= 0) { d.broadT = P2.deck.broadside + Math.random() * 2; this.broadside(); }
          if (!d.called && boss.hp <= boss.def.hp * 0.5) { d.called = true; this.toast(X.called, 'askar_0'); this.checkGroups(); }
        }
      }
    },
    kaptenYield: function (e) {
      var self = this, c = this.c11, d = c.p2.deck, q = Q(), S = this.S, s = e.spr;
      e.dead = true; e.respawn = 1e9; e.stoneT = 0; e.light.base = 0;
      if (s.anims.isPaused) s.anims.resume();
      s.stop(); s.clearTint(); this.tweens.add({ targets: s, scaleY: 0.85, y: s.y + 2, duration: 400 });
      d.over = true; this.cutscene = true;
      // (first: the chapter and its rewards, so closing the lines early never loses them)
      q.ch11 = 13; q.c11won2 = 1;
      if (!LC.State.add('kalis', 1)) q.c11kalisOwed = 1; LC.State.add('mutiara', 2); S.kepeng += P2.reward; S.stats.earned += P2.reward;
      this.doShared('kind', { n: 12 }, function () {});
      LC.Audio.setBattle(false); LC.Audio.sfx('cheer');
      (this.enemies || []).forEach(function (o) { if (!o.dead && !o.away && o !== e) { o.dead = true; o.respawn = 1e9; self.tweens.add({ targets: o.spr, alpha: 0, duration: 800 }); } });
      d.phase = 'wait';
      this.time.delayedCall(900, function () {
        if (self.leaving) return;
        d.phase = 'yield';
        self.ui.say(self.ch2Lines(X.yield));
      });
    },
    deckEclipse: function () {
      var self = this, c = this.c11, cam = this.cameras.main, d = c.p2.deck;
      cam.stopFollow(); cam.pan(22 * T, 8.5 * T, 1200, 'Sine.easeInOut');   // (the serpent rises off the north side, above the dialogue)
      var head = null, humps = [], glow = null, gongs = null;
      d.phase = 'eclipse';
      d.serp = function () { return { parts: humps.concat(head ? [head] : []).concat(glow ? [glow] : []), gongs: gongs }; };
      this.ui.say(this.ch2Lines(X.eclipse), {
        onLine: function (i) {
          if (self.leaving) return;
          if (i === 0) { self.tweens.add({ targets: c, eclipseF: 1, duration: 3000 }); LC.Audio.sfx('wind'); }
          if (i === 1) {
            for (var k = 0; k < 7; k++) { var h = self.add.image((5 + k * 2.4) * T, 6.4 * T, 'bakunawa11_body').setScale(1.5).setDepth(3).setAlpha(0); humps.push(h); self.tweens.add({ targets: h, alpha: 1, y: 5.4 * T, duration: 600, delay: k * 120 }); }
            head = self.add.image(23.5 * T, 9 * T, 'bakunawa11_1').setScale(2.2).setOrigin(0.5, 1).setDepth(4).setFlipX(true).setAlpha(0);
            self.tweens.add({ targets: head, alpha: 1, y: 6.8 * T, duration: 1000, ease: 'Back.easeOut' });
            var lit = self.addLight(23.5 * T, 4 * T, 0x8ae8ff, 2.6, false); lit.base = 0.9;
            glow = self.add.image(23.5 * T - 14, 6.8 * T - 50, 'glow').setBlendMode(ADD()).setTint(0xffe08a).setScale(0.6).setDepth(9001);
            self.tweens.add({ targets: glow, alpha: 0.4, duration: 500, yoyo: true, repeat: -1 });
            LC.Audio.sfx('roar11'); cam.shake(900, 0.007); self.fx.drop.explode(30, 23.5 * T, 6 * T);
          }
          if (i === 2 && head) self.tweens.add({ targets: head, angle: -8, duration: 900, yoyo: true });
          if (i === 3) gongs = self.time.addEvent({ delay: 480, repeat: 14, callback: function () { if (!self.leaving) LC.Audio.sfx('gongbeat11'); } });
          if (i === 5) self.tweens.add({ targets: c, eclipseF: 0, duration: 3000 });
          if (i === 6) { var all = humps.concat(head ? [head] : []).concat(glow ? [glow] : []); self.tweens.add({ targets: all, alpha: 0, y: '+=16', duration: 1600 }); LC.Audio.sfx('wave11'); }
        }
      });
    },
    deckPearls: function () {   // the eclipse is over (however its lines were closed): tidy up, then the pearls
      var c = this.c11, d = c.p2.deck, sp = d.serp ? d.serp() : null;
      if (sp) {
        if (sp.gongs) sp.gongs.remove();
        this.tweens.add({ targets: sp.parts, alpha: 0, duration: 800 });
      }
      this.tweens.killTweensOf(c); c.eclipseF = 0;
      d.phase = 'pearls';
      this.ui.say(this.ch2Lines(X.pearls));
    }
  });
})(window.LC);
