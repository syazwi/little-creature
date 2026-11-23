/* Pixel art for Chapter 16, Kampung Mamai? (v3.16): the majlis mats and food trays, the kitchen pots (empty, nasi
 * minyak, ayam masak merah, seri muka), the jar of Serbuk Lena, Nek Lampir's lantern, and the Jamu Bangun and Senduk
 * Lampir icons. Nek Lampir's spirit and the sleepwalkers reuse the existing villager pictures, tinted at runtime. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art;
  Art.generate29 = function (scene) {
    function make(key, w, h, draw, outline) { Art.make(scene, key, w, h, draw, outline === undefined ? true : outline); }
    // ---- a woven mengkuang mat (48 x 14)
    make('tikar16', 48, 14, function (p) {
      p.poly([[3, 1], [45, 1], [47, 13], [1, 13]], '#d8b46a');
      for (var x = 4; x < 46; x += 4) p.line(x, 1, x - 2, 13, '#b8904a');
      for (var y = 3; y < 13; y += 3) p.rect(2, y, 44, 1, '#c8a058');
      p.rect(1, 12, 46, 1, '#a87a3a'); p.rect(6, 5, 6, 3, '#b8323a'); p.rect(36, 5, 6, 3, '#2a6a4a');
    });
    // ---- a brass dulang with three dishes (24 x 12)
    make('dulang16', 24, 12, function (p) {
      p.ell(12, 8, 11, 3.6, '#a8782a'); p.ell(12, 7, 10, 3, '#e0b04a');
      p.disc(6, 6, 3, '#f4f0e4'); p.disc(6, 5, 2, '#f0c040');                   // nasi minyak
      p.disc(12, 6, 3, '#f4f0e4'); p.disc(12, 5, 2, '#c83a2a'); p.px(11, 4, '#e8a030');   // ayam masak merah
      p.rect(16, 4, 5, 4, '#f4f0e4'); p.rect(16, 4, 5, 2, '#5ab86a');           // seri muka
    });
    // ---- the kitchen pots (16 x 16): empty, and the three dishes
    function pot(p, fill, top) {
      p.ell(8, 13, 7, 2.4, '#2a1e18'); p.rect(2, 7, 12, 6, '#4a4a52'); p.rect(2, 7, 12, 1, '#7a7a82'); p.rect(1, 8, 1, 2, '#3a3a42'); p.rect(14, 8, 1, 2, '#3a3a42');
      if (fill) { p.ell(8, 7, 5.5, 1.8, fill); if (top) top(p); }
      else p.ell(8, 7, 5.5, 1.8, '#1a1a20');
    }
    make('periuk16_kosong', 16, 16, function (p) { pot(p, null); });
    make('periuk16_nasi', 16, 16, function (p) { pot(p, '#f0c850', function (p2) { p2.px(6, 6, '#fff0a0'); p2.px(9, 7, '#8a5a2a'); p2.px(11, 6, '#fff0a0'); }); });
    make('periuk16_ayam', 16, 16, function (p) { pot(p, '#c8321e', function (p2) { p2.px(6, 6, '#e8a030'); p2.px(8, 7, '#f0d040'); p2.px(10, 6, '#8a2a1a'); p2.px(11, 7, '#f0d040'); }); });
    make('periuk16_seri', 16, 16, function (p) {
      p.ell(8, 13, 7, 2, '#a8782a'); p.rect(2, 8, 12, 4, '#e0b04a');
      [[3, 5], [7, 5], [11, 5]].forEach(function (k) { p.rect(k[0], k[1] + 2, 3, 3, '#f4f0e4'); p.rect(k[0], k[1], 3, 2, '#5ab86a'); });
    });
    // ---- the jar of Serbuk Lena (12 x 16), with its old label
    make('balang16', 12, 16, function (p) {
      p.rect(3, 1, 6, 2, '#6a4a2a'); p.rect(2, 3, 8, 12, '#a8c8d0'); p.rect(3, 4, 6, 10, '#d8eef0');
      p.rect(3, 7, 6, 5, '#f0e0b0'); p.line(4, 8, 7, 8, '#6a3a5a'); p.line(4, 10, 7, 10, '#6a3a5a');
      p.px(3, 13, '#f0d040'); p.px(5, 13, '#f0d040');   // the last yellow grains
    });
    // ---- Nek Lampir's lantern (12 x 18)
    make('tanglung16', 12, 18, function (p) {
      p.rect(5, 0, 2, 3, '#3a2a1a'); p.rect(2, 3, 8, 2, '#5a3a22');
      p.rect(2, 5, 8, 9, '#3a2a1a'); p.rect(3, 6, 6, 7, '#bfe0ff'); p.rect(4, 7, 4, 5, '#e8f6ff'); p.px(5, 8, '#ffffff');
      p.rect(2, 14, 8, 2, '#5a3a22'); p.px(6, 16, '#3a2a1a'); p.px(6, 17, '#5a7a4a');   // a little frog charm, of course
    });
    // ---- sleepwalker arms, stretched out in front (12 x 5)
    make('lengan16', 12, 5, function (p) {
      p.rect(0, 0, 10, 2, '#b07a52'); p.rect(0, 3, 10, 2, '#a06a44'); p.px(10, 0, '#c88a62'); p.px(10, 3, '#b87a52');
    });
    // ---- icons
    make('i_jamu_bangun', 16, 16, function (p) {
      p.rect(4, 4, 8, 10, '#7a5a3a'); p.rect(5, 5, 6, 8, '#c8a04a'); p.rect(5, 5, 6, 2, '#e8c870');
      p.rect(12, 6, 2, 5, '#7a5a3a'); p.line(6, 2, 7, 0, '#e8e8e8'); p.line(9, 2, 10, 0, '#e8e8e8');
    });
    make('i_senduk_lampir', 16, 16, function (p) {
      p.line(3, 13, 10, 5, '#8a5a30', 2); p.ell(12, 4, 3, 2.4, '#a8783a'); p.ell(12, 4, 2, 1.4, '#6a4420'); p.px(4, 12, '#5a7a4a');
    });
  };
})(window.LC);
