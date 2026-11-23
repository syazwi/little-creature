/* Developer-only input driver. Quest progress comes from ordinary gameplay actions. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var W = LC.WorldScene.prototype, U = LC.UIScene.prototype, runner = null;
  var T = 16, directions = [[1, 0, 'right'], [0, 1, 'down'], [-1, 0, 'left'], [0, -1, 'up']];
  function range(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function point(x, y) { return { x: (x + 0.5) * T, y: (y + 0.8) * T }; }
  function tile(p) { return { x: Math.floor(p.x / T), y: Math.floor((p.y - 3) / T) }; }

  function route(world, destinations, start, center, canEnter) {
    start = start || tile(world.player);
    center = center || point;
    canEnter = canEnter || function (p) { return !world.blockedAt(p.x, p.y); };
    var width = world.W, size = width * world.H;
    var seen = new Int32Array(size).fill(-1), queue = new Int32Array(size), next = 0, count = 1;
    var origin = start.y * width + start.x;
    if (origin < 0 || origin >= size) return null;
    queue[0] = origin; seen[origin] = origin;
    var goals = new Map(destinations.map(function (t) { return [t.y * width + t.x, t]; }));
    while (next < count) {
      var index = queue[next++], x = index % width, y = Math.floor(index / width), goal = goals.get(index);
      if (goal) {
        var cells = [];
        for (var at = index; at !== origin; at = seen[at]) cells.push(center(at % width, Math.floor(at / width)));
        cells.reverse();
        if (!cells.length) cells.push(center(goal.x, goal.y));
        return { cells: cells, goal: goal };
      }
      directions.forEach(function (d) {
        var nx = x + d[0], ny = y + d[1], i = ny * width + nx;
        if (nx < 0 || nx >= width || ny < 0 || ny >= world.H || seen[i] >= 0 || !canEnter(center(nx, ny))) return;
        seen[i] = index; queue[count++] = i;
      });
    }
    return null;
  }

  function Pilot(world, state) { this.world = world; this.state = state; }
  Pilot.prototype.walk = function (goals, label, onArrival) {
    var w = this.world, s = this.state;
    var digest = w.area + '/' + goals.map(function (goal) { return goal.x + ',' + goal.y; }).join('/');
    if (s.routeKey !== digest || w.time.now - s.routeAt > 320) {
      s.routeKey = digest; s.routeAt = w.time.now; s.path = route(w, goals);
    }
    s.action = label;
    if (!s.path) return;
    var here = s.path.cells[0];
    while (here && range(w.player, here) <= 4) { s.path.cells.shift(); here = s.path.cells[0]; }
    if (!here) { onArrival(s.path.goal); return; }
    s.vector = this.vector(here);
  };
  Pilot.prototype.vector = function (target) {
    var p = this.world.player, dx = target.x - p.x, dy = target.y - p.y, d = Math.hypot(dx, dy);
    return d > 0.01 ? { x: dx / d, y: dy / d } : null;
  };
  Pilot.prototype.sail = function (x, y, radius, label) {
    var w = this.world, s = this.state, ship = w.c11.ship, target = { x: x * T, y: y * T };
    var key = w.area + '/sea/' + x + '/' + y;
    var position = { x: ship.x, y: ship.y };
    function center(tx, ty) { return { x: (tx + 0.5) * T, y: (ty + 0.5) * T }; }
    function clear(pos) {
      if (!w.seaFree(pos.x, pos.y)) return false;
      for (var i = 0; i < 8; i++) {
        var a = i * Math.PI / 4;
        if (!w.seaFree(pos.x + 24 * Math.cos(a), pos.y + 24 * Math.sin(a))) return false;
      }
      return !w.c11.whirls.some(function (whirl) { return range(pos, whirl) < 4 * T; });
    }
    function canSail(a, b) {
      var dist = range(a, b);
      for (var i = 8; i <= dist; i += 8) {
        if (!clear({ x: a.x + (b.x - a.x) * i / dist, y: a.y + (b.y - a.y) * i / dist })) return false;
      }
      return clear(b);
    }
    s.action = label;
    if (s.seaKey !== key || !s.seaPath || w.time.now - s.seaAt > 750) {
      var goals = [];
      for (var ty = Math.floor(y - radius); ty <= y + radius; ty++) {
        for (var tx = Math.floor(x - radius); tx <= x + radius; tx++) {
          var pos = center(tx, ty);
          if (range(pos, target) < (radius - 0.8) * T && clear(pos)) goals.push({ x: tx, y: ty });
        }
      }
      var start = { x: Math.floor(ship.x / T), y: Math.floor(ship.y / T) };
      s.seaPath = route(w, goals, start, center, clear);
      s.seaKey = key; s.seaAt = w.time.now;
    }
    var destination = target, path = s.seaPath && s.seaPath.cells;
    if (path && path.length) {
      while (path.length > 1 && range(position, path[0]) < 12) path.shift();
      destination = path[0];
      for (var j = Math.min(path.length - 1, 10); j > 0; j--) {
        if (canSail(position, path[j])) { destination = path[j]; break; }
      }
    }
    var dx = destination.x - ship.x, dy = destination.y - ship.y, dist = Math.hypot(dx, dy);
    if (dist > 1) s.vector = { x: dx / dist, y: dy / dist };
  };
  Pilot.prototype.object = function (id, label) {
    var w = this.world, o = w.objects.find(function (item) { return item.id === id; });
    if (o) return this.use(o, label);
  };
  Pilot.prototype.use = function (o, label, match, reach) {
    var w = this.world, s = this.state;
    var goals = [];
    for (var y = 0; y < w.H; y++) for (var x = 0; x < w.W; x++) {
      if (w.objAt[y][x] !== o) continue;
      directions.forEach(function (d) {
        var gx = x - d[0], gy = y - d[1], p = point(gx, gy);
        if (!w.blockedAt(p.x, p.y)) goals.push({ x: gx, y: gy, dir: d[2] });
      });
      if (reach) {
        for (var dy = -reach; dy <= reach; dy++) for (var dx = -reach; dx <= reach; dx++) {
          if (Math.abs(dx) + Math.abs(dy) <= 1 || Math.hypot(dx, dy) > reach) continue;
          var spot = point(x + dx, y + dy);
          if (!w.blockedAt(spot.x, spot.y)) goals.push({ x: x + dx, y: y + dy });
        }
      }
    }
    this.walk(goals, label, function (at) {
      if (!at.dir && reach) {
        var action = w.objectAction(o, LC.State.selItem());
        if (action) action.fn();
        return;
      }
      w.dir = at.dir;
      var facing = w.facing();
      if (w.objAt[facing.ty] && w.objAt[facing.ty][facing.tx] === o) { s.menu = match; w.doAction(); }
    });
  };
  Pilot.prototype.stand = function (x, y, label) { this.walk([{ x: x, y: y }], label, function () {}); };
  Pilot.prototype.near = function (x, y, label, radius) {
    var w = this.world, pos = point(x, y), goals = [];
    radius = radius || 23;
    for (var ty = Math.floor(y - radius / T); ty <= y + radius / T; ty++) {
      for (var tx = Math.floor(x - radius / T); tx <= x + radius / T; tx++) {
        var at = point(tx, ty);
        if (!w.blockedAt(at.x, at.y) && range(pos, at) <= radius) goals.push({ x: tx, y: ty });
      }
    }
    this.walk(goals, label, function () {});
  };
  Pilot.prototype.find = function (match) {
    var w = this.world;
    for (var y = 0; y < w.H; y++) {
      var found = w.objAt[y].find(function (o) { return o && match(o); });
      if (found) return found;
    }
    return null;
  };
  Pilot.prototype.prop = function (test, label, menu, reach) {
    var object = this.find(typeof test === 'string' ? function (o) { return o.id === test || o.type === test; } : test);
    if (object) { this.use(object, label, menu, reach); return true; }
    return false;
  };
  Pilot.prototype.travel = function (to) {
    var w = this.world;
    if (w.area === to) return true;
    var title = 'Travel to ' + LC.AREAS[to].name;
    if (this.prop(function (item) { return item.to === to && ['sampan', 'dive', 'bunian_gate', 'portal', 'surface', 'row7'].includes(item.type); }, title)) return false;
    var exit = w.A.exits.find(function (item) { return item.to === to && LC.State.isOpen(to); });
    if (exit) { this.stand(exit.x0, exit.y0, title); return false; }
    this.state.action = title;
    w.goArea(to, undefined, 'down');
    return false;
  };
  Pilot.prototype.npc = function (id, match, goods) {
    var w = this.world, actor = LC.VILLAGERS[id], area = LC.villagerArea(id);
    if (goods) this.supply(goods);
    if (!this.travel(area)) return;
    if (!this.prop(function (item) { return item.vid === id; }, 'Talk to ' + actor.name, match || /^Never selected$/)) {
      this.state.action = 'Look for ' + actor.name;
      if (w.S.minutes >= 21 * 60 || w.S.minutes < 7 * 60) this.clock(10);
    }
  };
  Pilot.prototype.jong = function (match, label) {
    if (!this.prop(function (o) { return o.type === 'jong5' || o.type === 'jong_dagang'; }, label, match)) this.travel('farm');
  };
  Pilot.prototype.supply = function (items) {
    Object.keys(items).forEach(function (id) {
      var more = items[id] - LC.State.count(id);
      if (more > 0 && LC.ITEMS[id] && LC.State.room(id) >= more) LC.State.add(id, more);
    });
  };
  Pilot.prototype.foes = function (match) {
    var w = this.world;
    var enemies = w.enemies.filter(function (e) { return !e.dead && !e.away && (!match || match.test(e.kind)); });
    enemies.sort(function (a, b) { return range(a.spr, w.player) - range(b.spr, w.player); });
    if (enemies[0]) { this.attack(enemies[0]); return true; }
    return false;
  };
  Pilot.prototype.clock = function (hour) { this.world.S.minutes = hour * 60 + 5; };
  Pilot.prototype.sleep = function (stay) {
    var w = this.world;
    if (stay && w.area !== 'farm') { w.sleep(false, Object.assign({ area: w.area }, tile(w.player))); return; }
    if (this.travel('farm')) this.prop('house', 'Walk home to sleep', /^Sleep/);
  };
  Pilot.prototype.attack = function (foe) {
    if (!foe || foe.dead) return;
    this.supply({ keris: 1 });
    var w = this.world, p = w.player, f = foe.spr, dx = f.x - p.x, dy = f.y - p.y;
    var weapon = w.weaponOf(LC.State.selItem());
    var best = w.S.inv.reduce(function (result, sl, i) {
      var item = w.weaponOf(sl);
      return item && (!result || item.dmg > result.item.dmg) ? { index: i, item: item } : result;
    }, null);
    if (!best) return;
    if (!weapon || weapon.dmg < best.item.dmg) { w.ui.selectSlot(best.index); weapon = best.item; }
    this.state.action = 'Fighting ' + foe.def.name;
    if (!foe.away && range(p, f) < weapon.reach + foe.def.w && !w.swingCd) {
      w.dir = Math.abs(dx) > Math.abs(dy - 6) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
      w.attack();
      return;
    }
    var near = tile(f), targets = directions.map(function (d) { return { x: near.x - d[0], y: near.y - d[1] }; });
    this.walk(targets.filter(function (spot) { var t = point(spot.x, spot.y); return !w.blockedAt(t.x, t.y); }), this.state.action, function () {});
  };
  Pilot.prototype.block = function (m) {
    var w = this.world;
    var close = m.bolts.some(function (bolt) { return !bolt.back && range(w.player, bolt) < 37; });
    if (close && w.pantulAvailable() && !w.pantulLeft()) w.ui.pressKey('KeyP');
  };
  Pilot.prototype.heal = function () {
    var w = this.world, s = this.state;
    if (w.S.hp > 0.43 * w.S.maxHp || w.time.now - (s.ateAt || 0) < 900) return false;
    this.supply({ nasi_lemak: 2 });
    var i = w.S.inv.findIndex(function (slot) { return slot && LC.ITEMS[slot.id].food && LC.ITEMS[slot.id].food.full >= 15; });
    if (i < 0) return false;
    w.ui.selectSlot(i); w.ui.pressKey('KeyX'); s.ateAt = w.time.now;
    return true;
  };
  Pilot.prototype.dodge = function (marks) {
    var w = this.world, p = w.player, remembered = this.state.dodging;
    var danger = marks.find(function (m) { return m.time > 0 && (m === remembered || range(m, p) < 27); });
    if (!danger) return false;
    this.state.dodging = danger;
    if (range(danger, p) > 29) { this.state.action = 'Waiting outside the marked attack'; return true; }
    var center = tile(danger);
    var spots = directions.map(function (d) { return { x: center.x + d[0] * 2, y: center.y + d[1] * 2 }; });
    var safe = spots.filter(function (spot) { var t = point(spot.x, spot.y); return !w.blockedAt(t.x, t.y) && range(t, danger) > 28; });
    if (!safe.length) return false;
    this.walk(safe, 'Dodging a marked attack', function () {});
    return true;
  };

  function storm(pilot, step) {
    var w = pilot.world, s = pilot.state, storm = w.storm, C = LC.C12;
    if (w.area === 'farm') { pilot.object('storm_dock12', step ? 'Walking to the vinta' : 'Walking to Jack at the jetty'); return; }
    if (!storm || !storm.deck && !storm.sea) { pilot.travel('farm'); return; }
    if (storm.sea) {
      var action = w.stormSeaAction(), destination = w.stormDestination();
      s.action = destination.label;
      if (action && !/^Ready|^Moor/.test(action.label)) { w.doAction(); return; }
      var target = destination.point, sea = storm.sea;
      if (range(w.player, target) > 34) {
        var hazard = (sea.spout || []).find(function (spout) {
          return range(w.player, spout) < 115 && range(target, spout) < range(target, w.player);
        });
        if (hazard && range(hazard, target) > 72) {
          var angle = Math.atan2(target.y - sea.y, target.x - sea.x);
          target = { x: hazard.x + Math.cos(angle + Math.PI / 2) * 145, y: hazard.y + Math.sin(angle + Math.PI / 2) * 145 };
        }
        s.vector = pilot.vector(target);
      }
      return;
    }
    if (!storm.deck) return;
    if (step === 2) { pilot.attack(storm.deck.raiders.find(function (e) { return !e.dead; }) || storm.deck.captain); return; }
    if (step === 3 && storm.boss) {
      var boss = storm.boss, p = w.player;
      if (boss.phase === 'windup') {
        var delta = (boss.horizontal ? p.y : p.x) - boss.line;
        if (Math.abs(delta) >= 29) { s.action = 'Waiting beyond the Kraken’s reach'; return; }
        var here = tile(p), line = Math.floor((boss.line - (boss.horizontal ? 3 : 0)) / T);
        var modifiers = delta >= 0 ? [2, -3] : [-2, 3];
        var goals = modifiers.map(function (n) { return boss.horizontal ? { x: here.x, y: line + n } : { x: line + n, y: here.y }; });
        pilot.walk(goals.filter(function (g) { var at = point(g.x, g.y); return !w.blockedAt(at.x, at.y); }), 'Dodging the Kraken’s arms', function () {});
      } else if (boss.phase === 'eye') pilot.attack(boss.eye);
      else pilot.stand(C.eye.x, C.eye.y + 2, 'Waiting for the Kraken’s eye');
    }
    if (step === 4) pilot.object('storm_helm12', 'Walking to the helm');
  }
  function mantera(pilot, step) {
    var w = pilot.world, m = w.mantera, q = w.S.quests, C = LC.C13;
    if (w.area === 'farm') { pilot.object('mantera_letter', 'Walking to Jack’s enchanted letter'); return; }
    if (w.area !== 'mantera' && w.area !== 'manteraVault') { pilot.travel('farm'); return; }
    if (step === 1 && !q.c13Lesson) { pilot.object('mantera_desk', 'Walking to Nek Lampir’s lesson'); return; }
    if (step === 1) {
      pilot.stand(C.rune.x, C.rune.y + 3, 'Practicing Mantera Pantul (' + (q.c13Reflected || 0) + ' / 3)');
      pilot.block(m); return;
    }
    if (step === 2 || step === 6 && w.area === 'mantera') { pilot.object('mantera_suraya', step === 6 ? 'Returning Batu Ikrar to Suraya' : 'Walking to Suraya'); return; }
    if (step === 3) {
      pilot.block(m);
      if (!pilot.dodge(m.meteors)) pilot.attack(m.boss || m.golems.find(function (e) { return !e.dead; }));
      return;
    }
    if (step === 5 && w.area === 'mantera') { pilot.object('mantera_vault_door', 'Walking to the sealed vault'); return; }
    if (step === 5 && m.boss) {
      pilot.block(m);
      if (m.boss.g.manteraSeal) pilot.stand(C.collector.x, C.collector.y + 3, 'Reflecting the Collector’s bolt');
      else if (!pilot.dodge(m.meteors)) pilot.attack(m.boss);
    }
    if (step === 6 && w.area === 'manteraVault') pilot.object('mantera_return', 'Returning to the school');
  }

  function senah(pilot, step) {
    var w = pilot.world, q = w.S.quests, C = LC.C14;
    if (step === 4 && w.S.day <= q.c14day) {
      if (w.area === 'senah') pilot.prop('senah_back', 'Head home for the night');
      else pilot.sleep();
      return;
    }
    if (w.area !== 'senah') {
      if (pilot.travel('kampung')) pilot.prop('senah_way', 'Walk down Kak Senah’s lane');
      return;
    }
    if (step < 3 && w.S.minutes < C.night) pilot.clock(C.night / 60);
    switch (step) {
      case 0: pilot.object('sn_jusoh0', 'Talk to the villagers at the pondok'); break;
      case 1: pilot.prop('senah_house', 'Peek through Kak Senah’s window'); break;
      case 2:
        if (!q.c14sheet) pilot.prop('senah_line', 'Look at the clothesline');
        else if (!q.c14tiong) pilot.prop('senah_sangkar', 'Look at Si Tiong’s birdcage');
        else if (!q.c14amin) pilot.prop('senah_dapur', 'Check the outdoor kitchen');
        else pilot.state.action = 'Wait for the rattling pots';
        break;
      case 3: pilot.prop('senah_penunggu', 'Greet the Penunggu Rumah'); break;
      case 4:
        if (w.S.minutes < C.late) pilot.clock(C.late / 60);
        pilot.stand(C.yard.x, C.yard.y, 'Wait for Kak Senah’s homecoming');
        break;
      case 5:
        if (w.senah.cine) pilot.state.action = 'Watch Kak Senah’s homecoming';
        else pilot.prop('senah_hide', 'Find the runaways');
        break;
      case 6: pilot.prop('senah_kak', 'Raise Pelita’s light'); break;
    }
  }

  function jerebuCan(pilot, refill) {
    var w = pilot.world;
    pilot.supply({ can: 1 });
    var index = w.S.inv.findIndex(function (slot) { return slot && slot.id === 'can'; });
    if (index >= 0 && w.S.sel !== index) w.ui.selectSlot(index);
    if (w.S.water > 0) return true;
    pilot.object(refill, 'Refill the gembor');
    return false;
  }
  function jerebu(pilot, step) {
    var w = pilot.world, q = w.S.quests, C = LC.C15, j = w.jerebu;
    if (step === 0) {
      if (w.senah && (w.senah.finale || w.senah.show || w.senah.gagPending)) {
        w.S.minutes = Math.min(w.S.minutes, LC.DAY_END - 1);
        pilot.state.action = 'Watch Kak Senah’s fireworks'; return;
      }
      if (pilot.travel('farm') && q.c15wait !== undefined && w.S.day <= q.c15wait) pilot.sleep();
      return;
    }
    if (step === 1) { pilot.npc('penghulu'); return; }
    if (step >= 2 && step <= 5 && !pilot.travel('kampung')) return;
    if (step === 2) {
      if (w.S.minutes < C.night) pilot.clock(C.night / 60);
      pilot.stand(20, 8, 'Wait by the wakaf after dark'); return;
    }
    if (step === 3) {
      if (!jerebuCan(pilot, 'k_well')) return;
      var target = C.small.find(function (t) { return j.fires[t.id] && j.fires[t.id].level; });
      if (target) pilot.object(target.id, 'Douse ' + target.name);
      return;
    }
    if (step === 4) { pilot.object('k_bucket15', 'Join the bucket line'); return; }
    if (step === 5) {
      var actors = j.people.filter(function (a) { return !a.calm; });
      actors.sort(function (a, b) { return range(w.player, a.spr) - range(w.player, b.spr); });
      var actor = actors[0];
      if (!actor) return;
      if (LC.hasLagu() && w.laguLeft() <= 0 && range(w.player, actor.spr) <= LC.C9.lagu.r - 4) { w.ui.pressKey('KeyL'); return; }
      var pos = actor.spr, dx = pos.x - w.player.x, dy = pos.y - w.player.y;
      if (Math.hypot(dx, dy) < 31) {
        w.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
        var action = w.getAction();
        if (action && /^Calm /.test(action.label)) { w.doAction(); return; }
      }
      pilot.near(pos.x / T - 0.5, pos.y / T - 0.8, 'Walk to ' + actor.data.name, 20);
      return;
    }
    if (step === 6 || step === 7 && w.area !== 'senah') {
      if (w.S.minutes < C.groveNight) pilot.clock(C.groveNight / 60);
      if (w.area !== 'senah' && pilot.travel('kampung')) pilot.prop('senah_way', 'Follow the sparks to Kak Senah’s lane');
      return;
    }
    if (step === 7) {
      if (jerebuCan(pilot, 'sn_tempayan')) {
        pilot.prop(function (o) { return o.type === 'jerebu_fuse' && !(q.c15fuses || {})[o.i]; }, 'Douse the lit fuses');
      }
      return;
    }
    if (w.area === 'senah') pilot.prop('senah_back', 'Walk back to Kampung Tepian');
    else if (pilot.travel('kampung')) pilot.object('k_rain15', 'Talk to Tok Penghulu at the gelanggang');
  }

  function mamaiTravel(pilot, area) {
    var w = pilot.world;
    if (w.area === area) return true;
    if (w.area === 'senah') pilot.prop('senah_back', 'Walk back to Kampung Tepian');
    else if (area !== 'senah') return pilot.travel(area);
    else if (pilot.travel('kampung')) pilot.prop('senah_way', 'Walk down Kak Senah’s lane');
    return false;
  }

  function wakeMamaiSleepers(pilot) {
    var w = pilot.world, p = w.player;
    var sleepers = w.mamai.sleepers.filter(function (s) { return !s.wake; });
    sleepers.sort(function (a, b) { return range(p, a.spr) - range(p, b.spr); });
    var sleeper = sleepers[0];
    if (!sleeper) { pilot.state.action = 'Wait for everyone to gather'; return; }
    var x = sleeper.spr.x, y = sleeper.spr.y, dx = x - p.x, dy = y - p.y;
    w.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
    var action = w.getAction();
    if (action && /^Give .+ the Jamu Bangun$/.test(action.label)) {
      pilot.state.action = action.label;
      w.doAction();
      return;
    }
    pilot.near(x / T - 0.5, y / T - 0.8, 'Walk to ' + sleeper.name, 20);
  }

  function mamai(pilot, step) {
    var w = pilot.world, q = w.S.quests, C = LC.C16;
    if (step === 0 || step === 6) {
      var rain = w.jerebu && w.jerebu.rain;
      if (step === 0 && rain && rain.time < 3) { pilot.state.action = 'Watch the rain arrive'; return; }
      if (mamaiTravel(pilot, 'farm') && (step === 6 || w.S.day <= q.c16wait)) pilot.sleep();
      return;
    }
    if (step === 1 || step === 5) {
      if (!mamaiTravel(pilot, 'kampung')) return;
      if (step === 5 && w.S.minutes < C.majlis) pilot.clock(C.majlis / 60);
      pilot.object('k_tokp16', step === 1 ? 'Talk to Tok Penghulu' : 'Join the majlis at the gelanggang');
      return;
    }
    if (step === 2) {
      var invite = C.invites.find(function (v) { return !(q.c16inv || {})[v.who]; });
      if (invite && mamaiTravel(pilot, invite.obj.indexOf('sn_') === 0 ? 'senah' : 'kampung')) pilot.object(invite.obj, 'Invite ' + invite.name);
      return;
    }
    if (step === 3) {
      var helpers = q.c16help || {};
      if (!helpers.amin) {
        if (mamaiTravel(pilot, 'senah')) pilot.object('sn_amin2', 'Ask Amin to help in the kitchen');
      } else if (mamaiTravel(pilot, 'farm')) {
        if (!helpers.bara) pilot.object('f_sibara15', 'Ask Si Bara to tend the fire');
        else pilot.state.action = 'Wait for Nek Lampir at the dapur';
      }
      return;
    }
    if (step === 4 && mamaiTravel(pilot, 'farm')) {
      var pot = Object.keys(C.pots).find(function (key) { return !(q.c16cook || {})[key]; });
      if (pot) {
        pilot.supply(C.pots[pot].need);
        pilot.object('f_periuk16_' + pot + '0', 'Cook ' + C.pots[pot].name);
      }
      return;
    }
    if (step === 7) {
      var clues = q.c16clue || {};
      if (!clues.amin) {
        if (mamaiTravel(pilot, 'kampung')) pilot.object('k_amin16', 'Ask Amin about the sleepwalkers');
      } else if (mamaiTravel(pilot, 'farm')) {
        if (!clues.jar) pilot.object('f_balang16', 'Inspect the little jar');
        else pilot.object('f_sibara15', 'Ask Si Bara what he saw');
      }
      return;
    }
    if (step === 8 || step === 9) {
      if (!mamaiTravel(pilot, 'farm')) return;
      if (step === 9) pilot.supply(C.jamu);
      pilot.object('f_lampir16', step === 8 ? 'Show Nek Lampir the jar' : 'Brew Jamu Bangun');
      return;
    }
    if (step === 10 && mamaiTravel(pilot, 'kampung')) wakeMamaiSleepers(pilot);
  }

  var routes = LC.DevRoutes = { 12: storm, 13: mantera, 14: senah, 15: jerebu, 16: mamai };
  var methods = LC.DevAutoplay = {
    supports: function (chapter) { return !!routes[chapter]; },
    start: function (speed, onStatus, onStop) {
      runner = { speed: speed, status: onStatus, stop: onStop, vector: null, last: '', action: '', stepAt: performance.now() };
    },
    stop: function (message) { var old = runner; runner = null; if (old) old.stop(message); }
  };
  var touch = U.touchVec;
  U.touchVec = function () { return runner ? runner.vector : touch.apply(this, arguments); };
  var move = W.updatePlayer;
  W.updatePlayer = function (dt, blocked) {
    if (!runner || !this.ui || !this.ui.ready) return move.apply(this, arguments);
    var s = runner, world = this, q = world.S.quests;
    s.vector = null;
    var chapter = q.ch2 ? LC.CHAPTER_LIST.find(function (item) { return (q[item.key] || 0) < item.end; }) : LC.DevStory.chapters[0];
    var finished = !chapter;
    var rain = world.jerebu && world.jerebu.rain;
    var spirit = world.mamai && world.mamai.spirit;
    if (finished && !blocked && !world.ui.modal && (!rain || rain.time >= 3) && (!spirit || !spirit.active)) { methods.stop('Story complete.'); return move.call(this, dt, blocked); }
    if (finished) chapter = LC.CHAPTER_LIST[LC.CHAPTER_LIST.length - 1];
    var step = q[chapter.key] || 0;
    var key = [chapter.n, step, world.area, world.war && world.war.wave, q.c4wave, q.c13Reflected, q.c12Rescued].join(':');
    if (s.last !== key) { s.last = key; s.stepAt = performance.now(); s.routeKey = null; s.action = ''; }
    if (performance.now() - s.stepAt > 120000) { methods.stop('Autoplay paused. Take over at the current objective.'); return; }
    var play = routes[chapter.n];
    if (!play) { methods.stop('Manual play starts at Chapter ' + chapter.n + '.'); return; }
    if (world.ui.modal && world.ui.modal.type === 'dialog') {
      if (world.time.now - (s.lastDialogue || 0) > 105 / s.speed()) {
        s.lastDialogue = world.time.now;
        var modal = world.ui.modal, answer = modal.devAnswer;
        var choice = answer ? { test: function (label) { return label === answer; } } : s.choice;
        if (!modal.devChoice || !choice || !modal.devChoice(choice)) world.ui.pressKey('KeyE');
      }
    } else if (world.ui.modal && world.ui.modal.devTick) world.ui.modal.devTick();
    else if (world.ui.modal && world.ui.modal.devChoose) {
      if (!s.menu || !world.ui.modal.devChoose(s.menu)) world.ui.closeModal();
      s.menu = null;
    } else if (world.ui.modal && world.ui.modal.type === 'summary') world.ui.pressKey('KeyE');
    else if (!finished && !blocked && !world.cameras.main.fadeEffect.isRunning) {
      try {
        var pilot = new Pilot(world, s);
        if (!pilot.heal()) play(pilot, step);
      } catch (error) {
        methods.stop('Autoplay stopped at Chapter ' + chapter.n + '. You have control.');
        console.error(error);
      }
    }
    s.status(chapter.n, step, finished ? 'Finishing the story' : s.action || chapter.steps[step]);
    return move.call(this, Math.min(dt * s.speed(), 0.08), blocked);
  };

  var bond = LC.State.addBond;
  LC.State.addBond = function (n) { return bond.call(this, runner && !this.s.quests.ch2 ? n * 24 : n); };
})(window.LC);
