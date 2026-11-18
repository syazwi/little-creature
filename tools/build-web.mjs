// Little Creature — bundles the whole game into ONE self-contained HTML file: dist/LittleCreature.html
// (Phaser, game code, font and icon are inlined), so it can be copied to any computer and double-clicked.
// Also builds dist/LittleCreature_full.html: a TESTING build with everything unlocked (src/cheats.js) and its own save.
// Usage: node tools/build-web.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(ROOT, p));
const b64 = (p) => read(p).toString('base64');

function bundle(html, out) {
  // 1) drop the CDN fallback (Phaser is inlined below)
  html = html.replace(/\s*<script>window\.Phaser \|\|[^\n]*<\/script>/, '');
  // 2) inline every local <script src>
  html = html.replace(/<script src="([^"]+)"><\/script>/g, (m, src) => {
    const code = read(src).toString('utf8').replace(/<\/script/gi, '<\\/script');
    return `<script>/* ${src} */\n${code}\n</script>`;
  });
  // 3) fonts and icons as data URIs
  html = html.replace(/url\((lib\/fonts\/[^)]+\.woff2)\)/g, (m, p) => `url(data:font/woff2;base64,${b64(p)})`);
  const icon = `data:image/png;base64,${b64('icons/icon-192.png')}`;
  html = html.replace(/href="icons\/icon-192\.png"/g, `href="${icon}"`);
  if (/<script src=|url\(lib\//.test(html)) throw new Error('some local resources were not inlined');
  mkdirSync(join(ROOT, 'dist'), { recursive: true });
  writeFileSync(join(ROOT, out), html);
  console.log(`${out}  ${(html.length / 1024 / 1024).toFixed(2)} MB`);
}

const page = read('index.html').toString('utf8');
bundle(page, 'dist/LittleCreature.html');
const full = page
  .replace('<script src="src/main.js"></script>', '<script src="src/cheats.js"></script>\n  <script src="src/main.js"></script>')
  .replace(/<title>[^<]*<\/title>/, '<title>Little Creature (TEST: everything unlocked)</title>');
if (!full.includes('src/cheats.js')) throw new Error('could not add the cheats to the test build');
bundle(full, 'dist/LittleCreature_full.html');
