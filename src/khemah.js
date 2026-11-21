/* The khemah (v2.7.5): a canvas tent Mak Ani stocks once Pelita reaches Lv 6. Hold it and face open ground to pitch
 * it (two tiles wide), sleep in it to wake up right there, and pack it back into your bag. One each. Where it stands
 * is personal (S.tent = { area, x, y }); a co-op guest can't pitch it on a friend's farm, where the host ends the day. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  LC.ITEMS.khemah = { id: 'khemah', icon: 'i_khemah', name: 'Khemah', kind: 'tent', price: 450, one: true,
    got: 'Hold it and press USE facing open ground to pitch it.',
    desc: 'A canvas tent that folds into your bag. Pitch it on open ground anywhere, sleep in it and wake up right there, then pack it up again.' };
  LC.SHOP_LEVEL = { khemah: 6 };   // Mak Ani's warung: things that come with Pelita's level
  var r6 = LC.LEVEL_REWARDS[6] = LC.LEVEL_REWARDS[6] || {};
  r6.text = (r6.text ? r6.text + ' ' : '') + 'Mak Ani now sells a khemah (tent): pitch it anywhere, sleep in it, and pack it back into your bag.';

  // one each: in the bag, or pitched somewhere
  LC.State.owns = function (id) { return this.count(id) > 0 || (id === 'khemah' && !!(this.s && this.s.tent)); };

  LC.KHEMAH_TEXT = {
    look: 'Your khemah, pegged down snug.',
    early: 'It\'s still early. Crawl in and sleep anyway? You\'ll wake up right here tomorrow.',
    night: 'Crawl in and sleep? You\'ll wake up right here tomorrow.',
    pitched: 'You pitch the khemah. Use it to sleep, or to pack it up again.',
    packed: 'You pull up the pegs, fold the khemah and put it in your bag.',
    moved: 'Something was in the way of your khemah, so you packed it up. It is in your bag.',
    where: 'Face a clear patch of open ground, two tiles wide, to pitch the khemah.',
    deep: 'Not down here! Pitch the khemah on open ground.',
    guest: 'Pitch your khemah in your own world. On a friend\'s farm, the host decides when everyone sleeps.'
  };
})(window.LC);
