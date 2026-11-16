# Style bible — `stick-2d` (`@garishidup.idn` v2.1)

Mesin: `engine/garishidup.js` (+ `engine/gh_layouts.js` untuk 6 arsitektur panggung).
Contoh proyek: `examples/gh-v11-telat-lima-menit/`.

## 1. Panggung
| Elemen | Nilai |
|---|---|
| Kanvas | `9:16`, `720×1280`, `24 fps` |
| Latar | radial navy-charcoal `#121821 → #070a0f` (`GH.stage`) |
| Lantai | garis horizon di `floorY` (umumnya `E.H * 0.66`) |
| Refleksi | figur `reflect: true` → bayangan vertikal di lantai |
| Aksen | **1 elemen emas menyala per beat** (`#f5a623` / `#ffd166`) |
| Watermark | bebas sesuai permintaan user; kosongkan bila tidak diminta |

## 2. Karakter (kapsul 3D-shaded)
| Peran | Warna isi | Dipakai untuk |
|---|---|---|
| `hero` | `#f5f2ea` putih-krem | tokoh utama ("AKU", warga) |
| `slate` | abu redup | pendukung / kerumunan |
| `mauve` | ungu redup | pendukung alternatif |
| `gold` | emas | antagonis / oknum / objek kunci |

Outline hitam tebal `#090c10`, highlight 3D lembut di sisi terang. Jangan pakai
garis hitam tipis — figur akan hilang di latar gelap.

## 3. Tipografi (3 lapis, tanpa readout bocor)
1. `GH.pill(g, '2019', { sub: 'SEMESTER', subHighlight: '5' })` di `y ≈ 11.5%`.
2. `GH.headline(g, ['Toga ini', '*bukan* punyaku *sendiri.*'])` — `*kata*` = emas.
3. `GH.microLabel(g, 'DIJUAL', x, y)` — label kapital di atas prop/kepala.

Pola **Delayed Headline Reveal**: 65-75% awal cerita hanya `pill`/`goldTimerPill`/
`bigCounter`; `headline(..., { reveal })` muncul sebagai punchline di klimaks.

## 4. Zona 9:16 (tanpa tabrakan)
| Band | Isi |
|---|---|
| `y 8%-22%` H | `pill` / `headline` / readout pendek |
| `y 25%-68%` H | subjek & ilustrasi |
| `y 72%-92%` H | caption burn-in saja |
| `y 79%` H | baris caption aktif (`gap = 0.46 × size`, aktif emas) |

Maksimal 2 elemen UI teks bersamaan selain caption.

## 5. 6 arsitektur panggung (rotasi wajib antar video/beat)
| Layout | Fungsi | Prefix scene |
|---|---|---|
| A `Bordered Split-Box` | 2 diorama berbingkai + `activeBox: 'top'\|'bottom'\|'both'` | `split_*` |
| B `Borderless Open Split` | 2 lantai terbuka (kontras progres/waktu) | `opensplit_*` |
| C `Single-Stage Time-Lapse Counter` | 1 panggung + waktu melompat + `bigCounter` | `timelapse_*` |
| D `Reverse-Chronology Flashback` | mundur dari kejadian akhir (`goldTimerPill`) | `flashback_*` |
| E `Multi-Scene Journey` | 3 latar berurutan | `multiscene_*` |
| F `Frame-in-Frame / Live Mirror` | monitor/foto di dinding memantulkan perubahan | `mirror_*` |

## 6. Irama & audio
- 12 beat naratif, 55-90 detik; hook ≤ 6.5 detik.
- Musik `-17 dB` di bawah voice (`audio/music.py`), SFX `-6 dB`, master `-14 LUFS`.
- Ducking musik `-9 dB` saat voice aktif (`audio/mix.py`).

## 7. Biaya render (terukur, CPU-only)
| Konfigurasi | fps | 63 detik |
|---|---|---|
| 2D, 2 worker, `--format jpeg --preset veryfast` | ~7-7.5 | ~4 menit |

Bandingkan gaya 3D: 0,28 fps (~85 menit) — lihat `skills/animasi-3d-jadibegini/`.

## 8. Anti-pattern
- Figur tanpa rim light di latar gelap → tak terbaca.
- `Math.random()` / `Date.now()` di scene → render non-deterministik.
- Shot statis tanpa gerak kamera/atmosfer.
- Narasi panjang di `UI.readout` → terpotong; narasi hanya lewat `captions`.
- Readout/label masuk band caption (`y > 72%`) → tabrakan dengan subtitle.
- Render foreground atau >1 render berat paralel.
- Watermark dipatenkan padahal user tidak minta.
