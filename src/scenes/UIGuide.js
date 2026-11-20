/* UI, part 18 (v2.7.1): the guide arrow. The user said the game sometimes feels stuck, so a yellow arrow now points to
 * the next thing to do in the story: bouncing above it when it is on screen, or at the edge of the screen pointing the
 * way when it is not. It only points at things in the place you are in (the goal line says where to go otherwise), and
 * hides during dialogues and scenes. Switch it off in the pause menu (flags.noGuide).
 * LC.GUIDES is a list of functions (world) -> { x, y, label } or null; the first answer wins. Chapter 2 (Barunai) has
 * one here; other chapters can push their own. Mixed into LC.UIScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var T = 16;
  LC.GUIDES = LC.GUIDES || [];
  LC.guideTarget = function (W) {
    for (var i = 0; i < LC.GUIDES.length; i++) { var t = LC.GUIDES[i](W); if (t) return t; }
    return null;
  };

  // ---------------------------------------------------------------- Chapter 2: Barunai
  LC.GUIDES.push(function (W) {
    var S = LC.State.s, Q = S.quests, st = Q.ch2 || 0, a = W.area, c = W.ch2 || {};
    if (!st || st >= 8) return null;
    function npc(vid, label) { var n = W.npcs && W.npcs[vid]; return n && n.spr && n.spr.active ? { x: n.spr.x, y: n.spr.y - 20, label: label || LC.VILLAGERS[vid].name } : null; }
    function thing(k, label) { var t = c[k]; return t && t.spr && t.spr.active ? { x: t.spr.x, y: t.spr.y - 10, label: label } : null; }
    function at(tx, ty, label) { return { x: tx * T, y: ty * T, label: label }; }
    function boat() { return a === 'farm' ? at(19, 31.5, 'Nenek\'s perahu to Barunai') : null; }
    function dishes() { var n = 0; S.inv.forEach(function (sl) { if (sl && LC.ITEMS[sl.id].kind === 'dish') n += sl.n; }); return n; }
    switch (st) {
      case 1: return a === 'barunai' ? npc('alak') : boat();
      case 2: {
        var f = Q.ch2found || {}, miss = LC.BROTHERS.filter(function (b) { return !f[b]; });
        if (!miss.length) return a === 'barunai' ? npc('alak', 'Awang Alak Betatar: all twelve found!') : boat();
        var best = null, bd = 1e9;
        miss.forEach(function (b) { var t = npc(b); if (!t) return; var d = Math.hypot(t.x - W.player.x, t.y - W.player.y); if (d < bd) { bd = d; best = t; } });
        return best;
      }
      case 3: if (a !== 'barunai') return boat(); return thing('marker', 'Hoofprints') || thing('temb', 'The tembadau');
      case 4: return a === 'barunai' ? npc('alak') : boat();
      case 5: return a === 'barunai' ? npc('semaun') : boat();
      case 6:
        if (S.day <= (Q.ch2day || 0)) return a === 'barunai' ? at(14.5, 6, 'The guest house: sleep here') : a === 'farm' ? at(4.5, 7, 'Sleep at home') : null;
        if (a !== 'barunai') return boat();
        if (!Q.ch2bird) return thing('marker', 'A feather') || thing('bird', 'Si Pinggai!');
        if (!Q.ch2ship) return thing('ship', 'Dive here for the chest');
        return npc('puteri');
      case 7:
        if (dishes() >= 5) return a === 'barunai' ? npc('alak', 'Awang Alak Betatar: the kenduri') : boat();
        return a === 'farm' ? at(8, 8.5, 'Nenek\'s dapur: cook dishes') : a === 'barunai' ? at(8, 19.5, 'The perahu home, to cook') : null;
    }
    return null;
  });

  Object.assign(LC.UIScene.prototype, {
    drawGuide: function () {
      var W = this.world, S = this.S;
      if (!this.guideG) {
        this.guideG = this.add.graphics().setDepth(58);
        this.guideT = this.txt(0, 0, '', 14, '#ffe8a0', { ox: 0.5, oy: 1, stroke: 4 }).setDepth(58).setVisible(false);
      }
      var g = this.guideG, tx = this.guideT;
      g.clear(); tx.setVisible(false);
      if (!W || !W.player || !W.cameras || this.modal || W.cutscene || W.sleeping || W.leaving || S.guest || (S.flags && S.flags.noGuide)) return;
      var t = LC.guideTarget(W);
      if (!t) return;
      var cam = W.cameras.main, wv = cam.worldView, z = cam.zoom, sx = (t.x - wv.x) * z, sy = (t.y - wv.y) * z, sw = this.scale.width, sh = this.scale.height, now = this.time.now;
      var inside = sx > 30 && sx < sw - 30 && sy > 40 && sy < sh - 30;
      if (inside) {   // on screen: a bouncing arrow above it
        if (Math.hypot(t.x - W.player.x, t.y - W.player.y) < 24) return;   // (you are there)
        var by = sy - 14 + Math.sin(now / 180) * 5;
        g.fillStyle(0x1e1510, 0.85); g.fillTriangle(sx - 12, by - 17, sx + 12, by - 17, sx, by + 2);
        g.fillStyle(0xffd166, 1); g.fillTriangle(sx - 8, by - 14, sx + 8, by - 14, sx, by - 2);
        if (t.label) tx.setText(t.label).setPosition(Math.max(90, Math.min(sw - 90, sx)), by - 19).setVisible(true);
        return;
      }
      // off screen: at the edge, pointing the way (kept below the clock, the goal line and Pelita's panel, and above the hotbar)
      var top = 262 + this.safe.t, bot = sh - 150 - this.safe.b, cx = sw / 2, cy = (top + bot) / 2, m = 46 + Math.max(this.safe.l, this.safe.r);
      var a = Math.atan2(sy - cy, sx - cx);
      var k = Math.min((sw / 2 - m) / Math.max(0.001, Math.abs(Math.cos(a))), ((bot - top) / 2) / Math.max(0.001, Math.abs(Math.sin(a))));
      var x = cx + Math.cos(a) * k, y = cy + Math.sin(a) * k, pulse = 0.7 + 0.3 * Math.sin(now / 200), nx = -Math.sin(a), ny = Math.cos(a);
      g.fillStyle(0x1e1510, 0.82); g.fillCircle(x, y, 20);
      g.lineStyle(2, 0xffd166, pulse); g.strokeCircle(x, y, 20);
      g.fillStyle(0xffd166, pulse);
      g.fillTriangle(x + Math.cos(a) * 31, y + Math.sin(a) * 31, x + Math.cos(a) * 21 + nx * 9, y + Math.sin(a) * 21 + ny * 9, x + Math.cos(a) * 21 - nx * 9, y + Math.sin(a) * 21 - ny * 9);
      g.fillStyle(0xffd166, 1); g.fillRect(x - 2, y - 10, 4, 12); g.fillRect(x - 2, y + 5, 4, 4);   // "!"
      if (t.label) tx.setText(t.label).setPosition(Math.max(90, Math.min(sw - 90, x)), Math.sin(a) < -0.5 ? y + 44 : y - 24).setVisible(true);   // (below the arrow when it points up)
    }
  });

  // the pause menu: the guide arrow on or off
  LC.pauseExtraRow3 = function () {
    var S = LC.State.s;
    if (!S || (S.quests.ch2 || 0) < 1) return null;
    return { icon: 'ic_glow', label: 'Guide arrow: ' + (S.flags.noGuide ? 'Off' : 'On'), sub: 'A yellow arrow points to the next thing to do in the story (Chapter 2: Barunai).', action: function () { S.flags.noGuide = !S.flags.noGuide; } };
  };

  var drawSkills = LC.UIScene.prototype.drawSkills;
  LC.UIScene.prototype.drawSkills = function () { drawSkills.apply(this, arguments); this.drawGuide(); };
})(window.LC);
