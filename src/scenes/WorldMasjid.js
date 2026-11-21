/* World, part 20 (v2.7.4): the masjid in Kampung Tepian and the five daily prayers (data in masjid.js). At each prayer
 * time the beduk sounds and a reminder appears (Pause > Prayer times turns them off); at the masjid you pray with the
 * jemaah. Also tells a player whose car left the game that Abang Zul bought it back. Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var proto = LC.WorldScene.prototype, A = LC.Audio, M = LC.MASJID, X = LC.MASJID_TEXT;
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  // the beduk: a big, deep drum, struck slowly and then faster (softer when heard from far away)
  var sfx = A.sfx;
  A.sfx = function (name) {
    if (name !== 'beduk' && name !== 'beduk_far') return sfx.apply(this, arguments);
    if (!A.ctx || A.ctx.state !== 'running') return;
    var t = A.ctx.currentTime + 0.01, v = name === 'beduk' ? 1 : 0.35;
    [0, 0.75, 1.4, 1.9, 2.3, 2.62, 2.9].forEach(function (d, k) {
      A.tone(t + d, 'sine', 96 - k * 2, 44, 1.1, 0.5 * v);
      A.tone(t + d, 'triangle', 190, 70, 0.25, 0.08 * v);
      A.noise(t + d, 0.1, 0.1 * v, 'lowpass', 380);
    });
  };

  // a day after all five prayers, a share of every energy cost is spared (kept whole: every 4th point is free)
  var useEnergy = proto.useEnergy;
  proto.useEnergy = function (n) {
    var q = this.S.quests.solat;
    if (q && q.berkat === this.S.day && n > 0 && this.S.energy >= n) {
      q.spare = (q.spare || 0) + n * M.berkat;
      var free = Math.min(n, Math.floor(q.spare));
      q.spare -= free; n -= free;
      if (n <= 0) return true;
    }
    return useEnergy.call(this, n);
  };

  // v2.8.3, Maghrib (Dilindungi): until you wake the next day, every hit does half damage
  var playerHurt = proto.playerHurt;
  proto.playerHurt = function (dmg, e) {
    var q = this.S.quests.solat;
    if (q && q.lindung === this.S.day && dmg > 0) dmg = Math.max(1, Math.ceil(dmg * M.lindung));
    return playerHurt.call(this, dmg, e);
  };

  var updateKampong = proto.updateKampong;
  proto.updateKampong = function (time, dt) {
    updateKampong.apply(this, arguments);
    this.solatTick(dt);
  };

  Object.assign(proto, {
    // once a second: the car refund note, the blessed-day note, and the beduk at the start of each prayer time
    solatTick: function (dt) {
      var S = this.S;
      if ((this.solatT = (this.solatT || 0) - dt) > 0) return;
      this.solatT = 1;
      if (!this.ui || this.sleeping || this.leaving || this.cutscene || this.ui.isBlocking()) return;
      if (this.solatBless()) return;
      if (S.flags.carBack) { this.toast(X.carBack(S.flags.carBack), 'i_basikal'); delete S.flags.carBack; return; }
      if (!LC.State.isOpen('kampung')) return;
      var q = LC.solatQ();
      if (q.berkat === S.day && q.berkatTold !== S.day) { q.berkatTold = S.day; this.toast(X.berkat, 'ic_masjid'); return; }
      var p = LC.solatNow(S.minutes);
      if (!p || S.flags.noSolat || q.done[p.id] || q.told === S.day + p.id) return;
      if (LC.horror9 && LC.horror9(this.area)) return;   // (not in Chapter 9's haunted fog)
      q.told = S.day + p.id;
      LC.Audio.sfx(this.area === 'kampung' ? 'beduk' : 'beduk_far');
      this.toast(X.time(p), 'ic_masjid');
    },

    // v2.8.3: Asar (Sihat) brings health back slowly until midnight; Subuh (Rezeki pagi) adds a share of everything
    // earned today (S.stats.earned, which every sale and reward adds to, and which starts again at 0 each morning)
    solatBless: function () {
      var S = this.S, q = S.quests.solat;
      if (!q) return false;
      if (q.sihat === S.day && S.hp > 0 && S.hp < S.maxHp && (this.sihatT = (this.sihatT || 0) + 1) >= M.sihatEvery) { this.sihatT = 0; S.hp = Math.min(S.maxHp, S.hp + 1); }
      var e = S.stats.earned || 0;
      if (q.rezeki === S.day) {
        if (!(q.seen <= e)) q.seen = e;   // (a new day, or an old save)
        q.pend = (q.pend || 0) + (e - q.seen) * M.rezeki; q.seen = e;
      }
      if ((q.pend || 0) >= 1) {
        var n = Math.floor(q.pend); q.pend -= n;
        S.kepeng += n; S.stats.earned = e + n; if (q.rezeki === S.day) q.seen = e + n;
        LC.Audio.sfx('coin'); this.toast(X.rezeki(n), 'ic_masjid');
        return true;
      }
      return false;
    },

    masjidAction: function (o) {
      var self = this, S = this.S, now = LC.solatNow(S.minutes), q = LC.solatQ();
      if (now && !q.done[now.id]) return { label: 'Solat ' + now.name + ' berjemaah', fn: function () { self.solatBerjemaah(now); } };
      return { label: 'Masjid', fn: function () {
        var nx = LC.solatNext(S.minutes);
        self.ui.say([{ text: now ? X.already(now) : pick(X.quiet) }, { text: X.next(nx, S.minutes) + '  (Today: ' + LC.solatCount() + ' of 5.)' }]);
      } };
    },

    solatBerjemaah: function (p) {
      var self = this, S = this.S, q = LC.solatQ(), jum = p.id === 'zohor' && LC.State.weekday() === 'Jumaat';
      // the reward comes first, so a dialogue closed early never loses it
      q.done[p.id] = 1; q.total = (q.total || 0) + 1;
      var full = LC.solatCount() === LC.SOLAT.length;
      if (full) { q.full = (q.full || 0) + 1; q.berkat = S.day + 1; }
      var e0 = S.energy;
      S.energy = Math.min(S.maxEnergy, S.energy + Math.round(S.maxEnergy * M.energy));
      S.hp = S.maxHp;
      if (p.id === 'subuh') { q.rezeki = S.day; q.seen = S.stats.earned || 0; }
      else if (p.id === 'zohor') S.energy = S.maxEnergy;
      else if (p.id === 'asar') q.sihat = S.day;
      else if (p.id === 'maghrib') q.lindung = S.day;
      else if (p.id === 'isyak') q.isyak = S.day;
      var gift = jum && LC.State.add(M.jumaatGift, 1);
      if (!LC.Net.active()) S.minutes = Math.min(LC.DAY_END - 10, S.minutes + (jum ? M.jumaatMinutes : M.minutes));
      var lines = [{ text: X.wuduk }];
      if (jum) lines.push({ text: X.jumaat });
      lines.push({ text: X.pray(p, jum) }, { text: X.pelita });
      if (gift) lines.push({ text: X.jamuan });
      lines.push({ text: p.feel + ' ' + X.calm + (full ? ' ' + X.full : '') });
      var cam = this.cameras.main, ended = false, gain = Math.round(S.energy - e0);
      this.cutscene = true;
      function end() {
        if (ended) return;
        ended = true; self.cutscene = false;
        cam.fadeIn(700, 14, 12, 22);
        self.toast('Solat ' + (jum ? 'Jumaat' : p.name) + ' berjemaah: ' + (gain > 0 ? 'energy +' + gain + ', ' : '') + 'health full.', 'ic_masjid');
        self.toast(p.gift + ': ' + p.does + '.', 'ic_masjid');
      }
      cam.fadeOut(450, 14, 12, 22);
      this.time.delayedCall(500, function () {
        self.ui.say(lines, { onDone: end });
        var watch = self.time.addEvent({ delay: 300, loop: true, callback: function () { if (!self.ui.isBlocking()) { watch.remove(); end(); } } });
      });
    }
  });
})(window.LC);
