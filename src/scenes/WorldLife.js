/* World, part 2 (v1.3): villagers, folk spirits and your spirit companion, fishing, house building,
 * boats and shrines, krathong and the wau kites over the kampung. Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var T = 16;
  var DIRV = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] };
  function present(S) { return S.minutes >= 6 * 60 && S.minutes < 21 * 60; }   // villagers are home asleep at night

  Object.assign(LC.WorldScene.prototype, {
    // ================================================================ setup
    createFolk: function () {
      var self = this;
      this.folkSpr = {}; this.kites = []; this.fishing = null; this.bobber = null; this.fishLine = null;
      Object.keys(LC.VILLAGERS).forEach(function (vid) { if ((LC.VILLAGERS[vid].area || 'kampung') === self.area) self.placeVillager(vid); });
      this.refreshFolkSpirits();
      this.refreshCompanion();
      if (this.A.kites) {
        [[17, 2, 'wau', 0], [34, 1.5, 'wau2', 2]].forEach(function (k) {
          var img = self.add.image(k[0] * T, k[1] * T, k[2]).setDepth(8800);
          self.kites.push({ img: img, bx: img.x, by: img.y, ph: k[3] });
        });
        this.kiteStrings = this.add.graphics().setDepth(8799);
      }
    },

    // ================================================================ villagers
    placeVillager: function (vid) {
      var home = LC.State.villagerHome(vid);
      if (!home || this.npcs[vid]) return;
      var x = home.x * T + 8, y = (home.y + 1) * T, o = { type: 'npc', vid: vid };
      var spr = this.add.sprite(x, y, 'npc_' + vid + '_0').setOrigin(0.5, 1).setDepth(y);
      spr.play('npc_' + vid + '_idle');
      this.npcs[vid] = { spr: spr, tx: home.x, ty: home.y, o: o, here: null };
    },
    npcAction: function (o) {
      var self = this, v = LC.VILLAGERS[o.vid];
      return { label: 'Talk to ' + v.name, fn: function () { self.ui.openVillager(o.vid); } };
    },

    // ================================================================ houses (gotong-royong)
    refreshPlots: function () {
      var S = this.S, self = this;
      Object.keys(this.plots || {}).forEach(function (id) {
        var b = S.buildings[id], p = self.plots[id];
        p.spr.setTexture(!b ? 'plot' : !b.done ? 'scaffold' : 'house_' + b.style);
        if (b && b.done) self.placeVillager(b.vid);
      });
    },
    plotAction: function (o) {
      var S = this.S, self = this, b = S.buildings[o.id];
      if (!b) return { label: 'Empty plot: build a house', fn: function () { self.ui.openBuild(o.id); } };
      var H = LC.HOUSES[b.style];
      if (!b.done) return { label: 'House going up', fn: function () { self.toast('The ' + H.name + ' is going up! The whole kampung will finish it overnight.', 'i_kayu'); } };
      var v = b.vid && LC.VILLAGERS[b.vid];
      return { label: 'Look', fn: function () { self.ui.say([{ text: (v ? v.name + '\'s ' : 'A ') + H.name + '. ' + H.desc }]); } };
    },
    buildHouse: function (plot, style) {
      var self = this, S = this.S, H = LC.HOUSES[style];
      if (!LC.State.has(H.cost) || S.kepeng < H.kepeng) { LC.Audio.sfx('error'); return false; }
      LC.State.takeAll(H.cost); S.kepeng -= H.kepeng;
      this.doShared('build', { plot: plot, style: style }, function (res) {
        if (!res || !res.ok) {
          Object.keys(H.cost).forEach(function (id) { LC.State.add(id, H.cost[id]); }); S.kepeng += H.kepeng;
          self.toast('Someone already started a house there!'); return;
        }
        LC.Audio.sfx('build');
        var p = self.plots[plot]; if (p) { self.fx.smoke.explode(14, p.spr.x, p.spr.y - 20); self.cameras.main.shake(200, 0.002); }
        S.flags.built = true;
        self.ui.say([{ text: 'Tukang Leong blows a whistle and neighbours come running with poles, ropes and baskets of food.' },
          { name: 'Tok Penghulu', portrait: 'npc_penghulu_0', text: 'Gotong-royong! By tomorrow morning your ' + H.name + ' will be standing. Somebody will be very happy to come home.' }]);
      });
      return true;
    },

    // ================================================================ folk spirits
    refreshFolkSpirits: function () {
      var self = this, S = this.S;
      Object.keys(this.folkSpr).forEach(function (sid) {
        var f = self.folkSpr[sid];
        f.spr.destroy(); f.glow.destroy();
        self.solid[f.ty][f.tx] = f.wasSolid; self.objAt[f.ty][f.tx] = null;
      });
      this.folkSpr = {};
      LC.SPIRIT_ORDER.forEach(function (sid) {
        var sp = LC.SPIRITS[sid];
        if (sp.area !== self.area || S.companion === sid) return;   // a companion travels with you instead
        var x = sp.x * T + 8, y = (sp.y + 1) * T - 2, friend = LC.State.friend(sid);
        var glow = self.add.image(x, y - 10, 'glow').setBlendMode(Phaser.BlendModes.ADD).setDepth(9001).setTint(sp.color).setScale(0.6).setAlpha(0.5);
        var spr = self.add.image(x, y, 'sp_' + sid).setOrigin(0.5, 1).setDepth(y).setAlpha(friend ? 1 : 0.82);
        self.folkSpr[sid] = { spr: spr, glow: glow, y0: y, tx: sp.x, ty: sp.y, wasSolid: self.solid[sp.y][sp.x], ph: Math.random() * 6 };
        self.solid[sp.y][sp.x] = true; self.objAt[sp.y][sp.x] = { type: 'folk', sid: sid };
      });
    },
    folkAction: function (o) {
      var self = this, sp = LC.SPIRITS[o.sid];
      if (!LC.State.friend(o.sid)) return { label: 'Approach the ' + sp.name, fn: function () { self.meetSpirit(o.sid); } };
      return { label: 'Visit the ' + sp.name, fn: function () { self.ui.openFolkSpirit(o.sid); } };
    },
    meetSpirit: function (sid) {
      var self = this, S = this.S, sp = LC.SPIRITS[sid], por = 'sp_' + sid, lines = [];
      if (sp.polite && !S.flags['tabi_' + sid]) {   // Nuno sa Punso: excuse yourself first!
        this.ui.say([{ text: sp.meet }, { text: 'An old saying comes to mind: when you pass a mound, say "tabi-tabi po" (excuse me, please).' }], { choices: [
          { label: 'Say "Tabi-tabi po"', fn: function () { S.flags['tabi_' + sid] = true; LC.Audio.sfx('chime'); self.time.delayedCall(200, function () { self.meetSpirit(sid); }); } },
          { label: 'Just walk past', fn: function () {
            S.energy = Math.max(0, S.energy - 10); LC.Audio.sfx('sad');
            self.time.delayedCall(150, function () { self.ui.say([{ name: sp.name, portrait: por, text: 'Hmph! No manners at all! (Your big toe suddenly aches. -10 energy)' }]); });
          } }
        ] });
        return;
      }
      if (!S.flags['met_' + sid]) { S.flags['met_' + sid] = true; lines.push({ text: sp.meet }); lines.push({ text: sp.lore }); }
      lines.push({ name: sp.name, portrait: por, text: sp.wishText });
      var has = LC.State.has(sp.wish);
      this.ui.say(lines, { choices: has ? [{ label: 'Grant its wish', fn: function () { self.grantWish(sid); } }, { label: 'Not yet' }] : [{ label: 'I\'ll come back with them' }] });
    },
    grantWish: function (sid) {
      var self = this, S = this.S, sp = LC.SPIRITS[sid];
      if (!LC.State.has(sp.wish)) { this.toast('You don\'t have everything it wishes for yet.'); return; }
      LC.State.takeAll(sp.wish);
      this.doShared('befriend', { sid: sid }, function (res) {
        if (!res || !res.ok) { Object.keys(sp.wish).forEach(function (id) { LC.State.add(id, sp.wish[id]); }); if (res) self.toast('The ' + sp.name + ' is already your friend!'); return; }
        LC.Audio.sfx('stage');
        var f = self.folkSpr[sid]; if (f) { self.fx.sparkle.explode(26, f.spr.x, f.spr.y - 10); self.fx.heart.explode(6, f.spr.x, f.spr.y - 14); }
        self.cameras.main.flash(400, 255, 245, 220);
        self.refreshFolkSpirits();
        LC.State.recalc();
        self.ui.say([
          { name: sp.name, portrait: 'sp_' + sid, text: sp.thanks },
          { text: '✦ You befriended the ' + sp.name + '! Pelita is delighted to have a new friend. (+' + res.b + ' bond) ✦' },
          { text: 'Visit it any day to play (Pelita loves that). It can also travel with you as your companion: ask it here, or at Pelita\'s spirit house.' }
        ]);
      });
    },
    playSpirit: function (sid) {
      var self = this, sp = LC.SPIRITS[sid];
      this.doShared('play', { sid: sid }, function (res) {
        if (!res) return;
        if (!res.ok) { self.toast(res.again ? 'You already played with the ' + sp.name + ' today. Come back tomorrow!' : 'It is shy...'); return; }
        LC.Audio.sfx('pet');
        var p = self.compSpr && self.S.companion === sid ? self.compSpr : self.folkSpr[sid] && self.folkSpr[sid].spr;
        if (p) self.fx.heart.explode(5, p.x, p.y - 12);
        if (self.ghostHere) self.setEmote('happy', 2000);
        self.toast('Pelita and the ' + sp.name + ' play tag around you, giggling. (+' + res.b + ' bond)', 'ic_joy');
      });
    },
    setCompanion: function (sid) {
      var S = this.S;
      S.companion = S.companion === sid ? null : sid;
      this.refreshFolkSpirits();
      this.refreshCompanion();
      LC.Audio.sfx('chime');
      this.toast(S.companion ? 'The ' + LC.SPIRITS[sid].name + ' will travel with you now.' : 'The ' + LC.SPIRITS[sid].name + ' floats home.', 'ic_glow');
    },
    refreshCompanion: function () {
      var S = this.S, sid = S.companion;
      if (sid && !LC.State.friend(sid)) sid = S.companion = null;
      if (this.compSpr && this.compKey !== sid) { this.compSpr.destroy(); this.compGlow.destroy(); this.compSpr = null; }
      if (sid && !this.compSpr) {
        var p = this.player;
        this.compGlow = this.add.image(p.x, p.y, 'glow').setBlendMode(Phaser.BlendModes.ADD).setDepth(9001).setTint(LC.SPIRITS[sid].color).setScale(0.5).setAlpha(0.4);
        this.compSpr = this.add.image(p.x - 14, p.y - 4, 'sp_' + sid).setOrigin(0.5, 1).setDepth(9002);
        this.cpos = { x: p.x - 14, y: p.y - 4 };
      }
      this.compKey = sid;
    },
    companionNear: function () {
      var S = this.S, sid = S.companion;
      if (!sid || !this.compSpr) return null;
      var sp = S.spirits[sid];
      if (sp && sp.playDay === S.day) return null;
      return Math.hypot(this.compSpr.x - this.player.x, this.compSpr.y - this.player.y) < 30 ? sid : null;
    },
    updateRemoteCompanion: function (id, r, o, dt) {
      if (!o.cp || !LC.SPIRITS[o.cp]) { if (r.comp) { r.comp.destroy(); r.comp = null; } return; }
      if (!r.comp || r.compKey !== o.cp) { if (r.comp) r.comp.destroy(); r.comp = this.add.image(r.spr.x, r.spr.y, 'sp_' + o.cp).setOrigin(0.5, 1).setDepth(9002).setAlpha(0.9); r.compKey = o.cp; }
      var tx = r.spr.x - 16, ty = r.spr.y - 2, k = Math.min(1, dt * 3);
      r.comp.x += (tx - r.comp.x) * k; r.comp.y += (ty - r.comp.y) * k;
    },

    // ================================================================ under the sea (v1.4)
    diveAction: function (o) {
      var self = this;
      if (!LC.State.isOpen('laut')) return { label: 'Bubbles', fn: function () {
        self.toast(LC.State.friend('naga') ? 'The bubbles call to you... come back when Pelita reaches Lv ' + LC.AREAS.laut.lvl + '.' : 'Bubbles rise from somewhere deep below. Only a friend of the Naga could breathe down there.', 'ic_glow');
      } };
      return { label: 'Dive to Kampung Karang', fn: function () {
        self.ui.say([{ text: 'The Naga\'s blessing tingles in your chest. Take a deep breath and dive down to Kampung Karang, the village beneath the waves?' }], { choices: [
          { label: 'Dive!', fn: function () { LC.Audio.sfx('dive'); self.goArea('laut', null, 'down'); } },
          { label: 'Not now' }
        ] });
      } };
    },
    freeTurtle: function () {
      var self = this, S = this.S, t = this.turtleSpr;
      if (S.flags.turtleFreed || !t) return;
      if (!this.useEnergy(3)) return;
      S.flags.turtleFreed = true;
      LC.State.add('sampah', 1);
      LC.Audio.sfx('chime');
      this.objects.forEach(function (o) { if (o.type === 'turtle') { self.solid[o.y][o.x] = false; self.objAt[o.y][o.x] = null; } });
      t.setTexture('turtle_free');
      this.fx.heart.explode(6, t.x, t.y - 8); this.fx.bubble.explode(12, t.x, t.y - 6);
      this.tweens.add({ targets: t, x: t.x + 140, y: t.y - 70, alpha: 0, delay: 900, duration: 3200, ease: 'Sine.easeIn' });
      this.doShared('kind', { n: 10 }, function (res) {
        self.ui.say([{ text: 'You carefully cut the ghost net away. The sea turtle wriggles free, circles you twice... and glides off into the blue.' },
          { name: 'Tok Duyung', portrait: 'npc_duyung_0', text: 'Hohoho! You saved her! Bring that horrible net to me, child. I will make sure it never hurts anyone again.' },
          { text: 'Pelita glows with pride.' + (res && res.ok ? ' (+' + res.b + ' bond)' : '') }]);
      });
    },

    // ================================================================ boats and shrines
    useBoat: function (o) {
      var self = this, to = o.to, A = LC.AREAS[to];
      if (!LC.State.isOpen(to)) {
        this.toast('Nenek\'s old sampan. The sea is wide and dark... with Pelita (Lv ' + A.lvl + ') to light the way, you could row to ' + A.name + '.', 'i_joran');
        return;
      }
      this.ui.say([{ text: to === 'farm' ? 'Row the sampan back home to Nenek\'s farm?' : 'Row Nenek\'s old sampan across the water to ' + A.name + ', ' + A.sub + '?' }], { choices: [
        { label: 'Row', fn: function () {
          LC.Audio.sfx('water');
          if (!LC.Net.active()) self.S.minutes += 20;   // rowing takes a while
          if (to === 'farm') self.goArea('farm', self.tilePx({ x: 20.5, y: 30.5 }), 'right');
          else self.goArea(to, self.tilePx(A.home), 'down');
        } },
        { label: 'Stay' }
      ] });
    },
    useShrine: function () {
      var self = this;
      if (LC.State.level() < 7) {
        this.ui.say([{ text: 'A little wayside shrine. Travellers leave a flower here and ask for a safe journey.' }, { text: '(When Pelita reaches Lv 7, spirit paths will let you return home from any shrine.)' }]);
        return;
      }
      this.ui.say([{ text: 'A wayside shrine. You feel Pelita\'s light humming inside it, like a path home.' }], { choices: [
        { label: 'Take the spirit path home', fn: function () { LC.Audio.sfx('chime'); self.goArea('farm', self.tilePx({ x: 11, y: 8 }), 'down'); } },
        { label: 'Stay' }
      ] });
    },
    // from Pelita's spirit house (Lv 7+): travel to any place you have visited
    spiritPath: function (area) {
      var A = LC.AREAS[area];
      LC.Audio.sfx('chime');
      this.goArea(area, this.tilePx(A.home), 'down');
    },

    // ================================================================ fishing
    startFishing: function (tx, ty, kind) {
      if (this.fishing) return;
      if (!this.useEnergy(2)) return;
      var self = this, S = this.S, bx = tx * T + 8, by = ty * T + 9;
      this.fishing = { tx: tx, ty: ty, kind: kind };
      this.bobber = this.add.image(bx, by, 'bobber').setOrigin(0.5, 1).setDepth(9004);
      this.bobberY = by;
      this.fishLine = this.add.graphics().setDepth(9004);
      this.bump();
      LC.Audio.sfx('cast');
      this.fx.drop.explode(5, bx, by);
      if (!LC.Net.active()) S.minutes += 8;   // each cast takes a little while
      S.flags.fished = true;
      this.ui.openFishing(kind, function (id) { self.endFishing(id); }, function () { self.bobberBite(); });
    },
    bobberBite: function () {
      if (!this.bobber) return;
      this.tweens.add({ targets: this.bobber, y: this.bobberY + 3, duration: 80, yoyo: true, repeat: 4 });
      this.fx.drop.explode(6, this.bobber.x, this.bobberY);
      var bang = this.add.image(this.player.x, this.player.y - 20, 'bang').setDepth(9600);
      this.tweens.add({ targets: bang, y: bang.y - 4, alpha: 0, delay: 500, duration: 300, onComplete: function () { bang.destroy(); } });
    },
    endFishing: function (id) {
      var S = this.S;
      if (this.bobber) { this.fx.drop.explode(5, this.bobber.x, this.bobberY); this.bobber.destroy(); this.bobber = null; }
      if (this.fishLine) { this.fishLine.destroy(); this.fishLine = null; }
      this.fishing = null;
      if (!id) return;
      var it = LC.ITEMS[id], first = !S.fishLog[id];
      if (!LC.State.add(id, 1)) { this.toast('Your bag is full! You let the ' + it.name + ' go.'); return; }
      S.fishLog[id] = (S.fishLog[id] || 0) + 1;
      if (it.kind === 'fish') S.stats.fish = (S.stats.fish || 0) + 1;
      if (it.kind === 'junk') { LC.Audio.sfx('sad'); this.toast('You fished up an old selipar. Somebody lost a flip-flop!', it.icon); return; }
      LC.Audio.sfx('catch');
      if ((it.diff || 1) >= 3) { this.fx.sparkle.explode(16, this.player.x, this.player.y - 16); this.cameras.main.flash(200, 255, 250, 220); }
      this.toast('You caught ' + (it.kind === 'fish' ? 'a ' : '') + it.name + '!' + (first ? '  (New!)' : '') + ((it.diff || 1) >= 3 ? '  A rare one!' : ''), it.icon);
    },

    // ================================================================ krathong
    floatKrathong: function (tx, ty) {
      var self = this, S = this.S;
      LC.State.remove('krathong', 1);
      this.doShared('krathong', {}, function (res) {
        if (!res || !res.ok) { LC.State.add('krathong', 1); return; }
        var x = tx * T + 8, y = ty * T + 10;
        var k = self.add.image(x, y, 'krathong_fl').setOrigin(0.5, 1).setDepth(y + 1);
        var gl = self.add.image(x, y - 8, 'glow').setBlendMode(Phaser.BlendModes.ADD).setDepth(9001).setTint(0xffc060).setScale(0.5).setAlpha(0.9);
        var river = LC.WATER_TILES[self.grid[ty][tx]] === 'river';
        self.tweens.add({ targets: [k, gl], x: '+=' + (river ? 220 : 50), y: '+=' + (river ? 6 : 24), duration: river ? 24000 : 16000, ease: 'Sine.easeInOut' });
        self.tweens.add({ targets: [k, gl], alpha: 0, delay: river ? 18000 : 11000, duration: 4000, onComplete: function () { k.destroy(); gl.destroy(); } });
        LC.Audio.sfx('offer');
        self.fx.sparkle.explode(10, x, y - 6);
        if (self.ghostHere) self.setEmote('happy', 3000);
        S.flags.krathong = true;
        self.toast('You set the krathong on the water and make a wish. Its little light drifts away... Pelita glows warmly. (+' + res.b + ' bond)', 'i_krathong');
      });
    },

    // ================================================================ per-frame
    updateFolk: function (time, dt) {
      var self = this, S = this.S, here = present(S), p = this.player;
      Object.keys(this.npcs).forEach(function (vid) {
        var n = self.npcs[vid];
        if (n.here !== here) {
          n.here = here; n.spr.setVisible(here);
          self.solid[n.ty][n.tx] = here; self.objAt[n.ty][n.tx] = here ? n.o : null;
        }
        if (here && Math.abs(p.x - n.spr.x) < 60 && Math.abs(p.y - n.spr.y) < 40) n.spr.setFlipX(p.x < n.spr.x - 2);
      });
      Object.keys(this.folkSpr).forEach(function (sid) {
        var f = self.folkSpr[sid], y = f.y0 + Math.round(Math.sin(time / 500 + f.ph) * 1.5);
        f.spr.y = y; f.glow.y = y - 10; f.glow.setAlpha(0.25 + (self.nightF || 0) * 0.45);
      });
      if (this.compSpr) {
        var d = DIRV[this.dir] || DIRV.down, tx = p.x + d[0] * -10 - (d[1] !== 0 ? 14 : 0) + (d[0] !== 0 ? 0 : 0), ty = p.y - 4 - d[1] * 10;
        if (d[0] !== 0) { tx = p.x - d[0] * 22; ty = p.y + 2; }
        var k = Math.min(1, dt * 3);
        this.cpos.x += (tx - this.cpos.x) * k; this.cpos.y += (ty - this.cpos.y) * k;
        var cy = Math.round(this.cpos.y + Math.sin(time / 420) * 1.5);
        this.compSpr.setPosition(Math.round(this.cpos.x), cy).setFlipX(this.cpos.x > p.x);
        this.compGlow.setPosition(Math.round(this.cpos.x), cy - 10).setAlpha(0.15 + (this.nightF || 0) * 0.45);
      }
      if (this.fishLine && this.bobber) {
        var rx = p.x + (this.dir === 'left' ? -8 : this.dir === 'right' ? 8 : 4), ry = p.y - 14;
        this.fishLine.clear(); this.fishLine.lineStyle(1, 0xf5f5f0, 0.8);
        this.fishLine.lineBetween(rx, ry, this.bobber.x, this.bobber.y - 6);
      }
      if (this.kites.length) {
        // wau kites ride the wind high over the kampung, always near the top of the view
        var day = S.minutes >= 7 * 60 && S.minutes < 18 * 60, g = this.kiteStrings, v = this.cameras.main.worldView;
        g.clear();
        this.kites.forEach(function (kt, i) {
          kt.img.setVisible(day);
          if (!day) return;
          kt.img.x = v.centerX + (i ? 75 : -85) + Math.sin(time / 1700 + kt.ph) * 10; kt.img.y = v.y + 30 + i * 10 + Math.sin(time / 1100 + kt.ph) * 5;
          kt.img.setRotation(Math.sin(time / 900 + kt.ph) * 0.12);
          g.lineStyle(1, 0xf5f0e1, 0.55); g.lineBetween(kt.img.x, kt.img.y + 10, kt.img.x + (i ? 50 : -50), v.y + v.height + 20);
        });
      }
    }
  });
})(window.LC);
