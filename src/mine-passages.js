/* Laluan Gema: a seasonal side passage off the lower mine. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';

  var ID = 'laluan', MINE = LC.AREAS.lombong;
  var ARENA = { x0: 13, y0: 2, x1: 30, y1: 11 };
  var EXIT = { x0: 21, y0: 37, x1: 22, y1: 37, to: 'lombong', sx: 23, sy: 48, dir: 'down' };
  var cached;

  LC.MINE_PASSAGES = { id: ID, arena: ARENA, health: 5, costs: [2, 3, 4] };
  LC.ITEMS.batu_gema = {
    id: 'batu_gema', icon: 'i_batu_gema', name: 'Batu Gema', kind: 'material',
    desc: 'Echo Stone from Laluan Gema. Use it at the miners\' anvil to improve all your weapons.'
  };
  LC.ENEMIES.sang_kelembai = { name: 'Sang Kelembai', hp: 54, speed: 0, dmg: 13, sight: 128, w: 13, boss: true, drop: [] };
  MINE.objects.push({ id: 'l_gema', type: 'mine_passage', x: 23, y: 47, w: 2, tex: 'laluan_pintu' });

  function generate(seed, season) {
    var random = new Phaser.Math.RandomDataGenerator(['laluan-gema', String(seed), String(season)]);
    var grid = Array.from({ length: 38 }, function () { return new Array(44).fill('X'); });
    var objects = [], enemies = [{ kind: 'sang_kelembai', n: 1, fixed: { x: 21.5, y: 5 } }];

    function fill(x0, y0, x1, y1, tile) {
      for (var y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) {
        for (var x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) grid[y][x] = tile || 'c';
      }
    }
    function torch(x, y) { objects.push({ type: 'torch', x: x, y: y }); }
    function sign(x, y, message) { objects.push({ type: 'signpost', tex: 'sign', x: x, y: y, text: message }); }
    function deposit(id, x, y, tex, loot, hidden) {
      objects.push({ id: id, type: 'mine_deposit', x: x, y: y, tex: tex, loot: loot, hidden: hidden, passable: !!hidden });
    }

    fill(17, 29, 26, 35);                  // entrance and forge
    fill(21, 35, 22, 37);
    fill(17, 12, 26, 16);                  // both routes meet below the arena
    fill(21, 11, 22, 12);
    fill(ARENA.x0, ARENA.y0, ARENA.x1, ARENA.y1);
    fill(16, 3, 27, 10, 'k');
    objects.push({ id: 'gema_anvil', type: 'mine_anvil', x: 18, y: 33, tex: 'gema_anvil' });
    objects.push({ id: 'gema_cache', type: 'mine_cache', x: 27, y: 3, w: 2, tex: 'peti_harta' });
    [[17, 7], [25, 7], [19, 9], [24, 9]].forEach(function (p) {
      objects.push({ type: 'mine_pillar', x: p[0], y: p[1], tex: 'tiang_rahsia' });
    });
    torch(14, 4); torch(29, 4); torch(19, 30); torch(24, 30);
    sign(19, 13, 'Sang Kelembai sleeps ahead. When she draws breath, get a stone pillar between you and her voice.');

    var crystalWest = (season + seed) % 2 === 0;
    [true, false].forEach(function (safe) {
      var west = safe === crystalWest;
      var baseX = west ? 8 : 34, upperX = baseX + random.integerInRange(-2, 2);
      var lowerX = baseX + random.integerInRange(-2, 2);
      var upperY = random.integerInRange(18, 19), lowerY = random.integerInRange(25, 26);
      var bend = random.integerInRange(22, 23);

      fill(upperX, upperY, upperX + 1, 14); fill(upperX, 14, 21, 15);
      fill(upperX, upperY, upperX + 1, bend);
      fill(Math.min(upperX, lowerX), bend, Math.max(upperX, lowerX) + 1, bend + 1);
      fill(lowerX, bend, lowerX + 1, 31); fill(lowerX, 31, 21, 32);
      sign(west ? 17 : 26, 30, safe ? 'Crystal gallery. The quieter route leads past a pool and a crystal ledge.' : 'Gold workings. Keep a weapon handy. Bats and scorpions roam these tunnels.');

      var rooms = safe ? ['ledge', 'pool'] : ['rails', 'nest'];
      if (random.frac() < 0.5) rooms.reverse();
      rooms.forEach(function (room, i) {
        var x = i ? lowerX : upperX, y = i ? lowerY : upperY;
        fill(x - 4, y - 2, x + 4, y + 2);
        if (room === 'ledge') {
          fill(x - 3, y - 1, x - 2, y + 1, 'k');
          deposit('gema_crystal_ledge', x - 3, y, 'fg_crystal', { kristal: 2 });
          torch(x + 3, y - 1);
        } else if (room === 'pool') {
          fill(x + 2, y, x + 3, y + 1, 'q');
          deposit('gema_crystal_pool', x - 3, y, 'fg_crystal', { kristal: 1 });
          deposit('gema_hidden', x + 3, y - 1, 'gema_seam', { emas: 2, delima: 1 }, 'glasses');
          torch(x - 3, y - 1);
        } else if (room === 'rails') {
          fill(x - 4, y + 1, x + 4, y + 1, 'l');
          deposit('gema_gold_rails', x + 3, y - 1, 'fg_goldvein', { bijih_emas: 3 });
          deposit('gema_echo', x - 3, y - 1, 'gema_seam', { batu_gema: 1 });
          enemies.push({ kind: 'kelawar', n: 2, zone: { x0: x - 2, y0: y - 1, x1: x + 2, y1: y + 1 } });
        } else {
          deposit('gema_gold_nest', x - 3, y - 1, 'fg_goldvein', { bijih_emas: 3 });
          enemies.push({ kind: 'kala', n: 2, zone: { x0: x - 2, y0: y - 1, x1: x + 2, y1: y + 1 } });
        }
      });
    });
    return { seed: seed, season: season, grid: grid, objects: objects, enemies: enemies };
  }

  LC.AREAS[ID] = {
    name: 'Laluan Gema', sub: 'the echo passages under Lombong Puaka', lvl: MINE.lvl,
    cave: true, daylit: true, amb: 'cave', ride: {}, home: { x: 21.5, y: 33 }, exits: [EXIT],
    decor: { n: 52, types: ['rubble', 'crystal_s', 'rubble'], on: 'c' },
    layout: function (s) {
      var seed = s ? s.mineSeed >>> 0 : 0, season = Math.floor(((s ? s.day : 1) - 1) / LC.SEASON_DAYS);
      if (!cached || cached.seed !== seed || cached.season !== season) cached = generate(seed, season);
      return cached;
    }
  };

  LC.mineProgress = function (s) {
    return s.quests.minePassages || (s.quests.minePassages = { runs: {}, forge: 0, blessed: false, owed: 0 });
  };
  LC.mineRun = function (s, layout) {
    var runs = LC.mineProgress(s).runs, previous = runs[layout.seed];
    if (previous && previous.season > layout.season) return null;
    if (previous && previous.season === layout.season) return previous;
    return runs[layout.seed] = { season: layout.season, taken: {}, won: false };
  };
})(window.LC);
