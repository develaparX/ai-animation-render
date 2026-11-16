import React, { useEffect, useRef } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { createPrecisionRenderer, makeEarthTexture, makeSolarTexture, makeStarfield, makeWindowTexture, makeRoadTexture } from "../glUtils";
import { EditorialOverlay } from "../Overlay";
import timing from "../timing_01_matahari.json";

const SEGS = timing.segments;
const BY = Object.fromEntries(SEGS.map((s) => [s.id, s]));

export const SolarVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ref = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    keyLight: THREE.DirectionalLight;
    rimLight: THREE.PointLight;
    stars: THREE.Points;
    sunGroup: THREE.Group;
    sunMesh: THREE.Mesh;
    corona: THREE.Mesh;
    photonWave: THREE.Mesh;
    earthNormal: THREE.Mesh;
    earthScorched: THREE.Mesh;
    shockwave: THREE.Mesh;
    cityGroup: THREE.Group;
    oceanPlane: THREE.Mesh;
    steamMeshes: THREE.Mesh[];
    buildings: THREE.Mesh[];
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const h = delayRender("solar-init");
    try {
      const renderer = createPrecisionRenderer(canvas, width, height);
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#03060f");
      scene.fog = new THREE.FogExp2("#03060f", 0.002);

      const camera = new THREE.PerspectiveCamera(48, width / height, 0.2, 500);
      const hemi = new THREE.HemisphereLight("#ffe4b5", "#0f172a", 0.6);
      scene.add(hemi);
      const keyLight = new THREE.DirectionalLight("#fff7ed", 2.0);
      keyLight.position.set(-25, 35, 25);
      keyLight.castShadow = true;
      scene.add(keyLight);
      const rimLight = new THREE.PointLight("#fb923c", 3.5, 160);
      scene.add(rimLight);

      const stars = makeStarfield(1800, 240);
      scene.add(stars);

      // Sun group (Shot 1 & 3)
      const sunGroup = new THREE.Group();
      const solarTex = makeSolarTexture();
      const sunMesh = new THREE.Mesh(
        new THREE.SphereGeometry(10, 48, 48),
        new THREE.MeshBasicMaterial({ map: solarTex }),
      );
      sunGroup.add(sunMesh);
      const corona = new THREE.Mesh(
        new THREE.SphereGeometry(12.2, 36, 36),
        new THREE.MeshBasicMaterial({ color: "#fb923c", transparent: true, opacity: 0.24, side: THREE.BackSide }),
      );
      sunGroup.add(corona);
      const photonWave = new THREE.Mesh(
        new THREE.RingGeometry(11.5, 12.6, 48),
        new THREE.MeshBasicMaterial({ color: "#fef08a", side: THREE.DoubleSide, transparent: true, opacity: 0.85 }),
      );
      sunGroup.add(photonWave);
      scene.add(sunGroup);

      // Orbit Earth models (Shot 3 & 5)
      const earthNormal = new THREE.Mesh(
        new THREE.SphereGeometry(6.5, 48, 48),
        new THREE.MeshStandardMaterial({ map: makeEarthTexture(false), roughness: 0.65 }),
      );
      scene.add(earthNormal);
      const earthScorched = new THREE.Mesh(
        new THREE.SphereGeometry(6.52, 48, 48),
        new THREE.MeshStandardMaterial({
          map: makeEarthTexture(true),
          emissive: new THREE.Color("#b45309"),
          emissiveIntensity: 0.75,
          roughness: 0.85,
        }),
      );
      scene.add(earthScorched);

      const shockwave = new THREE.Mesh(
        new THREE.SphereGeometry(1, 40, 40),
        new THREE.MeshBasicMaterial({ color: "#fef3c7", transparent: true, opacity: 0.65, wireframe: false }),
      );
      scene.add(shockwave);

      // Coastal city group (Shot 2 & 4)
      const cityGroup = new THREE.Group();
      const road = new THREE.Mesh(
        new THREE.PlaneGeometry(44, 140),
        new THREE.MeshStandardMaterial({ map: makeRoadTexture(), roughness: 0.85 }),
      );
      road.rotation.x = -Math.PI / 2;
      cityGroup.add(road);

      const oceanPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(180, 140),
        new THREE.MeshStandardMaterial({ color: "#0369a1", roughness: 0.25, metalness: 0.15 }),
      );
      oceanPlane.rotation.x = -Math.PI / 2;
      oceanPlane.position.set(0, -0.3, -85);
      cityGroup.add(oceanPlane);

      const t1 = makeWindowTexture("#9a3412", "#1e293b", 5, 12);
      const t2 = makeWindowTexture("#334155", "#60a5fa", 6, 14);
      const buildings: THREE.Mesh[] = [];
      const bCoords = [
        [-14, -8, 10, 26], [-15, -30, 12, 36], [-14, -52, 11, 42],
        [14, -10, 10, 24], [15, -32, 12, 38], [14, -54, 11, 46],
      ];
      bCoords.forEach(([x, z, w, bh], idx) => {
        const m = new THREE.Mesh(
          new THREE.BoxGeometry(w, bh, 12),
          new THREE.MeshStandardMaterial({ map: idx % 2 === 0 ? t1 : t2, roughness: 0.7 }),
        );
        m.position.set(x, bh / 2, z);
        cityGroup.add(m);
        buildings.push(m);
      });

      const steamMeshes: THREE.Mesh[] = [];
      const steamGeo = new THREE.SphereGeometry(1, 18, 18);
      for (let i = 0; i < 24; i++) {
        const sm = new THREE.Mesh(
          steamGeo,
          new THREE.MeshStandardMaterial({ color: "#fed7aa", transparent: true, opacity: 0.55, roughness: 0.9 }),
        );
        cityGroup.add(sm);
        steamMeshes.push(sm);
      }
      scene.add(cityGroup);

      ref.current = {
        renderer, scene, camera, keyLight, rimLight, stars,
        sunGroup, sunMesh, corona, photonWave, earthNormal, earthScorched, shockwave,
        cityGroup, oceanPlane, steamMeshes, buildings,
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
    const h = delayRender("solar-frame");
    try {
      const tCalm = BY.calm.start;
      const tFlash = BY.flash.start;
      const tBoil = BY.boil.start;
      const tEmber = BY.ember.start;

      // Default visibility
      r.stars.visible = true;
      r.sunGroup.visible = false;
      r.earthNormal.visible = false;
      r.earthScorched.visible = false;
      r.shockwave.visible = false;
      r.cityGroup.visible = false;

      if (t < tCalm) {
        // SHOT 1: Orbital close-up of blazing Sun + photon pulse launching
        const p = t / tCalm;
        r.scene.background = new THREE.Color("#03060f");
        (r.scene.fog as THREE.FogExp2).density = 0.0015;
        r.sunGroup.visible = true;
        r.sunGroup.position.set(0, 2, -10);
        r.sunMesh.rotation.y = t * 0.25;
        r.corona.scale.setScalar(1 + 0.06 * Math.sin(t * 6));
        r.photonWave.scale.setScalar(1 + p * 3.5);
        r.photonWave.rotation.x = 0.5;
        r.camera.position.set(2 - p * 4, 4, 28 - p * 8);
        r.camera.lookAt(0, 1.5, -10);
      } else if (t < tFlash) {
        // SHOT 2: Sunny peaceful coastal city overlooking calm ocean
        const p = (t - tCalm) / (tFlash - tCalm);
        r.stars.visible = false;
        r.cityGroup.visible = true;
        r.scene.background = new THREE.Color("#7dd3fc");
        (r.scene.fog as THREE.FogExp2).color.set("#7dd3fc");
        (r.scene.fog as THREE.FogExp2).density = 0.004;
        r.keyLight.color.set("#fffbeb");
        r.keyLight.intensity = 2.0;
        r.oceanPlane.material = new THREE.MeshStandardMaterial({ color: "#0284c7", roughness: 0.22 });
        r.steamMeshes.forEach((m) => (m.visible = false));
        r.camera.position.set(-2 + p * 1.5, 12, 16 - p * 12);
        r.camera.lookAt(0, 6, -40);
      } else if (t < tBoil) {
        // SHOT 3: High orbit Earth + blinding solar supernova shockwave
        const p = (t - tFlash) / (tBoil - tFlash);
        r.scene.background = new THREE.Color("#060812");
        (r.scene.fog as THREE.FogExp2).density = 0.0012;
        r.sunGroup.visible = true;
        r.sunGroup.position.set(-26, 12, -55);
        r.sunGroup.scale.setScalar(1 + p * 1.6);
        r.earthNormal.visible = true;
        r.earthNormal.position.set(2, -1, 0);
        r.earthNormal.rotation.y = t * 0.3;
        r.shockwave.visible = true;
        r.shockwave.position.copy(r.sunGroup.position);
        r.shockwave.scale.setScalar(4 + p * 78);
        r.rimLight.position.set(-14, 10, -25);
        r.rimLight.intensity = 8.0;
        const sx = Math.sin(t * 36) * 0.4 * p;
        r.camera.position.set(7 - p * 4 + sx, 4, 22 - p * 5);
        r.camera.lookAt(-1, 0, -6);
      } else if (t < tEmber) {
        // SHOT 4: Scorched street-level tracking shot — ocean boiling into towering steam!
        const p = (t - tBoil) / (tEmber - tBoil);
        r.stars.visible = false;
        r.cityGroup.visible = true;
        const sky = new THREE.Color("#9a3412").lerp(new THREE.Color("#dc2626"), p);
        r.scene.background = sky;
        (r.scene.fog as THREE.FogExp2).color.copy(sky);
        (r.scene.fog as THREE.FogExp2).density = 0.012 + p * 0.008;
        r.keyLight.color.set("#fb923c");
        r.keyLight.intensity = 2.6;
        r.oceanPlane.material = new THREE.MeshStandardMaterial({
          color: "#ea580c",
          emissive: new THREE.Color("#9a3412"),
          emissiveIntensity: 0.7,
        });
        r.steamMeshes.forEach((m, i) => {
          m.visible = true;
          const rise = ((t * 9 + i * 2.5) % 28);
          m.position.set(((i * 19) % 44) - 22, rise, -25 - ((i * 13) % 50));
          m.scale.setScalar(2.4 + rise * 0.22);
        });
        const sx = Math.sin(t * 44) * 0.55;
        const sy = Math.cos(t * 39) * 0.4;
        r.camera.position.set(sx, 7.5 + sy, 4 - p * 18);
        r.camera.lookAt(0, 10 + p * 4, -55);
      } else {
        // SHOT 5: High orbital pullback — charred glowing ember Earth alone in black void
        const p = (t - tEmber) / Math.max(1, timing.total_dur - tEmber);
        r.scene.background = new THREE.Color("#02040a");
        (r.scene.fog as THREE.FogExp2).density = 0.002;
        r.earthScorched.visible = true;
        r.earthScorched.position.set(0, -1, 0);
        r.earthScorched.rotation.y = t * 0.22;
        r.rimLight.position.set(14, 12, 12);
        r.rimLight.intensity = 3.0;
        r.camera.position.set(-4, 3, 18 + p * 14);
        r.camera.lookAt(0, -1, 0);
      }

      r.renderer.render(r.scene, r.camera);
    } finally {
      continueRender(h);
    }
  }, [t]);

  const tCalm = BY.calm.start;
  const tFlash = BY.flash.start;
  const tBoil = BY.boil.start;
  const tEmber = BY.ember.start;

  const flashWhite =
    t >= tFlash && t < tFlash + 1.1
      ? interpolate(t, [tFlash, tFlash + 0.15, tFlash + 1.1], [0, 0.95, 0], { extrapolateRight: "clamp" })
      : 0;

  let telLabel = "CAHAYA MATAHARI";
  let telVal = "08:20";
  let telSub = "WAKTU TEMPUH KE BUMI";
  let alarm = false;

  if (t >= tCalm && t < tFlash) {
    const rem = Math.max(0, 500 * (1 - (t - tCalm) / (tFlash - tCalm)));
    const mm = Math.floor(rem / 60);
    const ss = Math.floor(rem % 60);
    telVal = `0${mm}:${String(ss).padStart(2, "0")}`;
    telSub = "BELUM TERLIHAT DI BUMI";
  } else if (t >= tFlash && t < tBoil) {
    telLabel = "GELOMBANG KEJUT";
    telVal = "KILAT PUTIH";
    telSub = "CAHAYA TIBA";
    alarm = true;
  } else if (t >= tBoil && t < tEmber) {
    const temp = Math.round(interpolate(t, [tBoil, tEmber], [35, 1850], { extrapolateRight: "clamp" }));
    telLabel = "SUHU PERMUKAAN";
    telVal = `${temp.toLocaleString("id-ID")} °C`;
    telSub = "LAUTAN MENDIDIH";
    alarm = true;
  } else if (t >= tEmber) {
    telLabel = "SISA PLANET";
    telVal = "BARA KOSONG";
    telSub = "MATAHARI PADAM";
    alarm = true;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#03060f" }}>
      <Audio src={staticFile("01_matahari.mp3")} />
      <canvas ref={canvasRef} width={width} height={height} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      <EditorialOverlay
        t={t}
        words={timing.words}
        hookHeadline="Bagaimana jika Matahari meledak detik ini?"
        ctaHeadline="Apa yang kamu lakukan di 8 menit terakhir?"
        ctaStart={BY.cta.start}
        telemetryLabel={telLabel}
        telemetryValue={telVal}
        telemetrySub={telSub}
        alarm={alarm}
        flashWhite={flashWhite}
      />
    </AbsoluteFill>
  );
};
