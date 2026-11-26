/* v3.18: the fifth Bunian door, Pintu Cermin (the user asked for "the evil version of themselves"). Behind it a tall
 * mirror stands in the Hall of Mirrors, and out of it steps Bayang Diri: you, in shadow. It looks like you, fights with
 * your best weapon and uses every combat skill YOU have learned, at your level + 10. Each win teaches it: +2 levels,
 * more health and harder hits, and it casts sooner (B.mirrorRound in bunian-trials.js).
 * Its skills, each only if you have learned it yourself:
 *  - Sumpahan Batu: a ring around it; caught inside, you turn to stone for a moment (its next blow cracks you, x1.5)
 *  - Mantera Suria: dark suns that seek you (your own Mantera Pantul, P, sends them back at double strength)
 *  - Langkah Semaun: it leaps at you (or away, when it is badly hurt)
 *  - Angin Bualang: a ring of wind that hurts and flings you back, dizzy; Sang Bualang: a dark whirlwind that hunts you
 *  - Nek Lampir: Serbuk Lada thrown where you stand (you sneeze and slow down); Bulatan Gelap, a herb circle that halves
 *    the damage it takes while it stands inside
 *  - Lagu Mayang: a ring of song; caught inside, you sway in a trance (very slow)
 *  - Mantera Pantul: it sends your own suns back at you; Restu Ibu: once a fight, it rises again at half health
 * In the Hall of Mirrors, the twin can call shadow copies of your unlocked combat companions.
 * Skills are telegraphed by a mark on the floor or a visible wind-up. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var W = LC.WorldScene.prototype, U = LC.UIScene.prototype, B = LC.BunianTrials;
  var DOOR = B.doors.find(function (d) { return d.mirror; }), TWIN = DOOR.boss[0];
  var DIRV = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] };
  var ANG = { right: 0, down: 90, left: 180, up: -90 };
  var VIOLET = 0x9a5cff, SAYC = '#ff9aae';
  var SUMMON_INTERVAL = 8, ALLY_WINDUP = 0.85;
  var ALLIES = {
    badang: { name: 'Badang', tex: 'npc_badangK_0', anim: 'npc_badangK_idle' },
    jack: { name: 'Jack Separaw', tex: 'npc_jack12_0', anim: 'npc_jack12_idle' },
    lada: { name: 'Nek Lampir', tex: 'npc_lampir_0', anim: 'npc_lampir_idle' },
    bualang: { name: 'Sang Bualang', tex: 'npc_bualang_0', anim: 'bualang_fly' },
    naga: { name: 'Naga Kecil', tex: 'naga_ride_side_0' },
    sekawan: { name: 'Kudin, Leman and Sani' }
  };
  var NAMES = { batu: 'Sumpahan Batu', suria: 'Mantera Suria', langkah: 'Langkah Semaun', angin: 'Angin Bualang', bualang: 'Sang Bualang',
    lada: 'Serbuk Lada', bulatan: 'Bulatan Hijau', lagu: 'Lagu Mayang', pantul: 'Mantera Pantul', restu: 'Restu Ibu' };
  var X = {
    intro: ['A tall mirror stands in the middle of the hall. Your reflection looks back at you... and then it blinks. You did not.',
      'Hello, me. Every step you took, I took ten more. Every skill you learned, I learned too.',
      'Only one of us walks out of this hall. Shall we find out which?'],
    again: ['The mirror has mended itself. Your reflection is already waiting on the other side of the glass.'],
    rematch: ['Back again? I remember every blow you landed. I will not fall for the same tricks twice.',
      'Each time you beat me, I learn. Each time, I come a little closer to being the real one.',
      'You got stronger. So did I. That is how mirrors work.'],
    half: ['You hit like me. Of course you do.', 'Not bad... for a reflection of a reflection.', 'Is that all I am?'],
    revive: 'Restu Ibu! Mak prays for me too.',
    dying: ['...You win. This time.', 'I will remember this.', 'Next time, I will be ready.']
  };
  function ADD() { return Phaser.BlendModes.ADD; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function keeperLine(text) { return { name: 'Penjaga Pintu', portrait: 'bunian_trial_keeper', text: text }; }

  function availableAllies(S, skills) {
    var allies = [];
    if (LC.hasBadang()) allies.push('badang');
    if (LC.C12.step(S) >= LC.C12.end) allies.push('jack');
    if (skills.indexOf('lada') >= 0) allies.push('lada');
    if (skills.indexOf('bualang') >= 0) allies.push('bualang');
    if (LC.hasNagaRide() && LC.State.count('seruling_naga')) allies.push('naga');
    if (skills.indexOf('sekawan') >= 0) allies.push('sekawan');
    return allies;
  }

  function summonAlly(scene, id, x, y) {
    var ally = ALLIES[id];
    var spr = scene.add.sprite(x, y, ally.tex).setOrigin(0.5, 1).setDepth(y).setTint(0xb282fc);
    if (ally.anim) spr.play(ally.anim);
    scene.fx.smoke.explode(8, x, y - 8);
    return spr;
  }

  function dismissAlly(scene, spr, delay) {
    scene.tweens.add({ targets: spr, delay: delay || 0, alpha: 0, duration: 330, onComplete: function () { spr.destroy(); } });
  }

  // the combat skills you have learned, which are the ones your shadow can use
  B.mirrorSkills = function (S) {
    var q = (S && S.quests) || {}, out = [];
    if (LC.hasStone()) out.push('batu');
    if (LC.hasSuria && LC.hasSuria()) out.push('suria');
    if (LC.hasLangkah && LC.hasLangkah()) out.push('langkah');
    if (LC.hasBualang && LC.hasBualang()) out.push('angin', 'bualang');
    if (LC.hasNek && LC.hasNek()) out.push('lada', 'bulatan');
    if (LC.hasLagu && LC.hasLagu()) out.push('lagu');
    if (q.c13Learned) out.push('pantul');
    if (LC.hasRestu()) out.push('restu');
    return out;
  };
  B.mirrorSkillNames = function (list) {
    var seen = {};
    return list.map(function (k) { return k === 'angin' || k === 'bualang' ? 'Sang Bualang and Angin Bualang' : k === 'lada' || k === 'bulatan' ? 'Nek Lampir\'s pepper and herb circle' : NAMES[k]; })
      .filter(function (n) { if (seen[n]) return false; seen[n] = true; return true; });
  };
  function mirrorOf(scene) { var t = scene.bunianTrial; return t && t.door.mirror ? t.mirror : null; }

  // ================================================================ your shadow's look: your own frames, darkened, red-eyed
  W.ensureMirrorArt = function () {
    var scene = this, pc = this.pc || 0, pk = 'mirror' + pc, wk = 'mirrorwalk' + pc, src = LC.Art.plKey(pc);
    ['down', 'up', 'side'].forEach(function (d) {
      for (var f = 0; f < 3; f++) (function (f) {
        var key = pk + '_' + d + '_' + f;
        if (scene.textures.exists(key)) return;
        var from = scene.textures.get(src + '_' + d + '_' + f).getSourceImage(), w = from.width, h = from.height;
        LC.Art.make(scene, key, w, h, function (p, ctx) {
          ctx.drawImage(from, 0, 0);
          var img = ctx.getImageData(0, 0, w, h), px = img.data;
          for (var i = 0; i < px.length; i += 4) {
            if (!px[i + 3]) continue;
            var l = Math.pow((0.3 * px[i] + 0.59 * px[i + 1] + 0.11 * px[i + 2]) / 255, 1.1);
            px[i] = 26 + l * 190; px[i + 1] = 10 + l * 104; px[i + 2] = 52 + l * 190;   // you, in violet shadow
          }
          ctx.putImageData(img, 0, 0);
          var eyes = LC.Art.PLAYER_EYES ? LC.Art.PLAYER_EYES[d] : (d === 'down' ? [[6, 7], [9, 7]] : d === 'side' ? [[9, 7]] : []);
          ctx.fillStyle = '#ff3b4f'; eyes.forEach(function (e) { ctx.fillRect(e[0], e[1], 1, 1); });
        });
      })(f);
    });
    ['down', 'up', 'side'].forEach(function (d) {
      var frames = [1, 0, 2, 0].map(function (f) { return { key: pk + '_' + d + '_' + f }; });
      if (!scene.anims.exists(wk + '_' + d)) scene.anims.create({ key: wk + '_' + d, frames: frames, frameRate: 8, repeat: -1 });
      if (d === 'down' && !scene.anims.exists(pk + '_down_walk')) scene.anims.create({ key: pk + '_down_walk', frames: frames, frameRate: 8, repeat: -1 });
    });
    return { pk: pk, wk: wk };
  };

  // ================================================================ entering: the mirror, the words, then the fight
  var createTrial = W.createBunianTrial;
  W.createBunianTrial = function (door) {
    if (!door.mirror) return createTrial.apply(this, arguments);
    var self = this, keys = this.ensureMirrorArt(), at = this.tilePx(B.bossAt);
    var t = this.bunianTrial = { door: door, round: B.round(this.S, door), clears: B.clearCount(this.S, door), phase: 'mirror', timer: 0, marks: [], minions: [],
      art: this.add.graphics().setDepth(1250) };
    var skills = B.mirrorSkills(this.S);
    t.mirror = { pk: keys.pk, wk: keys.wk, skills: skills, allies: availableAllies(this.S, skills), nextAlly: 0, allyCd: 0, lampirCircle: false,
      orbs: [], whirl: null, zone: null, last: null, hold: 0, pending: null,
      stoneT: 0, tranceT: 0, slowT: 0, shield: 0, pantulCd: 2, revived: false, saidHalf: false, noteT: 0, g: this.add.graphics().setDepth(1249),
      glass: this.add.image(at.x, at.y - 4, door.texture).setOrigin(0.5, 1).setDepth(at.y - 30) };
    this.addLight(at.x, at.y - 34, door.color, 1.3, true);
    this.time.delayedCall(650, function () { if (self.bunianTrial === t && !self.leaving) self.mirrorIntro(t); });
  };
  W.mirrorIntro = function (t) {
    var self = this, m = t.mirror, por = m.pk + '_down_0';
    var who = function (text) { return { name: TWIN, portrait: por, text: text }; };
    var wins = t.clears, losses = this.S.quests.bunianMirrorDefeats || 0;
    var record = who('The glass remembers. You\'ve won ' + wins + (wins === 1 ? ' time' : ' times') +
      ' and lost ' + losses + (losses === 1 ? ' time' : ' times') + ' against me.');
    var lines = wins || losses
      ? [{ text: X.again[0] }, record, who(wins ? pick(X.rematch) : 'Back on your feet, I see.')]
      : [{ text: X.intro[0] }, who(X.intro[1]), record, who(X.intro[2])];
    this.ui.say(lines, { onDone: function () { if (self.bunianTrial === t && !self.leaving) self.mirrorSpawn(t); } });
  };
  W.mirrorSpawn = function (t) {
    var door = t.door, m = t.mirror;
    LC.ENEMIES[door.bossKind].texture = m.pk + '_down';
    var e = t.boss = this.spawnBunianTrialFoe(door.bossKind, B.bossAt, door, t.round.boss), s = e.spr;
    t.phase = 'boss'; t.timer = 2.2;
    e.light.base = 0.35; e.light.img.setTint(VIOLET);   // a soft glow, so you can still see it
    m.aura = this.add.image(s.x, s.y - 1, 'glow').setTint(0x1a0624).setAlpha(0.7).setScale(0.55, 0.22).setDepth(s.y - 1);
    m.px = s.x; m.py = s.y; m.lastHp = e.hp;
    LC.Audio.sfx('blink');
    this.fx.smoke.explode(14, s.x, s.y - 8);
    this.tweens.add({ targets: m.glass, alpha: 0.55, duration: 500 });
    this.cameras.main.shake(200, 0.003);
  };

  // ================================================================ the fight, each frame
  var updateBoss = W.updateBunianBoss;
  W.updateBunianBoss = function (t, dt) {
    if (!t.door.mirror) return updateBoss.apply(this, arguments);
    this.updateMirrorTwin(t, dt);
  };
  W.updateMirrorTwin = function (t, dt) {
    var self = this, e = t.boss, m = t.mirror, p = this.player, now = this.time.now;
    if (!e) return;
    var s = e.spr;
    this.mirrorPlayerFx(t, dt, now);
    if (!e.dead) this.mirrorAnimate(t);
    if (m.hold > 0 && (e.stoneT > 0 || e.tranceT > 0)) {   // your stone curse or your song breaks its spell
      m.hold = 0; m.pending = null;
      t.marks = t.marks.filter(function (k) { return !k.follows; });
      this.ui.floatText(s.x, s.y - 24, 'Interrupted!', '#cfe6ff');
    }
    if (m.hold > 0) {   // casting: stand still
      m.hold -= dt; s.x = m.hx; s.y = m.hy; e.windT = 0; e.strikeT = 0; e.atkCd = Math.max(e.atkCd, 0.3);
      if (m.hold <= 0 && m.pending) { var k = m.pending; m.pending = null; this.mirrorRelease(t, k); }
    }
    t.marks = t.marks.filter(function (k) {
      var before = k.left;
      k.left -= dt;
      if (k.follows && before > 0) { k.x = s.x; k.y = s.y; }
      if (k.jet && before > 0) {
        var progress = 1 - Math.max(0, k.left) / ALLY_WINDUP;
        k.jet.setPosition(Phaser.Math.Linear(k.jetX, k.x, progress), Phaser.Math.Linear(k.jetY, k.y - 4, progress));
      }
      if (before > 0 && k.left <= 0) self.mirrorImpact(t, k);
      return k.left > -0.28;
    });
    if (t.marks.some(function (k) { return k.kind === 'lagu' && k.left > 0; }) && (m.noteT -= dt) <= 0 && this.note9) {
      m.noteT = 0.22; this.note9(s.x + (Math.random() - 0.5) * 30, s.y - 14 - Math.random() * 10, VIOLET);
    }
    this.updateMirrorOrbs(t, dt);
    this.updateMirrorWhirl(t, dt);
    this.updateMirrorZone(t, dt);
    if (e.dead || t.ending || this.leaving) return;
    this.mirrorReflect(t, dt);
    if (e.strikeT > 0 && !m.swung) { m.swung = true; this.mirrorSwing(t); } else if (e.strikeT <= 0) m.swung = false;
    if (!m.saidHalf && e.hp < e.def.hp * 0.5) { m.saidHalf = true; this.ui.floatText(s.x, s.y - 26, pick(X.half), SAYC); }
    var busy = e.stoneT > 0 || e.tranceT > 0 || e.windT > 0 || e.strikeT > 0 || m.hold > 0 || m.stun > 0;
    if (m.stun > 0) m.stun -= dt;
    if (m.allyCd > 0) m.allyCd -= dt;
    t.timer -= dt;
    if (t.timer <= 0 && !busy) {
      var sk = this.mirrorPick(t);
      if (sk) this.mirrorCast(t, sk);
      t.timer = (e.hp < e.def.hp * 0.45 ? t.round.enragedCooldown : t.round.specialCooldown) * (0.85 + Math.random() * 0.3);
    }
    m.lastHp = e.hp;
  };
  // it walks the way it moves (or faces you when it stands)
  W.mirrorAnimate = function (t) {
    var e = t.boss, s = e.spr, m = t.mirror, p = this.player;
    var dx = s.x - m.px, dy = s.y - m.py;
    m.px = s.x; m.py = s.y;
    if (m.aura) m.aura.setPosition(s.x, s.y - 1).setDepth(s.y - 1);
    if (e.light && e.light.base > 0.35) e.light.base = 0.35;   // (a boss's light comes back bright after the stone curse)
    if (e.stoneT > 0) return;
    var moving = Math.hypot(dx, dy) > 0.12 && m.hold <= 0, fx = moving ? dx : p.x - s.x, fy = moving ? dy : p.y - s.y;
    var dir = Math.abs(fx) > Math.abs(fy) ? (fx < 0 ? 'left' : 'right') : (fy < 0 ? 'up' : 'down'), key = dir === 'left' || dir === 'right' ? 'side' : dir;
    if (moving) s.play(m.wk + '_' + key, true);
    else if (e.windT <= 0) { s.stop(); s.setTexture(m.pk + '_' + key + '_0'); }
    s.setFlipX(dir === 'left');
    m.dir = dir;
  };
  // its blow: your own best weapon, swung at you
  W.mirrorSwing = function (t) {
    var self = this, e = t.boss, s = e.spr, p = this.player, w = t.round.weapon;
    var dx = p.x - s.x, dy = p.y - s.y, dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down'), d = DIRV[dir];
    LC.Audio.sfx('swing');
    if (w) {
      var ang = ANG[dir], from = dir === 'left' || dir === 'up' ? ang + 70 : ang - 70, to = dir === 'left' || dir === 'up' ? ang - 70 : ang + 70;
      var tex = w.icon || 'i_' + w.id;
      if (!this.textures.exists(tex)) tex = '__MISSING';
      var img = this.add.image(s.x + d[0] * 3, s.y - 9, tex).setVisible(tex !== '__MISSING').setOrigin(0.15, 0.85).setScale(0.85).setTint(0xb48cff)
        .setDepth(dir === 'up' ? s.y - 1 : s.y + 1).setAngle(from + 45);
      this.tweens.add({ targets: img, angle: to + 45, duration: 150, ease: 'Quad.easeOut', onComplete: function () {
        self.tweens.add({ targets: img, alpha: 0, duration: 90, onComplete: function () { img.destroy(); } });
      } });
    }
    var arc = this.add.image(s.x + d[0] * 12, s.y - 8 + d[1] * 12, dir === 'left' || dir === 'right' ? 'slash_right' : 'slash_' + dir)
      .setDepth(s.y + 2).setFlipX(dir === 'left').setTint(0xff5a7a).setBlendMode(ADD()).setAlpha(0.9);
    this.tweens.add({ targets: arc, alpha: 0, scale: 1.25, duration: 200, onComplete: function () { arc.destroy(); } });
  };

  // ================================================================ choosing and casting a skill
  W.mirrorPick = function (t) {
    var m = t.mirror, e = t.boss, s = e.spr, p = this.player, d = Math.hypot(p.x - s.x, p.y - s.y), low = e.hp < e.def.hp * 0.3, opts = [];
    if (m.allies && m.allies.length && m.allyCd <= 0) {
      var id = m.allies[m.nextAlly++ % m.allies.length];
      m.allyCd = SUMMON_INTERVAL;
      if (id !== 'lada') return id;
      m.lampirCircle = !m.lampirCircle;
      return m.lampirCircle ? 'lada' : 'bulatan';
    }
    m.skills.forEach(function (k) {
      if (k === 'pantul' || k === 'restu') return;                     // these two work by themselves
      if (m.allies && (ALLIES[k] || k === 'bulatan')) return;          // companions use their own turn in the hall
      if (k === 'bualang' && m.whirl || k === 'bulatan' && m.zone) return;
      if (k === m.last && m.skills.length > 3) return;
      var w = 1;
      if (k === 'batu' || k === 'angin' || k === 'lagu') w = d < 75 ? 2.2 : 0.35;
      else if (k === 'suria' || k === 'lada') w = d > 55 ? 2 : 0.8;
      else if (k === 'langkah') w = d > 90 || low && d < 40 ? 2 : 0.5;
      else if (k === 'bulatan') w = low ? 2 : 0.8;
      opts.push([k, w]);
    });
    if (!opts.length) return null;
    var r = Math.random() * opts.reduce(function (a, o) { return a + o[1]; }, 0);
    for (var i = 0; i < opts.length; i++) { r -= opts[i][1]; if (r <= 0) return opts[i][0]; }
    return opts[opts.length - 1][0];
  };
  W.mirrorCast = function (t, k) {
    var self = this, m = t.mirror, e = t.boss, s = e.spr, p = this.player, cl = t.clears;
    var say = function (txt) { self.ui.floatText(s.x, s.y - 24, txt, SAYC); };
    var hold = function (sec, pending) { m.hold = sec; m.hx = s.x; m.hy = s.y; m.pending = pending || null; e.restT = 0; };
    m.last = k;
    switch (k) {
      case 'badang':
      case 'jack':
      case 'naga':
        say(ALLIES[k].name + '!');
        this.mirrorAllyStrike(t, k);
        break;
      case 'batu':
        say('Sumpahan Batu!'); LC.Audio.sfx('cast');
        t.marks.push({ kind: k, x: s.x, y: s.y, r: Math.min(84, 64 + cl * 4), follows: true, left: 0.9 }); hold(0.9);
        break;
      case 'suria':
        say('Mantera Suria!'); LC.Audio.sfx('cast'); hold(0.5, 'suria');
        s.setTintFill(0xc79bff); this.time.delayedCall(140, function () { if (!e.dead && e.hurtT <= 0) s.clearTint(); });
        this.fx.sparkle.explode(8, s.x, s.y - 12);
        break;
      case 'langkah': this.mirrorDash(t); break;
      case 'angin':
        say('Angin Bualang!'); LC.Audio.sfx('cast');
        t.marks.push({ kind: k, x: s.x, y: s.y, r: 80, follows: true, left: 0.95 }); hold(0.95);
        break;
      case 'bualang': {
        say('Bayang Bualang!'); LC.Audio.sfx('wind');
        var x = m.allies && this.blockedAt(s.x + 12, s.y) ? s.x : s.x + 12;
        var wh = this.add.sprite(x, s.y, 'puting_0').setOrigin(0.5, 1).setTint(0x7a4a9a).setAlpha(0);
        if (this.anims.exists('puting_spin')) wh.play('puting_spin');
        this.tweens.add({ targets: wh, alpha: 0.85, duration: 300 });
        var ally = m.allies ? summonAlly(this, k, wh.x, wh.y - 3) : null;
        m.whirl = { spr: wh, ally: ally, t: 7, cd: 0.8 };
        break;
      }
      case 'lada': {
        say('Serbuk Lada!'); LC.Audio.sfx('toss');
        var from = m.allies ? this.mirrorLampir(t) : s;
        var tx = p.x, ty = p.y, puff = this.add.image(from.x, from.y - 12, 'serbuk_lada').setDepth(9550);
        this.tweens.add({ targets: puff, x: tx, duration: 550 });
        this.tweens.add({ targets: puff, y: { from: from.y - 12, to: ty - 6 }, duration: 550, ease: 'Sine.easeIn', onComplete: function () { puff.destroy(); } });
        t.marks.push({ kind: k, x: tx, y: ty, r: 22, left: 0.55 });
        break;
      }
      case 'bulatan':
        say('Bulatan Hijau!'); LC.Audio.sfx('herbs');
        if (m.allies) this.mirrorLampir(t);
        m.zone = { x: s.x, y: s.y - 2, r: 36, t: 6 };
        this.fx.leaf.explode(10, s.x, s.y - 4);
        break;
      case 'lagu':
        say('Lagu Mayang!'); LC.Audio.sfx('lagu9');
        t.marks.push({ kind: k, x: s.x, y: s.y, r: 96, follows: true, left: 1.3 }); hold(1.3);
        break;
    }
  };
  W.mirrorLampir = function (t) {
    var s = t.boss.spr, x = s.x + (s.flipX ? 16 : -16);
    var spr = summonAlly(this, 'lada', this.blockedAt(x, s.y) ? s.x : x, s.y);
    spr.setFlipX(this.player.x < spr.x);
    dismissAlly(this, spr, 1300);
    return spr;
  };
  W.mirrorAllyStrike = function (t, id) {
    var boss = t.boss.spr, p = this.player, dx = p.x - boss.x, dy = p.y - boss.y, dist = Math.hypot(dx, dy) || 1;
    var x = p.x - dx * Math.min(1, 76 / dist), y = p.y - dy * Math.min(1, 76 / dist);
    var spr = summonAlly(this, id, x, y).setFlipX(dx < 0);
    var mark = { kind: id, x: p.x, y: p.y, r: id === 'badang' ? 25 : 18, left: ALLY_WINDUP, ally: spr };
    LC.Audio.sfx(id === 'naga' ? 'splash' : 'blink');
    if (id === 'naga') {
      mark.jetX = x; mark.jetY = y - 8;
      mark.jet = this.add.image(x, mark.jetY, 'jet8').setDepth(9550).setTint(VIOLET).setBlendMode(ADD())
        .setRotation(Math.atan2(mark.y - 4 - mark.jetY, mark.x - mark.jetX));
    } else {
      var destX = p.x - dx / dist * 9, destY = p.y - dy / dist * 9;
      this.tweens.add({ targets: spr, x: destX, y: destY, duration: (ALLY_WINDUP - 0.12) * 1000, ease: 'Quad.easeOut',
        onUpdate: function () { spr.setDepth(spr.y); } });
    }
    t.marks.push(mark);
  };
  W.mirrorRelease = function (t, k) {
    if (k !== 'suria') return;
    var e = t.boss, s = e.spr, p = this.player, m = t.mirror, L = e.def.level, n = LC.suriaCount(L), dmg = Math.max(2, Math.round(e.def.dmg * 0.55));
    var a0 = Math.atan2(p.y - s.y, p.x - s.x);
    for (var i = 0; i < n; i++) {
      var a = a0 + (i - (n - 1) / 2) * 0.9, x = s.x + Math.cos(a) * 8, y = s.y - 12 + Math.sin(a) * 6;
      var glow = this.add.image(x, y, 'glow').setBlendMode(ADD()).setTint(VIOLET).setScale(0.22).setDepth(9500);
      var core = this.add.image(x, y, 'suria_orb').setTint(0xd6a8ff).setDepth(9501);
      var sp = 140 + t.clears * 8;
      m.orbs.push({ img: core, glow: glow, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, t: 2.6, dmg: dmg, evil: true, turn: 2.6 + t.clears * 0.2 });
    }
    LC.Audio.sfx('cast');
  };
  W.mirrorDash = function (t) {
    var self = this, e = t.boss, s = e.spr, p = this.player, dx = p.x - s.x, dy = p.y - s.y, d = Math.hypot(dx, dy) || 1;
    var away = e.hp < e.def.hp * 0.3 && d < 40, ux = (away ? -dx : dx) / d, uy = (away ? -dy : dy) / d, go = away ? 64 : Math.max(0, Math.min(64, d - 16));
    var tx = s.x, ty = s.y, dist = 0;
    while (dist < go) { var nx = tx + ux * 4, ny = ty + uy * 4; if (this.blockedAt(nx, ny)) break; tx = nx; ty = ny; dist += 4; }
    if (dist < 12) return;
    this.ui.floatText(s.x, s.y - 24, 'Langkah Semaun!', SAYC);
    for (var i = 0; i < 3; i++) (function (i) {
      var gh = self.add.image(s.x + (tx - s.x) * i / 3, s.y + (ty - s.y) * i / 3, s.texture.key).setOrigin(0.5, 1).setFlipX(s.flipX).setTintFill(VIOLET).setAlpha(0.45).setDepth(s.depth - 1);
      self.tweens.add({ targets: gh, alpha: 0, duration: 260 + i * 70, onComplete: function () { gh.destroy(); } });
    })(i);
    this.fx.dirt.explode(8, s.x, s.y - 2);
    LC.Audio.sfx('dash');
    e.windT = 0; e.strikeT = 0; e.kx = 0; e.ky = 0;
    this.tweens.add({ targets: s, x: tx, y: ty, duration: 130, ease: 'Quad.easeOut' });
    if (!away) this.time.delayedCall(150, function () { if (!e.dead && e.stoneT <= 0) { e.atkCd = 0; e.windT = 0.22; } });
  };

  // ================================================================ what its skills do when they land
  W.mirrorImpact = function (t, k) {
    var e = t.boss, m = t.mirror, p = this.player, dmg = e.def.dmg, inside = Math.hypot(p.x - k.x, (p.y - 4) - k.y) < k.r;
    if (e.dead || t.ending) return;
    switch (k.kind) {
      case 'badang':
      case 'jack':
      case 'naga': {
        var naga = k.kind === 'naga', badang = k.kind === 'badang';
        var damage = naga ? LC.NAGA_JET.dmg + Math.floor((this.S.str || 0) / 40) :
          badang ? LC.BADANG_FIGHT.dmg * (m.stoneT > 0 ? 2 : 1) : LC.C12.jackFight.dmg;
        if (k.jet) k.jet.destroy();
        LC.Audio.sfx(naga ? 'splash' : badang ? 'punch' : 'swing');
        this.shockwave(k.x, k.y - 4, k.r, naga ? 0xadabff : VIOLET);
        (naga ? this.fx.drop : this.fx.dirt).explode(8, k.x, k.y - 5);
        if (inside) this.playerHurt(damage, { spr: k.ally });
        dismissAlly(this, k.ally, 220);
        break;
      }
      case 'batu':
        LC.Audio.sfx('stone'); this.shockwave(k.x, k.y - 8, k.r, 0xb8a8d8); this.fx.pebble.explode(8, k.x, k.y - 8); this.cameras.main.shake(150, 0.003);
        if (inside) this.mirrorStonePlayer(t, Math.min(1.7, 1.2 + t.clears * 0.1));
        break;
      case 'angin':
        LC.Audio.sfx('wind'); this.shockwave(k.x, k.y - 8, k.r, 0xd8ecff); this.fx.smoke.explode(12, k.x, k.y - 6);
        if (inside) { this.playerHurt(Math.max(1, Math.round(dmg * 0.5)), e); this.mirrorPush(k.x, k.y, 40); m.slowT = Math.max(m.slowT, 0.8); }
        break;
      case 'lagu':
        LC.Audio.sfx('ring9'); this.shockwave(k.x, k.y - 8, k.r, VIOLET);
        if (inside) { m.tranceT = Math.min(2.2, 1.6 + t.clears * 0.1); this.ui.floatText(p.x, p.y - 26, 'Entranced...', '#d6b8ff'); }
        break;
      case 'lada':
        this.fx.smoke.explode(10, k.x, k.y - 4); this.fx.sparkle.explode(6, k.x, k.y - 4);
        if (inside) {
          LC.Audio.sfx('sneeze'); this.playerHurt(Math.max(1, Math.round(dmg * 0.3)), { spr: { x: k.x, y: k.y } });
          m.slowT = Math.max(m.slowT, 1.4); this.ui.floatText(p.x, p.y - 30, 'Hachoo!', '#ffb38a');
        }
        break;
    }
  };
  W.mirrorPush = function (x, y, dist) {   // fling you away from a point, step by step (never through a wall)
    var p = this.player, dx = p.x - x, dy = p.y - y, d = Math.hypot(dx, dy) || 1;
    for (var k = 0; k < dist / 4; k++) { var nx = p.x + dx / d * 4, ny = p.y + dy / d * 4; if (!this.blockedAt(nx, p.y)) p.x = nx; if (!this.blockedAt(p.x, ny)) p.y = ny; }
  };
  W.mirrorStonePlayer = function (t, dur) {
    var m = t.mirror, e = t.boss, p = this.player;
    m.stoneT = Math.max(m.stoneT, dur);
    p.setTint(0x9a96a0); p.setAngle(0);
    this.fx.pebble.explode(8, p.x, p.y - 8);
    this.ui.floatText(p.x, p.y - 26, 'Turned to stone!', '#cfd8ff');
    if (e.windT <= 0 && e.strikeT <= 0) { e.atkCd = 0; e.windT = 0.3; }   // and it comes for the statue
  };
  // your state in the fight: stone, trance, dizzy or sneezing, and your own Pantul shield
  W.mirrorPlayerFx = function (t, dt, now) {
    var m = t.mirror, p = this.player;
    if (m.stoneT > 0) {
      m.stoneT -= dt;
      if (this.invuln <= 0) p.setTint(0x9a96a0);
      if (m.stoneT <= 0) { p.clearTint(); this.fx.pebble.explode(8, p.x, p.y - 8); LC.Audio.sfx('crumble'); }
    }
    if (m.tranceT > 0) {
      m.tranceT -= dt;
      p.setAngle(Math.sin(now / 200) * 10);
      if ((m.pnoteT = (m.pnoteT || 0) - dt) <= 0 && this.note9) { m.pnoteT = 0.4; this.note9(p.x + (Math.random() - 0.5) * 10, p.y - 18, VIOLET); }
      if (m.tranceT <= 0) p.setAngle(0);
    }
    if (m.slowT > 0) m.slowT -= dt;
    if (m.shield > 0) {
      m.shield -= dt;
      if (m.gleam) m.gleam.setPosition(p.x, p.y - 11).setVisible(m.shield > 0);
    }
    if (m.pantulCd > 0) m.pantulCd -= dt;
  };
  W.mirrorClearPlayer = function (t) {
    var m = t.mirror, p = this.player;
    m.stoneT = 0; m.tranceT = 0; m.slowT = 0; m.shield = 0;
    p.setAngle(0); if (this.invuln <= 0) p.clearTint();
    if (m.gleam) m.gleam.setVisible(false);
  };

  // ---------------------------------------------------------------- dark suns (and Pantul, both ways)
  W.updateMirrorOrbs = function (t, dt) {
    var self = this, m = t.mirror, e = t.boss, p = this.player, now = this.time.now;
    function fade(o) { self.tweens.add({ targets: [o.img, o.glow], alpha: 0, scale: 0.1, duration: 160, onComplete: function () { o.img.destroy(); o.glow.destroy(); } }); }
    m.orbs = m.orbs.filter(function (o, i) {
      if (!o.img.active) return false;
      if (!o.evil && e.dead || t.ending) { fade(o); return false; }
      var tx = o.evil ? p.x : e.spr.x, ty = o.evil ? p.y - 8 : e.spr.y - 8;
      var ang = Math.atan2(ty - o.img.y, tx - o.img.x), sp = Math.hypot(o.vx, o.vy), cur = Math.atan2(o.vy, o.vx);
      cur += Phaser.Math.Clamp(Phaser.Math.Angle.Wrap(ang - cur), -o.turn * dt, o.turn * dt);
      o.vx = Math.cos(cur) * sp; o.vy = Math.sin(cur) * sp;
      o.img.x += o.vx * dt; o.img.y += o.vy * dt; o.img.rotation += dt * 6; o.t -= dt;
      o.glow.setPosition(o.img.x, o.img.y).setScale(0.2 + 0.04 * Math.sin(now / 60 + i));
      if (Math.hypot(tx - o.img.x, ty - o.img.y) < (o.evil ? 8 : 10)) {
        if (o.evil && m.shield > 0) {   // your Mantera Pantul: back it goes, twice as strong
          o.evil = false; o.vx = -o.vx * 1.25; o.vy = -o.vy * 1.25; o.dmg *= 2; o.t = 2; o.turn = 8;
          o.img.clearTint(); o.glow.setTint(0xffc860);
          self.fx.sparkle.explode(10, p.x, p.y - 8); self.ui.floatText(p.x, p.y - 23, 'Pantul!', '#baf8ec'); LC.Audio.sfx('cast');
          return true;
        }
        if (o.evil) self.playerHurt(o.dmg, { spr: { x: o.img.x, y: o.img.y + 8 } });
        else {
          var n = e.stoneT > 0 ? o.dmg * 2 : o.dmg;
          e.hp -= n; e.hurtT = 0.12; e.spr.setTintFill(0xfff2b0);
          self.fx.sparkle.explode(8, o.img.x, o.img.y);
          self.ui.floatText(e.spr.x, e.spr.y - e.spr.height - 2, String(n), '#fff2b0');
          if (e.hp <= 0) self.enemyDie(e);
        }
        fade(o); return false;
      }
      if (o.t <= 0) { fade(o); return false; }
      return true;
    });
  };
  // its own Pantul: your suns, sent back at you
  W.mirrorReflect = function (t, dt) {
    var m = t.mirror, e = t.boss, s = e.spr, list = this.suriaOrbs;
    if (m.skills.indexOf('pantul') < 0 || m.pantulCd > 0 || !list || !list.length || e.stoneT > 0 || e.tranceT > 0) return;
    var cx = s.x, cy = s.y - 8, near = list.filter(function (o) { return o.img.active && Math.hypot(o.img.x - cx, o.img.y - cy) < 46; });
    if (!near.length) return;
    var self = this;
    list.slice().forEach(function (o) {
      if (!o.img.active || Math.hypot(o.img.x - cx, o.img.y - cy) > 70) return;
      list.splice(list.indexOf(o), 1);
      o.img.setTint(0xd6a8ff); o.glow.setTint(VIOLET);
      m.orbs.push({ img: o.img, glow: o.glow, vx: -o.vx, vy: -o.vy, t: 2.2, dmg: o.dmg, evil: true, turn: 6 });
    });
    m.pantulCd = Math.max(3.5, 6 - t.clears * 0.4);
    if (this.textures.exists('mantera_pantul')) {
      var gl = this.add.image(cx, cy - 3, 'mantera_pantul').setDepth(1255).setScale(1.5).setTint(0xd6a8ff).setAlpha(0.9);
      this.tweens.add({ targets: gl, alpha: 0, scale: 2, duration: 420, onComplete: function () { gl.destroy(); } });
    }
    this.fx.sparkle.explode(10, cx, cy);
    this.ui.floatText(cx, cy - 16, 'Pantul!', SAYC);
    LC.Audio.sfx('cast');
  };
  // ---------------------------------------------------------------- the dark whirlwind and the herb circle
  W.updateMirrorWhirl = function (t, dt) {
    var w = t.mirror.whirl, p = this.player, e = t.boss;
    if (!w) return;
    var s = w.spr;
    w.t -= dt; w.cd -= dt;
    if (w.t <= 0 || e.dead || t.ending) {
      t.mirror.whirl = null;
      this.tweens.add({ targets: s, alpha: 0, duration: 400, onComplete: function () { s.destroy(); } });
      if (w.ally) dismissAlly(this, w.ally);
      return;
    }
    var dx = p.x - s.x, dy = p.y - s.y, d = Math.hypot(dx, dy) || 1, sp = (44 + t.clears * 2) * dt;
    var nx = s.x + dx / d * sp, ny = s.y + dy / d * sp;
    if (!this.solidPx(nx, s.y - 2)) s.x = nx;
    if (!this.solidPx(s.x, ny - 2)) s.y = ny;
    s.setDepth(s.y);
    if (w.ally) w.ally.setPosition(s.x, s.y - 3).setDepth(s.y + 1).setFlipX(dx < 0);
    if (d < 12 && w.cd <= 0) {
      w.cd = 1.1;
      this.playerHurt(Math.max(1, Math.round(e.def.dmg * 0.45)), { spr: s });
      this.mirrorPush(s.x, s.y, 24);
      this.fx.smoke.explode(6, p.x, p.y - 6);
    }
  };
  W.updateMirrorZone = function (t, dt) {
    var m = t.mirror, z = m.zone, g = m.g, e = t.boss;
    g.clear();
    if (!z) return;
    z.t -= dt;
    if (z.t <= 0 || e.dead || t.ending) { m.zone = null; return; }
    var a = Math.min(1, z.t, 6 - z.t);
    g.fillStyle(0x1f3a24, 0.35 * a); g.fillCircle(z.x, z.y, z.r);
    g.lineStyle(1, 0x6ad08a, 0.7 * a); g.strokeCircle(z.x, z.y, z.r);
    g.lineStyle(1, VIOLET, 0.5 * a); g.strokeCircle(z.x, z.y, z.r - 4);
    // inside it, every blow it takes hurts half as much (half of what it just lost comes back)
    if (!e.dead && e.hp < m.lastHp && Math.hypot(e.spr.x - z.x, e.spr.y - z.y) < z.r) e.hp += (m.lastHp - e.hp) / 2;
  };
  function inZone(t) { var z = t.mirror.zone, s = t.boss.spr; return !!z && Math.hypot(s.x - z.x, s.y - z.y) < z.r; }

  // ================================================================ death, Restu Ibu and the herb circle at the last blow
  var enemyDie = W.enemyDie;
  W.enemyDie = function (e) {
    var t = this.bunianTrial, m = t && t.door.mirror && t.mirror;
    if (!m || e !== t.boss || e.dead || t.ending) return enemyDie.apply(this, arguments);
    var self = this, s = e.spr;
    if (inZone(t) && m.lastHp - (m.lastHp - e.hp) / 2 > 0) { e.hp = m.lastHp = m.lastHp - (m.lastHp - e.hp) / 2; return; }
    if (m.skills.indexOf('restu') >= 0 && !m.revived) {
      m.revived = true;
      e.hp = Math.round(e.def.hp * 0.5); e.stoneT = 0; e.tranceT = 0; e.windT = 0; e.strikeT = 0; e.restT = 0.6; s.setAngle(0); s.clearTint();
      if (s.anims.isPaused) s.anims.resume();
      LC.Audio.sfx('restu');
      var col = this.add.image(s.x, s.y - 20, 'glow').setDepth(9601).setTint(0xc79bff).setBlendMode(ADD()).setScale(0.6, 3).setAlpha(0);
      this.tweens.add({ targets: col, alpha: 0.9, duration: 220, yoyo: true, hold: 500, onComplete: function () { col.destroy(); } });
      this.fx.sparkle.explode(26, s.x, s.y - 10);
      this.shockwave(s.x, s.y - 8, 90, 0xc79bff);
      this.ui.floatText(s.x, s.y - 28, X.revive, SAYC);
      if (Math.hypot(this.player.x - s.x, this.player.y - s.y) < 90) this.mirrorStonePlayer(t, 0.9);
      return;
    }
    this.ui.floatText(s.x, s.y - 26, pick(X.dying), SAYC);
    this.mirrorClearPlayer(t);
    if (m.aura) m.aura.destroy();
    if (m.glass) {   // the mirror shatters
      this.fx.sparkle.explode(24, m.glass.x, m.glass.y - 30);
      this.tweens.add({ targets: m.glass, alpha: 0, scaleY: 0.2, duration: 450, onComplete: function () { if (m.glass) m.glass.destroy(); } });
      LC.Audio.sfx('crumble');
    }
    m.orbs.forEach(function (o) { o.img.destroy(); o.glow.destroy(); }); m.orbs = [];
    return enemyDie.apply(this, arguments);
  };
  // its blow on a statue cracks you (x1.5), and frees you
  var playerHurt = W.playerHurt;
  W.playerHurt = function (dmg, e) {
    var t = this.bunianTrial, m = t && t.door.mirror && t.mirror;
    if (m && m.stoneT > 0 && e === t.boss && this.invuln <= 0) {
      dmg = Math.round(dmg * 1.5); m.stoneT = 0;
      this.player.clearTint(); this.fx.pebble.explode(10, this.player.x, this.player.y - 8);
      this.ui.floatText(this.player.x, this.player.y - 34, 'CRACK!', '#cfd8ff');
    }
    return playerHurt.call(this, dmg, e);
  };

  // ================================================================ you, in the fight
  var updatePlayer = W.updatePlayer;
  W.updatePlayer = function (dt, blocked) {
    var m = mirrorOf(this);
    return updatePlayer.call(this, dt, blocked || !!(m && m.stoneT > 0));
  };
  var compSpeed = W.compSpeed;
  W.compSpeed = function () {
    var base = compSpeed ? compSpeed.apply(this, arguments) : 1, m = mirrorOf(this);
    if (!m) return base;
    return base * (m.tranceT > 0 ? 0.3 : m.slowT > 0 ? 0.55 : 1);
  };
  ['attack', 'dash'].forEach(function (fn) {
    var orig = W[fn];
    if (!orig) return;
    W[fn] = function () { var m = mirrorOf(this); if (m && m.stoneT > 0) return; return orig.apply(this, arguments); };
  });
  // your own Mantera Pantul works in the Hall of Mirrors too (it needs no rune here: the suns are real enough)
  var castPantul = W.castPantul;
  W.castPantul = function () {
    var m = mirrorOf(this);
    if (!m) return castPantul.apply(this, arguments);
    if (!this.pantulAvailable() || this.pantulLeft() || this.ui.isBlocking() || this.cutscene || this.leaving || this.sleeping) return;
    LC.pantulState = this.S; LC.pantulAt = Date.now() + LC.C13.cooldown * 1000;
    m.shield = LC.C13.window;
    if (!m.gleam && this.textures.exists('mantera_pantul')) m.gleam = this.add.image(0, 0, 'mantera_pantul').setDepth(1255);
    if (m.gleam) m.gleam.setPosition(this.player.x, this.player.y - 11).setAlpha(0.8).setScale(1.5).setVisible(true);
    LC.Audio.sfx('cast');
  };

  // ================================================================ the door: what is waiting behind it
  var inspect = W.inspectBunianDoor;
  W.inspectBunianDoor = function (door) {
    if (!door.mirror) return inspect.apply(this, arguments);
    var self = this, S = this.S, round = B.round(S, door), b = round.boss, loot = door.loot[0];
    var skills = B.mirrorSkills(S), sk = B.mirrorSkillNames(skills), allies = availableAllies(S, skills);
    var lines = [keeperLine(door.advice),
      keeperLine('Round ' + round.number + ' · ' + TWIN + ', your shadow: Lv ' + b.level + ' (you are Lv ' + round.you + '), ' + b.hp + ' HP, hits for ' + b.dmg +
        ', with your ' + (round.weapon ? round.weapon.name : 'bare hands') + '.'),
      keeperLine(sk.length ? 'It knows every skill you know: ' + sk.join(', ') + '.' : 'You have learned no skills yet, so neither has it. The day you learn one, so will it.')];
    if (allies.length) lines.push(keeperLine('The mirror can call your allies too. Watch for ' + allies.map(function (id) { return ALLIES[id].name; }).join(', ') + '.'));
    lines.push(keeperLine('Win this round for ' + round.kepeng + ' kepeng and ' + round.items + ' ' + LC.ITEMS[loot].name + '.' +
      (round.number === 1 ? ' Your first win also grants +' + door.hp + ' max health and +' + door.energy + ' max energy permanently.' : ' It is stronger every time you win.')));
    this.ui.say(lines, { choices: [
      { label: 'Face your shadow', fn: function () {
        B.enter(self.S); LC.State.save(); LC.Audio.sfx('gate'); self.goArea(door.area, undefined, 'up');
      } }, { label: 'Wait' }
    ] });
  };

  var goal = U.goalText;
  U.goalText = function () {
    var t = this.world && this.world.bunianTrial;
    if (!t || !t.door.mirror || t.ending) return goal.apply(this, arguments);
    return 'Round ' + t.round.number + ' · ' + (t.phase === 'boss' ? 'Defeat ' + TWIN + ', your shadow (Lv ' + t.round.boss.level + ')' : 'Face the mirror');
  };
})(window.LC);
