/* Wak Juru's smithy, and the crew and racing screens for Kampong Ayer. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var R = LC.PerahuRace, St = LC.State, PLACES = ['1st', '2nd', '3rd', '4th', '5th'];

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
      var track = this.add.graphics(), laneTop = Y + 52, first = X + 287, finish = X + 724;
      F.c.add(track);
      var lanes = race.boats.map(function (b, i) {
        var y = laneTop + 65 * i, middle = y + 29;
        track.fillStyle(i === 0 ? 0x113c47 : 0x153445, 1); track.fillRoundedRect(X + 23, y, 804, 58, 8);
        track.fillStyle(b.color, 1); track.fillRect(X + 23, y + 10, 4, 38);
        track.fillStyle(i === 0 ? 0x1a5969 : 0x1b465e, 1); track.fillRect(first - 42, y + 5, finish - first + 48, 48);
        track.lineStyle(1, 0x97d5df, 0.26);
        for (var x = first - 30; x < finish; x += 78) {
          track.lineBetween(x, y + 14, x + 15, y + 14); track.lineBetween(x + 19, y + 46, x + 37, y + 46);
        }
        for (var k = 0; k < 8; k++) {
          track.fillStyle(k % 2 ? 0x254454 : 0xe9f5ed, 1); track.fillRect(finish, y + 5 + k * 6, 6, 6);
          track.fillStyle(k % 2 ? 0xe9f5ed : 0x254454, 1); track.fillRect(finish + 6, y + 5 + k * 6, 6, 6);
        }
        var portrait = self.add.image(X + 49, middle, b.portrait);
        portrait.setScale(Math.min(1.75, 35 / Math.max(portrait.frame.width, portrait.frame.height)));
        var label = self.txt(X + 75, middle, b.name, 17, i === 0 ? '#ffdb72' : '#eef7ee', { oy: 0.5 });
        var boat = self.add.image(first, middle, 'perahu_race_boat_0').setOrigin(1, 0.5).setScale(1.7).setTint(b.color);
        var marker = self.txt(X + 807, middle, '0%', 16, '#d9eae5', { ox: 1, oy: 0.5 });
        F.c.add([portrait, label, boat, marker]);
        return { boat: boat, marker: marker, y: middle };
      });

      var meterX = X + 145, meterY = Y + 403, meterWidth = 560;
      var control = this.add.rectangle(480, Y + 473, 254, 50, 0xdca94f).setInteractive({ useHandCursor: true });
      var button = this.txt(480, Y + 473, 'ROW', 22, '#1b2b2c', { ox: 0.5, oy: 0.5 });
      var rhythm = this.txt(480, Y + 374, 'Stroke timing', 15, '#b0dddf', { ox: 0.5 });
      F.c.add([rhythm, control, button]);
      var last = this.time.now, drumBeat = -1, done = false;
      F.msg.setText('Ready in 3…');
      var close = this.runGame(F, function () {
        if (done) { close(); self.openPerahuRaceDock(); return; }
        var hit = R.row(race);
        if (!hit) return;
        LC.Audio.sfx(hit === 'perfect' ? 'chime' : 'water');
        F.msg.setText(hit === 'perfect' ? 'Perfect stroke!' : hit === 'good' ? 'Good stroke!' : 'Off beat. Watch the timing bar.');
        F.msg.setColor(hit === 'miss' ? '#ffb58c' : '#b8f0cf');
      }, function (now) {
        var dt = Math.min(0.1, (now - last) / 1000); last = now;
        if (done) return;
        R.advance(race, dt);
        var phase = R.phase(race), rowing = race.time >= 0, player = race.boats[0];
        if (!rowing) F.msg.setText('Ready in ' + Math.ceil(-race.time) + '…');
        else if (player.finish !== null) F.msg.setText('Waiting for the other crews to finish…').setColor('#fbecc8');
        else {
          if (race.time < 0.3) F.msg.setText('Row when the marker crosses the green zone!');
          var beat = R.beat(race);
          if (phase >= 0.5 && drumBeat !== beat) { drumBeat = beat; LC.Audio.sfx('drum'); }
        }
        race.boats.forEach(function (b, i) {
          var lane = lanes[i], fraction = b.distance / R.length;
          lane.boat.setPosition(first + (finish - first) * fraction, lane.y + (rowing && b.finish === null ? Math.sin(race.time * 5 + i) : 0));
          var frame = rowing && b.finish === null && Math.floor(race.time * 7 + i) % 2 ? 1 : 0;
          var key = 'perahu_race_boat_' + frame;
          if (lane.boat.texture.key !== key) lane.boat.setTexture(key);
          lane.marker.setText(b.finish === null ? Math.floor(fraction * 100) + '%' : b.finish.toFixed(2) + ' s');
        });
        var g = F.g;
        g.clear(); g.fillStyle(0x172a2f, 1); g.fillRoundedRect(meterX, meterY, meterWidth, 25, 6);
        g.fillStyle(0x50885c, 1); g.fillRect(meterX + (0.5 - race.window) * meterWidth, meterY + 3, race.window * 2 * meterWidth, 19);
        g.fillStyle(0xbde89e, 1); g.fillRect(meterX + (0.5 - race.perfect) * meterWidth, meterY + 3, race.perfect * 2 * meterWidth, 19);
        if (rowing && player.finish === null) { g.fillStyle(0xffedb5, 1); g.fillRect(meterX + phase * meterWidth - 3, meterY - 5, 6, 35); }
        var result = R.result(S, race);
        if (result) {
          done = true;
          control.setFillStyle(0x95d8bd); button.setText('Back to dock');
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
