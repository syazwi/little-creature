/* World, Chapter 20, step 15 (v3.36): the two shadows at the nest bank (docs/chapter20-two-shadows.md).
 * After the ride through the six stolen lights, Sang Kancil sets a lantern on a dry ledge. At the lantern: Save Game
 * (the usual slots; you come back to the lantern after) or Begin Fight. A save made on the bank (or the game saving
 * itself) reopens at the lantern, before the fight: the fight itself is never saved.
 *  - Round 1, "Hold them off": Black Pelita (the great shadow, risen at the shore) and Bayang Diri (your reflection,
 *    with your best weapon: WorldBunianMirror.js's art, swing and Pantul) fight you together for about 20 seconds of
 *    play: a dark ring and a Pantul warning come early, so you see both. Neither can fall below 60%. Then (sooner if
 *    your health runs out) Black Pelita closes a dark ring around you, Bayang Diri lands the killing blow, and the
 *    lantern goes out.
 *  - Pelita Putih: in the dark, the scrape of a bowl; a white flame slips out of a crack in Black Pelita's heart and
 *    settles on your chest; you stand, and its light becomes Harimau Cahaya, a tiger of light, for this fight only
 *    (the lasting Pelita Putih and the T skill still come with the dawn, step 17).
 *  - Round 2, the rematch: both bosses with health bars. The tiger fights beside you; it tears a gap in each dark ring
 *    for you to run through; while Bayang Diri's mirror shimmers (Pantul: your spells come back at you), your blow or
 *    the tiger's pounce breaks it and opens it up (double damage for a moment). Lose, and you can retry the rematch.
 *  - Win: Bayang Diri sinks back into your reflection, the tiger bows beside Black Pelita, its heart opens, you pick up
 *    the bowl of nasi and climb in (buayaHeartJump: step 16, inside the shadow).
 * Every step after a dialogue runs from the update loop, once, even when the dialogue is skipped. Mixed into
 * LC.WorldScene (and the UI: the goal line, the health bars). Loaded after WorldBuaya2.js and WorldBunianMirror.js. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var W = LC.WorldScene.prototype, U = LC.UIScene.prototype, C = LC.C20, X = LC.BUAYA2_TEXT, T = 16;
  var LANTERN = { x: 7, y: 14 }, KANCIL = { x: 8, y: 13 }, SEAT = { x: 7, y: 15 }, HITAM = { x: 14.2, y: 18 }, DIRI = { x: 12, y: 17 };
  var R1 = { time: 20, floor: 0.6, events: [[3, 'ring'], [7.5, 'pantul'], [12.5, 'ring'], [16, 'pantul']] };
  var RING = { speed: 115, max: 290, band: 8, gap: 0.55, every: 6.5 };
  var PANTUL = { shimmer: 0.95, active: 3.2, every: 9.5, opening: 1.8 };
  var SCALE = 1.3, VIOLET = 0x9a5cff, SAYC = '#ff9aae';
  function step(w) { return C.step(w.S); }
  function ADD() { return Phaser.BlendModes.ADD; }
  function feet(t) { return { x: (t.x + 0.5) * T, y: (t.y + 1) * T }; }
  function onBank(w) { return w.area === 'sarang20' && C.ready(w.S) && step(w) === 15; }
  function angDiff(a, b) { var d = Math.abs(a - b) % (Math.PI * 2); return d > Math.PI ? Math.PI * 2 - d : d; }

  // ------------------------------------------------------------------ the lantern (drawn here, once)
  function lanternArt(scene) {
    if (scene.textures.exists('lentera20')) return;
    [['lentera20', true], ['lentera20_off', false]].forEach(function (k) {
      LC.Art.make(scene, k[0], 10, 14, function (p) {
        p.rect(4, 0, 2, 2, '#3a2a1a'); p.rect(2, 2, 6, 2, '#6a4a2a');                       // the ring and the cap
        p.rect(2, 4, 6, 7, '#3a2a1a'); p.rect(3, 5, 4, 5, k[1] ? '#ffd88a' : '#4a4038');       // the glass
        if (k[1]) { p.rect(4, 6, 2, 3, '#fff4c8'); p.px(4, 7, '#ffffff'); }                 // the flame
        p.rect(1, 11, 8, 2, '#6a4a2a'); p.rect(2, 13, 6, 1, '#3a2a1a');
      }, true);
    });
  }

  // ------------------------------------------------------------------ how strong they are: from you
  function stats(w) {
    var S = w.S, best = null;
    S.inv.forEach(function (sl) { var it = sl && LC.ITEMS[sl.id]; if (it && it.kind === 'weapon' && (!best || LC.State.weaponDamage(it) > LC.State.weaponDamage(best))) best = it; });
    var pd = best ? LC.State.weaponDamage(best) : 4, hp = S.maxHp;
    return { pd: pd, best: best, diri: Math.max(90, Math.round(pd * 22)), hitam: Math.max(120, Math.round(pd * 28)),
      hit: Math.max(6, Math.round(hp * 0.1)), ring: Math.max(8, Math.round(hp * 0.14)), swipe: Math.max(7, Math.round(hp * 0.12)), tiger: Math.max(4, Math.round(pd * 0.6)) };
  }

  Object.assign(W, {
    // ================================================================ Kancil's lantern
    buayaLanternStart: function (fresh) {
      var b = this.c20b;
      if (!b || b.lantern) return;
      lanternArt(this);
      var lt = this.buayaPut('lantern20', LANTERN, 'lentera20', { type: 'buaya_lantern' }, 1);
      var k = this.buayaPut('kancilL20', KANCIL, 'kancil20_0', { type: 'buaya_kancil2' });
      k.spr.setFlipX(false);
      var lp = feet(LANTERN), light = this.addLight(lp.x, lp.y - 9, 0xffc870, 1.3, true);
      light.base = 0.95;
      b.lantern = { spr: lt.spr, light: light };
      if (fresh) this.buayaLanternAsk(X.lanternSet);
      else b.lanternAsk = 0.8;
    },
    buayaLanternAsk: function (lines) {
      var b = this.c20b;
      if (!onBank(this) || !b || this.c20s || this.ui.isBlocking()) return;
      this.buayaLines(lines || X.lanternAgain, { choices: [
        { label: X.lanternLabels[0], fn: function () { b.lanternSave = true; } },
        { label: X.lanternLabels[1], fn: function () { b.fightGo = true; } },
        { label: X.lanternLabels[2] }   // (Esc picks this one: the lantern stays, USE it when you are ready)
      ] });
    },
    updateLantern: function (dt) {
      var b = this.c20b;
      if (!b || !b.lantern || this.c20s) return;
      b.lantern.light.img.setAlpha(0.75 + 0.2 * Math.sin(this.time.now / 140));
      if (this.ui.isBlocking() || this.leaving || this.sleeping) return;
      if (b.lanternSave) { b.lanternSave = false; b.lanternBack = true; this.ui.openSaves('save'); return; }   // (the usual save slots)
      if (b.lanternBack) { b.lanternBack = false; this.buayaLanternAsk(); return; }                          // and back to the lantern
      if (b.fightGo) { b.fightGo = false; this.shadowsBegin(); return; }
      if (b.lanternAsk && (b.lanternAsk -= dt) <= 0) { b.lanternAsk = 0; this.toast(X.lanternHint, 'lentera20'); this.buayaLanternAsk(); }
    },

    // ================================================================ round 1: they rise
    shadowsBegin: function () {
      var self = this, b = this.c20b, S = this.S, keys = this.ensureMirrorArt();
      LC.SPEAKERS.diri20.portrait = keys.pk + '_down_0';
      LC.ENEMIES.diri20.texture = keys.pk + '_down';
      var st = stats(this);
      LC.ENEMIES.diri20.dmg = st.hit; LC.ENEMIES.hitam20.dmg = st.swipe;
      var F = this.c20s = { round: 1, phase: 'rise', t: 0, ev: 0, st: st, rings: [], g: this.add.graphics().setDepth(9004), pantul: null, opening: 0, tiger: null,
        after: null, swipe: 0, swipeT: 2.5, ringT: 0, pantulT: 0, said: {} };
      this.shadowsCut(true);
      var sp = this.tilePx(SEAT);
      this.player.setPosition(sp.x, sp.y); this.dir = 'right';
      if (b.shadow) this.tweens.add({ targets: b.shadow, alpha: 0, y: b.shadow.y + 20, duration: 900 });
      // Black Pelita rises at the shore; your reflection stands up in the shallows
      F.hitam = this.shadowsSpawn('hitam20', HITAM, st.hitam);
      F.diri = this.shadowsSpawn('diri20', DIRI, st.diri);
      var hs = F.hitam.spr, ds = F.diri.spr;
      hs.setScale(SCALE, 0.1).setAlpha(0);
      this.tweens.add({ targets: hs, scaleY: SCALE, alpha: 1, duration: 1400, ease: 'Back.easeOut' });
      ds.setAlpha(0);
      this.tweens.add({ targets: ds, alpha: 1, duration: 900, delay: 500 });
      this.fx.drop.explode(16, hs.x, hs.y - 6); this.fx.smoke.explode(10, ds.x, ds.y - 8);
      LC.Audio.sfx('bayang20'); this.cameras.main.shake(900, 0.003);
      var met = !!(S.quests.bunianMirrorDefeats || (LC.BunianTrials && LC.BunianTrials.doors && (function () {
        var d = LC.BunianTrials.doors.find(function (x) { return x.mirror; }); return d && LC.BunianTrials.clearCount(S, d);
      })()));
      this.time.delayedCall(1500, function () {
        if (self.c20s !== F || self.leaving) return;
        self.buayaLines([['', met ? X.rise : X.riseNew], ['hitam20', X.hitamSay], ['diri20', met ? X.diriSay : X.diriSayNew]]);
        F.after = function () { this.shadowsFight(1); };
      });
    },
    shadowsSpawn: function (kind, at, hp) {
      var g = { kind: kind, zone: C.nest.zone, c20s: true };
      if (kind === 'hitam20') g.fixed = at;
      var e = this.spawnEnemy(g, true), s = e.spr;
      if (kind === 'diri20') { var p = this.tilePx(at); s.setPosition(p.x, p.y); e.tx = p.x; e.ty = p.y; }
      e.c20s = kind; e.hp = e.maxHp = hp; e.restT = 1.2;
      if (kind === 'hitam20') {
        s.setScale(SCALE).setDepth(s.y + 6);
        e.baseY = s.y;
        e.light.img.setTint(VIOLET).setPosition(s.x, s.y - 40); e.light.base = 0.7;
        e.heart = this.add.image(s.x, s.y - 28, 'glow').setBlendMode(ADD()).setDepth(9006).setTint(0xfff6d8).setScale(0.12).setAlpha(0);
      } else {
        e.light.img.setTint(VIOLET); e.light.base = 0.35;
        var m = { pk: LC.ENEMIES.diri20.texture.replace('_down', ''), skills: ['pantul'], orbs: [], hold: 0, pantulCd: 99, shield: 0, px: s.x, py: s.y,
          aura: this.add.image(s.x, s.y - 1, 'glow').setTint(0x1a0624).setAlpha(0.7).setScale(0.55, 0.22).setDepth(s.y - 1) };
        m.wk = 'mirrorwalk' + (this.pc || 0);
        this.c20s.mt = { boss: e, mirror: m, round: { weapon: this.c20s.st.best }, clears: 0, marks: [], ending: false };
      }
      return e;
    },
    shadowsCut: function (on) {   // (a scene: you and the shadows hold still, and nothing can hurt you)
      this.cutscene = !!on; this.c20sCut = !!on;
      if (on) { this.invuln = 0; this.player.setAlpha(1); }
    },
    shadowsFight: function (round) {
      var F = this.c20s;
      F.round = round; F.phase = 'fight'; F.t = 0; F.ev = 0;
      this.shadowsCut(false);
      this.invuln = 1.2;
      if (round === 1) { this.toast(X.holdHow, 'bayang20_besar_0'); }
      else { F.ringT = 3.5; F.pantulT = 6.5; this.toast(X.rematchHow, 'harimau20_0'); }
    },

    // ================================================================ every frame, while the fight is on
    updateShadows: function (time, dt) {
      var self = this, F = this.c20s;
      if (!F) return;
      var blocked = this.ui.isBlocking() || this.leaving || this.sleeping;
      if (F.after && !blocked) { var fn = F.after; F.after = null; fn.call(this); return; }
      this.shadowsDrawRings(dt, blocked || F.phase !== 'fight');
      if (F.tiger) this.updateShadowTiger(dt, blocked || F.phase !== 'fight');
      if (F.hitam && F.hitam.heart) F.hitam.heart.setPosition(F.hitam.spr.x, F.hitam.spr.y - 28 * F.hitam.spr.scaleY);
      if (F.phase === 'lost' && !blocked && !F.retry) { this.shadowsLose(true); return; }
      if (F.retry && !blocked) { F.retry = false; this.shadowsRematch(); return; }
      if (F.phase !== 'fight' || blocked) return;
      var e1 = F.diri, e2 = F.hitam, mt = F.mt;
      // Bayang Diri: your shadow's walk and swing (WorldBunianMirror.js), its Pantul, the opening
      if (!e1.dead) {
        this.mirrorAnimate(mt);
        if (e1.strikeT > 0 && !mt.mirror.swung) { mt.mirror.swung = true; this.mirrorSwing(mt); } else if (e1.strikeT <= 0) mt.mirror.swung = false;
      }
      this.mirrorPlayerFx(mt, dt, time);
      this.updateMirrorOrbs(mt, dt);
      this.updateShadowPantul(dt);
      if (F.opening > 0) {
        F.opening -= dt;
        if (!e1.dead && e1.hp < F.diriLast) { var extra = F.diriLast - e1.hp; e1.hp -= extra; this.ui.floatText(e1.spr.x, e1.spr.y - 30, X.opening + ' ' + Math.round(extra * 2), '#ffe08a'); if (e1.hp <= 0) this.enemyDie(e1); }
        if (!e1.dead) e1.spr.setAlpha(Math.floor(time / 90) % 2 ? 0.7 : 1); else e1.spr.setAlpha(1);
        if (F.opening <= 0) e1.spr.setAlpha(1);
      }
      F.diriLast = e1.hp;
      // Black Pelita: it sways at the shore, swipes at you when you come close, and sends its dark rings
      if (!e2.dead) {
        var hs = e2.spr, still = e2.stoneT > 0 || e2.tranceT > 0 || e2.fearT > 0;
        hs.y = e2.baseY + Math.round(Math.sin(time / 420) * 2);
        e2.light.img.setPosition(hs.x, hs.y - 40);
        if (!still) this.shadowSwipe(dt);
      }
      // round 1: they cannot fall yet; after about 20 seconds (or sooner, at no health) the ring closes
      if (F.round === 1) {
        [e1, e2].forEach(function (e) { var floor = e.maxHp * R1.floor; if (e.hp < floor) e.hp = floor; });
        F.t += dt;
        while (F.ev < R1.events.length && F.t >= R1.events[F.ev][0]) { var k = R1.events[F.ev++][1]; if (k === 'ring') this.shadowRing(); else this.shadowPantul(); }
        if (F.t >= R1.time || this.S.hp <= 0) this.shadowsFinale();
        return;
      }
      // round 2: the rings and the Pantul come round again
      if (!e2.dead && !(e2.stoneT > 0 || e2.tranceT > 0) && (F.ringT -= dt) <= 0) { F.ringT = RING.every * (0.9 + Math.random() * 0.25); this.shadowRing(); }
      if (!e1.dead && !F.pantul && F.opening <= 0 && (F.pantulT -= dt) <= 0) { F.pantulT = PANTUL.every * (0.85 + Math.random() * 0.3); this.shadowPantul(); }
      void self;
    },
    // ---- Black Pelita's claw, when you stand close
    shadowSwipe: function (dt) {
      var F = this.c20s, e = F.hitam, s = e.spr, p = this.player, d = Math.hypot(p.x - s.x, (p.y - 8) - (s.y - 26));
      if (F.swipe > 0) {
        F.swipe -= dt;
        if (Math.floor(this.time.now / 70) % 2) s.setTintFill(0xd8b8ff); else if (e.hurtT <= 0) s.clearTint();
        if (F.swipe <= 0) {
          if (e.hurtT <= 0) s.clearTint();
          F.swipeT = 2.3 + Math.random() * 0.8;
          var arc = this.add.image(s.x - 18, s.y - 14, 'slash_right').setDepth(9600).setFlipX(true).setTint(0x8a5aff).setBlendMode(ADD()).setScale(1.6);
          this.tweens.add({ targets: arc, alpha: 0, scale: 2.1, duration: 240, onComplete: function () { arc.destroy(); } });
          LC.Audio.sfx('swing');
          if (d < 52) this.playerHurt(F.st.swipe, e);
        }
        return;
      }
      if ((F.swipeT -= dt) <= 0 && d < 46) { F.swipe = 0.6; LC.Audio.sfx('lunge'); }
    },
    // ---- the dark rings (in the rematch, with a gap the tiger tears open)
    shadowRing: function () {
      var self = this, F = this.c20s, e = F.hitam, s = e.spr, cx = s.x, cy = s.y - 26, p = this.player;
      var ring = { cx: cx, cy: cy, r: 26, hit: false, gap: null, lag: 0.55 };
      if (F.round === 2 && F.tiger) {
        var a = Math.atan2(p.y - cy, p.x - cx) + (Math.random() - 0.5) * 1.1;
        if (Math.cos(a) > -0.2) a = Math.PI + (Math.random() - 0.5) * 1.2;   // (always somewhere on the bank)
        ring.gap = a;
        F.tiger.tear = { a: a, t: 2.6 };
      }
      F.rings.push(ring);
      s.setTintFill(0x3a1a5a);
      this.time.delayedCall(220, function () { if (!e.dead && e.hurtT <= 0) s.clearTint(); });
      LC.Audio.sfx('bayang20');
      if (!F.said.ring) { F.said.ring = true; this.toast(X.ringWarn, 'bayang20_besar_0'); }
      this.ui.floatText(cx, cy - 34, F.round === 2 && ring.gap !== null ? 'The tiger tears a gap!' : 'A dark ring!', '#d8c0ff');
      void self;
    },
    shadowsDrawRings: function (dt, hold) {
      var self = this, F = this.c20s, g = F.g, p = this.player, now = this.time.now;
      g.clear();
      F.rings = F.rings.filter(function (r) {
        if (r.lag > 0) { r.lag -= hold ? 0 : dt; g.lineStyle(2, VIOLET, 0.5 + 0.4 * Math.sin(now / 50)); g.strokeCircle(r.cx, r.cy, 20 + (0.55 - r.lag) * 20); return true; }
        if (!hold) r.r += RING.speed * dt;
        var fade = 1 - r.r / RING.max;
        function arcs(w, col, alpha) {
          g.lineStyle(w, col, alpha);
          if (r.gap === null) { g.strokeCircle(r.cx, r.cy, r.r); return; }
          g.beginPath(); g.arc(r.cx, r.cy, r.r, r.gap + RING.gap, r.gap - RING.gap + Math.PI * 2, false); g.strokePath();
        }
        arcs(7, 0x1a0e2a, 0.8 * fade); arcs(2, 0xc8a8ff, 0.85 * fade);
        if (r.gap !== null) {   // the torn edges glow gold
          [r.gap - RING.gap, r.gap + RING.gap].forEach(function (a) { g.fillStyle(0xffd166, 0.9 * fade); g.fillCircle(r.cx + Math.cos(a) * r.r, r.cy + Math.sin(a) * r.r, 3); });
        }
        if (!hold && !r.hit) {
          var px = p.x, py = p.y - 6, d = Math.hypot(px - r.cx, py - r.cy);
          if (Math.abs(d - r.r) < RING.band) {
            if (r.gap !== null && angDiff(Math.atan2(py - r.cy, px - r.cx), r.gap) < RING.gap) {
              r.hit = true;
              if (!F.said.gap || now - F.said.gap > 3000) { F.said.gap = now; self.ui.floatText(px, py - 22, X.gap, '#ffe08a'); }
            } else if (self.invuln <= 0) { r.hit = true; self.playerHurt(F.st.ring, { spr: { x: r.cx, y: r.cy } }); }
          }
        }
        return r.r < RING.max;
      });
    },
    // ---- Bayang Diri's Mantera Pantul: a shimmer first, then a mirror that sends your spells back
    shadowPantul: function () {
      var F = this.c20s, e = F.diri, s = e.spr;
      if (e.dead || F.pantul) return;
      e.windT = 0; e.strikeT = 0; e.restT = Math.max(e.restT, PANTUL.shimmer + 0.2);
      var img = this.textures.exists('mantera_pantul') ? this.add.image(s.x, s.y - 14, 'mantera_pantul').setDepth(9601).setTint(0xd6a8ff).setScale(0.6).setAlpha(0.4)
        : this.add.image(s.x, s.y - 14, 'glow').setDepth(9601).setTint(0xd6a8ff).setBlendMode(ADD()).setScale(0.3);
      F.pantul = { phase: 'shimmer', t: PANTUL.shimmer, img: img };
      this.ui.floatText(s.x, s.y - 30, X.pantulWarn, SAYC);
      LC.Audio.sfx('cast');
    },
    updateShadowPantul: function (dt) {
      var F = this.c20s, P = F.pantul, e = F.diri, m = F.mt.mirror;
      if (!P) return;
      if (e.dead) { this.shadowPantulEnd(); return; }
      var s = e.spr, now = this.time.now;
      P.t -= dt;
      P.img.setPosition(s.x, s.y - 14);
      if (P.phase === 'shimmer') {
        P.img.setScale(0.6 + (1 - P.t / PANTUL.shimmer) * 1.1).setAlpha(0.35 + 0.35 * Math.abs(Math.sin(now / 60)));
        if (P.t <= 0) { P.phase = 'active'; P.t = PANTUL.active; m.pantulCd = 0; this.fx.sparkle.explode(10, s.x, s.y - 14); }
        return;
      }
      P.img.setScale(1.7 + 0.12 * Math.sin(now / 90)).setAlpha(0.55 + 0.25 * Math.sin(now / 70)).setAngle(Math.sin(now / 300) * 8);
      this.mirrorReflect(F.mt, dt);   // (your Mantera Suria comes back at you: WorldBunianMirror.js)
      if (P.t <= 0) this.shadowPantulEnd();
    },
    shadowPantulEnd: function () {
      var F = this.c20s, P = F.pantul;
      if (!P) return;
      var img = P.img;
      this.tweens.add({ targets: img, alpha: 0, scale: img.scale * 1.3, duration: 250, onComplete: function () { img.destroy(); } });
      F.pantul = null; F.mt.mirror.pantulCd = 99;
    },
    // in the rematch, your blow (or the tiger's pounce) breaks the mirror: an opening
    shadowsOpening: function (why) {
      var F = this.c20s, e = F.diri, s = e.spr;
      if (!F.pantul || F.pantul.phase !== 'active' || e.dead) return;
      this.shadowPantulEnd();
      F.opening = PANTUL.opening; F.diriLast = e.hp;
      e.staggerT = PANTUL.opening; e.windT = 0; e.strikeT = 0;
      this.fx.sparkle.explode(18, s.x, s.y - 12); LC.Audio.sfx('crumble');
      this.ui.floatText(s.x, s.y - 34, why, '#ffe08a');
    },

    // ================================================================ Harimau Cahaya, in this fight
    shadowTigerRise: function () {
      var F = this.c20s, p = this.player, x = p.x + 20, y = p.y + 2;
      var spr = this.add.sprite(x, y, 'harimau20_0').setOrigin(0.5, 1).setDepth(y).setScale(0.2).setAlpha(0);
      spr.play('harimau20_walk');
      var glow = this.add.image(x, y - 8, 'glow').setBlendMode(ADD()).setDepth(9001).setTint(0xffe8a0).setScale(1.2).setAlpha(0);
      this.tweens.add({ targets: spr, scale: 1, alpha: 1, duration: 900, ease: 'Back.easeOut' });
      this.tweens.add({ targets: glow, alpha: 0.5, duration: 900 });
      F.tiger = { spr: spr, glow: glow, hitT: 0.8, tear: null, pounce: 0 };
      this.cameras.main.flash(400, 255, 240, 200);
      LC.Audio.sfx('roar11'); LC.Audio.sfx('chime');
      this.ui.floatText(x, y - 30, X.tigerCall, '#fff0b0');
      this.shockwave(x, y - 8, 60, 0xffe8a0);
    },
    updateShadowTiger: function (dt, hold) {
      var self = this, F = this.c20s, Tg = F.tiger, s = Tg.spr, p = this.player;
      Tg.glow.setPosition(s.x, s.y - 8);
      s.setDepth(s.y);
      if (hold) return;
      var tx, ty, foe = null, speed = 110;
      if (Tg.tear && (Tg.tear.t -= dt) > 0) {   // tearing a gap in the ring
        var h = F.hitam.spr; tx = h.x + Math.cos(Tg.tear.a) * 62; ty = h.y - 26 + Math.sin(Tg.tear.a) * 62; speed = 170;
      } else {
        Tg.tear = null;
        var pan = F.pantul && F.pantul.phase === 'active' && !F.diri.dead;
        foe = pan ? F.diri : [F.diri, F.hitam].filter(function (e) { return !e.dead; }).sort(function (a, b) { return Math.hypot(a.spr.x - s.x, a.spr.y - s.y) - Math.hypot(b.spr.x - s.x, b.spr.y - s.y); })[0];
        if (foe) { tx = foe.spr.x + (foe === F.hitam ? -26 : 0); ty = foe.spr.y; if (pan) speed = 190; }
        else { tx = p.x + 18; ty = p.y; }
      }
      var dx = tx - s.x, dy = ty - s.y, d = Math.hypot(dx, dy) || 1;
      if (d > 8) { var v = Math.min(d * 4, speed) * dt; s.x += dx / d * v; s.y += dy / d * v; if (Math.abs(dx) > 1) s.setFlipX(dx < 0); }
      Tg.hitT -= dt;
      if (foe && d < (foe === F.hitam ? 14 : 20) && Tg.hitT <= 0) {
        Tg.hitT = 1.1;
        var n = F.st.tiger;
        if (foe === F.diri && F.pantul && F.pantul.phase === 'active') { this.tweens.add({ targets: s, y: s.y - 10, duration: 120, yoyo: true }); this.shadowsOpening('Harimau Cahaya pounces!'); }
        foe.hp -= n; foe.hurtT = 0.1; foe.spr.setTintFill(0xffffff);
        this.fx.sparkle.explode(8, foe.spr.x, foe.spr.y - 12);
        this.ui.floatText(foe.spr.x, foe.spr.y - (foe === F.hitam ? 70 : 24), String(n), '#fff0b0');
        this.tweens.add({ targets: s, x: s.x + dx / d * 8, duration: 80, yoyo: true });
        LC.Audio.sfx('hit');
        if (foe.hp <= 0) this.enemyDie(foe);
      }
      void self;
    },

    // ================================================================ the end of round 1: the ring closes, the blow, the dark
    shadowsFinale: function () {
      var self = this, F = this.c20s, p = this.player, e = F.diri;
      if (F.phase !== 'fight' || F.round !== 1) return;
      F.phase = 'finale';
      this.shadowsCut(true);
      this.shadowsClear();
      this.toast(X.closing, 'bayang20_besar_0');
      LC.Audio.sfx('bayang20');
      var o = { r: 74 }, g = F.g2 || (F.g2 = this.add.graphics().setDepth(9005));
      this.tweens.add({ targets: o, r: 12, duration: 1600, ease: 'Sine.easeIn',
        onUpdate: function () { g.clear(); g.lineStyle(8, 0x1a0e2a, 0.85); g.strokeCircle(p.x, p.y - 6, o.r); g.lineStyle(2, 0xc8a8ff, 0.9); g.strokeCircle(p.x, p.y - 6, o.r); },
        onComplete: function () {
          if (self.c20s !== F) return;
          // Bayang Diri lands the killing blow
          var s = e.spr, side = s.x < p.x ? -1 : 1;
          self.tweens.add({ targets: s, x: p.x + side * 12, y: p.y, duration: 220, ease: 'Quad.easeIn', onComplete: function () {
            if (self.c20s !== F) return;
            self.mirrorSwing(F.mt);
            self.S.hp = 0;
            g.clear();
            self.cameras.main.shake(300, 0.01); self.cameras.main.flash(250, 160, 40, 60);
            LC.Audio.sfx('hurt');
            self.ui.floatText(p.x, p.y - 24, '...', '#ff8a8a');
            self.tweens.add({ targets: p, angle: side > 0 ? -90 : 90, duration: 420, ease: 'Quad.easeIn' });
            p.setTint(0x5a5a70);
            self.time.delayedCall(900, function () {
              if (self.c20s !== F) return;
              var b = self.c20b;   // the lantern goes out
              if (b && b.lantern) { b.lantern.spr.setTexture('lentera20_off'); b.lantern.light.base = 0; b.lantern.light.img.setAlpha(0); }
              self.cameras.main.fadeOut(1400, 0, 0, 0);
              self.cameras.main.once('camerafadeoutcomplete', function () { if (self.c20s === F) self.shadowsRevive(); });
            });
          } });
        } });
    },
    // clear what round 1 left on the bank: rings, the mirror, the suns
    shadowsClear: function () {
      var F = this.c20s, m = F.mt && F.mt.mirror;
      F.rings = []; F.g.clear(); F.swipe = 0;
      this.shadowPantulEnd();
      if (m) { m.orbs.forEach(function (o) { o.img.destroy(); o.glow.destroy(); }); m.orbs = []; m.shield = 0; if (m.gleam) m.gleam.setVisible(false); }
      F.opening = 0;
      [F.diri, F.hitam].forEach(function (e) { if (e) { e.windT = 0; e.strikeT = 0; e.staggerT = 0; e.kx = 0; e.ky = 0; e.spr.setAlpha(1); if (e.hurtT <= 0) e.spr.clearTint(); } });
    },

    // ================================================================ Pelita Putih brings you back
    shadowsRevive: function () {
      var F = this.c20s;
      F.phase = 'dark';
      LC.Audio.sfx('click'); this.time.delayedCall(260, function () { LC.Audio.sfx('click'); });   // a bowl, scraped on wood
      this.buayaLines(X.reviveDark);
      F.after = function () { this.shadowsFlame(); };
    },
    shadowsFlame: function () {
      var self = this, F = this.c20s, p = this.player, h = F.hitam.spr, S = this.S;
      F.phase = 'flame';
      this.cameras.main.fadeIn(1200, 0, 0, 0);
      if (F.hitam.heart) { F.hitam.heart.setAlpha(0.9).setScale(0.25); this.tweens.add({ targets: F.hitam.heart, alpha: 0.25, scale: 0.15, duration: 1200 }); }
      var tex = this.textures.exists('ghost_6_normal') ? 'ghost_6_normal' : 'glow';
      var flame = F.flame = this.add.image(h.x, h.y - 28 * SCALE, tex).setDepth(9602).setScale(0.6);
      var glow = F.flameGlow = this.add.image(h.x, h.y - 28 * SCALE, 'glow').setBlendMode(ADD()).setDepth(9601).setTint(0xfff6e0).setScale(0.5).setAlpha(0.8);
      this.tweens.add({ targets: [flame, glow], x: p.x, y: p.y - 10, duration: 1600, delay: 700, ease: 'Sine.easeInOut', onComplete: function () {
        if (self.c20s !== F) return;
        LC.Audio.sfx('chime');
        S.hp = S.maxHp; self.lowHpWarned = false;
        self.tweens.add({ targets: glow, scale: 2.2, alpha: 0.3, duration: 700 });
        self.tweens.add({ targets: flame, scale: 0.45, alpha: 0.7, duration: 700 });   // it dims, as your heart beats again
        self.fx.sparkle.explode(16, p.x, p.y - 10);
        self.buayaLines(X.revivePutih);
        F.after = function () { this.shadowsStand(); };
      } });
    },
    shadowsStand: function () {
      var self = this, F = this.c20s, p = this.player;
      F.phase = 'stand';
      p.clearTint();
      this.tweens.add({ targets: p, angle: 0, duration: 450, ease: 'Back.easeOut' });
      var flame = F.flame, glow = F.flameGlow;
      this.tweens.add({ targets: [flame, glow], x: p.x + 20, y: p.y - 4, alpha: 0, duration: 800, delay: 400, onComplete: function () { flame.destroy(); glow.destroy(); } });
      this.time.delayedCall(800, function () {
        if (self.c20s !== F) return;
        self.shadowTigerRise();
        var b = self.c20b;   // Kancil lights the lantern again
        if (b && b.lantern) { b.lantern.spr.setTexture('lentera20'); b.lantern.light.base = 0.95; b.lantern.light.img.setAlpha(1); }
        self.time.delayedCall(900, function () {
          if (self.c20s !== F) return;
          self.buayaLines(X.reviveTiger);
          F.after = function () { this.shadowsRematch(); };
        });
      });
    },

    // ================================================================ round 2: the rematch (and again, after a fall)
    shadowsRematch: function () {
      var F = this.c20s, S = this.S, p = this.player;
      this.shadowsClear();
      S.hp = S.maxHp; this.lowHpWarned = false;
      p.setAngle(0).clearTint().setAlpha(1);
      var sp = this.tilePx(SEAT); if (F.phase === 'lost') { p.setPosition(sp.x, sp.y); }
      [F.diri, F.hitam].forEach(function (e) {
        e.dead = false; e.hp = e.maxHp; e.stoneT = 0; e.tranceT = 0; e.fearT = 0; e.restT = 1.2; e.atkCd = 1.2;
        e.spr.setVisible(true).setAlpha(1).clearTint().setAngle(0);
        if (e.spr.anims.isPaused) e.spr.anims.resume();
        e.light.base = e === F.hitam ? 0.7 : 0.35;
      });
      F.hitam.spr.setScale(SCALE).setPosition(this.tilePx(HITAM).x, F.hitam.baseY);
      var dp = this.tilePx(DIRI); F.diri.spr.setScale(1).setPosition(dp.x, dp.y);
      if (F.mt.mirror.aura) F.mt.mirror.aura.setAlpha(0.7);
      F.diriLast = F.diri.hp;
      if (F.tiger) F.tiger.spr.setPosition(p.x + 20, p.y + 2);
      this.shadowsFight(2);
    },
    shadowsLose: function (ask) {
      var self = this, F = this.c20s;
      if (!ask) {
        F.phase = 'lost';
        this.shadowsCut(true);
        this.shadowsClear();
        this.player.setAngle(this.player.x < F.hitam.spr.x ? -20 : 20).setTint(0x8a8aa0);
        LC.Audio.sfx('sad'); LC.Audio.setBattle(false);
        return;
      }
      this.buayaLines(X.lose, { choices: [{ label: X.loseLabel, fn: function () { F.retry = true; } }] });
      void self;
    },
    // ---- they fall (in the rematch): kneeling, not gone
    shadowsSubdue: function (e) {
      var F = this.c20s, s = e.spr;
      if (e.dead) return;
      e.dead = true; e.respawn = Infinity; e.hp = 0; e.windT = 0; e.strikeT = 0; e.kx = 0; e.ky = 0;
      e.light.base = 0.2;
      s.anims.pause(); s.setTint(0x6a5a8a);
      this.fx.smoke.explode(12, s.x, s.y - 12); LC.Audio.sfx('crumble');
      if (e === F.diri) {
        this.shadowPantulEnd();
        this.tweens.add({ targets: s, scaleY: 0.82, duration: 300 });
        this.ui.floatText(s.x, s.y - 26, 'Bayang Diri falls to its knees.', SAYC);
      } else {
        this.tweens.add({ targets: s, y: e.baseY + 6, scaleY: SCALE * 0.9, duration: 600 });
        this.ui.floatText(s.x, s.y - 80, 'Black Pelita sinks low.', '#d8c0ff');
      }
      if (F.diri.dead && F.hitam.dead) this.shadowsWon();
    },

    // ================================================================ the heart opens
    shadowsWon: function () {
      var F = this.c20s;
      F.phase = 'won';
      this.shadowsCut(true);
      this.shadowsClear();
      LC.Audio.setBattle(false);
      this.buayaLines(X.endFall);
      F.after = function () { this.shadowsSink(); };
    },
    shadowsSink: function () {
      var self = this, F = this.c20s, d = F.diri.spr, h = F.hitam, Tg = F.tiger;
      F.phase = 'sink';
      // Bayang Diri steps into the lake and sinks back into your reflection
      d.anims.resume(); d.clearTint();
      this.tweens.add({ targets: d, x: d.x + 34, y: d.y + 6, duration: 1300, ease: 'Sine.easeIn' });
      this.tweens.add({ targets: d, alpha: 0, scaleY: 0.2, duration: 900, delay: 900, onComplete: function () { d.setVisible(false); } });
      if (F.mt.mirror.aura) this.tweens.add({ targets: F.mt.mirror.aura, alpha: 0, duration: 900 });
      this.fx.drop.explode(12, d.x + 30, d.y);
      // the tiger lowers its head beside Black Pelita; the crack in its heart opens
      if (Tg) { Tg.spr.setFlipX(false); this.tweens.add({ targets: Tg.spr, x: h.spr.x - 30, y: h.spr.y, duration: 1000, delay: 600, onComplete: function () { self.tweens.add({ targets: Tg.spr, scaleY: 0.85, duration: 300 }); } }); }
      this.time.delayedCall(1700, function () {
        if (self.c20s !== F) return;
        if (h.heart) { h.heart.setAlpha(1); self.tweens.add({ targets: h.heart, scale: 0.7, duration: 1200, ease: 'Sine.easeOut' }); }
        var hl = self.addLight(h.spr.x, h.spr.y - 30, 0xfff6d8, 1.4, false); hl.base = 0.9;
        LC.Audio.sfx('chime'); LC.Audio.sfx('sad');
        self.time.delayedCall(900, function () {
          if (self.c20s !== F) return;
          self.buayaLines(X.endHeart);
          F.after = function () { this.shadowsEnter(); };
        });
      });
    },
    shadowsEnter: function () {
      var S = this.S, F = this.c20s;
      F.phase = 'enter';
      S.quests.c20bowl = true;
      if (!LC.State.count('nasi')) LC.State.add('nasi', 1);
      this.buayaHeartJump();   // step 16 (saved), and in through the crack: inside the shadow
    }
  });

  // ------------------------------------------------------------------ hooks
  // the nest bank, each time it is set up: no fight yet (it is never saved: a reload starts at the lantern)
  var createBuaya2 = W.createBuaya2;
  W.createBuaya2 = function () {
    this.c20s = null;
    if (this.c20sCut) { this.cutscene = false; this.c20sCut = false; }
    return createBuaya2.apply(this, arguments);
  };
  // a save made on the bank (or the game saving itself there) opens at the lantern, before the fight. Loading keeps
  // only the Bunian village as a place (state.js); a step-15 save on the nest bank keeps the bank too.
  var load = LC.State.load;
  LC.State.load = function (n) {
    var ok = load.apply(this, arguments), S = this.s;
    if (ok && S && C.ready(S) && C.step(S) === 15) {
      var raw = null;
      try { raw = JSON.parse(localStorage.getItem(this.slotKey(this.slot)) || 'null'); } catch (e) { raw = null; }
      if (raw && raw.area === 'sarang20') S.area = 'sarang20';
    }
    return ok;
  };
  var create = W.create;
  W.create = function (data) {
    data = data || {};
    var S = LC.State.s;
    if (!data.area && !data.summary && S && S.area === 'sarang20' && C.ready(S) && C.step(S) === 15 && !(LC.Net && LC.Net.isGuest && LC.Net.isGuest())) {
      data = Object.assign({}, data, { area: 'sarang20', spawn: this.tilePx(SEAT), dir: 'up' });
    }
    return create.call(this, data);
  };
  var updateBuaya2 = W.updateBuaya2;
  W.updateBuaya2 = function (time, dt) {
    updateBuaya2.apply(this, arguments);
    if (!this.c20b || !onBank(this)) return;
    if (!this.c20s) this.updateLantern(dt);
    else this.updateShadows(time, dt);
  };
  var objectAction = W.objectAction;
  W.objectAction = function (o) {
    var self = this;
    if (o && o.type === 'buaya_lantern') return { label: this.c20s ? 'Kancil\'s lantern' : 'Kancil\'s lantern: save, or begin the fight', fn: function () { if (!self.c20s) self.buayaLanternAsk(); else self.toast('Kancil watches the water, very still.', 'kancil20_0'); } };
    return objectAction.apply(this, arguments);
  };
  // in round 1 they cannot fall; in the rematch they kneel (they are never killed)
  var enemyDie = W.enemyDie;
  W.enemyDie = function (e) {
    var F = this.c20s;
    if (!F || !e || !e.c20s) return enemyDie.apply(this, arguments);
    if (F.round !== 2 || F.phase !== 'fight') { e.hp = Math.max(1, Math.round(e.maxHp * R1.floor)); return; }
    this.shadowsSubdue(e);
  };
  // you never faint here: round 1 ends in the closing ring, the rematch offers a retry
  var faint = W.faint;
  W.faint = function () {
    var F = this.c20s;
    if (F && this.area === 'sarang20') {
      if (F.round === 1 && F.phase === 'fight') { this.shadowsFinale(); return; }
      if (F.round === 2 && F.phase === 'fight') { this.shadowsLose(false); return; }
      return;
    }
    return faint.apply(this, arguments);
  };
  // your blow breaks Bayang Diri's mirror in the rematch
  var attack = W.attack;
  W.attack = function () {
    var F = this.c20s, e = F && F.diri, before = e && !e.dead ? e.hp : null;
    var r = attack.apply(this, arguments);
    if (F && F.round === 2 && F.phase === 'fight' && before !== null && e.hp < before && F.pantul && F.pantul.phase === 'active') this.shadowsOpening('Your blow breaks the mirror!');
    return r;
  };
  // your own Mantera Pantul sends its reflected suns back again (as in the Hall of Mirrors)
  var castPantul = W.castPantul;
  W.castPantul = function () {
    var F = this.c20s, m = F && F.phase === 'fight' && F.mt && F.mt.mirror;
    if (!m) return castPantul.apply(this, arguments);
    if (!this.pantulAvailable() || this.pantulLeft() || this.ui.isBlocking() || this.cutscene || this.leaving || this.sleeping) return;
    LC.pantulState = this.S; LC.pantulAt = Date.now() + LC.C13.cooldown * 1000;
    m.shield = LC.C13.window;
    if (!m.gleam && this.textures.exists('mantera_pantul')) m.gleam = this.add.image(0, 0, 'mantera_pantul').setDepth(1255);
    if (m.gleam) m.gleam.setPosition(this.player.x, this.player.y - 11).setAlpha(0.8).setScale(1.5).setVisible(true);
    LC.Audio.sfx('cast');
  };

  // ------------------------------------------------------------------ the UI: the goal line, and the health bars in the rematch
  var goal = LC.ch5Goal;
  LC.ch5Goal = function () {
    var S = LC.State.s, Wd = LC.game && LC.game.scene.getScene('World'), F = Wd && Wd.c20s;
    if (S && C.ready(S) && C.step(S) === 15 && Wd && Wd.area === 'sarang20') {
      if (F && F.round === 1) return 'Chapter 20: Hold them off!';
      if (F && F.round === 2) return 'Chapter 20: Defeat Bayang Diri and Black Pelita. Harimau Cahaya fights beside you.';
      return 'Chapter 20: ' + X.lanternHint;
    }
    return goal.apply(this, arguments);
  };
  var update = U.update;
  U.update = function () {
    update.apply(this, arguments);
    if (!this.ready || !this.S) return;
    var Wd = this.world, F = Wd && Wd.c20s, show = !!(F && F.round === 2 && (F.phase === 'fight' || F.phase === 'lost') && Wd.area === 'sarang20' && !this.modal && !Wd.leaving);
    if (!this.c20sG && !show) return;
    if (!this.c20sG) {
      this.c20sG = this.add.graphics();
      this.c20sT1 = this.txt(372, 60, 'Bayang Diri', 13, '#e8d8ff', { stroke: 4 });
      this.c20sT2 = this.txt(372, 92, 'Black Pelita', 13, '#e8d8ff', { stroke: 4 });
      this.pin('tc', [this.c20sG, this.c20sT1, this.c20sT2]);
      this.layout();
    }
    [this.c20sG, this.c20sT1, this.c20sT2].forEach(function (o) { o.setVisible(show); });
    if (!show) return;
    var g = this.c20sG;
    g.clear();
    g.fillStyle(0x1e1510, 0.82); g.fillRoundedRect(360, 54, 240, 68, 10);
    g.lineStyle(2, 0x6a4a8a, 1); g.strokeRoundedRect(360, 54, 240, 68, 10);
    this.bar(g, 372, 77, 216, 9, F.diri.dead ? 0 : F.diri.hp / F.diri.maxHp, F.opening > 0 ? 0xffd166 : 0xb48cff);
    this.bar(g, 372, 109, 216, 9, F.hitam.dead ? 0 : F.hitam.hp / F.hitam.maxHp, 0x7a5ad8);
  };

  // ------------------------------------------------------------------ what's new
  var seen = null;
  try { seen = localStorage.getItem('littleCreature.newsSeen'); } catch (e) { /* storage blocked */ }
  LC.NEWS = {
    id: 'v3.36-two-shadows',
    lines: [
      { text: '✦ Chapter 20 has a new battle ✦  After you ride Seri Putih through the stolen lights, Kancil sets a lantern on the bank (you can save there). Then Black Pelita and Bayang Diri come for you together, and Pelita Putih has something to show you.' },
      { text: 'Already finished Season 1? Replay Chapter 20 from Pause → Chapter → All chapters.' }
    ].concat(seen === LC.NEWS.id || seen === 'v3.36-two-shadows' ? [] : LC.NEWS.lines)
  };
})(window.LC);
