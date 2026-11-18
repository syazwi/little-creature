/* Little Creature — procedural Web Audio: a chill, slow gamelan-lofi soundtrack, nature ambience and sound effects.
 *
 * Music  : warm detuned pads + sparse metallophone bells (slendro-like 5-tone scale) + soft bass + distant gong,
 *          all through a generated hall reverb. Day and night have their own (slower, lower) arrangements.
 * Nature : a river that never stops; by day koels and bulbuls; at night crickets and frogs (kodok).
 * Nothing is loaded from disk: every sound is synthesised live, so there are no audio files to license. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var A = LC.Audio = { ctx: null, musicOn: true, ambienceOn: true, night: false, step: 0 };
  try {
    A.musicOn = localStorage.getItem('littleCreature.music') !== 'off';
    A.ambienceOn = localStorage.getItem('littleCreature.ambience') !== 'off';
  } catch (e) { /* ignore */ }

  var BASE = 220;
  var MUSIC_VOL = 0.34, AMB_VOL = 0.22;
  A.freq = function (deg) { return BASE * Math.pow(2, deg / 5); };
  function rnd(a, b) { return a + Math.random() * (b - a); }

  // 32-beat melodies (scale degrees; null = rest). Lots of space = lots of calm.
  var DAY = {
    bpm: 56,
    mel: [4, null, 3, null, 2, null, null, 1, 2, null, 4, null, 5, null, null, null,
          3, null, 2, null, 0, null, null, 1, 2, null, 1, null, 0, null, null, null],
    chords: [[0, 2, 4], [-1, 1, 3], [0, 2, 5], [-2, 1, 3]]
  };
  var NIGHT = {
    bpm: 46,
    mel: [2, null, null, 1, 0, null, null, null, -1, null, 0, null, 1, null, null, null,
          0, null, null, -1, -2, null, null, null, -1, null, null, 0, -1, null, null, null],
    chords: [[-3, 0, 2], [-2, 0, 3], [-4, -1, 2], [-3, 0, 2]]
  };

  A.init = function () {
    if (A.ctx) { if (A.ctx.state === 'suspended' && !document.hidden) A.ctx.resume(); return; }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try { A.ctx = new AC(); } catch (e) { return; }
    var c = A.ctx;
    A.master = c.createGain(); A.master.gain.value = 0.75; A.master.connect(c.destination);
    // generated hall reverb
    A.verb = c.createConvolver(); A.verb.buffer = makeImpulse(c, 3.4, 2.4);
    A.verbIn = c.createGain(); A.verbIn.gain.value = 1;
    A.verbIn.connect(A.verb); A.verb.connect(A.master);
    // buses
    A.music = c.createGain(); A.music.gain.value = A.musicOn ? MUSIC_VOL : 0;
    var mDry = c.createGain(); mDry.gain.value = 0.62; A.music.connect(mDry); mDry.connect(A.master);
    var mWet = c.createGain(); mWet.gain.value = 0.55; A.music.connect(mWet); mWet.connect(A.verbIn);
    A.amb = c.createGain(); A.amb.gain.value = A.ambienceOn ? AMB_VOL : 0;
    A.amb.connect(A.master);
    var aWet = c.createGain(); aWet.gain.value = 0.25; A.amb.connect(aWet); aWet.connect(A.verbIn);
    A.sfxBus = c.createGain(); A.sfxBus.gain.value = 0.5; A.sfxBus.connect(A.master);
    var sWet = c.createGain(); sWet.gain.value = 0.12; A.sfxBus.connect(sWet); sWet.connect(A.verbIn);
    var len = c.sampleRate * 2, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    A.noiseBuf = buf;
    A.startRiver();
    A.startMusic();
  };

  function makeImpulse(c, seconds, decay) {
    var rate = c.sampleRate, len = Math.floor(rate * seconds), ir = c.createBuffer(2, len, rate);
    for (var ch = 0; ch < 2; ch++) {
      var d = ir.getChannelData(ch);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay) * (i < rate * 0.012 ? i / (rate * 0.012) : 1);
    }
    return ir;
  }
  function pan(dest, p) {
    if (!A.ctx.createStereoPanner) return dest;
    var s = A.ctx.createStereoPanner(); s.pan.value = p; s.connect(dest); return s;
  }

  // ------------------------------------------------------------- instruments
  A.bell = function (f, t, dur, vol, dest) {
    var c = A.ctx;
    [[1, 1], [2.76, 0.22], [5.4, 0.05]].forEach(function (p) {
      var o = c.createOscillator(), g = c.createGain();
      o.type = 'sine'; o.frequency.value = f * p[0];
      var d = dur * (p[0] > 1 ? 0.4 : 1);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol * p[1]), t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(dest || A.sfxBus);
      o.start(t); o.stop(t + d + 0.05);
    });
  };
  A.gong = function (f, t, dur, vol, dest) {
    var c = A.ctx;
    [[1, 1], [1.007, 0.8], [2.02, 0.22], [3.01, 0.06]].forEach(function (p) {
      var o = c.createOscillator(), g = c.createGain();
      o.type = 'sine'; o.frequency.value = f * p[0];
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol * p[1]), t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(dest || A.sfxBus);
      o.start(t); o.stop(t + dur + 0.05);
    });
  };
  A.pad = function (freqs, t, dur, vol) {
    var c = A.ctx, f = c.createBiquadFilter(), g = c.createGain();
    f.type = 'lowpass'; f.frequency.setValueAtTime(700, t); f.frequency.linearRampToValueAtTime(1100, t + dur * 0.5); f.frequency.linearRampToValueAtTime(650, t + dur + 2);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + dur * 0.4);
    g.gain.setValueAtTime(vol, t + dur * 0.7);
    g.gain.linearRampToValueAtTime(0.0001, t + dur + 2.2);
    f.connect(g); g.connect(A.music);
    freqs.forEach(function (fr) {
      [-7, 7].forEach(function (det) {
        var o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = fr; o.detune.value = det;
        o.connect(f); o.start(t); o.stop(t + dur + 2.3);
      });
    });
  };
  A.bass = function (f, t, dur, vol) {
    var c = A.ctx, o = c.createOscillator(), g = c.createGain();
    o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.08); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(A.music); o.start(t); o.stop(t + dur + 0.05);
  };
  A.tone = function (t, type, f0, f1, dur, vol, dest) {
    var c = A.ctx, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest || A.sfxBus); o.start(t); o.stop(t + dur + 0.05);
  };
  A.noise = function (t, dur, vol, ftype, f0, f1, dest) {
    var c = A.ctx, s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain();
    s.buffer = A.noiseBuf; fl.type = ftype || 'lowpass';
    fl.frequency.setValueAtTime(f0 || 1000, t); if (f1) fl.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(fl); fl.connect(g); g.connect(dest || A.sfxBus); s.start(t, Math.random()); s.stop(t + dur + 0.05);
  };

  // ------------------------------------------------------------- nature ambience
  A.startRiver = function () {
    var c = A.ctx, s = c.createBufferSource(), bp = c.createBiquadFilter(), lp = c.createBiquadFilter(), g = c.createGain();
    s.buffer = A.noiseBuf; s.loop = true;
    bp.type = 'bandpass'; bp.frequency.value = 520; bp.Q.value = 0.5;
    lp.type = 'lowpass'; lp.frequency.value = 1400;
    g.gain.value = 0.32;
    var lfo = c.createOscillator(), lfoG = c.createGain();       // slow swell, like water lapping
    lfo.frequency.value = 0.13; lfoG.gain.value = 0.1; lfo.connect(lfoG); lfoG.connect(g.gain); lfo.start();
    s.connect(bp); bp.connect(lp); lp.connect(g); g.connect(A.amb); s.start();
    A.riv = { g: g, bp: bp, lp: lp, lfo: lfo, lfoG: lfoG };
    A.applyArea();
  };
  // each place has its own nature bed: river, rainforest, sea waves, mountain/dune wind (v1.3)
  var AREA_SOUND = {
    river: { g: 0.32, bp: 520, lp: 1400, lfo: 0.13, depth: 0.1, birds: 1 },
    forest: { g: 0.12, bp: 700, lp: 1800, lfo: 0.2, depth: 0.05, birds: 2.4 },
    sea: { g: 0.5, bp: 360, lp: 900, lfo: 0.09, depth: 0.32, birds: 0.5 },
    wind: { g: 0.26, bp: 900, lp: 2400, lfo: 0.05, depth: 0.2, birds: 0.35 }
  };
  A.areaSound = AREA_SOUND.river;
  A.setArea = function (area) {
    var a = LC.AREAS && LC.AREAS[area];
    A.areaSound = AREA_SOUND[(a && a.amb) || 'river'] || AREA_SOUND.river;
    A.applyArea();
  };
  A.applyArea = function () {
    if (!A.ctx || !A.riv) return;
    var t = A.ctx.currentTime, q = A.areaSound, r = A.riv;
    r.g.gain.setTargetAtTime(q.g, t, 0.8); r.bp.frequency.setTargetAtTime(q.bp, t, 0.8); r.lp.frequency.setTargetAtTime(q.lp, t, 0.8);
    r.lfo.frequency.setTargetAtTime(q.lfo, t, 0.8); r.lfoG.gain.setTargetAtTime(q.depth, t, 0.8);
  };
  A.bird = function (t) {
    var d = pan(A.amb, rnd(-0.8, 0.8)), kind = Math.random();
    if (kind < 0.35) {          // koel: rising "ko-el", the classic Southeast Asian morning call
      var base = rnd(700, 820);
      for (var i = 0; i < 2 + Math.floor(Math.random() * 3); i++) {
        A.tone(t + i * 0.55, 'sine', base * (1 + i * 0.06), base * 1.45 * (1 + i * 0.06), 0.32, 0.16, d);
      }
    } else if (kind < 0.7) {    // bulbul: bubbly warble
      var f = rnd(1800, 2400);
      for (var k = 0; k < 4; k++) A.tone(t + k * 0.09, 'sine', f * (k % 2 ? 1.25 : 1), f * (k % 2 ? 1.05 : 1.3), 0.08, 0.11, d);
    } else {                    // tiny sunbird chirps
      var g0 = rnd(3200, 4200);
      for (var j = 0; j < 3; j++) A.tone(t + j * 0.07, 'sine', g0, g0 * 0.8, 0.045, 0.07, d);
    }
  };
  A.cricket = function (t) {
    var d = pan(A.amb, rnd(-0.9, 0.9)), f = rnd(4200, 4800), n = 3 + Math.floor(Math.random() * 3);
    for (var r = 0; r < 2; r++) for (var i = 0; i < n; i++) A.tone(t + r * 0.32 + i * 0.035, 'sine', f, f * 0.98, 0.025, 0.05, d);
  };
  A.frog = function (t) {
    var d = pan(A.amb, rnd(-0.7, 0.7)), c = A.ctx, n = 2 + Math.floor(Math.random() * 3), f = rnd(150, 220);
    for (var i = 0; i < n; i++) {
      var o = c.createOscillator(), bp = c.createBiquadFilter(), g = c.createGain(), tt = t + i * 0.26;
      o.type = 'sawtooth'; o.frequency.setValueAtTime(f, tt); o.frequency.exponentialRampToValueAtTime(f * 0.8, tt + 0.12);
      bp.type = 'bandpass'; bp.frequency.value = 600; bp.Q.value = 3;
      g.gain.setValueAtTime(0.0001, tt); g.gain.exponentialRampToValueAtTime(0.2, tt + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, tt + 0.14);
      o.connect(bp); bp.connect(g); g.connect(d); o.start(tt); o.stop(tt + 0.16);
    }
  };

  // ------------------------------------------------------------- sequencer
  A.startMusic = function () {
    A.step = 0; A.next = A.ctx.currentTime + 0.4;
    A.nextBird = A.ctx.currentTime + 1.5; A.nextCricket = A.ctx.currentTime + 0.5; A.nextFrog = A.ctx.currentTime + 3;
    if (A.timer) clearInterval(A.timer);
    A.timer = setInterval(A.tick, 60);
  };
  A.tick = function () {
    var c = A.ctx; if (!c || c.state !== 'running') return;
    var now = c.currentTime;
    if (A.next < now - 0.5) A.next = now + 0.05;     // tab was asleep
    var song = A.night ? NIGHT : DAY, spb = 60 / song.bpm;
    while (A.next < now + 0.35) {
      if (A.musicOn) A.playStep(song, A.step, A.next, spb);
      A.next += spb; A.step++;
    }
    if (A.ambienceOn) {
      if (!A.night && now >= A.nextBird) { A.bird(now + 0.05); A.nextBird = now + rnd(2.5, 7) / A.areaSound.birds; }
      if (A.night && now >= A.nextCricket) { A.cricket(now + 0.05); A.nextCricket = now + rnd(0.5, 1.4); }
      if (A.night && now >= A.nextFrog) { A.frog(now + 0.05); A.nextFrog = now + rnd(3, 8); }
    }
  };
  A.playStep = function (song, step, t, spb) {
    var i = step % song.mel.length, bar = Math.floor(step / 8) % song.chords.length, M = A.music;
    var hum = rnd(-0.012, 0.012);
    if (step % 8 === 0) {
      var ch = song.chords[bar];
      A.pad(ch.map(function (d) { return A.freq(d - 5); }), t, spb * 8, A.night ? 0.05 : 0.045);
      A.bass(A.freq(ch[0] - 10), t, spb * 3.5, 0.16);
    }
    var d = song.mel[i];
    if (d !== null) {
      A.bell(A.freq(d), t + hum, spb * 3.4, A.night ? 0.075 : 0.085, M);
      if (!A.night && Math.random() < 0.35) A.bell(A.freq(d + 5), t + spb * 0.5 + hum, spb * 1.6, 0.022, M);   // soft echo
    }
    if (A.night && Math.random() < 0.12) A.bell(A.freq((d === null ? 0 : d) + 10), t + spb * 0.5, 2.2, 0.018, M);    // starlight
    if (i === song.mel.length - 1) A.gong(A.freq(-10), t + spb * 0.5, 7, 0.13, M);
  };
  A.setNight = function (b) { if (b !== A.night) { A.night = b; A.step = 0; } };

  A.toggleMusic = function () {
    A.musicOn = !A.musicOn;
    try { localStorage.setItem('littleCreature.music', A.musicOn ? 'on' : 'off'); } catch (e) { /* ignore */ }
    if (A.music) A.music.gain.setTargetAtTime(A.musicOn ? MUSIC_VOL : 0, A.ctx.currentTime, 0.3);
    return A.musicOn;
  };
  A.toggleAmbience = function () {
    A.ambienceOn = !A.ambienceOn;
    try { localStorage.setItem('littleCreature.ambience', A.ambienceOn ? 'on' : 'off'); } catch (e) { /* ignore */ }
    if (A.amb) A.amb.gain.setTargetAtTime(A.ambienceOn ? AMB_VOL : 0, A.ctx.currentTime, 0.3);
    return A.ambienceOn;
  };
  A.suspend = function () { if (A.ctx && A.ctx.state === 'running') A.ctx.suspend(); };
  A.resume = function () { if (A.ctx && A.ctx.state === 'suspended') A.ctx.resume(); };

  // ------------------------------------------------------------- sound effects (soft and short)
  A.sfx = function (name) {
    if (!A.ctx || A.ctx.state !== 'running') return;
    var t = A.ctx.currentTime + 0.01, i;
    switch (name) {
      case 'till': A.noise(t, 0.12, 0.3, 'lowpass', 700); A.tone(t, 'sine', 110, 55, 0.12, 0.25); break;
      case 'water': A.noise(t, 0.35, 0.18, 'bandpass', 1400, 500); break;
      case 'plant': A.tone(t, 'sine', 420, 760, 0.09, 0.16); break;
      case 'harvest': [0, 2, 4].forEach(function (d, k) { A.bell(A.freq(d + 5), t + k * 0.07, 0.6, 0.14); }); break;
      case 'coin': A.bell(A.freq(9), t, 0.25, 0.08); A.bell(A.freq(11), t + 0.06, 0.35, 0.08); break;
      case 'chime': [0, 1, 2, 3, 5].forEach(function (d, k) { A.bell(A.freq(d + 5), t + k * 0.09, 1.2, 0.11); }); break;
      case 'eat': A.noise(t, 0.06, 0.2, 'lowpass', 1800); A.noise(t + 0.12, 0.06, 0.2, 'lowpass', 1800); break;
      case 'pet': A.bell(A.freq(7), t, 0.7, 0.11); A.bell(A.freq(9), t + 0.1, 0.7, 0.1); break;
      case 'error': A.tone(t, 'triangle', 220, 180, 0.14, 0.08); break;
      case 'click': A.tone(t, 'sine', 1500, 1500, 0.03, 0.04); break;
      case 'cook': A.noise(t, 0.6, 0.1, 'highpass', 2500); A.bell(A.freq(4), t + 0.5, 0.8, 0.1); break;
      case 'shake': A.noise(t, 0.3, 0.2, 'bandpass', 3000, 1500); break;
      case 'stage': for (i = 0; i < 8; i++) A.bell(A.freq(i + 3), t + i * 0.1, 1.6, 0.1); A.gong(A.freq(-10), t + 0.85, 5, 0.25); break;
      case 'sleep': [4, 2, 0, -2].forEach(function (d, k) { A.bell(A.freq(d + 5), t + k * 0.28, 1.4, 0.1); }); break;
      case 'offer': A.bell(A.freq(5), t, 1.8, 0.11); A.bell(A.freq(8), t + 0.15, 1.8, 0.08); A.gong(A.freq(-5), t, 3, 0.1); break;
      case 'moo': A.tone(t, 'sawtooth', 130, 95, 0.8, 0.04); break;
      case 'cluck': A.tone(t, 'square', 700, 500, 0.05, 0.03); A.tone(t + 0.09, 'square', 760, 520, 0.05, 0.03); break;
      case 'sad': A.tone(t, 'sine', 520, 300, 0.45, 0.08); break;
      case 'levelup': [0, 2, 4, 5, 7].forEach(function (d, k) { A.bell(A.freq(d + 5), t + k * 0.07, 1.1, 0.11); }); A.gong(A.freq(-5), t + 0.4, 2.5, 0.12); break;
      case 'cast': A.noise(t, 0.25, 0.14, 'bandpass', 2400, 800); A.tone(t + 0.3, 'sine', 700, 260, 0.12, 0.12); break;
      case 'bite': A.tone(t, 'sine', 620, 200, 0.1, 0.18); A.tone(t + 0.14, 'sine', 560, 180, 0.1, 0.14); break;
      case 'catch': A.noise(t, 0.3, 0.2, 'bandpass', 1600, 600); [0, 2, 4, 7].forEach(function (d, k) { A.bell(A.freq(d + 5), t + 0.15 + k * 0.08, 0.9, 0.1); }); break;
      case 'reel': A.tone(t, 'square', 1200, 1100, 0.025, 0.03); break;
      case 'build': [0, 0.18, 0.36, 0.6].forEach(function (d) { A.tone(t + d, 'triangle', 180, 120, 0.09, 0.22); A.noise(t + d, 0.05, 0.12, 'lowpass', 900); }); break;
      case 'buy': A.bell(A.freq(8), t, 0.3, 0.08); A.bell(A.freq(10), t + 0.05, 0.4, 0.08); break;
    }
  };
})(window.LC);
