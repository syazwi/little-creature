/* World, part 21 (v3.0): Chapter 10, Nujum Pak Belalang (see belalang.js), and the Sumpit.
 *  - Pelita goes missing: from the moment it vanishes until it comes home it is not drawn anywhere except beside
 *    Belalang, and its needs wait for it (they are kept in quests.c10needs; nights pass without pranks or cravings).
 *  - The glowing grasshoppers on the farm (walk up to one and it hops on), and the woven grasshopper on the jetty.
 *  - Tanjung Bunga: hide-and-seek with Belalang and Pelita (three places), the bucket chore (well to tempayan), the
 *    late Ahad (the Sultan forgives, once a week), the ship and the sampan you hide in after dark.
 *  - Hutan Merbau: Belalang and Pelita follow you; the thieves' footprints show only in Pelita's light. The Kerengga
 *    gang (four thieves and Si Kerengga) fight at their camp; when the last one gives up, the chest is yours.
 *  - The finale: Pelita floats back from Belalang to your shoulder.
 *  - The Sumpit: a ranged weapon. USE shoots a dart in the direction you face; it flies over water, stops at walls.
 * Personal to each player (like the other chapters' scenes). Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var T = 16, proto = LC.WorldScene.prototype, C10 = LC.C10, X = LC.CH10TEXT;
  var DIRV = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  var ADD = function () { return Phaser.BlendModes.ADD; };
  function Q() { return LC.State.s.quests; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function isNight(S) { return S.minutes >= C10.night || S.minutes < C10.dawn; }
  function gang(k) { return k === 'pencuri10' || k === 'ketua10'; }

  // ---------------------------------------------------------------- hooks
  var createKampong = proto.createKampong;
  proto.createKampong = function () { createKampong.apply(this, arguments); this.createBelalang(); };
  var updateKampong = proto.updateKampong;
  proto.updateKampong = function (time, dt) { updateKampong.apply(this, arguments); this.updateBelalang(time, dt); };
  var objectAction = proto.objectAction;
  proto.objectAction = function (o, sl, it, isFood) { var a = this.belalangObjAction(o, sl, it, isFood); return a !== undefined ? a : objectAction.apply(this, arguments); };
  var sailTo = proto.sailTo;
  proto.sailTo = function (to) {
    if (to !== 'tanjung') return sailTo.call(this, to);
    var self = this, q = Q();
    this.ui.say(!q.c10arrive ? X.sail : X.sailBack, { onDone: function () { LC.Audio.sfx('splash'); self.goArea('tanjung', self.tilePx(LC.AREAS.tanjung.home), 'up'); } });
  };
  // Pelita is away: not drawn, not near, and its needs wait for it
  var updateGhost = proto.updateGhost;
  proto.updateGhost = function (time, dt, blocked) {
    if (!LC.pelitaAway() && !(this.c10 && this.c10.holdGhost)) return updateGhost.call(this, time, dt, blocked);
    var g = this.S.ghost, n = Q().c10needs;
    if (n) { g.full = n.full; g.joy = n.joy; g.glow = n.glow; }
    this.ghostArea = 'away'; this.ghostHere = false; this.ghostNear = false; this.curExpr = 'normal';
    this.wasFollowing = this.following(); this.followInit = true;
    [this.ghost, this.ghostGlow, this.ghostShadow, this.bubble].forEach(function (o) { if (o) o.setVisible(false); });
  };
  // the nights while Pelita is away: no pranks, no craving, no bond (and its needs come back untouched)
  var endDay = LC.State.endDay;
  LC.State.endDay = function (fainted) {
    if (!LC.pelitaAway()) return endDay.apply(this, arguments);
    var g = this.s.ghost, n = this.s.quests.c10needs || { full: g.full, joy: g.joy, glow: g.glow };
    g.full = g.joy = g.glow = 40; g.cravingDone = true;
    var sum = endDay.apply(this, arguments);
    g.full = n.full; g.joy = n.joy; g.glow = n.glow;
    if (sum && sum.lines) for (var i = 0; i < sum.lines.length; i++) if (/^Pelita dozes off/.test(sum.lines[i])) sum.lines[i] = X.night;
    return sum;
  };
  var fireWeapon = proto.fireWeapon;
  proto.fireWeapon = function (wp) {
    fireWeapon.apply(this, arguments);
    if (wp.id === 'sumpit' && Math.random() < 0.3) this.ui.floatText(this.player.x, this.player.y - 28, pick(X.shoot), '#fff2b0');
  };
  // the Kerengga gang give up instead of fleeing into the wild, and never come back
  var enemyDie = proto.enemyDie;
  proto.enemyDie = function (e) { return gang(e.kind) ? this.gangDown(e) : enemyDie.apply(this, arguments); };
  Object.assign(proto, {
    createBelalang: function () {
      var self = this, q = Q(), st = LC.ch10Step(), a = this.area;
      this.c10 = { tick: 1, hop: null, seek: null, pel: null, fol: null, prints: [], busy: false, camp: false, carry: false, bucket: null, holdGhost: false };
      var c = this.c10;
      if (a === 'farm' && st === 1 && (q.c10hop || 0) < C10.hops.length) this.showHop10(q.c10hop || 0);
      if (a === 'tanjung') {
        if (st === 2) {
          if (!q.c10arrive) { q.c10arrive = 1; this.time.delayedCall(900, function () { if (!self.leaving) self.ui.say(self.ch2Lines(X.arrive)); }); }
          this.showSeek10(Math.min(2, q.c10seek || 0));
        }
        if (st === 4 && q.c10sultan && !q.c10won && S0().day > (q.c10due || 0)) {   // Ahad came and went: the Sultan gives another week
          q.c10late = 1; q.c10due = S0().day + C10.days;
          this.time.delayedCall(1100, function () { if (!self.leaving) self.ui.say(self.ch2Lines(X.late)); });
        }
      }
      if (st === 4 && q.c10with && (a === 'tanjung' || a === 'merbau')) this.followBelalang10();
      if (a === 'merbau' && st === 4 && !q.c10won) {
        this.makePrints10();
        if (!q.c10enter) {
          this.time.delayedCall(800, function () {
            if (self.leaving) return;
            if (q.c10with) { q.c10enter = 1; self.ui.say(self.ch2Lines(X.enter)); } else self.toast(X.noLight, 'ic_moon');
          });
        }
      }
      if (a === 'merbau') { var fire = this.objImgs && this.objImgs.mb_unggun; if (fire) this.tweens.add({ targets: fire, scaleY: 1.12, scaleX: 0.94, duration: 260, yoyo: true, repeat: -1 }); }
      // v3.0.1: Nek Lampir, waiting impatiently for her reading; and later, her cat on Gunung Ledang
      var nek = a === 'tanjung' && this.objImgs && this.objImgs.tj_nek;
      if (nek) {
        nek.setFlipX(true);
        this.tweens.add({ targets: nek, scaleY: 1.04, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        if (!q.c10nekHint) { q.c10nekHint = 1; this.time.delayedCall(2600, function () { if (!self.leaving && !self.ui.isBlocking()) self.toast(X.nek.hint, 'npc_lampir_0'); }); }
      }
      var cat = a === 'ledang' && this.objImgs && this.objImgs.ld_kucing10;
      if (cat) this.tweens.add({ targets: cat, scaleY: 0.94, duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      void c;
    },

    belalangObjAction: function (o, sl, it, isFood) {
      var self = this, q = Q(), st = LC.ch10Step();
      switch (o.type) {
        case 'spirit':
          if (!LC.pelitaAway()) return undefined;
          return { label: 'Spirit house (empty)', fn: function () { self.toast(X.spiritEmpty, 'ic_moon'); } };
        case 'anyam10': return { label: 'The woven grasshopper', fn: function () { self.c10Clue(); } };
        case 'perigi10':
          if (st === 3 && q.c10chores && (q.c10air || 0) < C10.water) return { label: this.c10.carry ? 'The town well' : 'Fill a bucket for Belalang', fn: function () { self.c10Bucket(); } };
          return { label: 'Draw water', fn: function () { self.refillCan(); } };
        case 'tempayan10': return { label: st === 3 && this.c10.carry ? 'Pour the water in' : 'The tempayan', fn: function () { self.c10Pour(); } };
        case 'sampan10': return { label: st === 6 && !q.c10heard ? 'Hide in the sampan' : 'The little sampan', fn: function () { self.c10Sampan(); } };
        case 'peti10': return { label: 'Take the Peti Pusaka Diraja', fn: function () { self.c10TakeChest(); } };
        case 'jejak10': return { label: 'Look closer', fn: function () {
          var f = q.c10clues || (q.c10clues = {});
          if (!f[o.i]) { f[o.i] = 1; LC.Audio.sfx('chime'); }
          self.toast(X.clue[o.i], 'ic_moon');
        } };
        case 'nek10': return { label: 'Nek Lampir wants her fortune told', fn: function () { self.nekFortune10(); } };
        case 'kucing10': return { label: 'Nek Lampir\'s cat', fn: function () { LC.Audio.sfx('pet'); self.toast(pick(X.nek.cat), 'npc_lampir_0'); } };
      }
      return undefined;
    },

    // ================================================================ v3.0.1: Nek Lampir's fortune
    // You whisper to Pak Belalang (with buttons) and he says it out loud. Every answer goes somewhere funny.
    nekFortune10: function () {
      var self = this, q = Q(), N = X.nek, score = 0, done = false;
      if (q.c10nek || this.c10.nekBusy) return;
      this.c10.nekBusy = true;
      if (this.nek && !this.nek.leaving && this.nekLeave) this.nekLeave(N.helperGo);   // (your helper, if she is with you, sits down in front of him herself)
      function lines(arr) { return self.ch2Lines(arr); }
      function ask(k) {
        if (k >= N.qs.length) { pay(); return; }
        var R = N.qs[k];
        self.ui.say(lines([{ who: 'lampir', text: R.q }]), { choices: R.opts.map(function (o) { return { label: o.label, fn: function () {
          if (o.good) score++;
          LC.Audio.sfx(o.good ? 'chime' : k === 1 ? 'sneeze' : 'giggle');
          if (!o.good && k === 1) self.cameras.main.shake(160, 0.003);
          self.ui.say(lines(o.res.concat(R.after || [])), { onDone: function () { ask(k + 1); } });
        } }; }) });
      }
      function pay() {
        if (done) return; done = true;
        q.c10nek = 1;   // (first: the rewards, then the lines)
        if (LC.State.canAdd('herba')) LC.State.add('herba', 3);
        LC.State.addFriendship('lampir', 8);
        LC.Audio.sfx('gulp');
        self.ui.say(lines(N.pay.concat([{ who: 'lampir', text: (score >= 2 ? N.good : N.bad) + ' (+3 Herba, and two more hearts. She will never admit it.)' }])), { onDone: function () {
          self.c10.nekBusy = false;
          self.refreshWhen();
          self.toast(N.leave, 'npc_lampir_0');
        } });
      }
      LC.Audio.sfx('drum');
      this.ui.say(lines(LC.ch10Step() >= 8 ? N.introAfter : N.intro), { onDone: function () { ask(0); } });
    },

    updateBelalang: function (time, dt) {
      var c = this.c10, S = this.S, q = Q(), st = LC.ch10Step(), p = this.player;
      if (!c || !p) return;
      var blocked = this.ui.isBlocking() || this.sleeping || this.leaving || this.cutscene;
      if ((c.tick -= dt) <= 0 && !blocked) {
        c.tick = 1;
        if (this.area === 'farm' && st === 0 && (q.ch9 || 0) >= 7 && !S.guest) {
          if (q.c10wait === undefined) q.c10wait = S.day;      // the chapter opens the day after Chapter 9 ends
          else if (S.day > q.c10wait && S.minutes >= C10.hookFrom && S.minutes < C10.hookTo) this.c10Hook();
        }
      }
      var bob = Math.sin(time / 380) * 2;
      // the glowing grasshopper, waiting for you to come close
      if (c.hop && !c.hop.jumping) {
        c.hop.gl.setAlpha(0.35 + 0.2 * Math.sin(time / 200));
        if (!blocked && Math.hypot(p.x - c.hop.spr.x, (p.y - 8) - c.hop.spr.y) < C10.hopNear + 10) this.hop10();
      }
      // hide-and-seek
      if (c.seek) {
        var sk = c.seek;
        sk.pel.setPosition(sk.kid.x + 9, sk.kid.y - 17 + bob); sk.gl.setPosition(sk.pel.x, sk.pel.y);
        if (!blocked && !c.busy && Math.hypot(p.x - sk.kid.x, p.y - sk.kid.y) < C10.seekNear) this.seekFound10();
      }
      // Pelita, beside Belalang
      var who = c.fol ? c.fol.spr : (this.npcs && this.npcs.belalang && this.npcs.belalang.spr);
      if (who && st >= 3 && st <= 7 && this.area !== 'farm') {
        if (!c.pel) c.pel = this.pelita10(who.x + 10, who.y - 18);
        if (!c.pel.flying) {
          var tx = who.x + (c.fol ? 0 : 10), ty = who.y - (c.fol ? 24 : 18) + bob, k = Math.min(1, dt * 3);
          c.pel.img.x += (tx - c.pel.img.x) * k; c.pel.img.y += (ty - c.pel.img.y) * k;
          c.pel.img.setTexture(LC.ghostTex(S.ghost.stage, c.fol ? 'normal' : 'happy')).setFlipX(who.flipX);
        }
        c.pel.gl.setPosition(c.pel.img.x, c.pel.img.y).setScale(c.fol ? 1.7 : 0.8).setAlpha(c.fol ? 0.55 : 0.4);
      }
      // Belalang walking with you
      if (c.fol) {
        var F = c.fol, d = DIRV[this.dir] || DIRV.down, hold = c.camp && !q.c10won;
        if (!hold) {
          var gx = p.x - d[0] * 22, gy = p.y - d[1] * 16 + 2, dx = gx - F.spr.x, dy = gy - F.spr.y, dd = Math.hypot(dx, dy);
          if (dd > 120) { F.spr.x = gx; F.spr.y = gy; }
          else if (dd > 2) { var kk = Math.min(1, dt * 3.2); F.spr.x += dx * kk; F.spr.y += dy * kk; F.spr.setFlipX(dx < 0); }
        }
        F.spr.setDepth(F.spr.y); F.sh.setPosition(F.spr.x, F.spr.y - 1);
      }
      // the bucket you are carrying
      if (c.bucket) c.bucket.setPosition(p.x, p.y - 26 + Math.sin(time / 120));
      // footprints, only where Pelita's light falls
      if (c.prints.length) {
        var L = c.pel && c.fol ? c.pel.img : null;
        c.prints.forEach(function (fp) { var a = L ? clamp(1 - Math.hypot(fp.x - L.x, fp.y - L.y) / C10.printR, 0, 1) : 0; fp.setAlpha(a * 0.9); });
      }
      if (blocked) return;
      // the thieves' camp
      if (this.area === 'merbau' && st === 4 && !q.c10won && !c.camp && p.x < (C10.camp.x + 2) * T) {
        c.camp = true; LC.Audio.sfx('drum'); this.cameras.main.shake(160, 0.002);
        this.toast(X.camp, 'ic_moon');
        if (c.fol) { var self = this; this.time.delayedCall(2600, function () { if (!self.leaving && !Q().c10won) self.toast(X.belalangHide, 'npc_belalang_0'); }); }
      }
    },

    pelita10: function (x, y) {   // Pelita, drawn beside Belalang (not your own Pelita, who is away)
      var img = this.add.image(x, y, LC.ghostTex(this.S.ghost.stage, 'happy')).setDepth(9002);
      var gl = this.add.image(x, y, 'glow').setBlendMode(ADD()).setDepth(9001).setTint(0xffe08a).setScale(0.8).setAlpha(0.4);
      return { img: img, gl: gl, flying: false };
    },

    // ================================================================ step 0: Pelita is gone
    c10Hook: function () {
      var self = this, q = Q(), g = this.S.ghost;
      if (LC.ch10Step() !== 0) return;
      var gx = this.ghost && this.ghost.visible ? this.ghost.x : null, gy = this.ghost ? this.ghost.y : 0;
      q.c10needs = { full: g.full, joy: g.joy, glow: g.glow };
      q.ch10 = 1; q.c10hop = 0;   // (first: closing the lines early never loses the chapter)
      if (gx !== null) { this.fx.sparkle.explode(10, gx, gy); LC.Audio.sfx('blink'); }
      this.ui.say(this.ch2Lines(X.hook), { onLine: function (i) { if (i === 3 && !self.leaving && !self.c10.hop) self.showHop10(0); } });
    },
    showHop10: function (k) {
      var c = this.c10, h = C10.hops[k], x = h[0] * T, y = h[1] * T;
      if (c.hop) { c.hop.spr.destroy(); c.hop.gl.destroy(); }
      var spr = this.add.sprite(x, y, 'belalang10_0').setDepth(y + 4).play('belalang10_hop');
      var gl = this.add.image(x, y, 'glow').setBlendMode(ADD()).setDepth(9001).setTint(0xffe08a).setScale(0.45).setAlpha(0.4);
      c.hop = { spr: spr, gl: gl, k: k, jumping: false };
    },
    hop10: function () {   // it hops on to the next place (and the last one hops to the end of the jetty, and is gone)
      var self = this, c = this.c10, q = Q(), H = c.hop, k = H.k, last = k >= C10.hops.length - 1;
      var to = last ? [21.5, 30.2] : C10.hops[k + 1], tx = to[0] * T, ty = to[1] * T;
      H.jumping = true; q.c10hop = k + 1;
      LC.Audio.sfx('toss');
      this.toast(X.hop[Math.min(k, X.hop.length - 1)], 'i_belalang_anyam');
      var sx = H.spr.x, sy = H.spr.y, o = { t: 0 };
      H.spr.setFlipX(tx < sx);
      this.tweens.add({ targets: o, t: 1, duration: 900, ease: 'Sine.easeInOut', onUpdate: function () {
        var x = sx + (tx - sx) * o.t, y = sy + (ty - sy) * o.t - Math.sin(o.t * Math.PI) * 26;
        H.spr.setPosition(x, y); H.gl.setPosition(x, y); if (Math.random() < 0.3) self.fx.sparkle.explode(1, x, y);
      }, onComplete: function () {
        if (self.leaving) return;
        H.spr.setDepth(ty + 4);
        if (last) {
          self.tweens.add({ targets: [H.spr, H.gl], alpha: 0, duration: 600, onComplete: function () { H.spr.destroy(); H.gl.destroy(); } });
          c.hop = null; self.fx.sparkle.explode(12, tx, ty);
          self.refreshWhen();   // the woven grasshopper is lying on the jetty
        } else { H.k = k + 1; H.jumping = false; }
      } });
    },
    c10Clue: function () {
      var q = Q();
      if (LC.ch10Step() !== 1) { this.toast(X.anyamHint, 'i_belalang_anyam'); return; }
      q.c10clue = 1; q.ch10 = 2;   // (first)
      if (!LC.State.count('belalang_anyam') && LC.State.canAdd('belalang_anyam')) LC.State.add('belalang_anyam', 1);
      LC.Audio.sfx('chime');
      this.refreshWhen();
      this.ui.say(this.ch2Lines(X.anyam));
    },

    // ================================================================ step 2: hide-and-seek
    showSeek10: function (k) {
      var c = this.c10, s = C10.seek[k], x = s[0] * T, y = s[1] * T;
      var kid = this.add.sprite(x, y, 'npc_belalang_0').setOrigin(0.5, 1).setDepth(y).play('npc_belalang_idle');
      var pel = this.add.image(x + 9, y - 17, LC.ghostTex(this.S.ghost.stage, 'happy')).setDepth(9002);
      var gl = this.add.image(pel.x, pel.y, 'glow').setBlendMode(ADD()).setDepth(9001).setTint(0xffe08a).setScale(1).setAlpha(0.5);
      this.tweens.add({ targets: gl, alpha: 0.25, duration: 700, yoyo: true, repeat: -1 });
      c.seek = { kid: kid, pel: pel, gl: gl, k: k };
    },
    seekFound10: function () {
      var self = this, c = this.c10, q = Q(), sk = c.seek, k = sk.k;
      if (LC.ch10Step() !== 2) return;
      if (k >= 2) { this.c10Found(); return; }
      c.busy = true; q.c10seek = k + 1;   // (first: saved)
      LC.Audio.sfx('giggle');
      this.toast(X.seek[k], 'npc_belalang_0');
      var to = C10.seek[k + 1], tx = to[0] * T, ty = to[1] * T;
      sk.kid.setFlipX(tx < sk.kid.x);
      this.tweens.add({ targets: sk.kid, x: tx, y: ty, duration: 1500, ease: 'Sine.easeInOut', onUpdate: function () { sk.kid.setDepth(sk.kid.y); },
        onComplete: function () { sk.k = k + 1; c.busy = false; } });
      this.fx.sparkle.explode(6, sk.pel.x, sk.pel.y);
    },
    c10Found: function () {
      var self = this, c = this.c10, q = Q(), sk = c.seek;
      q.c10seek = 3; q.ch10 = 3;   // (first)
      c.busy = true;
      LC.Audio.sfx('giggle'); this.fx.sparkle.explode(16, sk.pel.x, sk.pel.y);
      [sk.kid, sk.pel, sk.gl].forEach(function (o) { self.tweens.killTweensOf(o); });
      sk.kid.destroy(); sk.gl.destroy();
      c.pel = { img: sk.pel, gl: this.add.image(sk.pel.x, sk.pel.y, 'glow').setBlendMode(ADD()).setDepth(9001).setTint(0xffe08a).setScale(0.8).setAlpha(0.4), flying: false };
      c.seek = null;
      this.placeVillager('belalang');
      var n = this.npcs.belalang;
      if (n) { n.spr.setPosition(C10.seek[2][0] * T, C10.seek[2][1] * T); this.tweens.add({ targets: n.spr, x: (LC.VILLAGERS.belalang.post.x + 0.5) * T, y: (LC.VILLAGERS.belalang.post.y + 1) * T, duration: 2600, delay: 400 }); }
      this.ui.say(this.ch2Lines(X.found), { onDone: function () { c.busy = false; } });
    },

    // ================================================================ step 3: the chores
    c10Bucket: function () {
      var c = this.c10;
      if (c.carry) { this.toast(X.bucketHave, 'i_can'); return; }
      c.carry = true; LC.Audio.sfx('water');
      c.bucket = this.add.image(this.player.x, this.player.y - 26, 'i_can').setDepth(9550);
      this.toast(X.bucket, 'i_can');
    },
    c10Pour: function () {
      var c = this.c10, q = Q(), st = LC.ch10Step(), n = q.c10air || 0;
      if (st !== 3 || !c.carry) {
        this.toast(n >= C10.water ? X.jarFull : 'A big clay tempayan for water, by Pak Belalang\'s door. ' + (st === 3 && q.c10chores ? 'Fill a bucket at the town well, then pour it in here.' : 'It is nearly empty.'), 'i_can');
        return;
      }
      c.carry = false; if (c.bucket) { c.bucket.destroy(); c.bucket = null; }
      q.c10air = n + 1;
      LC.Audio.sfx('splash');
      var t = this.objImgs && this.objImgs.tj_tempayan;
      if (t) { this.fx.drop.explode(8, t.x, t.y - 16); this.tweens.add({ targets: t, scaleY: 0.92, duration: 80, yoyo: true }); }
      this.toast(X.pour + ' (' + q.c10air + ' / ' + C10.water + ')' + (q.c10air >= C10.water ? ' ' + X.jarFull : ''), 'i_can');
    },

    // ================================================================ step 4: the forest, the tracks and the gang
    followBelalang10: function () {
      var c = this.c10, p = this.player;
      if (c.fol) return;
      var spr = this.add.sprite(p.x - 20, p.y, 'npc_belalang_0').setOrigin(0.5, 1).setDepth(p.y).play('npc_belalang_idle');
      var sh = this.add.image(spr.x, spr.y - 1, 'shadow').setDepth(1).setAlpha(0.4);
      c.fol = { spr: spr, sh: sh };
    },
    c10SendHome: function () {   // (from the Companions tab) Belalang goes home to wait for you
      var self = this, c = this.c10, q = Q();
      q.c10with = 0;
      if (c && c.fol) {
        var F = c.fol; c.fol = null;
        this.tweens.add({ targets: [F.spr, F.sh], alpha: 0, duration: 700, onComplete: function () { F.spr.destroy(); F.sh.destroy(); } });
        if (c.pel) { var P = c.pel; c.pel = null; this.tweens.add({ targets: [P.img, P.gl], alpha: 0, duration: 700, onComplete: function () { P.img.destroy(); P.gl.destroy(); } }); }
      }
      if (this.area === 'tanjung') this.time.delayedCall(800, function () { if (!self.leaving) self.placeVillager('belalang'); });
      this.toast('Belalang runs home to his father\'s hut, with Pelita. Talk to him there when you want him along.', 'npc_belalang_0');
    },
    makePrints10: function () {
      var self = this, c = this.c10, tr = C10.trail, side = 0;
      for (var i = 0; i < tr.length - 1; i++) {
        var ax = tr[i][0] * T, ay = tr[i][1] * T, bx = tr[i + 1][0] * T, by = tr[i + 1][1] * T, len = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / len, uy = (by - ay) / len;
        var ang = Math.atan2(uy, ux) * 180 / Math.PI + 90;
        for (var s = 0; s < len; s += 13) {
          side = 1 - side;
          var off = side ? 3 : -3, x = ax + ux * s - uy * off, y = ay + uy * s + ux * off;
          c.prints.push(self.add.image(x, y, 'tapak10').setDepth(9001).setAngle(ang).setAlpha(0).setBlendMode(ADD()));   // (above the forest's dark: they glow where Pelita shines)
        }
      }
    },
    gangDown: function (e) {
      var self = this, S = this.S, q = Q(), D = e.def, s = e.spr, got = 0;
      e.dead = true; e.respawn = 1e9; e.stoneT = 0; e.tranceT = 0;
      if (s.anims.isPaused) s.anims.resume();
      LC.Audio.sfx('poof');
      this.fx.smoke.explode(10, s.x, s.y - s.height / 2);
      s.setTintFill(0xffffff).setAngle(0);
      this.tweens.add({ targets: s, alpha: 0, scaleY: 0.2, scaleX: 1.3, duration: 300, onComplete: function () { s.setVisible(false).setScale(1).clearTint(); } });
      e.light.base = 0;
      S.stats.kills = (S.stats.kills || 0) + 1;
      D.drop.forEach(function (dr) { if (Math.random() <= dr[1]) { var n = dr[2] + Math.floor(Math.random() * (dr[3] - dr[2] + 1)); if (dr[0] === 'kepeng') { S.kepeng += n; S.stats.earned += n; got += n; } } });
      var left = this.enemies.filter(function (x) { return gang(x.kind) && !x.dead && !x.away; }).length;
      if (e.kind === 'ketua10') this.toast('Si Kerengga sits down hard in the leaves. "Ow! OW! All right, all right!"', 'ic_moon');
      else this.toast('A Kerengga thief drops his stick and dives into the bushes!' + (got ? ' He dropped ' + got + ' kepeng.' : '') + (left ? ' (' + left + ' left)' : ''), 'i_kepeng');
      if (!left && LC.ch10Step() === 4 && !q.c10won) this.time.delayedCall(900, function () { if (!self.leaving) self.c10Won(); });
    },
    c10Won: function () {
      var self = this, c = this.c10, q = Q();
      if (q.c10won) return;
      q.c10won = 1; q.c10with = 0;   // (first: Belalang goes home with the guards afterwards)
      LC.Audio.sfx('cheer');
      this.doShared('kind', { n: 10 }, function () {});
      this.refreshWhen();
      c.prints.forEach(function (fp) { self.tweens.add({ targets: fp, alpha: 0, duration: 800, onComplete: function () { fp.destroy(); } }); });
      c.prints = [];
      function end() {
        if (!c.fol) return;
        var F = c.fol, P = c.pel; c.fol = null; c.pel = null;
        self.tweens.add({ targets: [F.spr, F.sh], alpha: 0, duration: 900, onComplete: function () { F.spr.destroy(); F.sh.destroy(); } });
        if (P) self.tweens.add({ targets: [P.img, P.gl], alpha: 0, duration: 900, onComplete: function () { P.img.destroy(); P.gl.destroy(); } });
      }
      this.ui.say(this.ch2Lines(X.won), { onDone: end });
      this.time.delayedCall(30000, end);
    },
    c10TakeChest: function () {
      var q = Q();
      if (LC.ch10Step() !== 4 || !q.c10won) return;
      if (!LC.State.canAdd('peti_diraja')) { this.toast('Your bag is full! Make room first.'); LC.Audio.sfx('error'); return; }
      LC.State.add('peti_diraja', 1);
      q.ch10 = 5;
      LC.Audio.sfx('harvest');
      this.refreshWhen();
      this.toast(X.peti + ' Carry it back to the Sultan in Tanjung Bunga.', 'i_peti_diraja');
    },

    // ================================================================ step 6: the sampan under the foreign ship
    c10Sampan: function () {
      var self = this, q = Q(), st = LC.ch10Step();
      if (st !== 6 || q.c10heard) { this.toast(st >= 6 ? X.sampanDone : 'A little sampan.', 'ic_moon'); return; }
      if (!isNight(this.S)) { this.toast(X.sampanDay, 'ic_moon'); LC.Audio.sfx('error'); return; }
      q.c10heard = 1;   // (first)
      LC.Audio.sfx('water');
      var rest = function (first) { return function () { self.ui.say(self.ch2Lines([{ text: first }].concat(X.hear2))); }; };
      this.ui.say(this.ch2Lines(X.hear1), { choices: [{ label: 'Lie very still', fn: rest(X.hearStill) }, { label: 'Peek over the edge', fn: rest(X.hearPeek) }] });
    },

    // ================================================================ step 7: the truth, and Pelita comes home
    c10Finale: function () {
      var self = this, c = this.c10, q = Q(), S = this.S, g = S.ghost, p = this.player, done = false;
      if (LC.ch10Step() !== 7) return;
      // (first: everything the chapter gives, so a dialogue closed early can never lose it)
      var n = q.c10needs || { full: g.full, joy: g.joy, glow: g.glow }, bonus = q.c10late ? 0 : C10.onTime;
      q.ch10 = 8; delete q.c10needs; delete q.c10with;
      g.full = Math.max(n.full, 60); g.joy = 100; g.glow = Math.max(n.glow, 90);
      if (!LC.State.count('sumpit')) { if (LC.State.canAdd('sumpit')) LC.State.add('sumpit', 1); else q.c10sumpitOwed = 1; }
      if (LC.State.count('belalang_anyam')) LC.State.remove('belalang_anyam', LC.State.count('belalang_anyam'));
      S.kepeng += C10.reward + bonus; S.stats.earned += C10.reward + bonus;
      if (LC.State.canAdd('delima')) LC.State.add('delima', 2);
      LC.State.recalc(); LC.emit('ghost'); LC.emit('inv');
      this.doShared('kind', { n: 25 }, function () {});
      c.holdGhost = true; this.cutscene = true;
      var settle = -1, fin = X.finale.slice();
      if (q.c10nek) {   // v3.0.1: Nek Lampir heard everything
        var at = -1;
        fin.forEach(function (l, i) { if (/worth more than any riddle/.test(l.text)) at = i; });
        if (at >= 0) Array.prototype.splice.apply(fin, [at + 1, 0].concat(X.nek.callback));
      }
      fin.forEach(function (l, i) { if (/settles on your shoulder/.test(l.text)) settle = i; });
      function home() {   // Pelita floats across, from Belalang to you
        var P = c.pel; c.pel = null;
        if (!P) { c.holdGhost = false; return; }
        P.flying = true;
        self.tweens.add({ targets: [P.img, P.gl], x: p.x + 10, y: p.y - 22, duration: 1400, ease: 'Sine.easeInOut', onComplete: function () {
          P.img.destroy(); P.gl.destroy(); c.holdGhost = false;
          if (self.gpos) { self.gpos.x = p.x + 10; self.gpos.y = p.y - 22; }   // (your own Pelita takes over right where it landed)
          if (self.leaving) return;
          self.fx.sparkle.explode(24, p.x + 8, p.y - 20); self.shockwave(p.x, p.y - 12, 60, 0xffe08a); LC.Audio.sfx('reunion');
        } });
      }
      function end() {
        if (done) return; done = true; self.cutscene = false;
        if (c.holdGhost) home();
        self.toast('The Sumpit: hold it and press USE to shoot a dart at whatever is in front of you, far away.' + (q.c10sumpitOwed ? ' (Make room in your bag: Belalang will give it to you when you talk to him.)' : ''), 'i_sumpit');
      }
      this.ui.say(this.ch2Lines(fin), { onLine: function (i) { if (i === settle && c.holdGhost) home(); if (i === settle + 1) self.cameras.main.flash(500, 255, 230, 160); }, onDone: end });
      var w = this.time.addEvent({ delay: 500, loop: true, callback: function () { if (done) { w.remove(); return; } if (!self.ui.isBlocking()) { w.remove(); end(); } } });
    }
  });
  function S0() { return LC.State.s; }
})(window.LC);
