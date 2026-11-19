/* UI, part 6 (v1.8): Nenek's house menu (sleep, the pantry, helpers, building), the bigger bag (it scrolls, and you can
 * throw things away), Mak Thuy's pots and the old tower's brick path, and the Journal's line about your home.
 * Mixed into LC.UIScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var ACCEPT = { KeyE: 1, Space: 1, Enter: 1 };
  function need(map) { return Object.keys(map).map(function (id) { return map[id] + ' ' + LC.ITEMS[id].name + ' (' + LC.State.count(id) + ')'; }).join(', '); }

  Object.assign(LC.UIScene.prototype, {
    // ================================================================ Nenek's house
    openHouse: function () {
      var self = this, S = this.S, W = this.world, H = LC.Home, N = LC.Net;
      this.openMenu({
        title: 'Nenek\'s House',
        footer: function () { var w = H.wages(); return w ? 'Wages: ' + w + ' kepeng every morning, paid by ' + (N.role ? 'the host' : 'you') + '. A helper you cannot pay takes the night off.' : 'Grow the house to make room for helpers who cook, farm and gather for you.'; },
        tabs: [{ label: 'House', rows: function () {
          var rows = [], st = H.stage(), next = LC.HOUSE_STAGES[st + 1], pantry = S.chests && S.chests.pantry;
          rows.push({ icon: 'ic_moon', label: 'Sleep', sub: 'Climb the tangga and end the day. (The game saves every night.)', action: function () { self.confirmSleep(); } });
          if (pantry) rows.push({ icon: 'i_' + pantry.kind, label: LC.ITEMS[pantry.kind].name + ' (the pantry)', sub: pantry.items.length + ' / ' + LC.CHESTS[pantry.kind].slots + ' stacks. Your helpers put their work here, and the cook takes her ingredients from it.', action: function () { self.openChest('pantry'); } });
          // the helpers
          LC.HELPER_ORDER.forEach(function (k) {
            var Hp = LC.HELPERS[k], hired = !!(S.helpers && S.helpers[k]), por = 'npc_h_' + k + '_0';
            if (hired) rows.push({ icon: por, iconScale: 1.6, label: Hp.name + ', ' + Hp.role, right: Hp.wage + '/day', sub: 'Working for you. ' + Hp.does,
              action: function () {
                if (N.isGuest()) { self.toast('Only ' + N.hostName + ' (the host) can let helpers go.'); return; }
                self.say([{ name: Hp.name, portrait: por, text: 'Is something wrong? I have been working hard...' }], { choices: [
                  { label: 'Keep working, thank you!' },
                  { label: 'Let ' + Hp.name + ' go', fn: function () { W.doShared('fire', { k: k }, function (res) { if (res && res.ok) { LC.Audio.sfx('sad'); W.refreshHelpers(); self.toast(Hp.name + ' packs up and goes home to the kampung.', 'ic_moon'); } }); } }
                ] });
                return 'close';
              } });
            else {
              var room = H.hiredCount() < H.rooms(), guest = N.isGuest();
              rows.push({ icon: por, iconScale: 1.6, label: 'Hire ' + Hp.name + ', ' + Hp.role, right: Hp.wage + '/day', sub: Hp.does, enabled: room && !guest,
                why: guest ? 'Only ' + N.hostName + ' (the host) can hire helpers.' : st < 1 ? 'There is no room yet: expand the house first (a Serambi makes room for 1 helper).' : 'No room for another helper: expand the house.',
                action: function () {
                  W.doShared('hire', { k: k }, function (res) {
                    if (!res || !res.ok) { self.toast('There is no room for another helper.'); return; }
                    LC.Audio.sfx('chime'); W.refreshHelpers();
                    self.say([{ name: Hp.name, portrait: por, text: 'Terima kasih! I will start tonight. You will see what I have done in the morning.' }]);
                  });
                  return 'close';
                } });
            }
          });
          // building
          if (S.houseBuild) rows.push({ icon: 'i_kayu', label: 'Building the ' + LC.HOUSE_STAGES[S.houseBuild].name + '...', sub: 'Tukang Leong and the kampung will finish it overnight.' });
          else if (next) {
            var ok = LC.State.has(next.cost) && S.kepeng >= next.kepeng;
            rows.push({ icon: 'i_kayu', label: 'Expand the house: ' + next.name, right: next.kepeng + ' k', sub: next.desc + ' Needs ' + need(next.cost) + '.', enabled: ok,
              why: 'You need ' + need(next.cost) + ' and ' + next.kepeng + ' kepeng.' + (next.cost.tempayan ? ' (Mak Thuy, the potter in Bukit Pasir, makes tempayan.)' : ''),
              action: function () {
                LC.State.takeAll(next.cost); S.kepeng -= next.kepeng;
                W.doShared('house_up', { quick: LC.hasBadang() }, function (res) {
                  if (!res || !res.ok) { Object.keys(next.cost).forEach(function (id) { LC.State.add(id, next.cost[id]); }); S.kepeng += next.kepeng; self.toast('The house is already being built!'); return; }
                  LC.Audio.sfx('build');
                  if (res.quick) {
                    W.refreshHouse(); W.cameras.main.shake(250, 0.003); LC.State.recalc();
                    self.say([{ name: 'Badang', portrait: 'npc_badangK_0', text: LC.BADANG.houseQuick }, { text: '✦ Nenek\'s ' + next.name + ' is finished! ' + next.desc + ' ✦' }]);
                  } else self.say([{ name: 'Tukang Leong', portrait: 'npc_leong_0', text: 'A ' + next.name + ' for Nenek\'s house? Wah, she would be so proud. The whole kampung will come tonight. It will be standing by morning!' }]);
                });
                return 'close';
              } });
          } else rows.push({ icon: 'ic_glow', label: 'Nenek\'s house is complete', sub: 'Verandah, middle room and the grand kitchen wing. The finest rumah panggung on the river.' });
          return rows;
        } }]
      });
    },

    // ================================================================ the bag: it grows with Pelita, scrolls, and lets you throw things away
    openInventory: function (start) {
      this.closeModal();
      var self = this, S = this.S, n = S.inv.length, cur = start >= 0 && start < n ? start : S.sel, picked = -1, top = 0, m;
      var VR = 4, rowsBack = Math.ceil((n - 9) / 9);   // visible backpack rows, and how many there are
      var c = this.modalC(90, 0x000000, 0.45);
      var X = 120, Y = 28, Wd = 720, Hd = 584, CS = 54, GAP = 60;
      var bg = this.add.graphics(); this.panel(bg, X, Y, Wd, Hd); c.add(bg);
      var title = this.txt(480, Y + 14, 'Bag', 28, '#ffd166', { ox: 0.5 }); c.add(title);
      var gx0 = X + 34, gyH = Y + 76, gyB = Y + 168;
      c.add(this.txt(gx0, gyH - 20, 'Hotbar (1-9)', 13, '#a08a6a'));
      var backT = this.txt(gx0, gyB - 20, '', 13, '#a08a6a'); c.add(backT);
      var gg = this.add.graphics(); c.add(gg);
      var cells = [];
      function cellXY(k) {   // k: 0-8 hotbar, then the visible backpack cells
        if (k < 9) return { x: gx0 + k * GAP, y: gyH };
        var j = k - 9; return { x: gx0 + (j % 9) * GAP, y: gyB + Math.floor(j / 9) * GAP };
      }
      for (var k = 0; k < 9 + VR * 9; k++) (function (k) {
        var p = cellXY(k);
        var ic = self.add.image(p.x + 27, p.y + 27, 'i_hoe').setScale(2);
        var ct = self.txt(p.x + 50, p.y + 51, '', 14, '#ffffff', { stroke: 3, ox: 1, oy: 1 });
        var z = self.add.zone(p.x, p.y, CS, CS).setOrigin(0).setInteractive({ useHandCursor: true });
        z.on('pointerdown', function () { var i = slotOf(k); if (i < n) { cur = i; act(); } });
        z.on('pointerover', function () { var i = slotOf(k); if (i < n && cur !== i) { cur = i; render(); } });
        c.add([ic, ct, z]); cells.push({ x: p.x, y: p.y, ic: ic, ct: ct, k: k });
      })(k);
      function slotOf(k) { return k < 9 ? k : 9 + top * 9 + (k - 9); }
      // big scroll buttons beside the backpack (only when it has more rows than fit)
      var bx = gx0 + 9 * GAP + 8;
      var upB = this.scrollBtn(c, bx, gyB, 2 * GAP - 8, true, function () { if (top > 0) { top--; LC.Audio.sfx('click'); render(); } });
      var dnB = this.scrollBtn(c, bx, gyB + (VR - 2) * GAP, 2 * GAP - 8, false, function () { if (top + VR < rowsBack) { top++; LC.Audio.sfx('click'); render(); } });
      var iy = gyB + VR * GAP + 6;
      var tName = this.txt(X + 34, iy, '', 20, '#ffd166');
      var tDesc = this.txt(X + 34, iy + 28, '', 15, '#fbecc8', { wrap: Wd - 250 });
      var tInfo = this.txt(X + 34, iy + 70, '', 13, '#b8a890', { wrap: Wd - 250 });
      c.add([tName, tDesc, tInfo]);
      // the Throw away button
      var tbx = X + Wd - 206, tby = iy + 6, tbw = 176, tbh = 54, tg = this.add.graphics();
      var tbt = this.txt(tbx + tbw / 2, tby + tbh / 2, 'Throw away', 19, '#ffd0c0', { ox: 0.5, oy: 0.5 });
      var tbz = this.add.zone(tbx, tby, tbw, tbh).setOrigin(0).setInteractive({ useHandCursor: true });
      tbz.on('pointerdown', function () { throwAway(); });
      c.add([tg, tbt, tbz]);
      c.add(this.txt(480, Y + Hd - 18, this.touchOn ? 'Tap an item to pick it up, tap another slot to swap  ·  X (top) to close'
        : 'Arrows/mouse move  ·  E or click: pick up, then swap  ·  T / Delete: throw away  ·  Esc close', 12, '#8a7a6a', { ox: 0.5 }));
      function keepVisible() {
        if (cur < 9) return;
        var row = Math.floor((cur - 9) / 9);
        if (row < top) top = row; else if (row >= top + VR) top = row - VR + 1;
      }
      function render() {
        keepVisible();
        gg.clear();
        cells.forEach(function (o) {
          var i = slotOf(o.k), exists = i < n, sl = exists ? S.inv[i] : null, on = i === cur, pk = i === picked;
          if (!exists) { o.ic.setVisible(false); o.ct.setText(''); return; }
          gg.fillStyle(pk ? 0x2a4a6a : on ? 0x5a4024 : 0x2e2219, 1); gg.fillRoundedRect(o.x, o.y, CS, CS, 6);
          gg.lineStyle(on || pk ? 3 : 1, pk ? 0x8fd3ff : on ? 0xffd166 : 0x6a5034, 1); gg.strokeRoundedRect(o.x, o.y, CS, CS, 6);
          if (sl) { o.ic.setVisible(true).setTexture(LC.ITEMS[sl.id].icon); o.ct.setText(sl.n > 1 ? String(sl.n) : ''); }
          else { o.ic.setVisible(false); o.ct.setText(''); }
        });
        var used = S.inv.filter(Boolean).length, more = rowsBack > VR;
        title.setText('Bag  (' + used + ' / ' + n + ')');
        backT.setText('Backpack' + (more ? '  ·  rows ' + (top + 1) + '-' + Math.min(rowsBack, top + VR) + ' of ' + rowsBack : '') + (n < LC.bagSize(LC.MAX_LEVEL) ? '  ·  grows as Pelita levels up' : ''));
        upB.show(more, top > 0); dnB.show(more, top + VR < rowsBack);
        var sl = S.inv[cur], fixed = sl && LC.FIXED_ITEMS[sl.id];
        tg.clear(); tg.fillStyle(sl && !fixed ? 0x6a2a24 : 0x2e2219, 1); tg.fillRoundedRect(tbx, tby, tbw, tbh, 10);
        tg.lineStyle(2, sl && !fixed ? 0xff8a7a : 0x5a4a3a, 1); tg.strokeRoundedRect(tbx, tby, tbw, tbh, 10);
        tbt.setAlpha(sl && !fixed ? 1 : 0.35);
        if (sl) {
          var it = LC.ITEMS[sl.id], info = [];
          tName.setText(it.name + (sl.n > 1 ? '  x' + sl.n : ''));
          tDesc.setText(it.desc || '');
          if (it.food) info.push('Food: +' + it.food.full + ' fullness, ' + (it.food.joy >= 0 ? '+' : '') + it.food.joy + ' joy');
          if (it.glow) info.push('Offering: +' + it.glow + ' glow');
          if (it.sell) info.push('Sells for ' + it.sell + ' kepeng');
          if (LC.LOVES.indexOf(sl.id) >= 0) info.push('Pelita loves this!');
          if (fixed) info.push('You need this: it can\'t be thrown away.');
          tInfo.setText(info.join('   ·   '));
        } else { tName.setText(''); tDesc.setText(cur < 9 ? 'Empty hotbar slot.' : 'Empty backpack slot.'); tInfo.setText(''); }
      }
      function act() {
        if (picked < 0) { if (S.inv[cur]) { picked = cur; LC.Audio.sfx('click'); } }
        else { var t = S.inv[picked]; S.inv[picked] = S.inv[cur]; S.inv[cur] = t; picked = -1; LC.Audio.sfx('plant'); LC.emit('inv'); }
        render();
      }
      function throwAway() {
        var idx = cur, sl = S.inv[idx];
        if (!sl) return;
        var it = LC.ITEMS[sl.id], id = sl.id, count = sl.n;
        if (LC.FIXED_ITEMS[id]) { self.toast('You can\'t throw away your ' + it.name + ': you need it!', it.icon); LC.Audio.sfx('error'); return; }
        function reopen() { self.time.delayedCall(100, function () { self.openInventory(idx); }); }
        function toss(k) {
          var s2 = S.inv[idx];
          if (s2 && s2.id === id) { k = Math.min(k, s2.n); s2.n -= k; if (s2.n <= 0) S.inv[idx] = null; LC.emit('inv'); LC.Audio.sfx('poof'); self.toast('You threw away ' + k + ' ' + it.name + '.', it.icon); }
          reopen();
        }
        close();
        var choices = [{ label: 'Keep it', fn: reopen }, { label: 'Throw away 1', fn: function () { toss(1); } }];
        if (count > 1) choices.push({ label: 'Throw away all ' + count, fn: function () { toss(count); } });
        self.say([{ text: 'Throw away ' + it.name + (count > 1 ? ' (' + count + ' in this slot)' : '') + '? It will be gone for good.' + (it.sell ? ' (Mak Ani would pay ' + it.sell + ' kepeng each.)' : '') }], { choices: choices });
      }
      function close() { c.destroy(); if (self.modal === m) self.modal = null; }
      m = {
        type: 'inv', close: close,
        key: function (code) {
          if (code === 'Escape' || code === 'Tab' || code === 'KeyI') { close(); return; }
          if (code === 'KeyT' || code === 'Delete' || code === 'Backspace') { throwAway(); return; }
          if (code === 'ArrowLeft' || code === 'KeyA') cur = (cur + n - 1) % n;
          else if (code === 'ArrowRight' || code === 'KeyD') cur = (cur + 1) % n;
          else if (code === 'ArrowUp' || code === 'KeyW') cur = (cur - 9 + n) % n;
          else if (code === 'ArrowDown' || code === 'KeyS') cur = (cur + 9) % n;
          else if (ACCEPT[code]) { act(); return; }
          render();
        },
        wheel: function (dy) { if (rowsBack > VR) { top = Phaser.Math.Clamp(top + (dy > 0 ? 1 : -1), 0, rowsBack - VR); if (cur >= 9) cur = Math.min(n - 1, Math.max(9 + top * 9, Math.min(cur, 9 + (top + VR) * 9 - 1))); render(); } }
      };
      this.modal = m;
      render();
    },

    // ================================================================ Mak Thuy: pots, and the old tower's brick path
    thuyRows: function () {
      var self = this, S = this.S, W = this.world, rows = [], por = 'npc_thuy_0';
      LC.POTS.forEach(function (r) {
        var it = LC.ITEMS[r.out], ok = LC.State.has(r.inp) && S.kepeng >= r.kepeng && LC.State.canAdd(r.out);
        rows.push({ icon: it.icon, label: 'Make a ' + it.name, right: r.kepeng + ' k', sub: it.desc + ' From ' + need(r.inp) + ', plus ' + r.kepeng + ' kepeng for the fire.', enabled: ok,
          why: !LC.State.canAdd(r.out) ? 'Your bag is full!' : 'You need ' + need(r.inp) + ' and ' + r.kepeng + ' kepeng.',
          action: function () { LC.State.takeAll(r.inp); S.kepeng -= r.kepeng; LC.State.add(r.out, 1); LC.Audio.sfx('build'); self.toast('Mak Thuy shapes and fires a ' + it.name + ' for you!', it.icon); } });
      });
      if (!S.quests.menara) {
        var Q = LC.TOWER_QUEST, has = LC.State.has(Q);
        rows.push({ icon: 'i_duit_lama', label: 'The old tower\'s brick path', right: has ? 'Give' : '', sub: S.quests.menaraAsked ? 'Bring ' + need(Q) + '.' : 'Mak Thuy has something to ask you about the old tower.',
          action: function () {
            if (!S.quests.menaraAsked) { S.quests.menaraAsked = 1; self.say(LC.THUY.ask.map(function (t) { return { name: 'Mak Thuy', portrait: por, text: t }; })); return 'close'; }
            if (!has) { self.toast('Mak Thuy needs ' + need(Q) + '.', 'i_duit_lama'); LC.Audio.sfx('error'); return; }
            LC.State.takeAll(Q); S.quests.menara = 1; S.kepeng += 600; S.stats.earned += 600; LC.State.add('pelita_tanah', 3);
            LC.State.addFriendship('thuy', 8);
            LC.Audio.sfx('stage');
            W.refreshDesertPath();
            W.doShared('kind', { n: 8 }, function () {});
            self.say(LC.THUY.done.map(function (t, i) { return i < 2 ? { name: 'Mak Thuy', portrait: por, text: t } : { text: t }; }));
            return 'close';
          } });
      } else rows.push({ icon: 'i_duit_lama', label: 'The brick path, restored', sub: 'Families walk up to the old tower again, and the coins you found sit on the elders\' shelf by the door.' });
      return rows;
    }
  });

  // ---------------------------------------------------------------- hooks: Mak Thuy's rows, and the Journal's "You" page
  var specialRows = LC.UIScene.prototype.specialRows;
  LC.UIScene.prototype.specialRows = function (vid, v, por) {
    var rows = specialRows.call(this, vid, v, por);
    return vid === 'thuy' ? rows.concat(this.thuyRows()) : rows;
  };
  var youRows = LC.UIScene.prototype.youRows;
  LC.UIScene.prototype.youRows = function () {
    var rows = youRows.call(this), S = this.S, st = S.house || 0, h = S.helpers || {};
    var names = LC.HELPER_ORDER.filter(function (k) { return h[k]; }).map(function (k) { return LC.HELPERS[k].name; });
    rows.push({ icon: 'i_kayu', label: 'Nenek\'s house: ' + (st ? LC.HOUSE_STAGES[st].name : 'as Nenek left it') + (st ? ' (' + st + ' / 3)' : ''),
      sub: (names.length ? 'Helpers: ' + names.join(', ') + ' (' + LC.Home.wages() + ' kepeng a day). ' : 'No helpers yet. ') + 'Use the house to sleep, open the pantry, hire helpers and expand it. Your bag: ' + S.inv.length + ' slots.' });
    return rows;
  };
})(window.LC);
