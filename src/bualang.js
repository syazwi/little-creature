/* Little Creature — v2.5: Sang Bualang, the wind, your friend (after Chapter 7), and Pelita's daylight.
 *  - B (or the wau beside your hotbar): fly a wau to call him. He rides the wind, so he takes a while to arrive: about
 *    10 seconds in open places, 20 in forests and caves (the wind has to find its way in). He cannot reach you under
 *    the sea. If the fight is over before he lands, he shrugs and goes ("Missed it? Hah, next time.").
 *  - In a fight he follows you and spins into enemies (Puting Beliung): a little damage, and they are flung back dizzy.
 *    Press B again while he is fighting to send him spinning at once. With nothing to fight, he blows away home.
 *  - U (or the gust button): Angin Bualang, your own power. Every enemy around you is blown back and left dizzy; it also
 *    blows away darkness (Mak Lampir's stolen light), fog and the boss's whirlwinds.
 *  - Nek Lampir will not work beside him ("That windbag?"), true to her "only you" rule.
 *  - Pelita's daylight: after Chapter 7, once Pelita is at the top level, the night is as bright as day wherever
 *    Pelita is with you (switch it off in the pause menu). The haunted mine stays a mine; Pelita just shines brighter.
 * Simulated on your own device, like the enemies. Cooldowns use the real clock, so they survive travelling. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  LC.BUALANG = {
    arrive: { open: 10, closed: 20 },              // seconds riding the wind to you
    rest: 25,                                      // after he leaves, before he will come again
    idle: 25, idleAfterFight: 9, missed: 2.5,      // he blows away home with nothing to fight
    catchUp: 3,                                    // he was with you when you travelled: he follows on the wind
    spin: { cd: 2.8, reach: 170, r: 30, dmg: 3, bossDmg: 2, dizzy: 1.6, bossDizzy: 0.5, push: 150, bossPush: 40 },
    gust: { cd: 12, r: 92, dmg: 2, bossDmg: 1, push: 300, bossPush: 90, dizzy: 1.3, bossDizzy: 0.4 },
    noFight: { pendekar_hangtuah: 1, pendekar_jebat: 1 }
  };
  LC.hasBualang = function () { var S = LC.State.s; return !!S && !!(S.quests && S.quests.bualang); };
  function left(k) { return Math.max(0, ((LC[k] || 0) - Date.now()) / 1000); }
  LC.bualangLeft = { rest: function () { return left('bualangRestAt'); }, due: function () { return left('bualangDueAt'); }, gust: function () { return left('anginAt'); } };
  // Pelita's daylight: the gift of Kayangan, at the top level (and not switched off)
  LC.pelitaSunUnlocked = function () { var S = LC.State.s; return !!S && !!(S.quests && S.quests.pelitaSun); };
  LC.pelitaSun = function () { var S = LC.State.s; return LC.pelitaSunUnlocked() && LC.State.level() >= LC.MAX_LEVEL && !S.flags.sunOff; };

  LC.NEKTEXT.refuse.bualang = 'That windbag? Hmph. Call me when he has blown away.';
  LC.NEK.farAreas.santubong = 1;
  var places = LC.nekPlaces;   // Nek Lampir's teleport reaches Santubong too
  LC.nekPlaces = function (here) {
    var out = places(here), S = LC.State.s;
    if (here !== 'santubong' && S.visited.santubong && out.indexOf('santubong') < 0) out.push('santubong');
    return out;
  };

  LC.BUALANGTEXT = {
    call: 'You fly the wau. High up, the wind catches it... Sang Bualang is riding the wind to you!',
    onWay: 'Sang Bualang is on his way, riding the wind',
    come: ['WHOOSH! Did somebody call the wind?', 'Here I am! Point me at something!', 'Hah! Out of my way, out of my way!', 'The wind is here! Hold on to your hat!'],
    missed: 'Missed it? Hah, next time.',
    leave: ['That was fun! Call me again. On the wind, of course.', 'Done! I am off to bother some seagulls.', 'Whoosh! Bye!'],
    bored: 'Nothing to blow away? Then I will be off.',
    home: 'Back to the bay, then. Fly the wau if you need me!',
    resting: 'Sang Bualang is catching his breath out over the sea',
    water: 'The wind cannot follow you under the sea. Sang Bualang will wait up above.',
    spins: ['Puting Beliung!', 'Spin, spin!', 'Wheee!', 'Round you go!'],
    dizzy: ['Pusing!', 'Dizzy!', '@_@'],
    catchUp: 'Sang Bualang follows you on the wind...'
  };
})(window.LC);
