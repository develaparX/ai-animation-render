import React, { useEffect, useRef } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { createPrecisionRenderer, makeRoadTexture, makeWindowTexture } from "../glUtils";
import { EditorialOverlay } from "../Overlay";
import timing from "../timing_03_petir.json";

const BY = Object.fromEntries(timing.segments.map((s) => [s.id, s]));

export const LightningVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ref = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    boltLight: THREE.PointLight;
    clouds: THREE.Mesh[];
    boltGroup: THREE.Group;
    shockRing: THREE.Mesh;
    rain: THREE.InstancedMesh;
    streetGroup: THREE.Group;
    bodyGroup: THREE.Group;
    nerves: THREE.Mesh[];
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const h = delayRender("storm-init");
    try {
      const renderer = createPrecisionRenderer(canvas, width, height);
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#0b1020");
      scene.fog = new THREE.FogExp2("#0b1020", 0.012);

      const camera = new THREE.PerspectiveCamera(50, width / height, 0.2, 300);
      scene.add(new THREE.HemisphereLight("#64748b", "#020617", 0.55));
      const key = new THREE.DirectionalLight("#93c5fd", 1.1);
      key.position.set(-15, 32, 18);
      scene.add(key);
      const boltLight = new THREE.PointLight("#e0f2fe", 0, 120);
      boltLight.position.set(0, 18, -12);
      scene.add(boltLight);

      // Street & dark storm skyline
      const streetGroup = new THREE.Group();
      const road = new THREE.Mesh(
        new THREE.PlaneGeometry(42, 130),
        new THREE.MeshStandardMaterial({ map: makeRoadTexture(), roughness: 0.22, metalness: 0.3 }),
      );
      road.rotation.x = -Math.PI / 2;
      streetGroup.add(road);

      const bTex = makeWindowTexture("#1e293b", "#334155", 5, 12);
      [[-14, -10, 26], [-15, -34, 34], [14, -12, 24], [15, -36, 36]].forEach(([x, z, bh]) => {
        const b = new THREE.Mesh(
          new THREE.BoxGeometry(11, bh, 12),
          new THREE.MeshStandardMaterial({ map: bTex, roughness: 0.6 }),
        );
        b.position.set(x, bh / 2, z);
        streetGroup.add(b);
      });

      // Street lamp pole target
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.24, 9, 10),
        new THREE.MeshStandardMaterial({ color: "#94a3b8", metalness: 0.8, roughness: 0.25 }),
      );
      pole.position.set(0, 4.5, -14);
      streetGroup.add(pole);

      // Storm clouds overhead
      const clouds: THREE.Mesh[] = [];
      const cGeo = new THREE.SphereGeometry(1, 16, 16);
      const cMat = new THREE.MeshStandardMaterial({ color: "#1e293b", roughness: 0.95 });
      for (let i = 0; i < 18; i++) {
        const cm = new THREE.Mesh(cGeo, cMat);
        cm.position.set(((i * 19) % 48) - 24, 24 + (i % 3) * 2.5, -10 - ((i * 11) % 35));
        cm.scale.set(9 + (i % 5), 3.6, 8);
        streetGroup.add(cm);
        clouds.push(cm);
      }

      // Jagged 3D lightning bolt chain
      const boltGroup = new THREE.Group();
      const segMat = new THREE.MeshBasicMaterial({ color: "#e0f2fe" });
      const pts = [
        [0, 26, -14], [-1.8, 21, -14], [1.4, 16, -14], [-1.2, 11, -14], [0.5, 6, -14], [0, 0, -14],
      ];
      for (let i = 0; i < pts.length - 1; i++) {
        const a = new THREE.Vector3(...pts[i]);
        const b = new THREE.Vector3(...pts[i + 1]);
        const len = a.distanceTo(b);
        const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, len, 8), segMat);
        seg.position.copy(a).lerp(b, 0.5);
        seg.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
        boltGroup.add(seg);
      }
      streetGroup.add(boltGroup);

      // Expanding thermal shockwave ring
      const shockRing = new THREE.Mesh(
        new THREE.TorusGeometry(1, 0.18, 16, 64),
        new THREE.MeshBasicMaterial({ color: "#67e8f9", transparent: true, opacity: 0.85 }),
      );
      shockRing.rotation.x = Math.PI / 2;
      shockRing.position.set(0, 1.5, -14);
      streetGroup.add(shockRing);

      // Rain streaks
      const rain = new THREE.InstancedMesh(
        new THREE.BoxGeometry(0.05, 1.8, 0.05),
        new THREE.MeshBasicMaterial({ color: "#bae6fd", transparent: true, opacity: 0.55 }),
        500,
      );
      streetGroup.add(rain);
      scene.add(streetGroup);

      // Shot 5 translucent human body + glowing neural electrical pathways
      const bodyGroup = new THREE.Group();
      const bodyMat = new THREE.MeshStandardMaterial({
        color: "#0ea5e9",
        transparent: true,
        opacity: 0.25,
        roughness: 0.2,
      });
      const head = new THREE.Mesh(new THREE.SphereGeometry(1.1, 24, 24), bodyMat);
      head.position.y = 4.2;
      bodyGroup.add(head);
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.0, 4.4, 20), bodyMat);
      torso.position.y = 1.1;
      bodyGroup.add(torso);

      const nerves: THREE.Mesh[] = [];
      const nerveMat = new THREE.MeshBasicMaterial({ color: "#67e8f9" });
      for (let i = 0; i < 8; i++) {
        const n = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.8 + (i % 3) * 0.6, 8), nerveMat);
        n.position.set((i % 2 === 0 ? 1 : -1) * (0.2 + (i % 3) * 0.35), 0.5 + i * 0.45, 0.6);
        n.rotation.z = (i % 2 === 0 ? -1 : 1) * (0.25 + (i % 4) * 0.2);
        bodyGroup.add(n);
        nerves.push(n);
      }
      bodyGroup.visible = false;
      scene.add(bodyGroup);

      ref.current = { renderer, scene, camera, boltLight, clouds, boltGroup, shockRing, rain, streetGroup, bodyGroup, nerves };
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
    const h = delayRender("storm-frame");
    try {
      const tCharge = BY.charge.start;
      const tStrike = BY.strike.start;
      const tShock = BY.shock.start;
      const tNerve = BY.nerve.start;
      const tCta = BY.cta.start;

      // Update rain streaks
      const dmy = new THREE.Object3D();
      for (let i = 0; i < 500; i++) {
        const x = ((i * 23) % 44) - 22;
        const y = 24 - ((t * 28 + i * 1.9) % 24);
        const z = ((i * 37) % 50) - 38;
        dmy.position.set(x, y, z);
        dmy.rotation.z = 0.14;
        dmy.updateMatrix();
        r.rain.setMatrixAt(i, dmy.matrix);
      }
      r.rain.instanceMatrix.needsUpdate = true;

      r.streetGroup.visible = true;
      r.bodyGroup.visible = false;
      r.boltGroup.visible = false;
      r.shockRing.visible = false;
      r.boltLight.intensity = 0.2;

      if (t < tCharge) {
        // SHOT 1: Dramatic upward tilt into storm clouds + flickering cloud lightning
        const p = t / tCharge;
        const flash = Math.sin(t * 22) > 0.72 ? 5.0 : 0.4;
        r.boltLight.intensity = flash;
        r.boltGroup.visible = flash > 2.0;
        r.camera.position.set(0, 3 + p * 2, 12 - p * 4);
        r.camera.lookAt(0, 18 + p * 4, -16);
      } else if (t < tStrike) {
        // SHOT 2: High-angle looking down toward wet street & target pole
        const p = (t - tCharge) / (tStrike - tCharge);
        r.camera.position.set(-6 + p * 4, 15 - p * 3, 12 - p * 8);
        r.camera.lookAt(0, 3, -14);
      } else if (t < tShock) {
        // SHOT 3: Main strike impact — bolt slams street + shockwave ring + violent shake
        const p = (t - tStrike) / (tShock - tStrike);
        const pulse = p < 0.35 ? 1 : Math.max(0, 1 - (p - 0.35) * 1.6);
        r.boltGroup.visible = p < 0.45;
        r.boltLight.intensity = 12.0 * pulse + 0.5;
        r.shockRing.visible = true;
        r.shockRing.scale.setScalar(1 + p * 22);
        const sx = Math.sin(t * 50) * 0.5 * pulse;
        r.camera.position.set(sx, 7.5, 4 - p * 6);
        r.camera.lookAt(0, 6, -14);
      } else if (t < tNerve) {
        // SHOT 4: Street-level tracking shot through heavy rain & thermal shockwave
        const p = (t - tShock) / (tNerve - tShock);
        r.shockRing.visible = true;
        r.shockRing.scale.setScalar(16 + p * 24);
        const sx = Math.sin(t * 42) * 0.35;
        r.camera.position.set(sx, 3.2, 2 - p * 12);
        r.camera.lookAt(0, 4.5, -24);
      } else if (t < tCta) {
        // SHOT 5: Macro dive into glowing 3D human nerve/electric circuit silhouette
        const p = (t - tNerve) / (tCta - tNerve);
        r.streetGroup.visible = false;
        r.bodyGroup.visible = true;
        r.nerves.forEach((n, idx) => {
          n.visible = ((Math.floor(t * 14) + idx) % 3) !== 0;
        });
        r.camera.position.set(Math.sin(p * 1.4) * 2.5, 2.2, 9.5 - p * 3.0);
        r.camera.lookAt(0, 2.1, 0);
      } else {
        // CTA pullback back into rain street
        const p = (t - tCta) / Math.max(1, timing.total_dur - tCta);
        r.camera.position.set(0, 5, 6 + p * 10);
        r.camera.lookAt(0, 8, -14);
      }

      r.renderer.render(r.scene, r.camera);
    } finally {
      continueRender(h);
    }
  }, [t]);

  const flashWhite =
    t >= BY.strike.start && t < BY.strike.start + 0.55
      ? interpolate(t, [BY.strike.start, BY.strike.start + 0.08, BY.strike.start + 0.55], [0, 0.9, 0], { extrapolateRight: "clamp" })
      : 0;

  let telLabel = "SUHU PLASMA PETIR";
  let telVal = "27.000 °C";
  let telSub = "5× PANAS MATAHARI";
  let alarm = false;

  if (t >= BY.charge.start && t < BY.strike.start) {
    const mv = Math.round(interpolate(t, [BY.charge.start, BY.strike.start], [15, 300], { extrapolateRight: "clamp" }));
    telLabel = "TEGANGAN AWAN";
    telVal = `${mv} jt volt`;
    telSub = "SIAP MENYAMBAR";
    alarm = true;
  } else if (t >= BY.strike.start && t < BY.nerve.start) {
    telLabel = "KECEPATAN ARUS";
    telVal = "100.000 km/dtk";
    telSub = "GELOMBANG KEJUT";
    alarm = true;
  } else if (t >= BY.nerve.start) {
    telLabel = "REAKSI TUBUH";
    telVal = "30.000 A";
    telSub = "SINYAL SARAF TERGANGGU";
    alarm = true;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b1020" }}>
      <Audio src={staticFile("03_petir.mp3")} />
      <canvas ref={canvasRef} width={width} height={height} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      <EditorialOverlay
        t={t}
        words={timing.words}
        hookHeadline="5x lebih panas dari Matahari"
        ctaHeadline="Pernah sedekat apa sama sambaran petir?"
        ctaStart={BY.cta.start}
        telemetryLabel={telLabel}
        telemetryValue={telVal}
        telemetrySub={telSub}
        alarm={alarm}
        flashWhite={flashWhite}
        dropletOpacity={t >= BY.charge.start ? 0.55 : 0.25}
      />
    </AbsoluteFill>
  );
};
