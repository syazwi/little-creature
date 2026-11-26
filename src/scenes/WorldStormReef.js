/* Chapter 12 sailing, the shipboard encounter and Idris's companion AI. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var T = 16, W = LC.WorldScene.prototype, C = LC.C12, X = LC.CH12TEXT, TAIL_RADIUS = 38;
  function step(world) { return C.step(world.S); }
  function point(value) { return { x: (value.x + 0.5) * T, y: (value.y + 0.5) * T }; }
  function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function heading(a, b) { return Math.atan2(b.y - a.y, b.x - a.x); }
  function active(e) { return !e.dead && !e.away; }
  function returning(world) { return step(world) === 4 && world.S.quests.c12Rescued === 7; }
  function armRibbon(g, spine, inset, width, color) {
    var left = [], right = [];
    spine.forEach(function (pt, i) {
      var normal = heading(spine[Math.max(0, i - 1)], spine[Math.min(spine.length - 1, i + 1)]) + Math.PI / 2;
      var dx = Math.cos(normal), dy = Math.sin(normal), r = pt.radius * width;
      left.push({ x: pt.x + dx * (inset - r), y: pt.y + dy * (inset - r) });
      right.push({ x: pt.x + dx * (inset + r), y: pt.y + dy * (inset + r) });
    });
    g.fillStyle(color, 1);
    g.fillPoints(left.concat(right.reverse()), true);
  }

  var create = W.createKampong, tick = W.updateKampong;
  W.createKampong = function () { create.apply(this, arguments); this.createStormReef(); };
  W.updateKampong = function (time, dt) { tick.apply(this, arguments); this.updateStormReef(time, dt); };
  var move = W.updatePlayer;
  W.updatePlayer = function (dt, blocked) {
    if (this.storm && this.storm.sea) return this.moveStormShip(dt, blocked);
    return move.apply(this, arguments);
  };
  var action = W.getAction;
  W.getAction = function () {
    if (this.storm && this.storm.sea) return this.stormSeaAction();
    return action.apply(this, arguments);
  };
  var objectAction = W.objectAction;
  W.objectAction = function (o) {
    var self = this, s = step(this);
    if (o.type === 'storm_dock') return { label: s === 0 ? 'Meet Nakhoda Idris' : s === 5 ? 'Take the helm for an open-sea voyage' :
      returning(this) ? 'Return Lina’s lantern' : 'Return to Storm Reef',
      fn: function () { self.useStormDock(); } };
    if (o.type === 'storm_helm') return { label: s === 4 ? 'Sail to the stranded crews' : 'Take the helm', fn: function () {
      if (s === 2 || s === 3) { self.toast('The fight is still going.', 'ic_hp'); return; }
      var isVoyage = s === 5, place = isVoyage && self.storm.voyageDone ? C.port : C.reef;
      self.goArea('stormsea', point(place), 'right');
    } };
    return objectAction.apply(this, arguments);
  };
  var groupOn = W.groupOn;
  W.groupOn = function (group) {
    if (group.kind === 'kraken12') return !!(this.storm && this.storm.boss && this.storm.boss.phase === 'eye');
    return groupOn.apply(this, arguments);
  };
  var die = W.enemyDie;
  W.enemyDie = function (e) {
    if (e.dead) return;
    if (e.kind === 'kraken12') return this.dropStormKraken(e);
    if (e.kind === 'captain12') {
      this.removeStormEnemy(e);
      this.storm.deck.captainDown = true;
      return;
    }
    if (e.kind === 'raider12') return this.removeStormEnemy(e);
    var result = die.apply(this, arguments);
    if (e.def.boss && e.dead && step(this) === 5) this.stormBonus();
    return result;
  };

  Object.assign(W, {
    stormLines: function (lines, onDone) { this.ui.say(this.ch2Lines(lines), onDone ? { onDone: onDone } : undefined); },
    createStormReef: function () {
      this.storm = null;
      if (!C.ready(this.S)) return;
      var state = this.storm = { sea: null, deck: null, boss: null, jack: null, talk: null };
      var s = step(this), d = this.S.quests;
      if (this.area === 'farm' && this.objImgs.storm_dock12) this.createStormDock();
      if (this.area === 'stormsea') this.startStormSea();
      if (this.area === 'stormdeck') this.startStormDeck();
      if (this.area === 'stormdeck' || (s === 5 && d.c12Jack)) this.refreshStormJack();
    },
    createStormDock: function () {
      var state = this.storm, dock = this.objImgs.storm_dock12, x = dock.x, y = dock.y;
      state.dockJack = this.add.sprite(x + 1, y - 10, 'npc_jack12_0').setOrigin(0.5, 1).setDepth(y - 10);
      state.dockJack.play('npc_jack12_idle');
      state.homeLamp = this.add.image(x + 26, y + 2, 'lampu_pulang12_0').setOrigin(0.5, 1).setDepth(y + 2);
      state.homeLight = this.addLight(x + 22, y - 15, 0xffbe67, 0.65, true);
      state.homeLight.base = 0;
      this.updateStormLamp();
      if (step(this) >= C.end) return;
      state.lina = this.add.image(x - 18, y + 2, 'npc_lina12').setOrigin(0.5, 1).setDepth(y + 2);
      if (returning(this)) state.yusof = this.add.image(x + 20, y + 6, 'npc_yusof12').setOrigin(0.5, 1).setDepth(y + 6);
    },
    updateStormLamp: function () {
      var state = this.storm, installed = step(this) >= C.end, mins = this.S.minutes;
      var lit = installed && (mins >= 19 * 60 || mins < 6 * 60);
      state.homeLamp.setVisible(installed);
      if (!installed) return;
      state.homeLamp.setTexture(lit ? 'lampu_pulang12_1' : 'lampu_pulang12_0');
      state.homeLight.base = lit ? 0.8 : 0;
    },
    useStormDock: function () {
      var q = this.S.quests, s = step(this);
      if (!C.ready(this.S)) return;
      if (s === 0) { q.ch12 = 1; LC.State.save(); this.stormLines(X.meet); return; }
      if (returning(this)) { this.finishStormReef(); return; }
      var place = s >= 2 && s <= 3 ? 'stormdeck' : 'stormsea';
      LC.Audio.sfx('creak11');
      this.goArea(place, undefined, 'right');
    },
    updateStormReef: function (time, dt) {
      var state = this.storm;
      if (!state || !this.player || this.leaving || this.sleeping) return;
      var blocked = this.ui.isBlocking() || this.cutscene;
      if (state.sea) this.drawStormSea(time, dt, blocked);
      if (state.deck) this.updateStormDeck(time, dt, blocked);
      if (state.jack) this.updateStormJack(dt, blocked);
      if (state.homeLamp) this.updateStormLamp();
      if (!blocked && state.talk) {
        var lines = state.talk; state.talk = null;
        this.stormLines(lines);
      }
    },
    startStormSea: function () {
      var self = this, q = this.S.quests, s = step(this), p = this.player;
      var sea = this.storm.sea = { x: p.x, y: p.y, angle: 0, speed: 0, hull: 100, cooldown: 0, rivalHull: s === 1 ? 90 : 0,
        enemyAt: 1.8, shots: [], wakeAt: 0, stormAt: 0, chest: null, crews: [], signal: s === 5 ? C.encounter(this.S) : null };
      sea.texture = s < 2 ? 'vinta11_t' : 'stormship12_';
      sea.ship = this.add.image(p.x, p.y, sea.texture + '0').setDepth(1200);
      sea.wake = this.add.particles(0, 0, 'foam11', { lifespan: 900, speed: { min: 2, max: 8 }, scale: { start: 0.4, end: 1.05 }, alpha: { start: 0.62, end: 0 }, emitting: false }).setDepth(3);
      p.setVisible(false); this.pShadow.setVisible(false); this.cameras.main.setZoom(1.8);
      var rival = point(C.rival);
      if (s === 1) sea.rival = this.add.image(rival.x, rival.y, 'stormship12_0').setTint(0xb87991).setRotation(Math.PI).setDepth(1200);
      var reef = point(C.reef);
      this.add.image(reef.x + 91, reef.y + 26, 'stormwreck12').setDepth(2).setScale(1.55);
      if (s === 4) sea.crews = C.crews.map(function (b, i) {
        var at = point(b), picture = self.add.image(at.x, at.y, 'vinta11_t0').setScale(0.65).setAngle(i * 26 - 13).setDepth(900);
        picture.setVisible(!(q.c12Rescued & (1 << i)));
        return picture;
      });
      if (s === 4 && !(q.c12Rescued & 1)) {
        var first = point(C.crews[0]);
        sea.lantern = this.add.image(first.x, first.y - 9, 'fishing_lamp12_1').setDepth(1201);
        if (!q.c12Chest) {
          sea.chest = this.add.image(p.x - 55, p.y, 'peti11').setDepth(1199);
          sea.tow = this.add.graphics().setDepth(1198);
          this.storm.talk = X.rescue;
        }
      }
      sea.funnel = this.add.graphics().setDepth(1250);
      sea.spout = [{ x: 504, y: 438 }, { x: 977, y: 405 }];
      if (s === 1 && !q.c12Sailed) { q.c12Sailed = 1; this.storm.talk = X.chase; }
    },
    moveStormShip: function (dt, blocked) {
      var sea = this.storm.sea, keys = this.keys, p = this.player, vx = 0, vy = 0;
      if (!blocked) {
        vx = Number(keys.D.isDown || keys.RIGHT.isDown) - Number(keys.A.isDown || keys.LEFT.isDown);
        vy = Number(keys.S.isDown || keys.DOWN.isDown) - Number(keys.W.isDown || keys.UP.isDown);
        if (!vx && !vy) { var touch = this.ui.touchVec(); if (touch && Math.hypot(touch.x, touch.y) > 0.15) { vx = touch.x; vy = touch.y; } }
      }
      var steer = !!(vx || vy), max = step(this) >= 2 ? 126 : 109;
      if (steer) {
        var diff = Math.atan2(vy, vx) - sea.angle;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        sea.angle += clamp(diff, -4.1 * dt, 4.1 * dt);
      }
      sea.speed = clamp(sea.speed + (steer ? 142 : -205) * dt, 0, max);
      var dx = Math.cos(sea.angle) * sea.speed, dy = Math.sin(sea.angle) * sea.speed, self = this;
      if (!blocked) sea.spout.forEach(function (f) {
        var d = distance(f, sea);
        if (d > 110 || d < 1) return;
        var a = heading(sea, f), pull = (1 - d / 110) * 103;
        dx += (Math.cos(a) - Math.sin(a) * 0.7) * pull; dy += (Math.sin(a) + Math.cos(a) * 0.7) * pull;
        if (d < 29 && sea.stormAt <= 0) { self.damageStormShip(14); sea.stormAt = 1.35; }
      });
      if (this.seaFree(sea.x + dx * dt, sea.y)) sea.x += dx * dt; else sea.speed *= 0.74;
      if (this.seaFree(sea.x, sea.y + dy * dt)) sea.y += dy * dt; else sea.speed *= 0.74;
      p.setPosition(sea.x, sea.y); p.setVisible(false); this.pShadow.setVisible(false);
      this.veh.setVisible(false); this.moving = sea.speed > 8;
    },
    damageStormShip: function (damage) {
      var sea = this.storm.sea;
      sea.hull = Math.max(0, sea.hull - damage);
      this.fx.drop.explode(8, sea.x, sea.y); this.cameras.main.shake(220, 0.006); LC.Audio.sfx('bump11');
      if (sea.hull > 0) return;
      this.toast('Idris hauls you back to the jetty. The crew patches the hull so you can try again.', 'ic_hp');
      this.goArea('farm', { x: 21.5 * T, y: 29 * T + 12 }, 'down');
    },
    drawStormSea: function (time, dt, blocked) {
      var sea = this.storm.sea, t = time / 1000, self = this;
      sea.cooldown -= dt; sea.stormAt -= dt; sea.wakeAt -= dt;
      sea.ship.setPosition(sea.x, sea.y + Math.sin(t * 3) * 1.8).setRotation(sea.angle + Math.sin(t * 2.7) * 0.06);
      sea.ship.setTexture(sea.texture + (Math.floor(t * 5) % 2));
      if (sea.speed > 12 && sea.wakeAt <= 0) {
        sea.wakeAt = 0.13 / LC.Display.preset().density;
        sea.wake.emitParticleAt(sea.x - Math.cos(sea.angle) * 28, sea.y - Math.sin(sea.angle) * 28, 2);
      }
      var g = sea.funnel;
      g.clear();
      sea.spout.forEach(function (f, i) {
        f.x = (i ? 977 : 504) + Math.sin(t * 0.37 + i) * (i ? 32 : 49);
        f.y = (i ? 405 : 438) + Math.cos(t * 0.31 + i) * 42;
        self.drawWaterspout(g, f, t, i);
      });
      if (sea.rival && step(this) === 1) {
        var at = point(C.rival);
        sea.rival.setPosition(at.x + Math.sin(t * 0.8) * 35, at.y + Math.cos(t * 0.8) * 27).setRotation(heading(sea.rival, sea) + Math.sin(t * 3) * 0.05);
        if (!blocked && distance(sea, sea.rival) < 229 && (sea.enemyAt -= dt) <= 0) {
          sea.enemyAt = 2.25; this.stormBroadside();
        }
      }
      if (sea.signal && distance(sea, point(sea.signal)) < 155 && !sea.beacon) {
        var mark = point(sea.signal);
        sea.beacon = this.add.image(mark.x, mark.y, sea.signal.kind === 'wreck' ? 'stormwreck12' : 'swirl11').setDepth(1250).setAlpha(0.85);
      }
      sea.crews.forEach(function (boat, i) { if (boat.visible) boat.setRotation(i * 0.37 + Math.sin(t * 3 + i) * 0.13); });
      if (sea.tow) {
        var cos = Math.cos(sea.angle), sin = Math.sin(sea.angle), sternX = sea.x - cos * 43, sternY = sea.y - sin * 43;
        sea.chest.setPosition(sternX - cos * 28, sternY - sin * 28 + Math.sin(t * 4) * 2).setRotation(sea.angle + Math.sin(t * 3) * 0.15);
        sea.tow.clear();
        sea.tow.lineStyle(2, 0xc9a06c, 1);
        sea.tow.lineBetween(sternX, sternY, sea.chest.x, sea.chest.y);
      }
      if (sea.lantern) {
        var beat = Math.floor(t * 4) % 10, flash = beat === 0 || beat === 2 || beat === 4;
        sea.lantern.setTexture(flash ? 'fishing_lamp12_1' : 'fishing_lamp12_0').y = sea.crews[0].y - 9 + Math.sin(t * 3);
        if (flash) {
          g.fillStyle(0xffc876, 0.23); g.fillCircle(sea.lantern.x, sea.lantern.y, 15);
          g.lineStyle(1, 0xffe1a0, 0.8); g.strokeCircle(sea.lantern.x, sea.lantern.y, 12);
        }
      }
      if (!blocked && sea.shots.length) this.updateStormShots(dt);
    },
    drawWaterspout: function (g, f, t, i) {
      var view = this.cameras.main.worldView;
      if (f.x < view.x - 130 || f.x > view.right + 130 || f.y < view.y - 65 || f.y > view.bottom + 185) return;
      var y = f.y, drift = Math.sin(t * 2 + i) * 11;
      g.fillStyle(0x507597, 0.38); g.fillEllipse(f.x, y + 5, 96, 37);
      g.fillStyle(0xa3c7ca, 0.38); g.fillTriangle(f.x - 50 + drift, y - 126, f.x + 44 + drift, y - 126, f.x + 7, y + 5);
      for (var j = 0; j < 13; j++) {
        var h = (j + (t * 7) % 1) / 13, width = 14 + h * 104;
        g.lineStyle(2, j % 3 ? 0xa8d9dc : 0xdce8e5, 0.22 + h * 0.41);
        g.strokeEllipse(f.x + h * drift + Math.sin(t * 6 + j) * 9, y - h * 138, width, width * 0.22);
      }
      g.lineStyle(2, 0xc8f1ed, 0.62); g.strokeEllipse(f.x, y + 6, 76 + 8 * Math.sin(t * 7), 26);
    },
    stormBroadside: function () {
      var sea = this.storm.sea, from = sea.rival, at = { x: sea.x + Math.cos(sea.angle) * sea.speed * 0.32, y: sea.y + Math.sin(sea.angle) * sea.speed * 0.32 };
      var ring = this.add.graphics().setDepth(1198);
      ring.fillStyle(0xce6b63, 0.25); ring.fillCircle(at.x, at.y, 26);
      ring.lineStyle(2, 0xff9d82, 1); ring.strokeCircle(at.x, at.y, 26);
      var shot = this.add.image(from.x, from.y, 'px').setScale(4).setTint(0x41344c).setDepth(1251);
      sea.shots.push({ from: { x: from.x, y: from.y }, at: at, shot: shot, ring: ring, t: 0 });
      LC.Audio.sfx('punch');
    },
    updateStormShots: function (dt) {
      var sea = this.storm.sea, self = this;
      sea.shots = sea.shots.filter(function (s) {
        s.t += dt;
        var p = Math.min(1, s.t / 0.85);
        s.shot.setPosition(s.from.x + (s.at.x - s.from.x) * p, s.from.y + (s.at.y - s.from.y) * p - 38 * Math.sin(p * Math.PI));
        if (p < 1) return true;
        self.fx.drop.explode(10, s.at.x, s.at.y); s.ring.destroy(); s.shot.destroy();
        if (distance(s.at, sea) < 29) self.damageStormShip(16);
        return false;
      });
    },
    stormFire: function () {
      var sea = this.storm.sea, self = this, enemy = sea.rival;
      if (!enemy || sea.cooldown > 0 || step(this) !== 1) return;
      sea.cooldown = 0.9;
      var shot = this.add.image(sea.x, sea.y, 'px').setScale(4).setTint(0xffe6ad).setDepth(1250);
      LC.Audio.sfx('punch');
      var hit = { x: enemy.x, y: enemy.y };
      this.tweens.add({ targets: shot, x: hit.x, y: hit.y, duration: 240, onComplete: function () {
        shot.destroy();
        if (self.leaving || step(self) !== 1) return;
        sea.rivalHull -= 18; self.fx.sparkle.explode(8, hit.x, hit.y); LC.Audio.sfx('hit');
        self.cameras.main.shake(110, 0.003);
        if (sea.rivalHull > 0) return;
        self.S.quests.ch12 = 2; LC.State.save();
        self.toast('Their sails go slack. Pull alongside and board.', 'ic_glow');
      } });
    },
    stormSeaAction: function () {
      var self = this, sea = this.storm.sea, s = step(this), q = this.S.quests;
      if (distance(sea, point(C.port)) < 64) return { label: returning(this) ? 'Bring the fishers home' : 'Moor at the farm jetty', fn: function () {
        self.goArea('farm', { x: 21.5 * T, y: 29 * T + 12 }, 'down');
      } };
      if (s === 1 && sea.rival && distance(sea, sea.rival) < 155) return { label: sea.cooldown > 0 ? 'Ready the next shot' : 'Fire at the rival ship', fn: function () { self.stormFire(); } };
      if (s === 2 && distance(sea, sea.rival || point(C.rival)) < 78) return { label: 'Board the treasure ship', fn: function () { self.goArea('stormdeck', undefined, 'right'); } };
      if (s === 4) {
        if (!(q.c12Rescued & 1)) {
          if (distance(sea, point(C.crews[0])) >= 58) return null;
          return sea.tow ? { label: 'Pull alongside Pak Yusof', fn: function () { self.cutStormTowline(); } } :
            { label: 'Bring Pak Yusof aboard', fn: function () { self.takeStormCrew(0); } };
        }
        var crew = C.crews.findIndex(function (c, i) { return !(q.c12Rescued & (1 << i)) && distance(sea, point(c)) < 58; });
        if (crew >= 0) return { label: 'Bring the stranded fishers aboard', fn: function () { self.takeStormCrew(crew); } };
      }
      if (s === 5 && sea.signal && distance(sea, point(sea.signal)) < 63) return {
        label: sea.signal.kind === 'wreck' ? 'Search the wreck' : 'Face the sea boss from the deck', fn: function () {
          if (sea.signal.kind === 'wreck') self.claimStormWreck(); else self.goArea('stormdeck', undefined, 'right');
        } };
      return null;
    },
    stormDestination: function () {
      var s = step(this), q = this.S.quests, sea = this.storm.sea;
      if (s === 1 || s === 2) return { point: sea.rival || point(C.rival), label: s === 2 ? 'Board the rival ship' : 'Rival ship' };
      if (s === 4) {
        if (!(q.c12Rescued & 1)) return { point: point(C.crews[0]), label: 'Pak Yusof’s lantern' };
        var crew = C.crews.find(function (c, i) { return !(q.c12Rescued & (1 << i)); });
        return crew ? { point: point(crew), label: 'Stranded fishers' } : { point: point(C.port), label: 'Home jetty' };
      }
      if (sea.signal) return { point: point(sea.signal), label: sea.beacon ? (sea.signal.kind === 'wreck' ? 'Wreck sighted' : 'Sea boss ahead') : 'Uncharted signal' };
      return { point: point(C.port), label: 'Home jetty' };
    },
    cutStormTowline: function () {
      var self = this, sea = this.storm.sea;
      if (!sea.tow) return;
      this.stormLines(X.cut.slice(0, 2), function () {
        self.S.quests.c12Chest = 1; LC.State.save();
        var chest = sea.chest;
        sea.tow.destroy(); sea.tow = null;
        LC.Audio.sfx('swing');
        self.tweens.add({ targets: chest, y: chest.y + 15, angle: chest.angle - 32, alpha: 0, duration: 570,
          onComplete: function () { chest.destroy(); sea.chest = null; } });
        self.fx.drop.explode(14, chest.x, chest.y);
        LC.Audio.sfx('splash');
        self.stormLines(X.cut.slice(2));
      });
    },
    takeStormCrew: function (i) {
      var q = this.S.quests, boat = this.storm.sea.crews[i], sea = this.storm.sea;
      if (q.c12Rescued & (1 << i)) return;
      q.c12Rescued = (q.c12Rescued || 0) | 1 << i; LC.State.save();
      this.tweens.add({ targets: boat, x: sea.x, y: sea.y, alpha: 0, duration: 460, onComplete: function () { boat.setVisible(false); } });
      LC.Audio.sfx('chime'); this.toast(q.c12Rescued === 7 ? 'All three crews are safe. Follow the compass home.' : 'The fishers climb aboard.', 'ic_bond');
      if (i === 0) {
        sea.lantern.destroy(); sea.lantern = null;
        this.stormLines(X.father);
      }
    },
    finishStormReef: function () {
      if (!returning(this)) return;
      var q = this.S.quests, state = this.storm, self = this;
      q.ch12 = 5; q.c12Jack = true; q.stormVoyage = 0;
      LC.State.save();
      this.updateStormLamp();
      this.tweens.add({ targets: state.lina, x: state.yusof.x - 9, y: state.yusof.y + 1, duration: 430, ease: 'Quad.easeOut',
        onUpdate: function () { state.lina.setDepth(state.lina.y); } });
      LC.Audio.sfx('stage');
      this.stormLines(X.finish, function () {
        self.refreshStormJack();
        self.tweens.add({ targets: [state.lina, state.yusof], alpha: 0, duration: 500,
          onComplete: function () { state.lina.destroy(); state.yusof.destroy(); } });
      });
    },
    claimStormWreck: function () {
      var sea = this.storm.sea, q = this.S.quests, id = sea.signal.item;
      if (!LC.State.canAdd(id)) { this.toast('Your bag is full. Make room before taking the salvage.', 'ic_moon'); return; }
      LC.State.add(id, 1); q.stormVoyage = (q.stormVoyage || 0) + 1;
      var at = point(sea.signal);
      this.fx.sparkle.explode(14, at.x, at.y);
      if (sea.beacon) sea.beacon.destroy();
      sea.beacon = null; sea.signal = C.encounter(this.S);
      LC.State.save(); LC.Audio.sfx('chime'); this.toast('Wreck salvage: ' + LC.ITEMS[id].name + '. The Pedoman finds a fresh signal.', LC.ITEMS[id].icon);
    },

    startStormDeck: function () {
      var d = this.storm.deck = { raiders: [], captain: null, captainDown: false, rail: this.add.graphics().setDepth(3) };
      var g = d.rail;
      g.lineStyle(5, 0x513735, 1); g.strokeRect(6 * T, 12 * T, 36 * T, 13 * T);
      g.lineStyle(2, 0xcf9c65, 1); g.strokeRect(6 * T + 3, 12 * T + 3, 36 * T - 6, 13 * T - 6);
      for (var x = 6 * T; x < 42 * T; x += 27) { g.fillStyle(0x784e38, 1); g.fillRect(x, 12 * T - 5, 4, 10); g.fillRect(x, 25 * T - 5, 4, 10); }
      this.cameras.main.setZoom(1.48);
      this.add.image(30 * T, 27 * T, 'vinta11_t0').setRotation(Math.PI).setDepth(3);
      if (step(this) !== 2) return;
      var self = this, zone = { x0: 16, y0: 14, x1: 36, y1: 22 };
      for (var i = 0; i < 4; i++) d.raiders.push(this.spawnEnemy({ kind: 'raider12', zone: zone }, true));
      d.raiders.forEach(function (e, i) {
        e.spr.setAlpha(0).setScale(0.72);
        self.tweens.add({ targets: e.spr, alpha: 1, scale: 1, duration: 300, delay: i * 95, ease: 'Back.easeOut' });
      });
      this.storm.talk = X.board;
    },
    removeStormEnemy: function (e) {
      e.dead = true; e.respawn = Infinity; e.light.base = 0;
      this.fx.smoke.explode(10, e.spr.x, e.spr.y - 12);
      this.tweens.add({ targets: e.spr, y: e.spr.y - 10, alpha: 0, duration: 380, onComplete: function () { e.spr.setVisible(false); } });
      this.S.stats.kills = (this.S.stats.kills || 0) + 1;
    },
    updateStormDeck: function (time, dt, blocked) {
      var deck = this.storm.deck, s = step(this), q = this.S.quests, cam = this.cameras.main, b = this.storm.boss;
      if (cam.zoom !== 1.48) cam.setZoom(1.48);
      var pitch = b && b.phase === 'rise' ? Math.sin(clamp(b.age / 1.5, 0, 1) * Math.PI) * 0.08 : 0;
      cam.setRotation(Math.sin(time / 740) * (b && b.phase !== 'sink' ? 0.022 : 0.013) + pitch);
      if (!blocked && s === 2 && !deck.captain && deck.raiders.every(function (e) { return e.dead; })) {
        deck.captain = this.spawnEnemy({ kind: 'captain12', zone: { x0: 26, y0: 13, x1: 39, y1: 22 } }, true);
        this.toast('The rival captain steps onto the deck.', 'ic_hp'); LC.Audio.sfx('drum');
      }
      if (!blocked && s === 2 && deck.captainDown) {
        q.ch12 = 3; LC.State.save(); this.stormLines(X.surrender); return;
      }
      if (!blocked && ((s === 3) || (s === 5 && !this.storm.voyageDone)) && !this.storm.boss) this.raiseStormKraken();
      if (this.storm.boss) this.updateStormKraken(time, dt, blocked);
    },
    raiseStormKraken: function () {
      var at = point(C.eye), b = this.storm.boss = { phase: 'rise', timer: 1.5, age: 0, dive: 0, attackNo: 0,
        head: this.add.image(at.x, 11.8 * T, 'kraken12_head').setOrigin(0.5, 1).setScale(1.7).setDepth(13).setAlpha(0),
        tail: this.add.image(at.x, at.y, 'kraken12_tail_0').setOrigin(12 / 144, 82 / 101).setDepth(419).setVisible(false),
        arms: this.add.graphics().setDepth(414), warning: this.add.graphics().setDepth(10), eye: null, line: 0 };
      b.eye = this.spawnEnemy({ kind: 'kraken12', fixed: C.eye }, true);
      b.eye.respawn = Infinity; b.eye.spr.setVisible(false); b.eye.light.base = 0;
      LC.Audio.sfx('roar11'); this.cameras.main.shake(550, 0.008);
      this.tweens.add({ targets: b.head, alpha: 1, y: 12.8 * T, duration: 1250, ease: 'Cubic.easeOut' });
      if (step(this) === 3 && !this.S.quests.c12SeenKraken) { this.S.quests.c12SeenKraken = 1; this.storm.talk = X.kraken; }
    },
    updateStormKraken: function (time, dt, blocked) {
      var b = this.storm.boss, p = this.player;
      if (!blocked || b.phase === 'sink' || b.phase === 'rise') { b.age += dt; b.timer -= dt; }
      if (b.phase !== 'rise' && b.phase !== 'sink') b.head.y = 12.8 * T + Math.sin(b.age * 2.4) * 2.6;
      if (b.phase === 'sink') {
        b.dive = Math.min(1, b.dive + dt * 0.62); this.drawStormArms(b, time / 1000);
        return;
      }
      this.drawStormArms(b, time / 1000);
      this.drawStormTail(b);
      if (blocked || b.timer > 0) return;
      if (b.phase === 'tailImpact') { this.openStormEye(); return; }
      if (b.phase === 'windup') {
        if (b.tailTarget) {
          this.slamStormTail();
          return;
        }
        var impact = b.horizontal ? { x: p.x - 12, y: b.line } : { x: b.line, y: p.y - 10 };
        this.shockwave(impact.x, impact.y, 64, 0x96dfe8); this.fx.drop.explode(18, impact.x, impact.y);
        this.cameras.main.shake(320, 0.008); LC.Audio.sfx('spout11');
        if (Math.abs((b.horizontal ? p.y : p.x) - b.line) < 25) this.playerHurt(b.eye.hp <= 54 ? 19 : 14, { spr: impact });
        if (!this.leaving) this.openStormEye();
        return;
      }
      b.eye.away = true; b.eye.spr.setVisible(false); b.eye.light.base = 0;
      this.warnStormKraken();
    },
    openStormEye: function () {
      var b = this.storm.boss;
      b.tail.setVisible(false);
      if (b.eye.hp <= 54 && b.attackNo % 2) { this.warnStormKraken(); return; }
      b.phase = 'eye'; b.timer = 5.4;
      b.eye.away = false; b.eye.kx = 0; b.eye.ky = 0;
      var at = this.tilePx(C.eye);
      b.eye.spr.setPosition(at.x, at.y).setVisible(true).setDepth(at.y + 1).setAlpha(1);
      b.eye.light.base = 1; b.eye.light.img.setTint(0xffd58c);
      this.fx.sparkle.explode(12, at.x, at.y - 12);
      this.toast('Pelita reveals the Kraken’s eye by the bow. Strike while it is exposed!', 'ic_glow');
    },
    warnStormKraken: function () {
      var b = this.storm.boss, p = this.player;
      b.attackNo++; b.horizontal = b.attackNo % 3 === 0;
      b.line = b.horizontal ? clamp(p.y, 12 * T + 14, 25 * T - 14) : clamp(p.x, 6 * T + 12, 42 * T - 12);
      b.tailTarget = b.attackNo % 3 === 1 ? {
        x: clamp(p.x, 6 * T + 18, 42 * T - 18),
        y: clamp(p.y, 12 * T + 18, 25 * T - 18),
        radius: TAIL_RADIUS
      } : null;
      b.phase = 'windup';
      b.windup = b.tailTarget ? (b.eye.hp <= 54 ? 1.35 : 1.65) : (b.eye.hp <= 54 ? 1.15 : 1.5);
      b.timer = b.windup;
      LC.Audio.sfx('lunge');
    },
    drawStormTail: function (b) {
      var target = b.tailTarget, landed = b.phase === 'tailImpact';
      var visible = target && (landed || b.phase === 'windup');
      b.tail.setVisible(!!visible);
      if (!visible) return;
      var side = target.x < b.head.x ? -1 : 1, base = { x: b.head.x - side * 49, y: b.head.y - 48 };
      var progress = landed ? 1 : clamp(1 - b.timer / b.windup, 0, 1);
      var frame = landed ? 4 : progress < 0.15 ? 0 : progress < 0.38 ? 1 : progress < 0.79 ? 2 : 3;
      b.tail.setTexture('kraken12_tail_' + frame).setPosition(base.x, base.y).setRotation(heading(base, target))
        .setScale(distance(base, target) / 110, side * (landed ? 1 : 1 + 0.2 * progress)).setAlpha(landed ? clamp(b.timer / 0.28, 0, 1) : 1);
    },
    slamStormTail: function () {
      var b = this.storm.boss, at = b.tailTarget;
      b.phase = 'tailImpact'; b.timer = 0.48;
      b.warning.clear();
      this.drawStormTail(b);
      this.shockwave(at.x, at.y, at.radius + 12, 0xc4f2e3);
      this.fx.drop.explode(28, at.x, at.y);
      this.fx.pebble.explode(9, at.x, at.y);
      this.cameras.main.shake(370, 0.01);
      LC.Audio.sfx('spout11'); LC.Audio.sfx('bump11');
      if (distance(this.player, at) < at.radius) this.playerHurt(b.eye.hp <= 54 ? 21 : 17, { spr: b.head });
    },
    drawStormArms: function (b, time) {
      if (b.lastFrame !== undefined && time - b.lastFrame < 1 / 30 && b.lastPose === b.phase) return;
      b.lastFrame = time; b.lastPose = b.phase;
      var arms = b.arms, warn = b.warning, winding = b.phase === 'windup', moving = winding && !b.tailTarget;
      arms.clear(); warn.clear();
      if (b.dive >= 1) return;
      arms.setAlpha(1 - b.dive);
      var progress = winding ? clamp(1 - b.timer / b.windup, 0, 1) : 0;
      var strike = Math.pow(clamp((progress - 0.61) / 0.39, 0, 1), 2);
      var rise = b.phase === 'rise' ? clamp(b.age / 1.45, 0, 1) : 1;
      for (var i = 0; i < 6; i++) {
        var side = i < 3 ? -1 : 1, dist = i % 3, center = 23.5 * T;
        var x0 = center + side * (107 + dist * 44), y0 = (7.5 - dist * 1.5) * T;
        var x1 = center + side * (292 - dist * 64), y1 = (24 + dist * 1.25) * T;
        if (moving && i === b.attackNo % 6) {
          var tx = b.horizontal ? (side < 0 ? 43 : 4) * T : b.line;
          var ty = b.horizontal ? b.line : 24.5 * T;
          x1 += (tx - x1) * strike;
          y1 += (ty - y1) * strike - Math.sin(progress * Math.PI) * 43;
        }
        y1 = y0 + (y1 - y0) * rise * (1 - b.dive * 0.68);
        var spine = [];
        for (var j = 0; j <= 12; j++) {
          var p = j / 12, bend = Math.sin(p * Math.PI) * (36 + dist * 10);
          spine.push({
            x: x0 + (x1 - x0) * p + Math.sin(time * 2.4 + p * 4 + i) * bend * rise,
            y: y0 + (y1 - y0) * p + Math.cos(time * 2.9 + p * 5 + i) * bend * 0.57 * rise,
            radius: 18 * Math.pow(1 - p, 0.82) + 1
          });
        }
        armRibbon(arms, spine, 0, 1.16, 0x181425);
        armRibbon(arms, spine, 0, 1, i % 2 ? 0x30646d : 0x3f7a79);
        armRibbon(arms, spine, -1.8, 0.4, i % 2 ? 0x407a79 : 0x549586);
        for (var k = 3; k < spine.length - 1; k += 2) {
          var spot = spine[k];
          arms.fillStyle(0x7b4f69, 1); arms.fillCircle(spot.x, spot.y, spot.radius * 0.53);
          arms.fillStyle(0xd2968a, 1); arms.fillCircle(spot.x - 1, spot.y - 1, spot.radius * 0.34);
        }
      }
      if (winding && b.tailTarget) {
        var target = b.tailTarget;
        warn.fillStyle(0xc84c5f, 0.31); warn.fillCircle(target.x, target.y, target.radius);
        warn.lineStyle(2, 0xffb99a, 0.95); warn.strokeCircle(target.x, target.y, target.radius);
        warn.lineStyle(2, 0xffdec4, 0.85); warn.strokeCircle(target.x, target.y, Math.max(3, target.radius * (1 - progress)));
      } else if (moving) {
        warn.fillStyle(0xc84c5f, 0.24 + 0.19 * Math.sin(progress * 21));
        if (b.horizontal) warn.fillRect(6 * T, b.line - 22, 36 * T, 44); else warn.fillRect(b.line - 22, 12 * T, 44, 13 * T);
        warn.lineStyle(2, 0xff9b8b, 0.9);
        if (b.horizontal) warn.strokeRect(6 * T, b.line - 22, 36 * T, 44); else warn.strokeRect(b.line - 22, 12 * T, 44, 13 * T);
      }
    },
    dropStormKraken: function (e) {
      var b = this.storm.boss, q = this.S.quests, story = step(this) === 3;
      this.removeStormEnemy(e); b.phase = 'sink'; b.dive = 0; b.warning.clear();
      b.tail.setVisible(false);
      this.tweens.add({ targets: b.head, y: b.head.y - 32, alpha: 0, duration: 1600, ease: 'Sine.easeIn' });
      this.fx.drop.explode(30, e.spr.x, e.spr.y); LC.Audio.sfx('roar11'); this.cameras.main.shake(520, 0.007);
      if (story) {
        q.ch12 = 4;
        this.toast('The Kraken sinks. Use the helm near the stern to rescue the fishers.', 'ic_bond');
      } else {
        this.storm.voyageDone = true; q.stormVoyage = (q.stormVoyage || 0) + 1;
        this.S.kepeng += 650; this.S.stats.earned += 650;
        this.toast('Sea boss defeated. Recovered 650 kepeng from the wreck.', 'i_kepeng'); this.stormBonus();
      }
      LC.State.save();
    },
    stormBonus: function () {
      var loot = C.bonus(this.S);
      this.toast('Treasure Hunter’s Luck: +' + loot.text + '.', loot.icon);
    },

    refreshStormJack: function () {
      if (!this.storm || this.storm.sea) return;
      var want = this.area === 'stormdeck' && step(this) < 5 || step(this) === 5 && this.S.quests.c12Jack;
      if (this.storm.dockJack) this.storm.dockJack.setVisible(!want);
      var current = this.storm.jack;
      if (current && !want) { current.spr.destroy(); this.storm.jack = null; }
      if (!want || current) return;
      var p = this.player, spr = this.add.sprite(p.x - 16, p.y + 5, 'npc_jack12_0').setOrigin(0.5, 1).setDepth(p.y);
      spr.play('npc_jack12_idle');
      if (this.area === 'stormdeck') {
        spr.setY(p.y - 50).setAlpha(0.2);
        this.tweens.add({ targets: spr, y: p.y + 5, alpha: 1, duration: 680, ease: 'Back.easeOut' });
      }
      this.storm.jack = { spr: spr, cd: 1.6, entrance: this.area === 'stormdeck' ? 0.7 : 0 };
    },
    updateStormJack: function (dt, blocked) {
      var jack = this.storm.jack, p = this.player, spr = jack.spr, fight = C.jackFight;
      if ((jack.entrance -= dt) > 0 || blocked) return;
      jack.cd -= dt;
      var foe = (this.enemies || []).filter(active).reduce(function (a, e) {
        return distance(p, e.spr) < fight.sight && (!a || distance(spr, e.spr) < distance(spr, a.spr)) ? e : a;
      }, null);
      var foot = foe ? foe.spr : { x: p.x - 18, y: p.y + 7 }, d = distance(spr, foot);
      if (distance(spr, p) > 152) spr.setPosition(p.x - 12, p.y + 8);
      if (d > (foe ? 23 : 8)) {
        var a = heading(spr, foot), x = spr.x + Math.cos(a) * 82 * dt, y = spr.y + Math.sin(a) * 82 * dt;
        if (!this.blockedAt(x, spr.y)) spr.x = x;
        if (!this.blockedAt(spr.x, y)) spr.y = y;
      }
      spr.setDepth(spr.y).setFlipX(foot.x < spr.x);
      if (!foe || d > fight.reach || jack.cd > 0) return;
      jack.cd = fight.cd;
      var arc = this.add.image(foe.spr.x, foe.spr.y - 9, 'slash_right').setDepth(9598).setTint(0xffd298).setAlpha(0.9).setScale(0.8);
      this.tweens.add({ targets: arc, alpha: 0, scale: 1.2, duration: 240, onComplete: function () { arc.destroy(); } });
      this.tweens.add({ targets: spr, angle: spr.flipX ? -9 : 9, duration: 85, yoyo: true });
      LC.Audio.sfx('swing'); this.ui.floatText(foe.spr.x, foe.spr.y - 19, 'Idris ' + fight.dmg, '#ffdd9f');
      foe.hp -= fight.dmg; foe.hurtT = 0.15; foe.spr.setTintFill(0xffffff);
      if (foe.hp <= 0) this.enemyDie(foe);
    }
  });
})(window.LC);
