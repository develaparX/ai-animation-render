# AI Animation Render (`ai-animation-render`)

Repositori studio terpadu untuk pipeline produksi video animasi vertikal berbasis kode
(code-driven animation, `9:16`, `720p @ 24fps`, CPU-only tanpa GPU). Repo ini memuat
**metodologi Design Thinking**, **peta kompetensi (Skill Tree & Storyboard FYP)**, dan
**dua mesin gaya** yang siap produksi:

- **`stick-2d`** — panggung 2D Canvas gaya `@garishidup.idn` v2.1 (**sudah fix**).
- **`jadibegini`** — dunia 3D low-poly gaya `@JadiBeginiClip` / `@theofficeexplainer` (**eksperimen terkontrol, sudah terbukti render utuh**).

---

## 1. Modul & Spesifikasi Terkunci

| Modul | Status | Deskripsi & Mesin |
| :--- | :--- | :--- |
| **`stick-2d` (`@garishidup.idn` v2.1)** | **Production Ready (Sudah Fix)** | Mesin 2D Canvas + Playwright + FFmpeg: figur kapsul 3D-shaded + refleksi lantai, rotasi 6 arsitektur layout panggung (Layout A–F), 12 widget naratif v2.1, *Delayed Headline Reveal*, subtitle burn-in sinkron 100% `edge-tts` WordBoundary. |
| **`jadibegini` (3D low-poly hybrid)** | **Eksperimen terkontrol** | Dunia Three.js `kind: '3d'` (`engine/gh3d.js` + `engine/three-kit.js`): sawah berair / kantor, karakter kepala bulat + blush + kumis + caping/peci, banner hook 3 baris (baris akhir kuning), pill emas melayang, render swiftshader. Contoh utuh: `examples/jb-refugia-pematang` (63 s, 9 shot). |
| **`design-thinking`** | **Standar Operasional (wajib)** | 10 langkah Rin Room: Shapes → Call Graph → Kardinalitas → E → R → Boundary → Behavior Wrap → Scope → Swap R → A/E pisah. Mulai dari `design-thinking/README.md`. |
| **`skill-tree`** | **Knowledge Base** | Peta pohon skill 17 repo ekosistem animasi AI, formula retensi video viral FYP (@RicksClips3000, @novalcemerlang), panduan storyboard retensi tinggi. |
| **`research/3d-hybrid`** | **Data riset** | Bedah 31 short `@JadiBeginiClip` (17) + `@theofficeexplainer` (14): manifest metadata, 10 thumbnail, style breakdown, Design Thinking 10 langkah untuk gaya 3D. |

---

## 2. Skill (folder `skills/`)

| Skill | Trigger | Gaya | Mesin |
|---|---|---|---|
| [`skills/animasi-2d-stick-maen`](skills/animasi-2d-stick-maen/SKILL.md) | `stick-2d`, `stick 2d`, `2d stick` | `@garishidup.idn` v2.1 | Canvas 2D (`GH.stage`) |
| [`skills/animasi-3d-jadibegini`](skills/animasi-3d-jadibegini/SKILL.md) | `jadibegini`, `3d low poly`, `office explainer`, `stick-3d` | `@JadiBeginiClip` / `@theofficeexplainer` | Three.js (`kind: '3d'`) |

Keduanya berbagi: `engine/rig2d.js` (pose), `engine/core.js` (util), `audio/*` (music+SFX+LUFS),
`render.mjs` (headless Chromium), dan `tools/render_throttled.py` (pembatas CPU).
`SKILL.md` di root repo hanya alias tipis ke skill 2D — sumber kebenaran ada di `skills/`.

---

## 3. Watermark Dinamis & Fleksibel

Watermark **tidak dipatenkan** ke brand tertentu. Kosongkan bila user tidak minta.

```javascript
// gaya 2D
GH.stage(g, { floorY: E.H * 0.66, watermark: '@nama_akun_anda', spotlight: true });
// gaya 3D: watermark tidak digambar di scene; tambahkan overlay teks sendiri bila diminta
```

---

## 4. Arsitektur Pipeline (Call Graph)

```ts
AnimationPipeline ("stick-2d" | "jadibegini")
  → InputPromptAndConcept (Topik, Tone, Niche, Target Durasi)
  → DesignThinkingGuard (design-thinking/README.md: Shapes → A → E → R → Swap R)
  → StoryboardAndScript (skill-tree/STORYBOARD_FYP_*.md · Hook ≤ 2.5-6.5s · 7-12 Beat)
  → VoiceSynthAndAlign (edge-tts · WordBoundary 100% sync · words.json)
  → BeatAndShots (story/shots.json · music WAJIB list {start,end,mood,intensity})
  → BranchByStyle
    → STICK_2D: StageAndCast (engine/garishidup.js + engine/gh_layouts.js)
        → Rotate6Layouts · 12 Widgets · Delayed Headline Reveal
    → JADIBEGINI_3D: WorldAndShot (engine/gh3d.js + engine/three-kit.js)
        → world() per shot (dispose) · registerShot({kind:'3d'}) · banner/statPill/keyword/subs
  → ThrottledRender (tools/render_throttled.py · node render.mjs --workers 2 [--gl swiftshader])
  → AudioMixAndMux (audio/mix.py · music + SFX @ -14 LUFS → MP4)
  → VerifyAndDistribute (ffprobe + 3 frame acak → arsip → kirim → hapus routine pemantau)
```

Perbedaan biaya render (terukur di mesin CPU-only):

| Gaya | fps | 63 detik (1.496 frame) |
|---|---|---|
| `stick-2d` (2 worker) | ~7 | ~4 menit |
| `jadibegini` 3D (2 worker, swiftshader) | 0,28 | ~85 menit |

Karena itu urutan wajib: **sheet QC (1-2 menit) → baru render penuh**.

---

## 5. Struktur Direktori Repositori

```
ai-animation-render/
├── engine/                        # Mesin gambar (2D + 3D)
│   ├── core.js                    # util, kanvas, font, easing, rng
│   ├── garishidup.js              # gaya 2D v2.1: GH.stage/figure/headline + 12 widget
│   ├── gh_layouts.js              # 6 arsitektur panggung 2D (Layout A–F)
│   ├── rig2d.js, fx2d.js, ui2d.js # rig pose, efek, UI
│   ├── three-kit.js               # dunia Three.js: figure3D, dolly, orbit, tiles, shaft
│   └── gh3d.js                    # gaya 3D JadiBegini: person, paddyField, banner, subs
├── audio/                         # dsp.py, music.py, sfx.py (18 cue), mix.py (-14 LUFS)
├── tools/                         # new_project, transcribe, beats, doctor, verify_kit,
│                                  # render_throttled, jb_refugia_shots, build_jb_refugia
├── assets/                        # ikon SVG, prop 2D, contact sheet
├── examples/
│   ├── gh-v11-telat-lima-menit/   # contoh 2D (12 beat)
│   ├── reaction-time/             # contoh kit asli (2D + shot 3D orbit)
│   └── jb-refugia-pematang/       # contoh 3D JadiBegini (9 shot, 63 s)
├── design-thinking/               # WAJIB dibaca: README (10 langkah) + metodologi + E<R>
├── skill-tree/                    # SKILL_TREE_DT, STORYBOARD_FYP_*, RICKS_CLIPS_FORMULA
├── research/3d-hybrid/            # riset 31 short 3D: manifest, thumbnail, style breakdown
├── skills/
│   ├── animasi-2d-stick-maen/     # skill 2D (@garishidup.idn v2.1)
│   └── animasi-3d-jadibegini/     # skill 3D (@JadiBeginiClip / @theofficeexplainer)
├── render.mjs                     # runner render headless Chromium (Playwright)
├── player.html                    # pemutar web lokal untuk inspeksi timeline
├── package.json
├── SKILL.md                       # alias tipis → skills/animasi-2d-stick-maen
└── README.md
```

---

## 6. Panduan Menjalankan

### Persiapan
```bash
npm install
python tools/doctor.py            # cek Python, FFmpeg, Playwright
python tools/verify_kit.py        # integritas 29 file kit inti
```

### Render 2D (`stick-2d` v2.1)
```bash
node render.mjs --project examples/gh-v11-telat-lima-menit --sheet --scale 0.5
python tools/render_throttled.py node render.mjs --project examples/gh-v11-telat-lima-menit --workers 2
python audio/mix.py --project examples/gh-v11-telat-lima-menit
```

### Render 3D (`jadibegini`)
```bash
# 1) sheet QC (1-2 menit) — WAJIB dilihat sebelum render penuh
node render.mjs --project examples/jb-refugia-pematang --sheet --scale 0.5 --gl swiftshader

# 2) audio
python audio/mix.py --project examples/jb-refugia-pematang

# 3) render penuh, di background, dibatasi (≈85 menit untuk 63 detik)
python tools/render_throttled.py node render.mjs --project examples/jb-refugia-pematang --workers 2 --format jpeg --crf 20 --gl swiftshader

# 4) mux setelah video_silent.mp4 ada
python audio/mix.py --project examples/jb-refugia-pematang
```

### Aturan resource (mesin CPU-only)
1. **Satu job render berat saja** pada satu waktu.
2. Render selalu di background, dengan `tools/render_throttled.py` (prioritas BelowNormal,
   afinitas core terbatas, heap Node dibatasi).
3. Pantau progres dengan routine berkala, lalu **hapus routine** setelah selesai.

---

## 7. Menambah gaya atau skill baru

1. Baca `design-thinking/README.md`; tulis call graph-nya dulu (langkah 1-5).
2. Taruh mesin di `engine/` (jangan menimpa `garishidup.js` / `gh_layouts.js`).
3. Buat skill di `skills/<nama>/SKILL.md` + `references/` (style bible + anti-pattern).
4. Tambahkan satu proyek contoh kecil di `examples/<slug>/` supaya skill bisa diverifikasi
   tanpa membaca seluruh repo.
5. Perbarui tabel di README ini dan `skills/` index.
