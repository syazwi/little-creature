/* UI, part 11 (v2.3): Chapter 5, Bayang Hitam. Juragan Wira and the jong's voyages, Tukang Leong's guard lamps,
 * Tok Batin's Cahaya Bunian, Empu Lintang and the Pelita Purnama, the market of Majapahit, the goal line and the
 * Journal's Chapter 5 page. Mixed into LC.UIScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  function q() { return LC.State.s.quests; }
  function tick(b) { return b ? '✓' : '·'; }
  function have(id, n) { return LC.State.count(id) >= n; }
  function forgeList() {
    var Q = q();
    return tick(have('tembaga', 3)) + ' 3 Kendi Tembaga (Barunai)  ' + tick(have('cahaya_bunian', 1)) + ' a Cahaya Bunian (Tok Batin: 3 shadow shards)  ' + tick(have('damar', 2)) + ' 2 Damar (the old tree in Hutan Rimba)';
  }

  LC.ch5Goal = function () {
    var S = LC.State.s, Q = S.quests, st = Q.ch5 || 0, area = LC.kaArea;
    switch (st) {
      case 0: return 'Chapter 4 is complete! Rest at Nenek\'s farm. (The nights are growing darker...)';
      case 1: return 'Chapter 5: shadows on Nenek\'s farm! Drive them away.';
      case 2:
        if (!Q.c5wira) return 'Chapter 5: show the shadow shard to the sailors of the Majapahit jong at Nenek\'s jetty.';
        if (!Q.c5lamps) return 'Chapter 5: ask Tukang Leong for guard lamps for the farm. Then sail to Java on the jong.';
        return 'Chapter 5: sail to Java on the Majapahit jong at Nenek\'s jetty.';
      case 3:
        if (!Q.c5king && area === 'jawa') return 'Chapter 5: Java! Meet the King of Majapahit at his pavilion.';
        if (!Q.c5empu) return 'Chapter 5: find Empu Lintang, the old lamp-maker, at his workshop in Java (past the great pool).';
        return 'Chapter 5: for Empu Lintang: ' + forgeList() + '.';
      case 4:
        if (!LC.State.count('pelita_purnama')) return 'Chapter 5: collect the Pelita Purnama from Empu Lintang in Java.';
        if (area === 'kelam' && Q.c5witch) return 'Chapter 5: Mak Lampir! Strike her while all the torches burn (' + Object.keys(Q.c5obor || {}).length + ' / ' + LC.C5.obor.length + ' lit).';
        if (area === 'kelam') return 'Chapter 5: light the stone torches (' + Object.keys(Q.c5obor || {}).length + ' / ' + LC.C5.obor.length + '), then defeat Si Kelam!';
        return 'Chapter 5: sail to Pulau Kelam on the jong, with the Pelita Purnama.';
    }
    return null;
  };
  var goal4 = LC.ch4Goal;
  LC.ch4Goal = function () { return (LC.State.s.quests.ch4 || 0) >= 4 ? LC.ch5Goal() : goal4(); };

  Object.assign(LC.UIScene.prototype, {
    ch5Rows: function (vid, v, por) {
      var self = this, W = this.world, Q = q(), st = Q.ch5 || 0, rows = [], T5 = LC.CH5TEXT, C5 = LC.C5;
      function sayLines(arr, opts) { self.say(W.ch2Lines(arr), opts); }
      if (vid === 'penghulu' && st >= 1 && st <= 4) rows.push({ icon: 'ic_moon', label: 'The shadows', sub: '"Every lamp in the kampung goes out at night now, and something moves in the dark. Be careful, and look after Pelita."' });
      if (vid === 'penghulu' && st >= 5) rows.push({ icon: 'ic_glow', label: 'The full moon spirit', sub: '"Look at Pelita! Like the moon itself has come down to sit on your farm. The lamps stay lit again, thanks to you."' });
      if (vid === 'leong' && st === 2 && !Q.c5lamps) rows.push(this.craftRow('ic_glow', 'Guard lamps for the farm', '"Brass lanterns on posts of belian, burning all night. No shadow will cross Nenek\'s yard."', C5.lamps, C5.lampKepeng, function () {
        Q.c5lamps = 1; LC.Audio.sfx('build'); self.toast('Four guard lamps now burn around Nenek\'s farm. The shadows will keep away from it.', 'ic_glow');
      }));
      if (vid === 'tokbatin' && st === 3 && Q.c5empu && !have('cahaya_bunian', 1)) rows.push(this.craftRow('i_cahaya_bunian', 'Light from shadows', '"Shadow shards remember being light, if you are patient with them." (Shadows drop shards at night.)', C5.shards, 0, function () {
        LC.State.add('cahaya_bunian', 1); LC.Audio.sfx('chime'); sayLines(T5.batin);
      }));
      if (vid === 'empu') {
        if (st === 3 && !Q.c5empu) rows.push({ icon: 'ic_glow', label: 'Pelita is fading', right: 'Ask', sub: 'Wira said that if anyone can save a light, it is Empu Lintang.', action: function () {
          Q.c5empu = 1; sayLines(T5.empu); return 'close';
        } });
        if (st === 3 && Q.c5empu) rows.push(this.craftRow('i_pelita_purnama', 'Make the Pelita Purnama', '"Brass for the body, Bunian light for the heart, damar for the flame."', C5.forge, 0, function () {
          Q.ch5 = 4; delete Q.c5obor;
          if (!LC.State.add('pelita_purnama', 1)) Q.c5lampOwed = 1;
          LC.Audio.sfx('bell'); sayLines(T5.forge);
        }));
        if (st === 4 && (Q.c5lampOwed || !LC.State.count('pelita_purnama'))) rows.push({ icon: 'i_pelita_purnama', label: 'The Pelita Purnama', right: 'Take',
          sub: Q.c5lampOwed ? 'Empu Lintang kept it safe while your bag was full.' : '"Lost it? Hmm. Lucky for you, an old lamp-maker always makes two." He hands you another.', action: function () {
          if (!LC.State.add('pelita_purnama', 1)) { self.toast('Make room in your bag first!'); LC.Audio.sfx('error'); return; }
          delete Q.c5lampOwed; LC.Audio.sfx('chime'); return 'close';
        } });
      }
      return rows;
    },

    // ================================================================ the Majapahit jong: Juragan Wira, the voyages, trade
    openJong5: function (where) {
      var self = this, W = this.world, Q = q(), st = Q.ch5 || 0, T5 = LC.CH5TEXT;
      function sail(to) { return function () { self.closeModal(); W.sailTo(to); }; }
      this.openMenu({ title: 'The Majapahit jong', coins: true, footer: 'Juragan Wira, master of the jong: "Where to, friend? With the Naga\'s help, no voyage is long."',
        tabs: [{ label: 'Juragan Wira', rows: function () {
          var rows = [];
          if (where === 'farm' && st === 2 && !Q.c5wira) rows.push({ icon: 'i_serpihan_kelam', label: 'The shadow shard', right: 'Show', sub: 'Show Juragan Wira the cold shard the shadows left behind.', action: function () {
            Q.c5wira = 1; self.say(W.ch2Lines(T5.wira)); return 'close';
          } });
          if (where !== 'jawa' && (st >= 3 || (st === 2 && Q.c5wira))) rows.push({ icon: 'ic_sun', label: 'Sail to Java', right: 'Sail', sub: 'The harbour and court of Majapahit, where Empu Lintang makes his lamps.',
            enabled: st >= 3 || !!Q.c5lamps, why: 'Wira: "Not until your farm is safe. Ask Tukang Leong for guard lamps first."', action: sail('jawa') });
          if (where !== 'kelam' && st === 4) rows.push({ icon: 'ic_moon', label: 'Sail to Pulau Kelam', right: 'Sail', sub: 'The black rock where Si Kelam waits. Bring the Pelita Purnama.',
            enabled: !!LC.State.count('pelita_purnama'), why: 'You need the Pelita Purnama from Empu Lintang first.', action: sail('kelam') });
          if (where !== 'farm') rows.push({ icon: 'ic_bond', label: 'Sail home', right: 'Sail', sub: 'Back across the sea to Nenek\'s jetty.', action: sail('farm') });
          rows.push({ icon: 'i_kain_batik', label: 'Trade', right: 'Shop', sub: 'Batik, celengan and jamu from Java. The sailors buy Bornean goods.', action: function () { self.openJong(); } });
          return rows;
        } }] });
    },
    openPasar5: function () {
      var S = this.S, C5 = LC.C5, C4 = LC.C4;
      this.openMenu({ title: 'The market of Majapahit', coins: true, footer: 'Traders from every island of the sea come to this harbour.',
        tabs: [
          { label: 'Buy', rows: function () {
            return C5.javaStock.filter(function (id) { return LC.ITEMS[id]; }).map(function (id) {
              var it = LC.ITEMS[id], price = Math.round((it.price || (it.sell || 20) * 2) * 0.85), room = LC.State.canAdd(id);
              return { icon: it.icon, label: it.name, sub: it.desc, right: price + ' k', enabled: S.kepeng >= price && room, why: S.kepeng < price ? 'Not enough kepeng.' : 'Your bag is full!',
                action: function () { S.kepeng -= price; LC.State.add(id, 1); LC.Audio.sfx('buy'); } };
            });
          } },
          { label: 'Sell', empty: 'They want Bornean goods: woven cloth, brass, belian, honey, nibong.', rows: function () {
            var seen = {}, rows = [];
            S.inv.forEach(function (sl) {
              if (!sl || seen[sl.id] || C4.jongBuys.indexOf(sl.id) < 0) return;
              seen[sl.id] = 1;
              var it = LC.ITEMS[sl.id], price = Math.round((it.sell || 10) * 1.5);
              rows.push({ icon: it.icon, label: it.name + '  x' + LC.State.count(sl.id), sub: it.desc, right: '+' + price + ' k',
                action: function () { LC.State.remove(sl.id, 1); S.kepeng += price; S.stats.earned += price; LC.Audio.sfx('coin'); } });
            });
            return rows;
          } }
        ] });
    },

    // ================================================================ the Journal: Chapter 5
    ch5ChapterRows: function () {
      var Q = q(), st = Q.ch5 || 0, rows = [];
      rows.push({ icon: 'i_pelita_purnama', label: 'Chapter 5: Bayang Hitam' + (st >= 5 ? '  (complete)' : ''), right: st >= 5 ? 'Done' : '', sub: LC.ch5Goal() || 'A witch and her shadow came to drink Pelita\'s light. Now Pelita shines like the full moon.' });
      [[1, 'The lamps go out', 'Shadows on Nenek\'s farm.'], [2, 'Juragan Wira', 'The shadow shard, the guard lamps, the voyage.'],
       [3, 'Java', 'The king, Empu Lintang, and three things for a lamp.'], [4, 'Pulau Kelam', 'Four stone torches, Si Kelam, and Mak Lampir.']].forEach(function (s) {
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
    return (this.S.quests.ch4 || 0) >= 4 ? rows.concat(this.ch5Rows(vid, v, por)) : rows;
  };
  var chapterRows = LC.UIScene.prototype.chapterRows;
  LC.UIScene.prototype.chapterRows = function () {
    var rows = chapterRows.call(this);
    return (this.S.quests.ch4 || 0) >= 4 && (this.S.quests.ch5 || 0) >= 1 ? rows.concat(this.ch5ChapterRows()) : rows;
  };
})(window.LC);
