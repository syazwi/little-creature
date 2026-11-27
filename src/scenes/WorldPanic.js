/* World (v3.32): chickens that fly, and a kampung that panics at Maya's laugh.
 * - The Sunnyside chicken (and duck) face left, the other animals right: LC.FACES_LEFT keeps them walking forwards.
 * - Now and then a chicken flutters up and flies to its next spot instead of walking (wings up, wings down, its
 *   shadow left on the ground), and every chicken near you takes off when Hilai Maya rings out.
 * - Hilai Maya (H) in a place with people: everyone there screams, leaves their post and runs about in a fright
 *   (wide eyes, a "!" over their heads) for a few seconds, then walks back and gets on with what they were doing.
 * Also the "What's new" note for v3.32 (the silat and batu angkat pictures are in art-silat.js).
 * Mixed into LC.WorldScene. Loaded last of the game's files (after WorldMaya.js and UIBattlePad.js). */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var W = LC.WorldScene.prototype, Art = LC.Art, T = 16;
  var seen = null;
  try { seen = localStorage.getItem('littleCreature.newsSeen'); } catch (e) { /* storage blocked */ }
  LC.NEWS = {
    id: 'v3.32-silat',
    lines: [
      { text: '✦ Real silat ✦  Kesuma now shows you each move of the lesson: the salute, the horse stance, a punch, a parry, a kick, a lean away, a low sweep and a lock. Follow him on the beat and you do the same move; miss it and you wobble. At the batu angkat you crouch, heave the stone to your chest and hold it high over your head.' },
      { text: 'Laugh Hilai Maya (H) where people live and the whole place screams and runs about in a fright, then everyone calms down and goes back to work. Chickens now face the way they walk, and sometimes they flap up and fly.' }
    ].concat(seen === LC.NEWS.id || seen === 'v3.32-silat' ? [] : LC.NEWS.lines)
  };
  LC.FACES_LEFT = { chicken: 1, itik: 1 };
  var SHOUTS = ['Hantu!!', 'Lari!!', 'Tolong!!', 'Pontianak!!', 'Mak!!', 'Aaaah!!'];

  // ------------------------------------------------------------------ pictures, made the first time they are needed
  function chickenArt(scene) {
    if (scene.textures.exists('chicken_fly_0') || !scene.textures.exists('chicken_0')) return scene.textures.exists('chicken_fly_0');
    var f = scene.textures.getFrame('chicken_0'), c = document.createElement('canvas'); c.width = 16; c.height = 16;
    var x = c.getContext('2d'); x.drawImage(f.source.image, f.cutX, f.cutY, f.cutWidth, f.cutHeight, 0, 0, 16, 16);
    var d = x.getImageData(0, 0, 16, 16);
    function rows(from, to) {   // a copy of the chicken's rows (the shadow is rows 12-15)
      var o = []; for (var yy = 0; yy < 16; yy++) { var r = []; for (var xx = 0; xx < 16; xx++) { var k = (yy * 16 + xx) * 4; r.push(yy >= from && yy <= to && d.data[k + 3] > 200 ? 'rgb(' + d.data[k] + ',' + d.data[k + 1] + ',' + d.data[k + 2] + ')' : null); } o.push(r); }
      return o;
    }
    var G = '#e4a672', E = '#b86f50', L = '#f2c99a';
    // wings up (over the back), then wings down (spread below and behind); the body in the chicken's own pixels
    var up = [[1, 10, E], [1, 11, E], [2, 9, E], [2, 10, L], [2, 11, G], [2, 12, E], [3, 9, E], [3, 10, G], [3, 11, G], [3, 12, G], [3, 13, E]];
    var down = [[8, 13, G], [8, 14, E], [9, 12, G], [9, 13, G], [9, 14, E], [10, 12, E], [10, 13, G], [10, 14, E], [11, 13, E]];
    [up, down].forEach(function (wing, i) {
      Art.make(scene, 'chicken_fly_' + i, 16, 16, function (p) {
        rows(0, 11).forEach(function (r, yy) { r.forEach(function (col, xx) { if (col) p.px(xx, yy, col); }); });
        wing.forEach(function (q) { p.px(q[1], q[0], q[2]); });
      });
    });
    Art.make(scene, 'chicken_shadow', 16, 4, function (p) {
      for (var yy = 12; yy < 16; yy++) for (var xx = 0; xx < 16; xx++) { var k = (yy * 16 + xx) * 4; if (d.data[k + 3] > 10) p.px(xx, yy - 12, 'rgba(38,41,69,' + (d.data[k + 3] / 255).toFixed(2) + ')'); }
    });
    if (!scene.anims.exists('chicken_fly')) scene.anims.create({ key: 'chicken_fly', frames: [{ key: 'chicken_fly_0' }, { key: 'chicken_fly_1' }], frameRate: 14, repeat: -1 });
    return true;
  }
  // a villager running in a fright: their own look, wide eyes, two stepping frames (special pictures just bounce)
  function runArt(scene, vid) {
    var key = LC.villagerKey(vid), k0 = 'npc_' + key + '_r0';
    if (scene.anims.exists('npc_' + key + '_run')) return 'npc_' + key + '_run';
    var v = LC.villager(vid), L = v && v.look;
    if (!L || v.sprite || (Art.FOLK && Art.FOLK['npc_' + key + '_0']) || !Art.chibi) return null;
    var scared = {}; Object.keys(L).forEach(function (k) { scared[k] = L[k]; }); scared.eyeWide = true;
    Art.make(scene, k0, 16, 20, function (p) { Art.chibi(p, scared, { step: 1 }); });
    Art.make(scene, 'npc_' + key + '_r1', 16, 20, function (p) { Art.chibi(p, scared, { step: 2 }); });
    scene.anims.create({ key: 'npc_' + key + '_run', frames: [{ key: k0 }, { key: 'npc_' + key + '_r1' }], frameRate: 10, repeat: -1 });
    return 'npc_' + key + '_run';
  }
  LC.chickenFlyArt = chickenArt;   // (for tests)
  function markArt(scene) {   // a red "!" and a drop of sweat
    if (scene.textures.exists('panic_mark')) return;
    Art.make(scene, 'panic_mark', 8, 10, function (p) {
      var O = '#181425', R = '#e43b44', B = '#2ce8f5';
      for (var y = 0; y < 6; y++) { p.px(1, y, R); p.px(2, y, R); p.px(0, y, O); p.px(3, y, O); }
      p.px(1, 6, O); p.px(2, 6, O); p.px(1, 7, R); p.px(2, 7, R); p.px(0, 7, O); p.px(3, 7, O); p.px(1, 8, O); p.px(2, 8, O);
      p.px(6, 2, B); p.px(5, 3, B); p.px(6, 3, B); p.px(7, 3, '#ffffff'); p.px(6, 4, B); p.px(5, 4, B);
    });
  }

  Object.assign(W, {
    // ---------------------------------------------------------------- chickens in the air
    startFlight: function (c, tx, ty) {
      if (!chickenArt(this)) return false;
      var s = c.spr, d = Math.hypot(tx - s.x, ty - s.y);
      c.fly = { x0: s.x, y0: s.y, tx: tx, ty: ty, t: 0, dur: Math.max(0.45, d / 62), h: 7 + Math.random() * 7 };
      c.tx = tx; c.ty = ty; c.wait = 0;
      s.play('chicken_fly'); c.anim = 'chicken_fly';
      if (!c.shadow) c.shadow = this.add.image(s.x, s.y, 'chicken_shadow').setOrigin(0.5, 1);
      c.shadow.setVisible(true);
      if (Math.hypot(s.x - this.player.x, s.y - this.player.y) < 110 && Math.random() < 0.6) LC.Audio.sfx('cluck');
      return true;
    },
    flyCritter: function (c, dt) {
      var f = c.fly, s = c.spr;
      f.t += dt;
      var k = Math.min(1, f.t / f.dur), lift = Math.sin(Math.PI * k) * f.h;
      s.x = f.x0 + (f.tx - f.x0) * k; s.y = f.y0 + (f.ty - f.y0) * k;
      s.setOrigin(0.5, 1 + lift / 16).setDepth(s.y + 1);
      if (Math.abs(f.tx - f.x0) > 1) s.setFlipX(LC.FACES_LEFT[c.kind] ? f.tx > f.x0 : f.tx < f.x0);
      c.shadow.setPosition(s.x, s.y).setDepth(s.y - 1).setAlpha(1 - lift / 24);
      if (k >= 1) {
        c.fly = null; s.setOrigin(0.5, 1); c.shadow.setVisible(false);
        c.wait = 0.6 + Math.random() * 2; c.anim = '';
      }
    },
    // the next spot: now and then a chicken flies there instead of walking
    maybeFly: function (c) {
      if (!c.def || !c.def.fly || c.fly) return;
      if (Math.random() < 0.22 && Math.hypot(c.tx - c.spr.x, c.ty - c.spr.y) > 20) this.startFlight(c, c.tx, c.ty);
    },

    // ---------------------------------------------------------------- the kampung in a panic
    panicCrowd: function () {
      var self = this;
      return Object.keys(this.npcs || {}).filter(function (vid) { var n = self.npcs[vid]; return n && n.here && !n.ghost && !n.panic && n.spr && n.spr.visible && n.spr.active; });
    },
    startPanic: function (crowd) {
      var self = this, p = this.player, shouts = 0;
      markArt(this);
      crowd.forEach(function (vid, i) {
        var n = self.npcs[vid], run = runArt(self, vid);
        n.panic = { t: 4.5 + Math.random() * 2.5, hx: n.spr.x, hy: n.spr.y, tx: n.spr.x, ty: n.spr.y, back: false, run: run, ph: Math.random() * 6 };
        self.solid[n.ty][n.tx] = false; self.objAt[n.ty][n.tx] = null;
        self.panicTarget(n, true);
        if (run) n.spr.play(run); else n.spr.stop();
        n.mark = self.add.image(n.spr.x, n.spr.y - 22, 'panic_mark').setOrigin(0.5, 1).setDepth(9003);
        // a few of them scream (the ones nearest you first)
        if (shouts < 4 && Math.hypot(n.spr.x - p.x, n.spr.y - p.y) < 260) {
          shouts++;
          self.time.delayedCall(150 + i * 260, function () { if (n.spr.active && n.panic) self.ui.floatText(n.spr.x, n.spr.y - 26, SHOUTS[(i + Math.floor(Math.random() * 3)) % SHOUTS.length], '#ffd0d0'); });
        }
      });
      // and the chickens take off
      (this.critters || []).forEach(function (c) {
        if (!c.def || !c.def.fly || c.fly || Math.hypot(c.spr.x - p.x, c.spr.y - p.y) > 160) return;
        var best = null, bd = -1;
        for (var k = 0; k < 4; k++) { var q = self.randomFree(c.zone), d = Math.hypot(q.x - p.x, q.y - p.y); if (d > bd) { bd = d; best = q; } }
        self.time.delayedCall(Math.random() * 300, function () { if (c.spr.active && !c.fly) self.startFlight(c, best.x, best.y); });
      });
    },
    // run somewhere near home (away from you when you are close)
    panicTarget: function (n, first) {
      var P = n.panic, p = this.player, z = { x0: n.tx - 4, y0: n.ty - 3, x1: n.tx + 4, y1: n.ty + 3 }, best = null, bd = -1;
      for (var k = 0; k < (first ? 4 : 2); k++) {
        var q = this.randomFree(z), d = Math.hypot(q.x - p.x, q.y - p.y) + Math.random() * 30;
        if (d > bd) { bd = d; best = q; }
      }
      P.tx = best.x; P.ty = best.y;
    },
    updatePanic: function (time, dt) {
      var self = this;
      Object.keys(this.npcs || {}).forEach(function (vid) {
        var n = self.npcs[vid], P = n && n.panic;
        if (!P) return;
        if (!n.spr.active) { n.panic = null; if (n.mark) n.mark.destroy(); return; }
        var s = n.spr;
        if (!P.back && (P.t -= dt) <= 0) { P.back = true; P.tx = P.hx; P.ty = P.hy; }
        var dx = P.tx - s.x, dy = P.ty - s.y, d = Math.hypot(dx, dy), v = (P.back ? 34 : 72) * dt;
        if (d <= Math.max(1, v)) {
          if (P.back) {   // home again: back to what they were doing
            s.setPosition(P.hx, P.hy).setOrigin(0.5, 1).setDepth(P.hy);
            s.play('npc_' + LC.villagerKey(vid) + '_idle');
            if (n.here) { self.solid[n.ty][n.tx] = true; self.objAt[n.ty][n.tx] = n.o; }
            if (n.mark) { n.mark.destroy(); n.mark = null; }
            n.panic = null;
            return;
          }
          self.panicTarget(n, false);
        } else {
          var nx = s.x + dx / d * v, ny = s.y + dy / d * v;
          if (!P.back && (self.solidPx(nx, ny - 2) || self.solidPx(nx - 4, ny - 2) || self.solidPx(nx + 4, ny - 2))) self.panicTarget(n, false);
          else { s.x = nx; s.y = ny; }
          if (Math.abs(dx) > 1) s.setFlipX(dx < 0);
        }
        // a frantic bounce while they run (a calmer one on the way back)
        var hop = Math.abs(Math.sin(time / (P.back ? 140 : 70) + P.ph)) * (P.back ? 1 : 2);
        s.setOrigin(0.5, 1 + hop / 20).setDepth(s.y);
        if (n.mark) n.mark.setPosition(Math.round(s.x + 5), Math.round(s.y - 20 - hop)).setVisible(!P.back || P.t > -1.2);
      });
    }
  });

  // ------------------------------------------------------------------ hooks
  var hilaiKey = W.hilaiKey;
  W.hilaiKey = function () {
    var before = LC.hilaiAt, crowd = this.panicCrowd ? this.panicCrowd() : [], X = LC.MAYA_TEXT, none = X && X.hilaiNone;
    if (crowd.length && X) X.hilaiNone = 'The whole place screams and scatters! (Hihihi...) They will calm down in a moment.';
    try { hilaiKey.apply(this, arguments); } finally { if (X) X.hilaiNone = none; }
    if (LC.hilaiAt !== before && crowd.length) this.startPanic(crowd);
  };
  var updateFolk = W.updateFolk;
  W.updateFolk = function (time, dt) {
    updateFolk.apply(this, arguments);
    this.updatePanic(time, dt);
  };
})(window.LC);
