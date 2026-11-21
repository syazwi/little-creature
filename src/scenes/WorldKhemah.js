/* World + UI (v2.7.5): the khemah (data in khemah.js). Pitch it with the tent in your hand, sleep in it and wake up
 * right there, pack it back into your bag. It is drawn with the chests (refreshChests), and Journal > You says where it
 * is. Mixed into LC.WorldScene and LC.UIScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var T = 16, proto = LC.WorldScene.prototype, X = LC.KHEMAH_TEXT;

  // two tiles of open ground, and open ground in front of the door (you wake up there)
  function spotOk(W, x, y) {
    for (var dx = 0; dx < 2; dx++) {
      var xx = x + dx;
      if (!W.solid[y] || W.solid[y][xx] === undefined || W.solid[y][xx] || !LC.chestSpotOk(W.area, xx, y)) return false;
    }
    var row = W.grid[y + 1], ch = row && row[x];
    return !!row && ch !== undefined && !W.solid[y + 1][x] && !LC.WATER_TILES[ch] && !LC.SOLID_TILES[ch];
  }

  var toolAction15 = proto.toolAction15;
  proto.toolAction15 = function (sl, it, ch, t, tx, ty, hint) {
    if (it.kind !== 'tent') return toolAction15.apply(this, arguments);
    var self = this;
    if (LC.Net.isGuest()) return hint(X.guest);
    if (this.A.underwater || this.A.cave) return hint(X.deep);
    // the tent goes in front of you and never over where you stand
    var tries = this.dir === 'left' ? [tx - 1] : this.dir === 'right' ? [tx] : [tx, tx - 1];
    for (var i = 0; i < tries.length; i++) {
      if (spotOk(this, tries[i], ty)) { var x = tries[i]; return { label: 'Pitch the khemah', tile: true, fn: function () { self.pitchTent(x, ty); } }; }
    }
    return hint(X.where);
  };

  var objectAction = proto.objectAction;
  proto.objectAction = function (o) {
    if (o.type === 'khemah') return this.tentAction();
    return objectAction.apply(this, arguments);
  };

  var refreshChests = proto.refreshChests;
  proto.refreshChests = function () {
    refreshChests.apply(this, arguments);
    this.refreshTent();
  };

  Object.assign(proto, {
    refreshTent: function () {
      var self = this, S = this.S, t = S.tent, old = this.tentSpr;
      if (old) {
        old.img.destroy();
        for (var dx = 0; dx < 2; dx++) if (this.objAt[old.y][old.x + dx] && this.objAt[old.y][old.x + dx].type === 'khemah') { this.solid[old.y][old.x + dx] = false; this.objAt[old.y][old.x + dx] = null; }
        this.tentSpr = null;
      }
      if (!t || S.guest || t.area !== this.area || !this.solid[t.y]) return;
      var blocked = [0, 1].some(function (d) { var c = self.grid[t.y][t.x + d]; return c === undefined || self.objAt[t.y][t.x + d] || LC.SOLID_TILES[c] || LC.WATER_TILES[c]; });
      if (blocked) {   // something new stands there now: the khemah goes back in your bag
        if (LC.State.add('khemah', 1)) { delete S.tent; this.time.delayedCall(1200, function () { if (self.ui) self.toast(X.moved, 'i_khemah'); }); }
        return;
      }
      var by = (t.y + 1) * T, o = { type: 'khemah' };
      this.tentSpr = { img: this.add.image((t.x + 1) * T, by, 'khemah').setOrigin(0.5, 1).setDepth(by), x: t.x, y: t.y };
      for (var d = 0; d < 2; d++) { this.solid[t.y][t.x + d] = true; this.objAt[t.y][t.x + d] = o; }
    },
    pitchTent: function (x, y) {
      var S = this.S;
      if (!LC.State.remove('khemah', 1)) return;
      S.tent = { area: this.area, x: x, y: y, day: S.day };
      this.refreshTent();
      LC.Audio.sfx('build'); this.fx.dirt.explode(8, (x + 1) * T, y * T + 12);
      this.toast(X.pitched, 'i_khemah');
      LC.State.save();
    },
    packTent: function () {
      var S = this.S;
      if (!S.tent) return;
      if (!LC.State.canAdd('khemah')) { LC.Audio.sfx('error'); this.toast('Your bag is full! Make room for the khemah first.'); return; }
      delete S.tent;
      LC.State.add('khemah', 1);
      this.refreshTent();
      LC.Audio.sfx('build');
      this.toast(X.packed, 'i_khemah');
      LC.State.save();
    },
    tentAction: function () {
      var self = this, S = this.S, t = S.tent;
      if (!t) return null;
      return { label: 'Your khemah', fn: function () {
        var stay = { area: t.area, x: t.x, y: t.y + 1, name: 'your khemah' }, N = LC.Net;
        self.ui.say([{ text: X.look + ' ' + (S.minutes < 18 * 60 ? X.early : X.night) }], { choices: [
          { label: 'Sleep', fn: function () { if (N.isHost() && N.count() > 1) self.ui.confirmSleep(stay); else self.sleep(false, stay); } },
          { label: 'Pack it up', fn: function () { self.packTent(); } },
          { label: 'Not now' }
        ] });
      } };
    }
  });

  // Journal > You: where your khemah is
  var ui = LC.UIScene.prototype, youRows = ui.youRows;
  ui.youRows = function () {
    var rows = youRows.apply(this, arguments), S = this.S, t = S.tent;
    if (t && LC.AREAS[t.area]) rows.push({ icon: 'i_khemah', label: 'Your khemah: pitched in ' + LC.AREAS[t.area].name, sub: 'Sleep in it to wake up there, or pack it back into your bag. (Since day ' + t.day + '.)' });
    else if (LC.State.count('khemah')) rows.push({ icon: 'i_khemah', label: 'Your khemah: in your bag', sub: 'Hold it and press USE facing open ground (two tiles wide) to pitch it anywhere.' });
    return rows;
  };
})(window.LC);
