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
    for (var i = 0; i < Math.round(70 * sx); i++) {
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
    for (i = 0; i < Math.round(26 * sx); i++) {
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
    for (i = 0; i < Math.round(30 * sx); i++) {
      var f = this.add.image(Math.random() * W, 330 + dy + Math.random() * 200, 'firefly').setScale(2).setBlendMode(Phaser.BlendModes.ADD);
      this.flies.push({ img: f, bx: f.x, by: f.y, ph: Math.random() * 10, sp: 0.5 + Math.random() });
    }
    // Pelita
    this.add.image(cx, 300 + dy, 'glow').setScale(3.2).setTint(0xb8a8ff).setAlpha(0.55).setBlendMode(Phaser.BlendModes.ADD);
    this.ghost = this.add.image(cx, 300 + dy, 'ghost_2_happy').setScale(6);
    this.tweens.add({ targets: this.ghost, y: 288 + dy, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    this.add.text(cx, 92 + dy, 'Little Creature', { fontFamily: LC.FONT, fontSize: '76px', fontStyle: '700', color: '#ffd166', stroke: '#2a1d18', strokeThickness: 10 }).setOrigin(0.5);
    this.add.text(cx, 156 + dy, 'a spirit-keeping farm tale from the kampung', { fontFamily: LC.FONT, fontSize: '22px', color: '#fbecc8', stroke: '#2a1d18', strokeThickness: 5 }).setOrigin(0.5);

    this.hasSave = LC.State.hasSave();
    this.options = [{ label: 'New Game', fn: function () { self.begin(false); } }];
    if (this.hasSave) this.options.unshift({ label: 'Continue', fn: function () { self.begin(true); } });
    this.options.push({ label: 'Play with Friends', fn: function () { self.openLobby(); } });
    this.sel = data && data.sel < this.options.length ? data.sel : 0;
    this.optTexts = this.options.map(function (o, k) {
      var t = self.add.text(cx, 458 + dy + k * 44, o.label, { fontFamily: LC.FONT, fontSize: '30px', color: '#fbecc8', stroke: '#2a1d18', strokeThickness: 6 }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      t.on('pointerover', function () { self.sel = k; self.renderOpts(); });
      t.on('pointerdown', function () { self.sel = k; self.choose(); });
      return t;
    });
    this.renderOpts();
    var touch = this.sys.game.device.input.touch || LC.PLATFORM === 'android';
    this.add.text(cx, 600 + dy, touch ? 'Tap to choose  ·  drag the left side to walk  ·  USE to interact  ·  II to pause'
      : 'WASD / Arrows to move  ·  E to interact  ·  1-9 hotbar  ·  Tab bag  ·  M music' + (LC.canFullscreen() ? '  ·  F fullscreen' : ''),
      { fontFamily: LC.FONT, fontSize: '16px', color: '#cdb8a0', stroke: '#1a120c', strokeThickness: 4 }).setOrigin(0.5);
    this.add.text(W - 10, H - 8, 'Made with Phaser 3 · art & music generated in code', { fontFamily: LC.FONT, fontSize: '12px', color: '#8a7a9a' }).setOrigin(1, 1);

    this.input.keyboard.on('keydown', function (ev) {
      if (LC.Lobby.isOpen) return;
      LC.Audio.init();
      if (ev.code === 'ArrowUp' || ev.code === 'KeyW') { self.sel = (self.sel + self.options.length - 1) % self.options.length; self.renderOpts(); LC.Audio.sfx('click'); }
      else if (ev.code === 'ArrowDown' || ev.code === 'KeyS') { self.sel = (self.sel + 1) % self.options.length; self.renderOpts(); LC.Audio.sfx('click'); }
      else if (ev.code === 'Enter' || ev.code === 'KeyE' || ev.code === 'Space') self.choose();
      else if (ev.code === 'KeyF' && LC.canFullscreen()) LC.toggleFullscreen();
    });
    this.input.on('pointerdown', function () { LC.Audio.init(); });
    if (!(data && data.quiet)) this.cameras.main.fadeIn(500);
    this.starting = false;

    // Redraw for the new shape when the window is resized, rotated or goes fullscreen.
    var w0 = W, h0 = H;
    function onResize() {
      if (self.starting || (self.scale.width === w0 && self.scale.height === h0)) return;
      self.scene.restart({ quiet: true, sel: self.sel });
    }
    this.scale.on('resize', onResize);
    this.events.once('shutdown', function () { self.scale.off('resize', onResize); });
  }

  renderOpts() {
    var self = this;
    this.optTexts.forEach(function (t, k) {
      var on = k === self.sel;
      t.setText(on ? '>  ' + self.options[k].label + '  <' : self.options[k].label);
      t.setColor(on ? '#ffd166' : '#cdb8a0');
    });
  }

  choose() { if (!this.starting) this.options[this.sel].fn(); }

  begin(cont) {
    if (LC.Net.role) LC.Net.leave();
    if (!(cont && LC.State.load())) LC.State.newGame();
    this.go();
  }
  go() {
    var self = this;
    this.starting = true;
    LC.Audio.init(); LC.Audio.sfx('chime');
    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', function () { self.scene.start('World'); });
  }

  // co-op: the host plays their own saved farm; a guest plays on the host's farm with their own bag
  openLobby() {
    var self = this;
    LC.Audio.init();
    LC.Lobby.open({
      onHosted: function () { if (!LC.State.load()) LC.State.newGame(); self.go(); },
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
