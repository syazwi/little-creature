/* Pixel art for Chapter 20, Part 2 (v3.23): the crocodiles of the Kinabatangan (lying, from above, Tok Sisik's face, a
 * head in the water), the Bajau Laut's lepa seen from above, proboscis monkeys, hornbills, pygmy elephants, mangroves,
 * Mount Kinabalu, the nest and its eggs, the bell post, Pelita's little spark, the great shadow (Pelita's own, grown
 * huge), Harimau Cahaya (the tiger of light), Anak Putih (a hatchling, half grown, and carrying you), the firefly jar,
 * and Pelita Putih (made from Pelita Purnama's pictures: a white flame with a gold rim). */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art;

  Art.generate34 = function (scene) {
    var make = function (key, w, h, draw, outline) { Art.make(scene, key, w, h, draw, outline === undefined ? true : outline); };
    var a = scene.anims;
    function anim(key, frames, rate) { if (!a.exists(key)) a.create({ key: key, frames: frames.map(function (k) { return { key: k }; }), frameRate: rate, repeat: -1 }); }

    // Sea ghosts off Sabah. Their tails and braids move with the water.
    var sirenPalettes = [
      { hair: '#28324d', ribbon: '#a6d7cf', silk: '#7aacc1', deep: '#39697f', scale: '#84b5bd', lit: '#d9f5e7' },
      { hair: '#413456', ribbon: '#ecd3b3', silk: '#b494c2', deep: '#5e577e', scale: '#a7a0cd', lit: '#f1dce9' },
      { hair: '#263955', ribbon: '#9bbde4', silk: '#6da7a6', deep: '#3a6583', scale: '#7eabc6', lit: '#d6f0f6' }
    ];
    function sirenHead(p, x, y, P) {
      p.ell(x, y + 1, 7.5, 8, P.hair);
      p.ell(x + 1, y + 2, 5.4, 5.9, '#dcceda');
      p.ell(x + 3, y + 3, 3.1, 4.2, '#f8e6e1');
      p.poly([[x - 7, y], [x - 5, y - 5], [x + 3, y - 6], [x + 6, y - 2], [x + 1, y - 2], [x - 2, y + 1], [x - 5, y + 4]], P.hair);
      p.line(x - 5, y - 3, x + 1, y - 5, P.ribbon);
      p.px(x - 2, y + 1, '#343044'); p.line(x + 2, y + 1, x + 4, y + 1, '#343044');
      p.px(x + 3, y + 4, '#a46882'); p.px(x - 5, y + 4, '#fff1cb');
      p.px(x - 3, y - 4, '#fff1cb'); p.px(x + 1, y - 5, '#e7fbf2');
    }
    function basket(p, x, y) {
      p.poly([[x, y], [x + 13, y], [x + 10, y + 6], [x + 3, y + 6]], '#9b684b');
      p.ell(x + 6.5, y, 6.5, 2.4, '#d3a47a'); p.ell(x + 6.5, y, 4.3, 1, '#634452');
      p.line(x + 2, y + 3, x + 11, y + 3, '#e4bb83');
      p.line(x + 4, y + 5, x + 9, y + 5, '#b98662');
    }
    sirenPalettes.forEach(function (P, i) {
      var frames = [0, 1, 2].map(function (f) {
        var key = 'siren20_' + i + '_' + f, sw = [0, 2, -2][f];
        make(key, 46, 56, function (p) {
          p.poly([[12, 28], [26, 28], [25, 35], [21 + sw, 41], [24 + sw, 45], [30 + sw, 45], [35 + sw, 38], [36 + sw, 44], [43 + sw, 45],
            [36 + sw, 51], [28 + sw, 51], [18 + sw, 47], [12, 39], [10, 33]], P.deep);
          p.poly([[14, 28], [23, 30], [21, 36], [18 + sw, 41], [21 + sw, 45], [29 + sw, 48], [35 + sw, 46], [37 + sw, 47], [30 + sw, 50],
            [21 + sw, 48], [15 + sw, 42], [13, 36]], P.scale);
          p.poly([[28 + sw, 46], [35 + sw, 38], [34 + sw, 45], [42 + sw, 45], [36 + sw, 49], [30 + sw, 50]], P.lit);
          p.line(14, 32, 20, 33, P.lit); p.line(13, 36, 19, 37, P.lit);
          p.line(16 + sw, 41, 20 + sw, 42, P.lit); p.px(22 + sw, 46, '#fff7e0');
          p.poly([[13, 12], [19, 13], [15, 23], [10 + sw, 29], [5 + sw, 26], [8, 23], [8, 16]], P.hair);
          p.line(11, 16, 10 + sw, 25, P.ribbon, 2);
          p.px(9 + sw, 22, '#fff1cb'); p.px(11 + sw, 25, '#e7fbf2');
          p.poly([[16, 16], [22, 15], [25, 18], [24, 25], [27, 30], [19, 33], [12, 29], [15, 23], [13, 19]], P.deep);
          p.poly([[16, 17], [19, 19], [24, 16], [24, 23], [21, 27], [24, 29], [16, 30], [15, 25]], P.silk);
          p.line(15, 24, 21, 23, P.ribbon);
          p.line(16, 18, 15, 24, '#dcceda', 3); p.line(15, 24, 24, 24, '#f8e6e1', 2);
          p.line(24, 18, 28, 22, '#f8e6e1', 3);
          if (i === 1) basket(p, 23, 24); else p.line(28, 22, 31, 19 + sw, '#dcceda', 2);
          sirenHead(p, 18, 10, P);
        }, '#223048');
        return key;
      });
      anim('siren20_' + i + '_swim', frames, 4);
    });
    make('siren20_face', 29, 29, function (p) {
      var P = sirenPalettes[1];
      p.ell(14, 23, 11, 6, P.silk); p.poly([[9, 11], [18, 10], [22, 24], [18, 26], [7, 23], [5, 19]], P.hair);
      p.line(9, 14, 7, 23, P.ribbon, 2); p.px(7, 21, '#fff1cb'); p.px(7, 24, '#fff1cb');
      sirenHead(p, 14, 12, P);
    }, '#223048');
    make('siren20_basket', 16, 12, function (p) { basket(p, 1, 4); }, '#302030');

    // ---- the crocodiles of the Kinabatangan: olive and brown (64 x 22), from above (44 x 16), Tok Sisik, a head
    function croc(key, f, P) {
      make(key, 64, 22, function (p) {
        var sw = f ? 2 : -1;
        p.rect(0, 18, 64, 2, 'rgba(160,210,240,0.35)');
        p.poly([[0, 13 + sw], [6, 11 + sw], [16, 10], [18, 15], [8, 16 + sw], [1, 15 + sw]], P.b2);
        p.ell(30, 13, 15, 5.2, P.b2); p.ell(30, 12, 14, 4.4, P.b);
        p.rect(20, 16, 4, 3, P.b2); p.rect(37, 16, 4, 3, P.b2);
        for (var i = 0; i < 11; i++) { var x = 8 + i * 3.6; p.px(x, 9 + (i > 2 && i < 9 ? 0 : 1), P.r); p.px(x + 1, 9 + (i > 2 && i < 9 ? 0 : 1), P.r); }
        p.poly([[42, 10], [50, 10], [52, 15], [42, 16]], P.b2); p.poly([[48, 10], [62, 12], [63, 15], [48, 16]], P.b);
        p.line(50, 14, 62, 14, P.r); for (var t = 0; t < 4; t++) p.px(52 + t * 3, 15, '#f4eed8');
        p.rect(47, 8, 3, 3, P.b); p.px(48, 9, P.eye); p.px(48, 8, '#fff2b0');
        if (P.old) { p.line(52, 11, 56, 13, '#d8c8a8'); p.px(25, 9, '#6a8a4a'); p.px(29, 9, '#7aa84a'); p.px(33, 10, '#6a8a4a'); }   // scars, and moss on his back
      }, '#1e2414');
    }
    var CLAN = { b: '#6a6a3a', b2: '#545430', r: '#3e3e22', eye: '#e8c830' }, SISIK = { b: '#7a6a48', b2: '#5e5236', r: '#40382a', eye: '#d8d8d0', old: true };
    croc('buayaK20_0', 0, CLAN); croc('buayaK20_1', 1, CLAN); croc('sisik20_0', 0, SISIK); croc('sisik20_1', 1, SISIK);
    function cTop(key, f, P) {
      make(key, 44, 16, function (p) {
        var sw = f ? 2 : -2;
        p.poly([[0, 8 + sw], [6, 6 + sw * 0.5], [14, 6], [14, 10], [6, 10 + sw * 0.5]], P.b2);
        p.ell(21, 8, 9, 4, P.b2); p.ell(21, 8, 8, 3, P.b);
        p.poly([[28, 6], [42, 7], [43, 9], [28, 10]], P.b);
        [[15, 3], [26, 3], [15, 13], [26, 13]].forEach(function (l, i) { p.line(l[0], 8 + (l[1] < 8 ? -3 : 3), l[0] + (i % 2 ? 3 : -3), l[1], P.b2); });
        for (var i = 0; i < 6; i++) p.px(13 + i * 2.6, 8, P.r);
        p.px(30, 6, P.eye); p.px(30, 10, P.eye);
      }, '#1e2414');
    }
    cTop('buayaK20t_0', 0, CLAN); cTop('buayaK20t_1', 1, CLAN);
    make('buayaK20_face', 28, 22, function (p) {
      p.poly([[0, 8], [10, 4], [27, 10], [27, 15], [0, 18]], '#5e5236'); p.poly([[2, 9], [10, 6], [26, 11], [26, 13], [2, 15]], '#7a6a48');
      p.line(6, 14, 26, 13, '#40382a'); for (var t = 0; t < 5; t++) p.px(9 + t * 3, 15, '#f4eed8');
      p.rect(7, 3, 5, 4, '#7a6a48'); p.rect(8, 4, 3, 2, '#d8d8d0'); p.px(9, 4, '#a8a8a0');   // the milky old eye
      p.line(12, 8, 18, 11, '#d8c8a8'); p.px(4, 7, '#7aa84a'); p.px(6, 6, '#6a8a4a');
      p.rect(0, 19, 28, 2, 'rgba(160,210,240,0.5)');
    }, '#1e2414');
    make('kepala20', 20, 8, function (p) {
      p.ell(10, 5, 9, 2.6, '#545430'); p.ell(10, 4.5, 8, 2, '#6a6a3a');
      p.px(5, 3, '#e8c830'); p.px(8, 3, '#e8c830'); p.px(17, 4, '#3e3e22');
      p.rect(0, 6, 20, 2, 'rgba(160,210,240,0.45)');
    }, '#1e2414');

    // ---- the Bajau Laut's lepa, from above (34 x 14), with a patched sail and a lamp
    function lepa(key, f) {
      make(key, 34, 14, function (p) {
        p.poly([[1, 7], [6, 3], [28, 3], [33, 7], [28, 11], [6, 11]], '#8a5a2b'); p.poly([[4, 7], [8, 5], [26, 5], [30, 7], [26, 9], [8, 9]], '#c89a5a');
        p.poly([[30, 5], [34, 4], [34, 10], [30, 9]], '#e84a6a');   // the carved, painted prow
        p.px(32, 6, '#e9c46a'); p.px(32, 8, '#3a8a6a');
        var s = f ? 1 : 0;
        p.poly([[14 + s, 0], [17 + s, 0], [18 - s, 14], [13 - s, 14]], '#e8d0a0'); p.rect(14, 3, 3, 2, '#e84a6a'); p.rect(14, 8, 3, 2, '#3a8aa8');   // a patched sail
        p.disc(5, 7, 1.3, '#ffd166');
      }, '#2a1a10');
    }
    lepa('lepa20_t0', 0); lepa('lepa20_t1', 1);

    // ---- the wild things of the Kinabatangan
    function monkey(key, honk) {
      make(key, 16, 18, function (p) {
        p.ell(8, 12, 4.5, 5, '#d08a4a'); p.ell(8, 13, 3, 3.5, '#f0d0a0');   // body, pale belly
        p.rect(4, 15, 2, 3, '#c07a3a'); p.rect(10, 15, 2, 3, '#c07a3a');
        p.disc(8, 5, 3.6, '#d89a5a'); p.rect(6, 4, 4, 2, '#f0c890');
        p.px(6, 4, '#2a1a10'); p.px(9, 4, '#2a1a10');
        p.ell(8, 8, honk ? 2.4 : 2, honk ? 2.6 : 2.2, '#e8a070'); p.px(8, 10, honk ? '#4a1a10' : '#c07a5a');   // THE NOSE
        p.line(13, 12, 15, 17, '#c07a3a');   // the tail
      }, '#3a2010');
    }
    monkey('monyet20_0', false); monkey('monyet20_1', true);
    function hornbill(key, f) {
      make(key, 26, 14, function (p) {
        var up = f ? -3 : 3;
        p.poly([[6, 7], [13, 7 + up], [18, 7], [13, 9]], '#1a1a1a');   // a wing
        p.ell(12, 8, 6, 2.6, '#1e1e1e'); p.rect(2, 7, 5, 3, '#f4f2ec');   // body, white tail
        p.disc(19, 7, 2.4, '#1e1e1e'); p.poly([[20, 5], [26, 7], [21, 8]], '#e8c030'); p.poly([[19, 4], [25, 5], [21, 6]], '#e84a1a');   // the bill and its casque
        p.px(19, 6, '#f4f2ec');
      }, '#0a0a0a');
    }
    hornbill('enggang20_0', 0); hornbill('enggang20_1', 1);
    function elephant(key, f) {
      make(key, 30, 22, function (p) {
        var l = f ? 1 : -1;
        p.ell(14, 11, 10, 7, '#8a8a92'); p.ell(14, 10, 9, 6, '#9a9aa2');
        p.rect(6 + l, 15, 4, 6, '#8a8a92'); p.rect(11 - l, 15, 4, 6, '#7a7a82'); p.rect(17 + l, 15, 4, 6, '#8a8a92'); p.rect(21 - l, 15, 3, 6, '#7a7a82');
        p.disc(24, 9, 5, '#9a9aa2'); p.ell(21, 8, 3, 4, '#7a7a82');   // the head and a big ear
        p.poly([[27, 10], [29, 13], [29, 19], [27, 20], [26, 13]], '#8a8a92');   // the trunk
        p.px(26, 7, '#1a1a1a'); p.px(28, 12, '#f4f2ec');
        p.line(3, 9, 1, 14, '#7a7a82');
      }, '#3a3a42');
    }
    elephant('gajah20_0', 0); elephant('gajah20_1', 1);
    make('bakau20', 28, 34, function (p) {
      for (var i = 0; i < 6; i++) p.line(14, 20, 3 + i * 4.5, 33, '#6a4a2a');   // stilt roots
      p.rect(13, 10, 3, 12, '#6a4a2a');
      [[8, 8, 8], [20, 8, 8], [14, 4, 8], [10, 14, 6], [19, 14, 6]].forEach(function (c) { p.disc(c[0], c[1], c[2], '#2e5a2a'); p.disc(c[0] - 1, c[1] - 2, c[2] - 3, '#3e7a36'); });
    });
    make('kinabalu20', 128, 56, function (p) {
      p.poly([[0, 56], [20, 34], [34, 30], [46, 18], [54, 22], [60, 6], [66, 14], [72, 4], [78, 12], [84, 8], [92, 22], [104, 26], [128, 44], [128, 56]], '#4a5a7a');
      p.poly([[46, 18], [54, 22], [60, 6], [66, 14], [72, 4], [78, 12], [84, 8], [90, 20], [80, 18], [70, 16], [58, 20]], '#7a8aa8');   // granite peaks
      [[8, 44, 14], [30, 40, 12], [100, 36, 14], [116, 46, 12]].forEach(function (c) { p.ell(c[0], c[1], c[2], 4, 'rgba(240,240,250,0.7)'); });   // the morning clouds
    }, false);

    // ---- the nest bank: the nest and its eggs, the bell post, the spark, the firefly jar
    make('sarang20', 32, 14, function (p) {
      p.ell(16, 10, 15, 4, '#c8a870'); p.ell(16, 9, 13, 3, '#d8bc84');
      [[9, 8], [13, 7], [17, 8], [21, 7], [24, 9], [12, 10], [19, 10]].forEach(function (e) { p.ell(e[0], e[1], 2, 2.6, '#f4f2ea'); p.px(e[0] - 1, e[1] - 1, '#ffffff'); });
      for (var i = 0; i < 6; i++) p.line(2 + i * 5, 12, 4 + i * 5, 9, '#8a7a4a');
    });
    make('sarang20_pecah', 32, 14, function (p) {
      p.ell(16, 10, 15, 4, '#c8a870'); p.ell(16, 9, 13, 3, '#d8bc84');
      [[9, 8], [13, 7], [17, 8], [21, 7], [24, 9], [12, 10], [19, 10]].forEach(function (e, i) { p.poly([[e[0] - 2, e[1]], [e[0] - 1, e[1] - 2], [e[0], e[1] - 1], [e[0] + 1, e[1] - 2], [e[0] + 2, e[1]], [e[0], e[1] + 2]], '#f0ece0'); if (i % 2) p.px(e[0], e[1] - 1, '#c8c4b8'); });
    });
    make('tiang20', 10, 24, function (p) {
      p.rect(4, 4, 2, 20, '#6a4a2a'); p.rect(1, 3, 8, 2, '#6a4a2a');
      p.poly([[3, 6], [7, 6], [8, 11], [2, 11]], '#e9c46a'); p.px(4, 7, '#fff0b0'); p.disc(5, 12, 1, '#8a6a2a');
    });
    make('percik20', 10, 10, function (p) {
      p.disc(5, 5, 3, '#fff8d0'); p.disc(5, 5, 1.6, '#ffffff'); p.px(5, 0, '#fff0b0'); p.px(5, 9, '#fff0b0'); p.px(0, 5, '#fff0b0'); p.px(9, 5, '#fff0b0');
      p.px(3, 6, '#7ac0ff'); p.px(7, 6, '#7ac0ff');   // tears
    }, false);
    make('jar20', 10, 12, function (p) {
      p.rect(2, 3, 6, 8, 'rgba(220,240,255,0.5)'); p.rect(3, 1, 4, 2, '#8a6a4a');
      [[4, 5], [6, 7], [4, 9], [6, 4]].forEach(function (f) { p.px(f[0], f[1], '#fdff90'); });
    });

    // ---- the great shadow: Pelita's own, grown huge (64 x 72): a dark Pelita shape with a dim heart
    function shadow(key, f) {
      make(key, 64, 72, function (p) {
        var w = f ? 2 : -2, D = '#0e0816', D2 = '#1e1430';
        p.disc(32, 26, 22, D);
        p.poly([[10, 30], [54, 30], [58 + w, 58], [50, 66], [44 + w, 58], [38, 70], [32 + w, 60], [26, 70], [20 - w, 58], [14, 66], [6 - w, 58]], D);   // the ragged tail
        p.disc(28, 20, 12, D2);
        p.ell(23, 26, 3.4, 4.4, '#8a5aff'); p.ell(41, 26, 3.4, 4.4, '#8a5aff'); p.px(23, 25, '#e0d0ff'); p.px(41, 25, '#e0d0ff');   // violet eyes
        p.poly([[26, 36], [38, 36], [32, 42]], '#2a1840');   // a mouth, open
        p.disc(32, 50, 3, '#3a2a5a'); p.px(32, 50, '#6a5a8a');   // the heart, shut tight
        for (var i = 0; i < 6; i++) p.px(14 + i * 7, 6 + (i % 2) * 3, '#c8a8ff');
      }, '#c8a8ff');
    }
    shadow('bayang20_besar_0', 0); shadow('bayang20_besar_1', 1);
    anim('bayang20_besar_walk', ['bayang20_besar_0', 'bayang20_besar_1'], 3);

    // ---- Harimau Cahaya: a tiger made of light (32 x 20), three frames
    function tiger(key, f) {
      make(key, 32, 20, function (p) {
        var L = '#fff6d8', G = '#ffd166', l = f === 1 ? 2 : f === 2 ? -2 : 0;
        p.ell(15, 10, 10, 5, L); p.ell(15, 9, 9, 4, '#ffffff');
        p.rect(7 + l, 13, 3, 6, L); p.rect(12 - l, 13, 3, 6, L); p.rect(18 + l, 13, 3, 6, L); p.rect(22 - l, 13, 3, 6, L);
        p.disc(26, 8, 5, L); p.px(28, 7, '#ff9a3a'); p.px(29, 9, G); p.rect(27, 10, 3, 1, G);   // the head
        p.poly([[23, 3], [25, 1], [26, 4]], L); p.poly([[28, 3], [30, 1], [30, 4]], L);   // ears
        [[10, 6], [14, 5], [18, 6], [12, 12], [17, 12]].forEach(function (s) { p.line(s[0], s[1], s[0] + 1, s[1] + 3, G); });   // golden stripes
        p.poly([[5, 9], [1, 4 - l], [2, 3 - l], [6, 8]], L);   // the tail
      }, '#ffb84a');
    }
    tiger('harimau20_0', 0); tiger('harimau20_1', 1); tiger('harimau20_2', 2);
    anim('harimau20_walk', ['harimau20_1', 'harimau20_0', 'harimau20_2', 'harimau20_0'], 10);

    // ---- Anak Putih: a hatchling, half grown, and carrying you (side, up, down)
    make('anak20_kecil', 24, 10, function (p) {
      p.poly([[0, 6], [5, 5], [9, 5], [9, 7], [4, 8]], '#e8e6de'); p.ell(12, 6, 5, 2.6, '#f4f2ec');
      p.poly([[15, 4], [23, 5], [23, 7], [15, 8]], '#f4f2ec'); p.px(16, 4, '#e8b830'); p.rect(9, 8, 2, 2, '#e8e6de'); p.rect(13, 8, 2, 2, '#e8e6de');
    }, '#5a5a58');
    make('anak20_muda', 40, 14, function (p) {
      p.poly([[0, 8], [8, 6], [14, 6], [14, 10], [6, 11]], '#d8d6ce'); p.ell(20, 8, 8, 3.6, '#f4f2ec');
      p.poly([[26, 5], [39, 7], [39, 10], [26, 11]], '#f4f2ec'); p.line(29, 9, 38, 9, '#b0aca0'); p.px(27, 5, '#e8b830');
      p.rect(14, 11, 3, 3, '#d8d6ce'); p.rect(23, 11, 3, 3, '#d8d6ce');
      for (var i = 0; i < 5; i++) p.px(11 + i * 3, 5, '#c4c0b4');
    }, '#5a5a58');
    make('anak20_ride_side', 48, 16, function (p) {
      p.poly([[0, 9], [8, 7], [16, 7], [16, 12], [6, 13]], '#d8d6ce'); p.ell(24, 9, 10, 4.4, '#f4f2ec');
      p.poly([[32, 6], [47, 8], [47, 11], [32, 12]], '#f4f2ec'); p.line(35, 10, 46, 10, '#b0aca0'); p.px(33, 6, '#e8b830');
      for (var i = 0; i < 6; i++) p.px(13 + i * 3, 5, '#c4c0b4');
      p.rect(0, 13, 48, 3, 'rgba(160,210,240,0.4)');
    }, '#5a5a58');
    function rideUp(key, down) {
      make(key, 18, 42, function (p) {
        p.ell(9, 22, 5, 11, '#f4f2ec'); p.ell(9, 22, 4, 10, '#ffffff');
        if (down) { p.poly([[6, 30], [12, 30], [11, 41], [7, 41]], '#f4f2ec'); p.px(7, 32, '#e8b830'); p.px(11, 32, '#e8b830'); p.poly([[7, 12], [11, 12], [9, 0]], '#d8d6ce'); }
        else { p.poly([[6, 14], [12, 14], [11, 2], [7, 2]], '#f4f2ec'); p.px(7, 12, '#e8b830'); p.px(11, 12, '#e8b830'); p.poly([[7, 32], [11, 32], [9, 42]], '#d8d6ce'); }
        [[3, 18], [15, 18], [3, 27], [15, 27]].forEach(function (l) { p.rect(l[0] - 1, l[1], 2, 3, '#d8d6ce'); });
      }, '#5a5a58');
    }
    rideUp('anak20_ride_up', false); rideUp('anak20_ride_down', true);
    make('ic_harimau20', 12, 12, function (p) {
      p.disc(6, 6, 5, '#fff6d8'); p.poly([[2, 2], [4, 0], [5, 3]], '#fff6d8'); p.poly([[7, 3], [8, 0], [10, 2]], '#fff6d8');
      p.px(4, 5, '#ff9a3a'); p.px(8, 5, '#ff9a3a'); p.rect(5, 8, 2, 1, '#ffb84a'); p.line(2, 6, 3, 8, '#ffd166'); p.line(10, 6, 9, 8, '#ffd166');
    });

    // ---- Pelita Putih: every picture of Pelita Purnama, turned white with a gold rim
    ['normal', 'happy', 'sad', 'sleepy'].forEach(function (ex) {
      var src = 'ghost_5_' + ex, key = 'ghost_6_' + ex;
      if (!scene.textures.exists(src)) return;
      var img = scene.textures.get(src).getSourceImage(), w = img.width, h = img.height;
      var cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      var ctx = cv.getContext('2d', { willReadFrequently: true }); ctx.drawImage(img, 0, 0);
      var d = ctx.getImageData(0, 0, w, h), px = d.data;
      for (var i = 0; i < px.length; i += 4) {
        if (!px[i + 3]) continue;
        var lum = (px[i] * 0.3 + px[i + 1] * 0.59 + px[i + 2] * 0.11) / 255, edge = false, x = (i / 4) % w, y = Math.floor(i / 4 / w);
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (o) { var xx = x + o[0], yy = y + o[1]; if (xx < 0 || yy < 0 || xx >= w || yy >= h || !px[((yy * w + xx) * 4) + 3]) edge = true; });
        if (lum < 0.22) continue;                                  // keep the eyes and mouth
        if (edge) { px[i] = 255; px[i + 1] = 200; px[i + 2] = 90; } // a rim of gold
        else { var v = 225 + lum * 30; px[i] = v; px[i + 1] = v; px[i + 2] = Math.min(255, v + 8); }   // white as the moon
      }
      ctx.putImageData(d, 0, 0);
      if (scene.textures.exists(key)) scene.textures.remove(key);
      scene.textures.addCanvas(key, cv);
    });
  };
})(window.LC);
