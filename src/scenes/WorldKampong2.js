/* World, part 10 (v2.1): Chapter 3, Kampong Ayer (part 2). The jinn Bilanapura on Pulau Pilong-Pilongan (fought beside
 * Awang Semaun, Awang Jerambak and Damang Sari), Pelita's stone lamp and its visions of the future, Antonio's tour of
 * the water city in 1521, and the defence of 1578 in four waves (the meriam, the fires, the families, the walkways).
 * Personal to each player. Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var T = 16, proto = LC.WorldScene.prototype;
  function Q() { return LC.State.s.quests; }

  // ---------------------------------------------------------------- hooks into combat and into part 1
  var groupOn = proto.groupOn;
  proto.groupOn = function (g) { return g.when ? !!g.when(this) : groupOn.call(this, g); };
  var enemyDie = proto.enemyDie;
  proto.enemyDie = function (e) {
    if (e.kind === 'bilanapura') return this.jinnDefeated(e);
    if (e.kind === 'askar') return this.askarDown(e);
    return enemyDie.call(this, e);
  };
  var createEnemies = proto.createEnemies;   // (the scene object outlives a reload: no fight carries over to the next place)
  proto.createEnemies = function () { this.jinnOn = false; this.jinnE = null; this.war = null; return createEnemies.apply(this, arguments); };
  var createKampong = proto.createKampong;
  proto.createKampong = function () { createKampong.call(this); this.createKampong2(); };
  var updateKampong = proto.updateKampong;
  proto.updateKampong = function (time, dt) { updateKampong.call(this, time, dt); this.updateKampong2(time, dt); };
  var kampongObjAction = proto.kampongObjAction;
  proto.kampongObjAction = function (o) { var a = this.kampongObjAction2(o); return a !== undefined ? a : kampongObjAction.call(this, o); };

  Object.assign(proto, {
    createKampong2: function () {
      var self = this, st = LC.ch3Step();
      this.k2 = { things: {}, marks: [], heroT: 2, heroI: 0, smokeT: 0 };
      this.jinnOn = false; this.jinnE = null; this.war = null; LC.kaWar = null; LC.kaArea = this.area;
      if (this.area === 'mountain' && this.npcs.gergasi) this.npcs.gergasi.spr.setScale(1.6);
      if (this.area === 'teluk' && st === 10) LC.JINN_HEROES.forEach(function (h) { self.kaThing(h.vid, h, 'npc_' + h.vid + '_0', { type: 'hero', vid: h.vid }, 'npc_' + h.vid + '_idle'); });
      if (this.objImgs.b_pelita) this.lampGlow(this.objImgs.b_pelita);
      if (this.objImgs.k_back) this.lampGlow(this.objImgs.k_back);
      if (this.area === 'kayer') {
        if (st === 11) this.refreshTour();
        if (st === 12) this.time.delayedCall(1500, function () { if (!self.leaving) self.startWar(); });
      }
    },
    updateKampong2: function (time, dt) {
      var k = this.k2, self = this, w = this.war;
      if (!k) return;
      if (this.jinnOn && this.jinnE && !this.jinnE.dead && !this.jinnE.away && !this.cutscene && !this.ui.isBlocking()) {
        if ((k.heroT -= dt) <= 0) { k.heroT = 2.2; this.heroStrike(k.things[LC.JINN_HEROES[k.heroI++ % 3].vid]); }
      }
      if (w && (k.smokeT -= dt) <= 0) {
        k.smokeT = 0.35;
        Object.keys(w.fires).forEach(function (i) { var f = w.fires[i]; if (!f.out) self.fx.smoke.explode(1, f.spr.x + (Math.random() - 0.5) * 10, f.spr.y - 14); });
      }
    },
    lampGlow: function (img) {
      var g = this.add.image(img.x, img.y - 18, 'glow').setBlendMode(Phaser.BlendModes.ADD).setDepth(9001).setTint(0xffd166).setScale(0.6).setAlpha(0.5);
      this.tweens.add({ targets: g, alpha: 0.2, scale: 0.75, duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    },
    // a figure or thing standing on one tile (it blocks the tile and can be talked to)
    kaThing: function (key, t, tex, o, anim) {
      var x = t.x * T + 8, y = (t.y + 1) * T, spr = this.add.sprite(x, y, tex).setOrigin(0.5, 1).setDepth(y);
      if (anim && this.anims.exists(anim)) spr.play(anim);
      var th = { spr: spr, tx: t.x, ty: t.y, o: o, hx: x, hy: y, was: this.solid[t.y][t.x] };
      this.solid[t.y][t.x] = true; this.objAt[t.y][t.x] = o;
      this.k2.things[key] = th;
      return th;
    },
    kaRemove: function (key, fade) {
      var th = this.k2.things[key];
      if (!th) return;
      if (this.objAt[th.ty][th.tx] === th.o) { this.objAt[th.ty][th.tx] = null; this.solid[th.ty][th.tx] = th.was; }
      if (fade) this.tweens.add({ targets: th.spr, alpha: 0, duration: 800, onComplete: function () { th.spr.destroy(); } });
      else th.spr.destroy();
      delete this.k2.things[key];
    },

    kampongObjAction2: function (o) {
      var self = this, q = Q(), st = LC.ch3Step();
      switch (o.type) {
        case 'hero': return { label: 'Talk to ' + LC.VILLAGERS[o.vid].name, fn: function () { self.startJinn(); } };
        case 'vision': return { label: 'Pelita\'s stone lamp', fn: function () { self.seeFuture(); } };
        case 'vision_back': return { label: 'Let Pelita\'s light fade (back to Barunai)', fn: function () { self.leaveVision(false); } };
        case 'tour': {
          var live = st === 11 && q.tourOn && !(q.tour || {})[o.stop];
          return { label: live ? 'Show Antonio ' + LC.TOUR[o.stop].name : 'Look', fn: function () { self.tourStop(o); } };
        }
        case 'meriam': return { label: 'Fire the meriam', fn: function () { self.fireMeriam(o.i); } };
        case 'api': return { label: 'Douse the fire', fn: function () { self.douse(o.i); } };
        case 'keluarga': return { label: 'Row the family to safety', fn: function () { self.rowFamily(o.i); } };
      }
      return undefined;
    },

    // ================================================================ Bilanapura
    startJinn: function () {
      var self = this;
      if (this.jinnOn) return;
      if (!LC.State.count('kulit_ikan')) {
        this.ui.say(this.ch2Lines([{ who: 'jerambak', text: 'Without the magic fish skin, our blades pass through it like smoke. Find the old ogre by the cliffs of Gunung Kabus first.' }]));
        return;
      }
      this.ui.say(this.ch2Lines(LC.CH3TEXT2.jinnStart), { onDone: function () {
        self.jinnOn = true; self.k2.heroT = 2.5;
        self.cameras.main.shake(800, 0.006); LC.Audio.sfx('splash'); LC.Audio.sfx('wind');
        self.fx.drop.explode(30, 31 * T, 13 * T);
        self.checkGroups();
        self.jinnE = self.enemies.filter(function (e) { return e.kind === 'bilanapura'; })[0];
        self.toast('Bilanapura rises! Fight beside the three heroes. (Sumpahan Batu holds it still for a moment.)', 'ic_moon');
      } });
    },
    heroStrike: function (th) {
      var self = this, e = this.jinnE;
      if (!th || !e || e.dead || e.away) return;
      var side = th.hx < e.spr.x ? -1 : 1;
      th.spr.setFlipX(side > 0);
      this.tweens.add({ targets: th.spr, x: e.spr.x + side * 16, y: e.spr.y, duration: 260, ease: 'Quad.easeIn', onComplete: function () {
        if (!e.dead && !e.away) {
          e.hp -= 2; e.hurtT = 0.1; e.spr.setTintFill(0xffffff);
          LC.Audio.sfx('hit'); self.fx.sparkle.explode(6, e.spr.x, e.spr.y - 20);
          self.ui.floatText(e.spr.x, e.spr.y - 46, LC.VILLAGERS[th.o.vid].name.split(' ').pop() + '! 2', '#ffd166');
          if (e.hp <= 0) self.enemyDie(e);
        }
        self.tweens.add({ targets: th.spr, x: th.hx, y: th.hy, duration: 420, ease: 'Quad.easeOut' });
      } });
    },
    jinnDefeated: function (e) {
      var self = this, s = e.spr, q = Q(), S = this.S;
      e.dead = true; e.respawn = 1e9; e.stoneT = 0; e.light.base = 0; this.jinnOn = false;
      if (s.anims.isPaused) s.anims.resume();
      LC.Audio.sfx('poof'); LC.Audio.sfx('restu'); LC.Audio.setBattle(false);
      this.fx.smoke.explode(30, s.x, s.y - 20); this.fx.sparkle.explode(40, s.x, s.y - 20); this.fx.drop.explode(24, s.x, s.y - 10);
      this.cameras.main.flash(600, 220, 240, 255);
      this.tweens.add({ targets: s, alpha: 0, scaleY: 0.1, scaleX: 1.6, duration: 900, onComplete: function () { s.setVisible(false).setScale(1).clearTint(); } });
      this.cutscene = true;
      this.time.delayedCall(1100, function () {
        self.ui.say(self.ch2Lines(LC.CH3TEXT2.jinnWon), { onDone: function () {
          q.ch3 = 11; q.jinn = 1; LC.State.remove('kulit_ikan', 1);
          S.kepeng += 2000; S.stats.earned += 2000; LC.State.recalc(); S.hp = S.maxHp;
          self.doShared('kind', { n: 12 }, function () {});
          LC.JINN_HEROES.forEach(function (h) { self.kaRemove(h.vid, true); });
          self.cutscene = false;
          self.toast('Pelita is glowing strangely... Pateh Berbai in Barunai might know why.', 'ic_glow');
        } });
      });
    },

    // ================================================================ Pelita's visions
    seeFuture: function () {
      var self = this, st = LC.ch3Step(), A = LC.AREAS.kayer, T2 = LC.CH3TEXT2;
      if (st !== 11 && st !== 12) return;
      A.sub = st === 11 ? '1521: the Venice of the East' : '1578: the defence of the water city';
      LC.Audio.sfx('restu');
      this.ui.say(st === 11 ? T2.vision1521 : T2.vision1578, { onDone: function () {
        self.cameras.main.flash(700, 255, 230, 170);
        self.goArea('kayer', self.tilePx(A.home), 'down');
      } });
    },
    leaveVision: function (done) {
      var self = this;
      LC.Audio.sfx('chime');
      this.ui.say([{ text: LC.CH3TEXT2.fade }], { onDone: function () { self.goArea('barunai', self.tilePx({ x: 24, y: 8 }), 'down'); } });
    },

    // ================================================================ 1521: showing Antonio around
    refreshTour: function () {
      var self = this, q = Q(), seen = q.tour || {};
      this.k2.marks.forEach(function (m) { m.destroy(); });
      this.k2.marks = [];
      if (LC.ch3Step() !== 11 || !q.tourOn) return;
      this.objects.forEach(function (o) {
        if (o.type !== 'tour' || seen[o.stop] || (o.when && !o.when(self.S))) return;
        var x = (o.x + (o.w || 1) / 2) * T, y = (o.y + (o.h || 1)) * T - (o.h || 1) * T - 10;
        var m = self.add.image(x, y, 'sparkle').setDepth(9500).setScale(2).setBlendMode(Phaser.BlendModes.ADD);
        self.tweens.add({ targets: m, y: y - 6, alpha: 0.5, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        self.k2.marks.push(m);
      });
    },
    tourStop: function (o) {
      var self = this, q = Q(), st = LC.ch3Step();
      if (st !== 11 || !q.tourOn || (q.tour || {})[o.stop]) { this.ui.say([{ text: o.text }]); return; }
      this.ui.say(this.ch2Lines(LC.TOUR[o.stop].lines), { onDone: function () {
        (q.tour = q.tour || {})[o.stop] = 1;
        var n = Object.keys(q.tour).length;
        LC.Audio.sfx('chime'); self.refreshTour();
        self.toast(n >= LC.TOUR.length ? 'Antonio has seen it all. Go back to him by his ship.' : 'Antonio scribbles in his notebook. (' + n + ' / ' + LC.TOUR.length + ')', 'i_catatan_antonio');
      } });
    },
    tourDone: function () {
      var self = this, q = Q(), S = this.S;
      this.ui.say(this.ch2Lines(LC.CH3TEXT2.venice), { onDone: function () {
        q.ch3 = 12; S.kepeng += 1500; S.stats.earned += 1500;
        if (!LC.State.add('catatan_antonio', 1)) self.toast('Your bag is full, so Antonio keeps his page safe for you.');
        self.doShared('kind', { n: 10 }, function () {});
        LC.Audio.sfx('stage');
        self.time.delayedCall(600, function () { self.leaveVision(true); });
      } });
    },

    // ================================================================ 1578: the defence of the water city
    startWar: function () {
      var self = this;
      this.war = LC.kaWar = { wave: 0, ships: [], fires: {}, out: 0, saved: 0, down: 0 };
      this.makeShips();
      this.ui.say(this.ch2Lines(LC.CH3TEXT2.warIntro), { onDone: function () { self.setWave(1); } });
    },
    setWave: function (n) {
      var self = this, w = this.war, WAR = LC.WAR;
      if (!w) return;
      w.wave = n;
      if (n === 2) WAR.fires.forEach(function (id, i) { self.lightFire(id, i); });
      if (n === 3) WAR.families.forEach(function (f, i) { self.kaThing('fam' + i, f, 'kel' + i + '_0', { type: 'keluarga', i: i }); });
      if (n === 4) this.checkGroups();
      var line = LC.CH3TEXT2.waves[n];
      if (line) this.ui.say(this.ch2Lines([line]));
      this.toast(WAR.goals[n], 'ic_str');
    },
    makeShips: function () {
      var self = this;
      LC.WAR.cannons.forEach(function (c, i) {
        var x = c.x * T + 8, y = 34 * T, spr = self.add.image(x, y, 'kapal_layar').setOrigin(0.5, 1).setDepth(y - 40).setTint(0xb8a890);
        self.tweens.add({ targets: spr, x: x + 14, duration: 2600 + i * 400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        self.war.ships.push({ spr: spr, gone: false });
      });
    },
    fireMeriam: function (i) {
      var self = this, w = this.war;
      if (!w || w.wave < 1) { this.toast('A brass meriam, cast by Kampong Ayer\'s smiths.', 'i_lantaka'); return; }
      if (w.wave > 1) { this.toast('The meriam has done its work. The ships are keeping their distance.', 'i_lantaka'); return; }
      if (w.ships[i].gone) { this.toast('That ship has already turned back. Try another meriam.', 'i_lantaka'); return; }
      this.ui.openMeriam(function (ok) {
        if (ok === null) return;
        if (!ok) { self.toast('Splash! The ship is still there. Try again!', 'i_lantaka'); return; }
        var sh = w.ships[i]; sh.gone = true;
        LC.Audio.sfx('cheer'); self.cameras.main.shake(300, 0.004);
        self.fx.smoke.explode(16, sh.spr.x, sh.spr.y - 30);
        self.tweens.killTweensOf(sh.spr);
        self.tweens.add({ targets: sh.spr, y: sh.spr.y + 40, alpha: 0, scale: 0.7, duration: 2600, ease: 'Sine.easeIn' });
        var left = w.ships.filter(function (s) { return !s.gone; }).length;
        if (!left) self.time.delayedCall(1400, function () { self.setWave(2); });
        else self.toast('The warship turns back! (' + (3 - left) + ' / 3)', 'i_lantaka');
      });
    },
    lightFire: function (id, i) {
      var o = this.objects.filter(function (x) { return x.id === id; })[0];
      if (!o) return;
      var x = (o.x + 1.5) * T, y = (o.y + 2) * T - 30, spr = this.add.sprite(x, y, 'api_0').setOrigin(0.5, 1).setDepth(y + 30).play('api_burn');
      var tx = o.x + 1, ty = o.y + 1, fo = { type: 'api', i: i };
      this.objAt[ty][tx] = fo;
      this.war.fires[i] = { spr: spr, tx: tx, ty: ty, house: o, fo: fo, out: false };
    },
    douse: function (i) {
      var w = this.war, S = this.S, f = w && w.fires[i];
      if (!f || f.out) return;
      if (!LC.State.count('can')) { this.toast('You need a gembor (watering can) to carry water.', 'i_can'); LC.Audio.sfx('error'); return; }
      if (S.water < 2) { this.toast('Your gembor is empty! Face the river with it to fill it.', 'i_can'); LC.Audio.sfx('error'); return; }
      S.water -= 2; f.out = true; w.out++;
      LC.Audio.sfx('water');
      this.fx.drop.explode(18, f.spr.x, f.spr.y - 10); this.fx.smoke.explode(12, f.spr.x, f.spr.y - 12);
      this.tweens.add({ targets: f.spr, alpha: 0, scale: 0.3, duration: 500, onComplete: function () { f.spr.destroy(); } });
      if (this.objAt[f.ty][f.tx] === f.fo) this.objAt[f.ty][f.tx] = f.house;
      var n = LC.WAR.fires.length;
      if (w.out >= n) { var self = this; this.time.delayedCall(900, function () { self.setWave(3); }); }
      else this.toast('The fire hisses out. (' + w.out + ' / ' + n + ')', 'i_can');
    },
    rowFamily: function (i) {
      var self = this, w = this.war, th = this.k2.things['fam' + i];
      if (!w || !th) return;
      var boat = this.add.image(th.spr.x, th.spr.y + 10, 'perahu_kecil').setOrigin(0.5, 1).setDepth(th.spr.y + 2).setAlpha(0);
      LC.Audio.sfx('water');
      this.kaRemove('fam' + i, false);
      var fam = this.add.image(th.hx, th.hy, 'kel' + i + '_0').setOrigin(0.5, 1).setDepth(th.hy + 1);
      this.tweens.add({ targets: boat, alpha: 1, duration: 300 });
      this.tweens.add({ targets: [fam, boat], y: '-=60', alpha: 0, duration: 1800, delay: 300, ease: 'Sine.easeIn', onComplete: function () { fam.destroy(); boat.destroy(); } });
      w.saved++;
      var n = LC.WAR.families.length;
      if (w.saved >= n) this.time.delayedCall(1200, function () { self.setWave(4); });
      else this.toast('The family is safe on the hill! (' + w.saved + ' / ' + n + ')', 'ic_joy');
    },
    askarDown: function (e) {
      var self = this, s = e.spr, w = this.war;
      e.dead = true; e.respawn = 1e9; e.stoneT = 0; e.light.base = 0;
      if (s.anims.isPaused) s.anims.resume();
      s.clearTint();
      LC.Audio.sfx('splash');
      this.ui.floatText(s.x, s.y - 26, 'Splash!', '#9ad8ff');
      this.fx.drop.explode(16, s.x, s.y - 4);
      this.tweens.add({ targets: s, y: s.y + 12, alpha: 0, angle: 40, duration: 550, onComplete: function () { s.setVisible(false).setAngle(0); } });
      if (!w) return;
      w.down++;
      if (w.down >= LC.WAR.soldiers) this.time.delayedCall(1300, function () { self.warWon(); });
      else this.toast('The soldier tumbles into the river and swims back to the ships. (' + w.down + ' / ' + LC.WAR.soldiers + ')', 'ic_str');
    },
    warWon: function () {
      var self = this, q = Q(), S = this.S;
      if (!this.war || this.war.won) return;
      this.war.won = true; this.cutscene = true;
      LC.Audio.setBattle(false); LC.Audio.sfx('cheer');
      this.ui.say(this.ch2Lines(LC.CH3TEXT2.warEnd), { onDone: function () {
        q.ch3 = 13; q.ch3day = S.day; S.kepeng += 5000; S.stats.earned += 5000;   // (v2.2: Chapter 4 begins on a later day)
        if (!LC.State.add('lantaka', 1)) self.toast('Your bag is full, so Pak Damit sends the Lantaka to Barunai for you... (make room and talk to Pateh Berbai).');
        else q.lantakaGot = 1;
        LC.Audio.sfx('stage');
        self.doShared('kind', { n: 20 }, function () {});
        self.cutscene = false;
        self.time.delayedCall(500, function () { self.leaveVision(true); });
      } });
    }
  });
})(window.LC);
