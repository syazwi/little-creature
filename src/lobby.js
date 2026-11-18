/* Little Creature — "Play with Friends" lobby. A small HTML overlay (real <input>s, so typing a name
 * or room code works with phone keyboards too). Opened from the title screen or the pause menu. */
window.LC = window.LC || {};
LC.Lobby = (function () {
  'use strict';
  var el = null, opts = {}, busy = false;
  function $(id) { return document.getElementById(id); }

  function build() {
    el = document.createElement('div');
    el.id = 'lobby';
    el.innerHTML =
      '<div class="card">' +
      '  <h2 id="lb-title">Play with Friends</h2>' +
      '  <p class="sub">Farm together! Everyone shares the fields, the clock and Pelita. Each friend keeps their own bag and kepeng.</p>' +
      '  <label for="lb-name">Your name</label>' +
      '  <input id="lb-name" maxlength="12" autocomplete="off" spellcheck="false" placeholder="e.g. Ali">' +
      '  <div class="cols">' +
      '    <div class="col" id="lb-hostcol">' +
      '      <h3>Host my farm</h3>' +
      '      <p id="lb-hostinfo">Opens your saved farm (or a new one) and gives you a code to share.</p>' +
      '      <select id="lb-slot" aria-label="Which farm to open"></select>' +
      '      <button id="lb-host">Open my farm</button>' +
      '    </div>' +
      '    <div class="col" id="lb-joincol">' +
      '      <h3>Join a friend</h3>' +
      '      <input id="lb-code" class="code" maxlength="5" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="CODE">' +
      '      <button id="lb-join">Join farm</button>' +
      '    </div>' +
      '  </div>' +
      '  <p id="lb-status" class="status"></p>' +
      '  <button id="lb-back" class="alt">Back</button>' +
      '  <p class="tiny">Needs an internet connection · up to 4 players · PC browsers and the Android app can play together.</p>' +
      '</div>';
    document.body.appendChild(el);
    $('lb-host').onclick = doHost;
    $('lb-join').onclick = doJoin;
    $('lb-back').onclick = close;
    $('lb-code').addEventListener('input', function () { this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); });
    $('lb-code').addEventListener('keydown', function (e) { if (e.key === 'Enter') doJoin(); });
    $('lb-name').addEventListener('keydown', function (e) { if (e.key === 'Enter') (opts.hostOnly ? doHost : function () { $('lb-code').focus(); })(); });
    el.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); e.stopPropagation(); });
  }
  function status(msg, err) { var s = $('lb-status'); s.textContent = msg || ''; s.className = 'status' + (err ? ' err' : ''); }
  function setBusy(b) { busy = b; $('lb-host').disabled = b; $('lb-join').disabled = b; $('lb-slot').disabled = b; }
  // v1.6: the host chooses which saved farm (slot) to open; friends continue it with their own saved bags
  function fillSlots() {
    var sel = $('lb-slot'), last = LC.State.lastSlot(), html = '';
    for (var n = 1; n <= LC.SAVE_SLOTS; n++) {
      var i = LC.State.slotInfo(n);
      html += '<option value="' + n + '"' + (n === last ? ' selected' : '') + '>Slot ' + n + ': ' + (i ? 'Day ' + i.day + ' · Pelita Lv ' + i.level + ' · ' + i.kepeng + ' kepeng' : 'new farm') + '</option>';
    }
    sel.innerHTML = html;
  }
  function getName() {
    var n = LC.Net.cleanName($('lb-name').value);
    if (!n) { status('Please type your name first.', true); $('lb-name').focus(); return null; }
    LC.Net.saveName(n);
    return n;
  }
  function doHost() {
    if (busy) return;
    var n = getName(); if (!n) return;
    setBusy(true); status('Opening your farm gate...');
    var slot = opts.hostOnly ? 0 : parseInt($('lb-slot').value, 10) || 1;
    LC.Net.host(n, function (code) { setBusy(false); hide(); if (opts.onHosted) opts.onHosted(code, slot); },
      function (err) { setBusy(false); status(err, true); });
  }
  function doJoin() {
    if (busy) return;
    var n = getName(); if (!n) return;
    setBusy(true); status('Looking for your friend\'s farm...');
    LC.Net.join($('lb-code').value, n, function (w) { setBusy(false); hide(); if (opts.onJoined) opts.onJoined(w); },
      function (err) { setBusy(false); status(err, true); });
  }
  function hide() {
    if (el) el.classList.remove('open');
    api.isOpen = false;
    if (LC.game && LC.game.input && LC.game.input.keyboard) LC.game.input.keyboard.enabled = true;
  }
  function close() {
    if (busy) { LC.Net.leave(); setBusy(false); }
    hide();
    if (opts.onClose) opts.onClose();
  }

  var api = {
    isOpen: false,
    // o: { hostOnly, onHosted(code), onJoined(welcome), onClose() }
    open: function (o) {
      opts = o || {};
      if (!el) build();
      $('lb-joincol').style.display = opts.hostOnly ? 'none' : '';
      $('lb-title').textContent = opts.hostOnly ? 'Invite Friends' : 'Play with Friends';
      $('lb-hostinfo').textContent = opts.hostOnly ? 'Open this farm to friends. You\'ll get a 5-letter code to share.' : 'Choose which of your farms to open (or start a new one), then share the code. Friends keep their own bags.';
      $('lb-slot').style.display = opts.hostOnly ? 'none' : '';
      if (!opts.hostOnly) fillSlots();
      $('lb-name').value = LC.Net.savedName();
      status(''); setBusy(false);
      el.classList.add('open');
      api.isOpen = true;
      if (LC.game && LC.game.input && LC.game.input.keyboard) LC.game.input.keyboard.enabled = false;   // let the inputs have the keys
      if (!(LC.game && LC.game.device.input.touch)) setTimeout(function () { ($('lb-name').value ? (opts.hostOnly ? $('lb-host') : $('lb-code')) : $('lb-name')).focus(); }, 60);
    },
    close: close
  };
  return api;
})();
