# AI Animation Render (`ai-animation-render`)

Repositori studio terpadu untuk pipeline produksi video animasi berbasis kode (code-driven animation, CPU-only tanpa GPU) yang menggabungkan metodologi **Design Thinking**, peta kompetensi **Skill Tree & Storyboard FYP**, serta mesin render animasi multi-skill (2D Stickman `@garishidup.idn` v2.1 dan 3D Three.js / Remotion).

---

## 1. Status Kematangan Skill

Repositori ini dirancang untuk memuat berbagai skill animasi kecerdasan buatan (AI) dan grafika komputer:

| Skill / Modul | Status | Deskripsi & Mesin |
| :--- | :--- | :--- |
| **`stick-2d` (`@garishidup.idn` v2.1)** | **Production Ready (Sudah Fix)** | Mesin 2D Canvas + Playwright + FFmpeg: figur kapsul 3D-shaded + refleksi lantai, rotasi 6 arsitektur layout panggung, 12 widget naratif v2.1, *Delayed Headline Reveal*, dan subtitle burn-in sinkron 100% `edge-tts` WordBoundary. |
| **`animasi-3d-stick-maen`** | **Active Expansion (Template Bridge)** | Mesin 3D Three.js + Remotion (`skills/animasi-3d-stick-maen`): billboard toon characters, painted 3D world, composer ink outline + lens blur + color grading. |
| **`studio-3d`** | **Prototyping** | Remotion + Three.js scenes (`studio-3d/`): solar, black hole, lightning, procrastination, dan pipeline audio sintetis. |
| **`design-thinking`** | **Standard Operasional** | 10 langkah metodologi Rin Room (Shapes → Call Graph → Kardinalitas → E → R → Boundary → Behavior Wrap → Scope → Swap R → A/E pisah). |
| **`skill-tree`** | **Knowledge Base** | Peta pohon skill 17 repo, formula viral FYP (@RicksClips3000, @novalcemerlang), dan panduan storyboard retensi tinggi. |

---

## 2. Watermark Dinamis & Fleksibel

Watermark pada panggung animasi **tidak dipatenkan** ke brand atau nama tertentu, melainkan dapat ditentukan secara bebas sesuai kebutuhan pengguna melalui parameter `watermark`:

```javascript
// Contoh pemanggilan di panggung animasi:
GH.stage(g, {
  floorY: E.H * 0.66,
  watermark: '@nama_akun_anda', // bebas disesuaikan atau dikosongkan ('')
  spotlight: true
});
```

---

## 3. Arsitektur Pipeline (Call Graph)

```ts
AIAnimationPipeline
  → InputPromptAndConcept (Topic, Tone, Niche, Target Durasi 55-90s)
  → DesignThinkingGuard (Shapes → A Call Graph → E Breakpoints → R Dependencies)
  → StoryboardAndScript (skill-tree/STORYBOARD_FYP_*.md · Hook ≤ 2.5s · 12 Beat)
  → EngineRouting
    ├─► Mode "stick-2d" (FIX / Production Ready)
    │     → SpecAndScript (tools/gh_batch2_specs.py · 12 beat naratif)
    │     → VoiceSynthAndAlign (edge-tts id-ID-ArdiNeural +24% · WordBoundary 100% sync)
    │     → StageAndCast (engine/garishidup.js v2.1 + engine/gh_layouts.js)
    │       → StageWatermark (GH.stage · radial navy #121821→#070a0f · watermark kustom)
    │       → CapsuleFigures (GH.figure · kapsul 3D-shaded + outline #090c10 + refleksi)
    │       → Rotate6Layouts (Layout A Split-Box .. Layout F Frame-in-Frame Mirror)
    │       → NarrativeWidgets (12 widget v2.1: receiptCard, chatToast, scoreboard, dll)
    │       → TypographyAndCaptions (Delayed Headline Reveal *emas* + burn-in subtitle)
    │     → ThrottledRender (tools/render_throttled.py → node render.mjs --workers 2)
    │     → AudioMixAndMux (audio/mix.py · music + SFX @ -14 LUFS → MP4)
    │
    └─► Mode "animasi-3d" (Three.js / Remotion)
          → TemplateBridge (skills/animasi-3d-stick-maen/templates/bridge)
          → SceneComposition (build.ts, cast.ts, toon.ts, story.ts)
          → RemotionRenderThrottled (remotion render --gl=angle)
```

---

## 4. Struktur Direktori Repositori

```
ai-animation-render/
├── engine/              # Engine 2D Canvas: core.js, garishidup.js (v2.1), gh_layouts.js, ui2d.js, dll.
├── audio/               # Generator musik prosedural, 24 efek suara (SFX), dan mixer LUFS (-14 dB).
├── tools/               # Utilitas proyek, sync WordBoundary, spesifikasi 20 video batch, throttler CPU.
├── assets/              # Aset ikon SVG, prop 2D, dan contact sheet verifikasi visual.
├── examples/            # Proyek contoh lengkap: gh-v11-telat-lima-menit (12 beat naratif).
├── design-thinking/     # Metodologi Rin Room: DESIGN_THINKING_METHODOLOGY.md, CONTEXT_PASSING_DESIGN.md, dll.
├── skill-tree/          # Peta kompetensi: SKILL_TREE_DT.md, STORYBOARD_FYP_SKILLTREE.md, RICKS_CLIPS_FORMULA.md, dll.
├── skills/              # Paket skill modular:
│   ├── animasi-2d-stick-maen/  # Skill 2D Stickman v2.1
│   └── animasi-3d-stick-maen/  # Skill 3D Stickman Three.js (template bridge Mr omi)
├── studio-3d/           # Remotion + Three.js scenes & audio pipeline prototipe.
├── render.mjs           # Runner render headless Chromium (Playwright).
├── player.html          # Pemutar web lokal untuk inspeksi timeline real-time.
├── package.json         # Konfigurasi dependensi Node.js.
├── SKILL.md             # Dokumentasi ringkas trigger stick-2d.
└── README.md            # Dokumentasi utama proyek.
```

---

## 5. Panduan Menjalankan

### Persiapan
```bash
# Instal dependensi Node.js
npm install

# Verifikasi kesiapan tools lokal (Python, FFmpeg, Playwright)
python tools/doctor.py
```

### Render Animasi 2D (`stick-2d` v2.1)
```bash
# Render contact sheet 12 panel untuk inspeksi visual cepat
python tools/run_gh_batch2.py --build-v11-only
node render.mjs --project projects/gh-v11-telat-lima-menit --sheet --scale 0.5

# Render video utuh berurutan dengan pembatasan beban CPU
python tools/run_gh_batch2.py
```
