/* Little Creature — procedural pixel art for Chapter 3, part 1 (v2.0): the craft workshops on stilts, more houses
 * and empty pilings, nibong palms and belian logs, the padian traders' boats, the Majapahit flagship, the roosters
 * Mutiara and Asmara (and Asmara's ghost), the stone rooster of Lumut Lunting, a little rowing boat, and icons. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art, WOOD = '#6b4423', WOOD2 = '#4e3018';

  function stilts(p) {
    [5, 21, 39].forEach(function (x) { p.rect(x, 30, 3, 18, WOOD); p.rect(x + 2, 30, 1, 18, WOOD2); });
    p.rect(0, 45, p.w, 1, 'rgba(220,240,255,0.55)'); for (var x = 2; x < p.w; x += 7) p.px(x, 47, 'rgba(220,240,255,0.5)');
  }
  function house(p, wall, wall2, roof, roof2) {   // 48x48: a house on stilts, used by every workshop
    stilts(p);
    p.rect(1, 28, 46, 4, '#5e3a1e'); p.rect(1, 28, 46, 1, '#7a4f2b');
    p.rect(4, 14, 40, 14, wall); for (var x = 5; x < 44; x += 3) p.rect(x, 14, 1, 14, wall2);
    for (var y = 1; y <= 15; y++) { var half = Math.round((y - 1) / 14 * 25); for (x = 24 - half; x < 24 + half; x++) p.px(x, y, y % 3 === 0 ? roof2 : roof); }
    p.line(0, 15, 47, 15, '#4a2e18');
  }
  function door(p) { p.rect(28, 16, 9, 12, '#5a3720'); p.rect(29, 17, 7, 11, '#7a4b28'); }
  function win(p, x) { p.rect(x, 17, 8, 7, '#5a3720'); p.rect(x + 1, 18, 6, 5, '#2a1a10'); }
  function drawWeaponShop(p) {
    var ink = '#181425';
    p.ell(20, 39, 17, 3, '#396566');
    p.rect(5, 27, 4, 13, '#584038'); p.rect(31, 26, 4, 13, '#584038');
    p.rect(6, 29, 1, 8, '#b28053'); p.rect(32, 28, 1, 9, '#b28053');
    p.rect(4, 14, 32, 19, '#ad7752');
    for (var x = 5; x < 34; x += 4) p.line(x, 16, x, 31, '#855739');
    p.poly([[1, 15], [18, 3], [23, 3], [39, 15], [36, 18], [3, 18]], '#235854');
    p.poly([[5, 14], [19, 5], [22, 5], [35, 14]], '#458278');
    p.line(6, 14, 19, 6, '#a2bc8a'); p.line(23, 7, 33, 14, '#72a18b');
    p.rect(4, 16, 32, 2, '#c89a65'); p.rect(15, 13, 11, 5, '#643b31');
    p.line(17, 16, 22, 14, '#e0b978'); p.line(19, 14, 22, 16, '#efe3bf'); p.px(23, 14, '#f6e6aa');
    p.rect(8, 19, 23, 12, ink); p.rect(9, 20, 21, 8, '#64464b');
    p.line(11, 26, 17, 21, '#cad9c4', 2); p.px(12, 26, '#efbc63');
    p.line(24, 21, 27, 22, '#e9b26c'); p.line(27, 22, 27, 25, '#e9b26c'); p.line(27, 25, 24, 27, '#e9b26c');
    p.line(24, 21, 24, 27, '#d2d3b4');
    p.rect(7, 27, 25, 3, '#bd8756'); p.line(7, 27, 31, 27, '#e8b777');
    p.rect(2, 31, 36, 4, '#73503a'); p.line(3, 31, 37, 31, '#c78d57');
    p.line(14, 34, 25, 34, '#b67a50'); p.rect(13, 36, 13, 2, '#80573c');
    p.rect(34, 20, 3, 5, '#ffcf7c'); p.px(35, 21, '#fff0bf');
    p.line(2, 41, 14, 41, '#83b8af'); p.line(28, 40, 38, 39, '#5d9b98');
  }
  var WORK = {
    bengkel_besi: function (p) {   // forge and anvil
      house(p, '#8a6a4a', '#6a4a30', '#5a5a5a', '#3a3a3a'); door(p);
      p.rect(8, 18, 12, 10, '#2a1a10'); p.ell(14, 24, 4, 3, '#ff8a3a'); p.ell(14, 25, 2.4, 1.6, '#ffd166');
      p.rect(38, 24, 7, 3, '#4a4a52'); p.rect(40, 27, 3, 2, '#3a3a42'); p.px(44, 24, '#4a4a52');
      p.rect(22, 0, 3, 6, '#5a5a5a'); p.disc(24, 0, 2, 'rgba(200,200,200,0.5)');
    },
    bengkel_tembaga: function (p) {   // brass pots and a gong
      house(p, '#b8834a', '#9a6a38', '#8b6b3d', '#6d522c'); door(p); win(p, 9);
      [[10, 27], [16, 26], [41, 26]].forEach(function (k) { p.ell(k[0], k[1], 3, 2.6, '#c8902a'); p.ell(k[0] - 1, k[1] - 1, 1.4, 1, '#f2c860'); });
      p.disc(42, 19, 3.4, '#d9a73a'); p.disc(42, 19, 1.4, '#a87020'); p.line(42, 14, 42, 15, '#5a3720');
    },
    bengkel_tenun: function (p) {   // the loom
      house(p, '#c99a5e', '#a8784a', '#7a7a3d', '#5a5a2a'); door(p);
      p.rect(7, 17, 16, 11, '#5a3720'); p.rect(8, 18, 14, 9, '#7a1e3a');
      for (var x = 9; x < 22; x += 3) { p.px(x, 20, '#e9c46a'); p.px(x + 1, 23, '#e9c46a'); }
      p.rect(7, 16, 16, 1, '#8a5a2b'); p.rect(7, 27, 16, 1, '#8a5a2b');
    },
    bengkel_perahu: function (p) {   // an open shed with a boat on trestles
      stilts(p);
      p.rect(1, 28, 46, 4, '#5e3a1e'); p.rect(1, 28, 46, 1, '#7a4f2b');
      [3, 44].forEach(function (x) { p.rect(x, 12, 2, 16, WOOD); });
      for (var y = 2; y <= 13; y++) { var half = Math.round((y - 2) / 11 * 25); for (var x = 24 - half; x < 24 + half; x++) p.px(x, y, y % 3 === 0 ? '#6d522c' : '#8b6b3d'); }
      p.poly([[8, 21], [40, 21], [35, 26], [13, 26]], '#a8743e'); p.rect(10, 21, 28, 1, '#c99a5e'); p.line(14, 22, 14, 25, '#7a4f2b'); p.line(24, 22, 24, 26, '#7a4f2b'); p.line(34, 22, 34, 25, '#7a4f2b');
      [12, 36].forEach(function (x) { p.line(x - 2, 27, x, 25, WOOD2); p.line(x + 2, 27, x, 25, WOOD2); });
    },
    kedai_emas: function (p) {   // the goldsmith, with a golden roof ridge
      house(p, '#d6a77a', '#b8834a', '#8b6b3d', '#6d522c'); door(p); win(p, 9);
      p.rect(22, 0, 4, 2, '#e9c46a'); p.line(24, 1, 1, 15, '#e9c46a'); p.line(24, 1, 47, 15, '#e9c46a');
      p.disc(13, 20, 1.4, '#ffd166'); p.px(16, 22, '#fff4c0'); p.px(11, 23, '#fff4c0');
    },
    rumah_air3: function (p) { house(p, '#5a7aa8', '#46628a', '#8b6b3d', '#6d522c'); door(p); win(p, 9); win(p, 16); p.rect(1, 24, 3, 6, '#7a4f2b'); },
    tiang_kosong: function (p) {   // empty pilings, waiting for a house
      [5, 13, 21, 29, 37, 43].forEach(function (x, i) { var t = 22 + (i % 3) * 2; p.rect(x, t, 3, 48 - t, WOOD); p.rect(x + 2, t, 1, 48 - t, WOOD2); p.rect(x, t, 3, 1, '#8a5a2b'); });
      p.rect(0, 45, p.w, 1, 'rgba(220,240,255,0.55)');
    }
  };
  function drawNibong(p, ok) {   // 16x24 a nibong palm (or the stump left after cutting)
    if (!ok) { p.rect(6, 17, 4, 7, '#7a6a4a'); p.rect(6, 17, 4, 1, '#c8b88a'); p.line(3, 23, 5, 21, '#5a7a3a'); return; }
    p.rect(7, 8, 3, 16, '#7a6a4a'); for (var y = 9; y < 24; y += 3) p.rect(7, y, 3, 1, '#5a4a3a');
    [[8, 8, 1, 3], [8, 8, 15, 3], [8, 8, 2, 12], [8, 8, 14, 12], [8, 8, 8, 0]].forEach(function (l) { p.line(l[0], l[1], l[2], l[3], '#3f8a3a', 2); });
    p.px(8, 8, '#2a6a2a');
  }
  function drawBelian(p, ok) {   // 20x14 a fallen ironwood trunk (or a few chips)
    if (!ok) { p.rect(4, 10, 3, 2, '#5a2e1e'); p.rect(11, 11, 4, 2, '#5a2e1e'); return; }
    p.ell(10, 9, 9, 3.4, '#5a2e1e'); p.ell(10, 8, 8, 2.2, '#7a3e28'); p.ell(18, 9, 1.8, 3.2, '#a85a3a'); p.ell(18, 9, 1, 2, '#c8784a');
    p.line(3, 8, 15, 8, '#4a2416');
  }
  function drawPadian(p, f) {   // 34x18 a padian trader in her boat, wide hat and baskets of goods
    p.poly([[1, 12], [33, 12], [29, 17], [5, 17]], '#6b4423'); p.rect(3, 12, 28, 1, '#8a5a2b');
    p.ell(10, 10, 4, 2.4, '#c8a46a'); p.disc(9, 9, 1.4, '#6abf4a'); p.disc(11, 9, 1.2, '#e76f51');   // a basket of greens and chilli
    p.ell(26, 10, 3.4, 2, '#c8a46a'); p.disc(26, 9, 1.4, '#ffd166');
    p.rect(16, 6, 5, 6, '#3a7ab8'); p.rect(17, 3, 3, 3, '#a8714a');
    [[13, 1, 24, 1], [14, 0, 23, 0], [12, 2, 25, 2]].forEach(function (r) { p.rect(r[0], r[1], r[2] - r[0], 1, '#ecd28a'); });
    p.line(21, 8, 30 + f, 15, '#8a5a2b');   // the paddle
    p.rect(0, 16, 34, 1, 'rgba(220,240,255,0.55)');
  }
  function drawJong(p) {   // 80x48 the Majapahit flagship
    p.poly([[2, 32], [78, 32], [70, 44], [10, 44]], '#5a3a20'); p.rect(4, 32, 72, 2, '#7a4f2b'); p.rect(12, 38, 56, 1, '#c8323a');
    p.poly([[60, 24], [76, 24], [78, 32], [62, 32]], '#6b4423'); p.poly([[2, 26], [16, 26], [14, 32], [2, 32]], '#6b4423');
    [[24, 4, 18], [44, 2, 22]].forEach(function (m) { p.rect(m[0], m[1], 2, 30, '#4a2e18'); p.rect(m[0] - m[2] / 2, m[1] + 3, m[2], 20, '#e8e0d0'); p.rect(m[0] - m[2] / 2, m[1] + 3, m[2], 10, '#c8323a'); });
    [[25, 0], [45, -2]].forEach(function (f) { p.poly([[f[0], f[1] + 2], [f[0] + 8, f[1] + 4], [f[0], f[1] + 6]], '#c8323a'); });
    for (var x = 16; x < 64; x += 8) p.disc(x, 36, 1.4, '#2a1a10');
    p.rect(0, 45, 80, 1, 'rgba(220,240,255,0.6)'); p.rect(6, 47, 68, 1, 'rgba(220,240,255,0.4)');
  }
  function drawRooster(p, f, body, body2, tail, comb) {   // 16x16, facing right
    p.line(6, 13, 5 + f, 15, '#e9a33a'); p.line(9, 13, 10 - f, 15, '#e9a33a');
    p.ell(8, 9, 4.6, 3.6, body); p.ell(7, 8, 3, 2.2, body2);
    [[4, 8, 0, 3], [4, 9, 1, 6], [4, 10, 2, 9]].forEach(function (l) { p.line(l[0], l[1], l[2], l[3], tail); });
    p.disc(12, 5, 2.2, body); p.px(13, 4, '#1a120c'); p.px(14, 5, '#e9a33a'); p.px(15, 5, '#e9a33a');
    p.rect(11, 2, 3, 1, comb); p.px(12, 1, comb); p.px(13, 7, comb);
  }
  var WEAPON_ICONS = {
    parang_arus: function (p) {
      p.poly([[6, 10], [9, 9], [13, 3], [17, 1], [17, 5], [14, 10], [9, 13]], '#8cb3b8');
      p.poly([[8, 11], [13, 8], [16, 3], [16, 5], [13, 10], [9, 12]], '#e7f0d8');
      p.line(6, 11, 10, 14, '#e1b66d', 2);
      p.line(7, 13, 3, 17, '#4e7f71', 3); p.line(7, 12, 3, 16, '#87b197');
      p.rect(2, 16, 3, 2, '#b4774b');
    },
    gada_tambatan: function (p) {
      p.line(3, 16, 13, 7, '#82533e', 4); p.line(4, 15, 13, 6, '#c4905e', 2);
      p.poly([[8, 6], [12, 2], [16, 2], [18, 5], [18, 9], [15, 12], [11, 12]], '#795354');
      p.poly([[9, 6], [13, 3], [17, 3], [17, 6], [13, 8], [10, 7]], '#b38972');
      p.line(11, 5, 15, 10, '#d3ab73', 2); p.px(12, 5, '#e7c38e');
      p.line(3, 14, 6, 17, '#536c62', 2); p.line(3, 15, 5, 17, '#8fbd9c');
    },
    busur_tenggiri: function (p) {
      p.line(4, 3, 15, 15, '#dcdab2'); p.line(4, 3, 9, 2, '#c0824c', 2);
      p.line(9, 2, 13, 4, '#dca96b', 2); p.line(13, 4, 16, 8, '#a16d49', 2);
      p.line(16, 8, 16, 12, '#975e41', 2); p.line(16, 12, 15, 15, '#dca96b', 2);
      p.rect(14, 6, 3, 4, '#327c78');
      p.line(3, 15, 14, 4, '#aa825d'); p.poly([[13, 3], [17, 2], [16, 6], [14, 6]], '#dce3d3');
      p.line(3, 14, 6, 13, '#65bab0'); p.px(4, 16, '#397d77');
    },
    pelontar_damar: function (p) {
      p.line(5, 12, 8, 17, '#6f4a38', 4); p.line(5, 12, 8, 17, '#c39158', 2);
      p.line(5, 12, 4, 4, '#b38455', 3); p.line(6, 12, 12, 8, '#805440', 3); p.line(12, 8, 14, 4, '#ac7950', 2);
      p.line(4, 4, 8, 3, '#d1b693'); p.line(8, 3, 14, 4, '#d1b693');
      p.disc(8, 4, 2.5, '#d27c43'); p.px(7, 3, '#ffe0a3');
      p.line(5, 14, 8, 13, '#3b7771', 2); p.line(6, 15, 8, 14, '#67a58e');
    }
  };
  var IC = {
    nibong: function (p) { for (var i = 0; i < 3; i++) { p.rect(3 + i * 4, 2 + i, 3, 13 - i, '#7a6a4a'); p.rect(3 + i * 4, 2 + i, 3, 1, '#c8b88a'); } },
    belian: function (p) { p.ell(8, 9, 7, 4, '#5a2e1e'); p.ell(8, 8, 6, 2.6, '#7a3e28'); p.ell(14, 9, 1.6, 3.4, '#c8784a'); },
    keris_besi: function (p) { p.line(3, 13, 6, 10, '#98623e'); p.line(4, 9, 8, 13, '#b68149'); p.poly([[6, 10], [9, 5], [8, 4], [14, 1], [12, 6], [12, 8], [8, 12]], '#b2c1c9'); p.line(9, 8, 13, 2, '#f0f4ed'); },
    pedang_barunai: function (p) { p.line(2, 14, 6, 10, '#895034'); p.line(4, 8, 8, 12, '#d4a34f'); p.poly([[6, 9], [11, 2], [14, 1], [14, 5], [8, 11]], '#b6c8ce'); p.line(7, 9, 13, 2, '#f1fbf5'); },
    tombak_belian: function (p) { p.line(1, 14, 11, 4, '#a1653b'); p.line(2, 14, 11, 5, '#6a3e29'); p.poly([[9, 4], [14, 1], [13, 6], [10, 7]], '#c7d8d8'); p.px(13, 3, '#f7f3dd'); },
    pinggan_emas: function (p) { p.ell(8, 9, 7, 4, '#c4922f'); p.ell(8, 8.5, 5.6, 3, '#e9c46a'); p.ell(6, 7.5, 2, 1, '#fff4c0'); },
    bulu_mutiara: function (p) { p.line(3, 14, 12, 2, '#8a8690'); p.line(4, 11, 11, 3, '#a8a4ae'); p.line(5, 13, 13, 5, '#a8a4ae'); p.px(12, 2, '#e8f4ff'); }
  };

  Art.generate9 = function (scene) {
    var make = Art.make;
    Object.keys(WORK).forEach(function (k) { make(scene, k, 48, 48, WORK[k], true); });
    Object.keys(WEAPON_ICONS).forEach(function (id) { make(scene, 'i_' + id, 20, 20, WEAPON_ICONS[id], '#181425'); });
    make(scene, 'ayer_weapon_shop', 40, 43, drawWeaponShop, '#181425');
    make(scene, 'arrow_ayer', 16, 7, function (p) {
      p.line(3, 3, 12, 3, '#c99b65'); p.poly([[11, 1], [15, 3], [11, 6]], '#c6dade');
      p.line(1, 1, 5, 3, '#82c8b4'); p.line(1, 5, 5, 3, '#39887b');
      p.px(13, 3, '#f0f3d5');
    });
    make(scene, 'damar_shot', 9, 7, function (p) {
      p.line(0, 3, 4, 3, '#ebbf70'); p.disc(5.5, 3.5, 2.7, '#5d4544');
      p.disc(5.5, 3.5, 1.9, '#d18b4e'); p.px(6, 2, '#ffdb88');
    });
    make(scene, 'fg_nibong', 16, 24, function (p) { drawNibong(p, true); }, true);
    make(scene, 'fg_nibong_e', 16, 24, function (p) { drawNibong(p, false); }, true);
    make(scene, 'fg_belian', 20, 14, function (p) { drawBelian(p, true); }, true);
    make(scene, 'fg_belian_e', 20, 14, function (p) { drawBelian(p, false); }, true);
    for (var f = 0; f < 2; f++) (function (f) {
      make(scene, 'padian_' + f, 34, 18, function (p) { drawPadian(p, f); }, true);
      make(scene, 'mutiara_' + f, 16, 16, function (p) { drawRooster(p, f, '#f2e6c8', '#ffffff', '#e9c46a', '#e0303a'); }, true);
      make(scene, 'asmara_' + f, 16, 16, function (p) { drawRooster(p, f, '#1e2a24', '#2e4a3a', '#2a8a5a', '#c8323a'); }, true);
    })(f);
    make(scene, 'asmara_ghost', 16, 16, function (p) { drawRooster(p, 0, 'rgba(160,230,220,0.75)', 'rgba(220,255,250,0.8)', 'rgba(120,220,200,0.7)', 'rgba(255,160,160,0.8)'); });
    make(scene, 'batu_ayam', 20, 24, function (p) {
      p.ell(10, 21, 9, 3, '#7a7680'); p.ell(10, 20, 7, 2, '#8e8a94');
      var G = '#8e8a94', G2 = '#a8a4ae', D = '#5a5660';
      p.line(8, 18, 7, 20, D); p.line(11, 18, 12, 20, D);
      p.ell(10, 13, 5, 4.4, G); p.ell(9, 12, 3, 2.6, G2); [[5, 12, 1, 6], [5, 13, 2, 9], [5, 14, 3, 12]].forEach(function (l) { p.line(l[0], l[1], l[2], l[3], D); });
      p.disc(14, 8, 2.4, G); p.px(15, 7, '#3a3640'); p.px(17, 8, D); p.rect(13, 5, 3, 1, D); p.px(14, 4, D);
      p.speck(4, 6, 12, 12, '#6aa84f', 4);
    }, true);
    make(scene, 'jong_majapahit', 80, 48, drawJong, true);
    make(scene, 'perahu_kecil', 24, 12, function (p) { p.poly([[1, 4], [23, 4], [19, 10], [5, 10]], '#8a5a2b'); p.rect(3, 4, 18, 1, '#a8743e'); p.line(14, 2, 20, 8, '#5a3a1e'); p.rect(0, 10, 24, 1, 'rgba(220,240,255,0.55)'); }, true);
    make(scene, 'perahu_race_dock', 36, 26, function (p) {
      p.rect(8, 2, 2, 19, '#755844'); p.poly([[10, 2], [25, 5], [10, 10]], '#e0a644'); p.rect(11, 5, 6, 2, '#fff0bc');
      p.poly([[1, 17], [35, 15], [31, 22], [7, 24]], '#834c37'); p.line(2, 17, 34, 15, '#e8ba67');
      p.line(2, 24, 25, 24, '#9ad7e4'); p.line(24, 22, 35, 21, '#b4ebf1');
    }, true);
    // Rest, catch, pull, lift, and recovery poses for the crew and their paddles.
    var strokes = [[0, -2, 18], [2, 6, 22], [-1, -2, 23], [-2, -7, 19], [1, 5, 14]];
    strokes.forEach(function (pose, frame) {
      make(scene, 'perahu_race_boat_' + frame, 48, 25, function (p) {
        for (var x = 8; x <= 34; x += 5) {
          var head = x + pose[0];
          p.rect(head, 5, 3, 4, '#f1c69a'); p.rect(head, 4, 3, 1, '#342e32');
          p.line(head + 1, 9, x + 1, 13, '#e4e8d7');
        }
        p.poly([[1, 13], [46, 11], [41, 18], [9, 19]], '#9c5e3e');
        p.line(3, 13, 44, 12, '#fff2bd'); p.line(10, 17, 40, 16, '#ce9263');
        for (var oar = 8; oar <= 34; oar += 5) {
          var blade = oar + pose[1];
          p.line(oar + pose[0], 10, blade, pose[2], '#b87b46');
          p.line(blade - 1, pose[2] - 1, blade + 1, pose[2], '#e7b577');
        }
      }, true);
    });
    make(scene, 'perahu_race_wake', 48, 11, function (p) {
      p.line(2, 6, 22, 6, '#8fcede'); p.line(16, 4, 38, 5, '#b4e5e9'); p.line(26, 7, 48, 5, '#e2f8ed');
      p.line(8, 9, 20, 9, '#6fb7d1'); p.line(32, 2, 46, 4, '#f0f8ed');
    });
    make(scene, 'perahu_race_splash', 24, 12, function (p) {
      p.px(5, 2, '#d5f8fc'); p.px(11, 5, '#d5f8fc'); p.px(20, 1, '#d5f8fc');
      p.line(1, 9, 8, 8, '#a5dce8'); p.line(13, 10, 22, 8, '#a5dce8'); p.px(16, 4, '#f1f9e8');
    });
    Object.keys(IC).forEach(function (id) { make(scene, 'i_' + id, 16, 16, IC[id], true); });
    var a = scene.anims;
    ['padian', 'mutiara', 'asmara'].forEach(function (k) {
      if (!a.exists(k + '_idle')) a.create({ key: k + '_idle', frames: [{ key: k + '_0' }, { key: k + '_1' }], frameRate: k === 'padian' ? 1.5 : 3, repeat: -1 });
    });
  };
})(window.LC);
