/* UI, part 17 (v2.7): Chapter 9, Ulek Mayang (see mayang.js). The goal line and the Journal's Chapter 9 page; the Talk
 * rows (Mak Som and her Nasi Kunyit, Tok Pawang, Nenek); the jong's new voyage to Kampung Pantai Kabus; the Ulek Mayang
 * itself (Tok Pawang sings a line on five lamps, and you sing it back); the dark at the edges of the screen and the faint
 * light that shows where the song is coming from; the jump scares (they can be switched to a gentler fright in the pause
 * menu); and the Lagu Mayang button (L), above the wau. Mixed into LC.UIScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var C9 = LC.C9, X = LC.CH9TEXT;
  var LX = 56, LY = 448;   // the third row of skill buttons: Lagu Mayang, above the wau
  var LAMP = [0xff8a5a, 0xffd166, 0x9be15d, 0x8fd3ff, 0xc8a0ff];
  function q() { return LC.State.s.quests; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  LC.ch9Goal = function () {
    var Q = q(), st = Q.ch9 || 0;
    switch (st) {
      case 0: return 'Chapter 8 is complete! Rest at the farm. (Some nights the river sounds almost like somebody singing...)';
      case 1: return !Q.c9arrive ? 'Chapter 9: look in the empty boat at the farm jetty, then sail on the jong to Kampung Pantai Kabus.' : 'Chapter 9: talk to Mak Som, by the lit house in Kampung Pantai Kabus.';
      case 2: return 'Chapter 9: in Pantai Bakau (west of the village), follow the song and find where it is coming from. (It is louder when you are close; the faint light at the edge of the screen points the way.)';
      case 3:
        if (!Q.c9pawang) return 'Chapter 9: talk to Tok Pawang at his hut in Kampung Pantai Kabus.';
        var need = [];
        if (!LC.State.count('mayang_pinang')) need.push('the mayang from the old pinang palm (north-west Pantai Bakau, at the end of the boardwalk)');
        if (!LC.State.count('nasi_kunyit')) need.push('Nasi Kunyit from Mak Som (7 nasi, 1 kelapa)');
        return need.length ? 'Chapter 9: bring Tok Pawang ' + need.join(' and ') + '.' : 'Chapter 9: you have the mayang and the rice. Go to Tok Pawang.';
      case 4: return 'Chapter 9: meet Tok Pawang on the beach at Pantai Bakau, and sing the Ulek Mayang with him.';
      case 5: return 'Chapter 9: dive into the whirlpool off Pantai Bakau, and find the clam where Pak Awang\'s spirit is humming (Gua Puteri Tujuh).';
      case 6: return 'Chapter 9: take Pak Awang\'s spirit home to him in Kampung Pantai Kabus.';
    }
    return null;
  };
  var goal8 = LC.ch5Goal;
  LC.ch5Goal = function () { var Q = q(); return (Q.ch8 || 0) >= 9 && (Q.ch9 || 0) < 7 ? LC.ch9Goal() : goal8(); };

  // the jong sails to Pantai Kabus too
  var jongRows = LC.jongExtraRows;
  LC.jongExtraRows = function (where) {
    var ui = this, W = this.world, rows = jongRows ? jongRows.call(this, where) : [], st = q().ch9 || 0;
    if (st >= 1 && where !== 'kabus') rows.push({ icon: 'i_mayang_pinang', label: 'Sail to Kampung Pantai Kabus', right: 'Sail', sub: 'A fishing village on the coast of Terengganu' + (st < 7 ? ', lost in the fog. Juragan Wira does not want to go.' : '.'), action: function () { ui.closeModal(); W.sailTo('kabus'); } });
    return rows;
  };

  Object.assign(LC.UIScene.prototype, {
    ch9Rows: function (vid) {
      var self = this, W = this.world, Q = q(), st = Q.ch9 || 0, rows = [];
      function sayLines(arr, opts) { self.say(W.ch2Lines(arr), opts); }
      if (vid === 'mak_som' && st === 1) rows.push({ icon: 'ic_moon', label: 'Pak Awang', right: 'Ask', sub: 'Ask Mak Som what has happened here.', action: function () {
        Q.ch9 = 2; LC.Audio.sfx('shh9'); sayLines(X.som); return 'close';
      } });
      if (vid === 'mak_som' && st === 2) rows.push({ icon: 'ic_moon', label: 'The song', sub: '"West, past the sign, into the mangrove. Follow her voice. And do not answer her, whatever she says."' });
      if (vid === 'mak_som' && st === 3 && Q.c9pawang && !LC.State.count('nasi_kunyit')) {
        var row = this.craftRow('i_nasi_kunyit', 'Nasi Kunyit for seven guests', X.somNasi, C9.nasi, 0, function () {
          LC.State.add('nasi_kunyit', 1); LC.Audio.sfx('cook');
          self.toast('Mak Som cooks yellow rice with turmeric and coconut milk, and packs it into seven little bowls. Take it to Tok Pawang.', 'i_nasi_kunyit');
        });
        if (!LC.State.canAdd('nasi_kunyit')) { row.enabled = false; row.why = 'Your bag is full! Make room first.'; }
        rows.push(row);
      }
      if (vid === 'tok_pawang' && st === 2) rows.push({ icon: 'ic_moon', label: 'The song', sub: '"Find Awang first, child. Follow the song. And whatever it says to you, do not answer it."' });
      if (vid === 'tok_pawang' && st === 3 && !Q.c9pawang) rows.push({ icon: 'ic_moon', label: 'The singing', right: 'Ask', sub: 'Ask Tok Pawang what is wrong with Pak Awang.', action: function () {
        Q.c9pawang = 1; LC.Audio.sfx('chime'); sayLines(X.pawang); return 'close';
      } });
      if (vid === 'tok_pawang' && st === 3 && Q.c9pawang) {
        var hasM = LC.State.count('mayang_pinang') > 0, hasN = LC.State.count('nasi_kunyit') > 0;
        rows.push({ icon: 'i_mayang_pinang', label: 'The Ulek Mayang', right: hasM && hasN ? 'Begin' : '', enabled: hasM && hasN,
          why: 'Tok Pawang needs ' + [hasM ? null : 'the mayang (the old pinang palm in Pantai Bakau)', hasN ? null : 'Nasi Kunyit (Mak Som)'].filter(Boolean).join(' and ') + '.',
          sub: 'A mayang from the old pinang palm' + (hasM ? ' (you have it)' : '') + ', and Nasi Kunyit for seven guests' + (hasN ? ' (you have it)' : '') + '.', action: function () {
            LC.State.remove('mayang_pinang', 1); LC.State.remove('nasi_kunyit', 1); Q.ch9 = 4;   // (first)
            LC.Audio.sfx('herbs');
            if (W.area === 'kabus') W.npcLeave('tok_pawang');
            sayLines(X.ready); return 'close';
          } });
      }
      if (vid === 'tok_pawang' && st >= 7) rows.push({ icon: 'ic_mayang', label: 'The old songs', right: 'Talk', sub: 'Talk with Tok Pawang about the song.', action: function () {
        sayLines([{ who: 'tok_pawang', text: pick(['You sing it well, child. Too well. Only when you need it, yes?', 'Sulung herself gave you that song. Sixty years, and I never even saw her face.', 'The song that calls can also calm. My grandfather knew that. I think he was too frightened to try.', 'Some nights I hear Bongsu humming on the reef. She is learning land songs. Badly.']) }]); return 'close';
      } });
      if (vid === 'nenek' && st >= 1 && st <= 6) rows.push({ icon: 'ic_moon', label: 'The song over the water', right: 'Talk', sub: 'Talk to Nenek about the singing.', action: function () { sayLines([{ who: 'nenek', text: pick(X.nenekSong) }]); return 'close'; } });
      if (vid === 'nenek' && st >= 7) rows.push({ icon: 'ic_mayang', label: 'Ulek Mayang', right: 'Talk', sub: 'Tell Nenek about Pantai Kabus.', action: function () { sayLines([{ who: 'nenek', text: pick(X.nenekAfter) }]); return 'close'; } });
      return rows;
    },
    ch9ChapterRows: function () {
      var Q = q(), st = Q.ch9 || 0, rows = [];
      rows.push({ icon: 'ic_mayang', label: 'Chapter 9: Ulek Mayang' + (st >= 7 ? '  (complete)' : ''), right: st >= 7 ? 'Done' : '', sub: LC.ch9Goal() || 'Pak Awang is home, the sun is up over Pantai Kabus, and you know the song that calms.' });
      [[1, 'The empty boat', 'A song over the water, a boat with nobody in it, and a village without a sun.'], [2, 'The song in the mangrove', 'An empty boat, a well, a swing... and a man singing in the sea.'],
       [3, 'The mayang', 'Tok Pawang, the old pinang palm, and the thing that follows you back.'], [4, 'Ulek Mayang', 'The song on the beach, and the seven princesses.'],
       [5, 'Gua Puteri Tujuh', 'Seven clams, and one of them humming.'], [6, 'Home', 'Pak Awang wakes, and the sun comes up.']].forEach(function (s) {
        if (st < s[0]) return;
        var doneS = st > s[0];
        rows.push({ icon: doneS ? 'ic_bond' : 'ic_moon', label: (doneS ? '✓ ' : '') + s[1], right: doneS ? 'Done' : 'Now', sub: s[2] });
      });
      return rows;
    },

    // ================================================================ the Ulek Mayang: Tok Pawang sings, you sing it back
    openUlek: function (k, onWin, onQuit) {
      var self = this, W = this.world, V = X.verse[k], n = C9.verses[k], F = this.gameFrame('Ulek Mayang  (verse ' + (k + 1) + ' of 3)', 640, 430), XX = F.X, YY = F.Y, g = F.g, m, done = false;
      var seq = [], last = -1;
      for (var i = 0; i < n; i++) { var d; do { d = Math.floor(Math.random() * 5); } while (d === last && Math.random() < 0.7); seq.push(d); last = d; }
      F.c.add(this.txt(480, YY + 54, V.my, 17, '#ffe8a0', { ox: 0.5, wrap: 580, align: 'center' }));
      F.c.add(this.txt(480, YY + 82, V.en, 13, '#cdb8a0', { ox: 0.5, wrap: 580, align: 'center' }));
      F.c.list.forEach(function (o) { if (o.text && /give up/.test(o.text)) o.setText(self.touchOn ? 'Tap the lamps  ·  X (top) to stop' : 'Keys 1-5, or click the lamps  ·  Esc to stop'); });
      var tok = this.add.image(XX + 74, YY + 300, 'npc_tok_pawang_0').setScale(4).setOrigin(0.5, 1);
      var me = this.add.image(XX + 566, YY + 300, LC.Art.plKey(W.pc || 0) + '_side_0').setScale(4).setOrigin(0.5, 1).setFlipX(true);
      F.c.add([tok, me]);
      var lamps = [];
      for (var j = 0; j < 5; j++) (function (j) {
        var x = 480 + (j - 2) * 76, y = YY + 210, z = self.add.zone(x - 32, y - 34, 64, 68).setOrigin(0).setInteractive({ useHandCursor: true });
        z.isTouchBtn = true; z.on('pointerdown', function () { press(j); });
        F.c.add(z);
        if (!self.touchOn) F.c.add(self.txt(x, y + 40, String(j + 1), 13, '#a08a6a', { ox: 0.5 }));
        lamps.push({ x: x, y: y, lit: -9999, who: 0 });
      })(j);
      var phase = 'listen', t0 = this.time.now + 500, played = 0, pos = 0;
      F.msg.setText('Listen to Tok Pawang...');
      function voice(i, tokSings) {
        lamps[i].lit = self.time.now; lamps[i].who = tokSings ? 1 : 2;
        if (tokSings) LC.SING.pawang.one(i, 0.85, 'm', 0.9); else LC.SING.me.one(i, 0.85, 'a', 0.8);
        try { if (LC.Audio.ctx && LC.Audio.ctx.state === 'running') LC.Audio.bell(LC.pel9(330, i), LC.Audio.ctx.currentTime + 0.01, 1.1, 0.06); } catch (e) { /* ignore */ }
        self.tweens.add({ targets: tokSings ? tok : me, y: (tokSings ? tok : me).y - 6, duration: 90, yoyo: true });
      }
      function press(i) {
        if (phase !== 'you' || done) return;
        voice(i, false);
        if (i === seq[pos]) {
          pos++;
          if (pos >= n) {
            phase = 'won'; F.msg.setText('The sea is listening...').setColor('#b8f0c8'); LC.Audio.sfx('chime');
            self.time.delayedCall(1200, function () { if (done) return; done = true; close(); if (onWin) onWin(); });
          }
        } else {
          phase = 'wait'; F.msg.setText(X.wrong).setColor('#ff8a7a');
          self.hurtFlash(); if (W && W.c9Wrong) W.c9Wrong();
          self.time.delayedCall(1500, function () { if (done) return; phase = 'listen'; t0 = self.time.now + 300; played = 0; pos = 0; F.msg.setText('Listen again...').setColor('#fbecc8'); });
        }
      }
      function loop(now) {
        if (phase === 'listen') {
          var el = (now - t0) / 1000;
          if (played < n && el >= played * 0.72) { voice(seq[played], true); played++; }
          if (played >= n && el >= n * 0.72 + 0.3) { phase = 'you'; pos = 0; F.msg.setText('Your turn: sing it back (' + n + ' notes).').setColor('#fbecc8'); }
        }
        g.clear();
        lamps.forEach(function (L, i) {
          var a = Math.max(0, 1 - (now - L.lit) / 480), c = LAMP[i];
          g.fillStyle(0x1e1510, 0.9); g.fillCircle(L.x, L.y, 30);
          g.fillStyle(c, 0.18 + 0.72 * a); g.fillCircle(L.x, L.y, 24 + a * 5);
          g.lineStyle(2, phase === 'you' ? c : 0x6a5034, 1); g.strokeCircle(L.x, L.y, 30);
          g.fillStyle(0xfff0b0, 0.5 + 0.5 * a); g.fillTriangle(L.x - 4, L.y + 4, L.x + 4, L.y + 4, L.x, L.y - 8 - a * 6);
        });
        for (var p = 0; p < n; p++) { g.fillStyle(phase === 'you' || phase === 'won' ? (p < pos ? 0x9be15d : 0x5a4a3a) : 0x3a2e24, 1); g.fillCircle(480 - (n - 1) * 13 + p * 26, YY + 290, 7); }
      }
      var ev = this.time.addEvent({ delay: 16, loop: true, callback: function () { loop(self.time.now); } });
      function close() { ev.remove(); F.c.destroy(); if (self.modal === m) self.modal = null; }
      this.ulek9 = { seq: seq, phase: function () { return phase; } };   // (for the automated tests)
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
      if (LC.DEVELOPER_HTML) m.devTick = function () {
        if (phase === 'you') self.pressKey('Digit' + (seq[pos] + 1));
      };
      this.modal = m;
    },

    // ================================================================ frights
    scare9: function (kind) {
      var S = this.S, face = kind !== 'flash' && !(S.flags && S.flags.noScare9), w = this.scale.width, h = this.scale.height, self = this;
      LC.Audio.sfx(face ? 'scare9' : 'laugh9');
      var bg = this.add.rectangle(0, 0, w, h, 0x000000, face ? 0.88 : 0.55).setOrigin(0).setDepth(120), objs = [bg];
      if (face) {
        var s = h * 0.95 / 64, im = this.add.image(w / 2, h / 2, 'wajah9').setDepth(121).setScale(s * 0.72);
        this.tweens.add({ targets: im, scale: s * 1.08, duration: 240, ease: 'Quad.easeIn' });
        objs.push(im);
      }
      this.tweens.add({ targets: objs, alpha: 0, delay: face ? 420 : 140, duration: 300, onComplete: function () { objs.forEach(function (o) { o.destroy(); }); } });
      if (this.world && this.world.cameras) this.world.cameras.main.shake(face ? 300 : 180, face ? 0.012 : 0.006);
      void self;
    },
    // the dark at the edges of the screen, and the faint light towards the song
    drawHorror9: function () {
      var W = this.world, c = W && W.c9, on = !!(c && c.horror), sw = this.scale.width, sh = this.scale.height;
      if (!this.vig9) {
        this.vig9 = this.add.image(0, 0, 'vignette9').setOrigin(0).setDepth(-2).setVisible(false);
        this.hint9 = this.add.image(0, 0, 'glow').setBlendMode(Phaser.BlendModes.ADD).setDepth(-1).setTint(0x9ae8e0).setVisible(false);
      }
      this.vig9.setVisible(on);
      if (on) this.vig9.setDisplaySize(sw, sh);
      var show = on && c.hint && c.src && W.player && !this.modal && W.cameras;
      this.hint9.setVisible(!!show);
      if (!show) return;
      var cam = W.cameras.main, wv = cam.worldView, z = cam.zoom, x = (c.src.x - wv.x) * z, y = (c.src.y - wv.y) * z, cx = sw / 2, cy = sh / 2, mg = 46;
      var inside = x > mg && x < sw - mg && y > mg && y < sh - mg;
      if (!inside) { var dx = x - cx, dy = y - cy, k = Math.min((sw / 2 - mg) / Math.max(0.001, Math.abs(dx)), (sh / 2 - mg) / Math.max(0.001, Math.abs(dy))); x = cx + dx * k; y = cy + dy * k; }
      var pulse = 0.65 + 0.35 * Math.sin(this.time.now / 260);
      this.hint9.setPosition(x, y).setScale(inside ? 2.2 : 3.6).setAlpha((0.14 + 0.42 * (c.vol || 0)) * pulse);
    },

    // ================================================================ the Lagu Mayang button
    buildLagu: function () {
      var self = this;
      this.lagG = this.add.graphics();
      this.lagIcon = this.add.image(LX + 24, LY + 24, 'ic_mayang').setScale(2.6);
      this.lagKey = this.txt(LX + 2, LY + 2, 'L', 11, '#a08a6a');
      this.lagCd = this.txt(LX + 24, LY + 24, '', 18, '#fffdf2', { ox: 0.5, oy: 0.5, stroke: 4 });
      var z = this.add.zone(LX, LY, 48, 48).setOrigin(0).setInteractive({ useHandCursor: true });
      z.isTouchBtn = true;
      z.on('pointerdown', function () { if (!self.modal) self.pressKey('KeyL'); });
      this.lagZone = z;
      this.pin('bc', [this.lagG, this.lagIcon, this.lagKey, this.lagCd, z]);
    },
    drawLagu: function () {
      var on = LC.hasLagu(), g = this.lagG, W = this.world;
      this.drawHorror9();
      if (!g) return;
      g.clear();
      [this.lagIcon, this.lagCd, this.lagZone].forEach(function (o) { o.setVisible(on); });
      this.lagKey.setVisible(on && !this.touchOn);
      if (!on) return;
      var f = W && W.c20 && W.c20.sea && W.c20.sea.sirens;
      var left = W && W.laguLeft ? W.laguLeft() : 0, live = f ? f.phase === 'sing' : W && W.hasEnemies && W.hasEnemies(), ready = !left && live;
      g.fillStyle(0x1e1510, 0.85); g.fillRoundedRect(LX - 6, LY - 6, 60, 60, 10);
      g.lineStyle(2, 0x8a6a3a, 1); g.strokeRoundedRect(LX - 6, LY - 6, 60, 60, 10);
      g.fillStyle(ready ? 0x1e3a3a : 0x2e2219, 1); g.fillRoundedRect(LX, LY, 48, 48, 6);
      g.lineStyle(ready ? 3 : 1, ready ? 0x9ae8e0 : 0x6a5034, 1); g.strokeRoundedRect(LX, LY, 48, 48, 6);
      if (left > 0) { g.fillStyle(0x000000, 0.6); g.fillRect(LX + 2, LY + 2, 44, 44 * Math.min(1, left / C9.lagu.cd)); }
      this.lagIcon.setAlpha(live || left ? 1 : 0.6);
      var t = left > 0 ? String(Math.ceil(left)) : '';
      if (this.lagCd.text !== t) this.lagCd.setText(t);
    }
  });

  // the pause menu: switch the jump scares to a gentler fright
  LC.pauseExtraRow2 = function () {
    var S = LC.State.s;
    if (!S || (S.quests.ch9 || 0) < 1) return null;
    return { icon: 'ic_moon', label: 'Jump scares: ' + (S.flags.noScare9 ? 'Gentle' : 'On'), sub: S.flags.noScare9 ? 'Chapter 9 still has its frights, but the face in the dark is never shown.' : 'Chapter 9 is scary: a face in the dark, now and then. Switch to Gentle to never see it.',
      action: function () { S.flags.noScare9 = !S.flags.noScare9; } };
  };

  // ---------------------------------------------------------------- hooks
  var specialRows = LC.UIScene.prototype.specialRows;
  LC.UIScene.prototype.specialRows = function (vid, v, por) {
    var rows = specialRows.call(this, vid, v, por);
    return (this.S.quests.ch8 || 0) >= 9 ? rows.concat(this.ch9Rows(vid)) : rows;
  };
  var chapterRows = LC.UIScene.prototype.chapterRows;
  LC.UIScene.prototype.chapterRows = function () {
    var rows = chapterRows.call(this);
    return (this.S.quests.ch9 || 0) >= 1 ? rows.concat(this.ch9ChapterRows()) : rows;
  };
  var youRows = LC.UIScene.prototype.youRows;
  LC.UIScene.prototype.youRows = function () {
    var rows = youRows.call(this);
    return LC.hasLagu() ? rows.concat([{ icon: 'ic_mayang', label: 'Lagu Mayang (L)', sub: 'Sing the song Puteri Sulung gave you: every enemy around you falls into a trance and sways for ' + C9.lagu.dur + ' seconds (' + C9.lagu.bossDur + ' for the strongest). Ready every ' + C9.lagu.cd + 's.' }]) : rows;
  };
  var buildSkills = LC.UIScene.prototype.buildSkills;
  LC.UIScene.prototype.buildSkills = function () { buildSkills.apply(this, arguments); this.buildLagu(); };
  var drawSkills = LC.UIScene.prototype.drawSkills;
  LC.UIScene.prototype.drawSkills = function () { drawSkills.apply(this, arguments); this.drawLagu(); };
  var onKey = LC.UIScene.prototype.onKey;
  LC.UIScene.prototype.onKey = function (ev) {
    if (!this.modal && this.world && !this.world.sleeping && ev.code === 'KeyL' && LC.hasLagu()) { this.world.laguKey(); return; }
    return onKey.call(this, ev);
  };
  // on a computer the toasts sit above the third row of buttons
  var toastBaseY = LC.UIScene.prototype.toastBaseY;
  LC.UIScene.prototype.toastBaseY = function () { return toastBaseY.call(this) - (LC.hasLagu() && !this.touchOn ? 66 : 0); };
})(window.LC);
