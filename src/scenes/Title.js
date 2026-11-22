/* Title screen: dusk over the river, Pelita bobbing, fireflies. */
window.LC = window.LC || {};
LC.TitleScene = class extends Phaser.Scene {
  constructor() { super('Title'); }

  create(data) {
    // The screen can be any shape (see LC.viewSize): the scenery spans the full width and height,
    // and the title, Pelita and the menu stay centred.
    var W = this.scale.width, H = this.scale.height, self = this;
    var cx = W / 2, dy = Math.round((H - 640) / 2), sx = W / 960, hz = 430 + dy, k = Math.min(sx, 1.3);
    function X(x) { return Math.round(cx + (x - 480) * k); }   // spread the skyline a little on wide screens
    LC.Audio.setNight(true);   // dusk on the title screen: slow music, crickets and frogs
    var g = this.add.graphics();
    g.fillGradientStyle(0x1f1840, 0x1f1840, 0xd9805a, 0xd9805a, 1); g.fillRect(0, 0, W, hz);
    for (var i = 0, stars = LC.Display.effectCount(Math.round(70 * sx)); i < stars; i++) {
      var s = this.add.image(Math.random() * W, Math.random() * (250 + dy), 'px').setScale(0.25 + Math.random() * 0.35).setAlpha(0.3 + Math.random() * 0.7);
      this.tweens.add({ targets: s, alpha: 0.1, duration: 900 + Math.random() * 1800, yoyo: true, repeat: -1, delay: Math.random() * 1500 });
    }
    this.add.image(X(790), 120 + dy, 'glow').setScale(4).setTint(0xffe8b0).setAlpha(0.45).setBlendMode(Phaser.BlendModes.ADD);
    this.add.circle(X(790), 120 + dy, 34, 0xfff1d0);
    // distant hills
    function hills(pts) { return [{ x: 0, y: hz }].concat(pts.map(function (p) { return { x: p[0] * sx, y: p[1] + dy }; }), [{ x: W, y: hz }]); }
    var h = this.add.graphics();
    h.fillStyle(0x3a2a55, 1); h.fillPoints(hills([[0, 330], [140, 290], [300, 350], [470, 300], [640, 360], [820, 310], [960, 350]]), true);
    h.fillStyle(0x2a1f42, 1); h.fillPoints(hills([[0, 380], [200, 360], [380, 395], [560, 370], [760, 400], [960, 375]]), true);
    // river
    var r = this.add.graphics();
    r.fillGradientStyle(0x3b3266, 0x3b3266, 0x16122a, 0x16122a, 1); r.fillRect(0, hz, W, H - hz);
    for (i = 0; i < LC.Display.effectCount(Math.round(26 * sx)); i++) {
      var ln = this.add.rectangle(Math.random() * W, hz + 10 + Math.random() * (H - hz - 20), 20 + Math.random() * 60, 2, 0xffc890, 0.25 + Math.random() * 0.25);
      this.tweens.add({ targets: ln, x: ln.x + 30, alpha: 0.05, duration: 2000 + Math.random() * 2000, yoyo: true, repeat: -1 });
    }
    // silhouettes
    var SIL = 0x170f2a;
    this.add.image(X(120), hz + 10, 'palm').setOrigin(0.5, 1).setScale(4.5).setTint(SIL);
    this.add.image(X(230), hz + 15, 'palm_f').setOrigin(0.5, 1).setScale(3.6).setFlipX(true).setTint(SIL);
    this.add.image(X(330), hz + 10, 'house').setOrigin(0.5, 1).setScale(2.6).setTint(SIL);
    this.add.image(X(468), hz + 10, 'spirit_house').setOrigin(0.5, 1).setScale(2.6).setTint(SIL);
    this.add.image(X(840), hz + 15, 'palm').setOrigin(0.5, 1).setScale(4.2).setFlipX(true).setTint(SIL);
    this.add.image(X(720), hz + 10, 'banana_f').setOrigin(0.5, 1).setScale(3).setTint(SIL);
    if (W > 1150) {   // more of the riverbank on wide screens
      this.add.image(X(-90), hz + 12, 'banana_f').setOrigin(0.5, 1).setScale(3.2).setFlipX(true).setTint(SIL);
      this.add.image(X(1040), hz + 10, 'palm_f').setOrigin(0.5, 1).setScale(3.8).setTint(SIL);
    }
    // fireflies
    this.flies = [];
    for (i = 0; i < LC.Display.effectCount(Math.round(30 * sx)); i++) {
      var f = this.add.image(Math.random() * W, 330 + dy + Math.random() * 200, 'firefly').setScale(2).setBlendMode(Phaser.BlendModes.ADD);
      this.flies.push({ img: f, bx: f.x, by: f.y, ph: Math.random() * 10, sp: 0.5 + Math.random() });
    }
    // Pelita
    this.add.image(cx, 300 + dy, 'glow').setScale(3.2).setTint(0xb8a8ff).setAlpha(0.55).setBlendMode(Phaser.BlendModes.ADD);
    this.ghost = this.add.image(cx, 300 + dy, 'ghost_2_happy').setScale(6);
    this.tweens.add({ targets: this.ghost, y: 288 + dy, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    this.add.text(cx, 92 + dy, 'Little Creature', { fontFamily: LC.FONT, fontSize: '76px', fontStyle: '700', color: '#ffd166', stroke: '#2a1d18', strokeThickness: 10 }).setOrigin(0.5);
    this.add.text(cx, 156 + dy, 'a spirit-keeping farm tale from the kampung', { fontFamily: LC.FONT, fontSize: '22px', color: '#fbecc8', stroke: '#2a1d18', strokeThickness: 5 }).setOrigin(0.5);

    this.cx = cx; this.dy = dy; this.optTexts = [];
    this.heading = this.add.text(cx, 404 + dy, '', { fontFamily: LC.FONT, fontSize: '20px', color: '#e8cf86', stroke: '#2a1d18', strokeThickness: 5 }).setOrigin(0.5);
    var touch = this.sys.game.device.input.touch || LC.PLATFORM === 'android';
    this.hint = this.add.text(cx, 600 + dy, touch ? 'Tap to choose  ·  drag the left side to walk  ·  USE to interact  ·  II to pause'
      : 'WASD / Arrows to move  ·  E to interact  ·  1-9 hotbar  ·  Tab bag  ·  N music' + (LC.canFullscreen() ? '  ·  F fullscreen' : ''),
      { fontFamily: LC.FONT, fontSize: '16px', color: '#cdb8a0', stroke: '#1a120c', strokeThickness: 4 }).setOrigin(0.5);
    if (data && data.menu === 'slots') this.slotMenu(data.mode, data.sel); else this.mainMenu(data && data.sel);
    this.add.text(W - 10, H - 8, 'Made with Phaser 3 · art & music generated in code', { fontFamily: LC.FONT, fontSize: '12px', color: '#8a7a9a' }).setOrigin(1, 1);
    // v1.7.1: this version and when it was built, and a button when a newer one is on GitHub
    this.add.text(10, H - 8, LC.Update.versionLine(), { fontFamily: LC.FONT, fontSize: '13px', color: '#b8a8c8', stroke: '#1a120c', strokeThickness: 3 }).setOrigin(0, 1);
    this.updBox = null; this.updHint = null; this.iosBox = null;
    if (LC.installHint && LC.installHint()) this.showInstall();   // v2.4.2: iPhone Safari, before Add to Home Screen
    if (LC.Update.newer()) this.showUpdate();
    else LC.Update.check(function () { if (self.sys && self.sys.isActive()) self.showUpdate(); });

    this.input.keyboard.on('keydown', function (ev) {
      if (LC.Lobby.isOpen) return;
      LC.Audio.init();
      if (ev.code === 'ArrowUp' || ev.code === 'KeyW') { self.sel = (self.sel + self.options.length - 1) % self.options.length; self.renderOpts(); LC.Audio.sfx('click'); }
      else if (ev.code === 'ArrowDown' || ev.code === 'KeyS') { self.sel = (self.sel + 1) % self.options.length; self.renderOpts(); LC.Audio.sfx('click'); }
      else if (ev.code === 'Enter' || ev.code === 'KeyE' || ev.code === 'Space') self.choose();
      else if (ev.code === 'Escape' && self.inSlots) { LC.Audio.sfx('click'); self.mainMenu(); }
      else if (ev.code === 'KeyF' && LC.canFullscreen()) LC.toggleFullscreen();
      else if (ev.code === 'KeyU' && LC.Update.newer()) self.getUpdate();
    });
    this.input.on('pointerdown', function () { LC.Audio.init(); });
    if (!(data && data.quiet)) this.cameras.main.fadeIn(500);
    this.starting = false;

    // Redraw for the new shape when the window is resized, rotated or goes fullscreen.
    var w0 = W, h0 = H;
    function onResize() {
      if (self.starting || (self.scale.width === w0 && self.scale.height === h0)) return;
      self.scene.restart({ quiet: true, sel: self.sel, menu: self.inSlots ? 'slots' : 'main', mode: self.slotMode });
    }
    this.scale.on('resize', onResize);
    this.events.once('shutdown', function () { self.scale.off('resize', onResize); });
  }

  // a list of options, centred under Pelita. size/gap shrink for the save-slot list.
  setOptions(options, sel, size, gap, y0) {
    var self = this, cx = this.cx, dy = this.dy;
    this.optTexts.forEach(function (t) { t.destroy(); });
    this.options = options;
    this.sel = sel >= 0 && sel < options.length ? sel : 0;
    this.optTexts = options.map(function (o, k) {
      var t = self.add.text(cx, y0 + dy + k * gap, o.label, { fontFamily: LC.FONT, fontSize: size + 'px', color: '#fbecc8', stroke: '#2a1d18', strokeThickness: 6, align: 'center' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      t.on('pointerover', function () { if (self.sel !== k) { self.sel = k; self.renderOpts(); } });
      t.on('pointerdown', function () { self.sel = k; self.choose(); });
      return t;
    });
    this.renderOpts();
  }
  mainMenu(sel) {
    var self = this, has = LC.State.hasSave(), opts = [];
    this.inSlots = false; this.slotMode = null; this.armed = 0;
    this.heading.setText('');
    if (this.hint) this.hint.setVisible(true);
    if (has) opts.push({ label: 'Continue', fn: function () { self.begin(LC.State.lastSlot()); } });
    if (has) opts.push({ label: 'Load Game', fn: function () { self.slotMenu('load'); } });
    opts.push({ label: 'New Game', fn: function () { self.slotMenu('new'); } });
    opts.push({ label: 'Play with Friends', fn: function () { self.openLobby(); } });
    this.setOptions(opts, sel || 0, has ? 28 : 30, has ? 40 : 44, has ? 446 : 458);
  }
  // pick a save slot to load, or to start a new farm in (a used slot asks twice before it is overwritten)
  slotMenu(mode, sel) {
    var self = this, opts = [];
    this.inSlots = true; this.slotMode = mode;
    this.heading.setText(mode === 'load' ? 'Load which farm?' : 'Start a new farm in which slot?');
    if (this.hint) this.hint.setVisible(false);
    for (var n = 1; n <= LC.SAVE_SLOTS; n++) (function (n) {
      var info = LC.State.slotInfo(n);
      var label = 'Slot ' + n + ':  ' + (info ? 'Day ' + info.day + '  ·  Pelita Lv ' + info.level + '  ·  ' + info.kepeng + ' kepeng' : 'empty');
      opts.push({ label: label, slot: n, used: !!info, fn: function () {
        if (mode === 'load') { if (info) self.begin(n); else LC.Audio.sfx('error'); return; }
        if (info && self.armed !== n) { self.armed = n; LC.Audio.sfx('click'); self.renderOpts(); return; }
        self.begin(n, true);
      } });
    })(n);
    opts.push({ label: 'Back', fn: function () { LC.Audio.sfx('click'); self.mainMenu(); } });
    this.armed = 0;
    this.setOptions(opts, sel === undefined ? (mode === 'load' ? LC.State.lastSlot() - 1 : 0) : sel, 22, 40, 446);
  }

  renderOpts() {
    var self = this;
    this.optTexts.forEach(function (t, k) {
      var on = k === self.sel, o = self.options[k], lab = o.label;
      if (o.slot && self.armed === o.slot) lab = 'Slot ' + o.slot + ': overwrite this farm? Press again';
      t.setText(on ? '>  ' + lab + '  <' : lab);
      t.setColor(o.slot && self.armed === o.slot ? '#ff9a7a' : on ? '#ffd166' : o.slot && !o.used && self.slotMode === 'load' ? '#7a6a5a' : '#cdb8a0');
    });
  }

  choose() { if (!this.starting) this.options[this.sel].fn(); }

  // v1.7.1: "a new version is ready", with its date and time, between the title and Pelita
  // v2.4.2: on an iPhone or iPad in Safari, how to put the game on the Home Screen (where it plays like an app)
  showInstall() {
    var st = function (size, color) { return { fontFamily: LC.FONT, fontSize: size + 'px', color: color, stroke: '#1a120c', strokeThickness: 3 }; };
    var t1 = this.add.text(0, 6, 'Play it like an app: put it on your Home Screen', st(19, '#ffd166')).setOrigin(0.5, 0);
    var t2 = this.add.text(0, 31, 'In Safari, tap Share (or the ... button first), then Add to Home Screen, and open it from there', st(16, '#9be15d')).setOrigin(0.5, 0);
    var w = Math.max(t1.width, t2.width) + 32, h = 56, bg = this.add.graphics();
    bg.fillStyle(0x1e1510, 0.88); bg.fillRoundedRect(-w / 2, 0, w, h, 8);
    bg.lineStyle(2, 0x9be15d, 1); bg.strokeRoundedRect(-w / 2, 0, w, h, 8);
    this.iosBox = this.add.container(this.cx, 176 + this.dy, [bg, t1, t2]).setDepth(49).setAlpha(0);
    this.tweens.add({ targets: this.iosBox, alpha: 1, duration: 500 });
  }
  showUpdate() {
    if (this.updBox || !LC.Update.newer()) return;
    if (this.iosBox) { this.iosBox.destroy(); this.iosBox = null; }   // (the update news takes its place)
    var self = this, v = LC.Update.info, cx = this.cx, y = 176 + this.dy, touch = this.sys.game.device.input.touch || LC.PLATFORM === 'android';
    var st = function (size, color) { return { fontFamily: LC.FONT, fontSize: size + 'px', color: color, stroke: '#1a120c', strokeThickness: 3 }; };
    var t1 = this.add.text(0, 6, 'New version ' + v.name + ' is ready!  (updated ' + LC.Update.when(v.built) + ')', st(17, '#ffd166')).setOrigin(0.5, 0);
    var t2 = this.add.text(0, 28, (touch ? 'Tap here' : 'Click here or press U') + ' to ' + LC.Update.verb() + ' it  ·  you have ' + LC.Update.current().name, st(14, '#9be15d')).setOrigin(0.5, 0);
    var w = Math.max(t1.width, t2.width) + 32, h = 50;
    var bg = this.add.graphics();
    bg.fillStyle(0x1e1510, 0.88); bg.fillRoundedRect(-w / 2, 0, w, h, 8);
    bg.lineStyle(2, 0xffd166, 1); bg.strokeRoundedRect(-w / 2, 0, w, h, 8);
    var box = this.updBox = this.add.container(cx, y, [bg, t1, t2]).setDepth(50).setAlpha(0);
    this.add.zone(cx - w / 2, y, w, h).setOrigin(0).setDepth(51).setInteractive({ useHandCursor: true }).on('pointerdown', function () { self.getUpdate(); });
    this.tweens.add({ targets: box, alpha: 1, duration: 500 });
    this.tweens.add({ targets: t2, alpha: 0.5, duration: 800, yoyo: true, repeat: -1 });
    LC.Audio.sfx('chime');
  }
  getUpdate() {
    LC.Audio.init(); LC.Audio.sfx('click');
    if (!LC.Update.download()) return;
    if (this.updHint) this.updHint.destroy();
    var t = this.updHint = this.add.text(this.cx, 384 + this.dy, LC.Update.howTo(), { fontFamily: LC.FONT, fontSize: '15px', color: '#fbecc8', stroke: '#1a120c', strokeThickness: 4, align: 'center', wordWrap: { width: 720 } }).setOrigin(0.5).setDepth(50);
    this.tweens.add({ targets: t, alpha: 0, delay: 9000, duration: 800, onComplete: function () { t.destroy(); } });
  }

  // slot: which save slot · fresh: start a new farm there
  begin(slot, fresh) {
    if (LC.Net.role) LC.Net.leave();
    if (fresh || !LC.State.load(slot)) LC.State.newGame(slot);
    this.go();
  }
  go() {
    var self = this;
    this.starting = true;
    LC.Audio.init(); LC.Audio.sfx('chime');
    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', function () { self.scene.start('World'); });
  }

  // co-op: the host plays one of their saved farms (picked in the lobby); a guest plays on the host's farm with their own bag
  openLobby() {
    var self = this;
    LC.Audio.init();
    LC.Lobby.open({
      onHosted: function (code, slot) { slot = slot || LC.State.lastSlot(); if (!LC.State.load(slot)) LC.State.newGame(slot); self.go(); },
      onJoined: function (w) { LC.State.makeGuest(w.world); self.go(); }
    });
  }

  update(time) {
    this.flies.forEach(function (f) {
      f.img.x = f.bx + Math.sin(time / 1000 * f.sp + f.ph) * 22;
      f.img.y = f.by + Math.cos(time / 1300 * f.sp + f.ph * 1.3) * 14;
      f.img.setAlpha(0.35 + 0.65 * Math.abs(Math.sin(time / 500 * f.sp + f.ph)));
    });
  }
};
