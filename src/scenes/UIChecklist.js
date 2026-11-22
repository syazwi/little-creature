/* UI, part 19 (v2.7.2): the story checklist. The user asked for a checklist "so the player knows what to do to proceed
 * to the next chapter". For the chapter you are in, LC.checklist() gives: its steps (done, now, and how many are left),
 * the parts of the current step with ✓ / · and have / need counts, and what opens the next chapter. It shows at the
 * top of the Journal's Chapters page, and (only the parts still to do) in a few small lines under the goal line. The
 * pause menu's "Story helper" switch turns the on-screen lines and the guide arrow off together. Mixed into LC.UIScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  function cnt(id) { return LC.State.count(id); }
  function it(id) { return LC.ITEMS[id] ? LC.ITEMS[id].name : id; }
  function haveAll(map) { return Object.keys(map).every(function (id) { return cnt(id) >= map[id]; }); }
  function needItems(map, kepeng) {   // one line per material, with what you have
    var out = Object.keys(map).map(function (id) { return { ok: cnt(id) >= map[id], t: it(id) + ' ' + Math.min(cnt(id), map[id]) + ' / ' + map[id] }; });
    if (kepeng) out.push({ ok: LC.State.s.kepeng >= kepeng, t: kepeng + ' kepeng' });
    return out;
  }
  function c(ok, t) { return { ok: !!ok, t: t }; }
  function dishes() { var n = 0; LC.State.s.inv.forEach(function (sl) { if (sl && LC.ITEMS[sl.id] && LC.ITEMS[sl.id].kind === 'dish') n += sl.n; }); return n; }
  var ON = { farm: 'on your own farm', island: 'on Pulau Mutiara', mountain: 'on Gunung Kabus' };
  function where(a) { return ON[a] || 'in ' + (LC.AREAS[a] ? LC.AREAS[a].name : a); }
  function n(o) { return Object.keys(o || {}).length; }

  // every chapter: its quest key, the step at which it is complete, its step titles (by step), and what opens the next one
  LC.CHAPTER_LIST = [
    { n: 2, key: 'ch2', end: 8, name: 'Barunai', steps: ['Nenek\'s second letter', 'Meet Awang Alak Betatar', 'Gather the twelve brothers', 'The tembadau trail', 'Tell Awang Alak Betatar', 'Awang Semaun\'s voyage', 'Si Pinggai and the sunken chest', 'The wedding kenduri'],
      next: 'Chapter 3 starts as soon as Chapter 2 is complete: talk to Pateh Berbai in Barunai.' },
    { n: 3, key: 'ch3', end: 13, name: 'Kampong Ayer', steps: ['Pateh Berbai\'s idea', 'Build the craft quarter', 'Build the floating market landing', 'Build new homes over the river', 'Sails at the river mouth', 'Train Mutiara (3 days)', 'The great cockfight', 'The ghost rooster of Teluk Barunai', 'Something wrong in the bay', 'Tok Gergasi\'s fish skin', 'Bilanapura', '1521: Antonio\'s tour', '1578: defend the city'],
      next: 'When Chapter 3 is complete, go back to Nenek\'s farm: Chapter 4 begins there the next day.' },
    { n: 4, key: 'ch4', end: 4, name: 'Layar Merah', steps: ['Rest at the farm', 'Pak Mat\'s news', 'Get ready', 'The attack'],
      next: 'When Chapter 4 is complete, be at Nenek\'s farm after dark the next day: Chapter 5 begins.' },
    { n: 5, key: 'ch5', end: 5, name: 'Bayang Hitam', steps: ['Rest at the farm', 'Shadows on the farm', 'Guard lamps, and the jong to Java', 'Empu Lintang\'s lamp', 'Pulau Kelam'],
      next: 'When Chapter 5 is complete, be at Nenek\'s farm in the daytime the next day: Chapter 6 begins.' },
    { n: 6, key: 'ch6', end: 7, name: 'Puteri Gunung Ledang', steps: ['Rest at the farm', 'Nenek is home', 'Sail to Gunung Ledang', 'The guardian\'s silat test', 'The princess\'s three gifts', 'The bridge, the flower and Mak Lampir', 'Wake Nenek'],
      next: 'When Chapter 6 is complete, be at Nenek\'s farm between 7 AM and 5 PM the next day: Chapter 7 begins.' },
    { n: 7, key: 'ch7', end: 10, name: 'Puteri Santubong', steps: ['Rest at the farm', 'See Puteri Gunung Ledang', 'Sail to Santubong', 'Mak Dayang', 'The two princesses', 'The storm', 'Putera Serapi', 'Sang Bualang on Pulau Satang', 'A wau for Bualang', 'The princesses meet again'],
      next: 'When Chapter 7 is complete, be at Nenek\'s farm between 7 AM and 5 PM the next day: Chapter 8 begins.' },
    { n: 8, key: 'ch8', end: 9, name: 'Air Pasang', steps: ['Rest at the farm', 'Ask Tok Duyung', 'Ask both rulers', 'The Selat Gelora', 'Nek Lampir\'s cure', 'The two dragons', 'Queen against King', 'Peace under the arch', 'Clean up the jars'],
      next: 'When Chapter 8 is complete, be at Nenek\'s farm after 8 PM the next night: Chapter 9 begins.' },
    { n: 9, key: 'ch9', end: 7, name: 'Ulek Mayang', steps: ['Wait for the night', 'The empty boat', 'Find the song', 'The mayang and the rice', 'Ulek Mayang', 'Gua Puteri Tujuh', 'Take the spirit home'],
      next: 'When Chapter 9 is complete, be at Nenek\'s farm between 6 AM and 8 PM the next day: Chapter 10 begins.' },
    { n: 10, key: 'ch10', end: 8, name: 'Nujum Pak Belalang', steps: ['Rest at the farm', 'The glowing grasshoppers', 'Hide-and-seek in Tanjung Bunga', 'Belalang\'s chores', 'The stolen chest', 'Back to the Sultan', 'The riddle contest', 'The truth'],
      next: 'When Chapter 10 is complete, be at Nenek\'s farm after 8 PM the next night: Chapter 11 begins.' },
    { n: 11, key: 'ch11', end: 7, name: 'Bulan dan Mutiara', steps: ['Rest at the farm', 'The dark moon', 'The Sultan of Sulu', 'Ready the vinta', 'Captain of the vinta', 'The Bakunawa', 'Two little moons'],
      next: 'Chapter 11, Part 2 is on the way: in 1578, Barunai and Sulu stand together against a foreign fleet.' }
  ];

  // the parts of the current step (only steps with more than one part, or with things to bring)
  var PARTS = {
    2: function (st, Q) {
      var S = LC.State.s;
      if (st === 1) return [c(S.visited.barunai, 'Take Nenek\'s perahu at the farm jetty to Barunai'), c(false, 'Talk to Awang Alak Betatar at the camp')];
      if (st === 2) return LC.BROTHERS.map(function (b) {
        var v = LC.VILLAGERS[b], f = v.find, ok = !!(Q.ch2found && Q.ch2found[b]), ready = cnt(f[0]) >= f[1];
        return c(ok, v.name + (ok ? ' (on his way to Barunai)' : ' ' + where(v.area) + ': ' + f[1] + ' ' + it(f[0]) + ' (' + Math.min(cnt(f[0]), f[1]) + ' / ' + f[1] + ')' + (ready ? ', you have it: go and ask him' : '')));
      }).concat([c(false, 'Then tell Awang Alak Betatar')]);
      if (st === 3) { var k = Math.min(Q.ch2t1 || 0, LC.CH2.trail1.length); return [c(k >= LC.CH2.trail1.length, 'Hoofprints ' + k + ' / ' + LC.CH2.trail1.length), c(false, 'Approach the tembadau slowly')]; }
      if (st === 6) return [c(S.day > (Q.ch2day || 0), 'Wait for Awang Semaun to come back from Johor (sleep one night)'), c(Q.ch2bird, 'Find Si Pinggai (follow the feathers)'), c(Q.ch2ship, 'Dive for the dowry chest (off the old landing)'), c(false, 'Tell Tuan Puteri')];
      if (st === 7) return [c(dishes() >= 5, '5 cooked dishes (' + Math.min(5, dishes()) + ' / 5): cook them at Nenek\'s dapur'), c(false, 'Bring them to Awang Alak Betatar')];
      return null;
    },
    3: function (st, Q) {
      if (st >= 1 && st <= 3) { var K = LC.KA_STAGES[st]; return needItems(K.cost, K.kepeng).concat([c(false, 'Then build it with Pateh Berbai')]); }
      if (st === 5) return [c((Q.ch3train || 0) >= 3, 'Train Mutiara with Awang Senuai: ' + (Q.ch3train || 0) + ' / 3 (once a day)')];
      if (st === 7) return [c(Q.buluMutiara, 'A feather from the stone rooster on Lumut Lunting (Teluk Barunai)'), c(cnt('pinggan_emas'), 'A golden plate (Awang Kilau, the goldsmith)'), c(false, 'After 7 PM, bring both to the ghost rooster on Pulau Pilong-Pilongan')];
      if (st === 9 && LC.OGRE_TRADE) return needItems(LC.OGRE_TRADE).concat([c(cnt('kulit_ikan'), 'Trade with Tok Gergasi for the magic fish skin (west cliffs of Gunung Kabus)')]);
      if (st === 11 && LC.TOUR) return [c(Q.tourOn, 'Meet Antonio by the foreign ship'), c(n(Q.tour) >= LC.TOUR.length, 'Show him the city: ' + n(Q.tour) + ' / ' + LC.TOUR.length)];
      return null;
    },
    4: function (st, Q) {
      var C4 = LC.C4;
      if (st === 2) return [c(Q.c4pagar, 'A bamboo stockade (Tukang Leong: ' + Object.keys(C4.stockade).map(function (id) { return C4.stockade[id] + ' ' + it(id); }).join(', ') + ')'),
        c(Q.c4meriam, 'Cannons (Dang Kemala in Barunai)'), c(Q.c4allies, 'The brothers of Barunai (Awang Semaun)')];
      return null;
    },
    5: function (st, Q) {
      var C5 = LC.C5;
      if (st === 2) return [c(Q.c5wira, 'Show the shadow shard to the sailors of the jong (farm jetty)'), c(Q.c5lamps, 'Guard lamps from Tukang Leong (' + Object.keys(C5.lamps).map(function (id) { return C5.lamps[id] + ' ' + it(id); }).join(', ') + ', ' + C5.lampKepeng + ' kepeng)'), c(false, 'Sail to Java on the jong')];
      if (st === 3) return [c(Q.c5king, 'Meet the King of Majapahit'), c(Q.c5empu, 'Find Empu Lintang (past the great pool)')].concat(needItems(C5.forge));
      if (st === 4) return [c(cnt('pelita_purnama'), 'The Pelita Purnama from Empu Lintang'), c(false, 'Sail to Pulau Kelam: light the stone torches (' + n(Q.c5obor) + ' / ' + C5.obor.length + ') and defeat Si Kelam')];
      return null;
    },
    6: function (st, Q) {
      var C6 = LC.C6;
      if (st === 4) { var tears = n(Q.c6tears); return [c(Q.c6asked, 'Meet Puteri Gunung Ledang by her pavilion'), c(tears >= C6.tears.length, 'A jar of happy tears (' + tears + ' / ' + C6.tears.length + ': the Penghulu, Pak Mat, Pak Lah, Tukang Leong)'), c(Q.c6bridge, 'A bridge of gold and silver (Tukang Leong)'), c(cnt('pinang_muda') >= 3, '3 young areca nuts (' + Math.min(3, cnt('pinang_muda')) + ' / 3)'), c(false, 'Bring the three gifts to the princess')]; }
      return null;
    },
    7: function (st, Q) {
      var C7 = LC.C7;
      if (st === 4) return [c(Q.c7askS, 'Meet Puteri Santubong by her loom (west), after dusk'), c(Q.c7askJ, 'Meet Puteri Sejinjang by her lesung (east), after dusk'),
        c(Q.c7kain, 'Santubong\'s cloth: ' + C7.dyes.map(function (d) { return it(d) + (cnt(d) ? ' ✓' : ''); }).join(', ') + ', ' + C7.thread + ' ' + it('benang_emas') + ' (weave at her loom)'),
        c(Q.c7beras, 'Sejinjang\'s rice: 3 Padi (' + Math.min(3, cnt('padi')) + ' / 3; pound it at her lesung)'), c(false, 'Then carry her words in the Kabus Ledang')];
      if (st === 5) return [c(false, 'Drive the storm out of Kampung Santubong (' + (Q.c7kills || 0) + ' / ' + C7.stormKills + ')')];
      if (st === 8) return [c(Q.c7sat, 'Sit with Sang Bualang on Pulau Satang'), c(cnt('wau_bualang'), 'A wau from Mak Dayang (' + Object.keys(C7.wau).map(function (id) { return C7.wau[id] + ' ' + it(id); }).join(', ') + ', ' + C7.wauKepeng + ' kepeng)'), c(false, 'Give it to Sang Bualang')];
      if (st === 9) return [c(Q.c7aboard, 'Ask Puteri Gunung Ledang to come (Gunung Ledang)'), c(false, 'Sail back to Kampung Santubong with her')];
      return null;
    },
    8: function (st, Q) {
      var C8 = LC.C8;
      if (st === 2) return [c(Q.c8ratu, 'Ask Kanjeng Ratu Kidul (the green arch, south of Kampung Karang)'), c(Q.c8pos, 'Ask Poseidon (the deep trench, west)')];
      if (st === 3) return [c(n(Q.c8sh) >= C8.shards, 'Pieces of the black jar in the Selat Gelora: ' + n(Q.c8sh) + ' / ' + C8.shards)];
      if (st === 4) return [c(Q.c8confess, 'Show the pieces to Nek Lampir (Gunung Ledang)')].concat(needItems(C8.cure)).concat([c(false, 'Nek Lampir brews the Air Penawar')]);
      if (st === 5) return [c(Q.c8calmN, 'Calm the Naga Mother'), c(Q.c8calmK, 'Calm Ketos')];
      if (st === 6) return [c(!!Q.c8duel, 'Stop the rulers\' duel (in the deep, beyond the current)'), c(Q.c8duel === 'pos' || Q.c8duel === 'done', 'Calm Kanjeng Ratu Kidul'), c(Q.c8duel === 'done', 'Calm Poseidon')];
      if (st === 8) return [c(n(Q.c8jar) >= C8.jars, 'Black jars found: ' + n(Q.c8jar) + ' / ' + C8.jars + ' (Kampung Karang 2, the Selat Gelora 2, the Queen\'s palace 1, Atlantis 1)'), c((Q.c8sealed || 0) >= C8.jars, 'Sealed in Nek Lampir\'s pot by the farm jetty: ' + (Q.c8sealed || 0) + ' / ' + C8.jars)];
      return null;
    },
    9: function (st, Q) {
      var C9 = LC.C9;
      if (st === 1) return [c(Q.c9boat, 'Look in the empty boat at the farm jetty'), c(Q.c9arrive, 'Sail on the jong to Kampung Pantai Kabus'), c(false, 'Talk to Mak Som')];
      if (st === 2) return [c((Q.c9find || 0) >= 3, 'Follow the song through Pantai Bakau (' + Math.min(3, Q.c9find || 0) + ' wrong turns so far)'), c(false, 'Find where it is really coming from')];
      if (st === 3) return [c(Q.c9pawang, 'Talk to Tok Pawang at his hut'), c(cnt('mayang_pinang'), 'The mayang from the old pinang palm (north-west Pantai Bakau)'),
        c(cnt('nasi_kunyit'), 'Nasi Kunyit from Mak Som (' + Object.keys(C9.nasi).map(function (id) { return it(id) + ' ' + Math.min(cnt(id), C9.nasi[id]) + ' / ' + C9.nasi[id]; }).join(', ') + ')'), c(false, 'Bring both to Tok Pawang')];
      if (st === 5) return [c(false, 'Dive into the whirlpool off Pantai Bakau'), c(false, 'Find the clam where Pak Awang\'s spirit hums')];
      return null;
    },
    10: function (st, Q) {
      var C10 = LC.C10, hops = C10.hops.length;
      if (st === 1) return [c((Q.c10hop || 0) >= hops, 'Follow the glowing grasshopper across the farm (' + Math.min(Q.c10hop || 0, hops) + ' / ' + hops + ' hops)'), c(Q.c10clue, 'Look at what it left at the end of the farm jetty')];
      if (st === 2) return [c(Q.c10arrive, 'Sail on the jong to Negeri Tanjung Bunga'), c(false, 'Find Pelita and the boy (' + Math.min(Q.c10seek || 0, 3) + ' / 3 hiding places)')];
      if (st === 3) return [c(Q.c10chores, 'Ask Belalang about his chores (by his father\'s hut)'), c((Q.c10air || 0) >= C10.water, 'Water from the town well into the tempayan: ' + Math.min(Q.c10air || 0, C10.water) + ' / ' + C10.water),
        c(Q.c10give, 'Firewood and coconuts for Belalang (' + Object.keys(C10.give).map(function (id) { return it(id) + ' ' + Math.min(cnt(id), C10.give[id]) + ' / ' + C10.give[id]; }).join(', ') + ')'), c(false, 'Tell Belalang it is all done')];
      if (st === 4) return [c(Q.c10sultan, 'Go to the Sultan, in front of the palace'), c(Q.c10with || Q.c10won, 'Take Belalang and Pelita along (talk to Belalang)'),
        c(Q.c10won, 'Follow the tracks west through Hutan Merbau, and beat the Kerengga gang' + (Q.c10sultan && !Q.c10won ? ' (' + LC.ch10DaysLeft() + ' days until Ahad)' : '')), c(false, 'Take the Peti Pusaka Diraja')];
      if (st === 6) return [c(Q.c10heard, 'After dark, hide in the sampan under the foreign ship (by the jetty)'), c(false, 'The riddle contest (talk to the Sultan)')];
      return null;
    },
    11: function (st, Q) {   // v3.3
      if (st === 3) return [c(Q.c11gong, 'Learn the kulintang with Mak Jaliha (the gong hall, west)'),
        c(Q.c11berani || cnt('batu_berani') || Q.c11pedoman, 'The batu berani: dive at the end of the boardwalk, to the old boat on the reef'),
        c(Q.c11pedoman, 'Give it to Mbo\' Arani for a pedoman'),
        c(Q.c11prov, '2 Tiyula Itum for the crew (' + Math.min(2, cnt('tiyula_itum')) + ' / 2; Mak Salma at the market)'), c(false, 'Then talk to Mbo\' Arani by the jetty')];
      if (st === 4) { var lg = Q.c11leg || 0; return [c(lg >= 1, 'Timur Laut (north-east) to Batu Kembar'), c(lg >= 2, 'Timur (east) through the fog, to the black water'), c(lg >= 3, 'Selatan (south) to Pulau Bulan'), c(false, 'Drop anchor at Pulau Bulan')]; }
      return null;
    }
  };

  // ---------------------------------------------------------------- what to do now
  LC.checklist = function () {
    var S = LC.State.s, Q = S.quests;
    if ((Q.ch2 || 0) < 1) {
      var lv = LC.State.level();
      return { title: 'Chapter 1: Little Creature', step: 1, total: 1, now: 'Care for Pelita until it becomes a Legend of the Kampung.', done: [], left: 0,
        items: [c(lv >= LC.LEGEND_LEVEL, 'Pelita Lv ' + lv + ' / ' + LC.LEGEND_LEVEL + ' (feed, play, offerings, help the villagers)')],
        next: 'Chapter 2 begins when Pelita reaches Lv ' + LC.LEGEND_LEVEL + ': a letter from Nenek turns up at the farm.' };
    }
    var ch = null;
    for (var i = 0; i < LC.CHAPTER_LIST.length; i++) { if ((Q[LC.CHAPTER_LIST[i].key] || 0) < LC.CHAPTER_LIST[i].end) { ch = LC.CHAPTER_LIST[i]; break; } }
    if (!ch) return { title: 'Every chapter is complete!', step: 0, total: 0, now: 'Well done. Visit your friends across the land, befriend every spirit, and look after Pelita.', done: [], left: 0, items: [], next: 'More chapters are on the way.' };
    var st = Q[ch.key] || 0, parts = PARTS[ch.n] ? PARTS[ch.n](st, Q) : null;
    var goal = LC.ch2Goal ? LC.ch2Goal() : null;
    return {
      n: ch.n, title: 'Chapter ' + ch.n + ': ' + ch.name, step: Math.min(st + 1, ch.end), total: ch.end, stepName: ch.steps[st] || '',
      now: goal ? goal.replace(/^Chapter \d+(, part \d)?: /, '') : (ch.steps[st] || ''),
      done: ch.steps.slice(0, st), left: Math.max(0, ch.end - st - 1),
      items: parts || [], next: ch.next
    };
  };

  // ---------------------------------------------------------------- v2.8.2: how far along the chapter is, in percent
  // Every step of a chapter counts the same; the step you are on counts for the share of its parts already done (✓).
  // Chapter 1 is Pelita's bond on the way to Lv 20. A chapter shows 100% only once it is complete.
  var ONE = { n: 1, key: 'ch1', end: 1, name: 'Little Creature', steps: ['Pelita becomes a Legend of the Kampung'] };
  LC.chapterProgress = function () {
    var S = LC.State.s, Q = S.quests, L = LC.checklist(), total = LC.CHAPTER_LIST.length + 1;
    if ((Q.ch2 || 0) < 1) {
      var need = LC.LEVELS[LC.LEGEND_LEVEL - 1] || 1, bond = Math.max(0, (S.ghost && S.ghost.bond) || 0);
      return { n: 1, name: ONE.name, pct: Math.min(99, Math.floor(bond / need * 100)), done: 0, total: total, L: L };
    }
    if (!L.n) return { n: 0, name: '', pct: 100, done: total, total: total, L: L };
    var ch = LC.CHAPTER_LIST.filter(function (x) { return x.n === L.n; })[0], st = Q[ch.key] || 0;
    var ok = L.items.filter(function (x) { return x.ok; }).length, part = L.items.length ? ok / L.items.length : 0;
    return { n: L.n, name: ch.name, pct: Math.max(0, Math.min(99, Math.floor((st + part) / ch.end * 100))), done: L.n - 1, total: total, L: L };
  };
  function noDot(s) { return String(s || '').replace(/[.!]\s*$/, ''); }

  Object.assign(LC.UIScene.prototype, {
    // the top of the Journal's Chapters page (and the first tab of Chapter Progress)
    checklistRows: function () {
      var P = LC.chapterProgress(), L = P.L, rows = [];
      rows.push({ icon: 'ic_chap', label: 'To do now: ' + L.title + (L.total ? ' (step ' + L.step + ' of ' + L.total + ')' : ''), sub: (L.stepName ? L.stepName + ': ' : '') + L.now,
        right: P.pct + '%', bar: P.pct / 100 });
      L.items.forEach(function (x) { rows.push({ icon: x.ok ? 'ic_bond' : 'ic_moon', label: (x.ok ? '✓ ' : '· ') + x.t, right: x.ok ? 'Done' : '' }); });
      if (L.left) rows.push({ icon: 'ic_moon', label: L.left + ' more step' + (L.left > 1 ? 's' : '') + ' after this one in ' + L.title + '.' });
      rows.push({ icon: 'ic_sun', label: P.n && P.n < P.total ? 'How to reach Chapter ' + (P.n + 1) : 'What opens the next chapter', sub: L.next });
      return rows;
    },
    // every chapter, with how much of it is done (the names of chapters not reached yet stay a secret)
    chapterListRows: function () {
      var P = LC.chapterProgress(), all = [ONE].concat(LC.CHAPTER_LIST);
      return all.map(function (ch, i) {
        var done = !P.n || ch.n < P.n, now = ch.n === P.n, prev = all[i - 1];
        if (done) return { icon: 'ic_bond', label: '✓ Chapter ' + ch.n + ': ' + ch.name, right: '100%', bar: 1,
          sub: ch.n === 1 ? 'Pelita became a Legend of the Kampung.' : 'All ' + ch.end + ' steps done: ' + ch.steps.slice(0, ch.end).join(', ') + '.' };
        if (now) return { icon: 'ic_chap', label: 'Chapter ' + ch.n + ': ' + ch.name + '  (now)', right: P.pct + '%', bar: P.pct / 100,
          sub: (ch.n === 1 ? noDot(P.L.now) + '. ' : 'Step ' + P.L.step + ' of ' + ch.end + ': ' + P.L.stepName + '. ') + P.L.next };
        return { icon: 'ic_moon', label: 'Chapter ' + ch.n + ': ???', right: 'Locked',
          sub: ch.n === P.n + 1 ? P.L.next : 'Opens after Chapter ' + prev.n + '.' };
      });
    },
    // the pause menu's tile: "Chapter 3: 42%"
    chapterTile: function () {
      var self = this, S = this.S;
      if (!S || S.guest) return null;
      var P = LC.chapterProgress(), L = P.L, tap = this.touchOn ? 'Tap' : 'Select';
      if (!P.n) return { icon: 'ic_chap', label: 'Story: Complete', sub: 'Every chapter is complete! ' + L.now, action: function () { self.openChapter(); } };
      return { icon: 'ic_chap', label: 'Chapter ' + P.n + ': ' + P.pct + '%',
        sub: P.name + (L.total > 1 ? ', step ' + L.step + ' of ' + L.total : '') + ': ' + noDot(L.stepName || L.now) + '. ' + tap + ' to see what to do now, and ' + (P.n < P.total ? 'how to reach Chapter ' + (P.n + 1) : 'what comes next') + '.',
        action: function () { self.openChapter(); } };
    },
    openChapter: function () {
      var self = this;
      this.openMenu({
        title: 'Chapter Progress',
        footer: function () { var P = LC.chapterProgress(); return 'The whole story: ' + P.done + ' of ' + P.total + ' chapters complete. What happened so far is in the Journal (J) > Chapters.'; },
        tabs: [{ label: 'To do now', rows: function () { return self.checklistRows(); } }, { label: 'All chapters', rows: function () { return self.chapterListRows(); } }]
      });
    },
    // a few small lines under the goal line: only the parts of this step still to do
    drawChecklist: function () {
      var S = this.S, W = this.world;
      if (!this.tCheck) this.tCheck = this.txt(16, 0, '', 13, '#e8d8b0', { wrap: 330, stroke: 4 });
      var t = this.tCheck, show = !!(W && !S.guest && !(S.flags && S.flags.noGuide) && this.tGoal && this.tGoal.visible);
      var lines = [];
      if (show) {
        var L = LC.checklist(), todo = L.items.filter(function (x) { return !x.ok; });
        if (L.items.length >= 2 && todo.length) {
          lines = todo.slice(0, 4).map(function (x) { return '· ' + x.t; });
          if (todo.length > 4) lines.push('  (+' + (todo.length - 4) + ' more: Journal > Chapters)');
        }
      }
      var s = lines.join('\n');
      if (t.text !== s) t.setText(s);
      t.setVisible(!!s);
      if (s) t.setPosition(this.tGoal.x, this.tGoal.y + this.tGoal.height + 4);
    }
  });

  // the pause menu's switch now covers both helpers: the guide arrow and these lines
  LC.pauseExtraRow3 = function () {
    var S = LC.State.s;
    if (!S) return null;
    return { icon: 'ic_glow', label: 'Story helper: ' + (S.flags.noGuide ? 'Off' : 'On'), sub: 'A yellow arrow to the next thing to do, and a short checklist under the goal line. (The full checklist is always in the Journal > Chapters.)', action: function () { S.flags.noGuide = !S.flags.noGuide; } };
  };

  // ---------------------------------------------------------------- hooks
  var chapterRows = LC.UIScene.prototype.chapterRows;
  LC.UIScene.prototype.chapterRows = function () { return this.checklistRows().concat(chapterRows.call(this)); };
  var drawSkills = LC.UIScene.prototype.drawSkills;
  LC.UIScene.prototype.drawSkills = function () { drawSkills.apply(this, arguments); this.drawChecklist(); };
})(window.LC);
