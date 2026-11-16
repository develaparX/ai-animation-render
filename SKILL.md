---
name: animasi-2d-stick-maen
description: 'TRIGGER UTAMA: "stick-2d" / "stick 2d" / "2d stick" / "animasi-2d-stick-maen".
  Pipeline produksi video kartun vertikal 55-90 detik gaya @garishidup.idn v2.1
  (watermark fleksibel sesuai permintaan user) di mesin CPU-only: figur kapsul 3D-shaded putih/slate/emas
  ber-outline tebal + refleksi lantai, rotasi 6 arsitektur panggung (Split-Box Dimming,
  Open-Split, Time-Lapse Counter, Flashback Timer, Multi-Scene 3 Latar, Frame-in-Frame
  Mirror), 12 widget v2.1 (receiptCard, chatToast, blueprintBoard, scoreboard, dll),
  Delayed Headline Reveal + 1 aksen emas menyala, voice edge-tts/Gemini TTS sinkron
  100% WordBoundary, subtitle burn-in (gap 0.46x), music+SFX, render throttled via
  ai-animation-render.'
example-prompt: Buat video stick-2d tentang pajak warga dengan watermark @akunsaya, kirim ke WhatsApp.
---

# Animasi 2D Stick Maen (`stick-2d`) — Gaya Terkunci `@garishidup.idn` v2.1 (CPU-only)

> **TRIGGER TERKUNCI (`stick-2d`)**: Setiap kali user meminta **`stick-2d`**, **`stick 2d`**, **`2d stick`**, atau **`animasi-2d-stick-maen`**, langsung gunakan **Gaya Terkunci `@garishidup.idn` v2.1** (12 beat naratif, figur kapsul 3D-shaded + refleksi lantai, rotasi 6 arsitektur panggung Layout A–F, 12 widget v2.1, *Delayed Headline Reveal*, subtitle burn-in `gap = 0.46 * sz`, dan **watermark bebas sesuai permintaan user, tidak dipatenkan**).
> Kit utama tersimpan di repositori `ai-animation-render`.

## Kesiapan lingkungan & resource (cek dulu)
1. `python tools/doctor.py` di folder studio — semua OK baru lanjut. Fix otomatis: `python tools/doctor.py --install`.
2. Verifikasi kit `29/29`. Jika timing/subtitle meleset, pulihkan `tools/transcribe.py` dari sumber plugin (versi usang bisa menggeser timing kata).
3. ffmpeg PATH Windows: `C:\Users\Admin\tools\ffmpeg-9.0.2-essentials_build\bin` (tambahkan ke PATH sesi jika doctor komplain).
4. Mesin CPU-only (contoh: AMD EPYC 7351P 4 core, 8 GB RAM, tanpa GPU): jalankan **maksimal 1 job render berat sekaligus** dan batasi concurrency (mis. `--workers 1-2` sesuai beban, jangan paralelkan render lain). 720p @24fps ±2 frame/s per worker (`--format jpeg --preset veryfast` ~7.5 fps). SELALU render di background (poling log), jangan foreground.
5. Aturan resource OpenBot berlaku: render throttled/detached bila perlu; pantau dengan Routine; hapus routine setelah selesai.

## Pemilihan voice mengikuti storyboard (30 voice prebuilt Gemini)
Pilih voice saat menulis storyboard dari daftar resmi (30 prebuilt): Zephyr(Bright), Puck(Upbeat), Charon(Informative), Kore(Firm), Fenrir(Excitable), Leda(Youthful), Orus(Firm), Aoede(Breezy), Callirrhoe(Easy-going), Autonoe(Bright), Enceladus(Breathy), Iapetus(Clear), Umbriel(Easy-going), Algieba(Smooth), Despina(Smooth), Erinome(Clear), Algenib(Gravelly), Rasalgethi(Informative), Laomedeia(Upbeat), Achernar(Soft), Alnilam(Firm), Schedar(Even), Gacrux(Mature), Pulcherrima(Forward), Achird(Friendly), Zubenelgenubi(Casual), Vindemiatrix(Gentle), Sadachbia(Lively), Sadaltager(Knowledgeable), Sulafat(Warm).
Peta tone cepat: tragedi/misteri=Charon/Algieba; dongeng hangat=Leda/Sulafat/Achird; dokumenter=Rasalgethi/Sadaltager; komedi=Puck/Laomedeia; sarkas datar=Schedar; seru=Fenrir/Sadachbia; sains=Zephyr/Iapetus.
Cantumkan `voice: <nama> (alasan)` di header storyboard. Bahasa Indonesia otomatis terdeteksi.

## Voice engine: Gemini dulu, fallback edge-tts
1. Gemini TTS (generativelanguage), rotasi `gemini-2.5-flash-preview-tts` → `gemini-2.5-flash-lite-preview-tts` → `gemini-2.5-pro-preview-tts`.
2. 429/RESOURCE_EXHAUSTED di semua model (retry 2x/model, backoff 5s/15s) → fallback edge-tts (`edge-tts --voice id-ID-ArdiNeural|id-ID-GadisNeural --rate=+24%`). Catat "voice: edge-tts (Gemini habis)" di README job. JANGAN batal.
3. Post: trim, atempo 1.25-1.3x (target ≥3 kata/detik), gap 0.3-0.5s, concat → `public/<nama>.mp3` atau `input/voiceover.wav`.

## Pipeline studio GrowKaz (video 2D stick)
1. **Naskah** (55-90 s): hook ≤6.5 s → setup → 3-5 beat eskalasi (angka konkret) → snap → deadpan "Untungnya/Sayangnya" → penjelasan analogi/blueprint → aturan → callback. Fakta+sumber di atas `SCRIPT.md`.
2. **Storyboard** `STORYBOARD_<Kxx>.md`: tabel shot (detik, shot/kamera, aksi) + field voice. Ikuti aturan wajib di bawah.
3. **Buat project**: `python tools/new_project.py --name <slug> --voice "<wav>" --script "<txt>" --aspect 9:16 --resolution 720p --title "<judul>" --captions`, lalu `python tools/transcribe.py` (id, model small) dan `python tools/beats.py`.
4. **Bible + cast + shots**: tulis `story/bible.md`, `scenes/cast.js` (1 warna khas/karakter), rewrite `story/shots.json` (kontigu, median 2-3.5 s, potong 0.1-0.2 s sebelum frasa).
5. **Style + build shot**: render style grid (`node render.mjs --styles ... --scale 0.5`), pilih 1, bangun `scenes/sets/*.js` + `scenes/shots/NN_*.js` (API: rig2d, fx2d, ui2d, three-kit, garishidup). Baca `references/style-bible.md` + `engine-api.md`.
6. **Sheet QC**: `node render.mjs --project projects/<slug> --sheet --scale 0.5` → LIHAT sheet PNG (rim light, mood, kamera bergerak, no MISSING). Perbaiki sebelum final. Untuk UI/grafik/chart/kartu data yang harus pixel-perfect, render bagian tersebut via HyperFrames lalu gabungkan ke hasil.
7. **Sound**: isi `music`/`sfx`/`amb`; mix `python audio/mix.py` (duck -9 dB, -14 LUFS).
8. **Render final + kirim**: render final di background (1 job berat sekaligus, concurrency terbatas); QA ffprobe + contact sheet; kompres WA `ffmpeg -crf 28 scale=720:-2` (≤12 MB); kirim `openbot.messaging_post` per nomor + arsip `Shared/wa-send/`; lampirkan asli bila diminta; hapus routine pemantau.

## Aturan WAJIB warisan (berlaku di gaya 2D)
1. **Kaki beranimasi saat berjalan**: jangan pose statis digeser; verifikasi 2 still kiri/kanan.
2. **Ilustrasi fisika eksplisit**: tiap klaim narasi punya 1 bukti visual dalam shot khusus (panah, blueprint, data card menghitung), minimal 2 detik.
3. **Snap/jatuh close-up dulu** (bigFace/insert makro ≥1/3 frame + kick/shake) baru cut wide.
4. **Subtitle selalu & terverifikasi**: `--captions` 9:16 (y≈79% tinggi); cek still di tengah kalimat, sinkron `timing.words`.
5. **Tempo NATURAL 3.3-3.5 kata/detik TANPA atempo boost**; perbaiki naskah jika lambat. Hook ≤6.5 s. Durasi target 1.5-2 menit (beat reaksi/crowd). Formula: hook→set→eskalasi→snap→deadpan→why→rule→callback.
6. **Rasio dikunci sejak storyboard**: satu rasio penuh (9:16 atau 16:9), set `--aspect`. Posisi/ukuran via `V(h,v)`; verifikasi judul/figur/caption tidak terpotong/tabrakan di sheet.
7. **Zona UI tanpa tabrakan (9:16)**: y≈79% H khusus caption (band 72%-92% H kosong elemen lain); y≈8%-22% H readout/judul atas; tengah 25%-68% H subject/ilustrasi; maksimal 2 elemen UI teks bersamaan (selain caption). Render 1 still/shot untuk QC tumpang tindih sebelum render penuh.
8. **Caption WhatsApp terstandar**: tulis saat storyboard (`caption:`), format `*Judul* (gaya) | logline + fakta kunci/angka`, kirim sama ke tiap nomor.
9. **Thumbnail = detik pertama penuh**: shot s001 tahan komposisi cover ≥1 detik; set `fadeIn: 0` di config.json; verifikasi frame 0.0s/0.5s/1.0s (luminance > 10, judul terbaca).
10. **Ukur, jangan menebak (QC)**: ukur metrik frame (luminance/contrast/saturation/ink%) terhadap referensi bila tersedia; koreksi sebelum render penuh.
11. **Prop titik cerita per beat**: tiap beat ≥1 prop yang merangkum plot.
12. **Set dressing & kedalaman**: medium shot ≥5 prop + 1 foreground occluder + 1 background jauh; karakter pendukung unik; 3 layer kedalaman.
13. **Probe semua beat di tengah kalimat** sebelum render penuh.
14. **Narasi = subtitle burn-in, bukan UI overlay**: JANGAN taruh kalimat narasi/skrip panjang di `UI.readout`/judul atas. `readout`/top UI hanya untuk teks pendek (angka, label singkat, 1-3 kata/nilai). Narasi tampil lewat `--captions` (sinkron `timeline/words`) di zona bawah; ini mencegah teks terpotong/crop/overlap.
15. **Shot custom per beat, bukan generator siklik**: hindari pola komposisi berulang identik (mis. wide-bigFace siklik + label "BEAT n/N"). Tiap beat harus punya aksi/pose, ekspresi, dan komposisi spesifik yang menggambarkan kalimatnya (sutradara visual), agar ritme & emosi terbaca.
16. **Hook visual & emosi konkret**: detik pertama = momen/objek spesifik yang memancing emosi (bukan abstrak), kontras kuat, terbaca tanpa suara; detail angka/objek nyata di beat kunci.
17. **Mode Visual "GarisHidup (`@garishidup.idn`)" (`engine/garishidup.js`) — Default untuk Drama/POV Warga/Korupsi/Keuangan**:
    - **Karakter 3D-Shaded Capsule (`GH.figure`)**: JANGAN pakai garis hitam tipis di latar gelap. Gunakan figur kapsul ber-outline hitam tebal (`#090c10`) dengan isi **putih-krem terang (`role: 'hero'`, `#f5f2ea`)** untuk tokoh utama ("AKU"/warga), dan **slate-abu redup (`role: 'slate'`/`'mauve'`)** untuk tokoh pendukung/kerumunan, lengkap dengan highlight 3D lembut dan **refleksi vertikal di lantai (`reflect: true`)**.
    - **1 Aksen Emas Menyala (`#f5a623` / `#ffd166`)**: Batasi palet kanvas ke matte charcoal gelap (`GH.stage`), dan nyalakan **hanya 1 objek/elemen kunci per beat dengan warna emas berpendar** (toga wisuda, pipa uang pajak, angka kerugian, progress bar) agar mata penonton langsung terkunci.
    - **Arsitektur Split-Box Paralel (`GH.splitBoxes`)**: Untuk adegan kontras atau aksi simultan (mis. *Ibu menjahit di atas vs Anak belajar di bawah*, atau *Warga antre puskesmas di atas vs Koruptor santai di bawah*), bagi kanvas tengah menjadi 2 diorama kotak berbingkai slate yang berjalan serentak.
    - **3 Lapis Tipografi Rapi (Tanpa Readout Bocor)**:
      1. `GH.pill(g, '2019', { sub: 'SEMESTER', subHighlight: '5' })` — kapsul penanda bab/waktu di `y ≈ 11.5%`.
      2. `GH.headline(g, ['Toga ini', '*bukan* punyaku *sendiri.*'])` — kalimat kunci 1–2 baris dengan kata di dalam `*...*` otomatis berwarna emas menyala.
      3. `GH.microLabel(g, 'DIJUAL', x, y)` — label kapital kecil (`letter-spacing` lebar) mengambang tepat di atas prop atau kepala tokoh (`AYAH`, `IBU`, `AKU`, `DANA DESA`) sehingga cerita 100% terbaca bahkan saat di-mute.
    - **Metafora Visual Terukur (`GH.fuelGauge`, progress bar, timbangan)**: Setiap naskah wajib punya minimal 1 alat ukur visual (seperti 4 indikator bensin `E→F` yang disedot pipa emas, atau bar `HARI 2` vs `HARI 365`).
    - **Watermark Default**: Gunakan `watermark: 'develapar'` pada `GH.stage()` (bukan `GARIS HIDUP`).
18. **Integrasi Riset `STORYBOARD_FYP_SKILLTREE.md`**:
    - **S1 + M1 (Prediction Violation Hook ≤2s)**: Frame pertama langsung menampilkan kontras visual/angka yang melanggar prediksi umum.
    - **S2 + M2 (Gap Ladder) & S3 + M3 (RPE Payoff tiap 3–5s)**: Setiap 3–5 detik harus ada perubahan visual/prop baru (micro-payoff), jangan tahan 1 komposisi statis >4 detik.
    - **M7 (Self-Reference Lock) & M8 (Social Packaging)**: Gunakan sudut pandang `"kamu"` + struktur `pihak + niat + konsekuensi` agar memicu share & komentar.
19. **Rotasi 6 Arsitektur Panggung & 12 Widget Variasi `@garishidup.idn` (Wajib Dirotasi Agar Batch Tidak Monoton)**:
    - **Pola `Delayed Headline Reveal` (Silent Build-Up → Punchline di Akhir)**: Jangan tampilkan `GH.headline()` terus-menerus di setiap beat dari detik 0. Pada 65–75% awal cerita, cukup tampilkan `GH.pill()` / `GH.goldTimerPill()` / `GH.bigCounter()` di atas panggung agar penonton fokus pada gerak karakter & perubahan angka; munculkan `GH.headline(..., { reveal })` kata-demi-kata sebagai *punchline* di beat klimaks/akhir (kecuali frame `0.0s–1.0s` jika dibutuhkan untuk cover thumbnail).
    - **6 Layout Panggung yang Wajib Dirotasi Antar-Video / Antar-Beat (`engine/gh_layouts.js`)**:
      1. **Layout A — `Bordered Split-Box` (`GH.splitBoxes`, prefix `split_*`)**: 2 ruangan tertutup berbingkai slate dengan `topTag`/`botTag` di kiri atas tiap kotak + **`activeBox: 'top' | 'bottom' | 'both'`** (meredupkan kotak yang sedang tidak dibicarakan, lalu menyalakan keduanya serentak di klimaks — ref: `DfrzFUZlWQp`, `Dfmb3exl75y`, `DfmU2jDitKt`).
      2. **Layout B — `Borderless Open Split` (`GH.openSplitStage`, prefix `opensplit_*`)**: Panggung dibagi 2 lantai horizontal terbuka tanpa kotak pembatas, cocok untuk kontras progres waktu, papan denah vs realita, atau beban hidup (`HARI 2 vs HARI 365`, `GAJI Rp6,5 JUTA vs Rp2 JUTA`, `REVISI KE-9 vs ATAP BOCOR` — ref: `DfuDW_RilGY`, `DfredL_gDTk`, `DfpOVPjDXw-`, `DfpAn6BnHUf`, `DfjwJ96gGqb`).
      3. **Layout C — `Single-Stage Time-Lapse Counter` (prefix `timelapse_*`)**: 1 panggung tetap (gerobak warung/meja makan/loket), waktu di `GH.pill` melompat (`HARI 1 → HARI 7 → HARI 30`) diikuti lonjakan `GH.bigCounter` (`PEMBELI 30 → 0 → 21 → 54`), struk bergerigi `GH.receiptCard`, atau papan skor `GH.scoreboard` dan kerumunan `GH.crowdQueue` (ref: `DfmHNgpj9_-`, `DfloKV1jWo-`, `Dfj24HrEWH-`, `Dfo5nLnDig4`).
      4. **Layout D — `Reverse-Chronology Flashback` (`GH.goldTimerPill`, prefix `flashback_*`)**: Mulai dari kejadian akhir yang disalahpahami (`🕒 08.10` ditegur `"TELAT!"` atau notifikasi `GH.chatToast`), lalu mundur ke `🕒 05.00 ANTAR ANAK` → `🕒 07.40` kendala di jalan → kembali ke `🕒 08.10` dengan punchline empati (ref: `DfnuKikjEa4`, `DfmU2jDitKt`).
      5. **Layout E — `Multi-Scene Journey` (prefix `multiscene_*`)**: Perpindahan 3 latar tempat berurutan (mis. Parkiran Kantor `17.00` dengan plang `CICILAN 5 TAHUN` → Jalan Raya Malam dengan `GH.speechBubble("TAGIHAN CICILAN")` → Rumah Sederhana dengan `GH.angledStamp("LUNAS")` — ref: `DfrQuuDDcP1`).
      6. **Layout F — `Frame-in-Frame / Live Mirror` (prefix `mirror_*`)**: Panggung utama di bawah dengan bingkai foto/layar monitor di dinding atas yang memantulkan perubahan nasib secara langsung, termasuk `GH.ghostFigure({ mode: 'dashed', innerText: 'SIBUK' })` yang berubah menjadi `GH.ghostFigure({ mode: 'goldGlow' })` (ref: `Dfqx4qEkbzy`, `DfEi5OrDrCB`).
    - **12 Widget Baru di `engine/garishidup.js` v2.1**:
      - `GH.openSplitStage(g, { topTag, botTag, active, topDraw, botDraw })`
      - `GH.goldTimerPill(g, '08.10', { clockIcon: true, sub: 'ANTAR ANAK' })`
      - `GH.speechBubble(g, 'TELAT!', x, y, { tailDir: 'left', gold: false })`
      - `GH.bigCounter(g, '54', { label: 'PEMBELI', gold: true })`
      - `GH.expenseStack(g, { topLabel: 'GAJI', mainValue: 'Rp2 JUTA', items: ['KIRIM IBU 2 JT', 'SPP ADIK 1,5 JT', 'UTANG KELUARGA 1 JT'] })`
      - `GH.ghostFigure(g, { x, y, s, mode: 'dashed' | 'goldGlow', innerText: 'SIBUK' })`
      - `GH.angledStamp(g, 'LUNAS', x, y, { gold: true, angle: -0.08 })`
      - `GH.crowdQueue(g, { startX, floorY, count: 12, confetti: true })`
      - `GH.receiptCard(g, { x, y, topLabel: 'TOTAL', mainValue: 'Rp675.000', subLabel: 'DIBAGI 5 ORANG', gold: false })`
      - `GH.chatToast(g, { x, y, sender: 'BOS', message: 'Bawa berkas laporan ya.', tag: 'CHILL', timeStr: '06.58', gold: false })`
      - `GH.blueprintBoard(g, { x, floorY, topLabel: 'RENCANA', title: 'REVISI KE-9', crumpledCount: 6, gold: false })`
      - `GH.scoreboard(g, 4, 3, { leftLabel: 'KAMI', rightLabel: 'TAMU', sub: 'TRIBUN PENUH' })`

## Cara berpikir: Design Thinking (call graph)
1. Definisikan shape & happy path (A) dulu: `SCRIPT → voice → timeline (transcribe+beats) → bible+shots → sets+shots → sheet QC → render → mix → kompres → WA`.
2. Pisahkan error (E): 429 TTS → retry lalu fallback edge-tts; render crash → lapor; GPU stall → retry.
3. Deklarasi kebutuhan (R): ffmpeg, Chromium, koneksi WA. Batasi scope: render background, cleanup terstruktur.
4. Boundary: parse/validasi input eksternal (wav/json/captions/timing) di tepi.

## Anti-pattern
- Render foreground atau >1 render berat paralel di mesin CPU-only; selalu background, 1 job, concurrency terbatas.
- Lupa rim light → figur hilang di latar gelap.
- `Math.random()/Date.now()` di scene → non-deterministik; pakai `rng(seed)`.
- Shot statis: wajib gerak kamera + atmosfer.
- Kuota Gemini habis lalu berhenti; padahal edge-tts gratis.
- Kapasitas: jangan 4K; 720p cukup untuk WhatsApp.
- Prefix instruksi TTS ikut terucap → deteksi (Whisper) dan potong, lalu re-timing.
- Abaikan API engine (signature UI/poly/FX, import) → baca `engine-api.md` dulu.
- Playwright Chromium Windows rusak/macet instal → perbaiki instalasi/executable path sesuai kebutuhan.
- Readout/label di band caption (y>72% H, 9:16) atau posisi lanskap dipaksa ke vertikal tanpa `V(h,v)`.

## Verifikasi sukses
- [ ] doctor.py OK, kit 29/29.
- [ ] Transcribe/timing valid; jika subtitle meleset, transcribe.py sudah dipulihkan dari sumber plugin.
- [ ] Sheet QC dilihat: no MISSING/ERROR, rim light, mood konsisten, UI/chart pixel-perfect (HyperFrames bila perlu) tanpa tabrakan.
- [ ] mp4 final: durasi ≈ shots.json, audio ada, -14 LUFS.
- [ ] Subtitle tampil & sinkron, kaki jalan natural, ilustrasi fisika jelas, snap CU.
- [ ] Kirim WA sukses ke semua nomor + arsip wa-send (asli & versi WA).
- [ ] Routine pemantau dihapus.
