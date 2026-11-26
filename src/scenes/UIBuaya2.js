/* UI, Chapter 20, Part 2 (v3.23): the goal line and checklist for the rest of the chapter, the jong's voyages, the
 * panels at the top of the screen (the rope, the ride, the shadows), five screens of their own (the free-dive, Kancil's
 * count, the vision, the group photo and the credits), the Harimau Cahaya button (T), and the rows for Pelita Putih,
 * Anak Putih, Sang Kancil and the Tamat badge. Mixed into LC.UIScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var C = LC.C20, X = LC.BUAYA2_TEXT, U = LC.UIScene.prototype, WP = LC.WorldScene.prototype;
  var SX = 236, SY = 448;   // the Harimau Cahaya button: the third row, right of Hilai Maya
  function q() { return LC.State.s.quests; }
  function exists(scene, key) { return !!key && scene.textures.exists(key); }

  // ---------------------------------------------------------------- the goal line
  var goal = LC.ch5Goal;
  LC.ch5Goal = function () {
    var S = LC.State.s, W = LC.game && LC.game.scene.getScene('World');
    if (!S || !C.ready(S)) return goal.apply(this, arguments);
    var s = C.step(S);
    if (s < C.part1 || s >= C.end) return goal.apply(this, arguments);
    var Q = S.quests, a = W && W.area, back = ' (Back at the farm? The jong at the jetty will take you.)', sea = W && W.c20 && W.c20.sea;
    var t = {
      8: X.windWait,
      9: a === 'laut20b' ? (sea && sea.raft ? 'Tow Seri Putih through the strait: go slowly where the currents clash, or the rope will snap.' : sea && sea.bajau && !sea.netDone ? 'Follow the lamps of the Bajau Laut through the coral.' : 'Sail north-east along the coast of Borneo, round its tip, and on to Sabah.') : 'Set sail for Sabah: board the jong in Teluk Barunai (row from the west jetty of Kampong Ayer), or at the farm jetty.',
      10: a === 'kina20' ? (sea && sea.countPending ? 'The crocodiles block the river: hop across them (USE) and count them!' : 'Steer upriver (west) behind Seri Putih.') : 'Go up the Kinabatangan.' + back,
      11: a === 'sarang20' ? 'Talk to Seri Putih at the edge of the lake.' : 'Go back to the nest bank.' + back,
      12: a === 'sarang20' ? 'Pelita is gone. Ring Dang Kemala\'s brass bell at the post by the water.' : 'Go back to the nest bank.' + back,
      13: 'Fight the shadows on the bank with Awang Semaun and Badang (' + Math.min(C.kills, Q.c20kills || 0) + ' / ' + C.kills + ').',
      14: 'Ride Seri Putih across the lake: swim through the ' + C.ride.lights + ' stolen lights circling the shadow, and keep clear of its dark rings.',
      15: 'When the shadow lunges at Kancil\'s jar, its heart opens for a moment: press USE then, and jump in!',
      16: a === 'dalam20' ? 'Find Pelita in the dark: follow the crying.' : 'Jump back into the shadow.' + back,
      17: 'Talk to Seri Putih by the nest.',
      18: a === 'barunai' ? 'The last feast: say goodbye to everyone on the walkways, then talk to Nenek (by the market landing) for the photo.' : 'Go to Kampong Ayer for the last feast.' + back
    }[s];
    return 'Chapter 20: ' + t;
  };
  LC.CHAPTER_LIST.forEach(function (ch) {
    if (ch.n !== 20) return;
    ch.end = C.end;
    ch.steps = ch.steps.slice(0, C.part1).concat(['The wind turns', 'The voyage to Sabah', 'The Kinabatangan', 'The spark', 'Without Pelita', 'The black river', 'Ride the White One', 'Kancil\'s trick', 'Inside the shadow', 'Letting go', 'Kenduri Terakhir']);
    ch.next = '✦ TAMAT ✦ The story is complete. Pelita Putih, Anak Putih and Sang Kancil are with you, and every chapter can be replayed.';
  });
  var checklist = LC.checklist;
  LC.checklist = function () {
    var L = checklist.apply(this, arguments);
    if (L.n !== 20) return L;
    var S = LC.State.s, Q = S.quests, s = C.step(S), W = LC.game && LC.game.scene.getScene('World'), sea = W && W.c20 && W.c20.sea;
    function c(ok, x) { return { ok: !!ok, t: x }; }
    if (s === 9) L.items = [c(sea && sea.kind === 'sabah' && sea.towed && !sea.raft, 'Tow her through the strait'), c(sea && sea.netAsked, 'Through the coral'), c(sea && sea.netDone, 'Cut the ghost net'), c(false, 'Kinabalu, and the river mouth')];
    if (s === 10) L.items = [c(sea && sea.fordDone, 'Upriver'), c(sea && sea.counted, 'Count the crocodiles'), c(false, 'Tok Sisik')];
    if (s === 13) L.items = [c((Q.c20kills || 0) >= C.kills, 'Shadows (' + Math.min(C.kills, Q.c20kills || 0) + ' / ' + C.kills + ')')];
    if (s === 18) L.items = [c(Q.c20feastArr, 'Kenduri Terakhir'), c(false, 'The photo')];
    return L;
  };
  var prev = LC.NEWS, prior = null;
  try { prior = localStorage.getItem('littleCreature.newsSeen'); } catch (e) { /* storage blocked */ }
  LC.NEWS = {
    id: 'v3.23-ch20b',
    lines: (prev && prior !== prev.id && prior !== 'v3.23-ch20b' ? prev.lines : []).concat([
      { text: '✦ New: Chapter 20, Janji Buaya Putih, Part 2: the end of the story ✦  The monsoon wind turns. Take Seri Putih home to Sabah: through the strait at the tip of Borneo, past the Bajau Laut, up the Kinabatangan...' },
      { text: '...and find out what Pelita really is. When it is over: Pelita\'s last form, a white hatchling of your own, a house in Kampong Ayer, and the credits. Thank you for playing Little Creature.' }
    ])
  };

  // ---------------------------------------------------------------- the jong's voyages (from the farm jetty)
  var jongRows = LC.jongExtraRows;
  LC.jongExtraRows = function (where) {
    var rows = jongRows ? jongRows.apply(this, arguments) : [], ui = this, S = LC.State.s, W = ui.world, s = C.step(S);
    if (where !== 'farm' || !C.ready(S)) return rows;
    function row(label, sub, fn) { rows.unshift({ icon: 'ic_buaya20', label: label, right: 'Sail', sub: sub, action: function () { ui.closeModal(); if (W) fn(W); } }); }
    if (s === 9) row('Sail to Sabah with Seri Putih', 'Round the tip of Borneo, to the Kinabatangan.', function (W) { W.buayaSail2(); });
    if (s === 10) row('Sail back to the Kinabatangan', 'Seri Putih is waiting at the river mouth.', function (W) { W.buayaGo('kina20', C.river.start); });
    if (s >= 11 && s <= 17 && s !== 16) row('Sail back to the nest bank', 'Up the Kinabatangan, to the oxbow lake.', function (W) { W.buayaGo('sarang20', C.nest.spawn); });
    if (s === 16) row('Back into the shadow', 'Pelita is still inside it.', function (W) { W.buayaGo('dalam20', C.inside.spawn); });
    if (s === 18) row('Sail to Kampong Ayer for the feast', 'The whole river is waiting.', function (W) { W.buayaGo('barunai', { x: 24, y: 17 }, Math.max(S.minutes, 19 * 60 + 30)); });
    return rows;
  };

  // ---------------------------------------------------------------- the panel at the top: the rope, the ride, the shadows
  var update = U.update;
  U.update = function () {
    update.apply(this, arguments);
    if (!this.ready || !this.S) return;
    var W = this.world, c = W && W.c20, b = W && W.c20b, s = C.step(this.S), mode = null;
    if (W && !this.modal && !W.leaving) {
      if (W.area === 'laut20b' && c && c.sea && c.sea.raft) mode = 'rope';
      else if (W.area === 'sarang20' && b && b.ride) mode = 'ride';
      else if (W.area === 'sarang20' && s === 13 && b && b.fightOn) mode = 'fight';
    }
    if (!this.b2G && !mode) return;
    if (!this.b2G) {
      this.b2G = this.add.graphics();
      this.b2T1 = this.txt(492, 62, '', 13, '#fbecc8', { ox: 0.5, stroke: 4 });
      this.b2T2 = this.txt(492, 92, '', 13, '#fbecc8', { ox: 0.5, stroke: 4 });
      this.b2I = this.add.image(392, 90, 'rakit20').setScale(1);
      this.pin('tc', [this.b2G, this.b2T1, this.b2T2, this.b2I]);
      this.layout();
    }
    var show = !!mode;
    [this.b2G, this.b2T1, this.b2T2, this.b2I].forEach(function (o) { o.setVisible(show); });
    if (!show) return;
    var g = this.b2G, pulse = 0.6 + 0.4 * Math.sin(this.time.now / 160), v, col;
    g.clear();
    g.fillStyle(0x1e1510, 0.82); g.fillRoundedRect(370, 56, 220, 66, 10);
    g.lineStyle(2, 0x8a6a4a, 1); g.strokeRoundedRect(370, 56, 220, 66, 10);
    g.fillStyle(0x3a2a20, 1); g.fillRoundedRect(408, 110, 168, 6, 3);
    if (mode === 'rope') {
      var R = c.sea.raft; v = R.on ? c.sea.strain / 100 : 1; col = v > 0.7 ? 0xff7a5a : 0xd8c8a0;
      this.b2T1.setText(R.on ? 'Towing Seri Putih' : 'The rope snapped! Sail back to her');
      this.b2T2.setText('Rope strain');
      this.b2I.setTexture('rakit20').setScale(0.7);
    } else if (mode === 'ride') {
      var Rd = b.ride; v = Math.max(0, Rd.str) / 100; col = v < 0.3 ? 0xff7a7a : 0xf4f2ec;
      this.b2T1.setText('Stolen lights: ' + Rd.got + ' / ' + C.ride.lights);
      this.b2T2.setText('Seri Putih\'s strength');
      this.b2I.setTexture('ic_buaya20').setScale(1.6);
    } else {
      var k = Math.min(C.kills, q().c20kills || 0); v = k / C.kills; col = 0xc8a8ff;
      this.b2T1.setText('Shadows: ' + k + ' / ' + C.kills);
      this.b2T2.setText('Awang Semaun and Badang fight beside you');
      this.b2I.setTexture('kelam_0').setScale(1.2);
    }
    g.fillStyle(col, v > 0.7 && mode === 'rope' ? pulse : 1); g.fillRoundedRect(408, 110, Math.max(4, 168 * v), 6, 3);
  };

  // ================================================================ five screens of their own
  Object.assign(U, {
    // ---- the free-dive: cut the ghost net's knots as the blade passes, before your air runs out
    openNet20: function (cutAlready, cb) {
      var self = this, F = this.gameFrame('Free-dive: cut the ghost net', 640, 420), XX = F.X, YY = F.Y, g = F.g, t0 = this.time.now;
      var KN = [[-170, 30], [-90, -10], [-10, 40], [70, -5], [150, 35]].map(function (k) { return { x: 480 + k[0], y: YY + 200 + k[1] }; });
      var cut = cutAlready || 0, air = 100, done = false, bx = 480, fx = [];
      var tail = this.add.image(480, YY + 210, 'buaya20t_0').setScale(7).setAngle(4).setAlpha(0.9);
      var blade = this.add.image(480, YY + 120, 'i_parang').setScale(2.4);
      if (!this.textures.exists('i_parang')) blade.setTexture('i_kapak_alibaba');
      var g2 = this.add.graphics();   // (the net and the knots, drawn over her tail; the water is drawn under it)
      F.c.add([tail, g2, blade]);
      F.msg.setText('Press when the blade is over the glowing knot!');
      function finish(won) { if (done) return; done = true; close(); cb(cut, won); }
      function press() {
        if (done) return;
        var k = KN[cut];
        if (Math.abs(bx - k.x) < 18) {
          cut++; LC.Audio.sfx('harvest'); fx.push({ x: k.x, y: k.y, t: self.time.now });
          F.msg.setText(cut >= KN.length ? 'The net falls away!' : 'Cut! (' + cut + ' / ' + KN.length + ')').setColor('#b8f0c8');
          if (cut >= KN.length) self.time.delayedCall(900, function () { finish(true); });
        } else { air -= 10; LC.Audio.sfx('error'); F.msg.setText('Missed! Wait for the blade...').setColor('#ff8a7a'); }
      }
      function loop(now) {
        var el = (now - t0) / 1000;
        if (!done && cut < KN.length) { air -= 5 * 0.016; if (air <= 0) { air = 0; finish(false); return; } }
        bx = 480 + Math.sin(el * 2.1) * 220;
        blade.setPosition(bx, YY + 150).setAngle(Math.sin(el * 2.1) * 20);
        g.clear();
        g.fillStyle(0x0e3a5a, 1); g.fillRect(XX + 14, YY + 50, F.W - 28, 270);
        for (var r = 0; r < 6; r++) { g.fillStyle(0x4a8ab8, 0.08); g.fillRect(XX + 30 + r * 100 + Math.sin(el + r) * 20, YY + 50, 24, 270); }   // light from above
        var h = g2; h.clear();
        h.lineStyle(1, 0xd8d0b0, 0.8);
        for (var i = 0; i < KN.length - 1; i++) { if (i >= cut) { h.lineBetween(KN[i].x, KN[i].y, KN[i + 1].x, KN[i + 1].y); h.lineBetween(KN[i].x, KN[i].y - 26, KN[i + 1].x, KN[i + 1].y + 22); h.lineBetween(KN[i].x, KN[i].y + 24, KN[i + 1].x, KN[i + 1].y - 20); } }
        KN.forEach(function (k, i) {
          if (i < cut) return;
          var on = i === cut, a = on ? 0.6 + 0.4 * Math.sin(now / 90) : 0.5;
          h.fillStyle(on ? 0xffe070 : 0xb0a888, a); h.fillCircle(k.x, k.y, on ? 9 : 6);
          if (on) { h.lineStyle(2, 0xffe070, 0.8); h.strokeCircle(k.x, k.y, 14 + Math.sin(now / 120) * 2); h.lineStyle(1, 0xffe070, 0.4); h.lineBetween(k.x, YY + 60, k.x, YY + 310); }
        });
        fx = fx.filter(function (f) { var u = (now - f.t) / 500; if (u > 1) return false; h.lineStyle(2, 0xffffff, 1 - u); h.strokeCircle(f.x, f.y, 8 + u * 24); return true; });
        h.fillStyle(0x1e1510, 1); h.fillRoundedRect(XX + 160, YY + 56, 320, 14, 6);
        h.fillStyle(air < 30 ? 0xff7a7a : 0x8fd3ff, 1); h.fillRoundedRect(XX + 162, YY + 58, Math.max(2, 316 * air / 100), 10, 5);
        for (var bb = 0; bb < 4; bb++) { h.fillStyle(0xd0f0ff, 0.5); h.fillCircle(480 + Math.sin(el * 3 + bb) * 60, YY + 300 - ((el * 60 + bb * 70) % 240), 2); }
      }
      var close = this.runGame(F, press, loop, function () { if (!done) { done = true; cb(cut, false); } });
      if (LC.DEVELOPER_HTML && this.modal) this.modal.devTick = function () { var k = KN[cut]; if (k && Math.abs(bx - k.x) < 9) press(); };
      this.net20 = { bx: function () { return bx; }, knot: function () { return KN[cut]; }, press: press };   // (for the automated tests)
    },
    // ---- Kancil's count: hop across the crocodiles on the beat, and count them
    openCount20: function (n, cb) {
      var self = this, F = this.gameFrame('Count the crocodiles', 720, 420), XX = F.X, YY = F.Y, g = F.g, W = this.world;
      var gap = 74, x0 = 480 - (n - 1) * gap / 2, y = YY + 210, crocs = [], pos = -1, done = false, period = 0.95, beatAt = this.time.now + 900, busy = false;
      var WORDS = ['Satu!', 'Dua!', 'Tiga!', 'Empat!', 'Lima!', 'Enam!', 'Tujuh!', 'Lapan!', 'Sembilan!'];
      for (var i = 0; i < n; i++) { var im = this.add.image(x0 + i * gap, y, 'buayaK20t_' + (i % 2)).setScale(2.1).setAngle(-90 + (i % 2 ? 4 : -4)); crocs.push(im); F.c.add(im); }
      var me = this.add.image(x0 - gap, y - 4, LC.Art.plKey(W ? W.pc || 0 : 0) + '_side_0').setScale(3).setOrigin(0.5, 1); F.c.add(me);
      var kan = this.add.image(x0 + n * gap + 10, y - 2, 'kancil20_0').setScale(3).setOrigin(0.5, 1).setFlipX(true); F.c.add(kan);
      var word = this.txt(480, YY + 90, '', 30, '#ffd166', { ox: 0.5, stroke: 5 }); F.c.add(word);
      F.msg.setText(X.countHow);
      function ringR(now) { var u = ((now - beatAt) / 1000) % period; if (u < 0) u += period; return 60 - 46 * (u / period); }
      function finish(won) { if (done) return; done = true; close(); cb(won); }
      function press() {
        if (done || busy) return;
        var now = self.time.now, r = ringR(now);
        if (r < 26 && r > 8) {
          pos++; LC.Audio.sfx('pet');
          var target = crocs[pos];
          self.tweens.add({ targets: me, x: target.x, y: target.y - 6, duration: 180, ease: 'Quad.easeOut' });
          word.setText(WORDS[pos] || String(pos + 1)).setAlpha(1).setScale(1.2); self.tweens.add({ targets: word, scale: 1, duration: 200 });
          if (pos >= n - 1) {
            busy = true;
            self.time.delayedCall(500, function () { self.tweens.add({ targets: me, x: kan.x - 30, y: y - 4, duration: 260 }); F.msg.setText('Across! Now: how many were there?').setColor('#b8f0c8'); });
            self.time.delayedCall(1500, function () { finish(true); });
          }
        } else {
          busy = true; LC.Audio.sfx('splash');
          F.msg.setText(X.countWrong).setColor('#ff8a7a');
          if (pos >= 0) self.tweens.add({ targets: crocs[pos], alpha: 0.4, duration: 200, yoyo: true });
          self.time.delayedCall(900, function () { pos = -1; me.setPosition(x0 - gap, y - 4); word.setText(''); busy = false; F.msg.setText(X.countHow).setColor('#fbecc8'); beatAt = self.time.now + 500; });
        }
      }
      function loop(now) {
        g.clear();
        g.fillStyle(0x3a5a3a, 1); g.fillRect(XX + 14, y + 26, F.W - 28, 40);
        g.fillStyle(0x4a7a8a, 1); g.fillRect(XX + 14, y - 40, F.W - 28, 66);
        var nx = pos + 1 < n ? crocs[pos + 1].x : kan.x, r = ringR(now);
        if (!busy && !done) {
          g.lineStyle(3, r < 26 && r > 8 ? 0x9be15d : 0xfbecc8, 0.9); g.strokeCircle(nx, y - 6, r);
          g.lineStyle(2, 0xffd166, 0.9); g.strokeCircle(nx, y - 6, 17);
        }
        crocs.forEach(function (cImg, i) { cImg.y = y + Math.sin(now / 400 + i) * 2; });
      }
      var close = this.runGame(F, press, loop, function () { if (!done) { done = true; cb(false); } });
      if (LC.DEVELOPER_HTML && this.modal) this.modal.devTick = function () { var r = ringR(self.time.now); if (!busy && r < 20 && r > 12) press(); };
      this.count20 = { press: press, r: function () { return ringR(self.time.now); } };
    },
    // ---- the vision: five pictures, long ago
    openVision20: function (frames, onDone) {
      var self = this, F = this.gameFrame('Long ago...', 720, 460), XX = F.X, YY = F.Y, g = F.g, i = -1, pics = [], opened = this.time.now;
      F.c.list.forEach(function (o) { if (o.text && /give up/.test(o.text)) o.setText(self.touchOn ? 'Tap to go on' : 'E / Space / click to go on'); });
      function img(key, x, yy, sc, alpha) { var k = self.textures.exists(key) ? key : 'glow'; var im = self.add.image(x, yy, k).setScale(sc).setAlpha(alpha === undefined ? 1 : alpha); F.c.add(im); pics.push(im); return im; }
      function show() {
        pics.forEach(function (p) { p.destroy(); }); pics = [];
        var cx = 480, cy = YY + 190;
        if (i === 0) { var cr = img('buaya20_0', cx, cy, 4); self.tweens.add({ targets: cr, angle: { from: -10, to: 10 }, y: cy - 10, duration: 700, yoyo: true, repeat: -1 }); }
        if (i === 1) { img('house', cx - 140, cy, 1.6); img('buaya20_0', cx + 120, cy + 60, 2.4); }
        if (i === 2) { img('buaya20_face', cx - 40, cy, 6); var bk = img('npc20_anak_0', cx + 110, cy + 10, 2.5); bk.setAngle(-80); }
        if (i === 3) { img('buaya20_face', cx - 60, cy, 6); var sp = img('percik20', cx + 90, cy - 20, 5); self.tweens.add({ targets: sp, scale: 6, duration: 600, yoyo: true, repeat: -1 }); img('glow', cx + 90, cy - 20, 2.4, 0.5).setBlendMode(Phaser.BlendModes.ADD).setTint(0xfff0b0); }
        if (i === 4) { img('lampu20_on', cx, cy + 20, 6); img('percik20', cx, cy - 22, 3); img('glow', cx, cy - 22, 3, 0.45).setBlendMode(Phaser.BlendModes.ADD).setTint(0xfff0b0); }
        F.msg.setText(frames[i].t).setColor('#fbecc8');
      }
      function press() {
        if (self.time.now - opened < 300) return;
        opened = self.time.now;
        i++;
        if (i >= frames.length) { close(); onDone(); return; }
        LC.Audio.sfx('chime');
        show();
      }
      function loop(now) {
        g.clear();
        var tint = [0x0e1a30, 0x1a3a4a, 0x3a3a50, 0x2a2440, 0x2a2030][Math.max(0, i)] || 0x0e1a30;
        g.fillStyle(tint, 1); g.fillRect(XX + 14, YY + 50, F.W - 28, 300);
        if (i === 0) for (var r = 0; r < 30; r++) { var rx = XX + 20 + ((r * 97 + now / 3) % (F.W - 40)), ry = YY + 54 + ((r * 53 + now / 2) % 290); g.lineStyle(1, 0x9ab8d8, 0.5); g.lineBetween(rx, ry, rx - 4, ry + 10); }
        if (i === 1 || i === 2) { g.fillStyle(0x6a5030, 0.7); g.fillRect(XX + 14, YY + 270, F.W - 28, 80); }
        if (i === 2) { g.fillStyle(0x8a6a3a, 1); g.fillEllipse(480 + 110, YY + 214, 70, 30); }
      }
      i = 0; show(); opened = this.time.now;
      var close = this.runGame(F, press, loop, function () { onDone(); });
      if (LC.DEVELOPER_HTML && this.modal) { var last = 0; this.modal.devTick = function () { if (self.time.now - last > 700) { last = self.time.now; press(); } }; }
    },
    // ---- the group photo at the last feast (and again from My stats)
    openPhoto20: function (cb) {
      var self = this, S = this.S, Q = S.quests, F = this.gameFrame('Kenduri Terakhir', 760, 480), XX = F.X, YY = F.Y, g = F.g, W = this.world;
      F.c.list.forEach(function (o) { if (o.text && /give up/.test(o.text)) o.setText(self.touchOn ? 'Tap to close' : 'E / Space / click to close'); });
      var cast = (Q.c20photo || []).filter(function (k) { return exists(self, k); }), back = cast.slice(0, 8), mid = cast.slice(8, 14);
      g.fillStyle(0x10182e, 1); g.fillRect(XX + 14, YY + 50, F.W - 28, 330);
      g.fillStyle(0x6a4a2a, 1); g.fillRect(XX + 14, YY + 300, F.W - 28, 80);
      for (var l = 0; l < 7; l++) { var lx = XX + 60 + l * 110; g.fillStyle(0xc87a30, 0.35); g.fillCircle(lx, YY + 90, 26); g.fillStyle(0xffb050, 0.5); g.fillCircle(lx, YY + 90, 14); g.fillStyle(0xfff0c0, 1); g.fillCircle(lx, YY + 90, 5); }
      function put(key, x, y, sc, flip) { if (!exists(self, key)) return null; var im = self.add.image(x, y, key).setOrigin(0.5, 1).setScale(sc).setFlipX(!!flip); F.c.add(im); return im; }
      back.forEach(function (k, i) { put(k, 480 - (back.length - 1) * 42 + i * 84, YY + 236, 3, i % 2); });
      mid.forEach(function (k, i) { put(k, 480 - (mid.length - 1) * 50 + i * 100, YY + 280, 3.2, i % 2); });
      put('npc_nenek_0', 400, YY + 340, 3.6);
      put(LC.Art.plKey(W ? W.pc || 0 : 0) + '_down_0', 480, YY + 344, 3.6);
      put(LC.ghostTex(S.ghost.stage, 'happy'), 520, YY + 268, 3);
      put('kancil20_0', 560, YY + 346, 3, true);
      put('anak20_kecil', 470, YY + 356, 2.6);
      F.msg.setText('Kampong Ayer, Day ' + (Q.c20photoDay || S.day) + '. Everyone is here. "Senyum!"');
      var opened = this.time.now;
      var close = this.runGame(F, function () { if (self.time.now - opened < 500) return; close(); if (cb) cb(); }, function () {}, function () { if (cb) cb(); });
      if (LC.DEVELOPER_HTML && this.modal) this.modal.devTick = function () { if (self.time.now - opened > 1200) { close(); if (cb) cb(); } };
    },
    // ---- the credits: every chapter, and TAMAT
    openCredits20: function (cb) {
      var self = this, c = this.modalC(110, 0x000000, 1), list = [{ n: 1, name: 'Little Creature' }].concat(LC.CHAPTER_LIST), y = 0, speed = 46, fast = false, done = false, m;
      var roll = this.add.container(0, 0); c.add(roll);
      function line(t, size, col, gapAfter) { var tx = self.txt(480, 0, t, size, col, { ox: 0.5, wrap: 640, align: 'center' }); tx.y = y; roll.add(tx); y += tx.height + (gapAfter || 14); return tx; }
      y = 700;
      line(X.credits.title, 40, '#ffd166', 10);
      line('a game about a little light, and the people who love it', 16, '#c8b8a0', 80);
      list.forEach(function (ch) {
        var key = C.creditArt[ch.n];
        if (!exists(self, key)) key = 'ic_glow';
        var im = self.add.image(480, y + 26, key).setScale(key.indexOf('i_') === 0 || key.indexOf('ic_') === 0 ? 3 : 2.4); roll.add(im);
        y += 64;
        line('Chapter ' + ch.n + ' · ' + ch.name, 18, '#fbecc8', 40);
      });
      line('Most pictures and every tune in this game are made by code, one pixel and one note at a time. The grass, paths, trees, farm animals and grass details come from Sunnyside World by Daniel Diggle. The recorded sounds of Chapter 19 are CC0, from BigSoundBank and Freesound.', 14, '#a89a88', 60);
      line('Pelita, Nenek, Sang Kancil, Seri Putih, Anak Putih, and everyone in the kampung, the water village and beyond.', 16, '#e8d8c0', 60);
      line(X.credits.thanks, 24, '#ffd166', 120);
      var tamat = line(X.credits.tamat, 64, '#fff6d8', 40);
      line(X.credits.after, 14, '#a89a88', 40);
      var endY = tamat.y - 260;
      var hint = this.txt(940, 620, this.touchOn ? 'Tap to hurry · X to skip' : 'E: faster · Esc: skip', 12, '#6a5a4a', { ox: 1, oy: 1 }); c.add(hint);
      LC.Audio.sfx('chime');
      var hold = 0, pos = 0, ev = this.time.addEvent({ delay: 16, loop: true, callback: function () {
        if (done) return;
        if (pos < endY && -roll.y < endY) { pos += speed * (fast ? 5 : 1) * 0.016; roll.y = -Math.round(pos); }   // (whole pixels: a pixel font smears between them)
        else { hold += 0.016; if (hold > 4) finish(); }
      } });
      function finish() { if (done) return; done = true; ev.remove(); c.destroy(); if (self.modal === m) self.modal = null; cb(); }
      m = { type: 'game', key: function (code) { if (code === 'Escape') roll.y = -endY; else fast = !fast; }, click: function () { fast = !fast; }, close: function () { roll.y = -endY; hold = 3.5; } };
      if (LC.DEVELOPER_HTML) m.devTick = function () { fast = true; };
      this.modal = m;
      this.credits20 = { y: function () { return roll.y; }, end: function () { return endY; } };
    }
  });

  // ---------------------------------------------------------------- T: Harimau Cahaya
  var onKey = U.onKey;
  U.onKey = function (ev) {
    if (ev.code === 'KeyT' && !this.modal && this.world && LC.c20Putih()) { if (ev.preventDefault) ev.preventDefault(); this.world.tigerKey(); return; }
    return onKey.apply(this, arguments);
  };
  var buildSkills = U.buildSkills;
  U.buildSkills = function () {
    buildSkills.apply(this, arguments);
    var self = this;
    this.tgrG = this.add.graphics();
    this.tgrIcon = this.add.image(SX + 24, SY + 24, 'ic_harimau20').setScale(2.6);
    this.tgrKey = this.txt(SX + 2, SY + 2, 'T', 11, '#a08a6a');
    var z = this.add.zone(SX, SY, 48, 48).setOrigin(0).setInteractive({ useHandCursor: true });
    z.isTouchBtn = true;
    z.on('pointerdown', function () { if (!self.modal) self.pressKey('KeyT'); });
    this.tgrZone = z;
    this.pin('bc', [this.tgrG, this.tgrIcon, this.tgrKey, z]);
  };
  var drawSkills = U.drawSkills;
  U.drawSkills = function () {
    drawSkills.apply(this, arguments);
    var g = this.tgrG, on = LC.c20Putih(), W = this.world;
    if (!g) return;
    g.clear();
    [this.tgrIcon, this.tgrZone].forEach(function (o) { o.setVisible(on); });
    this.tgrKey.setVisible(on && !this.touchOn);
    if (!on) return;
    var used = q().c20tigerDay === this.S.day, live = W && W.hasEnemies && W.hasEnemies(), ready = !used && live, active = W && W.c20b && W.c20b.tiger;
    g.fillStyle(0x1e1510, 0.85); g.fillRoundedRect(SX - 6, SY - 6, 60, 60, 10);
    g.lineStyle(2, 0x8a6a3a, 1); g.strokeRoundedRect(SX - 6, SY - 6, 60, 60, 10);
    g.fillStyle(active ? 0x5a4a20 : ready ? 0x3a3020 : 0x2e2219, 1); g.fillRoundedRect(SX, SY, 48, 48, 6);
    g.lineStyle(ready || active ? 3 : 1, ready || active ? 0xffe8a0 : 0x6a5034, 1); g.strokeRoundedRect(SX, SY, 48, 48, 6);
    if (used && !active) { g.fillStyle(0x000000, 0.55); g.fillRect(SX + 2, SY + 2, 44, 44); }
    this.tgrIcon.setAlpha(used && !active ? 0.45 : live ? 1 : 0.7);
  };

  // ---------------------------------------------------------------- the rows: Pelita Putih, Anak Putih, Kancil, Tamat
  var youRows = U.youRows;
  U.youRows = function () {
    var rows = youRows.call(this);
    if (!LC.c20Putih()) return rows;
    var g = LC.c20Anak();
    return rows.concat([
      { icon: 'ghost_6_happy', label: 'Pelita Putih', sub: 'When you are badly hurt, Pelita wraps you in white light and heals half your health (every ' + C.heal.cd + ' seconds).' },
      { icon: 'ic_harimau20', label: 'Harimau Cahaya (T)', sub: 'Once a day, when something is there to fight: Pelita becomes a tiger of light for ' + C.tiger.dur + ' seconds and fights beside you.' },
      { icon: 'i_loceng20', label: 'Anak Putih', sub: g >= 3 ? 'Grown! Hold the brass bell and press USE beside water to ride it, across rivers and the sea (R or USE to get off, on land).' : 'Growing in the river by Nenek\'s jetty. Grown in ' + Math.max(1, C.anak.grown - (this.S.day - q().c20hatch)) + ' more day(s): then it can carry you across water.' }
    ]);
  };
  var statRows = U.statRows;
  U.statRows = function () {
    var rows = statRows.apply(this, arguments), self = this;
    if (!LC.c20Tamat()) return rows;
    return [{ icon: 'ghost_6_happy', label: '✦ TAMAT ✦', right: 'Photo', sub: X.tamatRow.replace('{d}', q().c20tamat), action: function () { self.closeModal(); self.openPhoto20(null); } },
      { icon: 'ic_chap', label: 'Watch the credits again', right: 'Watch', sub: 'Every chapter, from the first little light to the white crocodile.', action: function () { self.closeModal(); self.openCredits20(function () {}); } }].concat(rows);
  };
  var compRows = U.companionRows;
  U.companionRows = function () {
    var rows = compRows.apply(this, arguments), Q = q(), W = this.world;
    if (!LC.c20Tamat() || !W) return rows;
    if (Q.c20kancil === 'with') rows.splice(1, 0, { companionId: 'kancil', companionStatus: 'With you', icon: 'kancil20_0', iconScale: 1.8, label: 'Sang Kancil  (with you)', right: 'Send home',
      sub: 'He finds things as you walk about, and when you are badly hurt in a fight, he draws the enemies away.', action: function () { W.buayaKancilHome(); } });
    else rows.push({ companionId: 'kancil', companionStatus: 'At the farm', icon: 'kancil20_0', iconScale: 1.8, label: 'Sang Kancil', right: 'Bring',
      sub: 'The clever mousedeer. He finds things as you walk about, and draws enemies away when you are badly hurt.', action: function () { Q.c20kancil = 'with'; LC.State.save(); W.refreshWhen(); if (W.buayaKancilHere()) W.buayaKancilFollow(); } });
    return rows;
  };
  var compCount = WP.companionCount;
  WP.companionCount = function () { return compCount.apply(this, arguments) + (this.c20b && this.c20b.kancil ? 1 : 0); };
})(window.LC);
