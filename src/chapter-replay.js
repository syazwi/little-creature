/* Replay a finished chapter (v3.21). The owner asked that players can choose a chapter and play it again, but only a
 * chapter they have completed. Pause > Chapter > All chapters: a finished chapter (2 and up) shows "Replay".
 * A replay is a separate, temporary game: story-checkpoints.js builds the start of that chapter from a new game (every
 * chapter before it complete), with your own level and strength carried over so the fights feel the same. It saves only
 * under its own key (SAVE_KEY + '.replay'), never into a save slot, so your farm, bag and rewards wait untouched at
 * home. Whatever you win in a replay stays in the replay. When the chapter ends you are asked to go home; you can also
 * end it any time from the pause menu. Closing the game during a replay simply returns you to your farm next time.
 * Not in co-op. Loaded after story-checkpoints.js. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var State = LC.State, SC = LC.StoryCheckpoints, U = LC.UIScene.prototype, W = LC.WorldScene.prototype;
  function key() { return LC.SAVE_KEY + '.replay'; }
  function chapter(n) { return LC.CHAPTER_LIST.filter(function (c) { return c.n === n; })[0]; }

  var R = LC.Replay = {
    active: function () { var s = State.s; return !!(s && s.replay); },
    done: function (s, ch) { return !!(s && s.quests && ch && (s.quests[ch.key] || 0) >= ch.end); },
    // a chapter can be replayed once it is complete in this save (never from inside a replay, as a co-op guest or in co-op)
    can: function (n) {
      var s = State.s, ch = chapter(n);
      return !!(ch && s && !s.guest && !s.replay && !LC.Net.role && R.done(s, ch));
    },
    start: function (ui, n) {
      var real = State.s, ch = chapter(n), W0 = ui.world;
      if (!R.can(n) || !W0 || W0.leaving || W0.sleeping) return false;
      var home = State.slot, xp = real.quests.xp, str = real.str;
      State.save();   // (your farm, safe in its own slot)
      var s;
      try { s = SC.build(n); } catch (e) { State.load(home); ui.S = State.s; ui.toast('This chapter could not be set up for a replay. (' + e.message + ')', 'ic_moon'); return false; }
      if (typeof xp === 'number' && xp > (s.quests.xp || 0)) s.quests.xp = xp;   // your own level and strength
      if (typeof str === 'number' && str > (s.str || 0)) s.str = str;
      s.replay = { n: n, slot: home, at: Date.now() };
      var data = SC.entry(s, n);
      State.recalc();
      s.hp = s.maxHp; s.energy = s.maxEnergy; s.water = s.maxWater;
      State.slot = home;   // (unchanged: a replay never saves into a slot, see State.save below)
      State.save();
      ui.S = State.s;
      ui.closeModal();
      LC.Audio.sfx('chime');
      W0.leaving = true;
      W0.cameras.main.fadeOut(450, 0, 0, 0);
      W0.cameras.main.once('camerafadeoutcomplete', function () { W0.scene.restart(data); });
      LC.replayNote = 'Replay: Chapter ' + n + ', ' + ch.name + '. Your farm is safe at home. End the replay any time from the pause menu.';
      return true;
    },
    end: function (ui) {
      var s = State.s;
      if (!s || !s.replay) return;
      var home = s.replay.slot || 1;
      try { localStorage.removeItem(key()); } catch (e) { /* storage blocked */ }
      if (!State.slotExists(home)) { ui.toast('Your farm\'s save could not be found.', 'ic_moon'); return; }
      LC.replayNote = 'Welcome home. Your farm is just as you left it.';
      ui.loadSlot(home);
    }
  };

  // a replay saves only under its own key (never into a slot, and never as your last slot)
  var save = State.save;
  State.save = function () {
    var s = this.s;
    if (s && s.replay && !s.guest) {
      try { s.savedAt = Date.now(); localStorage.setItem(key(), JSON.stringify(s)); return true; } catch (e) { return false; }
    }
    return save.apply(this, arguments);
  };
  var saveTo = State.saveTo;
  State.saveTo = function () { return this.s && this.s.replay ? this.save() : saveTo.apply(this, arguments); };

  // ================================================================ the menus
  var listRows = U.chapterListRows;
  U.chapterListRows = function () {
    var self = this, rows = listRows.apply(this, arguments), S = this.S;
    if (R.active()) {
      var r = S.replay, ch = chapter(r.n);
      return [{ icon: 'ic_door', label: 'End the replay and go home', sub: 'You are replaying Chapter ' + r.n + (ch ? ', ' + ch.name : '') + '. Your farm, bag and rewards are waiting, untouched.', right: 'Home',
        action: function () { self.askEndReplay(); } }].concat(rows);
    }
    var all = [{ n: 1 }].concat(LC.CHAPTER_LIST);
    return rows.map(function (row, i) {
      var ch = all[i];
      if (!ch || ch.n < 2 || !R.can(ch.n)) return row;
      return Object.assign({}, row, { right: 'Replay', sub: row.sub + ' Select to play it again.', action: function () { self.askReplay(ch.n); } });
    });
  };
  Object.assign(U, {
    askReplay: function (n) {
      var self = this, ch = chapter(n);
      this.closeModal();
      this.say([{ text: 'Replay Chapter ' + n + ', ' + ch.name + '? You play it again from the very beginning, with your own level and strength. Your farm, bag and rewards stay safely at home: whatever you win in the replay stays in the replay.' }], {
        choices: [{ label: 'Replay it!', fn: function () { R.start(self, n); } }, { label: 'Not now', fn: function () { } }] });
    },
    askEndReplay: function () {
      var self = this;
      this.closeModal();
      this.say([{ text: 'End the replay and go back to your farm?' }], {
        choices: [{ label: 'Go home', fn: function () { R.end(self); } }, { label: 'Keep playing', fn: function () { } }] });
    }
  });
  // the pause menu's chapter tile becomes the way home
  var tile = U.chapterTile;
  U.chapterTile = function () {
    var self = this, S = this.S;
    if (!S || !S.replay) return tile.apply(this, arguments);
    var ch = chapter(S.replay.n), P = LC.chapterProgress();
    return { icon: 'ic_chap', label: 'Replay: Chapter ' + S.replay.n + (P.n === S.replay.n ? ' (' + P.pct + '%)' : ''),
      sub: (ch ? ch.name + '. ' : '') + 'Select to see what to do now, or to end the replay and go home.', action: function () { self.openChapter(); } };
  };
  // saving into a slot, loading and co-op all wait until the replay is over
  var openSaves = U.openSaves;
  U.openSaves = function () {
    if (R.active()) { this.toast('This is a chapter replay: it saves by itself. End the replay (Pause > Replay) to save or load your farm.', 'ic_save'); return; }
    return openSaves.apply(this, arguments);
  };
  var invite = U.inviteFriends;
  if (invite) U.inviteFriends = function () {
    if (R.active()) { this.toast('End the replay before inviting friends.', 'ic_joy'); return; }
    return invite.apply(this, arguments);
  };

  // what's new, once (with Chapter 19's note too, for anyone who has not seen it)
  var prev = LC.NEWS, prior = null;
  try { prior = localStorage.getItem('littleCreature.newsSeen'); } catch (e) { /* storage blocked */ }
  LC.NEWS = {
    id: 'v3.21-replay',
    lines: (prev && prior !== prev.id && prior !== 'v3.21-replay' ? prev.lines : []).concat([
      { text: '✦ New: replay a chapter ✦  Loved a chapter? Pause > Chapter > All chapters: every chapter you have finished now has a Replay button. Your farm waits safely at home while you play it again.' }
    ])
  };

  // ================================================================ in the world: a note, and the offer to go home at the end
  var create = W.createKampong, update = W.updateKampong;
  W.createKampong = function () {
    create.apply(this, arguments);
    this.replayCalm = 0;
    var note = LC.replayNote, self = this;
    LC.replayNote = null;
    if (note) this.time.delayedCall(900, function () { if (self.ui) self.toast(note, 'ic_chap'); });
  };
  W.updateKampong = function (time, dt) {
    update.apply(this, arguments);
    var S = this.S, r = S && S.replay, ch = r && chapter(r.n);
    if (!ch || r.asked || !R.done(S, ch)) return;
    // wait until the chapter's last scenes have played (no dialogue, no cutscene, for a few seconds)
    if (this.ui.isBlocking() || this.leaving || this.sleeping || this.cutscene) { this.replayCalm = 0; return; }
    if ((this.replayCalm = (this.replayCalm || 0) + dt) < 5) return;
    r.asked = true;
    LC.State.save();
    var ui = this.ui;
    LC.Audio.sfx('cheer');
    ui.say([{ text: '✦ Replay complete: Chapter ' + r.n + ', ' + ch.name + '! ✦  Go back to your farm now? (You can also stay and look around, and go home from the pause menu.)' }], {
      choices: [{ label: 'Back to my farm', fn: function () { R.end(ui); } }, { label: 'Stay a while', fn: function () { } }] });
  };
})(window.LC);
