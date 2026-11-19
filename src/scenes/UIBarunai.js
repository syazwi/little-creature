/* UI, part 7 (v1.9): Chapter 2, Barunai. The brothers' Talk rows (finding them, the tembadau, "Baru nah!", Semaun's
 * voyage, the kenduri), the princess's requests, the Journal's Chapters page, the goal line, and the Langkah Semaun
 * button beside the hotbar. Mixed into LC.UIScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var FOUND_AREA = { barunai: 'here in Barunai', kampung: 'in Kampung Tepian', forest: 'in Hutan Rimba', island: 'on Pulau Mutiara', mountain: 'on Gunung Kabus', desert: 'in Bukit Pasir', farm: 'on your own farm' };
  function q() { return LC.State.s.quests; }
  function foundCount() { var f = q().ch2found || {}; return LC.BROTHERS.filter(function (v) { return f[v]; }).length; }
  function dishes() { var n = 0; LC.State.s.inv.forEach(function (sl) { if (sl && LC.ITEMS[sl.id].kind === 'dish') n += sl.n; }); return n; }

  // the current Chapter 2 task, for the goal line and the Journal
  LC.ch2Goal = function () {
    var S = LC.State.s, Q = S.quests, st = Q.ch2 || 0;
    if (!st) return null;
    switch (st) {
      case 1: return 'Chapter 2: take Nenek\'s perahu at the farm jetty, across the sea to Barunai.';
      case 2: return 'Chapter 2: find Awang Alak Betatar\'s brothers across the land (' + foundCount() + ' / ' + LC.BROTHERS.length + ').';
      case 3: return 'Chapter 2: follow the tembadau\'s hoofprints in Barunai, starting east of the camp.';
      case 4: return 'Chapter 2: tell Awang Alak Betatar what the tembadau found by the river.';
      case 5: return 'Chapter 2: talk to Awang Semaun in Barunai. He has a voyage in mind.';
      case 6: return S.day > (Q.ch2day || 0) ? 'Chapter 2: help Tuan Puteri: find Si Pinggai' + (Q.ch2bird ? ' (done)' : '') + ' and dive for her chest' + (Q.ch2ship ? ' (done)' : '') + '.' : 'Chapter 2: Awang Semaun is away in Johor. He will be back tomorrow.';
      case 7: return 'Chapter 2: bring 5 cooked dishes to Awang Alak Betatar for the wedding kenduri (' + Math.min(5, dishes()) + ' / 5).';
    }
    return null;
  };

  Object.assign(LC.UIScene.prototype, {
    // ================================================================ the brothers, Semaun and the princess
    ch2Rows: function (vid, v, por) {
      var self = this, S = this.S, W = this.world, Q = q(), st = Q.ch2 || 0, rows = [], T2 = LC.CH2TEXT;
      function sayLines(arr, opts) { self.say(W.ch2Lines(arr), opts); }
      if (v.brother && !(Q.ch2found && Q.ch2found[vid])) {   // a brother still in his mother's village
        var f = v.find, it = LC.ITEMS[f[0]], have = LC.State.count(f[0]);
        if (st < 2) rows.push({ icon: 'ic_moon', label: 'Brothers?', sub: 'He wonders about the brothers he has never met. (Visit Barunai to learn more.)' });
        else rows.push({ icon: it.icon, label: 'Ask him to come to Barunai', right: have >= f[1] ? 'Give' : have + '/' + f[1], sub: '"Barunai? My brothers?! I will come. But let me bring something from home for them: ' + f[1] + ' ' + it.name + '."',
          enabled: have >= f[1], why: 'He would like to bring ' + f[1] + ' ' + it.name + ' (you have ' + have + ').',
          action: function () {
            LC.State.remove(f[0], f[1]);
            (Q.ch2found = Q.ch2found || {})[vid] = 1;
            LC.State.addFriendship(vid, 4); LC.Audio.sfx('chime');
            var n = W.npcs[vid];
            if (n) {
              if (n.here) { W.solid[n.ty][n.tx] = false; W.objAt[n.ty][n.tx] = null; }
              W.fx.sparkle.explode(10, n.spr.x, n.spr.y - 10);
              W.tweens.add({ targets: n.spr, alpha: 0, duration: 900, onComplete: function () { n.spr.destroy(); } });
              delete W.npcs[vid];
            }
            var left = LC.BROTHERS.length - foundCount();
            self.toast(v.name + ' sets off for Barunai! ' + (left ? left + ' brother' + (left > 1 ? 's' : '') + ' still to find.' : 'That is all of them! Go and tell Awang Alak Betatar.'), 'ic_bond');
            return 'close';
          } });
      }
      if (vid === 'alak') {
        if (st === 1) Q.ch2 = st = 2;   // after his introduction: the search begins
        if (st === 2) {
          var n2 = foundCount(), missing = LC.BROTHERS.filter(function (b) { return !(Q.ch2found && Q.ch2found[b]); });
          if (n2 < LC.BROTHERS.length) rows.push({ icon: 'ic_bond', label: 'Find our brothers (' + n2 + ' / ' + LC.BROTHERS.length + ')', sub: 'Still missing: ' + missing.map(function (b) { return LC.VILLAGERS[b].name + ' (' + FOUND_AREA[LC.VILLAGERS[b].area] + ')'; }).join(', ') + '.' });
          else rows.push({ icon: 'ic_bond', label: 'All fourteen brothers are together!', right: 'Talk', sub: 'Tell Awang Alak Betatar the good news.', action: function () { Q.ch2 = 3; LC.Audio.sfx('stage'); sayLines(LC.CH2TEXT.gatherDone, { onDone: function () { W.refreshBarunai(); } }); return 'close'; } });
        }
        if (st === 3) rows.push({ icon: 'i_kepeng', label: 'The tembadau trail', sub: 'Follow the hoofprints, starting just east of the camp. Our father found his way like this, long ago.' });
        if (st === 4) rows.push({ icon: 'ic_glow', label: 'The tembadau found the place!', right: 'Go', sub: 'Gather the brothers at the bend in the river.', action: function () { W.foundBarunai(); return 'close'; } });
        if (st === 7) {
          var d = dishes();
          rows.push({ icon: 'ic_joy', label: 'The wedding kenduri', right: d >= 5 ? 'Give' : Math.min(5, d) + '/5', sub: T2.feastAsk + ' (Any cooked dishes: you have ' + d + '.)', enabled: d >= 5, why: 'Bring 5 cooked dishes (cook them at Nenek\'s dapur).',
            action: function () {
              var need = 5;
              S.inv.forEach(function (sl, i) { if (need > 0 && sl && LC.ITEMS[sl.id].kind === 'dish') { var k = Math.min(need, sl.n); sl.n -= k; need -= k; if (sl.n <= 0) S.inv[i] = null; } });
              LC.emit('inv'); Q.ch2 = 8; S.kepeng += 800; S.stats.earned += 800; LC.State.add('kain_tenun', 1);
              LC.Audio.sfx('cheer'); LC.Audio.sfx('stage');
              W.cameras.main.flash(500, 255, 230, 180);
              W.doShared('kind', { n: 15 }, function () {});
              sayLines(T2.feast);
              return 'close';
            } });
        }
        if (st >= 8) rows.push({ icon: 'ic_glow', label: 'Barunai', sub: 'Fourteen brothers, one river, one home. And a princess from Johor, and a very loud bird.' });
      }
      if (vid === 'semaun') {
        if (st === 5) rows.push({ icon: 'ic_glow', label: 'A voyage to Johor', right: 'Talk', sub: 'Semaun has something in mind for his brother.', action: function () {
          sayLines(T2.voyage, { onDone: function () { Q.ch2 = 6; Q.ch2day = S.day; LC.Audio.sfx('water'); var n = W.npcs.semaun; if (n) { if (n.here) { W.solid[n.ty][n.tx] = false; W.objAt[n.ty][n.tx] = null; } W.tweens.add({ targets: n.spr, alpha: 0, duration: 900, onComplete: function () { n.spr.destroy(); } }); delete W.npcs.semaun; } self.toast('Awang Semaun sails for Johor. He will be back tomorrow.', 'ic_glow'); } });
          return 'close';
        } });
        if (st >= 8) rows.push({ icon: 'ic_langkah', label: 'Langkah Semaun', sub: 'His giant stride: press Shift (or tap the footprints beside your hotbar) to leap a few steps forward, even past enemies. Ready again after ' + LC.LANGKAH.cd + ' seconds.' });
      }
      if (vid === 'puteri' && st === 6) {
        rows.push({ icon: 'bulu', iconScale: 2, label: Q.ch2bird ? 'Si Pinggai is home!' : 'Find Si Pinggai', sub: Q.ch2bird ? 'He is sitting on his perch, singing. Badly.' : 'Follow his feathers along the walkways of the water village.' });
        rows.push({ icon: 'i_kain_tenun', label: Q.ch2ship ? 'The dowry chest is saved!' : 'The sunken ship', sub: Q.ch2ship ? 'The chest is safe on dry land.' : 'Dive where the bubbles rise, off the old landing at the east end of the river.' });
        if (Q.ch2bird && Q.ch2ship) rows.push({ icon: 'ic_joy', label: 'Thank you, friend!', right: 'Talk', sub: 'Now the wedding can go ahead.', action: function () {
          Q.ch2 = 7; LC.Audio.sfx('chime');
          sayLines([{ who: 'puteri', text: 'My bird and my mother\'s chest! Now the wedding can go ahead. Awang Alak Betatar is planning the kenduri. Will you help him?' }]);
          return 'close';
        } });
      }
      return rows;
    },

    // ================================================================ the Journal's Chapters page
    chapterRows: function () {
      var S = this.S, Q = S.quests, st = Q.ch2 || 0, lv = LC.State.level(), rows = [];
      var done1 = lv >= LC.LEGEND_LEVEL || st >= 1;
      rows.push({ icon: 'ic_bond', label: 'Chapter 1: Little Creature' + (done1 ? '  (complete)' : ''), right: done1 ? 'Done' : 'Lv ' + lv + '/' + LC.LEGEND_LEVEL,
        sub: done1 ? 'Pelita became a Legend of the Kampung. Nenek\'s farm, the kampung, the spirits and every story of the land are yours to enjoy.' : 'Care for Pelita until it becomes a Legend of the Kampung (Lv ' + LC.LEGEND_LEVEL + '). Then a new chapter begins...' });
      if (!done1) return rows;
      rows.push({ icon: 'ic_glow', label: 'Chapter 2: Barunai' + (st >= 8 ? '  (complete)' : ''), right: st >= 8 ? 'Done' : '', sub: LC.ch2Goal() || 'Fourteen brothers, one river, one home.' });
      // [the chapter step while this is the task, title, description]
      var steps = [
        [0, 'Nenek\'s second letter', 'Found in an old tin box in the roof.'],
        [1, 'Meet Awang Alak Betatar', 'At the brothers\' camp in Barunai, across the sea.'],
        [2, 'Gather the brothers', 'Twelve brothers, all across the land (' + foundCount() + ' / ' + LC.BROTHERS.length + ').'],
        [3, 'The tembadau trail', 'Follow the wild ox, as their father once did.'],
        [4, 'Baru nah!', 'Now we have found it: the founding of Barunai.'],
        [5, 'Awang Semaun\'s voyage', 'He sails to Johor for a princess.'],
        [6, 'Si Pinggai and the sunken chest', 'Help Tuan Puteri.'],
        [7, 'The wedding kenduri', 'Five dishes for the feast, and Langkah Semaun.']
      ];
      steps.forEach(function (s) {
        if (st < s[0]) return;   // not reached yet
        var doneS = st > s[0];
        rows.push({ icon: doneS ? 'ic_bond' : 'ic_moon', label: (doneS ? '✓ ' : '') + s[1], right: doneS ? 'Done' : 'Now', sub: s[2] });
      });
      if (st >= 5) rows.push({ icon: 'i_tempayan', label: 'A secret of the river', sub: Q.vaseDay ? 'You found the magic tempayan. It comes back on some quiet nights.' : 'On some quiet nights, something magical floats in the river of Barunai...' });
      return rows;
    },

    // ================================================================ the Langkah Semaun button (beside the stone curse)
    buildDash: function () {
      var self = this;
      this.dashG = this.add.graphics();
      this.dashIcon = this.add.image(140, 604, 'ic_langkah').setScale(2.6);
      this.dashKey = this.txt(118, 582, 'Shift', 10, '#a08a6a');
      this.dashCd = this.txt(140, 604, '', 18, '#fffdf2', { ox: 0.5, oy: 0.5, stroke: 4 });
      var z = this.add.zone(116, 580, 48, 48).setOrigin(0).setInteractive({ useHandCursor: true });
      z.isTouchBtn = true;
      z.on('pointerdown', function () { if (!self.modal && self.world) self.world.dash(); });
      this.dashZone = z;
      this.pin('bc', [this.dashG, this.dashIcon, this.dashKey, this.dashCd, z]);
    },
    drawDash: function () {
      var on = LC.hasLangkah(), g = this.dashG, W = this.world;
      if (!g) return;
      g.clear();
      this.dashIcon.setVisible(on); this.dashKey.setVisible(on && !this.touchOn); this.dashCd.setVisible(on); this.dashZone.setVisible(on);
      if (!on) return;
      var left = W && W.dashLeft ? W.dashLeft() : 0, x = 116, y = 580;
      g.fillStyle(0x1e1510, 0.85); g.fillRoundedRect(x - 6, y - 8, 60, 64, 10);
      g.lineStyle(2, 0x8a6a3a, 1); g.strokeRoundedRect(x - 6, y - 8, 60, 64, 10);
      g.fillStyle(left ? 0x2e2219 : 0x3a3020, 1); g.fillRoundedRect(x, y, 48, 48, 6);
      g.lineStyle(left ? 1 : 2, left ? 0x6a5034 : 0xffd166, 1); g.strokeRoundedRect(x, y, 48, 48, 6);
      if (left > 0) { g.fillStyle(0x000000, 0.6); g.fillRect(x + 2, y + 2, 44, 44 * Math.min(1, left / LC.LANGKAH.cd)); }
      var t = left > 0 ? String(Math.ceil(left)) : '';
      if (this.dashCd.text !== t) this.dashCd.setText(t);
    }
  });

  // ---------------------------------------------------------------- hooks
  var specialRows = LC.UIScene.prototype.specialRows;
  LC.UIScene.prototype.specialRows = function (vid, v, por) {
    var rows = specialRows.call(this, vid, v, por);
    return v.chapter2 ? rows.concat(this.ch2Rows(vid, v, por)) : rows;
  };
  var buildSkills = LC.UIScene.prototype.buildSkills;
  LC.UIScene.prototype.buildSkills = function () { buildSkills.apply(this, arguments); this.buildDash(); };
  var drawSkills = LC.UIScene.prototype.drawSkills;
  LC.UIScene.prototype.drawSkills = function () { drawSkills.apply(this, arguments); this.drawDash(); };
  var onKey = LC.UIScene.prototype.onKey;
  LC.UIScene.prototype.onKey = function (ev) {
    if (!this.modal && this.world && (ev.code === 'ShiftLeft' || ev.code === 'ShiftRight')) { this.world.dash(); return; }
    return onKey.call(this, ev);
  };
})(window.LC);
