/* v2.7.9: Pelita sorts your bag. As Pelita levels up it learns to sort more kinds of things (Lv 4, 8 and 11). In the bag,
 * a row of buttons shows only that kind in the backpack (the hotbar stays, with the other things dimmed).
 * The bag itself is in scenes/UIHome.js. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  // Anything of a kind not listed here counts as Materials.
  LC.BAG_SORTS = [
    { k: 'tools', name: 'Tools', lv: 4, kinds: ['tool', 'weapon', 'gear', 'vehicle', 'wear', 'trap', 'tent', 'chest', 'fixture', 'quest'] },
    { k: 'seeds', name: 'Seeds', lv: 4, kinds: ['seed', 'fert', 'feed'] },
    { k: 'harvest', name: 'Harvest', lv: 4, kinds: ['crop', 'flower', 'fruit', 'produce', 'forage', 'meat'] },
    { k: 'meals', name: 'Meals', lv: 4, kinds: ['dish', 'drink'] },
    { k: 'fish', name: 'Fish', lv: 8, kinds: ['fish'] },
    { k: 'offer', name: 'Offerings', lv: 8, kinds: ['offering', 'float'] },
    { k: 'mat', name: 'Materials', lv: 11, kinds: ['material', 'craft', 'goods', 'junk'] },
    { k: 'treasure', name: 'Treasure', lv: 11, kinds: ['treasure'] }
  ];
  var BY_KIND = {}, BY_K = {};
  LC.BAG_SORTS.forEach(function (g) { BY_K[g.k] = g; g.kinds.forEach(function (kind) { BY_KIND[kind] = g.k; }); });
  LC.bagSortOf = function (id) { var it = LC.ITEMS[id]; return (it && BY_KIND[it.kind]) || 'mat'; };
  LC.bagSort = function (k) { return BY_K[k] || null; };
  LC.BAG_SORT_LV = LC.BAG_SORTS[0].lv;

  // the level-up message and Journal > Levels
  var byLv = {};
  LC.BAG_SORTS.forEach(function (g) { (byLv[g.lv] = byLv[g.lv] || []).push(g.name); });
  Object.keys(byLv).forEach(function (lv, i) {
    var names = byLv[lv], list = names.length > 1 ? names.slice(0, -1).join(', ') + (i ? ' and ' : ' or ') + names[names.length - 1] : names[0];
    var t = i ? 'Pelita can now sort ' + list + ' in your bag too.' : 'Pelita learns to sort your bag: open it and tap ' + list + ' to see only those things.';
    var r = LC.LEVEL_REWARDS[lv] = LC.LEVEL_REWARDS[lv] || {};
    r.text = (r.text ? r.text + ' ' : '') + t;
  });
})(window.LC);
