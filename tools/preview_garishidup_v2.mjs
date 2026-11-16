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
<canvas id="out" width="1660" height="560"></canvas>
<script type="module">
import { E, V, rr, poly, seg, circle, ring, text, glow } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import * as GH from '/engine/garishidup.js';

E.W = 1080; E.H = 1920; E.aspect = '9:16';

function renderPanel(drawFn) {
  const c = document.createElement('canvas');
  c.width = 1080; c.height = 1920;
  const g = c.getContext('2d');
  drawFn(g);
  return c;
}

// 1. Layout A: Split-Box Active Dimming + Chat Toast
const p1 = renderPanel((g) => {
  GH.stage(g, { floorY: 1380, spotlight: false });
  GH.headline(g, ['Pesannya cuma satu kalimat.', 'Sisanya *karanganmu* sendiri.'], { y: 310, size: 36 });
  GH.splitBoxes(g, {
    topY: 420, botY: 880, h: 410,
    activeBox: 'bottom',
    topTag: 'CEMBURU · 23.40',
    botTag: 'KENYATAAN · 06.58',
    topDraw: (g, box) => {
      rr(g, box.x + 80, box.floorY - 75, 420, 50, 8); g.fillStyle = '#5c4938'; g.fill();
      GH.figure(g, { x: box.cx, y: box.floorY, s: 0.96, role: 'hero', pose: POSES.sit, reflect: false });
    },
    botDraw: (g, box) => {
      GH.chatToast(g, { x: box.x + 220, y: box.y + 150, sender: 'BOS PROYEK', message: 'Bawa berkas audit pagi ini.', tag: 'CHILL', timeStr: '06.58', gold: true });
      rr(g, box.x + 340, box.floorY - 75, 420, 50, 8); g.fillStyle = '#5c4938'; g.fill();
      GH.figure(g, { x: box.x + 560, y: box.floorY, s: 0.96, role: 'hero', pose: POSES.sit, reflect: false });
    }
  });
});

// 2. Layout B: Borderless Open Split + Expense Stack + Blueprint Board
const p2 = renderPanel((g) => {
  GH.stage(g, { floorY: 1380, spotlight: false });
  GH.headline(g, ['Denah nggak pernah kehujanan,', 'tapi juga nggak pernah *jadi.*'], { y: 290, size: 36 });
  GH.openSplitStage(g, {
    topFloorY: 830,
    dividerY: 860,
    botFloorY: 1360,
    topTag: 'PROPOSAL · Rp4,5 MILIAR',
    botTag: 'KENYATAAN DI DESA',
    topDraw: (g, z) => {
      GH.blueprintBoard(g, { x: 430, floorY: z.floorY, topLabel: 'RENCANA', title: 'REVISI KE-9', crumpledCount: 6, gold: false });
      GH.figure(g, { x: 680, y: z.floorY, s: 0.92, facing: -1, role: 'hero', pose: POSES.point, reflect: false });
    },
    botDraw: (g, z) => {
      GH.expenseStack(g, { x: 95, y: 1020, topLabel: 'GAJI GURU', mainValue: 'Rp1,8 JUTA', items: ['BELI BUKU 400 RB', 'ONGKOS DESA 500 RB', 'ATAP BOCOR'] });
      // glowing bulb under leaky wooden roof
      glow(g, 740, 1080, 140, '#f5a623', 0.45);
      circle(g, 740, 1080, 16, '#ffd166');
      GH.figure(g, { x: 660, y: z.floorY, s: 0.98, role: 'hero', pose: POSES.sad, reflect: true });
    }
  });
});

// 3. Layout C: Single-Stage Time-Lapse Counter + Sawtooth Receipt + Crowd Queue
const p3 = renderPanel((g) => {
  GH.stage(g, { floorY: 1320 });
  GH.pill(g, 'HARI 30');
  GH.headline(g, ['Bagi rata itu adil,', 'kalau *makannya* juga rata.'], { y: 320, size: 36 });
  GH.receiptCard(g, { x: 300, y: 555, topLabel: 'PAJAK WARGA', mainValue: 'Rp675 JUTA', subLabel: 'DIPOTONG RATA', gold: false });
  GH.bigCounter(g, '54', { x: 750, y: 585, label: 'WARGA ANTRE', gold: true });
  // Cart on left + crowd queue on right
  rr(g, 140, 1060, 250, 180, 10); g.fillStyle = '#5c4938'; g.fill(); g.strokeStyle = '#090c10'; g.lineWidth = 5; g.stroke();
  GH.angledStamp(g, 'WARUNG', 265, 980, { w: 170, h: 46, angle: 0, gold: true });
  GH.figure(g, { x: 265, y: 1320, s: 1.05, role: 'hero', pose: POSES.wave });
  GH.crowdQueue(g, { startX: 480, floorY: 1320, count: 10, confetti: true });
});

// 4. Layout D: Reverse-Chronology Flashback (Gold Timer Pill + Speech Bubble)
const p4 = renderPanel((g) => {
  GH.stage(g, { floorY: 1300 });
  GH.headline(g, ['Kamu lihat telatnya.', 'Nggak lihat *pagi-nya.*'], { y: 310, size: 38 });
  GH.goldTimerPill(g, '08.10', { y: 490, clockIcon: true, sub: 'DITEGUR DI KANTOR' });
  rr(g, 110, 740, 860, 560, 10); g.fillStyle = '#202734'; g.fill(); g.strokeStyle = '#2e3748'; g.lineWidth = 4; g.stroke();
  GH.speechBubble(g, 'TELAT!', 570, 860, { tailDir: 'right', gold: false });
  GH.figure(g, { x: 430, y: 1300, s: 1.15, role: 'hero', pose: POSES.sad, label: 'AKU' });
  GH.figure(g, { x: 670, y: 1300, s: 1.15, facing: -1, role: 'slate', garment: 'suit', pose: POSES.point, label: 'ATASAN' });
});

// 5. Layout E: Multi-Scene Journey (Angled LUNAS Stamp + Scooter + Speech Bubble)
const p5 = renderPanel((g) => {
  GH.stage(g, { floorY: 1300 });
  GH.pill(g, '17.00');
  GH.headline(g, ['Motornya tua.', 'Utangnya *nol.*'], { y: 320, size: 38 });
  // Simple house on right with glowing angled LUNAS stamp
  poly(g, [[520, 860], [740, 710], [960, 860]], '#5c4938');
  rr(g, 550, 860, 380, 440, 6); g.fillStyle = '#8c8275'; g.fill(); g.strokeStyle = '#090c10'; g.lineWidth = 5; g.stroke();
  GH.angledStamp(g, 'LUNAS', 740, 875, { w: 230, h: 68, angle: -0.09, gold: true });
  GH.speechBubble(g, 'CICILAN Rp0', 290, 880, { tailDir: 'left', gold: true });
  GH.figure(g, { x: 310, y: 1300, s: 1.18, role: 'hero', pose: POSES.wave, label: 'MOTOR 12 TAHUN' });
});

// 6. Layout F: Frame-in-Frame Live Mirror (Dashed Ghost SIBUK -> Glowing Gold Figure)
const p6 = renderPanel((g) => {
  GH.stage(g, { floorY: 1320 });
  GH.pill(g, 'FOTO 2026');
  GH.headline(g, ['Fotonya tiap tahun ada.', '*Kamunya* yang nggak ada.'], { y: 320, size: 36 });
  // Wall frame on top
  rr(g, 260, 520, 560, 310, 10); g.fillStyle = '#181e28'; g.fill(); g.strokeStyle = '#f5f2ea'; g.lineWidth = 6; g.stroke();
  GH.ghostFigure(g, { x: 420, y: 790, s: 0.55, mode: 'dashed', innerText: 'SIBUK' });
  GH.ghostFigure(g, { x: 690, y: 790, s: 0.55, mode: 'goldGlow' });
  // Stage figures below
  GH.figure(g, { x: 320, y: 1320, s: 1.05, role: 'slate', garment: 'kopiah', pose: POSES.stand, label: 'AYAH' });
  GH.figure(g, { x: 480, y: 1320, s: 1.02, role: 'mauve', garment: 'ibu', pose: POSES.stand, label: 'IBU' });
  GH.ghostFigure(g, { x: 720, y: 1320, s: 1.12, mode: 'goldGlow' });
});

const out = document.getElementById('out');
const ctx = out.getContext('2d');
ctx.fillStyle = '#07090d';
ctx.fillRect(0, 0, out.width, out.height);
const panels = [
  [p1, 'A. Split-Box + Active Dimming'],
  [p2, 'B. Open-Split + Blueprint'],
  [p3, 'C. Time-Lapse + Receipt'],
  [p4, 'D. Flashback Gold Timer'],
  [p5, 'E. Multi-Scene + Stempel LUNAS'],
  [p6, 'F. Frame-in-Frame + Ghost Emas'],
];
panels.forEach(([can, title], i) => {
  const x = 14 + i * 274, y = 38, w = 262, h = 505;
  ctx.drawImage(can, x, y, w, h);
  ctx.strokeStyle = '#2e3748';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = '#ffd166';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText(title, x + 6, 24);
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
const page = await browser.newPage({ viewport: { width: 1660, height: 560 } });
page.on('pageerror', e => console.error('PAGEERROR:', e));
await page.goto(`http://localhost:${port}/`);
await page.waitForFunction('window.DONE === true', null, { timeout: 15000 });
const outFile = path.join(ROOT, 'build_garishidup_v2_6layouts.png');
await page.screenshot({ path: outFile, type: 'png' });
await browser.close();
server.close();
console.log('SAVED:', outFile);
