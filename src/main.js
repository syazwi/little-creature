/* Little Creature — Phaser game bootstrap + platform glue (PC browser, mobile browser, Android app) */
(function () {
  'use strict';
  var params = new URLSearchParams(location.search);
  LC.PLATFORM = params.get('platform') === 'android' ? 'android' : 'web';

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
  if (/^https?:$/.test(location.protocol) && LC.PLATFORM === 'web') {
    var link = document.createElement('link'); link.rel = 'manifest'; link.href = 'manifest.webmanifest';
    document.head.appendChild(link);
    if ('serviceWorker' in navigator) window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }

  window.addEventListener('load', function () {
    LC.game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: 'game',
      width: 960,
      height: 640,
      backgroundColor: '#120d0a',
      pixelArt: true,
      roundPixels: true,
      input: { activePointers: 3 },
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      scene: [LC.BootScene, LC.TitleScene, LC.WorldScene, LC.UIScene]
    });
  });
})();
