/* UI, Chapter 20: Janji Buaya Putih (v3.22, Part 1): the goal line, the checklist entry and its parts, the one-time
 * "What's new" note, the jong's new voyage, and two panels at the top of the screen: Pelita's courage and Seri Putih's
 * strength on the night sea, and the fires left (and your bucket) on the Night of Fire. Mixed into LC.UIScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var C = LC.C20, U = LC.UIScene.prototype;
  function n(o) { return Object.keys(o || {}).length; }

  // ---------------------------------------------------------------- the goal line
  var goal = LC.ch5Goal;
  LC.ch5Goal = function () {
    var S = LC.State.s, W = LC.game && LC.game.scene.getScene('World');
    if (!S || !C.ready(S) || C.step(S) >= C.end) return goal.apply(this, arguments);
    var s = C.step(S), Q = S.quests, t = Q.c20task || {}, area = W && W.area, dark = C.isNight(S), fire = W && W.c20 && W.c20.fire;
    var left = [];
    if (s === 5) {
      if (!t.rakit) left.push('a floating cradle from Pak Lajak, the boat builder (craft quarter: 6 nibong, 3 belian)');
      if (!t.loceng) left.push('a bell from Dang Kemala, the brassmith (craft quarter: 400 kepeng)');
      if ((t.ikan || 0) < C.fishKA) left.push('feed her fish (' + (t.ikan || 0) + ' / ' + C.fishKA + ')');
    }
    var calmLeft = 4 - (Q.c20calm || 0);
    var text = [
      'Rest. Late on a night after Chapter 19 (after 9 PM), something happens to the river behind the farm.',
      !Q.c20morning ? 'Sleep. In the morning, see what happened to Nenek\'s cucumber vines.' : !Q.c20set ? 'Set Nenek\'s sticky scarecrow by her cucumber vines (beside the field).'
        : Q.c20stuck ? 'The thief is stuck to the scarecrow! Catch it (USE by the scarecrow).' : (S.minutes >= C.watchAt || S.minutes < 6 * 60) ? 'Hide in the straw pile by the spirit house, and keep still. Watch the scarecrow.' : 'After 8 PM, hide in the straw pile by the spirit house and watch the scarecrow.',
      'Follow Sang Kancil to the tall reeds on the east bank of the river.',
      (Q.c20fedF || 0) < C.fishFarm ? 'Feed Seri Putih in the river by the reeds: ' + (Q.c20fedF || 0) + ' / ' + C.fishFarm + ' fish (any fish).' : dark ? 'Sail to Kampong Ayer: board the Majapahit jong at the farm jetty (or ask Nenek).' : 'After 7 PM, board the Majapahit jong at the farm jetty and sail to Kampong Ayer.',
      area === 'laut20' ? 'Steer east to the mouth of the Brunei river. Keep Seri Putih inside Pelita\'s ring of light, and comfort Pelita (USE).'
        : calmLeft > 0 ? 'Calm Kampong Ayer: talk to the frightened neighbours on the walkways, and to Awang Semaun (' + (Q.c20calm || 0) + ' / 4).' : !Q.c20proof ? 'Talk to Pateh Berbai, on the walkway by the pier.' : 'Talk to Damang Sari, by the market landing at the west end.',
      left.length ? 'Help Seri Putih rest: ' + left.join('; ') + '.' : 'Seri Putih is resting.',
      fire && fire.started ? 'FIRE! Scoop water (USE facing the river), throw it on the flames, cut the marked planks, and row the boat taxi to the trapped family.' : 'Stay in Kampong Ayer tonight. After 9 PM...',
      !Q.c20sat ? 'Pelita is sitting alone at the end of the burnt walkway, west of the pier. Go to it.' : S.day > (Q.c20satDay || 0) ? 'Kampong Ayer is gathering to say goodbye.' : 'Sleep (the guest house on the hill). Tomorrow, the village says goodbye.'
    ][s];
    return 'Chapter 20: ' + text;
  };
  LC.CHAPTER_LIST.forEach(function (ch) { if (ch.n === 19) ch.next = 'Chapter 20, the last chapter, begins late on a night after Chapter 19: something happens to the river behind the farm.'; });
  LC.CHAPTER_LIST.push({ n: 20, key: 'ch20', end: C.end, name: 'Janji Buaya Putih',
    steps: ['The river turns black', 'The cucumber thief', 'Sang Kancil\'s secret', 'Seri Putih', 'Kampong Ayer is afraid', 'A cradle, a bell, a meal', 'The Night of Fire', 'Pelita, alone'],
    next: 'Part 1 complete! Seri Putih rests in Teluk Barunai until the monsoon wind turns. Part 2, the voyage to Sabah and the end of the story, is on the way.' });
  var checklist = LC.checklist;
  LC.checklist = function () {
    var L = checklist.apply(this, arguments);
    if (L.n !== 20) return L;
    var S = LC.State.s, Q = S.quests, s = C.step(S), t = Q.c20task || {}, cd = Q.c20calmed || {};
    function c(ok, x) { return { ok: !!ok, t: x }; }
    if (s === 1) L.items = [c(Q.c20morning, 'Nenek\'s vines'), c(Q.c20set, 'Set the sticky scarecrow'), c(Q.c20stuck, 'Hide and watch (after 8 PM)'), c(false, 'Catch the thief')];
    if (s === 3) L.items = [c((Q.c20fedF || 0) >= C.fishFarm, 'Feed Seri Putih (' + (Q.c20fedF || 0) + ' / ' + C.fishFarm + ')'), c(false, 'Sail by night to Kampong Ayer')];
    if (s === 4) L.items = [c(cd.esah, 'Mak Esah'), c(cd.jalil, 'Pak Jalil'), c(cd.tijah, 'Kak Tijah'), c(cd.semaun, 'Awang Semaun'), c(Q.c20proof, 'Pateh Berbai'), c(false, 'Damang Sari')];
    if (s === 5) L.items = [c(t.rakit, 'A floating cradle (Pak Lajak)'), c(t.loceng, 'A bell (Dang Kemala)'), c((t.ikan || 0) >= C.fishKA, 'Feed her (' + (t.ikan || 0) + ' / ' + C.fishKA + ')')];
    if (s === 7) L.items = [c(Q.c20sat, 'Sit with Pelita'), c(false, 'The send-off')];
    return L;
  };

  var prev = LC.NEWS, prior = null;
  try { prior = localStorage.getItem('littleCreature.newsSeen'); } catch (e) { /* storage blocked */ }
  LC.NEWS = {
    id: 'v3.22-ch20',
    lines: (prev && prior !== prev.id && prior !== 'v3.22-ch20' ? prev.lines : []).concat([
      { text: '✦ New: Chapter 20, Janji Buaya Putih (Part 1) ✦  The last chapter begins. After Chapter 19, late one night, the river behind the farm turns black, and something steals Nenek\'s cucumbers...' },
      { text: 'Sail through the night with a white crocodile beside you, keep her in Pelita\'s light, and win over Kampong Ayer. Part 2, the end of the story, comes in the next update.' }
    ])
  };

  // ---------------------------------------------------------------- the jong's new voyage
  var jongRows = LC.jongExtraRows;
  LC.jongExtraRows = function (where) {
    var rows = jongRows ? jongRows.apply(this, arguments) : [], ui = this, S = LC.State.s, W = ui.world;
    if (where !== 'farm' || C.step(S) !== 3) return rows;
    var fed = (S.quests.c20fedF || 0) >= C.fishFarm, dark = C.isNight(S);
    rows.unshift({ icon: 'ic_buaya20', label: 'Sail to Kampong Ayer with Seri Putih', right: 'Sail', sub: 'By night along the coast of Borneo, with a white crocodile for a sister ship.',
      enabled: fed && dark, why: !fed ? 'Feed Seri Putih first (' + (S.quests.c20fedF || 0) + ' / ' + C.fishFarm + ' fish).' : 'She swims only at night. Come back after 7 PM.',
      action: function () { ui.closeModal(); if (W) W.buayaSail(); } });
    return rows;
  };

  // ---------------------------------------------------------------- the panels at the top of the screen
  var update = U.update;
  U.update = function () {
    update.apply(this, arguments);
    if (!this.ready || !this.S) return;
    var W = this.world, c = W && W.c20, sea = c && c.sea && W.area === 'laut20' ? c.sea : null, fire = c && c.fire && c.fire.started && !c.fire.done && W.area === 'barunai' ? c.fire : null;
    var show = !!(sea || fire) && !this.modal && !W.leaving;
    if (!this.buayaG && !show) return;
    if (!this.buayaG) {
      this.buayaG = this.add.graphics();
      this.buayaT1 = this.txt(492, 62, '', 13, '#fbecc8', { ox: 0.5, stroke: 4 });
      this.buayaT2 = this.txt(492, 92, '', 13, '#fbecc8', { ox: 0.5, stroke: 4 });
      this.buayaI1 = this.add.image(392, 76, 'ic_glow').setScale(1.6);
      this.buayaI2 = this.add.image(392, 106, 'ic_buaya20').setScale(1.6);
      this.pin('tc', [this.buayaG, this.buayaT1, this.buayaT2, this.buayaI1, this.buayaI2]);
      this.layout();
    }
    [this.buayaG, this.buayaT1, this.buayaT2, this.buayaI1, this.buayaI2].forEach(function (o) { o.setVisible(show); });
    if (!show) return;
    var g = this.buayaG, pulse = 0.6 + 0.4 * Math.sin(this.time.now / 160);
    g.clear();
    g.fillStyle(0x1e1510, 0.82); g.fillRoundedRect(370, 56, 220, 66, 10);
    g.lineStyle(2, 0x8a6a4a, 1); g.strokeRoundedRect(370, 56, 220, 66, 10);
    if (sea) {
      var calm = sea.calm / 100, str = Math.max(0, sea.cr.str) / 100;
      g.fillStyle(0x3a2a20, 1); g.fillRoundedRect(408, 80, 168, 6, 3); g.fillRoundedRect(408, 110, 168, 6, 3);
      g.fillStyle(calm < 0.3 ? 0xff9a6a : 0xffd166, calm < 0.3 ? pulse : 1); g.fillRoundedRect(408, 80, Math.max(4, 168 * calm), 6, 3);
      g.fillStyle(str < 0.3 ? 0xff7a7a : 0xf4f2ec, str < 0.3 ? pulse : 1); g.fillRoundedRect(408, 110, Math.max(4, 168 * str), 6, 3);
      this.buayaT1.setText('Pelita\'s courage (USE: comfort)');
      this.buayaT2.setText('Seri Putih\'s strength');
      this.buayaI1.setTexture('ic_glow'); this.buayaI2.setTexture('ic_buaya20');
    } else {
      this.buayaT1.setText('Fires: ' + fire.n + (fire.family ? '' : '   Family: trapped!'));
      this.buayaT2.setText(fire.bucket ? 'Bucket: full of water' : 'Bucket: empty (USE at the river)');
      this.buayaI1.setTexture('api_0'); this.buayaI2.setTexture(fire.bucket ? 'timba20_penuh' : 'timba20');
      g.fillStyle(0xff7a3a, fire.n ? pulse * 0.25 : 0); g.fillRoundedRect(370, 56, 220, 66, 10);
    }
  };
})(window.LC);
