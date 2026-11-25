/* The keeper and the carved trial doors (v3.18: and the bigger mirror door). */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art;
  var signs = {
    sea: function (p, c) { p.line(10, 19, 13, 16, c, 2); p.line(13, 16, 16, 19, c, 2); p.line(16, 19, 21, 15, c, 2); p.line(11, 23, 20, 23, c, 2); },
    warrior: function (p, c) { p.line(10, 23, 21, 12, c, 2); p.line(10, 12, 21, 23, c, 2); p.line(17, 12, 21, 12, c, 2); p.line(10, 12, 10, 16, c, 2); },
    magic: function (p, c) { p.poly([[15, 11], [17, 16], [22, 18], [17, 20], [15, 25], [13, 20], [8, 18], [13, 16]], c); },
    spirit: function (p, c) { p.ell(15, 17, 5, 6, c); p.poly([[11, 17], [19, 17], [20, 24], [15, 22], [10, 24]], c); p.px(13, 16, '#26394a'); p.px(17, 16, '#26394a'); }
  };
  Art.generate26 = function (scene) {
    Art.make(scene, 'bunian_trial_keeper', 22, 28, function (p) {
      p.poly([[7, 14], [16, 14], [20, 27], [3, 27]], '#435766'); p.rect(8, 6, 8, 11, '#b98565');
      p.poly([[5, 7], [8, 2], [15, 2], [19, 7]], '#436b64'); p.line(6, 7, 18, 7, '#e3bc7d');
      p.rect(9, 15, 6, 4, '#e7d7b5'); p.px(9, 11, '#332a35'); p.px(14, 11, '#332a35');
      p.line(7, 22, 16, 22, '#cf9d65', 2); p.line(19, 13, 18, 27, '#805a49'); p.px(19, 12, '#e8d79c');
    }, true);
    LC.BunianTrials.doors.forEach(function (d) {
      var c = '#' + d.color.toString(16);
      if (d.mirror) { mirrorDoor(d, c); return; }
      Art.make(scene, d.texture, 31, 40, function (p) {
        p.poly([[1, 38], [1, 15], [5, 6], [15, 1], [25, 6], [29, 15], [29, 38]], '#46394e');
        p.poly([[4, 36], [4, 15], [8, 8], [15, 4], [22, 8], [26, 15], [26, 36]], '#89727c');
        p.poly([[8, 35], [8, 15], [11, 11], [15, 8], [19, 11], [22, 15], [22, 35]], '#27354b');
        p.line(5, 34, 5, 16, c); p.line(25, 34, 25, 16, c); p.line(7, 35, 23, 35, '#d5ba8f');
        signs[d.id](p, c);
        p.rect(3, 37, 25, 2, '#b19a83'); p.px(15, 4, '#fff2cc');
      }, true);
    });
    // v3.18: Pintu Cermin, the bigger fifth door: a dark arch around a tall mirror, and a shadow of you inside it
    function mirrorDoor(d, c) {
      Art.make(scene, d.texture, 54, 60, function (p) {
        p.poly([[1, 59], [1, 22], [6, 11], [15, 4], [27, 1], [39, 4], [48, 11], [53, 22], [53, 59]], '#2a1f33');
        p.poly([[4, 57], [4, 23], [9, 13], [17, 7], [27, 4], [37, 7], [45, 13], [50, 23], [50, 57]], '#6e6082');
        p.poly([[8, 56], [8, 24], [12, 16], [19, 11], [27, 9], [35, 11], [42, 16], [46, 24], [46, 56]], '#1b2233');
        p.poly([[10, 54], [10, 25], [14, 18], [20, 14], [26, 12], [12, 40]], '#26314a');
        p.line(13, 50, 22, 18, '#8fa0c8'); p.line(16, 52, 25, 22, '#59688f'); p.line(36, 52, 43, 30, '#59688f');
        p.ell(27, 31, 5, 5, '#0c0812'); p.poly([[20, 55], [21, 41], [24, 36], [30, 36], [33, 41], [34, 55]], '#0c0812');
        p.line(20, 33, 34, 33, '#0c0812', 2); p.px(25, 31, '#ff3b4f'); p.px(29, 31, '#ff3b4f');
        p.line(34, 13, 31, 21, '#c8d4f0'); p.line(31, 21, 36, 27, '#c8d4f0'); p.line(31, 21, 27, 24, '#8fa0c8');
        p.line(6, 55, 6, 24, c); p.line(48, 55, 48, 24, c); p.line(11, 9, 16, 6, c); p.line(38, 6, 43, 9, c);
        p.rect(2, 56, 50, 3, '#b19a83'); p.rect(0, 58, 54, 2, '#8a7563');
        p.disc(27, 4, 2, c); p.px(27, 3, '#fff2cc');
      }, true);
    }
  };
})(window.LC);
