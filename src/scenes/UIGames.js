/* UI, part 3 (v1.5): the map, storage chests, the reban, the Pesta and its three contests (kite fighting, top
 * spinning, the Serama show), strength training (the batu angkat and silat), the Bunian's request and the deep-sea
 * quests, and the "You" page of the journal. Mixed into LC.UIScene. All games work with one button (E / tap). */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var ACCEPT = { KeyE: 1, Space: 1, Enter: 1 };
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function hearts(love) { var h = Math.floor(love / 4); return h ? new Array(h + 1).join('♥') : 'no ♥ yet'; }
  var MAPCOL = { '.': 0x6aa84f, p: 0xc9a46a, f: 0x8a5a2b, r: 0x7ab8c8, b: 0x8a9a4a, w: 0x3a7ab8, S: 0x5a9ac8, s: 0xe8d8a0, j: 0x9a6a40, J: 0x2e5a2e, F: 0x7a5030,
    g: 0x4f8a3a, q: 0x4a90c8, o: 0x2a5a98, h: 0x4aa0c8, m: 0x8d867a, M: 0x5a544c, k: 0xb8b2a6, G: 0x7ab85a, d: 0xd8905a, R: 0x9a4a2a, u: 0xc2b183, v: 0xe2d6b0,
    C: 0xc85a7a, c: 0x4a4052, X: 0x1e1822, l: 0x6a6a72, W: 0x6a5a48, H: 0x3a2a20, n: 0x3aa88a, a: 0xdce6ee, A: 0xeef4f8 };

  Object.assign(LC.UIScene.prototype, {
    // ================================================================ a frame for the mini-games
    gameFrame: function (title, w, h) {
      this.closeModal();
      var c = this.modalC(95, 0x000000, 0.55), X = 480 - w / 2, Y = 320 - h / 2 - 10;
      var bg = this.add.graphics(); this.panel(bg, X, Y, w, h); c.add(bg);
      c.add(this.txt(480, Y + 14, title, 24, '#ffd166', { ox: 0.5 }));
      var msg = this.txt(480, Y + h - 58, '', 17, '#fbecc8', { ox: 0.5, wrap: w - 60, align: 'center' });
      var hint = this.txt(480, Y + h - 22, this.touchOn ? 'Tap anywhere · X (top) to give up' : 'E / Space / click · Esc to give up', 12, '#8a7a6a', { ox: 0.5 });
      var gg = this.add.graphics(); c.add([gg, msg, hint]);
      return { c: c, X: X, Y: Y, W: w, H: h, msg: msg, g: gg };
    },
    runGame: function (F, press, loop, onQuit) {
      var self = this, m, opened = this.time.now, ev = this.time.addEvent({ delay: 16, loop: true, callback: function () { loop(self.time.now); } });
      function close() { ev.remove(); F.c.destroy(); if (self.modal === m) self.modal = null; }
      m = {
        type: 'game', close: function () { close(); if (onQuit) onQuit(); },
        key: function (code) { if (ACCEPT[code]) { if (self.time.now - opened > 250) press(); } else if (code === 'Escape') { close(); if (onQuit) onQuit(); } },
        click: function () { if (self.time.now - opened > 250) press(); }
      };
      this.modal = m;
      return close;
    },

    // ================================================================ the map
    openMap: function () {
      this.closeModal();
      var self = this, S = this.S, W = this.world, tab = 0, m;
      var c = this.modalC(92, 0x000000, 0.55), X = 90, Y = 40, Wd = 780, Hd = 560;
      var bg = this.add.graphics(); this.panel(bg, X, Y, Wd, Hd); c.add(bg);
      var tabT = ['This place', 'The land'].map(function (l, k) {
        var t = self.txt(X + 40 + k * 170, Y + 18, l, 20, '#cdb8a0').setInteractive({ useHandCursor: true });
        t.on('pointerdown', function () { tab = k; LC.Audio.sfx('click'); render(); });
        c.add(t); return t;
      });
      var keys = this.txt(480, Y + Hd - 22, this.touchOn ? 'Tap a tab to switch  ·  X (top) to close' : 'A/D or Tab switch  ·  M or Esc close', 12, '#8a7a6a', { ox: 0.5 });
      c.add(keys);
      var body = null;
      function render() {
        if (body) body.destroy();
        body = self.add.container(0, 0); c.add(body);
        tabT.forEach(function (t, k) { t.setColor(k === tab ? '#ffd166' : '#8a7a6a'); });
        if (tab === 0) self.drawLocalMap(body, X, Y, Wd, Hd); else self.drawAtlas(body, X, Y, Wd, Hd);
      }
      function close() { c.destroy(); if (self.modal === m) self.modal = null; }
      m = {
        type: 'map', close: close, render: render,
        key: function (code) {
          if (code === 'Escape' || code === 'KeyM') { close(); return; }
          if (/Tab|Arrow(Left|Right)|Key[AD]/.test(code)) { tab = 1 - tab; LC.Audio.sfx('click'); render(); }
        }
      };
      this.modal = m;
      render();
      LC.Audio.sfx('click');
    },
    drawLocalMap: function (body, X, Y, Wd, Hd) {
      var self = this, W = this.world, A = W.A, gr = W.grid, S = this.S, H = gr.length, Wt = gr[0].length;
      var sc = Math.floor(Math.min((Wd - 80) / Wt, (Hd - 150) / H)), mw = Wt * sc, mh = H * sc, ox = Math.round(480 - mw / 2), oy = Y + 92;
      body.add(this.txt(X + Wd - 40, Y + 22, A.name + ' · ' + A.sub, 16, '#fbecc8', { ox: 1 }));
      var g = this.add.graphics(); body.add(g);
      g.fillStyle(0x000000, 0.5); g.fillRect(ox - 4, oy - 4, mw + 8, mh + 8);
      for (var y = 0; y < H; y++) for (var x = 0; x < Wt; x++) { g.fillStyle(MAPCOL[gr[y][x]] || 0x6aa84f, 1); g.fillRect(ox + x * sc, oy + y * sc, sc, sc); }
      W.objects.forEach(function (o) {
        if (o.hidden && !LC.State.wearing(o.hidden)) return;
        var col = { bldg: 0x8a5a3a, house: 0xb8834a, warung: 0xe9c46a, coop: 0xb8834a, pesta: 0xc8323a, shrine: 0xb8a8ff, spirit: 0xb8a8ff, portal: 0x2a1a2a, keris: 0xffe8a0, bunian_gate: 0xffe8a0, plot: 0xd8c890,
          tree: 0x2e6a2e, forage: 0x9be15d, sampan: 0x9a6a40, dive: 0x8fe8ff, surface: 0xe8f8ff, wreck: 0x5a4030, seagate: 0x7affc8, turtle: 0x7a9a4a, dapur: 0xff7a30, well: 0x8fd3ff, lift: 0xa8a296 }[o.type];
        if (!col || o.type === 'torch') return;
        g.fillStyle(col, 1); g.fillRect(ox + o.x * sc, oy + o.y * sc, (o.w || 1) * sc, (o.h || 1) * sc);
      });
      Object.keys(S.chests || {}).forEach(function (id) { var ch = S.chests[id]; if (ch.area !== W.area) return; g.fillStyle(0xd9a94e, 1); g.fillRect(ox + ch.x * sc + 1, oy + ch.y * sc + 1, sc - 2, sc - 2); });
      Object.keys(W.npcs || {}).forEach(function (vid) { var n = W.npcs[vid]; if (!n.here) return; g.fillStyle(0xffd166, 1); g.fillCircle(ox + (n.tx + 0.5) * sc, oy + (n.ty + 0.5) * sc, Math.max(3, sc * 0.45)); });
      A.exits.forEach(function (e) {
        var ex = ox + ((e.x0 + e.x1) / 2 + 0.5) * sc, ey = oy + ((e.y0 + e.y1) / 2 + 0.5) * sc, open = LC.State.isOpen(e.to);
        g.fillStyle(open ? 0xffffff : 0x8a7a6a, 1); g.fillTriangle(ex - 6, ey + (e.dir === 'up' ? 4 : -4), ex + 6, ey + (e.dir === 'up' ? 4 : -4), ex, ey + (e.dir === 'up' ? -6 : 6));
        var lx = Math.max(ox + 70, Math.min(ox + mw - 70, ex)), ly = e.dir === 'up' ? oy - 16 : e.dir === 'down' ? oy + mh + 4 : ey - 22;
        body.add(self.txt(lx, ly, (open ? '' : '(locked) ') + LC.AREAS[e.to].name, 13, open ? '#fffdf2' : '#a08a6a', { ox: 0.5, stroke: 3 }));
      });
      var px = ox + W.player.x / 16 * sc, py = oy + (W.player.y - 6) / 16 * sc;
      if (W.ghostHere && W.ghost) { g.fillStyle(0xb8a8ff, 1); g.fillCircle(ox + W.ghost.x / 16 * sc, oy + W.ghost.y / 16 * sc, Math.max(4, sc * 0.5)); }
      Object.keys(W.remote || {}).forEach(function (id) { var r = W.remote[id]; g.fillStyle(Phaser.Display.Color.HexStringToColor(LC.Art.OUTFIT_COLORS[r.color || 0]).color, 1); g.fillCircle(ox + r.spr.x / 16 * sc, oy + (r.spr.y - 6) / 16 * sc, Math.max(4, sc * 0.55)); });
      var me = this.add.graphics(); body.add(me);
      me.fillStyle(0xffffff, 1); me.fillCircle(px, py, Math.max(5, sc * 0.7)); me.fillStyle(Phaser.Display.Color.HexStringToColor(LC.Art.OUTFIT_COLORS[W.pc || 0]).color, 1); me.fillCircle(px, py, Math.max(3, sc * 0.5));
      this.tweens.add({ targets: me, alpha: 0.3, duration: 400, yoyo: true, repeat: -1 });
      body.add(this.txt(480, oy + mh + 26, '● You (white)   ● Pelita (lilac)   ● Villagers (gold)   ■ Your chests   ▲ Ways out', 13, '#cdb8a0', { ox: 0.5 }));
    },
    drawAtlas: function (body, X, Y, Wd, Hd) {
      var self = this, S = this.S, W = this.world, g = this.add.graphics(); body.add(g);
      function pos(a) { var p = LC.MAP_POS[a]; return { x: X + 100 + p[0] * 145, y: Y + 96 + p[1] * 86 }; }
      var sea = LC.State.season();
      body.add(this.txt(X + Wd - 40, Y + 22, sea.name + ', day ' + LC.State.seasonDay() + ' of 7', 16, sea.color, { ox: 1 }));
      g.fillStyle(0x2a5a98, 0.35); g.fillRoundedRect(X + 30, Y + 96 + 2.55 * 86, 360, 2.1 * 86, 18);   // the sea
      body.add(this.txt(X + 44, Y + 96 + 4.4 * 86, 'the sea', 13, '#8fd3ff'));
      LC.MAP_LINKS.forEach(function (l) {
        var a = pos(l[0]), b = pos(l[1]), seen = S.visited[l[0]] || S.visited[l[1]];
        g.lineStyle(3, seen ? 0xd9a94e : 0x5a4a3a, 1);
        if (!l[2]) { g.lineBetween(a.x, a.y, b.x, b.y); return; }
        var n = 10; for (var i = 0; i < n; i += 2) g.lineBetween(a.x + (b.x - a.x) * i / n, a.y + (b.y - a.y) * i / n, a.x + (b.x - a.x) * (i + 1) / n, a.y + (b.y - a.y) * (i + 1) / n);
      });
      LC.AREA_ORDER.forEach(function (a) {
        var A = LC.AREAS[a], p = pos(a), open = LC.State.isOpen(a), seen = !!S.visited[a], lvOk = LC.State.level() >= A.lvl;
        var hidden = A.wear && !seen && !open, here = W.area === a;
        g.fillStyle(here ? 0x5a4024 : seen ? 0x3a2a1c : 0x1e1814, 1); g.fillRoundedRect(p.x - 64, p.y - 26, 128, 52, 8);
        g.lineStyle(here ? 3 : 2, here ? 0xffd166 : seen ? 0xd9a94e : 0x5a4a3a, 1); g.strokeRoundedRect(p.x - 64, p.y - 26, 128, 52, 8);
        body.add(self.txt(p.x, p.y - 16, hidden ? '???' : (A.mapName || A.name), 14, seen ? '#fbecc8' : open ? '#cdb8a0' : '#7a6a5a', { ox: 0.5, wrap: 124, align: 'center' }));
        body.add(self.txt(p.x, p.y + 8, hidden ? 'hidden' : !lvOk ? 'Pelita Lv ' + A.lvl : !open ? (A.needs ? 'needs a friend' : 'hidden') : seen ? 'visited' : 'new!', 11, !lvOk ? '#a08a6a' : '#9be15d', { ox: 0.5 }));
      });
      var me = pos(W.area);
      var dot = this.add.graphics(); body.add(dot);
      dot.fillStyle(0xffffff, 1); dot.fillCircle(me.x - 52, me.y - 14, 6); dot.fillStyle(Phaser.Display.Color.HexStringToColor(LC.Art.OUTFIT_COLORS[W.pc || 0]).color, 1); dot.fillCircle(me.x - 52, me.y - 14, 4);
      this.tweens.add({ targets: dot, alpha: 0.3, duration: 400, yoyo: true, repeat: -1 });
      var ga = W.ghostArea || 'farm';
      if (LC.MAP_POS[ga]) { var gp = pos(ga); body.add(this.add.image(gp.x + 74, gp.y - 22, LC.ghostTex(S.ghost.stage, 'happy')).setScale(1.4)); }
      body.add(this.txt(480, Y + Hd - 46, '(you are blinking)  ·  Pelita\'s icon shows where it is  ·  dashed lines: by boat, by diving or by secret ways', 13, '#cdb8a0', { ox: 0.5 }));
    },

    // ================================================================ storage chests
    openChest: function (cid) {
      var self = this, S = this.S, W = this.world;
      function chest() { return S.chests[cid]; }
      function roomFor(id) { var r = 0; S.inv.forEach(function (sl) { if (!sl) r += 99; else if (sl.id === id) r += 99 - sl.n; }); return r; }
      function take(id, n) {
        n = Math.min(n, roomFor(id));
        if (n <= 0) { self.toast('Your bag is full!'); LC.Audio.sfx('error'); return; }
        W.doShared('chest_take', { id: cid, item: id, n: n }, function (res) { if (res && res.ok) { LC.State.add(id, res.n); LC.Audio.sfx('click'); } if (self.modal && self.modal.render) self.modal.render(); });
      }
      function store(id) {
        var n = LC.State.count(id);
        if (!n) return;
        LC.State.remove(id, n);
        W.doShared('chest_put', { id: cid, item: id, n: n }, function (res) {
          var put = res ? res.n : 0;
          if (put < n) { LC.State.add(id, n - put); self.toast('The chest is full!'); }
          if (put) LC.Audio.sfx('plant');
          if (self.modal && self.modal.render) self.modal.render();
        });
      }
      var KEEP = { tool: 1, weapon: 1, vehicle: 1, wear: 1 };
      this.openMenu({
        title: LC.ITEMS[(chest() || {}).kind || 'peti_kayu'].name, footer: function () { var c = chest(); return c ? c.items.length + ' / ' + LC.CHESTS[c.kind].slots + ' stacks used. ' + (c.fixed ? 'Your helpers put their work here, and the cook takes her ingredients from it.' : 'Everyone on the farm shares the chests.') : 'The chest is gone.'; },
        tabs: [
          { label: 'Take', empty: 'The chest is empty. Switch to the Store tab to put things in.', rows: function () {
            var c = chest(); if (!c) return [];
            var rows = c.items.length ? [{ icon: 'ic_bond', label: 'Take everything', sub: 'Fill your bag with as much as fits.', action: function () { var seen = {}; c.items.forEach(function (s) { if (!seen[s.id]) { seen[s.id] = 1; take(s.id, 9999); } }); } }] : c.fixed ? [] : [{ icon: c.kind, iconScale: 2, label: 'Pick up the chest', sub: 'Only an empty chest can be moved.', action: function () {
              if (!LC.State.canAdd(c.kind)) { self.toast('Your bag is full!'); return; }
              W.doShared('chest_pick', { id: cid }, function (res) { if (res && res.ok) { LC.State.add(res.kind, 1); LC.Audio.sfx('build'); self.closeModal(); } });
            } }];
            var tot = {};
            c.items.forEach(function (s) { tot[s.id] = (tot[s.id] || 0) + s.n; });
            Object.keys(tot).forEach(function (id) { var it = LC.ITEMS[id]; rows.push({ icon: it.icon, label: it.name + '  x' + tot[id], sub: it.desc, right: 'Take', action: function () { take(id, tot[id]); } }); });
            return rows;
          } },
          { label: 'Store', empty: 'Your bag is empty.', rows: function () {
            var seen = {}, rows = [{ icon: 'ic_bond', label: 'Store everything (not tools)', sub: 'Keeps your tools, weapons, vehicles and glasses in the bag.', action: function () {
              var ids = {}; S.inv.forEach(function (sl) { if (sl && !KEEP[LC.ITEMS[sl.id].kind]) ids[sl.id] = 1; });
              Object.keys(ids).forEach(store);
            } }];
            S.inv.forEach(function (sl) {
              if (!sl || seen[sl.id]) return; seen[sl.id] = 1;
              var it = LC.ITEMS[sl.id];
              rows.push({ icon: it.icon, label: it.name + '  x' + LC.State.count(sl.id), sub: it.desc, right: 'Store', action: function () { store(sl.id); } });
            });
            return rows;
          } }
        ]
      });
    },

    // ================================================================ the reban
    openCoop: function () {
      var self = this, S = this.S, W = this.world;
      function unfed() { return S.animals.filter(function (a) { return a.fedDay !== S.day; }).length; }
      this.openMenu({
        title: 'Nenek\'s Reban', footer: function () { return 'Birds ' + (LC.ANIMAL_ROOM.coop - LC.State.animalRoom('coop')) + ' / ' + LC.ANIMAL_ROOM.coop + '  ·  Goats ' + (LC.ANIMAL_ROOM.pen - LC.State.animalRoom('pen')) + ' / ' + LC.ANIMAL_ROOM.pen + '  ·  Pak Lah in Kampung Tepian sells more animals.'; },
        tabs: [
          { label: 'Reban', rows: function () {
            var rows = [], u = unfed(), dk = LC.State.count('dedak'), pd = LC.State.count('padi'), cp = S.coop || {};
            if (!S.animals.length) rows.push({ icon: 'chicken_0', iconScale: 2, label: 'The reban is empty', sub: LC.TEXT.coop_empty });
            else rows.push({ icon: 'i_dedak', label: u ? 'Feed the animals (' + u + ' hungry)' : 'Everyone has eaten today', sub: 'Uses 1 dedak (or padi) each. You have ' + dk + ' dedak and ' + pd + ' padi.', enabled: u > 0 && dk + pd > 0, why: u ? 'You need dedak or padi. Mak Ani and Pak Lah sell dedak.' : 'They are all full!',
              action: function () {
                var n = Math.min(u, dk + pd), useD = Math.min(n, dk), useP = n - useD;
                if (useD) LC.State.remove('dedak', useD); if (useP) LC.State.remove('padi', useP);
                W.doShared('animals_feed', { n: n }, function (res) {
                  var fed = res ? res.fed : 0, back = n - fed;
                  if (back > 0) { var bp = Math.min(back, useP); if (bp) LC.State.add('padi', bp); if (back - bp) LC.State.add('dedak', back - bp); }
                  if (fed) { LC.Audio.sfx('cluck'); self.toast('You fill the feeder. ' + fed + ' happy animal' + (fed > 1 ? 's' : '') + '!', 'i_dedak'); }
                  if (self.modal && self.modal.render) self.modal.render();
                });
              } });
            var have = (cp.telur || 0) + (cp.telur_itik || 0) + (cp.susu || 0);
            rows.push({ icon: 'i_telur', label: have ? 'Collect: ' + [cp.telur ? cp.telur + ' telur' : '', cp.telur_itik ? cp.telur_itik + ' telur itik' : '', cp.susu ? cp.susu + ' susu' : ''].filter(Boolean).join(', ') : 'Nothing to collect yet', sub: 'Fed hens and ducks lay every night. Goats give milk every other day.', enabled: have > 0, why: 'Feed your animals today and they will make something tonight.',
              action: function () {
                W.doShared('coop_collect', {}, function (res) {
                  if (!res || !res.ok) return;
                  var back = {}, got = [];
                  Object.keys(res.got).forEach(function (k) { var n = res.got[k]; for (var i = 0; i < n; i++) { if (LC.State.add(k, 1)) got.push(k); else back[k] = (back[k] || 0) + 1; } });
                  if (Object.keys(back).length) { W.doShared('coop_return', { got: back }, function () {}); self.toast('Your bag is full! The rest stays in the reban.'); }
                  if (got.length) { LC.Audio.sfx('harvest'); self.toast('You collected ' + got.length + ' item' + (got.length > 1 ? 's' : '') + ' from the reban.', 'i_' + got[0]); }
                  if (self.modal && self.modal.render) self.modal.render();
                });
              } });
            ['telur', 'telur_itik'].forEach(function (egg) {
              var n = LC.State.count(egg); if (!n && egg === 'telur_itik') return;
              rows.push({ icon: 'i_' + egg, label: 'Put a ' + LC.ITEMS[egg].name + ' in the nest  (' + S.nest.length + ' / 3)', sub: 'A hen sits on it, and it hatches after three nights' + (egg === 'telur' && LC.State.hasSerama() ? ' (your Serama makes a Serama chick more likely!)' : '') + '.',
                enabled: n > 0 && S.nest.length < 3, why: n ? 'The nest is full.' : 'You need a ' + LC.ITEMS[egg].name + '.',
                action: function () {
                  LC.State.remove(egg, 1);
                  W.doShared('nest_add', { egg: egg }, function (res) { if (!res || !res.ok) { LC.State.add(egg, 1); return; } LC.Audio.sfx('hatch'); self.toast('A hen settles on the egg. Three nights to go!', 'i_' + egg); if (self.modal && self.modal.render) self.modal.render(); });
                } });
            });
            S.animals.filter(function (a) { return a.kind === 'serama'; }).forEach(function (a) {
              rows.push({ icon: 'i_sikat', label: 'Groom ' + a.name + ' the Serama', sub: a.groomDay === S.day ? 'Shiny and proud today!' : 'Brush the feathers with a sikat before a show (+love).', enabled: a.groomDay !== S.day && LC.State.count('sikat') > 0, why: LC.State.count('sikat') ? 'Already groomed today.' : 'You need a sikat (Pak Lah sells them).',
                action: function () { W.doShared('animal_groom', { id: a.id }, function (res) { if (res && res.ok) { LC.Audio.sfx('crow'); self.toast(a.name + ' puffs out its chest. Kokok!', 'serama_0'); } if (self.modal && self.modal.render) self.modal.render(); }); } });
            });
            return rows;
          } },
          { label: 'Animals', empty: 'No animals yet. Pak Lah in Kampung Tepian sells hens, ducks, Serama and goats.', rows: function () {
            return S.animals.map(function (a) {
              var D = LC.ANIMALS[a.kind], tex = (a.kind.indexOf('anak_') === 0 ? 'anak' : D.tex) + '_0';
              var info = D.grows ? 'Grows up in ' + Math.max(1, D.days - (S.day - a.born)) + ' day(s).' : D.produce ? 'Gives ' + LC.ITEMS[D.produce].name + (D.every > 1 ? ' every ' + D.every + ' days' : ' every day') + ' when fed.' : 'A show bird for the Pesta.';
              return { icon: tex, iconScale: 2, label: a.name + ' the ' + D.name, sub: hearts(a.love) + '  ·  ' + (a.fedDay === S.day ? 'fed today' : 'hungry!') + '  ·  ' + info,
                right: a.petDay === S.day ? '' : 'Pet', action: function () { W.doShared('animal_pet', { id: a.id }, function (res) { if (res && res.ok) { LC.Audio.sfx(D.sfx); self.toast('You pet ' + a.name + '. (' + hearts(res.love) + ')', 'ic_joy'); } if (self.modal && self.modal.render) self.modal.render(); }); } };
            });
          } }
        ]
      });
    },
    animalShopRows: function (v) {
      var self = this, S = this.S, W = this.world;
      return (v.animals || []).map(function (k) {
        var D = LC.ANIMALS[k], room = LC.State.animalRoom(D.home), afford = S.kepeng >= D.price;
        return { icon: D.tex + '_0', iconScale: 2, label: D.name, sub: D.desc + ' (Room at your ' + (D.home === 'pen' ? 'goat pen' : 'reban') + ': ' + room + ')', right: D.price + ' k', enabled: afford && room > 0, why: room <= 0 ? 'No more room at the farm.' : 'Not enough kepeng.',
          action: function () {
            S.kepeng -= D.price;
            W.doShared('animal_add', { kind: k }, function (res) {
              if (!res || !res.ok) { S.kepeng += D.price; self.toast('There is no room for it!'); return; }
              LC.Audio.sfx(D.sfx); self.toast(res.name + ' the ' + D.name + ' is waiting for you at Nenek\'s ' + (D.home === 'pen' ? 'goat pen' : 'reban') + '!', D.tex + '_0');
              if (self.modal && self.modal.render) self.modal.render();
            });
          } };
      });
    },

    // ================================================================ the Pesta
    openPesta: function () {
      var self = this, S = this.S, on = LC.State.isPesta() && S.minutes >= LC.PESTA_OPEN && S.minutes < LC.PESTA_CLOSE, days = LC.State.daysToPesta();
      var when = on ? 'The Pesta is on! Win three rounds to be champion.' : LC.State.isPesta() ? (S.minutes < LC.PESTA_OPEN ? 'The Pesta opens at 8 AM today.' : 'The Pesta is over for today. See you next Sabtu!') : 'The next Pesta is on Sabtu, in ' + days + ' day' + (days > 1 ? 's' : '') + '.';
      this.openMenu({
        title: 'Pesta Kampung', footer: when + ' Practise any day, for no prize.',
        tabs: [{ label: 'Contests', rows: function () {
          var rows = [];
          Object.keys(LC.CONTESTS).forEach(function (k) {
            var C = LC.CONTESTS[k];
            if (C.show && !C.show()) return;   // v1.7: Lempar Batu appears once you have met Badang
            var ready = self.contestReady(k), entered = S.contest[k] === S.day, wins = (S.trophies[k] || 0);
            if (on) rows.push({ icon: C.icon, iconScale: k === 'serama' ? 2 : 2, label: 'Enter the ' + C.name + ' (' + C.what.toLowerCase() + ')', sub: (ready.ok ? C.how : ready.why) + (wins ? '  Champion ' + wins + 'x!' : ''),
              right: entered ? 'Done' : 'Enter', enabled: ready.ok && !entered, why: entered ? 'You already competed today. Come back next Sabtu!' : ready.why, action: function () { self.runContest(k, false); } });
            rows.push({ icon: C.icon, iconScale: 2, label: 'Practise: ' + C.what, sub: ready.ok ? 'A friendly round, no prizes. ' + C.how : ready.why, right: 'Try', enabled: ready.ok, why: ready.why, action: function () { self.runContest(k, true); } });
          });
          return rows;
        } }]
      });
    },
    contestReady: function (k) {
      var C = LC.CONTESTS[k];
      if (C.ready) return C.ready();
      if (C.animal) return LC.State.hasSerama() ? { ok: true } : { ok: false, why: 'You need an Ayam Serama from your reban (Pak Lah sells them).' };
      return C.gear.some(function (g) { return LC.State.count(g) > 0; }) ? { ok: true } : { ok: false, why: 'You need a ' + LC.ITEMS[C.gear[1]].name + ' (Pak Wan sells them, next to the pavilion).' };
    },
    runContest: function (k, practice) {
      var self = this, S = this.S, C = LC.CONTESTS[k], round = 0, wauBoost = k === 'wau' && LC.State.season().id === 'kemarau' ? 2 : 1;
      if (!practice) S.contest[k] = S.day;
      function play() {
        var rival = C.rivals[round];
        var fn = C.play ? self[C.play] : k === 'wau' ? self.playWau : k === 'gasing' ? self.playGasing : self.playSerama;
        fn.call(self, round, rival, function (win, detail) {
          LC.Audio.sfx(win ? 'cheer' : 'sad');
          var lines = [{ text: detail }];
          if (!win) { lines.push({ text: practice ? 'Practice makes perfect. Try again any time!' : 'Out in round ' + (round + 1) + '. Better luck next Sabtu!' }); self.say(lines); return; }
          if (round < 2) {
            if (!practice) { var pz = LC.CONTEST_ROUND_PRIZE[round] * wauBoost; S.kepeng += pz; S.stats.earned += pz; lines.push({ text: 'Round ' + (round + 1) + ' won! (+' + pz + ' kepeng) Next up: ' + C.rivals[round + 1] + '.' }); }
            else lines.push({ text: 'Round ' + (round + 1) + ' won! Next: ' + C.rivals[round + 1] + '.' });
            round++;
            self.say(lines, { onDone: play });
            return;
          }
          if (practice) { lines.push({ text: 'You beat all three in practice! You are ready for Sabtu.' }); self.say(lines); return; }
          lines.push({ text: C.champLine || '✦ CHAMPION of the ' + C.name + '! ✦ The whole kampung cheers.' });
          lines.push({ text: self.contestPrize(k, wauBoost) });
          if (C.onChamp) C.onChamp.call(self, lines);
          S.stats.contestWins = (S.stats.contestWins || 0) + 1;
          self.world.doShared('kind', { n: 6 }, function () {});
          self.say(lines);
        });
      }
      play();
    },
    contestPrize: function (k, boost) {
      var S = this.S, C = LC.CONTESTS[k], out = [], r = Math.random();
      S.trophies[k] = (S.trophies[k] || 0) + 1;
      if (S.trophies[k] === 1 && LC.State.add(C.trophy, 1)) out.push('the ' + LC.ITEMS[C.trophy].name);
      if (r >= 0.45 && !LC.State.canAdd(LC.CONTEST_RARE[0]) && S.inv.indexOf(null) < 0) r = 0;   // bag full: take the money instead
      if (r < 0.45) { var kp = Math.round(rnd(150, 300) / 10) * 10 * boost; S.kepeng += kp; S.stats.earned += kp; out.push(kp + ' kepeng'); }
      else if (r < 0.8) { var f = LC.CONTEST_FOOD[Math.floor(Math.random() * LC.CONTEST_FOOD.length)], n = 2 + Math.floor(Math.random() * 2); LC.State.add(f, n); out.push(n + ' ' + LC.ITEMS[f].name); }
      else { var rr = LC.CONTEST_RARE[Math.floor(Math.random() * LC.CONTEST_RARE.length)]; LC.State.add(rr, 1); out.push('a rare ' + LC.ITEMS[rr].name + '!'); }
      return 'Tok Penghulu hands you your prize: ' + out.join(', and ') + '.';
    },

    // ---------------------------------------------------------------- kite fighting (layang-layang aduan)
    playWau: function (round, rival, done) {
      var self = this, F = this.gameFrame('Wau Aduan · Round ' + (round + 1) + ' vs ' + rival, 640, 420), g = F.g, X = F.X, Y = F.Y;
      var zw = LC.State.count('wau_bulan') ? 0.32 : 0.24, rate = [0.055, 0.075, 0.095][round], t = 0.4, you = 0, them = 0, over = false, t0 = this.time.now, last = t0, ph = Math.random() * 6;
      var myK = this.add.image(X + 220, Y + 150, LC.State.count('wau_bulan') ? 'wau2' : 'wau').setScale(3), riK = this.add.image(X + 420, Y + 140, 'wau2').setScale(3).setTint(0xffb0b0);
      var tYou = this.txt(X + 40, Y + 54, 'You', 14, '#fbecc8'), tThem = this.txt(X + 600, Y + 54, rival, 14, '#fbecc8', { ox: 1 });
      F.c.add([myK, riK, tYou, tThem]);
      F.msg.setText('Tap to pull the string. Keep the marker in the green!');
      LC.Audio.sfx('wind');
      var close = this.runGame(F, function () { if (over) return; t = Math.min(1.05, t + 0.15); LC.Audio.sfx('reel'); }, function (now) {
        var dt = Math.min(0.05, (now - last) / 1000), el = (now - t0) / 1000; last = now;
        if (!over) {
          t = Math.max(0, t - 0.42 * dt);
          var zc = 0.5 + 0.26 * Math.sin(el * 0.7 + ph) + 0.08 * Math.sin(el * 1.9), z0 = zc - zw / 2;
          if (t > 0.97) { you = Math.max(0, you - 0.12); t = 0.55; F.msg.setText('Too tight! The string slipped.').setColor('#ff8a7a'); LC.Audio.sfx('strain'); }
          else if (t >= z0 && t <= z0 + zw) { you += 0.11 * dt; F.msg.setText('Hold it... cutting their string!').setColor('#b8f0c8'); }
          else F.msg.setText(t < z0 ? 'Pull! (tap)' : 'Ease off a little...').setColor('#fbecc8');
          them += rate * dt * (0.6 + 0.8 * Math.abs(Math.sin(el * 1.3 + ph)));
          if (you >= 1 || them >= 1 || el > 22) {
            over = true; var win = you >= them;
            self.tweens.add({ targets: win ? riK : myK, x: '+=' + (win ? 160 : -160), y: '+=' + 140, angle: win ? 200 : -200, alpha: 0, duration: 1300 });
            F.msg.setText(win ? 'Snap! Their kite drifts away!' : 'Snap! Your kite drifts away...').setColor(win ? '#b8f0c8' : '#ff8a7a');
            self.time.delayedCall(1500, function () { close(); done(win, win ? 'Your wau cut ' + rival + '\'s string. It spins away over the padi fields!' : rival + '\'s wau cut your string. Your kite floats off towards the river...'); });
          }
          myK.setPosition(X + 220 + Math.sin(el * 1.6) * 14, Y + 150 + Math.cos(el * 2.1) * 8 - (t - 0.5) * 30).setRotation(Math.sin(el * 1.4) * 0.15);
          riK.setPosition(X + 420 + Math.sin(el * 1.3 + 2) * 14, Y + 140 + Math.cos(el * 1.7 + 1) * 8).setRotation(Math.sin(el * 1.2 + 1) * 0.15);
        }
        g.clear();
        for (var i = 0; i < 6; i++) { g.fillStyle([0x7ab8e8, 0x8ac4ec, 0x9ad0f0, 0xaadaf2, 0xbae2f4, 0xcae8f6][i], 1); g.fillRect(X + 24, Y + 76 + i * 30, F.W - 48, 30); }
        g.fillStyle(0x6aa84f, 1); g.fillRect(X + 24, Y + 256, F.W - 48, 34); g.fillStyle(0xd8c070, 1); for (var x = X + 30; x < X + F.W - 30; x += 22) g.fillRect(x, Y + 262 + (x % 3) * 4, 12, 3);
        g.lineStyle(1, 0xffffff, 0.8); g.lineBetween(myK.x, myK.y + 20, X + 120, Y + 290); g.lineBetween(riK.x, riK.y + 20, X + 520, Y + 290);
        self.bar(g, X + 40, Y + 72, 220, 10, you, 0x9be15d); self.bar(g, X + 380, Y + 72, 220, 10, them, 0xff7a7a);
        var BX = X + 70, BW = F.W - 140, BY = Y + 306, el2 = (now - t0) / 1000, zc2 = 0.5 + 0.26 * Math.sin(el2 * 0.7 + ph) + 0.08 * Math.sin(el2 * 1.9);
        g.fillStyle(0x000000, 0.6); g.fillRect(BX, BY, BW, 16);
        g.fillStyle(0x6fd06a, 1); g.fillRect(BX + Math.max(0, zc2 - zw / 2) * BW, BY + 1, zw * BW, 14);
        g.fillStyle(0xe76f51, 1); g.fillRect(BX + 0.97 * BW, BY + 1, 0.03 * BW, 14);
        g.fillStyle(0xffd166, 1); g.fillRect(BX + Math.min(1, t) * BW - 2, BY - 5, 4, 26);
      }, function () { done(false, 'You reel in your kite and step out of the contest.'); });
    },

    // ---------------------------------------------------------------- top spinning (gasing uri)
    playGasing: function (round, rival, done) {
      var self = this, F = this.gameFrame('Gasing Uri · Round ' + (round + 1) + ' vs ' + rival, 600, 400), g = F.g, X = F.X, Y = F.Y;
      var phase = 'power', power = 0, acc = 0, t0 = this.time.now, mine = 0, theirs = rnd.apply(null, [[30, 50], [42, 62], [52, 72]][round]), clock = 0, last = t0, big = LC.State.count('gasing_uri') > 0;
      var topA = this.add.sprite(X + 210, Y + 190, 'gasing_0').setScale(4).setVisible(false), topB = this.add.sprite(X + 390, Y + 190, 'gasing_0').setScale(4).setVisible(false).setTint(0xffc0c0);
      var tA = this.txt(X + 210, Y + 236, '', 18, '#fbecc8', { ox: 0.5 }), tB = this.txt(X + 390, Y + 236, '', 18, '#fbecc8', { ox: 0.5 });
      F.c.add([this.txt(X + 210, Y + 262, 'You', 14, '#cdb8a0', { ox: 0.5 }), this.txt(X + 390, Y + 262, rival, 14, '#cdb8a0', { ox: 0.5 }), topA, topB, tA, tB]);
      F.msg.setText('Wind the cord: tap when the power is HIGH!');
      var close = this.runGame(F, function () {
        var el = (self.time.now - t0) / 1000;
        if (phase === 'power') { power = 0.5 - 0.5 * Math.cos(el * 2.6); phase = 'aim'; t0 = self.time.now; LC.Audio.sfx('reel'); F.msg.setText('Now throw: tap when the marker is in the centre!'); }
        else if (phase === 'aim') {
          var a = 0.5 + 0.5 * Math.sin(el * 3.2); acc = Math.max(0, 1 - Math.abs(a - 0.5) * 2);
          mine = 25 + 45 * power * (0.45 + 0.55 * acc) + (big ? 12 : 0);
          phase = 'spin'; last = self.time.now; LC.Audio.sfx('spin');
          topA.setVisible(true).play('gasing_walk'); topB.setVisible(true).play('gasing_walk');
          F.msg.setText('Spinning... (' + Math.round(power * 100) + '% power, ' + Math.round(acc * 100) + '% aim)');
        }
      }, function (now) {
        var el = (now - t0) / 1000;
        g.clear();
        g.fillStyle(0xc9a46a, 1); g.fillEllipse(X + 300, Y + 200, 420, 110); g.lineStyle(3, 0x8a5a2b, 1); g.strokeEllipse(X + 300, Y + 200, 420, 110);
        if (phase === 'power') { var p = 0.5 - 0.5 * Math.cos(el * 2.6); self.bar(g, X + 120, Y + 300, 360, 16, p, p > 0.8 ? 0x9be15d : 0xffd166); }
        if (phase === 'aim') {
          var a = 0.5 + 0.5 * Math.sin(el * 3.2), BX = X + 120, BW = 360;
          g.fillStyle(0x000000, 0.6); g.fillRect(BX, Y + 300, BW, 16); g.fillStyle(0x6fd06a, 1); g.fillRect(BX + 0.42 * BW, Y + 301, 0.16 * BW, 14);
          g.fillStyle(0xffd166, 1); g.fillRect(BX + a * BW - 2, Y + 295, 4, 26);
        }
        if (phase === 'spin' || phase === 'end') {
          var dt = Math.min(0.05, (now - last) / 1000); last = now;
          if (phase === 'spin') clock += dt * 9;
          tA.setText(Math.min(clock, mine).toFixed(1) + ' s'); tB.setText(Math.min(clock, theirs).toFixed(1) + ' s');
          [[topA, mine], [topB, theirs]].forEach(function (q) { if (clock >= q[1] && q[0].anims.isPlaying) { q[0].stop(); self.tweens.add({ targets: q[0], angle: 80, y: q[0].y + 8, duration: 400 }); LC.Audio.sfx('click'); } });
          if (phase === 'spin' && clock >= Math.max(mine, theirs)) {
            phase = 'end'; var win = mine >= theirs;
            F.msg.setText(win ? 'Your gasing spins the longest!' : rival + '\'s gasing spins longer...').setColor(win ? '#b8f0c8' : '#ff8a7a');
            self.time.delayedCall(1300, function () { close(); done(win, 'Your gasing spun for ' + mine.toFixed(1) + ' seconds; ' + rival + '\'s spun for ' + theirs.toFixed(1) + '.' + (win ? ' The crowd roars!' : '')); });
          }
        }
      }, function () { done(false, 'You pick up your gasing and bow out.'); });
    },

    // ---------------------------------------------------------------- the Serama show
    playSerama: function (round, rival, done) {
      var self = this, S = this.S, best = S.animals.filter(function (a) { return a.kind === 'serama'; }).sort(function (a, b) { return b.love - a.love; })[0];
      var F = this.gameFrame('Ratu Serama · Round ' + (round + 1) + ' vs ' + rival + '\'s bird', 600, 420), g = F.g, X = F.X, Y = F.Y;
      var care = Math.min(30, best.love * 1.5) + (best.groomDay === S.day ? 10 : 0) + (best.fedDay === S.day ? 5 : 0);
      var poses = ['Chest out! (Dada!)', 'Tail up! (Ekor!)', 'Stand tall! (Tegak!)'], k = 0, score = 0, t0 = this.time.now, over = false, theirs = Math.round(rnd.apply(null, [[40, 55], [52, 66], [62, 80]][round]));
      var bird = this.add.sprite(X + 300, Y + 230, 'serama_0').setScale(7).setOrigin(0.5, 1);
      var tCare = this.txt(X + 40, Y + 60, best.name + ': care ' + Math.round(care) + ' / 45 (love ' + hearts(best.love) + (best.groomDay === S.day ? ', groomed' : ', not groomed') + ')', 14, '#cdb8a0');
      var tScore = this.txt(X + F.W - 40, Y + 60, '', 16, '#ffd166', { ox: 1 });
      F.c.add([bird, tCare, tScore]);
      F.msg.setText(poses[0] + '  Tap when the marker is in the centre.');
      var close = this.runGame(F, function () {
        if (over) return;
        var el = (self.time.now - t0) / 1000, pos = 0.5 + 0.5 * Math.sin(el * (2.6 + k * 0.7 + round * 0.3)), a = Math.max(0, 1 - Math.abs(pos - 0.5) * 2.2), pts = Math.round(a * 18);
        score += pts; k++; t0 = self.time.now;
        LC.Audio.sfx('crow');
        self.tweens.add({ targets: bird, scaleY: 7.8, scaleX: 6.6, y: bird.y - 10, duration: 140, yoyo: true });
        bird.setTexture('serama_' + (k % 3));
        if (k >= 3) {
          over = true; var total = Math.round(care + score), win = total >= theirs;
          tScore.setText('Score ' + total);
          F.msg.setText('The judges add up the scores...').setColor('#ffd166');
          self.time.delayedCall(1400, function () { close(); done(win, 'The judges give ' + best.name + ' ' + total + ' points, and ' + rival + '\'s bird ' + theirs + '.' + (win ? ' ' + best.name + ' struts off proudly!' : '')); });
        } else F.msg.setText((pts >= 14 ? 'Beautiful! ' : pts >= 8 ? 'Nice. ' : 'Hmm. ') + poses[k] + '  Tap in the centre.');
        tScore.setText('Poses ' + score + ' / 54');
      }, function (now) {
        g.clear();
        g.fillStyle(0x8a5a2b, 1); g.fillRect(X + 200, Y + 230, 200, 14); g.fillStyle(0xc8323a, 1); g.fillRect(X + 200, Y + 230, 200, 4);
        if (over) return;
        var el = (now - t0) / 1000, pos = 0.5 + 0.5 * Math.sin(el * (2.6 + k * 0.7 + round * 0.3)), BX = X + 120, BW = 360, BY = Y + 300;
        g.fillStyle(0x000000, 0.6); g.fillRect(BX, BY, BW, 16); g.fillStyle(0x6fd06a, 1); g.fillRect(BX + 0.41 * BW, BY + 1, 0.18 * BW, 14);
        g.fillStyle(0xffd166, 1); g.fillRect(BX + pos * BW - 2, BY - 5, 4, 26);
      }, function () { done(false, 'You scoop up ' + best.name + ' and leave the stage.'); });
    },

    // ================================================================ strength training
    openLift: function () {
      var self = this, S = this.S;
      if (S.liftDay === S.day) { this.say([{ text: LC.TEXT.lift }, { text: 'Your arms are still shaking from this morning. Come back tomorrow!' }]); return; }
      if (S.energy < 12) { this.toast('You are too tired to lift it. Eat something first.'); return; }
      S.liftDay = S.day; S.energy -= 12;
      var F = this.gameFrame('Batu Angkat', 520, 380), g = F.g, X = F.X, Y = F.Y, p = 0, sum = 0, n = 0, t0 = this.time.now, last = t0, over = false;
      var stone = this.add.image(X + 260, Y + 230, 'batu_angkat').setScale(4).setOrigin(0.5, 1);
      F.c.add(stone);
      F.msg.setText('Tap as fast as you can to lift the stone!');
      var close = this.runGame(F, function () { if (!over) { p = Math.min(1, p + 0.075); if (Math.random() < 0.3) LC.Audio.sfx('strain'); } }, function (now) {
        var dt = Math.min(0.05, (now - last) / 1000), el = (now - t0) / 1000; last = now;
        if (!over) {
          p = Math.max(0, p - 0.35 * dt); sum += p; n++;
          stone.y = Y + 230 - p * 70; stone.setAngle(Math.sin(now / 60) * p * 3);
          if (el >= 5) {
            over = true; var avg = sum / n, gain = avg < 0.3 ? 1 : avg < 0.5 ? 2 : avg < 0.7 ? 3 : 4, got = LC.State.gainStr(gain);
            LC.Audio.sfx(gain >= 3 ? 'cheer' : 'levelup');
            F.msg.setText((gain >= 3 ? 'You hold it high above your head!' : 'You heave it up... and down. Oof.') + '  +' + got + ' strength').setColor('#b8f0c8');
            self.time.delayedCall(1500, function () { close(); self.toast('Training done! Strength ' + Math.floor(S.str) + ' / ' + LC.STR_MAX + '.', 'ic_str'); });
          }
        }
        g.clear();
        self.bar(g, X + 80, Y + 270, 360, 18, p, p > 0.7 ? 0x9be15d : 0xffd166);
        self.bar(g, X + 80, Y + 60, 360, 6, Math.min(1, (now - t0) / 5000), 0xb8a8ff);
      });
    },
    openSilat: function () {
      var self = this, S = this.S;
      if (S.silatDay === S.day) { this.toast('Kesuma: "Rest now. A tired body learns nothing. Tomorrow!"'); return; }
      if (S.energy < 10) { this.toast('Kesuma: "You can barely stand! Eat first."'); return; }
      S.silatDay = S.day; S.energy -= 10;
      var F = this.gameFrame('Silat with Kesuma', 560, 400), g = F.g, X = F.X, Y = F.Y, beats = 8, k = 0, score = 0, t0 = this.time.now, gap = 0.9, over = false, hitK = -1, drumK = -1;
      var who = this.add.image(X + 140, Y + 230, 'npc_kesuma_0').setScale(5).setOrigin(0.5, 1), me = this.add.image(X + 420, Y + 230, LC.Art.plKey(this.world.pc || 0) + '_side_0').setScale(5).setOrigin(0.5, 1).setFlipX(true);
      F.c.add([who, me]);
      F.msg.setText('Follow the drum: tap when the ring meets the circle.');
      function beatT(i) { return 1.2 + i * gap; }
      var close = this.runGame(F, function () {
        if (over) return;
        var el = (self.time.now - t0) / 1000, d = Math.abs(el - beatT(k));
        if (d < 0.32) { var pts = d < 0.12 ? 1 : 0.5; score += pts; hitK = k; F.msg.setText(pts === 1 ? 'Tepat! (perfect)' : 'Bagus! (good)').setColor('#b8f0c8'); self.tweens.add({ targets: me, x: me.x - 12, duration: 90, yoyo: true }); LC.Audio.sfx('hit'); k++; }
        else { F.msg.setText('Too early!').setColor('#ff8a7a'); }
      }, function (now) {
        var el = (now - t0) / 1000;
        if (!over && el > beatT(k) + 0.32) { if (hitK !== k) F.msg.setText('Missed the beat!').setColor('#ff8a7a'); k++; }
        if (!over && k < beats && el >= beatT(k) - 0.03 && drumK !== k) { drumK = k; LC.Audio.sfx('drum'); }
        g.clear();
        g.lineStyle(3, 0xffd166, 1); g.strokeCircle(X + 280, Y + 170, 26);
        if (!over && k < beats) { var r = 26 + Math.max(0, (beatT(k) - el)) * 90; g.lineStyle(2, 0xfbecc8, 0.9); g.strokeCircle(X + 280, Y + 170, r); }
        for (var i = 0; i < beats; i++) { g.fillStyle(i < k ? 0x9be15d : 0x5a4a3a, 1); g.fillCircle(X + 180 + i * 28, Y + 280, 7); }
        if (!over && k >= beats) {
          over = true; var gain = Math.max(1, Math.min(5, 1 + Math.floor(score / 2))), got = LC.State.gainStr(gain);
          LC.Audio.sfx('cheer');
          F.msg.setText('Kesuma nods. "Good." (+' + got + ' strength)').setColor('#b8f0c8');
          self.time.delayedCall(1500, function () { close(); self.toast('Silat training done! Strength ' + Math.floor(S.str) + ' / ' + LC.STR_MAX + '.', 'ic_str'); });
        }
      });
    },

    // ================================================================ quests and special rows
    bunianQuestRow: function () {
      var self = this, S = this.S, q = S.quests.bunian || 0, Q = LC.BUNIAN_QUEST;
      if (q === 2) return { icon: 'i_cermin_mata', label: 'The Bunian glasses', sub: 'Wear them (hold them and press USE, or G) near the giant tualang in the west of Hutan Rimba...' };
      var has = LC.State.has(Q), need = Object.keys(Q).map(function (id) { return Q[id] + ' ' + LC.ITEMS[id].name + ' (' + LC.State.count(id) + ')'; }).join(', ');
      return { icon: 'i_madu_tualang', label: 'The Bunian\'s request', sub: 'It wishes for ' + need + '. Wild honey hangs by the giant tualang trees.', right: has ? 'Give' : '', enabled: has, why: 'You need ' + need + '.',
        action: function () {
          if (!LC.State.canAdd('cermin_mata')) { self.toast('Make room in your bag first!'); LC.Audio.sfx('error'); return; }
          LC.State.takeAll(Q); LC.State.add('cermin_mata', 1); S.quests.bunian = 2; LC.Audio.sfx('stage');
          self.say([{ name: 'Orang Bunian', portrait: 'sp_bunian', text: 'The little one sniffs the honey, nibbles the pengat, and tucks a melati behind its ear. Then it hands you a pair of tiny golden glasses.' },
            { name: 'Orang Bunian', portrait: 'sp_bunian', text: '(It points west, towards the oldest tualang, then at its own eyes. It wants you to look... properly.)' },
            { text: '✦ You got the Cermin Mata Bunian! Hold them and press USE (or G) to put them on. ✦' }]);
          return 'close';
        } };
    },
    specialRows: function (vid, v, por) {
      var self = this, S = this.S, W = this.world, rows = [];
      function say(name, por2, texts) { self.say(texts.map(function (t) { return { name: name, portrait: por2, text: t }; })); }
      if (v.train) rows.push({ icon: 'ic_str', label: 'Train silat with Kesuma', sub: S.silatDay === S.day ? 'Done for today. Rest!' : 'A rhythm lesson: +1 to +5 strength (once a day, 10 energy). Strength ' + Math.floor(S.str) + ' / ' + LC.STR_KERIS + ' for the keris.', enabled: S.silatDay !== S.day, why: 'Once a day.', action: function () { self.openSilat(); } });
      if (vid === 'tanggang') {
        var tq = S.quests.tanggang || 0;
        if (tq === 1) rows.push({ icon: 'i_selendang', label: LC.State.count('selendang') ? 'Give him his mother\'s selendang' : 'His mother\'s selendang', sub: LC.State.count('selendang') ? 'The shawl the tide carried away.' : '"If only I could hold her old shawl again. The tide took it... perhaps someone in Kampung Karang found it?"',
          right: LC.State.count('selendang') ? 'Give' : '', enabled: LC.State.count('selendang') > 0, why: 'Ask around Kampung Karang. Tok Duyung keeps what the sea brings.',
          action: function () {
            if (S.inv.filter(function (sl) { return !sl; }).length < 2) { self.toast('Make room in your bag first (2 free slots)!'); LC.Audio.sfx('error'); return; }
            LC.State.remove('selendang', 1); S.quests.tanggang = 2; S.kepeng += 500; LC.State.add('pinggan_lama', 2); LC.State.add('emas', 1);
            LC.Audio.sfx('stage'); W.doShared('kind', { n: 10 }, function () {});
            var gift = S.quests.stoneTold ? [] : LC.storyLines(LC.TEXT.stoneGift); S.quests.stoneTold = 1;
            self.say([{ name: 'Si Tanggang', portrait: 'npc_tanggang_0', text: '...Mak\'s selendang. It still smells of pandan, like her kitchen.' },
              { name: 'Si Tanggang', portrait: 'npc_tanggang_0', text: 'Mak, I am sorry. I was proud and foolish, and you loved me anyway. Maafkan aku.' },
              { text: 'The ghost holds the shawl to his face. For the first time in centuries, he smiles. The water around him glows softly, like morning.' },
              { name: 'Si Tanggang', portrait: 'npc_tanggang_0', text: 'Thank you, child. Take my captain\'s treasure: it is only gold, after all. Go home and hug your Nenek\'s memory for me.' },
              { text: '✦ Si Tanggang is at peace. (+500 kepeng, 2 Pinggan Lama, 1 Emas) ✦' }].concat(gift));
            return 'close';
          } });
        else if (tq === 2 || tq === 3) {   // v1.6: he longs to see his mother
          rows.push({ icon: 'ic_restu', label: tq === 2 ? 'What still troubles him?' : 'Guide him to his mother (again)', sub: tq === 2 ? 'Something weighs on the old captain, even now.' : 'The shadows pulled him back last time. Mak Deruma waits on the beach of Pulau Mutiara.',
            action: function () {
              var lines = tq === 2 ? LC.TANGGANG.ask.map(function (t) { return { name: 'Si Tanggang', portrait: 'npc_tanggang_0', text: t }; }) : [{ name: 'Si Tanggang', portrait: 'npc_tanggang_0', text: 'Will you try again, child? I am ready. Mak is waiting.' }];
              self.say(lines, { choices: [
                { label: 'Guide him to his mother', fn: function () { self.say([{ name: 'Si Tanggang', portrait: 'npc_tanggang_0', text: LC.TANGGANG.go }], { onDone: function () { W.startEscort(); } }); } },
                { label: 'Not yet' }
              ] });
              return 'close';
            } });
        }
        if (tq >= 2) rows.push({ icon: 'ic_batu', label: 'Sumpahan Batu', sub: 'His gift: press V (or tap the stone beside your hotbar) to turn nearby enemies to stone for ' + (LC.hasRestu() ? LC.RESTU.dur : LC.STONE.dur) + ' seconds.' });
        if (tq >= 4) rows.push({ icon: 'ic_restu', label: 'Home at last', sub: 'Si Tanggang mends nets by the river and cooks (badly) for his mother. He has never been happier.' });
      }
      if (vid === 'deruma') {
        var dq = S.quests.tanggang || 0;
        if (dq >= 4) rows.push({ icon: 'ic_restu', label: 'Restu Ibu', sub: S.restuDay === S.day ? 'Her prayer already saved you today. It will be with you again tomorrow.' : 'Her blessing is with you: once a day, when your health runs out, it heals you and turns the enemies around you to stone.' });
        else if (S.escort) rows.push({ icon: 'ic_restu', label: 'Bring Si Tanggang to her', sub: 'He is right behind you.', action: function () { self.closeModal(); W.reunion(); return 'close'; } });
        else rows.push({ icon: 'ic_moon', label: 'Her son, Si Tanggang', sub: dq >= 1 ? 'His ghost waits in the sunken junk in Kampung Karang. Once he is at peace, perhaps he could be brought to her...' : 'She says his ship sank somewhere off this coast. Kampung Karang, the village beneath the waves, is just below.' });
      }
      if (vid === 'duyung' && S.quests.tanggang === 1 && !S.flags.gotSelendang) rows.push({ icon: 'i_selendang', label: 'Ask about a lost shawl', sub: 'Si Tanggang\'s mother wore an old selendang...', action: function () {
        if (!LC.State.canAdd('selendang')) { self.toast('Make room in your bag first!'); LC.Audio.sfx('error'); return; }
        S.flags.gotSelendang = true; LC.State.add('selendang', 1); LC.Audio.sfx('chime');
        say('Tok Duyung', 'npc_duyung_0', ['A shawl? Mmm... yes. Long, long ago, the tide brought me a faded selendang that smelled of pandan. I kept it, because someone loved it very much.', 'Take it to the poor captain in the old junk. It is time.']);
        return 'close';
      } });
      if (vid === 'ratukidul') {
        if (!S.flags.kidul) {
          var KG = LC.KIDUL_GIFT, ok = LC.State.has(KG), need = Object.keys(KG).map(function (id) { return KG[id] + ' ' + LC.ITEMS[id].name + ' (' + LC.State.count(id) + ')'; }).join(', ');
          rows.push({ icon: 'i_malai', label: 'Offer a royal gift of flowers', sub: 'The Queen loves jasmine: ' + need + '.', right: ok ? 'Offer' : '', enabled: ok, why: 'You need ' + need + '.', action: function () {
            LC.State.takeAll(KG); S.flags.kidul = true; LC.Audio.sfx('stage'); W.doShared('kind', { n: 10 }, function () {});
            say('Kanjeng Ratu Kidul', por, ['Melati... the scent of the land I left so long ago. You have a gentle heart, child.', 'Take my blessing: wherever the sea touches, it will give you a little more than it gives others.']);
            self.time.delayedCall(200, function () { self.toast('The Queen\'s blessing: every sea forage gives one extra!', 'ic_glow'); });
            return 'close';
          } });
        } else rows.push({ icon: 'ic_glow', label: 'The Queen\'s blessing', sub: 'Seaweed, clams, shells and treasures by the sea give you one extra.' });
      }
      if (vid === 'poseidon') {
        if (!S.flags.poseidon) {
          var PT = LC.POSEIDON_TRIBUTE, ok2 = LC.State.has(PT), need2 = Object.keys(PT).map(function (id) { return PT[id] + ' ' + LC.ITEMS[id].name + ' (' + LC.State.count(id) + ')'; }).join(', ');
          rows.push({ icon: 'i_trisula', label: 'Offer tribute to the sea king', sub: 'He asks for ' + need2 + '. The reward: his trident!', right: ok2 ? 'Offer' : '', enabled: ok2, why: 'You need ' + need2 + '.', action: function () {
            if (!LC.State.canAdd('trisula')) { self.toast('Your bag is full!'); return; }
            LC.State.takeAll(PT); LC.State.add('trisula', 1); S.flags.poseidon = true; LC.State.recalc(); S.hp = S.maxHp; LC.Audio.sfx('stage'); W.doShared('kind', { n: 10 }, function () {});
            self.world.cameras.main.flash(500, 200, 240, 255);
            say('Poseidon', por, ['HA! Pearls, crystals, and a golden fish from a mountain lake! A tribute fit for a king. I am delighted!', 'Take my trisula. It has stirred storms and calmed them. And take a little of the sea\'s strength too.']);
            self.time.delayedCall(200, function () { self.toast('You got the Trisula Laut, the sea king\'s trident! (+20 max health)', 'i_trisula'); });
            return 'close';
          } });
        } else rows.push({ icon: 'i_trisula', label: 'The sea king\'s friend', sub: 'Poseidon gave you his trident and the strength of the sea (+20 max health).' });
      }
      return rows;
    },

    // ================================================================ the journal's "You" page
    youRows: function () {
      var S = this.S, sea = LC.State.season(), d = LC.State.daysToPesta(), tro = S.trophies || {};
      var rows = [
        { icon: 'ic_str', label: 'Strength ' + Math.floor(S.str || 0) + ' / ' + LC.STR_MAX, sub: 'Lift the batu angkat in Kampung Tepian and train silat in the hidden village (once a day each), and eat home-cooked dishes. ' + LC.STR_KERIS + ' draws the keris from the stone.' },
        { icon: 'ic_hp', label: 'Health ' + Math.ceil(S.hp) + ' / ' + S.maxHp, sub: 'Strength raises your health. Food heals you; a night\'s sleep heals everything.' },
        { icon: sea.icon, label: sea.name + ' (' + sea.short + '), day ' + LC.State.seasonDay() + ' of 7', sub: sea.desc },
        { icon: 'i_wau', label: d === 0 ? 'Today is Pesta day!' : 'Next Pesta: Sabtu, in ' + d + ' day' + (d > 1 ? 's' : ''), sub: 'Kite fighting, top spinning' + (LC.hasBadang() ? ', the Serama show and Badang\'s stone throwing' : ' and the Serama show') + ' at the pavilion in Kampung Tepian, 8 AM to 6 PM. Champion: wau ' + (tro.wau || 0) + 'x, gasing ' + (tro.gasing || 0) + 'x, Serama ' + (tro.serama || 0) + 'x' + (LC.hasBadang() ? ', Lempar Batu ' + (tro.lempar || 0) + 'x' : '') + '.' },
        { icon: 'chicken_0', iconScale: 2, label: 'Farm animals: ' + S.animals.length, sub: 'Feed them every day at the reban. Eggs in the nest hatch after three nights.' }
      ];
      if (LC.hasStone()) rows.push({ icon: 'ic_batu', label: 'Sumpahan Batu (V)', sub: "Si Tanggang's stone curse: nearby enemies turn to stone for " + (LC.hasRestu() ? LC.RESTU.dur : LC.STONE.dur) + ' seconds (bosses less). Stone cracks: your blows do double damage. Ready again after ' + (LC.hasRestu() ? LC.RESTU.cd : LC.STONE.cd) + ' seconds.' });
      if (LC.hasRestu()) rows.push({ icon: 'ic_restu', label: 'Restu Ibu' + (S.restuDay === S.day ? ' (used today)' : ' (ready)'), sub: "Mak Deruma's blessing: once a day, when your health runs out, you are healed fully and every enemy around you turns to stone." });
      else if ((S.quests.tanggang || 0) >= 2) rows.push({ icon: 'ic_moon', label: "Si Tanggang's last wish", sub: 'He longs to see his mother, whose ghost waits on the beach of Pulau Mutiara. Talk to him in the sunken junk.' });
      if (S.stats.kills || S.stats.gold) rows.push({ icon: 'i_bijih_emas', label: 'Battles', sub: (S.stats.kills || 0) + ' creatures and shadows beaten, ' + (S.stats.gold || 0) + ' pieces of ore and crystal dug out of Lombong Puaka.' + (S.flags.penunggu ? ' You have beaten the stone guardian!' : '') });
      ['cermin_mata', 'keris', 'trisula'].forEach(function (id) { if (LC.State.count(id)) rows.push({ icon: 'i_' + id, label: LC.ITEMS[id].name, sub: LC.ITEMS[id].desc }); });
      return rows;
    }
  });
})(window.LC);
