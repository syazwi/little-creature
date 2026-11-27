/* UI (v3.30): the battle pad. On a touch screen your abilities ring the USE button, the way a phone battle game puts
 * its skill buttons round the attack button, so your right thumb reaches every one without leaving the corner:
 *  - the first four sit close round USE, the next six make a wider ring and one more sits further left, in the order
 *    you earned them (a new ability takes the next place, so the buttons you know never move)
 *  - each cooldown sweeps round its button like a clock, with the seconds in the middle; a ready ability glows
 *  - the swap button above USE changes to the next weapon in your hotbar (where something can be fought)
 *  - Restu Ibu is a small badge on USE's rim
 * With touch controls off (a computer) the buttons stay in their rows beside the hotbar, with their keys.
 * The old buttons still draw themselves every frame (some do more than draw); the pad hides them after.
 * Mixed into LC.UIScene. Loaded after every UI file that adds a button. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var U = LC.UIScene.prototype;

  // ------------------------------------------------------------------ what's new
  var seen = null;
  try { seen = localStorage.getItem('littleCreature.newsSeen'); } catch (e) { /* storage blocked */ }
  LC.NEWS = {
    id: 'v3.30-battle-pad',
    lines: [
      { text: '✦ Your abilities, right by your thumb ✦  On phones and tablets, every ability now sits in a ring around the USE button, so you can reach them in a fight without leaving the corner. Cooldowns sweep round each button like a clock.' },
      { text: 'Where there is something to fight, the arrow button above USE swaps to the next weapon in your hotbar. And tap Pelita\'s card (top right) to fold it into a small bubble, so it never hides the map. Tap it again to open it.' }
    ].concat(seen === LC.NEWS.id || seen === 'v3.30-battle-pad' ? [] : LC.NEWS.lines)
  };

  // v3.31: drag to swap
  LC.NEWS = {
    id: 'v3.31-drag',
    lines: [
      { text: '✦ Drag to sort ✦  Press an item in your hotbar and drag it onto another slot to swap them. In the bag, drag between the hotbar and the backpack too (hold it over a "more" button to scroll). A short tap still works as before.' },
      { text: 'The round buttons and the joystick are pixel art now, to match the rest of the game.' }
    ].concat(seen === LC.NEWS.id || seen === 'v3.31-drag' ? [] : LC.NEWS.lines)
  };

  // ------------------------------------------------------------------ where the buttons go (960 x 640 design, bottom-right)
  var UX = 866, UY = 542;   // the USE button (UI.js buildTouch)
  var SLOTS = [];
  function ring(rad, r, angles) {
    angles.forEach(function (a) { var t = a * Math.PI / 180; SLOTS.push({ x: Math.round(UX + Math.cos(t) * rad), y: Math.round(UY + Math.sin(t) * rad), r: r }); });
  }
  ring(122, 28, [180, 210, 240, 270]);                 // close round USE (left, then up)
  ring(192, 25, [180, 198, 216, 234, 252, 270]);       // the wider ring
  ring(262, 25, [180]);                                // one more, further left
  var SWAP = { x: 934, y: 452, r: 22 }, RESTU = { x: UX + 37, y: UY - 37, r: 13 };

  // ------------------------------------------------------------------ the abilities, in the order you earn them
  function fight(W) { return !!(W && W.hasEnemies && W.hasEnemies()); }
  function call(o, k) { return o && typeof o[k] === 'function' ? o[k]() : 0; }
  function has(name) { return typeof LC[name] === 'function' && !!LC[name](); }
  // Each state(W) gives: left/full (cooldown seconds), ready (glow), dim (nothing to use it on), spent (once a day,
  // used), glow (active now), hidden (not here), and an icon or ring colour when they change.
  var ABILITIES = [
    { id: 'stone', icon: 'ic_batu', key: 'KeyV', color: 0x8fd3ff, has: function () { return has('hasStone'); },
      state: function (W) { var left = call(W, 'stoneLeft'), f = fight(W); return { left: left, full: (has('hasRestu') ? LC.RESTU : LC.STONE).cd, ready: f && !left, dim: !f && !left }; } },
    { id: 'dash', icon: 'ic_langkah', color: 0xffd166, act: function (ui) { if (ui.world.dash) ui.world.dash(); }, has: function () { return has('hasLangkah'); },
      state: function (W) { var left = call(W, 'dashLeft'); return { left: left, full: LC.LANGKAH.cd, ready: !left }; } },
    { id: 'nek', icon: 'ic_nek', key: 'KeyC', color: 0xd8c8a8, has: function () { return has('hasNek'); },
      state: function (W) {
        var here = !!(W && W.nek && !W.nek.leaving), f = here && W.nekFighting && W.nekFighting(), left = here ? (f ? LC.nekLeft.circle() : 0) : LC.nekLeft.call();
        return { icon: f ? 'ic_bulatan' : 'ic_nek', left: left, full: here ? LC.NEK.circle.cd : LC.NEK.callCd, ready: !left && (!here || f), glow: here, color: here ? 0x9bff8a : 0xd8c8a8 };
      } },
    { id: 'wau', icon: 'ic_wau', key: 'KeyB', color: 0xd8ecff, has: function () { return has('hasBualang'); },
      state: function (W) {
        var B = LC.BUALANG, b = W && W.bual, here = !!(b && !b.leaving), due = LC.bualangLeft.due(), left = due > 0 ? due : (here ? 0 : LC.bualangLeft.rest());
        return { left: left, full: due > 0 ? (LC.bualangDur || B.arrive.open) : B.rest, ready: !left, glow: here || due > 0, num: due > 0 ? '#d8ecff' : null };
      } },
    { id: 'angin', icon: 'ic_angin', key: 'KeyU', color: 0xd8ecff, has: function () { return has('hasBualang'); },
      state: function (W) { var left = LC.bualangLeft.gust(); return { left: left, full: LC.BUALANG.gust.cd, ready: !left && fight(W) }; } },
    { id: 'lagu', icon: 'ic_mayang', key: 'KeyL', color: 0x9ae8e0, has: function () { return has('hasLagu'); },
      state: function (W) { var left = call(W, 'laguLeft'), f = fight(W); return { left: left, full: LC.C9.lagu.cd, ready: !left && f, dim: !f && !left }; } },
    { id: 'pantul', icon: 'mantera_pantul', key: 'KeyP', color: 0xb6f7e6, has: function (W) { return !!(W && W.pantulAvailable && W.pantulAvailable()); },
      state: function (W) { var left = W.pantulLeft(); return { left: left, full: LC.C13.cooldown, ready: !left }; } },
    { id: 'sekawan', icon: 'ic_sekawan', key: 'KeyY', color: 0xe9c46a, has: function () { return has('hasSekawan'); },
      state: function (W) { var left = call(W, 'sekawanLeft'), f = fight(W); return { left: left, full: LC.C18.sekawan.cd, ready: !left && f, dim: !f && !left }; } },
    { id: 'hilai', icon: 'ic_hilai', key: 'KeyH', color: 0xe8e0ff, has: function () { return has('hasHilai'); },
      state: function (W) { var left = call(W, 'hilaiLeft'), f = fight(W); return { left: left, full: LC.C19.hilai.cd, ready: !left && f, dim: !f && !left }; } },
    { id: 'tiger', icon: 'ic_harimau20', key: 'KeyT', color: 0xffe8a0, has: function () { return has('c20Putih'); },
      state: function (W) {
        var used = LC.State.s.quests.c20tigerDay === LC.State.s.day, active = !!(W && W.c20b && W.c20b.tiger), f = fight(W);
        return { ready: !used && f, glow: active, spent: used && !active, dim: !used && !f };
      } },
    { id: 'suria', icon: 'ic_suria', key: 'KeyK', color: 0xffd166, has: function () { return has('hasSuria'); },
      state: function (W) {
        if (!W || (W.A && W.A.sailing) || !W.suriaLeft) return { hidden: true };
        var left = W.suriaLeft(), f = fight(W);
        return { left: left, full: LC.SURIA.cd, ready: !left, color: f ? 0xffd166 : 0xc8a060 };
      } }
  ];
  LC.PAD_ABILITIES = ABILITIES;

  // the next weapon in the hotbar after the one you hold (-1: none)
  function nextWeapon(S) {
    for (var k = 1; k <= 9; k++) {
      var j = (S.sel + k) % 9, sl = S.inv[j], it = sl && LC.ITEMS[sl.id];
      if (j !== S.sel && it && it.kind === 'weapon') return j;
    }
    return -1;
  }

  Object.assign(U, {
    padOn: function () { return !!this.touchOn; },
    buildPad: function () {
      var self = this, P = this.pad = { slots: [], fit: {} };
      P.g = this.add.graphics().setDepth(70);
      SLOTS.forEach(function (s, i) {
        var o = { s: s, ab: null, downT: -1e9 };
        o.icon = self.add.image(0, 0, 'ic_batu').setDepth(71).setVisible(false);
        o.num = self.txt(0, 0, '', s.r > 26 ? 18 : 16, '#fffdf2', { ox: 0.5, oy: 0.5, stroke: 4 }).setDepth(72).setVisible(false);
        o.hit = self.add.zone(0, 0, s.r * 2 + 8, s.r * 2 + 8).setDepth(73).setVisible(false)
          .setInteractive(new Phaser.Geom.Circle(s.r + 4, s.r + 4, s.r + 4), Phaser.Geom.Circle.Contains);
        o.hit.isTouchBtn = true;
        o.hit.on('pointerdown', function () {
          if (self.modal || !o.ab || !self.world || self.world.sleeping) return;
          o.downT = self.time.now;
          if (o.ab.act) o.ab.act(self); else self.pressKey(o.ab.key);
        });
        P.slots.push(o);
      });
      // the weapon swap
      P.swapIcon = this.add.image(0, 0, 'i_hoe').setDepth(71).setVisible(false);
      P.swapHit = this.add.zone(0, 0, SWAP.r * 2 + 8, SWAP.r * 2 + 8).setDepth(73).setVisible(false)
        .setInteractive(new Phaser.Geom.Circle(SWAP.r + 4, SWAP.r + 4, SWAP.r + 4), Phaser.Geom.Circle.Contains);
      P.swapHit.isTouchBtn = true;
      P.swapHit.on('pointerdown', function () {
        var S = self.S, j = self.modal ? -1 : nextWeapon(S), W = self.world;
        if (j < 0) return;
        P.swapT = self.time.now;
        self.selectSlot(j);
        if (W && W.player && self.floatText) self.floatText(W.player.x, W.player.y - 26, LC.ITEMS[S.inv[j].id].name, '#ffd166');
      });
      // Restu Ibu's badge
      P.restuIcon = this.add.image(0, 0, 'ic_restu').setDepth(71).setVisible(false);
      // the old buttons, hidden while the pad is on
      P.old = [this.skillG, this.skIcon, this.skKey, this.skCd, this.rsIcon, this.dashG, this.dashIcon, this.dashKey, this.dashCd, this.dashZone,
        this.nekG, this.nekIcon, this.nekKeyT, this.nekCd, this.nekZone, this.buaG, this.buaIcon, this.buaKey, this.buaCd, this.angIcon, this.angKey, this.angCd,
        this.lagG, this.lagIcon, this.lagKey, this.lagCd, this.lagZone, this.skwG, this.skwIcon, this.skwKey, this.skwCd, this.skwZone,
        this.hilG, this.hilIcon, this.hilKey, this.hilCd, this.hilZone, this.tgrG, this.tgrIcon, this.tgrKey, this.tgrZone].concat(this.skZones || [], this.buaZones || []);
      [this.suriaHUD, this.pantulHUD].forEach(function (h) { if (h) Object.keys(h).forEach(function (k) { P.old.push(h[k]); }); });
      P.old = P.old.filter(function (o) { return o && o.setVisible; });
    },
    // an icon's scale to fill a round button of radius r
    padFit: function (key, r) {
      var P = this.pad, id = key + '@' + r;
      if (!P.fit[id]) { var f = this.textures.getFrame(key); P.fit[id] = f ? (r * 1.35) / Math.max(f.width, f.height, 1) : 2; }
      return P.fit[id];
    },
    drawPad: function () {
      var P = this.pad, W = this.world, S = this.S;
      if (!P || !S) return;
      var on = this.padOn(), show = on && !this.modal && W && !W.sleeping, g = P.g, now = this.time.now, self = this;
      g.clear();
      // the old buttons: hidden while the pad is on; their drawings come back when it is off
      if (on) { P.old.forEach(function (o) { o.setVisible(false); }); P.hid = true; }
      else if (P.hid) { P.old.forEach(function (o) { if (o.type === 'Graphics') o.setVisible(true); }); P.hid = false; }
      var list = show ? ABILITIES.filter(function (a) { return a.has(W); }) : [];
      var o = this.anchorOff('br');
      P.slots.forEach(function (sl, i) {
        var a = list[i] || null, s = sl.s, st = a ? (a.state(W) || {}) : null;
        sl.ab = st && !st.hidden ? a : null;
        if (!sl.ab) { sl.icon.setVisible(false); sl.num.setVisible(false); sl.hit.setVisible(false); return; }
        var x = s.x + o.x, y = s.y + o.y, r = s.r, col = st.color || a.color, pressed = now - sl.downT < 140, cd = st.left > 0 && st.full;
        var rd = pressed ? r - 3 : r;   // (pixel circles: see UI.js pxDisc)
        self.pxDisc(g, x, y, rd, st.glow ? 0x2a3442 : 0x1e1510, pressed ? 0.95 : 0.78);
        if (cd) self.pxPie(g, x, y, rd, Math.min(1, st.left / st.full), 0x000000, 0.58);   // the cooldown sweeps round like a clock
        if (st.spent) self.pxDisc(g, x, y, rd, 0x000000, 0.55);
        if (st.ready) {
          self.pxRing(g, x, y, rd, col, 0.95);
          self.pxRing(g, x, y, rd + 3, col, 0.25 + 0.2 * Math.sin(now / 200 + i));
        } else self.pxRing(g, x, y, rd, 0xd9a94e, 0.8);
        var key = st.icon || a.icon;
        if (!self.textures.exists(key)) key = a.icon;
        if (sl.icon.texture.key !== key) sl.icon.setTexture(key);
        sl.icon.setVisible(true).setPosition(x, y).setScale(self.padFit(key, r) * (pressed ? 0.92 : 1))
          .setAlpha(st.spent ? 0.45 : st.dim ? 0.55 : cd ? 0.7 : 1);
        var t = cd ? String(Math.ceil(st.left)) : '';
        if (sl.num.text !== t) sl.num.setText(t);
        sl.num.setVisible(!!t).setPosition(x, y).setColor(st.num || '#fffdf2');
        sl.hit.setVisible(true).setPosition(x, y);
      });
      // the weapon swap: where something can be fought, and you have another weapon in the hotbar
      var j = show && W.enemies && W.enemies.length ? nextWeapon(S) : -1;
      if (j >= 0) {
        var it = LC.ITEMS[S.inv[j].id], x = SWAP.x + o.x, y = SWAP.y + o.y, r = SWAP.r, pr = now - (P.swapT || -1e9) < 140;
        this.pxDisc(g, x, y, r, 0x1e1510, pr ? 0.95 : 0.78);
        this.pxRing(g, x, y, r, 0xd9a94e, 0.85);
        // a round arrow over the top, pointing clockwise: "change"
        var PX = LC.PXS, ar = r + 2 * PX, ea = Math.PI * 0.42;
        this.pxArc(g, x, y, ar, Math.PI * 1.58, ea, 0xffd166, 0.95);
        var hx = Math.round(x + Math.sin(ea) * (ar - PX)), hy = Math.round(y - Math.cos(ea) * (ar - PX));
        g.fillStyle(0xffd166, 0.95); g.fillRect(hx - 2 * PX, hy, 5 * PX, PX); g.fillRect(hx - PX, hy + PX, 3 * PX, PX); g.fillRect(hx, hy + 2 * PX, PX, PX);
        if (P.swapIcon.texture.key !== it.icon) P.swapIcon.setTexture(it.icon);
        P.swapIcon.setVisible(true).setPosition(x, y).setScale(this.padFit(it.icon, r) * (pr ? 0.9 : 1));
        P.swapHit.setVisible(true).setPosition(x, y);
      } else { P.swapIcon.setVisible(false); P.swapHit.setVisible(false); }
      // Restu Ibu: a small badge on USE's rim (dim once it has saved you today)
      if (show && has('hasRestu')) {
        var used = S.restuDay === S.day, bx = RESTU.x + o.x, by = RESTU.y + o.y;
        this.pxDisc(g, bx, by, RESTU.r, 0x1e1510, 0.92);
        this.pxRing(g, bx, by, RESTU.r, used ? 0x6a5034 : 0xffd166, 1);
        P.restuIcon.setVisible(true).setPosition(bx, by).setScale(this.padFit('ic_restu', RESTU.r) * 0.95).setAlpha(used ? 0.35 : 1);
      } else P.restuIcon.setVisible(false);
    }
  });

  // ------------------------------------------------------------------ hooks (this file loads after every button's file)
  var buildSkills = U.buildSkills;
  U.buildSkills = function () { buildSkills.apply(this, arguments); this.buildPad(); };
  var drawSkills = U.drawSkills;
  U.drawSkills = function () { drawSkills.apply(this, arguments); this.drawPad(); };
})(window.LC);
