/* Little Creature's people, in the style of Daniel Diggle's Sunnyside World (v3.25): a big round head, two tall dot
 * eyes, rosy cheeks, a small body, and a dark #181425 outline.
 * You are the pack's own farmer: since v3.26 every move of yours (standing, walking, carrying, digging, watering,
 * mining, fishing, a swing, a flinch) is the pack's animation, from the rows in folk-moves.js, with your shirt, trousers
 * and skin recoloured for each co-op outfit (WorldMoves.js plays them). The front and back views (portraits and rides),
 * every villager and the chapter casts are drawn here in the same style. The pack's licence lets a game use and change its art; the pack itself must not be
 * resold or shared, so only these few rows are kept, inside the game's code. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art;
  var O = '#181425';

  // ------------------------------------------------------------------ what's new
  var prevNews = LC.NEWS, seenNews = null;
  try { seenNews = localStorage.getItem('littleCreature.newsSeen'); } catch (e) { /* storage blocked */ }
  LC.NEWS = {
    id: 'v3.26-moves',
    lines: (prevNews && seenNews !== prevNews.id && seenNews !== 'v3.25-folk' && seenNews !== 'v3.26-moves' ? prevNews.lines : []).concat(seenNews === 'v3.25-folk' ? [] : [
      { text: '✦ A new look for everyone ✦  You are now the little farmer of Daniel Diggle\'s Sunnyside World (each co-op friend has a hairstyle of their own), and every villager, guest, hero and foe of all twenty chapters has been redrawn to match.' }
    ]).concat([
      { text: '✦ The farmer moves ✦  You now move like the Sunnyside farmer: you face left or right as you walk (the square in front still shows where you will act), breathe while you stand, lift what you hold over your head, and dig, water, mine, pick, fish and swing with the pack\'s own animations.' }
    ])
  };

  // ------------------------------------------------------------------ colours
  function rgb(h) { h = h.replace('#', ''); if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]; return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
  function hex(c) { return '#' + c.map(function (v) { v = Math.max(0, Math.min(255, Math.round(v))); return (v < 16 ? '0' : '') + v.toString(16); }).join(''); }
  function mix(a, b, t) { var x = rgb(a), y = rgb(b); return hex([x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t]); }
  function lum(c) { var x = rgb(c); return (0.3 * x[0] + 0.59 * x[1] + 0.11 * x[2]) / 255; }
  Art.folkMix = mix;
  // a hair colour as three shades. Near-black hair is lifted to the pack's dark plum-brown, so it never melts into the outline.
  function hairRamp(h) {
    h = h || '#3e2731';
    if (lum(h) < 0.16) h = mix(h, '#4a3040', 0.75);
    return { 1: mix(h, O, 0.42), 2: h, 3: mix(h, lum(h) > 0.6 ? '#ffffff' : '#c08a6a', lum(h) > 0.6 ? 0.45 : 0.3) };
  }
  function skinSet(s) { s = s || '#e4a672'; return { s: s, S: mix(s, '#6a3040', 0.22), h: mix(s, '#6a3040', 0.34), b: mix(s, '#f6757a', 0.6) }; }

  // ------------------------------------------------------------------ front and back heads (rows y2..y14, columns x1..x14)
  // 1/2/3 are the hair's shade, base and light; 4 a light fringe shadow; s skin; '.' leaves what is under it.
  var HAIR = {
    short: {
      front: ['..............', '..............', '..............',
              '...22333322...', '..2223333222..', '..2222332222..', '..2222222222..', '..22.2222.22..', '..2........2..'],
      back:  ['..............', '..............', '..............',
              '...22333322...', '..2223333222..', '..2222332222..', '..2222222222..', '..2222222222..', '..2222222222..',
              '..2222222222..', '..1222222221..', '..1122222211..', '...11ssss11...']
    },
    long: {
      front: ['..............', '.......323....', '......2222....',
              '...22233222...', '..2222332222..', '..2222222222..', '.102222222201.', '.10.22.222.01.', '.10........01.',
              '.11........11.', '.11........11.', '..1........1..'],
      back:  ['..............', '.......323....', '......2222....',
              '...22233222...', '..2222332222..', '..2222222222..', '.102222222201.', '.102222222201.', '.102222222201.',
              '.110222222011.', '.110022220011.', '..111000011...', '...11ssss11...']
    },
    bowl: {
      front: ['..............', '.....3..3.....', '....222222....',
              '...22233222...', '..2223333222..', '..2222332222..', '..2222222222..', '..1222222221..', '..1444444441..',
              '..1........1..'],
      back:  ['..............', '.....3..3.....', '....222222....',
              '...22233222...', '..2223333222..', '..2222332222..', '..2222222222..', '..1222222221..', '..1122222211..',
              '..1112222111..', '..1111111111..', '...11111111...', '...11ssss11...']
    },
    spiky: {
      front: ['...2..2..2....', '...22.22.22...', '..22222222222.',
              '..2222222222..', '.222222222222.', '..2222222222..', '..2222222222..', '..1122..2211..', '..1........1..'],
      back:  ['...2..2..2....', '...22.22.22...', '..22222222222.',
              '..2222222222..', '.222222222222.', '..2222222222..', '..2222222222..', '..2222222222..', '..1222222221..',
              '..1122222211..', '..1112222111..', '...11111111...', '...11ssss11...']
    },
    bun: {
      front: ['......22......', '.....2332.....', '......22......',
              '...22333322...', '..2223333222..', '..2222332222..', '..2222222222..', '..22......22..', '..2........2..'],
      back:  ['......22......', '.....2332.....', '......22......',
              '...22333322...', '..2223333222..', '..2222332222..', '..2222222222..', '..2222222222..', '..2222222222..',
              '..2222222222..', '..1222222221..', '..1122222211..', '...11ssss11...']
    },
    loose: {
      front: ['..............', '..............', '..............',
              '...22333322...', '..2223333222..', '..2222332222..', '.122222222221.', '.122......221.', '.12........21.',
              '.12........21.', '.12........21.', '.11........11.', '..1........1..'],
      back:  ['..............', '..............', '..............',
              '...22333322...', '..2223333222..', '..2222332222..', '.122222222221.', '.122222222221.', '.122222222221.',
              '.122222222221.', '.112222222211.', '.111222222111.', '..1111111111..']
    },
    witch: {   // Mak Lampir: wild, white, everywhere
      front: ['..2..2...2.2..', '.22.222.2222..', '.222333322222.', '2223333332222.', '22222222222222', '22222222222222', '222.2222.2.222',
              '22.........222', '2..........22.', '22.........22.', '.2..........2.', '22..........22', '2............2'],
      back:  ['..2..2...2.2..', '.22.222.2222..', '.222333322222.', '2223333332222.', '22222222222222', '22222222222222', '22222222222222',
              '22222222222222', '22222222222222', '22222222222222', '.222222222222.', '22122222222122', '2.1111111111.2']
    },
    bald: {   // an old man: a shiny crown, a little grey at the sides
      front: ['..............', '..............', '..............',
              '..............', '..............', '..............', '..2........2..', '..2........2..'],
      back:  ['..............', '..............', '..............',
              '..............', '..............', '..............', '..2222222222..', '..2222222222..', '..1222222221..',
              '...11ssss11...']
    }
  };
  function paintMask(p, rows, ox, oy, pal) {
    rows.forEach(function (row, r) {
      for (var i = 0; i < row.length; i++) { var c = pal[row[i]]; if (c) p.px(ox + 1 + i, oy + 2 + r, c); }
    });
  }

  // a stable pick for villagers who have no hairstyle of their own
  function pick(L) { var s = (L.skin || '') + (L.shirt || '') + (L.hair || '') + (L.bottom || ''), h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
  function styleOf(L) {
    if (L.style) return L.style;
    if (L.hat === 'bun') return 'bun';
    if (L.hat === 'flower' || L.hat === 'tudung') return 'loose';
    if (L.beard && lum(L.hair || '#000') > 0.55) return 'bald';
    var list = ['short', 'bowl', 'short', 'spiky', 'bowl', 'short'];
    return list[pick(L) % list.length];
  }

  // ------------------------------------------------------------------ hats (front view; x, y is the head's corner)
  function hat(p, L, x, y, back) {
    var px = function (a, b, c) { p.px(x + a, y + b, c); }, rect = function (a, b, w, h, c) { p.rect(x + a, y + b, w, h, c); };
    var hc = L.hatColor;
    switch (L.hat) {
      case 'songkok': rect(4, 2, 8, 4, '#24222c'); rect(4, 2, 8, 1, '#3e3c4a'); rect(4, 5, 8, 1, '#141218'); break;
      case 'kopiah': rect(4, 3, 8, 3, '#f5f0e6'); rect(4, 5, 8, 1, '#d8d2c4'); for (var k = 5; k < 12; k += 2) px(k, 4, '#e2dccd'); break;
      case 'terendak': case 'nonla': {
        var C1 = L.hat === 'nonla' ? '#f2e6b8' : '#ecd28a', C2 = L.hat === 'nonla' ? '#d8c890' : '#cdb062', C3 = L.hat === 'nonla' ? '#b8a468' : '#a88a44', CL = '#f7e6b0';
        [[7, 8], [6, 9], [5, 10], [4, 11], [2, 13], [1, 14]].forEach(function (rw, i) {
          for (var xx = rw[0]; xx <= rw[1]; xx++) {
            var t = (xx - rw[0]) / Math.max(1, rw[1] - rw[0]), c = t < 0.35 ? CL : t < 0.75 ? C1 : C2;
            if (i === 5) c = t < 0.5 ? C2 : C3; else if (i > 0 && (xx + i * 2) % 5 === 0) c = C2;
            px(xx, 1 + i, c);
          }
        });
        break;
      }
      case 'cap': rect(3, 4, 10, 3, '#e43b44'); rect(4, 3, 8, 1, '#e43b44'); rect(5, 3, 3, 1, '#f6757a'); px(7, 2, '#f5f0e1'); if (!back) rect(2, 7, 12, 1, '#a22633'); break;
      case 'headband': rect(3, 8, 10, 1, hc || '#e43b44'); px(13, 8, mix(hc || '#e43b44', O, 0.3)); px(13, 9, mix(hc || '#e43b44', O, 0.3)); break;
      case 'semutar': {   // a cloth tied round the head, the knot at the side
        var M = hc || '#8a3a2a';
        rect(4, 4, 8, 1, M); rect(3, 5, 10, 3, M); rect(3, 7, 10, 1, mix(M, O, 0.3)); rect(4, 5, 3, 1, mix(M, '#ffffff', 0.25));
        px(13, 5, M); px(14, 4, M); px(14, 6, mix(M, O, 0.3)); break;
      }
      case 'tudung': case 'hood': {
        var T = hc || (L.hat === 'hood' ? '#354b78' : '#e0607e'), T2 = mix(T, O, 0.25), T3 = mix(T, '#ffffff', 0.35);
        if (L.hat === 'hood') { rect(5, 2, 6, 2, T); px(7, 1, T); px(8, 1, T); }
        rect(4, 4, 8, 1, T); rect(3, 5, 10, 4, T); rect(2, 6, 1, 10, T2); rect(13, 6, 1, 10, T2); rect(3, 9, 1, 7, T); rect(12, 9, 1, 7, T);
        rect(4, 5, 8, 1, T3);
        if (L.hat === 'hood' && L.trim) rect(3, 8, 10, 1, L.trim);
        if (back) rect(3, 9, 10, 7, T);
        else if (L.hat === 'tudung') { rect(4, 14, 1, 1, T); rect(11, 14, 1, 1, T); rect(3, 15, 10, 2, T); rect(5, 16, 6, 1, T2); px(7, 15, T3); }
        break;
      }
      case 'ninja': {   // a black cloth over everything but the eyes
        var N = hc || '#22202a';
        rect(4, 4, 8, 1, N); rect(3, 5, 10, 5, N); rect(3, 13, 10, 1, N); rect(4, 14, 8, 1, N); px(3, 10, N); px(12, 10, N); px(3, 11, N); px(12, 11, N); px(3, 12, N); px(12, 12, N);
        rect(4, 5, 3, 1, mix(N, '#ffffff', 0.15)); px(13, 6, N); px(14, 7, N); break;
      }
      case 'flower': px(12, 6, '#ff6bb5'); px(13, 7, '#ff6bb5'); px(12, 8, '#ff6bb5'); px(11, 7, '#ff6bb5'); px(12, 7, '#ffd166'); break;
      case 'bun': px(9, 2, '#e9b949'); px(10, 1, '#e9b949'); break;
      case 'tanjak': case 'tanjak_gold': case 'tanjak_red': {   // the folded Malay headcloth, with its peak
        var tc = L.hat === 'tanjak_gold' ? '#e9c46a' : L.hat === 'tanjak_red' ? '#b8322a' : '#c8a040', tc2 = L.hat === 'tanjak_gold' ? '#c4922f' : L.hat === 'tanjak_red' ? '#7a1e1a' : '#8a6a28';
        rect(3, 5, 10, 3, tc); rect(4, 4, 8, 1, tc); rect(3, 7, 10, 1, tc2); px(5, 5, mix(tc, '#ffffff', 0.35)); px(6, 5, mix(tc, '#ffffff', 0.35));
        rect(10, 1, 2, 3, tc); px(12, 0, tc); px(11, 0, tc2); px(12, 1, tc2); px(9, 3, tc2);
        break;
      }
      case 'headdress': {   // a laksamana's golden tengkolok, three points and a ruby
        var G = '#feae34', G2 = '#c4922f';
        rect(3, 5, 10, 3, G); rect(3, 7, 10, 1, G2); rect(4, 4, 8, 1, G);
        [[4, 2], [7, 1], [8, 1], [11, 2]].forEach(function (c) { rect(c[0], c[1], 1, 4 - c[1], G); });
        px(5, 3, G); px(10, 3, G); px(7, 5, '#e43b44'); px(8, 5, '#e43b44'); px(4, 5, '#fee761'); break;
      }
      case 'leaf': p.poly([[x + 2, y + 7], [x + 8, y + 0], [x + 14, y + 7]], '#3f8a3a'); p.line(x + 8, y + 1, x + 8, y + 6, '#2a6a24'); px(8, 1, '#9be15d'); break;
      case 'crown': {
        var CR = hc || '#feae34';
        rect(4, 3, 8, 2, CR); px(4, 2, CR); px(7, 1, CR); px(8, 1, CR); px(11, 2, CR); px(7, 2, CR); px(8, 2, CR);
        px(8, 3, L.jewel || '#e43b44'); px(5, 3, '#fee761'); rect(4, 4, 8, 1, mix(CR, O, 0.3)); break;
      }
      case 'helmet': {   // a round iron helmet
        var MH = hc || '#8b9bb4';
        rect(4, 3, 8, 1, MH); rect(3, 4, 10, 4, MH); rect(4, 4, 3, 1, mix(MH, '#ffffff', 0.45)); rect(2, 7, 12, 1, mix(MH, O, 0.3)); px(8, 2, mix(MH, O, 0.2));
        if (L.crest) { rect(5, 1, 6, 2, L.crest); px(11, 2, L.crest); px(4, 2, mix(L.crest, O, 0.3)); }
        break;
      }
      case 'morion': {   // the Spanish helmet: a steel crest, a brim curving up at both ends
        var MO = '#c0cbdc', MO2 = '#8b9bb4';
        rect(4, 3, 8, 3, MO); rect(5, 2, 6, 1, MO); rect(7, 0, 2, 2, MO2); rect(5, 3, 2, 1, '#ffffff');
        rect(2, 6, 12, 1, MO2); px(1, 5, MO2); px(14, 5, MO2); break;
      }
      case 'captain': { var CP = hc || '#3a4466'; rect(3, 3, 10, 3, CP); rect(4, 2, 8, 1, CP); rect(3, 6, 10, 1, mix(CP, O, 0.35)); px(8, 4, '#feae34'); px(7, 4, '#fee761'); break; }
      case 'bandana': { var BD = hc || '#a04447'; rect(4, 4, 8, 1, BD); rect(3, 5, 10, 3, BD); rect(4, 5, 4, 1, mix(BD, '#ffffff', 0.25)); px(13, 6, BD); px(14, 7, BD); px(14, 8, mix(BD, O, 0.3)); px(13, 8, BD); break; }
      case 'bunian': {   // a keeper's wide green hat with a gold band
        var BU = hc || '#436b64';
        rect(5, 1, 6, 1, BU); rect(4, 2, 8, 2, BU); rect(3, 4, 10, 1, '#e3bc7d'); rect(1, 5, 14, 1, mix(BU, O, 0.2)); rect(5, 2, 2, 1, mix(BU, '#ffffff', 0.25)); break;
      }
      case 'turban': { var U = hc || '#f2ece0'; rect(3, 3, 10, 5, U); rect(4, 2, 8, 1, U); rect(3, 6, 10, 1, mix(U, O, 0.15)); px(8, 4, '#e43b44'); px(5, 4, mix(U, '#ffffff', 0.5)); break; }
    }
  }

  // ------------------------------------------------------------------ the front / back body
  // L (a look): skin, hair, style, hairPal, shirt, shirt2, bottom, bottom2, shoes, hat, hatColor, trim, crest, jewel, eye,
  //   noBlush, beard, moustache, straps, sash, belt, chest (bare chest or an open vest), coat, cape,
  //   build ('tall' or 'broad'), dress (a kain to the ankles), robe (to the ground), tail (a mermaid's), float (a ghost's),
  //   outline, alpha, extra(p, g)
  // o: dir ('down' | 'up'), blink, step (0 standing, 1/2 a foot lifted), dx, dy, extra(p, g), fade (rows), noOutline
  function chibi(p, L, o) {
    o = o || {};
    var back = o.dir === 'up', step = o.step || 0;
    var x = Math.floor(p.w / 2) - 8 + (o.dx || 0), y = p.h - 20 + (o.dy || 0);
    var px = function (a, b, c) { if (c) p.px(x + a, y + b, c); }, rect = function (a, b, w, h, c) { if (c && w > 0 && h > 0) p.rect(x + a, y + b, w, h, c); };
    var K = skinSet(L.skin), S = L.shirt || '#e43b44', S2 = L.shirt2 || mix(S, O, 0.3), B = L.bottom || '#3a4466', B2 = L.bottom2 || mix(B, O, 0.35);
    var SH = L.shoes || '#733e39';
    var tall = (L.build === 'tall' || L.build === 'broad') ? 1 : 0, wd = L.build === 'broad' ? 1 : 0;
    var hb = (o.headBob || 0) - 2 * tall;                         // the head sits 2 rows higher on a tall body
    var sT = 15 - 2 * tall, lT = 17 - tall, sE = lT - 1;          // shirt rows sT..sE, legs lT..18, feet on 19
    var b0 = 5 - wd, b1 = 10 + wd, hl = 4 - wd, hr = 11 + wd;     // the shirt's columns, and the hands'
    var g = { x: x, y: y, hb: hb, back: back, step: step, f: o.f || 0, sT: sT, sE: sE, lT: lT, b0: b0, b1: b1, hl: hl, hr: hr, eye: 11 + hb, top: 4 + hb };
    var lUp = step === 1, rUp = step === 2;
    // a cape hangs behind everything
    if (L.cape) { rect(b0 - 1, sT, b1 - b0 + 3, 20 - sT, back ? L.cape : mix(L.cape, O, 0.3)); }
    // legs: trousers, a kain, a robe, a tail, or a ghost's fading hem
    if (L.tail) {
      var T1 = L.tail, T2 = L.tail2 || mix(L.tail, '#ffffff', 0.3), T3 = mix(L.tail, O, 0.3);
      rect(5, lT, 6, 1, T1); rect(6, lT + 1, 4, 18 - lT, T1); px(9, lT + 1, T3);
      var sway = o.f ? 1 : 0;
      rect(3 + sway, 19, 4, 1, T2); rect(9 + sway, 19, 4, 1, T2); rect(7, 18, 2, 2, T1); px(4 + sway, 18, T2); px(11 + sway, 18, T2);
      px(6, lT, T2); px(8, lT + 1, T2);
    } else if (L.float) {
      rect(b0, lT, b1 - b0 + 1, 19 - lT, B); rect(b1 - 1, lT, 2, 19 - lT, B2);
      for (var fx = b0; fx <= b1; fx++) if ((fx + (o.f || 0)) % 2) px(fx, 19, fx > b1 - 2 ? B2 : B);
    } else if (L.robe) {
      rect(b0, lT, b1 - b0 + 1, 1, B); rect(b0 - 1, lT + 1, b1 - b0 + 3, 19 - lT, B); rect(b1, lT + 1, 2, 19 - lT, B2);
      if (L.trim) rect(b0 - 1, 19, b1 - b0 + 3, 1, L.trim);
      if (L.robeDots) for (var ry = lT + 1; ry < 19; ry += 2) for (var rx = b0 + (ry % 4 === 0 ? 0 : 1); rx <= b1; rx += 3) px(rx, ry, L.robeDots);
    } else if (L.dress) {
      rect(4, lT, 8, 18 - lT, B); rect(4, 18, 8, 1, B2); px(7, lT, B2);
      rect(5, 19, 2, 1, lUp ? K.h : SH); rect(9, 19, 2, 1, rUp ? K.h : SH);
    } else {
      rect(5, lT, 6, 19 - lT, B); rect(7, 18, 2, 1, B2);
      if (lUp) rect(5, 18, 2, 1, SH); if (rUp) rect(9, 18, 2, 1, SH);
      if (!lUp) rect(5, 19, 2, 1, SH); if (!rUp) rect(9, 19, 2, 1, SH);
    }
    if (L.coat) { rect(b0, sT, 1, sE - sT + 1, L.coat); rect(b1, sT, 1, sE - sT + 1, L.coat); if (!L.robe) { rect(5, lT, 1, 18 - lT, L.coat); rect(10, lT, 1, 18 - lT, L.coat); } }
    // the shirt (its top row in the shadow of the chin), then the arms and hands at the sides
    rect(b0, sT, b1 - b0 + 1, 1, S2); rect(b0, sT + 1, b1 - b0 + 1, sE - sT, S);
    if (L.chest) { rect(7 - wd, sT, 2 + 2 * wd, sE - sT + 1, L.chest); px(7 - wd, sT, mix(L.chest, O, 0.15)); }
    if (L.coat) { rect(b0, sT, 1, sE - sT + 1, L.coat); rect(b1, sT, 1, sE - sT + 1, L.coat); }
    if (L.straps) { px(6, sT, L.straps); px(9, sT, L.straps); for (var sy = sT + 1; sy <= sE; sy++) { px(6, sy, mix(L.straps, '#ffffff', 0.12)); px(9, sy, mix(L.straps, '#ffffff', 0.12)); } }
    if (L.sash) p.line(x + b0, y + sT, x + b1, y + sE + (tall ? 1 : 0), L.sash);
    if (L.belt) rect(b0, lT, b1 - b0 + 1, 1, L.belt);
    for (var ay = sT + 1; ay < sE; ay++) { px(hl, ay, L.sleeve || S2); px(hr, ay, L.sleeve || S2); }
    px(hl, sE, K.s); px(hl, sE + 1, K.h); px(hr, sE, K.s); px(hr, sE + 1, K.h);
    if (L.armlet) { px(hl, sE - 1 < sT ? sE : sE - 1, L.armlet); px(hr, sE - 1 < sT ? sE : sE - 1, L.armlet); }
    // the head: a round dome
    rect(4, 5 + hb, 8, 1, K.s); rect(3, 6 + hb, 10, 8, K.s); rect(4, 14 + hb, 8, 1, K.s); px(4, 14 + hb, K.S); px(11, 14 + hb, K.S);
    if (!back) {
      var E = L.eye || O;
      if (o.blink) { rect(5, 12 + hb, 2, 1, O); rect(9, 12 + hb, 2, 1, O); }
      else if (L.eyeWide) { rect(5, 11 + hb, 2, 2, E); rect(9, 11 + hb, 2, 2, E); }
      else { rect(6, 11 + hb, 1, 2, E); rect(9, 11 + hb, 1, 2, E); }
      if (L.brows) { rect(5, 10 + hb, 2, 1, L.brows); rect(9, 10 + hb, 2, 1, L.brows); }
      if (!L.noBlush) { px(5, 13 + hb, K.b); px(10, 13 + hb, K.b); }
      if (L.beard) {
        var BE = L.beard, BE2 = mix(BE, O, 0.18);
        rect(5, 13 + hb, 6, 2, BE); px(4, 13 + hb, BE); px(11, 13 + hb, BE); px(7, 13 + hb, BE2); px(8, 13 + hb, BE2);
        if (L.longBeard) { rect(5, 15 + hb, 6, 2, BE); rect(6, 17 + hb, 4, 1, BE); rect(7, 18 + hb, 2, 1, BE2); }
        else { rect(6, 15 + hb, 4, 1, BE); rect(7, 16 + hb, 2, 1, BE2); }
      }
      if (L.moustache) rect(6, 13 + hb, 4, 1, L.moustache);
    }
    // hair, then the hat
    if (L.hat !== 'tudung' && L.hat !== 'ninja' && L.hat !== 'hood') {
      var HR = hairRamp(L.hair), pal = { 1: HR[1], 0: mix(HR[1], HR[2], 0.5), 2: HR[2], 3: HR[3], 4: K.S, s: K.S };
      if (L.hairPal) { pal = {}; Object.keys(L.hairPal).forEach(function (k) { pal[k] = L.hairPal[k]; }); pal.s = K.S; if (!pal[4]) pal[4] = K.S; }
      paintMask(p, HAIR[styleOf(L)][back ? 'back' : 'front'], x, y + hb, pal);
    }
    hat(p, L, x, y + hb, back);
    if (L.extra) L.extra(p, g);
    if (o.extra) o.extra(p, g);
    if (!o.noOutline) p.outline(L.outline || O);
    if (o.fade || L.alpha) fadeAlpha(p, o.fade || 0, L.alpha || 1);
    if (o.after) o.after(p, g);
  }
  // a ghost's see-through body (alpha), and a hem fading into the water (the last rows)
  function fadeAlpha(p, rows, a) {
    var img = p.ctx.getImageData(0, 0, p.w, p.h), d = img.data;
    for (var yy = 0; yy < p.h; yy++) {
      var k = a * (rows && yy >= p.h - rows ? (p.h - yy) / (rows + 1) : 1);
      if (k >= 1) continue;
      for (var xx = 0; xx < p.w; xx++) d[(yy * p.w + xx) * 4 + 3] *= k;
    }
    p.ctx.putImageData(img, 0, 0);
  }
  Art.chibi = chibi;
  Art.folkHair = hairRamp;

  // every villager in the game is drawn here now (16 x 20, facing you)
  Art.drawVillager = function (p, L, blink, step) { chibi(p, L, { blink: blink, step: step || 0 }); };

  // ------------------------------------------------------------------ you
  var PLAYER_STYLE = ['short', 'long', 'bowl', 'spiky'];
  var PLAYER_PAL = {
    short: { 1: mix('#3e2731', O, 0.4), 2: '#3e2731', 3: '#733e39' },
    long: { 1: '#a22633', 0: '#be4a2f', 2: '#f77622', 3: '#feae34' },
    bowl: { 1: '#3e2731', 2: '#733e39', 3: '#b86f50', 4: '#c28569' },
    spiky: { 1: '#a22633', 2: '#e43b44', 3: '#f6757a' }
  };
  Art.PLAYER_W = 18; Art.PLAYER_H = 20;
  // where your eyes are, for the Bunian mirror's red-eyed copy of you
  Art.PLAYER_EYES = { down: [[7, 11], [7, 12], [10, 11], [10, 12]], side: [[9, 11], [9, 12], [12, 11], [12, 12]], up: [] };
  function outfitLook(O6, c) {
    var st = PLAYER_STYLE[c % 4];
    return { skin: O6[4], shirt: O6[0], shirt2: O6[1], bottom: O6[2], bottom2: O6[3], straps: O6[3], style: st, hairPal: PLAYER_PAL[st] };
  }
  // ------------------------------------------------------------------ you, moving (v3.26): the pack's own animations
  // folk-moves.js keeps the farmer's frames as run-length rows; here they become textures `<pl>_m_<move>_<i>` (and
  // the anims `<pl>_m_<move>`), each cropped evenly round the feet so every one stands at origin (0.5, 1).
  var MOVE_RATE = { idle: 8, walk: 12, carry: 12, dig: 22, water: 10, mine: 20, doing: 16, cast: 24, wait: 7, reel: 16, caught: 16, attack: 28, hurt: 20 };
  var MOVE_LOOP = { idle: 1, walk: 1, carry: 1, wait: 1, reel: 1 };
  var NO_FX = { attack: { U: 1, V: 1, T: 1, L: 1 } };   // the swing's slash and spark: the game draws its own, round your own weapon
  var ARM_TOOLS = { carry: 1 };   // the carrying arm is in the tool layer: give it your sleeve and skin
  var rgbCache = {};
  function rgbOf(c) { return rgbCache[c] || (rgbCache[c] = rgb(c)); }
  function unpack(s) {   // '3s2.o|...' -> ['ssso..o', ...]
    return s ? s.split('|').map(function (r) { return r.replace(/(\d*)(\D)/g, function (m, n, ch) { return new Array((n ? +n : 1) + 1).join(ch); }); }) : [];
  }
  function packPal() {
    var M = LC.FOLK_MOVES, out = {}, list = M.pal.split(' '), L = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef';
    list.forEach(function (h, i) { out[L[i]] = '#' + h; });
    return out;
  }
  function bodyPal(O6, PP) {
    var K = skinSet(O6[4]), pal = {};
    Object.keys(PP).forEach(function (k) { pal[k] = PP[k]; });
    var roles = { o: O, s: K.s, S: K.S, h: K.h, b: K.b, c: O6[1], C: O6[0], p: O6[2], P: O6[3], f: '#733e39' };
    Object.keys(roles).forEach(function (k) { pal[k] = roles[k]; });
    return pal;
  }
  // the pack's body colours in a tool layer, as yours
  function armPal(O6, ppal) {
    var K = skinSet(O6[4]), map = { '#a22633': O6[1], '#e43b44': O6[0], '#e4a672': K.s, '#b86f50': K.h, '#c28569': K.S, '#3a4466': O6[2], '#262b44': O6[3], '#f6757a': K.b }, out = {};
    Object.keys(ppal).forEach(function (k) { out[k] = map[ppal[k]] || ppal[k]; });
    return out;
  }
  // the even crop round the feet (x 48, bottom of row 38) for one move
  function moveBox(a) { var half = Math.max(48 - a.x, a.x + a.w - 48); return { x0: 48 - half, w: 2 * half, y0: a.y, h: 39 - a.y }; }
  // paints frame i of move a into an ImageData whose top-left is the pack's (x0, y0)
  function paintMove(img, w, h, x0, y0, a, i, style, bpal, ppal, tools, tpal) {
    var layers = [[a.base[i], bpal], [a.hair[style][i], ppal]];
    if (tools && a.tools) layers.push([a.tools[i], tpal || ppal]);
    layers.forEach(function (L) {
      unpack(L[0]).forEach(function (row, ry) {
        var yy = a.y + ry - y0;
        if (yy < 0 || yy >= h) return;
        for (var rx = 0; rx < row.length; rx++) {
          var ch = row[rx]; if (ch === '.') continue;
          var col = L[1][ch], xx = a.x + rx - x0;
          if (!col || xx < 0 || xx >= w) continue;
          var c = rgbOf(col), k = (yy * w + xx) * 4;
          img.data[k] = c[0]; img.data[k + 1] = c[1]; img.data[k + 2] = c[2]; img.data[k + 3] = 255;
        }
      });
    });
  }
  function drawMove(p, ctx, x0, y0, a, i, c, O6) {
    var img = ctx.createImageData(p.w, p.h);
    paintMove(img, p.w, p.h, x0, y0, a, i, PLAYER_STYLE[c % 4], bodyPal(O6, packPal()), packPal(), true);
    ctx.putImageData(img, 0, 0);
  }
  Art.MOVES = {};   // per move: frames, rate, and per frame where the rod's tip and the held item are (from your feet)
  Art.generatePlayerMoves = function (scene, c, outfits) {
    var M = LC.FOLK_MOVES; if (!M) return;
    var O6 = outfits[c || 0], pk = Art.plKey(c), style = PLAYER_STYLE[c % 4], ppal = packPal(), bpal = bodyPal(O6, ppal);
    Object.keys(M.anims).forEach(function (name) {
      var a = M.anims[name], b = moveBox(a), info = Art.MOVES[name] = { n: a.n, rate: MOVE_RATE[name] || 12, loop: !!MOVE_LOOP[name], tip: [], hold: [] };
      for (var i = 0; i < a.n; i++) (function (i) {
        Art.make(scene, pk + '_m_' + name + '_' + i, b.w, b.h, function (p, ctx) {
          var img = ctx.createImageData(b.w, b.h);
          var bp = bpal;
          if (NO_FX[name]) { bp = {}; Object.keys(bpal).forEach(function (k) { if (!NO_FX[name][k]) bp[k] = bpal[k]; }); }
          paintMove(img, b.w, b.h, b.x0, b.y0, a, i, style, bp, ppal, true, ARM_TOOLS[name] ? armPal(O6, ppal) : null);
          ctx.putImageData(img, 0, 0);
        });
        if (a.tools) {   // the rod's tip: the tool's right-most pixel
          var best = null;
          unpack(a.tools[i]).forEach(function (row, ry) { for (var rx = row.length - 1; rx >= 0; rx--) if (row[rx] !== '.') { if (!best || rx > best[0]) best = [rx, ry]; break; } });
          info.tip[i] = best ? [a.x + best[0] - 48 + 0.5, a.y + best[1] - 39 + 0.5] : [8, -14];
        }
        if (a.hold) info.hold[i] = [a.hold[i][0] - 48, a.hold[i][1] - 39];
      })(i);
    });
  };
  Art.createPlayerMoves = function (anims) {
    var M = LC.FOLK_MOVES; if (!M) return;
    for (var c = 0; c < 4; c++) {
      var pk = Art.plKey(c);
      Object.keys(M.anims).forEach(function (name) {
        var key = pk + '_m_' + name, info = Art.MOVES[name], fr = [];
        if (!info || anims.exists(key)) return;
        for (var i = 0; i < info.n; i++) fr.push({ key: key + '_' + i });
        anims.create({ key: key, frames: fr, frameRate: info.rate, repeat: info.loop ? -1 : 0 });
      });
      if (!anims.exists(pk + '_m_hold')) anims.create({ key: pk + '_m_hold', frames: [{ key: pk + '_m_carry_0' }], frameRate: 1, repeat: -1 });   // standing still with it
    }
  };
  // dir: down / up / side; f: 0 standing, 1 and 2 walking. Side on, the frames come from the pack (standing, two strides).
  Art.drawPlayerFolk = function (p, dir, f, c, outfits) {
    var O6 = outfits[c || 0], M = LC.FOLK_MOVES;
    if (dir === 'side' && M) {
      var a = f === 0 ? M.anims.idle : M.anims.walk;
      drawMove(p, p.ctx, 48 - p.w / 2, 39 - p.h, a, f === 0 ? 0 : f === 1 ? 3 : 7, c || 0, O6);
      return;
    }
    chibi(p, outfitLook(O6, c || 0), { dir: dir, step: f, headBob: 0 });
  };
  // ------------------------------------------------------------------ the chapters' own characters, redrawn
  // Art.make() looks here first: a key listed here is drawn by chibi() instead of its old picture, on the same canvas.
  var FOLK = Art.FOLK = {};
  function cast(keys, L, opts) {
    keys.forEach(function (k, i) { var o = opts[i] || {}; FOLK[k] = { draw: function (p) { chibi(p, L, o); } }; });
  }
  var STAND_BLINK = [{}, { blink: true }], WALK = [{ step: 1 }, { step: 2 }], SWAY = [{ f: 0 }, { f: 1 }];
  function line(p, g, x0, y0, x1, y1, c, t) { p.line(g.x + x0, g.y + y0, g.x + x1, g.y + y1, c, t); }
  function dot(p, g, a, b, c) { p.px(g.x + a, g.y + b, c); }
  function box(p, g, a, b, w, h, c) { p.rect(g.x + a, g.y + b, w, h, c); }
  // a long pole in the right hand (a spear, a pike, a staff)
  function pole(p, g, top, shaft, tip, tipC) {
    var X = g.hr + 1;
    line(p, g, X, top, X, 19, shaft);
    if (tip === 'blade') { box(p, g, X, top - 3, 1, 3, tipC); dot(p, g, X - 1, top - 2, tipC); dot(p, g, X + 1, top - 2, tipC); }
    if (tip === 'leaf') { box(p, g, X, top - 3, 1, 3, tipC); dot(p, g, X - 1, top - 1, tipC); dot(p, g, X + 1, top - 1, tipC); dot(p, g, X, top - 4, mix(tipC, '#ffffff', 0.5)); }
    if (tip === 'orb') { p.disc(g.x + X, g.y + top - 1, 1.6, tipC); dot(p, g, X, top - 2, mix(tipC, '#ffffff', 0.6)); }
    if (tip === 'trident') { box(p, g, X - 2, top - 1, 5, 1, tipC); box(p, g, X - 2, top - 3, 1, 2, tipC); box(p, g, X + 2, top - 3, 1, 2, tipC); box(p, g, X, top - 4, 1, 3, tipC); }
    if (tip === 'glow') { dot(p, g, X, top - 1, tipC); }
  }
  function longHair(p, g, c, rows) { box(p, g, 2, g.sT, 1, rows, c); box(p, g, 13, g.sT, 1, rows, c); }

  // Ani at her stall: a teal tudung and a batik kain
  cast(['npc_ani_0', 'npc_ani_1'], { skin: '#c48a5c', shirt: '#2a9d8f', shirt2: '#1f7a70', bottom: '#e9c46a', bottom2: '#d9a73a', hat: 'tudung', hatColor: '#2a9d8f', dress: true,
    extra: function (p, g) { dot(p, g, 5, 17, '#c2453b'); dot(p, g, 8, 17, '#c2453b'); dot(p, g, 10, 17, '#c2453b'); dot(p, g, 6, 18, '#c2453b'); dot(p, g, 9, 18, '#c2453b'); } }, STAND_BLINK);
  // Badang, the skinny farmhand (a patched singlet, a checked kain, a faded semutar)
  cast(['npc_badang_0', 'npc_badang_1'], { skin: '#a8714a', hair: '#1a1210', style: 'short', shirt: '#d8cfb8', shirt2: '#b8ae96', bottom: '#5a6a8a', bottom2: '#46546e', hat: 'semutar', hatColor: '#8a3a2a', shoes: '#8e5c3a',
    extra: function (p, g) { box(p, g, 9, 16, 2, 1, '#a89a78'); dot(p, g, 7, 17, '#46546e'); dot(p, g, 9, 18, '#46546e'); } }, STAND_BLINK);
  // Badang the Strong: an open vest, a red sash, a batik kain, a red tanjak, arms like jackfruit
  cast(['npc_badangK_0', 'npc_badangK_1'], { build: 'broad', skin: '#a8714a', hair: '#1a1210', style: 'short', shirt: '#3a2a20', shirt2: '#2a1e16', chest: '#a8714a', bottom: '#2f6a4a', bottom2: '#245438', belt: '#b8322a', hat: 'tanjak_red', moustache: '#3a2418', brows: '#2a1a10', shoes: '#4a3020',
    extra: function (p, g) {
      for (var yy = g.sT; yy < g.sE; yy++) { dot(p, g, g.hl, yy, '#a8714a'); dot(p, g, g.hr, yy, '#8a5634'); }
      dot(p, g, g.hl - 1, g.sT + 1, '#a8714a'); dot(p, g, g.hr + 1, g.sT + 1, '#8a5634');   // big arms
      [[5, 17], [8, 18], [11, 17], [6, 19], [10, 19]].forEach(function (c) { dot(p, g, c[0], c[1], '#e9c46a'); });
    } }, STAND_BLINK);
  // the foreign askar: a steel morion, a breastplate, red puffed sleeves and a long pike
  cast(['askar_0', 'askar_1'], { build: 'tall', skin: '#e0b090', hair: '#5a3a1e', style: 'short', shirt: '#c0cbdc', shirt2: '#8b9bb4', sleeve: '#a8322a', bottom: '#3a3a4a', bottom2: '#2a2a36', shoes: '#2a1e14', hat: 'morion', moustache: '#5a3a1e',
    extra: function (p, g) { dot(p, g, g.hl, g.sT, '#e9c46a'); dot(p, g, g.hr, g.sT, '#e9c46a'); box(p, g, 6, g.sT + 1, 1, 1, '#ffffff'); pole(p, g, -3, '#6b4423', 'blade', '#c0cbdc'); } }, WALK);
  // the prajurit: a red headcloth, a bare chest with a red-and-white sash, a white kain, a shield and a spear
  cast(['prajurit_0', 'prajurit_1'], { build: 'tall', skin: '#a8714a', hair: '#1a1210', style: 'short', shirt: '#a8714a', shirt2: '#8e5c3a', sash: '#b8322a', bottom: '#f2ead8', bottom2: '#d8cdb4', belt: '#b8322a', hat: 'semutar', hatColor: '#7a1e1a', shoes: '#8e5c3a',
    extra: function (p, g) {
      line(p, g, g.b0 + 1, g.sT, g.b1, g.sE, '#f2ead8');
      pole(p, g, -2, '#6b4423', 'leaf', '#c0cbdc');
      p.disc(g.x + g.hl - 1, g.y + g.sE, 3, '#8a5a2b'); p.disc(g.x + g.hl - 1, g.y + g.sE, 1.3, '#e9c46a');
    } }, WALK);
  // Laksamana: a golden tengkolok, armlets, a red and gold kain, a dark red cape, a kris at his belt
  cast(['laksamana_0', 'laksamana_1'], { build: 'broad', skin: '#9a6440', hair: '#1a1210', style: 'short', shirt: '#9a6440', shirt2: '#82522f', armlet: '#e9c46a', bottom: '#b8322a', bottom2: '#8a1e1a', belt: '#e9c46a', cape: '#5a1414', hat: 'headdress', moustache: '#3a2010', shoes: '#4a2a18',
    extra: function (p, g) {
      line(p, g, g.b1 - 1, g.lT, g.b1 + 2, g.lT + 3, '#5a3a1e'); box(p, g, g.b1 - 1, g.lT - 1, 2, 1, '#e9c46a');
      [[6, 17], [9, 18], [11, 17]].forEach(function (c) { dot(p, g, c[0], c[1], '#e9c46a'); });
    } }, WALK);
  // Mak Lampir: wild white hair, a ragged black kebaya, green glowing eyes, a crooked stick with a violet stone
  var LAMPIR = { build: 'tall', skin: '#a88a6a', hair: '#ecebe4', style: 'witch', shirt: '#2a2a24', shirt2: '#1e1e1a', robe: true, bottom: '#2a2a24', bottom2: '#1e1e1a', eye: '#b8ff9a', noBlush: true, brows: '#3a2a1a',
    extra: function (p, g) {
      box(p, g, 6, 13 + g.hb, 4, 1, '#4a2a20'); dot(p, g, 7, 13 + g.hb, '#f0e8d0');   // a grin with one tooth
      dot(p, g, 5, 15, '#3e3a30'); dot(p, g, 9, 17, '#3e3a30'); dot(p, g, 6, 19, '#1e1e1a'); dot(p, g, 10, 19, '#1e1e1a');   // rags
      var s = g.f; line(p, g, g.hr + 1, g.top - 1 - s, g.hr + 2, 19, '#5a3a20'); line(p, g, g.hr, g.top - 1 - s, g.hr + 2, g.top - 2 - s, '#5a3a20');
      p.disc(g.x + g.hr + 1, g.y + g.top - 3 - s, 1.6, '#9a5aff'); dot(p, g, g.hr + 1, g.top - 3 - s, '#e8d0ff');
    } };
  cast(['maklampir_0', 'maklampir_1', 'lampir6_0', 'lampir6_1'], LAMPIR, [{ f: 0 }, { f: 1 }, { f: 0 }, { f: 1 }]);
  // Sang Bualang, the wind: pale, hair blown sideways, a long blue sash streaming behind
  function bualang(big) {
    return { build: big ? 'tall' : null, skin: '#e8dcd0', hair: '#c8d8f0', style: 'spiky', shirt: '#d8ecff', shirt2: '#9ac0e8', bottom: '#3a4a6a', bottom2: '#2a3a5a', shoes: '#6a7a9a', belt: '#5a8ad8', eye: '#2a3a6a',
      extra: function (p, g) {
        dot(p, g, 14, 6 + g.hb, '#c8d8f0'); dot(p, g, 14, 7 + g.hb, '#8aa8d8'); dot(p, g, 15, 7 + g.hb, '#c8d8f0');
        if (g.f) { line(p, g, g.b1 + 1, g.lT, g.b1 + 4, g.lT - 2, '#5a8ad8'); dot(p, g, g.b1 + 5, g.lT - 3, '#8ab8ff'); }
        else { line(p, g, g.b1 + 1, g.lT, g.b1 + 4, g.lT + 1, '#5a8ad8'); dot(p, g, g.b1 + 5, g.lT + 2, '#8ab8ff'); }
      } };
  }
  cast(['npc_bualang_0', 'npc_bualang_1'], bualang(false), SWAY);
  cast(['bualang7_0', 'bualang7_1'], bualang(true), SWAY);
  // Belalang: a barefoot boy in a grasshopper-green baju, with a woven grasshopper on a stick
  cast(['npc_belalang_0', 'npc_belalang_1'], { skin: '#a8714a', hair: '#1a1210', style: 'spiky', shirt: '#5aa83e', shirt2: '#4a8a32', bottom: '#7a5a3a', bottom2: '#5a4228', shoes: '#8e5c3a',
    extra: function (p, g) { line(p, g, 12, 16, 14, 12, '#d8d070'); dot(p, g, 14, 11, '#a8b048'); dot(p, g, 15, 11, '#a8b048'); } }, STAND_BLINK);
  // the Kerengga gang: black clothes and masks; their leader in a red headcloth with a cudgel
  cast(['pencuri10_0', 'pencuri10_1'], { skin: '#9a6440', shirt: '#22202a', shirt2: '#18161e', bottom: '#3a3644', bottom2: '#2a2832', belt: '#5a1e1e', hat: 'ninja', shoes: '#18161e', noBlush: true,
    extra: function (p, g) { line(p, g, g.hr + 1, g.top + 1 + g.step % 2, g.hr + 1, 18, '#8a6a3a'); } }, WALK);
  cast(['ketua10_0', 'ketua10_1'], { build: 'broad', skin: '#8a5a38', hair: '#1a1210', style: 'short', shirt: '#22202a', shirt2: '#18161e', bottom: '#3a3644', bottom2: '#2a2832', belt: '#a8322a', hat: 'semutar', hatColor: '#b8322a', brows: '#1a1210', noBlush: true, shoes: '#18161e',
    extra: function (p, g) {
      box(p, g, 3, 13 + g.hb, 10, 1, '#22202a'); box(p, g, 4, 14 + g.hb, 8, 1, '#22202a');   // a black cloth over his mouth
      line(p, g, g.hr + 2, g.top + 2, g.hr + 1, 18, '#7a4b28', 2); p.ell(g.x + g.hr + 2, g.y + g.top + 2, 1.6, 2.2, '#5a3a1e');
    } }, WALK);
  // the Capitán: a morion, a red doublet under a breastplate, a white collar, a gold sash and a rapier
  cast(['kapten11_0', 'kapten11_1'], { build: 'tall', skin: '#e0b08a', hair: '#3a2418', style: 'short', shirt: '#9a9aa8', shirt2: '#a82a2a', sleeve: '#a82a2a', bottom: '#1e1a1a', bottom2: '#141010', shoes: '#141010', belt: '#e9c46a', hat: 'morion', beard: '#3a2418',
    extra: function (p, g) { box(p, g, g.b0 + 1, g.sT, 4, 1, '#f2ece0'); line(p, g, g.hr + 1, g.sE, g.hr + 4, 19, '#d8d8e4'); box(p, g, g.hr, g.sE - 1, 2, 1, '#e9c46a'); } }, WALK);
  // Jack, the storm captain: a red bandana, a teal coat, a red sash, a gold earring and a cutlass
  cast(['npc_jack12_0', 'npc_jack12_1'], { build: 'tall', skin: '#b97952', hair: '#39252a', style: 'loose', shirt: '#d2aa68', shirt2: '#b08a50', coat: '#28575a', bottom: '#28575a', bottom2: '#1e4446', sash: '#973942', hat: 'bandana', hatColor: '#a04447', shoes: '#291d23',
    extra: function (p, g) { dot(p, g, 12, 13 + g.hb, '#efca72'); line(p, g, g.hl - 1, g.sE, g.hl - 4, g.sE - 5 - g.f, '#ccb494'); dot(p, g, g.hl, g.sE + 1, '#553a31'); } }, SWAY);
  // the sorcerer of Chapter 13, and the masked Collector
  function sorcerer(masked) {
    var robe = masked ? '#382849' : '#354b78', trim = masked ? '#db79ac' : '#e8b66e';
    return { build: 'tall', skin: masked ? '#e3b8ce' : '#c58c6a', shirt: robe, shirt2: '#261f38', robe: true, bottom: robe, bottom2: '#261f38', trim: trim, hat: 'hood', hatColor: robe, sash: trim, noBlush: masked, eye: masked ? '#352a40' : null,
      extra: function (p, g) { pole(p, g, g.top + 2 - g.f, '#926646', 'glow', '#f9e1b4'); } };
  }
  cast(['suraya13_0', 'suraya13_1', 'npc_suraya13_0', 'npc_suraya13_1'], sorcerer(false), [{ f: 0 }, { f: 1 }, { f: 0 }, { f: 1 }]);
  cast(['collector13_0', 'collector13_1'], sorcerer(true), SWAY);
  // the sea folk: Nila the pearl diver and Nerissa the scholar (mermaids), the mermen guards
  cast(['npc_nila_0', 'npc_nila_1'], { skin: '#c9905e', hair: '#1e140e', style: 'loose', shirt: '#e86a8a', shirt2: '#c04a6a', tail: '#2fa8a0', tail2: '#7fe8d8',
    extra: function (p, g) { dot(p, g, 12, 5 + g.hb, '#ffe0f0'); dot(p, g, 13, 5 + g.hb, '#ffffff'); } }, STAND_BLINK);
  cast(['npc_nerissa_0', 'npc_nerissa_1'], { skin: '#e2b48a', hair: '#c8a040', style: 'loose', shirt: '#f0f0e8', shirt2: '#d0d0c8', tail: '#5a6ad8', tail2: '#b8c8ff',
    extra: function (p, g) { box(p, g, g.hr + 1, g.sE - 1, 3, 3, '#e8dcb0'); box(p, g, g.hr + 1, g.sE - 1, 1, 3, '#c8b890'); dot(p, g, 8, 5 + g.hb, '#7fd8f0'); } }, STAND_BLINK);
  function merman(thrust) {
    return { skin: '#c48a5c', hair: '#1a1210', style: 'short', shirt: '#2a7a5a', shirt2: '#1e5a42', belt: '#e9c46a', tail: '#2fa880', tail2: '#3fc8a0', hat: 'helmet', hatColor: '#2a7a5a', crest: '#e9c46a',
      extra: function (p, g) {
        if (!thrust) pole(p, g, -1 + g.top, '#e8607a', 'leaf', '#f08a9a');
        else { line(p, g, 2, g.sE, 15, g.sE, '#e8607a'); dot(p, g, 16, g.sE, '#f08a9a'); dot(p, g, 15, g.sE - 1, '#f08a9a'); dot(p, g, 15, g.sE + 1, '#f08a9a'); }
      } };
  }
  cast(['penjaga_laut'], merman(false), [{}]);
  cast(['laskar8_0', 'laskar8_1'], merman(false), SWAY);
  FOLK.laskar8_1 = { draw: function (p) { chibi(p, merman(true), { f: 1 }); } };
  cast(['hoplit8_0', 'hoplit8_1'], { skin: '#d6a77a', hair: '#5a3a20', style: 'short', shirt: '#ece8e0', shirt2: '#c8c4bc', belt: '#c8a040', tail: '#3a6ab0', tail2: '#5a8ad8', hat: 'helmet', hatColor: '#c8a040', crest: '#c83a3a',
    extra: function (p, g) {
      line(p, g, g.hl - 1, g.top, g.hl - 1, 19, '#a08060'); box(p, g, g.hl - 3, g.top - 1, 5, 1, '#c8a040'); box(p, g, g.hl - 3, g.top - 3, 1, 2, '#c8a040'); box(p, g, g.hl + 1, g.top - 3, 1, 2, '#c8a040'); dot(p, g, g.hl - 1, g.top - 3, '#c8a040');
      var sx = g.hr + (g.f ? 2 : 1); p.disc(g.x + sx, g.y + g.sE, 3, '#c8a040'); p.disc(g.x + sx, g.y + g.sE, 1.8, '#e0b850'); dot(p, g, sx, g.sE, '#8a6a2a');
    } }, SWAY);
  // the deep-sea folk: Si Tanggang's ghost, the Queen of the Southern Sea, Dayang Sekar, Poseidon
  cast(['npc_tanggang_0', 'npc_tanggang_1'], { skin: '#d2ebff', hair: '#5a7aa0', style: 'short', shirt: '#aadcff', shirt2: '#78b4e6', float: true, bottom: '#9ac8f0', bottom2: '#78a8d8', hat: 'captain', hatColor: '#3c5a8c', eye: '#2a4a6a', noBlush: true, outline: '#5a8ab8', alpha: 0.86,
    extra: function (p, g) { box(p, g, 7, g.sT, 2, g.sE - g.sT + 1, '#f0dc96'); } }, STAND_BLINK);
  cast(['npc_ratukidul_0', 'npc_ratukidul_1'], { build: 'tall', skin: '#d6a77a', hair: '#1a1210', style: 'loose', shirt: '#2aa86a', shirt2: '#1e8a5a', robe: true, bottom: '#2aa86a', bottom2: '#1e8a5a', robeDots: '#e9c46a', trim: '#e9c46a', hat: 'crown', jewel: '#7affc8',
    extra: function (p, g) { longHair(p, g, '#2a1a20', 5); box(p, g, g.b0, g.sT, g.b1 - g.b0 + 1, 1, '#e9c46a'); } }, STAND_BLINK);
  cast(['npc_sekar_0', 'npc_sekar_1'], { skin: '#d6a77a', hair: '#1a1210', style: 'loose', shirt: '#2a8a5a', shirt2: '#1e6a44', dress: true, bottom: '#3fb07a', bottom2: '#2a8a5a', hat: 'flower',
    extra: function (p, g) { box(p, g, 4, g.lT, 8, 1, '#e9c46a'); } }, STAND_BLINK);
  cast(['npc_poseidon_0', 'npc_poseidon_1'], { build: 'broad', skin: '#c8946a', hair: '#f0f0f5', style: 'loose', beard: '#f0f0f5', longBeard: true, shirt: '#2a6a9a', shirt2: '#1e4e74', robe: true, bottom: '#3a8aba', bottom2: '#2a6a9a', sash: '#e9c46a', trim: '#e9c46a', hat: 'crown', eye: '#1a2a3a',
    extra: function (p, g) { pole(p, g, g.top - 2, '#e9c46a', 'trident', '#f2d06b'); } }, STAND_BLINK);
  // Mak Deruma, the ghost of a mother still waiting, in her pink selendang
  cast(['npc_deruma_0', 'npc_deruma_1'], { skin: '#fae4cd', shirt: '#ffecd2', shirt2: '#e8c8aa', float: true, bottom: '#e8c8aa', bottom2: '#d8b090', hat: 'tudung', hatColor: '#dc96b4', eye: '#6a4a3a', outline: '#c8a080', alpha: 0.88 }, STAND_BLINK);
  // the seven sea princesses (their hems fade into the water)
  function puteri(o) {
    return { build: 'tall', skin: o.skin, hair: o.hair, style: 'loose', shirt: o.dress, shirt2: mix(o.dress, O, 0.2), robe: true, bottom: o.dress, bottom2: mix(o.dress, O, 0.2), trim: o.trim, eye: o.eye, eyeWide: o.wild, noBlush: !o.calm, outline: o.out,
      hat: o.crown ? 'crown' : o.flower ? 'flower' : null, hatColor: '#e85a6a', jewel: '#ffffff',
      extra: function (p, g) {
        longHair(p, g, mix(o.hair, '#3a4a5a', 0.2), o.long || 5);
        if (o.wild) {   // her hair lifting like smoke, her arms reaching
          for (var i = 0; i < 5; i++) line(p, g, 8, 5 + g.hb, 1 + i * 3 + (g.f ? 1 : 0), 1 + g.hb - (i % 2) * 2, o.hair);
          line(p, g, g.hl, g.sT + 1, g.hl - 4, g.sT - 1 + g.f, o.skin); line(p, g, g.hr, g.sT + 1, g.hr + 4, g.sT - 1 - g.f, o.skin);
        }
      } };
  }
  cast(['puteri9_0', 'puteri9_1'], puteri({ skin: '#d8e4e0', hair: '#0e1418', dress: '#8ab8b0', trim: '#c8e8e0', eye: '#9affff', out: '#0a1a20' }), [{ fade: 4 }, { fade: 4, f: 1 }]);
  cast(['npc_puteri_bongsu_0', 'npc_puteri_bongsu_1'], puteri({ skin: '#e8e0d8', hair: '#1a1a22', dress: '#a8d8e8', trim: '#ffffff', eye: '#2a3a4a', calm: true, flower: true, out: '#14242c' }), [{ fade: 3 }, { fade: 3, f: 1 }]);
  cast(['bongsu9w_0', 'bongsu9w_1'], puteri({ skin: '#c8d8d8', hair: '#06080a', dress: '#6a9aa8', trim: '#c8e8e0', eye: '#ffffff', wild: true, out: '#04080a' }), [{ fade: 4 }, { fade: 4, f: 1 }]);
  cast(['sulung9_0', 'sulung9_1'], puteri({ skin: '#e8dcd0', hair: '#0e1418', dress: '#2a8a8a', trim: '#f2c94c', eye: '#2a3a4a', calm: true, crown: true, long: 6, out: '#06201e' }), [{ fade: 5 }, { fade: 5, f: 1 }]);
  // Pak Awang, waist-deep in the black sea: from behind, or with his head turned and white eyes
  function sea(p) { p.rect(0, 15, p.w, 5, '#0a1a24'); p.line(0, 15, p.w - 1, 15, '#5a8aa0'); p.px(2, 16, '#3a6a80'); p.px(13, 17, '#3a6a80'); }
  var AWANG = { skin: '#a8a898', hair: '#1a1210', style: 'short', shirt: '#2a4a6a', shirt2: '#1e3a54', bottom: '#2a3a5a', noBlush: true, eye: '#ffffff' };
  FOLK.awang_laut9_0 = { draw: function (p) { chibi(p, AWANG, { dir: 'up', after: sea }); } };
  FOLK.awang_laut9_1 = { draw: function (p) { chibi(p, AWANG, { after: sea }); } };
  // fishermen asleep on the beach, from behind
  [['#4a6a8a', '#6a2a3a'], ['#8a6a4a', '#2a3a6a'], ['#5a7a5a', '#4a4a2a']].forEach(function (c, v) {
    cast(['tidur9_' + v], { build: 'tall', skin: '#b8a898', hair: '#1a1210', style: 'short', shirt: c[0], bottom: c[1], hat: v === 1 ? 'semutar' : null, hatColor: '#c8b070', shoes: '#5a4a3a' }, [{ dir: 'up' }]);
  });
  // Pak Awang lying on a woven mat, cold and still (a figure turned on its side)
  FOLK.awang_tidur = { draw: function (p) {
    p.rect(1, 5, 30, 8, '#c8a878'); for (var x = 2; x < 31; x += 3) p.line(x, 5, x, 12, '#a8885a'); p.line(1, 8, 30, 8, '#a8885a');
    var c = document.createElement('canvas'); c.width = 16; c.height = 20;
    var q = new Art.Painter(c.getContext('2d', { willReadFrequently: true }), 16, 20, 5);
    chibi(q, { skin: '#a8b0a0', hair: '#1a1210', style: 'short', shirt: '#2a4a7a', bottom: '#2a4a7a', noBlush: true }, { blink: true });
    p.ctx.save(); p.ctx.translate(1, 15); p.ctx.rotate(-Math.PI / 2); p.ctx.drawImage(c, 0, 0); p.ctx.restore();
    p.rect(15, 3, 13, 9, '#2a4a7a'); for (x = 16; x < 28; x += 3) p.line(x, 3, x, 11, '#c83a3a'); p.line(15, 7, 27, 7, '#1e2a4a');
    p.outline(O);
  } };
  // the Bunian keeper of the trials: a wide green hat, a white beard, a staff
  cast(['bunian_trial_keeper'], { build: 'tall', skin: '#b98565', hair: '#e7d7b5', style: 'bald', beard: '#e7d7b5', shirt: '#435766', shirt2: '#33434e', robe: true, bottom: '#435766', bottom2: '#33434e', belt: '#cf9d65', hat: 'bunian', hatColor: '#436b64',
    extra: function (p, g) { pole(p, g, g.top, '#805a49', 'glow', '#e8d79c'); } }, [{}]);
  // the Pontianak: a white dress fraying into wisps, black hair down past her knees, red eyes, no feet
  var PONTI = { build: 'tall', skin: '#e8e4dc', hair: '#0e0a0c', style: 'loose', shirt: '#ece8e0', shirt2: '#c8c2b8', float: true, bottom: '#ece8e0', bottom2: '#c8c2b8', eye: '#ff2a3a', noBlush: true, outline: '#05030a',
    extra: function (p, g) {
      var s = g.f === 1 ? 1 : g.f === 2 ? -1 : 0;
      box(p, g, 1, 8 + g.hb, 2, 12, '#0e0a0c'); box(p, g, 13, 8 + g.hb, 2, 12, '#0e0a0c'); dot(p, g, 1 + s, 19, '#0e0a0c'); dot(p, g, 14 + s, 19, '#0e0a0c');   // hair to her knees
      box(p, g, 7, 8 + g.hb, 1, 4, '#0e0a0c');                                                                                                                     // a strand over her face
      dot(p, g, g.hl - 1, g.sE + 1, '#e8e4dc'); dot(p, g, g.hr + 1, g.sE + 1, '#e8e4dc');                                                                       // long pale fingers
    } };
  cast(['pontianak19_0', 'pontianak19_w1', 'pontianak19_w2'], PONTI, [{ f: 0 }, { f: 1 }, { f: 2 }]);
  // the spirit friends: a Bunian in a leaf-green hood, and the Nuno (an old man of the anthill)
  cast(['sp_bunian'], { skin: '#e2b48a', shirt: '#6aa84f', shirt2: '#4f8a3a', bottom: '#4f8a3a', bottom2: '#3a6a2a', hat: 'hood', hatColor: '#3f8a3a', trim: '#9be15d', shoes: '#4a3020', noBlush: false }, [{}]);
  FOLK.sp_nuno = { draw: function (p) {
    p.ell(13, 22, 12, 3.6, '#b8582f'); p.ell(13, 21, 10, 2.6, '#d27040');   // the punso (his anthill)
    chibi(p, { skin: '#c99060', hair: '#f5f5f0', style: 'bald', beard: '#f5f5f0', longBeard: true, shirt: '#8a5a2b', shirt2: '#6b4423', robe: true, bottom: '#8a5a2b', bottom2: '#6b4423', brows: '#f5f5f0', hat: 'semutar', hatColor: '#6b4423',
      extra: function (p, g) { pole(p, g, g.top + 1, '#6b4423', 'glow', '#8a5a2b'); } }, { dy: -3 });
  } };
})(window.LC);
