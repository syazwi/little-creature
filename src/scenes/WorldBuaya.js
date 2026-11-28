/* World, Chapter 20: Janji Buaya Putih (v3.22, Part 1). See buaya.js for the story and the steps. Story steps are saved
 * the moment they happen (before any dialogue), and every scene that follows a dialogue runs from the update loop once
 * the dialogue has closed, so closing a conversation early never loses progress.
 *  - The farm: the night the river goes black (Nenek's story), the stripped cucumber vines, the sticky scarecrow and
 *    the night watch from the straw pile (move, and the thief bolts), Sang Kancil stuck fast, the reeds and Seri Putih.
 *    From the start of the chapter Pelita's shadow is a little too long.
 *  - Laut Malam, the night voyage: you steer the jong; Seri Putih swims behind you, and she must stay inside Pelita's
 *    ring of light, because shadow hands rise out of the dark sea to drag her under. The ring is Pelita's courage: it
 *    shrinks as Pelita grows afraid (shadow fish ramming the hull, thunder in the storm) and grows when you comfort or
 *    feed it (USE). If she weakens, you turn back to the last island and rest.
 *  - Kampong Ayer: the village panics; you calm three neighbours and Awang Semaun, Pateh Berbai wants proof, Damang
 *    Sari remembers, Nenek tells the market. The cradle, the bell, the fish. Then the Night of Fire: the shadows put
 *    out the lamps, a fire runs along the walkways; scoop water and throw it, cut the marked planks, take buckets from
 *    the chain on the pier, row the boat taxi to the trapped family. When it is out, a child falls and Seri Putih
 *    carries him to the steps. Pelita, alone on the burnt planks. The next morning, the send-off.
 * Mixed into LC.WorldScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var W = LC.WorldScene.prototype, C = LC.C20, X = LC.BUAYA_TEXT, T = 16;
  function step(w) { return C.step(w.S); }
  function story(w, n) { w.S.quests.ch20 = n; LC.State.save(); }
  function night(w) { return C.isNight(w.S); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function key(x, y) { return x + ',' + y; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function wrapA(a) { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; }
  function ctr(t) { return { x: (t.x + 0.5) * T, y: (t.y + 0.5) * T }; }
  function feet(t) { return { x: (t.x + 0.5) * T, y: (t.y + 1) * T }; }
  function tasks(q) { return q.c20task || (q.c20task = {}); }
  function calmed(q) { return q.c20calmed || (q.c20calmed = {}); }
  var WATER = { o: 1, h: 1, w: 1 };   // (v3.23: and rivers: the Kinabatangan)

  var create = W.createKampong, update = W.updateKampong;
  W.createKampong = function () { create.apply(this, arguments); this.createBuaya(); };
  W.updateKampong = function (time, dt) { update.apply(this, arguments); this.updateBuaya(time, dt); };

  // ================================================================ hooks into the world
  var objectAction = W.objectAction;
  W.objectAction = function (o) {
    var self = this, S = this.S, q = S.quests, s = step(this);
    if (!o) return objectAction.apply(this, arguments);
    // while Kampong Ayer burns, nobody rows away
    if (this.c20 && this.c20.fire && !this.c20.fire.done && o.type === 'sampan') return { label: 'The sampan', fn: function () { self.toast('Not now! The village is burning!', 'api_0'); } };
    switch (o.type) {
      case 'buaya_patch': return { label: s >= 1 ? 'Nenek\'s cucumber vines' : 'Nenek\'s cucumber vines', fn: function () { self.buayaPatch(); } };
      case 'buaya_scare': return { label: q.c20stuck ? 'Catch the thief' : 'The sticky scarecrow', fn: function () { self.buayaScare(); } };
      case 'buaya_hide': return { label: 'Hide in the straw', fn: function () { self.buayaHide(); } };
      case 'buaya_reeds': return { label: 'The tall reeds', fn: function () { self.toast(s === 2 ? X.reedsHint : 'Tall reeds on the east bank, swaying in the breeze.', 'rumput20'); } };
      case 'buaya_croc': return { label: this.buayaCrocLabel(), fn: function () { self.buayaCroc(); } };
      case 'buaya_nenek': return { label: 'Talk to Nenek', fn: function () { self.buayaNenek(); } };
      case 'buaya_kancil': return { label: 'Talk to Sang Kancil', fn: function () { self.buayaKancil(); } };
      case 'buaya_folk': return { label: 'Talk to ' + LC.SPEAKERS[o.who + '20'].name, fn: function () { self.buayaFolk(o.who); } };
      case 'buaya_semaun': return { label: 'Talk to Awang Semaun', fn: function () { self.buayaFolk('semaun'); } };
      case 'buaya_berbai': return { label: 'Talk to Pateh Berbai', fn: function () { self.buayaBerbai(); } };
      case 'buaya_sari': return { label: 'Talk to Damang Sari', fn: function () { self.buayaSari(); } };
      case 'buaya_lamp': return { label: 'Look', fn: function () { self.toast(X.lampLook, 'lampu20_on'); } };
      case 'buaya_taxi': return { label: this.c20 && this.c20.fire && !this.c20.fire.family ? 'Row to the trapped family' : 'The boat taxi', fn: function () { self.buayaTaxi(); } };
      case 'buaya_wait': return { label: 'Look', fn: function () { self.toast(o.id === 't_jong20' ? X.waitJong : pick(X.waitCroc), o.id === 't_jong20' ? 'jong_majapahit' : 'buaya20_face'); } };
      default: return objectAction.apply(this, arguments);
    }
  };
  // Pak Lajak and Dang Kemala, on the craft quarter walkway, while Seri Putih needs a cradle and a bell
  var npcAction = W.npcAction;
  W.npcAction = function (o) {
    var self = this, t = tasks(this.S.quests);
    if (C.ready(this.S) && step(this) === 5 && this.area === 'barunai') {
      if (o.vid === 'lajak' && !t.rakit) return { label: 'Ask Pak Lajak for a floating cradle', fn: function () { self.buayaLajak(); } };
      if (o.vid === 'kemala' && !t.loceng) return { label: 'Ask Dang Kemala for a bell', fn: function () { self.buayaKemala(); } };
    }
    return npcAction.apply(this, arguments);
  };
  // what USE does at sea (comfort or feed Pelita), in the straw, at the fire, and beside Pelita on the burnt planks
  var getAction = W.getAction;
  W.getAction = function () {
    var self = this, c = this.c20;
    if (!c) return getAction.apply(this, arguments);
    if (c.sea) return this.buayaSeaAction();
    if (c.hidden) return { label: 'Climb out of the straw', fn: function () { self.buayaUnhide(true); } };
    if (c.fire && !c.fire.done && this.area === 'barunai') { var fa = this.buayaFireAction(); if (fa) return fa; }
    if (c.alone && !c.cine) {
      var g = this.gpos, d = Math.hypot(g.x - this.player.x, g.y - (this.player.y - 8));
      if (d < 30) return { label: c.sat ? 'Pet Pelita (' + c.pets + ' / 3)' : 'Sit with Pelita', fn: function () { self.buayaPelita(); } };
    }
    return getAction.apply(this, arguments);
  };
  var updatePlayer = W.updatePlayer;
  W.updatePlayer = function (dt, blocked) {
    var c = this.c20;
    if (c && c.sea && this.A.voyage20) return this.updateShip20(dt, blocked);   // (v3.23: every voyage of the chapter)
    if (c && c.hidden) return this.updateHidden20(dt, blocked);
    return updatePlayer.apply(this, arguments);
  };
  // Pelita: its shadow is too long from the start of the chapter; it rides the bow at sea; and after the fire it sits alone
  var updateGhost = W.updateGhost;
  W.updateGhost = function (time, dt, blocked) {
    updateGhost.apply(this, arguments);
    var c = this.c20, S = this.S, s = step(this);
    if (!c || !this.ghost) return;
    if (c.sea && c.sea.sh) {
      var sh = c.sea.sh, gx = sh.x + Math.cos(sh.ang) * 16, gy = sh.y + Math.sin(sh.ang) * 16 - 8 + Math.sin(time / 380) * 2;
      this.ghost.setVisible(true).setPosition(Math.round(gx), Math.round(gy)).setDepth(9006).setTexture(LC.ghostTex(S.ghost.stage, c.sea.calm < 40 ? 'sad' : c.sea.calm > 75 ? 'happy' : 'normal'));
      this.ghostGlow.setVisible(true).setPosition(gx, gy);
      this.ghostShadow.setVisible(false); this.bubble.setVisible(false);
      this.ghostHere = true; this.gpos.x = gx; this.gpos.y = gy;
      return;
    }
    if (c.alone && this.area === 'barunai') {
      var sp = ctr(C.ka.pelita), k = Math.min(1, dt * 2);
      this.gpos.x += (sp.x - this.gpos.x) * k; this.gpos.y += (sp.y - 10 - this.gpos.y) * k;
      var ax = Math.round(this.gpos.x), ay = Math.round(this.gpos.y + Math.sin(time / 700));
      this.ghost.setVisible(true).setPosition(ax, ay).setTexture(LC.ghostTex(S.ghost.stage, c.sat && c.pets >= 3 ? 'normal' : 'sad')).setAlpha(0.55 + 0.12 * (c.pets || 0));
      this.ghostGlow.setVisible(true).setPosition(ax, ay).setScale(0.35 + 0.08 * (c.pets || 0)).setAlpha(0.18);
      this.ghostShadow.setVisible(true).setPosition(ax + 10, ay + 18).setScale(2.6, 0.8).setAlpha(0.45);
      this.bubble.setVisible(false); this.ghostHere = true; this.ghostArea = this.area;
      this.ghostNear = false;
      return;
    }
    // the shadow that is a little too long (a little longer at each step)
    if (C.ready(S) && s >= 1 && s <= 15 && this.ghostHere && this.ghostShadow.visible) {   // (v3.23: until the shadow is only a shadow again)
      var long = Math.min(2.4, 1.15 + s * 0.16);
      this.ghostShadow.setScale(long, 0.85).setAlpha(0.32).setX(this.ghostShadow.x + (long - 1) * 5);
    }
  };
  // the night sea is always dark (and Pelita's daylight rests there, and while the village burns)
  var skyColor = W.skyColor;
  W.skyColor = function (m) {
    var c = this.c20;
    if (this.area === 'laut20') {
      var sea = c && c.sea, storm = sea ? sea.storm : 0, dawn = sea ? sea.dawn : 0;
      var col = storm > 0 ? lerpC(0x2a3458, 0x1a2038, storm) : 0x2a3458;
      return dawn > 0 ? lerpC(col, 0xe8b890, dawn) : col;
    }
    var base = skyColor.apply(this, arguments);
    if (c && c.fire && !c.fire.done && this.area === 'barunai') return lerpC(base, 0x8a3a20, 0.25 + 0.08 * Math.sin(this.time.now / 300));
    return base;
  };
  function lerpC(a, b, t) {
    var ar = a >> 16 & 255, ag = a >> 8 & 255, ab = a & 255, br = b >> 16 & 255, bg = b >> 8 & 255, bb = b & 255;
    return (Math.round(ar + (br - ar) * t) << 16) | (Math.round(ag + (bg - ag) * t) << 8) | Math.round(ab + (bb - ab) * t);
  }
  var updateLighting = W.updateLighting;
  W.updateLighting = function () {
    var S = this.S, off = S.flags.sunOff, c = this.c20, s = step(this);
    // (the chapter's nights stay dark on the farm and in Kampong Ayer, as in Chapters 9 and 19: the night watch, the
    // lamps on the walkways, the fire)
    var story20 = C.ready(S) && s >= 1 && s <= 7 && C.isNight(S) && (this.area === 'farm' || this.area === 'barunai');
    var dark = this.area === 'laut20' || story20 || !!(c && c.fire && !c.fire.done && this.area === 'barunai');
    if (!dark) { updateLighting.apply(this, arguments); this.buayaLamps(); return; }
    S.flags.sunOff = true;
    try { updateLighting.apply(this, arguments); } finally { S.flags.sunOff = off; }
    this.buayaLamps();
  };
  // only one of each person: the story stand-ins send the everyday villager away
  var away = W.jerebuAway;
  W.jerebuAway = function (vid) {
    if (away && away.apply(this, arguments)) return true;
    var S = this.S, s = step(this), q = S.quests;
    if (!C.ready(S)) return false;
    if (vid === 'nenek' && this.area === 'farm') return (s >= 3 && s <= 7) || !!(this.c20 && this.c20.nenekRun);
    if (this.area !== 'barunai') return false;
    if (vid === 'semaun') return s >= 4 && s <= 6;
    if (vid === 'berbai') return s === 4 && (q.c20calm || 0) >= 4;
    if (vid === 'sari') return s === 4 && !!q.c20proof;
    return false;
  };
  // the Night of Fire's shadows come and go with the fire, and do not come back once beaten
  var groupOn = W.groupOn;
  W.groupOn = function (g) { if (g.c20) return !!(this.c20 && this.c20.fire && this.c20.fire.shadowsOn); return groupOn.apply(this, arguments); };
  var enemyDie = W.enemyDie;
  W.enemyDie = function (e) { var r = enemyDie.apply(this, arguments); if (e.g && e.g.c20) e.respawn = Infinity; return r; };
  var faint = W.faint;
  W.faint = function () {
    var c = this.c20;
    if (c && c.fire && !c.fire.done && this.area === 'barunai' && !this.leaving) { this.buayaFireFaint(); return; }
    return faint.apply(this, arguments);
  };
  var sailTo = W.sailTo;
  W.sailTo = function (to) {
    if (to !== 'laut20') return sailTo.apply(this, arguments);
    LC.Audio.sfx('splash');
    this.goArea('laut20', this.tilePx(C.sea.start), 'right');
  };

  Object.assign(W, {
    buayaLines: function (lines, opts) {
      this.ui.say(lines.map(function (l) { return Object.assign({ text: l[1] }, LC.SPEAKERS[l[0]] || {}); }), opts);
    },

    // ================================================================ setting up each place
    createBuaya: function () {
      var self = this, S = this.S, q = S.quests, s = step(this);
      var c = this.c20 = { tick: 0.5, wasNight: night(this), animT: 0, things: {}, lampLights: [], cine: null, hidden: false, kancil: null, alone: false, sat: !!q.c20sat, pets: q.c20sat ? 3 : 0, nenekRun: false };
      LC.c20fireOn = false;
      if (!C.ready(S)) return;
      if (this.area === 'farm') {
        if (s === 1 && q.c20stuck) this.buayaKancilStuck();
        if (s === 2) this.buayaKancilAt(C.farm.reeds.x - 1, C.farm.reeds.y + 0.4, true);
      }
      if (this.area === 'barunai' && s >= 4 && s <= 7) {
        // the lamps the villagers hung for her
        C.ka.lamps.forEach(function (l, i) { var p = feet(l); c.lampLights[i] = self.addLight(p.x, p.y - 20, 0xffd890, 0.9, true); });
        if (s === 7 && !q.c20sat) { c.alone = true; c.sat = false; c.pets = 0; }
      }
      if (this.A.voyage20) this.setupVoyage();
      this.buayaCrocTex();
    },
    buayaCrocTex: function () {   // fading grey until she has rested in Kampong Ayer; white again after
      var q = this.S.quests, s = step(this), white = s >= 6 || (s === 5 && !!tasks(q).done);
      ['f_putih20', 'k_putih20'].forEach(function (id) { var im = this.objImgs[id]; if (im) im.setTexture(white ? 'buaya20_0' : 'buaya20g_0'); }, this);
    },
    buayaLamps: function () {   // the walkway lamps, lit at night (and dark while the shadows are loose)
      var c = this.c20;
      if (!c || !c.lampLights.length) return;
      var out = !!(c.fire && c.fire.lampsOut), n = this.nightF || 0, self = this;
      C.ka.lamps.forEach(function (l, i) {
        var L = c.lampLights[i], im = self.objImgs['k_lampu20_' + i];
        if (L) L.base = out ? 0 : 0.9;
        if (im) im.setTexture(out || n < 0.25 ? 'lampu20_off' : 'lampu20_on');
      });
    },

    // ================================================================ the farm: the cucumber thief
    buayaPatch: function () {
      var S = this.S, q = S.quests, s = step(this);
      if (s === 0) { this.toast(X.patchFull, 'timun20'); return; }
      if (s === 1 && !q.c20morning) { this.toast('Nenek\'s cucumber vines. Something has been nibbling at them...', 'timun20_kosong'); return; }
      if (s === 1 && !q.c20set) {
        if (!LC.State.count('getah20')) LC.State.add('getah20', 1);
        q.c20set = true; LC.State.remove('getah20', 1); LC.State.save();
        LC.Audio.sfx('harvest');
        this.refreshWhen();
        this.toast(X.patchSet, 'orang_getah20');
        return;
      }
      this.toast(s >= C.part1 ? X.patchAfter : X.patchEmpty, 'timun20_kosong');
    },
    buayaScare: function () {
      var S = this.S, q = S.quests, self = this;
      if (step(this) !== 1) return;
      if (!q.c20stuck) { this.toast(X.scareDay, 'orang_getah20'); return; }
      story(this, 2);   // (saved first)
      LC.Audio.sfx('kancil20');
      var k = this.c20.kancil;
      if (k) { k.stuck = false; k.spr.setAngle(0); }
      this.refreshWhen();
      this.buayaLines(X.caught);
      this.c20.runPending = true;
      void self;
    },
    buayaHide: function () {
      var S = this.S, q = S.quests, c = this.c20;
      if (step(this) !== 1) return;
      if (!q.c20set) { this.toast(X.hideNeed, 'jerami20'); return; }
      if (q.c20stuck) { this.toast(X.catchHint, 'kancil20_0'); return; }
      if (S.minutes < C.watchAt && S.minutes >= 6 * 60) { this.toast(X.hideDay, 'jerami20'); return; }
      var h = feet(C.farm.hide);
      c.hidden = true; c.hideT = 2.5 + Math.random() * 3; c.moved = false;
      this.player.setPosition(h.x, h.y + 2).setAlpha(0.35);
      this.pShadow.setVisible(false);
      LC.Audio.sfx('harvest');
      this.fx.leaf.explode(6, h.x, h.y - 6);
      this.toast(X.hideIn, 'jerami20');
    },
    buayaUnhide: function (byHand) {
      var c = this.c20, k = c.kancil;
      c.hidden = false;
      this.player.setAlpha(1); this.pShadow.setVisible(true);
      var h = feet(C.farm.hide); this.player.setPosition(h.x + 18, h.y + 4);
      if (k && !k.stuck && !this.S.quests.c20stuck) {   // the thief sees you move, and bolts
        k.flee = true;
        LC.Audio.sfx('kancil20');
        this.toast(X.fled, 'kancil20_0');
      } else if (byHand) this.toast(X.hideOut, 'jerami20');
    },
    updateHidden20: function (dt, blocked) {
      var c = this.c20, k = this.keys, p = this.player;
      p.stop(); p.setDepth(p.y);
      this.moving = false;
      if (blocked) return;
      var tv = this.ui.touchVec(), mv = k.A.isDown || k.D.isDown || k.W.isDown || k.S.isDown || k.LEFT.isDown || k.RIGHT.isDown || k.UP.isDown || k.DOWN.isDown || (tv && Math.hypot(tv.x, tv.y) > 0.3);
      if (mv) { this.buayaUnhide(false); return; }
      // the thief comes out of the dark
      if (!c.kancil && !this.S.quests.c20stuck && (c.hideT -= dt) <= 0) this.buayaKancilCome();
    },
    buayaKancilAt: function (tx, ty, idle) {
      var c = this.c20;
      if (c.kancil) c.kancil.spr.destroy();
      var spr = this.add.sprite(tx * T + 8, (ty + 1) * T, 'kancil20_0').setOrigin(0.5, 1).setDepth((ty + 1) * T);
      c.kancil = { spr: spr, phase: idle ? 'wait' : 'come', t: 0, stuck: false, flee: false };
      return c.kancil;
    },
    buayaKancilCome: function () {
      var k = this.buayaKancilAt(1.5, 12.3, false);
      k.spr.play('kancil20_walk');
      this.toast(X.comes, 'kancil20_0');
    },
    buayaKancilStuck: function () {
      var sc = feet(C.farm.scare), k = this.buayaKancilAt(C.farm.scare.x - 0.6, C.farm.scare.y + 0.1, true);
      k.stuck = true; k.spr.setPosition(sc.x - 7, sc.y + 1).setFlipX(false);
    },
    buayaKancilRun: function () {   // Sang Kancil trots off to the reeds on the east bank
      var c = this.c20, k = c.kancil, self = this;
      c.runPending = false;
      if (!k) k = this.buayaKancilAt(C.farm.scare.x - 1, C.farm.scare.y, true);
      var to = feet({ x: C.farm.reeds.x - 1, y: C.farm.reeds.y + 0.4 });
      k.phase = 'run';
      k.spr.play('kancil20_walk').setFlipX(false);
      this.tweens.add({ targets: k.spr, x: to.x, y: to.y, duration: 5200, ease: 'Sine.easeInOut', onUpdate: function () { k.spr.setDepth(k.spr.y); },
        onComplete: function () { if (k.spr.active) { k.spr.stop(); k.spr.setTexture('kancil20_0').setFlipX(true); k.phase = 'wait'; } } });
      this.toast(X.reedsHint, 'rumput20');
      void self;
    },
    updateKancil20: function (dt) {
      var c = this.c20, k = c.kancil, S = this.S;
      if (!k || !k.spr.active) return;
      var s = k.spr;
      if (k.stuck) { s.setAngle(Math.sin(this.time.now / 90) * 6); return; }
      if (k.flee) {   // gone, back into the dark
        s.setFlipX(true); s.x -= 90 * dt;
        if (s.x < 0) { s.destroy(); c.kancil = null; c.hideT = 4 + Math.random() * 3; }
        return;
      }
      if (k.phase !== 'come') return;
      var sc = feet(C.farm.scare), patch = feet(C.farm.patch), tx = k.t < 1 ? patch.x - 10 : sc.x - 7, ty = sc.y + 1;
      var dx = tx - s.x, dy = ty - s.y, d = Math.hypot(dx, dy);
      if (k.pause > 0) { k.pause -= dt; if (k.pause <= 0) s.play('kancil20_walk'); return; }
      if (d < 2) {
        if (k.t < 1) { k.t = 1; k.pause = 1.6; s.stop(); s.setTexture('kancil20_0'); this.fx.leaf.explode(3, s.x + 4, s.y - 6); LC.Audio.sfx('eat'); return; }
        // THWACK: stuck fast
        k.phase = 'stuck'; k.stuck = true; s.stop(); s.setTexture('kancil20_0');
        S.quests.c20stuck = true; LC.State.save();
        LC.Audio.sfx('kancil20'); this.cameras.main.shake(120, 0.002);
        this.fx.sparkle.explode(6, sc.x, sc.y - 12);
        this.buayaUnhide(false);
        this.buayaLines(X.stuck, { onDone: this.toast.bind(this, X.catchHint, 'kancil20_0') });
        return;
      }
      if (Math.random() < dt * 0.35 && k.t < 1) { k.pause = 0.6 + Math.random() * 0.8; s.stop(); s.setTexture('kancil20_0'); return; }   // sniff, and listen
      var sp = 20 * dt;
      s.x += dx / d * Math.min(sp, d); s.y += dy / d * Math.min(sp, d);
      s.setFlipX(dx < 0).setDepth(s.y);
    },
    buayaFound: function () {   // the reeds: Seri Putih
      var self = this, c = this.c20, p = feet(C.farm.nenekRun);
      story(this, 3);   // (saved first)
      this.refreshWhen(); this.buayaCrocTex();
      LC.Audio.sfx('buaya20');
      if (c.kancil) { c.kancil.spr.destroy(); c.kancil = null; }
      // Nenek comes running from the house
      c.nenekRun = true;
      var nn = c.things.nenekRun = this.add.sprite(5 * T, 10 * T, 'npc_nenek_0').setOrigin(0.5, 1).setDepth(10 * T);
      if (this.anims.exists('npc_nenek_walk')) nn.play('npc_nenek_walk');
      this.tweens.add({ targets: nn, x: p.x, y: p.y, duration: 4200, delay: 1200, onUpdate: function () { nn.setDepth(nn.y); nn.setFlipX(false); },
        onComplete: function () { if (nn.active && self.anims.exists('npc_nenek_idle')) nn.play('npc_nenek_idle'); } });
      this.buayaLines(X.found);
      c.foundPending = true;
    },
    buayaFoundDone: function () {
      var c = this.c20, nn = c.things.nenekRun;
      c.foundPending = false;
      if (nn && nn.active) this.tweens.add({ targets: nn, alpha: 0, duration: 500, onComplete: function () { nn.destroy(); } });
      c.things.nenekRun = null; c.nenekRun = false;
      this.toast('Feed Seri Putih ' + C.fishFarm + ' fish (fish in the river, or buy them), then sail by night on the jong.', 'ic_buaya20');
    },

    // ================================================================ Seri Putih, Nenek and Sang Kancil
    buayaCrocLabel: function () {
      var q = this.S.quests, s = step(this), t = tasks(q);
      if (s === 3 && (q.c20fedF || 0) < C.fishFarm) return C.fishCount() ? 'Feed Seri Putih' : 'Seri Putih';
      if (s === 5 && (t.ikan || 0) < C.fishKA) return C.fishCount() ? 'Feed Seri Putih' : 'Seri Putih';
      return 'Seri Putih';
    },
    buayaFeed: function (key2, need) {   // give her fish from the bag, as many as she still needs
      var q = this.S.quests, fed = key2 === 'ka' ? (tasks(q).ikan || 0) : (q.c20fedF || 0), self = this, gave = 0;
      while (fed < need && C.fishCount() > 0) { LC.State.remove('@fish', 1); fed++; gave++; }
      if (key2 === 'ka') tasks(q).ikan = fed; else q.c20fedF = fed;
      LC.State.save();
      var im = this.objImgs[key2 === 'ka' ? 'k_putih20' : 'f_putih20'];
      if (gave) { LC.Audio.sfx('eat'); if (im) { this.fx.drop.explode(10, im.x + 20, im.y - 8); this.fx.heart.explode(3, im.x + 18, im.y - 14); } }
      void self;
      return { fed: fed, gave: gave };
    },
    buayaCroc: function () {
      var S = this.S, q = S.quests, s = step(this), self = this;
      if (s === 3) {
        if ((q.c20fedF || 0) >= C.fishFarm) { this.toast(pick(X.crocFarm), 'buaya20_face'); return; }
        var r = this.buayaFeed('farm', C.fishFarm);
        if (!r.gave) { this.toast(X.feedNone.replace('{n}', r.fed).replace('{need}', C.fishFarm), 'buaya20_face'); return; }
        if (r.fed >= C.fishFarm) { this.buayaLines(X.fedFarm); return; }
        this.toast(X.feedMore.replace('{n}', r.fed).replace('{need}', C.fishFarm), 'buaya20_face');
        return;
      }
      if (s === 5 && (tasks(q).ikan || 0) < C.fishKA) {
        var k = this.buayaFeed('ka', C.fishKA);
        if (!k.gave) { this.toast(X.feedNone.replace('{n}', k.fed).replace('{need}', C.fishKA), 'buaya20_face'); return; }
        this.toast(X.feedKA.replace('{n}', k.fed).replace('{need}', C.fishKA), 'buaya20_face');
        this.buayaRestCheck();
        return;
      }
      LC.Audio.sfx('buaya20');
      this.toast(pick(s >= 4 ? X.crocKA : X.crocFarm), 'buaya20_face');
      void self;
    },
    buayaNenek: function () {
      var self = this, q = this.S.quests, s = step(this);
      if (s === 3) {
        var fed = (q.c20fedF || 0) >= C.fishFarm;
        if (fed && night(this)) {
          this.buayaLines([['nenek20', 'She is fed, the tide is right, and it is dark. Shall we go, cucu?']], { choices: [
            { label: 'Sail to Kampong Ayer', fn: function () { self.buayaSail(); } },
            { label: 'Not yet', fn: function () { } }
          ] });
          return;
        }
        this.buayaLines([['nenek20', fed ? 'She is fed. We sail after dark, cucu: after 7 PM. Board the jong when you are ready.' : 'Bring her fish first, cucu. ' + (q.c20fedF || 0) + ' of ' + C.fishFarm + '. Catch them in the river, or buy them.']]);
        return;
      }
      this.buayaLines([['nenek20', pick(X.nenekKA)]]);
    },
    buayaKancil: function () {
      var s = step(this);
      LC.Audio.sfx('kancil20');
      this.toast(pick(s === 3 ? X.kancilJetty : s >= C.part1 ? X.kancilFarm : X.kancilKA), 'kancil20_0');
    },
    buayaSail: function () {   // from the jong's menu, or from Nenek on the jetty
      var q = this.S.quests;
      if (step(this) !== 3) return;
      if ((q.c20fedF || 0) < C.fishFarm) { this.toast(X.sailNeed, 'wira_0'); LC.Audio.sfx('error'); return; }
      if (!night(this)) { this.toast(X.sailDay, 'wira_0'); LC.Audio.sfx('error'); return; }
      this.buayaLines(X.aboard);
      this.c20.sailPending = true;
    },

    // ================================================================ Laut Malam: the night voyage
    setupVoyage: function () {
      var self = this, c = this.c20, p = this.player, cam = this.cameras.main;
      cam.setZoom(2);
      p.setVisible(false); this.pShadow.setVisible(false);
      var sea = c.sea = { calm: C.calm.start, petCd: 0, shadows: [], fish: [], spawnT: 3, fishT: 7, thunderT: 4, cp: -1, said: {}, storm: 0, dawn: 0, kT: 9, arrived: false, capT: 0 };
      sea.sh = { x: p.x, y: p.y - 6, ang: 0, spd: 0, bumpT: 0, frameT: 0, wakeT: 0 };
      sea.sh.img = this.add.image(sea.sh.x, sea.sh.y, 'jong20_t0').setDepth(sea.sh.y + 4);
      sea.sh.wake = this.add.particles(0, 0, this.textures.exists('foam11') ? 'foam11' : 'smoke', { lifespan: 1400, speed: { min: 2, max: 10 }, scale: { start: 0.5, end: 1.5 }, alpha: { start: 0.5, end: 0 }, emitting: false }).setDepth(2);
      sea.cr = { x: sea.sh.x - 44, y: sea.sh.y, ang: 0, str: 100, frameT: 0 };
      sea.cr.img = this.add.image(sea.cr.x, sea.cr.y, 'buaya20gt_0').setDepth(5);
      sea.cr.light = this.addLight(sea.cr.x, sea.cr.y, 0xd8e8ff, 0.7, false); sea.cr.light.base = 0.45;
      sea.ring = this.add.graphics().setDepth(9004);
      sea.glow = this.addLight(sea.sh.x, sea.sh.y, 0xffe8b0, 3, false); sea.glow.base = 0.5;
      if (this.textures.exists('glow_soft')) sea.glow.img.setTexture('glow_soft');
      sea.rain = this.add.particles(0, 0, 'drop', { lifespan: 600, speedY: { min: 260, max: 340 }, speedX: { min: -80, max: -40 }, alpha: { start: 0.7, end: 0.1 }, emitting: false }).setDepth(9003);
      sea.caps = []; for (var j = 0; j < 14; j++) sea.caps.push({ img: this.add.image(0, 0, this.textures.exists('foam11') ? 'foam11' : 'smoke').setDepth(3).setAlpha(0), t: Math.random() * 2 });
      // the island beacons, and the lights of Kampong Ayer far to the east
      C.sea.isles.forEach(function (i) { var L = self.addLight(i.x * T, (i.y - 1) * T, 0xffc070, 0.8, true); L.base = 0.7; });
      for (var k = 0; k < 7; k++) { var L2 = this.addLight((C.sea.goalX + 1 + k) * T, (25 + (k * 3) % 5) * T, 0xffd890, 0.5, true); L2.base = 0.85; }
      if (this.A.voyage20 === 'night') this.time.delayedCall(800, function () { if (!self.leaving) self.buayaLines([['', X.helm]]); });
    },
    seaFree20: function (px, py) {
      var tx = Math.floor(px / T), ty = Math.floor(py / T);
      if (tx < 0 || ty < 0 || tx >= this.W || ty >= this.H) return false;
      return !!WATER[this.grid[ty][tx]];
    },
    updateShip20: function (dt, blocked) {
      var c = this.c20, sea = c.sea, sh = sea.sh, k = this.keys, p = this.player, S = C.ship, time = this.time.now;
      var vx = 0, vy = 0, analog = 1;
      if (!blocked && !sea.arrived) {
        if (k.A.isDown || k.LEFT.isDown) vx -= 1;
        if (k.D.isDown || k.RIGHT.isDown) vx += 1;
        if (k.W.isDown || k.UP.isDown) vy -= 1;
        if (k.S.isDown || k.DOWN.isDown) vy += 1;
        if (!vx && !vy) { var tv = this.ui.touchVec(); if (tv && Math.hypot(tv.x, tv.y) > 0.15) { vx = tv.x; vy = tv.y; analog = clamp(Math.hypot(vx, vy) * 1.2, 0.4, 1); } }
      }
      // Steer along the river bend on near-horizontal input. Diagonal input still steers directly.
      if (sea.kind === 'river' && vx && Math.abs(vy) < Math.abs(vx) * 0.3) {
        var ahead = Math.floor(sh.x / T) + Math.sign(vx) * 4;
        var dy = this.buayaRiverMid(ahead) * T - sh.y;
        vy = Math.abs(vx) * clamp(dy / (3 * T), -0.85, 0.85);
      }
      var steer = !!(vx || vy);
      if (steer) { var want = Math.atan2(vy, vx), d = wrapA(want - sh.ang); sh.ang = wrapA(sh.ang + clamp(d, -S.turn * dt, S.turn * dt)); }
      var ty = Math.floor(sh.y / T), tx = Math.floor(sh.x / T), shallow = this.grid[ty] && this.grid[ty][tx] === 'h' ? 0.6 : 1;
      var max = S.speed * shallow * (1 - sea.storm * 0.2) * analog;
      if (steer) sh.spd = Math.min(max, sh.spd + S.accel * dt); else sh.spd = Math.max(0, sh.spd - S.accel * 0.7 * dt);
      if (sh.spd > max) sh.spd = Math.max(max, sh.spd - S.accel * dt);
      var px = 0, py = 0;
      if (sea.storm > 0) { px = Math.sin(time / 700) * 34 * sea.storm; py = Math.cos(time / 900) * 26 * sea.storm; }
      var mx = (Math.cos(sh.ang) * sh.spd + px) * dt, my = (Math.sin(sh.ang) * sh.spd + py) * dt;
      var ca = Math.cos(sh.ang), sa = Math.sin(sh.ang), nx = sh.x + mx, ny = sh.y + my, self = this;
      var pts = [[nx + ca * 26, ny + sa * 26], [nx - ca * 26, ny - sa * 26], [nx - sa * 9, ny + ca * 9], [nx + sa * 9, ny - ca * 9]];
      if (pts.every(function (q) { return self.seaFree20(q[0], q[1]); })) { sh.x = nx; sh.y = ny; }
      else {
        var slideX = pts.every(function (q) { return self.seaFree20(q[0], q[1] - my); }), slideY = pts.every(function (q) { return self.seaFree20(q[0] - mx, q[1]); });
        if (slideX) sh.x = nx; else if (slideY) sh.y = ny;
        if (sh.spd > 40 && sh.bumpT <= 0) { sh.bumpT = 1.2; LC.Audio.sfx('bump11'); this.cameras.main.shake(160, 0.004); this.fx.drop.explode(8, pts[0][0], pts[0][1]); }
        sh.spd *= slideX || slideY ? 0.7 : -0.25;
      }
      if (sea.sirens) {
        var water = sea.sirens.bounds, bx = clamp(sh.x, water.left, water.right), by = clamp(sh.y, water.top, water.bottom);
        if (sh.x !== bx || sh.y !== by) sh.spd *= 0.7;
        sh.x = bx; sh.y = by;
      }
      sh.bumpT -= dt;
      sh.frameT -= dt;
      if (sh.frameT <= 0) { sh.frameT = sea.storm > 0.2 ? 0.14 : sh.spd > 30 ? 0.3 : 0.6; sh.img.setTexture(sh.img.texture.key === 'jong20_t0' ? 'jong20_t1' : 'jong20_t0'); }
      var roll = Math.sin(time / 520) * (0.03 + sea.storm * 0.08);
      sh.img.setPosition(Math.round(sh.x), Math.round(sh.y)).setRotation(sh.ang + roll).setDepth(sh.y + 4);
      sh.wakeT -= dt;
      if (sh.spd > 12 && sh.wakeT <= 0) { sh.wakeT = 0.06; sh.wake.emitParticleAt(sh.x - ca * 28, sh.y - sa * 28, 1); }
      p.x = sh.x; p.y = sh.y + 6;
      this.moving = sh.spd > 6;
      var dd = Math.round(sh.ang / (Math.PI / 2));
      this.dir = ['right', 'down', 'left', 'up'][(dd % 4 + 4) % 4];
      this.pShadow.setVisible(false); p.setVisible(false); this.veh.setVisible(false);
    },
    buayaSeaAction: function () {
      var self = this, sea = this.c20.sea, sl = LC.State.selItem(), it = sl && LC.ITEMS[sl.id];
      if (sea.arrived || (sea.kind && sea.kind !== 'night')) return null;
      if (it && it.food) return { label: 'Feed Pelita ' + it.name, fn: function () { self.buayaSeaFeed(sl.id); } };
      return { label: 'Comfort Pelita', fn: function () { self.buayaSeaPet(); } };
    },
    buayaSeaPet: function () {
      var sea = this.c20.sea;
      if (sea.petCd > 0) return;
      sea.petCd = C.calm.petCd;
      sea.calm = Math.min(100, sea.calm + C.calm.pet);
      LC.Audio.sfx('pet');
      this.fx.heart.explode(3, this.ghost.x, this.ghost.y - 6);
      this.setEmote('happy', 900);
    },
    buayaSeaFeed: function (id) {
      var sea = this.c20.sea, g = this.S.ghost, it = LC.ITEMS[id];
      if (!LC.State.count(id)) return;
      LC.State.remove(id, 1);
      g.full = Math.min(100, g.full + (it.food.full || 10)); g.joy = Math.min(100, g.joy + (it.food.joy || 5));
      sea.calm = Math.min(100, sea.calm + C.calm.feed);
      LC.Audio.sfx('eat');
      this.fx.heart.explode(6, this.ghost.x, this.ghost.y - 6);
      this.fx.sparkle.explode(8, this.ghost.x, this.ghost.y - 6);
      this.toast('Pelita gobbles the ' + it.name + ' and its light swells! Its ring of light grows.', it.icon);
    },
    buayaSeaReset: function () {   // she was dragged under: back to the last island to rest
      var sea = this.c20.sea, cp = sea.cp >= 0 ? C.sea.isles[sea.cp] : null, at = cp ? { x: cp.x * T, y: (cp.y + 5.5) * T } : { x: (C.sea.start.x + 0.5) * T, y: (C.sea.start.y + 0.4) * T }, self = this;
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cutscene = true;
      this.cameras.main.once('camerafadeoutcomplete', function () {
        sea.sh.x = at.x; sea.sh.y = at.y; sea.sh.ang = 0; sea.sh.spd = 0;
        sea.cr.x = at.x - 44; sea.cr.y = at.y; sea.cr.str = 70; sea.cr.ang = 0;
        sea.calm = Math.max(sea.calm, 70);
        sea.shadows.forEach(function (h) { h.spr.destroy(); }); sea.shadows = [];
        sea.fish.forEach(function (f) { f.spr.destroy(); }); sea.fish = [];
        sea.spawnT = 4; sea.fishT = 7;
        self.player.setPosition(at.x, at.y + 6);
        self.cameras.main.fadeIn(500);
        self.cutscene = false;
        self.toast(X.weak.replace('{isle}', cp ? cp.name : 'the river mouth'), 'buaya20_face');
      });
    },
    updateSea20: function (time, dt, blocked) {
      var self = this, c = this.c20, sea = c.sea, sh = sea.sh, cr = sea.cr, cam = this.cameras.main, wv = cam.worldView;
      if (cam.zoom !== 2) cam.setZoom(2);
      var prog = clamp(sh.x / (C.sea.goalX * T), 0, 1);
      sea.storm = clamp(Math.min(sh.x / T - C.sea.storm.x0, C.sea.storm.x1 - sh.x / T) / 6, 0, 1);
      var R = C.ring(sea.calm);
      // friends who follow you on land (Badang, a spirit companion, an escort) stay ashore tonight
      if ((sea.hideT = (sea.hideT || 0) - dt) <= 0) {
        sea.hideT = 1;
        sea.hideList = this.children.list.filter(function (o) { var k = o.texture && o.texture.key; return o !== self.ghost && k && /^(npc_|sp_|mirror|wira_)/.test(k); });
      }
      (sea.hideList || []).forEach(function (o) { if (o.active) o.setVisible(false); });
      // the ring of Pelita's courage
      var g = sea.ring; g.clear();
      g.fillStyle(0xffe8b0, 0.05); g.fillCircle(sh.x, sh.y, R);
      var segs = 28;
      for (var i = 0; i < segs; i++) {
        if (i % 2) continue;
        var a0 = i / segs * Math.PI * 2 + time / 4000, a1 = (i + 1) / segs * Math.PI * 2 + time / 4000;
        g.lineStyle(2, sea.calm < 35 ? 0xff9a6a : 0xffd890, 0.55); g.beginPath(); g.arc(sh.x, sh.y, R, a0, a1); g.strokePath();
      }
      sea.glow.img.setPosition(sh.x, sh.y).setScale(R / 30);
      sea.glow.base = 0.3 + sea.calm / 100 * 0.25;
      // whitecaps
      sea.caps.forEach(function (cp) {
        cp.t -= dt;
        if (cp.t > 0) return;
        cp.t = 1.6 + Math.random() * 1.8;
        var x = wv.x + Math.random() * wv.width, y = wv.y + Math.random() * wv.height;
        if (!self.seaFree20(x, y)) return;
        cp.img.setPosition(x, y).setAlpha(0).setScale(0.7 + Math.random() * 0.7 + sea.storm);
        self.tweens.add({ targets: cp.img, alpha: 0.6, duration: 420, yoyo: true, hold: 200 });
      });
      if (blocked || sea.arrived) { cr.img.setPosition(cr.x, cr.y); return; }
      sea.petCd = Math.max(0, sea.petCd - dt);
      // Pelita grows afraid (faster in the storm)
      sea.calm = Math.max(0, sea.calm - (sea.storm > 0.05 ? C.calm.stormDecay : C.calm.decay) * dt);
      if (sea.calm < 25 && !sea.said.low) { sea.said.low = true; this.toast(X.calmLow, 'ic_glow'); }
      if (sea.calm > 45) sea.said.low = false;
      // the storm: rain, lightning and thunder
      if (sea.storm > 0.05) {
        if (!sea.said.storm) { sea.said.storm = true; this.toast(X.storm, 'ic_moon'); }
        for (var rr = 0; rr < 3; rr++) sea.rain.emitParticleAt(wv.x + Math.random() * (wv.width + 80), wv.y - 10, 1);
        if ((sea.thunderT -= dt) <= 0) {
          sea.thunderT = 3 + Math.random() * 3.5;
          cam.flash(160, 230, 235, 255);
          this.time.delayedCall(200 + Math.random() * 400, function () { LC.Audio.sfx('thunder11'); });
          sea.calm = Math.max(0, sea.calm - C.calm.thunder);
          this.setEmote('sad', 900);
        }
      }
      // Seri Putih swims behind the stern (she is slower than the jong at full sail)
      var sx = sh.x - Math.cos(sh.ang) * (28 + C.croc.lag), sy = sh.y - Math.sin(sh.ang) * (28 + C.croc.lag);
      var dx = sx - cr.x, dy = sy - cr.y, d = Math.hypot(dx, dy), held = sea.shadows.filter(function (h) { return h.on; }).length;
      var vmax = C.croc.speed * (held ? 0.55 : 1) * (0.6 + 0.4 * cr.str / 100);
      if (d > 3) {
        var v = Math.min(vmax, d * 2.2) * dt;
        var nx = cr.x + dx / d * v, ny = cr.y + dy / d * v;
        if (this.seaFree20(nx, ny)) { cr.x = nx; cr.y = ny; } else if (this.seaFree20(nx, cr.y)) cr.x = nx; else if (this.seaFree20(cr.x, ny)) cr.y = ny;
        cr.ang = wrapA(cr.ang + clamp(wrapA(Math.atan2(dy, dx) - cr.ang), -3 * dt, 3 * dt));
      }
      var inRing = Math.hypot(cr.x - sh.x, cr.y - sh.y) < R - 6;
      if ((cr.frameT -= dt) <= 0) { cr.frameT = 0.5; var white = cr.str > 60 ? 'buaya20t_' : 'buaya20gt_'; cr.f = cr.f ? 0 : 1; cr.img.setTexture(white + cr.f); }
      cr.img.setPosition(Math.round(cr.x), Math.round(cr.y)).setRotation(cr.ang).setDepth(9002).setAlpha(inRing ? 1 : 0.6 + 0.2 * Math.sin(time / 150));
      cr.light.img.setPosition(cr.x, cr.y);
      // her strength
      if (inRing) cr.str = Math.min(100, cr.str + C.croc.heal * dt);
      else {
        cr.str -= (C.croc.weak + held * C.croc.drain) * dt;
        if (!sea.said.out || (sea.outT = (sea.outT || 0) + dt) > 8) { sea.said.out = true; sea.outT = 0; this.toast(X.outside, 'buaya20_face'); }
      }
      if (cr.str <= 0) { this.buayaSeaReset(); return; }
      // the shadow hands rise out of the dark and reach for her
      if ((sea.spawnT -= dt) <= 0 && sea.shadows.length < 9) {
        sea.spawnT = Math.max(1.1, 3.2 - prog * 1.8 - sea.storm * 0.6) * (0.7 + Math.random() * 0.6);
        var ang = Math.random() * Math.PI * 2, dist = 210 + Math.random() * 70;
        var hx = cr.x + Math.cos(ang) * dist, hy = cr.y + Math.sin(ang) * dist;
        if (Math.hypot(hx - sh.x, hy - sh.y) > R + 30) {
          var hs = this.add.sprite(hx, hy, 'bayang20_0').setDepth(9005).setAlpha(0).play('bayang20_walk');
          this.tweens.add({ targets: hs, alpha: 0.95, duration: 500 });
          sea.shadows.push({ spr: hs, on: false, ox: 0, oy: 0 });
        }
      }
      sea.shadows = sea.shadows.filter(function (h) {
        var s = h.spr;
        if (h.on) { s.setPosition(cr.x + h.ox, cr.y + h.oy - 6); s.setAngle(Math.sin(time / 120 + h.ox) * 12); }
        else {
          var hx2 = cr.x - s.x, hy2 = cr.y - s.y, hd = Math.hypot(hx2, hy2) || 1, sp = (38 + sea.storm * 14 + prog * 12) * dt;
          s.x += hx2 / hd * sp; s.y += hy2 / hd * sp;
          if (hd < 14) { h.on = true; h.ox = (Math.random() - 0.5) * 20; h.oy = (Math.random() - 0.5) * 8; LC.Audio.sfx('bayang20'); }
        }
        if (Math.hypot(s.x - sh.x, s.y - sh.y) < R) {   // the light burns it away
          self.fx.sparkle.explode(6, s.x, s.y - 6); self.fx.smoke.explode(3, s.x, s.y - 6);
          s.destroy();
          return false;
        }
        return true;
      });
      // shadow fish dart at the hull (a bright ring burns them; a frightened one does not)
      if ((sea.fishT -= dt) <= 0 && sea.fish.length < 3) {
        sea.fishT = Math.max(2.6, 7 - prog * 3 - sea.storm * 1.5) * (0.7 + Math.random() * 0.6);
        var fa = sh.ang + (Math.random() - 0.5) * 1.6, fd = 250;
        var fx = sh.x + Math.cos(fa) * fd, fy = sh.y + Math.sin(fa) * fd;
        sea.fish.push({ spr: this.add.image(fx, fy, 'ikan20').setDepth(9005), ang: fa + Math.PI, life: 8 });
      }
      sea.fish = sea.fish.filter(function (f) {
        var s = f.spr, want = Math.atan2(sh.y - s.y, sh.x - s.x);
        f.ang = wrapA(f.ang + clamp(wrapA(want - f.ang), -1.6 * dt, 1.6 * dt));
        s.x += Math.cos(f.ang) * 96 * dt; s.y += Math.sin(f.ang) * 96 * dt;
        s.setRotation(f.ang).setFlipY(Math.cos(f.ang) < 0);
        f.life -= dt;
        var fd2 = Math.hypot(s.x - sh.x, s.y - sh.y);
        if (fd2 < R && sea.calm >= 50) { self.fx.sparkle.explode(5, s.x, s.y); s.destroy(); return false; }
        if (fd2 < 22) {
          sea.calm = Math.max(0, sea.calm - C.calm.bump);
          LC.Audio.sfx('bump11'); cam.shake(200, 0.006);
          self.fx.smoke.explode(5, s.x, s.y); self.setEmote('sad', 1200);
          self.toast(pick(X.fishHit), 'ikan20');
          s.destroy(); return false;
        }
        if (f.life <= 0) { s.destroy(); return false; }
        return true;
      });
      // the islands are safe harbours (checkpoints)
      C.sea.isles.forEach(function (isle, i) {
        if (i > sea.cp && sh.x > isle.x * T) { sea.cp = i; self.toast(X.isle.replace('{isle}', isle.name), 'ic_glow'); }
      });
      // a word from the crew now and then
      if ((sea.kT -= dt) <= 0) { sea.kT = 16 + Math.random() * 10; this.ui.floatText(sh.x, sh.y - 30, pick(X.kancilSea), '#ffe8c0'); }
      // the mouth of the Brunei river
      if (sh.x > C.sea.goalX * T) this.buayaArrive();
    },
    buayaArrive: function () {
      var c = this.c20, sea = c.sea, self = this;
      if (sea.arrived) return;
      sea.arrived = true;
      story(this, 4);   // (saved first)
      this.S.quests.c20arrive = 0;
      LC.State.save();
      sea.shadows.forEach(function (h) { self.fx.sparkle.explode(4, h.spr.x, h.spr.y); h.spr.destroy(); }); sea.shadows = [];
      sea.fish.forEach(function (f) { f.spr.destroy(); }); sea.fish = [];
      this.tweens.add({ targets: sea, dawn: 0.75, duration: 3000 });
      LC.Audio.sfx('chime');
      this.buayaLines(X.arrive);
      c.arrivePending = true;
    },
    buayaVoyageEnd: function () {   // the whole night at sea: the next morning, in Kampong Ayer
      var self = this;
      this.c20.arrivePending = false;
      if (this.sleeping) return;
      this.sleeping = true;
      this.ui.closeModal();
      this.cameras.main.fadeOut(900, 8, 6, 18);
      this.cameras.main.once('camerafadeoutcomplete', function () {
        var sum = LC.State.endDay(false);
        if (LC.Net.isHost()) LC.Net.broadcast({ t: 'dayStart', sum: sum, world: LC.State.snapshot() });
        LC.followPid = self.followPid;
        self.scene.restart({ area: 'barunai', spawn: self.tilePx({ x: 5, y: 16 }), dir: 'down', summary: sum });
      });
    },

    // ================================================================ Kampong Ayer: calming the village
    buayaFolk: function (who) {
      var self = this, q = this.S.quests, s = step(this), done = calmed(q)[who];
      if (s !== 4 || done) {
        if (who === 'semaun') { this.buayaLines([['semaun20', pick(X.semaunAfter)]]); return; }
        this.toast(X.folkDone[who], 'npc20_' + who + '_0');
        return;
      }
      var R = who === 'semaun' ? X.semaun : X.folk[who], spk = who + '20';
      var opts = R.wrong.map(function (w) { return { t: w[0], ok: false, why: w[1] }; });
      opts.splice(R.pos || 0, 0, { t: R.right, ok: true });
      this.buayaLines([[spk, R.say]], { choices: opts.map(function (o) {
        return { label: o.t, fn: function () {
          if (!o.ok) { LC.Audio.sfx('error'); self.buayaLines([['', o.why]]); return; }
          calmed(q)[who] = true; q.c20calm = Object.keys(calmed(q)).length; LC.State.save();
          LC.Audio.sfx('chime');
          var lines = [['', R.after]];
          if (q.c20calm >= 4) lines.push(['', X.calmDone]);
          self.buayaLines(lines);
          self.c20.refreshPending = true;
        } };
      }) });
    },
    buayaBerbai: function () {
      var q = this.S.quests;
      if (step(this) !== 4) return;
      if (q.c20proof) { this.buayaLines(X.berbaiLater); return; }
      q.c20proof = true; LC.State.save();
      this.buayaLines(X.berbai);
      this.c20.refreshPending = true;
    },
    buayaSari: function () {
      if (step(this) !== 4) return;
      story(this, 5);   // (saved first)
      LC.Audio.sfx('cheer');
      this.buayaLines(X.sari.concat([['', X.tasksHint]]));
      this.c20.refreshPending = true;
    },
    buayaLajak: function () {
      var t = tasks(this.S.quests), nib = LC.State.count('nibong'), bel = LC.State.count('belian');
      if (t.rakit) { this.toast(X.workshopLook.lajak, 'bengkel_perahu'); return; }
      if (!t.askL) { t.askL = true; LC.State.save(); this.buayaLines(X.lajakAsk); return; }
      if (nib < 6 || bel < 3) { this.toast(X.lajakNeed.replace('{nib}', nib).replace('{bel}', bel), 'i_nibong'); return; }
      LC.State.remove('nibong', 6); LC.State.remove('belian', 3);
      t.rakit = true; LC.State.save();
      LC.Audio.sfx('harvest');
      this.buayaLines(X.lajakDone);
      this.c20.refreshPending = true;
      this.buayaRestCheck();
    },
    buayaKemala: function () {
      var S = this.S, t = tasks(S.quests);
      if (t.loceng) { this.toast(X.workshopLook.kemala, 'bengkel_tembaga'); return; }
      if (!t.askK) { t.askK = true; LC.State.save(); this.buayaLines(X.kemalaAsk); return; }
      if (S.kepeng < 400) { this.toast(X.kemalaNeed, 'i_kepeng'); LC.Audio.sfx('error'); return; }
      if (!LC.State.canAdd('loceng20')) { this.toast('Make room in your bag first!'); LC.Audio.sfx('error'); return; }
      S.kepeng -= 400; LC.State.add('loceng20', 1);
      t.loceng = true; LC.State.save();
      LC.Audio.sfx('loceng20');
      this.buayaLines(X.kemalaDone);
      this.buayaRestCheck();
    },
    buayaRestCheck: function () {
      var q = this.S.quests, t = tasks(q);
      if (!(t.rakit && t.loceng && (t.ikan || 0) >= C.fishKA) || t.done) return;
      t.done = true;
      story(this, 6); q.c20restDay = this.S.day; LC.State.save();   // (saved first)
      this.buayaCrocTex();
      var self = this;
      this.time.delayedCall(300, function () { if (!self.leaving) { self.buayaLines(X.restDone); self.toast('The village sleeps. Stay in Kampong Ayer tonight (after 9 PM)...', 'ic_moon'); } });
    },

    // ================================================================ the Night of Fire
    buayaFireStart: function () {
      var self = this, c = this.c20, K = C.ka;
      var f = c.fire = { tiles: {}, charred: {}, cut: {}, n: 0, spreadT: 4, chainT: C.fire.chainEvery, outerT: C.fire.outerEvery, hotT: 0, bucket: false, family: false, shadowsOn: false, lampsOut: true, done: false, marks: {}, giveT: 0, started: false, howPending: false };
      LC.c20fireOn = true;
      LC.Audio.sfx('bayang20');
      this.cameras.main.shake(200, 0.002);
      this.toast(X.fireOut, 'lampu20_off');
      // the trapped family on their house
      var fp = feet(K.family);
      f.familySpr = ['kel1_0', 'kel0_0', 'kel2_0'].map(function (k, i) { return self.add.sprite(fp.x - 10 + i * 9, fp.y - 14 + (i % 2) * 2, k).setOrigin(0.5, 1).setDepth(fp.y + 2 + i).setScale(i === 2 ? 0.8 : 1).setFlipX(i === 1); });
      f.familySpr.forEach(function (sp) { self.tweens.add({ targets: sp, y: sp.y - 2, duration: 300, yoyo: true, repeat: -1 }); });
      // the marked planks to cut
      K.cuts.forEach(function (ct) { var m = self.add.image(ct.x * T, ct.y * T, 'potong20').setOrigin(0).setDepth(-9).setAlpha(0.8); self.tweens.add({ targets: m, alpha: 0.35, duration: 600, yoyo: true, repeat: -1 }); f.marks[key(ct.x, ct.y)] = m; });
      this.time.delayedCall(2200, function () {
        if (self.leaving || !c.fire || c.fire !== f) return;
        f.started = true; f.shadowsOn = true;
        K.fireStart.forEach(function (t) { self.buayaIgnite(t.x, t.y); });
        LC.Audio.sfx('api20');
        self.buayaLines(X.fireStart);
        f.howPending = true;
      });
    },
    buayaWalk: function (x, y) {
      var f = this.c20.fire;
      return !!(this.grid[y] && this.grid[y][x] === 'j') && !f.cut[key(x, y)];
    },
    buayaIgnite: function (x, y) {
      var f = this.c20.fire, k = key(x, y);
      if (f.tiles[k] || f.charred[k] || !this.buayaWalk(x, y)) return false;
      var p = feet({ x: x, y: y });
      var spr = this.add.sprite(p.x, p.y, 'api_0').setOrigin(0.5, 1).setDepth(p.y + 1);
      if (this.anims.exists('api_burn')) spr.play({ key: 'api_burn', startFrame: Math.random() < 0.5 ? 0 : 1 });   // (two frames)
      var L = this.addLight(p.x, p.y - 8, 0xff8a3a, 0.75, true); L.base = 0.85;
      f.tiles[k] = { x: x, y: y, spr: spr, L: L };
      f.n++;
      return true;
    },
    buayaDouse: function (x, y, quiet) {
      var f = this.c20.fire, k = key(x, y), t = f.tiles[k];
      if (!t) return false;
      t.spr.destroy(); t.L.base = 0; t.L.img.setAlpha(0);
      delete f.tiles[k]; f.n--;
      f.charred[k] = this.add.image(x * T, y * T, 'hangus20').setOrigin(0).setDepth(-9);
      this.fx.smoke.explode(quiet ? 4 : 10, (x + 0.5) * T, (y + 0.5) * T);
      if (!quiet) { this.fx.drop.explode(10, (x + 0.5) * T, (y + 0.5) * T); LC.Audio.sfx('siram20'); }
      return true;
    },
    buayaCut: function (x, y) {
      var f = this.c20.fire, k = key(x, y), TI = LC.Art.TI;
      f.cut[k] = true;
      this.grid[y][x] = 'w'; this.solid[y][x] = true;
      var tile = this.ground.getTileAt(x, y);
      if (tile) { tile.index = TI.RIV0; this.animTiles.push({ x: x, y: y, k: 'river', tile: tile }); }
      if (f.marks[k]) { f.marks[k].destroy(); delete f.marks[k]; }
      if (f.charred[k]) { f.charred[k].destroy(); delete f.charred[k]; }
      this.fx.drop.explode(12, (x + 0.5) * T, (y + 0.5) * T); this.fx.pebble.explode(6, (x + 0.5) * T, (y + 0.5) * T);
      LC.Audio.sfx('retak20'); LC.Audio.sfx('splash');
      this.toast(X.cutDone, 'potong20');
    },
    buayaFireAction: function () {
      var self = this, f = this.c20.fire, fc = this.facing(), tx = fc.tx, ty = fc.ty, k = key(tx, ty);
      if (!f.started) return null;
      // a fire in front of you (or just beside where you face)
      var near = f.tiles[k];
      if (!near) Object.keys(f.tiles).some(function (kk) { var t = f.tiles[kk]; if (Math.hypot((t.x + 0.5) * T - fc.fx, (t.y + 0.5) * T - fc.fy) < 14) { near = t; return true; } return false; });
      if (near) return f.bucket ? { label: 'Throw the water', fn: function () { if (self.buayaDouse(near.x, near.y)) { f.bucket = false; self.toast(X.douse, 'timba20'); } } }
        : { label: 'Fire! (fetch water first)', fn: function () { self.toast('You need water! Scoop some from the river (USE facing the water), or take a bucket from the chain on the pier.', 'timba20'); LC.Audio.sfx('error'); } };
      // a marked plank
      var cutHere = C.ka.cuts.some(function (ct) { return ct.x === tx && ct.y === ty; });
      if (cutHere && !f.cut[k]) return { label: 'Cut the planks', fn: function () { if (f.tiles[k]) { self.toast(X.cutBurning, 'api_0'); LC.Audio.sfx('error'); return; } self.buayaCut(tx, ty); } };
      // the river, to fill the bucket
      var ch = this.grid[ty] && this.grid[ty][tx];
      if (!f.bucket && (ch === 'w' || ch === 'S') && !this.objAt[ty][tx]) return { label: 'Scoop water', fn: function () { f.bucket = true; LC.Audio.sfx('water'); self.fx.drop.explode(6, fc.fx, fc.fy); self.toast(X.scoop, 'timba20_penuh'); } };
      return null;
    },
    buayaTaxi: function () {
      var self = this, c = this.c20, f = c.fire;
      if (!f || f.done || !f.started || f.family) { this.toast(X.taxiAfter, 'perahu_kecil'); return; }
      this.cutscene = true;
      this.toast(X.taxiGo, 'perahu_kecil');
      LC.Audio.sfx('splash');
      this.cameras.main.fadeOut(500, 30, 10, 5);
      this.cameras.main.once('camerafadeoutcomplete', function () {
        f.family = true;
        (f.familySpr || []).forEach(function (sp) { sp.destroy(); });
        var a = feet({ x: 24, y: 15 }), b = feet({ x: 25, y: 15 });
        f.saved = [self.add.sprite(a.x - 4, a.y, 'kel1_0').setOrigin(0.5, 1).setDepth(a.y), self.add.sprite(b.x, b.y, 'kel0_0').setOrigin(0.5, 1).setDepth(b.y).setFlipX(true), self.add.sprite(b.x + 10, b.y + 3, 'kel2_0').setOrigin(0.5, 1).setDepth(b.y + 3).setScale(0.8)];
        self.cameras.main.fadeIn(600);
        self.cutscene = false;
        LC.Audio.sfx('cheer');
        self.buayaLines(X.taxiDone);
      });
    },
    buayaFireFaint: function () {   // Awang Semaun pulls you out of the smoke; the fire flares up again
      var S = this.S, f = this.c20.fire, self = this;
      S.hp = Math.max(1, Math.round(S.maxHp * 0.6));
      this.player.clearTint().setAlpha(1);
      this.invuln = 2;
      Object.keys(f.tiles).forEach(function (k) { var t = f.tiles[k]; self.buayaDouse(t.x, t.y, true); });
      Object.keys(f.charred).forEach(function (k) { f.charred[k].destroy(); }); f.charred = {};
      C.ka.fireStart.forEach(function (t) { self.buayaIgnite(t.x, t.y); });
      var sp = feet({ x: 24, y: 16 }); this.player.setPosition(sp.x, sp.y);
      this.buayaLines([['semaun20', 'Up! Up! I have you. Breathe!'], ['', '(Awang Semaun dragged you out of the smoke onto the pier. While you were down, the fire flared up again. Try again: water, buckets, and cut the planks!)']]);
    },
    updateFire20: function (time, dt, blocked) {
      var self = this, c = this.c20, f = c.fire, K = C.ka, p = this.player;
      if (!f.started || f.done) return;
      if (blocked) return;
      if (f.howPending) { f.howPending = false; this.toast(X.fireHow, 'api_0'); }
      // the fire spreads along the planks
      if ((f.spreadT -= dt) <= 0) {
        f.spreadT = C.fire.spread * (0.8 + Math.random() * 0.4);
        var keys = Object.keys(f.tiles);
        if (keys.length && f.n < C.fire.cap) {
          for (var tries = 0; tries < 6; tries++) {
            var t = f.tiles[keys[Math.floor(Math.random() * keys.length)]], dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]], dd = dirs[Math.floor(Math.random() * 4)];
            if (this.buayaIgnite(t.x + dd[0], t.y + dd[1])) { LC.Audio.sfx('api20'); break; }
          }
        }
      }
      // the bucket chain on the pier puts out the fire nearest to it, and gives you a full bucket
      var chain = ctr(K.chain);
      if ((f.chainT -= dt) <= 0) {
        f.chainT = C.fire.chainEvery;
        var best = null, bd = 7 * T;
        Object.keys(f.tiles).forEach(function (k) { var t2 = f.tiles[k], d = Math.hypot((t2.x + 0.5) * T - chain.x, (t2.y + 0.5) * T - chain.y); if (d < bd) { bd = d; best = t2; } });
        if (best) this.buayaDouse(best.x, best.y);
      }
      var ptx = Math.floor(p.x / T), pty = Math.floor((p.y - 3) / T);
      f.giveT -= dt;
      if (!f.bucket && ptx >= 24 && ptx <= 25 && pty >= 17 && pty <= 20 && f.giveT <= 0) { f.bucket = true; f.giveT = 3; LC.Audio.sfx('water'); this.toast(X.chainGive, 'timba20_penuh'); }
      // the neighbours beyond the cut planks put out what reaches them
      if ((f.outerT -= dt) <= 0) {
        f.outerT = C.fire.outerEvery;
        var Z = K.zone, out = Object.keys(f.tiles).map(function (k) { return f.tiles[k]; }).filter(function (t3) { return t3.x < Z.x0 || t3.x > Z.x1 || t3.y > Z.y1; });
        if (out.length) this.buayaDouse(out[0].x, out[0].y, true);
      }
      // too hot to stand in
      if (f.tiles[key(ptx, pty)] && (f.hotT -= dt) <= 0) {
        f.hotT = 0.9;
        var ft = f.tiles[key(ptx, pty)];
        this.playerHurt(C.fire.hot, { spr: { x: ft.spr.x, y: ft.spr.y + 4 } });
        if (!f.saidHot) { f.saidHot = true; this.toast(X.hot, 'api_0'); }
      }
      // smoke rises
      if ((f.smokeT = (f.smokeT || 0) - dt) <= 0) {
        f.smokeT = 0.3;
        Object.keys(f.tiles).forEach(function (k) { if (Math.random() < 0.4) { var t4 = f.tiles[k]; self.fx.smoke.explode(1, t4.spr.x + (Math.random() - 0.5) * 8, t4.spr.y - 16); } });
      }
      // the end: every fire out, and the family safe
      if (f.n <= 0 && f.family) this.buayaFireWon();
    },
    buayaFireWon: function () {
      var self = this, c = this.c20, f = c.fire, q = this.S.quests;
      f.done = true; f.shadowsOn = false;
      LC.c20fireOn = false;
      story(this, 7); q.c20fireDay = this.S.day; LC.State.save();   // (saved first)
      Object.keys(f.marks).forEach(function (k) { f.marks[k].destroy(); }); f.marks = {};
      (this.enemies || []).forEach(function (e) { if (e.g && e.g.c20 && !e.dead && !e.away) { e.dead = true; e.respawn = Infinity; e.light.base = 0; self.fx.smoke.explode(6, e.spr.x, e.spr.y - 8); self.tweens.add({ targets: e.spr, alpha: 0, duration: 600, onComplete: function () { e.spr.setVisible(false); } }); } });
      LC.Audio.setBattle(false);
      this.toast(X.shadowsFlee, 'ic_moon');
      c.cine = { phase: 'child', t: 1.4, actors: {} };
    },

    // ---------------------------------------------------------------- after the fire: the child, the White One, Pelita
    buayaCine: function (dt) {
      var c = this.c20, ci = c.cine, self = this;
      if (ci.wait) return;
      if (ci.t > 0) { ci.t -= dt; return; }
      var ch = feet(C.ka.child);
      if (ci.phase === 'child') {
        ci.actors.child = this.add.sprite(ch.x, ch.y, 'npc20_anak_0').setOrigin(0.5, 1).setDepth(ch.y).setScale(0.8);
        this.cameras.main.pan(ch.x, ch.y - 10, 800);
        ci.phase = 'fall';
        this.buayaLines(X.child);
        return;
      }
      if (ci.phase === 'fall') {
        ci.phase = 'rise'; ci.wait = true;
        var kid = ci.actors.child;
        LC.Audio.sfx('retak20');
        this.tweens.add({ targets: kid, y: ch.y + 14, alpha: 0.4, duration: 500, ease: 'Quad.easeIn', onComplete: function () {
          LC.Audio.sfx('splash'); self.fx.drop.explode(18, kid.x, kid.y - 4); kid.setAlpha(0.25);
          ci.wait = false; ci.t = 0.6;
        } });
        return;
      }
      if (ci.phase === 'rise') {   // she glides out from under the houses, and lifts him out of the water
        ci.phase = 'carry'; ci.wait = true;
        var im = this.objImgs.k_putih20, from = im ? { x: im.x, y: im.y } : feet({ x: 16, y: 26 });
        if (im) im.setVisible(false);
        var cr = ci.actors.croc = this.add.sprite(from.x, from.y, 'buaya20_0').setOrigin(0.5, 1).setDepth(from.y + 2);
        LC.Audio.sfx('buaya20'); this.cameras.main.shake(300, 0.003);
        var to = { x: ch.x - 26, y: ch.y + 16 };
        this.tweens.add({ targets: cr, x: to.x, y: to.y, duration: 2400, ease: 'Sine.easeInOut', onUpdate: function () { cr.setDepth(cr.y + 2); cr.setAlpha(Math.abs(cr.x - 20.5 * T) < 18 ? 0.45 : 1); },
          onComplete: function () {
            self.fx.drop.explode(16, ci.actors.child.x, ci.actors.child.y);
            ci.actors.child.setAlpha(1).setPosition(cr.x + 24, cr.y - 10).setDepth(cr.y + 3);
            ci.wait = false; ci.t = 0.4;
          } });
        return;
      }
      if (ci.phase === 'carry') {   // to the steps of the craft quarter
        ci.phase = 'safe'; ci.wait = true;
        var cr2 = ci.actors.croc, kid2 = ci.actors.child, steps = feet({ x: 26, y: 27 });
        this.tweens.add({ targets: cr2, x: steps.x - 22, y: steps.y - 4, duration: 1600, ease: 'Sine.easeInOut', onUpdate: function () { kid2.setPosition(cr2.x + 24, cr2.y - 10).setDepth(cr2.y + 3); cr2.setDepth(cr2.y + 2); },
          onComplete: function () {
            self.tweens.add({ targets: kid2, x: steps.x, y: steps.y, duration: 500, onComplete: function () { kid2.setDepth(kid2.y); ci.wait = false; ci.t = 0.3; } });
          } });
        return;
      }
      if (ci.phase === 'safe') { ci.phase = 'home'; this.buayaLines(X.rescue); return; }
      if (ci.phase === 'home') {   // she goes back under the houses; where is Pelita?
        ci.phase = 'end'; ci.wait = true;
        var cr3 = ci.actors.croc, home = this.objImgs.k_putih20;
        this.tweens.add({ targets: cr3, x: home ? home.x : cr3.x, y: home ? home.y : cr3.y, alpha: 1, duration: 2200, ease: 'Sine.easeInOut', onUpdate: function () { cr3.setDepth(cr3.y + 2); cr3.setAlpha(Math.abs(cr3.x - 20.5 * T) < 18 ? 0.45 : 1); },
          onComplete: function () { if (home) home.setVisible(true).setTexture('buaya20_0'); cr3.destroy(); ci.wait = false; } });
        this.tweens.add({ targets: ci.actors.child, alpha: 0, duration: 900, delay: 1600 });
        this.cameras.main.pan(this.player.x, this.player.y, 900);
        return;
      }
      if (ci.phase === 'end') {
        Object.keys(ci.actors).forEach(function (k) { var a = ci.actors[k]; if (a && a.active) a.destroy(); });
        (c.fire && c.fire.saved || []).forEach(function (sp) { if (sp.active) self.tweens.add({ targets: sp, alpha: 0, duration: 800, onComplete: function () { sp.destroy(); } }); });
        c.cine = null;
        this.cameras.main.startFollow(this.player, true, 0.2, 0.2);
        c.alone = true; c.sat = false; c.pets = 0;
        this.toast(X.pelitaAlone, 'ic_glow');
        this.time.delayedCall(1800, function () { if (!self.leaving) self.toast(X.pelitaHint, 'ic_glow'); });
      }
    },
    buayaPelita: function () {   // sit with Pelita, and pet it
      var c = this.c20, q = this.S.quests, g = this.gpos;
      if (!c.sat) { c.sat = true; LC.Audio.sfx('sad'); this.buayaLines(X.pelitaSit); return; }
      if (c.pets >= 3) return;
      c.pets++;
      LC.Audio.sfx('pet');
      this.fx.heart.explode(2 + c.pets, g.x, g.y - 6);
      this.toast(X.pelitaPet[c.pets - 1], 'ic_joy');
      if (c.pets >= 3) {
        q.c20sat = true; q.c20satDay = this.S.day; LC.State.save();
        var self = this;
        this.time.delayedCall(900, function () { if (!self.leaving) { self.buayaLines(X.pelitaDone); c.alonePending = true; } });
      }
    },
    buayaSendoff: function () {   // the next morning, the whole village rows her out to the bay
      var self = this, c = this.c20, S = this.S;
      story(this, C.part1);   // (saved first, with the rewards)
      S.kepeng += C.reward; S.stats.earned = (S.stats.earned || 0) + C.reward;
      if (!LC.State.count('loceng20')) LC.State.add('loceng20', 1);
      LC.State.save();
      var boats = c.things.boats = [];
      for (var i = 0; i < 10; i++) {
        var b = this.add.image((1 + i * 3.6) * T, (16.6 + (i % 3) * 0.9) * T, 'perahu_kecil').setOrigin(0.5, 1).setDepth((17 + (i % 3)) * T).setAlpha(0);
        this.tweens.add({ targets: b, alpha: 1, duration: 600, delay: i * 120 });
        this.tweens.add({ targets: b, x: b.x + 22 * T, duration: 16000, delay: 800 });
        this.tweens.add({ targets: b, y: b.y - 1, duration: 600 + i * 30, yoyo: true, repeat: -1 });
        boats.push(b);
      }
      var croc = this.objImgs.k_putih20;
      if (croc) this.tweens.add({ targets: croc, alpha: 0, duration: 3000, delay: 4000 });
      var n = 0;
      this.time.addEvent({ delay: 520, repeat: 13, callback: function () { if (!self.leaving) { LC.Audio.sfx(self.textures.exists('vinta11_t0') ? 'gongbeat11' : 'chime'); n++; } } });
      LC.Audio.sfx('cheer');
      this.time.delayedCall(1400, function () { if (!self.leaving) { self.buayaLines(X.sendoff); c.sendPending = true; } });
    },

    // ================================================================ every frame
    updateBuaya: function (time, dt) {
      var self = this, c = this.c20, S = this.S, q = S.quests, s = step(this);
      if (!c || !this.player) return;
      var blocked = this.ui.isBlocking() || this.leaving || this.sleeping || this.cutscene;
      if (c.sea) { this.updateSea20(time, dt, blocked); if (c.arrivePending && !this.ui.isBlocking() && !this.leaving) this.buayaVoyageEnd(); return; }
      if (!C.ready(S)) return;
      if (this.area === 'farm') this.updateKancil20(dt);
      if (c.fire) this.updateFire20(time, dt, blocked);
      // the scenes after the fire hold you still, and go on each time a dialogue closes
      if (c.cine && !this.ui.isBlocking() && !this.leaving && !this.sleeping) { this.cutscene = true; this.buayaCine(dt); if (!c.cine) this.cutscene = false; return; }
      if (blocked) return;
      // what follows a dialogue (it runs here, so a closed dialogue never skips it)
      if (c.runPending) this.buayaKancilRun();
      if (c.foundPending) this.buayaFoundDone();
      if (c.sailPending) { c.sailPending = false; if (step(this) === 3) this.sailTo('laut20'); return; }
      if (c.refreshPending) { c.refreshPending = false; this.refreshWhen(); this.buayaCrocTex(); }
      if (c.alonePending) { c.alonePending = false; c.alone = false; }
      if (c.sendPending) { c.sendPending = false; this.refreshWhen(); }
      // Kampong Ayer, the morning you arrive: "BUAYA!"
      if (s === 4 && this.area === 'barunai' && !q.c20arrive) {
        q.c20arrive = 1; LC.State.save();
        LC.Audio.sfx('buaya20');
        this.buayaLines(X.panic);
        return;
      }
      if ((c.tick -= dt) > 0) { this.buayaAnimate(dt); return; }
      c.tick = 0.5;
      this.buayaAnimate(0.5);
      // the chapter begins late on a night after Chapter 19 ends, on the farm
      if (s === 0) {
        if (q.c20wait === undefined) { q.c20wait = S.day; LC.State.save(); }
        else if (S.day > q.c20wait && S.minutes >= C.hookAt && this.area === 'farm') {
          q.c20hookDay = S.day;
          story(this, 1);   // (saved first)
          LC.Audio.sfx('buaya20');
          this.cameras.main.flash(300, 230, 240, 255);
          this.toast(X.hookToast, 'ic_moon');
          this.buayaLines(X.hook);
          return;
        }
      }
      // the morning after: the stripped vines, and Nenek's trick
      if (s === 1 && this.area === 'farm' && !q.c20morning && S.day > (q.c20hookDay || 0) && S.minutes >= 6 * 60 && S.minutes < C.watchAt) {
        q.c20morning = true;
        if (!LC.State.count('getah20') && !q.c20set) LC.State.add('getah20', 1);
        LC.State.save();
        this.buayaLines(X.morning);
        return;
      }
      if (s === 1 && q.c20hookDay === undefined) { q.c20hookDay = S.day; LC.State.save(); }
      // follow Sang Kancil: the reeds
      if (s === 2 && this.area === 'farm') {
        var rd = feet(C.farm.reeds);
        if (Math.hypot(this.player.x - rd.x - 8, this.player.y - rd.y) < 52) { this.buayaFound(); return; }
      }
      // the Night of Fire
      if (s === 6 && this.area === 'barunai' && !c.fire && S.minutes >= C.fireAt && S.day >= (q.c20restDay || 0)) { this.buayaFireStart(); return; }
      // the send-off, the morning after you sat with Pelita
      if (s === 7 && this.area === 'barunai' && q.c20sat && S.day > (q.c20satDay || 0) && !c.sentOff) { c.sentOff = true; this.buayaSendoff(); return; }
      var nt = night(this);
      if (nt !== c.wasNight) { c.wasNight = nt; }
    },
    buayaAnimate: function (dt) {   // Seri Putih breathes; Sang Kancil fidgets
      var c = this.c20;
      if ((c.animT -= dt) > 0) return;
      c.animT = 0.9;
      c.frame = c.frame ? 0 : 1;
      var self = this;
      ['f_putih20', 'k_putih20', 't_putih20'].forEach(function (id) {
        var im = self.objImgs[id];
        if (!im || !im.visible) return;
        var base = im.texture.key.indexOf('buaya20g') === 0 ? 'buaya20g_' : 'buaya20_';
        im.setTexture(base + c.frame);
      });
      ['f_kancil20', 'k_kancil20', 'f_kancil20b'].forEach(function (id) { var im = self.objImgs[id]; if (im && Math.random() < 0.3) im.setFlipX(!im.flipX); });
    }
  });
})(window.LC);
