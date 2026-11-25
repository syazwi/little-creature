/* UI, Chapter 18: Bujang Belajar Mantera? (v3.19): the goal line, the checklist entry, the one-time "What's new" note,
 * the Mantera Empat Sekawan button (Y, above Angin Bualang) and its rows in My stats and the Journal, and a name under
 * each mirror in the exam hall (in its own colour). Mixed into LC.UIScene. See bujang.js. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var C = LC.C18, U = LC.UIScene.prototype, WHO = C.who;
  var SX = 116, SY = 448;   // the skill button: the third row, right of Lagu Mayang
  function cap(w) { return w.charAt(0).toUpperCase() + w.slice(1); }
  function hex(c) { return '#' + ('000000' + c.toString(16)).slice(-6); }

  // ---------------------------------------------------------------- the goal line
  var goal = LC.ch5Goal;
  LC.ch5Goal = function () {
    var S = LC.State.s, W = LC.game && LC.game.scene.getScene('World');
    if (!S || !C.ready(S) || C.step(S) >= C.end) return goal.apply(this, arguments);
    var s = C.step(S), q = S.quests, b = W && W.bujang, L = b && b.lesson, area = W && W.area;
    var t = [
      'Rest at the farm. Something purple is happening in Kampung Tepian.',
      'Three young men are practising magic by the vegetable plots in Kampung Tepian (west of the gelanggang). Go and see.',
      'Take Jack\'s enchanted letter at the farm to Sekolah Mantera, then speak to Suraya in the courtyard.',
      L && L.kind === 'float' ? 'Ilmu Terapung: keep the feather up (' + L.lifts + ' / ' + C.feather.lifts + '). When it sinks low, stand on its shadow and press USE. Dodge the durians!'
        : 'Speak to Suraya in the school courtyard for the first lesson: Ilmu Terapung.',
      area === 'gelap18' ? 'Kelas Gelap: light the runes with Sani right beside you (' + Object.keys(q.c18runes || {}).length + ' / 3). Do not leave him behind!'
        : 'Kelas Gelap: go down the trapdoor on the east side of the courtyard, with Sani.',
      L && L.kind === 'pantul' ? 'Kelas Pantul: in the west yard, stand in front of the one the rune aims at and press P just before the bolt hits (' + L.count + ' / ' + C.pantul + ').'
        : 'Speak to Suraya for the last lesson: Kelas Pantul.',
      'Sit with Kudin, Leman and Sani by the fire in the courtyard, then open Pintu Empat Penjuru together.',
      q.c18exam ? 'Go out to the courtyard. Suraya is waiting.' : area === 'ujian18' ? ((q.c18round || 0) < 3
        ? 'Ujian Cermin, round ' + ((q.c18round || 0) + 1) + ' of 4: beat Bayang ' + cap(WHO[q.c18round || 0]) + ' with ' + cap(WHO[q.c18round || 0]) + '. He has to land the last blow.'
        : 'Ujian Cermin, the finale: four against four! Beat your Bayang Diri, and help whoever is losing.')
        : 'Enter the exam hall (Pintu Empat Penjuru, at the north of the courtyard) for Ujian Cermin.'
    ][s];
    return 'Chapter 18: ' + t;
  };
  // in the exam hall's finale your Bayang Diri runs on a stand-in trial; keep the chapter's goal line
  var goalText = U.goalText;
  U.goalText = function () {
    var W = this.world;
    if (W && W.area === 'ujian18' && W.bunianTrial) return 'Goal: ' + LC.ch5Goal();
    return goalText.apply(this, arguments);
  };
  LC.CHAPTER_LIST.forEach(function (ch) { if (ch.n === 17) ch.next = 'Chapter 18 begins the day after: Tok Penghulu\'s rooster turns purple.'; });
  LC.CHAPTER_LIST.push({ n: 18, key: 'ch18', end: C.end, name: 'Bujang Belajar Mantera?',
    steps: ['Rest at the farm', 'Three bachelors', 'Suraya\'s interview', 'Ilmu Terapung', 'Kelas Gelap', 'Kelas Pantul', 'By the fire', 'Ujian Cermin'],
    next: 'Kudin, Leman and Sani live in Kampung Tepian now, and put on a magic show every Pesta day. Press Y to call them. More chapters are on the way.' });

  var prev = LC.NEWS, prior = null;
  try { prior = localStorage.getItem('littleCreature.newsSeen'); } catch (e) { /* storage blocked */ }
  LC.NEWS = {
    id: 'v3.19-ch18',
    lines: (prev && prior !== prev.id && prior !== 'v3.19-ch18' ? prev.lines : []).concat([
      { text: '✦ New: Chapter 18, Bujang Belajar Mantera? ✦  After Chapter 17, three hopeless bachelors turn Tok Penghulu\'s rooster purple... and ask YOU to be their fourth member.' },
      { text: 'Take them through Sekolah Mantera: a floating feather, a dark room, a rune that fires back, and a final exam where everyone fights their own mirror. Four against four!' }
    ])
  };

  // ---------------------------------------------------------------- Y: Mantera Empat Sekawan
  var onKey = U.onKey;
  U.onKey = function (ev) {
    if (ev.code === 'KeyY' && !this.modal && this.world && LC.hasSekawan()) {
      if (ev.preventDefault) ev.preventDefault();
      this.world.sekawanKey(); return;
    }
    return onKey.apply(this, arguments);
  };
  var buildSkills = U.buildSkills;
  U.buildSkills = function () {
    buildSkills.apply(this, arguments);
    var self = this;
    this.skwG = this.add.graphics();
    this.skwIcon = this.add.image(SX + 24, SY + 24, 'ic_sekawan').setScale(2.6);
    this.skwKey = this.txt(SX + 2, SY + 2, 'Y', 11, '#a08a6a');
    this.skwCd = this.txt(SX + 24, SY + 24, '', 18, '#fffdf2', { ox: 0.5, oy: 0.5, stroke: 4 });
    var z = this.add.zone(SX, SY, 48, 48).setOrigin(0).setInteractive({ useHandCursor: true });
    z.isTouchBtn = true;
    z.on('pointerdown', function () { if (!self.modal) self.pressKey('KeyY'); });
    this.skwZone = z;
    this.pin('bc', [this.skwG, this.skwIcon, this.skwKey, this.skwCd, z]);
  };
  var drawSkills = U.drawSkills;
  U.drawSkills = function () {
    drawSkills.apply(this, arguments);
    var g = this.skwG, on = LC.hasSekawan(), W = this.world;
    if (!g) return;
    g.clear();
    [this.skwIcon, this.skwCd, this.skwZone].forEach(function (o) { o.setVisible(on); });
    this.skwKey.setVisible(on && !this.touchOn);
    if (!on) return;
    var left = W && W.sekawanLeft ? W.sekawanLeft() : 0, live = W && W.hasEnemies && W.hasEnemies(), ready = !left && live;
    g.fillStyle(0x1e1510, 0.85); g.fillRoundedRect(SX - 6, SY - 6, 60, 60, 10);
    g.lineStyle(2, 0x8a6a3a, 1); g.strokeRoundedRect(SX - 6, SY - 6, 60, 60, 10);
    g.fillStyle(ready ? 0x3a2e14 : 0x2e2219, 1); g.fillRoundedRect(SX, SY, 48, 48, 6);
    g.lineStyle(ready ? 3 : 1, ready ? 0xe9c46a : 0x6a5034, 1); g.strokeRoundedRect(SX, SY, 48, 48, 6);
    if (left > 0) { g.fillStyle(0x000000, 0.6); g.fillRect(SX + 2, SY + 2, 44, 44 * Math.min(1, left / C.sekawan.cd)); }
    this.skwIcon.setAlpha(live || left ? 1 : 0.6);
    var t = left > 0 ? String(Math.ceil(left)) : '';
    if (this.skwCd.text !== t) this.skwCd.setText(t);
  };
  var youRows = U.youRows;
  U.youRows = function () {
    var rows = youRows.call(this);
    return LC.hasSekawan() ? rows.concat([{ icon: 'ic_sekawan', label: 'Mantera Empat Sekawan (Y)', sub: 'Call Kudin, Leman and Sani for a moment: Kudin\'s smoke ring blinds everything close, Leman throws a durian at the nearest foe (a stun), and Sani sings so they sway. Every ' + C.sekawan.cd + ' seconds.' }]) : rows;
  };
  var statRows = U.statRows;
  U.statRows = function () {
    var rows = statRows.apply(this, arguments);
    if (!LC.hasSekawan()) return rows;
    rows.forEach(function (r) {
      if (r.label !== 'Abilities') return;
      r.right = String((parseInt(r.right, 10) || 0) + 1);
      r.sub = /^None yet/.test(r.sub) ? 'Mantera Empat Sekawan (Y). Journal > You explains each one.' : r.sub.replace(/\. Journal > You/, ' · Mantera Empat Sekawan (Y). Journal > You');
    });
    return rows;
  };

  // ---------------------------------------------------------------- the exam hall: a name under each mirror
  var update = U.update;
  U.update = function (time) {
    update.apply(this, arguments);
    if (!this.ready || !this.S) return;
    var self = this, W = this.world, F = W && W.bujang && W.bujang.fight, cam = W && W.cameras && W.cameras.main;
    var tags = this.c18Tags = this.c18Tags || [], i = 0;
    if (F && cam && W.area === 'ujian18' && !this.modal) {
      var list = F.mirrors.filter(function (m) { return !m.gone; }).map(function (m) { return { s: m.e.spr, name: 'Bayang ' + cap(m.who), c: C.colors[m.who] }; });
      if (F.twin && !F.twinGone && !F.twin.dead) list.push({ s: F.twin.spr, name: 'Bayang Diri', c: C.colors.diri });
      var wv = cam.worldView, z = cam.zoom;
      list.forEach(function (it) {
        if (!it.s.visible) return;
        var t = tags[i];
        if (!t || !t.scene) t = tags[i] = self.txt(0, 0, '', 12, '#ffffff', { ox: 0.5, oy: 0, stroke: 3 }).setDepth(-0.6);
        i++;
        if (t.text !== it.name) t.setText(it.name);
        var col = hex(it.c);
        if (t.lcCol !== col) { t.lcCol = col; t.setColor(col); }
        t.setPosition(Math.round((it.s.x - wv.x) * z), Math.round((it.s.y + 6 - wv.y) * z)).setVisible(true);
      });
    }
    for (; i < tags.length; i++) if (tags[i] && tags[i].scene) tags[i].setVisible(false);
  };
})(window.LC);
