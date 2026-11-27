/* Eight graves wake after dark. The dune giant fights only when his sleep is disturbed. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var W = LC.WorldScene.prototype, Z = LC.GRAVEYARD_ZOMBIES, G = LC.DUNE_GIANT;
  function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function bearing(a, b) { return Math.atan2(b.y - a.y, b.x - a.x); }
  function angleGap(a, b) { return Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b))); }
  function nightOf(S) { return S.minutes < 6 * 60 ? S.day - 1 : S.day; }
  function atRest(g) { return g && g.phase === 'sleep'; }

  var create = W.createKampong, update = W.updateKampong;
  W.createKampong = function () {
    create.apply(this, arguments);
    this.graveyard = this.area === 'kubur19' ? { night: null, graves: [], groan: 0 } : null;
    this.duneGiant = null;
    if (this.area === 'desert' && this.S.quests.duneGiantDefeatedDay !== this.S.day) this.createDuneGiant();
  };
  W.updateKampong = function (time, dt) {
    update.apply(this, arguments);
    if (this.leaving || this.sleeping) return;
    var blocked = this.ui.isBlocking() || this.cutscene || this.reuniting;
    if (this.graveyard) this.updateGraveyard(dt, blocked);
    if (this.duneGiant) this.updateDuneGiant(time, dt, blocked);
  };

  var groupOn = W.groupOn;
  W.groupOn = function (group) {
    if (group.kind === 'dune_giant') return !!group.awake;
    return groupOn.apply(this, arguments);
  };
  var action = W.getAction;
  W.getAction = function () {
    var g = this.duneGiant;
    if (atRest(g) && distance(g.enemy.spr, this.player) <= G.useRange) {
      var facing = this.facing(), p = g.enemy.spr, self = this;
      if (Math.hypot(facing.fx - p.x, facing.fy - p.y) < distance(this.player, p)) {
        return { label: 'Disturb the sleeping giant', fn: function () { self.wakeDuneGiant(); } };
      }
    }
    return action.apply(this, arguments);
  };
  var tapUse = W.tapUse;
  W.tapUse = function (x, y) {
    var g = this.duneGiant;
    if (atRest(g) && this.tapReady()) {
      var point = this.cameras.main.getWorldPoint(x, y);
      var bounds = g.enemy.spr.getBounds();
      if (point.y >= bounds.bottom - 60 && bounds.contains(point.x, point.y)) {
        if (distance(this.player, g.enemy.spr) <= G.useRange) this.wakeDuneGiant();
        else this.tapTooFar();
        return true;
      }
    }
    return tapUse.apply(this, arguments);
  };
  var die = W.enemyDie;
  W.enemyDie = function (e) {
    if (e.kind === 'dune_giant' && this.duneGiant && e === this.duneGiant.enemy) {
      if (!e.dead) this.defeatDuneGiant();
      return;
    }
    if (e.dead) return die.apply(this, arguments);
    var result = die.apply(this, arguments);
    if (e.kind === 'grave_zombie' && e.dead && this.graveyard) {
      var record = this.S.quests.graveyardZombies;
      if (record && record.night === this.graveyard.night) {
        record.defeated |= 1 << e.g.grave;
        e.respawn = Infinity;
        LC.State.save();
      }
    }
    return result;
  };

  Object.assign(W, {
    resetGraveyard: function (night) {
      var m = this.graveyard, self = this;
      m.graves.forEach(function (g) {
        if (g.rise) g.rise.destroy();
        if (!g.enemy) return;
        var index = self.enemies.indexOf(g.enemy);
        if (index >= 0) self.enemies.splice(index, 1);
        self.lights = self.lights.filter(function (light) { return light !== g.enemy.light; });
        self.tweens.killTweensOf(g.enemy.spr);
        g.enemy.light.img.destroy(); g.enemy.spr.destroy();
      });
      m.night = night;
      m.graves = [];
      if (night === null) return;
      var q = this.S.quests;
      if (!q.graveyardZombies || q.graveyardZombies.night !== night) q.graveyardZombies = { night: night, defeated: 0 };
      Z.mounds.forEach(function (p, i) {
        m.graves.push({ tile: { x: p[0], y: p[1] }, point: self.tilePx({ x: p[0], y: p[1] }),
          texture: 'grave_zombie_' + i, index: i, timer: 0, riseFrame: -1, rise: null, enemy: null });
      });
      m.groan = 0;
    },
    updateGraveyard: function (dt, blocked) {
      var night = LC.C19.isNight(this.S) ? nightOf(this.S) : null, m = this.graveyard, self = this;
      if (m.night !== night) this.resetGraveyard(night);
      if (night === null || blocked) return;
      var defeated = this.S.quests.graveyardZombies.defeated, near = false;
      m.graves.forEach(function (g) {
        if (defeated & (1 << g.index)) return;
        if (g.enemy) {
          if (distance(g.enemy.spr, self.player) < 100) near = true;
          return;
        }
        if (!g.rise) {
          if (distance(g.point, self.player) > Z.wakeRange) return;
          g.rise = self.add.image(g.point.x, g.point.y, 'grave_soil').setOrigin(0.5, 1).setDepth(g.point.y);
          self.fx.dirt.explode(5, g.point.x, g.point.y - 4);
          LC.Audio.sfx('graveStir');
        }
        g.timer += dt;
        if (g.timer < Z.stirTime) {
          g.rise.x = g.point.x + Math.round(Math.sin(g.timer * 46) * 1.7);
          return;
        }
        if (g.timer >= Z.stirTime + Z.riseTime) {
          g.rise.destroy(); g.rise = null;
          var e = g.enemy = self.spawnEnemy({ kind: 'grave_zombie', grave: g.index, texture: g.texture,
            fixed: g.tile, zone: { x0: 4, x1: 25, y0: 7, y1: 19 } }, true);
          delete e.g.fixed;
          e.light.base = 0.12;
          e.light.img.setTint(0x9eb7a3);
          e.atkCd = 0.85;
          return;
        }
        var frame = Math.min(4, Math.floor((g.timer - Z.stirTime) / Z.riseTime * 5));
        if (g.riseFrame === frame) return;
        if (g.riseFrame < 0) {
          g.rise.x = g.point.x;
          self.fx.dirt.explode(10, g.point.x, g.point.y - 5);
          if (m.groan <= 0) { LC.Audio.sfx('graveGroan'); m.groan = 3; }
        }
        g.riseFrame = frame;
        g.rise.setTexture(g.texture + '_rise_' + frame);
      });
      m.groan -= dt;
      if (near && m.groan <= 0) { LC.Audio.sfx('graveGroan'); m.groan = 5 + Math.random() * 3; }
    },

    createDuneGiant: function () {
      var home = this.tilePx(G.home);
      var e = this.spawnEnemy({ kind: 'dune_giant', fixed: G.home, awake: false }, true);
      e.spr.anims.stop();
      e.spr.setVisible(true).setTexture('dune_giant_sleep_0');
      var club = this.add.image(home.x, home.y, 'dune_tree_club').setOrigin(0.085, 0.5).setScale(0.86);
      this.duneGiant = { enemy: e, home: home, club: club, ground: this.add.graphics().setDepth(9), phase: 'sleep', t: 0,
        breath: this.time.now / 1000, face: 0, swung: false };
      this.updateDuneGiantArt(this.duneGiant, 0);
    },
    wakeDuneGiant: function () {
      var g = this.duneGiant;
      if (!atRest(g)) return;
      var e = g.enemy, strength = G.strengthMultiplier * Math.max(1, Math.floor(this.S.str || 10));
      e.def = Object.assign({}, LC.ENEMIES.dune_giant, { strength: strength, dmg: 8 + Math.floor(strength / 25) });
      e.g.awake = true; e.away = false;
      e.light.base = 0.24; e.light.img.setTint(0xd29860);
      g.phase = 'wake'; g.t = 0; g.face = bearing(e.spr, this.player);
      LC.Audio.sfx('duneWake');
      this.fx.dirt.explode(15, e.spr.x, e.spr.y);
      this.toast('The giant wakes! Step out of the marked club swing.', 'dune_giant_0');
    },
    moveDuneGiant: function (g, toward, dt) {
      var p = g.enemy.spr, a = bearing(p, toward), stride = Math.min(distance(p, toward), g.enemy.def.speed * dt);
      var x = p.x + Math.cos(a) * stride, y = p.y + Math.sin(a) * stride;
      if (!this.blockedAt(x, p.y)) p.x = x;
      if (!this.blockedAt(p.x, y)) p.y = y;
      g.face = a;
    },
    updateDuneGiant: function (time, dt, blocked) {
      var g = this.duneGiant, e = g.enemy, p = e.spr;
      if (e.dead) return;
      if (atRest(g)) {
        this.updateDuneGiantArt(g, time);
        if (blocked) return;
        var d = distance(p, this.player);
        if (d < G.wakeRange) this.wakeDuneGiant();
        else if (d < 134 && time / 1000 - g.breath >= 4.4) { g.breath = time / 1000; LC.Audio.sfx('duneSnore'); }
        return;
      }
      if (blocked || e.stoneT > 0 || e.fearT > 0) return;
      g.t += dt;
      if (g.phase === 'return') {
        var before = distance(p, g.home);
        this.moveDuneGiant(g, g.home, dt);
        if (before < 8 || g.t > 5) {
          p.setPosition(g.home.x, g.home.y);
          g.phase = 'sleep'; g.t = 0; g.breath = time / 1000;
          e.away = true; e.g.awake = false; e.hp = e.def.hp;
          e.light.base = 0; p.clearTint();
        }
      } else if (g.phase === 'wake' && g.t >= 0.9) {
        g.phase = 'chase'; g.t = 0;
      } else if (g.phase === 'chase') {
        var range = distance(p, this.player);
        if (range > G.chaseRange || distance(g.home, this.player) > G.leash) {
          g.phase = 'return'; g.t = 0;
        } else if (range <= G.attackRange - 7) {
          g.phase = 'windup'; g.t = 0; g.face = bearing(p, this.player);
          LC.Audio.sfx('lunge');
        } else this.moveDuneGiant(g, this.player, dt);
      } else if (g.phase === 'windup' && g.t >= G.windup) {
        g.phase = 'swing'; g.t = 0; g.swung = false;
        LC.Audio.sfx('duneSwing');
      } else if (g.phase === 'swing') {
        if (!g.swung && g.t >= G.swing * 0.42) {
          g.swung = true;
          this.hitDuneSwing(g);
        }
        if (g.t >= G.swing) { g.phase = 'rest'; g.t = 0; }
      } else if (g.phase === 'rest' && g.t >= 1.18) {
        g.phase = 'chase'; g.t = 0;
      }
      this.updateDuneGiantArt(g, time);
    },
    hitDuneSwing: function (g) {
      var p = g.enemy.spr, target = this.player, x = p.x + Math.cos(g.face) * 74, y = p.y + Math.sin(g.face) * 74;
      this.fx.dirt.explode(26, x, y);
      this.shockwave(x, y, 46, 0xffce88);
      this.cameras.main.shake(190, 0.006);
      LC.Audio.sfx('duneThud');
      if (distance(p, target) < G.attackRange && angleGap(bearing(p, target), g.face) <= G.halfArc) this.playerHurt(g.enemy.def.dmg, g.enemy);
    },
    updateDuneGiantArt: function (g, time) {
      var e = g.enemy, p = e.spr, sleep = atRest(g);
      var walking = g.phase === 'chase' || g.phase === 'return';
      var frame = sleep ? 'dune_giant_sleep_' + Math.floor(time / 720) % 2 : 'dune_giant_' + (walking ? Math.floor(time / 135) % 3 : g.phase === 'windup' ? 2 : 0);
      if (p.texture.key !== frame) p.setTexture(frame);
      p.setDepth(p.y).setFlipX(!sleep && Math.cos(g.face) < 0);
      var hand = sleep ? { x: p.x - 19, y: p.y - 9 } : { x: p.x + (p.flipX ? -30 : 30), y: p.y - 36 };
      var angle = g.face - 0.6;
      if (g.phase === 'windup') angle = g.face - G.halfArc - 0.4 * Math.min(1, g.t / G.windup);
      if (g.phase === 'swing') angle = g.face + G.halfArc * (2 * Math.min(1, g.t / G.swing) - 1);
      if (g.phase === 'rest') angle = g.face + G.halfArc * Math.max(0, 1 - g.t);
      g.club.setPosition(hand.x, hand.y).setDepth(p.y + 2).setRotation(sleep ? 0.08 : angle);
      e.light.img.setPosition(p.x, p.y - 46);
      var ground = g.ground;
      ground.clear();
      ground.fillStyle(0x6a4234, 0.23); ground.fillEllipse(p.x, p.y - 3, 94, sleep ? 24 : 20);
      if (g.phase !== 'windup') return;
      var progress = Math.min(1, g.t / G.windup);
      var arc = [{ x: p.x, y: p.y }];
      for (var i = 0; i <= 18; i++) {
        var a = g.face + G.halfArc * (2 * i / 18 - 1);
        arc.push({ x: p.x + Math.cos(a) * G.attackRange, y: p.y + Math.sin(a) * G.attackRange });
      }
      ground.fillStyle(0xa34139, 0.28 + progress * 0.19); ground.fillPoints(arc, true);
      ground.lineStyle(4, 0x61343c, 0.86); ground.strokePoints(arc, true);
      ground.lineStyle(2, 0xffc886, 1); ground.strokePoints(arc, true);
    },
    defeatDuneGiant: function () {
      var g = this.duneGiant, e = g.enemy, p = e.spr;
      e.dead = true; e.hp = 0; e.away = true; e.respawn = Infinity; e.light.base = 0;
      g.ground.clear();
      p.setTexture('dune_giant_sleep_1').setFlipX(false).clearTint();
      g.club.setPosition(p.x - 19, p.y - 9).setRotation(0.08);
      this.tweens.add({ targets: [p, g.club], alpha: 0, duration: 1100 });
      this.fx.dirt.explode(25, p.x, p.y);
      this.S.stats.kills = (this.S.stats.kills || 0) + 1;
      this.S.quests.duneGiantDefeatedDay = this.S.day;
      if (LC.C12 && LC.C12.step(this.S) >= LC.C12.end) this.stormBonus();
      LC.State.save();
      this.toast('The dune giant falls back into a deep sleep.', 'dune_giant_sleep_1');
    }
  });
})(window.LC);
