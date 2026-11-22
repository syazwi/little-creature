/* Chapter 12. The rescue at Storm Reef and the voyages that follow it. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  function grid(w, h) { return Array.from({ length: h }, function () { return new Array(w).fill('o'); }); }
  function fill(g, x0, y0, x1, y1, tile) {
    for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) g[y][x] = tile;
  }
  var decor = { n: 0, types: [], on: '.' };
  var signals = [[29, 9], [62, 10], [63, 36], [40, 44], [15, 42], [18, 22]];
  var rare = ['mutiara', 'kristal', 'batu_delima', 'serpihan_ribut'];
  var prize = [['serpihan_ribut', 1], ['belian', 3], ['kristal', 2], ['mutiara', 1], ['kepeng', 800]];
  LC.C12 = {
    end: 5, ready: function (S) { return (S.quests.ch11 || 0) >= LC.CH11_END; },
    step: function (S) { return S.quests.ch12 || 0; },
    dock: { x: 22, y: 28 }, port: { x: 8, y: 29 }, rival: { x: 38, y: 26 }, reef: { x: 57, y: 30 },
    crews: [{ x: 57, y: 27 }, { x: 60, y: 29 }, { x: 58, y: 33 }],
    eye: { x: 23, y: 13 },
    encounter: function (S) {
      var n = S.quests.stormVoyage || 0;
      var roll = Math.imul((S.mineSeed >>> 0) ^ (n + 41), 2654435761) >>> 0;
      roll = (roll ^ roll >>> 16) >>> 0;
      var p = signals[(roll % (signals.length / 2)) * 2 + n % 2];
      return { kind: (roll >>> 7) % 2 ? 'wreck' : 'kraken', x: p[0], y: p[1], item: rare[(roll >>> 12) % rare.length] };
    },
    bonus: function (S) {
      var drop = prize[Math.floor(Math.random() * prize.length)], id = drop[0], count = drop[1];
      if (id !== 'kepeng' && LC.State.room(id) >= count && LC.State.add(id, count)) return { text: count + ' ' + LC.ITEMS[id].name, icon: LC.ITEMS[id].icon };
      count = id === 'kepeng' ? count : 400;
      S.kepeng += count; S.stats.earned += count;
      return { text: count + ' kepeng', icon: 'i_kepeng' };
    }
  };
  var C = LC.C12;
  LC.ITEMS.serpihan_ribut = { id: 'serpihan_ribut', icon: 'i_serpihan_ribut', name: 'Serpihan Ribut', kind: 'material', sell: 680,
    desc: 'A rare shard of green sea glass worn smooth by the currents around Storm Reef.' };
  LC.SPEAKERS.jack12 = { name: 'Jack Separaw', portrait: 'npc_jack12_0' };
  LC.CH12TEXT = {
    meet: [
      { who: 'mat', text: 'Three fishing boats never came back from Storm Reef. Their families have been at this jetty all morning.' },
      { who: 'jack12', text: 'They are stranded beyond the reef. I know a passage. I drew it right here on my old sail.' },
      { who: 'jack12', text: 'There is a chest in the wreck beside them. Years I have chased that gold. Lend me Pelita\'s light and I will get you to the fishers.' },
      { text: 'You agree to the bargain. Use the vinta at the jetty when you are ready.' }
    ],
    chase: [
      { who: 'jack12', text: 'See that column of spray? A waterspout. Keep to calmer water and watch the heading on your Pedoman.' },
      { who: 'jack12', text: 'And that striped sail is following my chart. Close with them. I will help you take the deck.' }
    ],
    board: [{ who: 'jack12', text: 'Easy on the ropes, captain. It is the deck we want. Let us give their crew a reason to surrender.' }],
    surrender: [{ text: 'The rival captain surrenders. His crew lowers a boat and yields the ship.' },
      { who: 'jack12', text: 'There are the fishers, on the sandbar! And there is my chest. That reef behind it... was it there a moment ago?' }],
    kraken: [{ text: 'A shadow larger than the reef rises from the sea. One arm longer than the ship curls around the rail and lifts the bow.' },
      { who: 'jack12', text: 'That is a Kraken. Watch where its arms land. Pelita, if you find its eye, let us see it.' }],
    rescue: [{ text: 'The Kraken sinks, and the ship settles back into the sea. Jack has the gold chest aboard when the waterspout turns for the sandbar.' },
      { who: 'jack12', text: 'There is only room to lower one boat... and I said I would bring those crews home.' },
      { text: 'Jack pockets a handful of coins, pushes the chest overboard, and helps you bring the fishers aboard.' }],
    finish: [{ who: 'jack12', text: 'This ship is yours, captain. I found this brass needle in the wreck. With it, your Pedoman will pick up unusual currents out at sea.' },
      { text: 'Sail freely from the jetty. Follow the Pedoman to a wreck with a rare item or a roaming sea boss.' },
      { who: 'jack12', text: 'When a boss goes down, check what the current carried out of sight. I call it Treasure Hunter’s Luck. And if that needle finds my chest, come get me.' },
      { text: 'Jack Separaw has joined you as a battle companion. Manage him from Pause → Companions.' }]
  };
  LC.OBJECTS.push({ id: 'storm_dock12', type: 'storm_dock', x: C.dock.x, y: C.dock.y, tex: 'stormdock12', keep: true,
    when: C.ready });
  LC.AREAS.stormsea = {
    name: 'Storm Reef', sub: 'the open sea beyond the reef', lvl: 20, home: C.port, pond: 'sea', amb: 'beach', decor: decor,
    build: function () {
      var g = grid(74, 52);
      fill(g, 53, 25, 63, 35, 'h'); fill(g, 59, 30, 62, 32, 's');
      [[22, 32, 26, 35], [44, 17, 50, 20], [28, 37, 32, 39], [62, 21, 66, 22]].forEach(function (r) {
        fill(g, r[0] - 1, r[1] - 1, r[2] + 1, r[3] + 1, 'h'); fill(g, r[0], r[1], r[2], r[3], 's');
      });
      return g;
    }, objects: [], exits: [], ride: {}
  };
  LC.AREAS.stormdeck = {
    name: 'Treasure Ship', sub: 'the deck above Storm Reef', lvl: 20, home: { x: 10, y: 19 }, pond: 'sea', amb: 'beach', decor: decor,
    build: function () { var g = grid(73, 47); fill(g, 6, 12, 41, 24, 'j'); fill(g, 4, 15, 43, 21, 'j'); return g; },
    objects: [{ id: 'storm_helm12', type: 'storm_helm', x: 8, y: 21, tex: 'stormhelm12' },
      { id: 'storm_mast12', type: 'bldg', x: 29, y: 18, tex: 'tiang11', text: 'The rigging groans with each roll of the ship.' },
      { id: 'storm_barrel12', type: 'bldg', x: 12, y: 13, tex: 'tong11', text: 'A barrel of rainwater.' }], exits: [], ride: {}
  };
  LC.ENEMIES.raider12 = { name: 'Treasure Raider', hp: 22, speed: 32, dmg: 8, w: 7, sight: 160, drop: [] };
  LC.ENEMIES.captain12 = { name: 'Rival Captain', hp: 66, speed: 32, dmg: 11, w: 8, sight: 250, charge: true, boss: true, drop: [] };
  LC.ENEMIES.kraken12 = { name: 'Kraken', hp: 108, speed: 0, dmg: 14, w: 12, sight: 220, boss: true, drop: [] };
})(window.LC);
