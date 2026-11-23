/* Weather and story actions for Jerebu dan Bunga Api. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var W = LC.WorldScene.prototype, C = LC.C15, X = LC.JEREBU_TEXT, T = 16;
  var all = C.small.concat([C.big]), directions = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] };
  var flamesAcrossRoof = [0.23, 0.73, 0.43, 0.59, 0.16, 0.83];
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
  function between(a, b) { return a + Math.random() * (b - a); }
  function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function count(n) { return LC.Display.effectCount(n); }
  function step(w) { return C.step(w.S); }
  function night(w, hour) { return w.S.minutes >= hour; }
  function busy(w) { return w.ui.isBlocking() || w.sleeping || w.leaving || w.cutscene || w.reuniting; }
  function blend(a, b, t) {
    function channel(shift) { return Math.round((a >> shift & 255) * (1 - t) + (b >> shift & 255) * t); }
    return channel(16) << 16 | channel(8) << 8 | channel(0);
  }

  var create = W.createKampong, update = W.updateKampong;
  W.createKampong = function () { create.apply(this, arguments); this.createJerebu(); };
  W.updateKampong = function (time, dt) { update.apply(this, arguments); this.updateJerebu(time, dt); };
  var skyColor = W.skyColor, refreshSeason = W.refreshSeason;
  W.skyColor = function (m) {
    var base = skyColor.call(this, m), j = this.jerebu;
    var strength = j && j.rain ? j.haze : LC.jerebuStrength(this.S, this.A);
    return strength ? blend(base, m >= 18 * 60 || m < 6 * 60 ? 0x514958 : 0xc8986a, strength * 0.45) : base;
  };
  W.refreshSeason = function () {
    refreshSeason.apply(this, arguments);
    if (LC.jerebuStrength(this.S, this.A) && this.raining) {
      this.raining = false; this.refreshRainDrops(); LC.Audio.setRain(false);
    }
  };

  var objectAction = W.objectAction, toolAction = W.toolAction, getAction = W.getAction, tapTarget = W.tapTarget;
  W.objectAction = function (o, sl, it, isFood) {
    var self = this, q = this.S.quests, s = step(this);
    if (o.type === 'jerebu_crate') return { label: 'Look at the bunga api crate', fn: function () {
      self.toast(s === 2 ? 'The crate is locked for the next Pesta.' : 'The crate is open. The rockets are gone.');
    } };
    if (o.type === 'sibara') return { label: 'Talk to Si Bara', fn: function () { self.jerebuLines([['sibara15', pick(X.friend)]]); } };
    if (o.type === 'jerebu_bucket' || o.type === 'npc' && o.vid === 'penghulu' && this.area === 'kampung' && s === 4) {
      return { label: 'Join the bucket line', fn: function () { self.jerebuBucket(); } };
    }
    if (o.type === 'jerebu_rain' || o.type === 'npc' && o.vid === 'penghulu' && this.area === 'kampung' && s === 8) {
      return { label: 'Talk to Tok Penghulu at the gelanggang', fn: function () {
        if (o.type === 'jerebu_rain') self.jerebuFinale();
        else self.toast('Tok Penghulu is waiting at the gelanggang.');
      } };
    }
    if (this.area === 'kampung' && o.type === 'npc' && o.vid === 'penghulu' && (s === 1 || q.c15maskOwed)) {
      return { label: s === 1 ? 'Talk to Tok Penghulu about the haze' : 'Collect your Topeng Jerebu', fn: function () { self.jerebuMask(); } };
    }
    if (this.area === 'senah' && s === 7 && o.id === 'sn_tempayan') {
      return { label: 'Fill the gembor', fn: function () { self.refillCan(); } };
    }
    if (o.type === 'jerebu_fuse' && s === 7 && !(q.c15fuses || {})[o.i]) {
      return { label: 'Douse the fuse', fn: function () {
        if (!sl || sl.id !== 'can') { self.toast('Hold the gembor to put out the fuse.', 'i_can'); return; }
        self.jerebuFuse(o);
      } };
    }
    if (this.area === 'kampung' && this.jerebuLevel(o.id)) {
      var target = this.jerebu.fires[o.id];
      if (target && target.level && sl && sl.id === 'can') {
        var face = this.facing();
        return this.toolAction(sl, it, null, null, face.tx, face.ty);
      }
      if (target && target.level) return { label: 'Douse the fire', fn: function () { self.toast('Hold the gembor to put out the fire.', 'i_can'); } };
    }
    return objectAction.call(this, o, sl, it, isFood);
  };
  W.toolAction = function (sl, it, ch, tile, tx, ty) {
    var self = this, o = this.objAt[ty] && this.objAt[ty][tx];
    if (sl && sl.id === 'can' && o && this.area === 'kampung' && this.jerebuLevel(o.id)) {
      return { label: 'Douse the fire', tile: true, fn: function () {
        if (self.jerebuWater()) self.douseJerebu(o.id, 1);
      } };
    }
    return toolAction.apply(this, arguments);
  };
  W.getAction = function () {
    var self = this, s = step(this);
    if (this.area === 'kampung' && (s === 3 || s === 4) && this.S.riding === 'naga' && this.weaponOf(LC.State.selItem()) && this.jerebuJetTarget()) {
      return { label: 'Send Naga Kecil’s water jet', swing: true, fn: function () { self.attack(); } };
    }
    if (this.area === 'kampung' && s === 5 && this.jerebu) {
      var f = this.facing();
      var person = this.jerebu.people.find(function (a) {
        return !a.calm && Math.hypot(a.spr.x - f.fx, a.spr.y - 6 - f.fy) <= 18 && distance(a.spr, self.player) <= 46;
      });
      if (person) return { label: 'Calm ' + person.data.name, fn: function () { self.calmJerebu(person); } };
    }
    return getAction.apply(this, arguments);
  };
  W.tapTarget = function (x, y) {
    if (step(this) === 5 && this.area === 'kampung' && this.jerebu) {
      var actor = this.jerebu.people.find(function (a) { return !a.calm && Math.hypot(a.spr.x - x, a.spr.y - 10 - y) < 13; });
      if (actor) return { kind: 'thing', tx: Math.floor(actor.spr.x / T), ty: Math.floor((actor.spr.y - 3) / T), fx: actor.spr.x, fy: actor.spr.y - 6 };
    }
    return tapTarget.apply(this, arguments);
  };

  var anginKey = W.anginKey, laguKey = W.laguKey, nagaJet = W.nagaJet;
  W.anginKey = function () {
    var before = LC.anginAt;
    anginKey.apply(this, arguments);
    if (!this.jerebu || LC.anginAt === before) return;
    var self = this;
    this.jerebu.fog.forEach(function (f) {
      if (distance(f.img, self.player) > 140) return;
      f.until = self.time.now + 6000;
      self.tweens.killTweensOf(f.fade);
      self.tweens.add({ targets: f.fade, alpha: 0, duration: 300 });
    });
  };
  W.laguKey = function () {
    var before = LC.laguAt;
    laguKey.apply(this, arguments);
    if (LC.laguAt === before || this.area !== 'kampung' || step(this) !== 5 || !this.jerebu) return;
    var self = this;
    this.jerebu.people.forEach(function (a) { if (distance(a.spr, self.player) <= LC.C9.lagu.r) self.calmJerebu(a, true); });
  };
  W.nagaJet = function () {
    if (!this.jerebu || this.area !== 'kampung' || step(this) < 3 || step(this) > 4) return nagaJet.apply(this, arguments);
    var self = this, hit = new Set();
    return nagaJet.call(this, function (x, y) {
      var id = self.jerebuFireAt(x, y);
      if (id && !hit.has(id)) { hit.add(id); self.douseJerebu(id, 2); }
    });
  };

  Object.assign(W, {
    jerebuLines: function (lines) {
      this.ui.say(lines.map(function (line) { return Object.assign({ text: line[1] }, LC.SPEAKERS[line[0]] || {}); }));
    },
    jerebuAway: function (vid) {
      if (this.area !== 'kampung') return false;
      var s = step(this);
      return (vid === 'mat' || vid === 'zul') && (s >= 3 && s <= 8 || this.jerebu && this.jerebu.rain) ||
        vid === 'penghulu' && (s === 4 || s === 8);
    },
    advanceJerebu: function (n) {
      this.S.quests.ch15 = n;
      LC.State.save();
      this.refreshWhen();
    },
    createJerebu: function () {
      this.jerebu = { born: this.time.now, step: -1, haze: 0, fog: [], fires: {}, soot: {}, people: [], tracks: [],
        rocketT: between(8, 12), soundT: 0, fxT: 0, opening: new Set(), flying: new Set(), baraT: 3 };
      this.syncJerebu();
    },
    syncJerebu: function () {
      var J = this.jerebu, s = step(this), q = this.S.quests, self = this;
      J.step = s;
      if (this.objImgs.k_peti15) this.objImgs.k_peti15.setTexture(s === 2 ? 'peti15' : 'peti15_open');
      if (this.area === 'kampung') {
        all.forEach(function (target) {
          self.renderJerebuFire(target);
          if (q.c15soot && q.c15soot[target.id] && (!q.c15repairDay || self.S.day <= q.c15repairDay)) self.markJerebuSoot(target.id);
        });
        if (s >= 3 && s <= 8 && !J.people.length) this.createJerebuPeople();
        if (s === 6 && !J.tracks.length) J.tracks = C.tracks.map(function (at, i) {
          return self.add.image((at[0] + 0.5) * T, (at[1] + 0.5) * T, 'tapak15')
            .setDepth(6).setFlipX(i % 2 === 0).setBlendMode(Phaser.BlendModes.ADD);
        });
        if (s !== 6 && J.tracks.length) { J.tracks.forEach(function (im) { im.destroy(); }); J.tracks = []; }
      }
      if (s === 7 && this.area === 'senah' && !J.bara) {
        var crate = this.objImgs.peti15;
        if (crate) J.bara = this.add.image(crate.x, crate.y - 12, 'sibara15_0').setOrigin(0.5, 1).setDepth(crate.depth + 2);
      }
      if (s === 8 && !J.bara && this.ghost) J.bara = this.add.image(this.ghost.x, this.ghost.y, 'sibara15_0').setOrigin(0.5, 1);
    },
    updateJerebu: function (time, dt) {
      var J = this.jerebu, S = this.S, q = S.quests, s = step(this), blocked = busy(this), self = this;
      if (!J || !C.ready(S) || this.leaving) return;
      if (J.step !== s) this.syncJerebu();
      this.updateJerebuHaze(time, dt);
      if (J.rain) this.updateJerebuRain(dt);
      if (J.people.length) this.updateJerebuPeople(time, dt, blocked);
      if (J.tracks.length) J.tracks.forEach(function (im, i) { im.setAlpha(0.64 + 0.28 * Math.sin(time / 240 + i / 2)); });
      this.updateJerebuBara(time, dt, blocked);
      if (this.area === 'kampung') this.updateJerebuFires(time, dt, blocked);
      if (blocked) return;
      if (s === 0) {
        if (q.c15wait === undefined) { q.c15wait = S.day; LC.State.save(); }
        if (this.area === 'farm' && S.day > q.c15wait) {
          this.advanceJerebu(1); this.refreshSeason(); this.toast(X.orange, 'i_topeng_jerebu');
        }
      } else if (s === 2 && this.area === 'kampung' && night(this, C.night) && time - J.born >= 1200) this.startJerebuAttack();
      else if (s === 3 && this.area === 'kampung' && C.smallOut(S) === C.small.length) {
        q.c15big = 3; this.advanceJerebu(4); this.toast('Tok Penghulu needs a bucket line at his house.', 'i_can');
      } else if (s === 5 && this.area === 'kampung' && C.calmed(S) === C.people.length) {
        this.advanceJerebu(6); this.jerebuLines(X.trail);
      } else if (s === 6 && this.area === 'senah' && night(this, C.groveNight)) {
        q.c15fuses = {}; this.advanceJerebu(7); this.jerebuLines(X.grove);
      } else if (s === 9 && q.c15repairDay !== undefined && S.day > q.c15repairDay) {
        Object.keys(J.soot).forEach(function (id) { J.soot[id].forEach(function (im) { im.destroy(); }); });
        J.soot = {}; delete q.c15soot; delete q.c15repairDay; LC.State.save();
        if (J.rain) {
          J.rain = null;
          J.people.forEach(function (a) { a.spr.destroy(); a.mark.destroy(); if (a.table) a.table.destroy(); });
          J.people = [];
          if (J.bara) { J.bara.destroy(); J.bara = null; }
          self.refreshSeason();
        }
      }
    },
    jerebuMask: function () {
      var q = this.S.quests, first = step(this) === 1;
      q.c15maskOwed = !LC.State.count('topeng_jerebu') && !LC.State.add('topeng_jerebu', 1);
      if (first) this.advanceJerebu(2);
      else LC.State.save();
      if (q.c15maskOwed) this.toast(X.maskFull, 'i_topeng_jerebu');
      else this.toast('Tok Penghulu gives you a Topeng Jerebu.', 'i_topeng_jerebu');
      if (first) this.jerebuLines(X.mask);
    },

    updateJerebuHaze: function (time, dt) {
      var J = this.jerebu, strength = LC.jerebuStrength(this.S, this.A), n = strength || J.rain && J.haze > 0 ? count(14) : 0;
      if (!J.rain) J.haze = strength;
      while (J.fog.length > n) J.fog.pop().img.destroy();
      while (J.fog.length < n) J.fog.push({
        img: this.add.image(0, 0, 'fog').setDepth(8997).setTint(0xd8b890).setScale(between(2.9, 4.6)).setAlpha(0),
        x: between(0, 1), y: between(0, 1), phase: between(0, 6), a: between(0.35, 0.55), fade: { alpha: 1 }, until: 0
      });
      if (!n) return;
      var view = this.cameras.main.worldView, p = this.player, g = this.ghost, self = this;
      var mask = J.mask || 1;
      if ((J.maskT = (J.maskT || 0) - dt) <= 0) {
        J.maskT = 0.4; mask = J.mask = LC.State.count('topeng_jerebu') ? 0.6 : 1;
      }
      J.fog.forEach(function (f, i) {
        var x = view.x + (f.x + time / (34000 + i * 600)) % 1 * (view.width + 100) - 50;
        var y = view.y + f.y * view.height + Math.sin(time / 2900 + f.phase) * 18;
        if (f.until && time >= f.until) {
          f.until = 0; self.tweens.add({ targets: f.fade, alpha: 1, duration: 950 });
        }
        var near = Math.hypot(x - p.x, y - p.y) < 70 || g && g.visible && Math.hypot(x - g.x, y - g.y) < 70;
        f.img.setPosition(x, y).setAlpha(f.a * (near ? 0.4 : 1) * mask * f.fade.alpha * J.haze);
      });
    },

    jerebuLevel: function (id) {
      if (this.area !== 'kampung') return 0;
      var s = step(this), q = this.S.quests;
      if (id === C.big.id) return s === 4 ? q.c15big || 0 : 0;
      return s === 3 && q.c15fires && q.c15fires[id] || 0;
    },
    jerebuFireAt: function (x, y) {
      var row = this.objAt[Math.floor((y + 8) / T)], o = row && row[Math.floor(x / T)];
      return o && this.jerebu && this.jerebu.fires[o.id] && this.jerebu.fires[o.id].level ? o.id : null;
    },
    jerebuJetTarget: function () {
      var p = this.player, d = directions[this.dir], jet = LC.NAGA_JET;
      var x = p.x + d[0] * 14, y = p.y - 12 + d[1] * 10, reach = jet.speed * jet.life;
      for (var at = 0; at <= reach; at += 8) {
        if (this.jerebuFireAt(x + d[0] * at, y + d[1] * at)) return true;
      }
      return false;
    },
    startJerebuAttack: function () {
      var q = this.S.quests, J = this.jerebu, self = this;
      q.c15fires = {}; q.c15hp = {}; q.c15relit = {}; q.c15soot = {}; q.c15big = 0;
      C.small.forEach(function (target) { q.c15fires[target.id] = 1; J.opening.add(target.id); });
      this.advanceJerebu(3);
      if (this.objImgs.k_peti15) this.objImgs.k_peti15.setTexture('peti15_open');
      C.small.forEach(function (target, i) {
        self.time.delayedCall(i * 260, function () { self.launchJerebuRocket(target, true); });
      });
      this.jerebuLines(X.attack);
    },
    jerebuRoof: function (id) {
      var img = this.objImgs[id], b = img && img.getBounds();
      return b && { x: b.centerX, y: b.y + b.height * 0.28, bounds: b, depth: img.depth };
    },
    launchJerebuRocket: function (target, opening) {
      var self = this, J = this.jerebu, roof = this.jerebuRoof(target.id);
      if (step(this) !== 3 || this.leaving || !roof || J.flying.has(target.id)) return;
      J.flying.add(target.id);
      this.fwRocket(this.tilePx(C.launch), roof, { arc: between(30, 60), small: true, onBurst: function () {
        J.flying.delete(target.id); J.opening.delete(target.id);
        if (self.leaving || step(self) !== 3) return;
        if (!opening) {
          if (!self.jerebuLevel(target.id)) self.relightJerebu(target.id);
          else self.raiseJerebu(target.id);
        }
        self.renderJerebuFire(target);
        self.cameras.main.shake(120, 0.002);
        var nearest = J.people.filter(function (a) { return !a.calm; }).sort(function (a, b) { return distance(a.spr, roof) - distance(b.spr, roof); })[0];
        if (nearest) self.ui.floatText(nearest.spr.x, nearest.spr.y - 23, '!', '#ffe0b0');
      } });
    },
    relightJerebu: function (id) {
      var q = this.S.quests, r = q.c15relit || (q.c15relit = {});
      if (q.c15fires[id] !== 0 || r[id]) return;
      r[id] = true; q.c15fires[id] = 1;
      (q.c15hp || (q.c15hp = {}))[id] = 2;
      LC.State.save(); this.renderJerebuFire(C.small.find(function (t) { return t.id === id; }));
    },
    raiseJerebu: function (id) {
      var q = this.S.quests, level = this.jerebuLevel(id);
      if (level < 1 || level >= 3) return;
      if (id === C.big.id) q.c15big = level + 1;
      else q.c15fires[id] = level + 1;
      var hp = q.c15hp || (q.c15hp = {});
      hp[id] = (hp[id] || level * 2) + 2;
      LC.State.save();
      this.renderJerebuFire(all.find(function (target) { return target.id === id; }));
      LC.Audio.sfx('whoosh15');
    },
    markJerebuSoot: function (id) {
      var J = this.jerebu, roof = this.jerebuRoof(id);
      if (!roof || J.soot[id]) return;
      var self = this;
      J.soot[id] = [0, 1, 2].map(function (n) {
        return self.add.image(roof.x + (n - 1) * roof.bounds.width * 0.23, roof.y + (n % 2 ? 3 : -1), 'hangus15_' + n)
          .setDepth(roof.depth + 0.5).setAlpha(step(self) === 9 ? 0.4 : 0.84);
      });
    },
    renderJerebuFire: function (target) {
      if (!target) return;
      var J = this.jerebu, id = target.id, level = J.opening.has(id) ? 0 : this.jerebuLevel(id), self = this, f = J.fires[id];
      if (!f && !level) return;
      var roof = this.jerebuRoof(id);
      if (!roof) return;
      if (!f) f = J.fires[id] = { level: 0, flames: [], growT: 25, burnT: 0, smokeT: 0, emberT: 0, roof: roof };
      var quality = LC.Display.quality, sizes = quality === 'low' ? [0, 2, 3, 4] : [0, 2, 4, 6];
      if (f.quality === quality && f.level === level) return;
      var old = f.level;
      f.quality = quality; f.level = level;
      if (!old && level) f.burnT = 0;
      while (f.flames.length > sizes[level]) {
        var away = f.flames.pop();
        this.tweens.killTweensOf(away);
        this.tweens.add({ targets: away, alpha: 0, duration: 170, onComplete: function (tw, targets) { targets[0].destroy(); } });
      }
      var scale = [0, 0.8, 1.05, 1.3][level];
      while (f.flames.length < sizes[level]) {
        var i = f.flames.length, b = roof.bounds;
        f.flames.push(this.add.sprite(b.x + b.width * flamesAcrossRoof[i], b.y + b.height * between(0.12, 0.4), 'api15_0')
          .setDepth(roof.depth + 1).setOrigin(0.5, 1).setFlipX(Math.random() < 0.5).play({ key: 'api15', startFrame: Math.floor(between(0, 4)) }));
      }
      f.flames.forEach(function (flame) {
        var size = scale * between(0.92, 1.08);
        self.tweens.killTweensOf(flame);
        flame.setScale(size);
        if (quality !== 'low') self.tweens.add({ targets: flame, scaleY: size * 1.12, duration: between(180, 260), yoyo: true, repeat: -1 });
      });
      if (!f.glow && level) f.glow = this.add.image(roof.x, roof.y, 'glow').setDepth(roof.depth + 2).setTint(0xff7a2a).setBlendMode(Phaser.BlendModes.ADD);
      if (f.glow) f.glow.setVisible(!!level).setScale([0, 1.2, 1.8, 2.4][level]);
      if (!f.light && level) f.light = this.addLight(roof.x, roof.y, 0xff8040, 0.9, quality !== 'low');
      if (f.light) {
        f.light.base = level ? 0.35 + 0.17 * level : 0;
        f.light.flicker = quality !== 'low';
        if (!level) f.light.img.setVisible(false);
      }
    },
    updateJerebuFires: function (time, dt, blocked) {
      var self = this, J = this.jerebu, S = this.S, q = S.quests, s = step(this);
      if (s < 3 || s > 4) return;
      var active = Object.keys(J.fires).filter(function (id) { return J.fires[id].level > 0; });
      var volume = 0;
      if (J.embers) J.embers.setVisible(LC.Display.quality !== 'low');
      active.forEach(function (id) {
        var f = J.fires[id], roof = f.roof, dist = distance(roof, self.player);
        if (f.quality !== LC.Display.quality) self.renderJerebuFire(all.find(function (t) { return t.id === id; }));
        if (f.glow) f.glow.setAlpha(LC.Display.quality === 'low' ? 0.45 : 0.35 + Math.sin(time / 90 + roof.x) * 0.15 + Math.random() * 0.08);
        if (f.light) f.light.img.setVisible(night(self, 18 * 60));
        volume = Math.max(volume, Math.max(0, 1 - dist / 240));
        if (dist < 280) self.jerebuFireParticles(f, dt);
        if (blocked) return;
        f.burnT += dt;
        if (f.burnT >= 4 && !(q.c15soot || {})[id]) {
          (q.c15soot || (q.c15soot = {}))[id] = true;
          self.markJerebuSoot(id); LC.State.save();
        }
        if ((f.growT -= dt) > 0) return;
        f.growT = 25;
        if (f.level < 3) self.raiseJerebu(id);
        else if (id !== C.big.id) {
          var hay = C.small.slice(-2).find(function (t) {
            var other = self.jerebuRoof(t.id);
            return other && distance(roof, other) < 176 && !self.jerebuLevel(t.id) && !(q.c15relit || {})[t.id];
          });
          if (hay) self.relightJerebu(hay.id);
        }
      });
      if (active.length && volume > 0 && (J.soundT -= dt) <= 0) { J.soundT = between(0.3, 0.5); LC.Audio.sfx('fire15', volume); }
      if (s === 3 && active.length && night(this, C.night) && !blocked && (J.rocketT -= dt) <= 0) {
        J.rocketT = between(8, 12);
        var targets = C.small.filter(function (t) { return !J.opening.has(t.id) && !J.flying.has(t.id) &&
          (self.jerebuLevel(t.id) < 3 && (self.jerebuLevel(t.id) || !(q.c15relit || {})[t.id])); });
        if (targets.length && (active.length >= 3 || Math.random() < 0.6)) this.launchJerebuRocket(pick(targets), false);
      }
    },
    jerebuFireParticles: function (f, dt) {
      var J = this.jerebu, roof = f.roof;
      if ((f.smokeT -= dt) <= 0) {
        f.smokeT = 0.25;
        if (!J.smoke) J.smoke = this.add.particles(0, 0, 'smoke', { emitting: false, tint: 0x51474e, maxParticles: 50, speedY: { min: -19, max: -9 },
          speedX: { min: -6, max: 6 }, lifespan: 1100, alpha: { start: 0.55, end: 0 }, scale: { start: 0.5, end: 1.45 } }).setDepth(8988);
        J.smoke.explode(count(f.level > 1 ? 2 : 1), roof.x + between(-10, 10), roof.bounds.y);
      }
      if (LC.Display.quality !== 'low' && (f.emberT -= dt) <= 0) {
        f.emberT = 0.2;
        if (!J.embers) J.embers = this.add.particles(0, 0, 'px', { emitting: false, tint: [0xffb040, 0xff5020], maxParticles: 62,
          gravityY: -30, speed: { min: 10, max: 30 }, lifespan: 900, alpha: { start: 0.9, end: 0 } }).setDepth(8989);
        J.embers.explode(count(3), roof.x, roof.y);
      }
    },
    jerebuSteam: function (x, y, many) {
      var J = this.jerebu;
      if (!J.steam) J.steam = this.add.particles(0, 0, 'stim15', { emitting: false, maxParticles: 36, speedY: { min: -30, max: -10 },
        speedX: { min: -16, max: 16 }, lifespan: 650, alpha: { start: 0.75, end: 0 }, scale: { start: 0.65, end: 1.2 } }).setDepth(9003);
      J.steam.explode(count(many), x, y);
    },
    jerebuWater: function () {
      if (this.S.water <= 0) { this.toast('The gembor is empty. Refill it at the well or the river.', 'i_can'); LC.Audio.sfx('error'); return false; }
      this.S.water--;
      return true;
    },
    jerebuSplash: function (x, y, out) {
      this.fx.drop.explode(10, x, y); this.jerebuSteam(x, y, out ? 10 : 4); LC.Audio.sfx('sizzle15');
      this.ui.floatText(x, y - 10, 'Sssss!', '#e6ffff');
      if (out) this.fx.sparkle.explode(6, x, y);
    },
    douseJerebu: function (id, hits) {
      var level = this.jerebuLevel(id), q = this.S.quests, f = this.jerebu.fires[id];
      if (!level || !f || !f.level) return;
      var hp = q.c15hp || (q.c15hp = {}), left = Math.max(id === C.big.id ? 1 : 0, (hp[id] || level * 2) - hits);
      hp[id] = left;
      if (id === C.big.id) q.c15big = Math.ceil(left / 2);
      else q.c15fires[id] = Math.ceil(left / 2);
      var target = all.find(function (t) { return t.id === id; }), flame = f.flames[f.flames.length - 1];
      if (flame && this.jerebuLevel(id) === level) this.tweens.add({ targets: flame, alpha: 0.25, duration: 120, yoyo: true });
      f.growT = 25;
      this.jerebuSplash(f.roof.x, f.roof.y, !left);
      this.renderJerebuFire(target);
      if (!left) this.toast(target.name + ' is safe!', 'i_can');
      LC.State.save();
    },
    jerebuBucket: function () {
      if (step(this) !== 4) return;
      var self = this, q = this.S.quests;
      this.ui.openJerebuBucket(function (caught) {
        if (step(self) !== 4) return;
        if (self.jerebu.fires[C.big.id]) self.jerebu.fires[C.big.id].growT = 25;
        var level = Math.min(q.c15big, Math.max(1, 3 - Math.floor(caught / 5)));
        if (q.c15big !== level) { q.c15big = level; delete (q.c15hp || {})[C.big.id]; self.renderJerebuFire(C.big); LC.State.save(); }
      }, function (won) {
        if (step(self) !== 4) return;
        if (!won) { self.toast('Try the bucket line again. The villagers are still here.', 'i_can'); return; }
        q.c15big = 0; q.c15calm = {};
        self.advanceJerebu(5);
        var roof = self.jerebuRoof(C.big.id);
        if (roof) self.jerebuSplash(roof.x, roof.y, true);
        self.renderJerebuFire(C.big);
        LC.Audio.sfx('cheer'); self.toast('Tok Penghulu’s house is safe. Help the frightened villagers.', 'i_can');
      });
    },

    createJerebuPeople: function () {
      var self = this, calmed = this.S.quests.c15calm || {};
      this.jerebu.people = C.people.map(function (data, i) {
        var gather = self.tilePx({ x: 14 + i, y: 21 }), home = calmed[data.id] ? gather : self.tilePx(data);
        if (self.blockedAt(home.x, home.y)) home = self.randomFree({ x0: data.x - 2, y0: data.y - 2, x1: data.x + 2, y1: data.y + 2 });
        var spr = self.add.sprite(home.x, home.y, data.tex + '_0').setOrigin(0.5, 1).setDepth(home.y + 0.3);
        var mark = self.add.image(home.x, home.y, 'glow').setDepth(5).setBlendMode(Phaser.BlendModes.ADD).setTint(0xffe8b3).setScale(0.5, 0.26).setVisible(false);
        var table = i === 1 && !calmed[data.id] ? self.add.image(home.x, home.y, 'meja15').setOrigin(0.5, 1).setDepth(home.y + 1) : null;
        return { data: data, spr: spr, mark: mark, table: table, calm: !!calmed[data.id], gather: gather, route: [], turnT: 0,
          gag: i < 2 && !calmed[data.id] ? 2.5 : 0, shoutT: between(1, 4), phase: i * 0.7 };
      });
    },
    jerebuActorRoute: function (spr, goal) {
      var self = this, Wd = this.W, start = Math.floor((spr.y - 3) / T) * Wd + Math.floor(spr.x / T);
      var end = Math.floor((goal.y - 3) / T) * Wd + Math.floor(goal.x / T), queue = [start], prev = new Int32Array(Wd * this.H).fill(-1);
      prev[start] = start;
      for (var i = 0; i < queue.length; i++) {
        var k = queue[i], x = k % Wd, y = Math.floor(k / Wd);
        if (k === end) {
          var route = [];
          for (; k !== start; k = prev[k]) route.push(this.tilePx({ x: k % Wd, y: Math.floor(k / Wd) }));
          return route.reverse();
        }
        Object.keys(directions).forEach(function (dir) {
          var nx = x + directions[dir][0], ny = y + directions[dir][1], n = ny * Wd + nx, p = self.tilePx({ x: nx, y: ny });
          if (nx < 0 || nx >= Wd || ny < 0 || ny >= self.H || prev[n] >= 0 || self.blockedAt(p.x, p.y)) return;
          prev[n] = k; queue.push(n);
        });
      }
      return [];
    },
    updateJerebuPeople: function (time, dt, blocked) {
      var self = this, s = step(this);
      this.jerebu.people.forEach(function (a) {
        var spr = a.spr, near = distance(spr, self.player);
        a.mark.setPosition(spr.x, spr.y - 1).setVisible(s === 5 && !blocked && !a.calm && self.ui.touchOn && LC.tapOn() && near < 42)
          .setAlpha(0.35 + Math.sin(time / 230 + a.phase) * 0.15);
        if (blocked) return;
        if (a.gag > 0) {
          a.gag -= dt;
          spr.setScale(a.data.id === 'bahar' ? 0.9 : 1, a.data.id === 'bahar' ? 0.62 : 1)
            .setOrigin(0.5, a.data.id === 'jusoh' ? 1.85 : 1);
          if (a.gag <= 0) {
            spr.setScale(1).setOrigin(0.5, 1);
            if (a.table) { a.table.destroy(); a.table = null; }
          }
          return;
        }
        var target;
        if (a.calm) {
          while (a.route.length && distance(spr, a.route[0]) < 2) a.route.shift();
          target = a.route[0];
        } else {
          if ((a.turnT -= dt) <= 0 || !a.to || distance(spr, a.to) < 4) {
            var angle = between(0, Math.PI * 2);
            var base = self.tilePx(a.data);
            a.turnT = between(0.6, 1.2);
            a.to = { x: Phaser.Math.Clamp(spr.x + Math.cos(angle) * 48, base.x - 54, base.x + 54),
              y: Phaser.Math.Clamp(spr.y + Math.sin(angle) * 48, base.y - 54, base.y + 54) };
          }
          target = a.to;
          if (near < 145 && (a.shoutT -= dt) <= 0) {
            a.shoutT = between(5, 8); self.ui.floatText(spr.x, spr.y - 22, pick(['!', 'Tolong!']), '#ffdd9b');
          }
        }
        var d = target && distance(spr, target);
        var anim = a.data.tex + (d > 1 ? '_walk' : '_idle');
        if (self.anims.exists(anim)) spr.play(anim, true);
        if (!d || d <= 1) return;
        var scale = Math.min(d, (a.calm ? 48 : 55) * dt) / d, dx = (target.x - spr.x) * scale, dy = (target.y - spr.y) * scale;
        if (!self.blockedAt(spr.x + dx, spr.y)) spr.x += dx;
        if (!self.blockedAt(spr.x, spr.y + dy)) spr.y += dy;
        if (dx) spr.setFlipX(dx < 0);
        spr.setDepth(spr.y + 0.3);
      });
    },
    calmJerebu: function (actor, sung) {
      if (actor.calm || step(this) !== 5) return;
      var q = this.S.quests, spr = actor.spr;
      actor.calm = true; actor.gag = 0; spr.setScale(1).setOrigin(0.5, 1);
      if (actor.table) { actor.table.destroy(); actor.table = null; }
      (q.c15calm || (q.c15calm = {}))[actor.data.id] = true;
      LC.State.save();
      actor.route = this.jerebuActorRoute(spr, actor.gather);
      this.fx.sparkle.explode(5, spr.x, spr.y - 10);
      if (sung) this.toast(X.calm[actor.data.id], 'ic_mayang');
      else this.jerebuLines([[actor.data.id === 'mat' ? 'mat' : actor.data.id === 'zul' ? 'zul' : actor.data.id + '14', X.calm[actor.data.id]]]);
    },

    jerebuFuse: function (o) {
      var q = this.S.quests;
      if (step(this) !== 7 || (q.c15fuses || {})[o.i] || !this.jerebuWater()) return;
      (q.c15fuses || (q.c15fuses = {}))[o.i] = true;
      var p = this.tilePx(o);
      this.jerebuSplash(p.x, p.y - 6, true);
      if (C.doused(this.S) === C.fuses.length) {
        this.jerebu.sad = this.time.now + 5500;
        this.jerebu.mark = null;
        if (this.jerebu.guide) this.jerebu.guide.clear();
        this.advanceJerebu(8); this.jerebuLines(X.bara);
      } else LC.State.save();
    },
    updateJerebuBara: function (time, dt, blocked) {
      var J = this.jerebu, s = step(this), q = this.S.quests, self = this;
      if (this.objImgs.f_sibara15) this.objImgs.f_sibara15.setTexture('sibara15_' + Math.floor(time / 160) % 4);
      if (J.bara && (s === 7 || s === 8)) {
        var sad = J.sad > time;
        J.bara.setTexture(sad ? 'sibara15_sad_' + Math.floor(time / 260) % 2 : 'sibara15_' + Math.floor(time / 160) % 4);
        if (sad && (J.tearT = (J.tearT || 0) - dt) <= 0) { J.tearT = 0.44; this.jerebuSteam(J.bara.x + 4, J.bara.y - 10, 2); }
        if (s === 8 && !sad && this.ghost) {
          var g = this.ghost;
          J.bara.x += (g.x + 12 - J.bara.x) * Math.min(1, dt * 5);
          J.bara.y += (g.y - 2 + Math.sin(time / 260) * 2 - J.bara.y) * Math.min(1, dt * 5);
          J.bara.setDepth(J.bara.y + 2);
        }
      }
      if (this.area !== 'senah' || s !== 7) return;
      C.fuses.forEach(function (_, i) {
        var img = self.objImgs['sn_sumbu15_' + i];
        if (img) img.setTexture((q.c15fuses || {})[i] ? 'sumbu15_out' : 'sumbu15_lit_' + Math.floor(time / 120) % 2);
      });
      if (blocked || !J.bara) return;
      if (J.mark) {
        if ((J.mark.left -= dt) <= 0) {
          var mark = J.mark; J.mark = null; J.guide.clear();
          this.fwRocket(mark.from, mark.to, { small: true, duration: 480, onBurst: function () {
            if (!self.leaving && step(self) === 7 && !busy(self) && distance(self.player, mark.to) < 17) self.jerebuSpill(mark.from);
          } });
        }
      } else if ((J.baraT -= dt) <= 0) {
        J.baraT = 2.2;
        var from = { x: J.bara.x, y: J.bara.y - 6 }, to = { x: this.player.x, y: this.player.y - 4 }, d = distance(from, to);
        J.mark = { from: from, to: to, left: 0.8 };
        if (!J.guide) J.guide = this.add.graphics().setDepth(9010);
        J.guide.clear().lineStyle(2, 0xee5a49, 0.85);
        for (var i = 0; i < d; i += 9) {
          var a = i / d, b = Math.min(1, (i + 5) / d);
          J.guide.lineBetween(from.x + (to.x - from.x) * a, from.y + (to.y - from.y) * a,
            from.x + (to.x - from.x) * b, from.y + (to.y - from.y) * b);
        }
      }
    },
    jerebuSpill: function (from) {
      var p = this.player, d = distance(p, from) || 1, dx = (p.x - from.x) / d * 4, dy = (p.y - from.y) / d * 4;
      for (var i = 0; i < 6; i++) {
        if (!this.blockedAt(p.x + dx, p.y)) p.x += dx;
        if (!this.blockedAt(p.x, p.y + dy)) p.y += dy;
      }
      this.S.water = Math.max(0, this.S.water - 1);
      LC.State.save(); this.fx.drop.explode(6, p.x, p.y - 6); this.toast('Your gembor sloshes!', 'i_can');
    },
    jerebuFinale: function () {
      if (step(this) !== 8) return;
      var S = this.S, q = S.quests, J = this.jerebu;
      q.siBara = 1; q.c15repairDay = S.day; S.kepeng += 1000; S.stats.earned += 1000;
      this.advanceJerebu(9);
      J.rain = { time: 0 };
      this.raining = true; this.refreshRainDrops(); LC.Audio.setRain(true);
      LC.Audio.sfx('thunder11'); this.cameras.main.flash(240, 200, 218, 237, false, uFlash);
      var self = this;
      Object.keys(J.soot).forEach(function (id) {
        J.soot[id].forEach(function (im) { self.tweens.add({ targets: im, alpha: 0.4, duration: 2500 }); });
        var roof = self.jerebuRoof(id);
        if (roof) self.jerebuSteam(roof.x, roof.y, 5);
      });
      all.forEach(function (target) { self.renderJerebuFire(target); });
      this.jerebuLines(X.rain);
    },
    updateJerebuRain: function (dt) {
      this.jerebu.rain.time += dt;
      this.jerebu.haze = Math.max(0, 1 - this.jerebu.rain.time / 3);
    }
  });
  function uFlash(camera, t) { if (camera.flashEffect) camera.flashEffect.alpha = Math.min(camera.flashEffect.alpha, 0.2 * (1 - t)); }
})(window.LC);
