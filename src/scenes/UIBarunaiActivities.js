/* Wak Juru's smithy, and the crew and racing screens for Kampong Ayer. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var R = LC.PerahuRace, St = LC.State, PLACES = ['1st', '2nd', '3rd', '4th', '5th'];
  var LINEUP = [
    [1, 'Take the river if you like, Poseidon. I am taking the finish line.'],
    [2, 'You can have the first bend, Queen. My crew owns the last stretch.'],
    [3, 'Listen to them, Naga Ibu. All that wind and neither boat has moved.'],
    [4, 'Then let us settle it, Lampir. I will meet you at the finish.']
  ];
  var CHALLENGES = [
    { at: 0.23, line: [1, 'That is the pace, Poseidon. Let us see you match it.'] },
    { at: 0.42, line: [2, 'Save your breath, Queen. I am saving mine for the sprint.'] },
    { at: 0.62, line: [3, 'The farmer is still in this, you two. Mind the yellow boat!'] },
    { at: 0.79, line: [4, 'The flags are in sight. One last push from every oar!'] }
  ];
  var VICTORY = [
    'That is how Barunai rows. Who wants another race?',
    'I told you I would take the finish line, Poseidon.',
    'I said my crew owned the last stretch. Good race, Queen.',
    'All that bragging from two sea rulers, and I beat the pair of you.',
    'My crew saved their best strokes for the last stretch. That was close!'
  ];
  var REMATCH = [
    'You earned that one. Our crew will be back for a rematch.',
    'Well rowed, Barunai. I want another race at the next tide.',
    'Enjoy the win, farmer. I will be taking that lane next time.',
    'Do not get too comfortable, farmer. Next time I am bringing my best paddle.',
    'You rowed as one crew. Next time I will make you work even harder.'
  ];

  function animateLane(lane, boat, x, clock, strokeAge, splashPower, speakingAge, finishAge, winner, detail) {
    var paddling = strokeAge >= 0 && strokeAge < 0.56;
    var effort = paddling ? Math.sin(Math.PI * strokeAge / 0.56) : 0;
    var frame = paddling ? 1 + Math.floor(strokeAge / 0.14) : 0;
    var y = lane.y + Math.sin(clock * 3 + lane.index) * 0.85 - effort * 1.7;
    var pitch = Math.sin(clock * 2.5 + lane.index) * 1.15 - effort * (2 + splashPower);
    var texture = 'perahu_race_boat_' + frame;
    if (lane.boat.texture.key !== texture) lane.boat.setTexture(texture);
    lane.boat.setPosition(x, y).setAngle(pitch);
    var talking = speakingAge >= 0 && speakingAge < 2.8;
    var talkHop = talking ? Math.abs(Math.sin(speakingAge * 9)) * 2.4 : 0;
    var cheer = winner && finishAge < 1.25 ? Math.abs(Math.sin(finishAge * 10)) * (1 - finishAge / 1.25) * 8 : 0;
    var blink = (clock + lane.index * 0.61) % 2.7 > 2.55;
    var face = blink ? lane.altFace : boat.portrait;
    if (lane.portrait.texture.key !== face) { lane.portrait.setTexture(face); lane.captain.setTexture(face); }
    lane.portrait.setY(lane.y - talkHop - cheer * 0.55).setAngle(talking ? Math.sin(speakingAge * 6) * 4 : 0);
    lane.captain.setPosition(x - 18 + effort * 2, y + 6 - talkHop - cheer).setAngle(pitch - effort * 9);
    lane.badge.setAlpha(talking || winner ? 0.17 : 0);
    lane.wake.setPosition(x - 61, y + 8).setScale(1.2 + effort * 0.4, 0.8 + effort * 0.22)
      .setAlpha(boat.distance > 0 && boat.finish === null ? (0.26 + effort * 0.42) * detail : 0);
    var spray = paddling ? Math.max(0, 1 - Math.abs(strokeAge - 0.26) / 0.16) : 0;
    lane.splash.setPosition(x - 44 - (paddling ? strokeAge * 12 : 0), y + 11 - spray * 4)
      .setScale(1.2 + spray * 0.3).setAlpha(spray * splashPower * detail);
  }

  function materials(cost) {
    return Object.keys(cost).map(function (id) {
      return LC.ITEMS[id].name + ' ' + Math.min(St.count(id), cost[id]) + '/' + cost[id];
    }).join(' · ');
  }

  Object.assign(LC.UIScene.prototype, {
    openBesiForge: function () {
      var self = this, S = this.S;
      this.openMenu({
        title: 'Kampong Pandai Besi', coins: true,
        footer: 'Wak Juru provides the metal. Bring the listed materials and keep a bag slot free.',
        tabs: [{ label: 'Craft weapons', rows: function () {
          return LC.BESI_RECIPES.map(function (recipe) {
            var it = LC.ITEMS[recipe.id], damage = St.weaponDamage(it);
            function blocked() {
              if (!St.has(recipe.cost)) return 'You need more materials.';
              if (S.kepeng < recipe.kepeng) return 'You need ' + recipe.kepeng + ' kepeng.';
              if (!St.canAdd(recipe.id)) return 'Free a slot in your bag first.';
              return '';
            }
            var why = blocked();
            var stats = 'Damage ' + it.dmg + (damage !== it.dmg ? ' (' + damage + ' with bonuses)' : '') + ' · Reach ' + it.reach + ' px · Cooldown ' + it.cd + ' s';
            return { icon: it.icon, label: it.name, sub: stats + '\n' + materials(recipe.cost), right: recipe.kepeng + ' k', enabled: !why, why: why,
              action: function () {
                var error = blocked();
                if (error) { self.toast(error); return; }
                St.takeAll(recipe.cost); S.kepeng -= recipe.kepeng; St.add(recipe.id, 1);
                LC.Audio.sfx('mine'); self.toast('Wak Juru crafted ' + it.name + '.', it.icon);
              } };
          });
        } }]
      });
    },

    openPerahuRaceDock: function () {
      var self = this, S = this.S, record = R.saved(S);
      this.openMenu({
        title: 'Kampong Ayer Boat Race',
        footer: function () { return record.wins + ' wins' + (record.best ? ' · Best time ' + record.best.toFixed(2) + ' s' : ''); },
        tabs: [
          { label: 'Race', rows: function () {
            var ready = record.crew.length === R.size;
            return [{ icon: 'perahu_race_dock', label: 'Start race · ' + record.crew.length + '/' + R.size + ' rowers', right: ready ? 'Race' : '',
              sub: ready ? 'Row in time with the drum to pick up speed.' : 'Talk to villagers by the Balai and workshops in Barunai to invite them.',
              enabled: ready, why: 'Invite ' + R.size + ' rowers in Barunai first.', action: function () { self.playPerahuRace(); } }].concat(R.rivals.map(function (r) {
              return { icon: r.portrait, label: r.name, sub: 'Rival captain' };
            }));
          } },
          { label: 'Your crew', rows: function () {
            var totals = R.totals(record.crew);
            var rows = [{ icon: 'perahu_race_dock', label: record.crew.length + '/' + R.size + ' rowers · Power ' + totals.power + ' · Timing ' + totals.timing,
              sub: 'Power makes strokes stronger. Timing widens the target on the rowing meter.' }];
            return rows.concat(record.crew.map(function (id) {
              var member = R.crew[id];
              return { icon: 'npc_' + LC.villagerKey(id) + '_0', label: LC.VILLAGERS[id].name,
                sub: 'Power ' + member.power + ' · Timing ' + member.timing, right: 'Remove',
                action: function () { record.crew = record.crew.filter(function (k) { return k !== id; }); LC.Audio.sfx('click'); } };
            }));
          } }
        ]
      });
    },

    playPerahuRace: function () {
      var self = this, S = this.S, record = R.saved(S);
      if (record.crew.length !== R.size) return;
      var race = R.create(record.crew, LC.Art.plKey(this.world.pc || 0) + '_down_0');
      var F = this.gameFrame('Kampong Ayer Regatta', 850, 578), X = F.X, Y = F.Y;
      var track = this.add.graphics(), laneTop = Y + 53, first = X + 287, finish = X + 724;
      F.c.add(track);
      var lanes = race.boats.map(function (b, i) {
        var y = laneTop + 54 * i, middle = y + 24;
        track.fillStyle(i === 0 ? 0x113c47 : 0x153445, 1); track.fillRoundedRect(X + 23, y, 804, 49, 8);
        track.fillStyle(b.color, 1); track.fillRect(X + 23, y + 6, 4, 36);
        track.fillStyle(i === 0 ? 0x1a5969 : 0x1b465e, 1); track.fillRect(first - 72, y + 5, finish - first + 82, 40);
        track.lineStyle(1, 0x97d5df, 0.26);
        for (var x = first - 58; x < finish; x += 78) {
          track.lineBetween(x, y + 11, x + 15, y + 11); track.lineBetween(x + 19, y + 40, x + 37, y + 40);
        }
        for (var k = 0; k < 8; k++) {
          track.fillStyle(k % 2 ? 0x254454 : 0xe9f5ed, 1); track.fillRect(finish, y + 5 + k * 5, 5, 5);
          track.fillStyle(k % 2 ? 0xe9f5ed : 0x254454, 1); track.fillRect(finish + 5, y + 5 + k * 5, 5, 5);
        }
        var badge = self.add.rectangle(X + 116, middle, 174, 38, b.color, 1).setAlpha(0);
        var portrait = self.add.image(X + 49, middle, b.portrait);
        portrait.setScale(32 / portrait.frame.height);
        var label = self.txt(X + 75, middle, b.name, 17, i === 0 ? '#ffdb72' : '#eef7ee', { oy: 0.5 });
        var wake = self.add.image(first, middle, 'perahu_race_wake').setAlpha(0);
        var boat = self.add.image(first, middle, 'perahu_race_boat_0').setOrigin(1, 0.5).setScale(1.6).setTint(b.color);
        var captain = self.add.image(first - 18, middle + 6, b.portrait).setOrigin(0.5, 1).setScale(21 / portrait.frame.height);
        var splash = self.add.image(first, middle, 'perahu_race_splash').setAlpha(0);
        var marker = self.txt(X + 807, middle, '0%', 16, '#d9eae5', { ox: 1, oy: 0.5 });
        var altFace = b.portrait.replace(/_0$/, '_1');
        F.c.add([badge, portrait, label, wake, boat, captain, splash, marker]);
        return { index: i, boat: boat, portrait: portrait, captain: captain, wake: wake, splash: splash, badge: badge,
          altFace: self.textures.exists(altFace) ? altFace : b.portrait, marker: marker, y: middle };
      });

      var conversation = this.add.graphics();
      conversation.fillStyle(0x1a2c34, 1); conversation.fillRoundedRect(X + 23, Y + 329, 804, 73, 9);
      conversation.lineStyle(1, 0x54737b, 0.85); conversation.strokeRoundedRect(X + 23, Y + 329, 804, 73, 9);
      var talker = this.add.image(X + 59, Y + 366, race.boats[0].portrait);
      var speaker = this.txt(X + 96, Y + 338, '', 17, '#ffdb72');
      var line = this.txt(X + 96, Y + 361, '', 17, '#f7edda', { wrap: 701 });
      var meterX = X + 145, meterY = Y + 431, meterWidth = 560;
      F.g.fillStyle(0x172a2f, 1); F.g.fillRoundedRect(meterX, meterY, meterWidth, 25, 6);
      F.g.fillStyle(0x50885c, 1); F.g.fillRect(meterX + (0.5 - race.window) * meterWidth, meterY + 3, race.window * 2 * meterWidth, 19);
      F.g.fillStyle(0xbde89e, 1); F.g.fillRect(meterX + (0.5 - race.perfect) * meterWidth, meterY + 3, race.perfect * 2 * meterWidth, 19);
      var needle = this.add.rectangle(meterX, meterY + 12, 6, 35, 0xffedb5).setVisible(false);
      var control = this.add.rectangle(480, Y + 485, 254, 44, 0xdca94f).setInteractive({ useHandCursor: true });
      var button = this.txt(480, Y + 485, 'Next line', 20, '#1b2b2c', { ox: 0.5, oy: 0.5 });
      var rhythm = this.txt(480, Y + 408, 'Stroke timing', 15, '#b0dddf', { ox: 0.5 });
      F.c.add([conversation, talker, speaker, line, rhythm, needle, control, button]);

      var last = this.time.now, drumBeat = -1, mode = 'lineup', intro = 0, challenge = 0, reply = null;
      var talking = 0, spokenAt = last, strokeAt = -1, power = 0, winner = -1, finishedAt = 0;
      var detail = 0.5 + LC.Display.preset().density * 0.5;
      function speak(words) {
        talking = words[0]; spokenAt = last;
        var b = race.boats[talking];
        talker.setTexture(b.portrait).setScale(45 / talker.frame.height);
        speaker.setText(b.name).setColor('#' + b.color.toString(16).padStart(6, '0'));
        line.setText(words[1]);
      }
      speak(LINEUP[0]);
      var close = this.runGame(F, function () {
        if (mode === 'lineup') {
          if (++intro < LINEUP.length) {
            speak(LINEUP[intro]);
            if (intro === LINEUP.length - 1) button.setText('Start race');
          } else {
            mode = 'racing'; button.setText('ROW');
            F.msg.setText('Ready in 3…');
            speak([0, 'Oars up. Row together when the drum hits.']);
          }
          return;
        }
        if (mode === 'finished') {
          if (reply) { speak(reply); reply = null; button.setText('Back to dock'); }
          else { close(); self.openPerahuRaceDock(); }
          return;
        }
        var hit = R.row(race);
        if (!hit) return;
        strokeAt = race.time;
        power = hit === 'perfect' ? 1 : hit === 'good' ? 0.73 : 0.34;
        LC.Audio.sfx(hit === 'perfect' ? 'chime' : 'water');
        F.msg.setText(hit === 'perfect' ? 'Perfect stroke!' : hit === 'good' ? 'Good stroke!' : 'Off beat. Watch the timing bar.');
        F.msg.setColor(hit === 'miss' ? '#ffb58c' : '#b8f0cf');
      }, function (now) {
        var dt = Math.min(0.1, (now - last) / 1000); last = now;
        if (mode === 'finished' && now - finishedAt > 1250 && now - spokenAt > 2800) return;
        var phase = R.phase(race), player = race.boats[0], leading = 0;
        if (mode === 'racing') {
          R.advance(race, dt); phase = R.phase(race);
          if (race.time < 0) F.msg.setText('Ready in ' + Math.ceil(-race.time) + '…');
          else if (player.finish !== null) F.msg.setText('Waiting for the other crews to finish…').setColor('#fbecc8');
          else {
            if (race.time < 0.3 && strokeAt < 0) F.msg.setText('Row when the marker crosses the green zone!');
            var beat = R.beat(race);
            if (phase >= 0.5 && drumBeat !== beat) { drumBeat = beat; LC.Audio.sfx('drum'); }
          }
        }
        var speechAge = (now - spokenAt) / 1000;
        talker.setY(Y + 366 - (speechAge < 2.8 ? Math.abs(Math.sin(speechAge * 9)) * 2.5 : 0));
        race.boats.forEach(function (b, i) {
          var lane = lanes[i], fraction = b.distance / R.length;
          leading = Math.max(leading, fraction);
          var rowing = mode === 'racing' && race.time >= 0 && b.finish === null;
          var paddle = rowing ? (i ? (race.time + i * 0.18) % (0.96 + i * 0.05) : race.time - strokeAt) : -1;
          if (i === 0 && strokeAt < 0) paddle = -1;
          animateLane(lane, b, first + (finish - first) * fraction, now / 1000, paddle, i ? 0.72 : power,
            i === talking ? speechAge : -1, (now - finishedAt) / 1000, i === winner, detail);
          lane.marker.setText(b.finish === null ? Math.floor(fraction * 100) + '%' : b.finish.toFixed(2) + ' s');
        });
        if (mode === 'racing' && challenge < CHALLENGES.length && leading >= CHALLENGES[challenge].at) speak(CHALLENGES[challenge++].line);
        needle.setX(meterX + phase * meterWidth).setVisible(mode === 'racing' && race.time >= 0 && player.finish === null);
        var result = mode === 'racing' && R.result(S, race);
        if (result) {
          mode = 'finished'; finishedAt = now;
          var ranked = race.boats.slice().sort(function (a, b) { return a.finish - b.finish; });
          winner = race.boats.indexOf(ranked[0]);
          var responder = winner === 0 ? race.boats.indexOf(ranked[1]) : 0;
          speak([winner, VICTORY[winner]]);
          reply = [responder, REMATCH[responder]];
          control.setFillStyle(0x95d8bd); button.setText('Next line');
          F.msg.setText(PLACES[result.place - 1] + ' place · ' + result.time.toFixed(2) + ' s' + (result.prize ? ' · +' + result.prize + ' kepeng' : '')).setColor('#fbecc8');
          LC.Audio.sfx(result.place === 1 ? 'cheer' : 'chime');
        }
      });
      this.closeX(F.c, X + F.W, Y, function () { close(); });
      var modal = this.modal, key = modal.key;
      modal.key = function (code, ev) { if (!ev || !ev.repeat) key(code); };
    }
  });

  var specialRows = LC.UIScene.prototype.specialRows;
  LC.UIScene.prototype.specialRows = function (vid, v, portrait) {
    var self = this, S = this.S, rows = specialRows.call(this, vid, v, portrait);
    if (vid === 'juru') rows.push({ icon: 'i_parang', label: 'Craft weapons', sub: 'Compare damage, reach, and swing cooldown.', action: function () { self.openBesiForge(); } });
    if (this.world.area !== 'barunai' || (LC.worldQuests().kaStage || 0) < 2 || !Object.prototype.hasOwnProperty.call(R.crew, vid)) return rows;
    var list = R.saved(S).crew, member = R.crew[vid];
    var joined = list.includes(vid), full = list.length >= R.size;
    rows.push({ icon: 'perahu_race_dock', label: joined ? 'On your race crew' : 'Invite to your race crew',
      sub: 'Power ' + member.power + ' · Timing ' + member.timing + ' · ' + list.length + '/' + R.size + ' rowers',
      right: joined ? 'Joined' : 'Invite', enabled: !joined && !full, why: joined ? v.name + ' is already on your crew.' : 'Remove a rower at the race dock first.',
      action: function () {
        if (R.invite(S, vid)) { LC.Audio.sfx('chime'); self.toast(v.name + ' joined your crew. (' + R.saved(S).crew.length + '/' + R.size + ')', portrait); }
      } });
    return rows;
  };
})(window.LC);
