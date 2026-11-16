# GAP ANALYSIS — video Mr omi (REF) vs pipeline kita (N1/T2)
Dari perbandingan frame + reports/*.md (style bible, characters, outlines, depth, motion):

## GAP BESAR (kenapa hasil kita "tidak sesuai referensi")
1. **Kamera terlalu jauh & terlalu tinggi.** REF: kamera 0.79x tinggi karakter (eye-level),
   CU mengisi frame dengan 1-2 karakter, WS jarang. Kita: wide jauh dari atas → karakter mini.
2. **Tidak ada foreground/DOF.** REF: 20% frame punya objek dekat blur (sigma 3.7-7.8@720p), background blur di 1/3 shot.
   Kita: everything sharp, tidak ada foreground prop.
3. **Langit kemean & flat.** REF day: upper #5e93d9 → horizon 1.28x lebih terang; golden: mauve→kuning-oranye.
   Kita: biru flat washed-out. Sky gradient 4-stop + aerial haze wajib.
4. **Warna kurang saturasi.** REF saturation 0.38-0.65, lum mean 0.43-0.54 dengan darks pekat (p2 0.03).
   Kita: pucat, kontras rendah, tidak ada deep darks.
5. **Char terlalu kecil di frame + "chibi sticker".** REF: adult 3.5 head-heights, bean torso, kaki 1 goresan tipis,
   tangan titik tinta, H/W kepala 0.93 (lebih lebar), outline plum 3x lebih tebal bawah. Kita (cast template asli
   sebelum tier fix): 2.7 head-heights, limb 5x terlalu tebal, boots oval besar.
6. **Ink outlines dunia 3D**: REF 74% edges bergaris hitam 3px konsisten (silhouette, crease, contact).
   ink.ts template SUDAH benar — tapi harus dipastikan composer order ink SEBELUM DOF dan MSAA jalan.
7. **Camera motion**: REF = hold 80% + push-in 0.14%/f + glide ease-in-out 23f (bukan snap), kick impak 6-7f flip.
   Kita (setelah fix dolly) sudah pakai glide — pastikan SEMUA shot punya push-in dan tidak ada dead-still.
8. **Setiap kalimat diliteralkan visualnya.** REF: props membawa joke, tiap frasa punya gambar literal.
   Kita: beat tanpa prop spesifik terasa kosong.

## YANG SUDAH BENAR di pipeline kita
- Template bridge: toon.ts (bean), ink.ts, lensblur, grade, sky shader, DOF — semua mesinnya ada.
- Beats formula, voice pipeline, context passing, render throttled.

## PENERAPAN WAJIB untuk semua video baru (N1 dst)
a. Framing: eye-level, karakter mengisi frame (CU 1-2 karakter untuk hook + beat emosi), WS hanya untuk establishing.
b. Wajib foreground prop blur di 20-30% shot + DOF background di CU/MS.
c. Sky: gradient 4-stop + aerial haze ke skyline.
d. Grade: saturasi naik, darks pekat, golden untuk beat emosi.
e. Setiap kalimat narasi = 1 visual literal + prop pendukung.
f. Kamera: push-in tiap hold, glide 23f antar framing, kick 7f saat impak.
