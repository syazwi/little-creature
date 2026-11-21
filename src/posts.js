/* v2.7.6: some villagers moved a step so you can see them (Mbak Dewi and Kak Mai stood behind their roofs, Abang Zul
 * behind his shop, Pak Mat and two of the brothers behind torches). A chest or a pitched khemah from an older save
 * that sits on one of their new spots is moved out of the way when the save loads. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var St = LC.State;

  function onPost(area, x, y) {
    if (LC.villagerPosts(area).some(function (p) { return p.x === x && p.y === y; })) return true;
    return area === 'kampung' && Object.keys(LC.PLOT_POSTS).some(function (k) { var p = LC.PLOT_POSTS[k]; return p.x === x && p.y === y; });
  }
  // the nearest free spot for a chest, a few steps away at most
  function nearby(area, x, y) {
    for (var r = 1; r <= 4; r++) for (var dy = -r; dy <= r; dy++) for (var dx = -r; dx <= r; dx++) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) === r && LC.chestSpotOk(area, x + dx, y + dy)) return { x: x + dx, y: y + dy };
    }
    return null;
  }

  St.clearPosts = function () {
    var s = this.s, self = this;
    if (!s) return;
    Object.keys(s.chests || {}).forEach(function (cid) {
      var c = s.chests[cid];
      if (!LC.AREAS[c.area] || !onPost(c.area, c.x, c.y)) return;
      var to = nearby(c.area, c.x, c.y);
      if (to) { c.x = to.x; c.y = to.y; }
    });
    var t = s.tent;
    if (t && LC.AREAS[t.area] && (onPost(t.area, t.x, t.y) || onPost(t.area, t.x + 1, t.y) || onPost(t.area, t.x, t.y + 1)) && self.add('khemah', 1)) delete s.tent;
  };

  var load = St.load;
  St.load = function () {
    var ok = load.apply(this, arguments);
    if (ok && !(this.s && this.s.guest)) this.clearPosts();
    return ok;
  };
})(window.LC);
