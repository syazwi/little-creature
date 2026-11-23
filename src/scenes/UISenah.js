/* UI, Chapter 14: Hantu Kak Senah? (v3.13): the goal line, the chapter checklist entry, and the one-time
 * "What's new" note. Mixed into LC.UIScene. See senah.js. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var C = LC.C14;
  var goal = LC.ch5Goal;
  LC.ch5Goal = function () {
    var S = LC.State.s;
    if (!S || !C.ready(S) || C.step(S) >= C.end) return goal.apply(this, arguments);
    var q = S.quests, s = C.step(S), w = LC.game && LC.game.scene.getScene('World'), here = w && w.area === 'senah', dark = S.minutes >= C.night;
    var lane = 'the lane at the top of Kampung Tepian, between the two vegetable plots';
    var clues = (q.c14sheet ? 1 : 0) + (q.c14tiong ? 1 : 0) + (q.c14amin ? 1 : 0), found = Object.keys(q.c14found || {}).length;
    var t = [
      here ? (dark ? 'Talk to the frightened villagers at the pondok.' : 'Come back tonight after 7 PM: the villagers will gather at the pondok.')
        : 'Something laughs in the dark at Kak Senah\'s house. Go tonight after 7 PM: ' + lane + '.' + (LC.hasSuria && !LC.hasSuria() ? ' (Suraya at Sekolah Mantera can also teach you magic.)' : ''),
      'Peek through Kak Senah\'s window' + (dark ? '.' : ' tonight after 7 PM.') + (here ? '' : ' (' + lane + ')'),
      'Look for clues around Kak Senah\'s house (' + clues + ' / 3): the clothesline, the birdcage and the kitchen' + (!q.c14amin && !dark ? ' (the kitchen after 7 PM)' : '') + '.',
      'Pelita is glowing! Look under Kak Senah\'s house.',
      S.day <= (q.c14day || 0) ? 'Kak Senah comes home tomorrow night. Be at her house after 10 PM.' : S.minutes < C.late ? 'Kak Senah comes home tonight. Be at her house after 10 PM.' : 'Hurry to Kak Senah\'s house: her bus is here!',
      'Round up the runaways (' + found + ' / 3): Jusoh, Cikgu Bahar and Amin are hiding around the yard.',
      'Everyone is back. Talk to Kak Senah, and let Pelita\'s light show the truth.'
    ][s];
    return 'Chapter 14: ' + t;
  };

  // the chapter checklist (Journal > Chapters, and the pause menu's chapter progress)
  LC.CHAPTER_LIST.forEach(function (ch) { if (ch.n === 13) ch.next = 'Chapter 14 begins at night: take the lane at the top of Kampung Tepian, between the two vegetable plots, to Kak Senah\'s house.'; });
  LC.CHAPTER_LIST.push({ n: 14, key: 'ch14', end: C.end, name: 'Hantu Kak Senah?',
    steps: ['Whispers at the pondok', 'The laughing house', 'Three clues', 'The rattling pots', 'Midnight homecoming', 'Round up the runaways', 'An honest shadow'],
    next: 'Visit Kak Senah for seri muka. More chapters are on the way.' });

  // what's new, once (with the level and magic note too, for anyone who missed it)
  var prev = LC.NEWS, prior = null;
  try { prior = localStorage.getItem('littleCreature.newsSeen'); } catch (e) { /* storage blocked */ }
  LC.NEWS = {
    id: 'v3.13-ch14',
    lines: (prev && prior !== prev.id && prior !== 'v3.13-ch14' ? prev.lines : []).concat([
      { text: '✦ New: Chapter 14, Hantu Kak Senah? ✦  After Chapter 13, Kampung Tepian whispers that Kak Senah\'s house laughs in the night. Is she a ghost? Pelita doesn\'t think so...' },
      { text: 'Go after 7 PM: take the lane at the top of Kampung Tepian, between the two vegetable plots. Find the clues, meet a shy spirit, round up the runaways, and win Kak Senah\'s famous seri muka.' }
    ])
  };
})(window.LC);
