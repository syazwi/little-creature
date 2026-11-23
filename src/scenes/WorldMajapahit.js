/* World, part 11 (v2.2): Chapter 4, Layar Merah. The alarm at dawn, the night attack on Kampung Tepian and Nenek's
 * farm in four waves (the jetty, the fires, the raiders at the spirit house, the admiral), the heroes fighting beside
 * you, the Naga turning the fleet, the King of Majapahit's arrival, and the trading jong. Personal to each player
 * (the wave is saved in quests.c4wave, so a wave carries on when you come back). Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var T = 16, proto = LC.WorldScene.prototype;
  function Q() { return LC.State.s.quests; }
  function isNight(S) { return S.minutes >= 19 * 60 || S.minutes < 5 * 60; }
  var FOES = { prajurit: 1, laksamana: 1 };

  // ---------------------------------------------------------------- hooks
  var enemyDie = proto.enemyDie;
  proto.enemyDie = function (e) {
    if (e.kind === 'prajurit') return this.soldierDown(e);
    if (e.kind === 'laksamana') return this.admiralDown(e);
    return enemyDie.call(this, e);
  };
  var createKampong = proto.createKampong;
  proto.createKampong = function () { createKampong.call(this); this.createMajapahit(); };
  var updateKampong = proto.updateKampong;
  proto.updateKampong = function (time, dt) { updateKampong.call(this, time, dt); this.updateMajapahit(time, dt); };
  var kampongObjAction = proto.kampongObjAction;
  proto.kampongObjAction = function (o) {
    var self = this;
    if (o.type === 'ally') return { label: 'Talk to ' + o.name, fn: function () { self.toast(o.name + ': ' + LC.CH4TEXT.allyTalk[Math.floor(Math.random() * 3)], 'ic_str'); } };
    if (o.type === 'api4') return { label: 'Douse the fire', fn: function () { self.douse4(o.i); } };
    if (o.type === 'jong_dagang') return { label: 'The Majapahit trading jong', fn: function () { self.ui.openJong(); } };
    return kampongObjAction.call(this, o);
  };
  var ch2Lines = proto.ch2Lines;   // speakers who are not villagers (the admiral, Badang made strong)
  proto.ch2Lines = function (arr) {
    return ch2Lines.call(this, arr).map(function (l, i) { var sp = arr[i].who && LC.SPEAKERS[arr[i].who]; return sp ? { name: sp.name, portrait: sp.portrait, text: l.text } : l; });
  };

  Object.assign(proto, {
    createMajapahit: function () {
      this.c4 = { tick: 1, allyT: 2, allyI: 0, allies: [], fires: {} };
      this.placeAllies();
      if (this.area === 'farm' && LC.ch4Step() === 3 && LC.c4Wave() === 2) this.lightFires4();
    },
    updateMajapahit: function (time, dt) {
      var c = this.c4, S = this.S, q = Q(), self = this;
      if (!c) return;
      var blocked = this.ui.isBlocking() || this.sleeping || this.leaving || this.cutscene;
      if ((c.tick -= dt) <= 0 && !blocked) {
        c.tick = 1;
        var st = LC.ch4Step();
        if (this.area === 'farm' && st === 0 && (q.ch3 || 0) >= 13 && S.day > (q.ch3day || 0)) this.c4Dawn();
        else if (this.area === 'kampung' && st === 3 && LC.c4Wave() === 0 && isNight(S)) this.c4Attack();
      }
      // a safety net for every story scene: a cutscene with no dialogue on screen for 6 s has lost its way, so let go
      if (this.cutscene && !this.ui.modal && !this.leaving) { c.cutIdle = (c.cutIdle || 0) + dt; if (c.cutIdle > 6) { this.cutscene = false; this.hopping = false; c.cutIdle = 0; } } else c.cutIdle = 0;
      if (c.allies.length && !blocked && (c.allyT -= dt) <= 0) { c.allyT = 2.4; this.majapahitAllyStrike(c.allies[c.allyI++ % c.allies.length]); }
      if ((c.smokeT = (c.smokeT || 0) - dt) <= 0) {
        c.smokeT = 0.35;
        Object.keys(c.fires).forEach(function (i) { var f = c.fires[i]; if (!f.out) self.fx.smoke.explode(1, f.spr.x + (Math.random() - 0.5) * 10, f.spr.y - 14); });
      }
    },

    // ================================================================ the heroes at your side
    placeAllies: function () {
      var self = this, c = this.c4, q = Q();
      c.allies.forEach(function (th, i) { self.kaRemove('ally' + i, true); });
      c.allies = [];
      if (LC.ch4Step() !== 3) return;
      var spots = LC.C4.allies[this.area + LC.c4Wave()];
      if (!spots) return;
      var who = [{ vid: 'semaun', key: 'semaun', name: 'Awang Semaun' }, (q.badang || 0) >= 3 ? { vid: 'badang', key: 'badangK', name: 'Badang' } : { vid: 'jerambak', key: 'jerambak', name: 'Awang Jerambak' }];
      spots.forEach(function (t, i) {
        var h = who[i], th = self.kaThing('ally' + i, t, 'npc_' + h.key + '_0', { type: 'ally', name: h.name }, 'npc_' + h.key + '_idle');
        th.spr.setAlpha(0); self.tweens.add({ targets: th.spr, alpha: 1, duration: 600 });
        th.name = h.name; c.allies.push(th);
      });
    },
    majapahitAllyStrike: function (th) {
      var self = this, best = null, bd = 220;
      if (!th || !this.enemies) return;
      this.enemies.forEach(function (e) { if (!FOES[e.kind] || e.dead || e.away) return; var d = Math.hypot(e.spr.x - th.hx, e.spr.y - th.hy); if (d < bd) { bd = d; best = e; } });
      if (!best) return;
      var e = best, side = th.hx < e.spr.x ? -1 : 1;
      th.spr.setFlipX(side > 0);
      this.tweens.add({ targets: th.spr, x: e.spr.x + side * 14, y: e.spr.y, duration: 240, ease: 'Quad.easeIn', onComplete: function () {
        if (!e.dead && !e.away) {
          var n = e.def.boss ? 2 : 3;
          e.hp -= n; e.hurtT = 0.1; e.spr.setTintFill(0xffffff);
          LC.Audio.sfx('hit'); self.fx.sparkle.explode(5, e.spr.x, e.spr.y - 14);
          self.ui.floatText(e.spr.x, e.spr.y - e.spr.height - 4, th.name.split(' ').pop() + '! ' + n, '#ffd166');
          if (e.hp <= 0) self.enemyDie(e);
        }
        self.tweens.add({ targets: th.spr, x: th.hx, y: th.hy, duration: 400, ease: 'Quad.easeOut' });
      } });
    },

    // ================================================================ the story beats
    c4Dawn: function () {
      var q = Q(), self = this;
      q.ch4 = 1; LC.Audio.sfx('crow');
      this.time.delayedCall(700, function () { LC.Audio.sfx('crow'); });
      this.cameras.main.shake(300, 0.002);
      this.ui.say(LC.CH4TEXT.dawn);
    },
    // (each wave starts at once; the lines play over it, so closing a dialogue early can never stall the battle)
    c4Attack: function () {
      LC.Audio.sfx('drum');
      this.cameras.main.shake(500, 0.004);
      this.setWave4(1, LC.CH4TEXT.attack);
    },
    setWave4: function (n, lines) {
      var self = this, q = Q();
      q.c4wave = n;
      this.checkGroups(); this.placeAllies();
      this.ui.say(this.ch2Lines(lines), { onDone: function () {
        if (LC.C4.goals[n]) self.toast(LC.C4.goals[n] + (n === 4 ? '' : '!'), 'ic_str');
      } });
    },
    soldierDown: function (e) {
      var self = this, s = e.spr, w = LC.c4Wave();
      e.dead = true; e.respawn = 1e9; e.stoneT = 0; e.light.base = 0;
      if (s.anims.isPaused) s.anims.resume();
      s.clearTint();
      LC.Audio.sfx('poof');
      this.fx.dirt.explode(10, s.x, s.y - 4);
      this.ui.floatText(s.x, s.y - 26, 'Run!', '#ffd166');
      this.tweens.add({ targets: s, y: s.y + 40, alpha: 0, duration: 900, ease: 'Quad.easeIn', onComplete: function () { s.setVisible(false).setAlpha(1); } });
      var all = this.enemies.filter(function (x) { return x.kind === 'prajurit'; }), down = all.filter(function (x) { return x.dead; }).length;
      if (down < all.length) { this.toast('A soldier drops his spear and runs back to the boats. (' + down + ' / ' + all.length + ')', 'ic_str'); return; }
      this.time.delayedCall(1100, function () {
        if (w === 1) self.setWave4(2, LC.CH4TEXT.wave1);
        else if (w === 3) {
          self.cameras.main.shake(1200, 0.006); LC.Audio.sfx('splash'); LC.Audio.sfx('wind');
          self.setWave4(4, LC.CH4TEXT.naga);
        }
      });
    },

    // ---------------------------------------------------------------- wave 2: the fires on Nenek's farm
    lightFires4: function () {
      var self = this, q = Q(), done = q.c4fires || {}, c = this.c4;
      LC.C4.fires.forEach(function (id, i) {
        if (done[i]) return;
        var o = LC.OBJECTS.filter(function (x) { return x.id === id; })[0];
        if (!o) return;
        var tx = o.x + Math.floor((o.w || 1) / 2), ty = o.y + (o.h || 1) - 1;
        var spr = self.add.sprite((tx + 0.5) * T, (ty + 1) * T - 2, 'api_0').setOrigin(0.5, 1).setDepth((ty + 1) * T + 30).play('api_burn').setScale(1.3);
        var fo = { type: 'api4', i: i };
        self.objAt[ty][tx] = fo;
        c.fires[i] = { spr: spr, tx: tx, ty: ty, o: o, fo: fo, out: false };
      });
      this.time.delayedCall(900, function () { if (!self.leaving) self.ui.say([{ text: LC.CH4TEXT.fires }]); });
    },
    douse4: function (i) {
      var self = this, q = Q(), S = this.S, f = this.c4.fires[i];
      if (!f || f.out) return;
      if (!LC.State.count('can')) { this.toast('You need a gembor (watering can) to carry water.', 'i_can'); LC.Audio.sfx('error'); return; }
      if (S.water < 2) { this.toast('Your gembor is empty! Fill it at the well.', 'i_can'); LC.Audio.sfx('error'); return; }
      S.water -= 2; f.out = true; (q.c4fires = q.c4fires || {})[i] = 1;
      LC.Audio.sfx('water');
      this.fx.drop.explode(18, f.spr.x, f.spr.y - 10); this.fx.smoke.explode(12, f.spr.x, f.spr.y - 12);
      this.tweens.add({ targets: f.spr, alpha: 0, scale: 0.3, duration: 500, onComplete: function () { f.spr.destroy(); } });
      if (this.objAt[f.ty][f.tx] === f.fo) this.objAt[f.ty][f.tx] = f.o;
      var n = Object.keys(q.c4fires).length, all = LC.C4.fires.length;
      if (n < all) { this.toast('The fire hisses out. (' + n + ' / ' + all + ')', 'i_can'); return; }
      this.time.delayedCall(900, function () { self.setWave4(3, LC.CH4TEXT.wave3); });
    },

    // ---------------------------------------------------------------- wave 4: the admiral, then the king
    admiralDown: function (e) {
      var self = this, s = e.spr, q = Q(), S = this.S;
      e.dead = true; e.respawn = 1e9; e.stoneT = 0; e.light.base = 0;
      if (s.anims.isPaused) s.anims.resume();
      s.clearTint();
      this.cutscene = true; LC.Audio.setBattle(false);
      LC.Audio.sfx('splash'); this.fx.drop.explode(24, s.x, s.y - 6);
      this.cameras.main.flash(400, 255, 240, 220);
      var stand = this.tilePx({ x: 21, y: 27 }); this.player.setPosition(stand.x, stand.y); this.dir = 'down';
      s.setPosition(20 * T + 8, 30 * T).setDepth(30 * T).setAngle(0).setVisible(true).setAlpha(1).setTint(0xb0c8d8);
      var jong = this.add.image(36 * T, 33 * T, 'jong_majapahit').setOrigin(0.5, 1).setDepth(33 * T).setAlpha(0);
      var king = this.add.sprite(23 * T + 8, 31 * T, 'npc_raden_0').setOrigin(0.5, 1).setDepth(31 * T + 2).setAlpha(0);
      if (this.anims.exists('npc_raden_idle')) king.play('npc_raden_idle');
      var T4 = LC.CH4TEXT;
      q.ch4 = 4; q.c4wave = 5; q.ch4day = S.day; S.kepeng += 6000; S.stats.earned += 6000;   // (the reward is safe even if the scene is cut short)
      if (!LC.State.add('keris_majapahit', 1)) q.c4kerisOwed = 1;
      self.doShared('kind', { n: 20 }, function () {});
      this.ui.say(T4.king.slice(0, 1), { onDone: function () {
        LC.Audio.sfx('gate');
        self.tweens.add({ targets: jong, alpha: 1, x: 27 * T + 8, duration: 2200, ease: 'Sine.easeOut' });
        self.tweens.add({ targets: king, alpha: 1, x: 21 * T + 8, y: 30 * T, duration: 900, delay: 2000 });
        self.time.delayedCall(3000, function () {
          self.ui.say(self.ch2Lines(T4.king.slice(1)), { onDone: function () {
            self.placeAllies();   // (the heroes head home)
            if (q.c4kerisOwed) self.toast('Your bag is full: the Penghulu is keeping the Keris Majapahit safe for you.');
            LC.Audio.sfx('stage');
            self.tweens.add({ targets: [king, s], alpha: 0, duration: 900 });
            self.tweens.add({ targets: jong, alpha: 0, duration: 1600, delay: 600, onComplete: function () { jong.destroy(); king.destroy(); s.setVisible(false).clearTint(); self.refreshWhen(); } });
            self.cutscene = false;
          } });
        });
      } });
    }
  });
})(window.LC);
