/* World, part 14 (v2.4.1): Nek Lampir, your grumpy helper (see neklampir.js). Calling her (C), her refusals when you
 * are not alone, following you and blinking away from enemies, Serbuk Lada (pepper powder), Bulatan Hijau (the green
 * circle of herbs: half the hurt inside it), pulling you out of danger, the paid teleport, and the afternoon she makes
 * peace with Nenek. Simulated on your own device, like the enemies. Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var proto = LC.WorldScene.prototype, N = LC.NEK, X = LC.NEKTEXT;
  var DIRV = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] };
  var ADD = function () { return Phaser.BlendModes.ADD; };
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function Q() { return LC.State.s.quests; }

  // ---------------------------------------------------------------- hooks
  var createKampong = proto.createKampong;
  proto.createKampong = function () { createKampong.apply(this, arguments); this.createNek(); };
  var updateBadang = proto.updateBadang;
  proto.updateBadang = function (time, dt, blocked) { updateBadang.apply(this, arguments); this.updateNek(time, dt, blocked); };
  // the green circle halves every blow, and she grabs you just before a blow would knock you down
  var playerHurt = proto.playerHurt;
  proto.playerHurt = function (dmg, e) {
    if (this.invuln > 0 || this.leaving || this.sleeping) return playerHurt.call(this, dmg, e);
    var S = this.S, n = this.nek, c = this.nekCircle, p = this.player;
    if (c && this.inNekCircle(p.x, p.y)) {
      dmg = Math.max(1, Math.ceil(dmg / 2));
      if (this.time.now > (c.saidT || 0)) { c.saidT = this.time.now + 1500; this.ui.floatText(p.x, p.y - 34, 'Bulatan Hijau!', '#b8ffa8'); }
    }
    var save = !!(n && !n.leaving && LC.nekLeft.rescue() <= 0 && S.hp - dmg <= S.maxHp * N.rescue.at);
    if (save) dmg = Math.max(0, Math.min(dmg, S.hp - 1));
    playerHurt.call(this, dmg, e);
    if (save && S.hp > 0 && !this.leaving && this.nek === n) this.nekRescue();
  };

  Object.assign(proto, {
    createNek: function () {
      var self = this, q = Q();
      this.nek = null; this.nekCircle = null; this.nekPeaceSpr = null;   // (the World scene survives travelling: nothing from the last place)
      if (q.nekPeaceGo && this.area === 'farm') {
        delete q.nekPeaceGo;
        this.time.delayedCall(700, function () { if (!self.leaving) self.nekPeace(); });
      }
    },

    // ================================================================ who else is here? (she works with you alone)
    nekRival: function () {
      if (this.A.underwater) return 'water';
      if (this.buddy || LC.badangBuddy()) return 'badang';
      if (this.c6duel) return 'duel';
      if (this.c6 && this.c6.ally) return 'tuah';
      if ((this.c4 && this.c4.allies && this.c4.allies.length) || this.jinnOn || this.war) return 'heroes';
      if (this.S.escort) return 'tanggang';
      if (Object.keys(this.remote || {}).length) return 'friends';
      return null;
    },
    nekFoes: function () { return (this.enemies || []).filter(function (e) { return !e.dead && !e.away && !N.noFight[e.kind]; }); },
    nekFighting: function () {
      var p = this.player;
      return this.nekFoes().some(function (e) { return Math.hypot(e.spr.x - p.x, e.spr.y - p.y) < 200; });
    },

    // ================================================================ C: call her, or (when she is here) the green circle
    nekKey: function () {
      if (!LC.hasNek() || this.sleeping || this.leaving || this.cutscene || this.reuniting || (this.ui && this.ui.isBlocking())) return;
      var n = this.nek;
      if (n && n.leaving) return;
      if (n) { if (this.nekFighting()) this.nekCastCircle(); else this.ui.openNekService(true); return; }
      var why = this.nekRival(), wait = LC.nekLeft.call();
      if (why) { this.toast('Nek Lampir: "' + X.refuse[why] + '"', 'ic_nek'); LC.Audio.sfx('error'); return; }
      if (wait > 0) { this.toast('Nek Lampir is still catching her breath... (' + Math.ceil(wait) + 's)', 'ic_nek'); LC.Audio.sfx('error'); return; }
      this.nekArrive();
      var self = this;
      if (this.nekFighting()) {
        this.toast('Nek Lampir: "' + pick(X.come) + (Math.random() < 0.3 ? ' ' + X.pelita : '') + '"', 'ic_nek');
        this.nek.cd = 0.8;
      } else this.time.delayedCall(450, function () { if (self.nek && !self.nek.leaving && !self.leaving) self.ui.openNekService(false); });
    },
    nekSpot: function () {   // a step behind you, on the side away from Pelita (or right beside you, if that is blocked)
      var p = this.player, dv = DIRV[this.dir] || DIRV.down;
      var tx = p.x - dv[0] * 24 - (dv[0] === 0 ? 20 : 0), ty = p.y - dv[1] * 18 + 3;
      if (this.blockedAt(tx, ty)) { tx = p.x + (dv[0] === 0 ? 20 : 0); ty = p.y + 3; if (this.blockedAt(tx, ty)) { tx = p.x; ty = p.y + 1; } }
      return { x: tx, y: ty };
    },
    nekArrive: function () {
      var t = this.nekSpot(), n = this.nek = { x: t.x, y: t.y, cd: 1, blinkT: 1, idleT: 0, chk: 0.5, fought: false, leaving: false };
      this.nekHideStall(true);
      n.spr = this.add.sprite(Math.round(t.x), Math.round(t.y), 'npc_lampir_0').setOrigin(0.5, 1).setDepth(t.y).setAlpha(0);
      n.spr.play('npc_lampir_idle');
      this.tweens.add({ targets: n.spr, alpha: 1, duration: 250 });
      this.nekPoof(t.x, t.y);
    },
    nekPoof: function (x, y) { LC.Audio.sfx('blink'); this.fx.smoke.explode(12, x, y - 10); this.fx.leaf.explode(4, x, y - 8); },
    // her own stall on Gunung Ledang stands empty while she is out
    nekHideStall: function (hide) {
      if (LC.villagerArea('lampir') !== this.area) return;
      var s = this.npcs.lampir;
      if (hide && s) {
        if (s.here) { this.solid[s.ty][s.tx] = false; this.objAt[s.ty][s.tx] = null; }
        s.spr.destroy(); delete this.npcs.lampir;
      } else if (!hide) this.placeVillager('lampir');
    },
    nekLeave: function (line, cd) {
      var self = this, n = this.nek;
      if (!n || n.leaving) return;
      n.leaving = true;
      if (line) this.toast('Nek Lampir: "' + line + '"', 'ic_nek');
      LC.nekCallAt = Date.now() + (cd === undefined ? N.callCd : cd) * 1000;
      this.nekPoof(n.spr.x, n.spr.y);
      this.tweens.add({ targets: n.spr, alpha: 0, scaleY: 0.3, duration: 260, onComplete: function () {
        n.spr.destroy();
        if (self.nek === n) self.nek = null;
        self.nekHideStall(false);
      } });
    },

    updateNek: function (time, dt, blocked) {
      this.updateNekCircle(time, dt);
      if (this.nekPeaceSpr && !blocked) {   // the peace scene is over (or was closed): she pops home
        var ps = this.nekPeaceSpr; this.nekPeaceSpr = null;
        this.nekPoof(ps.x, ps.y);
        this.tweens.add({ targets: ps, alpha: 0, scaleY: 0.3, duration: 260, onComplete: function () { ps.destroy(); } });
      }
      var self = this, n = this.nek, p = this.player;
      if (!n || n.leaving) return;
      if (!LC.hasNek()) { this.nekLeave(null, 0); return; }
      if (blocked) return;
      if ((n.chk -= dt) <= 0) {   // somebody else turned up: she leaves in a huff
        n.chk = 0.5;
        if (this.nekRival()) { this.nekLeave(null); this.toast('Nek Lampir: "' + X.huff + '" (She only helps when you are alone.)', 'ic_nek'); return; }
      }
      var fight = this.nekFighting();
      if (fight) { n.idleT = 0; n.fought = true; }
      else if ((n.idleT += dt) > (n.fought ? N.idleAfterFight : N.idle)) { this.nekLeave(n.fought ? pick(X.leave) : X.bored); return; }
      // she shuffles after you (and simply blinks back to your side if you run far ahead)
      var t = this.nekSpot(), k = Math.min(1, dt * 2.2), mx = (t.x - n.x) * k;
      n.x += mx; n.y += (t.y - n.y) * k;
      if (Math.hypot(p.x - n.x, p.y - n.y) > 180) this.nekBlink(t.x, t.y, false);
      // ...and blinks away from anything that comes too close to her
      n.blinkT -= dt;
      if (n.blinkT <= 0) {
        var close = this.nekFoes().filter(function (e) { return Math.hypot(e.spr.x - n.x, e.spr.y - n.y) < 22 + e.def.w; })[0];
        if (close) {
          var dx = p.x - close.spr.x, dy = p.y - close.spr.y, d = Math.hypot(dx, dy) || 1, spots = [[dx / d, dy / d], [-dy / d, dx / d], [dy / d, -dx / d]];
          var to = null;
          spots.some(function (s) { var x = p.x + s[0] * 28, y = p.y + s[1] * 20 + 3; if (!self.blockedAt(x, y)) { to = { x: x, y: y }; return true; } return false; });
          if (to) this.nekBlink(to.x, to.y, true); else n.blinkT = 1;
        }
      }
      // Serbuk Lada: pepper for anything that bites you
      n.cd -= dt;
      if (fight && n.cd <= 0) {
        var best = null, bd = N.pepper.reach;
        this.nekFoes().forEach(function (e) {
          var d = Math.hypot(e.spr.x - p.x, e.spr.y - p.y);
          if (d < bd && Math.hypot(e.spr.x - n.x, e.spr.y - n.y) < N.pepper.reach + 40) { bd = d; best = e; }
        });
        if (best) { n.cd = N.pepper.cd; this.nekThrow(best); }
      }
      if (Math.abs(mx) > 0.15) n.spr.setFlipX(mx < 0); else if (Math.abs(p.x - n.x) > 4) n.spr.setFlipX(p.x < n.x);
      n.spr.setPosition(Math.round(n.x), Math.round(n.y)).setDepth(n.y);
    },
    nekBlink: function (x, y, away) {
      var n = this.nek;
      this.nekPoof(n.x, n.y);
      n.x = x; n.y = y; n.blinkT = N.blink;
      n.spr.setPosition(Math.round(x), Math.round(y)).setDepth(y);
      this.fx.smoke.explode(10, x, y - 10);
      if (away && Math.random() < 0.4) this.ui.floatText(x, y - 26, Math.random() < 0.5 ? 'Hmph!' : 'Not me, you fool!', '#e8d8b8');
    },

    // ================================================================ Serbuk Lada: a pouch of pepper, and a sneezing foe
    nekThrow: function (e) {
      var self = this, n = this.nek, sx = n.x, sy = n.y - 16, tx = e.spr.x, ty = e.spr.y - 6, o = { t: 0 };
      var d = Math.hypot(tx - sx, ty - sy), arc = 14 + d * 0.12;
      var bag = this.add.image(sx, sy, 'serbuk_lada').setDepth(9550);
      LC.Audio.sfx('toss');
      n.spr.setFlipX(tx < n.x);
      this.tweens.add({ targets: n.spr, scaleY: 0.9, duration: 80, yoyo: true });
      if (Math.random() < 0.18) this.ui.floatText(n.x, n.y - 26, pick(X.throws), '#e8d8b8');
      this.tweens.add({ targets: o, t: 1, duration: 240 + d * 1.4, onUpdate: function () {
        bag.setPosition(sx + (tx - sx) * o.t, sy + (ty - sy) * o.t - Math.sin(Math.PI * o.t) * arc).setAngle(o.t * 360);
      }, onComplete: function () { bag.destroy(); if (!self.leaving) self.nekPepper(tx, ty); } });
    },
    nekPepper: function (x, y) {
      var self = this, P = N.pepper;
      LC.Audio.sfx('sneeze');
      // a cloud of red-orange dust (it shows by day), with a warm glow in it (it shows at night)
      var dust = this.add.particles(0, 0, 'smoke', { emitting: false, speed: { min: 14, max: 34 }, angle: { min: 0, max: 360 }, lifespan: 650,
        alpha: { start: 0.9, end: 0 }, scale: { start: 0.35, end: 1.1 }, tint: [0xe8602a, 0xf29040, 0xd84a2a] }).setDepth(9545);
      dust.explode(12, x, y);
      this.time.delayedCall(900, function () { dust.destroy(); });
      for (var i = 0; i < 5; i++) {
        var a = i / 5 * Math.PI * 2, g = this.add.image(x, y, 'glow').setBlendMode(ADD()).setDepth(9540).setTint(i % 2 ? 0xe8602a : 0xf2a040).setScale(0.1).setAlpha(0.7);
        this.tweens.add({ targets: g, x: x + Math.cos(a) * P.r * 0.8, y: y + Math.sin(a) * P.r * 0.55 - 4, scale: 0.3, alpha: 0, duration: 520, ease: 'Quad.easeOut', onComplete: function (tw, tg) { tg[0].destroy(); } });
      }
      this.fx.dirt.explode(6, x, y);
      this.nekFoes().forEach(function (e) {
        var dx = e.spr.x - x, dy = (e.spr.y - 6) - y, d = Math.hypot(dx, dy);
        if (d > P.r + e.def.w) return;
        var stone = e.stoneT > 0, n = (e.def.boss ? P.bossDmg : P.dmg) * (stone ? 2 : 1);
        e.hp -= n; e.hurtT = 0.14; e.spr.setTintFill(0xffa060);
        if (!stone) {   // ah... CHOO! It staggers back, rubbing its eyes
          e.windT = 0; e.strikeT = 0; e.restT = e.def.boss ? P.bossStagger : P.stagger; e.atkCd = Math.max(e.atkCd, e.restT + 0.3);
          var k = e.def.boss ? 30 : 90; e.kx = dx / (d || 1) * k; e.ky = dy / (d || 1) * k;
        }
        self.ui.floatText(e.spr.x, e.spr.y - e.spr.height - 2, (stone ? 'CRACK! ' : 'ACHOO! ') + n, '#ffb070');
        if (e.hp <= 0) self.enemyDie(e);
      });
    },

    // ================================================================ Bulatan Hijau: a green circle of crushed herbs
    inNekCircle: function (x, y) {
      var c = this.nekCircle, R = N.circle.r;
      if (!c) return false;
      var dx = (x - c.x) / R, dy = (y - 4 - c.y) / (R * 0.65);
      return dx * dx + dy * dy < 1;
    },
    nekCastCircle: function () {
      var n = this.nek, p = this.player, left = LC.nekLeft.circle();
      if (left > 0) { this.toast('Nek Lampir is still grinding fresh herbs for the circle... (' + Math.ceil(left) + 's)', 'ic_bulatan'); LC.Audio.sfx('error'); return; }
      LC.nekCircleAt = Date.now() + N.circle.cd * 1000;
      this.nekCircleEnd();
      var c = this.nekCircle = { x: p.x, y: p.y - 4, t: N.circle.dur, a: 0 };
      c.g = this.add.graphics().setDepth(3);
      c.glow = this.add.image(c.x, c.y, 'glow').setBlendMode(ADD()).setDepth(4).setTint(0x7aff6a).setScale(1.2, 0.7).setAlpha(0);
      this.tweens.add({ targets: c.glow, alpha: 0.4, duration: 300 });
      LC.Audio.sfx('herbs');
      this.fx.leaf.explode(10, c.x, c.y);
      this.shockwave(c.x, c.y, N.circle.r, 0x7aff6a);
      if (n) { n.spr.setFlipX(c.x < n.x); this.tweens.add({ targets: n.spr, scaleY: 1.12, duration: 120, yoyo: true }); this.ui.floatText(n.x, n.y - 26, 'Bulatan Hijau!', '#b8ffa8'); }
      this.toast('Nek Lampir: "' + X.circle + '" (Inside the green circle, every blow hurts you half as much, for ' + N.circle.dur + ' seconds.)', 'ic_bulatan');
    },
    updateNekCircle: function (time, dt) {
      var c = this.nekCircle;
      if (!c) return;
      c.t -= dt; c.a += dt * 0.8;
      if (c.t <= 0) { this.nekCircleEnd(); return; }
      var g = c.g, R = N.circle.r, fade = Math.min(1, c.t / 0.6), inside = this.inNekCircle(this.player.x, this.player.y);
      g.clear();
      g.fillStyle(0x3aa84a, (inside ? 0.3 : 0.18) * fade); g.fillEllipse(c.x, c.y, R * 2, R * 1.3);
      g.lineStyle(2, 0x9bff8a, 0.9 * fade); g.strokeEllipse(c.x, c.y, R * 2, R * 1.3);
      for (var i = 0; i < 12; i++) {   // little bits of serai and pandan drifting round the rim
        var a = c.a + i / 12 * Math.PI * 2;
        g.fillStyle(i % 2 ? 0xc8ffb0 : 0x5ad04a, fade); g.fillRect(Math.round(c.x + Math.cos(a) * (R - 5)) - 1, Math.round(c.y + Math.sin(a) * (R - 5) * 0.65) - 1, 2, 2);
      }
      if (Math.random() < dt * 2) this.fx.leaf.explode(1, c.x + (Math.random() - 0.5) * R * 1.6, c.y);
      c.glow.setAlpha((0.3 + 0.12 * Math.sin(time / 200)) * fade);
    },
    nekCircleEnd: function () {
      var c = this.nekCircle;
      if (!c) return;
      c.g.destroy(); c.glow.destroy();
      this.nekCircle = null;
    },

    // ================================================================ out of danger: she grabs you by the collar
    nekSafeSpot: function () {   // the place's arrival points can always be walked from: the one farthest from any enemy
      var self = this, area = this.area, p = this.player, foes = this.nekFoes(), cands = [this.tilePx(this.A.home)];
      Object.keys(LC.AREAS).forEach(function (k) { (LC.AREAS[k].exits || []).forEach(function (e) { if (e.to === area) cands.push(self.tilePx({ x: e.sx, y: e.sy })); }); });
      var scored = cands.filter(function (c) { return !self.blockedAt(c.x, c.y); }).map(function (c) {
        return { c: c, d: foes.reduce(function (m, e) { return Math.min(m, Math.hypot(e.spr.x - c.x, e.spr.y - c.y)); }, 1e9), me: Math.hypot(c.x - p.x, c.y - p.y) };
      }).sort(function (a, b) { return b.d - a.d; });
      var away = scored.filter(function (s) { return s.me > 90; })[0] || scored[0];
      return away ? away.c : { x: p.x, y: p.y };
    },
    nekRescue: function () {
      var self = this, n = this.nek, p = this.player, to = this.nekSafeSpot();
      LC.nekRescueAt = Date.now() + N.rescue.cd * 1000;
      this.invuln = Math.max(this.invuln, 1.6);
      this.ui.floatText(p.x, p.y - 30, X.rescue, '#e8d8b8');
      this.nekPoof(p.x, p.y);
      this.fx.smoke.explode(16, p.x, p.y - 8);
      this.cameras.main.flash(260, 140, 230, 150);
      p.setPosition(to.x, to.y);
      this.cameras.main.centerOn(to.x, to.y);
      var nx = to.x - 20, ny = to.y + 3;
      if (this.blockedAt(nx, ny)) { nx = to.x + 20; if (this.blockedAt(nx, ny)) { nx = to.x; ny = to.y + 1; } }
      n.x = nx; n.y = ny; n.blinkT = N.blink; n.spr.setPosition(Math.round(nx), Math.round(ny)).setDepth(ny);
      this.fx.smoke.explode(16, to.x, to.y - 8); this.fx.leaf.explode(6, to.x, to.y - 8);
      (this.enemies || []).forEach(function (e) { e.windT = 0; e.strikeT = 0; });
      this.time.delayedCall(300, function () { self.toast(X.rescued, 'ic_nek'); });
    },

    // ================================================================ the paid teleport (no fight around)
    nekTeleport: function (to) {
      var self = this, S = this.S, A = LC.AREAS[to], price = LC.nekPrice(to);
      if (!A || LC.nekLeft.tp() > 0 || S.kepeng < price || this.leaving) return false;
      S.kepeng -= price;
      LC.nekTpAt = Date.now() + N.tp.cd * 1000;
      this.toast('Nek Lampir: "' + X.tpGo + '" (-' + price + ' kepeng)', 'ic_nek');
      if (this.nek) this.nekLeave(null);
      this.nekPoof(this.player.x, this.player.y);
      this.fx.smoke.explode(18, this.player.x, this.player.y - 8);
      this.cameras.main.flash(300, 140, 230, 150);
      this.time.delayedCall(250, function () { self.goArea(to, to === 'farm' ? self.homeSpot(LC.Net.isGuest() ? self.pc : 0) : self.tilePx(A.home), 'down'); });
      return true;
    },

    // ================================================================ she makes peace with Nenek (once, at 10 hearts)
    nekPeaceGo: function () {
      Q().nekPeaceGo = 1;
      this.nekPoof(this.player.x, this.player.y);
      this.cameras.main.flash(300, 140, 230, 150);
      this.goArea('farm', this.tilePx({ x: 6, y: 10 }), 'left');
    },
    nekPeace: function () {
      var q = Q(), p = this.player, x = p.x - 18, y = p.y + 1;
      q.nekLampir = 1;   // (first: the friendship, so a dialogue closed early can never lose it)
      this.nekPeaceSpr = this.add.sprite(x, y, 'npc_lampir_0').setOrigin(0.5, 1).setDepth(y).setFlipX(true);
      this.nekPeaceSpr.play('npc_lampir_idle');
      this.nekPoof(x, y);
      this.ui.say(this.ch2Lines(X.peace), { onDone: function () { LC.Audio.sfx('stage'); } });
    }
  });
})(window.LC);
