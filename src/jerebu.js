/* Chapter 15, Jerebu dan Bunga Api. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var C = LC.C15 = {
    end: 9, night: 20 * 60, groveNight: 19 * 60,
    ready: function (S) { return !!(S && LC.C14.step(S) >= LC.C14.end); },
    step: function (S) { return S && S.quests && S.quests.ch15 || 0; },
    launch: { x: 32.5, y: 3.5 },
    small: [
      { id: 'k_bengkel', name: 'Tukang Leong’s workshop' }, { id: 'k_pondok', name: 'Pak Mat’s hut' },
      { id: 'k_kedai', name: 'Abang Zul’s shop' }, { id: 'k_jerami15a', name: 'The western haystack' },
      { id: 'k_jerami15b', name: 'The eastern haystack' }
    ],
    big: { id: 'k_penghulu_house', name: 'Tok Penghulu’s house' },
    fuses: [{ x: 6, y: 6 }, { x: 8, y: 6 }, { x: 7, y: 5 }, { x: 7, y: 7 }],
    tracks: [[20, 8], [22, 9], [24, 10], [27, 10], [29, 9], [32, 8], [32, 6], [32, 4]],
    people: [
      { id: 'jusoh', name: 'Jusoh', tex: 'npc14_jusoh', x: 9, y: 25 },
      { id: 'bahar', name: 'Cikgu Bahar', tex: 'npc14_bahar', x: 17, y: 7 },
      { id: 'amin', name: 'Amin', tex: 'npc14_amin', x: 31, y: 8 },
      { id: 'mat', name: 'Pak Mat', tex: 'npc_mat', x: 25, y: 23 },
      { id: 'zul', name: 'Abang Zul', tex: 'npc_zul', x: 37, y: 16 }
    ],
    smallOut: function (S) {
      var fires = S.quests.c15fires || {};
      return C.small.filter(function (target) { return fires[target.id] === 0; }).length;
    },
    calmed: function (S) {
      var calm = S.quests.c15calm || {};
      return C.people.filter(function (person) { return calm[person.id]; }).length;
    },
    doused: function (S) {
      var fuses = S.quests.c15fuses || {};
      return C.fuses.filter(function (_, i) { return fuses[i]; }).length;
    }
  };
  LC.jerebuStrength = function (S, area) {
    var step = C.step(S);
    return step >= 1 && step < C.end && area && !area.cave && !area.underwater ? 1 : 0;
  };
  LC.cookBatch = function (S) { return ((S.house || 0) >= 2 ? 5 : 1) * (S.quests && S.quests.siBara ? 2 : 1); };
  LC.ITEMS.topeng_jerebu = { id: 'topeng_jerebu', icon: 'i_topeng_jerebu', name: 'Topeng Jerebu', kind: 'tool',
    desc: 'A face mask from Tok Penghulu. Carry it to lessen the haze around you.' };
  LC.SPEAKERS.sibara15 = { name: 'Si Bara', portrait: 'sibara15_0' };
  LC.SPEAKERS.penghulu15 = { name: 'Tok Penghulu', portrait: 'npc_penghulu_0' };
  LC.SPEAKERS.pelita15 = { name: 'Pelita', portrait: 'ghost', expr: 'happy' };

  function live(S) { return C.step(S) >= 1 && C.step(S) < C.end; }
  function crate(S) { return C.step(S) >= 2 && C.step(S) <= 6; }
  function grove(S) { return C.step(S) === 7; }
  LC.AREAS.kampung.objects.push(
    { id: 'k_jerami15a', type: 'bldg', x: 27, y: 7, tex: 'jerami15', keep: true, when: live, text: 'Dry straw, bundled for the animals.' },
    { id: 'k_jerami15b', type: 'bldg', x: 34, y: 7, tex: 'jerami15', keep: true, when: live, text: 'A stack of straw beside the plots.' },
    { id: 'k_peti15', type: 'jerebu_crate', x: 20, y: 7, tex: 'peti15', keep: true, when: crate },
    { id: 'k_bucket15', type: 'jerebu_bucket', x: 8, y: 9, tex: 'npc_penghulu_0', keep: true, when: function (S) { return C.step(S) === 4; } },
    { id: 'k_rain15', type: 'jerebu_rain', x: 16, y: 18, tex: 'npc_penghulu_0', keep: true, when: function (S) { return C.step(S) === 8; } }
  );
  LC.AREAS.senah.objects.push({ id: 'peti15', type: 'jerebu_crate', x: 7, y: 6, tex: 'peti15_open', keep: true, when: grove });
  C.fuses.forEach(function (fuse, i) {
    LC.AREAS.senah.objects.push({ id: 'sn_sumbu15_' + i, type: 'jerebu_fuse', i: i, x: fuse.x, y: fuse.y,
      tex: 'sumbu15_lit_0', keep: true, when: grove });
  });
  var dapur = LC.OBJECTS.find(function (o) { return o.type === 'dapur'; });
  LC.OBJECTS.push({ id: 'f_sibara15', type: 'sibara', x: dapur.x + (dapur.w || 1), y: dapur.y, tex: 'sibara15_0', keep: true,
    when: function (S) { return C.step(S) >= C.end; } });

  var sfx = LC.Audio.sfx;
  LC.Audio.sfx = function (name, strength) {
    if (name !== 'fire15' && name !== 'sizzle15' && name !== 'whoosh15') return sfx.apply(this, arguments);
    var A = LC.Audio, t;
    if (!A.ctx || A.ctx.state !== 'running' || !A.vol || !A.vol.sfx) return;
    t = A.ctx.currentTime + 0.01;
    if (name === 'fire15') {
      var volume = strength === undefined ? 0.05 : strength * 0.055;
      A.noise(t, 0.09, volume, 'highpass', 2200);
      A.noise(t + 0.11, 0.05, volume * 0.66, 'bandpass', 1150);
    } else if (name === 'sizzle15') A.noise(t, 0.36, 0.16, 'highpass', 3500, 650);
    else A.noise(t, 0.32, 0.12, 'bandpass', 500, 2300);
  };

  LC.JEREBU_TEXT = {
    orange: 'The sky has turned orange... See Tok Penghulu in Kampung Tepian.',
    maskFull: 'Your bag is full. Make room and ask Tok Penghulu for your mask.',
    mask: [
      ['penghulu15', 'Jerebu. Forests are burning far away in the dry season. Best stay indoors, and wear this mask if you must go out.'],
      ['senah14', 'I’m locking the leftover bunga api in the crate by the wakaf. These are for the next Pesta. Nobody touches them!'],
      ['pelita15', '(Pelita watches the orange sky without a sound.)']
    ],
    attack: [
      ['', 'A whistle in the haze. BANG! A little streak flies straight into a roof. The crate is wide open.'],
      ['jusoh14', 'THE GHOST IS BACK!'],
      ['imam14', 'No. Fire. Fetch water, all of you!']
    ],
    bucket: 'Every hand from the river to the house! Catch the bucket when it reaches you.',
    calm: {
      jusoh: 'I’m calm! I’m calm! Is the coconut tree on fire? No? Then I’m calm.',
      bahar: 'Fine particulate matter! PM2.5! Masks on, everyone!',
      amin: 'I didn’t touch the crate. Mak Long would hear me sneeze from the other end of the kampung.',
      mat: 'My hut is still standing? Alhamdulillah. I’ll help Tok Imam at the gelanggang.',
      zul: 'I nearly pedalled off without a bicycle. All right. I’m going to the gelanggang.'
    },
    trail: [
      ['imam14', 'Come to the gelanggang, everyone. Count heads, and let the roofs cool.'],
      ['pelita15', '(Pelita points to glowing footprints. They lead to the same banana grove.)']
    ],
    grove: [
      ['', 'A small ember laughs through the banana leaves. Then he strikes another fuse, smiling at the sky.'],
      ['pelita15', '(Pelita floats closer. Put out the four fuses while Pelita keeps him company.)']
    ],
    bara: [
      ['sibara15', 'My forest burned. I followed the smoke. The little fires in the sky looked like friends... everyone cheered. I wanted you to cheer again.'],
      ['pelita15', '(Pelita shines on the scorched roofs. Si Bara’s tears turn into little puffs of steam.)'],
      ['sibara15', 'I didn’t want anyone to lose their home too.']
    ],
    rain: [
      ['', 'The first monsoon rain washes the haze away. The last embers hiss out, and neighbours bring food to the gelanggang. Everyone is safe. Tomorrow they’ll mend the scorched roofs.'],
      ['senah14', 'Bunga api only with grown-ups, far from the roofs, and always with a bucket of water nearby!'],
      ['jusoh14', 'That was rain on my face. Obviously.'],
      ['sibara15', 'Can I stay somewhere fire is welcome?'],
      ['nenek', 'Of course. Come to my dapur, little one. We have plenty of cooking to do.']
    ],
    friend: ['Nenek says the sambal needs a little more heat. A little. I’m learning.', 'I like it here. There is always someone to say good morning to.',
      'Pelita and I can make twice as much at the dapur now. Who are we cooking for?']
  };
})(window.LC);
