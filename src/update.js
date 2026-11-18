/* Little Creature — "a new version is ready" (v1.7.1).
 * src/version.js (written by tools/build-web.mjs) says which version this is and when it was built. When the game
 * starts with internet, it reads dist/version.json from GitHub: if that version is newer, the title screen shows a
 * download button (with the new version's date and time), you get one reminder in the game, and the pause menu's
 * Updates row offers the download. On Android it downloads the new APK in your browser: open it and tap Install
 * (it installs over the old app, and your farm is kept). On a computer it opens the new HTML file's GitHub page.
 * Nothing updates by itself, and without internet the game just plays as usual. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var V = LC.VERSION || { code: 0, name: '?', built: '' }, URLS = LC.UPDATE_URLS || {};
  var waiting = [];

  function when(iso) {
    var d = new Date(iso);
    if (!iso || isNaN(d.getTime())) return 'unknown';
    try { return d.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }); }
    catch (e) { return d.toString(); }
  }

  LC.Update = {
    info: null,          // the newest version on GitHub: { code, name, built }
    state: 'idle',       // idle · checking · ok · fail
    checkedAt: 0,
    told: false,
    when: when,
    current: function () { return V; },
    newer: function () { return !!(this.info && this.info.code > V.code); },
    versionLine: function () { return 'v' + V.name + '  ·  updated ' + when(V.built); },
    // ask GitHub for the newest version (once per session unless forced); cb(newer) when known
    check: function (cb, force) {
      var self = this;
      if (cb) waiting.push(cb);
      if (this.state === 'checking') return;
      if (this.state === 'ok' && !force) { this.flush(); return; }
      if (!URLS.check || !window.fetch || (navigator.onLine === false && !force)) { this.state = 'fail'; this.flush(); return; }
      this.state = 'checking';
      var done = false, timer = setTimeout(function () { if (!done) { done = true; self.state = 'fail'; self.flush(); } }, 9000);
      var url = URLS.check;
      if (/^https?:/.test(url)) url += (url.indexOf('?') < 0 ? '?' : '&') + 't=' + Date.now();   // skip any cached copy
      fetch(url, { cache: 'no-store' })
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function (j) {
          if (done) return;
          done = true; clearTimeout(timer);
          if (!j || typeof j.code !== 'number') throw new Error('bad version file');
          self.info = { code: j.code, name: String(j.name), built: String(j.built || '') };
          self.state = 'ok'; self.checkedAt = Date.now();
          self.flush();
        })
        .catch(function () { if (done) return; done = true; clearTimeout(timer); self.state = 'fail'; self.flush(); });
    },
    flush: function () {
      var list = waiting, self = this;
      waiting = [];
      list.forEach(function (cb) { try { cb(self.newer()); } catch (e) { /* a closed menu, a stopped scene */ } });
      this.remind();
    },
    // one reminder in the game (the title screen shows its own button)
    remind: function () {
      if (!this.newer() || this.told || !LC.game) return;
      var U = LC.game.scene.getScene('UI');
      if (!U || !U.ready || !LC.game.scene.isActive('UI') || LC.game.scene.isActive('Title')) return;
      this.told = true;
      U.toast('A new version of Little Creature is ready: v' + this.info.name + ', updated ' + when(this.info.built) + '. Pause > Updates to download it.', 'ic_glow');
    },
    // the download: the APK on Android (opens in the browser), the HTML file's GitHub page on a computer
    download: function () {
      var android = LC.PLATFORM === 'android', url = android ? URLS.apk : (LC.CHEATS ? URLS.full : URLS.page);
      if (!url) return false;
      if (android) window.location.href = url;   // the app hands web links to the phone's browser
      else window.open(url, '_blank', 'noopener');
      return true;
    },
    howTo: function () {
      return LC.PLATFORM === 'android'
        ? 'Your browser downloads the new APK: open it and tap Install. It installs over this one and your farm is kept.'
        : 'Its GitHub page opens: download the file and put it in place of the old one (same name, same folder) so your saves carry over.';
    }
  };
})(window.LC);
