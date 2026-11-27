/* The Chapter 12 journal, illustrated sea and boss HUD, and Idris's companion controls. */
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
  U.drawSkills = function () { draw.apply(this, arguments); this.drawStormHUD(); };
  U.createStormHUD = function () {
    var root = this.add.container(672, 232).setDepth(55);
    var h = {
      root: root,
      frame: this.add.image(0, 0, 'storm_hud12').setOrigin(0).setScale(2),
      crest: this.add.image(226, 53, 'storm_compass12').setScale(2),
      needle: this.add.image(226, 51, 'storm_needle12').setScale(2),
      title: this.txt(16, 11, '', 21, '#ffdc9a'),
      status: this.txt(16, 36, '', 17, '#a8d9d5'),
      target: this.txt(16, 59, '', 15, '#f6ead4', { wrap: 173 }),
      distance: this.txt(16, 81, '', 13, '#abc8cb'),
      bar: this.add.graphics(),
      gauge: this.txt(16, 106, '', 15, '#e9c998'),
      number: this.txt(257, 106, '', 14, '#f7eddc', { ox: 1 }),
      footer: this.txt(16, 123, '', 13, '#acc9c8'),
      rival: this.txt(257, 123, '', 13, '#f4bca4', { ox: 1 })
    };
    root.add([h.frame, h.crest, h.needle, h.title, h.status, h.target, h.distance, h.bar, h.gauge, h.number, h.footer, h.rival]);
    this.pin('tr', [root]);
    this.layout();
    return h;
  };
  U.drawStormHUD = function () {
    var world = this.world, state = world && world.storm, sea = state && state.sea, boss = state && state.boss;
    var show = state && !this.modal && !world.leaving && !world.sleeping && (sea || boss && boss.phase !== 'sink');
    var h = this.stormHUD;
    if (!h || !h.root.scene) {
      if (!show) return;
      h = this.stormHUD = this.createStormHUD();
    }
    h.root.setVisible(!!show);
    if (!show) return;

    var crest = sea ? 'storm_compass12' : 'storm_boss_crest12', fraction, color;
    if (h.crest.texture.key !== crest) h.crest.setTexture(crest);
    h.needle.setVisible(!!sea); h.distance.setVisible(!!sea);
    if (sea) {
      var dest = world.stormDestination(), dx = dest.point.x - sea.x, dy = dest.point.y - sea.y, a = Math.atan2(dy, dx);
      var tiles = Math.round(Math.hypot(dx, dy) / 16);
      h.needle.setRotation(a);
      h.title.setText('Pedoman');
      h.status.setText(LC.compassName(a)).setColor('#a8d9d5');
      h.target.setText(dest.label);
      h.distance.setText(tiles + (tiles === 1 ? ' tile away' : ' tiles away'));
      var home = Math.atan2((C.port.y + 0.5) * 16 - sea.y, (C.port.x + 0.5) * 16 - sea.x);
      h.gauge.setText('Hull');
      h.number.setText(sea.hull + '%');
      h.footer.setText('Home · ' + LC.compassName(home));
      h.rival.setText(sea.rivalHull ? 'Rival · ' + Math.ceil(sea.rivalHull / 90 * 100) + '%' : '');
      fraction = sea.hull / 100;
      color = fraction <= 0.3 ? 0xe77570 : 0x65b5a5;
    } else {
      var exposed = boss.phase === 'eye', winding = boss.phase === 'windup', tail = winding && boss.tailTarget;
      var hp = Math.max(0, boss.eye.hp), max = boss.eye.def.hp;
      h.title.setText('Kraken');
      h.status.setText(exposed ? 'Eye exposed' : tail ? 'Tail smash' : winding ? 'Arm slam' : boss.phase === 'rise' ? 'Rising' : 'Recovering')
        .setColor(exposed ? '#9fe6bf' : winding ? '#ffc195' : '#a8d9d5');
      h.target.setText(exposed ? 'Strike the eye' : tail ? 'Clear the ring' : winding ? 'Step off the marked deck' : 'Watch the deck');
      h.gauge.setText('HP');
      h.number.setText(hp + ' / ' + max);
      h.footer.setText(hp <= max / 2 ? 'Enraged' : exposed ? '' : 'Wait for Pelita’s light');
      h.rival.setText('');
      fraction = hp / max;
      color = exposed ? 0x7accad : 0xd27b79;
    }
    if (h.fraction !== fraction || h.barColor !== color) {
      h.fraction = fraction; h.barColor = color;
      h.bar.clear();
      h.bar.fillStyle(0x735947, 1); h.bar.fillRoundedRect(60, 108, 124, 13, 3);
      h.bar.fillStyle(0x0a1822, 1); h.bar.fillRoundedRect(62, 110, 120, 9, 2);
      var fill = Math.round(fraction * 118);
      if (fill > 0) {
        h.bar.fillStyle(color, 1); h.bar.fillRect(63, 111, fill, 7);
        h.bar.fillStyle(0xffffff, 0.24); h.bar.fillRect(63, 111, fill, 2);
      }
    }
  };
})(window.LC);
