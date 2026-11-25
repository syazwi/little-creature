/* Pixel art for Chapter 19, Harum Sundal Malam (v3.20): Maya (white baju kurung, hair to her knees, a sundal malam
 * flower behind her ear) and her sad face, the pontianak (white, long black hair, red eyes, no feet) and her face for
 * the jump scare, Tuan Hashim, Puan Rokiah, Mak Inah and Khalid; the old kemboja tree, graves, the sundal malam bush and
 * its crop, the two gates, the big house, its steps, pond and the cut stump; inside: the cradle (empty and with the
 * baby), the window, the scratched portrait, the desk of letters, a cabinet, a settee, toys and the brass lamps; in the
 * kampung: the laundry on the grass and the shaking banana trees; the icons and the Hilai Maya skill icon. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art;
  var CAST = {
    maya: { skin: '#c08a5a', shirt: '#f6f2ec', shirt2: '#dcd6cc', bottom: '#f0ece4', bottom2: '#d6d0c4', hair: '#141010' },
    hashim: { skin: '#a8703e', shirt: '#5a2a6a', shirt2: '#42204e', bottom: '#c4922f', bottom2: '#9a6e1e', hair: '#2a1a10', hat: 'songkok' },
    rokiah: { skin: '#b5784e', shirt: '#c8323a', shirt2: '#a01e28', bottom: '#e9c46a', bottom2: '#c4922f', hair: '#1a1210', hat: 'bun' },
    inah: { skin: '#8a5a36', shirt: '#8a7a6a', shirt2: '#6a5a4a', bottom: '#4a3a2e', bottom2: '#3a2e24', hair: '#a8a8a8', hat: 'tudung', hatColor: '#6a5a4a' },
    khalid: { skin: '#a8703e', shirt: '#3a6a9a', shirt2: '#2a4e7a', bottom: '#2a2a32', bottom2: '#1e1e26', hair: '#1a1210' }
  };
  function extras(p, who, sad) {
    if (who === 'maya') {   // hair to her knees, and a white flower behind her ear
      p.rect(5, 1, 6, 3, '#141010'); p.px(4, 2, '#141010'); p.px(11, 2, '#141010');               // the crown, parted in the middle
      p.rect(4, 3, 1, 8, '#141010'); p.rect(11, 3, 1, 8, '#141010');                             // beside her face...
      p.rect(3, 6, 1, 10, '#141010'); p.rect(12, 6, 1, 10, '#141010'); p.px(4, 11, '#141010'); p.px(11, 12, '#141010');   // ...and down to her knees
      p.px(8, 1, '#4a3a3a'); p.line(4, 4, 4, 9, '#3a2e2e'); p.line(12, 8, 12, 14, '#3a2e2e');     // a sheen on the hair
      p.px(5, 3, '#141010'); p.px(10, 3, '#141010');
      p.px(12, 3, '#ffffff'); p.px(13, 2, '#ffffff'); p.px(13, 3, '#f0ead8'); p.px(12, 2, '#fffbe8');
      if (sad) { p.rect(6, 5, 2, 1, '#2a1a10'); p.rect(9, 5, 2, 1, '#2a1a10'); p.px(6, 6, '#9ad8ff'); p.px(9, 7, '#9ad8ff'); }
    }
    if (who === 'hashim') { p.rect(6, 7, 4, 1, '#2a1a10'); p.px(12, 13, '#e9c46a'); p.rect(4, 13, 8, 1, '#e9c46a'); }   // a moustache, a gold sampin and a ring
    if (who === 'rokiah') { p.px(6, 9, '#e9c46a'); p.px(7, 10, '#e9c46a'); p.px(8, 10, '#e9c46a'); p.px(9, 9, '#e9c46a'); p.px(4, 4, '#e9c46a'); p.px(11, 4, '#e9c46a'); }   // gold necklace and earrings
    if (who === 'khalid') { p.px(4, 9, '#e8e0d0'); p.rect(12, 11, 3, 4, '#8a6a4a'); p.rect(12, 11, 3, 1, '#a88a6a'); }   // a sea bag
  }
  function person(scene, key, who, blink, step, prop, sad) {
    Art.make(scene, key, 16, 20, function (p) {
      Art.drawVillager(p, CAST[who], blink, step);
      extras(p, who, sad);
      if (prop === 'broom') { p.line(13, 6, 14, 18, '#8a6a3a'); p.poly([[12, 17], [16, 17], [15, 20], [12, 20]], '#c8a860'); }
    });
  }

  Art.generate32 = function (scene) {
    var make = function (key, w, h, draw, outline) { Art.make(scene, key, w, h, draw, outline === undefined ? true : outline); };
    var a = scene.anims;
    // ---- the cast
    ['maya', 'hashim', 'rokiah', 'inah', 'khalid'].forEach(function (who) {
      var k = 'npc19_' + who, prop = who === 'inah' ? 'broom' : null;
      person(scene, k + '_0', who, false, 0, prop); person(scene, k + '_1', who, true, 0, prop);
      person(scene, k + '_w1', who, false, 1, null); person(scene, k + '_w2', who, false, 2, null);
      if (!a.exists(k + '_walk')) a.create({ key: k + '_walk', frames: [{ key: k + '_w1' }, { key: k + '_w2' }], frameRate: 7, repeat: -1 });
      if (!a.exists(k + '_idle')) a.create({ key: k + '_idle', frames: [{ key: k + '_0', duration: 2400 }, { key: k + '_1', duration: 160 }], repeat: -1 });
    });
    person(scene, 'npc19_maya_sad', 'maya', false, 0, null, true);

    // ---- the pontianak (20 x 28): no feet, a white dress fraying into wisps, hair everywhere, red eyes
    function ponti(key, f) {
      make(key, 20, 28, function (p) {
        var sw = f === 1 ? 1 : f === 2 ? -1 : 0, H = '#0e0a0c', D = '#ece8e0', D2 = '#c8c2b8';
        p.poly([[5, 10], [15, 10], [17 + sw, 24], [14, 27], [12 + sw, 24], [10, 27], [8 - sw, 24], [6, 27], [3 + sw, 24]], D);   // the dress
        p.poly([[11, 10], [15, 10], [17 + sw, 24], [14, 27], [12 + sw, 24]], D2);
        p.line(7, 14, 6, 22, D2); p.line(12, 13, 13, 22, '#b8b2a8');
        p.rect(3, 12, 2, 5, D); p.rect(15, 12, 2, 5, D2);                       // arms
        p.px(2, 17, '#e8e4dc'); p.px(3, 18, '#d8d4cc'); p.px(17, 17, '#e8e4dc'); p.px(16, 18, '#d8d4cc');   // long pale fingers
        p.rect(7, 3, 6, 6, '#e8e4dc'); p.rect(7, 7, 6, 1, '#d4d0c8');          // the face
        p.px(8, 5, '#ff2a3a'); p.px(11, 5, '#ff2a3a'); p.px(8, 4, '#ffb0b8'); p.px(11, 4, '#ffb0b8');
        p.rect(9, 7, 2, 1, '#3a1a20');
        p.rect(6, 1, 8, 3, H); p.rect(5, 2, 2, 20, H); p.rect(13, 2, 2, 20, H);   // hair, down past her waist
        p.rect(7, 3, 2, 2, H); p.px(12, 3, H); p.line(4, 6, 3 - sw, 22, H); p.line(15, 6, 16 - sw, 22, H);
        p.line(9, 3, 9, 6, H); p.px(5, 22 + (f === 1 ? 1 : 0), H); p.px(14, 22 + (f === 2 ? 1 : 0), H);
      }, '#05030a');
    }
    ponti('pontianak19_0', 0); ponti('pontianak19_w1', 1); ponti('pontianak19_w2', 2);
    if (!a.exists('pontianak19_walk')) a.create({ key: 'pontianak19_walk', frames: [{ key: 'pontianak19_w1' }, { key: 'pontianak19_0' }, { key: 'pontianak19_w2' }, { key: 'pontianak19_0' }], frameRate: 5, repeat: -1 });
    // her face, for the jump scare (64 x 64)
    make('wajah19', 64, 64, function (p) {
      p.rect(0, 0, 64, 64, '#05030a');
      p.ell(32, 34, 17, 22, '#e4e0d8'); p.ell(32, 38, 15, 18, '#d6d2ca');
      p.ell(23, 30, 5, 3.6, '#1a0a0e'); p.ell(41, 30, 5, 3.6, '#1a0a0e');
      p.disc(23, 30, 2.2, '#ff2a3a'); p.disc(41, 30, 2.2, '#ff2a3a'); p.px(22, 29, '#ffe0e4'); p.px(40, 29, '#ffe0e4');
      p.ell(32, 47, 6, 8, '#2a0a12'); p.ell(32, 49, 4, 5, '#120408');
      for (var i = 0; i < 18; i++) {   // hair falling over the face
        var x = 8 + i * 2.8, len = 30 + (i * 37 % 26);
        p.line(x, 0, x + (i % 2 ? 2 : -2), len, '#0e0a0c', 2);
      }
      p.rect(14, 0, 36, 12, '#0e0a0c');
    }, false);

    // ---- the old kemboja tree (64 x 72), graves, the sundal malam bush
    make('kemboja19', 64, 72, function (p) {
      p.poly([[26, 71], [24, 50], [18, 38], [22, 37], [28, 46], [30, 30], [34, 30], [36, 46], [42, 36], [46, 38], [40, 50], [38, 71]], '#7a6a5a');
      p.poly([[30, 71], [30, 46], [33, 32], [34, 46], [36, 71]], '#9a8a78');
      p.line(22, 38, 12, 28, '#7a6a5a', 3); p.line(42, 36, 52, 26, '#7a6a5a', 3); p.line(32, 30, 32, 16, '#7a6a5a', 3);
      [[12, 22, 12], [52, 20, 12], [32, 12, 13], [22, 18, 10], [42, 15, 11]].forEach(function (c) { p.disc(c[0], c[1], c[2], '#3e6a32'); p.disc(c[0] - 2, c[1] - 3, c[2] - 4, '#4e8240'); });
      for (var i = 0; i < 26; i++) { var fx = 4 + (i * 23) % 56, fy = 4 + (i * 17) % 28; p.disc(fx, fy, 1.6, '#fffbf2'); p.px(fx, fy, '#f4d060'); }
      [[20, 66], [44, 68], [12, 70], [52, 69]].forEach(function (f) { p.px(f[0], f[1], '#fffbf2'); p.px(f[0] + 1, f[1], '#f4d060'); });
    });
    function nisan(key, round) {
      make(key, 16, 18, function (p) {
        p.rect(2, 14, 12, 3, '#6a5a44'); p.rect(2, 14, 12, 1, '#8a7a5e');   // the mound
        if (round) { p.rect(5, 5, 6, 10, '#b8b4a8'); p.disc(8, 5, 3, '#b8b4a8'); p.rect(6, 6, 1, 8, '#d8d4c8'); }
        else { p.rect(5, 4, 6, 11, '#a8a498'); p.rect(4, 4, 8, 2, '#c0bcb0'); p.rect(6, 6, 1, 8, '#c8c4b8'); }
        p.line(7, 8, 9, 8, '#7a766a'); p.line(7, 10, 9, 10, '#7a766a');
        p.px(3, 13, '#fffbf2'); p.px(12, 15, '#fffbf2');
      });
    }
    nisan('nisan19', false); nisan('nisan19b', true);
    make('sundal19', 16, 22, function (p) {
      for (var i = 0; i < 7; i++) { var x = 3 + i * 1.7; p.line(8, 21, x, 9 + (i % 3) * 2, i % 2 ? '#4f9a3a' : '#3a7a2c'); }
      [[3, 9], [5, 6], [8, 4], [11, 6], [13, 9], [6, 11], [10, 10], [8, 7]].forEach(function (f) { p.disc(f[0], f[1], 1.5, '#fffcf4'); p.px(f[0], f[1], '#f0e8d0'); });
      p.px(8, 3, '#ffffff'); p.px(4, 5, '#ffffff');
    });
    // the crop: four stages (16 x 16)
    for (var s = 0; s < 4; s++) (function (s) {
      make('crop_sundal_' + s, 16, 16, function (p) {
        if (s === 0) { p.ell(8, 13, 3.5, 1.6, '#6a4426'); p.px(8, 12, '#e8dcc0'); return; }
        var n = s === 1 ? 3 : 5, h = s === 1 ? 5 : s === 2 ? 9 : 11;
        for (var i = 0; i < n; i++) p.line(8, 14, 5 + i * (6 / (n - 1 || 1)), 14 - h + (i % 2), i % 2 ? '#4f9a3a' : '#6cbf4a');
        if (s >= 2) p.line(8, 14, 8, 14 - h - 1, '#4f9a3a');
        if (s === 2) { p.px(8, 14 - h - 2, '#dce8c8'); p.px(7, 14 - h, '#dce8c8'); }
        if (s === 3) [[8, 1], [6, 3], [10, 3], [8, 5], [6, 6]].forEach(function (f) { p.disc(f[0], f[1], 1.3, '#fffcf4'); p.px(f[0], f[1], '#f0e0c0'); });
      }, s ? '#1f3a1a' : false);
    })(s);

    // ---- the gates (32 x 30): the graveyard's old wooden one, the big house's white one with gold knobs
    make('pagar_kubur19', 32, 30, function (p) {
      p.rect(1, 6, 4, 24, '#6a4a2a'); p.rect(27, 6, 4, 24, '#6a4a2a'); p.rect(1, 6, 4, 1, '#8a6a3a'); p.rect(27, 6, 4, 1, '#8a6a3a');
      p.poly([[0, 7], [16, 0], [32, 7], [30, 9], [16, 3], [2, 9]], '#4a3a26');
      [8, 13, 18, 23].forEach(function (x, i) { p.rect(x, 14, 2, 15, i % 2 ? '#5a4024' : '#6a4a2a'); });
      p.rect(6, 17, 20, 2, '#5a4024'); p.rect(6, 24, 20, 2, '#5a4024');
      p.disc(16, 4, 1.4, '#fffbf2');
    });
    make('pagar19', 32, 30, function (p) {
      p.rect(0, 4, 5, 26, '#f2eee4'); p.rect(27, 4, 5, 26, '#f2eee4'); p.rect(4, 4, 1, 26, '#cfc8b8'); p.rect(31, 4, 1, 26, '#cfc8b8');
      p.disc(2.5, 3, 2.4, '#e9c46a'); p.disc(29.5, 3, 2.4, '#e9c46a'); p.px(2, 2, '#fff2cc'); p.px(29, 2, '#fff2cc');
      [7, 11, 15, 19, 23].forEach(function (x) { p.rect(x, 10, 2, 19, '#2a2a30'); p.px(x, 9, '#e9c46a'); p.px(x + 1, 9, '#c4922f'); });
      p.rect(6, 13, 20, 1, '#2a2a30'); p.rect(6, 24, 20, 1, '#2a2a30');
      p.disc(16, 19, 3, '#2a2a30'); p.disc(16, 19, 1.4, '#e9c46a');
    });

    // ---- the big house (192 x 112; footprint: the bottom 4 rows)
    make('rumah19', 192, 112, function (p) {
      p.rect(6, 96, 180, 16, '#2a2018');
      [10, 40, 70, 120, 150, 180].forEach(function (x) { p.rect(x, 92, 5, 20, '#d8d0c0'); p.rect(x, 92, 1, 20, '#f2ece0'); });
      p.rect(4, 52, 184, 42, '#f2ece0'); p.rect(4, 52, 184, 42, '#ece4d4');   // white plank walls
      for (var y = 55; y < 94; y += 5) p.rect(4, y, 184, 1, '#d6cebe');
      p.rect(2, 92, 188, 4, '#7a5232'); p.rect(2, 92, 188, 1, '#a87a4a');
      p.poly([[0, 55], [32, 26], [160, 26], [192, 55], [184, 57], [156, 32], [36, 32], [8, 57]], '#7a2e22');   // the lower roof, tiles
      p.poly([[6, 54], [36, 30], [156, 30], [186, 54]], '#a8402e');
      for (var r = 34; r < 54; r += 5) p.rect(10 + (54 - r) * 0.2, r, 172 - (54 - r) * 0.4, 1, '#8a3424');
      p.poly([[52, 30], [96, 2], [140, 30]], '#7a2e22'); p.poly([[58, 30], [96, 6], [134, 30]], '#a8402e');   // the tall gable
      p.line(96, 2, 96, 0, '#e9c46a'); p.disc(96, 1, 1.5, '#e9c46a');
      p.rect(80, 12, 32, 16, '#f2ece0'); p.poly([[82, 26], [82, 18], [96, 12], [110, 18], [110, 26]], '#3a5a7a');   // a round window in the gable
      // windows: two on the left, the door in the middle, the nursery window on the right with its curtains shut
      function win(x, y, shut) {
        p.rect(x, y, 22, 24, '#5a3a20'); p.rect(x + 2, y + 2, 18, 20, shut ? '#c8b8d8' : '#ffe8a8');
        if (shut) { p.rect(x + 2, y + 2, 9, 20, '#a890c0'); p.rect(x + 11, y + 2, 9, 20, '#b8a0d0'); p.line(x + 11, y + 2, x + 11, y + 21, '#7a6090'); }
        else { p.rect(x + 10, y + 2, 2, 20, '#5a3a20'); p.rect(x + 2, y + 11, 18, 2, '#5a3a20'); }
        p.rect(x - 2, y - 2, 26, 3, '#7a5232');
      }
      win(16, 62, false); win(48, 62, false); win(122, 62, false); win(156, 62, true);
      p.rect(84, 60, 24, 34, '#5a3a20'); p.rect(86, 62, 20, 32, '#7a4e2a'); p.rect(95, 62, 2, 32, '#5a3a20'); p.disc(92, 78, 1.2, '#e9c46a'); p.disc(100, 78, 1.2, '#e9c46a');
      p.rect(80, 56, 32, 3, '#7a5232');
      [[30, 86], [64, 86], [138, 86]].forEach(function (pt) { p.rect(pt[0] - 4, pt[1], 10, 6, '#b8502a'); p.disc(pt[0], pt[1] - 2, 3, '#e8507e'); p.disc(pt[0] + 2, pt[1] - 4, 2, '#f07aa0'); });   // pots of bougainvillea
    });
    make('tangga19', 32, 16, function (p) {
      for (var i = 0; i < 4; i++) { p.rect(2 + i * 2, i * 4, 28 - i * 4, 4, i % 2 ? '#b8ae9c' : '#d0c6b4'); p.rect(2 + i * 2, i * 4, 28 - i * 4, 1, '#ece4d4'); }
      p.rect(0, 0, 3, 16, '#e9e2d2'); p.rect(29, 0, 3, 16, '#e9e2d2'); p.px(1, 0, '#e9c46a'); p.px(30, 0, '#e9c46a');
    });
    make('tunggul19', 16, 12, function (p) { p.ell(8, 9, 5, 2.4, '#6a4426'); [5, 7, 9, 11].forEach(function (x) { p.rect(x, 6, 1, 4, '#4f9a3a'); }); p.line(8, 9, 8, 2, '#6cbf4a'); p.px(8, 1, '#9be15d'); });
    make('kolam19', 48, 30, function (p) {
      p.ell(24, 17, 23, 12, '#9a968a'); p.ell(24, 17, 20, 9.5, '#3a7aa0'); p.ell(22, 15, 14, 5, '#5a9ac0');
      [[16, 17, '#f08a2a'], [30, 19, '#f4c040'], [24, 13, '#e8642a']].forEach(function (f) { p.ell(f[0], f[1], 2.4, 1.2, f[2]); p.px(f[0] + 3, f[1], f[2]); });
      p.disc(36, 14, 2.4, '#4f9a3a'); p.px(36, 13, '#f4a0c0');
    });

    // ---- inside the house
    function cradle(key, baby) {
      make(key, 30, 28, function (p) {
        p.line(2, 27, 8, 2, '#6a4a2a', 2); p.line(28, 27, 22, 2, '#6a4a2a', 2); p.rect(6, 1, 18, 2, '#7a5232');   // the frame
        p.line(10, 3, 10, 12, '#c8b890'); p.line(20, 3, 20, 12, '#c8b890');                                     // the cords
        p.poly([[6, 12], [24, 12], [22, 20], [8, 20]], '#e8dcc0'); p.poly([[6, 12], [24, 12], [23, 14], [7, 14]], '#d4c4a0');   // the cloth cradle
        p.line(8, 16, 22, 16, '#c8a870'); p.px(15, 18, '#c8323a');
        if (baby) { p.disc(15, 12, 3.2, '#c08a5a'); p.rect(13, 10, 5, 2, '#2a1a10'); p.px(14, 12, '#2a1a10'); p.px(16, 12, '#2a1a10'); p.ell(15, 14, 4, 1.6, '#f4f0ea'); }
      });
    }
    cradle('buaian19_kosong', false); cradle('buaian19_bayi', true);
    make('tingkap19', 32, 26, function (p) {
      p.rect(0, 0, 32, 26, '#5a3a20'); p.rect(3, 3, 26, 20, '#1a2a4a'); p.disc(22, 9, 3.4, '#f4ecd0'); p.disc(23, 8, 3, '#1a2a4a');   // the night sky and a thin moon
      p.rect(15, 3, 2, 20, '#5a3a20'); p.rect(3, 12, 26, 2, '#5a3a20');
      p.rect(1, 1, 9, 24, '#a890c0'); p.rect(22, 1, 9, 24, '#b8a0d0'); p.line(9, 1, 9, 24, '#7a6090'); p.line(22, 1, 22, 24, '#7a6090');
      [[6, 22], [11, 21], [20, 22], [25, 21]].forEach(function (f) { p.disc(f[0], f[1], 1.3, '#fffcf4'); });   // sundal malam peeking in at the sill
    });
    make('potret19', 30, 26, function (p) {
      p.rect(0, 0, 30, 24, '#c4922f'); p.rect(1, 1, 28, 22, '#9a6e1e'); p.rect(3, 3, 24, 18, '#e8dcc0');
      [[6, '#42204e', '#5a2a6a', true], [11, '#a01e28', '#c8323a', false], [17, '#2a4e7a', '#3a6a9a', false], [22, '#dcd6cc', '#f6f2ec', false]].forEach(function (f, i) {
        p.rect(f[0] - 2, 12, 5, 9, f[2]); p.disc(f[0], 9, 2.2, '#b07a52'); p.px(f[0] - 1, 8, '#2a1a10'); p.px(f[0] + 1, 8, '#2a1a10');
        if (i === 3) { p.rect(f[0] - 3, 6, 7, 11, '#141010'); p.disc(f[0], 9, 2.4, '#e8dcc0'); p.line(f[0] - 3, 7, f[0] + 3, 11, '#7a6a5a'); p.line(f[0] + 3, 7, f[0] - 3, 12, '#7a6a5a'); p.line(f[0] - 2, 6, f[0] + 2, 13, '#8a7a6a'); }
      });
      p.px(24, 17, '#c8a060'); p.px(25, 17, '#fffbf2');   // a comb in her hand
      p.rect(0, 24, 30, 2, '#6a4a2a');
    });
    make('meja19', 32, 22, function (p) {
      p.rect(1, 8, 30, 4, '#7a4e2a'); p.rect(1, 8, 30, 1, '#9a6a3a'); p.rect(3, 12, 3, 9, '#5a3a20'); p.rect(26, 12, 3, 9, '#5a3a20');
      p.rect(8, 4, 10, 4, '#f2ecdc'); p.rect(9, 3, 10, 4, '#e8e0cc'); p.line(9, 4, 18, 4, '#c8323a'); p.rect(20, 5, 3, 3, '#e9c46a');
      p.rect(24, 2, 2, 6, '#2a2a30'); p.px(24, 1, '#f4f0e8');
    });
    make('almari19', 32, 36, function (p) {
      p.rect(1, 2, 30, 33, '#6a3e1e'); p.rect(3, 4, 12, 28, '#7a4e2a'); p.rect(17, 4, 12, 28, '#7a4e2a'); p.rect(0, 0, 32, 3, '#5a3418');
      [[5, 8], [9, 8], [19, 8], [23, 8], [5, 18], [21, 18]].forEach(function (c) { p.disc(c[0] + 1, c[1] + 1, 2, '#f4f4f8'); p.px(c[0] + 1, c[1] + 1, '#3a6aa0'); });
      p.px(14, 18, '#e9c46a'); p.px(17, 18, '#e9c46a');
    });
    make('kerusi19', 48, 22, function (p) {
      p.rect(2, 4, 44, 8, '#6a3e1e'); p.rect(4, 2, 40, 3, '#7a4e2a'); for (var x = 8; x < 44; x += 6) p.disc(x, 7, 1.4, '#9a6a3a');
      p.rect(2, 11, 44, 5, '#7a1e3a'); p.rect(2, 11, 44, 1, '#9a2e4e'); p.rect(3, 16, 3, 5, '#5a3418'); p.rect(42, 16, 3, 5, '#5a3418');
    });
    make('mainan19', 16, 12, function (p) {
      p.ell(5, 6, 3.4, 3, '#e9a040'); p.rect(4, 5, 3, 1, '#2a1a10'); p.rect(4, 7, 3, 1, '#2a1a10'); p.px(3, 5, '#2a1a10');
      p.line(10, 10, 13, 3, '#c8a060'); p.disc(13, 3, 2, '#c8323a'); p.px(13, 2, '#ffb0b0');
    });
    make('tikar19', 32, 10, function (p) { p.rect(1, 1, 30, 8, '#c8a860'); for (var x = 3; x < 30; x += 4) p.rect(x, 1, 1, 8, '#a8884a'); p.rect(1, 4, 30, 1, '#c8323a'); });
    function lamp(key, lit) {
      make(key, 12, 24, function (p) {
        p.rect(5, 10, 2, 13, '#9a7a3a'); p.rect(3, 21, 6, 3, '#7a5a2a'); p.rect(2, 7, 8, 4, '#c4922f'); p.rect(2, 7, 8, 1, '#e9c46a');
        p.rect(3, 1, 6, 6, lit ? '#fff2c0' : '#4a5058'); p.rect(3, 1, 1, 6, lit ? '#ffe08a' : '#3a4048');
        if (lit) { p.disc(6, 4, 1.6, '#ffb040'); p.px(6, 3, '#ffffff'); }
        p.rect(4, 0, 4, 1, '#c4922f');
      });
    }
    lamp('lampu19_off', false); lamp('lampu19_on', true);

    // ---- the kampung at night: the laundry on the grass (48 x 18), and banana trees shaking (34 x 40)
    make('jemuran19', 48, 18, function (p) {
      p.rect(1, 2, 2, 16, '#6a4a2a'); p.rect(45, 2, 2, 16, '#6a4a2a'); p.line(3, 3, 45, 3, '#c8c0a8');
      [[6, '#e8a0b8'], [15, '#9ac8e8'], [24, '#f4e090'], [33, '#a8e0a0']].forEach(function (s) { p.rect(s[0], 12, 8, 4, s[1]); p.rect(s[0], 12, 8, 1, '#ffffff'); p.line(s[0] + 1, 14, s[0] + 6, 14, '#ffffff'); });
      p.px(42, 15, '#fffcf4'); p.px(43, 14, '#fffcf4');
    });
    make('pisang19', 34, 40, function (p, ctx) {
      var src = scene.textures.exists('banana') ? scene.textures.get('banana').getSourceImage() : null;
      if (src) { ctx.drawImage(src, -2, 40 - src.height, src.width, src.height); ctx.drawImage(src, 34 - src.width + 2, 40 - src.height + 2, src.width, src.height); }
      p.line(16, 8, 18, 30, '#141010'); p.line(18, 30, 17, 36, '#141010');   // a long black hair caught on a leaf
    }, false);

    // ---- icons (16 x 16) and the skill icon (12 x 12)
    make('i_sisir_maya', 16, 16, function (p) {
      p.poly([[2, 6], [14, 6], [14, 9], [2, 9]], '#a87a4a'); p.rect(2, 6, 12, 1, '#c89a6a');
      for (var x = 2; x < 14; x += 2) p.rect(x, 9, 1, 5, '#8a5e34');
      p.disc(8, 4, 2.4, '#fffcf4'); p.px(8, 4, '#f0d070'); p.px(6, 3, '#ffffff');
    });
    make('i_benih_sundal', 16, 16, function (p) {
      [[5, 10], [10, 11], [8, 7]].forEach(function (b) { p.ell(b[0], b[1], 2.6, 3, '#d8c8a0'); p.px(b[0], b[1] - 3, '#6cbf4a'); p.px(b[0] - 1, b[1], '#f0e8d0'); });
      p.rect(3, 13, 10, 2, '#8a6a3a');
    });
    make('i_bunga_sundal', 16, 16, function (p) {
      p.line(8, 15, 8, 4, '#4f9a3a'); p.px(6, 10, '#6cbf4a'); p.px(10, 8, '#6cbf4a');
      [[8, 2], [6, 4], [10, 4], [7, 6], [9, 6], [8, 8]].forEach(function (f) { p.disc(f[0], f[1], 1.5, '#fffcf4'); p.px(f[0], f[1], '#f0e0c0'); });
    });
    make('i_kuih_kiah', 16, 16, function (p) {
      p.poly([[1, 9], [15, 9], [13, 14], [3, 14]], '#4f9a3a'); p.poly([[1, 9], [15, 9], [14, 10], [2, 10]], '#6cbf4a');
      p.ell(5, 8, 2.6, 2, '#7ac860'); p.ell(10, 8, 2.6, 2, '#c8323a'); p.ell(8, 6, 3, 1.8, '#fffcf4');
    });
    make('ic_hilai', 12, 12, function (p) {
      p.rect(2, 2, 2, 9, '#141010'); p.rect(8, 2, 2, 9, '#141010'); p.rect(3, 1, 6, 2, '#141010');
      p.rect(4, 3, 4, 4, '#ece8e0'); p.px(4, 4, '#ff2a3a'); p.px(7, 4, '#ff2a3a'); p.px(5, 6, '#3a1a20'); p.px(6, 6, '#3a1a20');
      p.disc(10, 1, 1.2, '#fffcf4');
    }, false);
  };
})(window.LC);
