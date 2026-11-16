import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.woff2': 'font/woff2' };

const HTML = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin:0; background:#07090d; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; }
</style>
</head>
<body>
<canvas id="out" width="1520" height="680"></canvas>
<script type="module">
import { E, V, rr, poly, seg, circle, ring, text, glow } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import * as GH from '/engine/garishidup.js';

// Set virtual 9:16 resolution
E.W = 1080; E.H = 1920; E.aspect = '9:16';

function renderPanel(drawFn) {
  const c = document.createElement('canvas');
  c.width = 1080; c.height = 1920;
  const g = c.getContext('2d');
  drawFn(g);
  return c;
}

// Panel 1: 2019 (Motor DIJUAL + AYAH + IBU + AKU di pintu)
const p1 = renderPanel((g) => {
  GH.stage(g, { floorY: 1280 });
  GH.pill(g, '2019');
  // House wall & door on right
  rr(g, 730, 760, 350, 520, 4); g.fillStyle = '#232936'; g.fill(); g.strokeStyle = '#090c10'; g.lineWidth = 6; g.stroke();
  rr(g, 790, 820, 180, 460, 4); g.fillStyle = '#52453b'; g.fill(); g.strokeStyle = '#090c10'; g.lineWidth = 6; g.stroke();
  // Scooter (DIJUAL) on left
  GH.microLabel(g, 'DIJUAL', 220, 960);
  circle(g, 130, 1245, 36, '#090c10'); circle(g, 130, 1245, 22, '#5a6578');
  circle(g, 300, 1245, 36, '#090c10'); circle(g, 300, 1245, 22, '#5a6578');
  poly(g, [[120, 1225], [270, 1225], [305, 1120], [250, 1120], [225, 1195], [140, 1195]], '#788496');
  // Buyer pushing scooter, Ayah, Ibu, Aku
  GH.figure(g, { x: 350, y: 1280, s: 1.25, facing: -1, role: 'slate', garment: 'kopiah', pose: POSES.holdFront });
  GH.figure(g, { x: 540, y: 1280, s: 1.28, facing: 1, role: 'slate', garment: 'kopiah', pose: POSES.stand, label: 'AYAH' });
  GH.figure(g, { x: 690, y: 1280, s: 1.22, facing: 1, role: 'mauve', garment: 'ibu', pose: POSES.holdFront, label: 'IBU' });
  GH.figure(g, { x: 860, y: 1280, s: 1.28, facing: -1, role: 'hero', garment: 'none', pose: POSES.wave, label: 'AKU' });
});

// Panel 2: 2021 · SEMESTER 5 (Split-Box Diorama: Ibu menjahit vs Aku belajar)
const p2 = renderPanel((g) => {
  GH.stage(g, { floorY: 1320, spotlight: false });
  GH.pill(g, '2021', { sub: 'SEMESTER', subHighlight: '5' });
  GH.splitBoxes(g, {
    topY: 430, botY: 870, h: 390,
    topDraw: (g, box) => {
      // Window with full moon
      rr(g, box.x + 50, box.y + 45, 110, 125, 6); g.fillStyle = '#0e131d'; g.fill(); g.strokeStyle = '#394457'; g.lineWidth = 4; g.stroke();
      circle(g, box.x + 85, box.y + 82, 18, '#f5f2ea');
      // Sewing table + machine + lamp
      glow(g, box.cx + 50, box.y + 130, 160, '#cbd5e1', 0.28);
      rr(g, box.cx - 40, box.floorY - 120, 230, 14, 4); g.fillStyle = '#5c4938'; g.fill();
      seg(g, [[box.cx - 20, box.floorY - 106], [box.cx - 20, box.floorY]], 10, '#2a303c');
      seg(g, [[box.cx + 170, box.floorY - 106], [box.cx + 170, box.floorY]], 10, '#2a303c');
      // Sewing machine silhouette
      poly(g, [[box.cx + 30, box.floorY - 120], [box.cx + 145, box.floorY - 120], [box.cx + 145, box.floorY - 195], [box.cx + 45, box.floorY - 195], [box.cx + 45, box.floorY - 155], [box.cx + 95, box.floorY - 155], [box.cx + 95, box.floorY - 120]], '#94a3b8');
      GH.figure(g, { x: box.cx - 55, y: box.floorY, s: 1.05, facing: 1, role: 'mauve', garment: 'ibu', pose: POSES.sit, reflect: false });
    },
    botDraw: (g, box) => {
      // Window + Study desk + glowing lamp + books
      rr(g, box.x + 50, box.y + 45, 110, 125, 6); g.fillStyle = '#253042'; g.fill(); g.strokeStyle = '#394457'; g.lineWidth = 4; g.stroke();
      glow(g, box.cx + 25, box.floorY - 140, 175, '#f5a623', 0.32);
      rr(g, box.cx - 70, box.floorY - 115, 280, 14, 4); g.fillStyle = '#5c4938'; g.fill();
      // Stack of books
      rr(g, box.cx + 120, box.floorY - 140, 75, 22, 4); g.fillStyle = '#d65a5a'; g.fill();
      rr(g, box.cx + 124, box.floorY - 162, 70, 22, 4); g.fillStyle = '#5a8fd6'; g.fill();
      rr(g, box.cx + 118, box.floorY - 184, 76, 22, 4); g.fillStyle = '#e6b84d'; g.fill();
      GH.figure(g, { x: box.cx - 75, y: box.floorY, s: 1.05, facing: 1, role: 'hero', garment: 'none', pose: POSES.sit, reflect: false });
    }
  });
});

// Panel 3: WISUDA Climax (Toga ini *bukan* punyaku *sendiri.*)
const p3 = renderPanel((g) => {
  GH.stage(g, { floorY: 1280, arches: true, bunting: true });
  GH.pill(g, 'WISUDA');
  GH.headline(g, ['Toga ini', '*bukan* punyaku *sendiri.*'], { y: 345 });
  GH.figure(g, { x: 370, y: 1280, s: 1.38, facing: 1, role: 'hero', garment: 'toga', pose: POSES.reach });
  GH.figure(g, { x: 525, y: 1280, s: 1.32, facing: -1, role: 'slate', garment: 'kopiah', pose: POSES.sad });
  GH.figure(g, { x: 695, y: 1280, s: 1.28, facing: -1, role: 'mauve', garment: 'ibu', pose: POSES.stand });
});

// Panel 4: Ide Baru Korupsi × GarisHidup (Fuel Gauge E->F + Pipa Emas)
const p4 = renderPanel((g) => {
  GH.stage(g, { floorY: 1320 });
  GH.pill(g, 'PAJAK WARGA');
  GH.headline(g, ['Yang ngisi *sebulan penuh,*', 'yang nguras *sekali tanda tangan.*'], { y: 340, size: 38 });
  // Golden siphon pipe connecting 3 citizen gauges (E) into 1 corruptor gauge (F)
  const gy = 650;
  const xs = [210, 430, 650, 870];
  seg(g, [[xs[0], gy - 95], [xs[0], gy - 135], [xs[3], gy - 135], [xs[3], gy - 95]], 6, '#f5a623');
  seg(g, [[xs[1], gy - 95], [xs[1], gy - 135]], 6, '#f5a623');
  seg(g, [[xs[2], gy - 95], [xs[2], gy - 135]], 6, '#f5a623');
  GH.fuelGauge(g, { x: xs[0], y: gy, r: 82, level: 0.08, activeGold: false, label: 'PEDAGANG' });
  GH.fuelGauge(g, { x: xs[1], y: gy, r: 82, level: 0.12, activeGold: false, label: 'PEKERJA' });
  GH.fuelGauge(g, { x: xs[2], y: gy, r: 82, level: 0.05, activeGold: false, label: 'GURU HONORER' });
  GH.fuelGauge(g, { x: xs[3], y: gy, r: 82, level: 0.96, activeGold: true,  label: 'OKNUM PEJABAT' });

  GH.figure(g, { x: xs[0], y: 1320, s: 1.22, facing: 1, role: 'hero',  garment: 'none',   pose: POSES.sad });
  GH.figure(g, { x: xs[1], y: 1320, s: 1.18, facing: 1, role: 'slate', garment: 'kopiah', pose: POSES.sad });
  GH.figure(g, { x: xs[2], y: 1320, s: 1.15, facing: 1, role: 'mauve', garment: 'ibu',    pose: POSES.sad });
  GH.figure(g, { x: xs[3], y: 1320, s: 1.30, facing: -1, role: 'gold', garment: 'suit',   pose: POSES.talk });
});

const out = document.getElementById('out');
const ctx = out.getContext('2d');
ctx.fillStyle = '#07090d';
ctx.fillRect(0, 0, out.width, out.height);
const panels = [
  [p1, '1. Beat 2019 (Micro-Label + Prop)'],
  [p2, '2. Split-Box Simultan (Ibu vs Aku)'],
  [p3, '3. Klimaks Emas + Refleksi Lantai'],
  [p4, '4. Korupsi POV Warga (Fuel Gauge E→F)'],
];
panels.forEach(([can, title], i) => {
  const x = 16 + i * 376, y = 42, w = 360, h = 620;
  ctx.drawImage(can, x, y, w, h);
  ctx.strokeStyle = '#2e3748';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = '#f5a623';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(title, x + 8, 26);
});
window.DONE = true;
</script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (url === '/' || url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(HTML);
  }
  const p = path.join(ROOT, url);
  if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(0);

const port = server.address().port;
const browser = await chromium.launch({ args: ['--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1520, height: 680 } });
page.on('pageerror', e => console.error('PAGEERROR:', e));
await page.goto(`http://localhost:${port}/`);
await page.waitForFunction('window.DONE === true', null, { timeout: 15000 });
const outFile = path.join(ROOT, 'build_garishidup_preview.png');
await page.screenshot({ path: outFile, type: 'png' });
await browser.close();
server.close();
console.log('SAVED:', outFile);
