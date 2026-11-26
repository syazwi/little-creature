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
    needsBell: function (q) { return q.ch12 === 1 && q.c12BellAsked && !q.c12Bell; },
    needsSignal: function (q) { return !q.c12LitSignal && !q.c12Chest; },
    dock: { x: 22, y: 28 }, port: { x: 8, y: 29 }, rival: { x: 38, y: 26 }, reef: { x: 57, y: 30 },
    crews: [{ x: 57, y: 27 }, { x: 60, y: 29 }, { x: 58, y: 33 }],
    eye: { x: 23, y: 13 },
    jackFight: { dmg: 4, cd: 2.4, sight: 84, reach: 36 },
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
  LC.SPEAKERS.jack12 = { name: 'Nakhoda Idris', portrait: 'npc_jack12_0' };
  LC.SPEAKERS.lina12 = { name: 'Lina', portrait: 'npc_lina12' };
  LC.SPEAKERS.yusof12 = { name: 'Pak Yusof', portrait: 'npc_yusof12' };
  LC.SPEAKERS.idris12 = { name: 'Idris', portrait: 'npc_jack12_0' };
  LC.CH12TEXT = {
    meet: [
      { who: 'mat', text: 'Three boats followed your chart through Storm Reef, Nakhoda. None came home.' },
      { who: 'jack12', text: 'I marked that passage safe at low tide. I should have gone with them.' },
      { who: 'lina12', text: 'Ayah said you knew the way home. Take his spare lamp. He has the other one. Three flashes is how we find each other.' },
      { text: 'Lina wraps the brass lantern in a dry cloth and presses it into your hands.' },
      { who: 'jack12', text: 'I have been looking for the wreck beside that sandbar for years. I can chart the way. You take the helm.' }
    ],
    bellHint: { who: 'nenek20', text: 'Cucu, before you sail, come inside. Take the brass bell from the hook by your bed. Your parents used to ring it when the fog came up.' },
    bell: [
      { text: 'You lift the little brass bell from the hook by your bed. A wave and a six-pointed star are scratched into the rim.' },
      { who: 'nenek20', text: 'Your father scratched the wave. Your mother added the star when he kept sailing by the wrong one. Listen. One high note, clear as anything.' }
    ],
    bellOld: [{ text: 'The little brass bell by your bed has a wave and a six-pointed star scratched into its rim. You know its note by heart.' }],
    chase: [
      { who: 'jack12', text: 'Give that waterspout a wide berth. The Pedoman will hold our heading through the rain.' },
      { who: 'jack12', text: 'That striped sail has a copy of my chart. Their ship can carry all three crews. Close in and fire at the sails so we can board.' }
    ],
    board: [{ who: 'jack12', text: 'Easy on the ropes. Keep the hull in one piece. We need this deck to get those fishers home.' }],
    surrender: [{ text: 'The rival captain yields the deck. Before he lowers his boat, he gives the winch one last turn. A brass chest rises out of the wreck.' },
      { text: 'Something knocks back from under the hull. The ladder breaks. The captain throws you his mooring line, and you pull his crew’s boat clear.' }],
    kraken: [{ text: 'A broad head breaks the surface. The Kraken hooks the rail with one arm and raises a ragged tail over the deck.' },
      { who: 'jack12', text: 'Move when you see the deck marked. That tail comes down hard. Pelita, show us its eye when it comes close.' }],
    rescue: [{ text: 'Two lights come through the spray. One hangs above the wreck. The other flickers low on the sandbar.' },
      { who: 'jack12', text: 'Flash Lina’s lantern when we get close. If that is Pak Yusof, he’ll answer three times.' }],
    cut: [{ text: 'As you pull alongside Pak Yusof, the chest catches under his boat. The towline draws tight and starts to haul him under.' },
      { who: 'jack12', text: 'Hold her steady. I have the rope.' },
      { text: 'Idris cuts the line. The chest drops. Pak Yusof’s boat bobs free and the lantern rises through the spray.' }],
    father: [{ who: 'yusof12', text: 'That is Lina’s knot on your lamp. She used to tie it to my wrist so I would remember to come home.' },
      { who: 'yusof12', text: 'There are two more boats. I can see them from here.' }],
    reunion: [
      { text: 'You hand Lina’s lantern to Pak Yusof. He sets both lamps down just in time to catch her.' },
      { who: 'lina12', text: 'Ayah! We should hang the spare right here. Then the next boat will know where home is, too.' }
    ],
    secondBell: { who: 'idris12', text: 'I have its twin here. Listen. Your bell rings high, mine rings low. We could hear the difference even from opposite banks.' },
    fatherReveal: [
      { who: 'idris12', text: 'I’m your father. When the Collector came for our ship, I handed you to Nenek. I told her I would be back before you woke.' },
      { who: 'idris12', text: 'I sank my ship with the chest aboard to keep it from him. I looked for your mother until I ran out of places to look.' },
      { who: 'idris12', text: 'I came back to this jetty every year. I could see your farmhouse from the water. Once I saw you carrying a basket bigger than you. I should have got out of the boat.' }
    ],
    finish: [
      { text: 'You and Lina hang Lampu Pulang at the jetty. It will light up every evening.' },
      { who: 'idris12', text: 'Take the ship. I fitted a brass needle from the wreck into your Pedoman. It can pick up unusual currents now. Keep an eye on what washes up when a boss goes down, too.' },
      { text: 'Free sailing unlocked. Follow the Pedoman to rare wreck salvage or a sea boss. Treasure Hunter’s Luck grants extra boss loot. Manage Idris in Pause → Companions.' },
      { text: 'By morning, a paper bird is waiting outside the farmhouse. It unfolds into a letter addressed to Nakhoda Idris.' }
    ]
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
