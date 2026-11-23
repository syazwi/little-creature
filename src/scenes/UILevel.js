/* UI, your level (v3.12): "Lv N" and a thin XP bar in the top-left panel, each monster's level above its head
 * (coloured by how it compares with yours), the Mantera Suria button (K), and a new first page in My stats: your
 * body wrapped in an aura (its colour from your strongest attribute, its size and flames from your overall power and
 * level), Pelita beside you, an octagon chart of eight attributes (red at the centre, green at the edge), and your
 * level, title and XP. The user asked for a chart "like the image" (an attribute octagon) and then for the aura.
 * Mixed into LC.UIScene. See level.js. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var U = LC.UIScene.prototype, PL = LC.PL;
  function ADD() { return Phaser.BlendModes.ADD; }
  function fmt(n) { return String(Math.floor(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  // ---------------------------------------------------------------- the eight attributes (0 to 100 each)
  var AX = [
    { key: 'attack', name: 'Attack', color: 0xff4d4d, aura: 'Crimson' },
    { key: 'str', name: 'Strength', color: 0xff9a3c, aura: 'Ember' },
    { key: 'hp', name: 'Health', color: 0xff7aa8, aura: 'Rose' },
    { key: 'energy', name: 'Energy', color: 0xc6f25a, aura: 'Verdant' },
    { key: 'speed', name: 'Speed', color: 0x5ef0d0, aura: 'Wind' },
    { key: 'spirit', name: 'Spirit', color: 0xfff2b0, aura: 'Lantern' },
    { key: 'wisdom', name: 'Wisdom', color: 0x7ab8ff, aura: 'Sky' },
    { key: 'magic', name: 'Magic', color: 0xb07cff, aura: 'Arcane' }
  ];
  var TIERS = [[0, 'Spark'], [15, 'Glow'], [30, 'Blaze'], [48, 'Storm'], [68, 'Legend']];
  function pct(v, max) { return Math.max(0, Math.min(100, v / max * 100)); }
  LC.plRatings = function (ui) {
    var S = LC.State.s, L = LC.plLevel(S), q = S.quests || {}, best = null, W = ui && ui.world;
    S.inv.forEach(function (sl) { var it = sl && LC.ITEMS[sl.id]; if (it && it.kind === 'weapon' && (!best || LC.State.weaponDamage(it) > LC.State.weaponDamage(best))) best = it; });
    var atk = best ? LC.State.weaponDamage(best) : 0;
    var ways = [LC.State.count('basikal') > 0 || S.riding === 'basikal', !!(LC.hasLangkah && LC.hasLangkah()), !!q.nagaRide, !!LC.State.friend('kenyalang')];
    var nWays = ways.filter(Boolean).length;
    var P = LC.chapterProgress ? LC.chapterProgress() : { done: 0, total: 1 };
    var lv = LC.State.level(), magic = LC.hasSuria() ? Math.min(100, 30 + L * 1.4) : q.c13Learned ? 12 : 0;
    var out = {
      attack: { r: pct(atk, 22), val: atk ? String(atk) : '-' },
      str: { r: pct(S.str || 0, PL.strCap(PL.max)), val: Math.floor(S.str || 0) + ' / ' + PL.strCap(L) },
      hp: { r: pct(S.maxHp, 340), val: String(S.maxHp) },
      energy: { r: pct(S.maxEnergy, 400), val: String(S.maxEnergy) },
      speed: { r: 40 + 15 * nWays, val: String(40 + 15 * nWays) },
      spirit: { r: pct(lv, LC.MAX_LEVEL || 30), val: 'Pelita Lv ' + lv },
      wisdom: { r: pct(P.done, P.total || 1), val: P.done + ' / ' + (P.total || 1) },
      magic: { r: magic, val: LC.hasSuria() ? LC.suriaDamage(L) + (LC.suriaCount(L) > 1 ? ' x' + LC.suriaCount(L) : '') : q.c13Learned ? 'Pantul' : '-' }
    };
    void W;
    return AX.map(function (a) { return Object.assign({}, a, out[a.key]); });
  };
  LC.plAura = function (ui) {
    var R = LC.plRatings(ui), L = LC.plLevel();
    var avg = R.reduce(function (s, a) { return s + a.r; }, 0) / R.length, power = avg * 0.7 + (L / PL.max * 100) * 0.3;
    var tier = 0;
    TIERS.forEach(function (t, i) { if (power >= t[0]) tier = i; });
    var sorted = R.slice().sort(function (a, b) { return b.r - a.r; });
    return { R: R, tier: tier, power: power, first: sorted[0], second: sorted[1], name: sorted[0].aura + ' ' + TIERS[tier][1] };
  };

  // ---------------------------------------------------------------- pictures, the HUD, keys and the Suria button
  var create = U.create;
  U.create = function () {
    if (!this.textures.exists('ic_level')) LC.Art.make(this, 'ic_level', 12, 12, function (p) {   // a gold star badge
      p.poly([[6, 0], [7.6, 4], [12, 4.4], [8.6, 7.2], [9.8, 11.6], [6, 9.2], [2.2, 11.6], [3.4, 7.2], [0, 4.4], [4.4, 4]], '#ffd166');
      p.poly([[6, 2], [7, 4.8], [9.6, 5.2], [7.6, 6.8], [8.2, 9.4], [6, 8], [3.8, 9.4], [4.4, 6.8], [2.4, 5.2], [5, 4.8]], '#fff2b0');
    }, '#5a3a10');
    this.lvTags = []; this.lastXp = null; this.lastLv = null;   // (a restarted scene: the old texts are gone)
    if (!this.textures.exists('ic_suria')) LC.Art.make(this, 'ic_suria', 12, 12, function (p) {   // a small sun
      for (var k = 0; k < 8; k++) { var a = k * Math.PI / 4; p.line(6 + Math.cos(a) * 3, 6 + Math.sin(a) * 3, 6 + Math.cos(a) * 5.4, 6 + Math.sin(a) * 5.4, k % 2 ? '#ffb347' : '#ffd166'); }
      p.disc(6, 6, 3.2, '#ffc04a'); p.disc(5.4, 5.4, 1.8, '#fff2b0'); p.px(5, 5, '#ffffff');
    }, '#6a3a10');
    if (!this.textures.exists('suria_orb')) LC.Art.make(this, 'suria_orb', 9, 9, function (p) {
      p.disc(4.5, 4.5, 4.4, '#ffb347'); p.disc(4.5, 4.5, 3.2, '#ffd166'); p.disc(4, 4, 1.8, '#fffbe8');
      p.px(1, 4, '#fff2b0'); p.px(7, 4, '#fff2b0'); p.px(4, 1, '#fff2b0'); p.px(4, 7, '#fff2b0');
    });
    create.apply(this, arguments);
  };
  var buildHUD = U.buildHUD;
  U.buildHUD = function () {
    buildHUD.apply(this, arguments);
    this.tLv = this.txt(258, 25, '', 14, '#9ae8ff', { ox: 1, stroke: 3 });
    this.gfxXp = this.add.graphics();
    this.pin('tl', [this.tLv, this.gfxXp]);
  };
  var update = U.update;
  U.update = function (time) {
    update.apply(this, arguments);
    if (!this.ready || !this.S) return;
    this.updateLevelHUD();
    this.updateLvTags();
  };
  var onKey = U.onKey;
  U.onKey = function (ev) {
    if (ev.code === 'KeyK' && !this.modal && this.world && LC.hasSuria()) {
      if (ev.preventDefault) ev.preventDefault();
      this.world.castSuria(); return;
    }
    return onKey.apply(this, arguments);
  };
  var buildSkills = U.buildSkills;
  U.buildSkills = function () {
    buildSkills.apply(this, arguments);
    var self = this, X = 284, Y = 532, hit = this.add.zone(X, Y, 44, 44).setOrigin(0).setInteractive({ useHandCursor: true });
    hit.isTouchBtn = true;
    hit.on('pointerdown', function () { if (!self.modal) self.pressKey('KeyK'); });
    var s = this.suriaHUD = { frame: this.add.graphics(), icon: this.add.image(X + 22, Y + 22, 'ic_suria').setScale(2.6),
      key: this.txt(X + 3, Y + 3, 'K', 12, '#ffe8b0', { stroke: 3 }), num: this.txt(X + 22, Y + 12, '', 16, '#ffffff', { ox: 0.5, stroke: 4 }), hit: hit };
    this.pin('bc', [s.frame, s.icon, s.key, s.num, s.hit]);
  };
  var drawSkills = U.drawSkills;
  U.drawSkills = function () {
    drawSkills.apply(this, arguments);
    var s = this.suriaHUD, w = this.world;
    if (!s) return;
    var show = !!(w && LC.hasSuria() && !this.modal && !(w.A && w.A.sailing));
    s.icon.setVisible(show); s.key.setVisible(show && !this.touchOn); s.hit.setVisible(show); s.num.setVisible(show);
    s.frame.clear();
    if (!show) return;
    var X = 284, Y = 532, left = w.suriaLeft(), ready = !left, fight = w.hasEnemies && w.hasEnemies();
    s.frame.fillStyle(ready ? 0x4a3418 : 0x2a2230, 0.9); s.frame.fillRoundedRect(X, Y, 44, 44, 7);
    s.frame.lineStyle(2, ready ? (fight ? 0xffd166 : 0xc8a060) : 0x6a5a70, 1); s.frame.strokeRoundedRect(X, Y, 44, 44, 7);
    if (ready && fight) { s.frame.lineStyle(1, 0xfff2b0, 0.4 + 0.4 * Math.sin(this.time.now / 180)); s.frame.strokeRoundedRect(X - 3, Y - 3, 50, 50, 9); }
    if (left) { s.frame.fillStyle(0x000000, 0.45); s.frame.fillRoundedRect(X + 2, Y + 2 + 40 * (1 - left / LC.SURIA.cd), 40, 40 * left / LC.SURIA.cd, 5); }
    s.icon.setAlpha(ready ? 1 : 0.45);
    s.num.setText(left ? String(Math.ceil(left)) : '');
  };

  Object.assign(U, {
    updateLevelHUD: function () {
      var S = this.S, xp = LC.plXp(S), L = PL.levelFor(xp);
      if (!this.tLv) return;
      if (xp === this.lastXp && L === this.lastLv) return;
      this.lastXp = xp; this.lastLv = L;
      this.tLv.setText('Lv ' + L);
      var g = this.gfxXp, f = L >= PL.max ? 1 : (xp - PL.total(L)) / PL.need(L);
      g.clear();
      g.fillStyle(0x140e0a, 0.9); g.fillRoundedRect(28, 142, 230, 5, 2);
      if (f > 0) { g.fillStyle(0x7fdcff, 1); g.fillRoundedRect(28, 142, Math.max(4, Math.round(230 * Math.min(1, f))), 5, 2); }
    },
    // each monster's level, above its head
    updateLvTags: function () {
      var self = this, W = this.world, cam = W && W.cameras && W.cameras.main, tags = this.lvTags = this.lvTags || [], i = 0;
      var hide = !cam || !!this.modal || W.sleeping || W.cutscene;
      if (!hide) (W.enemies || []).forEach(function (e) {
        var s = e.spr;
        if (e.dead || e.away || !s || !s.active || !s.visible || s.alpha < 0.4 || !e.def) return;
        var m = LC.monsterLevel(e.kind, e.def), t = tags[i] || (tags[i] = self.txt(0, 0, '', 12, '#fbecc8', { ox: 0.5, oy: 1, stroke: 3 }).setDepth(-0.6));
        i++;
        var label = (e.def.boss ? '★ ' : '') + 'Lv ' + m;
        if (t.text !== label) t.setText(label);
        var col = LC.levelColor(m); if (t.lvColor !== col) { t.lvColor = col; t.setColor(col); }
        var wv = cam.worldView, sx = (s.x - wv.x) * cam.zoom, sy = (s.y - s.displayHeight - 4 - wv.y) * cam.zoom;
        t.setPosition(Math.round(sx), Math.round(sy)).setVisible(true);
      });
      for (; i < tags.length; i++) tags[i].setVisible(false);
    },

    // My stats: your aura, the attribute octagon, your level
    openStats: function (tab) {
      var self = this;
      this.openMenu({
        title: 'You', tab: tab === 1 ? 2 : tab === 2 ? 1 : tab || 0,
        footer: 'Earn XP by beating monsters, finishing chapter steps, catching fish, training and helping Pelita grow.',
        tabs: [{ label: 'Me', draw: function (c, box) { self.drawMe(c, box); } },
          { label: 'My stats', rows: function () { return self.statRows(); } },
          { label: 'Companions', rows: function () { return self.companionRows(); } }]
      });
    },
    drawMe: function (c, box) {
      var self = this, S = this.S, L = LC.plLevel(S), xp = LC.plXp(S), A = LC.plAura(this), R = A.R, tweens = [];
      c.once('destroy', function () { tweens.forEach(function (t) { t.remove(); }); });
      function tw(cfg) { var t = self.tweens.add(cfg); tweens.push(t); return t; }
      function add(o) { c.add(o); return o; }
      var top = box.y, cx = box.x + 110, feet = top + 222, mid = feet - 52, t = A.tier, c1 = A.first.color, c2 = A.second.color;
      // ---- the aura (behind you): bigger and wilder as your power grows
      var floor = add(this.add.image(cx, feet - 2, 'glow').setBlendMode(ADD()).setTint(c1).setScale(1.6 + t * 0.3, 0.4).setAlpha(0.8));
      tw({ targets: floor, alpha: 0.4, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      var outer = add(this.add.image(cx, mid, 'glow').setBlendMode(ADD()).setTint(c1).setScale(1.6 + t * 0.32, 2.4 + t * 0.36).setAlpha(Math.min(1, 0.6 + t * 0.1)));
      tw({ targets: outer, scaleX: outer.scaleX * 1.08, scaleY: outer.scaleY * 1.06, alpha: outer.alpha * 0.65, duration: 1100 - t * 120, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      var core = add(this.add.image(cx, mid + 4, 'glow').setBlendMode(ADD()).setTint(c1).setScale(1.1 + t * 0.1, 1.7 + t * 0.15).setAlpha(0.85));
      tw({ targets: core, alpha: 0.5, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      if (t >= 1) {
        var inner = add(this.add.image(cx, mid + 8, 'glow').setBlendMode(ADD()).setTint(c2).setScale(0.9 + t * 0.15, 1.4 + t * 0.2).setAlpha(0.55));
        tw({ targets: inner, scaleX: inner.scaleX * 0.9, alpha: 0.85, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: 300 });
      }
      if (t >= 3) for (var k = 0; k < 9; k++) {   // flames licking upwards around you
        var fx = cx + (k - 4) * 13, fl = add(this.add.image(fx, feet - 4, 'glow').setBlendMode(ADD()).setTint(k % 2 ? c2 : c1).setOrigin(0.5, 0.92)
          .setScale(0.34, 1.1 + (4 - Math.abs(k - 4)) * 0.32 + (t - 3) * 0.45).setAlpha(0.85));
        tw({ targets: fl, scaleY: fl.scaleY * 1.3, scaleX: 0.24, alpha: 0.45, duration: 240 + k * 53 % 200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: k * 80 });
      }
      // the aura's form: your own outline, glowing in your colours, hugging your body
      var key = ((this.world && this.world.plKey) || 'pl') + '_down_0', forms = [];
      for (var f2 = Math.min(3, t + 1) - 1; f2 >= 0; f2--) {
        var form = add(this.add.image(cx, feet + 3 + f2 * 3, key).setOrigin(0.5, 1).setScale(7 * (1.1 + f2 * 0.09 + t * 0.015)).setTintFill(f2 % 2 ? c2 : c1)
          .setBlendMode(ADD()).setAlpha(0.8 - f2 * 0.2));
        forms.push(form);
        tw({ targets: form, scaleX: form.scaleX * 1.05, scaleY: form.scaleY * 1.04, alpha: form.alpha * 0.55, duration: 520 + f2 * 160, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: f2 * 120 });
      }
      if (t >= 2) for (var s2 = 0; s2 < 5 + t * 4; s2++) {   // sparks rising
        var sx = cx + Phaser.Math.Between(-46 - t * 6, 46 + t * 6), sp = add(this.add.image(sx, feet - 4, 'glow').setBlendMode(ADD()).setTint(s2 % 3 ? c1 : c2)
          .setScale(Phaser.Math.FloatBetween(0.06, 0.12)).setAlpha(0));
        tw({ targets: sp, y: feet - Phaser.Math.Between(90, 150 + t * 20), alpha: { from: 0.9, to: 0 }, duration: Phaser.Math.Between(1100, 1900), repeat: -1, delay: Phaser.Math.Between(0, 1600) });
      }
      // ---- you, and Pelita beside you
      var body = add(this.add.image(cx, feet, key).setOrigin(0.5, 1).setScale(7));
      tw({ targets: [body].concat(forms), y: '-=3', duration: 1000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      if (t >= 4) {   // a legend: three little orbs circle you
        var orbs = [0, 1, 2].map(function (n) { return add(self.add.image(cx, mid, 'glow').setBlendMode(ADD()).setTint(n === 1 ? c2 : c1).setScale(0.16)); });
        var spin = { a: 0 };
        tw({ targets: spin, a: Math.PI * 2, duration: 3200, repeat: -1, onUpdate: function () {
          orbs.forEach(function (o, n) { var a = spin.a + n * Math.PI * 2 / 3; o.setPosition(cx + Math.cos(a) * 64, mid + Math.sin(a) * 22).setDepth(Math.sin(a)); });
        } });
      }
      var gh = add(this.add.image(cx + 86, feet - 96, LC.ghostTex(S.ghost.stage, 'happy')).setScale(3).setAlpha(0.95));
      tw({ targets: gh, y: gh.y - 8, duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      var glowP = add(this.add.image(gh.x, gh.y, 'glow').setBlendMode(ADD()).setTint(0xfff2b0).setScale(0.8).setAlpha(0.35));
      tw({ targets: glowP, y: gh.y - 8, duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      // ---- level, title, XP and the aura's name
      var ly = feet + 10;
      add(this.add.image(cx - 62, ly + 15, 'ic_level').setScale(2.4));
      add(this.txt(cx - 44, ly, 'Level ' + L, 26, '#ffd166', { stroke: 4 }));
      add(this.txt(cx, ly + 34, PL.title(L), 15, '#fbecc8', { ox: 0.5 }));
      var g = add(this.add.graphics()), bw = 200, bx = cx - bw / 2, by = ly + 58, f = L >= PL.max ? 1 : (xp - PL.total(L)) / PL.need(L);
      g.fillStyle(0x140e0a, 1); g.fillRoundedRect(bx, by, bw, 10, 5);
      if (f > 0) { g.fillStyle(0x7fdcff, 1); g.fillRoundedRect(bx, by, Math.max(8, Math.round(bw * Math.min(1, f))), 10, 5); }
      add(this.txt(cx, by + 14, L >= PL.max ? fmt(xp) + ' XP  (highest level!)' : fmt(xp - PL.total(L)) + ' / ' + fmt(PL.need(L)) + ' XP to Lv ' + (L + 1), 12, '#b8e8ff', { ox: 0.5 }));
      add(this.txt(cx, by + 34, 'Aura: ' + A.name, 15, '#' + ('000000' + c1.toString(16)).slice(-6), { ox: 0.5, stroke: 3 }));
      add(this.txt(cx, by + 54, 'Each level: +' + PL.strStep + ' strength limit, +1 health, +1 energy.', 11, '#a89880', { ox: 0.5, wrap: 210, align: 'center' }));

      // ---- the octagon chart: bands from red (centre) to green (edge), your shape in white
      var ox = box.x + 372, oy = top + 196, RR = 106, n = R.length;
      function pt(i, r) { var a = -Math.PI / 2 + i * Math.PI * 2 / n; return { x: ox + Math.cos(a) * r, y: oy + Math.sin(a) * r }; }
      function ring(r) { var p = []; for (var i = 0; i < n; i++) p.push(pt(i, r)); return p; }
      var og = add(this.add.graphics());
      [[1, 0x16a34a], [0.8, 0x7cb518], [0.6, 0xd4a300], [0.4, 0xd96c00], [0.2, 0xb80000]].forEach(function (b) { og.fillStyle(b[1], 1); og.fillPoints(ring(RR * b[0]), true); });
      og.lineStyle(1, 0x000000, 0.18);
      for (var ax = 0; ax < n; ax++) { var e0 = pt(ax, RR); og.lineBetween(ox, oy, e0.x, e0.y); }
      var shape = R.map(function (a, i) { return pt(i, RR * Math.max(0.05, a.r / 100)); });
      og.fillStyle(0xffffff, 0.16); og.fillPoints(shape, true);
      og.lineStyle(2.5, 0xffffff, 1); og.strokePoints(shape, true, true);
      shape.forEach(function (p) { og.fillStyle(0xffffff, 1); og.fillCircle(p.x, p.y, 3); });
      R.forEach(function (a, i) {
        var p = pt(i, RR + 14), cos = Math.cos(-Math.PI / 2 + i * Math.PI * 2 / n), sin = Math.sin(-Math.PI / 2 + i * Math.PI * 2 / n);
        add(self.txt(p.x, p.y, a.name, 15, '#fbecc8', { ox: cos > 0.3 ? 0 : cos < -0.3 ? 1 : 0.5, oy: sin > 0.3 ? 0 : sin < -0.3 ? 1 : 0.5, stroke: 3 }));
      });
      // ---- the numbers
      var rx = box.x + 552, rw = box.x + box.w - 10 - rx;
      R.forEach(function (a, i) {
        var y = top + 4 + i * 50, hex = '#' + ('000000' + a.color.toString(16)).slice(-6), bar = add(self.add.graphics());
        add(self.txt(rx, y, a.name, 15, hex, { stroke: 3 }));
        add(self.txt(rx + rw, y + 1, a.val, 14, '#f7dd8a', { ox: 1 }));
        bar.fillStyle(0x140e0a, 1); bar.fillRoundedRect(rx, y + 24, rw, 7, 3);
        var band = a.r >= 80 ? 0x16a34a : a.r >= 60 ? 0x7cb518 : a.r >= 40 ? 0xd4a300 : a.r >= 20 ? 0xd96c00 : 0xb80000;
        if (a.r > 0) { bar.fillStyle(band, 1); bar.fillRoundedRect(rx, y + 24, Math.max(6, Math.round(rw * a.r / 100)), 7, 3); }
      });
    }
  });

  // My stats (the list): your level first, and your magic
  var statRows = U.statRows;
  U.statRows = function () {
    var rows = statRows.apply(this, arguments), S = this.S, L = LC.plLevel(S), xp = LC.plXp(S);
    rows.unshift({ icon: 'ic_level', label: 'Level ' + L + ': ' + PL.title(L), right: L >= PL.max ? 'MAX' : fmt(xp - PL.total(L)) + ' / ' + fmt(PL.need(L)) + ' XP',
      bar: L >= PL.max ? 1 : (xp - PL.total(L)) / PL.need(L),
      sub: 'Beat monsters (stronger ones give more), finish chapter steps, catch fish and train. Each level raises your strength limit by ' + PL.strStep + ' (now ' + PL.strCap(L) + '), your health and your energy.' });
    var q = S.quests || {};
    rows.push(LC.hasSuria() ? { icon: 'ic_suria', label: 'Magic: Mantera Suria', right: LC.suriaDamage(L) + ' damage' + (LC.suriaCount(L) > 1 ? ' x' + LC.suriaCount(L) : ''),
      sub: 'Press K or tap the sun beside the hotbar: ' + (LC.suriaCount(L) > 1 ? LC.suriaCount(L) + ' suns seek' : 'a sun seeks') + ' the nearest foes (every ' + LC.SURIA.cd + ' s). It grows with your level' + (L < 30 ? ': ' + (L < 15 ? 'two suns at Lv 15, ' : '') + 'three at Lv 30.' : '.') }
      : { icon: 'ic_suria', label: 'Magic', right: 'Not yet', enabled: false,
        sub: q.c13Learned ? 'Finish Chapter 13, then Suraya at Sekolah Mantera will teach you Mantera Suria.' : 'The School of Sorcery (Chapter 13) will teach you magic.' });
    return rows;
  };

  // the goal line points to Suraya until you have learned the magic
  var goal = LC.ch5Goal;
  LC.ch5Goal = function () {
    var S = LC.State.s;
    if (S && LC.C13 && LC.C13.step(S) >= LC.C13.end && !LC.hasSuria())
      return 'Magic awaits! Speak to Suraya at Sekolah Mantera (the enchanted letter by the farmhouse takes you there) to learn Mantera Suria.';
    return goal.apply(this, arguments);
  };

  // what's new, once, on players' screens (with the tap-to-use note too, for anyone who missed it)
  var tapNews = LC.NEWS, prior = null;
  try { prior = localStorage.getItem('littleCreature.newsSeen'); } catch (e) { /* storage blocked */ }
  LC.NEWS = {
    id: 'v3.12-level',
    lines: [
      { text: '✦ What\'s new: You have a level now! ✦  Beat monsters, finish chapter steps, catch fish and train to earn XP. Every level raises your strength limit (it stopped at 100 before), your health and your energy.' },
      { text: 'Monsters show their level above their heads: green is easy, white is a fair fight, orange and red are stronger than you. Stronger monsters give more XP.' },
      { text: 'Pause > My stats now shows your aura, glowing in the colour of your strongest attribute, and a chart of all eight attributes. And once Chapter 13 is done, Suraya at Sekolah Mantera can teach you magic!' }
    ].concat(tapNews && prior !== tapNews.id && prior !== 'v3.12-level' ? tapNews.lines.slice(0, 1) : [])
  };
})(window.LC);
