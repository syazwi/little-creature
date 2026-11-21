/* UI, part 2 (v1.3): the fishing minigame, villager menus (talk, requests, shops), house building,
 * folk-spirit visits, the Journal and the place-name banner. Mixed into LC.UIScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var ACCEPT = { KeyE: 1, Space: 1, Enter: 1 };
  function heartStr(h) { return h + ' / 10 ♥'; }

  Object.assign(LC.UIScene.prototype, {
    // ================================================================ place banner
    areaBanner: function (name, sub) {
      var self = this;
      if (this.banner) this.banner.destroy();
      var c = this.banner = this.add.container(Math.round(this.scale.width / 2), 118 + this.safe.t).setDepth(85).setAlpha(0);
      c.add([this.txt(0, 0, name, 34, '#ffd166', { ox: 0.5, oy: 0.5, stroke: 6 }), this.txt(0, 30, sub, 16, '#fbecc8', { ox: 0.5, oy: 0.5, stroke: 4 })]);
      this.tweens.add({ targets: c, alpha: 1, duration: 450, onComplete: function () {
        self.tweens.add({ targets: c, alpha: 0, delay: 1900, duration: 700, onComplete: function () { c.destroy(); if (self.banner === c) self.banner = null; } });
      } });
    },

    // ================================================================ fishing
    // wait for a bite -> strike in time -> stop the marker in the green zone (2 tries)
    openFishing: function (kind, done, onBite) {
      this.closeModal();
      var self = this, naga = LC.State.friend('naga'), fishId = LC.State.rollFish(kind), it = LC.ITEMS[fishId], diff = it.diff || 1;
      var c = this.modalC(95, undefined, 0, true);
      var X = 270, Y = 452, Wd = 420, Hd = 104, BX = X + 24, BW = Wd - 48, BY = Y + 66;
      var bg = this.add.graphics(); this.panel(bg, X, Y, Wd, Hd); c.add(bg);
      var title = this.txt(X + Wd / 2, Y + 14, 'Fishing in the ' + (LC.WATER_NAMES[kind] || 'water'), 18, '#ffd166', { ox: 0.5 });
      var msg = this.txt(X + Wd / 2, Y + 40, '', 16, '#fbecc8', { ox: 0.5 });
      var bar = this.add.graphics();
      var hint = this.txt(X + Wd / 2, Y + Hd - 12, this.touchOn ? 'Tap anywhere · X (top) to stop' : 'E / Space / click · Esc to stop', 11, '#8a7a6a', { ox: 0.5, oy: 1 });
      c.add([title, msg, bar, hint]);
      var phase = 'wait', ev = null, tries = 2, opened = this.time.now, dots = 0, m;
      var zw = [0.36, 0.26, 0.17][diff - 1] * (naga ? 1.35 : 1), z0 = 0.05 + Math.random() * (0.9 - zw), pos = 0, vel = [0.75, 1.05, 1.45][diff - 1];
      var STRIKE = this.touchOn ? 'Tap now!' : 'Press E now!';
      function setMsg(t, col) { msg.setText(t).setColor(col || '#fbecc8'); }
      setMsg('Waiting for a bite');
      var loop = this.time.addEvent({ delay: 16, loop: true, callback: function () {
        if (phase === 'wait') { dots = (dots + 1) % 90; msg.setText('Waiting for a bite' + '...'.slice(0, Math.floor(dots / 30) + 1)); }
        bar.clear();
        if (phase !== 'reel' && phase !== 'result') return;
        if (phase === 'reel') { pos += vel * 0.016; if (pos > 1) { pos = 2 - pos; vel = -vel; } if (pos < 0) { pos = -pos; vel = -vel; } }
        bar.fillStyle(0x000000, 0.6); bar.fillRect(BX, BY, BW, 14);
        bar.fillStyle(0x6fd06a, 1); bar.fillRect(BX + z0 * BW, BY + 1, zw * BW, 12);
        bar.fillStyle(0xb8f0a0, 1); bar.fillRect(BX + z0 * BW, BY + 1, zw * BW, 3);
        bar.fillStyle(0xffd166, 1); bar.fillRect(BX + pos * BW - 2, BY - 4, 4, 22);
      } });
      function bite() {
        phase = 'bite'; setMsg('!! A bite !!  ' + STRIKE, '#ff8a7a');
        LC.Audio.sfx('bite'); onBite();
        ev = self.time.delayedCall(naga ? 1150 : 850, function () { if (phase === 'bite') finish(null, 'Too slow... it got away.'); });
      }
      ev = this.time.delayedCall((1400 + Math.random() * 2800) * (naga ? 0.6 : 1), bite);
      function finish(id, text) {
        phase = 'result'; if (ev) ev.remove();
        setMsg(text, id ? '#b8f0c8' : '#cdb8a0');
        self.time.delayedCall(id ? 650 : 900, function () { close(); done(id); });
      }
      function press() {
        if (self.time.now - opened < 250) return;
        if (phase === 'wait') { if (ev) ev.remove(); finish(null, 'Too early! The fish swam off.'); }
        else if (phase === 'bite') { if (ev) ev.remove(); phase = 'reel'; pos = 0; setMsg('Reel in! Stop the marker in the green.', '#ffd166'); LC.Audio.sfx('reel'); }
        else if (phase === 'reel') {
          if (pos >= z0 && pos <= z0 + zw) finish(fishId, it.kind === 'junk' ? 'Hmm, that feels light...' : 'Got it!');
          else if (--tries > 0) { LC.Audio.sfx('reel'); setMsg('Almost! It\'s still on the line. Once more!', '#ffd166'); }
          else finish(null, 'The line went slack. It escaped!');
        }
      }
      function close() { loop.remove(); if (ev) ev.remove(); c.destroy(); if (self.modal === m) self.modal = null; }
      m = {
        type: 'fish', close: function () { if (phase !== 'result') { close(); done(null); } else close(); },
        key: function (code) { if (ACCEPT[code]) press(); else if (code === 'Escape') { if (phase !== 'result') { close(); done(null); } } },
        click: press,
        peek: function () { return { phase: phase, pos: pos, z0: z0, zw: zw, fish: fishId }; }   // for automated tests
      };
      this.modal = m;
    },

    // ================================================================ villagers
    openVillager: function (vid) {
      var self = this, S = this.S, W = this.world, v = LC.villager(vid), f = LC.State.folk(vid), por = 'npc_' + LC.villagerKey(vid) + '_0';
      if (!f.met) {
        f.met = true;
        this.say(v.intro.map(function (t) { return { name: v.name, portrait: por, text: t }; }), { onDone: function () {
          if (vid === 'mat' && !LC.State.count('joran') && LC.State.add('joran', 1)) { LC.Audio.sfx('chime'); self.toast('Pak Mat gave you his old Joran (fishing rod)! Hold it and face the water.', 'i_joran'); }
          if (vid === 'lah' && !S.flags.lahHen) {
            S.flags.lahHen = true;
            W.doShared('animal_add', { kind: 'ayam' }, function (res) {
              if (res && res.ok) { LC.Audio.sfx('cluck'); self.toast('Pak Lah gave you a hen called ' + res.name + '! She is waiting at Nenek\'s reban on the farm.', 'chicken_0'); }
            });
            if (LC.State.add('dedak', 5)) self.toast('...and 5 dedak to feed her.', 'i_dedak');
          }
          if (vid === 'tanggang' && !S.quests.tanggang) S.quests.tanggang = 1;
          if (vid === 'badang' && !S.quests.badang) { S.quests.badang = 1; self.badangAsk(); return; }   // v1.7: will you keep watch with him?
          self.openVillager(vid);
        } });
        return;
      }
      if (vid === 'tanggang' && LC.hasStone() && !S.quests.stoneTold) {   // v1.6: a friend's gift, the stone curse
        S.quests.stoneTold = 1; LC.Audio.sfx('stage');
        this.say(LC.storyLines(LC.TEXT.stoneGift), { onDone: function () { self.openVillager(vid); } });
        return;
      }
      var quote = v.chat[Math.floor(Math.random() * v.chat.length)];
      function gifts(list) {
        list.forEach(function (g, k) {
          self.time.delayedCall(700 + k * 600, function () {
            LC.Audio.sfx('chime');
            self.toast(v.name + ' gives you a gift for your friendship (' + g.hearts + ' ♥): ' + (g.item === 'kepeng' ? g.n + ' kepeng' : g.n + ' ' + LC.ITEMS[g.item].name) + '!', g.item === 'kepeng' ? 'i_kepeng' : 'i_' + g.item);
          });
        });
      }
      function deliver() {
        var t = f.task;
        if (f.done || LC.State.count(t.item) < t.n) return;
        LC.State.remove(t.item, t.n);
        S.kepeng += t.reward; S.stats.earned += t.reward; f.done = true;
        LC.Audio.sfx('coin');
        self.toast(v.name + ': "Terima kasih!" (+' + t.reward + ' kepeng)', 'i_kepeng');
        gifts(LC.State.addFriendship(vid, 3));
        W.doShared('kind', {}, function (res) { if (res && res.ok) self.toast('Pelita is proud of your kindness. (+' + res.b + ' bond)', 'ic_bond'); });
      }
      function chat() {
        if (f.chatDay === S.day) { self.toast(v.name + ': "' + quote + '"'); return; }
        f.chatDay = S.day;
        LC.Audio.sfx('pet');
        self.toast(v.name + ': "' + quote + '"  (+friendship)', 'ic_joy');
        gifts(LC.State.addFriendship(vid, 1));
      }
      var tabs = [{ label: 'Talk', rows: function () {
        var t = f.task, it = LC.ITEMS[t.item], have = LC.State.count(t.item), rows = [];
        rows.push(f.done ? { icon: 'ic_bond', label: 'Today\'s request: done!', sub: 'Thank you! Come back tomorrow for a new one.' }
          : { icon: it.icon, label: 'Request: ' + t.n + ' ' + it.name, sub: 'Needed ' + v.taskText + '. You have ' + have + '. Reward: ' + t.reward + ' kepeng + friendship.',
            right: have >= t.n ? 'Give' : have + '/' + t.n, enabled: have >= t.n, why: 'You need ' + t.n + ' ' + it.name + ' (you have ' + have + ').', action: deliver });
        if (v.clean) {   // Tok Duyung takes all the rubbish you collected around the reef
          var n = LC.State.count('sampah'), done = S.stats.cleaned || 0, nextGift = Object.keys(LC.CLEAN_GIFTS).map(Number).filter(function (k) { return k > done; })[0];
          rows.push({ icon: 'i_sampah', label: 'Hand in rubbish (' + n + ')', sub: '8 kepeng a piece, and the reef grows healthier. Cleaned so far: ' + done + (nextGift ? '. A gift at ' + nextGift + '.' : '. The reef sings again!'),
            right: n ? 'Give' : '', enabled: n > 0, why: 'Clean up rubbish around the reef first.', action: function () {
              var k = LC.State.count('sampah'); if (!k) return;
              LC.State.remove('sampah', k); S.kepeng += k * 8; S.stats.earned += k * 8; S.stats.cleaned = done + k;
              LC.Audio.sfx('coin');
              self.toast('Tok Duyung: "The reef thanks you!" (+' + (k * 8) + ' kepeng)', 'i_kepeng');
              Object.keys(LC.CLEAN_GIFTS).forEach(function (t) {
                if (S.stats.cleaned >= +t && done < +t) { var g = LC.CLEAN_GIFTS[t]; if (g[0] === 'kepeng') S.kepeng += g[1]; else LC.State.add(g[0], g[1]);
                  self.time.delayedCall(700, function () { LC.Audio.sfx('chime'); self.toast('Tok Duyung gives you a gift for cleaning ' + t + ' pieces: ' + (g[0] === 'kepeng' ? g[1] + ' kepeng' : g[1] + ' ' + LC.ITEMS[g[0]].name) + '!', g[0] === 'kepeng' ? 'i_kepeng' : 'i_' + g[0]); }); }
              });
              W.doShared('kind', { n: Math.min(10, 2 + k) }, function (res) { if (res && res.ok) self.toast('Pelita sparkles like the clean sea. (+' + res.b + ' bond)', 'ic_bond'); });
            } });
        }
        self.specialRows(vid, v, por).forEach(function (r) { rows.push(r); });   // v1.5: training and the deep quests
        rows.push({ icon: 'ic_joy', label: 'Chat', sub: f.chatDay === S.day ? 'You already chatted today.' : 'Pass the time of day. (+friendship, once a day)', action: chat });
        var h = LC.State.hearts(vid), next = [3, 6, 10].filter(function (k) { return k > h; })[0];
        rows.push({ icon: 'ic_joy', label: 'Friendship: ' + heartStr(h), sub: next ? 'At ' + next + ' ♥ ' + v.name + ' will give you a gift.' : 'Best friends! Every gift has been given.' });
        if (vid === 'leong') rows.push({ icon: 'i_kayu', label: 'How do I build a house?', sub: 'Bring materials and kepeng, then use an empty plot (string and stakes). It is raised overnight and a family moves in.', action: function () { self.say(v.intro.slice(1).map(function (t) { return { name: v.name, portrait: por, text: t }; })); } });
        if (vid === 'penghulu') {
          var built = Object.keys(S.buildings).filter(function (p) { return S.buildings[p].done; }).length;
          rows.push({ icon: 'i_kayu', label: 'Rebuilding the kampung: ' + built + ' / 4 houses', sub: built >= 4 ? 'Every family is home again. The kampung is whole!' : 'Each new house brings a neighbour home. Ask Tukang Leong how to build.' });
        }
        return rows;
      } }];
      if (v.shop) tabs.push({ label: 'Buy', rows: function () {
        return self.animalShopRows(v).concat(v.shop.map(function (id) {
          var it = LC.ITEMS[id], afford = S.kepeng >= it.price, room = LC.State.canAdd(id);
          var need = v.shopNeeds && v.shopNeeds[id], friendOk = !need || LC.State.hearts(vid) >= need, owned = it.kind === 'vehicle' && LC.State.count(id) > 0;
          return { icon: it.icon, label: it.name + (owned ? '  (yours)' : ''), sub: it.desc + (need && !friendOk ? ' Only for friends: ' + need + ' ♥.' : ''), right: it.price + ' k',
            enabled: afford && room && friendOk && !owned, why: owned ? 'You already have one!' : !friendOk ? v.name + ' only sells it to a friend (' + need + ' ♥).' : afford ? 'Your bag is full!' : 'Not enough kepeng.',
            qty: it.kind === 'vehicle' || it.one ? null : { id: id, price: it.price },   // v2.7.5: choose how many
            action: function () {
              S.kepeng -= it.price; LC.State.add(id, 1); LC.Audio.sfx('buy');
              if (it.kind === 'vehicle') self.toast('The ' + it.name + ' is yours! Press R (or select it and press USE) to ' + 'ride.', it.icon);
            } };
        }));
      } });
      if (v.buys) tabs.push({ label: 'Sell', empty: 'Nothing they want right now.', rows: function () {
        var seen = {}, rows = [];
        S.inv.forEach(function (sl) {
          if (!sl || seen[sl.id]) return;
          var it = LC.ITEMS[sl.id];
          if (!it.sell || !(v.buys.cat ? it.cat === v.buys.cat : v.buys.items.indexOf(sl.id) >= 0)) return;
          seen[sl.id] = 1;
          var price = Math.round(it.sell * v.buys.mult);
          rows.push({ icon: it.icon, label: it.name + '  x' + LC.State.count(sl.id), sub: it.desc, right: '+' + price + ' k',
            action: function () { LC.State.remove(sl.id, 1); S.kepeng += price; S.stats.earned += price; LC.Audio.sfx('coin'); } });
        });
        return v.animals ? rows.concat(self.animalSellRows('lah')) : rows;   // v2.3.2: Pak Lah buys farm animals back
      } });
      this.openMenu({ title: v.name, coins: !!(v.shop || v.buys), tabs: tabs, footer: function () { return v.role + ' · ' + heartStr(LC.State.hearts(vid)) + (v.buys ? ' · buys at a better price than the warung' : ''); } });
    },

    // ================================================================ house building
    openBuild: function (plot) {
      var self = this, S = this.S, W = this.world;
      this.openMenu({
        title: 'Build a house', coins: true,
        footer: 'Kayu: forest branches · Atap: island nipa palms · Batu: mountain boulders · Tanah Liat: dune clay pits. Tukang Leong sells them too.',
        tabs: [{ label: 'Houses', rows: function () {
          return Object.keys(LC.HOUSES).map(function (k) {
            var H = LC.HOUSES[k], has = LC.State.has(H.cost), afford = S.kepeng >= H.kepeng;
            var need = Object.keys(H.cost).map(function (id) { return H.cost[id] + ' ' + LC.ITEMS[id].name + ' (' + LC.State.count(id) + ')'; }).join(', ');
            return { icon: 'house_' + k, iconScale: 0.55, label: H.name, sub: H.desc + ' Needs ' + need + '.', right: H.kepeng + ' k', enabled: has && afford,
              why: !has ? 'You need more materials.' : 'Not enough kepeng.', action: function () { if (W.buildHouse(plot, k)) return 'close'; } };
          });
        } }]
      });
    },

    // ================================================================ folk spirits
    spiritRows: function (fromHouse) {
      var self = this, S = this.S, W = this.world;
      return LC.SPIRIT_ORDER.map(function (sid) {
        var sp = LC.SPIRITS[sid], friend = LC.State.friend(sid), met = S.flags['met_' + sid], A = LC.AREAS[sp.area];
        if (!friend) return { icon: 'sp_' + sid, iconScale: met ? 1.4 : 1.4, label: met ? sp.name + ' (' + sp.title + ')' : '??? ' + (LC.State.isOpen(sp.area) ? '' : '(Lv ' + A.lvl + ')'),
          sub: met ? 'Wishes for: ' + Object.keys(sp.wish).map(function (id) { return sp.wish[id] + ' ' + LC.ITEMS[id].name; }).join(', ') + '. Find it in ' + A.name + '.' : 'A spirit is rumoured to live in ' + A.name + '.' };
        var comp = S.companion === sid, played = (S.spirits[sid] || {}).playDay === S.day;
        return { icon: 'sp_' + sid, iconScale: 1.4, label: sp.name + (comp ? '  (with you)' : ''), sub: 'Blessing: ' + sp.blessing + '. ' + (fromHouse ? 'Choose to visit, play, or bring it along.' : ''),
          right: played ? '' : 'Play', action: function () { self.openFolkSpirit(sid); } };
      });
    },
    openFolkSpirit: function (sid) {
      var self = this, S = this.S, W = this.world, sp = LC.SPIRITS[sid];
      this.openMenu({
        title: sp.name, footer: sp.lore,
        tabs: [{ label: 'Visit', rows: function () {
          var played = (S.spirits[sid] || {}).playDay === S.day, comp = S.companion === sid;
          var extra = sid === 'bunian' ? [self.bunianQuestRow()] : [];
          return extra.concat([
            { icon: 'ic_joy', label: 'Play together', sub: played ? 'You already played today. Come back tomorrow!' : 'Pelita loves its new friend. (+bond, once a day)', enabled: !played, why: 'Already played today.', action: function () { W.playSpirit(sid); return 'close'; } },
            { icon: 'sp_' + sid, iconScale: 1.4, label: comp ? 'Ask it to go home' : 'Ask it to come along', sub: comp ? 'It travels with you everywhere you go.' : 'It will follow you on your travels (one companion at a time).' + (S.companion && !comp ? ' The ' + LC.SPIRITS[S.companion].name + ' will go home.' : ''), action: function () { W.setCompanion(sid); } },
            { icon: 'ic_glow', label: 'Blessing', sub: sp.blessing + '. It works while the spirit is your friend.' }
          ]);
        } }]
      });
    },

    // ================================================================ journal
    openJournal: function () {
      var self = this, S = this.S;
      this.openMenu({
        title: 'Journal', footer: function () { return 'Pelita Lv ' + LC.State.level() + ' · Day ' + S.day + ' · ' + Object.keys(S.visited).filter(function (k) { return S.visited[k]; }).length + ' places visited'; },
        tabs: [
          { label: 'Requests', empty: 'No villagers met yet. Kampung Tepian is along the road east (Pelita Lv 2).', rows: function () {
            return Object.keys(LC.VILLAGERS).filter(function (vid) { return S.folk[vid] && S.folk[vid].met; }).map(function (vid) {
              var v = LC.villager(vid), key = LC.villagerKey(vid), f = LC.State.folk(vid), t = f.task, it = LC.ITEMS[t.item], have = LC.State.count(t.item);
              return { icon: 'npc_' + key + '_0', iconScale: key === 'badangK' ? 1.25 : 1.6, label: v.name + ' (' + v.role.toLowerCase() + ')',
                sub: f.done ? 'Request done for today. Thank you!' : 'Wants ' + t.n + ' ' + it.name + ' ' + v.taskText + ' (you have ' + have + '). Reward ' + t.reward + ' kepeng.',
                right: f.done ? 'Done' : have >= t.n ? 'Ready!' : have + '/' + t.n };
            });
          } },
          { label: 'Places', rows: function () {
            return LC.AREA_ORDER.map(function (a) {
              var A = LC.AREAS[a], open = LC.State.isOpen(a), lvOk = LC.State.level() >= A.lvl;
              var why = !lvOk ? 'Locked until Pelita reaches Lv ' + A.lvl + '.' : A.needs && !LC.State.friend(A.needs) ? 'Befriend the ' + LC.SPIRITS[A.needs].name + ' first: ' + LC.AREA_HOWTO[a] : LC.AREA_HOWTO[a];
              if (A.wear && !S.visited[a] && !open) return { icon: 'ic_moon', label: '???', sub: 'The Orang Bunian are said to live somewhere in Hutan Rimba... if only you could see them.', right: 'Hidden' };
              return { icon: open ? 'ic_sun' : 'ic_moon', label: A.name + (lvOk ? '' : '  (Pelita Lv ' + A.lvl + ')'), sub: A.sub.charAt(0).toUpperCase() + A.sub.slice(1) + '. ' + (open ? LC.AREA_HOWTO[a] : why),
                right: S.visited[a] ? 'Visited' : open ? 'New!' : 'Locked' };
            });
          } },
          { label: 'Spirits', rows: function () { return self.spiritRows(false); } },
          { label: 'Fish', rows: function () {
            return Object.keys(LC.ITEMS).filter(function (id) { return LC.ITEMS[id].kind === 'fish' || LC.ITEMS[id].kind === 'junk'; }).map(function (id) {
              var it = LC.ITEMS[id], n = S.fishLog[id] || 0, where = Object.keys(LC.FISHING).filter(function (k) { return LC.FISHING[k].some(function (e) { return e[0] === id; }); }).map(function (k) { return LC.WATER_NAMES[k]; });
              return { icon: n ? it.icon : 'ic_moon', label: n ? it.name : '???', sub: (n ? it.desc + ' ' : '') + 'Found in the ' + where.join(', ') + (it.night ? ' (best at night)' : '') + '.', right: n ? 'x' + n : '' };
            });
          } },
          { label: 'You', rows: function () { return self.youRows(); } },
          { label: 'Chapters', rows: function () { return self.chapterRows(); } },   // v1.9
          { label: 'Levels', rows: function () {
            var lv = LC.State.level(), rows = [];
            for (var l = 2; l <= LC.MAX_LEVEL; l++) {
              var r = LC.LEVEL_REWARDS[l] || {}, what = [];
              if (r.stage) what.push('Evolves into a ' + LC.STAGES[r.stage].name);
              if (r.unlock) what.push('Opens ' + LC.AREAS[r.unlock].name);
              if (r.text) what.push(r.text);
              rows.push({ icon: lv >= l ? 'ic_bond' : 'ic_moon', label: 'Level ' + l + '  (' + LC.LEVELS[l - 1] + ' bond)', sub: what.join('. ') || 'A gift from Pelita.', right: lv >= l ? 'Reached' : '' });
            }
            return rows;
          } }
        ]
      });
    }
  });
})(window.LC);
