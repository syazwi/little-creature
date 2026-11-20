/* World, part 6 (v1.7): Badang. The night watch at the forest pool and the cheeky river hantu, Badang's wish
 * (he becomes the strongest man in the land; you stay as you are), Badang walking beside you and fighting for you
 * (once a day), the stumps he clears from the land south of Nenek's field, Batu Badang in the river, and your own
 * bubu fish traps. Badang is simulated on your own device, like the enemies. Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var T = 16;
  var DIRV = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] };
  var ADD = function () { return Phaser.BlendModes.ADD; };
  function isNight(S) { return S.minutes >= 19 * 60 || S.minutes < 6 * 60; }
  // a fish (never a flip-flop) for a bubu set in this kind of water
  function fishFor(kind) {
    for (var k = 0; k < 8; k++) { var id = LC.State.rollFish(kind); if (LC.ITEMS[id].kind === 'fish') return id; }
    return (LC.FISHING[kind] || LC.FISHING.river)[0][0];
  }

  Object.assign(LC.WorldScene.prototype, {
    createBadang: function () {
      var self = this;
      this.buddy = null; this.hantu = null; this.hantuDone = false; this.cutscene = false; this.bubuImgs = [];
      if (LC.badangBuddy()) {
        if (this.A.underwater) this.time.delayedCall(900, function () { self.toast(LC.BADANG.away, 'ic_badang'); });
        else this.makeBuddy();
      }
      this.refreshBubus();
    },
    updateBadang: function (time, dt, blocked) {
      this.updateBuddy(time, dt, blocked);
      this.updateHantu(time, dt, blocked);
    },

    // ================================================================ Badang at your side
    makeBuddy: function () {
      var p = this.player, b = this.buddy = { x: p.x - 18, y: p.y + 2, cd: 1, target: null, said: false };
      b.spr = this.add.sprite(b.x, b.y, 'npc_badangK_0').setOrigin(0.5, 1).setDepth(b.y);
      b.spr.play('npc_badangK_idle');
    },
    startBuddy: function () {   // from Badang's Talk menu
      var S = this.S, n = this.npcs.badang;
      S.buddy = 'badang'; S.buddyDay = S.day;
      if (n) {
        if (n.here) { this.solid[n.ty][n.tx] = false; this.objAt[n.ty][n.tx] = null; }
        this.fx.sparkle.explode(8, n.spr.x, n.spr.y - 12);
        n.spr.destroy(); delete this.npcs.badang;
      }
      if (!this.buddy && !this.A.underwater) this.makeBuddy();
      LC.Audio.sfx('chime');
      this.toast('Badang comes with you today. He will fight anything that threatens you!', 'ic_badang');
    },
    sendBuddyHome: function () {
      var self = this, b = this.buddy;
      this.S.buddy = null;
      if (b) {
        this.buddy = null;
        this.fx.sparkle.explode(6, b.spr.x, b.spr.y - 12);
        this.tweens.add({ targets: b.spr, alpha: 0, duration: 600, onComplete: function () { b.spr.destroy(); } });
      }
      if (LC.villagerArea('badang') === this.area) this.placeVillager('badang');
      this.toast(LC.BADANG.home, 'ic_badang');
    },
    updateBuddy: function (time, dt, blocked) {
      var b = this.buddy;
      if (!b) return;
      if (!LC.badangBuddy()) { b.spr.destroy(); this.buddy = null; return; }   // a new day, or a loaded game
      if (blocked) return;
      var self = this, s = b.spr, p = this.player, F = LC.BADANG_FIGHT;
      b.cd -= dt;
      if (b.target && (b.target.dead || b.target.away || Math.hypot(b.target.spr.x - p.x, b.target.spr.y - p.y) > F.sight + 60)) b.target = null;
      if (!b.target && b.cd <= 0 && this.enemies && this.enemies.length) {   // the nearest thing hunting you
        var best = null, bd = F.sight;
        this.enemies.forEach(function (e) {
          if (e.dead || e.away) return;
          var d = Math.hypot(e.spr.x - p.x, e.spr.y - p.y);
          if (d < bd) { bd = d; best = e; }
        });
        b.target = best;
        if (best && !b.said) { b.said = true; this.ui.floatText(s.x, s.y - 30, 'Leave my kawan alone!', '#ffd166'); }
      }
      if (b.target) {
        var e = b.target, ex = e.spr.x - b.x, ey = e.spr.y - b.y, d = Math.hypot(ex, ey) || 1;
        if (d < e.def.w + 11) { this.badangPunch(e); b.target = null; b.cd = F.cd; }
        else { b.x += ex / d * F.speed * dt; b.y += ey / d * F.speed * dt; s.setFlipX(ex < 0); }
      } else {
        var dv = DIRV[this.dir] || DIRV.down, tx = p.x - dv[0] * 22 - (dv[0] === 0 ? 18 : 0), ty = p.y - dv[1] * 16 + 2, k = Math.min(1, dt * 2.6);
        var mx = (tx - b.x) * k;
        b.x += mx; b.y += (ty - b.y) * k;
        if (Math.abs(mx) > 0.15) s.setFlipX(mx < 0); else if (Math.abs(p.x - b.x) > 4) s.setFlipX(p.x < b.x);
        if (Math.hypot(p.x - b.x, p.y - b.y) > 220) { b.x = p.x - 18; b.y = p.y + 2; }   // he catches up
      }
      var hop = b.target ? -Math.round(Math.abs(Math.sin(time / 70)) * 2) : 0;
      s.setPosition(Math.round(b.x), Math.round(b.y) + hop).setDepth(b.y);
    },
    badangPunch: function (e) {
      var s = this.buddy.spr, F = LC.BADANG_FIGHT, stone = e.stoneT > 0, n = stone ? F.dmg * 2 : F.dmg;
      var ex = e.spr.x - this.buddy.x, ey = e.spr.y - this.buddy.y, d = Math.hypot(ex, ey) || 1;
      LC.Audio.sfx('punch');
      this.tweens.add({ targets: s, scaleX: 1.14, scaleY: 0.9, duration: 80, yoyo: true });
      e.hp -= n; e.hurtT = 0.12; e.spr.setTintFill(0xffffff);
      if (!stone) { var k = e.def.boss ? 90 : 260; e.kx = ex / d * k; e.ky = ey / d * k; e.windT = 0; e.strikeT = 0; e.restT = 0.9; }
      var hx = e.spr.x - ex / d * 4, hy = e.spr.y - e.spr.height / 2;
      var spark = this.add.image(hx, hy, 'hitfx').setDepth(9600).setBlendMode(ADD()).setScale(0.6).setAngle(Math.random() * 90);
      this.tweens.add({ targets: spark, scale: 1.6, alpha: 0, duration: 220, onComplete: function () { spark.destroy(); } });
      this.shockwave(hx, hy, 22, 0xffd166);
      this.fx.sparkle.explode(6, hx, hy);
      if (stone) this.fx.pebble.explode(6, hx, hy);
      this.ui.floatText(e.spr.x, e.spr.y - e.spr.height - 2, (stone ? 'CRACK! ' : 'BAM! ') + n, '#ffd166');
      this.cameras.main.shake(90, 0.003);
      if (e.hp <= 0) this.enemyDie(e);
    },

    // ================================================================ the night watch: the river hantu
    makeHantu: function () {
      var h = this.hantu = { spot: Math.floor(Math.random() * 3), on: false, stoneT: 0, munch: 2, seen: false, gone: false };
      h.glow = this.add.image(0, 0, 'glow').setBlendMode(ADD()).setDepth(9001).setTint(0x7affc8).setScale(0.6).setVisible(false);
      h.spr = this.add.sprite(0, 0, 'hantu_air_0').setOrigin(0.5, 1).setVisible(false);
      h.spr.play('hantu_air_idle');
      this.hantuTo(h.spot);
    },
    hantuTile: function (on) {
      var h = this.hantu;
      if (on) { this.solid[h.ty][h.tx] = true; this.objAt[h.ty][h.tx] = { type: 'hantu' }; }
      else if (this.objAt[h.ty][h.tx] && this.objAt[h.ty][h.tx].type === 'hantu') { this.solid[h.ty][h.tx] = false; this.objAt[h.ty][h.tx] = null; }
    },
    hantuTo: function (i) {
      var h = this.hantu, sp = LC.HANTU_SPOTS[i];
      if (h.tx !== undefined) this.hantuTile(false);
      h.spot = i; h.tx = sp.x; h.ty = sp.y; h.x = sp.x * T + 8; h.y = (sp.y + 1) * T - 1;
      h.spr.setPosition(h.x, h.y).setDepth(h.y); h.glow.setPosition(h.x, h.y - 8);
      if (h.on) this.hantuTile(true);
    },
    updateHantu: function (time, dt, blocked) {
      if (!this.hantu && !this.hantuDone && this.area === 'forest' && LC.badangWatch()) this.makeHantu();   // the watch began while you were here
      var h = this.hantu;
      if (!h || h.gone) return;
      var S = this.S, p = this.player, want = isNight(S) && LC.badangWatch();
      if (want !== h.on) {
        if (want) {
          var i = h.spot;
          for (var k = 0; k < LC.HANTU_SPOTS.length && Math.hypot(p.x - (LC.HANTU_SPOTS[i].x * T + 8), p.y - (LC.HANTU_SPOTS[i].y + 1) * T) < 48; k++) i = (i + 1) % LC.HANTU_SPOTS.length;
          h.on = true; this.hantuTo(i);
          h.spr.setVisible(true).setAlpha(0); h.glow.setVisible(true);
          this.tweens.add({ targets: h.spr, alpha: 0.95, duration: 700 });
          this.fx.drop.explode(8, h.x, h.y - 4);
          if (!h.seen) { h.seen = true; this.toast(LC.BADANG.seen, 'ic_badang'); }
        } else {
          h.on = false; this.hantuTile(false);
          h.spr.setVisible(false); h.glow.setVisible(false);
        }
      }
      if (!h.on) return;
      if (h.stoneT > 0) {
        if (!blocked) { h.stoneT -= dt; if (h.stoneT <= 0) { h.spr.clearTint(); h.spr.anims.resume(); this.fx.pebble.explode(8, h.x, h.y - 8); } }
      } else {
        h.spr.y = h.y + Math.round(Math.sin(time / 300) * 1.5);
        if (Math.abs(p.x - h.x) > 3) h.spr.setFlipX(p.x < h.x);
      }
      h.glow.setPosition(h.spr.x, h.spr.y - 8).setAlpha(0.3 + 0.2 * Math.sin(time / 400));
      if (!blocked && (h.munch -= dt) <= 0) {
        h.munch = 3 + Math.random() * 3;
        if (h.stoneT <= 0 && Math.hypot(p.x - h.x, p.y - h.y) < 150) this.ui.floatText(h.x, h.y - 20, Math.random() < 0.5 ? 'nyam nyam...' : 'hihihi!', '#9ae8c8');
      }
    },
    hantuInRange: function (r) {
      var h = this.hantu;
      return !!(h && h.on && !h.gone && Math.hypot(this.player.x - h.x, this.player.y - h.y) < r);
    },
    stoneHantu: function (dur) {
      var h = this.hantu;
      h.stoneT = dur; h.spr.anims.pause(); h.spr.setTint(0x9a96a0);
      this.fx.pebble.explode(8, h.x, h.y - 8);
      this.tweens.add({ targets: h.spr, scaleX: 1.08, scaleY: 0.94, duration: 90, yoyo: true });
    },
    grabHantu: function () {
      var self = this, h = this.hantu;
      if (!h || !h.on || h.gone || this.cutscene) return;
      if (h.stoneT > 0) { this.catchHantu(true); return; }
      LC.Audio.sfx('lunge');
      this.ui.openGrab(function (win) { if (win) self.catchHantu(false); else self.hantuSlip(); });
    },
    hantuSlip: function () {
      var h = this.hantu;
      if (!h || h.gone) return;
      LC.Audio.sfx('splash');
      this.fx.drop.explode(12, h.x, h.y - 6);
      var p = this.player, others = LC.HANTU_SPOTS.map(function (s, i) { return i; }).filter(function (i) { return i !== h.spot; });
      var away = others.filter(function (i) { var s = LC.HANTU_SPOTS[i]; return Math.hypot(p.x - (s.x * T + 8), p.y - (s.y + 1) * T) > 48; });
      if (away.length) others = away;   // never pop up on top of you
      this.hantuTo(others[Math.floor(Math.random() * others.length)]);
      h.spr.setAlpha(0); this.tweens.add({ targets: h.spr, alpha: 0.95, duration: 600, delay: 400 });
      this.fx.drop.explode(10, h.x, h.y - 6);
      this.ui.floatText(h.x, h.y - 20, 'hihihi!', '#9ae8c8');
      LC.Audio.sfx('giggle');
      this.toast(LC.BADANG.slipped, 'ic_badang');
    },

    // ---------------------------------------------------------------- caught! Badang's wish
    catchHantu: function (stoned) {
      var self = this, h = this.hantu, p = this.player, B = LC.BADANG, L = LC.badangLines, n = this.npcs.badang, bs;
      this.cutscene = true; h.gone = true; this.hantuDone = true;
      this.ui.closeModal();
      LC.Audio.setBattle(false);
      if (h.stoneT > 0) { h.stoneT = 0; h.spr.anims.resume(); }
      h.spr.clearTint().setAlpha(1);
      this.tweens.add({ targets: h.spr, x: h.x + 1, duration: 50, yoyo: true, repeat: 10 });
      LC.Audio.sfx('giggle');
      if (n) {   // Badang leaves his hiding place (he is part of the scene now, not standing at his post)
        if (n.here) { this.solid[n.ty][n.tx] = false; this.objAt[n.ty][n.tx] = null; }
        bs = n.spr.setVisible(true); delete this.npcs.badang;
      } else bs = this.add.sprite(p.x - 40, p.y, 'npc_badang_0').setOrigin(0.5, 1).play('npc_badang_idle');
      this.badangCut = bs;
      var side = h.x > p.x ? -1 : 1, bx = p.x + side * 18, by = p.y + 3;
      this.tweens.add({ targets: bs, x: bx, y: by, duration: 800, ease: 'Sine.easeOut', onUpdate: function () { bs.setDepth(bs.y); } });
      bs.setFlipX(h.x < bx);
      function wish() {
        self.time.delayedCall(150, function () {
          self.ui.say(L(B.wish.slice(0, 2)), { onDone: function () {
            LC.Audio.sfx('bleurgh');
            var lump = self.add.image(h.spr.x, h.spr.y - 12, 'gumpal').setDepth(9600);
            var lg = self.add.image(lump.x, lump.y, 'glow').setBlendMode(ADD()).setDepth(9599).setTint(0x7aff9a).setScale(0.35).setAlpha(0.8);
            self.tweens.add({ targets: [lump, lg], y: lump.y - 8, duration: 500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
            self.ui.say(L(B.wish.slice(2, 5)), { onDone: function () {
              self.tweens.killTweensOf([lump, lg]);
              self.tweens.add({ targets: [lump, lg], x: bs.x, y: bs.y - 18, scale: 0.3, duration: 450, onComplete: function () {
                lump.destroy(); lg.destroy(); LC.Audio.sfx('gulp');
                self.ui.say(L(B.wish.slice(5)), { onDone: function () { self.badangGrow(bs); } });
              } });
            } });
          } });
        });
      }
      this.time.delayedCall(stoned ? 300 : 400, function () {
        self.ui.say([{ text: stoned ? 'The hantu is frozen stiff by your stone curse! You grab it by its long, dripping beard.' : 'Got it! You grab the slippery little hantu by its long, dripping beard!' }].concat(L(B.caught)), { choices: [
          { label: 'Let Badang make the wish', fn: wish },
          { label: 'Wish for gold yourself', fn: function () { self.time.delayedCall(150, function () { self.ui.say(L(B.greedy), { onDone: wish }); }); } }
        ] });
      });
    },
    badangGrow: function (bs) {
      var self = this, x = bs.x, y = bs.y, B = LC.BADANG, L = LC.badangLines;
      LC.Audio.sfx('grow');
      this.cameras.main.shake(1000, 0.004);
      var col = this.add.image(x, y - 24, 'glow').setDepth(9600).setTint(0x9affb0).setBlendMode(ADD()).setScale(1, 4).setAlpha(0);
      this.tweens.add({ targets: col, alpha: 1, duration: 600, yoyo: true, hold: 500, onComplete: function () { col.destroy(); } });
      this.fx.sparkle.explode(30, x, y - 12); this.fx.leaf.explode(14, x, y - 10);
      this.tweens.add({ targets: bs, scaleX: 1.4, scaleY: 1.4, duration: 900, ease: 'Back.easeIn', onComplete: function () {
        bs.anims.stop(); bs.setScale(1).setTexture('npc_badangK_0'); bs.play('npc_badangK_idle');
        self.cameras.main.flash(450, 220, 255, 220);
        LC.Audio.sfx('stone');
        self.fx.dirt.explode(14, x, y - 2);
        self.time.delayedCall(800, function () {
          self.ui.say([{ text: 'A rumble rolls through the forest. Badang grows taller, broader, STRONGER... and his thin arms swell like jackfruit!' }].concat(L(B.after.slice(0, 2))), { onDone: function () {
            self.ui.say(L(B.after.slice(2)), { onDone: function () {
              self.hantuDive();
              self.time.delayedCall(1100, function () { self.ui.say(L(B.thanks), { onDone: function () { self.finishBadang(bs); } }); });
            } });
          } });
        });
      } });
    },
    hantuDive: function () {
      var self = this, h = this.hantu;
      if (!h) return;
      this.hantuTile(false);
      LC.Audio.sfx('splash');
      this.ui.floatText(h.x, h.y - 20, 'hihihi!', '#9ae8c8');
      this.tweens.add({ targets: [h.spr, h.glow], x: 34 * T + 8, y: 22 * T + 8, alpha: 0, duration: 900, ease: 'Quad.easeIn', onComplete: function () {
        self.fx.drop.explode(16, 34 * T + 8, 22 * T + 8);
        h.spr.destroy(); h.glow.destroy();
        if (self.hantu === h) self.hantu = null;
      } });
    },
    finishBadang: function (bs) {
      var self = this, S = this.S;
      S.quests.badang = 3;
      LC.State.folk('badang').met = true;
      if (!LC.State.add('bubu', 2)) S.quests.bubuOwed = 1;   // a full bag: he keeps them for you
      LC.Audio.sfx('stage');
      this.doShared('kind', { n: 12 }, function (res) { if (res && res.ok) self.toast('Pelita glows with pride. (+' + res.b + ' bond)', 'ic_bond'); });
      this.toast(S.quests.bubuOwed ? 'Your bag is full: Badang will keep the bubu for you. Visit him in Kampung Tepian!' : 'Badang now lives in Kampung Tepian, by the batu angkat. Ask him to come along!', 'ic_badang');
      this.cutscene = false;
      // he strides off down the trail to tell his master the news
      this.tweens.add({ targets: bs, y: bs.y + 70, alpha: 0, duration: 1900, delay: 300, onUpdate: function () { bs.setDepth(bs.y); }, onComplete: function () { bs.destroy(); if (self.badangCut === bs) self.badangCut = null; } });
    },

    // ================================================================ your bubu (fish traps)
    refreshBubus: function () {
      var self = this, S = this.S;
      (this.bubuImgs || []).forEach(function (b) {
        b.img.destroy();
        var o = self.objAt[b.y] && self.objAt[b.y][b.x];
        if (o && o.type === 'bubu') self.objAt[b.y][b.x] = null;
      });
      this.bubuImgs = [];
      (S.bubus || []).forEach(function (b, i) {
        if (b.area !== self.area || !self.objAt[b.y]) return;
        var img = self.add.image(b.x * T + 8, (b.y + 1) * T - 1, 'bubu_set').setOrigin(0.5, 1).setDepth((b.y + 1) * T - 8);
        self.tweens.add({ targets: img, y: img.y - 1, duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        self.objAt[b.y][b.x] = { type: 'bubu', idx: i };
        self.bubuImgs.push({ img: img, x: b.x, y: b.y });
      });
    },
    bubuToolAction: function (sl, water, tx, ty, hint) {
      var self = this, S = this.S;
      if (sl.id !== 'bubu') return null;
      if (this.A.underwater) return hint('Set your bubu from the land: in a river, pool, lake or the sea.');
      if (!water) return hint('Face the water to set the bubu: a river, pool, lake or the sea.');
      if ((S.bubus || []).length >= 3) return hint('You already tend 3 bubu. Pick one up first.');
      return { label: 'Set the bubu', tile: true, fn: function () { self.setBubu(tx, ty, water); } };
    },
    setBubu: function (tx, ty, kind) {
      var S = this.S;
      if (!LC.State.remove('bubu', 1)) return;
      (S.bubus = S.bubus || []).push({ area: this.area, x: tx, y: ty, day: S.day, kind: kind });
      LC.Audio.sfx('water');
      this.fx.drop.explode(8, tx * T + 8, ty * T + 10);
      this.refreshBubus();
      this.toast('You set the bubu in the ' + (LC.WATER_NAMES[kind] || 'water') + '. Fish swim in at night: check it tomorrow!', 'i_bubu');
    },
    bubuAction: function (o) {
      var self = this, S = this.S, b = S.bubus && S.bubus[o.idx];
      if (!b) return null;
      return { label: S.day > b.day ? 'Check your bubu' : 'Your bubu', fn: function () { self.checkBubu(o.idx); } };
    },
    checkBubu: function (idx) {
      var self = this, S = this.S, b = S.bubus[idx];
      if (!b) return;
      if (S.day > b.day) {
        var nights = Math.min(3, S.day - b.day), n = 0, got = {}, order = [], caught = 0;
        for (var k = 0; k < nights; k++) n += 1 + (Math.random() < 0.5 ? 1 : 0);
        n = Math.min(4, n);
        for (var i = 0; i < n; i++) {
          var id = fishFor(b.kind);
          if (!LC.State.add(id, 1)) break;
          if (!got[id]) order.push(id);
          got[id] = (got[id] || 0) + 1; caught++;
          S.fishLog[id] = (S.fishLog[id] || 0) + 1; S.stats.fish = (S.stats.fish || 0) + 1;
        }
        if (!caught) { this.toast('Your bag is full! The fish slip back out of the bubu.'); LC.Audio.sfx('error'); return; }
        b.day = S.day;
        LC.Audio.sfx('catch'); this.bump();
        this.fx.drop.explode(10, b.x * T + 8, b.y * T + 10);
        this.toast('Your bubu caught ' + order.map(function (id) { return got[id] + ' ' + LC.ITEMS[id].name; }).join(' and ') + '!', LC.ITEMS[order[0]].icon);
        return;
      }
      this.ui.say([{ text: 'Your bubu sits quietly in the water. Fish swim in at night: check it again tomorrow.' }], { choices: [
        { label: 'Leave it' },
        { label: 'Pick it up', fn: function () {
          if (!LC.State.canAdd('bubu')) { self.toast('Your bag is full!'); LC.Audio.sfx('error'); return; }
          S.bubus.splice(idx, 1); LC.State.add('bubu', 1);
          LC.Audio.sfx('water'); self.refreshBubus();
        } }
      ] });
    },

    // ================================================================ things in the world: stumps, his old bubu, the hantu
    badangObjAction: function (o) {
      var self = this, S = this.S;
      switch (o.type) {
        case 'hantu': return { label: 'Grab the hantu!', fn: function () { self.grabHantu(); } };
        case 'bubu': return this.bubuAction(o);
        case 'bubu_badang': return { label: 'Look', fn: function () {
          self.ui.say([{ text: (S.quests.badang || 0) >= 3 ? 'Badang\'s old bubu. He catches fish with his bare hands now!' : LC.TEXT.bubu_badang }]);
        } };
        case 'tunggul': return { label: 'Look', fn: function () {
          var extra = S.ladang === 1 ? ' Badang has promised to clear them tonight!' : LC.hasBadang() ? ' Badang could clear this land in a single night (ask him in Kampung Tepian).' : '';
          self.ui.say([{ text: LC.TEXT.tunggul + extra }]);
        } };
      }
      return undefined;
    },

    // ================================================================ Ladang Badang and Batu Badang
    // a new day: if Badang cleared the land last night, the stumps vanish and the field appears (the tiles are redrawn by the caller)
    refreshLadang: function () {
      var self = this;
      LC.syncLadang();
      if (this.area !== 'farm' || this.S.ladang !== 2) return;
      this.objects.forEach(function (o) {
        if (o.type !== 'tunggul') return;
        var im = self.objImgs[o.id];
        if (im) { im.destroy(); delete self.objImgs[o.id]; }
        for (var y = o.y; y < o.y + (o.h || 1); y++) for (var x = o.x; x < o.x + (o.w || 1); x++) if (self.objAt[y][x] === o) { self.solid[y][x] = false; self.objAt[y][x] = null; }
      });
      // v2.7.4: the old south fence becomes field, and the side fences run on down (field tiles are redrawn by the caller)
      var L = LC.LADANG;
      for (var y = L.y0; y <= L.y1; y++) for (var x = L.x0 - 1; x <= L.x1 + 1; x++) {
        var ch = this.grid[y][x];
        if (ch === 'F') this.ground.putTileAt(this.fenceIdx(x, y), x, y);
        if (!this.objAt[y][x]) this.solid[y][x] = !!LC.SOLID_TILES[ch];
      }
    },
    // after the Pesta: his last stone lands in the river
    refreshBatuBadang: function () {
      var self = this, S = this.S;
      if (this.area !== 'kampung') return;
      this.objects.forEach(function (o) {
        if (o.id !== 'k_batu_badang' || self.objImgs[o.id] || !o.when(S)) return;
        var bx = (o.x + o.w / 2) * T, by = (o.y + o.h) * T;
        var im = self.objImgs[o.id] = self.add.image(bx, by, o.tex).setOrigin(0.5, 1).setDepth(by).setAlpha(0);
        self.tweens.add({ targets: im, alpha: 1, duration: 600 });
        self.fx.drop.explode(16, bx, by - 6);
        for (var y = o.y; y < o.y + o.h; y++) for (var x = o.x; x < o.x + o.w; x++) { self.solid[y][x] = true; self.objAt[y][x] = o; }
      });
    }
  });
})(window.LC);
