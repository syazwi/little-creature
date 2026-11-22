/* UI, part 22 (v3.3): Chapter 11, Bulan dan Mutiara, Part 1 (see sulu.js). The goal line, the villagers' rows (the
 * Sultan, Mbo' Arani, Dinda, Mak Jaliha, Nenek), the jong to Lupah Sug, the Journal's chapter page, the kulintang lesson
 * (Mak Jaliha plays a phrase on five gongs; play it back), the pedoman at sea (your heading in Malay, and the wind), and
 * the moon going dark over the farm. Mixed into LC.UIScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var C = LC.C11, X = LC.CH11TEXT;
  function q() { return LC.State.s.quests; }
  function cnt(id) { return LC.State.count(id); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  var GONG = [0xe8b040, 0xe8a030, 0xd89a2a, 0xe0b850, 0xf0c860], CX = 868, CY = 262, CR = 50;
  var MALAY = [['U', 'Utara'], ['T', 'Timur'], ['S', 'Selatan'], ['B', 'Barat']];

  // ---------------------------------------------------------------- the goal line
  LC.ch11Goal = function () {
    var Q = q(), st = Q.ch11 || 0, W = LC.game && LC.game.scene.getScene('World');
    switch (st) {
      case 0: return 'Chapter 10 is complete! Rest at the farm. (Tomorrow night the moon will be full...)';
      case 1: return 'Chapter 11: talk to Mbo\' Arani by his vinta at the farm jetty, and sail to Sulu with him.';
      case 2: return W && W.area === 'sulu' ? 'Chapter 11: meet the Sultan of Sulu in front of the Astana, on the hill.' : 'Chapter 11: sail to Lupah Sug (Sulu) on the jong at the farm jetty, and meet the Sultan.';
      case 3: {
        var need = [];
        if (!Q.c11gong) need.push('learn the kulintang with Mak Jaliha (the gong hall, west)');
        if (!Q.c11pedoman) need.push(!Q.c11dive ? 'ask Mbo\' Arani (by the jetty) about a pedoman' : cnt('batu_berani') ? 'bring the batu berani to Mbo\' Arani' : 'dive at the end of the boardwalk (east) for the batu berani in the old sunken boat');
        if (!Q.c11prov) need.push('2 Tiyula Itum for the crew (' + Math.min(2, cnt('tiyula_itum')) + ' / 2: Mak Salma at the market sells it)');
        return need.length ? 'Chapter 11: ready the vinta: ' + need.join('; ') + '.' : 'Chapter 11: everything is ready. Talk to Mbo\' Arani by the jetty.';
      }
      case 4: {
        var leg = Q.c11leg || 0;
        if (!W || W.area !== 'lautsulu') return 'Chapter 11: take the helm of the vinta at the jetty of Lupah Sug, and follow the old chart.';
        return leg < C.legs.length ? 'Chapter 11: ' + X.leg[leg] : 'Chapter 11: drop anchor at Pulau Bulan (sail up to its landing and press ' + useKey() + ').';
      }
      case 5: return 'Chapter 11: the Bakunawa! Strike all three agung while they still ring; when it rises, dazed, strike it. Stay back from the water\'s edge and out of the circles.';
      case 6: return 'Chapter 11: sail back to Lupah Sug, and bring the Mutiara Kembar to the Sultan.';
    }
    return null;
  };
  function useKey() { var U = LC.game && LC.game.scene.getScene('UI'); return U && U.touchOn ? 'USE' : 'E'; }
  var goal10 = LC.ch5Goal;
  LC.ch5Goal = function () { var Q = q(); return (Q.ch10 || 0) >= 8 && (Q.ch11 || 0) < LC.CH11_END ? LC.ch11Goal() : goal10(); };

  // the jong sails to Lupah Sug too
  var jongRows = LC.jongExtraRows;
  LC.jongExtraRows = function (where) {
    var ui = this, W = this.world, rows = jongRows ? jongRows.call(this, where) : [], st = q().ch11 || 0;
    if (st >= 2 && where !== 'sulu') rows.push({ icon: 'i_mutiara_kembar', label: 'Sail to Lupah Sug (Sulu)', right: 'Sail', sub: 'The land of the Tausug and the Sama Dilaut, across the Sulu Sea.', action: function () { ui.closeModal(); W.sailTo('sulu'); } });
    return rows;
  };

  Object.assign(LC.UIScene.prototype, {
    ch11Rows: function (vid) {
      var self = this, W = this.world, Q = q(), S = this.S, st = Q.ch11 || 0, rows = [];
      function sayLines(arr, opts) { self.say(W.ch2Lines(arr), opts); }
      if (vid === 'nenek' && st >= 1) rows.push({ icon: 'i_mutiara_kembar', label: 'The serpent and the moon', right: 'Talk', sub: 'Tell Nenek about the Bakunawa.', action: function () { sayLines([{ who: 'nenek', text: pick(X.nenek) }]); return 'close'; } });
      if (vid === 'lampir' && st >= 7) rows.push({ icon: 'i_mutiara_kembar', label: 'A serpent that eats moons', right: 'Talk', sub: 'Tell Nek Lampir about the Bakunawa.', action: function () { sayLines([{ who: 'lampir', text: X.lampir }]); return 'close'; } });
      if (vid === 'sultan_sulu') {
        if (st === 2) rows.push({ icon: 'ic_moon', label: 'The Bakunawa', right: 'Talk', sub: 'The Sultan wants to tell you what the sea took from him.', action: function () { Q.ch11 = 3; LC.Audio.sfx('drum'); sayLines(X.sultan); return 'close'; } });
        if (st === 6) rows.push({ icon: 'i_mutiara_kembar', label: 'The Mutiara Kembar', right: cnt('mutiara_kembar') ? 'Give' : '', enabled: !!cnt('mutiara_kembar'), why: 'The twin pearls are still at the bottom of the sea... or in the Bakunawa.',
          sub: 'Bring the twin pearls home.', action: function () { self.c11Finish(); return 'close'; } });
        if (st >= 7) rows.push({ icon: 'i_mutiara_kembar', label: 'Two little moons', right: 'Talk', sub: 'The pearls shine in the Astana window again.', action: function () {
          sayLines([{ who: 'sultan_sulu', text: pick(['Every night they shine, and every night I count them. Two. Always two. I am a very happy sultan.', 'The Bakunawa came up by the harbour last night, with a little gold light in its eye. It looked at the moon, and went away again. Good serpent.', 'You are always welcome in Lupah Sug, Nakhoda. You and your little moon.']) }]); return 'close';
        } });
      }
      if (vid === 'arani') {
        if (st === 3 && !Q.c11dive) rows.push({ icon: 'i_pedoman', label: 'A pedoman', right: 'Talk', sub: 'A navigator needs a compass. Mbo\' Arani\'s is... somewhere.', action: function () { Q.c11dive = 1; sayLines(X.diveAsk); return 'close'; } });
        if (st === 3 && cnt('batu_berani') && !Q.c11pedoman) rows.push({ icon: 'i_batu_berani', label: 'The batu berani', right: 'Give', sub: 'Give Mbo\' Arani the lodestone from his old boat.', action: function () {
          LC.State.remove('batu_berani', cnt('batu_berani')); LC.State.add('pedoman', 1); Q.c11pedoman = 1; LC.Audio.sfx('chime');
          sayLines(X.pedoman, { onDone: function () { self.c11Ready(); } }); return 'close';
        } });
        if (st === 3 && !Q.c11prov) rows.push({ icon: 'i_tiyula_itum', label: 'Provisions for the crew', right: cnt('tiyula_itum') >= 2 ? 'Give' : Math.min(2, cnt('tiyula_itum')) + '/2', enabled: cnt('tiyula_itum') >= 2,
          why: 'The crew need 2 Tiyula Itum. Mak Salma at the market sells it, or cook it at Nenek\'s dapur (chicken meat, kelapa and herba).', sub: '2 Tiyula Itum, to keep the crew sailing all night.', action: function () {
            LC.State.remove('tiyula_itum', 2); Q.c11prov = 1; LC.Audio.sfx('eat'); sayLines(X.provisions, { onDone: function () { self.c11Ready(); } }); return 'close';
          } });
        if (st === 3 && Q.c11gong && Q.c11pedoman && Q.c11prov) rows.push({ icon: 'i_pedoman', label: 'Ready to sail', right: 'Talk', sub: 'Everything is ready.', action: function () { self.c11Ready(); return 'close'; } });
        if (st === 4) rows.push({ icon: 'i_pedoman', label: 'The old chart', right: 'Read', sub: (Q.c11leg || 0) < C.legs.length ? X.leg[Q.c11leg || 0] : 'Drop anchor at Pulau Bulan.', action: function () {
          sayLines([{ who: 'arani', text: 'From the harbour, Timur Laut to Batu Kembar. Then Timur, through the fog. In the black water, Selatan, to the island with no shadow. Take the helm at the jetty, Nakhoda.' }]); return 'close';
        } });
      }
      if (vid === 'dinda' && st === 3 && !Q.c11pedoman) rows.push({ icon: 'i_batu_berani', label: 'Diving', right: 'Talk', sub: 'Ask Dinda about the reef.', action: function () {
        if (!Q.c11dive) { Q.c11dive = 1; sayLines(X.diveAsk); } else sayLines([{ who: 'dinda', text: cnt('batu_berani') ? 'You found it! Give it to Grandfather, quick, before he loses it again.' : 'The old boat is on the reef, east of the coral, past the pearl beds. Dive at the end of the boardwalk!' }]);
        return 'close';
      } });
      if (vid === 'jaliha') {
        if (st === 3 && !Q.c11gong) rows.push({ icon: 'ic_kulintang11', label: 'Learn the kulintang', right: 'Play', sub: 'Mak Jaliha plays a phrase on the gongs; you play it back. Three phrases.', action: function () {
          sayLines(X.gongLesson, { onDone: function () { self.openKulintang(function () { Q.c11gong = 1; LC.Audio.sfx('chime'); sayLines(X.gongWon, { onDone: function () { self.c11Ready(); } }); }, function () { sayLines(X.gongQuit); }); } }); return 'close';
        } });
        if (Q.c11gong) rows.push({ icon: 'ic_kulintang11', label: 'Play the kulintang', right: 'Play', sub: 'Just for the joy of it.', action: function () { self.openKulintang(function () { LC.Audio.sfx('cheer'); self.toast('Mak Jaliha nods along. "Not bad. For a farmer."', 'npc_jaliha_0'); }); return 'close'; } });
      }
      return rows;
    },
    c11Ready: function () {   // once the vinta is ready, Mbo' Arani hands you the helm
      var Q = q(), W = this.world;
      if ((Q.ch11 || 0) !== 3 || !(Q.c11gong && Q.c11pedoman && Q.c11prov)) return;
      Q.ch11 = 4; Q.c11leg = 0;   // (first)
      LC.Audio.sfx('stage');
      this.say(W.ch2Lines(X.helmGive));
    },
    c11Finish: function () {
      var Q = q(), S = this.S, W = this.world;
      if ((Q.ch11 || 0) !== 6 || !cnt('mutiara_kembar')) return;
      LC.State.remove('mutiara_kembar', cnt('mutiara_kembar'));
      Q.ch11 = 7;   // (first: closing the lines early never loses the reward)
      S.kepeng += C.reward; S.stats.earned += C.reward; LC.State.add('mutiara', 3);
      LC.Audio.sfx('cheer'); LC.Audio.sfx('agung11');
      if (W && W.cameras) W.cameras.main.flash(500, 255, 240, 200);
      W.doShared('kind', { n: 10 }, function () {});
      this.say(W.ch2Lines(X.home));
    },
    ch11ChapterRows: function () {
      var Q = q(), st = Q.ch11 || 0, rows = [];
      rows.push({ icon: 'i_mutiara_kembar', label: 'Chapter 11: Bulan dan Mutiara' + (st >= LC.CH11_END ? '  (Part 1 complete)' : ''), right: st >= LC.CH11_END ? 'Done' : '', sub: LC.ch11Goal() || 'The twin pearls shine in the Astana again, and the Bakunawa has a light of its own. (Part 2 is on the way.)' });
      [[1, 'The dark moon', 'An eclipse over the farm, a serpent in the river, and a vinta full of gongs.'], [2, 'The Sultan of Sulu', 'Lupah Sug, and the twin pearls the sea took.'],
       [3, 'Ready the vinta', 'The kulintang, the batu berani and the pedoman, and soup for the crew.'], [4, 'Captain of the vinta', 'Timur Laut, Timur, Selatan: across the Sulu Sea by the old chart.'],
       [5, 'The Bakunawa', 'Three agung on the island with no shadow.'], [6, 'Two little moons', 'The Mutiara Kembar come home.']].forEach(function (s) {
        if (st < s[0]) return;
        var doneS = st > s[0];
        rows.push({ icon: doneS ? 'ic_bond' : 'ic_moon', label: (doneS ? '✓ ' : '') + s[1], right: doneS ? 'Done' : 'Now', sub: s[2] });
      });
      return rows;
    },

    // ================================================================ the kulintang: Mak Jaliha plays, you play it back
    openKulintang: function (onWin, onQuit, pats, title) {   // (v3.4: pats = phrase lengths, for the fleet's signal)
      var PATS = pats || C.patterns;
      var self = this, W = this.world, F = this.gameFrame(title || 'Kulintang', 660, 440), XX = F.X, YY = F.Y, g = F.g, m, done = false, round = 0;
      F.c.list.forEach(function (o) { if (o.text && /give up/.test(o.text)) o.setText(self.touchOn ? 'Tap the gongs  ·  X (top) to stop' : 'Keys 1-5, or click the gongs  ·  Esc to stop'); });
      var tok = this.add.image(XX + 70, YY + 330, 'npc_jaliha_0').setScale(4).setOrigin(0.5, 1);
      var me = this.add.image(XX + 590, YY + 330, LC.Art.plKey(W.pc || 0) + '_side_0').setScale(4).setOrigin(0.5, 1).setFlipX(true);
      F.c.add([tok, me]);
      var gongs = [];
      for (var j = 0; j < C.gongs; j++) (function (j) {
        var x = 480 + (j - 2) * 80, y = YY + 200, z = self.add.zone(x - 34, y - 30, 68, 60).setOrigin(0).setInteractive({ useHandCursor: true });
        z.isTouchBtn = true; z.on('pointerdown', function () { press(j); });
        F.c.add(z);
        if (!self.touchOn) F.c.add(self.txt(x, y + 42, String(j + 1), 13, '#a08a6a', { ox: 0.5 }));
        gongs.push({ x: x, y: y, hit: -9999 });
      })(j);
      var seq = [], phase = 'listen', t0, played = 0, pos = 0;
      function newRound() {
        var n = PATS[round], last = -1; seq = [];
        for (var i = 0; i < n; i++) { var d; do { d = Math.floor(Math.random() * C.gongs); } while (d === last && Math.random() < 0.7); seq.push(d); last = d; }
        phase = 'listen'; t0 = self.time.now + 600; played = 0; pos = 0;
        F.msg.setText((PATS.length > 1 ? 'Phrase ' + (round + 1) + ' of ' + PATS.length + ': ' : '') + 'listen to Mak Jaliha...').setColor('#fbecc8');
      }
      function tone(i, hers) {
        gongs[i].hit = self.time.now;
        try {
          var A = LC.Audio, t = A.ctx && A.ctx.state === 'running' ? A.ctx.currentTime + 0.01 : 0;
          if (t) { A.gong(A.freq(5 + i), t, 1.3, hers ? 0.16 : 0.18); A.bell(A.freq(10 + i), t, 0.5, 0.05); }
        } catch (e) { /* ignore */ }
        self.tweens.add({ targets: hers ? tok : me, y: (hers ? tok : me).y - 6, duration: 80, yoyo: true });
      }
      function press(i) {
        if (phase !== 'you' || done) return;
        tone(i, false);
        if (i === seq[pos]) {
          pos++;
          if (pos >= seq.length) {
            round++;
            if (round >= PATS.length) {
              phase = 'won'; F.msg.setText('The gongs ring together. Mak Jaliha smiles.').setColor('#b8f0c8');
              self.time.delayedCall(1300, function () { if (done) return; done = true; close(); if (onWin) onWin(); });
            } else { phase = 'wait'; F.msg.setText('Good!').setColor('#b8f0c8'); self.time.delayedCall(900, function () { if (!done) newRound(); }); }
          }
        } else {
          phase = 'wait'; F.msg.setText('Not quite. Listen again...').setColor('#ff8a7a'); LC.Audio.sfx('error');
          self.time.delayedCall(1300, function () { if (done) return; phase = 'listen'; t0 = self.time.now + 300; played = 0; pos = 0; F.msg.setText('Listen again...').setColor('#fbecc8'); });
        }
      }
      function loop(now) {
        if (phase === 'listen') {
          var el = (now - t0) / 1000;
          if (played < seq.length && el >= played * 0.62) { tone(seq[played], true); played++; }
          if (played >= seq.length && el >= seq.length * 0.62 + 0.3) { phase = 'you'; pos = 0; F.msg.setText('Your turn: play it back (' + seq.length + ' gongs).').setColor('#fbecc8'); }
        }
        g.clear();
        g.fillStyle(0x7a2a1e, 1); g.fillRect(480 - 220, YY + 222, 440, 14); g.fillStyle(0xf2c94c, 1); g.fillRect(480 - 220, YY + 222, 440, 3);   // the carved frame
        gongs.forEach(function (G, i) {
          var a = Math.max(0, 1 - (now - G.hit) / 420), wob = a * Math.sin(now / 30) * 3;
          g.fillStyle(0x3a2414, 1); g.fillEllipse(G.x, G.y + 18, 64, 14);
          g.fillStyle(0x8a5a1a, 1); g.fillCircle(G.x + wob, G.y, 30);
          g.fillStyle(GONG[i], 0.85 + 0.15 * a); g.fillCircle(G.x + wob, G.y, 26);
          g.fillStyle(0xa8741e, 1); g.fillCircle(G.x + wob, G.y, 11 + a * 2); g.fillStyle(0xfff2c0, 0.6 + 0.4 * a); g.fillCircle(G.x + wob - 3, G.y - 3, 4);
          if (a > 0) { g.lineStyle(2, 0xfff2c0, a); g.strokeCircle(G.x, G.y, 30 + (1 - a) * 22); }
          if (phase === 'you') { g.lineStyle(2, 0xf2c94c, 0.6); g.strokeCircle(G.x, G.y, 33); }
        });
        for (var p = 0; p < seq.length; p++) { g.fillStyle(phase === 'you' || phase === 'won' ? (p < pos ? 0x9be15d : 0x5a4a3a) : 0x3a2e24, 1); g.fillCircle(480 - (seq.length - 1) * 13 + p * 26, YY + 300, 7); }
      }
      var ev = this.time.addEvent({ delay: 16, loop: true, callback: function () { loop(self.time.now); } });
      function close() { ev.remove(); F.c.destroy(); if (self.modal === m) self.modal = null; }
      this.kulintang11 = { seq: function () { return seq; }, phase: function () { return phase; }, round: function () { return round; } };   // (for the automated tests)
      m = {
        type: 'game',
        key: function (code) {
          var dm = /^(Digit|Numpad)([1-5])$/.exec(code);
          if (dm) press(parseInt(dm[2], 10) - 1);
          else if (code === 'Escape') { if (done) return; done = true; close(); if (onQuit) onQuit(); }
        },
        click: function () {},
        close: function () { if (done) return; done = true; close(); if (onQuit) onQuit(); }
      };
      this.modal = m;
      newRound();
    },

    // ================================================================ the pedoman at sea, and the moon going dark
    buildCompass11: function () {
      this.cmpG = this.add.graphics();
      this.cmpT = MALAY.map(function (m) { return this.txt(0, 0, m[0], 15, '#3a2a1a', { ox: 0.5, oy: 0.5 }); }, this);
      this.cmpName = this.txt(CX, CY + CR + 14, '', 15, '#ffe8a0', { ox: 0.5, stroke: 4 });
      this.cmpWind = this.txt(CX, CY + CR + 32, '', 11, '#bfe0f0', { ox: 0.5, stroke: 3 });
      var dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]], self = this;
      this.cmpT.forEach(function (t, i) { t.setPosition(CX + dirs[i][0] * (CR - 18), CY + dirs[i][1] * (CR - 18)); });
      this.pin('tr', [this.cmpG, this.cmpName, this.cmpWind].concat(this.cmpT));
      this.moonI = this.add.image(480, 92, 'bulan11').setScale(2.2).setVisible(false);
      this.moonS = this.add.image(480, 92, 'gerhana11').setScale(2.3).setVisible(false);
      this.pin('tc', [this.moonI, this.moonS]);
      this.layout();   // (built late, so place it now)
      void self;
    },
    drawCompass11: function () {
      var W = this.world, c = W && W.c11, sh = c && c.ship, show = !!(sh && !W.leaving);
      if (!this.cmpG) this.buildCompass11();
      var g = this.cmpG;
      g.clear();
      [this.cmpName, this.cmpWind].concat(this.cmpT).forEach(function (o) { o.setVisible(show); });
      if (show) {
        var x = CX, y = CY, a = sh.ang, wa = c.wind.ang;   // (the graphics are pinned to the corner already)
        g.fillStyle(0x2a1a10, 0.85); g.fillCircle(x, y, CR + 6);
        g.fillStyle(0xa8741e, 1); g.fillCircle(x, y, CR + 3);
        g.fillStyle(0xeef4f0, 1); g.fillCircle(x, y, CR - 1);
        for (var k = 0; k < 8; k++) {   // the eight winds
          var ka = k * Math.PI / 4, r0 = k % 2 ? CR - 4 : CR - 8, r1 = CR - 1;   // (short, so they never cross the letters)
          g.lineStyle(k % 2 ? 1 : 2, 0x6a5a4a, 1); g.lineBetween(x + Math.cos(ka) * r0, y + Math.sin(ka) * r0, x + Math.cos(ka) * r1, y + Math.sin(ka) * r1);
        }
        // the wind: a pale blue arrow
        g.lineStyle(3, 0x6ab8e0, 0.85); g.lineBetween(x - Math.cos(wa) * 24, y - Math.sin(wa) * 24, x + Math.cos(wa) * 20, y + Math.sin(wa) * 20);
        g.fillStyle(0x6ab8e0, 0.9); g.fillTriangle(x + Math.cos(wa) * 27, y + Math.sin(wa) * 27, x + Math.cos(wa + 2.6) * 10 + Math.cos(wa) * 18, y + Math.sin(wa + 2.6) * 10 + Math.sin(wa) * 18, x + Math.cos(wa - 2.6) * 10 + Math.cos(wa) * 18, y + Math.sin(wa - 2.6) * 10 + Math.sin(wa) * 18);
        // your heading: the red needle
        var tip = CR - 10;
        g.fillStyle(0xc8323a, 1); g.fillTriangle(x + Math.cos(a) * tip, y + Math.sin(a) * tip, x + Math.cos(a + 1.57) * 6, y + Math.sin(a + 1.57) * 6, x + Math.cos(a - 1.57) * 6, y + Math.sin(a - 1.57) * 6);
        g.fillStyle(0x2a2a32, 1); g.fillTriangle(x - Math.cos(a) * (tip - 14), y - Math.sin(a) * (tip - 14), x + Math.cos(a + 1.57) * 6, y + Math.sin(a + 1.57) * 6, x + Math.cos(a - 1.57) * 6, y + Math.sin(a - 1.57) * 6);
        g.fillStyle(0xa8741e, 1); g.fillCircle(x, y, 4);
        var name = LC.compassName(a);
        if (this.cmpName.text !== name) this.cmpName.setText(name);
        var wn = 'Angin: ' + LC.compassName(wa);
        if (this.cmpWind.text !== wn) this.cmpWind.setText(wn);
      }
      // the moon going dark over the farm
      var f = c ? c.eclipseF || 0 : 0;
      this.moonI.setVisible(f > 0.01 && !!W && (W.area === 'farm' || W.area === 'kapal11')); this.moonS.setVisible(this.moonI.visible);
      if (this.moonI.visible) {
        var mo = this.anchorOff('tc');
        this.moonI.setTint(Phaser.Display.Color.GetColor(255, Math.round(255 - 140 * f), Math.round(255 - 170 * f)));
        this.moonS.setPosition(480 + mo.x + (1 - f) * 84, 92 + mo.y - (1 - f) * 20).setAlpha(0.92);
      }
    }
  });

  // ---------------------------------------------------------------- hooks
  var specialRows = LC.UIScene.prototype.specialRows;
  LC.UIScene.prototype.specialRows = function (vid, v, por) {
    var rows = specialRows.call(this, vid, v, por);
    return (this.S.quests.ch10 || 0) >= 8 ? rows.concat(this.ch11Rows(vid)) : rows;
  };
  var chapterRows = LC.UIScene.prototype.chapterRows;
  LC.UIScene.prototype.chapterRows = function () {
    var rows = chapterRows.call(this);
    return (this.S.quests.ch11 || 0) >= 1 ? rows.concat(this.ch11ChapterRows()) : rows;
  };
  var drawSkills = LC.UIScene.prototype.drawSkills;
  LC.UIScene.prototype.drawSkills = function () { drawSkills.apply(this, arguments); this.drawCompass11(); };
})(window.LC);
