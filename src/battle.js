/* Little Creature — v1.6: battles beyond the mine, the stone curse, and Si Tanggang's mother.
 *  - Wild creatures now roam the forest, the island, the mountain, the dunes, the reef and the sunken junk
 *    (some only come out at night). The farm, the kampungs and the palaces stay peaceful.
 *  - Sumpahan Batu: once Si Tanggang is your friend, he shares the last of his curse with you. Press V (or tap
 *    the stone beside your hotbar) to turn nearby enemies to stone for a few seconds.
 *  - Mak Deruma: the ghost of Si Tanggang's mother waits on the beach of Pulau Mutiara. Guide her son to her and
 *    the old curse breaks: both of them live again, in Kampung Tepian, and she gives you Restu Ibu (a mother's
 *    blessing) that saves you once a day when you are about to fall. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';

  // ================================================================ new creatures
  Object.assign(LC.ENEMIES, {
    babi:       { name: 'Babi Hutan', hp: 6, speed: 24, dmg: 6, sight: 80, w: 7, charge: true, drop: [['kepeng', 0.7, 4, 10]] },
    ketam_batu: { name: 'Ketam Batu', hp: 5, speed: 20, dmg: 5, sight: 70, w: 6, side: true, drop: [['kerang', 0.6, 1, 2], ['mutiara', 0.06, 1, 1]] },
    kala:       { name: 'Kala Jengking Gergasi', hp: 7, speed: 24, dmg: 8, sight: 90, w: 7, drop: [['kepeng', 0.6, 6, 14], ['duit_lama', 0.2, 1, 1]] },
    obor:       { name: 'Obor-obor Api', hp: 3, speed: 13, dmg: 5, sight: 70, w: 5, erratic: true, floaty: true, drop: [['rumpai_laut', 0.5, 1, 2]] }
  });
  LC.ENEMY_ANIMS = { babi: 7, ketam_batu: 6, kala: 6, obor: 3 };   // walk-cycle speeds for the new creatures

  function fight(area, groups) { LC.AREAS[area].enemies = (LC.AREAS[area].enemies || []).concat(groups); }
  // night: only after dark (they melt away at dawn) · escort: only while you guide Si Tanggang home
  fight('forest', [
    { kind: 'babi', n: 2, zone: { x0: 25, y0: 3, x1: 40, y1: 19 } },
    { kind: 'bayang', n: 2, night: true, zone: { x0: 3, y0: 3, x1: 20, y1: 19 } }
  ]);
  fight('island', [
    { kind: 'ketam_batu', n: 1, zone: { x0: 5, y0: 10, x1: 12, y1: 16 } },
    { kind: 'ketam_batu', n: 1, zone: { x0: 33, y0: 16, x1: 38, y1: 22 } },
    { kind: 'bayang', n: 2, night: true, zone: { x0: 8, y0: 9, x1: 36, y1: 20 } }
  ]);
  fight('mountain', [
    { kind: 'kelawar', n: 3, night: true, zone: { x0: 4, y0: 3, x1: 40, y1: 16 } },
    { kind: 'lipan', n: 1, zone: { x0: 33, y0: 24, x1: 40, y1: 31 } }
  ]);
  fight('desert', [{ kind: 'kala', n: 3, zone: { x0: 12, y0: 3, x1: 42, y1: 28 } }]);
  fight('laut', [
    { kind: 'obor', n: 2, zone: { x0: 3, y0: 20, x1: 15, y1: 28 } },
    { kind: 'bayang', n: 3, escort: true, zone: { x0: 23, y0: 12, x1: 38, y1: 26 } }
  ]);
  fight('kapal', [{ kind: 'bayang', n: 2, zone: { x0: 3, y0: 4, x1: 9, y1: 12 } }]);
  LC.SAFE_AREAS = ['farm', 'kampung', 'bunian', 'kidul', 'atlantis'];

  // ================================================================ the stone curse and a mother's blessing
  LC.STONE = { cd: 15, dur: 4, r: 80, bossDur: 1.5 };
  LC.RESTU = { cd: 10, dur: 6, r: 120 };   // with Restu Ibu: the stone curse is quicker, longer and wider
  LC.hasStone = function () { var S = LC.State.s; return !!S && ((S.quests.tanggang || 0) >= 2 || LC.State.hearts('tanggang') >= 3); };
  LC.hasRestu = function () { var S = LC.State.s; return !!S && (S.quests.tanggang || 0) >= 4; };

  // ================================================================ Mak Deruma, Si Tanggang's mother
  LC.VILLAGERS.deruma = {
    name: 'Mak Deruma', role: 'A mother, still waiting', area: 'island', post: { x: 21, y: 25 }, sprite: true, glow: 0xffd8a0,
    intro: [
      '...Oh! Forgive me, child. I thought you were a ship. I am always watching for a ship.',
      'I am Deruma. Long ago my only son, Tanggang, sailed away to make his fortune. When he came home a great captain, he would not know me.',
      'My heart broke, and I cried out to the sky. The sea rose and took him, his ship and his pride. A mother\'s words are heavy things.',
      'I forgave him that same night. But I could never forgive myself. So I wait here, where my little sampan washed ashore, and I watch the sea.'
    ],
    chat: ['The tide always comes back. That is why I wait.', 'Tanggang loved pandan rice. He would eat three plates!', 'Be gentle with your words, child. Some can never be taken back.', 'Every night I sing his old lullaby to the waves.'],
    tasks: [['melati', 1, 3], ['nasi', 1, 2], ['kerang', 2, 4], ['ikan_kembung', 1, 2]],
    taskText: 'for her son\'s homecoming', gifts: { 3: ['canang', 2], 6: ['mutiara', 1], 10: ['emas', 2] },
    alive: {
      area: 'kampung', post: { x: 34, y: 24 }, key: 'derumaH', glow: 0, role: 'Si Tanggang\'s mother, home again',
      chat: ['My son cooks for me now. Badly! But with love.', 'Restu Ibu goes with you, child. Wherever you walk.', 'I had forgotten how warm the sun is.', 'Bring your Nenek\'s recipes. I will teach you the old ones too.'],
      taskText: 'for the family kitchen'
    }
  };
  LC.VILLAGERS.tanggang.alive = {
    area: 'kampung', post: { x: 36, y: 24 }, key: 'tanggangH', glow: 0, role: 'A sailor, home at last',
    chat: ['I mend Pak Mat\'s nets now. Honest work. It feels good.', 'Mak says I eat like a starving ghost. Ha! I was one.', 'If you ever feel too proud, come and hear my story again.', 'The sea is beautiful from the shore. I never noticed before.'],
    taskText: 'for his mother'
  };
  LC.AREAS.island.objects.push({ id: 'i_sampan_ibu', type: 'bldg', x: 23, y: 26, w: 2, h: 1, tex: 'sampan_lama', text: 'A tiny old sampan, grey with age and half buried in sand. A faded name is painted on its side: DERUMA.' });

  // a villager as they are right now (Si Tanggang and his mother live again once you bring them together)
  LC.villager = function (vid) {
    var v = LC.VILLAGERS[vid], S = LC.State.s;
    if (v && v.alive && S && (S.quests.tanggang || 0) >= 4) return Object.assign({}, v, v.alive);
    return v;
  };
  LC.villagerKey = function (vid) { return LC.villager(vid).key || vid; };
  LC.villagerArea = function (vid) { return LC.villager(vid).area || 'kampung'; };
  LC.villagerPosts = function (area) {   // every spot where a villager might stand in this place (now or later)
    var out = [];
    Object.keys(LC.VILLAGERS).forEach(function (vid) {
      var v = LC.VILLAGERS[vid];
      if (v.post && (v.area || 'kampung') === area) out.push(v.post);
      if (v.alive && v.alive.post && v.alive.area === area) out.push(v.alive.post);
    });
    return out;
  };

  // ================================================================ the story, in Si Tanggang's and Mak Deruma's words
  LC.TANGGANG = {
    ask: [
      'Child... the shawl gave me peace, but there is one thing more. Something I must do, or I will never truly rest.',
      'The fishermen say a woman\'s ghost sits on the beach of Pulau Mutiara every night, looking out to sea. Waiting for a ship.',
      'It is Mak. I know it is. She has been waiting three hundred years, and I am the ship that never came.',
      'The curse binds me to this wreck. But if a living friend walks ahead of me, I think I can follow. Will you take me to her?'
    ],
    go: 'Then lead on, child. The sea\'s old curse will not let me go easily: shadows will try to drag me back. Protect me, and do not fall!',
    lost: 'The shadows dragged Si Tanggang back to his ship... He is waiting in the sunken junk. Ask him again when you are ready.',
    reunion: [
      { who: 'tanggang', text: '...Mak?' },
      { who: 'deruma', text: 'That voice... Tanggang? Anakku? My son?' },
      { who: 'tanggang', text: 'Mak, I am so sorry. I was ashamed of you, when I should have been proud. You gave me everything, and I gave you nothing but tears. Maafkan aku, Mak. Forgive me.' },
      { who: 'deruma', text: 'Oh, my foolish boy. I forgave you the night the sea took you. It is I who should be sorry, for the words I cried out in anger.' },
      { text: 'She opens her thin old arms, and the proud captain falls into them like a little boy who has run home in the rain.' },
      { text: 'A warm light rises from the sand. The ghostly glow fades from them... and two living people stand on the beach, blinking in the moonlight, holding each other tight.' },
      { who: 'derumaH', text: 'Child, you brought my son home. Take a mother\'s blessing, Restu Ibu. When you are about to fall, my prayer will lift you up again.' },
      { who: 'tanggangH', text: 'And my stone curse will serve you better now: quicker, wider, longer. We are going to Kampung Tepian, Mak and I. Come and visit us!' },
      { text: '✦ Special ability: Restu Ibu! Once a day, when your health runs out, a mother\'s prayer heals you fully and turns every enemy around you to stone. Your Sumpahan Batu is stronger too. ✦' }
    ]
  };
  LC.TEXT.stoneGift = [
    { who: 'tanggang', text: 'Wait, child. You have been a true friend to a lonely ghost. Take this: the last of my mother\'s curse, still clinging to me.' },
    { who: 'tanggang', text: 'Sumpahan Batu, the stone curse. Point your heart at anything that means you harm, and for a few breaths it will be as still as my old ship.' },
    { text: '✦ New ability: Sumpahan Batu! Press V (or tap the stone beside your hotbar) to turn nearby enemies to stone for a few seconds. ✦' }
  ];
})(window.LC);
