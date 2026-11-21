/* UI, part (v2.7.4): the masjid on the maps (a label on "This place", an icon on "The land"), today's prayers in
 * Journal > You, and Pause > Prayer times (the beduk and the reminders, on or off). Mixed into LC.UIScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var proto = LC.UIScene.prototype;

  var youRows = proto.youRows;
  proto.youRows = function () {
    var rows = youRows.apply(this, arguments), S = this.S;
    if (!LC.State.isOpen('kampung')) return rows;
    var q = LC.solatQ(), nx = LC.solatNext(S.minutes);
    var marks = LC.SOLAT.map(function (s) { return (q.done[s.id] ? '✓ ' : '· ') + s.name; }).join('   ');
    rows.unshift({ icon: 'ic_masjid', label: 'Solat at the masjid today: ' + LC.solatCount() + ' / 5',
      sub: marks + '.  Next: ' + nx.name + ' at ' + LC.clockText(nx.from) + (nx.from <= S.minutes ? ' tomorrow' : '') + '. With the jemaah ' + (q.total || 0) + ' times' + (q.full ? ', all five on ' + q.full + ' day' + (q.full > 1 ? 's' : '') : '') + '. (The masjid is at the west end of Kampung Tepian.)' });
    // v2.8.3: what each prayer brings, and which blessings are with you now
    var on = LC.solatBlessings();
    rows.splice(1, 0, { icon: 'ic_masjid', label: 'Prayer blessings' + (on.length ? ': ' + on.join(', ') : ''), right: on.length ? on.length + ' now' : '',
      sub: LC.SOLAT.map(function (p) { return p.name + ': ' + p.short; }).join(' · ') + '. Every prayer: energy +40% and full health.' });
    return rows;
  };
  // the blessings with you right now (Subuh, Asar and Isyak last the day; Maghrib until you wake)
  LC.solatBlessings = function () {
    var S = LC.State.s, q = S.quests.solat || {}, out = [];
    if (q.rezeki === S.day) out.push('Rezeki pagi');
    if (q.sihat === S.day) out.push('Sihat');
    if (q.lindung === S.day) out.push('Dilindungi');
    if (q.isyak === S.day) out.push('Berkat malam');
    if (q.berkat === S.day) out.push('Berkat (all five yesterday)');
    return out;
  };

  var drawLocalMap = proto.drawLocalMap;
  proto.drawLocalMap = function (body, X, Y, Wd, Hd) {
    drawLocalMap.apply(this, arguments);
    var self = this, W = this.world, gr = W.grid, H = gr.length, Wt = gr[0].length;
    var sc = Math.floor(Math.min((Wd - 80) / Wt, (Hd - 150) / H)), ox = Math.round(480 - Wt * sc / 2), oy = Y + 92;
    W.objects.forEach(function (o) {
      if (o.type !== 'masjid') return;
      var g = self.add.graphics(), cx = ox + (o.x + o.w / 2) * sc;
      g.fillStyle(0xf4efe2, 1); g.fillRect(ox + o.x * sc, oy + o.y * sc, o.w * sc, o.h * sc);
      g.fillStyle(0x2e7a5a, 1); g.fillRect(ox + o.x * sc, oy + o.y * sc, o.w * sc, Math.max(2, Math.round(sc / 2)));
      body.add(g);
      body.add(self.add.image(cx, oy + o.y * sc - 8, 'ic_masjid').setScale(2));
      body.add(self.txt(cx, oy + (o.y + o.h) * sc + 1, 'Masjid', 12, '#fffdf2', { ox: 0.5, stroke: 3 }));
    });
  };

  var drawAtlas = proto.drawAtlas;
  proto.drawAtlas = function (body, X, Y, Wd, Hd) {
    drawAtlas.apply(this, arguments);
    var p = LC.MAP_POS.kampung;
    if (p) body.add(this.add.image(X + 100 + p[0] * 145 + 50, Y + 96 + p[1] * 86 + 12, 'ic_masjid').setScale(2));
  };

  // Pause > Prayer times: the beduk and a reminder at each prayer time
  LC.pauseExtraRow4 = function () {
    var S = LC.State.s;
    if (!S || !LC.State.isOpen('kampung')) return null;
    return { icon: 'ic_masjid', label: 'Prayer times: ' + (S.flags.noSolat ? 'Off' : 'On'),
      sub: 'The beduk and a reminder at each prayer time. At the masjid in Kampung Tepian, every prayer brings energy, health and its own blessing (Journal > You).',
      action: function () { S.flags.noSolat = !S.flags.noSolat; } };
  };
})(window.LC);
