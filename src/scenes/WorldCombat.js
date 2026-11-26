/* World, part 4: combat. v1.5 brought the shadows of Lombong Puaka; v1.6 lets wild creatures roam the forest, the
 * island, the mountain, the dunes, the reef and the sunken junk (some only at night), and adds:
 *  - telegraphed attacks: an enemy shivers and flashes before it lunges, so you can step away or strike first
 *  - battle animations: your weapon sweeps through the air, sparks and damage numbers fly, foes flash and recoil
 *  - battle music that rises when something hunts you and fades when the fight is over
 *  - Sumpahan Batu (V): Si Tanggang's stone curse freezes nearby enemies for a few seconds
 *  - Restu Ibu: once a day, Mak Deruma's prayer saves you from fainting
 * Hold a weapon (or, in a pinch, the cangkul) and press USE to strike or shoot. If your health runs out you faint and wake up
 * at home. Enemies are simulated on each player's own device (co-op friends each fight their own). */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var DIRV = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] }, TILE = 16;
  var ANG = { right: 0, down: 90, left: 180, up: -90 };
  var LOOT = ['bijih_emas', 'emas', 'kristal'];   // what you drop (half of it) when you faint
  var HOE = { name: 'Cangkul', dmg: 1, reach: 17, cd: 0.55, icon: 'i_hoe', improvised: true };
  function isNight(S) { return S.minutes >= 19 * 60 || S.minutes < 6 * 60; }

  Object.assign(LC.WorldScene.prototype, {
    createEnemies: function () {
      var self = this, S = this.S;
      this.enemies = []; this.invuln = 0; this.swingCd = 0; this.battleT = 0; this.hitStop = 0; this.groupCheck = 0;
      this.weaponShots = [];
      var groups = this.areaLayout ? this.areaLayout.enemies : this.A.enemies;
      (groups || []).forEach(function (g) {
        for (var i = 0; i < g.n; i++) self.spawnEnemy(g, true);
      });
      this.events.once('shutdown', function () { LC.Audio.setBattle(false); });
    },
    groupOn: function (g) {
      var S = this.S;
      if (g.kind === 'penunggu' && S.flags.penunggu === S.day) return false;   // you already beat the guardian today
      if (g.escort) return !!S.escort;
      if (g.night) return isNight(S);
      return true;
    },
    spawnEnemy: function (g, first, e) {
      var D = LC.ENEMIES[g.kind], p = g.fixed ? this.tilePx(g.fixed) : this.randomFree(g.zone), pl = this.player;
      for (var k = 0; k < 8 && !g.fixed && !first && Math.hypot(p.x - pl.x, p.y - pl.y) < 110; k++) p = this.randomFree(g.zone);
      if (!e) {
        var texture = D.texture || g.kind;
        e = { kind: g.kind, def: D, zone: g.zone, g: g };
        e.spr = this.add.sprite(p.x, p.y, texture + '_0').setOrigin(0.5, 1);
        e.spr.play(texture + '_walk');
        e.light = this.addLight(p.x, p.y - 8, D.boss ? 0xff7040 : g.kind === 'obor' ? 0xff9050 : 0xff3050, D.boss ? 0.9 : 0.35, true);
        this.enemies.push(e);
      }
      var on = this.groupOn(g);
      e.spr.setPosition(p.x, p.y).setDepth(p.y).setVisible(on).setAlpha(first ? 1 : 0).clearTint().setScale(1);
      if (e.spr.anims.isPaused) e.spr.anims.resume();
      if (!first && on) this.tweens.add({ targets: e.spr, alpha: 1, duration: 600 });
      e.hp = D.hp; e.dead = false; e.away = !on; e.respawn = 0; e.kx = 0; e.ky = 0; e.hurtT = 0; e.tx = p.x; e.ty = p.y; e.wait = Math.random() * 2; e.ph = Math.random() * 6;
      e.windT = 0; e.strikeT = 0; e.restT = 0; e.stoneT = 0; e.atkCd = 0.6 + Math.random();
      e.staggerT = 0; e.slowT = 0;
      e.light.base = on ? (D.boss ? 0.9 : 0.6) : 0;
      return e;
    },
    // the creatures of the night melt away at dawn (and come back after dark); escort shadows only chase Si Tanggang
    checkGroups: function () {
      var self = this;
      this.enemies.forEach(function (e) {
        if (e.dead) return;
        var on = self.groupOn(e.g);
        if (on && e.away) self.spawnEnemy(e.g, false, e);
        else if (!on && !e.away) {
          e.away = true; e.light.base = 0; e.stoneT = 0;
          self.fx.smoke.explode(6, e.spr.x, e.spr.y - e.spr.height / 2);
          self.tweens.add({ targets: e.spr, alpha: 0, duration: 700, onComplete: function () { if (e.away) e.spr.setVisible(false); } });
        }
      });
    },
    hasEnemies: function () { return !!(this.enemies && this.enemies.some(function (e) { return !e.dead && !e.away; })); },
    enemyNear: function (r) {
      var p = this.player;
      return !!(this.enemies && this.enemies.some(function (e) { return !e.dead && !e.away && Math.hypot(e.spr.x - p.x, e.spr.y - p.y) < r; }));
    },
    weaponOf: function (sl) {
      if (!sl) return null;
      var it = LC.ITEMS[sl.id];
      if (it && it.kind === 'weapon') return it;
      return sl.id === 'hoe' ? HOE : null;
    },

    updateEnemies: function (time, dt, blocked) {
      var self = this, p = this.player, S = this.S;
      if (this.invuln > 0) { this.invuln -= dt; p.setAlpha(Math.floor(time / 80) % 2 ? 0.45 : 1); if (this.invuln <= 0) { p.setAlpha(1); p.clearTint(); } }
      this.swingCd = Math.max(0, this.swingCd - dt);
      if (!blocked && !this.leaving && !this.sleeping) this.updateWeaponShots(dt);
      if (!this.enemies || !this.enemies.length) return;
      if ((this.groupCheck -= dt) <= 0) { this.groupCheck = 1; this.checkGroups(); }
      if (this.hitStop > 0) { this.hitStop -= dt; return; }   // a tiny freeze when a blow lands
      var fighting = false, boss = false;
      this.enemies.forEach(function (e) {
        var D = e.def, s = e.spr;
        if (e.dead) {
          if (e.g.kind === 'penunggu') return;
          e.respawn -= dt;
          if (e.respawn <= 0 && Math.hypot(p.x - s.x, p.y - s.y) > 150) self.spawnEnemy(e.g, false, e);
          return;
        }
        if (e.away) return;
        var dx = p.x - s.x, dy = (p.y - 4) - (s.y - 4), d = Math.max(0.5, Math.hypot(dx, dy));
        if (d < D.sight + 10) { fighting = true; if (D.boss) boss = true; }
        if (e.hurtT > 0) { e.hurtT -= dt; if (e.hurtT <= 0) { if (e.stoneT > 0) s.setTint(0x9a96a0); else s.clearTint(); } }
        if (blocked || self.leaving || self.sleeping) { e.light.img.setPosition(s.x, s.y - 8); return; }
        if (e.stoneT > 0) {   // turned to stone: still as a statue
          e.stoneT -= dt;
          if (e.stoneT <= 0) self.unstone(e);
          return;
        }
        if (e.g.fixed) return;
        var vx = 0, vy = 0, sp = D.speed, mv = true;
        e.atkCd -= dt;
        if (e.staggerT > 0) {
          e.staggerT -= dt;
          mv = false;
        } else if (e.windT > 0) {     // the wind-up: shiver and flash, then lunge
          e.windT -= dt; mv = false;
          s.x += Math.sin(time / 22) * 0.6;
          if (Math.floor(time / 70) % 2) s.setTintFill(0xffe0e0); else if (e.hurtT <= 0) s.clearTint();
          if (e.windT <= 0) {
            if (e.hurtT <= 0) s.clearTint();
            e.strikeT = D.charge ? 0.5 : D.boss ? 0.32 : 0.2; e.sdx = dx / d; e.sdy = dy / d;
          }
        } else if (e.strikeT > 0) {   // the lunge
          e.strikeT -= dt; vx = e.sdx; vy = e.sdy; sp = D.speed * (D.charge ? 5.2 : D.boss ? 3 : 3.6);
          if (d < D.w + 7 && self.invuln <= 0) { self.playerHurt(D.dmg, e); e.strikeT = 0; }
          if (e.strikeT <= 0) { e.restT = 0.7 + Math.random() * 0.5; e.atkCd = D.boss ? 1.6 : 1 + Math.random() * 0.6; }
        } else if (e.restT > 0) {     // catch its breath, backing off a little
          e.restT -= dt; vx = -dx / d * 0.5; vy = -dy / d * 0.5; sp = D.speed * 0.6;
        } else if (d < D.sight) {     // hunt
          vx = dx / d; vy = dy / d;
          if (D.erratic) { vx += Math.sin(time / 180 + e.ph) * 0.9; vy += Math.cos(time / 230 + e.ph) * 0.9; }
          if (D.side) vy *= 0.45;
          var range = D.charge ? 72 : D.w + (D.boss ? 22 : 16);
          if (d < range && e.atkCd <= 0 && (!D.charge || d > 20)) {
            e.windT = D.charge ? 0.55 : D.boss ? 0.6 : 0.32; mv = false;
            if (d < 120) LC.Audio.sfx('lunge');
          }
        } else {                      // drift about
          sp *= 0.5;
          if (e.wait > 0) e.wait -= dt;
          else {
            var ex = e.tx - s.x, ey = e.ty - s.y, ed = Math.hypot(ex, ey);
            if (ed < 2) { e.wait = 1 + Math.random() * 3; var q = self.randomFree(e.zone); e.tx = q.x; e.ty = q.y; }
            else { vx = ex / ed; vy = ey / ed; }
          }
        }
        if (!mv) { vx = 0; vy = 0; }
        if (e.slowT > 0) { e.slowT -= dt; sp *= 0.55; }
        var len = Math.hypot(vx, vy) || 1, nx = s.x + (vx / len * sp * (vx || vy ? 1 : 0) + e.kx) * dt, ny = s.y + (vy / len * sp * (vx || vy ? 1 : 0) + e.ky) * dt;
        e.kx *= Math.pow(0.02, dt); e.ky *= Math.pow(0.02, dt);
        if (!self.solidPx(nx - D.w, s.y - 2) && !self.solidPx(nx + D.w, s.y - 2)) s.x = nx;
        if (!self.solidPx(s.x - D.w, ny - 2) && !self.solidPx(s.x + D.w, ny - 2)) s.y = ny;
        if (Math.abs(vx) > 0.1 && e.windT <= 0) s.setFlipX(vx < 0);
        else if (e.windT > 0) s.setFlipX(dx < 0);
        var bob = D.floaty || e.kind === 'bayang' || e.kind === 'kelawar' ? Math.round(Math.sin(time / 260 + e.ph) * 2) : 0;
        s.setDepth(s.y);
        s.displayOriginY = s.height - bob;
        e.light.img.setPosition(s.x, s.y - s.height / 2);
      });
      // battle music: on while something is hunting you, and for a few seconds after
      if (fighting) this.battleT = 4; else this.battleT -= dt;
      LC.Audio.setBattle(this.battleT > 0 && !this.sleeping, boss);
    },

    // ---------------------------------------------------------------- your swing
    attack: function (aim) {
      var self = this, sl = LC.State.selItem(), wp = this.weaponOf(sl);
      if (!wp || this.swingCd > 0) return;
      this.swingCd = wp.cd;
      if (wp.ranged) { this.fireWeapon(wp, aim); return; }
      var p = this.player, d = DIRV[this.dir], cx = p.x + d[0] * 12, cy = p.y - 8 + d[1] * 12, keris = sl.id === 'keris';
      var wide = wp.arc !== undefined, arcLimit = wide ? wp.arc : 0.15, sweep = wide ? 100 : 70;
      LC.Audio.sfx('swing');
      // the weapon itself sweeps through an arc in front of you...
      var ang = ANG[this.dir], turn = this.dir === 'left' || this.dir === 'up' ? sweep : -sweep;
      var from = ang + turn, to = ang - turn, off = keris ? 90 : 45;
      var wImg = this.add.image(p.x + d[0] * 3, p.y - 9, wp.icon || LC.ITEMS[sl.id].icon).setOrigin(keris ? 0.5 : 0.15, keris ? 0.92 : 0.85).setScale(0.85)
        .setDepth(this.dir === 'up' ? p.y - 1 : p.y + 1).setAngle(from + off).setFlipX(false);
      this.tweens.add({ targets: wImg, angle: to + off, duration: 130, ease: 'Quad.easeOut', onComplete: function () {
        self.tweens.add({ targets: wImg, alpha: 0, duration: 90, onComplete: function () { wImg.destroy(); } });
      } });
      // ...trailing a bright arc
      var key = this.dir === 'left' || this.dir === 'right' ? 'slash_right' : 'slash_' + this.dir;
      var arc = this.add.image(cx, cy, key).setDepth(p.y + 2).setFlipX(this.dir === 'left').setAlpha(0.95);
      if (wp.slashColor || keris || sl.id === 'trisula') arc.setTint(wp.slashColor || (keris ? 0xffe8a0 : 0x8fe8ff)).setBlendMode(Phaser.BlendModes.ADD);
      if (wide) arc.setScale(1.2);
      this.tweens.add({ targets: arc, alpha: 0, scale: wide ? 1.65 : 1.25, duration: 180, onComplete: function () { arc.destroy(); } });
      this.tweens.add({ targets: p, x: p.x + d[0] * 2, y: p.y + d[1] * 2, scaleY: 0.92, duration: 60, yoyo: true });
      var dmg = LC.State.weaponDamage(wp), hit = false;
      this.enemies.forEach(function (e) {
        if (e.dead || e.away) return;
        var ex = e.spr.x - p.x, ey = (e.spr.y - e.spr.height / 2) - (p.y - 8), dist = Math.hypot(ex, ey);
        if (dist > wp.reach + e.def.w + 4) return;
        if (dist > 10 && (ex * d[0] + ey * d[1]) / dist < arcLimit) return;
        hit = true;
        var stone = e.stoneT > 0, n = stone ? dmg * 2 : dmg;
        var stagger = !stone && wp.stagger && !e.def.boss && !e.g.fixed;
        e.hp -= n; e.hurtT = 0.1; e.spr.setTintFill(0xffffff);
        if (!stone) {
          var k = (e.def.boss ? 60 : 170) * (wp.shove || 1);
          e.kx = (ex / (dist || 1)) * k; e.ky = (ey / (dist || 1)) * k; e.windT = 0;
        }
        if (stagger) { e.staggerT = wp.stagger; e.strikeT = 0; }
        var hx = e.spr.x - ex / (dist || 1) * 4, hy = e.spr.y - e.spr.height / 2;
        var spark = self.add.image(hx, hy, 'hitfx').setDepth(9600).setBlendMode(Phaser.BlendModes.ADD).setScale(0.4).setAngle(Math.random() * 90);
        self.tweens.add({ targets: spark, scale: 1.1, alpha: 0, duration: 170, onComplete: function () { spark.destroy(); } });
        self.fx.sparkle.explode(stone ? 3 : 5, hx, hy);
        if (stone) self.fx.pebble.explode(6, hx, hy);
        self.ui.floatText(e.spr.x, e.spr.y - e.spr.height - 2, (stone ? 'CRACK! ' : stagger ? 'Stagger! ' : '') + n, stone ? '#cfd8ff' : '#fff2b0');
        if (e.hp <= 0) self.enemyDie(e);
      });
      if (hit) { LC.Audio.sfx('hit'); this.cameras.main.shake(70, 0.002); this.hitStop = 0.05; }
    },
    fireWeapon: function (wp, aim) {
      var p = this.player, d = DIRV[this.dir] || DIRV.down;
      var dx = d[0], dy = d[1];
      if (aim && Math.hypot(aim.x - p.x, aim.y - (p.y - 10)) > 1) {
        var a = Math.atan2(aim.y - (p.y - 10), aim.x - p.x);
        dx = Math.cos(a); dy = Math.sin(a);
      }
      var x = p.x + dx * 8, y = p.y - 10 + dy * 4;
      var im = this.add.image(x, y, wp.shot).setDepth(9500).setRotation(Math.atan2(dy, dx));
      this.weaponShots.push({ img: im, dx: dx, dy: dy, left: wp.range, wp: wp, targets: new Set(), hits: wp.hits || 1 });
      LC.Audio.sfx(wp.shotSound || 'throw');
      this.fx.smoke.explode(2, x, y);
      this.tweens.add({ targets: p, x: p.x - dx * 2, y: p.y - dy * 2, duration: 50, yoyo: true });
    },
    updateWeaponShots: function (dt) {
      var shots = this.weaponShots;
      for (var i = shots.length - 1; i >= 0; i--) {
        var shot = shots[i];
        if (this.advanceWeaponShot(shot, dt)) continue;
        shots.splice(i, 1);
        shot.img.destroy();
      }
    },
    advanceWeaponShot: function (shot, dt) {
      var im = shot.img, distance = Math.min(shot.left, shot.wp.speed * dt);
      shot.left -= distance;
      // Sweep in small steps so a fast arrow cannot skip a wall or an enemy between frames.
      while (distance > 0) {
        var step = Math.min(4, distance);
        distance -= step;
        im.x += shot.dx * step; im.y += shot.dy * step;
        var tx = Math.floor(im.x / TILE), ty = Math.floor((im.y + 9) / TILE);
        if (tx < 0 || ty < 0 || tx >= this.W || ty >= this.H) return false;
        if (this.solid[ty][tx] && (this.objAt[ty][tx] || !LC.WATER_TILES[this.grid[ty][tx]])) {
          this.fx.pebble.explode(3, im.x, im.y);
          return false;
        }
        var enemy = this.enemies.find(function (e) {
          return !e.dead && !e.away && !shot.targets.has(e) &&
            Math.hypot(e.spr.x - im.x, e.spr.y - e.spr.height / 2 - im.y) < e.def.w + 6;
        });
        if (enemy) {
          shot.targets.add(enemy);
          this.weaponShotHit(enemy, shot);
          if (--shot.hits === 0) return false;
        }
      }
      return shot.left > 0;
    },
    weaponShotHit: function (e, shot) {
      var stone = e.stoneT > 0, dmg = LC.State.weaponDamage(shot.wp), n = stone ? dmg * 2 : dmg;
      var slow = !stone && shot.wp.slow && !e.def.boss && !e.g.fixed;
      e.hp -= n; e.hurtT = 0.1; e.spr.setTintFill(0xffffff);
      if (!stone) {
        var k = e.def.boss ? 30 : 90;
        e.kx = shot.dx * k; e.ky = shot.dy * k; e.windT = 0;
      }
      var hx = shot.img.x, hy = shot.img.y;
      if (slow) { e.slowT = shot.wp.slow; this.shockwave(hx, hy, 18, 0xffbd78); }
      var spark = this.add.image(hx, hy, 'hitfx').setDepth(9600).setBlendMode(Phaser.BlendModes.ADD).setScale(0.3).setAngle(Math.random() * 90);
      this.tweens.add({ targets: spark, scale: 0.9, alpha: 0, duration: 150, onComplete: function () { spark.destroy(); } });
      this.fx.sparkle.explode(stone ? 3 : 4, hx, hy);
      this.ui.floatText(e.spr.x, e.spr.y - e.spr.height - 2, (stone ? 'CRACK! ' : slow ? 'Slow! ' : '') + n, stone ? '#cfd8ff' : '#fff2b0');
      LC.Audio.sfx('hit'); this.hitStop = 0.03;
      if (e.hp <= 0) this.enemyDie(e);
    },
    enemyDie: function (e) {
      var self = this, S = this.S, D = e.def, s = e.spr, got = [], icon = null;
      e.dead = true; e.respawn = 25 + Math.random() * 15; e.stoneT = 0;
      if (s.anims.isPaused) s.anims.resume();
      LC.Audio.sfx('poof');
      this.fx.smoke.explode(D.boss ? 24 : 10, s.x, s.y - s.height / 2);
      this.fx.sparkle.explode(D.boss ? 30 : 6, s.x, s.y - s.height / 2);
      s.setTintFill(0xffffff);
      this.tweens.add({ targets: s, alpha: 0, scaleY: 0.2, scaleX: 1.3, duration: 300, onComplete: function () { s.setVisible(false).setScale(1).clearTint(); } });
      e.light.base = 0;
      S.stats.kills = (S.stats.kills || 0) + 1;
      D.drop.forEach(function (dr) {
        if (Math.random() > dr[1]) return;
        var n = dr[2] + Math.floor(Math.random() * (dr[3] - dr[2] + 1));
        if (dr[0] === 'kepeng') { S.kepeng += n; got.push(n + ' kepeng'); icon = icon || 'i_kepeng'; }
        else if (LC.State.add(dr[0], n)) { got.push(n + ' ' + LC.ITEMS[dr[0]].name); icon = icon || LC.ITEMS[dr[0]].icon; }
      });
      if (D.boss) {
        S.flags.penunggu = S.day;
        this.doShared('kind', { n: 8 }, function () {});
        this.cameras.main.flash(500, 255, 220, 180);
        this.ui.say([{ text: 'The stone guardian shudders, cracks... and crumbles into a heap of glittering rubble. The air in the mine feels lighter.' },
          { name: 'Pelita', portrait: 'ghost', expr: 'happy', text: '(Pelita glows proudly. You were very brave.)' + (got.length ? ' You found ' + got.join(' and ') + '!' : '') }]);
        return;
      }
      var sky = this.A.cave || this.A.underwater ? 'dark' : 'wild';
      this.toast('The ' + D.name + (sky === 'dark' || e.kind === 'bayang' ? ' fades away into the dark.' : ' flees into the ' + (this.A.underwater ? 'deep.' : 'wild.')) + (got.length ? ' You found ' + got.join(' and ') + '.' : ''), icon || 'ic_moon');
    },

    // ---------------------------------------------------------------- Sumpahan Batu: the stone curse (V)
    stoneLeft: function () { return Math.max(0, ((LC.stoneReadyAt || 0) - Date.now()) / 1000); },
    castStone: function () {
      var self = this, p = this.player;
      if (!LC.hasStone() || this.sleeping || this.leaving) return;
      var restu = LC.hasRestu(), C = restu ? LC.RESTU : LC.STONE, left = this.stoneLeft();
      if (left > 0) { this.toast('The stone curse is still gathering... (' + Math.ceil(left) + 's)', 'ic_batu'); LC.Audio.sfx('error'); return; }
      var hits = (this.enemies || []).filter(function (e) { return !e.dead && !e.away && Math.hypot(e.spr.x - p.x, e.spr.y - p.y) < C.r; });
      var hantu = this.hantuInRange(C.r);   // v1.7: it holds the slippery river hantu still, too
      if (!hits.length && !hantu) { this.toast('Sumpahan Batu needs an enemy close by.', 'ic_batu'); LC.Audio.sfx('error'); return; }
      if (hantu) this.stoneHantu(C.dur + 2);
      LC.stoneReadyAt = Date.now() + C.cd * 1000;
      LC.Audio.sfx('stone');
      this.shockwave(p.x, p.y - 8, C.r, 0x9ad8ff);
      this.cameras.main.shake(160, 0.003);
      this.ui.floatText(p.x, p.y - 26, 'Sumpahan Batu!', '#bfe6ff');
      hits.forEach(function (e, i) { self.time.delayedCall(40 + i * 50, function () { if (!e.dead) self.stoneEnemy(e, e.def.boss ? LC.STONE.bossDur * (restu ? 1.6 : 1) : C.dur); }); });
    },
    shockwave: function (x, y, r, tint) {   // a crisp ring rippling outwards
      var g = this.add.graphics().setDepth(9600).setBlendMode(Phaser.BlendModes.ADD), o = { t: 0 };
      this.tweens.add({ targets: o, t: 1, duration: 520, ease: 'Quad.easeOut',
        onUpdate: function () { g.clear(); g.lineStyle(2, tint, 0.9 * (1 - o.t)); g.strokeCircle(x, y, 6 + (r - 6) * o.t); g.lineStyle(1, 0xffffff, 0.6 * (1 - o.t)); g.strokeCircle(x, y, Math.max(2, (r - 6) * o.t - 6)); },
        onComplete: function () { g.destroy(); } });
    },
    stoneEnemy: function (e, dur) {
      var s = e.spr;
      e.stoneT = dur; e.windT = 0; e.strikeT = 0; e.kx = 0; e.ky = 0;
      s.anims.pause(); s.setTintFill(0xffffff);
      e.hurtT = 0.08;   // a white flash, then stone grey
      this.fx.pebble.explode(8, s.x, s.y - s.height / 2);
      this.tweens.add({ targets: s, scaleX: 1.08, scaleY: 0.94, duration: 90, yoyo: true });
      e.light.base = 0.15;
    },
    unstone: function (e) {
      var s = e.spr;
      e.stoneT = 0; s.anims.resume(); s.clearTint();
      e.light.base = e.def.boss ? 0.9 : 0.6; e.atkCd = 0.8;
      this.fx.pebble.explode(10, s.x, s.y - s.height / 2);
      if (Math.hypot(s.x - this.player.x, s.y - this.player.y) < 160) LC.Audio.sfx('crumble');
    },

    // ---------------------------------------------------------------- getting hurt
    playerHurt: function (dmg, e) {
      var S = this.S, p = this.player;
      if (this.invuln > 0 || this.leaving || this.sleeping) return;
      S.hp = Math.max(0, S.hp - dmg);
      this.invuln = 0.9;
      LC.Audio.sfx('hurt');
      p.setTint(0xff7070);
      this.cameras.main.shake(140, 0.005);
      this.ui.hurtFlash();
      this.ui.floatText(p.x, p.y - 22, '-' + dmg, '#ff8a8a');
      var dx = p.x - e.spr.x, dy = p.y - e.spr.y, d = Math.hypot(dx, dy) || 1;
      for (var k = 0; k < 4; k++) { var nx = p.x + dx / d * 4, ny = p.y + dy / d * 4; if (!this.blockedAt(nx, p.y)) p.x = nx; if (!this.blockedAt(p.x, ny)) p.y = ny; }
      if (S.hp <= 0) {
        if (LC.hasRestu() && S.restuDay !== S.day) this.restuSave();
        else this.faint();
      } else if (S.hp < S.maxHp * 0.3 && !this.lowHpWarned) { this.lowHpWarned = true; this.toast('You are badly hurt! Eat something (X) to heal, or get away to safety.', 'ic_hp'); }
    },
    // Restu Ibu: once a day, a mother's prayer lifts you up again
    restuSave: function () {
      var self = this, S = this.S, p = this.player;
      S.restuDay = S.day; S.hp = S.maxHp; this.invuln = 2.5;
      LC.Audio.sfx('restu');
      p.clearTint();
      var col = this.add.image(p.x, p.y - 20, 'glow').setDepth(9601).setTint(0xffd166).setBlendMode(Phaser.BlendModes.ADD).setScale(0.6, 3).setAlpha(0);
      this.tweens.add({ targets: col, alpha: 0.9, duration: 220, yoyo: true, hold: 500, onComplete: function () { col.destroy(); } });
      this.fx.sparkle.explode(30, p.x, p.y - 10); this.fx.heart.explode(5, p.x, p.y - 14);
      this.shockwave(p.x, p.y - 8, LC.RESTU.r, 0xffd166);
      this.cameras.main.flash(350, 255, 230, 170);
      (this.enemies || []).forEach(function (e) { if (!e.dead && !e.away && Math.hypot(e.spr.x - p.x, e.spr.y - p.y) < LC.RESTU.r) self.stoneEnemy(e, LC.RESTU.dur); });
      this.ui.floatText(p.x, p.y - 28, 'Restu Ibu!', '#ffe08a');
      this.toast('Restu Ibu! Mak Deruma\'s prayer lifts you up, fully healed. (Once a day.)', 'ic_restu');
    },
    faint: function () {
      if (this.leaving) return;
      var S = this.S, lost = [], escort = !!S.escort, buddy = LC.badangBuddy();
      LOOT.forEach(function (id) { var n = Math.floor(LC.State.count(id) / 2); if (n > 0) { LC.State.remove(id, n); lost.push(n + ' ' + LC.ITEMS[id].name); } });
      S.hp = Math.ceil(S.maxHp * 0.5);
      S.energy = Math.max(10, Math.round(S.energy * 0.6));
      S.escort = null; S.buddy = null;
      if (!LC.Net.active()) S.minutes = Math.min(LC.DAY_END - 30, S.minutes + 60);
      this.player.clearTint().setAlpha(1);
      LC.Audio.sfx('sad');
      LC.Audio.setBattle(false);
      var msg = lost.length ? 'You dropped ' + lost.join(' and ') + ' in the struggle.' : 'Luckily you did not drop anything.';
      this.goArea('farm', this.homeSpot(LC.Net.isGuest() ? this.pc : 0), 'down', { knocked: msg + (escort ? ' ' + LC.TANGGANG.lost : ''), carried: buddy });
    }
  });
})(window.LC);
