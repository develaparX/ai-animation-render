// engine/gh_layouts.js — Bespoke @garishidup.idn scene layouts for Videos #2..#10 (watermark: "develapar")
import { E, V, clamp, lerp, prog, ease, alpha, seg, circle, ring, rr, poly, text, glow } from './core.js';
import { POSES, blendPose, breathe, walkPose } from './rig2d.js';
import * as GH from './garishidup.js';

const SANS = 'Segoe UI';

// --- Shared Bespoke Props ---

function drawCart(g, x, y, s = 1, gold = false) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  if (gold) glow(g, 0, -55, 110, GH.PALETTE.gold, 0.35);
  rr(g, -68, -86, 136, 52, 8);
  g.fillStyle = GH.PALETTE.outline; g.fill();
  rr(g, -63, -81, 126, 42, 6);
  g.fillStyle = gold ? GH.PALETTE.gold : '#5c4b3c'; g.fill();
  // Produce / sacks on top
  circle(g, -30, -90, 18, gold ? GH.PALETTE.goldHi : '#4e7a5b');
  circle(g, 2, -94, 20, gold ? GH.PALETTE.goldHi : '#639672');
  circle(g, 32, -88, 16, gold ? GH.PALETTE.gold : '#d4843e');
  // Handle & legs
  seg(g, [[-68, -66], [-102, -52]], 9, GH.PALETTE.outline);
  seg(g, [[-68, -66], [-102, -52]], 5, gold ? GH.PALETTE.goldHi : '#94a3b8');
  seg(g, [[42, -34], [42, -4]], 8, GH.PALETTE.outline);
  // Wheel
  circle(g, -22, -18, 22, GH.PALETTE.outline);
  circle(g, -22, -18, 16, gold ? GH.PALETTE.goldHi : '#768396');
  circle(g, -22, -18, 6, GH.PALETTE.outline);
  g.restore();
}

function drawScooter(g, x, y, s = 1, tilted = 0) {
  g.save();
  g.translate(x, y);
  g.rotate(tilted);
  g.scale(s, s);
  circle(g, -46, -20, 21, GH.PALETTE.outline);
  circle(g, -46, -20, 14, '#64748b');
  circle(g, 46, -20, 21, GH.PALETTE.outline);
  circle(g, 46, -20, 14, '#64748b');
  poly(g, [[-50, -24], [12, -24], [34, -68], [46, -68], [30, -18], [-46, -18]], GH.PALETTE.outline);
  poly(g, [[-46, -26], [10, -26], [31, -64], [42, -64], [27, -20], [-42, -20]], '#4e5d78');
  rr(g, -40, -54, 44, 15, 6);
  g.fillStyle = '#1e2530'; g.fill();
  seg(g, [[28, -68], [44, -90]], 8, GH.PALETTE.outline);
  circle(g, 46, -78, 9, GH.PALETTE.goldHi);
  glow(g, 76, -74, 48, GH.PALETTE.goldHi, 0.25);
  g.restore();
}

function drawLuxuryCar(g, x, y, s = 1, gold = true) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  if (gold) glow(g, 0, -34, 95, GH.PALETTE.gold, 0.32);
  poly(g, [[-82, -18], [-68, -46], [-32, -68], [30, -68], [66, -42], [82, -18]], GH.PALETTE.outline);
  poly(g, [[-76, -21], [-63, -43], [-29, -63], [27, -63], [61, -39], [76, -21]], gold ? GH.PALETTE.gold : '#64748b');
  poly(g, [[-26, -58], [22, -58], [44, -40], [-46, -40]], '#1a2230');
  circle(g, -48, -18, 19, GH.PALETTE.outline);
  circle(g, -48, -18, 12, GH.PALETTE.goldHi);
  circle(g, 48, -18, 19, GH.PALETTE.outline);
  circle(g, 48, -18, 12, GH.PALETTE.goldHi);
  g.restore();
}

function drawBridge(g, x, y, w, h, gold = false, cracked = false) {
  g.save();
  // River water below
  rr(g, x, y + h * 0.45, w, h * 0.55, 10);
  g.fillStyle = '#111a26'; g.fill();
  for (let i = 0; i < 5; i++) {
    const wx = x + w * (0.12 + i * 0.18);
    seg(g, [[wx - 28, y + h * 0.68], [wx + 28, y + h * 0.68]], 3, 'rgba(148,163,184,0.25)');
  }
  if (gold) {
    const archR = Math.min(w * 0.36, h * 0.65);
    glow(g, x + w * 0.5, y + h * 0.32, archR * 1.1, GH.PALETTE.gold, 0.32);
    // Golden steel arch
    g.strokeStyle = GH.PALETTE.outline; g.lineWidth = 14;
    g.beginPath(); g.arc(x + w * 0.5, y + h * 0.48, archR, Math.PI, 0); g.stroke();
    g.strokeStyle = GH.PALETTE.gold; g.lineWidth = 9;
    g.beginPath(); g.arc(x + w * 0.5, y + h * 0.48, archR, Math.PI, 0); g.stroke();
    // Vertical cables
    for (let i = 1; i <= 7; i++) {
      const u = i / 8;
      const cx = x + w * 0.5 - archR + u * (archR * 2);
      const archH = Math.sin(u * Math.PI) * (archR * 0.94);
      seg(g, [[cx, y + h * 0.46], [cx, y + h * 0.46 - archH]], 3.5, GH.PALETTE.goldHi);
    }
    rr(g, x + 10, y + h * 0.42, w - 20, 18, 6);
    g.fillStyle = GH.PALETTE.outline; g.fill();
    rr(g, x + 14, y + h * 0.44, w - 28, 12, 4);
    g.fillStyle = GH.PALETTE.goldHi; g.fill();
  } else {
    // Sagging wooden plank bridge
    const midY = y + h * (cracked ? 0.52 : 0.42);
    g.strokeStyle = '#5c4938'; g.lineWidth = 6;
    g.beginPath();
    g.moveTo(x + 16, y + h * 0.34);
    g.quadraticCurveTo(x + w * 0.5, midY, x + w - 16, y + h * 0.34);
    g.stroke();
    const nPlanks = 11;
    for (let i = 0; i < nPlanks; i++) {
      if (cracked && (i === 4 || i === 6)) continue; // Missing broken planks!
      const u = (i + 0.5) / nPlanks;
      const px = lerp(x + 28, x + w - 28, u);
      const py = lerp(y + h * 0.36, midY, 4 * u * (1 - u));
      rr(g, px - 18, py - 6, 36, 12, 3);
      g.fillStyle = '#6e5844'; g.fill();
      g.strokeStyle = GH.PALETTE.outline; g.lineWidth = 2; g.stroke();
    }
  }
  g.restore();
}

function drawStreetPole(g, x, yFloor, h = 260, lit = false) {
  g.save();
  seg(g, [[x, yFloor], [x, yFloor - h], [x + 42, yFloor - h - 18]], 10, GH.PALETTE.outline);
  seg(g, [[x, yFloor], [x, yFloor - h], [x + 42, yFloor - h - 18]], 5, lit ? GH.PALETTE.gold : '#475569');
  circle(g, x + 46, yFloor - h - 16, 12, GH.PALETTE.outline);
  circle(g, x + 46, yFloor - h - 16, 8, lit ? GH.PALETTE.goldHi : '#334155');
  if (lit) {
    glow(g, x + 46, yFloor - h - 10, 95, GH.PALETTE.gold, 0.55);
    poly(g, [[x + 38, yFloor - h - 10], [x + 54, yFloor - h - 10], [x + 115, yFloor], [x - 25, yFloor]], 'rgba(245, 166, 35, 0.14)');
  }
  g.restore();
}

function drawFoodTray(g, x, y, w = 260, h = 150, fullGold = false) {
  g.save();
  if (fullGold) glow(g, x, y, w * 0.75, GH.PALETTE.gold, 0.35);
  rr(g, x - w / 2 - 4, y - h / 2 - 4, w + 8, h + 8, 18);
  g.fillStyle = GH.PALETTE.outline; g.fill();
  rr(g, x - w / 2, y - h / 2, w, h, 15);
  g.fillStyle = fullGold ? '#382c18' : '#1e2532'; g.fill();
  g.strokeStyle = fullGold ? GH.PALETTE.gold : '#475569'; g.lineWidth = 4; g.stroke();
  // Compartments
  rr(g, x - w * 0.44, y - h * 0.38, w * 0.42, h * 0.76, 10);
  g.fillStyle = '#141922'; g.fill();
  rr(g, x + w * 0.04, y - h * 0.38, w * 0.40, h * 0.34, 8);
  g.fillStyle = '#141922'; g.fill();
  rr(g, x + w * 0.04, y + h * 0.04, w * 0.40, h * 0.34, 8);
  g.fillStyle = '#141922'; g.fill();

  if (fullGold) {
    // Full rice, golden chicken, fruit, and glowing milk cup
    circle(g, x - w * 0.23, y, 34, GH.PALETTE.hero);
    circle(g, x + w * 0.24, y - h * 0.21, 20, GH.PALETTE.gold);
    circle(g, x + w * 0.24, y + h * 0.21, 18, '#fbbf24');
    // Milk glass on right
    rr(g, x + w * 0.56, y - 42, 42, 76, 8);
    g.fillStyle = GH.PALETTE.outline; g.fill();
    rr(g, x + w * 0.56 + 4, y - 36, 34, 66, 6);
    g.fillStyle = GH.PALETTE.goldHi; g.fill();
  } else {
    // Sparse dry rice + 1 tiny pale kerupuk
    circle(g, x - w * 0.23, y + 8, 18, '#94a3b8');
    circle(g, x + w * 0.22, y + h * 0.20, 12, '#cbd5e1');
  }
  g.restore();
}

function drawSofa(g, x, yFloor, w = 240, gold = true) {
  g.save();
  if (gold) glow(g, x, yFloor - 55, w * 0.7, GH.PALETTE.gold, 0.32);
  rr(g, x - w / 2 - 4, yFloor - 98, w + 8, 72, 18);
  g.fillStyle = GH.PALETTE.outline; g.fill();
  rr(g, x - w / 2, yFloor - 94, w, 64, 15);
  g.fillStyle = gold ? GH.PALETTE.gold : '#475569'; g.fill();
  rr(g, x - w / 2 - 14, yFloor - 62, w + 28, 42, 12);
  g.fillStyle = GH.PALETTE.outline; g.fill();
  rr(g, x - w / 2 - 10, yFloor - 58, w + 20, 34, 10);
  g.fillStyle = gold ? GH.PALETTE.goldHi : '#64748b'; g.fill();
  seg(g, [[x - w * 0.42, yFloor - 20], [x - w * 0.42, yFloor]], 8, GH.PALETTE.outline);
  seg(g, [[x + w * 0.42, yFloor - 20], [x + w * 0.42, yFloor]], 8, GH.PALETTE.outline);
  g.restore();
}

function drawBriefcase(g, x, y, s = 1, gold = true) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  if (gold) glow(g, 0, 0, 95, GH.PALETTE.gold, 0.42);
  rr(g, -22, -58, 44, 24, 6);
  g.strokeStyle = GH.PALETTE.outline; g.lineWidth = 8; g.stroke();
  rr(g, -62, -42, 124, 84, 12);
  g.fillStyle = GH.PALETTE.outline; g.fill();
  rr(g, -56, -36, 112, 72, 9);
  g.fillStyle = gold ? GH.PALETTE.gold : '#475569'; g.fill();
  seg(g, [[-56, 0], [56, 0]], 4, GH.PALETTE.outline);
  circle(g, 0, 0, 8, GH.PALETTE.goldHi);
  g.restore();
}

// --- Master Layout Dispatcher ---

export function renderGHShot(g, ctx, spec) {
  const { t, u } = ctx;
  const {
    pill,
    sub,
    hl,
    layout = '',
    activeBox = 'both',
    topTag = null,
    botTag = null,
    reveal = 1,
    timerPill = null,
  } = spec;

  const isSplit = layout.startsWith('split_') || layout.startsWith('opensplit_') || layout.includes('_split_') || layout.includes('_opensplit_');
  const floorY = isSplit ? 1380 : 1280;
  GH.stage(g, { floorY });
  if (timerPill) {
    GH.goldTimerPill(g, timerPill, { y: E.H * 0.115, clockIcon: true, sub });
  } else if (pill) {
    GH.pill(g, pill, { sub });
  }
  const effReveal = spec.delayedReveal ? clamp(u * 1.45, 0.16, 1) : reveal;
  if (hl && hl.length) {
    GH.headline(g, hl, { y: E.H * (sub ? 0.195 : 0.185), reveal: effReveal });
  }

  // 0) BATCH 2 BESPOKE LAYOUTS (V11..V20)
  if (/^v1[1-9]_|^v20_/.test(layout)) {
    renderBatch2Layout(g, ctx, spec, floorY);
    return;
  }

  // 1A) BORDERED SPLIT-BOX VARIATIONS (Layout A)
  if (layout.startsWith('split_')) {
    GH.splitBoxes(g, {
      topY: E.H * 0.255,
      botY: E.H * 0.495,
      h: E.H * 0.21,
      activeBox,
      topTag,
      botTag,
      topDraw: (g2, box) => drawSplitTop(g2, box, layout, t, u),
      botDraw: (g2, box) => drawSplitBot(g2, box, layout, t, u),
    });
    return;
  }

  // 1B) BORDERLESS OPEN-SPLIT VARIATIONS (Layout B)
  if (layout.startsWith('opensplit_')) {
    GH.openSplitStage(g, {
      topFloorY: 830,
      dividerY: 860,
      botFloorY: 1360,
      active: activeBox,
      topTag: topTag || 'ATAS · ANGGARAN LAPORAN',
      botTag: botTag || 'BAWAH · KENYATAAN WARGA',
      topDraw: (g2, z) => {
        if (layout.includes('blueprint')) {
          GH.blueprintBoard(g2, { x: 420, floorY: z.floorY, topLabel: 'PROPOSAL', title: 'REVISI KE-9', crumpledCount: 6, gold: false });
          GH.figure(g2, { x: 690, y: z.floorY, s: 0.90, facing: -1, role: 'gold', garment: 'suit', pose: POSES.point, reflect: false });
        } else {
          GH.expenseStack(g2, { x: 95, y: 540, topLabel: 'TUNJANGAN', mainValue: 'Rp45 JUTA', items: ['RAPAT HOTEL 3 JAM'] });
          drawSofa(g2, 700, z.floorY, 220, true);
          GH.figure(g2, { x: 690, y: z.floorY, s: 0.88, role: 'gold', garment: 'suit', pose: POSES.sit, reflect: false });
        }
      },
      botDraw: (g2, z) => {
        GH.expenseStack(g2, { x: 95, y: 1020, topLabel: 'GAJI WARGA', mainValue: 'Rp1,8 JUTA', items: ['BELI BUKU & ALAT', 'ONGKOS HARIAN', 'DAPUR KELUARGA'] });
        GH.figure(g2, { x: 690, y: z.floorY, s: 0.94, role: 'hero', pose: walkPose(t, 1.0), reflect: true });
      },
    });
    return;
  }

  // 1C) TIME-LAPSE COUNTER + QUEUE VARIATIONS (Layout C)
  if (layout.startsWith('timelapse_')) {
    const countVal = spec.counterValue ?? Math.round(lerp(4, 54, ease.inOut(u)));
    GH.receiptCard(g, {
      x: 300, y: 555,
      topLabel: spec.receiptTop || 'POTONGAN WARGA',
      mainValue: spec.receiptMain || 'Rp675 JUTA',
      subLabel: spec.receiptSub || 'DIBAGI RATA',
      gold: false,
    });
    GH.bigCounter(g, String(countVal), { x: 750, y: 585, label: spec.counterLabel || 'WARGA ANTRE', gold: u > 0.5 });
    drawCart(g, 265, floorY, 1.05, u > 0.6);
    GH.figure(g, { x: 265, y: floorY, s: 0.96, role: 'hero', pose: u > 0.6 ? POSES.wave : POSES.stand, label: 'AKU', labelDy: -250 });
    GH.crowdQueue(g, { startX: 480, floorY, count: Math.max(2, Math.min(12, Math.round(countVal / 5))), confetti: u > 0.7 });
    return;
  }

  // 1D) REVERSE-CHRONOLOGY FLASHBACK VARIATIONS (Layout D)
  if (layout.startsWith('flashback_')) {
    GH.goldTimerPill(g, spec.timeStr || '08.10', { y: 490, clockIcon: true, sub: spec.timeSub || 'DETIK KEJADIAN' });
    GH.speechBubble(g, spec.bubbleText || 'TELAT BAYAR!', 580, 820, { tailDir: 'right', gold: u > 0.6 });
    if (layout.includes('Toast') || layout.includes('chat')) {
      GH.chatToast(g, { x: 310, y: 690, sender: 'SISTEM', message: 'Denda otomatis diberlakukan.', timeStr: spec.timeStr || '08.10', gold: true });
    }
    GH.figure(g, { x: 390, y: floorY, s: 1.02, role: 'hero', pose: POSES.sad, label: 'AKU', labelDy: -255 });
    GH.figure(g, { x: 690, y: floorY, s: 1.00, facing: -1, role: 'slate', garment: 'suit', pose: POSES.point, label: 'OKNUM', labelDy: -255 });
    return;
  }

  // 1E) MULTI-SCENE JOURNEY + ANGLED STAMP VARIATIONS (Layout E)
  if (layout.startsWith('multiscene_')) {
    poly(g, [[520, 860], [740, 710], [960, 860]], '#5c4938');
    rr(g, 550, 860, 380, 420, 6); g.fillStyle = '#8c8275'; g.fill(); g.strokeStyle = '#090c10'; g.lineWidth = 5; g.stroke();
    GH.angledStamp(g, spec.stampText || 'LUNAS', 740, 875, { w: 235, h: 68, angle: -0.09, gold: true });
    GH.speechBubble(g, spec.bubbleText || 'CICILAN Rp0', 290, 860, { tailDir: 'left', gold: true });
    drawScooter(g, 310, floorY, 0.95, 0);
    GH.figure(g, { x: 250, y: floorY, s: 0.96, role: 'hero', pose: POSES.wave, label: 'AKU · BEBAS UTANG', labelDy: -255 });
    return;
  }

  // 1F) FRAME-IN-FRAME LIVE MIRROR VARIATIONS (Layout F)
  if (layout.startsWith('mirror_')) {
    rr(g, 250, 510, 580, 310, 10); g.fillStyle = '#181e28'; g.fill(); g.strokeStyle = '#f5f2ea'; g.lineWidth = 6; g.stroke();
    GH.ghostFigure(g, { x: 420, y: 780, s: 0.54, mode: 'dashed', innerText: spec.ghostLabel || 'DISINGKIRKAN' });
    GH.ghostFigure(g, { x: 690, y: 780, s: 0.54, mode: 'goldGlow' });
    GH.figure(g, { x: 310, y: floorY, s: 0.96, role: 'slate', garment: 'kopiah', pose: POSES.stand, label: 'AYAH', labelDy: -250 });
    GH.figure(g, { x: 480, y: floorY, s: 0.94, role: 'mauve', garment: 'ibu', pose: POSES.stand, label: 'IBU', labelDy: -250 });
    GH.ghostFigure(g, { x: 730, y: floorY, s: 1.02, mode: u > 0.5 ? 'goldGlow' : 'dashed', innerText: 'PEKERJA' });
    return;
  }

  // 2) VALVE TURNAROUND VARIATIONS (Beat 8 across videos)
  if (layout.startsWith('valve_')) {
    GH.flowPipe(g, [[150, 710], [540, 710], [930, 710]], t, {
      gold: true,
      dir: u > 0.45 ? -1 : 1,
      speed: 1.8,
      drops: 10,
      width: 14,
    });
    const wheelAng = lerp(0, Math.PI, ease.inOut(prog(u, 0.1, 0.8)));
    GH.valveWheel(g, 540, 710, 92, wheelAng, { gold: true, label: 'PUTAR BALIK 180° · HAK WARGA' });
    GH.figure(g, { x: 250, y: floorY, s: 0.94, role: 'hero', pose: blendPose(POSES.stand, POSES.point, 0.8), label: 'AKU', labelDy: -250 });
    GH.figure(g, { x: 430, y: floorY, s: 0.92, role: 'slate', garment: 'kopiah', pose: breathe(POSES.stand, t), label: 'AYAH', labelDy: -250 });
    GH.figure(g, { x: 830, y: floorY, s: 0.92, role: 'mauve', garment: 'ibu', facing: -1, pose: breathe(POSES.stand, t + 1), label: 'IBU', labelDy: -250 });
    return;
  }

  // 3) FLOW RECOVERY VARIATIONS (Beat 9 across videos)
  if (layout.startsWith('flow_')) {
    const fill = lerp(0.18, 0.98, ease.inOut(u));
    GH.progressBar(g, {
      x: 540, y: 520, w: 720, h: 32,
      progress: fill, gold: true,
      leftLabel: 'DANA SITAAN', rightLabel: `${Math.round(fill * 100)}% KEMBALI KE WARGA`,
    });
    const targets = [240, 540, 840];
    const tLabels = ['FASILITAS DESA', 'SEKOLAH & GIZI', 'MODAL WARGA'];
    targets.forEach((tx, idx) => {
      GH.flowPipe(g, [[540, 540], [540, 620], [tx, 620], [tx, 680]], t, { gold: true, dir: 1, speed: 1.6, drops: 4 });
      GH.fuelGauge(g, { x: tx, y: 745, r: 64, level: fill, activeGold: true, label: tLabels[idx] });
    });
    GH.figure(g, { x: 260, y: floorY, s: 0.90, role: 'mauve', garment: 'ibu', pose: POSES.cheer, label: 'IBU', labelDy: -250 });
    GH.figure(g, { x: 540, y: floorY, s: 0.94, role: 'hero', pose: POSES.cheer, label: 'AKU', labelDy: -250 });
    GH.figure(g, { x: 820, y: floorY, s: 0.90, role: 'slate', garment: 'kopiah', facing: -1, pose: POSES.cheer, label: 'AYAH', labelDy: -250 });
    return;
  }

  // 4) PADLOCK LOCKED VARIATIONS (Beat 11 across videos)
  if (layout.startsWith('padlock_')) {
    GH.flowPipe(g, [[200, 800], [540, 800], [880, 800]], t, { gold: true, dir: 1, speed: 0.9, drops: 8, width: 12 });
    GH.padlock(g, 540, 790, 1.18, { locked: true, label: 'DIKUNCI AUDIT WARGA · 100% AMAN' });
    GH.figure(g, { x: 220, y: floorY, s: 0.90, role: 'mauve', garment: 'ibu', pose: breathe(POSES.stand, t), label: 'IBU', labelDy: -250 });
    GH.figure(g, { x: 390, y: floorY, s: 0.94, role: 'hero', pose: breathe(POSES.stand, t + 0.5), label: 'AKU', labelDy: -250 });
    GH.figure(g, { x: 560, y: floorY, s: 0.90, role: 'slate', garment: 'kopiah', pose: breathe(POSES.stand, t + 1.1), label: 'AYAH', labelDy: -250 });
    GH.figure(g, { x: 850, y: floorY, s: 0.88, role: 'slate', garment: 'suit', facing: -1, pose: POSES.sad, label: 'KORUPTOR', labelDy: -245 });
    return;
  }

  // 5) CTA ENDING VARIATIONS (Beat 12 across videos)
  if (layout.startsWith('cta_')) {
    const pulseIdx = Math.floor(t * 1.8) % 3;
    const cols = [240, 540, 840];
    const labels = ['PILIHAN 1 · DESA', 'PILIHAN 2 · SEKOLAH', 'PILIHAN 3 · USAHA WARGA'];
    cols.forEach((cx, i) => {
      GH.fuelGauge(g, {
        x: cx, y: 740, r: 74,
        level: i === pulseIdx ? 0.95 : 0.45,
        activeGold: i === pulseIdx,
        label: labels[i],
      });
    });
    GH.microLabel(g, 'TULIS DI KOLOM KOMENTAR 👇', 540, 945, { size: 22, color: GH.PALETTE.goldHi, bg: true });
    GH.figure(g, { x: 330, y: floorY, s: 0.90, role: 'mauve', garment: 'ibu', pose: breathe(POSES.stand, t), label: 'IBU', labelDy: -250 });
    GH.figure(g, { x: 540, y: floorY, s: 0.96, role: 'hero', pose: blendPose(POSES.stand, POSES.wave, 0.85), label: 'AKU', labelDy: -255 });
    GH.figure(g, { x: 750, y: floorY, s: 0.90, role: 'slate', garment: 'kopiah', facing: -1, pose: breathe(POSES.stand, t + 0.8), label: 'AYAH', labelDy: -250 });
    return;
  }

  // 6) STORY-SPECIFIC BESPOKE LAYOUTS
  switch (layout) {
    // --- V2 Bridge ---
    case 'bridge_walk_morning':
    case 'bridge_scooter_risk': {
      drawBridge(g, 110, 680, 860, 240, false, true);
      GH.microLabel(g, 'JEMBATAN KAYU RETAK · CELAH LUBANG', 540, 640, { color: GH.PALETTE.goldHi, bg: true });
      if (layout === 'bridge_scooter_risk') {
        drawScooter(g, 420 + u * 90, 785, 0.95, 0.08 * Math.sin(t * 6));
      }
      GH.figure(g, { x: 310 + u * 80, y: floorY, s: 0.92, role: 'slate', garment: 'kopiah', pose: walkPose(t, 1.1), label: 'AYAH', labelDy: -250 });
      GH.figure(g, { x: 640, y: floorY, s: 0.92, role: 'hero', pose: POSES.think, label: 'AKU', labelDy: -250 });
      break;
    }
    case 'project_board_irony': {
      rr(g, 220, 560, 640, 230, 16);
      g.fillStyle = '#181e28'; g.fill();
      g.strokeStyle = GH.PALETTE.gold; g.lineWidth = 4; g.stroke();
      GH.microLabel(g, 'PAPAN PROYEK: JEMBATAN BETON UTAMA', 540, 625, { size: 20, color: GH.PALETTE.hero });
      GH.microLabel(g, 'ANGGARAN: Rp4.000.000.000 (LUNAS)', 540, 685, { size: 24, color: GH.PALETTE.goldHi });
      GH.microLabel(g, 'REALISASI FISIK: PAPAN KAYU LAPUK', 540, 742, { size: 18, color: '#f87171' });
      GH.figure(g, { x: 340, y: floorY, s: 0.94, role: 'hero', pose: POSES.point, label: 'AKU', labelDy: -250 });
      GH.figure(g, { x: 740, y: floorY, s: 0.92, role: 'slate', garment: 'kopiah', facing: -1, pose: POSES.think, label: 'AYAH', labelDy: -250 });
      break;
    }
    case 'corruptor_guard_bridge': {
      drawBridge(g, 110, 710, 860, 210, true, false);
      GH.microLabel(g, 'JEMBATAN BAJA EMAS DESA · 100% KOKOH', 540, 610, { color: GH.PALETTE.goldHi, bg: true });
      GH.figure(g, { x: 260 + u * 180, y: floorY, s: 0.92, role: 'hero', pose: walkPose(t, 1.3), label: 'ANAK SEKOLAH', labelDy: -250 });
      GH.figure(g, { x: 820, y: floorY, s: 0.90, role: 'slate', garment: 'suit', facing: -1, pose: POSES.wave, label: 'KORUPTOR · PENJAGA POS', labelDy: -250 });
      break;
    }

    // --- V3 Streetlights ---
    case 'ibu_token_bulb':
    case 'warung_morning_prep': {
      // Hanging warm bulb above Ibu's warung table
      seg(g, [[540, 480], [540, 610]], 4, '#94a3b8');
      circle(g, 540, 628, 22, GH.PALETTE.goldHi);
      glow(g, 540, 628, 140, GH.PALETTE.gold, 0.45);
      GH.microLabel(g, 'BOHLAM 5 WATT · TOKEN Rp20.000', 540, 535, { color: GH.PALETTE.goldHi, bg: true });
      // Warung stall table
      rr(g, 330, 1080, 420, 195, 12);
      g.fillStyle = '#232a38'; g.fill();
      g.strokeStyle = GH.PALETTE.boxBorder; g.lineWidth = 3; g.stroke();
      GH.microLabel(g, 'WARUNG SUBUH IBU', 540, 1165, { size: 20, color: GH.PALETTE.hero });
      GH.figure(g, { x: 260, y: floorY, s: 0.94, role: 'mauve', garment: 'ibu', pose: POSES.point, label: 'IBU', labelDy: -250 });
      GH.figure(g, { x: 820, y: floorY, s: 0.92, role: 'slate', garment: 'kopiah', facing: -1, pose: breathe(POSES.stand, t), label: 'AYAH', labelDy: -250 });
      break;
    }
    case 'dead_streetlights_row': {
      [220, 440, 660, 860].forEach(px => drawStreetPole(g, px, floorY, 390, false));
      GH.microLabel(g, 'PROYEK Rp1,8 MILIAR · MATI TOTAL 5 TAHUN', 540, 740, { color: '#f87171', bg: true });
      GH.figure(g, { x: 350, y: floorY, s: 0.94, role: 'hero', pose: POSES.think, label: 'AKU', labelDy: -250 });
      GH.figure(g, { x: 720, y: floorY, s: 0.92, role: 'mauve', garment: 'ibu', facing: -1, pose: POSES.sad, label: 'IBU', labelDy: -250 });
      break;
    }

    // --- V4 Payslip & GPS ---
    case 'payslip_cut_hook':
    case 'hero_waiting_phone':
    case 'progress_salary_cut': {
      const cut = lerp(1.0, 0.62, ease.inOut(u));
      GH.progressBar(g, {
        x: 540, y: 620, w: 720, h: 36,
        progress: cut, gold: true,
        leftLabel: 'SLIP GAJI BULANAN', rightLabel: 'POTONG PAJAK OTOMATIS DETIK KE-1',
      });
      GH.flowPipe(g, [[740, 640], [740, 820]], t, { gold: true, dir: 1, speed: 1.5, drops: 5 });
      GH.fuelGauge(g, { x: 740, y: 890, r: 64, level: 0.85, activeGold: true, label: 'POTONGAN PAJAKMU' });
      GH.figure(g, { x: 340, y: floorY, s: 0.96, role: 'hero', pose: POSES.point, label: 'AKU · LEMBUR', labelDy: -255 });
      break;
    }

    // --- V5 Waiting Bench ---
    case 'citizen_cold_bench':
    case 'broken_bench_elderly': {
      GH.microLabel(g, 'LOKET UMUM · ANTREAN NOMOR 142 (JAM 04:00)', 540, 620, { color: GH.PALETTE.goldHi, bg: true });
      // Cold broken iron bench
      rr(g, 240, 1140, 380, 26, 6);
      g.fillStyle = '#475569'; g.fill();
      seg(g, [[280, 1166], [280, floorY]], 8, GH.PALETTE.outline);
      seg(g, [[580, 1166], [595, floorY]], 8, GH.PALETTE.outline);
      GH.figure(g, { x: 320, y: floorY, s: 0.92, role: 'mauve', garment: 'ibu', pose: POSES.sad, label: 'IBU · ANTRE SUBUH', labelDy: -250 });
      GH.figure(g, { x: 520, y: floorY, s: 0.92, role: 'slate', garment: 'kopiah', pose: POSES.sad, label: 'LANSIA · BERDIRI', labelDy: -250 });
      GH.figure(g, { x: 780, y: floorY, s: 0.94, role: 'hero', facing: -1, pose: POSES.think, label: 'AKU · PEGANG NOMOR 142', labelDy: -250 });
      break;
    }
    case 'corruptor_holding_queue_sign': {
      drawSofa(g, 350, floorY, 290, true);
      GH.microLabel(g, 'SOFA EMAS VIP -> DIPINDAH KE LOKET LANSIA', 350, 960, { color: GH.PALETTE.goldHi, bg: true });
      GH.figure(g, { x: 290, y: floorY, s: 0.90, role: 'mauve', garment: 'ibu', pose: POSES.cheer, label: 'IBU NYAMAN', labelDy: -250 });
      GH.figure(g, { x: 420, y: floorY, s: 0.90, role: 'slate', garment: 'kopiah', pose: breathe(POSES.stand, t), label: 'LANSIA', labelDy: -250 });
      // Corruptor standing holding queue sign
      rr(g, 740, 820, 190, 95, 12);
      g.fillStyle = GH.PALETTE.gold; g.fill();
      g.strokeStyle = GH.PALETTE.outline; g.lineWidth = 4; g.stroke();
      text(g, 'NO. 142', 835, 868, { size: 32, color: GH.PALETTE.outline, font: SANS, weight: 900 });
      seg(g, [[835, 915], [835, 1120]], 8, GH.PALETTE.outline);
      GH.figure(g, { x: 790, y: floorY, s: 0.90, role: 'slate', garment: 'suit', facing: -1, pose: POSES.sad, label: 'KORUPTOR · BERDIRI 8 JAM', labelDy: -250 });
      break;
    }

    // --- V6 Nutrition Tray ---
    case 'parents_send_child_school':
    case 'golden_full_tray_spec': {
      drawFoodTray(g, 540, 740, 320, 175, true);
      GH.microLabel(g, 'STANDAR ANGGARAN: Rp25.000 (SUSU + AYAM + BUAH)', 540, 595, { color: GH.PALETTE.goldHi, bg: true });
      GH.figure(g, { x: 280, y: floorY, s: 0.92, role: 'mauve', garment: 'ibu', pose: breathe(POSES.stand, t), label: 'IBU', labelDy: -250 });
      GH.figure(g, { x: 540, y: floorY, s: 0.80, role: 'hero', pose: POSES.cheer, label: 'ANAK SD', labelDy: -245 });
      GH.figure(g, { x: 800, y: floorY, s: 0.92, role: 'slate', garment: 'kopiah', facing: -1, pose: breathe(POSES.stand, t + 1), label: 'AYAH', labelDy: -250 });
      break;
    }
    case 'child_looking_empty_tray': {
      drawFoodTray(g, 540, 760, 320, 175, false);
      GH.microLabel(g, 'KENYATAAN DI MEJA: SISA Rp6.000 (NASI + 1 KERUPUK)', 540, 610, { color: '#f87171', bg: true });
      GH.figure(g, { x: 540, y: floorY, s: 0.86, role: 'hero', pose: POSES.sad, label: 'MURID SD', labelDy: -245 });
      break;
    }

    // --- V7 Asphalt 2 CM ---
    case 'cross_section_asphalt_hook':
    case 'ruler_measure_2cm': {
      // Left side: 15 CM golden proposal block; Right side: 2 CM thin grey peel
      rr(g, 140, 660, 350, 220, 12);
      g.fillStyle = GH.PALETTE.outline; g.fill();
      rr(g, 146, 666, 338, 208, 10);
      g.fillStyle = GH.PALETTE.gold; g.fill();
      text(g, 'PROPOSAL: 15 CM', 315, 770, { size: 28, color: GH.PALETTE.outline, font: SANS, weight: 900 });

      rr(g, 590, 840, 350, 40, 8);
      g.fillStyle = '#64748b'; g.fill();
      GH.microLabel(g, 'KENYATAAN: CUMA 2 CM (MENGELUPAS)', 765, 795, { color: '#f87171', bg: true });

      GH.figure(g, { x: 330, y: floorY, s: 0.94, role: 'hero', pose: POSES.point, label: 'AKU · UKUR JALAN', labelDy: -250 });
      GH.figure(g, { x: 750, y: floorY, s: 0.92, role: 'slate', garment: 'kopiah', facing: -1, pose: POSES.sad, label: 'AYAH', labelDy: -250 });
      break;
    }
    case 'fresh_thin_asphalt':
    case 'rain_peeling_road':
    case 'father_scooter_pothole': {
      // Pothole in the floor
      poly(g, [[430, floorY], [670, floorY], [630, floorY + 46], [470, floorY + 46]], '#05070b');
      GH.microLabel(g, 'LUBANG JALAN DALAM · ASPAL 2 CM HANCUR', 550, 740, { color: '#f87171', bg: true });
      drawScooter(g, 480, floorY - 4, 0.98, 0.24);
      GH.figure(g, { x: 310, y: floorY, s: 0.92, role: 'slate', garment: 'kopiah', pose: POSES.sad, label: 'AYAH JATUH', labelDy: -250 });
      GH.figure(g, { x: 780, y: floorY, s: 0.92, role: 'mauve', garment: 'ibu', facing: -1, pose: POSES.think, label: 'IBU', labelDy: -250 });
      break;
    }

    // --- V8 Scholarship & Toga ---
    case 'father_sell_scooter_tuition': {
      drawScooter(g, 540, floorY, 1.05, 0);
      GH.microLabel(g, 'DIJUAL DEMI UANG KULIAH PERTAMA', 540, 960, { color: GH.PALETTE.goldHi, bg: true });
      GH.figure(g, { x: 280, y: floorY, s: 0.92, role: 'slate', garment: 'kopiah', pose: POSES.point, label: 'AYAH', labelDy: -250 });
      GH.figure(g, { x: 800, y: floorY, s: 0.94, role: 'hero', facing: -1, pose: POSES.sad, label: 'AKU', labelDy: -250 });
      break;
    }
    case 'gpa_progress_high': {
      GH.progressBar(g, {
        x: 540, y: 680, w: 720, h: 38,
        progress: 0.98, gold: true,
        leftLabel: 'PRESTASI ANAK PETANI', rightLabel: 'IPK 3,92 / 4,00 (TERTINGGI)',
      });
      GH.figure(g, { x: 320, y: floorY, s: 0.92, role: 'mauve', garment: 'ibu', pose: breathe(POSES.stand, t), label: 'IBU', labelDy: -250 });
      GH.figure(g, { x: 540, y: floorY, s: 0.96, role: 'hero', pose: POSES.cheer, label: 'AKU · IPK 3,92', labelDy: -255 });
      GH.figure(g, { x: 760, y: floorY, s: 0.92, role: 'slate', garment: 'kopiah', facing: -1, pose: breathe(POSES.stand, t + 1), label: 'AYAH', labelDy: -250 });
      break;
    }
    case 'hero_golden_toga_parents': {
      GH.stage(g, { floorY, arches: true, bunting: true });
      GH.pill(g, pill, { sub });
      GH.headline(g, hl, { y: E.H * 0.195 });
      GH.figure(g, { x: 270, y: floorY, s: 0.92, role: 'mauve', garment: 'ibu', pose: POSES.cheer, label: 'IBU', labelDy: -250 });
      GH.figure(g, { x: 540, y: floorY, s: 1.02, role: 'hero', garment: 'toga', pose: breathe(POSES.stand, t), label: 'SARJANA PERTAMA KELUARGA', labelDy: -265 });
      GH.figure(g, { x: 810, y: floorY, s: 0.92, role: 'slate', garment: 'kopiah', facing: -1, pose: POSES.cheer, label: 'AYAH', labelDy: -250 });
      break;
    }

    // --- V9 Giant Scale: Cart vs Briefcase ---
    case 'giant_scale_cart_vs_briefcase':
    case 'father_pushing_heavy_cart':
    case 'small_coins_table': {
      // Balance beam tilted toward the 80 Billion golden briefcase
      seg(g, [[540, 880], [540, 680]], 14, GH.PALETTE.outline);
      seg(g, [[220, 660], [860, 730]], 12, GH.PALETTE.gold);
      drawCart(g, 240, 655, 0.85, false);
      GH.microLabel(g, 'GEROBAK AYAH 80 KG · Rp50.000', 250, 520, { color: GH.PALETTE.hero, bg: true });
      drawBriefcase(g, 840, 690, 0.95, true);
      GH.microLabel(g, 'KOPER SUAP · Rp80 MILIAR', 830, 595, { color: GH.PALETTE.goldHi, bg: true });

      GH.figure(g, { x: 280, y: floorY, s: 0.92, role: 'slate', garment: 'kopiah', pose: walkPose(t, 0.9), label: 'AYAH · 10 JAM KERJA', labelDy: -250 });
      GH.figure(g, { x: 800, y: floorY, s: 0.92, role: 'gold', garment: 'suit', facing: -1, pose: POSES.stand, label: 'OKNUM PEJABAT', labelDy: -250 });
      break;
    }

    // --- V10 Three Generations Burden ---
    case 'three_generations_burden_hook':
    case 'three_gen_walking_tax':
    case 'heavy_stone_three_gen': {
      // Giant heavy debt stone carried across 3 generations
      rr(g, 210, 760, 660, 130, 28);
      g.fillStyle = GH.PALETTE.outline; g.fill();
      rr(g, 218, 768, 644, 114, 24);
      g.fillStyle = '#334155'; g.fill();
      text(g, 'BEBAN UTANG & BUNGA KORUPSI', 540, 825, { size: 28, color: GH.PALETTE.goldHi, font: SANS, weight: 900 });

      GH.figure(g, { x: 280, y: floorY, s: 0.90, role: 'slate', garment: 'kopiah', pose: POSES.sad, label: 'KAKEK (1998)', labelDy: -245 });
      GH.figure(g, { x: 540, y: floorY, s: 0.92, role: 'slate', garment: 'kopiah', pose: POSES.sad, label: 'AYAH (2026)', labelDy: -245 });
      GH.figure(g, { x: 800, y: floorY, s: 0.94, role: 'hero', pose: POSES.sad, label: 'AKU (MASA DEPAN)', labelDy: -245 });
      break;
    }

    // --- Default Gauge / Siphon Metaphor (Beats 4, 5, 6 across videos) ---
    default: {
      const drain = ease.inOut(prog(u, 0.05, 0.85));
      const cLv = lerp(0.82, 0.08, drain);
      const oLv = lerp(0.18, 0.96, drain);
      const xs = [180, 410, 640, 890];
      const gLabels = ['KERINGAT AYAH', 'USAHA IBU', 'GAJI AKU', 'REKENING OKNUM'];
      xs.forEach((gx, i) => {
        const isOknum = i === 3;
        GH.fuelGauge(g, {
          x: gx, y: 690, r: 62,
          level: isOknum ? oLv : cLv,
          activeGold: isOknum,
          label: gLabels[i],
        });
      });
      GH.flowPipe(g, [[180, 610], [180, 560], [890, 560], [890, 610]], t, { gold: true, dir: 1, speed: 1.5, drops: 8 });
      GH.figure(g, { x: 220, y: floorY, s: 0.90, role: 'slate', garment: 'kopiah', pose: POSES.sad, label: 'AYAH', labelDy: -250 });
      GH.figure(g, { x: 440, y: floorY, s: 0.90, role: 'mauve', garment: 'ibu', pose: POSES.sad, label: 'IBU', labelDy: -250 });
      GH.figure(g, { x: 650, y: floorY, s: 0.94, role: 'hero', pose: POSES.think, label: 'AKU', labelDy: -250 });
      GH.figure(g, { x: 880, y: floorY, s: 0.92, role: 'gold', garment: 'suit', facing: -1, pose: POSES.cheer, label: 'OKNUM', labelDy: -250 });
      break;
    }
  }
}

function drawSplitTop(g, box, layout, t, u) {
  const fl = box.floorY;
  if (layout.includes('bridge')) {
    const isGolden = layout.includes('golden');
    drawBridge(g, box.x + 30, box.y + 50, box.w - 60, box.h - 60, isGolden, !isGolden);
    GH.microLabel(g, isGolden ? 'DESA KITA · JEMBATAN BAJA EMAS KOKOH' : 'DESA KITA · JEMBATAN KAYU RETAK (Rp4 M)', box.cx, box.y + 38, {
      color: isGolden ? GH.PALETTE.goldHi : GH.PALETTE.hero,
    });
    GH.figure(g, { x: box.x + 260 + u * 180, y: fl, s: 0.68, role: 'hero', pose: walkPose(t, 1.2), reflect: false });
    return;
  }
  if (layout.includes('warung') || layout.includes('alley')) {
    const isBright = layout.includes('bright_warung');
    drawStreetPole(g, box.x + 220, fl, 210, isBright);
    drawStreetPole(g, box.x + 680, fl, 210, isBright);
    GH.microLabel(g, isBright ? 'WARUNG IBU & GANG DESA · TERANG BENDERANG' : 'WARUNG SUBUH (5 WATT) · JALAN DEPAN GELAP', box.cx, box.y + 38, {
      color: isBright ? GH.PALETTE.goldHi : GH.PALETTE.hero,
    });
    GH.figure(g, { x: box.x + 450, y: fl, s: 0.72, role: 'mauve', garment: 'ibu', pose: isBright ? POSES.cheer : breathe(POSES.stand, t), label: 'IBU', labelDy: -245, reflect: false });
    return;
  }
  if (layout.includes('tray') || layout.includes('buffet')) {
    const isRecovered = layout.includes('full_school');
    drawFoodTray(g, box.cx, box.y + box.h * 0.54, 250, 130, true);
    GH.microLabel(g, isRecovered ? 'MEJA SEKOLAH · PULIH Rp25.000 PENUH GIZI' : 'LAPORAN PDF · Rp25.000 EMPAT SEHAT LIMA SEMPURNA', box.cx, box.y + 38, {
      color: GH.PALETTE.goldHi,
    });
    return;
  }
  if (layout.includes('study') || layout.includes('sewing') || layout.includes('rejected') || layout.includes('graduation')) {
    const isGrad = layout.includes('graduation');
    GH.microLabel(g, isGrad ? 'PANGGUNG WISUDA · TOGA EMAS ANAK PETANI' : '02:00 SUBUH · AKU BELAJAR & IBU MENJAHIT (IPK 3,92)', box.cx, box.y + 38, {
      color: isGrad ? GH.PALETTE.goldHi : GH.PALETTE.hero,
    });
    GH.figure(g, { x: box.x + 310, y: fl, s: 0.74, role: 'mauve', garment: 'ibu', pose: isGrad ? POSES.cheer : POSES.holdFront, label: 'IBU', labelDy: -245, reflect: false });
    GH.figure(g, { x: box.x + 620, y: fl, s: 0.76, role: 'hero', garment: isGrad ? 'toga' : 'none', pose: isGrad ? POSES.cheer : POSES.holdFront, label: 'AKU', labelDy: -250, reflect: false });
    return;
  }
  if (layout.includes('cart')) {
    const isGold = layout.includes('golden_carts');
    drawCart(g, box.x + 480, fl, 0.85, isGold);
    GH.microLabel(g, isGold ? 'PASAR BANGKIT · 1.600 GEROBAK MODAL EMAS' : 'PASAR PAGI · GEROBAK 80 KG AYAH DIGUSUR', box.cx, box.y + 38, {
      color: isGold ? GH.PALETTE.goldHi : GH.PALETTE.hero,
    });
    GH.figure(g, { x: box.x + 310, y: fl, s: 0.74, role: 'slate', garment: 'kopiah', pose: isGold ? POSES.cheer : walkPose(t, 1.0), label: 'AYAH', labelDy: -245, reflect: false });
    return;
  }
  // Generic citizen top box (V4, V5, V7, V10)
  const isHappy = layout.includes('golden') || layout.includes('smooth') || layout.includes('upright') || layout.includes('surround');
  if (isHappy) glow(g, box.cx, box.y + box.h * 0.5, 220, GH.PALETTE.gold, 0.28);
  GH.microLabel(g, isHappy ? 'WARGA PULIH · HAK KEMBALI 100%' : 'NASIB WARGA · TAAT PAJAK TAPI DIKORBANKAN', box.cx, box.y + 38, {
    color: isHappy ? GH.PALETTE.goldHi : GH.PALETTE.hero,
  });
  GH.figure(g, { x: box.x + 280, y: fl, s: 0.72, role: 'mauve', garment: 'ibu', pose: isHappy ? POSES.cheer : POSES.sad, label: 'IBU', labelDy: -245, reflect: false });
  GH.figure(g, { x: box.x + 480, y: fl, s: 0.74, role: 'hero', pose: isHappy ? POSES.cheer : POSES.think, label: 'AKU', labelDy: -245, reflect: false });
  GH.figure(g, { x: box.x + 680, y: fl, s: 0.72, role: 'slate', garment: 'kopiah', facing: -1, pose: isHappy ? POSES.cheer : POSES.sad, label: 'AYAH', labelDy: -245, reflect: false });
}

function drawSplitBot(g, box, layout, t, u) {
  const fl = box.floorY;
  const isSeized = layout.includes('empty') || layout.includes('dark_villa') || layout.includes('prison') || layout.includes('thin_mat') || layout.includes('corruptor_cart') || layout.includes('locked_cell') || layout.includes('surround') || layout.includes('parents');

  if (layout.includes('graduation')) {
    GH.microLabel(g, 'KURSI PENONTON · AYAH & IBU TEPUK TANGAN BANGGA', box.cx, box.y + 38, { color: GH.PALETTE.goldHi });
    GH.figure(g, { x: box.x + 360, y: fl, s: 0.74, role: 'mauve', garment: 'ibu', pose: POSES.cheer, label: 'IBU', labelDy: -245, reflect: false });
    GH.figure(g, { x: box.x + 560, y: fl, s: 0.74, role: 'slate', garment: 'kopiah', pose: POSES.cheer, label: 'AYAH', labelDy: -245, reflect: false });
    return;
  }
  if (layout.includes('garage') || layout.includes('sportcars')) {
    if (!isSeized) {
      drawLuxuryCar(g, box.x + 260, fl, 0.75, true);
      drawLuxuryCar(g, box.x + 540, fl, 0.75, true);
      drawLuxuryCar(g, box.x + 780, fl, 0.75, true);
      GH.microLabel(g, 'GARASI PEJABAT · 3 MOBIL MEWAH EMAS', box.cx, box.y + 38, { color: GH.PALETTE.goldHi });
    } else {
      GH.microLabel(g, 'GARASI DISITA WARGA · 0 MOBIL (DILEBUR JADI JEMBATAN)', box.cx, box.y + 38, { color: '#94a3b8' });
      GH.figure(g, { x: box.cx, y: fl, s: 0.74, role: 'slate', garment: 'suit', pose: POSES.sad, label: 'OKNUM · KOSONG', labelDy: -245, reflect: false });
    }
    return;
  }
  if (layout.includes('tray') || layout.includes('kerupuk')) {
    drawFoodTray(g, box.cx, box.y + box.h * 0.56, 250, 130, false);
    GH.microLabel(g, isSeized ? 'MEJA TAHANAN KORUPTOR · NAMPAN Rp6.000 (1 KERUPUK)' : 'MEJA SEKOLAH ANAK · TINGGAL NASI KERING & 1 KERUPUK', box.cx, box.y + 38, {
      color: '#f87171',
    });
    return;
  }
  if (!isSeized) {
    drawSofa(g, box.x + 520, fl, 240, true);
    GH.microLabel(g, 'RUANG VIP OKNUM · MEWAH DARI POTONGAN WARGA', box.cx, box.y + 38, { color: GH.PALETTE.goldHi });
    GH.figure(g, { x: box.x + 310, y: fl, s: 0.74, role: 'gold', garment: 'suit', pose: POSES.cheer, label: 'OKNUM VIP', labelDy: -245, reflect: false });
  } else {
    GH.microLabel(g, 'ASET DISITA 100% · OKNUM WAJIB LUNASI KERUGIAN WARGA', box.cx, box.y + 38, { color: '#94a3b8' });
    GH.figure(g, { x: box.cx, y: fl, s: 0.74, role: 'slate', garment: 'suit', pose: POSES.sad, label: 'KORUPTOR · DISITA', labelDy: -245, reflect: false });
  }
}

// --- Batch 2 Bespoke Props & Scene Dispatcher (V11..V20) ---

function drawWallet(g, x, y, s = 1, full = true, gold = false) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  if (gold) glow(g, 0, -45, 110, GH.PALETTE.gold, 0.38);
  if (full) {
    // Banknotes sticking out on top
    rr(g, -54, -96, 108, 42, 6);
    g.fillStyle = GH.PALETTE.outline; g.fill();
    rr(g, -50, -92, 100, 36, 4);
    g.fillStyle = gold ? GH.PALETTE.goldHi : '#4e8a64'; g.fill();
  }
  rr(g, -72, -74, 144, 74, 14);
  g.fillStyle = GH.PALETTE.outline; g.fill();
  rr(g, -66, -68, 132, 62, 11);
  g.fillStyle = gold ? GH.PALETTE.gold : '#6b4c35'; g.fill();
  // Clasp strap
  rr(g, 18, -48, 50, 24, 6);
  g.fillStyle = GH.PALETTE.outline; g.fill();
  circle(g, 32, -36, 6, GH.PALETTE.goldHi);
  g.restore();
}

function drawCameraTripod(g, x, floorY, flash = false) {
  g.save();
  const cy = floorY - 165;
  seg(g, [[x, cy + 20], [x - 42, floorY]], 8, GH.PALETTE.outline);
  seg(g, [[x, cy + 20], [x + 42, floorY]], 8, GH.PALETTE.outline);
  seg(g, [[x, cy + 20], [x, floorY]], 7, GH.PALETTE.outline);
  rr(g, x - 36, cy - 22, 72, 46, 8);
  g.fillStyle = GH.PALETTE.outline; g.fill();
  rr(g, x - 31, cy - 17, 62, 36, 6);
  g.fillStyle = '#334155'; g.fill();
  circle(g, x + 28, cy, 14, GH.PALETTE.outline);
  circle(g, x + 28, cy, 9, flash ? GH.PALETTE.goldHi : '#94a3b8');
  if (flash) glow(g, x + 48, cy, 130, GH.PALETTE.goldHi, 0.55);
  g.restore();
}

function drawHouseWithStamp(g, x, floorY, stampText = 'HALAL & LUNAS', gold = true) {
  g.save();
  if (gold) glow(g, x, floorY - 220, 240, GH.PALETTE.gold, 0.28);
  poly(g, [[x - 210, floorY - 380], [x, floorY - 520], [x + 210, floorY - 380]], GH.PALETTE.outline);
  poly(g, [[x - 198, floorY - 382], [x, floorY - 510], [x + 198, floorY - 382]], '#5c4938');
  rr(g, x - 175, floorY - 382, 350, 382, 6);
  g.fillStyle = '#8c8275'; g.fill();
  g.strokeStyle = GH.PALETTE.outline; g.lineWidth = 5; g.stroke();
  // Door & warm window
  rr(g, x - 95, floorY - 210, 78, 210, 4);
  g.fillStyle = '#4a3a2c'; g.fill(); g.stroke();
  rr(g, x + 15, floorY - 210, 105, 95, 4);
  g.fillStyle = gold ? GH.PALETTE.goldHi : '#334155'; g.fill(); g.stroke();
  if (stampText) {
    GH.angledStamp(g, stampText, x, floorY - 375, { w: 255, h: 66, angle: -0.08, gold });
  }
  g.restore();
}

function renderBatch2Layout(g, ctx, spec, floorY) {
  const { t, u } = ctx;
  const { layout } = spec;

  // Common turnaround beats across V11..V20:
  if (layout.includes('_valve_')) {
    GH.flowPipe(g, [[150, 720], [540, 720], [930, 720]], t, { gold: true, dir: u > 0.45 ? -1 : 1, speed: 1.8, drops: 10, width: 14 });
    const ang = lerp(0, Math.PI, ease.inOut(prog(u, 0.1, 0.85)));
    GH.valveWheel(g, 540, 720, 92, ang, { gold: true, label: spec.valveLabel || 'PUTAR BALIK ATURAN · 180°' });
    GH.figure(g, { x: 260, y: floorY, s: 0.94, role: 'hero', pose: POSES.point, label: 'AKU', labelDy: -250 });
    GH.figure(g, { x: 460, y: floorY, s: 0.92, role: 'slate', garment: 'kopiah', pose: breathe(POSES.stand, t), label: 'AYAH', labelDy: -250 });
    GH.figure(g, { x: 820, y: floorY, s: 0.92, role: 'mauve', garment: 'ibu', facing: -1, pose: breathe(POSES.stand, t + 1), label: 'IBU', labelDy: -250 });
    return;
  }

  if (layout.includes('_flow_')) {
    const fill = lerp(0.18, 0.98, ease.inOut(u));
    GH.progressBar(g, {
      x: 540, y: 520, w: 720, h: 32,
      progress: fill, gold: true,
      leftLabel: spec.flowLeft || 'DANA SITAAN',
      rightLabel: `${Math.round(fill * 100)}% KEMBALI KE WARGA`,
    });
    const targets = [240, 540, 840];
    const tLabels = spec.flowTargets || ['JALAN & DESA', 'SEKOLAH & GURU', 'PASAR & OBAT'];
    targets.forEach((tx, idx) => {
      GH.flowPipe(g, [[540, 540], [540, 620], [tx, 620], [tx, 680]], t, { gold: true, dir: 1, speed: 1.6, drops: 4 });
      GH.fuelGauge(g, { x: tx, y: 745, r: 64, level: fill, activeGold: true, label: tLabels[idx] });
    });
    GH.figure(g, { x: 260, y: floorY, s: 0.90, role: 'mauve', garment: 'ibu', pose: POSES.cheer, label: 'IBU', labelDy: -250 });
    GH.figure(g, { x: 540, y: floorY, s: 0.94, role: 'hero', pose: POSES.cheer, label: 'AKU', labelDy: -250 });
    GH.figure(g, { x: 820, y: floorY, s: 0.90, role: 'slate', garment: 'kopiah', facing: -1, pose: POSES.cheer, label: 'AYAH', labelDy: -250 });
    return;
  }

  if (layout.includes('_punchline_')) {
    GH.flowPipe(g, [[200, 800], [540, 800], [880, 800]], t, { gold: true, dir: 1, speed: 0.9, drops: 8, width: 12 });
    GH.padlock(g, 540, 790, 1.18, { locked: true, label: spec.lockLabel || 'DIKUNCI HUKUM WARGA · 100% ADIL' });
    GH.figure(g, { x: 230, y: floorY, s: 0.90, role: 'mauve', garment: 'ibu', pose: breathe(POSES.stand, t), label: 'IBU', labelDy: -250 });
    GH.figure(g, { x: 410, y: floorY, s: 0.94, role: 'hero', pose: POSES.cheer, label: 'AKU', labelDy: -250 });
    GH.figure(g, { x: 590, y: floorY, s: 0.90, role: 'slate', garment: 'kopiah', pose: breathe(POSES.stand, t + 1), label: 'AYAH', labelDy: -250 });
    GH.figure(g, { x: 850, y: floorY, s: 0.88, role: 'slate', garment: 'suit', facing: -1, pose: POSES.sad, label: 'OKNUM', labelDy: -245 });
    return;
  }

  if (layout.includes('_cta')) {
    const pulseIdx = Math.floor(t * 1.8) % 3;
    const cols = [240, 540, 840];
    const labels = spec.ctaLabels || ['PILIHAN 1 · DESA', 'PILIHAN 2 · SEKOLAH', 'PILIHAN 3 · PASAR'];
    cols.forEach((cx, i) => {
      GH.fuelGauge(g, { x: cx, y: 740, r: 74, level: i === pulseIdx ? 0.95 : 0.45, activeGold: i === pulseIdx, label: labels[i] });
    });
    GH.microLabel(g, 'TULIS PILIHANMU DI KOMENTAR 👇', 540, 945, { size: 22, color: GH.PALETTE.goldHi, bg: true });
    GH.figure(g, { x: 330, y: floorY, s: 0.90, role: 'mauve', garment: 'ibu', pose: breathe(POSES.stand, t), label: 'IBU', labelDy: -250 });
    GH.figure(g, { x: 540, y: floorY, s: 0.96, role: 'hero', pose: blendPose(POSES.stand, POSES.wave, 0.85), label: 'AKU', labelDy: -255 });
    GH.figure(g, { x: 750, y: floorY, s: 0.90, role: 'slate', garment: 'kopiah', facing: -1, pose: breathe(POSES.stand, t + 0.8), label: 'AYAH', labelDy: -250 });
    return;
  }

  // --- V11: Telat 5 Menit vs Proyek 5 Tahun (Layout D Flashback + Gold Timer + Receipt + Blueprint) ---
  if (layout.startsWith('v11_')) {
    if (layout === 'v11_b1_hook_0805') {
      GH.receiptCard(g, { x: 290, y: 590, topLabel: 'DENDA PAJAK MOTOR', mainValue: 'Rp150.000', subLabel: 'TELAT 5 MENIT', gold: false });
      GH.speechBubble(g, 'TELAT SEHARI: DENDA!', 670, 810, { tailDir: 'right', gold: false });
      drawScooter(g, 280, floorY, 0.95, 0);
      GH.figure(g, { x: 430, y: floorY, s: 0.96, role: 'hero', pose: POSES.sad, label: 'AKU · KURIR', labelDy: -255 });
      GH.figure(g, { x: 740, y: floorY, s: 0.94, facing: -1, role: 'slate', garment: 'suit', pose: POSES.point, label: 'LOKET DENDA', labelDy: -250 });
      return;
    }
    if (layout === 'v11_b2_flashback_0430') {
      // Rain drops + scooter carrying packages at 04.30
      for (let i = 0; i < 16; i++) {
        const rx = 140 + ((i * 57) % 800);
        const ry = 520 + (((i * 83) + Math.floor(t * 280)) % 560);
        seg(g, [[rx, ry], [rx - 8, ry + 26]], 2.5, 'rgba(148,163,184,0.45)');
      }
      GH.microLabel(g, 'HUJAN SUBUH · CARI UANG BAYAR PAJAK', 540, 620, { color: GH.PALETTE.goldHi, bg: true });
      drawScooter(g, 420 + u * 140, floorY, 1.0, 0);
      GH.figure(g, { x: 290 + u * 140, y: floorY, s: 0.96, role: 'hero', pose: walkPose(t, 1.2), label: 'AKU · JAM 04.30', labelDy: -255 });
      return;
    }
    if (layout === 'v11_b3_flashback_0645') {
      poly(g, [[430, floorY], [680, floorY], [640, floorY + 48], [470, floorY + 48]], '#05070b');
      GH.speechBubble(g, 'BAN PECAH DI LUBANG!', 360, 800, { tailDir: 'left', gold: false });
      drawScooter(g, 500, floorY - 4, 0.98, 0.25);
      GH.figure(g, { x: 320, y: floorY, s: 0.96, role: 'hero', pose: POSES.sad, label: 'AKU · JAM 06.45', labelDy: -255 });
      return;
    }
    if (layout === 'v11_b4_mangkrak_5tahun') {
      GH.blueprintBoard(g, { x: 360, floorY, topLabel: 'PROYEK JALAN Rp12 M', title: 'MANGKRAK 5 THN', crumpledCount: 7, gold: false });
      GH.receiptCard(g, { x: 740, y: 630, topLabel: 'DENDA KONTRAKTOR', mainValue: 'Rp 0', subLabel: 'BEBAS SANKSI 5 TAHUN', gold: true });
      GH.figure(g, { x: 740, y: floorY, s: 0.94, facing: -1, role: 'gold', garment: 'suit', pose: POSES.cheer, label: 'OKNUM PROYEK', labelDy: -250 });
      return;
    }
    if (layout === 'v11_b5_chat_tambah_biaya') {
      GH.chatToast(g, { x: 360, y: 660, sender: 'OKNUM KONTRAKTOR', message: 'Proyek belum kelar, tambah 4 M lagi.', tag: 'SANTAI', timeStr: '10.00', gold: true });
      drawSofa(g, 700, floorY, 240, true);
      GH.figure(g, { x: 690, y: floorY, s: 0.92, role: 'gold', garment: 'suit', pose: POSES.sit, label: 'MINTA TAMBAH BIAYA', labelDy: -245 });
      return;
    }
    if (layout === 'v11_b6_opensplit_5m_vs_5y') {
      GH.openSplitStage(g, {
        topFloorY: 830, dividerY: 860, botFloorY: 1360,
        active: 'both',
        topTag: 'PROYEK JALAN · TELAT 5 TAHUN (DENDA Rp0)',
        botTag: 'WARGA KURIR · TELAT 5 MENIT (DENDA Rp150 RB)',
        topDraw: (g2, z) => {
          GH.blueprintBoard(g2, { x: 380, floorY: z.floorY, topLabel: 'MANGKRAK', title: 'TELAT 5 TAHUN', crumpledCount: 5 });
          GH.figure(g2, { x: 700, y: z.floorY, s: 0.88, facing: -1, role: 'gold', garment: 'suit', pose: POSES.cheer, reflect: false });
        },
        botDraw: (g2, z) => {
          GH.receiptCard(g2, { x: 310, y: 1080, topLabel: 'DENDA WARGA', mainValue: 'Rp150.000', subLabel: 'LEWAT 5 MENIT' });
          drawScooter(g2, 580, z.floorY, 0.85, 0.18);
          GH.figure(g2, { x: 740, y: z.floorY, s: 0.90, role: 'hero', pose: POSES.sad, reflect: true });
        },
      });
      return;
    }
    if (layout === 'v11_b10_smooth_road_stamped') {
      rr(g, 110, floorY - 18, 860, 22, 6); g.fillStyle = GH.PALETTE.gold; g.fill();
      GH.angledStamp(g, 'BEBAS DENDA WARGA', 540, 710, { w: 310, h: 68, angle: -0.06, gold: true });
      drawScooter(g, 380 + u * 220, floorY - 12, 1.0, 0);
      GH.figure(g, { x: 260, y: floorY, s: 0.96, role: 'hero', pose: POSES.cheer, label: 'PAJAK DITANGGUNG DENDA PROYEK', labelDy: -255 });
      return;
    }
  }

  // --- V12: Slip Bulan Ini (Layout B Open-Split + Expense Stack + Receipt) ---
  if (layout.startsWith('v12_')) {
    if (layout.includes('opensplit')) {
      const rev = layout.includes('reversed');
      const act = layout.includes('top') ? 'top' : layout.includes('bot') ? 'bottom' : 'both';
      GH.openSplitStage(g, {
        topFloorY: 830, dividerY: 860, botFloorY: 1360,
        active: act,
        topTag: rev ? 'GURU DESA · TUNJANGAN Rp15 JUTA LUNAS' : 'KOMISI RAPAT HOTEL · 3 JAM DUDUK',
        botTag: rev ? 'OKNUM RAPAT · TUNJANGAN Rp0 (WAJIB MENGAJAR)' : 'GURU HONORER DESA · 30 HARI MENGAJAR',
        topDraw: (g2, z) => {
          GH.expenseStack(g2, {
            x: 95, y: 540,
            topLabel: rev ? 'GAJI & TUNJANGAN GURU' : 'TUNJANGAN RAPAT',
            mainValue: rev ? 'Rp15 JUTA' : 'Rp45 JUTA',
            items: rev ? ['BUKU GRATIS 100%', 'BEASISWA ANAK GURU'] : ['RAPAT HOTEL 3 JAM', 'KOPI & SNACK VIP'],
          });
          if (!rev) drawSofa(g2, 700, z.floorY, 210, true);
          GH.figure(g2, { x: 690, y: z.floorY, s: 0.90, role: rev ? 'hero' : 'gold', garment: rev ? 'none' : 'suit', pose: rev ? POSES.cheer : POSES.sit, reflect: false });
        },
        botDraw: (g2, z) => {
          GH.expenseStack(g2, {
            x: 95, y: 1020,
            topLabel: rev ? 'TUNJANGAN OKNUM' : 'GAJI HONORER',
            mainValue: rev ? 'Rp 0' : 'Rp1,2 JUTA',
            items: rev ? ['FASILITAS HOTEL DICABUT', 'POTONG GAJI OTOMATIS'] : ['BELI KAPUR & BUKU', 'BENSIN KE DESA', 'SUSU ANAK'],
          });
          GH.figure(g2, { x: 690, y: z.floorY, s: 0.94, role: rev ? 'slate' : 'hero', garment: rev ? 'suit' : 'none', pose: rev ? POSES.sad : POSES.point, reflect: true });
        },
      });
      return;
    }
    if (layout === 'v12_b4_receipt_comparison') {
      GH.receiptCard(g, { x: 300, y: 620, topLabel: 'SLIP GURU HONORER', mainValue: 'Rp1,2 JUTA', subLabel: 'SISA DOMPET: Rp85.000', gold: false });
      GH.receiptCard(g, { x: 780, y: 620, topLabel: 'SLIP RAPAT 3 JAM', mainValue: 'Rp45 JUTA', subLabel: 'CAIR DETIK ITU JUGA', gold: true });
      GH.figure(g, { x: 300, y: floorY, s: 0.96, role: 'hero', pose: POSES.sad, label: 'GURU DESA', labelDy: -255 });
      GH.figure(g, { x: 780, y: floorY, s: 0.94, facing: -1, role: 'gold', garment: 'suit', pose: POSES.cheer, label: 'OKNUM RAPAT', labelDy: -250 });
      return;
    }
    if (layout === 'v12_b6_class_vs_ballroom') {
      GH.splitBoxes(g, {
        topY: E.H * 0.255, botY: E.H * 0.495, h: E.H * 0.21,
        activeBox: 'both',
        topTag: 'BALLROOM HOTEL BINTANG 5 · Rp45 JUTA',
        botTag: 'KELAS DESA ATAP BOCOR · Rp1,2 JUTA',
        topDraw: (g2, box) => {
          drawSofa(g2, box.x + 540, box.floorY, 230, true);
          GH.figure(g2, { x: box.x + 320, y: box.floorY, s: 0.74, role: 'gold', garment: 'suit', pose: POSES.cheer, reflect: false });
        },
        botDraw: (g2, box) => {
          GH.figure(g2, { x: box.x + 320, y: box.floorY, s: 0.76, role: 'hero', pose: POSES.point, label: 'GURU', labelDy: -245, reflect: false });
          GH.figure(g2, { x: box.x + 580, y: box.floorY, s: 0.66, role: 'slate', pose: POSES.sit, label: 'MURID', labelDy: -235, reflect: false });
        },
      });
      return;
    }
    if (layout === 'v12_b10_stamped_teacher') {
      rr(g, 240, 620, 600, 260, 12); g.fillStyle = '#18221e'; g.fill(); g.strokeStyle = GH.PALETTE.gold; g.lineWidth = 5; g.stroke();
      GH.angledStamp(g, 'GURU SEJAHTERA', 540, 750, { w: 295, h: 68, angle: -0.07, gold: true });
      GH.figure(g, { x: 320, y: floorY, s: 0.98, role: 'hero', pose: POSES.cheer, label: 'GURU DESA · Rp15 JUTA', labelDy: -255 });
      GH.crowdQueue(g, { startX: 540, floorY, count: 7, s: 0.56, confetti: true });
      return;
    }
  }

  // --- V13: Kios Pasar Hari 1 -> 30 (Layout C Time-Lapse Counter + Crowd Queue + Receipt) ---
  if (layout.startsWith('v13_')) {
    if (layout === 'v13_b1_day1_crowded' || layout === 'v13_b3_day14_drop' || layout === 'v13_b4_day21_zero' || layout === 'v13_b9_day30_boom') {
      const map = {
        v13_b1_day1_crowded: { num: '45', lbl: 'PEMBELI ANTRE', q: 9, gold: true, conf: false },
        v13_b3_day14_drop:   { num: '4',  lbl: 'PEMBELI TERSISA', q: 2, gold: false, conf: false },
        v13_b4_day21_zero:   { num: '0',  lbl: 'PEMBELI · PASAR MATI', q: 0, gold: false, conf: false },
        v13_b9_day30_boom:   { num: '82', lbl: 'PEMBELI MEMBLUDAK', q: 12, gold: true, conf: true },
      }[layout];
      GH.bigCounter(g, map.num, { x: 540, y: 575, label: map.lbl, gold: map.gold });
      drawCart(g, 265, floorY, 1.08, map.gold);
      GH.angledStamp(g, 'KIOS WARGA', 265, floorY - 210, { w: 185, h: 48, angle: 0, gold: map.gold });
      GH.figure(g, { x: 265, y: floorY, s: 0.96, role: 'hero', pose: map.gold ? POSES.wave : POSES.sad, label: 'AKU & IBU', labelDy: -250 });
      if (map.q > 0) {
        GH.crowdQueue(g, { startX: 470, floorY, count: map.q, confetti: map.conf });
      }
      return;
    }
    if (layout === 'v13_b2_day7_extortion') {
      GH.receiptCard(g, { x: 310, y: 590, topLabel: 'KARCIS PUNGLI LAPAK', mainValue: 'NAIK 3X LIPAT', subLabel: 'WAJIB SETOR HARIAN', gold: false });
      GH.speechBubble(g, 'BAYAR JATAH LAPAK!', 680, 810, { tailDir: 'right', gold: false });
      drawCart(g, 280, floorY, 1.0, false);
      GH.figure(g, { x: 430, y: floorY, s: 0.94, role: 'mauve', garment: 'ibu', pose: POSES.sad, label: 'IBU PEDAGANG', labelDy: -250 });
      GH.figure(g, { x: 740, y: floorY, s: 0.96, facing: -1, role: 'gold', garment: 'suit', pose: POSES.point, label: 'OKNUM PUNGLI', labelDy: -250 });
      return;
    }
    if (layout === 'v13_b6_split_stall_vs_office') {
      GH.splitBoxes(g, {
        topY: E.H * 0.255, botY: E.H * 0.495, h: E.H * 0.21,
        activeBox: 'both',
        topTag: 'LAPAK PASAR IBU · 0 PEMBELI',
        botTag: 'MEJA OKNUM · PENUH SETORAN PUNGLI',
        topDraw: (g2, box) => {
          drawCart(g2, box.x + 340, box.floorY, 0.85, false);
          GH.figure(g2, { x: box.x + 560, y: box.floorY, s: 0.74, role: 'mauve', garment: 'ibu', pose: POSES.sad, reflect: false });
        },
        botDraw: (g2, box) => {
          drawBriefcase(g2, box.x + 560, box.floorY - 45, 0.88, true);
          GH.figure(g2, { x: box.x + 340, y: box.floorY, s: 0.74, role: 'gold', garment: 'suit', pose: POSES.cheer, reflect: false });
        },
      });
      return;
    }
    if (layout === 'v13_b10_stamp_bebas_pungli') {
      drawCart(g, 340, floorY, 1.12, true);
      GH.angledStamp(g, 'BEBAS PUNGLI 100%', 620, 740, { w: 310, h: 68, angle: -0.08, gold: true });
      GH.figure(g, { x: 340, y: floorY, s: 0.96, role: 'mauve', garment: 'ibu', pose: POSES.cheer, label: 'IBU · PASAR RAMAI', labelDy: -250 });
      GH.figure(g, { x: 640, y: floorY, s: 0.96, role: 'hero', pose: POSES.cheer, label: 'AKU', labelDy: -255 });
      return;
    }
  }

  // --- V14: Foto Peresmian (Layout F Frame-in-Frame Live Mirror + Ghost Figure) ---
  if (layout.startsWith('v14_')) {
    if (layout === 'v14_b1_mirror_hook' || layout === 'v14_b5_mirror_dashed_workers' || layout === 'v14_b8_mirror_gold_workers') {
      const isGoldHero = layout === 'v14_b8_mirror_gold_workers';
      // Wall photo frame at top
      rr(g, 240, 500, 600, 310, 12);
      g.fillStyle = '#181e28'; g.fill();
      g.strokeStyle = isGoldHero ? GH.PALETTE.goldHi : '#f5f2ea'; g.lineWidth = 6; g.stroke();
      GH.microLabel(g, isGoldHero ? 'BINGKAI SEJARAH ASLI: PARA PEMBANGUN JEMBATAN' : 'FOTO RESMI: PEKERJA DISURUH MINGGIR DARI BINGKAI', 540, 470, {
        color: isGoldHero ? GH.PALETTE.goldHi : '#cbd5e1',
      });
      // Inside frame:
      if (!isGoldHero) {
        GH.ghostFigure(g, { x: 360, y: 780, s: 0.54, mode: 'dashed', innerText: 'MINGGIR' });
        GH.figure(g, { x: 560, y: 780, s: 0.54, role: 'gold', garment: 'suit', pose: POSES.cheer, reflect: false });
        GH.figure(g, { x: 690, y: 780, s: 0.54, role: 'gold', garment: 'suit', pose: POSES.wave, reflect: false });
      } else {
        GH.ghostFigure(g, { x: 420, y: 780, s: 0.56, mode: 'goldGlow' });
        GH.ghostFigure(g, { x: 560, y: 780, s: 0.56, mode: 'goldGlow' });
        GH.ghostFigure(g, { x: 710, y: 780, s: 0.52, mode: 'dashed', innerText: 'CUMA 5 MNT' });
      }
      // Stage below: camera tripod + figures
      drawCameraTripod(g, 190, floorY, isGoldHero);
      GH.figure(g, { x: 430, y: floorY, s: 0.96, role: 'slate', garment: 'kopiah', pose: isGoldHero ? POSES.cheer : POSES.sad, label: 'AYAH · TUKANG', labelDy: -250 });
      GH.figure(g, { x: 610, y: floorY, s: 0.98, role: 'hero', pose: isGoldHero ? POSES.cheer : POSES.sad, label: 'AKU · PEKERJA', labelDy: -255 });
      if (!isGoldHero) {
        GH.figure(g, { x: 820, y: floorY, s: 0.94, facing: -1, role: 'gold', garment: 'suit', pose: POSES.point, label: 'PEJABAT · GUNTING PITA', labelDy: -250 });
      } else {
        GH.ghostFigure(g, { x: 820, y: floorY, s: 0.94, mode: 'dashed', innerText: 'DICORET' });
      }
      return;
    }
    if (layout === 'v14_b2_month1_foundation' || layout === 'v14_b3_month6_rain_work') {
      drawBridge(g, 120, 720, 840, 210, false, false);
      GH.microLabel(g, '6 BULAN COR BESI & BETON TANPA SOROT KAMERA', 540, 620, { color: GH.PALETTE.goldHi, bg: true });
      GH.figure(g, { x: 340, y: floorY, s: 0.96, role: 'slate', garment: 'kopiah', pose: walkPose(t, 1.1), label: 'AYAH · KERJA TERIK', labelDy: -250 });
      GH.figure(g, { x: 680, y: floorY, s: 0.98, role: 'hero', facing: -1, pose: walkPose(t + 0.5, 1.1), label: 'AKU · ANGKAT BESI', labelDy: -255 });
      return;
    }
    if (layout === 'v14_b4_ribbon_day_shoved') {
      seg(g, [[280, 960], [820, 960]], 10, GH.PALETTE.goldHi);
      GH.speechBubble(g, 'TUKANG MINGGIR DULU!', 660, 780, { tailDir: 'right', gold: false });
      GH.figure(g, { x: 260, y: floorY, s: 0.92, role: 'hero', pose: POSES.sad, label: 'AKU · DISURUH MUNDUR', labelDy: -250 });
      GH.figure(g, { x: 640, y: floorY, s: 0.96, role: 'gold', garment: 'suit', pose: POSES.cheer, label: 'PEJABAT · POTONG PITA', labelDy: -250 });
      return;
    }
    if (layout === 'v14_b6_split_sweat_vs_ribbon') {
      GH.splitBoxes(g, {
        topY: E.H * 0.255, botY: E.H * 0.495, h: E.H * 0.21,
        activeBox: 'both',
        topTag: 'PEKERJA · 180 HARI MANDI KERINGAT',
        botTag: 'OKNUM · 5 MENIT DATANG GUNTING PITA',
        topDraw: (g2, box) => {
          drawBridge(g2, box.x + 40, box.y + 55, box.w - 80, box.h - 65, false, false);
          GH.figure(g2, { x: box.x + 420, y: box.floorY, s: 0.72, role: 'hero', pose: walkPose(t, 1.2), reflect: false });
        },
        botDraw: (g2, box) => {
          seg(g2, [[box.x + 220, box.floorY - 95], [box.x + 680, box.floorY - 95]], 8, GH.PALETTE.goldHi);
          GH.figure(g2, { x: box.x + 450, y: box.floorY, s: 0.74, role: 'gold', garment: 'suit', pose: POSES.cheer, reflect: false });
        },
      });
      return;
    }
    if (layout === 'v14_b9_plaque_stamped' || layout === 'v14_b10_crowd_salute') {
      drawBridge(g, 110, 700, 860, 210, true, false);
      GH.angledStamp(g, 'KARYA PEKERJA & WARGA', 540, 620, { w: 340, h: 66, angle: -0.05, gold: true });
      GH.figure(g, { x: 310, y: floorY, s: 0.98, role: 'slate', garment: 'kopiah', pose: POSES.cheer, label: 'AYAH', labelDy: -250 });
      GH.figure(g, { x: 490, y: floorY, s: 1.00, role: 'hero', pose: POSES.cheer, label: 'AKU', labelDy: -255 });
      GH.crowdQueue(g, { startX: 640, floorY, count: 8, confetti: true });
      return;
    }
  }

  // --- V15: Motor Tua Lunas vs Mobil Sitaan (Layout E Multi-Scene + Angled Stamp + Speech Bubble) ---
  if (layout.startsWith('v15_')) {
    if (layout === 'v15_b1_parking_1700' || layout === 'v15_b2_parking_taunt') {
      GH.speechBubble(g, 'MASIH NAIK MOTOR TUA?', 680, 790, { tailDir: 'right', gold: false });
      drawScooter(g, 270, floorY, 1.0, 0);
      GH.microLabel(g, 'MOTOR 12 TAHUN · CICILAN Rp0', 270, floorY - 165, { color: GH.PALETTE.hero, bg: true });
      drawLuxuryCar(g, 740, floorY, 0.92, true);
      GH.microLabel(g, 'MOBIL KOMISI GELAP · Rp4,8 M', 740, floorY - 165, { color: GH.PALETTE.goldHi, bg: true });
      GH.figure(g, { x: 380, y: floorY, s: 0.96, role: 'hero', pose: breathe(POSES.stand, t), label: 'AKU', labelDy: -255 });
      GH.figure(g, { x: 610, y: floorY, s: 0.94, facing: -1, role: 'gold', garment: 'suit', pose: POSES.point, label: 'OKNUM', labelDy: -250 });
      return;
    }
    if (layout === 'v15_b3_road_rain_peace') {
      GH.speechBubble(g, 'TIDUR TENANG · UTANG Rp0', 420, 780, { tailDir: 'left', gold: true });
      drawScooter(g, 360 + u * 220, floorY, 1.05, 0);
      GH.figure(g, { x: 250 + u * 220, y: floorY, s: 0.96, role: 'hero', pose: POSES.wave, label: 'PULANG TENANG', labelDy: -255 });
      return;
    }
    if (layout === 'v15_b4_road_siren_stop' || layout === 'v15_b5_receipt_seized') {
      GH.chatToast(g, { x: 310, y: 600, sender: 'TIM AUDIT NEGARA', message: 'Mobil mewah resmi disita hari ini.', tag: 'SITA', timeStr: '19.30', gold: true });
      GH.receiptCard(g, { x: 750, y: 600, topLabel: 'ASET KORUPSI DISITA', mainValue: 'Rp4,8 MILIAR', subLabel: 'DILELANG UNTUK WARGA', gold: true });
      drawLuxuryCar(g, 620, floorY, 0.95, false);
      GH.angledStamp(g, 'DISITA WARGA', 620, floorY - 90, { w: 240, h: 58, angle: -0.1, gold: true });
      GH.figure(g, { x: 320, y: floorY, s: 0.94, role: 'slate', garment: 'suit', pose: POSES.sad, label: 'OKNUM · JALAN KAKI', labelDy: -250 });
      return;
    }
    if (layout === 'v15_b6_split_sleep_vs_panic') {
      GH.splitBoxes(g, {
        topY: E.H * 0.255, botY: E.H * 0.495, h: E.H * 0.21,
        activeBox: 'both',
        topTag: 'RUMAH WARGA · TIDUR NYENYAK BEBAS UTANG',
        botTag: 'RUMAH OKNUM · GEMETAR TAKUT KETUKAN PINTU',
        topDraw: (g2, box) => {
          drawScooter(g2, box.x + 280, box.floorY, 0.82, 0);
          GH.figure(g2, { x: box.x + 560, y: box.floorY, s: 0.74, role: 'hero', pose: POSES.cheer, reflect: false });
        },
        botDraw: (g2, box) => {
          GH.speechBubble(g2, 'TOK! TOK! TIM AUDIT!', box.x + 320, box.y + 120, { tailDir: 'left', gold: true });
          GH.figure(g2, { x: box.x + 580, y: box.floorY, s: 0.74, role: 'slate', garment: 'suit', pose: POSES.sad, reflect: false });
        },
      });
      return;
    }
    if (layout === 'v15_b9_house_lunas_stamp' || layout === 'v15_b10_oknum_walking') {
      drawHouseWithStamp(g, 720, floorY, 'HALAL & LUNAS', true);
      drawScooter(g, 350, floorY, 0.98, 0);
      GH.figure(g, { x: 220, y: floorY, s: 0.98, role: 'hero', pose: POSES.cheer, label: 'AKU · MOTOR LUNAS', labelDy: -255 });
      if (layout === 'v15_b10_oknum_walking') {
        GH.figure(g, { x: 490, y: floorY, s: 0.90, role: 'slate', garment: 'suit', facing: -1, pose: walkPose(t, 0.8), label: 'OKNUM · PULANG JALAN KAKI', labelDy: -245 });
      }
      return;
    }
  }

  // --- V16: Sawah Jam Dua Pagi vs Kamar Hotel (Layout A Active Dimming + Blueprint + Receipt) ---
  if (layout.startsWith('v16_')) {
    if (layout.includes('split_')) {
      const rev = layout.includes('reversed');
      const act = layout.includes('dim_top') ? 'top' : layout.includes('dim_bot') ? 'bottom' : 'both';
      GH.splitBoxes(g, {
        topY: E.H * 0.255, botY: E.H * 0.495, h: E.H * 0.21,
        activeBox: act,
        topTag: rev ? 'SAWAH AYAH · PUPUK EMAS & PANEN RAYA' : 'HOTEL BINTANG 5 · 21.00 (RAPAT TANI Rp3 M)',
        botTag: rev ? 'KAMAR HOTEL OKNUM · ANGGARAN DIBATALKAN' : 'SAWAH DESA · 02.00 PAGI (PUPUK LANGKA)',
        topDraw: (g2, box) => {
          if (!rev) {
            drawSofa(g2, box.x + 560, box.floorY, 220, true);
            GH.figure(g2, { x: box.x + 330, y: box.floorY, s: 0.74, role: 'gold', garment: 'suit', pose: POSES.cheer, reflect: false });
          } else {
            drawCart(g2, box.x + 560, box.floorY, 0.90, true);
            GH.figure(g2, { x: box.x + 330, y: box.floorY, s: 0.76, role: 'slate', garment: 'kopiah', pose: POSES.cheer, label: 'AYAH PETANI', labelDy: -245, reflect: false });
          }
        },
        botDraw: (g2, box) => {
          if (!rev) {
            GH.microLabel(g2, 'KARUNG PUPUK KOSONG · MENUNGGU SUBUH', box.x + 580, box.y + 95, { color: '#f87171', bg: true });
            GH.figure(g2, { x: box.x + 330, y: box.floorY, s: 0.76, role: 'slate', garment: 'kopiah', pose: POSES.sad, label: 'AYAH · 02.00', labelDy: -245, reflect: false });
          } else {
            GH.figure(g2, { x: box.cx, y: box.floorY, s: 0.74, role: 'slate', garment: 'suit', pose: POSES.sad, label: 'OKNUM · TURUN KE SAWAH', labelDy: -245, reflect: false });
          }
        },
      });
      return;
    }
    if (layout === 'v16_b3_fertilizer_queue') {
      GH.bigCounter(g, '0', { x: 320, y: 580, label: 'STOK PUPUK SUBSIDI', gold: false });
      GH.blueprintBoard(g, { x: 740, floorY, topLabel: 'RAPAT HOTEL', title: 'STUDI BANDING', crumpledCount: 5, gold: true });
      GH.crowdQueue(g, { startX: 220, floorY, count: 8, confetti: false });
      return;
    }
    if (layout === 'v16_b4_hotel_bill') {
      GH.receiptCard(g, { x: 540, y: 610, w: 280, topLabel: 'TAGIHAN HOTEL RAPAT TANI', mainValue: 'Rp850 JUTA', subLabel: '0 KARUNG SAMPAI KE SAWAH', gold: true });
      GH.figure(g, { x: 310, y: floorY, s: 0.94, role: 'slate', garment: 'kopiah', pose: POSES.sad, label: 'AYAH PETANI', labelDy: -250 });
      GH.figure(g, { x: 770, y: floorY, s: 0.94, facing: -1, role: 'gold', garment: 'suit', pose: POSES.cheer, label: 'OKNUM RAPAT', labelDy: -250 });
      return;
    }
    if (layout === 'v16_b10_stamped_harvest') {
      drawCart(g, 540, floorY, 1.15, true);
      GH.angledStamp(g, 'PUPUK LANGSUNG KE TANI', 540, 700, { w: 340, h: 68, angle: -0.06, gold: true });
      GH.figure(g, { x: 280, y: floorY, s: 0.96, role: 'slate', garment: 'kopiah', pose: POSES.cheer, label: 'AYAH', labelDy: -250 });
      GH.figure(g, { x: 800, y: floorY, s: 0.96, role: 'hero', facing: -1, pose: POSES.cheer, label: 'AKU', labelDy: -255 });
      return;
    }
  }

  // --- V17: Dompet Warga vs Kas Daerah Akhir Tahun (Layout B Open-Split + Wallet + Blueprint) ---
  if (layout.startsWith('v17_')) {
    if (layout.includes('opensplit')) {
      const isGold = layout.includes('gold');
      GH.openSplitStage(g, {
        topFloorY: 830, dividerY: 860, botFloorY: 1360,
        active: 'both',
        topTag: isGold ? 'DOMPET WARGA · TERISI CASHBACK SISA ANGGARAN' : 'DOMPET WARGA · TANGGAL 1 MASUK Rp4,2 JUTA',
        botTag: isGold ? 'ANGGARAN RAPAT FIKTIF DESEMBER · DIKUNCI Rp0' : 'KAS DAERAH DESEMBER · DIKURAS RAPAT KEJAR TAYANG',
        topDraw: (g2, z) => {
          drawWallet(g2, 340, z.floorY - 40, 1.15, true, isGold);
          GH.microLabel(g2, isGold ? 'CASHBACK PAJAK WARGA 100%' : 'TANGGAL 2 SISA Rp400 RIBU', 340, z.floorY - 185, { color: isGold ? GH.PALETTE.goldHi : GH.PALETTE.hero, bg: true });
          GH.figure(g2, { x: 690, y: z.floorY, s: 0.90, role: 'hero', pose: isGold ? POSES.cheer : POSES.think, reflect: false });
        },
        botDraw: (g2, z) => {
          drawWallet(g2, 340, z.floorY - 40, 1.15, !isGold, !isGold);
          GH.microLabel(g2, isGold ? 'DIKUNCI DARI PEMBOROSAN' : 'DIKURAS Rp5 MILIAR DALAM 7 HARI', 340, z.floorY - 185, { color: isGold ? '#94a3b8' : GH.PALETTE.goldHi, bg: true });
          GH.figure(g2, { x: 690, y: z.floorY, s: 0.92, role: isGold ? 'slate' : 'gold', garment: 'suit', pose: isGold ? POSES.sad : POSES.cheer, reflect: true });
        },
      });
      return;
    }
    if (layout === 'v17_b2_citizen_expense_stack') {
      GH.expenseStack(g, { x: 110, y: 600, topLabel: 'GAJI BULANAN WARGA', mainValue: 'Rp4,2 JUTA', items: ['PAJAK & RETRIBUSI', 'LISTRIK & DAPUR', 'SEKOLAH ANAK'] });
      drawWallet(g, 680, floorY - 60, 1.2, false, false);
      GH.figure(g, { x: 820, y: floorY, s: 0.96, facing: -1, role: 'hero', pose: POSES.sad, label: 'AKU', labelDy: -255 });
      return;
    }
    if (layout === 'v17_b3_december_rush_board' || layout === 'v17_b5_receipt_fiktif') {
      GH.blueprintBoard(g, { x: 350, floorY, topLabel: 'BULAN DESEMBER', title: 'HABISKAN Rp5 M', crumpledCount: 6, gold: true });
      GH.receiptCard(g, { x: 750, y: 610, topLabel: 'KEJAR TAYANG AKHIR TAHUN', mainValue: 'Rp5,0 MILIAR', subLabel: 'SEMINAR HOTEL & SERAGAM', gold: true });
      GH.figure(g, { x: 750, y: floorY, s: 0.94, facing: -1, role: 'gold', garment: 'suit', pose: POSES.cheer, label: 'OKNUM ANGGARAN', labelDy: -250 });
      return;
    }
    if (layout === 'v17_b10_padlock_budget') {
      drawWallet(g, 540, 770, 1.35, true, true);
      GH.angledStamp(g, 'KEMBALI KE KAS DESA', 540, 620, { w: 320, h: 66, angle: -0.06, gold: true });
      GH.figure(g, { x: 300, y: floorY, s: 0.94, role: 'mauve', garment: 'ibu', pose: POSES.cheer, label: 'IBU', labelDy: -250 });
      GH.figure(g, { x: 780, y: floorY, s: 0.96, role: 'hero', facing: -1, pose: POSES.cheer, label: 'AKU', labelDy: -255 });
      return;
    }
  }

  // --- V18: Loket Obat vs Gudang Tertutup (Layout C Counter + Queue + Scoreboard + ChatToast) ---
  if (layout.startsWith('v18_')) {
    if (layout === 'v18_b1_queue_zero_stock' || layout === 'v18_b9_counter_100_percent') {
      const full = layout === 'v18_b9_counter_100_percent';
      GH.bigCounter(g, full ? '100%' : '0', { x: 320, y: 575, label: 'STOK OBAT LOKET', gold: full });
      GH.bigCounter(g, '64', { x: 760, y: 575, label: full ? 'WARGA TERLAYANI' : 'LANSIA ANTRE', gold: true });
      GH.figure(g, { x: 250, y: floorY, s: 0.96, role: 'mauve', garment: 'ibu', pose: full ? POSES.cheer : POSES.sad, label: 'IBU', labelDy: -250 });
      GH.crowdQueue(g, { startX: 460, floorY, count: 10, confetti: full });
      return;
    }
    if (layout === 'v18_b2_ibu_empty_prescription') {
      GH.speechBubble(g, 'OBAT HABIS! BELI DI LUAR!', 650, 790, { tailDir: 'right', gold: false });
      GH.receiptCard(g, { x: 290, y: 600, topLabel: 'RESEP PUSKESMAS', mainValue: 'STOK: 0', subLabel: 'DISURUH TEBUS MAHAL', gold: false });
      GH.figure(g, { x: 390, y: floorY, s: 0.94, role: 'mauve', garment: 'ibu', pose: POSES.sad, label: 'IBU LANSIA', labelDy: -250 });
      GH.figure(g, { x: 730, y: floorY, s: 0.94, facing: -1, role: 'slate', garment: 'suit', pose: POSES.point, label: 'LOKET', labelDy: -250 });
      return;
    }
    if (layout === 'v18_b3_warehouse_gold_pile' || layout === 'v18_b4_chat_vendor_fee') {
      GH.chatToast(g, { x: 340, y: 590, sender: 'OKNUM PENGADAAN', message: 'Tahan obat di gudang sampai fee cair.', tag: 'KOMISI', timeStr: '09.15', gold: true });
      // Golden medicine boxes stacked in locked warehouse
      for (let i = 0; i < 6; i++) {
        const bx = 560 + (i % 3) * 105;
        const by = floorY - 82 - Math.floor(i / 3) * 84;
        rr(g, bx, by, 96, 76, 8); g.fillStyle = GH.PALETTE.gold; g.fill(); g.strokeStyle = GH.PALETTE.outline; g.lineWidth = 4; g.stroke();
      }
      GH.microLabel(g, 'GUDANG BELAKANG · OBAT MENUMPUK DITAHAN FEE', 720, floorY - 270, { color: GH.PALETTE.goldHi, bg: true });
      GH.figure(g, { x: 310, y: floorY, s: 0.94, role: 'gold', garment: 'suit', pose: POSES.cheer, label: 'OKNUM VENDOR', labelDy: -250 });
      return;
    }
    if (layout === 'v18_b5_scoreboard_irony') {
      GH.scoreboard(g, 0, 100, { y: 590, leftLabel: 'DI LOKET WARGA (%)', rightLabel: 'DI GUDANG OKNUM (%)', sub: 'TERTAHAN TANDA TANGAN KOMISI' });
      GH.figure(g, { x: 320, y: floorY, s: 0.94, role: 'mauve', garment: 'ibu', pose: POSES.sad, label: 'WARGA SAKIT', labelDy: -250 });
      GH.figure(g, { x: 760, y: floorY, s: 0.94, facing: -1, role: 'gold', garment: 'suit', pose: POSES.stand, label: 'OKNUM', labelDy: -250 });
      return;
    }
    if (layout === 'v18_b6_split_clinic_vs_warehouse' || layout === 'v18_b10_stamped_clinic') {
      GH.angledStamp(g, 'OBAT GRATIS 100%', 540, 710, { w: 310, h: 68, angle: -0.07, gold: true });
      GH.figure(g, { x: 310, y: floorY, s: 0.94, role: 'mauve', garment: 'ibu', pose: POSES.cheer, label: 'IBU SEHAT', labelDy: -250 });
      GH.figure(g, { x: 540, y: floorY, s: 0.96, role: 'hero', pose: POSES.cheer, label: 'AKU', labelDy: -255 });
      GH.figure(g, { x: 770, y: floorY, s: 0.94, role: 'slate', garment: 'kopiah', facing: -1, pose: POSES.cheer, label: 'AYAH', labelDy: -250 });
      return;
    }
  }

  // --- V19: Layar 5 Jam vs 1 Menit Laporan Warga (Layout B + D + F Mirror + GoldTimerPill) ---
  if (layout.startsWith('v19_')) {
    if (layout === 'v19_b1_opensplit_screen_hook') {
      GH.openSplitStage(g, {
        topFloorY: 830, dividerY: 860, botFloorY: 1360,
        active: 'both',
        topTag: 'MEJA PEJABAT · 5 JAM SCROLL LAYAR PRIBADI',
        botTag: 'LAPORAN JALAN RUSAK · CUMA DILIRIK 0:01 DETIK',
        topDraw: (g2, z) => {
          GH.goldTimerPill(g2, '5 JAM', { x: 320, y: 560, clockIcon: true, sub: 'SCROLL HIBURAN DI KANTOR' });
          drawSofa(g2, 700, z.floorY, 210, true);
          GH.figure(g2, { x: 690, y: z.floorY, s: 0.90, role: 'gold', garment: 'suit', pose: POSES.sit, reflect: false });
        },
        botDraw: (g2, z) => {
          GH.goldTimerPill(g2, '0:01', { x: 320, y: 1060, clockIcon: true, sub: 'KELUHAN WARGA DIABAIKAN' });
          GH.figure(g2, { x: 690, y: z.floorY, s: 0.94, role: 'hero', pose: POSES.sad, reflect: true });
        },
      });
      return;
    }
    if (layout === 'v19_b2_citizen_send_photo' || layout === 'v19_b3_bot_auto_reply') {
      GH.chatToast(g, { x: 360, y: 600, sender: 'BOT PENGADUAN', message: 'Laporan diterima. Mohon tunggu antrean.', tag: 'BOT', timeStr: '08.01', gold: false });
      poly(g, [[480, floorY], [760, floorY], [720, floorY + 46], [520, floorY + 46]], '#05070b');
      GH.figure(g, { x: 320, y: floorY, s: 0.96, role: 'hero', pose: POSES.point, label: 'AKU · LAPOR JALAN RUSAK', labelDy: -255 });
      return;
    }
    if (layout === 'v19_b4_official_5hours_chill' || layout === 'v19_b5_mirror_ignored_report') {
      rr(g, 250, 500, 580, 300, 12); g.fillStyle = '#181e28'; g.fill(); g.strokeStyle = '#475569'; g.lineWidth = 5; g.stroke();
      GH.ghostFigure(g, { x: 430, y: 765, s: 0.54, mode: 'dashed', innerText: 'DIABAIKAN' });
      GH.bigCounter(g, '340', { x: 680, y: 650, label: 'LAPORAN NUMPUK', gold: false });
      drawSofa(g, 540, floorY, 240, true);
      GH.figure(g, { x: 540, y: floorY, s: 0.94, role: 'gold', garment: 'suit', pose: POSES.sit, label: 'SIBUK SCROLL HP 5 JAM', labelDy: -245 });
      return;
    }
    if (layout === 'v19_b8_screen_hijack_live' || layout === 'v19_b9_official_rushing_fix' || layout === 'v19_b10_stamped_resolved') {
      rr(g, 240, 500, 600, 300, 12); g.fillStyle = '#181e28'; g.fill(); g.strokeStyle = GH.PALETTE.goldHi; g.lineWidth = 6; g.stroke();
      GH.angledStamp(g, 'WAJIB TUNTAS 24 JAM', 540, 650, { w: 330, h: 68, angle: -0.06, gold: true });
      GH.figure(g, { x: 320, y: floorY, s: 0.96, role: 'hero', pose: POSES.cheer, label: 'AKU · JALAN MULUS', labelDy: -255 });
      GH.figure(g, { x: 740, y: floorY, s: 0.94, facing: -1, role: 'slate', garment: 'suit', pose: walkPose(t, 1.4), label: 'PEJABAT · TURUN KERJA', labelDy: -250 });
      return;
    }
  }

  // --- V20: Atap Sendiri: Kontrakan 3x4 vs Rumah Dinas Kosong (Layout A Active Dimming + Ghost + Stamp) ---
  if (layout.startsWith('v20_')) {
    if (layout.includes('split_')) {
      const rev = layout.includes('own_home');
      const act = layout.includes('focus_top') ? 'top' : layout.includes('focus_bot') ? 'bottom' : 'both';
      GH.splitBoxes(g, {
        topY: E.H * 0.255, botY: E.H * 0.495, h: E.H * 0.21,
        activeBox: act,
        topTag: rev ? 'RUMAH DINAS -> DIALIHKAN JADI KLINIK & ASRAMA WARGA' : 'RUMAH DINAS PEJABAT · Rp8 MILIAR (0 PENGHUNI)',
        botTag: rev ? 'RUMAH BARU KELUARGA AKU · ATAP SENDIRI LUNAS' : 'KONTRAKAN PETAK 3x4 · Rp800 RIBU/BULAN',
        topDraw: (g2, box) => {
          if (!rev) {
            drawSofa(g2, box.x + 340, box.floorY, 220, true);
            GH.ghostFigure(g2, { x: box.x + 640, y: box.floorY, s: 0.72, mode: 'dashed', innerText: 'KOSONG' });
          } else {
            GH.figure(g2, { x: box.x + 340, y: box.floorY, s: 0.74, role: 'mauve', garment: 'ibu', pose: POSES.cheer, reflect: false });
            GH.figure(g2, { x: box.x + 580, y: box.floorY, s: 0.74, role: 'slate', garment: 'kopiah', pose: POSES.cheer, reflect: false });
          }
        },
        botDraw: (g2, box) => {
          glow(g2, box.cx, box.y + 90, 150, GH.PALETTE.gold, 0.42);
          circle(g2, box.cx, box.y + 90, 14, GH.PALETTE.goldHi);
          GH.figure(g2, { x: box.x + 360, y: box.floorY, s: 0.76, role: 'hero', pose: rev ? POSES.cheer : POSES.sit, label: 'AKU', labelDy: -245, reflect: false });
          GH.figure(g2, { x: box.x + 560, y: box.floorY, s: 0.74, role: 'mauve', garment: 'ibu', pose: rev ? POSES.cheer : POSES.stand, label: 'ISTRI', labelDy: -245, reflect: false });
        },
      });
      return;
    }
    if (layout === 'v20_b4_expense_rent_burden') {
      GH.expenseStack(g, { x: 110, y: 590, topLabel: 'GAJI PEKERJA', mainValue: 'Rp3,2 JUTA', items: ['SEWA PETAK 3x4: 800 RB', 'TABUNGAN RUMAH: HABIS', 'DAPUR & ANAK'] });
      GH.receiptCard(g, { x: 750, y: 620, topLabel: 'RAWAT RUMAH DINAS KOSONG', mainValue: 'Rp480 JUTA', subLabel: 'DIBAYAR PAJAK WARGA', gold: true });
      GH.figure(g, { x: 640, y: floorY, s: 0.96, role: 'hero', pose: POSES.sad, label: 'AKU', labelDy: -255 });
      return;
    }
    if (layout === 'v20_b5_blueprint_rejected') {
      GH.blueprintBoard(g, { x: 380, floorY, topLabel: 'RUMAH SUBSIDI WARGA', title: 'DITUNDA LAGI', crumpledCount: 8, gold: false });
      GH.figure(g, { x: 720, y: floorY, s: 0.96, facing: -1, role: 'hero', pose: POSES.think, label: 'KAPAN PUNYA ATAP SENDIRI?', labelDy: -255 });
      return;
    }
    if (layout === 'v20_b10_house_stamped_lunas') {
      drawHouseWithStamp(g, 700, floorY, 'ATAP MILIK SENDIRI', true);
      GH.figure(g, { x: 250, y: floorY, s: 0.98, role: 'hero', pose: POSES.cheer, label: 'AKU', labelDy: -255 });
      GH.figure(g, { x: 410, y: floorY, s: 0.94, role: 'mauve', garment: 'ibu', pose: POSES.cheer, label: 'KELUARGA BAHAGIA', labelDy: -250 });
      return;
    }
  }

  // Fallback for remaining intermediate siphon/gauge beats across V11..V20:
  const drain = ease.inOut(prog(u, 0.05, 0.85));
  const cLv = lerp(0.82, 0.10, drain);
  const oLv = lerp(0.18, 0.96, drain);
  const xs = [180, 410, 640, 890];
  const gLabels = ['USAHA WARGA', 'PAJAK KITA', 'HAK DESA', 'KOMISI OKNUM'];
  xs.forEach((gx, i) => {
    const isOknum = i === 3;
    GH.fuelGauge(g, { x: gx, y: 690, r: 62, level: isOknum ? oLv : cLv, activeGold: isOknum, label: gLabels[i] });
  });
  GH.flowPipe(g, [[180, 610], [180, 560], [890, 560], [890, 610]], t, { gold: true, dir: 1, speed: 1.5, drops: 8 });
  GH.figure(g, { x: 240, y: floorY, s: 0.92, role: 'slate', garment: 'kopiah', pose: POSES.sad, label: 'AYAH', labelDy: -250 });
  GH.figure(g, { x: 520, y: floorY, s: 0.94, role: 'hero', pose: POSES.think, label: 'AKU', labelDy: -250 });
  GH.figure(g, { x: 860, y: floorY, s: 0.92, role: 'gold', garment: 'suit', facing: -1, pose: POSES.cheer, label: 'OKNUM', labelDy: -250 });
}
