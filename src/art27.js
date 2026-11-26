/* Pixel art for Chapter 14, Hantu Kak Senah? (v3.13): Kak Senah (and her bedak sejuk face), Jusoh, Cikgu Bahar,
 * Amin and Tok Imam; her house on stilts, the clothesline and its "ghost", Si Tiong's cage, the outdoor kitchen, the
 * Penunggu Rumah, the lane gate, the three hiding places, a suitcase and the seri muka. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art;
  var CAST = {
    senah: { skin: '#b5784e', shirt: '#f2a65a', shirt2: '#d8843a', bottom: '#8a3a62', bottom2: '#6a2a4a', hair: '#1a1210', hat: 'tudung', hatColor: '#e0607e' },
    jusoh: { skin: '#9a5e36', shirt: '#f0ece0', shirt2: '#cfc8b8', bottom: '#3a5a8a', bottom2: '#2a4070', hair: '#1a1210', hat: 'headband' },
    bahar: { skin: '#b07a52', shirt: '#f4f4ec', shirt2: '#d8d8cc', bottom: '#4a4a52', bottom2: '#34343a', hair: '#9a9a9a', hat: 'songkok' },
    amin: { skin: '#a8703e', shirt: '#4aa0d0', shirt2: '#3080b0', bottom: '#3a3a3a', bottom2: '#262626', hair: '#1a1210', hat: 'cap' },
    imam: { skin: '#9a6440', shirt: '#f4f0e4', shirt2: '#d8d0c0', bottom: '#5a4a3a', bottom2: '#3e3226', hair: '#d0d0d0', hat: 'kopiah', beard: '#e0e0e0' }
  };
  function extras(p, who, mask) {   // (v3.25: on the Sunnyside-style face; eyes at 6 and 9, rows 11-12)
    if (who === 'bahar') { p.rect(5, 11, 6, 1, '#2a2a2a'); p.px(6, 11, '#cfe8ff'); p.px(9, 11, '#cfe8ff'); }
    if (who === 'amin') { p.px(5, 12, '#ffffff'); p.px(10, 7, '#ffffff'); p.px(9, 15, '#f0f0f0'); }   // flour
    if (mask) {   // bedak sejuk: a pale rice-powder mask, and hair escaping the tudung
      p.rect(4, 9, 8, 5, '#f3efe2'); p.rect(6, 11, 1, 2, '#2a1a10'); p.rect(9, 11, 1, 2, '#2a1a10'); p.px(7, 13, '#c06a5a'); p.px(8, 13, '#c06a5a');
      p.px(5, 9, '#ffffff'); p.px(10, 12, '#e6e0d0'); p.px(2, 4, '#1a1210'); p.px(13, 3, '#1a1210'); p.px(14, 5, '#1a1210');
    }
  }
  function props(p, prop) {
    if (prop === 'pot') { p.rect(12, 14, 4, 3, '#9aa0a8'); p.rect(12, 14, 4, 1, '#c8ccd2'); p.px(15, 13, '#5a5a62'); }
    if (prop === 'radio') { p.rect(12, 14, 4, 3, '#7a4a2a'); p.px(13, 15, '#e9c46a'); p.line(15, 13, 15, 9, '#c8c8c8'); }
    if (prop === 'beg') { p.rect(0, 14, 4, 5, '#3a6ab0'); p.rect(0, 14, 4, 1, '#5a8ad0'); p.px(1, 13, '#2a2a2a'); p.px(2, 13, '#2a2a2a'); }
  }
  function person(scene, key, who, mask, blink, step, prop) {
    Art.make(scene, key, 16, 20, function (p) {
      Art.chibi(p, CAST[who], { blink: blink, step: step, extra: function (p) { props(p, prop); } });
      extras(p, who, mask);
    });
  }
  function overlay(scene, key, base, draw) {   // an existing picture with someone hiding in it
    var src = scene.textures.exists(base) ? scene.textures.get(base).getSourceImage() : null, w = src ? src.width : 32, h = src ? src.height : 40;
    Art.make(scene, key, w, h, function (p, ctx) { if (src) ctx.drawImage(src, 0, 0); draw(p, w, h); });
  }
  function tiny(p, x, y, L, pose) {   // a little hiding person (no outline, so the picture behind keeps its own)
    var O = '#2a1a14';
    if (pose === 'climb') {
      p.rect(x - 3, y - 1, 7, 6, O); p.rect(x - 2, y, 5, 4, L.skin); p.rect(x - 2, y, 5, 1, '#c8323a');
      p.px(x - 1, y + 2, O); p.px(x + 1, y + 2, O); p.rect(x - 4, y + 5, 9, 6, O); p.rect(x - 3, y + 5, 7, 5, L.shirt);
      p.rect(x - 5, y + 6, 2, 2, L.skin); p.rect(x + 4, y + 6, 2, 2, L.skin); p.rect(x - 3, y + 10, 7, 4, L.bottom); p.px(x - 1, y + 3, '#ffffff');
    } else if (pose === 'peek') {
      p.rect(x - 4, y - 2, 9, 7, O); p.rect(x - 3, y - 2, 7, 2, '#1a1a1e'); p.rect(x - 3, y, 7, 4, L.skin);
      p.rect(x - 3, y + 1, 7, 1, '#2a2a2a'); p.px(x - 2, y + 1, '#cfe8ff'); p.px(x + 2, y + 1, '#cfe8ff');
      p.line(x + 4, y - 4, x + 6, y - 7, '#f4f0e8'); p.px(x + 6, y - 7, '#e8d8c0');   // a feather
    } else {   // legs and sandals under the leaves, and a cap peeking out
      p.rect(x - 4, y, 3, 6, L.bottom); p.rect(x + 1, y, 3, 6, L.bottom); p.rect(x - 5, y + 6, 4, 2, '#e9b949'); p.rect(x + 1, y + 6, 4, 2, '#e9b949');
      p.rect(x - 3, y - 12, 6, 2, '#c8323a'); p.px(x + 3, y - 11, '#a81e24');
    }
  }

  Art.generate27 = function (scene) {
    var make = function (key, w, h, draw, outline) { Art.make(scene, key, w, h, draw, outline === undefined ? true : outline); };
    // ---- the cast (idle, blink, and two walking frames)
    ['senah', 'jusoh', 'bahar', 'amin', 'imam'].forEach(function (who) {
      person(scene, 'npc14_' + who + '_0', who, false, false, 0);
      person(scene, 'npc14_' + who + '_1', who, false, true, 0);
      person(scene, 'npc14_' + who + '_w1', who, false, false, 1, who === 'jusoh' ? 'pot' : who === 'bahar' ? 'radio' : null);
      person(scene, 'npc14_' + who + '_w2', who, false, false, 2, who === 'jusoh' ? 'pot' : who === 'bahar' ? 'radio' : null);
    });
    person(scene, 'npc14_senah_mask_0', 'senah', true, false, 0);
    person(scene, 'npc14_senah_mask_1', 'senah', true, true, 0);
    person(scene, 'npc14_senah_mask_w1', 'senah', true, false, 1, 'beg');
    person(scene, 'npc14_senah_mask_w2', 'senah', true, false, 2, 'beg');
    var a = scene.anims;
    ['senah', 'jusoh', 'bahar', 'amin', 'imam', 'senah_mask'].forEach(function (who) {
      var k = 'npc14_' + who;
      if (!a.exists(k + '_walk')) a.create({ key: k + '_walk', frames: [{ key: k + '_w1' }, { key: k + '_w2' }], frameRate: 7, repeat: -1 });
      if (!a.exists(k + '_idle')) a.create({ key: k + '_idle', frames: [{ key: k + '_0', duration: 2400 }, { key: k + '_1', duration: 160 }], repeat: -1 });
    });

    // ---- Kak Senah's house on stilts (96 x 80; footprint: the bottom 4 rows)
    make('senah_rumah', 96, 80, function (p) {
      p.rect(8, 60, 80, 18, '#2a2018');                                         // the dark under the house
      [10, 28, 46, 64, 84].forEach(function (x) { p.rect(x, 56, 4, 22, '#5a3a22'); p.rect(x, 56, 1, 22, '#7a5232'); });
      p.rect(6, 28, 84, 30, '#b98a5a');                                         // plank walls
      for (var y = 31; y < 58; y += 4) p.rect(6, y, 84, 1, '#9a6e44');
      p.rect(4, 56, 88, 4, '#7a5232'); p.rect(4, 56, 88, 1, '#a87a4a');         // the floor beam
      p.poly([[0, 31], [48, 3], [96, 31], [88, 33], [48, 9], [8, 33]], '#5a4020');   // attap roof
      p.poly([[6, 30], [48, 6], [90, 30], [48, 14]], '#8a6a3a');
      for (var r = 0; r < 6; r++) p.line(10 + r * 6, 29 - r * 3, 86 - r * 6, 29 - r * 3, '#6e5230');
      p.line(48, 4, 48, 14, '#b08a50'); p.px(48, 2, '#d8b070');
      [[14, 36], [64, 36]].forEach(function (w) {                               // two lit windows with blue shutters
        p.rect(w[0], w[1], 16, 13, '#3a2a1a'); p.rect(w[0] + 1, w[1] + 1, 14, 11, '#ffd27a'); p.rect(w[0] + 1, w[1] + 1, 14, 3, '#ffe8b0');
        p.rect(w[0] + 7, w[1] + 1, 1, 11, '#c89a50'); p.rect(w[0] - 5, w[1], 4, 13, '#4a7ab0'); p.rect(w[0] + 17, w[1], 4, 13, '#4a7ab0');
        p.px(w[0] + 3, w[1] + 5, '#f0c070'); p.px(w[0] + 11, w[1] + 7, '#f0c070');
      });
      p.rect(40, 34, 14, 22, '#5a3820'); p.rect(41, 35, 12, 21, '#6a4428'); p.px(51, 45, '#e9c46a');   // the door
      for (var s = 0; s < 5; s++) { p.rect(42, 58 + s * 4, 10, 2, '#8a5a30'); }                         // the tangga
      p.rect(41, 58, 1, 20, '#6a4428'); p.rect(52, 58, 1, 20, '#6a4428');
      p.rect(58, 70, 6, 7, '#b85a3a'); p.disc(61, 68, 3, '#e83a4a'); p.px(60, 67, '#ff8a9a'); p.px(58, 66, '#3f8a3a');   // bunga raya in a pot
    });
    // ---- the lane gate (32 x 24)
    make('senah_gate', 32, 24, function (p) {
      p.rect(3, 4, 4, 20, '#6a4428'); p.rect(25, 4, 4, 20, '#6a4428'); p.rect(1, 3, 30, 4, '#8a5a30'); p.rect(1, 3, 30, 1, '#b07a44');
      p.line(16, 7, 16, 10, '#3a2a1a'); p.rect(13, 10, 6, 7, '#3a2a1a'); p.rect(14, 11, 4, 5, '#ffd27a'); p.px(15, 12, '#fff2c0');   // a hanging lantern
      p.rect(8, 18, 16, 6, '#c8a060'); p.rect(8, 18, 16, 1, '#e0c080');
    });
    // ---- the clothesline and its "ghost" (48 x 32, two frames)
    [0, 1].forEach(function (f) {
      make('senah_line_' + f, 48, 32, function (p) {
        p.rect(3, 6, 2, 26, '#6a4428'); p.rect(43, 6, 2, 26, '#6a4428'); p.rect(1, 6, 6, 1, '#6a4428'); p.rect(41, 6, 6, 1, '#6a4428');
        for (var x = 5; x < 43; x++) p.px(x, 7 + Math.round(Math.sin((x - 5) / 38 * Math.PI) * 2), '#d8d0c0');
        var off = f ? 2 : 0;
        p.poly([[9, 8], [29, 8], [31 + off, 22 + off], [27, 27 + off], [20, 24], [13, 27 + off], [8 - off, 22]], '#f4f4f0');
        p.poly([[11, 9], [27, 9], [28 + off, 20], [11, 20]], '#ffffff');
        [[13, 12], [20, 15], [26, 11], [16, 19], [24, 21]].forEach(function (d) { p.px(d[0], d[1], '#e88aa8'); p.px(d[0] + 1, d[1], '#9be15d'); });
        p.rect(33, 8, 6, 14, '#3a6a4a'); for (var k = 9; k < 22; k += 3) p.rect(33, k, 6, 1, '#c8a040');   // a kain pelikat
      });
    });
    make('senah_sheet', 14, 18, function (p) {   // the white shape drifting past the window
      p.poly([[7, 0], [12, 4], [13, 14], [10, 17], [7, 15], [4, 17], [1, 14], [2, 4]], '#f8f8f4');
      p.px(5, 6, '#c8c8c8'); p.px(9, 6, '#c8c8c8');
    }, false);
    // ---- Si Tiong in his cage on a stand (16 x 28, two frames)
    [0, 1].forEach(function (f) {
      make('senah_sangkar_' + f, 16, 28, function (p) {
        p.rect(7, 12, 2, 16, '#6a4428'); p.rect(4, 26, 8, 2, '#5a3a22');
        p.poly([[2, 4], [8, 0], [14, 4]], '#a87a44'); p.rect(2, 4, 12, 10, '#3a2a1a');
        for (var x = 3; x < 14; x += 2) p.rect(x, 4, 1, 10, '#c8a060');
        p.rect(2, 13, 12, 1, '#a87a44');
        var by = f ? 7 : 8;
        p.disc(8, by + 2, 2.6, '#1a1a22'); p.px(9, by + 1, '#ffffff'); p.px(10, by + 2, '#ffd23a'); p.px(11, by + 2, f ? '#ffd23a' : '#e9a020');
        p.px(9, by + 3, '#ff9a20'); p.px(6, by + 4, '#1a1a22'); p.px(5, by + 5, '#1a1a22');
      });
    });
    // ---- the outdoor kitchen (32 x 40)
    make('senah_dapur', 32, 40, function (p) {
      p.rect(3, 12, 2, 28, '#6a4428'); p.rect(27, 12, 2, 28, '#6a4428');
      p.poly([[0, 13], [16, 2], [32, 13], [28, 15], [16, 6], [4, 15]], '#5a4020'); p.poly([[3, 13], [16, 5], [29, 13], [16, 9]], '#8a6a3a');
      p.rect(7, 28, 18, 10, '#b05a3a'); p.rect(7, 28, 18, 2, '#c87050'); p.rect(11, 32, 10, 5, '#2a1a10');
      p.rect(12, 33, 8, 3, '#ff8a3a'); p.px(14, 33, '#ffe07a'); p.px(17, 34, '#ffe07a');
      p.rect(10, 22, 12, 6, '#7a7a82'); p.rect(10, 22, 12, 1, '#a8a8b0'); p.rect(9, 21, 14, 1, '#5a5a62');   // the steamer
      p.rect(24, 34, 6, 5, '#c8a060'); p.px(25, 33, '#3f8a3a'); p.px(27, 32, '#3f8a3a'); p.px(28, 33, '#5ab84a');   // pandan basket
    });
    // ---- the Penunggu Rumah (14 x 16, two frames)
    [0, 1].forEach(function (f) {
      make('senah_penunggu_' + f, 14, 16, function (p) {
        var y = f ? 1 : 0;
        p.poly([[7, 1 + y], [12, 5 + y], [12, 12 + y], [10, 15], [7, 13 + y], [4, 15], [2, 12 + y], [2, 5 + y]], '#9ab8d8');
        p.poly([[7, 2 + y], [11, 5 + y], [11, 10 + y], [3, 10 + y], [3, 5 + y]], '#c8dcf0');
        p.rect(4, 6 + y, 2, 3, '#1a2a3a'); p.rect(8, 6 + y, 2, 3, '#1a2a3a'); p.px(4, 6 + y, '#ffffff'); p.px(8, 6 + y, '#ffffff');
        p.px(6, 10 + y, '#5a7a9a'); p.px(3, 9 + y, '#f0a0b0'); p.px(10, 9 + y, '#f0a0b0');
        p.line(12, 8 + y, 13, 2 + y, '#a8784a'); p.disc(13, 2 + y, 1.2, '#c8945a');   // a wooden spoon
      });
    });
    // ---- the three hiding places
    overlay(scene, 'senah_palm_jusoh', 'palm', function (p, w, h) { tiny(p, Math.round(w / 2), Math.round(h * 0.28), CAST.jusoh, 'climb'); });
    overlay(scene, 'senah_reban_bahar', 'reban', function (p, w, h) { tiny(p, Math.round(w / 2), Math.round(h * 0.55), CAST.bahar, 'peek'); });
    overlay(scene, 'senah_pisang_amin', 'banana', function (p, w, h) { tiny(p, Math.round(w / 2), h - 9, CAST.amin, 'legs'); });
    // ---- Kak Senah's seri muka
    make('i_seri_muka', 16, 16, function (p) {
      p.poly([[1, 12], [8, 9], [15, 12], [8, 15]], '#4a8a3a');                 // a banana leaf
      p.rect(3, 6, 10, 7, '#f4f0e4'); p.px(5, 9, '#dcd6c8'); p.px(9, 11, '#dcd6c8'); p.px(11, 8, '#dcd6c8');
      p.rect(3, 3, 10, 4, '#5ab86a'); p.rect(3, 3, 10, 1, '#8ade8a'); p.px(6, 4, '#9ae89a');
    });
  };
})(window.LC);
