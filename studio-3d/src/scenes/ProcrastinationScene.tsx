import React, { useEffect, useRef } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { createPrecisionRenderer } from "../glUtils";
import { EditorialOverlay } from "../Overlay";
import timing from "../timing_04_menunda.json";

const BY = Object.fromEntries(timing.segments.map((s) => [s.id, s]));

function makeCodeScreenTexture(solved: boolean): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 320;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#0b1220";
  ctx.fillRect(0, 0, 512, 320);

  // Header bar
  ctx.fillStyle = solved ? "#064e3b" : "#451a03";
  ctx.fillRect(0, 0, 512, 32);
  ctx.fillStyle = solved ? "#34d399" : "#fb923c";
  ctx.fillRect(16, 10, 140, 12);

  // Code lines
  const cols = solved ? ["#34d399", "#60a5fa", "#e2e8f0"] : ["#fb7185", "#fbbf24", "#94a3b8"];
  for (let r = 0; r < 11; r++) {
    const indent = (r % 4) * 20;
    const w = 80 + ((r * 67) % 240);
    ctx.fillStyle = cols[r % cols.length];
    ctx.fillRect(24 + indent, 48 + r * 22, w, 10);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const ProcrastinationVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ref = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    deskGroup: THREE.Group;
    monL: THREE.Mesh;
    monR: THREE.Mesh;
    texBusy: THREE.CanvasTexture;
    texSolved: THREE.CanvasTexture;
    brainGroup: THREE.Group;
    nodes: THREE.Mesh[];
    links: THREE.Mesh[];
    coreCrystal: THREE.Mesh;
    ideaParts: THREE.InstancedMesh;
    partSeeds: Array<{ ang: number; rad: number; y: number }>;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const h = delayRender("brain-init");
    try {
      const renderer = createPrecisionRenderer(canvas, width, height);
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#070b14");
      scene.fog = new THREE.FogExp2("#070b14", 0.015);

      const camera = new THREE.PerspectiveCamera(48, width / height, 0.2, 200);
      scene.add(new THREE.HemisphereLight("#bae6fd", "#0f172a", 0.7));
      const key = new THREE.DirectionalLight("#f8fafc", 1.6);
      key.position.set(10, 18, 14);
      scene.add(key);

      // Shot 1 & 5: Developer dual-monitor desk
      const deskGroup = new THREE.Group();
      const table = new THREE.Mesh(
        new THREE.BoxGeometry(14, 0.4, 7),
        new THREE.MeshStandardMaterial({ color: "#1e293b", roughness: 0.65 }),
      );
      table.position.y = -1.5;
      deskGroup.add(table);

      const texBusy = makeCodeScreenTexture(false);
      const texSolved = makeCodeScreenTexture(true);

      const monL = new THREE.Mesh(
        new THREE.BoxGeometry(5.6, 3.4, 0.2),
        new THREE.MeshBasicMaterial({ map: texBusy }),
      );
      monL.position.set(-3.1, 1.3, -1.6);
      monL.rotation.y = 0.22;
      deskGroup.add(monL);

      const monR = new THREE.Mesh(
        new THREE.BoxGeometry(5.6, 3.4, 0.2),
        new THREE.MeshBasicMaterial({ map: texBusy }),
      );
      monR.position.set(3.1, 1.3, -1.6);
      monR.rotation.y = -0.22;
      deskGroup.add(monR);

      const kbd = new THREE.Mesh(
        new THREE.BoxGeometry(3.8, 0.14, 1.3),
        new THREE.MeshStandardMaterial({ color: "#334155", roughness: 0.4 }),
      );
      kbd.position.set(0, -1.22, 0.6);
      deskGroup.add(kbd);

      const mug = new THREE.Mesh(
        new THREE.CylinderGeometry(0.45, 0.4, 0.9, 16),
        new THREE.MeshStandardMaterial({ color: "#f59e0b", roughness: 0.35 }),
      );
      mug.position.set(4.5, -0.85, 0.9);
      deskGroup.add(mug);
      scene.add(deskGroup);

      // Shot 2, 3, 4: 3D Neural Brain Network
      const brainGroup = new THREE.Group();
      const shell = new THREE.Mesh(
        new THREE.IcosahedronGeometry(7.2, 2),
        new THREE.MeshBasicMaterial({ color: "#1e3a8a", wireframe: true, transparent: true, opacity: 0.22 }),
      );
      brainGroup.add(shell);

      const nodeCoords: THREE.Vector3[] = [];
      const nodes: THREE.Mesh[] = [];
      for (let i = 0; i < 26; i++) {
        const phi = Math.acos(1 - (2 * (i + 0.5)) / 26);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        const rad = 2.6 + (i % 3) * 1.3;
        const pos = new THREE.Vector3(
          rad * Math.sin(phi) * Math.cos(theta),
          rad * Math.cos(phi) * 0.85,
          rad * Math.sin(phi) * Math.sin(theta),
        );
        nodeCoords.push(pos);
        const nm = new THREE.Mesh(
          new THREE.SphereGeometry(0.38, 16, 16),
          new THREE.MeshBasicMaterial({ color: "#38bdf8" }),
        );
        nm.position.copy(pos);
        brainGroup.add(nm);
        nodes.push(nm);
      }

      const links: THREE.Mesh[] = [];
      for (let i = 0; i < nodeCoords.length; i++) {
        for (let j = i + 1; j < nodeCoords.length; j++) {
          const dist = nodeCoords[i].distanceTo(nodeCoords[j]);
          if (dist < 4.5) {
            const lm = new THREE.Mesh(
              new THREE.CylinderGeometry(0.05, 0.05, dist, 6),
              new THREE.MeshBasicMaterial({ color: "#38bdf8", transparent: true, opacity: 0.45 }),
            );
            lm.position.copy(nodeCoords[i]).lerp(nodeCoords[j], 0.5);
            lm.quaternion.setFromUnitVectors(
              new THREE.Vector3(0, 1, 0),
              nodeCoords[j].clone().sub(nodeCoords[i]).normalize(),
            );
            brainGroup.add(lm);
            links.push(lm);
          }
        }
      }

      const coreCrystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(1.6, 0),
        new THREE.MeshStandardMaterial({
          color: "#fef08a",
          emissive: new THREE.Color("#f59e0b"),
          emissiveIntensity: 0.85,
          metalness: 0.3,
          roughness: 0.2,
        }),
      );
      coreCrystal.visible = false;
      brainGroup.add(coreCrystal);

      const ideaParts = new THREE.InstancedMesh(
        new THREE.BoxGeometry(0.24, 0.24, 0.24),
        new THREE.MeshBasicMaterial({ color: "#fde047" }),
        120,
      );
      const partSeeds = [];
      for (let i = 0; i < 120; i++) {
        partSeeds.push({
          ang: (i * 2.399) % (Math.PI * 2),
          rad: 3.5 + (i % 6) * 1.1,
          y: ((i % 11) - 5) * 0.9,
        });
      }
      brainGroup.add(ideaParts);
      brainGroup.visible = false;
      scene.add(brainGroup);

      ref.current = {
        renderer, scene, camera, deskGroup, monL, monR, texBusy, texSolved,
        brainGroup, nodes, links, coreCrystal, ideaParts, partSeeds,
      };
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
    const h = delayRender("brain-frame");
    try {
      const tOver = BY.overload.start;
      const tInc = BY.incubate.start;
      const tSpark = BY.spark.start;
      const tSolve = BY.solve.start;
      const tCta = BY.cta.start;

      r.deskGroup.visible = false;
      r.brainGroup.visible = false;
      r.coreCrystal.visible = false;
      r.ideaParts.visible = false;

      if (t < tOver) {
        // SHOT 1: Push-in onto dual-monitor developer desk
        const p = t / tOver;
        r.deskGroup.visible = true;
        (r.monL.material as THREE.MeshBasicMaterial).map = r.texBusy;
        (r.monR.material as THREE.MeshBasicMaterial).map = r.texBusy;
        r.camera.position.set(-1.5 + p * 1.5, 2.8 - p * 0.8, 12 - p * 4.5);
        r.camera.lookAt(0, 0.5, -1.5);
      } else if (t < tInc) {
        // SHOT 2: Macro dive into overheated orange/red prefrontal brain nodes
        const p = (t - tOver) / (tInc - tOver);
        r.brainGroup.visible = true;
        r.brainGroup.rotation.y = t * 0.35;
        r.nodes.forEach((n, idx) => {
          const hot = idx % 2 === 0;
          (n.material as THREE.MeshBasicMaterial).color.set(hot ? "#f97316" : "#ef4444");
          n.scale.setScalar(1 + 0.35 * Math.sin(t * 14 + idx));
        });
        r.links.forEach((l) => {
          (l.material as THREE.MeshBasicMaterial).color.set("#fb923c");
        });
        r.camera.position.set(0, 1.5, 13 - p * 4.5);
        r.camera.lookAt(0, 0, 0);
      } else if (t < tSpark) {
        // SHOT 3: Calm side orbit — cool cyan background neural pathways quietly lighting up
        const p = (t - tInc) / (tSpark - tInc);
        r.brainGroup.visible = true;
        r.brainGroup.rotation.y = t * 0.25;
        r.nodes.forEach((n, idx) => {
          (n.material as THREE.MeshBasicMaterial).color.set(idx % 3 === 0 ? "#67e8f9" : "#38bdf8");
          n.scale.setScalar(0.9 + 0.18 * Math.sin(t * 4 + idx));
        });
        r.links.forEach((l) => {
          (l.material as THREE.MeshBasicMaterial).color.set("#22d3ee");
        });
        r.camera.position.set(-10 + p * 20, 2.5, 10);
        r.camera.lookAt(0, 0, 0);
      } else if (t < tSolve) {
        // SHOT 4: Scattered idea particles snapping into glowing golden solution crystal!
        const p = (t - tSpark) / (tSolve - tSpark);
        r.brainGroup.visible = true;
        r.brainGroup.rotation.y = t * 0.5;
        r.coreCrystal.visible = true;
        r.coreCrystal.rotation.y = t * 2.2;
        r.coreCrystal.rotation.x = t * 1.1;
        r.coreCrystal.scale.setScalar(0.3 + p * 0.95);
        r.ideaParts.visible = true;
        const dmy = new THREE.Object3D();
        r.partSeeds.forEach((ps, idx) => {
          const rad = ps.rad * (1 - p * 0.85);
          const ang = ps.ang + t * 1.8;
          dmy.position.set(Math.cos(ang) * rad, ps.y * (1 - p * 0.8), Math.sin(ang) * rad);
          dmy.rotation.set(t * 2, t * 3, 0);
          dmy.updateMatrix();
          r.ideaParts.setMatrixAt(idx, dmy.matrix);
        });
        r.ideaParts.instanceMatrix.needsUpdate = true;
        r.camera.position.set(4 - p * 4, 1.5, 9 - p * 2.5);
        r.camera.lookAt(0, 0, 0);
      } else {
        // SHOT 5: Pullback to dual monitors turning emerald green (problem solved!)
        const p = (t - tSolve) / Math.max(1, timing.total_dur - tSolve);
        r.deskGroup.visible = true;
        (r.monL.material as THREE.MeshBasicMaterial).map = r.texSolved;
        (r.monR.material as THREE.MeshBasicMaterial).map = r.texSolved;
        r.camera.position.set(1.5 - p * 2.5, 1.5 + p * 1.2, 7.5 + p * 4.5);
        r.camera.lookAt(0, 0.5, -1.5);
      }

      r.renderer.render(r.scene, r.camera);
    } finally {
      continueRender(h);
    }
  }, [t]);

  let telLabel = "AKTIVITAS OTAK";
  let telVal = "MODE FOKUS";
  let telSub = "LAYAR PENUH KODE";
  let alarm = false;

  if (t >= BY.overload.start && t < BY.incubate.start) {
    const load = Math.round(interpolate(t, [BY.overload.start, BY.incubate.start], [72, 99], { extrapolateRight: "clamp" }));
    telLabel = "KORTIKS DEPAN";
    telVal = `beban ${load}%`;
    telSub = "MENTOK · OVERLOAD";
    alarm = true;
  } else if (t >= BY.incubate.start && t < BY.spark.start) {
    telLabel = "JARINGAN TENANG";
    telVal = "INKUBASI";
    telSub = "OTAK MENYAMBUNG DIAM-DIAM";
  } else if (t >= BY.spark.start && t < BY.solve.start) {
    telLabel = "SINAPSIS";
    telVal = "POLA KETEMU";
    telSub = "MOMEN AHA!";
    alarm = true;
  } else if (t >= BY.solve.start) {
    telLabel = "STATUS KERJA";
    telVal = "SOLUSI OK";
    telSub = "JEDA = LEBIH CEPAT";
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#070b14" }}>
      <Audio src={staticFile("04_menunda.mp3")} />
      <canvas ref={canvasRef} width={width} height={height} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      <EditorialOverlay
        t={t}
        words={timing.words}
        hookHeadline="Menunda kerja bukan berarti malas"
        ctaHeadline="Tim hajar langsung atau jeda dulu?"
        ctaStart={BY.cta.start}
        telemetryLabel={telLabel}
        telemetryValue={telVal}
        telemetrySub={telSub}
        alarm={alarm}
      />
    </AbsoluteFill>
  );
};
