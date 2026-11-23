/* World, Chapter 14: Hantu Kak Senah? (v3.13). See senah.js for the story and the steps. Story steps are saved the
 * moment they happen (before any dialogue), and every scene waits for dialogue to close in the update loop, so closing
 * a conversation early never loses progress. Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var W = LC.WorldScene.prototype, C = LC.C14, X = LC.SENAH_TEXT, T = 16;
  var NAMES = { jusoh: 'Jusoh', bahar: 'Cikgu Bahar', amin: 'Amin', imam: 'Tok Imam', senah: 'Kak Senah' };
  function step(w) { return C.step(w.S); }
  function story(w, n) { w.S.quests.ch14 = n; LC.State.save(); }
  function night(w) { return w.S.minutes >= C.night; }
  function px(t) { return { x: (t.x + 0.5) * T, y: (t.y + 1) * T }; }   // a tile's bottom centre, where a person stands

  var create = W.createKampong, update = W.updateKampong;
  W.createKampong = function () { create.apply(this, arguments); LC.senahRecipe(this.S); this.createSenah(); };
  W.updateKampong = function (time, dt) { update.apply(this, arguments); this.updateSenah(time, dt); };

  var objectAction = W.objectAction;
  W.objectAction = function (o) {
    var self = this, s = step(this), q = this.S.quests;
    switch (o.type) {
      case 'senah_way': return { label: 'Walk down the lane to Kak Senah\'s house', fn: function () { self.goArea('senah', self.tilePx(C.spawn), 'up'); } };
      case 'senah_back': return { label: 'Back to Kampung Tepian', fn: function () { self.goArea('kampung', self.tilePx({ x: 32, y: 4 }), 'down'); } };
      case 'senah_folk': return { label: 'Talk to ' + NAMES[o.who], fn: function () { self.senahFolk(o); } };
      case 'senah_house': return { label: s === 1 && night(this) ? 'Peek through the window' : 'Kak Senah\'s house', fn: function () {
        if (s === 1 && night(self)) self.senahPeek();
        else self.senahLines(s === 1 ? X.day : X.house);
      } };
      case 'senah_line': return { label: s === 2 && !q.c14sheet ? 'Look at the clothesline' : 'The clothesline', fn: function () {
        if (s === 2 && !q.c14sheet) { q.c14sheet = true; LC.State.save(); self.senahFlap(); self.senahLines(X.sheet); }
        else self.senahLines(X.sheetAfter);
      } };
      case 'senah_sangkar': return { label: s === 2 && !q.c14tiong ? 'Look at the birdcage' : 'Si Tiong', fn: function () {
        self.senahLaugh(o.x, o.y - 1);
        if (s === 2 && !q.c14tiong) { q.c14tiong = true; LC.State.save(); self.senahLines(X.tiong); }
        else self.senahLines(X.tiongAfter);
      } };
      case 'senah_dapur': return { label: s === 2 && !q.c14amin ? 'Check the kitchen' : 'The outdoor kitchen', fn: function () {
        if (s === 2 && !q.c14amin && night(self)) { q.c14amin = true; LC.State.save(); self.senahCatchAmin(); return; }
        self.senahLines(s === 2 && !q.c14amin ? X.dapurDay.concat([['', '(Someone has been cooking here at night. Come back after dark.)']]) : X.dapurDay);
      } };
      case 'senah_penunggu': return { label: s === 3 ? 'Greet the shy spirit' : 'The Penunggu Rumah', fn: function () {
        if (s === 3) { q.c14day = self.S.day; story(self, 4); self.refreshWhen(); LC.Audio.sfx('chime'); self.senahLines(X.penunggu); }
        else self.senahLines(s === 4 ? X.penungguWait : X.penungguAfter);
      } };
      case 'senah_hide': return { label: 'Find ' + NAMES[o.who], fn: function () { self.senahFound(o.who); } };
      case 'senah_kak': return { label: s >= C.end ? 'Talk to Kak Senah' : s === 6 ? 'Raise Pelita\'s light' : 'Talk to Kak Senah', fn: function () {
        if (s === 6) { self.senahFinale(); return; }
        if (s >= C.end) { self.senahLaugh(o.x, o.y - 1); self.senahLines([['senah14', X.after.senah14]]); return; }
        var n = Object.keys(q.c14found || {}).length;
        self.senahLines(X.kakCross.concat([['', '(Runaways found: ' + n + ' / 3.)']]));
      } };
      default: return objectAction.apply(this, arguments);
    }
  };

  // the sun spell is not for aunties
  var castSuria = W.castSuria;
  if (castSuria) W.castSuria = function () {
    var before = LC.suriaAt;
    castSuria.apply(this, arguments);
    var s = step(this);
    if (this.area !== 'senah' || LC.suriaAt === before || s < 5 || s >= C.end) return;
    var k = this.objImgs && this.objImgs.sn_kak_mask;
    if (k) this.ui.floatText(k.x, k.y - 24, 'Eh!', '#ffe8a0');
    this.toast(X.fireworks, 'ic_suria');
  };

  Object.assign(W, {
    senahLines: function (lines) {
      this.ui.say(lines.map(function (l) { return Object.assign({ text: l[1] }, LC.SPEAKERS[l[0]] || {}); }));
    },
    createSenah: function () {
      this.senah = null;
      if (this.area !== 'senah') return;
      this.senah = { t: 0, anim: 0, laughIn: 6 + Math.random() * 8, cine: null, born: this.time.now };
    },
    senahLaugh: function (tx, ty) {
      LC.Audio.sfx('laugh14');
      this.ui.floatText((tx + 0.5) * T, (ty || 0) * T, 'HAHAHAHA!', '#fff2c0');
    },
    senahFolk: function (o) {
      var s = step(this), who = o.who, key = who + '14';
      if (s === 0 && o.id.slice(-1) === '0') {
        if (!night(this)) { this.senahLines([[key, 'Not now, the sun is still up. Come back tonight after 7 PM. We will all be here at the pondok... in a group.']]); return; }
        story(this, 1);
        this.senahLaugh(15, 7);
        var self = this;
        ['sn_jusoh0', 'sn_bahar0', 'sn_imam0'].forEach(function (id, i) {
          var im = self.objImgs[id]; if (im && id !== 'sn_imam0') self.tweens.add({ targets: im, scaleY: 0.72, duration: 120, yoyo: true, hold: 900, delay: i * 60 });
        });
        this.senahLines(X.night1);
        return;
      }
      if (s <= 1) { this.senahLines([[key, X.folk0[key] || '...']]); return; }
      if (s >= C.end) { this.senahLines([[key, X.after[key] || '...']]); return; }
      if (who === 'amin') { this.senahLines([['amin14', s >= 5 ? 'Mak Long is so cross... but I think she is mostly tired.' : 'Please don\'t tell Mak Long about the stove! She\'s home tomorrow night.']]); return; }
      this.senahLines([[key, who === 'jusoh' ? 'Is she still there? Don\'t point at her!' : 'Hm. A ghost with a suitcase. Most unscientific.']]);
    },
    senahPeek: function () {
      story(this, 2);
      var house = this.objImgs.sn_rumah, self = this;
      if (house) {   // a white shape drifts past the left window
        var x0 = house.x - 36, y0 = house.y - 38, ghost = this.add.image(x0, y0, 'senah_sheet').setDepth(house.depth + 1).setAlpha(0);
        this.tweens.add({ targets: ghost, x: x0 + 14, alpha: 0.85, duration: 900, yoyo: true, onComplete: function () { ghost.destroy(); } });
      }
      this.time.delayedCall(500, function () { self.senahLaugh(15, 7); });
      var p = this.ghost;
      if (p) this.ui.floatText(p.x, p.y - 20, '?', '#e8dcff');
      this.senahLines(X.peek);
    },
    senahFlap: function () {
      var im = this.objImgs.sn_line;
      if (im) this.tweens.add({ targets: im, scaleX: 1.12, scaleY: 1.06, duration: 160, yoyo: true, repeat: 2 });
    },
    senahCatchAmin: function () {
      var d = this.objImgs.sn_dapur, self = this;
      if (d) {
        var a = this.add.sprite(d.x + 4, d.y - 2, 'npc14_amin_0').setOrigin(0.5, 1).setDepth(d.depth + 2);
        this.fx.smoke.explode(8, d.x, d.y - 10);
        this.tweens.add({ targets: a, y: a.y - 14, duration: 180, yoyo: true, onComplete: function () {
          self.tweens.add({ targets: a, alpha: 0, duration: 300, delay: 600, onComplete: function () { a.destroy(); self.refreshWhen(); } });
        } });
      } else this.refreshWhen();
      this.senahLines(X.amin);
    },
    senahRattle: function () {
      var d = this.objImgs.sn_dapur, g = this.ghost, self = this;
      story(this, 3);
      [0, 260, 520].forEach(function (t) { self.time.delayedCall(t, function () { LC.Audio.sfx('clang14'); }); });
      if (d) { this.tweens.add({ targets: d, x: d.x + 2, duration: 50, yoyo: true, repeat: 7 }); this.ui.floatText(d.x, d.y - 40, 'CLANG! CLATTER!', '#ffd0a0'); }
      if (g) { this.fx.sparkle.explode(18, g.x, g.y - 6); this.shockwave(g.x, g.y - 6, 22, 0xfff2b0); }
      this.cameras.main.shake(200, 0.002);
      this.toast(X.rattle, 'senah_penunggu_0');
      this.refreshWhen();
    },
    senahFound: function (who) {
      var q = this.S.quests;
      if (step(this) !== 5) return;
      q.c14found = q.c14found || {};
      q.c14found[who] = true;
      var n = Object.keys(q.c14found).length;
      if (n >= 3) story(this, 6); else LC.State.save();
      this.fx.smoke.explode(6, this.player.x, this.player.y - 10);
      this.refreshWhen();
      this.senahLines(X.found[who].concat([['', n >= 3 ? 'Everyone is back in the yard. Now show them who Kak Senah really is: talk to her.' : '(Runaways found: ' + n + ' / 3.)']]));
    },
    senahFinale: function () {
      var S = this.S, k = this.objImgs.sn_kak_mask, g = this.ghost, got = 0;
      story(this, C.end);   // (the rewards first, so closing the story early never loses them)
      for (var i = 0; i < 5; i++) if (LC.State.add('seri_muka', 1)) got++;
      S.kepeng += 800;
      LC.State.recalc();
      LC.senahRecipe(S);
      LC.State.save();
      if (got < 5) this.toast('Your bag was full: you took ' + got + ' Seri Muka. Kak Senah will make more.', 'i_seri_muka');
      if (g) { this.fx.sparkle.explode(26, g.x, g.y - 10); this.shockwave(g.x, g.y - 10, 40, 0xfff2b0); }
      this.cameras.main.flash(600, 255, 240, 200);
      if (k) {   // an honest shadow stretches across the yard
        var sh = this.add.image(k.x + 14, k.y - 1, 'glow').setTint(0x000000).setOrigin(0.15, 0.5).setScale(0.2, 0.18).setAlpha(0).setDepth(k.depth - 1);
        this.tweens.add({ targets: sh, alpha: 0.6, scaleX: 1.1, duration: 1100, ease: 'Sine.easeOut' });
        this.senah.shadow = sh;
      }
      LC.Audio.sfx('cheer');
      this.senah.finale = true;
      this.senahLines(X.finale);
    },

    // ---------------------------------------------------------------- the last night: the mob, and Kak Senah comes home
    senahNight3: function () {
      var q = this.S.quests, self = this, c = this.senah.cine = { phase: 0, actors: {} };
      this.refreshWhen();   // (still step 4: Amin leaves the kitchen; the hiding places appear only after the scene)
      q.c14found = {};
      story(this, 5);
      var g = px(C.gate);
      function actor(key, dx, to, delay) {
        var a = self.add.sprite(g.x + dx, g.y - 8, key + '_w1').setOrigin(0.5, 1).setDepth(g.y);
        a.play(key + '_walk');
        self.tweens.add({ targets: a, x: to.x, y: to.y, duration: 2200, delay: delay || 0, onUpdate: function () { a.setDepth(a.y); },
          onComplete: function () { a.play(key + '_idle'); } });
        return a;
      }
      c.actors.jusoh = actor('npc14_jusoh', -8, { x: 17.5 * T, y: 15 * T });
      c.actors.bahar = actor('npc14_bahar', 0, { x: 14.5 * T, y: 15.5 * T }, 200);
      c.actors.amin = actor('npc14_amin', 8, { x: 19.5 * T, y: 16 * T }, 400);
      this.time.addEvent({ delay: 360, repeat: 6, callback: function () { LC.Audio.sfx('clang14'); var j = c.actors.jusoh; if (j && j.active) self.ui.floatText(j.x, j.y - 22, 'CLANG!', '#ffd0a0'); } });
      this.time.delayedCall(2700, function () { if (self.senah && self.senah.cine === c) { c.phase = 1; self.senahLines(X.mob); } });
    },
    senahCine: function () {
      var c = this.senah.cine, self = this, blocked = this.ui.isBlocking();
      if (!c || blocked) return;
      if (c.phase === 1) {   // Kak Senah walks out of the dark with her suitcase
        c.phase = 2;
        var g = px(C.gate), k = c.actors.kak = this.add.sprite(g.x, g.y - 8, 'npc14_senah_mask_w1').setOrigin(0.5, 1).setDepth(g.y);
        k.play('npc14_senah_mask_walk');
        this.tweens.add({ targets: k, x: 16.5 * T, y: 13.6 * T, duration: 2000, onUpdate: function () { k.setDepth(k.y); }, onComplete: function () {
          k.play('npc14_senah_mask_idle');
          LC.Audio.sfx('scream14');
          self.cameras.main.shake(260, 0.004);
          c.phase = 3;
          self.senahLines(X.arrive);
        } });
      } else if (c.phase === 3) {   // everyone runs
        c.phase = 4;
        var spots = { jusoh: px(C.palm), bahar: px({ x: C.reban.x + 1, y: C.reban.y + 1 }), amin: px(C.pisang) }, left = 4;
        function done() { if (--left > 0) return; Object.keys(c.actors).forEach(function (k2) { c.actors[k2].destroy(); }); self.senah.cine = null; self.refreshWhen(); self.toast(X.hidden, 'ic_glow'); }
        ['jusoh', 'bahar', 'amin'].forEach(function (who) {
          var a = c.actors[who], to = spots[who];
          a.setFlipX(to.x < a.x); a.play('npc14_' + who + '_walk'); a.anims.timeScale = 2.2;
          self.fx.smoke.explode(4, a.x, a.y - 4);
          self.tweens.add({ targets: a, x: to.x, y: to.y, alpha: 0.2, duration: 900, ease: 'Quad.easeIn', onComplete: done });
        });
        var k = c.actors.kak, kp = px(C.kak);
        k.play('npc14_senah_mask_walk');
        this.tweens.add({ targets: k, x: kp.x, y: kp.y, duration: 900, onComplete: done });
      }
    },

    updateSenah: function (time, dt) {
      var sn = this.senah, S = this.S, q = S.quests, s = step(this);
      if (!sn) return;
      var blocked = this.ui.isBlocking() || this.leaving || this.sleeping;
      if ((sn.anim += dt) > 0.45) {   // the sheet flaps, Si Tiong hops, the Penunggu bobs
        sn.anim = 0; sn.f = 1 - (sn.f || 0);
        var im = this.objImgs;
        if (im.sn_line) im.sn_line.setTexture('senah_line_' + sn.f);
        if (im.sn_sangkar) im.sn_sangkar.setTexture('senah_sangkar_' + sn.f);
        if (im.sn_penunggu) im.sn_penunggu.setTexture('senah_penunggu_' + sn.f);
      }
      if (sn.cine) { this.senahCine(); return; }
      if (blocked) return;
      // the house laughs in the night (until you find out why)
      if (s <= 2 && night(this) && (sn.laughIn -= dt) <= 0) { sn.laughIn = 18 + Math.random() * 14; this.senahLaugh(15, 7); }
      if (s === 2 && q.c14sheet && q.c14tiong && q.c14amin) { this.senahRattle(); return; }
      if (s === 4 && S.day > (q.c14day || 0) && S.minutes >= C.late && time - sn.born > 1200) { this.senahNight3(); return; }
      if (sn.finale) {   // after the last words: the house looks itself again... and one more laugh from the banana grove
        sn.finale = false;
        if (sn.shadow) { sn.shadow.destroy(); sn.shadow = null; }
        this.refreshWhen();
        var self = this;
        this.time.delayedCall(900, function () { if (self.area === 'senah') self.senahLaugh(C.pisang.x, C.pisang.y - 2); });
      }
    }
  });
})(window.LC);
