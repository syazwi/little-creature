/* World: whichever place you are in (the farm, the kampung, the forest...), the player, Pelita, crops, critters,
 * day/night lighting and all interactions. Travelling restarts this scene with { area, spawn }; the UI scene keeps running.
 * Villagers, folk spirits, fishing, building and krathong live in WorldLife.js (mixed into this class). */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var T = 16;
  var DIRV = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] };
  var SKY = [[360, 0x6c74b4], [450, 0xffffff], [1020, 0xffffff], [1090, 0xffc89a], [1150, 0x8a7ab8], [1230, 0x4a5294], [1440, 0x343c7a]];
  function lerpColor(a, b, t) {
    var ar = a >> 16 & 255, ag = a >> 8 & 255, ab = a & 255, br = b >> 16 & 255, bg = b >> 8 & 255, bb = b & 255;
    return (Math.round(ar + (br - ar) * t) << 16) | (Math.round(ag + (bg - ag) * t) << 8) | Math.round(ab + (bb - ab) * t);
  }
  function mulColor(a, b) {
    return (Math.round((a >> 16 & 255) * (b >> 16 & 255) / 255) << 16) | (Math.round((a >> 8 & 255) * (b >> 8 & 255) / 255) << 8) | Math.round((a & 255) * (b & 255) / 255);
  }
  function rint(n) { return Math.floor(Math.random() * n); }
  var clamp = function (v) { return Math.max(0, Math.min(100, v)); };

  // wandering animals. near: how close they let you get; r: how close you must be to pet them
  var CRIT = {
    chicken: { idle: 'chicken_peck', walk: 'chicken_walk', speed: 16, w: 4, near: 8, r: 10, sfx: 'cluck', hop: true },
    kerbau: { walk: 'kerbau_walk', speed: 7, w: 10, near: 14, r: 16, sfx: 'moo' },
    kancil: { walk: 'kancil_walk', speed: 24, w: 6, near: 18, r: 12, sfx: 'pet', hop: true },
    ketam: { walk: 'ketam_walk', speed: 12, w: 4, near: 6, r: 9, sfx: 'click', hop: true },
    penyu: { walk: 'penyu_walk', speed: 3, w: 8, near: 12, r: 14, sfx: 'pet' },
    biawak: { walk: 'biawak_walk', speed: 9, w: 10, near: 12, r: 14, sfx: 'pet' },
    ikan_kecil: { walk: 'ikan_kecil_swim', speed: 22, w: 4, near: 16, r: 11, sfx: 'pet', hop: true },
    ubur: { walk: 'ubur_swim', speed: 5, w: 3, near: 8, r: 9, sfx: 'pet' }
  };
  var TILE_PATHY = { p: 1, f: 1, F: 1, b: 1, j: 1, k: 1, v: 1 };
  var RIDE_ITEM = { bike: 'basikal', naga: 'seruling_naga' };   // (v2.6: Naga Kecil; v2.7.4: no car)

  LC.WorldScene = class extends Phaser.Scene {
    constructor() { super('World'); }

    create(data) {
      data = data || {};
      var S = this.S = LC.State.s;
      var area = data.area && LC.AREAS[data.area] ? data.area : S.area === 'bunian' ? 'bunian' : 'farm';
      this.area = area; this.A = LC.AREAS[area];
      S.area = area; S.visited[area] = true;
      LC.syncLadang();   // v1.7: has Badang cleared the land south of the field?
      LC.syncDesert();   // v1.8: is the brick path to the old tower restored?
      LC.syncBarunai();  // v1.9: has Barunai been founded (its walkways over the river)?
      if (LC.syncLedang) LC.syncLedang();   // v2.4: has the bridge of gold and silver been built on Gunung Ledang?
      this.areaLayout = this.A.layout ? this.A.layout(S) : null;
      this.grid = this.areaLayout ? this.areaLayout.grid : LC.areaGrid(area);
      this.H = this.grid.length; this.W = this.grid[0].length;
      this.objects = this.areaLayout ? this.areaLayout.objects : LC.areaObjects(area);
      this.solid = []; this.objAt = [];
      for (var y = 0; y < this.H; y++) { this.solid.push(new Array(this.W).fill(false)); this.objAt.push(new Array(this.W).fill(null)); }
      this.sleeping = !!data.summary; this.leaving = false;
      this.emote = 'normal'; this.emoteUntil = 0; this.curExpr = 'normal';
      this.cropSprites = {}; this.offeringSprites = [];
      this.spiritPos = null; this.dapurPos = null; this.warungPos = null; this.houseImg = null; this.ani = null;
      this.npcs = {};

      this.buildGround();
      this.buildObjects();
      this.buildGates();
      this.buildDecor();
      this.refreshAllTiles();
      this.createPlayer(data.spawn, data.dir);
      this.veh = this.add.image(0, 0, 'bike_side_0').setOrigin(0.5, 1).setVisible(false);
      this.mask = this.add.image(0, 0, 'mask').setOrigin(0.5, 0.5).setVisible(false);
      var parked = S.riding && !this.canRide(S.riding) ? S.riding : null;
      if (parked) S.riding = null;
      this.createGhost();
      this.createCritters();
      this.createLighting();
      this.createFx();
      this.refreshOfferings();
      this.createFolk();   // villagers, folk spirits, your companion, kites (WorldLife.js)
      this.createFarmLife();   // v1.5: animals, chests, hidden things, seasons (WorldFarm.js)
      this.createEnemies();    // v1.5: the shadows of the mine, v1.6: the wild places too (WorldCombat.js)
      this.createTanggang();   // v1.6: guiding Si Tanggang home to his mother (WorldTanggang.js)
      this.createBadang();     // v1.7: Badang at your side, the river hantu, your bubu (WorldBadang.js)
      this.createHome();       // v1.8: Nenek's house as it has grown, and the helpers (WorldHome.js)
      this.createBarunai();    // v1.9: Chapter 2 (WorldBarunai.js)
      this.createKampong();    // v2.0: Chapter 3 (WorldKampong.js)

      var cam = this.cameras.main;
      cam.setBounds(0, 0, this.W * T, this.H * T);
      cam.setZoom(3);
      cam.startFollow(this.player, true, 0.2, 0.2);
      cam.setRoundPixels(true);
      if (!data.summary) cam.fadeIn(data.area ? 400 : 700);

      this.keys = this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT');
      this.cursorImg = this.add.image(0, 0, 'cursor').setOrigin(0).setDepth(8990).setVisible(false);
      this.waterFrame = 0;
      this.time.addEvent({ delay: 450, loop: true, callback: this.animateWater, callbackScope: this });

      // the UI scene runs alongside and survives travelling between places
      if (this.scene.isActive('UI')) { this.ui = this.scene.get('UI'); this.ui.world = this; }
      else { this.scene.launch('UI'); this.ui = this.scene.get('UI'); }
      this.wasFollowing = this.S.ghost.stage >= 1 && this.S.ghost.joy >= 12;

      // co-op
      this.remote = {};
      this.followPid = LC.followPid || 'me';
      this.bindNet();
      this.events.once('shutdown', function () { LC.Net.on = {}; });
      LC.Audio.setArea(area);

      var self = this;
      if (data.summary) {
        this.time.delayedCall(60, function () {
          self.ui.showSummary(data.summary, function () { self.cameras.main.fadeIn(800); self.sleeping = false; self.morning(); });
        });
      } else if (data.area && this.ui.ready) this.ui.areaBanner(this.A.name, this.A.sub);
      if (data.knocked) this.time.delayedCall(700, function () {
        self.ui.say([{ text: 'Everything went dark... You wake up at home with a sore head. ' + (data.carried ? LC.BADANG.carried : 'Pelita must have guided you home.') }, { text: data.knocked + ' (Eat good food to heal, and come back stronger!)' }]);
      });
      if (data.loaded) this.time.delayedCall(500, function () {
        self.ui.toast(data.loaded > 0 ? 'Loaded slot ' + data.loaded + ': Day ' + S.day + ', ' + LC.State.weekday() + '.' : (data.by || 'Your friend') + ' loaded a saved farm. Day ' + S.day + '!', 'ic_bond');
      });
      if (parked) this.time.delayedCall(500, function () { self.toast('You leave the basikal by the path.', 'i_basikal'); });
    }

    tilePx(t) { return { x: (t.x + 0.5) * T, y: (t.y + 0.8) * T }; }

    // ================================================================ build
    buildGround() {
      var TI = LC.Art.TI, data = [], rnd = new Phaser.Math.RandomDataGenerator([this.area === 'farm' ? 'kampung' : this.area]), self = this;
      this.animTiles = [];
      for (var y = 0; y < this.H; y++) {
        var row = [];
        for (var x = 0; x < this.W; x++) {
          var ch = this.grid[y][x], idx = TI.G0, v;
          switch (ch) {
            case '.': v = rnd.frac(); idx = v < 0.55 ? TI.G0 : v < 0.82 ? TI.G1 : v < 0.9 ? TI.G2 : TI.G3; break;
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
            case 'g': idx = rnd.frac() < 0.75 ? TI.FG0 : TI.FG1; break;
            case 'q': idx = TI.POND0; this.animTiles.push({ x: x, y: y, k: 'pond' }); break;
            case 'o': idx = TI.SEA0; this.animTiles.push({ x: x, y: y, k: 'sea' }); break;
            case 'h': idx = TI.SHAL0; this.animTiles.push({ x: x, y: y, k: 'shallow' }); break;
            case 'm': idx = rnd.frac() < 0.8 ? TI.ROCK0 : TI.ROCK1; break;
            case 'M': idx = TI.CLIFF; break;
            case 'k': idx = TI.STONEP; break;
            case 'G': idx = TI.HGRASS; break;
            case 'd': idx = rnd.frac() < 0.7 ? TI.DUNE0 : TI.DUNE1; break;
            case 'R': idx = TI.REDROCK; break;
            case 'u': idx = rnd.frac() < 0.8 ? TI.SEAF0 : TI.SEAF1; break;
            case 'v': idx = TI.SEALANE; break;
            case 'C': idx = TI.CORAL; break;
            case 'c': idx = rnd.frac() < 0.75 ? TI.CAVE0 : TI.CAVE1; break;
            case 'X': idx = TI.CAVEW; break;
            case 'l': idx = TI.RAIL; break;
            case 'W': idx = TI.PLANK; break;
            case 'H': idx = TI.HULL; break;
            case 'n': idx = TI.JADE; break;
            case 'a': idx = TI.MARBLE; break;
            case 'A': idx = TI.MARBLE2; break;
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
        switch (a.k) {
          case 'river': a.tile.index = TI.RIV0 + ((a.x + a.y + f) % 3); break;
          case 'shore': a.tile.index = TI.SHORE0 + ((a.x + f) % 2); break;
          case 'pond': a.tile.index = TI.POND0 + ((a.x + a.y + (f >> 1)) % 2); break;
          case 'sea': a.tile.index = TI.SEA0 + ((a.x + a.y + f) % 3); break;
          case 'shallow': a.tile.index = TI.SHAL0 + ((a.x + (f >> 1)) % 2); break;
          default: a.tile.index = TI.PADDY0 + ((a.x + a.y + (f >> 1)) % 2);
        }
      });
    }

    harvestTex(o) {
      var ready = this.S.trees[o.id] === 0 && !(o.type === 'tree' && !LC.State.inSeason(LC.TREES[o.kind].season && [LC.TREES[o.kind].season]));
      return o.type === 'tree' ? o.kind + (ready ? '_f' : '') : 'fg_' + o.kind + (ready ? '' : '_e');
    }
    refreshHarvest(id) { var t = this.trees[id]; if (t) t.spr.setTexture(this.harvestTex(t.o)); }

    buildObjects() {
      var self = this, S = this.S;
      this.trees = {}; this.torches = []; this.plots = {}; this.boats = []; this.hiddenObjs = []; this.objLights = []; this.objImgs = {};
      this.warungImgs = null; this.portalImg = null;   // (v1.7 fix: these belong to one place; a level-up elsewhere must not touch the old ones)
      this.objects.forEach(function (o) {
        if (o.when && !o.when(o.shared && LC.worldS ? LC.worldS() : S)) return;   // v1.7: things that come and go (Badang's stumps, Batu Badang); v2.7.1: shared looks
        var w = o.w || 1, h = o.h || 1, bx = (o.x + w / 2) * T, by = (o.y + h) * T;
        if (o.hidden) {   // only seen through the Bunian glasses (WorldFarm.refreshHidden)
          self.hiddenObjs.push({ o: o, img: self.add.image(bx, by, o.tex).setOrigin(0.5, 1).setDepth(by).setVisible(false) });
          return;
        }
        if (o.light) self.objLights.push({ x: bx, y: by - (h * T) / 2, c: o.light });
        if (o.type === 'warung') {
          var wk = LC.State.level() >= 10 ? 'warung2_' : 'warung_';
          self.warungImgs = [self.add.image(bx, by, wk + 'back').setOrigin(0.5, 1).setDepth(by - 2)];
          self.ani = self.add.sprite(bx, by - 12, 'npc_ani_0').setOrigin(0.5, 1).setDepth(by - 1);
          self.ani.play('ani_idle');
          self.warungImgs.push(self.add.image(bx, by, wk + 'front').setOrigin(0.5, 1).setDepth(by));
          self.warungPos = { x: bx, y: by };
          for (var ry = 5; ry < o.y; ry++) for (var rx = o.x; rx < o.x + w; rx++) self.solid[ry][rx] = true;  // behind the stall
        } else if (o.type === 'tree' || o.type === 'forage') {
          var spr = self.add.image(bx, by - (o.type === 'forage' ? 1 : 0), self.harvestTex(o)).setOrigin(0.5, 1).setDepth(by);
          self.trees[o.id] = { o: o, spr: spr };
        } else if (o.type === 'torch') {
          var tr = self.add.image(bx, by, 'torch_off').setOrigin(0.5, 1).setDepth(by);
          self.torches.push({ o: o, spr: tr, x: bx, y: by - 28 });
        } else if (o.type === 'plot') {
          self.plots[o.id] = { o: o, spr: self.add.image(bx, by + 2, 'plot').setOrigin(0.5, 1).setDepth(by) };
        } else if (o.type === 'dive') {
          var ring = self.add.image(bx, by - 2, 'dive_ring').setOrigin(0.5, 1).setDepth(by - 8);
          self.tweens.add({ targets: ring, scale: 1.15, alpha: 0.7, duration: 900, yoyo: true, repeat: -1 });
        } else if (o.type === 'surface') {
          var col = self.add.image(bx, by, 'surface').setOrigin(0.5, 1).setDepth(by).setBlendMode(Phaser.BlendModes.ADD);
          self.tweens.add({ targets: col, alpha: 0.6, duration: 1400, yoyo: true, repeat: -1 });
        } else if (o.type === 'turtle') {
          self.turtleSpr = self.add.image(bx, by, S.flags.turtleFreed ? 'turtle_free' : 'turtle_net').setOrigin(0.5, 1).setDepth(by);
          if (S.flags.turtleFreed) { self.turtleSpr.setVisible(false); return; }
        } else if (o.type === 'sampan') {
          var bt = self.add.image(bx, by - 2, 'sampan').setOrigin(0.5, 1).setDepth(by - 8);
          self.boats.push({ spr: bt, y0: by - 2 });
          if (o.id) self.objImgs[o.id] = bt;   // (so a boat that appears later in the story is never drawn twice)
        } else {
          var im = self.add.image(bx, by, o.type === 'portal' && !LC.State.isOpen(o.to) ? 'lombong_tutup' : o.tex).setOrigin(0.5, 1).setDepth(by);
          if (o.id) self.objImgs[o.id] = im;
          if (o.type === 'portal') self.portalImg = im;
          if (o.type === 'spirit') self.spiritPos = { x: bx, y: by };
          if (o.type === 'dapur') self.dapurPos = { x: bx, y: by };
          if (o.type === 'house') self.houseImg = im;
        }
        for (var yy = o.y; yy < o.y + h; yy++) for (var xx = o.x; xx < o.x + w; xx++) { self.solid[yy][xx] = true; self.objAt[yy][xx] = o; }
      });
      this.refreshPlots();
      this.scatterTrees();
    }
    // a few dozen trees for a wild place, kept clear of paths, objects, spirits, villagers and entrances
    scatterTrees() {
      var Tr = this.A.trees, self = this;
      if (!Tr) return;
      var keep = {}, g = this.grid;
      function mark(x, y, r) { for (var dy = -r; dy <= r; dy++) for (var dx = -r; dx <= r; dx++) keep[(x + dx) + ',' + (y + dy)] = 1; }
      // v2.7.6: a tree is drawn up to 3 rows above its trunk, so keep 3 rows below anyone standing still clear too
      function markWho(x, y) { mark(x, y, 2); for (var dx = -2; dx <= 2; dx++) keep[(x + dx) + ',' + (y + 3)] = 1; }
      LC.SPIRIT_ORDER.forEach(function (sid) { var sp = LC.SPIRITS[sid]; if (sp.area === self.area) markWho(sp.x, sp.y); });
      LC.villagerPosts(this.area).forEach(function (p) { markWho(p.x, p.y); });
      (this.A.clear || []).forEach(function (c) { mark(c.x, c.y, c.r); });   // v1.7: e.g. where the river hantu sits
      Object.keys(LC.PLOT_POSTS).forEach(function (k) { if (self.area === 'kampung') markWho(LC.PLOT_POSTS[k].x, LC.PLOT_POSTS[k].y); });
      Object.keys(this.S.chests || {}).forEach(function (cid) { var c = self.S.chests[cid]; if (c.area === self.area) keep[c.x + ',' + c.y] = 1; });   // (never grow a tree through your chest)
      mark(Math.floor(this.A.home.x), Math.floor(this.A.home.y), 3);
      this.objects.forEach(function (o) {   // never hide a building or a house plot behind a tree
        if (o.type !== 'plot' && o.type !== 'bldg' && !o.keep) return;
        for (var y = o.y - 1; y <= o.y + (o.h || 1) + 3; y++) for (var x = o.x - 1; x <= o.x + (o.w || 1); x++) keep[x + ',' + y] = 1;
      });
      this.A.exits.forEach(function (e) { mark(e.x0, e.y0, 3); mark(e.x1, e.y1, 3); mark(Math.floor(e.sx), Math.floor(e.sy), 2); });
      var rnd = new Phaser.Math.RandomDataGenerator(['trees-' + this.area]), placed = 0, tries = 0;
      while (placed < Tr.n && tries < 3000) {
        tries++;
        var x = rnd.between(2, this.W - 3), y = rnd.between(3, this.H - 3), ok = !keep[x + ',' + y];
        for (var dy = -1; dy <= 1 && ok; dy++) for (var dx = -1; dx <= 1 && ok; dx++) {
          var c = g[y + dy][x + dx];
          if (c !== Tr.on || this.objAt[y + dy][x + dx] || this.solid[y + dy][x + dx]) ok = false;
        }
        if (!ok) continue;
        var by = (y + 1) * T, o = { type: 'bldg', x: x, y: y, text: Tr.text };
        this.add.image(x * T + 8, by, rnd.pick(Tr.tex)).setOrigin(0.5, 1).setDepth(by);
        this.solid[y][x] = true; this.objAt[y][x] = o;
        placed++;
      }
    }

    // locked exits show a gate (vines, rockfall, a sand drift...) until Pelita's level opens the way
    buildGates() {
      var self = this;
      this.gates = [];
      this.A.exits.forEach(function (e) {
        if (!e.gate || LC.State.isOpen(e.to)) return;
        var gt = e.gate, bx = (gt.x + gt.w / 2) * T, by = (gt.y + gt.h) * T, o = { type: 'gate', to: e.to };
        var g = { img: self.add.image(bx, by, gt.tex).setOrigin(0.5, 1).setDepth(by), tiles: [], to: e.to };
        for (var y = gt.y; y < gt.y + gt.h; y++) for (var x = gt.x; x < gt.x + gt.w; x++) { self.solid[y][x] = true; self.objAt[y][x] = o; g.tiles.push([x, y]); }
        self.gates.push(g);
      });
    }
    refreshGates() {
      var self = this;
      this.gates = this.gates.filter(function (g) {
        if (!LC.State.isOpen(g.to)) return true;
        self.fx.sparkle.explode(16, g.img.x, g.img.y - 10);
        self.tweens.add({ targets: g.img, alpha: 0, duration: 800, onComplete: function () { g.img.destroy(); } });
        g.tiles.forEach(function (t) { self.solid[t[1]][t[0]] = false; self.objAt[t[1]][t[0]] = null; });
        return false;
      });
    }

    buildDecor() {
      var D = this.A.decor, rnd = new Phaser.Math.RandomDataGenerator(['decor-' + (this.area === 'farm' ? 'kampung' : this.area)]);
      var placed = 0, tries = 0, g = this.grid, self = this;
      function near(x, y) {
        for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
          var c = g[y + dy] && g[y + dy][x + dx];
          if (TILE_PATHY[c]) return true;
          if (self.objAt[y + dy] && self.objAt[y + dy][x + dx]) return true;
        }
        return false;
      }
      while (placed < D.n && tries < 4000) {
        tries++;
        var x = rnd.between(1, this.W - 3), y = rnd.between(2, this.H - 3);
        if (g[y][x] !== D.on || this.solid[y][x] || near(x, y)) continue;
        if (this.area === 'farm' && (LC.inLadang(x, y) || (LC.inFieldArea && LC.inFieldArea(x, y)))) continue;   // v1.7: Badang's land may become a field (v2.7.5: and the field grows)
        if (this.area === 'farm' && x >= LC.HOUSE_ZONE.x0 && x <= LC.HOUSE_ZONE.x1 && y >= LC.HOUSE_ZONE.y0 && y <= LC.HOUSE_ZONE.y1) continue;   // v1.8: room for the house to grow
        var by = (y + 1) * T - 1;
        this.add.image(x * T + 8 + rnd.between(-3, 3), by, rnd.pick(D.types)).setOrigin(0.5, 1).setDepth(by);
        placed++;
      }
    }

    // ================================================================ tiles & crops (farm)
    refreshAllTiles() {
      var self = this;
      Object.keys(this.cropSprites).forEach(function (k) { self.cropSprites[k].destroy(); });
      this.cropSprites = {};
      if (this.area === 'farm') for (var y = 0; y < this.H; y++) for (var x = 0; x < this.W; x++) {
        var ch = this.grid[y][x];
        if (ch === 'f' || ch === 'r') this.refreshTile(x, y);
      }
      Object.keys(this.trees || {}).forEach(function (id) { self.refreshHarvest(id); });
    }

    refreshTile(x, y) {
      if (this.area !== 'farm') return;
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
    createPlayer(spawn, dir) {
      this.pc = LC.Net.role ? LC.Net.myColor : 0;   // outfit colour (co-op players each get their own)
      this.plKey = LC.Art.plKey(this.pc); this.walkKey = LC.Art.walkKey(this.pc);
      var sp = spawn || (this.area === 'farm' ? this.homeSpot(LC.Net.isGuest() ? this.pc : 0) : this.tilePx(this.A.home));
      this.player = this.add.sprite(sp.x, sp.y, this.plKey + '_down_0').setOrigin(0.5, 1);
      this.pShadow = this.add.image(this.player.x, this.player.y, 'shadow').setDepth(1);
      this.dir = dir || 'down';
      this.moving = false;
    }
    homeSpot(c) { return c ? { x: (4 + c) * T + 8, y: 10 * T + 13 } : { x: 4 * T + 8, y: 8 * T + 13 }; }

    solidPx(px, py) {
      var tx = Math.floor(px / T), ty = Math.floor(py / T);
      if (!(tx >= 0 && ty >= 0 && tx < this.W && ty < this.H)) return true;   // (also catches NaN)
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
        var ride = this.S.riding, mult = (ride ? LC.ITEMS[RIDE_ITEM[ride]].speed : this.A.underwater ? 0.8 : 1) * (this.wadeMult ? this.wadeMult() : 1) * (this.compSpeed ? this.compSpeed() : 1);   // (v2.6: wading through the flood; v2.8: the Kenyalang or Si Tanggang beside you)
        var len = Math.hypot(vx, vy), sp = (this.S.energy <= 0 && !ride ? 48 : 74) * mult * dt * analog;
        var nx = p.x + vx / len * sp, ny = p.y + vy / len * sp;
        if (!this.blockedAt(nx, p.y)) p.x = nx;
        if (!this.blockedAt(p.x, ny)) p.y = ny;
        var ax = Math.abs(vx), ay = Math.abs(vy);
        if (ax > ay * 1.25) this.dir = vx < 0 ? 'left' : 'right';
        else if (ay > ax * 1.25) this.dir = vy < 0 ? 'up' : 'down';
        else if (!((this.dir === 'left' && vx < 0) || (this.dir === 'right' && vx > 0) || (this.dir === 'up' && vy < 0) || (this.dir === 'down' && vy > 0)))
          this.dir = vx < 0 ? 'left' : 'right';
        p.play(this.walkKey + '_' + (this.dir === 'left' || this.dir === 'right' ? 'side' : this.dir), true);
        this.moving = true;
      } else {
        p.stop();
        p.setTexture(this.plKey + '_' + (this.dir === 'left' || this.dir === 'right' ? 'side' : this.dir) + '_0');
        this.moving = false;
      }
      p.setFlipX(this.dir === 'left');
      p.setDepth(p.y);
      this.pShadow.setPosition(Math.round(p.x), Math.round(p.y - 1));
      this.drawRider(p, this.S.riding, this.dir, this.moving, this.veh, this.pc);
      if (this.specs) this.specs.setVisible(LC.State.wearing('glasses') && this.dir !== 'up' && !this.A.underwater).setPosition(Math.round(p.x + (this.dir === 'left' ? -1 : this.dir === 'right' ? 1 : 0)), Math.round(p.y - 9 - (this.S.riding === 'bike' ? 5 : this.S.riding === 'naga' ? 8 : 0))).setFlipX(this.dir === 'left').setDepth(p.y + 0.3);
      if (this.A.underwater) this.mask.setVisible(this.dir !== 'up').setPosition(Math.round(p.x + (this.dir === 'left' ? -1 : this.dir === 'right' ? 1 : 0)), Math.round(p.y - 9 - (this.S.riding === 'naga' ? 8 : 0))).setFlipX(this.dir === 'left').setDepth(p.y + 0.2);
    }
    // a bicycle under the rider. Used for you and for co-op friends.
    drawRider(spr, ride, dir, moving, veh, color) {
      var side = dir === 'left' || dir === 'right', key = side ? 'side' : dir, f = moving && Math.floor(this.time.now / 140) % 2 ? 1 : 0;
      if (!ride) { if (veh.visible) { veh.setVisible(false); spr.setVisible(true).setOrigin(0.5, 1); } return; }
      spr.setVisible(true).setOrigin(0.5, 1.3);
      if (spr.anims && spr.anims.isPlaying) spr.stop();
      spr.setTexture(LC.Art.plKey(color || 0) + '_' + key + '_0');
      veh.setVisible(true).setTexture('bike_' + key + '_' + f).setPosition(Math.round(spr.x), Math.round(spr.y + 2)).setFlipX(dir === 'left').setDepth(spr.y + (dir === 'up' ? -0.5 : 0.5));
    }
    canRide(kind) { return !!(this.A.ride && this.A.ride[kind]); }
    toggleRide(kind) {
      var S = this.S;
      if (S.riding) { this.setRide(null); return; }
      if (this.sleeping || this.leaving || this.fishing) return;
      if (!kind) kind = LC.State.count('basikal') && this.canRide('bike') ? 'bike' : null;
      if (!kind) {
        var has = LC.State.count('basikal');
        this.toast(!has ? 'You have nothing to ride yet. Abang Zul sells bicycles in the kampung.' : this.A.underwater ? 'Not under the sea!' : 'You can\'t ride here.'); LC.Audio.sfx('error'); return;
      }
      if (!this.canRide(kind)) { this.toast('You can\'t ride here.'); LC.Audio.sfx('error'); return; }
      this.setRide(kind);
    }
    setRide(kind) {
      var S = this.S, was = S.riding;
      S.riding = kind || null;
      if (kind) { LC.Audio.sfx('bell'); this.fx.dirt.explode(4, this.player.x, this.player.y); }
      else if (was) LC.Audio.sfx('click');
      this.drawRider(this.player, S.riding, this.dir, false, this.veh, this.pc);
    }

    facing() {
      var d = DIRV[this.dir], px = Math.floor(this.player.x / T), py = Math.floor((this.player.y - 3) / T);
      return { tx: px + d[0], ty: py + d[1], fx: this.player.x + d[0] * 12, fy: this.player.y - 4 + d[1] * 12 };
    }

    // ================================================================ travel
    checkExits() {
      if (this.leaving || this.sleeping) return;
      var p = this.player, tx = Math.floor(p.x / T), ty = Math.floor((p.y - 3) / T), ex = this.A.exits;
      for (var i = 0; i < ex.length; i++) {
        var e = ex[i];
        if (tx < e.x0 || tx > e.x1 || ty < e.y0 || ty > e.y1) continue;
        if (!LC.State.isOpen(e.to)) {
          var d = DIRV[e.dir]; p.x -= d[0] * 10; p.y -= d[1] * 10;
          this.lockedMsg(e.to);
          return;
        }
        this.goArea(e.to, this.tilePx({ x: e.sx, y: e.sy }), e.dir);
        return;
      }
    }
    goArea(to, spawn, dir, extra) {
      if (this.leaving) return;
      var self = this;
      this.leaving = true;
      this.ui.closeModal();
      if (LC.Net.isGuest()) LC.Net.sendPos(this.player.x, this.player.y, this.dir, false, to, this.S.companion, true, this.S.riding);
      LC.followPid = this.followPid;
      this.cameras.main.fadeOut(350, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', function () {
        self.scene.restart(Object.assign({ area: to, spawn: spawn, dir: dir }, extra || {}));
      });
    }
    lockedMsg(to) {
      var A = LC.AREAS[to], now = this.time.now;
      if (now - (this.lockedAt || 0) < 1500) return;
      this.lockedAt = now;
      LC.Audio.sfx('error');
      this.ui.toast('The way to ' + A.name + ' is closed. Pelita must reach Lv ' + A.lvl + ' to light the path (now Lv ' + LC.State.level() + ').', 'ic_glow');
    }

    // ================================================================ ghost (Pelita)
    ghostHome() { return this.spiritPos ? { x: this.spiritPos.x, y: this.spiritPos.y - 25 } : this.farmGhostHome(); }
    // where Pelita rests on the farm, known even while you are somewhere else (the co-op host streams it to guests)
    farmGhostHome() {
      var o = LC.OBJECTS.filter(function (x) { return x.type === 'spirit'; })[0];
      return { x: (o.x + (o.w || 1) / 2) * T, y: (o.y + (o.h || 1)) * T - 25 };
    }
    ghostPos() { return { x: this.ghost.x, y: this.ghost.y }; }

    createGhost() {
      var h = this.spiritPos && !this.following() ? this.ghostHome() : { x: this.player.x, y: this.player.y - 18 };
      this.gpos = { x: h.x, y: h.y };
      this.ghostHere = true;
      this.ghostGlow = this.add.image(h.x, h.y, 'glow').setBlendMode(Phaser.BlendModes.ADD).setDepth(9001).setTint(0xb8a8ff);
      this.ghostShadow = this.add.image(h.x, h.y + 18, 'shadow').setDepth(2).setAlpha(0.4);
      this.ghost = this.add.image(h.x, h.y, 'ghost_0_normal').setDepth(9002);
      this.bubbleIcon = this.add.image(0, -2, 'i_nasi');
      this.bubble = this.add.container(0, 0, [this.add.image(0, 0, 'bubble'), this.bubbleIcon]).setDepth(9003).setVisible(false);
    }

    setEmote(e, ms) { this.emote = e; this.emoteUntil = this.time.now + ms; }
    following() { var g = this.S.ghost; return g.stage >= 1 && g.joy >= 12; }

    updateGhost(time, dt, blocked) {
      var S = this.S, g = S.ghost, N = LC.Net;
      var follow = this.following();
      if (this.wasFollowing && !follow && g.stage >= 1) this.ui.toast('Pelita feels neglected and sulks back to its spirit house...', 'ic_joy');
      if (!this.wasFollowing && follow && g.stage >= 1 && this.followInit) this.ui.toast('Pelita floats over to join you again!', 'ic_joy');
      this.wasFollowing = follow; this.followInit = true;
      var tx, ty, tArea, guest = N.isGuest(), net = this.netGhost;
      if (guest && net) { tx = net.x; ty = net.y; tArea = net.a || 'farm'; }   // the host decides where Pelita is
      else if (follow) {
        // Pelita follows whoever cared for it last (you, or a co-op friend), even into another place
        var ro = this.followPid !== 'me' && N.others[this.followPid], r = ro && this.remote[this.followPid];
        var tp = this.player, tdir = this.dir;
        tArea = this.area;
        if (ro) { tArea = ro.ar || 'farm'; tp = r ? r.spr : ro; tdir = ro.dir || 'down'; } else this.followPid = 'me';
        var d = DIRV[tdir] || DIRV.down;
        tx = tp.x - d[0] * 14 + (d[1] !== 0 ? 11 : 0);
        ty = tp.y - 18 - d[1] * 8;
      } else { tArea = 'farm'; var hm = this.ghostHome(); tx = hm.x; ty = hm.y; }
      this.ghostArea = tArea;
      var here = this.ghostHere = tArea === this.area;
      this.ghost.setVisible(here); this.ghostGlow.setVisible(here); this.ghostShadow.setVisible(here);
      if (!here) { this.gpos.x = tx; this.gpos.y = ty; this.bubble.setVisible(false); this.ghostNear = false; this.curExpr = 'normal'; return; }
      var k = Math.min(1, dt * (guest ? 8 : 2.4));
      this.gpos.x += (tx - this.gpos.x) * k; this.gpos.y += (ty - this.gpos.y) * k;
      var bob = Math.sin(time / 380) * 2;
      var gx = Math.round(this.gpos.x), gy = Math.round(this.gpos.y + bob);
      this.ghost.setPosition(gx, gy);
      if (Math.abs(tx - this.gpos.x) > 1.5) this.ghost.setFlipX(tx < this.gpos.x);

      var expr = 'normal';
      if (time < this.emoteUntil) expr = this.emote;
      else if (guest && net && net.e) expr = net.e;
      else if (g.full < 25 || g.joy < 20) expr = 'sad';
      else if (S.minutes >= 22 * 60) expr = 'sleepy';
      else if (g.joy >= 70) expr = 'happy';
      this.curExpr = expr;
      this.ghost.setTexture(LC.ghostTex(g.stage, expr));   // (v2.3: Pelita Purnama)
      var n = this.nightF || 0;
      this.ghost.setAlpha(0.78 + 0.22 * n);
      var legend = (g.level || 1) >= LC.LEGEND_LEVEL;
      this.ghostGlow.setPosition(gx, gy).setScale(0.45 + g.glow / 100 * 0.55 + g.stage * 0.08 + (legend ? 0.25 : 0)).setAlpha((0.18 + 0.55 * n) * (0.4 + g.glow / 160) + (legend ? 0.15 : 0));
      if (g.stage === 4) this.ghostGlow.setTint(0xffe08a);
      this.ghostShadow.setPosition(gx, Math.round(this.gpos.y + 19)).setAlpha(0.25 - 0.1 * n);

      var showBubble = !blocked && g.stage >= 1 && !g.cravingDone && (time % 10000) < 3400;
      this.bubble.setVisible(showBubble);
      if (showBubble) { this.bubble.setPosition(gx + 11, gy - 19); this.bubbleIcon.setTexture('i_' + g.craving); }

      var dx = gx - this.player.x, dy = gy - (this.player.y - 8);
      this.ghostNear = (guest ? g.stage >= 1 : follow) && Math.hypot(dx, dy) < 26;
    }

    // ================================================================ co-op: other players
    updateRemote(dt) {
      var others = LC.Net.others, self = this;
      Object.keys(others).forEach(function (id) {
        var o = others[id], r = self.remote[id];
        if ((o.ar || 'farm') !== self.area) { if (r) self.dropRemote(id); return; }   // they are somewhere else
        if (!r) {
          r = self.remote[id] = {
            spr: self.add.sprite(o.x, o.y, LC.Art.plKey(o.color) + '_down_0').setOrigin(0.5, 1),
            sh: self.add.image(o.x, o.y, 'shadow').setDepth(1)
          };
          self.fx.sparkle.explode(8, o.x, o.y - 8);
        }
        var s = r.spr, k = Math.min(1, dt * 12);
        if (Math.hypot(o.x - s.x, o.y - s.y) > 80) { s.x = o.x; s.y = o.y; }
        else { s.x += (o.x - s.x) * k; s.y += (o.y - s.y) * k; }
        var side = o.dir === 'left' || o.dir === 'right', key = side ? 'side' : (o.dir || 'down');
        if (o.mv) s.play(LC.Art.walkKey(o.color) + '_' + key, true);
        else { s.stop(); s.setTexture(LC.Art.plKey(o.color) + '_' + key + '_0'); }
        s.setFlipX(o.dir === 'left').setDepth(s.y);
        r.sh.setPosition(Math.round(s.x), Math.round(s.y - 1));
        r.name = o.name; r.color = o.color;
        if (o.rd && !r.veh) r.veh = self.add.image(s.x, s.y, 'bike_side_0').setOrigin(0.5, 1).setVisible(false);
        if (r.veh) self.drawRider(s, o.rd, o.dir || 'down', o.mv, r.veh, o.color);
        self.updateRemoteCompanion(id, r, o, dt);
      });
      Object.keys(this.remote).forEach(function (id) { if (!others[id]) self.dropRemote(id); });
    }
    dropRemote(id) {
      var r = this.remote[id];
      if (!r) return;
      r.spr.destroy(); r.sh.destroy(); if (r.comp) r.comp.destroy(); if (r.veh) r.veh.destroy();
      delete this.remote[id];
    }

    bindNet() {
      var self = this, N = LC.Net, S = this.S;
      N.on = {};
      N.on.toast = function (msg, icon) { self.ui.toast(msg, icon); };
      N.on.gift = function (m) { return self.receiveGift(m); };   // v2.4.3
      if (N.isHost()) {
        N.on.op = function (op, a, pid) { return self.applyOp(op, a, pid); };
        N.on.spawn = function (c) { return self.homeSpot(c); };
      }
      if (N.isGuest()) {
        N.on.tick = function (m) {
          self.netGhost = m.g;
          Object.keys(m.gs).forEach(function (k) { S.ghost[k] = m.gs[k]; });
          if (!self.A.frozenClock) {
            if (Math.abs(S.minutes - m.m) > 2) S.minutes = m.m;
            S.day = m.d;
          }
        };
        N.on.sync = function (m) {
          var parts = m.parts || {};
          if (parts.tiles) Object.keys(parts.tiles).forEach(function (key) {
            if (parts.tiles[key]) S.tiles[key] = parts.tiles[key]; else delete S.tiles[key];
            var xy = key.split(','); self.refreshTile(+xy[0], +xy[1]);
          });
          if (parts.trees) Object.keys(parts.trees).forEach(function (id) { S.trees[id] = parts.trees[id]; self.refreshHarvest(id); });
          if (parts.ghost) Object.keys(parts.ghost).forEach(function (k) { S.ghost[k] = parts.ghost[k]; });
          if (parts.offerings) { S.offerings = parts.offerings; self.refreshOfferings(); }
          if (parts.buildings) { S.buildings = parts.buildings; self.refreshPlots(); }
          if (parts.ladang !== undefined) S.ladang = parts.ladang;   // v1.7: Badang will clear the land tonight
          if (parts.house !== undefined) { S.house = parts.house; S.houseBuild = parts.houseBuild || 0; LC.State.recalc(); self.refreshHouse(); }   // v1.8
          if (parts.helpers) { S.helpers = parts.helpers; self.refreshHelpers(); }
          if (parts.spirits) { S.spirits = parts.spirits; LC.State.recalc(); self.refreshFolkSpirits(); }
          if (parts.chests) { S.chests = parts.chests; S.chestSeq = parts.chestSeq || S.chestSeq; self.refreshChests(); }
          if (parts.animals) { S.animals = parts.animals; S.animalSeq = parts.animalSeq || S.animalSeq; S.coop = parts.coop || S.coop; S.nest = parts.nest || S.nest; self.refreshAnimals(); }
          if (self.ui.modal && self.ui.modal.render && (parts.chests || parts.animals)) self.ui.modal.render();
          if (m.by !== N.myId) self.remoteFx(m.op, m.a || {});
        };
        N.on.event = function (m) { if (m.ev === 'level') self.levelUp(m.lv); };
        N.on.sleepStart = function (m) { self.guestSleep(m); };
        N.on.dayStart = function (m) { self.guestDayStart(m); };
        // v1.6: the host loaded a saved farm: everyone goes to it (guests keep their own bags)
        N.on.reload = function (m) {
          LC.State.applySnapshot(m.world);
          if (LC.BunianTrials.restore(S)) { LC.State.recalc(); S.hp = S.maxHp; }
          LC.State.save();
          self.ui.closeModal(); self.leaving = true;
          self.cameras.main.fadeOut(400, 0, 0, 0);
          self.cameras.main.once('camerafadeoutcomplete', function () { self.scene.restart({ area: 'farm', loaded: -1, by: m.by }); });
        };
        N.on.saved = function (m) { if (LC.State.save()) self.ui.toast((m.by || 'Your friend') + ' saved the farm. Your bag is saved too.', 'ic_bond'); };
        N.on.closed = function (why) {
          LC.State.save();
          self.ui.say([{ text: why + ' You keep everything in your bag.' }], { onDone: function () { self.ui.quitToTitle(); } });
        };
      }
    }

    // ================================================================ v2.4.3: give a friend something from your bag
    // friends in this place within reach (px), nearest first: [{id, name, x, y}]
    friendsNear(reach) {
      var N = LC.Net, p = this.player, self = this, out = [];
      if (!N.role || !p) return out;
      Object.keys(N.others).forEach(function (id) {
        var o = N.others[id], d = Math.hypot(o.x - p.x, o.y - p.y);
        if ((o.ar || 'farm') === self.area && d <= reach) out.push({ id: id, name: o.name || 'Friend', x: o.x, y: o.y, d: d });
      });
      return out.sort(function (a, b) { return a.d - b.d; });
    }
    // the gift flies from one player to the other
    flyGift(x0, y0, x1, y1, icon) {
      var img = this.add.image(x0, y0 - 16, icon).setDepth(9600).setScale(0.8);
      this.tweens.add({ targets: img, x: x1, duration: 520, ease: 'Sine.easeInOut' });
      this.tweens.add({ targets: img, y: { from: y0 - 16, to: y1 - 16 }, duration: 520, ease: 'Sine.easeInOut' });
      this.tweens.add({ targets: img, scale: 1.3, duration: 260, yoyo: true, ease: 'Sine.easeOut' });
      this.time.delayedCall(540, function () { img.destroy(); });
    }
    // how many of an item still fit in my bag
    bagRoom(id) {
      return this.S.inv.reduce(function (a, sl) { return a + (!sl ? 99 : sl.id === id ? Math.max(0, 99 - sl.n) : 0); }, 0);
    }
    giveItem(f, idx, id, k) {
      var S = this.S, sl = S.inv[idx], it = LC.ITEMS[id], self = this, p = this.player;
      if (!sl || sl.id !== id || !it) return;
      k = Math.min(k, sl.n); sl.n -= k; if (sl.n <= 0) S.inv[idx] = null;
      LC.emit('inv');
      var what = (k > 1 ? k + ' ' : '') + it.name;
      this.flyGift(p.x, p.y, f.x, f.y, it.icon);
      LC.Audio.sfx('toss');
      function back(n) {   // what they could not take comes back
        if (n <= 0) return 0;
        var fit = Math.min(n, self.bagRoom(id));
        if (fit > 0) LC.State.add(id, fit);
        return n - fit;
      }
      LC.Net.give(f.id, id, k, function (took) {
        if (!self.sys || !self.sys.isActive()) { if (took === null) LC.State.add(id, k); else if (took < k) LC.State.add(id, k - took); return; }
        var lost;
        if (took === null) { lost = back(k); self.toast(f.name + ' did not get your ' + it.name + ' (the connection is slow), so it came back to you.' + (lost ? ' (Your bag was full: ' + lost + ' fell out.)' : ''), it.icon); return; }
        lost = back(k - took);
        if (took >= k) { self.toast('You gave ' + f.name + ' ' + what + '.', it.icon); LC.Audio.sfx('coin'); }
        else if (took > 0) self.toast(f.name + '\'s bag was nearly full: they took ' + took + ', and ' + (k - took) + ' came back to you.', it.icon);
        else self.toast(f.name + '\'s bag is full, so your ' + it.name + ' came back to you.', it.icon);
        if (lost) self.toast('Your own bag was full too: ' + lost + ' ' + it.name + ' fell out.', it.icon);
      });
    }
    // a friend gave me something: keep what fits, and answer how many
    receiveGift(m) {
      var it = LC.ITEMS[m.id], n = Math.floor(+m.n) || 0, p = this.player, from = LC.Net.others[m.from];
      if (!it || n < 1 || n > 999) return 0;
      var took = Math.min(n, this.bagRoom(m.id)), who = m.fromName || 'Your friend';
      if (took > 0) LC.State.add(m.id, took);
      if (!this.sys || !this.sys.isActive() || !p) return took;
      if (from && (from.ar || 'farm') === this.area) this.flyGift(from.x, from.y, p.x, p.y, it.icon);
      if (took > 0) {
        this.time.delayedCall(500, function () { if (this.fx && this.player) this.fx.heart.explode(4, this.player.x, this.player.y - 12); }, null, this);
        LC.Audio.sfx('chime');
        this.toast(who + ' gave you ' + (took > 1 ? took + ' ' : '') + it.name + '!' + (took < n ? ' (Your bag is full: the other ' + (n - took) + ' went back.)' : ''), it.icon);
      } else this.toast(who + ' tried to give you ' + it.name + ', but your bag is full.', it.icon);
      return took;
    }

    // Shared-world actions: run here (single-player / host) or ask the host (guest). cb gets the LC.Sim result.
    doShared(op, a, cb) {
      var self = this;
      if (LC.Net.isGuest()) { LC.Net.request(op, a, function (res) { if (self.sys && self.sys.isActive()) cb(res); }); return; }
      cb(this.applyOp(op, a, 'me'));
    }
    applyOp(op, a, pid) {
      var S = this.S, res = LC.Sim[op] ? LC.Sim[op](a) : null, ok = LC.Sim.succeeded(res);
      if (op === 'till' || op === 'water' || op === 'plant' || op === 'harvest' || op === 'fertilize') this.refreshTile(a.x, a.y);
      else if (op.indexOf('chest_') === 0) this.refreshChests();
      else if (op.indexOf('animal') === 0 || op.indexOf('coop_') === 0 || op === 'nest_add') this.refreshAnimals();
      else if (op === 'shake') this.refreshHarvest(a.id);
      else if (op === 'offer') this.refreshOfferings();
      else if (op === 'build') this.refreshPlots();
      else if (op === 'befriend') this.refreshFolkSpirits();
      else if (op === 'house_up') { this.refreshHouse(); this.refreshChests(); }
      else if (op === 'hire' || op === 'fire') this.refreshHelpers();
      if (ok && (op === 'feed' || op === 'pet')) this.followPid = pid;
      if (ok && pid !== 'me') {
        this.remoteFx(op, a);
        if (op === 'feed' || op === 'pet' || op === 'offer') this.setEmote(res.joy < 0 ? 'sad' : 'happy', 2200);
      }
      if (ok && LC.Net.isHost()) {
        var by = pid === 'me' ? 'host' : pid;
        LC.Net.broadcast({ t: 'sync', op: op, a: a, by: by, parts: LC.Sim.part(op, a) });
        var who = pid === 'me' ? LC.Net.myName : (LC.Net.guests[pid] || {}).name || 'A friend', msg = null, icon = null;
        if (op === 'feed') { msg = who + ' fed Pelita ' + LC.ITEMS[a.item].name + (res.craving ? ' (its craving!)' : '') + '.'; icon = LC.ITEMS[a.item].icon; }
        if (op === 'offer') { msg = who + ' placed ' + LC.ITEMS[a.item].name + ' at the spirit house.'; icon = LC.ITEMS[a.item].icon; }
        if (op === 'build') { msg = who + ' started a ' + LC.HOUSES[a.style].name + ' in the kampung. It will be ready tomorrow!'; icon = 'i_kayu'; }
        if (op === 'befriend') { msg = who + ' befriended the ' + LC.SPIRITS[a.sid].name + '!'; icon = 'ic_glow'; }
        if (msg) {
          LC.Net.broadcast({ t: 'toast', msg: msg, icon: icon }, pid === 'me' ? null : pid);
          if (pid !== 'me') this.ui.toast(msg, icon);
        }
      }
      return res;
    }
    remoteFx(op, a) {
      var gp = this.ghostPos(), t;
      switch (op) {
        case 'till': if (this.area === 'farm') this.fx.dirt.explode(7, a.x * T + 8, a.y * T + 10); break;
        case 'water': if (this.area === 'farm') this.fx.drop.explode(9, a.x * T + 8, a.y * T + 6); break;
        case 'plant': if (this.area === 'farm') this.fx.leaf.explode(3, a.x * T + 8, a.y * T + 10); break;
        case 'harvest': if (this.area === 'farm') this.fx.leaf.explode(8, a.x * T + 8, a.y * T + 8); break;
        case 'shake': t = this.trees[a.id]; if (t) { this.fx.leaf.explode(10, t.spr.x, t.spr.y - t.spr.height * 0.6); this.tweens.add({ targets: t.spr, x: t.spr.x + 1, duration: 50, yoyo: true, repeat: 3 }); } break;
        case 'feed': case 'pet': if (this.ghostHere) this.fx.heart.explode(4, gp.x, gp.y - 8); break;
        case 'offer': if (this.spiritPos) this.fx.sparkle.explode(10, this.spiritPos.x, this.spiritPos.y - 26); break;
        case 'build': t = this.plots[a.plot]; if (t) this.fx.smoke.explode(10, t.spr.x, t.spr.y - 20); break;
        case 'fertilize': if (this.area === 'farm') this.fx.sparkle.explode(6, a.x * T + 8, a.y * T + 8); break;
      }
    }

    // ================================================================ critters
    createCritters() {
      var self = this;
      this.critters = [];
      (this.A.critters || []).forEach(function (c) {
        for (var i = 0; i < c.n; i++) {
          var p = self.randomFree(c.zone);
          var s = self.add.sprite(p.x, p.y, c.kind + '_0').setOrigin(0.5, 1);
          self.critters.push({ kind: c.kind, def: CRIT[c.kind], spr: s, zone: c.zone, tx: p.x, ty: p.y, wait: Math.random() * 2, anim: '' });
        }
      });
    }
    randomFree(z) {
      for (var i = 0; i < 80; i++) {
        var x = (z.x0 + Math.random() * (z.x1 - z.x0 + 1)) * T, y = (z.y0 + Math.random() * (z.y1 - z.y0 + 1)) * T;
        if (!this.solidPx(x, y - 2) && !this.solidPx(x - 6, y - 2) && !this.solidPx(x + 6, y - 2)) return { x: x, y: y };
      }
      return { x: (z.x0 + 1) * T, y: (z.y0 + 1) * T };
    }
    updateCritters(dt) {
      var self = this;
      this.critters.forEach(function (c) {
        var s = c.spr, D = c.def;
        if (c.wait > 0) {
          c.wait -= dt;
          if (D.idle && c.anim !== D.idle) { s.play(D.idle); c.anim = D.idle; }
          if (!D.idle && c.anim !== 'stand') { s.stop(); s.setTexture(c.kind + '_0'); c.anim = 'stand'; }
          if (c.wait <= 0) { var p = self.randomFree(c.zone); c.tx = p.x; c.ty = p.y; }
          return;
        }
        var dx = c.tx - s.x, dy = c.ty - s.y, d = Math.hypot(dx, dy);
        if (d < 1) { c.wait = 1 + Math.random() * 4; return; }
        var step = Math.min(d, D.speed * dt * (self.nightF > 0.6 ? 0.5 : 1)), nx = s.x + dx / d * step, ny = s.y + dy / d * step;
        var near = Math.hypot(nx - self.player.x, ny - self.player.y) < D.near;
        if (self.solidPx(nx - D.w, ny - 2) || self.solidPx(nx + D.w, ny - 2) || near) { c.wait = 0.6 + Math.random(); return; }
        s.x = nx; s.y = ny;
        s.setFlipX(dx < 0);
        if (c.anim !== D.walk) { s.play(D.walk); c.anim = D.walk; }
        s.setDepth(s.y);
      });
    }
    critterAt(fx, fy) {
      for (var i = 0; i < this.critters.length; i++) {
        var c = this.critters[i];
        if (Math.hypot(c.spr.x - fx, c.spr.y - 6 - fy) < c.def.r) return c;
      }
      return null;
    }

    // ================================================================ lighting
    createLighting() {
      var self = this, A = this.A;
      this.dark = this.add.image(0, 0, 'px').setOrigin(0).setDisplaySize(this.W * T, this.H * T).setDepth(9000).setBlendMode(Phaser.BlendModes.MULTIPLY).setVisible(false);
      this.lights = [];
      this.ambientParticles = [];
      this.graphicsPreset = null;
      this.torches.forEach(function (t) { t.light = self.addLight(t.x, t.y + 2, 0xffa040, 1.5, true); });
      if (this.houseImg) {
        var hx = this.houseImg.x - 40, hy = this.houseImg.y - 96;
        this.addLight(hx + 18, hy + 46, 0xffc070, 0.7, true);
        this.addLight(hx + 62, hy + 46, 0xffc070, 0.7, true);
      }
      if (this.dapurPos) this.addLight(this.dapurPos.x, this.dapurPos.y - 6, 0xff7a30, 0.9, true);
      this.warungLight = this.warungPos ? this.addLight(this.warungPos.x, this.warungPos.y - 34, 0xfff0b0, 1.8, false) : null;
      this.spiritLight = this.spiritPos ? this.addLight(this.spiritPos.x, this.spiritPos.y - 26, 0xd0b0ff, 1.0, false) : null;
      this.objects.forEach(function (o) {   // windows, shrines and the lighthouse glow at night
        var cx = (o.x + (o.w || 1) / 2) * T, by = (o.y + (o.h || 1)) * T;
        if (o.type === 'shrine') self.addLight(cx, by - 18, 0xd0b0ff, 0.7, false);
        else if (o.tex === 'house_penghulu') { self.addLight(cx - 22, by - 44, 0xffc070, 0.6, true); self.addLight(cx + 22, by - 44, 0xffc070, 0.6, true); }
        else if (o.tex === 'rumah_api') self.addLight(cx, by - 54, 0xfff0b0, 2.2, false);
        else if (o.tex === 'pondok') self.addLight(cx, by - 20, 0xffb060, 0.6, true);
      });
      (this.objLights || []).forEach(function (L) { self.addLight(L.x, L.y, L.c, 1.2, false); });
      this.playerLight = this.addLight(0, 0, 0xfff2d0, A.cave ? 2.4 : 1.3, false);
      this.playerLight.base = A.cave ? 0.75 : 0.35;
      this.flies = [];
      for (var i = 0; i < (this.area === 'mountain' ? 10 : 28); i++) {
        var fx, fy;
        if (this.area === 'farm') { fx = 16 + Math.random() * (this.W * T - 32); fy = i < 20 ? 24 * T + Math.random() * 4 * T : 2 * T + Math.random() * 2 * T; }
        else { var p = this.randomFree({ x0: 2, y0: 2, x1: this.W - 3, y1: this.H - 3 }); fx = p.x; fy = p.y - 10; }
        var img = this.add.image(fx, fy, 'firefly').setBlendMode(Phaser.BlendModes.ADD).setDepth(9003).setAlpha(0);
        this.flies.push({ img: img, bx: fx, by: fy, ph: Math.random() * 10, sp: 0.4 + Math.random() });
      }
      this.rays = [];
      if (A.underwater) {
        for (i = 0; i < 9; i++) { var rx = 40 + i * (this.W * T - 80) / 8 + Math.random() * 30; this.rays.push({ img: this.add.image(rx, -10, 'ray').setOrigin(0.5, 0).setDepth(8998).setBlendMode(Phaser.BlendModes.ADD).setScale(1.2 + Math.random(), 3.4).setAngle(-12), bx: rx, ph: Math.random() * 6 }); }
        this.addAmbientParticles('bubble', { x: { min: 16, max: this.W * T - 16 }, y: { min: 40, max: this.H * T - 16 }, speedY: { min: -30, max: -16 }, speedX: { min: -4, max: 4 }, lifespan: 4200, alpha: { start: 0.8, end: 0 }, scale: { start: 0.6, end: 1.1 }, frequency: 160 });
      }
      this.fogs = [];
      if (A.fog) for (i = 0; i < 9; i++) {
        var fg = this.add.image(Math.random() * this.W * T, Math.random() * this.H * T, 'fog').setDepth(8999).setScale(1.5 + Math.random() * 1.5).setAlpha(0.3 + Math.random() * 0.2);
        this.fogs.push({ img: fg, v: 3 + Math.random() * 5 });
      }
    }
    addAmbientParticles(key, config) {
      var emitter = this.add.particles(0, 0, key, config).setDepth(9004);
      this.ambientParticles.push({ emitter: emitter, frequency: config.frequency });
    }
    applyGraphicsQuality(preset) {
      this.graphicsPreset = preset;
      [this.flies, this.rays, this.fogs].forEach(function (effects) {
        var count = LC.Display.effectCount(effects.length);
        effects.forEach(function (effect, i) { effect.img.setVisible(i < count); });
      });
      this.ambientParticles.forEach(function (effect) {
        effect.emitter.setFrequency(Math.round(effect.frequency / preset.density));
      });
      this.refreshRainDrops();
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
    updateLighting(time, dt) {
      var S = this.S, A = this.A, col = this.skyColor(S.minutes);
      var preset = LC.Display.preset();
      if (preset !== this.graphicsPreset) this.applyGraphicsQuality(preset);
      var lum = ((col >> 16 & 255) * 0.3 + (col >> 8 & 255) * 0.59 + (col & 255) * 0.11) / 255;
      var n = Phaser.Math.Clamp((1 - lum - 0.06) / 0.45, 0, 1);
      if (A.cave && !A.naturalLight) { col = 0x2e2638; n = 1; }
      this.nightF = n;
      var tint = col, sea = LC.State.season().id, outdoors = !A.cave && !A.underwater;
      if (A.dim) tint = mulColor(tint, A.underwater ? 0xb8c8d8 : 0xd2e2d0);   // shade under the canopy (or inside the wreck)
      if (A.warm || (sea === 'kemarau' && outdoors)) tint = mulColor(tint, 0xfff0dc);   // the dunes (and the dry season) glow warm
      if (A.fog) tint = mulColor(tint, 0xe8eef2);
      if (A.golden) tint = mulColor(tint, 0xfff2d0);     // the Bunian village glows like late afternoon
      if (this.raining && outdoors) tint = mulColor(tint, 0xc8d2de);
      if (A.underwater) tint = mulColor(tint, A.jade ? 0x88e8c8 : 0x8cc8e8);
      this.dark.setVisible(tint !== 0xffffff).setTint(tint);
      var hgn = LC.State.isHGN(), shopOpen = this.shopOpen();
      if (this.warungLight) this.warungLight.base = shopOpen ? 0.8 : 0;
      if (this.spiritLight) this.spiritLight.base = 0.25 + S.ghost.glow / 100 * 0.7;
      this.playerLight.img.setPosition(this.player.x, this.player.y - 8);
      if (A.cave) this.playerLight.img.setScale((this.ghostHere ? 3.2 + S.ghost.glow / 100 : 2.2) * (0.96 + 0.04 * Math.sin(time / 130)));   // Pelita's glow pushes the dark back
      this.lights.forEach(function (L) {
        var f = L.flicker && preset.flicker ? 0.86 + 0.14 * Math.sin(time / 90 + L.ph) * Math.sin(time / 37 + L.ph * 2) : 1;
        L.img.setAlpha(n * L.base * f);
      });
      var lit = n > 0.25;
      this.torches.forEach(function (t) {
        t.spr.setTexture(lit ? 'torch_on' : 'torch_off');
        t.light.img.setTint(hgn ? 0xff5040 : 0xffa040);
      });
      this.flies.forEach(function (f) {
        if (!f.img.visible) return;
        f.img.x = f.bx + Math.sin(time / 1000 * f.sp + f.ph) * 14;
        f.img.y = f.by + Math.cos(time / 1300 * f.sp + f.ph * 1.3) * 9;
        f.img.setAlpha(n * (0.3 + 0.7 * Math.abs(Math.sin(time / 420 * f.sp + f.ph))));
      });
      var mapW = this.W * T;
      this.fogs.forEach(function (f) { if (f.img.visible) { f.img.x += f.v * dt; if (f.img.x > mapW + 120) f.img.x = -120; } });
      this.rays.forEach(function (r) { if (r.img.visible) { r.img.x = r.bx + Math.sin(time / 5000 + r.ph) * 30; r.img.setAlpha((0.16 + 0.06 * Math.sin(time / 1300 + r.ph)) * (1 - n)); } });
      if (A.underwater && time > (this.nextBreath || 0)) { this.nextBreath = time + 1400 + Math.random() * 900; this.fx.bubble.explode(2, this.player.x + (this.dir === 'left' ? -3 : 3), this.player.y - 12); }
      this.boats.forEach(function (b) { b.spr.y = b.y0 + Math.round(Math.sin(time / 600)); });
      if (this.ani) this.ani.setVisible(shopOpen);
      LC.Audio.setNight(S.minutes >= 19 * 60);
    }
    shopOpen() { return this.S.minutes >= LC.SHOP_OPEN && this.S.minutes < LC.SHOP_CLOSE; }

    // ================================================================ fx
    createFx() {
      var self = this;
      function mk(key, cfg) {
        var e = self.add.particles(0, 0, key, Object.assign({ emitting: false }, cfg)).setDepth(9500);
        var explode = e.explode;
        e.explode = function (count, x, y) { return explode.call(this, LC.Display.effectCount(count), x, y); };
        return e;
      }
      this.fx = {
        heart: mk('heart', { speed: { min: 12, max: 30 }, angle: { min: 235, max: 305 }, lifespan: 1000, alpha: { start: 1, end: 0 }, gravityY: -15 }),
        bubble: mk('bubble', { speedY: { min: -40, max: -22 }, speedX: { min: -6, max: 6 }, lifespan: 1600, alpha: { start: 0.9, end: 0 } }),
        sparkle: mk('sparkle', { speed: { min: 20, max: 55 }, lifespan: 800, alpha: { start: 1, end: 0 }, scale: { start: 1, end: 0.3 }, blendMode: 'ADD' }),
        leaf: mk('leaf', { speed: { min: 20, max: 45 }, angle: { min: 200, max: 340 }, gravityY: 90, lifespan: 750, alpha: { start: 1, end: 0 } }),
        drop: mk('drop', { speed: { min: 15, max: 35 }, angle: { min: 200, max: 340 }, gravityY: 130, lifespan: 500, alpha: { start: 1, end: 0.2 } }),
        dirt: mk('dirt', { speed: { min: 15, max: 35 }, angle: { min: 200, max: 340 }, gravityY: 130, lifespan: 450 }),
        smoke: mk('smoke', { speedY: { min: -16, max: -8 }, speedX: { min: -4, max: 4 }, lifespan: 1400, alpha: { start: 0.7, end: 0 }, scale: { start: 0.5, end: 1.5 } }),
        petal: mk('petal', { speed: { min: 6, max: 18 }, angle: { min: 60, max: 120 }, gravityY: 10, lifespan: 2200, alpha: { start: 1, end: 0 } }),
        pebble: mk('pebble', { speed: { min: 20, max: 60 }, angle: { min: 200, max: 340 }, gravityY: 170, lifespan: 600, alpha: { start: 1, end: 0 }, scale: { start: 1, end: 0.5 } })
      };
      if (this.spiritPos) {
        this.incense = this.add.particles(this.spiritPos.x - 8, this.spiritPos.y - 31, 'smoke', {
          speedY: { min: -9, max: -5 }, speedX: { min: -2, max: 2 }, lifespan: 2000, alpha: { start: 0.45, end: 0 }, scale: { start: 0.3, end: 1 }, frequency: 380, emitting: false
        }).setDepth(9004);
        this.time.addEvent({ delay: 2600, loop: true, callback: function () {
          if (self.S.minutes > 17 * 60) self.fx.petal.explode(1, (12 * T + 8) + (Math.random() - 0.5) * 30, 5 * T);
        } });
      }
    }

    refreshOfferings() {
      if (!this.spiritPos) return;
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
      var blocked = this.ui.isBlocking() || this.sleeping || this.leaving || this.reuniting || this.cutscene;   // (hold still while mother and son meet, or Badang makes his wish)

      this.updatePlayer(dt, blocked);
      this.checkExits();

      var N = LC.Net, guest = N.isGuest(), coop = N.active();
      // In co-op the clock never pauses for menus (friends are still playing). Guests just follow the host's clock.
      if (!this.A.frozenClock && !this.sleeping && (!blocked || coop)) {
        var dm = dt * LC.TIME_SCALE;
        S.minutes += dm;
        var hgn = LC.State.isHGN() ? 2 : 1;
        if (!guest) {
          g.full = clamp(g.full - dm * (4 / 60) * hgn);
          g.joy = clamp(g.joy - dm * ((g.full < 30 ? 4 : 2) / 60));
          g.glow = clamp(g.glow - dm * (1 / 60));
          if (S.minutes >= LC.DAY_END) this.sleep(true);
        } else if (S.minutes > LC.DAY_END - 1) S.minutes = LC.DAY_END - 1;
        if (hgn === 2 && S.minutes >= 18 * 60 && S.flags.hgnWarnDay !== S.day) {
          S.flags.hgnWarnDay = S.day;
          this.ui.toast('Hungry Ghost Night has begun. The torches burn red... Pelita is ravenous!', 'ic_glow');
        }
      }
      if (!guest && !blocked && S.pendingLevel.length) this.levelUp(S.pendingLevel.shift());

      this.updateGhost(time, dt, blocked);
      this.updateFolk(time, dt);
      this.updateRemote(dt);
      if (N.isHost()) {
        N.hostTick({
          m: S.minutes, d: S.day,
          g: { x: Math.round(this.gpos.x), y: Math.round(this.gpos.y), e: this.curExpr, a: this.ghostArea || 'farm' },
          gs: { full: g.full, joy: g.joy, glow: g.glow, bond: g.bond, stage: g.stage, level: g.level, craving: g.craving, cravingDone: g.cravingDone, petAt: g.petAt },
          me: { x: Math.round(this.player.x), y: Math.round(this.player.y), dir: this.dir, mv: this.moving, ar: this.area, cp: S.companion, rd: S.riding }
        });
      } else if (guest) N.sendPos(this.player.x, this.player.y, this.dir, this.moving, this.area, S.companion, false, S.riding);
      this.updateCritters(dt);
      this.updateFarmLife(time, dt);
      this.updateEnemies(time, dt, blocked);
      this.updateTanggang(time, dt, blocked);
      this.updateBadang(time, dt, blocked);
      this.updateHome(time, blocked && (!coop || this.sleeping || this.leaving) ? 0 : dt);
      this.updateBarunai(time, dt, blocked);
      this.updateKampong(time, dt);
      this.updateLighting(time, dt);

      var act = blocked ? null : this.getAction();
      this.ui.setPrompt(act && act.label);
      if (act && act.tile && !blocked) {
        var f = this.facing();
        this.cursorImg.setVisible(true).setPosition(f.tx * T, f.ty * T).setAlpha(act.label ? 0.6 + 0.3 * Math.sin(time / 150) : 0.25);
      } else this.cursorImg.setVisible(false);
    }

    // ================================================================ actions
    toast(m, icon) { this.ui.toast(m, icon); }
    waterKind(ch) { var k = LC.WATER_TILES[ch]; return k === 'pond' ? this.A.pond : k; }

    getAction() {
      var S = this.S, self = this, sl = LC.State.selItem(), it = sl ? LC.ITEMS[sl.id] : null, f = this.facing(), tx = f.tx, ty = f.ty;
      if (tx < 0 || ty < 0 || tx >= this.W || ty >= this.H) return null;
      var o = this.objAt[ty][tx], isFood = !!(it && it.food);
      if (o) {
        var oa = this.objectAction(o, sl, it, isFood);
        if (oa) return oa;
      }
      var helper = this.helperAt(tx, ty);
      if (helper) return this.helperAction(helper);
      var wp = this.weaponOf(sl);   // swing a weapon wherever enemies roam (or the cangkul, when one comes close)
      if (wp && this.hasEnemies() && (!wp.improvised || this.enemyNear(70))) return { label: 'Swing the ' + wp.name, swing: true, fn: function () { self.attack(); } };
      var cr = this.critterAt(f.fx, f.fy);
      if (cr && cr.aid) { var aa = this.animalAction(cr, sl, it); if (aa) return aa; }
      else if (cr) return { label: 'Pet the ' + cr.kind, fn: function () { self.petCritter(cr); } };
      if (isFood && this.ghostNear) return { label: 'Feed Pelita ' + it.name, fn: function () { self.feedGhost(sl.id); } };

      var ch = this.grid[ty][tx], t = this.area === 'farm' ? LC.State.tile(tx, ty) : null;
      if (t && t.crop && LC.cropStage(t.crop) === 3) return { label: 'Harvest ' + LC.CROPS[t.crop.id].name, tile: true, fn: function () { self.harvest(tx, ty); } };

      var ta = it ? this.toolAction(sl, it, ch, t, tx, ty) : null;
      if (ta && ta.label) return ta;
      var comp = this.companionNear();   // your spirit companion wants to play (once a day)
      if (comp) return { label: 'Play with the ' + LC.SPIRITS[comp].name, fn: function () { self.playSpirit(comp); } };
      if (this.ghostNear) return { label: 'Pet Pelita', fn: function () { self.petGhost(); } };
      if (ta) return ta;
      if (LC.WATER_TILES[ch]) return { label: '', fn: function () { self.toast(ch === 'o' || ch === 'h' ? 'The sea sparkles all the way to the horizon.' : LC.TEXT.river); } };
      if (isFood) return { label: '', fn: function () { self.toast('Press X to eat it yourself, or bring it to Pelita.'); } };
      return null;
    }

    objectAction(o, sl, it, isFood) {
      var S = this.S, self = this;
      switch (o.type) {
        case 'house': case 'house_wing': return { label: 'Nenek\'s house', fn: function () { self.ui.openHouse(); } };   // v1.8: sleep, the pantry, helpers, building
        case 'jejak': case 'tembadau': case 'bulu': case 'pinggai': case 'salvage': case 'vase': case 'tamu2': return this.barunaiObjAction(o);   // v1.9 (tamu2: v2.7.1)
        case 'kplot': case 'padian': case 'hop': case 'ghost_ayam': case 'batu_ayam': case 'besi_forge': case 'perahu_race': return this.kampongObjAction(o);   // v2.0
        case 'hero': case 'vision': case 'vision_back': case 'tour': case 'meriam': case 'api': case 'keluarga': return this.kampongObjAction(o);   // v2.1
        case 'ally': case 'api4': case 'jong_dagang': return this.kampongObjAction(o);   // v2.2
        case 'jong5': case 'pasar5': case 'obor5': case 'damar': case 'raja5': case 'kebo5': case 'lampir5': return this.kampongObjAction(o);   // v2.3
        case 'nenek6': case 'pinang6': case 'bunga6': case 'ally6': return this.kampongObjAction(o);   // v2.4
        case 'batu7': case 'rumah7': case 'perahu7': case 'pewarna7': case 'karang7': case 'tenun7': case 'lesung7': return this.kampongObjAction(o);   // v2.5
        case 'arus8': case 'balang8': case 'serpih8': case 'jar8': case 'arusgate8': case 'nek8': return this.kampongObjAction(o);   // v2.6
        case 'hanyut9': case 'tidur9': case 'awang9': case 'cari9': case 'lampu9': case 'pinang9': case 'pawang9': case 'dive9': case 'naik9': case 'kima9': return this.kampongObjAction(o);   // v2.7
        case 'masjid': return this.masjidAction(o);   // v2.7.4 (WorldMasjid.js)
        case 'spirit':
          if (isFood) return { label: 'Offer ' + it.name + ' to Pelita', fn: function () { self.feedGhost(sl.id); } };
          return { label: 'Spirit house', fn: function () { self.ui.openSpirit(); } };
        case 'dapur': return { label: 'Cook at the dapur', fn: function () { self.ui.openCook(); } };
        case 'well': return { label: 'Draw water', fn: function () { self.refillCan(); } };
        case 'warung': return { label: this.shopOpen() ? 'Shop at the warung' : 'Warung (closed)', fn: function () { self.ui.openShop(); } };
        case 'tree': {
          var tr = LC.TREES[o.kind], ready = S.trees[o.id] === 0 && (!tr.season || LC.State.season().id === tr.season);
          return { label: ready ? 'Pick ' + LC.ITEMS[tr.fruit].name : tr.name, work: ready, fn: function () { self.shakeTree(o); } };
        }
        case 'forage': {
          var fg = LC.FORAGE[o.kind];
          if (S.trees[o.id] === 0) return { label: fg.verb, work: true, fn: function () { self.forage(o); } };
          return { label: '', fn: function () { var d = S.trees[o.id]; self.toast(fg.name + ': picked clean. More in ' + d + ' day' + (d > 1 ? 's' : '') + '.'); } };
        }
        case 'torch': return { label: '', fn: function () { self.toast('A bamboo pelita torch. Nenek kept them burning every night.'); } };
        case 'gate': return { label: 'Blocked path', fn: function () { self.lockedAt = 0; self.lockedMsg(o.to); } };
        case 'sampan': return { label: LC.State.isOpen(o.to) ? 'Row to ' + LC.AREAS[o.to].name : 'Nenek\'s old sampan', fn: function () { self.useBoat(o); } };
        case 'shrine': return { label: 'Wayside shrine', fn: function () { self.useShrine(); } };
        case 'signpost': return { label: 'Read the sign', fn: function () { self.ui.say([{ text: o.text }]); } };
        case 'bldg': return { label: 'Look', fn: function () { self.ui.say([{ text: o.text }]); } };
        case 'plot': return this.plotAction(o);
        case 'dive': return this.diveAction(o);
        case 'surface': return { label: 'Swim up to Pulau Mutiara', fn: function () { LC.Audio.sfx('water'); self.goArea('island', self.tilePx({ x: 29, y: 8 }), 'left'); } };
        case 'turtle': return S.flags.turtleFreed ? null : { label: 'Free the sea turtle', work: true, fn: function () { self.freeTurtle(); } };
        case 'npc': return this.npcAction(o);
        case 'folk': return this.folkAction(o, sl, it);
        // v1.5 (WorldFarm.js)
        case 'coop': return { label: o.id === 'kandang' ? 'Goat pen' : 'Nenek\'s reban', fn: function () { self.ui.openCoop(); } };
        case 'chest': return { label: 'Open the ' + LC.ITEMS[o.kind].name, fn: function () { self.ui.openChest(o.cid); } };
        case 'pesta': return { label: LC.State.isPesta() ? 'Pesta! Enter a contest' : 'Pesta pavilion', fn: function () { self.ui.openPesta(); } };
        case 'lift': return { label: 'Lift the training stone', work: true, fn: function () { self.ui.openLift(); } };
        case 'keris': return S.flags.keris ? { label: 'Look', fn: function () { self.ui.say([{ text: 'The mossy stone where the keris slept for centuries. Bunian children now dare each other to touch it.' }]); } }
          : { label: 'The keris in the stone', fn: function () { self.pullKeris(); } };
        case 'portal': return this.portalAction(o);
        case 'bunian_gate': return { label: 'Step through the Bunian gate', fn: function () { LC.Audio.sfx('gate'); self.goArea('bunian', self.tilePx(LC.AREAS.bunian.home), 'up'); } };
        case 'wreck': return this.seaGateAction(o, 'Swim inside the sunken junk');
        case 'seagate': return this.seaGateAction(o, o.to === 'kidul' ? 'Swim through the green arch' : 'Dive into the deep trench');
        // v1.7 (WorldBadang.js)
        case 'hantu': case 'bubu': case 'bubu_badang': case 'tunggul': return this.badangObjAction(o, sl, it);
        default: return LC.TEXT[o.type] ? { label: 'Look', fn: function () { self.ui.say([{ text: LC.TEXT[o.type] }]); } } : null;
      }
    }

    toolAction(sl, it, ch, t, tx, ty) {
      var self = this, S = this.S, water = this.waterKind(ch);
      function hint(m) { return { label: '', tile: true, fn: function () { self.toast(m); LC.Audio.sfx('error'); } }; }
      if (it.kind === 'vehicle') {
        var rk = it.ride;
        if (S.riding) return { label: 'Hop off the basikal', ride: true, fn: function () { self.setRide(null); } };
        if (!this.canRide(rk)) return hint(this.A.underwater ? 'Not under the sea!' : 'You can\'t ride here.');
        return { label: 'Ride the basikal', ride: true, fn: function () { self.setRide(rk); } };
      }
      var v15 = this.toolAction15(sl, it, ch, t, tx, ty, hint);   // v1.5 items (WorldFarm.js)
      if (v15) return v15;
      var bb = this.bubuToolAction(sl, water, tx, ty, hint);   // v1.7: set a bubu in the water
      if (bb) return bb;
      if (sl.id === 'joran') {
        if (water) return { label: 'Cast your line', tile: true, fn: function () { self.startFishing(tx, ty, water); } };
        return hint(this.A.underwater ? 'You are already under the sea! Fish from the land.' : 'Face the water to fish: a river, pool, lake or the sea.');
      }
      if (it.kind === 'float') {
        if (!water) return hint('Set the krathong on water: a river, pool or the sea.');
        if (S.minutes < 18 * 60 && S.minutes >= 6 * 60) return hint('Krathong are floated after dark, when their candles can shine. Come back after 6 PM.');
        return { label: 'Float the krathong', tile: true, fn: function () { self.floatKrathong(tx, ty); } };
      }
      if (sl.id === 'hoe') {
        if (this.area !== 'farm') return hint('Save your strength for the farm. Till inside Nenek\'s fenced field.');
        if (ch === 'f' && !(t && t.tilled)) return { label: 'Till soil', tile: true, fn: function () { self.till(tx, ty); } };
        if (ch === 'f' && t && t.crop) return hint('Careful! Something is growing there.');
        if (ch === 'f') return hint('Already tilled. Plant some seeds!');
        if (ch === 'r') return hint('No need to till the sawah. Plant padi seedlings straight into the water!');
        return hint('The ground here is too hard. Till inside the fenced field.');
      }
      if (sl.id === 'can') {
        if (water === 'sea') return hint('Sea water is salty. It would hurt your crops!');
        if (water) return { label: 'Fill gembor', tile: true, fn: function () { self.refillCan(); } };
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
        if (this.area !== 'farm') return hint('Plant your seeds back home, in Nenek\'s field.');
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

    doAction() {
      if (this.sleeping || this.leaving) return;
      var a = this.getAction();
      if (!a) return;
      if (this.S.riding && (a.tile || a.work) && !a.ride) { this.setRide(null); this.toast('You hop off to get to work.'); }
      a.fn();
    }

    useEnergy(n) {
      if (this.S.energy < n) { this.toast('You are exhausted... Eat something (X) or go to sleep.'); LC.Audio.sfx('error'); return false; }
      this.S.energy -= n; return true;
    }
    bump() { var p = this.player; this.tweens.add({ targets: p, scaleY: 0.88, duration: 70, yoyo: true }); }

    // Personal costs (energy, water, seeds) are paid here; the shared world changes via doShared/LC.Sim.
    till(tx, ty) {
      var S = this.S, self = this;
      if (!this.useEnergy(2)) return;
      this.fx.dirt.explode(7, tx * T + 8, ty * T + 10);
      LC.Audio.sfx('till'); this.bump(); S.flags.tilled = true;
      this.doShared('till', { x: tx, y: ty }, function (ok) { if (!ok) S.energy += 2; else if (self.companionTill) self.companionTill(); });
    }
    water(tx, ty) {
      var S = this.S;
      if (!this.useEnergy(1)) return;
      S.water--;
      this.fx.drop.explode(9, tx * T + 8, ty * T + 6);
      LC.Audio.sfx('water'); this.bump(); S.flags.watered = true;
      this.doShared('water', { x: tx, y: ty }, function (ok) { if (!ok) { S.water++; S.energy += 1; } });
    }
    plant(tx, ty, seedId) {
      var self = this;
      LC.State.remove(seedId, 1);
      this.fx.leaf.explode(3, tx * T + 8, ty * T + 10);
      LC.Audio.sfx('plant'); this.S.flags.planted = true;
      var cd = LC.CROPS[LC.ITEMS[seedId].crop];
      this.doShared('plant', { x: tx, y: ty, crop: LC.ITEMS[seedId].crop }, function (ok) {
        if (!ok) { LC.State.add(seedId, 1); self.toast('Someone beat you to that spot!'); return; }
        if (!LC.State.inSeason(cd.seasons)) self.toast(cd.name + ' only grows in ' + cd.seasons.map(function (s) { return LC.SEASONS.filter(function (q) { return q.id === s; })[0].name; }).join(' and ') + '. It will rest until then.', 'ic_' + 's_' + cd.seasons[0]);
      });
    }
    harvest(tx, ty) {
      var self = this, t = LC.State.tile(tx, ty), def = LC.CROPS[t.crop.id];
      if (!LC.State.canAdd(def.item)) { this.toast('Your bag is full!'); LC.Audio.sfx('error'); return; }
      this.fx.leaf.explode(8, tx * T + 8, ty * T + 8);
      LC.Audio.sfx('harvest'); this.bump();
      this.doShared('harvest', { x: tx, y: ty }, function (res) {
        if (!res || !res.item) { self.toast('Too slow! A friend already harvested that one.'); return; }
        LC.State.add(res.item, res.count);
        var cb = self.companionBonus ? self.companionBonus('harvest', res.item) : '';   // v2.8
        self.toast('+' + res.count + ' ' + LC.ITEMS[res.item].name + (def.paddy && LC.State.friend('semangat') ? '  (blessed by the Semangat Padi)' : '') + cb, 'i_' + res.item);
        self.S.flags.harvested = true;
      });
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
      var self = this;
      function noFruit(days) { self.toast(tr.name + ': no ripe fruit yet. Check back in ' + days + ' day' + (days > 1 ? 's' : '') + '.'); }
      if (tr.season && LC.State.season().id !== tr.season) {
        var wait = 0; for (var d = S.day; LC.seasonOf(d).id !== tr.season && wait < 40; d++) wait++;
        this.toast(tr.name + ': it only fruits in Musim Buah-buahan, the fruit season (in ' + wait + ' day' + (wait > 1 ? 's' : '') + ').', 'ic_s_buah'); return;
      }
      if (S.trees[o.id] > 0) { noFruit(S.trees[o.id]); return; }
      if (!LC.State.canAdd(tr.fruit)) { this.toast('Your bag is full!'); return; }
      this.doShared('shake', { id: o.id }, function (res) {
        if (!res) return;
        if (res.days) { noFruit(res.days); return; }
        LC.State.add(res.item, res.count);
        self.fx.leaf.explode(10, spr.x, spr.y - spr.height * 0.6);
        self.toast('+' + res.count + ' ' + LC.ITEMS[res.item].name + (self.companionBonus ? self.companionBonus('tree', res.item) : ''), 'i_' + res.item);
      });
    }
    forage(o) {
      var S = this.S, fg = LC.FORAGE[o.kind], spr = this.trees[o.id].spr, self = this;
      if (!LC.State.canAdd(fg.item)) { this.toast('Your bag is full!'); LC.Audio.sfx('error'); return; }
      if (fg.energy && !this.useEnergy(fg.energy)) return;
      LC.Audio.sfx(o.kind === 'boulder' || o.kind === 'clay' || o.kind === 'glint' ? 'till' : 'harvest'); this.bump();
      this.doShared('shake', { id: o.id }, function (res) {
        if (!res || !res.item) { S.energy += fg.energy || 0; if (res && res.days) self.toast(fg.name + ': picked clean. More in ' + res.days + ' day(s).'); return; }
        var bonus = S.flags.kidul && (self.area === 'laut' || self.area === 'island' || self.area === 'kidul' || self.area === 'atlantis' || self.area === 'kapal') ? 1 : 0;   // the Queen's blessing
        LC.State.add(res.item, res.count + bonus);
        (o.kind === 'boulder' || o.kind === 'clay' || o.kind === 'goldvein' ? self.fx.dirt : self.fx.leaf).explode(8, spr.x, spr.y - 6);
        if (o.kind === 'goldvein' || o.kind === 'crystal') { LC.Audio.sfx('mine'); self.fx.sparkle.explode(6, spr.x, spr.y - 8); S.stats.gold = (S.stats.gold || 0) + res.count; }
        var strUp = o.kind === 'boulder' || o.kind === 'goldvein' ? (Math.random() < 0.3 ? LC.State.gainStr(1) : 0) : 0;
        var cb = self.companionBonus ? self.companionBonus('forage', res.item, o) : '';   // v2.8: the Orang Bunian
        self.toast('+' + (res.count + bonus) + ' ' + LC.ITEMS[res.item].name + (bonus ? '  (the Queen\'s blessing)' : '') + (strUp ? '  +1 strength' : '') + cb, 'i_' + res.item);
        if (res.extra && LC.State.add(res.extra, 1)) {
          LC.Audio.sfx('chime'); self.fx.sparkle.explode(12, spr.x, spr.y - 6);
          self.toast('Something special! You found a ' + LC.ITEMS[res.extra].name + '!', 'i_' + res.extra);
        }
        S.flags.foraged = true;
      });
    }
    petCritter(c) {
      LC.Audio.sfx(c.def.sfx);
      this.toast(LC.TEXT[c.kind] || '');
      if (c.def.hop) { c.wait = 0; c.tx = c.spr.x + (Math.random() - 0.5) * 60; c.ty = c.spr.y + (Math.random() - 0.5) * 30; }
      this.fx.heart.explode(2, c.spr.x, c.spr.y - 12);
    }
    eat() {
      var S = this.S, sl = LC.State.selItem();
      if (!sl) return;
      var it = LC.ITEMS[sl.id];
      if (!it.food) { this.toast('You can\'t eat ' + it.name + '!'); return; }
      var hurt = S.hp < S.maxHp, tonic = it.strength && S.jamuDay !== S.day;
      if (S.energy >= S.maxEnergy && !hurt && !tonic) { this.toast('You are not hungry right now.'); return; }
      LC.State.remove(sl.id, 1);
      var e = it.energy || Math.round(it.food.full * 0.8) + 5, extra = '';
      S.energy = Math.min(S.maxEnergy, S.energy + e);
      if (hurt) { var hp = Math.min(S.maxHp - S.hp, Math.round(it.food.full * 0.6) + 4); S.hp += hp; extra += '  +' + hp + ' health'; }
      // v1.5: hearty home cooking (twice a day) and the Bunian tonic make you stronger
      if (tonic) { S.jamuDay = S.day; var g1 = LC.State.gainStr(it.strength); extra += '  +' + g1 + ' strength!'; }
      else if (it.kind === 'dish') {
        if (S.strFoodDay !== S.day) { S.strFoodDay = S.day; S.strFood = 0; }
        if (S.strFood < 2) { S.strFood++; if (LC.State.gainStr(1)) extra += '  +1 strength'; }
      }
      LC.Audio.sfx('eat');
      this.toast('You eat the ' + it.name + '. +' + e + ' energy' + extra + (sl.id === 'cili' ? '  Pedas!!' : sl.id === 'jamu' || sl.id === 'jamu_kuat' ? '  So bitter... but so strong!' : ''), it.icon);
    }

    // ---------------------------------------------------------------- Pelita care
    feedGhost(id) {
      var S = this.S, g = S.ghost, it = LC.ITEMS[id], self = this;
      function tooFull() { self.toast('Pelita is too full to eat another bite.'); self.setEmote('sleepy', 1500); LC.Audio.sfx('error'); }
      if (g.full >= 97) { tooFull(); return; }
      LC.State.remove(id, 1);
      this.doShared('feed', { item: id }, function (res) {
        if (!res || !res.ok) { LC.State.add(id, 1); if (res && res.full) tooFull(); return; }
        var gp = self.ghostPos();
        if (res.joy < 0) { self.setEmote('sad', 2200); LC.Audio.sfx('sad'); }
        else { self.setEmote('happy', 2200); LC.Audio.sfx('eat'); self.fx.heart.explode(4, gp.x, gp.y - 8); }
        self.toast((id === 'durian' ? 'Pelita holds its nose... the smell! ' : '') + res.msg + ' (+' + res.b + ' bond)', it.icon);
        if (res.craving) {
          self.time.delayedCall(650, function () {
            LC.Audio.sfx('chime');
            var p = self.ghostPos(); self.fx.sparkle.explode(14, p.x, p.y);
            self.toast('Craving satisfied! (+' + res.b2 + ' bond)', 'ic_bond');
            self.craveGift();
          });
        }
        S.flags.fedOnce = true;
      });
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
      var self = this;
      this.doShared('pet', {}, function (res) {
        if (!res) return;
        var gp = self.ghostPos();
        if (!res.ok) { self.toast('Pelita giggles. It has had plenty of cuddles for now.'); self.setEmote('happy', 900); LC.Audio.sfx('pet'); return; }
        self.fx.heart.explode(3, gp.x, gp.y - 6); LC.Audio.sfx('pet'); self.setEmote('happy', 1800);
        self.toast('You pat Pelita. It wiggles with joy! (+' + res.b + ' bond)', 'ic_joy');
      });
    }
    offer(id) {
      var self = this, S = this.S, it = LC.ITEMS[id];
      function full() { self.toast('Pelita\'s glow is already full.'); LC.Audio.sfx('error'); }
      if (S.ghost.glow >= 100) { full(); return false; }
      LC.State.remove(id, 1);
      this.doShared('offer', { item: id }, function (res) {
        if (!res || !res.ok) { LC.State.add(id, 1); if (res && res.full) full(); return; }
        if (id === 'colok') S.flags.incense = true;
        LC.Audio.sfx('offer');
        if (self.spiritPos) self.fx.sparkle.explode(10, self.spiritPos.x, self.spiritPos.y - 26);
        self.setEmote('happy', 2000);
        self.toast('You place the ' + it.name + '. Pelita glows brighter! (+' + res.b + ' bond)', it.icon);
      });
      return true;
    }
    cookFx() {
      if (!this.dapurPos) return;
      this.fx.smoke.explode(6, this.dapurPos.x, this.dapurPos.y - 22);
      this.fx.sparkle.explode(5, this.dapurPos.x, this.dapurPos.y - 18);
    }

    // ---------------------------------------------------------------- day cycle
    sleep(fainted, stay) {   // stay (v2.7.1): { area, x, y } to wake up there instead of at home (a guest house)
      if (this.sleeping) return;
      if (this.A.frozenClock) { this.toast('Time stands still here. Leave Kampung Bunian to sleep.', 'ic_moon'); return; }
      var self = this;
      this.sleeping = true;
      this.S.riding = null;
      this.ui.closeModal();
      LC.Audio.sfx('sleep');
      if (LC.Net.isHost()) LC.Net.broadcast({ t: 'sleepStart', fainted: fainted });
      this.cameras.main.fadeOut(900, 8, 6, 18);
      this.cameras.main.once('camerafadeoutcomplete', function () {
        var sum = LC.State.endDay(fainted);
        if (LC.Net.isHost()) LC.Net.broadcast({ t: 'dayStart', sum: sum, world: LC.State.snapshot() });
        if (stay && !fainted && stay.area === self.area && self.area !== 'farm') { LC.followPid = self.followPid; self.scene.restart({ area: stay.area, spawn: self.tilePx(stay), dir: 'down', summary: sum }); return; }   // you wake up where you slept
        if (self.area !== 'farm') { LC.followPid = self.followPid; self.scene.restart({ area: 'farm', summary: sum }); return; }   // you are carried home
        self.refreshLadang(); self.refreshHouse(); self.refreshHelpers();
        self.refreshAllTiles();
        self.refreshOfferings();
        self.refreshPlots(); self.refreshSeason(); self.refreshAnimals(); self.refreshChests();
        var wake = stay && !fainted && stay.area === 'farm' ? self.tilePx(stay) : { x: 4 * T + 8, y: 8 * T + 13 };   // (v2.7.5: or by your khemah)
        self.player.setPosition(wake.x, wake.y);
        self.dir = 'down';
        var h = self.ghostHome(); self.gpos.x = h.x; self.gpos.y = h.y;
        self.ui.showSummary(sum, function () {
          self.cameras.main.fadeIn(800);
          self.sleeping = false;
          self.morning();
        });
      });
    }
    // co-op guest: the host went to bed (everyone sleeps together)
    guestSleep() {
      if (this.sleeping || this.A.frozenClock) return;
      this.sleeping = true;
      this.S.riding = null;
      this.ui.closeModal();
      LC.Audio.sfx('sleep');
      this.cameras.main.fadeOut(900, 8, 6, 18);
    }
    guestDayStart(m) {
      var self = this, S = this.S;
      if (this.A.frozenClock) {
        var day = S.day, minutes = S.minutes;
        LC.State.applySnapshot(m.world);
        S.day = day; S.minutes = minutes;
        LC.State.recalc();
        return;
      }
      this.sleeping = true;
      this.ui.closeModal();
      LC.State.applySnapshot(m.world);
      S.energy = S.maxEnergy;
      var mine = LC.State.personalMorning();
      S.energy = S.maxEnergy;
      var sum = Object.assign({}, m.sum, { earned: S.stats.earned, lines: (m.sum.lines || []).concat(mine) });
      S.stats.earned = 0;
      LC.State.save();
      if (this.area !== 'farm') { this.scene.restart({ area: 'farm', summary: sum }); return; }
      this.refreshLadang(); this.refreshHouse(); this.refreshHelpers();
      this.refreshAllTiles();
      this.refreshOfferings();
      this.refreshPlots(); this.refreshSeason(); this.refreshAnimals(); this.refreshChests();
      var sp = this.homeSpot(this.pc); this.player.setPosition(sp.x, sp.y); this.dir = 'down';
      this.ui.showSummary(sum, function () {
        self.cameras.main.fadeIn(800);
        self.sleeping = false;
        self.morning();
      });
    }

    morning() {
      var S = this.S, g = S.ghost;
      this.ui.toast('Good morning! Day ' + S.day + ', ' + LC.State.weekday() + '.', 'ic_sun');
      if (LC.State.isHGN()) this.ui.say([{ text: 'Today is Ahad. Tonight is Hungry Ghost Night, when wandering spirits come looking for food.' }, { name: 'Pelita', portrait: 'ghost', expr: 'sad', text: '...!! (Pelita\'s tummy rumbles. Every kindness counts double today!)' }]);
      else if (g.stage >= 1) this.ui.toast('Pelita is craving ' + LC.ITEMS[g.craving].name + ' today.', 'i_' + g.craving);
    }

    // ---------------------------------------------------------------- Pelita levels up (and sometimes evolves)
    levelUp(lv) {
      var self = this, r = LC.LEVEL_REWARDS[lv] || {}, gp = this.ghostPos();
      if (LC.Net.isHost()) LC.Net.broadcast({ t: 'event', ev: 'level', lv: lv });
      var gift = LC.State.levelGift(lv);
      this.refreshGates();
      this.refreshLevelThings();   // the warung's new stall, the mine shaft (WorldFarm.js)
      LC.Audio.sfx(r.stage ? 'stage' : 'levelup');
      if (this.ghostHere) this.fx.sparkle.explode(r.stage ? 30 : 18, gp.x, gp.y);
      this.cameras.main.flash(r.stage ? 600 : 300, 255, 240, 210);
      this.setEmote('happy', 3500);
      this.ui.toast('Pelita reached Level ' + lv + '!', 'ic_bond');
      var lines = [];
      if (r.unlock) {
        var A = LC.AREAS[r.unlock];
        lines.push({ text: '✦ A new place is open: ' + A.name + ', ' + A.sub + '! ✦' });
        lines.push({ name: 'Pelita', portrait: 'ghost', expr: 'happy', text: '(Pelita\'s light reaches a little further...) ' + LC.AREA_HOWTO[r.unlock] });
      }
      if (gift) lines.push({ text: gift });
      if (r.stage) { this.stageUp(r.stage, lines); return; }
      if (lines.length) this.time.delayedCall(500, function () { self.ui.say([{ text: '✦ Pelita reached Level ' + lv + '! ✦' }].concat(lines)); });
    }
    stageUp(st, extra) {
      var self = this;
      if (st === 4) { this.festival(); return; }
      var lines = [{ text: '✦ Pelita has grown into a ' + LC.STAGES[st].name + '! (Level ' + LC.State.level() + ') ✦' }];
      LC.STAGE_TEXT[st].forEach(function (t) { lines.push({ name: 'Pelita', portrait: 'ghost', expr: 'happy', text: t }); });
      lines = lines.concat(extra || []);
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
          { text: '✦ Pelita has become the Guardian of the Kampung! (Level 12) ✦' },
          { text: 'Somewhere, you are sure Nenek is smiling. The farm, the river and the little spirit are in good hands.' },
          { text: 'The days go on: Pelita can keep growing all the way to Level 20, and there are still spirits and friends to find.' }
        ], { onDone: function () { S.flags.guardian = true; LC.State.save(); } });
      });
    }
  };
})(window.LC);
