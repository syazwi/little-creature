/* Original pixel art for Jack Separaw, the treasure ship and the Kraken. */
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
  Art.generate24 = function (scene) {
    var make = Art.make;
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
    make(scene, 'kraken12_head', 172, 112, function (p) {
      p.ell(86, 59, 78, 51, '#272d50'); p.ell(84, 50, 71, 43, '#485276'); p.ell(70, 28, 44, 17, '#636591');
      p.ell(53, 73, 39, 27, '#383953'); p.ell(123, 73, 38, 27, '#383953');
      p.ell(54, 65, 23, 12, '#1f233c'); p.ell(119, 65, 23, 12, '#1f233c');
      p.ell(54, 66, 13, 6, '#dfa361'); p.ell(119, 66, 13, 6, '#dfa361'); p.rect(51, 62, 6, 8, '#32233e'); p.rect(116, 62, 6, 8, '#32233e');
      p.speck(35, 25, 101, 16, '#8b81a1', 22); p.line(14, 103, 155, 104, '#81abbb', 2);
    }, true);
    [0, 1].forEach(function (f) { make(scene, 'kraken12_' + f, 24, 22, function (p) {
      p.ell(12, 12, 11, 9, '#413751'); p.ell(12, 10, 9, 4 + f, '#ffd488'); p.rect(10, 6, 4, 8, '#34203d'); p.px(14, 8, '#ffffc9');
    }, true); });
    make(scene, 'i_serpihan_ribut', 16, 16, function (p) { p.poly([[1, 12], [4, 4], [12, 1], [15, 6], [9, 15]], '#4a988c'); p.poly([[5, 5], [11, 2], [12, 7], [7, 12]], '#9ce3bc'); p.px(10, 4, '#e0f8cf'); }, true);
    [['npc_jack12', 'idle'], ['raider12', 'walk'], ['captain12', 'walk'], ['kraken12', 'walk']].forEach(function (a) {
      var key = a[0] + '_' + a[1];
      if (!scene.anims.exists(key)) scene.anims.create({ key: key, frames: [{ key: a[0] + '_0' }, { key: a[0] + '_1' }], frameRate: a[1] === 'idle' ? 2 : 5, repeat: -1 });
    });
  };
})(window.LC);
