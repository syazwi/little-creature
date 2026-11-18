/* Little Creature — procedural pixel-art generator.
 * Every texture in the game is painted here at boot, so the game ships with zero image files.
 * To swap in a real asset pack later, just load PNGs under the same texture keys in Boot. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art = {};
  var OUT = '#2a1d18';

  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function hexRgb(h) {
    h = h.replace('#', '');
    return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)];
  }
  function canvas(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

  // ------------------------------------------------------------------ painter
  function P(ctx, w, h, seed) { this.ctx = ctx; this.w = w; this.h = h; this.r = rng(seed || 7); }
  P.prototype.ri = function (n) { return Math.floor(this.r() * n); };
  P.prototype.px = function (x, y, c) { if (!c) return; this.ctx.fillStyle = c; this.ctx.fillRect(Math.round(x), Math.round(y), 1, 1); };
  P.prototype.rect = function (x, y, w, h, c) {
    this.ctx.fillStyle = c; this.ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
  };
  P.prototype.clear = function (x, y, w, h) { this.ctx.clearRect(x, y, w, h); };
  P.prototype.ell = function (cx, cy, rx, ry, c) {
    this.ctx.fillStyle = c;
    for (var y = Math.floor(cy - ry - 1); y <= Math.ceil(cy + ry); y++)
      for (var x = Math.floor(cx - rx - 1); x <= Math.ceil(cx + rx); x++) {
        var dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry;
        if (dx * dx + dy * dy <= 1) this.ctx.fillRect(x, y, 1, 1);
      }
  };
  P.prototype.disc = function (cx, cy, r, c) { this.ell(cx, cy, r, r, c); };
  P.prototype.line = function (x0, y0, x1, y1, c, t) {
    t = t || 1; x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    var dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, err = dx + dy;
    this.ctx.fillStyle = c;
    for (var i = 0; i < 400; i++) {
      this.ctx.fillRect(x0 - Math.floor((t - 1) / 2), y0 - Math.floor((t - 1) / 2), t, t);
      if (x0 === x1 && y0 === y1) break;
      var e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  };
  P.prototype.poly = function (pts, c) {
    var minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
    pts.forEach(function (p) { minX = Math.min(minX, p[0]); maxX = Math.max(maxX, p[0]); minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]); });
    this.ctx.fillStyle = c;
    for (var y = Math.floor(minY); y <= Math.ceil(maxY); y++)
      for (var x = Math.floor(minX); x <= Math.ceil(maxX); x++) {
        var px = x + 0.5, py = y + 0.5, inside = false;
        for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) {
          var xi = pts[i][0], yi = pts[i][1], xj = pts[j][0], yj = pts[j][1];
          if (((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) inside = !inside;
        }
        if (inside) this.ctx.fillRect(x, y, 1, 1);
      }
  };
  P.prototype.speck = function (x, y, w, h, c, n) { for (var i = 0; i < n; i++) this.px(x + this.ri(w), y + this.ri(h), c); };
  P.prototype.outline = function (color, thr) {
    thr = thr === undefined ? 128 : thr;
    var img = this.ctx.getImageData(0, 0, this.w, this.h), d = img.data, o = new Uint8ClampedArray(d), w = this.w, h = this.h;
    var rgb = hexRgb(color);
    function a(x, y) { return (x < 0 || y < 0 || x >= w || y >= h) ? 0 : d[(y * w + x) * 4 + 3]; }
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      var i = (y * w + x) * 4;
      if (d[i + 3] < thr && (a(x - 1, y) >= thr || a(x + 1, y) >= thr || a(x, y - 1) >= thr || a(x, y + 1) >= thr)) {
        o[i] = rgb[0]; o[i + 1] = rgb[1]; o[i + 2] = rgb[2]; o[i + 3] = 255;
      }
    }
    this.ctx.putImageData(new ImageData(o, w, h), 0, 0);
  };
  // pixel-string sprite: rows of chars mapped through a palette ('.' = clear)
  P.prototype.str = function (rows, pal, ox, oy) {
    var self = this;
    rows.forEach(function (row, y) { for (var x = 0; x < row.length; x++) { var c = pal[row[x]]; if (c) self.px((ox || 0) + x, (oy || 0) + y, c); } });
  };

  var seedCounter = 1000;
  function make(scene, key, w, h, fn, outline) {
    var c = canvas(w, h), ctx = c.getContext('2d', { willReadFrequently: true });
    var p = new P(ctx, w, h, seedCounter += 37);
    fn(p, ctx);
    if (outline) p.outline(outline === true ? OUT : outline);
    if (scene.textures.exists(key)) scene.textures.remove(key);
    scene.textures.addCanvas(key, c);
    return c;
  }
  Art.make = make;
  // texture / animation key prefixes for player outfit c (0 keeps the original single-player keys)
  Art.plKey = function (c) { return c ? 'pl' + c : 'pl'; };
  Art.walkKey = function (c) { return c ? 'walk' + c : 'walk'; };

  // ================================================================== TILES
  var GR = { base: '#5f9f3f', dark: '#518d35', light: '#6fb24b', tuft: '#7cc257', sh: '#467c2e' };
  function grass(p, v) {
    p.rect(0, 0, 16, 16, GR.base);
    p.speck(0, 0, 16, 16, GR.dark, 20);
    p.speck(0, 0, 16, 16, GR.light, 12);
    for (var i = 0; i < 3; i++) { var x = 1 + p.ri(14), y = 3 + p.ri(12); p.px(x, y, GR.tuft); p.px(x, y - 1, GR.tuft); p.px(x + 1, y, GR.sh); }
    if (v === 2) {
      var cols = ['#fff6d5', '#f7d34a', '#f49ac1'];
      for (i = 0; i < 3; i++) {
        var fx = 2 + p.ri(12), fy = 2 + p.ri(12), c = cols[i % 3];
        p.px(fx - 1, fy, c); p.px(fx + 1, fy, c); p.px(fx, fy - 1, c); p.px(fx, fy + 1, c); p.px(fx, fy, '#e8a23a');
      }
    }
    if (v === 3) {
      for (i = 0; i < 6; i++) { var gx = 4 + i * 1.5, top = 6 + p.ri(4); p.line(gx, 13, gx + (i - 2.5) * 0.6, top, i % 2 ? GR.tuft : GR.sh); }
    }
  }
  function pathT(p) {
    p.rect(0, 0, 16, 16, '#c9a46b'); p.speck(0, 0, 16, 16, '#b8925a', 22); p.speck(0, 0, 16, 16, '#dab884', 14);
    for (var i = 0; i < 2; i++) { var x = 1 + p.ri(13), y = 1 + p.ri(14); p.px(x, y, '#9c7c4c'); p.px(x + 1, y, '#a8885a'); }
  }
  function field(p) {
    p.rect(0, 0, 16, 16, '#a77848'); p.speck(0, 0, 16, 16, '#93663b', 24); p.speck(0, 0, 16, 16, '#b88a58', 12);
    p.px(3, 4, '#6aa04a'); p.px(3, 3, '#6aa04a'); p.px(11, 12, '#6aa04a');
  }
  function tilled(p, wet) {
    var base = wet ? '#57371f' : '#7b5030', dk = wet ? '#3d2614' : '#5c3a1f', hl = wet ? '#6c472a' : '#946640';
    p.rect(0, 0, 16, 16, base);
    [2, 6, 10, 14].forEach(function (y) { p.rect(0, y, 16, 1, dk); p.rect(0, y - 1, 16, 1, hl); });
    p.speck(0, 0, 16, 16, wet ? '#4a2e19' : '#6a4428', 10);
    if (wet) p.speck(0, 0, 16, 16, '#6a7a8c', 4);
  }
  function paddy(p, f) {
    p.rect(0, 0, 16, 16, '#5f8f7e'); p.speck(0, 0, 16, 16, '#517f6f', 16); p.speck(0, 0, 16, 16, '#6c9c8a', 8);
    for (var i = 0; i < 3; i++) { var x = (3 + i * 5 + f * 4) % 13, y = 2 + i * 5 + f; p.rect(x, y, 3, 1, '#8cc0ae'); }
  }
  function bund(p) {
    p.rect(0, 0, 16, 16, '#9b7444'); p.speck(0, 0, 16, 16, '#6aa04a', 30); p.speck(0, 0, 16, 16, '#86653a', 12); p.speck(0, 0, 16, 16, '#7cb257', 10);
  }
  function river(p, f) {
    p.rect(0, 0, 16, 16, '#3a7cae'); p.speck(0, 0, 16, 16, '#336fa0', 20);
    for (var i = 0; i < 4; i++) {
      var x = (i * 5 + f * 3 + (i % 2) * 7) % 14, y = 1 + i * 4;
      p.rect(x, y, 3, 1, '#6fb2dc'); p.rect((x + 7) % 14, y + 2, 2, 1, '#2e6693');
    }
  }
  function shore(p, f) {
    river(p, f);
    p.rect(0, 0, 16, 3, '#cdb37e'); p.speck(0, 0, 16, 3, '#bfa36c', 6);
    for (var x = 0; x < 16; x++) { var y = 3 + ((x + f * 2) % 5 === 0 ? 1 : 0); p.px(x, y, '#e4f3f7'); if ((x + f) % 3 === 0) p.px(x, y + 1, '#a9d6ea'); }
  }
  function sand(p) {
    p.rect(0, 0, 16, 16, '#e0c48d'); p.speck(0, 0, 16, 16, '#cfae76', 20); p.speck(0, 0, 16, 16, '#eed7a5', 12); p.px(4 + p.ri(8), 3 + p.ri(10), '#f5efe2');
  }
  function jetty(p) {
    p.rect(0, 0, 16, 16, '#8c5c31');
    for (var y = 0; y < 16; y += 4) { p.rect(0, y, 16, 1, '#5e3a1d'); p.rect(0, y + 1, 16, 1, '#a26f3f'); p.px(2, y + 2, '#3a2412'); p.px(13, y + 2, '#3a2412'); }
    p.rect(0, 0, 1, 16, '#5e3a1d'); p.rect(15, 0, 1, 16, '#5e3a1d');
  }
  function jungle(p) {
    p.rect(0, 0, 16, 16, '#2d5a29'); p.speck(0, 0, 16, 16, '#1f401c', 12);
    var cols = ['#3a7234', '#2a5226', '#47863d'];
    for (var i = 0; i < 7; i++) p.disc(p.ri(16), p.ri(16), 2.5 + p.r() * 2, cols[i % 3]);
    p.speck(0, 0, 16, 16, '#5a9a4a', 8);
  }
  var BAM = '#d4c06a', BAM2 = '#b9a24e', BAM3 = '#9c8a3a';
  function fenceH(p) {
    grass(p, 0);
    p.rect(0, 9, 16, 4, GR.sh);
    p.rect(0, 6, 16, 2, BAM); p.rect(0, 10, 16, 2, BAM); p.px(7, 6, BAM3); p.px(7, 10, BAM3); p.rect(0, 7, 16, 1, BAM2); p.rect(0, 11, 16, 1, BAM2);
    [1, 13].forEach(function (x) { p.rect(x, 3, 2, 11, BAM2); p.rect(x + 1, 3, 1, 11, BAM3); p.rect(x, 3, 2, 1, BAM); });
  }
  function fenceV(p) {
    grass(p, 0);
    p.rect(9, 0, 2, 16, GR.sh);
    p.rect(7, 0, 2, 16, BAM); p.rect(8, 0, 1, 16, BAM2); p.rect(7, 5, 2, 1, BAM3); p.rect(7, 12, 2, 1, BAM3);
  }
  function fenceC(p) {
    grass(p, 0);
    p.rect(0, 6, 16, 2, BAM); p.rect(0, 10, 16, 2, BAM); p.rect(0, 7, 16, 1, BAM2); p.rect(0, 11, 16, 1, BAM2);
    p.rect(6, 2, 4, 13, BAM2); p.rect(9, 2, 1, 13, BAM3); p.rect(6, 2, 4, 1, BAM);
  }

  Art.TI = { G0: 0, G1: 1, G2: 2, G3: 3, PATH: 4, FIELD: 5, TILLED: 6, WET: 7, PADDY0: 8, PADDY1: 9, BUND: 10,
    RIV0: 11, RIV1: 12, RIV2: 13, SAND: 14, JETTY: 15, JUN0: 16, JUN1: 17, FH: 18, FV: 19, FC: 20, SHORE0: 21, SHORE1: 22 };

  function buildTiles(scene) {
    var fns = [
      function (p) { grass(p, 0); }, function (p) { grass(p, 1); }, function (p) { grass(p, 2); }, function (p) { grass(p, 3); },
      pathT, field, function (p) { tilled(p, false); }, function (p) { tilled(p, true); },
      function (p) { paddy(p, 0); }, function (p) { paddy(p, 1); }, bund,
      function (p) { river(p, 0); }, function (p) { river(p, 1); }, function (p) { river(p, 2); },
      sand, jetty, jungle, jungle, fenceH, fenceV, fenceC,
      function (p) { shore(p, 0); }, function (p) { shore(p, 1); }
    ];
    var extra = Art.extraTiles || [];   // v1.3 tiles from art2.js
    var c = canvas(16 * (fns.length + extra.length), 16), ctx = c.getContext('2d');
    fns.forEach(function (fn, i) {
      var t = canvas(16, 16), p = new P(t.getContext('2d'), 16, 16, 500 + (i === 9 || i === 12 || i === 13 || i === 22 ? i - 1 : i) * 31);
      fn(p); ctx.drawImage(t, i * 16, 0);
    });
    extra.forEach(function (e, k) {
      var i = fns.length + k, t = canvas(16, 16), p = new P(t.getContext('2d'), 16, 16, e.seed || 900 + i * 31);
      e.fn(p); ctx.drawImage(t, i * 16, 0);
    });
    if (scene.textures.exists('tiles')) scene.textures.remove('tiles');
    scene.textures.addCanvas('tiles', c);
  }

  // ================================================================== CHARACTERS
  // outfit colours per player (co-op): [shirt, shirt shade, sarong, sarong shade, skin, skin shade]
  var OUTFITS = [
    ['#cf4f3c', '#a33a2c', '#3e5fa8', '#2c4583', '#d49b6b', '#b37b4d'],
    ['#2a9d8f', '#1f7a70', '#8a2f4a', '#6a2238', '#c48a5c', '#a06c42'],
    ['#e9b949', '#c4922f', '#3f7f3a', '#2c5e2a', '#e0aa7c', '#c08a5c'],
    ['#8e5cc4', '#6c4398', '#8a5a2b', '#6b4423', '#b8794a', '#955d34']
  ];
  Art.OUTFIT_COLORS = OUTFITS.map(function (o) { return o[0]; });
  function drawPlayer(p, dir, f, c) {
    var O = OUTFITS[c || 0];
    var HAT = '#ecd28a', HAT2 = '#cdb062', HAT3 = '#a88a44', HATL = '#f7e6b0';
    var SK = O[4], SK2 = O[5], EYE = '#2a1a10', HAIR = '#2b1d16';
    var SH = O[0], SH2 = O[1], SA = O[2], SA2 = O[3], SAL = '#c99a3a', FT = '#5a3820';
    // legs
    if (dir === 'side') {
      if (f === 0) { p.rect(7, 14, 2, 1, SK); p.rect(7, 15, 3, 1, FT); }
      else if (f === 1) { p.px(9, 14, SK); p.rect(9, 15, 2, 1, FT); p.px(5, 14, SK); p.rect(4, 15, 2, 1, FT); }
      else { p.rect(7, 14, 2, 1, SK); p.rect(6, 15, 4, 1, FT); }
    } else {
      if (f === 1) { p.rect(5, 14, 2, 1, SK); p.rect(5, 15, 2, 1, FT); p.rect(9, 14, 2, 1, FT); }
      else if (f === 2) { p.rect(9, 14, 2, 1, SK); p.rect(9, 15, 2, 1, FT); p.rect(5, 14, 2, 1, FT); }
      else { p.rect(5, 14, 2, 1, SK); p.rect(9, 14, 2, 1, SK); p.rect(5, 15, 2, 1, FT); p.rect(9, 15, 2, 1, FT); }
    }
    // sarong (kain pelikat)
    var sx = dir === 'side' ? 6 : 5, sw = dir === 'side' ? 5 : 6;
    p.rect(sx, 11, sw, 3, SA);
    for (var x = sx; x < sx + sw; x++) if ((x - sx) % 3 === 1) p.rect(x, 11, 1, 3, SA2);
    p.rect(sx, 12, sw, 1, SAL);
    // shirt + arms
    p.rect(5, 9, 6, 2, SH); p.rect(10, 9, 1, 2, SH2);
    if (dir === 'side') {
      var ax = f === 1 ? 9 : f === 2 ? 6 : 8;
      p.rect(ax, 9, 1, 2, SH2); p.px(ax, 11, SK);
    } else {
      p.rect(4, 9, 1, 2, SH); p.rect(11, 9, 1, 2, SH2);
      p.px(4, f === 2 ? 10 : 11, SK); p.px(11, f === 1 ? 10 : 11, SK);
    }
    // head
    if (dir === 'up') { p.rect(5, 6, 6, 3, HAIR); p.rect(7, 8, 2, 1, '#3a2a20'); }
    else if (dir === 'down') { p.rect(5, 6, 6, 3, SK); p.rect(5, 6, 6, 1, SK2); p.px(6, 7, EYE); p.px(9, 7, EYE); p.px(5, 8, SK2); p.px(10, 8, SK2); }
    else { p.rect(5, 6, 6, 3, SK); p.rect(5, 6, 6, 1, SK2); p.rect(5, 6, 2, 3, HAIR); p.px(9, 7, EYE); p.px(11, 7, SK); }
    // conical hat (terendak / nón lá / salakot)
    var rows = [[7, 8], [6, 9], [5, 10], [4, 11], [2, 13], [1, 14]];
    rows.forEach(function (rw, y) {
      for (var xx = rw[0]; xx <= rw[1]; xx++) {
        var t = (xx - rw[0]) / Math.max(1, rw[1] - rw[0]);
        var c = t < 0.35 ? HATL : t < 0.75 ? HAT : HAT2;
        if (y === 5) c = t < 0.5 ? HAT2 : HAT3;
        else if (y > 0 && (xx + y * 2) % 5 === 0) c = HAT2;
        p.px(xx, y, c);
      }
    });
    p.outline(OUT);
  }

  var GHOST_EXPR = ['normal', 'happy', 'sad', 'sleepy'];
  function drawGhost(p, st, ex) {
    var gold = st === 4;
    var B = gold ? '#fffbf0' : '#f7f4ff', S = gold ? '#f0dfb4' : '#d3cbf2', D = gold ? '#a9792a' : '#8f84cf';
    var EYE = '#3b2f5c', BL = '#f5a3c7', MO = '#7a3a5a';
    if (st === 0) {
      p.disc(10, 15, 4, S); p.disc(9.6, 14.6, 3.1, B); p.px(9, 14, '#ffffff');
      p.outline(D);
      if (ex === 'happy') { p.px(8, 15, EYE); p.px(11, 15, EYE); p.px(9, 17, MO); p.px(10, 17, MO); }
      else if (ex === 'sleepy') { p.rect(7, 15, 2, 1, EYE); p.rect(11, 15, 2, 1, EYE); }
      else { p.px(8, 15, EYE); p.px(11, 15, EYE); if (ex === 'sad') p.px(11, 16, '#8fd3ff'); }
      p.px(4, 9, '#fffbe6'); p.px(16, 11, '#fffbe6'); p.px(14, 6, '#fffbe6');
      return;
    }
    var R = st === 1 ? 5 : 6, cx = 10, cy = (st === 1 || st === 4) ? 12 : 11, bot = 19, x;
    p.disc(cx, cy, R, S); p.rect(cx - R, cy, 2 * R, bot - cy, S);
    for (x = cx - R; x < cx + R; x++) if (((x - (cx - R)) % 4) < 2) p.px(x, bot, S);
    p.disc(cx - 0.7, cy - 0.7, R - 1.2, B); p.rect(cx - R + 1, cy, 2 * R - 3, bot - cy - 1, B);
    if (st === 2 || st === 3) {   // little lamp held at the side
      p.px(16, cy + 3, '#6b4423'); p.px(17, cy + 3, '#6b4423');
      p.rect(16, cy + 4, 3, 1, '#d9a73a'); p.rect(16, cy + 5, 3, 3, '#d8452f'); p.px(17, cy + 6, '#ffd27a'); p.rect(16, cy + 8, 3, 1, '#d9a73a');
    }
    if (st === 3) {   // frangipani on the head
      p.px(6, 5, '#fffaf0'); p.px(5, 6, '#fffaf0'); p.px(7, 6, '#fffaf0'); p.px(6, 7, '#fffaf0'); p.px(7, 5, '#fffaf0');
      p.px(6, 6, '#f5c542'); p.px(8, 5, '#4f9a3a'); p.px(9, 5, '#4f9a3a');
    }
    if (st === 4) {   // golden headdress (inspired by the Thai chada)
      var spire = [[0, 9, 10], [1, 9, 10], [2, 9, 10], [3, 8, 11], [4, 8, 11]];
      spire.forEach(function (r) { p.rect(r[1], r[0], r[2] - r[1] + 1, 1, '#f2c94c'); p.px(r[2], r[0], '#b8862a'); });
      p.px(9, 0, '#fff3b0'); p.px(9, 3, '#fff3b0');
      p.rect(6, 5, 8, 2, '#e2b33c'); p.rect(6, 6, 8, 1, '#b8862a'); p.rect(9, 5, 2, 1, '#d62828');
      p.px(5, 6, '#e2b33c'); p.px(14, 6, '#e2b33c'); p.px(4, 7, '#e2b33c'); p.px(15, 7, '#e2b33c');
    }
    p.outline(D);
    var eL = R === 5 ? 8 : 7, eR = R === 5 ? 11 : 12, ey = cy + 1;
    if (ex === 'happy') {
      [eL, eR].forEach(function (e) { p.px(e - 1, ey + 1, EYE); p.px(e, ey, EYE); p.px(e + 1, ey + 1, EYE); });
      p.rect(cx - 1, ey + 2, 2, 1, MO); p.rect(cx - 1, ey + 3, 2, 1, '#e8799a');
      p.px(eL - 1, ey + 3, BL); p.px(eR + 1, ey + 3, BL);
    } else if (ex === 'sad') {
      p.rect(eL, ey, 1, 2, EYE); p.rect(eR, ey, 1, 2, EYE);
      p.px(cx - 2, ey + 4, MO); p.px(cx - 1, ey + 3, MO); p.px(cx, ey + 3, MO); p.px(cx + 1, ey + 4, MO);
      p.px(eR, ey + 2, '#8fd3ff'); p.px(eR, ey + 3, '#8fd3ff');
    } else if (ex === 'sleepy') {
      p.rect(eL - 1, ey + 1, 2, 1, EYE); p.rect(eR, ey + 1, 2, 1, EYE); p.px(cx, ey + 3, MO);
      p.px(eL - 1, ey + 2, BL); p.px(eR + 1, ey + 2, BL);
    } else {
      p.rect(eL, ey, 1, 2, EYE); p.rect(eR, ey, 1, 2, EYE);
      p.px(cx - 1, ey + 3, MO); p.px(cx, ey + 3, MO);
      p.px(eL - 1, ey + 2, BL); p.px(eR + 1, ey + 2, BL);
    }
  }

  function drawAni(p, blink) {
    var T = '#2a9d8f', T2 = '#1f7a70', SK = '#c48a5c', B = '#e9c46a', B2 = '#d9a73a';
    p.rect(3, 13, 10, 7, B); p.rect(12, 13, 1, 7, B2); p.speck(4, 14, 8, 6, '#c2453b', 5);
    p.rect(2, 14, 1, 4, B); p.rect(13, 14, 1, 4, B2);
    p.disc(8, 6, 5, T); p.rect(3, 7, 10, 6, T); p.rect(12, 7, 1, 6, T2); p.rect(4, 12, 8, 1, T2);
    p.ell(8, 7.5, 3, 3.2, SK);
    if (blink) { p.px(6, 7, '#8a5a3a'); p.px(9, 7, '#8a5a3a'); }
    else { p.px(6, 7, '#2a1a10'); p.px(9, 7, '#2a1a10'); }
    p.px(7, 9, '#8a4a3a'); p.px(8, 9, '#8a4a3a'); p.px(5, 8, '#d9907a'); p.px(10, 8, '#d9907a');
    p.outline(OUT);
  }

  function drawKerbau(p, f) {
    var B = '#5d5a66', B2 = '#47444f', BL = '#6e6b78';
    var legs = f === 0 ? [6, 10, 16, 20] : [7, 9, 17, 19];
    legs.forEach(function (x, i) { p.rect(x, 13, 2, 6, B2); p.rect(x, 18, 2, 1, '#2e2c33'); });
    p.ell(13, 10, 10, 5.5, B); p.ell(13, 12, 8, 3, BL); p.rect(6, 5, 12, 1, BL);
    p.speck(6, 11, 14, 4, '#7a5a3a', 6);
    p.line(3, 8, 2, 14, B2); p.px(2, 15, '#2e2c33'); p.px(1, 15, '#2e2c33');
    p.ell(23, 9, 4, 3.5, B); p.rect(24, 10, 4, 3, '#7a7682'); p.px(27, 11, '#2e2c33'); p.px(23, 8, '#141414');
    p.line(22, 6, 20, 3, '#d9cfbf', 2); p.line(20, 3, 16, 2, '#d9cfbf', 1); p.px(15, 3, '#bfb4a2');
    p.line(25, 6, 26, 3, '#bfb4a2'); p.px(25, 2, '#bfb4a2');
    p.outline(OUT);
  }
  function drawChicken(p, f) {
    var B = '#c0602c', W = '#9a4a22';
    p.ell(6, 7, 4, 3, B); p.ell(5, 7, 2.5, 1.8, W);
    p.px(1, 3, '#2c3a2a'); p.px(2, 4, '#3f5a3a'); p.px(1, 5, '#2c3a2a'); p.px(2, 5, '#2c3a2a'); p.px(2, 3, '#3f5a3a');
    var hy = f === 1 ? 7 : 4, hx = f === 1 ? 10 : 9;
    p.disc(hx, hy, 2, '#d47a3a'); p.px(hx, hy - 2, '#d62828'); p.px(hx - 1, hy - 2, '#d62828'); p.px(hx + 2, hy, '#f2c14e'); p.px(hx, hy, '#1a1a1a'); p.px(hx + 1, hy + 2, '#d62828');
    var lx = f === 2 ? [4, 7] : [5, 7];
    p.rect(lx[0], 10, 1, 2, '#e2b13c'); p.rect(lx[1], 10, 1, 2, '#e2b13c');
    p.outline(OUT);
  }

  // ================================================================== CROPS
  function crop(p, id, st) {
    var G1 = '#4f9a3a', G2 = '#6cbf4a', G3 = '#3a7a2c';
    if (st === 0) {
      if (id === 'padi') { p.line(7, 13, 6, 10, G2); p.line(8, 13, 8, 9, G2); p.line(9, 13, 10, 10, G1); p.rect(5, 13, 6, 1, '#8cc0ae'); return; }
      p.ell(8, 13, 3.5, 1.6, '#6a4426'); p.px(7, 12, '#e6d28a'); p.px(9, 13, '#e6d28a'); return;
    }
    if (st === 1) {
      if (id === 'padi') { [5, 7, 9, 11].forEach(function (x, i) { p.line(x, 14, x + (i - 1.5), 7, i % 2 ? G1 : G2); }); p.outline('#1f3a1a'); return; }
      p.rect(8, 10, 1, 4, G1); p.px(6, 10, G2); p.px(7, 9, G2); p.px(7, 10, G2); p.px(9, 9, G2); p.px(10, 10, G2); p.px(9, 10, G2);
      p.outline('#1f3a1a'); return;
    }
    var i;
    switch (id) {
      case 'ubi':
        if (st === 2) { [[5, 11], [8, 9], [11, 11], [7, 12], [10, 13]].forEach(function (c, k) { p.disc(c[0], c[1], 2.2, k % 2 ? G1 : G2); }); }
        else {
          p.ell(7, 14, 2.5, 1.6, '#8e4a8a'); p.px(6, 13, '#b070a8');
          [[4, 10], [8, 7], [12, 10], [6, 12], [11, 13], [9, 10], [3, 13]].forEach(function (c, k) { p.disc(c[0], c[1], 2.4, k % 2 ? G1 : G2); });
          p.speck(3, 7, 10, 7, '#8fd06a', 5);
        }
        break;
      case 'pandan':
        var n = st === 2 ? 4 : 6, h = st === 2 ? 7 : 2;
        for (i = 0; i < n; i++) { var ang = -Math.PI / 2 + (i - (n - 1) / 2) * 0.32; p.line(8, 14, 8 + Math.cos(ang) * (14 - h), 14 + Math.sin(ang) * (14 - h), i % 2 ? G2 : '#3d9a3a', 1); }
        if (st === 3) { p.px(8, 5, '#9de07a'); p.px(6, 6, '#9de07a'); }
        break;
      case 'cili':
        p.rect(8, 11, 1, 4, G3);
        p.disc(8, st === 2 ? 10 : 8, st === 2 ? 3.5 : 5, G1); p.speck(4, 4, 9, 8, G2, 8);
        if (st === 3) { [[5, 9], [8, 11], [11, 8], [9, 6], [6, 6]].forEach(function (c) { p.rect(c[0], c[1], 1, 2, '#d62828'); p.px(c[0], c[1], '#ff6b6b'); }); p.px(10, 10, '#ffffff'); }
        break;
      case 'marigold':
        p.disc(8, 11, st === 2 ? 3.5 : 4.5, '#3f8a3a'); p.speck(4, 7, 9, 7, '#5aa64a', 8);
        if (st === 3) { [[5, 7], [10, 6], [8, 10]].forEach(function (c) { p.disc(c[0], c[1], 2, '#f08a24'); p.px(c[0] - 1, c[1] - 1, '#ffc65a'); p.px(c[0], c[1], '#d96b0e'); }); }
        break;
      case 'melati':
        p.disc(8, 11, st === 2 ? 3.5 : 4.5, '#3f8a3a'); p.speck(4, 7, 9, 7, '#2f6f2c', 6); p.speck(4, 7, 9, 7, G2, 4);
        if (st === 3) { [[5, 8], [10, 7], [8, 11], [12, 11], [7, 5]].forEach(function (c) { p.px(c[0], c[1], '#f5d76e'); p.px(c[0] - 1, c[1], '#ffffff'); p.px(c[0] + 1, c[1], '#ffffff'); p.px(c[0], c[1] - 1, '#ffffff'); p.px(c[0], c[1] + 1, '#ffffff'); }); }
        break;
      case 'padi':
        var gold = st === 3;
        for (i = 0; i < 6; i++) {
          var bx = 4 + i * 1.6, top = gold ? 4 + (i % 2) : 3 + (i % 3);
          p.line(bx, 14, bx + (i - 2.5) * 0.7, top, gold ? (i % 2 ? '#c9a23a' : '#d9b44a') : (i % 2 ? G1 : G2));
        }
        if (gold) { [[4, 4], [7, 3], [10, 4], [12, 5]].forEach(function (c) { p.px(c[0], c[1], '#f2d06b'); p.px(c[0] + 1, c[1] + 1, '#f2d06b'); p.px(c[0] + 1, c[1] + 2, '#e6c35a'); }); }
        break;
    }
    p.outline('#1f3a1a');
  }

  // ================================================================== OBJECTS
  function drawHouse(p) {
    var x;
    p.rect(6, 64, 68, 24, 'rgba(30,20,12,0.45)');
    [8, 22, 38, 54, 68].forEach(function (sx) { p.rect(sx, 60, 4, 29, '#6b4423'); p.rect(sx + 3, 60, 1, 29, '#4e3018'); p.rect(sx - 1, 87, 6, 2, '#8a8a8a'); });
    p.ell(16, 82, 4, 5, '#7a4a2a'); p.rect(14, 76, 5, 1, '#5a3420'); p.px(14, 80, '#9a6a44'); p.px(14, 81, '#9a6a44');
    p.ell(62, 84, 3, 3.5, '#8a5a32'); p.px(61, 82, '#aa7a4a');
    // floor beam + walls
    p.rect(2, 58, 76, 4, '#5e3a1e'); p.rect(2, 58, 76, 1, '#7a4f2b');
    p.rect(6, 36, 68, 22, '#b8834a');
    for (x = 6; x < 74; x += 4) p.rect(x, 36, 1, 22, '#9a6a38');
    p.rect(6, 36, 68, 2, '#7a4f2b');
    // windows with open shutters
    [12, 56].forEach(function (wx) {
      p.rect(wx - 4, 40, 3, 12, '#9c6a3a'); p.rect(wx + 12, 40, 3, 12, '#9c6a3a');
      p.rect(wx - 4, 44, 3, 1, '#7a4b28'); p.rect(wx + 12, 44, 3, 1, '#7a4b28');
      p.rect(wx, 40, 12, 12, '#5a3720'); p.rect(wx + 2, 42, 8, 8, '#2a1a10'); p.rect(wx + 5, 42, 2, 8, '#5a3720');
    });
    // door
    p.rect(33, 38, 14, 20, '#5a3720'); p.rect(35, 40, 10, 18, '#7a4b28'); p.rect(39, 40, 2, 18, '#5a3720');
    p.rect(35, 40, 10, 2, '#d9a73a'); p.px(37, 49, '#d9a73a'); p.px(42, 49, '#d9a73a');
    // roof: steep attap thatch with carved gable (tebar layar)
    for (var y = 2; y <= 38; y++) {
      var half = Math.round((y - 2) / 36 * 40 + 1);
      for (x = 40 - half; x < 40 + half; x++) {
        var c = (y % 3 === 0) ? '#6d522c' : '#8b6b3d';
        if (p.r() < 0.08) c = '#a8854f';
        p.px(x, y, c);
      }
    }
    for (y = 12; y <= 34; y++) {
      var hin = Math.round((y - 12) / 22 * 24);
      for (x = 40 - hin; x < 40 + hin; x++) p.px(x, y, (x % 3 === 0) ? '#9a6a38' : '#c08a4e');
    }
    for (y = 22; y <= 30; y += 4) for (x = 34; x <= 46; x += 4) { p.px(x, y, '#3a2412'); p.px(x + 1, y + 1, '#3a2412'); }
    p.rect(0, 37, 80, 2, '#5a4222');
    p.line(33, 0, 47, 14, '#5a3720', 2); p.line(47, 0, 33, 14, '#5a3720', 2);
    // stairs (tangga)
    p.rect(34, 58, 2, 38, '#7a4b28'); p.rect(45, 58, 2, 38, '#7a4b28');
    for (y = 62; y < 95; y += 5) { p.rect(36, y, 9, 2, '#a8743e'); p.rect(36, y + 2, 9, 1, '#6b4423'); }
  }

  function drawSpiritHouse(p) {
    p.rect(7, 40, 10, 4, '#8d8f94'); p.rect(7, 40, 10, 1, '#a8aab0');
    p.rect(10, 24, 4, 17, '#efe6d2'); p.rect(13, 24, 1, 17, '#cbbfa5'); p.rect(9, 30, 6, 1, '#d9a73a');
    p.rect(2, 21, 20, 3, '#7a2e22'); p.rect(2, 21, 20, 1, '#d9a73a'); p.rect(2, 23, 20, 1, '#5a1e16');
    p.rect(5, 12, 14, 9, '#b8332a'); p.rect(5, 12, 14, 1, '#e2b33c'); p.rect(18, 12, 1, 9, '#8e241d');
    p.rect(10, 15, 4, 6, '#3a1410'); p.rect(9, 14, 6, 1, '#e2b33c');
    p.rect(6, 15, 2, 2, '#e2b33c'); p.rect(16, 15, 2, 2, '#e2b33c');
    p.poly([[2, 12], [12, 5], [22, 12]], '#c8402f'); p.rect(3, 11, 18, 1, '#e2b33c');
    p.poly([[6, 7], [12, 1], [18, 7]], '#2f7a4a'); p.rect(7, 6, 10, 1, '#e2b33c');
    p.rect(11, 0, 2, 3, '#f2c94c');
    p.px(2, 10, '#f2c94c'); p.px(1, 9, '#f2c94c'); p.px(21, 10, '#f2c94c'); p.px(22, 9, '#f2c94c');
    p.px(5, 5, '#f2c94c'); p.px(18, 5, '#f2c94c');
    p.px(4, 20, '#f2d06b'); p.px(19, 20, '#f2d06b'); p.px(5, 19, '#ffffff'); p.px(18, 19, '#ffffff');
  }

  function drawFrangipani(p) {
    var T = '#8d7b6a', T2 = '#6e5f50';
    p.rect(20, 30, 4, 18, T); p.rect(23, 30, 1, 18, T2);
    p.line(21, 32, 12, 18, T, 2); p.line(22, 30, 22, 12, T, 2); p.line(23, 32, 33, 16, T, 2); p.line(13, 20, 7, 14, T, 1); p.line(31, 19, 38, 12, T, 1);
    var tips = [[12, 17], [22, 11], [33, 15], [7, 13], [38, 11]];
    tips.forEach(function (t, k) {
      for (var i = 0; i < 6; i++) { var a = i / 6 * Math.PI * 2; p.line(t[0], t[1], t[0] + Math.cos(a) * 5, t[1] + Math.sin(a) * 3.5, i % 2 ? '#4f8f3c' : '#3d7630', 2); }
    });
    var fl = [[10, 14], [14, 16], [20, 9], [24, 10], [31, 13], [35, 16], [6, 11], [39, 9], [22, 14]];
    fl.forEach(function (f) { p.px(f[0], f[1], '#f5d76e'); p.px(f[0] - 1, f[1], '#fffdf5'); p.px(f[0] + 1, f[1], '#fffdf5'); p.px(f[0], f[1] - 1, '#fffdf5'); p.px(f[0], f[1] + 1, '#fffdf5'); p.px(f[0] + 1, f[1] + 1, '#fffdf5'); });
  }

  function drawDapur(p) {
    p.rect(2, 12, 28, 14, '#b4653c'); p.rect(1, 10, 30, 3, '#c97a4c'); p.rect(1, 10, 30, 1, '#dd9466');
    p.rect(2, 23, 28, 3, '#8e4a2a');
    p.rect(2, 16, 28, 1, '#9a5230'); p.rect(2, 20, 28, 1, '#9a5230');
    [8, 16, 24].forEach(function (x) { p.rect(x, 13, 1, 3, '#9a5230'); p.rect(x - 4, 17, 1, 3, '#9a5230'); });
    [6, 20].forEach(function (x) { p.rect(x, 17, 6, 7, '#2a1510'); p.px(x + 2, 22, '#ff8a3a'); p.px(x + 3, 22, '#ffd166'); p.px(x + 4, 23, '#ff8a3a'); p.px(x + 1, 23, '#c8321e'); });
    p.line(4, 25, 9, 22, '#7a4b28'); p.line(26, 25, 22, 22, '#7a4b28');
    p.ell(9, 9, 6, 2.5, '#2d2a2e'); p.ell(9, 8.5, 5, 1.6, '#4a464d'); p.px(2, 9, '#2d2a2e'); p.px(16, 9, '#2d2a2e');
    p.rect(18, 3, 10, 7, '#7b7f88'); p.rect(27, 3, 1, 7, '#5a5f66'); p.ell(23, 3, 5.5, 1.6, '#9aa0a8'); p.px(23, 1, '#5a5f66'); p.rect(19, 4, 1, 4, '#a8aeb6');
  }

  function drawWell(p) {
    p.poly([[0, 7], [12, 0], [24, 7]], '#8b6b3d');
    for (var y = 2; y < 7; y += 2) p.rect(12 - y * 2, y, y * 4, 1, '#6d522c');
    p.rect(3, 7, 2, 16, '#7a4b28'); p.rect(19, 7, 2, 16, '#7a4b28');
    p.rect(3, 9, 18, 2, '#6b4423'); p.rect(12, 11, 1, 5, '#d9c9a0');
    p.rect(10, 15, 5, 4, '#7a4f2b'); p.rect(10, 16, 5, 1, '#3a2a20');
    p.ell(12, 22, 10, 4, '#8d8f94'); p.ell(12, 21.6, 8, 2.6, '#22384d'); p.px(9, 21, '#4a6a8a');
    p.rect(2, 22, 20, 8, '#8d8f94'); p.ell(12, 30, 10, 2, '#7a7c82');
    for (y = 24; y < 30; y += 3) { p.rect(2, y, 20, 1, '#6e7075'); for (var x = 4 + (y % 2) * 3; x < 22; x += 6) p.rect(x, y - 2, 1, 2, '#6e7075'); }
    p.rect(3, 22, 1, 7, '#a8aab0');
  }

  var MINI = { W: ['101', '101', '101', '111', '101'], A: ['010', '101', '111', '101', '101'], R: ['110', '101', '110', '101', '101'],
    U: ['101', '101', '101', '101', '111'], N: ['101', '111', '111', '101', '101'], G: ['011', '100', '101', '101', '011'] };
  function miniText(p, s, x, y, c) {
    for (var i = 0; i < s.length; i++) { var g = MINI[s[i]]; if (!g) continue; for (var r = 0; r < 5; r++) for (var k = 0; k < 3; k++) if (g[r][k] === '1') p.px(x + i * 4 + k, y + r, c); }
  }
  function drawWarungBack(p) {
    p.rect(3, 14, 3, 50, '#6b4423'); p.rect(66, 14, 3, 50, '#6b4423');
    p.rect(6, 20, 60, 26, '#a5713f'); for (var x = 6; x < 66; x += 5) p.rect(x, 20, 1, 26, '#8a5a32');
    p.rect(8, 26, 56, 2, '#6b4423'); p.rect(8, 36, 56, 2, '#6b4423');
    var jars = ['#e9c46a', '#e76f51', '#7bc8a4', '#f4a261', '#e9c46a', '#c77dff', '#e76f51'];
    jars.forEach(function (c, i) { var jx = 10 + i * 8; p.rect(jx, 21, 5, 5, '#d8ecf0'); p.rect(jx + 1, 22, 3, 4, c); p.rect(jx, 20, 5, 1, '#c8323a'); });
    for (var i = 0; i < 6; i++) { var bx = 10 + i * 9; p.rect(bx, 31, 2, 5, '#d62828'); p.px(bx, 30, '#f5f5f5'); p.rect(bx + 4, 32, 3, 4, '#2a9d8f'); }
    p.rect(54, 40, 8, 4, '#c9a46a'); p.px(56, 40, '#f2d14b'); p.px(58, 40, '#f2d14b');
    // zinc roof
    p.poly([[0, 16], [8, 2], [64, 2], [72, 16]], '#9aa0a6');
    for (x = 0; x < 72; x += 3) p.line(x, 16, x + (36 - x) * 0.11, 2, '#7d8288');
    p.speck(4, 4, 64, 11, '#a0522d', 22); p.rect(0, 16, 72, 2, '#6b6f75');
    p.rect(22, 6, 28, 9, '#f2e6c9'); p.rect(22, 6, 28, 1, '#c8323a'); p.rect(22, 14, 28, 1, '#c8323a');
    miniText(p, 'WARUNG', 25, 8, '#7a2e22');
    for (x = 6; x < 66; x += 6) { p.rect(x, 18, 3, 2, x % 12 ? '#d62828' : '#f5f5f5'); }
  }
  function drawWarungFront(p) {
    p.rect(4, 44, 64, 4, '#b07a45'); p.rect(4, 44, 64, 1, '#d09a60');
    p.rect(6, 48, 60, 14, '#7a2e5a');
    for (var y = 50; y < 62; y += 4) for (var x = 8 + (y % 8 === 2 ? 2 : 0); x < 64; x += 4) { p.px(x, y, '#e9c46a'); p.px(x + 1, y + 1, '#c77d3a'); }
    p.rect(6, 48, 60, 1, '#e9c46a'); p.rect(6, 61, 60, 1, '#e9c46a');
    p.ell(14, 43, 5, 2.5, '#9c6a3a'); [[11, 41, '#d62828'], [14, 40, '#d62828'], [17, 41, '#b8322a'], [13, 42, '#e24a3a']].forEach(function (f) { p.disc(f[0], f[1], 1.5, f[2]); p.px(f[0], f[1] - 2, '#3a8a2a'); });
    p.ell(56, 43, 5, 2.5, '#9c6a3a'); [[53, 41], [56, 40], [59, 41]].forEach(function (f) { p.disc(f[0], f[1], 1.6, '#5a2a5a'); p.px(f[0], f[1] - 2, '#3a8a2a'); });
    p.ell(36, 43, 4, 2, '#9c6a3a'); p.ell(36, 41, 3, 1.6, '#f4b93a');
    p.rect(3, 44, 3, 20, '#6b4423'); p.rect(66, 44, 3, 20, '#6b4423');
  }

  function drawTorch(p, lit) {
    p.rect(4, 6, 3, 23, '#c9b45a'); p.rect(6, 6, 1, 23, '#9e8c3c');
    [12, 19, 25].forEach(function (y) { p.rect(4, y, 3, 1, '#9e8c3c'); });
    p.px(4, 5, '#c9b45a'); p.px(5, 5, '#c9b45a'); p.px(5, 4, '#3a2a20');
    p.rect(2, 28, 7, 2, '#7a5a3a');
    if (lit) { p.rect(4, 2, 3, 2, '#ffb347'); p.px(5, 1, '#ffd166'); p.px(5, 0, '#fff3b0'); p.px(5, 3, '#fff3b0'); }
  }

  function drawPalm(p, fruit) {
    var i, t;
    for (i = 0; i <= 52; i++) {
      t = i / 52; var x = 22 + 7 * t * t + 1.5 * Math.sin(t * 3), y = 71 - 52 * t, w = Math.round(4 - t * 1.5);
      p.rect(x - w / 2, y, w, 2, '#8a6a45'); p.px(x - w / 2, y, '#a3845c');
      if (i % 4 === 0) p.rect(x - w / 2, y, w, 1, '#6e5233');
    }
    var cx = 29, cy = 19;
    var fr = [[-165, 20], [-135, 19], [-100, 15], [-60, 17], [-25, 20], [5, 18], [160, 14], [30, 15]];
    fr.forEach(function (f, k) {
      var a = f[0] * Math.PI / 180, L = f[1];
      for (var s = 0; s <= L; s++) {
        var px = cx + Math.cos(a) * s, py = cy + Math.sin(a) * s + (s * s) / (L * 1.4);
        var leaf = Math.round((1 - s / L) * 4) + 1;
        for (var q = 1; q <= leaf; q++) p.px(px, py + q, (q + k) % 3 === 0 ? '#2e6f2c' : (k % 2 ? '#4ea345' : '#3f8f3a'));
        p.px(px, py, '#2e6f2c');
      }
    });
    if (fruit) { [[27, 22], [31, 22], [29, 24]].forEach(function (c) { p.disc(c[0], c[1], 2.2, '#6b4a2a'); p.px(c[0] - 1, c[1] - 1, '#8c6a40'); }); }
  }

  function drawBanana(p, fruit) {
    // pseudostem with old brown leaf sheaths
    p.rect(16, 18, 4, 26, '#7aa83e'); p.rect(19, 18, 1, 26, '#5c8a2e'); p.rect(16, 18, 1, 26, '#94c457');
    p.rect(15, 34, 2, 8, '#9a7a44'); p.px(15, 33, '#9a7a44'); p.rect(20, 37, 1, 5, '#8a6a3a');
    // long arching leaves: rise from the crown, then droop at the tips, with torn edges
    var leaves = [[-168, 17, 0.9], [-138, 16, 0.8], [-100, 12, 0.35], [-62, 15, 0.8], [-18, 17, 0.95], [-80, 13, 0.4]];
    leaves.forEach(function (l, k) {
      var a = l[0] * Math.PI / 180, L = l[1], droop = l[2], bx = 18, by = 19;
      var col = k % 2 ? '#6fb543' : '#5ea83c', dark = '#3f7f2c';
      for (var s = 1; s <= L; s++) {
        var cx = bx + Math.cos(a) * s, cy = by + Math.sin(a) * s + droop * (s * s) / L;
        var w = Math.min(2.6, 0.6 + s * 0.35) * (s > L - 3 ? 0.7 : 1);
        p.disc(cx, cy, w, col);
        p.px(cx, cy + Math.ceil(w) - 0.5, dark);
      }
      for (s = 2; s < L; s++) p.px(bx + Math.cos(a) * s, by + Math.sin(a) * s + droop * (s * s) / L, '#b6e07a');
      for (s = 4; s < L; s += 3) {   // tears in the leaf
        var tx = bx + Math.cos(a) * s, ty = by + Math.sin(a) * s + droop * (s * s) / L;
        p.clear(Math.round(tx), Math.round(ty) + 2, 1, 1);
      }
    });
    if (fruit) {
      for (var r = 0; r < 4; r++) { p.rect(12 + (r % 2), 26 + r * 2, 7, 2, '#f2d14b'); p.rect(12 + (r % 2), 27 + r * 2, 7, 1, '#c9a227'); }
      p.rect(15, 24, 1, 3, '#5c8a2e');
    }
    p.ell(15, fruit ? 36 : 30, 2, 3, '#8a2f5a'); p.px(14, fruit ? 35 : 29, '#b0507a');
  }

  function drawMango(p, fruit) {
    p.rect(29, 40, 6, 24, '#6b4423'); p.rect(33, 40, 2, 24, '#4e3018'); p.rect(27, 61, 10, 3, '#6b4423');
    p.line(31, 46, 21, 33, '#6b4423', 3); p.line(33, 45, 43, 31, '#6b4423', 3);
    var blobs = [[32, 26, 16], [17, 30, 11], [47, 30, 11], [23, 17, 10], [41, 17, 10], [32, 11, 9]];
    blobs.forEach(function (b) { p.disc(b[0], b[1] + 2, b[2], '#245a25'); });
    blobs.forEach(function (b) { p.disc(b[0], b[1], b[2] - 1, '#3a7f36'); });
    blobs.forEach(function (b) { p.disc(b[0] - 2, b[1] - 3, b[2] - 5, '#4f9a42'); });
    p.speck(6, 2, 52, 40, '#62ad50', 30); p.speck(6, 10, 52, 30, '#2d6a2d', 25);
    if (fruit) { [[20, 32], [28, 36], [38, 34], [46, 30], [33, 22], [14, 26], [42, 20], [24, 22]].forEach(function (m) { p.ell(m[0], m[1], 1.6, 2.2, '#f4b93a'); p.px(m[0], m[1] + 1, '#e07a2a'); p.px(m[0] - 1, m[1] - 1, '#ffe08a'); }); }
  }

  // ================================================================== ICONS (16x16)
  var ICON = {};
  ICON.hoe = function (p) { p.line(3, 14, 11, 4, '#9c6a3a', 2); p.line(4, 14, 11, 5, '#c08a4e'); p.rect(9, 2, 6, 3, '#9aa3ad'); p.rect(9, 2, 6, 1, '#d8dde3'); p.rect(13, 5, 2, 2, '#9aa3ad'); };
  ICON.can = function (p) {
    p.rect(3, 7, 8, 6, '#7fa6b8'); p.rect(3, 12, 8, 1, '#5c8294'); p.rect(4, 8, 2, 3, '#b8d4df');
    p.line(4, 7, 5, 4, '#5c8294'); p.line(5, 4, 9, 4, '#5c8294'); p.line(9, 4, 10, 7, '#5c8294');
    p.line(11, 10, 14, 6, '#7fa6b8', 2); p.rect(14, 4, 2, 3, '#5c8294');
  };
  function seedIcon(col, mark) {
    return function (p) {
      p.rect(3, 3, 10, 11, '#c9a46a'); p.rect(12, 3, 1, 11, '#a8834f'); p.rect(3, 13, 10, 1, '#a8834f'); p.rect(3, 3, 10, 2, '#b8915a');
      p.rect(4, 4, 8, 1, '#a8834f');
      p.disc(8, 9.5, 3, col); p.px(7, 8, '#ffffff');
      if (mark) p.px(8, 9, mark);
    };
  }
  ICON.seed_ubi = seedIcon('#8e4a8a'); ICON.seed_pandan = seedIcon('#3d9a3a'); ICON.seed_cili = seedIcon('#d62828');
  ICON.seed_marigold = seedIcon('#f08a24'); ICON.seed_melati = seedIcon('#f5f5f5', '#f5d76e'); ICON.seed_padi = seedIcon('#d9b44a');
  ICON.ubi = function (p) { p.ell(8, 9, 5.5, 3, '#8e4a8a'); p.ell(8, 10, 5, 2, '#6d3369'); p.ell(7, 8, 4, 1.6, '#b070a8'); p.px(2, 10, '#6d3369'); p.px(14, 8, '#6d3369'); p.px(4, 6, '#4f9a3a'); p.px(5, 5, '#6cbf4a'); };
  ICON.pandan = function (p) { [[5, 14, 3, 2], [7, 14, 6, 1], [9, 14, 11, 2], [11, 14, 14, 4]].forEach(function (l, i) { p.line(l[0], l[1], l[2], l[3], i % 2 ? '#5cbf4f' : '#3d9a3a', 2); }); p.rect(5, 11, 7, 2, '#c9a46a'); };
  ICON.cili = function (p) { p.line(5, 5, 8, 10, '#d62828', 3); p.line(8, 10, 12, 13, '#d62828', 2); p.px(13, 14, '#9e1b1b'); p.line(5, 5, 7, 9, '#ff6b6b'); p.rect(3, 3, 3, 2, '#3a8a2a'); p.px(3, 2, '#3a8a2a'); };
  ICON.marigold = function (p) { p.disc(8, 8, 5.5, '#f08a24'); p.disc(8, 8, 3.8, '#f6a93b'); p.disc(8, 8, 2, '#ffc65a'); p.speck(4, 4, 8, 8, '#d96b0e', 8); p.rect(7, 13, 2, 2, '#3f8a3a'); p.px(5, 14, '#4f9a3a'); };
  ICON.melati = function (p) {
    p.line(3, 13, 8, 9, '#4f9a3a'); p.line(13, 13, 9, 9, '#4f9a3a'); p.disc(4, 12, 1.6, '#3f8a3a'); p.disc(12, 12, 1.6, '#3f8a3a');
    [[5, 6], [11, 5], [8, 10]].forEach(function (f) { p.px(f[0], f[1], '#f5d76e'); p.rect(f[0] - 2, f[1], 2, 1, '#ffffff'); p.rect(f[0] + 1, f[1], 2, 1, '#ffffff'); p.rect(f[0], f[1] - 2, 1, 2, '#ffffff'); p.rect(f[0], f[1] + 1, 1, 2, '#ece6d6'); });
  };
  ICON.padi = function (p) {
    [[8, 1], [4, 3], [12, 3], [6, 2], [10, 2]].forEach(function (t, i) { p.line(8, 14, t[0], t[1], i % 2 ? '#c9a23a' : '#d9b44a'); });
    [[4, 3], [8, 1], [12, 3], [6, 2], [10, 2], [3, 5], [13, 5]].forEach(function (g) { p.px(g[0], g[1], '#f2d06b'); p.px(g[0], g[1] + 1, '#e6c35a'); });
    p.rect(6, 10, 5, 2, '#8a5a2b');
  };
  ICON.pisang = function (p) {
    for (var i = 0; i < 3; i++) { var y = 5 + i * 3; p.line(3, y + 2, 7, y + 4, '#f2d14b', 2); p.line(7, y + 4, 13, y, '#f2d14b', 2); p.line(4, y + 3, 12, y + 1, '#c9a227'); }
    p.rect(12, 3, 2, 3, '#6b4a2a');
  };
  ICON.kelapa = function (p) { p.disc(8, 9, 5.5, '#7a4f2b'); p.disc(7, 8, 4, '#8f6236'); p.speck(3, 4, 10, 10, '#5a3a1e', 10); p.px(6, 8, '#3a2412'); p.px(9, 8, '#3a2412'); p.px(7, 10, '#3a2412'); p.px(5, 5, '#a8784a'); };
  ICON.mangga = function (p) { p.ell(8, 9, 5, 4.5, '#f4b93a'); p.ell(7, 8, 3.2, 3, '#ffd36a'); p.ell(10, 11, 3, 2.2, '#e8963b'); p.px(5, 6, '#e8743b'); p.px(6, 6, '#e8743b'); p.rect(8, 3, 1, 2, '#6b4423'); p.line(9, 4, 13, 2, '#4f9a3a', 2); };
  function bowl(p, col, col2) { p.ell(8, 11, 6.5, 3.5, col); p.rect(2, 9, 13, 2, col); p.rect(2, 11, 13, 1, col2); p.rect(5, 14, 6, 1, col2); }
  ICON.nasi = function (p) { p.disc(8, 8, 5, '#ffffff'); p.speck(4, 4, 9, 5, '#e3e3d8', 8); bowl(p, '#e9eef5', '#4a78b8'); p.px(6, 6, '#ffffff'); };
  ICON.ubi_rebus = function (p) { p.ell(8, 12, 7, 3, '#e9e4d8'); p.ell(8, 12, 5.5, 2, '#d8d2c3'); [[5, 9], [9, 8], [11, 10]].forEach(function (c) { p.ell(c[0], c[1], 2.5, 2, '#9a58a0'); p.ell(c[0], c[1], 1.5, 1, '#f0d58a'); }); };
  ICON.pisang_goreng = function (p) { p.ell(8, 11, 7, 3.5, '#5aa83e'); p.line(2, 11, 14, 11, '#8fd06a'); [[5, 8], [10, 7], [8, 11]].forEach(function (c) { p.ell(c[0], c[1], 3, 2.2, '#d9962e'); p.px(c[0] - 1, c[1] - 1, '#f2c25a'); p.px(c[0] + 1, c[1] + 1, '#b5701e'); }); };
  ICON.bubur_ubi = function (p) { p.ell(8, 8, 5.5, 2.5, '#c79ad0'); p.px(6, 8, '#f3e9f5'); p.px(7, 7, '#f3e9f5'); p.px(9, 8, '#f3e9f5'); p.px(10, 7, '#8e4a8a'); bowl(p, '#a0623a', '#7a4426'); };
  ICON.kuih_pandan = function (p) { p.ell(8, 12, 7, 3, '#5aa83e'); [[3, 5], [8, 7]].forEach(function (c) { p.rect(c[0], c[1], 6, 6, '#f5f0e1'); p.rect(c[0], c[1], 6, 3, '#5cbf4f'); p.rect(c[0], c[1], 6, 1, '#8fe07a'); p.rect(c[0] + 5, c[1], 1, 6, '#c9c2ad'); }); };
  ICON.nasi_lemak = function (p) {
    p.poly([[8, 1], [15, 8], [8, 15], [1, 8]], '#3f8f3a'); p.poly([[8, 3], [13, 8], [8, 13], [3, 8]], '#5aa83e');
    p.disc(7, 8, 3, '#ffffff'); p.disc(11, 7, 1.6, '#c8321e'); p.px(10, 6, '#e85a3a');
    p.disc(10, 11, 1.5, '#ffffff'); p.px(10, 11, '#f5c542'); p.disc(5, 11, 1.2, '#8fd06a'); p.px(5, 11, '#e9f5d0'); p.px(11, 9, '#c98a4a'); p.px(12, 10, '#c98a4a');
  };
  ICON.pulut_mangga = function (p) { p.ell(8, 11, 7, 3.5, '#e9e4d8'); p.ell(8, 11, 5.5, 2.4, '#f5f0e8'); p.disc(5, 9, 3, '#ffffff'); p.speck(3, 7, 5, 4, '#e3e0d0', 4); [[9, 7], [10, 9], [11, 11]].forEach(function (c) { p.rect(c[0], c[1], 4, 2, '#f4b93a'); p.rect(c[0], c[1], 4, 1, '#ffd36a'); }); p.px(5, 7, '#fff8e6'); p.px(4, 8, '#fff8e6'); p.px(6, 9, '#3a2a20'); };
  ICON.air_merah = function (p) { p.rect(6, 6, 5, 9, '#d62828'); p.rect(7, 4, 3, 2, '#d62828'); p.rect(6, 6, 1, 8, '#ff7a7a'); p.rect(10, 6, 1, 9, '#9e1b1b'); p.rect(6, 9, 5, 2, '#f5f0e1'); p.line(9, 5, 12, 0, '#f5f5f5'); p.px(10, 3, '#e85d5d'); p.px(11, 1, '#e85d5d'); };
  ICON.colok = function (p) {
    p.ell(8, 13, 5, 2, '#c9a46a'); p.rect(3, 12, 11, 1, '#a8834f');
    p.line(5, 12, 6, 4, '#b8322a'); p.line(8, 12, 8, 3, '#b8322a'); p.line(11, 12, 10, 4, '#b8322a');
    p.px(6, 3, '#ff9a3a'); p.px(8, 2, '#ffd166'); p.px(10, 3, '#ff9a3a'); p.px(7, 1, '#c8c8d0'); p.px(9, 0, '#c8c8d0'); p.px(11, 1, '#c8c8d0');
  };
  ICON.malai = function (p) {
    for (var i = 0; i < 14; i++) { var a = i / 14 * Math.PI * 2; p.disc(8 + Math.cos(a) * 4.5, 6 + Math.sin(a) * 4, 1.2, i % 2 ? '#ffffff' : '#ece6d6'); }
    p.disc(8, 11, 1.8, '#d62828'); p.px(6, 11, '#3a8a2a'); p.px(10, 11, '#3a8a2a'); p.rect(7, 13, 1, 3, '#f5d76e'); p.rect(9, 13, 1, 3, '#f5d76e'); p.px(8, 14, '#d62828');
  };
  ICON.canang = function (p) {
    p.rect(2, 8, 12, 6, '#b9c86a'); p.rect(2, 13, 12, 1, '#93a24a'); for (var x = 3; x < 14; x += 3) p.rect(x, 8, 1, 6, '#93a24a');
    p.disc(5, 8, 2, '#d62828'); p.disc(11, 8, 2, '#ffffff'); p.disc(8, 6, 2, '#f5c542'); p.disc(8, 10, 1.6, '#5a5ad6'); p.px(8, 8, '#4f9a3a');
    p.line(8, 6, 9, 1, '#b8322a'); p.px(9, 0, '#ff9a3a');
  };
  ICON.kepeng = function (p) { p.disc(8, 8, 6, '#c9a04a'); p.disc(7.5, 7.5, 4.8, '#e0bb62'); p.px(5, 5, '#f7dd8a'); p.px(4, 7, '#f7dd8a'); p.clear(7, 7, 2, 2); p.rect(6, 6, 4, 1, '#9c7a2e'); p.rect(6, 9, 4, 1, '#9c7a2e'); p.rect(6, 6, 1, 4, '#9c7a2e'); p.rect(9, 6, 1, 4, '#9c7a2e'); p.clear(7, 7, 2, 2); };

  // small HUD icons (12x12)
  var HUD = {};
  HUD.ic_full = function (p) { p.disc(6, 5, 3.5, '#ffffff'); p.ell(6, 7.5, 5, 2.5, '#e9eef5'); p.rect(1, 6, 10, 2, '#e9eef5'); p.rect(1, 8, 10, 1, '#4a78b8'); };
  HUD.ic_joy = function (p) { p.disc(4, 4.5, 2.6, '#ff6b9a'); p.disc(8, 4.5, 2.6, '#ff6b9a'); p.poly([[1.5, 5], [10.5, 5], [6, 10.5]], '#ff6b9a'); p.px(3, 3, '#ffc2d6'); };
  HUD.ic_glow = function (p) { p.poly([[6, 0], [10, 7], [6, 11], [2, 7]], '#ff9a3a'); p.poly([[6, 3], [8.5, 7.5], [6, 10], [3.5, 7.5]], '#ffd166'); p.px(6, 8, '#fff3b0'); };
  HUD.ic_coin = function (p) { p.disc(6, 6, 5, '#c9a04a'); p.disc(5.5, 5.5, 3.8, '#e0bb62'); p.clear(5, 5, 2, 2); p.px(3, 3, '#f7dd8a'); };
  HUD.ic_energy = function (p) { p.poly([[7, 0], [2, 7], [6, 7], [4, 12], [10, 4], [6, 4]], '#9be15d'); p.px(6, 2, '#d9ff9a'); };
  HUD.ic_sun = function (p) { p.disc(6, 6, 3.2, '#ffd166'); [[6, 0], [6, 11], [0, 6], [11, 6], [2, 2], [9, 2], [2, 9], [9, 9]].forEach(function (c) { p.px(c[0], c[1], '#ffb347'); }); };
  HUD.ic_moon = function (p) { p.disc(6, 6, 4.5, '#f2e9c9'); p.disc(8, 4.5, 3.6, 'rgba(0,0,0,1)'); p.ctx.globalCompositeOperation = 'destination-out'; p.disc(8, 4.5, 3.6, '#000'); p.ctx.globalCompositeOperation = 'source-over'; };
  HUD.ic_bond = function (p) { [[6, 1], [10, 5], [8, 10], [4, 10], [2, 5]].forEach(function (c) { p.disc(c[0], c[1], 2, '#fffaf0'); }); p.disc(6, 6, 2, '#f5c542'); };

  // ================================================================== GENERATE
  Art.generate = function (scene) {
    buildTiles(scene);
    for (var pc = 0; pc < OUTFITS.length; pc++) {
      ['down', 'up', 'side'].forEach(function (d) {
        for (var f = 0; f < 3; f++) make(scene, Art.plKey(pc) + '_' + d + '_' + f, 16, 16, function (p) { drawPlayer(p, d, f, pc); });
      });
    }
    for (var st = 0; st < 5; st++) GHOST_EXPR.forEach(function (ex) { make(scene, 'ghost_' + st + '_' + ex, 20, 22, function (p) { drawGhost(p, st, ex); }); });
    make(scene, 'npc_ani_0', 16, 20, function (p) { drawAni(p, false); });
    make(scene, 'npc_ani_1', 16, 20, function (p) { drawAni(p, true); });
    make(scene, 'kerbau_0', 30, 20, function (p) { drawKerbau(p, 0); });
    make(scene, 'kerbau_1', 30, 20, function (p) { drawKerbau(p, 1); });
    for (var cf = 0; cf < 3; cf++) make(scene, 'chicken_' + cf, 13, 13, function (p) { drawChicken(p, cf); });

    Object.keys(LC.CROPS).forEach(function (id) { for (var s = 0; s < 4; s++) make(scene, 'crop_' + id + '_' + s, 16, 16, function (p) { crop(p, id, s); }); });

    make(scene, 'house', 80, 96, drawHouse, true);
    make(scene, 'spirit_house', 24, 44, drawSpiritHouse, true);
    make(scene, 'frangipani', 44, 48, drawFrangipani, true);
    make(scene, 'dapur', 32, 28, drawDapur, true);
    make(scene, 'well', 24, 32, drawWell, true);
    make(scene, 'warung_back', 72, 64, drawWarungBack, true);
    make(scene, 'warung_front', 72, 64, drawWarungFront, true);
    make(scene, 'torch_off', 11, 31, function (p) { drawTorch(p, false); }, true);
    make(scene, 'torch_on', 11, 31, function (p) { drawTorch(p, true); }, true);
    make(scene, 'palm', 48, 72, function (p) { drawPalm(p, false); }, true);
    make(scene, 'palm_f', 48, 72, function (p) { drawPalm(p, true); }, true);
    make(scene, 'banana', 36, 44, function (p) { drawBanana(p, false); }, true);
    make(scene, 'banana_f', 36, 44, function (p) { drawBanana(p, true); }, true);
    make(scene, 'mango', 64, 64, function (p) { drawMango(p, false); }, true);
    make(scene, 'mango_f', 64, 64, function (p) { drawMango(p, true); }, true);
    make(scene, 'woodpile', 18, 13, function (p) {
      [[4, 9], [9, 9], [14, 9], [6.5, 5], [11.5, 5]].forEach(function (c) { p.disc(c[0], c[1], 2.6, '#8a5a2b'); p.disc(c[0], c[1], 1.5, '#c9925a'); p.px(c[0], c[1], '#8a5a2b'); });
    }, true);
    make(scene, 'sign', 16, 22, function (p) {
      p.rect(7, 10, 2, 12, '#6b4423'); p.rect(1, 2, 14, 9, '#b07a45'); p.rect(1, 2, 14, 1, '#d09a60'); p.rect(1, 10, 14, 1, '#7a4b28');
      p.rect(3, 5, 6, 1, '#4a2e18'); p.rect(3, 7, 4, 1, '#4a2e18'); p.poly([[9, 4], [13, 6.5], [9, 9]], '#c8323a');
    }, true);
    make(scene, 'barrier', 14, 32, function (p) {
      p.rect(2, 4, 2, 28, '#6b4423'); p.rect(10, 4, 2, 28, '#6b4423');
      [6, 18].forEach(function (y) { p.rect(0, y, 14, 4, '#f5f0e1'); for (var x = 0; x < 14; x += 4) p.rect(x, y, 2, 4, '#c8323a'); });
    }, true);
    make(scene, 'rock', 10, 8, function (p) { p.ell(5, 4.5, 4.5, 3.2, '#8d8f94'); p.ell(4, 3.5, 3, 2, '#a8aab0'); p.px(7, 6, '#6e7075'); }, true);
    make(scene, 'bush', 16, 12, function (p) { p.disc(5, 7, 4, '#3f8a3a'); p.disc(11, 7, 4, '#3f8a3a'); p.disc(8, 5, 4, '#4f9a42'); p.speck(2, 2, 12, 8, '#62ad50', 6); }, true);
    make(scene, 'hibiscus', 16, 13, function (p) {
      p.disc(5, 8, 4, '#3f8a3a'); p.disc(11, 8, 4, '#3f8a3a'); p.disc(8, 6, 4, '#4f9a42');
      [[5, 5], [11, 6], [8, 9]].forEach(function (f) { p.disc(f[0], f[1], 1.8, '#e0283a'); p.px(f[0], f[1], '#ffd166'); });
    }, true);
    make(scene, 'lalang', 12, 12, function (p) { for (var i = 0; i < 6; i++) { var x = 2 + i * 1.6; p.line(x, 11, x + (i - 2.5) * 0.9, 1 + (i % 3), i % 2 ? '#8fbf5a' : '#6fa34a'); } p.px(3, 1, '#e8e2c8'); p.px(8, 2, '#e8e2c8'); }, true);

    // offering overlays on the spirit-house shelf
    make(scene, 'off_colok', 7, 9, function (p) { p.rect(1, 6, 5, 3, '#c9a46a'); p.line(2, 6, 2, 1, '#b8322a'); p.line(4, 6, 4, 0, '#b8322a'); p.px(2, 0, '#ff9a3a'); p.px(4, 0, '#ffd166'); });
    make(scene, 'off_malai', 8, 7, function (p) { for (var i = 0; i < 10; i++) { var a = i / 10 * Math.PI * 2; p.px(4 + Math.cos(a) * 3, 3 + Math.sin(a) * 2.5, '#ffffff'); } p.px(4, 6, '#d62828'); });
    make(scene, 'off_canang', 9, 6, function (p) { p.rect(0, 3, 9, 3, '#b9c86a'); p.px(2, 2, '#d62828'); p.px(4, 1, '#f5c542'); p.px(6, 2, '#ffffff'); p.px(4, 3, '#5a5ad6'); });
    make(scene, 'off_food', 9, 5, function (p) { p.ell(4.5, 3.5, 4.5, 1.5, '#e9e4d8'); p.disc(4.5, 2, 2, '#ffffff'); p.px(6, 1, '#f4b93a'); });

    // fx
    make(scene, 'shadow', 12, 5, function (p) { p.ell(6, 2.5, 6, 2.5, 'rgba(0,0,0,0.28)'); });
    make(scene, 'cursor', 16, 16, function (p) {
      var c = '#fffdf2';
      p.rect(0, 0, 4, 1, c); p.rect(0, 0, 1, 4, c); p.rect(12, 0, 4, 1, c); p.rect(15, 0, 1, 4, c);
      p.rect(0, 15, 4, 1, c); p.rect(0, 12, 1, 4, c); p.rect(12, 15, 4, 1, c); p.rect(15, 12, 1, 4, c);
    });
    make(scene, 'bubble', 22, 21, function (p) {
      p.rect(2, 1, 18, 16, '#fffdf7'); p.rect(1, 2, 20, 14, '#fffdf7');
      p.px(5, 17, '#fffdf7'); p.px(6, 17, '#fffdf7'); p.px(4, 18, '#fffdf7'); p.px(3, 19, '#fffdf7');
    }, '#3b2f5c');
    make(scene, 'heart', 7, 6, function (p) { p.str(['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'], { '#': '#ff6b9a' }); p.px(1, 1, '#ffc2d6'); });
    make(scene, 'sparkle', 5, 5, function (p) { p.str(['..#..', '..#..', '##+##', '..#..', '..#..'], { '#': '#fff3b0', '+': '#ffffff' }); });
    make(scene, 'leaf', 3, 3, function (p) { p.str(['.#.', '##+', '.#.'], { '#': '#6cbf4a', '+': '#4f9a3a' }); });
    make(scene, 'drop', 2, 3, function (p) { p.str(['#.', '##', '##'], { '#': '#8fd3ff' }); });
    make(scene, 'smoke', 6, 6, function (p) { p.disc(3, 3, 3, '#d8d8e0'); p.px(2, 2, '#f0f0f5'); });
    make(scene, 'petal', 2, 2, function (p) { p.rect(0, 0, 2, 2, '#fffaf0'); });
    make(scene, 'dirt', 3, 3, function (p) { p.str(['.#.', '###', '.#.'], { '#': '#7b5030' }); });
    make(scene, 'firefly', 3, 3, function (p) { p.str(['.+.', '+#+', '.+.'], { '#': '#fdffb0', '+': '#c8ff70' }); });
    make(scene, 'zz', 5, 5, function (p) { p.str(['#####', '...#.', '..#..', '.#...', '#####'], { '#': '#d3cbf2' }); });
    make(scene, 'sky_lantern', 7, 9, function (p) { p.rect(1, 1, 5, 6, '#ffb347'); p.rect(0, 2, 7, 4, '#ffb347'); p.rect(1, 1, 5, 1, '#ffd27a'); p.rect(2, 3, 3, 3, '#fff3b0'); p.rect(2, 7, 3, 1, '#c8642a'); p.px(3, 8, '#ffd166'); });
    make(scene, 'px', 4, 4, function (p) { p.rect(0, 0, 4, 4, '#ffffff'); });
    var g = canvas(64, 64), gctx = g.getContext('2d'), grad = gctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)'); grad.addColorStop(0.25, 'rgba(255,255,255,0.6)'); grad.addColorStop(0.6, 'rgba(255,255,255,0.18)'); grad.addColorStop(1, 'rgba(255,255,255,0)');
    gctx.fillStyle = grad; gctx.fillRect(0, 0, 64, 64);
    if (scene.textures.exists('glow')) scene.textures.remove('glow');
    scene.textures.addCanvas('glow', g);
    scene.textures.get('glow').setFilter(Phaser.Textures.FilterMode.LINEAR);

    Object.keys(LC.ITEMS).forEach(function (id) { if (ICON[id]) make(scene, 'i_' + id, 16, 16, ICON[id], true); });
    make(scene, 'i_kepeng', 16, 16, ICON.kepeng, true);
    Object.keys(HUD).forEach(function (k) { make(scene, k, 12, 12, HUD[k], true); });
    if (Art.generate2) Art.generate2(scene);
    if (Art.generate3) Art.generate3(scene);
    if (Art.generate4) Art.generate4(scene);
    if (Art.generate5) Art.generate5(scene);
    if (Art.generate6) Art.generate6(scene);
  };
})(window.LC);
