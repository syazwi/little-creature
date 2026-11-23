/* World, your level (v3.12): XP for every monster beaten (once per life, whoever's code finished it), for chapter
 * steps, fish and Pelita's levels; the level-up celebration; and Mantera Suria, the magic Suraya teaches at Sekolah
 * Mantera once Chapter 13 is complete (K, or the sun beside the hotbar): suns of light that seek the nearest foes.
 * Loaded after every other enemyDie wrapper. Mixed into LC.WorldScene. See level.js. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var W = LC.WorldScene.prototype, PL = LC.PL, SU = LC.SURIA;
  var DIRV = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  function ADD() { return Phaser.BlendModes.ADD; }

  // ---------------------------------------------------------------- XP for monsters
  var spawn = W.spawnEnemy;
  W.spawnEnemy = function () {
    var e = spawn.apply(this, arguments);
    if (e) e.life = (e.life || 0) + 1;   // (a respawned monster is worth XP again)
    return e;
  };
  var die = W.enemyDie;
  W.enemyDie = function (e) {
    var r = die.apply(this, arguments);
    if (e && e.def && (e.dead || e.hp <= 0) && e.xpLife !== (e.life || 0)) { e.xpLife = e.life || 0; this.killXp(e); }
    return r;
  };
  // Pelita's levels are yours to share
  var levelUp = W.levelUp;
  W.levelUp = function (lv) {
    var r = levelUp.apply(this, arguments);
    LC.gainXP(PL.pelitaXp * lv);
    return r;
  };

  var createKampong = W.createKampong;
  W.createKampong = function () { createKampong.apply(this, arguments); this.suriaOrbs = []; this.xpWatchT = 0; };
  var updateKampong = W.updateKampong;
  W.updateKampong = function (time, dt) {
    updateKampong.apply(this, arguments);
    this.updateLevel(dt);
    this.updateSuria(dt);
  };

  // Suraya teaches magic once Chapter 13 is complete
  var objectAction = W.objectAction;
  W.objectAction = function (o) {
    if (o && o.type === 'mantera_suraya' && LC.C13 && LC.C13.step(this.S) >= LC.C13.end) {
      var self = this;
      return { label: LC.hasSuria() ? 'Speak to Suraya' : 'Learn magic from Suraya', fn: function () { self.learnSuria(); } };
    }
    return objectAction.apply(this, arguments);
  };

  Object.assign(W, {
    killXp: function (e) {
      var xp = LC.killXp(e.kind, e.def), s = e.spr;
      LC.gainXP(xp);
      if (s && this.ui) this.ui.floatText(s.x, s.y - (s.displayHeight || 16) - 12, '+' + xp + ' XP', '#9ae8ff');
    },
    xpFloat: function (n) { var p = this.player; if (p && this.ui) this.ui.floatText(p.x, p.y - 36, '+' + n + ' XP', '#9ae8ff'); },
    updateLevel: function (dt) {
      var S = this.S;
      if (!S || !S.quests) return;
      if (this.plS !== S) { this.plS = S; this.plShown = LC.plLevel(S); }   // (a save just loaded: no celebration)
      if ((this.xpWatchT = (this.xpWatchT || 0) - dt) <= 0) {
        this.xpWatchT = 1;
        var seen = LC.xpSeen(S), st = PL.storySteps(S), f = (S.stats && S.stats.fish) || 0, n;
        if (st > seen.story) { n = (st - seen.story) * PL.storyXp; seen.story = st; LC.gainXP(n); this.xpFloat(n); }
        else if (st < seen.story) seen.story = st;   // (a chapter replayed in the test build)
        if (f > seen.fish) { n = (f - seen.fish) * PL.fishXp; seen.fish = f; LC.gainXP(n); this.xpFloat(n); }
        else if (f < seen.fish) seen.fish = f;
      }
      var L = LC.plLevel(S);
      if (L > this.plShown) { this.plShown = L; this.playerLevelUp(L); }
      else if (L < this.plShown) this.plShown = L;
    },
    playerLevelUp: function (L) {
      var p = this.player, S = this.S;
      S.hp = S.maxHp;   // a new level: fresh and well
      LC.Audio.sfx('levelup');
      this.cameras.main.flash(280, 160, 230, 255);
      if (p) {
        this.fx.sparkle.explode(22, p.x, p.y - 10);
        this.shockwave(p.x, p.y - 8, 28, 0x9ae8ff);
        this.ui.floatText(p.x, p.y - 30, 'LEVEL UP!', '#ffd166');
      }
      var extra = LC.hasSuria() && (L === 15 || L === 30) ? ' Mantera Suria now casts ' + (L === 30 ? 'three' : 'two') + ' suns!' : '';
      this.ui.toast('You reached Level ' + L + ': ' + PL.title(L) + '! Strength can now reach ' + PL.strCap(L) + '.' + extra, 'ic_level');
    },

    // ---------------------------------------------------------------- Mantera Suria
    learnSuria: function () {
      var q = this.S.quests, X = LC.SURIA_TEXT, p = this.player;
      if (q.suria) { this.manteraLines(X.again); return; }
      q.suria = 1;   // (given before the words, so closing the dialogue early cannot lose it)
      LC.State.save();
      LC.Audio.sfx('cast');
      this.fx.sparkle.explode(28, p.x, p.y - 10);
      this.shockwave(p.x, p.y - 10, 30, 0xffd070);
      this.cameras.main.flash(500, 255, 230, 160);
      this.manteraLines(X.learn);
    },
    suriaLeft: function () { return this.S === LC.suriaState ? Math.max(0, ((LC.suriaAt || 0) - Date.now()) / 1000) : 0; },
    suriaReady: function () {
      return LC.hasSuria() && !!this.player && !this.sleeping && !this.leaving && !this.cutscene && !(this.A && this.A.sailing) && !this.fishing && !(this.ui && this.ui.isBlocking());
    },
    castSuria: function () {
      if (!this.suriaReady()) return;
      var left = this.suriaLeft();
      if (left > 0) { this.toast('The sun is still gathering light... (' + Math.ceil(left) + 's)', 'ic_suria'); LC.Audio.sfx('error'); return; }
      LC.suriaState = this.S; LC.suriaAt = Date.now() + SU.cd * 1000;
      var p = this.player, L = LC.plLevel(), n = LC.suriaCount(L), dmg = LC.suriaDamage(L), d = DIRV[this.dir] || DIRV.down;
      var foes = (this.enemies || []).filter(function (e) { return !e.dead && !e.away && e.spr && e.spr.visible && Math.hypot(e.spr.x - p.x, e.spr.y - p.y) < SU.range; })
        .sort(function (a, b) { return Math.hypot(a.spr.x - p.x, a.spr.y - p.y) - Math.hypot(b.spr.x - p.x, b.spr.y - p.y); });
      this.suriaOrbs = this.suriaOrbs || [];
      for (var i = 0; i < n; i++) {
        var a = Math.atan2(d[1], d[0]) + (i - (n - 1) / 2) * 0.75, x = p.x + Math.cos(a) * 8, y = p.y - 12 + Math.sin(a) * 6;
        var glow = this.add.image(x, y, 'glow').setBlendMode(ADD()).setTint(0xffc860).setScale(0.22).setDepth(9500);
        var core = this.add.image(x, y, 'suria_orb').setDepth(9501);
        this.suriaOrbs.push({ img: core, glow: glow, vx: Math.cos(a) * SU.speed, vy: Math.sin(a) * SU.speed, t: SU.life, dmg: dmg, target: foes.length ? foes[i % foes.length] : null });
      }
      LC.Audio.sfx('cast');
      this.fx.sparkle.explode(8, p.x, p.y - 12);
      this.tweens.add({ targets: p, scaleY: 0.9, duration: 70, yoyo: true });
    },
    updateSuria: function (dt) {
      var list = this.suriaOrbs;
      if (!list || !list.length) return;
      for (var i = list.length - 1; i >= 0; i--) {
        var o = list[i], im = o.img, tg = o.target;
        if (!im.active) { list.splice(i, 1); continue; }
        if (tg && (tg.dead || tg.away || !tg.spr.visible)) tg = o.target = null;
        if (tg) {   // turn towards the target, a little each frame
          var ang = Math.atan2(tg.spr.y - tg.spr.displayHeight / 2 - im.y, tg.spr.x - im.x), sp = Math.hypot(o.vx, o.vy), cur = Math.atan2(o.vy, o.vx);
          cur += Phaser.Math.Clamp(Phaser.Math.Angle.Wrap(ang - cur), -SU.turn * dt, SU.turn * dt);
          o.vx = Math.cos(cur) * sp; o.vy = Math.sin(cur) * sp;
        }
        im.x += o.vx * dt; im.y += o.vy * dt; im.rotation += dt * 6; o.t -= dt;
        o.glow.setPosition(im.x, im.y).setScale(0.2 + 0.04 * Math.sin(this.time.now / 60 + i));
        if (Math.random() < 0.3) this.fx.sparkle.explode(1, im.x, im.y);
        var hit = null;
        (this.enemies || []).forEach(function (e) {
          if (hit || e.dead || e.away || !e.spr.visible) return;
          if (Math.hypot(e.spr.x - im.x, (e.spr.y - e.spr.displayHeight / 2) - im.y) < e.def.w + 6) hit = e;
        });
        if (hit) this.suriaHit(hit, o);
        if (hit || o.t <= 0) { list.splice(i, 1); this.suriaFade(o, !!hit); }
      }
    },
    suriaHit: function (e, o) {
      var stone = e.stoneT > 0, n = stone ? o.dmg * 2 : o.dmg, sp = Math.hypot(o.vx, o.vy) || 1, x = o.img.x, y = o.img.y;
      e.hp -= n; e.hurtT = 0.12; e.spr.setTintFill(0xfff2b0);
      if (!stone) { var k = e.def.boss ? 30 : 90; e.kx = o.vx / sp * k; e.ky = o.vy / sp * k; e.windT = 0; }
      this.shockwave(x, y, 12, 0xffd070);
      this.fx.sparkle.explode(6, x, y);
      this.ui.floatText(e.spr.x, e.spr.y - e.spr.height - 2, (stone ? 'CRACK! ' : '') + n, '#ffd070');
      LC.Audio.sfx('hit'); this.hitStop = 0.03;
      if (e.hp <= 0) this.enemyDie(e);
    },
    suriaFade: function (o, hit) {
      this.tweens.add({ targets: [o.img, o.glow], alpha: 0, scale: hit ? 0.5 : 0.1, duration: 160, onComplete: function () { o.img.destroy(); o.glow.destroy(); } });
    }
  });
})(window.LC);
