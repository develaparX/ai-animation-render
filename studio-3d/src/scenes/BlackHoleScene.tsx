import React, { useEffect, useRef } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { createPrecisionRenderer, makeEarthTexture, makeStarfield } from "../glUtils";
import { EditorialOverlay } from "../Overlay";
import timing from "../timing_02_lubang_hitam.json";

const BY = Object.fromEntries(timing.segments.map((s) => [s.id, s]));

export const BlackHoleVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ref = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    stars: THREE.Points;
    bhGroup: THREE.Group;
    diskRings: THREE.Mesh[];
    probeGroup: THREE.Group;
    earthDist: THREE.Mesh;
    streaks: THREE.InstancedMesh;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const h = delayRender("bh-init");
    try {
      const renderer = createPrecisionRenderer(canvas, width, height);
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#020308");
      scene.fog = new THREE.FogExp2("#020308", 0.002);

      const camera = new THREE.PerspectiveCamera(50, width / height, 0.2, 500);
      scene.add(new THREE.HemisphereLight("#fed7aa", "#0f172a", 0.6));
      const key = new THREE.DirectionalLight("#ffedd5", 2.2);
      key.position.set(18, 22, 18);
      scene.add(key);
      const bhGlow = new THREE.PointLight("#f97316", 6.0, 140);
      scene.add(bhGlow);

      const stars = makeStarfield(2000, 240);
      scene.add(stars);

      // Black Hole + Lensing Halo + Multi-Ring Accretion Disk
      const bhGroup = new THREE.Group();
      const horizon = new THREE.Mesh(
        new THREE.SphereGeometry(6.5, 48, 48),
        new THREE.MeshBasicMaterial({ color: "#000000" }),
      );
      bhGroup.add(horizon);

      // Photon sphere thin bright rim
      const photonRim = new THREE.Mesh(
        new THREE.TorusGeometry(6.75, 0.18, 24, 96),
        new THREE.MeshBasicMaterial({ color: "#fef3c7" }),
      );
      bhGroup.add(photonRim);

      // Lensed vertical arc (interstellar style top/bottom warp)
      const lensArc = new THREE.Mesh(
        new THREE.TorusGeometry(8.5, 0.55, 20, 96),
        new THREE.MeshBasicMaterial({ color: "#fb923c", transparent: true, opacity: 0.72 }),
      );
      bhGroup.add(lensArc);

      const diskRings: THREE.Mesh[] = [];
      const diskSpecs = [
        { r: 10.5, tube: 0.75, col: "#fef08a", op: 0.92 },
        { r: 13.5, tube: 1.05, col: "#f97316", op: 0.78 },
        { r: 17.2, tube: 1.25, col: "#ea580c", op: 0.58 },
        { r: 21.5, tube: 1.4, col: "#9a3412", op: 0.36 },
      ];
      diskSpecs.forEach((ds) => {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(ds.r, ds.tube, 18, 96),
          new THREE.MeshBasicMaterial({ color: ds.col, transparent: true, opacity: ds.op }),
        );
        ring.rotation.x = Math.PI / 2 - 0.22;
        bhGroup.add(ring);
        diskRings.push(ring);
      });
      scene.add(bhGroup);

      // Sleek 3D Space Probe
      const probeGroup = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.85, 1.15, 4.4, 16),
        new THREE.MeshStandardMaterial({ color: "#cbd5e1", metalness: 0.75, roughness: 0.28 }),
      );
      body.rotation.x = Math.PI / 2;
      probeGroup.add(body);
      const nose = new THREE.Mesh(
        new THREE.ConeGeometry(0.85, 1.8, 16),
        new THREE.MeshStandardMaterial({ color: "#f8fafc", metalness: 0.5, roughness: 0.3 }),
      );
      nose.rotation.x = -Math.PI / 2;
      nose.position.z = -3.1;
      probeGroup.add(nose);
      const wingMat = new THREE.MeshStandardMaterial({ color: "#1e3a8a", metalness: 0.4, roughness: 0.35 });
      const wL = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.1, 1.8), wingMat);
      wL.position.set(-2.9, 0, 0.3);
      probeGroup.add(wL);
      const wR = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.1, 1.8), wingMat);
      wR.position.set(2.9, 0, 0.3);
      probeGroup.add(wR);
      const thruster = new THREE.Mesh(
        new THREE.SphereGeometry(0.65, 16, 16),
        new THREE.MeshBasicMaterial({ color: "#38bdf8" }),
      );
      thruster.position.z = 2.4;
      probeGroup.add(thruster);
      scene.add(probeGroup);

      // Distant spinning Earth (for time dilation comparison shot)
      const earthDist = new THREE.Mesh(
        new THREE.SphereGeometry(2.6, 36, 36),
        new THREE.MeshStandardMaterial({ map: makeEarthTexture(false), roughness: 0.55 }),
      );
      scene.add(earthDist);

      // Stretched relativistic light streaks
      const sGeo = new THREE.BoxGeometry(0.14, 0.14, 6.5);
      const sMat = new THREE.MeshBasicMaterial({ color: "#fed7aa", transparent: true, opacity: 0.75 });
      const streaks = new THREE.InstancedMesh(sGeo, sMat, 300);
      const dmy = new THREE.Object3D();
      for (let i = 0; i < 300; i++) {
        const ang = (i * 2.399) % (Math.PI * 2);
        const rad = 8 + (i % 24) * 1.4;
        dmy.position.set(Math.cos(ang) * rad, Math.sin(ang) * rad, -((i * 11) % 90));
        dmy.updateMatrix();
        streaks.setMatrixAt(i, dmy.matrix);
      }
      streaks.instanceMatrix.needsUpdate = true;
      streaks.visible = false;
      scene.add(streaks);

      ref.current = { renderer, scene, camera, stars, bhGroup, diskRings, probeGroup, earthDist, streaks };
    } finally {
      continueRender(h);
    }
    return () => {
      ref.current?.renderer.dispose();
      ref.current = null;
    };
  }, [width, height]);

  useEffect(() => {
    const r = ref.current;
    if (!r) return;
    const h = delayRender("bh-frame");
    try {
      const tOrbit = BY.orbit.start;
      const tDil = BY.dilation.start;
      const tLens = BY.lens.start;
      const tTunnel = BY.tunnel.start;
      const tCta = BY.cta.start;

      r.diskRings.forEach((ring, idx) => {
        ring.rotation.z = t * (0.9 - idx * 0.15);
      });
      r.stars.rotation.y = t * 0.02;
      r.probeGroup.visible = false;
      r.earthDist.visible = false;
      r.streaks.visible = false;
      r.bhGroup.visible = true;
      r.bhGroup.position.set(0, 0, -18);

      if (t < tOrbit) {
        // SHOT 1: Dramatic orbital push-in onto glowing accretion disk
        const p = t / tOrbit;
        r.camera.position.set(6 - p * 4, 5 - p * 2, 22 - p * 12);
        r.camera.lookAt(0, 0, -18);
      } else if (t < tDil) {
        // SHOT 2: Over-the-shoulder tracking of probe spiraling toward black hole
        const p = (t - tOrbit) / (tDil - tOrbit);
        r.probeGroup.visible = true;
        r.probeGroup.position.set(-3.5 + p * 2.5, -1.5 + p * 0.6, 5 - p * 9);
        r.probeGroup.rotation.set(0.1, -0.35, 0.2 * Math.sin(t * 1.5));
        r.camera.position.set(-7 + p * 2, 1.5, 11 - p * 9);
        r.camera.lookAt(0, 0, -16);
      } else if (t < tLens) {
        // SHOT 3: Time dilation shot — distant Earth spinning rapidly while probe freezes in amber glow
        const p = (t - tDil) / (tLens - tDil);
        r.probeGroup.visible = true;
        r.probeGroup.position.set(-2.5, -1.5, 1);
        r.probeGroup.rotation.set(0.05, -0.5, 0.08);
        r.earthDist.visible = true;
        r.earthDist.position.set(5.5, 4.5, -12);
        r.earthDist.rotation.y = t * 14.0; // Earth spins wildly fast!
        r.camera.position.set(-5 + p * 2, 0.5, 9);
        r.camera.lookAt(1, 1.2, -10);
      } else if (t < tTunnel) {
        // SHOT 4: Low-angle sweep skimming the curved photon ring & accretion glow
        const p = (t - tLens) / (tTunnel - tLens);
        r.camera.position.set(-14 + p * 22, -2.5 + p * 5, -2 - p * 6);
        r.camera.lookAt(0, 0, -18);
      } else if (t < tCta) {
        // SHOT 5: First-person relativistic light-streak plunge into horizon
        const p = (t - tTunnel) / (tCta - tTunnel);
        r.streaks.visible = true;
        r.streaks.position.z = (p * 70) % 45;
        r.camera.position.set(Math.sin(t * 25) * 0.18, Math.cos(t * 21) * 0.18, 6 - p * 16);
        r.camera.lookAt(0, 0, -25);
      } else {
        // CTA pullback from quiet event horizon
        const p = (t - tCta) / Math.max(1, timing.total_dur - tCta);
        r.camera.position.set(0, 2, 4 + p * 18);
        r.camera.lookAt(0, 0, -18);
      }

      r.renderer.render(r.scene, r.camera);
    } finally {
      continueRender(h);
    }
  }, [t]);

  let telLabel = "DILATASI WAKTU";
  let telVal = "1 dtk : 7 thn";
  let telSub = "TEPI LUBANG HITAM";
  let alarm = false;

  if (t >= BY.dilation.start && t < BY.lens.start) {
    const yrs = Math.round(interpolate(t, [BY.dilation.start, BY.lens.start], [1, 35], { extrapolateRight: "clamp" }));
    telLabel = "WAKTU DI BUMI";
    telVal = `+${yrs} tahun`;
    telSub = "JAM PESAWAT: 00:05";
    alarm = true;
  } else if (t >= BY.lens.start && t < BY.tunnel.start) {
    telLabel = "LENSA GRAVITASI";
    telVal = "CAHAYA MELENGKUNG";
    telSub = "MEDAN EKSTREM";
    alarm = true;
  } else if (t >= BY.tunnel.start) {
    telLabel = "HORIZON PERISTIWA";
    telVal = "TITIK TANPA BALIK";
    telSub = "KECEPATAN LEPAS > C";
    alarm = true;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#020308" }}>
      <Audio src={staticFile("02_lubang_hitam.mp3")} />
      <canvas ref={canvasRef} width={width} height={height} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      <EditorialOverlay
        t={t}
        words={timing.words}
        hookHeadline="1 detik di sini = 7 tahun di Bumi"
        ctaHeadline="Siapa yang mau kamu temui 100 tahun lagi?"
        ctaStart={BY.cta.start}
        telemetryLabel={telLabel}
        telemetryValue={telVal}
        telemetrySub={telSub}
        alarm={alarm}
      />
    </AbsoluteFill>
  );
};
