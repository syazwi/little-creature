/* Grass details (v3.24.1): little leafy clumps, tufts, flowers and pebbles scattered over the grass of every place.
 * The owner asked for grass details from the "Sunnyside World" asset pack by Daniel Diggle
 * (https://danieldiggle.itch.io/sunnyside), which they downloaded (v3.24.0 already uses its terrain: art-sunnyside.js).
 * Its licence allows use in free and commercial projects and allows changes ("credit is not necessary, but always
 * appreciated"); it does not allow repackaging or reselling the assets, or redistributing the files outside tutorials
 * and courses. So only these 33 small pieces are used, stored here as pixel rows inside the game (not as image files).
 * Never add the pack's zip, sheets or PNG files to this repository.
 * Placement: a seeded scatter per place (the same every visit), on grass only, never on paths, objects, the farm field,
 * Badang's land or the room kept for Nenek's house; flowers grow in patches of one colour. The graphics setting (Pause >
 * Graphics) shows more or fewer of them. Loaded after the World scene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art, T = 16;
  // the pack's own colours, by letter (since v3.24.0 the grass itself is Sunnyside World's, so they sit right on it)
  var PAL = {
    a: '#7bcf5c', b: '#53a641', c: '#4a9e5a', d: '#3f8e4f', e: '#3e8948', f: '#3d895d', g: '#265c42',   // leaves, light to dark
    s: 'rgba(62,137,72,0.54)', S: 'rgba(24,20,37,0.53)',                                                // soft shadows on the ground
    w: '#ffffff', o: '#feae34', O: '#f77622', y: '#fee761', B: '#0099db', R: '#e43b44',                 // flowers
    1: '#c0cbdc', 2: '#8b9bb4', 3: '#5a6988', 4: '#3a4466'                                              // pebbles
  };
  var D = LC.GRASS_DETAILS = {
    // from Sunnyside World's 16 px tileset: 16 leafy clumps and tufts, 13 flowers (blue, red, white), 4 pebbles
    leaf: [
      ['......dddd.....', '.....daaaad....', '.....daaaad....', '.....daaaad....', '....ddaaadd....', '..sdaadadaad...', '.sdaaaadaaaad..', 'ssdaaaadaaaad..', 'ssdaaaadaaaads.', '.ssssssdaaaadss', '..sssssssssssss', '........ssssss.', '.........ssss..'],
      ['......dddd.....', '.....daaaad....', '....ddaaaaad...', '...daadadddd...', '..daaaadaaaad..', '.sdaaaadaaaad..', 'ssdaaaadaaaad..', 'ssdaaaadaaaads.', '.ssssssdaaaadss', '..sssssssssssss', '........ssssss.', '.........ssss..'],
      ['.......dd......', '......daad.....', '...ddddaaad....', '..daaaadaad....', '..daaaaddddd...', '.sdaaaadaaaad..', 'ssdaaadaaaaaad.', 'ssdaaadaaaaaad.', '.sssssddaaaadds', '..sssssssssssss', '........ssssss.', '.........ssss..'],
      ['.......dd......', '......daad.....', '.....daaaad....', '.....daaaad....', '...ddddaaad....', '..daaaadadd....', '.daaaaaadaad...', 'sdaaaaadaaaad..', 'ssdaaaadaaaads.', '.ssssssdaaaadss', '..sssssssssssss', '........ssssss.', '.........ssss..'],
      ['...dd...', '..daad..', '.ddaadd.', 'daaaaaad', 'daaaaaad', 'ssssssss', '.ssssss.', '..ssss..'],
      ['...dd...', '..daad..', '.ddaadd.', 'daaaaaad', 'daaaaaad', 'sdaaaads', 'ssssssss', '.ssssss.', '..ssss..'],
      ['..dddd..', '.daaaad.', 'daaaaaad', 'daaaaaad', 'daaaaaad', 'sdaaaads', 'ssssssss', '.ssssss.', '..ssss..'],
      ['..dddd..', '.daaaad.', '.daaaad.', '.daaaad.', 'sdaaaads', 'ssssssss', '.ssssss.', '..ssss..'],
      ['...dd...', '..daad..', '.daaaad.', '.dbaabd.', '.dbbbbd.', 'ssdbbdss', 'ssssssss', '.ssssss.', '..ssss..'],
      ['...dd...', '..daad..', '.daaaad.', '.dbaabd.', '.dbbbbd.', '.dbbbbd.', 'ssdbbdss', 'ssssssss', '.ssssss.', '..ssss..'],
      ['..dddd..', '.daaaad.', '.daaaad.', '.dbbbbd.', '.dbbbbd.', '.dbbbbd.', 'ssdbbdss', 'ssssssss', '.ssssss.', '..ssss..'],
      ['..dddd..', '.daaaad.', 'daaaaaad', 'dbaaaabd', 'dbbbbbbd', 'sddbbdds', 'ssssssss', '.ssssss.', '..ssss..'],
      ['...dd...dd...', '..daad.daad..', '.daaaadaaaad.', '.daaaadaaaad.', 'sdaaaadaaaad.', 'ssssssdaaaads', '.ssssssssssss', '..ssssssssss.', '.......ssss..'],
      ['...dd........', '..daad.dddd..', '.daaaadaaaad.', '.daaaadaaaad.', '.daaaadaaaad.', 'sdaaaadaaaad.', 'ssssssdaaaads', '.ssssssssssss', '..ssssssssss.', '.......ssss..'],
      ['..dddd.......', '.daaaad......', '.daaaaddddd..', '.daaaadaaaad.', '.daaadaaaaaad', 'sdaaadaaaaaad', 'ssssssdaaaads', '.ssssssssssss', '..ssssssssss.', '.......ssss..'],
      ['..dddd.......', '.daaaad.dd...', 'daaaaaadaad..', 'daaaaadaaaad.', 'sdaaaadaaaad.', 'ssssssdaaaads', '.ssssssssssss', '..ssssssssss.', '.......ssss..'],
    ],
    flower: [
      ['..ccc..', '.cBBBc.', 'cBBoBBc', 'fBoooBf', 'fBBoBBf', '.fBBBf.', '..fff..'],
      ['.BB.', 'BooB', 'BooB', 'fBBf', '.ff.'],
      ['.BBB.......', 'BBoBB......', 'BoooB......', 'BBoBB......', 'fBBBf......', '.fff....cc.', '.......fBBf', '.......BooB', '.......BooB', '.......fBBf', '........ff.'],
      ['..BBB..', '.BBBBB.', 'BBoooBB', 'BBoooBB', 'BBoooBB', 'ffBBBff', 'ffBBBff', '.fffff.'],
      ['..ccc..', '.cRRRc.', 'cRRooRc', 'fRoooRf', 'fRooRRf', '.fRRRf.', '..fff..'],
      ['.RR.', 'RooR', 'RooR', 'fRRf', '.ff.'],
      ['.RRR.......', 'RRoRR......', 'RoooR......', 'RRoRR......', 'fRRRf......', '.fff....cc.', '.......fRRf', '.......RooR', '.......RooR', '.......fRRf', '........ff.'],
      ['..RRR..', '.RRRRR.', 'RRoooRR', 'RRoooRR', 'RRoooRR', 'fRRRRRf', '.cRRRc.', '..fff..'],
      ['..www..', '.wyoyw.', 'ewooowe', 'ew1o1we', 'eewwwee', '.eeeee.'],
      ['.ww.', 'woow', 'woow', 'ewwe', 'eeee', '.ee.'],
      ['..www.......', '.wyoyw......', 'ewooowe.....', 'ewyoywe.....', 'eewwwee.....', '.eeeee......', '........ww..', '.......1oo1.', '......e1oo1e', '......eewwee', '.......eeee.', '........ee..'],
      ['...www...', '..wwwww..', '.1wyoyw1.', 'e11ooo11e', 'e11yoy11e', 'eewwwwwee', '.eewwwee.', '..eeeee..'],
      ['....www....', '..ewwwwwe..', '.eewwwwwee.', '.1w1ooo1w1.', 'ewwOoooOwwe', 'ewwOOoOOwwe', 'ee11OOO11ee', 'gggwwwwwggg', '.ggwwwwwgg.', '..ee1w1ee..', '...eeeee...'],
    ],
    rock: [
      ['.....33333....', '....3111113...', '...311111113..', '..4211111114..', '.422111111134.', 'S422211111334.', '.S22233333334S', '..S233333333S.', '...S3333333S..', '....SSSSSSS...'],
      ['....333.........', '...31113........', '..3111114.......', '.421111134......', 'S422111334S.....', '.S2333333S333...', '..S33333S31114..', '...SSSSS4211134.', '.......S4223334S', '........S23333S.', '.........SSSSS..'],
      ['....333....', '...31113...', '..3111114..', '.421111134.', 'S422111334S', '.S2333333S.', '..S33333S..', '...SSSSS...'],
      ['...333...', '..31114..', '.4211134.', 'S4223334S', '.S23333S.', '..SSSSS..']
    ]
  };
  D.flowerSets = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11, 12]];   // blue, red, white

  Art.generateGrass = function (scene) {
    ['leaf', 'flower', 'rock'].forEach(function (g) {
      D[g].forEach(function (rows, i) {
        var w = rows.reduce(function (m, r) { return Math.max(m, r.length); }, 0);
        Art.make(scene, 'gd_' + g + i, w, rows.length, function (p) { p.str(rows, PAL); }, false);
      });
    });
  };

  // ---------------------------------------------------------------- scattering them over the grass
  var W = LC.WorldScene.prototype;
  var GRASSY = { '.': 1, g: 1 };
  var buildDecor = W.buildDecor;
  W.buildDecor = function () {
    buildDecor.apply(this, arguments);
    this.scatterGrassDetails();
  };
  var applyGraphicsQuality = W.applyGraphicsQuality;
  W.applyGraphicsQuality = function (preset) {
    applyGraphicsQuality.apply(this, arguments);
    var list = this.grassDetails || [], n = LC.Display.effectCount(list.length);
    list.forEach(function (im, i) { im.setVisible(i < n); });
  };
  W.scatterGrassDetails = function () {
    var self = this, A = this.A, g = this.grid, farm = this.area === 'farm';
    this.grassDetails = [];
    if (!this.textures.exists('gd_leaf0')) return;
    var rnd = new Phaser.Math.RandomDataGenerator(['grass-' + this.area]);
    var clear = A.clear || [];
    function cleared(x, y) { return clear.some(function (c) { return Math.hypot(x - c.x, y - c.y) <= (c.r || 1); }); }
    var spots = [];
    for (var y = 1; y < this.H - 1; y++) for (var x = 1; x < this.W - 1; x++) {
      if (!GRASSY[g[y][x]] || this.solid[y][x] || this.objAt[y][x]) continue;
      if (farm && ((LC.inLadang && LC.inLadang(x, y)) || (LC.inFieldArea && LC.inFieldArea(x, y)))) continue;
      if (farm && LC.HOUSE_ZONE && x >= LC.HOUSE_ZONE.x0 && x <= LC.HOUSE_ZONE.x1 && y >= LC.HOUSE_ZONE.y0 && y <= LC.HOUSE_ZONE.y1) continue;
      if (cleared(x, y)) continue;
      spots.push([x, y]);
    }
    var n = Math.min(460, Math.round(spots.length * 0.2));
    for (var i = 0; i < n && spots.length; i++) {
      var k = rnd.between(0, spots.length - 1), s = spots[k];
      spots[k] = spots[spots.length - 1]; spots.pop();
      var r = rnd.frac(), key;
      if (r < 0.58) key = 'gd_leaf' + rnd.between(0, D.leaf.length - 1);
      else if (r < 0.92) {   // flowers grow in patches: one colour per little meadow
        var set = D.flowerSets[(Math.floor(s[0] / 7) * 3 + Math.floor(s[1] / 6) * 5) % D.flowerSets.length];
        key = 'gd_flower' + set[rnd.between(0, set.length - 1)];
      } else key = 'gd_rock' + rnd.between(0, D.rock.length - 1);
      var px = s[0] * T + 8 + rnd.between(-4, 4), py = (s[1] + 1) * T - rnd.between(0, 4);
      var im = this.add.image(px, py, key).setOrigin(0.5, 1).setDepth(-6).setFlipX(rnd.frac() < 0.5);      this.grassDetails.push(im);
    }
    var shown = LC.Display.effectCount(this.grassDetails.length);
    this.grassDetails.forEach(function (im, j) { im.setVisible(j < shown); });
    void self;
  };
})(window.LC);
