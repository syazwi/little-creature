/* World, part 5 (v1.6): guiding Si Tanggang home. Once the captain's ghost is at peace, he asks you to take him to
 * his mother, whose ghost waits on the beach of Pulau Mutiara. He follows you out of the sunken junk, through
 * Kampung Karang (where shadows of the old curse try to drag him back) and up to the island. When mother and son
 * meet, the curse breaks: both live again, move to Kampung Tepian, and Mak Deruma gives you Restu Ibu.
 * If you faint, or the night ends, he is pulled back to his ship and you can try again. Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var DIRV = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] };
  var WHO = {
    tanggang: ['Si Tanggang', 'npc_tanggang_0'], deruma: ['Mak Deruma', 'npc_deruma_0'],
    tanggangH: ['Si Tanggang', 'npc_tanggangH_0'], derumaH: ['Mak Deruma', 'npc_derumaH_0']
  };
  // story lines written as { who, text } become dialogue lines with a name and portrait
  LC.storyLines = function (arr) {
    return arr.map(function (l) { var w = l.who && WHO[l.who]; return w ? { name: w[0], portrait: w[1], text: l.text } : { text: l.text }; });
  };

  Object.assign(LC.WorldScene.prototype, {
    createTanggang: function () {
      this.escortSpr = null; this.reuniting = false;
      if (this.S.escort) this.makeEscort();
    },
    makeEscort: function () {
      var p = this.player;
      this.epos = { x: p.x + 16, y: p.y + 4 };
      this.escortGlow = this.add.image(this.epos.x, this.epos.y - 10, 'glow').setBlendMode(Phaser.BlendModes.ADD).setDepth(9001).setTint(0x8fd3ff).setScale(0.8).setAlpha(0.45);
      this.escortSpr = this.add.sprite(this.epos.x, this.epos.y, 'npc_tanggang_0').setOrigin(0.5, 1).setDepth(9002).setAlpha(0.88);
      this.escortSpr.play('npc_tanggang_idle');
    },
    // the player agreed (from Si Tanggang's Talk menu)
    startEscort: function () {
      var S = this.S, n = this.npcs.tanggang;
      S.escort = 'tanggang'; S.quests.tanggang = 3;
      if (n) {
        if (n.here) { this.solid[n.ty][n.tx] = false; this.objAt[n.ty][n.tx] = null; }
        this.fx.sparkle.explode(10, n.spr.x, n.spr.y - 10);
        n.spr.destroy(); if (n.glow) n.glow.destroy();
        delete this.npcs.tanggang;
      }
      this.makeEscort();
      if (this.checkGroups) this.checkGroups();
      LC.Audio.sfx('chime');
      this.toast('Si Tanggang follows you. Take him to Mak Deruma on the beach of Pulau Mutiara (swim up from Kampung Karang).', 'ic_glow');
    },
    updateTanggang: function (time, dt, blocked) {
      if (!this.escortSpr) return;
      var p = this.player, d = DIRV[this.dir] || DIRV.down, tx = p.x - d[0] * 20 + (d[0] === 0 ? 16 : 0), ty = p.y - d[1] * 16 + 4, k = Math.min(1, dt * 2.4);
      if (this.reuniting) return;
      this.epos.x += (tx - this.epos.x) * k; this.epos.y += (ty - this.epos.y) * k;
      var y = Math.round(this.epos.y + Math.sin(time / 380) * 2), tug = this.enemyNear && this.enemyNear(60);
      this.escortSpr.setPosition(Math.round(this.epos.x + (tug ? Math.sin(time / 30) : 0)), y).setFlipX(this.epos.x > p.x).setAlpha(tug ? 0.55 + 0.3 * Math.abs(Math.sin(time / 90)) : 0.88);
      this.escortGlow.setPosition(this.escortSpr.x, y - 10).setAlpha(0.25 + (this.nightF || 0) * 0.35);
      if (!blocked && this.area === 'island') {
        var m = this.npcs.deruma;
        if (m && Math.hypot(p.x - m.spr.x, p.y - m.spr.y) < 44) this.reunion();
      }
    },

    // ---------------------------------------------------------------- mother and son
    reunion: function () {
      var self = this, S = this.S, m = this.npcs.deruma, t = this.escortSpr, L = LC.TANGGANG.reunion;
      if (this.reuniting || !m || !t) return;
      this.reuniting = true;
      this.ui.closeModal();
      LC.Audio.setBattle(false);
      (this.enemies || []).forEach(function (e) { if (!e.dead && !e.away) self.stoneEnemy(e, 30); });   // the world holds its breath
      LC.Audio.sfx('reunion');
      this.tweens.add({ targets: t, x: m.spr.x - 14, y: m.spr.y, duration: 1400, ease: 'Sine.easeInOut' });
      this.tweens.add({ targets: this.escortGlow, x: m.spr.x - 14, y: m.spr.y - 10, duration: 1400, ease: 'Sine.easeInOut' });
      t.setFlipX(false); m.spr.setFlipX(true);
      this.time.delayedCall(1500, function () {
        self.ui.say(LC.storyLines(L.slice(0, 5)), { onDone: function () { self.breakCurse(m, t, L); } });
      });
    },
    breakCurse: function (m, t, L) {
      var self = this, x = (m.spr.x + t.x) / 2, y = m.spr.y;
      LC.Audio.sfx('restu');
      this.cameras.main.flash(900, 255, 240, 200);
      var col = this.add.image(x, y - 24, 'glow').setDepth(9600).setTint(0xffe8b0).setBlendMode(Phaser.BlendModes.ADD).setScale(1, 4).setAlpha(0);
      this.tweens.add({ targets: col, alpha: 1, duration: 700, yoyo: true, hold: 600, onComplete: function () { col.destroy(); } });
      this.fx.sparkle.explode(40, x, y - 12); this.fx.heart.explode(8, x, y - 18); this.fx.petal.explode(12, x, y - 30);
      this.time.delayedCall(800, function () {
        [m.spr, t].forEach(function (s) { self.tweens.killTweensOf(s); s.anims.stop(); s.setAlpha(1).setDepth(y); });
        m.spr.setTexture('npc_derumaH_0').play('npc_derumaH_idle'); t.setTexture('npc_tanggangH_0').play('npc_tanggangH_idle');
        m.spr.y = y; t.y = y;
        if (m.glow) m.glow.destroy();
        self.escortGlow.destroy();
      });
      this.time.delayedCall(1900, function () {
        self.ui.say(LC.storyLines(L.slice(5)), { onDone: function () { self.finishReunion(m, t); } });
      });
    },
    finishReunion: function (m, t) {
      var self = this, S = this.S;
      S.quests.tanggang = 4; S.escort = null; S.restuDay = 0;
      LC.State.folk('deruma').met = true;
      LC.State.recalc();
      this.doShared('kind', { n: 15 }, function (res) { if (res && res.ok) self.toast('Pelita glows with joy for them. (+' + res.b + ' bond)', 'ic_bond'); });
      this.toast('Si Tanggang and Mak Deruma now live in Kampung Tepian, by the river. Visit them!', 'ic_restu');
      // they push the old sampan into the waves and row away home together
      this.time.delayedCall(600, function () {
        [m.spr, t].forEach(function (s) { self.fx.sparkle.explode(8, s.x, s.y - 10); });
        self.tweens.add({ targets: [m.spr, t], alpha: 0, y: '+=6', duration: 1600, onComplete: function () {
          m.spr.destroy(); t.destroy();
          if (self.npcs.deruma) { var n = self.npcs.deruma; if (n.here) { self.solid[n.ty][n.tx] = false; self.objAt[n.ty][n.tx] = null; } delete self.npcs.deruma; }
          self.escortSpr = null; self.reuniting = false;
          (self.enemies || []).forEach(function (e) { if (e.stoneT > 0) e.stoneT = 1.5; });
        } });
      });
    }
  });
})(window.LC);
