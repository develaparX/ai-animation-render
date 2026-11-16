import * as THREE from "three";

export function createPrecisionRenderer(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    preserveDrawingBuffer: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(width, height, false);
  renderer.setPixelRatio(1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  return renderer;
}

export function makeStarfield(count = 1600, radius = 220): THREE.Points {
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = ((i * 239996323) % 628318) / 100000;
    const u = (((i * 71993) % 2000) / 1000) - 1;
    const phi = Math.acos(Math.max(-1, Math.min(1, u)));
    const r = radius * (0.7 + ((i * 37) % 30) / 100);
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
    const tint = 0.72 + ((i * 13) % 28) / 100;
    col[i * 3] = i % 5 === 0 ? 1.0 : tint;
    col[i * 3 + 1] = tint;
    col[i * 3 + 2] = i % 3 === 0 ? 1.0 : tint;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  return new THREE.Points(
    geo,
    new THREE.PointsMaterial({ size: 0.75, vertexColors: true, transparent: true, opacity: 0.88 }),
  );
}

export function makeSolarTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  const grad = ctx.createLinearGradient(0, 0, 512, 256);
  grad.addColorStop(0, "#ea580c");
  grad.addColorStop(0.5, "#f59e0b");
  grad.addColorStop(1, "#dc2626");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 320; i++) {
    const x = (i * 197) % 512;
    const y = (i * 113) % 256;
    const r = 8 + (i % 24);
    const rg = ctx.createRadialGradient(x, y, 1, x, y, r);
    rg.addColorStop(0, i % 2 === 0 ? "rgba(254, 240, 138, 0.55)" : "rgba(154, 52, 18, 0.5)");
    rg.addColorStop(1, "rgba(234, 88, 12, 0)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function makeEarthTexture(scorched = false): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = scorched ? "#451a03" : "#1d4ed8";
  ctx.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 45; i++) {
    const x = (i * 137) % 512;
    const y = 30 + ((i * 89) % 196);
    const rw = 22 + (i % 45);
    const rh = 14 + (i % 26);
    ctx.fillStyle = scorched
      ? (i % 3 === 0 ? "#fb923c" : "#1c1917")
      : (i % 4 === 0 ? "#e2e8f0" : "#15803d");
    ctx.beginPath();
    ctx.ellipse(x, y, rw, rh, (i % 6) * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function makeWindowTexture(wallHex: string, winHex: string, cols = 6, rows = 14): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 512;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = wallHex;
  ctx.fillRect(0, 0, 256, 512);
  const pad = 12;
  const cw = (256 - pad * 2) / cols;
  const ch = (512 - pad * 2) / rows;
  for (let r = 0; r < rows; r++) {
    for (let col = 0; col < cols; col++) {
      const lit = (r * 11 + col * 17) % 5 === 0;
      ctx.fillStyle = lit ? "#fef08a" : winHex;
      ctx.fillRect(pad + col * cw + 3, pad + r * ch + 4, cw - 6, ch - 8);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function makeRoadTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#1f242d";
  ctx.fillRect(0, 0, 512, 512);
  ctx.fillStyle = "#4b5563";
  ctx.fillRect(0, 0, 74, 512);
  ctx.fillRect(438, 0, 74, 512);
  ctx.fillStyle = "#d1d5db";
  for (let x = 94; x < 420; x += 42) ctx.fillRect(x, 224, 24, 58);
  for (let y = 0; y < 512; y += 52) {
    if (y > 200 && y < 305) continue;
    ctx.fillRect(252, y, 8, 28);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
