/* Silat with Kesuma and the batu angkat (v3.32): poses for you and for Kesuma, in the Sunnyside farmer's style.
 * The owner: "on the silat with kesuma, every movement should have their own artwork just like silat. On the batu
 * angkat, there should be artwork for player carrying the stone."
 * A pose is your own head (the pack's standing frame, with your hair: Art.folkHead) on a body drawn from a few limbs:
 * a torso, two legs (two pixels wide, with shoes) and two arms (one pixel, with a hand), in layers (the far arm and
 * leg, the body and the near leg, the head, the near arm), each with its own dark outline like the pack's. All face
 * right, with the feet on the bottom row and the middle of the body in the middle (so a flip keeps you in place).
 * Kesuma gets the same body in black silat clothes with a gold sampin round the hips, and a red tanjak.
 * Textures: silat_<who>_<pose> (who: pl, pl1.., kesuma) and lift_<pl>_<stage>, made when a lesson opens. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var Art = LC.Art;
  var PW = 40, PH = 30, FEET = PH - 1, CX = 20, TY0 = FEET - 4;

  // ------------------------------------------------------------------ the moves of a lesson, in order
  // name (Malay), what it is, and the pose. Kesuma shows each one; you follow on the beat.
  LC.SILAT_MOVES = [
    { id: 'sembah', name: 'Sembah', what: 'the salute' },
    { id: 'kuda', name: 'Kuda-kuda', what: 'the horse stance' },
    { id: 'tumbuk', name: 'Tumbuk', what: 'a straight punch' },
    { id: 'tepis', name: 'Tepis', what: 'a parry' },
    { id: 'tendang', name: 'Tendang', what: 'a front kick' },
    { id: 'elak', name: 'Elak', what: 'a lean away' },
    { id: 'sapu', name: 'Sapu', what: 'a low sweep' },
    { id: 'kunci', name: 'Kunci', what: 'a lock' }
  ];

  // ------------------------------------------------------------------ poses
  // Points are (x, y) from the middle of the body and the top of the torso (which drops by dy when crouching); F is
  // the floor. bl / fl: the far and near leg (hip, knee..., ankle; toe: which way the shoe points), ba / fa: the far
  // and near arm (shoulder, elbow..., hand). lean moves the head and torso forward (+) or back (-).
  function P(dy, lean, bl, fl, ba, fa, extra) { var o = { dy: dy, lean: lean, bl: bl, fl: fl, ba: ba, fa: fa }; if (extra) Object.keys(extra).forEach(function (k) { o[k] = extra[k]; }); return o; }
  var F4 = 4, F3 = 3, F2 = 2;   // the floor, below the top of the torso, standing / crouching a little / low
  var POSES = {
    // standing tall, hands together in front of the face, head bowed a little
    sembah: P(0, 1, { pts: [[-2, 2], [-2, F4 - 1]], toe: 1 }, { pts: [[1, 2], [1, F4 - 1]], toe: 1 },
      null, { pts: [[3, 0], [5, -1], [5, -3]], hand: [[5, -3], [5, -4], [6, -3]] }, { headDy: 1 }),
    // the horse stance: low, feet wide, a fist forward and a fist at the hip
    kuda: P(1, 0, { pts: [[-2, 2], [-4, 2], [-6, F3 - 1]], toe: 1 }, { pts: [[1, 2], [4, 2], [6, F3 - 1]], toe: 1 },
      { pts: [[-2, 0], [-4, 1]], hand: [[-4, 1], [-4, 2]] }, { pts: [[3, 0], [6, 0]], hand: [[7, 0], [7, 1]] }),
    // a straight punch: lunging, the near fist all the way out at shoulder height
    tumbuk: P(1, 1, { pts: [[-1, 2], [-4, 2], [-6, F3 - 1]], toe: 1 }, { pts: [[2, 2], [4, 2], [5, F3 - 1]], toe: 1 },
      { pts: [[-1, 0], [-3, 1]], hand: [[-3, 1], [-3, 2]] }, { pts: [[4, 0], [10, 0]], hand: [[11, 0], [11, -1], [12, 0]] }),
    // a parry: the near forearm up in front of the face, the weight back
    tepis: P(1, -1, { pts: [[-3, 2], [-5, 2], [-6, F3 - 1]], toe: 1 }, { pts: [[0, 2], [3, 2], [4, F3 - 1]], toe: 1 },
      { pts: [[-3, 0], [-2, 1]], hand: [[-1, 1], [-1, 2]] }, { pts: [[2, 0], [5, 0], [6, -4]], hand: [[6, -5], [6, -6], [7, -5]] }),
    // a front kick: standing on the far leg, the near leg straight out, arms up for balance
    tendang: P(0, -1, { pts: [[-3, 2], [-3, F4 - 1]], toe: 1 }, { pts: [[0, 2], [5, 1], [9, 0]], toe: 2 },
      { pts: [[-3, 0], [-6, -1]], hand: [[-7, -1], [-7, -2]] }, { pts: [[2, 0], [4, -1], [4, -3]], hand: [[4, -4], [5, -4]] }),
    // leaning away: the body far back, the near foot forward, hands up
    elak: P(1, -3, { pts: [[-3, 2], [-5, 2], [-6, F3 - 1]], toe: 1 }, { pts: [[0, 2], [3, 2], [5, F3 - 1]], toe: 1 },
      { pts: [[-5, 0], [-7, -1]], hand: [[-8, -1], [-8, -2]] }, { pts: [[0, 0], [2, -1], [3, -2]], hand: [[4, -2], [4, -3]] }),
    // a low sweep: down on the far knee, the near leg swept out along the ground, a hand on the floor
    sapu: P(2, 1, { pts: [[-1, 2], [-4, 2]], toe: 3 }, { pts: [[2, 2], [10, 2]], toe: 2 },
      { pts: [[-1, 0], [-4, -1]], hand: [[-5, -1], [-5, -2]] }, { pts: [[4, 0], [6, 1]], hand: [[6, 2], [7, 2]] }),
    // a lock: both hands out, one high and one low, gripping
    kunci: P(1, 1, { pts: [[-1, 2], [-4, 2], [-6, F3 - 1]], toe: 1 }, { pts: [[2, 2], [4, 2], [5, F3 - 1]], toe: 1 },
      { pts: [[-1, 0], [5, 1], [8, 1]], hand: [[9, 1], [9, 2]] }, { pts: [[4, 0], [8, -1]], hand: [[9, -1], [9, -2], [10, -1]] }),
    // ready (pasang): between the moves
    ready: P(1, 0, { pts: [[-2, 2], [-3, 2], [-5, F3 - 1]], toe: 1 }, { pts: [[1, 2], [3, 2], [4, F3 - 1]], toe: 1 },
      { pts: [[-2, 0], [3, 1]], hand: [[4, 1], [4, 2]] }, { pts: [[3, 0], [5, -1]], hand: [[6, -1], [6, -2]] }),
    // off balance (a missed beat): on one leg, arms flung out
    wobble: P(0, -2, { pts: [[-3, 2], [-3, F4 - 1]], toe: 1 }, { pts: [[0, 2], [3, 3]], toe: 2 },
      { pts: [[-4, 0], [-7, -3]], hand: [[-8, -4], [-7, -4]] }, { pts: [[1, 0], [4, -3]], hand: [[5, -4], [5, -5]] }),
    // the batu angkat: crouched gripping the stone, holding it at the chest, holding it high over the head
    lift0: P(2, 2, { pts: [[0, 2], [-3, 2]], toe: 3 }, { pts: [[3, 2], [6, 2]], toe: 1 },
      { pts: [[0, 0], [5, 2]], hand: [[6, 2]] }, { pts: [[4, 0], [7, 2]], hand: [[8, 2], [8, 1]] }, { stone: [12, 0] }),
    lift1: P(1, 0, { pts: [[-2, 2], [-4, 2], [-5, F3 - 1]], toe: 1 }, { pts: [[1, 2], [3, 2], [4, F3 - 1]], toe: 1 },
      { pts: [[-2, 0], [6, 0]], hand: [[7, 0]] }, { pts: [[3, 0], [7, 1]], hand: [[8, 1], [8, 0]] }, { stone: [13, -4] }),
    lift2: P(0, 0, { pts: [[-2, 2], [-3, F4 - 1]], toe: 1 }, { pts: [[1, 2], [2, F4 - 1]], toe: 1 },
      { pts: [[-2, 0], [-6, -4], [-6, -11]], hand: [[-6, -12], [-5, -12]] }, { pts: [[3, 0], [7, -4], [7, -11]], hand: [[7, -12], [6, -12]] }, { stone: [1, -16] })
  };
  LC.SILAT_POSES = POSES;

  // ------------------------------------------------------------------ painting
  function Layer() { this.a = {}; }
  Layer.prototype.set = function (x, y, r) { if (x >= 0 && x < PW && y >= 0 && y < PH) this.a[y * PW + x] = r; };
  Layer.prototype.line = function (x0, y0, x1, y1, r, t) {   // t 2: two pixels thick
    var dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, e = dx - dy, x = x0, y = y0;
    for (var n = 0; n < 200; n++) {
      this.set(x, y, r);
      if (t === 2) { if (dx > dy) this.set(x, y + 1, r); else this.set(x + 1, y, r); }
      if (x === x1 && y === y1) break;
      var e2 = 2 * e;
      if (e2 > -dy) { e -= dy; x += sx; }
      if (e2 < dx) { e += dx; y += sy; }
    }
  };
  // a layer onto the picture: its own outline round it first, then its pixels
  function stamp(out, L, pal) {
    var keys = Object.keys(L.a);
    keys.forEach(function (k) {
      k = +k; var x = k % PW, y = (k - x) / PW;
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) {
        var nx = x + d[0], ny = y + d[1];
        if (nx < 0 || nx >= PW || ny < 0 || ny >= PH) return;
        if (!((ny * PW + nx) in L.a)) out[ny * PW + nx] = pal.o;
      });
    });
    keys.forEach(function (k) { out[k] = pal[L.a[k]] || L.a[k]; });
  }
  // who: { head: Art.folkHead(...), pal: body colours by role, sampin: [gold, shade] }
  function paintPose(who, pose) {
    var out = {}, TY = TY0 + pose.dy, ux = CX + pose.lean, hx = CX + Math.round(pose.lean / 2), pal = who.pal;
    function pt(q) { return [CX + q[0], TY + q[1]]; }
    function chain(L, pts, role, t) { for (var i = 0; i < pts.length - 1; i++) { var a = pt(pts[i]), b = pt(pts[i + 1]); L.line(a[0], a[1], b[0], b[1], role, t); } if (pts.length === 1) { var c = pt(pts[0]); L.set(c[0], c[1], role); } }
    function leg(L, lg, role) {
      if (!lg) return;
      chain(L, lg.pts, role, 2);
      var e = pt(lg.pts[lg.pts.length - 1]);
      // the shoe: 1 standing (under the ankle, toe forward), 2 kicking (at the end, sole forward), 3 kneeling (behind)
      if (lg.toe === 1) { L.set(e[0], e[1] + 1, 'f'); L.set(e[0] + 1, e[1] + 1, 'f'); L.set(e[0] + 2, e[1] + 1, 'f'); }
      else if (lg.toe === 2) { L.set(e[0] + 1, e[1], 'f'); L.set(e[0] + 1, e[1] + 1, 'f'); L.set(e[0] + 2, e[1], 'f'); L.set(e[0] + 2, e[1] + 1, 'f'); }
      else if (lg.toe === 3) { L.set(e[0] - 1, e[1], 'f'); L.set(e[0] - 1, e[1] + 1, 'f'); L.set(e[0] - 2, e[1] + 1, 'f'); }
    }
    function arm(L, a, sleeve, skin) {
      if (!a) return;
      chain(L, a.pts, sleeve, 1);
      (a.hand || []).forEach(function (q, i) { var c = pt(q); L.set(c[0], c[1], i ? 'h' : skin); });
    }
    // 1: the far arm and leg
    var L0 = new Layer();
    leg(L0, pose.bl, 'P'); arm(L0, pose.ba, 'c', 'S');
    stamp(out, L0, pal);
    // 2: the body and the near leg
    var L1 = new Layer(), y;
    var top = ['c', 'P', 'c', 'c', 'P'], mid = ['C', 'p', 'C', 'C', 'p'];
    for (var i = 0; i < 5; i++) { L1.set(ux - 2 + i, TY, top[i]); L1.set(ux - 2 + i, TY + 1, mid[i]); L1.set(hx - 2 + i, TY + 2, who.sampin ? (i % 2 ? 'X' : 'x') : 'p'); }
    if (ux !== hx) for (i = 0; i < 5; i++) L1.set(Math.round((ux + hx) / 2) - 2 + i, TY + 1, mid[i]);   // a lean: keep the waist joined
    leg(L1, pose.fl, 'p');
    if (who.sampin) { L1.set(hx + 2, TY + 3, 'x'); L1.set(hx + 3, TY + 3, 'X'); }   // the sampin's knot hangs in front
    stamp(out, L1, pal);
    // 3: the head (already outlined)
    var H = who.head, x0 = ux - 5, y0 = TY - H.h + (pose.headDy || 0) + (H.top || 0);
    for (y = 0; y < H.rows.length; y++) for (var x = 0; x < H.w; x++) {
      var col = H.rows[y][x], yy = y0 + y - (H.top || 0), xx = x0 + x;
      if (col && xx >= 0 && xx < PW && yy >= 0 && yy < PH) out[yy * PW + xx] = col;
    }
    // 4: the near arm, over everything
    var L3 = new Layer();
    arm(L3, pose.fa, 'C', 's');
    stamp(out, L3, pal);
    return out;
  }
  // Kesuma's head: the farmer's, with near-black hair and a red tanjak (its peak at the back)
  function kesumaHead() {
    var O6 = KESUMA_O6, h = Art.folkHead(0, O6, { style: 'short', hair: { '#3e2731': '#2a1e22', '#733e39': '#3e2c2c' } });
    if (!h) return null;
    var R = '#b8322a', R2 = '#7a1e1a', G = '#e9c46a', O = '#181425', top = 3, rows = [], y, x;
    for (y = 0; y < top; y++) { rows.push([]); for (x = 0; x < h.w; x++) rows[y].push(null); }
    h.rows.forEach(function (r, yy) { rows.push(r.slice()); });
    // the cloth wraps the top of the head down to row 3 (over the hair); a gold edge; the peak rises at the back
    for (y = 0; y <= 4; y++) for (x = 0; x < h.w; x++) {
      var c = rows[top + y][x];
      if (!c) continue;
      if (c === O) continue;
      if (h.hair[y][x] || y <= 2) rows[top + y][x] = y === 4 ? G : (x + y) % 5 === 0 ? R2 : R;
    }
    // the peak, at the back of the head: [row, x, colour] above the head's top edge
    [[0, 2, O], [0, 3, O], [1, 1, O], [1, 2, R], [1, 3, R2], [1, 4, O], [2, 1, O], [2, 2, R], [2, 3, R], [2, 4, R], [2, 5, O], [3, 3, R], [3, 4, R]].forEach(function (q) { rows[q[0]][q[1]] = q[2]; });
    return { w: h.w, h: rows.length, rows: rows, top: top };
  }
  var KESUMA_O6 = ['#34343e', '#26262e', '#2c2c36', '#20202a', '#d6a77a'];

  // make the poses (once per outfit): silat_<pl>_<pose>, silat_kesuma_<pose>, lift_<pl>_<0..2>
  LC.silatArt = function (scene, pc) {
    var pk = Art.plKey(pc || 0), O6 = Art.OUTFITS[pc || 0];
    if (!scene.textures.exists('batu_angkat_s')) Art.make(scene, 'batu_angkat_s', 16, 11, drawStone);
    if (scene.textures.exists('silat_' + pk + '_ready')) return;
    var me = { head: Art.folkHead(pc || 0, O6), pal: Art.folkBodyPal(O6) };
    var kp = Art.folkBodyPal(KESUMA_O6); kp.x = '#c8902a'; kp.X = '#8a5a1a';
    var ke = scene.textures.exists('silat_kesuma_ready') ? null : { head: kesumaHead(), pal: kp, sampin: true };
    if (!me.head) return;
    Object.keys(POSES).forEach(function (id) {
      var list = id.indexOf('lift') === 0 ? [['lift_' + pk + '_' + id.slice(4), me]] : [['silat_' + pk + '_' + id, me]].concat(ke ? [['silat_kesuma_' + id, ke]] : []);
      list.forEach(function (it) {
        var px = paintPose(it[1], POSES[id]);
        Art.make(scene, it[0], PW, PH, function (p) { Object.keys(px).forEach(function (k) { k = +k; p.px(k % PW, Math.floor(k / PW), px[k]); }); });
      });
    });
  };
  // where a lift pose holds the stone: [x from the middle of the body, y from the floor] of the stone's bottom middle
  LC.liftHold = function (stage) { return POSES['lift' + stage].stone; };
  // the stone you lift: a smaller batu angkat (16 x 11) in the same greys, with its carved band
  function drawStone(p) {
    var O = '#2a1d18', D = '#c8c2b6', C = '#a8a296', B = '#8d867a', E = '#c9a46a', E2 = '#8a6a3a';
    for (var y = 0; y < 11; y++) {
      var t = (y - 5) / 5.5, half = Math.round(8 * Math.sqrt(Math.max(0, 1 - t * t)));
      if (!half) continue;
      for (var x = 8 - half; x < 8 + half; x++) {
        var edge = x === 8 - half || x === 8 + half - 1 || y === 0 || y === 10, lit = (x - 8) + (y - 5) * 1.4;
        p.px(x, y, edge ? O : y === 7 ? ((x + 1) % 4 === 0 ? E2 : E) : lit < -6 ? D : lit < 3 ? C : B);
      }
    }
    p.px(5, 2, '#e8e2d6'); p.px(6, 2, '#e8e2d6'); p.px(4, 3, '#e8e2d6');   // a shine
  }
  LC.SILAT_SIZE = { w: PW, h: PH };
})(window.LC);
