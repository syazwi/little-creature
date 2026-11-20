/* Little Creature — v2.7 sound for Chapter 9 (Ulek Mayang). Everything is synthesised live, like the rest of the game.
 *  - LC.Singer: a voice that sings. A buzzy tone with a slow vibrato, shaped by three formant filters into a vowel
 *    ("aa", "oo", "uu"), or a man's closed-mouth hum. It has its own volume and left/right position, which the world
 *    sets every frame from where the singer is, so you can find a song by ear. quiet() stops it dead, mid-note.
 *    The melody (LC.MAYANG_MEL) is the game's own, slow, in a pelog-like scale; it is not the traditional tune.
 *  - LC.SING: the voices of the chapter (her: the woman's voice; him: Pak Awang's hum; me: you, in the ritual and
 *    when you sing Lagu Mayang).
 *  - LC.Audio.horror(on): the calm music fades out; a low drone, far-off whispers, creaks and sighs take its place.
 *  - New sound effects: scare9, laugh9, creak9, snap9, shh9, wail9, gasp9, dawn9, lagu9. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var A = LC.Audio;
  var PELOG = [0, 1, 3, 7, 8];
  function pel(base, d) { var o = Math.floor(d / 5), i = ((d % 5) + 5) % 5; return base * Math.pow(2, (o * 12 + PELOG[i]) / 12); }
  LC.pel9 = pel;
  // formants [frequency, gain, Q] for each vowel (a woman's voice), and a man's closed-mouth hum
  var VOWEL = {
    a: [[820, 1, 9], [1180, 0.55, 11], [2900, 0.2, 13]],
    o: [[470, 1, 8], [820, 0.45, 10], [2830, 0.14, 13]],
    u: [[350, 1, 7], [640, 0.32, 9], [2700, 0.08, 12]],
    m: [[260, 1, 4], [820, 0.12, 7], [2300, 0.02, 9]]
  };
  // the song: [degree, beats, vowel]; a null degree is a rest
  LC.MAYANG_MEL = [[2, 1.5, 'a'], [3, 0.5, 'a'], [4, 1, 'o'], [3, 1, 'a'], [2, 2, 'a'], [null, 1], [1, 1, 'o'], [2, 1, 'a'], [1, 0.5, 'u'], [0, 0.5, 'u'], [-1, 2, 'a'], [null, 1],
    [0, 1, 'a'], [2, 1, 'o'], [3, 1.5, 'a'], [2, 0.5, 'a'], [1, 1, 'o'], [0, 1, 'u'], [-1, 3, 'a'], [null, 2]];
  LC.HUM_MEL = [[0, 1, 'm'], [2, 1, 'm'], [3, 0.5, 'm'], [2, 0.5, 'm'], [0, 2, 'm'], [null, 0.5], [1, 1, 'm'], [0, 1, 'm'], [-1, 2.5, 'm'], [null, 1]];

  function Singer(opts) {
    this.o = Object.assign({ base: 330, bpm: 62, mel: LC.MAYANG_MEL, man: false, amp: 1 }, opts || {});
    this.on = false; this.vol = 0; this.pan = 0; this.i = 0; this.next = 0; this.quietUntil = 0; this.prevF = 0; this.live = [];
  }
  Singer.prototype.ensure = function () {
    if (this.out) return true;
    if (!A.ctx || !A.master) return false;
    var c = A.ctx;
    this.out = c.createGain(); this.out.gain.value = 0;
    this.pn = c.createStereoPanner ? c.createStereoPanner() : null;
    var dry = c.createGain(), wet = c.createGain(); dry.gain.value = 0.75; wet.gain.value = 1.15;
    var src = this.out;
    if (this.pn) { this.out.connect(this.pn); src = this.pn; }
    src.connect(dry); src.connect(wet); dry.connect(A.master); wet.connect(A.verbIn);
    return true;
  };
  Singer.prototype.level = function () { return Math.max(0, this.vol) * 0.9 * (A.vol ? A.vol.sfx : 1) * this.o.amp; };
  // volume (0..1) and position (-1 left .. 1 right); call it every frame
  Singer.prototype.set = function (vol, pan) {
    if (!this.ensure()) return;
    var t = A.ctx.currentTime;
    if (Math.abs(vol - this.vol) > 0.005 || this.forceSet) { this.vol = vol; this.out.gain.setTargetAtTime(this.level(), t, 0.12); this.forceSet = false; }
    if (this.pn && Math.abs(pan - this.pan) > 0.01) { this.pan = pan; this.pn.pan.setTargetAtTime(Math.max(-1, Math.min(1, pan)), t, 0.1); }
  };
  Singer.prototype.run = function (want) {   // start or stop the song (call it as often as you like)
    if (want && !this.on) this.start(); else if (!want && this.on) this.stop();
  };
  Singer.prototype.start = function () {
    if (this.on || !A.ctx || A.ctx.state !== 'running' || !this.ensure()) return;
    var self = this;
    this.on = true; this.i = 0; this.prevF = 0; this.quietUntil = 0; this.next = A.ctx.currentTime + 0.25; this.forceSet = true;
    this.out.gain.setTargetAtTime(this.level(), A.ctx.currentTime, 0.3);
    this.timer = setInterval(function () { self.tick(); }, 60);
  };
  Singer.prototype.stop = function (fade) {
    this.on = false;
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    if (this.out && A.ctx) this.out.gain.setTargetAtTime(0, A.ctx.currentTime, fade || 0.25);
    this.cut(fade || 0.25);
  };
  Singer.prototype.cut = function (tc) {   // silence every note still sounding
    if (!A.ctx) return;
    var t = A.ctx.currentTime;
    this.live.forEach(function (n) { try { n.env.gain.cancelScheduledValues(t); n.env.gain.setTargetAtTime(0.0001, t, tc || 0.05); } catch (e) { /* ignore */ } });
    this.live = [];
  };
  Singer.prototype.quiet = function (sec) {   // stop dead, mid-note, and say nothing for a while
    if (!A.ctx) return;
    this.quietUntil = A.ctx.currentTime + sec; this.prevF = 0;
    this.cut(0.04);
  };
  Singer.prototype.isQuiet = function () { return !!A.ctx && A.ctx.currentTime < this.quietUntil; };
  Singer.prototype.tick = function () {
    var c = A.ctx;
    if (!c || c.state !== 'running' || !this.on) return;
    var now = c.currentTime, spb = 60 / this.o.bpm, mel = this.o.mel;
    if (this.next < now - 0.5) this.next = now + 0.05;
    while (this.next < now + 0.35) {
      if (this.next < this.quietUntil) { this.next = this.quietUntil + 0.15; continue; }
      var n = mel[this.i % mel.length], dur = n[1] * spb;
      if (n[0] !== null) this.note(this.next, pel(this.o.base, n[0]), dur, n[2]);
      else this.prevF = 0;
      this.next += dur; this.i++;
    }
    var t2 = now;
    this.live = this.live.filter(function (x) { return x.end > t2; });
  };
  Singer.prototype.note = function (t, f, dur, vw) {
    if (!this.ensure()) return;
    var c = A.ctx, V = VOWEL[this.o.man ? 'm' : (vw || 'a')] || VOWEL.a, env = c.createGain(), mix = c.createGain(), f0 = this.prevF || f;
    var o1 = c.createOscillator(), o2 = c.createOscillator(), lfo = c.createOscillator(), lg = c.createGain();
    o1.type = 'sawtooth'; o2.type = 'triangle';
    o1.frequency.setValueAtTime(f0, t); o1.frequency.exponentialRampToValueAtTime(f, t + 0.14);
    o2.frequency.setValueAtTime(f0 * 1.005, t); o2.frequency.exponentialRampToValueAtTime(f * 1.005, t + 0.14);
    if (!this.o.man && dur > 1.2 && Math.random() < 0.22) { o1.frequency.setValueAtTime(f, t + dur * 0.7); o1.frequency.linearRampToValueAtTime(f * 0.94, t + dur); }   // a note that sags, as if she is weeping
    lfo.frequency.value = 4.6 + Math.random() * 1.2;
    lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(f * (this.o.man ? 0.006 : 0.016), t + Math.min(0.6, dur * 0.6));
    lfo.connect(lg); lg.connect(o1.frequency); lg.connect(o2.frequency);
    var src = c.createGain(); src.gain.value = 1; o1.connect(src); o2.connect(src);
    V.forEach(function (fm) { var bp = c.createBiquadFilter(), g = c.createGain(); bp.type = 'bandpass'; bp.frequency.value = fm[0]; bp.Q.value = fm[2]; g.gain.value = fm[1] * 7; src.connect(bp); bp.connect(g); g.connect(mix); });
    if (this.o.man) { var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700; mix.connect(lp); lp.connect(env); } else mix.connect(env);
    var amp = this.o.man ? 0.2 : 0.13, end = t + dur + 0.45;
    env.gain.setValueAtTime(0.0001, t); env.gain.exponentialRampToValueAtTime(amp, t + 0.16);
    env.gain.setValueAtTime(amp, t + Math.max(0.17, dur - 0.05)); env.gain.exponentialRampToValueAtTime(0.0001, end);
    env.connect(this.out);
    if (!this.o.man && A.noiseBuf) {   // breath
      var ns = c.createBufferSource(), nb = c.createBiquadFilter(), ng = c.createGain();
      ns.buffer = A.noiseBuf; nb.type = 'bandpass'; nb.frequency.value = 2600; nb.Q.value = 0.9; ng.gain.value = 0.05;
      ns.connect(nb); nb.connect(ng); ng.connect(env); ns.start(t, Math.random()); ns.stop(end + 0.05);
    }
    [o1, o2, lfo].forEach(function (o) { o.start(t); o.stop(end + 0.05); });
    this.prevF = f;
    this.live.push({ env: env, end: end });
  };
  // one note now (the ritual), or a short phrase (Lagu Mayang)
  Singer.prototype.one = function (deg, beats, vw, vol) {
    if (!A.ctx || A.ctx.state !== 'running' || !this.ensure()) return;
    var t = A.ctx.currentTime + 0.02;
    this.vol = vol === undefined ? 0.8 : vol; this.out.gain.cancelScheduledValues(t); this.out.gain.setValueAtTime(this.level(), t);
    this.prevF = 0;
    this.note(t, pel(this.o.base, deg), beats * 60 / this.o.bpm, vw);
  };
  Singer.prototype.phrase = function (notes, vol) {
    if (!A.ctx || A.ctx.state !== 'running' || !this.ensure()) return;
    var t = A.ctx.currentTime + 0.03, spb = 60 / this.o.bpm, self = this;
    this.vol = vol === undefined ? 0.8 : vol; this.out.gain.cancelScheduledValues(t); this.out.gain.setValueAtTime(this.level(), t);
    this.prevF = 0;
    notes.forEach(function (n) { if (n[0] !== null) self.note(t, pel(self.o.base, n[0]), n[1] * spb, n[2]); t += n[1] * spb; });
  };
  LC.Singer = Singer;
  LC.SING = {
    her: new Singer({ base: 330, bpm: 60 }),                         // the woman's voice: Puteri Bongsu
    him: new Singer({ base: 147, bpm: 70, man: true, mel: LC.HUM_MEL, amp: 1.1 }),   // Pak Awang's hum, in the cave
    pawang: new Singer({ base: 165, bpm: 76, man: true, amp: 1.2 }),  // Tok Pawang, in the ritual
    me: new Singer({ base: 294, bpm: 84 })                            // you
  };
  LC.SING.stopAll = function () { ['her', 'him', 'pawang', 'me'].forEach(function (k) { LC.SING[k].stop(0.2); }); };

  // ---------------------------------------------------------------- the horror bed
  A.horror = function (on) {
    on = !!on;
    if (on === !!A.horrorOn && (!on || A.hd)) return;
    A.horrorOn = on;
    if (!A.ctx || !A.amb) return;
    var c = A.ctx, t = c.currentTime;
    if (on && !A.hd) {
      var g = c.createGain(), lp = c.createBiquadFilter(); g.gain.value = 0; lp.type = 'lowpass'; lp.frequency.value = 320;
      [[55, 'sine', 0.5], [58.3, 'sine', 0.4], [110.6, 'triangle', 0.12], [164.4, 'sine', 0.05]].forEach(function (d) { var o = c.createOscillator(), og = c.createGain(); o.type = d[1]; o.frequency.value = d[0]; og.gain.value = d[2]; o.connect(og); og.connect(lp); o.start(); });
      var lfo = c.createOscillator(), lfoG = c.createGain(); lfo.frequency.value = 0.07; lfoG.gain.value = 0.25; lfo.connect(lfoG); lfoG.connect(g.gain); lfo.start();
      lp.connect(g); g.connect(A.amb);
      A.hd = { g: g };
    }
    if (A.hd) A.hd.g.gain.setTargetAtTime(on ? 0.6 : 0, t, on ? 1.5 : 0.8);
    if (on && !A.hTimer) { A.hNext = t + 3; A.hTimer = setInterval(A.horrorTick, 300); }
    if (!on && A.hTimer) { clearInterval(A.hTimer); A.hTimer = null; }
    A.applyVolumes();
  };
  function panTo(p) { if (!A.ctx.createStereoPanner) return A.amb; var s = A.ctx.createStereoPanner(); s.pan.value = p; s.connect(A.amb); return s; }
  A.horrorTick = function () {   // now and then, somewhere in the dark: a whisper, a creak, a sigh, a drip
    var c = A.ctx;
    if (!c || c.state !== 'running' || !A.horrorOn || !A.ambienceOn || c.currentTime < A.hNext) return;
    var t = c.currentTime + 0.05, k = Math.random(), d = panTo(Math.random() * 1.8 - 0.9);
    A.hNext = t + 5 + Math.random() * 7;
    if (k < 0.35) {   // a whisper: breathy noise through a formant that slides
      var s = c.createBufferSource(), bp = c.createBiquadFilter(), g = c.createGain(), n = 2 + Math.floor(Math.random() * 3);
      s.buffer = A.noiseBuf; bp.type = 'bandpass'; bp.Q.value = 5;
      for (var i = 0; i < n; i++) { bp.frequency.setValueAtTime(1400 + Math.random() * 1400, t + i * 0.22); }
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.09, t + 0.12); g.gain.setValueAtTime(0.09, t + n * 0.2); g.gain.exponentialRampToValueAtTime(0.0001, t + n * 0.22 + 0.3);
      s.connect(bp); bp.connect(g); g.connect(d); s.start(t, Math.random()); s.stop(t + n * 0.22 + 0.4);
    } else if (k < 0.6) {   // wood creaking
      A.tone(t, 'sawtooth', 90 + Math.random() * 20, 120, 0.5, 0.035, d); A.tone(t + 0.6, 'sawtooth', 118, 88, 0.6, 0.03, d);
    } else if (k < 0.8) {   // a long sigh
      var s2 = c.createBufferSource(), bp2 = c.createBiquadFilter(), g2 = c.createGain();
      s2.buffer = A.noiseBuf; bp2.type = 'bandpass'; bp2.frequency.setValueAtTime(700, t); bp2.frequency.linearRampToValueAtTime(380, t + 2.2); bp2.Q.value = 7;
      g2.gain.setValueAtTime(0.0001, t); g2.gain.exponentialRampToValueAtTime(0.1, t + 0.8); g2.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
      s2.connect(bp2); bp2.connect(g2); g2.connect(d); s2.start(t, Math.random()); s2.stop(t + 2.5);
    } else {   // something drops into the water, far away
      A.tone(t, 'sine', 700, 260, 0.12, 0.08, d); A.noise(t + 0.05, 0.4, 0.06, 'lowpass', 900, 300, d);
    }
  };
  var applyVolumes = A.applyVolumes;
  A.applyVolumes = function () {   // in the fog, the calm music falls silent
    applyVolumes.apply(this, arguments);
    if (A.horrorOn && A.music && A.ctx) A.music.gain.setTargetAtTime(0, A.ctx.currentTime, 0.8);
  };

  // ---------------------------------------------------------------- new sound effects
  var sfx = A.sfx;
  A.sfx = function (name) {
    if (!A.ctx || A.ctx.state !== 'running') return;
    var t = A.ctx.currentTime + 0.01, i;
    switch (name) {
      case 'scare9': A.tone(t, 'sawtooth', 1500, 620, 0.55, 0.11); A.tone(t, 'square', 2100, 880, 0.4, 0.04); A.noise(t, 0.5, 0.32, 'bandpass', 3200, 1100); A.tone(t, 'sine', 95, 38, 0.7, 0.55); return;
      case 'laugh9': for (i = 0; i < 6; i++) A.tone(t + i * 0.12, 'sine', 980 - i * 45, 760 - i * 45, 0.09, 0.055); A.noise(t, 0.8, 0.04, 'bandpass', 2600, 1800); return;
      case 'creak9': A.tone(t, 'sawtooth', 95, 125, 0.5, 0.05); A.tone(t + 0.55, 'sawtooth', 122, 90, 0.6, 0.045); return;
      case 'snap9': A.tone(t, 'sine', 170, 48, 0.28, 0.45); A.noise(t, 0.14, 0.32, 'lowpass', 1500); return;
      case 'shh9': A.noise(t, 1.5, 0.11, 'highpass', 3400, 5200); return;
      case 'wail9': A.tone(t, 'sawtooth', 620, 230, 1.7, 0.045); A.tone(t + 0.05, 'sine', 940, 320, 1.9, 0.06); A.noise(t, 1.6, 0.05, 'bandpass', 1800, 700); return;
      case 'gasp9': A.noise(t, 0.4, 0.22, 'bandpass', 1100, 2500); A.tone(t, 'sine', 320, 520, 0.3, 0.05); return;
      case 'dawn9': [0, 2, 4, 5, 7, 9, 10].forEach(function (d, k) { A.bell(A.freq(d + 3), t + k * 0.22, 2.6, 0.09); }); A.gong(A.freq(-10), t + 1.4, 7, 0.24); return;
      case 'lagu9': [4, 3, 2, 0].forEach(function (d, k) { A.bell(A.freq(d + 5), t + k * 0.18, 1.6, 0.06); }); return;
      case 'ring9': A.bell(pel(330, 2), t, 1.2, 0.07); return;
    }
    return sfx.apply(this, arguments);
  };
})(window.LC);
