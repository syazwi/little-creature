/* Little Creature — v2.4.1: Nek Lampir, your grumpy helper. After Chapter 6 the witch has no black magic left: she
 * grows herbs on the lower slopes of Gunung Ledang. Become her best friend (10 hearts) and she makes peace with Nenek;
 * after that you can call her (C) from anywhere. She works with YOU and nobody else:
 *  - she will not come while another helper is with you (Badang, Hang Tuah, the brothers, Si Tanggang), while a co-op
 *    friend is in the same place, or under the sea; and if one turns up while she is there, she leaves in a huff
 *  - she pops in beside you in a puff of smoke, and blinks away whenever an enemy gets close to her
 *  - Serbuk Lada: in a fight she throws pepper powder at anything that bites you (it sneezes and staggers back)
 *  - Bulatan Hijau: press C again for a green circle of crushed herbs; inside it, every blow hurts you half as much
 *  - when you are badly hurt, she grabs you by the collar and teleports you to a safe spot (then rests a while)
 *  - with no fight around, she offers a paid teleport to any place you have been (and needs a rest after)
 * Pelita stays with you; she pretends it is not there. Simulated on your own device, like the enemies. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  LC.NEK = {
    hearts: 10,                                     // friendship needed before she makes peace with Nenek
    callCd: 20,                                     // seconds before she will come again after leaving
    idle: 40, idleAfterFight: 12,                   // she goes home after this long with nothing to fight
    pepper: { cd: 2.4, reach: 150, r: 24, dmg: 2, bossDmg: 1, stagger: 1.4, bossStagger: 0.5 },
    circle: { r: 34, dur: 8, cd: 22 },
    rescue: { cd: 90, at: 0.3 },                    // she pulls you out when your health falls under 30%
    blink: 2.5,                                     // seconds between her own blinks away from enemies
    tp: { cd: 120, price: 200, far: 500 },          // the paid teleport (far: across the sea)
    farAreas: { barunai: 1, teluk: 1, ledang: 1, jawa: 1 },
    noFight: { pendekar_hangtuah: 1, pendekar_jebat: 1 }   // a friendly duel is not her business
  };
  LC.hasNek = function () { var S = LC.State.s; return !!S && !!(S.quests && S.quests.nekLampir); };
  LC.nekPeaceReady = function () { var S = LC.State.s; return !!S && (S.quests.ch6 || 0) >= 7 && !S.quests.nekLampir && LC.State.hearts('lampir') >= LC.NEK.hearts; };
  // cooldowns run on the real clock (like the stone curse), so they survive travelling between places
  function left(k) { return Math.max(0, ((LC[k] || 0) - Date.now()) / 1000); }
  LC.nekLeft = { call: function () { return left('nekCallAt'); }, circle: function () { return left('nekCircleAt'); }, rescue: function () { return left('nekRescueAt'); }, tp: function () { return left('nekTpAt'); } };
  // the paid teleport: any place on land that you have already been to (and can enter now)
  LC.nekPrice = function (to) { return LC.NEK.farAreas[to] ? LC.NEK.tp.far : LC.NEK.tp.price; };
  LC.nekPlaces = function (here) {
    var S = LC.State.s, seen = {}, out = [];
    LC.AREA_ORDER.concat(['barunai', 'teluk', 'jawa', 'ledang']).forEach(function (a) {
      var A = LC.AREAS[a];
      if (seen[a] || !A || a === here) return;
      seen[a] = 1;
      if (!A.underwater && S.visited[a] && LC.State.isOpen(a)) out.push(a);
    });
    return out;
  };

  LC.SPEAKERS = Object.assign(LC.SPEAKERS || {}, { lampir: { name: 'Nek Lampir', portrait: 'npc_lampir_0' } });

  LC.NEKTEXT = {
    come: ['Hmph. What now? ...Oh. THAT. Stand back.', 'You again? Fine, fine. Do not get in my way.', 'My herbs are wilting while I do this, you know.', 'Heh-heh... I mean, hmph. Let us get this over with.'],
    calm: ['Hmph. You called? There is nothing here to fight. What do you want?', 'I was in the middle of potting my serai. This had better be good.', 'Well? Speak up. My knees are not getting any younger.'],
    pelita: 'And keep that little lamp out of my eyes.',
    leave: ['Hmph. Done. Do not call me for nothing.', 'There. Now let an old woman get back to her herbs.', 'Do not thank me. Really. Do not.'],
    bored: 'Hmph. Nothing to do. I am going back to my herbs.',
    never: 'Then why did you call me? Hmph!',
    huff: 'Hmph! I said ALONE.',
    refuse: {
      badang: 'That big lump Badang? Hmph. Call me when he has gone home.',
      tuah: 'Not while that show-off Tuah is around. Call me when you are alone.',
      duel: 'A duel is between two people. I am not getting in the middle of THAT.',
      heroes: 'All these heroes, all this shouting. Hmph! Call me when you are alone.',
      tanggang: 'Not while you drag that weepy sailor around. Hmph.',
      friends: 'Too many people. I work with YOU, farmer, and nobody else. Call me when you are alone.',
      water: 'Under the sea? I am NOT getting my hair wet.'
    },
    throws: ['Shoo! Shoo!', 'Pepper in your eyes!', 'Hmph!', 'Heh-heh!'],
    circle: 'Stand in the circle, silly farmer!',
    rescue: 'Hold on, you silly farmer!',
    rescued: 'Nek Lampir grabbed you by the collar and teleported you away from danger! (She needs ' + LC.NEK.rescue.cd + ' seconds to rest before she can do it again.)',
    tpGo: 'Hold on to your hat. Teleporting at my age is hard on the knees.',
    tpTired: 'Teleporting AGAIN? Let an old woman catch her breath.',
    peaceAsk: [
      { who: 'lampir', text: '...What is that face? You want me to go and see your Nenek. I can tell. You have that look.' },
      { who: 'lampir', text: 'Hmph. Fine. FINE. But we are not walking all that way. Hold on to my sleeve, and do not let go.' }
    ],
    peace: [
      { text: 'A puff of smoke, a smell of crushed herbs... and you are standing on the farm, beside Nenek\'s pangkin, with Nek Lampir clutching her stick.' },
      { who: 'nenek', text: 'Well, well. Lampir. Seventy years, and you still have the worst hair on the whole peninsula.' },
      { who: 'lampir', text: 'And you still bite, I suppose. I have come to... to... (she glares at you) The farmer made me come.' },
      { text: 'Nenek waits. Pelita waits. Even the chickens seem to wait.' },
      { who: 'lampir', text: '...I am sorry. For the light, and the curse, and the seventy years. There. I said it. Do not make me say it again.' },
      { who: 'nenek', text: '(she laughs) Sit down, you silly old woman. Have some kuih. My cucu tells me you grow herbs now.' },
      { who: 'lampir', text: 'Hmph. Better herbs than yours ever were.' },
      { text: 'The two old women sit on the pangkin and argue about herbs until the shadows grow long. It sounds a lot like friendship.' },
      { who: 'lampir', text: 'You. Farmer. You were patient with a grumpy old woman, so here is a grumpy old woman\'s help. When you need me, call. Only YOU, mind. No warriors, no strongmen, no crowds.' },
      { who: 'lampir', text: 'Pepper for anything that bites you. A green circle of herbs to stand in. And if things go badly, I will pull you out by your collar. ...And keep that little lamp out of my eyes.' },
      { text: '✦ New helper: Nek Lampir! Press C (or tap her button beside your hotbar) to call her. She only helps when you are alone: she throws pepper, casts a green circle of herbs (press C again), and pulls you out of danger. With no fight around, she teleports you anywhere you have been, for a fee. ✦' }
    ]
  };
})(window.LC);
