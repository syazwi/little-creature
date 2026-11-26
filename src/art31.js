/* Pixel art for Chapter 18, Bujang Belajar Mantera? (v3.19): Kudin (black baju silat, gold sash, a tanjak far too
 * big for him), Leman (round, orange, a grain of rice on his cheek) and Sani (thin, a scarf, a nervous drop of sweat),
 * their mirror selves (the same frames recoloured, with red eyes), the levitation feather, the dark room's trapdoor and
 * stairs, the rune stones (dark and lit), the Pintu Empat Penjuru (shut and open, a gem at each corner), the exam
 * mirror (whole and cracked), a graduation cap, confetti, the sash and the skill icon. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art;
  var CAST = {
    kudin: { skin: '#a8703e', shirt: '#26262e', shirt2: '#1a1a20', bottom: '#26262e', bottom2: '#1a1a20', hair: '#1a1210', hat: 'tanjak_gold' },
    leman: { skin: '#b07a52', shirt: '#e07a3a', shirt2: '#b85a24', bottom: '#5a4632', bottom2: '#463624', hair: '#1a1210' },
    sani: { skin: '#c08a5a', shirt: '#6a9ad0', shirt2: '#4a7ab0', bottom: '#3a3a52', bottom2: '#2a2a3e', hair: '#2a1a10' }
  };
  function extras(p, who) {   // (v3.25: drawn before the outline, on the Sunnyside-style body)
    if (who === 'kudin') {   // the gold sash, and a tanjak far too big
      p.rect(5, 17, 6, 1, '#e9c46a'); p.px(10, 18, '#c4922f');
      p.poly([[2, 8], [7, 0], [14, 0], [13, 8]], '#e9c46a'); p.line(2, 7, 13, 7, '#c4922f'); p.px(14, 0, '#c4922f'); p.px(6, 4, '#f4dc90'); p.px(7, 3, '#f4dc90');
      p.rect(6, 13, 4, 1, '#2a1a10');   // a thin moustache
    }
    if (who === 'leman') {   // a round belly, and a grain of rice on his cheek
      p.rect(4, 15, 8, 2, '#e07a3a'); p.rect(10, 15, 2, 2, '#b85a24'); p.px(8, 16, '#b85a24'); p.px(3, 16, '#e07a3a'); p.px(12, 16, '#b85a24');
      p.px(11, 12, '#fffaf0');
    }
    if (who === 'sani') {   // messy hair, a long scarf, a nervous drop of sweat
      p.px(5, 4, '#2a1a10'); p.px(9, 4, '#2a1a10'); p.px(11, 4, '#2a1a10');
      p.rect(5, 15, 6, 1, '#e8e0d0'); p.px(10, 16, '#e8e0d0'); p.px(10, 17, '#d0c8b8');
      p.px(14, 8, '#8fd3ff'); p.px(14, 9, '#5ab0e0');
    }
  }
  function person(scene, key, who, blink, step) {
    Art.make(scene, key, 16, 20, function (p) { Art.chibi(p, CAST[who], { blink: blink, step: step, extra: function (p) { extras(p, who); } }); });
  }
  // a mirror self: the same frame, every colour pushed into one shade, and red eyes
  var SHADE = {
    kudin: function (l) { return [46 + l * 150, 38 + l * 124, 70 + l * 170]; },
    leman: function (l) { return [40 + l * 120, 66 + l * 172, 32 + l * 96]; },
    sani: function (l) { return [26 + l * 96, 44 + l * 128, 86 + l * 168]; }
  };
  Art.mirrorCopy = function (scene, src, dst, shade, eyes) {
    var from = scene.textures.get(src).getSourceImage(), w = from.width, h = from.height;
    Art.make(scene, dst, w, h, function (p, ctx) {
      ctx.drawImage(from, 0, 0);
      var img = ctx.getImageData(0, 0, w, h), px = img.data;
      for (var i = 0; i < px.length; i += 4) {
        if (!px[i + 3]) continue;
        var c = shade(Math.pow((0.3 * px[i] + 0.59 * px[i + 1] + 0.11 * px[i + 2]) / 255, 1.1));
        px[i] = c[0]; px[i + 1] = c[1]; px[i + 2] = c[2];
      }
      ctx.putImageData(img, 0, 0);
      ctx.fillStyle = '#ff3b4f';
      (eyes || []).forEach(function (e) { ctx.fillRect(e[0], e[1], 1, 1); });
    });
  };

  Art.generate31 = function (scene) {
    var make = function (key, w, h, draw, outline) { Art.make(scene, key, w, h, draw, outline === undefined ? true : outline); };
    var a = scene.anims;
    // ---- the three bachelors (idle, blink, two walking frames) and their mirror selves
    ['kudin', 'leman', 'sani'].forEach(function (who) {
      var k = 'npc18_' + who, m = 'mirror18_' + who;
      person(scene, k + '_0', who, false, 0); person(scene, k + '_1', who, true, 0);
      person(scene, k + '_w1', who, false, 1); person(scene, k + '_w2', who, false, 2);
      ['_0', '_1', '_w1', '_w2'].forEach(function (f) { Art.mirrorCopy(scene, k + f, m + f, SHADE[who], f === '_1' ? [] : [[6, 11], [6, 12], [9, 11], [9, 12]]); });
      [k, m].forEach(function (b) {
        if (!a.exists(b + '_walk')) a.create({ key: b + '_walk', frames: [{ key: b + '_w1' }, { key: b + '_w2' }], frameRate: 7, repeat: -1 });
        if (!a.exists(b + '_idle')) a.create({ key: b + '_idle', frames: [{ key: b + '_0', duration: 2200 }, { key: b + '_1', duration: 160 }], repeat: -1 });
      });
    });
    // ---- Tok Penghulu's rooster, purple from beak to tail
    [0, 1, 2].forEach(function (f) {
      if (scene.textures.exists('chicken_' + f)) Art.mirrorCopy(scene, 'chicken_' + f, 'ayam18_' + f, function (l) { return [110 + l * 130, 50 + l * 100, 150 + l * 105]; }, []);
    });
    if (scene.textures.exists('ayam18_0') && !a.exists('ayam18_walk')) a.create({ key: 'ayam18_walk', frames: [{ key: 'ayam18_0' }, { key: 'ayam18_2' }], frameRate: 6, repeat: -1 });
    // ---- the levitation feather (10 x 12)
    make('bulu18', 10, 12, function (p) {
      p.line(2, 11, 7, 1, '#d8c8a0');
      p.poly([[7, 1], [9, 3], [8, 6], [5, 9], [3, 10], [4, 7], [5, 4]], '#f8f4ec');
      p.line(7, 2, 3, 10, '#c8bca8'); p.px(8, 2, '#ffffff'); p.px(6, 5, '#e8e0d0');
    });
    // ---- the dark room's trapdoor (16 x 16) and the stairs up (16 x 16)
    make('pintu_gelap18', 16, 16, function (p) {
      p.rect(1, 4, 14, 11, '#5a3a20'); p.rect(1, 4, 14, 1, '#7a5230');
      [4, 8, 12].forEach(function (x) { p.line(x, 5, x, 14, '#3e2814'); });
      p.rect(1, 8, 14, 1, '#3e2814'); p.disc(8, 11, 1.6, '#9a9aa4'); p.px(8, 11, '#2a2a30');
    });
    make('tangga18', 16, 16, function (p) {
      for (var i = 0; i < 4; i++) { p.rect(2 + i, 3 + i * 3, 12 - i * 2, 3, i % 2 ? '#6a6070' : '#7a7080'); p.rect(2 + i, 3 + i * 3, 12 - i * 2, 1, '#9a90a0'); }
      p.px(8, 1, '#fff2cc');
    });
    // ---- a rune stone, dark and lit (14 x 18)
    function rune(key, lit) {
      make(key, 14, 18, function (p) {
        p.poly([[2, 17], [1, 6], [4, 1], [10, 1], [13, 6], [12, 17]], lit ? '#8a96b8' : '#4a4658');
        p.poly([[3, 16], [3, 7], [5, 3], [9, 3], [11, 7], [11, 16]], lit ? '#a8b8d8' : '#5a5668');
        var c = lit ? '#e8fbff' : '#2e2a3a';
        p.line(5, 6, 5, 11, c); p.disc(4, 12, 1.4, c); p.line(5, 6, 9, 5, c); p.line(9, 5, 9, 10, c); p.disc(8, 11, 1.4, c);   // a carved note
        if (lit) { p.px(7, 2, '#ffffff'); p.px(2, 9, '#cfefff'); p.px(12, 9, '#cfefff'); }
      });
    }
    rune('rune18_off', false); rune('rune18_on', true);
    // ---- Pintu Empat Penjuru (48 x 44): a stone arch, a gem at each corner (gold, orange, blue and violet)
    function door(key, open) {
      make(key, 48, 44, function (p) {
        p.poly([[2, 43], [2, 14], [8, 6], [16, 2], [32, 2], [40, 6], [46, 14], [46, 43]], '#5a5468');
        p.poly([[5, 43], [5, 15], [10, 9], [17, 5], [31, 5], [38, 9], [43, 15], [43, 43]], '#8a8498');
        if (open) {
          p.poly([[9, 43], [9, 17], [13, 12], [19, 9], [29, 9], [35, 12], [39, 17], [39, 43]], '#1a1426');
          p.poly([[14, 43], [16, 22], [24, 17], [32, 22], [34, 43]], '#3a2e5a'); p.line(24, 18, 24, 42, '#c8b8ff');
        } else {
          p.poly([[9, 43], [9, 17], [13, 12], [19, 9], [29, 9], [35, 12], [39, 17], [39, 43]], '#5a3a20');
          [16, 24, 32].forEach(function (x) { p.line(x, 11, x, 42, '#3e2814'); });
          p.poly([[24, 20], [26, 26], [32, 28], [26, 30], [24, 36], [22, 30], [16, 28], [22, 26]], '#e9c46a');
        }
        [[6, 18, '#e9c46a'], [42, 18, '#e07a3a'], [6, 40, '#6a9ad0'], [42, 40, '#b48cff']].forEach(function (g) { p.disc(g[0], g[1], 2.4, g[2]); p.px(g[0] - 1, g[1] - 1, '#ffffff'); });
        p.rect(0, 42, 48, 2, '#6a6070');
      });
    }
    door('pintu18_tutup', false); door('pintu18_buka', true);
    // ---- the exam mirror (22 x 34), whole and cracked
    function mirror(key, cracked) {
      make(key, 22, 34, function (p) {
        p.poly([[2, 33], [2, 8], [6, 3], [11, 1], [16, 3], [20, 8], [20, 33]], '#7a5230');
        p.poly([[4, 31], [4, 9], [7, 5], [11, 3], [15, 5], [18, 9], [18, 31]], cracked ? '#3a4058' : '#4a5a80');
        p.line(6, 26, 10, 8, '#a8c0e8'); p.line(9, 28, 13, 12, '#7a90c0');
        if (cracked) { p.line(11, 6, 8, 16, '#e8f0ff'); p.line(8, 16, 13, 22, '#e8f0ff'); p.line(8, 16, 5, 20, '#c8d4f0'); p.line(13, 22, 16, 30, '#c8d4f0'); }
        p.rect(1, 32, 20, 2, '#5a3a20'); p.px(11, 2, '#e9c46a');
      });
    }
    mirror('cermin18', false); mirror('cermin18_pecah', true);
    // ---- a graduation cap (10 x 7), confetti, the sash and the skill icon
    make('topi18', 10, 7, function (p) { p.poly([[0, 2], [5, 0], [10, 2], [5, 4]], '#1e1e26'); p.rect(3, 3, 5, 3, '#26262e'); p.line(5, 2, 8, 2, '#e9c46a'); p.line(8, 2, 9, 5, '#e9c46a'); });
    make('confetti18', 2, 3, function (p) { p.rect(0, 0, 2, 3, '#ffffff'); }, false);
    make('i_selempang18', 16, 16, function (p) {
      p.poly([[2, 3], [5, 2], [14, 12], [11, 14]], '#26262e'); p.line(3, 3, 12, 13, '#e9c46a'); p.line(5, 3, 13, 11, '#c4922f');
      p.disc(8, 8, 2, '#e9c46a'); p.px(8, 8, '#fff2cc');
    });
    make('ic_sekawan', 12, 12, function (p) {
      [[3, 3, '#e9c46a'], [8, 3, '#e07a3a'], [3, 8, '#6a9ad0'], [8, 8, '#f4f0e8']].forEach(function (h) { p.disc(h[0], h[1], 2.2, h[2]); p.px(h[0] - 1, h[1], '#2a1a10'); p.px(h[0] + 1, h[1], '#2a1a10'); });
    }, false);
  };
})(window.LC);
