/* Pixel art for the sorcery school, its students, and its guardians. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art;
  function sorcerer(p, frame, masked) {
    var robe = masked ? '#382849' : '#354b78', trim = masked ? '#db79ac' : '#e8b66e';
    p.poly([[8, 13], [17, 13], [22 + frame, 27], [2, 27]], '#261f38');
    p.poly([[9, 15], [16, 15], [20, 25], [5, 25]], robe);
    p.rect(8, 5, 11, 10, '#292437'); p.rect(9, 6, 8, 8, masked ? '#e3b8ce' : '#c58c6a');
    p.rect(10, 8, 2, 1, '#352a40'); p.rect(15, 8, 2, 1, '#352a40');
    p.poly([[6, 6], [9, 2], [16, 2], [20, 6]], robe); p.line(7, 5, 19, 5, trim);
    p.line(9, 16, 16, 22, trim, 2); p.line(8, 23, 17, 23, trim);
    p.line(20, 12 - frame, 20, 25, '#926646'); p.px(20, 11 - frame, '#f9e1b4'); p.px(12, 3, '#ffe2ad');
  }
  Art.generate25 = function (scene) {
    function make(key, w, h, draw) { Art.make(scene, key, w, h, draw, true); }
    make('mantera_letter', 16, 18, function (p) {
      p.poly([[1, 7], [10, 3], [15, 9], [12, 14], [2, 13]], '#d6a369');
      p.poly([[2, 7], [9, 5], [13, 8], [8, 11]], '#ffebba'); p.line(2, 8, 8, 12, '#d4af74');
      p.rect(8, 9, 3, 3, '#9b5774'); p.px(9, 9, '#ebabad'); p.px(14, 4, '#dec6fc');
    });
    make('mantera_gate', 26, 31, function (p) {
      p.poly([[2, 29], [2, 13], [6, 5], [13, 1], [21, 5], [24, 13], [24, 29]], '#694e63');
      p.poly([[5, 28], [5, 13], [8, 7], [13, 4], [19, 8], [21, 13], [21, 28]], '#c19c87');
      p.poly([[8, 28], [8, 13], [13, 8], [18, 13], [18, 28]], '#51405e');
      p.line(2, 26, 23, 26, '#9d7690'); p.rect(12, 4, 3, 3, '#e7c18e'); p.px(17, 20, '#e7c18e');
    });
    function school(p) {
      p.rect(10, 22, 76, 27, '#ad8058'); p.rect(9, 45, 78, 5, '#6a5049');
      p.poly([[1, 28], [15, 18], [49, 3], [78, 17], [95, 28], [69, 25], [49, 14], [25, 25]], '#4e3b65');
      p.line(4, 25, 49, 6, '#9879a7', 2); p.line(49, 6, 91, 25, '#9879a7', 2);
      p.line(2, 28, 30, 24, '#ba9099'); p.line(92, 28, 66, 24, '#ba9099');
      p.rect(39, 30, 18, 18, '#604358'); p.rect(42, 32, 12, 16, '#765776');
      [17, 65].forEach(function (x) { p.rect(x, 30, 14, 11, '#644956'); p.rect(x + 2, 32, 10, 7, '#edca8d'); p.rect(x + 6, 32, 2, 7, '#997148'); });
      p.rect(37, 48, 22, 3, '#cab08a'); p.px(48, 27, '#bef0da');
    }
    make('mantera_school', 96, 52, school);
    make('mantera_hut', 53, 31, function (p) {
      p.rect(5, 14, 43, 15, '#a87956'); p.rect(22, 18, 10, 11, '#64445c');
      p.poly([[0, 17], [12, 10], [25, 1], [41, 10], [52, 17], [37, 16], [26, 10], [12, 16]], '#6a506d');
      p.line(3, 16, 25, 3, '#b189a6'); p.line(25, 3, 49, 16, '#b189a6');
      p.rect(11, 19, 7, 5, '#eccc85'); p.rect(35, 19, 7, 5, '#eccc85');
    });
    make('mantera_desk', 23, 18, function (p) {
      p.rect(4, 9, 3, 8, '#69463f'); p.rect(16, 9, 3, 8, '#69463f'); p.rect(2, 6, 19, 5, '#9e674e');
      p.line(3, 6, 20, 6, '#d4aa78'); p.rect(6, 4, 8, 2, '#496c67'); p.px(5, 7, '#e4bf94');
    });
    make('mantera_rune', 23, 19, function (p) {
      p.ell(11, 13, 10, 5, '#5e586b'); p.ell(11, 12, 8, 4, '#9292b0');
      p.poly([[11, 2], [16, 7], [11, 13], [6, 7]], '#a999d7'); p.line(11, 3, 9, 8, '#eddfed');
    });
    make('mantera_pantul', 18, 18, function (p) {
      p.poly([[9, 0], [16, 4], [15, 12], [9, 17], [2, 12], [1, 4]], '#79a6be');
      p.poly([[9, 2], [14, 5], [13, 11], [9, 15], [4, 11], [3, 5]], '#cadcf3');
      p.line(6, 11, 11, 5, '#8c9ed6', 2); p.px(11, 5, '#fff1c0');
    });
    make('mantera_stone', 16, 16, function (p) {
      p.poly([[7, 1], [13, 3], [15, 9], [11, 14], [3, 14], [1, 8]], '#537d79');
      p.poly([[7, 2], [12, 4], [10, 9], [3, 8]], '#99c7a8'); p.line(6, 10, 10, 5, '#ffe4a3');
    });
    [0, 1].forEach(function (f) {
      make('suraya13_' + f, 25, 28, function (p) { sorcerer(p, f, false); });
      make('npc_suraya13_' + f, 25, 28, function (p) { sorcerer(p, f, false); });
      make('collector13_' + f, 25, 28, function (p) { sorcerer(p, f, true); });
      make('golem13_' + f, 26, 28, function (p) {
        p.rect(6 + f, 20, 5, 8, '#57516a'); p.rect(15 - f, 21, 5, 7, '#57516a');
        p.poly([[5, 10], [20, 10], [21, 22], [5, 22]], '#827e93');
        p.rect(1, 12 + f * 2, 5, 9, '#a0a2b1'); p.rect(20, 13 - f * 2, 5, 9, '#a0a2b1');
        p.rect(7, 3, 13, 10, '#9495a8'); p.line(8, 7, 18, 7, '#514961', 2);
        p.px(10, 7, '#ffeeac'); p.px(16, 7, '#ffeeac'); p.line(10, 12, 16, 20, '#aba2cd'); p.px(13, 16, '#e3b8f3');
      });
      make('mantera_student_' + f, 16, 20, function (p) {
        Art.drawVillager(p, { skin: '#b8805d', shirt: '#9184b1', shirt2: '#5d5179', bottom: '#535772', bottom2: '#373950', hair: '#38282f' }, false, f + 1);
      });
    });
    [['npc_suraya13', 'idle'], ['suraya13', 'walk'], ['golem13', 'walk'], ['collector13', 'walk'], ['mantera_student', 'walk']].forEach(function (a) {
      var key = a.join('_');
      if (!scene.anims.exists(key)) scene.anims.create({ key: key, frames: [{ key: a[0] + '_0' }, { key: a[0] + '_1' }], frameRate: a[1] === 'idle' ? 2 : 6, repeat: -1 });
    });
  };
})(window.LC);
