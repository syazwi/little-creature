/* Little Creature — procedural pixel art for v1.7: Badang (a skinny farmhand, then the strongest man in the land),
 * the cheeky river hantu, bamboo bubu traps, the stumps and boulders south of Nenek's field, Batu Badang in the
 * river, the stone for the Lempar Batu contest, and their icons. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art;

  // ================================================================== BADANG
  function drawBadang(p, blink) {   // 16x20 a skinny farmhand in a patched singlet and a rolled-up kain
    var SK = '#a8714a', SK2 = '#8e5c3a';
    p.rect(5, 18, 2, 2, '#5a3a24'); p.rect(9, 18, 2, 2, '#5a3a24');
    p.rect(6, 15, 1, 3, SK); p.rect(9, 15, 1, 3, SK);                       // thin legs
    p.rect(5, 12, 6, 4, '#5a6a8a'); p.rect(5, 13, 6, 1, '#46546e'); p.rect(7, 12, 1, 4, '#46546e'); p.rect(10, 12, 1, 4, '#46546e');   // checked kain
    p.rect(5, 8, 6, 4, '#d8cfb8'); p.rect(9, 9, 2, 2, '#a89a78'); p.px(6, 11, '#b8ae96');                                           // patched singlet
    p.rect(4, 8, 1, 5, SK); p.rect(11, 8, 1, 5, SK2); p.px(4, 13, SK2); p.px(11, 13, SK2);   // arms like rattan
    p.rect(5, 3, 6, 5, SK); p.rect(10, 4, 1, 3, SK2);
    if (blink) { p.rect(6, 5, 2, 1, '#2a1a10'); p.rect(9, 5, 2, 1, '#2a1a10'); } else { p.px(6, 5, '#2a1a10'); p.px(9, 5, '#2a1a10'); }
    p.px(7, 7, '#7a3a2a'); p.px(8, 7, '#7a3a2a');
    p.rect(5, 2, 6, 2, '#8a3a2a'); p.rect(5, 3, 6, 1, '#6a2a1e'); p.px(11, 2, '#8a3a2a'); p.px(12, 3, '#8a3a2a');   // a faded semutar
  }
  function drawBadangKuat(p, blink) {   // 22x26 the strongest man in the land
    var SK = '#a8714a', SK2 = '#8a5634', SK3 = '#c08a5e';
    p.rect(6, 24, 4, 2, '#4a3020'); p.rect(12, 24, 4, 2, '#4a3020');
    p.rect(7, 21, 3, 3, SK); p.rect(12, 21, 3, 3, SK2);                                                  // sturdy legs
    p.rect(5, 16, 12, 6, '#2f6a4a'); p.rect(5, 21, 12, 1, '#245438');                                    // batik kain samping
    for (var y = 17; y < 21; y += 2) for (var x = 6 + (y % 4 ? 1 : 0); x < 16; x += 3) p.px(x, y, '#e9c46a');
    p.rect(5, 15, 12, 2, '#b8322a'); p.px(15, 17, '#b8322a'); p.px(16, 18, '#7a1e1a');                    // red sash
    p.rect(4, 8, 14, 8, '#3a2a20'); p.rect(8, 8, 6, 8, SK); p.rect(8, 11, 6, 1, SK2); p.px(10, 13, SK2); p.px(11, 13, SK2); p.rect(10, 9, 2, 2, SK3);   // open vest, broad chest
    p.ell(3, 11, 2.4, 3.6, SK); p.ell(18.5, 11, 2.4, 3.6, SK2); p.px(2, 9, SK3); p.px(18, 9, SK3);      // arms like jackfruit
    p.rect(2, 13, 3, 4, SK); p.rect(17, 13, 3, 4, SK2); p.rect(1, 16, 4, 2, SK2); p.rect(17, 16, 4, 2, SK2);   // forearms and fists
    p.rect(7, 2, 8, 6, SK); p.rect(14, 3, 1, 4, SK2); p.rect(8, 7, 6, 1, SK2);                         // square jaw
    if (blink) { p.rect(8, 4, 2, 1, '#2a1a10'); p.rect(12, 4, 2, 1, '#2a1a10'); } else { p.px(9, 4, '#2a1a10'); p.px(12, 4, '#2a1a10'); }
    p.rect(8, 3, 2, 1, '#2a1a10'); p.rect(12, 3, 2, 1, '#2a1a10');                                    // bold brows
    p.rect(9, 6, 4, 1, '#3a2418'); p.px(10, 7, '#f0e8d8'); p.px(11, 7, '#f0e8d8');                      // moustache and a grin
    p.rect(7, 0, 8, 3, '#b8322a'); p.rect(7, 2, 8, 1, '#7a1e1a'); p.poly([[12, 1], [16, -2], [15, 2]], '#b8322a'); p.px(10, 1, '#e9c46a');   // tanjak
  }

  // ================================================================== THE RIVER HANTU (16x18: cheeky, not scary)
  function drawHantu(p, f) {
    var B = 'rgba(70,170,150,0.92)', B2 = 'rgba(110,210,180,0.9)', H = '#2e7a68';
    p.ell(8, 9, 6, 6, B); p.ell(7, 7, 4, 3.4, B2);
    for (var x = 2; x <= 14; x += 2) p.line(x, 4 + (x % 4 ? 1 : 0), x + (f ? 1 : -1) * (x < 8 ? -1 : 1), 13, H);   // shaggy wet hair
    p.ell(8, 14.5, 2.6, 3 + f * 0.5, '#9ae8c8'); p.line(8, 12, 8, 17, '#6ac8a0'); p.px(7, 17, '#6ac8a0');           // the long dripping beard
    p.disc(5.5, 8, 2, '#ffffff'); p.disc(10.5, 8, 2, '#ffffff'); p.px(6, 8 + f, '#14201c'); p.px(11, 8 + f, '#14201c');   // big round eyes
    p.line(6, 11, 10, 11, '#14201c'); p.px(5, 10, '#14201c'); p.px(11, 10, '#14201c'); p.px(9, 12, '#ffffff');      // a cheeky grin, one tooth
    p.px(1, 10 + f, B2); p.px(0, 11 + f, B2); p.px(15, 10 - f, B2); p.px(16, 9 - f, B2);                           // little arms
    p.px(3, 16 + f, '#bfe6ff'); p.px(13, 15 - f, '#bfe6ff');                                                      // drips
    p.outline('#1e4a40');
  }

  // ================================================================== BUBU, STUMPS, BOULDERS, BATU BADANG
  function drawBubu(p) {   // 16x14 a bamboo fish trap set in the water
    p.ell(8, 11, 7.5, 2.4, 'rgba(160,215,240,0.55)');
    p.poly([[1, 9], [12, 3], [15, 6], [4, 12]], '#c8a46a'); p.poly([[3, 9], [12, 4.5], [13, 6], [4, 10.5]], '#a8844a');
    for (var i = 0; i < 4; i++) p.line(3 + i * 3, 11 - i * 1.6, 5 + i * 3, 7 - i * 1.6, '#7a5a2e');
    p.disc(13.5, 4.8, 2, '#5a3a20'); p.disc(13.5, 4.8, 1, '#2a1a10');                // the mouth of the trap
    p.rect(1, 11, 14, 1, 'rgba(220,240,255,0.7)'); p.px(3, 12, 'rgba(220,240,255,0.6)'); p.px(12, 12, 'rgba(220,240,255,0.6)');
    p.line(14, 3, 15, 0, '#8a6a3a'); p.disc(15, 0.6, 1, '#e76f51');                  // a little float on a string
  }
  function drawTunggul(p) {   // 30x20 a great old stump with its roots
    p.ell(15, 17, 14, 3, 'rgba(0,0,0,0.18)');
    p.poly([[2, 18], [8, 12], [11, 15]], '#5a3a20'); p.poly([[28, 18], [21, 12], [19, 15]], '#4a2e18'); p.poly([[12, 19], [15, 12], [18, 19]], '#5a3a20');
    p.rect(7, 6, 16, 11, '#6b4423'); p.rect(19, 6, 4, 11, '#4e3018'); p.line(10, 8, 10, 15, '#4e3018'); p.line(15, 8, 14, 16, '#4e3018');
    p.ell(15, 6, 8, 3, '#c99a5e'); p.ell(15, 6, 5.5, 2, '#b8844a'); p.ell(15, 6, 3, 1, '#c99a5e'); p.px(15, 6, '#8a5a2b');   // the rings
    p.speck(7, 9, 15, 7, '#3f7a32', 6);
  }
  function drawBatuBesar(p) {   // 30x20 a great mossy boulder
    p.ell(15, 17, 14, 3, 'rgba(0,0,0,0.2)');
    p.ell(15, 11, 13, 8, '#7a7680'); p.ell(13, 9, 10, 6, '#8e8a94'); p.ell(11, 7, 5, 3, '#a8a4ae');
    p.line(18, 5, 22, 12, '#5a5660'); p.line(6, 12, 11, 15, '#5a5660');
    p.ell(9, 5, 5, 2, '#4f8a3a'); p.speck(4, 3, 12, 4, '#6aa84f', 6);
  }
  function drawBatuKecil(p) {   // 16x14 a smaller boulder
    p.ell(8, 12, 7, 2, 'rgba(0,0,0,0.2)');
    p.ell(8, 8, 7, 5.5, '#7a7680'); p.ell(7, 7, 5, 4, '#8e8a94'); p.ell(6, 5, 2.4, 1.6, '#a8a4ae'); p.line(10, 4, 12, 9, '#5a5660');
    p.speck(3, 3, 9, 3, '#6aa84f', 4);
  }
  function drawBatuBadang(p) {   // 34x30 the great stone in the river
    p.ell(17, 25, 16, 4, 'rgba(200,230,250,0.6)'); p.ell(17, 25, 12, 2.6, 'rgba(120,180,220,0.6)');
    p.poly([[4, 25], [6, 10], [13, 3], [24, 4], [30, 12], [31, 25]], '#7a7680');
    p.poly([[7, 23], [8, 11], [14, 5], [22, 6], [27, 13], [26, 23]], '#8e8a94');
    p.poly([[10, 12], [15, 7], [21, 8], [19, 12]], '#a8a4ae');
    p.line(20, 9, 24, 20, '#5a5660'); p.line(9, 16, 14, 22, '#5a5660'); p.line(15, 14, 17, 23, '#6a6670');
    p.ell(12, 6, 6, 2, '#4f8a3a'); p.speck(6, 4, 20, 6, '#6aa84f', 10);
    p.rect(4, 24, 27, 1, 'rgba(230,245,255,0.8)'); p.px(2, 26, '#e8f6ff'); p.px(32, 26, '#e8f6ff');
  }

  // ================================================================== ICONS AND SMALL THINGS
  var IC = {
    bubu: function (p) { p.poly([[1, 12], [11, 3], [15, 7], [5, 15]], '#c8a46a'); for (var i = 0; i < 4; i++) p.line(3 + i * 3, 12 - i * 2.2, 6 + i * 3, 9 - i * 2.2, '#7a5a2e'); p.disc(13, 5, 2, '#5a3a20'); p.disc(13, 5, 1, '#2a1a10'); },
    piala_batu: function (p) { p.rect(4, 13, 8, 2, '#8a8a92'); p.rect(6, 10, 4, 3, '#c8c8d0'); p.ell(8, 6, 5, 4, '#d8d8e0'); p.ell(7, 5, 3, 2, '#f4f4fa'); p.line(10, 3, 12, 7, '#a8a8b0'); }
  };
  var HUD = {
    ic_badang: function (p) {   // a flexed arm
      p.ell(5, 4, 3, 3, '#a8714a'); p.ell(4, 3, 1.4, 1.2, '#c08a5e'); p.rect(2, 6, 4, 5, '#a8714a'); p.rect(6, 8, 5, 3, '#8a5634'); p.disc(10, 7, 1.6, '#8a5634');
      p.rect(1, 10, 6, 2, '#b8322a');
    }
  };

  Art.generate6 = function (scene) {
    var make = Art.make;
    for (var f = 0; f < 2; f++) (function (f) {
      make(scene, 'npc_badang_' + f, 16, 20, function (p) { drawBadang(p, !!f); }, true);
      make(scene, 'npc_badangK_' + f, 22, 26, function (p) { drawBadangKuat(p, !!f); }, true);
      make(scene, 'hantu_air_' + f, 17, 18, function (p) { drawHantu(p, f); });
    })(f);
    make(scene, 'bubu_set', 16, 14, drawBubu);
    make(scene, 'tunggul', 30, 20, drawTunggul, true);
    make(scene, 'batu_besar', 30, 20, drawBatuBesar, true);
    make(scene, 'batu_kecil', 16, 14, drawBatuKecil, true);
    make(scene, 'batu_badang', 34, 30, drawBatuBadang);
    make(scene, 'batu_lempar', 12, 10, function (p) { p.ell(6, 5.5, 5.5, 4.2, '#7a7680'); p.ell(5, 4.5, 3.6, 2.6, '#9a96a0'); p.px(4, 3, '#c8c4ce'); }, true);
    make(scene, 'gumpal', 8, 8, function (p) { p.disc(4, 4, 3.4, '#7aff9a'); p.disc(3.4, 3.4, 1.6, '#d8ffe0'); p.px(6, 6, '#3ac86a'); });
    Object.keys(IC).forEach(function (id) { make(scene, 'i_' + id, 16, 16, IC[id], true); });
    Object.keys(HUD).forEach(function (k) { make(scene, k, 12, 12, HUD[k], true); });
    var a = scene.anims;
    if (!a.exists('npc_badangK_idle')) a.create({ key: 'npc_badangK_idle', frames: [{ key: 'npc_badangK_0', duration: 2400 }, { key: 'npc_badangK_1', duration: 140 }], repeat: -1 });
    if (!a.exists('hantu_air_idle')) a.create({ key: 'hantu_air_idle', frames: [{ key: 'hantu_air_0' }, { key: 'hantu_air_1' }], frameRate: 3, repeat: -1 });
  };
})(window.LC);
