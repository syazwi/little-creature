/* Sprites for Chapter 15. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art;
  Art.generate28 = function (scene) {
    for (var i = 0; i < 4; i++) (function (frame) {
      Art.make(scene, 'api15_' + frame, 12, 18, function (p) {
        var tip = 3 + frame % 3;
        p.poly([[1, 16], [2, 9], [3, 11], [tip, 1 + frame % 2], [8, 7], [10, 5], [11, 13], [10, 16], [8, 18], [3, 18]], '#a42d25');
        p.poly([[2, 15], [3, 10], [5, 12], [tip + 1, 3], [8, 8], [9, 7], [10, 14], [8, 17], [4, 17]], '#f07428');
        p.poly([[4, 16], [4, 13], [6, 14], [7, 7 + frame % 3], [9, 14], [8, 17], [5, 17]], '#ffca46');
        p.poly([[5, 16], [7, 12], [8, 16], [7, 18]], '#fff1a6');
      });
      Art.make(scene, 'sibara15_' + frame, 16, 18, function (p) { bara(p, frame, false); }, true);
    })(i);
    for (var j = 0; j < 3; j++) (function (n) {
      Art.make(scene, 'hangus15_' + n, 20, 10, function (p) {
        p.poly([[0, 6], [3, 3 + n], [8, 1], [14, 2], [17, n], [19, 5], [16, 8], [9, 9], [3, 8]], '#2a2018');
        p.ell(10, 6, 6, 2, '#392820'); p.px(6 + n, 4, '#873e24'); p.px(12, 6, '#a65731');
      });
    })(j);
    for (var k = 0; k < 2; k++) (function (frame) {
      Art.make(scene, 'sibara15_sad_' + frame, 16, 18, function (p) { bara(p, frame, true); }, true);
      Art.make(scene, 'sumbu15_lit_' + frame, 8, 12, function (p) {
        fuse(p); p.line(4, 3, frame ? 7 : 6, 1, '#ffa545'); p.line(1, 2, 6, 4, '#ffcf56'); p.px(4, 2, '#fff4c7');
      });
    })(k);
    Art.make(scene, 'sumbu15_out', 8, 12, function (p) { fuse(p); p.px(4, 2, '#918678'); p.px(3, 1, '#bab0a2'); });
    Art.make(scene, 'stim15', 10, 10, function (p) {
      p.ell(4, 6, 3, 2, '#c9e2e2'); p.ell(6, 4, 3, 3, '#edf8ee'); p.ell(4, 4, 2, 2, '#fffbea');
    });
    Art.make(scene, 'baldi15', 14, 14, function (p) {
      p.line(2, 6, 4, 2, '#aab5bb'); p.line(4, 2, 9, 2, '#d4dcd7'); p.line(9, 2, 12, 6, '#aab5bb');
      p.poly([[1, 6], [13, 6], [11, 13], [3, 13]], '#507998');
      p.ell(7, 6, 5, 1.2, '#b8dce3'); p.line(3, 8, 10, 8, '#83b9c9'); p.line(5, 9, 5, 11, '#a2d0e2');
    }, true);
    Art.make(scene, 'jerami15', 24, 20, function (p) {
      p.poly([[0, 18], [4, 11], [7, 7], [10, 2], [14, 2], [20, 9], [23, 18], [20, 19], [4, 19]], '#8b542f');
      p.poly([[2, 17], [7, 10], [11, 3], [14, 4], [19, 11], [21, 17]], '#d6a046');
      p.line(4, 14, 20, 14, '#a06d36'); p.line(7, 10, 17, 10, '#b57c36'); p.line(8, 13, 12, 5, '#edc65b');
      p.line(10, 18, 13, 10, '#eabd59'); p.line(15, 9, 18, 16, '#f2ca67'); p.px(5, 16, '#ffde80');
    }, true);
    Art.make(scene, 'meja15', 24, 15, function (p) {
      p.rect(2, 5, 3, 10, '#755241'); p.rect(19, 5, 3, 10, '#755241');
      p.poly([[2, 1], [22, 1], [24, 6], [0, 6]], '#b88454'); p.rect(0, 6, 24, 2, '#78523c'); p.line(2, 3, 22, 3, '#d8a26b');
    }, true);
    [false, true].forEach(function (open) {
      Art.make(scene, open ? 'peti15_open' : 'peti15', 20, 16, function (p) {
        p.rect(1, 6, 18, 9, '#55372a'); p.rect(2, 7, 16, 7, '#a46f45');
        p.line(3, 11, 17, 11, '#72482d'); p.rect(4, 7, 2, 8, '#805031'); p.rect(14, 7, 2, 8, '#805031');
        if (open) {
          p.poly([[1, 6], [3, 3], [18, 3], [19, 6]], '#402a26');
          p.line(5, 6, 4, 1, '#e0864c'); p.line(9, 6, 9, 0, '#71b9b4'); p.line(14, 6, 16, 0, '#d47569');
        } else {
          p.rect(1, 4, 18, 4, '#c48b58'); p.line(2, 4, 17, 4, '#e3aa70');
          p.rect(8, 6, 4, 4, '#dfb965'); p.px(9, 8, '#604831');
        }
      }, true);
    });
    Art.make(scene, 'i_topeng_jerebu', 16, 16, function (p) {
      p.line(0, 6, 2, 5, '#c5dfdf'); p.line(0, 6, 2, 10, '#c5dfdf'); p.line(13, 5, 15, 6, '#c5dfdf'); p.line(13, 10, 15, 6, '#c5dfdf');
      p.poly([[2, 5], [13, 5], [13, 10], [11, 12], [4, 12], [2, 10]], '#81c4d0');
      p.line(3, 6, 12, 6, '#e0f1ea'); p.line(4, 8, 11, 8, '#aee2e3'); p.line(4, 10, 11, 10, '#569ead');
    }, true);
    Art.make(scene, 'tapak15', 8, 10, function (p) {
      p.ell(4, 4, 2.1, 2.3, '#ffae49'); p.ell(3, 7, 1.4, 1.6, '#ed7933'); p.px(4, 1, '#fff0a4'); p.px(6, 2, '#ffcf75');
    });
    if (!scene.anims.exists('api15')) scene.anims.create({ key: 'api15', frames: [0, 1, 2, 3].map(function (n) { return { key: 'api15_' + n }; }), frameRate: 10, repeat: -1 });
  };
  function fuse(p) { p.ell(4, 10, 3, 1, '#71604a'); p.line(3, 10, 5, 7, '#8a6b44'); p.line(5, 7, 4, 3, '#ac895b'); }
  function bara(p, frame, sad) {
    p.poly([[3, 11], [3, 7], [5, 8], [7, sad ? 4 : 1 + frame % 3], [9, 6], [12, 4 + frame % 2], [13, 10]], '#e86629');
    p.ell(8, 11, 6, 6, '#b9422a'); p.ell(8, 11, 4.5, 4.5, '#f58437'); p.ell(8, 12, 3, 2.2, '#ffbd4e');
    p.ell(2, 12, 1.4, 1.3, '#f18739'); p.ell(14, 12, 1.4, 1.3, '#ee7d38');
    p.rect(5, 9, 2, 2, '#fff4ac'); p.rect(9, 9, 2, 2, '#fff4ac');
    p.line(7, sad ? 14 : 12, 9, sad ? 13 : 13, '#582531');
    if (sad) { p.px(10, 12 + frame, '#e9f9fb'); p.px(11, 15, '#bce9f2'); }
  }
})(window.LC);
