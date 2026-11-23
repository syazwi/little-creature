/* UI, part 22 (v3.0): Chapter 10, Nujum Pak Belalang (see belalang.js). The goal line and the Journal's Chapter 10 page;
 * the Talk rows (Belalang and his chores, Pak Belalang and the truth, Sultan Muzaffar, Nenek); the jong's voyage to
 * Negeri Tanjung Bunga; the riddle contest (three riddles, answered with buttons); and Belalang in the Companions tab
 * while he walks with you (and Pelita's row while it is away). Mixed into LC.UIScene. Loads after UICompanions.js. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var C10 = LC.C10, X = LC.CH10TEXT;
  function q() { return LC.State.s.quests; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function cnt(id) { return LC.State.count(id); }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  LC.ch10DaysLeft = function () { var Q = q(); return Math.max(0, (Q.c10due || 0) - LC.State.s.day); };
  function daysText() { var d = LC.ch10DaysLeft(); return d > 1 ? d + ' days until Ahad' : d === 1 ? 'Ahad is tomorrow!' : 'Ahad is here!'; }

  LC.ch10Goal = function () {
    var Q = q(), st = Q.ch10 || 0;
    switch (st) {
      case 0: return 'Chapter 9 is complete! Rest at the farm. (Lately Pelita keeps watching the grasshoppers in the grass...)';
      case 1: return (Q.c10hop || 0) < C10.hops.length ? 'Chapter 10: Pelita is gone! Follow the glowing grasshopper across the farm (walk up to it).' : 'Chapter 10: look at what the grasshopper left at the end of the farm jetty.';
      case 2: return !Q.c10arrive ? 'Chapter 10: sail on the jong (farm jetty) to Negeri Tanjung Bunga, and find Pelita.' : 'Chapter 10: find Pelita and the boy, hiding somewhere in Tanjung Bunga. (Look for the gold glow.)';
      case 3:
        if (!Q.c10chores) return 'Chapter 10: talk to Belalang, by his father\'s hut at the west end of Tanjung Bunga.';
        var need = [];
        if ((Q.c10air || 0) < C10.water) need.push('water from the town well into the tempayan (' + (Q.c10air || 0) + ' / ' + C10.water + ')');
        if (!Q.c10give) need.push('3 kayu and 2 kelapa for Belalang');
        return need.length ? 'Chapter 10: Belalang\'s chores: ' + need.join(', and ') + '.' : 'Chapter 10: tell Belalang the chores are all done.';
      case 4:
        if (!Q.c10sultan) return 'Chapter 10: go to the Sultan, in front of the palace.';
        if (Q.c10won) return 'Chapter 10: take the Peti Pusaka Diraja from the thieves\' camp (Hutan Merbau, far west).';
        return Q.c10with ? 'Chapter 10: follow the thieves\' tracks west through Hutan Merbau. Stay near Pelita: the tracks show only in its light. (' + daysText() + ')'
          : 'Chapter 10: talk to Belalang to take him and Pelita into Hutan Merbau, west of the town. (' + daysText() + ')';
      case 5: return 'Chapter 10: carry the Peti Pusaka Diraja back to the Sultan in Tanjung Bunga.';
      case 6: return !Q.c10heard ? 'Chapter 10: after dark (7 PM), hide in the sampan under the foreign ship, by the jetty in Tanjung Bunga.' : 'Chapter 10: talk to the Sultan to begin the riddle contest.';
      case 7: return 'Chapter 10: help Pak Belalang tell the truth. (He is under his coconut tree, as usual.)';
    }
    return null;
  };
  var goal9 = LC.ch5Goal;
  LC.ch5Goal = function () { var Q = q(); return (Q.ch9 || 0) >= 7 && (Q.ch10 || 0) < 8 ? LC.ch10Goal() : goal9(); };

  // the jong sails to Tanjung Bunga too
  var jongRows = LC.jongExtraRows;
  LC.jongExtraRows = function (where) {
    var ui = this, W = this.world, rows = jongRows ? jongRows.call(this, where) : [], st = q().ch10 || 0;
    if (st >= 2 && where !== 'tanjung') rows.push({ icon: 'i_belalang_anyam', label: 'Sail to Negeri Tanjung Bunga', right: 'Sail', sub: 'A little kingdom of flowers down the coast' + (st < 8 ? '. Pelita is there, somewhere.' : '.'), action: function () { ui.closeModal(); W.sailTo('tanjung'); } });
    return rows;
  };

  Object.assign(LC.UIScene.prototype, {
    ch10Rows: function (vid) {
      var self = this, W = this.world, Q = q(), S = this.S, st = Q.ch10 || 0, rows = [];
      function sayLines(arr, opts) { self.say(W.ch2Lines(arr), opts); }
      function info(icon, label, sub, right) { rows.push({ icon: icon, label: label, sub: sub, right: right || '' }); }
      if (vid === 'nenek' && st >= 1 && st <= 7) rows.push({ icon: 'ic_moon', label: 'Pelita is missing', right: 'Talk', sub: 'Talk to Nenek about Pelita.', action: function () { sayLines([{ who: 'nenek', text: pick(X.nenekLost) }]); return 'close'; } });
      if (vid === 'nenek' && st >= 8) rows.push({ icon: 'i_belalang_anyam', label: 'Nujum Pak Belalang', right: 'Talk', sub: 'Tell Nenek about Tanjung Bunga.', action: function () { sayLines([{ who: 'nenek', text: pick(X.nenekAfter) }]); return 'close'; } });
      if (vid === 'belalang') {
        if (st === 3 && !Q.c10chores) rows.push({ icon: 'i_can', label: 'Your chores', right: 'Help', sub: 'Offer to help Belalang with his chores.', action: function () { Q.c10chores = 1; LC.Audio.sfx('chime'); sayLines(X.chores); return 'close'; } });
        if (st === 3 && Q.c10chores) {
          var air = Q.c10air || 0;
          info(air >= C10.water ? 'ic_bond' : 'i_can', (air >= C10.water ? '✓ ' : '') + 'Water for the tempayan: ' + Math.min(air, C10.water) + ' / ' + C10.water, 'Fill a bucket at the town well (by the road, south of Mak Jah\'s house), then pour it into the tempayan by the hut.', air >= C10.water ? 'Done' : '');
          if (!Q.c10give) {
            var row = this.craftRow('i_kayu', 'Firewood and coconuts', X.giveText, C10.give, 0, function () { Q.c10give = 1; LC.Audio.sfx('gift'); self.toast('Belalang stacks the firewood by the rice pot, and rolls the coconuts under the hut. "Thank you!"', 'i_kayu'); });
            rows.push(row);
          } else info('ic_bond', '✓ Firewood and coconuts', 'Stacked by the rice pot.', 'Done');
          if (air >= C10.water && Q.c10give) rows.push({ icon: 'ic_bond', label: 'All done!', right: 'Tell', sub: 'Tell Belalang the chores are finished.', action: function () { Q.ch10 = 4; LC.Audio.sfx('drum'); sayLines(X.secret); return 'close'; } });
        }
        if (st === 4 && !Q.c10sultan) info('ic_moon', 'The palace', '"Quick, to the Sultan! Father is coming... slowly."');
        if (st === 4 && Q.c10sultan && !Q.c10won) rows.push({ icon: 'i_belalang_anyam', label: 'Track the thieves', right: 'Go', sub: 'Take Belalang and Pelita into Hutan Merbau. Pelita\'s light shows the thieves\' footprints. (' + daysText() + ')', action: function () {
          Q.c10with = 1; LC.Audio.sfx('chime');
          if (W.area === 'tanjung') { W.npcLeave('belalang'); W.followBelalang10(); }
          sayLines(X.withYou); return 'close';
        } });
        if (st === 5) info('i_peti_diraja', 'The chest', '"Take it to the Sultan! He\'s going to be SO happy. Father is going to be SO smug."');
        if (st === 6) info('ic_moon', 'The riddles', Q.c10heard ? '"You heard them? All three? Go, go! Father is hiding behind the palace drum."' : '"Hide in the sampan under the ship, after dark. They practise on deck at night."');
        if (st === 7) info('ic_moon', 'Father', '"Please talk to Father. He has to tell the truth. He\'s under the coconut tree. As usual."');
        if (st >= 8) rows.push({ icon: 'i_belalang_anyam', label: 'The palace school', right: 'Talk', sub: 'Ask Belalang about school.', action: function () {
          sayLines([{ who: 'belalang', text: pick(['The palace teachers make us write with a pen! I wrote PELITA forty times.', 'Father picked eleven mangoes this morning. Eleven! He says it is a record. It is.', 'The Sultan asks me riddles at lunch. I get them all. He pretends to be cross.', 'Is Pelita being good? Tell him I said hello. Tell him I miss him a little. Only a little.']) }]); return 'close';
        } });
        if (st >= 8 && Q.c10sumpitOwed) rows.push({ icon: 'i_sumpit', label: 'Your sumpit', right: 'Take', enabled: LC.State.canAdd('sumpit'), why: 'Your bag is full! Make room first.', sub: 'Belalang kept his blowpipe safe for you.', action: function () {
          LC.State.add('sumpit', 1); delete Q.c10sumpitOwed; LC.Audio.sfx('gift'); self.toast('You got the Sumpit! Hold it and press USE to shoot.', 'i_sumpit');
        } });
      }
      if (vid === 'pak_belalang' && st === 7) rows.push({ icon: 'ic_bond', label: 'The truth', right: 'Talk', sub: 'Help Pak Belalang find the courage to tell the Sultan the truth.', action: function () {
        sayLines(X.truthAsk, { choices: [{ label: 'The Sultan is kind. Tell him the truth', fn: function () { W.c10Finale(); } }, { label: 'Not yet' }] }); return 'close';
      } });
      if (vid === 'pak_belalang' && st >= 8) rows.push({ icon: 'i_mangga', label: 'The royal orchards', right: 'Talk', sub: 'Ask Pak Belalang about his new job.', action: function () {
        sayLines([{ who: 'pak_belalang', text: pick(['Up at dawn! Every day! Mangoes do not pick themselves, it turns out. I asked them to.', 'I am the keeper of the royal orchards. It is honest work. It is very, very honest. My back is very honest about it.', 'Belalang reads to me in the evenings now. Books! I fall asleep, but that is a compliment.', 'The Sultan says I am the only man in the palace who tells him the truth. So I told him his riddles are terrible. He laughed for an hour.']) }]); return 'close';
      } });
      if (vid === 'lampir' && Q.c10nek) rows.push({ icon: 'ic_nek', label: 'The crocodile', right: 'Talk', sub: 'Ask Nek Lampir about her fortune.', action: function () { sayLines([{ who: 'lampir', text: pick(X.nek.talk) }]); return 'close'; } });
      if (vid === 'sultan_muzaffar') {
        if (st === 4 && !Q.c10sultan) rows.push({ icon: 'ic_moon', label: 'The stolen chest', right: 'Ask', sub: 'Ask the Sultan what has happened.', action: function () { Q.c10sultan = 1; Q.c10due = S.day + C10.days; LC.Audio.sfx('drum'); sayLines(X.sultan); return 'close'; } });
        if (st === 4 && Q.c10sultan) info('i_peti_diraja', 'Until Ahad', '"My chest! Have you found my chest?" (' + daysText() + (Q.c10late ? '. He has already given you one more week.' : '. Bring it back before then for an extra reward.') + ')');
        if (st === 5) rows.push({ icon: 'i_peti_diraja', label: 'Return the Peti Pusaka Diraja', right: 'Give', enabled: cnt('peti_diraja') > 0, why: 'You need the Peti Pusaka Diraja (the thieves\' camp, Hutan Merbau).', sub: 'Give the Sultan back his heirloom chest.', action: function () {
          LC.State.remove('peti_diraja', 1); Q.ch10 = 6;   // (first)
          S.kepeng += C10.chestGift; S.stats.earned += C10.chestGift;
          var lines = X.giveBack.slice();
          lines.splice(4, 0, { who: 'sultan_muzaffar', text: (Q.c10late ? 'A little late, but my grandmother forgives you. Here, for your trouble.' : X.onTime) + ' (+' + C10.chestGift + ' kepeng)' });
          LC.Audio.sfx('cheer'); W.refreshWhen();
          sayLines(lines); return 'close';
        } });
        if (st === 6) rows.push({ icon: 'ic_chap', label: 'The riddle contest', right: 'Begin', sub: Q.c10heard ? 'Three riddles from Tok Nujum Jambul. You know the answers... don\'t you?' : 'Three riddles from Tok Nujum Jambul. (Belalang had an idea: hide in the sampan under their ship after dark, and listen.)', action: function () { self.openRiddles10(); return 'close'; } });
        if (st >= 8) rows.push({ icon: 'ic_chap', label: 'A riddle', right: 'Talk', sub: 'The Sultan has a new riddle for you.', action: function () {
          sayLines([{ who: 'sultan_muzaffar', text: pick(['What has a mouth but never eats, and a bed but never sleeps? A river! Ha! I made Belalang guess for an hour. He got it in a minute.', 'Kalau dah besar, kecil pula. What gets smaller the bigger it is? ...I forget the answer. Pak Belalang says it is "a nap". I do not think so.', 'Why did the mango blush? Because it saw the salad dressing! ...That one is from Antah Berantah. Tok Jambul writes to me now.', 'My grandmother says honesty is the best riddle: everyone knows the answer, and hardly anyone says it.']) }]); return 'close';
        } });
      }
      return rows;
    },
    ch10ChapterRows: function () {
      var Q = q(), st = Q.ch10 || 0, rows = [];
      rows.push({ icon: 'i_belalang_anyam', label: 'Chapter 10: Nujum Pak Belalang' + (st >= 8 ? '  (complete)' : ''), right: st >= 8 ? 'Done' : '', sub: LC.ch10Goal() || 'Pelita is home, the Sultan has an honest friend, and Belalang is going to school.' });
      [[1, 'Pelita is gone', 'A grasshopper glowing with Pelita\'s gold, and a woven one at the end of the jetty.'], [2, 'Hide-and-seek', 'A boy called Belalang, and a little light that does not want to leave him.'],
       [3, 'Belalang\'s chores', 'Buckets, firewood, coconuts, and a secret: who really finds the lost things.'], [4, 'The stolen chest', 'Footprints in Pelita\'s light, and the Kerengga gang.'],
       [5, 'Back to the Sultan', 'The heirloom chest, and a ship with black and red sails.'], [6, 'The riddle contest', 'A sampan in the dark, and three riddles.'], [7, 'The truth', 'An honest fortune teller, and Pelita comes home.']].forEach(function (s) {
        if (st < s[0]) return;
        var doneS = st > s[0];
        rows.push({ icon: doneS ? 'ic_bond' : 'ic_moon', label: (doneS ? '✓ ' : '') + s[1], right: doneS ? 'Done' : 'Now', sub: s[2] });
      });
      if (st >= 5) rows.push(Q.c10nek ? { icon: 'ic_nek', label: '✓ Nek Lampir\'s fortune', right: 'Done', sub: 'A tall, handsome crocodile. And a cat, whether she likes it or not.' }
        : { icon: 'ic_nek', label: 'Nek Lampir\'s fortune (optional)', right: 'Now', sub: 'Somebody is waiting under Pak Belalang\'s coconut tree in Tanjung Bunga, demanding a reading.' });
      return rows;
    },

    // ================================================================ the riddle contest: three riddles, answered with buttons
    openRiddles10: function () {
      var self = this, W = this.world, Q = q();
      function ask(k) {
        if (k >= X.riddles.length) {
          Q.ch10 = 7;   // (first)
          LC.Audio.sfx('cheer'); if (W && W.cameras) W.cameras.main.flash(400, 255, 230, 160);
          self.say(W.ch2Lines(X.won6));
          return;
        }
        var R = X.riddles[k];
        self.say(W.ch2Lines([{ who: 'jambul', text: R.q }]), { choices: shuffle([0, 1, 2, 3]).map(function (i) { return { label: R.a[i], fn: function () {
          if (i === 0) { LC.Audio.sfx('chime'); self.say(W.ch2Lines(R.right), { onDone: function () { ask(k + 1); } }); }
          else { LC.Audio.sfx('error'); self.say(W.ch2Lines(X.wrong), { onDone: function () { ask(k); } }); }
        } }; }) });
        if (LC.DEVELOPER_HTML) self.modal.devAnswer = R.a[0];
      }
      LC.Audio.sfx('drum');
      this.say(W.ch2Lines(X.contest), { onDone: function () { ask(0); } });
    }
  });

  // ---------------------------------------------------------------- hooks
  var specialRows = LC.UIScene.prototype.specialRows;
  LC.UIScene.prototype.specialRows = function (vid, v, por) {
    var rows = specialRows.call(this, vid, v, por);
    return (this.S.quests.ch9 || 0) >= 7 ? rows.concat(this.ch10Rows(vid)) : rows;
  };
  var chapterRows = LC.UIScene.prototype.chapterRows;
  LC.UIScene.prototype.chapterRows = function () {
    var rows = chapterRows.call(this);
    return (this.S.quests.ch10 || 0) >= 1 ? rows.concat(this.ch10ChapterRows()) : rows;
  };
  // Belalang counts as a companion while he walks with you (and can be sent home); Pelita's row says where it is
  var companionCount = LC.WorldScene.prototype.companionCount;
  LC.WorldScene.prototype.companionCount = function () { return companionCount.apply(this, arguments) + (this.c10 && this.c10.fol ? 1 : 0); };
  var companionRows = LC.UIScene.prototype.companionRows;
  LC.UIScene.prototype.companionRows = function () {
    var rows = companionRows.apply(this, arguments), W = this.world;
    if (LC.pelitaAway() && rows[0]) rows[0] = { companionId: 'pelita', companionStatus: 'With Belalang', icon: 'ic_bond',
      label: 'Pelita  (with Belalang, in Tanjung Bunga)', sub: 'Pelita followed Belalang home to Tanjung Bunga. Its needs are paused until you bring it home.' };
    if (W && W.c10 && W.c10.fol) rows.splice(1, 0, { companionId: 'belalang', companionStatus: 'With you', icon: 'npc_belalang_0',
      iconScale: 1.6, label: 'Belalang  (with you)', right: 'Send home',
      sub: 'He walks with you, with Pelita above his head. Pelita\'s light shows the thieves\' footprints in Hutan Merbau.', action: function () { W.c10SendHome(); } });
    return rows;
  };
})(window.LC);
