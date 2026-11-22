/* Chapter 13 goals and keyboard and touch controls for Mantera Pantul. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var C = LC.C13, U = LC.UIScene.prototype;
  var previousGoal = LC.ch5Goal;
  LC.ch5Goal = function () {
    var S = LC.State.s, s = C.step(S);
    if (!C.ready(S) || s >= C.end) return previousGoal.apply(this, arguments);
    var world = LC.game.scene.getScene('World'), q = S.quests, campus = world.area === 'mantera', vault = world.area === 'manteraVault';
    var goals = [
      'Read Jack’s enchanted letter near Nenek’s farmhouse.',
      !campus ? 'Use the enchanted letter to travel to Kampung Mantera.' : q.c13Lesson ? 'Stand between the desk and rune. Cast Pantul just before each bolt hits.' : 'Study with Nek Lampir at her desk by the western classroom.',
      campus ? 'Speak to Suraya in the stone courtyard east of the classroom.' : 'Return to the school to face Suraya.',
      !campus ? 'Return to Kampung Mantera to resume the duel.' : q.c13Golems ? 'Strike the Suraya with the glowing shadow. Dodge the marked circles.' : 'Defend Jack from Suraya’s stone soldiers.',
      campus ? 'Follow Nek Lampir’s lead as the students escape.' : 'Return to the school courtyard to help the students.',
      vault ? 'Reflect the Collector’s own bolt to break his seal, then defeat him.' : campus ? 'Enter the sealed vault at the east edge of the school.' : 'Use the enchanted letter to return to Kampung Mantera.',
      vault ? 'Take the south gate back to the school courtyard.' : campus ? 'Return Batu Ikrar to Suraya in the courtyard.' : 'Return to Kampung Mantera with Batu Ikrar.'
    ];
    return 'Chapter 13: ' + goals[s];
  };

  var onKey = U.onKey;
  U.onKey = function (ev) {
    if (ev.code === 'KeyP' && this.world && this.world.pantulAvailable() && !this.modal) {
      ev.preventDefault(); this.world.castPantul(); return;
    }
    return onKey.apply(this, arguments);
  };
  var build = U.buildSkills;
  U.buildSkills = function () {
    build.apply(this, arguments);
    var self = this, hit = this.add.zone(234, 532, 44, 44).setOrigin(0).setInteractive({ useHandCursor: true });
    hit.isTouchBtn = true;
    hit.on('pointerdown', function () { if (!self.modal) self.pressKey('KeyP'); });
    var p = this.pantulHUD = { frame: this.add.graphics(), icon: this.add.image(256, 554, 'mantera_pantul').setScale(1.65),
      key: this.txt(237, 535, 'P', 12, '#cfdef4', { stroke: 3 }), hit: hit };
    this.pin('bc', [p.frame, p.icon, p.key, p.hit]);
  };
  var draw = U.drawSkills;
  U.drawSkills = function () {
    draw.apply(this, arguments);
    var p = this.pantulHUD, w = this.world, show = !!(w && w.pantulAvailable() && !this.modal);
    if (!p) return;
    p.icon.setVisible(show); p.key.setVisible(show && !this.touchOn); p.hit.setVisible(show);
    p.frame.clear();
    if (!show) return;
    var left = w.pantulLeft();
    p.frame.fillStyle(left ? 0x232133 : 0x253b50, 0.9); p.frame.fillRoundedRect(234, 532, 44, 44, 7);
    p.frame.lineStyle(2, left ? 0x766b88 : 0xb6f7e6, 1); p.frame.strokeRoundedRect(234, 532, 44, 44, 7);
    if (left) { p.frame.fillStyle(0xa1bcdf, 0.65); p.frame.fillRect(239, 571, 34 * (1 - left / C.cooldown), 2); }
    p.icon.setAlpha(left ? 0.48 : 1);
  };
  var stats = U.statRows;
  U.statRows = function () {
    var rows = stats.apply(this, arguments);
    if (this.S.quests.c13Learned) rows.push({ icon: 'mantera_pantul', label: 'Mantera Pantul',
      sub: 'Press P or tap the mirror. For a moment it blocks one hit and reflects bolts at Kampung Mantera.' });
    return rows;
  };
})(window.LC);
