/* Little Creature — v2.7.1: what the shared places look like in co-op.
 * Each player's story is their own (their quests travel with them), but some of what a story builds stays in the world:
 * the water village of Barunai and its walkways, the Kampong Ayer workshops and new homes, the golden bridge on Gunung
 * Ledang, the brick path to the old tower. Before v2.7.1 each player only saw what they had built themselves, so a friend
 * who was further along walked on walkways that were open river on your screen. Now every player tells the others how
 * far they have built (LC.WORLD_KEYS: these only ever grow), and those places show the most built version among the
 * players here. Only the looks are shared: objects marked `shared: true`, the walkway / bridge / path tiles, and the
 * Kampong Ayer craftspeople. Story scenes and quests stay personal.
 *   message: prog{id,q} (guest -> host -> everyone; the host sends its own too) · progGone{id} */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var N = LC.Net;
  LC.WORLD_KEYS = { ch2: 1, kaStage: 1, kaPlots: 1, c6bridge: 1, menara: 1 };
  N.progs = {}; N.progVer = 0; N.progKey = '';
  function mine() {
    var S = LC.State.s, q = (S && S.quests) || {}, o = {};
    Object.keys(LC.WORLD_KEYS).forEach(function (k) { if (q[k] !== undefined) o[k] = q[k]; });
    return o;
  }
  LC.myWorldProg = mine;
  function merge(a, b) {   // a: ours (kept on a tie), b: a friend's; numbers take the larger, objects are joined
    var out = JSON.parse(JSON.stringify(a || {}));
    Object.keys(b || {}).forEach(function (k) {
      var x = out[k], y = b[k];
      if (typeof y === 'number') { if (typeof x !== 'number' || y > x) out[k] = y; }
      else if (y && typeof y === 'object') out[k] = merge(x && typeof x === 'object' ? x : {}, y);
      else if (x === undefined || x === null || x === false || x === 0) out[k] = y;
    });
    return out;
  }
  var cache = null, cacheT = 0, cacheVer = -1, cacheS = null;
  // our quests, with the shared world keys raised to the most built among everyone here (cached for half a second)
  LC.worldQuests = function () {
    var S = LC.State.s;
    if (!S) return {};
    if (!N.role || !Object.keys(N.progs).length) return S.quests;
    var now = Date.now();
    if (cache && cacheS === S && cacheVer === N.progVer && now - cacheT < 500) return cache;
    var w = mine();
    Object.keys(N.progs).forEach(function (id) { w = merge(w, N.progs[id]); });
    cache = Object.assign({}, S.quests, w); cacheT = now; cacheVer = N.progVer; cacheS = S;
    return cache;
  };
  // a read-only view of the state with those quests, for the `when` / `hideIf` checks of shared things
  LC.worldS = function () {
    var S = LC.State.s, q = LC.worldQuests();
    if (!S || q === S.quests) return S;
    var v = Object.create(S); v.quests = q;
    return v;
  };

  // ---------------------------------------------------------------- telling the others
  N.sendProg = function (force) {
    if (!N.role) return;
    var p = mine(), k = JSON.stringify(p);
    if (!force && k === N.progKey) return;
    N.progKey = k;
    if (N.role === 'host') N.broadcast({ t: 'prog', id: 'host', q: p }); else N.send({ t: 'prog', q: p });
  };
  N.gotProg = function (id, q) {
    if (!id || id === N.myId) return;
    N.progs[id] = q || {}; N.progVer++;
    N.emit('prog', id);
  };
  N.dropProg = function (id) {
    if (!N.progs[id]) return;
    delete N.progs[id]; N.progVer++;
    N.emit('prog', id);
  };
  N.progSnapshot = function () {   // the host, for a friend who has just arrived: everyone's progress so far
    var out = [{ t: 'prog', id: 'host', q: mine() }];
    Object.keys(N.progs).forEach(function (id) { out.push({ t: 'prog', id: id, q: N.progs[id] }); });
    return out;
  };
  N.resetProgs = function () { N.progs = {}; N.progVer++; N.progKey = ''; };
})(window.LC);
