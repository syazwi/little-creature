/* World, Chapter 18: Bujang Belajar Mantera? (v3.19). See bujang.js. Story steps are saved the moment they happen,
 * before any dialogue; scenes that follow a dialogue run from the update loop once it has closed.
 *  - Kampung Tepian: the three bachelors and Tok Penghulu's purple rooster; after the chapter, their Pesta magic show.
 *  - Sekolah Mantera: Suraya's interview, Ilmu Terapung (a feather to keep up, durians to dodge), Kelas Pantul (shield the
 *    three from the practice rune), the fire, and the ritual at Pintu Empat Penjuru.
 *  - Bilik Gelap: Sani follows your footsteps in the dark (leave him behind and he freezes); he sings each rune awake.
 *  - Dewan Ujian: Ujian Cermin. The bachelors' mirrors are fixed-group enemies driven here (they hunt you or their own
 *    bachelor, each with its own trick); they cannot fall until the real one lands the last blow. In the finale your own
 *    Bayang Diri joins them, run by WorldBunianMirror.js through a stand-in trial (this.bunianTrial).
 *  - Mantera Empat Sekawan (Y): Kudin's smoke ring blinds, Leman's durian stuns, Sani's song makes them sway.
 * Mixed into LC.WorldScene. Loaded after WorldBunianMirror.js. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var W = LC.WorldScene.prototype, C = LC.C18, X = LC.BUJANG_TEXT, B = LC.BunianTrials, T = 16, WHO = C.who;
  function step(w) { return C.step(w.S); }
  function story(w, n) { w.S.quests.ch18 = n; LC.State.save(); }
  function done(w) { return step(w) >= C.end; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function cap(w) { return w.charAt(0).toUpperCase() + w.slice(1); }
  function ADD() { return Phaser.BlendModes.ADD; }
  function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

  var create = W.createKampong, update = W.updateKampong;
  W.createKampong = function () { create.apply(this, arguments); this.createBujang(); };
  W.updateKampong = function (time, dt) { update.apply(this, arguments); this.updateBujang(time, dt); };

  // ================================================================ talking and doors
  var objectAction = W.objectAction;
  W.objectAction = function (o) {
    var self = this, s = step(this), q = this.S.quests;
    if (!o) return objectAction.apply(this, arguments);
    switch (o.type) {
      case 'bujang18': return { label: 'Talk to ' + cap(o.who), fn: function () { self.bujangTalk(o); } };
      case 'bujang18_cellar': return { label: s === 4 ? 'Go down into the dark room' : 'Climb down to the dark room', fn: function () { self.goArea('gelap18', undefined, 'up'); } };
      case 'bujang18_out': return { label: 'Climb back up to the courtyard', fn: function () {
        self.goArea('mantera', self.tilePx({ x: C.cellar.x, y: C.cellar.y + 1 }), 'down');
      } };
      case 'bujang18_rune': {
        var lit = !!(q.c18runes && q.c18runes[o.idx]);
        return { label: lit ? 'A shining rune' : s === 4 ? 'Wake the rune (Sani sings)' : 'A dark rune stone', fn: function () { self.bujangRune(o); } };
      }
      case 'bujang18_door': return { label: s === 6 ? 'Pintu Empat Penjuru' : s === 7 && !q.c18exam ? 'Enter the exam hall' : 'The exam hall', fn: function () {
        if (s === 6) { self.bujangFire(); return; }
        if (s === 7 && !q.c18exam) { self.goArea('ujian18', undefined, 'up'); return; }
        self.toast(s >= C.end ? X.doorAfter : X.doorShut, 'pintu18_tutup');
      } };
      case 'bujang18_exit': return { label: 'Leave the exam hall', fn: function () { self.bujangLeaveExam(false); } };
      case 'bujang18_mirror': return { label: 'Look in the mirror', fn: function () {
        self.toast(s >= C.end || (q.c18round || 0) > o.idx ? 'A cracked mirror. Your reflection looks back, and winks.' : 'Your reflection looks back at you. It blinks a little late.', 'cermin18');
      } };
      case 'mantera_suraya':
        if (C.ready(this.S) && s >= 2 && s <= 7) return { label: 'Speak to Suraya', fn: function () { self.bujangSuraya(); } };
        return objectAction.apply(this, arguments);
      default: return objectAction.apply(this, arguments);
    }
  };
  // the feather: blow it up from anywhere near its shadow
  var getAction = W.getAction;
  W.getAction = function () {
    var L = this.bujang && this.bujang.lesson, self = this;
    if (L && L.kind === 'float' && !L.won && dist(this.player, L) < 18) {
      return { label: 'Blow the feather up! (' + L.lifts + ' / ' + C.feather.lifts + ')', fn: function () { self.floatLift(); } };
    }
    return getAction.apply(this, arguments);
  };

  // ================================================================ you, in the lessons and the exam
  var updatePlayer = W.updatePlayer;
  W.updatePlayer = function (dt, blocked) { var b = this.bujang; return updatePlayer.call(this, dt, blocked || !!(b && b.stunT > 0)); };
  var compSpeed = W.compSpeed;
  W.compSpeed = function () {
    var v = compSpeed ? compSpeed.apply(this, arguments) : 1, b = this.bujang;
    return b ? v * (b.songT > 0 ? 0.35 : b.slowT > 0 ? 0.55 : 1) : v;
  };
  // the mirrors cannot fall until the real bachelor lands the last blow; your Bayang Diri falls like any shadow
  var die = W.enemyDie;
  W.enemyDie = function (e) {
    var F = this.bujang && this.bujang.fight;
    if (!e || !F) return die.apply(this, arguments);
    var mr = F.mirrors.filter(function (m) { return m.e === e; })[0];
    if (mr) {
      if (mr.gone) return;
      e.hp = 1;
      if (!mr.cornered) this.cornerMirror18(F, mr);
      return;
    }
    if (F.twin === e) {
      var r = die.apply(this, arguments);
      if (e.dead && !F.twinGone) this.twinDown18(F);
      return r;
    }
    return die.apply(this, arguments);
  };
  var faint = W.faint;
  W.faint = function () {
    if (this.area === 'ujian18' && !this.leaving) { this.bujangLeaveExam(true); return; }
    return faint.apply(this, arguments);
  };

  Object.assign(W, {
    bujangLines: function (lines, opts) {
      this.ui.say(lines.map(function (l) { return Object.assign({ text: l[1] }, LC.SPEAKERS[l[0]] || {}); }), opts);
    },
    confetti18: function (x, y, n) {
      var b = this.bujang;
      if (b && b.confetti) b.confetti.explode(LC.Display ? LC.Display.effectCount(n || 24) : n || 24, x, y);
      LC.Audio.sfx('poof');
    },
    fireflies18: function (x, y, n) {
      var self = this;
      for (var i = 0; i < n; i++) (function (i) {
        var f = self.add.image(x + (Math.random() - 0.5) * 14, y + (Math.random() - 0.5) * 10, 'glow').setBlendMode(ADD()).setTint(i % 3 ? 0xd8ff8a : 0xfff2b0)
          .setScale(0.06 + Math.random() * 0.04).setDepth(9560);
        self.tweens.add({ targets: f, x: f.x + (Math.random() - 0.5) * 60, y: f.y - 30 - Math.random() * 40, alpha: { from: 1, to: 0 }, duration: 1600 + Math.random() * 1200, ease: 'Sine.easeOut', onComplete: function () { f.destroy(); } });
      })(i);
    },

    // ================================================================ setting up each place
    createBujang: function () {
      var self = this, S = this.S, q = S.quests, s = step(this), b = this.bujang = { born: this.time.now, stunT: 0, slowT: 0, songT: 0, lesson: null, fight: null, sani: null, practiseT: 3 };
      if (this.bujangCut) { this.bujangCut = false; this.cutscene = false; }
      b.confetti = this.add.particles(0, 0, 'confetti18', { emitting: false, speed: { min: 40, max: 110 }, angle: { min: 200, max: 340 }, gravityY: 140, lifespan: 1300,
        rotate: { min: 0, max: 360 }, alpha: { start: 1, end: 0.2 }, tint: [0xff5a7a, 0xffd166, 0x9be15d, 0x7fdcff, 0xc79bff] }).setDepth(9550);
      if (this.bujangNote) { var note = this.bujangNote; this.bujangNote = null; this.time.delayedCall(500, function () { self.toast(note, 'npc18_kudin_0'); }); }
      if (this.area === 'kampung' && s >= 1) this.makeRooster18();
      if (this.area === 'mantera' && C.ready(S)) {
        var door = this.objImgs.m_pintu18;
        if (door && s === 7 && !q.c18exam) door.setTexture('pintu18_buka');
        if (s === 6 || s === 7 && !q.c18exam) {   // the little fire by the bachelors
          var fx = 26.5 * T, fy = 11 * T;
          b.fire = this.add.image(fx, fy, 'unggun10').setOrigin(0.5, 1).setDepth(fy);
          this.addLight(fx, fy - 8, 0xffa040, 0.9, true);
        }
        if (s === 7 && q.c18exam) b.gradPending = true;
      }
      if (this.area === 'gelap18') this.createDark18();
      if (this.area === 'ujian18') this.createExam18();
    },
    makeRooster18: function () {
      var self = this, purple = this.textures.exists('ayam18_0'), r = this.add.sprite(11 * T, 19 * T, purple ? 'ayam18_0' : 'chicken_0').setOrigin(0.5, 1).setScale(1.1);
      if (purple) r.play('ayam18_walk'); else { r.setTint(0xc08aff); if (this.anims.exists('chicken_walk')) r.play('chicken_walk'); }
      this.bujang.rooster = r;
      function wander() {
        if (!r.active) return;
        var tx = (8.5 + Math.random() * 6) * T, ty = (18.6 + Math.random() * 0.7) * T;
        r.setFlipX(tx < r.x);
        self.tweens.add({ targets: r, x: tx, y: ty, duration: 1200 + Math.abs(tx - r.x) * 25, onUpdate: function () { r.setDepth(r.y); },
          onComplete: function () { self.time.delayedCall(1500 + Math.random() * 3000, wander); } });
      }
      wander();
    },

    // ================================================================ the bachelors
    bujangTalk: function (o) {
      var self = this, S = this.S, q = S.quests, s = step(this);
      if (this.area === 'kampung') {
        if (s === 1) {
          var k = this.objImgs.k_bujang18_kudin;
          if (k) this.confetti18(k.x, k.y - 18, 30);
          this.bujangLines(X.meet, { choices: [{ label: 'Join them!', fn: function () { self.bujangJoin(); } }, { label: 'Not today', fn: function () { self.bujangLines(X.later); } }] });
          return;
        }
        if (s >= C.end && LC.State.isPesta() && q.c18show !== S.day) { this.bujangShow(); return; }
        this.bujangLines([[o.who + '18', pick(X.after[o.who])]]);
        return;
      }
      if (this.area === 'mantera' && s === 6) { this.bujangFire(); return; }
      var t = X.talk[s];
      this.bujangLines([[o.who + '18', t ? t[o.who] : pick(X.after[o.who])]]);
    },
    bujangJoin: function () {
      story(this, 2);
      var got = LC.State.add('selempang18', 1);
      LC.Audio.sfx('chime');
      var k = this.objImgs.k_bujang18_kudin;
      if (k) this.confetti18(k.x, k.y - 18, 40);
      this.bujangLines(X.oath.concat(got ? [] : [['', 'Your bag is full, so Kudin ties the sash onto Pelita instead. (It is safe.)']]));
    },
    bujangShow: function () {
      var S = this.S, self = this;
      S.quests.c18show = S.day;
      S.ghost.joy = Math.min(100, (S.ghost.joy || 0) + 15);
      LC.State.save();
      WHO.forEach(function (who, i) {
        var im = self.objImgs['k_bujang18_' + who];
        if (!im) return;
        self.time.delayedCall(i * 500, function () {
          if (who === 'kudin') self.smokeRing18(im.x, im.y - 12, 40, 0xd8d8e0);
          if (who === 'leman') self.confetti18(im.x, im.y - 20, 30);
          if (who === 'sani' && self.note9) for (var n = 0; n < 5; n++) self.note9(im.x + (Math.random() - 0.5) * 20, im.y - 18, 0x9ae8e0);
        });
      });
      LC.Audio.sfx('cheer');
      this.bujangLines(X.show);
    },
    smokeRing18: function (x, y, r, tint) {
      var g = this.add.graphics().setDepth(9550), o = { t: 0 };
      this.tweens.add({ targets: o, t: 1, duration: 650, ease: 'Quad.easeOut',
        onUpdate: function () { g.clear(); g.lineStyle(4 * (1 - o.t) + 1, tint || 0xc8c8d0, 0.85 * (1 - o.t)); g.strokeEllipse(x, y, (6 + r * o.t) * 2, (4 + r * 0.6 * o.t) * 2); },
        onComplete: function () { g.destroy(); } });
      this.fx.smoke.explode(6, x, y);
    },

    // ================================================================ Suraya, and the lessons
    bujangSuraya: function () {
      var self = this, q = this.S.quests, s = step(this), b = this.bujang;
      switch (s) {
        case 2:
          this.bujangLines(X.interview, { choices: [
            { label: 'I vouch for them', fn: function () { story(self, 3); self.refreshWhen(); self.bujangLines(X.vouch.concat(X.firstLesson)); } },
            { label: 'They are hopeless... but yes', fn: function () { story(self, 3); self.refreshWhen(); self.bujangLines(X.hopeless.concat(X.firstLesson)); } }] });
          return;
        case 3:
          if (!b.lesson) this.startFloat18();
          this.bujangLines(X.float);
          return;
        case 4: this.bujangLines([['suraya13', 'The dark room is down the trapdoor on the east side of the courtyard. Sani is waiting there, trying very hard to look brave.']]); return;
        case 5:
          if (!b.lesson) this.startPantul18();
          this.bujangLines(X.pantul);
          return;
        case 6: this.bujangLines([['suraya13', 'Sit with your friends by the fire first. Then the door.']]); return;
        case 7: this.bujangLines([['suraya13', q.c18exam ? 'Come here, all four of you.' : 'The exam hall is open. Whatever the mirrors show you, remember that it is only half the story.']]); return;
      }
    },

    // ---------------------------------------------------------------- Ilmu Terapung: the feather and the durians
    startFloat18: function () {
      var F = C.feather;
      this.bujang.lesson = { kind: 'float', lifts: 0, h: 1, x: 23.5 * T, y: 17.2 * T, vx: 8, vy: 0, turnT: 0, dropT: 3, trailT: 0, lemanT: 4, durians: [],
        g: this.add.graphics().setDepth(5), img: this.add.image(0, 0, 'bulu18').setDepth(9550) };
      void F;
    },
    floatLift: function () {
      var L = this.bujang.lesson;
      if (!L || L.won) return;
      if (L.h > 0.6) { this.ui.floatText(L.x, L.y - 30, 'Still high! Wait for it.', '#e8e0d0'); return; }
      L.h = 1; L.lifts++;
      LC.Audio.sfx('wind');
      this.fx.sparkle.explode(10, L.img.x, L.img.y);
      this.ui.floatText(L.x, L.y - 40, 'Fwoosh! ' + L.lifts + ' / ' + C.feather.lifts, '#fff2b0');
      if (L.lifts >= C.feather.lifts) this.floatWin18();
    },
    updateFloat18: function (L, dt, time) {
      var self = this, p = this.player, Fz = C.feather;
      if ((L.turnT -= dt) <= 0) {
        L.turnT = 0.8 + Math.random();
        var a = Math.random() * Math.PI * 2, sp = 10 + L.lifts * 2.5;
        L.vx = Math.cos(a) * sp; L.vy = Math.sin(a) * sp * 0.6;
      }
      L.x = Phaser.Math.Clamp(L.x + L.vx * dt, Fz.x0 * T, Fz.x1 * T);
      L.y = Phaser.Math.Clamp(L.y + L.vy * dt, Fz.y0 * T, Fz.y1 * T);
      L.h -= dt * (0.2 + L.lifts * 0.025);
      if (L.h <= 0) {
        L.h = 1; L.lifts = 0;
        this.ui.floatText(L.x, L.y - 10, 'Ploof.', '#e8e0d0');
        this.toast(X.floatFail, 'bulu18');
        LC.Audio.sfx('error');
      }
      L.img.setPosition(L.x + Math.sin(time / 300) * 3, L.y - 6 - L.h * 46).setAngle(Math.sin(time / 400) * 25).setDepth(L.y + 40).setTint(L.h < 0.3 ? 0xffb0b0 : 0xffffff);
      var g = L.g, low = 1 - L.h;
      g.clear();
      g.fillStyle(0x000000, 0.2 + low * 0.25); g.fillEllipse(L.x, L.y, 8 + low * 8, 4 + low * 3);
      if (L.h <= 0.6) { g.lineStyle(1, 0xffd166, 0.5 + 0.4 * Math.sin(time / 90)); g.strokeCircle(L.x, L.y, 14); }
      if ((L.trailT -= dt) <= 0) { L.trailT = 0.12; this.fx.sparkle.explode(1, L.img.x, L.img.y + 3); }
      // Leman's "practice"
      if ((L.dropT -= dt) <= 0) {
        L.dropT = Math.max(1.3, 2.3 - L.lifts * 0.15);
        var tx = p.x + (Math.random() - 0.5) * 52, ty = p.y + (Math.random() - 0.5) * 30;
        L.durians.push({ x: tx, y: ty, left: 0.95, img: this.add.image(tx, ty - 90, 'i_durian').setDepth(9540) });
      }
      L.durians = L.durians.filter(function (d) {
        d.left -= dt;
        var k = Math.max(0, d.left / 0.95);
        d.img.setPosition(d.x, d.y - 4 - 90 * k * k).setAngle((1 - k) * 360);
        g.fillStyle(0x5a3a10, 0.15 + (1 - k) * 0.35); g.fillCircle(d.x, d.y, 4 + (1 - k) * 8);
        g.lineStyle(1, 0xffb347, 0.8); g.strokeCircle(d.x, d.y, 12);
        if (d.left > 0) return true;
        self.fx.dirt.explode(6, d.x, d.y);
        if (Math.hypot(p.x - d.x, p.y - d.y) < 13) self.bonk18(d.x, d.y, 2, 0.6);
        var im = d.img;
        self.tweens.add({ targets: im, x: im.x + (Math.random() - 0.5) * 30, y: im.y + 4, alpha: 0, angle: im.angle + 200, duration: 700, onComplete: function () { im.destroy(); } });
        return false;
      });
      if ((L.lemanT -= dt) <= 0) {
        L.lemanT = 4 + Math.random() * 3;
        var lm = this.objImgs.m_bujang18_leman;
        if (lm) this.ui.floatText(lm.x, lm.y - 24, pick(['Terapung, durian!', 'Up, up, up!', 'Oops. Mind your head!']), '#ffb38a');
      }
    },
    bonk18: function (x, y, dmg, stun) {
      var p = this.player;
      if (this.invuln > 0) return;
      this.ui.floatText(p.x, p.y - 30, X.bonk, '#ffd166');
      this.bujang.stunT = Math.max(this.bujang.stunT, stun);
      this.playerHurt(dmg, { spr: { x: x, y: y } });
    },
    floatWin18: function () {
      var L = this.bujang.lesson, self = this, img = L.img, g = L.g;
      L.won = true;
      story(this, 4);
      this.refreshWhen();
      LC.Audio.sfx('stage');
      this.tweens.add({ targets: img, y: img.y - 80, alpha: 0, duration: 1600, onComplete: function () { img.destroy(); g.destroy(); } });
      L.durians.forEach(function (d) { d.img.destroy(); });
      this.bujang.lesson = null;
      this.confetti18(this.player.x, this.player.y - 20, 30);
      this.bujangLines(X.floatWin);
      void self;
    },

    // ---------------------------------------------------------------- Kelas Pantul: the practice rune
    startPantul18: function () {
      this.bujang.lesson = { kind: 'pantul', count: 0, t: 2.2, aim: null, bolt: null, g: this.add.graphics().setDepth(1250) };
    },
    updatePantul18: function (L, dt, time) {
      var self = this, p = this.player, g = L.g, rx = (C.rune.x + 0.5) * T, ry = (C.rune.y + 1) * T - 12;
      g.clear();
      var inYard = p.x < 16.5 * T && p.y > 10 * T && p.y < 19.5 * T;
      if (!L.aim && !L.bolt) {
        if (!inYard) return;
        if ((L.t -= dt) <= 0) {
          var who = pick(WHO), im = this.objImgs['m_bujang18p_' + who];
          if (im) L.aim = { who: who, img: im, left: 0.9 };
          LC.Audio.sfx('cast');
        }
        return;
      }
      if (L.aim) {
        var a = L.aim, tx = a.img.x, ty = a.img.y - 10;
        a.left -= dt;
        g.lineStyle(1, 0xff9ad0, 0.4 + 0.4 * Math.sin(time / 60));
        for (var k = 0; k < 10; k += 2) g.lineBetween(rx + (tx - rx) * k / 10, ry + (ty - ry) * k / 10, rx + (tx - rx) * (k + 1) / 10, ry + (ty - ry) * (k + 1) / 10);
        g.fillStyle(0xff9ad0, 0.5); g.fillCircle(rx, ry, 5 + Math.sin(time / 50) * 2);
        if (a.left <= 0) {
          L.bolt = { who: a.who, img: a.img, x: rx, y: ry, back: false,
            core: this.add.image(rx, ry, 'suria_orb').setTint(0xff9ad0).setDepth(9501), glow: this.add.image(rx, ry, 'glow').setBlendMode(ADD()).setTint(0xff5aa8).setScale(0.2).setDepth(9500) };
          L.aim = null;
        }
        return;
      }
      var bo = L.bolt, pc = { x: p.x, y: p.y - 8 };
      function pop() { bo.core.destroy(); bo.glow.destroy(); L.bolt = null; }
      if (!bo.back) {
        var tx2 = bo.img.x, ty2 = bo.img.y - 10, d = Math.hypot(tx2 - bo.x, ty2 - bo.y) || 1;
        bo.x += (tx2 - bo.x) / d * 52 * dt; bo.y += (ty2 - bo.y) / d * 52 * dt;
        var near = dist(pc, bo), shield = this.mantera && this.mantera.shield > 0;
        if (shield && near < 18 || near < 10) {   // (the shield catches a bolt a little way off; your body only right in its path)
          if (shield) {
            bo.back = true;
            this.fx.sparkle.explode(10, bo.x, bo.y);
            this.ui.floatText(p.x, p.y - 26, 'Pantul!', '#baf8ec');
            LC.Audio.sfx('cast');
          } else { this.playerHurt(2, { spr: { x: bo.x, y: bo.y } }); this.fx.sparkle.explode(6, bo.x, bo.y); pop(); L.t = 1.6; return; }
        } else if (d < 7) {   // it reaches a bachelor: soot!
          var im2 = bo.img;
          im2.setTint(0x4a4a50);
          this.time.delayedCall(1500, function () { if (im2.active) im2.clearTint(); });
          this.fx.smoke.explode(8, im2.x, im2.y - 12);
          this.ui.floatText(im2.x, im2.y - 26, X.sooted[bo.who], '#ffb38a');
          LC.Audio.sfx('hit');
          pop(); L.t = 1.8; return;
        }
      } else {
        var d2 = Math.hypot(rx - bo.x, ry - bo.y) || 1;
        bo.x += (rx - bo.x) / d2 * 150 * dt; bo.y += (ry - bo.y) / d2 * 150 * dt;
        if (d2 < 6) {
          L.count++;
          this.shockwave(rx, ry, 26, 0xff9ad0);
          this.ui.floatText(rx, ry - 18, L.count + ' / ' + C.pantul, '#fff2b0');
          LC.Audio.sfx('chime');
          pop(); L.t = 1.4;
          if (L.count >= C.pantul) this.pantulWin18();
          return;
        }
      }
      bo.core.setPosition(bo.x, bo.y); bo.core.rotation += dt * 6; bo.glow.setPosition(bo.x, bo.y);
    },
    pantulWin18: function () {
      var L = this.bujang.lesson;
      L.g.destroy();
      this.bujang.lesson = null;
      story(this, 6);
      this.refreshWhen();
      this.createBujang();   // (the fire)
      LC.Audio.sfx('stage');
      this.bujangLines(X.pantulWin);
    },

    // ---------------------------------------------------------------- Kelas Gelap: Sani in the dark room
    createDark18: function () {
      var self = this, S = this.S, q = S.quests, lit = q.c18runes || {}, p = this.player;
      C.runes.forEach(function (r, i) {
        var im = self.objImgs['g18_rune' + i];
        if (im && lit[i]) { im.setTexture('rune18_on'); self.addLight(im.x, im.y - 10, 0xbfefff, 1.1, true); }
      });
      if (step(this) !== 4) return;
      var spr = this.add.sprite(p.x + 10, p.y + 4, 'npc18_sani_0').setOrigin(0.5, 1).setDepth(p.y);
      spr.play('npc18_sani_idle');
      this.bujang.sani = { spr: spr, trail: [{ x: p.x, y: p.y }], scared: false, shoutT: 0, batT: 3, moving: false };
      this.bujang.darkIntro = true;
    },
    updateSani18: function (F, dt, time) {
      var p = this.player, s = F.spr, self = this, tr = F.trail, last = tr[tr.length - 1];
      if (Math.hypot(p.x - last.x, p.y - last.y) > 4) { tr.push({ x: p.x, y: p.y }); if (tr.length > 400) tr.shift(); }
      var dP = Math.hypot(p.x - s.x, p.y - s.y), moving = false;
      if (F.scared) {
        if (dP < 40) { F.scared = false; F.trail = [{ x: s.x, y: s.y }, { x: p.x, y: p.y }]; this.ui.floatText(s.x, s.y - 26, 'Phew!', '#cfe6ff'); }
        else {
          s.x += Math.sin(time / 30) * 0.4;
          if ((F.shoutT -= dt) <= 0) { F.shoutT = 2.5; this.ui.floatText(s.x, s.y - 26, pick(X.wait), '#cfe6ff'); }
        }
      } else if (dP > 84) { F.scared = true; F.shoutT = 0; }
      else if (tr.length > 5) {
        var tg = tr[0], d = Math.hypot(tg.x - s.x, tg.y - s.y);
        if (d < 2) tr.shift();
        else { var sp = Math.min(d, 78 * dt); s.x += (tg.x - s.x) / d * sp; s.y += (tg.y - s.y) / d * sp; s.setFlipX(tg.x < s.x - 0.5); moving = true; }
      }
      if (moving !== F.moving) { F.moving = moving; s.play(moving ? 'npc18_sani_walk' : 'npc18_sani_idle', true); }
      s.setDepth(s.y);
      // bats!
      if ((F.batT -= dt) <= 0) {
        F.batT = 5 + Math.random() * 4;
        var fromL = Math.random() < 0.5, by = s.y - 16 + (Math.random() - 0.5) * 20, bat = this.add.sprite(fromL ? 2 * T : 22 * T, by, 'kelawar_0').setDepth(9520).setFlipX(!fromL);
        if (this.anims.exists('kelawar_walk')) bat.play('kelawar_walk');
        var scared = false;
        this.tweens.add({ targets: bat, x: fromL ? 22 * T : 2 * T, duration: 2400, onUpdate: function () {
          bat.y = by + Math.sin(bat.x / 14) * 6;
          if (!scared && Math.hypot(bat.x - s.x, bat.y - s.y) < 26) {
            scared = true; self.ui.floatText(s.x, s.y - 28, pick(X.eek), '#cfe6ff');
            self.tweens.add({ targets: s, y: s.y - 6, duration: 120, yoyo: true });
          }
        }, onComplete: function () { bat.destroy(); } });
      }
    },
    bujangRune: function (o) {
      var self = this, q = this.S.quests, F = this.bujang.sani, lit = q.c18runes = q.c18runes || {};
      if (lit[o.idx]) { this.toast(X.runeLit, 'rune18_on'); return; }
      if (step(this) !== 4) { this.toast('A dark rune stone, carved with a musical note.', 'rune18_off'); return; }
      if (!F || F.scared || dist(F.spr, this.player) > 44) { this.toast(X.tooFar, 'npc18_sani_0'); return; }
      lit[o.idx] = true;
      var n = Object.keys(lit).length;
      if (n >= C.runes.length) story(this, 5); else LC.State.save();
      var im = this.objImgs['g18_rune' + o.idx];
      if (im) { im.setTexture('rune18_on'); this.addLight(im.x, im.y - 10, 0xbfefff, 1.1, true); this.shockwave(im.x, im.y - 10, 40, 0xbfefff); }
      LC.Audio.sfx('lagu9');
      if (this.note9) for (var i = 0; i < 6; i++) (function (i) { self.time.delayedCall(i * 120, function () { if (F.spr.active) self.note9(F.spr.x + (Math.random() - 0.5) * 16, F.spr.y - 18, 0xbfefff); }); })(i);
      if (n >= C.runes.length) { this.cameras.main.flash(500, 200, 230, 255); this.fireflies18(this.player.x, this.player.y - 20, 12); }
      this.bujangLines(X.rune[Math.min(n, 3) - 1]);
    },

    // ---------------------------------------------------------------- by the fire, and Pintu Empat Penjuru
    bujangFire: function () {
      var q = this.S.quests;
      this.bujang.ritualPending = true;
      if (!q.c18fire) { q.c18fire = true; LC.State.save(); this.bujangLines(X.fire); }
    },
    startRitual18: function () {
      var self = this, d = C.door, cx = (d.x + 1.5) * T, cy = (d.y + 1) * T, p = this.player, door = this.objImgs.m_pintu18;
      var spots = [{ x: cx - 30, y: cy + 12 }, { x: cx + 30, y: cy + 12 }, { x: cx - 30, y: cy + 34 }, { x: cx + 30, y: cy + 34 }];
      var gems = [{ x: cx - 18, y: cy - 26 }, { x: cx + 18, y: cy - 26 }, { x: cx - 18, y: cy - 4 }, { x: cx + 18, y: cy - 4 }];
      var cols = [0xe9c46a, 0xe07a3a, 0x6a9ad0, 0xb48cff];
      this.cutscene = true; this.bujangCut = true;
      var actors = WHO.map(function (who, i) {
        var o = self.objImgs['m_bujang18_' + who], a = self.add.sprite(o ? o.x : spots[i].x, o ? o.y : spots[i].y, 'npc18_' + who + '_w1').setOrigin(0.5, 1);
        if (o) o.setVisible(false);
        a.play('npc18_' + who + '_walk');
        self.tweens.add({ targets: a, x: spots[i].x, y: spots[i].y, duration: 1500, onUpdate: function () { a.setDepth(a.y); }, onComplete: function () { a.play('npc18_' + who + '_idle'); } });
        return a;
      });
      actors.push(p);
      this.tweens.add({ targets: p, x: spots[3].x, y: spots[3].y, duration: 1200, onUpdate: function () { p.setDepth(p.y); } });
      var beams = this.add.graphics().setDepth(9545).setBlendMode(ADD());
      var drawn = [];
      [0, 1, 2, 3].forEach(function (i) {
        self.time.delayedCall(1700 + i * 600, function () {
          var a = actors[i];
          drawn.push(i);
          self.ui.floatText(a.x, a.y - 28, X.chant[i], '#fff2b0');
          LC.Audio.sfx(i === 3 ? 'stage' : 'chime');
          beams.clear();
          drawn.forEach(function (k) { var b = actors[k]; beams.lineStyle(3, cols[k], 0.9); beams.lineBetween(b.x, b.y - 10, gems[k].x, gems[k].y); beams.lineStyle(1, 0xffffff, 0.8); beams.lineBetween(b.x, b.y - 10, gems[k].x, gems[k].y); });
          self.fx.sparkle.explode(8, gems[i].x, gems[i].y);
        });
      });
      this.time.delayedCall(4300, function () {
        story(self, 7);
        if (door) door.setTexture('pintu18_buka');
        LC.Audio.sfx('gate');
        self.cameras.main.flash(400, 230, 210, 255);
        self.cameras.main.shake(300, 0.003);
        self.tweens.add({ targets: beams, alpha: 0, duration: 600 });
      });
      this.time.delayedCall(5300, function () {
        self.cutscene = false; self.bujangCut = false;
        self.goArea('ujian18', undefined, 'up');
      });
    },

    // ================================================================ Dewan Ujian: Ujian Cermin
    createExam18: function () {
      var self = this, q = this.S.quests, s = step(this), r = q.c18round || 0;
      for (var i = 0; i < 4; i++) {
        var im = this.objImgs['u18_cermin' + i];
        if (im && (s >= C.end || q.c18exam || i < Math.min(r, 3))) im.setTexture('cermin18_pecah');
      }
      if (s !== 7 || q.c18exam) return;
      this.bujang.fight = { round: r, phase: 'wait', t: 0.9, mirrors: [], allies: [], marks: [], clouds: [], g: this.add.graphics().setDepth(1250), bars: this.add.graphics().setDepth(1251) };
      void self;
    },
    spawnAlly18: function (who, at) {
      var spr = this.add.sprite(at.x, at.y, 'npc18_' + who + '_0').setOrigin(0.5, 1).setDepth(at.y).setAlpha(0);
      spr.play('npc18_' + who + '_idle');
      this.tweens.add({ targets: spr, alpha: 1, duration: 400 });
      return { who: who, spr: spr, hits: 0, dazeT: 0, atkT: 1.2, busy: false, moving: false };
    },
    spawnMirror18: function (who, idx, stats, ally) {
      var m = C.mirrors[idx], e = this.spawnEnemy({ kind: 'bayang18_' + who, fixed: { x: m.x, y: m.y + 1 } }, true), s = e.spr;
      e.def = Object.assign({}, e.def, stats); e.hp = stats.hp;
      e.light.img.setTint(C.colors[who]); e.light.base = 0.35;
      s.setAlpha(0);
      this.tweens.add({ targets: s, alpha: 1, duration: 500 });
      this.fx.smoke.explode(10, s.x, s.y - 8);
      var glass = this.objImgs['u18_cermin' + idx];
      if (glass) this.tweens.add({ targets: glass, alpha: 0.5, duration: 150, yoyo: true, repeat: 2 });
      var mr = { e: e, who: who, idx: idx, ally: ally, atkCd: 1.6, windT: 0, skillT: 3 + Math.random(), fleeT: 0, lastHp: e.hp, cornered: false, gone: false, stolen: 0, moving: false };
      if (ally) ally.mirror = mr;
      return mr;
    },
    roundIntro18: function (F) {
      var self = this, S = this.S, q = S.quests, r = F.round, st = F.stats = C.fight(S, r);
      F.phase = 'fight';
      if (r < 3) {
        var p = this.player, who = WHO[r], al = this.spawnAlly18(who, { x: p.x + 20, y: p.y });
        F.allies = [al]; F.mirrors = [this.spawnMirror18(who, r, st.mirror, al)];
        var lines = (q.c18examSeen ? [] : X.exam).concat(X.rounds[who].intro);
        q.c18examSeen = true; LC.State.save();
        this.bujangLines(lines);
        return;
      }
      var at = [{ x: 5.5 * T, y: 9 * T }, { x: 10.5 * T, y: 9 * T }, { x: 16.5 * T, y: 9 * T }];
      F.allies = WHO.map(function (who, i) { return self.spawnAlly18(who, at[i]); });
      F.mirrors = WHO.map(function (who, i) { return self.spawnMirror18(who, i, st.mirror, F.allies[i]); });
      this.spawnTwin18(F, st.twin);
      this.bujangLines(X.finale.concat([['twin', X.twinLine]]));
    },
    spawnTwin18: function (F, stats) {
      var keys = this.ensureMirrorArt(), m = C.mirrors[3];
      LC.ENEMIES.bayang18_diri.texture = keys.pk + '_down';
      LC.SPEAKERS.twin = { name: 'Bayang Diri', portrait: keys.pk + '_down_0' };
      var e = this.spawnEnemy({ kind: 'bayang18_diri', zone: { x0: m.x, x1: m.x, y0: m.y + 1, y1: m.y + 1 } }, true), s = e.spr;
      e.def = Object.assign({}, e.def, stats); e.hp = stats.hp;
      e.light.img.setTint(0x9a5cff); e.light.base = 0.35;
      s.setAlpha(0); this.tweens.add({ targets: s, alpha: 1, duration: 500 });
      this.fx.smoke.explode(10, s.x, s.y - 8);
      F.twin = e;
      F.trial = this.bunianTrial = {
        door: { id: 'ujian18', mirror: true, color: 0xff5a7a, boss: ['Bayang Diri'] },
        round: { number: 1, boss: stats, weapon: B.bestWeapon(this.S), specialCooldown: 4.8, enragedCooldown: 3.8 },
        clears: 0, phase: 'boss', timer: 3, marks: [], minions: [], art: this.add.graphics().setDepth(1250), boss: e,
        mirror: { pk: keys.pk, wk: keys.wk, skills: B.mirrorSkills(this.S).filter(function (k) { return k !== 'restu'; }), orbs: [], whirl: null, zone: null, last: null,
          hold: 0, pending: null, stoneT: 0, tranceT: 0, slowT: 0, shield: 0, pantulCd: 3, revived: false, saidHalf: true, noteT: 0,
          g: this.add.graphics().setDepth(1249), px: s.x, py: s.y, lastHp: e.hp,
          aura: this.add.image(s.x, s.y - 1, 'glow').setTint(0x1a0624).setAlpha(0.7).setScale(0.55, 0.22).setDepth(s.y - 1) }
      };
    },
    twinDown18: function (F) {
      F.twinGone = true;
      var s = F.twin.spr;
      F.twin.respawn = Infinity;
      if (F.trial) F.trial.ending = true;
      this.bunianTrial = null;
      this.fireflies18(s.x, s.y - 10, 12);
      var g = this.objImgs.u18_cermin3;
      if (g) g.setTexture('cermin18_pecah');
      LC.Audio.sfx('crumble');
    },

    // ---------------------------------------------------------------- each frame of the exam
    updateFight18: function (F, dt, time) {
      var self = this;
      F.g.clear(); F.bars.clear();
      F.allies.forEach(function (al) { self.updateAlly18(F, al, dt, time); });
      F.mirrors.forEach(function (mr) { self.updateMirror18(F, mr, dt, time); });
      this.updateMarks18(F, dt, time);
      F.mirrors.forEach(function (mr) {   // a health bar under each mirror, in its own colour
        if (mr.gone) return;
        var s = mr.e.spr, w = 22, f = Math.max(0, mr.e.hp / mr.e.def.hp);
        F.bars.fillStyle(0x1a1420, 0.85); F.bars.fillRect(s.x - w / 2 - 1, s.y + 1, w + 2, 4);
        F.bars.fillStyle(C.colors[mr.who], 1); F.bars.fillRect(s.x - w / 2, s.y + 2, w * f, 2);
      });
      if (F.round >= 3 && !F.wonPending && F.mirrors.length && F.mirrors.every(function (m) { return m.gone; }) && F.twinGone) {
        F.wonPending = true;
        this.time.delayedCall(900, function () { if (self.bujang && self.bujang.fight === F) self.examWon18(F); });
      }
    },
    updateAlly18: function (F, al, dt, time) {
      var s = al.spr, p = this.player, mr = al.mirror && !al.mirror.gone ? al.mirror : null, tx, ty, moving = false;
      if (al.busy) return;
      if (al.dazeT > 0) {
        al.dazeT -= dt; s.setAngle(Math.sin(time / 120) * 14);
        if (al.dazeT <= 0) { s.setAngle(0); this.ui.floatText(s.x, s.y - 26, X.ok, '#ffe8a0'); }
        return;
      }
      // in a round he stays by your side until his mirror comes close; in the finale he goes after it
      if (mr && (F.round >= 3 || Math.hypot(mr.e.spr.x - p.x, mr.e.spr.y - p.y) < 70)) { var e = mr.e; tx = e.spr.x + (s.x < e.spr.x ? -14 : 14); ty = e.spr.y; }
      else { tx = p.x + (F.round >= 3 ? (WHO.indexOf(al.who) - 1) * 18 : 20); ty = p.y + (F.round >= 3 ? 14 : 2); }
      var d = Math.hypot(tx - s.x, ty - s.y);
      if (d > 3) {
        var sp = Math.min(d, 62 * dt), nx = s.x + (tx - s.x) / d * sp, ny = s.y + (ty - s.y) / d * sp;
        if (!this.solidPx(nx, s.y - 2)) s.x = nx;
        if (!this.solidPx(s.x, ny - 2)) s.y = ny;
        moving = d > 6; s.setFlipX(tx < s.x);
      } else if (mr) s.setFlipX(mr.e.spr.x < s.x);
      if (moving !== al.moving) { al.moving = moving; s.play('npc18_' + al.who + (moving ? '_walk' : '_idle'), true); }
      s.setDepth(s.y);
      if (!mr || mr.cornered) return;
      al.atkT -= dt;
      var me = mr.e;
      if (al.atkT <= 0 && Math.hypot(me.spr.x - s.x, me.spr.y - s.y) < 22 && !me.dead) {
        al.atkT = 1.3 + Math.random() * 0.5;
        this.tweens.add({ targets: s, x: s.x + (me.spr.x > s.x ? 5 : -5), duration: 70, yoyo: true });
        var n = F.stats.allyHit, spark = this.add.image(me.spr.x, me.spr.y - 10, 'hitfx').setDepth(9600).setBlendMode(ADD()).setScale(0.4);
        this.tweens.add({ targets: spark, scale: 1, alpha: 0, duration: 160, onComplete: function () { spark.destroy(); } });
        me.hp -= n; me.hurtT = 0.1; me.spr.setTintFill(0xffffff);
        this.ui.floatText(me.spr.x, me.spr.y - 22, String(n), '#ffe8a0');
        LC.Audio.sfx('hit');
        if (me.hp <= 0) this.enemyDie(me);
      }
    },
    allyHit18: function (al) {
      if (!al || al.dazeT > 0 || al.busy) return;
      var s = al.spr;
      al.hits++;
      s.setTint(0xff8080);
      this.time.delayedCall(160, function () { if (s.active) s.clearTint(); });
      if (al.hits >= 3) { al.hits = 0; al.dazeT = 3.5; this.ui.floatText(s.x, s.y - 28, X.help, '#ffb38a'); LC.Audio.sfx('hurt'); }
      else if (Math.random() < 0.5) this.ui.floatText(s.x, s.y - 26, 'Aduh!', '#ffb38a');
    },
    updateMirror18: function (F, mr, dt, time) {
      var self = this, e = mr.e, s = e.spr, p = this.player, al = mr.ally;
      if (mr.gone || e.dead) return;
      e.light.img.setPosition(s.x, s.y - 8);
      if (e.light.base > 0.35) e.light.base = 0.35;   // (it comes back bright after the stone curse)
      if (mr.cornered) { s.x = mr.cx + Math.sin(time / 40) * 0.8; return; }
      if (e.stoneT > 0 || e.tranceT > 0) return;
      if (Math.abs(e.kx) + Math.abs(e.ky) > 1) {   // your blows still push it back
        var kx = s.x + e.kx * dt, ky = s.y + e.ky * dt;
        if (!this.solidPx(kx - 6, s.y - 2) && !this.solidPx(kx + 6, s.y - 2)) s.x = kx;
        if (!this.solidPx(s.x - 6, ky - 2) && !this.solidPx(s.x + 6, ky - 2)) s.y = ky;
        e.kx *= Math.pow(0.02, dt); e.ky *= Math.pow(0.02, dt);
      }
      if (e.hp < mr.lastHp && mr.who === 'kudin' && mr.fleeT <= 0 && Math.random() < 0.6) {   // hit him and he runs
        mr.fleeT = 1.1;
        this.ui.floatText(s.x, s.y - 24, 'Lari!', '#d8ccff');
      }
      mr.lastHp = e.hp;
      if (e.restT > 0) { e.restT -= dt; s.x += Math.sin(time / 200) * 0.3; return; }   // blinded, or dizzy
      var useAlly = al && al.dazeT <= 0 && !al.busy, dp = Math.hypot(p.x - s.x, p.y - s.y), tgt = p;
      if (useAlly) {   // in the finale each goes for its own bachelor (or you, up close); in a round it comes for you
        var da = Math.hypot(al.spr.x - s.x, al.spr.y - s.y);
        if (F.round >= 3 ? dp > 36 : da < 20 && dp > 90) tgt = al.spr;
      }
      var dx = tgt.x - s.x, dy = tgt.y - s.y, d = Math.hypot(dx, dy) || 1, vx = 0, vy = 0, sp = e.def.speed;
      mr.atkCd -= dt;
      if (mr.windT > 0) {   // the wind-up: shiver and flash, then the blow
        mr.windT -= dt;
        s.x += Math.sin(time / 22) * 0.5;
        if (Math.floor(time / 70) % 2) s.setTintFill(0xffe0e0); else if (e.hurtT <= 0) s.clearTint();
        if (mr.windT <= 0) {
          if (e.hurtT <= 0) s.clearTint();
          this.tweens.add({ targets: s, x: s.x + dx / d * 7, y: s.y + dy / d * 7, duration: 80, yoyo: true });
          if (d < 26) {
            if (tgt === p) {
              var before = this.S.hp;
              this.playerHurt(e.def.dmg, e);
              if (mr.who === 'leman' && this.S.hp < before) this.lemanSteal18(mr);
            } else this.allyHit18(al);
          }
          mr.atkCd = 1.3 + Math.random() * 0.5;
        }
      } else if (mr.fleeT > 0) { mr.fleeT -= dt; vx = -dx / d; vy = -dy / d; sp *= 1.3; }
      else if (d > 15) { vx = dx / d; vy = dy / d; }
      else if (mr.atkCd <= 0) { mr.windT = 0.45; if (d < 120) LC.Audio.sfx('lunge'); }
      if (vx || vy) {
        var nx = s.x + vx * sp * dt, ny = s.y + vy * sp * dt;
        if (!this.solidPx(nx - 6, s.y - 2) && !this.solidPx(nx + 6, s.y - 2)) s.x = nx;
        if (!this.solidPx(s.x - 6, ny - 2) && !this.solidPx(s.x + 6, ny - 2)) s.y = ny;
      }
      var moving = !!(vx || vy);
      if (moving !== mr.moving) { mr.moving = moving; s.play('mirror18_' + mr.who + (moving ? '_walk' : '_idle'), true); }
      s.setFlipX(dx < 0).setDepth(s.y);
      if ((mr.skillT -= dt) <= 0 && mr.windT <= 0) {
        mr.skillT = { kudin: 4.5, leman: 5.2, sani: 5.6 }[mr.who] * (F.round >= 3 ? 1.4 : 1);
        this.mirrorSkill18(F, mr);
      }
    },
    // each mirror's own trick
    mirrorSkill18: function (F, mr) {
      var self = this, s = mr.e.spr, p = this.player;
      if (mr.who === 'kudin') {
        this.ui.floatText(s.x, s.y - 24, 'Asap!', '#d8ccff'); LC.Audio.sfx('toss');
        F.marks.push({ kind: 'smoke', x: p.x, y: p.y - 4, r: 24, left: 0.85, max: 0.85 });
      } else if (mr.who === 'leman') {
        this.ui.floatText(s.x, s.y - 24, 'Durian, jatuh!', '#c8ff9a'); LC.Audio.sfx('toss');
        for (var i = 0; i < 3; i++) {
          var tx = p.x + (Math.random() - 0.5) * 56, ty = p.y + (Math.random() - 0.5) * 34;
          F.marks.push({ kind: 'durian', x: tx, y: ty, r: 12, left: 0.9 + i * 0.18, max: 0.9 + i * 0.18, img: this.add.image(tx, ty - 90, 'i_durian').setDepth(9540) });
        }
      } else {
        this.ui.floatText(s.x, s.y - 24, 'TAK TAKUT!', '#aac8ff'); LC.Audio.sfx('lagu9');
        F.marks.push({ kind: 'song', x: s.x, y: s.y - 4, r: 80, left: 1.2, max: 1.2, follow: mr });
      }
      void self;
    },
    updateMarks18: function (F, dt, time) {
      var self = this, p = this.player, g = F.g, b = this.bujang;
      F.marks = F.marks.filter(function (m) {
        m.left -= dt;
        if (m.follow && !m.follow.gone) { m.x = m.follow.e.spr.x; m.y = m.follow.e.spr.y - 4; }
        var k = Math.max(0, m.left / m.max), col = m.kind === 'smoke' ? 0xb8b0c8 : m.kind === 'durian' ? 0xffb347 : 0x7fb4ff;
        if (m.left > 0) {
          g.fillStyle(col, 0.15 + (1 - k) * 0.25 + Math.sin(time / 70) * 0.05); g.fillCircle(m.x, m.y, m.r);
          g.lineStyle(1, col, 0.9); g.strokeCircle(m.x, m.y, m.r);
          if (m.img) m.img.setPosition(m.x, m.y - 4 - 90 * k * k).setAngle((1 - k) * 360);
          if (m.kind === 'song' && self.note9 && Math.random() < dt * 5) self.note9(m.x + (Math.random() - 0.5) * 40, m.y - 10, 0x7fb4ff);
          return true;
        }
        var inside = Math.hypot(p.x - m.x, (p.y - 4) - m.y) < m.r;
        if (m.kind === 'smoke') {
          F.clouds.push({ x: m.x, y: m.y, r: 28, t: 3 });
          self.fx.smoke.explode(10, m.x, m.y);
        } else if (m.kind === 'durian') {
          self.fx.dirt.explode(6, m.x, m.y);
          if (inside) self.bonk18(m.x, m.y, Math.max(1, Math.round(F.stats.mirror.dmg * 0.6)), 0.5);
          F.allies.forEach(function (al) { if (Math.hypot(al.spr.x - m.x, al.spr.y - m.y) < m.r + 2) self.allyHit18(al); });
          if (m.img) { var im = m.img; self.tweens.add({ targets: im, alpha: 0, y: im.y + 4, duration: 600, onComplete: function () { im.destroy(); } }); }
        } else if (m.kind === 'song') {
          self.shockwave(m.x, m.y, m.r, 0x7fb4ff);
          if (inside) { b.songT = Math.max(b.songT, 1.8); self.ui.floatText(p.x, p.y - 28, 'Your ears are ringing!', '#aac8ff'); }
        }
        return false;
      });
      F.clouds = F.clouds.filter(function (c) {
        c.t -= dt;
        var a = Math.min(1, c.t) * 0.3;   // (thin enough to see yourself through)
        g.fillStyle(0x8a849a, a); g.fillCircle(c.x, c.y, c.r); g.fillStyle(0xa8a2b8, a * 0.6); g.fillCircle(c.x - 8, c.y - 4, c.r * 0.6); g.fillCircle(c.x + 9, c.y - 2, c.r * 0.55);
        if (Math.hypot(p.x - c.x, (p.y - 4) - c.y) < c.r) {
          b.slowT = Math.max(b.slowT, 0.3);
          if ((c.coughT = (c.coughT || 0) - dt) <= 0) { c.coughT = 1.2; self.ui.floatText(p.x, p.y - 26, 'Uhuk!', '#d8d0e0'); }
        }
        return c.t > 0;
      });
    },
    // Bayang Leman eats your food (you get it back when he is beaten)
    lemanSteal18: function (mr) {
      if (mr.stolen >= 3) return;
      var S = this.S, foods = S.inv.filter(function (sl) { return sl && LC.ITEMS[sl.id] && LC.ITEMS[sl.id].food; });
      if (!foods.length) return;
      var id = pick(foods).id, q = S.quests, e = mr.e;
      LC.State.remove(id, 1);
      q.c18stolen = q.c18stolen || {};
      q.c18stolen[id] = (q.c18stolen[id] || 0) + 1;
      mr.stolen++;
      e.hp = Math.min(e.def.hp, e.hp + Math.round(e.def.hp * 0.08));
      this.ui.floatText(e.spr.x, e.spr.y - 26, 'Nyam! Your ' + LC.ITEMS[id].name + '!', '#c8ff9a');
    },
    return18: function () {
      var q = this.S.quests, st = q.c18stolen, back = false;
      if (!st) return;
      Object.keys(st).forEach(function (id) {
        while (st[id] > 0 && LC.State.add(id, 1)) { st[id]--; back = true; }
        if (!st[id]) delete st[id];
      });
      if (!Object.keys(st).length) delete q.c18stolen;
      if (back) this.toast(X.returned, 'i_nasi_lemak');
    },
    // cornered: in a round, the real bachelor faces his mirror (after a few words); in the finale, at once
    cornerMirror18: function (F, mr) {
      var e = mr.e, s = e.spr;
      mr.cornered = true; mr.cx = s.x; mr.windT = 0;
      e.hp = 1; e.windT = 0; e.strikeT = 0; e.stoneT = 0; e.tranceT = 0;
      s.setAngle(0); if (s.anims.isPaused) s.anims.resume();
      s.play('mirror18_' + mr.who + '_idle');
      this.ui.floatText(s.x, s.y - 24, '...!', '#ffffff');
      if (F.round < 3) {
        F.phase = 'finish'; F.cornered = mr; F.finishing = false;
        F.marks.forEach(function (m) { if (m.img) m.img.destroy(); }); F.marks = []; F.clouds = [];
        this.bujangLines(X.rounds[mr.who].finish);
      } else this.finisher18(F, mr, true);
    },
    finisher18: function (F, mr, quick) {
      var self = this, al = mr.ally, e = mr.e, s = e.spr, a = al.spr;
      al.busy = true; al.dazeT = 0; a.setAngle(0);
      this.ui.floatText(a.x, a.y - 26, X.finishers[mr.who], '#fff2b0');
      if (mr.who === 'kudin') this.smokeRing18(a.x, a.y - 10, 50, 0xd8d0f0);
      if (mr.who === 'leman') {
        var nl = this.add.image(a.x, a.y - 12, 'i_nasi_lemak').setDepth(9550);
        this.tweens.add({ targets: nl, x: s.x, y: s.y - 12, duration: 450, onComplete: function () { nl.destroy(); } });
      }
      if (mr.who === 'sani') { LC.Audio.sfx('lagu9'); if (this.note9) for (var i = 0; i < 6; i++) this.note9(a.x + (Math.random() - 0.5) * 20, a.y - 16, 0xbfefff); }
      a.play('npc18_' + al.who + '_walk', true);
      this.tweens.add({ targets: a, x: s.x + (a.x < s.x ? -10 : 10), y: s.y, duration: 360, delay: 300, onComplete: function () {
        a.play('npc18_' + al.who + '_idle', true);
        self.shatter18(F, mr);
        al.busy = false;
        if (!quick) self.time.delayedCall(1300, function () { if (self.bujang && self.bujang.fight === F) self.roundDone18(F); });
      } });
    },
    shatter18: function (F, mr) {
      var e = mr.e, s = e.spr, S = this.S;
      mr.gone = true; e.dead = true; e.respawn = Infinity; e.stoneT = 0; e.tranceT = 0; e.light.base = 0;
      if (e.xpLife !== (e.life || 0) && this.killXp) { e.xpLife = e.life || 0; this.killXp(e); }
      S.stats.kills = (S.stats.kills || 0) + 1;
      LC.Audio.sfx('crumble');
      this.fx.sparkle.explode(20, s.x, s.y - 10);
      this.fireflies18(s.x, s.y - 10, 10);
      this.tweens.add({ targets: s, alpha: 0, scaleX: 1.3, scaleY: 0.3, duration: 350, onComplete: function () { s.setVisible(false).setScale(1); } });
      var glass = this.objImgs['u18_cermin' + mr.idx];
      if (glass) glass.setTexture('cermin18_pecah');
    },
    roundDone18: function (F) {
      var self = this, S = this.S, q = S.quests;
      q.c18round = F.round + 1;
      this.return18();
      S.hp = S.maxHp;
      LC.State.save();
      this.toast(X.between, 'cermin18');
      this.fx.heart.explode(6, this.player.x, this.player.y - 14);
      F.allies.forEach(function (al) { var a = al.spr; self.tweens.add({ targets: a, alpha: 0, duration: 800, delay: 600, onComplete: function () { a.destroy(); } }); });
      F.allies = []; F.mirrors = []; F.marks = []; F.clouds = [];
      F.round++; F.phase = 'between'; F.t = 1.8; F.cornered = null;
    },
    examWon18: function (F) {
      var self = this, q = this.S.quests;
      F.phase = 'done';
      q.c18exam = true; q.c18round = 4;
      this.return18();
      LC.State.save();
      LC.Audio.setBattle(false);
      LC.Audio.sfx('stage');
      for (var i = 0; i < 4; i++) { var m = C.mirrors[i]; this.fireflies18((m.x + 0.5) * T, (m.y + 0.5) * T, 10); }
      F.allies.forEach(function (al, i) { self.tweens.add({ targets: al.spr, y: al.spr.y - 8, duration: 180, yoyo: true, repeat: 2, delay: i * 120 }); });
      this.bujang.leavePending = true;
      this.bujangLines(X.win);
    },
    bujangLeaveExam: function (fainted) {
      var S = this.S, F = this.bujang && this.bujang.fight;
      this.return18();
      if (this.bunianTrial && this.bunianTrial.door && this.bunianTrial.door.id === 'ujian18') { this.bunianTrial.ending = true; this.bunianTrial = null; }
      if (F) F.phase = 'done';
      if (fainted) { S.hp = S.maxHp; this.player.clearTint().setAlpha(1).setAngle(0); this.bujangNote = X.faint; }
      LC.Audio.setBattle(false);
      LC.State.save();
      this.goArea('mantera', this.tilePx({ x: C.door.x + 1, y: C.door.y + 1 }), 'down');
    },

    // ---------------------------------------------------------------- graduation
    graduate18: function () {
      var self = this, S = this.S, p = this.player;
      story(this, C.end);
      S.kepeng += 2000; S.stats.earned = (S.stats.earned || 0) + 2000;
      LC.State.recalc(); S.energy = S.maxEnergy;
      LC.State.save();
      var ims = WHO.map(function (who) { return self.objImgs['m_bujang18_' + who]; });
      var actors = WHO.map(function (who, i) {
        var o = ims[i], a = self.add.sprite(o ? o.x : (25.5 + i) * T, o ? o.y : 10 * T, 'npc18_' + who + '_0').setOrigin(0.5, 1);
        a.setDepth(a.y); a.play('npc18_' + who + '_idle');
        return a;
      });
      this.refreshWhen();
      LC.Audio.sfx('cheer');
      this.confetti18(p.x, p.y - 20, 50);
      actors.concat([p]).forEach(function (a, i) {
        var cap = self.add.image(a.x, a.y - 16, 'topi18').setDepth(9550);
        self.tweens.add({ targets: cap, y: cap.y - 60, angle: 540, duration: 700, delay: i * 120, ease: 'Quad.easeOut', yoyo: true, hold: 200, onComplete: function () {
          self.fx.sparkle.explode(8, cap.x, cap.y); cap.destroy();
        } });
      });
      this.bujang.gradActors = actors;
      this.bujangLines(X.grad);
    },

    // ================================================================ Mantera Empat Sekawan (Y)
    sekawanLeft: function () { return Math.max(0, ((LC.sekawanAt || 0) - Date.now()) / 1000); },
    sekawanKey: function () {
      if (!LC.hasSekawan() || this.sleeping || this.leaving || this.cutscene || this.reuniting || (this.ui && this.ui.isBlocking())) return;
      var left = this.sekawanLeft(), K = C.sekawan;
      if (left > 0) { this.toast('Your friends are still catching their breath... (' + Math.ceil(left) + 's)', 'ic_sekawan'); LC.Audio.sfx('error'); return; }
      var self = this, p = this.player, L = LC.plLevel ? LC.plLevel() : 1;
      var foes = (this.enemies || []).filter(function (e) { return !e.dead && !e.away && e.spr && e.spr.visible && Math.hypot(e.spr.x - p.x, e.spr.y - p.y) < 180; });
      LC.sekawanAt = Date.now() + (foes.length ? K.cd : 6) * 1000;
      var at = [{ x: -22, y: 2 }, { x: 22, y: 2 }, { x: 0, y: 16 }];
      var actors = WHO.map(function (who, i) {
        var a = self.add.sprite(p.x + at[i].x, p.y + at[i].y, 'npc18_' + who + '_0').setOrigin(0.5, 1).setDepth(p.y + at[i].y);
        a.play('npc18_' + who + '_idle');
        self.fx.smoke.explode(8, a.x, a.y - 8);
        return a;
      });
      LC.Audio.sfx('poof');
      function gone() { actors.forEach(function (a) { if (!a.active) return; self.fx.smoke.explode(8, a.x, a.y - 8); a.destroy(); }); LC.Audio.sfx('poof'); }
      if (!foes.length) {
        this.ui.floatText(actors[1].x, actors[1].y - 26, X.nothing, '#ffb38a');
        this.time.delayedCall(1600, gone);
        return;
      }
      this.ui.floatText(p.x, p.y - 34, 'Empat Sekawan!', '#fff2b0');
      // Kudin: a smoke ring, and everything close is blinded
      this.time.delayedCall(350, function () {
        var a = actors[0]; if (!a.active || self.leaving) return;
        self.ui.floatText(a.x, a.y - 26, X.calls.kudin, '#e9c46a');
        self.smokeRing18(a.x, a.y - 8, K.smoke.r, 0xd8d0f0);
        (self.enemies || []).forEach(function (e) {
          if (e.dead || e.away || Math.hypot(e.spr.x - a.x, e.spr.y - a.y) > K.smoke.r) return;
          var t = e.def.boss ? K.smoke.bossBlind : K.smoke.blind;
          e.restT = Math.max(e.restT || 0, t); e.windT = 0; e.strikeT = 0; e.atkCd = Math.max(e.atkCd || 0, t + 0.3);
          self.ui.floatText(e.spr.x, e.spr.y - e.spr.height - 2, X.blind, '#d8d0f0');
        });
      });
      // Leman: a durian at the nearest foe
      this.time.delayedCall(750, function () {
        var a = actors[1]; if (!a.active || self.leaving) return;
        var tgt = (self.enemies || []).filter(function (e) { return !e.dead && !e.away && Math.hypot(e.spr.x - a.x, e.spr.y - a.y) < K.durian.reach; })
          .sort(function (x, y) { return Math.hypot(x.spr.x - a.x, x.spr.y - a.y) - Math.hypot(y.spr.x - a.x, y.spr.y - a.y); })[0];
        self.ui.floatText(a.x, a.y - 26, X.calls.leman, '#ffb38a');
        if (!tgt) return;
        LC.Audio.sfx('toss');
        var du = self.add.image(a.x, a.y - 12, 'i_durian').setDepth(9550), o = { t: 0 }, sx = a.x, sy = a.y - 12;
        self.tweens.add({ targets: o, t: 1, duration: 450, onUpdate: function () {
          var ex = tgt.spr.x, ey = tgt.spr.y - 10;
          du.setPosition(sx + (ex - sx) * o.t, sy + (ey - sy) * o.t - Math.sin(o.t * Math.PI) * 30).setAngle(o.t * 540);
        }, onComplete: function () {
          du.destroy();
          if (tgt.dead || tgt.away) return;
          var stone = tgt.stoneT > 0, n = C.durianDamage(L) * (stone ? 2 : 1), t = tgt.def.boss ? K.durian.bossStun : K.durian.stun;
          tgt.hp -= n; tgt.hurtT = 0.12; tgt.spr.setTintFill(0xffffff);
          if (!stone) { tgt.restT = Math.max(tgt.restT || 0, t); tgt.windT = 0; tgt.strikeT = 0; }
          self.fx.dirt.explode(8, tgt.spr.x, tgt.spr.y - 8);
          self.ui.floatText(tgt.spr.x, tgt.spr.y - tgt.spr.height - 2, X.bonk + ' ' + n, '#ffd166');
          LC.Audio.sfx('hit');
          if (tgt.hp <= 0) self.enemyDie(tgt);
        } });
      });
      // Sani: a song, and everything around sways
      this.time.delayedCall(1150, function () {
        var a = actors[2]; if (!a.active || self.leaving) return;
        self.ui.floatText(a.x, a.y - 26, X.calls.sani, '#bfefff');
        LC.Audio.sfx('lagu9');
        self.shockwave(a.x, a.y - 8, K.song.r, 0xbfefff);
        if (self.note9) for (var i = 0; i < 6; i++) self.note9(a.x + (Math.random() - 0.5) * 24, a.y - 16, 0xbfefff);
        (self.enemies || []).forEach(function (e) {
          if (e.dead || e.away || e.stoneT > 0 || Math.hypot(e.spr.x - a.x, e.spr.y - a.y) > K.song.r + e.def.w) return;
          e.tranceT = e.def.boss ? K.song.bossDur : K.song.dur; e.windT = 0; e.strikeT = 0; e.kx = 0; e.ky = 0;
          e.spr.setTint(0xc8d8ff);
        });
      });
      this.time.delayedCall(K.stay * 1000, gone);
    },

    // ================================================================ every frame
    updateBujang: function (time, dt) {
      var self = this, b = this.bujang, S = this.S, q = S.quests, s = step(this);
      if (!b) return;
      var blocked = this.ui.isBlocking() || this.leaving || this.sleeping || this.cutscene;
      // the chapter begins the day after Chapter 17 ends
      if (s === 0 && C.ready(S) && !blocked) {
        if (q.c18wait === undefined) { q.c18wait = S.day; LC.State.save(); }
        else if (S.day > q.c18wait) { story(this, 1); this.refreshWhen(); this.toast(X.start, 'npc18_kudin_0'); if (this.area === 'kampung' && !b.rooster) this.makeRooster18(); }
      }
      if (blocked) return;
      b.stunT = Math.max(0, b.stunT - dt); b.slowT = Math.max(0, b.slowT - dt); b.songT = Math.max(0, b.songT - dt);
      // Kampung Tepian: Kudin keeps practising
      if (this.area === 'kampung' && s === 1 && (b.practiseT -= dt) <= 0) {
        b.practiseT = 6 + Math.random() * 3;
        var k = this.objImgs.k_bujang18_kudin;
        if (k && Math.hypot(k.x - this.player.x, k.y - this.player.y) < 220) { this.confetti18(k.x, k.y - 20, 14); this.ui.floatText(k.x, k.y - 26, pick(['Hocus kelapa!', 'Abracadurian!', 'Simsalabim... bim?']), '#e9c46a'); }
      }
      if (b.ritualPending) { b.ritualPending = false; this.startRitual18(); return; }
      if (b.gradPending && time - b.born > 600) { b.gradPending = false; this.graduate18(); return; }
      if (b.gradActors) {
        var acts = b.gradActors; b.gradActors = null;
        acts.forEach(function (a, i) { self.tweens.add({ targets: a, alpha: 0, duration: 700, delay: i * 200, onComplete: function () { a.destroy(); } }); });
      }
      if (b.darkIntro && time - b.born > 500) { b.darkIntro = false; this.bujangLines(X.dark); return; }
      if (b.leavePending) { b.leavePending = false; this.goArea('mantera', this.tilePx({ x: C.door.x + 1, y: C.door.y + 1 }), 'down'); return; }
      if (b.lesson && b.lesson.kind === 'float' && this.area === 'mantera') this.updateFloat18(b.lesson, dt, time);
      if (b.lesson && b.lesson.kind === 'pantul' && this.area === 'mantera') this.updatePantul18(b.lesson, dt, time);
      if (b.sani && this.area === 'gelap18') this.updateSani18(b.sani, dt, time);
      var F = b.fight;
      if (F && this.area === 'ujian18') {
        if (F.phase === 'wait') { if ((F.t -= dt) <= 0) this.roundIntro18(F); }
        else if (F.phase === 'fight') this.updateFight18(F, dt, time);
        else if (F.phase === 'finish') { F.g.clear(); if (!F.finishing && F.cornered) { F.finishing = true; this.finisher18(F, F.cornered, false); } }
        else if (F.phase === 'between') { if ((F.t -= dt) <= 0) { F.phase = 'wait'; F.t = 0.2; } }
      }
    }
  });

  // ================================================================ your shadow learns it too (Pintu Cermin in Kampung Bunian)
  var skills = B.mirrorSkills;
  B.mirrorSkills = function (S) { var out = skills.apply(this, arguments); if (LC.hasSekawan()) out.push('sekawan'); return out; };
  var names = B.mirrorSkillNames;
  B.mirrorSkillNames = function (list) {
    var out = names.call(this, list.filter(function (k) { return k !== 'sekawan'; }));
    if (list.indexOf('sekawan') >= 0) out.push('Mantera Empat Sekawan');
    return out;
  };
  var mirrorCast = W.mirrorCast;
  W.mirrorCast = function (t, k) {
    if (k !== 'sekawan') return mirrorCast.apply(this, arguments);
    var self = this, s = t.boss.spr, p = this.player;
    t.mirror.last = k;
    this.ui.floatText(s.x, s.y - 24, 'Empat Sekawan!', '#ff9aae');
    LC.Audio.sfx('poof');
    [-20, 20, 0].forEach(function (dx, i) {
      var g = self.add.sprite(s.x + dx, s.y + (i === 2 ? 14 : 2), 'mirror18_' + WHO[i] + '_0').setOrigin(0.5, 1).setDepth(s.y + 2).setAlpha(0.85);
      self.fx.smoke.explode(6, g.x, g.y - 8);
      self.tweens.add({ targets: g, alpha: 0, duration: 500, delay: 1300, onComplete: function () { g.destroy(); } });
    });
    t.marks.push({ kind: 'durian', x: p.x, y: p.y, r: 22, left: 0.8 });
  };
  var mirrorImpact = W.mirrorImpact;
  W.mirrorImpact = function (t, k) {
    if (k.kind !== 'durian') return mirrorImpact.apply(this, arguments);
    var e = t.boss, p = this.player;
    if (e.dead || t.ending) return;
    this.fx.dirt.explode(8, k.x, k.y);
    var du = this.add.image(k.x, k.y - 6, 'i_durian').setDepth(9540);
    this.tweens.add({ targets: du, alpha: 0, angle: 200, duration: 600, onComplete: function () { du.destroy(); } });
    if (Math.hypot(p.x - k.x, (p.y - 4) - k.y) < k.r) {
      this.ui.floatText(p.x, p.y - 30, X.bonk, '#ffd166');
      t.mirror.slowT = Math.max(t.mirror.slowT, 1.0);
      this.playerHurt(Math.max(1, Math.round(e.def.dmg * 0.45)), { spr: { x: k.x, y: k.y } });
    }
  };
})(window.LC);
