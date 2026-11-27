/* Optional encounters in Tanah Perkuburan Lama and Bukit Pasir. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  LC.GRAVEYARD_ZOMBIES = {
    mounds: [[5, 10], [9, 12], [7, 16], [5, 18], [25, 10], [19, 12], [25, 16], [19, 18]],
    wakeRange: 86, stirTime: 0.62, riseTime: 0.96
  };
  LC.DUNE_GIANT = {
    home: { x: 30, y: 27 }, strengthMultiplier: 20, wakeRange: 29, useRange: 62,
    chaseRange: 170, leash: 138, attackRange: 96, halfArc: 1.3, windup: 1.06, swing: 0.34
  };
  LC.ENEMIES.grave_zombie = { name: 'Graveyard Zombie', hp: 25, speed: 21, dmg: 11, sight: 115, w: 6, level: 26,
    defeatText: 'The zombie crumbles into grave dirt.',
    drop: [['kepeng', 1, 12, 24]] };
  LC.ENEMIES.dune_giant = { name: 'Gergasi Bukit Pasir', hp: 165, speed: 32, dmg: 0, sight: 138, w: 22,
    hitHeight: 18, level: 28, boss: true, drop: [] };
})(window.LC);
