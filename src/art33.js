/* Pixel art for Chapter 20, Janji Buaya Putih (v3.22): Seri Putih the white crocodile (white, and dull grey while she is
 * fading; lying in the water, seen from above for the voyage, and her face for the dialogue), Sang Kancil the mousedeer,
 * Nenek's cucumber vines (and what the thief left), the sticky scarecrow, the straw pile, the reeds, the jong seen from
 * above, the shadow hands and shadow fish of the night sea, the walkway lamps, Pak Lajak's raft, charred planks and the
 * marked planks to cut, the bucket, the neighbours of Kampong Ayer and little Awang Kecil, and the icons. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art;

  Art.generate33 = function (scene) {
    var make = function (key, w, h, draw, outline) { Art.make(scene, key, w, h, draw, outline === undefined ? true : outline); };
    var a = scene.anims;

    // ---- Seri Putih, lying in the water (64 x 22): body, ridged back, head to the right, tail to the left
    function croc(key, grey, f) {
      make(key, 64, 22, function (p) {
        var B = grey ? '#a8a4a0' : '#f4f2ec', B2 = grey ? '#8a8682' : '#d8d6ce', R = grey ? '#7a7672' : '#c4c0b4', BL = grey ? '#6a6660' : '#b0aca0';
        var sw = f ? 2 : -1;
        // the water line under her
        p.rect(0, 18, 64, 2, 'rgba(160,210,240,0.35)'); p.rect(4, 20, 56, 1, 'rgba(160,210,240,0.2)');
        // tail (sways)
        p.poly([[0, 13 + sw], [6, 11 + sw], [16, 10], [18, 15], [8, 16 + sw], [1, 15 + sw]], B2);
        p.poly([[2, 13 + sw], [8, 12 + sw], [16, 11], [16, 13], [6, 14 + sw]], B);
        // body
        p.ell(30, 13, 15, 5.2, B2); p.ell(30, 12, 14, 4.4, B);
        // legs, half under the water
        p.rect(20, 16, 4, 3, B2); p.rect(37, 16, 4, 3, B2); p.px(20, 18, BL); p.px(40, 18, BL);
        // the ridged back (scutes)
        for (var i = 0; i < 11; i++) { var x = 8 + i * 3.6; p.px(x, 9 + (i > 2 && i < 9 ? 0 : 1), R); p.px(x + 1, 9 + (i > 2 && i < 9 ? 0 : 1), R); }
        for (var j = 0; j < 7; j++) p.px(20 + j * 3, 11, BL);
        // neck and head
        p.poly([[42, 10], [50, 10], [52, 15], [42, 16]], B2);
        p.poly([[48, 10], [62, 12], [63, 15], [48, 16]], B);   // the long snout
        p.line(50, 14, 62, 14, BL);                            // the mouth line
        for (var t = 0; t < 4; t++) p.px(52 + t * 3, 15, '#fffef8');   // teeth peeking
        p.px(61, 12, BL); p.px(62, 12, BL);                     // nostrils
        p.rect(47, 8, 3, 3, B); p.px(48, 9, '#e8b830'); p.px(48, 8, '#fff2b0');   // the golden eye on its bump
        if (!grey) { p.px(26, 10, '#ffffff'); p.px(33, 10, '#ffffff'); p.px(55, 12, '#ffffff'); }
      }, grey ? '#3a3834' : '#5a5a58');
    }
    croc('buaya20_0', false, 0); croc('buaya20_1', false, 1); croc('buaya20g_0', true, 0); croc('buaya20g_1', true, 1);
    if (!a.exists('buaya20_idle')) a.create({ key: 'buaya20_idle', frames: [{ key: 'buaya20_0', duration: 900 }, { key: 'buaya20_1', duration: 900 }], repeat: -1 });
    if (!a.exists('buaya20g_idle')) a.create({ key: 'buaya20g_idle', frames: [{ key: 'buaya20g_0', duration: 1100 }, { key: 'buaya20g_1', duration: 1100 }], repeat: -1 });
    // seen from above, swimming (44 x 16), facing right
    function cTop(key, grey, f) {
      make(key, 44, 16, function (p) {
        var B = grey ? '#a8a4a0' : '#f4f2ec', B2 = grey ? '#8a8682' : '#d8d6ce', R = grey ? '#7a7672' : '#c4c0b4';
        var sw = f ? 2 : -2;
        p.poly([[0, 8 + sw], [6, 6 + sw * 0.5], [14, 6], [14, 10], [6, 10 + sw * 0.5]], B2);
        p.ell(21, 8, 9, 4, B2); p.ell(21, 8, 8, 3, B);
        p.poly([[28, 6], [42, 7], [43, 9], [28, 10]], B);
        [[15, 3], [26, 3], [15, 13], [26, 13]].forEach(function (l, i) { p.line(l[0], 8 + (l[1] < 8 ? -3 : 3), l[0] + (i % 2 ? 3 : -3) + sw * (i < 2 ? 0.5 : -0.5), l[1], B2); });
        for (var i = 0; i < 6; i++) p.px(13 + i * 2.6, 8, R);
        p.px(30, 6, '#e8b830'); p.px(30, 10, '#e8b830');
      }, grey ? '#3a3834' : '#5a5a58');
    }
    cTop('buaya20t_0', false, 0); cTop('buaya20t_1', false, 1); cTop('buaya20gt_0', true, 0); cTop('buaya20gt_1', true, 1);
    // her face, for the dialogue (28 x 22)
    make('buaya20_face', 28, 22, function (p) {
      p.poly([[0, 8], [10, 4], [27, 10], [27, 15], [0, 18]], '#d8d6ce');
      p.poly([[2, 9], [10, 6], [26, 11], [26, 13], [2, 15]], '#f4f2ec');
      p.line(6, 14, 26, 13, '#b0aca0'); for (var t = 0; t < 5; t++) p.px(9 + t * 3, 15, '#fffef8');
      p.rect(7, 3, 5, 4, '#f4f2ec'); p.rect(8, 4, 3, 2, '#e8b830'); p.px(9, 4, '#3a2a10'); p.px(8, 4, '#fff2b0');
      p.px(24, 10, '#b0aca0'); p.px(25, 10, '#b0aca0');
      p.rect(0, 19, 28, 2, 'rgba(160,210,240,0.5)');
    }, '#5a5a58');

    // ---- Sang Kancil, the mousedeer (14 x 12), facing right
    function kancil(key, f) {
      make(key, 14, 12, function (p) {
        var C1 = '#a8743e', C2 = '#8a5a2b', W = '#f0e4cc';
        p.ell(6, 6, 4.5, 2.6, C1); p.ell(6, 7, 3.8, 1.8, W);   // body, pale belly
        p.rect(2, 4, 2, 2, C2);                                  // rump
        var l = f === 1 ? 1 : f === 2 ? -1 : 0;
        p.line(3, 8, 3 - l, 11, C2); p.line(5, 8, 5 + l, 11, C2); p.line(8, 8, 8 + l, 11, C2); p.line(10, 8, 10 - l, 11, C2);   // thin legs
        p.rect(9, 2, 3, 3, C1); p.px(12, 4, C1); p.px(13, 4, '#2a1a10');   // head and snout
        p.px(10, 1, C2); p.px(11, 0, C2);                                   // an ear
        p.px(11, 3, '#1a1210'); p.px(11, 2, '#fff2d0');                     // big dark eye
        p.line(4, 5, 8, 5, '#f0e4cc');                                      // the pale stripe
      }, '#3a2210');
    }
    kancil('kancil20_0', 0); kancil('kancil20_w1', 1); kancil('kancil20_w2', 2);
    if (!a.exists('kancil20_walk')) a.create({ key: 'kancil20_walk', frames: [{ key: 'kancil20_w1' }, { key: 'kancil20_w2' }], frameRate: 9, repeat: -1 });

    // ---- the farm: Nenek's cucumber vines (16 x 20), stripped, the sticky scarecrow, the straw, the reeds
    function vines(key, bare) {
      make(key, 16, 20, function (p) {
        p.line(3, 19, 3, 4, '#c8a860'); p.line(12, 19, 12, 4, '#c8a860'); p.line(3, 6, 12, 6, '#c8a860'); p.line(3, 12, 12, 12, '#c8a860');   // bamboo stakes
        if (!bare) {
          for (var i = 0; i < 9; i++) p.disc(2 + (i * 5) % 12, 5 + (i * 7) % 13, 2.2, i % 2 ? '#4f9a3a' : '#6cbf4a');
          [[5, 10], [10, 14], [7, 16]].forEach(function (c) { p.rect(c[0], c[1], 2, 4, '#3a7a2c'); p.px(c[0], c[1], '#7ac860'); });
        } else {
          p.line(3, 18, 5, 8, '#6a8a3a'); p.line(12, 18, 10, 9, '#6a8a3a'); p.px(6, 8, '#8aa84a'); p.px(9, 9, '#8aa84a');
          [[2, 19], [7, 18], [11, 19], [14, 17]].forEach(function (h) { p.px(h[0], h[1], '#5a3a1e'); p.px(h[0] + 1, h[1], '#5a3a1e'); });   // hoof prints
        }
        p.rect(1, 19, 14, 1, '#6a4426');
      });
    }
    vines('timun20', false); vines('timun20_kosong', true);
    make('orang_getah20', 16, 26, function (p) {
      p.line(8, 25, 8, 6, '#8a6a3a'); p.line(2, 11, 14, 11, '#8a6a3a');   // the cross
      p.poly([[4, 10], [12, 10], [13, 20], [3, 20]], '#d8b860'); p.poly([[5, 11], [11, 11], [11, 19], [5, 19]], '#c8a050');   // a straw body
      p.disc(8, 6, 3.4, '#e0c070'); p.px(7, 6, '#3a2a10'); p.px(9, 6, '#3a2a10'); p.line(7, 8, 9, 8, '#8a5a2b');   // the face
      p.poly([[3, 3], [13, 3], [11, 1], [5, 1]], '#8a5a2b');   // an old terendak
      [[5, 13], [10, 15], [7, 18], [3, 11], [13, 11]].forEach(function (g) { p.px(g[0], g[1], '#fffbe8'); });   // shining sap
    });
    make('jerami20', 20, 14, function (p) {
      p.ell(10, 9, 9.5, 5, '#c8a050'); p.ell(10, 7, 8, 4.5, '#e0c070');
      for (var i = 0; i < 12; i++) p.line(2 + i * 1.5, 12, 4 + i * 1.4, 4 + (i % 3), i % 2 ? '#d8b860' : '#b8903a');
    });
    make('rumput20', 32, 26, function (p) {
      for (var i = 0; i < 22; i++) { var x = 1 + i * 1.4, h = 14 + (i * 7) % 10; p.line(x, 25, x + (i % 3 - 1), 25 - h, i % 2 ? '#5a8a3a' : '#7aa84a'); }
      [[5, 4], [13, 2], [22, 5], [28, 3]].forEach(function (c) { p.rect(c[0], c[1], 1, 4, '#8a5a2b'); });   // bulrush heads
    });

    // ---- the jong from above (60 x 26), two frames of the sails
    function jongTop(key, f) {
      make(key, 60, 26, function (p) {
        p.poly([[2, 13], [10, 5], [50, 5], [59, 13], [50, 21], [10, 21]], '#6a4426');
        p.poly([[5, 13], [12, 7], [48, 7], [55, 13], [48, 19], [12, 19]], '#a8743e');
        for (var x = 14; x < 48; x += 4) p.line(x, 8, x, 18, '#8a5a32');
        p.rect(6, 10, 6, 6, '#7a4a28');   // the stern house
        var s = f ? 1 : 0;
        [[20, '#e8d8b0'], [32, '#e8d8b0'], [42, '#d8c8a0']].forEach(function (m) {   // the lug sails, edge-on from above
          p.poly([[m[0] - 3 + s, 1], [m[0] + 2 + s, 1], [m[0] + 3 - s, 25], [m[0] - 2 - s, 25]], m[1]);
          p.line(m[0] + s, 1, m[0] - s, 25, '#a89870');
        });
        p.disc(53, 13, 1.5, '#ffd166');   // the bow lamp
      }, '#2a1a10');
    }
    jongTop('jong20_t0', 0); jongTop('jong20_t1', 1);

    // ---- the shadows of the night sea: a reaching hand (12 x 16) and a shadow fish (16 x 8)
    function hand(key, f) {
      make(key, 12, 16, function (p) {
        var D = '#140c1e', E = '#2e2040';
        p.poly([[3, 15], [9, 15], [8, 8], [4, 8]], D);
        var o = f ? 1 : 0;
        [[2, 2 + o], [4, 0], [6, 0 + o], [8, 1], [10, 4 - o]].forEach(function (t) { p.line(6, 9, t[0], t[1], D, 2); });
        p.line(5, 14, 5, 9, E); p.px(4, 3, '#c8a8ff'); p.px(8, 2, '#c8a8ff');
      }, '#c8a8ff');
    }
    hand('bayang20_0', 0); hand('bayang20_1', 1);
    if (!a.exists('bayang20_walk')) a.create({ key: 'bayang20_walk', frames: [{ key: 'bayang20_0' }, { key: 'bayang20_1' }], frameRate: 5, repeat: -1 });
    make('ikan20', 16, 8, function (p) {
      p.poly([[0, 1], [4, 4], [0, 7]], '#140c1e'); p.ell(9, 4, 6, 3, '#140c1e'); p.ell(9, 3.5, 5, 2, '#2e2040');
      p.px(13, 3, '#ff3a5a'); p.px(12, 3, '#ffb0c0');
    }, '#c8a8ff');

    // ---- Kampong Ayer: the walkway lamps, the raft, charred planks, the planks to cut, the bucket
    function lamp(key, on) {
      make(key, 10, 26, function (p) {
        p.rect(4, 8, 2, 18, '#5a3a1e'); p.rect(2, 4, 6, 1, '#5a3a1e');
        p.rect(2, 5, 6, 6, on ? '#ffd890' : '#4a4440'); p.rect(3, 6, 4, 4, on ? '#fff2c0' : '#2e2a28');
        p.rect(2, 11, 6, 1, '#5a3a1e'); p.poly([[2, 4], [8, 4], [5, 1]], '#8a5a2b');
      });
    }
    lamp('lampu20_on', true); lamp('lampu20_off', false);
    make('rakit20', 32, 12, function (p) {
      for (var i = 0; i < 7; i++) p.rect(1 + i * 4.3, 2, 4, 8, i % 2 ? '#8a5a32' : '#a8743e');
      p.line(1, 4, 31, 4, '#c8a860'); p.line(1, 8, 31, 8, '#c8a860');
      p.ell(16, 6, 9, 2.4, '#7aa84a'); p.ell(16, 5.5, 8, 1.6, '#9ac860');   // the nipah padding
      p.rect(0, 10, 32, 2, 'rgba(160,210,240,0.45)');
    });
    make('hangus20', 16, 16, function (p) {
      for (var i = 0; i < 4; i++) { p.rect(0, i * 4, 16, 3, i % 2 ? '#2a2018' : '#3a2a1e'); p.px(3 + i * 3, i * 4 + 1, '#6a4a2a'); }
      p.px(5, 2, '#ff8a3a'); p.px(11, 9, '#ff8a3a'); p.px(8, 13, '#b05a2a');
    }, false);
    make('potong20', 16, 16, function (p) {
      p.line(2, 2, 14, 14, '#e84a3a', 2); p.line(14, 2, 2, 14, '#e84a3a', 2);
      p.rect(0, 7, 16, 2, 'rgba(255,240,200,0.35)');
    }, false);
    make('celah20', 16, 16, function (p) { p.rect(0, 0, 16, 16, 'rgba(10,20,40,0.0)'); p.px(1, 1, '#6a4a2a'); p.px(14, 14, '#6a4a2a'); }, false);
    function bucket(key, full) {
      make(key, 10, 10, function (p) {
        p.poly([[1, 2], [9, 2], [8, 9], [2, 9]], '#8a6a4a'); p.rect(1, 2, 8, 1, '#a88a6a'); p.line(1, 2, 5, 0, '#5a4a3a'); p.line(9, 2, 5, 0, '#5a4a3a');
        if (full) { p.rect(2, 3, 6, 1, '#8fd3ff'); p.px(4, 3, '#e8f8ff'); }
      });
    }
    bucket('timba20', false); bucket('timba20_penuh', true);

    // ---- the neighbours of Kampong Ayer, and little Awang Kecil
    var F = LC.C20 && LC.C20.folk;
    if (F) Object.keys(F).forEach(function (who) {
      var k = 'npc20_' + who, look = F[who].look;
      [['_0', false, 0], ['_1', true, 0], ['_w1', false, 1], ['_w2', false, 2]].forEach(function (v) {
        make(k + v[0], 16, 20, function (p) {
          Art.chibi(p, look, { blink: v[1], step: v[2], extra: function (p) {
            if (who === 'anak') { p.line(12, 16, 14, 7, '#8a6a3a'); p.poly([[13, 1], [16, 3], [15, 7], [12, 4]], '#e84a3a'); }   // his kite
          } });
        });
      });
      if (!a.exists(k + '_idle')) a.create({ key: k + '_idle', frames: [{ key: k + '_0', duration: 2200 }, { key: k + '_1', duration: 160 }], repeat: -1 });
      if (!a.exists(k + '_walk')) a.create({ key: k + '_walk', frames: [{ key: k + '_w1' }, { key: k + '_w2' }], frameRate: 7, repeat: -1 });
    });

    // ---- icons (16 x 16)
    make('i_getah20', 16, 16, function (p) {
      p.line(8, 15, 8, 3, '#8a6a3a'); p.line(3, 6, 13, 6, '#8a6a3a');
      p.poly([[5, 6], [11, 6], [12, 12], [4, 12]], '#d8b860'); p.disc(8, 3, 2.2, '#e0c070');
      p.ell(12, 13, 3, 2, '#5a4a3a'); p.ell(12, 12.5, 2.4, 1.2, '#f0e8d0');   // the pot of sap
    });
    make('i_loceng20', 16, 16, function (p) {
      p.poly([[5, 4], [11, 4], [13, 12], [3, 12]], '#e9c46a'); p.poly([[6, 5], [8, 5], [7, 11], [4, 11]], '#fff0b0');
      p.rect(2, 12, 12, 2, '#c4922f'); p.disc(8, 14, 1.4, '#8a6a2a'); p.rect(7, 1, 2, 3, '#8a6a2a');
    });
    make('ic_buaya20', 12, 12, function (p) {
      p.poly([[0, 6], [4, 4], [11, 5], [11, 7], [4, 8]], '#f4f2ec'); p.px(4, 4, '#e8b830'); p.line(5, 7, 11, 7, '#b0aca0');
    });
  };
})(window.LC);
