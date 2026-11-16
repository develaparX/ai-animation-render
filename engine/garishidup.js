// engine/garishidup.js — GarisHidup (@garishidup.idn) visual grammar & 3D-shaded capsule figure kit for GrowKaz Studio.
// Provides:
//   - 3D-shaded capsule figures (thick dark outline + cream/slate/mauve body + soft 3D inner highlight + floor reflection)
//   - Top pill badge ("2019", "WISUDA", "TAHUN KE-3") + sub-counter ("SEMESTER 5")
//   - Multi-line headline with *gold keyword* highlights ("Toga ini *bukan* punyaku *sendiri.*")
//   - Floating tracked micro-labels ("DIJUAL", "AYAH", "IBU", "AKU", "PAJAK WARGA")
//   - Split-Box Diorama (Top vs Bottom simultaneous rooms)
//   - Visual Metaphor widgets: E->F Fuel Gauge with gold pipe, Progress Bar, Scooter/Sewing/Desk props.

import { E, V, clamp, lerp, prog, ease, alpha, shade, mix, seg, circle, ring, rr, poly, text, measure, glow, linGrad, radGrad, FONTS } from './core.js';
import { POSES, face } from './rig2d.js';

const SANS = 'Segoe UI';

export const PALETTE = {
  bgCenter: '#1f2633',
  bgMid: '#141922',
  bgEdge: '#0b0e14',
  floorTop: '#181e29',
  floorBot: '#090c11',
  outline: '#090c10',
  hero: '#f5f2ea',
  heroHi: '#ffffff',
  heroShade: '#cfc9bc',
  slate: '#768396',
  slateHi: '#95a3b8',
  slateShade: '#556070',
  mauve: '#8f6b72',
  mauveHi: '#ad878e',
  mauveShade: '#684c52',
  navy: '#4e5d78',
  navyHi: '#6b7c9c',
  gold: '#f5a623',
  goldHi: '#ffd166',
  goldDark: '#c47d0e',
  goldGlow: 'rgba(245, 166, 35, 0.55)',
  boxBg: '#181e28',
  boxWall: '#202734',
  boxFloor: '#141820',
  boxBorder: '#2e3748',
  pillBg: 'rgba(255, 255, 255, 0.11)',
  pillBorder: 'rgba(255, 255, 255, 0.16)',
  labelText: '#d0d7e2',
};

// 1. Matte Charcoal Vignette Stage + Glossy Floor Reflection Zone
export function stage(g, o = {}) {
  const {
    floorY = E.H * 0.66,
    watermark = '',
    arches = false,
    bunting = false,
    spotlight = true,
  } = o;

  // Radial vignette background
  g.fillStyle = PALETTE.bgEdge;
  g.fillRect(0, 0, E.W, E.H);
  const bgGrad = radGrad(g, E.W * 0.5, floorY * 0.72, 0, E.W * 0.85, [PALETTE.bgCenter, PALETTE.bgEdge]);
  g.fillStyle = bgGrad;
  g.fillRect(0, 0, E.W, E.H);

  if (spotlight) {
    glow(g, E.W * 0.5, floorY * 0.68, E.W * 0.52, '#38465e', 0.22);
  }

  // Optional hall arches (like WISUDA hall in DfPQgm3EY3u)
  if (arches) {
    const archW = E.W * 0.15, archH = E.H * 0.22;
    const positions = [E.W * 0.22, E.W * 0.5, E.W * 0.78];
    for (const ax of positions) {
      const x0 = ax - archW / 2, y0 = floorY - archH;
      g.save();
      g.fillStyle = 'rgba(10, 14, 20, 0.55)';
      g.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      g.lineWidth = 2.5;
      g.beginPath();
      g.arc(ax, y0 + archW / 2, archW / 2, Math.PI, 0);
      g.lineTo(x0 + archW, floorY);
      g.lineTo(x0, floorY);
      g.closePath();
      g.fill();
      g.stroke();
      // Window pane crossbars
      seg(g, [[ax, y0], [ax, floorY]], 2, 'rgba(255,255,255,0.06)');
      seg(g, [[x0, floorY - archH * 0.45], [x0 + archW, floorY - archH * 0.45]], 2, 'rgba(255,255,255,0.06)');
      g.restore();
    }
  }

  // Optional bunting flags
  if (bunting) {
    const yTop = E.H * 0.235;
    const cols = ['#c96567', '#5a8296', '#d9a441', '#6b8e78', '#8c6d73'];
    g.strokeStyle = 'rgba(255,255,255,0.22)';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(E.W * 0.04, yTop - 16);
    g.quadraticCurveTo(E.W * 0.5, yTop + 26, E.W * 0.96, yTop - 16);
    g.stroke();
    const nFlags = 15;
    for (let i = 0; i < nFlags; i++) {
      const u = (i + 0.5) / nFlags;
      const fx = lerp(E.W * 0.05, E.W * 0.95, u);
      const fy = yTop - 16 + 42 * 4 * u * (1 - u) * 0.65;
      poly(g, [[fx - 15, fy], [fx + 15, fy], [fx, fy + 28]], alpha(cols[i % cols.length], 0.72));
    }
  }

  // Glossy floor gradient
  g.fillStyle = linGrad(g, 0, floorY, 0, E.H, [PALETTE.floorTop, PALETTE.floorBot]);
  g.fillRect(0, floorY, E.W, E.H - floorY);
  seg(g, [[0, floorY], [E.W, floorY]], 2, 'rgba(255,255,255,0.08)');

  // Subtle floor glow & watermark
  glow(g, E.W * 0.5, floorY, E.W * 0.42, '#4a5a75', 0.14);
  if (watermark) {
    text(g, watermark, E.W * 0.5, floorY + V(36, 44), {
      size: V(18, 22),
      color: 'rgba(255,255,255,0.24)',
      font: SANS,
      weight: 700,
      spacing: 4,
    });
  }
}

// 2. Top Rounded Pill Badge ("2019", "2021", "WISUDA") + Optional Sub-header ("SEMESTER 5")
export function pill(g, label, o = {}) {
  const {
    x = E.W * 0.5,
    y = E.H * 0.115,
    size = V(30, 36),
    sub = null,
    subHighlight = null,
    a = 1,
  } = o;
  g.save();
  g.globalAlpha *= a;
  const tw = measure(g, label, size, SANS, 900);
  const pw = Math.max(V(150, 176), tw + size * 1.9);
  const ph = size * 1.85;
  rr(g, x - pw / 2, y - ph / 2, pw, ph, ph / 2);
  g.fillStyle = PALETTE.pillBg;
  g.fill();
  g.strokeStyle = PALETTE.pillBorder;
  g.lineWidth = 1.5;
  g.stroke();

  text(g, label, x, y + 2, {
    size,
    color: PALETTE.hero,
    font: SANS,
    weight: 900,
    spacing: 2.5,
  });

  if (sub) {
    const sy = y + ph * 0.92;
    const subSz = size * 0.68;
    if (subHighlight) {
      const w1 = measure(g, sub + ' ', subSz, SANS, 800);
      const w2 = measure(g, String(subHighlight), subSz * 1.25, SANS, 900);
      const tot = w1 + w2;
      // Small mortarboard icon on the left
      const ix = x - tot / 2 - subSz * 0.9;
      poly(g, [[ix - 14, sy - 2], [ix, sy - 9], [ix + 14, sy - 2], [ix, sy + 5]], PALETTE.gold);
      text(g, sub, x - tot / 2 + w1 / 2, sy, {
        size: subSz,
        color: PALETTE.labelText,
        font: SANS,
        weight: 800,
        spacing: 2,
      });
      text(g, String(subHighlight), x - tot / 2 + w1 + w2 / 2 + 6, sy, {
        size: subSz * 1.25,
        color: PALETTE.hero,
        font: SANS,
        weight: 900,
      });
    } else {
      text(g, sub, x, sy, {
        size: subSz,
        color: PALETTE.labelText,
        font: SANS,
        weight: 800,
        spacing: 2.5,
      });
    }
  }
  g.restore();
}

// 3. Multi-line Headline with *gold keyword* highlights & optional word-by-word reveal
// Usage: GH.headline(g, ['Toga ini', '*bukan* punyaku *sendiri.*'], { y: E.H * 0.19, reveal: 1 })
export function headline(g, lines = [], o = {}) {
  const {
    x = E.W * 0.5,
    y = E.H * 0.185,
    size = V(38, 44),
    lineGap = 1.28,
    a = 1,
    reveal = 1, // 0..1 word-by-word progressive reveal (like DfrzFUZlWQp t=8.7s)
  } = o;
  if (reveal <= 0.01) return;
  g.save();
  g.globalAlpha *= a;

  // Count total words across lines for reveal indexing
  const parsedLines = lines.map(rawLine => {
    const tokens = [];
    const re = /\*([^*]+)\*|([^*]+)/g;
    let m;
    let prevHadTrailSpace = false;
    while ((m = re.exec(rawLine)) !== null) {
      const str = m[1] != null ? m[1] : m[2];
      const gold = m[1] != null;
      const hasLeadSpace = /^\s/.test(str);
      const hasTrailSpace = /\s$/.test(str);
      const words = str.trim().split(/\s+/).filter(Boolean);
      words.forEach((w, idx) => {
        const spaceBefore = tokens.length > 0 && (idx > 0 || prevHadTrailSpace || hasLeadSpace);
        tokens.push({ str: w, gold, spaceBefore });
      });
      if (words.length > 0) prevHadTrailSpace = hasTrailSpace;
    }
    return tokens;
  });
  const totalWords = parsedLines.reduce((acc, arr) => acc + arr.length, 0);
  const maxWords = reveal >= 0.999 ? totalWords : Math.max(1, Math.floor(clamp(reveal, 0, 1) * totalWords));
  let wordCounter = 0;

  parsedLines.forEach((parts, idx) => {
    const ly = y + idx * size * lineGap;
    const baseSpaceW = measure(g, ' ', size, SANS, 900) * 1.05;
    const widths = parts.map(p => measure(g, p.str, size, SANS, 900));
    const totalW = widths.reduce((acc, w, i) => acc + w + (parts[i].spaceBefore ? baseSpaceW : 0), 0);
    const scale = totalW > E.W * 0.88 ? (E.W * 0.88) / totalW : 1;
    const sz = size * scale;
    const spaceW = baseSpaceW * scale;
    const scaledWidths = parts.map(p => measure(g, p.str, sz, SANS, 900));
    const scaledTotal = scaledWidths.reduce((acc, w, i) => acc + w + (parts[i].spaceBefore ? spaceW : 0), 0);

    let cx = x - scaledTotal / 2;
    parts.forEach((p, i) => {
      if (p.spaceBefore) cx += spaceW;
      const w = scaledWidths[i];
      if (wordCounter < maxWords) {
        const col = p.gold ? PALETTE.gold : PALETTE.hero;
        text(g, p.str, cx + w / 2, ly, {
          size: sz,
          color: col,
          font: SANS,
          weight: 900,
          glow: p.gold ? 18 : 0,
          glowColor: PALETTE.goldGlow,
        });
      }
      wordCounter++;
      cx += w;
    });
  });
  g.restore();
}

// 4. Floating Tracked Micro-Label ("DIJUAL", "AYAH", "IBU", "AKU")
export function microLabel(g, str, x, y, o = {}) {
  if (!str) return;
  const {
    size = V(17, 21),
    color = PALETTE.labelText,
    spacing = 2.5,
    bg = false,
    a = 0.92,
  } = o;
  g.save();
  g.globalAlpha *= a;
  if (bg) {
    const tw = measure(g, str, size, SANS, 800) + str.length * spacing + 20;
    rr(g, x - tw / 2, y - size * 0.85, tw, size * 1.7, 8);
    g.fillStyle = 'rgba(11, 14, 20, 0.72)';
    g.fill();
  }
  text(g, str, x, y, {
    size,
    color,
    font: SANS,
    weight: 800,
    spacing,
  });
  g.restore();
}

// 5. 3D-Shaded Capsule Figure (GarisHidup signature character)
// Supports role: 'hero' (cream white), 'slate' (father/crowd), 'mauve' (mother), 'gold', 'navy'
// Supports garment: 'none' | 'toga' | 'kopiah' | 'ibu' | 'suit'
export function figure(g, o = {}) {
  const {
    x = E.W * 0.5,
    y = E.H * 0.66,
    s = 1.0,
    facing = 1,
    pose = POSES.stand,
    role = 'hero',
    garment = 'none',
    expr = 'neutral',
    label = null,
    labelDy = -255,
    reflect = true,
    reflectAlpha = 0.13,
    alpha: figAlpha = 1,
  } = o;

  const roleColors = {
    hero:  { fill: PALETTE.hero,  hi: PALETTE.heroHi,  sh: PALETTE.heroShade },
    slate: { fill: PALETTE.slate, hi: PALETTE.slateHi, sh: PALETTE.slateShade },
    mauve: { fill: PALETTE.mauve, hi: PALETTE.mauveHi, sh: PALETTE.mauveShade },
    navy:  { fill: PALETTE.navy,  hi: PALETTE.navyHi,  sh: PALETTE.slateShade },
    gold:  { fill: PALETTE.gold,  hi: PALETTE.goldHi,  sh: PALETTE.goldDark },
  };
  const rc = roleColors[role] || roleColors.hero;

  // Draw vertical floor reflection first if enabled
  if (reflect) {
    g.save();
    g.globalAlpha *= figAlpha * reflectAlpha;
    g.translate(x, y + 4 * s);
    g.scale(facing * s, -0.36 * s);
    drawCapsuleBody(g, pose, rc, garment, expr, true);
    g.restore();
  }

  // Contact shadow on floor
  g.save();
  g.globalAlpha *= figAlpha;
  g.fillStyle = 'rgba(0, 0, 0, 0.42)';
  g.beginPath();
  g.ellipse(x, y + 3 * s, 38 * s, 8 * s, 0, 0, Math.PI * 2);
  g.fill();

  // Golden aura if wearing glowing toga
  if (garment === 'toga') {
    glow(g, x, y - 135 * s, 145 * s, PALETTE.gold, 0.35);
    glow(g, x, y - 215 * s, 95 * s, PALETTE.goldHi, 0.42);
  }

  g.translate(x, y);
  g.scale(facing * s, s);
  drawCapsuleBody(g, pose, rc, garment, expr, false);
  g.restore();

  if (label) {
    microLabel(g, label, x, y + labelDy * s, {
      color: garment === 'toga' ? PALETTE.goldHi : PALETTE.labelText,
    });
  }
}

function drawCapsuleLimb(g, pts, width, outlineCol, fillCol, hiCol) {
  // 1) Thick dark outline
  seg(g, pts, width + 7.5, outlineCol);
  // 2) Main shaded body fill
  seg(g, pts, width, fillCol);
  // 3) Soft 3D inner highlight shifted slightly toward front/top
  if (hiCol) {
    const hiPts = pts.map(([px, py]) => [px + 1.8, py - 1.2]);
    seg(g, hiPts, width * 0.38, alpha(hiCol, 0.55));
  }
}

function drawCapsuleBody(g, p, rc, garment, expr, isReflection) {
  const out = PALETTE.outline;
  const L = 16.5, A = 15, T = 26, HR = 28;
  const farFill = shade(rc.fill, -0.18);

  // Far leg & far arm
  drawCapsuleLimb(g, [p.hip, p.kB, p.fB, [p.fB[0] + 12, p.fB[1]]], L - 1, out, farFill, null);
  drawCapsuleLimb(g, [p.sh, p.eB, p.hB], A - 1, out, farFill, null);

  // Ibu back bun (drawn behind head)
  if (garment === 'ibu') {
    circle(g, p.head[0] - HR * 0.78, p.head[1] - HR * 0.35, HR * 0.46 + 3.5, out);
    circle(g, p.head[0] - HR * 0.78, p.head[1] - HR * 0.35, HR * 0.46, '#2a303c');
    seg(g, [[p.head[0] - HR * 0.52, p.head[1] - HR * 0.52], [p.head[0] - HR * 0.45, p.head[1] - HR * 0.15]], 5, PALETTE.hero);
  }

  // Torso capsule
  drawCapsuleLimb(g, [p.sh, p.hip], T, out, rc.fill, rc.hi);

  // Garment overlay on torso/legs
  const [sx, sy] = p.sh, [hx, hy] = p.hip;
  if (garment === 'ibu') {
    // Modest rose-mauve dress/skirt with dark outline and button dots
    const skirtPts = [[sx - 15, sy - 2], [sx + 15, sy - 2], [hx + 24, hy + 48], [hx - 22, hy + 48]];
    poly(g, skirtPts.map(([px, py]) => [px * 1.08, py]), out);
    poly(g, skirtPts, PALETTE.mauve);
    circle(g, hx + 8, hy + 34, 2.5, PALETTE.hero);
    circle(g, hx + 14, hy + 38, 2.5, PALETTE.hero);
  } else if (garment === 'kopiah') {
    // Simple father tunic/jacket torso
    const jPts = [[sx - 15, sy - 2], [sx + 15, sy - 2], [hx + 17, hy + 12], [hx - 17, hy + 12]];
    poly(g, jPts.map(([px, py]) => [px * 1.08, py]), out);
    poly(g, jPts, '#4c5b73');
  } else if (garment === 'suit') {
    const sPts = [[sx - 16, sy - 3], [sx + 16, sy - 3], [hx + 18, hy + 14], [hx - 18, hy + 14]];
    poly(g, sPts.map(([px, py]) => [px * 1.08, py]), out);
    poly(g, sPts, '#232a38');
    poly(g, [[sx, sy], [sx + 5, sy], [sx + 6, sy + 42], [sx + 2, sy + 48]], '#d64545');
  } else if (garment === 'toga') {
    // Flowing golden graduation gown with warm highlight + scroll
    const robeOut = [[sx - 19, sy - 6], [sx + 20, sy - 6], [hx + 34, hy + 68], [hx - 30, hy + 68]];
    const robeIn  = [[sx - 15, sy - 3], [sx + 16, sy - 3], [hx + 29, hy + 64], [hx - 25, hy + 64]];
    poly(g, robeOut, out);
    poly(g, robeIn, PALETTE.gold);
    // Vertical gown pleats & bright golden collar
    seg(g, [[sx + 2, sy + 4], [hx + 4, hy + 60]], 3, PALETTE.goldDark);
    seg(g, [[sx - 8, sy + 2], [hx - 10, hy + 58]], 3, alpha(PALETTE.goldHi, 0.65));
  }

  // Near leg
  if (garment !== 'toga') {
    drawCapsuleLimb(g, [p.hip, p.kF, p.fF, [p.fF[0] + 13, p.fF[1]]], L, out, rc.fill, rc.hi);
  } else {
    // Feet peeking out below toga
    drawCapsuleLimb(g, [[p.fB[0], p.fB[1] - 28], p.fB, [p.fB[0] + 11, p.fB[1]]], L - 2, out, rc.fill, null);
    drawCapsuleLimb(g, [[p.fF[0], p.fF[1] - 28], p.fF, [p.fF[0] + 12, p.fF[1]]], L, out, rc.fill, rc.hi);
  }

  // Near arm
  if (garment === 'toga') {
    drawCapsuleLimb(g, [p.sh, p.eF, p.hF], A + 3, out, PALETTE.gold, PALETTE.goldHi);
    circle(g, p.hF[0], p.hF[1], 9.5, out);
    circle(g, p.hF[0], p.hF[1], 6.5, rc.fill);
    // Rolled graduation scroll in hand
    seg(g, [[p.hF[0] - 4, p.hF[1] - 10], [p.hF[0] + 6, p.hF[1] + 16]], 9, out);
    seg(g, [[p.hF[0] - 4, p.hF[1] - 10], [p.hF[0] + 6, p.hF[1] + 16]], 5.5, '#f7f3e8');
    seg(g, [[p.hF[0] - 1, p.hF[1] + 1], [p.hF[0] + 3, p.hF[1] + 4]], 6, '#d64545');
  } else {
    drawCapsuleLimb(g, [p.sh, p.eF, p.hF], A, out, rc.fill, rc.hi);
  }

  // Head with 3D shading (outline -> fill -> inner crescent highlight)
  const [headX, headY] = p.head;
  circle(g, headX, headY, HR + 3.8, out);
  circle(g, headX, headY, HR, rc.fill);
  if (!isReflection) {
    g.save();
    g.beginPath();
    g.arc(headX, headY, HR - 1, 0, Math.PI * 2);
    g.clip();
    circle(g, headX + HR * 0.22, headY - HR * 0.22, HR * 0.85, alpha(rc.hi, 0.55));
    g.restore();
  }

  // Headwear: Kopiah (Father) or Ibu hairline or Glowing Golden Toga Cap
  if (garment === 'kopiah') {
    g.save();
    g.beginPath();
    g.arc(headX, headY, HR + 1, Math.PI * 1.05, Math.PI * 1.95);
    g.closePath();
    g.fillStyle = '#1c222d';
    g.fill();
    g.lineWidth = 3;
    g.strokeStyle = out;
    g.stroke();
    seg(g, [[headX - HR * 0.88, headY - HR * 0.22], [headX + HR * 0.88, headY - HR * 0.22]], 4.5, PALETTE.hero);
    g.restore();
  } else if (garment === 'ibu') {
    g.save();
    g.beginPath();
    g.arc(headX, headY, HR + 1, Math.PI * 0.95, Math.PI * 1.85);
    g.closePath();
    g.fillStyle = '#252b36';
    g.fill();
    g.restore();
  } else if (garment === 'toga') {
    drawMortarboard(g, headX, headY - HR * 0.88, HR * 1.45);
  }
}

export function drawMortarboard(g, cx, cy, w) {
  const out = PALETTE.outline;
  const pts = [
    [cx - w, cy],
    [cx, cy - w * 0.36],
    [cx + w, cy],
    [cx, cy + w * 0.32],
  ];
  poly(g, pts.map(([px, py]) => [px + (px > cx ? 3 : px < cx ? -3 : 0), py + (py > cy ? 3 : -3)]), out);
  poly(g, pts, PALETTE.goldHi);
  // Inner diamond rim
  poly(g, [
    [cx - w * 0.65, cy],
    [cx, cy - w * 0.22],
    [cx + w * 0.65, cy],
    [cx, cy + w * 0.18],
  ], PALETTE.gold);
  // Hanging golden tassel
  seg(g, [[cx + w * 0.1, cy - 2], [cx + w * 0.78, cy + w * 0.12], [cx + w * 0.82, cy + w * 0.55]], 3.5, PALETTE.goldHi);
  circle(g, cx + w * 0.82, cy + w * 0.58, 4.5, PALETTE.goldHi);
}

// 6. Split-Box Diorama (Top Box vs Bottom Box running simultaneously)
// Supports activeBox: 'both' | 'top' | 'bottom' (dims inactive box like DfrzFUZlWQp)
// Supports topTag / botTag (top-left room header like "LAJANG, 29 · SABTU 20.00")
export function splitBoxes(g, o = {}) {
  const {
    x = E.W * 0.08,
    w = E.W * 0.84,
    topY = E.H * 0.225,
    botY = E.H * 0.455,
    h = E.H * 0.205,
    r = 14,
    activeBox = 'both',
    topTag = null,
    botTag = null,
    topDraw = null,
    botDraw = null,
  } = o;

  const drawOneBox = (by, fn, tag, isDimmed) => {
    g.save();
    rr(g, x, by, w, h, r);
    g.fillStyle = PALETTE.boxWall;
    g.fill();
    g.clip();
    // Floor strip inside diorama box
    const flY = by + h * 0.78;
    g.fillStyle = PALETTE.boxFloor;
    g.fillRect(x, flY, w, h - (flY - by));
    seg(g, [[x, flY], [x + w, flY]], 2, 'rgba(255,255,255,0.07)');
    if (fn) fn(g, { x, y: by, w, h, floorY: flY, cx: x + w / 2 });
    if (tag) {
      text(g, tag, x + 18, by + 24, {
        size: V(13, 15),
        color: 'rgba(220,228,240,0.75)',
        font: SANS,
        weight: 800,
        align: 'left',
        spacing: 2,
      });
    }
    if (isDimmed) {
      g.fillStyle = 'rgba(9, 12, 18, 0.52)';
      g.fillRect(x, by, w, h);
    }
    g.restore();

    // Crisp outer border
    g.save();
    rr(g, x, by, w, h, r);
    g.strokeStyle = isDimmed ? 'rgba(46, 55, 72, 0.45)' : PALETTE.boxBorder;
    g.lineWidth = 3;
    g.stroke();
    g.restore();
  };

  drawOneBox(topY, topDraw, topTag, activeBox === 'bottom');
  drawOneBox(botY, botDraw, botTag, activeBox === 'top');
}

// 6B. Borderless Open Split Stage (Layout B — DfuDW_RilGY, DfredL_gDTk, DfpOVPjDXw-, DfpAn6BnHUf)
export function openSplitStage(g, o = {}) {
  const {
    topFloorY = E.H * 0.43,
    botFloorY = E.H * 0.68,
    dividerY = E.H * 0.445,
    active = 'both', // 'both' | 'top' | 'bottom'
    topTag = null,
    botTag = null,
    topDraw = null,
    botDraw = null,
  } = o;

  // Upper zone
  g.save();
  if (active === 'bottom') g.globalAlpha *= 0.42;
  seg(g, [[E.W * 0.06, topFloorY], [E.W * 0.94, topFloorY]], 2.5, 'rgba(255,255,255,0.12)');
  if (topTag) {
    text(g, topTag, E.W * 0.08, topFloorY - E.H * 0.175, {
      size: V(15, 18),
      color: PALETTE.labelText,
      font: SANS,
      weight: 800,
      align: 'left',
      spacing: 2.2,
    });
  }
  if (topDraw) topDraw(g, { floorY: topFloorY, cx: E.W * 0.5 });
  g.restore();

  // Subtle horizontal divider
  seg(g, [[0, dividerY], [E.W, dividerY]], 1.5, 'rgba(255,255,255,0.06)');

  // Lower zone
  g.save();
  if (active === 'top') g.globalAlpha *= 0.42;
  seg(g, [[E.W * 0.06, botFloorY], [E.W * 0.94, botFloorY]], 2.5, 'rgba(255,255,255,0.12)');
  if (botTag) {
    text(g, botTag, E.W * 0.08, dividerY + 34, {
      size: V(15, 18),
      color: PALETTE.labelText,
      font: SANS,
      weight: 800,
      align: 'left',
      spacing: 2.2,
    });
  }
  if (botDraw) botDraw(g, { floorY: botFloorY, cx: E.W * 0.5 });
  g.restore();
}

// 7. Visual Metaphor: E-to-F Fuel Gauge (like "Yang bikin semua penuh juga perlu diisi")
export function fuelGauge(g, o = {}) {
  const {
    x = E.W * 0.5,
    y = E.H * 0.34,
    r = V(56, 68),
    level = 0.15, // 0 = E (empty), 1 = F (full)
    activeGold = false,
    label = null,
  } = o;

  g.save();
  if (activeGold) glow(g, x, y, r * 1.5, PALETTE.gold, 0.35);

  // Outer ring
  circle(g, x, y, r + 4, PALETTE.outline);
  circle(g, x, y, r, activeGold ? '#2b2418' : '#181e28');
  ring(g, x, y, r, 3.5, activeGold ? PALETTE.gold : '#6b778c');

  // Tick marks along top semi-circle
  for (let i = 0; i <= 8; i++) {
    const u = i / 8;
    const ang = Math.PI * (0.85 + u * 1.3);
    const r1 = r * 0.74, r2 = r * (i % 2 === 0 ? 0.88 : 0.82);
    seg(
      g,
      [[x + Math.cos(ang) * r1, y + Math.sin(ang) * r1], [x + Math.cos(ang) * r2, y + Math.sin(ang) * r2]],
      i % 2 === 0 ? 3 : 2,
      activeGold ? alpha(PALETTE.goldHi, 0.85) : 'rgba(255,255,255,0.55)'
    );
  }

  // E and F labels
  text(g, 'E', x - r * 0.52, y + r * 0.52, { size: r * 0.28, color: activeGold ? PALETTE.goldHi : '#94a3b8', font: SANS, weight: 900 });
  text(g, 'F', x + r * 0.52, y + r * 0.52, { size: r * 0.28, color: activeGold ? PALETTE.goldHi : '#94a3b8', font: SANS, weight: 900 });

  // Needle
  const needleAng = Math.PI * (0.85 + clamp(level, 0, 1) * 1.3);
  const nx = x + Math.cos(needleAng) * r * 0.68;
  const ny = y + Math.sin(needleAng) * r * 0.68;
  seg(g, [[x, y], [nx, ny]], 4.5, activeGold ? PALETTE.goldHi : PALETTE.hero);
  circle(g, x, y, r * 0.11, activeGold ? PALETTE.gold : '#6b778c');

  if (label) {
    microLabel(g, label, x, y + r + V(24, 30), { size: V(15, 18) });
  }
  g.restore();
}

// 8. Animated Siphon Pipe with flowing gold droplets/pulses
export function flowPipe(g, pts, t = 0, o = {}) {
  const {
    width = 10,
    gold = true,
    speed = 1.1,
    dir = 1,
    drops = 6,
  } = o;
  if (!pts || pts.length < 2) return;
  g.save();
  // Outer dark pipe casing
  seg(g, pts, width + 6, PALETTE.outline);
  seg(g, pts, width, gold ? '#3b2e16' : '#263040');
  seg(g, pts, width * 0.45, gold ? PALETTE.gold : '#6b778c');

  // Compute polyline segments for moving pulses
  const segs = [];
  let totalLen = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const dx = pts[i + 1][0] - pts[i][0];
    const dy = pts[i + 1][1] - pts[i][1];
    const len = Math.hypot(dx, dy);
    segs.push({ x0: pts[i][0], y0: pts[i][1], dx, dy, len, start: totalLen });
    totalLen += len;
  }
  if (totalLen > 1 && drops > 0) {
    for (let k = 0; k < drops; k++) {
      let u = ((k / drops) + dir * t * speed * 0.45) % 1;
      if (u < 0) u += 1;
      const dist = u * totalLen;
      let px = pts[0][0], py = pts[0][1];
      for (const s of segs) {
        if (dist <= s.start + s.len || s === segs[segs.length - 1]) {
          const f = s.len > 0 ? clamp((dist - s.start) / s.len, 0, 1) : 0;
          px = s.x0 + s.dx * f;
          py = s.y0 + s.dy * f;
          break;
        }
      }
      if (gold) glow(g, px, py, width * 2.4, PALETTE.gold, 0.55);
      circle(g, px, py, width * 0.58, gold ? PALETTE.goldHi : PALETTE.hero);
    }
  }
  g.restore();
}

// 9. GarisHidup Horizontal Progress Bar ("HARI 2" vs "HARI 365" / "100% PULIH")
export function progressBar(g, o = {}) {
  const {
    x = E.W * 0.5,
    y = E.H * 0.42,
    w = E.W * 0.68,
    h = 30,
    progress = 0.85,
    gold = true,
    leftLabel = null,
    rightLabel = null,
  } = o;
  g.save();
  const x0 = x - w / 2, y0 = y - h / 2;
  if (gold && progress > 0.05) {
    glow(g, x0 + (w * clamp(progress, 0, 1)) / 2, y, h * 3.2, PALETTE.gold, 0.28);
  }
  rr(g, x0 - 4, y0 - 4, w + 8, h + 8, (h + 8) / 2);
  g.fillStyle = PALETTE.outline;
  g.fill();
  rr(g, x0, y0, w, h, h / 2);
  g.fillStyle = '#181e28';
  g.fill();
  g.strokeStyle = PALETTE.boxBorder;
  g.lineWidth = 2;
  g.stroke();

  const fw = Math.max(h, w * clamp(progress, 0.03, 1));
  rr(g, x0, y0, fw, h, h / 2);
  g.fillStyle = gold ? PALETTE.gold : PALETTE.slate;
  g.fill();
  // Top gloss strip
  rr(g, x0 + 6, y0 + 4, Math.max(8, fw - 12), h * 0.32, h * 0.16);
  g.fillStyle = alpha(gold ? PALETTE.goldHi : PALETTE.heroHi, 0.55);
  g.fill();

  if (leftLabel) {
    microLabel(g, leftLabel, x0 + 95, y0 - 20, { size: V(15, 18), color: PALETTE.hero });
  }
  if (rightLabel) {
    microLabel(g, rightLabel, x0 + w - 95, y0 - 20, { size: V(15, 18), color: gold ? PALETTE.goldHi : PALETTE.labelText });
  }
  g.restore();
}

// 10. Golden Siphon Valve Wheel (for What-If turnaround beat)
export function valveWheel(g, x, y, r = 64, angle = 0, o = {}) {
  const { gold = true, label = null } = o;
  g.save();
  if (gold) glow(g, x, y, r * 1.9, PALETTE.gold, 0.45);
  g.translate(x, y);
  g.rotate(angle);
  const col = gold ? PALETTE.gold : PALETTE.slate;
  const hi = gold ? PALETTE.goldHi : PALETTE.slateHi;
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    const tx = Math.cos(a) * r, ty = Math.sin(a) * r;
    seg(g, [[0, 0], [tx, ty]], 15, PALETTE.outline);
    seg(g, [[0, 0], [tx, ty]], 9, col);
    circle(g, tx, ty, 11, PALETTE.outline);
    circle(g, tx, ty, 7, hi);
  }
  ring(g, 0, 0, r * 0.86, 16, PALETTE.outline);
  ring(g, 0, 0, r * 0.86, 10, col);
  ring(g, 0, 0, r * 0.86, 3.5, hi);
  circle(g, 0, 0, r * 0.28, PALETTE.outline);
  circle(g, 0, 0, r * 0.21, hi);
  g.restore();
  if (label) microLabel(g, label, x, y + r + 34, { color: gold ? PALETTE.goldHi : PALETTE.labelText });
}

// 11. Golden Padlock ("KUNCI AUDIT WARGA")
export function padlock(g, x, y, s = 1, o = {}) {
  const { locked = true, label = null } = o;
  g.save();
  glow(g, x, y, 150 * s, PALETTE.gold, 0.42);
  g.translate(x, y);
  g.scale(s, s);
  // Shackle arch
  const shY = locked ? -48 : -68;
  g.lineWidth = 22;
  g.strokeStyle = PALETTE.outline;
  g.beginPath();
  g.arc(0, shY, 38, Math.PI, 0);
  g.lineTo(38, -10);
  g.moveTo(-38, shY);
  g.lineTo(-38, -10);
  g.stroke();

  g.lineWidth = 14;
  g.strokeStyle = PALETTE.goldHi;
  g.beginPath();
  g.arc(0, shY, 38, Math.PI, 0);
  g.lineTo(38, -10);
  g.moveTo(-38, shY);
  g.lineTo(-38, -10);
  g.stroke();

  // Body
  rr(g, -64, -22, 128, 104, 18);
  g.fillStyle = PALETTE.outline;
  g.fill();
  rr(g, -58, -16, 116, 92, 14);
  g.fillStyle = PALETTE.gold;
  g.fill();
  rr(g, -50, -10, 26, 78, 8);
  g.fillStyle = alpha(PALETTE.goldHi, 0.55);
  g.fill();

  // Keyhole
  circle(g, 0, 22, 11, PALETTE.outline);
  poly(g, [[-5, 22], [5, 22], [8, 48], [-8, 48]], PALETTE.outline);
  g.restore();
  if (label) microLabel(g, label, x, y + 115 * s, { color: PALETTE.goldHi });
}

// 12. Golden Timer / Clock Pill ("08.10", "05.00", "0:01" — DfnuKikjEa4 & DfpOVPjDXw-)
export function goldTimerPill(g, timeStr, o = {}) {
  const {
    x = E.W * 0.5,
    y = E.H * 0.25,
    size = V(28, 34),
    clockIcon = true,
    sub = null,
    gold = true,
  } = o;
  g.save();
  const tw = measure(g, timeStr, size, SANS, 900);
  const iconPad = clockIcon ? size * 1.15 : 0;
  const pw = Math.max(V(168, 196), tw + iconPad + size * 1.7);
  const ph = size * 1.82;
  if (gold) glow(g, x, y, pw * 0.85, PALETTE.gold, 0.38);

  rr(g, x - pw / 2, y - ph / 2, pw, ph, ph / 2);
  g.fillStyle = gold ? 'rgba(196, 125, 14, 0.34)' : PALETTE.pillBg;
  g.fill();
  g.strokeStyle = gold ? PALETTE.goldHi : PALETTE.pillBorder;
  g.lineWidth = 2.5;
  g.stroke();

  const contentW = tw + iconPad;
  const startX = x - contentW / 2;
  if (clockIcon) {
    const cx = startX + size * 0.42;
    const cy = y;
    const cr = size * 0.42;
    circle(g, cx, cy, cr, PALETTE.hero);
    seg(g, [[cx, cy], [cx, cy - cr * 0.58]], 2.5, PALETTE.outline);
    seg(g, [[cx, cy], [cx + cr * 0.48, cy + cr * 0.2]], 2.5, PALETTE.outline);
  }
  text(g, timeStr, startX + iconPad + tw / 2, y + 2, {
    size,
    color: gold ? PALETTE.goldHi : PALETTE.hero,
    font: SANS,
    weight: 900,
    spacing: 2,
  });

  if (sub) {
    microLabel(g, sub, x, y + ph * 0.88, { size: size * 0.55, color: PALETTE.labelText });
  }
  g.restore();
}

// 13. Crisp Speech / Callout Bubble ("TELAT!", "GANTI DONG", "TAGIHAN CICILAN", "NGOPI?")
export function speechBubble(g, str, x, y, o = {}) {
  const {
    size = V(16, 19),
    tailDir = 'left', // 'left' | 'right' | 'center'
    tailLen = 16,
    gold = false,
  } = o;
  g.save();
  const tw = measure(g, str, size, SANS, 900);
  const bw = Math.max(84, tw + 30);
  const bh = size * 2.05;
  const bx = x - bw / 2, by = y - bh / 2;
  if (gold) glow(g, x, y, bw * 0.8, PALETTE.gold, 0.35);

  const fillCol = gold ? PALETTE.goldHi : PALETTE.hero;
  const tx = tailDir === 'left' ? x - bw * 0.18 : tailDir === 'right' ? x + bw * 0.18 : x;
  const tipX = tailDir === 'left' ? tx - 10 : tailDir === 'right' ? tx + 10 : tx;
  const tipY = by + bh + tailLen;

  // Outline behind box + tail
  rr(g, bx - 3, by - 3, bw + 6, bh + 6, 9);
  g.fillStyle = PALETTE.outline;
  g.fill();
  poly(g, [[tx - 10, by + bh], [tx + 10, by + bh], [tipX, tipY + 3]], PALETTE.outline);

  // Fill box + tail
  rr(g, bx, by, bw, bh, 7);
  g.fillStyle = fillCol;
  g.fill();
  poly(g, [[tx - 7, by + bh - 2], [tx + 7, by + bh - 2], [tipX, tipY]], fillCol);

  text(g, str, x, y + 1, {
    size,
    color: PALETTE.outline,
    font: SANS,
    weight: 900,
    spacing: 1,
  });
  g.restore();
}

// 14. Giant Metric Counter ("PEMBELI" / "54", "HARI PENSIUN" / "180", "LAYAR" / "5 JAM")
export function bigCounter(g, valueStr, o = {}) {
  const {
    x = E.W * 0.5,
    y = E.H * 0.34,
    label = 'PEMBELI',
    size = V(52, 62),
    gold = false,
    align = 'center',
  } = o;
  g.save();
  if (label) {
    text(g, label, x, y - size * 0.72, {
      size: size * 0.28,
      color: PALETTE.labelText,
      font: SANS,
      weight: 800,
      align,
      spacing: 2.5,
    });
  }
  if (gold) glow(g, x, y, size * 1.8, PALETTE.gold, 0.35);
  text(g, String(valueStr), x, y, {
    size,
    color: gold ? PALETTE.goldHi : PALETTE.hero,
    font: SANS,
    weight: 900,
    align,
  });
  g.restore();
}

// 15. Expense / Burden Pill Stack ("GAJI Rp2 JUTA" + ["KIRIM IBU 2 JT", "SPP ADIK 1,5 JT", ...])
export function expenseStack(g, o = {}) {
  const {
    x = E.W * 0.1,
    y = E.H * 0.53,
    topLabel = 'GAJI',
    mainValue = 'Rp2 JUTA',
    items = [],
    goldMain = false,
  } = o;
  g.save();
  text(g, topLabel, x, y - 34, {
    size: V(14, 16),
    color: PALETTE.labelText,
    font: SANS,
    weight: 800,
    align: 'left',
    spacing: 2,
  });
  text(g, mainValue, x, y, {
    size: V(34, 40),
    color: goldMain ? PALETTE.goldHi : PALETTE.hero,
    font: SANS,
    weight: 900,
    align: 'left',
  });
  items.forEach((item, i) => {
    const iy = y + 36 + i * 34;
    const sz = V(13, 15);
    const tw = measure(g, item, sz, SANS, 800) + item.length * 1.5 + 28;
    rr(g, x, iy - 13, tw, 26, 13);
    g.fillStyle = 'rgba(24, 30, 42, 0.9)';
    g.fill();
    g.strokeStyle = 'rgba(148, 163, 184, 0.28)';
    g.lineWidth = 1.5;
    g.stroke();
    text(g, item, x + 14, iy, {
      size: sz,
      color: PALETTE.labelText,
      font: SANS,
      weight: 800,
      align: 'left',
      spacing: 1.5,
    });
  });
  g.restore();
}

// 16. Ghost / Memory / Missing Figure (mode: 'dashed' for "SIBUK" or 'goldGlow' for glowing memory figure in Dfqx4qEkbzy)
export function ghostFigure(g, o = {}) {
  const {
    x = E.W * 0.5,
    y = E.H * 0.66,
    s = 1.0,
    mode = 'goldGlow', // 'dashed' | 'goldGlow'
    innerText = null,
    pose = POSES.stand,
  } = o;
  g.save();
  if (mode === 'goldGlow') {
    glow(g, x, y - 110 * s, 135 * s, PALETTE.gold, 0.55);
    glow(g, x, y - 195 * s, 85 * s, PALETTE.goldHi, 0.5);
    figure(g, { x, y, s, pose, role: 'gold', reflect: true, reflectAlpha: 0.22 });
  } else {
    // Dashed outline missing silhouette
    g.translate(x, y);
    g.scale(s, s);
    g.strokeStyle = 'rgba(208, 215, 226, 0.55)';
    g.lineWidth = 3;
    g.setLineDash([7, 6]);
    const [hx, hy] = pose.head;
    g.beginPath();
    g.arc(hx, hy, 26, 0, Math.PI * 2);
    g.stroke();
    const drawDashedSeg = pts => {
      g.beginPath();
      g.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
      g.stroke();
    };
    drawDashedSeg([pose.sh, pose.hip]);
    drawDashedSeg([pose.sh, pose.eB, pose.hB]);
    drawDashedSeg([pose.sh, pose.eF, pose.hF]);
    drawDashedSeg([pose.hip, pose.kB, pose.fB]);
    drawDashedSeg([pose.hip, pose.kF, pose.fF]);
    g.setLineDash([]);
    if (innerText) {
      text(g, innerText, 0, (pose.sh[1] + pose.hip[1]) * 0.5, {
        size: 16,
        color: PALETTE.hero,
        font: SANS,
        weight: 900,
        spacing: 1.5,
      });
    }
  }
  g.restore();
}

// 17. Glowing Wall Frame / Certificate / Angled Banner ("LUNAS", "S1 AKUNTANSI", "PENSIUN", "2 JUTA")
export function angledStamp(g, str, x, y, o = {}) {
  const {
    w = 156,
    h = 54,
    angle = -0.1,
    gold = true,
    dashed = false,
  } = o;
  g.save();
  if (gold) glow(g, x, y, w * 0.95, PALETTE.gold, 0.45);
  g.translate(x, y);
  g.rotate(angle);
  rr(g, -w / 2 - 3, -h / 2 - 3, w + 6, h + 6, 8);
  g.fillStyle = PALETTE.outline;
  g.fill();
  rr(g, -w / 2, -h / 2, w, h, 6);
  g.fillStyle = gold ? PALETTE.gold : '#1c222d';
  g.fill();
  if (dashed) g.setLineDash([6, 5]);
  g.strokeStyle = gold ? PALETTE.goldHi : PALETTE.boxBorder;
  g.lineWidth = 3;
  g.stroke();
  g.setLineDash([]);
  text(g, str, 0, 2, {
    size: h * 0.46,
    color: gold ? PALETTE.heroHi : PALETTE.goldHi,
    font: SANS,
    weight: 900,
    spacing: 2,
  });
  g.restore();
}

// 18. Dynamic Crowd / Queue Generator (DfmHNgpj9_- Bakso Queue & Dfo5nLnDig4 Stadium)
export function crowdQueue(g, o = {}) {
  const {
    startX = E.W * 0.46,
    floorY = E.H * 0.66,
    count = 8,
    spacing = 34,
    s = 0.62,
    facing = -1,
    confetti = false,
  } = o;
  for (let i = count - 1; i >= 0; i--) {
    const row = Math.floor(i / 6);
    const col = i % 6;
    const fx = startX + col * spacing + (row % 2) * 14;
    const fy = floorY - row * 24;
    figure(g, {
      x: fx,
      y: fy,
      s: s * (1 - row * 0.06),
      facing,
      role: 'slate',
      pose: i % 3 === 0 ? POSES.wave : POSES.stand,
      reflect: row === 0,
    });
  }
  if (confetti) {
    const cols = [PALETTE.goldHi, PALETTE.hero, '#e06c75', '#61afef'];
    for (let k = 0; k < 18; k++) {
      const cx = startX - 60 + ((k * 37) % 180);
      const cy = floorY - 140 - ((k * 29) % 90);
      poly(g, [[cx, cy], [cx + 7, cy + 3], [cx + 3, cy + 9], [cx - 4, cy + 6]], cols[k % cols.length]);
    }
  }
}

// 19. Sawtooth Paper Receipt / Bill Card ("TOTAL / Rp675.000 / DIBAGI 5 ORANG" — Dfj24HrEWH-)
export function receiptCard(g, o = {}) {
  const {
    x = E.W * 0.34,
    y = E.H * 0.31,
    w = 228,
    h = 114,
    topLabel = 'TOTAL',
    mainValue = 'Rp675.000',
    subLabel = 'DIBAGI 5 ORANG',
    gold = false,
  } = o;
  g.save();
  if (gold) glow(g, x, y, w * 0.85, PALETTE.gold, 0.35);
  const x0 = x - w / 2, y0 = y - h / 2;
  const teeth = 11;
  const tw = w / teeth;
  const toothH = 9;

  const buildPath = (pad = 0) => {
    const pts = [
      [x0 - pad, y0 - pad],
      [x0 + w + pad, y0 - pad],
      [x0 + w + pad, y0 + h + pad],
    ];
    for (let i = teeth; i >= 0; i--) {
      const tx = x0 + i * tw;
      const ty = y0 + h + pad + (i % 2 === 1 ? toothH : 0);
      pts.push([tx, ty]);
    }
    return pts;
  };

  poly(g, buildPath(3.5), PALETTE.outline);
  poly(g, buildPath(0), gold ? PALETTE.goldHi : '#f3efe6');

  text(g, topLabel, x, y0 + 24, {
    size: V(13, 15),
    color: '#64748b',
    font: SANS,
    weight: 800,
    spacing: 2.5,
  });
  text(g, mainValue, x, y0 + 60, {
    size: V(28, 33),
    color: PALETTE.outline,
    font: SANS,
    weight: 900,
  });
  if (subLabel) {
    text(g, subLabel, x, y0 + 90, {
      size: V(12, 14),
      color: '#475569',
      font: SANS,
      weight: 800,
      spacing: 1.8,
    });
  }
  g.restore();
}

// 20. Dark Chat Notification Toast ("• BOS" / "Bawa berkas laporan ya." — DfmU2jDitKt)
export function chatToast(g, o = {}) {
  const {
    x = E.W * 0.28,
    y = E.H * 0.56,
    w = 270,
    h = 66,
    sender = 'BOS',
    message = 'Bawa berkas laporan ya.',
    tag = null, // e.g. 'CHILL'
    timeStr = null, // e.g. '06.58'
    gold = false,
  } = o;
  g.save();
  if (tag) {
    microLabel(g, tag, x - w / 2 + 28, y - h / 2 - 22, { size: V(14, 16), color: PALETTE.labelText });
  }
  if (timeStr) {
    microLabel(g, timeStr, x + w / 2 + 44, y - h / 2 - 22, { size: V(14, 16), color: PALETTE.hero });
  }
  if (gold) glow(g, x, y, w * 0.75, PALETTE.gold, 0.32);

  const x0 = x - w / 2, y0 = y - h / 2;
  rr(g, x0 - 3, y0 - 3, w + 6, h + 6, 15);
  g.fillStyle = PALETTE.outline;
  g.fill();
  rr(g, x0, y0, w, h, 12);
  g.fillStyle = 'rgba(26, 33, 46, 0.94)';
  g.fill();
  g.strokeStyle = gold ? PALETTE.goldHi : '#3b475e';
  g.lineWidth = 2;
  g.stroke();

  circle(g, x0 + 20, y0 + 21, 4.5, gold ? PALETTE.goldHi : '#94a3b8');
  text(g, sender, x0 + 32, y0 + 22, {
    size: V(12, 14),
    color: gold ? PALETTE.goldHi : '#94a3b8',
    font: SANS,
    weight: 800,
    align: 'left',
    spacing: 1.5,
  });
  text(g, message, x0 + 18, y0 + 46, {
    size: V(15, 17),
    color: PALETTE.hero,
    font: SANS,
    weight: 700,
    align: 'left',
  });
  g.restore();
}

// 21. Blueprint / Presentation Board on Tripod Easel ("REVISI KE-9" + crumpled paper balls — DfjwJ96gGqb)
export function blueprintBoard(g, o = {}) {
  const {
    x = E.W * 0.42,
    floorY = E.H * 0.43,
    w = 210,
    h = 148,
    topLabel = 'RENCANA',
    title = 'REVISI KE-9',
    crumpledCount = 6,
    gold = false,
  } = o;
  g.save();
  const by = floorY - h - 58;
  const bx = x - w / 2;
  if (topLabel) {
    microLabel(g, topLabel, x, by - 22, { size: V(13, 15), color: PALETTE.labelText });
  }
  // Easel tripod legs
  seg(g, [[x - w * 0.28, by + h], [x - w * 0.42, floorY]], 9, PALETTE.outline);
  seg(g, [[x - w * 0.28, by + h], [x - w * 0.42, floorY]], 5, '#5c4938');
  seg(g, [[x + w * 0.28, by + h], [x + w * 0.42, floorY]], 9, PALETTE.outline);
  seg(g, [[x + w * 0.28, by + h], [x + w * 0.42, floorY]], 5, '#5c4938');
  seg(g, [[x, by + h], [x, floorY]], 8, PALETTE.outline);

  // Board frame
  if (gold) glow(g, x, by + h / 2, w * 0.85, PALETTE.gold, 0.35);
  rr(g, bx - 4, by - 4, w + 8, h + 8, 8);
  g.fillStyle = PALETTE.outline;
  g.fill();
  rr(g, bx, by, w, h, 6);
  g.fillStyle = gold ? '#fff4d6' : '#f1f5f9';
  g.fill();
  g.strokeStyle = gold ? PALETTE.gold : '#475569';
  g.lineWidth = 4;
  g.stroke();

  text(g, title, x, by + 28, {
    size: V(18, 21),
    color: PALETTE.outline,
    font: SANS,
    weight: 900,
    spacing: 1,
  });

  // Mini house schematic inside board
  const hx = x, hy = by + 94;
  poly(g, [[hx - 54, hy - 14], [hx, hy - 44], [hx + 54, hy - 14]], '#64748b');
  rr(g, hx - 42, hy - 14, 84, 46, 2);
  g.strokeStyle = '#334155';
  g.lineWidth = 2.5;
  g.stroke();
  rr(g, hx - 28, hy - 4, 20, 18, 1); g.stroke();
  rr(g, hx + 8, hy - 4, 20, 18, 1); g.stroke();

  // Crumpled paper pile on left floor
  for (let i = 0; i < crumpledCount; i++) {
    const px = bx - 72 + (i % 3) * 24 + (i > 2 ? 10 : 0);
    const py = floorY - 12 - Math.floor(i / 3) * 18;
    circle(g, px, py, 13, PALETTE.outline);
    circle(g, px, py, 9.5, '#e2e8f0');
    seg(g, [[px - 4, py - 2], [px + 3, py + 3]], 2, '#94a3b8');
  }
  g.restore();
}

// 22. Scoreboard Header ("KAMI 4 : 3 TAMU" + "TRIBUN PENUH" — Dfo5nLnDig4)
export function scoreboard(g, leftScore = 4, rightScore = 3, o = {}) {
  const {
    x = E.W * 0.5,
    y = E.H * 0.255,
    leftLabel = 'KAMI',
    rightLabel = 'TAMU',
    sub = 'TRIBUN PENUH',
  } = o;
  g.save();
  const gap = 82;
  microLabel(g, leftLabel, x - gap, y - 38, { size: V(13, 15), color: PALETTE.labelText });
  microLabel(g, rightLabel, x + gap, y - 38, { size: V(13, 15), color: PALETTE.labelText });
  text(g, String(leftScore), x - gap, y, { size: V(46, 54), color: PALETTE.hero, font: SANS, weight: 900 });
  text(g, ':', x, y - 4, { size: V(36, 42), color: PALETTE.slateHi, font: SANS, weight: 900 });
  text(g, String(rightScore), x + gap, y, { size: V(46, 54), color: PALETTE.hero, font: SANS, weight: 900 });
  if (sub) {
    microLabel(g, sub, x, y + 36, { size: V(13, 15), color: PALETTE.labelText });
  }
  g.restore();
}
