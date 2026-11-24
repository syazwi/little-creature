/* UI, Chapter 17: Penyamun Empat Puluh? (v3.17): the goal line, the checklist entry, the one-time "What's new" note,
 * and three screens:
 *  - openMantera17: say the cliff's voice password. The microphone only measures how loud you are, moment by moment,
 *    on this device (it cannot understand words, and nothing is recorded or sent): five words with their rises and dips
 *    open the rock. Without a microphone (or if it is refused), tap the words in order instead. (v3.17.5: an Allow
 *    microphone step first, which the Android app answers through window.LCAndroid, then a live meter.)
 *  - openBatu17: Tok Batu's stone dial. Type today's word in the gang's code, with the Roda Rahsia beside it.
 *  - openDiari17: Kopak's coded diary. Turn the Roda Rahsia until the words make sense.
 * Mixed into LC.UIScene. See penyamun.js. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var C = LC.C17, X = LC.PENYAMUN_TEXT, U = LC.UIScene.prototype;
  var ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // ---------------------------------------------------------------- the goal line
  var goal = LC.ch5Goal;
  LC.ch5Goal = function () {
    var S = LC.State.s;
    if (!S || !C.ready(S) || C.step(S) >= C.end) return goal.apply(this, arguments);
    var s = C.step(S), clue = C.count(S, 'c17clue'), caught = C.count(S, 'c17caught');
    var t = [
      'Rest at the farm. Something is stirring in Kampung Tepian.',
      'Tok Penghulu is waiting at the gelanggang in Kampung Tepian. Things have been stolen!',
      'Someone is selling firewood at your farm, by the road.',
      'Go to Bukit Kapur (the eastern trail in Hutan Rimba) and hide in the bushes with Ali Baba.',
      'Say the mantera at the cliff door in Bukit Kapur: "' + C.mantera + '!"',
      'Stuck in the cave! Find today\'s word and the gang\'s code (' + clue + ' / 4 clues), then encrypt the word at Tok Batu\'s door. Tries left: ' + C.triesLeft(S) + '.',
      'Warn Tok Penghulu at the gelanggang in Kampung Tepian!',
      'Find the three thieves hiding in the jars (' + caught + ' / 3). Tap a jar and listen.',
      'Duel Panglima Garong in front of the gelanggang!'
    ][s];
    return 'Chapter 17: ' + t;
  };
  LC.CHAPTER_LIST.forEach(function (ch) { if (ch.n === 16) ch.next = 'Chapter 17 begins the day after: things go missing in Kampung Tepian.'; });
  LC.CHAPTER_LIST.push({ n: 17, key: 'ch17', end: C.end, name: 'Penyamun Empat Puluh?',
    steps: ['Rest at the farm', 'Tok Penghulu\'s news', 'Ali Baba\'s secret', 'Hide at Bukit Kapur', 'Say the mantera', 'Stuck in the cave',
      'Warn the kampung', 'Twelve jars', 'Panglima Garong'],
    next: 'Ali Baba brings firewood every morning, and Gua Empat Puluh keeps your things safe. More chapters are on the way.' });

  var prev = LC.NEWS, prior = null;
  try { prior = localStorage.getItem('littleCreature.newsSeen'); } catch (e) { /* storage blocked */ }
  LC.NEWS = {
    id: 'v3.17-ch17',
    lines: (prev && prior !== prev.id && prior !== 'v3.17-ch17' ? prev.lines : []).concat([
      { text: '✦ New: Chapter 17, Penyamun Empat Puluh? ✦  After Chapter 16, things vanish from Kampung Tepian, with a note from "the Forty". A shy firewood man named Ali Baba saw where they went...' },
      { text: 'Say the cliff\'s mantera out loud (your microphone, or tap the words), and crack the thieves\' secret code to get back out of their cave!' }
    ])
  };

  // ---------------------------------------------------------------- small pieces shared by the screens
  function button(ui, c, x, y, w, h, label, size, fn) {
    var g = ui.add.graphics();
    function draw(hot) {
      g.clear(); g.fillStyle(hot ? 0x6a4a26 : 0x3a2a1c, 1); g.fillRoundedRect(x, y, w, h, 6);
      g.lineStyle(2, hot ? 0xffd166 : 0xd9a94e, 1); g.strokeRoundedRect(x + 1, y + 1, w - 2, h - 2, 6);
    }
    draw(false);
    var t = ui.txt(x + w / 2, y + h / 2, label, size || 16, '#fbecc8', { ox: 0.5, oy: 0.5 });
    var hit = ui.add.rectangle(x, y, w, h, 0x000000, 0).setOrigin(0).setInteractive({ useHandCursor: true });
    hit.on('pointerdown', function () { draw(true); fn(); });
    hit.on('pointerup', function () { draw(false); });
    hit.on('pointerout', function () { draw(false); });
    c.add([g, t, hit]);
    return { g: g, t: t, hit: hit, draw: draw, show: function (v) { g.setVisible(v); t.setVisible(v); hit.setVisible(v); if (v) hit.setInteractive(); else hit.disableInteractive(); } };
  }
  function frame(ui, title, X0, Y0, Wd, Hd) {
    ui.closeModal();
    var c = ui.modalC(96, 0x000000, 0.6), bg = ui.add.graphics();
    ui.panel(bg, X0, Y0, Wd, Hd); c.add(bg);
    c.add(ui.txt(480, Y0 + 16, title, 24, '#ffd166', { ox: 0.5 }));
    return c;
  }
  // the Roda Rahsia: plain letters on the outside, the code on the turning inner ring
  function wheel(ui, c, cx, cy, R, key, onTurn) {
    var g = ui.add.graphics(); c.add(g);
    g.fillStyle(0x4a2e1a, 1); g.fillCircle(cx, cy, R + 16);
    g.fillStyle(0xe8d0a0, 1); g.fillCircle(cx, cy, R + 13);
    g.fillStyle(0x8a5a30, 1); g.fillCircle(cx, cy, R - 15);
    g.fillStyle(0xd8b46a, 1); g.fillCircle(cx, cy, R - 18);
    g.fillStyle(0x6a4428, 1); g.fillCircle(cx, cy, R - 50);
    g.fillStyle(0xe8c87a, 1); g.fillCircle(cx, cy, R - 54);
    var outer = [], inner = [], k = key || 0;
    for (var i = 0; i < 26; i++) {
      var an = -Math.PI / 2 + i * Math.PI * 2 / 26, co = Math.cos(an), si = Math.sin(an);
      outer.push(ui.txt(cx + co * R, cy + si * R, ABC[i], 16, '#3a2410', { ox: 0.5, oy: 0.5 }));
      inner.push(ui.txt(cx + co * (R - 34), cy + si * (R - 34), ABC[i], 15, '#8a1e1a', { ox: 0.5, oy: 0.5 }));
      g.lineStyle(1, 0xa87a44, 0.7); g.lineBetween(cx + Math.cos(an + Math.PI / 26) * (R - 15), cy + Math.sin(an + Math.PI / 26) * (R - 15), cx + Math.cos(an + Math.PI / 26) * (R + 13), cy + Math.sin(an + Math.PI / 26) * (R + 13));
    }
    c.add(outer); c.add(inner);
    var hubT = ui.txt(cx, cy - 12, 'TURN', 12, '#6a4428', { ox: 0.5, oy: 0.5 }), keyT = ui.txt(cx, cy + 10, '0', 30, '#3a2410', { ox: 0.5, oy: 0.5 });
    c.add([hubT, keyT]);
    c.add(ui.txt(cx, cy - R - 34, 'outside: plain letters   inside: the code', 12, '#cdb8a0', { ox: 0.5, oy: 0.5 }));
    var W = {
      key: function () { return k; },
      set: function (n) {
        k = ((n % 26) + 26) % 26;
        for (var j = 0; j < 26; j++) inner[j].setText(ABC[(j + k) % 26]);
        keyT.setText(String(k));
        if (onTurn) onTurn(k);
      },
      mark: function (letter) {   // light up a code letter on the inner ring, and its plain partner outside
        for (var j = 0; j < 26; j++) {
          var hot = letter && ABC[(j + k) % 26] === letter;
          inner[j].setColor(hot ? '#ffffff' : '#8a1e1a').setStroke('#1a120c', hot ? 4 : 0);
          outer[j].setColor(hot ? '#ffd166' : '#3a2410').setStroke('#1a120c', hot ? 4 : 0);
        }
      }
    };
    button(ui, c, cx - R - 4, cy + R + 26, 56, 34, '◀', 18, function () { LC.Audio.sfx('click'); W.set(k - 1); });
    button(ui, c, cx + R - 52, cy + R + 26, 56, 34, '▶', 18, function () { LC.Audio.sfx('click'); W.set(k + 1); });
    c.add(ui.txt(cx, cy + R + 43, 'turn the inner ring', 12, '#cdb8a0', { ox: 0.5, oy: 0.5 }));
    W.set(k);
    return W;
  }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  function devInputs(ui, modal, input) {
    if (!LC.DEVELOPER_HTML) return;
    var nextAt = 0;
    modal.devTick = function () {
      if (ui.time.now < nextAt) return;
      nextAt = ui.time.now + 105;
      input();
    };
  }

  Object.assign(U, {
    // ================================================================ the voice mantera at the cliff door
    openMantera17: function (onOk) {
      var self = this, X0 = 150, Y0 = 70, Wd = 660, Hd = 500, m, closed = false, mic = null, mode = null, ev = null, ducked = null;
      var c = frame(this, 'Say the mantera', X0, Y0, Wd, Hd);
      this.closeX(c, X0 + Wd, Y0, function () { if (self.modal === m) m.key('Escape'); });
      c.add(this.txt(480, Y0 + 60, 'The grey cliff waits. Say the gang\'s mantera:', 16, '#cdb8a0', { ox: 0.5 }));
      c.add(this.txt(480, Y0 + 92, '"' + C.mantera + '!"', 24, '#ffe8a0', { ox: 0.5, wrap: Wd - 60, align: 'center', stroke: 3 }));
      var msg = this.txt(480, Y0 + Hd - 96, '', 16, '#fbecc8', { ox: 0.5, wrap: Wd - 70, align: 'center' });
      var foot = this.txt(480, Y0 + Hd - 30, 'Your voice is only measured on this device. Nothing is recorded or sent.', 12, '#8a7a6a', { ox: 0.5 });
      var diag = this.txt(480, Y0 + Hd - 50, '', 11, '#7a6a5a', { ox: 0.5 });   // what the microphone did, for a bug report
      c.add([msg, foot, diag]);
      var body = null;
      function say(s, col) { msg.setText(s).setColor(col || '#fbecc8'); }
      function stopMic() {
        if (ev) { ev.remove(); ev = null; }
        if (mic) {
          try { mic.stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) { /* already stopped */ }
          try { mic.src.disconnect(); mic.an.disconnect(); } catch (e) { /* not connected */ }
          if (mic.own) try { var p = mic.ctx.close(); if (p && p.catch) p.catch(function () {}); } catch (e) { /* closed */ }
          mic = null;
        }
        if (ducked !== null && LC.Audio.master) LC.Audio.master.gain.value = ducked;   // the music comes back up
        ducked = null;
      }
      function stopStream(stream) { try { stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) { /* stopped */ } }
      function vis() { if (m && m.onVis) m.onVis(); }
      document.addEventListener('visibilitychange', vis);
      function win() {
        stopMic();
        say('GRRRRIND... the rock is moving!', '#9be15d');
        LC.Audio.sfx('chime');
        self.time.delayedCall(700, function () { if (self.modal === m) { close(); onOk(); } });
      }
      function clearBody() { if (body) body.destroy(); body = self.add.container(0, 0); c.add(body); }
      // ---- speak into the microphone. v3.17.5: on some phones the old way never asked for the microphone (or asked while
      // the game was paused behind Android's question) and then heard nothing. Now there is a clear Allow microphone step
      // first (the Android app asks Android itself, through window.LCAndroid, before the microphone starts), then a live
      // meter, so you can see the rock hearing you before you say the mantera. The microphone stays on between tries
      // while this screen is open, the music dips meanwhile, and anything that goes wrong says what to do.
      function speakMode() {
        mode = 'speak'; clearBody(); stopMic(); diag.setText('');
        var mine = body, st = 'ask', waitEv = null;
        var A = LC.PLATFORM === 'android' && window.LCAndroid && window.LCAndroid.askMic ? window.LCAndroid : null;
        function alive() { return !closed && mode === 'speak' && body === mine; }
        devInputs(self, m, tapMode);
        var meter = self.add.graphics(); body.add(meter);
        var dots = self.add.graphics(); body.add(dots);
        var hint = self.txt(480, Y0 + 142, '', 14, '#cdb8a0', { ox: 0.5, wrap: Wd - 90, align: 'center' }); body.add(hint);
        var mainB = button(self, body, 370, Y0 + 192, 220, 46, 'Allow microphone', 19, function () { press(); });
        button(self, body, 400, Y0 + 316, 160, 34, 'Tap the words instead', 13, function () { LC.Audio.sfx('click'); tapMode(); });
        var setB = A && A.openSettings ? button(self, body, 400, Y0 + 358, 160, 32, 'Open settings', 13, function () { LC.Audio.sfx('click'); A.openSettings(); }) : null;
        if (setB) setB.show(false);
        function drawMeter(level, beats, on) {
          meter.clear();
          meter.fillStyle(0x000000, 0.55); meter.fillRoundedRect(250, Y0 + 256, 460, 18, 6);
          meter.fillStyle(on ? 0x9be15d : 0x6a5a4a, 1); meter.fillRoundedRect(252, Y0 + 258, Math.max(4, Math.min(456, level * 456)), 14, 5);
          dots.clear();
          for (var i = 0; i < 12; i++) { dots.fillStyle(i < beats ? 0xffd166 : 0x3a2a1c, 1); dots.fillCircle(318 + i * 30, Y0 + 292, 7); }
        }
        drawMeter(0, 0, false);
        var LIVE = 'The bar moves when you make a sound. Press Speak, then say the whole mantera, word by word.';
        function offer(label, h) { mainB.t.setText(label); mainB.show(true); hint.setText(h || ''); }
        function busy(s) { st = 'asking'; mainB.show(false); say(s, '#cdb8a0'); }
        function ask() {
          st = 'ask';
          offer('Allow microphone', 'The cliff must hear you. Press Allow microphone, then choose Allow when your ' + (LC.MOBILE ? 'phone' : 'browser') + ' asks.');
        }
        function press() {
          if (st === 'live') { listen(); return; }
          if (st === 'ask' || st === 'retry') { LC.Audio.sfx('click'); permit(); }
        }
        m.speak = press;
        // ask for the microphone
        function permit() {
          if (setB) setB.show(false);
          diag.setText('');
          busy('Waiting for the microphone... choose Allow.');
          if (waitEv) waitEv.remove();
          waitEv = self.time.delayedCall(15000, function () {   // no answer at all: never leave the player stuck
            waitEv = null;
            if (!alive() || st !== 'asking' || mic) return;
            st = 'retry'; offer('Try again');
            say('No answer from the microphone. Look for a box asking to allow it, or press Try again.', '#ffb347');
          });
          if (A) {
            LC.onMicAnswer = function (a) {
              LC.onMicAnswer = null;
              if (!alive()) return;
              if (a === 'granted') whenSeen(openMic); else refused(a === 'blocked', 'Android: ' + a);
            };
            try { A.askMic(); return; } catch (e) { LC.onMicAnswer = null; /* an older app: ask the usual way below */ }
          }
          openMic();
        }
        function whenSeen(fn) {   // Android's question hides the game; start the microphone once it is back
          if (!document.hidden) { fn(); return; }
          function back() { if (document.hidden) return; document.removeEventListener('visibilitychange', back); if (alive()) fn(); }
          document.addEventListener('visibilitychange', back);
        }
        function openMic() {
          if (!alive() || mic) return;
          var md = navigator.mediaDevices;
          if (!md || !md.getUserMedia) { noMic('no getUserMedia'); return; }
          if (st !== 'asking') busy('Starting the microphone...');
          var p;
          try { p = md.getUserMedia({ audio: true }); } catch (e) { p = Promise.reject(e); }
          p.then(function (stream) {
            if (!alive() || mic) { stopStream(stream); return; }
            startMeter(stream);
          }, function (e) {
            if (alive() && !mic) failed(e);
          });
        }
        function failed(e) {
          var n = (e && e.name) || String(e || 'Error');
          if (waitEv) { waitEv.remove(); waitEv = null; }
          if (/NotAllowed|PermissionDenied|Security/.test(n)) {
            var blocked = false;
            try { blocked = !!A && A.micState && A.micState() === 'blocked'; } catch (x) { /* older app */ }
            refused(blocked, n);
            return;
          }
          if (/NotFound|DevicesNotFound|Overconstrained/.test(n)) { noMic(n); return; }
          diag.setText('(' + n + ')');
          st = 'retry'; offer('Try again');
          if (/NotReadable|TrackStart|Abort/.test(n)) say('The microphone is busy. Is another app using it (a call, or a voice note)? Close it, then press Try again.', '#ffb347');
          else say('The microphone did not start. Press Try again, or tap the words instead.', '#ffb347');
        }
        function refused(blocked, why) {
          if (waitEv) { waitEv.remove(); waitEv = null; }
          st = 'retry';
          if (A) {
            offer(blocked ? 'Try again' : 'Allow microphone');
            if (blocked && setB) setB.show(true);
            say(blocked ? 'The microphone is switched off for Little Creature. Press Open settings, then Permissions > Microphone > Allow. Come back and press Try again.'
              : 'The cliff cannot hear you without the microphone. Press Allow microphone and choose Allow, or tap the words instead.', '#ffb347');
          } else {
            offer('Try again');
            say(blocked ? 'Your browser has blocked the microphone here. Tap the lock (or settings) icon beside the web address, set Microphone to Allow, then press Try again.'
              : 'The microphone was not allowed. Press Try again and choose Allow. No box? Tap the lock beside the web address and allow the Microphone.', '#ffb347');
          }
          diag.setText(why ? '(' + why + ')' : '');
        }
        function noMic(why) {
          if (waitEv) { waitEv.remove(); waitEv = null; }
          diag.setText('(' + why + ')');
          mainB.show(false); hint.setText('');
          say('No microphone was found here. Tap the words instead!', '#ffb347');
          self.time.delayedCall(1600, function () { if (alive() && !mic) tapMode(); });
        }
        // the microphone is on: measure it on its own little audio graph, never recorded and never sent
        function startMeter(stream) {
          if (waitEv) { waitEv.remove(); waitEv = null; }
          var AC = window.AudioContext || window.webkitAudioContext, ctx = null, own = true, src, an;
          try { ctx = new AC(); } catch (e) { ctx = LC.Audio.ctx; own = false; }
          if (!ctx) { stopStream(stream); failed({ name: 'NoAudioContext' }); return; }
          try {
            src = ctx.createMediaStreamSource(stream); an = ctx.createAnalyser(); an.fftSize = 1024;
            var sink = ctx.createGain(); sink.gain.value = 0;   // silent: some browsers only run a graph that reaches the speakers
            src.connect(an); an.connect(sink); sink.connect(ctx.destination);
          } catch (e) {
            stopStream(stream);
            if (own) try { ctx.close(); } catch (x) { /* closed */ }
            failed(e); return;
          }
          mic = { stream: stream, ctx: ctx, src: src, an: an, own: own, buf: new Float32Array(an.fftSize), hist: [], env: 0, heard: 0, run: null, t: self.time.now };
          wake();
          if (LC.Audio.master && ducked === null) { ducked = LC.Audio.master.gain.value; LC.Audio.master.gain.value = ducked * 0.25; }
          stream.getAudioTracks().forEach(function (t) {
            t.onended = function () {   // the phone took the microphone away (a call?)
              if (!mic || mic.stream !== stream || !alive()) return;
              stopMic(); drawMeter(0, 0, false);
              st = 'retry'; offer('Try again');
              say('The microphone stopped. Press Try again.', '#ffb347');
            };
          });
          ev = self.time.addEvent({ delay: 30, loop: true, callback: tick });
          st = 'live'; offer('Speak', LIVE);
          say('The rock is listening.', '#9be15d');
          diag.setText('');
        }
        function wake() { if (mic && mic.ctx.state !== 'running' && mic.ctx.resume) { var p = mic.ctx.resume(); if (p && p.catch) p.catch(function () {}); } }
        function floorOf(h) {   // the quiet room: a low slice of the last few seconds
          if (h.length < 8) return 0.004;
          var s = h.slice().sort(function (a, b) { return a - b; });
          return Math.min(0.05, Math.max(0.002, s[Math.floor(s.length * 0.15)]));
        }
        function level(env) { return env > 0 ? Math.max(0, Math.min(1, (20 * Math.log(env) / Math.LN10 + 60) / 50)) : 0; }
        function tick() {
          if (!mic) return;
          var an = mic.an, sum = 0, n = an.fftSize, i;
          if (an.getFloatTimeDomainData) { an.getFloatTimeDomainData(mic.buf); for (i = 0; i < n; i++) sum += mic.buf[i] * mic.buf[i]; }
          else { var b = mic.bytes || (mic.bytes = new Uint8Array(n)); an.getByteTimeDomainData(b); for (i = 0; i < n; i++) { var v = (b[i] - 128) / 128; sum += v * v; } }
          var rms = Math.sqrt(sum / n), now = self.time.now;
          mic.env = mic.env * 0.55 + rms * 0.45;
          mic.heard = Math.max(mic.heard, rms);
          var env = mic.env, r = mic.run;
          if (!r) {
            mic.hist.push(env); if (mic.hist.length > 130) mic.hist.shift();
            drawMeter(level(env), 0, env > Math.max(floorOf(mic.hist) * 2.2, 0.008));
            if (!mic.heard && !mic.warned && now - mic.t > 2500) {
              mic.warned = true; wake();
              diag.setText('(no sound yet: audio ' + mic.ctx.state + ')');
              say('The microphone gives no sound yet. Is it muted? Press Speak and try anyway.', '#ffb347');
            }
            return;
          }
          var dt = Math.min(0.1, (now - r.at) / 1000), el = (now - r.t0) / 1000;
          r.at = now;
          if (env < r.floor) r.floor = Math.max(0.002, env);   // it was quieter than we thought
          var lo = Math.max(r.floor * 2.2, 0.008), hi = Math.max(r.floor * 3, 0.014), on = env > lo;
          if (on) { r.voiced += dt; if (r.first < 0) r.first = el; r.last = el; }
          // a syllable is a rise in loudness after a dip
          if (r.armed && env > Math.max(hi, r.trough * 1.5)) { r.beats++; r.armed = false; r.peak = env; }
          else if (!r.armed) { r.peak = Math.max(r.peak, env); if (env < r.peak * 0.7) { r.armed = true; r.trough = env; } }
          else r.trough = Math.min(r.trough, env);
          drawMeter(level(env), r.beats, on);
          if ((r.first >= 0 && el - r.last > 1.2) || el > 8) judge(r);
        }
        function listen() {
          if (!mic || mic.run) return;
          wake();
          var f = floorOf(mic.hist), now = self.time.now;
          mic.run = { t0: now, at: now, floor: f, beats: 0, armed: true, peak: 0, trough: f, voiced: 0, first: -1, last: -1 };
          mainB.show(false); hint.setText(''); diag.setText('');
          say('Listening... say it now!', '#ffe8a0');
        }
        function judge(r) {
          var span = r.first >= 0 ? r.last - r.first : 0;
          mic.run = null;
          diag.setText('heard ' + r.beats + ' beats, ' + r.voiced.toFixed(1) + ' s of voice');
          if (r.beats >= 3 && r.voiced >= 0.8 && span >= 0.9 && r.beats <= 40) { win(); return; }
          LC.Audio.sfx('error');
          drawMeter(0, r.beats, false);
          st = 'live'; offer('Speak', LIVE);
          if (!mic.heard) say('The rock heard no sound at all. Is the microphone muted, or busy in another app?', '#ffb347');
          else if (!r.beats || r.voiced < 0.3) say('The rock heard nothing. Say it louder, close to the ' + (LC.MOBILE ? 'phone' : 'microphone') + '!', '#ffb347');
          else if (r.voiced < 0.8 || span < 0.9) say('Too short! Say the whole mantera, all five words.', '#ffb347');
          else say('Say every word clearly: Niat... enson... matakaji... semar... ngiseng!', '#ffb347');
        }
        // away from the game (another app, the home screen): the microphone goes off, and comes back on return
        m.onVis = function () {
          if (!alive()) return;
          if (document.hidden) { if (mic) { stopMic(); drawMeter(0, 0, false); m.reopen = true; } return; }
          if (m.reopen) { m.reopen = false; openMic(); }
        };
        // already allowed? Then it starts at once, with no question. Blocked? Then say how to unblock it.
        ask();
        function known(s) {
          if (!alive() || mic || st !== 'ask') return;
          if (s === 'granted') openMic();
          else if (s === 'blocked') refused(true, 'blocked before');
        }
        if (A && A.micState) { try { known(A.micState()); } catch (e) { /* an older app */ } }
        else if (navigator.permissions && navigator.permissions.query) {
          try { navigator.permissions.query({ name: 'microphone' }).then(function (p) { known(p.state === 'denied' ? 'blocked' : p.state); }, function () {}); } catch (e) { /* not supported */ }
        }
      }
      // ---- or tap the five words in the right order
      function tapMode() {
        mode = 'tap'; clearBody(); stopMic(); m.onVis = null; m.reopen = false; diag.setText('');
        var seq = [], tiles = shuffle(C.words.concat(C.decoys));
        var line = self.txt(480, Y0 + 176, '', 20, '#ffe8a0', { ox: 0.5, wrap: Wd - 60, align: 'center', stroke: 3 });
        body.add(self.txt(480, Y0 + 146, 'Tap the words of the mantera in order:', 14, '#cdb8a0', { ox: 0.5 }));
        body.add(line);
        function show() { line.setText(seq.length ? seq.join(' ') + (seq.length < C.words.length ? ' ...' : '!') : '...'); }
        tiles.forEach(function (w, i) {
          var col = i % 4, row = Math.floor(i / 4), bw = 136;
          button(self, body, 480 - 2 * (bw + 10) + 5 + col * (bw + 10) + (row ? (bw + 10) / 2 : 0), Y0 + 220 + row * 52, bw, 42, (i + 1) + '. ' + w, 16, function () { pickTile(i); });
        });
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) button(self, body, 400, Y0 + 336, 160, 30, 'Use the microphone', 13, function () { LC.Audio.sfx('click'); speakMode(); });
        function pickTile(i) {
          var w = tiles[i];
          if (w === C.words[seq.length]) {
            seq.push(w); LC.Audio.sfx('click'); show();
            if (seq.length === C.words.length) win();
            return;
          }
          seq = []; show();
          LC.Audio.sfx('error');
          say(w === 'Bijan' ? '"Bijan"? Wrong story! Start again from the beginning.' : w === 'jagung' ? 'That is what Ali Baba would say. Start again!' : 'The rock does not budge. Start again from the beginning.', '#ffb347');
          self.cameras.main.shake(120, 0.004);
        }
        m.pick = pickTile; m.tiles = tiles;
        devInputs(self, m, function () {
          if (seq.length < C.words.length) pickTile(tiles.indexOf(C.words[seq.length]));
        });
        show();
      }
      function close() {
        closed = true; stopMic();
        document.removeEventListener('visibilitychange', vis);
        LC.onMicAnswer = null;
        c.destroy(); if (self.modal === m) self.modal = null;
      }
      m = {
        type: 'mantera17', close: close,
        key: function (code) {
          if (code === 'Escape') { close(); return; }
          if (mode === 'tap' && /^Digit[1-7]$/.test(code) && m.pick) { m.pick(parseInt(code.slice(5), 10) - 1); return; }
          if (mode === 'speak' && (code === 'Space' || code === 'Enter' || code === 'KeyE') && m.speak) m.speak();
        }
      };
      this.modal = m;
      var hasMic = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      if (hasMic) speakMode(); else tapMode();
      LC.Audio.sfx('click');
    },

    // ================================================================ Tok Batu's stone dial
    openBatu17: function (tryWord) {
      var self = this, X0 = 90, Y0 = 50, Wd = 780, Hd = 540, m, word = '', hasWheel = !!LC.State.count('roda_rahsia');
      var c = frame(this, 'Tok Batu\'s door', X0, Y0, Wd, Hd);
      this.closeX(c, X0 + Wd, Y0, function () { if (self.modal === m) m.key('Escape'); });
      var wl = null;
      if (hasWheel) wl = wheel(this, c, 290, 290, 120, 0);
      else c.add(this.txt(290, 290, 'You have no code wheel.\n\nSearch the cave:\nthere must be a way to\nwrite the gang\'s code.', 17, '#cdb8a0', { ox: 0.5, oy: 0.5, align: 'center' }));
      var face = this.add.image(670, Y0 + 92, 'batu17_0').setScale(3); c.add(face);
      var tries = this.txt(670, Y0 + 146, '', 15, '#cdb8a0', { ox: 0.5 });
      var box = this.add.graphics(); c.add([tries, box]);
      box.fillStyle(0x0c0a10, 0.9); box.fillRoundedRect(515, Y0 + 168, 310, 50, 8); box.lineStyle(2, 0x8a7a6a, 1); box.strokeRoundedRect(515, Y0 + 168, 310, 50, 8);
      var shown = this.txt(670, Y0 + 193, '', 28, '#ffe8a0', { ox: 0.5, oy: 0.5 });
      var msg = this.txt(670, Y0 + 452, 'Type today\'s word, in the gang\'s code.', 15, '#fbecc8', { ox: 0.5, wrap: 320, align: 'center' });
      c.add([shown, msg]);
      c.add(this.txt(480, Y0 + Hd - 22, this.touchOn ? 'Tap the letters · ◀ ▶ turn the wheel · X to close' : 'Type letters · Backspace · Enter to give the word · ← → turn the wheel · Esc', 12, '#8a7a6a', { ox: 0.5 }));
      function render() {
        shown.setText(word ? word.split('').join(' ') : '_ _ _ _ _');
        tries.setText('Tries left: ' + C.triesLeft(LC.State.s));
        if (wl) wl.mark(word.slice(-1));
      }
      function type(ch) { if (word.length >= 10) return; word += ch; LC.Audio.sfx('click'); render(); }
      function back() { word = word.slice(0, -1); LC.Audio.sfx('click'); render(); }
      function give() {
        if (!word) { msg.setText('Tok Batu waits. He is very good at waiting.'); return; }
        var r = tryWord(word) || {};
        msg.setText(r.msg || '').setColor(r.ok ? '#9be15d' : '#ffb347');
        if (r.ok) {
          face.setTexture('batu17_0');
          self.tweens.add({ targets: face, scale: 3.3, duration: 160, yoyo: true });
          self.time.delayedCall(1100, function () { if (self.modal === m) { close(); self.world.penyamunLines(X.free); } });
          return;
        }
        if (r.nap) { face.setTexture('batu17_1'); self.time.delayedCall(2200, function () { if (face.active) face.setTexture('batu17_0'); }); }
        self.tweens.add({ targets: face, x: face.x + 4, duration: 50, yoyo: true, repeat: 3 });
        word = ''; render();
      }
      ABC.split('').forEach(function (ch, i) {
        var col = i % 7, row = Math.floor(i / 7);
        button(self, c, 512 + col * 46, Y0 + 234 + row * 46, 40, 38, ch, 18, function () { type(ch); });
      });
      button(self, c, 512 + 5 * 46, Y0 + 234 + 3 * 46, 40, 38, '⌫', 16, back);
      button(self, c, 512 + 6 * 46, Y0 + 234 + 3 * 46, 40, 38, 'OK', 14, give);
      function close() { c.destroy(); if (self.modal === m) self.modal = null; }
      m = {
        type: 'batu17', close: close,
        key: function (code) {
          if (code === 'Escape') { close(); return; }
          var k = /^Key([A-Z])$/.exec(code);
          if (k) { type(k[1]); return; }
          if (code === 'Backspace' || code === 'Delete') { back(); return; }
          if (code === 'Enter' || code === 'NumpadEnter') { give(); return; }
          if (wl && (code === 'ArrowLeft' || code === 'ArrowDown')) { wl.set(wl.key() - 1); LC.Audio.sfx('click'); render(); }
          if (wl && (code === 'ArrowRight' || code === 'ArrowUp')) { wl.set(wl.key() + 1); LC.Audio.sfx('click'); render(); }
        },
        give: give, wheel: wl, typeWord: function (s) { String(s).toUpperCase().split('').forEach(function (ch) { if (ABC.indexOf(ch) >= 0) type(ch); }); }
      };
      this.modal = m;
      devInputs(self, m, function () {
        if (C.step(LC.State.s) !== 5) return;
        if (wl && wl.key() !== C.key) m.key(wl.key() < C.key ? 'ArrowRight' : 'ArrowLeft');
        else if (!C.code.startsWith(word)) m.key('Backspace');
        else if (word.length < C.code.length) m.key('Key' + C.code[word.length]);
        else m.key('Enter');
      });
      render();
      LC.Audio.sfx('click');
    },

    // ================================================================ Kopak's coded diary
    openDiari17: function (onSolved) {
      var self = this, X0 = 70, Y0 = 50, Wd = 820, Hd = 540, m, solved = false;
      var c = frame(this, 'Kopak\'s diary', X0, Y0, Wd, Hd);
      this.closeX(c, X0 + Wd, Y0, function () { if (self.modal === m) m.key('Escape'); });
      var page = this.add.graphics(); c.add(page);
      page.fillStyle(0xf0e4c8, 1); page.fillRoundedRect(470, Y0 + 66, 390, 380, 6); page.fillStyle(0xd8c8a4, 1); page.fillRect(470, Y0 + 66, 6, 380);
      var coded = C.diary.map(function (d) { return C.shift(d[0], C.key); });
      var lines = coded.map(function (s, i) { return self.txt(492, Y0 + 84 + i * 92, s, 17, '#6a3a5a', { wrap: 356 }); });
      var trans = C.diary.map(function (d, i) { return self.txt(492, Y0 + 130 + i * 92, '', 13, '#3a6a3a', { wrap: 356 }); });
      c.add(lines); c.add(trans);
      var msg = this.txt(665, Y0 + 456, 'Turn the Roda Rahsia until the words make sense.', 15, '#fbecc8', { ox: 0.5, wrap: 400, align: 'center' });
      c.add(msg);
      var doneB = null;
      var wl = wheel(this, c, 270, 290, 120, 0, function (k) {
        lines.forEach(function (t, i) { t.setText(C.shift(coded[i], -k)); });
        var ok = k === C.key;
        lines.forEach(function (t) { t.setColor(ok ? '#1a120c' : '#6a3a5a'); });
        trans.forEach(function (t, i) { t.setText(ok ? '(' + C.diary[i][1] + ')' : ''); });
        if (ok && !solved) { solved = true; LC.Audio.sfx('chime'); msg.setText('You can read it! Every letter was four along.').setColor('#9be15d'); if (doneB) doneB.show(true); }
      });
      doneB = button(this, c, 600, Y0 + Hd - 54, 130, 36, 'Done', 16, function () { finish(); });
      doneB.show(solved);
      function finish() { var was = solved; close(); if (was) onSolved(); }
      function close() { c.destroy(); if (self.modal === m) self.modal = null; }
      m = {
        type: 'diari17', close: function () { finish(); },
        key: function (code) {
          if (code === 'Escape') { finish(); return; }
          if ((code === 'Enter' || code === 'KeyE' || code === 'Space') && solved) { finish(); return; }
          if (code === 'ArrowLeft' || code === 'ArrowDown') { wl.set(wl.key() - 1); LC.Audio.sfx('click'); }
          if (code === 'ArrowRight' || code === 'ArrowUp') { wl.set(wl.key() + 1); LC.Audio.sfx('click'); }
        },
        wheel: wl
      };
      this.modal = m;
      devInputs(self, m, function () { m.key(solved ? 'Enter' : wl.key() < C.key ? 'ArrowRight' : 'ArrowLeft'); });
      LC.Audio.sfx('click');
    }
  });
})(window.LC);
