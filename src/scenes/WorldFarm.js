/* World, part 3 (v1.5): your farm animals, storage chests, the seasons (monsoon rain), the Bunian glasses and what
 * they reveal, the keris in the stone, the way into the haunted mine and the deep-sea realms, Mak Ani's new stall.
 * Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var T = 16;
  // how each kind of farm animal wanders (same shape as the critter table in World.js)
  var ACRIT = {
    ayam:    { tex: 'chicken', idle: 'chicken_peck', walk: 'chicken_walk', speed: 16, w: 4, near: 8, r: 10, sfx: 'cluck', hop: true },
    serama:  { tex: 'serama', idle: 'serama_peck', walk: 'serama_walk', speed: 18, w: 4, near: 8, r: 10, sfx: 'crow', hop: true },
    itik:    { tex: 'itik', idle: 'itik_peck', walk: 'itik_walk', speed: 12, w: 4, near: 8, r: 10, sfx: 'quack', hop: true },
    kambing: { tex: 'kambing', walk: 'kambing_walk', speed: 9, w: 8, near: 12, r: 14, sfx: 'bleat' },
    anak:    { tex: 'anak', walk: 'anak_walk', speed: 14, w: 3, near: 6, r: 9, sfx: 'cluck', hop: true }
  };
  function critDef(kind) { return ACRIT[kind.indexOf('anak_') === 0 ? 'anak' : kind]; }
  function hearts(love) { var h = Math.floor(love / 4); return h ? new Array(h + 1).join('♥') : 'no ♥ yet'; }

  Object.assign(LC.WorldScene.prototype, {
    createFarmLife: function () {
      var A = this.A;
      this.specs = this.add.image(0, 0, 'specs').setOrigin(0.5, 0.5).setVisible(false);
      this.chestSpr = {}; this.animalCrit = {};
      this.refreshChests();
      this.refreshAnimals();
      this.refreshHidden();
      this.drops = [];
      this.refreshSeason();
      if (A.golden) this.add.particles(0, 0, 'sparkle', { x: { min: 0, max: this.W * T }, y: { min: 0, max: this.H * T }, speedY: { min: -8, max: -3 }, speedX: { min: -4, max: 4 }, lifespan: 3000, alpha: { start: 0.9, end: 0 }, scale: { start: 0.8, end: 0.2 }, frequency: 90, blendMode: 'ADD', tint: 0xffe08a }).setDepth(9004);   // golden motes in the hidden village
    },
    // the monsoon: rain over every open-air place (checked again each morning)
    refreshSeason: function () {
      var A = this.A, rain = LC.State.season().id === 'tengkujuh' && !A.cave && !A.underwater && !A.warm && !A.golden;
      this.raining = rain;
      if (rain && !this.drops.length) for (var i = 0; i < 70; i++) this.drops.push({ img: this.add.image(0, 0, 'rain').setDepth(9005).setAlpha(0.55), v: 160 + Math.random() * 80, init: true });
      if (!rain && this.drops.length) { this.drops.forEach(function (d) { d.img.destroy(); }); this.drops = []; }
      LC.Audio.setRain(rain);
    },

    // ================================================================ chests
    refreshChests: function () {
      var self = this, S = this.S;
      Object.keys(this.chestSpr).forEach(function (cid) {
        var c = self.chestSpr[cid];
        c.img.destroy(); self.solid[c.y][c.x] = false; self.objAt[c.y][c.x] = null;
      });
      this.chestSpr = {};
      Object.keys(S.chests || {}).forEach(function (cid) {
        var c = S.chests[cid];
        if (c.area !== self.area || !self.solid[c.y]) return;
        var by = (c.y + 1) * T, img = self.add.image(c.x * T + 8, by, c.kind).setOrigin(0.5, 1).setDepth(by);
        self.chestSpr[cid] = { img: img, x: c.x, y: c.y };
        self.solid[c.y][c.x] = true; self.objAt[c.y][c.x] = { type: 'chest', cid: cid, kind: c.kind };
      });
    },
    placeChest: function (tx, ty, id) {
      var self = this, it = LC.ITEMS[id];
      LC.State.remove(id, 1);
      this.doShared('chest_place', { area: this.area, x: tx, y: ty, kind: id }, function (res) {
        if (!res || !res.ok) { LC.State.add(id, 1); self.toast('You can\'t put a chest there.'); LC.Audio.sfx('error'); return; }
        LC.Audio.sfx('build'); self.fx.dirt.explode(6, tx * T + 8, ty * T + 12);
        self.toast('You set down the ' + it.name + '. Open it to store things (' + LC.CHESTS[id].slots + ' stacks).', it.icon);
      });
    },

    // ================================================================ farm animals
    refreshAnimals: function () {
      if (this.area !== 'farm') return;
      var self = this, S = this.S, seen = {};
      (S.animals || []).forEach(function (an) {
        seen[an.id] = 1;
        var D = LC.ANIMALS[an.kind], C = critDef(an.kind), c = self.animalCrit[an.id];
        if (c && c.akind !== an.kind) { c.spr.destroy(); self.critters.splice(self.critters.indexOf(c), 1); c = null; }   // a chick grew up
        if (c) return;
        var zone = LC.AREAS.farm.animalZone[D.home], p = self.randomFree(zone);
        var s = self.add.sprite(p.x, p.y, C.tex + '_0').setOrigin(0.5, 1).setDepth(p.y);
        c = { kind: C.tex, def: C, spr: s, zone: zone, tx: p.x, ty: p.y, wait: Math.random() * 2, anim: '', aid: an.id, akind: an.kind };
        self.critters.push(c); self.animalCrit[an.id] = c;
      });
      Object.keys(this.animalCrit).forEach(function (id) {
        if (seen[id]) return;
        var c = self.animalCrit[id]; c.spr.destroy(); self.critters.splice(self.critters.indexOf(c), 1); delete self.animalCrit[id];
      });
    },
    animalAction: function (cr, sl, it) {
      var self = this, S = this.S, an = LC.State.animal(cr.aid);
      if (!an) return null;
      var D = LC.ANIMALS[an.kind];
      if (sl && (sl.id === 'dedak' || sl.id === 'padi') && an.fedDay !== S.day) return { label: 'Feed ' + an.name + ' ' + LC.ITEMS[sl.id].name, fn: function () { self.feedAnimal(an, sl.id, cr); } };
      if (an.petDay !== S.day) return { label: 'Pet ' + an.name + ' the ' + D.name, fn: function () { self.petAnimal(an, cr); } };
      return { label: an.name + ' (' + hearts(an.love) + ')', fn: function () {
        self.toast(an.name + ' the ' + D.name + '. ' + (an.fedDay === S.day ? 'Fed today. ' : 'Hungry! ') + 'Love: ' + hearts(an.love) + '. ' + D.desc, 'ic_joy');
      } };
    },
    feedAnimal: function (an, feed, cr) {
      var self = this;
      LC.State.remove(feed, 1);
      this.doShared('animals_feed', { n: 1, id: an.id }, function (res) {
        if (!res || !res.fed) { LC.State.add(feed, 1); return; }
        LC.Audio.sfx(cr.def.sfx); self.fx.heart.explode(2, cr.spr.x, cr.spr.y - 10);
        self.toast(an.name + ' gobbles up the ' + LC.ITEMS[feed].name + '!', LC.ITEMS[feed].icon);
      });
    },
    petAnimal: function (an, cr) {
      var self = this;
      this.doShared('animal_pet', { id: an.id }, function (res) {
        if (!res || !res.ok) return;
        LC.Audio.sfx(cr.def.sfx); self.fx.heart.explode(4, cr.spr.x, cr.spr.y - 10);
        if (cr.def.hop) { cr.wait = 0; cr.tx = cr.spr.x + (Math.random() - 0.5) * 40; cr.ty = cr.spr.y + (Math.random() - 0.5) * 20; }
        self.toast('You pet ' + res.name + '. It loves you a little more. (' + hearts(res.love) + ')', 'ic_joy');
      });
    },

    // ================================================================ v1.5 things you hold
    toolAction15: function (sl, it, ch, t, tx, ty, hint) {
      var self = this, S = this.S;
      if (it.kind === 'chest') {
        if (this.A.underwater || this.A.cave) return hint('A chest would be lost down here. Put it somewhere on dry land.');
        if (LC.chestSpotOk(this.area, tx, ty) && !this.solid[ty][tx]) return { label: 'Place the ' + it.name, tile: true, fn: function () { self.placeChest(tx, ty, sl.id); } };
        return hint('Face a clear patch of open ground to place the chest.');
      }
      if (it.kind === 'fert') {
        if (t && t.crop && t.crop.g < LC.CROPS[t.crop.id].days) return { label: 'Fertilise the ' + LC.CROPS[t.crop.id].name, tile: true, fn: function () { self.fertilize(tx, ty); } };
        return hint('Face a growing crop in the field to fertilise it.');
      }
      if (it.kind === 'wear') return { label: LC.State.wearing('glasses') ? 'Take off the Bunian glasses' : 'Put on the Bunian glasses', fn: function () { self.toggleGlasses(); } };
      if (it.kind === 'weapon') return hint('No need to fight here! Save your ' + it.name + ' for the shadows of the old mine.');
      if (it.kind === 'gear') return hint('Bring your ' + it.name + ' to the Pesta pavilion in Kampung Tepian. Practise any day, and compete on Sabtu!');
      if (it.kind === 'feed') return hint('Face one of your animals to feed it, or use the reban to feed them all.');
      if (it.kind === 'quest') return hint(it.desc);
      return null;
    },
    fertilize: function (tx, ty) {
      var self = this;
      LC.State.remove('baja', 1);
      this.doShared('fertilize', { x: tx, y: ty }, function (ok) {
        if (!ok) { LC.State.add('baja', 1); return; }
        LC.Audio.sfx('plant'); self.fx.sparkle.explode(8, tx * T + 8, ty * T + 8);
        self.toast('The compost works its magic: the crop grows a day at once!', 'i_baja');
      });
    },
    toggleGlasses: function () {
      var S = this.S;
      if (!LC.State.count('cermin_mata') && !LC.State.wearing('glasses')) { this.toast('You have no glasses to wear.'); return; }
      S.wear.glasses = !S.wear.glasses;
      LC.Audio.sfx(S.wear.glasses ? 'gate' : 'click');
      this.refreshHidden();
      if (S.wear.glasses) this.cameras.main.flash(300, 255, 240, 180);
      this.toast(S.wear.glasses ? 'You put on the Bunian glasses. The world shimmers... there is more here than you knew.' : 'You take off the Bunian glasses.' + (this.area === 'bunian' ? ' The village fades to a soft golden haze, but you can still find the way out.' : ''), 'i_cermin_mata');
    },
    refreshHidden: function () {
      var self = this;
      (this.hiddenObjs || []).forEach(function (h) {
        var on = LC.State.wearing(h.o.hidden), o = h.o;
        if (h.on === on) return;
        h.on = on;
        h.img.setVisible(on);
        if (on && !h.tw) { h.tw = self.tweens.add({ targets: h.img, alpha: 0.75, duration: 1200, yoyo: true, repeat: -1 }); }
        for (var y = o.y; y < o.y + (o.h || 1); y++) for (var x = o.x; x < o.x + (o.w || 1); x++) { self.solid[y][x] = on; self.objAt[y][x] = on ? o : null; }
        if (on && self.fx) self.fx.sparkle.explode(12, h.img.x, h.img.y - 16);
      });
    },

    // ================================================================ the keris, the mine, the deep
    pullKeris: function () {
      var self = this, S = this.S, str = Math.floor(S.str || 0);
      if (str < LC.STR_KERIS) {
        LC.Audio.sfx('strain'); this.cameras.main.shake(250, 0.003);
        this.ui.say([{ text: LC.TEXT.keris_weak }, { text: '(Strength ' + str + ' / ' + LC.STR_KERIS + '. Train silat with Kesuma, lift the batu angkat in Kampung Tepian, and eat good home cooking.)' }]);
        return;
      }
      if (!LC.State.canAdd('keris')) { this.toast('Your bag is full!'); return; }
      S.flags.keris = true; LC.State.add('keris', 1);
      LC.Audio.sfx('stage'); this.cameras.main.flash(700, 255, 250, 220); this.cameras.main.shake(400, 0.004);
      this.fx.sparkle.explode(30, this.player.x, this.player.y - 20);
      this.doShared('kind', { n: 10 }, function () {});
      this.ui.say([
        { text: 'You grip the keris and pull. The stone groans... cracks of light run through it... and the blade slides free, humming like a struck gong!' },
        { name: 'Kesuma', portrait: 'npc_kesuma_0', text: 'Hah! I knew it. Strong in body and kind in heart. The keris has chosen you.' },
        { name: 'Tok Batin', portrait: 'npc_tokbatin_0', text: 'Keris Lok Tujuh, seven waves for seven virtues. Carry it into the dark under the mountain, and the shadows will fear you.' },
        { text: '✦ You got the Keris Lok Tujuh! (Hold it and press USE to swing. Twice as strong as a parang.) ✦' }
      ]);
    },
    portalAction: function (o) {
      var self = this;
      if (!LC.State.isOpen(o.to)) return { label: 'A boarded-up mine shaft', fn: function () { self.ui.say([{ text: LC.TEXT.portal_locked }]); } };
      var armed = ['trisula', 'keris', 'parang', 'tongkat'].some(function (w) { return LC.State.count(w) > 0; });
      return { label: 'Enter Lombong Puaka', fn: function () {
        self.ui.say([{ text: LC.TEXT.portal }].concat(armed ? [] : [{ text: '(You have no weapon! Pak Wan sells a rattan staff, Tukang Leong a parang... or you can make a staff from 4 rotan at the dapur.)' }]), { choices: [
          { label: 'Go down', fn: function () { LC.Audio.sfx('dive'); self.goArea('lombong', self.tilePx(LC.AREAS.lombong.home), 'down'); } },
          { label: 'Not today' }
        ] });
      } };
    },
    seaGateAction: function (o, label) {
      var self = this, A = LC.AREAS[o.to];
      if (!LC.State.isOpen(o.to)) return { label: o.type === 'wreck' ? 'Look' : 'A mysterious passage', fn: function () {
        if (o.type === 'wreck') { self.ui.say([{ text: o.text }]); return; }
        self.toast((o.to === 'kidul' ? 'A soft green light glows beyond the arch, and faint music drifts out.' : 'A trench so deep its bottom glows blue. Something huge sleeps down there.') + ' (Pelita Lv ' + A.lvl + ' could light the way.)', 'ic_glow');
      } };
      return { label: label, fn: function () {
        if (o.type === 'wreck' && !self.S.flags.kapalSeen) { self.S.flags.kapalSeen = true; self.toast('You slip through the hole in the hull...', 'ic_glow'); }
        LC.Audio.sfx('dive'); self.goArea(o.to, self.tilePx(A.home), 'down');
      } };
    },
    refreshLevelThings: function () {
      if (this.warungImgs && LC.State.level() >= 10) { this.warungImgs[0].setTexture('warung2_back'); this.warungImgs[1].setTexture('warung2_front'); }
      var self = this;
      if (this.portalImg) this.objects.forEach(function (o) { if (o.type === 'portal') self.portalImg.setTexture(LC.State.isOpen(o.to) ? o.tex : 'lombong_tutup'); });
    },

    // ================================================================ per-frame
    updateFarmLife: function (time, dt) {
      if (!this.drops.length) return;
      var v = this.cameras.main.worldView;
      this.drops.forEach(function (d) {
        if (d.init || d.img.y > v.bottom + 8 || d.img.x < v.x - 20 || d.img.x > v.right + 20) {
          d.img.x = v.x + Math.random() * (v.width + 20); d.img.y = d.init ? v.y + Math.random() * v.height : v.y - 10 - Math.random() * 30; d.init = false;
        }
        d.img.y += d.v * dt; d.img.x -= d.v * 0.18 * dt;
      });
    }
  });
})(window.LC);
