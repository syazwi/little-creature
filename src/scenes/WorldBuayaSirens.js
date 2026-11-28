/* The Pearl That Answered, between the ghost net and the first view of Kinabalu. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var W = LC.WorldScene.prototype, X = LC.BUAYA2_TEXT, T = 16, HULL = 100;
  var tune = [[0, 1, 'o'], [2, 1.25, 'a'], [1, 0.75, 'o'], [0, 1.5, 'u'], [null, 0.5]];
  var choir = [294, 349, 440].map(function (pitch) { return new LC.Singer({ base: pitch, bpm: 75, mel: tune }); });
  function fight(w) { return w.c20 && w.c20.sea && w.c20.sea.sirens; }
  function playable(w) { return !w.sleeping && !w.leaving && !w.cutscene && !w.ui.isBlocking(); }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function stopChoir() { choir.forEach(function (voice) { voice.run(false); }); }

  var song = W.laguKey, songLeft = W.laguLeft, action = W.buayaSeaAction;
  W.laguLeft = function () {
    var f = fight(this);
    return f ? f.songCd : songLeft.apply(this, arguments);
  };
  W.laguKey = function () {
    var f = fight(this);
    if (!f) return song.apply(this, arguments);
    if (!playable(this) || f.songCd > 0 || f.phase !== 'sing') return;
    var pearl = LC.State.count('mutiara');
    f.phase = 'open';
    f.t = pearl ? 3.4 : 1.8;
    f.songCd = 4.5;
    stopChoir();
    this.playLaguMayang();
    this.shockwave(this.player.x, this.player.y - 8, 88, 0xb6f6ee);
    if (pearl) this.shockwave(this.player.x, this.player.y - 8, 62, 0xffe3a0);
    this.fx.sparkle.explode(8, f.singer.x, f.singer.y - 12);
  };
  W.buayaSeaAction = function () {
    var f = fight(this), self = this;
    if (!f) return action.apply(this, arguments);
    if (f.phase === 'open' && !f.shot && f.cannonCd <= 0) {
      return { label: "Fire the jong's cannon", fn: function () { self.fireSabahCannon(); } };
    }
    return null;
  };

  Object.assign(W, {
    startSabahSirens: function () {
      var sea = this.c20.sea, ship = sea.sh, self = this;
      var x = (LC.C20.sabah.sirensAt + 0.5) * T, y = clamp(ship.y, 11 * T, 23 * T);
      var f = sea.sirens = { x: x, y: y, bounds: { left: x - 106, right: x + 106, top: y - 79, bottom: y + 79 },
        hull: HULL, phase: 'intro', t: 0, songCd: 0, cannonCd: 0, turn: -1, shot: null, ghosts: [],
        water: this.add.graphics().setDepth(6) };
      ship.x = x; ship.y = y; ship.spd = 0;
      this.player.setPosition(x, y + 6);
      [[-73, -37], [72, -35], [57, 49]].forEach(function (off, i) {
        var key = 'siren20_' + i, px = x + off[0], py = y + off[1];
        var img = self.add.sprite(px, py + 12, key + '_0').setOrigin(0.5, 0.76).setDepth(9003).setAlpha(0);
        var reflection = self.add.image(px, py, key + '_0').setOrigin(0.5, 0.72).setDepth(5).setScale(0.8, -0.38).setTint(0x6897bf);
        img.play(key + '_swim');
        f.ghosts.push({ x: px, y: py, homeX: px, homeY: py, hp: 2, img: img, reflection: reflection });
      });
      this.events.once('shutdown', stopChoir);
      this.buayaLines(X.sirenIntro.concat([['', LC.State.count('mutiara') ? X.sirenPearl : X.sirenSong]]));
    },
    nextSabahSinger: function (f) {
      do { f.turn = (f.turn + 1) % f.ghosts.length; } while (!f.ghosts[f.turn].hp);
      var e = f.singer = f.ghosts[f.turn];
      f.ghosts.forEach(function (ghost) {
        if (ghost.hp) { ghost.x = ghost.homeX; ghost.y = ghost.homeY; }
      });
      f.phase = 'sing'; f.t = 4.4;
      this.fx.drop.explode(8, e.x, e.y);
    },
    fireSabahCannon: function () {
      var f = fight(this);
      if (!f || !playable(this) || f.phase !== 'open' || f.cannonCd > 0 || f.shot) return;
      var boat = this.c20.sea.sh, x = boat.x, y = boat.y;
      var ball = this.add.image(x, y - 5, 'storm_ball12_player').setDepth(9007);
      f.shot = { ball: ball, t: 0, x: x, y: y, target: f.singer };
      f.cannonCd = 0.83;
      this.fx.smoke.explode(6, x, y);
      this.cameras.main.shake(110, 0.003);
      LC.Audio.sfx('punch');
    },
    updateSabahCannon: function (f, dt) {
      var s = f.shot, e = s.target;
      s.t += dt / 0.28;
      if (s.t < 1) {
        s.ball.setPosition(s.x + (e.x - s.x) * s.t, s.y + (e.y - s.y) * s.t - 16 * Math.sin(s.t * Math.PI));
        return;
      }
      s.ball.destroy(); f.shot = null;
      e.hp--;
      LC.Audio.sfx('hit');
      this.fx.sparkle.explode(e.hp ? 8 : 18, e.x, e.y - 6);
      if (e.hp) return;
      choir[f.turn].run(false);
      if (f.ghosts.every(function (g) { return !g.hp; })) this.finishSabahSirens(f);
      else { f.phase = 'rest'; f.t = 0.68; }
    },
    finishSabahSirens: function (f) {
      var sh = this.c20.sea.sh, e = f.singer;
      f.phase = 'outro'; sh.spd = 0;
      this.S.quests.c20sirens = true;
      LC.State.save();
      stopChoir();
      var basket = this.add.image(e.x, e.y, 'siren20_basket').setDepth(7);
      this.tweens.add({ targets: basket, x: sh.x - 22, y: sh.y + 12, angle: 12, duration: 900, ease: 'Sine.easeOut' });
      this.tweens.add({ targets: basket, alpha: 0, duration: 1700, delay: 1450, onComplete: function () { basket.destroy(); } });
      this.buayaLines(X.sirenEnd);
    },
    updateSabahSirens: function (time, dt, blocked) {
      var sea = this.c20.sea, f = sea.sirens, sh = sea.sh;
      if (this.leaving) { stopChoir(); return; }
      var angle = sh.ang;
      this.buayaSwim(dt, sh.x - Math.cos(angle) * 12 + Math.sin(angle) * 27, sh.y - Math.sin(angle) * 12 - Math.cos(angle) * 27, 85);
      if (!blocked) {
        if (f.phase === 'outro') {
          f.ghosts.forEach(function (e) { e.img.destroy(); e.reflection.destroy(); });
          f.water.destroy(); sea.sirens = null;
          return;
        }
        this.advanceSabahSirens(f, sh, dt);
      }
      this.drawSabahSirens(f, sh, time, blocked);
    },
    advanceSabahSirens: function (f, sh, dt) {
      f.songCd = Math.max(0, f.songCd - dt);
      f.cannonCd = Math.max(0, f.cannonCd - dt);
      f.t -= dt;
      if (f.shot) { this.updateSabahCannon(f, dt); return; }
      if (f.t > 0 && f.phase !== 'lunge') return;
      var e = f.singer;
      switch (f.phase) {
        case 'intro':
        case 'rest': this.nextSabahSinger(f); break;
        case 'sing':
        case 'open':
          f.phase = 'warning'; f.t = 1.22;
          f.lane = { x: e.x, y: e.y, endX: sh.x, endY: sh.y, hit: false };
          LC.Audio.sfx('sirenDive');
          break;
        case 'warning': f.phase = 'lunge'; f.t = 0.32; break;
        case 'lunge':
          var lane = f.lane, a = clamp(1 - f.t / 0.32, 0, 1);
          e.x = lane.x + (lane.endX - lane.x) * a; e.y = lane.y + (lane.endY - lane.y) * a;
          if (!lane.hit && Math.hypot(e.x - sh.x, e.y - sh.y) < 24) {
            lane.hit = true; f.hull = Math.max(0, f.hull - 25); sh.spd = -20;
            LC.Audio.sfx('bump11'); this.fx.drop.explode(16, sh.x, sh.y); this.cameras.main.shake(230, 0.006);
            if (f.hull === 0) {
              this.toast('Wira pulls away. The crew patch the hull while you catch your breath.', 'ic_buaya20');
              f.hull = HULL; f.songCd = 0;
              sh.x = f.x; sh.y = f.y; sh.spd = 0;
            }
          }
          if (f.t <= 0 || lane.hit) { f.phase = 'rest'; f.t = 0.7; }
          break;
      }
    },
    drawSabahSirens: function (f, sh, time, blocked) {
      var g = f.water, b = f.bounds, active = f.phase !== 'outro', lane = f.lane;
      g.clear();
      if (active) {
        g.lineStyle(3, 0xbcebf0, 0.3);
        g.strokeRoundedRect(b.left - 4, b.top - 4, b.right - b.left + 8, b.bottom - b.top + 8, 20);
        g.lineStyle(1, 0xbcebf0, 0.7);
        g.strokeRoundedRect(b.left - 4, b.top - 4, b.right - b.left + 8, b.bottom - b.top + 8, 20);
      }
      if (f.phase === 'warning' || f.phase === 'lunge') {
        g.lineStyle(20, 0xbcebf0, 0.27); g.lineBetween(lane.x, lane.y, lane.endX, lane.endY);
        g.lineStyle(2, 0xe0f9ff, 0.9); g.lineBetween(lane.x, lane.y, lane.endX, lane.endY);
        g.lineStyle(2, 0xf0a6ba, 0.9); g.strokeCircle(lane.endX, lane.endY, 22);
      }
      f.ghosts.forEach(function (e, i) {
        var current = e === f.singer, exposed = current && f.phase === 'open';
        var under = current && (f.phase === 'warning' || f.phase === 'lunge'), dy = Math.sin(time / 240 + i) * 2;
        if (e.hp) {
          g.lineStyle(2, exposed ? 0xffdf98 : 0xb6ecfa, exposed || current ? 0.9 : 0.4);
          g.strokeEllipse(e.x, e.y + 4, 42, 12);
          if (exposed) { g.lineStyle(1, 0xffefd0, 0.9); g.strokeEllipse(e.x, e.y + 4, 50, 16); }
        }
        var opacity = e.hp ? (under ? 0.36 : current || f.phase === 'intro' ? 1 : 0.85) : 0;
        e.img.setAlpha(e.img.alpha + clamp(opacity - e.img.alpha, -0.075, 0.045))
          .setPosition(Math.round(e.x), Math.round(e.y + dy + (under ? 13 : 0))).setFlipX(sh.x < e.x);
        e.reflection.setPosition(e.x, e.y + 4).setFlipX(sh.x < e.x).setAlpha(under ? 0 : e.img.alpha * 0.21);
        if (exposed) e.img.setTint(0xffefcf); else e.img.clearTint();
        var singing = e.hp && (f.phase === 'intro' || !blocked && f.phase === 'sing');
        if (singing) choir[i].set(0.24, clamp((e.x - sh.x) / 120, -1, 1));
        choir[i].run(!!singing);
      });
    }
  });
})(window.LC);
