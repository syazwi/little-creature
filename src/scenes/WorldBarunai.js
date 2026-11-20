/* World, part 8 (v1.9): Chapter 2, Barunai. Nenek's second letter, the tembadau's hoofprints, "Baru nah!" (the
 * founding scene that raises the water village), the pinggai bird's feathers, the princess's sunken chest, the magic
 * tempayan on quiet nights, and Langkah Semaun (a dash). The story is personal to each player. Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var T = 16;
  var DIRV = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] };
  function isNight(S) { return S.minutes >= 19 * 60 || S.minutes < 6 * 60; }
  function Q() { return LC.State.s.quests; }

  Object.assign(LC.WorldScene.prototype, {
    createBarunai: function () {
      this.ch2 = { marker: null, temb: null, bird: null, ship: null, vase: null, letterCheck: 2 };
      if (this.area === 'barunai') this.refreshBarunai();
    },
    updateBarunai: function (time, dt, blocked) {
      var c = this.ch2, S = this.S;
      if (!c) return;
      // Chapter 1 ends: Nenek's second letter (once Pelita is a Legend of the Kampung)
      if (!blocked && this.area === 'farm' && LC.ch2Step() < 1 && LC.State.level() >= LC.LEGEND_LEVEL && (c.letterCheck -= dt) <= 0) { c.letterCheck = 2; this.showLetter(); }
      if (this.area !== 'barunai') return;
      // the magic tempayan, on some quiet nights
      if (LC.ch2Founded()) {
        var q = Q(), want = isNight(S) && q.vaseDay !== S.day;
        if (want && (!q.vaseRoll || q.vaseRoll.day !== S.day)) q.vaseRoll = { day: S.day, show: Math.random() < 0.5 };
        want = want && q.vaseRoll && q.vaseRoll.show;
        if (want && !c.vase) this.placeThing('vase', LC.CH2.vase, 'tempayan_ajaib', { glow: 0xffd8a0, bob: true });
        else if (!want && c.vase) this.removeThing('vase');
      }
      if (c.vase) { c.vase.spr.y = c.vase.y0 + Math.round(Math.sin(time / 500) * 2); c.vase.glow.setAlpha(0.45 + 0.25 * Math.sin(time / 400)); }
    },

    // ---------------------------------------------------------------- Nenek's second letter
    showLetter: function () {
      var self = this, S = this.S;
      if (this.ui.isBlocking() || this.sleeping || this.leaving) return;
      Q().ch2 = 1;
      LC.Audio.sfx('stage');
      this.refreshWhen();   // her perahu appears at the jetty
      this.ui.say(LC.CH2TEXT.letter, { onDone: function () { self.toast('Chapter 2: Barunai. Take Nenek\'s perahu at the farm jetty.', 'ic_glow'); } });
    },

    // ---------------------------------------------------------------- things that come and go (the boat, the houses, the Balai)
    refreshWhen: function () {
      var self = this, S = this.S;
      this.objects.forEach(function (o) {
        if (!o.when || !o.id) return;
        var on = o.when(o.shared && LC.worldS ? LC.worldS() : S), im = self.objImgs[o.id], w = o.w || 1, h = o.h || 1;
        if (on && !im) {
          var bx = (o.x + w / 2) * T, by = (o.y + h) * T;
          im = self.objImgs[o.id] = o.type === 'sampan' ? self.add.image(bx, by - 2, 'sampan').setOrigin(0.5, 1).setDepth(by - 8) : self.add.image(bx, by, o.tex).setOrigin(0.5, 1).setDepth(by);
          if (o.type === 'sampan') self.boats.push({ spr: im, y0: by - 2 });
          im.setAlpha(0); self.tweens.add({ targets: im, alpha: 1, duration: 700 });
          self.fx.sparkle.explode(10, bx, by - 12);
          for (var y = o.y; y < o.y + h; y++) for (var x = o.x; x < o.x + w; x++) { self.solid[y][x] = true; self.objAt[y][x] = o; }
        } else if (!on && im) {
          im.destroy(); delete self.objImgs[o.id];
          for (var y2 = o.y; y2 < o.y + h; y2++) for (var x2 = o.x; x2 < o.x + w; x2++) if (self.objAt[y2][x2] === o) { self.solid[y2][x2] = false; self.objAt[y2][x2] = null; }
        }
      });
    },

    // ---------------------------------------------------------------- Barunai: what is out and about at this point in the story
    refreshBarunai: function () {
      var self = this, c = this.ch2, q = Q(), st = LC.ch2Step(), S = this.S, CH = LC.CH2;
      ['marker', 'temb', 'bird', 'ship'].forEach(function (k) { if (c[k]) self.removeThing(k); });
      if (st === 3) {   // the hoofprints, one at a time
        var i = q.ch2t1 || 0;
        if (i < CH.trail1.length) this.placeThing('marker', CH.trail1[i], 'jejak', { type: 'jejak' });
        else this.placeThing('temb', CH.temb, 'tembadau_0', { type: 'tembadau', anim: 'tembadau_walk' });
      }
      if (st === 4) this.placeThing('temb', CH.bend, 'tembadau_0', { type: 'tembadau', anim: 'tembadau_walk' });
      if (st >= 5) this.placeThing('temb', CH.home, 'tembadau_0', { type: 'tembadau', anim: 'tembadau_walk' });
      var arrived = st >= 6 && S.day > (q.ch2day || 0);
      if (arrived && st === 6) {
        var j = q.ch2t2 || 0;
        if (!q.ch2bird) { if (j < CH.trail2.length) this.placeThing('marker', CH.trail2[j], 'bulu', { type: 'bulu' }); else this.placeThing('bird', CH.bird, 'pinggai_0', { type: 'pinggai', anim: 'pinggai_idle' }); }
        if (!q.ch2ship) this.placeThing('ship', CH.ship, 'dive_ring', { type: 'salvage', ring: true });
      }
      if (q.ch2bird) this.placeThing('bird', { x: 20, y: 13 }, 'pinggai_0', { type: 'bldg', anim: 'pinggai_idle', text: 'Si Pinggai, safe on his perch beside the princess. He sings, very badly.' });
    },
    placeThing: function (k, at, tex, opt) {
      var x = at.x * T + 8, y = (at.y + 1) * T - (opt.ring ? 2 : 0), o = { type: opt.type || k, text: opt.text };
      var spr = this.add.sprite(x, y, tex).setOrigin(0.5, 1).setDepth(opt.ring ? y - 8 : y);
      if (opt.anim) spr.play(opt.anim);
      if (opt.ring) this.tweens.add({ targets: spr, scale: 1.15, alpha: 0.7, duration: 900, yoyo: true, repeat: -1 });
      var glow = opt.glow ? this.add.image(x, y - 14, 'glow').setBlendMode(Phaser.BlendModes.ADD).setDepth(9001).setTint(opt.glow).setScale(0.8).setAlpha(0.6) : null;
      this.ch2[k] = { spr: spr, glow: glow, tx: at.x, ty: at.y, o: o, y0: y, was: this.solid[at.y][at.x] };
      this.solid[at.y][at.x] = true; this.objAt[at.y][at.x] = o;
      return this.ch2[k];
    },
    removeThing: function (k) {
      var t = this.ch2[k];
      if (!t) return;
      t.spr.destroy(); if (t.glow) t.glow.destroy();
      if (this.objAt[t.ty][t.tx] === t.o) { this.solid[t.ty][t.tx] = t.was; this.objAt[t.ty][t.tx] = null; }
      this.ch2[k] = null;
    },
    barunaiObjAction: function (o) {
      var self = this, q = Q(), CH = LC.CH2, T2 = LC.CH2TEXT;
      switch (o.type) {
        case 'jejak': return { label: 'Follow the hoofprints', fn: function () {
          q.ch2t1 = (q.ch2t1 || 0) + 1;
          LC.Audio.sfx('pet');
          var last = q.ch2t1 >= CH.trail1.length;
          self.toast(last ? 'The prints end by the western hills. Something big is breathing behind the trees...' : 'Fresh hoofprints of a tembadau. They lead on' + (CH.trail1[q.ch2t1].x < self.ch2.marker.tx ? ' to the west...' : '...'), 'ic_moon');
          self.refreshBarunai();
        } };
        case 'tembadau':
          if (LC.ch2Step() !== 3) return { label: 'The tembadau', fn: function () { LC.Audio.sfx('pet'); self.toast('The tembadau snorts softly and nudges your hand. It seems to like Barunai.', 'ic_joy'); } };
          return { label: 'Approach the tembadau slowly', fn: function () {
            self.ui.say(T2.tembadau, { onDone: function () {
              q.ch2 = 4; LC.Audio.sfx('chime');
              var t = self.ch2.temb; if (t) self.tweens.add({ targets: t.spr, x: CH.bend.x * T + 8, y: (CH.bend.y + 1) * T, duration: 2600, onComplete: function () { self.refreshBarunai(); } });
            } });
          } };
        case 'bulu': return { label: 'Pick up the feather', fn: function () {
          q.ch2t2 = (q.ch2t2 || 0) + 1;
          LC.Audio.sfx('pet');
          self.toast(q.ch2t2 >= CH.trail2.length ? 'A whole bunch of feathers! He must be close: up on a mooring post, by the end of the walkway...' : 'A shimmering blue feather. There is another one further along the walkway...', 'ic_glow');
          self.refreshBarunai();
        } };
        case 'pinggai': return { label: 'Catch Si Pinggai gently', fn: function () {
          q.ch2bird = 1; LC.Audio.sfx('chime');
          self.ui.say(T2.bird, { onDone: function () { self.toast('Bring the good news to Tuan Puteri!', 'ic_joy'); self.refreshBarunai(); } });
        } };
        case 'salvage': return { label: 'Dive for the princess\'s chest', fn: function () {
          var free = LC.State.s.inv.filter(function (sl) { return !sl; }).length;
          if (free < 3) { self.toast('Make room in your bag first (3 free slots)!'); LC.Audio.sfx('error'); return; }
          LC.Audio.sfx('dive');
          self.cameras.main.fadeOut(300, 20, 60, 90);
          self.cameras.main.once('camerafadeoutcomplete', function () {
            self.cameras.main.fadeIn(500);
            q.ch2ship = 1; LC.State.add('kain_tenun', 1); LC.State.add('tembaga', 1); LC.State.add('emas', 1);
            self.ui.say(T2.ship.concat([{ text: 'Inside the chest: Kain Tenunan, a Kendi Tembaga and a gold nugget, the princess\'s dowry. (She insists you keep them as thanks.)' }]), { onDone: function () { self.refreshBarunai(); } });
          });
        } };
        case 'vase': return { label: 'Reach into the magic tempayan', fn: function () { self.openVase(); } };
        case 'tamu2': return { label: 'Sleep in the guest house', fn: function () {   // v2.7.1: wake up here, in Barunai
          self.ui.confirmSleep({ area: 'barunai', x: CH.tamu.x, y: CH.tamu.y, name: 'the brothers\' guest house', text: LC.TEXT.tamu2 });
        } };
      }
      return undefined;
    },
    openVase: function () {
      var self = this, S = this.S, q = Q(), roll = Math.random(), got;
      if (roll < 0.3) { var k = 300 + Math.floor(Math.random() * 4) * 100; S.kepeng += k; S.stats.earned += k; got = k + ' kepeng'; }
      else {
        var pool = ['emas', 'mutiara', 'kain_tenun', 'tembaga', 'kristal', 'buah_emas'], id = pool[Math.floor(Math.random() * pool.length)];
        if (!LC.State.add(id, 1)) { this.toast('Your bag is full! The tempayan waits...'); return; }
        got = '1 ' + LC.ITEMS[id].name;
      }
      q.vaseDay = S.day;
      LC.Audio.sfx('restu');
      var v = this.ch2.vase;
      this.ui.say([{ text: LC.CH2TEXT.vase }, { text: 'You reach inside, and your fingers close on something: ' + got + '! Then the tempayan sinks slowly back into the dark water.' }]);
      if (v) { this.fx.sparkle.explode(20, v.spr.x, v.spr.y - 14); this.tweens.add({ targets: [v.spr, v.glow], alpha: 0, y: '+=10', duration: 1400, onComplete: function () { self.removeThing('vase'); } }); }
    },

    // ---------------------------------------------------------------- "Baru nah!": the founding of Barunai
    foundBarunai: function () {
      var self = this, T2 = LC.CH2TEXT, all = ['alak', 'semaun'].concat(LC.BROTHERS), line = [], back = [];
      this.cutscene = true; this.ui.closeModal();
      // you walk down to the river with them, so the whole scene is in view
      var stand = this.tilePx({ x: 24, y: 13 }); this.player.setPosition(stand.x, stand.y); this.dir = 'down';
      this.cameras.main.flash(300, 0, 0, 0);
      all.forEach(function (vid, i) {
        var n = self.npcs[vid]; if (!n) return;
        var x = (14 + i * 1.5) * T + 8, y = 14 * T + 6;
        back.push({ spr: n.spr, x: n.spr.x, y: n.spr.y });
        self.tweens.add({ targets: n.spr, x: x, y: y, duration: 1400, delay: i * 40, ease: 'Sine.easeInOut', onUpdate: function () { n.spr.setDepth(n.spr.y); } });
        n.spr.setVisible(true); line.push(n);
      });
      this.time.delayedCall(1700, function () {
        self.ui.say(self.ch2Lines(T2.founding), { onDone: function () {
          LC.Audio.sfx('stage'); LC.Audio.sfx('cheer');
          self.cameras.main.flash(700, 255, 240, 200); self.cameras.main.shake(400, 0.003);
          Q().ch2 = 5;
          self.applyFounding();
          self.time.delayedCall(1200, function () {
            self.ui.say(self.ch2Lines(T2.founded), { onDone: function () {
              var S = self.S; S.kepeng += 1000; S.stats.earned += 1000;
              ['alak', 'semaun'].concat(LC.BROTHERS).forEach(function (vid) { LC.State.addFriendship(vid, 4); });
              self.doShared('kind', { n: 15 }, function (res) { if (res && res.ok) self.toast('Pelita glows with pride. (+' + res.b + ' bond)', 'ic_bond'); });
              back.forEach(function (b) { self.tweens.add({ targets: b.spr, x: b.x, y: b.y, duration: 1400, onUpdate: function () { b.spr.setDepth(b.spr.y); } }); });
              self.time.delayedCall(1500, function () { self.cutscene = false; });
            } });
          });
        } });
      });
    },
    applyFounding: function () {
      var self = this, TI = LC.Art.TI, set = {};
      LC.syncBarunai();
      if (this.area !== 'barunai') return;
      LC.BARUNAI_WALKS.forEach(function (r) { for (var y = r[1]; y <= r[3]; y++) for (var x = r[0]; x <= r[2]; x++) {
        set[x + ',' + y] = 1; self.ground.putTileAt(TI.JETTY, x, y); self.solid[y][x] = false;
        if (Math.random() < 0.15) self.fx.drop.explode(2, x * T + 8, y * T + 8);
      } });
      this.animTiles = this.animTiles.filter(function (a) { return !set[a.x + ',' + a.y]; });
      this.refreshWhen();
      this.refreshBarunai();
    },
    ch2Lines: function (arr) {
      var WHO = { alak: 'Awang Alak Betatar', semaun: 'Awang Semaun', berbai: 'Pateh Berbai', puteri: 'Tuan Puteri' };
      return arr.map(function (l) { return l.who ? { name: WHO[l.who] || l.who, portrait: 'npc_' + l.who + '_0', text: l.text } : { text: l.text }; });
    },

    // ---------------------------------------------------------------- Langkah Semaun: a giant stride (Shift)
    dashLeft: function () { return Math.max(0, ((LC.dashReadyAt || 0) - Date.now()) / 1000); },
    dash: function () {
      if (!LC.hasLangkah() || this.sleeping || this.leaving || this.cutscene || this.reuniting || this.S.riding || (this.ui && this.ui.isBlocking())) return;
      if (this.dashLeft() > 0) return;
      var self = this, p = this.player, d = DIRV[this.dir] || DIRV.down, tx = p.x, ty = p.y, dist = 0;
      while (dist < LC.LANGKAH.dist) { var nx = tx + d[0] * 4, ny = ty + d[1] * 4; if (this.blockedAt(nx, ny)) break; tx = nx; ty = ny; dist += 4; }
      if (dist < 12) { LC.Audio.sfx('error'); return; }
      LC.dashReadyAt = Date.now() + LC.LANGKAH.cd * 1000;
      this.invuln = Math.max(this.invuln || 0, 0.45);
      for (var i = 0; i < 3; i++) (function (i) {
        var gh = self.add.image(p.x + (tx - p.x) * i / 3, p.y + (ty - p.y) * i / 3, p.texture.key).setOrigin(p.originX, p.originY).setFlipX(p.flipX).setTintFill(0xffd166).setAlpha(0.45).setDepth(p.depth - 1);
        self.tweens.add({ targets: gh, alpha: 0, duration: 260 + i * 70, onComplete: function () { gh.destroy(); } });
      })(i);
      this.fx.dirt.explode(8, p.x, p.y - 2);
      LC.Audio.sfx('dash');
      this.tweens.add({ targets: p, x: tx, y: ty, duration: 130, ease: 'Quad.easeOut' });
    }
  });
})(window.LC);
