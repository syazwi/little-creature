/* World, part 7 (v1.8): Nenek's house as it grows (the new wing beside it, carved gables at the last stage), the hired
 * helpers working around the farm, and the restored brick path to the old tower in Bukit Pasir. Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var T = 16;
  function awake(S) { return S.minutes >= 6 * 60 && S.minutes < 21 * 60; }

  Object.assign(LC.WorldScene.prototype, {
    createHome: function () {
      this.helperSpr = {};
      this.refreshHouse();
      this.refreshHelpers();
    },
    updateHome: function (time, dt) {
      var self = this, S = this.S, on = awake(S), p = this.player;
      Object.keys(this.helperSpr).forEach(function (k) {
        var h = self.helperSpr[k];
        if (h.here !== on) {
          h.here = on; h.spr.setVisible(on);
          self.solid[h.ty][h.tx] = on; self.objAt[h.ty][h.tx] = on ? h.o : null;
        }
        if (on && Math.abs(p.x - h.spr.x) < 60 && Math.abs(p.y - h.spr.y) < 40) h.spr.setFlipX(p.x < h.spr.x - 2);
      });
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

    // ---------------------------------------------------------------- the helpers, at their work spots
    refreshHelpers: function () {
      var self = this, S = this.S, h = S.helpers || {};
      Object.keys(this.helperSpr || {}).forEach(function (k) {
        var o = self.helperSpr[k];
        o.spr.destroy();
        if (self.objAt[o.ty][o.tx] === o.o) { self.solid[o.ty][o.tx] = false; self.objAt[o.ty][o.tx] = null; }
      });
      this.helperSpr = {};
      if (this.area !== 'farm') return;
      LC.HELPER_ORDER.forEach(function (k) {
        if (!h[k]) return;
        var H = LC.HELPERS[k], x = H.spot.x * T + 8, y = (H.spot.y + 1) * T;
        var spr = self.add.sprite(x, y, 'npc_h_' + k + '_0').setOrigin(0.5, 1).setDepth(y);
        spr.play('npc_h_' + k + '_idle');
        self.helperSpr[k] = { spr: spr, tx: H.spot.x, ty: H.spot.y, o: { type: 'helper', k: k }, here: null };
      });
    },
    helperAction: function (o) {
      var self = this, H = LC.HELPERS[o.k];
      return { label: 'Talk to ' + H.name, fn: function () {
        LC.Audio.sfx('pet');
        self.ui.say([{ name: H.name, portrait: 'npc_h_' + o.k + '_0', text: H.chat[Math.floor(Math.random() * H.chat.length)] },
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
