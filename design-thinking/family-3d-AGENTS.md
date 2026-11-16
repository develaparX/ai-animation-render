# AGENTS.md — family-3d (dasar kerja agent)

## Metodologi kerja: DESIGN THINKING (Call Graph + Effect<A,E,R>)
Sumber: docs/DESIGN_THINKING.md, docs/ECALL_GRAPH.md, docs/RIN_ROOM_ARTIFACT.txt. Ini DASAR cara agent bekerja di repo ini.

## 0. Peta
- THINKING -> CODE: gambar call graph dulu, kode = grafik. Kalau kode tidak cocok grafik, implementasi salah.
- Tiga kanal: A (apa yang mengalir), E (di mana bisa pecah), R (apa yang dibutuhkan tiap node).

## Pipeline 10 langkah (wajib sebelum menulis/mengubah kode)
1. **Shapes (nouns)** — definisikan entitas, ID, varian, error dulu. Tidak ada string telanjang lintas batas.
2. **A dulu** — petakan happy path sebagai call graph. Grafik = struktur program.
3. **Kardinalitas** — tiap node: one-shot (Effect), banyak (Stream), atau time-bounded (Cache).
4. **E kedua** — tandai titik pecah: retry (transien) / escape hatch (fallback) / die (defect).
5. **R ketiga** — deklarasi kebutuhan tiap node; R menyusut saat layer diberikan; R kosong = bisa jalan.
6. **Trust di boundary** — parse di tepi saja (input WA, file, API); di dalam, tipe menjamin bentuk.
7. **Behavior wrap** — retry/timeout/log via .pipe(), TIDAK masuk badan graph.
8. **Scope** — resource (browser, ffmpeg, koneksi) acquire/release terikat lifecycle.
9. **Swap R untuk test** — grafik sama, layer berbeda. Kalau test butuh grafik diubah = hidden dependency.
10. **Struktur A/E terpisah** — badan = A murni; enumerasi E lengkap di pipe. Exception: divergent strategy (ditandai).

## Format laporan (ECALL_GRAPH.md)
Call graph / alur eksekusi / arsitektur dilaporkan dalam format ini:
```
HTTP handlers
  → ComponentA
    → ComponentA.layerX
      → ComponentB
```
Plain text, panah → indentasi, blok `ts`, Production dan Tests terpisah bila beda.

## Penerapan khusus repo ini
- **Pipeline video = call graph**: story.ts (beat) → cast.ts (stage) → world.ts (pose) → Bridge.tsx (render). Kode harus mengikuti grafik beat-audio; kalau tidak cocok, perbaiki grafiknya dulu.
- **Boundary trust**: input eksternal (voice wav, timing json, properti Remotion) di-parse di tepi; di dalam scene, tipe menjamin.
- **E di pipeline video**: 429 TTS = retry lalu escape (edge-tts); render crash = die (laporkan); timeout = retry.
- **Scope**: renderer browser + ffmpeg selalu detached (Start-Process + render_throttled.py) — cleanup struktural, bukan TODO.
- **Swap R**: test memakai layer palsu (contoh: still tanpa post-effect via inputProps {post:{...}}) tanpa mengubah graph.
- **Behavior wrap**: throttle CPU, log, monitor routine = .pipe() di sekeliling node render — graph render tidak berubah.
- **Call graph report**: saat menjelaskan pipeline video atau debugging, gunakan format ECALL_GRAPH di atas.
