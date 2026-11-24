/* World, part 16 (v2.5): Sang Bualang the wind helper (B), Angin Bualang (U), and Pelita's daylight (see bualang.js).
 * Calling him (he rides the wind, so he takes a while), his swoop in, following you, Puting Beliung (he spins into an
 * enemy and flings it back dizzy), going home, catching up after you travel; your own gust; Nek Lampir's refusal to
 * work beside him; and the night as bright as day. Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var proto = LC.WorldScene.prototype, B = LC.BUALANG, X = LC.BUALANGTEXT;
  var DIRV = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] };
  var ADD = function () { return Phaser.BlendModes.ADD; };
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  // ---------------------------------------------------------------- hooks
  var createKampong = proto.createKampong;
  proto.createKampong = function () { createKampong.apply(this, arguments); this.createBualang(); };
  var updateBadang = proto.updateBadang;
  proto.updateBadang = function (time, dt, blocked) { updateBadang.apply(this, arguments); this.updateBualang(time, dt, blocked); };
  var nekRival = proto.nekRival;   // Nek Lampir works with you alone: the wind counts as company
  proto.nekRival = function () { return this.bual && !this.bual.leaving ? 'bualang' : nekRival.call(this); };
  // Pelita's daylight: at night, wherever Pelita is with you, everything is lit as if it were noon
  var updateLighting = proto.updateLighting;
  proto.updateLighting = function (time, dt) {
    if (!LC.pelitaSun() || !this.ghostHere || this.A.cave) {
      updateLighting.call(this, time, dt);
      // (the mine is still a mine: Pelita just lifts its dark further. v3.17.6: it used to make the lantern 1.5 times
      // bigger, which filled caves with white fog; see updateLighting)
      return;
    }
    var S = this.S, m = S.minutes, night = m >= 18 * 60 + 30 || m < 6 * 60;
    S.minutes = 12 * 60;
    try { updateLighting.call(this, time, dt); } finally { S.minutes = m; }
    if (night) {   // a hint of moonlight, so you still know it is night
      var t = this.dark.tintTopLeft, r = (t >> 16 & 255) * 0.9, g = (t >> 8 & 255) * 0.93, b = t & 255;
      this.dark.setVisible(true).setTint((r << 16) | (g << 8) | b);
    }
  };

  Object.assign(proto, {
    createBualang: function () {
      var was = this.bual && !this.bual.leaving;
      if (this.bualFx) { this.bualFx.forEach(function (o) { if (o && o.destroy) o.destroy(); }); }
      this.bual = null; this.bualFx = [];
      if (was && LC.hasBualang() && LC.bualangLeft.due() <= 0) {   // he was with you: he follows on the wind
        LC.bualangDueAt = Date.now() + B.catchUp * 1000; LC.bualangDur = B.catchUp; LC.bualangAng = Math.random() * Math.PI * 2;
        this.toast(X.catchUp, 'ic_wau');
      }
    },
    bualClosed: function () { return !!(this.A.cave || this.A.dim); },
    bualFoes: function () { return (this.enemies || []).filter(function (e) { return !e.dead && !e.away && !B.noFight[e.kind]; }); },
    bualFighting: function () {
      var p = this.player;
      return this.bualFoes().some(function (e) { return Math.hypot(e.spr.x - p.x, e.spr.y - p.y) < 220; });
    },

    // ================================================================ B: fly the wau
    bualangKey: function () {
      if (!LC.hasBualang() || this.sleeping || this.leaving || this.cutscene || this.reuniting || (this.ui && this.ui.isBlocking())) return;
      var b = this.bual;
      if (b && b.leaving) return;
      if (b) {
        if (this.bualFighting()) {
          if (b.cd > 0.6) { this.ui.floatText(b.x, b.y - 30, 'Hold on!', '#d8ecff'); return; }
          b.cd = 0; this.bualAttack(true);
        } else this.bualLeave(X.home);
        return;
      }
      var due = LC.bualangLeft.due();
      if (due > 0) { this.toast(X.onWay + '... (' + Math.ceil(due) + 's)', 'ic_wau'); return; }
      if (this.A.underwater) { this.toast(X.water, 'ic_wau'); LC.Audio.sfx('error'); return; }
      var rest = LC.bualangLeft.rest();
      if (rest > 0) { this.toast(X.resting + '... (' + Math.ceil(rest) + 's)', 'ic_wau'); LC.Audio.sfx('error'); return; }
      var dur = this.bualClosed() ? B.arrive.closed : B.arrive.open;
      LC.bualangDueAt = Date.now() + dur * 1000; LC.bualangDur = dur; LC.bualangAng = Math.random() * Math.PI * 2;
      LC.Audio.sfx('wind');
      var p = this.player, kite = this.add.image(p.x + 6, p.y - 20, 'i_wau_bualang').setDepth(9550);
      this.tweens.add({ targets: kite, x: p.x + 40, y: p.y - 110, alpha: 0, angle: 20, duration: 1400, ease: 'Sine.easeOut', onComplete: function () { kite.destroy(); } });
      this.toast(X.call + ' (about ' + dur + 's' + (dur > B.arrive.open ? ': the wind has to find its way in here' : '') + ')', 'ic_wau');
    },

    updateBualang: function (time, dt, blocked) {
      var self = this, p = this.player;
      // on the way: he lands when the time is up (and when nothing is in the way of a swoop)
      if (!this.bual && LC.bualangDueAt && Date.now() >= LC.bualangDueAt && !blocked && !this.leaving) {
        LC.bualangDueAt = 0;
        if (!LC.hasBualang()) return;
        if (this.A.underwater) { this.toast(X.water, 'ic_wau'); return; }
        this.bualArrive();
      }
      var b = this.bual;
      if (!b || b.leaving || blocked) return;
      var fight = this.bualFighting();
      if (fight) { b.idleT = 0; b.fought = true; }
      else if ((b.idleT += dt) > (b.missedRun ? B.missed : b.fought ? B.idleAfterFight : B.idle)) { this.bualLeave(b.missedRun ? X.missed : b.fought ? pick(X.leave) : X.bored); return; }
      // he floats a little above and beside you, on the other side from Nek Lampir's spot
      if (!b.busy) {
        var dv = DIRV[this.dir] || DIRV.down, tx = p.x + (dv[0] === 0 ? 22 : -dv[0] * 20), ty = p.y - 6 + Math.sin(time / 380) * 3;
        var k = Math.min(1, dt * 3);
        b.x += (tx - b.x) * k; b.y += (ty - b.y) * k;
        b.spr.setPosition(Math.round(b.x), Math.round(b.y)).setDepth(b.y + 4).setFlipX(p.x < b.x);
        b.whirl.setPosition(Math.round(b.x), Math.round(b.y) + 3).setDepth(b.y + 3);
        b.glow.setPosition(Math.round(b.x), Math.round(b.y) - 10);
      }
      b.cd -= dt;
      if (fight && b.cd <= 0 && !b.busy) this.bualAttack(false);
    },
    bualArrive: function () {
      var p = this.player, a = LC.bualangAng || 0, sx = p.x + Math.cos(a) * 320, sy = p.y + Math.sin(a) * 220 - 60;
      var b = this.bual = { x: p.x + 22, y: p.y - 6, cd: 0.6, idleT: 0, fought: false, leaving: false, busy: true, missedRun: false };
      b.whirl = this.add.sprite(sx, sy + 3, 'puting_0').setOrigin(0.5, 1).setAlpha(0.7).setScale(0.8);
      b.whirl.play('puting_spin');
      b.spr = this.add.sprite(sx, sy, 'npc_bualang_0').setOrigin(0.5, 1).setDepth(9000);
      b.spr.play('bualang_fly');
      b.glow = this.add.image(sx, sy - 10, 'glow').setBlendMode(ADD()).setDepth(9001).setTint(0xd8f0ff).setScale(0.6).setAlpha(0.5);
      this.bualFx = [b.spr, b.whirl, b.glow];
      LC.Audio.sfx('wind');
      var self = this;
      this.tweens.add({ targets: [b.spr, b.whirl, b.glow], x: b.x, duration: 650, ease: 'Quad.easeOut' });
      this.tweens.add({ targets: [b.spr, b.glow], y: b.y, duration: 650, ease: 'Quad.easeOut' });
      this.tweens.add({ targets: b.whirl, y: b.y + 3, duration: 650, ease: 'Quad.easeOut', onComplete: function () {
        b.busy = false;
        self.fx.leaf.explode(10, b.x, b.y - 4);
        if (self.bualFighting()) self.toast('Sang Bualang: "' + pick(X.come) + '"', 'ic_wau');
        else { b.missedRun = true; self.ui.floatText(b.x, b.y - 30, 'Eh?', '#d8ecff'); }
      } });
      this.time.addEvent({ delay: 16, repeat: 45, callback: function () { if (b.glow.active) b.glow.setPosition(b.spr.x, b.spr.y - 10); } });
    },
    bualLeave: function (line) {
      var self = this, b = this.bual;
      if (!b || b.leaving) return;
      b.leaving = true;
      LC.bualangRestAt = Date.now() + B.rest * 1000;
      if (line) this.toast('Sang Bualang: "' + line + '"', 'ic_wau');
      LC.Audio.sfx('wind');
      this.fx.leaf.explode(8, b.x, b.y - 4);
      this.tweens.add({ targets: [b.spr, b.whirl, b.glow], x: b.x + 260, y: b.y - 200, alpha: 0, duration: 900, ease: 'Quad.easeIn', onComplete: function () {
        [b.spr, b.whirl, b.glow].forEach(function (o) { o.destroy(); });
        if (self.bual === b) self.bual = null;
      } });
    },
    // Puting Beliung: he spins into the enemy nearest you and flings everything around it back, dizzy
    bualAttack: function (now) {
      var self = this, b = this.bual, p = this.player, best = null, bd = B.spin.reach;
      this.bualFoes().forEach(function (e) {
        var d = Math.hypot(e.spr.x - p.x, e.spr.y - p.y);
        if (d < bd && Math.hypot(e.spr.x - b.x, e.spr.y - b.y) < B.spin.reach + 60) { bd = d; best = e; }
      });
      if (!best) { if (now) this.ui.floatText(b.x, b.y - 30, 'Where?', '#d8ecff'); return; }
      b.cd = B.spin.cd; b.busy = true;
      var e = best, tx = e.spr.x, ty = e.spr.y;
      if (Math.random() < 0.3 || now) this.ui.floatText(b.x, b.y - 30, pick(X.spins), '#d8ecff');
      LC.Audio.sfx('wind');
      this.tweens.add({ targets: [b.spr, b.whirl, b.glow], x: tx, duration: 220, ease: 'Quad.easeIn' });
      this.tweens.add({ targets: [b.spr, b.glow], y: ty - 2, duration: 220, ease: 'Quad.easeIn' });
      this.tweens.add({ targets: b.whirl, y: ty + 1, scale: 1.6, duration: 220, ease: 'Quad.easeIn', onComplete: function () {
        if (self.leaving || !b.spr.active) return;
        b.x = tx; b.y = ty - 2;
        self.bualSpinAt(tx, ty - 6);
        self.tweens.add({ targets: b.whirl, scale: 0.8, duration: 300, delay: 200 });
        self.time.delayedCall(350, function () { b.busy = false; });
      } });
    },
    bualSpinAt: function (x, y) {
      var self = this, P = B.spin;
      this.shockwave(x, y, P.r, 0xd8ecff);
      this.fx.leaf.explode(8, x, y);
      this.bualFoes().forEach(function (e) {
        var dx = e.spr.x - x, dy = (e.spr.y - 6) - y, d = Math.hypot(dx, dy);
        if (d > P.r + e.def.w) return;
        self.blowAway(e, dx, dy, d, e.def.boss ? P.bossDmg : P.dmg, e.def.boss ? P.bossPush : P.push, e.def.boss ? P.bossDizzy : P.dizzy, '#d8ecff');
      });
    },
    // one enemy, caught by the wind: a little damage, flung back, and dizzy for a moment (a stone statue just cracks)
    blowAway: function (e, dx, dy, d, dmg, push, dizzy, color) {
      var stone = e.stoneT > 0, n = stone ? dmg * 2 : dmg;
      e.hp -= n; e.hurtT = 0.14; e.spr.setTintFill(0xe8f4ff);
      if (!stone) {
        e.windT = 0; e.strikeT = 0; e.restT = dizzy; e.atkCd = Math.max(e.atkCd, dizzy + 0.3);
        e.kx = dx / (d || 1) * push; e.ky = dy / (d || 1) * push;
        this.tweens.add({ targets: e.spr, angle: { from: 0, to: 360 }, duration: 420, ease: 'Quad.easeOut', onComplete: function () { e.spr.setAngle(0); } });
      }
      this.ui.floatText(e.spr.x, e.spr.y - e.spr.height - 2, (stone ? 'CRACK! ' : pick(X.dizzy) + ' ') + n, color);
      if (e.hp <= 0) this.enemyDie(e);
    },

    // ================================================================ U: Angin Bualang, your own gust
    anginKey: function () {
      if (!LC.hasBualang() || this.sleeping || this.leaving || this.cutscene || this.reuniting || (this.ui && this.ui.isBlocking())) return;
      var left = LC.bualangLeft.gust();
      if (left > 0) { this.toast('Angin Bualang is gathering again... (' + Math.ceil(left) + 's)', 'ic_angin'); LC.Audio.sfx('error'); return; }
      var self = this, G = B.gust, p = this.player, x = p.x, y = p.y - 8, hit = 0;
      LC.anginAt = Date.now() + G.cd * 1000;
      LC.Audio.sfx('wind');
      this.shockwave(x, y, G.r, 0xffffff);
      this.time.delayedCall(90, function () { if (!self.leaving) self.shockwave(x, y, G.r * 0.7, 0xd8ecff); });
      for (var i = 0; i < 14; i++) {   // streaks of wind flying outward
        var a = i / 14 * Math.PI * 2, s = this.add.image(x + Math.cos(a) * 10, y + Math.sin(a) * 7, 'px').setDepth(9550).setTint(0xe8f4ff).setScale(2.4, 0.6).setRotation(a).setAlpha(0.9);
        this.tweens.add({ targets: s, x: x + Math.cos(a) * G.r, y: y + Math.sin(a) * G.r * 0.65, alpha: 0, duration: 380, ease: 'Quad.easeOut', onComplete: function (tw, tg) { tg[0].destroy(); } });
      }
      this.fx.leaf.explode(12, x, y + 4);
      this.tweens.add({ targets: p, scaleY: 0.9, duration: 80, yoyo: true });
      this.bualFoes().forEach(function (e) {
        var dx = e.spr.x - x, dy = (e.spr.y - 6) - y, d = Math.hypot(dx, dy);
        if (d > G.r + e.def.w) return;
        hit++;
        self.blowAway(e, dx, dy, d, e.def.boss ? G.bossDmg : G.dmg, e.def.boss ? G.bossPush : G.push, e.def.boss ? G.bossDizzy : G.dizzy, '#ffffff');
      });
      this.anginClears(x, y);
      this.ui.floatText(x, y - 26, 'Angin Bualang!', '#ffffff');
      if (hit) { this.cameras.main.shake(120, 0.003); LC.Audio.sfx('hit'); }
    },
    // the gust blows away darkness, fog and whirlwinds
    anginClears: function (x, y) {
      var self = this, G = B.gust;
      if (this.c6 && this.c6.dark) { var d = this.c6.dark; this.c6.dark = null; this.tweens.killTweensOf(d); this.tweens.add({ targets: d, alpha: 0, duration: 300, onComplete: function () { d.destroy(); } }); this.toast('The wind blows the darkness away!', 'ic_angin'); }
      (this.fogs || []).forEach(function (f) {
        var a0 = f.img.alpha;
        self.tweens.add({ targets: f.img, alpha: 0, duration: 400, onComplete: function () { self.tweens.add({ targets: f.img, alpha: a0, duration: 3000, delay: 8000 }); } });
      });
      if (this.c7 && this.c7.twisters) this.c7.twisters.forEach(function (t) { if (Math.hypot(t.spr.x - x, t.spr.y - y) < G.r * 1.3) t.life = 0; });
    }
  });
})(window.LC);
