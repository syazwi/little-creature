/* Little Creature — the masjid of Kampung Tepian (v2.7.4). The user asked for a mosque on the map, and a reward for going
 * there: Muslims pray five times a day. The five prayer times match a Malaysian day and fit the game's clock (the day
 * starts at 6 AM, during Subuh). Praying with the jemaah calms you: energy and health come back; all five in one day
 * makes the next day's work lighter; on Jumaat, the kampung shares food after Solat Jumaat.
 * Kept respectful and simple: the prayer is told in a few quiet lines (no movements are animated), there is no Arabic
 * text and no synthesised call to prayer (a beduk drum marks the time, as in old kampungs), and Pelita, a spirit, waits
 * outside on the steps. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var H = 60;

  LC.SOLAT = [
    { id: 'subuh', name: 'Subuh', from: 6 * H, to: 7 * H + 15 },
    { id: 'zohor', name: 'Zohor', from: 13 * H, to: 16 * H + 30 },
    { id: 'asar', name: 'Asar', from: 16 * H + 30, to: 19 * H + 15 },
    { id: 'maghrib', name: 'Maghrib', from: 19 * H + 15, to: 20 * H + 30 },
    { id: 'isyak', name: 'Isyak', from: 20 * H + 30, to: 24 * H }
  ];
  LC.MASJID = {
    energy: 0.4,          // each prayer: this share of your energy comes back, and all your health
    berkat: 0.25,         // the day after all five: this share of every energy cost is spared
    minutes: 15, jumaatMinutes: 40,   // how long you are inside (playing alone; in co-op the clock never stops)
    jumaatGift: 'nasi_lemak'
  };

  LC.solatNow = function (m) {
    for (var i = 0; i < LC.SOLAT.length; i++) if (m >= LC.SOLAT[i].from && m < LC.SOLAT[i].to) return LC.SOLAT[i];
    return null;
  };
  LC.solatNext = function (m) {
    for (var i = 0; i < LC.SOLAT.length; i++) if (LC.SOLAT[i].from > m) return LC.SOLAT[i];
    return LC.SOLAT[0];   // tomorrow's Subuh
  };
  // today's prayers (personal: kept in quests, which travel with a co-op guest's bag)
  LC.solatQ = function () {
    var S = LC.State.s, q = S.quests.solat;
    if (!q) q = S.quests.solat = { day: 0, done: {}, total: 0, full: 0 };
    if (q.day !== S.day) { q.day = S.day; q.done = {}; }
    return q;
  };
  LC.solatCount = function () { var q = LC.solatQ(); return LC.SOLAT.filter(function (s) { return q.done[s.id]; }).length; };
  LC.clockText = function (m) { var h = Math.floor(m / H) % 24, mm = Math.floor(m % H); return (h % 12 || 12) + ':' + (mm < 10 ? '0' : '') + mm + (h < 12 ? ' AM' : ' PM'); };

  // ---------------------------------------------------------------- the masjid, by the river at the west end of the kampung
  var K = LC.AREAS.kampung;
  K.objects.push({ id: 'k_masjid', type: 'masjid', x: 2, y: 21, w: 6, h: 3, tex: 'masjid', keep: true, light: 0xfff0c8 });
  K.objects.forEach(function (o) { if (o.id === 'k_banana1') { o.x = 12; o.y = 22; } });   // the banana tree that stood there
  K.clear = (K.clear || []).concat([{ x: 4, y: 19, r: 3 }]);
  var build = K.build;
  K.build = function () {   // a path down from the road, and a little stone courtyard in front
    var g = build.apply(this, arguments), y, x;
    for (y = 12; y <= 23; y++) g[y][1] = 'p';
    for (x = 1; x <= 8; x++) g[24][x] = 'k';
    return g;
  };

  LC.MASJID_TEXT = {
    quiet: [
      'The masjid is quiet between prayers. An old man sweeping the serambi nods to you.',
      'Sunlight falls through the carved wooden vents. A row of sejadah lies neatly folded by the door.',
      'Children are reading together on the serambi, softly. A cat sleeps on the cool tiles.'
    ],
    already: function (p) { return 'You have prayed ' + p.name + ' with the jemaah already. The serambi is peaceful.'; },
    next: function (p, m) { return 'The next prayer is ' + p.name + ' at ' + LC.clockText(p.from) + (p.from <= m ? ' tomorrow' : '') + '.'; },
    wuduk: 'You take wuduk at the taps beside the serambi. The water is cool.',
    jumaat: 'It is Jumaat, and the whole kampung is here. In the khutbah, Tok Imam reminds everyone to be kind to their neighbours and to care for the land.',
    pray: function (p, jum) { return 'Tok Imam leads Solat ' + (jum ? 'Jumaat' : p.name) + '. You stand in the saf with the villagers, shoulder to shoulder.'; },
    pelita: 'Outside, Pelita waits on the steps, glowing softly, until you come out.',
    jamuan: 'After the prayer, the kampung shares food on the serambi. Someone presses a packet of nasi lemak into your hands.',
    calm: 'Your heart feels calm and light.',
    full: 'That is all five prayers today. Tomorrow, work will tire you less.',
    time: function (p) { return 'Waktu ' + p.name + ': the beduk is sounding at the masjid in Kampung Tepian.'; },
    berkat: 'You prayed all five yesterday. Today, work tires you less.',
    carBack: function (n) { return 'Abang Zul bought back his father\'s kereta, to keep in the family' + (n > 1 ? ' (all ' + n + ')' : '') + '. You get ' + (1200 * n) + ' kepeng.'; }
  };
})(window.LC);
