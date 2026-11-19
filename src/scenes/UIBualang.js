/* UI, part 15 (v2.5): Sang Bualang and Angin Bualang (see bualang.js). Two buttons above Nek Lampir's and Langkah
 * Semaun's (B: fly the wau; U: the gust), the arrow at the edge of the screen while he rides the wind to you, his Talk
 * row and Journal lines, and the pause menu's switch for Pelita's daylight. Mixed into LC.UIScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var B = LC.BUALANG;
  var WX = 56, GX = 116, BY = 514;   // the second row of skill buttons, above Nek Lampir (56) and Langkah Semaun (116)

  Object.assign(LC.UIScene.prototype, {
    buildBualang: function () {
      var self = this;
      this.buaG = this.add.graphics();
      this.buaIcon = this.add.image(WX + 24, BY + 24, 'ic_wau').setScale(2.6);
      this.buaKey = this.txt(WX + 2, BY + 2, 'B', 11, '#a08a6a');
      this.buaCd = this.txt(WX + 24, BY + 24, '', 18, '#fffdf2', { ox: 0.5, oy: 0.5, stroke: 4 });
      this.angIcon = this.add.image(GX + 24, BY + 24, 'ic_angin').setScale(2.6);
      this.angKey = this.txt(GX + 2, BY + 2, 'U', 11, '#a08a6a');
      this.angCd = this.txt(GX + 24, BY + 24, '', 18, '#fffdf2', { ox: 0.5, oy: 0.5, stroke: 4 });
      var z1 = this.add.zone(WX, BY, 48, 48).setOrigin(0).setInteractive({ useHandCursor: true }), z2 = this.add.zone(GX, BY, 48, 48).setOrigin(0).setInteractive({ useHandCursor: true });
      z1.isTouchBtn = z2.isTouchBtn = true;
      z1.on('pointerdown', function () { if (!self.modal) self.pressKey('KeyB'); });
      z2.on('pointerdown', function () { if (!self.modal) self.pressKey('KeyU'); });
      this.buaZones = [z1, z2];
      this.pin('bc', [this.buaG, this.buaIcon, this.buaKey, this.buaCd, this.angIcon, this.angKey, this.angCd, z1, z2]);
      // while he rides the wind to you: an arrow at the edge of the screen, from where he is coming
      this.buaArrow = this.add.graphics().setDepth(60);
      this.buaArrowIcon = this.add.image(0, 0, 'ic_wau').setScale(2.2).setDepth(61).setVisible(false);
      this.buaArrowT = this.txt(0, 0, '', 15, '#fffdf2', { ox: 0.5, oy: 0.5, stroke: 4 }).setDepth(61).setVisible(false);
    },
    drawBualang: function () {
      var on = LC.hasBualang(), g = this.buaG, W = this.world;
      if (!g) return;
      g.clear(); this.buaArrow.clear();
      [this.buaIcon, this.buaCd, this.angIcon, this.angCd].forEach(function (o) { o.setVisible(on); });
      this.buaKey.setVisible(on && !this.touchOn); this.angKey.setVisible(on && !this.touchOn);
      this.buaZones.forEach(function (z) { z.setVisible(on); });
      this.buaArrowIcon.setVisible(false); this.buaArrowT.setVisible(false);
      if (!on) return;
      var b = W && W.bual, here = !!(b && !b.leaving), due = LC.bualangLeft.due(), rest = LC.bualangLeft.rest(), gust = LC.bualangLeft.gust();
      function frame(x, ready, glow, left, full) {
        g.fillStyle(0x1e1510, 0.85); g.fillRoundedRect(x - 6, BY - 6, 60, 60, 10);
        g.lineStyle(2, 0x8a6a3a, 1); g.strokeRoundedRect(x - 6, BY - 6, 60, 60, 10);
        g.fillStyle(glow ? 0x24384a : 0x2e2219, 1); g.fillRoundedRect(x, BY, 48, 48, 6);
        g.lineStyle(ready ? 3 : 1, ready ? 0xd8ecff : 0x6a5034, 1); g.strokeRoundedRect(x, BY, 48, 48, 6);
        if (left > 0) { g.fillStyle(0x000000, 0.6); g.fillRect(x + 2, BY + 2, 44, 44 * Math.min(1, left / full)); }
      }
      var wLeft = due > 0 ? due : (here ? 0 : rest), wFull = due > 0 ? (LC.bualangDur || B.arrive.open) : B.rest;
      frame(WX, !wLeft, here || due > 0, wLeft, wFull);
      frame(GX, !gust && W && W.hasEnemies && W.hasEnemies(), false, gust, B.gust.cd);
      var t1 = wLeft > 0 ? String(Math.ceil(wLeft)) : '', t2 = gust > 0 ? String(Math.ceil(gust)) : '';
      if (this.buaCd.text !== t1) this.buaCd.setText(t1);
      if (this.angCd.text !== t2) this.angCd.setText(t2);
      this.buaCd.setColor(due > 0 ? '#d8ecff' : '#fffdf2');
      // the arrow at the edge of the screen while he is on his way
      if (due > 0 && W && W.player) {
        // (kept clear of the HUD: the clock and Pelita's panel at the top, the hotbar and buttons at the bottom)
        var sw = this.scale.width, sh = this.scale.height, a = LC.bualangAng || 0, top = 150, bot = sh - 150, cx = sw / 2, cy = (top + bot) / 2, m = 46 + Math.max(this.safe.l, this.safe.r);
        var k = Math.min((sw / 2 - m) / Math.max(0.001, Math.abs(Math.cos(a))), ((bot - top) / 2) / Math.max(0.001, Math.abs(Math.sin(a))));
        var x = cx + Math.cos(a) * k, y = cy + Math.sin(a) * k, pulse = 0.7 + 0.3 * Math.sin(this.time.now / 160);
        var ar = this.buaArrow;
        ar.fillStyle(0x1e1510, 0.8); ar.fillCircle(x, y, 26);
        ar.lineStyle(2, 0xd8ecff, pulse); ar.strokeCircle(x, y, 26);
        var tx = x + Math.cos(a) * 34, ty = y + Math.sin(a) * 34, nx = -Math.sin(a), ny = Math.cos(a);
        ar.fillStyle(0xd8ecff, pulse); ar.fillTriangle(tx, ty, x + Math.cos(a) * 24 + nx * 9, y + Math.sin(a) * 24 + ny * 9, x + Math.cos(a) * 24 - nx * 9, y + Math.sin(a) * 24 - ny * 9);
        this.buaArrowIcon.setVisible(true).setPosition(x, y - 4);
        this.buaArrowT.setVisible(true).setPosition(x, y + 14).setText(Math.ceil(due) + 's');
      }
    },
    bualangJournalRows: function () {
      var rows = [{ icon: 'ic_wau', label: 'Sang Bualang, the wind (B)', sub: 'Fly the wau to call him: he rides the wind, so he takes about ' + B.arrive.open + 's (' + B.arrive.closed + 's in forests and caves; never under the sea). In a fight he spins enemies away, dizzy; press B again to send him spinning at once. He rests ' + B.rest + 's after he leaves.' },
        { icon: 'ic_angin', label: 'Angin Bualang (U)', sub: 'Blow back every enemy around you and leave them dizzy (ready every ' + B.gust.cd + 's). It also blows away darkness, fog and whirlwinds.' }];
      if (LC.pelitaSunUnlocked()) rows.push({ icon: 'ic_sun', label: 'Pelita\'s daylight' + (LC.State.level() >= LC.MAX_LEVEL ? '' : '  (at Lv ' + LC.MAX_LEVEL + ')'), sub: LC.State.level() >= LC.MAX_LEVEL ? 'At night, wherever Pelita is with you, everything is as bright as day. ' + (LC.State.s.flags.sunOff ? 'Switched off (pause menu).' : 'Switch it off in the pause menu.') : 'A thread of Kayangan\'s light: when Pelita reaches Lv ' + LC.MAX_LEVEL + ', the nights will be as bright as day.' });
      return rows;
    }
  });

  // the pause menu: Pelita's daylight on or off
  LC.pauseExtraRow = function () {
    var S = LC.State.s;
    if (!LC.pelitaSunUnlocked()) return null;
    return { icon: 'ic_sun', label: 'Pelita\'s daylight: ' + (S.flags.sunOff ? 'Off' : 'On'), sub: LC.State.level() >= LC.MAX_LEVEL ? 'At night, Pelita lights up everything around you like day.' : 'Shines from Pelita Lv ' + LC.MAX_LEVEL + '. At night, everything around you as bright as day.',
      action: function () { S.flags.sunOff = !S.flags.sunOff; } };
  };

  // ---------------------------------------------------------------- hooks
  var buildSkills = LC.UIScene.prototype.buildSkills;
  LC.UIScene.prototype.buildSkills = function () { buildSkills.apply(this, arguments); this.buildBualang(); };
  var drawSkills = LC.UIScene.prototype.drawSkills;
  LC.UIScene.prototype.drawSkills = function () { drawSkills.apply(this, arguments); this.drawBualang(); };
  var onKey = LC.UIScene.prototype.onKey;
  LC.UIScene.prototype.onKey = function (ev) {
    if (!this.modal && this.world && !this.world.sleeping) {
      if (ev.code === 'KeyB' && LC.hasBualang()) { this.world.bualangKey(); return; }
      if (ev.code === 'KeyU' && LC.hasBualang()) { this.world.anginKey(); return; }
    }
    return onKey.call(this, ev);
  };
  // on a computer the toasts sit above the second row of buttons
  var toastBaseY = LC.UIScene.prototype.toastBaseY;
  LC.UIScene.prototype.toastBaseY = function () { return toastBaseY.call(this) - (LC.hasBualang() && !this.touchOn ? 66 : 0); };
  var specialRows = LC.UIScene.prototype.specialRows;
  LC.UIScene.prototype.specialRows = function (vid, v, por) {
    var rows = specialRows.call(this, vid, v, por);
    if (vid === 'bualang' && LC.hasBualang()) rows.push({ icon: 'ic_wau', label: 'His help', sub: 'Press B (or tap the wau beside your hotbar) anywhere to call him on the wind. Press U for your own gust, Angin Bualang.' });
    return rows;
  };
  var youRows = LC.UIScene.prototype.youRows;
  LC.UIScene.prototype.youRows = function () {
    var rows = youRows.call(this);
    return LC.hasBualang() ? rows.concat(this.bualangJournalRows()) : rows;
  };
})(window.LC);
