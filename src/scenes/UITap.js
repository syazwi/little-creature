/* UI, tap to use (v3.9): a quick tap on the game world (touch screens) uses what you tapped (see WorldTap.js). A press
 * and drag still works the joystick. The pause menu's "Tap to use: On/Off" (on by default, kept on this device). And a
 * one-time "What's new" note on players' screens after the update. Mixed into LC.UIScene. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var TAP_MS = 320, TAP_PX = 16;
  LC.NEWS = {
    id: 'v3.9-tap',
    lines: [
      { text: '✦ What\'s new: Tap to use! ✦  On phones and tablets, just tap a person, Pelita, an animal, a crop or anything near you to use it. No more turning to face it and pressing USE.' },
      { text: 'Things you can tap glow softly at their feet. Walk with the joystick, just like before. If something is too far away, you will see "Walk closer".' },
      { text: 'Tap an enemy to swing at it, and tap Pelita to pet it (or to feed it what you are holding). Prefer the old way? Pause > Tap to use: Off. The USE button still works too.' }
    ]
  };
  function seenNews() { try { return localStorage.getItem('littleCreature.newsSeen') === LC.NEWS.id; } catch (e) { return true; } }
  function markNews() { try { localStorage.setItem('littleCreature.newsSeen', LC.NEWS.id); } catch (e) { /* storage blocked */ } }

  // the pause menu's switch
  LC.pauseExtraRow5 = function () {
    if (!LC.State.s) return null;
    var on = LC.tapOn();
    return { icon: 'ic_tap', label: 'Tap to use: ' + (on ? 'On' : 'Off'),
      sub: 'Phones and tablets: tap a person, Pelita or anything near you to use it, instead of facing it and pressing USE. Things you can tap glow softly. You still walk with the joystick.',
      action: function () { LC.setTapOn(!LC.tapOn()); LC.Audio.sfx('click'); } };
  };

  var create = LC.UIScene.prototype.create;
  LC.UIScene.prototype.create = function () {
    create.apply(this, arguments);
    var self = this, taps = {};
    if (!this.textures.exists('ic_tap')) LC.Art.make(this, 'ic_tap', 12, 12, function (p) {   // a fingertip and a ripple
      p.disc(5, 6, 4.6, 'rgba(255,240,180,0.35)'); p.disc(5, 6, 2.6, 'rgba(255,240,180,0.6)');
      p.rect(7, 4, 3, 7, '#f2d0a0'); p.disc(8.5, 4, 1.6, '#f2d0a0'); p.rect(6, 9, 5, 3, '#e8c090'); p.px(8, 3, '#ffffff');
    }, '#3a2a1a');
    // a quick tap (not a drag) on the world: anywhere, even on the joystick's side of the screen
    this.input.on('pointerdown', function (p, over) {
      if (!self.touchOn || !LC.tapOn() || self.modal) return;
      if (over && over.length) return;                                   // a button, a hotbar slot...
      var w = self.scale.width, h = self.scale.height;
      if (p.y < h * 0.27 && p.x < w * 0.3) return;      // the clock panel, top left (Pelita's card takes its own taps since v3.30, folded or not)
      taps[p.id] = { x: p.x, y: p.y, t: self.time.now };
    });
    this.input.on('pointerup', function (p) {
      var r = taps[p.id];
      delete taps[p.id];
      if (!r || self.modal || !self.world) return;
      if (self.time.now - r.t > TAP_MS || Math.hypot(p.x - r.x, p.y - r.y) > TAP_PX) return;
      if (self.world.tapUse) self.world.tapUse(p.x, p.y);
    });
    // what's new, once, on players' screens after the update (new players get the intro instead)
    if (!seenNews()) this.time.delayedCall(3200, function tryNews() {
      var S = self.S;
      if (!S || !S.flags) return;
      if (!S.flags.introDone) { markNews(); return; }
      if (self.modal || !self.world || self.world.leaving || self.world.sleeping || self.world.cutscene) { self.time.delayedCall(2000, tryNews); return; }
      markNews();
      LC.Audio.sfx('chime');
      self.say(LC.NEWS.lines);
    });
  };
})(window.LC);
