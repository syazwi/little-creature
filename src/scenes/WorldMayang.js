/* World, part 18 (v2.7): Chapter 9, Ulek Mayang (see mayang.js), and Lagu Mayang (L).
 *  - The dark: from the moment you arrive until Pak Awang wakes, Kampung Pantai Kabus, Pantai Bakau and the princesses'
 *    cave are held in night and fog whatever the clock says (Pelita's daylight cannot reach here; the calm music falls
 *    silent and a low drone, whispers and creaks take its place).
 *  - Finding the song: a woman's voice, louder as you get closer and coming from one side (LC.SING.her), and a faint
 *    light at the edge of the screen. Three wrong places (an empty boat, a well, a swing), then Pak Awang in the sea.
 *  - The chase: Puteri Bongsu hunts you back along the boardwalk. When her singing stops, do not move; inside a lamp's
 *    light she cannot reach you; if she catches you, you are thrown back to the last lamp.
 *  - The Ulek Mayang on the beach (the verses are sung back in UIMayang.openUlek), the five princesses, Bongsu, the
 *    eldest; the cave of seven clams (find the one where Awang's spirit hums); the dawn.
 *  - Lagu Mayang: every enemy around you falls into a trance and sways for a few seconds.
 * Personal to each player (like the other chapters' scenes). Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var T = 16, proto = LC.WorldScene.prototype, C9 = LC.C9, X = LC.CH9TEXT, SING = LC.SING;
  var ADD = function () { return Phaser.BlendModes.ADD; };
  function Q() { return LC.State.s.quests; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  // ---------------------------------------------------------------- hooks
  var createKampong = proto.createKampong;
  proto.createKampong = function () { createKampong.apply(this, arguments); this.createMayang(); };
  var updateKampong = proto.updateKampong;
  proto.updateKampong = function (time, dt) { updateKampong.apply(this, arguments); this.updateMayang(time, dt); };
  var kampongObjAction = proto.kampongObjAction;
  proto.kampongObjAction = function (o) { var a = this.mayangObjAction(o); return a !== undefined ? a : kampongObjAction.call(this, o); };
  var sailTo = proto.sailTo;
  proto.sailTo = function (to) {
    if (to !== 'kabus') return sailTo.call(this, to);
    var self = this, q = Q();
    this.ui.say(!q.c9arrive ? X.sail : X.sailBack, { onDone: function () { LC.Audio.sfx('splash'); self.goArea('kabus', self.tilePx(LC.AREAS.kabus.home), 'up'); } });
  };
  var nekRival = proto.nekRival;   // Nek Lampir will not come anywhere near that song
  proto.nekRival = function () { return this.c9 && this.c9.horror ? 'ulek9' : nekRival.call(this); };
  LC.NEKTEXT.refuse.ulek9 = 'Hmph. Not THERE. I know that song, child, and I am not going anywhere near it. Call me somewhere sensible.';
  // the dark holds these places: night, whatever the clock says, and only a small light around you
  var updateLighting = proto.updateLighting;
  proto.updateLighting = function (time, dt) {
    var c = this.c9;
    if (!c || (!c.horror && !c.dawn)) return updateLighting.call(this, time, dt);
    var A = this.A, S = this.S, m = S.minutes, off = S.flags.sunOff, cave = A.cave;
    if (c.dawn) S.minutes = 7 * 60;   // (after the finale: the sun is up over Pantai Kabus, for this visit)
    else { S.minutes = 23 * 60; S.flags.sunOff = true; A.cave = true; }
    try { updateLighting.call(this, time, dt); } finally { S.minutes = m; S.flags.sunOff = off; A.cave = cave; }
    if (c.dawn) return;
    this.dark.setVisible(true).setTint(A.underwater ? 0x14203a : 0x1c1a2c);
    this.playerLight.img.setScale((this.ghostHere ? 1.7 : 1.4) * (0.93 + 0.07 * Math.sin(time / 90) * Math.sin(time / 37))).setTint(0xd8d0b8);   // Pelita is too frightened to shine far
  };
  // in the dark, Pelita is frightened: small, pale and trembling
  var updateGhost = proto.updateGhost;
  proto.updateGhost = function (time, dt, blocked) {
    updateGhost.call(this, time, dt, blocked);
    if (!this.c9 || !this.c9.horror || !this.ghost || !this.ghost.visible) return;
    this.ghost.setAlpha(this.ghost.alpha * (0.62 + 0.1 * Math.sin(time / 120)));
    this.ghostGlow.setScale(this.ghostGlow.scaleX * 0.42).setAlpha(this.ghostGlow.alpha * 0.45).setTint(0x9a90c8);
  };
  // Lagu Mayang: an entranced enemy stays where it is, swaying, and does not attack
  var updateEnemies = proto.updateEnemies;
  proto.updateEnemies = function (time, dt, blocked) {
    var tr = (this.enemies || []).filter(function (e) { return e.tranceT > 0 && !e.dead && !e.away; });
    tr.forEach(function (e) { e.tx9 = e.spr.x; e.ty9 = e.spr.y; e.windT = 0; e.strikeT = 0; e.atkCd = Math.max(e.atkCd, 0.6); e.kx = 0; e.ky = 0; });
    updateEnemies.call(this, time, dt, blocked);
    var self = this;
    tr.forEach(function (e) {
      if (e.dead || e.away) { e.tranceT = 0; e.spr.setAngle(0); return; }
      e.spr.x = e.tx9; e.spr.y = e.ty9; e.windT = 0; e.strikeT = 0;
      if (e.stoneT > 0) { e.tranceT = 0; e.spr.setAngle(0); return; }
      if (!blocked) e.tranceT -= dt;
      e.spr.setAngle(Math.sin(time / 260 + (e.ph || 0)) * 12);
      if (e.light) e.light.img.setPosition(e.spr.x, e.spr.y - 8);
      if (!blocked && (e.noteT = (e.noteT || 0) - dt) <= 0) { e.noteT = 0.55 + Math.random() * 0.3; self.note9(e.spr.x + (Math.random() - 0.5) * 10, e.spr.y - e.spr.height, 0x9ae8e0); }
      if (e.tranceT <= 0) { e.tranceT = 0; e.spr.setAngle(0); if (e.hurtT <= 0) e.spr.clearTint(); }
    });
  };

  Object.assign(proto, {
    createMayang: function () {
      var self = this, q = Q(), st = LC.ch9Step(), a = this.area;
      SING.stopAll();
      this.c9 = { tick: 1, horror: LC.horror9(a), dawn: false, src: null, vol: 0, hint: false, busy: false, chase: null, scene: false,
        fogs: [], cast: [], swing: null, awang: null, bongsu: null, eldest: null, whirl: null, tok: 1 };
      var c = this.c9;
      LC.Audio.horror(c.horror);
      this.events.once('shutdown', function () { SING.stopAll(); LC.Audio.horror(false); });   // (travelling, or quitting to the title: the next place decides again)
      if (c.horror) {
        this.playerLight.base = 0.6;
        for (var i = 0; i < 12; i++) {   // the fog: thick, pale, and low
          var f = this.add.image(Math.random() * this.W * T, Math.random() * this.H * T, 'fog').setDepth(9002).setTint(0x9aa8b8).setScale(2 + Math.random() * 2).setAlpha(0.1 + Math.random() * 0.1);
          c.fogs.push({ img: f, v: 2 + Math.random() * 4, a: f.alpha });
        }
      }
      if (a === 'farm' && st === 1) { var bt = this.objImgs && this.objImgs.f_perahu9; if (bt) this.tweens.add({ targets: bt, y: bt.y - 1, angle: 2, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' }); }
      if (a === 'kabus') {
        [0, 1, 2].forEach(function (i) { var im = self.objImgs && self.objImgs['kb_tidur' + i]; if (im) self.tweens.add({ targets: im, angle: { from: -3, to: 3 }, duration: 1700 + i * 230, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' }); });
        if (st >= 1 && !q.c9arrive) { q.c9arrive = 1; this.time.delayedCall(900, function () { if (!self.leaving) self.ui.say(self.ch2Lines(X.arrive)); }); }
      }
      if (a === 'bakau') {
        // the swing, hanging from its branch, moving a little all by itself
        var sw = this.add.image(32 * T + 2, 23 * T + 3, 'buaian9s').setOrigin(0.5, 0).setDepth(25 * T + 1);
        c.swing = sw; this.tweens.add({ targets: sw, angle: { from: -4, to: 4 }, duration: 2300, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        if (st === 2) {
          if (!q.c9enter) { q.c9enter = 1; this.time.delayedCall(800, function () { if (!self.leaving) self.ui.say(self.ch2Lines(X.enter)); }); }
          if ((q.c9find || 0) >= 3) this.showAwang9();
        }
        if (st === 5) this.showEldest9();
        if (st >= 5) { var wh = this.objImgs && this.objImgs.bk_pusaran; if (wh) this.tweens.add({ targets: wh, scaleX: 1.08, alpha: 0.75, duration: 1100, yoyo: true, repeat: -1 }); }
      }
      if (a === 'guatujuh') {
        if (q.c9right === undefined) q.c9right = Math.floor(Math.random() * C9.clams.length);
        q.c9open = q.c9open || {};
        Object.keys(q.c9open).forEach(function (k) { var im = self.objImgs['gt_kima' + k]; if (im) im.setTexture('kima9o'); });
        if (st >= 6) { var rc = self.objImgs['gt_kima' + q.c9right]; if (rc) rc.setTexture('kima9o'); }
        if (st === 5) {
          var b = this.add.sprite(18 * T, 10.4 * T, 'npc_puteri_bongsu_0').setOrigin(0.5, 1).setDepth(9003).setAlpha(0.85).setFlipX(true);
          b.play('npc_puteri_bongsu_idle');
          var gl = this.add.image(b.x, b.y - 12, 'glow').setBlendMode(ADD()).setDepth(9002).setTint(0x9ae8e0).setScale(0.9).setAlpha(0.45);
          this.tweens.add({ targets: [b, gl], y: '-=2', duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
          c.bongsu = { spr: b, gl: gl };
          if (!q.c9cave) { q.c9cave = 1; this.time.delayedCall(900, function () { if (!self.leaving) self.ui.say(self.ch2Lines(X.cave)); }); }
        }
      }
    },

    mayangObjAction: function (o) {
      var self = this, q = Q(), st = LC.ch9Step();
      switch (o.type) {
        case 'hanyut9': return { label: 'The empty boat', fn: function () { if (!q.c9boat) { q.c9boat = 1; self.ui.say([{ text: X.boat }]); } else self.toast(X.boatHint, 'i_mayang_pinang'); } };
        case 'tidur9': return { label: 'The fisherman', fn: function () {
          self.toast(pick(['He stands with his eyes shut, facing the sea, humming. When you touch his arm, it is as cold as the water.', 'His lips are moving. He is humming the same song as the voice in the mangrove. He does not know you are there.', 'He sways, and hums, and does not wake. His feet are wet up to the ankles.']), 'ic_moon');
          LC.Audio.sfx('shh9');
        } };
        case 'awang9': return st === 6 ? { label: 'Give Pak Awang his spirit', fn: function () { self.c9Finale(); } } : { label: 'Pak Awang', fn: function () { self.toast(X.awangCold, 'ic_moon'); } };
        case 'cari9': return { label: ['The empty perahu', 'The old well', 'The swing'][o.i], fn: function () {
          if (st === 2 && (q.c9find || 0) === o.i) { self.findEvent9(o.i); return; }
          self.toast(['An empty perahu on the black sand.', 'An old well. You do not look down it again.', 'The swing hangs still. For now.'][o.i], 'ic_moon');
        } };
        case 'lampu9': return { label: 'The old lamp', fn: function () { self.toast('An old oil lamp on a pole. Its little flame does not flicker, even in the wind. Bongsu hates the lamps, Tok Pawang says.', 'ic_glow'); } };
        case 'pinang9': return { label: st === 3 && q.c9pawang && !LC.State.count('mayang_pinang') ? 'Take the mayang' : 'The old pinang palm', fn: function () {
          if (st === 3 && q.c9pawang && !LC.State.count('mayang_pinang')) self.c9TakeMayang(); else self.toast(X.palm, 'i_mayang_pinang');
        } };
        case 'pawang9': return { label: 'Begin the Ulek Mayang', fn: function () { self.c9Ritual(); } };
        case 'dive9': return { label: 'Dive into the whirlpool', fn: function () {
          if (!LC.State.isOpen('guatujuh')) { self.toast('The whirlpool pulls downward, into the dark. You would need the Naga\'s blessing to breathe down there.', 'ic_glow'); LC.Audio.sfx('error'); return; }
          LC.Audio.sfx('dive'); self.goArea('guatujuh', self.tilePx(LC.AREAS.guatujuh.home), 'up');
        } };
        case 'naik9': return { label: 'Swim up to Pantai Bakau', fn: function () { LC.Audio.sfx('water'); self.goArea('bakau', self.tilePx({ x: 24.5, y: 28.6 }), 'down'); } };
        case 'kima9': return { label: (q.c9open || {})[o.i] ? 'A giant clam' : 'Open the giant clam', fn: function () { self.openClam9(o); } };
      }
      return undefined;
    },

    updateMayang: function (time, dt) {
      var c = this.c9, S = this.S, q = Q(), st = LC.ch9Step(), p = this.player;
      if (!c || !p) return;
      var blocked = this.ui.isBlocking() || this.sleeping || this.leaving || this.cutscene;
      if ((c.tick -= dt) <= 0 && !blocked) {
        c.tick = 1;
        if (this.area === 'farm' && st === 0 && (q.ch8 || 0) >= 9) {
          if (q.c9wait === undefined) q.c9wait = S.day;      // the chapter opens the night after Chapter 8 ends
          else if (S.day > q.c9wait && S.minutes >= C9.night) this.c9Hook();
        }
      }
      var mapW = this.W * T;
      c.fogs.forEach(function (f) { f.img.x += f.v * dt; if (f.img.x > mapW + 150) f.img.x = -150; });
      // who is singing, and where?
      c.src = null; c.hint = false;
      var her = false, herVol = 0, herPan = 0, him = false;
      if (this.area === 'farm' && st === 1 && (S.minutes >= 19 * 60 + 30 || S.minutes < 5 * 60)) { her = true; herVol = 0.2; herPan = 0; }
      if (this.area === 'kabus' && st === 2) { her = true; herVol = 0.16; herPan = -0.85; }
      if (this.area === 'bakau' && st === 2 && !c.busy && !c.scene) {
        var k = Math.min(3, q.c9find || 0), sp = C9.find[k];
        c.src = { x: sp[0] * T, y: sp[1] * T }; c.hint = true; her = true;
      }
      if (this.area === 'bakau' && c.chase) { c.src = { x: c.chase.spr.x, y: c.chase.spr.y - 14 }; her = true; }
      if (this.area === 'guatujuh' && st === 5 && !c.scene) {
        var rc = C9.clams[q.c9right || 0]; c.src = { x: (rc[0] + 1) * T, y: (rc[1] + 0.5) * T }; c.hint = true; him = true;
        her = true; var bd = Math.hypot(p.x - 18 * T, p.y - 11 * T); herVol = 0.12 + 0.28 * clamp(1 - bd / 300, 0, 1); herPan = clamp((18 * T - p.x) / 260, -1, 1);
      }
      if (c.src) {
        var dx = c.src.x - p.x, dy = c.src.y - (p.y - 8), d = Math.hypot(dx, dy), v = Math.pow(clamp(1 - d / C9.hear, 0, 1), 1.5) * 0.92 + 0.06, pn = clamp(dx / 240, -1, 1) * clamp(d / 90, 0.2, 1);
        c.vol = v; c.dist = d;
        if (him) { SING.him.run(true); SING.him.set(v, pn); }
        else { herVol = v; herPan = pn; }
      }
      if (!him) SING.him.run(false);
      SING.her.run(her && !c.scene);
      if (her) SING.her.set(herVol, herPan);
      if (blocked) return;
      // the search: close enough to where the song is coming from
      if (this.area === 'bakau' && st === 2 && !c.busy && c.src && c.dist < (q.c9find >= 3 ? 46 : C9.near) + 12) this.findEvent9(Math.min(3, q.c9find || 0));
      if (c.chase) this.updateChase9(dt);
    },

    // ================================================================ step 0: the song at the farm
    c9Hook: function () {
      var self = this, q = Q();
      if (LC.ch9Step() !== 0) return;
      q.ch9 = 1;   // (first: closing the lines early never loses the chapter)
      SING.her.run(true); SING.her.set(0.25, 0);
      var bumpAt = 3;
      this.ui.say(this.ch2Lines(X.hook), { onLine: function (i) {
        if (i === bumpAt && !self.leaving) {
          self.refreshWhen();
          var bt = self.objImgs && self.objImgs.f_perahu9;
          if (bt) { bt.x -= 40; self.tweens.add({ targets: bt, x: bt.x + 40, duration: 1600, ease: 'Sine.easeOut' }); }
          LC.Audio.sfx('splash'); self.cameras.main.shake(160, 0.002);
        }
      } });
    },

    // ================================================================ step 2: find the song
    showAwang9: function () {
      var c = this.c9;
      if (c.awang) return;
      var sp = C9.find[3], a = this.add.sprite(sp[0] * T, sp[1] * T + 4, 'awang_laut9_0').setOrigin(0.5, 1).setDepth(sp[1] * T + 4).setAlpha(0);
      var gl = this.add.image(a.x, a.y - 10, 'glow').setBlendMode(ADD()).setDepth(9002).setTint(0x7ab8c8).setScale(0.8).setAlpha(0);
      this.tweens.add({ targets: a, alpha: 1, duration: 1600 }); this.tweens.add({ targets: gl, alpha: 0.35, duration: 1600 });
      this.tweens.add({ targets: a, angle: { from: -2, to: 2 }, duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      c.awang = { spr: a, gl: gl };
    },
    findEvent9: function (k) {
      var self = this, c = this.c9, q = Q(), p = this.player;
      if (c.busy || LC.ch9Step() !== 2) return;
      c.busy = true;
      if (k === 3) { this.c9Found(); return; }
      SING.her.quiet(4);
      q.c9find = k + 1;   // (first: saved)
      function done() { c.busy = false; }
      if (k === 0) {   // the empty boat... and a giggle behind you
        this.time.delayedCall(1300, function () {
          if (self.leaving) return;
          LC.Audio.sfx('laugh9'); self.cameras.main.shake(120, 0.003);
          var bx = p.x + (self.dir === 'left' ? 22 : self.dir === 'right' ? -22 : 0), by = p.y + (self.dir === 'up' ? 20 : self.dir === 'down' ? -24 : 0);
          var shade = self.add.image(bx, by, 'puteri9_0').setOrigin(0.5, 1).setDepth(9004).setAlpha(0.5).setTint(0xb8d8e0);
          self.tweens.add({ targets: shade, alpha: 0, duration: 380, delay: 120, onComplete: function () { shade.destroy(); } });
          self.toast(X.find0, 'ic_moon');
        });
        this.time.delayedCall(3400, done);
      } else if (k === 1) {   // the well: a face in the water
        this.time.delayedCall(1000, function () {
          if (self.leaving) return;
          self.ui.scare9('face'); LC.Audio.sfx('splash');
          self.toast(X.find1, 'ic_moon');
        });
        this.time.delayedCall(2800, function () { if (!self.leaving) self.toast(X.find1b, 'ic_moon'); });
        this.time.delayedCall(3800, done);
      } else {   // the swing, swinging by itself; and now the song is out on the sea
        var sw = c.swing;
        if (sw) { this.tweens.killTweensOf(sw); this.tweens.add({ targets: sw, angle: { from: -32, to: 32 }, duration: 520, yoyo: true, repeat: 3, ease: 'Sine.easeInOut', onComplete: function () { self.tweens.add({ targets: sw, angle: { from: -4, to: 4 }, duration: 2300, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' }); } }); }
        [0, 1040, 2080].forEach(function (d) { self.time.delayedCall(d, function () { if (!self.leaving) LC.Audio.sfx('creak9'); }); });
        this.toast(X.find2, 'ic_moon');
        this.time.delayedCall(2200, function () { if (self.leaving) return; self.showAwang9(); self.toast(X.find3, 'ic_moon'); });
        this.time.delayedCall(3200, done);
      }
    },
    c9Found: function () {   // Pak Awang turns his head
      var self = this, c = this.c9, q = Q(), done = false;
      q.ch9 = 3; q.c9find = 3;   // (first)
      c.scene = true; this.cutscene = true;
      SING.her.quiet(1.5);
      this.showAwang9();
      var a = c.awang;
      this.time.delayedCall(1400, function () {
        if (self.leaving) return;
        SING.her.stop(0.1);
        if (a) { self.tweens.killTweensOf(a.spr); a.spr.setAngle(0).setTexture('awang_laut9_1'); }
        LC.Audio.sfx('wail9'); self.cameras.main.shake(300, 0.004);
        var tok = null;
        function end() {
          if (done) return; done = true; c.scene = false; self.cutscene = false; c.busy = false;
          [a && a.spr, a && a.gl, tok && tok.spr, tok && tok.gl].forEach(function (o) { if (o) self.tweens.add({ targets: o, alpha: 0, duration: 900, onComplete: function () { o.destroy(); } }); });
          c.awang = null;
          self.toast('Pak Awang is home, on a mat by his house. Talk to Tok Pawang at his hut in Kampung Pantai Kabus.', 'ic_moon');
        }
        self.ui.say(self.ch2Lines(X.found), { onLine: function (i) {
          if (self.leaving) return;
          if (i === 2 && a) { self.tweens.add({ targets: a.spr, y: a.spr.y + 8, alpha: 0.35, angle: 70, duration: 600, ease: 'Quad.easeIn' }); LC.Audio.sfx('splash'); self.fx.drop.explode(14, a.spr.x, a.spr.y - 6); }
          if (i === 3 && !tok) {   // Tok Pawang comes along the beach with a lamp
            var s = self.add.sprite(46 * T, 28.8 * T, 'npc_tok_pawang_0').setOrigin(0.5, 1).setDepth(28.8 * T).setFlipX(true);
            var gl = self.add.image(s.x, s.y - 12, 'glow').setBlendMode(ADD()).setDepth(9003).setTint(0xffc070).setScale(1.3).setAlpha(0.7);
            tok = { spr: s, gl: gl };
            self.tweens.add({ targets: [s, gl], x: 26 * T, duration: 1800, ease: 'Sine.easeOut' });
          }
        }, onDone: end });
        var w = self.time.addEvent({ delay: 500, loop: true, callback: function () { if (done) { w.remove(); return; } if (!self.ui.isBlocking()) { w.remove(); end(); } } });
      });
    },

    // ================================================================ step 3: the mayang, and the chase
    c9TakeMayang: function () {
      var self = this, q = Q();
      if (!LC.State.canAdd('mayang_pinang')) { this.toast('Your bag is full! Make room first.'); LC.Audio.sfx('error'); return; }
      LC.State.add('mayang_pinang', 1);
      LC.Audio.sfx('harvest');
      this.toast(X.palmTake, 'i_mayang_pinang');
      if (q.c9chased) return;
      this.time.delayedCall(1800, function () { if (!self.leaving && self.area === 'bakau') self.c9ChaseStart(); });
    },
    c9ChaseStart: function () {
      var c = this.c9, p = this.player, CH = C9.chase;
      if (c.chase) return;
      var s = this.add.sprite(Math.max(3 * T, p.x - 72), p.y - 12, 'bongsu9w_0').setOrigin(0.5, 1).setDepth(9004);   // (she appears among the trees behind the palm, a little way back)
      s.play('bongsu9w_walk');
      var gl = this.add.image(s.x, s.y - 14, 'glow').setBlendMode(ADD()).setDepth(9003).setTint(0x9ae8e0).setScale(1.1).setAlpha(0.5);
      c.chase = { spr: s, gl: gl, quietT: CH.every + Math.random() * 2, quiet: 0, grace: 0, cool: 2, check: { x: 7.5 * T, y: 9 * T }, told: false };
      this.ui.scare9('face');
      SING.her.run(true);
      this.toast(X.chaseGo, 'ic_moon');
    },
    updateChase9: function (dt) {
      var self = this, c = this.c9, ch = c.chase, CH = C9.chase, p = this.player, s = ch.spr;
      var lampIn = null;
      C9.lamps.forEach(function (t) { var lx = (t[0] + 0.5) * T, ly = (t[1] + 1) * T; if (Math.hypot(p.x - lx, p.y - ly) < CH.lampR) lampIn = { x: lx, y: ly }; });
      if (lampIn) { ch.check = { x: lampIn.x, y: lampIn.y + 16 }; if (!ch.told) { ch.told = true; this.toast(X.lampSafe, 'ic_glow'); } }
      if (ch.cool > 0) ch.cool -= dt;
      if (ch.quiet > 0) {   // she has stopped singing: she is listening
        ch.quiet -= dt; ch.grace -= dt;
        s.anims.pause();
        if (this.moving && ch.grace <= 0 && !lampIn && ch.cool <= 0) { this.c9Caught(true); return; }
        if (ch.quiet <= 0) { s.anims.resume(); ch.quietT = CH.every + Math.random() * (CH.every2 - CH.every); }
      } else if ((ch.quietT -= dt) <= 0 && ch.cool <= 0) {
        ch.quiet = CH.quiet; ch.grace = CH.grace;
        SING.her.quiet(CH.quiet); LC.Audio.sfx('shh9');
        this.ui.floatText(p.x, p.y - 30, 'Shhh...', '#bfe8ff');
        this.toast(X.shh, 'ic_moon');
      } else if (ch.cool <= 0) {   // she drifts after you (faster when you are far ahead); never into a lamp's light
        var tx = p.x, ty = p.y;
        if (lampIn) { var ax = s.x - lampIn.x, ay = s.y - lampIn.y, al = Math.hypot(ax, ay) || 1; tx = lampIn.x + ax / al * (CH.lampR + 14); ty = lampIn.y + ay / al * (CH.lampR + 14); }
        var dx = tx - s.x, dy = ty - s.y, d = Math.hypot(dx, dy), dp = Math.hypot(p.x - s.x, p.y - s.y), sp = dp > CH.far ? CH.sprint : CH.speed;
        if (d > 1) { var m = Math.min(d, sp * dt); s.x += dx / d * m; s.y += dy / d * m; }
        s.setFlipX(dx < 0);
        if (!lampIn && dp < CH.catchR + 6 && this.invuln <= 0) { this.c9Caught(false); return; }
      }
      s.setAlpha(0.72 + 0.22 * Math.sin(this.time.now / 140)).setDepth(Math.max(s.y, 9004));
      ch.gl.setPosition(s.x, s.y - 14);
      if (p.x > CH.endX * T) this.c9ChaseEnd();
    },
    c9Caught: function (lunge) {
      var self = this, c = this.c9, ch = c.chase, CH = C9.chase, p = this.player, s = ch.spr;
      if (lunge) { s.setPosition(p.x + (Math.random() < 0.5 ? -14 : 14), p.y - 2); }
      ch.cool = 2.2; ch.quiet = 0; ch.quietT = CH.every + Math.random() * 2; s.anims.resume();
      SING.her.quiet(0.8);
      this.ui.scare9('face');
      this.playerHurt(CH.dmg, { spr: { x: s.x, y: s.y } });
      if (this.leaving || !c.chase) return;
      this.time.delayedCall(260, function () {
        if (self.leaving || !c.chase) return;
        self.player.setPosition(ch.check.x, ch.check.y);
        s.setPosition(ch.check.x - 150, ch.check.y - 6);
        self.fx.smoke.explode(8, ch.check.x, ch.check.y - 8);
        self.toast(X.caught, 'ic_moon');
      });
    },
    c9ChaseEnd: function () {
      var self = this, c = this.c9, q = Q(), ch = c.chase;
      if (!ch) return;
      q.c9chased = 1; c.chase = null;
      SING.her.stop(0.6); LC.Audio.sfx('wail9');
      this.tweens.add({ targets: [ch.spr, ch.gl], alpha: 0, duration: 900, onComplete: function () { ch.spr.destroy(); ch.gl.destroy(); } });
      this.toast(X.chaseEnd, 'i_mayang_pinang');
      void self;
    },

    // ================================================================ step 4: the Ulek Mayang
    c9Ritual: function () {
      var self = this, c = this.c9, p = this.player, done = false;
      if (c.scene || LC.ch9Step() !== 4) return;
      c.scene = true; this.cutscene = true;
      p.setPosition(23.5 * T, 28.9 * T); this.dir = 'down';
      LC.Audio.sfx('chime');
      function go() { if (done) return; done = true; self.c9Verse(0); }
      this.ui.say(this.ch2Lines(X.ritualStart), { onDone: go });
      var w = this.time.addEvent({ delay: 500, loop: true, callback: function () { if (done) { w.remove(); return; } if (!self.ui.isBlocking()) { w.remove(); go(); } } });
    },
    c9Verse: function (k) {
      var self = this, c = this.c9;
      this.cutscene = true;
      this.ui.openUlek(k, function () { self.c9AfterVerse(k); }, function () {   // gave up: begin again later
        c.scene = false; self.cutscene = false;
        self.c9Clear(); self.toast('Tok Pawang nods. "When you are ready, child. Talk to me, and we begin again."', 'ic_moon');
      });
    },
    c9Wrong: function () {   // a wrong note: the sea hisses, something laughs
      LC.Audio.sfx('laugh9'); this.cameras.main.shake(200, 0.004);
      this.c9.cast.forEach(function (x) { if (x.spr && x.spr.active) x.spr.setTintFill(0xffffff); });
      var self = this; this.time.delayedCall(90, function () { self.c9.cast.forEach(function (x) { if (x.spr && x.spr.active) x.spr.clearTint(); }); });
    },
    c9Put: function (tex, anim, tx, ty, tint, delay) {   // somebody rising from the sea
      var x = tx * T, y = ty * T, spr = this.add.sprite(x, y + 10, tex).setOrigin(0.5, 1).setDepth(9003).setAlpha(0);
      if (anim && this.anims.exists(anim)) spr.play(anim);
      var gl = this.add.image(x, y - 12, 'glow').setBlendMode(ADD()).setDepth(9002).setTint(tint).setScale(0.9).setAlpha(0);
      this.tweens.add({ targets: spr, alpha: 0.9, y: y, duration: 1300, delay: delay || 0, ease: 'Sine.easeOut' });
      this.tweens.add({ targets: gl, alpha: 0.45, duration: 1300, delay: delay || 0 });
      this.fx.drop.explode(6, x, y);
      var r = { spr: spr, gl: gl };
      this.c9.cast.push(r);
      return r;
    },
    c9Clear: function () { var self = this; this.c9.cast.forEach(function (r) { [r.spr, r.gl].forEach(function (o) { if (o && o.active) self.tweens.add({ targets: o, alpha: 0, duration: 800, onComplete: function () { o.destroy(); } }); }); }); this.c9.cast = []; },
    c9AfterVerse: function (k) {
      var self = this, c = this.c9, q = Q(), done = false;
      function next(fn) { var d = false; return { onDone: function () { if (d) return; d = true; fn(); }, check: function () { return d; }, run: function () { if (!d) { d = true; fn(); } } }; }
      function sayThen(lines, opts, fn) {
        var n = next(fn); opts = opts || {}; opts.onDone = n.onDone;
        self.ui.say(self.ch2Lines(lines), opts);
        var w = self.time.addEvent({ delay: 500, loop: true, callback: function () { if (n.check()) { w.remove(); return; } if (!self.ui.isBlocking()) { w.remove(); n.run(); } } });
      }
      if (k === 0) {   // five princesses rise
        [[19.5, 31.6], [21.8, 32], [24.5, 32.3], [27.2, 32], [29.5, 31.6]].forEach(function (t, i) { self.c9Put('puteri9_0', 'puteri9_walk', t[0], t[1], 0x9ae8e0, i * 380); });
        LC.Audio.sfx('wail9'); this.time.delayedCall(1200, function () { if (!self.leaving) LC.Audio.sfx('laugh9'); });
        var bowls = [];
        this.time.delayedCall(2200, function () {
          if (self.leaving) return;
          sayThen(X.five, { onLine: function (i) {
            if (i === 3) for (var b = 0; b < 7; b++) bowls.push(self.add.image((20.5 + b * 1.25) * T, 29.7 * T, 'nasi9').setDepth(29.7 * T).setScale(1.2));
            if (i === 4) bowls.forEach(function (bw) { self.fx.sparkle.explode(3, bw.x, bw.y - 4); self.tweens.add({ targets: bw, alpha: 0, duration: 900, delay: 300, onComplete: function () { bw.destroy(); } }); });
          } }, function () { self.c9Verse(1); });
        });
      } else if (k === 1) {   // Puteri Bongsu, and the whirlpool
        this.ui.scare9('face');
        var bong = this.c9Put('bongsu9w_0', 'bongsu9w_walk', 24.5, 31.2, 0x9ae8e0, 0);
        bong.spr.setAlpha(0.95).setY(31.2 * T); this.cameras.main.shake(400, 0.006); this.fx.drop.explode(20, bong.spr.x, bong.spr.y - 10);
        var orb = this.add.image(bong.spr.x, bong.spr.y - 14, 'orb9').setDepth(9005).setBlendMode(ADD());
        this.c9.cast.push({ spr: orb });
        var wh = null;
        this.time.delayedCall(900, function () {
          if (self.leaving) return;
          sayThen(X.bongsuRise, { onLine: function (i) {
            if (i === 3) {
              self.tweens.add({ targets: [bong.spr, bong.gl, orb], y: '+=24', alpha: 0, duration: 700, ease: 'Quad.easeIn' });
              LC.Audio.sfx('splash'); self.fx.drop.explode(18, bong.spr.x, bong.spr.y);
              wh = self.add.image(24.5 * T + 8, 31 * T, 'pusaran9').setDepth(30 * T).setAlpha(0).setScale(0.3);
              self.tweens.add({ targets: wh, alpha: 0.9, scale: 1, duration: 900 });
              self.c9.cast.push({ spr: wh });
            }
          } }, function () { self.c9Verse(2); });
        });
      } else {   // the eldest
        q.ch9 = 5;   // (first)
        LC.Audio.sfx('dawn9'); this.cameras.main.flash(600, 200, 255, 240);
        c.fogs.forEach(function (f) { self.tweens.add({ targets: f.img, alpha: 0.03, duration: 1800 }); });
        this.c9Put('sulung9_0', 'sulung9_walk', 27.5, 31.6, 0xbfffee, 200);
        this.c9.cast.forEach(function (r) { if (r.spr && r.spr.texture && r.spr.texture.key.indexOf('puteri9') === 0) self.tweens.add({ targets: r.spr, scaleY: 0.86, duration: 700, delay: 1400 }); });
        this.time.delayedCall(1700, function () {
          if (self.leaving) return;
          sayThen(X.sulung, {}, function () {
            self.c9Clear();
            c.fogs.forEach(function (f) { self.tweens.add({ targets: f.img, alpha: f.a, duration: 3000 }); });
            self.refreshWhen();
            var real = self.objImgs && self.objImgs.bk_pusaran;
            if (real) self.tweens.add({ targets: real, scaleX: 1.08, alpha: 0.75, duration: 1100, yoyo: true, repeat: -1 });
            self.showEldest9();
            c.scene = false; self.cutscene = false;
            LC.Audio.sfx('stage');
          });
        });
      }
    },
    showEldest9: function () {   // she waits by the whirlpool while you go down (step 5)
      var c = this.c9;
      if (c.eldest) return;
      var s = this.add.sprite(27.6 * T, 31.4 * T, 'sulung9_0').setOrigin(0.5, 1).setDepth(9003).setAlpha(0.85);
      s.play('sulung9_walk');
      var gl = this.add.image(s.x, s.y - 14, 'glow').setBlendMode(ADD()).setDepth(9002).setTint(0xbfffee).setScale(1).setAlpha(0.45);
      this.tweens.add({ targets: [s, gl], y: '-=3', duration: 1700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      c.eldest = { spr: s, gl: gl };
    },

    // ================================================================ step 5: the cave of the seven clams
    openClam9: function (o) {
      var self = this, q = Q(), st = LC.ch9Step(), op = q.c9open || (q.c9open = {});
      if (st !== 5) { this.toast(st > 5 ? 'A giant clam, closed, breathing slowly in the dark. It is just a clam now.' : 'A giant clam, shut tight.', 'ic_moon'); return; }
      if (op[o.i]) { this.toast(X.clamDone, 'ic_moon'); return; }
      if (o.i === q.c9right) { this.c9Spirit(o); return; }
      var n = Object.keys(op).length;
      op[o.i] = 1;
      var im = this.objImgs['gt_kima' + o.i];
      if (im) { im.setTexture('kima9o'); this.tweens.add({ targets: im, scaleY: 0.8, duration: 70, yoyo: true }); }
      LC.Audio.sfx('snap9'); this.cameras.main.shake(180, 0.005);
      this.ui.scare9(n === 0 ? 'face' : 'flash');
      this.toast(X.clamWrong[n % X.clamWrong.length], 'ic_moon');
    },
    c9Spirit: function (o) {
      var self = this, c = this.c9, q = Q(), p = this.player, done = false;
      q.ch9 = 6;   // (first)
      if (LC.State.canAdd('semangat_awang')) LC.State.add('semangat_awang', 1); else q.c9spiritOwed = 1;
      c.scene = true; this.cutscene = true;
      SING.him.stop(0.4); SING.her.stop(0.4);
      var im = this.objImgs['gt_kima' + o.i];
      if (im) im.setTexture('kima9l');
      var ox = (o.x + 1) * T, oy = (o.y + 0.4) * T;
      var orb = this.add.image(ox, oy, 'orb9').setDepth(9005).setBlendMode(ADD()).setScale(0.6);
      this.tweens.add({ targets: orb, scale: 1.2, y: oy - 8, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      LC.Audio.sfx('chime'); this.fx.sparkle.explode(16, ox, oy);
      var B = c.bongsu, E = null;
      if (B) { this.tweens.killTweensOf([B.spr, B.gl]); this.tweens.add({ targets: [B.spr, B.gl], x: p.x + 22, y: p.y - 2, duration: 1200, ease: 'Sine.easeInOut' }); }
      function end() {
        if (done) return; done = true; c.scene = false; self.cutscene = false;
        [orb, B && B.spr, B && B.gl, E && E.spr, E && E.gl].forEach(function (x) { if (x) self.tweens.add({ targets: x, alpha: 0, duration: 1200, onComplete: function () { x.destroy(); } }); });
        c.bongsu = null;
        LC.Audio.sfx('restu');
        self.toast('You have Pak Awang\'s spirit. Swim up, and take it home to Kampung Pantai Kabus.', 'i_semangat_awang');
      }
      this.time.delayedCall(1000, function () {
        if (self.leaving) return;
        self.ui.say(self.ch2Lines(X.spirit), { onLine: function (i) {
          if (X.spirit[i].who === 'sulung' && !E) {
            var s = self.add.sprite(18 * T, 20.4 * T, 'sulung9_0').setOrigin(0.5, 1).setDepth(9003).setAlpha(0);
            s.play('sulung9_walk');
            var gl = self.add.image(s.x, s.y - 14, 'glow').setBlendMode(ADD()).setDepth(9002).setTint(0xbfffee).setScale(1.1).setAlpha(0);
            self.tweens.add({ targets: s, alpha: 0.9, duration: 900 }); self.tweens.add({ targets: gl, alpha: 0.5, duration: 900 });
            E = { spr: s, gl: gl };
          }
          if (/gives it to you/.test(X.spirit[i].text || '')) self.tweens.add({ targets: orb, x: p.x, y: p.y - 14, scale: 0.7, duration: 900, onComplete: function () { orb.setVisible(false); self.fx.sparkle.explode(10, p.x, p.y - 12); } });
        }, onDone: end });
        var w = self.time.addEvent({ delay: 500, loop: true, callback: function () { if (done) { w.remove(); return; } if (!self.ui.isBlocking()) { w.remove(); end(); } } });
      });
    },

    // ================================================================ step 6: Pak Awang wakes, and the sun comes up
    c9Finale: function () {
      var self = this, c = this.c9, q = Q(), S = this.S, p = this.player, done = false;
      if (LC.ch9Step() !== 6 || c.scene) return;
      // (first: everything the chapter gives, so a dialogue closed early can never lose it)
      q.ch9 = 7; q.laguMayang = 1; delete q.c9spiritOwed;
      if (LC.State.count('semangat_awang')) LC.State.remove('semangat_awang', LC.State.count('semangat_awang'));
      ['mayang_pinang', 'nasi_kunyit'].forEach(function (id) { if (LC.State.count(id)) LC.State.remove(id, LC.State.count(id)); });
      S.kepeng += C9.reward; S.stats.earned += C9.reward;
      if (LC.State.canAdd('mutiara')) LC.State.add('mutiara', 3);
      LC.State.recalc();
      this.doShared('kind', { n: 25 }, function () {});
      c.scene = true; this.cutscene = true;
      var mat = this.objImgs && this.objImgs.kb_awang, mx = mat ? mat.x : 22 * T, my = mat ? mat.y - 6 : 11.6 * T;
      var orb = this.add.image(p.x, p.y - 14, 'orb9').setDepth(9005).setBlendMode(ADD());
      this.tweens.add({ targets: orb, x: mx - 8, y: my - 2, duration: 1100, ease: 'Sine.easeInOut', onComplete: function () { orb.destroy(); if (!self.leaving) { self.fx.sparkle.explode(20, mx - 8, my); self.shockwave(mx - 8, my, 40, 0xffe8a0); LC.Audio.sfx('gasp9'); } } });
      var X9 = X.finale, dawnAt = -1, wakeAt = 1, seaAt = -1;
      X9.forEach(function (l, i) { if (/sun comes up/.test(l.text)) dawnAt = i; if (/two pale figures/.test(l.text)) seaAt = i; });
      var sea = [];
      function end() {
        if (done) return; done = true; c.scene = false; self.cutscene = false;
        sea.forEach(function (o) { self.tweens.add({ targets: o, alpha: 0, duration: 1500, onComplete: function () { o.destroy(); } }); });
        if (!c.dawn) self.c9Dawn();
        self.toast('Lagu Mayang: press L (or tap the mayang button) to sing. Every enemy around you sways in a trance for ' + C9.lagu.dur + ' seconds.', 'ic_mayang');
      }
      this.time.delayedCall(1300, function () {
        if (self.leaving) return;
        self.ui.say(self.ch2Lines(X9), { onLine: function (i) {
          if (self.leaving) return;
          if (i === wakeAt) {   // he sits up (the mat goes when the others wake)
            if (mat) mat.setVisible(false);
            self.placeVillager('pak_awang'); var n = self.npcs.pak_awang;
            if (n) { self.fx.drop.explode(10, n.spr.x, n.spr.y - 10); self.tweens.add({ targets: n.spr, y: n.spr.y - 4, duration: 120, yoyo: true, repeat: 2 }); }
            LC.Audio.sfx('splash');
          }
          if (i === wakeAt + 3) {   // the sleepers on the beach wake up and wander home
            [0, 1, 2].forEach(function (k) { var im = self.objImgs && self.objImgs['kb_tidur' + k]; if (im) { self.tweens.killTweensOf(im); self.tweens.add({ targets: im, angle: 0, alpha: 0, y: im.y - 30, duration: 1600 }); } });
            self.time.delayedCall(1700, function () { if (!self.leaving) self.refreshWhen(); });
          }
          if (i === dawnAt) self.c9Dawn();
          if (i === seaAt) [['sulung9_0', 'sulung9_walk', 21], ['npc_puteri_bongsu_0', 'npc_puteri_bongsu_idle', 23.5]].forEach(function (s) {
            var spr = self.add.sprite(s[2] * T, 32.4 * T, s[0]).setOrigin(0.5, 1).setDepth(9003).setAlpha(0);
            if (self.anims.exists(s[1])) spr.play(s[1]);
            self.tweens.add({ targets: spr, alpha: 0.7, duration: 1500 }); sea.push(spr);
          });
        }, onDone: end });
        var w = self.time.addEvent({ delay: 500, loop: true, callback: function () { if (done) { w.remove(); return; } if (!self.ui.isBlocking()) { w.remove(); end(); } } });
      });
    },
    c9Dawn: function () {   // the dark lifts
      var self = this, c = this.c9;
      if (c.dawn) return;
      c.horror = false; c.dawn = true;
      LC.Audio.horror(false); LC.Audio.sfx('dawn9');
      this.playerLight.base = 0.35; this.playerLight.img.setTint(0xfff2d0);
      this.cameras.main.flash(1400, 255, 200, 140);
      c.fogs.forEach(function (f) { self.tweens.add({ targets: f.img, alpha: 0, duration: 3000, onComplete: function () { f.img.destroy(); } }); });
      c.fogs = [];
      this.refreshWhen();
    },

    // ================================================================ L: Lagu Mayang
    laguLeft: function () { return Math.max(0, ((LC.laguAt || 0) - Date.now()) / 1000); },
    note9: function (x, y, tint) {
      var n = this.add.image(x, y, 'note9').setDepth(9600).setTint(tint || 0xffffff).setAlpha(0.95);
      this.tweens.add({ targets: n, y: y - 18 - Math.random() * 10, x: x + (Math.random() - 0.5) * 14, alpha: 0, duration: 1100, ease: 'Sine.easeOut', onComplete: function () { n.destroy(); } });
    },
    laguKey: function () {
      if (!LC.hasLagu() || this.sleeping || this.leaving || this.cutscene || this.reuniting || (this.ui && this.ui.isBlocking())) return;
      var left = this.laguLeft();
      if (left > 0) { this.toast('Your voice needs a rest... (' + Math.ceil(left) + 's)', 'ic_mayang'); LC.Audio.sfx('error'); return; }
      var self = this, L = C9.lagu, p = this.player, x = p.x, y = p.y - 8, hit = 0;
      LC.laguAt = Date.now() + L.cd * 1000;
      SING.me.phrase([[2, 0.75, 'a'], [3, 0.5, 'a'], [4, 1, 'o'], [3, 0.5, 'a'], [2, 1.5, 'a']], 0.75);
      LC.Audio.sfx('lagu9');
      this.shockwave(x, y, L.r, 0x9ae8e0);
      this.time.delayedCall(220, function () { if (!self.leaving) self.shockwave(x, y, L.r * 0.65, 0xffe8a0); });
      for (var i = 0; i < 8; i++) (function (i) { self.time.delayedCall(i * 90, function () { if (!self.leaving) self.note9(p.x + (Math.random() - 0.5) * 30, p.y - 14, i % 2 ? 0x9ae8e0 : 0xffe8a0); }); })(i);
      this.fx.petal.explode(10, x, y);
      (this.enemies || []).forEach(function (e) {
        if (e.dead || e.away || e.stoneT > 0) return;
        var d = Math.hypot(e.spr.x - x, (e.spr.y - 6) - y);
        if (d > L.r + e.def.w) return;
        hit++;
        e.tranceT = e.def.boss ? L.bossDur : L.dur; e.windT = 0; e.strikeT = 0; e.kx = 0; e.ky = 0;
        e.spr.setTint(0xc8fff0);
        self.ui.floatText(e.spr.x, e.spr.y - e.spr.height - 2, pick(X.entranced), '#bfffee');
      });
      this.ui.floatText(x, y - 26, pick(X.lagu), '#bfffee');
      if (hit) LC.Audio.sfx('ring9');
    }
  });
})(window.LC);
