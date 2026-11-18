/* UI, part 5 (v1.7): Badang. Grabbing the slippery river hantu, Badang's Talk menu (the night watch, coming along,
 * clearing land), the Pesta's Lempar Batu contest (Badang throws, you cheer), and his line in your Journal.
 * Mixed into LC.UIScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  function rnd(a, b) { return a + Math.random() * (b - a); }
  var POR = 'npc_badang_0', PORK = 'npc_badangK_0';

  Object.assign(LC.UIScene.prototype, {
    // ================================================================ grab the hantu: three good grabs before it slips away twice
    openGrab: function (done) {
      var self = this, F = this.gameFrame('Grab the hantu!', 520, 380), g = F.g, X = F.X, Y = F.Y;
      var hits = 0, misses = 0, t0 = this.time.now, over = false, speeds = [3.0, 3.8, 4.6];
      var h = this.add.sprite(X + 260, Y + 216, 'hantu_air_0').setScale(6).setOrigin(0.5, 1);
      h.play('hantu_air_idle');
      F.c.add(h);
      F.msg.setText('Its beard is slippery! Tap when the marker is in the green (3 good grabs).');
      LC.Audio.sfx('giggle');
      function pos(now) { return 0.5 + 0.5 * Math.sin((now - t0) / 1000 * speeds[Math.min(2, hits)]); }
      var close = this.runGame(F, function () {
        if (over) return;
        var a = pos(self.time.now);
        if (a >= 0.4 && a <= 0.6) {
          hits++; LC.Audio.sfx('hit');
          self.tweens.add({ targets: h, scaleX: 5.2, scaleY: 6.6, duration: 90, yoyo: true });
          F.msg.setText(['Got its beard!', 'It wriggles... hold on!', 'GOT IT!'][hits - 1]).setColor('#b8f0c8');
          if (hits >= 3) { over = true; self.time.delayedCall(700, function () { close(); done(true); }); }
        } else {
          misses++; LC.Audio.sfx('giggle');
          self.tweens.add({ targets: h, x: h.x + (Math.random() < 0.5 ? -18 : 18), duration: 80, yoyo: true, repeat: 1 });
          F.msg.setText(misses >= 2 ? 'Splash! It slipped out of your hands!' : 'Hihihi! Too slippery! (one more slip and it escapes)').setColor('#ff8a7a');
          if (misses >= 2) { over = true; self.time.delayedCall(800, function () { close(); done(false); }); }
        }
        t0 = self.time.now - Math.random() * 400;
      }, function (now) {
        g.clear();
        for (var i = 0; i < 3; i++) { g.fillStyle(i < hits ? 0x9be15d : 0x5a4a3a, 1); g.fillCircle(X + 228 + i * 32, Y + 248, 8); }
        if (over) return;
        var BX = X + 80, BW = 360, BY = Y + 270, a = pos(now);
        g.fillStyle(0x000000, 0.6); g.fillRect(BX, BY, BW, 16);
        g.fillStyle(0x6fd06a, 1); g.fillRect(BX + 0.4 * BW, BY + 1, 0.2 * BW, 14);
        g.fillStyle(0xffd166, 1); g.fillRect(BX + a * BW - 2, BY - 5, 4, 26);
      }, function () { done(false); });
    },

    // ================================================================ Badang's Talk menu
    badangAsk: function () {
      var self = this, S = this.S;
      this.say([{ name: 'Badang', portrait: POR, text: LC.BADANG.ask }], { choices: [
        { label: 'I\'ll keep watch with you', fn: function () { S.quests.badang = 2; LC.Audio.sfx('chime'); self.time.delayedCall(150, function () { self.say([{ name: 'Badang', portrait: POR, text: LC.BADANG.agree }]); }); } },
        { label: 'Not now', fn: function () { S.quests.badang = Math.max(1, S.quests.badang || 0); self.time.delayedCall(150, function () { self.say([{ name: 'Badang', portrait: POR, text: LC.BADANG.later }]); }); } }
      ] });
    },
    badangRows: function () {
      var self = this, S = this.S, W = this.world, q = S.quests.badang || 0, B = LC.BADANG, rows = [];
      var night = S.minutes >= 19 * 60 || S.minutes < 6 * 60;
      if (q <= 1) rows.push({ icon: 'i_bubu', label: 'Help Badang catch the fish thief', sub: 'Something empties his bubu every night.', action: function () { self.badangAsk(); return 'close'; } });
      if (q === 2) rows.push({ icon: 'i_bubu', label: night ? 'The night watch' : 'Keep watch tonight', sub: night ? 'Something is giggling by the pool... grab it! (Sumpahan Batu would hold it still.)' : 'Come back to the forest pool after dark (7 PM).',
        action: function () { self.say([{ name: 'Badang', portrait: POR, text: night ? B.night : B.day }]); return 'close'; } });
      if (q < 3) return rows;
      if (S.quests.bubuOwed) rows.push({ icon: 'i_bubu', label: 'Take his old bubu', sub: 'He kept them for you while your bag was full.', action: function () {
        if (S.inv.filter(function (sl) { return !sl; }).length < 1 && !LC.State.count('bubu')) { self.toast('Make room in your bag first!'); LC.Audio.sfx('error'); return; }
        LC.State.add('bubu', 2); delete S.quests.bubuOwed; LC.Audio.sfx('chime');
        self.toast('Badang gives you 2 Bubu. Set them in any river, pool, lake or the sea!', 'i_bubu');
      } });
      if (LC.badangBuddy()) rows.push({ icon: 'ic_badang', label: 'Send him home to rest', sub: 'Badang is walking with you today.', action: function () { W.sendBuddyHome(); return 'close'; } });
      else rows.push({ icon: 'ic_badang', label: 'Come with me today!', sub: S.buddyDay === S.day ? 'He already went out with you today. Tomorrow!' : 'He follows you all day and fights anything that threatens you (once a day).',
        enabled: S.buddyDay !== S.day, why: 'Once a day. He needs his rest (and his supper).',
        action: function () { self.say([{ name: 'Badang', portrait: PORK, text: B.come }], { onDone: function () { W.startBuddy(); } }); return 'close'; } });
      var Lg = LC.LADANG, need = Object.keys(Lg.cost).map(function (id) { return Lg.cost[id] + ' ' + LC.ITEMS[id].name + ' (' + LC.State.count(id) + ')'; }).join(', ');
      if (!S.ladang) {
        var ok = LC.State.has(Lg.cost) && S.kepeng >= Lg.kepeng;
        rows.push({ icon: 'i_kayu', label: 'Clear the land south of Nenek\'s field', sub: 'Big old stumps and boulders. For a feast of ' + need + ' and ' + Lg.kepeng + ' kepeng, he will clear them in one night: a new field!',
          right: ok ? 'Ask' : '', enabled: ok, why: 'You need ' + need + ' and ' + Lg.kepeng + ' kepeng.', action: function () {
            LC.State.takeAll(Lg.cost); S.kepeng -= Lg.kepeng;
            W.doShared('ladang', {}, function (res) {
              if (!res || !res.ok) { Object.keys(Lg.cost).forEach(function (id) { LC.State.add(id, Lg.cost[id]); }); S.kepeng += Lg.kepeng; self.toast('Someone already asked Badang to clear it!'); return; }
              LC.Audio.sfx('build');
              self.say([{ name: 'Badang', portrait: PORK, text: B.ladangAsk }]);
            });
            return 'close';
          } });
      } else rows.push({ icon: 'i_kayu', label: S.ladang === 1 ? 'Clearing the land tonight' : 'Ladang Badang', sub: S.ladang === 1 ? 'He will clear the stumps and boulders south of Nenek\'s field overnight.' : 'The new field south of Nenek\'s fence, cleared by Badang. Till it and plant!' });
      rows.push({ icon: 'i_kayu', label: 'Gotong-royong houses', sub: 'With Badang carrying the posts, new houses on the kampung plots are raised at once, not overnight.' });
      rows.push({ icon: 'ic_badang', label: 'Lempar Batu at the Pesta', sub: 'Every Sabtu, cheer him on in the stone-throwing contest at the pavilion.' + ((S.trophies.lempar || 0) ? ' Champion ' + S.trophies.lempar + 'x!' : '') });
      return rows;
    },

    // ================================================================ Lempar Batu: Badang throws, you cheer
    playLempar: function (round, rival, done) {
      var self = this, F = this.gameFrame('Lempar Batu · Round ' + (round + 1) + ' vs ' + rival, 660, 430), g = F.g, X = F.X, Y = F.Y;
      var theirs = Math.round(rnd.apply(null, [[34, 42], [42, 50], [48, 56]][round])), bonus = LC.State.hearts('badang') * 0.6;
      var phases = ['Angkat! (lift)', 'Pusing! (spin)', 'Lempar! (throw)'], speed = [2.6, 3.3, 4.0], k = 0, acc = 0, t0 = this.time.now, over = false, mine = 0;
      var GY = Y + 300, X0 = X + 150, PX = 7;   // ground line; the throwing line; pixels per depa
      function xAt(d) { return X0 + d * PX; }
      var bad = this.add.sprite(X + 100, GY, PORK).setScale(4).setOrigin(0.5, 1), rock = this.add.image(X + 100, GY - 6, 'batu_lempar').setScale(3).setOrigin(0.5, 1);
      var flag = this.txt(xAt(theirs), Y + 94, rival + ': ' + theirs, 13, '#ffb0b0', { ox: 0.5 }), tMine = this.txt(X + F.W / 2, Y + 66, '', 18, '#ffd166', { ox: 0.5 });
      bad.play('npc_badangK_idle');
      F.c.add([bad, rock, flag, tMine]);
      F.msg.setText(phases[0] + '  Cheer when the marker is in the centre!');
      function aim(now) { return 0.5 + 0.5 * Math.sin((now - t0) / 1000 * (speed[k] + round * 0.3)); }
      function throwIt() {
        mine = Math.round(28 + 11 * acc + bonus);
        LC.Audio.sfx('throw');
        var x1 = Math.min(X + F.W - 30, xAt(mine)), o = { t: 0 }, sx = rock.x, sy = rock.y;
        self.tweens.add({ targets: o, t: 1, duration: 1300, ease: 'Sine.easeIn', onUpdate: function () {
          rock.setPosition(sx + (x1 - sx) * o.t, sy - 150 * Math.sin(Math.PI * o.t) + (GY + 14 - sy) * o.t).setAngle(o.t * 540);
        }, onComplete: function () {
          LC.Audio.sfx('splash');
          rock.setVisible(false);
          var sp = self.add.image(x1, GY + 14, 'glow').setTint(0xcfefff).setBlendMode(Phaser.BlendModes.ADD).setScale(0.8, 0.4); F.c.add(sp);
          self.tweens.add({ targets: sp, scaleX: 1.6, scaleY: 0.9, alpha: 0, duration: 600 });
          var win = mine >= theirs;
          tMine.setText('Badang: ' + mine + ' depa!');
          F.msg.setText(win ? 'What a throw! The crowd goes wild!' : rival + ' threw further...').setColor(win ? '#b8f0c8' : '#ff8a7a');
          self.time.delayedCall(1500, function () { close(); done(win, 'Badang\'s stone flew ' + mine + ' depa; ' + rival + '\'s flew ' + theirs + '.' + (win ? ' The whole pavilion shakes with cheering!' : ' Badang shrugs and grins.')); });
        } });
      }
      var close = this.runGame(F, function () {
        if (over || k >= 3) return;
        var a = aim(self.time.now), q = Math.max(0, 1 - Math.abs(a - 0.5) * 2);
        acc += q; k++;
        LC.Audio.sfx(q >= 0.8 ? 'cheer' : 'drum');
        var cheer = self.txt(X + 100 + rnd(-40, 40), GY - 120, q >= 0.8 ? 'Hebat!' : q >= 0.5 ? 'Bagus!' : 'Alamak...', 18, q >= 0.8 ? '#b8f0c8' : q >= 0.5 ? '#fbecc8' : '#ff8a7a', { ox: 0.5 });
        F.c.add(cheer); self.tweens.add({ targets: cheer, y: cheer.y - 30, alpha: 0, duration: 900, onComplete: function () { cheer.destroy(); } });
        if (k === 1) { LC.Audio.sfx('strain'); self.tweens.add({ targets: rock, y: GY - 108, duration: 300, ease: 'Back.easeOut' }); }
        if (k === 2) { self.tweens.add({ targets: bad, scaleX: -4, duration: 120, yoyo: true, repeat: 3 }); }
        if (k < 3) { t0 = self.time.now; F.msg.setText(phases[k] + '  (' + Math.round(q * 100) + '% cheer)'); }
        else { over = true; F.msg.setText('Badang hurls the stone!'); throwIt(); }
      }, function (now) {
        g.clear();
        for (var i = 0; i < 5; i++) { g.fillStyle([0x7ab8e8, 0x8ac4ec, 0x9ad0f0, 0xaadaf2, 0xbae2f4][i], 1); g.fillRect(X + 24, Y + 80 + i * 44, F.W - 48, 44); }
        g.fillStyle(0x6aa84f, 1); g.fillRect(X + 24, GY, X0 - X - 10, 40); g.fillStyle(0x8a6a3a, 1); g.fillRect(X0 - 14, GY, 4, 40);
        g.fillStyle(0x3a7ab8, 1); g.fillRect(X0 - 10, GY + 8, X + F.W - 24 - X0 + 10, 32); g.fillStyle(0x5a9ac8, 1); g.fillRect(X0 - 10, GY + 8, X + F.W - 24 - X0 + 10, 3);
        for (var d = 10; d <= 60; d += 10) { var xx = xAt(d); if (xx > X + F.W - 30) break; g.fillStyle(0xffffff, 0.5); g.fillRect(xx, GY + 6, 1, 6); }
        g.fillStyle(0xe76f51, 1); g.fillRect(xAt(theirs) - 1, Y + 112, 2, GY + 8 - Y - 112); g.fillTriangle(xAt(theirs) + 1, Y + 112, xAt(theirs) + 13, Y + 118, xAt(theirs) + 1, Y + 124);
        if (over) return;
        var BX = X + 150, BW = 360, BY = Y + 352, a = aim(now);
        g.fillStyle(0x000000, 0.6); g.fillRect(BX, BY, BW, 16); g.fillStyle(0x6fd06a, 1); g.fillRect(BX + 0.42 * BW, BY + 1, 0.16 * BW, 14);
        g.fillStyle(0xffd166, 1); g.fillRect(BX + a * BW - 2, BY - 5, 4, 26);
        for (var j = 0; j < 3; j++) { g.fillStyle(j < k ? 0x9be15d : 0x5a4a3a, 1); g.fillCircle(BX + BW + 24 + j * 18, BY + 8, 6); }
      }, function () { done(false, 'Badang puts the stone down gently and steps out of the ring.'); });
    }
  });

  // ---------------------------------------------------------------- hooks into the villager menus, the Pesta and the Journal
  var specialRows = LC.UIScene.prototype.specialRows;
  LC.UIScene.prototype.specialRows = function (vid, v, por) {
    var rows = specialRows.call(this, vid, v, por);
    return vid === 'badang' ? rows.concat(this.badangRows()) : rows;
  };
  var youRows = LC.UIScene.prototype.youRows;
  LC.UIScene.prototype.youRows = function () {
    var rows = youRows.call(this), S = this.S, q = S.quests.badang || 0;
    if (q >= 3) rows.push({ icon: 'ic_badang', label: 'Badang, the strongest man in the land', sub: 'Your friend in Kampung Tepian. Once a day he walks with you and fights for you; he clears land, raises houses at once, and throws stones at the Pesta' + ((S.trophies.lempar || 0) ? ' (champion ' + S.trophies.lempar + 'x)' : '') + '. Bubu set: ' + (S.bubus || []).length + ' / 3.' });
    else if (q >= 1) rows.push({ icon: 'i_bubu', label: 'Badang\'s empty bubu', sub: q === 2 ? 'Keep watch with him at the forest pool in Hutan Rimba after dark (7 PM), and grab the thief!' : 'Badang, by the forest pool in Hutan Rimba, needs help catching whoever steals his fish.' });
    return rows;
  };
  LC.CONTESTS.lempar.onChamp = function (lines) {
    var S = this.S;
    if (S.trophies.lempar !== 1) return;
    S.quests.badang = Math.max(4, S.quests.badang || 0);
    LC.badangLines(LC.BADANG.champ).forEach(function (l) { lines.push(l); });
    if (this.world && this.world.refreshBatuBadang) this.world.refreshBatuBadang();
  };
})(window.LC);
