---
name: animasi-3d-jadibegini
description: 'Pipeline produksi video edukasi sains vertikal 40-75 detik gaya "@JadiBeginiClip" dan "@theofficeexplainer" di mesin CPU-only (tanpa GPU): panggung 3D low-poly (sawah berair/kelas kantor) lewat engine/gh3d.js + three-kit, karakter kepala bulat krem dengan pipi merona + kumis + caping/peci atau rambut bowl-cut + lanyard, banner hook 3 baris dengan baris terakhir kuning, pill emas melayang, subtitle burn-in putih/kuning, judul "Kenapa ... ?", music + SFX, render headless Chromium swiftshader, dipandu Design Thinking 10 langkah.'
example-prompt: Buat video 3D gaya JadiBeginiClip tentang kenapa petani menanam bunga di pematang sawah, kirim ke WhatsApp.
---

# Animasi 3D Low-Poly "Jadi Begini" / "Office Explainer"

Sumber gaya: riset 31 short `@JadiBeginiClip` (17) + `@theofficeexplainer` (14),
tersimpan di repo ini: `research/3d-hybrid/STYLE_BREAKDOWN_3D_HYBRID.md`,
`channel_manifest.json`, `thumbnails/`. Angka dan pola judul di dokumen itu adalah
**data riset**, bukan template naskah.

Baca dulu bila perlu detail: `references/style-bible-3d.md` (resep visual per set,
framing kamera, tabel anti-pattern).

Kit acuan = **root repo `ai-animation-render` ini** (`engine/`, `audio/`, `tools/`,
`render.mjs`). Proyek contoh hidup: `examples/jb-refugia-pematang/` (9 shot 3D,
63 detik). Kalau di mesin lain repo di-clone ke folder lain, ganti path di bawah
dengan root repo itu.

## Kapan skill ini dipakai
- Video edukasi "kenapa X?" / "apa yang terjadi kalau X?" yang butuh **dunia 3D**
  (sawah, ladang, kolam, kantor, gudang, jalan kampung) — bukan panggung 2D.
- Kalau user minta gaya `@garishidup.idn` (split-box, latar charcoal, 1 aksen emas
  di panggung 2D), pakai skill `animasi-2d-stick-maen`, **bukan** skill ini.
- Kata kunci pemicu: `jadibegini`, `jadi begini`, `office explainer`,
  `3d low poly`, `stick-3d`.

## Perbedaan fondasi (jangan dicampur)
| | Gaya ini (3D) | `animasi-2d-stick-maen` (2D) |
|---|---|---|
| Ruang | Scene Three.js `kind: '3d'` via `engine/three-kit.js` + `engine/gh3d.js` | kanvas `GH.stage()` 2D |
| Karakter | kepala bulat krem + blush/kumis/caping-peci, badan lurus tanpa outline tebal | kapsul 3D-shaded putih/slate ber-outline |
| Kamera | dolly/orbit nyata (`camera.position` + `lookAt`) | kamera 2D `layer()` |
| Hook atas | banner 3 baris, baris terakhir kuning | headline reveal + pill bab |
| Ending | fakta + sumber ilmiah di deskripsi | punchline headline |

Keduanya berbagi rig pose (`engine/rig2d.js` → `POSES`), audio (`audio/`), dan
runner render (`render.mjs`) yang sama. **Jangan menimpa `engine/garishidup.js`
atau `engine/gh_layouts.js`** saat menambah gaya 3D.

## Design Thinking (wajib, lihat `design-thinking/README.md`)
```ts
Production (3D):
ShapeNaskahDanFakta (shapes: Shot3D, CharOutfit, Banner, Beat)
  → A: script.txt → edge-tts WordBoundary words.json → shots.json → world()+registerShot
    → R: three@0.169 / Playwright / ffmpeg / font Fredoka-Nunito / render_throttled
      → E: sheet gagal | music objek | swiftshader lambat | Teks tabrakan (tabel titik pecah)
        → Swap R: --sheet 9 still (1-2 mnt) MENGGANTIKAN render 1.500 frame (20-70 mnt)
          → Scope: world() di-dispose per shot; 1 job render berat
            → A/E pisah: draw() hanya menggambar, error di player.js + runner python
```
Titik pecah (langkah 4) dan penanganannya:

| Titik | Gejala | Penanganan |
|---|---|---|
| WebGL context hilang | frame hitam total | wajib `--gl swiftshader` |
| Mesh terlalu banyak | 0,3 fps | `InstancedMesh` (padi/rumput), `flatShading` |
| Teks 3D tak terbaca | blur saat kamera geser | teks **selalu 2D overlay**, bukan `CanvasTexture` di mesh |
| Timing kata meleset | subtitle di luar audio | perbaiki naskah lalu re-align, jangan geser timing |
| `music` objek | `mix.py` crash `TypeError: string indices` | `music` wajib list `{start,end,mood,intensity}` |

## Prasyarat lingkungan (cek sebelum menulis naskah)
1. Root repo: `npm install` (three 0.169, playwright, font Fredoka/Nunito).
2. `python tools/doctor.py` → semua OK.
3. ffmpeg di PATH sesi (Windows contoh: `C:\Users\Admin\tools\ffmpeg-9.0.2-essentials_build\bin`;
   tambahkan ke `$env:PATH` bila doctor komplain).
4. Render 3D **wajib** `--gl swiftshader` di mesin tanpa GPU. Terukur ≈1-2 fps
   (render 63 detik/1.496 frame = ~85 menit di 2 worker) — jauh lebih lambat dari 2D
   (≈7 fps). Render di background, boleh dipantau routine.
5. Satu job render berat saja; throttle lewat `python tools/render_throttled.py` dengan
   argumen langsung (tanpa `--`), mis.:
   `python tools/render_throttled.py node render.mjs --project examples/<slug> --workers 2 --format jpeg --crf 20 --gl swiftshader`

## Engine API (ringkas, lengkap di file)
`engine/three-kit.js` (dunia 3D): `getRenderer mat basic canvasTex stage box cyl cone
sphere plane ground planks tiles windowPane shaft building tree3D pine3D crowd3D
figure3D orbit dolly`.

`engine/gh3d.js` (gaya JadiBegini; semua prosedural, tanpa GLB):

| Grup | Fungsi |
|---|---|
| Karakter | `person(T, outfit, {pose, s, rim})` + preset `FARMER FARMER2 TENGKULAK WORKER BOSS` |
| Field | `waterPlane hills bund paddyField flowers coconut hut powerPole signBoard` |
| Bukti naratif | `insectSwarm leafWithHole` |
| Overlay 2D | `banner statPill keyword subs project` |

`project(stage, v3)` mengubah koordinat 3D → 2D layar; pakai ini untuk menempel
pill/label tepat di atas kepala karakter.

## Pipeline 8 langkah
1. **Naskah** (149-190 kata, 3,2-3,5 kata/detik): hook 1-2 kalimat yang
   mempertanyakan tindakan yang tampak salah → tuduhan/penolakan orang lain →
   kejadian yang membuktikan → penjelasan mekanisme (nama ilmiah/istilah) →
   aturan praktik → payoff. Setiap angka harus dari sumber terverifikasi
   (Kementan/BBPOPT, jurnal, dokumentasi resmi); tanpa sumber → jangan tulis angka.
2. **Voice**: edge-tts `id-ID-ArdiNeural` `+18%` (default). Alternatif
   `id-ID-GadisNeural` untuk topik ringan. Simpan `words.json` dari `WordBoundary`;
   alignment harus 100% (kalau tidak, perbaiki naskah, bukan timing).
3. **Beat**: kelompokkan kalimat jadi 7-9 shot; tiap shot 4-9 detik. Generator:
   `tools/jb_refugia_shots.py` (contoh hidup; salin lalu ubah `GROUPS`+`SFX`).
   `music` di `story/shots.json` **wajib list** `{start,end,mood,intensity}` —
   bukan objek `{sections: [...]}` (mix.py akan gagal).
4. **Dunia + shot**: `scenes/shots/01_main.js` mendefinisikan `world()` (satu kali
   per shot, di-dispose otomatis) lalu `registerShot('<sid>', { kind: '3d', init, draw, overlay })`.
   Wajib: `return { st, stage: st, ... }` — `player.js` memanggil `(st.stage || st).render()`.
5. **QC sheet**: `node render.mjs --project examples/<slug> --sheet --scale 0.5 --gl swiftshader`,
   lalu **lihat PNG-nya**. Tolak kirim kalau ada: karakter terpotong, teks menabrak
   wajah/banner, bidang putih polos, bunga/pohon raksasa di depan lensa.
6. **Audio**: `python audio/mix.py --project examples/<slug>` → `build/mix.wav`
   (−14 LUFS, ducking −9 dB). SFX tersedia: `whoosh hit tick pop ding shimmer
   buzz riser stinger impact clock counter brake` (lihat `python audio/sfx.py --list`).
7. **Render final**: background + throttle, `--workers 2 --format jpeg --crf 20`.
8. **Mux + kirim**: jalankan `mix.py` lagi setelah `video_silent.mp4` ada (menulis
   `out/<judul>.mp4`), cek `ffprobe` (durasi, 720×1280, audio aac), kompres WA
   ≤12 MB (`-crf 28 scale=720:-2`), arsip ke folder kirim, lalu **hapus routine pemantau**.

## Resep panggung 3D yang dikunci
- **Kamera di +z menghadap −z.** Pematang/karakter di `z 0`, petak padi `z -4,8..-0,9`,
  pohon/tiang `z -22..-34`, gubuk `z -32`, bukit `z -30..-46`. Bila urutan ini dibalik,
  padi akan menutupi karakter.
- **Karakter berdiri di atas pematang**: `y = 0,26` (tinggi `bund()`), bukan `y = 0`.
- **Framing**: kamera `z 2,4-3,5`, tinggi `y ≈ 1,24-1,30`, FOV 38-46 (vertikal),
  bidik `y = ty`. Efek: karakter tampil dada ke atas seperti thumbnail channel.
  Kamera **harus** memakai `lookX` = posisi x karakter, bukan selalu 0.
- **Palet langit** 4-stop: `['#2f6fb8','#7fb3dd','#cfe4f2','#f4ead2']` (siang),
  `['#3c5c96','#8fa6c4','#eec49a','#fbe2bc']` (golden),
  `['#4e5e80','#7d8ea8','#a8b6c6','#ccd4dc']` (mendung).
- **Air sawah**: `plane` `roughness 0.14 metalness 0.42`, `y 0.015` — memantulkan
  langit tanpa reflection probe.
- **Padi**: `paddyField()` memakai `InstancedMesh` (1 draw call). Jangan ganti ke
  mesh per helai; swiftshader akan 5-10× lebih lambat.
- **Bunga refugia**: dua deret — pematang dekat `z -1.8` dan pematang jauh `z -13`.
  Jangan taruh di `z > +2` (akan jadi bunga raksasa di depan lensa).
- **Matahari**: sprite aditif `sunGlow()`, **bukan** bola mesh di origin (bug:
  frame jadi putih total). Posisi contoh `(-20, 11, -60)`.
- **Bukit**: sphere yang di-scale (`hills()`), bukan cone tajam.
- **Serangga**: `insectSwarm()`; sayap `opacity 0.28`, `scale 1.25/0.22/0.75`.
- **Mood gelap**: jangan pakai mood `storm` untuk shot yang harus terbaca —
  turunkan lewat palet langit dusk + `keyIntensity ≈ 2,2`, `ambient 1,5`.

## Karakter & kostum
| Preset | Dipakai untuk | Ciri |
|---|---|---|
| `FARMER` | petani protagonis | kemeja merah, caping, kumis, blush |
| `FARMER2` | petani kedua (netral) | kemeja hijau, peci |
| `TENGKULAK` | juragan/pihak yang menertawakan | kemeja cokelat, peci, kumis |
| `WORKER` | orang kantor ("Bagas") | kemeja kuning, rambut bowl-cut |
| `BOSS` | atasan/pejabat | suit slate, rambut slick |

Semua lewat `G.person(T, OUTFIT, { pose })`; wajah: mata gelap, blush `#e8899b`,
kumis torus — jangan hapus, itu identitas gaya.

## Zona teks 9:16 (tanpa tabrakan)
- Banner hook: `y ≈ 130`, maksimum 3 baris @ size 50; baris terakhir kuning
  (`#ffd23f`). Hanya di beat 1 (atau beat 1-2), bukan sepanjang video.
- Keyword payoff: `y ≈ 1280-1300`, size 38-96, sub-label kecil di bawahnya.
- Subtitle burn-in: `y 1530`, size 58, 4 kata/baris, aktif kuning. Digambar oleh
  `G.subs()` di `overlay` **setelah** keyword, jadi keduanya tidak bertumpuk.
- Badan karakter aman di `y 700-1250`; jangan taruh keyword di sana.

## Judul & paket publikasi
- Format judul `@JadiBeginiClip`: **`Kenapa … ?`** (15/17 video). Subjek orang
  ketiga (`Petani Ini`, `Dia`, `Juragan`), tindakan yang tampak salah.
- Format judul `@theofficeexplainer`: **`Apa yang terjadi kalau … ?`**.
- Deskripsi: 2-4 baris penjelasan + **Sumber** ilmiah (nama lembaga + judul
  artikel). Nol CTA komentar di gaya JadiBegini; CTA "Komen KEPO" hanya untuk
  gaya office.
- Hashtag: 3-5, gabungan topik + `#Shorts`.

## Aturan WAJIB (QC)
1. **Karakter utuh di semua beat**: 2 mata, blush, kumis/caping terlihat; tidak
   terpotong frame. Cek di sheet.
2. **Subtitle sinkron** dengan `timeline/words.json`; kata aktif kuning; tidak
   pernah menutupi keyword payoff (cek jarak ≥ 120 px).
3. **Satu beat = satu perubahan** (gerak kamera, pose, atau prop baru). Jangan
   tahan komposisi statis > 4 detik.
4. **Klaim visual wajib ada buktinya**: kalau narasi bilang "daun berlubang",
   tampilkan `leafWithHole()`; kalau bilang "serangga datang", tampilkan
   `insectSwarm()`. Bukti minimal 2 detik.
5. **Prop titik-cerita per beat** ≥ 1 (caping, daun, plang, serangga, bunga).
6. **Jangan render penuh sebelum sheet lolos.** Sheet 9 still ≈ 1-2 menit;
   render penuh ≈ 20-85 menit tergantung durasi.
7. **Verifikasi hasil**: `ffprobe` (durasi ±0,2 s, 720×1280, ada audio),
   cek 3 frame acak dari video jadi (bukan cuma dari sheet).
8. **Sumber fakta**: setiap angka/nama ilmiah harus bisa ditunjuk sumbernya;
   kalau tidak ada, ganti jadi kalimat kualitatif.
9. **Watermark**: kosongkan kecuali user minta.

## Anti-pattern (jangan diulang)
- Karakter `y = 0` di atas pematang `y = 0.26` → kaki terbenam.
- Kamera selalu `lookAt(0, …)` padahal karakter di `x = 0.9` → karakter terpotong.
- Bunga/rumput di `z > +2` → kelopak raksasa menutupi layar.
- `sun` sprite di `(0,0,0)` → frame putih total.
- `music` sebagai objek `{sections}` → `mix.py` crash `TypeError: string indices`.
- Menjalankan `render_throttled.py -- node ...` → `FileNotFoundError`; tanpa `--`.
- Musik `tension` sepanjang video → penonton lelah; wajib pindah ke `hopeful`
  di 60-65% durasi.
- Menulis JSON config dengan PowerShell `ConvertTo-Json` (menambah BOM) →
  `render.mjs` gagal `Unexpected token '\uFEFF'`. Tulis dengan Python `json.dumps`.
- `captions: true` tetapi subtitle tidak digambar di `overlay` → video bersubtitle
  kosong. Di gaya 3D subtitle digambar manual lewat `G.subs()`, jadi set
  `"captions": false` di `config.json` dan gambar sendiri di `overlay`.

## Verifikasi cepat (dipakai setiap job)
```
node render.mjs --project examples/<slug> --sheet --scale 0.5 --gl swiftshader
python audio/mix.py --project examples/<slug>
python tools/render_throttled.py node render.mjs --project examples/<slug> --workers 2 --format jpeg --crf 20 --gl swiftshader
python audio/mix.py --project examples/<slug>          # mux setelah silent ada
ffprobe -v error -show_entries format=duration:stream=width,height,codec_name out/<judul>.mp4
```
