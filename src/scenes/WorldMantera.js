/* Chapter 13 encounters and Mantera Pantul. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var W = LC.WorldScene.prototype, C = LC.C13, X = LC.MANTERA_TEXT;
  var VIOLET = 0xb2a1ff, MIRROR = 0xadf4e2, STAR = 0xffa99e;
  function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function school(w) { return w.area === 'mantera' || w.area === 'manteraVault'; }
  function active(e) { return !e.dead && !e.away; }
  function step(w) { return C.step(w.S); }
  function story(w, next) { w.S.quests.ch13 = next; LC.State.save(); }

  var create = W.createKampong, update = W.updateKampong;
  W.createKampong = function () { create.apply(this, arguments); this.createMantera(); };
  W.updateKampong = function (time, dt) { update.apply(this, arguments); this.updateMantera(time, dt); };
  var finishStormReef = W.finishStormReef;
  W.finishStormReef = function () {
    var ready = C.ready(this.S);
    finishStormReef.apply(this, arguments);
    if (!ready && C.ready(this.S)) {
      this.refreshWhen();
      this.createMantera();
    }
  };

  var objectAction = W.objectAction;
  W.objectAction = function (o) {
    var self = this, s = step(this), q = this.S.quests;
    switch (o.type) {
      case 'mantera_way': return { label: s ? 'Travel to Kampung Mantera' : 'Read Jack’s enchanted letter', fn: function () {
        if (!C.ready(self.S)) return;
        if (s === 0) { story(self, 1); self.manteraLines(X.letter); return; }
        self.goArea('mantera', undefined, 'up');
      } };
      case 'mantera_home': return { label: 'Return to Nenek’s farm', fn: function () {
        self.goArea('farm', self.tilePx({ x: 4, y: 9 }), 'right');
      } };
      case 'mantera_desk': return { label: s === 1 ? 'Study with Nek Lampir' : s >= 5 ? 'Read Nek Lampir’s slate' : 'Read the lesson notes', fn: function () {
        if (s === 1) { self.startManteraLesson(); return; }
        self.manteraLines([['', s >= 5 ? 'In Nek Lampir’s handwriting: “Keep a light by the door. The last one home might need it.”' : 'Nek Lampir carved a tiny frog into the corner of her desk.']]);
      } };
      case 'mantera_practice': return { label: 'Inspect the practice rune', fn: function () {
        self.toast(q.c13Learned ? 'Mantera Pantul stays with you wherever you travel.' : 'Speak to Nek Lampir at the desk south of the rune.', 'mantera_pantul');
      } };
      case 'mantera_suraya': return { label: s === 6 ? 'Return Batu Ikrar' : 'Speak to Suraya', fn: function () {
        if (s === 2) { self.startManteraDuel(); return; }
        if (s === 6) { self.finishMantera(); return; }
        self.manteraLines([['suraya13', s < 2 ? 'Nek Lampir is waiting for you at her old desk, across the courtyard.' : 'The ward is holding. We are opening the school again tomorrow.']]);
      } };
      case 'mantera_door': return { label: s >= 5 ? 'Enter the sealed vault' : 'Inspect the vault gate', fn: function () {
        if (s >= 5) self.goArea('manteraVault', undefined, 'up');
        else self.toast('The ward is still sealing this gate.', 'mantera_stone');
      } };
      case 'mantera_school_return': return { label: 'Return to the school courtyard', fn: function () {
        self.goArea('mantera', self.tilePx({ x: 31, y: 12 }), 'left');
      } };
      default: return objectAction.apply(this, arguments);
    }
  };

  var nekKey = W.nekKey;
  W.nekKey = function () { if (!school(this)) return nekKey.apply(this, arguments); };
  var following = W.following;
  W.following = function () { return school(this) || following.apply(this, arguments); };
  var groupOn = W.groupOn;
  W.groupOn = function (g) { return !g.manteraSeal && groupOn.apply(this, arguments); };
  var hurt = W.playerHurt;
  W.playerHurt = function (dmg, attacker) {
    if (!this.mantera || this.mantera.shield <= 0 || this.invuln > 0 || this.sleeping || this.leaving) return hurt.apply(this, arguments);
    this.breakManteraShield(this.player);
  };
  var die = W.enemyDie;
  W.enemyDie = function (e) {
    if (!this.mantera || ['golem13', 'suraya13', 'collector13'].indexOf(e.kind) < 0) return die.apply(this, arguments);
    if (e.dead) return;
    this.removeStormEnemy(e);
    this.fx.sparkle.explode(e.def.boss ? 22 : 8, e.spr.x, e.spr.y - 14);
    if (e.kind === 'suraya13') {
      this.clearManteraSpells();
      this.stormBonus(); story(this, 4);
    } else if (e.kind === 'collector13') {
      this.stormBonus(); story(this, 6);
      this.mantera.stonePending = true;
    }
  };

  Object.assign(W, {
    manteraLines: function (lines) {
      this.ui.say(lines.map(function (line) {
        return Object.assign({ text: line[1] }, LC.SPEAKERS[line[0]]);
      }));
    },
    manteraActor: function (where, key, anim) {
      var p = this.tilePx(where), actor = this.add.sprite(p.x, p.y, key).setOrigin(0.5, 1).setDepth(p.y);
      if (anim) actor.play(anim);
      return actor;
    },
    createMantera: function () {
      this.mantera = null;
      if (!C.ready(this.S)) return;
      var m = this.mantera = { shield: 0, clock: 0, cast: 1.4, bolts: [], copies: [], meteors: [], golems: [] };
      if (!school(this)) return;
      m.field = this.add.graphics().setDepth(5);
      m.effects = this.add.graphics().setDepth(1250);
      var s = step(this), self = this;
      if (!this.storm.jack) m.jack = this.manteraActor(this.area === 'mantera' ? { x: 21, y: 15 } : { x: 16, y: 15 }, 'npc_jack12_0', 'npc_jack12_idle');
      if (this.area === 'manteraVault') {
        if (s === 5) {
          m.vaultPending = true;
          m.suraya = this.manteraActor({ x: 12, y: 9 }, 'npc_suraya13_0', 'npc_suraya13_idle');
        }
        return;
      }
      if (s < 5) m.nek = this.manteraActor({ x: 11, y: 16 }, 'npc_lampir_0', 'npc_lampir_idle');
      else this.lightManteraMemorial();
      m.students = [{ x: 25, y: 6 }, { x: 21, y: 6 }, { x: 13, y: 10 }].map(function (p, i) {
        var actor = self.manteraActor(p, 'mantera_student_0', 'mantera_student_walk');
        actor.anims.pause();
        if (s >= 4 && s < C.end) actor.setVisible(false);
        self.tweens.add({ targets: actor, x: actor.x + (i === 1 ? -14 : 14), duration: 2100 + i * 400, yoyo: true, repeat: -1, hold: 400 });
        return actor;
      });
      if (s === 3) m.duelPending = true;
    },
    lightManteraMemorial: function () {
      var p = this.tilePx(C.desk);
      this.add.image(p.x + 4, p.y - 15, 'mantera_stone').setScale(0.42).setTint(0xffd78f).setDepth(p.y + 5);
      this.addLight(p.x + 4, p.y - 15, 0xffc078, 0.8, true);
    },
    pantulAvailable: function () {
      var q = this.S.quests;
      return !!(q.c13Learned || this.area === 'mantera' && step(this) === 1 && q.c13Lesson);
    },
    pantulLeft: function () {
      return this.S === LC.pantulState ? Math.max(0, (LC.pantulAt - Date.now()) / 1000) : 0;
    },
    castPantul: function () {
      var m = this.mantera;
      if (!m || !this.pantulAvailable() || this.pantulLeft() || this.ui.isBlocking() || this.cutscene || this.leaving || this.sleeping) return;
      LC.pantulState = this.S;
      LC.pantulAt = Date.now() + C.cooldown * 1000;
      m.shield = C.window;
      if (!m.gleam) m.gleam = this.add.image(0, 0, 'mantera_pantul').setDepth(1255);
      m.gleam.setPosition(this.player.x, this.player.y - 11).setAlpha(0.8).setScale(1.5).setVisible(true);
      LC.Audio.sfx('cast');
    },
    breakManteraShield: function (p) {
      this.mantera.shield = 0;
      this.fx.sparkle.explode(12, p.x, p.y - 8);
      this.ui.floatText(p.x, p.y - 23, 'Pantul!', '#baf8ec');
    },
    startManteraLesson: function () {
      this.S.quests.c13Lesson = true;
      LC.State.save();
      this.mantera.cast = 1.3;
      this.manteraLines(X.lesson);
    },
    startManteraDuel: function () {
      story(this, 3);
      this.refreshWhen();
      this.mantera.duelPending = true;
      this.manteraLines(X.challenge);
    },
    spawnManteraGolems: function () {
      var self = this, m = this.mantera;
      m.golems = C.court.map(function (p, i) {
        var foe = self.spawnEnemy({ kind: 'golem13', zone: { x0: p.x, y0: p.y, x1: p.x, y1: p.y } }, true);
        foe.atkCd = 1.4 + i * 0.2;
        foe.spr.setScale(0.35, 0.2).setAlpha(0.3);
        self.fx.smoke.explode(8, foe.spr.x, foe.spr.y);
        self.tweens.add({ targets: foe.spr, scale: 1, alpha: 1, duration: 460, ease: 'Back.easeOut' });
        return foe;
      });
      this.cameras.main.shake(250, 0.003);
    },
    spawnManteraBoss: function (kind) {
      var m = this.mantera, vault = kind === 'collector13', self = this;
      m.boss = this.spawnEnemy({ kind: kind, fixed: vault ? C.collector : C.suraya, manteraSeal: vault }, true);
      m.cast = 1.35;
      m.boss.spr.setVisible(true).setAlpha(0.3);
      this.tweens.add({ targets: m.boss.spr, alpha: 1, duration: 450 });
      if (vault) { this.manteraLines(X.vault); return; }
      m.trueShadow = this.add.image(m.boss.spr.x, m.boss.spr.y, 'mantera_true_shadow').setDepth(6);
      m.marks = C.court.slice(0, 3).concat([C.suraya]);
      m.real = 3;
      m.copies = m.marks.map(function (p, i) {
        var copy = self.manteraActor(p, 'suraya13_0', 'suraya13_walk').setAlpha(0.44).setTint(0xc2adfb);
        return copy.setVisible(i !== m.real);
      });
      this.manteraLines(X.illusions);
    },
    updateMantera: function (time, dt) {
      var m = this.mantera;
      if (!m || this.leaving || this.sleeping || !this.ui) return;
      var blocked = this.ui.isBlocking();
      if (!blocked) m.shield = Math.max(0, m.shield - dt);
      if (m.gleam) m.gleam.setPosition(this.player.x, this.player.y - 11).setAlpha(Math.min(0.8, m.shield * 3)).setVisible(m.shield > 0);
      if (!school(this)) return;
      if (!blocked) {
        m.clock += dt;
        this.advanceMantera(dt);
      }
      this.drawMantera(time);
    },
    advanceMantera: function (dt) {
      var m = this.mantera, s = step(this), q = this.S.quests;
      if (m.stonePending) {
        m.stonePending = false;
        this.clearManteraSpells();
        this.animateManteraStone();
        this.manteraLines(X.stone);
        return;
      }
      if (s === 4 && this.area === 'mantera') { this.updateManteraRift(dt); return; }
      if (this.cutscene) return;
      if (m.duelPending) {
        m.duelPending = false;
        if (q.c13Golems) this.spawnManteraBoss('suraya13');
        else this.spawnManteraGolems();
        return;
      }
      if (m.vaultPending) {
        m.vaultPending = false;
        this.spawnManteraBoss('collector13');
        return;
      }
      if (s === 3 && m.golems.length && m.golems.every(function (e) { return e.dead; })) {
        m.golems = [];
        q.c13Golems = true;
        LC.State.save();
        this.spawnManteraBoss('suraya13');
        return;
      }
      this.updateManteraBolts(dt);
      this.updateManteraMeteors(dt);
      if (s === 1 && q.c13Lesson) this.castManteraPractice(dt);
      if (m.boss && !m.boss.dead) this.castManteraBoss(dt);
    },
    castManteraPractice: function (dt) {
      var m = this.mantera, rune = this.tilePx(C.rune), d = distance(this.player, rune);
      if (d < 34 || d > 94) { m.cast = Math.max(0.75, m.cast); return; }
      m.cast -= dt;
      if (m.cast <= 0) {
        this.launchManteraBolt(rune.x, rune.y, null);
        m.cast = 3.15;
      }
    },
    castManteraBoss: function (dt) {
      var m = this.mantera, e = m.boss, p = e.spr;
      if (distance(this.player, p) > 188) return;
      var cosmic = e.hp <= e.def.hp * 0.57;
      if (cosmic && !m.cosmic) {
        m.cosmic = true;
        this.toast(e.kind === 'suraya13' ? 'Suraya calls down the stars. Move out of the marked circles!' : 'The Collector tears the vault ward. Watch the floor!', 'mantera_stone');
        this.cameras.main.shake(340, 0.005);
      }
      m.cast -= dt;
      if (m.cast > 0) return;
      this.launchManteraBolt(p.x, p.y, e);
      m.cast = cosmic ? 2.55 : 3.25;
      m.turn = (m.turn || 0) + 1;
      if (cosmic) {
        m.meteors.push({ x: this.player.x, y: this.player.y, time: 1.05 });
        if (m.turn % 2 === 0) m.meteors.push({ x: p.x, y: p.y + 22, time: 1.42 });
      }
    },
    launchManteraBolt: function (x, y, source) {
      var p = this.player, d = Math.hypot(p.x - x, p.y - y) || 1;
      var speed = source ? 111 : 78, m = this.mantera;
      m.bolts.push({ x: x, y: y, ox: x, oy: y, vx: (p.x - x) / d * speed, vy: (p.y - y) / d * speed,
        length: 2.65, back: false, source: source });
      this.fx.sparkle.explode(6, x, y - 10);
    },
    updateManteraBolts: function (dt) {
      var self = this, m = this.mantera, p = this.player;
      m.bolts = m.bolts.filter(function (b) {
        b.length -= dt;
        if (b.length <= 0 || b.source && b.source.dead) return false;
        if (b.back) {
          var dest = b.source ? b.source.spr : { x: b.ox, y: b.oy }, d = distance(b, dest), stride = 235 * dt;
          if (d <= stride + 6) { self.hitManteraSource(b, dest); return false; }
          b.x += (dest.x - b.x) / d * stride;
          b.y += (dest.y - b.y) / d * stride;
          return true;
        }
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        if (distance(b, p) > 10) return true;
        if (m.shield > 0) {
          self.breakManteraShield(p);
          b.back = true; b.length = 1.6;
          return true;
        }
        if (b.source) self.playerHurt(b.source.def.dmg, { spr: { x: b.ox, y: b.oy } });
        else self.fx.sparkle.explode(5, p.x, p.y - 9);
        return false;
      });
    },
    hitManteraSource: function (b, dest) {
      this.fx.sparkle.explode(12, dest.x, dest.y - 12);
      var q = this.S.quests, m = this.mantera, e = b.source;
      if (!e) {
        if (step(this) !== 1) return;
        q.c13Reflected = (q.c13Reflected || 0) + 1;
        this.ui.floatText(dest.x, dest.y - 26, q.c13Reflected + ' / 3', '#baf8ec');
        if (q.c13Reflected >= 3) {
          q.c13Learned = true;
          story(this, 2);
          this.manteraLines(X.trained);
        } else LC.State.save();
        return;
      }
      if (e.g.manteraSeal) {
        e.g.manteraSeal = false; e.away = false; e.light.base = 0.85;
        this.toast('The Collector’s seal breaks!', 'mantera_pantul');
      }
      e.hp -= 21;
      e.hurtT = 0.24;
      e.spr.setTintFill(MIRROR);
      this.ui.floatText(dest.x, dest.y - 25, '21', '#baf8ec');
      if (e.hp <= 0) this.enemyDie(e);
      else if (e.kind === 'suraya13') this.shiftManteraCopies(m);
    },
    shiftManteraCopies: function (m) {
      var e = m.boss, i = m.real, next = (i + 1) % m.marks.length, dest = this.tilePx(m.marks[next]);
      this.fx.smoke.explode(12, e.spr.x, e.spr.y - 8);
      m.copies[i].setVisible(true);
      m.copies[next].setVisible(false);
      e.spr.setPosition(dest.x, dest.y).setDepth(dest.y);
      e.light.img.setPosition(dest.x, dest.y - 8);
      m.real = next;
    },
    updateManteraMeteors: function (dt) {
      var self = this, m = this.mantera;
      m.meteors = m.meteors.filter(function (mark) {
        var old = mark.time;
        mark.time -= dt;
        if (old > 0 && mark.time <= 0) {
          self.fx.sparkle.explode(16, mark.x, mark.y);
          if (distance(mark, self.player) < 24) self.playerHurt(15, { spr: mark });
          self.cameras.main.shake(150, 0.003);
        }
        return mark.time > -0.19;
      });
    },
    clearManteraSpells: function () {
      var m = this.mantera;
      m.bolts = []; m.meteors = []; m.cosmic = false;
      m.copies.forEach(function (s) { s.destroy(); });
      m.copies = [];
      if (m.trueShadow) { m.trueShadow.destroy(); m.trueShadow = null; }
    },
    updateManteraRift: function (dt) {
      var self = this, m = this.mantera, anchor = this.tilePx(C.rift);
      if (!m.rift) {
        this.clearManteraSpells();
        this.cutscene = true;
        m.rift = { x: anchor.x, y: anchor.y, time: 0 };
        m.nek.anims.resume();
        this.tweens.add({ targets: m.nek, x: anchor.x, y: anchor.y + 31, duration: 950, onUpdate: function () { m.nek.setDepth(m.nek.y); } });
        m.students.forEach(function (student, i) {
          self.tweens.killTweensOf(student);
          student.setVisible(true).anims.resume();
          self.tweens.add({ targets: student, y: 344 + i * 8, x: 134 + i * 18, duration: 1800 + i * 330, ease: 'Sine.easeInOut',
            onUpdate: function () { student.setDepth(student.y); }, onComplete: function () { student.setVisible(false); } });
        });
        this.manteraLines(X.rift);
        return;
      }
      m.rift.time += dt;
      if (m.rift.time < 2.8) return;
      this.fx.sparkle.explode(32, m.nek.x, m.nek.y - 13);
      this.cameras.main.flash(520, 202, 180, 255);
      this.tweens.add({ targets: m.nek, alpha: 0, scaleY: 0.3, duration: 500 });
      m.rift = null;
      this.cutscene = false;
      this.S.quests.c13NekGone = true;
      story(this, 5);
      this.lightManteraMemorial();
      this.manteraLines(X.sacrifice);
    },
    animateManteraStone: function () {
      var p = this.tilePx(C.collector), jack = this.storm.jack ? this.storm.jack.spr : this.mantera.jack;
      var stone = this.add.image(p.x, p.y - 35, 'mantera_stone').setDepth(1250);
      this.tweens.add({ targets: stone, x: jack.x, y: jack.y - 12, rotation: Math.PI * 2, duration: 760, ease: 'Sine.easeInOut',
        onComplete: function () { stone.destroy(); } });
    },
    finishMantera: function () {
      var p = this.tilePx(C.suraya);
      story(this, C.end);
      this.fx.sparkle.explode(32, p.x, p.y - 17);
      this.cameras.main.flash(500, 181, 231, 201);
      this.manteraLines(X.finish);
    },
    drawMantera: function (time) {
      var m = this.mantera, g = m.effects, floor = m.field, p = this.tilePx(C.rune);
      if (!g) return;
      g.clear(); floor.clear();
      if (this.area === 'mantera' && step(this) === 1 && this.S.quests.c13Lesson) {
        floor.lineStyle(1, VIOLET, 0.46);
        floor.strokeCircle(p.x, p.y, 35);
        g.lineStyle(1, VIOLET, 0.5 + 0.3 * Math.sin(time / 150));
        g.strokeCircle(p.x, p.y - 9, 10 + Math.max(0, 1 - m.cast) * 8);
      }
      if (m.boss && !m.boss.dead) {
        var actor = m.boss.spr;
        if (m.trueShadow) {
          m.trueShadow.setPosition(actor.x, actor.y).setAlpha(0.86 + 0.14 * Math.sin(time / 210));
          m.copies.forEach(function (s, i) { s.setAlpha(0.35 + 0.14 * Math.sin(time / 160 + i)); });
        }
        if (m.boss.g.manteraSeal) {
          g.lineStyle(2, VIOLET, 0.8); g.strokeEllipse(actor.x, actor.y - 14, 31 + 4 * Math.sin(time / 180), 41);
          g.lineStyle(1, 0xf5d9f9, 0.55); g.strokeEllipse(actor.x, actor.y - 14, 39, 47);
        }
        if (m.suraya) {
          g.lineStyle(2, MIRROR, 0.45); g.strokeEllipse(m.suraya.x, m.suraya.y - 8, 34 + 3 * Math.sin(time / 140), 28);
          g.lineStyle(1, VIOLET, 0.35); g.strokeEllipse(actor.x, actor.y, 96, 52 + 5 * Math.sin(time / 180));
        }
        if (m.cast < 0.65) {
          var r = 5 + Math.max(0, m.cast) * 19;
          g.lineStyle(2, VIOLET, 0.75); g.strokeCircle(actor.x, actor.y - 10, r);
        }
        if (m.cosmic) this.drawManteraStars(floor, actor, time);
      }
      m.bolts.forEach(function (b) {
        var col = b.back ? MIRROR : VIOLET;
        g.fillStyle(col, 0.22); g.fillCircle(b.x, b.y - 9, 11);
        g.fillStyle(col, 0.92); g.fillCircle(b.x, b.y - 9, 5);
        g.fillStyle(0xfff5e6, 1); g.fillCircle(b.x, b.y - 9, 2);
      });
      m.meteors.forEach(function (mark) {
        floor.fillStyle(STAR, mark.time > 0 ? 0.24 : 0.8); floor.fillCircle(mark.x, mark.y, 24);
        floor.lineStyle(2, STAR, 0.9); floor.strokeCircle(mark.x, mark.y, 24);
        if (mark.time <= 0) {
          g.lineStyle(7, 0xffdbc2, 0.7); g.lineBetween(mark.x + 42, mark.y - 90, mark.x, mark.y);
        }
      });
      if (m.rift) this.drawManteraRift(g, m.rift, time);
    },
    drawManteraStars: function (g, actor, time) {
      g.fillStyle(0x34204f, 0.2); g.fillCircle(actor.x, actor.y, 83);
      for (var i = 0; i < 12; i++) {
        var a = time / 1450 + i * Math.PI / 6, r = 47 + (i % 3) * 12;
        var x = actor.x + Math.cos(a) * r, y = actor.y - 16 + Math.sin(a) * r * 0.65;
        g.fillStyle(i % 2 ? VIOLET : STAR, 0.72); g.fillRect(x - 1, y - 3, 2, 6); g.fillRect(x - 3, y - 1, 6, 2);
      }
    },
    drawManteraRift: function (g, r, time) {
      var x = r.x, y = r.y - 15, pulse = 24 + Math.sin(time / 145) * 6;
      g.fillStyle(0x35284d, 0.9); g.fillEllipse(x, y, pulse * 2, 72);
      g.lineStyle(3, VIOLET, 0.9); g.strokeEllipse(x, y, pulse * 2, 72);
      for (var i = 0; i < 8; i++) {
        var a = time / 355 + i * Math.PI / 4;
        g.lineStyle(1, i % 2 ? VIOLET : STAR, 0.72);
        g.lineBetween(x + Math.cos(a) * 9, y + Math.sin(a) * 12, x + Math.cos(a + 0.4) * 52, y + Math.sin(a + 0.4) * 42);
      }
      var n = this.mantera.nek;
      g.lineStyle(2, MIRROR, 0.9); g.strokeEllipse(n.x, n.y - 13, 34 + Math.sin(time / 90) * 5, 44);
    }
  });
})(window.LC);
