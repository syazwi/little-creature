/* UI, Chapter 19: Harum Sundal Malam (v3.20): the goal line, the checklist entry and its parts, the one-time "What's
 * new" note, the scent meter at the top of the screen while you look for Maya's sisir, the pontianak's face for the
 * jump scare, and the Hilai Maya button (H, the third row of skills, right of Empat Sekawan) with its rows in My stats
 * and the Journal. Mixed into LC.UIScene. See maya.js. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var C = LC.C19, U = LC.UIScene.prototype;
  var SX = 176, SY = 448;   // the skill button
  function q() { return LC.State.s.quests; }
  function n(o) { return Object.keys(o || {}).length; }

  // ---------------------------------------------------------------- the goal line
  var goal = LC.ch5Goal;
  LC.ch5Goal = function () {
    var S = LC.State.s, W = LC.game && LC.game.scene.getScene('World');
    if (!S || !C.ready(S) || C.step(S) >= C.end) return goal.apply(this, arguments);
    var s = C.step(S), Q = S.quests, area = W && W.area, dark = C.isNight(S), watch = S.minutes >= C.watch;
    var grave = 'the old graveyard (the lane at the top right of Kampung Tepian, past the shrine)';
    var left = [];
    if (s === 5) {
      if (n(Q.c19lamps) < C.lamps.length) left.push('light the lamps inside (' + n(Q.c19lamps) + ' / ' + C.lamps.length + ')');
      if (!Q.c19bunga) left.push('cut the sundal malam under the nursery window');
      if (!Q.c19inah) left.push('ask Mak Inah by the kitchen');
    }
    var t = [
      'Rest. On a night after Chapter 18, something sweet drifts over the farm after 7 PM.',
      dark ? 'Follow the scent of sundal malam to ' + grave + '.' : 'Tonight after 7 PM, follow the scent of sundal malam to ' + grave + '.',
      dark ? 'Find Maya\'s sisir: follow the scent meter at the top of the screen, and press USE by a grave, a bush or a tree to search.' : 'Maya\'s sisir can only be found by its scent, at night (after 7 PM), in the old graveyard.',
      S.day <= (Q.c19day || 0) ? 'Rest. Maya may be at the kemboja tree again tomorrow night.' : dark ? 'Maya is at the kemboja tree in the old graveyard. Go to her.' : 'Go back to the kemboja tree in the old graveyard tonight, after 7 PM.',
      !dark ? 'The kampung is afraid of the night. Come back to Kampung Tepian after 7 PM.' : n(Q.c19signs) < 3 ? 'Kampung Tepian at night: find the signs of what walks here (' + n(Q.c19signs) + ' / 3): a cradle, the washing, the banana trees (on the east side).' : 'Talk to Tok Imam by the masjid.',
      !Q.c19welcome ? 'Go to Tuan Hashim\'s house (the gate at the top left of Kampung Tepian) and talk to the family.' : left.length ? 'Help the Hashims: ' + left.join(', ') + '.' : 'Everything is ready. Tell Tuan Hashim.',
      watch ? 'Keep watch in the nursery of Tuan Hashim\'s house (inside, at the back), by the cradle.' : 'Come back to Tuan Hashim\'s house after 8 PM, and keep watch in the nursery.',
      area === 'dalam19' ? 'Maya wants to take her son with her. Persuade her to let him live (' + (Q.c19round || 0) + ' / 3).' : 'Go back to the nursery in Tuan Hashim\'s house: Maya is waiting.'
    ][s];
    return 'Chapter 19: ' + t;
  };
  LC.CHAPTER_LIST.forEach(function (ch) { if (ch.n === 18) ch.next = 'Chapter 19 begins on a night after Chapter 18: a sweet scent drifts over the farm after 7 PM.'; });
  LC.CHAPTER_LIST.push({ n: 19, key: 'ch19', end: C.end, name: 'Harum Sundal Malam',
    steps: ['A scent in the night', 'The lady under the kemboja tree', 'Maya\'s sisir', 'Maya\'s sorrow', 'The kampung is afraid', 'The big house on the hill', 'The night watch', 'The truth'],
    next: 'Mak Kiah sells kuih and sundal malam bulbs in Kampung Tepian, and Maya\'s laugh is yours: press H. More chapters are on the way.' });
  // the parts of the current step, in the checklist
  var checklist = LC.checklist;
  LC.checklist = function () {
    var L = checklist.apply(this, arguments);
    if (L.n !== 19) return L;
    var Q = q(), s = C.step(LC.State.s);
    function c(ok, t) { return { ok: !!ok, t: t }; }
    if (s === 4) L.items = [c(Q.c19signs && Q.c19signs.buaian, 'The cradle that rocks by itself'), c(Q.c19signs && Q.c19signs.jemuran, 'The washing on the grass'), c(Q.c19signs && Q.c19signs.pisang, 'The shaking banana trees'), c(false, 'Talk to Tok Imam by the masjid')];
    if (s === 5) L.items = [c(Q.c19welcome, 'Meet the Hashims'), c(n(Q.c19lamps) >= C.lamps.length, 'Light the lamps (' + n(Q.c19lamps) + ' / ' + C.lamps.length + ')'), c(Q.c19bunga, 'Cut the sundal malam'), c(Q.c19inah, 'Ask Mak Inah'), c(false, 'Tell Tuan Hashim')];
    if (s === 7) L.items = [0, 1, 2].map(function (i) { return c((Q.c19round || 0) > i, ['Will he grow up?', 'Who will love him?', 'Will he remember?'][i]); });
    return L;
  };

  var prev = LC.NEWS, prior = null;
  try { prior = localStorage.getItem('littleCreature.newsSeen'); } catch (e) { /* storage blocked */ }
  LC.NEWS = {
    id: 'v3.20-ch19',
    lines: (prev && prior !== prev.id && prior !== 'v3.20-ch19' ? prev.lines : []).concat([
      { text: '✦ New: Chapter 19, Harum Sundal Malam ✦  After Chapter 18, on a night that smells of sundal malam, a beautiful lady under the old kemboja tree asks you to find her comb...' },
      { text: 'Follow the scent, listen to the crying in the night (loud is far, soft is near), and find out what really happened in the big house on the hill. Scary! Pause > Jump scares: Gentle keeps it softer.' }
    ])
  };

  // ---------------------------------------------------------------- the scent meter, and her face in the dark
  var update = U.update;
  U.update = function () {
    update.apply(this, arguments);
    if (!this.ready || !this.S) return;
    var W = this.world, sc = W && W.maya && W.maya.scent, show = !!(sc && W.area === 'kubur19' && !this.modal && !W.leaving);
    if (!this.scentG && !show) return;
    if (!this.scentG) {
      this.scentG = this.add.graphics();
      this.scentT = this.txt(480, 70, '', 14, '#fbecc8', { ox: 0.5, stroke: 4 });
      this.scentI = [0, 1, 2, 3, 4].map(function (i) { return this.add.image(432 + i * 24, 100, 'i_bunga_sundal').setScale(1.5); }, this);
      this.pin('tc', [this.scentG, this.scentT].concat(this.scentI));
      this.layout();
    }
    this.scentG.setVisible(show); this.scentT.setVisible(show);
    this.scentI.forEach(function (im) { im.setVisible(show); });
    if (!show) return;
    var g = this.scentG;   // (pinned to the top centre, so draw in the 960-wide layout)
    g.clear();
    g.fillStyle(0x1e1510, 0.82); g.fillRoundedRect(380, 60, 200, 56, 10);
    g.lineStyle(2, 0x8a6a4a, 1); g.strokeRoundedRect(380, 60, 200, 56, 10);
    var t = 'Scent of sundal malam' + (sc.trend > 0 ? '  ▲' : sc.trend < 0 ? '  ▼' : '');
    if (this.scentT.text !== t) this.scentT.setText(t);
    var pulse = 0.85 + 0.15 * Math.sin(this.time.now / 180);
    this.scentI.forEach(function (im, i) { var on = i < sc.lvl; im.setAlpha(on ? (sc.lvl === 5 ? pulse : 1) : 0.22).setTint(on ? 0xffffff : 0x6a6070); });
  };
  U.scare19 = function () {
    var w = this.scale.width, h = this.scale.height, s = h * 0.95 / 64;
    var bg = this.add.rectangle(0, 0, w, h, 0x000000, 0.9).setOrigin(0).setDepth(120);
    var im = this.add.image(w / 2, h / 2, 'wajah19').setDepth(121).setScale(s * 0.7);
    this.tweens.add({ targets: im, scale: s * 1.1, duration: 260, ease: 'Quad.easeIn' });
    this.tweens.add({ targets: [bg, im], alpha: 0, delay: 520, duration: 320, onComplete: function () { bg.destroy(); im.destroy(); } });
    if (this.world && this.world.cameras) this.world.cameras.main.shake(320, 0.012);
  };

  // the pause menu's jump-scare switch covers this chapter too
  var scareRow = LC.pauseExtraRow2;
  if (scareRow) LC.pauseExtraRow2 = function () {
    var r = scareRow.apply(this, arguments);
    if (r && r.sub) r.sub = r.sub.replace('Chapter 9 still has its frights', 'Chapters 9 and 19 still have their frights').replace('Chapter 9 is scary', 'Chapters 9 and 19 are scary').replace('the face in the dark is never shown', 'the faces in the dark are never shown');
    return r;
  };

  // ---------------------------------------------------------------- H: Hilai Maya
  var onKey = U.onKey;
  U.onKey = function (ev) {
    if (ev.code === 'KeyH' && !this.modal && this.world && LC.hasHilai()) {
      if (ev.preventDefault) ev.preventDefault();
      this.world.hilaiKey(); return;
    }
    return onKey.apply(this, arguments);
  };
  var buildSkills = U.buildSkills;
  U.buildSkills = function () {
    buildSkills.apply(this, arguments);
    var self = this;
    this.hilG = this.add.graphics();
    this.hilIcon = this.add.image(SX + 24, SY + 24, 'ic_hilai').setScale(2.6);
    this.hilKey = this.txt(SX + 2, SY + 2, 'H', 11, '#a08a6a');
    this.hilCd = this.txt(SX + 24, SY + 24, '', 18, '#fffdf2', { ox: 0.5, oy: 0.5, stroke: 4 });
    var z = this.add.zone(SX, SY, 48, 48).setOrigin(0).setInteractive({ useHandCursor: true });
    z.isTouchBtn = true;
    z.on('pointerdown', function () { if (!self.modal) self.pressKey('KeyH'); });
    this.hilZone = z;
    this.pin('bc', [this.hilG, this.hilIcon, this.hilKey, this.hilCd, z]);
  };
  var drawSkills = U.drawSkills;
  U.drawSkills = function () {
    drawSkills.apply(this, arguments);
    var g = this.hilG, on = LC.hasHilai(), W = this.world;
    if (!g) return;
    g.clear();
    [this.hilIcon, this.hilCd, this.hilZone].forEach(function (o) { o.setVisible(on); });
    this.hilKey.setVisible(on && !this.touchOn);
    if (!on) return;
    var left = W && W.hilaiLeft ? W.hilaiLeft() : 0, live = W && W.hasEnemies && W.hasEnemies(), ready = !left && live;
    g.fillStyle(0x1e1510, 0.85); g.fillRoundedRect(SX - 6, SY - 6, 60, 60, 10);
    g.lineStyle(2, 0x8a6a3a, 1); g.strokeRoundedRect(SX - 6, SY - 6, 60, 60, 10);
    g.fillStyle(ready ? 0x2e2a3e : 0x2e2219, 1); g.fillRoundedRect(SX, SY, 48, 48, 6);
    g.lineStyle(ready ? 3 : 1, ready ? 0xe8e0ff : 0x6a5034, 1); g.strokeRoundedRect(SX, SY, 48, 48, 6);
    if (left > 0) { g.fillStyle(0x000000, 0.6); g.fillRect(SX + 2, SY + 2, 44, 44 * Math.min(1, left / C.hilai.cd)); }
    this.hilIcon.setAlpha(live || left ? 1 : 0.6);
    var t = left > 0 ? String(Math.ceil(left)) : '';
    if (this.hilCd.text !== t) this.hilCd.setText(t);
  };
  var youRows = U.youRows;
  U.youRows = function () {
    var rows = youRows.call(this);
    return LC.hasHilai() ? rows.concat([{ icon: 'ic_hilai', label: 'Hilai Maya (H)', sub: 'Maya\'s laugh: everything around you flees in fear for ' + C.hilai.fear + ' seconds (' + C.hilai.fearNight + ' at night or underground, and further). Bosses only flinch. Every ' + C.hilai.cd + ' seconds.' }]) : rows;
  };
  var statRows = U.statRows;
  U.statRows = function () {
    var rows = statRows.apply(this, arguments);
    if (!LC.hasHilai()) return rows;
    rows.forEach(function (r) {
      if (r.label !== 'Abilities') return;
      r.right = String((parseInt(r.right, 10) || 0) + 1);
      r.sub = /^None yet/.test(r.sub) ? 'Hilai Maya (H). Journal > You explains each one.' : r.sub.replace(/\. Journal > You/, ' · Hilai Maya (H). Journal > You');
    });
    return rows;
  };
})(window.LC);
