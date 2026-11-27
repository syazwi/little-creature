/* The Google Play build (v3.34). This file is only in the app bundle made for Google Play (android/app/build.gradle,
 * build type "play"), loaded just before main.js; the web version, the GitHub APK and the PC files never load it.
 * Google Play updates the app itself, and its rules do not allow an app to download and install new versions of
 * itself, so the GitHub updater (update.js) is switched off here: no checks, no download button, no reminder. The
 * pause menu's Updates tile just says which version this is. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  LC.STORE = 'play';
  var U = LC.Update;
  if (U) {
    U.check = function (cb) { this.state = 'ok'; this.info = null; if (cb) cb(false); };
    U.newer = function () { return false; };
    U.remind = function () { };
    U.download = function () { return false; };
  }
  if (LC.UIScene) LC.UIScene.prototype.updateRow = function () {
    var self = this, cur = LC.Update.current();
    return { icon: 'ic_glow', label: 'Updates: v' + cur.name, sub: 'Updated ' + LC.Update.when(cur.built) + '. Google Play keeps Little Creature up to date.',
      action: function () { self.toast('Google Play updates Little Creature for you. This is v' + cur.name + '.', 'ic_glow'); } };
  };
})(window.LC);
