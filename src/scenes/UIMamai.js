/* UI, Chapter 16: Kampung Mamai? (v3.16): the goal line, the chapter checklist entry, and the one-time "What's new"
 * note. Mixed into LC.UIScene. See mamai.js. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var C = LC.C16;
  var goal = LC.ch5Goal;
  LC.ch5Goal = function () {
    var S = LC.State.s;
    if (!S || !C.ready(S) || C.step(S) >= C.end) return goal.apply(this, arguments);
    var q = S.quests, s = C.step(S), w = LC.game && LC.game.scene.getScene('World'), area = w && w.area;
    var inv = C.count(S, 'c16inv'), help = q.c16help || {}, cook = C.count(S, 'c16cook'), clue = C.count(S, 'c16clue'), woke = C.count(S, 'c16woke');
    var t = [
      'Rest at the farm. Kampung Tepian is planning something.',
      'Tok Penghulu is waiting for you at the gelanggang in Kampung Tepian.',
      'Invite everyone to the majlis (' + inv + ' / ' + C.invites.length + '): Pak Mat\'s hut, Abang Zul\'s shop, Tukang Leong\'s workshop, Tok Imam at the masjid, and Kak Senah and Jusoh down the lane.',
      'The kitchen needs hands: ' + (help.amin ? '' : 'ask Amin at Kak Senah\'s house' + (help.bara ? '.' : ', and ')) + (help.bara ? '' : 'ask Si Bara at your dapur.') + (help.amin && help.bara ? 'Go back to your dapur.' : ''),
      'Cook the feast beside your dapur (' + cook + ' / 3): Nasi Minyak (padi), Ayam Masak Merah (cili) and Seri Muka.',
      S.minutes < C.majlis ? 'The majlis begins at the gelanggang in Kampung Tepian after 6 PM.' : 'The guests are here! Talk to Tok Penghulu at the gelanggang to begin the majlis.',
      'What a lovely majlis. Go home and rest.',
      'The kampung is sleepwalking! Find out why (' + clue + ' / 3 clues): ask Amin at the gelanggang, look around your dapur, and ask Si Bara.',
      'Show Nek Lampir (at your dapur) what you found.',
      'Bring Nek Lampir Madu Tualang and 2 Herba (Hutan Rimba) and a Pandan, and brew Jamu Bangun on Si Bara\'s fire.',
      'Give Jamu Bangun to the sleepwalkers in Kampung Tepian (' + woke + ' / ' + C.sleepers.length + '). Pelita\'s light holds them still.'
    ][s];
    void area;
    return 'Chapter 16: ' + t;
  };

  LC.CHAPTER_LIST.forEach(function (ch) { if (ch.n === 15) ch.next = 'Chapter 16 begins the day after: Kampung Tepian wants to give thanks.'; });
  LC.CHAPTER_LIST.push({ n: 16, key: 'ch16', end: C.end, name: 'Kampung Mamai?',
    steps: ['Rest at the farm', 'Tok Penghulu\'s request', 'Invite the kampung', 'Hands for the kitchen', 'Cook the feast', 'Majlis doa kesyukuran',
      'Rest after the majlis', 'The sleepwalking kampung', 'Nek Lampir\'s jar', 'Brew Jamu Bangun', 'Wake everyone'],
    next: 'Visit Nek Lampir\'s lantern on quiet nights. More chapters are on the way.' });

  var prev = LC.NEWS, prior = null;
  try { prior = localStorage.getItem('littleCreature.newsSeen'); } catch (e) { /* storage blocked */ }
  LC.NEWS = {
    id: 'v3.16-ch16',
    lines: (prev && prior !== prev.id && prior !== 'v3.16-ch16' ? prev.lines : []).concat([
      { text: '✦ New: Chapter 16, Kampung Mamai? ✦  After Chapter 15, the kampung holds a majlis doa kesyukuran, and you are the host. Invite everyone, find hands for the kitchen... and meet an old friend.' },
      { text: 'But the morning after, the kampung is sleepwalking! Weapons won\'t help: find out why, and find the cure.' }
    ])
  };
})(window.LC);
