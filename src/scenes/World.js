/* World: the farm map, player, Pelita, crops, critters, day/night lighting and all interactions. */
window.LC = window.LC || {};
(function () {
  'use strict';
  var T = 16;
  var DIRV = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] };
  var SKY = [[360, 0x6c74b4], [450, 0xffffff], [1020, 0xffffff], [1090, 0xffc89a], [1150, 0x8a7ab8], [1230, 0x4a5294], [1440, 0x343c7a]];
  function lerpColor(a, b, t) {
    var ar = a >> 16 & 255, ag = a >> 8 & 255, ab = a & 255, br = b >> 16 & 255, bg = b >> 8 & 255, bb = b & 255;
    return (Math.round(ar + (br - ar) * t) << 16) | (Math.round(ag + (bg - ag) * t) << 8) | Math.round(ab + (bb - ab) * t);
  }
  function rint(n) { return Math.floor(Math.random() * n); }
  var clamp = function (v) { return Math.max(0, Math.min(100, v)); };

  LC.WorldScene = class extends Phaser.Scene {
    constructor() { super('World'); }

    create() {
      this.S = LC.State.s;
      this.W = LC.MAP_W; this.H = LC.MAP_H;
      this.grid = LC.buildMap();
      this.solid = []; this.objAt = [];
      for (var y = 0; y < this.H; y++) { this.solid.push(new Array(this.W).fill(false)); this.objAt.push(new Array(this.W).fill(null)); }
      this.sleeping = false;
      this.emote = 'normal'; this.emoteUntil = 0; this.curExpr = 'normal';
      this.cropSprites = {};
      this.offeringSprites = [];

      this.buildGround();
      this.buildObjects();
      this.buildDecor();
      this.refreshAllTiles();
      this.createPlayer();
      this.createGhost();
      this.createCritters();
      this.createLighting();
      this.createFx();
      this.refreshOfferings();

      var cam = this.cameras.main;
      cam.setBounds(0, 0, this.W * T, this.H * T);
      cam.setZoom(3);
      cam.startFollow(this.player, true, 0.2, 0.2);
      cam.setRoundPixels(true);
      cam.fadeIn(700);

      this.keys = this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT');
      this.cursorImg = this.add.image(0, 0, 'cursor').setOrigin(0).setDepth(8990).setVisible(false);
      this.waterFrame = 0;
      this.time.addEvent({ delay: 450, loop: true, callback: this.animateWater, callbackScope: this });

      this.scene.launch('UI');
      this.ui = this.scene.get('UI');
      this.wasFollowing = this.S.ghost.stage >= 1;
    }

    // ================================================================ build
    buildGround() {
      var TI = LC.Art.TI, data = [], rnd = new Phaser.Math.RandomDataGenerator(['kampung']), self = this;
      this.animTiles = [];
      for (var y = 0; y < this.H; y++) {
        var row = [];
        for (var x = 0; x < this.W; x++) {
          var ch = this.grid[y][x], idx = TI.G0;
          switch (ch) {
            case '.': var v = rnd.frac(); idx = v < 0.55 ? TI.G0 : v < 0.82 ? TI.G1 : v < 0.9 ? TI.G2 : TI.G3; break;
            case 'p': idx = TI.PATH; break;
            case 'f': idx = TI.FIELD; break;
            case 'r': idx = TI.PADDY0; this.animTiles.push({ x: x, y: y, k: 'paddy' }); break;
            case 'b': idx = TI.BUND; break;
            case 'w': idx = TI.RIV0; this.animTiles.push({ x: x, y: y, k: 'river' }); break;
            case 'S': idx = TI.SHORE0; this.animTiles.push({ x: x, y: y, k: 'shore' }); break;
            case 's': idx = TI.SAND; break;
            case 'j': idx = TI.JETTY; break;
            case 'J': idx = TI.JUN0 + ((x * 7 + y * 3) % 2); break;
            case 'F': idx = this.fenceIdx(x, y); break;
          }
          if (LC.SOLID_TILES[ch]) this.solid[y][x] = true;
          row.push(idx);
        }
        data.push(row);
      }
      var map = this.make.tilemap({ data: data, tileWidth: T, tileHeight: T });
      var ts = map.addTilesetImage('tiles');
      this.ground = map.createLayer(0, ts, 0, 0).setDepth(-10);
      this.animTiles.forEach(function (a) { a.tile = self.ground.getTileAt(a.x, a.y); });
    }

    fenceIdx(x, y) {
      var g = this.grid, TI = LC.Art.TI;
      function F(xx, yy) { return g[yy] && g[yy][xx] === 'F'; }
      var h = F(x - 1, y) || F(x + 1, y), v = F(x, y - 1) || F(x, y + 1);
      return h && v ? TI.FC : v ? TI.FV : TI.FH;
    }

    animateWater() {
      var TI = LC.Art.TI, f = ++this.waterFrame;
      this.animTiles.forEach(function (a) {
        if (!a.tile) return;
        if (a.k === 'river') a.tile.index = TI.RIV0 + ((a.x + a.y + f) % 3);
        else if (a.k === 'shore') a.tile.index = TI.SHORE0 + ((a.x + f) % 2);
        else a.tile.index = TI.PADDY0 + ((a.x + a.y + (f >> 1)) % 2);
      });
    }

    buildObjects() {
      var self = this, S = this.S;
      this.trees = {}; this.torches = [];
      LC.OBJECTS.forEach(function (o) {
        var w = o.w || 1, h = o.h || 1, bx = (o.x + w / 2) * T, by = (o.y + h) * T;
        if (o.type === 'warung') {
          self.add.image(bx, by, 'warung_back').setOrigin(0.5, 1).setDepth(by - 2);
          self.ani = self.add.sprite(bx, by - 12, 'npc_ani_0').setOrigin(0.5, 1).setDepth(by - 1);
          self.ani.play('ani_idle');
          self.add.image(bx, by, 'warung_front').setOrigin(0.5, 1).setDepth(by);
          self.warungPos = { x: bx, y: by };
          for (var ry = 5; ry < o.y; ry++) for (var rx = o.x; rx < o.x + w; rx++) self.solid[ry][rx] = true;  // behind the stall
        } else if (o.type === 'tree') {
          var spr = self.add.image(bx, by, o.kind + (S.trees[o.id] === 0 ? '_f' : '')).setOrigin(0.5, 1).setDepth(by);
          self.trees[o.id] = { o: o, spr: spr };
        } else if (o.type === 'torch') {
          var tr = self.add.image(bx, by, 'torch_off').setOrigin(0.5, 1).setDepth(by);
          self.torches.push({ o: o, spr: tr, x: bx, y: by - 28 });
        } else {
          var im = self.add.image(bx, by, o.tex).setOrigin(0.5, 1).setDepth(by);
          if (o.type === 'spirit') self.spiritPos = { x: bx, y: by };
          if (o.type === 'dapur') self.dapurPos = { x: bx, y: by };
          if (o.type === 'house') self.houseImg = im;
        }
        for (var yy = o.y; yy < o.y + h; yy++) for (var xx = o.x; xx < o.x + w; xx++) { self.solid[yy][xx] = true; self.objAt[yy][xx] = o; }
      });
    }

    buildDecor() {
      var rnd = new Phaser.Math.RandomDataGenerator(['decor-kampung']), types = ['rock', 'bush', 'hibiscus', 'lalang', 'lalang', 'bush'];
      var placed = 0, tries = 0, g = this.grid, self = this;
      function near(x, y) {
        for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
          var c = g[y + dy] && g[y + dy][x + dx];
          if (c === 'p' || c === 'f' || c === 'F' || c === 'b') return true;
          if (self.objAt[y + dy] && self.objAt[y + dy][x + dx]) return true;
        }
        return false;
      }
      while (placed < 55 && tries < 3000) {
        tries++;
        var x = rnd.between(1, 45), y = rnd.between(2, 27);
        if (g[y][x] !== '.' || this.solid[y][x] || near(x, y)) continue;
        var by = (y + 1) * T - 1;
        this.add.image(x * T + 8 + rnd.between(-3, 3), by, rnd.pick(types)).setOrigin(0.5, 1).setDepth(by);
        placed++;
      }
    }

    // ================================================================ tiles & crops
    refreshAllTiles() {
      var self = this;
      Object.keys(this.cropSprites).forEach(function (k) { self.cropSprites[k].destroy(); });
      this.cropSprites = {};
      for (var y = 0; y < this.H; y++) for (var x = 0; x < this.W; x++) {
        var ch = this.grid[y][x];
        if (ch === 'f' || ch === 'r') this.refreshTile(x, y);
      }
      Object.keys(this.trees || {}).forEach(function (id) {
        var t = self.trees[id]; t.spr.setTexture(t.o.kind + (self.S.trees[id] === 0 ? '_f' : ''));
      });
    }

    refreshTile(x, y) {
      var TI = LC.Art.TI, ch = this.grid[y][x], t = LC.State.tile(x, y), key = x + ',' + y;
      if (ch === 'f') this.ground.putTileAt(t && t.tilled ? (t.wet ? TI.WET : TI.TILLED) : TI.FIELD, x, y);
      var spr = this.cropSprites[key];
      if (t && t.crop) {
        var tex = 'crop_' + t.crop.id + '_' + LC.cropStage(t.crop);
        if (!spr) { spr = this.add.image(x * T + 8, (y + 1) * T, tex).setOrigin(0.5, 1).setDepth((y + 1) * T - 2); this.cropSprites[key] = spr; }
        else spr.setTexture(tex);
      } else if (spr) { spr.destroy(); delete this.cropSprites[key]; }
    }

    // ================================================================ player
    createPlayer() {
      this.player = this.add.sprite(4 * T + 8, 8 * T + 13, 'pl_down_0').setOrigin(0.5, 1);
      this.pShadow = this.add.image(this.player.x, this.player.y, 'shadow').setDepth(1);
      this.dir = 'down';
    }

    solidPx(px, py) {
      var tx = Math.floor(px / T), ty = Math.floor(py / T);
      if (tx < 0 || ty < 0 || tx >= this.W || ty >= this.H) return true;
      return this.solid[ty][tx];
    }
    blockedAt(x, y) {
      return this.solidPx(x - 5, y - 5) || this.solidPx(x + 5, y - 5) || this.solidPx(x - 5, y - 1) || this.solidPx(x + 5, y - 1);
    }

    updatePlayer(dt, blocked) {
      var k = this.keys, vx = 0, vy = 0, p = this.player, analog = 1;
      if (!blocked) {
        if (k.A.isDown || k.LEFT.isDown) vx -= 1;
        if (k.D.isDown || k.RIGHT.isDown) vx += 1;
        if (k.W.isDown || k.UP.isDown) vy -= 1;
        if (k.S.isDown || k.DOWN.isDown) vy += 1;
        if (!vx && !vy) {   // on-screen thumb-stick
          var tv = this.ui.touchVec();
          if (tv && Math.hypot(tv.x, tv.y) > 0.15) { vx = tv.x; vy = tv.y; analog = Math.max(0.4, Math.min(1, Math.hypot(vx, vy) * 1.2)); }
        }
      }
      if (vx || vy) {
        var len = Math.hypot(vx, vy), sp = (this.S.energy <= 0 ? 48 : 74) * dt * analog;
        var nx = p.x + vx / len * sp, ny = p.y + vy / len * sp;
        if (!this.blockedAt(nx, p.y)) p.x = nx;
        if (!this.blockedAt(p.x, ny)) p.y = ny;
        var ax = Math.abs(vx), ay = Math.abs(vy);
        if (ax > ay * 1.25) this.dir = vx < 0 ? 'left' : 'right';
        else if (ay > ax * 1.25) this.dir = vy < 0 ? 'up' : 'down';
        else if (!((this.dir === 'left' && vx < 0) || (this.dir === 'right' && vx > 0) || (this.dir === 'up' && vy < 0) || (this.dir === 'down' && vy > 0)))
          this.dir = vx < 0 ? 'left' : 'right';
        p.play('walk_' + (this.dir === 'left' || this.dir === 'right' ? 'side' : this.dir), true);
        if (p.x > (this.W - 2) * T && !this.edgeWarned) { this.edgeWarned = true; this.ui.toast(LC.TEXT.barrier); }
      } else {
        p.stop();
        p.setTexture('pl_' + (this.dir === 'left' || this.dir === 'right' ? 'side' : this.dir) + '_0');
      }
      p.setFlipX(this.dir === 'left');
      p.setDepth(p.y);
      this.pShadow.setPosition(Math.round(p.x), Math.round(p.y - 1));
    }

    facing() {
      var d = DIRV[this.dir], px = Math.floor(this.player.x / T), py = Math.floor((this.player.y - 3) / T);
      return { tx: px + d[0], ty: py + d[1], fx: this.player.x + d[0] * 12, fy: this.player.y - 4 + d[1] * 12 };
    }

    // ================================================================ ghost (Pelita)
    ghostHome() { return { x: this.spiritPos.x, y: this.spiritPos.y - 25 }; }
    ghostPos() { return { x: this.ghost.x, y: this.ghost.y }; }

    createGhost() {
      var h = this.ghostHome();
      this.gpos = { x: h.x, y: h.y };
      this.ghostGlow = this.add.image(h.x, h.y, 'glow').setBlendMode(Phaser.BlendModes.ADD).setDepth(9001).setTint(0xb8a8ff);
      this.ghostShadow = this.add.image(h.x, h.y + 18, 'shadow').setDepth(2).setAlpha(0.4);
      this.ghost = this.add.image(h.x, h.y, 'ghost_0_normal').setDepth(9002);
      this.bubbleIcon = this.add.image(0, -2, 'i_nasi');
      this.bubble = this.add.container(0, 0, [this.add.image(0, 0, 'bubble'), this.bubbleIcon]).setDepth(9003).setVisible(false);
    }

    setEmote(e, ms) { this.emote = e; this.emoteUntil = this.time.now + ms; }

    updateGhost(time, dt, blocked) {
      var S = this.S, g = S.ghost, home = this.ghostHome();
      var follow = g.stage >= 1 && g.joy >= 12;
      if (this.wasFollowing && !follow && g.stage >= 1) this.ui.toast('Pelita feels neglected and sulks back to its spirit house...', 'ic_joy');
      if (!this.wasFollowing && follow && g.stage >= 1 && this.followInit) this.ui.toast('Pelita floats over to join you again!', 'ic_joy');
      this.wasFollowing = follow; this.followInit = true;
      var tx, ty;
      if (follow) {
        var d = DIRV[this.dir];
        tx = this.player.x - d[0] * 14 + (d[1] !== 0 ? 11 : 0);
        ty = this.player.y - 18 - d[1] * 8;
      } else { tx = home.x; ty = home.y; }
      var k = Math.min(1, dt * 2.4);
      this.gpos.x += (tx - this.gpos.x) * k; this.gpos.y += (ty - this.gpos.y) * k;
      var bob = Math.sin(time / 380) * 2;
      var gx = Math.round(this.gpos.x), gy = Math.round(this.gpos.y + bob);
      this.ghost.setPosition(gx, gy);
      if (Math.abs(tx - this.gpos.x) > 1.5) this.ghost.setFlipX(tx < this.gpos.x);

      var expr = 'normal';
      if (time < this.emoteUntil) expr = this.emote;
      else if (g.full < 25 || g.joy < 20) expr = 'sad';
      else if (S.minutes >= 22 * 60) expr = 'sleepy';
      else if (g.joy >= 70) expr = 'happy';
      this.curExpr = expr;
      this.ghost.setTexture('ghost_' + g.stage + '_' + expr);
      var n = this.nightF || 0;
      this.ghost.setAlpha(0.78 + 0.22 * n);
      this.ghostGlow.setPosition(gx, gy).setScale(0.45 + g.glow / 100 * 0.55 + g.stage * 0.08).setAlpha((0.18 + 0.55 * n) * (0.4 + g.glow / 160));
      if (g.stage === 4) this.ghostGlow.setTint(0xffe08a);
      this.ghostShadow.setPosition(gx, Math.round(this.gpos.y + 19)).setAlpha(0.25 - 0.1 * n);

      var showBubble = !blocked && g.stage >= 1 && !g.cravingDone && (time % 10000) < 3400;
      this.bubble.setVisible(showBubble);
      if (showBubble) { this.bubble.setPosition(gx + 11, gy - 19); this.bubbleIcon.setTexture('i_' + g.craving); }

      var dx = gx - this.player.x, dy = gy - (this.player.y - 8);
      this.ghostNear = follow && Math.hypot(dx, dy) < 26;
    }

    // ================================================================ critters
    createCritters() {
      this.critters = [];
      var cz = LC.ZONES.chickens, kz = LC.ZONES.kerbau;
      for (var i = 0; i < 3; i++) {
        var p = this.randomFree(cz);
        var s = this.add.sprite(p.x, p.y, 'chicken_0').setOrigin(0.5, 1);
        this.critters.push({ kind: 'chicken', spr: s, zone: cz, speed: 16, tx: p.x, ty: p.y, wait: Math.random() * 2, anim: '' });
      }
      var kp = this.randomFree(kz);
      var ks = this.add.sprite(kp.x, kp.y, 'kerbau_0').setOrigin(0.5, 1);
      this.critters.push({ kind: 'kerbau', spr: ks, zone: kz, speed: 7, tx: kp.x, ty: kp.y, wait: 1, anim: '' });
    }
    randomFree(z) {
      for (var i = 0; i < 60; i++) {
        var x = (z.x0 + Math.random() * (z.x1 - z.x0 + 1)) * T, y = (z.y0 + Math.random() * (z.y1 - z.y0 + 1)) * T;
        if (!this.solidPx(x, y - 2) && !this.solidPx(x - 6, y - 2) && !this.solidPx(x + 6, y - 2)) return { x: x, y: y };
      }
      return { x: (z.x0 + 1) * T, y: (z.y0 + 1) * T };
    }
    updateCritters(dt) {
      var self = this;
      this.critters.forEach(function (c) {
        var s = c.spr;
        if (c.wait > 0) {
          c.wait -= dt;
          var idle = c.kind === 'chicken' ? 'chicken_peck' : null;
          if (idle && c.anim !== idle) { s.play(idle); c.anim = idle; }
          if (!idle && c.anim !== 'stand') { s.stop(); s.setTexture('kerbau_0'); c.anim = 'stand'; }
          if (c.wait <= 0) { var p = self.randomFree(c.zone); c.tx = p.x; c.ty = p.y; }
          return;
        }
        var dx = c.tx - s.x, dy = c.ty - s.y, d = Math.hypot(dx, dy);
        if (d < 1) { c.wait = 1 + Math.random() * 4; return; }
        var step = Math.min(d, c.speed * dt * (self.nightF > 0.6 ? 0.5 : 1)), nx = s.x + dx / d * step, ny = s.y + dy / d * step;
        var w = c.kind === 'kerbau' ? 10 : 4;
        var near = Math.hypot(nx - self.player.x, ny - self.player.y) < (c.kind === 'kerbau' ? 14 : 8);
        if (self.solidPx(nx - w, ny - 2) || self.solidPx(nx + w, ny - 2) || near) { c.wait = 0.6 + Math.random(); return; }
        s.x = nx; s.y = ny;
        s.setFlipX(dx < 0);
        var walk = c.kind === 'chicken' ? 'chicken_walk' : 'kerbau_walk';
        if (c.anim !== walk) { s.play(walk); c.anim = walk; }
        s.setDepth(s.y);
      });
    }
    critterAt(fx, fy) {
      for (var i = 0; i < this.critters.length; i++) {
        var c = this.critters[i], r = c.kind === 'kerbau' ? 16 : 10;
        if (Math.hypot(c.spr.x - fx, c.spr.y - 6 - fy) < r) return c;
      }
      return null;
    }

    // ================================================================ lighting
    createLighting() {
      var self = this;
      this.dark = this.add.image(0, 0, 'px').setOrigin(0).setDisplaySize(this.W * T, this.H * T).setDepth(9000).setBlendMode(Phaser.BlendModes.MULTIPLY).setVisible(false);
      this.lights = [];
      this.torches.forEach(function (t) { t.light = self.addLight(t.x, t.y + 2, 0xffa040, 1.5, true); });
      var hx = this.houseImg.x - 40, hy = this.houseImg.y - 96;
      this.addLight(hx + 18, hy + 46, 0xffc070, 0.7, true);
      this.addLight(hx + 62, hy + 46, 0xffc070, 0.7, true);
      this.addLight(this.dapurPos.x, this.dapurPos.y - 6, 0xff7a30, 0.9, true);
      this.warungLight = this.addLight(this.warungPos.x, this.warungPos.y - 34, 0xfff0b0, 1.8, false);
      this.spiritLight = this.addLight(this.spiritPos.x, this.spiritPos.y - 26, 0xd0b0ff, 1.0, false);
      this.playerLight = this.addLight(0, 0, 0xfff2d0, 1.3, false);
      this.playerLight.base = 0.35;
      this.flies = [];
      for (var i = 0; i < 28; i++) {
        var fx = 16 + Math.random() * (this.W * T - 32), fy = i < 20 ? 24 * T + Math.random() * 4 * T : 2 * T + Math.random() * 2 * T;
        var img = this.add.image(fx, fy, 'firefly').setBlendMode(Phaser.BlendModes.ADD).setDepth(9003).setAlpha(0);
        this.flies.push({ img: img, bx: fx, by: fy, ph: Math.random() * 10, sp: 0.4 + Math.random() });
      }
    }
    addLight(x, y, tint, scale, flicker) {
      var img = this.add.image(x, y, 'glow').setBlendMode(Phaser.BlendModes.ADD).setDepth(9001).setTint(tint).setScale(scale).setAlpha(0);
      var L = { img: img, base: 0.85, flicker: flicker, ph: Math.random() * 10 };
      this.lights.push(L);
      return L;
    }
    skyColor(m) {
      if (m <= SKY[0][0]) return SKY[0][1];
      for (var i = 1; i < SKY.length; i++) if (m <= SKY[i][0]) return lerpColor(SKY[i - 1][1], SKY[i][1], (m - SKY[i - 1][0]) / (SKY[i][0] - SKY[i - 1][0]));
      return SKY[SKY.length - 1][1];
    }
    updateLighting(time) {
      var S = this.S, col = this.skyColor(S.minutes);
      var lum = ((col >> 16 & 255) * 0.3 + (col >> 8 & 255) * 0.59 + (col & 255) * 0.11) / 255;
      var n = Phaser.Math.Clamp((1 - lum - 0.06) / 0.45, 0, 1);
      this.nightF = n;
      this.dark.setVisible(lum < 0.995).setTint(col);
      var hgn = LC.State.isHGN(), shopOpen = this.shopOpen();
      this.warungLight.base = shopOpen ? 0.8 : 0;
      this.spiritLight.base = 0.25 + S.ghost.glow / 100 * 0.7;
      this.playerLight.img.setPosition(this.player.x, this.player.y - 8);
      this.lights.forEach(function (L) {
        var f = L.flicker ? 0.86 + 0.14 * Math.sin(time / 90 + L.ph) * Math.sin(time / 37 + L.ph * 2) : 1;
        L.img.setAlpha(n * L.base * f);
      });
      var lit = n > 0.25;
      this.torches.forEach(function (t) {
        t.spr.setTexture(lit ? 'torch_on' : 'torch_off');
        t.light.img.setTint(hgn ? 0xff5040 : 0xffa040);
      });
      this.flies.forEach(function (f) {
        f.img.x = f.bx + Math.sin(time / 1000 * f.sp + f.ph) * 14;
        f.img.y = f.by + Math.cos(time / 1300 * f.sp + f.ph * 1.3) * 9;
        f.img.setAlpha(n * (0.3 + 0.7 * Math.abs(Math.sin(time / 420 * f.sp + f.ph))));
      });
      this.ani.setVisible(shopOpen);
      LC.Audio.setNight(S.minutes >= 19 * 60);
    }
    shopOpen() { return this.S.minutes >= LC.SHOP_OPEN && this.S.minutes < LC.SHOP_CLOSE; }

    // ================================================================ fx
    createFx() {
      var self = this;
      function mk(key, cfg) { var e = self.add.particles(0, 0, key, Object.assign({ emitting: false }, cfg)); e.setDepth(9500); return e; }
      this.fx = {
        heart: mk('heart', { speed: { min: 12, max: 30 }, angle: { min: 235, max: 305 }, lifespan: 1000, alpha: { start: 1, end: 0 }, gravityY: -15 }),
        sparkle: mk('sparkle', { speed: { min: 20, max: 55 }, lifespan: 800, alpha: { start: 1, end: 0 }, scale: { start: 1, end: 0.3 }, blendMode: 'ADD' }),
        leaf: mk('leaf', { speed: { min: 20, max: 45 }, angle: { min: 200, max: 340 }, gravityY: 90, lifespan: 750, alpha: { start: 1, end: 0 } }),
        drop: mk('drop', { speed: { min: 15, max: 35 }, angle: { min: 200, max: 340 }, gravityY: 130, lifespan: 500, alpha: { start: 1, end: 0.2 } }),
        dirt: mk('dirt', { speed: { min: 15, max: 35 }, angle: { min: 200, max: 340 }, gravityY: 130, lifespan: 450 }),
        smoke: mk('smoke', { speedY: { min: -16, max: -8 }, speedX: { min: -4, max: 4 }, lifespan: 1400, alpha: { start: 0.7, end: 0 }, scale: { start: 0.5, end: 1.5 } }),
        petal: mk('petal', { speed: { min: 6, max: 18 }, angle: { min: 60, max: 120 }, gravityY: 10, lifespan: 2200, alpha: { start: 1, end: 0 } })
      };
      this.incense = this.add.particles(this.spiritPos.x - 8, this.spiritPos.y - 31, 'smoke', {
        speedY: { min: -9, max: -5 }, speedX: { min: -2, max: 2 }, lifespan: 2000, alpha: { start: 0.45, end: 0 }, scale: { start: 0.3, end: 1 }, frequency: 380, emitting: false
      }).setDepth(9004);
      this.time.addEvent({ delay: 2600, loop: true, callback: function () {
        if (self.S.minutes > 17 * 60) self.fx.petal.explode(1, (12 * T + 8) + (Math.random() - 0.5) * 30, 5 * T);
      } });
    }

    refreshOfferings() {
      this.offeringSprites.forEach(function (s) { s.destroy(); });
      this.offeringSprites = [];
      var S = this.S, sx = this.spiritPos.x, sy = this.spiritPos.y - 23, self = this;
      var spots = { colok: [-8, 0], canang: [8, 0], malai: [0, 10] };
      var seen = {};
      S.offerings.forEach(function (id) {
        if (seen[id] || !spots[id]) return; seen[id] = 1;
        self.offeringSprites.push(self.add.image(sx + spots[id][0], sy + spots[id][1], 'off_' + id).setOrigin(0.5, 1).setDepth(self.spiritPos.y + 1));
      });
      if (seen.colok) this.incense.start(); else this.incense.stop();
    }

    // ================================================================ main loop
    update(time, delta) {
      if (!this.ui || !this.ui.ready) return;
      var dt = Math.min(delta, 50) / 1000, S = this.S, g = S.ghost;
      var blocked = this.ui.isBlocking() || this.sleeping;

      this.updatePlayer(dt, blocked);

      if (!blocked) {
        var dm = dt * LC.TIME_SCALE;
        S.minutes += dm;
        var hgn = LC.State.isHGN() ? 2 : 1;
        g.full = clamp(g.full - dm * (4 / 60) * hgn);
        g.joy = clamp(g.joy - dm * ((g.full < 30 ? 4 : 2) / 60));
        g.glow = clamp(g.glow - dm * (1 / 60));
        if (S.minutes >= LC.DAY_END) this.sleep(true);
        if (S.pendingStage.length) this.stageUp(S.pendingStage.shift());
        if (hgn === 2 && S.minutes >= 18 * 60 && S.flags.hgnWarnDay !== S.day) {
          S.flags.hgnWarnDay = S.day;
          this.ui.toast('Hungry Ghost Night has begun. The torches burn red... Pelita is ravenous!', 'ic_glow');
        }
      }

      this.updateGhost(time, dt, blocked);
      this.updateCritters(dt);
      this.updateLighting(time);

      var act = blocked ? null : this.getAction();
      this.ui.setPrompt(act && act.label);
      if (act && act.tile && !blocked) {
        var f = this.facing();
        this.cursorImg.setVisible(true).setPosition(f.tx * T, f.ty * T).setAlpha(act.label ? 0.6 + 0.3 * Math.sin(time / 150) : 0.25);
      } else this.cursorImg.setVisible(false);
    }

    // ================================================================ actions
    toast(m, icon) { this.ui.toast(m, icon); }

    getAction() {
      var S = this.S, self = this, sl = LC.State.selItem(), it = sl ? LC.ITEMS[sl.id] : null, f = this.facing(), tx = f.tx, ty = f.ty;
      if (tx < 0 || ty < 0 || tx >= this.W || ty >= this.H) return null;
      var o = this.objAt[ty][tx], isFood = !!(it && it.food);
      if (o) {
        switch (o.type) {
          case 'house': return { label: 'Sleep', fn: function () { self.ui.confirmSleep(); } };
          case 'spirit':
            if (isFood) return { label: 'Offer ' + it.name + ' to Pelita', fn: function () { self.feedGhost(sl.id); } };
            return { label: 'Spirit house', fn: function () { self.ui.openSpirit(); } };
          case 'dapur': return { label: 'Cook at the dapur', fn: function () { self.ui.openCook(); } };
          case 'well': return { label: 'Draw water', fn: function () { self.refillCan(); } };
          case 'warung': return { label: this.shopOpen() ? 'Shop at the warung' : 'Warung (closed)', fn: function () { self.ui.openShop(); } };
          case 'tree':
            var tr = LC.TREES[o.kind], ready = S.trees[o.id] === 0;
            return { label: ready ? 'Pick ' + LC.ITEMS[tr.fruit].name : tr.name, fn: function () { self.shakeTree(o); } };
          case 'torch': return { label: '', fn: function () { self.toast('A bamboo pelita torch. Nenek kept them burning every night.'); } };
          default: return { label: 'Look', fn: function () { self.ui.say([{ text: LC.TEXT[o.type] }]); } };
        }
      }
      var cr = this.critterAt(f.fx, f.fy);
      if (cr) return { label: 'Pet the ' + (cr.kind === 'kerbau' ? 'kerbau' : 'chicken'), fn: function () { self.petCritter(cr); } };
      if (isFood && this.ghostNear) return { label: 'Feed Pelita ' + it.name, fn: function () { self.feedGhost(sl.id); } };

      var ch = this.grid[ty][tx], t = LC.State.tile(tx, ty);
      if (t && t.crop && LC.cropStage(t.crop) === 3) return { label: 'Harvest ' + LC.CROPS[t.crop.id].name, tile: true, fn: function () { self.harvest(tx, ty); } };

      var ta = it ? this.toolAction(sl, it, ch, t, tx, ty) : null;
      if (ta && ta.label) return ta;
      if (this.ghostNear) return { label: 'Pet Pelita', fn: function () { self.petGhost(); } };
      if (ta) return ta;
      if (ch === 'w' || ch === 'S') return { label: '', fn: function () { self.toast(LC.TEXT.river); } };
      if (isFood) return { label: '', fn: function () { self.toast('Press X to eat it yourself, or bring it to Pelita.'); } };
      return null;
    }

    toolAction(sl, it, ch, t, tx, ty) {
      var self = this, S = this.S;
      function hint(m) { return { label: '', tile: true, fn: function () { self.toast(m); LC.Audio.sfx('error'); } }; }
      if (sl.id === 'hoe') {
        if (ch === 'f' && !(t && t.tilled)) return { label: 'Till soil', tile: true, fn: function () { self.till(tx, ty); } };
        if (ch === 'f' && t && t.crop) return hint('Careful! Something is growing there.');
        if (ch === 'f') return hint('Already tilled. Plant some seeds!');
        if (ch === 'r') return hint('No need to till the sawah. Plant padi seedlings straight into the water!');
        return hint('The ground here is too hard. Till inside the fenced field.');
      }
      if (sl.id === 'can') {
        if (ch === 'w' || ch === 'S') return { label: 'Fill gembor from the river', tile: true, fn: function () { self.refillCan(); } };
        if (t && t.tilled) {
          if (S.water <= 0) return hint('The gembor is empty. Refill it at the well or the river.');
          if (t.wet) return hint('Already watered today.');
          return { label: 'Water', tile: true, fn: function () { self.water(tx, ty); } };
        }
        if (ch === 'r') return hint('The sawah is already flooded. Rice needs no watering!');
        return hint('Water the tilled soil in the field.');
      }
      if (it.kind === 'seed') {
        var cd = LC.CROPS[it.crop];
        if (cd.paddy) {
          if (ch === 'r' && !(t && t.crop)) return { label: 'Plant ' + cd.name, tile: true, fn: function () { self.plant(tx, ty, sl.id); } };
          return hint(ch === 'r' ? 'Something is already growing there.' : 'Padi grows in the flooded sawah, east of the field.');
        }
        if (ch === 'f' && t && t.tilled && !t.crop) return { label: 'Plant ' + cd.name, tile: true, fn: function () { self.plant(tx, ty, sl.id); } };
        if (ch === 'r') return hint('Only padi grows in the flooded sawah.');
        if (ch === 'f' && t && t.crop) return hint('Something is already growing there.');
        return hint('Plant seeds in tilled soil. Use the Cangkul first.');
      }
      return null;
    }

    doAction() { if (this.sleeping) return; var a = this.getAction(); if (a) a.fn(); }

    useEnergy(n) {
      if (this.S.energy < n) { this.toast('You are exhausted... Eat something (X) or go to sleep.'); LC.Audio.sfx('error'); return false; }
      this.S.energy -= n; return true;
    }
    bump() { var p = this.player; this.tweens.add({ targets: p, scaleY: 0.88, duration: 70, yoyo: true }); }

    till(tx, ty) {
      if (!this.useEnergy(2)) return;
      var t = LC.State.ensureTile(tx, ty); t.tilled = true;
      this.refreshTile(tx, ty); this.fx.dirt.explode(7, tx * T + 8, ty * T + 10);
      LC.Audio.sfx('till'); this.bump(); this.S.flags.tilled = true;
    }
    water(tx, ty) {
      if (!this.useEnergy(1)) return;
      var t = LC.State.ensureTile(tx, ty); t.wet = true; this.S.water--;
      this.refreshTile(tx, ty); this.fx.drop.explode(9, tx * T + 8, ty * T + 6);
      LC.Audio.sfx('water'); this.bump(); this.S.flags.watered = true;
    }
    plant(tx, ty, seedId) {
      var t = LC.State.ensureTile(tx, ty);
      t.crop = { id: LC.ITEMS[seedId].crop, g: 0 };
      LC.State.remove(seedId, 1);
      this.refreshTile(tx, ty); this.fx.leaf.explode(3, tx * T + 8, ty * T + 10);
      LC.Audio.sfx('plant'); this.S.flags.planted = true;
    }
    harvest(tx, ty) {
      var t = LC.State.tile(tx, ty), def = LC.CROPS[t.crop.id];
      if (!LC.State.canAdd(def.item)) { this.toast('Your bag is full!'); LC.Audio.sfx('error'); return; }
      LC.State.add(def.item, def.count);
      t.crop = null;
      this.refreshTile(tx, ty); this.fx.leaf.explode(8, tx * T + 8, ty * T + 8);
      LC.Audio.sfx('harvest'); this.bump();
      this.toast('+' + def.count + ' ' + LC.ITEMS[def.item].name, 'i_' + def.item);
      this.S.flags.harvested = true;
    }
    refillCan() {
      if (!LC.State.count('can')) { this.toast('You need the gembor to carry water.'); return; }
      if (this.S.water >= this.S.maxWater) { this.toast('The gembor is already full.'); return; }
      this.S.water = this.S.maxWater;
      LC.Audio.sfx('water'); this.fx.drop.explode(6, this.player.x, this.player.y - 10);
      this.toast('The gembor is full. (' + this.S.maxWater + ' waterings)', 'i_can');
    }
    shakeTree(o) {
      var S = this.S, tr = LC.TREES[o.kind], spr = this.trees[o.id].spr;
      this.tweens.add({ targets: spr, x: spr.x + 1, duration: 50, yoyo: true, repeat: 3 });
      LC.Audio.sfx('shake');
      if (S.trees[o.id] > 0) { this.toast(tr.name + ': no ripe fruit yet. Check back in ' + S.trees[o.id] + ' day' + (S.trees[o.id] > 1 ? 's' : '') + '.'); return; }
      if (!LC.State.canAdd(tr.fruit)) { this.toast('Your bag is full!'); return; }
      LC.State.add(tr.fruit, tr.count);
      S.trees[o.id] = tr.regrow;
      spr.setTexture(o.kind);
      this.fx.leaf.explode(10, spr.x, spr.y - spr.height * 0.6);
      this.toast('+' + tr.count + ' ' + LC.ITEMS[tr.fruit].name, 'i_' + tr.fruit);
    }
    petCritter(c) {
      if (c.kind === 'kerbau') { LC.Audio.sfx('moo'); this.toast(LC.TEXT.kerbau); }
      else { LC.Audio.sfx('cluck'); this.toast(LC.TEXT.chicken); c.wait = 0; c.tx = c.spr.x + (Math.random() - 0.5) * 60; c.ty = c.spr.y + (Math.random() - 0.5) * 30; }
      this.fx.heart.explode(2, c.spr.x, c.spr.y - 12);
    }
    eat() {
      var S = this.S, sl = LC.State.selItem();
      if (!sl) return;
      var it = LC.ITEMS[sl.id];
      if (!it.food) { this.toast('You can\'t eat ' + it.name + '!'); return; }
      if (S.energy >= S.maxEnergy) { this.toast('You are not hungry right now.'); return; }
      LC.State.remove(sl.id, 1);
      var e = Math.round(it.food.full * 0.8) + 5;
      S.energy = Math.min(S.maxEnergy, S.energy + e);
      LC.Audio.sfx('eat');
      this.toast('You eat the ' + it.name + '. +' + e + ' energy' + (sl.id === 'cili' ? '  Pedas!!' : ''), it.icon);
    }

    // ---------------------------------------------------------------- Pelita care
    feedGhost(id) {
      var S = this.S, g = S.ghost, it = LC.ITEMS[id], self = this;
      if (g.full >= 97) { this.toast('Pelita is too full to eat another bite.'); this.setEmote('sleepy', 1500); LC.Audio.sfx('error'); return; }
      LC.State.remove(id, 1);
      g.full = clamp(g.full + it.food.full);
      var joy = it.food.joy, bond = it.kind === 'dish' ? 6 : it.kind === 'drink' ? 4 : 2, msg = 'Pelita munches happily.';
      if (LC.LOVES.indexOf(id) >= 0) { joy += 10; bond += 4; msg = 'Pelita LOVES ' + it.name + '!'; }
      if (LC.DISLIKES.indexOf(id) >= 0) msg = 'Pelita sneezes out a tiny flame. Too spicy!';
      var craving = id === g.craving && !g.cravingDone;
      g.joy = clamp(g.joy + joy);
      var b = LC.State.addBond(bond), gp = this.ghostPos();
      if (joy < 0) { this.setEmote('sad', 2200); LC.Audio.sfx('sad'); }
      else { this.setEmote('happy', 2200); LC.Audio.sfx('eat'); this.fx.heart.explode(4, gp.x, gp.y - 8); }
      this.toast(msg + ' (+' + b + ' bond)', it.icon);
      if (craving) {
        g.cravingDone = true;
        var b2 = LC.State.addBond(20);
        g.joy = clamp(g.joy + 15);
        this.time.delayedCall(650, function () {
          LC.Audio.sfx('chime');
          var p = self.ghostPos(); self.fx.sparkle.explode(14, p.x, p.y);
          self.toast('Craving satisfied! (+' + b2 + ' bond)', 'ic_bond');
          self.craveGift();
        });
      }
      S.flags.fedOnce = true;
    }
    craveGift() {
      var S = this.S, r = Math.random();
      if (r < 0.5) { var k = 20 + rint(31); S.kepeng += k; this.toast('Pelita left you ' + k + ' kepeng as thanks!', 'i_kepeng'); }
      else if (r < 0.8) {
        var seeds = ['seed_melati', 'seed_marigold', 'seed_padi', 'seed_cili'], s = seeds[rint(seeds.length)];
        if (LC.State.add(s, 2)) this.toast('Pelita found you 2 ' + LC.ITEMS[s].name + '!', 'i_' + s);
      } else if (LC.State.add('colok', 1)) this.toast('Pelita dug up a stick of colok for you!', 'i_colok');
      LC.Audio.sfx('coin');
    }
    petGhost() {
      var S = this.S, g = S.ghost, gp = this.ghostPos();
      if (S.minutes - g.petAt < 60) { this.toast('Pelita giggles. It has had plenty of cuddles for now.'); this.setEmote('happy', 900); LC.Audio.sfx('pet'); return; }
      g.petAt = S.minutes; g.joy = clamp(g.joy + 8);
      var b = LC.State.addBond(3);
      this.fx.heart.explode(3, gp.x, gp.y - 6); LC.Audio.sfx('pet'); this.setEmote('happy', 1800);
      this.toast('You pat Pelita. It wiggles with joy! (+' + b + ' bond)', 'ic_joy');
    }
    offer(id) {
      var S = this.S, g = S.ghost, it = LC.ITEMS[id];
      if (g.glow >= 100) { this.toast('Pelita\'s glow is already full.'); LC.Audio.sfx('error'); return false; }
      LC.State.remove(id, 1);
      g.glow = clamp(g.glow + it.glow);
      if (it.joy) g.joy = clamp(g.joy + it.joy);
      var b = LC.State.addBond(it.bond);
      S.offerings.push(id);
      if (id === 'colok') S.flags.incense = true;
      this.refreshOfferings();
      LC.Audio.sfx('offer');
      this.fx.sparkle.explode(10, this.spiritPos.x, this.spiritPos.y - 26);
      this.setEmote('happy', 2000);
      this.toast('You place the ' + it.name + '. Pelita glows brighter! (+' + b + ' bond)', it.icon);
      return true;
    }
    cookFx() {
      this.fx.smoke.explode(6, this.dapurPos.x, this.dapurPos.y - 22);
      this.fx.sparkle.explode(5, this.dapurPos.x, this.dapurPos.y - 18);
    }

    // ---------------------------------------------------------------- day cycle
    sleep(fainted) {
      if (this.sleeping) return;
      var self = this;
      this.sleeping = true;
      this.ui.closeModal();
      LC.Audio.sfx('sleep');
      this.cameras.main.fadeOut(900, 8, 6, 18);
      this.cameras.main.once('camerafadeoutcomplete', function () {
        var sum = LC.State.endDay(fainted);
        self.refreshAllTiles();
        self.refreshOfferings();
        self.player.setPosition(4 * T + 8, 8 * T + 13);
        self.dir = 'down';
        var h = self.ghostHome(); self.gpos.x = h.x; self.gpos.y = h.y;
        self.ui.showSummary(sum, function () {
          self.cameras.main.fadeIn(800);
          self.sleeping = false;
          self.morning();
        });
      });
    }
    morning() {
      var S = this.S, g = S.ghost;
      this.ui.toast('Good morning! Day ' + S.day + ', ' + LC.State.weekday() + '.', 'ic_sun');
      if (LC.State.isHGN()) this.ui.say([{ text: 'Today is Ahad. Tonight is Hungry Ghost Night, when wandering spirits come looking for food.' }, { name: 'Pelita', portrait: 'ghost', expr: 'sad', text: '...!! (Pelita\'s tummy rumbles. Every kindness counts double today!)' }]);
      else if (g.stage >= 1) this.ui.toast('Pelita is craving ' + LC.ITEMS[g.craving].name + ' today.', 'i_' + g.craving);
    }

    stageUp(st) {
      var self = this, gp = this.ghostPos();
      LC.Audio.sfx('stage');
      this.cameras.main.flash(600, 255, 240, 210);
      this.fx.sparkle.explode(30, gp.x, gp.y);
      this.setEmote('happy', 4000);
      if (st === 4) { this.festival(); return; }
      var lines = [{ text: '✦ Pelita has grown into a ' + LC.STAGES[st].name + '! ✦' }];
      LC.STAGE_TEXT[st].forEach(function (t) { lines.push({ name: 'Pelita', portrait: 'ghost', expr: 'happy', text: t }); });
      this.time.delayedCall(500, function () { self.ui.say(lines); });
    }
    festival() {
      var self = this, S = this.S;
      // lanterns drift up through whatever the camera is looking at
      for (var i = 0; i < 70; i++) {
        (function (k) {
          self.time.delayedCall(k * 200, function () {
            var v = self.cameras.main.worldView;
            var x = v.x + 8 + Math.random() * (v.width - 16), y = v.bottom + 6 + Math.random() * 20;
            var l = self.add.image(x, y, 'sky_lantern').setDepth(9003);
            var gl = self.add.image(x, y, 'glow').setDepth(9001).setBlendMode(Phaser.BlendModes.ADD).setTint(0xffb060).setScale(0.5).setAlpha(0.8);
            self.tweens.add({ targets: [l, gl], y: v.y - 20, x: x + (Math.random() - 0.5) * 40, duration: 8000 + Math.random() * 4000, ease: 'Sine.easeIn', onComplete: function () { l.destroy(); gl.destroy(); } });
            self.tweens.add({ targets: [l, gl], alpha: 0, delay: 6000, duration: 3000 });
          });
        })(i);
      }
      this.time.delayedCall(800, function () {
        self.ui.say([
          { text: 'The river begins to glow. One by one, little lanterns rise from the water, as if the whole kampung remembered at once.' },
          { name: 'Pelita', portrait: 'ghost', expr: 'happy', text: '...Te... terima kasih. (Pelita speaks its very first words: "thank you.")' },
          { text: '✦ Pelita has become the Guardian of the Kampung! ✦' },
          { text: 'Somewhere, you are sure Nenek is smiling. The farm, the river and the little spirit are in good hands.' },
          { text: 'Thank you for playing Little Creature! The days go on: keep farming, cooking and caring for Pelita.' }
        ], { onDone: function () { S.flags.guardian = true; LC.State.save(); } });
      });
    }
  };
})();
