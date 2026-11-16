import React, { useEffect, useRef } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { createPrecisionRenderer, makeEarthTexture, makeRoadTexture, makeStarfield, makeWindowTexture } from "../glUtils";
import { EditorialOverlay } from "../Overlay";
import t06 from "../timing_v06_rokok_paru.json";
import t07 from "../timing_v07_pil_tubuh.json";
import t08 from "../timing_v08_otak_bicara_negatif.json";
import t09 from "../timing_v09_orang_pendiam.json";
import t10 from "../timing_v10_procrastinate2.json";
import t11 from "../timing_v11_buah_obat.json";
import t12 from "../timing_v12_buah_sahabat.json";
import t13 from "../timing_v13_ai_cartoon.json";
import t14 from "../timing_v14_ai_story_moral.json";
import t15 from "../timing_v15_teknologi_ai.json";

const MAP: Record<string, any> = {
  v06_rokok_paru: t06, v07_pil_tubuh: t07, v08_otak_bicara_negatif: t08,
  v09_orang_pendiam: t09, v10_procrastinate2: t10, v11_buah_obat: t11,
  v12_buah_sahabat: t12, v13_ai_cartoon: t13, v14_ai_story_moral: t14,
  v15_teknologi_ai: t15,
};

// Palette per video for distinct cinematic moods
const PALETTES: Record<string, { bg: string; accent: string; glow: string; badge: string }> = {
  v06_rokok_paru: { bg: "#0b0a10", accent: "#fb7185", glow: "#ef4444", badge: "RESPIRASI" },
  v07_pil_tubuh: { bg: "#03181f", accent: "#67e8f9", glow: "#22d3ee", badge: "PERJALANAN PIL" },
  v08_otak_bicara_negatif: { bg: "#12041f", accent: "#c084fc", glow: "#a855f7", badge: "DIALOG BATIN" },
  v09_orang_pendiam: { bg: "#070c18", accent: "#93c5fd", glow: "#38bdf8", badge: "PENDIAM" },
  v10_procrastinate2: { bg: "#0b1010", accent: "#6ee7b7", glow: "#10b981", badge: "FOKUS vs JEDA" },
  v11_buah_obat: { bg: "#071309", accent: "#bef264", glow: "#4d7c0f", badge: "NUTRISI" },
  v12_buah_sahabat: { bg: "#100c04", accent: "#fcd34d", glow: "#f59e0b", badge: "PERSAHABATAN" },
  v13_ai_cartoon: { bg: "#0d0716", accent: "#f0abfc", glow: "#d946ef", badge: "AI ANIMATION" },
  v14_ai_story_moral: { bg: "#0c0a09", accent: "#fda4af", glow: "#f43f5e", badge: "KARAKTER" },
  v15_teknologi_ai: { bg: "#020617", accent: "#7dd3fc", glow: "#0ea5e9", badge: "CARA KERJA AI" },
};

const HOOKS: Record<string, string> = {
  v06_rokok_paru: "Baru sekali hisap, paru-parumu langsung berubah",
  v07_pil_tubuh: "Baru saja kamu telan pil itu",
  v08_otak_bicara_negatif: "Otakmu merekam semua kata-katamu sendiri",
  v09_orang_pendiam: "Orang pendiam otaknya bekerja lebih dalam",
  v10_procrastinate2: "Menunda bukan malas, otak lagi nyusun strategi",
  v11_buah_obat: "Buah sederhana ini bekerja seperti obat alami",
  v12_buah_sahabat: "Dua buah yang beda banget ini ternyata sahabatan",
  v13_ai_cartoon: "Kartun ini nyata sampai kamu lupa ini buatan AI",
  v14_ai_story_moral: "Satu tes kecil ini nunjukin karakter asli seseorang",
  v15_teknologi_ai: "Video yang kamu tonton ini disentuh AI",
};

const ENDCARDS: Record<string, string> = {
  v06_rokok_paru: "Tubuhmu selalu berusaha pulih — mulai hari ini",
  v07_pil_tubuh: "Ikuti dosis dan waktu minum yang tepat",
  v08_otak_bicara_negatif: "Ubah bahasamu, ubah jalur otakmu",
  v09_orang_pendiam: "Hargai jedanya — itu cara mereka peduli",
  v10_procrastinate2: "Kerja fokus, jeda sadar, balik lagi",
  v11_buah_obat: "Satu porsi buah tiap hari",
  v12_buah_sahabat: "Teman terbaik kadang yang paling beda",
  v13_ai_cartoon: "Ribuan keputusan kecil dalam 30 detik yang mulus",
  v14_ai_story_moral: "Dewasa itu berani bertanya dengan hormat",
  v15_teknologi_ai: "Kamu bahkan nggak sadar mana yang asli",
};

const vidMeta: Record<string, { label: string; value: string; sub: string }> = {
  v06_rokok_paru: { label: "SISTEM PERNAPASAN", value: "2 PARU-PARU", sub: "ASAP & OKSIGEN" },
  v07_pil_tubuh: { label: "PERJALANAN PIL", value: "0–6 JAM", sub: "LAMBUNG → DARAH" },
  v08_otak_bicara_negatif: { label: "JALUR SARAF", value: "PLASTISITAS", sub: "KATA → SIKAP" },
  v09_orang_pendiam: { label: "PROFIL KEPRIBADIAN", value: "PENGAMAT", sub: "JUJUR & SELEKTIF" },
  v10_procrastinate2: { label: "RITME KERJA", value: "FOKUS + JEDA", sub: "AGAR AWET SEHARIAN" },
  v11_buah_obat: { label: "NUTRISI HARIAN", value: "1 PORSI", sub: "SERAT & VITAMIN" },
  v12_buah_sahabat: { label: "DENGAN TEMAN", value: "LEWATI BADAI", sub: "TUMBUH BERSAMA" },
  v13_ai_cartoon: { label: "PROSES ANIMASI", value: "SKETSA → SUARA", sub: "LAYAR PENUH" },
  v14_ai_story_moral: { label: "UJIAN KARAKTER", value: "1 PERTANYAAN", sub: "HORMAT vs NURUT" },
  v15_teknologi_ai: { label: "DI BALIK LAYAR", value: "AI ASSIST", sub: "DIAM-DIAM MEMBANTU" },
};

function makeVideoComp(vid: string) {
  const timing: any = MAP[vid];
  const pal = PALETTES[vid];
  const SEGS = timing.segments;
  const BY: Record<string, any> = Object.fromEntries(SEGS.map((s: any) => [s.id, s]));

  const Comp: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();
    const t = frame / fps;

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ref = useRef<any>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const h = delayRender(`${vid}-init`);
      try {
        const renderer = createPrecisionRenderer(canvas, width, height);
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(pal.bg);
        scene.fog = new THREE.FogExp2(pal.bg, 0.0098);
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.2, 300);
        scene.add(new THREE.HemisphereLight("#e2e8f0", "#0f172a", 0.75));
        const key = new THREE.DirectionalLight("#ffffff", 2.0);
        key.position.set(14, 26, 18);
        key.castShadow = true;
        scene.add(key);
        const glow = new THREE.PointLight(pal.glow, 5.0, 120);
        glow.position.set(0, 8, -10);
        scene.add(glow);

        const stars = makeStarfield(900, 190);
        scene.add(stars);

        // Hero subject: MEDIUM orbiting mechanism (fits 720p frame, no fill)
        const coreGroup = new THREE.Group();
        const core = new THREE.Mesh(
          new THREE.SphereGeometry(2.4, 40, 40),
          new THREE.MeshStandardMaterial({ color: pal.glow, emissive: new THREE.Color(pal.glow), emissiveIntensity: 0.55, roughness: 0.25 }),
        );
        coreGroup.add(core);
        const halo = new THREE.Mesh(
          new THREE.TorusGeometry(3.9, 0.28, 18, 96),
          new THREE.MeshBasicMaterial({ color: pal.accent, transparent: true, opacity: 0.75 }),
        );
        halo.rotation.x = Math.PI / 2.4;
        coreGroup.add(halo);
        const halo2 = new THREE.Mesh(
          new THREE.TorusGeometry(5.3, 0.18, 18, 96),
          new THREE.MeshBasicMaterial({ color: pal.accent, transparent: true, opacity: 0.35 }),
        );
        halo2.rotation.x = Math.PI / 1.8;
        coreGroup.add(halo2);
        coreGroup.position.set(0, 3.5, -16);
        scene.add(coreGroup);

        // Beat particles: used as smoke / sparks / neurons / data depending on t
        const PN = 700;
        const pGeo = new THREE.BufferGeometry();
        const pPos = new Float32Array(PN * 3);
        const pSeed = new Float32Array(PN * 2);
        for (let i = 0; i < PN; i++) {
          pPos[i * 3] = (Math.sin(i * 12.9898) * 43758.5453 % 1) * 44 - 22;
          pPos[i * 3 + 1] = ((Math.sin(i * 78.233) * 12543.2) % 1) * 46 - 20;
          pPos[i * 3 + 2] = -Math.abs(((Math.sin(i * 37.7) * 9876.5) % 1) * 60);
          pSeed[i * 2] = (i * 37) % 100 / 100;
          pSeed[i * 2 + 1] = 0.4 + ((i * 53) % 60) / 100;
        }
        pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
        const points = new THREE.Points(
          pGeo,
          new THREE.PointsMaterial({ color: pal.accent, size: 0.32, transparent: true, opacity: 0.85 }),
        );
        scene.add(points);

        // Side panel wall BEHIND subject (cinematic depth, never blocking!)
        const cardTex = makeWindowTexture("#1e293b", pal.accent, 6, 14);
        const card = new THREE.Mesh(new THREE.BoxGeometry(11, 18, 1.2), new THREE.MeshStandardMaterial({ map: cardTex, roughness: 0.6 }));
        card.position.set(-7.5, 1.5, -14); // LEFT background wall
        card.rotation.y = 0.22;
        scene.add(card);
        const card2 = new THREE.Mesh(new THREE.BoxGeometry(11, 20, 1.2), new THREE.MeshStandardMaterial({ map: cardTex, roughness: 0.6 }));
        card2.position.set(7.8, 2.0, -18); // RIGHT background wall (further)
        card2.rotation.y = -0.2;
        scene.add(card2);

        ref.current = { renderer, scene, camera, coreGroup, stars, points, card, pSeed, pBase: pPos.slice(), key, glow };
      } finally {
        continueRender(h);
      }
      return () => { ref.current?.renderer.dispose(); ref.current = null; };
    }, [width, height]);

    useEffect(() => {
      const r = ref.current;
      if (!r) return;
      const h = delayRender(`${vid}-frame`);
      try {
        const ids = SEGS.map((s: any) => s.id);
        const starts: Record<string, number> = {};
        SEGS.forEach((s: any) => (starts[s.id] = s.start));
        const endT = timing.total_dur;

        // Determine active segment
        let active = ids[0];
        for (const id of ids) {
          if (t >= starts[id]) active = id;
        }
        const segIdx = ids.indexOf(active);
        const p = Math.min(1, Math.max(0, (t - starts[active]) / (SEGS[segIdx].dur || 1)));

        // 5-beat cinematic camera journey pulled BACK for proper framing
        const shake = (t < 4 ? 0.18 : 0.1 + (segIdx / ids.length) * 0.22);
        const sx = Math.sin(t * 47) * shake;
        const sy = Math.cos(t * 41) * shake * 0.8;
        const shots: Array<[number, number, number, number, number, number]> = [
          [-4.5, 3.5, 24, -1.5, 2.0, -12],   // dramatic push-in left (wide)
          [5, -1.5, 23, 1.5, 1.0, -12],      // sweep right low (wide)
          [0, 10, 20, 0, 2.5, -14],          // crane top-down (wide)
          [-8, 6, 18, -1, 3, -14],           // lateral wide glide
          [4, 2.5, 21, 1, 2, -12],           // settle front (wide)
          [0, 1, 23, 0, 2, -12],             // final pull (wide)
          [0, -2, 22, 0, 1, -12],
        ];
        const sIdx = Math.min(shots.length - 1, Math.floor((segIdx / Math.max(1, ids.length - 1)) * (shots.length - 1)));
        const c0 = shots[sIdx];
        const c1 = shots[Math.min(shots.length - 1, sIdx + 1)];
        const e = p * p * (3 - 2 * p);
        r.camera.position.set(
          c0[0] + (c1[0] - c0[0]) * e + sx,
          c0[1] + (c1[1] - c0[1]) * e + sy,
          c0[2] + (c1[2] - c0[2]) * e,
        );
        r.camera.lookAt(
          c0[3] + (c1[3] - c0[3]) * e,
          c0[4] + (c1[4] - c0[4]) * e,
          c0[5] + (c1[5] - c0[5]) * e,
        );

        // Core pulses harder on beats
        r.coreGroup.rotation.y = t * 0.35;
        r.coreGroup.rotation.x = Math.sin(t * 0.4) * 0.12;
        const pulse = 1 + 0.08 * Math.sin(t * 6) + (segIdx === ids.length - 1 ? 0.06 * Math.sin(t * 18) : 0);
        r.coreGroup.scale.setScalar(pulse);
        (r.glow as THREE.PointLight).intensity = 4 + Math.sin(t * 6) * 1.2;

        const pos: any = r.points.geometry.attributes.position;
        for (let i = 0; i < 700; i++) {
          const bx = r.pBase[i * 3];
          const by = r.pBase[i * 3 + 1];
          const bz = r.pBase[i * 3 + 2];
          const sd = r.pSeed[i * 2];
          const sp = r.pSeed[i * 2 + 1];
          pos.setX(i, bx + Math.sin(t * (1.1 + sd) + i) * 1.6);
          pos.setY(i, by + Math.cos(t * (0.9 + sp) + i * 0.7) * 1.2);
          pos.setZ(i, bz);
        }
        pos.needsUpdate = true;

        r.renderer.render(r.scene, r.camera);
      } finally {
        continueRender(h);
      }
    }, [t]);

    const lastSeg = SEGS[SEGS.length - 1];
    return (
      <AbsoluteFill style={{ backgroundColor: "#040814" }}>
        <Audio src={staticFile(`${vid}.mp3`)} />
        <canvas ref={canvasRef} width={width} height={height} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        <EditorialOverlay
          t={t}
          words={timing.words}
          hookHeadline={HOOKS[vid]}
          ctaHeadline={ENDCARDS[vid]}
          ctaStart={lastSeg.start}
          telemetryLabel={vidMeta[vid].label}
          telemetryValue={vidMeta[vid].value}
          telemetrySub={vidMeta[vid].sub}
          alarm={false}
        />
      </AbsoluteFill>
    );
  };

  return Comp;
}

export const V06Video = makeVideoComp("v06_rokok_paru");
export const V07Video = makeVideoComp("v07_pil_tubuh");
export const V08Video = makeVideoComp("v08_otak_bicara_negatif");
export const V09Video = makeVideoComp("v09_orang_pendiam");
export const V10Video = makeVideoComp("v10_procrastinate2");
export const V11Video = makeVideoComp("v11_buah_obat");
export const V12Video = makeVideoComp("v12_buah_sahabat");
export const V13Video = makeVideoComp("v13_ai_cartoon");
export const V14Video = makeVideoComp("v14_ai_story_moral");
export const V15Video = makeVideoComp("v15_teknologi_ai");
