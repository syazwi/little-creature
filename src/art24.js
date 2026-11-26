/* Original pixel art for Nakhoda Idris, the treasure ship and the Kraken. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art;
  function jack(p, step) {
    p.rect(6 + step, 24, 4, 4, '#291d23'); p.rect(14 - step, 24, 4, 4, '#291d23');
    p.poly([[6, 15], [17, 15], [21, 23], [3, 23]], '#28575a');
    p.rect(9, 16, 6, 8, '#d2aa68'); p.line(5, 20, 17, 18, '#973942', 2);
    p.rect(8, 6, 9, 10, '#b97952'); p.rect(6, 7, 3, 10, '#39252a'); p.rect(16, 9, 3, 7, '#39252a');
    p.rect(6, 5, 12, 4, '#dfbf89'); p.poly([[5, 5], [9, 1], [17, 3], [21, 7]], '#a04447'); p.rect(17, 5, 5, 3, '#a04447');
    p.px(10, 10, '#201d2a'); p.px(15, 10, '#201d2a'); p.line(11, 13, 15, 12, '#643235'); p.px(17, 13, '#efca72');
    p.line(2, 21, 8, 14, '#ccb494'); p.line(2, 21, 1, 24, '#553a31');
  }
  function ship(p, wave) {
    p.poly([[2, 20], [16, 5], [55, 3], [87, 10], [99, 20], [82, 31], [23, 38], [7, 31]], '#623e32');
    p.poly([[10, 20], [26, 9], [66, 9], [91, 19], [75, 27], [27, 32]], '#ba8a59');
    p.line(11, 18, 84, 16, '#dfb67a', 2); p.line(12, 24, 80, 23, '#84553b', 2);
    p.line(31, 7, 31, 31, '#4c3430', 2); p.line(63, 7, 63, 29, '#4c3430', 2);
    p.poly([[34, 6], [49, 9 + wave], [54, 20], [34, 30]], '#e2cb93');
    p.poly([[64, 5], [77, 10], [81, 21 - wave], [64, 28]], '#8ac2b1');
    p.line(6, 20, 90, 20, '#efd6a0'); p.px(94, 20, '#efc66d');
  }
  var ink = '#181425', deep = '#24354c', teal = '#31606b', jade = '#498c82', mint = '#81b298';
  function krakenHead(p) {
    p.poly([[10, 73], [15, 53], [30, 44], [33, 29], [54, 15], [69, 6], [88, 4], [108, 13],
      [126, 29], [137, 51], [155, 60], [160, 81], [150, 99], [122, 105], [46, 105], [19, 95]], deep);
    p.poly([[15, 71], [29, 53], [37, 33], [68, 13], [88, 9], [108, 18], [126, 38], [137, 61],
      [151, 63], [153, 83], [133, 97], [109, 92], [55, 98], [29, 92]], teal);
    p.poly([[35, 53], [43, 34], [70, 17], [86, 14], [109, 25], [122, 39],
      [122, 57], [102, 50], [84, 58], [61, 51], [44, 62]], jade);
    p.poly([[38, 43], [54, 27], [70, 18], [88, 16], [101, 22], [78, 24], [61, 38], [53, 49]], mint);
    p.line(44, 46, 60, 36, '#b5cf9f', 2);
    p.poly([[76, 21], [88, 13], [106, 21], [116, 37], [113, 49], [101, 41], [91, 46], [82, 38]], '#35656c');
    p.poly([[85, 29], [91, 19], [100, 23], [108, 36], [99, 33], [90, 39]], '#73a994');
    p.poly([[14, 81], [20, 66], [35, 58], [47, 67], [39, 88], [27, 96]], teal);
    p.poly([[132, 62], [143, 62], [153, 72], [155, 84], [146, 94], [127, 94], [126, 79]], '#3c7177');
    p.line(26, 66, 17, 77, mint, 2); p.line(143, 67, 151, 75, mint, 2);
    [46, 116].forEach(function (x, i) {
      var eye = [[x - 20, 62], [x - 12, 54], [x + 5, 55], [x + 18, 63], [x + 15, 74],
        [x + 5, 81], [x - 9, 79], [x - 19, 73]];
      p.poly(eye, ink);
      p.ell(x, 68, 14, 9, '#cd7447');
      p.ell(x, 66, 12, 6, '#f5be63');
      p.poly([[x - 4, 59], [x + 2, 59], [x + 5, 70], [x + 2, 76], [x - 3, 76], [x - 5, 68]], ink);
      p.rect(x - 8, 62, 3, 2, '#fff1b2');
      p.line(x - 12, 56, x + 10, 58, jade, 3);
      p.line(x - 12, 85, x + 5, 88, i ? '#538d87' : mint, 2);
    });
    p.poly([[60, 96], [65, 85], [77, 80], [88, 80], [101, 86], [109, 97], [103, 103],
      [64, 103]], '#533950');
    p.poly([[69, 94], [76, 85], [88, 85], [98, 94], [92, 99], [75, 99]], ink);
    p.poly([[74, 90], [80, 86], [88, 86], [94, 91], [85, 91], [82, 94], [79, 91]], '#e9cf9a');
    [[48, 39], [60, 30], [66, 34], [54, 44], [124, 47], [119, 44], [130, 53]].forEach(function (xy) {
      p.rect(xy[0], xy[1], 3, 2, mint);
    });
    p.line(15, 101, 34, 104, '#6cb4b5', 2);
    p.line(53, 107, 70, 107, '#bce1d4');
    p.line(136, 105, 156, 101, '#8fc7bf', 2);
  }
  // Each row is the spine of a pose. The last pose plants the fin at (122, 82).
  var tailPoses = [
    [[12, 82], [37, 80], [60, 69], [78, 48], [92, 44], [102, 53]],
    [[12, 82], [35, 71], [53, 51], [60, 28], [76, 17], [91, 23]],
    [[12, 82], [32, 68], [47, 44], [54, 20], [69, 11], [87, 14]],
    [[12, 82], [34, 66], [58, 44], [77, 28], [99, 31], [116, 44]],
    [[12, 82], [38, 72], [60, 61], [86, 57], [108, 66], [122, 82]]
  ];
  function krakenTail(p, spine) {
    for (var i = 1; i < spine.length; i++) {
      var a = spine[i - 1], b = spine[i], width = 26 - i * 4;
      p.disc(a[0], a[1], width * 0.57, deep);
      p.line(a[0], a[1], b[0], b[1], deep, width + 3);
    }
    var tip = spine[5], x = tip[0], y = tip[1];
    p.poly([[x - 11, y - 3], [x - 4, y - 15], [x + 14, y - 17], [x + 8, y - 7], [x + 5, y - 4],
      [x + 13, y + 2], [x + 18, y + 14], [x + 3, y + 10], [x - 9, y + 5]], deep);
    p.poly([[x - 8, y - 4], [x - 2, y - 12], [x + 10, y - 14], [x + 4, y - 5],
      [x + 3, y - 2], [x + 13, y + 9], [x + 1, y + 6]], jade);
    for (var j = 1; j < spine.length; j++) {
      var from = spine[j - 1], to = spine[j], size = 25 - j * 4;
      p.line(from[0], from[1] + 1, to[0], to[1] + 1, teal, size);
      p.line(from[0] + 1, from[1] - 3, to[0] + 1, to[1] - 2, jade, Math.max(1, Math.floor(size / 3)));
      if (j < 5) {
        var cx = (from[0] + to[0]) / 2 - 2, cy = (from[1] + to[1]) / 2 + 4;
        p.ell(cx, cy, 4, 3, '#714b68');
        p.ell(cx, cy - 1, 3, 2, '#d2968a');
        p.px(cx, cy, '#9a646c');
      }
    }
    p.px(x + 7, y - 11, mint);
  }
  function fishingLamp(p, lit) {
    p.ell(6.5, 3, 3.5, 2.5, '#825a40'); p.ell(6.5, 3, 1.5, 1, lit ? '#ffcf83' : '#b69258');
    p.rect(3, 5, 7, 8, '#805536');
    p.rect(4, 6, 5, 6, lit ? '#ffba57' : '#9caa84');
    p.line(6, 6, 6, 11, lit ? '#fff2b0' : '#c6bb90');
    p.rect(2, 13, 9, 2, '#c28c4f'); p.px(5, 7, lit ? '#fff6cb' : '#dfcc9e');
  }
  function farmhouseArt(scene) {
    var make = Art.make;
    make(scene, 'farmhouse_bed', 42, 45, function (p) {
      p.rect(6, 3, 30, 39, '#53352a'); p.rect(7, 5, 28, 9, '#b57e4e');
      p.rect(6, 13, 30, 25, '#9b6945'); p.rect(8, 12, 26, 22, '#efe1c2');
      p.rect(11, 14, 20, 7, '#fff0d6'); p.rect(11, 20, 20, 2, '#c9ae94');
      p.rect(8, 23, 26, 14, '#32776c'); p.rect(9, 24, 24, 3, '#7da989');
      p.rect(9, 33, 24, 2, '#c4af73'); p.line(7, 38, 35, 38, '#c48c55', 2);
      p.rect(5, 36, 4, 7, '#714831'); p.rect(33, 36, 4, 7, '#714831');
    }, ink);
    make(scene, 'farmhouse_table', 36, 26, function (p) {
      p.rect(5, 11, 4, 13, '#55382b'); p.rect(27, 11, 4, 13, '#55382b');
      p.rect(3, 4, 30, 12, '#aa7548'); p.line(4, 5, 31, 5, '#cea066');
      p.line(3, 15, 32, 15, '#694735', 2);
      p.ell(13, 9, 5, 3, '#e5d4a9'); p.ell(13, 9, 3, 2, '#a9886c');
      p.ell(25, 8, 4, 2.5, '#dac3a0'); p.ell(25, 8, 2, 1.5, '#a9886c');
    }, ink);
    make(scene, 'farmhouse_door', 25, 29, function (p) {
      p.rect(3, 2, 19, 26, '#734d39'); p.rect(6, 4, 13, 21, '#3d3031');
      p.rect(7, 6, 11, 18, '#aa7548'); p.line(11, 7, 11, 23, '#86583e');
      p.line(4, 3, 20, 3, '#d4a26a', 2); p.rect(14, 15, 3, 2, '#e1b768');
      p.rect(2, 25, 21, 3, '#d0a174');
    }, ink);
    make(scene, 'farmhouse_window', 30, 19, function (p) {
      p.rect(3, 2, 24, 15, '#9c6745'); p.rect(5, 4, 20, 11, '#74a9a4');
      p.line(7, 6, 13, 6, '#b8d9c2'); p.line(18, 6, 22, 6, '#b8d9c2');
      p.rect(14, 4, 2, 12, '#805137'); p.rect(3, 15, 24, 2, '#d4a36e');
    }, ink);
    make(scene, 'farmhouse_mat', 72, 47, function (p) {
      p.rect(3, 3, 66, 41, '#92544f'); p.rect(7, 6, 58, 35, '#d3a173'); p.rect(10, 8, 52, 31, '#b06d59');
      for (var x = 14; x < 59; x += 11) {
        p.poly([[x, 16], [x + 5, 23], [x, 30], [x - 5, 23]], '#e2af78');
        p.px(x, 23, '#8c4a4d');
      }
      for (var y = 6; y < 44; y += 4) { p.line(1, y, 4, y, '#eed9a6'); p.line(67, y, 70, y, '#eed9a6'); }
    });
    ['family_bell_hook', 'family_bell_empty'].forEach(function (key) {
      make(scene, key, 16, 22, function (p) {
        p.rect(3, 1, 10, 19, '#774934'); p.rect(4, 2, 8, 17, '#bd8657');
        p.line(4, 4, 11, 4, '#d4ae74'); p.line(7, 5, 7, 8, '#55382e');
        if (key === 'family_bell_empty') return;
        p.poly([[4, 14], [6, 9], [9, 9], [11, 14], [12, 16], [3, 16]], '#c48f48');
        p.line(5, 15, 10, 15, '#f0cf78'); p.rect(7, 16, 2, 2, '#e2b763');
      }, ink);
    });
  }
  Art.generate24 = function (scene) {
    var make = Art.make;
    farmhouseArt(scene);
    [0, 1].forEach(function (frame) {
      make(scene, 'npc_jack12_' + frame, 24, 28, function (p) { jack(p, frame); }, true);
      make(scene, 'stormship12_' + frame, 100, 40, function (p) { ship(p, frame * 3); }, true);
      [['raider12', '#80506a', 'headband'], ['captain12', '#743838', 'tanjak_red']].forEach(function (d) {
        make(scene, d[0] + '_' + frame, 16, 20, function (p) { Art.drawVillager(p, { skin: '#b8805d', shirt: d[1], shirt2: '#443039', bottom: '#5e534f', bottom2: '#373446', hair: '#211e25', hat: d[2] }, false, frame + 1); });
      });
    });
    make(scene, 'stormdock12', 48, 34, function (p) {
      p.poly([[1, 22], [47, 18], [41, 30], [9, 32]], '#774b38'); p.line(3, 22, 43, 19, '#dfbb79', 2);
      p.line(21, 5, 21, 24, '#623833', 2); p.poly([[22, 6], [40, 14], [22, 21]], '#91bcb2'); p.line(24, 9, 36, 14, '#efe2b2', 2);
      p.line(5, 32, 41, 31, '#9bbfd2');
    }, true);
    make(scene, 'stormhelm12', 16, 22, function (p) { p.rect(6, 13, 4, 9, '#71472d'); p.ell(8, 8, 7, 6, '#9b633d'); p.ell(8, 8, 4, 3, '#4f362c'); p.line(8, 0, 8, 16, '#cf9a65'); p.line(1, 8, 15, 8, '#cf9a65'); }, true);
    make(scene, 'stormwreck12', 55, 25, function (p) { p.poly([[0, 10], [53, 15], [39, 23], [9, 20]], '#684844'); p.line(28, 4, 21, 19, '#83625b', 3); p.line(4, 11, 52, 16, '#ad795b', 2); p.line(10, 22, 45, 24, '#8ec0c4'); });
    [['npc_lina12', '#edba6e', '#7d587d'], ['npc_yusof12', '#4d8a85', '#66504b']].forEach(function (d) {
      make(scene, d[0], 16, 20, function (p) {
        Art.drawVillager(p, { skin: '#ba8259', hair: '#40262c', shirt: d[1], shirt2: '#8f6857', bottom: d[2], bottom2: '#443641' }, false, 0);
      });
    });
    make(scene, 'kraken12_head', 168, 110, krakenHead, ink);
    tailPoses.forEach(function (spine, i) {
      make(scene, 'kraken12_tail_' + i, 144, 101, function (p) { krakenTail(p, spine); }, ink);
    });
    [0, 1].forEach(function (lit) {
      make(scene, 'fishing_lamp12_' + lit, 13, 16, function (p) { fishingLamp(p, lit); }, ink);
      make(scene, 'lampu_pulang12_' + lit, 23, 34, function (p, ctx) {
        p.rect(16, 4, 4, 29, '#78543d'); p.line(17, 6, 17, 30, '#ba8756');
        p.line(7, 6, 18, 4, '#78543d', 3); p.line(7, 7, 7, 10, '#c28c4f');
        ctx.save(); ctx.translate(1, 8); fishingLamp(p, lit); ctx.restore();
      }, ink);
    });
    [0, 1].forEach(function (f) { make(scene, 'kraken12_' + f, 24, 22, function (p) {
      p.ell(12, 12, 10, 8, teal); p.ell(12, 11, 8, 5 + f, ink); p.ell(12, 11, 7, 4 + f, '#f5be63');
      p.rect(11, 7, 3, 8, ink); p.rect(8, 8, 2, 2, '#fff1b2');
    }, ink); });
    make(scene, 'i_serpihan_ribut', 16, 16, function (p) { p.poly([[1, 12], [4, 4], [12, 1], [15, 6], [9, 15]], '#4a988c'); p.poly([[5, 5], [11, 2], [12, 7], [7, 12]], '#9ce3bc'); p.px(10, 4, '#e0f8cf'); }, true);
    [['npc_jack12', 'idle'], ['raider12', 'walk'], ['captain12', 'walk'], ['kraken12', 'walk']].forEach(function (a) {
      var key = a[0] + '_' + a[1];
      if (!scene.anims.exists(key)) scene.anims.create({ key: key, frames: [{ key: a[0] + '_0' }, { key: a[0] + '_1' }], frameRate: a[1] === 'idle' ? 2 : 5, repeat: -1 });
    });
  };
})(window.LC);
