/* Little Creature — procedural pixel art for v1.6: the wild creatures (boar, rock crab, giant scorpion, fire
 * jellyfish), Mak Deruma (as a ghost, and alive), Si Tanggang alive, her old sampan, and battle effects:
 * hit sparks, stone dust, the Sumpahan Batu and Restu Ibu icons. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art;

  // ================================================================== WILD CREATURES (they face right)
  function drawBabi(p, f) {   // 22x14 a wild boar
    var B = '#4a3628', B2 = '#5e4634', D = '#2e2018';
    (f ? [5, 8, 13, 16] : [6, 7, 14, 15]).forEach(function (x) { p.rect(x, 10, 2, 4, D); });
    p.ell(11, 8, 8, 4.2, B); p.ell(10, 7, 6, 2.4, B2);
    for (var x = 5; x < 15; x += 2) p.px(x, 3 + (x % 4 ? 0 : 1), D);   // bristly mane
    p.ell(17.5, 8, 3.6, 3, B); p.rect(20, 8, 2, 2, '#7a5a48'); p.px(21, 8, '#2a1a10');
    p.px(17, 6, '#ff5040'); p.line(19, 10, 21, 6, '#f0e8d8');            // red eye, white tusk
    p.px(15, 4, D); p.px(16, 4, D); p.px(16, 5, D);                      // ear
    p.px(3, 6, D); p.px(2, 7, D);                                         // tail
    p.outline('#1a120c');
  }
  function drawKetamBatu(p, f) {   // 18x12 a giant rock crab
    var S = '#6a5a52', S2 = '#857168', C = '#c0503a';
    for (var i = 0; i < 3; i++) { p.line(5 - i, 8, 2 - i + (f ? 1 : 0), 11, '#5a4038'); p.line(13 + i, 8, 16 + i - (f ? 1 : 0), 11, '#5a4038'); }
    p.ell(9, 7, 6, 3.6, S); p.ell(9, 6, 4.6, 2.4, S2); p.speck(4, 4, 10, 5, '#a89a90', 5);
    p.disc(2.5, 4 + (f ? 1 : 0), 2.2, C); p.disc(15.5, 4 + (f ? 0 : 1), 2.2, C); p.px(1, 3, '#2a1a10'); p.px(17, 3, '#2a1a10');
    p.px(7, 3, S2); p.px(11, 3, S2); p.px(7, 2, '#ffd040'); p.px(11, 2, '#ffd040');
    p.outline('#1a120c');
  }
  function drawKala(p, f) {   // 22x14 a giant scorpion
    var K = '#3a2a3a', K2 = '#5a4058', A = '#ff9a3a';
    for (var i = 0; i < 4; i++) { var x = 8 + i * 2.4; p.line(x, 10, x - 1 + ((i + f) % 2), 13, K); }
    p.ell(11, 9, 6, 2.6, K); p.ell(11, 8.4, 4.4, 1.6, K2);
    p.disc(5, 8, 1.7, K); p.disc(3.4, 6, 1.6, K); p.disc(3, 3.8, 1.5, K); p.disc(4.6, 2, 1.4, K);   // the tail curls over its back
    p.poly([[5.5, 0.5], [9, 1.4 + (f ? 0.8 : 0)], [6, 3]], A);                                        // a glowing sting
    p.line(16, 8, 19, 6 + (f ? 1 : 0), K); p.disc(20, 5.4 + (f ? 1 : 0), 1.7, K2); p.line(16, 10, 19, 11, K); p.disc(20, 11.4, 1.7, K2);
    p.px(15, 8, '#ff5040'); p.px(16, 7, '#ff5040');
    p.outline('#120a10');
  }
  function drawObor(p, f) {   // 12x16 a fire jellyfish (it glows, so no outline)
    p.ell(6, 5, 5, 4, 'rgba(255,96,64,0.95)'); p.ell(6, 4, 3.4, 2.4, 'rgba(255,190,120,1)'); p.ell(6, 3.5, 1.6, 1, '#fff4d0'); p.px(4, 3, '#ffffff');
    for (var x = 2; x < 11; x += 2) p.line(x, 8, x + (f ? 1 : -1) * (x % 4 ? 1 : 0), 15 - (x % 3), 'rgba(255,130,70,0.95)');
    p.px(5, 5, '#c02020'); p.px(7, 5, '#c02020');
  }

  // ================================================================== MAK DERUMA, AND SI TANGGANG ALIVE
  function drawDeruma(p, blink) {   // 16x22 the ghost of an old mother in her selendang
    var A = 'rgba(255,236,210,0.86)', A2 = 'rgba(232,200,170,0.82)', SH = 'rgba(220,150,180,0.88)';
    p.poly([[3, 12], [13, 12], [13, 18], [11, 21], [9, 18], [7, 21], [5, 18], [3, 21]], A2);
    p.rect(4, 9, 8, 4, A);
    p.rect(5, 3, 6, 6, 'rgba(250,228,205,0.92)');
    p.rect(4, 1, 8, 2, SH); p.rect(4, 2, 1, 8, SH); p.rect(11, 2, 1, 8, SH); p.rect(3, 9, 10, 1, SH); p.px(12, 10, SH); p.px(12, 11, SH);
    if (blink) { p.rect(6, 5, 2, 1, '#6a4a3a'); p.rect(9, 5, 2, 1, '#6a4a3a'); } else { p.px(7, 5, '#6a4a3a'); p.px(9, 5, '#6a4a3a'); }
    p.px(7, 7, '#a07a6a'); p.px(8, 7, '#a07a6a'); p.px(6, 6, 'rgba(200,170,150,0.9)'); p.px(10, 6, 'rgba(200,170,150,0.9)');
    p.outline('#c8a080');
  }
  var LOOKS = {
    tanggangH: { skin: '#c9905e', shirt: '#3a5a8a', shirt2: '#2a4470', bottom: '#c8a040', bottom2: '#a07a28', hair: '#1a1210', hat: 'songkok' },
    derumaH: { skin: '#b9825a', shirt: '#8a4a6a', shirt2: '#6a3a52', bottom: '#5a3a4a', bottom2: '#42283a', hair: '#d8d4cc', hat: 'tudung', hatColor: '#c88aa8' }
  };
  function drawSampanLama(p) {   // 32x12 her old boat, beached on the sand
    p.poly([[1, 4], [31, 4], [27, 10], [5, 10]], '#8a8478'); p.rect(3, 4, 26, 1, '#a8a294'); p.rect(5, 6, 22, 3, '#6e685e');
    p.line(9, 5, 8, 9, '#5a544c'); p.line(16, 5, 16, 9, '#5a544c'); p.line(23, 5, 24, 9, '#5a544c');
    p.speck(4, 6, 24, 4, '#b8b0a0', 6); p.rect(12, 7, 8, 1, '#c8a8b0');
    p.ell(26, 10.5, 5, 1.6, '#e8d8a8'); p.ell(4, 10.5, 3, 1.2, '#e8d8a8');
  }

  // ================================================================== ICONS AND EFFECTS
  var HUD = {
    ic_batu: function (p) {   // the stone curse: a grey stone face with glowing eyes
      p.ell(6, 6.5, 5, 5, '#8a8690'); p.ell(5, 5, 3.4, 3, '#a8a4ae'); p.line(3, 9, 6, 7, '#5a5660'); p.line(8, 3, 10, 6, '#5a5660');
      p.rect(3, 5, 2, 1, '#8fd3ff'); p.rect(7, 5, 2, 1, '#8fd3ff'); p.rect(4, 8, 4, 1, '#4a4650');
    },
    ic_restu: function (p) {   // a mother's blessing: two hands cupping a little flame
      p.poly([[1, 6], [5, 11], [6, 11], [3, 5]], '#e2b48a'); p.poly([[11, 6], [7, 11], [6, 11], [9, 5]], '#d6a77a');
      p.ell(6, 4.5, 2, 3, '#ffd166'); p.ell(6, 5, 1, 1.6, '#fff8d0'); p.px(6, 1, '#ffe8a0');
    }
  };

  Art.generate5 = function (scene) {
    var make = Art.make;
    for (var f = 0; f < 2; f++) (function (f) {
      make(scene, 'babi_' + f, 22, 14, function (p) { drawBabi(p, f); });
      make(scene, 'ketam_batu_' + f, 18, 12, function (p) { drawKetamBatu(p, f); });
      make(scene, 'kala_' + f, 22, 14, function (p) { drawKala(p, f); });
      make(scene, 'obor_' + f, 12, 16, function (p) { drawObor(p, f); });
      make(scene, 'npc_deruma_' + f, 16, 22, function (p) { drawDeruma(p, !!f); });
      Object.keys(LOOKS).forEach(function (k) { make(scene, 'npc_' + k + '_' + f, 16, 20, function (p) { Art.drawVillager(p, LOOKS[k], !!f); }); });
    })(f);
    make(scene, 'sampan_lama', 32, 12, drawSampanLama, true);
    make(scene, 'hitfx', 13, 13, function (p) {   // a burst where a blow lands
      [[6, 0, 6, 12], [0, 6, 12, 6], [2, 2, 10, 10], [10, 2, 2, 10]].forEach(function (l, i) { p.line(l[0], l[1], l[2], l[3], i < 2 ? '#fff8e0' : '#ffd166'); });
      p.disc(6, 6, 2.2, '#ffffff');
    });
    make(scene, 'pebble', 3, 3, function (p) { p.rect(0, 0, 3, 3, '#8a8690'); p.px(0, 0, '#b8b4be'); p.px(2, 2, '#5a5660'); });
    Object.keys(HUD).forEach(function (k) { make(scene, k, 12, 12, HUD[k], true); });
    // animations: the creatures' walk cycles, and the two villagers' idle blink once they live again
    var a = scene.anims;
    Object.keys(LC.ENEMY_ANIMS).forEach(function (k) {
      if (!a.exists(k + '_walk')) a.create({ key: k + '_walk', frames: [{ key: k + '_0' }, { key: k + '_1' }], frameRate: LC.ENEMY_ANIMS[k], repeat: -1 });
    });
    Object.keys(LOOKS).forEach(function (k) {
      if (!a.exists('npc_' + k + '_idle')) a.create({ key: 'npc_' + k + '_idle', frames: [{ key: 'npc_' + k + '_0', duration: 2600 }, { key: 'npc_' + k + '_1', duration: 140 }], repeat: -1 });
    });
  };
})(window.LC);
