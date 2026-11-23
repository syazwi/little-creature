/* World, Chapter 16: Kampung Mamai? (v3.16). See mamai.js. Story steps are saved the moment they happen, before any
 * dialogue; scenes that follow a dialogue run from the update loop once it has closed. The sleepwalkers are actors (not
 * enemies): weapons only bonk them, Pelita's light holds them still, Lagu Mayang sits them down, and the sun spell
 * makes them sneeze. Only Jamu Bangun wakes them. Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var W = LC.WorldScene.prototype, C = LC.C16, X = LC.MAMAI_TEXT, T = 16;
  var INVITE = {}, NAME = {};
  C.invites.forEach(function (v) { INVITE[v.obj] = v.who; NAME[v.who] = v.name; });
  function step(w) { return C.step(w.S); }
  function story(w, n) { w.S.quests.ch16 = n; LC.State.save(); }
  function flags(w, k) { var q = w.S.quests; return q[k] || (q[k] = {}); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  var create = W.createKampong, update = W.updateKampong;
  W.createKampong = function () { create.apply(this, arguments); LC.mamaiRecipe(this.S); this.createMamai(); };
  W.updateKampong = function (time, dt) { update.apply(this, arguments); this.updateMamai(time, dt); };

  var objectAction = W.objectAction;
  W.objectAction = function (o) {
    var self = this, s = step(this);
    if (!o) return objectAction.apply(this, arguments);
    // step 2: an invitation for everyone
    var who = INVITE[o.id];
    if (s === 2 && who && !flags(this, 'c16inv')[who])
      return { label: who === 'imam' ? 'Invite Tok Imam to lead the doa' : 'Give ' + NAME[who] + ' an invitation', fn: function () { self.mamaiInvite(who); } };
    // step 3: hands for the kitchen
    if (s === 3 && o.id === 'sn_amin2' && !flags(this, 'c16help').amin) return { label: 'Ask Amin to help in the kitchen', fn: function () { self.mamaiHire('amin'); } };
    if (o.type === 'sibara') {
      if (s === 3 && !flags(this, 'c16help').bara) return { label: 'Ask Si Bara to keep the kitchen fire', fn: function () { self.mamaiHire('bara'); } };
      if (s === 7 && !flags(this, 'c16clue').bara) return { label: 'Ask Si Bara what he saw', fn: function () { self.mamaiClue('bara'); } };
    }
    switch (o.type) {
      case 'mamai_tokp': return { label: s === 1 ? 'Talk to Tok Penghulu' : 'Begin the majlis', fn: function () {
        if (s === 1) { story(self, 2); self.mamaiLines(X.request); return; }
        if (self.S.minutes < C.majlis) { self.mamaiLines(X.early); return; }
        self.S.quests.c16feast = self.S.day; story(self, 6);
        LC.Audio.sfx('chime');
        if (self.ghost) self.fx.sparkle.explode(16, self.ghost.x, self.ghost.y - 6);
        self.mamaiLines(X.majlis);
      } };
      case 'mamai_pot': {
        var P = C.pots[o.pot], done = !!flags(this, 'c16cook')[o.pot];
        return { label: done ? P.name + ' (ready)' : 'Cook the ' + P.name + ' (' + this.mamaiNeed(P.need) + ')', fn: function () { if (!done) self.mamaiCook(o.pot); else self.toast(P.name + ' is ready, and smells wonderful.', 'periuk16_' + o.pot); } };
      }
      case 'mamai_lampir': return { label: s === 8 ? 'Show Nek Lampir the jar' : s === 9 ? 'Brew Jamu Bangun (' + this.mamaiNeed(C.jamu) + ')' : 'Talk to Nek Lampir', fn: function () {
        if (s === 8) { story(self, 9); self.mamaiLines(X.confess); return; }
        if (s === 9) { self.mamaiBrew(); return; }
        self.mamaiLines([['lampirspirit16', X.lampir[s] || X.lampir[7]]]);
      } };
      case 'mamai_jar': return { label: s === 7 && !flags(this, 'c16clue').jar ? 'Look at the little jar' : 'The empty jar', fn: function () {
        if (s === 7 && !flags(self, 'c16clue').jar) self.mamaiClue('jar'); else self.mamaiLines(X.jarAfter);
      } };
      case 'mamai_amin': return { label: 'Talk to Amin', fn: function () {
        if (s === 7 && !flags(self, 'c16clue').amin) self.mamaiClue('amin'); else self.mamaiLines(X.aminAfter);
      } };
      case 'mamai_imam': return { label: 'Talk to Tok Imam', fn: function () { self.mamaiLines(X.imam); } };
      case 'mamai_lantern': return { label: 'Nek Lampir\'s lantern', fn: function () { self.mamaiLines(X.lantern); } };
      default: return objectAction.apply(this, arguments);
    }
  };

  // the sleepwalkers come first when you face one
  var getAction = W.getAction;
  W.getAction = function () {
    var s = this.mamaiNear(), self = this;
    if (s) {
      if (step(this) === 10 && (this.S.quests.c16jamu || 0) > 0) return { label: 'Give ' + s.name + ' the Jamu Bangun', fn: function () { self.mamaiWake(s); } };
      return { label: 'Shake ' + s.name, fn: function () { self.mamaiShake(s); } };
    }
    return getAction.apply(this, arguments);
  };
  // a weapon only bonks them; the sun spell makes them sneeze; Lagu Mayang sits them down
  var attack = W.attack;
  W.attack = function () {
    var cd = this.swingCd, r = attack.apply(this, arguments);
    if (this.swingCd !== cd) this.mamaiAround(30, true, function (s, self) { self.ui.floatText(s.spr.x, s.spr.y - 24, 'Boing!', '#ffe8a0'); self.tweens.add({ targets: s.spr, angle: 360, duration: 380, onComplete: function () { s.spr.angle = 0; } }); });
    return r;
  };
  var castSuria = W.castSuria;
  if (castSuria) W.castSuria = function () {
    var at = LC.suriaAt, r = castSuria.apply(this, arguments);
    if (LC.suriaAt !== at) this.mamaiAround(LC.SURIA.range, false, function (s, self) { self.ui.floatText(s.spr.x, s.spr.y - 24, 'Hachoo!', '#fff2b0'); self.tweens.add({ targets: s.spr, y: s.spr.y - 5, duration: 90, yoyo: true }); });
    return r;
  };
  var laguKey = W.laguKey;
  if (laguKey) W.laguKey = function () {
    var at = LC.laguAt, r = laguKey.apply(this, arguments);
    if (LC.laguAt !== at) this.mamaiAround(LC.C9 && LC.C9.lagu ? LC.C9.lagu.r : 110, false, function (s, self) { s.hold = 6; self.ui.floatText(s.spr.x, s.spr.y - 24, 'Zzz...', '#bfeee0'); });
    return r;
  };
  // the Senduk Lampir: home cooking warms you half as much again
  var eat = W.eat;
  W.eat = function () {
    var S = this.S, sl = LC.State.selItem(), it = sl && LC.ITEMS[sl.id], before = S.energy, r = eat.apply(this, arguments);
    if (it && it.kind === 'dish' && S.energy > before && C.step(S) >= C.end) {
      var extra = Math.min(S.maxEnergy - S.energy, Math.round((S.energy - before) * 0.5));
      if (extra > 0) { S.energy += extra; this.ui.floatText(this.player.x, this.player.y - 30, '+' + extra + ' (Senduk Lampir)', '#ffe8a0'); }
    }
    return r;
  };

  Object.assign(W, {
    mamaiLines: function (lines) { this.ui.say(lines.map(function (l) { return Object.assign({ text: l[1] }, LC.SPEAKERS[l[0]] || {}); })); },
    mamaiNeed: function (need) { return Object.keys(need).map(function (id) { return LC.ITEMS[id].name + ' x' + need[id]; }).join(', '); },
    createMamai: function () {
      this.mamai = { sleepers: [], decor: null, decorT: 0, styled: null, spirit: null, finalePending: false, born: this.time.now };
      var s = step(this);
      if (this.area === 'kampung' && s >= 7 && s <= 10) this.mamaiSpawnSleepers();
    },

    // ---------------------------------------------------------------- invitations, the kitchen, the cooking
    mamaiInvite: function (who) {
      var inv = flags(this, 'c16inv');
      inv[who] = true;
      var n = Object.keys(inv).length;
      if (n >= C.invites.length) story(this, 3); else LC.State.save();
      LC.Audio.sfx('chime');
      this.mamaiLines(X.invite[who].concat([['', n >= C.invites.length ? X.invited : '(Invitations given: ' + n + ' / ' + C.invites.length + '.)']]));
    },
    mamaiHire: function (who) {
      flags(this, 'c16help')[who] = true;
      LC.State.save();
      LC.Audio.sfx('chime');
      this.mamaiLines(X.hire[who]);
    },
    mamaiArrive: function () {
      story(this, 4);
      this.refreshWhen();
      var d = LC.OBJECTS.filter(function (o) { return o.id === 'f_lampir16'; })[0], x = (d.x + 0.5) * T, y = (d.y + 1) * T;
      this.cameras.main.flash(500, 190, 225, 255);
      this.fx.sparkle.explode(22, x, y - 12);
      LC.Audio.sfx('whoosh15');
      this.mamaiLines(X.arrive);
    },
    mamaiCook: function (key) {
      var P = C.pots[key];
      if (!LC.State.has(P.need)) { LC.Audio.sfx('error'); this.toast('You need ' + this.mamaiNeed(P.need) + '. ' + P.where, 'periuk16_kosong'); return; }
      LC.State.takeAll(P.need);
      var cook = flags(this, 'c16cook');
      cook[key] = true;
      var all = Object.keys(C.pots).every(function (k) { return cook[k]; });
      if (all) story(this, 5); else LC.State.save();
      LC.Audio.sfx('cook');
      this.refreshWhen();
      var im = this.objImgs['f_periuk16_' + key + '1'];
      if (im) { this.fx.smoke.explode(6, im.x, im.y - 12); if (key === 'ayam') { var self = this; this.time.delayedCall(400, function () { self.fx.sparkle.explode(10, im.x, im.y - 10); }); } }
      this.mamaiLines(X.pot[key].concat(all ? [['', X.cooked]] : []));
    },
    mamaiClue: function (what) {
      var clue = flags(this, 'c16clue');
      clue[what] = true;
      var all = clue.amin && clue.jar && clue.bara;
      if (all) story(this, 8); else LC.State.save();
      this.mamaiLines(X.clue[what].concat([['', all ? X.clued : '(Clues: ' + Object.keys(clue).length + ' / 3.)']]));
    },
    mamaiBrew: function () {
      if (!LC.State.has(C.jamu)) {
        LC.Audio.sfx('error');
        this.mamaiLines([['lampirspirit16', 'I need ' + this.mamaiNeed(C.jamu) + '. The honey and the herbs grow in Hutan Rimba, and pandan in your field.']]);
        return;
      }
      LC.State.takeAll(C.jamu);
      this.S.quests.c16jamu = C.sleepers.length;
      story(this, 10);
      LC.Audio.sfx('cook');
      var b = this.objImgs.f_sibara15;
      if (b) { this.fx.sparkle.explode(18, b.x, b.y - 10); this.shockwave(b.x, b.y - 8, 20, 0xffa040); }
      this.mamaiLines(X.brewed.concat([['', X.give]]));
    },

    // ---------------------------------------------------------------- the sleepwalkers
    mamaiSpawnSleepers: function () {
      var self = this, woke = flags(this, 'c16woke'), m = this.mamai;
      C.sleepers.forEach(function (d, i) {
        if (woke[d.who]) return;
        var x = (d.x + 0.5) * T, y = (d.y + 1) * T;
        var spr = self.add.sprite(x, y, d.tex).setOrigin(0.5, 1).setTint(0x9fc79a).setDepth(y);
        var zz = self.add.image(x + 6, y - 26, 'zz').setDepth(9400).setAlpha(0.9).setScale(1.5);
        var arms = self.add.image(x + 6, y - 11, 'lengan16').setOrigin(0, 0.5).setTint(0xb8d0b0).setDepth(y + 0.1);   // arms out, zombie-style
        m.sleepers.push({ who: d.who, name: d.name, spr: spr, zz: zz, arms: arms, vx: 0, vy: 0, t: Math.random(), hold: 0, touchT: 0, mumbleT: 1 + Math.random() * 4, ph: i * 1.3, wake: false });
      });
    },
    mamaiNear: function () {
      var m = this.mamai;
      if (!m || !m.sleepers.length || !this.player) return null;
      var f = this.facing(), p = this.player, best = null, bd = 1e9;
      m.sleepers.forEach(function (s) {
        if (s.wake) return;
        var cx = s.spr.x, cy = s.spr.y - 9, d = Math.hypot(f.fx - cx, f.fy - cy), dp = Math.hypot(p.x - cx, p.y - 6 - cy);
        if ((d < 22 || dp < 16) && d < bd) { bd = d; best = s; }
      });
      return best;
    },
    mamaiAround: function (r, front, fn) {
      var m = this.mamai, p = this.player, self = this;
      if (!m || !p) return;
      m.sleepers.forEach(function (s) { if (!s.wake && Math.hypot(s.spr.x - p.x, s.spr.y - p.y) <= r) fn(s, self); });
      void front;
    },
    mamaiShake: function (s) {
      this.tweens.add({ targets: s.spr, x: s.spr.x + 3, duration: 60, yoyo: true, repeat: 3 });
      this.ui.floatText(s.spr.x, s.spr.y - 26, pick(X.shake), '#d8e8d0');
      if (!this.mamai.hinted) { this.mamai.hinted = true; this.toast(X.shakeHint, 'zz'); }
    },
    mamaiWake: function (s) {
      var q = this.S.quests, woke = flags(this, 'c16woke');
      woke[s.who] = true;
      q.c16jamu = Math.max(0, (q.c16jamu || 0) - 1);
      LC.State.save();
      s.wake = true; s.hold = 0;
      s.spr.clearTint(); s.zz.destroy(); s.arms.destroy();
      this.fx.sparkle.explode(14, s.spr.x, s.spr.y - 10);
      LC.Audio.sfx('chime');
      this.mamaiLines(X.woke[s.who]);
    },
    mamaiUpdateSleepers: function (time, dt, blocked) {
      var self = this, m = this.mamai, p = this.player, g = this.ghost, S = this.S, jamu = step(this) === 10 && (S.quests.c16jamu || 0) > 0;
      m.sleepers.forEach(function (s) {
        var spr = s.spr;
        if (!spr.active) return;
        if (s.wake) {   // awake: walk to the gelanggang and stand with the others
          var gx = C.gelanggang.x * T + (s.ph % 3 - 1) * 14, gy = C.gelanggang.y * T - (s.ph % 2) * 10, dx = gx - spr.x, dy = gy - spr.y, dd = Math.hypot(dx, dy);
          if (dd > 2) { spr.x += dx / dd * 45 * dt; spr.y += dy / dd * 45 * dt; spr.setFlipX(dx < 0); }
          spr.setDepth(spr.y);
          return;
        }
        var held = s.hold > 0 || (g && g.visible && Math.hypot(g.x - spr.x, g.y - (spr.y - 10)) < 30);   // Pelita's light holds them still
        if (s.hold > 0) s.hold -= dt;
        if (!blocked && !held) {
          var d = Math.hypot(p.x - spr.x, p.y - spr.y), speed;
          if (d < (jamu ? 150 : 100) && d > 9) { speed = jamu ? 26 : 18; s.vx = (p.x - spr.x) / d * speed; s.vy = (p.y - spr.y) / d * speed; }
          else if ((s.t -= dt) <= 0) { s.t = 0.8 + Math.random() * 1.4; var a = Math.random() * Math.PI * 2; s.vx = Math.cos(a) * 12; s.vy = Math.sin(a) * 12; }
          var nx = spr.x + s.vx * dt, ny = spr.y + s.vy * dt, tx = Math.floor(nx / T), ty = Math.floor((ny - 2) / T);
          if (tx > 0 && ty > 0 && tx < self.W - 1 && ty < self.H - 1 && !self.solid[ty][tx]) { spr.x = nx; spr.y = ny; if (Math.abs(s.vx) > 1) spr.setFlipX(s.vx < 0); }
          else s.t = 0;
          // too close: a sleepy hug drains a little energy (never health)
          if (d < 10 && (s.touchT -= dt) <= 0) {
            s.touchT = 2;
            S.energy = Math.max(0, S.energy - 2);
            self.ui.floatText(p.x, p.y - 28, '*yawn*', '#d8e8d0');
            var px = p.x + (p.x - spr.x) / (d || 1) * 8, py = p.y + (p.y - spr.y) / (d || 1) * 8, ptx = Math.floor(px / T), pty = Math.floor((py - 3) / T);
            if (ptx > 0 && pty > 0 && ptx < self.W && pty < self.H && !self.solid[pty][ptx]) { p.x = px; p.y = py; }
          }
          if ((s.mumbleT -= dt) <= 0) { s.mumbleT = 4 + Math.random() * 4; self.ui.floatText(spr.x, spr.y - 26, pick(X.mumble[s.who]), '#d8e8d0'); }
        }
        spr.rotation = held ? 0 : Math.sin(time / 320 + s.ph) * 0.07;
        spr.setDepth(spr.y);
        s.zz.setPosition(spr.x + 6, spr.y - 26 + Math.sin(time / 400 + s.ph) * 2).setAlpha(held ? 1 : 0.75);
        var left = spr.flipX, bob = Math.sin(time / 260 + s.ph) * 1;
        s.arms.setFlipX(left).setOrigin(left ? 1 : 0, 0.5).setPosition(spr.x + (left ? -3 : 3), spr.y - 11 + bob).setDepth(spr.y + 0.1);
      });
    },

    // ---------------------------------------------------------------- the majlis at the gelanggang
    mamaiDecor: function (want) {
      var m = this.mamai, self = this;
      if (!want) { if (m.decor) { m.decor.forEach(function (o) { o.destroy(); }); m.decor = null; } return; }
      if (m.decor) return;
      var list = m.decor = [];
      function img(tex, tx, ty, opts) {
        var o = self.add.image(tx * T, ty * T, tex).setOrigin(0.5, 1).setDepth(ty * T);
        if (opts && opts.flip) o.setFlipX(true);
        if (opts && opts.spirit) list.push(self.mamaiSpirit(o));
        list.push(o);
        return o;
      }
      // in front of the gelanggang: two mats of guests with their dulang, the hosts and helpers standing behind
      img('tikar16', 15, 23.3); img('tikar16', 20, 23.3);
      img('npc14_jusoh_0', 13.9, 23); img('npc14_bahar_0', 16.1, 23, { flip: true });
      img('npc_mat_0', 18.9, 23); img('npc_zul_0', 21.1, 23, { flip: true });
      img('dulang16', 15, 23.7); img('dulang16', 20, 23.7);
      img('npc14_senah_0', 13.8, 21.9); img('npc14_imam_0', 18, 21.9); img('npc14_amin_0', 19.8, 21.9);
      img('npc_leong_0', 22.4, 22.2, { flip: true }); img('npc_lampir_0', 23.8, 21.8, { spirit: true });
    },
    // a spirit: pale, see-through, softly glowing and bobbing (returns the glow, which the caller must tidy away)
    mamaiSpirit: function (o) {
      o.setAlpha(0.82).setTint(0xdff0ff);
      var glow = this.add.image(o.x, o.y - 10, 'glow').setBlendMode(Phaser.BlendModes.ADD).setTint(0x9fd0ff).setAlpha(0.55).setScale(0.55, 0.75).setDepth(o.depth - 0.5);
      this.tweens.add({ targets: [o, glow], y: '-=3', duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      return glow;
    },

    updateMamai: function (time, dt) {
      var m = this.mamai, S = this.S, q = S.quests, s = step(this);
      if (!m) return;
      var blocked = this.ui.isBlocking() || this.leaving || this.sleeping;
      // the chapter begins the day after Chapter 15 ends
      if (s === 0 && C.ready(S) && !blocked) {
        if (q.c16wait === undefined) { q.c16wait = S.day; LC.State.save(); }
        else if (S.day > q.c16wait) { story(this, 1); this.toast(X.start, 'npc_penghulu_0'); }
      }
      // Nek Lampir's spirit: pale, blue and bobbing
      var lam = this.objImgs && this.objImgs.f_lampir16;
      if (lam && lam.active && m.styled !== lam) { m.styled = lam; if (m.lamGlow) m.lamGlow.destroy(); m.lamGlow = this.mamaiSpirit(lam); }
      if (m.lamGlow && (!lam || !lam.active)) { m.lamGlow.destroy(); m.lamGlow = null; m.styled = null; }
      if (this.area === 'kampung' && (m.decorT -= dt) <= 0) { m.decorT = 0.5; this.mamaiDecor((s === 5 && S.minutes >= C.majlis) || (s === 6 && S.day === q.c16feast)); }
      if (m.sleepers.length) this.mamaiUpdateSleepers(time, dt, blocked);
      if (blocked) return;
      var help = q.c16help || {};
      if (s === 3 && help.amin && help.bara && this.area === 'farm' && time - m.born > 800) { this.mamaiArrive(); return; }
      if (s === 6 && S.day > (q.c16feast || 0)) {
        story(this, 7);
        this.toast(X.morning, 'zz');
        this.refreshWhen();
        if (this.area === 'kampung' && !m.sleepers.length) this.mamaiSpawnSleepers();
        return;
      }
      if (s === 10 && this.area === 'kampung' && C.count(S, 'c16woke') >= C.sleepers.length) { this.mamaiFinale(); return; }
      if (m.finalePending) {   // after the last words, her spirit goes back to her lantern
        m.finalePending = false;
        var sp = m.spirit, self = this;
        var gl = m.spiritGlow;
        if (sp) this.tweens.add({ targets: gl ? [sp, gl] : sp, alpha: 0, y: '-=20', duration: 1400, onComplete: function () { sp.destroy(); if (gl) gl.destroy(); } });
        this.time.delayedCall(600, function () { if (self.area === 'kampung') self.fx.sparkle.explode(16, self.player.x, self.player.y - 30); });
        this.refreshWhen();
      }
    },
    mamaiFinale: function () {
      var S = this.S, p = this.player, got = LC.State.add('senduk_lampir', 1);
      story(this, C.end);   // (the rewards first, so closing the story early never loses them)
      S.kepeng += 1000;
      LC.mamaiRecipe(S);
      LC.State.save();
      if (!got) this.toast('Your bag is full. Nek Lampir\'s blessing is with you anyway; make room and her senduk will be at Nenek\'s porch.', 'i_senduk_lampir');
      var sp = this.mamai.spirit = this.add.image(p.x + 22, p.y - 2, 'npc_lampir_0').setOrigin(0.5, 1).setDepth(p.y);
      var glow = this.mamaiSpirit(sp);
      sp.setAlpha(0); glow.setAlpha(0);
      this.tweens.add({ targets: sp, alpha: 0.82, duration: 700 });
      this.tweens.add({ targets: glow, alpha: 0.55, duration: 700 });
      this.mamai.spiritGlow = glow;
      this.cameras.main.flash(500, 220, 240, 255);
      LC.Audio.sfx('cheer');
      this.mamai.finalePending = true;
      this.mamaiLines(X.finale);
    }
  });
})(window.LC);
