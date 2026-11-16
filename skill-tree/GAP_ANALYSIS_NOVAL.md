# GAP ANALYSIS — Kenapa Hasil Pipeline Kalah dari @novalcemerlang

Tanggal: 15 Nov 2026 · Riset: Design Thinking · Sumber primer: transkrip penuh video Mr omi
"How to Make Viral Animated Shorts Using Claude" (1,07 jt views), scan akun
TikTok/IG @novalcemerlang, 4 thumbnail video diunduh (docs/noval_ref/).

## 1. FAKTA AKUN REFERENSI (terverifikasi)

- IG @novalcemerlang: 225 follower, 9 post, bio "Konten animasi bahas ranah kerjaan dengan seru dan asik".
- TikTok @novalcemerlang: 196 follower, 4.311 likes, 14 video. Bukan akun besar — tapi KUALITAS visualnya premium.
- Seri: karakter bernama berulang ("Bagas" anak magang, "Dian"), format "Apa yang terjadi kalau…?" (what-if kantor) + sejarah pendek.
- Struktur caption: hook pertanyaan → eskalasi lucu dengan angka konkret → twist → CTA "Komen KEPO ya" (engagement bait, menjual aplikasi Meeting.ai).
- VISUAL (dari thumbnail): gaya bean-3D yang SAMA dengan pipeline kita (ktemplate Mr omi) — tapi frame-nya PADAT.

## 2. KENAPA FRAME MEREKA TERLIHAT "PREMIUM" (bedah 4 thumbnail)

| Elemen | novalcemerlang | Pipeline kita (N2) |
|---|---|---|
| Prop titik cerita | Tag gaji "8,5 JT" MELAYANG di atas kepala (visual = plot) | Tidak ada — narasi tidak pernah diwujudkan jadi prop |
| Set dressing | Meja kubikel, pintu berlabel HRD, tanaman, kopi, monitor, botol; crate C.P.R.R, tiang telegraf, kereta berasap di kejauhan | Rumah kotak polos, dinding kosong, jalan kosong |
| Kostum karakter | Kemeja batik motif, lanyard + name tag "Dian", dasi, rompi + rantai jam, topi bowler | Jaket warna flat, tanpa aksesori |
| Wajah pendukung | Kacamata, kumis, janggut, topi beda-beda — tiap warga unik | Swap warna, wajah generik sama |
| Kedalaman | 3 layer: foreground (HP di meja, rantai), midground (karakter), background blur (skyline) | 1-2 layer; kamera kadang DI DALAM box (defect beat 7) |
| DOF | Background blur kuat → mata ke karakter | DOF ada tapi background sering sharp |
| Mood cahaya | Ikut beat: kantor hangat → malam candle-light dramatis | day/golden hanya |

## 3. TEMUAN TRANSCRIPT MR OMI (metode yang kami BELUM jalan penuh)

1. **UKUR, jangan menebak**: "Don't ask Claude what it thinks. Make it measure. You can't
   recreate an opinion. You can recreate a number." — contact sheet 60 frame/gambar (549 sheet
   dari 32.000 frame), tracking kamera via phase correlation, metrik brightness/contrast/
   saturation per video.
2. **QC angka menemukan bug yang mata lewatkan**: ink lines 3/4 edge di referensi vs NOL di
   versinya (efek ink ada tapi dibuang pass blur yang jalan di step sama); kamera snap 3 frame
   vs glide 23 frame (slow in slow out); tanpa pure black; bayangan senja UNGU (bukan cokelat);
   badan 3,5 kepala (punya <3); lengan 5x terlalu tebal; background blur vs sharp.
3. **Tim agent terstruktur**: 7 agent bedah gap (warna, ink, cahaya, tekstur, karakter,
   framing, motion) + 1 sound + 4 agent rebuild — **tiap agent punya COPY proyek sendiri dan
   own file masing-masing**, merge file-per-file (bukan cuma bagi tugas).
4. **Naskah**: paradoks di kalimat pertama TANPA intro; eskalasi; pivot dua kata "You see?";
   payoff twist; ~4 kata/detik ZERO dead air; fakta diverifikasi dulu (tanggal, jumlah,
   kedalaman sungai 2 feet) → fakta jadi punchline terbaik "Luckily… / Unluckily…".
5. **Dedup ide**: topik yang sudah dibahas channel referensi (5,7 jt views) DIBUANG.
6. Referensi: 20 video × 30 fps × semua frame = 5.000 gambar referensi di repo skill-nya.
   Kita hanya memakai 240 frame.

## 4. DESIGN THINKING — DI MANA GRAFIK KITA BEDA

```
Pipeline mereka (rekonstruksi dari transcript)
Task
  → Riset referensi (20 video, SEMUA frame, contact sheet + metrik)
    → Style bible TERUKUR (ink %, shadow hue, prop density, glide frames)
      → Naskah (paradoks → eskalasi → pivot → twist; fakta dicek; dedup)
        → Build world+props (prop titik cerita + dressing + foreground)
          → Probe still SEMUA shot → bandingkan frame ke frame vs referensi
            → 7 agent gap + 4 agent rebuild (file ownership terpisah)
              → Render → mix → post
Pipeline kita
Task
  → Storyboard (fakta dicek ✓)
    → Build world (props minimal) ✗
      → Probe still SAMPEL (bukan semua beat) ✗
        → QC mata (tanpa angka) ✗
          → Render → mix → WA ✓
```

Gap node: (a) prop design per beat, (b) set dressing density, (c) QC terukur,
(d) perbandingan side-by-side vs referensi, (e) dedup + hook paradoks.

## 5. PERBAIKAN YANG DITANAM KE SKILL (v14 / v12)

1. **PROP TITIK CERITA**: tiap beat wajib ≥1 prop yang MERANGKUM plotnya (tag gaji melayang,
   mahkota + nampan, crate bertuliskan) — visual IS the joke.
2. **SET DRESSING MINIMAL**: tiap medium shot ≥5 prop kontekstual + 1 foreground occluder +
   1 elemen background jauh. Dinding kosong = gagal QC.
3. **KARAKTER UNIK**: pendukung beda wajah (kumis/kacamata/janggut/topi) + kostum
   bermotif/beraksesori (batik, lanyard, dasi, rompi). Flat color = gagal.
4. **3 LAYER KEDALAMAN**: foreground (potong frame), midground (karakter), background blur.
5. **QC TERUKUR** `scripts/qc_measure.py`: luminance/contrast/saturation + edge-density
   (ink %) + prop-region variance + camera drift antar frame → bandingkan dengan frame
   referensi; lulus kalau angka mendekati referensi, bukan "kayaknya bagus".
6. **PROBE WAJIB SEMUA BEAT** di tengah kalimat (bukan sampel) sebelum render penuh.
7. **KAMERA**: transisi ≥20 frame glide slow-in/out; tanpa pure black; bayangan senja ungu.
8. **NASKAH**: hook paradoks kalimat 1 (ID: "Apa yang terjadi kalau…?"), zero dead air,
   pivot "Tahu nggak?", pasangan "Untungnya…/Sayangnya…" dari fakta, CTA komentar,
   dedup cek dulu di referensi. Tempo 3,3–3,5 w/s (aturan baru).

## 6. CATATAN RISET WEB

WebSearch environment mengembalikan hasil kosong berulang; riset internet dilakukan lewat
sumber primer: transkrip lengkap video metodologi (YouTube), data profil TikTok/IG via
browser, dan Google Search result scrape. Temuan tools AI (Veo/Kling/Sora) tidak relevan
untuk gaya ini — akun referensi dan Mr omi SAMA-SAMA pakai three.js+Remotion di PC lokal,
bukan AI video generator. Kualitas datang dari disiplin referensi + QC terukur, bukan model video AI.
