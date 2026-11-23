/* World, tap to use (v3.9). Players on phones asked for it: walk with the joystick, but tap a person, Pelita, an animal,
 * a crop or anything near you to use it, instead of turning to face it and pressing USE. A tap runs exactly what USE
 * would do if you were facing the tapped spot (getAction reads facing(), so for that one call facing() returns the tap).
 * Reach: two steps. Too far, and a small "Walk closer" hint. Enemies: a tap swings at them. Pelita: a tap pets it (or
 * feeds it what you hold). Things you can tap glow softly at their feet (touch screens, while Tap to use is on).
 * Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var T = 16, proto = LC.WorldScene.prototype, REACH = 2, MARKS = 8;
  var ADD = function () { return Phaser.BlendModes.ADD; };
  LC.tapOn = function () { try { return localStorage.getItem('littleCreature.tapUse') !== 'off'; } catch (e) { return true; } };
  LC.setTapOn = function (on) { try { localStorage.setItem('littleCreature.tapUse', on ? 'on' : 'off'); } catch (e) { /* storage blocked */ } };

  var facing = proto.facing;
  proto.facing = function () { return this.tapFace || facing.apply(this, arguments); };
  var createKampong = proto.createKampong;
  proto.createKampong = function () { createKampong.apply(this, arguments); this.tapMarks = []; this.tapMarkT = 0; this.tapHintAt = 0; };
  var updateKampong = proto.updateKampong;
  proto.updateKampong = function (time, dt) { updateKampong.apply(this, arguments); this.updateTapMarks(time, dt); };

  function dirTo(dx, dy) { return Math.abs(dx) >= Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down'); }

  Object.assign(proto, {
    tapReady: function () {
      return !!(this.player && this.ui && !this.sleeping && !this.leaving && !this.cutscene && !this.ui.isBlocking() && !this.A.sailing && !this.fishing);
    },
    tapTooFar: function () {
      var now = this.time.now, p = this.player;
      if (now - this.tapHintAt < 900) return;
      this.tapHintAt = now;
      this.ui.floatText(p.x, p.y - 30, 'Walk closer', '#ffe8a0');
      LC.Audio.sfx('click');
    },
    tapLook: function (dir) {   // turn to face what you tapped
      var p = this.player;
      this.dir = dir;
      if (!this.S.riding && !(p.anims && p.anims.isPlaying)) p.setTexture(this.plKey + '_' + (dir === 'left' || dir === 'right' ? 'side' : dir) + '_0');
      p.setFlipX(dir === 'left');
    },
    // what lies under a tap: Pelita, an enemy, a villager or animal, an object (also its tall picture), or a plain tile
    tapTarget: function (x, y) {
      var self = this, best = null, g = this.ghost;
      if (g && g.visible && Math.hypot(x - g.x, y - g.y) < 16) return { kind: 'pelita', x: g.x, y: g.y };
      (this.enemies || []).forEach(function (e) {
        if (best || e.dead || e.away || !e.spr.visible) return;
        var cy = e.spr.y - e.spr.displayHeight / 2;
        if (Math.hypot(x - e.spr.x, y - cy) < 12 + e.def.w) best = { kind: 'enemy', e: e, x: e.spr.x, y: e.spr.y };
      });
      if (best) return best;
      Object.keys(this.npcs || {}).forEach(function (vid) {
        var n = self.npcs[vid];
        if (best || !n || !n.spr || !n.spr.visible) return;
        var b = n.spr.getBounds();
        if (x >= b.x - 4 && x <= b.right + 4 && y >= b.y - 4 && y <= b.bottom + 4) best = { kind: 'thing', tx: n.tx, ty: n.ty };
      });
      if (best) return best;
      var cr = this.critterAt && this.critterAt(x, y);
      if (cr) return { kind: 'thing', tx: Math.floor(x / T), ty: Math.floor(y / T), fx: x, fy: y };
      var tx = Math.floor(x / T), ty = Math.floor(y / T);
      if (tx < 0 || ty < 0 || tx >= this.W || ty >= this.H) return null;
      if (this.objAt[ty][tx]) return { kind: 'thing', tx: tx, ty: ty };
      // a tall picture (a house, a tree, a mast) stands above its footprint: find whose picture you tapped
      for (var dy = 1; dy <= 5 && !best; dy++) for (var dx = -2; dx <= 2 && !best; dx++) {
        var yy = ty + dy, xx = tx + dx;
        if (yy >= this.H || xx < 0 || xx >= this.W) continue;
        var o = this.objAt[yy][xx];
        if (!o) continue;
        var img = (o.id && this.objImgs && this.objImgs[o.id]) || (o.id && this.trees && this.trees[o.id] && this.trees[o.id].spr);
        if (img && img.visible && img.getBounds().contains(x, y)) best = this.tapNearestTile(o);
      }
      if (best) return best;
      return { kind: 'tile', tx: tx, ty: ty };
    },
    tapNearestTile: function (o) {   // of an object's footprint, the tile nearest to you
      var p = this.player, ptx = Math.floor(p.x / T), pty = Math.floor((p.y - 3) / T), best = null, bd = 1e9;
      for (var y = o.y; y < o.y + (o.h || 1); y++) for (var x = o.x; x < o.x + (o.w || 1); x++) {
        var d = Math.max(Math.abs(x - ptx), Math.abs(y - pty));
        if (d < bd) { bd = d; best = { kind: 'thing', tx: x, ty: y }; }
      }
      return best;
    },
    // a quick tap on the world (screen coordinates, from the UI scene)
    tapUse: function (sx, sy) {
      if (!this.tapReady()) return false;
      var self = this, p = this.player, wp = this.cameras.main.getWorldPoint(sx, sy), x = wp.x, y = wp.y;
      var t = this.tapTarget(x, y);
      if (!t) return false;
      var px = p.x, py = p.y - 6, sl = LC.State.selItem(), it = sl ? LC.ITEMS[sl.id] : null;
      if (t.kind === 'pelita') {
        if (Math.hypot(t.x - px, t.y - py) > 56) { this.tapTooFar(); return true; }
        this.tapLook(dirTo(t.x - px, t.y - py));
        if (it && it.food && this.feedGhost) this.feedGhost(sl.id); else this.petGhost();
        this.shockwave(t.x, t.y, 14, 0xfff2b0);
        return true;
      }
      if (t.kind === 'enemy') {
        if (Math.hypot(t.x - p.x, t.y - p.y) > 64) { this.tapTooFar(); return true; }
        this.tapLook(dirTo(t.x - p.x, t.y - p.y));
        if (this.weaponOf(sl)) this.attack(); else this.toast('Hold a weapon (or the cangkul) in your hand to fight.', 'i_parang');
        return true;
      }
      var ptx = Math.floor(p.x / T), pty = Math.floor((p.y - 3) / T), d = Math.max(Math.abs(t.tx - ptx), Math.abs(t.ty - pty));
      if (d === 0) { this.doAction(); return true; }   // your own spot: USE as usual
      if (d > REACH) { if (t.kind === 'thing') this.tapTooFar(); return t.kind === 'thing'; }
      this.tapLook(dirTo(t.tx - ptx, t.ty - pty));
      this.tapFace = { tx: t.tx, ty: t.ty, fx: t.fx !== undefined ? t.fx : t.tx * T + 8, fy: t.fy !== undefined ? t.fy : t.ty * T + 8 };
      var acted = false;
      try {
        var a = this.getAction();
        if (a && a.fn) { acted = !!a.label || t.kind === 'thing'; this.lastTap = a.label || '(look)'; this.doAction(); }   // (lastTap: for the tests)
      } finally { this.tapFace = null; }
      if (acted && !this.leaving) this.shockwave(t.tx * T + 8, t.ty * T + 10, 12, 0xfff2b0);
      void self;
      return acted;
    },

    // ---------------------------------------------------------------- what you can tap glows softly at its feet
    updateTapMarks: function (time, dt) {
      var self = this, on = !!(this.ui && this.ui.touchOn && LC.tapOn() && this.tapReady() && !this.hasEnemies());
      if (!this.tapMarks) return;
      if ((this.tapMarkT -= dt) > 0 && on) { this.tapMarks.forEach(function (m) { if (m.visible) m.setAlpha(0.32 + 0.18 * Math.sin(time / 300)); }); return; }
      this.tapMarkT = 0.25;
      var spots = [];
      if (on) {
        var p = this.player, ptx = Math.floor(p.x / T), pty = Math.floor((p.y - 3) / T), seen = [];
        for (var dy = -REACH; dy <= REACH; dy++) for (var dx = -REACH; dx <= REACH; dx++) {
          var tx = ptx + dx, ty = pty + dy;
          if ((!dx && !dy) || tx < 0 || ty < 0 || tx >= this.W || ty >= this.H) continue;
          var o = this.objAt[ty][tx], crop = this.area === 'farm' && LC.State.tile(tx, ty), ripe = crop && crop.crop && LC.cropStage(crop.crop) === 3;
          if (!o && !ripe) continue;
          if (o && seen.indexOf(o) >= 0) continue;
          this.tapFace = { tx: tx, ty: ty, fx: tx * T + 8, fy: ty * T + 8 };
          var a = null;
          try { a = this.getAction(); } catch (e) { a = null; } finally { this.tapFace = null; }
          if (!a || !a.label || a.swing) continue;
          if (o) seen.push(o);
          spots.push({ x: tx * T + 8, y: ty * T + 13 });
          if (spots.length >= MARKS) break;
        }
      }
      while (this.tapMarks.length < spots.length) this.tapMarks.push(this.add.image(0, 0, 'glow').setBlendMode(ADD()).setTint(0xfff2b0).setScale(0.5, 0.28).setDepth(5));
      this.tapMarks.forEach(function (m, i) {
        var s = spots[i];
        m.setVisible(!!s);
        if (s) m.setPosition(s.x, s.y).setAlpha(0.32 + 0.18 * Math.sin(time / 300));
      });
      void self;
    }
  });
})(window.LC);
