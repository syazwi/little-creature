/* UI, part 14 (v2.5): Chapter 7, Puteri Santubong (see santubong.js). The goal line and the Journal's Chapter 7 page,
 * the jong's voyage to Santubong, the Talk rows (Puteri Gunung Ledang's mist and her journey, Mak Dayang's legend and
 * the wau, the two princesses, Putera Serapi's letters, sitting with Sang Bualang), and Sejinjang's rice-pounding game
 * (pound in time as the beats reach the lesung). Mixed into LC.UIScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var C7 = LC.C7, X = LC.CH7TEXT, ACCEPT = { KeyE: 1, Space: 1, Enter: 1 };
  function q() { return LC.State.s.quests; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  LC.ch7Goal = function () {
    var Q = q(), st = Q.ch7 || 0, W = LC.game && LC.game.scene.getScene('World');
    switch (st) {
      case 0: return 'Chapter 6 is complete! Rest at the farm. (A mist is coming in from the sea...)';
      case 1: return 'Chapter 7: sail to Gunung Ledang on the jong at the farm jetty, and see Puteri Gunung Ledang.';
      case 2: return 'Chapter 7: sail to Kampung Santubong on the jong (Borneo).';
      case 3: return 'Chapter 7: in Kampung Santubong, ask old Mak Dayang the weaver about the thunder.';
      case 4:
        if (!Q.c7askS || !Q.c7askJ) return 'Chapter 7: after dusk, meet ' + (!Q.c7askS && !Q.c7askJ ? 'both princesses: Santubong by her loom (west) and Sejinjang by her lesung (east).' : !Q.c7askS ? 'Puteri Santubong, by her loom in the west.' : 'Puteri Sejinjang, by her lesung in the east.');
        if (Q.c7kain && Q.c7beras) return 'Chapter 7: talk to either princess after dusk, and carry her words in the Kabus Ledang.';
        var parts = [];
        if (!Q.c7kain) parts.push('Santubong\'s cloth (' + (W && W.dyeList ? W.dyeList() : '3 dyes and golden thread') + '; weave at her loom after dusk)');
        if (!Q.c7beras) parts.push('Sejinjang\'s rice (3 padi; pound it with her at her lesung after dusk)');
        return 'Chapter 7: ' + parts.join('  ·  ') + '.';
      case 5: return 'Chapter 7: Sang Bualang\'s storm! Drive it out of Kampung Santubong (' + (Q.c7kills || 0) + ' / ' + C7.stormKills + ').';
      case 6: return 'Chapter 7: find Putera Serapi on the river path at the west edge of Kampung Santubong.';
      case 7: return Q.c7boss ? 'Chapter 7: defeat Sang Bualang! Stay out of his gusts and whirlwinds, and out of the lightning circles.' : 'Chapter 7: row the sampan from the Santubong jetty to Pulau Satang, and face Sang Bualang at the crag.';
      case 8: return !Q.c7sat ? 'Chapter 7: Sang Bualang is sulking by the crag on Pulau Satang. Sit with him.'
        : LC.State.count('wau_bualang') ? 'Chapter 7: give Sang Bualang the wau (Pulau Satang).' : 'Chapter 7: ask Mak Dayang in Santubong to help you make a wau for Bualang (3 rotan, 1 benang emas, 200 kepeng).';
      case 9: return Q.c7aboard ? 'Chapter 7: sail back to Kampung Santubong with Puteri Gunung Ledang.' : 'Chapter 7: sail to Gunung Ledang and ask the princess to come to Santubong.';
    }
    return null;
  };
  var goal5 = LC.ch5Goal;
  LC.ch5Goal = function () { var Q = q(); return (Q.ch6 || 0) >= 7 && (Q.ch7 || 0) < 10 ? LC.ch7Goal() : goal5(); };

  // the jong now sails to Santubong too
  var jongRows = LC.jongExtraRows;
  LC.jongExtraRows = function (where) {
    var ui = this, W = this.world, rows = jongRows ? jongRows.call(this, where) : [], st = q().ch7 || 0;
    if (st >= 2 && where !== 'santubong') rows.push({ icon: 'i_kain_santubong', label: 'Sail to Kampung Santubong', right: 'Sail', sub: 'The village between two mountains, on the coast of Borneo.' + (st === 9 && q().c7aboard ? ' Puteri Gunung Ledang is aboard.' : ''), action: function () { ui.closeModal(); W.sailTo('santubong'); } });
    return rows;
  };

  Object.assign(LC.UIScene.prototype, {
    ch7Rows: function (vid) {
      var self = this, W = this.world, Q = q(), st = Q.ch7 || 0, rows = [];
      function sayLines(arr, opts) { self.say(W.ch2Lines(arr), opts); }
      function night() { return LC.isDusk(LC.State.s); }
      if (vid === 'puteri_ledang' && st === 1) rows.push({ icon: 'i_kabus_ledang', label: 'The thunder over Santubong', right: 'Ask', sub: 'Ask the princess what she has for you.', action: function () {
        if (!LC.State.canAdd('kabus_ledang')) { self.toast('Your bag is full! Make room for the princess\'s gift first.'); LC.Audio.sfx('error'); return; }
        LC.State.add('kabus_ledang', 1); Q.ch7 = 2; LC.Audio.sfx('chime');
        sayLines(X.kabus); return 'close';
      } });
      if (vid === 'puteri_ledang' && st === 9 && !Q.c7aboard) rows.push({ icon: 'ic_glow', label: 'Come to Santubong', right: 'Ask', sub: 'Ask the princess to cross the sea with you, to speak to her old friends.', action: function () {
        Q.c7aboard = 1; LC.Audio.sfx('chime'); sayLines(X.ledangAsk); return 'close';
      } });
      if (vid === 'dayang' && st === 3) rows.push({ icon: 'ic_moon', label: 'The thunder', right: 'Ask', sub: 'Ask Mak Dayang about the thunder between the two mountains. (And give her Nenek\'s greeting.)', action: function () {
        Q.ch7 = 4; LC.Audio.sfx('chime');
        if (W.area === 'santubong') { W.placeVillager('santubong'); W.placeVillager('sejinjang'); }   // (they walk from tonight)
        sayLines(X.legend); return 'close';
      } });
      if (vid === 'dayang' && st === 8 && Q.c7sat && !LC.State.count('wau_bualang')) rows.push(this.craftRow('i_wau_bualang', 'A wau for Sang Bualang', '"A kite for the WIND? Ha! Of course. A moon kite, with a golden tail, so he can see it from far away."', C7.wau, C7.wauKepeng, function () {
        LC.State.add('wau_bualang', 1); LC.Audio.sfx('build');
        self.toast('Mak Dayang helps you build a wau bulan, a moon kite. Take it to Sang Bualang on Pulau Satang.', 'i_wau_bualang');
      }));
      if ((vid === 'santubong' || vid === 'sejinjang') && st === 4) {
        var mine = vid === 'santubong' ? 'c7askS' : 'c7askJ';
        if (!Q[mine]) rows.push({ icon: 'i_kabus_ledang', label: 'The thunder', right: 'Ask', sub: 'Tell her the princess of Gunung Ledang sent you.', action: function () {
          Q[mine] = 1; sayLines(vid === 'santubong' ? X.santubongAsk : X.sejinjangAsk); return 'close';
        } });
        else if (Q.c7kain && Q.c7beras) rows.push({ icon: 'i_kabus_ledang', label: 'Carry her words', right: 'Open', sub: 'Open the Kabus Ledang, and let her speak to her sister through the mist.', action: function () {
          self.closeModal(); W.c7Message(); return 'close';
        } });
        else if (vid === 'santubong') rows.push({ icon: 'i_kain_santubong', label: Q.c7kain ? 'The cloth is woven' : 'Her unfinished cloth', sub: Q.c7kain ? 'It is for her sister. Keep it safe.' : 'For the cloth: ' + W.dyeList() + '. Then weave it with her at the loom' + (night() ? '.' : ', after dusk.') });
        else rows.push({ icon: 'i_beras_sejinjang', label: Q.c7beras ? 'The rice is pounded' : 'The wedding rice', sub: Q.c7beras ? 'It is for her sister. Keep it safe.' : '3 padi (you have ' + LC.State.count('padi') + '), then pound it with her at the lesung' + (night() ? '.' : ', after dusk.') });
      }
      if (vid === 'serapi' && st === 6) rows.push({ icon: 'i_surat_serapi', label: 'The princesses', right: 'Ask', sub: 'Ask Putera Serapi what really happened, six hundred years ago.', action: function () {
        if (!LC.State.canAdd('surat_serapi')) { self.toast('Your bag is full!'); LC.Audio.sfx('error'); return; }
        LC.State.add('surat_serapi', 1); Q.ch7 = 7; LC.Audio.sfx('chime');
        sayLines(X.serapi); return 'close';
      } });
      if (vid === 'bualang' && st === 8 && !Q.c7sat) rows.push({ icon: 'ic_angin', label: 'Sit with him', right: 'Sit', sub: 'Do not say anything. Just sit down beside him.', action: function () {
        Q.c7sat = 1; sayLines(X.sit); return 'close';
      } });
      if (vid === 'bualang' && st === 8 && Q.c7sat && LC.State.count('wau_bualang')) rows.push({ icon: 'i_wau_bualang', label: 'Give him the wau', right: 'Give', sub: 'A moon kite of rattan and golden thread.', action: function () {
        LC.State.remove('wau_bualang', 1); Q.ch7 = 9; LC.Audio.sfx('chime');
        sayLines(X.wauGive); return 'close';
      } });
      if (vid === 'nenek' && st >= 1 && st <= 9) rows.push({ icon: 'ic_moon', label: 'Santubong', sub: '"The thunder between the mountains... I can still hear it, if I close my eyes. Go carefully, cucu. And say hello to Dayang."' });
      if (vid === 'nenek' && st >= 10) rows.push({ icon: 'i_kain_santubong', label: 'Santubong', right: 'Talk', sub: 'Tell Nenek about her old village.', action: function () { sayLines([{ who: 'nenek', text: pick(X.nenekAfter) }]); return 'close'; } });
      return rows;
    },
    ch7ChapterRows: function () {
      var Q = q(), st = Q.ch7 || 0, rows = [];
      rows.push({ icon: 'i_kain_santubong', label: 'Chapter 7: Puteri Santubong' + (st >= 10 ? '  (complete)' : ''), right: st >= 10 ? 'Done' : '', sub: LC.ch7Goal() || 'The thunder is gone from the bay, and the wind is your friend.' });
      [[1, 'A mist from Gunung Ledang', 'The princess\'s message, and where Nenek was born.'], [3, 'Kampung Santubong', 'Mak Dayang and the legend of the two mountains.'],
       [4, 'Two sisters', 'A cloth and the wedding rice, and words carried truly.'], [5, 'The storm', 'Sang Bualang shows himself.'], [6, 'Putera Serapi', 'What really happened.'],
       [7, 'Pulau Satang', 'The wind on the crag.'], [8, 'The sulking wind', 'Sit with him, and give him a wau.'], [9, 'Three princesses', 'Bring Puteri Gunung Ledang across the sea.']].forEach(function (s) {
        if (st < s[0]) return;
        var doneS = st > s[0];
        rows.push({ icon: doneS ? 'ic_bond' : 'ic_moon', label: (doneS ? '✓ ' : '') + s[1], right: doneS ? 'Done' : 'Now', sub: s[2] });
      });
      return rows;
    },

    // ================================================================ Sejinjang's rice: pound in time
    openLesung: function (cb) {
      this.closeModal();
      var self = this, c = this.modalC(95, 0x000000, 0.5), m, X0 = 160, Y0 = 110, Wd = 640, Hd = 380;
      var bg = this.add.graphics(); this.panel(bg, X0, Y0, Wd, Hd); c.add(bg);
      c.add(this.txt(480, Y0 + 16, 'Menumbuk padi', 26, '#ffd166', { ox: 0.5 }));
      c.add(this.txt(480, Y0 + 50, 'Pound when each beat reaches the lesung' + (this.touchOn ? ' (tap anywhere)' : ' (E, Space or click)') + '.  ' + C7.needHits + ' of ' + C7.beats + ' to win.', 15, '#cdb8a0', { ox: 0.5 }));
      var HX = 290, LY = 300, R = 24, SPEED = 210, GAP = 0.72, START = 1.6;
      var lane = this.add.graphics(); c.add(lane);
      lane.fillStyle(0x2e2219, 1); lane.fillRoundedRect(HX - 40, LY - 26, 470, 52, 12);
      lane.lineStyle(3, 0xffd166, 1); lane.strokeCircle(HX, LY, R);
      var lesung = this.add.image(HX - 80, LY + 20, 'lesung_antan').setScale(3).setOrigin(0.5, 1); c.add(lesung);
      var sj = this.add.image(X0 + Wd - 70, Y0 + 170, 'npc_sejinjang_0').setScale(4); c.add(sj);
      var say = this.txt(X0 + Wd - 70, Y0 + 230, '', 22, '#ffd8b0', { ox: 0.5, stroke: 4 }); c.add(say);
      var score = this.txt(480, Y0 + Hd - 46, '', 18, '#fbecc8', { ox: 0.5 }); c.add(score);
      var beats = [], hits = 0, misses = 0, t0 = this.time.now, over = false;
      for (var i = 0; i < C7.beats; i++) {
        var dot = this.add.image(-100, LY, 'i_padi').setScale(2.2); c.add(dot);
        beats.push({ at: START + i * GAP * (i % 4 === 3 ? 1.35 : 1) + (i > 3 ? 0.35 * Math.floor(i / 4) : 0), img: dot, done: false });
      }
      function render() { score.setText('Tum! ' + hits + '   ·   Missed ' + misses + '   ·   ' + (C7.beats - hits - misses) + ' to go'); }
      function now() { return (self.time.now - t0) / 1000; }
      function xOf(b) { return HX + (b.at - now()) * SPEED; }
      function finish() {
        if (over) return;
        over = true;
        var won = hits >= C7.needHits;
        say.setText(won ? 'TUM! Bagus!' : 'Hm. Again?');
        LC.Audio.sfx(won ? 'cheer' : 'error');
        self.time.delayedCall(1100, function () { close(); cb(won); });
      }
      function pound() {
        if (over) return;
        self.tweens.add({ targets: lesung, scaleY: 2.7, duration: 70, yoyo: true });
        var best = null, bd = 1e9;
        beats.forEach(function (b) { if (b.done) return; var d = Math.abs(xOf(b) - HX); if (d < bd) { bd = d; best = b; } });
        if (best && bd <= R + 6) {
          best.done = true; hits++; best.img.setTint(0xffd166);
          self.tweens.add({ targets: best.img, scale: 3.4, alpha: 0, duration: 260 });
          LC.Audio.sfx('build'); say.setText(pick(['Tum!', 'TUM!', 'Bagus!', 'Ha!']));
        } else { LC.Audio.sfx('click'); say.setText(pick(['Too soon!', 'Eh?', 'Wait for it...'])); }
        render();
      }
      var timer = this.time.addEvent({ delay: 16, loop: true, callback: function () {
        if (over) return;
        beats.forEach(function (b) {
          if (b.done) return;
          var x = xOf(b);
          b.img.setPosition(x, LY).setVisible(x < HX + 440 && x > HX - 60);
          if (x < HX - R - 8) { b.done = true; misses++; b.img.setTint(0x6a5a4a).setAlpha(0.4); say.setText('Missed!'); render(); }
        });
        if (beats.every(function (b) { return b.done; })) finish();
      } });
      var z = this.add.zone(X0, Y0, Wd, Hd).setOrigin(0).setInteractive(); c.add(z);
      z.on('pointerdown', function () { pound(); });
      function close() { timer.remove(); c.destroy(); if (self.modal === m) self.modal = null; }
      m = { type: 'game', close: close, key: function (code) { if (ACCEPT[code]) pound(); else if (code === 'Escape') { close(); } },
        peek: function () { return { hx: HX, r: R, hits: hits, misses: misses, beats: beats.map(function (b) { return { x: Math.round(xOf(b)), done: b.done }; }) }; } };   // (for tests)
      if (LC.DEVELOPER_HTML) m.devTick = function () {
        if (beats.some(function (beat) { return !beat.done && Math.abs(xOf(beat) - HX) < R * 0.65; })) self.pressKey('KeyE');
      };
      this.modal = m;
      render();
    }
  });

  // ---------------------------------------------------------------- hooks
  var specialRows = LC.UIScene.prototype.specialRows;
  LC.UIScene.prototype.specialRows = function (vid, v, por) {
    var rows = specialRows.call(this, vid, v, por);
    return (this.S.quests.ch6 || 0) >= 7 ? rows.concat(this.ch7Rows(vid)) : rows;
  };
  var chapterRows = LC.UIScene.prototype.chapterRows;
  LC.UIScene.prototype.chapterRows = function () {
    var rows = chapterRows.call(this);
    return (this.S.quests.ch7 || 0) >= 1 ? rows.concat(this.ch7ChapterRows()) : rows;
  };
})(window.LC);
