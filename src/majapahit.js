/* Little Creature — Chapter 4: Layar Merah, "Red Sails" (v2.2). It begins after Chapter 3, on the same save, back at
 * Nenek's farm and Kampung Tepian, the home of Chapter 1.
 * Laksamana Kebo Taruna, an admiral of Majapahit (a made-up character), never forgave the cockfight of Barunai. He
 * believes Pelita's light cheated for Mutiara, and without his king's leave he sails to take Pelita and make the
 * kampung bow. The King of Majapahit stays honourable: he comes to stop it, and the story ends in peace and trade.
 *  0 (the day after Chapter 3) Asmara's crow sounds the alarm   1 Pak Mat has seen red sails, and an envoy came
 *  2 get ready: Tukang Leong's bamboo stockade, Dang Kemala's cannons, the brothers of Barunai (and Badang)
 *  3 the night attack, in four waves (quests.c4wave): 1 hold the kampung jetty, 2 the fires on Nenek's farm,
 *    3 raiders creeping up on the spirit house, then the Naga turns the fleet, 4 the admiral at Nenek's jetty
 *  4 the king arrives: apology, rebuilding, a Keris Majapahit, and a Majapahit trading jong at the farm jetty.
 * No gore: soldiers drop their spears and run back to their boats; the admiral ends up in the water. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  function addItems(map) { Object.keys(map).forEach(function (id) { var it = map[id]; it.id = id; it.icon = it.icon || 'i_' + id; LC.ITEMS[id] = it; }); }
  addItems({
    keris_majapahit: { name: 'Keris Majapahit', kind: 'weapon', dmg: 5, reach: 25, cd: 0.34, desc: 'A gift from the King of Majapahit, forged in his workshops. It has never been drawn in anger: keep it that way.' },
    celengan: { name: 'Celengan Majapahit', kind: 'treasure', price: 450, sell: 200, desc: 'A little terracotta piggy bank from Java, with a slot on its back for your kepeng.' },
    kain_batik: { name: 'Kain Batik', kind: 'treasure', price: 380, sell: 170, desc: 'Cloth from Java, patterned with wax and dye. The pattern is called "kawung".' }
  });
  function c4(S) { return (S && S.quests && S.quests.ch4) || 0; }
  function wave(S) { return (S && S.quests && S.quests.c4wave) || 0; }
  LC.ch4Step = function () { return c4(LC.State.s); };
  LC.c4Wave = function () { return wave(LC.State.s); };

  // ================================================================ the enemies
  Object.assign(LC.ENEMIES, {
    prajurit: { name: 'Prajurit Majapahit', hp: 9, speed: 26, dmg: 6, sight: 115, w: 6, drop: [] },
    laksamana: { name: 'Laksamana Kebo Taruna', hp: 70, speed: 25, dmg: 12, sight: 180, w: 9, boss: true, drop: [] }
  });
  function onWave(n) { return function () { return c4(LC.State.s) === 3 && wave(LC.State.s) === n; }; }
  LC.AREAS.kampung.enemies = (LC.AREAS.kampung.enemies || []).concat([{ kind: 'prajurit', n: 6, zone: { x0: 14, y0: 18, x1: 36, y1: 28 }, when: onWave(1) }]);
  // (the farm keeps its enemy list on the area too: the raiders by the spirit house, then the admiral at the jetty)
  var FARM = LC.AREAS.farm;
  FARM.enemies = (FARM.enemies || []).concat([
    { kind: 'prajurit', n: 4, zone: { x0: 9, y0: 5, x1: 17, y1: 9 }, when: onWave(3) },
    { kind: 'laksamana', n: 1, zone: { x0: 16, y0: 25, x1: 26, y1: 28 }, when: onWave(4) }
  ]);
  LC.C4 = {
    fires: ['house', 'reban', 'kandang', 'dapur', 'warung'],   // the farm buildings set alight in wave 2
    allies: {   // where the heroes stand, by place and wave
      'kampung1': [{ x: 21, y: 23 }, { x: 29, y: 24 }], 'farm3': [{ x: 12, y: 8 }, { x: 16, y: 9 }], 'farm4': [{ x: 18, y: 27 }, { x: 24, y: 27 }]
    },
    goals: [null, 'Hold the kampung jetty with the heroes', 'Run home! Put out the fires on Nenek\'s farm (fill the gembor at the well)', 'Protect the spirit house: drive off the raiders', 'The admiral has landed at Nenek\'s jetty!'],
    stockade: { kayu: 20, batu: 10, rotan: 6 }, cannons: { batu: 6 }, cannonKepeng: 2500,
    jongStock: ['kain_batik', 'celengan', 'jamu_kuat'], jongBuys: ['kain_tenun', 'tembaga', 'belian', 'madu_tualang', 'nibong']
  };
  // the defences in Kampung Tepian, and the Majapahit trading jong at Nenek's jetty afterwards
  var built = function (flag) { return function (S) { return !!S.quests[flag] && c4(S) >= 2; }; };
  [14, 17, 20, 27, 30, 33].forEach(function (x, i) { LC.AREAS.kampung.objects.push({ id: 'c4_pagar' + i, type: 'bldg', x: x, y: 26, w: 3, h: 1, tex: 'pagar_buluh', when: built('c4pagar'), text: 'Tukang Leong\'s bamboo stockade, sharpened at the top and lashed with rattan.' }); });
  [21, 28].forEach(function (x, i) { LC.AREAS.kampung.objects.push({ id: 'c4_meriam' + i, type: 'bldg', x: x, y: 25, tex: 'meriam', when: built('c4meriam'), text: 'A brass meriam from Dang Kemala\'s workshop in Barunai, aimed at the river.' }); });
  LC.OBJECTS.push({ id: 'jong_dagang', type: 'jong_dagang', x: 25, y: 29, w: 5, h: 3, tex: 'jong_majapahit', when: function (S) { return c4(S) >= 4; } });

  // speakers who are not villagers
  LC.SPEAKERS = Object.assign(LC.SPEAKERS || {}, {
    laksamana: { name: 'Laksamana Kebo Taruna', portrait: 'laksamana_0' },
    badangK: { name: 'Badang', portrait: 'npc_badangK_0' }
  });

  // ================================================================ the story, in their words
  LC.CH4TEXT = {
    dawn: [
      { text: 'All morning, Asmara\'s crow has rung out over the farm. Not the proud dawn crow of its blessing: a harsh, urgent cry, three times, then again, and again.' },
      { text: 'Pelita flickers nervously in the spirit house, and keeps looking out to sea. From the kampung, you can hear Pak Mat shouting at the jetty.' },
      { text: '✦ Chapter 4: Layar Merah (Red Sails) ✦  Go to the kampung jetty and find out what Pak Mat has seen.' }
    ],
    news: [
      { who: 'mat', text: 'Sails! Red and white sails, a whole fleet of them, out past the river mouth! Forty years I have fished here, and I have never seen so many ships.' },
      { who: 'mat', text: 'A little boat came in at first light, with an envoy. He read out a message from Laksamana Kebo Taruna, an admiral of Majapahit.' },
      { who: 'laksamana', text: '(the envoy reads) "The cockfight of Barunai was won by a trick: a spirit light helped the rooster Mutiara. Give up the friend of Barunai and the little spirit, and bow to Majapahit. Or we will come and take them."' },
      { who: 'mat', text: 'Word came from Barunai too: Lumut Lunting, the stone rooster\'s sandbank, was nearly under water at high tide. They say that only happens when danger is coming.' },
      { who: 'mat', text: 'Nobody here is giving you up, and nobody is giving up Pelita. Go and see the Penghulu. We must get ready.' }
    ],
    ready: [
      { who: 'penghulu', text: 'The stockade is up, the cannons are in place, and the brothers of Barunai have come. The Orang Bunian have offered to hide the children and the elders in their hidden village.' },
      { who: 'penghulu', text: 'And Pak Mat says the Naga has been circling the bay all day, as if it were on guard. The fleet will come tonight. Be at the kampung jetty after dark.' }
    ],
    attack: [
      { text: 'Under a thin moon, dark boats glide up the river. Torches flare, and soldiers leap down onto the sand by the jetty!' },
      { who: 'semaun', text: 'Kampung Tepian stands together! Friend, hold the jetty with us!' }
    ],
    wave1: [
      { text: 'The soldiers fall back to their boats... but burning arrows arc over the trees, towards Nenek\'s farm!' },
      { who: 'semaun', text: 'Your farm! Run! We are right behind you!' }
    ],
    fires: 'Nenek\'s house, the reban, the kandang, the dapur and Mak Ani\'s warung are all burning! Fill your gembor at the well and put the fires out!',
    wave3: [{ text: 'As the last fire hisses out, shadows creep out of the field towards the spirit house. They have come for Pelita!' }],
    naga: [
      { text: 'Out on the water, the sea heaves. The Naga rises from the deep, coils around the warships and spins them like leaves, back towards the open sea.' },
      { text: 'Only one ship breaks free: the admiral\'s. It runs aground by Nenek\'s jetty, and Laksamana Kebo Taruna leaps down onto the sand.' },
      { who: 'laksamana', text: 'Enough! Give me the spirit, and this ends tonight!' }
    ],
    king: [
      { text: 'The admiral\'s kris spins out of his hand. He stumbles back off the sand into the shallows with a mighty splash, and comes up dripping and furious.' },
      { text: 'Then a horn sounds across the sea. A great jong with golden sails glides up to Nenek\'s jetty: the flagship of the King of Majapahit himself.' },
      { who: 'raden', text: 'Kebo Taruna! I gave my word at Barunai, and you have shamed it. I never ordered this.' },
      { who: 'laksamana', text: '...They cheated, my king. A spirit light...' },
      { text: '(For a moment the admiral\'s eyes look far away, as if he is listening to someone. Out over the dark water, very faintly, an old woman cackles.)' },
      { who: 'raden', text: 'No. They won fairly. I lost my temper, and Asmara paid for it. And I hear that this friend went to Asmara\'s ghost and laid him to rest, when no one from Majapahit ever did.' },
      { who: 'raden', text: 'Forgive us, friend. Kebo Taruna and his sailors will stay and rebuild every roof they burned, with their own hands. And from now on, Majapahit ships will come to your jetty to trade, never to fight.' },
      { who: 'raden', text: 'Take this keris. It was made in the workshops of Majapahit, and it has never been drawn in anger. Keep it that way.' },
      { text: '✦ Chapter 4: Layar Merah, complete! (+6000 kepeng, the Keris Majapahit) A Majapahit trading jong now visits Nenek\'s jetty. ✦' }
    ],
    allyTalk: ['"Stay close, friend!"', '"For Kampung Tepian!"', '"They will not touch Pelita!"']
  };
})(window.LC);
