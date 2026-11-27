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
        footer: function () { var w = H.wages(); return w ? 'Wages: ' + w + ' kepeng every morning, paid by ' + (N.role ? 'the host' : 'you') + '. A helper you cannot pay takes the night off.' : 'Expand the house to make room for helpers.'; },
        tabs: [{ label: 'House', rows: function () {
          var rows = [], st = H.stage(), next = LC.HOUSE_STAGES[st + 1], pantry = S.chests && S.chests.pantry;
          rows.push({ icon: 'ic_door', label: 'Enter house', action: function () { W.enterFarmhouse(); } });
          rows.push({ icon: 'ic_moon', label: 'Sleep', sub: 'Climb the tangga and end the day. (The game saves every night.)', action: function () { self.confirmSleep(); } });
          if (pantry) rows.push({ icon: 'i_' + pantry.kind, label: LC.ITEMS[pantry.kind].name + ' (the pantry)', sub: pantry.items.length + ' / ' + LC.CHESTS[pantry.kind].slots + ' stacks. Your helpers share these supplies.', action: function () { self.openChest('pantry'); } });
          if (pantry && S.helpers && S.helpers.stor && !N.isGuest()) rows.push({ icon: 'i_kepeng', label: 'Pantry Sales', sub: 'Choose which items Pak Idris sells and how many he keeps.', action: function () { self.openPantrySales(); } });
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
                    self.say([{ name: Hp.name, portrait: por, text: 'Terima kasih! You can find me around the farm during the day. Check the morning report for my work.' }]);
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

    openPantrySales: function () {
      var self = this, S = this.S, H = LC.Home;
      if (LC.Net.isGuest() || !S.helpers.stor || !S.chests.pantry) return;
      var sales = S.pantrySales;
      this.openMenu({
        title: 'Pantry Sales', footer: 'Pak Idris counts the stock after the other helpers finish their overnight work.',
        tabs: [{ label: 'Stock limits', rows: function () {
          var ids = new Set(Object.keys(sales));
          S.chests.pantry.items.forEach(function (slot) { if (H.pantrySalePrice(slot.id)) ids.add(slot.id); });
          var rows = Array.from(ids).filter(function (id) { return H.pantrySalePrice(id); }).map(function (id) {
            return { icon: LC.ITEMS[id].icon, label: LC.ITEMS[id].name + ' × ' + H.pCount(id),
              sub: H.pantrySalePrice(id) + ' kepeng each at the warung.', right: sales[id] === undefined ? 'Keep all' : 'Keep ' + sales[id],
              action: function () { self.openPantrySaleLimit(id); } };
          });
          if (!rows.length) rows.push({ icon: 'i_' + S.chests.pantry.kind, label: 'No goods to sell', sub: 'Put goods in the pantry to set a sale limit for them.' });
          rows.push({ icon: 'ic_door', label: 'Back to Nenek\'s house', action: function () { self.openHouse(); } });
          return rows;
        } }]
      });
    },

    openPantrySaleLimit: function (id) {
      var self = this, sales = this.S.pantrySales, it = LC.ITEMS[id];
      this.openMenu({
        title: it.name, footer: 'New stock of this item follows the same limit until you change it.',
        tabs: [{ label: 'Stock limit', rows: function () {
          return [undefined, 0, 5, 10, 20, 50].map(function (keep) {
            var label = keep === undefined ? 'Keep all' : keep === 0 ? 'Sell all' : 'Keep ' + keep;
            return { icon: it.icon, label: label, right: sales[id] === keep ? 'Selected' : '', action: function () {
              if (keep === undefined) delete sales[id]; else sales[id] = keep;
              LC.Audio.sfx('click'); self.openPantrySales();
            } };
          }).concat({ icon: 'ic_door', label: 'Back to Pantry Sales', action: function () { self.openPantrySales(); } });
        } }]
      });
    },

    // ================================================================ the bag: it grows with Pelita, scrolls, and lets you throw things away
    openInventory: function (start) {
      this.closeModal();
      var self = this, S = this.S, n = S.inv.length, cur = start >= 0 && start < n ? start : S.sel, picked = -1, top = 0, m;
      var drag = null;   // v3.31: press an item and drag it onto another slot to swap them (a short tap still picks up, then swaps)
      var VR = 4;   // visible backpack rows
      // v2.7.9: Pelita sorts the bag (src/bagsort.js). view: the slots shown, the 9 hotbar slots first, then the backpack
      // slots (all of them, or only the things of the chosen kind, packed together). cur and picked are real slot numbers.
      var lv = LC.State.level(), canSort = lv >= LC.BAG_SORT_LV, hover = null;
      var filt = canSort && LC.bagSort(this.bagFilter) && lv >= LC.bagSort(this.bagFilter).lv ? this.bagFilter : null;
      var view = [], rowsBack = 1;
      function rebuild() {
        view = [];
        for (var i = 0; i < n; i++) if (i < 9 || !filt || (S.inv[i] && LC.bagSortOf(S.inv[i].id) === filt)) view.push(i);
        rowsBack = Math.max(1, Math.ceil((view.length - 9) / 9));
        if (top + VR > rowsBack) top = Math.max(0, rowsBack - VR);
        if (view.indexOf(cur) < 0) cur = view.length > 9 ? view[9] : Math.min(S.sel, 8);
      }
      rebuild();
      if (filt && !(start >= 0) && view.length > 9) cur = view[9];   // opened with a kind chosen: start on the first one
      var c = this.modalC(90, 0x000000, 0.45);
      var X = 120, Y = 28, Wd = 720, Hd = 584, CS = 54, GAP = 60;
      var bg = this.add.graphics(); this.panel(bg, X, Y, Wd, Hd); c.add(bg);
      var title = this.txt(480, Y + 14, 'Bag', 28, '#ffd166', { ox: 0.5 }); c.add(title);
      this.closeX(c, X + Wd, Y, function () { if (self.modal === m) m.key('Escape'); });   // v2.7.7
      var gx0 = X + 34, gyH = Y + 70, gyB = Y + (canSort ? 195 : 178), chipY = Y + 132;
      c.add(this.txt(gx0, gyH - 20, 'Hotbar (1-9)', 13, '#a08a6a'));
      var backT = this.txt(gx0, gyB - 19, '', 13, '#a08a6a'); c.add(backT);
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
        z.on('pointerdown', function (p) { var i = slotOf(k); if (i >= 0) { cur = i; drag = { from: i, id: p.id, x0: p.x, y0: p.y, on: false, over: -1 }; render(); } });
        z.on('pointerover', function () { var i = slotOf(k); if (drag) return; if (i >= 0 && cur !== i) { cur = i; render(); } });
        c.add([ic, ct, z]); cells.push({ x: p.x, y: p.y, ic: ic, ct: ct, k: k });
      })(k);
      function slotOf(k) { var p = k < 9 ? k : 9 + top * 9 + (k - 9); return p < view.length ? view[p] : -1; }
      var emptyT = this.txt(gx0 + (9 * GAP - 6) / 2, gyB + 50, '', 16, '#a08a6a', { ox: 0.5, align: 'center' }); c.add(emptyT);
      // big scroll buttons beside the backpack (only when it has more rows than fit)
      var bx = gx0 + 9 * GAP + 8;
      var upB = this.scrollBtn(c, bx, gyB, 2 * GAP - 8, true, function () { if (top > 0) { top--; LC.Audio.sfx('click'); render(); } });
      var dnB = this.scrollBtn(c, bx, gyB + (VR - 2) * GAP, 2 * GAP - 8, false, function () { if (top + VR < rowsBack) { top++; LC.Audio.sfx('click'); render(); } });
      // Backpack filters. Locked categories keep their label and show their unlock level on hover or tap.
      var CHH = 36, chipG = this.add.graphics(), chips = [], chipX = gx0;
      c.add(chipG);
      var sortHint = this.txt(bx + 58, chipY + 10, canSort ? '' : 'Pelita learns to sort your bag at Lv ' + LC.BAG_SORT_LV + '.', 13, '#8a7a6a', { ox: 1 }); c.add(sortHint);
      if (canSort) [{ k: null, name: 'All', lv: 0 }].concat(LC.BAG_SORTS).forEach(function (g) {
        var label = self.txt(0, chipY + CHH / 2, g.name, 15, '#fbecc8', { ox: 0.5, oy: 0.5 });
        var width = Math.max(40, Math.ceil(label.width) + 12), x = chipX;
        label.setX(x + width / 2);
        chipX += width + 4;
        var z = self.add.zone(x, chipY - 2, width, CHH + 4).setOrigin(0).setInteractive({ useHandCursor: true });
        z.on('pointerdown', function () { setFilter(g); });
        z.on('pointerover', function () { hover = g; render(); });
        z.on('pointerout', function () { if (hover === g) { hover = null; render(); } });
        c.add([label, z]); chips.push({ g: g, x: x, w: width, text: label });
      });
      function setFilter(g) {
        if (g.lv > lv) { self.toast('Pelita learns to sort ' + g.name + ' at Lv ' + g.lv + '.', 'ic_bond'); LC.Audio.sfx('error'); return; }
        filt = g.k; self.bagFilter = g.k; top = 0;
        var keep = cur < 9 ? cur : -1;
        rebuild();
        cur = keep >= 0 ? keep : view.length > 9 ? view[9] : Math.min(S.sel, 8);
        LC.Audio.sfx('click'); render();
      }
      function stepFilter(d) {   // F / R: the next (or last) kind Pelita can sort
        if (!canSort) return;
        var open = [null].concat(LC.BAG_SORTS.filter(function (g) { return g.lv <= lv; }).map(function (g) { return g.k; }));
        var i = (open.indexOf(filt) + d + open.length) % open.length;
        setFilter(open[i] ? LC.bagSort(open[i]) : { k: null, lv: 0 });
      }
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
      // v2.4.3: the Give button, under it, while friends are playing with you
      var coop = !!LC.Net.role && LC.Net.count() > 1, REACH = 64, gby = tby + tbh + 8, gg2 = null, gbt = null;
      if (coop) {
        gg2 = this.add.graphics();
        gbt = this.txt(tbx + tbw / 2, gby + tbh / 2, 'Give a friend', 19, '#d8f7c0', { ox: 0.5, oy: 0.5 });
        var gbz = this.add.zone(tbx, gby, tbw, tbh).setOrigin(0).setInteractive({ useHandCursor: true });
        gbz.on('pointerdown', function () { give(); });
        c.add([gg2, gbt, gbz]);
      }
      c.add(this.txt(480, Y + Hd - 18, this.touchOn ? 'Drag an item onto another slot to swap' + (canSort ? '  ·  tap a category to filter' : '') + '  ·  X to close'
        : 'Drag to swap (or E/click twice)  ·  arrows move  ·  T: throw away' + (canSort ? '  ·  F: sort' : '') + (coop ? '  ·  G: give' : '') + '  ·  Esc close', 12, '#8a7a6a', { ox: 0.5 }));
      function keepVisible() {
        var p = view.indexOf(cur);
        if (p < 9) return;
        var row = Math.floor((p - 9) / 9);
        if (row < top) top = row; else if (row >= top + VR) top = row - VR + 1;
      }
      function move(code) {   // arrows / WASD through the slots on show (wrapping round, like before)
        var L = view.length, p = Math.max(0, view.indexOf(cur)), last = Math.floor((L - 1) / 9) * 9;
        if (code === 'left') p = (p + L - 1) % L;
        else if (code === 'right') p = (p + 1) % L;
        else if (code === 'up') p = p - 9 >= 0 ? p - 9 : Math.min(L - 1, last + p);
        else p = p + 9 < L ? p + 9 : Math.floor(p / 9) * 9 < last ? L - 1 : p % 9;
        cur = view[p];
      }
      function render() {
        var dg = drag && drag.on ? drag : null;   // while dragging: the slot it came from is faded, the one under it lit
        if (!dg) keepVisible();
        gg.clear(); chipG.clear();
        cells.forEach(function (o) {
          var i = slotOf(o.k), exists = i >= 0, sl = exists ? S.inv[i] : null, on = i === cur, pk = i === picked || (dg && i === dg.over && i !== dg.from);
          if (!exists) { o.ic.setVisible(false); o.ct.setText(''); return; }
          gg.fillStyle(pk ? 0x2a4a6a : on ? 0x5a4024 : 0x2e2219, 1); gg.fillRoundedRect(o.x, o.y, CS, CS, 6);
          gg.lineStyle(on || pk ? 3 : 1, pk ? 0x8fd3ff : on ? 0xffd166 : 0x6a5034, 1); gg.strokeRoundedRect(o.x, o.y, CS, CS, 6);
          var dim = dg && i === dg.from ? 0.3 : filt && sl && o.k < 9 && LC.bagSortOf(sl.id) !== filt ? 0.3 : 1;   // the hotbar: other kinds dimmed
          if (sl) { o.ic.setVisible(true).setTexture(LC.ITEMS[sl.id].icon).setAlpha(dim); o.ct.setText(sl.n > 1 ? String(sl.n) : '').setAlpha(dim); }
          else { o.ic.setVisible(false); o.ct.setText(''); }
        });
        var used = S.inv.filter(Boolean).length, more = rowsBack > VR, g = LC.bagSort(filt), found = view.length - 9;
        title.setText('Bag  (' + used + ' / ' + n + ')');
        var rowsT = more ? '  ·  ' + (top + 1) + '-' + Math.min(rowsBack, top + VR) + ' of ' + rowsBack + ' rows' : '';
        if (hover) backT.setText(hover.lv > lv ? hover.name + ': Lv ' + hover.lv : hover.name);
        else if (g) backT.setText(g.name + ': ' + found + (found === 1 ? ' slot' : ' slots'));   // (the scroll buttons show there is more)
        else backT.setText('Backpack' + rowsT + (!canSort && n < LC.bagSize(LC.MAX_LEVEL) ? '  ·  grows as Pelita levels up' : ''));
        emptyT.setText(g && !found ? 'No ' + g.name.toLowerCase() + ' in your backpack.' : '');
        chips.forEach(function (o) {
          var on = o.g.k === filt, locked = o.g.lv > lv, hv = hover === o.g;
          chipG.fillStyle(on ? 0x6a4a1c : hv && !locked ? 0x4a3520 : 0x2e2219, 1); chipG.fillRoundedRect(o.x, chipY, o.w, CHH, 7);
          chipG.lineStyle(on ? 3 : 1, on ? 0xffd166 : locked ? 0x4a3a2a : 0x8a6a4a, 1); chipG.strokeRoundedRect(o.x, chipY, o.w, CHH, 7);
          o.text.setColor(locked ? '#a08a6a' : on ? '#ffd166' : '#fbecc8');
        });
        upB.show(more, top > 0); dnB.show(more, top + VR < rowsBack);
        var sl = S.inv[cur], fixed = sl && LC.FIXED_ITEMS[sl.id];
        tg.clear(); tg.fillStyle(sl && !fixed ? 0x6a2a24 : 0x2e2219, 1); tg.fillRoundedRect(tbx, tby, tbw, tbh, 10);
        tg.lineStyle(2, sl && !fixed ? 0xff8a7a : 0x5a4a3a, 1); tg.strokeRoundedRect(tbx, tby, tbw, tbh, 10);
        tbt.setAlpha(sl && !fixed ? 1 : 0.35);
        if (gg2) {
          gg2.clear(); gg2.fillStyle(sl && !fixed ? 0x2a4a24 : 0x2e2219, 1); gg2.fillRoundedRect(tbx, gby, tbw, tbh, 10);
          gg2.lineStyle(2, sl && !fixed ? 0x9be15d : 0x5a4a3a, 1); gg2.strokeRoundedRect(tbx, gby, tbw, tbh, 10);
          gbt.setAlpha(sl && !fixed ? 1 : 0.35);
        }
        if (sl) {
          var it = LC.ITEMS[sl.id], info = [];
          tName.setText(it.name + (sl.n > 1 ? '  x' + sl.n : ''));
          tDesc.setText(it.desc || '');
          if (it.kind === 'weapon') info.push(LC.weaponStatsText(it));
          if (it.food) info.push('Food: +' + it.food.full + ' fullness, ' + (it.food.joy >= 0 ? '+' : '') + it.food.joy + ' joy');
          if (it.glow) info.push('Offering: +' + it.glow + ' glow');
          if (it.sell) info.push('Sells for ' + it.sell + ' kepeng');
          if (LC.LOVES.indexOf(sl.id) >= 0) info.push('Pelita loves this!');
          if (fixed) info.push('You need this: it can\'t be thrown away' + (coop ? ' or given away.' : '.'));
          tInfo.setText(info.join('   ·   '));
        } else { tName.setText(''); tDesc.setText(cur < 9 ? 'Empty hotbar slot.' : 'Empty backpack slot.'); tInfo.setText(''); }
      }
      function act() {
        if (picked < 0) { if (S.inv[cur]) { picked = cur; LC.Audio.sfx('click'); } }
        else { var t = S.inv[picked]; S.inv[picked] = S.inv[cur]; S.inv[cur] = t; picked = -1; LC.Audio.sfx('plant'); LC.emit('inv'); rebuild(); }
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
      // v2.4.3: hand it to a friend standing near you (pick who if several are close, then how many)
      function give() {
        var idx = cur, sl = S.inv[idx], W = self.world;
        if (!coop || !sl || !W) return;
        var it = LC.ITEMS[sl.id], id = sl.id, count = sl.n;
        if (LC.FIXED_ITEMS[id]) { self.toast('You need your ' + it.name + ': keep it!', it.icon); LC.Audio.sfx('error'); return; }
        var near = W.friendsNear(REACH);
        if (!near.length) {
          var names = Object.keys(LC.Net.others).map(function (k) { return LC.Net.others[k].name; }).join(', ');
          self.toast('Stand next to a friend to give them something' + (names ? ' (' + names + ')' : '') + '.', 'ic_joy'); LC.Audio.sfx('error'); return;
        }
        function reopen() { self.time.delayedCall(100, function () { self.openInventory(idx); }); }
        function send(f, k) { W.giveItem(f, idx, id, k); reopen(); }
        function howMany(f) {
          var choices = [{ label: 'Keep it', fn: reopen }, { label: count > 1 ? 'Give 1' : 'Give it', fn: function () { send(f, 1); } }];
          if (count > 1) choices.push({ label: 'Give all ' + count, fn: function () { send(f, count); } });
          self.say([{ text: 'Give ' + f.name + ' your ' + it.name + (count > 1 ? ' (' + count + ' in this slot)' : '') + '?' }], { choices: choices });
        }
        close();
        if (near.length === 1) { howMany(near[0]); return; }
        self.say([{ text: 'Who should get your ' + it.name + '?' }], { choices: near.slice(0, 3).map(function (f) {
          return { label: f.name, fn: function () { self.time.delayedCall(80, function () { howMany(f); }); } };
        }).concat([{ label: 'Never mind', fn: reopen }]) });
      }
      // v3.31: dragging. A press that moves more than 10 px picks the item up (it follows your finger or the mouse); let
      // go over another slot to swap the two. Hold it over the "more" buttons to scroll the backpack.
      var ghost = this.add.image(0, 0, 'i_hoe').setScale(2.6).setAlpha(0.92).setVisible(false); c.add(ghost);
      function cellAt(p) {
        var lx = p.x - c.x, ly = p.y - c.y;
        for (var q = 0; q < cells.length; q++) { var o = cells[q]; if (lx >= o.x - 3 && lx < o.x + CS + 3 && ly >= o.y - 3 && ly < o.y + CS + 3) return slotOf(o.k); }
        return -1;
      }
      function onMove(p) {
        if (!drag || p.id !== drag.id || self.modal !== m) return;
        if (!drag.on) {
          if (Math.hypot(p.x - drag.x0, p.y - drag.y0) < 10 || !S.inv[drag.from]) return;
          drag.on = true; picked = -1;
          ghost.setTexture(LC.ITEMS[S.inv[drag.from].id].icon).setVisible(true);
        }
        var lx = p.x - c.x, ly = p.y - c.y, now = self.time.now;
        ghost.setPosition(lx, ly - 16);
        if (rowsBack > VR && lx >= bx - 6 && lx < bx + 64 && now - (drag.sc || 0) > 350) {
          if (ly >= gyB - 6 && ly < gyB + 2 * GAP + 4 && top > 0) { top--; drag.sc = now; }
          else if (ly >= gyB + (VR - 2) * GAP - 6 && ly < gyB + VR * GAP + 4 && top + VR < rowsBack) { top++; drag.sc = now; }
        }
        drag.over = cellAt(p);
        render();
      }
      function onUp(p) {
        if (!drag || p.id !== drag.id) return;
        var d = drag; drag = null; ghost.setVisible(false);
        if (self.modal !== m) return;
        if (!d.on) { cur = d.from; act(); return; }   // a tap: pick up, then swap (as before)
        var to = cellAt(p);
        if (to >= 0 && to !== d.from) {
          var t = S.inv[d.from]; S.inv[d.from] = S.inv[to]; S.inv[to] = t;
          cur = to; LC.Audio.sfx('plant'); LC.emit('inv'); rebuild();
        }
        render();
      }
      this.input.on('pointermove', onMove); this.input.on('pointerup', onUp); this.input.on('pointerupoutside', onUp);
      c.once('destroy', function () { self.input.off('pointermove', onMove); self.input.off('pointerup', onUp); self.input.off('pointerupoutside', onUp); });
      function close() { c.destroy(); if (self.modal === m) self.modal = null; }
      m = {
        type: 'inv', close: close,
        key: function (code) {
          if (code === 'Escape' || code === 'Tab' || code === 'KeyI') { close(); return; }
          if (code === 'KeyT' || code === 'Delete' || code === 'Backspace') { throwAway(); return; }
          if (code === 'KeyG' && coop) { give(); return; }
          if (code === 'KeyF') { stepFilter(1); return; }
          if (code === 'KeyR') { stepFilter(-1); return; }
          if (code === 'ArrowLeft' || code === 'KeyA') move('left');
          else if (code === 'ArrowRight' || code === 'KeyD') move('right');
          else if (code === 'ArrowUp' || code === 'KeyW') move('up');
          else if (code === 'ArrowDown' || code === 'KeyS') move('down');
          else if (ACCEPT[code]) { act(); return; }
          render();
        },
        wheel: function (dy) {
          if (rowsBack <= VR) return;
          top = Phaser.Math.Clamp(top + (dy > 0 ? 1 : -1), 0, rowsBack - VR);
          var p = view.indexOf(cur);
          if (p >= 9) cur = view[Math.min(view.length - 1, Math.max(9 + top * 9, Math.min(p, 9 + (top + VR) * 9 - 1)))];
          render();
        }
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
