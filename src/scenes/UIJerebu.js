/* Chapter 15 goals, fire counter, and bucket-line rhythm game. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var C = LC.C15, U = LC.UIScene.prototype;
  var goals = [
    'Rest at the farm. A change in the weather is coming.',
    'Talk to Tok Penghulu in Kampung Tepian about the orange sky.',
    'Return to Kampung Tepian after 8 PM. The bunga api are locked by the wakaf.',
    function (S) { return 'Use the gembor on the small fires. Fires out: ' + C.smallOut(S) + ' / ' + C.small.length + '.'; },
    'Join Tok Penghulu’s bucket line outside his house.',
    function (S) { return 'Help the frightened villagers. Calmed: ' + C.calmed(S) + ' / ' + C.people.length + '.'; },
    function (S) { return 'Follow the sparks to Kak Senah’s lane' + (S.minutes < C.groveNight ? ' tonight after 7 PM.' : '.'); },
    function (S) { return 'Douse the fuses while Pelita talks to Si Bara. Fuses out: ' + C.doused(S) + ' / ' + C.fuses.length + '.'; },
    'Return to Kampung Tepian and talk to Tok Penghulu at the gelanggang.'
  ];
  var goal = LC.ch5Goal;
  LC.ch5Goal = function () {
    var S = LC.State.s, step = C.step(S), text = goals[step];
    if (!C.ready(S) || !text) return goal.apply(this, arguments);
    return 'Chapter 15: ' + (typeof text === 'function' ? text(S) : text);
  };
  LC.CHAPTER_LIST.forEach(function (ch) {
    if (ch.n === 14) ch.next = 'Rest at the farm after Chapter 14. When the sky turns orange, see Tok Penghulu in Kampung Tepian.';
  });
  LC.CHAPTER_LIST.push({ n: 15, key: 'ch15', end: C.end, name: 'Jerebu dan Bunga Api',
    steps: ['Rest at the farm', 'The orange sky', 'Night of rockets', 'Put out the fires', 'The bucket line', 'Calm the panic', 'The trail of sparks', 'Si Bara', 'The first rain'],
    next: 'Visit Si Bara at Nenek’s dapur to see his cooking blessing.' });

  var previous = LC.NEWS, seen = null;
  try { seen = localStorage.getItem('littleCreature.newsSeen'); } catch (e) { /* storage unavailable */ }
  LC.NEWS = { id: 'v3.15-ch15', lines: (previous && seen !== previous.id && seen !== 'v3.15-ch15' ? previous.lines : []).concat([
    { text: 'New story: Jerebu dan Bunga Api. Haze blankets Kampung Tepian, and rogue bunga api light up the night.' },
    { text: 'After Chapter 14, rest at the farm. When the sky turns orange, speak to Tok Penghulu in Kampung Tepian.' }
  ]) };

  var create = U.create, update = U.update, stats = U.statRows;
  U.create = function () {
    create.apply(this, arguments);
    this.tFire15 = this.txt(16, 190, '', 14, '#ffdc9e', { stroke: 4 }).setVisible(false);
    this.pin('tl', [this.tFire15]); this.layout();
  };
  U.update = function () {
    update.apply(this, arguments);
    if (!this.ready || !this.tFire15 || !this.world) return;
    var S = this.S, s = C.step(S), show = this.world.area === 'kampung' && (s === 3 || s === 4);
    this.tFire15.setVisible(show);
    if (show) {
      var text = 'Fires: ' + (s === 3 ? C.small.length - C.smallOut(S) : Number(!!S.quests.c15big)) + ' burning';
      if (this.tFire15.text !== text) this.tFire15.setText(text);
      this.tFire15.setPosition(this.tGoal.x, this.tGoal.y + this.tGoal.height + 5);
    }
  };
  U.statRows = function () {
    var rows = stats.apply(this, arguments);
    if (this.S.quests.siBara) rows.push({ icon: 'sibara15_0', label: 'Si Bara’s blessing', sub: 'Cook twice as many portions at Nenek’s dapur.' });
    return rows;
  };

  U.openJerebuBucket = function (onCatch, onFinish) {
    var self = this, F = this.gameFrame('The bucket line', 720, 400);
    var X = F.X, Y = F.Y, g = F.g, left = X + 100, right = X + 615, y = Y + 153, w = right - left;
    var fumble = 4, windows = [], mark = false, success = 0, result = null, shown = 0, start = this.time.now;
    var at = 850;
    for (var i = 0; i < 21; i++) { windows.push(at); at += 770 - i * 7; }
    var faces = ['npc14_amin_0', 'npc14_jusoh_0', 'npc_mat_0', 'npc14_bahar_0', 'npc_penghulu_0', this.world.plKey + '_down_0'];
    faces.forEach(function (key, i) { F.c.add(self.add.image(left + i * w / (faces.length - 1), y + 22, key).setScale(2.6)); });
    var bucket = this.add.image(left, y + 34, 'baldi15').setScale(1.6);
    var tally = this.txt(480, Y + 60, '', 20, '#f4ead2', { ox: 0.5 });
    F.c.add([bucket, tally, this.txt(left - 36, y + 62, 'River', 14, '#c6e4ef'),
      this.txt(right, y + 62, 'Your hands', 14, '#a4e6bc', { ox: 0.5 })]);
    var beat = 0;
    F.msg.setText('Catch the bucket at the green line. Save the house with 14 catches.');
    function tick(now) {
      if (result !== null) return;
      var t = now - start;
      if (beat < windows.length && t > windows[beat] + 120) {
        if (beat !== fumble) shown++;
        else { F.msg.setText('Jusoh dropped one on his own feet. That one doesn’t count.'); LC.Audio.sfx('splash'); }
        beat++; mark = false;
      }
      if (beat >= windows.length) {
        result = success >= 14;
        onFinish(result);
        tally.setText(success + ' caught / 20');
        F.msg.setText(result ? 'The house is safe!' : 'The roof needs more water. Try again.');
        bucket.setVisible(false);
        self.time.delayedCall(850, function () { if (self.modal === modal) close(); });
        return;
      }
      var duration = beat === 0 ? 670 : windows[beat] - windows[beat - 1];
      var fraction = Phaser.Math.Clamp(1 + (t - windows[beat]) / duration, 0, 1);
      var fumbled = beat === fumble && fraction > 0.25;
      tally.setText(success + ' caught   ·   ' + shown + ' / 20 passed');
      bucket.setPosition(left + w * (fumbled ? 0.25 : fraction), y + 38 + (fumbled ? (fraction - 0.25) * 70 : 0));
      g.clear();
      g.fillStyle(0x26333b).fillRoundedRect(left - 20, y + 26, w + 42, 23, 7);
      g.fillStyle(0x56ac80).fillRoundedRect(right - 12, y + 23, 24, 29, 5);
      g.fillStyle(0x9ad8ee, 0.55).fillRect(left, y + 34, w * (fumbled ? 0.25 : fraction), 6);
    }
    function press() {
      if (result !== null || mark || beat === fumble || Math.abs(self.time.now - start - windows[beat]) > 120) return;
      mark = true; success++;
      F.msg.setText('Caught! Pass it up to the roof.');
      LC.Audio.sfx('water'); onCatch(success);
    }
    var close = this.runGame(F, press, tick, function () { if (result === null) onFinish(false); }), modal = this.modal;
    this.closeX(F.c, X + F.W, Y, function () { if (self.modal === modal) modal.key('Escape'); });
    tick(start);
    if (LC.DEVELOPER_HTML) modal.devTick = function () {
      if (result === null && !mark && beat !== fumble && Math.abs(self.time.now - start - windows[beat]) < 85) self.pressKey('KeyE');
    };
  };
})(window.LC);
