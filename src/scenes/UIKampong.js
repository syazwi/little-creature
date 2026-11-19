/* UI, part 8 (v2.0): Chapter 3, Kampong Ayer (part 1). Pateh Berbai's building rows, the craftspeople's services,
 * the padian boats, the house pilings, Awang Senuai's training and the great cockfight, the goal line and the
 * Journal's Chapter 3 page. Mixed into LC.UIScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  function q() { return LC.State.s.quests; }
  function need(map) { return Object.keys(map).map(function (id) { return LC.ITEMS[id].name + ' ' + Math.min(LC.State.count(id), map[id]) + '/' + map[id]; }).join(', '); }
  function canPay(map, k) { return LC.State.has(map) && LC.State.s.kepeng >= k; }
  function payWhy(map, k) { return !LC.State.has(map) ? 'You still need: ' + need(map) + '.' : 'Not enough kepeng (' + k + ' needed).'; }
  var TAXI = [['The west jetty', { x: 6, y: 17 }, 'down', 0], ['The Balai steps', { x: 24, y: 16 }, 'up', 0], ['The craft quarter', { x: 24, y: 27 }, 'down', 1],
    ['The floating market', { x: 3, y: 23 }, 'left', 2], ['The old fishing landing', { x: 40, y: 16 }, 'down', 0]];
  var TAXI_FARE = 20;

  // the current Chapter 3 task, for the goal line and the Journal
  LC.ch3Goal = function () {
    var S = LC.State.s, Q = S.quests, st = Q.ch3 || 0, K;
    if ((Q.ch2 || 0) < 8) return null;
    switch (st) {
      case 0: return 'Chapter 3: talk to Pateh Berbai in Barunai. He has been thinking about the river.';
      case 1: case 2: case 3: K = LC.KA_STAGES[st]; return 'Chapter 3: build ' + K.name + ' with Pateh Berbai (' + need(K.cost) + ', ' + K.kepeng + ' kepeng).';
      case 4: return 'Chapter 3: red and white sails at the river mouth! Talk to Awang Alak Betatar.';
      case 5: return S.day === Q.ch3trainDay ? 'Chapter 3: Mutiara is resting. Train him again tomorrow (' + (Q.ch3train || 0) + ' / 3).' : 'Chapter 3: help Awang Senuai train Mutiara in Barunai (' + (Q.ch3train || 0) + ' / 3, once a day).';
      case 6: return 'Chapter 3: the great cockfight! Talk to Awang Senuai when you are ready.';
      case 7:
        if (!Q.buluMutiara) return 'Chapter 3: row out to Teluk Barunai from the west jetty, and visit the stone rooster on Lumut Lunting.';
        if (!LC.State.count('pinggan_emas')) return 'Chapter 3: a ghost crows on Pulau Pilong-Pilongan at night. Awang Kilau the goldsmith could make a golden plate.';
        return 'Chapter 3: after 7 PM, bring the golden plate and the stone feather to the ghost rooster on Pulau Pilong-Pilongan.';
    }
    return null;
  };
  var ch2Goal = LC.ch2Goal;
  LC.ch2Goal = function () { var S = LC.State.s; return (S.quests.ch2 || 0) >= 8 ? LC.ch3Goal() : ch2Goal(); };

  Object.assign(LC.UIScene.prototype, {
    // ================================================================ talk rows of Chapter 3
    ch3Rows: function (vid, v, por) {
      var self = this, S = this.S, W = this.world, Q = q(), st = Q.ch3 || 0, rows = [], C = LC.CH3TEXT;
      function sayLines(arr, opts) { self.say(W.ch2Lines(arr), opts); }
      function speak(t, opts) { self.say([{ name: v.name, portrait: por, text: t }], opts); }
      if (vid === 'berbai') {
        if (st === 0) rows.push({ icon: 'ic_glow', label: 'Why build on the water?', right: 'Talk', sub: 'Pateh Berbai has been thinking about the river.', action: function () {
          sayLines(C.why, { onDone: function () { Q.ch3 = 1; LC.Audio.sfx('chime'); } });
          return 'close';
        } });
        if (st >= 1 && st <= 3) {
          var n = st, K = LC.KA_STAGES[n], ok = canPay(K.cost, K.kepeng);
          rows.push({ icon: 'i_nibong', label: 'Build ' + K.name + ' (' + n + ' / 3)', right: ok ? 'Build' : K.kepeng + ' k', sub: K.desc + ' Needs ' + need(K.cost) + ' and ' + K.kepeng + ' kepeng.',
            enabled: ok, why: payWhy(K.cost, K.kepeng),
            action: function () {
              LC.State.takeAll(K.cost); S.kepeng -= K.kepeng;
              Q.kaStage = n; Q.ch3 = n + 1;
              LC.Audio.sfx('build'); LC.State.addFriendship('berbai', 3);
              self.say([{ text: C.built[0] }], { onDone: function () { W.applyKampong(n); } });
              return 'close';
            } });
          rows.push({ icon: 'i_belian', label: 'Where do I find them?', sub: 'Nibong palms grow on the hills of Barunai. Fallen belian lies on the eastern hill and in the oldest part of Hutan Rimba (south-east). Atap: nipa palms on Pulau Mutiara. Rotan: rattan vines in the forest.' });
        }
        if (st >= 4) rows.push({ icon: 'ic_glow', label: 'Kampong Ayer', sub: 'A craft quarter, a floating market, new homes over the river. "One day they will call this the greatest village on the water," he says.' });
      }
      if (vid === 'alak') {
        if (st === 4) rows.push({ icon: 'ic_glow', label: 'Ships at the river mouth!', right: 'Talk', sub: 'Forty ships with red and white sails. The fleet of Majapahit.', action: function () {
          sayLines(C.fleet, { onDone: function () { Q.ch3 = 5; Q.ch3train = 0; LC.Audio.sfx('drum'); W.applyKampong(); } });
          return 'close';
        } });
        if (st >= 7) rows.push({ icon: 'ic_bond', label: 'Free of tribute', sub: '"Barunai owes no one. Our camphor, our brass and our cloth are ours to trade with the whole world now."' });
      }
      if (vid === 'senuai') {
        if (st === 5) {
          var tn = Q.ch3train || 0, rested = Q.ch3trainDay === S.day;
          rows.push({ icon: 'ic_str', label: 'Train Mutiara (' + tn + ' / 3)', right: rested ? 'Tomorrow' : 'Train', sub: rested ? '"He has done enough for one day. A rooster needs sleep, like us."' : 'Clap with Awang Senuai so Mutiara jumps on the beat. Once a day. (8 energy)',
            enabled: !rested && S.energy >= 8, why: rested ? 'Mutiara is resting. Come back tomorrow!' : 'You are too tired. Eat something first.',
            action: function () {
              S.energy -= 8;
              self.openTraining(function (good) {
                if (!good) { self.toast('Mutiara got distracted by a dragonfly. Try again!', 'ic_str'); S.energy += 8; return; }
                Q.ch3trainDay = S.day; Q.ch3train = tn + 1; LC.State.addFriendship('senuai', 2);
                if (Q.ch3train >= 3) { Q.ch3 = 6; LC.Audio.sfx('stage'); speak('He is ready! Look at him: he could out-crow a thunderstorm. Tell me when you want to start the contest.'); }
                else self.toast('Mutiara is getting stronger! (' + Q.ch3train + ' / 3) Train again tomorrow.', 'ic_str');
              });
              return 'close';
            } });
        }
        if (st === 6) rows.push({ icon: 'ic_glow', label: 'The great cockfight', right: 'Begin', sub: 'The circle is drawn in the sand. The whole village is waiting. Tap in time to help Mutiara feint, leap and crow (2 of 3).', action: function () {
          W.cockfight(); return 'close';
        } });
        if (st >= 7) rows.push({ icon: 'batu_ayam', iconScale: 1.6, label: 'Mutiara', sub: '"He still guards the river mouth, out on Lumut Lunting. I row out to see him sometimes. I think he likes the company."' });
      }
      if (vid === 'raden' && (st === 5 || st === 6)) rows.push({ icon: 'asmara_0', iconScale: 2, label: 'Asmara', sub: '"He eats from a golden plate, drinks from a silver bowl, and has never been scratched. May the best rooster win, fairly."' });
      if (vid === 'juru') rows.push(Q.tempered ? { icon: 'i_parang', label: 'Tempered blades', sub: 'Wak Juru tempered your blades in his forge. Every weapon hits a little harder (+1 damage).' } : this.craftRow('i_parang', 'Temper my blades', '"Stone for the furnace, and a little kepeng for the charcoal." Every weapon hits harder (+1 damage).', { batu: 10 }, 1500, function () {
        Q.tempered = 1; LC.Audio.sfx('mine'); self.toast('Clang! Clang! Wak Juru tempers your blades. (+1 damage)', 'i_parang');
      }));
      if (vid === 'kemala') rows.push(Q.gembor ? { icon: 'i_gembor', label: 'Brass gembor', sub: 'Dang Kemala lined your gembor with brass. It holds 10 more water.' } : this.craftRow('i_gembor', 'A brass gembor', '"Wood for the fire, and I will line your watering can with brass." It holds 10 more water.', { kayu: 4 }, 1200, function () {
        Q.gembor = 1; LC.State.recalc(); S.water = S.maxWater; LC.Audio.sfx('bell'); self.toast('Your gembor shines like a gong! (+10 water)', 'i_gembor');
      }));
      if (vid === 'lajak') {
        if (!Q.perahu) rows.push(this.craftRow('i_belian', 'Build me a perahu', '"Wood for the planks, belian for the keel." Your own boat: the water taxi is free for you, forever.', { kayu: 30, belian: 6 }, 2000, function () {
          Q.perahu = 1; LC.Audio.sfx('build'); self.toast('Pak Lajak builds your own perahu! The water taxi is free for you now.', 'i_kayu');
        }));
        var free = !!Q.perahu;
        TAXI.forEach(function (t) {
          if (LC.kaStage() < t[3]) return;
          rows.push({ icon: 'i_kepeng', label: 'Water taxi: ' + t[0], right: free ? 'Go' : TAXI_FARE + ' k', sub: free ? 'Hop in your own perahu and paddle across the village.' : 'Pak Lajak\'s son paddles you across the village.',
            enabled: free || S.kepeng >= TAXI_FARE, why: 'Not enough kepeng.',
            action: function () { if (!free) S.kepeng -= TAXI_FARE; LC.Audio.sfx('water'); W.hopTo(t[1], t[2]); return 'close'; } });
        });
        if (Q.perahu && st >= 7) rows.push({ icon: 'i_kepeng', label: 'Water taxi: Teluk Barunai', right: 'Go', sub: 'Out past the river mouth, to the bay of the two roosters.', action: function () { LC.Audio.sfx('water'); W.goArea('teluk', W.tilePx(LC.AREAS.teluk.home), 'right'); return 'close'; } });
      }
      if (vid === 'kilau') rows.push(this.craftRow('i_pinggan_emas', 'Make a golden plate', '"Two pieces of gold, a little kepeng for the charcoal, and a day of tiny hammering." A plate fit for a royal rooster.', { emas: 2 }, 300, function () {
        if (!LC.State.add('pinggan_emas', 1)) { LC.State.add('emas', 2); S.kepeng += 300; self.toast('Your bag is full!'); return; }
        LC.Audio.sfx('chime'); self.toast('Awang Kilau hands you a Pinggan Emas. It shines like the sun!', 'i_pinggan_emas');
      }));
      return rows;
    },
    craftRow: function (icon, label, sub, cost, k, fn) {
      var ok = canPay(cost, k);
      return { icon: icon, label: label, right: k + ' k', sub: sub + ' Needs ' + need(cost) + ' and ' + k + ' kepeng.', enabled: ok, why: payWhy(cost, k),
        action: function () { LC.State.takeAll(cost); LC.State.s.kepeng -= k; fn(); return 'close'; } };
    },

    // ================================================================ the padian: today's boats
    openPadian: function (i) {
      var S = this.S, pool = LC.PADIAN_POOL.filter(function (id) { return LC.ITEMS[id]; }), pick = [], seed = (S.day * 31 + i * 17 + 7) % 2147483647, tries = 0;
      function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
      while (pick.length < 4 && tries++ < 60) { var id = pool[Math.floor(rnd() * pool.length)]; if (pick.indexOf(id) < 0) pick.push(id); }
      this.openMenu({ title: i ? 'Mak Inah\'s padian boat' : 'Dang Halimah\'s padian boat', coins: true,
        footer: 'The padian paddle in every morning (6 AM to 2 PM) with whatever is fresh today. Tomorrow, something different.',
        tabs: [{ label: 'Buy', rows: function () {
          return pick.map(function (id) {
            var it = LC.ITEMS[id], price = it.price ? Math.round(it.price * 0.9) : Math.max(4, Math.round((it.sell || 5) * 1.5)), room = LC.State.canAdd(id);
            return { icon: it.icon, label: it.name, sub: it.desc, right: price + ' k', enabled: S.kepeng >= price && room, why: S.kepeng < price ? 'Not enough kepeng.' : 'Your bag is full!',
              action: function () { S.kepeng -= price; LC.State.add(id, 1); LC.Audio.sfx('buy'); } };
          });
        } }]
      });
    },

    // ================================================================ the new pilings: build (or restyle) a house over the river
    openKPlot: function (id) {
      var self = this, S = this.S, W = this.world, Q = q(), plots = Q.kaPlots = Q.kaPlots || {}, cur = plots[id], cost = LC.KA_HOUSE_COST, k = LC.KA_HOUSE_KEPENG;
      var n = Object.keys(plots).length;
      this.openMenu({ title: cur ? 'Your house over the river' : 'Empty pilings', coins: true,
        footer: cur ? 'A family from the hills lives here now. (' + n + ' / ' + LC.KA_PLOTS.length + ' new homes built)' : 'Choose a style. A family from the hills will move in. (' + n + ' / ' + LC.KA_PLOTS.length + ' new homes built)',
        tabs: [{ label: cur ? 'Restyle' : 'Build', rows: function () {
          return Object.keys(LC.KA_HOUSES).map(function (tex) {
            if (cur) return { icon: tex, iconScale: 0.85, label: LC.KA_HOUSES[tex] + (cur === tex ? '  (now)' : ''), right: cur === tex ? '' : 'Restyle', sub: cur === tex ? 'This is how it looks now.' : 'Repaint and re-thatch it in this style. (free)',
              enabled: cur !== tex, why: 'It already looks like this.', action: function () { plots[id] = tex; W.refreshKPlots(); LC.Audio.sfx('build'); return 'close'; } };
            var ok = canPay(cost, k);
            return { icon: tex, iconScale: 0.85, label: LC.KA_HOUSES[tex], right: k + ' k', sub: 'Needs ' + need(cost) + ' and ' + k + ' kepeng.', enabled: ok, why: payWhy(cost, k),
              action: function () {
                LC.State.takeAll(cost); S.kepeng -= k; plots[id] = tex;
                LC.Audio.sfx('build'); W.refreshKPlots(); W.cameras.main.shake(200, 0.002);
                var o = LC.KA_PLOTS.filter(function (p) { return p.id === id; })[0];
                if (o) W.fx.smoke.explode(14, (o.x + 1.5) * 16, 19 * 16);
                var all = Object.keys(plots).length >= LC.KA_PLOTS.length;
                if (all && !Q.kaHomes) { Q.kaHomes = 1; S.kepeng += 1000; S.stats.earned += 1000; LC.Audio.sfx('cheer'); self.toast('Every new home is full! The families thank you with 1000 kepeng.', 'ic_joy'); }
                else self.toast('A family from the hills moves into the new house!', 'ic_joy');
                W.doShared('kind', { n: 3 }, function () {});
                return 'close';
              } };
          });
        } }]
      });
    },

    // ================================================================ training Mutiara (clap on the beat, the rooster jumps)
    openTraining: function (onDone) {
      var self = this, F = this.gameFrame('Training Mutiara', 560, 400), g = F.g, X = F.X, Y = F.Y, beats = 6, k = 0, score = 0, t0 = this.time.now, gap = 1.0, over = false, hitK = -1, drumK = -1;
      var who = this.add.image(X + 150, Y + 230, 'npc_senuai_0').setScale(5).setOrigin(0.5, 1);
      var bird = this.add.sprite(X + 410, Y + 230, 'mutiara_0').setScale(5).setOrigin(0.5, 1).setFlipX(true).play('mutiara_idle');
      F.c.add([who, bird]);
      F.msg.setText('Awang Senuai claps: tap when the ring meets the circle, and Mutiara jumps!');
      function beatT(i) { return 1.2 + i * gap; }
      var close = this.runGame(F, function () {
        if (over) return;
        var el = (self.time.now - t0) / 1000, d = Math.abs(el - beatT(k));
        if (d < 0.32) {
          score += d < 0.12 ? 1 : 0.5; hitK = k; k++;
          F.msg.setText(d < 0.12 ? 'Hup! A perfect jump!' : 'Good jump!').setColor('#b8f0c8');
          self.tweens.add({ targets: bird, y: Y + 190, duration: 140, yoyo: true, ease: 'Quad.easeOut' });
          LC.Audio.sfx('cluck');
        } else F.msg.setText('Too early! Mutiara blinks at you.').setColor('#ff8a7a');
      }, function (now) {
        var el = (now - t0) / 1000;
        if (!over && el > beatT(k) + 0.32) { if (hitK !== k) F.msg.setText('Missed the clap!').setColor('#ff8a7a'); k++; }
        if (!over && k < beats && el >= beatT(k) - 0.03 && drumK !== k) { drumK = k; LC.Audio.sfx('drum'); }
        g.clear();
        g.lineStyle(3, 0xffd166, 1); g.strokeCircle(X + 280, Y + 150, 26);
        if (!over && k < beats) { var r = 26 + Math.max(0, (beatT(k) - el)) * 90; g.lineStyle(2, 0xfbecc8, 0.9); g.strokeCircle(X + 280, Y + 150, r); }
        for (var i = 0; i < beats; i++) { g.fillStyle(i < k ? 0x9be15d : 0x5a4a3a, 1); g.fillCircle(X + 210 + i * 28, Y + 280, 7); }
        if (!over && k >= beats) {
          over = true;
          var good = score >= 3;
          LC.Audio.sfx(good ? 'crow' : 'sad');
          F.msg.setText(good ? 'Mutiara puffs out his chest and crows! "Excellent!"' : '"Hmm. Mutiara was watching a dragonfly. Again?"').setColor(good ? '#b8f0c8' : '#ffd166');
          self.time.delayedCall(1500, function () { close(); onDone(good); });
        }
      });
    },

    // ================================================================ the great cockfight: three bouts, win two (no blood: feints, leaps and crows)
    openCockfight: function (cb) {
      var self = this, F = this.gameFrame('The Great Cockfight', 620, 430), g = F.g, X = F.X, Y = F.Y;
      var mut = this.add.sprite(X + 200, Y + 220, 'mutiara_0').setScale(5).setOrigin(0.5, 1).play('mutiara_idle');
      var asm = this.add.sprite(X + 420, Y + 220, 'asmara_0').setScale(5).setOrigin(0.5, 1).setFlipX(true).play('asmara_idle');
      F.c.add([mut, asm]);
      var res = [], pos = 0, dirn = 1, zone = 0.5, done = false, wait = 0, last = this.time.now, ZW = 0.1;
      var MOVES = ['Mutiara feints left... and leaps right over Asmara!', 'Mutiara beats his wings so hard the sand flies!', 'Mutiara lets out a crow that shakes the leaves!'];
      function prompt() { F.msg.setText('Bout ' + (res.length + 1) + ': tap when the marker is in the gold!').setColor('#fbecc8'); }
      prompt();
      var close = this.runGame(F, function () {
        if (done || wait > 0) return;
        var hit = Math.abs(pos - zone) <= ZW, wins;
        res.push(hit);
        if (hit) {
          LC.Audio.sfx(res.length === 3 ? 'crow' : 'hit');
          F.msg.setText(MOVES[res.filter(Boolean).length - 1]).setColor('#b8f0c8');
          self.tweens.add({ targets: mut, x: X + 330, y: Y + 180, duration: 180, yoyo: true, ease: 'Quad.easeOut' });
          self.tweens.add({ targets: asm, x: X + 450, duration: 200, yoyo: true, delay: 120 });
        } else {
          LC.Audio.sfx('cluck');
          F.msg.setText('Asmara dodges, and struts in a circle!').setColor('#ff8a7a');
          self.tweens.add({ targets: asm, y: Y + 190, duration: 160, yoyo: true, repeat: 1 });
        }
        wait = 1.1;
        wins = res.filter(Boolean).length;
        if (wins >= 2 || res.length - wins >= 2) { done = true; self.time.delayedCall(1300, function () { close(); cb(wins >= 2); }); }
      }, function (now) {
        var dt = Math.min(0.05, (now - last) / 1000); last = now;
        if (wait > 0) { wait -= dt; if (wait <= 0 && !done) { zone = 0.2 + Math.random() * 0.6; pos = 0; dirn = 1; prompt(); } }
        else if (!done) { pos += dirn * dt * (0.75 + res.length * 0.2); if (pos > 1) { pos = 1; dirn = -1; } if (pos < 0) { pos = 0; dirn = 1; } }
        var bx = X + 130, by = Y + 268, bw = 360;
        g.clear();
        g.fillStyle(0x2b1f17, 1); g.fillRoundedRect(bx - 4, by - 4, bw + 8, 30, 8);
        g.fillStyle(0xd9a94e, 1); g.fillRect(bx + (zone - ZW) * bw, by, ZW * 2 * bw, 22);
        g.lineStyle(2, 0x8a6a3a, 1); g.strokeRoundedRect(bx - 4, by - 4, bw + 8, 30, 8);
        g.fillStyle(0xfffdf2, 1); g.fillRect(bx + pos * bw - 3, by - 8, 6, 38);
        for (var i = 0; i < 3; i++) { g.fillStyle(i < res.length ? (res[i] ? 0x9be15d : 0xe07a5f) : 0x5a4a3a, 1); g.fillCircle(X + 282 + i * 28, Y + 316, 8); }
      }, function () { cb(null); });
    },

    // ================================================================ the Journal: Chapter 3
    ch3ChapterRows: function () {
      var Q = q(), st = Q.ch3 || 0, rows = [];
      rows.push({ icon: 'i_nibong', label: 'Chapter 3: Kampong Ayer' + (st >= 8 ? '  (part 1 complete)' : ''), right: st >= 8 ? 'Done' : '', sub: LC.ch3Goal() || 'The water village grows, and two roosters become legends. (More of the story is coming soon.)' });
      var steps = [
        [0, 'Why build on the water?', 'Pateh Berbai explains.'],
        [1, 'The craft quarter', 'Five workshops: iron, brass, cloth, boats and gold.'],
        [2, 'The floating market', 'The padian come every morning.'],
        [3, 'New homes over the river', 'Pilings for five more families.'],
        [4, 'The fleet of Majapahit', 'Forty ships, and a challenge.'],
        [5, 'Training Mutiara', 'Three days with Awang Senuai (' + Math.min(3, Q.ch3train || 0) + ' / 3).'],
        [6, 'The great cockfight', 'Mutiara against Asmara.'],
        [7, 'The bay of the two roosters', 'Pulau Pilong-Pilongan and Lumut Lunting.']
      ];
      steps.forEach(function (s) {
        if (st < s[0]) return;
        var doneS = st > s[0];
        rows.push({ icon: doneS ? 'ic_bond' : 'ic_moon', label: (doneS ? '✓ ' : '') + s[1], right: doneS ? 'Done' : 'Now', sub: s[2] });
      });
      if (LC.kaStage() >= 3) rows.push({ icon: 'rumah_air3', iconScale: 0.85, label: 'New homes: ' + Object.keys(Q.kaPlots || {}).length + ' / ' + LC.KA_PLOTS.length, sub: 'Build on the empty pilings between the shore and the walkway.' });
      return rows;
    }
  });

  // ---------------------------------------------------------------- hooks
  var specialRows = LC.UIScene.prototype.specialRows;
  LC.UIScene.prototype.specialRows = function (vid, v, por) {
    var rows = specialRows.call(this, vid, v, por);
    return (this.S.quests.ch2 || 0) >= 8 ? rows.concat(this.ch3Rows(vid, v, por)) : rows;
  };
  var chapterRows = LC.UIScene.prototype.chapterRows;
  LC.UIScene.prototype.chapterRows = function () {
    var rows = chapterRows.call(this), Q = this.S.quests;
    if ((Q.ch2 || 0) < 8) return rows;
    rows.forEach(function (r) { if (r.label.indexOf('Chapter 2') === 0) r.sub = 'Fourteen brothers, one river, one home. And a princess from Johor, and a very loud bird.'; });
    return rows.concat(this.ch3ChapterRows());
  };
})(window.LC);
