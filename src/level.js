/* Your own level and experience (v3.12). Pelita had levels; now you do too. The user asked for a player level and
 * XP, a strength limit that grows with your level (it was always 100), monster levels, and magic from the School of
 * Sorcery (Chapter 13).
 *  - XP (S.quests.xp: quests already travel in a co-op guest's own bag): beating monsters (more for stronger ones,
 *    less for ones far below you), every chapter step, every fish, every point of strength and every level Pelita gains.
 *  - Each level: +4 to the strength limit (100 at Lv 1, 296 at Lv 50), +1 max health and +1 max energy.
 *  - A save from before v3.12 starts with the XP its adventures have already earned (monsters beaten, chapter steps,
 *    fish, strength and Pelita's level), so nobody starts again at Lv 1.
 *  - Monster levels: a table by kind (they follow the chapters), and a formula for any kind not in it.
 *  - Mantera Suria: suns of light that seek the nearest foes. Suraya teaches it once Chapter 13 is complete.
 *    Its damage grows with your level; two suns from Lv 15, three from Lv 30.
 * Used by WorldLevel.js and UILevel.js. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var PL = LC.PL = { max: 50, strStep: 4, storyXp: 30, fishXp: 4, strXp: 3, pelitaXp: 15 };
  PL.need = function (L) { return 20 * L + 2 * L * L; };   // XP from level L to L + 1
  var TOT = [0, 0];
  for (var L = 1; L < PL.max; L++) TOT[L + 1] = TOT[L] + PL.need(L);
  PL.total = function (L) { return TOT[Math.max(1, Math.min(PL.max, L))]; };   // the XP at which level L begins
  PL.levelFor = function (xp) { var n = 1; while (n < PL.max && xp >= TOT[n + 1]) n++; return n; };
  PL.strCap = function (L) { return 100 + PL.strStep * (Math.max(1, L) - 1); };
  PL.TITLES = [[50, 'Legenda'], [40, 'Panglima'], [30, 'Hulubalang'], [20, 'Pendekar'], [15, 'Pahlawan Muda'], [10, 'Perantau'], [5, 'Anak Muda'], [1, 'Budak Kampung']];
  PL.title = function (L) { for (var i = 0; i < PL.TITLES.length; i++) if (L >= PL.TITLES[i][0]) return PL.TITLES[i][1]; return PL.TITLES[PL.TITLES.length - 1][1]; };

  // every chapter step done so far (each one is worth XP)
  PL.storySteps = function (S) {
    var q = (S && S.quests) || {}, n = 0;
    (LC.CHAPTER_LIST || []).forEach(function (ch) { n += Math.max(0, Math.min(q[ch.key] || 0, ch.end || 0)); });
    return n;
  };
  function pelitaXp(lv) { var n = 0; for (var k = 2; k <= lv; k++) n += PL.pelitaXp * k; return n; }
  // a save from before v3.12: the XP its adventures already earned
  PL.startXp = function (S) {
    var st = S.stats || {}, lv = (S.ghost && S.ghost.level) || 1;
    return Math.round((st.kills || 0) * 8 + pelitaXp(lv) + PL.storySteps(S) * PL.storyXp + (st.fish || 0) * PL.fishXp + Math.max(0, (S.str || 10) - 10) * PL.strXp);
  };
  function seen(S) {   // what has already been counted (so only new steps, fish and levels give XP)
    var q = S.quests;
    if (!q.xpSeen || typeof q.xpSeen !== 'object') q.xpSeen = { story: PL.storySteps(S), fish: (S.stats && S.stats.fish) || 0 };
    return q.xpSeen;
  }
  LC.plXp = function (S) {
    S = S || (LC.State && LC.State.s);
    if (!S || !S.quests) return 0;
    if (typeof S.quests.xp !== 'number' || !isFinite(S.quests.xp)) { S.quests.xp = PL.startXp(S); seen(S); }
    return S.quests.xp;
  };
  LC.plLevel = function (S) { return PL.levelFor(LC.plXp(S)); };
  LC.xpSeen = function (S) { LC.plXp(S); return seen(S); };
  LC.gainXP = function (n) {
    var S = LC.State && LC.State.s;
    if (!S || !(n > 0)) return 0;
    var before = LC.plLevel(S);
    S.quests.xp = LC.plXp(S) + Math.round(n);
    var after = LC.plLevel(S);
    if (after !== before) LC.State.recalc();
    return after - before;
  };

  // the strength limit grows with your level (everything that reads LC.STR_MAX follows it)
  Object.defineProperty(LC, 'STR_MAX', { configurable: true, enumerable: true,
    get: function () { var S = LC.State && LC.State.s; return PL.strCap(S ? LC.plLevel(S) : 1); }, set: function () { } });

  var State = LC.State;
  var recalc = State.recalc;
  State.recalc = function () {
    var s = this.s, hp = s && s.hp, en = s && s.energy;
    recalc.apply(this, arguments);
    if (!s) return;
    var b = LC.plLevel(s) - 1;
    s.maxHp += b; s.maxEnergy += b;
    if (typeof hp === 'number') s.hp = Math.min(hp, s.maxHp);
    if (typeof en === 'number') s.energy = Math.min(en, s.maxEnergy);
  };
  var gainStr = State.gainStr;
  State.gainStr = function (n) {
    var d = gainStr.apply(this, arguments);
    if (d > 0) LC.gainXP(d * PL.strXp);
    return d;
  };

  // ---------------------------------------------------------------- monster levels
  LC.ENEMY_LV = {
    bayang: 1, kelawar: 2, babi: 3, ketam_batu: 4, lipan: 5, obor: 5, kala: 6, prajurit: 8, askar: 9, penunggu: 10,
    kelam: 10, camar: 11, ribut: 12, tinta8: 13, laskar8: 14, bilanapura: 14, hoplit8: 15, pencuri10: 16, laksamana: 16,
    sikelam: 18, maklampir: 20, ketua10: 20, raider12: 20, lampir6: 22, sang_kelembai: 22, bualang7: 24, golem13: 24,
    puaka_emas: 25, nagaibu8: 26, ketos8: 26, ratu8: 27, poseidon8: 28, bakunawa11: 30, kapten11: 31, captain12: 32,
    pendekar_jebat: 33, pendekar_hangtuah: 35, kraken12: 35, suraya13: 36, collector13: 38,
    bunian_sea_minion: 18, bunian_warrior_minion: 22, bunian_magic_minion: 26, bunian_spirit_minion: 30,
    bunian_sea_boss: 28, bunian_warrior_boss: 32, bunian_magic_boss: 36, bunian_spirit_boss: 40
  };
  LC.monsterLevel = function (kind, def) {
    if (LC.ENEMY_LV[kind]) return LC.ENEMY_LV[kind];
    def = def || LC.ENEMIES[kind] || {};
    var hp = Math.min(200, def.hp || 1), dmg = def.dmg || 1;
    return Math.max(1, Math.min(60, Math.round(Math.pow(hp, 0.62) * 0.9 + dmg * 0.6 - 3) + (def.boss ? 3 : 0)));
  };
  LC.killXp = function (kind, def) {
    def = def || LC.ENEMIES[kind] || {};
    var m = LC.monsterLevel(kind, def), xp = (3 + 2 * m) * (def.boss ? 4 : 1), d = m - LC.plLevel();
    if (d <= -10) xp *= 0.25; else if (d <= -5) xp *= 0.5;
    return Math.max(1, Math.round(xp));
  };
  // how a monster's level compares with yours: grey (far weaker) .. red (far stronger)
  LC.levelColor = function (m) {
    var d = m - LC.plLevel();
    return d <= -10 ? '#a8a8a8' : d <= -4 ? '#9be15d' : d <= 2 ? '#fbecc8' : d <= 6 ? '#ffb347' : '#ff6b6b';
  };

  // ---------------------------------------------------------------- Mantera Suria, magic from the School of Sorcery
  LC.SURIA = { cd: 3, speed: 240, range: 200, life: 1.4, turn: 9 };
  LC.hasSuria = function () { var S = LC.State && LC.State.s; return !!(S && S.quests && S.quests.suria); };
  LC.suriaDamage = function (L) { L = L || LC.plLevel(); return 3 + Math.floor(L / 4); };
  LC.suriaCount = function (L) { L = L || LC.plLevel(); return L >= 30 ? 3 : L >= 15 ? 2 : 1; };
  LC.SURIA_TEXT = {
    learn: [
      ['suraya13', 'Every student who saves this school graduates from it. Hold out your hand.'],
      ['', 'Suraya draws a small sun in the air. It settles in your palm, warm as a lamp.'],
      ['suraya13', 'Mantera Suria. Cast it and the sun finds the nearest foe by itself. It grows as you grow: the stronger you become, the more suns you cast.'],
      ['jack12', 'Do aim it away from my hat. It is the only thing I own outright.'],
      ['', '✦ You learned magic: Mantera Suria! ✦  Press K or tap the sun beside the hotbar. Two suns from Lv 15, three from Lv 30. My stats shows your magic.']
    ],
    again: [['suraya13', 'Practise the sun every day. Magic, like a garden, answers to the one who tends it.']]
  };
})(window.LC);
