/* UI, part 10 (v2.2): Chapter 4, Layar Merah. Pak Mat's news, the preparations (Tukang Leong, Dang Kemala, Awang
 * Semaun, Badang), the Penghulu's orders, the Majapahit trading jong, the goal line and the Journal's Chapter 4 page.
 * Mixed into LC.UIScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  function q() { return LC.State.s.quests; }
  function tick(b) { return b ? '✓' : '·'; }
  function prepList() {
    var Q = q();
    return tick(Q.c4pagar) + ' the stockade (Tukang Leong)  ' + tick(Q.c4meriam) + ' cannons (Dang Kemala, Barunai)  ' + tick(Q.c4allies) + ' the brothers (Awang Semaun, Barunai)';
  }

  LC.ch4Goal = function () {
    var S = LC.State.s, Q = S.quests, st = Q.ch4 || 0, w = Q.c4wave || 0;
    switch (st) {
      case 0: return 'Chapter 3 is complete! Rest at Nenek\'s farm. (Something stirs out at sea...)';
      case 1: return 'Chapter 4: Pak Mat is shouting at the kampung jetty. Go and see what he has seen!';
      case 2: return 'Chapter 4: get ready: ' + prepList() + '.';
      case 3:
        if (!w) return 'Chapter 4: the fleet comes tonight. Be at the jetty in Kampung Tepian after 7 PM.';
        if (w === 2) return 'Chapter 4: ' + LC.C4.goals[2] + ' (' + Object.keys(Q.c4fires || {}).length + ' / ' + LC.C4.fires.length + ').';
        return 'Chapter 4: ' + LC.C4.goals[w] + (w === 1 ? ' in Kampung Tepian.' : w === 3 ? ' on Nenek\'s farm.' : '');
    }
    return null;
  };
  var goal3 = LC.ch3Goal;
  LC.ch3Goal = function () { return (LC.State.s.quests.ch3 || 0) >= 13 ? LC.ch4Goal() : goal3(); };

  Object.assign(LC.UIScene.prototype, {
    ch4Rows: function (vid, v, por) {
      var self = this, S = this.S, W = this.world, Q = q(), st = Q.ch4 || 0, rows = [], C = LC.CH4TEXT, C4 = LC.C4;
      function sayLines(arr, opts) { self.say(W.ch2Lines(arr), opts); }
      function ready() {
        if (!(Q.c4pagar && Q.c4meriam && Q.c4allies) || Q.ch4 !== 2) return;
        Q.ch4 = 3; LC.Audio.sfx('drum');
        self.time.delayedCall(400, function () { sayLines(C.ready); });
      }
      if (vid === 'mat' && st === 1) rows.push({ icon: 'ic_moon', label: 'Red sails!', right: 'Talk', sub: 'Pak Mat is pointing out to sea, very excited and very worried.', action: function () {
        sayLines(C.news, { onDone: function () { Q.ch4 = 2; LC.Audio.sfx('drum'); self.toast('Get ready with the Penghulu: the stockade, the cannons and the brothers of Barunai.', 'ic_str'); } });
        return 'close';
      } });
      if (vid === 'penghulu') {
        if (st === 2) rows.push({ icon: 'ic_str', label: 'Getting ready', sub: '"We will not bow, and we will not hand over our friends." ' + prepList() + '.' });
        if (st === 3) rows.push({ icon: 'ic_moon', label: Q.c4wave ? 'The attack!' : 'Tonight', sub: Q.c4wave ? LC.ch4Goal() : '"The fleet comes tonight. Be at the jetty after dark. The Orang Bunian are keeping the children safe."' });
        if (st >= 4) rows.push({ icon: 'ic_bond', label: 'Peace with Majapahit', sub: '"Their sailors thatch roofs better than ours! And their trading jong brings batik and celengan to Nenek\'s jetty."' });
        if (st >= 4 && Q.c4kerisOwed) rows.push({ icon: 'i_keris_majapahit', label: 'The Keris Majapahit', right: 'Take', sub: 'The king\'s gift, kept safe for you.', action: function () {
          if (!LC.State.add('keris_majapahit', 1)) { self.toast('Make room in your bag first!'); LC.Audio.sfx('error'); return; }
          delete Q.c4kerisOwed; LC.Audio.sfx('chime'); return 'close';
        } });
      }
      if (st === 2) {
        if (vid === 'leong' && !Q.c4pagar) rows.push(this.craftRow('i_kayu', 'Build a bamboo stockade', '"Sharp bamboo along the sand by the jetty, lashed with rattan. Bring me the materials and the men will build it today."', C4.stockade, 0, function () {
          Q.c4pagar = 1; LC.Audio.sfx('build'); self.toast('The bamboo stockade goes up along the sand by the kampung jetty.', 'i_kayu'); ready();
        }));
        if (vid === 'kemala' && !Q.c4meriam) rows.push(this.craftRow('i_lantaka', 'Cannons for Kampung Tepian', '"Brass cannons, cast tonight and sent by boat tomorrow. Bring stone for the moulds."', C4.cannons, C4.cannonKepeng, function () {
          Q.c4meriam = 1; LC.Audio.sfx('bell'); self.toast('Two brass meriam are on their way to Kampung Tepian.', 'i_lantaka'); ready();
        }));
        if (vid === 'semaun' && !Q.c4allies) rows.push({ icon: 'ic_bond', label: 'Will the brothers come?', right: 'Ask', sub: 'Majapahit is threatening your home across the sea.', action: function () {
          sayLines([{ who: 'semaun', text: 'Come? Friend, you found our brothers, you built our village, you freed our river. Of course we come! Jerambak and I will row over tonight.' }], { onDone: function () { Q.c4allies = 1; LC.Audio.sfx('chime'); ready(); } });
          return 'close';
        } });
        if (vid === 'badang' && (Q.badang || 0) >= 3 && !Q.c4badang) rows.push({ icon: 'ic_str', label: 'Fight with us, Badang', right: 'Ask', sub: 'The strongest man in the land lives right here in Kampung Tepian.', action: function () {
          sayLines([{ who: 'badangK', text: 'Take Pelita? Over my enormous body! I will stand at the jetty with Awang Semaun, kawan.' }], { onDone: function () { Q.c4badang = 1; LC.Audio.sfx('punch'); } });
          return 'close';
        } });
      }
      return rows;
    },

    // ================================================================ the Majapahit trading jong at Nenek's jetty
    openJong: function () {
      var S = this.S, C4 = LC.C4;
      this.openMenu({ title: 'The Majapahit trading jong', coins: true,
        footer: 'Sailors from Java, now friends of the kampung. They pay well for Bornean goods.',
        tabs: [
          { label: 'Buy', rows: function () {
            return C4.jongStock.filter(function (id) { return LC.ITEMS[id]; }).map(function (id) {
              var it = LC.ITEMS[id], price = it.price || Math.round((it.sell || 20) * 2), room = LC.State.canAdd(id);
              return { icon: it.icon, label: it.name, sub: it.desc, right: price + ' k', enabled: S.kepeng >= price && room, why: S.kepeng < price ? 'Not enough kepeng.' : 'Your bag is full!',
                action: function () { S.kepeng -= price; LC.State.add(id, 1); LC.Audio.sfx('buy'); } };
            });
          } },
          { label: 'Sell', empty: 'They are looking for Bornean goods: woven cloth, brass, belian, honey, nibong.', rows: function () {
            var seen = {}, rows = [];
            S.inv.forEach(function (sl) {
              if (!sl || seen[sl.id] || C4.jongBuys.indexOf(sl.id) < 0) return;
              seen[sl.id] = 1;
              var it = LC.ITEMS[sl.id], price = Math.round((it.sell || 10) * 1.3);
              rows.push({ icon: it.icon, label: it.name + '  x' + LC.State.count(sl.id), sub: it.desc, right: '+' + price + ' k',
                action: function () { LC.State.remove(sl.id, 1); S.kepeng += price; S.stats.earned += price; LC.Audio.sfx('coin'); } });
            });
            return rows;
          } }
        ] });
    },

    // ================================================================ the Journal: Chapter 4
    ch4ChapterRows: function () {
      var Q = q(), st = Q.ch4 || 0, rows = [];
      rows.push({ icon: 'i_keris_majapahit', label: 'Chapter 4: Layar Merah' + (st >= 4 ? '  (complete)' : ''), right: st >= 4 ? 'Done' : '', sub: LC.ch4Goal() || 'Red sails came for Pelita, and the kampung stood together. Now Majapahit comes to trade.' });
      [[1, 'Red sails at dawn', 'Pak Mat\'s news, and the envoy\'s message.'], [2, 'Getting ready', 'The stockade, the cannons, the brothers.'],
       [3, 'The night attack', 'The jetty, the fires, the spirit house, the admiral.']].forEach(function (s) {
        if (st < s[0]) return;
        var doneS = st > s[0];
        rows.push({ icon: doneS ? 'ic_bond' : 'ic_moon', label: (doneS ? '✓ ' : '') + s[1], right: doneS ? 'Done' : 'Now', sub: s[2] });
      });
      return rows;
    }
  });

  // ---------------------------------------------------------------- hooks
  var specialRows = LC.UIScene.prototype.specialRows;
  LC.UIScene.prototype.specialRows = function (vid, v, por) {
    var rows = specialRows.call(this, vid, v, por);
    return (this.S.quests.ch3 || 0) >= 13 ? rows.concat(this.ch4Rows(vid, v, por)) : rows;
  };
  var chapterRows = LC.UIScene.prototype.chapterRows;
  LC.UIScene.prototype.chapterRows = function () {
    var rows = chapterRows.call(this);
    return (this.S.quests.ch3 || 0) >= 13 && (this.S.quests.ch4 || 0) >= 1 ? rows.concat(this.ch4ChapterRows()) : rows;
  };
})(window.LC);
