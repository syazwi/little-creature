/* Companion profiles use the world sprites and the same effect values as gameplay. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var U = LC.UIScene.prototype;
  var roster = U.companionRows;

  function seconds(n) { return n + ' s'; }
  function percent(n) { return Math.round(n * 100) + '%'; }

  function pelita(ui) {
    var ghost = ui.S.ghost, level = LC.State.level(), next = LC.State.nextLevelBond();
    var skills = [
      ['Spirit light', 'Once evolved and happy enough, Pelita follows you and lights the way.'],
      ['Bond gifts', 'Care for Pelita to grow your bond, level up and unlock new gifts.'],
      ['Bag sorting', level >= LC.BAG_SORT_LV ? 'Pelita can sort your items from the Bag menu.' : 'Unlocks at level ' + LC.BAG_SORT_LV + '.']
    ];
    if (LC.pelitaSunUnlocked()) skills.push(['Pelita’s daylight', level < LC.MAX_LEVEL ? 'At level ' + LC.MAX_LEVEL + ', Pelita can light the night as bright as day.'
      : 'Lights the night like daytime while Pelita follows you. ' + (LC.pelitaSun() ? 'Enabled in Pause.' : 'Turn it on in Pause.')]);
    return {
      name: 'Pelita', role: 'Spirit companion', sprite: LC.ghostTex(ghost.stage, 'happy'), color: 0xffd166,
      stats: [['Level', level], ['Bond', Math.floor(ghost.bond)], ['Fullness', Math.round(ghost.full), ghost.full],
        ['Joy', Math.round(ghost.joy), ghost.joy], ['Glow', Math.round(ghost.glow), ghost.glow], ['Next level bond', next === null ? 'Max' : next]],
      skills: skills
    };
  }

  function spirit(ui, id) {
    var sp = LC.SPIRITS[id], C = LC.COMP;
    var stats = {
      semangat: [['Crop bonus', '+1'], ['Rice blessing', '+2 padi']],
      bunian: [['Forage bonus', '+1'], ['Gifts at dawn', '2']],
      naga: [['Double catch', '1 in ' + Math.round(1 / C.fishChance)], ['Breathing', 'Underwater']],
      kenyalang: [['Walking speed', '+' + percent(C.kenyalang)], ['Max energy', '+30']],
      nuno: [['Tilling find rate', percent(C.tillChance)], ['Kepeng per find', C.tillMin + '–' + C.tillMax], ['Dry crop growth', '50%']]
    }[id];
    var names = {
      semangat: ['Bountiful Harvest', 'Rice Blessing'], bunian: ['Forest Foraging', 'Morning Gifts'],
      naga: ['Double Catch', 'Water Blessing'], kenyalang: ['Swift Steps', 'Energy Blessing'], nuno: ['Buried Kepeng', 'Soil Blessing']
    }[id];
    var skills = [[names[0], sp.perk + ' while travelling together.'], [names[1], sp.blessing + '. Stays active when the spirit goes home.']];
    if (id === 'naga' && LC.hasNagaRide()) {
      stats.push(['Mount speed', LC.ITEMS.seruling_naga.speed + '×'], ['Water jet damage', LC.NAGA_JET.dmg + Math.floor((ui.S.str || 0) / 40)]);
      skills.push(['Seruling Naga', 'Use the flute to ride Naga Kecil. Attack while riding to fire a jet of water.']);
    }
    return { name: sp.name, role: sp.title[0].toUpperCase() + sp.title.slice(1), sprite: 'sp_' + id, color: sp.color, stats: stats, skills: skills };
  }

  function badang() {
    var fight = LC.BADANG_FIGHT;
    return {
      name: 'Badang', role: 'Village guardian', sprite: 'npc_badangK_0', color: 0xffac75,
      stats: [['Attack damage', fight.dmg], ['Attack interval', seconds(fight.cd)], ['Petrified targets', '2× damage']],
      skills: [['Heavy strike', 'Attacks nearby threats. His strike deals double damage to enemies turned to stone.'],
        ['Day escort', 'Ask him in ' + LC.AREAS[LC.villagerArea('badang')].name + ' to join you for the day. He can come once per day.']]
    };
  }

  function lampir(ui) {
    var N = LC.NEK;
    return {
      name: 'Nek Lampir', role: 'Herbalist and witch', sprite: 'npc_lampir_0', color: 0xb3e67a,
      stats: [['Pepper damage', N.pepper.dmg + ' / ' + N.pepper.bossDmg + ' vs bosses'], ['Pepper cooldown', seconds(N.pepper.cd)],
        ['Circle cooldown', seconds(N.circle.cd)], ['Rescue trigger', 'Below ' + percent(N.rescue.at) + ' HP']],
      skills: [['Serbuk Lada', 'Throws pepper powder at enemies, staggering them.'],
        ['Bulatan Hijau', (ui.touchOn ? 'Tap her portrait' : 'Press C') + ' in combat to halve damage inside her circle for ' + seconds(N.circle.dur) + '.'],
        ['Emergency rescue', 'Teleports you to safety when health is low. Cooldown: ' + seconds(N.rescue.cd) + '.'],
        ['Paid teleport', 'Out of combat she can take you to a visited land area for ' + N.tp.price + ' or ' + N.tp.far + ' kepeng.']]
    };
  }

  function bualang(ui) {
    var B = LC.BUALANG;
    return {
      name: 'Sang Bualang', role: 'Wind spirit', sprite: 'npc_bualang_0', color: 0x9adfff,
      stats: [['Spin damage', B.spin.dmg + ' / ' + B.spin.bossDmg + ' vs bosses'], ['Spin cooldown', seconds(B.spin.cd)],
        ['Arrival outdoors', seconds(B.arrive.open)], ['Arrival in cover', seconds(B.arrive.closed)]],
      skills: [['Puting Beliung', 'His spin knocks enemies back and leaves them dizzy. ' + (ui.touchOn ? 'Tap the wau' : 'Press B') + ' to trigger it in combat.'],
        ['Angin Bualang', 'His gift lets you knock back nearby enemies and clear haze or whirlwinds. Cooldown: ' + seconds(B.gust.cd) + '.'],
        ['Ride the wind', 'Call him with a wau. He takes longer to reach you in forests and caves.']]
    };
  }

  function tanggang() {
    return {
      name: 'Si Tanggang', role: 'Travelling escort', sprite: 'npc_tanggang_0', color: 0x7ed8d2,
      stats: [['Walking speed', '+' + percent(LC.COMP.escort)]],
      skills: [['Steady company', 'You walk faster while he travels at your side.'], ['Homecoming', 'Lead him to Mak Deruma on Pulau Mutiara.']]
    };
  }

  function belalang() {
    return {
      name: 'Belalang', role: 'Quest companion', sprite: 'npc_belalang_0', color: 0xd2e58b,
      stats: [['Track light range', Math.round(LC.C10.printR / LC.TILE * 10) / 10 + ' tiles']],
      skills: [['Follow the tracks', 'Belalang joins you in Hutan Merbau, where Pelita’s light reveals the tracks ahead.']]
    };
  }

  function jack() {
    var fight = LC.C12.jackFight;
    return {
      name: 'Jack Separaw', role: 'Captain and treasure hunter', sprite: 'npc_jack12_0', color: 0xffb984,
      stats: [['Attack damage', fight.dmg], ['Attack interval', seconds(fight.cd)], ['Boss loot bonus', '+1 roll']],
      skills: [['Deckhand’s strike', 'While in your party, Jack follows you and attacks nearby enemies.'],
        ['Treasure Hunter’s Luck', 'Your Chapter 12 reward gives one extra rare loot or kepeng roll when you defeat a boss.']]
    };
  }

  var profiles = { pelita: pelita, badang: badang, lampir: lampir, bualang: bualang, tanggang: tanggang, belalang: belalang, jack: jack };
  function profile(ui, id) { return LC.SPIRITS[id] ? spirit(ui, id) : profiles[id](ui); }

  function drawProfile(ui, c, box, info, entry, back, manage) {
    var g = ui.add.graphics(), x = box.x, y = box.y, left = 210, right = x + left + 16, width = box.w - left - 16;
    c.add(g);
    function text(x, y, label, size, color, opts) {
      var t = ui.txt(x, y, String(label), size, color, opts);
      c.add(t);
      return t;
    }
    function card(x, y, w, h) { g.fillStyle(0x2b1f17, 1); g.fillRoundedRect(x, y, w, h, 9); }
    function button(y, label, enabled, action) {
      g.fillStyle(enabled ? 0x49331f : 0x2b1f17, 1); g.fillRoundedRect(x, y, left, 46, 9);
      g.lineStyle(2, enabled ? 0xc7984e : 0x554238, 1); g.strokeRoundedRect(x, y, left, 46, 9);
      text(x + left / 2, y + 23, label, 17, enabled ? '#ffe1a3' : '#b8a890', { ox: 0.5, oy: 0.5 });
      if (enabled) c.add(ui.add.zone(x, y, left, 46).setOrigin(0).setInteractive({ useHandCursor: true }).on('pointerdown', action));
    }
    var mid = x + left / 2, centered = { ox: 0.5, wrap: left - 22, align: 'center' };
    card(x, y, left, 242);
    g.lineStyle(1, info.color, 0.4); g.strokeRoundedRect(x, y, left, 242, 9);
    g.fillStyle(info.color, 0.10); g.fillCircle(mid, y + 87, 68);
    g.lineStyle(1, info.color, 0.26); g.strokeCircle(mid, y + 87, 70);
    g.fillStyle(0x130e0c, 0.7); g.fillEllipse(mid, y + 142, 108, 18);
    var sprite = ui.add.image(mid, y + 86, info.sprite);
    sprite.setScale(Math.min(112 / sprite.width, 118 / sprite.height)); c.add(sprite);
    text(mid, y + 163, info.role, 17, '#fbecc8', centered);
    g.lineStyle(1, info.color, 0.3); g.lineBetween(x + 16, y + 201, x + left - 16, y + 201);
    text(mid, y + 214, entry.companionStatus, 15, '#ffe1a3', centered);
    if (entry.right) button(y + 254, entry.right, !!manage, manage);
    var hint = entry.why || (entry.companionStatus === 'With Belalang' ? entry.sub : '');
    if (hint) text(mid, y + (entry.right ? 311 : 256), hint, 14, '#cdb8a0', centered);
    button(y + box.h - 46, 'Back to roster', true, back);

    text(right, y, 'Stats', 20, '#ffd166');
    var statWidth = (width - 8) / 2;
    info.stats.forEach(function (stat, i) {
      var sx = right + (i % 2) * (statWidth + 8), sy = y + 30 + Math.floor(i / 2) * 48;
      card(sx, sy, statWidth, 42);
      text(sx + 10, sy + 12, stat[0], 15, '#cdb8a0');
      text(sx + statWidth - 10, sy + 10, stat[1], 17, '#f7dd8a', { ox: 1 });
      if (stat.length === 3) {
        var fill = Math.max(0, Math.min(100, stat[2])) / 100 * (statWidth - 20);
        g.fillStyle(0x150f0b); g.fillRect(sx + 10, sy + 33, statWidth - 20, 3);
        g.fillStyle(info.color); g.fillRect(sx + 10, sy + 33, fill, 3);
      }
    });
    var skillsY = y + 38 + Math.ceil(info.stats.length / 2) * 48;
    text(right, skillsY, 'Abilities & skills', 20, '#ffd166');
    info.skills.forEach(function (skill, i) {
      var sy = skillsY + 30 + i * 58;
      card(right, sy, width, 54);
      g.fillStyle(info.color, 0.8); g.fillRect(right + 10, sy + 10, 3, 30);
      text(right + 23, sy + 4, skill[0], 17, '#fbecc8');
      var desc = text(right + 23, sy + 23, skill[1], 15, '#cdb8a0', { wrap: width - 36 });
      if (desc.height > 28) desc.setFontSize(14).setLineSpacing(0);
    });
  }

  U.companionRows = function () {
    var self = this;
    return roster.call(this).map(function (row) {
      if (!row.companionId) return row;
      var info = profile(self, row.companionId);
      return Object.assign({}, row, {
        icon: info.sprite, iconScale: null, right: 'Profile ›', enabled: true,
        action: function () { self.openCompanionProfile(row.companionId); }
      });
    });
  };

  U.openCompanionProfile = function (id) {
    var self = this;
    function back() { self.openStats(1, id); }
    var entry = roster.call(this).find(function (row) { return row.companionId === id; });
    if (!entry) { back(); return; }
    if (LC.DEVELOPER_HTML) {
      var panel = document.getElementById('lc-dev-tools');
      if (panel) panel.open = false;
    }
    var info = profile(this, id);
    var manage = entry.enabled !== false && entry.action ? function () {
      var modal = self.modal;
      entry.action();
      if (self.modal === modal) self.openCompanionProfile(id);
    } : null;
    this.openMenu({ title: info.name, onBack: back, keys: this.touchOn ? 'Tap Back to roster to return' : (manage ? 'E  ' + entry.right + '  ·  Esc  Back to roster' : 'Esc  Back to roster'),
      tabs: [{ label: 'Profile', activate: manage, draw: function (c, box) { drawProfile(self, c, box, info, entry, back, manage); } }]
    });
  };
})(window.LC);
