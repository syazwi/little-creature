/* World, part 17 (v2.6): riding Naga Kecil (the Chapter 8 reward), and livelier fights everywhere.
 *  - the Seruling Naga is a 'vehicle': hold it and press USE, or press R (under the sea R always calls the naga). Naga
 *    Kecil swims under the sea and goes anywhere a basikal can; you sit on its back (co-op friends see it too). Swing a
 *    weapon while you ride and it sends a jet of water flying ahead, knocking back whatever it hits.
 *  - every fight: streaks fly from each blow, foes squash when struck, bubbles (or dust) burst, a ring and a little
 *    light rise from each foe that is beaten, a "!" warns of every wind-up, and a red ring marks a blow you take.
 * Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var proto = LC.WorldScene.prototype;
  var DIRV = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] }, ANG = { right: 0, down: 90, left: 180, up: -90 };
  var ADD = function () { return Phaser.BlendModes.ADD; };
  var NOPE = 'Naga Kecil cannot squeeze in here. (Under the sea, and wherever a basikal can go.)';

  // ---------------------------------------------------------------- riding Naga Kecil
  var canRide = proto.canRide;
  proto.canRide = function (kind) {
    if (kind === 'naga') return LC.hasNagaRide() && !!(this.A.underwater || (this.A.ride && this.A.ride.bike));
    return canRide.call(this, kind);
  };
  var toggleRide = proto.toggleRide;
  proto.toggleRide = function (kind) {
    var S = this.S;
    if (!kind && !S.riding && LC.hasNagaRide() && LC.State.count('seruling_naga') && !this.sleeping && !this.leaving && !this.fishing) {
      var sel = LC.State.selItem(), held = !!(sel && sel.id === 'seruling_naga');
      var wheels = LC.State.count('basikal') && canRide.call(this, 'bike');
      if (held || this.A.underwater || !wheels) {
        if (this.canRide('naga')) { this.setRide('naga'); return; }
        this.toast(NOPE, 'i_seruling_naga'); LC.Audio.sfx('error'); return;
      }
    }
    return toggleRide.apply(this, arguments);
  };
  var setRide = proto.setRide;
  proto.setRide = function (kind) {
    var was = this.S.riding;
    if (kind !== 'naga') {
      var r = setRide.apply(this, arguments);
      if (was === 'naga' && !kind) this.nagaPuff(false);
      return r;
    }
    this.S.riding = 'naga';
    LC.Audio.sfx('splash');
    this.nagaPuff(true);
    this.drawRider(this.player, 'naga', this.dir, false, this.veh, this.pc);
  };
  var drawRider = proto.drawRider;
  proto.drawRider = function (spr, ride, dir, moving, veh, color) {
    if (ride !== 'naga') return drawRider.apply(this, arguments);
    var side = dir === 'left' || dir === 'right', key = side ? 'side' : dir, f = Math.floor(this.time.now / (moving ? 150 : 420)) % 2;
    var bob = Math.round(Math.sin(this.time.now / 280));
    spr.setVisible(true).setOrigin(0.5, 1.4 + bob / 20);
    if (spr.anims && spr.anims.isPlaying) spr.stop();
    spr.setTexture(LC.Art.plKey(color || 0) + '_' + key + '_0');
    veh.setVisible(true).setTexture('naga_ride_' + key + '_' + f).setPosition(Math.round(spr.x), Math.round(spr.y + 3 + bob)).setFlipX(dir === 'left').setDepth(spr.y + (dir === 'down' ? 0.5 : -0.5));
  };
  var toolAction = proto.toolAction;
  proto.toolAction = function (sl, it) {
    var self = this, S = this.S;
    if (it && it.kind === 'vehicle' && (it.ride === 'naga' || S.riding === 'naga')) {
      if (S.riding) return { label: S.riding === 'naga' ? 'Climb off Naga Kecil' : 'Hop off the basikal', ride: true, fn: function () { self.setRide(null); } };
      if (!this.canRide('naga')) return { label: '', tile: true, fn: function () { self.toast(NOPE, 'i_seruling_naga'); LC.Audio.sfx('error'); } };
      return { label: 'Play the flute: ride Naga Kecil', ride: true, fn: function () { self.setRide('naga'); } };
    }
    return toolAction.apply(this, arguments);
  };
  proto.nagaPuff = function (on) {
    var p = this.player;
    if (!p || !this.fx) return;
    this.fx.bubble.explode(on ? 12 : 6, p.x, p.y - 6);
    this.fx.sparkle.explode(on ? 10 : 4, p.x, p.y - 8);
    if (on) this.shockwave(p.x, p.y - 4, 26, 0x8fe8ff);
  };
  // while you ride, every swing sends a jet of water ahead
  proto.nagaJet = function (onTravel) {
    var self = this, p = this.player, d = DIRV[this.dir], x = p.x + d[0] * 14, y = p.y - 12 + d[1] * 10, J = LC.NAGA_JET;
    var img = this.add.image(x, y, 'jet8').setDepth(9550).setAngle(ANG[this.dir]).setBlendMode(ADD());
    LC.Audio.sfx('splash');
    var hit = [], o = { t: 0 }, dist = J.speed * J.life;
    this.tweens.add({ targets: o, t: 1, duration: J.life * 1000, onUpdate: function () {
      if (!img.active || self.leaving) return;
      var nx = x + d[0] * dist * o.t, ny = y + d[1] * dist * o.t;
      if (onTravel) onTravel(nx, ny);
      img.setPosition(nx, ny).setScale(1 + o.t * 0.7, 1 - o.t * 0.2);
      if (Math.random() < 0.45) self.fx.bubble.explode(1, nx, ny);
      (self.enemies || []).forEach(function (e) {
        if (hit.indexOf(e) >= 0 || e.dead || e.away) return;
        var ex = e.spr.x, ey = e.spr.y - e.spr.height / 2;
        if (Math.hypot(ex - nx, ey - ny) > e.def.w + 8) return;
        hit.push(e);
        var n = J.dmg + Math.floor((self.S.str || 0) / 40);
        e.hp -= n; e.hurtT = 0.12; e.spr.setTintFill(0xbfe8ff);
        if (!(e.stoneT > 0)) { var k = e.def.boss ? 50 : 150; e.kx = d[0] * k; e.ky = d[1] * k; e.windT = 0; }
        self.fx.drop.explode(6, ex, ey); self.fx.bubble.explode(4, ex, ey);
        self.ui.floatText(ex, ey - 14, String(n), '#bfe8ff');
        if (e.hp <= 0) self.enemyDie(e);
      });
    }, onComplete: function () { if (img.active) { self.fx.drop.explode(5, img.x, img.y); img.destroy(); } } });
  };
  LC.NAGA_JET = { speed: 300, life: 0.5, dmg: 3 };

  // ---------------------------------------------------------------- livelier fights (everywhere)
  var attack = proto.attack;
  proto.attack = function () {
    var before = this.swingCd, hp = (this.enemies || []).map(function (e) { return e.hp; });
    var r = attack.apply(this, arguments);
    if (before <= 0 && this.swingCd > 0) {   // (a swing happened)
      this.fightFx(hp);
      var p = this.player;
      if (this.A.underwater) this.fx.bubble.explode(2, p.x, p.y - 8); else this.fx.dirt.explode(2, p.x, p.y);
      if (this.S.riding === 'naga') this.nagaJet();
    }
    return r;
  };
  proto.fightFx = function (before) {
    var self = this, p = this.player, uw = this.A.underwater;
    (this.enemies || []).forEach(function (e, i) {
      if (before[i] === undefined || !(e.hp < before[i])) return;
      var s = e.spr, ex = s.x, ey = s.y - s.height / 2, ang = Math.atan2(ey - (p.y - 8), ex - p.x);
      var g = self.add.graphics().setDepth(9601).setBlendMode(ADD());
      for (var k = 0; k < 6; k++) {   // streaks flying out from the blow
        var a = ang + (Math.random() - 0.5) * 1.7, r0 = 3 + Math.random() * 3, r1 = r0 + 6 + Math.random() * 9;
        g.lineStyle(k % 2 ? 1 : 2, k % 2 ? 0xffffff : 0xfff2b0, 0.95);
        g.lineBetween(ex + Math.cos(a) * r0, ey + Math.sin(a) * r0, ex + Math.cos(a) * r1, ey + Math.sin(a) * r1);
      }
      self.tweens.add({ targets: g, alpha: 0, duration: 170, onComplete: function () { g.destroy(); } });
      if (uw) self.fx.bubble.explode(4, ex, ey); else self.fx.dirt.explode(3, s.x, s.y - 2);
      if (e.dead) {   // beaten: a ring, and a little light rising
        self.shockwave(ex, ey, e.def.boss ? 70 : 32, 0xffe8a0);
        var soul = self.add.image(ex, ey, 'glow').setBlendMode(ADD()).setDepth(9600).setScale(0.3).setTint(0xfff0c0).setAlpha(0.8);
        self.tweens.add({ targets: soul, y: ey - 28, scale: 0.05, alpha: 0, duration: 750, ease: 'Quad.easeOut', onComplete: function () { soul.destroy(); } });
      } else if (!(e.stoneT > 0)) {   // squash with the blow
        self.tweens.add({ targets: s, scaleX: 1.18, scaleY: 0.84, duration: 60, yoyo: true, onComplete: function () { if (!e.dead && !(e.stoneT > 0)) s.setScale(1); } });
      }
    });
  };
  var playerHurt = proto.playerHurt;
  proto.playerHurt = function (dmg, e) {
    var before = this.S.hp, r = playerHurt.apply(this, arguments), p = this.player;
    if (p && this.S.hp < before && !this.leaving) {
      this.shockwave(p.x, p.y - 8, 22, 0xff6a6a);
      if (this.A.underwater) this.fx.bubble.explode(6, p.x, p.y - 10); else this.fx.dirt.explode(4, p.x, p.y);
    }
    return r;
  };
  // a "!" over every foe that winds up to strike
  proto.updateFightFx = function () {
    var self = this;
    (this.enemies || []).forEach(function (e) {
      if (e.dead || e.away) { e.warned = false; return; }
      if (e.windT > 0 && !e.warned) {
        e.warned = true;
        if (Math.hypot(e.spr.x - self.player.x, e.spr.y - self.player.y) < 220) self.ui.floatText(e.spr.x, e.spr.y - e.spr.height - 4, '!', '#ff7a6a');
      } else if (e.windT <= 0) e.warned = false;
    });
  };
  var updateKampong = proto.updateKampong;
  proto.updateKampong = function (time, dt) { updateKampong.apply(this, arguments); if (this.player) this.updateFightFx(); };
})(window.LC);
