/* World + UI (v2.7.5): Nenek's field grows with Pelita's level (data in field.js). On the morning a new strip is ready,
 * the fence, the gate, the field and the grass around it are redrawn (the tilled soil is redrawn by refreshAllTiles),
 * and Journal > You shows how big the field is and when it grows next. Mixed into LC.WorldScene and LC.UIScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';

  LC.WorldScene.prototype.refreshField = function () {
    var art = LC.Art, TI = art.TI, M = LC.FIELD_MAX;
    for (var y = M.y0; y <= LC.LADANG.y1; y++) for (var x = M.x0; x <= M.x1; x++) {
      var ch = this.grid[y][x], idx = null;
      if (ch === '.') { var v = ((x * 73 + y * 151) % 97) / 97; idx = v < 0.55 ? TI.G0 : v < 0.82 ? TI.G1 : v < 0.9 ? TI.G2 : TI.G3; }
      else if (ch === 'p') idx = art.sunnysidePathIndex(this.grid, x, y);
      else if (ch === 'f') idx = TI.FIELD;
      else if (ch === 'F') idx = this.fenceIdx(x, y);
      if (idx !== null) this.ground.putTileAt(idx, x, y);
      if (!this.objAt[y][x]) this.solid[y][x] = !!LC.SOLID_TILES[ch];
    }
  };

  var proto = LC.UIScene.prototype, youRows = proto.youRows;
  proto.youRows = function () {
    var rows = youRows.apply(this, arguments), st = LC.fieldStage(), nx = LC.FIELD_STAGES[st + 1], R = LC.fieldRect(st);
    var lv = LC.State.level(), soon = nx && lv >= nx.lv;
    rows.push({ icon: (LC.ITEMS.hoe && LC.ITEMS.hoe.icon) || 'ic_bond', label: 'Nenek\'s field: ' + LC.fieldTiles(st) + ' tiles  (' + (R.x1 - R.x0 + 1) + ' x ' + (R.y1 - R.y0 + 1) + ')',
      sub: !nx ? 'As big as it gets!' + (this.S.ladang === 2 ? ' With Badang\'s land below it: ' + (LC.fieldTiles(st) + (R.x1 - R.x0 + 1) * (LC.LADANG.y1 - LC.LADANG.y0 + 1)) + ' tiles.' : '')
        : soon ? 'It grows to ' + LC.fieldTiles(st + 1) + ' tiles tomorrow morning.'
        : 'It grows as Pelita levels up: ' + LC.fieldTiles(st + 1) + ' tiles at Lv ' + nx.lv + ', up to ' + LC.fieldTiles(LC.FIELD_STAGES.length - 1) + ' at Lv ' + LC.FIELD_STAGES[LC.FIELD_STAGES.length - 1].lv + '.' });
    return rows;
  };
})(window.LC);
