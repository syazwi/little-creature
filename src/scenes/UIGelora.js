/* UI, part 16 (v2.6): Chapter 8, Air Pasang (see gelora.js). The goal line and the Journal's Chapter 8 page, and the Talk
 * rows: Tok Duyung's news, the two rulers (the war, then the truth), Nek Lampir's confession and her cure, the Naga Mother
 * (fetching Nek Lampir; the pearl flute if your bag was full), and Nenek during and after the flood. Mixed into
 * LC.UIScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var C8 = LC.C8, X = LC.CH8TEXT;
  function q() { return LC.State.s.quests; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function n(o) { return Object.keys(o || {}).length; }

  LC.ch8Goal = function () {
    var Q = q(), st = Q.ch8 || 0, parts = [];
    switch (st) {
      case 0: return 'Chapter 7 is complete! Rest at the farm. (The river sounds louder than usual...)';
      case 1: return !LC.State.friend('naga') ? 'Chapter 8: befriend Naga Kecil on Pulau Mutiara (its blessing lets you breathe under the sea), then dive to Kampung Karang and ask Tok Duyung about the black water.'
        : 'Chapter 8: dive at the bubbles off Pulau Mutiara, and ask Tok Duyung in Kampung Karang about the black water.';
      case 2:
        if (!Q.c8ratu) parts.push('Kanjeng Ratu Kidul (the green arch, south of Kampung Karang)');
        if (!Q.c8pos) parts.push('Poseidon (the deep trench, west of Kampung Karang)');
        return 'Chapter 8: ask ' + parts.join(' and ') + ' about the war.';
      case 3: return 'Chapter 8: in the Selat Gelora (the black current, east of Kampung Karang), find where the black water comes from (' + n(Q.c8sh) + ' / ' + C8.shards + ' pieces of a jar).';
      case 4: return !Q.c8confess ? 'Chapter 8: sail to Gunung Ledang on the jong, and show the pieces of the jar to Nek Lampir (by the landing).'
        : 'Chapter 8: bring Nek Lampir (Gunung Ledang) 3 rumpai laut and a pearl for the cure (you have ' + LC.State.count('rumpai_laut') + ' and ' + LC.State.count('mutiara') + ').';
      case 5: return Q.c8boss ? 'Chapter 8: calm the two dragons! Wear each one out, and Nek Lampir\'s cure does the rest. Watch for waves, whirlpools, the water jet and the tail.'
        : 'Chapter 8: go back to the Selat Gelora, and swim through the current to the two dragons.';
      case 6: return Q.c8duel === 'kidul' ? 'Chapter 8: calm Kanjeng Ratu Kidul! Stay out of her waves, her green selendang and her whirlpools.'
        : Q.c8duel === 'pos' ? 'Chapter 8: now calm Poseidon! Watch for his trident, the lightning circles and the earthquake.'
        : 'Chapter 8: the Queen and Poseidon are fighting each other in the Selat Gelora! Swim into the deep beyond the current, and stop them.';
      case 7: return 'Chapter 8: ask the Naga Mother in the Selat Gelora to fetch Nek Lampir.';
      case 8: return 'Chapter 8: find Nek Lampir\'s black jars (' + n(Q.c8jar) + ' / ' + C8.jars + ' found, ' + (Q.c8sealed || 0) + ' sealed) and bring them to her pot by the farm jetty. (Ride Naga Kecil: hold the Seruling Naga and press USE, or R.)';
    }
    return null;
  };
  var goal7 = LC.ch5Goal;
  LC.ch5Goal = function () { var Q = q(); return (Q.ch7 || 0) >= 10 && (Q.ch8 || 0) < 9 ? LC.ch8Goal() : goal7(); };

  Object.assign(LC.UIScene.prototype, {
    ch8Rows: function (vid) {
      var self = this, W = this.world, Q = q(), st = Q.ch8 || 0, rows = [];
      function sayLines(arr, opts) { self.say(W.ch2Lines(arr), opts); }
      if (vid === 'duyung' && st === 1) rows.push({ icon: 'ic_moon', label: 'The black water', right: 'Ask', sub: 'Ask Tok Duyung why the sea is pushing up the river, black and salty.', action: function () {
        Q.ch8 = 2; LC.Audio.sfx('chime');
        sayLines(X.duyung); return 'close';
      } });
      if ((vid === 'ratukidul' || vid === 'poseidon') && st === 2) {
        var mine = vid === 'ratukidul' ? 'c8ratu' : 'c8pos';
        if (!Q[mine]) rows.push({ icon: 'ic_moon', label: 'The war', right: 'Ask', sub: 'Ask about the war in the Selat Gelora.', action: function () {
          Q[mine] = 1;
          if (Q.c8ratu && Q.c8pos) { Q.ch8 = 3; sayLines(vid === 'ratukidul' ? X.ratuWar : X.posWar, { onDone: function () { self.toast(X.asked, 'ic_moon'); } }); }
          else sayLines(vid === 'ratukidul' ? X.ratuWar : X.posWar);
          return 'close';
        } });
      }
      if (vid === 'lampir' && st === 4 && !Q.c8confess) rows.push({ icon: 'i_serpihan_balang', label: 'The black jar', right: 'Show', sub: 'Show Nek Lampir the pieces of the jar from the Selat Gelora.', action: function () {
        Q.c8confess = 1; sayLines(X.confess); return 'close';
      } });
      if (vid === 'lampir' && st === 4 && Q.c8confess) rows.push(this.craftRow('i_air_penawar', 'Air Penawar', 'Nek Lampir\'s cure for the two dragons.', C8.cure, 0, function () {
        Q.ch8 = 5; LC.State.add('air_penawar', C8.cureN);   // (first)
        LC.Audio.sfx('herbs');
        var nk = W.npcs && W.npcs.lampir;
        if (nk) { W.fx.smoke.explode(12, nk.spr.x, nk.spr.y - 12); W.fx.sparkle.explode(20, nk.spr.x, nk.spr.y - 14); W.shockwave(nk.spr.x, nk.spr.y - 10, 34, 0x7aff9a); }
        self.time.delayedCall(500, function () { sayLines(X.brewed); });
      }));
      if (vid === 'lampir' && st >= 5 && st <= 7) rows.push({ icon: 'i_air_penawar', label: 'The cure', sub: '"Hmph. Two bottles, two dragons. Do not waste them. And do not drink them, they taste of seaweed."' });
      if (vid === 'nagaibu' && st === 7) rows.push({ icon: 'ic_glow', label: 'Fetch Nek Lampir', right: 'Ask', sub: 'Ask the Naga Mother to bring Nek Lampir down from Gunung Ledang, so everybody can meet under the arch.', action: function () {
        self.closeModal(); W.c8Fetch(); return 'close';
      } });
      if (vid === 'nagaibu' && st >= 8 && Q.c8fluteOwed) rows.push({ icon: 'i_seruling_naga', label: 'The pearl flute', right: 'Take', sub: 'She kept the Seruling Naga safe while your bag was full.', action: function () {
        if (!LC.State.canAdd('seruling_naga')) { self.toast('Your bag is still full!'); LC.Audio.sfx('error'); return; }
        LC.State.add('seruling_naga', 1); delete Q.c8fluteOwed; LC.Audio.sfx('chime');
        self.toast('The Seruling Naga! Hold it and press USE (or R) to ride Naga Kecil.', 'i_seruling_naga'); return 'close';
      } });
      if (vid === 'nagaibu' && st >= 8) rows.push({ icon: 'i_seruling_naga', label: 'Naga Kecil', sub: 'Hold the Seruling Naga and press USE (or R) to ride: under the sea, and anywhere a basikal can go. Swing a weapon while you ride for a water jet.' });
      if (vid === 'nenek' && st >= 1 && st <= 7) rows.push({ icon: 'ic_moon', label: 'The flood', right: 'Talk', sub: 'The river is still rising.', action: function () { sayLines([{ who: 'nenek', text: pick(X.nenekFlood) }]); return 'close'; } });
      if (vid === 'nenek' && st >= 9) rows.push({ icon: 'i_seruling_naga', label: 'Air Pasang', right: 'Talk', sub: 'Talk with Nenek about the flood, the sea and Nek Lampir.', action: function () { sayLines([{ who: 'nenek', text: pick(X.nenekAfter) }]); return 'close'; } });
      return rows;
    },
    ch8ChapterRows: function () {
      var Q = q(), st = Q.ch8 || 0, rows = [];
      rows.push({ icon: 'i_seruling_naga', label: 'Chapter 8: Air Pasang' + (st >= 9 ? '  (complete)' : ''), right: st >= 9 ? 'Done' : '', sub: LC.ch8Goal() || 'The river runs clear, the sea is at peace, and Naga Kecil carries you wherever you like.' });
      [[1, 'The flood', 'The river rises, salty and black.'], [2, 'Two rulers', 'The Queen and Poseidon, each blaming the other.'], [3, 'The Selat Gelora', 'A war where the two seas meet.'],
       [4, 'Nek Lampir', 'Old jars, a stream, and a cure.'], [5, 'Two dragons', 'The Naga Mother and Ketos.'], [6, 'Queen against King', 'Stop the duel, calm them both, and tell them the truth.'],
       [7, 'Under the arch', 'Peace, and Naga Kecil grows.'], [8, 'Cleaning up', 'Six black jars for Nek Lampir\'s pot.']].forEach(function (s) {
        if (st < s[0]) return;
        var doneS = st > s[0];
        rows.push({ icon: doneS ? 'ic_bond' : 'ic_moon', label: (doneS ? '✓ ' : '') + s[1], right: doneS ? 'Done' : 'Now', sub: s[2] });
      });
      return rows;
    }
  });

  // Nek Lampir is busy at her pot during the clean-up
  LC.NEKTEXT.refuse.clean8 = 'I am busy cleaning up my own mess, by the farm jetty! Bring me those jars instead.';
  var nekRival = LC.WorldScene.prototype.nekRival;
  LC.WorldScene.prototype.nekRival = function () { return LC.ch8Step() === 8 ? 'clean8' : nekRival.call(this); };

  // ---------------------------------------------------------------- hooks
  var specialRows = LC.UIScene.prototype.specialRows;
  LC.UIScene.prototype.specialRows = function (vid, v, por) {
    var rows = specialRows.call(this, vid, v, por);
    return (this.S.quests.ch7 || 0) >= 10 ? rows.concat(this.ch8Rows(vid)) : rows;
  };
  var chapterRows = LC.UIScene.prototype.chapterRows;
  LC.UIScene.prototype.chapterRows = function () {
    var rows = chapterRows.call(this);
    return (this.S.quests.ch8 || 0) >= 1 ? rows.concat(this.ch8ChapterRows()) : rows;
  };
})(window.LC);
