/* Playable developer routes for Chapters 1–6. Supplies shorten gathering; the game awards each objective. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var routes = LC.DevRoutes;
  function here(p, area, fn) { if (p.travel(area)) fn(); }
  function waitForTomorrow(p, day) {
    if (p.world.S.day > (day || 0)) return false;
    p.sleep(); return true;
  }
  function night(p, hour) { if (p.world.S.minutes < hour * 60) p.clock(hour); }

  routes[1] = function (p) {
    here(p, 'farm', function () {
      var w = p.world, g = w.S.ghost;
      if (LC.State.level() >= LC.LEGEND_LEVEL) { p.state.action = 'Waiting for Nenek’s letter'; return; }
      if (g.full >= 96 && g.glow >= 89) { p.sleep(); return; }
      var id = g.glow < 89 ? 'canang' : 'nasi_lemak';
      p.supply({ [id]: 2 });
      var index = w.S.inv.findIndex(function (slot) { return slot && slot.id === id; });
      if (index >= 0 && w.S.sel !== index) w.ui.selectSlot(index);
      p.prop('spirit', 'Care for Pelita • Lv ' + LC.State.level() + '/' + LC.LEGEND_LEVEL, /^Place Canang/i);
    });
  };
  routes[2] = function (p, step) {
    var w = p.world, q = w.S.quests;
    if (step === 1) { p.npc('alak'); return; }
    if (step === 2) {
      var brother = LC.BROTHERS.find(function (id) { return !(q.ch2found || {})[id]; });
      if (!brother) { p.npc('alak', /^All fourteen/); return; }
      var item = LC.VILLAGERS[brother].find;
      p.npc(brother, /^Ask him to come/, { [item[0]]: item[1] }); return;
    }
    if (step === 3) { here(p, 'barunai', function () { p.prop(q.ch2t1 >= LC.CH2.trail1.length ? 'tembadau' : 'jejak', 'Follow the tembadau trail'); }); return; }
    if (step === 4) { p.npc('alak', /^The tembadau found/); return; }
    if (step === 5) { p.npc('semaun', /^A voyage to Johor/); return; }
    if (step === 6) {
      if (waitForTomorrow(p, q.ch2day)) return;
      if (!q.ch2bird) { here(p, 'barunai', function () { p.prop(q.ch2t2 >= LC.CH2.trail2.length ? 'pinggai' : 'bulu', 'Look for Si Pinggai'); }); return; }
      if (!q.ch2ship) { here(p, 'barunai', function () { p.prop('salvage', 'Dive to the sunken chest'); }); return; }
      p.npc('puteri', /^Thank you, friend/); return;
    }
    p.npc('alak', /^The wedding kenduri/, { nasi_lemak: 6 });
  };
  routes[3] = function (p, step) {
    var w = p.world, q = w.S.quests;
    switch (step) {
      case 0: p.npc('berbai', /^Why build/); break;
      case 1: case 2: case 3: p.npc('berbai', /^Build /, LC.KA_STAGES[step].cost); break;
      case 4: p.npc('alak', /^Ships at the river mouth/); break;
      case 5: if (q.ch3trainDay === w.S.day) p.sleep(); else p.npc('senuai', /^Train Mutiara/); break;
      case 6: p.npc('senuai', /^The great cockfight/); break;
      case 7:
        p.supply({ pinggan_emas: 1, bulu_mutiara: 1 });
        here(p, 'teluk', function () { night(p, 20); p.prop('ghost_ayam', 'Approach the ghost rooster'); });
        break;
      case 8: p.npc('semaun', /^Trouble in the bay/); break;
      case 9: p.npc('gergasi', /^Trade for the magic fish skin/, LC.OGRE_TRADE); break;
      case 10: here(p, 'teluk', function () { if (!p.foes(/^bilanapura$/) && !w.jinnOn) p.prop('hero', 'Bring the fish skin to the heroes'); }); break;
      case 11:
        if (w.area !== 'kayer') { here(p, 'barunai', function () { p.prop('vision', 'Touch Pelita’s stone lamp'); }); break; }
        if (!q.tourOn) p.npc('antonio', /^Show Antonio around/);
        else if (Object.keys(q.tour || {}).length < LC.TOUR.length) p.prop(function (o) { return o.type === 'tour' && !(q.tour || {})[o.stop]; }, 'Show Antonio the next landmark');
        else p.npc('antonio', /^Antonio/);
        break;
      case 12:
        if (w.area !== 'kayer') { here(p, 'barunai', function () { p.prop('vision', 'Return to Kampong Ayer in 1578'); }); break; }
        var war = w.war;
        if (!war) { p.state.action = 'Wait for the returning vision'; break; }
        if (war.wave === 1) p.prop(function (o) { return o.type === 'meriam' && war.ships[o.i] && !war.ships[o.i].gone; }, 'Fire the meriam');
        if (war.wave === 2) { p.supply({ can: 1 }); w.S.water = w.S.maxWater; p.prop('api', 'Put out the fires', null, 3); }
        if (war.wave === 3) p.prop('keluarga', 'Row families to safety', null, 3);
        if (war.wave === 4) p.foes(/^askar$/);
        break;
    }
  };
  routes[4] = function (p, step) {
    var w = p.world, q = w.S.quests;
    if (step === 0) { if (!waitForTomorrow(p, q.ch3day)) p.travel('farm'); return; }
    if (step === 1) { p.npc('mat', /^Red sails/); return; }
    if (step === 2) {
      if (!q.c4pagar) p.npc('leong', /^Build a bamboo stockade/, LC.C4.stockade);
      else if (!q.c4meriam) p.npc('kemala', /^Cannons for/, LC.C4.cannons);
      else if (!q.c4allies) p.npc('semaun', /^Will the brothers come/);
      return;
    }
    var wave = LC.c4Wave();
    if (wave === 2) { here(p, 'farm', function () { p.supply({ can: 1 }); w.S.water = w.S.maxWater; p.prop('api4', 'Douse the farm fires', null, 3); }); return; }
    here(p, wave >= 3 ? 'farm' : 'kampung', function () { night(p, 20); p.foes(/prajurit|laksamana|naga/); });
  };
  routes[5] = function (p, step) {
    var w = p.world, q = w.S.quests;
    if (step === 0) { if (!waitForTomorrow(p, q.ch4day)) here(p, 'farm', function () { night(p, 20); }); return; }
    if (step === 1) { here(p, 'farm', function () { night(p, 20); p.foes(/^kelam/); }); return; }
    if (step === 2) {
      if (!q.c5lamps) { p.npc('leong', /^Guard lamps/, LC.C5.lamps); return; }
      here(p, 'farm', function () { p.prop('jong_dagang', 'Board the jong to Java', q.c5wira ? /^Sail to Java$/ : /^The shadow shard$/); }); return;
    }
    if (step === 3) {
      p.npc('empu', q.c5empu ? /^Make the Pelita Purnama/ : /^Pelita is fading/, q.c5empu ? LC.C5.forge : null); return;
    }
    here(p, 'kelam', function () {
      if (!p.prop(function (o) { return o.type === 'obor5' && !(q.c5obor || {})[o.i]; }, 'Light the stone torches')) p.foes(/kelam|maklampir/);
    });
  };
  routes[6] = function (p, step) {
    var w = p.world, q = w.S.quests, C = LC.C6;
    if (step === 0) { if (!waitForTomorrow(p, q.ch5day)) here(p, 'farm', function () { p.clock(8); }); return; }
    if (step === 1) { here(p, 'farm', function () { night(p, 20); }); return; }
    if (step === 2) { p.jong(/^Sail to Gunung Ledang$/, 'Board the jong to Gunung Ledang'); return; }
    if (step === 3) { if (w.c6duel) p.attack(w.duelFoe()); else p.npc('hangtuah', /Hang Tuah.s test/); return; }
    if (step === 4) {
      if (!q.c6asked) { p.npc('puteri_ledang', /^Nenek is cursed/); return; }
      var tear = C.tears.find(function (id) { return !(q.c6tears || {})[id]; });
      if (tear) { p.npc(tear, /^A tear for Nenek/); return; }
      if (!q.c6bridge) { p.npc('leong', /^A bridge of gold and silver/, C.bridge); return; }
      p.npc('puteri_ledang', /^The three gifts/, { pinang_muda: 3 }); return;
    }
    if (step === 5) { here(p, 'ledang', function () { if (!p.foes(/lampir/)) p.prop('bunga6', 'Approach the Bunga Ledang'); }); return; }
    here(p, 'farm', function () { p.prop('nenek6', 'Wake Nenek'); });
  };
})(window.LC);
