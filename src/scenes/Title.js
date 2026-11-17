/* Title screen: dusk over the river, Pelita bobbing, fireflies. */
window.LC = window.LC || {};
LC.TitleScene = class extends Phaser.Scene {
  constructor() { super('Title'); }

  create() {
    var W = 960, H = 640, self = this;
    LC.Audio.setNight(true);   // dusk on the title screen: slow music, crickets and frogs
    var g = this.add.graphics();
    g.fillGradientStyle(0x1f1840, 0x1f1840, 0xd9805a, 0xd9805a, 1); g.fillRect(0, 0, W, 430);
    for (var i = 0; i < 70; i++) {
      var s = this.add.image(Math.random() * W, Math.random() * 250, 'px').setScale(0.25 + Math.random() * 0.35).setAlpha(0.3 + Math.random() * 0.7);
      this.tweens.add({ targets: s, alpha: 0.1, duration: 900 + Math.random() * 1800, yoyo: true, repeat: -1, delay: Math.random() * 1500 });
    }
    this.add.image(790, 120, 'glow').setScale(4).setTint(0xffe8b0).setAlpha(0.45).setBlendMode(Phaser.BlendModes.ADD);
    this.add.circle(790, 120, 34, 0xfff1d0);
    // distant hills
    var h = this.add.graphics();
    h.fillStyle(0x3a2a55, 1); h.fillPoints([{ x: 0, y: 430 }, { x: 0, y: 330 }, { x: 140, y: 290 }, { x: 300, y: 350 }, { x: 470, y: 300 }, { x: 640, y: 360 }, { x: 820, y: 310 }, { x: 960, y: 350 }, { x: 960, y: 430 }], true);
    h.fillStyle(0x2a1f42, 1); h.fillPoints([{ x: 0, y: 430 }, { x: 0, y: 380 }, { x: 200, y: 360 }, { x: 380, y: 395 }, { x: 560, y: 370 }, { x: 760, y: 400 }, { x: 960, y: 375 }, { x: 960, y: 430 }], true);
    // river
    var r = this.add.graphics();
    r.fillGradientStyle(0x3b3266, 0x3b3266, 0x16122a, 0x16122a, 1); r.fillRect(0, 430, W, 210);
    for (i = 0; i < 26; i++) {
      var ln = this.add.rectangle(Math.random() * W, 440 + Math.random() * 190, 20 + Math.random() * 60, 2, 0xffc890, 0.25 + Math.random() * 0.25);
      this.tweens.add({ targets: ln, x: ln.x + 30, alpha: 0.05, duration: 2000 + Math.random() * 2000, yoyo: true, repeat: -1 });
    }
    // silhouettes
    var SIL = 0x170f2a;
    this.add.image(120, 440, 'palm').setOrigin(0.5, 1).setScale(4.5).setTint(SIL);
    this.add.image(230, 445, 'palm_f').setOrigin(0.5, 1).setScale(3.6).setFlipX(true).setTint(SIL);
    this.add.image(330, 440, 'house').setOrigin(0.5, 1).setScale(2.6).setTint(SIL);
    this.add.image(468, 440, 'spirit_house').setOrigin(0.5, 1).setScale(2.6).setTint(SIL);
    this.add.image(840, 445, 'palm').setOrigin(0.5, 1).setScale(4.2).setFlipX(true).setTint(SIL);
    this.add.image(720, 440, 'banana_f').setOrigin(0.5, 1).setScale(3).setTint(SIL);
    // fireflies
    this.flies = [];
    for (i = 0; i < 30; i++) {
      var f = this.add.image(Math.random() * W, 330 + Math.random() * 200, 'firefly').setScale(2).setBlendMode(Phaser.BlendModes.ADD);
      this.flies.push({ img: f, bx: f.x, by: f.y, ph: Math.random() * 10, sp: 0.5 + Math.random() });
    }
    // Pelita
    this.add.image(480, 300, 'glow').setScale(3.2).setTint(0xb8a8ff).setAlpha(0.55).setBlendMode(Phaser.BlendModes.ADD);
    this.ghost = this.add.image(480, 300, 'ghost_2_happy').setScale(6);
    this.tweens.add({ targets: this.ghost, y: 288, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    this.add.text(W / 2, 92, 'Little Creature', { fontFamily: LC.FONT, fontSize: '76px', fontStyle: '700', color: '#ffd166', stroke: '#2a1d18', strokeThickness: 10 }).setOrigin(0.5);
    this.add.text(W / 2, 156, 'a spirit-keeping farm tale from the kampung', { fontFamily: LC.FONT, fontSize: '22px', color: '#fbecc8', stroke: '#2a1d18', strokeThickness: 5 }).setOrigin(0.5);

    this.hasSave = LC.State.hasSave();
    this.options = [{ label: 'New Game', fn: function () { self.begin(false); } }];
    if (this.hasSave) this.options.unshift({ label: 'Continue', fn: function () { self.begin(true); } });
    this.options.push({ label: 'Play with Friends', fn: function () { self.openLobby(); } });
    this.sel = 0;
    this.optTexts = this.options.map(function (o, k) {
      var t = self.add.text(W / 2, 458 + k * 44, o.label, { fontFamily: LC.FONT, fontSize: '30px', color: '#fbecc8', stroke: '#2a1d18', strokeThickness: 6 }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      t.on('pointerover', function () { self.sel = k; self.renderOpts(); });
      t.on('pointerdown', function () { self.sel = k; self.choose(); });
      return t;
    });
    this.renderOpts();
    var touch = this.sys.game.device.input.touch || LC.PLATFORM === 'android';
    this.add.text(W / 2, 600, touch ? 'Tap to choose  ·  drag the left side to walk  ·  USE to interact  ·  II to pause' : 'WASD / Arrows to move  ·  E to interact  ·  1-9 hotbar  ·  Tab bag  ·  M music',{ fontFamily: LC.FONT, fontSize: '16px', color: '#cdb8a0', stroke: '#1a120c', strokeThickness: 4 }).setOrigin(0.5);
    this.add.text(W - 10, H - 8, 'Made with Phaser 3 · art & music generated in code', { fontFamily: LC.FONT, fontSize: '12px', color: '#8a7a9a' }).setOrigin(1, 1);

    this.input.keyboard.on('keydown', function (ev) {
      if (LC.Lobby.isOpen) return;
      LC.Audio.init();
      if (ev.code === 'ArrowUp' || ev.code === 'KeyW') { self.sel = (self.sel + self.options.length - 1) % self.options.length; self.renderOpts(); LC.Audio.sfx('click'); }
      else if (ev.code === 'ArrowDown' || ev.code === 'KeyS') { self.sel = (self.sel + 1) % self.options.length; self.renderOpts(); LC.Audio.sfx('click'); }
      else if (ev.code === 'Enter' || ev.code === 'KeyE' || ev.code === 'Space') self.choose();
    });
    this.input.on('pointerdown', function () { LC.Audio.init(); });
    this.cameras.main.fadeIn(500);
    this.starting = false;
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
