/* Little Creature — Chapter 11: Bulan dan Mutiara, Part 2 (v3.4): "Two kingdoms, one sea". The user asked for Barunai
 * and Sulu fighting a foreign fleet together, a fight on a ship's deck, and a captain's voyage by compass; they chose
 * 1578 (the Castilian War, when a fleet from Manila under Castilian flags fought Brunei, Sulu and Maguindanao) through
 * Pelita's stone lamp, as in Chapter 3. Told gently: no gore (soldiers tumble overboard and swim to their boats), no
 * religion, no group shown as villains (the Capitán follows orders and gives up with honour), invented names only.
 *  7 (the day after Part 1) Pelita glows like old brass: the stone lamp in Barunai is calling
 *  8 the stone lamp: Kampong Ayer, 1578, just after the defence. Panglima Lela, an envoy from Sulu, brings one of the
 *    Mutiara Kembar as a token: the fleet that left Kampong Ayer is sailing for Sulu. Pak Damit: Barunai stands with Sulu
 *  9 take the helm of the lead vinta: the fleets of Barunai and Sulu sail behind you. Find the Castilian fleet in the
 *    fog (north-east to Batu Kembar, then listen for their ships' bells)
 * 10 dive with the Sama Dilaut and cut the three anchor ropes, keeping out of the lantern light from the decks above
 * 11 gongs across the water: play the signal on the kulintang so both fleets close in as one, then board the flagship
 * 12 the flagship: fight on the rocking deck (sailors swing in on ropes, cannon fire from the other galleons), then the
 *    Capitán. As he yields, the moon goes dark: the Bakunawa rises beside the ship with Pelita's light still in its
 *    eye, the gongs of both fleets ring out, and the fleet sails home. The twin pearls are split: one for Sulu, one for
 *    Barunai. Two pearls, two kingdoms, one sea   13 complete
 * Reward: the Kalis of Sulu (the strongest blade), 15,000 kepeng, 2 pearls. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  function addItems(map) { Object.keys(map).forEach(function (id) { var it = map[id]; it.id = id; it.icon = it.icon || 'i_' + id; LC.ITEMS[id] = it; }); }
  addItems({
    kalis: { name: 'Kalis Sulu', kind: 'weapon', dmg: 6, reach: 18, cd: 0.42, sell: 900, desc: 'A Sulu kalis with a long wavy blade, a gift from the Sultan of Sulu, 1578, for the captain who brought two kingdoms together. Light, fast, and it bites deep.' }
  });
  LC.FIXED_ITEMS.kalis = 1;
  LC.CH11_END = 13;
  function q(S) { return (S && S.quests) || {}; }
  function c11(S) { return q(S).ch11 || 0; }
  LC.ch11In1578 = function (S) { var s = c11(S || LC.State.s); return s >= 9 && s <= 12; };

  var C = LC.C11;
  C.p2 = {
    hookFrom: 6 * 60, hookTo: 20 * 60,
    fleet: { x: 74, y: 23 },                                 // the Castilian flagship, at anchor in the fog
    find: 8,                                                 // how close (tiles) to see it through the fog
    bellR: 40,                                               // how far (tiles) you can hear its bells
    legA: { to: [40.5, 17.5], r: 6 },                        // north-east to Batu Kembar first
    signal: 6,                                               // the kulintang signal: six gongs
    ropes: 3, spotFill: 1.25, spotDrain: 0.8,
    deck: { waves: [5, 5], bossHp: 80, broadside: 6.5, shotR: 15, shotDmg: 9 },
    reward: 15000
  };

  function grid(W, H, ch) { var g = []; for (var y = 0; y < H; y++) { g.push([]); for (var x = 0; x < W; x++) g[y].push(ch); } return g; }
  function fill(g, x0, y0, x1, y1, ch) { for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) if (g[y] && x >= 0 && x < g[0].length) g[y][x] = ch; }
  function ell(g, cx, cy, rx, ry, ch) { for (var y = 0; y < g.length; y++) for (var x = 0; x < g[0].length; x++) { var dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry; if (dx * dx + dy * dy <= 1) g[y][x] = ch; } }

  // ================================================================ the Castilian fleet at sea (1578), at anchor in the fog, and later aground
  var anchored = function (S) { var s = c11(S); return s >= 9 && s <= 12 && !q(S).c11cut; };
  var aground = function (S) { var s = c11(S); return s >= 10 && s <= 12 && !!q(S).c11cut; };
  [[74, 23, 'flag'], [68, 27, 'a'], [80, 28, 'b']].forEach(function (g) {
    LC.AREAS.lautsulu.objects.push({ id: 'ls_galeon_' + g[2], type: 'galeon11', x: g[0], y: g[1], w: 5, h: 2, tex: 'galeon11_t', keep: true, when: anchored, flag: g[2] === 'flag' });
    LC.AREAS.lautsulu.objects.push({ id: 'ls_galeonx_' + g[2], type: 'galeon11', x: g[0] - 4, y: g[1] + 9, w: 5, h: 2, tex: 'galeon11_t', keep: true, when: aground, flag: g[2] === 'flag', aground: true });
  });

  // ================================================================ under the galleons: the anchor ropes (dark water, lantern light from above)
  function buildSauh() {
    var W = 32, H = 22, g = grid(W, H, 'u');
    fill(g, 0, 0, W - 1, 0, 'C'); fill(g, 0, H - 1, W - 1, H - 1, 'C'); fill(g, 0, 0, 0, H - 1, 'C'); fill(g, W - 1, 0, W - 1, H - 1, 'C');
    ell(g, 9, 15, 2.2, 1.6, 'C'); ell(g, 21, 5, 2, 1.5, 'C'); ell(g, 27, 16, 2, 1.8, 'C'); ell(g, 15, 9, 1.4, 1.2, 'C');
    fill(g, 2, 10, 29, 11, 'v');
    return g;
  }
  LC.AREAS.sauh11 = {
    name: 'Under the Galleons', sub: 'the anchor ropes, in the dark', lvl: 20, needs: 'naga', build: buildSauh,
    objects: [
      { id: 'sh_naik', type: 'naik11b', x: 3, y: 10, tex: 'selam11' },
      { id: 'sh_tali0', type: 'tali11', i: 0, x: 12, y: 5, tex: 'tali11' },
      { id: 'sh_tali1', type: 'tali11', i: 1, x: 19, y: 15, tex: 'tali11' },
      { id: 'sh_tali2', type: 'tali11', i: 2, x: 27, y: 9, tex: 'tali11' }
    ],
    pond: null, amb: 'deep', dim: true, decor: { n: 30, types: ['kelp', 'seagrass', 'shellrock', 'kelp'], on: 'u' },
    critters: [{ kind: 'ikan_kecil', n: 3, zone: { x0: 2, y0: 2, x1: 29, y1: 19 } }],
    enemies: [{ kind: 'obor', n: 2, zone: { x0: 8, y0: 3, x1: 28, y1: 18 } }],
    exits: [], underwater: true, home: { x: 4.5, y: 10.6 }, ride: {}
  };

  // ================================================================ the flagship's deck
  function buildKapal() {
    var W = 46, H = 26, g = grid(W, H, 'o');
    fill(g, 6, 7, 39, 18, 'j');                              // the deck
    fill(g, 4, 9, 5, 16, 'j'); fill(g, 40, 9, 41, 16, 'j');  // bow and stern
    return g;
  }
  var KP_OBJ = [
    { id: 'kp_tiang0', type: 'bldg', x: 14, y: 12, tex: 'tiang11', text: 'The foremast, its sails furled. The ropes creak with every roll of the ship.' },
    { id: 'kp_tiang1', type: 'bldg', x: 23, y: 12, tex: 'tiang11', text: 'The mainmast, as tall as a palm tree.' },
    { id: 'kp_tiang2', type: 'bldg', x: 32, y: 12, tex: 'tiang11', text: 'The mizzenmast.' },
    { id: 'kp_tong0', type: 'bldg', x: 8, y: 8, tex: 'tong11', text: 'A barrel of fresh water.' },
    { id: 'kp_tong1', type: 'bldg', x: 9, y: 17, tex: 'tong11', text: 'A barrel of ship\'s biscuit. Hard enough to break a tooth.' },
    { id: 'kp_peti0', type: 'bldg', x: 28, y: 8, tex: 'peti11', text: 'A crate of rope and spare canvas.' },
    { id: 'kp_peti1', type: 'bldg', x: 36, y: 17, tex: 'peti11', text: 'A crate marked with a crown.' },
    { id: 'kp_palka', type: 'bldg', x: 19, y: 15, w: 2, h: 1, tex: 'palka11', text: 'A hatch down into the hold. Someone below is hiding very quietly.' }
  ];
  [10, 18, 27, 35].forEach(function (x, i) {
    KP_OBJ.push({ id: 'kp_mt' + i, type: 'bldg', x: x, y: 7, tex: 'meriam11', text: 'A ship\'s cannon, pointing out over the sea.' });
    KP_OBJ.push({ id: 'kp_mb' + i, type: 'bldg', x: x + 2, y: 18, tex: 'meriam11', text: 'A ship\'s cannon, pointing out over the sea.' });
  });
  function deck(W) { return W && W.c11 && W.c11.p2 && W.c11.p2.deck; }
  LC.AREAS.kapal11 = {
    name: 'The Flagship', sub: '1578: two kingdoms, one sea', lvl: 20, build: buildKapal, objects: KP_OBJ, deckShip: true,
    pond: 'sea', amb: 'beach', decor: { n: 0, types: ['rock'], on: '.' },
    enemies: [
      { kind: 'askar', n: 5, zone: { x0: 7, y0: 8, x1: 20, y1: 17 }, when: function (W) { var d = deck(W); return !!(d && d.wave === 1); } },
      { kind: 'askar', n: 5, zone: { x0: 22, y0: 8, x1: 38, y1: 17 }, when: function (W) { var d = deck(W); return !!(d && d.wave === 2); } },
      { kind: 'kapten11', n: 1, fixed: { x: 36, y: 12 }, when: function (W) { var d = deck(W); return !!(d && d.wave === 3); } },
      { kind: 'askar', n: 3, zone: { x0: 26, y0: 8, x1: 38, y1: 17 }, when: function (W) { var d = deck(W); return !!(d && d.wave === 3 && d.called); } }
    ],
    exits: [], home: { x: 8.5, y: 12.5 }, ride: {}
  };
  // the Capitán: proud, honourable, and very tired of the sea
  LC.ENEMIES.kapten11 = { name: 'The Capitán', hp: C.p2.deck.bossHp, speed: 32, dmg: 11, sight: 260, w: 8, charge: true, boss: true, drop: [] };

  // Kampong Ayer, 1578: the envoy from Sulu, Pak Damit again, and the lead vinta of the fleet
  LC.AREAS.kayer.objects.push({ id: 'k_vinta11', type: 'helm11', x: 25, y: 28, w: 4, h: 2, tex: 'vinta11', keep: true, when: function (S) { var s = c11(S); return s >= 9 && s <= 12; } });
  var damitHide = LC.VILLAGERS.damit.hideIf;
  LC.VILLAGERS.damit.hideIf = function (S) { var s = c11(S); return (s < 8 || s > 12) && damitHide(S); };
  // Pelita's stone lamp in Barunai glows again
  LC.AREAS.barunai.objects.forEach(function (o) {
    if (o.id !== 'b_pelita') return;
    var w = o.when;
    o.when = function (S) { var s = c11(S); return (s >= 8 && s <= 12) || w(S); };
  });

  function look(shirt, hat, extra) { return Object.assign({ skin: '#a8714a', shirt: shirt, shirt2: shirt, bottom: '#5a4a3a', bottom2: '#40342a', hair: '#1a1210', hat: hat }, extra || {}); }
  Object.assign(LC.VILLAGERS, {
    lela11: {
      name: 'Panglima Lela', role: 'Envoy of the Sultan of Sulu (1578)', area: 'kayer', post: { x: 22, y: 7 },
      look: look('#8a1e2a', 'headband', { skin: '#8a5634', shirt2: '#e9c46a', bottom: '#2a2a5a', bottom2: '#1e1e44', beard: '#1a1210' }),
      intro: ['Peace to Kampong Ayer. I am Lela, Panglima of the Sultan of Sulu. I have sailed two days and two nights without sleeping.', 'And you... you have a little moon on your shoulder. The old stories are true, then.'],
      chat: ['A Tausug never forgets a friend. Or an enemy. Mostly a friend.', 'The pearls have been in the Astana for two hundred years. Our grandmothers told us who brought them home.', 'Barunai and Sulu have quarrelled before. Brothers do. But when the storm comes, brothers row together.'],
      tasks: [['tiyula_itum', 1, 1], ['ikan_bakar', 1, 2]], taskText: 'for a tired envoy', gifts: { 3: ['kepeng', 1500], 6: ['mutiara', 1], 10: ['kepeng', 3000] },
      hideIf: function (S) { var s = c11(S); return s < 8 || s > 12; }
    }
  });
  LC.SPEAKERS = LC.SPEAKERS || {};
  Object.assign(LC.SPEAKERS, {
    kapten11: { name: 'The Capitán', portrait: 'kapten11_0' },
    sailor11: { name: 'A Castilian sailor', portrait: 'askar_0' }
  });

  // ================================================================ the words
  LC.CH11TEXT2 = {
    hook: [
      { who: 'pelita', expr: 'sad', text: '(Pelita\'s light keeps changing colour: gold, then the dull yellow of old brass, then gold again. It keeps turning towards the sea, towards Barunai.)' },
      { who: 'nenek', text: 'That look... it had that look before, when it showed you Kampong Ayer long ago. Pelita\'s stone lamp in Barunai is calling, cucu. Something in the past needs you.' }
    ],
    vision: [{ text: 'You touch Pelita\'s stone lamp. Its light floods out over the river, brassy and warm... and the years fall away like water off an oar.' }],
    arrive: [
      { text: '✦ Kampong Ayer, 1578 ✦  The smoke from the fires is still drifting over the walkways. The foreign fleet is gone from the river mouth. People are already rebuilding.' },
      { who: 'damit', text: 'You! You came back. They sailed away, the Castilians, three days ago. We thought it was over.' },
      { who: 'lela11', text: 'It is not over. I am Panglima Lela, from the Sultan of Sulu. Their fleet did not go home. It turned north-east. It is sailing for Sulu.' },
      { who: 'lela11', text: 'My Sultan sends this. (He opens a little box: one of the Mutiara Kembar, glowing like a small moon.) Two hundred years ago a friend of spirits brought these pearls home. Our grandmothers said: when the sea is in danger, that friend will come again.' },
      { who: 'pelita', expr: 'happy', text: '(Pelita darts to the pearl and glows with it, as if it recognised an old friend.)' },
      { who: 'damit', text: 'Then Barunai stands with Sulu. Our perahu are ready, and the brass of the lantaka is still warm. But we need a captain who can find a fleet in the fog.' },
      { who: 'lela11', text: 'The lead vinta is at the bottom walkway. Take the helm, Nakhoda. Both fleets will follow you.' }
    ],
    again: 'Kampong Ayer, 1578. The fleets of Barunai and Sulu are waiting for their captain (the vinta, at the bottom walkway).',
    seaStart: [
      { who: 'lela11', text: 'Two fleets, one captain. The fishermen saw the Castilians sail Timur Laut, past Batu Kembar, and into the fog.' },
      { who: 'damit', text: 'Galleons ring their bells in the fog, so they do not hit each other. Find Batu Kembar, then sail into the fog and listen.' }
    ],
    legA: 'Sail Timur Laut (north-east) to Batu Kembar, with both fleets behind you.',
    legB: 'Sail into the fog and listen for the ships\' bells. The louder the bells, the closer the fleet.',
    kembar: [{ who: 'lela11', text: 'Batu Kembar! Now into the fog, Nakhoda. Slowly. Listen.' }],
    found: [
      { text: 'Out of the fog, three huge shapes: galleons, at anchor, their lanterns glowing yellow. Their bells ring, slow and lonely.' },
      { who: 'damit', text: 'Three of them, and twice our size. We will not beat them in a fair fight. So we will not give them one.' },
      { who: 'lela11', text: 'Their anchor ropes. Cut the ropes in the night, and the current will carry them onto the reef. The Sama Dilaut divers will show you. Come up alongside the flagship and dive.' }
    ],
    noTurn: 'The fleets are behind you, Nakhoda. There is no turning back now. (Pelita\'s light could take you home: let it fade.)',
    fade: 'Let Pelita\'s light fade (back to Barunai)',
    dive: 'Dive to the anchor ropes',
    sauh: [{ text: 'Under the galleons it is dark, and quiet, and cold. Three anchor ropes hang down into the deep. Above, lanterns swing on the decks, and their light reaches down through the water. Keep out of it.' }],
    cut: 'Cut the anchor rope',
    cutting: 'Sawing through the rope...',
    cutDone: 'The rope parts and drifts away. (%n / 3)',
    allCut: 'All three ropes are cut! Swim back up.',
    spotted: 'A lantern finds you! A sailor shouts and throws a net, and you swim back into the dark. (Stay out of the light.)',
    drift: [
      { text: 'All night the current carries the galleons, slowly, quietly, without their anchors... and at dawn they are stuck fast on the reef, leaning like tired cows.' },
      { who: 'lela11', text: 'Now! Before they float off. Signal the fleets, Nakhoda: Mak Jaliha\'s signal, on the kulintang. Both fleets know it.' }
    ],
    signal: 'Signal the fleets (kulintang)',
    signalWon: [
      { text: 'DONG-dong-DONG... The signal rolls across the water. Perahu from Barunai and vintas from Sulu sweep in from both sides, sails bright in the morning sun, until the galleons are surrounded.' },
      { who: 'damit', text: 'Grappling hooks! Ropes! Captain, the flagship is yours!' }
    ],
    board: 'Board the flagship',
    boarding: [{ text: 'You swing across on a rope and land hard on the flagship\'s deck. Barunai warriors and Tausug fighters swing in behind you, shouting.' }],
    wave2: 'More sailors swing over from the other galleons! Hold the deck!',
    wave3: 'The Capitán comes down from the stern castle, sword in hand.',
    broadside: 'The other galleons fire! Watch the shadows on the deck!',
    called: 'The Capitán calls for help: three more sailors climb up from the hold!',
    overboard: ['SPLASH! Overboard he goes. He swims for the boats.', 'Over the rail! He bobs up, spluttering, and swims away.', 'Into the sea! A Sulu fisherman throws him a rope. Kindly.'],
    yield: [
      { who: 'kapten11', text: '¡Basta! Enough. ...My sword. Take it. You fight like the sea itself, all of you together.' },
      { who: 'kapten11', text: 'I was ordered to take Sulu as we were ordered to take Kampong Ayer. I have been at sea for three years. My men want to go home. So do I.' }
    ],
    eclipse: [
      { text: 'Then, in the middle of the day, the light goes strange. A shadow is sliding over the sun-pale moon in the sky... the moon is going dark.' },
      { text: 'The sea beside the flagship heaves. A serpent as long as the fleet itself rises out of the water, and in its great eye there is a tiny light. Gold. The colour of Pelita.' },
      { who: 'pelita', expr: 'happy', text: '(Pelita flies up to it. The Bakunawa lowers its head, very gently, and the two lights shine at each other. It remembers.)' },
      { text: 'Every gong in both fleets begins to ring: agung, kulintang, pots, a frying pan. The Bakunawa opens its jaws wide over the galleons, wide enough to swallow the moon...' },
      { who: 'sailor11', text: '¡Madre mía! A dragon! A dragon that eats the moon! To the boats! Home! HOME!' },
      { text: 'The Castilian sailors pile into their boats. When the tide lifts the galleons off the reef, they turn and sail away south, and they do not come back.' },
      { text: 'The Bakunawa spits the moon back into the sky, with a little cough, and slides into the deep. For a moment its golden eye winks at you.' }
    ],
    pearls: [
      { who: 'lela11', text: 'The Sultan said: if the friend of spirits comes, and the sea is safe, the pearls are not to come home together.' },
      { who: 'lela11', text: '(He takes the second pearl from his sash and puts it in Pak Damit\'s hands.) One for Sulu, and one for Barunai. Two pearls, two kingdoms, one sea.' },
      { who: 'damit', text: '(Pak Damit holds it like a baby bird.) Barunai will keep it in the great hall on the hill. And when the moon is dark, it will shine, and we will remember who our friends are.' },
      { who: 'lela11', text: 'And for the captain: the Sultan\'s own kalis. Its blade is wavy like the sea. May you never need it as much as you needed it today.' }
    ],
    end: [
      { text: 'Pelita\'s light begins to fade, and the sails, and the faces, and the sea...' },
      { text: '✦ Chapter 11 is complete! ✦  You received the Kalis Sulu, 15,000 kepeng and 2 pearls. And in the great hall of Barunai, if you look closely, one pearl shines on its own when the moon is dark.' }
    ],
    nenek: ['Two kingdoms in one sea, and you the captain! When I was a girl I could not even steer a sampan straight.', 'A kalis from the Sultan of Sulu? Hang it by the door. Away from the chickens.'],
    deckHint: 'Knock the sailors overboard! (Sumpahan Batu and Lagu Mayang work here too.)'
  };
})(window.LC);
