/* UI: HUD, hotbar, toasts, dialogue, menus (shop / cook / spirit house / bag / pause) and the day summary.
 * Owns all discrete keyboard input; the World only polls movement keys. */
window.LC = window.LC || {};
(function () {
  'use strict';
  var ACCEPT = { KeyE: 1, Space: 1, Enter: 1 };

  LC.UIScene = class extends Phaser.Scene {
    constructor() { super('UI'); }

    create() {
      var self = this;
      this.ready = false;
      this.world = this.scene.get('World');
      this.S = LC.State.s;
      this.modal = null; this.toasts = []; this.lastPrompt = null; this.lastBright = null;
      this.pins = []; this.modalCs = []; this.safe = { l: 0, t: 0, r: 0, b: 0 };
      this.buildHUD();
      this.buildHotbar();
      this.buildTouch();
      this.buildSkills();   // v1.6: Sumpahan Batu and Restu Ibu beside the hotbar (UISettings.js)
      this.layout();
      this.scale.on('resize', this.layout, this);
      this.game.events.on('lc-safearea', this.layout, this);
      this.events.once('shutdown', function () {
        self.scale.off('resize', self.layout, self);
        self.game.events.off('lc-safearea', self.layout, self);
      });
      this.input.keyboard.on('keydown', this.onKey, this);
      this.input.keyboard.addCapture('TAB,SPACE,UP,DOWN,LEFT,RIGHT');
      this.input.on('wheel', function (p, objs, dx, dy) {
        if (self.modal) { if (self.modal.wheel) self.modal.wheel(dy); return; }
        self.selectSlot((self.S.sel + (dy > 0 ? 1 : 8)) % 9);
      });
      this.input.on('pointerdown', function (p, over) {
        LC.Audio.init();
        if (over && over.some(function (o) { return o.isTouchBtn; })) return;   // on-screen buttons handle themselves
        if (self.modal && self.modal.click) self.modal.click();
      });
      this.ready = true;
      this.time.delayedCall(4000, function () { LC.Update.remind(); });   // v1.7.1: a newer version on GitHub?

      if (!this.S.flags.introDone) {
        this.time.delayedCall(800, function () {
          self.say(LC.TEXT.intro, { onDone: function () {
            self.S.flags.introDone = true;
            self.toast('Select the Nasi (slot 3), face the spirit house and press ' + (self.touchOn ? 'USE.' : 'E.'), 'i_nasi');
          } });
        });
      } else if (!this.S.guest) {
        this.time.delayedCall(600, function () { self.toast('Welcome back! Day ' + self.S.day + ', ' + LC.State.weekday() + '.', 'ic_sun'); });
      }
      if (LC.Net.isHost()) this.time.delayedCall(1300, function () { self.toast('Your farm is open! Friends join with code ' + LC.Net.code + ' (also shown in the pause menu).', 'ic_joy'); });
      if (LC.Net.isGuest()) this.time.delayedCall(700, function () { self.toast('You joined ' + LC.Net.hostName + '\'s farm! The fields and Pelita are shared; your bag is your own.', 'ic_joy'); });
    }

    // ================================================================ co-op HUD: status badge + name tags over friends
    updateCoopUI() {
      var N = LC.Net, W = this.world, self = this, s = '';
      if (N.isHost()) s = 'Co-op  ·  code ' + N.code + '  ·  ' + N.count() + '/' + N.MAX + ' players';
      else if (N.isGuest()) s = 'On ' + N.hostName + '\'s farm  ·  ' + N.count() + '/' + N.MAX + ' players';
      if (s !== this.lastCoop) { this.tCoop.setText(s); this.lastCoop = s; }
      var cam = W.cameras.main, seen = {};
      Object.keys(W.remote || {}).forEach(function (id) {
        var r = W.remote[id], t = self.nameTags[id];
        seen[id] = 1;
        if (!t) t = self.nameTags[id] = self.txt(0, 0, '', 13, '#fffdf2', { ox: 0.5, oy: 1, stroke: 4 }).setDepth(-1);   // under the HUD
        var col = LC.Art.OUTFIT_COLORS[r.color || 0];
        if (t.text !== (r.name || '')) t.setText(r.name || '');
        if (t.lastCol !== col) { t.setColor(col); t.lastCol = col; }
        var sx = (r.spr.x - cam.worldView.x) * cam.zoom, sy = (r.spr.y - 17 - cam.worldView.y) * cam.zoom;
        var onScreen = cam.worldView.contains(r.spr.x, r.spr.y - 8);
        t.setPosition(Math.round(sx), Math.round(sy)).setVisible(onScreen && !W.sleeping);
      });
      Object.keys(this.nameTags).forEach(function (id) { if (!seen[id]) { self.nameTags[id].destroy(); delete self.nameTags[id]; } });
    }
    inviteFriends() {
      var self = this;
      LC.Lobby.open({ hostOnly: true, onHosted: function (code) {
        self.world.bindNet();
        self.toast('Your farm is open! Friends join with code ' + code + '.', 'ic_joy');
      } });
    }

    isBlocking() { return !!this.modal; }

    // ================================================================ helpers
    txt(x, y, s, size, color, o) {
      o = o || {};
      var style = { fontFamily: LC.FONT, fontSize: size + 'px', color: color || '#fbecc8', stroke: '#1a120c', strokeThickness: o.stroke || 0, lineSpacing: o.ls || 2, align: o.align || 'left' };
      if (o.wrap) style.wordWrap = { width: o.wrap, useAdvancedWrap: true };
      return this.add.text(x, y, s, style).setOrigin(o.ox || 0, o.oy || 0);
    }
    panel(g, x, y, w, h) {
      g.fillStyle(0x1e1510, 0.93); g.fillRoundedRect(x, y, w, h, 8);
      g.lineStyle(3, 0xd9a94e, 1); g.strokeRoundedRect(x + 1.5, y + 1.5, w - 3, h - 3, 8);
      g.lineStyle(1, 0x7a5a2e, 1); g.strokeRoundedRect(x + 6, y + 6, w - 12, h - 12, 5);
      [[x + 7, y + 7], [x + w - 7, y + 7], [x + 7, y + h - 7], [x + w - 7, y + h - 7]].forEach(function (p) {
        g.fillStyle(0xf2c94c, 1);
        g.fillTriangle(p[0], p[1] - 4, p[0] + 4, p[1], p[0], p[1] + 4);
        g.fillTriangle(p[0], p[1] - 4, p[0] - 4, p[1], p[0], p[1] + 4);
      });
    }
    // ================================================================ screen layout
    // Everything is laid out on the original 960 x 640 design, then each group is pinned to a screen edge
    // (tl, tc, tr, bl, bc, br) and shifted to wherever that edge is on the current screen size, minus the safe
    // area (camera notches). Menus and dialogs are containers kept in the centre.
    pin(anchor, objs) {
      var self = this;
      objs.forEach(function (o) { self.pins.push({ o: o, a: anchor, x: o.x, y: o.y }); });
    }
    anchorOff(a) {
      var W = this.scale.width, H = this.scale.height, s = this.safe;
      var cx = Math.round((W - 960) / 2), r = W - 960 - s.r, b = H - 640 - s.b;
      return a === 'tl' ? { x: s.l, y: s.t } : a === 'tc' ? { x: cx, y: s.t } : a === 'tr' ? { x: r, y: s.t }
        : a === 'bl' ? { x: s.l, y: b } : a === 'bc' ? { x: cx, y: b } : { x: r, y: b };
    }
    layout() {
      var self = this;
      this.safe = LC.safeArea();
      this.pins.forEach(function (p) { var o = self.anchorOff(p.a); p.o.setPosition(p.x + o.x, p.y + o.y); });
      this.tBtns.forEach(function (b) {
        var o = self.anchorOff(b.a);
        b.x = b.bx + o.x; b.y = b.by + o.y;
        b.t.setPosition(b.x, b.y); b.hit.setPosition(b.x, b.y);
      });
      var bl = this.anchorOff('bl');
      this.stickHome = { x: 110 + bl.x, y: 520 + bl.y };
      this.toastX = 16 + this.safe.l;
      this.modalCs = this.modalCs.filter(function (c) { return c.scene; });
      this.modalCs.forEach(function (c) { self.placeModal(c); });
      if (this.modal && this.modal.render) this.modal.render();   // e.g. the pause menu's Fullscreen: On/Off
    }
    toastBaseY() { return (this.touchOn ? 410 : 540) + this.anchorOff('bl').y; }
    // A container for a menu or dialog, kept centred (or bottom-centred) on any screen size. The optional shade is
    // oversized so it always covers the whole screen.
    modalC(depth, shade, alpha, bottom) {
      var c = this.add.container(0, 0).setDepth(depth);
      c.bottom = !!bottom;
      if (shade !== undefined) c.add(this.add.rectangle(-2000, -2000, 6000, 6000, shade, alpha).setOrigin(0).setInteractive());
      this.modalCs.push(c);
      this.placeModal(c);
      return c;
    }
    placeModal(c) {
      var W = this.scale.width, H = this.scale.height;
      c.setPosition(Math.round((W - 960) / 2), c.bottom ? H - 640 - this.safe.b : Math.round((H - 640) / 2));
    }

    bar(g, x, y, w, h, frac, color) {
      frac = Math.max(0, Math.min(1, frac));
      g.fillStyle(0x000000, 0.55); g.fillRect(x, y, w, h);
      g.fillStyle(color, 1); g.fillRect(x + 1, y + 1, (w - 2) * frac, h - 2);
      g.fillStyle(0xffffff, 0.22); g.fillRect(x + 1, y + 1, (w - 2) * frac, Math.max(1, Math.floor(h / 3)));
    }

    // ================================================================ HUD
    buildHUD() {
      var g = this.hudG = this.add.graphics();
      this.panel(g, 12, 12, 262, 140);
      this.tDay = this.txt(28, 22, '', 20);
      this.icTime = this.add.image(42, 66, 'ic_sun').setScale(2);
      this.tTime = this.txt(62, 52, '', 24, '#ffd166');
      var icCoin = this.add.image(180, 66, 'ic_coin').setScale(2);
      this.tCoin = this.txt(198, 52, '', 24, '#f7dd8a');
      var icEnergy = this.add.image(42, 101, 'ic_energy').setScale(2);
      // v1.5: the season, and your strength (or your health, in dangerous places)
      this.icSeason = this.add.image(42, 129, 'ic_s_menanam').setScale(2);
      this.tSeason = this.txt(58, 119, '', 15, '#9be15d');
      this.icStr = this.add.image(170, 129, 'ic_str').setScale(2);
      this.tStr = this.txt(184, 119, '', 15, '#f7dd8a');
      this.tGoal = this.txt(16, 160, '', 15, '#fbecc8', { wrap: 330, stroke: 4 });
      this.gfxL = this.add.graphics();
      this.pin('tl', [g, this.tDay, this.icTime, this.tTime, icCoin, this.tCoin, icEnergy, this.icSeason, this.tSeason, this.icStr, this.tStr, this.tGoal, this.gfxL]);

      var px = this.PX = 960 - 286, py = this.PY = 12;
      var pg = this.add.graphics();
      this.panel(pg, px, py, 274, 212);
      pg.fillStyle(0x3b2f5c, 1); pg.fillCircle(px + 50, py + 68, 38);
      pg.lineStyle(2, 0xb8a8ff, 0.8); pg.strokeCircle(px + 50, py + 68, 38);
      this.portrait = this.add.image(px + 50, py + 66, 'ghost_0_normal').setScale(3);
      var tName = this.txt(px + 100, py + 14, 'Pelita', 22, '#e8dcff');
      this.tStage = this.txt(px + 100, py + 42, '', 14, '#b8a8ff');
      var self = this;
      var needIcons = ['ic_full', 'ic_joy', 'ic_glow'].map(function (k, i) { return self.add.image(px + 114, py + 74 + i * 25, k).setScale(2); });
      this.tBond = this.txt(px + 20, py + 146, '', 13, '#f7dd8a');
      this.tCrave = this.txt(px + 20, py + 180, '', 15, '#fbecc8');
      this.icCrave = this.add.image(px + 238, py + 186, 'i_nasi').setScale(2);
      this.gfx = this.add.graphics();
      this.pin('tr', [pg, this.portrait, tName, this.tStage].concat(needIcons, [this.tBond, this.tCrave, this.icCrave, this.gfx]));
      this.tCoop = this.txt(480, 50, '', 14, '#b8f0c8', { ox: 0.5, stroke: 4 });
      this.pin('tc', [this.tCoop]);
      this.nameTags = {};
    }

    buildHotbar() {
      var self = this;
      this.hotG = this.add.graphics();
      this.slotUI = [];
      var x0 = 240, y = 580;
      for (var i = 0; i < 9; i++) {
        (function (i) {
          var x = x0 + i * 54;
          var icon = self.add.image(x + 24, y + 24, 'i_hoe').setScale(2);
          var cnt = self.txt(x + 46, y + 47, '', 14, '#ffffff', { stroke: 3, ox: 1, oy: 1 });
          var num = self.txt(x + 4, y + 2, String(i + 1), 11, '#a08a6a');
          var z = self.add.zone(x, y, 48, 48).setOrigin(0).setInteractive({ useHandCursor: true });
          z.on('pointerdown', function () { if (!self.modal) self.selectSlot(i); });
          self.slotUI.push({ x: x, y: y, icon: icon, cnt: cnt });
          self.pin('bc', [icon, cnt, num, z]);
        })(i);
      }
      this.tPrompt = this.txt(480, 566, '', 18, '#fffdf2', { stroke: 5, ox: 0.5, oy: 1 });
      this.pin('bc', [this.hotG, this.tPrompt]);
    }

    // ================================================================ touch controls (Android / touchscreens)
    buildTouch() {
      var self = this, pref = null;
      try { pref = localStorage.getItem('littleCreature.touch'); } catch (e) { /* ignore */ }
      this.touchOn = pref ? pref === 'on' : !!(this.sys.game.device.input.touch || LC.PLATFORM === 'android');
      this.input.addPointer(2);
      this.stick = { id: -1, bx: 0, by: 0, x: 0, y: 0 };
      this.stickG = this.add.graphics().setDepth(70);
      this.tBtns = [];
      function btn(x, y, r, label, code, always) {
        var b = { x: x, y: y, bx: x, by: y, a: always ? 'tc' : 'br', r: r, code: code, always: always, down: false, label: label };
        b.g = self.add.graphics().setDepth(always ? 110 : 70);
        b.t = self.txt(x, y, label, r > 30 ? 18 : 13, '#fffdf2', { ox: 0.5, oy: 0.5, stroke: 3 }).setDepth(always ? 111 : 71);
        b.hit = self.add.circle(x, y, r + 6, 0xffffff, 0.001).setDepth(always ? 112 : 72).setInteractive({ useHandCursor: true });
        b.hit.isTouchBtn = true;
        b.hit.on('pointerdown', function () { b.down = true; self.pressKey(code); });
        b.hit.on('pointerup', function () { b.down = false; });
        b.hit.on('pointerout', function () { b.down = false; });
        self.tBtns.push(b);
        return b;
      }
      this.btnUse = btn(872, 486, 46, 'USE', 'KeyE');
      this.btnEat = btn(786, 566, 28, 'EAT', 'KeyX');
      this.btnBag = btn(888, 594, 28, 'BAG', 'Tab');
      this.btnMenu = btn(480, 26, 18, 'II', 'Escape', true);
      this.btnMap = btn(528, 26, 18, 'MAP', 'KeyM', true);
      this.btnMap.touchOnly = true;

      this.input.on('pointerdown', function (p, over) {
        if (!self.touchOn || self.modal || self.world.sleeping || self.stick.id !== -1) return;
        if (over && over.length) return;                 // tapped a button, hotbar slot, etc.
        if (p.x < self.scale.width * 0.45 && p.y > 210) { var s = self.stick; s.id = p.id; s.bx = s.x = p.x; s.by = s.y = p.y; }
      });
      this.input.on('pointermove', function (p) {
        var s = self.stick;
        if (p.id !== s.id) return;
        s.x = p.x; s.y = p.y;
        var dx = s.x - s.bx, dy = s.y - s.by, d = Math.hypot(dx, dy), R = 56;
        if (d > R) { s.bx = s.x - dx / d * R; s.by = s.y - dy / d * R; }   // floating stick follows the thumb
      });
      this.input.on('pointerup', function (p) { if (p.id === self.stick.id) self.stick.id = -1; });
    }
    pressKey(code) { this.onKey({ code: code, preventDefault: function () {} }); }
    touchVec() {
      var s = this.stick;
      if (!this.touchOn || s.id === -1 || this.modal) return null;
      var dx = s.x - s.bx, dy = s.y - s.by, d = Math.hypot(dx, dy);
      if (d < 8) return { x: 0, y: 0 };
      var m = Math.min(1, d / 56);
      return { x: dx / d * m, y: dy / d * m };
    }
    setTouch(on) {
      this.touchOn = on; this.stick.id = -1;
      try { localStorage.setItem('littleCreature.touch', on ? 'on' : 'off'); } catch (e) { /* ignore */ }
    }
    drawTouch() {
      var g = this.stickG, s = this.stick, show = this.touchOn && !this.modal && !this.world.sleeping;
      if (this.modal || !this.touchOn) s.id = -1;
      g.clear();
      if (show) {
        var bx = s.id === -1 ? this.stickHome.x : s.bx, by = s.id === -1 ? this.stickHome.y : s.by;
        g.fillStyle(0x1e1510, s.id === -1 ? 0.25 : 0.45); g.fillCircle(bx, by, 58);
        g.lineStyle(2, 0xd9a94e, s.id === -1 ? 0.35 : 0.8); g.strokeCircle(bx, by, 58);
        var kx = s.id === -1 ? bx : s.x, ky = s.id === -1 ? by : s.y;
        var dx = kx - bx, dy = ky - by, d = Math.hypot(dx, dy);
        if (d > 56) { kx = bx + dx / d * 56; ky = by + dy / d * 56; }
        g.fillStyle(0xf2d06b, s.id === -1 ? 0.3 : 0.85); g.fillCircle(kx, ky, 24);
      }
      var bright = this.lastBright, modal = !!this.modal, touch = this.touchOn;
      this.tBtns.forEach(function (b) {
        var vis = (b.always && !(b.touchOnly && (!touch || modal))) || show;
        b.g.clear(); b.t.setVisible(vis); b.hit.setVisible(vis);
        if (!vis) return;
        var hot = b.code === 'KeyE' && bright;
        b.g.fillStyle(hot ? 0x5a4024 : 0x1e1510, b.down ? 0.95 : 0.7); b.g.fillCircle(b.x, b.y, b.r);
        b.g.lineStyle(hot ? 3 : 2, hot ? 0xffd166 : 0xd9a94e, 0.95); b.g.strokeCircle(b.x, b.y, b.r);
        if (b.always && !b.touchOnly) b.t.setText(modal ? 'X' : 'II');
      });
    }

    drawHotbar() {
      var g = this.hotG, S = this.S;
      g.clear();
      g.fillStyle(0x1e1510, 0.85); g.fillRoundedRect(232, 572, 496, 64, 10);
      g.lineStyle(2, 0x8a6a3a, 1); g.strokeRoundedRect(232, 572, 496, 64, 10);
      this.slotUI.forEach(function (s, i) {
        var sl = S.inv[i], on = i === S.sel;
        g.fillStyle(on ? 0x5a4024 : 0x2e2219, 1); g.fillRoundedRect(s.x, s.y, 48, 48, 6);
        g.lineStyle(on ? 3 : 1, on ? 0xffd166 : 0x6a5034, 1); g.strokeRoundedRect(s.x, s.y, 48, 48, 6);
        if (sl) {
          s.icon.setVisible(true).setTexture(LC.ITEMS[sl.id].icon);
          s.cnt.setText(sl.n > 1 ? String(sl.n) : '');
          if (sl.id === 'can') {
            g.fillStyle(0x000000, 0.7); g.fillRect(s.x + 6, s.y + 40, 36, 5);
            g.fillStyle(0x6fb2dc, 1); g.fillRect(s.x + 7, s.y + 41, 34 * S.water / S.maxWater, 3);
          }
        } else { s.icon.setVisible(false); s.cnt.setText(''); }
      });
    }

    goalText() {
      var S = this.S, f = S.flags, g = S.ghost, pre = LC.State.isHGN() ? 'Hungry Ghost Night! All bond x2.\n' : '';
      var t;
      if (S.guest) {
        var gb = LC.State.nextStageBond();
        return pre + 'Co-op on ' + LC.Net.hostName + '\'s farm. ' + (gb === null ? 'Pelita is the Guardian of the Kampung!' : 'Help Pelita grow: ' + Math.floor(g.bond) + ' / ' + gb + ' bond.');
      }
      var E = this.touchOn ? 'USE' : 'E';
      if (!f.fedOnce) t = 'Offer Nenek\'s Nasi to Pelita: select it, face the spirit house and press ' + E + '.';
      else if (!f.incense) t = 'Light the Colok: face the spirit house and press ' + E + ' to open its menu.';
      else if (!f.tilled) t = 'Till the soil in the fenced field with the Cangkul (slot 1).';
      else if (!f.planted) t = 'Plant seeds in your tilled soil.';
      else if (!f.watered) t = 'Fill the Gembor at the well, then water your seeds.';
      else if (!f.slept) t = 'When you are done for the day, sleep in the house.';
      else if (!f.harvested) t = 'Water your crops each day until they are ready to harvest.';
      else if (!f.cooked) t = 'Cook a dish at the dapur. Cooked food fills Pelita far more.';
      else if (!f.metAni) t = 'Visit Mak Ani\'s warung on the east road to sell and buy.';
      else if ((S.quests.ch2 || 0) >= 1 && LC.ch2Goal && LC.ch2Goal()) t = LC.ch2Goal();   // v2.7.1: an open chapter comes before the kampung's optional tasks (they come back afterwards)
      else if (LC.State.isOpen('kampung') && !S.visited.kampung) t = 'The road east is open! Visit Kampung Tepian and meet the villagers.';
      else if (S.visited.kampung && !LC.State.count('joran') && !f.fished) t = 'Visit Pak Mat at the kampung jetty to learn fishing.';
      else if (S.visited.kampung && !f.lahHen) t = 'Meet Pak Lah in Kampung Tepian. He has a gift for Nenek\'s empty reban.';
      else if (S.visited.kampung && !Object.keys(S.buildings).length) t = 'Help rebuild the kampung: ask Tukang Leong, then build a house on an empty plot.';
      else if (LC.ch2Goal && LC.ch2Goal()) t = LC.ch2Goal();   // v1.9: Chapter 2
      else {
        var lv = LC.State.level(), nl = LC.State.nextLevelBond(), r = LC.LEVEL_REWARDS[lv + 1] || {};
        var what = r.unlock ? ' to open ' + LC.AREAS[r.unlock].name : r.stage ? ' to evolve' : '';
        t = nl === null ? 'Pelita is a Legend of the Kampung! Befriend every spirit and help every neighbour.' : 'Pelita Lv ' + lv + ': ' + Math.floor(g.bond) + ' / ' + nl + ' bond for Lv ' + (lv + 1) + what + '. Care for Pelita and help the villagers.';
      }
      if (LC.State.isPesta() && S.minutes < LC.PESTA_CLOSE) pre += 'Pesta day! Contests at the pavilion in Kampung Tepian.\n';
      return pre + 'Goal: ' + t;
    }

    update(time) {
      if (!this.ready) return;
      var S = this.S, g = S.ghost, gf = this.gfx, self = this;
      var m = Math.floor(S.minutes / 10) * 10, h = Math.floor(m / 60) % 24, mm = m % 60, ap = h < 12 ? 'AM' : 'PM', h12 = h % 12 || 12;
      this.tTime.setText(h12 + ':' + (mm < 10 ? '0' : '') + mm + ' ' + ap);
      this.icTime.setTexture(S.minutes >= 18 * 60 ? 'ic_moon' : 'ic_sun');
      var hgn = LC.State.isHGN();
      var dayStr = 'Day ' + S.day + ' · ' + LC.State.weekday();
      if (dayStr !== this.lastDayStr) { this.tDay.setText(dayStr).setColor(hgn ? '#ff8a7a' : '#fbecc8'); this.lastDayStr = dayStr; }
      this.tCoin.setText(String(S.kepeng));
      this.tGoal.setText(this.goalText());

      gf.clear(); this.gfxL.clear();
      this.bar(this.gfxL, 60, 95, 196, 12, S.energy / S.maxEnergy, S.energy < 20 ? 0xe76f51 : 0x9be15d);
      var sea = LC.State.season(), danger = !!(this.world.A && this.world.A.enemies) || S.hp < S.maxHp;
      if (sea !== this.lastSeason) { this.icSeason.setTexture(sea.icon); this.tSeason.setText(sea.name.replace('Musim ', '').replace('-buahan', '') + ' ' + LC.State.seasonDay() + '/7').setColor(sea.color); this.lastSeason = sea; this.lastSeasonDay = -1; }
      if (LC.State.seasonDay() !== this.lastSeasonDay) { this.lastSeasonDay = LC.State.seasonDay(); this.tSeason.setText(sea.name.replace('Musim ', '').replace('-buahan', '') + ' ' + this.lastSeasonDay + '/7'); }
      this.icStr.setTexture(danger ? 'ic_hp' : 'ic_str');
      if (danger) { this.tStr.setText(''); this.bar(this.gfxL, 184, 123, 72, 12, S.hp / S.maxHp, S.hp < S.maxHp * 0.3 ? 0xe76f51 : 0xff5a6a); }
      else this.tStr.setText('Str ' + Math.floor(S.str || 0));
      var px = this.PX, py = this.PY;
      this.bar(gf, px + 132, py + 68, 124, 12, g.full / 100, g.full < 25 ? 0xe76f51 : 0xf2d06b);
      this.bar(gf, px + 132, py + 93, 124, 12, g.joy / 100, g.joy < 20 ? 0xe76f51 : 0xff7aa8);
      this.bar(gf, px + 132, py + 118, 124, 12, g.glow / 100, g.glow < 20 ? 0xe76f51 : 0xb8a8ff);
      var lv = LC.State.level(), nb = LC.State.nextLevelBond(), pb = LC.LEVELS[lv - 1];
      this.bar(gf, px + 20, py + 164, 234, 7, nb === null ? 1 : (g.bond - pb) / (nb - pb), 0xffd166);
      this.portrait.setTexture(LC.ghostTex(g.stage, this.world.curExpr || 'normal'));
      this.tStage.setText('Lv ' + lv + ' · ' + LC.STAGES[g.stage].short);
      this.tBond.setText(nb === null ? 'Bond ' + Math.floor(g.bond) + '  (max level)' : 'Bond ' + Math.floor(g.bond) + ' / ' + nb + '  (Lv ' + (lv + 1) + ')');
      if (g.stage === 0) { this.tCrave.setText('Craving: ???'); this.icCrave.setVisible(false); }
      else if (g.cravingDone) { this.tCrave.setText('Craving: satisfied!'); this.icCrave.setVisible(false); }
      else { this.tCrave.setText('Craving: ' + LC.ITEMS[g.craving].name); this.icCrave.setVisible(true).setTexture('i_' + g.craving); }

      this.drawHotbar();
      this.drawTouch();
      this.drawSkills();
      this.updateFloats();
      this.updateCoopUI();

      // toasts (lifted above the thumb-stick in touch mode)
      var y = this.toastBaseY(), tx = this.toastX, now = this.time.now, dm = this.modal;
      if (dm && dm.type === 'dialog' && dm.c && dm.c.scene) y = Math.min(y, dm.c.y + dm.top - 8);   // v2.7.7: above a dialog, never behind it
      this.toasts = this.toasts.filter(function (c) {
        if (!c.dying && now - c.born > 4200) {
          c.dying = true;
          self.tweens.add({ targets: c, alpha: 0, duration: 300, onComplete: function () { c.destroy(); } });
        }
        return !c.dying || c.alpha > 0.02;
      });
      this.toasts.forEach(function (c) {
        if (c.dying) return;
        y -= c.h + 4;
        c.y += (y - c.y) * 0.35;
        c.x = tx;
      });
    }

    setPrompt(label) {
      if (!this.ready) return;
      var s = '', bright = false;
      if (this.modal) s = '';
      else if (label) { s = (this.touchOn ? '' : '[E] ') + label; bright = true; }
      else if (this.S.riding) s = (this.S.riding === 'naga' ? 'Riding Naga Kecil' : 'Riding the basikal') + (this.touchOn ? '  (select it and press USE to get off)' : '   ·   R to get off');
      else {
        var sl = LC.State.selItem();
        if (sl) {
          var it = LC.ITEMS[sl.id];
          s = it.name + (sl.id === 'can' ? '  (' + this.S.water + '/' + this.S.maxWater + ' water)' : it.food ? '    [X] eat' : '');
        }
      }
      if (s !== this.lastPrompt) { this.tPrompt.setText(s); this.lastPrompt = s; }
      if (bright !== this.lastBright) { this.tPrompt.setColor(bright ? '#fffdf2' : '#b8a890'); this.lastBright = bright; }
    }

    toast(msg, icon) {
      if (!this.ready) return;
      var now = this.time.now;
      for (var i = 0; i < this.toasts.length; i++) {
        var o = this.toasts[i];
        if (!o.dying && o.msg === msg) { o.born = now; o.setScale(1.04); this.tweens.add({ targets: o, scale: 1, duration: 140 }); return; }
      }
      var hasIcon = icon && this.textures.exists(icon);
      var c = this.add.container(this.toastX, this.toastBaseY()).setDepth(80);
      var t = this.txt(hasIcon ? 48 : 12, 0, msg, 16, '#fffdf2', { wrap: 470 });
      var h = Math.max(hasIcon ? 38 : 28, t.height + 12), w = (hasIcon ? 60 : 24) + t.width;
      var bg = this.add.graphics();
      bg.fillStyle(0x1e1510, 0.9); bg.fillRoundedRect(0, 0, w, h, 6);
      bg.lineStyle(1, 0x8a6a3a, 1); bg.strokeRoundedRect(0, 0, w, h, 6);
      t.setY(Math.round((h - t.height) / 2));
      c.add([bg, t]);
      if (hasIcon) c.add(this.add.image(25, h / 2, icon).setScale(2));
      c.h = h; c.born = now; c.msg = msg;
      c.setAlpha(0);
      this.tweens.add({ targets: c, alpha: 1, duration: 150 });
      this.toasts.unshift(c);
      while (this.toasts.length > 5) this.toasts.pop().destroy();
    }

    // ================================================================ input
    selectSlot(i) { this.S.sel = i; LC.Audio.sfx('click'); }
    nextTool() {
      var S = this.S;
      for (var k = 1; k <= 9; k++) {
        var j = (S.sel + k) % 9, sl = S.inv[j];
        if (sl && LC.ITEMS[sl.id].kind === 'tool') { this.selectSlot(j); return; }
      }
    }
    onKey(ev) {
      var code = ev.code;
      LC.Audio.init();
      if (this.modal) { this.modal.key(code, ev); return; }
      if (this.world.sleeping) return;
      if (ACCEPT[code]) { this.world.doAction(); return; }
      if (/^Digit[1-9]$/.test(code)) { this.selectSlot(parseInt(code.slice(5), 10) - 1); return; }
      switch (code) {
        case 'KeyQ': this.nextTool(); break;
        case 'Tab': case 'KeyI': this.openInventory(); break;
        case 'KeyN': this.toast('Music ' + (LC.Audio.toggleMusic() ? 'on' : 'off'), 'ic_glow'); break;
        case 'KeyM': this.openMap(); break;
        case 'KeyG': if (LC.State.count('cermin_mata') || LC.State.wearing('glasses')) this.world.toggleGlasses(); break;
        case 'KeyX': this.world.eat(); break;
        case 'KeyF': if (LC.canFullscreen()) LC.toggleFullscreen(); break;
        case 'KeyJ': this.openJournal(); break;
        case 'KeyR': this.world.toggleRide(); break;
        case 'KeyV': this.world.castStone(); break;
        case 'Escape': this.openPause(); break;
      }
    }

    closeModal() { if (this.modal) { var m = this.modal; this.modal = null; m.close(); } }

    // ================================================================ dialogue
    say(lines, opts) {
      opts = opts || {};
      var self = this, S = this.S;
      lines = lines.map(function (l) { return typeof l === 'string' ? { text: l } : l; });
      this.closeModal();
      var c = this.modalC(100, undefined, 0, true);
      // v2.7.7: the box grows upward to fit the longest line (and the choice buttons), so text never runs into anything
      var LX = 60, BW = 840, BOT = 590, CH = 48, CG = 10;
      var bg = this.add.graphics(); c.add(bg);
      var pg = this.add.graphics(); c.add(pg);
      var por = this.add.image(140, 510, 'ghost_0_normal').setScale(4); c.add(por);
      var name = this.txt(90, 448, '', 20, '#ffd166');
      var body = this.txt(90, 476, '', 19, '#fbecc8', { ls: 5, wrap: 770 });
      var hint = this.txt(LX + BW - 16, BOT - 8, '>>', 16, '#ffd166', { ox: 1, oy: 1 });
      var cg = this.add.graphics();
      var meas = this.txt(0, 0, '', 19, '#fbecc8').setVisible(false);
      c.add([name, body, hint, cg, meas]);
      this.tweens.add({ targets: hint, alpha: 0.25, duration: 420, yoyo: true, repeat: -1 });
      var idx = -1, full = '', shown = 0, typing = false, cIdx = 0, choiceT = [], tx = 90, ww = 770, top = 430, bodyY = 0;
      var m;
      function frame(L) { return L.portrait ? { tx: 218, ww: 650 } : { tx: 90, ww: 770 }; }
      // the choices as buttons, each as wide as its words, wrapping onto a new row when they don't fit
      function layChoices(x0, w0) {
        var out = [], x = x0, row = 0;
        (opts.choices || []).forEach(function (ch) {
          meas.setText(ch.label || '');
          var w = Math.min(w0, Math.max(130, Math.ceil(meas.width) + 44));
          if (x > x0 && x + w > x0 + w0) { x = x0; row++; }
          out.push({ x: x, row: row, w: w }); x += w + 12;
        });
        out.rows = out.length ? row + 1 : 0;
        return out;
      }
      function choicesH(lay) { return lay.rows ? 16 + lay.rows * CH + (lay.rows - 1) * CG : 0; }
      // how tall the box must be for line i (its name, all of its words, and the buttons after the last line)
      function needH(i) {
        var L = lines[i], f = frame(L);
        body.setWordWrapWidth(f.ww, true).setText(L.text || '');
        var h = (L.name ? 50 : 32) + body.height;
        if (i === lines.length - 1 && opts.choices) h += choicesH(layChoices(f.tx, f.ww));
        body.setText('');
        return Math.max(160, Math.ceil(h) + 24);
      }
      var boxH = Math.max.apply(null, lines.map(function (l, i) { return needH(i); }));
      top = BOT - boxH;
      bg.fillStyle(0x1e1510, 1); bg.fillRoundedRect(LX, top, BW, boxH, 8);   // (solid: nothing behind it shows through)
      this.panel(bg, LX, top, BW, boxH);
      function next() {
        idx++;
        if (idx >= lines.length) { finish(); return; }
        var L = lines[idx], hasP = !!L.portrait, f = frame(L);
        if (opts.onLine) opts.onLine(idx);   // v2.5: a scene can react to a line as it appears
        pg.clear(); por.setVisible(hasP);
        tx = f.tx; ww = f.ww;
        if (hasP) {
          pg.fillStyle(0x3b2f5c, 1); pg.fillRoundedRect(84, top + 22, 112, 116, 8);
          por.setTexture(L.portrait === 'ghost' ? LC.ghostTex(S.ghost.stage, L.expr || 'normal') : L.portrait);
          por.setScale(Math.min(4, 104 / por.frame.width, 108 / por.frame.height)).setPosition(140, top + 80);   // (v2.6: a big portrait, like a dragon, fits its frame)
        }
        name.setPosition(tx, top + 18).setText(L.name || '');
        bodyY = top + (L.name ? 50 : 32);
        body.setPosition(tx, bodyY); body.setWordWrapWidth(ww, true);
        full = L.text || ''; shown = 0; typing = true; body.setText('');
        hint.setVisible(false);
      }
      var timer = this.time.addEvent({ delay: 16, loop: true, callback: function () {
        if (!typing) return;
        shown = Math.min(full.length, shown + 2);
        body.setText(full.substr(0, shown));
        if (shown >= full.length) { typing = false; lineDone(); }
      } });
      function lineDone() {
        hint.setVisible(true);
        if (idx === lines.length - 1 && opts.choices) showChoices();
      }
      function showChoices() {
        hint.setVisible(false);
        var lay = layChoices(tx, ww), y0 = Math.max(bodyY + body.height + 16, BOT - 24 - choicesH(lay) + 16);
        choiceT = opts.choices.map(function (ch, k) {
          var p = lay[k], y = y0 + p.row * (CH + CG);
          var t = self.txt(p.x + p.w / 2, y + CH / 2, ch.label || '', 19, '#fbecc8', { ox: 0.5, oy: 0.5 });
          if (t.width > p.w - 16) t.setFontSize('16px');
          var z = self.add.zone(p.x, y, p.w, CH).setOrigin(0).setInteractive({ useHandCursor: true });
          z.on('pointerover', function () { if (cIdx !== k) { cIdx = k; renderChoices(); } });
          z.on('pointerdown', function () { pick(k); });
          c.add([t, z]);
          return { t: t, x: p.x, y: y, w: p.w };
        });
        renderChoices();
      }
      function renderChoices() {
        cg.clear();
        choiceT.forEach(function (o, k) {
          var on = k === cIdx;
          cg.fillStyle(on ? 0x6a4a1c : 0x2e2219, 1); cg.fillRoundedRect(o.x, o.y, o.w, CH, 10);
          cg.lineStyle(on ? 3 : 2, on ? 0xffd166 : 0x8a6a4a, 1); cg.strokeRoundedRect(o.x, o.y, o.w, CH, 10);
          o.t.setColor(on ? '#ffd166' : '#fbecc8');
        });
      }
      function advance() {
        if (typing) { shown = full.length; body.setText(full); typing = false; lineDone(); return; }
        if (choiceT.length) { pick(cIdx); return; }
        LC.Audio.sfx('click'); next();
      }
      function pick(k) { var ch = opts.choices[k]; close(); LC.Audio.sfx('click'); if (ch.fn) ch.fn(); }
      function finish() { close(); if (opts.onDone) opts.onDone(); }
      function close() { timer.remove(); c.destroy(); if (self.modal === m) self.modal = null; }
      m = {
        type: 'dialog', opened: this.time.now, close: close, c: c, top: top,   // (top: toasts stay above the box)
        key: function (code) {
          var dg = /^(Digit|Numpad)([1-9])$/.exec(code);
          if (dg && choiceT.length && +dg[2] <= choiceT.length) { pick(+dg[2] - 1); return; }   // 1, 2, 3... pick a button
          if (ACCEPT[code]) advance();
          else if (choiceT.length && /Arrow(Left|Up)|Key[AW]/.test(code)) { cIdx = (cIdx + choiceT.length - 1) % choiceT.length; renderChoices(); }
          else if (choiceT.length && /Arrow(Right|Down)|Key[DS]/.test(code)) { cIdx = (cIdx + 1) % choiceT.length; renderChoices(); }
          else if (code === 'Escape') { if (choiceT.length) pick(choiceT.length - 1); else finish(); }
        },
        click: function () { if (self.time.now - m.opened < 250 || choiceT.length) return; advance(); }
      };
      this.modal = m;
      next();
    }

    confirmSleep(stay) {   // stay (v2.7.1): sleep away from home, e.g. the guest house in Barunai, and wake up there
      var self = this, N = LC.Net, early = this.S.minutes < 18 * 60;
      if (N.isGuest()) {
        this.say([{ text: 'Only ' + N.hostName + ' (the host) can end the day. On a shared farm everyone sleeps together.' }],
          { choices: [{ label: 'Tell them I\'m sleepy', fn: function () { N.send({ t: 'sleepy' }); self.toast('You let ' + N.hostName + ' know you\'re sleepy.', 'ic_moon'); } }, { label: 'Keep playing' }] });
        return;
      }
      var friends = N.isHost() ? N.count() - 1 : 0;
      var q = friends ? 'End the day for everyone? (' + friends + ' friend' + (friends > 1 ? 's are' : ' is') + ' on your farm.)'
        : stay ? (early ? 'It\'s still early. Sleep in ' + stay.name + ' anyway, and wake up here tomorrow?' : 'Sleep in ' + stay.name + ', and wake up here tomorrow?')
        : early ? 'It\'s still early. Go to sleep and end the day anyway?' : 'Climb the tangga and go to sleep?';
      var lines = stay && stay.text ? [{ text: stay.text }, { text: q }] : [{ text: q }];
      this.say(lines, { choices: [{ label: 'Sleep', fn: function () { self.world.sleep(false, stay); } }, { label: 'Not yet' }] });
    }

    // a big tappable scroll button (v1.8): x, y, height; up or down; fn on tap. show(visible, active) dims it at the end.
    scrollBtn(c, x, y, h, upward, fn) {
      var w = 58, g = this.add.graphics(), t = this.txt(x + w / 2, upward ? y + h - 22 : y + 8, 'more', 13, '#ffd166', { ox: 0.5 });
      var z = this.add.zone(x - 6, y - 6, w + 12, h + 12).setOrigin(0).setInteractive({ useHandCursor: true });
      g.fillStyle(0x2b1f17, 0.95); g.fillRoundedRect(x, y, w, h, 10);
      g.lineStyle(2, 0xffd166, 1); g.strokeRoundedRect(x, y, w, h, 10);
      var cx = x + w / 2, ty = upward ? y + 18 : y + h - 18;
      g.fillStyle(0xffd166, 1);
      if (upward) g.fillTriangle(cx - 16, ty + 14, cx + 16, ty + 14, cx, ty - 6); else g.fillTriangle(cx - 16, ty - 14, cx + 16, ty - 14, cx, ty + 6);
      z.on('pointerdown', fn);
      c.add([g, t, z]);
      return { show: function (vis, on) { g.setVisible(vis).setAlpha(on ? 1 : 0.3); t.setVisible(vis).setAlpha(on ? 1 : 0.3); if (z.input) z.input.enabled = vis; } };
    }
    // v2.7.7: a big X in a panel's top-right corner (x, y: the panel's right edge and top), easy to hit with a thumb;
    // the small X at the top of the screen still works too
    closeX(c, right, y, fn) {
      var s = 48, x = right - s - 10, g = this.add.graphics(), self = this;
      y += 10;
      function draw(hot) {
        g.clear();
        g.fillStyle(hot ? 0x7a3226 : 0x4a2a1e, 1); g.fillRoundedRect(x, y, s, s, 10);
        g.lineStyle(2, hot ? 0xffd166 : 0xd9a94e, 1); g.strokeRoundedRect(x, y, s, s, 10);
        g.lineStyle(5, 0xfbecc8, 1); g.lineBetween(x + 15, y + 15, x + s - 15, y + s - 15); g.lineBetween(x + s - 15, y + 15, x + 15, y + s - 15);
      }
      draw(false);
      var z = this.add.zone(x - 10, y - 10, s + 20, s + 20).setOrigin(0).setInteractive({ useHandCursor: true });
      z.on('pointerover', function () { draw(true); });
      z.on('pointerout', function () { draw(false); });
      z.on('pointerdown', function () { LC.Audio.sfx('click'); fn.call(self); });
      c.add([g, z]);
      return z;
    }

    // ================================================================ list menus
    openMenu(cfg) {
      this.closeModal();
      // v1.8.1: roomier cards (5 to a page) whose text always fits: a long description shrinks, then is shortened
      var self = this, S = this.S, tab = cfg.tab > 0 && cfg.tab < cfg.tabs.length ? cfg.tab : 0, sel = 0, scroll = 0, VIS = 5, m;   // (v2.8: cfg.tab, the tab to start on)
      var X = 90, Y = 46, Wd = 780, Hd = 578, RH = 84;
      var c = this.modalC(90, 0x000000, 0.45);
      var bg = this.add.graphics(); this.panel(bg, X, Y, Wd, Hd); c.add(bg);
      c.add(this.txt(X + Wd / 2, Y + 16, cfg.title, 28, '#ffd166', { ox: 0.5 }));
      var coinT = null;
      if (cfg.coins) { c.add(this.add.image(X + Wd - 182, Y + 34, 'ic_coin').setScale(2)); coinT = this.txt(X + Wd - 164, Y + 21, '', 22, '#f7dd8a'); c.add(coinT); }
      this.closeX(c, X + Wd, Y, function () { if (self.modal === m) m.key('Escape'); });   // v2.7.7
      var tabs = cfg.tabs, tabT = [], listY = Y + 66;
      if (tabs.length > 1) {
        listY = Y + 96;
        tabs.forEach(function (tb, k) {
          var tw = Math.min(150, (Wd - 50) / tabs.length);
          var t = self.txt(X + (tabs.length > 3 ? 26 : 36) + k * tw, Y + 60, tb.label, tabs.length > 3 ? 17 : 20, '#cdb8a0').setInteractive({ useHandCursor: true });
          t.on('pointerdown', function () { tab = k; sel = 0; scroll = 0; LC.Audio.sfx('click'); render(); });
          c.add(t); tabT.push(t);
        });
      }
      var rg = this.add.graphics(); c.add(rg);
      var rowsUI = [];
      function cur() { return tabs[tab].rows(); }
      for (var r = 0; r < VIS; r++) {
        (function (r) {
          var y = listY + r * RH;
          var ic = self.add.image(X + 52, y + RH / 2 - 3, 'i_hoe').setScale(2);
          var lb = self.txt(X + 84, y + 8, '', 18, '#fbecc8');
          var sb = self.txt(X + 84, y + 32, '', 13, '#b8a890', { wrap: Wd - 260 });
          var rt = self.txt(X + Wd - 36, y + RH / 2 - 14, '', 18, '#f7dd8a', { ox: 1 });
          var z = self.add.zone(X + 20, y, Wd - 40, RH - 6).setOrigin(0).setInteractive({ useHandCursor: true });
          z.on('pointerover', function () { if (scroll + r < cur().length && sel !== scroll + r) { sel = scroll + r; render(); } });
          z.on('pointerdown', function () { if (scroll + r < cur().length) { sel = scroll + r; activate(); } });
          c.add([ic, lb, sb, rt, z]);
          rowsUI.push({ y: y, ic: ic, lb: lb, sb: sb, rt: rt });
        })(r);
      }
      // v1.8: big "more" buttons beside the list (easy to tap on a phone); each tap turns a page
      var up = this.scrollBtn(c, X + Wd + 8, listY, 2 * RH - 6, true, function () { if (scroll > 0) { scroll = Math.max(0, scroll - (VIS - 1)); sel = scroll; LC.Audio.sfx('click'); render(); } });
      var dn = this.scrollBtn(c, X + Wd + 8, listY + (VIS - 2) * RH, 2 * RH - 6, false, function () { var n = cur().length; if (scroll + VIS < n) { scroll = Math.min(n - VIS, scroll + VIS - 1); sel = scroll; LC.Audio.sfx('click'); render(); } });
      var empty = this.txt(X + Wd / 2, listY + 110, '', 18, '#a08a6a', { ox: 0.5, wrap: Wd - 100, align: 'center' });
      var foot = this.txt(X + Wd / 2, Y + Hd - 56, '', 14, '#cdb8a0', { ox: 0.5, wrap: Wd - 90, align: 'center' });
      var keys = this.txt(X + Wd / 2, Y + Hd - 22, this.touchOn ? 'Tap a row to choose' + (tabs.length > 1 ? '  ·  tap a tab to switch' : '') + '  ·  X to close'
        : 'W/S choose  ·  E select' + (tabs.length > 1 ? '  ·  A/D switch tab' : '') + '  ·  Esc close', 12, '#8a7a6a', { ox: 0.5 });
      c.add([empty, foot, keys]);

      // a title shrinks so it never runs into the price on the right; a description gets up to three lines
      function fitLabel(o, s, rtW) {
        var max = Wd - 124 - (rtW ? rtW + 20 : 0);
        o.lb.setFontSize('18px').setText(s);
        if (o.lb.width > max) o.lb.setFontSize('16px');
        if (o.lb.width > max) o.lb.setFontSize('14px');
      }
      function fitSub(o, s) {
        var avail = RH - 6 - 32 - 4;
        o.sb.setFontSize('13px').setLineSpacing(2).setText(s);
        if (o.sb.height > avail) o.sb.setFontSize('12px').setLineSpacing(0);
        if (o.sb.height > avail) o.sb.setFontSize('11px');
        if (o.sb.height > avail) { var w = s.split(' '); while (w.length > 1 && o.sb.height > avail) { w.pop(); o.sb.setText(w.join(' ') + '...'); } }
      }
      function render() {
        var list = cur();
        if (sel >= list.length) sel = Math.max(0, list.length - 1);
        if (sel < scroll) scroll = sel;
        if (sel >= scroll + VIS) scroll = sel - VIS + 1;
        scroll = Math.max(0, Math.min(scroll, list.length - VIS));
        rg.clear();
        rowsUI.forEach(function (o, r) {
          var it = list[scroll + r];
          if (!it) { o.ic.setVisible(false); o.lb.setText(''); o.sb.setText(''); o.rt.setText(''); return; }
          var on = scroll + r === sel, dis = it.enabled === false;
          rg.fillStyle(on ? 0x4a3520 : 0x2b1f17, 1); rg.fillRoundedRect(X + 20, o.y, Wd - 40, RH - 6, 8);
          if (on) { rg.lineStyle(2, 0xffd166, 1); rg.strokeRoundedRect(X + 20, o.y, Wd - 40, RH - 6, 8); }
          o.ic.setVisible(!!it.icon); if (it.icon) { o.ic.setTexture(it.icon); var fw = o.ic.frame.width, fh = o.ic.frame.height; o.ic.setScale(it.iconScale || Math.min(2, 40 / fw, 40 / fh)).setAlpha(dis ? 0.45 : 1); }   // (v2.6: big pictures, like the dragons, fit the row)
          o.rt.setText(it.right || '').setColor(dis ? '#7a6a5a' : '#f7dd8a');
          fitLabel(o, it.label || '', it.right ? o.rt.width : 0);
          o.lb.setColor(dis ? '#7a6a5a' : '#fbecc8');
          fitSub(o, it.sub || '');
        });
        var long = list.length > VIS;
        up.show(long, scroll > 0); dn.show(long, scroll + VIS < list.length);
        tabT.forEach(function (t, k) { t.setColor(k === tab ? '#ffd166' : '#8a7a6a').setText(k === tab && tabs.length <= 5 ? '[ ' + tabs[k].label + ' ]' : tabs[k].label); });
        empty.setText(list.length ? '' : (tabs[tab].empty || 'Nothing here.'));
        if (coinT) coinT.setText(String(S.kepeng));
        foot.setText(typeof cfg.footer === 'function' ? cfg.footer() : (cfg.footer || ''));
      }
      // v2.7.5: a shop row with qty: { id, price, buy(n)? } asks how many first (- and +, ±10, Max), then buys them all
      var qo = null;
      function openQty(it) {
        var q = it.qty, n = 1, PW = 500, PH = 300, PX = X + (Wd - PW) / 2, PY = Y + (Hd - PH) / 2;
        function max() { return Math.max(1, Math.min(99, Math.floor(S.kepeng / q.price), LC.State.room(q.id))); }
        var qc = self.add.container(0, 0); c.add(qc);
        var dim = self.add.graphics(); dim.fillStyle(0x000000, 0.55); dim.fillRect(X, Y, Wd, Hd); qc.add(dim);
        qc.add(self.add.zone(X, Y, Wd, Hd).setOrigin(0).setInteractive());   // (the rows underneath can't be clicked)
        var g = self.add.graphics(); self.panel(g, PX, PY, PW, PH); qc.add(g);
        var bg2 = self.add.graphics(); qc.add(bg2);
        var ic = self.add.image(PX + 50, PY + 50, LC.ITEMS[q.id].icon); ic.setScale(Math.min(3, 48 / ic.frame.width)); qc.add(ic);
        qc.add(self.txt(PX + 92, PY + 26, LC.ITEMS[q.id].name, 24, '#ffd166'));
        qc.add(self.txt(PX + 92, PY + 58, q.price + ' k each  ·  How many?', 16, '#cdb8a0'));
        var numT = self.txt(PX + PW / 2, PY + 104, '1', 40, '#fbecc8', { ox: 0.5 }); qc.add(numT);
        var totT = self.txt(PX + PW / 2, PY + 160, '', 17, '#f7dd8a', { ox: 0.5 }); qc.add(totT);
                function btn(x, y, w, h, label, fn, hot) {
          bg2.fillStyle(hot ? 0x6a4a1c : 0x3a2a1e, 1); bg2.fillRoundedRect(x, y, w, h, 8);
          bg2.lineStyle(2, hot ? 0xffd166 : 0x8a6a4a, 1); bg2.strokeRoundedRect(x, y, w, h, 8);
          qc.add(self.txt(x + w / 2, y + h / 2 - 11, label, 20, hot ? '#ffd166' : '#fbecc8', { ox: 0.5 }));
          var z = self.add.zone(x, y, w, h).setOrigin(0).setInteractive({ useHandCursor: true });
          z.on('pointerdown', fn); qc.add(z);
        }
        function show() {
          n = Phaser.Math.Clamp(n, 1, max());
          numT.setText(String(n));
          totT.setText('Total: ' + n * q.price + ' k   ·   you have ' + S.kepeng + ' k' + (n >= max() ? '   (most you can buy)' : ''));
        }
        function add(d) { n += d; LC.Audio.sfx('click'); show(); }
        function buy() {
          var k = Phaser.Math.Clamp(n, 1, max());
          if (S.kepeng < k * q.price || !LC.State.room(q.id)) { LC.Audio.sfx('error'); return; }
          if (q.buy) q.buy(k); else { S.kepeng -= k * q.price; LC.State.add(q.id, k); LC.Audio.sfx('buy'); }
          self.toast('You bought ' + (k > 1 ? k + ' x ' : 'a ') + LC.ITEMS[q.id].name + ' for ' + k * q.price + ' k.', LC.ITEMS[q.id].icon);
          shut();
        }
        function shut() { qc.destroy(); qo = null; render(); }
        var by = PY + 92, cx = PX + PW / 2;
        btn(cx - 214, by, 66, 52, '-10', function () { add(-10); });
        btn(cx - 140, by, 62, 52, '-', function () { add(-1); });
        btn(cx + 78, by, 62, 52, '+', function () { add(1); });
        btn(cx + 148, by, 66, 52, '+10', function () { add(10); });
        btn(cx - 214, PY + 200, 130, 52, 'Max', function () { n = max(); LC.Audio.sfx('click'); show(); });
        btn(cx - 70, PY + 200, 140, 52, 'Buy', buy, true);
        btn(cx + 84, PY + 200, 130, 52, 'Back', function () { LC.Audio.sfx('click'); shut(); });
        qc.add(self.txt(cx, PY + PH - 28, self.touchOn ? 'Tap - and + to choose how many' : 'A/D -1 +1  ·  W/S +10 -10  ·  E buy  ·  Esc back', 12, '#8a7a6a', { ox: 0.5 }));
        qo = {
          key: function (code) {
            if (code === 'Escape' || code === 'Tab') { LC.Audio.sfx('click'); shut(); }
            else if (code === 'ArrowLeft' || code === 'KeyA') add(-1);
            else if (code === 'ArrowRight' || code === 'KeyD') add(1);
            else if (code === 'ArrowUp' || code === 'KeyW') add(10);
            else if (code === 'ArrowDown' || code === 'KeyS') add(-10);
            else if (ACCEPT[code]) buy();
          },
          wheel: function (dy) { add(dy > 0 ? -1 : 1); }
        };
        show();
        LC.Audio.sfx('click');
      }
      function activate() {
        var it = cur()[sel];
        if (!it) return;
        if (it.enabled === false) { LC.Audio.sfx('error'); if (it.why) self.toast(it.why); return; }
        if (it.qty) { openQty(it); return; }
        if (!it.action) return;
        var res = it.action();
        if (self.modal !== m) return;
        if (res === 'close') { close(); return; }
        render();
      }
      function close() { c.destroy(); if (self.modal === m) self.modal = null; }
      m = {
        type: 'menu', close: close, render: render,
        key: function (code) {
          if (qo) { qo.key(code); return; }   // v2.7.5: the quantity picker is open
          var n = cur().length;
          if (code === 'Escape' || code === 'Tab') { close(); return; }
          if (code === 'ArrowUp' || code === 'KeyW') { sel = Math.max(0, sel - 1); LC.Audio.sfx('click'); }
          else if (code === 'ArrowDown' || code === 'KeyS') { sel = Math.min(Math.max(0, n - 1), sel + 1); LC.Audio.sfx('click'); }
          else if ((code === 'ArrowLeft' || code === 'KeyA') && tabs.length > 1) { tab = (tab + tabs.length - 1) % tabs.length; sel = 0; scroll = 0; LC.Audio.sfx('click'); }
          else if ((code === 'ArrowRight' || code === 'KeyD') && tabs.length > 1) { tab = (tab + 1) % tabs.length; sel = 0; scroll = 0; LC.Audio.sfx('click'); }
          else if (ACCEPT[code]) { activate(); return; }
          render();
        },
        wheel: function (dy) { if (qo) { qo.wheel(dy); return; } var n = cur().length; sel = Phaser.Math.Clamp(sel + (dy > 0 ? 1 : -1), 0, Math.max(0, n - 1)); render(); }
      };
      this.modal = m;
      render();
      LC.Audio.sfx('click');
    }

    // v2.7.3: a grid of tiles (the pause menu). Each tile shows a picture, a name and, for a switch, its setting
    // ("Music: On" -> "Music" / "On"); the chosen tile's description is in the box under the grid.
    // cfg: { title, footer, rows: fn -> [{ icon, label, sub, action, right, enabled, why }] } (or tabs[0].rows)
    openGrid(cfg) {
      this.closeModal();
      var self = this, sel = 0, top = 0, m;
      var X = 90, Y = 46, Wd = 780, Hd = 578, COLS = 4, MAXR = 5, GAP = 10, VG = 8;
      var TW = (Wd - 40 - (COLS - 1) * GAP) / COLS, AX = X + 20, AY = Y + 62, DY = Y + Hd - 104, DH = 58, AH = DY - 8 - AY;
      var rowsFn = cfg.rows || cfg.tabs[0].rows;
      function list() { return rowsFn(); }
      var c = this.modalC(90, 0x000000, 0.45);
      var bg = this.add.graphics(); this.panel(bg, X, Y, Wd, Hd); c.add(bg);
      c.add(this.txt(X + Wd / 2, Y + 16, cfg.title, 28, '#ffd166', { ox: 0.5 }));
      this.closeX(c, X + Wd, Y, function () { if (self.modal === m) m.key('Escape'); });   // v2.7.7
      var tg = this.add.graphics(); c.add(tg);
      var tiles = [];
      for (var i = 0; i < COLS * MAXR; i++) (function (k) {
        var t = { ic: self.add.image(0, 0, 'i_hoe'), lb: self.txt(0, 0, '', 15, '#fbecc8', { ox: 0.5, align: 'center' }),
          vl: self.txt(0, 0, '', 13, '#f7dd8a', { ox: 0.5 }), bd: self.txt(0, 0, '', 11, '#1e1510', { ox: 0.5, oy: 0.5 }),
          z: self.add.zone(0, 0, TW, 80).setOrigin(0).setInteractive({ useHandCursor: true }) };
        t.z.on('pointerover', function () { if (top + k < list().length && sel !== top + k) { sel = top + k; render(); } });
        t.z.on('pointerdown', function () { if (top + k < list().length) { sel = top + k; activate(); } });
        c.add([t.ic, t.lb, t.vl, t.bd, t.z]); tiles.push(t);
      })(i);
      var dg = this.add.graphics(); c.add(dg);
      var dl = this.txt(X + 36, DY + 6, '', 15, '#ffd166');
      var ds = this.txt(X + 36, DY + 26, '', 13, '#b8a890', { wrap: Wd - 72 });
      var foot = this.txt(X + Wd / 2, Y + Hd - 40, '', 12, '#cdb8a0', { ox: 0.5, wrap: Wd - 90, align: 'center' });
      var keys = this.txt(X + Wd / 2, Y + Hd - 20, this.touchOn ? 'Tap a tile to choose  ·  X to close' : 'WASD / Arrows choose  ·  E select  ·  Esc close', 12, '#8a7a6a', { ox: 0.5 });
      c.add([dl, ds, foot, keys]);
      // more than 20 tiles: page up / down beside the grid (as in the list menus)
      var up = this.scrollBtn(c, X + Wd + 8, AY, 150, true, function () { sel = Math.max(0, sel - COLS * (MAXR - 1)); LC.Audio.sfx('click'); render(); });
      var dn = this.scrollBtn(c, X + Wd + 8, DY - 158, 150, false, function () { sel = Math.min(list().length - 1, sel + COLS * (MAXR - 1)); LC.Audio.sfx('click'); render(); });

      function split(s) { var k = s.indexOf(':'); return k > 0 ? [s.slice(0, k), s.slice(k + 1).trim()] : [s, '']; }
      function valColor(v) { return v === 'On' ? '#a8e08a' : v === 'Off' ? '#9a8a7a' : v === 'Gentle' ? '#a8d8ea' : '#f7dd8a'; }
      function fitSub(s) {
        ds.setFontSize('13px').setText(s);
        if (ds.height > DH - 26) ds.setFontSize('12px');
        if (ds.height > DH - 26) { var w = s.split(' '); while (w.length > 1 && ds.height > DH - 26) { w.pop(); ds.setText(w.join(' ') + '...'); } }
      }
      function render() {
        var L = list(), n = L.length;
        if (sel >= n) sel = Math.max(0, n - 1);
        var rows = Math.max(1, Math.min(MAXR, Math.ceil(n / COLS))), vis = rows * COLS;
        if (sel < top) top = sel - sel % COLS;
        if (sel >= top + vis) top = (Math.floor(sel / COLS) - rows + 1) * COLS;
        top = Math.max(0, Math.min(top, Math.ceil(n / COLS) * COLS - vis));
        // fewer tiles: taller tiles, and the grid sits in the middle of its space
        var TH = Math.min(92, Math.floor((AH - (rows - 1) * VG) / rows)), oy = AY + Math.floor((AH - rows * TH - (rows - 1) * VG) / 2);
        tg.clear();
        tiles.forEach(function (t, k) {
          var it = L[top + k], show = !!it && k < vis;
          t.ic.setVisible(show && !!(it && it.icon)); t.lb.setVisible(show); t.vl.setVisible(show); t.bd.setVisible(show && !!(it && it.right));
          if (t.z.input) t.z.input.enabled = show;
          if (!show) return;
          var x = AX + (k % COLS) * (TW + GAP), y = oy + Math.floor(k / COLS) * (TH + VG), on = top + k === sel, dis = it.enabled === false;
          tg.fillStyle(on ? 0x4a3520 : 0x2b1f17, 1); tg.fillRoundedRect(x, y, TW, TH, 10);
          if (on) { tg.lineStyle(2, 0xffd166, 1); tg.strokeRoundedRect(x, y, TW, TH, 10); }
          t.z.setPosition(x, y).setSize(TW, TH);
          var p = split(it.label || ''), cy = y + TH / 2;
          t.lb.setWordWrapWidth(null).setFontSize('15px').setText(p[0]).setColor(dis ? '#7a6a5a' : '#fbecc8');
          if (t.lb.width > TW - 14) t.lb.setFontSize('13px');
          if (t.lb.width > TW - 14) t.lb.setWordWrapWidth(TW - 14, true);
          var two = t.lb.height > 22, iy = p[1] ? cy - 16 : two ? cy - 20 : cy - 10, ly = p[1] ? cy + 4 : two ? cy - 1 : cy + 10;
          if (it.icon) { t.ic.setTexture(it.icon); var fw = t.ic.frame.width, fh = t.ic.frame.height; t.ic.setScale(it.iconScale || Math.max(1, Math.round((TH >= 84 ? 36 : 26) / Math.max(fw, fh)))).setPosition(x + TW / 2, iy - (TH >= 84 ? 3 : 0)).setAlpha(dis ? 0.45 : 1); }
          t.lb.setPosition(x + TW / 2, ly);
          t.vl.setText(p[1]).setColor(dis ? '#7a6a5a' : valColor(p[1])).setPosition(x + TW / 2, cy + 21);
          if (it.right) {
            t.bd.setText(it.right); var bw = t.bd.width + 12;
            tg.fillStyle(0xffd166, 1); tg.fillRoundedRect(x + TW - 8 - bw, y + 7, bw, 16, 6);
            t.bd.setPosition(x + TW - 8 - bw / 2, y + 15);
          }
        });
        var long = n > vis;
        up.show(long, top > 0); dn.show(long, top + vis < n);
        var cur = L[sel];
        dg.clear(); dg.fillStyle(0x2b1f17, 1); dg.fillRoundedRect(X + 20, DY, Wd - 40, DH, 8);
        dl.setText(cur ? (cur.label || '') + (cur.right ? '   (' + cur.right + ')' : '') : '');
        fitSub(cur ? cur.sub || '' : '');
        foot.setText(typeof cfg.footer === 'function' ? cfg.footer() : (cfg.footer || ''));
      }
      function activate() {
        var it = list()[sel];
        if (!it) return;
        if (it.enabled === false) { LC.Audio.sfx('error'); if (it.why) self.toast(it.why); return; }
        if (!it.action) return;
        var res = it.action();
        if (self.modal !== m) return;
        if (res === 'close') { close(); return; }
        render();
      }
      function close() { c.destroy(); if (self.modal === m) self.modal = null; }
      m = {
        type: 'menu', grid: true, close: close, render: render,
        sel: function (k) { if (k !== undefined) { sel = k; render(); } return sel; },
        key: function (code) {
          var n = list().length;
          if (code === 'Escape' || code === 'Tab') { close(); return; }
          if (code === 'ArrowUp' || code === 'KeyW') { if (sel - COLS >= 0) sel -= COLS; }
          else if (code === 'ArrowDown' || code === 'KeyS') { if (sel + COLS < n) sel += COLS; else if (Math.floor(sel / COLS) < Math.floor((n - 1) / COLS)) sel = n - 1; }
          else if (code === 'ArrowLeft' || code === 'KeyA') sel = Math.max(0, sel - 1);
          else if (code === 'ArrowRight' || code === 'KeyD') sel = Math.min(Math.max(0, n - 1), sel + 1);
          else if (ACCEPT[code]) { activate(); return; }
          else return;
          LC.Audio.sfx('click'); render();
        },
        wheel: function (dy) { var n = list().length; sel = Phaser.Math.Clamp(sel + (dy > 0 ? 1 : -1), 0, Math.max(0, n - 1)); render(); }
      };
      this.modal = m;
      render();
      LC.Audio.sfx('click');
    }

    ingText(inp) {
      return Object.keys(inp).map(function (id) { return inp[id] + ' ' + LC.State.ingName(id) + ' (have ' + LC.State.count(id) + ')'; }).join('  +  ');
    }

    openShop() {
      var self = this, S = this.S;
      if (!this.world.shopOpen()) { this.say([{ name: 'Warung', text: 'The shutters are down. A hand-painted sign reads: "BUKA 7 PAGI - 8 MALAM" (Open 7 AM to 8 PM).' }]); return; }
      if (!S.flags.metAni) { S.flags.metAni = true; this.say(LC.TEXT.makAniFirst, { onDone: function () { self.openShop(); } }); return; }
      var tip = LC.TEXT.makAniTips[Math.floor(Math.random() * LC.TEXT.makAniTips.length)];
      var sea = LC.State.season(), big = LC.State.level() >= 10, seedOff = sea.id === 'menanam' ? 0.8 : 1;
      var stock = LC.SHOP.concat(LC.SHOP_SEASON[sea.id] || [], big ? LC.SHOP_LV10 : [], Object.keys(LC.SHOP_LEVEL || {}));   // (v2.7.5: SHOP_LEVEL, things that come with Pelita's level)
      if (big && !S.flags.warungBig) { S.flags.warungBig = true; tip = 'Welcome to my new stall! Chests, compost, ais kacang... and I pay you 10% more now. Business is good, thanks to you!'; }
      this.openMenu({
        title: big ? 'Mak Ani\'s Kedai Runcit' : 'Mak Ani\'s Warung', coins: true, footer: 'Mak Ani: "' + tip + '"  (' + sea.name + (seedOff < 1 ? ': seeds 20% off!' : '') + ')',
        tabs: [
          { label: 'Buy', rows: function () {
            return stock.map(function (id) {
              var it = LC.ITEMS[id], price = Math.round(it.price * (it.kind === 'seed' ? seedOff : 1)), afford = S.kepeng >= price, room = LC.State.canAdd(id);
              var tag = (LC.SHOP_SEASON[sea.id] || []).indexOf(id) >= 0 ? '  (in season)' : big && LC.SHOP_LV10.indexOf(id) >= 0 ? '  (new stall)' : '';
              var lvNeed = (LC.SHOP_LEVEL || {})[id], lvOk = !lvNeed || LC.State.level() >= lvNeed, owned = it.one && LC.State.owns(id);
              if (lvNeed) tag = lvOk ? '  (new)' : '  (at Pelita Lv ' + lvNeed + ')';
              return { icon: it.icon, label: it.name + (owned ? '  (yours)' : tag), sub: it.desc, right: price + ' k', enabled: afford && room && lvOk && !owned,
                why: !lvOk ? 'Mak Ani will stock it once Pelita reaches Lv ' + lvNeed + '.' : owned ? 'You already have one!' : afford ? 'Your bag is full!' : 'Not enough kepeng.',
                action: it.one ? function () { S.kepeng -= price; LC.State.add(id, 1); LC.Audio.sfx('buy'); self.toast('The ' + it.name + ' is yours! ' + (it.got || ''), it.icon); } : null,
                qty: it.one ? null : { id: id, price: price } };   // v2.7.5: choose how many
            });
          } },
          { label: 'Sell', empty: 'Nothing to sell yet. Bring crops, fruit, flowers, eggs or cooking (or a farm animal)!', rows: function () {
            var seen = {}, rows = [];
            S.inv.forEach(function (sl) {
              if (!sl || seen[sl.id]) return;
              var it = LC.ITEMS[sl.id]; if (!it.sell) return;
              seen[sl.id] = 1;
              var price = big ? Math.round(it.sell * 1.1) : it.sell;
              rows.push({ icon: it.icon, label: it.name + '  x' + LC.State.count(sl.id), sub: it.desc, right: '+' + price + ' k',
                action: function () { LC.State.remove(sl.id, 1); S.kepeng += price; S.stats.earned += price; LC.Audio.sfx('coin'); } });
            });
            return rows.concat(self.animalSellRows('ani'));   // v2.3.2: your chickens and other farm animals
          } }
        ]
      });
    }

    openCook() {
      var self = this, S = this.S;
      this.openMenu({
        title: 'Nenek\'s Dapur', footer: 'Cooked dishes fill Pelita far more than raw crops (favourites have a heart). Eating home cooking yourself also makes you stronger.',
        tabs: [{ label: 'Craft', rows: function () {
          return LC.MAKES.filter(function (r) { return !r.when || r.when(S); }).map(function (r) {   // (v2.5: some only after their chapter)
            var it = LC.ITEMS[r.out], ok = LC.State.has(r.inp), lvOk = !r.lvl || LC.State.level() >= r.lvl;
            return { icon: it.icon, label: it.name + (lvOk ? '' : '  (Pelita Lv ' + r.lvl + ')'), sub: self.ingText(r.inp), right: 'x' + LC.State.count(r.out), enabled: ok && lvOk && LC.State.canAdd(r.out),
              why: !lvOk ? 'Needs Pelita Lv ' + r.lvl + '.' : ok ? 'Your bag is full!' : 'Missing materials.',
              action: function () { LC.State.takeAll(r.inp); LC.State.add(r.out, 1); LC.Audio.sfx('build'); self.toast('You made a ' + it.name + '!', it.icon); } };
          });
        } }, { label: 'Recipes', rows: function () {
          return LC.RECIPES.map(function (r) {
            var it = LC.ITEMS[r.out], ok = LC.State.has(r.inp), fav = LC.LOVES.indexOf(r.out) >= 0 ? '  ♥' : '', batch = (S.house || 0) >= 2 ? 5 : 1;   // v1.8: the bigger dapur
            return { icon: it.icon, label: it.name + fav, sub: self.ingText(r.inp) + (batch > 1 ? '  (cooks up to 5 at once)' : ''), right: 'x' + LC.State.count(r.out), enabled: ok && LC.State.canAdd(r.out), why: ok ? 'Your bag is full!' : 'Missing ingredients.',
              action: function () {
                var made = 0;
                while (made < batch && LC.State.has(r.inp) && LC.State.canAdd(r.out)) { LC.State.takeAll(r.inp); LC.State.add(r.out, 1); made++; }
                LC.Audio.sfx('cook'); self.world.cookFx(); S.flags.cooked = true;
                self.toast('You cooked ' + (made > 1 ? made + ' ' : '') + it.name + '!', it.icon);
              } };
          });
        } }]
      });
    }

    openSpirit() {
      var self = this, S = this.S, g = S.ghost, W = this.world;
      this.openMenu({
        title: 'Spirit House',
        footer: function () { return 'Glow ' + Math.round(g.glow) + ' / 100. Offerings keep Pelita\'s light burning. To feed it, hold food and face the house (or Pelita).'; },
        tabs: [
          { label: 'Offer', empty: 'You have no offerings. Buy colok at the warung, or craft one in the Craft tab.', rows: function () {
            var rows = [];
            if (g.stage === 0 || !W.wasFollowing) rows.push({ icon: 'ic_joy', label: 'Pet Pelita', sub: 'Gently pat the little light in the doorway.', action: function () { W.petGhost(); } });
            ['colok', 'malai', 'canang'].forEach(function (id) {
              var n = LC.State.count(id); if (!n) return;
              var it = LC.ITEMS[id];
              rows.push({ icon: it.icon, label: 'Place ' + it.name + '  x' + n, sub: it.desc + '  (+' + it.glow + ' glow)', action: function () { W.offer(id); } });
            });
            return rows;
          } },
          { label: 'Craft', rows: function () {
            return LC.CRAFTS.map(function (r) {
              var it = LC.ITEMS[r.out], ok = LC.State.has(r.inp);
              return { icon: it.icon, label: it.name, sub: self.ingText(r.inp), right: 'x' + LC.State.count(r.out), enabled: ok && LC.State.canAdd(r.out), why: ok ? 'Your bag is full!' : 'Missing flowers. Grow melati and marigold in the field.',
                action: function () { LC.State.takeAll(r.inp); LC.State.add(r.out, 1); LC.Audio.sfx('chime'); self.toast('You made a ' + it.name + '.', it.icon); } };
            });
          } },
          { label: 'Pelita', rows: function () {
            var st = g.stage, bless = ['None yet.', 'Follows you and shows its cravings.', 'Waters crops overnight when Glow is 50+.', 'Crops may grow extra fast. Finds lost kepeng.', 'Guardian of the Kampung. All blessings.'];
            var lv = LC.State.level(), nl = LC.State.nextLevelBond();
            return [
              { icon: 'ic_bond', label: 'Level ' + lv + ' of ' + LC.MAX_LEVEL + ' · Bond ' + Math.floor(g.bond) + (nl === null ? '' : ' / ' + nl), sub: nl === null ? 'Pelita is a Legend of the Kampung!' : 'Every act of care gives bond. Levels open new places, evolve Pelita and bring gifts (see the Journal, J).' },
              { icon: 'ic_full', label: 'Kenyang (fullness): ' + Math.round(g.full), sub: 'Falls through the day, twice as fast on Hungry Ghost Night. Feed it!' },
              { icon: 'ic_joy', label: 'Gembira (joy): ' + Math.round(g.joy), sub: 'Pet it, feed its favourites and meet its craving. Below 12 it sulks at home.' },
              { icon: 'ic_glow', label: 'Cahaya (glow): ' + Math.round(g.glow), sub: 'Incense, garlands and canang. Fades every night.' },
              { icon: 'i_pulut_mangga', label: 'Favourite foods', sub: 'Pulut Mangga, Kuih Pandan, Pisang Goreng, Pengat Durian, Teh O, Air Merah, Kuih Bahulu, Teh Tarik, Ais Kacang... (hearts at the dapur). Raw cili or durian? No thanks!' },
              { icon: 'ic_bond', label: LC.STAGES[st].name, sub: 'Blessing: ' + bless[st] },
              { icon: 'ic_moon', label: 'Every night', sub: 'If all three needs are 50+, Pelita sleeps content (+bond). If any is below 20... expect pranks.' }
            ];
          } },
          { label: 'Spirits', rows: function () { return self.spiritRows(true); } },
          { label: 'Paths', empty: 'Spirit paths open when Pelita reaches Lv 7.', rows: function () {
            if (LC.State.level() < 7) return [];
            return LC.AREA_ORDER.filter(function (a) { return a !== 'farm'; }).map(function (a) {
              var A = LC.AREAS[a], open = LC.State.isOpen(a), seen = !!S.visited[a];
              return { icon: open && seen ? 'ic_glow' : 'ic_moon', label: A.name, sub: !open ? 'Locked until Pelita reaches Lv ' + A.lvl + '.' : !seen ? 'Walk there once first: ' + LC.AREA_HOWTO[a] : 'Travel along Pelita\'s spirit path to ' + A.sub + '.',
                right: open && seen ? 'Go' : '', enabled: open && seen, why: !open ? 'Pelita must reach Lv ' + A.lvl + '.' : 'Visit it on foot first.',
                action: function () { W.spiritPath(a); return 'close'; } };
            });
          } }
        ]
      });
    }

    openPause() {
      var self = this;
      // v2.7.3: every tile its own picture (the rows from other files too), matched by the start of its name
      var ICONS = [['Resume', 'ic_play'], ['Journal', 'ic_book'], ['My stats', 'ic_stats'], ['Companions', 'ic_comp'], ['Save', 'ic_save'], ['Load', 'ic_load'], ['Sound', 'ic_sound'], ['Music', 'ic_note'],
        ['Touch', 'ic_phone'], ['Fullscreen', 'ic_fullscr'], ['Font', 'ic_font'], ['Update', 'ic_update'], ['Jump scares', 'ic_scare'], ['Story helper', 'ic_list'],
        ['Guide arrow', 'ic_list'], ['Controls', 'ic_pad'], ['Quit', 'ic_door'], ['Leave', 'ic_door']];
      function gridIcon(r) {
        for (var i = 0; i < ICONS.length; i++) if ((r.label || '').indexOf(ICONS[i][0]) === 0 && self.textures.exists(ICONS[i][1])) return Object.assign({}, r, { icon: ICONS[i][1] });
        return r;
      }
      this.openGrid({   // v2.7.3: tiles in a grid (was a list)
        title: 'Paused', footer: 'Your game saves automatically every night, and whenever you leave the game.',
        tabs: [{ label: 'Menu', rows: function () {
          var N = LC.Net, coop;
          if (N.isHost()) coop = [
            { icon: 'ic_joy', label: 'Invite code:  ' + N.code, sub: N.count() + '/' + N.MAX + ' players. Friends choose Play with Friends, then Join, and type this code.', action: function () { self.toast('Room code: ' + N.code, 'ic_joy'); } },
            { icon: 'ic_moon', label: 'Close farm to friends', sub: 'Friends go home with their bags. You keep playing alone.', action: function () { N.leave(); self.toast('Your farm is private again.', 'ic_moon'); return 'close'; } }
          ];
          else if (N.isGuest()) coop = [
            { icon: 'ic_moon', label: 'Leave ' + N.hostName + '\'s farm', sub: 'Go back to the title. Your bag and kepeng stay saved on this device.', action: function () { self.quitToTitle(); } }
          ];
          else coop = [
            { icon: 'ic_joy', label: 'Invite friends (co-op)', sub: 'Open this farm so friends can join from a PC or Android phone. Needs internet.', action: function () { self.inviteFriends(); return 'close'; } }
          ];
          return [
            { icon: 'ic_sun', label: 'Resume', sub: 'Back to the kampung.', action: function () { return 'close'; } },
            { icon: 'ic_bond', label: 'Journal', sub: 'Villager requests, places, spirits, fish and Pelita\'s levels. Press J anytime.', action: function () { self.openJournal(); } },
            { icon: 'ic_map', label: 'Map', sub: 'This place, and the whole land. Press M anytime' + (self.touchOn ? ' (or tap MAP).' : '.'), action: function () { self.openMap(); } },
            { icon: 'ic_stats', label: 'My stats', sub: 'Health, energy, strength, attack, speed, kepeng, Pelita\'s level, abilities and records.', action: function () { self.openStats(0); } },   // v2.8
            (function () {
              var n = self.world.companionCount ? self.world.companionCount() : 0;
              return { icon: 'ic_comp', label: 'Companions: ' + (n ? n + ' with you' : 'None'), sub: 'Who travels with you and what each one does for you. Send them home, or bring a spirit friend along.', action: function () { self.openStats(1); } };
            })()
          ].concat(coop, [
            N.isGuest() ? { icon: 'ic_bond', label: 'Save my bag', sub: 'Your bag, kepeng, strength and quests are kept on this device. ' + N.hostName + ' saves the farm itself.', action: function () { self.toast(LC.State.save() ? 'Your bag is saved.' : 'Could not save: browser storage is blocked.', 'ic_bond'); return 'close'; } }
              : { icon: 'ic_bond', label: 'Save game', sub: 'Choose a slot (1-' + LC.SAVE_SLOTS + '). You are playing slot ' + LC.State.slot + '.', action: function () { self.openSaves('save'); } },
            N.isGuest() ? null : { icon: 'ic_sun', label: 'Load game', sub: N.isHost() ? 'Load a saved farm. Your friends come along to the loaded farm.' : 'Go back to a farm saved in another slot (or this one).', action: function () { self.openSaves('load'); } },
            { icon: 'ic_glow', label: 'Sound & music', sub: 'Volume for the music, the battle music, sound effects and nature sounds.', action: function () { self.openSound(); } },
            { icon: 'ic_glow', label: 'Music: ' + (LC.Audio.musicOn ? 'On' : 'Off'), sub: 'Chill gamelan-style music (and battle drums), generated live. Press N anytime.', action: function () { LC.Audio.toggleMusic(); } },
            { icon: 'ic_joy', label: 'Touch controls: ' + (self.touchOn ? 'On' : 'Off'), sub: 'On-screen joystick and USE / EAT / BAG buttons for phones and tablets.', action: function () { self.setTouch(!self.touchOn); } },
            LC.canFullscreen() ? { icon: 'ic_sun', label: 'Fullscreen: ' + (LC.isFullscreen() ? 'On' : 'Off'), sub: 'Fill the whole screen with the kampung' + (self.touchOn ? '.' : '. Press F anytime.'), action: function () { LC.toggleFullscreen(); } } : null,
            { icon: 'ic_font', label: 'Font: ' + (LC.fontKey === 'modern' ? 'Modern' : 'Default'),   // v2.7.8
              sub: LC.fontKey === 'modern' ? 'A clean, modern font (your device\'s own). ' + (self.touchOn ? 'Tap' : 'Select') + ' to go back to the pixel font.' : 'The pixel font that matches the art. ' + (self.touchOn ? 'Tap' : 'Select') + ' for a clean, modern font instead.',
              action: function () { LC.setFont(LC.fontKey === 'modern' ? 'pixel' : 'modern'); } },
            self.updateRow(),
            LC.pauseExtraRow ? LC.pauseExtraRow.call(self) : null,   // v2.5: Pelita's daylight
            LC.pauseExtraRow2 ? LC.pauseExtraRow2.call(self) : null,   // v2.7: jump scares on or gentle
            LC.pauseExtraRow3 ? LC.pauseExtraRow3.call(self) : null,   // v2.7.1: the guide arrow on or off
            LC.pauseExtraRow4 ? LC.pauseExtraRow4.call(self) : null,   // v2.7.4: the prayer-time reminders on or off
            { icon: 'i_hoe', label: 'Controls', sub: self.touchOn ? 'Drag the left side to walk · USE to interact (and swing a weapon) · tap the stone by the hotbar for the stone curse · MAP · II pauses' : 'WASD/Arrows move · E use/swing · V stone curse · 1-9/wheel select · Q tool · X eat · R ride · G glasses · Tab bag · J journal · M map · N music · F fullscreen' },
            { icon: 'ic_moon', label: 'Quit to title', sub: LC.Net.role ? 'Also ends the co-op session.' : 'Anything since your last sleep (or save) is lost.', action: function () { self.quitToTitle(); } }
          ]).filter(Boolean).map(gridIcon);
        } }]
      });
    }
    quitToTitle() {
      this.closeModal();
      if (LC.Net.isGuest()) LC.State.save();   // keep the guest's bag
      if (LC.Net.role) LC.Net.leave();
      this.scene.stop('World');
      this.scene.start('Title');
    }

    // ================================================================ bag
    openInventory() {
      this.closeModal();
      var self = this, S = this.S, cur = S.sel, picked = -1, m;
      var c = this.modalC(90, 0x000000, 0.45);
      var X = 140, Y = 100, Wd = 680, Hd = 400;
      var bg = this.add.graphics(); this.panel(bg, X, Y, Wd, Hd); c.add(bg);
      c.add(this.txt(480, Y + 16, 'Bag', 28, '#ffd166', { ox: 0.5 }));
      this.closeX(c, X + Wd, Y, function () { if (self.modal === m) m.key('Escape'); });   // v2.7.7
      var gx0 = 480 - (9 * 60 - 6) / 2, gy0 = Y + 84;
      c.add(this.txt(gx0, gy0 - 22, 'Hotbar (1-9)', 13, '#a08a6a'));
      c.add(this.txt(gx0, gy0 + 68, 'Backpack', 13, '#a08a6a'));
      var gg = this.add.graphics(); c.add(gg);
      var cells = [];
      for (var i = 0; i < LC.INV_SIZE; i++) {
        (function (i) {
          var x = gx0 + (i % 9) * 60, y = gy0 + Math.floor(i / 9) * 90;
          var ic = self.add.image(x + 27, y + 27, 'i_hoe').setScale(2);
          var ct = self.txt(x + 50, y + 51, '', 14, '#ffffff', { stroke: 3, ox: 1, oy: 1 });
          var z = self.add.zone(x, y, 54, 54).setOrigin(0).setInteractive({ useHandCursor: true });
          z.on('pointerdown', function () { cur = i; act(); });
          z.on('pointerover', function () { if (cur !== i) { cur = i; render(); } });
          c.add([ic, ct, z]); cells.push({ x: x, y: y, ic: ic, ct: ct });
        })(i);
      }
      var tName = this.txt(X + 34, Y + 268, '', 20, '#ffd166');
      var tDesc = this.txt(X + 34, Y + 296, '', 16, '#fbecc8', { wrap: Wd - 68 });
      var tInfo = this.txt(X + 34, Y + 322, '', 14, '#b8a890', { wrap: Wd - 68 });
      c.add([tName, tDesc, tInfo, this.txt(480, Y + Hd - 24, this.touchOn ? 'Tap an item to pick it up, tap another slot to swap  ·  X to close'
        : 'Arrows/mouse move  ·  E or click: pick up, then swap  ·  Esc close', 12, '#8a7a6a', { ox: 0.5 })]);
      function render() {
        gg.clear();
        cells.forEach(function (o, i) {
          var sl = S.inv[i], on = i === cur, pk = i === picked;
          gg.fillStyle(pk ? 0x2a4a6a : on ? 0x5a4024 : 0x2e2219, 1); gg.fillRoundedRect(o.x, o.y, 54, 54, 6);
          gg.lineStyle(on || pk ? 3 : 1, pk ? 0x8fd3ff : on ? 0xffd166 : 0x6a5034, 1); gg.strokeRoundedRect(o.x, o.y, 54, 54, 6);
          if (sl) { o.ic.setVisible(true).setTexture(LC.ITEMS[sl.id].icon); o.ct.setText(sl.n > 1 ? String(sl.n) : ''); }
          else { o.ic.setVisible(false); o.ct.setText(''); }
        });
        var sl = S.inv[cur];
        if (sl) {
          var it = LC.ITEMS[sl.id], info = [];
          tName.setText(it.name + (sl.n > 1 ? '  x' + sl.n : ''));
          tDesc.setText(it.desc || '');
          if (it.food) info.push('Food: +' + it.food.full + ' fullness, ' + (it.food.joy >= 0 ? '+' : '') + it.food.joy + ' joy');
          if (it.glow) info.push('Offering: +' + it.glow + ' glow');
          if (it.sell) info.push('Sells for ' + it.sell + ' kepeng');
          if (LC.LOVES.indexOf(sl.id) >= 0) info.push('Pelita loves this!');
          tInfo.setText(info.join('   ·   '));
        } else { tName.setText(''); tDesc.setText(cur < 9 ? 'Empty hotbar slot.' : 'Empty backpack slot.'); tInfo.setText(''); }
      }
      function act() {
        if (picked < 0) { if (S.inv[cur]) { picked = cur; LC.Audio.sfx('click'); } }
        else { var t = S.inv[picked]; S.inv[picked] = S.inv[cur]; S.inv[cur] = t; picked = -1; LC.Audio.sfx('plant'); }
        render();
      }
      function close() { c.destroy(); if (self.modal === m) self.modal = null; }
      m = {
        type: 'inv', close: close,
        key: function (code) {
          if (code === 'Escape' || code === 'Tab' || code === 'KeyI') { close(); return; }
          if (code === 'ArrowLeft' || code === 'KeyA') cur = (cur + 17) % 18;
          else if (code === 'ArrowRight' || code === 'KeyD') cur = (cur + 1) % 18;
          else if (/Arrow(Up|Down)|Key[WS]/.test(code)) cur = (cur + 9) % 18;
          else if (ACCEPT[code]) { act(); return; }
          render();
        }
      };
      this.modal = m;
      render();
    }

    // ================================================================ day summary
    showSummary(sum, onDone) {
      this.closeModal();
      var self = this, S = this.S, m;
      var c = this.modalC(100, 0x08060f, 1);
      var X = 180, Y = 80, Wd = 600, Hd = 470;
      var bg = this.add.graphics(); this.panel(bg, X, Y, Wd, Hd); c.add(bg);
      c.add(this.txt(480, Y + 18, (sum.fainted ? 'You passed out...  ' : '') + 'Day ' + sum.day + ' complete', 30, '#ffd166', { ox: 0.5 }));
      var expr = sum.mood === 'content' ? 'happy' : sum.mood === 'neglected' ? 'sad' : 'sleepy';
      bg.fillStyle(0x3b2f5c, 1); bg.fillCircle(X + 80, Y + 118, 42);
      c.add(this.add.image(X + 80, Y + 116, LC.ghostTex(S.ghost.stage, expr)).setScale(3));
      var moodTxt = sum.mood === 'content' ? 'Pelita is content.' : sum.mood === 'neglected' ? 'Pelita feels neglected...' : 'Pelita is a little restless.';
      c.add(this.txt(X + 140, Y + 92, moodTxt, 22, sum.mood === 'neglected' ? '#ff8a7a' : '#e8dcff'));
      c.add(this.txt(X + 140, Y + 124, LC.STAGES[S.ghost.stage].name + '  ·  Bond ' + Math.floor(S.ghost.bond), 15, '#b8a8ff'));
      var body = this.txt(X + 40, Y + 170, sum.lines.map(function (l) { return '•  ' + l; }).join('\n'), 16, '#fbecc8', { wrap: Wd - 80, ls: 8 });
      c.add(body);
      // v1.8: a busy night (helpers, a new house stage...) shrinks the text to fit above the kepeng line
      [[15, 5], [14, 3], [13, 2], [12, 1]].forEach(function (f) { if (body.height > Hd - 270) body.setFontSize(f[0] + 'px').setLineSpacing(f[1]); });
      c.add(this.txt(X + 40, Y + Hd - 92, 'Kepeng earned today: ' + sum.earned, 17, '#f7dd8a'));
      var next = (this.touchOn ? 'Tap' : 'Press E') + ' to begin Day ' + S.day + ', ' + LC.State.weekday() + (LC.State.isHGN() ? '  (Hungry Ghost Night!)' : '');
      var ft = this.txt(480, Y + Hd - 44, next, 17, '#ffd166', { ox: 0.5 });
      c.add(ft);
      this.tweens.add({ targets: ft, alpha: 0.4, duration: 600, yoyo: true, repeat: -1 });
      c.add(this.txt(480, Y + Hd - 18, 'Game saved', 12, '#8a7a6a', { ox: 0.5 }));
      function done() { c.destroy(); if (self.modal === m) self.modal = null; LC.Audio.sfx('click'); onDone(); }
      m = {
        type: 'summary', opened: this.time.now, close: function () { c.destroy(); },
        key: function (code) { if (ACCEPT[code] && self.time.now - m.opened > 400) done(); },
        click: function () { if (self.time.now - m.opened > 400) done(); }
      };
      this.modal = m;
    }
  };
})();
