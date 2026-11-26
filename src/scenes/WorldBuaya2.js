/* World, Chapter 20, Part 2 (v3.23): Janji Buaya Putih to the end. See buaya2.js for the steps and the rewards. As in
 * Part 1, a step is saved the moment it happens, and what follows a dialogue runs from the update loop.
 *  - Laut Sabah (the voyage): the strait at the tip of Borneo, where her raft is towed on a rope that strains in the
 *    crossing currents (go slowly, or it snaps and you must sail back for her); the coral, where the Bajau Laut's lepa
 *    show the way; the ghost net (a free-dive, in the UI); dawn and Kinabalu.
 *  - The Kinabatangan: upriver behind her, past proboscis monkeys, hornbills and a herd of pygmy elephants crossing the
 *    shallows; the crocodile clan, Kancil's count (in the UI), truth or trick (a chase), Tok Sisik.
 *  - The nest bank: the vision, the shadow that takes Pelita; the bell and the lights; the shadows on the bank (with
 *    Awang Semaun and Badang); riding Seri Putih across the lake through the stolen lights; Kancil's firefly trick.
 *  - Inside the shadow: find Pelita in the dark, feed it, tell it. Then the dawn, and letting go.
 *  - Kenduri Terakhir at Kampong Ayer, the photo, the credits (UI), the epilogue on the farm.
 *  - After: Pelita Putih heals you and becomes Harimau Cahaya (T); Anak Putih grows and carries you across water;
 *    Sang Kancil can travel with you; your stilt house in Kampong Ayer.
 * Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var W = LC.WorldScene.prototype, C = LC.C20, X = LC.BUAYA2_TEXT, T = 16;
  function step(w) { return C.step(w.S); }
  function story(w, n) { w.S.quests.ch20 = n; LC.State.save(); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function wrapA(a) { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; }
  function feet(t) { return { x: (t.x + 0.5) * T, y: (t.y + 1) * T }; }
  function lerpC(a, b, t) {
    t = clamp(t, 0, 1);
    var ar = a >> 16 & 255, ag = a >> 8 & 255, ab = a & 255, br = b >> 16 & 255, bg = b >> 8 & 255, bb = b & 255;
    return (Math.round(ar + (br - ar) * t) << 16) | (Math.round(ag + (bg - ag) * t) << 8) | Math.round(ab + (bb - ab) * t);
  }
  function ADD() { return Phaser.BlendModes.ADD; }
  var DIRV = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] };
  var WET = { w: 1, o: 1, h: 1, S: 1, q: 1 };
  function lake() { var L = C.nest.lake; return { x: (L.x + 0.5) * T, y: (L.y + 0.5) * T }; }

  var create = W.createKampong, update = W.updateKampong;
  W.createKampong = function () { create.apply(this, arguments); this.createBuaya2(); };
  W.updateKampong = function (time, dt) { update.apply(this, arguments); this.updateBuaya2(time, dt); };

  // ================================================================ hooks
  var setupVoyage = W.setupVoyage;
  W.setupVoyage = function () {
    var r = setupVoyage.apply(this, arguments);
    if (this.A.voyage20 !== 'night') this.setupVoyage2();
    return r;
  };
  var updateSea20 = W.updateSea20;
  W.updateSea20 = function (time, dt, blocked) {
    if (this.A.voyage20 === 'night') return updateSea20.apply(this, arguments);
    return this.updateSea20b(time, dt, blocked);
  };
  var skyColor = W.skyColor;
  W.skyColor = function (m) {
    var c = this.c20, sea = c && c.sea, b = this.c20b, S = this.S, s = step(this);
    if (this.area === 'laut20b' && sea && sea.sh) {
      var x = sea.sh.x / T, col = lerpC(0xd88a6a, 0x2a3458, x / 40);
      return x > C.sabah.goalX - 26 ? lerpC(col, 0xf0c8a0, (x - (C.sabah.goalX - 26)) / 18) : col;
    }
    if (this.area === 'sarang20' && C.ready(S)) {
      if (s >= 12 && s <= 16) return b && b.moon ? 0x3e4c7c : 0x161c34;
      if (s === 11) return lerpC(0xe89a6a, 0x2a3458, b ? b.dusk || 0 : 0);
    }
    if (this.area === 'dalam20') return 0x0a0812;
    return skyColor.apply(this, arguments);
  };
  var updateLighting = W.updateLighting;
  W.updateLighting = function () {
    var S = this.S, off = S.flags.sunOff, s = step(this);
    var dark = this.area === 'laut20b' || this.area === 'dalam20' || (this.area === 'sarang20' && s >= 11 && s <= 16) || (this.area === 'barunai' && s === 18 && C.isNight(S));
    if (!dark) return updateLighting.apply(this, arguments);
    S.flags.sunOff = true;
    try { return updateLighting.apply(this, arguments); } finally { S.flags.sunOff = off; }
  };
  var objectAction = W.objectAction;
  W.objectAction = function (o) {
    var self = this, S = this.S, q = S.quests, s = step(this);
    if (!o) return objectAction.apply(this, arguments);
    switch (o.type) {
      case 'buaya_wait':
        if (o.id === 't_jong20' && s === 9) return { label: 'Set sail for Sabah', fn: function () { self.buayaSail2(); } };
        return objectAction.apply(this, arguments);
      case 'buaya_kancil':
        if (s >= C.end && C.ready(S)) return { label: 'Talk to Sang Kancil', fn: function () { self.buayaKancilAsk(); } };
        return objectAction.apply(this, arguments);
      case 'buaya_anak': return { label: 'Pet Anak Putih', fn: function () { self.buayaAnakPet(); } };
      case 'buaya_rumah': return { label: 'Your house on the water', fn: function () { self.toast(X.rumah, 'rumah_air3'); self.ui.confirmSleep({ area: 'barunai', x: C.rumah.door.x, y: C.rumah.door.y + 1 }); } };
      case 'buaya_sarang': return { label: 'The nest', fn: function () { self.toast(s >= 18 ? 'The empty shells of the hatchlings. Tok Sisik is guarding them, very proudly.' : s === 17 ? 'Her eggs, in the warm sand. They are cold.' : 'A hollow in the warm sand, where crocodiles have nested for a hundred years.', 'sarang20'); } };
      case 'buaya_croc2': return { label: 'Seri Putih', fn: function () { self.buayaPutih2(); } };
      case 'buaya_sisik': return { label: 'Tok Sisik', fn: function () { self.toast(s >= 18 ? X.sisikBye : 'Tok Sisik watches the lake with his one good eye. Nothing gets past him. Almost nothing.', 'buayaK20_face'); } };
      case 'buaya_nenek2': return { label: 'Talk to Nenek', fn: function () { self.buayaNenek2(); } };
      case 'buaya_kancil2': return { label: 'Talk to Sang Kancil', fn: function () { LC.Audio.sfx('kancil20'); self.toast(pick(LC.BUAYA_TEXT.kancilKA), 'kancil20_0'); } };
      case 'buaya_bell': return { label: s === 12 ? 'Ring the brass bell' : 'The bell post', fn: function () { self.buayaBell(); } };
      case 'buaya_ally': return { label: 'Talk to ' + LC.SPEAKERS[o.who].name, fn: function () { self.buayaLines([[o.who, o.who === 'badang20' ? 'Behind me! Rocks are for throwing.' : 'Kampong Ayer is here. Fight!']]); } };
      case 'buaya_spark': return { label: this.c20b && this.c20b.found ? (this.c20b.fed ? 'Pelita' : 'Feed Pelita') : 'The crying light', fn: function () { self.buayaSpark(); } };
      case 'buaya_feast': return { label: 'Talk to ' + o.name, fn: function () { self.buayaFeastTalk(o); } };
      default: return objectAction.apply(this, arguments);
    }
  };
  var getAction = W.getAction;
  W.getAction = function () {
    var self = this, b = this.c20b, c = this.c20;
    if (b && b.ride) return null;
    if (c && c.sea && c.sea.countPending && this.A.voyage20 === 'river') return { label: 'Hop across the crocodiles', fn: function () { self.buayaCountOpen(); } };
    if (b && b.heart && step(this) === 15) {
      return b.heart.open ? { label: 'Jump into its heart!', fn: function () { self.buayaHeartJump(); } } : { label: 'Wait for its heart to open...', fn: function () { self.buayaHeartMiss(); } };
    }
    var r = getAction.apply(this, arguments);
    return r;
  };
  var toolAction = W.toolAction;
  W.toolAction = function (sl, it, ch, t, tx, ty) {
    var self = this, S = this.S;
    if (sl && sl.id === 'loceng20' && LC.c20Anak() > 0 && step(this) >= C.end) {
      if (S.riding === 'buaya') return { label: 'Climb off Anak Putih', ride: true, fn: function () { self.buayaRideOff(); } };
      return { label: 'Ring the bell: ride Anak Putih', ride: true, fn: function () { self.buayaRideOn(); } };
    }
    return toolAction.apply(this, arguments);
  };
  var updatePlayer = W.updatePlayer;
  W.updatePlayer = function (dt, blocked) {
    var b = this.c20b;
    if (b && b.ride && this.area === 'sarang20') return this.updateRide20(dt, blocked);
    if (this.S.riding === 'buaya') return this.updateAnakRide(dt, blocked);
    return updatePlayer.apply(this, arguments);
  };
  var updateGhost = W.updateGhost;
  W.updateGhost = function (time, dt, blocked) {
    updateGhost.apply(this, arguments);
    var b = this.c20b, s = step(this), gone = (this.area === 'sarang20' && s >= 12 && s <= 16) || this.area === 'dalam20' || (b && (b.noPelita || b.tiger));
    if (gone && this.ghost) { [this.ghost, this.ghostGlow, this.ghostShadow, this.bubble].forEach(function (o) { if (o) o.setVisible(false); }); this.ghostNear = false; this.ghostHere = false; }
  };
  var away = W.jerebuAway;
  W.jerebuAway = function (vid) {
    if (away && away.apply(this, arguments)) return true;
    var S = this.S, s = step(this);
    if (!C.ready(S)) return false;
    if (vid === 'nenek' && this.area === 'farm') return s >= 9 && s <= 18;
    if (this.area === 'barunai' && s === 18) return ['semaun', 'alak', 'berbai', 'sari', 'lajak', 'kemala'].indexOf(vid) >= 0;
    return false;
  };
  var groupOn = W.groupOn;
  W.groupOn = function (g) { if (g.c20b) return !!(this.c20b && this.c20b.fightOn); return groupOn.apply(this, arguments); };
  var enemyDie = W.enemyDie;
  W.enemyDie = function (e) {
    var r = enemyDie.apply(this, arguments);
    if (e.g && e.g.c20b && this.c20b) {
      var q = this.S.quests, b = this.c20b, self = this;
      q.c20kills = (q.c20kills || 0) + 1; LC.State.save();
      e.respawn = Infinity;   // (the bank is small: they come back out of the lake on a timer, not when you walk away)
      if (q.c20kills < C.kills) this.time.delayedCall(3500 + Math.random() * 2500, function () { if (self.c20b === b && b.fightOn && e.dead && !self.leaving) self.spawnEnemy(e.g, false, e); });
    }
    return r;
  };
  var faint = W.faint;
  W.faint = function () {
    var b = this.c20b;
    if (b && this.area === 'sarang20' && step(this) === 13 && !this.leaving) {
      this.S.hp = Math.round(this.S.maxHp * 0.6); this.invuln = 2; this.player.clearTint().setAlpha(1);
      this.buayaLines(X.faint);
      return;
    }
    return faint.apply(this, arguments);
  };
  var sailTo = W.sailTo;
  W.sailTo = function (to) {
    if (to !== 'laut20b') return sailTo.apply(this, arguments);
    LC.Audio.sfx('splash');
    this.goArea('laut20b', this.tilePx(C.sabah.start), 'right');
  };
  // ---- riding Anak Putih
  var canRide = W.canRide;
  W.canRide = function (kind) {
    if (kind === 'buaya') { var A = this.A; return LC.c20Anak() === 3 && !A.cave && !A.underwater && !A.voyage20 && !A.sailing && this.area !== 'dalam20'; }
    return canRide.apply(this, arguments);
  };
  var setRide = W.setRide;
  W.setRide = function (kind) {
    if (kind !== 'buaya') { var was = this.S.riding; var r = setRide.apply(this, arguments); if (was === 'buaya' && !kind && this.fx) this.fx.drop.explode(8, this.player.x, this.player.y); return r; }
    this.S.riding = 'buaya';
    LC.Audio.sfx('splash');
    this.fx.drop.explode(12, this.player.x, this.player.y);
    this.drawRider(this.player, 'buaya', this.dir, false, this.veh, this.pc);
  };
  var toggleRide = W.toggleRide;
  W.toggleRide = function (kind) {
    if (this.S.riding === 'buaya') { this.buayaRideOff(); return; }
    return toggleRide.apply(this, arguments);
  };
  var drawRider = W.drawRider;
  W.drawRider = function (spr, ride, dir, moving, veh, color) {
    if (ride !== 'buaya') return drawRider.apply(this, arguments);
    var side = dir === 'left' || dir === 'right', key = side ? 'side' : dir, bob = Math.round(Math.sin(this.time.now / (moving ? 160 : 400)));
    spr.setVisible(true).setOrigin(0.5, side ? 1.25 : 1.5);
    if (spr.anims && spr.anims.isPlaying) spr.stop();
    spr.setTexture(LC.Art.plKey(color || 0) + '_' + key + '_0');
    veh.setVisible(true).setTexture('anak20_ride_' + key).setPosition(Math.round(spr.x), Math.round(spr.y + (side ? 4 : 10) + bob)).setFlipX(dir === 'left').setDepth(spr.y + (dir === 'down' ? 0.5 : -0.5));
  };
  // ---- Sang Kancil draws enemies away, Harimau Cahaya, and frightened foes chase the decoy
  var updateEnemies = W.updateEnemies;
  W.updateEnemies = function (time, dt, blocked) {
    var list = this.enemies || [], b = this.c20b, k = b && b.decoy;
    list.forEach(function (e) { if (e.decoyT > 0 && !e.dead && !e.away) { e.restT = Math.max(e.restT || 0, 0.05); e.windT = 0; e.strikeT = 0; } });
    updateEnemies.apply(this, arguments);
    if (blocked || this.leaving || this.sleeping) return;
    var self = this;
    list.forEach(function (e) {
      if (!(e.decoyT > 0)) return;
      e.decoyT -= dt;
      if (e.dead || e.away || e.g.fixed || !k) return;
      var s = e.spr, dx = k.x - s.x, dy = k.y - s.y, d = Math.max(1, Math.hypot(dx, dy)), sp = e.def.speed * 1.1 * dt;
      if (!self.solidPx(s.x + dx / d * sp, s.y - 2)) s.x += dx / d * sp;
      if (!self.solidPx(s.x, s.y + dy / d * sp - 2)) s.y += dy / d * sp;
      s.setFlipX(dx < 0).setDepth(s.y);
    });
  };

  Object.assign(W, {
    // ================================================================ setting up each place
    createBuaya2: function () {
      var self = this, S = this.S, q = S.quests, s = step(this);
      var b = this.c20b = { things: {}, cine: null, tick: 0.5, ride: null, heart: null, tiger: null, decoy: null, noPelita: false, fightOn: false, moon: false, dusk: 0, kancil: null, kFindT: 0, allyT: 2, gongT: 3, feast: false, anak: null, said: {} };
      if (!C.ready(S)) return;
      if (this.area === 'sarang20') this.buayaNestSetup();
      if (this.area === 'dalam20') this.buayaInsideSetup();
      if (this.area === 'barunai' && s === 18) this.buayaFeastSetup();
      if (this.area === 'farm' && s >= C.end) {
        var an = this.objImgs.f_anak20, g = LC.c20Anak();
        if (an) an.setTexture(g === 3 ? 'buaya20_0' : g === 2 ? 'anak20_muda' : 'anak20_kecil');
      }
      if (q.c20kancil === 'with' && this.buayaKancilHere()) this.buayaKancilFollow();
      void self;
    },
    buayaPut: function (key, t, tex, o, depthAdj) {   // a person or a thing on one tile: it blocks the tile, and can be talked to
      var b = this.c20b, x = t.x * T + 8, y = (t.y + 1) * T, spr = this.add.sprite(x, y, tex).setOrigin(0.5, 1).setDepth(y + (depthAdj || 0));
      var th = { spr: spr, tx: t.x, ty: t.y, o: o, was: this.solid[t.y][t.x] };
      if (o) { this.solid[t.y][t.x] = true; this.objAt[t.y][t.x] = o; }
      b.things[key] = th;
      return th;
    },
    buayaUnput: function (key) {
      var b = this.c20b, th = b && b.things[key];
      if (!th) return;
      if (th.o && this.objAt[th.ty][th.tx] === th.o) { this.objAt[th.ty][th.tx] = null; this.solid[th.ty][th.tx] = th.was; }
      th.spr.destroy(); delete b.things[key];
    },
    buayaTravelSleep: function (area, spawn) {   // a whole night passes: wake up somewhere else, with the day's summary
      var self = this;
      if (this.sleeping) return;
      this.sleeping = true;
      this.ui.closeModal();
      this.cameras.main.fadeOut(900, 8, 6, 18);
      this.cameras.main.once('camerafadeoutcomplete', function () {
        var sum = LC.State.endDay(false);
        if (LC.Net.isHost()) LC.Net.broadcast({ t: 'dayStart', sum: sum, world: LC.State.snapshot() });
        LC.followPid = self.followPid;
        self.scene.restart({ area: area, spawn: self.tilePx(spawn), dir: 'down', summary: sum });
      });
    },
    buayaGo: function (area, spawn, minutes) {   // travel on the same day
      if (minutes !== undefined) this.S.minutes = minutes;
      LC.State.save();
      this.goArea(area, this.tilePx(spawn), 'down');
    },

    // ================================================================ step 8: the wind turns; step 9: set sail
    buayaWind: function () {
      var q = this.S.quests;
      story(this, 9);   // (saved first)
      if (!q.c20kuih) { q.c20kuih = true; LC.State.add('kuih_pandan', 3); LC.State.save(); }
      LC.Audio.sfx('chime');
      this.buayaLines(X.wind);
    },
    buayaSail2: function () {
      if (step(this) !== 9) return;
      this.buayaLines(X.aboard);
      this.c20b.sailPending = true;
    },

    // ================================================================ the voyage to Sabah, and the river
    setupVoyage2: function () {
      var self = this, c = this.c20, sea = c.sea, kind = this.A.voyage20;
      sea.kind = kind;
      if (sea.ring) sea.ring.clear();
      sea.glow.base = 0.35; sea.glow.img.setScale(2.4);
      sea.cr.img.setTexture('buaya20t_0'); sea.cr.str = 100;
      if (kind === 'sabah') {
        sea.strain = 0; sea.raft = null; sea.towed = false; sea.bajau = false; sea.netDone = false; sea.kina = false; sea.li = 0;
        var kb = this.add.image((C.sabah.goalX - 8) * T, C.sabah.H * T - 2, 'kinabalu20').setOrigin(0.5, 1).setScale(3).setDepth(1).setAlpha(0.95);
        sea.kinabaluImg = kb;
        sea.lepa = this.add.sprite(C.sabah.lepa[0][0] * T, C.sabah.lepa[0][1] * T, 'lepa20_t0').setDepth(9002).setVisible(false);
        sea.lepaL = this.addLight(sea.lepa.x, sea.lepa.y, 0xffc070, 1, true); sea.lepaL.base = 0;
        sea.extra = [[100, 24], [104, 12]].map(function (p) { var im = self.add.sprite(p[0] * T, p[1] * T, 'lepa20_t1').setDepth(9002).setVisible(false); var L = self.addLight(im.x, im.y, 0xffc070, 0.8, true); L.base = 0; return { im: im, L: L, x0: im.x, y0: im.y, ph: Math.random() * 6 }; });
        this.time.delayedCall(800, function () { if (!self.leaving) self.buayaLines([['', X.helm]]); });
      } else {
        sea.sh.img.setScale(0.7); sea.sh.ang = Math.PI;   // (upriver: west)
        sea.cr.x = sea.sh.x - 90; sea.cr.y = sea.sh.y;
        sea.fordDone = false; sea.blocked = false; sea.counted = false; sea.monkeys = []; sea.birdT = 6; sea.heads = [];
        // monkeys in the trees along both banks
        for (var x = 8; x < C.river.W - 6; x += 9) {
          [-1, 1].forEach(function (side) {
            for (var y = 2; y < C.river.H - 2; y++) {
              var t = self.grid[y][x], n = self.grid[y + side] && self.grid[y + side][x];
              if (t === 'g' && n === 'S' && Math.random() < 0.55) { var m = self.add.sprite(x * T + 8, (y + 1) * T, 'monyet20_0').setOrigin(0.5, 1).setDepth((y + 1) * T); sea.monkeys.push({ spr: m, honk: 0 }); break; }
            }
          });
        }
        // the crocodile clan, from bank to bank
        for (var hx = C.river.block - 10; hx <= C.river.block - 2; hx += 2) for (var hy = 3; hy < C.river.H - 3; hy++) {
          if (this.grid[hy][hx] === 'w' && (hx + hy) % 2 === 0) sea.heads.push(this.add.image(hx * T + 8, hy * T + 8, 'kepala20').setDepth(hy * T + 9).setFlipX(true));
        }
        this.time.delayedCall(800, function () { if (!self.leaving) { self.buayaLines(X.arrive.concat([['', X.riverHelm]])); } });
      }
    },
    updateSea20b: function (time, dt, blocked) {
      var self = this, c = this.c20, sea = c.sea, sh = sea.sh, cr = sea.cr, cam = this.cameras.main;
      if (cam.zoom !== 2) cam.setZoom(2);
      sea.glow.img.setPosition(sh.x, sh.y);
      if ((sea.hideT = (sea.hideT || 0) - dt) <= 0) {
        sea.hideT = 1;
        sea.hideList = this.children.list.filter(function (o) { var k = o.texture && o.texture.key; return o !== self.ghost && k && /^(npc_|sp_|mirror|wira_)/.test(k); });
      }
      (sea.hideList || []).forEach(function (o) { if (o.active) o.setVisible(false); });
      if (sea.kind === 'sabah') this.updateSabah(time, dt, blocked); else this.updateRiver(time, dt, blocked);
    },
    // Seri Putih swims beside the jong (or behind it, or ahead of the boat on the river)
    buayaSwim: function (dt, tx, ty, speed) {
      var cr = this.c20.sea.cr, dx = tx - cr.x, dy = ty - cr.y, d = Math.hypot(dx, dy);
      if (d > 3) {
        var v = Math.min(speed, d * 2.4) * dt, nx = cr.x + dx / d * v, ny = cr.y + dy / d * v;
        if (this.seaFree20(nx, ny) || this.grid[Math.floor(ny / T)] && WET[this.grid[Math.floor(ny / T)][Math.floor(nx / T)]]) { cr.x = nx; cr.y = ny; } else { cr.x += dx / d * v * 0.3; cr.y += dy / d * v * 0.3; }
        cr.ang = wrapA(cr.ang + clamp(wrapA(Math.atan2(dy, dx) - cr.ang), -3 * dt, 3 * dt));
      }
      if ((cr.frameT -= dt) <= 0) { cr.frameT = 0.5; cr.f = cr.f ? 0 : 1; cr.img.setTexture('buaya20t_' + cr.f); }
      cr.img.setPosition(Math.round(cr.x), Math.round(cr.y)).setRotation(cr.ang).setDepth(9002).setVisible(true).setAlpha(1);
      cr.light.img.setPosition(cr.x, cr.y);
    },
    updateSabah: function (time, dt, blocked) {
      var self = this, c = this.c20, sea = c.sea, sh = sea.sh, cr = sea.cr, A = C.sabah, x = sh.x / T;
      var stern = { x: sh.x - Math.cos(sh.ang) * 30, y: sh.y - Math.sin(sh.ang) * 30 };
      // the raft: from the strait, she rests on it, and you tow her
      if (!sea.towed && x > A.tow.x0) {
        sea.towed = true;
        sea.raft = { x: cr.x, y: cr.y, on: true, img: this.add.image(cr.x, cr.y, 'rakit20').setDepth(9001), croc: this.add.image(cr.x, cr.y - 3, 'buaya20t_0').setDepth(9002).setScale(0.8), rope: this.add.graphics().setDepth(9000) };
        sea.strain = 0;
        cr.img.setVisible(false);
        this.buayaLines(X.tired);
        return;
      }
      if (sea.raft) {
        var R = sea.raft, inStrait = x > A.strait.x0 && x < A.strait.x1 ? 1 : 0.35;
        var cur = 52 * Math.sin(R.x / 60 + time / 800) * inStrait;
        if (!blocked) {
          if (R.on) {
            R.y += cur * dt;
            var dx = R.x - stern.x, dy = R.y - stern.y, d = Math.hypot(dx, dy) || 1, L = C.rope.len;
            if (d > L) { R.x = stern.x + dx / d * L; R.y = stern.y + dy / d * L; }
            if (sh.spd > 26) { sea.strain += (sh.spd - 26) / 48 * (Math.abs(cur) / 52 + 0.2) * 95 * dt; if (sea.strain > 70 && !sea.said.strain) { sea.said.strain = true; this.toast(X.strain, 'rakit20'); } }
            else sea.strain = Math.max(0, sea.strain - 34 * dt);
            if (sea.strain < 50) sea.said.strain = false;
            if (sea.strain >= C.rope.strain) {
              R.on = false; sea.strain = 0;
              LC.Audio.sfx('retak20'); this.cameras.main.shake(200, 0.004);
              this.toast(X.snap, 'rakit20');
            }
          } else {
            var nx = R.x - 16 * dt, ny = R.y + cur * dt;
            if (this.seaFree20(nx, ny)) { R.x = nx; R.y = ny; }
            if (Math.hypot(R.x - sh.x, R.y - sh.y) < 40) { R.on = true; sea.strain = 25; LC.Audio.sfx('kancil20'); this.toast(X.retie, 'kancil20_0'); }
            // never sail on without her
            if (sh.x > R.x + 9 * T) { sh.x = R.x + 9 * T; sh.spd = Math.min(sh.spd, 10); if ((sea.backT = (sea.backT || 0) - dt) <= 0) { sea.backT = 4; this.toast('Do not leave her behind! Sail back for the raft.', 'rakit20'); } }
          }
        }
        R.img.setPosition(R.x, R.y).setRotation(Math.sin(time / 500) * 0.12);
        R.croc.setPosition(R.x, R.y - 3).setRotation(Math.sin(time / 500) * 0.12);
        R.rope.clear();
        if (R.on) { R.rope.lineStyle(1.5, sea.strain > 70 ? 0xff7a5a : 0xd8c8a0, 1); R.rope.lineBetween(stern.x, stern.y, R.x, R.y); }
        if (x > A.tow.x1 && R.on && !blocked) {   // through: she swims again
          cr.x = R.x; cr.y = R.y; cr.img.setVisible(true);
          R.img.destroy(); R.croc.destroy(); R.rope.destroy(); sea.raft = null; sea.strain = 0;
          this.buayaLines(X.rested);
          return;
        }
      } else this.buayaSwim(dt, sh.x - Math.cos(sh.ang) * 46 + Math.sin(sh.ang) * 18, sh.y - Math.sin(sh.ang) * 46 - Math.cos(sh.ang) * 18, 80);
      // the strait: the two seas crash together (the waves push the jong too)
      if (x > A.strait.x0 && x < A.strait.x1) {
        if (!sea.said.strait) { sea.said.strait = true; this.toast(X.strait, 'ic_moon'); }
        if (!blocked) sh.y += Math.sin(time / 700) * 22 * dt;
        if ((sea.capT -= dt) <= 0) { sea.capT = 0.25; this.fx.drop.explode(3, sh.x + (Math.random() - 0.5) * 160, sh.y + (Math.random() - 0.5) * 120); }
      }
      // the Bajau Laut
      if (!sea.bajau && x > A.reef.x0 - 10) {
        sea.bajau = true;
        sea.lepa.setVisible(true); sea.lepaL.base = 0.9;
        sea.extra.forEach(function (e) { e.im.setVisible(true); e.L.base = 0.8; });
        this.buayaLines(X.bajau);
        return;
      }
      if (sea.bajau) {
        var lp = sea.lepa;
        sea.lepaL.img.setPosition(lp.x, lp.y);
        if ((sea.lfT = (sea.lfT || 0) - dt) <= 0) { sea.lfT = 0.5; lp.setTexture(lp.texture.key === 'lepa20_t0' ? 'lepa20_t1' : 'lepa20_t0'); }
        sea.extra.forEach(function (e) { e.im.setPosition(e.x0 + Math.sin(time / 1500 + e.ph) * 20, e.y0 + Math.cos(time / 1700 + e.ph) * 8); e.L.img.setPosition(e.im.x, e.im.y); });
        if (!sea.lepaMove && sea.li < A.lepa.length - 1 && Math.hypot(lp.x - sh.x, lp.y - sh.y) < 80) {
          sea.li++;
          var to = A.lepa[sea.li];
          sea.lepaMove = true;
          lp.setRotation(Math.atan2(to[1] * T - lp.y, to[0] * T - lp.x));
          this.tweens.add({ targets: lp, x: to[0] * T, y: to[1] * T, duration: 1500, ease: 'Sine.easeInOut', onComplete: function () { sea.lepaMove = false; } });
          this.ui.floatText(lp.x, lp.y - 16, pick(X.lepaSay), '#ffe0b0');
        }
      }
      // the ghost net
      if (!sea.netDone && x > A.net && !blocked) {
        sh.spd = 0;
        if (!sea.netAsked) { sea.netAsked = true; LC.Audio.sfx('buaya20'); this.buayaLines(X.netHook); return; }
        this.buayaNetOpen();
        return;
      }
      if (!sea.netDone && x > A.net - 1) { sh.x = Math.min(sh.x, (A.net + 0.5) * T); }
      // Kinabalu at dawn, then the river mouth
      if (!sea.kina && x > A.goalX - 12) { sea.kina = true; LC.Audio.sfx('chime'); this.buayaLines(X.kinabalu); return; }
      if (x > A.goalX && !blocked && !sea.arriving) {
        sea.arriving = true;
        story(this, 10);   // (saved first)
        this.buayaTravelSleep('kina20', C.river.start);
      }
    },
    buayaNetOpen: function () {
      var self = this, sea = this.c20.sea;
      if (sea.netOpen) return;
      sea.netOpen = true;
      this.ui.openNet20(sea.knots || 0, function (cut, won) {
        sea.netOpen = false; sea.knots = cut;
        if (won) { sea.netDone = true; LC.Audio.sfx('chime'); self.buayaLines(X.netDone); return; }
        self.toast(X.netFail, 'ic_moon');
        sea.netWait = true;
        self.time.delayedCall(1600, function () { sea.netWait = false; });
      });
    },
    updateRiver: function (time, dt, blocked) {
      var self = this, c = this.c20, sea = c.sea, sh = sea.sh, cr = sea.cr, R = C.river, x = sh.x / T;
      // she swims ahead, upriver
      var ahead = Math.max(2, x - 6), mid = this.buayaRiverMid(ahead);
      this.buayaSwim(dt, ahead * T, mid * T, 70);
      // the monkeys honk as you pass
      sea.monkeys.forEach(function (m) {
        var d = Math.hypot(m.spr.x - sh.x, m.spr.y - sh.y);
        m.honk -= dt;
        if (d < 110 && m.honk <= 0) {
          m.honk = 6 + Math.random() * 6; m.spr.setTexture('monyet20_1');
          self.time.delayedCall(500, function () { if (m.spr.active) m.spr.setTexture('monyet20_0'); });
          self.ui.floatText(m.spr.x, m.spr.y - 20, X.honk, '#ffd0a0');
          if (!sea.said.monkey) { sea.said.monkey = true; self.toast(pick(X.monkey), 'monyet20_0'); }
        }
      });
      // hornbills cross the sky
      if ((sea.birdT -= dt) <= 0) {
        sea.birdT = 14 + Math.random() * 10;
        var wv = this.cameras.main.worldView, y0 = wv.y + 30 + Math.random() * wv.height * 0.4;
        [0, 22].forEach(function (off, i) {
          var bd = self.add.sprite(wv.right + 30 + off, y0 + off * 0.4, 'enggang20_0').setDepth(9006).setFlipX(true);
          bd.play && self.anims.exists('enggang20_fly') && bd.play('enggang20_fly');
          var fl = self.time.addEvent({ delay: 220, loop: true, callback: function () { if (bd.active) bd.setTexture(bd.texture.key === 'enggang20_0' ? 'enggang20_1' : 'enggang20_0'); } });
          self.tweens.add({ targets: bd, x: wv.x - 60, y: y0 - 30 + i * 10, duration: 5200 + i * 300, onComplete: function () { fl.remove(); bd.destroy(); } });
        });
        if (!sea.said.bird) { sea.said.bird = true; this.toast(X.hornbill, 'enggang20_0'); }
      }
      // the elephants at the ford
      if (!sea.fordDone && x < R.ford + 16) this.buayaElephants(time, dt);
      // the crocodile clan
      sea.heads.forEach(function (h, i) { h.y += Math.sin(time / 600 + i) * 0.03; });
      if (x < R.block + 4) { sh.x = Math.max(sh.x, (R.block + 3) * T); if (sh.spd > 20) sh.spd = 20; }
      if (!sea.blocked && x < R.block + 6 && !blocked) {
        sea.blocked = true; sh.spd = 0;
        LC.Audio.sfx('buaya20');
        this.buayaLines(X.blocked);
        sea.countPending = true;
        sea.countAsk = true;
        return;
      }
      if (sea.countAsk && !blocked) { sea.countAsk = false; this.buayaCountOpen(); return; }
      if (sea.chase) this.buayaChase(time, dt, blocked);
    },
    buayaRiverMid: function (x) {   // the middle of the river at a column
      var g = this.grid, tx = clamp(Math.round(x), 0, this.W - 1), top = -1, bot = -1;
      for (var y = 0; y < this.H; y++) if (g[y][tx] === 'w' || g[y][tx] === 'h') { if (top < 0) top = y; bot = y; }
      return top < 0 ? this.H / 2 : (top + bot) / 2 + 0.5;
    },
    buayaElephants: function (time, dt) {
      var self = this, sea = this.c20.sea, sh = sea.sh, R = C.river;
      if (!sea.herd) {
        var mid = this.buayaRiverMid(R.ford);
        sea.herd = [0, 1, 2].map(function (i) {
          var e = self.add.sprite((R.ford - 1 + i * 1.4) * T, (mid - 9 - i * 1.5) * T, 'gajah20_0').setOrigin(0.5, 1).setScale(i === 2 ? 0.7 : 1);
          return { spr: e, ty: (mid + 9 + i) * T, f: 0 };
        });
        sea.herdT = 0;
        this.toast(X.elephants, 'gajah20_0');
        LC.Audio.sfx('cheer');
      }
      var moving = false;
      sea.herd.forEach(function (e, i) {
        if (e.spr.y < e.ty) { moving = true; e.spr.y += (16 - i * 2) * dt; e.spr.setDepth(e.spr.y + 6); if ((e.f -= dt) <= 0) { e.f = 0.3; e.spr.setTexture(e.spr.texture.key === 'gajah20_0' ? 'gajah20_1' : 'gajah20_0'); } }
      });
      if (moving) { if (sh.x < (R.ford + 5) * T) { sh.x = (R.ford + 5) * T; sh.spd = 0; } }
      else { sea.fordDone = true; this.toast(X.elephantsGone, 'gajah20_0'); }
    },
    buayaCountOpen: function () {
      var self = this, sea = this.c20.sea;
      if (!sea || sea.countOpen || this.ui.isBlocking()) return;
      sea.countOpen = true;
      this.ui.openCount20(C.count, function (won) {
        sea.countOpen = false;
        if (!won) return;
        sea.countPending = false;
        self.buayaLines(X.countAsk, { choices: [
          { label: 'Lima (five)', fn: function () { self.buayaLines([['', X.countWrongPick]]); sea.countPending = true; } },
          { label: 'Tujuh (seven)', fn: function () { sea.counted = true; self.buayaLines(X.choose, { choices: [
            { label: 'Laugh at the trick', fn: function () { self.buayaLines(X.trick); sea.chaseStart = true; } },
            { label: 'Tell the truth', fn: function () { self.buayaLines(X.truth); sea.sisikPending = true; } },
            { label: 'Say nothing', fn: function () { self.buayaLines(X.truth); sea.sisikPending = true; } }
          ] }); } },
          { label: 'Sembilan (nine)', fn: function () { self.buayaLines([['', X.countWrongPick]]); sea.countPending = true; } }
        ] });
      });
    },
    buayaChase: function (time, dt, blocked) {
      var self = this, sea = this.c20.sea, sh = sea.sh, ch = sea.chase;
      if (blocked) return;
      ch.t -= dt;
      ch.crocs.forEach(function (k) {
        var dx = sh.x - k.x, dy = sh.y - k.y, d = Math.hypot(dx, dy) || 1, v = 58 * dt;
        k.x += dx / d * v; k.y += dy / d * v;
        k.img.setPosition(k.x, k.y).setRotation(Math.atan2(dy, dx));
        if (d < 26 && (k.cd -= dt) <= 0) { k.cd = 1.2; sh.spd = -30; self.cameras.main.shake(160, 0.004); LC.Audio.sfx('bump11'); self.ui.floatText(sh.x, sh.y - 20, 'SNAP!', '#ffb0a0'); }
      });
      if (ch.t <= 0) {
        ch.crocs.forEach(function (k) { self.tweens.add({ targets: k.img, alpha: 0, duration: 800, onComplete: function () { k.img.destroy(); } }); });
        sea.chase = null;
        LC.Audio.sfx('buaya20'); this.cameras.main.shake(400, 0.006);
        this.buayaLines(X.chaseEnd);
        sea.sisikPending = true;
      }
    },
    buayaSisik: function () {   // Tok Sisik: "Sister. You came home."
      var self = this, sea = this.c20.sea;
      sea.sisikPending = false;
      story(this, 11);   // (saved first)
      sea.heads.forEach(function (h, i) { self.tweens.add({ targets: h, alpha: 0, y: h.y + 6, duration: 900, delay: i * 30 }); });
      this.buayaLines(X.sisik);
      this.c20b.nestPending = true;
    },

    // ================================================================ the nest bank
    buayaNestSetup: function () {
      var self = this, b = this.c20b, S = this.S, s = step(this), L = lake();
      if (s >= 12 && s <= 16) {
        b.shadow = this.add.sprite(L.x, L.y, 'bayang20_besar_0').setOrigin(0.5, 0.75).setDepth(9005).setScale(2.2).setAlpha(0.92);
        b.shadow.play('bayang20_besar_walk');
      }
      if (s >= 13 && s <= 16) this.buayaFleet();
      if (s === 13) { b.fightOn = true; this.time.delayedCall(600, function () { if (!self.leaving) self.toast(X.fightHow, 'kelam_0'); }); }
      if (s === 14) this.time.delayedCall(500, function () { if (!self.leaving) self.buayaRideStart(); });
      if (s === 15) this.time.delayedCall(500, function () { if (!self.leaving) self.buayaTrickStart(); });
      if (s === 12) this.time.delayedCall(700, function () { if (!self.leaving) self.toast(X.alone + ' ' + X.bellHint, 'ic_moon'); });
      if (s === 11 && !S.quests.c20nestArr) { S.quests.c20nestArr = true; LC.State.save(); this.time.delayedCall(700, function () { if (!self.leaving) self.buayaLines(X.nestArrive); }); }
      if (s >= 18) { var ns = this.objImgs.s_sarang20; if (ns) ns.setTexture('sarang20_pecah'); }
      if (s === 11) this.tweens.add({ targets: b, dusk: 1, duration: 9000 });
    },
    buayaFleet: function () {   // the Kampong Ayer fleet on the lake, every boat with a lamp; the moon
      var self = this, b = this.c20b, L = C.nest.lake;
      if (b.fleet) return;
      b.moon = true;
      b.fleet = [];
      for (var i = 0; i < 10; i++) {
        var a = i / 10 * Math.PI * 2, x = (L.x + Math.cos(a) * (L.rx - 1.5)) * T, y = (L.y + Math.sin(a) * (L.ry - 1.5)) * T;
        var im = this.add.image(x, y, 'perahu_kecil').setDepth(y).setFlipX(Math.cos(a) > 0);
        var lt = this.addLight(x, y - 8, 0xffc070, 0.9, true); lt.base = 0.9;
        b.fleet.push({ im: im, lt: lt, y0: y, ph: i });
      }
    },
    buayaPutih2: function () {
      var s = step(this), self = this;
      if (s === 11) { if (!this.c20b.cine) this.buayaVisionStart(); return; }
      if (s === 17) {
        this.buayaLines(this.c20b.askedGo ? X.goAsk : X.dawnEggs.concat(X.goAsk), { choices: [
          { label: X.goLabels[0], fn: function () { self.c20b.letGoPending = true; } },
          { label: X.goLabels[1], fn: function () { self.buayaLines(X.notYet); } }
        ] });
        this.c20b.askedGo = true;
        return;
      }
      LC.Audio.sfx('buaya20');
      this.toast(s >= 18 ? 'Seri Putih dozes in the warm shallows beside her hatchlings. She is white all over now, like the moon.' : 'Seri Putih watches the lake, very still.', 'buaya20_face');
      void self;
    },
    buayaNenek2: function () {
      var s = step(this);
      if (s === 17) { this.buayaLines([['nenek20', pick(X.nenekWait)]]); return; }
      if (s === 12) { this.buayaLines([['nenek20', 'Ring the bell, cucu. Dang Kemala made it so we could find each other in the dark.']]); return; }
      this.buayaLines([['nenek20', pick(LC.BUAYA_TEXT.nenekKA)]]);
    },
    buayaVisionStart: function () {   // the vision, then Pelita flees, and the shadow rises
      var self = this, b = this.c20b;
      b.cine = { phase: 'vision', t: 0, actors: {} };
      this.ui.openVision20(X.vision, function () { b.cine.phase = 'after'; });
      void self;
    },
    buayaCine2: function (dt) {
      var self = this, b = this.c20b, ci = b.cine, L = lake();
      if (ci.wait) return;
      if (ci.t > 0) { ci.t -= dt; return; }
      if (ci.phase === 'vision') return;   // (the UI is showing it)
      if (ci.phase === 'after') { ci.phase = 'flee'; this.buayaLines(X.visionAfter); return; }
      if (ci.phase === 'flee') {
        ci.phase = 'rise'; ci.wait = true;
        var gx = this.ghost.x, gy = this.ghost.y, p = this.add.image(gx, gy, LC.ghostTex(this.S.ghost.stage, 'sad')).setDepth(9006);
        b.noPelita = true; ci.actors.pel = p; ci.from = { x: this.player.x + 6, y: this.player.y };
        this.tweens.add({ targets: p, x: 2.5 * T, y: 7 * T, duration: 1400, ease: 'Quad.easeIn', onComplete: function () { p.setVisible(false); ci.wait = false; ci.t = 0.8; } });
        LC.Audio.sfx('sad');
        return;
      }
      if (ci.phase === 'rise') {
        ci.phase = 'speak'; ci.wait = true;
        var sh = b.shadow = this.add.sprite(ci.from.x, ci.from.y, 'bayang20_besar_0').setOrigin(0.5, 1).setDepth(9005).setScale(0.15, 0.05).setAlpha(0.95);
        sh.play('bayang20_besar_walk');
        LC.Audio.sfx('bayang20'); this.cameras.main.shake(1800, 0.004);
        this.tweens.add({ targets: sh, scaleX: 1.6, scaleY: 1.6, duration: 2200, ease: 'Back.easeOut', onComplete: function () { ci.wait = false; } });
        return;
      }
      if (ci.phase === 'speak') { ci.phase = 'swallow'; this.buayaLines(X.shadowRise); return; }
      if (ci.phase === 'swallow') {
        ci.phase = 'end'; ci.wait = true;
        story(this, 12);   // (saved first)
        var pel = ci.actors.pel, sh2 = b.shadow;
        pel.setVisible(true).setPosition(2.5 * T, 7 * T);
        this.tweens.add({ targets: pel, x: sh2.x, y: sh2.y - 50, scale: 0.3, duration: 1200, ease: 'Quad.easeIn', onComplete: function () {
          pel.destroy(); LC.Audio.sfx('poof'); self.cameras.main.flash(300, 60, 30, 90);
          sh2.setOrigin(0.5, 0.75);
          self.tweens.add({ targets: sh2, x: L.x, y: L.y, scaleX: 2.2, scaleY: 2.2, duration: 2600, ease: 'Sine.easeInOut', onComplete: function () { ci.wait = false; } });
        } });
        return;
      }
      if (ci.phase === 'end') {
        b.cine = null; b.noPelita = false;
        this.toast(X.alone, 'ic_moon');
        this.time.delayedCall(1500, function () { if (!self.leaving) self.toast(X.bellHint, 'tiang20'); });
      }
    },
    buayaBell: function () {
      var self = this, s = step(this);
      if (s !== 12) { this.toast(s > 12 ? 'Dang Kemala\'s bell post. The bell still trembles.' : 'A post by the water, for tying boats. Or for hanging a bell.', 'tiang20'); return; }
      if (!LC.State.count('loceng20')) { LC.State.add('loceng20', 1); this.toast(X.bellNeed, 'i_loceng20'); }
      story(this, 13);   // (saved first)
      LC.Audio.sfx('loceng20');
      this.time.delayedCall(700, function () { LC.Audio.sfx('loceng20'); });
      this.buayaLines(X.bell);
      this.c20b.bellPending = true;
      void self;
    },

    // ---- step 13: the shadows on the bank, with Awang Semaun and Badang beside you
    updateFight20: function (time, dt) {
      var self = this, b = this.c20b, q = this.S.quests;
      if ((b.allyT -= dt) <= 0) {
        b.allyT = 2.2;
        ['s_semaun20', 's_badang20'].forEach(function (id, i) {
          var im = self.objImgs[id];
          if (!im) return;
          var foe = null, bd = 150;
          (self.enemies || []).forEach(function (e) { if (!e.dead && !e.away && e.g.c20b) { var d = Math.hypot(e.spr.x - im.x, e.spr.y - im.y); if (d < bd) { bd = d; foe = e; } } });
          if (!foe) return;
          var g = self.add.graphics().setDepth(9600).setBlendMode(ADD());
          g.lineStyle(2, i ? 0xffc890 : 0xfff0b0, 0.9); g.lineBetween(im.x, im.y - 14, foe.spr.x, foe.spr.y - 8);
          self.tweens.add({ targets: g, alpha: 0, duration: 300, onComplete: function () { g.destroy(); } });
          self.tweens.add({ targets: im, y: im.y - 3, duration: 90, yoyo: true });
          foe.hp -= i ? 6 : 4; foe.hurtT = 0.1; foe.spr.setTintFill(0xffffff);
          self.ui.floatText(foe.spr.x, foe.spr.y - 20, i ? 'Boulder!' : 'Hiyah!', '#ffe8a0');
          if (foe.hp <= 0) self.enemyDie(foe);
        });
      }
      if ((q.c20kills || 0) >= C.kills && b.fightOn) {
        b.fightOn = false;
        (this.enemies || []).forEach(function (e) { if (e.g.c20b && !e.dead) { e.dead = true; e.respawn = Infinity; e.light.base = 0; self.fx.smoke.explode(6, e.spr.x, e.spr.y - 8); self.tweens.add({ targets: e.spr, alpha: 0, duration: 600, onComplete: function () { e.spr.setVisible(false); } }); } });
        LC.Audio.setBattle(false);
        story(this, 14);   // (saved first)
        this.buayaLines(X.rideHow);
        b.ridePending = true;
      }
    },

    // ---- step 14: ride Seri Putih across the lake, through the stolen lights
    buayaRideStart: function () {
      var self = this, b = this.c20b, L = lake(), p = this.player, start = { x: (C.nest.lake.x - C.nest.lake.rx + 2.5) * T, y: L.y };
      if (b.ride) return;
      var R = b.ride = { x: start.x, y: start.y, ang: 0, spd: 0, str: 100, inv: 0, got: 0, frameT: 0, f: 0, waveT: 2, waves: [], orbs: [] };
      R.img = this.add.image(R.x, R.y, 'buaya20t_0').setDepth(9002).setScale(1.5);
      R.rider = this.add.image(R.x, R.y - 6, LC.Art.plKey(this.pc) + '_down_0').setDepth(9003).setScale(0.9);
      R.light = this.addLight(R.x, R.y, 0xd8e8ff, 1.6, false); R.light.base = 0.6;
      R.g = this.add.graphics().setDepth(9004);
      for (var i = 0; i < C.ride.lights; i++) {
        var o = { a: i / C.ride.lights * Math.PI * 2, r: 72 + (i % 3) * 18, img: this.add.image(L.x, L.y, 'glow').setBlendMode(ADD()).setDepth(9006).setTint(0xfff0b0).setScale(0.35), done: false };
        o.core = this.add.image(L.x, L.y, 'percik20').setDepth(9007);
        R.orbs.push(o);
      }
      p.setVisible(false); this.pShadow.setVisible(false);
      this.cameras.main.startFollow(R.img, true, 0.12, 0.12);
      void self;
    },
    updateRide20: function (dt, blocked) {
      var self = this, b = this.c20b, R = b.ride, k = this.keys, p = this.player, L = lake(), time = this.time.now;
      var vx = 0, vy = 0, analog = 1;
      if (!blocked) {
        if (k.A.isDown || k.LEFT.isDown) vx -= 1; if (k.D.isDown || k.RIGHT.isDown) vx += 1;
        if (k.W.isDown || k.UP.isDown) vy -= 1; if (k.S.isDown || k.DOWN.isDown) vy += 1;
        if (!vx && !vy) { var tv = this.ui.touchVec(); if (tv && Math.hypot(tv.x, tv.y) > 0.15) { vx = tv.x; vy = tv.y; analog = clamp(Math.hypot(vx, vy) * 1.2, 0.4, 1); } }
      }
      var steer = !!(vx || vy);
      if (steer) { var want = Math.atan2(vy, vx), d = wrapA(want - R.ang); R.ang = wrapA(R.ang + clamp(d, -C.ride.turn * dt, C.ride.turn * dt)); R.spd = Math.min(C.ride.speed * analog, R.spd + 120 * dt); }
      else R.spd = Math.max(0, R.spd - 90 * dt);
      var nx = R.x + Math.cos(R.ang) * R.spd * dt, ny = R.y + Math.sin(R.ang) * R.spd * dt;
      function wet(x, y) { var tx = Math.floor(x / T), ty = Math.floor(y / T); return !!(self.grid[ty] && self.grid[ty][tx] === 'w'); }
      var ca = Math.cos(R.ang), sa = Math.sin(R.ang);
      if (wet(nx + ca * 22, ny + sa * 22) && wet(nx - ca * 18, ny - sa * 18) && wet(nx, ny)) { R.x = nx; R.y = ny; } else R.spd *= 0.4;
      if ((R.frameT -= dt) <= 0) { R.frameT = R.spd > 30 ? 0.25 : 0.6; R.f = R.f ? 0 : 1; R.img.setTexture('buaya20t_' + R.f); }
      R.img.setPosition(R.x, R.y).setRotation(R.ang);
      R.rider.setPosition(R.x - ca * 4, R.y - sa * 4 - 6);
      R.light.img.setPosition(R.x, R.y);
      p.x = R.x; p.y = R.y + 6; p.setVisible(false); this.pShadow.setVisible(false); this.moving = R.spd > 6;
      if (blocked) return;
      R.inv -= dt;
      R.img.setAlpha(R.inv > 0 ? (Math.floor(time / 80) % 2 ? 0.4 : 1) : 1);
      // the stolen lights circle the shadow
      R.orbs.forEach(function (o) {
        if (o.done) return;
        o.a += dt * 0.55;
        var ox = L.x + Math.cos(o.a) * o.r, oy = L.y + Math.sin(o.a) * o.r * 0.7;
        o.img.setPosition(ox, oy).setScale(0.32 + 0.05 * Math.sin(time / 200 + o.r)); o.core.setPosition(ox, oy);
        if (Math.hypot(ox - R.x, oy - R.y) < 18) {
          o.done = true; R.got++;
          o.img.destroy(); o.core.destroy();
          self.fx.sparkle.explode(16, ox, oy); LC.Audio.sfx('chime');
          if (b.shadow) { self.tweens.add({ targets: b.shadow, scaleX: b.shadow.scaleX * 0.92, scaleY: b.shadow.scaleY * 0.92, duration: 300 }); self.cameras.main.shake(200, 0.004); }
          self.toast(X.rideLight.replace('{n}', R.got).replace('{of}', C.ride.lights), 'percik20');
        }
      });
      // the dark rings it sends out
      if ((R.waveT -= dt) <= 0) { R.waveT = C.ride.waveEvery; R.waves.push({ r: 24, hit: false }); LC.Audio.sfx('bayang20'); }
      R.g.clear();
      R.waves = R.waves.filter(function (w) {
        w.r += (C.ride.waveR / 2.6) * dt;
        R.g.lineStyle(5, 0x2a1840, 0.75 * (1 - w.r / C.ride.waveR)); R.g.strokeEllipse(L.x, L.y, w.r * 2, w.r * 1.4);
        R.g.lineStyle(1, 0xc8a8ff, 0.8 * (1 - w.r / C.ride.waveR)); R.g.strokeEllipse(L.x, L.y, w.r * 2, w.r * 1.4);
        var dx = (R.x - L.x), dy = (R.y - L.y) / 0.7, rr = Math.hypot(dx, dy);
        if (!w.hit && R.inv <= 0 && Math.abs(rr - w.r) < 10) { w.hit = true; R.inv = 1; R.str -= 24; self.cameras.main.shake(180, 0.005); LC.Audio.sfx('hurt'); self.ui.floatText(R.x, R.y - 20, '-24', '#ffb0c0'); if (!b.said.hit) { b.said.hit = true; self.toast(X.rideHit, 'buaya20_face'); } }
        return w.r < C.ride.waveR;
      });
      if (R.str <= 0) {   // back to the bank to catch her breath
        R.str = 100; R.x = (C.nest.lake.x - C.nest.lake.rx + 2.5) * T; R.y = L.y; R.ang = 0; R.spd = 0; R.inv = 1.5; R.waves = [];
        this.cameras.main.flash(300, 20, 20, 40);
        this.toast(X.rideFail, 'buaya20_face');
      }
      if (R.got >= C.ride.lights) this.buayaRideEnd();
    },
    buayaRideEnd: function () {
      var self = this, b = this.c20b, R = b.ride;
      if (!R) return;
      story(this, 15);   // (saved first)
      R.img.destroy(); R.rider.destroy(); R.g.destroy(); R.light.base = 0; R.light.img.setAlpha(0);
      R.orbs.forEach(function (o) { if (!o.done) { o.img.destroy(); o.core.destroy(); } });
      b.ride = null;
      var sp = this.tilePx({ x: 10, y: 15 });
      this.player.setPosition(sp.x, sp.y).setVisible(true); this.pShadow.setVisible(true);
      this.cameras.main.startFollow(this.player, true, 0.2, 0.2);
      LC.Audio.sfx('cheer');
      this.buayaLines(X.rideDone);
      b.trickPending = true;
      void self;
    },

    // ---- step 15: Kancil's trick, and the heart that opens
    buayaTrickStart: function () {
      var self = this, b = this.c20b, L = lake();
      if (b.heart) return;
      var kx = 11 * T, ky = 12 * T;
      b.heart = { open: false, t: 1.5, phase: 'wait', jar: this.add.image(kx + 8, ky - 6, 'jar20').setDepth(ky + 1), kancil: this.add.sprite(kx, ky, 'kancil20_0').setOrigin(0.5, 1).setDepth(ky), home: { x: L.x, y: L.y } };
      b.heart.jarL = this.addLight(kx + 8, ky - 8, 0xfdff90, 1, true); b.heart.jarL.base = 0.9;
      b.heart.glow = this.add.image(L.x, L.y, 'glow').setBlendMode(ADD()).setDepth(9006).setTint(0xfff6d8).setScale(0.2).setAlpha(0);
      this.buayaLines(X.trickSet);
      void self;
    },
    updateHeart: function (time, dt) {
      var self = this, b = this.c20b, H = b.heart, sh = b.shadow;
      if (!H || !sh) return;
      H.t -= dt;
      if (H.phase === 'wait' && H.t <= 0) {   // it lunges at the fake light...
        H.phase = 'lunge'; H.t = 1.1;
        LC.Audio.sfx('loceng20'); this.ui.floatText(H.kancil.x, H.kancil.y - 20, 'Ding-a-ling!', '#fff0b0');
        this.tweens.add({ targets: sh, x: H.home.x - (H.home.x - H.jar.x) * 0.55, y: H.home.y - (H.home.y - H.jar.y) * 0.4, duration: 650, ease: 'Quad.easeIn' });
      } else if (H.phase === 'lunge' && H.t <= 0) {   // ...and its heart opens for a moment
        H.phase = 'open'; H.t = 0.9; H.open = true;
        H.glow.setAlpha(1).setScale(0.5);
        LC.Audio.sfx('chime');
      } else if (H.phase === 'open' && H.t <= 0) {
        H.phase = 'back'; H.t = 1.2; H.open = false;
        H.glow.setAlpha(0);
        this.tweens.add({ targets: sh, x: H.home.x, y: H.home.y, duration: 900, ease: 'Sine.easeOut' });
      } else if (H.phase === 'back' && H.t <= 0) { H.phase = 'wait'; H.t = 2.4; }
      H.glow.setPosition(sh.x, sh.y + 10 * sh.scaleY);
      if (H.open) H.glow.setScale(0.5 + 0.1 * Math.sin(time / 60));
      H.jarL.img.setAlpha(0.6 + 0.3 * Math.sin(time / 120));
      void self;
    },
    buayaHeartMiss: function () { this.toast(X.trickMiss, 'kancil20_0'); LC.Audio.sfx('error'); },
    buayaHeartJump: function () {
      var self = this, b = this.c20b, H = b.heart;
      if (!H || !H.open) return;
      H.open = false;
      story(this, 16);   // (saved first)
      this.toast(X.trickDone, 'bayang20_besar_0');
      this.cameras.main.flash(500, 255, 250, 230);
      this.time.delayedCall(400, function () { self.buayaGo('dalam20', C.inside.spawn); });
    },

    // ================================================================ inside the shadow
    buayaInsideSetup: function () {
      var self = this, b = this.c20b, s = step(this);
      b.found = false; b.fed = false; b.cryT = 1; b.mem = C.inside.memories.map(function (m, i) {
        var p = { x: (m.x + 0.5) * T, y: (m.y + 0.5) * T };
        var im = self.add.image(p.x, p.y, 'glow').setBlendMode(ADD()).setDepth(9006).setTint(0xb8c8ff).setScale(0.3).setAlpha(0.7);
        self.tweens.add({ targets: im, alpha: 0.35, duration: 900, yoyo: true, repeat: -1 });
        return { x: p.x, y: p.y, img: im, i: i, seen: false };
      });
      var pp = this.objImgs.d_pelita20;
      if (pp) { b.sparkL = this.addLight(pp.x, pp.y - 6, 0xfff0b0, 0.7, true); b.sparkL.base = 0.8; this.tweens.add({ targets: pp, y: pp.y - 3, duration: 700, yoyo: true, repeat: -1 }); }
      this.playerLight.base = 0.6;
      if (s === 16) this.time.delayedCall(800, function () { if (!self.leaving) self.toast(X.insideArrive, 'ic_moon'); });
    },
    updateInside: function (time, dt) {
      var self = this, b = this.c20b, p = this.player, pp = this.objImgs.d_pelita20;
      if (!pp) return;
      if ((b.hideT = (b.hideT || 0) - dt) <= 0) {   // (inside the shadow you are alone: friends who follow you wait outside)
        b.hideT = 1;
        b.hideList = this.children.list.filter(function (o) { var k = o.texture && o.texture.key; return k && /^(npc_|sp_|mirror|wira_)/.test(k); });
      }
      (b.hideList || []).forEach(function (o) { if (o.active) o.setVisible(false); });
      var d = Math.hypot(pp.x - p.x, pp.y - p.y);
      if ((b.cryT -= dt) <= 0 && !b.fed) {   // a tiny voice, crying: louder as you come closer
        b.cryT = 2.4;
        var A = LC.Audio, v = clamp(1 - d / 420, 0.05, 1);
        if (A.ctx && A.ctx.state === 'running' && A.vol && A.vol.sfx) { var t0 = A.ctx.currentTime + 0.01; A.tone(t0, 'sine', 1400, 1100, 0.25, 0.05 * v); A.tone(t0 + 0.3, 'sine', 1300, 900, 0.35, 0.04 * v); }
        if (d > 90) this.ui.floatText(p.x + (pp.x > p.x ? 22 : -22), p.y - 26, '(...crying...)', '#d8d0ff');
      }
      b.mem.forEach(function (m) {
        if (m.seen || Math.hypot(m.x - p.x, m.y - p.y) > 36) return;
        m.seen = true;
        self.tweens.add({ targets: m.img, alpha: 0, scale: 0.8, duration: 1200, onComplete: function () { m.img.destroy(); } });
        self.toast(X.memories[m.i], 'ic_bond');
      });
    },
    buayaSpark: function () {
      var self = this, b = this.c20b, S = this.S;
      if (!b.found) { b.found = true; LC.Audio.sfx('sad'); this.buayaLines(X.pelitaFound); return; }
      if (b.fed) return;
      var sl = LC.State.selItem(), it = sl && LC.ITEMS[sl.id], dish = it && it.food ? sl.id : null;
      if (!dish) {   // anything to eat in the bag? Nenek's kuih, at least
        var any = S.inv.filter(function (x) { return x && LC.ITEMS[x.id] && LC.ITEMS[x.id].food; })[0];
        if (any) dish = any.id;
        else { LC.State.add('kuih_pandan', 1); dish = 'kuih_pandan'; this.toast(X.noDish, 'i_kuih_pandan'); }
      }
      LC.State.remove(dish, 1);
      b.fed = true;
      var pp = this.objImgs.d_pelita20;
      if (pp) { this.fx.heart.explode(6, pp.x, pp.y - 6); this.tweens.add({ targets: pp, scale: 1.8, duration: 800 }); }
      if (b.sparkL) b.sparkL.img.setScale(1.2);
      LC.Audio.sfx('eat');
      this.buayaLines([['', X.fed]].concat(X.tellAsk), { choices: X.tell.map(function (t) {
        return { label: t[0], fn: function () { self.buayaLines([['', '"' + t[1] + '"']].concat(X.shrink)); b.shrinkPending = true; } };
      }) });
      void S;
    },
    buayaShrink: function () {   // back on the sandbank, before dawn: the shadow is only a shadow now
      var b = this.c20b;
      b.shrinkPending = false;
      story(this, 17);   // (saved first)
      this.S.quests.c20dawn = this.S.day;
      LC.State.save();
      this.cameras.main.flash(900, 255, 252, 240);
      this.buayaTravelSleep('sarang20', { x: 9, y: 16 });
    },

    // ================================================================ letting go, and Pelita Putih
    buayaLetGo: function () {
      var self = this, b = this.c20b, im = this.objImgs.s_putih20, mouth = im ? { x: im.x + 26, y: im.y - 12 } : { x: this.player.x, y: this.player.y - 20 };
      b.letGoPending = false;
      b.cine = { phase: 'go', t: 0, actors: {} };
      var gx = this.ghost.x, gy = this.ghost.y, pel = this.add.image(gx, gy, LC.ghostTex(this.S.ghost.stage, 'normal')).setDepth(9006);
      b.noPelita = true; b.cine.actors.pel = pel; b.cine.mouth = mouth;
      this.tweens.add({ targets: pel, x: mouth.x, y: mouth.y, scale: 0.4, duration: 2200, ease: 'Sine.easeInOut', onComplete: function () { pel.destroy(); self.fx.sparkle.explode(10, mouth.x, mouth.y); self.buayaLines(X.letGo); b.cine.phase = 'silence'; b.cine.t = 2.5; } });
      b.cine.wait = false;
      LC.Audio.setBattle(false);
    },
    buayaLetGoCine: function (dt) {
      var self = this, b = this.c20b, ci = b.cine, S = this.S, q = S.quests;
      if (ci.phase === 'go') return;
      if (ci.t > 0) { ci.t -= dt; return; }
      if (ci.phase === 'silence') {   // the mustika blazes; the eggs crack; Pelita returns, white
        ci.phase = 'end';
        story(this, 18);   // (saved first, with the rewards)
        q.c20putih = true; q.c20hatch = S.day; q.c20rumah = true; if (!q.c20kancil) q.c20kancil = 'home';
        S.ghost.joy = 100; S.ghost.full = Math.max(S.ghost.full, 80);
        LC.State.save();
        var m = ci.mouth;
        var burst = this.add.image(m.x, m.y, 'glow').setBlendMode(ADD()).setDepth(9600).setTint(0xfff6e0).setScale(0.2);
        this.tweens.add({ targets: burst, scale: 6, alpha: 0, duration: 1800, onComplete: function () { burst.destroy(); } });
        this.cameras.main.flash(1200, 255, 250, 235);
        LC.Audio.sfx('chime'); this.time.delayedCall(400, function () { LC.Audio.sfx('cheer'); });
        var ns = this.objImgs.s_sarang20;
        if (ns) { ns.setTexture('sarang20_pecah'); this.fx.sparkle.explode(14, ns.x, ns.y - 6); }
        // the hatchlings, and one that follows you
        for (var i = 0; i < 5; i++) (function (i) {
          var h = self.add.image((ns ? ns.x : m.x) - 12 + i * 6, (ns ? ns.y : m.y) - 2, 'anak20_kecil').setOrigin(0.5, 1).setDepth(ns ? ns.y + 2 : 9000);
          self.tweens.add({ targets: h, x: h.x + (i - 2) * 14, y: h.y + 10 + i * 3, duration: 1600 + i * 200, delay: 600 + i * 150, onComplete: function () { if (i !== 2) self.tweens.add({ targets: h, alpha: 0, duration: 1200, delay: 1500, onComplete: function () { h.destroy(); } }); } });
          if (i === 2) b.anak = { spr: h };
        })(i);
        b.noPelita = false;
        this.buayaLines(X.returns.concat(X.homeward));
        b.feastPending = true;
        b.cine = null;
      }
    },
    updateAnakFollow: function (dt) {   // the hatchling toddles after you
      var b = this.c20b, a = b.anak, p = this.player;
      if (!a || !a.spr.active) return;
      var tx = p.x - (this.dir === 'left' ? -16 : 16), ty = p.y + 4, dx = tx - a.spr.x, dy = ty - a.spr.y, d = Math.hypot(dx, dy);
      if (d > 6) { var v = Math.min(d * 2.5, 70) * dt; a.spr.x += dx / d * v; a.spr.y += dy / d * v; a.spr.setFlipX(dx < 0); }
      a.spr.setDepth(a.spr.y);
    },

    // ================================================================ Kenduri Terakhir
    buayaFeastSetup: function () {
      var self = this, b = this.c20b, S = this.S, q = S.quests;
      if (!C.isNight(S) && S.minutes < 19 * 60) S.minutes = 19 * 60 + 30;
      b.feast = true;
      var spots = C.feastSpots.slice(), cast = [];
      C.feast.forEach(function (f, i) {
        if (!self.textures.exists(f[0]) || !spots.length) return;
        var at = spots.shift(), o = { type: 'buaya_feast', name: f[1], line: f[2], tex: f[0] };
        var th = self.buayaPut('feast' + i, { x: at[0], y: at[1] }, f[0], o);
        if (f[3]) th.spr.setAlpha(0.7).setTint(0xd8e8ff);
        if (self.anims.exists(f[0].replace(/_0$/, '_idle'))) th.spr.play(f[0].replace(/_0$/, '_idle'));
        cast.push(f[0]);
      });
      b.cast = cast;
      this.buayaPut('feastNenek', { x: 4, y: 20 }, 'npc_nenek_0', { type: 'buaya_feast', name: 'Nenek', nenek: true, tex: 'npc_nenek_0' });
      this.buayaPut('feastKancil', { x: 3, y: 20 }, 'kancil20_0', { type: 'buaya_feast', name: 'Sang Kancil', line: 'I have eaten nine kinds of kuih. There are eleven. I have work to do.', tex: 'kancil20_0' });
      // boats on the river, every one with a lamp
      for (var i = 0; i < 12; i++) {
        var x = (3 + i * 3.4) * T, y = (17 + (i % 3) * 0.8) * T, im = this.add.image(x, y, 'perahu_kecil').setOrigin(0.5, 1).setDepth(y);
        var lt = this.addLight(x, y - 10, 0xffc070, 0.8, true); lt.base = 0.9;
        this.tweens.add({ targets: im, y: y - 1, duration: 700 + i * 40, yoyo: true, repeat: -1 });
      }
      // the lamps on the walkways
      (C.ka.lamps || []).forEach(function (l) { var p = feet(l), lt = self.addLight(p.x, p.y - 20, 0xffd890, 0.9, true); lt.base = 0.9; });
      // the hatchling, at your heels
      var p0 = this.player;
      b.anak = { spr: this.add.image(p0.x - 16, p0.y + 4, 'anak20_kecil').setOrigin(0.5, 1) };
      if (!q.c20feastArr) { q.c20feastArr = true; LC.State.save(); this.time.delayedCall(900, function () { if (!self.leaving) { LC.Audio.sfx('cheer'); self.buayaLines(X.feastArrive); } }); }
    },
    buayaFeastTalk: function (o) {
      var self = this;
      if (o.nenek) {
        this.buayaLines(X.photoAsk, { choices: [
          { label: X.photoLabels[0], fn: function () { self.buayaLines(X.photoTaken); self.c20b.photoPending = true; } },
          { label: X.photoLabels[1], fn: function () { self.buayaLines([['nenek20', 'Go on, then. Say goodbye to everyone. I will be right here.']]); } }
        ] });
        return;
      }
      var lines = [[null, o.line]];
      this.ui.say([{ name: o.name, portrait: o.tex, text: o.line }].concat(o.tex === 'npc20_anak_0' ? [{ text: X.childHug }] : o.tex === 'npc14_amin_0' ? [{ text: X.amin }] : []));
      void lines;
    },
    buayaPhoto: function () {   // the photo, Amin's fireworks, then the credits
      var self = this, b = this.c20b, q = this.S.quests;
      b.photoPending = false;
      q.c20photo = (b.cast || []).slice(0, 14);
      q.c20photoDay = this.S.day;
      LC.State.save();
      this.cameras.main.flash(400, 255, 255, 255);
      LC.Audio.sfx('chime');
      this.ui.openPhoto20(function () {
        if (self.fwShow) {
          self.cutscene = true;
          self.fwShow(12, { launch: [{ x: 14, y: 17 }, { x: 20, y: 16.5 }, { x: 26, y: 17 }, { x: 32, y: 16.5 }], active: function () { return self.area === 'barunai'; }, cheer: function () {} }, function () { self.cutscene = false; self.buayaCredits(); });
        } else self.buayaCredits();
      });
    },
    buayaCredits: function () {
      var self = this, q = this.S.quests;
      this.ui.openCredits20(function () {
        story(self, C.end); q.c20tamat = self.S.day; LC.State.save();   // (saved first)
        self.buayaTravelSleep('farm', { x: 21, y: 26 });
      });
    },
    buayaEpilogue: function () {   // the next morning, at Nenek's jetty
      var self = this, b = this.c20b, q = this.S.quests, an = this.objImgs.f_anak20;
      q.c20epi = true; LC.State.save();
      var cx = 21.5 * T, cy = 28.5 * T;
      var pup = this.add.image(cx, cy, 'anak20_kecil').setOrigin(0.5, 1).setDepth(cy + 2);
      var pel = this.add.image(cx + 20, cy - 16, LC.ghostTex(this.S.ghost.stage, 'happy')).setDepth(9006);
      var shd = this.add.image(cx + 20, cy, 'shadow').setDepth(cy + 1).setAlpha(0.35);
      b.noPelita = true;
      var o = { a: 0 };
      this.tweens.add({ targets: o, a: Math.PI * 6, duration: 9000, onUpdate: function () {
        pel.setPosition(cx + Math.cos(o.a) * 26, cy - 14 + Math.sin(o.a) * 10 + Math.sin(o.a * 3) * 2);
        shd.setPosition(pel.x, cy + Math.sin(o.a) * 10 + 4);
        pup.setPosition(cx + Math.cos(o.a - 0.6) * 24, cy + Math.sin(o.a - 0.6) * 9 + 2).setFlipX(Math.sin(o.a - 0.6) > 0);
      }, onComplete: function () { pup.destroy(); pel.destroy(); shd.destroy(); b.noPelita = false; } });
      this.cameras.main.pan(cx, cy - 10, 900);
      this.buayaLines(X.epilogue);
      b.epiPending = true;
      void an;
    },

    // ================================================================ after the story
    buayaAnakPet: function () {
      var q = this.S.quests, g = LC.c20Anak(), im = this.objImgs.f_anak20;
      if (im) { this.fx.heart.explode(3, im.x, im.y - 8); this.tweens.add({ targets: im, y: im.y - 2, duration: 120, yoyo: true }); }
      LC.Audio.sfx('pet');
      if (q.c20anakPet !== this.S.day) { q.c20anakPet = this.S.day; this.S.ghost.joy = Math.min(100, this.S.ghost.joy + 6); LC.State.save(); }
      this.toast(pick(X.anakTalk) + ' (Anak Putih is ' + X.anakSize[g - 1] + '.)' + (g === 3 ? ' ' + X.anakGrown : ''), g === 3 ? 'buaya20_face' : 'anak20_kecil');
    },
    buayaNearWater: function () {
      var tx = Math.floor(this.player.x / T), ty = Math.floor((this.player.y - 3) / T);
      for (var dy = -2; dy <= 2; dy++) for (var dx = -2; dx <= 2; dx++) { var ch = this.grid[ty + dy] && this.grid[ty + dy][tx + dx]; if (WET[ch]) return true; }
      return false;
    },
    buayaRideOn: function () {
      var g = LC.c20Anak(), q = this.S.quests;
      if (g < 3) { this.toast(X.rideSmall.replace('{d}', Math.max(1, C.anak.grown - (this.S.day - q.c20hatch))), 'anak20_muda'); LC.Audio.sfx('error'); return; }
      if (!this.canRide('buaya')) { this.toast(X.rideNope, 'i_loceng20'); LC.Audio.sfx('error'); return; }
      if (!this.buayaNearWater()) { this.toast('Anak Putih lives in the water. Ring the bell by a river, a pond or the sea.', 'i_loceng20'); LC.Audio.sfx('error'); return; }
      LC.Audio.sfx('loceng20');
      this.setRide('buaya');
      this.toast(X.rideOn, 'buaya20_face');
    },
    buayaRideOff: function () {
      var tx = Math.floor(this.player.x / T), ty = Math.floor((this.player.y - 3) / T), ch = this.grid[ty] && this.grid[ty][tx];
      if (LC.SOLID_TILES[ch]) { this.toast(X.rideWater, 'buaya20_face'); LC.Audio.sfx('error'); return; }
      this.setRide(null);
      this.toast(X.rideOff, 'buaya20_face');
    },
    buayaBlocked: function (x, y) {   // on Anak Putih's back, water is a road (houses and walls are not)
      var self = this;
      function solid(px, py) {
        var tx = Math.floor(px / T), ty = Math.floor(py / T);
        if (!(tx >= 0 && ty >= 0 && tx < self.W && ty < self.H)) return true;
        if (self.objAt[ty][tx]) return true;
        var ch = self.grid[ty][tx];
        if (WET[ch]) return false;
        return self.solid[ty][tx];
      }
      return solid(x - 5, y - 5) || solid(x + 5, y - 5) || solid(x - 5, y - 1) || solid(x + 5, y - 1);
    },
    updateAnakRide: function (dt, blocked) {
      var k = this.keys, vx = 0, vy = 0, p = this.player, analog = 1;
      if (!blocked) {
        if (k.A.isDown || k.LEFT.isDown) vx -= 1; if (k.D.isDown || k.RIGHT.isDown) vx += 1;
        if (k.W.isDown || k.UP.isDown) vy -= 1; if (k.S.isDown || k.DOWN.isDown) vy += 1;
        if (!vx && !vy) { var tv = this.ui.touchVec(); if (tv && Math.hypot(tv.x, tv.y) > 0.15) { vx = tv.x; vy = tv.y; analog = Math.max(0.4, Math.min(1, Math.hypot(vx, vy) * 1.2)); } }
      }
      if (vx || vy) {
        var tx = Math.floor(p.x / T), ty = Math.floor((p.y - 3) / T), wet = WET[this.grid[ty] && this.grid[ty][tx]];
        var len = Math.hypot(vx, vy), sp = 74 * (wet ? 1.45 : 1.05) * dt * analog;
        var nx = p.x + vx / len * sp, ny = p.y + vy / len * sp;
        if (!this.buayaBlocked(nx, p.y)) p.x = nx;
        if (!this.buayaBlocked(p.x, ny)) p.y = ny;
        var ax = Math.abs(vx), ay = Math.abs(vy);
        if (ax > ay * 1.25) this.dir = vx < 0 ? 'left' : 'right'; else if (ay > ax * 1.25) this.dir = vy < 0 ? 'up' : 'down';
        this.moving = true;
        if (wet && Math.random() < dt * 6) this.fx.drop.explode(1, p.x + (Math.random() - 0.5) * 16, p.y);
      } else this.moving = false;
      p.setFlipX(this.dir === 'left'); p.setDepth(p.y);
      this.pShadow.setPosition(Math.round(p.x), Math.round(p.y - 1));
      this.drawRider(p, 'buaya', this.dir, this.moving, this.veh, this.pc);
    },
    // ---- Sang Kancil, your companion
    buayaKancilAsk: function () {
      var self = this, q = this.S.quests;
      LC.Audio.sfx('kancil20');
      this.buayaLines([['kancil20', pick(LC.BUAYA_TEXT.kancilFarm)]], { choices: [
        { label: 'Come along with me', fn: function () { q.c20kancil = 'with'; LC.State.save(); self.refreshWhen(); self.buayaKancilFollow(); self.toast(X.kancilCome, 'kancil20_0'); } },
        { label: 'Stay and guard the farm', fn: function () { self.toast(X.kancilStay, 'kancil20_0'); } }
      ] });
    },
    buayaKancilHere: function () { var A = this.A; return !A.underwater && !A.voyage20 && !A.sailing && this.area !== 'dalam20' && this.area !== 'sarang20'; },
    buayaKancilFollow: function () {
      var b = this.c20b, p = this.player;
      if (b.kancil) return;
      b.kancil = { spr: this.add.sprite(p.x - 14, p.y + 2, 'kancil20_0').setOrigin(0.5, 1), x: p.x - 14, y: p.y + 2 };
      b.kancil.spr.play('kancil20_walk');
    },
    buayaKancilHome: function () {
      var b = this.c20b, q = this.S.quests;
      q.c20kancil = 'home'; LC.State.save();
      if (b.kancil) { var k = b.kancil.spr; this.tweens.add({ targets: k, alpha: 0, duration: 500, onComplete: function () { k.destroy(); } }); b.kancil = null; }
      this.refreshWhen();
      this.toast(X.kancilStay, 'kancil20_0');
    },
    updateKancilFollow: function (dt) {
      var self = this, b = this.c20b, K = b.kancil, p = this.player, S = this.S;
      if (!K) return;
      var dec = b.decoy;
      if (dec) {   // drawing the enemies away
        dec.t -= dt;
        var dx0 = dec.tx - K.x, dy0 = dec.ty - K.y, d0 = Math.hypot(dx0, dy0);
        if (d0 > 2) { K.x += dx0 / d0 * Math.min(d0, 110 * dt); K.y += dy0 / d0 * Math.min(d0, 110 * dt); }
        dec.x = K.x; dec.y = K.y;
        if (dec.t <= 0) b.decoy = null;
      } else {
        var tx = p.x - (this.dir === 'left' ? -14 : 14), ty = p.y + 2, dx = tx - K.x, dy = ty - K.y, d = Math.hypot(dx, dy);
        if (d > 200) { K.x = tx; K.y = ty; }
        else if (d > 4) { var v = Math.min(d * 3, 110) * dt; K.x += dx / d * v; K.y += dy / d * v; }
      }
      K.spr.setPosition(Math.round(K.x), Math.round(K.y)).setDepth(K.y);
      var mv = Math.abs(K.spr.x - (K.lx || K.x)) + Math.abs(K.spr.y - (K.ly || K.y)) > 0.3;
      if (mv && !K.spr.anims.isPlaying) K.spr.play('kancil20_walk'); else if (!mv && K.spr.anims.isPlaying) { K.spr.stop(); K.spr.setTexture('kancil20_0'); }
      if (Math.abs(K.x - (K.lx || K.x)) > 0.2) K.spr.setFlipX(K.x < (K.lx || K.x));
      K.lx = K.spr.x; K.ly = K.spr.y;
      // he finds things as you walk about
      if (this.moving && !this.hasEnemies()) {
        b.kFindT += dt;
        if (b.kFindT >= C.kancil.findEvery) {
          b.kFindT = 0;
          var l = pick(C.kancilLoot), name;
          if (l[0] === 'kepeng') { S.kepeng += l[1]; name = l[1] + ' kepeng'; }
          else if (LC.ITEMS[l[0]] && LC.State.add(l[0], l[1])) name = l[1] + ' ' + LC.ITEMS[l[0]].name;
          if (name) { LC.Audio.sfx('coin'); this.fx.sparkle.explode(6, K.x, K.y - 6); this.toast(pick(X.kancilFind).replace('{item}', name), 'kancil20_0'); }
        }
      }
      // and when you are badly hurt in a fight, he draws them off
      if (!dec && S.hp < S.maxHp * 0.5 && S.hp > 0 && this.hasEnemies() && Date.now() > (LC.c20decoyAt || 0)) {
        var near = (this.enemies || []).filter(function (e) { return !e.dead && !e.away && !e.def.boss && Math.hypot(e.spr.x - p.x, e.spr.y - p.y) < 140; });
        if (near.length) {
          LC.c20decoyAt = Date.now() + C.kancil.decoyCd * 1000;
          var ang = Math.random() * Math.PI * 2;
          b.decoy = { t: C.kancil.decoyDur, tx: K.x + Math.cos(ang) * 90, ty: K.y + Math.sin(ang) * 60, x: K.x, y: K.y };
          near.forEach(function (e) { e.decoyT = C.kancil.decoyDur; self.ui.floatText(e.spr.x, e.spr.y - e.spr.height - 2, '?!', '#ffe8a0'); });
          LC.Audio.sfx('kancil20');
          this.toast(X.decoy, 'kancil20_0');
        }
      }
    },
    // ---- Pelita Putih heals you; Harimau Cahaya
    updatePelitaPutih: function (dt) {
      var S = this.S, p = this.player;
      if (!LC.c20Putih() || this.sleeping || this.leaving) return;
      if (S.hp > 0 && S.hp < S.maxHp * C.heal.below && Date.now() > (LC.c20healAt || 0)) {
        LC.c20healAt = Date.now() + C.heal.cd * 1000;
        var n = Math.round(S.maxHp * C.heal.amount);
        S.hp = Math.min(S.maxHp, S.hp + n);
        this.lowHpWarned = false;
        LC.Audio.sfx('chime');
        var g = this.add.image(p.x, p.y - 10, 'glow').setBlendMode(ADD()).setDepth(9600).setTint(0xfff6e0).setScale(0.3);
        this.tweens.add({ targets: g, scale: 2.2, alpha: 0, duration: 900, onComplete: function () { g.destroy(); } });
        this.fx.sparkle.explode(14, p.x, p.y - 10);
        this.ui.floatText(p.x, p.y - 26, '+' + n, '#fff6c0');
        this.toast(X.heal.replace('{n}', n), 'ghost_6_happy');
      }
    },
    tigerKey: function () {
      var S = this.S, q = S.quests, b = this.c20b;
      if (!LC.c20Putih() || !b || this.sleeping || this.leaving || this.cutscene || (this.ui && this.ui.isBlocking())) return;
      if (b.tiger) return;
      if (q.c20tigerDay === S.day) { this.toast(X.tigerRest, 'ic_harimau20'); LC.Audio.sfx('error'); return; }
      if (!this.hasEnemies()) { this.toast(X.tigerNone, 'ic_harimau20'); LC.Audio.sfx('error'); return; }
      q.c20tigerDay = S.day; LC.State.save();
      var gx = this.ghost ? this.ghost.x : this.player.x, gy = this.ghost ? this.ghost.y + 16 : this.player.y;
      var spr = this.add.sprite(gx, gy, 'harimau20_0').setOrigin(0.5, 1).setDepth(gy);
      spr.play('harimau20_walk');
      var glow = this.add.image(gx, gy - 8, 'glow').setBlendMode(ADD()).setDepth(9001).setTint(0xffe8a0).setScale(1.2).setAlpha(0.5);
      b.tiger = { spr: spr, glow: glow, t: C.tiger.dur, hitT: 0.3 };
      this.cameras.main.flash(300, 255, 240, 200);
      LC.Audio.sfx('roar11'); LC.Audio.sfx('chime');
      this.ui.floatText(gx, gy - 30, X.tigerCall, '#fff0b0');
      this.shockwave(gx, gy - 8, 60, 0xffe8a0);
    },
    updateTiger: function (dt) {
      var self = this, b = this.c20b, Tg = b.tiger, S = this.S, p = this.player;
      if (!Tg) return;
      Tg.t -= dt;
      var foe = null, bd = 260;
      (this.enemies || []).forEach(function (e) { if (!e.dead && !e.away && e.spr.visible) { var d = Math.hypot(e.spr.x - Tg.spr.x, e.spr.y - Tg.spr.y); if (d < bd) { bd = d; foe = e; } } });
      var tx = foe ? foe.spr.x : p.x + 18, ty = foe ? foe.spr.y : p.y, dx = tx - Tg.spr.x, dy = ty - Tg.spr.y, d = Math.hypot(dx, dy) || 1;
      if (d > (foe ? 14 : 10)) { var v = Math.min(d * 4, foe ? 150 : 110) * dt; Tg.spr.x += dx / d * v; Tg.spr.y += dy / d * v; Tg.spr.setFlipX(dx < 0); }
      Tg.spr.setDepth(Tg.spr.y); Tg.glow.setPosition(Tg.spr.x, Tg.spr.y - 8);
      Tg.hitT -= dt;
      if (foe && d < 22 && Tg.hitT <= 0) {
        Tg.hitT = C.tiger.hit;
        var best = null; S.inv.forEach(function (sl) { var it = sl && LC.ITEMS[sl.id]; if (it && it.kind === 'weapon' && (!best || it.dmg > best.dmg)) best = it; });
        var n = Math.max(8, Math.round((best ? LC.State.weaponDamage(best) : 4) * 1.5));
        foe.hp -= n; foe.hurtT = 0.1; foe.spr.setTintFill(0xffffff);
        if (!foe.def.boss) { foe.kx = dx / d * 160; foe.ky = dy / d * 160; }
        this.fx.sparkle.explode(8, foe.spr.x, foe.spr.y - 8);
        this.ui.floatText(foe.spr.x, foe.spr.y - foe.spr.height - 2, String(n), '#fff0b0');
        this.tweens.add({ targets: Tg.spr, x: Tg.spr.x + dx / d * 8, y: Tg.spr.y + dy / d * 4, duration: 80, yoyo: true });
        LC.Audio.sfx('hit');
        if (foe.hp <= 0) this.enemyDie(foe);
      }
      if (Tg.t <= 0) {
        this.fx.sparkle.explode(16, Tg.spr.x, Tg.spr.y - 8);
        Tg.spr.destroy(); Tg.glow.destroy(); b.tiger = null;
        this.toast(X.tigerGone, 'ghost_6_happy');
      }
      void self;
    },

    // ================================================================ every frame
    updateBuaya2: function (time, dt) {
      var self = this, b = this.c20b, c = this.c20, S = this.S, q = S.quests, s = step(this);
      if (!b || !this.player) return;
      if (b.kancil) this.updateKancilFollow(dt);
      if (b.tiger) this.updateTiger(dt);
      this.updatePelitaPutih(dt);
      if (!C.ready(S)) return;
      var ui = this.ui.isBlocking(), blocked = ui || this.leaving || this.sleeping || this.cutscene;
      if (b.anak && this.area !== 'farm') this.updateAnakFollow(dt);
      if (this.area === 'sarang20' && s === 15 && b.heart && !ui) this.updateHeart(time, dt);
      if (this.area === 'sarang20' && b.fleet) b.fleet.forEach(function (f, i) { f.im.y = f.y0 + Math.sin(time / 600 + i); });
      if (this.area === 'sarang20' && s === 13 && b.fightOn && !blocked) this.updateFight20(time, dt);
      if (this.area === 'dalam20' && !blocked) this.updateInside(time, dt);
      if (this.area === 'barunai' && s === 18 && b.feast && (b.gongT -= dt) <= 0) { b.gongT = 4 + Math.random() * 3; LC.Audio.sfx(this.textures.exists('vinta11_t0') ? 'gongbeat11' : 'chime'); }
      // what follows a dialogue (here, so closing it early never skips it)
      if (ui || this.leaving || this.sleeping) return;
      if (b.cine && this.area === 'sarang20') { if (s === 17 || b.cine.phase === 'go' || b.cine.phase === 'silence') this.buayaLetGoCine(dt); else this.buayaCine2(dt); return; }
      if (c && c.sea && c.sea.sisikPending) { this.buayaSisik(); return; }
      if (c && c.sea && c.sea.chaseStart) {
        c.sea.chaseStart = false;
        var sh = c.sea.sh;
        c.sea.chase = { t: 10, crocs: [0, 1, 2, 3].map(function (i) { var x = sh.x - 80 - i * 20, y = sh.y + (i - 1.5) * 26; return { x: x, y: y, cd: 0, img: self.add.image(x, y, 'buayaK20t_0').setDepth(9002) }; }) };
        return;
      }
      if (b.nestPending) { b.nestPending = false; this.buayaGo('sarang20', C.nest.spawn, 18 * 60 + 20); return; }
      if (b.sailPending) { b.sailPending = false; if (step(this) === 9) this.sailTo('laut20b'); return; }
      if (b.bellPending) { b.bellPending = false; this.buayaFleet(); b.fightOn = true; this.refreshWhen(); this.toast(X.fightHow, 'kelam_0'); return; }
      if (b.ridePending) { b.ridePending = false; this.buayaRideStart(); return; }
      if (b.trickPending) { b.trickPending = false; this.buayaTrickStart(); return; }
      if (b.shrinkPending) { this.buayaShrink(); return; }
      if (b.letGoPending) { this.buayaLetGo(); return; }
      if (b.feastPending) { b.feastPending = false; this.buayaGo('barunai', { x: 24, y: 17 }, 19 * 60 + 30); return; }
      if (b.photoPending) { this.buayaPhoto(); return; }
      if (b.epiPending) { b.epiPending = false; this.cameras.main.startFollow(this.player, true, 0.2, 0.2); return; }
      if (c && c.sea && c.sea.kind === 'sabah' && c.sea.netAsked && !c.sea.netDone && !c.sea.netOpen && !c.sea.netWait && this.area === 'laut20b' && c.sea.sh.x / T > C.sabah.net) { this.buayaNetOpen(); return; }
      if ((b.tick -= dt) > 0) return;
      b.tick = 0.5;
      // the monsoon wind turns
      if (s === 8 && S.day >= (q.c20satDay || 0) + C.windDays && S.minutes >= 7 * 60 && (this.area === 'farm' || this.area === 'barunai' || this.area === 'kampung')) { this.buayaWind(); return; }
      // the epilogue, the morning after the credits
      if (s >= C.end && this.area === 'farm' && q.c20tamat && !q.c20epi && S.day > q.c20tamat) { this.buayaEpilogue(); return; }
      if (s === 18 && this.area === 'barunai' && !b.feast) { this.buayaFeastSetup(); return; }
    }
  });
})(window.LC);
