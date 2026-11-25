/* The doors of Kampung Bunian. Challenge stats, rooms, and saved rewards.
 * v3.18: a fifth, bigger door (Pintu Cermin) above the four. Behind it waits Bayang Diri, your own shadow: ten levels
 * above you, with your weapon and every combat skill you know, and stronger after each win. See WorldBunianMirror.js. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var B = LC.BunianTrials = {
    keeper: { x: 9, y: 11 }, returnTo: { x: 9, y: 14 }, start: { x: 13, y: 16 },
    bossAt: { x: 13, y: 7 }, spawns: [{ x: 9, y: 11 }, { x: 17, y: 11 }, { x: 13, y: 9 }, { x: 13, y: 13 }],
    doors: [
      { id: 'sea', name: 'Sea Creatures', arena: 'The Sunken Court', x: 5, y: 9, color: 0x73d7df, floor: 's', edge: 'o',
        minion: ['Reef Claw', 'ketam_batu', 8, 25, 5], boss: ['Tide Serpent', 'nagaibu8', 36, 24, 8], count: 3,
        power: 'tide', advice: 'The Tide Serpent sweeps the room in two crossing waves. Leave the marked lines before the water hits.',
        hp: 5, energy: 0, loot: ['mutiara', 2], kepeng: 450 },
      { id: 'warrior', name: 'Warrior Creatures', arena: 'The Hall of Spears', x: 11, y: 9, color: 0xf3b477, floor: 'k', edge: 'X',
        minion: ['Iron Spearman', 'hoplit8', 10, 30, 6], boss: ['Iron Panglima', 'kapten11', 48, 34, 10], count: 3,
        power: 'charge', advice: 'The Iron Panglima stamps before a charge. Step sideways, then strike while the captain turns.',
        hp: 8, energy: 0, loot: ['emas', 2], kepeng: 650 },
      { id: 'magic', name: 'Magic Creatures', arena: 'The Court of Runes', x: 5, y: 13, color: 0xc6a3ff, floor: 'k', edge: 'X',
        minion: ['Rune Golem', 'golem13', 12, 26, 7], boss: ['The Rune Weaver', 'suraya13', 58, 25, 11], count: 4,
        power: 'runes', advice: 'The Rune Weaver marks your feet and the ground near you. Keep moving until the runes burst, then close in.',
        hp: 0, energy: 10, loot: ['kristal', 3], kepeng: 850 },
      { id: 'spirit', name: 'Supernatural Creatures', arena: 'The Hollow of Shadows', x: 11, y: 13, color: 0x9ceab2, floor: 'c', edge: 'X',
        minion: ['Restless Shadow', 'bayang', 13, 32, 7], boss: ['Puaka Senja', 'puaka_emas', 70, 26, 12], count: 4,
        power: 'haunt', advice: 'Puaka Senja hunts you in a moving shadow. Keep away from the ring around it and rush in after it breaks.',
        hp: 10, energy: 10, loot: ['serpihan_bayang', 4], kepeng: 1100 },
      { id: 'mirror', name: 'Mirror', arena: 'The Hall of Mirrors', x: 7, y: 7, w: 4, big: true, mirror: true, color: 0xff5a7a, floor: 'k', edge: 'X',
        boss: ['Bayang Diri', 'mirror_twin', 60, 54, 6], count: 0, power: 'mirror',
        advice: 'Behind this door stands a mirror. What steps out of it is you: ten levels stronger, with your best weapon and every skill you have learned. Watch the marks on the floor, and turn your own skills against it.',
        hp: 10, energy: 10, loot: ['emas', 3], kepeng: 1500 }
    ],
    clearCount: function (s, door) { return s.quests && s.quests.bunianClears && s.quests.bunianClears[door.id] || 0; },
    round: function (s, door) {
      if (door.mirror) return B.mirrorRound(s, door);
      var clears = B.clearCount(s, door);
      return {
        number: clears + 1,
        minion: { level: LC.monsterLevel(door.minionKind) + clears * 2, hp: Math.round(door.minion[2] * (1 + clears * 0.35)), dmg: door.minion[4] + clears },
        boss: { level: LC.monsterLevel(door.bossKind) + clears * 3, hp: Math.round(door.boss[2] * (1 + clears * 0.75)), dmg: door.boss[4] + clears * 3 },
        specialCooldown: Math.max(3.1, 4.7 - clears * 0.4), enragedCooldown: Math.max(2.4, 3.5 - clears * 0.3),
        kepeng: Math.round(door.kepeng * (1 + clears * 0.25)), items: door.loot[1] + clears
      };
    },
    // your best weapon (the one your shadow fights with)
    bestWeapon: function (s) {
      var best = null;
      (s.inv || []).forEach(function (slot) { var it = slot && LC.ITEMS[slot.id]; if (it && it.kind === 'weapon' && (!best || it.dmg > best.dmg)) best = it; });
      return best;
    },
    // Bayang Diri: your level + 10 (+2 for each win); as many blows to beat as 18 of your best swings (+4 per win);
    // hits for a tenth of your health (+2 per win); and casts its skills sooner after every win
    mirrorRound: function (s, door) {
      var clears = B.clearCount(s, door), best = B.bestWeapon(s), swing = best ? LC.State.weaponDamage(best) : 1;
      var you = LC.plLevel ? LC.plLevel(s) : 1;
      return {
        number: clears + 1, you: you, weapon: best,
        boss: { level: you + 10 + clears * 2, hp: Math.max(40, Math.round(swing * Math.min(40, 18 + clears * 4))),
          dmg: Math.max(4, Math.round((s.maxHp || 60) * 0.1)) + clears * 2, speed: Math.min(70, 54 + clears * 3), sight: 600, w: 6 },
        specialCooldown: Math.max(2.0, 4.2 - clears * 0.35), enragedCooldown: Math.max(1.5, 3.1 - clears * 0.3),
        kepeng: Math.round(door.kepeng * (1 + clears * 0.25)), items: door.loot[1] + clears
      };
    },
    bonuses: function (s) {
      var result = { hp: 0, energy: 0 };
      B.doors.forEach(function (door) {
        if (B.clearCount(s, door)) { result.hp += door.hp; result.energy += door.energy; }
      });
      return result;
    },
    enter: function (s) {
      // Keep the entry bag even when a menu or the Android app saves during a trial.
      s.quests.bunianTrialEntry = { inv: s.inv.map(function (slot) { return slot && { id: slot.id, n: slot.n }; }),
        sel: s.sel, kepeng: s.kepeng, energy: s.energy, water: s.water, str: s.str,
        strFoodDay: s.strFoodDay, strFood: s.strFood, jamuDay: s.jamuDay, restuDay: s.restuDay };
    },
    restore: function (s) {
      var entry = s.quests.bunianTrialEntry;
      if (!entry) return false;
      Object.assign(s, entry);
      delete s.quests.bunianTrialEntry;
      s.area = 'bunian';
      return true;
    }
  };
  function arenaTiles(door) {
    return Array.from({ length: 21 }, function (_, y) {
      return Array.from({ length: 27 }, function (_, x) {
        if (x < 3 || x > 23 || y < 3 || y > 18) return door.edge;
        return x === 13 || y === 7 || y === 16 ? 'k' : door.floor;
      });
    });
  }
  function rival(door, role) {
    var template = door[role], boss = role === 'boss';
    return { name: template[0], texture: template[1], hp: template[2], speed: template[3], dmg: template[4],
      w: boss ? 10 : 7, sight: 240, boss: boss, charge: boss && door.id === 'warrior',
      floaty: door.id === 'spirit' || boss && door.id === 'sea', drop: [] };
  }
  var village = LC.AREAS.bunian.objects;
  village.push({ id: 'bunian_trial_keeper', type: 'bunian_keeper', x: B.keeper.x, y: B.keeper.y, tex: 'bunian_trial_keeper', keep: true });
  B.doors.forEach(function (door) {
    door.area = 'bunian_' + door.id;
    door.texture = door.area + '_door';
    door.minionKind = door.area + '_minion';
    door.bossKind = door.area + '_boss';
    if (door.minion) LC.ENEMIES[door.minionKind] = rival(door, 'minion');
    LC.ENEMIES[door.bossKind] = rival(door, 'boss');
    village.push({ id: door.texture, type: 'bunian_trial_door', trial: door.id, x: door.x, y: door.y, w: door.w || 2, tex: door.texture, light: door.color, keep: true });
    LC.AREAS[door.area] = {
      name: door.arena, sub: 'Trial of ' + door.name, trial: door, lvl: 3, home: B.start, frozenClock: true,
      build: function () { return arenaTiles(door); }, pond: 'river', amb: door.id === 'sea' ? 'beach' : 'cave',
      dim: door.id === 'spirit', enemies: [], decor: { n: 0, types: [], on: '.' }, exits: [], ride: {},
      objects: [{ id: 'bunian_trial_retreat', type: 'bunian_retreat', x: 13, y: 18, tex: door.texture }]
    };
  });
})(window.LC);
