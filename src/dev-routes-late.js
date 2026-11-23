/* Playable developer routes for Chapters 7–11. */
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
})(window.LC);
