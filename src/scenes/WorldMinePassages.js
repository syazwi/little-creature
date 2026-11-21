/* Laluan Gema: seasonal mining, the Echo Forge, and Sang Kelembai's voice. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';

  var proto = LC.WorldScene.prototype, M = LC.MINE_PASSAGES, T = 16;
  var BOSS = 'sang_kelembai', ECHO = 'batu_gema';
  var ENTRANCE = LC.AREAS[M.id];

  var createEnemies = proto.createEnemies;
  proto.createEnemies = function () {
    this.echoMine = this.area === M.id ? {
      run: LC.mineRun(this.S, this.areaLayout), phase: 'wait', timer: 1.5, frozen: 0
    } : null;
    createEnemies.apply(this, arguments);
    if (!this.echoMine) return;
    var self = this, mine = this.echoMine;
    mine.boss = this.enemies.find(function (e) { return e.kind === BOSS; });
    mine.fx = this.add.graphics().setDepth(9602);
    this.objects.forEach(function (o) {
      if (o.type === 'mine_deposit') self.tintMineDeposit(o);
    });
  };

  var groupOn = proto.groupOn;
  proto.groupOn = function (g) {
    if (g.kind === BOSS) return !!(this.echoMine.run && !this.echoMine.run.won);
    return groupOn.call(this, g);
  };

  var enemyDie = proto.enemyDie;
  proto.enemyDie = function (e) {
    if (e.kind === BOSS) return this.calmKelembai(e);
    return enemyDie.call(this, e);
  };

  var objectAction = proto.objectAction;
  proto.objectAction = function (o) {
    var self = this;
    switch (o.type) {
      case 'mine_passage': return { label: 'Enter Laluan Gema', fn: function () {
        LC.Audio.sfx('gate');
        self.goArea(M.id, self.tilePx(ENTRANCE.home), 'up');
      } };
      case 'mine_deposit': {
        var ready = this.mineDepositLeft(o);
        return { label: ready ? (o.hidden ? 'Mine the hidden seam' : 'Mine the deposit') : 'Examine the spent deposit',
          work: ready, fn: function () { self.mineDeposit(o); } };
      }
      case 'mine_anvil': return { label: 'Use the Echo Forge', fn: function () { self.openEchoForge(); } };
      case 'mine_bed': return { label: 'Rest at the Laluan Gema camp', fn: function () {
        self.ui.confirmSleep({ area: M.id, x: o.x + 0.5, y: o.y + 1, name: 'the Laluan Gema camp' });
      } };
      case 'mine_merchant': return { label: 'Shop at the travelling merchant', fn: function () { self.openMineMerchant(o); } };
      case 'mine_cache': return { label: 'Open the stone chest', fn: function () {
        if (!self.claimEchoStone()) self.toast(LC.mineProgress(self.S).owed ? 'Make room in your bag. The Batu Gema will wait here.' : 'The stone chest is empty.', 'i_batu_gema');
      } };
      default: return objectAction.apply(this, arguments);
    }
  };

  var updateEnemies = proto.updateEnemies;
  proto.updateEnemies = function (time, dt, blocked) {
    updateEnemies.apply(this, arguments);
    if (this.echoMine) this.updateKelembai(dt, blocked);
  };

  var updatePlayer = proto.updatePlayer;
  proto.updatePlayer = function (dt, blocked) {
    var mine = this.echoMine;
    if (mine && mine.frozen > 0) {
      mine.frozen = Math.max(0, mine.frozen - dt);
      if (!mine.frozen && this.invuln <= 0) this.player.clearTint();
      else this.player.setTint(0xb9b7c8);
      blocked = true;
    }
    updatePlayer.call(this, dt, blocked);
  };

  var getAction = proto.getAction;
  proto.getAction = function () {
    if (this.echoMine && this.echoMine.frozen > 0) return null;
    return getAction.apply(this, arguments);
  };

  var dash = proto.dash;
  proto.dash = function () {
    if (this.echoMine && this.echoMine.frozen > 0) return;
    return dash.apply(this, arguments);
  };

  Object.assign(proto, {
    mineDepositLeft: function (o) {
      var run = this.echoMine.run, taken = run && run.taken[o.id] || {};
      return !!run && Object.keys(o.loot).some(function (id) { return o.loot[id] > (taken[id] || 0); });
    },

    tintMineDeposit: function (o) {
      var hidden = o.hidden && this.hiddenObjs.find(function (h) { return h.o === o; });
      var img = hidden ? hidden.img : this.objImgs[o.id];
      if (this.mineDepositLeft(o)) img.clearTint();
      else img.setTint(0x656064);
    },

    mineDeposit: function (o) {
      if (!this.mineDepositLeft(o)) { this.toast('The deposit is spent. More will surface next season.'); return; }
      var run = this.echoMine.run, taken = run.taken[o.id] || (run.taken[o.id] = {}), found = [];
      Object.keys(o.loot).forEach(function (id) {
        var count = Math.min(o.loot[id] - (taken[id] || 0), LC.State.room(id));
        if (count <= 0) return;
        LC.State.add(id, count);
        taken[id] = (taken[id] || 0) + count;
        found.push(count + ' ' + LC.ITEMS[id].name);
      });
      if (!found.length) { this.toast('Your bag is full. The deposit will wait here.'); return; }
      LC.State.save();
      LC.Audio.sfx('mine');
      this.fx.sparkle.explode(10, (o.x + 0.5) * T, (o.y + 0.5) * T);
      this.tintMineDeposit(o);
      this.toast('Found ' + found.join(' and ') + '.' + (this.mineDepositLeft(o) ? ' There is still some left.' : ''), LC.ITEMS[Object.keys(o.loot)[0]].icon);
    },

    claimEchoStone: function () {
      var q = LC.mineProgress(this.S), n = Math.min(q.owed, LC.State.room(ECHO));
      if (!n) return false;
      LC.State.add(ECHO, n);
      q.owed -= n;
      LC.State.save();
      this.toast('Found ' + n + ' Batu Gema. Use it at the Echo Forge.', 'i_batu_gema');
      return true;
    },

    openMineMerchant: function (merchant) {
      var S = this.S;
      this.ui.openMenu({ title: 'Travelling Merchant', coins: true, tabs: [{ label: 'Buy', rows: function () {
        return merchant.stock.map(function (offer) {
          var item = LC.ITEMS[offer.id], afford = S.kepeng >= offer.price, room = LC.State.canAdd(offer.id);
          return { icon: item.icon, label: item.name, sub: item.desc, right: offer.price + ' k',
            enabled: afford && room, why: afford ? 'Your bag is full!' : 'Not enough kepeng.',
            qty: { id: offer.id, price: offer.price, buy: function (n) {
              S.kepeng -= n * offer.price;
              LC.State.add(offer.id, n);
              LC.Audio.sfx('buy');
              LC.State.save();
            } } };
        });
      } }] });
    },

    openEchoForge: function () {
      var self = this, q = LC.mineProgress(this.S);
      this.ui.openMenu({ title: 'Echo Forge', tabs: [{ label: 'Upgrade', rows: function () {
        var rank = q.forge, cost = M.costs[rank];
        if (!cost) return [{ icon: 'i_batu_gema', label: 'Upgrade complete', right: '+3 damage',
          sub: 'Every weapon carries the full strength of the Echo Forge.' }];
        var row = self.ui.craftRow('i_batu_gema', 'Echo tempering ' + (rank + 1) + ' / ' + M.costs.length,
          'Permanently add +1 damage to every weapon. Find Batu Gema in the gold workings and by facing Sang Kelembai.', { batu_gema: cost }, 0, function () {
            q.forge++;
            LC.State.save();
            LC.Audio.sfx('mine');
            self.toast('Echo Forge: +' + q.forge + ' weapon damage in total.', 'i_batu_gema');
          });
        if (row.enabled) row.right = 'Temper';
        return [row];
      } }] });
    },

    kelembaiVoicePath: function (e) {
      var x = e.spr.x, y = e.spr.y - 5, p = this.player;
      var dx = p.x - x, dy = p.y - 5 - y, steps = Math.ceil(Math.hypot(dx, dy) / 3);
      for (var i = 1; i < steps; i++) {
        var px = x + dx * i / steps, py = y + dy * i / steps;
        var tx = Math.floor(px / T), ty = Math.floor(py / T), o = this.objAt[ty][tx];
        if (LC.SOLID_TILES[this.grid[ty][tx]] || (o && o.type === 'mine_pillar')) return { x: px, y: py, covered: true };
      }
      return { x: p.x, y: p.y - 5, covered: false };
    },

    updateKelembai: function (dt, blocked) {
      var mine = this.echoMine, e = mine.boss, fx = mine.fx, p = this.player, a = M.arena;
      fx.clear();
      var x = Math.floor(p.x / T), y = Math.floor((p.y - 3) / T);
      if (e.dead || e.away || x < a.x0 || x > a.x1 || y < a.y0 || y > a.y1 + 5) {
        mine.phase = 'wait'; mine.timer = 1.5;
        return;
      }
      var hp = e.hp / e.def.hp, sx = e.spr.x, sy = e.spr.y, by = sy - e.spr.height - 5;
      fx.fillStyle(0x261c28, 0.95).fillRect(sx - 20, by, 40, 5);
      fx.fillStyle(0xcb9dff, 1).fillRect(sx - 19, by + 1, Math.ceil(38 * hp), 3);
      if (blocked || this.leaving || this.sleeping) return;
      if (e.stoneT > 0) { mine.phase = 'rest'; mine.timer = 0.8; return; }

      mine.timer -= dt;
      if (mine.phase === 'chant') {
        var ray = this.kelembaiVoicePath(e);
        fx.lineStyle(3, ray.covered ? 0x79d6bf : 0xe0a5ff, 0.45).lineBetween(sx, sy - 5, ray.x, ray.y);
        fx.lineStyle(2, 0xe0a5ff, 0.75).strokeCircle(sx, sy - 19, 8 + 9 * (1 - Math.max(0, mine.timer)));
        if (mine.timer > 0) return;
        mine.phase = 'rest'; mine.timer = 1.8;
        LC.Audio.sfx('stone');
        this.shockwave(sx, sy - 15, 86, 0xb087ff);
        if (ray.covered) this.ui.floatText(p.x, p.y - 18, 'Covered', '#a1e4cb');
        else if (this.invuln <= 0) {
          this.playerHurt(e.def.dmg, e);
          if (!this.leaving) {
            mine.frozen = 1;
            this.ui.floatText(p.x, p.y - 28, 'Petrified!', '#e0ccff');
          }
        }
      } else if (mine.timer <= 0) {
        mine.phase = 'chant'; mine.timer = 1.15;
        LC.Audio.sfx('lunge');
        this.ui.floatText(sx, by - 4, 'Take cover!', '#edc8ff');
      }
    },

    calmKelembai: function (e) {
      var q = LC.mineProgress(this.S), run = this.echoMine.run, s = e.spr;
      if (!run || run.won) return;
      e.dead = true;
      e.respawn = Infinity;
      e.stoneT = 0;
      e.light.base = 0.45;
      this.tweens.add({ targets: s, alpha: 0.55, duration: 500 });
      this.fx.sparkle.explode(24, s.x, s.y - 20);
      LC.Audio.sfx('chime');
      run.won = true;
      q.owed++;
      var first = !q.blessed;
      if (first) {
        q.blessed = true;
        LC.State.recalc();
        this.S.hp = Math.min(this.S.maxHp, this.S.hp + M.health);
      }
      this.S.stats.kills = (this.S.stats.kills || 0) + 1;
      LC.State.save();
      var collected = this.claimEchoStone();
      this.ui.say([{ name: 'Sang Kelembai', portrait: 'sang_kelembai_0', text: first
        ? 'You stood your ground and heard me out. Take a little of the mountain\'s strength with you. (+5 max health)'
        : 'The mountain has settled again. Here, take the stone it shook loose.' },
      { text: collected ? 'You earned a Batu Gema. The Echo Forge is by the entrance.' : 'A Batu Gema is waiting in the stone chest. Make room in your bag and come back for it.' }]);
    }
  });
})(window.LC);
