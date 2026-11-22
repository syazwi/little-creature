/* Little Creature — v1.8: a home that grows, helpers to hire, a bigger bag, Pelita up to Lv 30, and new folk in the dunes.
 *  - Nenek's house grows in three stages (lots of kepeng and materials; Tukang Leong and the kampung build each one
 *    overnight, or at once with Badang): a verandah and a pantry, a middle room, and a grand kitchen wing.
 *  - Each stage makes room for helpers, paid every morning: Mak Som cooks from the pantry, Pak Hamid waters,
 *    harvests and replants the field, and Kak Nur picks the farm's fruit and collects the eggs and milk.
 *  - Your bag grows by a row of 9 at Pelita Lv 5, 10, 15, 20, 25 and 30 (18 -> 72), and Pelita can now reach Lv 30.
 *  - Bukit Pasir: Mak Thuy, a Cham potter by the old tower (pots from your clay, and the tower's brick path to
 *    restore), and Pak Tam, a dragon-fruit farmer (cuttings to grow on your farm, and good prices for the fruit). */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  function addItems(map) { Object.keys(map).forEach(function (id) { var it = map[id]; it.id = id; it.icon = it.icon || 'i_' + id; LC.ITEMS[id] = it; }); }

  // ================================================================ items, a crop and a recipe
  addItems({
    almari: { name: 'Almari Dapur', kind: 'fixture', desc: 'Nenek\'s kitchen pantry. Your helpers put what they gather here, and the cook takes her ingredients from it.' },
    almari_besar: { name: 'Almari Besar', kind: 'fixture', desc: 'The big pantry of the new kitchen wing.' },
    periuk_tanah: { name: 'Periuk Tanah', kind: 'craft', sell: 110, desc: 'A round clay cooking pot, shaped by hand and fired in an open fire, the old Cham way.' },
    tempayan: { name: 'Tempayan', kind: 'craft', sell: 320, desc: 'A great water jar from Mak Thuy\'s fire. The new kitchen wing of Nenek\'s house needs two.' },
    pelita_tanah: { name: 'Pelita Tanah', kind: 'offering', glow: 35, joy: 8, bond: 6, sell: 40, desc: 'A little clay oil lamp. Pelita adores it: it looks like a tiny house for a flame.' },
    seed_buahnaga: { name: 'Keratan Buah Naga', kind: 'seed', crop: 'buahnaga', price: 60, desc: 'A dragon-fruit cutting from Pak Tam. 6 days, 3 fruit. It loves the heat: Musim Kemarau and Musim Menanam.' },
    jus_buah_naga: { name: 'Jus Buah Naga', kind: 'drink', price: 90, sell: 120, food: { full: 10, joy: 24 }, desc: 'Shocking-pink dragon-fruit juice. Sweet and cold.' }
  });
  LC.CROPS.buahnaga = { name: 'Buah Naga', days: 6, item: 'buah_naga', count: 3, seasons: ['kemarau', 'menanam'] };
  LC.RECIPES.push({ out: 'jus_buah_naga', inp: { buah_naga: 2 } });
  LC.CHESTS.almari = { slots: 24 }; LC.CHESTS.almari_besar = { slots: 48 };
  LC.FIXED_ITEMS = { hoe: 1, can: 1, joran: 1, cermin_mata: 1, keris: 1, trisula: 1, selendang: 1 };   // never thrown away

  // ================================================================ a bigger bag, and Pelita up to Lv 30
  LC.BAG_LEVELS = [5, 10, 15, 20, 25, 30];
  LC.bagSize = function (lv) { return LC.INV_SIZE + 9 * LC.BAG_LEVELS.filter(function (l) { return lv >= l; }).length; };
  LC.LEVELS = LC.LEVELS.concat([3250, 3750, 4300, 4900, 5550, 6250, 7000, 7800, 8650, 9550]);
  LC.MAX_LEVEL = LC.LEVELS.length;
  LC.LEGEND_LEVEL = 20;
  Object.assign(LC.LEVEL_REWARDS, {
    21: { kepeng: 600, text: 'Pelita found 600 kepeng in Nenek\'s old tin box.' },
    22: { energy: 20, text: '+20 max energy.' },
    23: { item: ['emas', 2], text: 'Pelita brought you two gold nuggets from the river bed.' },
    24: { item: ['pelita_bunian', 2], text: 'The Orang Bunian send you two lamps that never need oil.' },
    25: {},
    26: { kepeng: 900, text: 'Pelita found 900 kepeng in a jar under the stilts.' },
    27: { energy: 20, text: '+20 max energy.' },
    28: { item: ['buah_emas', 2], text: 'Two golden fruits from the Bunian orchards appear on your doorstep.' },
    29: { item: ['kristal', 3], text: 'Pelita brought you three glowing cave crystals.' },
    30: { kepeng: 1500, text: 'Pelita is now the Spirit of the Land! Every river, hill and dune knows its light. (+1500 kepeng)' }
  });
  LC.BAG_LEVELS.forEach(function (l) { var r = LC.LEVEL_REWARDS[l]; r.bag = true; r.text = (r.text ? r.text + ' ' : '') + 'Your bag grows: +9 slots!'; });

  // ================================================================ Nenek's house and the helpers
  LC.HOUSE_STAGES = [
    null,
    { name: 'Serambi', desc: 'A breezy verandah beside the house, and a pantry (Almari Dapur) for your helpers. Room for 1 helper.', kepeng: 2000, cost: { kayu: 20, atap: 10 }, rooms: 1 },
    { name: 'Rumah Tengah', desc: 'A new middle room: the dapur cooks up to 5 dishes at once, and +20 max energy. Room for 2 helpers.', kepeng: 6000, cost: { kayu: 30, batu: 15, atap: 15 }, rooms: 2, energy: 20 },
    { name: 'Rumah Dapur', desc: 'A grand kitchen wing with carved gables: a bigger pantry (48 stacks), and +20 more max energy. Room for all 5 helpers.', kepeng: 15000, cost: { kayu: 40, batu: 20, tanah_liat: 10, tempayan: 2 }, rooms: 5, energy: 20 }
  ];
  LC.OBJECTS.push({ id: 'h_wing', type: 'house_wing', x: 7, y: 3, w: 2, h: 5, tex: 'wing_1', when: function (S) { return (S.house || 0) >= 1; } });
  LC.HOUSE_ZONE = { x0: 7, y0: 2, x1: 9, y1: 7 };   // kept free of grass tufts and bushes, for the new wing
  LC.HELPERS = {
    masak: { name: 'Mak Som', role: 'Tukang Masak (cook)', wage: 80, spot: { x: 6, y: 9 },
      look: { skin: '#a8714a', shirt: '#c8506a', shirt2: '#a03a52', bottom: '#5a3a5a', bottom2: '#42283a', hair: '#1a1210', hat: 'tudung', hatColor: '#f2d0a0' },
      does: 'Every night she cooks up to 5 dishes from the ingredients in the pantry (the best ones she can make) and leaves them there.',
      chat: ['Put rice, eggs, fish and chilli in the almari, and I will do the rest!', 'Nenek\'s recipes are written in pencil inside the almari door. I follow them exactly.', 'A kitchen with no one cooking is the saddest room in a house.'] },
    ladang: { name: 'Pak Hamid', role: 'Pekerja Ladang (farmhand)', wage: 70, spot: { x: 12, y: 12 },
      look: { skin: '#8e5c3a', shirt: '#4a7a8a', shirt2: '#3a5e6a', bottom: '#5a4a3a', bottom2: '#40342a', hair: '#3a3a3a', hat: 'terendak' },
      does: 'Every night he waters the whole field, harvests whatever is ripe into the pantry, and replants it with seeds from the pantry.',
      chat: ['Leave seeds in the almari and I will replant what I harvest.', 'Your soil is good. Nenek looked after it for fifty years.', 'Early to bed, early to the field!'] },
    kutip: { name: 'Kak Nur', role: 'Pengumpul (gatherer)', wage: 50, spot: { x: 3, y: 11 },
      look: { skin: '#c9905e', shirt: '#e9b949', shirt2: '#c4922f', bottom: '#3a6a4a', bottom2: '#2a4e36', hair: '#2a1a10', hat: 'flower' },
      does: 'Every night she picks the ripe fruit on the farm and collects the eggs and milk from the reban, into the pantry.',
      chat: ['The mango tree is generous this week!', 'The hens know me now. They do not even peck me any more.', 'I put the eggs on top, so they do not break.'] },
    pelita: { name: 'Kak Aini', role: 'Penjaga Pelita (Pelita caretaker)', wage: 65, spot: { x: 10, y: 7 },
      look: { skin: '#d79c73', shirt: '#60538b', shirt2: '#443766', bottom: '#385b66', bottom2: '#263e48', hair: '#2a1a10', hat: 'tudung', hatColor: '#d9b0e0' },
      does: 'When Pelita is hungry, she makes or serves one meal from pantry supplies overnight. She tries to satisfy its craving first.',
      chat: ['I check what Pelita is craving before I light the dapur.', 'Pak Hamid and Kak Nur bring things from the farm. You can leave fish and other ingredients in the pantry for me.'] },
    stor: { name: 'Pak Idris', role: 'Penjaga Stor (storekeeper)', wage: 60, spot: { x: 5, y: 10 },
      look: { skin: '#ad7754', shirt: '#3c7070', shirt2: '#295052', bottom: '#7c5135', bottom2: '#583920', hair: '#242124', hat: 'songkok' },
      does: 'He sells goods from the pantry overnight according to the stock limits you set under Pantry Sales. Other helpers use the pantry first.',
      chat: ['Tell me how much of each item to keep in the pantry. I will take the surplus to Mak Ani.', 'Leave the pantry sales list empty and everything stays on the farm.'] }
  };
  LC.HELPER_ORDER = ['masak', 'ladang', 'kutip', 'pelita', 'stor'];

  // shared-world helpers (run by the host or a single player)
  LC.Home = {
    S: function () { return LC.State.s; },
    stage: function () { return LC.State.s.house || 0; },
    rooms: function () { var st = LC.HOUSE_STAGES[this.stage()]; return st ? st.rooms : 0; },
    hiredCount: function () { var h = LC.State.s.helpers || {}; return LC.HELPER_ORDER.filter(function (k) { return h[k]; }).length; },
    wages: function () { var h = LC.State.s.helpers || {}; return LC.HELPER_ORDER.reduce(function (a, k) { return a + (h[k] ? LC.HELPERS[k].wage : 0); }, 0); },
    // the pantry is a fixed, shared chest with no place in the world
    applyStage: function (st) {
      var S = LC.State.s;
      S.chests = S.chests || {};
      if (st >= 1 && !S.chests.pantry) S.chests.pantry = { area: 'home', x: 0, y: 0, kind: 'almari', items: [], fixed: true };
      if (st >= 3 && S.chests.pantry) S.chests.pantry.kind = 'almari_besar';
    },
    pCount: function (id) { var c = LC.State.s.chests.pantry; return c ? c.items.reduce(function (a, sl) { return a + (sl.id === id ? sl.n : 0); }, 0) : 0; },
    pAdd: function (id, n) { return LC.State.s.chests.pantry ? LC.Sim.chest_put({ id: 'pantry', item: id, n: n }).n : 0; },
    pTake: function (id, n) { return LC.State.s.chests.pantry ? LC.Sim.chest_take({ id: 'pantry', item: id, n: n }).n : 0; },
    pantrySalePrice: function (id) {
      var it = LC.ITEMS[id];
      return it && !LC.FIXED_ITEMS[id] && it.sell > 0 ? it.sell : 0;
    },
    sellSurplus: function (s, lines) {
      var self = this, sales = s.pantrySales, earned = 0, sold = [];
      Object.keys(sales).forEach(function (id) {
        var price = self.pantrySalePrice(id), keep = sales[id];
        if (!price || !Number.isInteger(keep) || keep < 0) return;
        var surplus = self.pCount(id) - keep;
        if (surplus <= 0) return;
        var count = self.pTake(id, surplus);
        if (count) { earned += count * price; sold.push(count + ' ' + LC.ITEMS[id].name); }
      });
      if (earned) {
        s.kepeng += earned; s.stats.earned += earned;
        lines.push('Pak Idris sold ' + sold.join(', ') + ' for ' + earned + ' kepeng.');
      }
    },
    feedPelita: function (s, lines) {
      var g = s.ghost, self = this;
      if (g.full >= 60 || LC.pelitaAway()) return;
      function rank(id) {
        if (id === g.craving && !g.cravingDone) return 0;
        if (LC.LOVES.indexOf(id) >= 0) return 1;
        var it = LC.ITEMS[id];
        return it.kind === 'dish' || it.kind === 'drink' ? 2 : 3;
      }
      var meals = new Map();
      s.chests.pantry.items.forEach(function (slot) {
        var it = LC.ITEMS[slot.id];
        if (it && it.food && LC.DISLIKES.indexOf(slot.id) < 0) meals.set(slot.id, null);
      });
      LC.RECIPES.forEach(function (r) {
        if (LC.ITEMS[r.out].food && LC.DISLIKES.indexOf(r.out) < 0 && !meals.has(r.out) &&
            Object.keys(r.inp).every(function (id) { return self.pCount(id) >= r.inp[id]; })) meals.set(r.out, r.inp);
      });
      var id = Array.from(meals.keys()).sort(function (a, b) { return rank(a) - rank(b) || LC.ITEMS[b].food.full - LC.ITEMS[a].food.full; })[0];
      if (!id) { lines.push('Kak Aini needs food or cooking ingredients in the pantry for Pelita.'); return; }
      var recipe = meals.get(id), used = recipe || { [id]: 1 };
      var result = LC.Sim.feed({ item: id });
      if (!result.ok) return;
      Object.keys(used).forEach(function (item) { self.pTake(item, used[item]); });
      s.flags.fedOnce = true;
      lines.push('Kak Aini ' + (recipe ? 'made' : 'served') + ' ' + LC.ITEMS[id].name + ' for Pelita.' + (result.craving ? ' Its craving was satisfied!' : ''));
    },
    // dusk (before the crops grow): pay the wages; the farmhand waters the field
    dusk: function (s, lines) {
      var h = s.helpers || {}, work = {}, unpaid = [], paid = 0;
      LC.HELPER_ORDER.forEach(function (k) {
        if (!h[k]) return;
        var w = LC.HELPERS[k].wage;
        if (s.kepeng >= w) { s.kepeng -= w; paid += w; work[k] = true; } else unpaid.push(LC.HELPERS[k].name);
      });
      if (paid) lines.push('You paid your helpers ' + paid + ' kepeng in wages.');
      if (unpaid.length) lines.push('You could not pay ' + unpaid.join(' and ') + ', so they took the night off.');
      if (work.ladang) {
        var n = 0;
        Object.keys(s.tiles).forEach(function (k) { var t = s.tiles[k]; if (t.tilled && !t.wet) { t.wet = true; n++; } });
        work.watered = n;
      }
      return work;
    },
    // dawn: gather fresh ingredients, feed Pelita, cook, then sell pantry surplus
    dawn: function (s, lines, work) {
      var self = this, full = false;
      if (s.houseBuild) {
        s.house = s.houseBuild; s.houseBuild = 0; this.applyStage(s.house);
        lines.push('Tukang Leong and the kampung finished Nenek\'s ' + LC.HOUSE_STAGES[s.house].name + ' overnight! The house has room for ' + LC.HOUSE_STAGES[s.house].rooms + ' helper' + (s.house > 1 ? 's' : '') + ' now.');
      }
      if (!work || !s.chests || !s.chests.pantry) return;
      function store(id, n) { var put = self.pAdd(id, n); if (put < n) full = true; return put; }
      if (work.ladang) {
        var got = 0, again = 0;
        Object.keys(s.tiles).forEach(function (key) {
          var t = s.tiles[key], c = t.crop && LC.CROPS[t.crop.id];
          if (!c || t.crop.g < c.days) return;
          var n = c.count + (c.paddy && LC.State.friend('semangat') ? 2 : 0), id = t.crop.id;
          got += store(c.item, n); t.crop = null;
          var seed = Object.keys(LC.ITEMS).filter(function (k) { return LC.ITEMS[k].crop === id; })[0];
          if (seed && self.pCount(seed) > 0 && self.pTake(seed, 1)) { t.crop = { id: id, g: 0 }; again++; }
        });
        lines.push('Pak Hamid watered the field' + (work.watered ? '' : ' (it was already wet)') + (got ? ' and harvested ' + got + ' crops into the pantry' + (again ? ', replanting ' + again : '') : '') + '.');
      }
      if (work.kutip) {
        var picked = 0;
        LC.OBJECTS.forEach(function (o) {
          if ((o.type !== 'tree' && o.type !== 'forage') || s.trees[o.id] !== 0) return;
          var r = LC.Sim.shake({ id: o.id });
          if (r && r.item) { picked += store(r.item, r.count); if (r.extra) store(r.extra, 1); }
        });
        var coop = s.coop || {}, eggs = 0;
        ['telur', 'telur_itik', 'susu'].forEach(function (id) { if (coop[id]) { var put = store(id, coop[id]); coop[id] -= put; eggs += put; } });
        if (picked || eggs) lines.push('Kak Nur picked ' + picked + ' fruit' + (eggs ? ' and collected ' + eggs + ' eggs and milk' : '') + ' into the pantry.');
      }
      if (work.pelita) this.feedPelita(s, lines);
      if (work.masak) {
        var made = {}, total = 0, progress = true;
        var recipes = LC.RECIPES.slice().sort(function (a, b) { return (LC.ITEMS[b.out].sell || 0) - (LC.ITEMS[a.out].sell || 0); });
        while (total < 5 && progress && !full) {
          progress = false;
          for (var i = 0; i < recipes.length && total < 5; i++) {
            var r = recipes[i], inp = r.inp;
            if ((made[r.out] || 0) >= 2 || !Object.keys(inp).every(function (id) { return self.pCount(id) >= inp[id]; })) continue;
            Object.keys(inp).forEach(function (id) { self.pTake(id, inp[id]); });
            if (self.pAdd(r.out, 1) < 1) { Object.keys(inp).forEach(function (id) { self.pAdd(id, inp[id]); }); full = true; break; }
            made[r.out] = (made[r.out] || 0) + 1; total++; progress = true;
          }
        }
        lines.push(total ? 'Mak Som cooked ' + Object.keys(made).map(function (id) { return made[id] + ' ' + LC.ITEMS[id].name; }).join(', ') + '. They are in the pantry.'
          : 'Mak Som found nothing to cook in the pantry. Leave her some ingredients!');
      }
      if (work.stor) this.sellSurplus(s, lines);
      if (full) lines.push('The pantry was full, so some things could not be stored. Empty it a little!');
    }
  };

  // ================================================================ Bukit Pasir: the potter and the dragon-fruit farmer
  Object.assign(LC.VILLAGERS, {
    thuy: {
      name: 'Mak Thuy', role: 'Cham potter', area: 'desert', post: { x: 31, y: 7 },
      look: { skin: '#b9825a', shirt: '#8a2a3a', shirt2: '#6a1e2c', bottom: '#2a2a4a', bottom2: '#1e1e36', hair: '#1a1210', hat: 'tudung', hatColor: '#e8d8b0' },
      intro: [
        'Ah, a visitor in the dunes! Come out of the sun. I am Mak Thuy. My people are the Cham, and my family has made pots for longer than anyone remembers.',
        'We do not use a wheel. I walk around the pot, round and round, shaping the clay with my hands. Then we fire it in the open, with straw and wood.',
        'Bring me clay from the dunes and a little firewood, and I will make pots for you. And that old tower... my grandmother told me so many stories about it.'
      ],
      chat: ['The clay here is red because the sun has been kissing it for a thousand years.', 'A pot remembers the hands that made it.', 'My daughter wants to learn. Her pots still lean a little. Mine did too, once.', 'When the wind blows from the sea, the tower hums. Can you hear it?'],
      tasks: [['tanah_liat', 2, 4], ['kayu', 3, 5], ['buah_naga', 1, 2], ['nasi', 1, 2]],
      taskText: 'for her pottery', buys: { items: ['tanah_liat', 'duit_lama', 'periuk_tanah'], mult: 1.3 },
      gifts: { 3: ['periuk_tanah', 2], 6: ['tempayan', 1], 10: ['kepeng', 900] }
    },
    tam: {
      name: 'Pak Tam', role: 'Dragon-fruit farmer', area: 'desert', post: { x: 15, y: 13 },
      look: { skin: '#c9905e', shirt: '#6a8a3a', shirt2: '#4e6a2a', bottom: '#3a3a3a', bottom2: '#2a2a2a', hair: '#2a2a2a', hat: 'nonla' },
      intro: [
        'Chao! Hello! I am Pak Tam. I came from a dragon-fruit village far up the coast, where the land is just as dry as this.',
        'Dragon fruit is a cactus, you know. It loves the sun and hates wet feet. These dunes suit it perfectly!',
        'I sell cuttings you can grow on your farm, in the hot season and the planting season. And I pay well for good fruit.'
      ],
      chat: ['The flowers open only at night, big and white like the moon. Then they are gone by morning.', 'Pink outside, white or red inside. Life is full of surprises!', 'Never water a cactus too much. Same with people: give them room.', 'Jus buah naga with ice... the best thing in a hot afternoon.'],
      tasks: [['buah_naga', 3, 5], ['kelapa', 1, 2], ['tembikai', 1, 1], ['jagung', 2, 3]],
      taskText: 'for the market', shop: ['seed_buahnaga', 'jus_buah_naga'], buys: { items: ['buah_naga', 'jus_buah_naga', 'tembikai', 'nanas'], mult: 1.4 },
      gifts: { 3: ['seed_buahnaga', 4], 6: ['jus_buah_naga', 3], 10: ['kepeng', 900] }
    }
  });
  LC.AREAS.desert.objects.push(
    { id: 'd_tembikar', type: 'bldg', x: 28, y: 6, w: 2, h: 1, tex: 'tembikar', keep: true, text: 'Mak Thuy\'s pottery yard: round pots drying in the sun, and a ring of blackened stones where she fires them in the open, with straw and wood.' },
    { id: 'd_gerai_naga', type: 'bldg', x: 12, y: 11, w: 2, h: 1, tex: 'gerai_naga', keep: true, text: 'Pak Tam\'s little stall: a bamboo table piled with dragon fruit, and a hand-painted sign: BUAH NAGA SEGAR (fresh dragon fruit).' }
  );
  // Mak Thuy's pots: what she makes from your clay
  LC.POTS = [
    { out: 'periuk_tanah', inp: { tanah_liat: 2, kayu: 1 }, kepeng: 20 },
    { out: 'pelita_tanah', inp: { tanah_liat: 1 }, kepeng: 10 },
    { out: 'tempayan', inp: { tanah_liat: 4, kayu: 2 }, kepeng: 80 }
  ];
  // the old brick path to the tower, buried by the sand
  LC.TOWER_QUEST = { tanah_liat: 8, kayu: 4, duit_lama: 3 };
  LC.TOWER_PATH = { x0: 34, y0: 6, x1: 35, y1: 11 };
  LC.syncDesert = function () {
    var S = LC.worldS ? LC.worldS() : LC.State.s, g = LC.areaGrid('desert'), P = LC.TOWER_PATH, ch = S && S.quests && S.quests.menara ? 'k' : 'd';   // (v2.7.1: shared looks)
    for (var y = P.y0; y <= P.y1; y++) for (var x = P.x0; x <= P.x1; x++) g[y][x] = ch;
  };
  LC.THUY = {
    ask: [
      'You see the old tower? Its brick path is buried in sand, and the last bricks are cracked. Every year, families walk up to it to remember their grandparents.',
      'I would like to make new bricks, the old way. Bring me 8 tanah liat and 4 kayu for the fire.',
      'And the old coins you dig up in the dunes: they are part of the tower\'s story. The elders keep a little shelf of old things by the door, so the children can learn. Bring me 3 of them too.'
    ],
    done: [
      'Look at that! Brick by brick, the old path is back. My grandmother would be so happy.',
      'The coins will go on the shelf by the door, with a little card that says who found them. Thank you, child.',
      '✦ The brick path to the old tower is restored! (+600 kepeng, 3 Pelita Tanah) ✦'
    ]
  };
  Object.assign(LC.TEXT, {
    house_wing: 'Nenek\'s house, growing bigger.'
  });
})(window.LC);
// the helpers' work spots count as villager posts on the farm (so chests are never put down on them)
(function (LC) {
  var posts = LC.villagerPosts;
  LC.villagerPosts = function (area) { var out = posts(area); if (area === 'farm') LC.HELPER_ORDER.forEach(function (k) { out.push(LC.HELPERS[k].spot); }); return out; };
})(window.LC);
