/* UI, part 23 (v3.4): Chapter 11, Part 2, 1578 (see sulu2.js): the goal line for steps 7-12, the Journal's chapter page,
 * Nenek's words afterwards, and the kalis waiting with Nenek if your bag was full. Mixed into LC.UIScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var P2 = LC.C11.p2, X = LC.CH11TEXT2;
  function q() { return LC.State.s.quests; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  var goal1 = LC.ch11Goal;
  LC.ch11Goal = function () {
    var Q = q(), st = Q.ch11 || 0, W = LC.game && LC.game.scene.getScene('World'), a = W && W.area, inPast = !!LC.c11Past;
    if (st < 7) return goal1();
    switch (st) {
      case 7: return 'Chapter 11, Part 1 is complete! Rest at the farm. (Pelita keeps turning towards Barunai...)';
      case 8: return 'Chapter 11: Pelita\'s stone lamp in Barunai is calling. Touch it (beside the Balai).';
    }
    if (!inPast) return 'Chapter 11 (1578): touch Pelita\'s stone lamp in Barunai, then take the helm of the lead vinta in Kampong Ayer (the bottom walkway).';
    switch (st) {
      case 9:
        if (a !== 'lautsulu') return 'Chapter 11 (1578): take the helm of the lead vinta, at the bottom walkway of Kampong Ayer.';
        return 'Chapter 11 (1578): ' + ((Q.c11p2leg || 0) < 1 ? X.legA : X.legB);
      case 10:
        if (a === 'sauh11') return 'Chapter 11 (1578): cut the three anchor ropes (' + Object.keys(Q.c11rope || {}).length + ' / ' + P2.ropes + '). Stay out of the lantern light from above.';
        return 'Chapter 11 (1578): sail alongside the galleons in the fog, and dive to their anchor ropes (press ' + useKey() + ' beside the flagship).';
      case 11: return Q.c11signal ? 'Chapter 11 (1578): board the flagship (sail up beside it and press ' + useKey() + ').' : 'Chapter 11 (1578): sail to the galleons on the reef and signal the fleets on the kulintang.';
      case 12: return a === 'kapal11' ? 'Chapter 11 (1578): hold the deck! Knock the sailors overboard, then face the Capitán. Step out of the shadows when the galleons fire.' : 'Chapter 11 (1578): board the flagship (sail up beside it, on the reef, and press ' + useKey() + ').';
    }
    return null;
  };
  function useKey() { var U = LC.game && LC.game.scene.getScene('UI'); return U && U.touchOn ? 'USE' : 'E'; }

  Object.assign(LC.UIScene.prototype, {
    ch11Rows2: function (vid) {
      var self = this, W = this.world, Q = q(), st = Q.ch11 || 0, rows = [];
      function sayLines(arr, opts) { self.say(W.ch2Lines(arr), opts); }
      if (vid === 'nenek' && Q.c11kalisOwed) rows.push({ icon: 'i_kalis', label: 'A parcel from Sulu', right: 'Take', sub: 'Nenek is keeping something long and wrapped in cloth for you.', action: function () {
        if (!LC.State.canAdd('kalis')) { self.toast('Your bag is full! Make room first.'); LC.Audio.sfx('error'); return; }
        LC.State.add('kalis', 1); delete Q.c11kalisOwed; LC.Audio.sfx('chime'); self.toast('+1 Kalis Sulu.', 'i_kalis'); return 'close';
      } });
      if (vid === 'nenek' && st >= 13) rows.push({ icon: 'i_kalis', label: 'Two kingdoms, one sea', right: 'Talk', sub: 'Tell Nenek about 1578.', action: function () { sayLines([{ who: 'nenek', text: pick(X.nenek) }]); return 'close'; } });
      if (vid === 'lela11' && st >= 9 && st <= 12) rows.push({ icon: 'i_mutiara_kembar', label: 'The pearl', right: 'Talk', sub: 'Panglima Lela keeps the pearl close.', action: function () {
        sayLines([{ who: 'lela11', text: 'Two hundred years in the Astana, and it still shines when the moon is dark. Find their fleet, Nakhoda. Then we will see what the pearls want.' }]); return 'close';
      } });
      return rows;
    },
    ch11ChapterRows2: function (rows) {
      var Q = q(), st = Q.ch11 || 0;
      if (rows[0]) { rows[0].label = 'Chapter 11: Bulan dan Mutiara' + (st >= 13 ? '  (complete)' : st >= 7 ? '  (Part 2)' : ''); rows[0].right = st >= 13 ? 'Done' : ''; if (st >= 13) rows[0].sub = 'Two pearls, two kingdoms, one sea. The Kalis Sulu hangs by your door.'; }
      [[7, 'Pelita glows again', 'Old brass, and a lamp calling from Barunai.'], [8, '1578: the envoy from Sulu', 'Kampong Ayer after the defence, and a pearl from Sulu.'],
       [9, 'Find the fleet', 'Two fleets behind you, and bells in the fog.'], [10, 'The anchor ropes', 'Under the galleons, out of the lantern light.'],
       [11, 'Gongs across the water', 'The signal, and the galleons surrounded.'], [12, 'The flagship', 'The deck, the Capitán, and the moon going dark.']].forEach(function (s) {
        if (st < s[0]) return;
        var doneS = st > s[0];
        rows.push({ icon: doneS ? 'ic_bond' : 'ic_moon', label: (doneS ? '✓ ' : '') + s[1], right: doneS ? 'Done' : 'Now', sub: s[2] });
      });
      return rows;
    }
  });

  var specialRows = LC.UIScene.prototype.specialRows;
  LC.UIScene.prototype.specialRows = function (vid, v, por) {
    var rows = specialRows.call(this, vid, v, por);
    return (this.S.quests.ch11 || 0) >= 7 ? rows.concat(this.ch11Rows2(vid)) : rows;
  };
  var ch11ChapterRows = LC.UIScene.prototype.ch11ChapterRows;
  LC.UIScene.prototype.ch11ChapterRows = function () { return this.ch11ChapterRows2(ch11ChapterRows.apply(this, arguments)); };
})(window.LC);
