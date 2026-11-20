/* World, part 19 (v2.7.1): shared looks in co-op (see worldview.js). Every couple of seconds, tell your friends how far
 * you have built; when a friend's progress arrives while you are standing in Barunai, Gunung Ledang or Bukit Pasir, the
 * walkways, bridge, path, buildings and craftspeople appear at once, without leaving. A house plot that only a friend
 * has opened is theirs: you can look, not build. Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var T = 16, proto = LC.WorldScene.prototype, N = LC.Net;
  var SYNC = { barunai: 'syncBarunai', ledang: 'syncLedang', desert: 'syncDesert' };

  var createKampong = proto.createKampong;
  proto.createKampong = function () {
    createKampong.apply(this, arguments);
    this.shared = { t: 0.5, ver: N.progVer, chars: this.grid.map(function (r) { return r.slice(); }) };
  };
  var updateKampong = proto.updateKampong;
  proto.updateKampong = function (time, dt) {
    updateKampong.apply(this, arguments);
    var sh = this.shared;
    if (!sh || !N.role) return;
    if ((sh.t -= dt) <= 0) { sh.t = 2; N.sendProg(); }
    if (sh.ver !== N.progVer && !this.leaving && !this.sleeping) { sh.ver = N.progVer; this.refreshShared(); }
  };
  // a plot only a friend has opened: you can look, not build
  var kampongObjAction = proto.kampongObjAction;
  proto.kampongObjAction = function (o) {
    if (o.type === 'kplot' && (LC.kaStage() || 0) < 3) {
      var self = this, plots = (LC.worldQuests().kaPlots || {});
      return { label: plots[o.id] ? 'A friend\'s house over the river' : 'Empty pilings', fn: function () { self.toast('Your friend built these over the river. (In your own story, Kampong Ayer has not grown this far yet.)', 'ic_bond'); } };
    }
    return kampongObjAction.call(this, o);
  };

  Object.assign(proto, {
    refreshShared: function () {   // a friend's progress changed what this place looks like
      var self = this, fn = SYNC[this.area];
      if (fn && LC[fn]) {
        LC[fn]();
        var TI = LC.Art.TI, old = this.shared.chars, cells = [], changed = {};
        for (var y = 0; y < this.H; y++) for (var x = 0; x < this.W; x++) if (old[y][x] !== this.grid[y][x]) { old[y][x] = this.grid[y][x]; cells.push([x, y]); changed[x + ',' + y] = 1; }
        this.animTiles = this.animTiles.filter(function (a) { return !changed[a.x + ',' + a.y]; });
        cells.forEach(function (c) {
          var x = c[0], y = c[1], ch = self.grid[y][x];
          var idx = ch === 'j' ? TI.JETTY : ch === 'w' ? TI.RIV0 : ch === 'S' ? TI.SHORE0 : ch === 'k' ? TI.STONEP : ch === 'd' ? TI.DUNE0 : null;
          if (idx === null || idx === undefined) return;
          var tile = self.ground.putTileAt(idx, x, y);
          if (ch === 'w' || ch === 'S') self.animTiles.push({ x: x, y: y, k: ch === 'w' ? 'river' : 'shore', tile: tile });
          if (!self.objAt[y][x]) self.solid[y][x] = !!LC.SOLID_TILES[ch];
          if (Math.random() < 0.2) self.fx.sparkle.explode(1, x * T + 8, y * T + 8);
        });
      }
      if (this.refreshWhen) this.refreshWhen();
      if (this.area === 'barunai' && this.refreshKPlots) this.refreshKPlots();
      Object.keys(LC.VILLAGERS).forEach(function (vid) {   // the craftspeople move into the craft quarter
        if (LC.VILLAGERS[vid].craft && !self.npcs[vid] && LC.villagerArea(vid) === self.area) self.placeVillager(vid);
      });
    }
  });
})(window.LC);
