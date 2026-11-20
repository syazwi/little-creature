/* World, part 9 (v2.0): Chapter 3, Kampong Ayer (part 1). The water village growing stage by stage, the house plots,
 * the padian traders, the cockfight scene (Asmara becomes Pulau Pilong-Pilongan, Mutiara becomes Lumut Lunting),
 * Teluk Barunai's boats, the stone rooster, and the ghost of Asmara. Personal to each player. Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var T = 16;
  function Q() { return LC.State.s.quests; }
  function isNight(S) { return S.minutes >= 19 * 60 || S.minutes < 6 * 60; }
  function marketOpen(S) { return S.minutes >= 6 * 60 && S.minutes < 14 * 60; }

  Object.assign(LC.WorldScene.prototype, {
    createKampong: function () {
      this.ka = { padian: [], market: null, ghost: null, tick: 0 };
      if (this.area === 'barunai') { this.refreshKPlots(); this.refreshPadian(); }
    },
    updateKampong: function (time, dt) {
      var k = this.ka, S = this.S;
      if (!k) return;
      if ((k.tick -= dt) <= 0) {
        k.tick = 1;
        if (this.area === 'barunai' && (LC.kaStage() >= 2 && marketOpen(S)) !== k.market) this.refreshPadian();
        if (this.area === 'teluk') {
          var want = isNight(S) && LC.ch3Step() === 7;
          if (want && !k.ghost) this.makeGhostAyam(); else if (!want && k.ghost) this.removeGhostAyam();
        }
      }
      if (k.ghost) {
        k.ghost.spr.y = k.ghost.y0 - 2 + Math.round(Math.sin(time / 420) * 2);
        k.ghost.glow.setPosition(k.ghost.spr.x, k.ghost.spr.y - 8).setAlpha(0.35 + 0.2 * Math.sin(time / 500));
        if ((k.ghost.cry -= dt) <= 0) { k.ghost.cry = 5 + Math.random() * 4; if (Math.hypot(this.player.x - k.ghost.spr.x, this.player.y - k.ghost.spr.y) < 180) this.ui.floatText(k.ghost.spr.x, k.ghost.spr.y - 20, 'kukuruyuk...', '#bfe6ff'); }
      }
    },

    // ---------------------------------------------------------------- the village grows (walkways, workshops, pilings)
    // a new stage (or the fleet) changes who and what is in Barunai: reload the place around the player
    applyKampong: function () {
      LC.syncBarunai();
      if (this.area !== 'barunai') return;
      this.cameras.main.shake(300, 0.003);
      this.fx.smoke.explode(20, this.player.x, this.player.y - 20);
      this.goArea('barunai', { x: this.player.x, y: this.player.y }, this.dir);
    },
    // across the water in the same place (the water taxi, the little boats in the bay)
    hopTo: function (t, dir) {
      var self = this, p = this.tilePx(t);
      if (this.leaving || this.hopping) return;
      this.ui.closeModal(); this.hopping = this.cutscene = true;
      this.cameras.main.fadeOut(250, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', function () {
        self.player.setPosition(p.x, p.y); if (dir) self.dir = dir;
        if (self.ghost && self.ghost.setPosition) self.ghost.setPosition(p.x, p.y - 20);
        self.cameras.main.fadeIn(300, 0, 0, 0);
        self.hopping = self.cutscene = false;
      });
    },
    npcLeave: function (vid) {
      var n = this.npcs[vid];
      if (!n) return;
      if (n.here) { this.solid[n.ty][n.tx] = false; this.objAt[n.ty][n.tx] = null; }
      this.tweens.add({ targets: n.spr, alpha: 0, duration: 900, onComplete: function () { n.spr.destroy(); } });
      delete this.npcs[vid];
    },
    refreshKPlots: function () {
      var self = this, plots = (LC.worldQuests ? LC.worldQuests() : Q()).kaPlots || {};   // (v2.7.1: in co-op, friends' houses show too)
      LC.KA_PLOTS.forEach(function (p) { var im = self.objImgs[p.id]; if (im) im.setTexture(plots[p.id] || 'tiang_kosong'); });
    },

    // ---------------------------------------------------------------- the padian: traders in boats, every morning
    refreshPadian: function () {
      var self = this, k = this.ka, S = this.S;
      k.padian.forEach(function (b) { b.spr.destroy(); if (self.objAt[b.y][b.x] === b.o) self.objAt[b.y][b.x] = null; });
      k.padian = [];
      k.market = LC.kaStage() >= 2 && marketOpen(S);
      if (!k.market || this.area !== 'barunai') return;
      LC.PADIAN.forEach(function (at, i) {
        var x = at.x * T + 8, y = (at.y + 1) * T, spr = self.add.sprite(x, y, 'padian_0').setOrigin(0.5, 1).setDepth(y - 6);
        spr.play('padian_idle');
        self.tweens.add({ targets: spr, y: y - 1, duration: 1100 + i * 200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        var o = { type: 'padian', i: i };
        self.objAt[at.y][at.x] = o;
        k.padian.push({ spr: spr, x: at.x, y: at.y, o: o });
      });
    },

    // ---------------------------------------------------------------- objects of Chapter 3
    kampongObjAction: function (o) {
      var self = this, S = this.S, q = Q();
      switch (o.type) {
        case 'kplot': {
          var built = (q.kaPlots || {})[o.id];
          return { label: built ? 'Your house over the river' : 'Empty pilings: build a house', fn: function () { self.ui.openKPlot(o.id); } };
        }
        case 'padian': return { label: 'Buy from the padian', fn: function () { self.ui.openPadian(o.i); } };
        case 'hop': return { label: o.label, fn: function () { LC.Audio.sfx('water'); self.hopTo(o.to, o.dir); } };
        case 'ghost_ayam': return { label: 'Approach the ghost rooster', fn: function () { self.ghostAyam(); } };
        case 'batu_ayam': return { label: 'The stone rooster', fn: function () {
          var lines = [{ text: LC.CH3TEXT.stone }];
          if (LC.ch3Step() >= 7 && !q.buluMutiara) {
            if (!LC.State.add('bulu_mutiara', 1)) { self.toast('Your bag is full!'); return; }
            q.buluMutiara = 1; LC.Audio.sfx('chime');
            lines.push({ text: LC.CH3TEXT.stoneFeather });
          }
          self.ui.say(lines);
        } };
      }
      return undefined;
    },

    // ---------------------------------------------------------------- the ghost of Asmara (Pulau Pilong-Pilongan, at night)
    makeGhostAyam: function () {
      var at = LC.GHOST_SPOT, x = at.x * T + 8, y = (at.y + 1) * T - 2, o = { type: 'ghost_ayam' };
      var glow = this.add.image(x, y - 8, 'glow').setBlendMode(Phaser.BlendModes.ADD).setDepth(9001).setTint(0x9ae8ff).setScale(0.7).setAlpha(0.5);
      var spr = this.add.image(x, y, 'asmara_ghost').setOrigin(0.5, 1).setDepth(9002).setAlpha(0.85).setFlipX(true);
      this.ka.ghost = { spr: spr, glow: glow, y0: y, cry: 2, o: o, was: this.solid[at.y][at.x] };
      this.solid[at.y][at.x] = true; this.objAt[at.y][at.x] = o;
    },
    removeGhostAyam: function () {
      var g = this.ka.ghost, at = LC.GHOST_SPOT;
      if (!g) return;
      g.spr.destroy(); g.glow.destroy();
      if (this.objAt[at.y][at.x] === g.o) { this.solid[at.y][at.x] = g.was; this.objAt[at.y][at.x] = null; }
      this.ka.ghost = null;
    },
    ghostAyam: function () {
      var self = this, q = Q(), g = this.ka.ghost, plate = LC.State.count('pinggan_emas') > 0, feather = LC.State.count('bulu_mutiara') > 0;
      if (!plate || !feather) {
        var need = [!plate ? 'a golden plate (Awang Kilau the goldsmith makes them)' : null, !feather ? 'something of Mutiara\'s (the stone rooster of Lumut Lunting)' : null].filter(Boolean).join(' and ');
        this.ui.say([{ text: LC.CH3TEXT.ghostHint }, { text: 'Perhaps it would rest if you brought ' + need + '.' }]);
        return;
      }
      LC.State.remove('pinggan_emas', 1); LC.State.remove('bulu_mutiara', 1);
      LC.Audio.sfx('restu');
      this.ui.say(LC.CH3TEXT.peace.slice(0, 2), { onDone: function () {
        LC.Audio.sfx('stage');
        if (g) {
          g.spr.setTint(0xffe08a); g.glow.setTint(0xffd166);
          self.fx.sparkle.explode(30, g.spr.x, g.spr.y - 10);
          self.tweens.add({ targets: [g.spr, g.glow], y: '-=60', alpha: 0, duration: 1800, ease: 'Sine.easeIn', onComplete: function () { self.removeGhostAyam(); } });
        }
        q.ch3 = 8; q.asmara = 1; LC.State.recalc();
        self.doShared('kind', { n: 12 }, function (res) { if (res && res.ok) self.toast('Pelita glows softly. (+' + res.b + ' bond)', 'ic_bond'); });
        self.time.delayedCall(1200, function () { self.ui.say(LC.CH3TEXT.peace.slice(2)); });
      } });
    },

    // ---------------------------------------------------------------- the great cockfight (Barunai, by the river)
    cockfight: function () {
      var self = this, CH = LC.CH3TEXT, cx = 29 * T + 8, cy = 14 * T + 10;
      this.cutscene = true; this.ui.closeModal();
      var stand = this.tilePx({ x: 30, y: 13 }); this.player.setPosition(stand.x, stand.y); this.dir = 'down';
      this.cameras.main.flash(300, 0, 0, 0);
      var ring = this.add.graphics().setDepth(cy - 20); ring.lineStyle(2, 0xf2e6c8, 0.9); ring.strokeEllipse(cx, cy, 70, 26);
      var mut = this.add.sprite(cx - 18, cy + 4, 'mutiara_0').setOrigin(0.5, 1).setDepth(cy + 4).play('mutiara_idle');
      var asm = this.add.sprite(cx + 18, cy + 4, 'asmara_0').setOrigin(0.5, 1).setDepth(cy + 4).setFlipX(true).play('asmara_idle');
      function cleanup() { ring.destroy(); mut.destroy(); asm.destroy(); }
      function bout() {
        self.ui.openCockfight(function (win) {
          if (win === null) { cleanup(); self.cutscene = false; self.toast('The crowd waits patiently. Talk to Awang Senuai when you are ready.', 'ic_glow'); return; }
          if (!win) { self.ui.say([{ text: 'Mutiara stumbles in the sand, but he is not beaten. The king nods: one more bout!' }], { onDone: bout }); return; }
          LC.Audio.sfx('crow'); LC.Audio.sfx('cheer');
          self.tweens.add({ targets: asm, x: 46 * T, y: 31 * T, scale: 0.4, duration: 1800, ease: 'Quad.easeIn' });
          self.tweens.add({ targets: mut, x: cx + 30, y: 15 * T + 12, duration: 900 });
          self.time.delayedCall(1900, function () {
            self.ui.say(self.ch2Lines(CH.won.slice(0, 2)), { onDone: function () {
              self.cameras.main.flash(600, 220, 240, 255); self.cameras.main.shake(500, 0.004); LC.Audio.sfx('splash');
              self.ui.say(self.ch2Lines(CH.won.slice(2, 4)), { onDone: function () {
                LC.Audio.sfx('stone');
                mut.anims.stop(); mut.setTint(0x9a96a0);
                self.fx.pebble.explode(14, mut.x, mut.y - 8);
                self.tweens.add({ targets: mut, x: 2 * T, y: 16 * T, alpha: 0, duration: 2200, delay: 600 });
                self.time.delayedCall(1200, function () {
                  self.ui.say(self.ch2Lines(CH.won.slice(4)), { onDone: function () {
                    var S = self.S, q = Q();
                    q.ch3 = 7; S.kepeng += 3000; S.stats.earned += 3000; LC.State.add('emas', 3); LC.State.add('kain_tenun', 2);
                    self.doShared('kind', { n: 15 }, function () {});
                    cleanup(); self.refreshWhen(); self.npcLeave('raden'); self.cutscene = false;
                    self.toast('A perahu waits at the west jetty: row out to Teluk Barunai.', 'ic_glow');
                  } });
                });
              } });
            } });
          });
        });
      }
      this.time.delayedCall(600, function () { self.ui.say(self.ch2Lines(CH.fight), { onDone: bout }); });
    }
  });
  // Chapter 3's speakers (the King of Majapahit, Awang Senuai...) use their own names and portraits
  var ch2Lines = LC.WorldScene.prototype.ch2Lines;
  LC.WorldScene.prototype.ch2Lines = function (arr) {
    return ch2Lines.call(this, arr).map(function (l, i) {
      var w = arr[i].who;
      if (w && l.name === w && LC.VILLAGERS[w]) l.name = LC.VILLAGERS[w].name;
      return l;
    });
  };
})(window.LC);
