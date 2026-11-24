/* Pixel art for Chapter 17, Penyamun Empat Puluh? (v3.17): Ali Baba and his bicycle, the four masked thieves and
 * "Datuk Saudagar", Panglima Garong with his pole, the cliff door at Bukit Kapur (shut and open), Tok Batu's grumpy
 * face, the thieves' cave (the chalk wall, the stolen pile, the stove, the diary, the shopping list, the Roda Rahsia),
 * the honey cart, the thieves under Pak Mat's net, and the new icons. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art;
  var CAST = {
    alibaba: { skin: '#a06a40', shirt: '#9a7a52', shirt2: '#7a5a3a', bottom: '#4a5a3a', bottom2: '#3a4a2e', hair: '#2a1e14', hat: 'headband' },
    garong: { skin: '#9a6440', shirt: '#26262e', shirt2: '#1a1a20', bottom: '#6a1e1e', bottom2: '#4a1414', hair: '#1a1210', hat: 'tanjak_red' },
    kopak: { skin: '#a8703e', shirt: '#7a6a52', shirt2: '#5a4a3a', bottom: '#4a4a4a', bottom2: '#343434', hair: '#1a1210' },
    senget: { skin: '#b07a52', shirt: '#3a4a6a', shirt2: '#2a3650', bottom: '#2a2a2a', bottom2: '#1e1e1e', hair: '#1a1210', hat: 'songkok' },
    kecik: { skin: '#9a5e36', shirt: '#2a2a30', shirt2: '#1e1e24', bottom: '#3a3a52', bottom2: '#2a2a3e', hair: '#1a1210' },
    saudagar: { skin: '#9a6440', shirt: '#d0a848', shirt2: '#a8802a', bottom: '#5a2a6a', bottom2: '#40204e', hair: '#d8d4cc', hat: 'songkok' }
  };
  function extras(p, who) {
    if (who === 'garong' || who === 'kopak' || who === 'senget' || who === 'kecik') {   // the bandit mask
      p.rect(4, 4, 8, 2, '#141418'); p.px(6, 5, '#f4f4f4'); p.px(9, 5, '#f4f4f4');
    }
    if (who === 'garong') { p.rect(5, 6, 6, 1, '#1a1210'); p.px(4, 7, '#1a1210'); p.px(11, 7, '#1a1210'); p.px(3, 6, '#1a1210'); p.px(12, 6, '#1a1210'); }   // a magnificent moustache
    if (who === 'alibaba') { p.rect(6, 6, 4, 1, '#2a1e14'); }
    if (who === 'kopak') { p.rect(5, 10, 2, 2, '#9a8a6a'); p.px(10, 12, '#5a7a9a'); }   // patches
    if (who === 'kecik') { p.rect(3, 9, 1, 4, '#2a2a30'); p.rect(12, 9, 1, 4, '#1e1e24'); }   // big shoulders
    if (who === 'saudagar') { p.rect(5, 6, 6, 3, '#f4f4f0'); p.rect(6, 9, 4, 2, '#f4f4f0'); p.px(7, 11, '#e8e8e0'); p.px(8, 11, '#e8e8e0'); p.rect(4, 12, 8, 1, '#7a2a8a'); }   // a long fake beard and a sash
  }
  function prop(p, kind) {
    if (kind === 'axe') { p.line(13, 6, 13, 15, '#7a4b28'); p.rect(12, 4, 3, 3, '#a8a8b0'); p.px(15, 5, '#d8d8e0'); }
    if (kind === 'pole') { p.line(14, 1, 14, 18, '#8a5a30'); p.px(14, 0, '#6a4420'); }
    if (kind === 'sack') { p.ell(13, 11, 3, 3.4, '#d8c090'); p.px(13, 7, '#a88a50'); p.px(12, 10, '#b89a60'); }
  }
  function person(scene, key, who, blink, step, pr) {
    Art.make(scene, key, 16, 20, function (p) {
      Art.drawVillager(p, CAST[who], blink, step);
      extras(p, who);
      if (pr) prop(p, pr);
    });
  }

  Art.generate30 = function (scene) {
    var make = function (key, w, h, draw, outline) { Art.make(scene, key, w, h, draw, outline === undefined ? true : outline); };
    var a = scene.anims;
    // ---- the cast (idle, blink, and two walking frames; the thieves carry sacks when they walk)
    ['alibaba', 'garong', 'kopak', 'senget', 'kecik', 'saudagar'].forEach(function (who) {
      var idle = who === 'alibaba' ? 'axe' : null, walk = who === 'alibaba' ? 'axe' : who === 'saudagar' ? null : 'sack';
      person(scene, 'npc17_' + who + '_0', who, false, 0, idle);
      person(scene, 'npc17_' + who + '_1', who, true, 0, idle);
      person(scene, 'npc17_' + who + '_w1', who, false, 1, walk);
      person(scene, 'npc17_' + who + '_w2', who, false, 2, walk);
      var k = 'npc17_' + who;
      if (!a.exists(k + '_walk')) a.create({ key: k + '_walk', frames: [{ key: k + '_w1' }, { key: k + '_w2' }], frameRate: 7, repeat: -1 });
      if (!a.exists(k + '_idle')) a.create({ key: k + '_idle', frames: [{ key: k + '_0', duration: 2400 }, { key: k + '_1', duration: 160 }], repeat: -1 });
    });
    // ---- Panglima Garong, the boss, with his wooden pole
    person(scene, 'garong17_0', 'garong', false, 0, 'pole');
    person(scene, 'garong17_w1', 'garong', false, 1, 'pole');
    person(scene, 'garong17_w2', 'garong', false, 2, 'pole');
    if (!a.exists('garong17_walk')) a.create({ key: 'garong17_walk', frames: [{ key: 'garong17_w1' }, { key: 'garong17_w2' }], frameRate: 7, repeat: -1 });
    // ---- the thieves under Pak Mat's net
    ['kopak', 'senget', 'kecik'].forEach(function (who) {
      make('jaring17_' + who, 16, 20, function (p) {
        Art.drawVillager(p, CAST[who], true, 0); extras(p, who);
        for (var i = -20; i < 20; i += 7) { p.line(i, 0, i + 20, 20, '#efe4bc'); p.line(i + 20, 0, i, 20, '#efe4bc'); }
        p.rect(0, 18, 16, 2, '#a89a6a');
      });
    });

    // ---- Ali Baba's bicycle, with a bundle of firewood (24 x 16)
    make('basikal17', 24, 16, function (p) {
      [[5, 11], [19, 11]].forEach(function (c) { p.disc(c[0], c[1], 4.4, '#2a2a2a'); p.disc(c[0], c[1], 3.2, '#8a8a8a'); p.disc(c[0], c[1], 2.4, '#3a3a3a'); p.px(c[0], c[1], '#c8c8c8'); });
      p.line(5, 11, 11, 6, '#b83a2a', 1); p.line(11, 6, 19, 11, '#b83a2a', 1); p.line(11, 6, 12, 11, '#b83a2a', 1); p.line(5, 11, 12, 11, '#b83a2a', 1);
      p.line(17, 4, 19, 11, '#8a8a8a'); p.rect(15, 3, 4, 1, '#3a3a3a'); p.rect(9, 5, 4, 1, '#3a2a1a');
      p.rect(2, 3, 9, 3, '#8a5a30'); p.rect(2, 3, 9, 1, '#a87a44'); p.line(3, 6, 4, 2, '#6a4420'); p.line(9, 6, 8, 2, '#6a4420');   // firewood
    });
    // ---- a jar of "honey" (16 x 20): brown glaze, a cloth lid tied with string, a sticky drip
    make('tempayan17', 16, 20, function (p) {
      p.ell(8, 12, 7, 7, '#7a4a22'); p.ell(7, 11, 5, 5.4, '#9a5e2c'); p.px(5, 9, '#c88a4a'); p.px(6, 8, '#c88a4a');
      p.rect(4, 3, 8, 3, '#e8dcc0'); p.rect(3, 5, 10, 1, '#c8b890'); p.px(12, 6, '#c8b890'); p.px(4, 6, '#c8b890');
      p.rect(4, 5, 8, 1, '#8a3a2a');
      p.rect(10, 6, 2, 3, '#f0b030'); p.px(10, 9, '#f0b030'); p.px(11, 10, '#e0a020');
      p.rect(3, 18, 10, 1, '#4a2a12');
    });
    // ---- the honey cart (32 x 20)
    make('kereta17', 32, 20, function (p) {
      p.rect(2, 7, 28, 7, '#8a5a30'); p.rect(2, 7, 28, 1, '#b07a44'); p.rect(2, 13, 28, 1, '#5a3a1e');
      p.disc(8, 15, 4.4, '#4a3020'); p.disc(8, 15, 2.6, '#8a6a40'); p.disc(24, 15, 4.4, '#4a3020'); p.disc(24, 15, 2.6, '#8a6a40');
      [[8, 6], [16, 5], [24, 6]].forEach(function (j) { p.ell(j[0], j[1], 3.4, 3.4, '#a85a32'); p.rect(j[0] - 2, j[1] - 4, 4, 1, '#7a3a20'); });
      p.rect(10, 9, 12, 3, '#e9c46a'); p.px(12, 10, '#6a4420'); p.px(15, 10, '#6a4420'); p.px(19, 10, '#6a4420');
      p.line(30, 9, 31, 4, '#6a4420');
    });
    // ---- the trail sign to Bukit Kapur (32 x 24)
    make('kapur_gate17', 32, 24, function (p) {
      p.ell(7, 21, 7, 3, '#a8a49e'); p.ell(25, 21, 6, 3, '#9a968e'); p.ell(7, 20, 5, 2, '#c8c4bc');
      p.rect(15, 6, 3, 18, '#6a4428'); p.rect(15, 6, 1, 18, '#8a5a32');
      p.poly([[6, 5], [24, 5], [28, 8], [24, 11], [6, 11]], '#a87a44'); p.rect(6, 5, 18, 1, '#c89a5a');
      p.rect(9, 7, 11, 1, '#5a3a1e'); p.rect(9, 9, 7, 1, '#5a3a1e');
      p.px(4, 18, '#5a9a48'); p.px(27, 18, '#5a9a48'); p.px(28, 19, '#3f7a32');
    });
    // ---- a limestone pillar (32 x 44)
    make('kapur17', 32, 44, function (p) {
      p.poly([[3, 43], [5, 22], [9, 8], [15, 1], [21, 6], [26, 18], [29, 43]], '#8d8a86');
      p.poly([[8, 42], [9, 22], [13, 9], [16, 4], [18, 12], [16, 42]], '#aaa6a0');
      for (var x = 6; x < 28; x += 4) p.line(x, 20 + (x % 3), x + 1, 42, '#76726c');
      p.speck(4, 6, 24, 36, '#5a9a48', 10); p.speck(4, 10, 24, 30, '#3f7a32', 8);
      p.rect(2, 42, 28, 2, '#6a6660');
    });
    // ---- the big bush you hide in (32 x 20)
    make('semak17', 32, 20, function (p) {
      [[7, 13, 7], [16, 10, 9], [25, 13, 7], [12, 15, 6], [21, 15, 6]].forEach(function (b) { p.disc(b[0], b[1] + 1, b[2], '#1f4a1e'); });
      [[7, 13, 7], [16, 10, 9], [25, 13, 7], [12, 15, 6], [21, 15, 6]].forEach(function (b) { p.disc(b[0], b[1], b[2] - 1, '#33702e'); });
      p.speck(2, 2, 28, 16, '#5a9a48', 18); p.speck(2, 4, 28, 14, '#183a18', 10);
      p.px(10, 6, '#e83a4a'); p.px(22, 8, '#e83a4a');
    });
    // ---- Ali Baba's woodpile (16 x 16)
    make('kayu17', 16, 16, function (p) {
      [[4, 12], [11, 12], [7, 8]].forEach(function (l) { p.disc(l[0], l[1], 3.4, '#8a5a30'); p.disc(l[0], l[1], 2.2, '#c89a5a'); p.px(l[0], l[1], '#8a5a30'); });
      p.line(1, 15, 15, 15, '#5a3a1e');
    });

    // ---- the cliff door at Bukit Kapur (48 x 56): shut, and open
    function slab(p) {
      p.poly([[3, 55], [1, 22], [9, 7], [24, 2], [39, 7], [47, 22], [45, 55]], '#7e7b77');
      p.poly([[7, 54], [6, 24], [12, 11], [24, 6], [30, 9], [20, 54]], '#96928c');
      p.speck(4, 6, 40, 46, '#6a6762', 26); p.speck(4, 6, 40, 30, '#5a9a48', 8);
      p.line(2, 30, 10, 28, '#5e5b57'); p.line(38, 34, 46, 32, '#5e5b57');
    }
    make('pintu17_tutup', 48, 56, function (p) {
      slab(p);
      p.line(14, 55, 14, 26, '#3e3c38'); p.line(14, 26, 18, 19, '#3e3c38'); p.line(18, 19, 24, 17, '#3e3c38'); p.line(24, 17, 30, 19, '#3e3c38');
      p.line(30, 19, 34, 26, '#3e3c38'); p.line(34, 26, 34, 55, '#3e3c38');
      p.px(23, 30, '#3e3c38'); p.px(25, 30, '#3e3c38'); p.line(22, 34, 26, 34, '#3e3c38');   // faint scratches: a face, or just rock?
    });
    make('pintu17_buka', 48, 56, function (p) {
      slab(p);
      p.poly([[14, 55], [14, 26], [18, 19], [24, 17], [30, 19], [34, 26], [34, 55]], '#141018');
      p.poly([[16, 55], [16, 30], [24, 24], [32, 30], [32, 55]], '#0c0a10');
      p.rect(18, 50, 12, 2, '#2a2430'); p.rect(19, 46, 10, 2, '#221c28');
    });
    // ---- Tok Batu, inside the door (32 x 26): awake, and blinking (or napping)
    [0, 1].forEach(function (f) {
      make('batu17_' + f, 32, 26, function (p) {
        p.poly([[1, 25], [0, 8], [6, 1], [26, 1], [32, 8], [31, 25]], '#6e6a66');
        p.poly([[4, 24], [3, 9], [8, 4], [18, 4], [14, 24]], '#86827c');
        p.speck(2, 2, 28, 22, '#5a5752', 16);
        p.line(7, 8, 13, 10, '#2a2826', 2); p.line(25, 8, 19, 10, '#2a2826', 2);   // grumpy brows
        if (f) { p.rect(8, 12, 5, 1, '#2a2826'); p.rect(19, 12, 5, 1, '#2a2826'); }
        else { p.rect(8, 11, 5, 3, '#f0ece0'); p.rect(19, 11, 5, 3, '#f0ece0'); p.rect(10, 12, 2, 2, '#1a1816'); p.rect(20, 12, 2, 2, '#1a1816'); }
        p.line(11, 19, 21, 19, '#2a2826'); p.px(10, 20, '#2a2826'); p.px(22, 20, '#2a2826');   // a frown
        p.px(15, 15, '#5a5752'); p.px(16, 16, '#5a5752');
      });
    });
    // ---- the crack beside the door (16 x 16)
    make('celah17', 16, 16, function (p) {
      p.rect(1, 2, 14, 14, '#3a3440'); p.rect(1, 2, 14, 1, '#4a4450');
      p.line(8, 3, 6, 7, '#fff2c0'); p.line(6, 7, 9, 10, '#fff2c0'); p.line(9, 10, 7, 15, '#fff2c0');
      p.px(7, 6, '#ffffff'); p.px(8, 11, '#ffffff');
    }, false);
    // ---- the chalk wall (48 x 24)
    make('tulis17', 48, 24, function (p) {
      p.rect(0, 0, 48, 24, '#2e2836'); p.rect(0, 22, 48, 2, '#241e2a');
      p.rect(4, 3, 16, 1, '#e8e8e0'); p.rect(4, 7, 26, 1, '#d8d8d0'); p.rect(4, 11, 10, 1, '#d8d8d0');
      p.rect(17, 10, 2, 3, '#f0f0e8'); p.rect(20, 10, 3, 3, '#f0f0e8'); p.px(21, 11, '#2e2836');   // "40"
      p.rect(4, 15, 12, 1, '#d8d8d0'); p.rect(19, 15, 12, 1, '#d8d8d0'); p.px(17, 15, '#f0f0e8');
      p.line(36, 4, 44, 12, '#c8c8c0'); p.line(44, 4, 36, 12, '#c8c8c0');   // a crossed-out sum
      p.px(40, 18, '#e8e8e0'); p.px(41, 17, '#e8e8e0'); p.px(42, 18, '#e8e8e0');
    }, false);
    // ---- the stolen pile (48 x 32)
    make('harta17', 48, 32, function (p) {
      p.ell(24, 28, 22, 3.4, '#1a1620');
      [[8, 22, 6, 7], [18, 20, 6, 8], [30, 23, 6, 6]].forEach(function (s) { p.ell(s[0], s[1], s[2], s[3], '#d8c090'); p.ell(s[0] - 1, s[1] - 2, s[2] - 2, s[3] - 3, '#e8d4a4'); p.px(s[0], s[1] - s[3], '#a88a50'); });
      p.ell(38, 24, 8, 2.6, '#a8782a'); p.ell(38, 23, 7, 2, '#e0b04a'); p.ell(36, 17, 6, 2, '#c89a3a'); p.ell(36, 16, 5, 1.6, '#f0c860');   // the brass dulang
      p.rect(24, 10, 6, 3, '#8a8a92'); p.line(27, 13, 27, 20, '#7a4b28', 2);   // Tukang Leong's hammer
      p.disc(14, 11, 3, '#c8a040'); p.rect(13, 13, 3, 1, '#8a6a28'); p.px(14, 7, '#6a4a20');   // the buffalo bell
      p.ell(43, 13, 3, 3.6, '#b84a2a'); p.rect(41, 9, 4, 1, '#7a2a1a');   // a jar of sambal
    });
    // ---- the shopping list, pinned to a sack (12 x 14)
    make('senarai17', 12, 14, function (p) {
      p.ell(6, 9, 5.5, 4.6, '#d8c090'); p.px(6, 4, '#a88a50');
      p.rect(3, 5, 6, 6, '#f4f0e4'); p.rect(4, 6, 4, 1, '#6a5a4a'); p.rect(4, 8, 3, 1, '#6a5a4a'); p.disc(6, 9.5, 1.4, '#c8323a'); p.px(6, 9, '#f4f0e4');
    });
    // ---- the thieves' stove (32 x 20)
    make('dapur17', 32, 20, function (p) {
      [[8, 15], [16, 17], [24, 15]].forEach(function (s) { p.ell(s[0], s[1], 4, 3, '#6a6660'); p.ell(s[0], s[1] - 1, 3, 2, '#8a8680'); });
      p.ell(16, 11, 8, 3, '#3a3a42'); p.rect(8, 6, 16, 5, '#4a4a52'); p.rect(8, 6, 16, 1, '#7a7a82'); p.ell(16, 6, 7, 1.6, '#f0ece0');
      p.px(14, 5, '#ffffff'); p.px(18, 6, '#ffffff');
    });
    // ---- Kopak's diary (14 x 10)
    make('diari17', 14, 10, function (p) {
      p.rect(1, 2, 12, 7, '#6a3a2a'); p.rect(2, 3, 10, 5, '#f0e4c8'); p.rect(7, 2, 1, 7, '#4a2a1a');
      p.rect(3, 4, 3, 1, '#7a6a5a'); p.rect(3, 6, 3, 1, '#7a6a5a'); p.rect(9, 4, 2, 1, '#7a6a5a'); p.rect(9, 6, 2, 1, '#7a6a5a');
    });
    // ---- the Roda Rahsia: on the cave floor, and as an icon (16 x 16)
    function wheel(p) {
      p.disc(8, 8, 7, '#6a4428'); p.disc(8, 8, 6, '#d8b46a'); p.disc(8, 8, 4, '#8a5a30'); p.disc(8, 8, 3, '#e8c87a'); p.disc(8, 8, 1, '#6a4428');
      [[8, 2], [14, 8], [8, 14], [2, 8], [12, 4], [12, 12], [4, 12], [4, 4]].forEach(function (t) { p.px(t[0], t[1], '#5a3a1e'); });
      p.px(8, 5, '#c8323a');
    }
    make('roda17', 16, 16, wheel);
    make('i_roda_rahsia', 16, 16, wheel);
    // ---- icons
    make('i_kapak_alibaba', 16, 16, function (p) {
      p.line(3, 14, 11, 4, '#8a5a30', 2); p.poly([[9, 1], [14, 2], [15, 7], [12, 7], [10, 4]], '#a8a8b0'); p.line(14, 2, 15, 7, '#e0e0e8');
      p.px(4, 13, '#c8323a');
    });
    make('i_bijan', 16, 16, function (p) {
      p.ell(8, 12, 6, 3, '#c8a060'); p.ell(8, 11, 5, 2.2, '#e0c080');
      [[5, 9], [7, 8], [9, 9], [11, 8], [6, 10], [10, 10], [8, 7]].forEach(function (s) { p.px(s[0], s[1], '#f8ecc8'); });
      p.ell(8, 6, 2, 3, '#4a8a3a'); p.line(8, 9, 8, 3, '#2a6a24');
    });
    make('i_kuih_bijan', 16, 16, function (p) {
      [[5, 10], [11, 10], [8, 6]].forEach(function (c) {
        p.disc(c[0], c[1], 3.6, '#a8702a'); p.disc(c[0], c[1], 2.8, '#d8a050');
        p.px(c[0] - 1, c[1] - 1, '#fff4d8'); p.px(c[0] + 1, c[1], '#fff4d8'); p.px(c[0], c[1] + 1, '#fff4d8');
      });
    });
  };
})(window.LC);
