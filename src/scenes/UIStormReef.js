/* The Chapter 12 journal, ship compass, and Idris's companion controls. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var C = LC.C12, U = LC.UIScene.prototype, W = LC.WorldScene.prototype;
  var previousGoal = LC.ch5Goal;
  LC.ch5Goal = function () {
    var S = LC.State.s;
    if (!C.ready(S) || C.step(S) >= C.end) return previousGoal.apply(this, arguments);
    var world = LC.game.scene.getScene('World'), q = S.quests;
    var atSea = world.area === 'stormsea', onDeck = world.area === 'stormdeck';
    var text = [
      'Meet Nakhoda Idris and Lina at the east side of Nenek’s farm jetty.',
      C.needsBell(q) ? (world.area === 'farmhouse' ? 'Take the brass bell from the hook near your bed.' :
        'Open Nenek’s house menu, choose Enter house, and take the brass bell by your bed.') :
        atSea ? 'Follow the Pedoman to the rival ship. Avoid the waterspouts and close in to fire.' : 'Use the vinta at the farm jetty to sail to Storm Reef.',
      onDeck ? 'Fight the raiders and the rival captain on the deck.' : 'Pull alongside and board the rival ship. You can resume from the farm jetty.',
      onDeck ? 'Dodge the Kraken’s marked attacks. Strike its eye when Pelita reveals it.' : 'Use the farm jetty to return to the treasure ship.',
      q.c12Rescued === 7 ? (atSea ? 'Follow the Pedoman home.' : 'Return Lina’s lantern at the farm jetty.') :
        onDeck ? 'Use the helm at the stern to sail to the sandbar.' :
        q.c12Rescued & 1 ? 'Bring the other two fishing crews aboard. Follow the Pedoman to each boat.' :
        C.needsSignal(q) ? 'Steer toward the light on the sandbar and flash Lina’s lantern.' : 'Steer toward Pak Yusof’s answering light and pull alongside his boat.'
    ];
    return 'Chapter 12: ' + text[C.step(S)];
  };

  var companions = W.companionCount;
  W.companionCount = function () { return companions.apply(this, arguments) + (this.storm && this.storm.jack ? 1 : 0); };
  var rows = U.companionRows;
  U.companionRows = function () {
    var list = rows.apply(this, arguments), self = this, world = this.world, q = this.S.quests;
    if (C.step(this.S) < C.end) return list;
    list.push({ companionId: 'jack', companionStatus: q.c12Jack ? 'In your party' : 'At the jetty',
      icon: 'npc_jack12_0', label: 'Nakhoda Idris' + (q.c12Jack ? ' (with you)' : ''), right: q.c12Jack ? 'Dismiss' : 'Bring',
      sub: 'Idris follows you and fights nearby enemies whenever you go into battle.', action: function () {
        q.c12Jack = !q.c12Jack; world.refreshStormJack(); LC.State.save();
        self.toast(q.c12Jack ? 'Idris is ready to fight at your side.' : 'Idris heads back to the jetty.', 'npc_jack12_0');
      } });
    return list;
  };
  var stats = U.statRows;
  U.statRows = function () {
    var list = stats.apply(this, arguments);
    if (C.step(this.S) >= C.end) list.push({ icon: 'i_serpihan_ribut', label: 'Treasure Hunter’s Luck', sub: 'Every boss defeat grants one extra roll for rare loot or kepeng.' });
    return list;
  };
  var draw = U.drawSkills;
  U.drawSkills = function () { draw.apply(this, arguments); this.drawStormCompass(); };
  U.drawStormCompass = function () {
    var world = this.world, state = world && world.storm, sea = state && state.sea, boss = state && state.boss;
    var show = state && !this.modal && !world.leaving && !world.sleeping && (sea || boss && boss.phase !== 'sink');
    var h = this.stormHUD;
    if (!h || !h.panel.scene) {
      if (!show) return;
      var g = this.add.graphics().setDepth(55);
      this.panel(g, 687, 230, 259, 124);
      h = this.stormHUD = { panel: g, needle: this.add.graphics().setDepth(56),
        title: this.txt(703, 241, '', 18, '#ffe0a0').setDepth(56),
        target: this.txt(703, 269, '', 15, '#e8f7ed', { wrap: 167 }).setDepth(56),
        hull: this.txt(703, 310, '', 14, '#def3e6').setDepth(56),
        port: this.txt(703, 329, '', 13, '#bcdbd7').setDepth(56) };
      this.pin('tr', [h.panel, h.needle, h.title, h.target, h.hull, h.port]); this.layout();
    }
    [h.panel, h.needle, h.title, h.target, h.hull, h.port].forEach(function (o) { o.setVisible(!!show); });
    if (!show) return;
    var needle = h.needle;
    needle.clear();
    if (sea) {
      var dest = world.stormDestination(), dx = dest.point.x - sea.x, dy = dest.point.y - sea.y, a = Math.atan2(dy, dx);
      var x = 907, y = 284;
      needle.fillStyle(0x263640, 1); needle.fillCircle(x, y, 24);
      needle.lineStyle(2, 0xd3a86e, 1); needle.strokeCircle(x, y, 24);
      needle.fillStyle(0xffd983, 1); needle.fillTriangle(x + Math.cos(a) * 19, y + Math.sin(a) * 19,
        x + Math.cos(a + 2.1) * 8, y + Math.sin(a + 2.1) * 8, x + Math.cos(a - 2.1) * 8, y + Math.sin(a - 2.1) * 8);
      h.title.setText('Pedoman · ' + LC.compassName(a));
      h.target.setText(dest.label + '\n' + Math.round(Math.hypot(dx, dy) / 16) + ' tiles away');
      h.hull.setText('Hull ' + sea.hull + '%' + (sea.rivalHull ? ' · Rival ' + Math.ceil(sea.rivalHull / 90 * 100) + '%' : ''));
      var home = Math.atan2((C.port.y + 0.5) * 16 - sea.y, (C.port.x + 0.5) * 16 - sea.x);
      h.port.setText('Home jetty · ' + LC.compassName(home));
    } else {
      h.title.setText('Kraken');
      h.target.setText(boss.phase === 'eye' ? 'Eye exposed' :
        boss.phase === 'windup' && boss.tailTarget ? 'Tail smash incoming' : 'Watch the deck');
      h.hull.setText('Health ' + Math.max(0, boss.eye.hp) + ' / ' + boss.eye.def.hp);
      h.port.setText('');
    }
  };
})(window.LC);
