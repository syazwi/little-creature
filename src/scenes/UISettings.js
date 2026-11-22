/* UI, part 4 (v1.6): sound & music volumes, save and load slots, the ability slots beside the hotbar
 * (Sumpahan Batu and Restu Ibu), floating damage numbers and the red flash when you are hurt.
 * Mixed into LC.UIScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var ACCEPT = { KeyE: 1, Space: 1, Enter: 1 };
  var SOUND_ROWS = [
    { k: 'music', label: 'Music', sub: 'The calm gamelan soundtrack.' },
    { k: 'battle', label: 'Battle music', sub: 'Drums and gongs in a fight.' },
    { k: 'sfx', label: 'Sound effects', sub: 'Tools, coins, swings, chimes.' },
    { k: 'amb', label: 'Nature & rain', sub: 'River, birds, waves, wind, rain.' }
  ];

  // v2.7.8: switch the font ('pixel' or 'modern'), saved on this device. Every text already on screen changes at once
  // (texts inside menus and dialogs too); new ones are made with LC.FONT.
  LC.setFont = function (k) {
    if (!LC.FONTS[k]) return;
    var old = LC.FONT, nw = LC.FONTS[k];
    LC.fontKey = k; LC.FONT = nw;
    try { localStorage.setItem('littleCreature.font', k); } catch (e) { /* storage blocked: this session only */ }
    document.documentElement.classList.toggle('font-modern', k === 'modern');
    if (old === nw || !LC.game) return;
    function walk(list) {
      list.forEach(function (o) {
        if (o.type === 'Text' && o.style && o.style.fontFamily === old) o.setFontFamily(nw);
        if (o.list) walk(o.list);
      });
    }
    LC.game.scene.getScenes(true).forEach(function (sc) { walk(sc.children.list); });
  };

  Object.assign(LC.UIScene.prototype, {
    // ================================================================ ability slots beside the hotbar
    buildSkills: function () {
      var self = this;
      this.skillG = this.add.graphics();
      this.skIcon = this.add.image(200, 604, 'ic_batu').setScale(2.6);
      this.skKey = this.txt(180, 582, 'V', 11, '#a08a6a');
      this.skCd = this.txt(200, 604, '', 18, '#fffdf2', { ox: 0.5, oy: 0.5, stroke: 4 });
      this.rsIcon = this.add.image(200, 556, 'ic_restu').setScale(2);   // (v1.9: above the stone, to make room for Langkah Semaun)
      var z = this.add.zone(176, 580, 48, 48).setOrigin(0).setInteractive({ useHandCursor: true });
      z.isTouchBtn = true;
      z.on('pointerdown', function () { if (!self.modal) self.pressKey('KeyV'); });
      var rz = this.add.zone(184, 540, 32, 32).setOrigin(0).setInteractive({ useHandCursor: true });
      rz.isTouchBtn = true;
      rz.on('pointerdown', function () { if (!self.modal) self.toast(LC.State.s.restuDay === LC.State.s.day ? 'Restu Ibu has already saved you today. It returns tomorrow.' : 'Restu Ibu is with you: if your health runs out today, Mak Deruma\'s prayer will lift you up.', 'ic_restu'); });
      this.skZones = [z, rz];
      this.pin('bc', [this.skillG, this.skIcon, this.skKey, this.skCd, this.rsIcon, z, rz]);
    },
    drawSkills: function () {
      var g = this.skillG, W = this.world, S = this.S, stone = LC.hasStone(), restu = LC.hasRestu();
      g.clear();
      this.skIcon.setVisible(stone); this.skKey.setVisible(stone && !this.touchOn); this.skCd.setVisible(stone); this.rsIcon.setVisible(restu);
      this.skZones[0].setVisible(stone); this.skZones[1].setVisible(restu);
      if (stone) {
        var C = restu ? LC.RESTU : LC.STONE, left = W && W.stoneLeft ? W.stoneLeft() : 0, live = W && W.hasEnemies && W.hasEnemies(), x = 176, y = 580;
        g.fillStyle(0x1e1510, 0.85); g.fillRoundedRect(x - 6, y - 8, 60, 64, 10);
        g.lineStyle(2, 0x8a6a3a, 1); g.strokeRoundedRect(x - 6, y - 8, 60, 64, 10);
        g.fillStyle(live && !left ? 0x2a3a4a : 0x2e2219, 1); g.fillRoundedRect(x, y, 48, 48, 6);
        g.lineStyle(live && !left ? 3 : 1, live && !left ? 0x8fd3ff : 0x6a5034, 1); g.strokeRoundedRect(x, y, 48, 48, 6);
        if (left > 0) { g.fillStyle(0x000000, 0.6); g.fillRect(x + 2, y + 2, 44, 44 * Math.min(1, left / C.cd)); }
        this.skIcon.setAlpha(live || left ? 1 : 0.55);
        var t = left > 0 ? String(Math.ceil(left)) : '';
        if (this.skCd.text !== t) this.skCd.setText(t);
      }
      if (restu) {
        var used = S.restuDay === S.day, rx = 184, ry = 540;
        g.fillStyle(0x1e1510, 0.85); g.fillRoundedRect(rx, ry, 32, 32, 7);
        g.lineStyle(2, used ? 0x6a5034 : 0xffd166, 1); g.strokeRoundedRect(rx, ry, 32, 32, 7);
        this.rsIcon.setAlpha(used ? 0.35 : 1);
      }
    },

    // ================================================================ battle feedback
    floatText: function (wx, wy, s, color) {
      if (!this.ready) return;
      var t = this.txt(0, 0, s, 16, color || '#fffdf2', { ox: 0.5, oy: 1, stroke: 4 }).setDepth(-0.5);
      this.floats = this.floats || [];
      this.floats.push({ t: t, wx: wx, wy: wy, born: this.time.now });
      this.updateFloats();
    },
    updateFloats: function () {
      var W = this.world, cam = W && W.cameras && W.cameras.main, now = this.time.now;
      this.floats = (this.floats || []).filter(function (f) {
        var age = (now - f.born) / 850;
        if (age >= 1 || !cam) { f.t.destroy(); return false; }
        var sx = (f.wx - cam.worldView.x) * cam.zoom, sy = (f.wy - cam.worldView.y) * cam.zoom - age * 40;
        f.t.setPosition(Math.round(sx), Math.round(sy)).setAlpha(age < 0.6 ? 1 : 1 - (age - 0.6) / 0.4).setScale(age < 0.15 ? 1.4 - age * 2.6 : 1);
        return true;
      });
    },
    hurtFlash: function () {
      if (!this.hurtR) this.hurtR = this.add.rectangle(-2000, -2000, 6000, 6000, 0xff2020, 1).setOrigin(0).setDepth(-0.4).setAlpha(0);
      this.tweens.killTweensOf(this.hurtR);
      this.hurtR.setAlpha(0.2);
      this.tweens.add({ targets: this.hurtR, alpha: 0, duration: 280 });
    },

    // ================================================================ sound & music volumes
    openSound: function () {
      this.closeModal();
      var self = this, A = LC.Audio, sel = 0, m;
      var c = this.modalC(95, 0x000000, 0.45);
      var X = 190, Y = 140, Wd = 580, Hd = 360, RH = 62, barX = X + 240, barW = 200;
      var bg = this.add.graphics(); this.panel(bg, X, Y, Wd, Hd); c.add(bg);
      this.closeX(c, X + Wd, Y, function () { if (self.modal === m) m.key('Escape'); });   // v2.7.7
      c.add(this.txt(480, Y + 14, 'Sound & Music', 26, '#ffd166', { ox: 0.5 }));
      var rg = this.add.graphics(); c.add(rg);
      var rows = SOUND_ROWS.map(function (r, i) {
        var y = Y + 60 + i * RH;
        var lb = self.txt(X + 30, y + 6, r.label, 19, '#fbecc8'), sb = self.txt(X + 30, y + 32, '', 12, '#a08a6a', { wrap: 190 });
        var pc = self.txt(barX + barW + 60, y + 20, '', 16, '#f7dd8a', { ox: 0.5, oy: 0.5 });
        var mi = self.txt(barX - 18, y + 20, '−', 24, '#ffd166', { ox: 0.5, oy: 0.5 }), pl = self.txt(barX + barW + 18, y + 19, '+', 22, '#ffd166', { ox: 0.5, oy: 0.5 });
        var zm = self.add.zone(barX - 34, y + 2, 32, 36).setOrigin(0).setInteractive({ useHandCursor: true });
        var zp = self.add.zone(barX + barW + 2, y + 2, 32, 36).setOrigin(0).setInteractive({ useHandCursor: true });
        var zb = self.add.zone(barX, y + 6, barW, 28).setOrigin(0).setInteractive({ useHandCursor: true });
        var zr = self.add.zone(X + 20, y, 190, RH - 6).setOrigin(0).setInteractive({ useHandCursor: true });
        zm.on('pointerdown', function () { sel = i; change(-0.1); });
        zp.on('pointerdown', function () { sel = i; change(0.1); });
        zb.on('pointerdown', function (p) { sel = i; A.setVolume(r.k, (p.x - (zb.getBounds().x)) / barW); LC.Audio.sfx('click'); render(); });
        zr.on('pointerdown', function () { sel = i; render(); });
        c.add([lb, sb, pc, mi, pl, zm, zp, zb, zr]);
        return { y: y, lb: lb, sb: sb, pc: pc };
      });
      var foot = this.txt(480, Y + Hd - 52, '', 13, '#cdb8a0', { ox: 0.5, wrap: Wd - 60, align: 'center' });
      var keys = this.txt(480, Y + Hd - 22, this.touchOn ? 'Tap − / + or the bar  ·  X to close' : 'W/S choose  ·  A/D or ←/→ change  ·  N music on/off  ·  Esc close', 12, '#8a7a6a', { ox: 0.5 });
      c.add([foot, keys]);
      function change(dv) { var r = SOUND_ROWS[sel]; A.setVolume(r.k, A.vol[r.k] + dv); LC.Audio.sfx('click'); render(); }
      function render() {
        rg.clear();
        rows.forEach(function (o, i) {
          var r = SOUND_ROWS[i], v = A.vol[r.k], on = i === sel;
          rg.fillStyle(on ? 0x4a3520 : 0x2b1f17, 1); rg.fillRoundedRect(X + 20, o.y, Wd - 40, RH - 6, 6);
          if (on) { rg.lineStyle(2, 0xffd166, 1); rg.strokeRoundedRect(X + 20, o.y, Wd - 40, RH - 6, 6); }
          self.bar(rg, barX, o.y + 12, barW, 16, v, r.k === 'battle' ? 0xff8a5a : r.k === 'amb' ? 0x9be15d : r.k === 'sfx' ? 0x8fd3ff : 0xffd166);
          o.pc.setText(Math.round(v * 100) + '%');
          o.sb.setText(on ? r.sub : '');
        });
        A.setPreview(SOUND_ROWS[sel].k === 'battle' && A.musicOn);
        foot.setText(!A.musicOn ? 'Music is switched off (press N, or use Music: Off in the pause menu, to turn it back on).'
          : SOUND_ROWS[sel].k === 'battle' ? (A.vol.battle > 0 ? 'Previewing the battle song...' : 'Battle music is off: the calm music keeps playing during fights.') : 'Changes are saved on this device.');
      }
      function close() { A.setPreview(false); c.destroy(); if (self.modal === m) self.modal = null; }
      m = {
        type: 'sound', close: close, render: render,
        key: function (code) {
          if (code === 'Escape' || code === 'Tab') { close(); return; }
          if (code === 'ArrowUp' || code === 'KeyW') sel = (sel + 3) % 4;
          else if (code === 'ArrowDown' || code === 'KeyS') sel = (sel + 1) % 4;
          else if (code === 'ArrowLeft' || code === 'KeyA') { change(-0.1); return; }
          else if (code === 'ArrowRight' || code === 'KeyD') { change(0.1); return; }
          else if (code === 'KeyN') { self.toast('Music ' + (LC.Audio.toggleMusic() ? 'on' : 'off'), 'ic_glow'); }
          else if (ACCEPT[code]) { change(A.vol[SOUND_ROWS[sel].k] >= 1 ? -1 : 0.1); return; }
          LC.Audio.sfx('click');
          render();
        },
        wheel: function (dy) { change(dy > 0 ? -0.1 : 0.1); }
      };
      this.modal = m;
      render();
    },

    // ================================================================ updates (v1.7.1): the pause menu row
    updateRow: function () {
      var self = this, U = LC.Update, cur = U.current(), v = U.info;
      if (U.newer()) return { icon: 'ic_glow', label: 'Update available: v' + v.name, right: 'Get',
        sub: 'Updated ' + U.when(v.built) + ' (you have v' + cur.name + ', ' + U.when(cur.built) + '). Tap to ' + U.verb() + ' it.',
        action: function () { if (U.download()) self.toast(U.howTo(), 'ic_glow'); } };
      var state = U.state === 'checking' ? 'Checking GitHub...' : U.state === 'fail' ? 'Could not reach GitHub. Tap to try again.'
        : U.state === 'ok' ? 'This is the newest version. Tap to check again.' : 'Tap to check for a newer version.';
      return { icon: 'ic_glow', label: 'Updates: v' + cur.name, sub: 'Updated ' + U.when(cur.built) + '. ' + state, action: function () {
        var menu = self.modal;
        U.told = true;   // this row gives the news itself
        U.check(function (nw) {
          if (self.modal === menu && menu && menu.render) menu.render();
          if (U.state === 'fail') self.toast('Could not reach GitHub. Check your internet and try again.', 'ic_moon');
          else if (!nw) self.toast('You have the newest version: v' + cur.name + '.', 'ic_glow');
          else self.toast('Version ' + U.info.name + ' is ready (updated ' + U.when(U.info.built) + '). Tap the row again to ' + U.verb() + ' it.', 'ic_glow');
        }, true);
      } };
    },

    // ================================================================ save and load
    openGraphics: function () {
      var self = this, display = LC.Display;
      function back() { return { icon: 'ic_door', label: 'Back to pause menu', action: function () { self.openPause(); } }; }
      this.openMenu({
        title: 'Graphics', footer: 'Changes are saved on this device. Actual FPS depends on your screen and device.',
        tabs: [
          { label: 'Quality', rows: function () {
            return Object.keys(display.presets).map(function (quality) {
              var choice = display.presets[quality];
              return { icon: 'ic_fullscr', label: choice.label, sub: choice.desc, right: display.quality === quality ? 'Selected' : '',
                action: function () { display.setQuality(quality); LC.Audio.sfx('click'); } };
            }).concat(back());
          } },
          { label: 'Frame rate', rows: function () {
            return display.rates.map(function (fps) {
              return { icon: 'ic_play', label: fps + ' FPS', sub: fps === 60 ? 'Default frame-rate limit.' : '',
                right: display.fps === fps ? 'Selected' : '', action: function () { display.setFps(fps); LC.Audio.sfx('click'); } };
            }).concat(back());
          } }
        ]
      });
    },

    openSaves: function (mode) {
      var self = this, saving = mode === 'save';
      // v2.7.7: "are you sure?" is a dialog with buttons (it was "press again to confirm"); Cancel comes back here
      function ask(q, yes, fn) {
        self.say([{ text: q }], { choices: [{ label: yes, fn: fn }, { label: 'Cancel', fn: function () { self.time.delayedCall(60, function () { self.openSaves(mode); }); } }] });
      }
      this.openMenu({
        title: saving ? 'Save Game' : 'Load Game',
        footer: function () {
          return saving ? 'Your farm also saves itself every night, and whenever you leave the game (into the slot you are playing).'
            : LC.Net.isHost() ? 'Loading sends everyone back to the loaded farm. Your friends keep their own bags.' : 'Anything since your last save is lost when you load.';
        },
        tabs: [{ label: saving ? 'Save' : 'Load', rows: function () {
          var rows = [];
          for (var n = 1; n <= LC.SAVE_SLOTS; n++) (function (n) {
            var info = LC.State.slotInfo(n), cur = n === LC.State.slot, txt = info ? LC.State.slotText(info) : 'Empty slot';
            if (saving) rows.push({ icon: cur ? 'ic_sun' : info ? 'ic_bond' : 'ic_moon', label: 'Slot ' + n + (cur ? '  (this farm)' : ''), sub: txt, right: 'Save',
              action: function () {
                function save() {
                  var ok = LC.State.saveTo(n);
                  if (ok && LC.Net.isHost()) LC.Net.broadcast({ t: 'saved', by: LC.Net.myName });
                  self.toast(ok ? 'Saved to slot ' + n + '.' : 'Could not save: browser storage is blocked.', 'ic_bond');
                }
                if (info && !cur) { ask('Slot ' + n + ' has another farm in it (' + txt + '). Save over it?', 'Save over it', save); return; }
                save();
                return 'close';
              } });
            else rows.push({ icon: cur ? 'ic_sun' : info ? 'ic_bond' : 'ic_moon', label: 'Slot ' + n + (cur ? '  (this farm)' : ''), sub: txt, right: info ? 'Load' : '',
              enabled: !!info, why: 'This slot is empty.',
              action: function () {
                ask('Load slot ' + n + ' (' + txt + ')? ' + (LC.Net.isHost() ? 'Everyone goes back to the loaded farm.' : 'Anything since your last save is lost.'), 'Load it', function () { self.loadSlot(n); });
              } });
          })(n);
          return rows;
        } }]
      });
    },
    loadSlot: function (n) {
      var self = this, N = LC.Net, W = this.world;
      if (N.isGuest()) return;
      this.closeModal();
      if (!LC.State.load(n)) { this.toast('Could not load that save.', 'ic_moon'); LC.Audio.sfx('error'); return; }
      this.S = LC.State.s;
      LC.followPid = 'me';
      LC.Audio.sfx('chime');
      W.leaving = true;
      W.cameras.main.fadeOut(450, 0, 0, 0);
      W.cameras.main.once('camerafadeoutcomplete', function () {
        if (N.isHost()) N.broadcast({ t: 'reload', world: LC.State.snapshot(), by: N.myName });
        W.scene.restart({ loaded: n });
      });
    }
  });
})(window.LC);
