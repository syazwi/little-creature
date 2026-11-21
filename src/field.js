/* Nenek's field grows with Pelita (v2.7.5). It starts at 12 x 8 = 96 tiles and gains a strip at Lv 4, 7, 10 and 13, up to
 * 15 x 9 = 135. A new strip is ready the morning after the level (S.fieldStage, shared world state, so co-op friends
 * see the same field). Badang's land south of it is always as wide as the field. The farm map's fence ring, gate,
 * field and grass are redrawn here (syncLadang calls syncField first). */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  // y1 is always 21 (the south fence is row 22, the first row of Badang's land)
  LC.FIELD_STAGES = [
    { lv: 1, x0: 6, x1: 17, y0: 14 },                   // 12 x 8 = 96
    { lv: 4, x0: 5, x1: 17, y0: 14, where: 'west' },    // 13 x 8 = 104
    { lv: 7, x0: 5, x1: 18, y0: 14, where: 'east' },    // 14 x 8 = 112
    { lv: 10, x0: 4, x1: 18, y0: 14, where: 'west' },   // 15 x 8 = 120
    { lv: 13, x0: 4, x1: 18, y0: 13, where: 'north' }   // 15 x 9 = 135
  ];
  LC.FIELD_Y1 = 21;
  LC.FIELD_MAX = { x0: 3, y0: 12, x1: 19, y1: 22 };   // the fence of the biggest field
  LC.FIELD_GATE = [11, 12];                          // the gate in the north fence, and the path up to it

  LC.fieldStageFor = function (lv) { var st = 0; LC.FIELD_STAGES.forEach(function (f, i) { if (lv >= f.lv) st = i; }); return st; };
  LC.fieldStage = function () { var S = LC.State.s; return Math.max(0, Math.min(LC.FIELD_STAGES.length - 1, (S && S.fieldStage) || 0)); };
  LC.fieldRect = function (st) { var f = LC.FIELD_STAGES[st === undefined ? LC.fieldStage() : st]; return { x0: f.x0, x1: f.x1, y0: f.y0, y1: LC.FIELD_Y1 }; };
  LC.fieldTiles = function (st) { var R = LC.fieldRect(st); return (R.x1 - R.x0 + 1) * (R.y1 - R.y0 + 1); };
  // nothing else may stand where the field and Badang's land can grow (grass tufts, chests)
  LC.inFieldArea = function (x, y) { var M = LC.FIELD_MAX; return x >= M.x0 && x <= M.x1 && y >= M.y0 && y <= LC.LADANG.y1; };

  LC.syncField = function () {
    var g = LC.areaGrid('farm'), R = LC.fieldRect(), M = LC.FIELD_MAX;
    for (var y = M.y0; y <= M.y1; y++) for (var x = M.x0; x <= M.x1; x++) {
      var c = '.';
      if (x >= R.x0 && x <= R.x1 && y >= R.y0 && y <= R.y1) c = 'f';
      else if (x >= R.x0 - 1 && x <= R.x1 + 1 && y >= R.y0 - 1 && y <= R.y1 + 1) c = 'F';
      if (LC.FIELD_GATE.indexOf(x) >= 0 && y <= R.y0 - 1) c = 'p';   // the gate, and the path from the road
      g[y][x] = c;
    }
    LC.LADANG.x0 = R.x0; LC.LADANG.x1 = R.x1;
  };

  // the level texts (Journal > Levels and the level-up message)
  LC.FIELD_STAGES.forEach(function (f, i) {
    if (!i) return;
    var r = LC.LEVEL_REWARDS[f.lv] = LC.LEVEL_REWARDS[f.lv] || {};
    r.field = i;
    r.text = (r.text ? r.text + ' ' : '') + 'Nenek\'s field grows to the ' + f.where + ': ' + LC.fieldTiles(i) + ' tiles, ready tomorrow morning.';
  });

  var St = LC.State;
  // a new morning: the field catches up with Pelita's level
  var endDay = St.endDay;
  St.endDay = function () {
    var s = this.s, want = LC.fieldStageFor(this.level()), grew = want > (s.fieldStage || 0);
    if (grew) s.fieldStage = want;
    var sum = endDay.apply(this, arguments);
    if (grew && sum && sum.lines) sum.lines.push('Nenek\'s field is bigger this morning: ' + LC.fieldTiles(want) + ' tiles' + (want < LC.FIELD_STAGES.length - 1 ? '.' : ', as big as it gets!'));
    return sum;
  };
  // co-op: the field travels with the shared world
  var snapshot = St.snapshot, applySnapshot = St.applySnapshot;
  St.snapshot = function () { var w = snapshot.apply(this, arguments); w.fieldStage = this.s.fieldStage || 0; return w; };
  St.applySnapshot = function (w) { applySnapshot.apply(this, arguments); this.s.fieldStage = w.fieldStage || 0; };
  // an older save: the field Pelita's level allows, but never smaller than the soil already tilled
  var load = St.load;
  St.load = function () {
    var ok = load.apply(this, arguments), s = this.s;
    if (!ok || !s || s.fieldStage !== undefined) return ok;
    var st = LC.fieldStageFor(s.ghost && s.ghost.level || 1), last = LC.FIELD_STAGES.length - 1;
    Object.keys(s.tiles || {}).forEach(function (k) {
      var t = s.tiles[k], p = k.split(','), x = +p[0], y = +p[1];
      if (!t || !(t.tilled || t.crop) || !LC.inFieldArea(x, y)) return;
      while (st < last) {
        var R = LC.fieldRect(st);
        if (x >= R.x0 && x <= R.x1 && y >= R.y0) break;   // (Badang's rows below only need the width)
        st++;
      }
    });
    s.fieldStage = st;
    return ok;
  };

  // no chests where the field can grow
  var chestSpotOk = LC.chestSpotOk;
  LC.chestSpotOk = function (area, x, y) { return area === 'farm' && LC.inFieldArea(x, y) ? false : chestSpotOk.apply(this, arguments); };
})(window.LC);
