// scenes/shots/01_main.js — 9 shot 3D low-poly "Jadi Begini" hybrid untuk jb-refugia-pematang
// Acuan visual: thumbnail @JadiBeginiClip — karakter besar (dada ke atas) di tengah,
// sawah berair + pohon kelapa + gubuk low-poly di belakang, banner hook 3 baris (baris akhir kuning).
//
// Tata letak dunia (kamera di +z menghadap -z):
//   z  +0.0  pematang utama (karakter berdiri di atasnya, y = 0.26)
//   z  -1.6 .. -20  petak padi berair
//   z  -20   kelapa/tiang,  z -26 gubuk,  z -40 bukit
import { E, V, registerShot, mood, ease, clamp, lerp } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import * as G from '/engine/gh3d.js';

const SKY_DAY = ['#2f6fb8', '#7fb3dd', '#cfe4f2', '#f4ead2'];
const SKY_GOLD = ['#3c5c96', '#8fa6c4', '#eec49a', '#fbe2bc'];
const SKY_STORM = ['#4e5e80', '#7d8ea8', '#a8b6c6', '#ccd4dc'];
const SKY_NIGHT = ['#0e1730', '#1e2c50', '#3b4a72', '#6a6a86'];
const SKY_DUSK = ['#5a6a92', '#93a2bc', '#c8bcae', '#e8d4b0'];
const FACE = -Math.PI / 2;
const GY = 0.26;          // tinggi permukaan pematang (karakter berdiri di sini)

// ---------------------------------------------------------------- helpers
function shot(id, def) {
  const ov = def.overlay;
  registerShot(id, {
    ...def,
    overlay(g, t, info, s) {
      if (ov) ov(g, t, info, s);
      G.subs(g, info.globalT, { y: 1530, size: 58 });
    },
  });
}

function camAt(st, p, l, fov) {
  st.camera.position.set(p[0], p[1], p[2]);
  st.camera.lookAt(l[0], l[1], l[2]);
  st.camera.fov = fov;
  st.camera.updateProjectionMatrix();
}

// kamera dolly: dari z0 ke z1, sedikit geser x, tinggi & bidik konstan (framing karakter)
function push(st, t, dur, o = {}) {
  const k = ease.inOut(clamp(t / dur));
  const { x0 = 0, x1 = 0, z0 = 2.9, z1 = 2.45, ty = 1.24, lookX = 0, fov0 = 40, fov1 = 39 } = o;
  camAt(st, [lerp(x0, x1, k), ty, lerp(z0, z1, k)], [lookX, ty, 0], lerp(fov0, fov1, k));
}

// ---------------------------------------------------------------- dunia
function world(T, o = {}) {
  const moodName = o.moodName || 'day';
  const sky = o.sky || SKY_DAY;
  const M = mood(moodName);
  const st = T.stage({
    mood: moodName, fov: 40, sky,
    fog: o.fog || [34, 140], fogColor: o.fogColor || sky[2],
    keyPos: o.keyPos || [-12, 16, 10], keyIntensity: o.keyIntensity || 2.7, ambient: o.ambient || 1.25,
  });
  st.add(T.ground(120, 120, o.grass || M.grass));

  st.add(G.hills(T, { z: -46, h: 9, spread: 120, color: '#7d9c86', y: -1.4, count: 12, seed: 5 }));
  st.add(G.hills(T, { z: -30, h: 5.2, spread: 76, color: '#5e8068', y: -0.9, seed: 77 }));

  st.add(G.waterPlane(T, { w: 60, d: 34, z: -16, color: o.water || '#8fa8a4' }));
  st.add(G.bund(T, { w: 26, d: 1.4, z: 0.95 }));                        // pematang tempat karakter
  st.add(G.bund(T, { w: 26, d: 1.0, z: -1.8, color: '#4f422a', h: 0.24 })); // pematang bunga refugia
  st.add(G.bund(T, { w: 26, d: 0.8, z: -13, color: '#54462d', h: 0.22 }));

  st.add(G.coconut(T, -13, -26, 1.5), G.coconut(T, 14.5, -30, 1.35), G.coconut(T, -19, -34, 1.2));
  st.add(G.hut(T, -20, -32, 1.3));
  st.add(G.powerPole(T, 15, -22, 1.1));
  if (o.sun !== null) {
    const sun = o.sun || [-20, 11, -60];
    st.add(G.sunGlow(T, sun[0], sun[1], sun[2], 26, moodName === 'night' ? '#cfd8ff' : '#ffe3a8'));
  }
  return { st, M };
}

// bunga refugia di pematang: lapisan dekat (di depan kaki) + lapisan pematang
function refugiaFlowers(T, st, o = {}) {
  // deret utama di pematang dekat sawah (z -1.8) — kecil karena jauh dari lensa
  st.add(G.flowers(T, { n: o.n || 46, from: o.from || -6.5, to: o.to || 6.5, z: o.z || -1.8,
    y: o.y || 0.02, seed: o.seed || 61, tall: o.tall || 0.5 }));
  // deret kedua lebih jauh (pematang tengah) untuk kedalaman
  if (o.fg !== false) {
    st.add(G.flowers(T, { n: 30, from: -8, to: 8, z: -13, y: 0.02, seed: (o.seed || 61) + 7, tall: 0.55 }));
  }
}

function farmer(T, st, outfit, o = {}) {
  const f = G.person(T, outfit, { pose: o.pose || 'stand', s: o.s || 1 });
  f.position.set(o.x || 0, GY, o.z || 0);
  f.rotation.y = o.face === undefined ? FACE : o.face;
  st.add(f);
  return f;
}

// ============ 1 — hook ============
shot('s001', {
  kind: '3d',
  init(T) {
    const { st } = world(T, { moodName: 'golden', sky: SKY_GOLD, sun: [-20, 10, -60] });
    st.add(G.paddyField(T, { rows: 10, cols: 16, from: -6.8, z0: -1.0, seed: 3 }));
    refugiaFlowers(T, st, { n: 54, seed: 9 });
    return { st, stage: st, hero: farmer(T, st, G.FARMER, { x: 0.05, pose: 'relaxed' }) };
  },
  draw(s, t, info) {
    s.hero.setPose({ ...POSES.relaxed, head: [4, -207] });
    push(s.st, t, info.dur, { x0: 0.3, x1: 0.12, z0: 2.85, z1: 2.4, ty: 1.26, lookX: 0.05 });
  },
  overlay(g) {
    G.banner(g, {
      channel: 'JADI BEGINI', badge: 'CLIPS',
      lines: ['KENAPA PETANI INI', 'SENGAJA MENANAM BUNGA', 'DI PEMATANG SAWAH?'],
      highlight: 2, y: 130, size: 50,
    });
  },
});

// ============ 2 — juragan sebelah menertawakan ============
shot('s002', {
  kind: '3d',
  init(T) {
    const { st } = world(T, { moodName: 'day', sky: SKY_DAY, keyPos: [13, 16, 9] });
    st.add(G.paddyField(T, { rows: 10, cols: 16, from: -6.8, z0: -1.0, seed: 4 }));
    refugiaFlowers(T, st, { n: 44, seed: 13 });
    return {
      st, stage: st,
      darto: farmer(T, st, G.TENGKULAK, { x: -0.52, pose: 'explain', face: FACE + 0.4 }),
      hero: farmer(T, st, G.FARMER, { x: 0.58, pose: 'stand', face: FACE - 0.34 }),
    };
  },
  draw(s, t, info) {
    s.hero.setPose(POSES.stand);
    s['darto'].setPose({ ...POSES.explain, eF: [34, -170], hF: [62, -150], head: [6, -206] });
    push(s.st, t, info.dur, { x0: 0.02, x1: 0.06, z0: 4.0, z1: 3.6, ty: 1.22, lookX: 0.04, fov0: 46, fov1: 45 });
  },
});

// ============ 3 — senyum + daun berlubang ============
shot('s003', {
  kind: '3d',
  init(T) {
    const { st } = world(T, { moodName: 'golden', sky: SKY_GOLD, fog: [26, 110], sun: [-16, 10, -52] });
    st.add(G.paddyField(T, { rows: 9, cols: 14, from: -6.0, z0: -1.0, seed: 6 }));
    refugiaFlowers(T, st, { n: 40, seed: 17, fg: false });
    const leaf = G.leafWithHole(T, 0.62);
    leaf.position.set(-0.52, 1.36, 1.15);
    leaf.rotation.y = 0.25;
    st.add(leaf);
    return { st, stage: st, leaf, hero: farmer(T, st, G.FARMER, { x: 0.12, pose: 'point' }) };
  },
  draw(s, t, info) {
    s.hero.setPose({ ...POSES.point, eF: [16, -152], hF: [-34, -170], head: [4, -206] });
    s.leaf.rotation.z = Math.sin(t * 1.2) * 0.07;
    s.leaf.position.y = 1.36 + Math.sin(t * 1.6) * 0.025;
    push(s.st, t, info.dur, { x0: 0.2, x1: 0.14, z0: 2.7, z1: 2.35, ty: 1.3, lookX: 0.05, fov0: 40, fov1: 39 });
  },
  overlay(g, t, info) {
    const a = clamp((t - 0.3) / 0.45) * clamp((info.dur - t) / 0.4);
    if (a <= 0) return;
    g.save(); g.globalAlpha *= a;
    G.keyword(g, 'DAUN BERLUBANG', 1290, { size: 50, tone: '#ffd23f', sub: 'TANDA HAMA SUDAH MAKAN' });
    g.restore();
  },
});

// ============ 4 — wereng menyerang sawah Darto ============
shot('s004', {
  kind: '3d',
  init(T) {
    const { st } = world(T, {
      moodName: 'day', sky: SKY_DUSK, fog: [30, 130], fogColor: '#c9b8a8',
      keyPos: [-8, 12, 10], keyIntensity: 2.2, ambient: 1.5,
      water: '#8a9090', grass: '#6b7a52', sun: [-18, 3.2, -55],
    });
    st.add(G.paddyField(T, { rows: 11, cols: 16, from: -6.8, z0: -1.0, seed: 8, sick: 0.9, h: 0.5,
      color: '#8f8a3a', sickColor: '#a08a34' }));
    const bugs = G.insectSwarm(T, { n: 40, seed: 17, spread: 3.4, y0: 1.0, color: '#2f2a1e', size: 0.04 });
    st.add(bugs);
    return { st, stage: st, bugs, dart: farmer(T, st, G.TENGKULAK, { x: 0.1, pose: 'sad', face: FACE + 0.15 }) };
  },
  draw(s, t, info) {
    s.bugs.children.forEach(b => {
      const u = b.userData;
      b.position.x = u.x0 + Math.sin(t * u.sp + u.ph) * u.amp;
      b.position.z = u.z0 + Math.cos(t * u.sp * 0.8 + u.ph) * u.amp * 0.7;
      b.position.y = u.y0 + Math.sin(t * 2.1 + u.ph) * 0.12;
    });
    s.dart.setPose(POSES.sad);
    push(s.st, t, info.dur, { x0: -0.1, x1: 0.12, z0: 2.95, z1: 2.5, ty: 1.22, lookX: 0.1 });
  },
});

// ============ 5 — sawah berbunga tetap hijau ============
shot('s005', {
  kind: '3d',
  init(T) {
    const { st } = world(T, { moodName: 'day', sky: SKY_DAY, keyPos: [12, 16, 10], ambient: 1.35, water: '#8fb2a6' });
    st.add(G.paddyField(T, { rows: 11, cols: 16, from: -6.8, z0: -1.0, seed: 12 }));
    refugiaFlowers(T, st, { n: 60, seed: 21 });
    return { st, stage: st, hero: farmer(T, st, G.FARMER, { x: 0.9, pose: 'cheer', face: FACE - 0.18 }) };
  },
  draw(s, t, info) {
    s.hero.setPose(POSES.cheer);
    push(s.st, t, info.dur, { x0: 1.15, x1: 0.85, z0: 3.1, z1: 2.65, ty: 1.24, lookX: 0.9 });
  },
  overlay(g, t, info) {
    const a = clamp((t - 0.4) / 0.45) * clamp((info.dur - t) / 0.45);
    if (a <= 0) return;
    g.save(); g.globalAlpha *= a;
    G.keyword(g, 'TETAP HIJAU', 1290, { size: 56, tone: '#9ee85a', sub: 'NOL PETAK ROBOH' });
    g.restore();
  },
});

// ============ 6 — REFUGIA ============
shot('s006', {
  kind: '3d',
  init(T) {
    const { st } = world(T, { moodName: 'golden', sky: SKY_GOLD, fog: [22, 96], sun: [-14, 8, -44] });
    st.add(G.paddyField(T, { rows: 9, cols: 14, from: -6.0, z0: -1.0, seed: 15 }));
    refugiaFlowers(T, st, { n: 76, seed: 24, tall: 0.62, fg: false });
    return { st, stage: st };
  },
  draw(s, t, info) {
    const k = ease.inOut(clamp(t / info.dur));
    camAt(s.st, [lerp(0.9, 0.35, k), 1.05, lerp(1.6, 1.15, k)], [lerp(-0.3, -0.1, k), 0.72, -1.9],
      lerp(40, 38, k));
  },
  overlay(g, t, info) {
    const a = clamp((t - 0.15) / 0.5) * clamp((info.dur - t) / 0.45);
    if (a <= 0) return;
    g.save(); g.globalAlpha *= a;
    G.keyword(g, 'REFUGIA', 400, { size: 96, tone: '#ffd23f', sub: 'RUMAH MUSUH ALAMI HAMA' });
    g.restore();
  },
});

// ============ 7 — lebah, capung, kepik datang ============
shot('s007', {
  kind: '3d',
  init(T) {
    const { st } = world(T, { moodName: 'golden', sky: SKY_GOLD, fog: [26, 110] });
    st.add(G.paddyField(T, { rows: 10, cols: 15, from: -6.4, z0: -1.0, seed: 18 }));
    refugiaFlowers(T, st, { n: 64, seed: 31, tall: 0.58, fg: false });
    return {
      st, stage: st,
      a: G.insectSwarm(T, { n: 28, seed: 41, spread: 3.2, y0: 1.15, color: '#f2c14e', size: 0.05 }),
      b: G.insectSwarm(T, { n: 9, seed: 43, spread: 2.4, y0: 1.5, color: '#5fd3ef', size: 0.062 }),
      c: G.insectSwarm(T, { n: 14, seed: 47, spread: 2.8, y0: 0.95, color: '#e2603f', size: 0.045 }),
    };
  },
  draw(s, t, info) {
    for (const k of ['a', 'b', 'c']) s[k].children.forEach(b => {
      const u = b.userData;
      b.position.x = u.x0 + Math.sin(t * u.sp * 0.9 + u.ph) * u.amp * 1.3;
      b.position.z = u.z0 + Math.cos(t * u.sp * 0.7 + u.ph) * u.amp;
      b.position.y = u.y0 + Math.sin(t * 1.9 + u.ph) * 0.14;
      b.rotation.y = t * u.sp;
    });
    const k = ease.inOut(clamp(t / info.dur));
    camAt(s.st, [lerp(-0.4, 0.25, k), 1.15, lerp(1.9, 1.35, k)], [lerp(-0.4, 0.05, k), 0.95, -1.8], lerp(40, 38, k));
  },
  overlay(g, t, info) {
    const a = clamp((t - 0.6) / 0.5) * clamp((info.dur - t) / 0.45);
    if (a <= 0) return;
    g.save(); g.globalAlpha *= a;
    G.keyword(g, 'MUSUH ALAMI', 1285, { size: 54, tone: '#ffd23f', sub: 'LEBAH · CAPUNG · KEPIK · LABA-LABA' });
    g.restore();
  },
});

// ============ 8 — bunga dulu, padi kemudian ============
shot('s008', {
  kind: '3d',
  init(T) {
    const { st } = world(T, { moodName: 'day', sky: SKY_DAY, keyPos: [12, 15, 10], ambient: 1.3 });
    st.add(G.paddyField(T, { rows: 10, cols: 15, from: -6.2, z0: -2.4, seed: 22, h: 0.26 }));
    st.add(G.flowers(T, { n: 68, from: -6.4, to: 6.4, z: -1.8, y: 0.02, seed: 35, tall: 0.52 }));
    const board = G.signBoard(T, { x: 1.9, z: 0.9, y: 1.6, w: 1.8, h: 1.0, color: '#f3ecd8' });
    board.rotation.y = -0.42;
    st.add(board);
    return { st, stage: st, board, hero: farmer(T, st, G.FARMER2, { x: -0.5, pose: 'explain', face: FACE + 0.26 }) };
  },
  draw(s, t, info) {
    s.hero.setPose({ ...POSES.explain, eF: [26, -160], hF: [48, -188], head: [5, -207] });
    push(s.st, t, info.dur, { x0: -0.3, x1: 0.0, z0: 3.2, z1: 2.75, ty: 1.26, lookX: -0.15, fov0: 42, fov1: 41 });
  },
  overlay(g, t, info) {
    const a = clamp((t - 0.35) / 0.45) * clamp((info.dur - t) / 0.45);
    if (a <= 0) return;
    g.save(); g.globalAlpha *= a;
    G.keyword(g, 'BUNGA DULU, PADI KEMUDIAN', 1295, { size: 38, tone: '#ffffff', sub: 'ATURAN PENYULUH PERTANIAN' });
    g.restore();
  },
});

// ============ 9 — payoff: pagar hidup ============
shot('s009', {
  kind: '3d',
  init(T) {
    const { st } = world(T, { moodName: 'golden', sky: SKY_GOLD, keyPos: [-14, 15, 11], ambient: 1.25, sun: [-22, 9, -58] });
    st.add(G.paddyField(T, { rows: 11, cols: 16, from: -6.8, z0: -1.0, seed: 27 }));
    refugiaFlowers(T, st, { n: 84, seed: 44, tall: 0.6 });
    return {
      st, stage: st,
      a: farmer(T, st, G.FARMER, { x: -0.56, pose: 'cheer', face: FACE - 0.2 }),
      b: farmer(T, st, G.FARMER2, { x: 0.6, pose: 'wave', face: FACE + 0.2 }),
    };
  },
  draw(s, t, info) {
    s.a.setPose(POSES.cheer);
    s.b.setPose(POSES.wave);
    push(s.st, t, info.dur, { x0: 0.0, x1: 0.02, z0: 4.1, z1: 3.7, ty: 1.24, lookX: 0.02, fov0: 46, fov1: 45 });
  },
  overlay(g, t) {
    const a = clamp((t - 0.45) / 0.55);
    if (a <= 0) return;
    g.save(); g.globalAlpha *= a;
    G.keyword(g, 'PAGAR HIDUP', 1280, { size: 64, tone: '#ffd23f', sub: 'BUKAN BUANG TEMPAT' });
    g.restore();
  },
});
