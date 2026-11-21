/* Little Creature — v2.9: Lombong Puaka goes deeper. The user asked for the mine to be twice as big, with an invisible
 * door that only the Bunian glasses can show, leading to a secret boss who pays out gold and rare things.
 *  - Tingkat Bawah, the lower workings (rows 34-67), down the old lift shaft under the stone guardian's hall: the
 *    crossroads, the crystal grotto, the black pool, the miners' old camp, the gold hollow, the scorpion nest, the deep
 *    gallery, and at the very end of the mine a small empty chamber
 *  - in that chamber's north wall, a door the Orang Bunian made in 1931 to seal what the miners found. Only seen through
 *    the Cermin Mata Bunian (an object with hidden: 'glasses', like the Bunian gate in Hutan Rimba)
 *  - Bilik Rahsia, the hidden vault behind it, and the Puaka Emas: the spirit of the mine's gold, gathered into a body.
 *    It fights with falling ore, calls the shadows of the mine to help it, and grows wild when it is nearly beaten.
 *    It can be beaten once a day; the first time pays the most (fought in scenes/WorldLombong.js)
 * The upper mine keeps every old place (rows 0-32), so nothing in a saved game moves. Personal to each player. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var L = LC.AREAS.lombong, TOP = 34;   // the old mine was 34 rows; the new one is twice as deep

  function carver(g) {
    var H = g.length, W = g[0].length;
    function put(x, y, ch) { if (y >= 0 && y < H && x >= 0 && x < W) g[y][x] = ch; }
    return {
      fill: function (x0, y0, x1, y1, ch) { for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) put(x, y, ch); },
      ell: function (cx, cy, rx, ry, ch) {
        for (var y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (var x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
          var dx = (x - cx) / rx, dy = (y - cy) / ry;
          if (dx * dx + dy * dy <= 1) put(x, y, ch);
        }
      }
    };
  }

  // ------------------------------------------------------------------ the lower workings
  var buildTop = L.build;
  L.build = function () {
    var top = buildTop.apply(this, arguments), W = top[0].length, g = [], y;
    for (y = 0; y < TOP * 2; y++) g.push(y < top.length ? top[y].slice() : new Array(W).fill('X'));
    var f = carver(g);
    f.fill(21, 32, 22, 37, 'c');                                  // the old lift shaft, down from the guardian's hall
    f.ell(21.5, 40, 6, 2.6, 'c');                                 // Simpang Tiga, the crossroads
    f.fill(5, 39, 16, 41, 'c'); f.fill(6, 40, 15, 40, 'l');       // the west gallery and its rails
    f.fill(27, 39, 38, 41, 'c'); f.fill(28, 40, 37, 40, 'l');     // the east gallery
    f.ell(8, 47, 5.5, 5, 'c');                                    // Gua Kristal, the crystal grotto
    f.ell(35, 47, 5.5, 5, 'c'); f.ell(36, 48, 2.4, 1.6, 'q');     // Kolam Hitam, the black pool
    f.ell(21.5, 49, 6.5, 3.4, 'c'); f.fill(20, 42, 23, 46, 'c');  // the miners' old camp
    f.fill(13, 49, 15, 50, 'c'); f.fill(28, 49, 30, 50, 'c');
    f.fill(7, 52, 8, 56, 'c'); f.fill(35, 52, 36, 56, 'c');       // two ways further down
    f.ell(10, 59, 5.5, 3.4, 'c');                                 // Lubang Emas, the gold hollow
    f.ell(33, 59, 5.5, 3.4, 'c');                                 // Sarang Kala, the scorpion nest
    f.fill(12, 64, 31, 65, 'c'); f.fill(13, 65, 30, 65, 'l');     // the deep gallery
    f.fill(9, 62, 12, 65, 'c'); f.fill(31, 62, 34, 65, 'c');
    f.ell(21.5, 59, 3.6, 2.4, 'c'); f.fill(21, 61, 22, 63, 'c');  // Hujung Lombong, the end of the mine
    return g;
  };
  L.objects.push(
    { id: 'l_sign2', type: 'signpost', x: 24, y: 39, w: 1, h: 1, tex: 'sign', text: 'TINGKAT BAWAH (the lower workings). The deep seams are the richest in the mine. So are the shadows.' },
    { id: 'g_vein13', type: 'forage', kind: 'goldvein', x: 4, y: 47 }, { id: 'g_vein14', type: 'forage', kind: 'goldvein', x: 11, y: 51 },
    { id: 'g_vein15', type: 'forage', kind: 'goldvein', x: 39, y: 46 }, { id: 'g_vein16', type: 'forage', kind: 'goldvein', x: 31, y: 50 },
    { id: 'g_vein17', type: 'forage', kind: 'goldvein', x: 6, y: 57 }, { id: 'g_vein18', type: 'forage', kind: 'goldvein', x: 14, y: 58 },
    { id: 'g_vein19', type: 'forage', kind: 'goldvein', x: 29, y: 58 }, { id: 'g_vein20', type: 'forage', kind: 'goldvein', x: 37, y: 57 },
    { id: 'g_vein21', type: 'forage', kind: 'goldvein', x: 13, y: 64 }, { id: 'g_vein22', type: 'forage', kind: 'goldvein', x: 30, y: 64 },
    { id: 'g_vein23', type: 'forage', kind: 'goldvein', x: 19, y: 42 }, { id: 'g_vein24', type: 'forage', kind: 'goldvein', x: 36, y: 39 },
    { id: 'g_crys4', type: 'forage', kind: 'crystal', x: 6, y: 44 }, { id: 'g_crys5', type: 'forage', kind: 'crystal', x: 10, y: 49 },
    { id: 'g_crys6', type: 'forage', kind: 'crystal', x: 33, y: 44 }, { id: 'g_crys7', type: 'forage', kind: 'crystal', x: 36, y: 61 },
    { id: 'g_chest2', type: 'forage', kind: 'goldchest', x: 10, y: 61 },
    { id: 'l_khemah', type: 'bldg', x: 17, y: 47, w: 2, h: 1, tex: 'khemah_tent', text: 'The miners\' old tent, its canvas stiff with age. Inside: a rusty kettle and two tin cups, as if someone meant to come back for tea.' },
    { id: 'l_cart3', type: 'bldg', x: 26, y: 48, w: 1, h: 1, tex: 'kereta_lombong', text: 'An ore cart, tipped on its side. The gold it carried is long gone.' },
    { id: 'l_nota', type: 'bldg', x: 24, y: 58, w: 1, h: 1, tex: 'beliung_lama', text: '' },   // (its text changes: WorldLombong.js)
    { id: 'l_pintu', type: 'pintu_rahsia', x: 21, y: 57, w: 2, h: 1, tex: 'pintu_rahsia', hidden: 'glasses', keep: true },
    { type: 'torch', x: 17, y: 39 }, { type: 'torch', x: 26, y: 39 }, { type: 'torch', x: 8, y: 43 }, { type: 'torch', x: 35, y: 43 },
    { type: 'torch', x: 24, y: 47 }, { type: 'torch', x: 10, y: 56 }, { type: 'torch', x: 33, y: 56 }, { type: 'torch', x: 17, y: 64 }, { type: 'torch', x: 26, y: 64 }
  );
  L.enemies = L.enemies.concat([
    { kind: 'kelawar', n: 3, zone: { x0: 6, y0: 38, x1: 37, y1: 41 } },
    { kind: 'bayang', n: 3, zone: { x0: 3, y0: 43, x1: 13, y1: 52 } },
    { kind: 'bayang', n: 2, zone: { x0: 30, y0: 43, x1: 40, y1: 52 } },
    { kind: 'lipan', n: 3, zone: { x0: 5, y0: 56, x1: 15, y1: 62 } },
    { kind: 'kala', n: 3, zone: { x0: 28, y0: 56, x1: 38, y1: 62 } },
    { kind: 'bayang', n: 2, zone: { x0: 12, y0: 63, x1: 31, y1: 65 } }
  ]);
  L.decor.n = 104;
  L.endRoom = { x0: 18, y0: 57, x1: 25, y1: 61 };   // where Pelita notices the door you cannot see

  // ------------------------------------------------------------------ Bilik Rahsia, the hidden vault
  function buildVault() {
    var W = 32, H = 24, g = [], y;
    for (y = 0; y < H; y++) g.push(new Array(W).fill('X'));
    var f = carver(g);
    f.ell(16, 11, 13, 8.6, 'c');      // the cave around the hall
    f.ell(16, 11, 9.5, 6, 'k');       // the old paved floor
    f.fill(15, 19, 16, 23, 'c');      // the way back out, to the door
    return g;
  }
  var VAULT_OBJECTS = [
    { id: 'r_tiang1', type: 'bldg', x: 9, y: 7, w: 1, h: 1, tex: 'tiang_rahsia', keep: true, text: 'A pillar of black stone banded with gold, older than the mine. Bunian flowers are carved into it.' },
    { id: 'r_tiang2', type: 'bldg', x: 22, y: 7, w: 1, h: 1, tex: 'tiang_rahsia', keep: true, text: 'A pillar of black stone. The carvings show miners with lamps, digging, and something rising from the gold.' },
    { id: 'r_tiang3', type: 'bldg', x: 9, y: 15, w: 1, h: 1, tex: 'tiang_rahsia', keep: true, text: 'A pillar of black stone. Someone has scratched a tally of days into it, and stopped.' },
    { id: 'r_tiang4', type: 'bldg', x: 22, y: 15, w: 1, h: 1, tex: 'tiang_rahsia', keep: true, text: 'A pillar of black stone, cold as a river stone in the morning.' },
    { id: 'r_timbun1', type: 'timbun', x: 4, y: 10, w: 2, h: 1, tex: 'timbun_emas', light: 0xffd070 },
    { id: 'r_timbun2', type: 'timbun', x: 26, y: 10, w: 2, h: 1, tex: 'timbun_emas', light: 0xffd070 },
    { id: 'r_timbun3', type: 'timbun', x: 6, y: 16, w: 2, h: 1, tex: 'timbun_emas', light: 0xffd070 },
    { id: 'r_timbun4', type: 'timbun', x: 24, y: 16, w: 2, h: 1, tex: 'timbun_emas', light: 0xffd070 },
    { id: 'r_timbun5', type: 'timbun', x: 10, y: 4, w: 2, h: 1, tex: 'timbun_emas', light: 0xffd070 },
    { id: 'r_timbun6', type: 'timbun', x: 20, y: 4, w: 2, h: 1, tex: 'timbun_emas', light: 0xffd070 },
    { type: 'torch', x: 6, y: 6 }, { type: 'torch', x: 25, y: 6 }, { type: 'torch', x: 12, y: 18 }, { type: 'torch', x: 19, y: 18 }
  ];
  LC.AREAS.rahsia = {
    name: 'Bilik Rahsia', sub: 'the hidden vault under Lombong Puaka', lvl: L.lvl, build: buildVault, objects: VAULT_OBJECTS,
    pond: null, amb: 'cave', cave: true, vault: true, critters: [], ride: {},
    decor: { n: 30, types: ['syiling_s', 'syiling_s', 'rubble', 'crystal_s', 'syiling_s'], on: 'c' },
    enemies: [{ kind: 'puaka_emas', n: 1, zone: { x0: 12, y0: 5, x1: 19, y1: 8 } }],
    exits: [{ x0: 15, y0: 23, x1: 16, y1: 23, to: 'lombong', sx: 21.5, sy: 58.2, dir: 'down' }],
    home: { x: 15.5, y: 20 }, chest: { x: 15, y: 6 }
  };
  LC.AREA_HOWTO.rahsia = 'Somewhere at the very end of Lombong Puaka there is a door that only Bunian eyes can see.';

  // ------------------------------------------------------------------ the Puaka Emas, and what it guards
  LC.ENEMIES.puaka_emas = { name: 'Puaka Emas', hp: 110, speed: 20, dmg: 13, sight: 300, w: 13, boss: true, floaty: true, drop: [] };
  LC.PUAKA = {
    rock: { cd: 4.2, rageCd: 2.8, warn: 0.95, r: 14, dmg: 9, n: 3, rageN: 4, spread: 56 },   // ore falling from the roof
    summonAt: [0.7, 0.4], adds: 3,          // at these shares of its health it calls the shadows (3 bayang)
    rageAt: 0.35, rageSpeed: 1.45,          // and below this it grows wild: faster, and more ore falls
    first: { kepeng: 5000, items: [['mahkota_emas', 1], ['emas', 8], ['delima', 3], ['mutiara', 2], ['kristal', 3]] },
    again: { kepeng: [800, 1400], emas: [2, 3], delima: 0.6, rare: ['mutiara', 'kristal', 'pinggan_lama', 'buah_emas'] }
  };
  LC.ITEMS.mahkota_emas = { id: 'mahkota_emas', icon: 'i_mahkota_emas', name: 'Mahkota Emas', kind: 'treasure', sell: 2500,
    desc: 'A golden crown from the hidden vault under Lombong Puaka, set with red delima stones. Fit for a raja of long ago.' };
  LC.ITEMS.delima = { id: 'delima', icon: 'i_delima', name: 'Batu Delima', kind: 'treasure', sell: 450,
    desc: 'A deep red ruby from the hidden vault. It glows like an ember in the dark.' };
  // the treasure buyers take the vault's treasures too
  [LC.VILLAGERS.melur, LC.VILLAGERS.berbai].forEach(function (v) { if (v && v.buys) v.buys.items = v.buys.items.concat(['delima', 'mahkota_emas']); });
  if (LC.VILLAGERS.melur) LC.VILLAGERS.melur.chat = LC.VILLAGERS.melur.chat.concat(['The miners of 1931 dug deeper than gold. Our elders closed what they found, with a door only our eyes can see. Hm. You have our eyes now, kan?']);

  // what the vault's chest holds after a win (the first time pays the most)
  LC.puakaLoot = function (first) {
    var P = LC.PUAKA, out = [];
    function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
    if (first) { out.push(['kepeng', P.first.kepeng]); P.first.items.forEach(function (it) { out.push([it[0], it[1]]); }); return out; }
    out.push(['kepeng', rnd(P.again.kepeng[0], P.again.kepeng[1])]);
    out.push(['emas', rnd(P.again.emas[0], P.again.emas[1])]);
    if (Math.random() < P.again.delima) out.push(['delima', 1]);
    out.push([P.again.rare[Math.floor(Math.random() * P.again.rare.length)], 1]);
    return out;
  };
  // the player's own record (quests travel with a co-op guest): day beaten, wins, what is still in the chest
  LC.puakaQ = function () { var Q = LC.State.s.quests; return Q.puaka || (Q.puaka = { day: 0, won: 0, chest: [] }); };

  LC.LOMBONG_TEXT = {
    nota: 'An old pickaxe and a miner\'s lamp, left against the wall. Scratched into the lamp: "1931. We broke into a hall of gold that was not ours, and something in the gold woke up. The Bunian folk came in the night and closed the wall, with a door only their eyes can see. Leave it be."',
    notaSeen: 'The old pickaxe and lamp. Through the Bunian glasses, the wall behind them is not a wall at all.',
    feel: 'A cold draught breathes from the bare north wall, as if there were a gap in it. (Something hidden? Something only the Bunian could see...)',
    feelNone: 'A cold draught breathes from the bare north wall, as if there were a gap in it. Whatever is there, your eyes cannot see it.',
    feelPelita: 'Pelita flickers and stares at the bare north wall. ',
    door: 'A door of black stone and gold, carved with Bunian flowers, set into the rock where there was only wall a moment ago. Cold air and a faint golden light come from the gap beneath it.',
    doorAsk: 'Push the hidden door open?',
    enter: [
      { text: 'The door swings open without a sound. Beyond it, a hall of carved pillars, and gold: heaps and heaps of old gold, glowing in the dark.' },
      { text: 'Then the biggest heap stirs. Coins slide and clink. They rise, and gather, and two embers open in the dark like eyes.' },
      { name: 'Pelita', portrait: 'ghost', expr: 'sad', text: '(Pelita shrinks behind your shoulder. This is the Puaka Emas: all the gold the miners ever dug here, and all their wanting, given a body.)' },
      { text: 'It does not want to share. Beat it, and the vault\'s old chest is yours. (Falling ore leaves a shadow on the ground first: step out of it!)' }
    ],
    again: [{ text: 'The heaps of gold stir, and the Puaka Emas rises again, slower to wake than before but no kinder.' }],
    calm: 'The vault is still. The Puaka Emas lies scattered as gold dust in the heaps, and will not gather itself again until tomorrow.',
    calls: 'The Puaka Emas roars, and the shadows of the mine come to its call!',
    wild: 'The Puaka Emas burns bright and wild! The roof is shaking: watch for falling ore!',
    down: [
      { text: 'The Puaka Emas shudders. Its coins come loose, one by one, then all at once, and it falls apart into a rain of gold dust that settles softly over the heaps.' },
      { text: 'The air in the vault grows warm. At the far end of the hall, an old chest you had not noticed before glints in the light.' }
    ],
    downFirst: { name: 'Pelita', portrait: 'ghost', expr: 'happy', text: '(Pelita blazes with pride. The Bunian sealed this place because no one could stand against the Puaka Emas. You just did!)' },
    downAgain: { name: 'Pelita', portrait: 'ghost', expr: 'happy', text: '(Pelita spins happily around you. Beaten again!)' },
    heap: 'A heap of old coins and broken jewellery. It is cold to the touch, and seems to be watching you.',
    heapCalm: 'The gold lies still now. It belongs to the mine and to the Bunian who guard it: you take only what the chest gives you.',
    chest: 'You lift the heavy lid of the vault\'s chest...',
    chestFull: 'Your bag is full! The rest waits in the chest: make room and come back for it.',
    battles: ' You found the hidden vault and beat the Puaka Emas'
  };
})(window.LC);
