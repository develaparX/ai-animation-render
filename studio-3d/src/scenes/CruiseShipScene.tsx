import React, { useEffect, useRef } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { createPrecisionRenderer, makeStarfield, makeWindowTexture } from "../glUtils";
import { EditorialOverlay } from "../Overlay";
import timing from "../timing_05_kapal_pesiar.json";

const BY = Object.fromEntries(timing.segments.map((s) => [s.id, s]));

export const CruiseShipVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ref = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    oceanGeo: THREE.PlaneGeometry;
    oceanBasePos: Float32Array;
    oceanMesh: THREE.Mesh;
    shipGroup: THREE.Group;
    bubbles: THREE.InstancedMesh;
    tinyDot: THREE.Mesh;
    searchCone: THREE.Mesh;
    stars: THREE.Points;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const h = delayRender("cruise-init");
    try {
      const renderer = createPrecisionRenderer(canvas, width, height);
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#030814");
      scene.fog = new THREE.FogExp2("#030814", 0.012);

      const camera = new THREE.PerspectiveCamera(52, width / height, 0.2, 300);
      scene.add(new THREE.HemisphereLight("#38bdf8", "#020617", 0.45));
      const moon = new THREE.DirectionalLight("#93c5fd", 0.9);
      moon.position.set(-20, 40, 20);
      scene.add(moon);

      const stars = makeStarfield(1400, 200);
      scene.add(stars);

      // Animated 3D ocean surface
      const oceanGeo = new THREE.PlaneGeometry(240, 240, 48, 48);
      oceanGeo.rotateX(-Math.PI / 2);
      const oceanBasePos = new Float32Array(oceanGeo.attributes.position.array);
      const oceanMesh = new THREE.Mesh(
        oceanGeo,
        new THREE.MeshStandardMaterial({ color: "#062c43", roughness: 0.22, metalness: 0.35 }),
      );
      scene.add(oceanMesh);

      // Giant illuminated 10-deck Cruise Ship
      const shipGroup = new THREE.Group();
      const hull = new THREE.Mesh(
        new THREE.BoxGeometry(14, 7, 46),
        new THREE.MeshStandardMaterial({ color: "#e2e8f0", roughness: 0.4 }),
      );
      hull.position.y = 3.2;
      shipGroup.add(hull);

      const cabinTex = makeWindowTexture("#f8fafc", "#fef08a", 12, 6);
      const upperDecks = new THREE.Mesh(
        new THREE.BoxGeometry(12.5, 9, 40),
        new THREE.MeshStandardMaterial({ map: cabinTex, emissive: new THREE.Color("#fef08a"), emissiveMap: cabinTex, emissiveIntensity: 0.45 }),
      );
      upperDecks.position.y = 11.0;
      shipGroup.add(upperDecks);

      const funnel = new THREE.Mesh(
        new THREE.CylinderGeometry(1.6, 2.2, 4.5, 12),
        new THREE.MeshStandardMaterial({ color: "#0284c7" }),
      );
      funnel.position.set(0, 17.5, -8);
      shipGroup.add(funnel);

      const shipLight = new THREE.PointLight("#fef08a", 3.5, 70);
      shipLight.position.set(0, 12, 24);
      shipGroup.add(shipLight);
      scene.add(shipGroup);

      // Underwater bubbles
      const bubbles = new THREE.InstancedMesh(
        new THREE.SphereGeometry(0.18, 10, 10),
        new THREE.MeshBasicMaterial({ color: "#bae6fd", transparent: true, opacity: 0.65 }),
        240,
      );
      bubbles.visible = false;
      scene.add(bubbles);

      // Single tiny human distress dot for aerial search scale shot
      const tinyDot = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 16, 16),
        new THREE.MeshBasicMaterial({ color: "#f97316" }),
      );
      tinyDot.visible = false;
      scene.add(tinyDot);

      // Sweeping searchlight cone
      const searchCone = new THREE.Mesh(
        new THREE.ConeGeometry(8, 36, 24, 1, true),
        new THREE.MeshBasicMaterial({ color: "#fef08a", transparent: true, opacity: 0.14, side: THREE.DoubleSide }),
      );
      searchCone.position.set(0, 18, 0);
      searchCone.visible = false;
      scene.add(searchCone);

      ref.current = {
        renderer, scene, camera, oceanGeo, oceanBasePos, oceanMesh,
        shipGroup, bubbles, tinyDot, searchCone, stars,
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
    const h = delayRender("cruise-frame");
    try {
      const tDrop = BY.drop.start;
      const tShrink = BY.shrink.start;
      const tUnder = BY.underwater.start;
      const tScale = BY.scale.start;
      const tCta = BY.cta.start;

      // Animate rolling ocean waves every frame
      const posAttr = r.oceanGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < posAttr.count; i++) {
        const bx = r.oceanBasePos[i * 3];
        const bz = r.oceanBasePos[i * 3 + 2];
        const wy = Math.sin(bx * 0.25 + t * 2.6) * 0.9 + Math.cos(bz * 0.2 + t * 2.1) * 0.8;
        posAttr.setY(i, wy);
      }
      posAttr.needsUpdate = true;
      r.oceanGeo.computeVertexNormals();

      r.shipGroup.visible = true;
      r.bubbles.visible = false;
      r.tinyDot.visible = false;
      r.searchCone.visible = false;
      r.stars.visible = true;
      r.scene.background = new THREE.Color("#030814");
      (r.scene.fog as THREE.FogExp2).color.set("#030814");
      (r.scene.fog as THREE.FogExp2).density = 0.011;

      if (t < tDrop) {
        // SHOT 1: High-deck rail overhang looking down past ship stern
        const p = t / tDrop;
        r.shipGroup.position.set(0, 0, -24 - p * 4);
        r.camera.position.set(4 - p * 2, 16 - p * 2, 4);
        r.camera.lookAt(0, 2, -26);
      } else if (t < tShrink) {
        // SHOT 2: 10-story vertical drop plummeting straight down toward dark swells
        const p = (t - tDrop) / (tShrink - tDrop);
        r.shipGroup.position.set(0, 0, -28 - p * 14);
        r.camera.position.set(0, 15 - p * 13.5, 4);
        r.camera.lookAt(0, 2 - p * 1.5, -24);
      } else if (t < tUnder) {
        // SHOT 3: Bobbing at waterline as giant lit ship disappears into black horizon
        const p = (t - tShrink) / (tUnder - tShrink);
        r.shipGroup.position.set(0, 0, -42 - p * 95);
        const bob = Math.sin(t * 3.8) * 0.7;
        r.camera.position.set(Math.sin(t * 1.7) * 0.5, 1.3 + bob, 6);
        r.camera.lookAt(0, 4, -60);
      } else if (t < tScale) {
        // SHOT 4: Underwater plunge — dark teal water looking up at shimmering ocean surface + bubbles
        const p = (t - tUnder) / (tScale - tUnder);
        r.shipGroup.visible = false;
        r.stars.visible = false;
        r.scene.background = new THREE.Color("#04263b");
        (r.scene.fog as THREE.FogExp2).color.set("#04263b");
        (r.scene.fog as THREE.FogExp2).density = 0.045;
        r.bubbles.visible = true;
        const dmy = new THREE.Object3D();
        for (let i = 0; i < 240; i++) {
          const bx = ((i * 17) % 24) - 12;
          const by = -14 + ((t * 4.5 + i * 0.7) % 14);
          const bz = ((i * 19) % 24) - 12;
          dmy.position.set(bx, by, bz);
          dmy.updateMatrix();
          r.bubbles.setMatrixAt(i, dmy.matrix);
        }
        r.bubbles.instanceMatrix.needsUpdate = true;
        r.camera.position.set(0, -6 - p * 3, 8);
        r.camera.lookAt(0, 4, 0);
      } else {
        // SHOT 5: High aerial pullback showing 1 tiny orange dot in 50km2 pitch-black sea + sweeping searchlight
        const p = (t - tScale) / Math.max(1, timing.total_dur - tScale);
        r.shipGroup.visible = false;
        r.tinyDot.visible = true;
        r.tinyDot.position.set(0, 0.8, 0);
        r.searchCone.visible = true;
        r.searchCone.rotation.z = Math.sin(t * 1.4) * 0.45;
        r.camera.position.set(0, 22 + p * 45, 22 + p * 38);
        r.camera.lookAt(0, 0, 0);
      }

      r.renderer.render(r.scene, r.camera);
    } finally {
      continueRender(h);
    }
  }, [t]);

  let telLabel = "TINGGI DEK";
  let telVal = "32 meter";
  let telSub = "SETARA 10 LANTAI";
  let alarm = false;

  if (t >= BY.drop.start && t < BY.shrink.start) {
    telLabel = "BENTURAN AIR";
    telVal = "90 km/jam";
    telSub = "SETARA ASPAL KERAS";
    alarm = true;
  } else if (t >= BY.shrink.start && t < BY.underwater.start) {
    const sec = Math.round(interpolate(t, [BY.shrink.start, BY.underwater.start], [5, 60], { extrapolateRight: "clamp" }));
    telLabel = "JARAK KAPAL";
    telVal = `00:${String(sec).padStart(2, "0")}`;
    telSub = "MENGHILANG DI GELAP";
    alarm = true;
  } else if (t >= BY.underwater.start && t < BY.scale.start) {
    telLabel = "SUHU LAUT";
    telVal = "12 °C";
    telSub = "HIPOTERMIA CEPAT";
    alarm = true;
  } else if (t >= BY.scale.start) {
    telLabel = "AREA PENCARIAN";
    telVal = "50 km²";
    telSub = "1 TITIK DI SAMUDRA";
    alarm = true;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#030814" }}>
      <Audio src={staticFile("05_kapal_pesiar.mp3")} />
      <canvas ref={canvasRef} width={width} height={height} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      <EditorialOverlay
        t={t}
        words={timing.words}
        hookHeadline="Jatuh dari kapal pesiar tengah malam"
        ctaHeadline="Peluang bertahan paling realistis?"
        ctaStart={BY.cta.start}
        telemetryLabel={telLabel}
        telemetryValue={telVal}
        telemetrySub={telSub}
        alarm={alarm}
        dropletOpacity={t >= BY.shrink.start && t < BY.scale.start ? 0.65 : 0}
      />
    </AbsoluteFill>
  );
};
