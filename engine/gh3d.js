// engine/gh3d.js — 3D low-poly stage for the "JadiBegini / OfficeExplainer" hybrid style.
// Rig karakter sama dengan rig 2D (POSES) lewat three-kit.figure3D.
// Semua geometri prosedural: deterministik, tanpa GLB eksternal, tanpa jaringan.
// Catatan performa: padi/rumput memakai InstancedMesh (1 draw call) karena mesin ini render
// WebGL lewat swiftshader (CPU) — mesh per helai terlalu mahal.
import { E, V, mood, clamp, lerp, ease, key, rng, shade, alpha, text, FONTS } from './core.js';
import { THREE } from './three-kit.js';

export const INK = '#0d0f14';

// ---------- preset kostum ----------
export const FARMER  = { top: 'shirt', color: '#b0281f', legs: '#3a2d22', head: 'caping', headColor: '#c9a86a', blush: true,  mustache: true,  skin: '#fdf3e3' };
export const FARMER2 = { top: 'shirt', color: '#2f6f4e', legs: '#3a2d22', head: 'peci',   headColor: '#151821', blush: true,  mustache: false, skin: '#fdf3e3' };
export const TENGKULAK = { top: 'shirt', color: '#c9843a', legs: '#2f3a4a', head: 'peci', headColor: '#151821', blush: true,  mustache: true,  skin: '#fdf3e3', kid: false };
export const WORKER  = { top: 'shirt', color: '#e8c25a', legs: '#232a35', head: 'none', hair: 'bowl', blush: false, mustache: false, skin: '#fdf6ec' };
export const BOSS    = { top: 'suit',  color: '#3a3f4b', legs: '#242832', head: 'none', hair: 'slick', blush: false, mustache: false, skin: '#fdf6ec' };

// ---------- karakter ----------
export function person(T, outfit = {}, o = {}) {
  const f = T.figure3D(outfit, { rim: o.rim || INK, pose: o.pose || 'stand', s: o.s || 1 });
  const skin = outfit.skin || '#fdf6ec';
  let head = null;
  f.traverse(x => {
    if (head || !x.isGroup || x === f) return;
    if (x.children.some(c => c.isMesh && c.geometry?.type === 'SphereGeometry' && c.scale.x > 0.15)) head = x;
  });
  if (!head) return f;

  // kepala: kulit terang + outline gelap (gaya JadiBegini)
  head.children.forEach(x => {
    if (!(x.isMesh && x.geometry?.type === 'SphereGeometry')) return;
    if (x.scale.x > 0.15) {
      x.material = x.material?.side === THREE.BackSide
        ? T.basic(INK, { side: THREE.BackSide })
        : T.mat(skin, { roughness: 0.95 });
    } else if (x.scale.x < 0.05) {
      x.material = T.basic('#1a1418');   // mata: gelap di atas kulit terang
    }
  });

  if (outfit.blush) for (const z of [-0.105, 0.105]) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.042, 12, 8), T.basic('#e8899b'));
    b.scale.set(0.55, 0.62, 0.42); b.position.set(0.163, -0.045, z); head.add(b);
  }
  if (outfit.mustache) {
    const m = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.014, 6, 12, Math.PI), T.mat('#241a12'));
    m.position.set(0.183, -0.03, 0); m.rotation.y = Math.PI / 2; m.rotation.z = Math.PI;
    head.add(m);
  }
  if (outfit.hair === 'bowl') {
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.207, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.58), T.mat('#15100e'));
    hair.position.set(-0.012, 0.012, 0); head.add(hair);
    for (let i = 0; i < 7; i++) {
      const bang = new THREE.Mesh(new THREE.ConeGeometry(0.024, 0.075, 3), T.mat('#15100e'));
      bang.position.set(0.143, 0.05, -0.086 + i * 0.029); bang.rotation.z = -0.42; head.add(bang);
    }
  }
  if (outfit.hair === 'slick') {
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.204, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), T.mat('#221a16'));
    hair.position.set(-0.02, 0.015, 0); head.add(hair);
  }
  if (outfit.head === 'caping') {
    const hc = outfit.headColor || '#c9a86a';
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.44, 0.19, 18), T.mat(hc, { flat: true }));
    cone.position.y = 0.2; cone.castShadow = true; head.add(cone);
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.014, 18), T.mat(shade(hc, -0.16)));
    brim.position.y = 0.115; head.add(brim);
  }
  if (outfit.head === 'peci') {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.172, 0.188, 0.135, 16), T.mat(outfit.headColor || '#151821'));
    p.position.y = 0.178; p.castShadow = true; head.add(p);
  }
  return f;
}

// ---------- dasar dunia: air + pematang ----------
export function waterPlane(T, o = {}) {
  const { w = 26, d = 18, x = 0, z = 0, color = '#7fa3a6' } = o;
  const m = T.plane(w, d, T.mat(color, { roughness: 0.14, metalness: 0.42 }), x, 0.015, z);
  m.rotation.x = -Math.PI / 2;
  return m;
}

// bukit jauh: bentuk membulat low-poly (bukan kerucut tajam)
export function hills(T, o = {}) {
  const { z = -26, color = '#5d7a6a', count = 9, spread = 46, h = 5.2, seed = 31, y = -0.4 } = o;
  const r = rng(seed), g = new THREE.Group();
  const geo = new THREE.SphereGeometry(1, 7, 5);
  for (let i = 0; i < count; i++) {
    const w = 7 + r() * 9, hh = h * (0.55 + r() * 0.65), dd = 6 + r() * 6;
    const hill = new THREE.Mesh(geo, T.mat(color, { flat: true }));
    hill.scale.set(w, hh, dd);
    hill.position.set(-spread / 2 + (i + r() * 0.5) * (spread / count), y, z + (r() - 0.5) * 6);
    g.add(hill);
  }
  return g;
}

// matahari: sprite glow aditif, bukan bola mesh (biar tidak terlihat seperti koin)
export function sunGlow(T, x, y, z, size = 9, color = '#ffe3a8') {
  const tex = T.canvasTex(128, 128, (g, w, h) => {
    const gr = g.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2);
    gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.22, color); gr.addColorStop(1, 'rgba(255,220,150,0)');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  });
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  s.scale.set(size, size, 1); s.position.set(x, y, z);
  return s;
}

export function bund(T, o = {}) {
  const { w = 16, d = 0.95, x = 0, z = 0, color = '#4a3f2a', h = 0.26 } = o;
  return T.box(w, h, d, color, x, h / 2, z);
}

// ---------- padi (instanced) ----------
export function paddyField(T, o = {}) {
  const { rows = 7, cols = 11, gapX = 0.86, gapZ = 0.78, from = -4.8, z0 = -0.9,
          color = '#4e7a2e', sickColor = '#b09534', sick = 0, seed = 7, h = 0.62, y = 0 } = o;
  const r = rng(seed);
  const perClump = 5, count = rows * cols * perClump;
  const geo = new THREE.ConeGeometry(0.052, h, 4);
  geo.translate(0, h / 2, 0);
  const mesh = new THREE.InstancedMesh(geo, T.mat('#ffffff', { flat: true }), count);
  mesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), eu = new THREE.Euler();
  const pos = new THREE.Vector3(), scl = new THREE.Vector3(), col = new THREE.Color();
  let i = 0;
  for (let ry = 0; ry < rows; ry++) for (let cx = 0; cx < cols; cx++) {
    const jx = from + cx * gapX + (r() - 0.5) * 0.16;
    const jz = z0 - ry * gapZ + (r() - 0.5) * 0.14;
    const dead = r() < sick;
    for (let k = 0; k < perClump; k++) {
      const a = (k / perClump) * Math.PI * 2 + r() * 0.4;
      eu.set(-Math.sin(a) * 0.26, r() * 0.6, Math.cos(a) * 0.26);
      q.setFromEuler(eu);
      pos.set(jx + Math.cos(a) * 0.07, y, jz + Math.sin(a) * 0.07);
      scl.set(1, 0.8 + r() * 0.45, 1);
      m4.compose(pos, q, scl);
      mesh.setMatrixAt(i, m4);
      col.set(dead ? sickColor : color).offsetHSL(0, 0, (r() - 0.5) * 0.07);
      mesh.setColorAt(i, col);
      i++;
    }
  }
  mesh.castShadow = true; mesh.receiveShadow = true;
  mesh.instanceMatrix.needsUpdate = true; mesh.instanceColor.needsUpdate = true;
  return mesh;
}

// bunga refugia di pematang (instanced batang + kelopak)
export function flowers(T, o = {}) {
  const { n = 40, from = -5, to = 5, z = 0, seed = 11, y = 0.24, tall = 0.36,
          palette = ['#e94f6a', '#f2c14e', '#c86bd9', '#f07f2e', '#f5f2ea'] } = o;
  const r = rng(seed), g = new THREE.Group();
  const stemGeo = new THREE.CylinderGeometry(0.012, 0.016, tall, 4);
  stemGeo.translate(0, tall / 2, 0);
  const stems = new THREE.InstancedMesh(stemGeo, T.mat('#3f6b2a'), n);
  const bloomGeo = new THREE.SphereGeometry(0.058, 8, 6);
  const blooms = new THREE.InstancedMesh(bloomGeo, T.mat('#ffffff', { flat: true }), n);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), scl = new THREE.Vector3(), p = new THREE.Vector3(), col = new THREE.Color();
  for (let i = 0; i < n; i++) {
    const x = from + r() * (to - from), zz = z + (r() - 0.5) * 0.55;
    const sc = 0.85 + r() * 0.45;
    scl.set(1, sc, 1); p.set(x, y, zz); m4.compose(p, q.identity(), scl); stems.setMatrixAt(i, m4);
    scl.set(1, 0.8, 1); p.set(x, y + tall * sc + 0.02, zz); m4.compose(p, q, scl); blooms.setMatrixAt(i, m4);
    blooms.setColorAt(i, col.set(palette[Math.floor(r() * palette.length)]));
  }
  stems.castShadow = blooms.castShadow = true;
  g.add(stems, blooms);
  g.userData.stems = stems; g.userData.blooms = blooms;
  return g;
}

// ---------- pohon / bangunan / tiang ----------
export function coconut(T, x, z, s = 1, color = '#20402a') {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * s, 0.19 * s, 3.6 * s, 7), T.mat('#6b5236', { flat: true }));
  trunk.position.y = 1.8 * s; trunk.castShadow = true; g.add(trunk);
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.28 * s, 2.0 * s, 4), T.mat(color, { flat: true }));
    leaf.position.set(Math.cos(a) * 0.7 * s, 3.55 * s, Math.sin(a) * 0.7 * s);
    leaf.rotation.z = Math.cos(a) * 1.2; leaf.rotation.x = -Math.sin(a) * 1.2;
    leaf.castShadow = true; g.add(leaf);
  }
  g.position.set(x, 0, z);
  return g;
}

export function hut(T, x, z, s = 1) {
  const g = new THREE.Group();
  g.add(T.box(2.5 * s, 1.8 * s, 2.1 * s, '#8a7550', 0, 0.9 * s, 0));
  const roof = new THREE.Mesh(new THREE.ConeGeometry(2.25 * s, 1.25 * s, 4), T.mat('#5a4128', { flat: true }));
  roof.position.y = 2.5 * s; roof.rotation.y = Math.PI / 4; roof.castShadow = true; g.add(roof);
  g.add(T.box(0.66 * s, 1.3 * s, 0.08, '#3c2c1c', 0, 0.65 * s, 1.06 * s));
  g.position.set(x, 0, z);
  return g;
}

export function powerPole(T, x, z, s = 1) {
  const g = new THREE.Group();
  g.add(T.cyl(0.085 * s, 0.115 * s, 6.2 * s, '#4a4038', 0, 3.1 * s, 0, 7));
  g.add(T.box(1.4 * s, 0.09 * s, 0.09 * s, '#4a4038', 0, 6.0 * s, 0));
  g.position.set(x, 0, z);
  return g;
}

export function signBoard(T, o = {}) {
  const { w = 1.5, h = 0.9, x = 0, y = 1.35, z = 0, color = '#f4f0e6' } = o;
  const g = new THREE.Group();
  g.add(T.box(0.06, y, 0.06, '#6b5236', 0, y / 2, 0));
  g.add(T.box(w, h, 0.05, color, 0, y + h / 2 - 0.1, 0));
  g.position.set(x, 0, z);
  return g;
}

// serangga: lebah / capung / kepik (penanda musuh alami)
export function insectSwarm(T, o = {}) {
  const { n = 14, seed = 5, spread = 2.6, y0 = 1.0, color = '#f2c14e', size = 0.042 } = o;
  const r = rng(seed), g = new THREE.Group();
  const body = new THREE.SphereGeometry(size, 7, 5);
  const wing = new THREE.SphereGeometry(size * 0.95, 6, 4);
  const bodyM = T.mat(color, { flat: true }), wingM = new THREE.MeshBasicMaterial({ color: new THREE.Color('#e8f4ff'), transparent: true, opacity: 0.5 });
  for (let i = 0; i < n; i++) {
    const b = new THREE.Group();
    const c = new THREE.Mesh(body, bodyM);
    const w = new THREE.Mesh(wing, wingM);
    w.scale.set(1.25, 0.22, 0.75); w.position.y = size * 0.85;
    b.add(c, w);
    b.position.set((r() - 0.5) * spread * 2, y0 + r() * 0.8, (r() - 0.5) * spread);
    b.userData = { ph: r() * Math.PI * 2, sp: 0.5 + r() * 0.8, x0: b.position.x, y0: b.position.y, z0: b.position.z, amp: 0.25 + r() * 0.5 };
    g.add(b);
  }
  return g;
}

// helai daun berlubang (untuk beat "daun yang berlubang")
export function leafWithHole(T, size = 0.34) {
  const t = T.canvasTex(256, 256, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.fillStyle = '#4e7a2e';
    g.beginPath(); g.ellipse(w / 2, h / 2, w * 0.34, h * 0.46, -0.35, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#2f5220'; g.lineWidth = 5;
    g.beginPath(); g.moveTo(w * 0.28, h * 0.74); g.lineTo(w * 0.74, h * 0.26); g.stroke();
    g.globalCompositeOperation = 'destination-out';
    g.beginPath(); g.arc(w * 0.52, h * 0.44, w * 0.1, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.arc(w * 0.62, h * 0.58, w * 0.06, 0, Math.PI * 2); g.fill();
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({ map: t, transparent: true, side: THREE.DoubleSide }));
  return m;
}

// ---------- overlay 2D (digambar setelah pass 3D) ----------
export function banner(g, o = {}) {
  const { channel = 'JADI BEGINI', badge = 'CLIPS', lines = [], highlight = -1,
          y = V(64, 140), size = V(34, 52), alpha: a = 1 } = o;
  g.save(); g.globalAlpha *= a;
  const cx = E.W / 2, cy = y;
  const pw = Math.min(E.W * 0.88, size * 7.4), ph = size * 0.95;

  g.fillStyle = 'rgba(10,16,26,.6)';
  g.beginPath(); g.roundRect(cx - pw / 2, cy - ph / 2, pw, ph, ph * 0.42); g.fill();
  // ikon wajah kecil
  g.fillStyle = '#f4f0e6';
  g.beginPath(); g.arc(cx - pw / 2 + ph * 0.62, cy, ph * 0.28, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#151821';
  g.beginPath(); g.arc(cx - pw / 2 + ph * 0.56, cy - 3, ph * 0.045, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.arc(cx - pw / 2 + ph * 0.69, cy - 3, ph * 0.045, 0, Math.PI * 2); g.fill();
  // badge kuning
  const bw = size * 1.9;
  g.fillStyle = '#f4c22b';
  g.beginPath(); g.roundRect(cx + pw / 2 - bw - ph * 0.4, cy - ph * 0.3, bw, ph * 0.6, ph * 0.16); g.fill();
  text(g, channel, cx + size * 0.15, cy, { size: size * 0.56, color: '#f4f7ff', weight: 800, font: FONTS.title, align: 'center', base: 'middle', spacing: 1 });
  text(g, badge, cx + pw / 2 - bw / 2 - ph * 0.4, cy + 1, { size: size * 0.4, color: '#2b1a06', weight: 900, font: FONTS.title, align: 'center', base: 'middle' });

  let ly = cy + size * 1.9;
  const sz = size * 1.12;
  lines.forEach((ln, i) => {
    const hot = i === (highlight < 0 ? lines.length - 1 : highlight);
    g.save();
    g.font = `800 ${sz}px "${FONTS.title}"`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineWidth = sz * 0.2; g.strokeStyle = 'rgba(8,12,20,.9)'; g.lineJoin = 'round';
    g.strokeText(ln, E.W / 2, ly);
    g.fillStyle = hot ? '#ffd23f' : '#ffffff';
    g.fillText(ln, E.W / 2, ly);
    g.restore();
    ly += sz * 1.1;
  });
  g.restore();
  return ly;
}

export function statPill(g, str, x, y, o = {}) {
  const { size = V(28, 42), tone = '#f0b429', leader = true } = o;
  g.save();
  g.font = `900 ${size}px "${FONTS.title}"`;
  const w = g.measureText(str).width + size * 1.5, h = size * 1.45;
  if (leader) {
    g.strokeStyle = tone; g.lineWidth = size * 0.1;
    g.beginPath(); g.moveTo(x, y + h / 2); g.lineTo(x, y + h / 2 + size * 0.8); g.stroke();
  }
  g.fillStyle = tone;
  g.beginPath(); g.roundRect(x - w / 2, y - h / 2, w, h, h * 0.3); g.fill();
  g.strokeStyle = 'rgba(60,38,0,.45)'; g.lineWidth = 3; g.stroke();
  g.fillStyle = '#2a1a00'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(str, x, y + 2);
  g.restore();
}

export function keyword(g, str, y, o = {}) {
  const { size = V(44, 68), tone = '#ffd23f', sub = '' } = o;
  g.save();
  g.font = `900 ${size}px "${FONTS.title}"`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.lineWidth = size * 0.2; g.strokeStyle = 'rgba(8,12,20,.9)'; g.lineJoin = 'round';
  g.strokeText(str, E.W / 2, y); g.fillStyle = tone; g.fillText(str, E.W / 2, y);
  if (sub) {
    g.font = `800 ${size * 0.4}px "${FONTS.ui}"`; g.lineWidth = size * 0.1;
    g.strokeText(sub, E.W / 2, y + size * 0.8); g.fillStyle = '#eef3ff'; g.fillText(sub, E.W / 2, y + size * 0.8);
  }
  g.restore();
}

// subtitle burn-in gaya JadiBegini: putih tebal, kata kunci kuning, 4 kata per baris
export function subs(g, t, o = {}) {
  const words = E.words || []; if (!words.length) return;
  const { y = V(E.H - 150, 1525), size = V(54, 60), max = 4, hi = '#ffd23f' } = o;
  let i = -1;
  for (let k = words.length - 1; k >= 0; k--) if (t >= words[k].start - 0.06) { if (t <= words[k].end + 0.36) i = k; break; }
  if (i < 0) return;
  const st = Math.floor(i / max) * max, group = words.slice(st, st + max);
  const strs = group.map(w => w.word.trim().toUpperCase());
  g.save();
  g.font = `900 ${size}px "${FONTS.title}"`;
  const widths = strs.map(s => g.measureText(s).width);
  const gap = size * 0.42;
  let total = widths.reduce((a, b) => a + b, 0) + gap * (strs.length - 1);
  const k = Math.min(1, (E.W * 0.88) / total);
  const sz = size * k, gp = gap * k;
  total *= k;
  let x = E.W / 2 - total / 2;
  strs.forEach((s, n) => {
    const cur = st + n === i;
    const pop = cur ? 1 + 0.07 * ease.out(clamp((t - group[n].start) / 0.12)) : 1;
    g.save();
    g.translate(x + (widths[n] * k) / 2, y);
    g.scale(pop, pop);
    g.font = `900 ${sz}px "${FONTS.title}"`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineWidth = sz * 0.19; g.strokeStyle = 'rgba(6,10,16,.9)'; g.lineJoin = 'round';
    g.strokeText(s, 0, 0);
    g.fillStyle = cur ? hi : '#ffffff';
    g.fillText(s, 0, 0);
    g.restore();
    x += widths[n] * k + gp;
  });
  g.restore();
}

// proyeksi titik 3D -> koordinat kanvas logis (untuk leader pill)
export function project(stage, v3) {
  const p = v3.clone().project(stage.camera);
  return [(p.x * 0.5 + 0.5) * E.W, (-p.y * 0.5 + 0.5) * E.H];
}
