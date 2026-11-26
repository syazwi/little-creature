/* Playable developer routes for Chapters 7–11 and 18 to 20. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var R = LC.DevRoutes, T = 16;
  function here(p, area, act) { if (p.travel(area)) act(); }
  function openNextDay(p, tag, hour) {
    var w = p.world, q = w.S.quests;
    if (!p.travel('farm')) return;
    if (q[tag] !== undefined && w.S.day <= q[tag]) { p.sleep(); return; }
    p.clock(hour);
  }
  function night(p, h) { if (p.world.S.minutes < h * 60) p.clock(h); }

  R[7] = function (p, step) {
    var w = p.world, q = w.S.quests, C = LC.C7;
    if (step === 0) { openNextDay(p, 'c7wait', 8); return; }
    if (step === 1) { p.npc('puteri_ledang', /^The thunder over/); return; }
    if (step === 2) { p.jong(/^Sail to Kampung Santubong/, 'Board the jong to Kampung Santubong'); return; }
    if (step === 3) { p.npc('dayang', /^The thunder$/); return; }
    if (step === 4) {
      night(p, 20);
      if (!q.c7askS) p.npc('santubong', /^The thunder$/);
      else if (!q.c7askJ) p.npc('sejinjang', /^The thunder$/);
      else if (!q.c7kain) {
        var dyes = { benang_emas: C.thread };
        C.dyes.forEach(function (id) { dyes[id] = 1; });
        p.supply(dyes);
        here(p, 'santubong', function () { p.prop('tenun7', 'Weave with Puteri Santubong'); });
      } else if (!q.c7beras) {
        p.supply({ padi: 3 });
        here(p, 'santubong', function () { p.prop('lesung7', 'Pound the wedding rice'); });
      } else p.npc('santubong', /^Carry her words/);
      return;
    }
    if (step === 5) { here(p, 'santubong', function () { p.foes(/^(ribut|camar)$/); }); return; }
    if (step === 6) { p.npc('serapi', /^The princesses/); return; }
    if (step === 7) { here(p, 'satang', function () { if (!p.foes(/^bualang7$/)) p.prop('karang7', 'Face Sang Bualang'); }); return; }
    if (step === 8) { p.npc('bualang', q.c7sat ? /^Give him the wau/ : /^Sit with him/, q.c7sat ? { wau_bualang: 1 } : null); return; }
    if (!q.c7aboard) p.npc('puteri_ledang', /^Come to Santubong/);
    else p.jong(/^Sail to Kampung Santubong/, 'Sail to Santubong with the princess');
  };

  R[8] = function (p, step) {
    var w = p.world, q = w.S.quests, C = LC.C8;
    if (step === 0) { openNextDay(p, 'c8wait', 8); return; }
    if (step === 1) { p.npc('duyung', /^The black water/); return; }
    if (step === 2) { p.npc(q.c8ratu ? 'poseidon' : 'ratukidul', /^The war$/); return; }
    if (step === 3) { here(p, 'gelora', function () { p.prop(function (o) { return o.type === 'serpih8' && !(q.c8sh || {})[o.i]; }, 'Collect the broken shards'); }); return; }
    if (step === 4) { p.npc('lampir', q.c8confess ? /^Air Penawar/ : /^The black jar/, q.c8confess ? C.cure : null); return; }
    if (step === 5 || step === 6) {
      here(p, 'gelora', function () {
        if (!p.foes(/^(nagaibu8|ketos8|ratu8|poseidon8)$/)) p.near(22, step === 5 ? 9 : 11, 'Approach the dragons and rulers');
      }); return;
    }
    if (step === 7) { p.npc('nagaibu', /^Fetch Nek Lampir/); return; }
    var i = C.jarSpots.findIndex(function (spot, index) { return !(q.c8jar || {})[index]; });
    if (i < 0 || LC.State.count('balang_hitam') >= C.jars) here(p, 'farm', function () { p.prop('nek8', 'Bring the jars to Nek Lampir'); });
    else here(p, C.jarSpots[i][0], function () { p.prop(function (o) { return o.type === 'jar8' && o.i === i; }, 'Collect the black jar'); });
  };

  R[9] = function (p, step) {
    var w = p.world, q = w.S.quests, C = LC.C9;
    if (step === 0) { openNextDay(p, 'c9wait', C.night / 60); return; }
    if (step === 1) {
      if (!q.c9boat) { here(p, 'farm', function () { p.prop('hanyut9', 'Examine the empty boat'); }); return; }
      p.npc('mak_som', /^Pak Awang$/); return;
    }
    if (step === 2) {
      here(p, 'bakau', function () {
        var target = C.find[Math.min(3, q.c9find || 0)];
        p.near(target[0] - 0.5, target[1] - 0.3, 'Follow the song in the mangrove', q.c9find >= 3 ? 50 : 23);
      }); return;
    }
    if (step === 3) {
      if (!q.c9pawang) { p.npc('tok_pawang', /^The singing$/); return; }
      if (!LC.State.count('mayang_pinang')) { here(p, 'bakau', function () { p.prop('pinang9', 'Pick the mayang'); }); return; }
      if (!q.c9chased && w.area === 'bakau') {
        if (w.c9.chase && !w.c9.chase.quiet) p.stand(C.chase.endX + 1, 14, 'Escape along the boardwalk');
        return;
      }
      p.npc('tok_pawang', /^The Ulek Mayang$/, { nasi_kunyit: 1 }); return;
    }
    if (step === 4) { here(p, 'bakau', function () { p.prop('pawang9', 'Answer the song'); }); return; }
    if (step === 5) {
      if (w.area === 'bakau' && LC.State.isOpen('guatujuh')) { p.prop('dive9', 'Dive into the whirlpool'); return; }
      here(p, 'guatujuh', function () { p.prop(function (o) { return o.type === 'kima9' && o.i === (q.c9right || 0); }, 'Follow the voice to the clam'); }); return;
    }
    if (w.area === 'guatujuh') p.prop('naik9', 'Swim back to the beach');
    else here(p, 'kabus', function () { p.prop('awang9', 'Return Pak Awang’s spirit'); });
  };

  R[10] = function (p, step) {
    var w = p.world, q = w.S.quests, C = LC.C10;
    if (step === 0) { openNextDay(p, 'c10wait', 8); return; }
    if (step === 1) {
      here(p, 'farm', function () {
        var hop = w.c10.hop;
        if (hop) p.near(hop.spr.x / T - 0.5, hop.spr.y / T - 0.5, 'Follow the glowing grasshopper');
        else p.prop('anyam10', 'Read the woven grasshopper');
      }); return;
    }
    if (step === 2) { here(p, 'tanjung', function () {
      if (w.c10.seek) p.near(w.c10.seek.kid.x / T - 0.5, w.c10.seek.kid.y / T - 0.5, 'Find Belalang and Pelita');
    }); return; }
    if (step === 3) {
      if (!q.c10chores) p.npc('belalang', /^Your chores/);
      else if ((q.c10air || 0) < C.water) p.prop(w.c10.carry ? 'tempayan10' : 'perigi10', w.c10.carry ? 'Pour water in the tempayan' : 'Fill the bucket at the well');
      else if (!q.c10give) p.npc('belalang', /^Firewood and coconuts/, C.give);
      else p.npc('belalang', /^All done/);
      return;
    }
    if (step === 4) {
      if (!q.c10sultan) p.npc('sultan_muzaffar', /^The stolen chest/);
      else if (!q.c10with && !q.c10won) p.npc('belalang', /^Track the thieves/);
      else here(p, 'merbau', function () {
        if (q.c10won) p.prop('peti10', 'Recover the stolen chest');
        else if (!p.foes(/ketua10|pencuri10/)) p.near(C.camp.x, C.camp.y, 'Follow the trail to the thieves');
      });
      return;
    }
    if (step === 5) { p.npc('sultan_muzaffar', /^Return the Peti/); return; }
    if (step === 6 && !q.c10heard) { here(p, 'tanjung', function () { night(p, 21); p.prop('sampan10', 'Hide in the sampan'); }); return; }
    if (step === 6) { p.clock(9); p.npc('sultan_muzaffar', /^The riddle contest/); return; }
    p.npc('pak_belalang', /^The truth$/);
  };

  R[11] = function (p, step) {
    var w = p.world, q = w.S.quests, C = LC.C11, sh = w.c11.ship;
    if (step === 0) { openNextDay(p, 'c11wait', C.hookFrom / 60); return; }
    if (step === 1) { here(p, 'farm', function () { p.prop('arani11', 'Talk to Mbo’ Arani'); }); return; }
    if (step === 2) { p.npc('sultan_sulu', /^The Bakunawa$/); return; }
    if (step === 3) {
      if (!q.c11gong) p.npc('jaliha', /^Learn the kulintang/);
      else if (!q.c11dive) p.npc('arani', /^A pedoman/);
      else if (!q.c11berani && !LC.State.count('batu_berani')) {
        if (w.area === 'terumbu') p.prop('karam11', 'Find the lodestone in the wreck');
        else if (!LC.State.friend('naga')) p.travel('terumbu');
        else here(p, 'sulu', function () { p.prop('selam11', 'Dive for the lodestone'); });
      } else if (!q.c11pedoman) p.npc('arani', /^The batu berani/);
      else if (!q.c11prov) p.npc('arani', /^Provisions for the crew/, C.provisions);
      else p.npc('arani', /^Ready to sail/);
      return;
    }
    if (step === 4) {
      if (!sh) { here(p, 'sulu', function () { p.prop('helm11', 'Take the helm of the vinta'); }); return; }
      var leg = C.legs[q.c11leg || 0], a = w.shipAction();
      if (leg) p.sail(leg.to[0], leg.to[1], leg.r, 'Follow the chart • ' + leg.en);
      else if (a && Math.hypot(sh.x - C.bulan.x * T, sh.y - C.bulan.y * T) < C.bulan.r * T) w.doAction();
      else p.sail(C.bulan.x, C.bulan.y, C.bulan.r, 'Sail to Pulau Bulan');
      return;
    }
    if (step === 5) {
      here(p, 'bulan', function () {
        var b = w.c11.boss;
        if (!b || !b.ready) return;
        if (b.mode === 'risen') p.attack(b.e);
        else p.prop(function (o) { return o.type === 'agung11' && w.c11.gongs[o.i] <= w.time.now; }, 'Ring the agung to reveal the Bakunawa');
      }); return;
    }
    if (step === 6) { p.npc('sultan_sulu', /^The Mutiara Kembar$/); return; }
    if (step === 7) { openNextDay(p, 'c11p2wait', 9); return; }
    if (step === 8) { here(p, 'barunai', function () { p.prop('vision', 'Touch Pelita’s stone lamp'); }); return; }
    if (step === 12 && w.area === 'kapal11') { p.foes(/^(askar|kapten11)$/); return; }
    if (w.area === 'sauh11') {
      if (step === 10) p.prop(function (o) { return o.type === 'tali11' && !(q.c11rope || {})[o.i]; }, 'Cut an anchor rope');
      else p.prop('naik11b', 'Swim back to the vinta');
      return;
    }
    if (!sh) {
      if (w.area === 'kayer') p.prop('helm11', 'Take the lead vinta');
      else here(p, 'barunai', function () { p.prop('vision', 'Return to 1578'); });
      return;
    }
    if (step === 9 && !q.c11p2leg) { p.sail(C.p2.legA.to[0], C.p2.legA.to[1], C.p2.legA.r, 'Find Batu Kembar'); return; }
    var fleet = C.p2.fleet, x = fleet.x + 2.5 - (q.c11cut ? 4 : 0), y = fleet.y + 1 + (q.c11cut ? 9 : 0);
    var action = w.shipAction2();
    if (action && Math.hypot(sh.x - x * T, sh.y - y * T) < 10 * T) w.doAction();
    else p.sail(x, y, 8, 'Follow the fleet’s bells');
  };

  // ================================================================ v3.21: Chapters 18 and 19
  function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function toward(p, target, label) {   // far away: find a path; close: walk straight at it
    var d = dist(p.world.player, target);
    if (d > 48) { p.near(target.x / T - 0.5, target.y / T - 0.8, label, 20); return; }
    p.state.action = label;
    if (d > 3) p.state.vector = p.vector(target);
  }
  function away(p, from, label) {
    var pl = p.world.player, dx = pl.x - from.x, dy = pl.y - from.y, d = Math.hypot(dx, dy) || 1;
    p.state.action = label; p.state.vector = { x: dx / d, y: dy / d };
  }

  // Chapter 18, Bujang Belajar Mantera?
  R[18] = function (p, step) {
    var w = p.world, q = w.S.quests, C = LC.C18, b = w.bujang, L = b && b.lesson, pl = w.player;
    p.state.choice = /^(Join them!|I vouch for them)$/;
    function school() {
      if (w.area === 'mantera') return true;
      if (w.area === 'gelap18') { p.prop('g18_out', 'Climb back up to the courtyard'); return false; }
      if (w.area === 'ujian18') { p.prop('u18_out', 'Leave the exam hall'); return false; }
      if (p.travel('farm')) p.object('mantera_letter', 'Take Jack’s enchanted letter to Sekolah Mantera');
      return false;
    }
    if (step === 0) { openNextDay(p, 'c18wait', 9); return; }
    if (step === 1) { if (p.travel('kampung')) p.prop('k_bujang18_kudin', 'Talk to the three bachelors'); return; }
    if (step === 2) { if (school()) p.object('mantera_suraya', 'Vouch for the bachelors with Suraya'); return; }
    if (step === 3) {   // Ilmu Terapung: stand on the feather's shadow when it sinks low, and dodge Leman's durians
      if (!school()) return;
      if (!L || L.kind !== 'float') { p.object('mantera_suraya', 'Ask Suraya for the first lesson'); return; }
      var drop = L.durians.find(function (d) { return d.left < 0.8 && dist(d, pl) < 17; });
      if (drop && L.h > 0.3) { away(p, drop, 'Dodging a durian'); return; }
      if (L.h <= 0.6 && dist(pl, L) < 15) { w.doAction(); return; }
      toward(p, L, 'Keeping the feather up (' + L.lifts + ' / ' + C.feather.lifts + ')');
      return;
    }
    if (step === 4) {   // Kelas Gelap: walk slowly enough for Sani, and wake each rune with him beside you
      if (w.area === 'mantera') { p.object('m_gelap18', 'Go down to the dark room with Sani'); return; }
      if (w.area !== 'gelap18') { school(); return; }
      var sani = b && b.sani, lit = q.c18runes || {}, next = C.runes.findIndex(function (r, i) { return !lit[i]; });
      if (!sani || next < 0) return;
      if (sani.scared) { toward(p, sani.spr, 'Going back for Sani'); return; }
      if (dist(sani.spr, pl) > 60) { p.state.action = 'Waiting for Sani'; return; }   // (he is coming along your trail)
      p.object('g18_rune' + next, 'Wake rune ' + (next + 1) + ' with Sani');
      if (p.state.vector) { p.state.vector.x *= 0.34; p.state.vector.y *= 0.34; }   // a gentle walk (a half-pushed stick), so Sani keeps up

      return;
    }
    if (step === 5) {   // Kelas Pantul: step in front of the bachelor the rune aims at, and send the bolt back
      if (w.area === 'gelap18') { p.prop('g18_out', 'Climb back up to the courtyard'); return; }
      if (!school()) return;
      if (!L || L.kind !== 'pantul') { p.object('mantera_suraya', 'Ask Suraya for the last lesson'); return; }
      var rx = (C.rune.x + 0.5) * T, ry = (C.rune.y + 1) * T - 12, aim = L.bolt && !L.bolt.back ? L.bolt.img : L.aim ? L.aim.img : null;
      if (L.bolt && !L.bolt.back && dist({ x: pl.x, y: pl.y - 8 }, L.bolt) < 26 && w.pantulAvailable() && !w.pantulLeft()) w.ui.pressKey('KeyP');
      if (!aim) { toward(p, { x: 12.5 * T, y: 14 * T }, 'Waiting for the rune (' + L.count + ' / ' + C.pantul + ')'); return; }
      var tx = aim.x, ty = aim.y - 10, dx = rx - tx, dy = ry - ty, d = Math.hypot(dx, dy) || 1;
      toward(p, { x: tx + dx / d * 16, y: ty + dy / d * 16 + 8 }, 'Shielding the bachelors (' + L.count + ' / ' + C.pantul + ')');
      return;
    }
    if (step === 6) { if (school()) p.object('m_pintu18', 'Sit by the fire, then open Pintu Empat Penjuru'); return; }
    if (step === 7) {   // Ujian Cermin: fight beside them, and step out of every marked attack
      if (w.area === 'ujian18') {
        var F = b && b.fight;
        if (q.c18exam || !F || F.phase !== 'fight') { p.state.action = 'Ujian Cermin'; return; }
        var mark = F.marks.find(function (m) { return m.left > 0 && m.kind !== 'song' && dist(m, pl) < m.r + 8; });
        if (mark) { away(p, mark, 'Stepping out of a marked attack'); return; }
        p.foes(/^bayang18_/);
        return;
      }
      if (!school()) return;
      if (!q.c18exam) p.object('m_pintu18', 'Enter the exam hall');
      else p.state.action = 'Graduation';
    }
  };

  // Chapter 19, Harum Sundal Malam
  R[19] = function (p, step) {
    var w = p.world, S = w.S, q = S.quests, C = LC.C19, m = w.maya, pl = w.player;
    p.state.choice = /^(He could never grow up|Your mother, Mak Kiah|Hold up the sisir)$/;
    function dark() { if (!C.isNight(S)) p.clock(19.4); }
    function kubur() {
      if (w.area === 'kubur19') return true;
      if (p.travel('kampung')) p.prop('k_kubur19', 'Walk up the lane to the old graveyard');
      return false;
    }
    function besar() {
      if (w.area === 'besar19') return true;
      if (w.area === 'dalam19') { p.prop('d_out19', 'Go back outside'); return false; }
      if (p.travel('kampung')) p.prop('k_besar19', 'Go up the hill to Tuan Hashim’s house');
      return false;
    }
    function dalam() {
      if (w.area === 'dalam19') return true;
      if (besar()) p.prop('b_pintu19', 'Go inside');
      return false;
    }
    if (step === 0) { openNextDay(p, 'c19wait', 19.4); return; }
    if (step === 1) { dark(); if (kubur()) p.prop('kb_maya', 'Talk to the woman under the kemboja tree'); return; }
    if (step === 2) { dark(); if (kubur()) p.prop(C.spots[q.c19spot || 0].id, 'Follow the scent to Maya’s sisir'); return; }
    if (step === 3) {
      if (S.day <= (q.c19day || 0)) { if (w.area === 'kubur19') p.prop('kb_back', 'Head home for the night'); else p.sleep(); return; }
      dark(); if (kubur()) p.prop('kb_maya', 'Sit with Maya');
      return;
    }
    if (step === 4) {
      dark();
      if (w.area === 'kubur19') { p.prop('kb_back', 'Back to Kampung Tepian'); return; }
      if (!p.travel('kampung')) return;
      var seen = q.c19signs || {}, sign = ['buaian', 'jemuran', 'pisang'].find(function (k) { return !seen[k]; });
      if (sign) p.prop('k_' + sign + '19', 'Look at the signs in the night');
      else p.prop('k_imam19', 'Talk to Tok Imam');
      return;
    }
    if (step === 5) {
      var lamps = q.c19lamps || {}, lamp = C.lamps.findIndex(function (l, i) { return !lamps[i]; });
      if (!q.c19welcome) { if (besar()) p.prop('b_hashim19', 'Meet the Hashims'); }
      else if (lamp >= 0) { if (dalam()) p.prop('d_lampu19_' + lamp, 'Light the lamps'); }
      else if (!q.c19bunga) { if (besar()) p.prop('b_sundal19', 'Cut the sundal malam'); }
      else if (!q.c19inah) { if (besar()) p.prop('b_inah19', 'Ask Mak Inah'); }
      else if (besar()) p.prop('b_hashim19', 'Tell Tuan Hashim');
      return;
    }
    if (step === 6) {
      if (S.minutes < C.watch) p.clock(20.5);
      if (!dalam()) return;
      var F = m && m.fight;
      if (!F) { p.near(14, 6, 'Keep watch by the cradle'); return; }
      if (F.phase !== 'fight' || !F.e) { p.state.action = 'The lamps go out...'; return; }
      var e = F.e.spr;
      if (F.cornered) { if (dist(pl, e) < 38) w.doAction(); else toward(p, e, 'Hold up the sisir'); return; }
      if (F.ring && dist(pl, { x: F.ring.x, y: F.ring.y - 12 }) < 92) { away(p, { x: F.ring.x, y: F.ring.y }, 'Out of her shriek'); return; }
      if (F.tele) {   // step sideways off the red line of her hair
        var t = F.tele, vx = Math.cos(t.ang), vy = Math.sin(t.ang), rx2 = pl.x - t.ox, ry2 = pl.y - 8 - (t.oy - 10), along = rx2 * vx + ry2 * vy;
        var side = rx2 * -vy + ry2 * vx;
        if (along > -10 && along < t.len + 10 && Math.abs(side) < 22) { p.state.action = 'Stepping out of her hair'; p.state.vector = side >= 0 ? { x: -vy, y: vx } : { x: vy, y: -vx }; return; }
      }
      p.attack(F.e);
      return;
    }
    if (step === 7) { if (dalam()) p.state.action = 'Persuade Maya to let her son grow up'; }
  };

  // Chapter 20, Part 2 (v3.23)
  function R20b(p, step) {
    var w = p.world, S = w.S, q = S.quests, C = LC.C20, c = w.c20, b = w.c20b, sea = c && c.sea;
    p.state.choice = /^(Tujuh \(seven\)|Tell the truth|Go home, little light|Take the photo|Never\. You are my family\.)$/;
    function steer(tx, ty, mag) { var sh = sea.sh, d = Math.hypot(tx - sh.x, ty - sh.y) || 1; p.state.vector = { x: (tx - sh.x) / d * (mag || 1), y: (ty - sh.y) / d * (mag || 1) }; }
    if (step === 8) {
      if (w.area !== 'farm') { p.travel('farm'); return; }
      if (S.day < (q.c20satDay || 0) + C.windDays) { p.sleep(); return; }
      if (S.minutes < 7 * 60) p.clock(8);
      p.state.action = 'Waiting for the monsoon wind'; return;
    }
    if (step === 9 && w.area === 'laut20b' && sea && sea.sh) {
      var sh = sea.sh, x = sh.x / T, R = sea.raft;
      p.state.action = 'Sailing to Sabah (' + Math.round(x / C.sabah.goalX * 100) + '%)';
      if (R && !R.on) { steer(R.x, R.y, 0.6); p.state.action = 'Back for the raft'; return; }
      if (R && R.on && sea.strain > 45) return;   // (let the rope rest)
      if (sea.bajau && !sea.netDone && sea.lepa) { steer(sea.lepa.x, sea.lepa.y, 0.75); p.state.action = 'Following the lepa'; return; }
      var WP = [[30, 18], [54, 17], [66, 15.5], [82, 15.5], [97, 18], [160, 18], [174, 20], [184, 24], [194, 28]];
      sea.wp2 = sea.wp2 || 0;
      while (sea.wp2 < WP.length - 1 && (Math.hypot(sh.x - WP[sea.wp2][0] * T, sh.y - WP[sea.wp2][1] * T) < 2.5 * T || x > WP[sea.wp2][0] + 1)) sea.wp2++;
      steer(WP[sea.wp2][0] * T, WP[sea.wp2][1] * T, R ? 0.42 : 1);
      return;
    }
    if (step === 9) { p.jong(/^Sail to Sabah with Seri Putih$/, 'Board the jong for Sabah'); return; }
    if (step === 10 && w.area === 'kina20' && sea && sea.sh) {
      if (sea.countPending && !sea.countOpen && !w.ui.modal) { w.buayaCountOpen(); return; }
      var ax = sea.sh.x / T - 8;
      steer(ax * T, w.buayaRiverMid(ax) * T, 0.8);
      p.state.action = 'Upriver';
      return;
    }
    if (step === 10) { p.jong(/^Sail back to the Kinabatangan$/, 'Back to the river'); return; }
    if (step >= 11 && step <= 15 && w.area !== 'sarang20') { p.jong(/^Sail back to the nest bank$/, 'Back to the nest bank'); return; }
    if (step === 11) { if (!b.cine) p.prop('s_putih20', 'Sit with Seri Putih'); else p.state.action = 'Long ago...'; return; }
    if (step === 12) { if (!b.cine) p.prop('s_loceng20', 'Ring the brass bell'); return; }
    if (step === 13) { if (!p.foes(/^kelam20b$/)) p.state.action = 'The shadows are coming'; return; }
    if (step === 14) {
      var Rd = b.ride;
      if (!Rd) { p.state.action = 'Climbing onto her back'; return; }
      var orb = Rd.orbs.filter(function (o) { return !o.done; }).map(function (o) { var L = C.nest.lake; return { x: (L.x + 0.5) * T + Math.cos(o.a + 0.5) * o.r, y: (L.y + 0.5) * T + Math.sin(o.a + 0.5) * o.r * 0.7 }; })
        .sort(function (a, b2) { return Math.hypot(a.x - Rd.x, a.y - Rd.y) - Math.hypot(b2.x - Rd.x, b2.y - Rd.y); })[0];
      if (orb) { var d2 = Math.hypot(orb.x - Rd.x, orb.y - Rd.y) || 1; p.state.vector = { x: (orb.x - Rd.x) / d2, y: (orb.y - Rd.y) / d2 }; }
      p.state.action = 'Riding the White One (' + Rd.got + ' / ' + C.ride.lights + ')';
      return;
    }
    if (step === 15) { if (b.heart && b.heart.open) w.doAction(); p.state.action = 'Waiting for its heart to open'; return; }
    if (step === 16) { if (w.area === 'sarang20') { p.state.action = 'Jumping into its heart'; return; } if (w.area !== 'dalam20') { p.jong(/^Back into the shadow$/, 'Back into the shadow'); return; } p.prop('d_pelita20', b.found ? 'Feed Pelita' : 'Follow the crying'); return; }
    if (step === 17) { if (w.area !== 'sarang20') { p.jong(/^Sail back to the nest bank$/, 'Back to the nest bank'); return; } if (!b.cine) p.prop('s_putih20', 'Let go'); else p.state.action = 'Letting go'; return; }
    if (step === 18) {
      if (w.area !== 'barunai') { p.jong(/^Sail to Kampong Ayer for the feast$/, 'To the feast'); return; }
      if (!b.feast) { p.state.action = 'Kenduri Terakhir'; return; }
      p.prop(function (o) { return o.type === 'buaya_feast' && o.nenek; }, 'Talk to Nenek for the photo');
    }
  }

  // Chapter 20, Janji Buaya Putih (Part 1)
  R[20] = function (p, step) {
    if (step >= 8) { R20b(p, step); return; }
    var w = p.world, S = w.S, q = S.quests, C = LC.C20, c = w.c20, pl = w.player;
    p.state.choice = /^(She is here to rest|She has never hurt anyone|She is just a guardian|Trust her as Nenek does|Sail to Kampong Ayer)$/;
    function ka() { return p.travel('barunai'); }
    function faceAt(x, y, dir, label) {   // stand on a tile, face a direction, press USE
      p.walk([{ x: x, y: y, dir: dir }], label, function (at) { w.dir = at.dir; w.doAction(); });
    }
    if (step === 0) { openNextDay(p, 'c20wait', 21.2); return; }
    if (step === 1) {
      if (!p.travel('farm')) return;
      if (!q.c20morning) { if (S.day <= (q.c20hookDay || 0)) p.sleep(); else { if (S.minutes >= C.watchAt) p.clock(8); p.state.action = 'Nenek is calling'; } return; }
      if (!q.c20set) { p.object('f_timun20b', 'Set the sticky scarecrow by Nenek’s vines'); return; }
      if (q.c20stuck) { p.object('f_orang20', 'Catch the thief'); return; }
      if (c && c.hidden) { p.state.action = 'Keeping very still in the straw'; return; }
      if (S.minutes < C.watchAt && S.minutes >= 6 * 60) p.clock(20.2);
      p.object('f_jerami20', 'Hide in the straw');
      return;
    }
    if (step === 2) { if (p.travel('farm')) p.near(C.farm.reeds.x + 1, C.farm.reeds.y - 1, 'Follow Sang Kancil to the reeds', 12); return; }
    if (step === 3 && w.area === 'laut20') {   // the voyage: sail the lane east, wait for her, and keep Pelita brave
      var sea = c && c.sea;
      if (!sea || sea.arrived) { p.state.action = 'Kampong Ayer!'; return; }
      var sh = sea.sh, cr = sea.cr, R2 = C.ring(sea.calm);
      if (sea.calm < 70 && sea.petCd <= 0) w.buayaSeaPet();
      var WP = [[20, 21], [60, 20], [80, 16.5], [96, 18], [110, 20], [148, 22], [164, 22], [182, 22], [200, 27]];   // (round the reefs and headlands)
      sea.wp = sea.wp || 0;
      while (sea.wp < WP.length - 1 && Math.hypot(sh.x - WP[sea.wp][0] * T, sh.y - WP[sea.wp][1] * T) < 2.5 * T) sea.wp++;
      if (sea.wp > 0 && sh.x < WP[sea.wp - 1][0] * T - 6 * T) sea.wp = 0;   // (turned back to an island to rest)
      if (Math.hypot(cr.x - sh.x, cr.y - sh.y) > R2 - 26) { p.state.action = 'Waiting for Seri Putih'; return; }
      var tx = WP[sea.wp][0] * T, ty = WP[sea.wp][1] * T, d = Math.hypot(tx - sh.x, ty - sh.y) || 1;
      p.state.action = 'Sailing to Kampong Ayer (' + Math.round(sh.x / (C.sea.goalX * T) * 100) + '%)';
      p.state.vector = { x: (tx - sh.x) / d, y: (ty - sh.y) / d };
      return;
    }
    if (step === 3) {
      if (!p.travel('farm')) return;
      if ((q.c20fedF || 0) < C.fishFarm) { p.supply({ ikan_tilapia: C.fishFarm }); p.object('f_putih20', 'Feed Seri Putih'); return; }
      if (!C.isNight(S)) p.clock(19.5);
      p.object('f_nenek20', 'Sail by night with Nenek');
      return;
    }
    if (step === 4) {
      if (!ka()) return;
      var cd = q.c20calmed || {}, who = ['esah', 'jalil', 'tijah'].find(function (k) { return !cd[k]; });
      if (who) { p.prop('k_' + who + '20', 'Calm the water village'); return; }
      if (!cd.semaun) { p.prop('k_semaun20', 'Talk to Awang Semaun'); return; }
      if (!q.c20proof) { p.prop('k_berbai20', 'Talk to Pateh Berbai'); return; }
      p.prop('k_sari20', 'Talk to Damang Sari');
      return;
    }
    if (step === 5) {
      var t = q.c20task || {};
      if (!t.rakit) { p.supply({ nibong: 6, belian: 3 }); p.npc('lajak'); return; }
      if (!t.loceng) { p.npc('kemala'); return; }
      p.supply({ ikan_kembung: C.fishKA });
      if (ka()) p.prop('k_putih20', 'Feed Seri Putih');
      return;
    }
    if (step === 6) {   // the Night of Fire
      if (!ka()) return;
      var f = c && c.fire;
      if (!f) { if (S.minutes < C.fireAt) p.clock(21.05); p.near(24, 18, 'Waiting for the night', 20); return; }
      if (!f.started || f.done) { p.state.action = 'The lamps go out...'; return; }
      if (!f.family) { p.prop('k_taxi20', 'Row to the trapped family'); return; }
      var side = { '16,21': [17, 21, 'left'], '32,21': [31, 21, 'right'], '20,26': [20, 25, 'down'], '28,26': [28, 25, 'down'] };
      var cut = C.ka.cuts.find(function (ct) { var k = ct.x + ',' + ct.y; return !f.cut[k] && !f.tiles[k]; });
      if (cut) { var sd = side[cut.x + ',' + cut.y]; faceAt(sd[0], sd[1], sd[2], 'Cut the planks'); return; }
      if (!f.bucket) { p.stand(24, 19, 'Take a bucket from the chain'); return; }
      var fires = Object.keys(f.tiles).map(function (k) { return f.tiles[k]; }), goals = [];
      fires.forEach(function (ft) {
        [[1, 0, 'left'], [-1, 0, 'right'], [0, 1, 'up'], [0, -1, 'down']].forEach(function (o) {
          var x = ft.x + o[0], y = ft.y + o[1];
          if (w.grid[y] && w.grid[y][x] === 'j' && !f.tiles[x + ',' + y] && !f.cut[x + ',' + y]) goals.push({ x: x, y: y, dir: o[2] });
        });
      });
      if (!goals.length) { p.state.action = 'Fighting the fire'; return; }
      p.walk(goals, 'Throwing water on the fire (' + f.n + ' left)', function (at) { w.dir = at.dir; w.doAction(); });
      return;
    }
    if (step === 7) {
      if (!ka()) return;
      if (c && c.cine) { p.state.action = 'The White One'; return; }
      if (!q.c20sat) { if (c && c.alone) faceAt(18, 21, 'left', 'Sit with Pelita'); else p.state.action = 'After the fire'; return; }
      if (S.day <= (q.c20satDay || 0)) { p.sleep(true); return; }
      p.state.action = 'The send-off';
    }
  };
})(window.LC);
