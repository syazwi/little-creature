/* UI, part 13 (v2.4.1): Nek Lampir, your grumpy helper (see neklampir.js). Her button beside the hotbar (C: call her;
 * with her beside you in a fight, the green circle), what she offers when there is nothing to fight (the paid
 * teleport), her rows in the Talk menu (making peace with Nenek) and her line in your Journal. Mixed into LC.UIScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var N = LC.NEK, X = LC.NEKTEXT, POR = 'npc_lampir_0';
  function nekLine(text) { return { name: 'Nek Lampir', portrait: POR, text: text }; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  Object.assign(LC.UIScene.prototype, {
    // ================================================================ her button (left of Langkah Semaun)
    buildNek: function () {
      var self = this;
      this.nekG = this.add.graphics();
      this.nekIcon = this.add.image(80, 604, 'ic_nek').setScale(2.6);
      this.nekKeyT = this.txt(58, 582, 'C', 11, '#a08a6a');
      this.nekCd = this.txt(80, 604, '', 18, '#fffdf2', { ox: 0.5, oy: 0.5, stroke: 4 });
      var z = this.add.zone(56, 580, 48, 48).setOrigin(0).setInteractive({ useHandCursor: true });
      z.isTouchBtn = true;
      z.on('pointerdown', function () { if (!self.modal) self.pressKey('KeyC'); });
      this.nekZone = z;
      this.pin('bc', [this.nekG, this.nekIcon, this.nekKeyT, this.nekCd, z]);
    },
    drawNek: function () {
      var on = LC.hasNek(), g = this.nekG, W = this.world;
      if (!g) return;
      g.clear();
      this.nekIcon.setVisible(on); this.nekKeyT.setVisible(on && !this.touchOn); this.nekCd.setVisible(on); this.nekZone.setVisible(on);
      if (!on) return;
      var here = !!(W && W.nek && !W.nek.leaving), fight = here && W.nekFighting && W.nekFighting();
      var left = here ? (fight ? LC.nekLeft.circle() : 0) : LC.nekLeft.call(), full = here ? N.circle.cd : N.callCd, x = 56, y = 580;
      var ready = !left && (!here || fight);
      g.fillStyle(0x1e1510, 0.85); g.fillRoundedRect(x - 6, y - 8, 60, 64, 10);
      g.lineStyle(2, 0x8a6a3a, 1); g.strokeRoundedRect(x - 6, y - 8, 60, 64, 10);
      g.fillStyle(here ? 0x24402a : 0x2e2219, 1); g.fillRoundedRect(x, y, 48, 48, 6);
      g.lineStyle(ready ? 3 : 1, ready ? (here ? 0x9bff8a : 0xd8c8a8) : 0x6a5034, 1); g.strokeRoundedRect(x, y, 48, 48, 6);
      if (left > 0) { g.fillStyle(0x000000, 0.6); g.fillRect(x + 2, y + 2, 44, 44 * Math.min(1, left / full)); }
      var tex = fight ? 'ic_bulatan' : 'ic_nek';
      if (this.nekIcon.texture.key !== tex) this.nekIcon.setTexture(tex);
      var t = left > 0 ? String(Math.ceil(left)) : '';
      if (this.nekCd.text !== t) this.nekCd.setText(t);
    },

    // ================================================================ "What do you want?" (no fight around)
    openNekService: function (again) {
      var self = this, W = this.world;
      var lines = [nekLine(again ? 'Well? What now?' : pick(X.calm) + (Math.random() < 0.3 ? ' ' + X.pelita : ''))];
      this.say(lines, { choices: [   // (short labels: the choices sit side by side)
        { label: 'Teleport me', fn: function () { self.time.delayedCall(120, function () { self.openNekPlaces(); }); } },
        { label: 'Stay a while', fn: function () { self.toast('Nek Lampir: "Hmph. Fine. But I am not carrying anything."', 'ic_nek'); } },
        { label: again ? 'Go home' : 'Never mind', fn: function () { if (W.nek) W.nekLeave(again ? pick(X.leave) : X.never); } }
      ] });
    },
    openNekPlaces: function () {
      var self = this, S = this.S, W = this.world;
      this.openMenu({
        title: 'Nek Lampir\'s teleport', coins: true,
        footer: function () {
          var l = LC.nekLeft.tp();
          return (l > 0 ? 'She is catching her breath: ready again in ' + Math.ceil(l) + ' seconds. ' : '') + 'Only to places you have been. ' + N.tp.price + ' kepeng; across the sea ' + N.tp.far + '. She rests ' + N.tp.cd + ' seconds after each one.';
        },
        tabs: [{ label: 'Where to?', empty: 'You have not been anywhere else yet. Hmph.', rows: function () {
          var l = LC.nekLeft.tp();
          return LC.nekPlaces(W.area).map(function (a) {
            var A = LC.AREAS[a], price = LC.nekPrice(a), ok = S.kepeng >= price;
            return { icon: 'ic_map', label: A.name, sub: A.sub ? A.sub.charAt(0).toUpperCase() + A.sub.slice(1) + '.' : '', right: price + ' k',
              enabled: ok && l <= 0, why: l > 0 ? 'Nek Lampir: "' + X.tpTired + '" (' + Math.ceil(l) + 's)' : 'Not enough kepeng.',
              action: function () { if (W.nekTeleport(a)) return 'close'; } };
          });
        } }]
      });
    },

    // ================================================================ her Talk menu on Gunung Ledang, and the Journal
    nekRows: function () {
      var self = this, S = this.S, W = this.world, Q = S.quests, rows = [], h = LC.State.hearts('lampir');
      if (LC.nekPeaceReady()) rows.push({ icon: 'ic_nek', label: 'Make peace with Nenek', right: 'Ask', sub: 'She is your best friend now (grumbling all the way). Maybe it is time she visited Nenek...', action: function () {
        if (S.minutes >= 20 * 60 || S.minutes < 6 * 60) { self.toast('Nek Lampir: "At this hour? Nenek is asleep, and so should I be. Come back in the morning."', 'ic_nek'); return; }
        self.say(W.ch2Lines(X.peaceAsk), { onDone: function () { W.nekPeaceGo(); } });
        return 'close';
      } });
      else if (!LC.hasNek()) rows.push({ icon: 'ic_nek', label: 'A grumpy old woman', sub: 'Nek Lampir trusts nobody. Become her best friend (' + N.hearts + ' ♥, you have ' + h + ') and she might do something brave.' });
      if (LC.hasNek()) {
        rows.push({ icon: 'ic_map', label: 'Teleport me somewhere', right: 'Ask', sub: 'Anywhere you have been: ' + N.tp.price + ' kepeng (across the sea ' + N.tp.far + ').', action: function () { self.openNekPlaces(); } });
        rows.push({ icon: 'ic_bulatan', label: 'Her help', sub: 'Press C (or tap her button) anywhere to call her. Only when you are alone: no other helpers, no friends nearby, not under the sea.' });
      }
      return rows;
    },
    nekJournalRow: function () {
      var l = LC.nekLeft, parts = [];
      if (l.rescue() > 0) parts.push('pulling you out: ' + Math.ceil(l.rescue()) + 's');
      if (l.tp() > 0) parts.push('teleport: ' + Math.ceil(l.tp()) + 's');
      return { icon: 'ic_nek', label: 'Nek Lampir, your grumpy helper (C)', sub: 'Only when you are alone. In a fight she throws pepper; press C again for her green circle (half the hurt inside it). She pulls you out of danger when you are badly hurt. No fight: a paid teleport.' + (parts.length ? ' Resting: ' + parts.join(', ') + '.' : '') };
    }
  });

  // ---------------------------------------------------------------- hooks
  var buildSkills = LC.UIScene.prototype.buildSkills;
  LC.UIScene.prototype.buildSkills = function () { buildSkills.apply(this, arguments); this.buildNek(); };
  var drawSkills = LC.UIScene.prototype.drawSkills;
  LC.UIScene.prototype.drawSkills = function () { drawSkills.apply(this, arguments); this.drawNek(); };
  var onKey = LC.UIScene.prototype.onKey;
  LC.UIScene.prototype.onKey = function (ev) {
    if (!this.modal && this.world && !this.world.sleeping && ev.code === 'KeyC') { this.world.nekKey(); return; }
    return onKey.call(this, ev);
  };
  var specialRows = LC.UIScene.prototype.specialRows;
  LC.UIScene.prototype.specialRows = function (vid, v, por) {
    var rows = specialRows.call(this, vid, v, por);
    return vid === 'lampir' ? rows.concat(this.nekRows()) : rows;
  };
  var youRows = LC.UIScene.prototype.youRows;
  LC.UIScene.prototype.youRows = function () {
    var rows = youRows.call(this);
    if (LC.hasNek()) rows.push(this.nekJournalRow());
    return rows;
  };
})(window.LC);
