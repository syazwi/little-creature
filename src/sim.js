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
  function ch(x, y) { if (!grid) grid = LC.areaGrid('farm'); return grid[y] && grid[y][x]; }   // (the same grid the farm is drawn from: Badang's field appears in it)

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
      var d = LC.CROPS[t.crop.id], n = d.count;
      if (d.paddy && LC.State.friend('semangat')) n += 2;   // the Semangat Padi's blessing
      t.crop = null;
      return { item: d.item, count: n };
    },
    // fruit trees and forage spots anywhere in the world (their regrow timers live in S.trees)
    shake: function (a) {
      var S = LC.State.s, o = LC.objById(a.id);
      if (!o || (o.type !== 'tree' && o.type !== 'forage')) return null;
      if (o.type === 'tree' && LC.TREES[o.kind].season && LC.State.season().id !== LC.TREES[o.kind].season) return { off: LC.TREES[o.kind].season };
      if (S.trees[a.id] > 0) return { days: S.trees[a.id] };
      if (o.type === 'tree') {
        var tr = LC.TREES[o.kind];
        S.trees[a.id] = tr.regrow;
        return { item: tr.fruit, count: tr.count + (LC.State.season().id === 'buah' ? 1 : 0) };   // fruit season: one extra
      }
      var fg = LC.FORAGE[o.kind], res = { item: fg.item, count: fg.count };
      S.trees[a.id] = fg.regrow;
      if (fg.rare && Math.random() < fg.rare[1]) res.extra = fg.rare[0];
      return res;
    },
    // gotong-royong: start a house on an empty kampung plot (materials are paid by whoever asked)
    build: function (a) {
      var S = LC.State.s, o = LC.objById(a.plot);
      if (!o || o.type !== 'plot' || !LC.HOUSES[a.style] || S.buildings[a.plot]) return { ok: false };
      S.buildings[a.plot] = { style: a.style, day: S.day, done: false, vid: null };
      if (a.quick) { var vid = LC.State.moveIn(a.plot); return { ok: true, quick: true, vid: vid }; }   // v1.7: Badang raises it at once
      return { ok: true };
    },
    // v1.8: Nenek's house grows a stage (built overnight, or at once with Badang; paid by whoever asked)
    house_up: function (a) {
      var S = LC.State.s, next = (S.house || 0) + 1;
      if (S.houseBuild || !LC.HOUSE_STAGES[next]) return { ok: false };
      if (a && a.quick) { S.house = next; LC.Home.applyStage(next); return { ok: true, quick: true, stage: next }; }
      S.houseBuild = next;
      return { ok: true, stage: next };
    },
    // v1.8: hire or let go of a helper (their wages come out of the host's kepeng every morning)
    hire: function (a) {
      var S = LC.State.s;
      S.helpers = S.helpers || {};
      if (!LC.HELPERS[a.k] || S.helpers[a.k] || LC.Home.hiredCount() >= LC.Home.rooms()) return { ok: false };
      S.helpers[a.k] = { since: S.day };
      return { ok: true };
    },
    fire: function (a) {
      var S = LC.State.s;
      if (!S.helpers || !S.helpers[a.k]) return { ok: false };
      delete S.helpers[a.k];
      return { ok: true };
    },
    // v1.7: Badang clears the stumps and boulders south of Nenek's field overnight (the feast is paid by whoever asked)
    ladang: function () {
      var S = LC.State.s;
      if (S.ladang) return { ok: false };
      S.ladang = 1;
      return { ok: true };
    },
    // grant a spirit's wish (the items are paid by whoever asked)
    befriend: function (a) {
      var S = LC.State.s;
      if (!LC.SPIRITS[a.sid] || LC.State.friend(a.sid)) return { ok: false };
      S.spirits[a.sid] = { friend: true, playDay: 0 };
      LC.State.recalc();
      return { ok: true, b: LC.State.addBond(15) };
    },
    // play with a befriended spirit: Pelita loves the company (once a day per spirit)
    play: function (a) {
      var S = LC.State.s, sp = S.spirits[a.sid];
      if (!sp || !sp.friend) return { ok: false };
      if (sp.playDay === S.day) return { ok: false, again: true };
      sp.playDay = S.day;
      S.ghost.joy = clamp(S.ghost.joy + 6);
      return { ok: true, b: LC.State.addBond(3) };
    },
    // helping villagers makes Pelita proud
    kind: function (a) { return { ok: true, b: LC.State.addBond(Math.max(1, Math.min(10, (a && a.n) || 4))) }; },
    // float a krathong at night: Pelita's light swells
    krathong: function () {
      var g = LC.State.s.ghost;
      g.glow = clamp(g.glow + 30); g.joy = clamp(g.joy + 10);
      return { ok: true, b: LC.State.addBond(8) };
    },
    // ---- v1.5: compost makes a crop grow a day at once
    fertilize: function (a) {
      var t = LC.State.tile(a.x, a.y);
      if (!t || !t.crop || t.crop.g >= LC.CROPS[t.crop.id].days) return false;
      t.crop.g++;
      return true;
    },
    // ---- v1.5: storage chests live in the world, so everyone on the farm shares them
    chest_place: function (a) {
      var S = LC.State.s;
      if (!LC.CHESTS[a.kind] || !LC.chestSpotOk(a.area, a.x, a.y)) return { ok: false };
      var id = 'c' + (S.chestSeq = (S.chestSeq || 0) + 1);
      S.chests[id] = { area: a.area, x: a.x, y: a.y, kind: a.kind, items: [] };
      return { ok: true, id: id };
    },
    chest_put: function (a) {
      var c = LC.State.s.chests[a.id];
      if (!c || !LC.ITEMS[a.item] || !(a.n > 0)) return { ok: false, n: 0 };
      var n = a.n, cap = LC.CHESTS[c.kind].slots, it = c.items, i;
      for (i = 0; i < it.length && n > 0; i++) if (it[i].id === a.item && it[i].n < 99) { var k = Math.min(n, 99 - it[i].n); it[i].n += k; n -= k; }
      while (n > 0 && it.length < cap) { var m = Math.min(n, 99); it.push({ id: a.item, n: m }); n -= m; }
      return { ok: n < a.n, n: a.n - n };
    },
    chest_take: function (a) {
      var c = LC.State.s.chests[a.id];
      if (!c) return { ok: false, n: 0 };
      var want = a.n, got = 0;
      for (var i = c.items.length - 1; i >= 0 && got < want; i--) {
        if (c.items[i].id !== a.item) continue;
        var k = Math.min(want - got, c.items[i].n); c.items[i].n -= k; got += k;
      }
      c.items = c.items.filter(function (s) { return s.n > 0; });
      return { ok: got > 0, n: got, item: a.item };
    },
    chest_pick: function (a) {
      var S = LC.State.s, c = S.chests[a.id];
      if (!c || c.items.length || c.fixed) return { ok: false };   // (the pantry stays put)
      delete S.chests[a.id];
      return { ok: true, kind: c.kind };
    },
    // ---- v1.5: farm animals (shared, they live at the reban)
    animal_add: function (a) {
      var D = LC.ANIMALS[a.kind];
      if (!D) return { ok: false };
      if (LC.State.animalRoom(D.home) <= 0) return { ok: false, full: true };
      var an = LC.State.newAnimal(a.kind);
      return { ok: true, id: an.id, name: an.name };
    },
    animals_feed: function (a) {
      var S = LC.State.s, n = a.n || 0, fed = 0;
      S.animals.forEach(function (an) { if (n > 0 && an.fedDay !== S.day && (!a.id || an.id === a.id)) { an.fedDay = S.day; n--; fed++; } });
      return { ok: fed > 0, fed: fed };
    },
    animal_pet: function (a) {
      var S = LC.State.s, an = LC.State.animal(a.id);
      if (!an) return { ok: false };
      if (an.petDay === S.day) return { ok: false, again: true, name: an.name };
      an.petDay = S.day; an.love = Math.min(20, an.love + 1);
      return { ok: true, name: an.name, love: an.love };
    },
    animal_groom: function (a) {
      var S = LC.State.s, an = LC.State.animal(a.id);
      if (!an || an.groomDay === S.day) return { ok: false };
      an.groomDay = S.day; an.love = Math.min(20, an.love + 1);
      return { ok: true, name: an.name };
    },
    animal_sell: function (a) {   // v2.3.2: a farm animal goes off to a new home
      var S = LC.State.s, i = -1;
      S.animals.forEach(function (an, k) { if (an.id === a.id) i = k; });
      if (i < 0) return { ok: false };
      var an = S.animals.splice(i, 1)[0];
      return { ok: true, kind: an.kind, name: an.name };
    },
    coop_collect: function () {
      var c = LC.State.s.coop, got = { telur: c.telur || 0, telur_itik: c.telur_itik || 0, susu: c.susu || 0 };
      c.telur = 0; c.telur_itik = 0; c.susu = 0;
      return { ok: got.telur + got.telur_itik + got.susu > 0, got: got };
    },
    coop_return: function (a) { var c = LC.State.s.coop; Object.keys(a.got || {}).forEach(function (k) { c[k] = (c[k] || 0) + a.got[k]; }); return { ok: true }; },
    nest_add: function (a) {
      var S = LC.State.s;
      if (S.nest.length >= 3 || (a.egg !== 'telur' && a.egg !== 'telur_itik')) return { ok: false };
      S.nest.push({ egg: a.egg, day: S.day });
      return { ok: true };
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
    if (op.indexOf('chest_') === 0) return { chests: S.chests, chestSeq: S.chestSeq };
    if (op.indexOf('animal') === 0 || op.indexOf('coop_') === 0 || op === 'nest_add') return { animals: S.animals, animalSeq: S.animalSeq, coop: S.coop, nest: S.nest };
    if (op === 'till' || op === 'water' || op === 'plant' || op === 'harvest' || op === 'fertilize') {
      var k = a.x + ',' + a.y, tiles = {}; tiles[k] = S.tiles[k] || null;
      return { tiles: tiles };
    }
    if (op === 'shake') { var tr = {}; tr[a.id] = S.trees[a.id]; return { trees: tr }; }
    if (op === 'build') return { buildings: S.buildings };
    if (op === 'ladang') return { ladang: S.ladang };
    if (op === 'house_up') return { house: S.house || 0, houseBuild: S.houseBuild || 0, chests: S.chests, chestSeq: S.chestSeq };
    if (op === 'hire' || op === 'fire') return { helpers: S.helpers || {} };
    if (op === 'befriend' || op === 'play') return { ghost: S.ghost, spirits: S.spirits };
    return { ghost: S.ghost, offerings: S.offerings };
  };
  LC.Sim.succeeded = function (res) { return !!(res && (res === true || res.ok || res.item)); };
})(window.LC);
