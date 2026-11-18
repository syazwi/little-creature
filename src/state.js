/* Little Creature — game state model, save/load and day simulation */
window.LC = window.LC || {};
(function (LC) {
  'use strict';

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  var BAG_KEY = 'littleCreature.coopBag';
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
    LC.allHarvestables().forEach(function (o) { trees[o.id] = 0; });
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
      ghost: { full: 20, joy: 20, glow: 8, bond: 0, stage: 0, level: 1, craving: 'nasi', cravingDone: false, petAt: -999 },
      flags: {},
      stats: { earned: 0, totalDays: 0, fish: 0, cleaned: 0 },
      pendingStage: [],
      pendingLevel: [],
      // v1.3
      area: 'farm',
      visited: { farm: true },
      buildings: {},      // shared: plotId -> { style, day, done, vid }
      spirits: {},        // shared: spiritId -> { friend, playDay }
      folk: {},           // personal: villagerId -> { met, pts, chatDay, task: { item, n, reward }, taskDay, done, gifts }
      fishLog: {},        // personal: itemId -> count
      companion: null,    // personal: a befriended spirit following you
      riding: null        // personal (v1.4): 'bike' | 'car' while riding
    };
  }

  var State = LC.State = {
    s: null,

    newGame: function () { this.s = newState(); return this.s; },

    hasSave: function () {
      try { return !!localStorage.getItem(LC.SAVE_KEY); } catch (e) { return false; }
    },
    save: function () {
      try {
        if (this.s && this.s.guest) {   // co-op guest: only the personal bag is ours to keep
          var s = this.s;
          localStorage.setItem(BAG_KEY, JSON.stringify({ inv: s.inv, kepeng: s.kepeng, water: s.water, sel: s.sel }));
          return true;
        }
        localStorage.setItem(LC.SAVE_KEY, JSON.stringify(this.s));
        return true;
      } catch (e) { return false; }
    },

    // -------------------------------------------------------------- co-op
    snapshot: function () {
      var s = this.s;
      return JSON.parse(JSON.stringify({ day: s.day, minutes: s.minutes, tiles: s.tiles, trees: s.trees, ghost: s.ghost, offerings: s.offerings, buildings: s.buildings, spirits: s.spirits }));
    },
    applySnapshot: function (w) {
      var s = this.s;
      s.day = w.day; s.minutes = w.minutes; s.tiles = w.tiles || {}; s.trees = w.trees || {};
      s.offerings = w.offerings || [];
      s.buildings = w.buildings || {}; s.spirits = w.spirits || {};
      if (s.ghost) Object.keys(w.ghost).forEach(function (k) { s.ghost[k] = w.ghost[k]; }); else s.ghost = w.ghost;
    },
    // A guest plays on the host's shared world with their own travelling bag.
    makeGuest: function (world) {
      var s = newState(), bag = null;
      try { bag = JSON.parse(localStorage.getItem(BAG_KEY) || 'null'); } catch (e) { bag = null; }
      var inv = new Array(LC.INV_SIZE).fill(null);
      if (bag && bag.inv) { bag.inv.forEach(function (sl, i) { if (i < inv.length && sl && LC.ITEMS[sl.id]) inv[i] = sl; }); }
      else { inv[0] = { id: 'hoe', n: 1 }; inv[1] = { id: 'can', n: 1 }; inv[2] = { id: 'nasi', n: 1 }; inv[3] = { id: 'seed_ubi', n: 4 }; inv[4] = { id: 'seed_pandan', n: 2 }; }
      if (!inv.some(function (sl) { return sl && sl.id === 'hoe'; })) { var i = inv.indexOf(null); if (i >= 0) inv[i] = { id: 'hoe', n: 1 }; }
      if (!inv.some(function (sl) { return sl && sl.id === 'can'; })) { var j = inv.indexOf(null); if (j >= 0) inv[j] = { id: 'can', n: 1 }; }
      s.inv = inv;
      s.kepeng = bag ? bag.kepeng : 60;
      s.water = bag ? bag.water || 0 : 0;
      s.sel = bag && bag.sel < 9 ? bag.sel : 0;
      s.guest = true;
      s.flags = { introDone: true, fedOnce: true, incense: true, tilled: true, planted: true, watered: true, slept: true, harvested: true, cooked: true, metAni: true };
      this.s = s;
      this.applySnapshot(world);
      this.recalc();
      return s;
    },
    load: function () {
      try {
        var raw = localStorage.getItem(LC.SAVE_KEY);
        if (!raw) return false;
        var data = JSON.parse(raw), base = newState();
        Object.keys(base).forEach(function (k) { if (data[k] === undefined) data[k] = base[k]; });
        Object.keys(base.ghost).forEach(function (k) { if (data.ghost[k] === undefined) data.ghost[k] = base.ghost[k]; });
        Object.keys(base.trees).forEach(function (k) { if (data.trees[k] === undefined) data.trees[k] = 0; });
        Object.keys(base.stats).forEach(function (k) { if (data.stats[k] === undefined) data.stats[k] = base.stats[k]; });
        // v1.3: Pelita's level comes from its bond (no celebrations for levels earned before the update)
        data.ghost.level = LC.levelFor(data.ghost.bond);
        data.pendingStage = []; data.pendingLevel = [];
        data.area = 'farm'; data.riding = null;
        if (data.flags.metAni) data.visited.kampung = data.visited.kampung || false;
        while (data.inv.length < LC.INV_SIZE) data.inv.push(null);
        // saves happen at bedtime and whenever the app is backgrounded, so keep the clock
        if (!(data.minutes >= LC.DAY_START && data.minutes < LC.DAY_END - 10)) data.minutes = LC.DAY_START;
        this.s = data;
        this.recalc();
        return true;
      } catch (e) { return false; }
    },

    // -------------------------------------------------------------- helpers
    isHGN: function () { return this.s.day % 7 === 0; },
    weekday: function () { return LC.WEEKDAYS[(this.s.day - 1) % 7]; },
    selItem: function () { return this.s.inv[this.s.sel] || null; },

    // '@fish' style ids mean "any item of that category"
    matches: function (id, itemId) { return id[0] === '@' ? LC.ITEMS[itemId].cat === id.slice(1) : id === itemId; },
    count: function (id) {
      var n = 0, self = this;
      this.s.inv.forEach(function (sl) { if (sl && self.matches(id, sl.id)) n += sl.n; });
      return n;
    },
    ingName: function (id) { return id[0] === '@' ? (LC.CATS[id.slice(1)] || id.slice(1)) : LC.ITEMS[id].name; },
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
      var inv = this.s.inv, self = this, order = [];
      if (id[0] === '@') {   // any of a category: use up the cheapest first, so rare fish are kept
        inv.forEach(function (sl, j) { if (sl && self.matches(id, sl.id)) order.push(j); });
        order.sort(function (a, b) { return (LC.ITEMS[inv[a].id].sell || 0) - (LC.ITEMS[inv[b].id].sell || 0); });
      } else {
        // take from the selected slot first, then the back of the bag
        order.push(this.s.sel);
        for (var i = inv.length - 1; i >= 0; i--) if (i !== this.s.sel) order.push(i);
      }
      order.forEach(function (j) {
        if (n > 0 && inv[j] && self.matches(id, inv[j].id)) {
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
      while (g.stage < LC.STAGES.length - 1 && g.bond >= LC.STAGES[g.stage + 1].bond) g.stage++;
      var lv = LC.levelFor(g.bond);
      while ((g.level || 1) < lv) { g.level = (g.level || 1) + 1; this.s.pendingLevel.push(g.level); }
      LC.emit('ghost');
      return n;
    },
    nextStageBond: function () {
      var g = this.s.ghost;
      return g.stage < LC.STAGES.length - 1 ? LC.STAGES[g.stage + 1].bond : null;
    },
    level: function () { return this.s.ghost.level || 1; },
    nextLevelBond: function () { var l = this.level(); return l < LC.MAX_LEVEL ? LC.LEVELS[l] : null; },
    isOpen: function (area) { var A = LC.AREAS[area]; return LC.areaOpen(area, this.level()) && (!A.needs || this.friend(A.needs)); },
    friend: function (sid) { var sp = this.s.spirits[sid]; return !!(sp && sp.friend); },

    // personal limits that grow with Pelita's level and spirit blessings
    recalc: function () {
      var s = this.s, lv = this.level(), e = 120;
      Object.keys(LC.LEVEL_REWARDS).forEach(function (k) { if (lv >= +k && LC.LEVEL_REWARDS[k].energy) e += LC.LEVEL_REWARDS[k].energy; });
      if (this.friend('kenyalang')) e += 30;
      s.maxEnergy = e;
      s.maxWater = 20 + (lv >= 10 ? 10 : 0);
      if (s.energy > s.maxEnergy) s.energy = s.maxEnergy;
    },
    // a level's personal gifts (every player on the farm gets them). Returns a line for the celebration.
    levelGift: function (lv) {
      var r = LC.LEVEL_REWARDS[lv], s = this.s;
      if (!r) return null;
      if (r.kepeng) s.kepeng += r.kepeng;
      if (r.item) this.add(r.item[0], r.item[1]);
      this.recalc();
      return r.text || null;
    },

    // -------------------------------------------------------------- fishing
    rollFish: function (kind) {
      var tbl = LC.FISHING[kind] || LC.FISHING.river, night = this.s.minutes >= 19 * 60 || this.s.minutes < 6 * 60, naga = this.friend('naga');
      var opts = tbl.map(function (e) {
        var it = LC.ITEMS[e[0]], w = e[1];
        if (night && it.night) w *= 2;
        if (naga && (it.diff || 1) >= 3) w *= 2;
        if (naga && it.kind === 'junk') w *= 0.5;
        return [e[0], w];
      });
      var tot = opts.reduce(function (a, e) { return a + e[1]; }, 0), r = Math.random() * tot;
      for (var i = 0; i < opts.length; i++) { r -= opts[i][1]; if (r <= 0) return opts[i][0]; }
      return opts[0][0];
    },

    // -------------------------------------------------------------- villagers (personal friendship and requests)
    folk: function (vid) {
      var f = this.s.folk[vid];
      if (!f) f = this.s.folk[vid] = { met: false, pts: 0, chatDay: 0, task: null, taskDay: 0, done: false, gifts: {} };
      if (f.taskDay !== this.s.day) this.newTask(vid);
      return f;
    },
    hearts: function (vid) { return Math.min(10, Math.floor((this.s.folk[vid] ? this.s.folk[vid].pts : 0) / 4)); },
    newTask: function (vid) {
      var v = LC.VILLAGERS[vid], f = this.s.folk[vid], t = v.tasks[rint(v.tasks.length)];
      var n = t[1] + rint(t[2] - t[1] + 1), it = LC.ITEMS[t[0]], val = it.sell || it.price || 20;
      f.task = { item: t[0], n: n, reward: Math.round(val * n * 1.6 / 5) * 5 + 10 };
      f.taskDay = this.s.day; f.done = false;
    },
    // returns any heart-gifts newly earned: [{ hearts, item, n }]
    addFriendship: function (vid, pts) {
      var f = this.folk(vid), before = this.hearts(vid), out = [], self = this;
      f.pts = Math.min(40, f.pts + pts);
      var after = this.hearts(vid), gifts = LC.VILLAGERS[vid].gifts || {};
      Object.keys(gifts).forEach(function (h) {
        if (after >= +h && before < +h && !f.gifts[h]) {
          f.gifts[h] = true;
          var g = gifts[h];
          if (g[0] === 'kepeng') self.s.kepeng += g[1]; else self.add(g[0], g[1]);
          out.push({ hearts: +h, item: g[0], n: g[1] });
        }
      });
      return out;
    },
    // which villager lives on each built plot, and who is in the kampung right now
    villagerAtPlot: function (plot) { var b = this.s.buildings[plot]; return b && b.done ? b.vid : null; },
    villagerHome: function (vid) {
      if (!LC.VILLAGERS[vid].movesIn) return LC.VILLAGERS[vid].post;
      var B = this.s.buildings;
      for (var p in B) if (B[p].done && B[p].vid === vid) return LC.PLOT_POSTS[p];
      return null;
    },

    // personal new-day chores, for the host/single player (from endDay) and for co-op guests (at dayStart)
    personalMorning: function () {
      var s = this.s, lines = [];
      if (this.friend('bunian')) {
        var pool = ['cendawan', 'herba', 'rotan', 'kayu', 'cendawan'], got = [];
        for (var i = 0; i < 2; i++) { var it = pool[rint(pool.length)]; if (this.add(it, 1)) got.push(LC.ITEMS[it].name); }
        if (got.length) lines.push('The Orang Bunian left ' + got.join(' and ') + ' on your doorstep.');
      }
      this.recalc();
      return lines;
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
      var grown = 0, blessed = 0, ready = 0, lanternWater = g.stage >= 2 && g.glow >= 50, nuno = this.friend('nuno');
      Object.keys(s.tiles).forEach(function (k) {
        var t = s.tiles[k];
        if (t.crop) {
          var def = LC.CROPS[t.crop.id];
          var watered = def.paddy || t.wet || (nuno && t.tilled && Math.random() < 0.5);
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

      // gotong-royong: houses started today are raised overnight, and a family moves in
      var B = s.buildings || {};
      Object.keys(B).sort().forEach(function (p) {
        var b = B[p];
        if (b.done) return;
        var taken = {}; Object.keys(B).forEach(function (q) { if (B[q].vid) taken[B[q].vid] = 1; });
        var vid = LC.MOVE_IN.filter(function (v) { return !taken[v]; })[0] || null;
        b.done = true; b.vid = vid;
        lines.push('Gotong-royong! The whole kampung raised the ' + LC.HOUSES[b.style].name + ' overnight.' + (vid ? ' ' + LC.VILLAGERS[vid].name + ' (' + LC.VILLAGERS[vid].role.toLowerCase() + ') has moved in!' : ''));
      });

      // trees and forage regrow
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
      this.personalMorning().forEach(function (l) { lines.push(l); });
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
