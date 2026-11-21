/* v2.8: companions and your stats.
 * - Everyone travelling with you is in one place (pause menu > Companions, or the second tab of "You"): what each one
 *   does for you, and a button to send them home (it used to be only at Pelita's spirit house, or in Badang's own menu
 *   while he was away following you). Spirit friends can be brought along from there too.
 * - Every companion helps: each folk spirit gives a bonus while it travels with you (LC.SPIRITS[sid].perk), Si Tanggang
 *   quickens your step; Badang, Nek Lampir and Sang Bualang fight for you.
 * - My stats: health, energy, strength, attack, speed, kepeng, Pelita, the bag, the gembor, abilities, blessings, records.
 * Mixed into LC.WorldScene and LC.UIScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var WP = LC.WorldScene.prototype, UP = LC.UIScene.prototype;
  LC.COMP = { kenyalang: 0.15, escort: 0.10, fishChance: 1 / 3, tillChance: 0.2, tillMin: 5, tillMax: 15 };
  var MINE = { boulder: 1, clay: 1, glint: 1, goldvein: 1, crystal: 1 };   // the Bunian's help is for plants, not ore
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  // ================================================================ the bonuses (World)
  WP.compSpeed = function () {
    var S = this.S;
    if (S.riding) return 1;
    return 1 + (S.companion === 'kenyalang' && LC.State.friend('kenyalang') ? LC.COMP.kenyalang : 0) + (S.escort ? LC.COMP.escort : 0);
  };
  // one more of what you just got, from the spirit at your side. Returns a note for the toast ('' when there is none).
  WP.companionBonus = function (kind, id, o) {
    var S = this.S, c = S.companion, sp = c && LC.SPIRITS[c];
    if (!sp || !LC.State.friend(c)) return '';
    var ok = (kind === 'harvest' && c === 'semangat') || (kind === 'forage' && c === 'bunian' && !(o && MINE[o.kind]))
      || (kind === 'tree' && c === 'bunian') || (kind === 'fish' && c === 'naga' && Math.random() < LC.COMP.fishChance);
    if (!ok || !LC.State.add(id, 1)) return '';
    if (this.compSpr) this.fx.sparkle.explode(5, this.compSpr.x, this.compSpr.y - 10);
    return '  (+1 from the ' + sp.name + ')';
  };
  WP.companionTill = function () {   // the Nuno sa Punso knows where things are buried
    var S = this.S;
    if (S.companion !== 'nuno' || !LC.State.friend('nuno') || Math.random() >= LC.COMP.tillChance) return;
    var k = LC.COMP.tillMin + Math.floor(Math.random() * (LC.COMP.tillMax - LC.COMP.tillMin + 1));
    S.kepeng += k; if (S.stats) S.stats.earned = (S.stats.earned || 0) + k;
    LC.Audio.sfx('coin');
    if (this.compSpr) this.fx.sparkle.explode(5, this.compSpr.x, this.compSpr.y - 10);
    this.toast('The Nuno sa Punso taps the soil with his stick: you dig up ' + k + ' kepeng!', 'ic_coin');
  };
  // Si Tanggang goes back to the sunken junk to wait (talk to him there to try again)
  WP.stopEscort = function () {
    var S = this.S;
    if (!S.escort || this.reuniting) return false;
    S.escort = null;
    if (this.escortSpr) {
      var s = this.escortSpr, g = this.escortGlow;
      this.escortSpr = null;
      this.fx.sparkle.explode(8, s.x, s.y - 10);
      this.tweens.add({ targets: [s, g], alpha: 0, duration: 600, onComplete: function () { s.destroy(); g.destroy(); } });
    }
    if (LC.villagerArea('tanggang') === this.area) this.placeVillager('tanggang');
    if (this.checkGroups) this.checkGroups();
    LC.Audio.sfx('chime');
    this.toast('Si Tanggang drifts back to the sunken junk to wait for you. Talk to him there when you are ready.', 'ic_glow');
    return true;
  };
  WP.companionCount = function () {
    var S = this.S;
    return (S.companion && LC.State.friend(S.companion) ? 1 : 0) + (LC.badangBuddy() ? 1 : 0) + (this.nek && !this.nek.leaving ? 1 : 0)
      + (this.bual && !this.bual.leaving ? 1 : 0) + (S.escort ? 1 : 0);
  };

  // ================================================================ the screens (UI)
  Object.assign(UP, {
    openStats: function (tab) {
      var self = this;
      this.openMenu({
        title: 'You', tab: tab || 0,
        footer: 'One spirit friend travels with you at a time. Send anyone home from the Companions tab.',
        tabs: [{ label: 'My stats', rows: function () { return self.statRows(); } },
          { label: 'Companions', rows: function () { return self.companionRows(); } }]
      });
    },

    companionRows: function () {
      var self = this, S = this.S, W = this.world, rows = [], tap = this.touchOn;
      var pel = W.following && W.following();
      rows.push({ icon: 'ic_bond', label: 'Pelita' + (pel ? '  (with you)' : '  (at its spirit house)'),
        sub: pel ? 'Your own little spirit. It stays with you while its joy is 12 or more, and every level brings a gift.' : 'Your own little spirit. Play with it and feed it: once its joy is 12 or more, it follows you again.' });
      // ---- with you now
      var sid = S.companion, sp = sid && LC.SPIRITS[sid];
      if (sp && LC.State.friend(sid)) rows.push({ icon: 'sp_' + sid, iconScale: 1.4, label: sp.name + '  (with you)', right: 'Send home',
        sub: 'While it travels with you: ' + sp.perk + '. Its blessing works either way: ' + sp.blessing + '.', action: function () { W.setCompanion(sid); } });
      if (LC.badangBuddy()) rows.push({ icon: 'ic_badang', label: 'Badang  (with you today)', right: 'Send home',
        sub: 'He fights anything that threatens you, all day.', action: function () { W.sendBuddyHome(); } });
      if (W.nek && !W.nek.leaving) rows.push({ icon: 'ic_nek', label: 'Nek Lampir  (with you)', right: 'Send home',
        sub: 'She throws pepper at anything that attacks you, and pulls you out of danger when you are badly hurt. In a fight, ' + (tap ? 'tap her face' : 'press C') + ' for her green circle (half the hurt inside it).',
        action: function () { W.nekLeave(pick(LC.NEKTEXT.leave)); } });
      if (W.bual && !W.bual.leaving) rows.push({ icon: 'ic_wau', label: 'Sang Bualang  (with you)', right: 'Send home',
        sub: 'He spins into enemies and flings them back, dizzy. ' + (tap ? 'Tap the wau' : 'Press B') + ' to send him spinning at once.', action: function () { W.bualLeave(pick(LC.BUALANGTEXT.leave)); } });
      if (S.escort) rows.push({ icon: 'npc_tanggang_0', iconScale: 1.6, label: 'Si Tanggang  (with you)', right: 'Ask him to wait', enabled: !W.reuniting, why: 'He is with his mother now.',
        sub: 'While he walks with you: you walk ' + Math.round(LC.COMP.escort * 100) + '% faster. Take him to Mak Deruma on the beach of Pulau Mutiara.', action: function () { W.stopEscort(); } });
      if (!W.companionCount()) rows.push({ icon: 'ic_moon', label: 'Nobody else is with you', sub: 'Bring a spirit friend along (below), or call one of your helpers.' });
      // ---- who can come
      LC.SPIRIT_ORDER.forEach(function (k) {
        if (k === S.companion || !LC.State.friend(k)) return;
        var s2 = LC.SPIRITS[k];
        rows.push({ icon: 'sp_' + k, iconScale: 1.4, label: 'Bring the ' + s2.name, right: 'Bring',
          sub: 'While it travels with you: ' + s2.perk + '.' + (S.companion && LC.SPIRITS[S.companion] ? ' (The ' + LC.SPIRITS[S.companion].name + ' goes home: one spirit at a time.)' : ''),
          action: function () { W.setCompanion(k); } });
      });
      var lost = LC.SPIRIT_ORDER.filter(function (k) { return !LC.State.friend(k); }).length;
      if (lost) rows.push({ icon: 'ic_glow', label: lost + ' more spirit' + (lost > 1 ? 's' : '') + ' to befriend', sub: 'Grant a spirit\'s wish and it becomes your friend: then it can travel with you too. (Pelita\'s spirit house lists them.)' });
      if (LC.hasBadang() && !LC.badangBuddy()) rows.push({ icon: 'ic_badang', label: 'Badang', sub: S.buddyDay === S.day ? 'He already went out with you today. Tomorrow!' : 'Ask him along in ' + LC.AREAS[LC.villagerArea('badang')].name + ' (once a day): he fights anything that threatens you, all day.' });
      if (LC.hasNek() && !(W.nek && !W.nek.leaving)) rows.push({ icon: 'ic_nek', label: 'Nek Lampir', right: 'Call',
        sub: (tap ? 'Tap her face beside the hotbar' : 'Press C') + ' to call her (only when you are alone). Pepper in a fight, her green circle, and a paid teleport.', action: function () { self.closeModal(); W.nekKey(); } });
      if (LC.hasBualang() && !(W.bual && !W.bual.leaving)) rows.push({ icon: 'ic_wau', label: 'Sang Bualang', right: 'Call',
        sub: (tap ? 'Tap the wau beside the hotbar' : 'Press B') + ' to call him on the wind (never under the sea). He spins enemies away, dizzy.', action: function () { self.closeModal(); W.bualangKey(); } });
      return rows;
    },

    statRows: function () {
      var S = this.S, W = this.world, lv = LC.State.level(), st = S.stats || {}, rows = [];
      rows.push({ icon: 'ic_hp', label: 'Health', right: Math.ceil(S.hp) + ' / ' + S.maxHp, sub: 'Grows with your strength (and a few great deeds). Food heals you; a night\'s sleep heals everything.' });
      rows.push({ icon: 'ic_energy', label: 'Energy', right: Math.floor(S.energy) + ' / ' + S.maxEnergy, sub: 'Farm work and foraging use it; eat (X) or sleep to get it back. Pelita\'s levels, the Kenyalang, a bigger house and more raise it.' });
      rows.push({ icon: 'ic_str', label: 'Strength', right: Math.floor(S.str || 0) + ' / ' + LC.STR_MAX, sub: 'Lift the batu angkat in Kampung Tepian, train silat with the Bunian (once a day each) and eat home-cooked dishes. It raises your health and your blows.' });
      var best = null;
      S.inv.forEach(function (sl) { var it = sl && LC.ITEMS[sl.id]; if (it && it.kind === 'weapon' && (!best || it.dmg > best.dmg)) best = it; });
      var strB = Math.floor((S.str || 0) / 25), temp = S.quests && S.quests.tempered ? 1 : 0;
      rows.push({ icon: best ? best.icon : 'i_tongkat', label: 'Attack', right: best ? String(best.dmg + strB + temp) : '-',
        sub: best ? 'Your best weapon: ' + best.name + ' (' + best.dmg + ')' + (strB ? ' + strength (' + strB + ')' : '') + (temp ? ' + tempered (1)' : '') + '. Hold it and press ' + (this.touchOn ? 'USE' : 'E') + ' to swing.'
          : 'No weapon in your bag yet. Pak Wan in Kampung Tepian sells a rattan staff.' });
      var why = [];
      if (S.companion === 'kenyalang' && LC.State.friend('kenyalang')) why.push('the Kenyalang +' + Math.round(LC.COMP.kenyalang * 100) + '%');
      if (S.escort) why.push('Si Tanggang +' + Math.round(LC.COMP.escort * 100) + '%');
      rows.push({ icon: 'ic_langkah', label: 'Walking speed', right: S.riding ? 'Riding' : Math.round((W.compSpeed ? W.compSpeed() : 1) * 100) + '%',
        sub: S.riding ? 'Riding is faster than walking. (Companions quicken your walk, not your ride.)' : why.length ? 'Faster thanks to ' + why.join(' and ') + '.' : 'Your normal pace. With the Kenyalang at your side you walk ' + Math.round(LC.COMP.kenyalang * 100) + '% faster.' });
      rows.push({ icon: 'ic_coin', label: 'Kepeng', right: String(S.kepeng), sub: 'Earned in all: ' + (st.earned || 0) + ' kepeng.' });
      var nb = LC.State.nextLevelBond();
      rows.push({ icon: 'ic_bond', label: 'Pelita, Level ' + lv, right: Math.floor(S.ghost.bond || 0) + ' bond', sub: nb ? 'Level ' + (lv + 1) + ' at ' + nb + ' bond. Journal > Levels lists every gift.' : 'Pelita has reached the highest level!' });
      var learned = LC.BAG_SORTS ? LC.BAG_SORTS.filter(function (g) { return lv >= g.lv; }).map(function (g) { return g.name; }) : [];
      rows.push({ icon: 'i_peti_kayu', label: 'Bag', right: S.inv.filter(Boolean).length + ' / ' + S.inv.length, sub: 'It grows as Pelita levels up (up to ' + LC.bagSize(LC.MAX_LEVEL) + ' slots). ' + (learned.length ? 'Pelita sorts it by ' + learned.join(', ') + '.' : 'From Lv ' + LC.BAG_SORT_LV + ', Pelita sorts it for you.') });
      rows.push({ icon: 'i_can', label: 'Gembor', right: S.water + ' / ' + S.maxWater, sub: 'Waterings in your can. Refill it at the well or the river.' });
      var ab = [];
      if (LC.hasStone()) ab.push('Sumpahan Batu (V)');
      if (LC.hasRestu()) ab.push('Restu Ibu');
      if (LC.hasLangkah && LC.hasLangkah()) ab.push('Langkah Semaun (Shift)');
      if (LC.hasNek()) ab.push('Nek Lampir (C)');
      if (LC.hasBualang()) ab.push('Sang Bualang (B), Angin Bualang (U)');
      if (LC.hasLagu && LC.hasLagu()) ab.push('Lagu Mayang (L)');
      rows.push({ icon: 'ic_batu', label: 'Abilities', right: String(ab.length), sub: ab.length ? ab.join(' · ') + '. Journal > You explains each one.' : 'None yet. The stories of the land will teach you some.' });
      var fr = LC.SPIRIT_ORDER.filter(function (k) { return LC.State.friend(k); });
      rows.push({ icon: 'ic_glow', label: 'Spirit friends', right: fr.length + ' / ' + LC.SPIRIT_ORDER.length, sub: fr.length ? fr.map(function (k) { return LC.SPIRITS[k].name + ': ' + LC.SPIRITS[k].blessing; }).join('. ') + '.' : 'Grant a spirit\'s wish to befriend it, and it blesses you.' });
      var places = Object.keys(S.visited || {}).filter(function (k) { return S.visited[k]; }).length;
      rows.push({ icon: 'ic_book', label: 'Records', right: 'Day ' + S.day, sub: (st.fish || 0) + ' fish caught · ' + (st.kills || 0) + ' creatures and shadows beaten · ' + (st.gold || 0) + ' ore dug · ' + places + ' places visited.' });
      return rows;
    }
  });

  // ---------------------------------------------------------------- hooks: say how to send a companion home
  var setCompanion = WP.setCompanion;
  WP.setCompanion = function (sid) {
    setCompanion.call(this, sid);
    var S = this.S, sp = LC.SPIRITS[sid];
    if (S.companion === sid && sp) this.time.delayedCall(1800, function () {
      if (LC.State.s && LC.State.s.companion === sid && this.ui) this.ui.toast('While the ' + sp.name + ' travels with you: ' + sp.perk + '. (Pause menu > Companions to send it home.)', 'ic_glow');
    }, null, this);
  };
  var startBuddy = WP.startBuddy;
  WP.startBuddy = function () {
    startBuddy.apply(this, arguments);
    var self = this;
    this.time.delayedCall(1800, function () { if (LC.badangBuddy() && self.ui) self.ui.toast('Pause menu > Companions to send him home.', 'ic_badang'); });
  };
})(window.LC);
