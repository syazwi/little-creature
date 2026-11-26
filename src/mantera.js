/* Chapter 13. Kampung Mantera and the school beneath the ward. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var C = LC.C13 = {
    end: 7,
    ready: function (S) { return LC.C12.step(S) >= LC.C12.end; },
    step: function (S) { return S.quests.ch13 || 0; },
    letter: { x: 5, y: 9 }, desk: { x: 12, y: 16 }, rune: { x: 12, y: 12 },
    suraya: { x: 23, y: 12 }, rift: { x: 23, y: 8 }, vault: { x: 32, y: 12 },
    collector: { x: 18, y: 10 }, cooldown: 2.4, window: 0.72,
    court: [{ x: 19, y: 14 }, { x: 27, y: 14 }, { x: 19, y: 9 }, { x: 27, y: 9 }]
  };
  var decor = { n: 0, types: [], on: '.' };
  function grid(w, h, tile) { return Array.from({ length: h }, function () { return new Array(w).fill(tile); }); }
  function fill(g, x0, y0, x1, y1, tile) {
    for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) g[y][x] = tile;
  }
  function prop(id, type, pos, tex, extra) {
    return Object.assign({ id: id, type: type, x: pos.x, y: pos.y, tex: tex }, extra);
  }
  LC.OBJECTS.push(prop('mantera_letter', 'mantera_way', C.letter, 'mantera_letter', { keep: true, when: C.ready }));
  LC.AREAS.mantera = {
    name: 'Kampung Mantera', sub: 'Sekolah Mantera', lvl: 21, home: { x: 7, y: 22 }, pond: 'river', amb: 'river', decor: decor,
    build: function () {
      var g = grid(37, 28, 'J');
      fill(g, 3, 4, 33, 24, '.'); fill(g, 4, 20, 32, 22, 'p'); fill(g, 6, 10, 8, 23, 'p');
      fill(g, 10, 10, 15, 18, 'k'); fill(g, 17, 7, 29, 19, 'k');
      fill(g, 21, 15, 24, 22, 'k'); fill(g, 29, 11, 32, 13, 'k');
      fill(g, 3, 6, 5, 9, 'o'); fill(g, 30, 18, 33, 23, 'o');
      return g;
    },
    objects: [prop('mantera_home', 'mantera_home', { x: 7, y: 24 }, 'mantera_gate'),
      prop('mantera_school', 'bldg', { x: 23, y: 5 }, 'mantera_school', { text: 'Sekolah Mantera. Its doors open to every child in the village.' }),
      prop('mantera_class', 'bldg', { x: 12, y: 8 }, 'mantera_school', { text: 'Nek Lampir studied in this classroom.' }),
      prop('mantera_inn', 'bldg', { x: 7, y: 8 }, 'mantera_hut', { text: 'Two students are practicing how to levitate their brooms.' }),
      prop('mantera_library', 'bldg', { x: 29, y: 7 }, 'mantera_hut', { text: 'The village library. Spare slates float past the windows.' }),
      prop('mantera_desk', 'mantera_desk', C.desk, 'mantera_desk'),
      prop('mantera_rune', 'mantera_practice', C.rune, 'mantera_rune'),
      prop('mantera_suraya', 'mantera_suraya', C.suraya, 'npc_suraya13_0', {   // (v3.19: was an animation's name, which drew a black "missing" box)
        when: function (S) { var s = C.step(S); return s < 3 || s >= 6; }
      }),
      prop('mantera_vault_door', 'mantera_door', C.vault, 'mantera_gate')], exits: [], ride: {}
  };
  LC.AREAS.manteraVault = {
    name: 'The Sealed Vault', sub: 'beneath Sekolah Mantera', lvl: 21, home: { x: 18, y: 18 }, pond: 'river', amb: 'cave', cave: true, decor: decor,
    build: function () {
      var g = grid(37, 26, 'J');
      fill(g, 11, 5, 25, 21, 'k'); fill(g, 9, 8, 27, 16, 'k');
      fill(g, 11, 5, 12, 7, 'o'); fill(g, 24, 5, 25, 7, 'o');
      return g;
    },
    objects: [prop('mantera_return', 'mantera_school_return', { x: 18, y: 20 }, 'mantera_gate'),
      prop('mantera_altar', 'bldg', { x: 18, y: 6 }, 'mantera_rune', { text: 'The vault where the Collector kept the village ward stone.' })], exits: [], ride: {}
  };
  LC.ENEMIES.golem13 = { name: 'Stone Golem', hp: 30, speed: 27, dmg: 9, w: 9, sight: 200, drop: [] };
  LC.ENEMIES.suraya13 = { name: 'Supreme Sorcerer Suraya', hp: 82, speed: 0, dmg: 12, w: 11, sight: 250, boss: true, drop: [] };
  LC.ENEMIES.collector13 = { name: 'The Collector', hp: 96, speed: 0, dmg: 14, w: 11, sight: 250, boss: true, drop: [] };
  LC.SPEAKERS.suraya13 = { name: 'Supreme Sorcerer Suraya', portrait: 'npc_suraya13_0' };
  LC.SPEAKERS.collector13 = { name: 'The Collector', portrait: 'collector13_0' };
  LC.SPEAKERS.nek13 = { name: 'Nek Lampir', portrait: 'npc_lampir_0' };

  var hasNek = LC.hasNek, peaceReady = LC.nekPeaceReady, hideLampir = LC.VILLAGERS.lampir.hideIf;
  function lostNek() { var S = LC.State.s; return !!(S && S.quests && S.quests.c13NekGone); }
  LC.hasNek = function () { return !lostNek() && hasNek.apply(this, arguments); };
  LC.nekPeaceReady = function () { return !lostNek() && peaceReady.apply(this, arguments); };
  LC.VILLAGERS.lampir.hideIf = function (S) { return S.quests.c13NekGone || hideLampir.apply(this, arguments); };

  LC.MANTERA_TEXT = {
    letter: [
      ['suraya13', 'Nakhoda Idris. Return Batu Ikrar to Kampung Mantera. You have until sunset. You know how long I can make a sunset last.'],
      ['jack12', 'We used to date. I borrowed her ward stone for a card game. The masked fellow who won it called himself the Collector.'],
      ['nek13', 'My old school! I shall come. Idris, shall we share a broom?'],
      ['jack12', 'Three brooms, please. And for the record, I like women closer to my age.'],
      ['nek13', 'Such a shy boy. Fold the letter twice and it will take us to the village.']
    ],
    lesson: [
      ['nek13', 'I sat right here. Once I turned my homework into a frog. It still got better marks than I did.'],
      ['nek13', 'I can teach you Mantera Pantul. Stand between this desk and the rune. Cast when the spell is about to reach you. Send three bolts back to the rune.'],
      ['jack12', 'Splendid. Can it reflect interest on a debt?']
    ],
    trained: [['nek13', 'Good. Your mirror lasts only a moment. Keep it for the spells that matter. And take Pelita with you. A lamp casts only one honest shadow.']],
    challenge: [
      ['suraya13', 'You promised to return it by dawn, Idris. The children are doing lessons under a cracked ward.'],
      ['jack12', 'I was hoping the apology could arrive before the stone.'],
      ['suraya13', 'Then it can apologize to my soldiers. Stand back, both of you.'],
      ['', 'You step between Suraya and Idris. Four figures begin to pull themselves out of the courtyard.']
    ],
    illusions: [['suraya13', 'You learned that shield from Lampir, did you? Show me you can tell which of us is casting.'],
      ['', 'Pelita lights up the feet of the real Suraya. The other figures have no shadows.']],
    rift: [
      ['collector13', 'Thank you, Supreme Sorcerer. The stone has been catching every spell you cast. One more and the vault is mine.'],
      ['suraya13', 'The classroom is still full. I cannot close it from here!'],
      ['nek13', 'Then get them to the gate. I know exactly how long this old roof can hold.']
    ],
    sacrifice: [
      ['nek13', 'Idris? If you ever tell them about me, make me taller.'],
      ['jack12', 'I will tell them you were the tallest person here.'],
      ['', 'The last student makes it through. Nek Lampir holds the breach until the ward seals. She dies as the last of her light fades.'],
      ['suraya13', 'She held it long enough for every student. Come to the vault. I can contain his rift while you turn his magic back on him.']
    ],
    vault: [
      ['collector13', 'Go on. Try that blade against my seal.'],
      ['suraya13', 'Let his bolt come close, then reflect it. The seal will break under its own magic.']
    ],
    stone: [
      ['', 'The Collector flees through a spiderweb of light. With his seal broken, the stone is within reach.'],
      ['jack12', 'I have Batu Ikrar. No pockets this time. Let us take it back to Suraya.']
    ],
    finish: [
      ['', 'Idris returns Batu Ikrar with both hands. Light travels along the roofs of Kampung Mantera and the ward holds again.'],
      ['suraya13', 'Your debt is settled when you finish the roof. The school could use you for at least one more honest job.'],
      ['jack12', 'Nek would have fixed it from a broom. I suppose I had better get the ladder.'],
      ['', 'A lantern burns at Nek Lampir’s desk. Her old frog sits on the slate as the children come back to class.'],
      ['suraya13', 'Mantera Pantul is yours to keep. Every time you cast it, remember who taught you.']
    ]
  };
})(window.LC);
