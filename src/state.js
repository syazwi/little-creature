/* Little Creature — game state model, save/load and day simulation */
window.LC = window.LC || {};
(function (LC) {
  'use strict';

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function rint(n) { return Math.floor(Math.random() * n); }

  function newState() {
    var inv = new Array(LC.INV_SIZE).fill(null);
    inv[0] = { id: 'hoe', n: 1 };
    inv[1] = { id: 'can', n: 1 };
    inv[2] = { id: 'nasi', n: 2 };
    inv[3] = { id: 'colok', n: 1 };
    inv[4] = { id: 'seed_ubi', n: 6 };
    inv[5] = { id: 'seed_pandan', n: 4 };
    inv[6] = { id: 'seed_marigold', n: 2 };
    inv[7] = { id: 'seed_melati', n: 2 };
    var trees = {};
    LC.OBJECTS.forEach(function (o) { if (o.type === 'tree') trees[o.id] = 0; });
    return {
      version: 1,
      day: 1,
      minutes: LC.DAY_START,
      kepeng: 100,
      energy: 120, maxEnergy: 120,
      water: 0, maxWater: 20,
      inv: inv,
      sel: 0,
      tiles: {},          // "x,y" -> { tilled, wet, crop: { id, g } }
      trees: trees,       // id -> days until fruit (0 = ready)
      offerings: [],      // offerings placed today
      ghost: { full: 20, joy: 20, glow: 8, bond: 0, stage: 0, craving: 'nasi', cravingDone: false, petAt: -999 },
      flags: {},
      stats: { earned: 0, totalDays: 0 },
      pendingStage: []
    };
  }

  var State = LC.State = {
    s: null,

    newGame: function () { this.s = newState(); return this.s; },

    hasSave: function () {
      try { return !!localStorage.getItem(LC.SAVE_KEY); } catch (e) { return false; }
    },
    save: function () {
      try { localStorage.setItem(LC.SAVE_KEY, JSON.stringify(this.s)); return true; } catch (e) { return false; }
    },
    load: function () {
      try {
        var raw = localStorage.getItem(LC.SAVE_KEY);
        if (!raw) return false;
        var data = JSON.parse(raw), base = newState();
        Object.keys(base).forEach(function (k) { if (data[k] === undefined) data[k] = base[k]; });
        Object.keys(base.ghost).forEach(function (k) { if (data.ghost[k] === undefined) data.ghost[k] = base.ghost[k]; });
        Object.keys(base.trees).forEach(function (k) { if (data.trees[k] === undefined) data.trees[k] = 0; });
        while (data.inv.length < LC.INV_SIZE) data.inv.push(null);
        // saves happen at bedtime and whenever the app is backgrounded, so keep the clock
        if (!(data.minutes >= LC.DAY_START && data.minutes < LC.DAY_END - 10)) data.minutes = LC.DAY_START;
        this.s = data;
        return true;
      } catch (e) { return false; }
    },

    // -------------------------------------------------------------- helpers
    isHGN: function () { return this.s.day % 7 === 0; },
    weekday: function () { return LC.WEEKDAYS[(this.s.day - 1) % 7]; },
    selItem: function () { return this.s.inv[this.s.sel] || null; },

    count: function (id) {
      var n = 0;
      this.s.inv.forEach(function (sl) { if (sl && sl.id === id) n += sl.n; });
      return n;
    },
    has: function (map) {
      var self = this;
      return Object.keys(map).every(function (id) { return self.count(id) >= map[id]; });
    },
    canAdd: function (id) {
      return this.s.inv.some(function (sl) { return !sl || (sl.id === id && sl.n < 99); });
    },
    add: function (id, n) {
      n = n || 1;
      var inv = this.s.inv, i;
      for (i = 0; i < inv.length && n > 0; i++) {
        if (inv[i] && inv[i].id === id && inv[i].n < 99) {
          var k = Math.min(n, 99 - inv[i].n); inv[i].n += k; n -= k;
        }
      }
      for (i = 0; i < inv.length && n > 0; i++) {
        if (!inv[i]) { var m = Math.min(n, 99); inv[i] = { id: id, n: m }; n -= m; }
      }
      LC.emit('inv');
      return n === 0;
    },
    remove: function (id, n) {
      n = n || 1;
      var inv = this.s.inv;
      // take from the selected slot first, then the back of the bag
      var order = [this.s.sel];
      for (var i = inv.length - 1; i >= 0; i--) if (i !== this.s.sel) order.push(i);
      order.forEach(function (j) {
        if (n > 0 && inv[j] && inv[j].id === id) {
          var k = Math.min(n, inv[j].n); inv[j].n -= k; n -= k;
          if (inv[j].n <= 0) inv[j] = null;
        }
      });
      LC.emit('inv');
      return n === 0;
    },
    takeAll: function (map) {
      var self = this;
      Object.keys(map).forEach(function (id) { self.remove(id, map[id]); });
    },

    tile: function (x, y) { return this.s.tiles[x + ',' + y]; },
    ensureTile: function (x, y) {
      var k = x + ',' + y;
      if (!this.s.tiles[k]) this.s.tiles[k] = { tilled: false, wet: false, crop: null };
      return this.s.tiles[k];
    },

    addBond: function (n) {
      var g = this.s.ghost;
      if (this.isHGN()) n *= 2;
      g.bond += n;
      while (g.stage < LC.STAGES.length - 1 && g.bond >= LC.STAGES[g.stage + 1].bond) {
        g.stage++;
        this.s.pendingStage.push(g.stage);
      }
      LC.emit('ghost');
      return n;
    },
    nextStageBond: function () {
      var g = this.s.ghost;
      return g.stage < LC.STAGES.length - 1 ? LC.STAGES[g.stage + 1].bond : null;
    },

    pickCraving: function () {
      var st = this.s.ghost.stage;
      var pool = ['nasi', 'ubi_rebus', 'pisang', 'air_merah', 'mangga', 'kelapa'];
      if (st >= 2) pool = pool.concat(['pisang_goreng', 'bubur_ubi', 'nasi_lemak']);
      if (st >= 3) pool = pool.concat(['kuih_pandan', 'pulut_mangga', 'nasi_lemak', 'pulut_mangga']);
      var prev = this.s.ghost.craving, pick = prev;
      for (var t = 0; t < 6 && pick === prev; t++) pick = pool[rint(pool.length)];
      return pick;
    },

    prank: function () {
      var s = this.s, opts = ['can', 'shuffle'];
      var growing = [];
      Object.keys(s.tiles).forEach(function (k) { var t = s.tiles[k]; if (t.crop && t.crop.g > 0) growing.push(t); });
      if (s.kepeng >= 10) opts.push('coins', 'coins');
      if (growing.length) opts.push('crop', 'crop');
      var p = opts[rint(opts.length)];
      if (p === 'coins') {
        var k = Math.min(s.kepeng, 5 + rint(11)); s.kepeng -= k;
        return 'Pelita sulked and hid ' + k + ' kepeng somewhere... It feels lonely.';
      }
      if (p === 'crop') {
        var t = growing[rint(growing.length)]; t.crop.g--;
        return 'In a tantrum, Pelita tugged on your ' + LC.CROPS[t.crop.id].name + '. It shrank back a little!';
      }
      if (p === 'can') { s.water = 0; return 'Pelita knocked over your gembor. All the water spilled out!'; }
      // shuffle hotbar
      var slots = s.inv.slice(0, 9);
      for (var i = slots.length - 1; i > 0; i--) { var j = rint(i + 1); var tmp = slots[i]; slots[i] = slots[j]; slots[j] = tmp; }
      for (var q = 0; q < 9; q++) s.inv[q] = slots[q];
      return 'Bored and lonely, Pelita rearranged everything in your bag!';
    },

    // -------------------------------------------------------------- end of day
    endDay: function (fainted) {
      var s = this.s, g = s.ghost, lines = [], self = this;
      var content = g.full >= 50 && g.joy >= 50 && g.glow >= 50;
      var neglected = Math.min(g.full, g.joy, g.glow) < 20;
      var mood = content ? 'content' : neglected ? 'neglected' : 'okay';

      if (fainted) lines.push('You collapsed at midnight. Pelita\'s faint light guided you home.');
      if (content) {
        var b = this.addBond(10);
        lines.push('Pelita is content and sleeps soundly in its little house. (+' + b + ' bond)');
      } else if (neglected) {
        lines.push(this.prank());
      } else {
        lines.push('Pelita dozes off, a little restless.');
      }
      if (!g.cravingDone && g.stage >= 1) {
        g.joy = Math.max(0, g.joy - 10);
        lines.push('Pelita never got the ' + LC.ITEMS[g.craving].name + ' it was craving...');
      }

      // crops grow
      var grown = 0, blessed = 0, ready = 0, lanternWater = g.stage >= 2 && g.glow >= 50;
      Object.keys(s.tiles).forEach(function (k) {
        var t = s.tiles[k];
        if (t.crop) {
          var def = LC.CROPS[t.crop.id];
          var watered = def.paddy || t.wet;
          if (watered && t.crop.g < def.days) {
            t.crop.g++; grown++;
            if (g.stage >= 3 && !neglected && t.crop.g < def.days && Math.random() < 0.3) { t.crop.g++; blessed++; }
          }
          if (t.crop.g >= def.days) ready++;
        }
        t.wet = false;
        if (lanternWater && t.tilled && t.crop && !LC.CROPS[t.crop.id].paddy) t.wet = true;
      });
      if (grown) lines.push(grown + ' crop' + (grown > 1 ? 's' : '') + ' grew overnight.' + (ready ? ' ' + ready + ' ready to harvest!' : ''));
      if (blessed) lines.push('Pelita\'s blessing made ' + blessed + ' crop' + (blessed > 1 ? 's' : '') + ' grow extra fast!');
      if (lanternWater) lines.push('Pelita\'s lantern bobbed over the field all night. Your crops are already watered!');
      if (g.stage >= 3 && content) {
        var found = 10 + rint(21); s.kepeng += found;
        lines.push('Pelita found ' + found + ' kepeng under the house!');
      }

      // trees regrow
      Object.keys(s.trees).forEach(function (id) { if (s.trees[id] > 0) s.trees[id]--; });

      // overnight needs
      g.full = clamp(g.full - 15, 0, 100);
      g.joy = clamp(g.joy - 5, 0, 100);
      g.glow = clamp(g.glow - 20, 0, 100);

      var summary = { day: s.day, lines: lines, mood: mood, earned: s.stats.earned, fainted: fainted };

      // new day
      s.day++;
      s.stats.totalDays++;
      s.minutes = LC.DAY_START;
      s.energy = fainted ? Math.round(s.maxEnergy * 0.6) : s.maxEnergy;
      s.offerings = [];
      s.stats.earned = 0;
      g.petAt = -999;
      g.cravingDone = false;
      g.craving = self.pickCraving();
      if (!fainted) s.flags.slept = true;
      this.save();
      LC.emit('inv'); LC.emit('ghost');
      return summary;
    }
  };

  // tiny global event bus (set to game.events once Phaser boots)
  LC.bus = null;
  LC.emit = function (ev, data) { if (LC.bus) LC.bus.emit(ev, data); };
  LC.clamp = clamp;
})(window.LC);
