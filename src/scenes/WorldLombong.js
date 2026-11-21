/* World, part 21 (v2.9): the deep of Lombong Puaka (data in lombong2.js). The hidden door at the end of the mine (seen
 * through the Bunian glasses), Bilik Rahsia behind it, and the secret boss, the Puaka Emas: it lunges like the other
 * creatures of the mine, drops ore from the roof (a shadow on the ground shows where), calls three shadows at 70% and
 * 40% of its health, and grows wild below 35%. Once beaten (once a day), the vault's chest holds gold and rare things;
 * what does not fit in your bag stays in the chest. Personal to each player. Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var T = 16, proto = LC.WorldScene.prototype, X = LC.LOMBONG_TEXT, P = LC.PUAKA;
  function boss(e) { return e && e.kind === 'puaka_emas'; }
  function listJoin(a) { return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]; }
  function beatenToday(S) { var q = S.quests && S.quests.puaka; return !!(q && q.day === S.day); }

  // ---------------------------------------------------------------- hooks
  var groupOn = proto.groupOn;
  proto.groupOn = function (g) {
    if (g.kind === 'puaka_emas') return !beatenToday(this.S);
    if (g.summon) { var c = this.lb; return !!(c && c.boss && !c.boss.dead && !c.over); }
    return groupOn.call(this, g);
  };
  var enemyDie = proto.enemyDie;
  proto.enemyDie = function (e) {
    if (boss(e)) return this.puakaDown(e);
    var r = enemyDie.call(this, e);
    if (e.g && e.g.summon) e.respawn = 1e9;   // the shadows it called do not come back
    return r;
  };
  var objectAction = proto.objectAction;
  proto.objectAction = function (o) {
    var self = this;
    if (o.type === 'pintu_rahsia') return { label: 'The hidden door', fn: function () { self.hiddenDoor(); } };
    if (o.type === 'peti_harta') return { label: 'Open the vault\'s chest', fn: function () { self.openHarta(); } };
    if (o.type === 'timbun') return { label: 'Look', fn: function () { self.ui.say([{ text: beatenToday(self.S) ? X.heapCalm : X.heap }]); } };
    if (o.id === 'l_nota') return { label: 'Look', fn: function () { self.ui.say([{ text: LC.State.wearing('glasses') ? X.notaSeen : X.nota }]); } };
    return objectAction.apply(this, arguments);
  };
  var createKampong = proto.createKampong;
  proto.createKampong = function () { createKampong.apply(this, arguments); this.createLombong(); };
  var updateKampong = proto.updateKampong;
  proto.updateKampong = function (time, dt) { updateKampong.apply(this, arguments); this.updateLombong(time, dt); };
  var refreshHidden = proto.refreshHidden;   // the hidden door glows softly once you can see it
  proto.refreshHidden = function () {
    refreshHidden.apply(this, arguments);
    var self = this;
    (this.hiddenObjs || []).forEach(function (h) {
      if (h.o.type !== 'pintu_rahsia') return;
      if (!h.light && self.lights) h.light = self.addLight(h.img.x, h.img.y - 18, 0xffd890, 1.3, true);
      if (h.light) h.light.base = h.on ? 0.75 : 0;
    });
  };
  var updateLighting = proto.updateLighting;
  proto.updateLighting = function () {
    updateLighting.apply(this, arguments);
    if (this.area === 'rahsia') this.dark.setVisible(true).setTint(beatenToday(this.S) ? 0x6e5a40 : 0x54422e);   // the vault glows faintly with its gold
  };

  Object.assign(proto, {
    createLombong: function () {
      var self = this, S = this.S, q = LC.puakaQ();
      var c = this.lb = { hinted: false, rockT: 2.5, called: 0, rage: false, over: false, boss: null, bar: null, chest: null };
      if (this.area !== 'rahsia') return;
      c.boss = (this.enemies || []).filter(boss)[0] || null;
      c.bar = this.add.graphics().setDepth(9602);
      if (q.chest && q.chest.length) this.hartaShow(false);
      this.time.delayedCall(700, function () {
        if (self.leaving || self.lb !== c) return;
        if (beatenToday(S)) self.toast(X.calm, 'i_emas');
        else self.ui.say(q.won ? X.again : X.enter);
      });
    },
    updateLombong: function (time, dt) {
      var c = this.lb;
      if (!c) return;
      if (this.area === 'lombong' && !c.hinted) {   // the end of the mine: a draught from a wall with nothing in it
        var R = this.A.endRoom, tx = Math.floor(this.player.x / T), ty = Math.floor((this.player.y - 3) / T);
        if (R && tx >= R.x0 && tx <= R.x1 && ty >= R.y0 && ty <= R.y1) {
          c.hinted = true;
          if (!LC.State.wearing('glasses')) this.toast((this.following() ? X.feelPelita : '') + (LC.State.count('cermin_mata') ? X.feel : X.feelNone), 'ic_glow');
        }
      }
      if (this.area !== 'rahsia') return;
      var e = c.boss;
      if (c.bar) {   // its health, over its head
        c.bar.clear();
        if (e && !e.dead && !e.away && e.spr.visible) {
          var w = 40, bx = Math.round(e.spr.x - w / 2), by = Math.round(e.spr.y - e.spr.height - 5), f = Math.max(0, e.hp / e.def.hp);
          c.bar.fillStyle(0x140e0a, 0.85).fillRect(bx - 1, by - 1, w + 2, 5);
          c.bar.fillStyle(c.rage ? 0xff7040 : 0xffd166, 1).fillRect(bx, by, Math.max(1, Math.round(w * f)), 3);
        }
      }
      if (!e || e.dead || e.away || c.over) return;
      if (this.ui.isBlocking() || this.sleeping || this.leaving || this.cutscene || e.stoneT > 0) return;   // (turned to stone: it can do nothing)
      if (c.called < P.summonAt.length && e.hp <= e.def.hp * P.summonAt[c.called]) { c.called++; this.puakaCall(e); }
      if (!c.rage && e.hp <= e.def.hp * P.rageAt) {
        c.rage = true;
        e.def = Object.assign({}, e.def, { speed: e.def.speed * P.rageSpeed, dmg: e.def.dmg + 2 });
        e.light.base = 1; e.light.img.setTint(0xffd040);
        this.cameras.main.flash(250, 255, 210, 120); this.cameras.main.shake(300, 0.004);
        this.toast(X.wild, 'i_emas');
      }
      if ((c.rockT -= dt) <= 0) { c.rockT = (c.rage ? P.rock.rageCd : P.rock.cd) + Math.random() * 0.8; this.puakaRocks(); }
      if (c.rage && Math.random() < dt * 6) this.fx.sparkle.explode(1, e.spr.x + (Math.random() - 0.5) * 26, e.spr.y - 8 - Math.random() * 26);   // (wild: it sheds sparks of gold)
    },

    // ---------------------------------------------------------------- the hidden door
    hiddenDoor: function () {
      var self = this, armed = ['trisula', 'keris', 'parang', 'tongkat'].some(function (w) { return LC.State.count(w) > 0; });
      this.ui.say([{ text: X.door }].concat(armed ? [] : [{ text: '(You have no weapon! Whatever is behind this door, you will want one.)' }]).concat([{ text: X.doorAsk }]), { choices: [
        { label: 'Go through', fn: function () { LC.Audio.sfx('gate'); self.goArea('rahsia', self.tilePx(LC.AREAS.rahsia.home), 'up'); } },
        { label: 'Not now' }
      ] });
    },

    // ---------------------------------------------------------------- the Puaka Emas
    puakaRocks: function () {   // ore shaken loose from the roof: one where you stand, the rest around you
      var self = this, R = P.rock, c = this.lb, p = this.player, n = c.rage ? R.rageN : R.n;
      LC.Audio.sfx('crumble'); this.cameras.main.shake(180, 0.0018);
      for (var i = 0; i < n; i++) {
        var x = p.x, y = p.y - 4;
        if (i) { var a = Math.random() * Math.PI * 2, d = 18 + Math.random() * R.spread; x += Math.cos(a) * d; y += Math.sin(a) * d * 0.75; }
        if (this.solidPx(x, y)) continue;
        (function (x, y, k) { self.time.delayedCall(k * 140, function () { self.rockWarn(x, y, c); }); })(x, y, i);
      }
    },
    rockWarn: function (x, y, c) {
      var self = this, R = P.rock;
      if (this.leaving || this.lb !== c || c.over) return;
      var g = this.add.graphics().setDepth(y - 2);
      g.fillStyle(0x1a1008, 0.45).fillEllipse(x, y, R.r * 2, R.r * 1.3);
      g.lineStyle(1, 0xffd166, 0.9).strokeEllipse(x, y, R.r * 2, R.r * 1.3);
      this.tweens.add({ targets: g, alpha: 0.45, duration: 160, yoyo: true, repeat: -1 });
      this.time.delayedCall(R.warn * 1000, function () {
        g.destroy();
        if (self.leaving || self.lb !== c) return;
        var rock = self.add.image(x, y - 96, 'batu_jatuh').setDepth(9599);
        self.tweens.add({ targets: rock, y: y, duration: 170, ease: 'Quad.easeIn', onComplete: function () {
          rock.setDepth(y);
          self.fx.pebble.explode(7, x, y - 2); self.fx.sparkle.explode(3, x, y - 3);
          LC.Audio.sfx('stone'); self.cameras.main.shake(60, 0.002);
          if (!c.over && Math.hypot(self.player.x - x, self.player.y - 4 - y) < R.r) self.playerHurt(R.dmg, { spr: { x: x, y: y } });
          self.tweens.add({ targets: rock, alpha: 0, delay: 350, duration: 400, onComplete: function () { rock.destroy(); } });
        } });
      });
    },
    puakaCall: function (e) {   // it calls the shadows of the mine
      var self = this, tx = Math.floor(e.spr.x / T), ty = Math.floor(e.spr.y / T), W = this.W, H = this.H;
      LC.Audio.sfx('lunge'); this.cameras.main.shake(260, 0.004);
      this.shockwave(e.spr.x, e.spr.y - 16, 64, 0x9a60d8);
      this.toast(X.calls, 'ic_moon');
      for (var i = 0; i < P.adds; i++) {
        var g = { kind: 'bayang', n: 0, summon: true, zone: { x0: Math.max(3, tx - 5), y0: Math.max(3, ty - 3), x1: Math.min(W - 4, tx + 5), y1: Math.min(H - 5, ty + 4) } };
        var a = this.spawnEnemy(g, false);
        this.fx.smoke.explode(8, a.spr.x, a.spr.y - 8);
      }
    },
    puakaDown: function (e) {
      var self = this, S = this.S, s = e.spr, q = LC.puakaQ(), first = !q.won, c = this.lb;
      e.dead = true; e.respawn = 1e9; e.stoneT = 0;
      if (s.anims.isPaused) s.anims.resume();
      if (c) c.over = true;
      q.day = S.day; q.won = (q.won || 0) + 1;
      var loot = (q.chest || []).slice();
      LC.puakaLoot(first).forEach(function (it) {   // (added to whatever is still in the chest)
        var had = loot.filter(function (l) { return l[0] === it[0]; })[0];
        if (had) had[1] += it[1]; else loot.push(it.slice());
      });
      q.chest = loot;
      S.stats.kills = (S.stats.kills || 0) + 1;
      LC.Audio.sfx('crumble'); LC.Audio.sfx('poof');
      this.fx.smoke.explode(26, s.x, s.y - s.height / 2);
      this.fx.sparkle.explode(44, s.x, s.y - s.height / 2);
      this.cameras.main.flash(600, 255, 220, 140); this.cameras.main.shake(500, 0.006);
      s.setTint(0xffd040);
      this.tweens.add({ targets: s, alpha: 0, scaleY: 0.15, scaleX: 1.5, duration: 1000, ease: 'Quad.easeIn', onComplete: function () { s.setVisible(false).setScale(1).clearTint(); } });
      e.light.base = 0;
      this.doShared('kind', { n: 10 }, function () {});
      this.checkGroups();   // (the shadows it called melt away)
      this.time.delayedCall(1200, function () {
        if (self.leaving || self.lb !== c) return;
        self.hartaShow(true);
        self.ui.say(X.down.concat([first ? X.downFirst : X.downAgain]));
      });
    },

    // ---------------------------------------------------------------- the vault's chest
    hartaShow: function (anim) {
      var c = this.lb, t = this.A.chest, self = this;
      if (!c || !t || c.chest) return;
      var x = (t.x + 1) * T, y = (t.y + 1) * T, p = this.player, o = { type: 'peti_harta' };
      var img = this.add.image(x, y, 'peti_harta').setOrigin(0.5, 1).setDepth(y);
      var tiles = [[t.x, t.y], [t.x + 1, t.y]];
      c.chest = { img: img, tiles: tiles, was: tiles.map(function (k) { return self.solid[k[1]][k[0]]; }), light: this.addLight(x, y - 10, 0xffd070, 1.1, true) };
      c.chest.light.base = 0.8;
      tiles.forEach(function (k) { self.solid[k[1]][k[0]] = true; self.objAt[k[1]][k[0]] = o; });
      var px = Math.floor(p.x / T), py = Math.floor((p.y - 3) / T);   // (never close it over you)
      if (py >= t.y - 1 && py <= t.y && px >= t.x - 1 && px <= t.x + 2) p.y = (t.y + 2) * T + 4;
      if (anim) {
        img.setAlpha(0).setScale(0.5);
        this.tweens.add({ targets: img, alpha: 1, scale: 1, duration: 600, ease: 'Back.easeOut' });
        this.fx.sparkle.explode(24, x, y - 10);
        LC.Audio.sfx('chime');
      }
    },
    hartaHide: function () {
      var c = this.lb, self = this, ch = c && c.chest;
      if (!ch) return;
      ch.tiles.forEach(function (k, i) { self.solid[k[1]][k[0]] = ch.was[i]; self.objAt[k[1]][k[0]] = null; });
      ch.light.base = 0;
      this.fx.sparkle.explode(16, ch.img.x, ch.img.y - 10);
      this.tweens.add({ targets: ch.img, alpha: 0, duration: 900, onComplete: function () { ch.img.destroy(); } });
      c.chest = null;
    },
    openHarta: function () {
      var S = this.S, q = LC.puakaQ(), got = [], left = [];
      (q.chest || []).forEach(function (it) {
        var id = it[0], n = it[1];
        if (id === 'kepeng') { S.kepeng += n; S.stats.earned = (S.stats.earned || 0) + n; got.push(n + ' kepeng'); return; }
        if (!LC.ITEMS[id]) return;
        var k = Math.min(n, LC.State.room(id));
        if (k > 0) { LC.State.add(id, k); got.push(k + ' ' + LC.ITEMS[id].name); }
        if (n > k) left.push([id, n - k]);
      });
      q.chest = left;
      LC.Audio.sfx('coin'); LC.Audio.sfx('chime');
      if (this.lb && this.lb.chest) this.fx.sparkle.explode(18, this.lb.chest.img.x, this.lb.chest.img.y - 12);
      var lines = [{ text: X.chest }];
      if (got.length) lines.push({ text: '✦ You found ' + listJoin(got) + '! ✦' });
      if (left.length) lines.push({ text: X.chestFull }); else this.hartaHide();
      this.ui.say(lines);
    }
  });
})(window.LC);
