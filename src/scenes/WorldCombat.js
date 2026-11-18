/* World, part 4 (v1.5): combat in Lombong Puaka, the haunted gold mine. Shadows, ghost bats, giant centipedes and the
 * stone guardian hunt you in the dark; hold a weapon and press USE to swing. If your health runs out you faint and
 * wake up at home, a little poorer. Enemies are simulated on each player's own device (co-op friends each fight
 * their own shadows). Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var T = 16;
  var DIRV = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] };
  var LOOT = ['bijih_emas', 'emas', 'kristal'];   // what you drop (half of it) when you faint down there

  Object.assign(LC.WorldScene.prototype, {
    createEnemies: function () {
      var self = this, S = this.S;
      this.enemies = []; this.invuln = 0; this.swingCd = 0;
      (this.A.enemies || []).forEach(function (g) {
        for (var i = 0; i < g.n; i++) {
          if (g.kind === 'penunggu' && S.flags.penunggu === S.day) continue;   // you already beat the guardian today
          self.spawnEnemy(g, true);
        }
      });
    },
    spawnEnemy: function (g, first, e) {
      var D = LC.ENEMIES[g.kind], p = this.randomFree(g.zone);
      if (!e) {
        e = { kind: g.kind, def: D, zone: g.zone, g: g };
        e.spr = this.add.sprite(p.x, p.y, g.kind + '_0').setOrigin(0.5, 1);
        e.spr.play(g.kind + '_walk');
        e.light = this.addLight(p.x, p.y - 8, D.boss ? 0xff7040 : 0xff3050, D.boss ? 0.9 : 0.35, true);
        this.enemies.push(e);
      }
      e.spr.setPosition(p.x, p.y).setVisible(true).setAlpha(first ? 1 : 0).clearTint();
      if (!first) this.tweens.add({ targets: e.spr, alpha: 1, duration: 600 });
      e.hp = D.hp; e.dead = false; e.respawn = 0; e.kx = 0; e.ky = 0; e.hurtT = 0; e.tx = p.x; e.ty = p.y; e.wait = Math.random() * 2; e.ph = Math.random() * 6;
      e.light.base = D.boss ? 0.9 : 0.6;
      return e;
    },

    updateEnemies: function (time, dt, blocked) {
      if (!this.enemies || !this.enemies.length) { if (this.invuln > 0) this.invuln -= dt; return; }
      var self = this, p = this.player, S = this.S;
      this.swingCd = Math.max(0, this.swingCd - dt);
      if (this.invuln > 0) { this.invuln -= dt; p.setAlpha(Math.floor(time / 80) % 2 ? 0.45 : 1); if (this.invuln <= 0) { p.setAlpha(1); p.clearTint(); } }
      this.enemies.forEach(function (e) {
        var D = e.def, s = e.spr;
        if (e.dead) {
          if (e.g.kind === 'penunggu') return;
          e.respawn -= dt;
          if (e.respawn <= 0 && Math.hypot(p.x - s.x, p.y - s.y) > 150) self.spawnEnemy(e.g, false, e);
          return;
        }
        if (blocked || self.leaving || self.sleeping) { e.light.img.setPosition(s.x, s.y - 8); return; }
        var dx = p.x - s.x, dy = (p.y - 4) - (s.y - 4), d = Math.max(0.5, Math.hypot(dx, dy)), vx = 0, vy = 0, sp = D.speed;
        if (d < D.sight) {   // hunt
          vx = dx / d; vy = dy / d;
          if (D.erratic) { vx += Math.sin(time / 180 + e.ph) * 0.9; vy += Math.cos(time / 230 + e.ph) * 0.9; }
        } else {             // drift about
          if (e.wait > 0) e.wait -= dt;
          else {
            var ex = e.tx - s.x, ey = e.ty - s.y, ed = Math.hypot(ex, ey);
            if (ed < 2) { e.wait = 1 + Math.random() * 3; var q = self.randomFree(e.zone); e.tx = q.x; e.ty = q.y; }
            else { vx = ex / ed; vy = ey / ed; sp *= 0.5; }
          }
        }
        var len = Math.hypot(vx, vy) || 1, nx = s.x + (vx / len * sp + e.kx) * dt, ny = s.y + (vy / len * sp + e.ky) * dt;
        e.kx *= Math.pow(0.02, dt); e.ky *= Math.pow(0.02, dt);
        if (!self.solidPx(nx - D.w, s.y - 2) && !self.solidPx(nx + D.w, s.y - 2)) s.x = nx;
        if (!self.solidPx(s.x - D.w, ny - 2) && !self.solidPx(s.x + D.w, ny - 2)) s.y = ny;
        if (Math.abs(vx) > 0.1) s.setFlipX(vx < 0);
        var bob = e.kind === 'bayang' || e.kind === 'kelawar' ? Math.round(Math.sin(time / 260 + e.ph) * 2) : 0;
        s.setDepth(s.y).setY(s.y);
        s.displayOriginY = s.height - bob;
        e.light.img.setPosition(s.x, s.y - s.height / 2);
        if (e.hurtT > 0) { e.hurtT -= dt; if (e.hurtT <= 0) s.clearTint(); }
        if (d < D.w + 7 && self.invuln <= 0) self.playerHurt(D.dmg, e);
      });
    },

    // ---------------------------------------------------------------- your swing
    attack: function () {
      var self = this, S = this.S, sl = LC.State.selItem(), it = sl && LC.ITEMS[sl.id];
      if (!it || it.kind !== 'weapon' || this.swingCd > 0) return;
      this.swingCd = it.cd;
      var p = this.player, d = DIRV[this.dir], cx = p.x + d[0] * 12, cy = p.y - 8 + d[1] * 12;
      LC.Audio.sfx('swing');
      var key = this.dir === 'left' || this.dir === 'right' ? 'slash_right' : 'slash_' + this.dir;
      var sl2 = this.add.image(cx, cy, key).setDepth(p.y + 2).setFlipX(this.dir === 'left').setAlpha(0.95);
      if (sl.id === 'keris' || sl.id === 'trisula') sl2.setTint(sl.id === 'keris' ? 0xffe8a0 : 0x8fe8ff).setBlendMode(Phaser.BlendModes.ADD);
      this.tweens.add({ targets: sl2, alpha: 0, scale: 1.25, duration: 180, onComplete: function () { sl2.destroy(); } });
      this.tweens.add({ targets: p, x: p.x + d[0] * 2, duration: 60, yoyo: true });
      var dmg = it.dmg + Math.floor((S.str || 0) / 25), hit = false;
      this.enemies.forEach(function (e) {
        if (e.dead) return;
        var ex = e.spr.x - p.x, ey = (e.spr.y - e.spr.height / 2) - (p.y - 8), dist = Math.hypot(ex, ey);
        if (dist > it.reach + e.def.w + 4) return;
        if (dist > 10 && (ex * d[0] + ey * d[1]) / dist < 0.15) return;   // only what is in front of you
        hit = true;
        e.hp -= dmg; e.hurtT = 0.15; e.spr.setTint(0xff8080);
        var k = e.def.boss ? 60 : 170; e.kx = (ex / (dist || 1)) * k; e.ky = (ey / (dist || 1)) * k;
        self.fx.sparkle.explode(5, e.spr.x, e.spr.y - e.spr.height / 2);
        if (e.hp <= 0) self.enemyDie(e);
      });
      if (hit) { LC.Audio.sfx('hit'); this.cameras.main.shake(70, 0.002); }
    },
    enemyDie: function (e) {
      var self = this, S = this.S, D = e.def, s = e.spr, got = [];
      e.dead = true; e.respawn = 25 + Math.random() * 15;
      LC.Audio.sfx('poof');
      this.fx.smoke.explode(D.boss ? 24 : 10, s.x, s.y - s.height / 2);
      this.fx.sparkle.explode(D.boss ? 30 : 6, s.x, s.y - s.height / 2);
      this.tweens.add({ targets: s, alpha: 0, scaleY: 0.2, duration: 300, onComplete: function () { s.setVisible(false).setScale(1); } });
      e.light.base = 0;
      S.stats.kills = (S.stats.kills || 0) + 1;
      D.drop.forEach(function (dr) {
        if (Math.random() > dr[1]) return;
        var n = dr[2] + Math.floor(Math.random() * (dr[3] - dr[2] + 1));
        if (dr[0] === 'kepeng') { S.kepeng += n; got.push(n + ' kepeng'); }
        else if (LC.State.add(dr[0], n)) got.push(n + ' ' + LC.ITEMS[dr[0]].name);
      });
      if (D.boss) {
        S.flags.penunggu = S.day;
        this.doShared('kind', { n: 8 }, function () {});
        this.cameras.main.flash(500, 255, 220, 180);
        this.ui.say([{ text: 'The stone guardian shudders, cracks... and crumbles into a heap of glittering rubble. The air in the mine feels lighter.' },
          { name: 'Pelita', portrait: 'ghost', expr: 'happy', text: '(Pelita glows proudly. You were very brave.)' + (got.length ? ' You found ' + got.join(' and ') + '!' : '') }]);
        return;
      }
      this.toast('The ' + D.name + ' fades away into the dark.' + (got.length ? ' You found ' + got.join(' and ') + '.' : ''), got.length ? 'i_bijih_emas' : 'ic_moon');
    },

    // ---------------------------------------------------------------- getting hurt
    playerHurt: function (dmg, e) {
      var S = this.S, p = this.player;
      S.hp = Math.max(0, S.hp - dmg);
      this.invuln = 0.9;
      LC.Audio.sfx('hurt');
      p.setTint(0xff7070);
      this.cameras.main.shake(140, 0.005);
      var dx = p.x - e.spr.x, dy = p.y - e.spr.y, d = Math.hypot(dx, dy) || 1;
      for (var k = 0; k < 4; k++) { var nx = p.x + dx / d * 4, ny = p.y + dy / d * 4; if (!this.blockedAt(nx, p.y)) p.x = nx; if (!this.blockedAt(p.x, ny)) p.y = ny; }
      if (S.hp <= 0) this.faint();
      else if (S.hp < S.maxHp * 0.3 && !this.lowHpWarned) { this.lowHpWarned = true; this.toast('You are badly hurt! Eat something (X) to heal, or get out of the mine.', 'ic_hp'); }
    },
    faint: function () {
      if (this.leaving) return;
      var S = this.S, lost = [];
      LOOT.forEach(function (id) { var n = Math.floor(LC.State.count(id) / 2); if (n > 0) { LC.State.remove(id, n); lost.push(n + ' ' + LC.ITEMS[id].name); } });
      S.hp = Math.ceil(S.maxHp * 0.5);
      S.energy = Math.max(10, Math.round(S.energy * 0.6));
      if (!LC.Net.active()) S.minutes = Math.min(LC.DAY_END - 30, S.minutes + 60);
      this.player.clearTint().setAlpha(1);
      LC.Audio.sfx('sad');
      this.goArea('farm', this.homeSpot(LC.Net.isGuest() ? this.pc : 0), 'down', { knocked: lost.length ? 'You dropped ' + lost.join(' and ') + ' in the dark.' : 'Luckily you did not drop anything.' });
    }
  });
})(window.LC);
