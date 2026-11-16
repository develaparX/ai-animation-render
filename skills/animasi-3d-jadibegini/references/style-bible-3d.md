# Style bible — 3D low-poly "Jadi Begini" / "Office Explainer"

Rujukan angka & pola: `research/3d-hybrid/STYLE_BREAKDOWN_3D_HYBRID.md` (repo ini).

## 1. Dua keluarga set

### A. Field (sawah / ladang) — `@JadiBeginiClip`
| Lapisan | Isi | Nilai |
|---|---|---|
| Langit | gradien 4-stop + fog `[30,130]` | siang `#2f6fb8 → #f4ead2` |
| Bukit jauh | `hills()` sphere di-scale, 2 baris | `z -46` (h 9) & `z -30` (h 5,2) |
| Air sawah | `waterPlane()` roughness 0,14 metalness 0,42 | `z -16`, `y 0,015` |
| Padi | `paddyField()` InstancedMesh | `z -4,8..-0,9`, h 0,62 |
| Pematang | `bund()` box tanah | `z 0,95` (karakter) & `z -1,8` (bunga) |
| Bunga refugia | `flowers()` 2 deret | `z -1,8` (46-84) & `z -13` (30) |
| Pohon | `coconut()` 3 buah | `z -26..-34`, scale 1,2-1,5 |
| Gubuk | `hut()` | `z -32`, scale 1,3 |
| Tiang listrik | `powerPole()` | `z -22` |
| Matahari | `sunGlow()` sprite | `(-20, 11, -60)` |

Semua fungsi di atas ada di `engine/gh3d.js`.

### B. Office (kantor) — `@theofficeexplainer`
| Lapisan | Isi |
|---|---|
| Lantai | parket `tiles('#3a2a1e')`, meja kayu 2,4×0,09×1,2 |
| Dinding | `#2f3444` + partisi kubikel 1,55 m (`cubicle()`) |
| Jendela | `windowPane(6, 3.4, { interior: true })` + `shaft()` miring |
| Karakter | `WORKER` (Bagas: rambut bowl-cut, kemeja batik, lanyard ID merah) |
| Overlay | pill emas melayang (`8,5 JT`) + CTA "Komen KEPO" |

## 2. Framing kamera (kunci tampilan channel)
- Karakter **dada ke atas** mengisi ~55-70% tinggi frame.
- Kamera `z 2,4-3,5`, tinggi `y 1,22-1,30`, FOV vertikal 38-46.
- `lookX` **selalu** = x karakter; `lookY` = `ty`.
- Gerak: dolly maju pelan 0,4-0,6 m per shot (`ease.inOut`), bukan zoom.
- Shot dua orang: rapatkan `x ±0,5-0,6`, kamera `z 3,6-4,1`, FOV 45-46.

## 3. Overlay teks
| Elemen | Posisi | Ukuran | Warna |
|---|---|---|---|
| Pill kanal + badge | `y 130` | 50 | krem + badge `#f4c22b` |
| Hook 3 baris | mulai `y ≈ 225` | 50 | putih, baris akhir `#ffd23f` |
| Keyword payoff | `y 1280-1300` | 38-96 | `#ffd23f` / `#9ee85a` |
| Sub-label keyword | `+0,8 × size` | 0,4 × size | `#eef3ff` |
| Subtitle | `y 1530` | 58 | putih, aktif `#ffd23f` |

Digambar dari `banner() statPill() keyword() subs()` — semuanya overlay 2D di atas
canvas WebGL, **bukan** teks di dalam scene 3D.

## 4. Palet
- Karakter: kulit `#fdf3e3`, blush `#e8899b`, kumis `#241a12`, outline `#0d0f14`.
- Padi sehat `#4e7a2e`, padi sakit `#b09534`, air `#8fa8a4`, tanah `#4a3f2a`.
- Aksen UI: kuning `#ffd23f`, hijau payoff `#9ee85a`, pill emas `#f0b429`.
- Style id di `engine/styles.js`: `jadiBegini` (grade: contrast 1,06 / sat 1,08 /
  vignette 0,26 / grain 0,04 / bloom 0,5).

## 5. Irama & audio
- 7-9 shot; shot hook 5-7 s, shot penjelasan 5-9 s.
- Musik: `mystery` (0-42%) → `tension` (42-62%) → `hopeful` (62-100%).
- SFX: 2 cue per shot (satu di awal transisi, satu di titik klaim).
- `buzz` hanya untuk shot serangga; `shimmer` untuk reveal nama ilmiah;
  `hit` untuk penolakan/klaim tegas; `ding` untuk payoff.

## 6. Judul & deskripsi
- `Kenapa <subjek> <tindakan yang tampak salah>?` (JadiBegini)
- `Apa yang terjadi kalau <hipotesis>?` (Office)
- Deskripsi: 2-4 baris + `Sumber:` lembaga + judul artikel. Tanpa CTA komentar
  di gaya JadiBegini.

## 7. Performa (terukur di mesin CPU-only)
| Konfigurasi | fps | 63 s (1.496 frame) |
|---|---|---|
| 3D, 2 worker, `--gl swiftshader` | 0,28 | ~85 menit |
| 2D, 2 worker | ~7 | ~4 menit |

Artinya: **sheet dulu, render penuh belakangan**, dan jadwalkan render 3D sebagai
satu-satunya job berat pada jam itu.
