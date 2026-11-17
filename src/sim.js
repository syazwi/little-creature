/* Little Creature — shared-world rules.
 * Everything that changes the SHARED farm (fields, trees, Pelita, offerings) goes through LC.Sim.
 * In single-player and on the co-op host these run locally; co-op guests send them to the host,
 * which runs them and broadcasts the result. Personal things (bag, kepeng, energy) never come here.
 * Every function takes one plain-object argument and returns plain JSON (it travels over the network). */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  function clamp(v) { return Math.max(0, Math.min(100, v)); }
  var grid = null;
  function ch(x, y) { if (!grid) grid = LC.buildMap(); return grid[y] && grid[y][x]; }

  LC.Sim = {
    till: function (a) {
      if (ch(a.x, a.y) !== 'f') return false;
      var t = LC.State.ensureTile(a.x, a.y);
      if (t.tilled) return false;
      t.tilled = true;
      return true;
    },
    water: function (a) {
      var t = LC.State.tile(a.x, a.y);
      if (!t || !t.tilled || t.wet) return false;
      t.wet = true;
      return true;
    },
    plant: function (a) {
      var cd = LC.CROPS[a.crop], c = ch(a.x, a.y), t = LC.State.tile(a.x, a.y);
      if (!cd) return false;
      if (cd.paddy) { if (c !== 'r' || (t && t.crop)) return false; t = LC.State.ensureTile(a.x, a.y); }
      else if (c !== 'f' || !t || !t.tilled || t.crop) return false;
      t.crop = { id: a.crop, g: 0 };
      return true;
    },
    harvest: function (a) {
      var t = LC.State.tile(a.x, a.y);
      if (!t || !t.crop || LC.cropStage(t.crop) !== 3) return null;
      var d = LC.CROPS[t.crop.id];
      t.crop = null;
      return { item: d.item, count: d.count };
    },
    shake: function (a) {
      var S = LC.State.s, o = LC.OBJECTS.filter(function (x) { return x.id === a.id; })[0];
      if (!o || o.type !== 'tree') return null;
      if (S.trees[a.id] > 0) return { days: S.trees[a.id] };
      var tr = LC.TREES[o.kind];
      S.trees[a.id] = tr.regrow;
      return { item: tr.fruit, count: tr.count };
    },
    feed: function (a) {
      var g = LC.State.s.ghost, it = LC.ITEMS[a.item];
      if (!it || !it.food) return { ok: false };
      if (g.full >= 97) return { ok: false, full: true };
      g.full = clamp(g.full + it.food.full);
      var joy = it.food.joy, bond = it.kind === 'dish' ? 6 : it.kind === 'drink' ? 4 : 2, msg = 'Pelita munches happily.';
      if (LC.LOVES.indexOf(a.item) >= 0) { joy += 10; bond += 4; msg = 'Pelita LOVES ' + it.name + '!'; }
      if (LC.DISLIKES.indexOf(a.item) >= 0) msg = 'Pelita sneezes out a tiny flame. Too spicy!';
      var craving = a.item === g.craving && !g.cravingDone;
      g.joy = clamp(g.joy + joy);
      var b = LC.State.addBond(bond), b2 = 0;
      if (craving) { g.cravingDone = true; b2 = LC.State.addBond(20); g.joy = clamp(g.joy + 15); }
      return { ok: true, msg: msg, b: b, joy: joy, craving: craving, b2: b2 };
    },
    pet: function () {
      var S = LC.State.s, g = S.ghost;
      if (S.minutes - g.petAt < 60) return { ok: false };
      g.petAt = S.minutes; g.joy = clamp(g.joy + 8);
      return { ok: true, b: LC.State.addBond(3) };
    },
    offer: function (a) {
      var S = LC.State.s, g = S.ghost, it = LC.ITEMS[a.item];
      if (!it || !it.glow) return { ok: false };
      if (g.glow >= 100) return { ok: false, full: true };
      g.glow = clamp(g.glow + it.glow);
      if (it.joy) g.joy = clamp(g.joy + it.joy);
      var b = LC.State.addBond(it.bond);
      S.offerings.push(a.item);
      return { ok: true, b: b };
    }
  };

  // Which slice of shared state an op touched (what the host re-broadcasts afterwards).
  LC.Sim.part = function (op, a) {
    var S = LC.State.s;
    if (op === 'till' || op === 'water' || op === 'plant' || op === 'harvest') {
      var k = a.x + ',' + a.y, tiles = {}; tiles[k] = S.tiles[k] || null;
      return { tiles: tiles };
    }
    if (op === 'shake') { var tr = {}; tr[a.id] = S.trees[a.id]; return { trees: tr }; }
    return { ghost: S.ghost, offerings: S.offerings };
  };
  LC.Sim.succeeded = function (res) { return !!(res && (res === true || res.ok || res.item)); };
})(window.LC);
