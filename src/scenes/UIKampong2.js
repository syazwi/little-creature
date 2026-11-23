/* UI, part 9 (v2.1): Chapter 3, Kampong Ayer (part 2). Talk rows for the jinn story, the old ogre's trade, Antonio's
 * tour, Pak Damit's orders, the meriam game, and Chapter 3's goal line from step 8 on. Mixed into LC.UIScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  function q() { return LC.State.s.quests; }
  function need(map) { return Object.keys(map).map(function (id) { return LC.ITEMS[id].name + ' ' + Math.min(LC.State.count(id), map[id]) + '/' + map[id]; }).join(', '); }
  LC.OGRE_TRADE = { ikan_bakar: 3, kelapa: 4, ambuyat: 2 };

  var goal1 = LC.ch3Goal;
  LC.ch3Goal = function () {
    var S = LC.State.s, Q = S.quests, st = Q.ch3 || 0, w = LC.kaWar;
    if ((Q.ch2 || 0) < 8 || st < 8) return goal1();
    switch (st) {
      case 8: return 'Chapter 3, part 2: talk to Awang Semaun in Barunai. Something is wrong in the bay.';
      case 9: return 'Chapter 3: find the old ogre by the cliffs of Gunung Kabus (west side) and trade for the magic fish skin (' + need(LC.OGRE_TRADE) + ').';
      case 10: return LC.State.count('kulit_ikan') ? 'Chapter 3: row to Teluk Barunai and join the three heroes on Pulau Pilong-Pilongan to face Bilanapura.' : 'Chapter 3: you lost the magic fish skin! Tok Gergasi in Gunung Kabus may have another.';
      case 11:
        if (LC.kaArea !== 'kayer') return 'Chapter 3: Pelita is glowing. Use the old stone lamp beside the Balai in Barunai.';
        if (!Q.tourOn) return '1521: talk to Antonio, the writer by the foreign ship (bottom right).';
        var n = Object.keys(Q.tour || {}).length;
        return n >= LC.TOUR.length ? '1521: Antonio has seen everything. Go back to him by his ship.' : '1521: show Antonio the floating market, the brassmiths and the great hall (' + n + ' / ' + LC.TOUR.length + ').';
      case 12:
        if (LC.kaArea !== 'kayer') return 'Chapter 3: Pelita\'s stone lamp by the Balai glows again. Something is wrong in the future...';
        if (!w || !w.wave) return '1578: the city is under attack!';
        var c = w.wave === 1 ? ' (' + w.ships.filter(function (s) { return s.gone; }).length + ' / 3)' : w.wave === 2 ? ' (' + w.out + ' / ' + LC.WAR.fires.length + ')' : w.wave === 3 ? ' (' + w.saved + ' / ' + LC.WAR.families.length + ')' : ' (' + w.down + ' / ' + LC.WAR.soldiers + ')';
        return '1578: ' + LC.WAR.goals[w.wave].replace(/ \(\d+\)\.$/, '.').replace(/\.$/, '') + c + '.';
    }
    return null;
  };

  Object.assign(LC.UIScene.prototype, {
    ch3Rows2: function (vid, v, por) {
      var self = this, S = this.S, W = this.world, Q = q(), st = Q.ch3 || 0, rows = [], C = LC.CH3TEXT2;
      function sayLines(arr, opts) { self.say(W.ch2Lines(arr), opts); }
      if (vid === 'semaun') {
        if (st === 8) rows.push({ icon: 'ic_moon', label: 'Trouble in the bay', right: 'Talk', sub: 'Awang Semaun looks worried, which is not like him.', action: function () {
          sayLines(C.jinn, { onDone: function () { Q.ch3 = 9; LC.Audio.sfx('drum'); } });
          return 'close';
        } });
        if (st >= 11) rows.push({ icon: 'ic_str', label: 'Bilanapura', sub: '"Nine months! Next time a jinn rises, I am asking you first."' });
      }
      if (vid === 'jerambak') {
        if (st === 9) rows.push({ icon: 'i_kulit_ikan', label: 'The magic fish skin', sub: 'The old ogre lives by the cliffs on the west side of Gunung Kabus. "Take him something good to eat. Ogres are always hungry."' });
        if (st === 10) rows.push({ icon: 'i_kulit_ikan', label: 'To Pulau Pilong-Pilongan', sub: LC.State.count('kulit_ikan') ? '"Semaun, Sari and I will wait for you on the island in Teluk Barunai. Bring the fish skin!"' : '"Where is the fish skin? Go back to Tok Gergasi!"' });
        if (st >= 11) rows.push({ icon: 'ic_hp', label: 'Gelang Jerambak', sub: 'His father\'s armband keeps you safe: +20 max health.' });
      }
      if (vid === 'gergasi' && (st === 9 || (st === 10 && !LC.State.count('kulit_ikan')))) {
        var T3 = LC.OGRE_TRADE, ok = LC.State.has(T3);
        rows.push({ icon: 'i_kulit_ikan', label: 'Trade for the magic fish skin', right: ok ? 'Trade' : '', sub: '"A good meal for an old ogre: ' + need(T3) + '." (Ambuyat: Hapu Awang in Barunai.)',
          enabled: ok, why: 'Tok Gergasi would like ' + need(T3) + '.',
          action: function () {
            if (!LC.State.canAdd('kulit_ikan')) { self.toast('Make room in your bag first!'); LC.Audio.sfx('error'); return; }
            LC.State.takeAll(T3); LC.State.add('kulit_ikan', 1); Q.ch3 = 10; LC.State.addFriendship('gergasi', 4);
            LC.Audio.sfx('chime');
            self.say([{ text: C.skin }], { onDone: function () { self.toast('Bring the magic fish skin to the heroes on Pulau Pilong-Pilongan (Teluk Barunai).', 'i_kulit_ikan'); } });
            return 'close';
          } });
      }
      if (vid === 'berbai') {
        if (st === 11 || st === 12) rows.push({ icon: 'pelita_batu', iconScale: 1.4, label: 'Pelita\'s stone lamp', sub: C.lampHint + (st === 12 ? ' It is glowing again: there is one more thing Pelita wants you to see.' : ' Touch it, and see where Pelita\'s light takes you.') });
        if (st >= 13) rows.push({ icon: 'ic_glow', label: 'Six hundred years', sub: '"So the city will stand, burn, and stand again, for six hundred years. Then every pole we drive today matters," he says, and goes back to work.' });
        if (st >= 13 && !Q.lantakaGot) rows.push({ icon: 'i_lantaka', label: 'Pak Damit\'s Lantaka', right: 'Take', sub: 'Somehow the little brass cannon from 1578 is waiting here for you.', action: function () {
          if (!LC.State.add('lantaka', 1)) { self.toast('Make room in your bag first!'); LC.Audio.sfx('error'); return; }
          Q.lantakaGot = 1; LC.Audio.sfx('chime'); return 'close';
        } });
      }
      if (vid === 'antonio' && st === 11) {
        var n = Object.keys(Q.tour || {}).length;
        if (!Q.tourOn) rows.push({ icon: 'i_catatan_antonio', label: 'Show Antonio around', right: 'Go', sub: 'The floating market, the brassmiths, and the great hall on the hill.', action: function () {
          Q.tourOn = 1; W.refreshTour(); LC.Audio.sfx('chime'); self.toast('Show Antonio the floating market, the brassmiths and the great hall (look for the sparkles).', 'i_catatan_antonio'); return 'close';
        } });
        else if (n < LC.TOUR.length) rows.push({ icon: 'i_catatan_antonio', label: 'The tour (' + n + ' / ' + LC.TOUR.length + ')', sub: 'Still to see: ' + LC.TOUR.filter(function (t, i) { return !(Q.tour || {})[i]; }).map(function (t) { return t.name; }).join(', ') + '.' });
        else rows.push({ icon: 'i_catatan_antonio', label: 'Antonio\'s journal', right: 'Talk', sub: 'He has seen everything, and he is writing very fast.', action: function () { W.tourDone(); return 'close'; } });
      }
      if (vid === 'damit' && st === 12) {
        var w = LC.kaWar;
        rows.push({ icon: 'i_lantaka', label: 'Orders', sub: w && w.wave ? LC.WAR.goals[w.wave] : 'Get ready!' });
      }
      return rows;
    },

    // ================================================================ the meriam: two hits from four shots turn a warship back
    openMeriam: function (cb) {
      var self = this, F = this.gameFrame('Fire the meriam!', 620, 420), g = F.g, X = F.X, Y = F.Y, CX = X + 310, CY = Y + 160;
      var ship = this.add.image(CX, CY + 40, 'kapal_layar').setScale(1.6).setOrigin(0.5, 1).setTint(0xb8a890);
      F.c.add(ship);
      var hits = 0, shots = 0, done = false, cool = 0, t0 = this.time.now, last = t0, MAX = 4, res = [];
      F.msg.setText('Tap when the ship crosses the sight. Two hits turn it back! (' + MAX + ' shots)');
      var close = this.runGame(F, function () {
        if (done || cool > 0) return;
        shots++; cool = 0.9;
        LC.Audio.sfx('punch'); self.cameras.main.shake(120, 0.004);
        var hit = Math.abs(ship.x - CX) < 36;
        res.push(hit);
        if (hit) {
          hits++; LC.Audio.sfx('crumble');
          F.msg.setText(hits >= 2 ? 'Direct hit! The warship turns away!' : 'Hit! One more!').setColor('#b8f0c8');
          self.tweens.add({ targets: ship, angle: 4, duration: 90, yoyo: true, repeat: 2 });
        } else { LC.Audio.sfx('splash'); F.msg.setText('Splash! A miss.').setColor('#ff8a7a'); }
        if (hits >= 2 || shots >= MAX) { done = true; self.time.delayedCall(1200, function () { close(); cb(hits >= 2); }); }
      }, function (now) {
        var dt = Math.min(0.05, (now - last) / 1000); last = now;
        cool -= dt;
        if (!done) ship.x = CX + Math.sin((now - t0) / 1000 * (1.3 + shots * 0.18)) * 210;
        g.clear();
        g.lineStyle(2, 0xffd166, 1); g.strokeCircle(CX, CY, 22); g.lineBetween(CX - 34, CY, CX - 12, CY); g.lineBetween(CX + 12, CY, CX + 34, CY); g.lineBetween(CX, CY - 34, CX, CY - 12); g.lineBetween(CX, CY + 12, CX, CY + 34);
        if (cool > 0.6) { g.fillStyle(0xfff2b0, (cool - 0.6) * 3); g.fillCircle(CX, CY, 16); }
        for (var i = 0; i < MAX; i++) { g.fillStyle(i < res.length ? (res[i] ? 0x9be15d : 0xe07a5f) : 0x5a4a3a, 1); g.fillCircle(CX - 42 + i * 28, Y + 300, 8); }
      }, function () { cb(null); });
      if (LC.DEVELOPER_HTML) this.modal.devTick = function () {
        if (!done && cool <= 0 && Math.abs(ship.x - CX) < 26) self.pressKey('KeyE');
      };
    }
  });

  // ---------------------------------------------------------------- hooks
  var ch3Rows = LC.UIScene.prototype.ch3Rows;
  LC.UIScene.prototype.ch3Rows = function (vid, v, por) { return ch3Rows.call(this, vid, v, por).concat(this.ch3Rows2(vid, v, por)); };
})(window.LC);
