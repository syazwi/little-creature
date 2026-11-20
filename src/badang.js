/* Little Creature — v1.7: Badang, the strongman of the old Malay tales (from the Sejarah Melayu).
 *  - Badang is a poor, skinny farmhand who sets his bubu (bamboo fish traps) in the forest pool of Hutan Rimba.
 *    Every morning they are empty. Keep watch with him after dark and catch the cheeky river hantu that steals
 *    his fish (grab it by its long wet beard, or freeze it first with Sumpahan Batu).
 *  - The hantu grants BADANG a wish, and he becomes the strongest man in the land. You stay as you are:
 *    Badang is your friend, and he helps you.
 *  - Once a day he comes along and fights beside you. He clears the stumps and boulders south of Nenek's field
 *    overnight (a new field), raises gotong-royong houses at once, and throws stones in the Pesta's new contest,
 *    Lempar Batu, while you cheer. When he wins, his stone stays in the river: Batu Badang.
 *  - His thank-you gift: bubu fish traps of your own, which catch fish while you sleep. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  function addItems(map) { Object.keys(map).forEach(function (id) { var it = map[id]; it.id = id; it.icon = it.icon || 'i_' + id; LC.ITEMS[id] = it; }); }

  addItems({
    bubu: { name: 'Bubu', kind: 'trap', sell: 30, desc: 'A bamboo fish trap from Badang. Hold it, face a river, pool, lake or the sea and press USE to set it. Fish swim in while you sleep: check it in the morning. (You can tend 3.)' },
    piala_batu: { name: 'Piala Lempar Batu', kind: 'treasure', sell: 200, desc: 'Champion of the stone throwing! A little silver boulder. Badang insisted that you keep it.' }
  });

  // ================================================================ who Badang is, before and after his wish
  LC.VILLAGERS.badang = {
    name: 'Badang', role: 'A poor farmhand', area: 'forest', post: { x: 28, y: 22 }, sprite: true,
    intro: [
      'Oh! Salam, kawan. I did not hear you coming. I am Badang.',
      'I clear jungle for my master across the river. Every day I chop and dig until dark... and look at these arms. Thin as rattan!',
      'My only luck is my bubu, my fish traps, there in the pool. But every morning they are empty! Only fish bones... and long, wet, green hairs.',
      'Something steals my fish in the night. If I go home with nothing again, there will be no supper for me.'
    ],
    chat: ['One day I will clear a whole hill in one morning. Haha... one day.', 'Ubi rebus is the best food in the world. Mostly because it is the only food I have.', 'My master says I am too weak to be useful. Maybe he is right.', 'The pool is quiet in the day. But at night... I hear giggling.'],
    tasks: [['ubi_rebus', 1, 2], ['nasi', 1, 2], ['pisang', 2, 3], ['kelapa', 1, 2], ['nasi_lemak', 1, 1], ['ikan_bakar', 1, 2]],
    taskText: 'for his supper', gifts: { 3: ['bubu', 1], 6: ['kayu', 20], 10: ['kepeng', 800] },
    aliveIf: function (S) { return (S.quests.badang || 0) >= 3; },
    alive: {
      area: 'kampung', post: { x: 11, y: 20 }, key: 'badangK', role: 'The strongest man in the land',
      intro: [
        'Hah! A new face! I am Badang, the strongest man in the land.',
        'Not long ago I was a skinny farmhand. Then a cheeky river hantu granted me a wish... it is a long story, and a little disgusting.',
        'Need a hand? I clear land, carry houses and throw stones at the Pesta. Just ask, kawan!'
      ],
      chat: ['My master set me free! Now I clear land for anyone who asks. And I eat for ten.', 'I lifted the batu angkat with one finger. The children screamed. I put it back very gently.', 'Strength is for helping, kawan. Never for showing off. Well... maybe a little at the Pesta.', 'That cheeky hantu still steals a fish or two. I let it. It is only fair.'],
      taskText: 'for his giant appetite'
    }
  };
  LC.hasBadang = function () { var S = LC.State.s; return !!S && (S.quests.badang || 0) >= 3; };
  LC.badangWatch = function () { var S = LC.State.s; return !!S && (S.quests.badang || 0) === 2; };   // the night watch
  LC.badangBuddy = function () { var S = LC.State.s; return !!S && S.buddy === 'badang' && S.buddyDay === S.day && LC.hasBadang(); };
  LC.BADANG_FIGHT = { dmg: 3, cd: 1.5, sight: 110, speed: 120 };

  // ================================================================ the forest pool: his bubu, and where the hantu sits
  LC.AREAS.forest.objects.push({ id: 'f_bubu', type: 'bubu_badang', x: 30, y: 23, w: 1, h: 1, tex: 'bubu_set', keep: true, when: function (S) { return (S.quests.badang || 0) < 3; } });
  LC.HANTU_SPOTS = [{ x: 29, y: 24 }, { x: 33, y: 26 }, { x: 37, y: 26 }, { x: 40, y: 21 }, { x: 31, y: 18 }];
  LC.AREAS.forest.clear = LC.HANTU_SPOTS.map(function (p) { return { x: p.x, y: p.y, r: 1 }; });   // no trees on these spots

  // ================================================================ Ladang Badang: the land south of Nenek's field
  // (v2.7.4: as wide as the bigger field, and its first row is the field's south fence, which comes down once he clears it)
  LC.LADANG = { x0: 4, y0: 22, x1: 18, y1: 25, cost: { nasi_lemak: 3 }, kepeng: 300 };
  var notCleared = function (S) { return S.ladang !== 2; };
  [['l_tunggul1', 'tunggul', 6, 23], ['l_batu1', 'batu_besar', 9, 25], ['l_batu2', 'batu_kecil', 11, 23, 1], ['l_tunggul2', 'tunggul', 13, 24], ['l_batu3', 'batu_besar', 16, 23], ['l_tunggul3', 'tunggul', 15, 25]]
    .forEach(function (s) { LC.OBJECTS.push({ id: s[0], type: 'tunggul', x: s[2], y: s[3], w: s[4] || 2, h: 1, tex: s[1], when: notCleared }); });
  LC.inLadang = function (x, y) { var L = LC.LADANG; return x >= L.x0 && x <= L.x1 && y >= L.y0 && y <= L.y1; };
  // the farm map knows whether Badang has cleared the land (called whenever the world is built or a day begins)
  LC.syncLadang = function () {
    var S = LC.State.s, g = LC.areaGrid('farm'), L = LC.LADANG, done = !!(S && S.ladang === 2);
    for (var y = L.y0; y <= L.y1; y++) {
      for (var x = L.x0; x <= L.x1; x++) g[y][x] = done ? 'f' : y === L.y0 ? 'F' : '.';
      if (y > L.y0) g[y][L.x0 - 1] = g[y][L.x1 + 1] = done ? 'F' : '.';   // one big field: the side fences run on down
    }
  };

  // ================================================================ Batu Badang: the stone he threw into the river
  LC.AREAS.kampung.objects.push({ id: 'k_batu_badang', type: 'bldg', x: 40, y: 28, w: 2, h: 2, tex: 'batu_badang', keep: true,
    when: function (S) { return (S.trophies.lempar || 0) > 0; },
    text: 'Batu Badang: the great stone Badang threw at the Pesta. It flew over the crowd and landed in the river, and it has stayed there ever since. Children dare each other to swim out and touch it.' });

  // ================================================================ the Pesta's fourth contest
  LC.CONTESTS.lempar = { name: 'Lempar Batu', what: 'Stone throwing', icon: 'ic_badang', trophy: 'piala_batu', rivals: ['Mat Kilat', 'Awang Besar', 'Benderang'], play: 'playLempar',
    show: function () { return (LC.State.s.quests.badang || 0) >= 1; },
    ready: function () { return LC.hasBadang() ? { ok: true } : { ok: false, why: 'Only a true strongman can enter. Help Badang in Hutan Rimba first...' }; },
    champLine: '✦ Badang is CHAMPION of the Lempar Batu! ✦ He lifts you onto his shoulders while the whole kampung cheers.',
    how: 'Badang throws, you cheer! Tap when the marker is in the centre as he lifts, spins and throws. The longest throw wins.' };

  // ================================================================ the story, in their own words
  LC.BADANG = {
    ask: 'Will you keep watch with me tonight, kawan? Two pairs of eyes are better than one. And to be honest... I am scared of the dark.',
    agree: 'Terima kasih! Come back to the pool after dark (7 PM). We will hide behind the trees and catch the thief!',
    later: 'Hmm. If you change your mind, I am always here. Digging.',
    day: 'We keep watch after dark (7 PM). Until then, I dig. And dig. And dig.',
    night: 'Shh! Look... by the water! Something is eating my fish! Go on, grab it! I am right behind you. (Probably.)',
    seen: 'Splash... something is giggling by Badang\'s bubu at the forest pool!',
    slipped: 'Splash! The slippery hantu wriggled free and dived into the pool. Hihihi! It pops up somewhere else...',
    caught: [
      { who: 'hantu', text: 'Aduh! Aduh! Let go, let go! Not the beard!' },
      { who: 'badang', text: 'So YOU are the one who eats my fish every night!' },
      { who: 'hantu', text: 'Hehe... they were very tasty fish. Please, let me go! I will grant a wish. Gold? A palace? A hundred kerbau?' }
    ],
    greedy: [
      { who: 'hantu', text: 'Hmph! They were HIS fish, not yours, greedy one!' },
      { who: 'badang', text: 'Hehe. Thank you for trying, kawan. But I know what I want.' }
    ],
    wish: [
      { who: 'badang', text: 'I do not want gold, or a palace. I only want to be strong. Strong enough to finish my master\'s work, and be free.' },
      { who: 'hantu', text: 'Strength? Easy-peasy! But you must eat... whatever I bring up. Hrrk... hrrrrk...' },
      { text: 'BLEURGH! The hantu coughs up a glowing green lump. It wobbles.' },
      { who: 'badang', text: '...Must I?' },
      { who: 'hantu', text: 'Every last bit. Or no deal!' },
      { text: 'Badang shuts his eyes, pinches his nose... and gulps it down. GULP. Ewww.' }
    ],
    after: [
      { who: 'badangK', text: 'My arms! My back! Kawan, I feel like I could lift a mountain!' },
      { text: 'He picks up a fallen log as thick as a kerbau and tosses it over his shoulder like a pillow.' },
      { who: 'hantu', text: 'A deal is a deal! Hihihi, enjoy your strength!' }
    ],
    thanks: [
      { who: 'badangK', text: 'You did this for me, kawan. Tonight I will clear all of my master\'s land, and then I will be free!' },
      { who: 'badangK', text: 'Come and find me in Kampung Tepian, by the batu angkat. And take my old bubu: I can catch fish with my bare hands now!' },
      { text: '✦ Badang is the strongest man in the land! He can fight beside you, clear land, raise houses and throw stones at the Pesta. You got 2 Bubu (fish traps)! ✦' }
    ],
    come: 'Hah! Let us go, kawan. Anything that bothers you will have to bother me first.',
    away: 'Badang can\'t swim that deep. He waits for you on the shore.',
    home: 'Badang waves and strolls home to Kampung Tepian. "Call me again tomorrow!"',
    carried: 'Badang found you and carried you home on his shoulders like a sack of rice.',
    morning: 'Badang went home to sleep. Ask him again today if you want him along.',
    ladangAsk: 'Those old stumps south of Nenek\'s field? Hah! Give me a good feast and I will clear them tonight. You will wake up to a new field!',
    ladangDone: 'Overnight, Badang pulled up every stump and rolled every boulder into the river. There is a new field south of Nenek\'s fence: Ladang Badang!',
    houseQuick: 'Badang carries the posts on his shoulders, three at a time. Before the sun even moves, the house is standing!',
    champ: [
      { who: 'benderang', text: 'Ha! I sailed across the strait to beat the strongest man in the land. Instead I found a friend. Next year, Badang!' },
      { text: 'Badang\'s last stone flew so far that it landed in the river, and there it stays. Everyone calls it Batu Badang.' }
    ]
  };
  var WHO = { badang: ['Badang', 'npc_badang_0'], badangK: ['Badang', 'npc_badangK_0'], hantu: ['Hantu Air', 'hantu_air_0'], benderang: ['Benderang', null] };
  LC.badangLines = function (arr) {
    return arr.map(function (l) { var w = l.who && WHO[l.who]; return w ? { name: w[0], portrait: w[1] || undefined, text: l.text } : { text: l.text }; });
  };

  Object.assign(LC.TEXT, {
    tunggul: 'Huge old stumps and boulders, roots as thick as your leg. Far too heavy for you... It would take the strength of ten men to clear this land.',
    bubu_badang: 'Badang\'s bubu: a long bamboo fish trap. It is empty, except for fish bones and a few long, wet, green hairs...'
  });
})(window.LC);
