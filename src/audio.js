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
  // v1.6: a volume level (0 to 1) for each part of the sound, set in Pause > Sound & music
  var VOL_KEY = 'littleCreature.vol';
  A.vol = { music: 1, battle: 0.7, sfx: 1, amb: 1 };
  try {
    A.musicOn = localStorage.getItem('littleCreature.music') !== 'off';
    A.ambienceOn = localStorage.getItem('littleCreature.ambience') !== 'off';
    var sv = JSON.parse(localStorage.getItem(VOL_KEY) || 'null');
    if (sv) Object.keys(A.vol).forEach(function (k) { if (typeof sv[k] === 'number') A.vol[k] = Math.max(0, Math.min(1, sv[k])); });
  } catch (e) { /* ignore */ }

  var BASE = 220;
  var MUSIC_VOL = 0.34, AMB_VOL = 0.22, SFX_VOL = 0.5, BATTLE_VOL = 0.3;
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
    if (A.ctx) { A.resume(); return; }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try { A.ctx = new AC(); } catch (e) { return; }
    var c = A.ctx;
    A.master = c.createGain(); A.master.gain.value = 0.75; A.master.connect(c.destination);
    // generated hall reverb
    A.verb = c.createConvolver();
    A.verb.buffer = makeImpulse(c, LC.MOBILE ? 0.8 : 3.4, 2.4, LC.MOBILE ? 1 : 2);
    A.verbIn = c.createGain(); A.verbIn.gain.value = 1;
    A.verbIn.connect(A.verb); A.verb.connect(A.master);
    // buses
    A.music = c.createGain(); A.music.gain.value = A.musicOn ? MUSIC_VOL * A.vol.music : 0;
    A.musicLP = c.createBiquadFilter(); A.musicLP.type = 'lowpass'; A.musicLP.frequency.value = 20000; A.music.connect(A.musicLP);
    var mDry = c.createGain(); mDry.gain.value = 0.62; A.musicLP.connect(mDry); mDry.connect(A.master);
    var mWet = c.createGain(); mWet.gain.value = 0.55; A.musicLP.connect(mWet); mWet.connect(A.verbIn);
    A.amb = c.createGain(); A.amb.gain.value = A.ambienceOn ? AMB_VOL * A.vol.amb : 0;
    A.amb.connect(A.master);
    var aWet = c.createGain(); aWet.gain.value = 0.25; A.amb.connect(aWet); aWet.connect(A.verbIn);
    A.sfxBus = c.createGain(); A.sfxBus.gain.value = SFX_VOL * A.vol.sfx; A.sfxBus.connect(A.master);
    // v1.6: the battle song has its own bus (and volume), with a gentle top end so it never turns harsh
    A.battleBus = c.createGain(); A.battleBus.gain.value = 0;
    var bLP = c.createBiquadFilter(); bLP.type = 'lowpass'; bLP.frequency.value = 5200; A.battleBus.connect(bLP);
    bLP.connect(A.master);
    var bWet = c.createGain(); bWet.gain.value = 0.22; bLP.connect(bWet); bWet.connect(A.verbIn);
    A.battleOut = bLP;
    var sWet = c.createGain(); sWet.gain.value = 0.12; A.sfxBus.connect(sWet); sWet.connect(A.verbIn);
    var len = c.sampleRate * 2, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    A.noiseBuf = buf;
    A.startRiver();
    c.addEventListener('statechange', syncMusicTimer);
    A.startMusic();
  };

  function makeImpulse(c, seconds, decay, channels) {
    var rate = c.sampleRate, len = Math.floor(rate * seconds), ir = c.createBuffer(channels, len, rate);
    for (var ch = 0; ch < channels; ch++) {
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
  function graveGroan(t) {
    var c = A.ctx, voice = c.createOscillator(), level = c.createGain(), pitch = 60 + Math.random() * 18;
    voice.type = 'sawtooth';
    voice.frequency.setValueAtTime(pitch, t);
    voice.frequency.exponentialRampToValueAtTime(pitch * 1.28, t + 0.32);
    voice.frequency.exponentialRampToValueAtTime(pitch * 0.72, t + 0.92);
    [320, 810].forEach(function (f, i) {
      var throat = c.createBiquadFilter();
      throat.type = 'bandpass'; throat.Q.value = i ? 2 : 1.55;
      throat.frequency.setValueAtTime(f, t);
      throat.frequency.exponentialRampToValueAtTime(f * 0.72, t + 0.95);
      voice.connect(throat); throat.connect(level);
    });
    level.gain.setValueAtTime(0.0001, t);
    level.gain.exponentialRampToValueAtTime(0.2, t + 0.17);
    level.gain.exponentialRampToValueAtTime(0.11, t + 0.47);
    level.gain.exponentialRampToValueAtTime(0.17, t + 0.62);
    level.gain.exponentialRampToValueAtTime(0.0001, t + 1.05);
    level.connect(A.sfxBus); voice.start(t); voice.stop(t + 1.06);
    A.noise(t + 0.56, 0.45, 0.065, 'bandpass', 480, 250);
  }

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
    wind: { g: 0.26, bp: 900, lp: 2400, lfo: 0.05, depth: 0.2, birds: 0.35 },
    deep: { g: 0.42, bp: 220, lp: 480, lfo: 0.06, depth: 0.25, birds: 0.001, muffle: true },
    cave: { g: 0.3, bp: 120, lp: 320, lfo: 0.035, depth: 0.2, birds: 0.001, muffle: true, drips: true }   // v1.5: the haunted mine
  };
  // v1.5: monsoon rain, a soft hiss on top of the nature bed
  A.setRain = function (on) {
    A.rainOn = !!on;
    if (!A.ctx || !A.noiseBuf) return;
    var c = A.ctx, t = c.currentTime;
    if (!A.rainOn) {
      if (A.rain) {
        A.rain.g.gain.setTargetAtTime(0, t, 0.2);
        A.rain.source.stop(t + 1);
        A.rain = null;
      }
      return;
    }
    if (!A.rain) {
      var s = c.createBufferSource(), hp = c.createBiquadFilter(), g = c.createGain();
      s.buffer = A.noiseBuf; s.loop = true; hp.type = 'highpass'; hp.frequency.value = 1800; g.gain.value = 0;
      s.connect(hp); hp.connect(g); g.connect(A.amb);
      s.onended = function () { s.disconnect(); hp.disconnect(); g.disconnect(); };
      s.start(); A.rain = { source: s, g: g };
    }
    A.rain.g.gain.setTargetAtTime(0.13, t, 0.8);
  };
  A.drip = function (t) {
    var d = pan(A.amb, rnd(-0.8, 0.8)), f = rnd(900, 1500);
    A.tone(t, 'sine', f, f * 0.45, 0.09, 0.12, d);
    if (Math.random() < 0.25) {   // a far-off sigh in the dark
      var c = A.ctx, s = c.createBufferSource(), bp = c.createBiquadFilter(), g = c.createGain();
      s.buffer = A.noiseBuf; bp.type = 'bandpass'; bp.frequency.value = rnd(300, 500); bp.Q.value = 6;
      g.gain.setValueAtTime(0.0001, t + 0.3); g.gain.exponentialRampToValueAtTime(0.07, t + 1.3); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.8);
      s.connect(bp); bp.connect(g); g.connect(d); s.start(t + 0.3); s.stop(t + 3);
    }
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
    if (A.musicLP) A.musicLP.frequency.setTargetAtTime(q.muffle ? 700 : 20000, t, 0.6);   // the music sounds far away under the sea
    if (A.rainOn && !A.rain) A.setRain(true);
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
  function syncMusicTimer() {
    var active = A.ctx && A.ctx.state === 'running' && !document.hidden;
    if (active && !A.timer) A.timer = setInterval(A.tick, 100);
    else if (!active && A.timer) { clearInterval(A.timer); A.timer = null; }
  }

  A.startMusic = function () {
    A.step = 0; A.next = A.ctx.currentTime + 0.4;
    A.nextBird = A.ctx.currentTime + 1.5; A.nextCricket = A.ctx.currentTime + 0.5; A.nextFrog = A.ctx.currentTime + 3;
    syncMusicTimer();
  };
  A.tick = function () {
    var c = A.ctx; if (!c || c.state !== 'running') return;
    var now = c.currentTime;
    if (A.next < now - 0.5) A.next = now + 0.05;     // tab was asleep
    var song = A.night ? NIGHT : DAY, spb = 60 / song.bpm, ducked = A.battleDucks();
    while (A.next < now + 0.35) {
      if (A.musicOn && A.vol.music > 0 && !ducked) A.playStep(song, A.step, A.next, spb);
      A.next += spb; A.step++;
    }
    // v1.6: the battle song (it plays on for a few seconds after a fight, while it fades out)
    var bPlay = A.musicOn && A.vol.battle > 0 && (A.battleOn || A.preview || now < (A.battleUntil || 0));
    if (!bPlay) A.bNext = now + 0.05;
    else {
      if (A.bNext < now - 0.5) A.bNext = now + 0.05;
      var bs = 60 / BATTLE.bpm / 2;
      while (A.bNext < now + 0.3) { A.battleStep(A.bStep, A.bNext, bs); A.bNext += bs; A.bStep++; }
    }
    if (A.ambienceOn && A.vol.amb > 0) {
      if (!A.night && now >= A.nextBird) { A.bird(now + 0.05); A.nextBird = now + rnd(2.5, 7) / A.areaSound.birds; }
      if (A.night && now >= A.nextCricket) { A.cricket(now + 0.05); A.nextCricket = now + rnd(0.5, 1.4); }
      if (A.night && now >= A.nextFrog && !A.areaSound.drips) { A.frog(now + 0.05); A.nextFrog = now + rnd(3, 8); }
      if (A.areaSound.drips && now >= (A.nextDrip || 0)) { A.drip(now + 0.05); A.nextDrip = now + rnd(1.2, 4); }
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

  // ------------------------------------------------------------- v1.6: the battle song
  // A driving kendang (two-headed drum) groove, a gong every two bars, a low ostinato and a pelog-flavoured
  // saron melody. Built from tuned tones (only the tiniest touch of noise in the drum slap), so it stays
  // musical rather than hissy. It crossfades with the calm music and has its own volume.
  var BATTLE = {
    bpm: 112,
    mel: [5, null, 6, 7, 8, null, 7, 6, 5, null, 3, null, 2, 3, 5, null,
          5, null, 6, 7, 8, null, 10, null, 9, 8, 7, null, 6, null, 5, null,
          3, null, 5, 6, 7, null, 6, 5, 3, null, 2, null, 0, 2, 3, null,
          5, 7, 8, null, 10, null, 9, 8, 7, null, 6, null, 5, null, null, null],
    drum: 'D.p.t.DpD.p.t.pp',            // D: the deep "dung" · t: the bright "tak" · p: a soft ghost tap
    bass: [[0, 0], [3, 0], [6, 3], [8, 0], [11, 0], [14, 2]],
    roots: [0, 0, -2, 1]
  };
  var PELOG = [0, 1, 3, 7, 8];
  function pel(d) { var o = Math.floor(d / 5), i = ((d % 5) + 5) % 5; return 196 * Math.pow(2, (o * 12 + PELOG[i]) / 12); }
  A.battleStep = function (step, t, s) {
    var B = A.battleBus, i = step % 16, bar = Math.floor(step / 16), root = BATTLE.roots[bar % 4], ch = BATTLE.drum[i];
    if (ch === 'D') { A.tone(t, 'sine', 150, 58, 0.24, 0.42, B); A.tone(t, 'triangle', 90, 50, 0.12, 0.12, B); }
    else if (ch === 't') { A.tone(t, 'triangle', 820, 460, 0.06, 0.16, B); A.noise(t, 0.025, 0.06, 'bandpass', 2600, null, B); }
    else if (ch === 'p') A.tone(t, 'sine', 330, 220, 0.07, 0.1, B);
    BATTLE.bass.forEach(function (b) { if (b[0] === i) A.tone(t, 'triangle', pel(root + b[1] - 10), pel(root + b[1] - 10) * 0.99, s * 2.2, 0.2, B); });
    var m = BATTLE.mel[step % BATTLE.mel.length];
    if (m !== null) A.bell(pel(m), t, s * 2.6, 0.075, B);
    if (A.battleBoss && m !== null && i % 4 === 0) A.bell(pel(m - 5), t, s * 3, 0.05, B);
    if (i === 0 && bar % 2 === 0) A.gong(pel(root - 10), t, 4.5, 0.2, B);
    if (i === 8 && bar % 2 === 1) A.gong(pel(root - 7), t, 2.2, 0.1, B);
    if (A.battleBoss && i === 0) [-10, -7].forEach(function (d) { A.tone(t, 'sine', pel(root + d), pel(root + d), s * 14, 0.05, B); });   // a dark drone for the guardian
  };
  A.battleDucks = function () { return (A.battleOn || A.preview) && A.vol.battle > 0; };
  A.setBattle = function (on, boss) {
    on = !!on; A.battleBoss = !!boss;
    if (on === !!A.battleOn) return;
    A.battleOn = on;
    var now = A.ctx ? A.ctx.currentTime : 0;
    if (on) { A.bStep = 0; A.bNext = now + 0.05; A.battleUntil = 0; } else A.battleUntil = now + 3.5;
    A.applyVolumes();
  };
  A.setPreview = function (on) {   // hear the battle song while choosing its volume
    if (!!on === !!A.preview) return;
    A.preview = !!on;
    var now = A.ctx ? A.ctx.currentTime : 0;
    if (on) { A.bStep = 0; A.bNext = now + 0.05; } else if (!A.battleOn) A.battleUntil = now + 2;
    A.applyVolumes();
  };

  // ------------------------------------------------------------- volumes
  A.applyVolumes = function () {
    if (!A.ctx || !A.music) return;
    var t = A.ctx.currentTime, v = A.vol, duck = A.battleDucks(), fight = (A.battleOn || A.preview) && A.musicOn;
    A.music.gain.setTargetAtTime(A.musicOn && !duck ? MUSIC_VOL * v.music : 0, t, duck ? 0.25 : 0.9);
    A.battleBus.gain.setTargetAtTime(fight ? BATTLE_VOL * v.battle : 0, t, fight ? 0.15 : 1.1);
    A.amb.gain.setTargetAtTime(A.ambienceOn ? AMB_VOL * v.amb : 0, t, 0.3);
    A.sfxBus.gain.setTargetAtTime(SFX_VOL * v.sfx, t, 0.05);
  };
  A.setVolume = function (kind, val) {
    A.vol[kind] = Math.round(Math.max(0, Math.min(1, val)) * 20) / 20;
    try { localStorage.setItem(VOL_KEY, JSON.stringify(A.vol)); } catch (e) { /* ignore */ }
    A.applyVolumes();
    return A.vol[kind];
  };

  A.toggleMusic = function () {
    A.musicOn = !A.musicOn;
    try { localStorage.setItem('littleCreature.music', A.musicOn ? 'on' : 'off'); } catch (e) { /* ignore */ }
    A.applyVolumes();
    return A.musicOn;
  };
  A.toggleAmbience = function () {
    A.ambienceOn = !A.ambienceOn;
    try { localStorage.setItem('littleCreature.ambience', A.ambienceOn ? 'on' : 'off'); } catch (e) { /* ignore */ }
    A.applyVolumes();
    return A.ambienceOn;
  };
  A.suspend = function () {
    if (A.timer) { clearInterval(A.timer); A.timer = null; }
    if (A.ctx && A.ctx.state === 'running') A.ctx.suspend().catch(function () {});
  };
  A.resume = function () {
    if (!A.ctx || document.hidden || A.ctx.state === 'closed') return;
    if (A.ctx.state !== 'running') A.ctx.resume().catch(function () {});   // Safari can also be 'interrupted'
    else syncMusicTimer();
  };

  // ------------------------------------------------------------- sound effects (soft and short)
  A.sfx = function (name) {
    if (!A.ctx || A.ctx.state !== 'running' || !A.vol.sfx) return;
    var t = A.ctx.currentTime + 0.01, i;
    switch (name) {
      case 'till': A.noise(t, 0.12, 0.3, 'lowpass', 700); A.tone(t, 'sine', 110, 55, 0.12, 0.25); break;
      case 'water': A.noise(t, 0.35, 0.18, 'bandpass', 1400, 500); break;
      case 'plant': A.tone(t, 'sine', 420, 760, 0.09, 0.16); break;
      case 'harvest': [0, 2, 4].forEach(function (d, k) { A.bell(A.freq(d + 5), t + k * 0.07, 0.6, 0.14); }); break;
      case 'coin': A.bell(A.freq(9), t, 0.25, 0.08); A.bell(A.freq(11), t + 0.06, 0.35, 0.08); break;
      case 'chime': [0, 1, 2, 3, 5].forEach(function (d, k) { A.bell(A.freq(d + 5), t + k * 0.09, 1.2, 0.11); }); break;
      case 'familyBell': A.bell(1047, t, 1.25, 0.12); break;
      case 'graveStir': A.noise(t, 0.32, 0.14, 'bandpass', 530, 230); A.noise(t + 0.14, 0.19, 0.08, 'lowpass', 280); break;
      case 'graveGroan': graveGroan(t); break;
      case 'duneSnore': A.noise(t, 1.02, 0.11, 'bandpass', 130, 210); A.tone(t + 0.29, 'sine', 68, 48, 0.68, 0.09); break;
      case 'duneWake': A.tone(t, 'triangle', 74, 52, 0.73, 0.19); A.noise(t + 0.07, 0.56, 0.18, 'bandpass', 310, 160); break;
      case 'duneSwing': A.noise(t, 0.35, 0.25, 'bandpass', 450, 1130); A.tone(t, 'sine', 155, 47, 0.34, 0.13); break;
      case 'duneThud': A.tone(t, 'sine', 92, 26, 0.44, 0.34); A.noise(t + 0.02, 0.43, 0.24, 'lowpass', 640, 182); break;
      case 'familyBells': A.bell(1047, t, 1.1, 0.11); A.bell(698, t + 0.48, 1.55, 0.12); break;
      case 'familyTune': [0, 2, 3].forEach(function (d, k) {
        var f = A.freq(d + 1);
        A.tone(t + k * 0.32, 'sine', f * 0.998, f, k === 2 ? 0.48 : 0.27, 0.1);
      }); break;
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
      case 'bell': A.bell(2100, t, 0.5, 0.07); A.bell(2100, t + 0.16, 0.6, 0.07); break;   // kring kring!
      case 'honk': A.tone(t, 'square', 330, 320, 0.16, 0.05); A.tone(t + 0.2, 'square', 330, 320, 0.22, 0.05); break;
      case 'dive': A.noise(t, 0.5, 0.25, 'lowpass', 900); for (i = 0; i < 6; i++) A.tone(t + 0.2 + i * 0.08, 'sine', 300 + i * 90, 700 + i * 90, 0.06, 0.05); break;
      case 'buy': A.bell(A.freq(8), t, 0.3, 0.08); A.bell(A.freq(10), t + 0.05, 0.4, 0.08); break;
      // v1.5
      case 'swing': A.noise(t, 0.12, 0.2, 'bandpass', 2600, 1200); break;
      case 'hit': A.noise(t, 0.08, 0.3, 'lowpass', 1200); A.tone(t, 'square', 220, 110, 0.08, 0.06); break;
      case 'hurt': A.tone(t, 'sawtooth', 300, 140, 0.22, 0.07); A.noise(t, 0.1, 0.2, 'lowpass', 800); break;
      case 'poof': A.noise(t, 0.4, 0.22, 'bandpass', 600, 300); A.tone(t, 'sine', 400, 900, 0.3, 0.06); break;
      case 'mine': A.tone(t, 'triangle', 1600, 1500, 0.06, 0.1); A.noise(t, 0.08, 0.2, 'highpass', 3000); A.tone(t + 0.12, 'triangle', 1400, 1300, 0.05, 0.06); break;
      case 'wind': A.noise(t, 0.9, 0.18, 'bandpass', 900, 400); break;
      case 'spin': for (i = 0; i < 6; i++) A.tone(t + i * 0.05, 'triangle', 500 + i * 40, 520 + i * 40, 0.04, 0.04); break;
      case 'crow': A.tone(t, 'sawtooth', 600, 900, 0.12, 0.04); A.tone(t + 0.14, 'sawtooth', 900, 700, 0.18, 0.04); A.tone(t + 0.34, 'sawtooth', 700, 500, 0.3, 0.035); break;
      case 'quack': A.tone(t, 'sawtooth', 400, 300, 0.08, 0.05); A.tone(t + 0.12, 'sawtooth', 380, 280, 0.08, 0.05); break;
      case 'bleat': A.tone(t, 'sawtooth', 500, 460, 0.45, 0.035); break;
      case 'hatch': A.tone(t, 'square', 1800, 1700, 0.02, 0.05); A.tone(t + 0.1, 'square', 1700, 1600, 0.02, 0.05); [0, 2, 4].forEach(function (d, k) { A.bell(A.freq(d + 9), t + 0.25 + k * 0.08, 0.6, 0.09); }); break;
      case 'cheer': A.noise(t, 1.2, 0.2, 'bandpass', 1300, 700); [0, 4, 7].forEach(function (d, k) { A.bell(A.freq(d + 5), t + k * 0.1, 1, 0.1); }); break;
      case 'gate': for (i = 0; i < 7; i++) A.bell(A.freq(i * 2), t + i * 0.06, 1.4, 0.07); break;
      case 'drum': A.tone(t, 'sine', 140, 60, 0.25, 0.3); A.noise(t, 0.05, 0.15, 'lowpass', 500); break;
      case 'strain': A.tone(t, 'sawtooth', 120, 100, 0.2, 0.05); break;
      // v1.6
      case 'stone': A.tone(t, 'sine', 90, 40, 0.7, 0.35); for (i = 0; i < 5; i++) A.tone(t + 0.05 + i * 0.07, 'triangle', 1400 - i * 150, 700 - i * 60, 0.05, 0.05); A.bell(A.freq(-3), t + 0.1, 1.4, 0.08); break;
      case 'crumble': for (i = 0; i < 4; i++) A.tone(t + i * 0.06, 'triangle', 500 - i * 60, 200, 0.06, 0.05); break;
      case 'lunge': A.tone(t, 'sine', 260, 520, 0.12, 0.05); break;
      case 'restu': [0, 2, 4, 7, 9].forEach(function (d, k) { A.bell(A.freq(d + 5), t + k * 0.12, 2, 0.1); }); A.gong(A.freq(-5), t, 5, 0.22); break;
      case 'reunion': [4, 2, 0, 2, 4, 5, 7].forEach(function (d, k) { A.bell(A.freq(d + 5), t + k * 0.32, 2.4, 0.09); }); A.gong(A.freq(-10), t + 2.2, 6, 0.2); break;
      // v1.7: Badang and the river hantu
      case 'splash': A.noise(t, 0.5, 0.26, 'bandpass', 900, 400); A.noise(t + 0.08, 0.3, 0.12, 'highpass', 3000); break;
      case 'giggle': for (i = 0; i < 5; i++) A.tone(t + i * 0.07, 'sine', 1300 + (i % 2) * 260, 1100 + (i % 2) * 260, 0.05, 0.05); break;
      case 'bleurgh': A.tone(t, 'sawtooth', 160, 90, 0.5, 0.05); A.noise(t + 0.1, 0.35, 0.14, 'lowpass', 600); break;
      case 'gulp': A.tone(t, 'sine', 300, 110, 0.18, 0.18); break;
      case 'grow': A.tone(t, 'sine', 60, 50, 1.4, 0.3); for (i = 0; i < 6; i++) A.tone(t + 0.15 * i, 'triangle', 180 + i * 70, 220 + i * 70, 0.14, 0.05); A.gong(A.freq(-12), t + 0.9, 3, 0.18); break;
      case 'punch': A.tone(t, 'sine', 120, 45, 0.2, 0.4); A.noise(t, 0.1, 0.3, 'lowpass', 900); break;
      case 'dash': A.noise(t, 0.22, 0.22, 'bandpass', 2200, 900); A.tone(t, 'sine', 300, 700, 0.14, 0.06); break;
      case 'throw': A.noise(t, 0.5, 0.18, 'bandpass', 1800, 900); A.tone(t, 'sine', 500, 180, 0.4, 0.04); break;
      case 'bowRelease': A.tone(t, 'triangle', 310, 115, 0.18, 0.1); A.noise(t + 0.03, 0.2, 0.1, 'bandpass', 2100, 750); break;
      case 'slingRelease': A.tone(t, 'sine', 480, 230, 0.14, 0.12); A.noise(t, 0.08, 0.08, 'bandpass', 1400, 650); break;
      // v2.4.1: Nek Lampir
      case 'toss': A.noise(t, 0.16, 0.12, 'bandpass', 2400, 1200); break;
      case 'sneeze': A.tone(t, 'sine', 380, 520, 0.16, 0.05); A.noise(t + 0.16, 0.18, 0.22, 'highpass', 2200); break;   // ah... CHOO!
      case 'blink': A.noise(t, 0.3, 0.16, 'bandpass', 700, 300); A.tone(t, 'sine', 900, 300, 0.22, 0.05); break;
      case 'herbs': A.noise(t, 0.4, 0.1, 'bandpass', 3200, 1200); [0, 3, 7].forEach(function (d, k) { A.bell(A.freq(d + 2), t + k * 0.08, 0.9, 0.08); }); break;
    }
  };
})(window.LC);
