// Little Creature — generates the app icons (web + Android launcher) as PNGs. No dependencies.
// Usage: node tools/make-icons.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// ---------------------------------------------------------------- tiny PNG encoder
const CRC = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
function crc32(buf) { let c = 0xffffffff; for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(w, h, rgba) {
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (w * 4 + 1)] = 0; rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4); }
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

// ---------------------------------------------------------------- Pelita sprite (same recipe as src/art.js, stage 2, happy)
function ghostSprite() {
  const W = 24, H = 24, g = new Array(W * H).fill(null), O = 2;   // 2px margin for outlines
  const set = (x, y, c) => { x = Math.round(x) + O; y = Math.round(y) + O; if (x >= 0 && y >= 0 && x < W && y < H) g[y * W + x] = c; };
  const rect = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) set(x + i, y + j, c); };
  const disc = (cx, cy, r, c) => { for (let y = Math.floor(cy - r - 1); y <= cy + r; y++) for (let x = Math.floor(cx - r - 1); x <= cx + r; x++) { const dx = x + 0.5 - cx, dy = y + 0.5 - cy; if (dx * dx + dy * dy <= r * r) set(x, y, c); } };
  const outline = (c) => {
    const copy = g.slice();
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (copy[y * W + x]) continue;
      const n = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => { const xx = x + dx, yy = y + dy; return xx >= 0 && yy >= 0 && xx < W && yy < H && copy[yy * W + xx]; });
      if (n) g[y * W + x] = c;
    }
  };
  const B = '#f7f4ff', S = '#d3cbf2', D = '#8f84cf', EYE = '#3b2f5c';
  const R = 6, cx = 10, cy = 11, bot = 19;
  disc(cx, cy, R, S); rect(cx - R, cy, 2 * R, bot - cy, S);
  for (let x = cx - R; x < cx + R; x++) if (((x - (cx - R)) % 4) < 2) set(x, bot, S);
  disc(cx - 0.7, cy - 0.7, R - 1.2, B); rect(cx - R + 1, cy, 2 * R - 3, bot - cy - 1, B);
  set(16, cy + 3, '#6b4423'); set(17, cy + 3, '#6b4423');
  rect(16, cy + 4, 3, 1, '#d9a73a'); rect(16, cy + 5, 3, 3, '#d8452f'); set(17, cy + 6, '#ffd27a'); rect(16, cy + 8, 3, 1, '#d9a73a');
  outline(D);
  outline('#1d1533');
  const ey = cy + 1;
  for (const e of [7, 12]) { set(e - 1, ey + 1, EYE); set(e, ey, EYE); set(e + 1, ey + 1, EYE); }
  rect(cx - 1, ey + 2, 2, 1, '#7a3a5a'); rect(cx - 1, ey + 3, 2, 1, '#e8799a');
  set(6, ey + 3, '#f5a3c7'); set(13, ey + 3, '#f5a3c7');
  // bounding box
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (g[y * W + x]) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  return { g, W, x0, y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
}
const SPR = ghostSprite();

// ---------------------------------------------------------------- icon renderer
function blend(px, i, [r, g, b], a) {
  const ia = 1 - a, da = px[i + 3] / 255, oa = a + da * ia;
  if (oa <= 0) return;
  px[i] = Math.round((r * a + px[i] * da * ia) / oa); px[i + 1] = Math.round((g * a + px[i + 1] * da * ia) / oa);
  px[i + 2] = Math.round((b * a + px[i + 2] * da * ia) / oa); px[i + 3] = Math.round(oa * 255);
}
// shape: 'square' (rounded), 'round', 'full' (full-bleed), 'none' (transparent; Android adaptive foreground)
function icon(size, shape, ghostFrac) {
  const px = Buffer.alloc(size * size * 4);
  const top = hex('#2a1f4a'), bot = hex('#c9705a'), rad = size * 0.2;
  const inside = (x, y) => {
    if (shape === 'full') return true;
    if (shape === 'round') { const dx = x + 0.5 - size / 2, dy = y + 0.5 - size / 2; return dx * dx + dy * dy <= (size / 2) * (size / 2); }
    const m = size * 0.04, cxp = Math.min(Math.max(x + 0.5, m + rad), size - m - rad), cyp = Math.min(Math.max(y + 0.5, m + rad), size - m - rad);
    return (x + 0.5 - cxp) ** 2 + (y + 0.5 - cyp) ** 2 <= rad * rad;
  };
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    if (shape === 'none' || !inside(x, y)) continue;
    const t = y / size, i = (y * size + x) * 4;
    blend(px, i, [0, 1, 2].map((k) => Math.round(top[k] + (bot[k] - top[k]) * t * t)), 1);
  }
  if (shape !== 'none') {   // stars + moon
    const stars = [[0.18, 0.16], [0.8, 0.12], [0.27, 0.32], [0.86, 0.36], [0.12, 0.5], [0.64, 0.2]];
    const s = Math.max(1, Math.round(size / 96));
    for (const [sx, sy] of stars) for (let j = 0; j < s; j++) for (let k = 0; k < s; k++) {
      const x = Math.round(sx * size) + k, y = Math.round(sy * size) + j;
      if (inside(x, y)) blend(px, (y * size + x) * 4, [255, 246, 214], 0.85);
    }
  }
  // soft glow behind Pelita
  const gcx = size / 2, gcy = size * 0.52, gr = size * (shape === 'none' ? 0.3 : 0.42);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const d = Math.hypot(x + 0.5 - gcx, y + 0.5 - gcy) / gr;
    if (d < 1 && (shape === 'none' || inside(x, y))) blend(px, (y * size + x) * 4, [190, 175, 255], 0.45 * (1 - d) * (1 - d));
  }
  // pixel-art Pelita, integer-scaled and centred
  const k = Math.max(1, Math.floor((size * ghostFrac) / SPR.h));
  const ox = Math.round((size - SPR.w * k) / 2), oy = Math.round((size - SPR.h * k) / 2 + size * 0.02);
  for (let y = 0; y < SPR.h; y++) for (let x = 0; x < SPR.w; x++) {
    const c = SPR.g[(y + SPR.y0) * SPR.W + (x + SPR.x0)];
    if (!c) continue;
    const rgb = hex(c);
    for (let j = 0; j < k; j++) for (let i = 0; i < k; i++) {
      const X = ox + x * k + i, Y = oy + y * k + j;
      if (X >= 0 && Y >= 0 && X < size && Y < size) blend(px, (Y * size + X) * 4, rgb, 1);
    }
  }
  return png(size, size, px);
}

function out(rel, buf) { const p = join(ROOT, rel); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, buf); console.log('wrote', rel, buf.length, 'bytes'); }

out('icons/icon-192.png', icon(192, 'full', 0.62));
out('icons/icon-512.png', icon(512, 'full', 0.58));
const RES = 'android/app/src/main/res';
const DENS = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
for (const [d, m] of Object.entries(DENS)) {
  out(`${RES}/mipmap-${d}/ic_launcher.png`, icon(Math.round(48 * m), 'square', 0.66));
  out(`${RES}/mipmap-${d}/ic_launcher_round.png`, icon(Math.round(48 * m), 'round', 0.62));
  out(`${RES}/mipmap-${d}/ic_launcher_foreground.png`, icon(Math.round(108 * m), 'none', 0.42));
}
