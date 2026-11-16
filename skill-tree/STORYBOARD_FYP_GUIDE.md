# STORYBOARD FYP GUIDE — Hasil Riset Multi-Sumber (2026-11-15)

Riset cara membuat storyboard yang bagus untuk konten FYP/short-form (TikTok/Reels/Shorts).
Sumber web: StudioBinder, Boords, Wikipedia, Hootsuite. Sumber internal: skill `flow-retention-craft`
(intisari 9 riset X.com + 20 formula hook ID). Catatan: WebSearch engine down sepanjang sesi
(0 hasil); riset web dilakukan via direct-fetch ke situs otoritatif. MrBeast doc dicari, tidak terverifikasi.

---

## 1. Angka Retensi Kunci (gabungan 9 riset X + Hootsuite/TikTok)

| Aturan | Nilai | Sumber |
|---|---|---|
| Keputusan swipe penonton | 2.5–3 detik pertama | Orpheus Kaze |
| Hook terucap tuntas | ≤2.5s, maks 6–9 kata | Orpheus Kaze / hook vault |
| Micro-payoff (hadiah visual/info baru) | tiap 3–5 detik | Orpheus Kaze |
| Pattern interrupt (sudut/objek/SFX kontras) | tiap 3–4 detik | Your Dumble |
| Dead air (jeda diam) | <0.3 detik | Orpheus Kaze |
| Ritme vokal | 160–175 WPM | Dopamine Crypto |
| Curiosity loop: buka di t=0, tutup | detik ke-25 (atau menjelang akhir) | Dopamine Crypto |
| Sound bridge (J-cut: audio sebelum gambar) | 0.2 detik | Your Dumble |
| Cut | on motion / peak velocity, tidak saat diam | Boris |
| Fokus bergerak di layar | hanya 1 per waktu | Frontman |
| Palet warna | maks 3 harmonis | Frontman |
| Teks overlay | wajib (>30% tonton tanpa suara) | Hootsuite/TikTok |
| Sinyal FYP terkuat | watch time, completion, rewatch, share (bukan like) | Hootsuite |
| Loop | frame akhir nyambung ke frame awal → rewatch | sintesis |

## 2. Template Storyboard FYP (kolom, rasio 9:16 ditetapkan dari awal)

Kolom: **Beat | t (detik) | Shot (ukuran/sudut/gerak kamera) | Sketsa | Teks overlay | VO (kata) | SFX/Musik | Fungsi retensi**

Contoh kerangka video 30 detik:

| Beat | t | Shot | VO | Fungsi retensi |
|---|---|---|---|---|
| B1 | 0–2.5 | CU objek/wajah raksasa + push-in | Hook contrarian (≤9 kata) | Stop scroll |
| B2 | 2.5–6 | Detail anatomi/mekanisme, teks besar | Setup premis | Payoff mini #1 |
| B3 | 6–12 | Shot berganti sudut + SFX kontras | Bukti/fakta 1 | Pattern interrupt |
| B4 | 12–18 | Data card / visual analogi | Bukti/fakta 2 | Micro-payoff #2 |
| B5 | 18–25 | Kinetic cut on motion | Solusi/actionable | Tutup curiosity loop |
| B6 | 25–30 | Kembali ke framing B1 | CTA ringan | Loop → rewatch |

## 3. Proses Storyboard = Design Thinking (10 langkah)

1. **Shapes** — entitas: `Beat{id, t_start, durasi}`, `Frame{sketsa, shot_size, sudut, cam_move}`, `TextOverlay`, `Audio{vo, sfx, music}`, tag error: `dead_air`, `hook_overrun`, `focus_shift`. Tidak ada beat "bebas" tanpa durasi.
2. **A dulu** — happy path video = call graph beat: Hook → Setup → Payoff kecil … → Payoff → Loop. Grafik dulu, gambar kemudian.
3. **Kardinalitas** — 1 hook (one-shot, ≤2.5s) / N body beat (1 payoff tiap 3–5s) / 1 payoff + 1 loop (one-shot).
4. **E** — titik pecah: hook >3s = mati (ganti hook); beat lemah = re-hook di tengah; dead air = SFX/teks pengisi.
5. **R** — tiap beat deklarasi kebutuhan: aset visual, TTS/voice, SFX, footage. Beat dengan R kosong = bisa diproduksi langsung.
6. **Boundary** — referensi/rip-o-matic dari internet = untrusted; konten akhir harus original, fakta diverifikasi sebelum masuk beat.
7. **Behavior wrap** — uji timing via animatic (sketsa + VO kasar) sebelum render penuh; revisi di level storyboard, bukan saat render.
8. **Scope** — rasio 9:16 dan durasi target (30–60s) dikunci sejak frame pertama; palet ≤3 warna.
9. **Swap R** — stick figure cukup (StudioBinder/Boords/Wikipedia sepakat): kejelasan narasi > kualitas gambar; thumbnail → detail hanya bila dipitch ke klien.
10. **A/E terpisah** — alur cerita bersih; perbaikan beat (error handling) dikerjakan di layer terpisah tanpa mengubah struktur graph.

## 4. Call Graph Proses Produksi

```
Produksi Video FYP
  → Brief (topik + audiens + keyword)
    → Shapes: daftar beat + durasi + tag error
      → Storyboard: isi template kolom per beat
        → Sketsa (stick figure cukup) + panah gerak + teks overlay
          → Animatic (sketsa + VO kasar, uji timing)
            → lolos? → Produksi (render/shot asli)
            → gagal? → kembali ke level beat (E: re-hook / pangkas / re-tempo)
              → Payoff + Loop check (frame akhir → frame awal)
```

## 5. Dasar Klasik (dari StudioBinder/Boords/Wikipedia)

- Elemen frame standar: panel, deskripsi adegan, nomor shot, panah gerak, timing, anotasi.
- Panah harus menambah kejelasan (gerak karakter/kamera/objek), bukan membingungkan.
- Silhouette check: aksi harus terbaca tanpa detail.
- Variasikan shot size & sudut; layering (fg/mg/bg) untuk kedalaman; "character is king".
- Kesalahan umum: libatkan "sinematografer"/editor terlambat; tidak share board; anotasi kabur; alur lambat tidak dipangkas.

## 6. Checklist Siap Produksi

- [ ] Hook ≤2.5s, ≤9 kata, tanpa basa-basi ("Halo guys" dilarang)
- [ ] Tiap beat punya micro-payoff atau pattern interrupt (maks jeda 3–5s)
- [ ] Tidak ada dead air >0.3s
- [ ] Teks overlay di semua beat (no-sound viewer)
- [ ] Keyword di caption + VO + teks overlay (TikTok SEO)
- [ ] 1 fokus bergerak per frame; palet ≤3 warna
- [ ] Cut on motion; J-cut 0.2s di transisi
- [ ] Loop: beat terakhir nyambung ke beat pertama
- [ ] Animatic lolos uji timing sebelum render
