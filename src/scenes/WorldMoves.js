/* World (v3.26): you move like the Sunnyside World farmer. You always face left or right (the target square still
 * shows where you will act, up or down too), breathe while you stand, lift the item you hold over your head, and dig,
 * water, mine, pick, fish, swing and flinch with the pack's own animations (folk-moves.js, made into the textures
 * `<pl>_m_<move>_<i>` and anims `<pl>_m_<move>` by art-folk.js). Co-op friends walk and stand the same way.
 * Mixed into LC.WorldScene. Loaded after every other World file, so its wrappers are the outermost. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var W = LC.WorldScene.prototype;
  var NO_HOLD = { tool: 1, weapon: 1, seed: 1, vehicle: 1, ranged: 1, float: 1, gear: 1 };   // these stay in your hand
  var LOCKED = { dig: 1, water: 1, mine: 1, doing: 1, cast: 1, attack: 1 };                  // you stand still for these

  function ready(scene) { return scene.anims.exists(scene.plKey + '_m_idle'); }
  // the World scene restarts on every journey: nothing half-done comes along
  var create = W.create;
  W.create = function () { this.acting = null; this.heldSpr = null; return create.apply(this, arguments); };

  // the way your picture faces: your last step left or right
  W.faceDir = function () {
    if (this.dir === 'left' || this.dir === 'right') this.face = this.dir;
    return this.face || 'right';
  };
  // what you lift over your head: the selected item, unless it is a tool, a weapon or seeds (and not on a ride or a boat)
  W.heldItem = function () {
    if (this.S.riding || this.A.underwater || this.A.sailing || this.A.voyage20 || this.fishing) return null;
    var sl = LC.State.selItem(), it = sl && LC.ITEMS[sl.id];
    if (!it || NO_HOLD[it.kind] || (this.weaponOf && this.weaponOf(sl))) return null;
    return it;
  };
  // play one of the farmer's moves once (dig, water, mine, doing, cast, caught, attack, hurt)
  W.playAct = function (name, lock) {
    var p = this.player, key = this.plKey + '_m_' + name, m = LC.Art.MOVES && LC.Art.MOVES[name];
    if (!p || !m || !this.anims.exists(key) || this.S.riding) return false;
    if (lock === undefined) lock = !!LOCKED[name];
    this.acting = { name: name, lock: lock, until: this.time.now + m.n / m.rate * 1000 };
    p.play(key); p.setFlipX(this.faceDir() === 'left');
    return true;
  };

  var animPlayer = W.animPlayer;
  W.animPlayer = function (p) {
    if (!ready(this)) return animPlayer.call(this, p);
    var face = this.faceDir(), a = this.acting;
    if (a && this.time.now >= a.until) a = this.acting = null;
    if (!a) {
      var held = this.heldItem(), key;
      if (this.fishing) key = this.fishing.bite ? 'reel' : 'wait';
      else if (this.moving) key = held ? 'carry' : 'walk';
      else key = held ? 'hold' : 'idle';
      p.play(this.plKey + '_m_' + key, true);
      this.showHeld(p, held, face);
    } else this.showHeld(p, null, face);
    p.setFlipX(face === 'left');
  };
  // the held item rides on your raised hands (where the pack's crate sat in each carrying frame)
  W.showHeld = function (p, it, face) {
    var s = this.heldSpr;
    if (!it) { if (s && s.scene) s.setVisible(false); return; }
    var icon = it.icon || 'i_' + it.id;
    if (!this.textures.exists(icon)) { if (s && s.scene) s.setVisible(false); return; }
    if (!s || !s.scene) s = this.heldSpr = this.add.image(0, 0, icon).setOrigin(0.5, 1);   // (the scene restarts on travel)
    var info = LC.Art.MOVES.carry, f = this.moving && p.anims.currentFrame ? p.anims.currentFrame.index - 1 : 0, h = (info && info.hold[f]) || [0, -10];
    s.setTexture(icon).setVisible(true).setFlipX(face === 'left')
      .setPosition(Math.round(p.x + (face === 'left' ? -h[0] : h[0])), Math.round(p.y + h[1] - 1)).setDepth(p.y + 0.4);
  };
  // the fishing line leaves from the rod's tip
  W.rodTip = function () {
    var p = this.player, info = LC.Art.MOVES && LC.Art.MOVES[this.fishing && this.fishing.bite ? 'reel' : 'wait'];
    if (!ready(this) || !info || !p.anims.currentAnim || !/_m_(wait|reel|cast)$/.test(p.anims.currentAnim.key)) return null;
    var name = p.anims.currentAnim.key.replace(/^.*_m_/, ''), m = LC.Art.MOVES[name], f = p.anims.currentFrame ? p.anims.currentFrame.index - 1 : 0;
    var t = (m.tip && m.tip[f]) || [8, -14], left = this.faceDir() === 'left';
    return [p.x + (left ? -t[0] : t[0]), p.y + t[1]];
  };

  // you stand still while you dig, water, swing...
  var updatePlayer = W.updatePlayer;
  W.updatePlayer = function (dt, blocked) {
    var a = this.acting;
    return updatePlayer.call(this, dt, blocked || !!(a && a.lock && this.time.now < a.until));
  };
  // the work itself
  var bump = W.bump;
  W.bump = function (kind) {
    if (!ready(this) || !this.playAct(kind || 'doing')) return bump.apply(this, arguments);
  };
  var attack = W.attack;
  W.attack = function () {
    var cd = this.swingCd, r = attack.apply(this, arguments);
    if (this.swingCd !== cd && ready(this)) this.playAct('attack');
    return r;
  };
  var playerHurt = W.playerHurt;
  W.playerHurt = function (dmg, e) {
    var hp = this.S.hp, r = playerHurt.apply(this, arguments);
    if (this.S.hp < hp && !this.leaving && ready(this)) this.playAct('hurt', false);
    return r;
  };
  // fishing: cast (the bump), wait, reel in when it bites, and lift the catch
  var bobberBite = W.bobberBite;
  W.bobberBite = function () {
    if (this.fishing) this.fishing.bite = true;
    return bobberBite.apply(this, arguments);
  };
  var endFishing = W.endFishing;
  W.endFishing = function (id) {
    var r = endFishing.apply(this, arguments);
    if (id && ready(this)) this.playAct('caught', false);
    else if (this.acting && /cast|wait|reel/.test(this.acting.name)) this.acting = null;
    return r;
  };

  // co-op friends walk and stand like you
  var animRemote = W.animRemote;
  W.animRemote = function (s, o, r) {
    var pk = LC.Art.plKey(o.color || 0);
    if (!this.anims.exists(pk + '_m_idle')) return animRemote.apply(this, arguments);
    if (o.dir === 'left' || o.dir === 'right') r.face = o.dir;
    s.play(pk + '_m_' + (o.mv ? 'walk' : 'idle'), true);
    s.setFlipX(r.face === 'left');
  };
})(window.LC);
