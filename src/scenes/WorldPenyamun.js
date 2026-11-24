/* World, Chapter 17: Penyamun Empat Puluh? (v3.17). See penyamun.js. Story steps are saved the moment they happen,
 * before any dialogue; scenes that follow a dialogue run from the update loop once it has closed. The cliff door takes
 * the voice mantera (UIPenyamun.js: the microphone, or tapping the words); inside, Tok Batu takes today's word in the
 * gang's code. Panglima Garong is a boss who gives up instead of falling. Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var W = LC.WorldScene.prototype, C = LC.C17, X = LC.PENYAMUN_TEXT, T = 16;
  function step(w) { return C.step(w.S); }
  function story(w, n) { w.S.quests.ch17 = n; LC.State.save(); }
  function flags(w, k) { var q = w.S.quests; return q[k] || (q[k] = {}); }
  function done(w) { return step(w) >= C.end; }

  var create = W.createKampong, update = W.updateKampong;
  W.createKampong = function () { create.apply(this, arguments); LC.penyamunRecipe(this.S); this.createPenyamun(); };
  W.updateKampong = function (time, dt) { update.apply(this, arguments); this.updatePenyamun(time, dt); };

  var objectAction = W.objectAction;
  W.objectAction = function (o) {
    var self = this, s = step(this), q = this.S.quests;
    if (!o) return objectAction.apply(this, arguments);
    switch (o.type) {
      case 'penyamun_tokp': return { label: s === 1 ? 'Talk to Tok Penghulu' : s === 6 ? 'Warn Tok Penghulu!' : 'Talk to Tok Penghulu', fn: function () {
        if (s === 1) { story(self, 2); self.refreshWhen(); self.penyamunLines(X.news); return; }
        if (s === 6) { story(self, 7); self.penyamun.merchantPending = true; self.penyamunLines(X.warn); return; }
        self.penyamunLines([['penghulu15', X.tokp[s] || X.tokp[1]]]);
      } };
      case 'penyamun_ali': return { label: s === 2 ? 'Talk to the firewood seller' : done(this) && this.area === 'farm' && q.c17wood !== this.S.day ? 'Take Ali Baba\'s firewood' : 'Talk to Ali Baba', fn: function () { self.penyamunAli(o); } };
      case 'penyamun_way': return { label: 'Take the eastern trail to Bukit Kapur', fn: function () { self.goArea('kapur', self.tilePx(LC.AREAS.kapur.home), 'up'); } };
      case 'penyamun_back': return { label: 'Back to Hutan Rimba', fn: function () { self.goArea('forest', self.tilePx({ x: 40, y: 28 }), 'down'); } };
      case 'penyamun_bush': return { label: s === 3 ? 'Hide in the bushes' : 'A big leafy bush', fn: function () {
        if (s === 3) { self.penyamunHide(); return; }
        self.toast(s < 3 ? 'A big leafy bush. Perfect for hiding in, if you ever needed to.' : 'Your hiding bush. There is still a leaf in your hair.', 'semak17');
      } };
      case 'penyamun_door': return { label: s === 4 || s === 5 ? 'Say the mantera' : s >= 6 ? 'Enter the thieves\' cave' : 'The grey cliff', fn: function () {
        if (s === 3) { self.toast(X.hideFirst, 'semak17'); return; }
        if (s === 4 || s === 5) { self.ui.openMantera17(function () { self.penyamunOpenDoor(); }); return; }
        if (s >= 6) { self.penyamunLines(X.doorAfter); self.penyamun.enterPending = true; return; }
        self.penyamunLines(X.door);
      } };
      case 'penyamun_batu': return { label: s === 5 ? 'Give Tok Batu today\'s word' : 'Leave the cave', fn: function () {
        if (s === 5) { self.ui.openBatu17(function (word) { return self.penyamunTry(word); }); return; }
        self.penyamunLines([['tokbatu17', done(self) ? X.batu.end : X.batu[6]]]);
        self.penyamun.exitPending = true;
      } };
      case 'penyamun_crack': return { label: s === 5 && !q.c17stop ? 'Send Pelita through the crack' : 'The thin crack', fn: function () {
        if (s === 5 && !q.c17stop) { self.penyamunCrack(); return; }
        self.penyamunLines(X.crackAfter);
      } };
      case 'penyamun_chalk': return { label: 'Read the chalk wall', fn: function () { self.penyamunClue('chalk', X.chalk); } };
      case 'penyamun_list': return { label: 'Read the shopping list', fn: function () { self.penyamunClue('list', X.list); } };
      case 'penyamun_pile': return { label: 'The stolen things', fn: function () { self.penyamunLines(X.pile); } };
      case 'penyamun_wheel': return { label: 'Pick up the wooden wheel', fn: function () {
        LC.State.add('roda_rahsia', 1);
        self.refreshWhen();
        LC.Audio.sfx('chime');
        self.penyamunClue('roda', X.wheel);
      } };
      case 'penyamun_diary': return { label: flags(this, 'c17clue').diari ? 'Read Kopak\'s diary' : LC.State.count('roda_rahsia') ? 'Decode Kopak\'s diary' : 'Kopak\'s diary', fn: function () {
        if (flags(self, 'c17clue').diari) { self.penyamunLines(X.diaryRead); return; }
        if (!LC.State.count('roda_rahsia')) { self.penyamunLines(X.diaryLocked); return; }
        self.ui.openDiari17(function () { self.penyamunClue('diari', X.diaryRead); });
      } };
      case 'penyamun_jar': return this.penyamunJarAction(o);
      case 'penyamun_saudagar': return { label: 'Talk to Datuk Saudagar', fn: function () { self.penyamunLines([['saudagar17', X.saudagar]]); } };
      case 'penyamun_caught': return { label: 'Look', fn: function () { self.toast(X.caughtLook[o.who], 'jaring17_' + o.who); } };
      case 'penyamun_peronda': return { label: 'Talk to ' + LC.SPEAKERS[o.who + '17'].name, fn: function () { self.penyamunLines([[o.who + '17', X.peronda[o.who]]]); } };
      default: return objectAction.apply(this, arguments);
    }
  };

  // Panglima Garong does not fall: he sits down and gives up
  var die = W.enemyDie;
  W.enemyDie = function (e) {
    if (!e || e.kind !== 'garong17') return die.apply(this, arguments);
    if (e.dead) return;
    e.dead = true; e.respawn = Infinity; e.light.base = 0; e.stoneT = 0;
    if (e.xpLife !== (e.life || 0) && this.killXp) { e.xpLife = e.life || 0; this.killXp(e); }
    this.S.stats.kills = (this.S.stats.kills || 0) + 1;
    var s = e.spr;
    if (s.anims.isPaused) s.anims.resume();
    s.anims.stop(); s.setTexture('npc17_garong_0').clearTint();
    this.tweens.add({ targets: s, angle: -12, y: s.y + 2, duration: 300 });
    this.fx.sparkle.explode(18, s.x, s.y - 18);
    this.ui.floatText(s.x, s.y - 26, X.giveUp, '#ffe8a0');
    LC.Audio.setBattle(false);
    this.penyamun.sitting = s;
    this.penyamunFinale();
  };
  // with Ali Baba's kapak in your bag, fallen branches give twice the wood
  var forage = W.forage;
  W.forage = function (o) {
    var before = LC.State.count('kayu'), r = forage.apply(this, arguments);
    if (o && o.kind === 'branches' && done(this) && LC.State.count('kapak_alibaba') && LC.State.count('kayu') > before) {
      var extra = LC.State.count('kayu') - before;
      if (LC.State.add('kayu', extra)) this.ui.floatText(this.player.x, this.player.y - 30, '+' + extra + ' Kayu (Kapak Ali Baba)', '#ffe8a0');
    }
    return r;
  };
  // v3.17.2: while a story Tok Penghulu waits somewhere in the kampung (Chapters 15 to 17), the everyday one is away from
  // his house, so there is only one of him. Chapter 15 already did this for its own scenes; 16 and 17 did not.
  var standIns = LC.AREAS.kampung.objects.filter(function (o) { return o.tex === 'npc_penghulu_0' && o.when; });
  var away = W.jerebuAway;
  W.jerebuAway = function (vid) {
    if (away && away.apply(this, arguments)) return true;
    if (vid !== 'penghulu' || this.area !== 'kampung') return false;
    var S = this.S;
    return standIns.some(function (o) { return o.when(S); });
  };

  Object.assign(W, {
    penyamunLines: function (lines) { this.ui.say(lines.map(function (l) { return Object.assign({ text: l[1] }, LC.SPEAKERS[l[0]] || {}); })); },
    penyamunFollow: function () {   // glide back to the player, then follow again as usual
      var cam = this.cameras.main, p = this.player;
      cam.pan(p.x, p.y, 600, 'Sine.easeInOut', false, function (c, t) { if (t >= 1) c.startFollow(p, true, 0.2, 0.2); });
    },
    createPenyamun: function () {
      var S = this.S, s = step(this);
      this.penyamun = { born: this.time.now, cine: null, shoutT: 7, mistT: 1, boss: null, styled: {} };
      if (this.area === 'gua17' && s === 5 && !S.quests.c17in) this.penyamun.stuckPending = true;
      if (this.area === 'kampung' && s === 8) this.penyamunSpawnBoss(false);
      if (this.area === 'gua17' && done(this)) this.penyamunVault();
    },

    // ---------------------------------------------------------------- Ali Baba
    penyamunAli: function (o) {
      var S = this.S, q = S.quests, s = step(this);
      if (s === 2 && this.area === 'farm') { story(this, 3); this.refreshWhen(); this.penyamunLines(X.ali); return; }
      if (this.area === 'kapur') { this.penyamunLines([['alibaba17', X.aliKapur[s] || X.aliKapur[3]]]); return; }
      if (this.area === 'kampung') { this.penyamunLines([['alibaba17', X.aliKampung]]); return; }
      if (q.c17wood === S.day) { this.penyamunLines(X.aliTomorrow); return; }
      q.c17wood = S.day;
      var a = LC.State.add('kayu', 3), b = LC.State.add('bijan', 2);
      LC.State.save();
      LC.Audio.sfx('chime');
      this.penyamunLines(X.aliAfter.concat([['', (a || b) ? 'Ali Baba gives you ' + [a ? '3 Kayu' : '', b ? '2 Bijan' : ''].filter(Boolean).join(' and ') + '.' : 'Your bag is full! Make some room, and Ali Baba will save it for you tomorrow.']]));
      if (!a && !b) q.c17wood = 0;
      void o;
    },

    // ---------------------------------------------------------------- Bukit Kapur: the thieves at the cliff
    penyamunHide: function () {
      var self = this, c = this.penyamun.cine = { phase: 0, actors: [], t: 0 };
      story(this, 4);
      var bush = this.objImgs.kp_semak17, p = this.player;
      if (bush) { p.x = bush.x; p.y = bush.y - 3; }
      p.setAlpha(0.55);
      this.fx.sparkle.explode(6, p.x, p.y - 10);
      this.cameras.main.stopFollow();   // watch the cliff, not the bush
      this.cameras.main.pan(16.5 * T, 9.2 * T, 1200, 'Sine.easeInOut');
      var start = { x: 33.5 * T, y: 10 * T }, line = [0, 1, 2, 3];
      C.gang.forEach(function (who, i) {
        var a = self.add.sprite(start.x + i * 18, start.y, 'npc17_' + who + '_w1').setOrigin(0.5, 1).setDepth(start.y).setFlipX(true);
        a.play('npc17_' + who + '_walk');
        if (who === 'kecik') a.setScale(1.2);
        if (who === 'senget') a.setAngle(-10);
        c.actors.push(a);
        var tx = (15.2 + line[i] * 0.9) * T, ty = 8.4 * T;
        self.tweens.add({ targets: a, x: tx, y: ty, duration: 3600 + i * 220, onUpdate: function () { a.setDepth(a.y); },
          onComplete: function () { a.play('npc17_' + who + '_idle'); a.setFlipX(false); } });
      });
      var song = this.time.addEvent({ delay: 900, repeat: 3, callback: function () { var g = c.actors[0]; if (g && g.active) self.ui.floatText(g.x, g.y - 26, X.march, '#e8dcc0'); } });
      c.song = song;
      this.time.delayedCall(4400, function () { if (self.penyamun && self.penyamun.cine === c) { c.phase = 1; self.penyamunLines(X.gang1); } });
    },
    penyamunCine: function () {
      var c = this.penyamun.cine, self = this;
      if (!c || this.ui.isBlocking() || c.busy) return;
      var door = this.objImgs.kp_pintu17;
      if (c.phase === 1) {   // the mantera, and the rock rolls aside
        c.phase = 2; c.busy = true;
        var g = c.actors[0];
        if (g) { this.tweens.add({ targets: g, y: g.y - 4, duration: 140, yoyo: true, repeat: 2 }); this.ui.floatText(g.x, g.y - 30, X.chant, '#fff2b0'); }
        this.time.delayedCall(1300, function () {
          if (door) door.setTexture('pintu17_buka');
          LC.Audio.sfx('grind17'); self.cameras.main.shake(400, 0.003);
          if (door) self.fx.smoke.explode(10, door.x, door.y - 10);
          c.busy = false;
          self.penyamunLines(X.gang2);
        });
      } else if (c.phase === 2) {   // in they go...
        c.phase = 3; c.busy = true;
        var n = c.actors.length;
        c.actors.forEach(function (a, i) {
          self.tweens.add({ targets: a, x: 16.5 * T, y: 6.3 * T, alpha: 0, duration: 900, delay: i * 250, onComplete: function () {
            if (--n > 0) return;
            if (door) door.setTexture('pintu17_tutup');
            LC.Audio.sfx('slam17');
            self.time.delayedCall(1600, function () {   // ...and out again, empty-handed
              if (door) door.setTexture('pintu17_buka');
              LC.Audio.sfx('grind17');
              var m = c.actors.length;
              c.actors.forEach(function (b, k) {
                var who = C.gang[k];
                b.setTexture('npc17_' + who + '_0'); b.play('npc17_' + who + '_idle');
                b.setPosition(16.5 * T, 6.6 * T).setAlpha(0);
                self.tweens.add({ targets: b, alpha: 1, x: (15.2 + k * 0.9) * T, y: 8.6 * T, duration: 700, delay: k * 200, onUpdate: function () { b.setDepth(b.y); }, onComplete: function () {
                  if (--m > 0) return;
                  if (door) door.setTexture('pintu17_tutup');
                  LC.Audio.sfx('slam17');
                  c.busy = false;
                  self.penyamunLines(X.gang3);
                } });
              });
            });
          } });
        });
      } else if (c.phase === 3) {   // off they march, singing badly
        c.phase = 4; c.busy = true;
        var left = c.actors.length;
        c.actors.forEach(function (a, i) {
          var who = C.gang[i];
          a.play('npc17_' + who + '_walk');
          self.tweens.add({ targets: a, x: 34 * T + i * 18, y: 10 * T, duration: 3000 + i * 200, delay: i * 120, onUpdate: function () { a.setDepth(a.y); }, onComplete: function () {
            a.destroy();
            if (--left > 0) return;
            self.player.setAlpha(1);
            self.penyamun.cine = null;
            self.penyamunFollow();
            self.penyamunLines([['alibaba17', X.aliKapur[4]]]);
          } });
        });
        this.time.addEvent({ delay: 800, repeat: 2, callback: function () { var g = c.actors[0]; if (g && g.active) self.ui.floatText(g.x, g.y - 26, X.march, '#e8dcc0'); } });
      }
    },
    penyamunOpenDoor: function () {
      var door = this.objImgs.kp_pintu17;
      if (step(this) === 4) story(this, 5);
      this.S.quests.c17in = false;
      if (door) { door.setTexture('pintu17_buka'); this.fx.smoke.explode(10, door.x, door.y - 10); }
      LC.Audio.sfx('grind17'); this.cameras.main.shake(400, 0.003);
      this.penyamunLines(X.doorOpen);
      this.penyamun.enterPending = true;
    },

    // ---------------------------------------------------------------- stuck in the cave
    penyamunStuck: function () {
      var q = this.S.quests, d = this.objImgs.g17_pintu;
      q.c17in = true; LC.State.save();
      LC.Audio.sfx('slam17'); this.cameras.main.shake(500, 0.006);
      if (d) this.fx.smoke.explode(14, d.x, d.y - 8);
      this.penyamunLines(X.stuck);
      this.penyamun.shoutT = 6;
    },
    penyamunShout: function () {
      var q = this.S.quests, n = q.c17shouts || 0, d = this.objImgs.g17_pintu, self = this;
      q.c17shouts = n + 1;
      var x = d ? d.x : this.player.x, y = d ? d.y : this.player.y;
      this.ui.floatText(x + 18, y - 4, '(outside) ' + X.shouts[n % X.shouts.length], '#e8dcc0');
      this.time.delayedCall(900, function () {
        if (self.area !== 'gua17' || step(self) !== 5) return;
        self.ui.floatText(x, y - 30, X.wrong, '#ff9a8a');
        LC.Audio.sfx('error');
        self.penyamunSpend();
        if (n === 0) self.toast(X.shoutHint, 'celah17');
      });
    },
    penyamunSpend: function () {
      var q = this.S.quests, t = C.triesLeft(this.S) - 1;
      if (t > 0) { q.c17tries = t; LC.State.save(); this.toast('Tok Batu: "' + t + ' tr' + (t === 1 ? 'y' : 'ies') + ' left."', 'batu17_0'); return t; }
      q.c17tries = C.tries;
      this.S.minutes = Math.min(this.S.minutes + 60, 23 * 60);
      LC.State.save();
      var d = this.objImgs.g17_pintu;
      if (d) { d.setTexture('batu17_1'); this.time.delayedCall(2500, function () { if (d.active) d.setTexture('batu17_0'); }); this.ui.floatText(d.x, d.y - 30, 'Zzzzz...', '#d3cbf2'); }
      this.cameras.main.fadeOut(400, 0, 0, 0);
      var self = this;
      this.cameras.main.once('camerafadeoutcomplete', function () { self.cameras.main.fadeIn(600, 0, 0, 0); self.toast(X.nap, 'batu17_1'); });
      return 0;
    },
    penyamunCrack: function () {
      var q = this.S.quests, g = this.ghost, c = this.objImgs.g17_celah, self = this;
      q.c17stop = true; LC.State.save();
      if (g && c) {
        var gx = g.x, gy = g.y;
        this.tweens.add({ targets: g, x: c.x, y: c.y - 6, scale: 0.3, duration: 500, yoyo: true, hold: 900, onComplete: function () { g.setPosition(gx, gy).setScale(1); } });
        this.time.delayedCall(500, function () { if (c.active) self.fx.sparkle.explode(10, c.x, c.y - 8); });
      }
      this.penyamunLines(X.crack);
    },
    penyamunClue: function (what, lines) {
      var clue = flags(this, 'c17clue'), had = !!clue[what];
      clue[what] = true;
      LC.State.save();
      var n = C.count(this.S, 'c17clue');
      this.penyamunLines(lines.concat(had ? [] : [['', n >= 4 ? 'You have every clue. Now encrypt today\'s word, and give it to Tok Batu.' : '(Clues: ' + n + ' / 4.)']]));
    },
    // the code from the stone dial (UIPenyamun.js): returns what Tok Batu says, and whether the door opens
    penyamunTry: function (word) {
      word = String(word || '').toUpperCase().replace(/[^A-Z]/g, '');
      if (!word) return { msg: 'Tok Batu waits. He is very good at waiting.' };
      if (word === C.code) {
        story(this, 6);
        var d = this.objImgs.g17_pintu;
        LC.Audio.sfx('grind17'); this.cameras.main.shake(500, 0.004);
        if (d) this.fx.sparkle.explode(20, d.x, d.y - 10);
        this.cameras.main.flash(500, 255, 240, 200);
        this.penyamun.freePending = true;
        return { ok: true, msg: 'H... S... H... S... P. Hush-hush. Clever!' };
      }
      if (word === C.word) return { msg: X.plain };
      if (word === 'BIJAN' || word === 'FMNER' || /^NIAT/.test(word)) return { msg: X.outside };
      if (word === C.shift(C.word, 40)) return { msg: X.forty };
      var t = this.penyamunSpend();
      return { msg: X.wrong + (t > 0 ? ' ' + t + ' tr' + (t === 1 ? 'y' : 'ies') + ' left.' : ' Three wrong! Zzzz...'), nap: t === 0 };
    },
    penyamunVault: function () {   // the cave's big chest, kept safe by Tok Batu
      var S = this.S;
      S.chests = S.chests || {};
      if (S.chests.gua17) return;
      S.chests.gua17 = { area: 'gua17', x: 19, y: 7, kind: 'peti_ukir', items: [], fixed: true };
      LC.State.save();
      if (this.refreshChests) this.refreshChests();
    },

    // ---------------------------------------------------------------- the twelve jars
    penyamunJarAction: function (o) {
      var self = this, i = o.i, who = C.thief[i], tap = flags(this, 'c17tap');
      if (step(this) !== 7) return null;
      if (!tap[i]) return { label: 'Tap the jar', fn: function () {
        tap[i] = true; LC.State.save();
        LC.Audio.sfx(who ? 'ssst17' : 'knock17');
        var im = self.objImgs[o.id];
        if (im) { self.tweens.add({ targets: im, x: im.x + 1.5, duration: 50, yoyo: true, repeat: 2 }); self.ui.floatText(im.x, im.y - 22, who ? X.ssst : 'tok tok', who ? '#ffe8a0' : '#e8dcc0'); }
        if (!who) self.toast(X.honey, 'tempayan17');
      } };
      if (!who) return { label: 'A jar of honey', fn: function () { self.toast(X.honey, 'tempayan17'); } };
      return { label: X.lid, fn: function () { self.penyamunCatch(o); } };
    },
    penyamunCatch: function (o) {
      var who = C.thief[o.i], caught = flags(this, 'c17caught'), im = this.objImgs[o.id], self = this;
      caught[who] = true;
      var n = Object.keys(caught).length;
      if (n >= 3) story(this, 8); else LC.State.save();
      LC.Audio.sfx('net17');
      if (im) {
        var a = this.add.sprite(im.x, im.y - 4, 'npc17_' + who + '_0').setOrigin(0.5, 1).setDepth(im.y + 1);
        if (who === 'kecik') a.setScale(1.2);
        this.tweens.add({ targets: a, y: a.y - 18, duration: 220, yoyo: true, onComplete: function () { self.tweens.add({ targets: a, alpha: 0, duration: 300, onComplete: function () { a.destroy(); } }); } });
        this.fx.smoke.explode(8, im.x, im.y - 12);
      }
      this.refreshWhen();
      this.penyamunLines(X.caught[who].concat(n >= 3 ? X.reveal : [['', '(Thieves caught: ' + n + ' / 3.)']]));
      if (n >= 3) this.penyamun.bossPending = true;
    },
    penyamunSpawnBoss: function (fresh) {
      if (this.area !== 'kampung' || (this.penyamun.boss && !this.penyamun.boss.dead)) return;
      var e = this.penyamun.boss = this.spawnEnemy({ kind: 'garong17', zone: C.arena }, true);
      var at = this.tilePx({ x: 21, y: 22 });
      e.spr.setPosition(at.x, at.y).setDepth(at.y).setVisible(true).setAlpha(fresh ? 0.3 : 1);
      e.tx = at.x; e.ty = at.y;
      if (fresh) { this.tweens.add({ targets: e.spr, alpha: 1, duration: 450 }); this.fx.smoke.explode(12, at.x, at.y - 10); }
      this.toast('Panglima Garong wants a duel! Hold a weapon and press USE to swing.', 'npc17_garong_0');
    },
    penyamunFinale: function () {
      var S = this.S, gotK = LC.State.add('kapak_alibaba', 1), gotB = LC.State.add('bijan', 10);
      story(this, C.end);   // (the rewards first, so closing the story early never loses them)
      if (!LC.State.count('roda_rahsia')) LC.State.add('roda_rahsia', 1);
      S.kepeng += 1000;
      LC.penyamunRecipe(S);
      LC.State.save();
      if (!gotK || !gotB) this.toast('Your bag was full! Ali Baba will keep the rest for you: make room and talk to him at the farm.', 'i_kapak_alibaba');
      if (!gotK) S.quests.c17owe = true;
      this.cameras.main.flash(600, 255, 240, 200);
      LC.Audio.sfx('cheer');
      this.penyamun.finalePending = true;
      this.penyamunLines(X.finale);
    },

    // ---------------------------------------------------------------- every frame
    updatePenyamun: function (time, dt) {
      var m = this.penyamun, S = this.S, q = S.quests, s = step(this), self = this;
      if (!m) return;
      var blocked = this.ui.isBlocking() || this.leaving || this.sleeping;
      // the chapter begins the day after Chapter 16 ends
      if (s === 0 && C.ready(S) && !blocked) {
        if (q.c17wait === undefined) { q.c17wait = S.day; LC.State.save(); }
        else if (S.day > q.c17wait) { story(this, 1); this.refreshWhen(); this.toast(X.start, 'npc_penghulu_0'); }
      }
      // the gang's look: Kecik is the biggest, Senget always leans
      ['k_peronda17_kecik', 'k_peronda17_senget', 'k_jaring17_kecik'].forEach(function (id) {
        var im = self.objImgs && self.objImgs[id];
        if (!im || m.styled[id] === im) return;
        m.styled[id] = im;
        if (/kecik/.test(id)) im.setScale(1.2); else im.setAngle(-10);
      });
      if (m.cine) { this.penyamunCine(); return; }
      if (blocked) return;
      if (m.enterPending) { m.enterPending = false; this.goArea('gua17', this.tilePx({ x: 14, y: 18 }), 'up'); return; }
      if (m.exitPending || m.freePending) { m.exitPending = m.freePending = false; this.goArea('kapur', this.tilePx(C.door), 'down'); return; }
      if (m.stuckPending && time - m.born > 700) { m.stuckPending = false; this.penyamunStuck(); return; }
      if (m.merchantPending) {
        m.merchantPending = false;
        this.refreshWhen();
        var me = this.objImgs.k_saudagar17;
        if (me) { this.fx.smoke.explode(10, me.x, me.y - 10); this.cameras.main.stopFollow(); this.cameras.main.pan(me.x, me.y - 8, 500, 'Sine.easeInOut'); this.penyamun.followPending = true; }
        LC.Audio.sfx('chime');
        this.penyamunLines(X.merchant);
        return;
      }
      if (m.followPending) { m.followPending = false; this.penyamunFollow(); }
      if (m.bossPending) { m.bossPending = false; this.refreshWhen(); this.penyamunSpawnBoss(true); return; }
      if (m.finalePending) {
        m.finalePending = false;
        if (m.sitting) { var sp = m.sitting; this.tweens.add({ targets: sp, alpha: 0, duration: 600, onComplete: function () { sp.setVisible(false).setAngle(0); } }); m.sitting = null; }
        this.refreshWhen();
      }
      // in the cave: Ali Baba "helps" from outside, until Pelita stops him
      if (this.area === 'gua17' && s === 5 && q.c17in && !q.c17stop && (q.c17shouts || 0) < 6) {
        if ((m.shoutT -= dt) <= 0) { m.shoutT = 14; this.penyamunShout(); }
      }
      // the jars: Pelita's glow shows a hidden thief's breath
      if (this.area === 'kampung' && s === 7 && (m.mistT -= dt) <= 0) {
        m.mistT = 1.6;
        var g = this.ghost, caught = q.c17caught || {};
        Object.keys(C.thief).forEach(function (i) {
          var im = self.objImgs['k_jar17_' + i];
          if (!im || caught[C.thief[i]] || !g || Math.hypot(g.x - im.x, g.y - (im.y - 12)) > 46) return;
          var puff = self.add.image(im.x + (Math.random() - 0.5) * 4, im.y - 20, 'glow').setTint(0xe8f4ff).setAlpha(0.6).setScale(0.12).setDepth(im.y + 2).setBlendMode(Phaser.BlendModes.ADD);
          self.tweens.add({ targets: puff, y: puff.y - 10, alpha: 0, scale: 0.22, duration: 1100, onComplete: function () { puff.destroy(); } });
        });
      }
      // a bag that was full at the end: Ali Baba still has your kapak
      if (q.c17owe && this.area === 'farm' && LC.State.add('kapak_alibaba', 1)) { q.c17owe = false; LC.State.save(); this.toast('Ali Baba left his kapak in your bag.', 'i_kapak_alibaba'); }
    }
  });
})(window.LC);
