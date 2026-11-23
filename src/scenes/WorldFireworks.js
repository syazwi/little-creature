/* Shared fireworks for celebrations and story scenes. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var W = LC.WorldScene.prototype;
  var colors = [[0xff4a4a, 0xffd0a0], [0x4ab0ff, 0xd0f0ff], [0x5ae05a, 0xe0ffd0], [0xffd23a, 0xfff2b0], [0xd070ff, 0xffd0ff], [0xff8a3a, 0xffe0a0]];
  var create = W.createKampong;
  W.createKampong = function () {
    create.apply(this, arguments);
    this.fireworkEmitters = null;
  };

  W.fwEmitters = function () {
    if (this.fireworkEmitters) return this.fireworkEmitters;
    var self = this;
    this.fireworkEmitters = colors.map(function (c) {
      var e = self.add.particles(0, 0, 'px', { emitting: false, speed: { min: 35, max: 120 }, lifespan: { min: 900, max: 1600 }, gravityY: 40,
        scale: { start: 0.95, end: 0 }, alpha: { start: 1, end: 0 }, tint: c, blendMode: 'ADD' }).setDepth(9650);
      var explode = e.explode;
      e.explode = function (count, x, y) { return explode.call(this, LC.Display ? LC.Display.effectCount(count) : count, x, y); };
      return e;
    });
    return this.fireworkEmitters;
  };

  W.fwRocket = function (from, to, opts) {
    opts = opts || {};
    var self = this, E = this.fwEmitters(), index = Math.floor(Math.random() * E.length);
    var size = opts.small ? 0.5 : 1;
    var rocket = this.add.image(from.x, from.y, 'px').setScale(0.55 * size).setTint(0xffe0a0).setBlendMode(Phaser.BlendModes.ADD).setDepth(9640);
    var motion = opts.arc ? { t: 0 } : rocket;
    var move = opts.arc ? { t: 1 } : { x: to.x, y: to.y };
    LC.Audio.sfx('whizz14');
    return this.tweens.add(Object.assign(move, { targets: motion, duration: opts.duration || Phaser.Math.Between(650, 850), ease: 'Quad.easeOut',
      onUpdate: function () {
        if (opts.arc) {
          var t = motion.t;
          rocket.setPosition(from.x + (to.x - from.x) * t, from.y + (to.y - from.y) * t - 4 * opts.arc * t * (1 - t));
        }
        if (Math.random() < 0.5) self.fx.sparkle.explode(1, rocket.x, rocket.y + 2);
      },
      onComplete: function () {
        rocket.destroy();
        if (self.fireworkEmitters !== E) return;
        E[index].explode(Math.round((opts.grand ? 75 : 52) * size), to.x, to.y);
        if (Math.random() < 0.5 || opts.grand) E[(index + 2) % E.length].explode(Math.round((opts.grand ? 36 : 22) * size), to.x, to.y);
        var flash = self.add.image(to.x, to.y, 'glow').setBlendMode(Phaser.BlendModes.ADD).setTint(colors[index][0]).setScale(0.3 * size).setAlpha(0.9).setDepth(9645);
        self.tweens.add({ targets: flash, scale: (opts.grand ? 3.2 : 2.2) * size, alpha: 0, duration: 560, onComplete: function () { flash.destroy(); } });
        LC.Audio.sfx('boom14');
        if (Math.random() < 0.6) self.time.delayedCall(250, function () { LC.Audio.sfx('crackle14'); });
        if (opts.onBurst) opts.onBurst(to.x, to.y);
      }
    }));
  };

  W.fwShow = function (n, opts, done) {
    var self = this, cam = this.cameras.main;
    this.fwEmitters();
    function rocket(grand) {
      if (opts.active && !opts.active()) return;
      var view = cam.worldView, spot = opts.launch[Math.floor(Math.random() * opts.launch.length)];
      var x = spot.x * 16 + Phaser.Math.Between(-6, 6), y = spot.y * 16;
      var end = { x: Phaser.Math.Clamp(x + Phaser.Math.Between(-70, 70), view.x + view.width * 0.3, view.x + view.width * 0.7),
        y: view.y + view.height * Phaser.Math.FloatBetween(0.16, 0.36) };
      self.fwRocket({ x: x, y: y }, end, { grand: grand });
    }
    var t = 600;
    for (var i = 0; i < n; i++) { this.time.delayedCall(t, function () { rocket(false); }); t += Phaser.Math.Between(550, 900); }
    for (var g = 0; g < 4; g++) this.time.delayedCall(t + 300 + g * 120, function () { rocket(true); });
    if (opts.cheer) this.time.addEvent({ delay: 1500, repeat: Math.floor(t / 1500), callback: opts.cheer });
    if (done) this.time.delayedCall(t + 2600, done);
  };
})(window.LC);
