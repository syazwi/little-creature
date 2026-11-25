/* Story checkpoints shared by the two standalone developer builds. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var State = LC.State, full = !!LC.CHEATS;
  var slot = (LC.DEV_ANDROID ? 11 : LC.SAVE_SLOTS) + 1;
  LC.DEVELOPER_HTML = true;
  LC.SAVE_SLOTS = slot;
  if (!full) LC.SAVE_KEY = LC.DEV_ANDROID ? 'littleCreature.save.developer' : 'littleCreature.save.developer-web';

  function unlimited(s) {
    Object.defineProperty(s, 'kepeng', { configurable: true, enumerable: false,
      get: function () { return Infinity; }, set: function () {} });
  }
  var newGame = State.newGame, load = State.load, slotInfo = State.slotInfo;
  State.newGame = function () {
    var s = newGame.apply(this, arguments);
    if (!full) unlimited(s);
    return s;
  };
  State.load = function () {
    var ok = load.apply(this, arguments);
    if (ok && (!full || this.s.flags.devCheckpoint)) unlimited(this.s);
    return ok;
  };
  State.slotInfo = function (n) {
    var info = slotInfo.apply(this, arguments);
    if (info && (!full || info.kepeng === undefined)) info.kepeng = '∞';
    return info;
  };
  // Each HTML file is self-contained and runs under its own save namespace.
  LC.Update.check = function (cb) { if (cb) cb(false); };
  LC.UIScene.prototype.updateRow = function () { return null; };

  var SC = LC.StoryCheckpoints, chapters = SC.chapters(), entry = SC.entry;   // (v3.21: the endings moved to story-checkpoints.js)
  function checkpoint(n) {
    var s = SC.build(n, slot);
    s.flags.devCheckpoint = true;
    unlimited(s);
    return s;
  }
  function current(s) {
    if (!s.quests.ch2) return chapters[0];
    return LC.CHAPTER_LIST.find(function (chapter) { return (s.quests[chapter.key] || 0) < chapter.end; });
  }
  LC.DevStory = { slot: slot, chapters: chapters, checkpoint: checkpoint, entry: entry, current: current };
})(window.LC);
