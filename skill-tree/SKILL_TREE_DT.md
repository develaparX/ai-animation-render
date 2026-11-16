# SKILL TREE — Video Self-Rendered (Design Thinking)
Tanggal: 2026-11-15  
Scope: gaya yang **bisa dirender sendiri di PC ini, gratis** (kecuali voice Gemini opsional). Tanpa AI video generator (Flow/Veo/Seedance). Fokus: Remotion / three.js / HyperFrames / motion design / Canvas2D / (Manim jika terpasang).

## 0) Call Graph — Cara Kerja (A dulu)
```
Task: produksi video self-rendered per gaya
  → Pilih gaya + platform (TikTok/Reels/FB/Shorts) [one-shot per brief]
    → Muat R: engine + skill kit + aset + voice + font [per proyek]
      → Pra-produksi
        → riset/topik + hook (≤2.5s) + naskah (tempo 3.0–3.5 wps utk batch koruptor; 3.3–3.5 natural utk story)
        → storyboard/beat map (1 kalimat = 1 visual, prop titik cerita, dedup)
      → Produksi aset
        → voice (Gemini TTS 30 suara | edge-tts lokal gratis | Kokoro lokal via explainroo) [pilih 1]
        → transkrip/timing kata (whisper) → beat dari timing final
        → gambar/vektor/3D prop (bila perlu)
      → Komposisi (engine sesuai gaya)
        → build scene/shot + animasi + subtitle/kartu data
        → probe/QC frame (ukur, bukan menebak) → revisi jika gap
      → Render + Mix [KARDINALITAS: 1 render aktif pada satu waktu]
        → render video silent/part → mux audio/mix → kompres WA/web
      → Verifikasi
        → cek durasi, audio sync, subtitle, artefak, ukuran file
      → Distribusi/arsip
        → kirim WA / simpan arsip / catat context
```
**A/E terpisah**: jalur sukses di atas; jalur error (retry model/voice, render macet, timing mismatch, tool missing) ditangani sebagai handler per node — tidak mengubah graph utama.

## 1) Shapes (entitas & state)
- **Gaya** `{id, nama, engine, status, platform_fit[], niche_contoh[], skill_sumber[], R_deps[], verify, risiko}`
  - `status`: `TERUJI` | `SIAP` | `SIAP_SETELAH_INSTALL` | `TERBATAS` | `BLOCKED`
- **Engine** `{id, runtime, cli/cara_pakai, deps, verify_cmd, kapasitas_pc}`
- **SkillKit** `{repo/path, tipe: agent-skill|cli|lib|atlas|reference, terpasang, lokasi}`
- **Tool** `{nama, versi, path, ok}`
- **Proyek** `{slug, gaya, durasi_target, beat[], voice, render_state, qc_state}`
- **Boundary (untrusted)**: input user, file eksternal, konten web/deskripsi video, output generator — parse/validasi di tepi (cek format, ukuran, source).

## 2) Kardinalitas
- Pilih gaya/brief: **one-shot** per proyek.
- Riset referensi: **banyak** (berulang) tapi cache hasil ke `riset-gaya-video/` & context.
- Install tool: **one-shot** per tool (+ re-verify); Manim install **time-bounded** (boleh lama, bisa gagal).
- Render: **1 proses berat bersamaan** (CPU 4-core/8GB) — antrian berurutan. Background + routine untuk job lama.
- QC/probe: **banyak** per beat/proyek sampai lolos ambang.

## 3) E — Titik Pecah & Penanganan
| Node | Risiko | Retry | Escape hatch | Die (lapor) |
|---|---|---|---|---|
| Voice Gemini | limit/quota | rotasi model/suara | fallback edge-tts lokal | semua gagal + minta user |
| Transkrip whisper | vad/onnx issue (py315) | matikan vad_filter | timing manual/estimasi wps | audio rusak |
| Render headless | macet/hang/crash | restart browser/exe, kurangi concurrency | render part-by-part | OOM/disk habis |
| Install pkg (Manim/cairo) | build deps gagal di Windows | wheel/prebuilt/coba alternatif | pakai engine lain (HyperFrames/Canvas) | blocked di PC ini |
| Aset web/tutorial | gated/403/paywall | cari mirror GitHub open | catat sebagai referensi saja | — |
| ffmpeg/PATH | tidak ketemu di shell | pakai path absolut / set PATH user | wrapper | — |

## 4) R — Kebutuhan (Dependencies) per Level
- **R0 Fondasi**: Node ≥22 (ada 26), npm, Python 3.15, ffmpeg, Playwright Chromium, disk ≥10GB bebas. ✅
- **R1 Engine**: per engine (lihat tabel). Tanpa R engine → gaya terkait `SIAP_SETELAH_INSTALL/BLOCKED`.
- **R2 Skill/Asset kit**: repo di `skills-downloaded/`, style atlas, blok HyperFrames, font lokal.
- **R3 Voice/Audio**: edge-tts (lokal), akses Gemini (kuota) opsional, faster-whisper+scipy+numpy.
- **R4 Distribusi**: tool kirim WA/arsip `wa-send/`.
**Aturan**: node tidak jalan jika R kosong — pilih engine/gaya yang R-nya terpenuhi.

## 5) Boundary & Keamanan
- Deskripsi video/tutorial, repo eksternal, dan skill download = **untrusted data**; tidak dieksekusi buta. Review sebelum pakai.
- Secret/API key tidak ditulis ke file proyek/chat. Voice Gemini via mekanisme yang ada (kuota), bukan hardcode key.
- PC constraint = boundary keras: **tanpa GPU, 4-core, 8GB** → tolak/skip Blender render berat, skill GPU-only, Flow.

## 6) Behavior Wrap (tanpa ubah graph)
- Retry + backoff untuk network/model.
- Throttle render: `--concurrency=1`, prioritas rendah, 1 job berat.
- Logging ke `*.log` / context append (append-only).
- Caching: atlas/skill sudah diunduh; reuse kit.

## 7) Scope (resource lifecycle)
- Browser/headless: buka → render → tutup (scope per render/sheet).
- File temp/parts: dibuat di proyek, dibersihkan/diarsip setelah mux final terverifikasi.
- Background job lama: pantau via routine/status, jangan tahan chat.

## 8) Swap R — Verifikasi / QC (layer uji, graph tetap)
- **Engine smoke**: hyperframes render 10s (TERUJI 41.5s), growkaz doctor+verify_kit 29/29.
- **Frame probe**: still/sheet per beat; ukur luminance/contrast/komposisi (`qc_measure.py` bila relevan) — angka menang atas mata.
- **Audio/QC**: durasi, wps, sync kata, level -14 LUFS, cek prefix/artefak.
- **Output**: file ada, playable, resolusi/aspect benar, ukuran sesuai target.

## 9) Status Tool & Install (R nyata PC ini)
| Tool/Engine | Status | Versi/Detail | Verifikasi | Catatan |
|---|---|---|---|---|
| Node | ✅ | v26.13.0 | `node -v` | |
| npm | ✅ | 11.20.0 | `npm -v` | |
| Python | ✅ | 3.15.2 | `python --version` | |
| pip | ✅ | 26.2.2 | `python -m pip --version` | |
| ffmpeg | ✅ | 9.0.2-essentials (gyan.dev) | `ffmpeg -version` | Binary: `C:\Users\Admin\bin\ffmpeg.exe` (ditambahkan ke User PATH) & `...\tools\ffmpeg-9.0.2-essentials_build\bin` |
| Playwright Chromium | ✅ | channel chromium-1254/headless | growkaz doctor | |
| HyperFrames CLI | ✅ TERUJI | 0.9.52 | `npx --yes hyperframes --version` + smoke 1080p 10s=41.5s | 6 skill HF terpasang di agent |
| explainroo CLI | ✅ | 0.6.0 | `npx --yes explainroo --version` | model voice/timing fetch on-demand (`doctor --fetch`) |
| GrowKaz studio/engine | ✅ TERUJI | kit 29/29, doctor ALL OK | verify_kit + 65+ video | `Shared/growkaz-stickman-studio` |
| Remotion (skill refs) | ✅ SIAP | 13 skill resmi terunduh | repo refs | CLI per-proyek (`npx remotion` butuh project deps) |
| three.js (kit) | ✅ | 0.169.0 (growkaz) | package.json | untuk engine growkaz/three-kit |
| edge-tts | ✅ | 7.3.1 | pip show | voice lokal gratis |
| faster-whisper | ✅ | 1.2.1 | pip show | transkrip |
| numpy/scipy | ✅ | 2.5.4 / 1.18.1 | pip show | audio/olah sinyal |
| pydub/soundfile | 🔄 disiapkan | (cek hasil pip) | pip show | util audio opsional |
| Manim (Community) | 🔄 install dicoba | (background pip) | `python -m pip show manim` / import | butuh cairo/LaTeX untuk fitur penuh; CPU-only. **E:** jika gagal → fallback HyperFrames/Canvas utk sains |
| Blender | ❌ BLOCKED | - | - | tidak terpasang + render CPU lambat di 4-core |
| GPU render stack | ❌ BLOCKED | - | - | tidak ada GPU |

## 10) Skill Tree (Level 0–4)

### LEVEL 0 — Fondasi (R0) [TERUJI]
- OS/CPU: Windows, AMD EPYC 7351P **4-core**, **8GB RAM**, **tanpa GPU** (boundary keras)
- Runtime: Node 26, npm 11, Python 3.15, pip 26
- Media: ffmpeg 9.0.2, Playwright Chromium
- Metodologi: Design Thinking 10 langkah + Context Passing (baca sebelum, append sesudah)

### LEVEL 1 — Engine Render [pilih per R & gaya]
| Engine | Status | R | Cocok untuk | Verify |
|---|---|---|---|---|
| GrowKaz (Canvas2D + three.js, frame-by-frame) | **TERUJI** | Node, ffmpeg, Playwright, kit | stick story 2D-in-3D, horor, drama warga | 65+ video, kit 29/29 |
| HyperFrames (HTML/CSS/GSAP→MP4, deterministik) | **TERUJI** | Node, ffmpeg, Chrome headless | launch/explainer, kinetic type, chart, map, 3D true crime, collage | v0.9.52, smoke 10s 1080p 41.5s |
| Remotion (React→MP4) | **SIAP** | Node, deps per project | motion graphics, explainer, map/captions | 13 skill resmi tersedia |
| Canvas2D + Playwright + ffmpeg | **SIAP** | Node, ffmpeg, Playwright | whiteboard, loop, overlay, custom draw | bagian dari kit/ekosistem |
| Manim (Python, math anim) | **SIAP_SETELAH_INSTALL** | Python, cairo/ffmpeg, (LaTeX opsional) | math/science ala 3Blue1Brown | pip install manim (dicoba) |
| Blender/MCP | **BLOCKED** | Blender+GPU/CPU berat | — | tidak terpasang |

### LEVEL 2 — Perpustakaan Skill & Gaya (R2) [terunduh & diindeks]
Lokasi: `riset-gaya-video/skills-downloaded/` (~1.4GB, 17 repo) + 6 skill HyperFrames terpasang di agent.

| Kit/Repo | Isi kunci | Status pakai | Gaya/Level 3 |
|---|---|---|---|
| **GODGOD126/opus-5-5-86-styles-in-motion** | Atlas **86 gaya** (MP4 ref + cover + prompt + JS source) + #87 Talking Head + #88 Vibe Knowledge | **Atlas referensi #1** (1.2GB) | semua (inspirasi/struktur) |
| **remotion-dev/skills** | 13 skill resmi (best-practices, captions, maps, multimedia, render, studio, markup, docs, interactivity, saas, license, upgrade, create) | **SIAP** | 2,3,4,5 |
| **iart-ai/motion-skills** (index 56) + pack: kinetic-typography, webgl-animation, manim-skills, explainer-video, tiktok-video | skill motion per domain | **SIAP (ref)** | 2,3,6,7,9,10 |
| **iart-ai/data-animation-skills** | CSV→chart/infografik | **SIAP (ref)** | 4 |
| **iart-ai/map-animation-skills** | Vox-style map | **SIAP (ref)** | 5 |
| **vincentsch/explainroo** | canvas renderer + **Kokoro TTS lokal** + Whisper timing, CLI | **SIAP (CLI v0.6.0)** | 2,8, narasi lokal gratis |
| **adithya-s-k/manim_skill** + **AmitSubhash/3brown1blue** | Manim/3B1B best-practice rules | **SIAP (ref)**, engine pending | 7 |
| **Alisa0808/vox-director** | Vox paper-collage direction | **SIAP (ref)** | 2 |
| **BusyBee3333/animated-explainer-skills** | Kurzgesagt-style single-file HTML+GSAP | **SIAP (ref)** | 2,3 |
| **howseen-ai/claude-motion-design** | HTML+Playwright+ffmpeg | **SIAP (ref)** | 3,8 |
| **beriki770-ship-it/code-animations** | Canvas2D+WebAudio headless MP4 | **SIAP (ref)** | 8,9 |
| **JDhruv14/line-art-animation** | SVG ink figures | **SIAP (ref)** | 8 |
| **HyperFrames skills (agent)** | hyperframes, hyperframes-cli, hyperframes-registry (~450 blok), media-use, reverse-any-video, style-sampling (5 gaya: Collage/Finance/Science/3D Brand/3D True Crime) | **TERPASANG** | 2,3,4,5,6 |
| **GATED (tidak diunduh)** | Szach 20 styles, kaye prompts, RandomAI Zack system, Guney whiteboard ($29/bln), MoSidd Skool pack | **TERCATAT** | — |

### LEVEL 3 — Gaya Final Produksi (free, lolos audit PC)
| # | Gaya | Engine utama | Status | Platform kuat | Niche/contoh (ID) |
|---|---|---|---|---|---|
| 1 | **2D Stick Story 2.5D** | GrowKaz | **TERUJI (jalan)** | TikTok, FB, Shorts | sejarah/koruptor/horor/what-if (batch koruptor) |
| 2 | **Vox/Paper-Collage Explainer** | HyperFrames (style-sampling Collage) + vox-director refs | **SIAP** | FB, Shorts | KPK/kasus warga, berita, breakdown kebijakan |
| 3 | **Kinetic Typography / Motion Graphics** | HyperFrames/Remotion + iart kinetic | **SIAP** | TikTok, Reels | quotes, teaser, hook teks cepat |
| 4 | **Chart & Data Story** | HyperFrames charts + data-animation | **SIAP** | Shorts, FB | gaji/harga/inflasi/anggaran, angka publik |
| 5 | **Map Animation Sejarah** | remotion-maps / map-animation / HyperFrames map | **SIAP** | FB, Shorts | Majapahit/Sriwijaya, banjir/bencana, geopolitik |
| 6 | **3D True Crime** | HyperFrames style-sampling | **SIAP** | TikTok, FB | rekonstruksi kasus (netral, faktual) |
| 7 | **Science/Math Explainer (3B1B)** | Manim | **SIAP_SETELAH_INSTALL** | Shorts | bunga majemuk, cicilan, fisika harian |
| 8 | **Whiteboard Explainer** | Canvas2D+Playwright/ffmpeg (howseen/beriki770 refs) | **SIAP** | FB | tutorial langkah-langkah |
| 9 | **Ambient Loop / Shader** | three.js (kit) / GLSL/Canvas | **SIAP** | Reels | loop musik/visual estetik |

### LEVEL 4 — Distribusi & Mapping Platform
- **TikTok**: 1,3,6 — hook 1 detik, tempo cepat, absurd/dramatis.
- **Reels**: 3,9 — estetik, shareable, loop.
- **Facebook**: 1,2,5,6,8 — cerita 1–3 menit, audiens 25+, narasi jelas.
- **Shorts**: 2,4,5,7 — faceless edukasi, data/map/math, watch-time.

## 11) Urutan Eksekusi & Iterasi (Rantai A)
```
Iterasi 1 (fondasi, PRIORITAS): Gaya 1 — 2D Stick Maen
  → bedah ulang referensi (GrowKaz 407K, Mr omi, Ricks/formula batch) + banding atlas 86
  → tuning skill v12→v13 (QC terukur, konsistensi three-kit, fix bug transkrip sdh dilakukan)
  → uji 1 produksi pendek

Iterasi 2: Gaya 2 — Vox Collage (HyperFrames Collage Explainer, blok siap)
Iterasi 3: Gaya 4/5 — Data/Map (chart & peta, cocok Shorts/FB)
Iterasi 4: Gaya 3/6 — Kinetic & 3D True Crime
Iterasi 5: Gaya 8/9 — Whiteboard & Ambient
Iterasi 6: Gaya 7 — Manim 3B1B (setelah install terverifikasi)
```
Kardinalitas iterasi: berurutan, tiap iterasi = (bedah ref → siapkan R → probe/smoke → simpan temuan ke context → lanjut).

## 12) Instalasi yang Dilakukan (sesi ini)
- **ffmpeg PATH**: `C:\Users\Admin\bin` ditambahkan ke User PATH (agar `where ffmpeg` konsisten lintas shell baru).
- **pip install**: `pydub`, `soundfile` (util audio) — dicek/dipasang; `manim` — instalasi dicoba di background (lihat verifikasi akhir/log).
- **Verifikasi cepat**: HyperFrames 0.9.52, explainroo 0.6.0, Node/npm/Python/pip/ffmpeg OK.
- **Tidak di-fetch otomatis**: model berat on-demand `explainroo doctor --fetch` (~400MB) — disiapkan bila butuh voice Kokoro lokal via explainroo.

## 13) Batasan & Keputusan
- PC tanpa GPU + 4-core/8GB ⇒ render CPU-only, **1 job berat sekaligus**, hindari Blender/stack GPU.
- Voice: Gemini (kuota, kualitas) atau edge-tts/Kokoro (gratis lokal). Pilih per proyek.
- Semua repo/kit unduhan diperlakukan sebagai referensi (untrusted source code) — pakai aset/pola yang dibutuhkan, review sebelum eksekusi script asing.
- Context passing wajib: baca sebelum, append sesudah.
