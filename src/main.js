/* Little Creature — Phaser game bootstrap + platform glue (PC browser, mobile browser, Android app) */
(function () {
  'use strict';
  var params = new URLSearchParams(location.search);
  LC.PLATFORM = params.get('platform') === 'android' ? 'android' : 'web';

  var DISPLAY_KEY = 'littleCreature.display';
  var presets = {
    low: { label: 'Low', density: 0.25, flicker: false, desc: 'Fewer particles, lighter weather, and steady lights.' },
    medium: { label: 'Medium', density: 0.60, flicker: true, desc: 'Balanced particles, weather, and lighting effects.' },
    high: { label: 'High', density: 1, flicker: true, desc: 'Full particles, weather, and lighting effects.' }
  };
  var rates = [30, 60, 90, 120];
  var qualityNames = Object.keys(presets);
  var display = LC.Display = {
    quality: 'medium', fps: 60, presets: presets, rates: rates,
    preset: function () { return presets[this.quality]; },
    effectCount: function (count) { return count > 0 ? Math.max(1, Math.round(count * this.preset().density)) : count; },
    setQuality: function (quality) { if (qualityNames.includes(quality)) { this.quality = quality; saveDisplay(); } },
    setFps: function (fps) { if (rates.includes(fps)) { this.fps = fps; saveDisplay(); } }
  };
  try {
    var savedDisplay = JSON.parse(localStorage.getItem(DISPLAY_KEY));
    if (savedDisplay && qualityNames.includes(savedDisplay.quality)) display.quality = savedDisplay.quality;
    if (savedDisplay && rates.includes(savedDisplay.fps)) display.fps = savedDisplay.fps;
  } catch (e) { /* use the defaults when storage is unavailable */ }
  function saveDisplay() {
    try { localStorage.setItem(DISPLAY_KEY, JSON.stringify({ quality: display.quality, fps: display.fps })); } catch (e) { /* this session only */ }
  }

  class DisplayGame extends Phaser.Game {
    step(time, delta) {
      var fps = display.fps, interval = 1000 / fps;
      if (this.frameRate !== fps) {
        this.frameRate = fps;
        this.nextFrameAt = time;
      }
      this.frameDelta = (this.frameDelta || 0) + delta;
      if (!this.pendingDestroy && time + 0.75 < this.nextFrameAt) return;
      // Keep the cadence across display refreshes, including 90 FPS targets on 120 Hz screens.
      var periods = Math.max(1, Math.floor((time - this.nextFrameAt) / interval) + 1);
      this.nextFrameAt += periods * interval;
      var elapsed = this.frameDelta;
      this.frameDelta = 0;
      super.step(time, elapsed);
    }
  }

  // Save whenever the game is hidden: Android may kill a backgrounded app, and tabs get closed.
  LC.autoSave = function () {
    var g = LC.game;
    if (!g || !LC.State.s || !g.scene.isActive('World')) return false;
    if (g.scene.getScene('World').sleeping) return false;
    return LC.State.save();
  };
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { LC.autoSave(); LC.Audio.suspend(); } else LC.Audio.resume();
  });
  window.addEventListener('pagehide', LC.autoSave);

  // Android back button: close the open menu, otherwise open the pause menu.
  // Returns false on the title screen so the app can go to the background.
  LC.onBack = function () {
    var g = LC.game;
    if (!g || !g.scene.isActive('UI')) return false;
    g.scene.getScene('UI').pressKey('Escape');
    return true;
  };

  // Installable / offline web version when hosted (e.g. GitHub Pages). Not needed for file:// or the Android app.
  // v2.4.2: this is how iPhones play it, as a Home Screen app. sw.js keeps one complete copy of the game and starts
  // from it (like an installed app); a new version downloads in the background and is used from the next start.
  LC.HOSTED = /^https?:$/.test(location.protocol) && LC.PLATFORM === 'web';
  if (LC.HOSTED) {
    var link = document.createElement('link'); link.rel = 'manifest'; link.href = 'manifest.webmanifest';
    document.head.appendChild(link);
    if ('serviceWorker' in navigator) window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
    // keep the save even when the phone is low on space (a Home Screen app is granted this)
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(function () {}); } catch (e) { /* not supported */ }
  }
  // "Update" on the hosted version: save, fetch the new copy, and restart on it.
  LC.applyUpdate = function () {
    var sw = navigator.serviceWorker, done = false;
    LC.autoSave();
    function restart() { if (!done) { done = true; location.reload(); } }
    if (!sw || !sw.getRegistration) { restart(); return; }
    sw.addEventListener('controllerchange', restart);   // the new copy is complete and in charge
    setTimeout(restart, 30000);                         // a very slow connection: try again from the restart
    sw.getRegistration().then(function (reg) {
      if (!reg) { restart(); return; }
      return reg.update().then(function () {
        var nw = reg.installing || reg.waiting;
        if (!nw) { restart(); return; }                 // it was already downloaded in the background
        nw.addEventListener('statechange', function () { if (nw.state === 'redundant') restart(); });
      });
    }).catch(restart);
  };

  // ---- iPhone and iPad (Safari). iPads say they are Macs, but Macs have no touch screen.
  var ua = navigator.userAgent || '';
  LC.IOS = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  LC.MOBILE = LC.PLATFORM === 'android' || LC.IOS || /Android|Mobile/i.test(ua) ||
    !!(navigator.maxTouchPoints && window.matchMedia && matchMedia('(pointer: coarse)').matches);
  LC.STANDALONE = navigator.standalone === true || !!(window.matchMedia &&
    (matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches));
  // In Safari itself (not yet on the Home Screen) the title screen explains how to install it.
  LC.installHint = function () { return LC.HOSTED && LC.IOS && !LC.STANDALONE; };
  if (LC.IOS) {
    // A web app cannot turn itself sideways while the iPhone's rotation lock is on: say how to turn the lock off.
    var rot = document.getElementById('rotate');
    if (rot) rot.insertAdjacentHTML('beforeend', '<small style="max-width:80vw;color:#cdb8a0">Still upright? Swipe down from the top-right corner ' +
      'to open Control Center and turn off Portrait Orientation Lock.</small>');
    // no pinch-zooming the page (Safari ignores user-scalable=no)
    document.addEventListener('gesturestart', function (e) { e.preventDefault(); });
  }

  // ---- Fill the screen. The layout is designed at 960 x 640 (3:2). Instead of letterboxing other screen shapes
  // with black bars, the game keeps its 640 px height and gets wider on wide screens (phones are about 20:9,
  // monitors 16:9), or keeps its 960 px width and gets taller on squarer ones (4:3 tablets).
  // The HUD and menus anchor to the edges and centre (see UI.js), and the camera simply shows more of the farm.
  var BASE_W = 960, BASE_H = 640;
  LC.viewSize = function () {
    var el = document.getElementById('game');
    var w = (el && el.clientWidth) || window.innerWidth, h = (el && el.clientHeight) || window.innerHeight;
    var a = w > 0 && h > 0 ? w / h : BASE_W / BASE_H;
    a = Math.max(1, Math.min(2.6, a));   // beyond this (portrait windows, super-ultrawide), letterbox
    if (a >= BASE_W / BASE_H) return { w: Math.round(BASE_H * a), h: BASE_H };
    return { w: BASE_W, h: Math.round(BASE_W / a) };
  };
  function refit() {
    var g = LC.game;
    if (!g || !g.scale) return;
    var v = LC.viewSize();
    if (v.w !== g.scale.width || v.h !== g.scale.height) g.scale.setGameSize(v.w, v.h);
    else g.scale.refresh();
  }
  var refitT = 0;
  function queueRefit() { clearTimeout(refitT); refitT = setTimeout(refit, 100); }
  window.addEventListener('resize', queueRefit);
  window.addEventListener('orientationchange', queueRefit);
  if (window.visualViewport) window.visualViewport.addEventListener('resize', queueRefit);

  // ---- Safe area: keep the HUD clear of camera notches/cutouts while the game art still fills the whole screen.
  // The Android app reports the cutout through LC.setSafeArea(); browsers report it through CSS env().
  var nativeSafe = { l: 0, t: 0, r: 0, b: 0 }, probe = null;
  function cssSafe() {
    if (!probe) {
      probe = document.createElement('div');
      probe.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;' +
        'padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)';
      document.body.appendChild(probe);
    }
    var cs = getComputedStyle(probe);
    return { l: parseFloat(cs.paddingLeft) || 0, t: parseFloat(cs.paddingTop) || 0, r: parseFloat(cs.paddingRight) || 0, b: parseFloat(cs.paddingBottom) || 0 };
  }
  LC.setSafeArea = function (l, t, r, b) {   // CSS px, called by the Android app
    nativeSafe = { l: +l || 0, t: +t || 0, r: +r || 0, b: +b || 0 };
    if (LC.game) LC.game.events.emit('lc-safearea');
  };
  LC.safeArea = function () {   // in game px
    var c = cssSafe(), g = LC.game, k = g && g.scale && g.scale.displayScale ? g.scale.displayScale.x : 1;
    function side(n) { return Math.round(Math.min(120, Math.max(c[n], nativeSafe[n]) * k)); }
    return { l: side('l'), t: side('t'), r: side('r'), b: side('b') };
  };

  // ---- Fullscreen. The Android app is always fullscreen. On a phone browser the game goes fullscreen (and locks to
  // landscape) on the first tap; on a PC, press F or use the pause menu.
  var mobileWeb = LC.PLATFORM === 'web' && !!(window.matchMedia && matchMedia('(pointer: coarse)').matches);
  var wantFs = mobileWeb;
  LC.canFullscreen = function () {
    return LC.PLATFORM !== 'android' && !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
  };
  LC.isFullscreen = function () { return !!(document.fullscreenElement || document.webkitFullscreenElement); };
  LC.setFullscreen = function (on) {
    try {
      if (on && !LC.isFullscreen()) {
        var el = document.documentElement, req = el.requestFullscreen || el.webkitRequestFullscreen;
        var p = req ? req.call(el, { navigationUI: 'hide' }) : null;
        if (p && p.then) p.then(function () {
          if (mobileWeb && screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(function () {});
        }).catch(function () {});
      } else if (!on && LC.isFullscreen()) {
        var ex = document.exitFullscreen || document.webkitExitFullscreen;
        var q = ex && ex.call(document);
        if (q && q.catch) q.catch(function () {});
      }
    } catch (e) { /* not allowed here: ignore */ }
  };
  LC.toggleFullscreen = function () {
    var on = !LC.isFullscreen();
    wantFs = on && mobileWeb;   // turning it off on a phone stops the automatic fullscreen
    LC.setFullscreen(on);
  };
  if (mobileWeb) window.addEventListener('pointerup', function () { if (wantFs && LC.canFullscreen()) LC.setFullscreen(true); }, true);

  // ---- v2.4.2: keep the screen on while playing on a phone browser (the Android app does this itself).
  var wake = null;
  function keepAwake() {
    if (!mobileWeb || wake || document.hidden || !navigator.wakeLock) return;
    wake = 'asking';
    navigator.wakeLock.request('screen').then(function (l) {
      wake = l; l.addEventListener('release', function () { wake = null; });
    }).catch(function () { wake = null; });
  }
  // ---- Sound on iPhones: Safari only lets sound start when a tap ENDS, and can leave it "interrupted" after a call
  // or the lock screen. Every tap (and key) gently wakes it up again.
  function wakeSound() {
    LC.Audio.resume();
  }
  ['pointerup', 'touchend', 'keydown'].forEach(function (ev) {
    window.addEventListener(ev, function () { wakeSound(); keepAwake(); }, true);
  });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) keepAwake(); });
  document.addEventListener('fullscreenchange', queueRefit);
  document.addEventListener('webkitfullscreenchange', queueRefit);

  // v2.3: Pixelify Sans joins "fi" into a ligature that draws like an "A" ("first" came out as "Arst"). Text drawn
  // with textRendering 'optimizeSpeed' skips ligatures, so every letter is drawn on its own.
  var syncFont = Phaser.GameObjects.TextStyle.prototype.syncFont;
  Phaser.GameObjects.TextStyle.prototype.syncFont = function (canvas, context) {
    syncFont.call(this, canvas, context);
    try { context.textRendering = 'optimizeSpeed'; } catch (e) { /* older browsers: nothing to do */ }
  };

  window.addEventListener('load', function () {
    var v = LC.viewSize();
    LC.game = new DisplayGame({
      type: Phaser.AUTO,
      parent: 'game',
      width: v.w,
      height: v.h,
      backgroundColor: '#120d0a',
      pixelArt: true,
      roundPixels: true,
      fps: { smoothStep: false },
      render: { powerPreference: LC.MOBILE ? 'low-power' : 'default' },
      input: { activePointers: 3 },
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      scene: [LC.BootScene, LC.TitleScene, LC.WorldScene, LC.UIScene]
    });
    LC.game.scale.on('resize', snapCanvas);
    setTimeout(snapCanvas, 500);
  });

  // FIT rounds the canvas size, which can leave a sub-pixel sliver of background at one edge. Stretch over it.
  function snapCanvas() {
    var g = LC.game, s = g && g.scale, c = g && g.canvas;
    if (!c || !s.parentSize) return;
    var pw = s.parentSize.width, ph = s.parentSize.height, r = c.getBoundingClientRect();
    if (Math.abs(pw - r.width) < 2 && Math.abs(ph - r.height) < 2 && (pw !== r.width || ph !== r.height)) {
      c.style.width = pw + 'px'; c.style.height = ph + 'px'; c.style.marginLeft = '0px'; c.style.marginTop = '0px';
      s.updateBounds();
      s.displayScale.set(s.baseSize.width / s.canvasBounds.width, s.baseSize.height / s.canvasBounds.height);
    }
  }
})();
