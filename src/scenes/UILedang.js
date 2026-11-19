/* UI, part 12 (v2.4): Chapter 6, Puteri Gunung Ledang. Hang Tuah's test and Hang Jebat's spar, the princess and her
 * three gifts (the jar of happy tears, the bridge of gold and silver, the young areca nuts), the jong's voyage to the
 * mountain, the goal line and the Journal's Chapter 6 page. Mixed into LC.UIScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  function q() { return LC.State.s.quests; }
  function tick(b) { return b ? '✓' : '·'; }
  function tearsN() { return Object.keys(q().c6tears || {}).length; }
  function giftsReady() { var Q = q(); return tearsN() >= LC.C6.tears.length && !!Q.c6bridge && LC.State.count('pinang_muda') >= 3; }
  function giftList() {
    var Q = q();
    return tick(tearsN() >= LC.C6.tears.length) + ' a jar of happy tears (' + tearsN() + ' / ' + LC.C6.tears.length + ': the Penghulu, Pak Mat, Pak Lah, Tukang Leong)  ' +
      tick(Q.c6bridge) + ' a bridge of gold and silver (Tukang Leong)  ' + tick(LC.State.count('pinang_muda') >= 3) + ' 3 young areca nuts (' + Math.min(3, LC.State.count('pinang_muda')) + ' / 3, the palms on Gunung Ledang)';
  }

  LC.ch6Goal = function () {
    var Q = q(), st = Q.ch6 || 0;
    switch (st) {
      case 0: return 'Chapter 5 is complete! Rest at Nenek\'s farm. (Someone is coming home...)';
      case 1: return 'Chapter 6: Nenek is home! Spend the day with her on the farm.';
      case 2: return 'Chapter 6: Nenek will not wake. Sail to Gunung Ledang on the Majapahit jong at the farm jetty.';
      case 3: return 'Chapter 6: climb Gunung Ledang and pass the guardian\'s silat test (talk to Hang Tuah by his hut).';
      case 4:
        if (!Q.c6asked) return 'Chapter 6: meet Puteri Gunung Ledang by her pavilion, at the top of the path beside the stream.';
        if (giftsReady()) return 'Chapter 6: bring the three gifts to Puteri Gunung Ledang.';
        return 'Chapter 6: for the princess: ' + giftList() + '.';
      case 5: return Q.c6fight ? 'Chapter 6: Mak Lampir! Defeat her with Hang Tuah (step out of the violet circles).' : 'Chapter 6: cross the bridge and pick the Bunga Ledang in the princess\'s garden.';
      case 6: return LC.State.count('bunga_ledang') ? 'Chapter 6: hurry home and wake Nenek with the Bunga Ledang.' : 'Chapter 6: the princess is keeping your Bunga Ledang. Collect it on Gunung Ledang.';
    }
    return null;
  };
  var goal5 = LC.ch5Goal;
  LC.ch5Goal = function () { return (LC.State.s.quests.ch5 || 0) >= 5 ? LC.ch6Goal() : goal5(); };

  // the jong now sails to Gunung Ledang too
  LC.jongExtraRows = function (where) {
    var ui = this, W = this.world, st = q().ch6 || 0;
    if (st < 2 || where === 'ledang') return [];
    return [{ icon: 'ic_glow', label: 'Sail to Gunung Ledang', right: 'Sail', sub: 'The misty mountain of the princess, across the sea on the peninsula.', action: function () { ui.closeModal(); W.sailTo('ledang'); } }];
  };

  Object.assign(LC.UIScene.prototype, {
    ch6Rows: function (vid, v, por) {
      var self = this, W = this.world, Q = q(), st = Q.ch6 || 0, rows = [], T6 = LC.CH6TEXT, C6 = LC.C6;
      function sayLines(arr, opts) { self.say(W.ch2Lines(arr), opts); }
      function duel(who, label, sub) { return { icon: 'ic_str', label: label, right: 'Spar', sub: sub, action: function () { self.closeModal(); W.startDuel(who); } }; }
      if (vid === 'hangtuah' && st === 3) rows.push(duel('hangtuah', 'Hang Tuah\'s test', 'A friendly silat duel: land three touches before he lands three on you. Nobody gets hurt.'));
      if (vid === 'hangtuah' && st >= 4) rows.push(duel('hangtuah', 'Spar with Hang Tuah', 'Just for practice. Three touches.'));
      if (vid === 'jebat' && st >= 4) rows.push(duel('jebat', Q.c6jebat ? 'Spar with Hang Jebat' : 'Hang Jebat\'s challenge', Q.c6jebat ? 'Just for practice. Three touches.' : 'Beat him to three touches for a little of his strength (+5 strength, +1500 kepeng).'));
      if (vid === 'puteri_ledang' && st === 4 && !Q.c6asked) rows.push({ icon: 'i_diari_nenek', label: 'Nenek is cursed', right: 'Ask', sub: 'Show the princess Nenek\'s diary, and ask for her help.', action: function () {
        Q.c6asked = 1; sayLines(T6.ask); return 'close';
      } });
      if (vid === 'puteri_ledang' && st === 4 && Q.c6asked) rows.push({ icon: 'i_bunga_ledang', label: 'The three gifts', right: giftsReady() ? 'Give' : '', sub: giftList() + '.', enabled: giftsReady(), why: 'Not all three gifts are ready yet.', action: function () {
        LC.State.remove('pinang_muda', 3); Q.ch6 = 5; LC.Audio.sfx('chime');
        sayLines(T6.gifts); return 'close';
      } });
      if (vid === 'puteri_ledang' && Q.c6bungaOwed) rows.push({ icon: 'i_bunga_ledang', label: 'The Bunga Ledang', right: 'Take', sub: 'The princess kept it safe while your bag was full.', action: function () {
        if (!LC.State.add('bunga_ledang', 1)) { self.toast('Make room in your bag first!'); LC.Audio.sfx('error'); return; }
        delete Q.c6bungaOwed; LC.Audio.sfx('chime'); return 'close';
      } });
      if (st === 4 && Q.c6asked && C6.tears.indexOf(vid) >= 0 && !(Q.c6tears || {})[vid]) rows.push({ icon: 'ic_joy', label: 'A tear for Nenek', right: 'Ask', sub: 'Tell them about Nenek, and ask for one happy tear for the princess\'s jar.', action: function () {
        (Q.c6tears = Q.c6tears || {})[vid] = 1;
        sayLines([{ who: vid, text: T6.tears[vid] }], { onDone: function () { self.toast('A happy tear for the jar. (' + tearsN() + ' / ' + C6.tears.length + ')', 'ic_joy'); } });
        return 'close';
      } });
      if (vid === 'leong' && st === 4 && Q.c6asked && !Q.c6bridge) rows.push(this.craftRow('i_belian', 'A bridge of gold and silver', '"Belian planks that never rot, gold on one rail and silver on the other. Well... polished tin. Do not tell the princess. The whole kampung will carry it up the mountain."', C6.bridge, C6.bridgeKepeng, function () {
        Q.c6bridge = 1; LC.syncLedang(); LC.Audio.sfx('build');
        self.toast('The whole kampung carries Leong\'s bridge up Gunung Ledang. It now crosses the princess\'s stream.', 'i_belian');
      }));
      if (vid === 'penghulu' && st >= 2 && st <= 6) rows.push({ icon: 'ic_moon', label: 'Nenek', sub: '"The whole kampung is taking turns to sit with her. Go, find that princess. We will look after Nenek and the farm."' });
      return rows;
    },
    ch6ChapterRows: function () {
      var Q = q(), st = Q.ch6 || 0, rows = [];
      rows.push({ icon: 'i_bunga_ledang', label: 'Chapter 6: Puteri Gunung Ledang' + (st >= 7 ? '  (complete)' : ''), right: st >= 7 ? 'Done' : '', sub: LC.ch6Goal() || 'Nenek is home for good, and the witch has no magic left.' });
      [[1, 'Nenek comes home', 'A reunion on the farm.'], [2, 'The witch\'s last spell', 'Nenek\'s sleep, and her diary.'], [3, 'Hang Tuah', 'The guardian of Gunung Ledang, and his test.'],
       [4, 'The princess', 'Happy tears, a bridge of gold and silver, young areca nuts.'], [5, 'The Bunga Ledang', 'Mak Lampir, one last time.'], [6, 'Home', 'Wake Nenek.']].forEach(function (s) {
        if (st < s[0]) return;
        var doneS = st > s[0];
        rows.push({ icon: doneS ? 'ic_bond' : 'ic_moon', label: (doneS ? '✓ ' : '') + s[1], right: doneS ? 'Done' : 'Now', sub: s[2] });
      });
      return rows;
    }
  });

  // ---------------------------------------------------------------- hooks
  var specialRows = LC.UIScene.prototype.specialRows;
  LC.UIScene.prototype.specialRows = function (vid, v, por) {
    var rows = specialRows.call(this, vid, v, por);
    return (this.S.quests.ch5 || 0) >= 5 ? rows.concat(this.ch6Rows(vid, v, por)) : rows;
  };
  var chapterRows = LC.UIScene.prototype.chapterRows;
  LC.UIScene.prototype.chapterRows = function () {
    var rows = chapterRows.call(this);
    return (this.S.quests.ch5 || 0) >= 5 && (this.S.quests.ch6 || 0) >= 1 ? rows.concat(this.ch6ChapterRows()) : rows;
  };
})(window.LC);
