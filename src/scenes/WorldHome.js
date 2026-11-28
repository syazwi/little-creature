/* World, part 7 (v1.8): Nenek's house as it grows (the new wing beside it, carved gables at the last stage), the hired
 * helpers working around the farm, and the restored brick path to the old tower in Bukit Pasir. Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var T = 16;
  var STEPS = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  function awake(S) { return S.minutes >= 6 * 60 && S.minutes < 21 * 60; }
  function tileAt(sprite) { return { x: Math.floor(sprite.x / T), y: Math.floor((sprite.y - 1) / T) }; }
  function spot(x, y, icon) { return { x: x, y: y, icon: icon }; }
  function walkable(world, x, y) { return world.solid[y] && world.solid[y][x] === false; }
  var world = LC.WorldScene.prototype, objectAction = world.objectAction;
  world.objectAction = function (o) {
    var self = this;
    if (o.type === 'farmhouse_exit') return { label: 'Leave house', fn: function () {
      self.goArea('farm', self.tilePx({ x: 4, y: 8 }), 'down');
    } };
    if (o.type === 'farmhouse_bed') return { label: 'Sleep', fn: function () {
      self.ui.confirmSleep({ area: 'farmhouse', x: 5, y: 6 });
    } };
    return objectAction.apply(this, arguments);
  };

  function helperPath(world, from, to) {
    var width = world.W, start = from.y * width + from.x, best = start;
    var distance = Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
    var previous = new Int32Array(width * world.H).fill(-1), queue = [start];
    previous[start] = start;
    for (var i = 0; i < queue.length && distance; i++) {
      var cell = queue[i], x = cell % width, y = Math.floor(cell / width);
      for (var j = 0; j < STEPS.length; j++) {
        var nx = x + STEPS[j][0], ny = y + STEPS[j][1], next = ny * width + nx;
        if (!walkable(world, nx, ny) || previous[next] !== -1) continue;
        previous[next] = cell; queue.push(next);
        var d = Math.abs(nx - to.x) + Math.abs(ny - to.y);
        if (d < distance) { best = next; distance = d; }
      }
    }
    var path = [];
    // Reach the nearest open tile if a chest or other obstacle covers a work spot.
    for (var p = best; p !== start; p = previous[p]) path.push(spot(p % width, Math.floor(p / width)));
    return path.reverse();
  }

  function helperStops(k) {
    var start = LC.HELPERS[k].spot;
    switch (k) {
      case 'ladang': {
        var field = LC.fieldRect();
        return [start, spot(field.x0 + 1, field.y0 + 2, 'i_can'), spot(field.x0 + 1, field.y1 - 1, 'i_hoe'),
          spot(field.x1 - 1, field.y1 - 1, 'i_can'), spot(field.x1 - 1, field.y0 + 2, 'i_hoe'), spot(15, 9, 'i_can')];
      }
      case 'kutip': return [start, spot(2, 15, 'i_pisang'), spot(3, 24, 'i_pisang'), spot(11, 26, 'i_kelapa'),
        spot(40, 17, 'i_mangga'), spot(24, 5, 'i_susu'), spot(19, 5, 'i_telur')];
      case 'masak': return [start, spot(7, 9, 'i_nasi'), spot(14, 9, 'i_can'), spot(8, 10, 'i_nasi')];
      case 'pelita': return [start, spot(10, 8, 'ic_glow'), spot(8, 9, 'i_pulut_mangga'), spot(12, 7, 'ic_joy')];
      case 'stor': return [start, spot(6, 10, 'i_almari'), spot(40, 9, 'i_kepeng'), spot(7, 11, 'i_almari')];
      case 'manager': return [start, spot(7, 9, 'ic_chap'), spot(14, 9, 'ic_chap'), spot(11, 10, 'i_almari')];
    }
  }

  function stopToWork(h, time) {
    var task = h.stops[h.stop], spr = h.spr;
    h.wait = task.icon ? 2.5 : 0.7;
    spr.play(h.key + '_idle', true);
    if (!task.icon || Math.abs(task.x - h.tile.x) + Math.abs(task.y - h.tile.y) > 1) return;
    h.prop.setTexture(task.icon).setVisible(true).setPosition(spr.x + (spr.flipX ? -7 : 7), spr.y - 8 + Math.sin(time / 170)).setDepth(spr.y + 1);
  }

  Object.assign(LC.WorldScene.prototype, {
    createHome: function () {
      this.helperSpr = {};
      if (this.area === 'farmhouse') {
        if (this.S.quests.c12Bell) this.objImgs.farmhouse_bell.setTexture('family_bell_empty');
        this.add.image(14 * T, 8.5 * T, 'farmhouse_mat').setDepth(-1);
        this.add.image(5 * T, 2.8 * T, 'farmhouse_window').setDepth(1);
        this.add.image(13 * T, 2.8 * T, 'farmhouse_window').setDepth(1);
        this.addLight(13 * T, 3.2 * T, 0xffc578, 0.75, false);
      }
      this.refreshHouse();
      this.refreshHelpers();
    },
    enterFarmhouse: function () {
      if (this.area !== 'farm') return;
      LC.Audio.sfx('creak11');
      this.goArea('farmhouse', undefined, 'up');
    },
    updateHome: function (time, dt) {
      if (this.area !== 'farm' || !dt) return;
      var on = awake(this.S);
      for (var k in this.helperSpr) {
        var h = this.helperSpr[k];
        var spr = h.spr;
        if (spr.visible !== on) {
          spr.setVisible(on);
          if (on) spr.anims.resume();
          else { spr.anims.pause(); h.prop.setVisible(false); }
        }
        if (on) this.moveHelper(h, time, dt);
      }
    },

    moveHelper: function (h, time, dt) {
      if (h.wait > 0) {
        h.wait -= dt;
        if (h.prop.visible) h.prop.y = h.spr.y - 8 + Math.sin(time / 170);
        return;
      }
      if (!h.path.length) {
        h.stop = (h.stop + 1) % h.stops.length;
        h.path = helperPath(this, h.tile, h.stops[h.stop]);
        h.prop.setVisible(false);
      } else if (!walkable(this, h.path[0].x, h.path[0].y)) {
        h.spr.setPosition(h.tile.x * T + T / 2, (h.tile.y + 1) * T).setDepth((h.tile.y + 1) * T);
        h.path = helperPath(this, h.tile, h.stops[h.stop]);
      }
      if (!h.path.length) { stopToWork(h, time); return; }
      var next = h.path[0], spr = h.spr;
      var x = next.x * T + T / 2, y = (next.y + 1) * T;
      var dx = x - spr.x, dy = y - spr.y, distance = Math.hypot(dx, dy), step = h.speed * dt;
      if (dx) spr.setFlipX(dx < 0);
      spr.play(h.key + '_walk', true);
      if (distance <= step) {
        spr.setPosition(x, y).setDepth(y);
        h.tile = h.path.shift();
        if (!h.path.length) stopToWork(h, time);
      } else {
        spr.setPosition(spr.x + dx / distance * step, spr.y + dy / distance * step).setDepth(spr.y);
      }
    },

    // ---------------------------------------------------------------- the house
    refreshHouse: function () {
      if (this.area !== 'farm') return;
      var self = this, st = this.S.house || 0;
      if (this.houseImg) this.houseImg.setTexture(st >= 3 ? 'house_ukir' : 'house');
      if (st < 1) return;
      this.objects.forEach(function (o) {
        if (o.id !== 'h_wing') return;
        var im = self.objImgs[o.id];
        if (!im) {   // the new wing appears (the morning after it was built, or at once with Badang)
          var bx = (o.x + o.w / 2) * T, by = (o.y + o.h) * T;
          im = self.objImgs[o.id] = self.add.image(bx, by, 'wing_1').setOrigin(0.5, 1).setDepth(by);
          self.fx.smoke.explode(12, bx, by - 30);
          for (var y = o.y; y < o.y + o.h; y++) for (var x = o.x; x < o.x + o.w; x++) { self.solid[y][x] = true; self.objAt[y][x] = o; }
        }
        im.setTexture('wing_' + Math.min(3, st));
      });
    },

    // ---------------------------------------------------------------- the helpers
    refreshHelpers: function () {
      if (this.area !== 'farm') return;
      var self = this, hired = this.S.helpers || {};
      LC.HELPER_ORDER.forEach(function (k, i) {
        var h = self.helperSpr[k];
        if (!hired[k]) {
          if (h) { h.spr.destroy(); h.prop.destroy(); delete self.helperSpr[k]; }
          return;
        }
        var stops = helperStops(k);
        if (h) { h.stops = stops; return; }
        var start = stops[0], key = 'npc_h_' + k;
        if (!walkable(self, start.x, start.y)) {
          var origin = tileAt(self.player), path = helperPath(self, origin, start);
          start = path.pop() || origin;
        }
        var x = start.x * T + T / 2, y = (start.y + 1) * T, on = awake(self.S);
        var spr = self.add.sprite(x, y, key + '_0').setOrigin(0.5, 1).setDepth(y).setVisible(on);
        spr.play(key + '_idle');
        if (!on) spr.anims.pause();
        var prop = self.add.image(x, y, 'i_nasi').setScale(0.65).setVisible(false);
        self.helperSpr[k] = { spr: spr, prop: prop, key: key, tile: start, stops: stops, stop: 0, path: [], wait: 0.5 + i * 0.15, speed: 34 + i * 2 };
      });
    },

    helperAt: function (x, y) {
      if (this.area !== 'farm') return null;
      for (var k in this.helperSpr) {
        var spr = this.helperSpr[k].spr;
        if (!spr.visible) continue;
        var tile = tileAt(spr);
        if (tile.x === x && tile.y === y) return k;
      }
      return null;
    },

    helperAction: function (k) {
      var self = this, H = LC.HELPERS[k];
      return { label: 'Talk to ' + H.name, fn: function () {
        LC.Audio.sfx('pet');
        if (k === 'manager') {
          self.ui.say([{ name: H.name, portrait: 'npc_h_manager_0', text: LC.Home.managerReport() }]);
          return;
        }
        self.ui.say([{ name: H.name, portrait: 'npc_h_' + k + '_0', text: H.chat[Math.floor(Math.random() * H.chat.length)] },
          { text: H.name + ', your ' + H.role.toLowerCase() + ' (' + H.wage + ' kepeng a day). ' + H.does }]);
      } };
    },

    // ---------------------------------------------------------------- Bukit Pasir: the brick path to the old tower
    refreshDesertPath: function () {
      LC.syncDesert();
      if (this.area !== 'desert') return;
      var P = LC.TOWER_PATH, TI = LC.Art.TI, g = this.grid;
      for (var y = P.y0; y <= P.y1; y++) for (var x = P.x0; x <= P.x1; x++) this.ground.putTileAt(g[y][x] === 'k' ? TI.STONEP : TI.DUNE0, x, y);
      this.fx.dirt.explode(16, (P.x0 + 1) * T, (P.y0 + 3) * T);
    }
  });
})(window.LC);
