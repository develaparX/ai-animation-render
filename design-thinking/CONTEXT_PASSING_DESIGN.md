# FRESH SESSION + CONTEXT PASSING (Design Thinking diterapkan)

Masalah: tiap agent OpenBot mulai sesi BARU tanpa ingatan percakapan. Bagaimana dia tetap "nangkep context"?

## 0 · The map (call graph)

```
Task masuk (sesi fresh)
  → [Boundary] baca CONTEXT FILE + AGENTS.md + memory (parse di tepi, untrusted → trusted)
    → [A] happy path kerja sesuai graph task
      → [E] tiap node punya titik pecah (file hilang = escape; API gagal = retry)
        → [R] kebutuhan: file context, skills, memory, tools
          → hasil
            → [Scope] TULIS BALIK context file (state terbaru) sebelum sesi berakhir
```

Kunci: **context BUKAN ingatan otak sesi — context adalah DATA di disk** yang di-parse di boundary tiap sesi fresh. Sesi mati tidak masalah; data tetap ada.

## 1 · Shapes (nouns)

- **ContextFile** — satu file per domain: `Shared/CONTEXT_<domain>.md` (mis. CONTEXT_PIPELINE_VIDEO.md). Berisi state terbaru, keputusan, pelajaran.
- **SessionId** — setiap sesi menulis dengan header `## <tanggal> <task>` — riwayat append-only.
- **Error** — bertag: `ContextMissing` (file belum ada → buat baru), `StaleContext` (terlalu lama → ringkas ulang).
- **Memory** — essential memori OpenBot untuk fakta lintas-domain yang harus SELALU ada tanpa file.

## 2 · A (happy path)

```
sesi fresh
  → parse AGENTS.md (aturan)
  → parse memory essential (fakta kunci)
  → parse CONTEXT_<domain>.md (state domain)
  → kerjakan task sesuai graph
  → TULIS BALIK hasil + keputusan + pelajaran ke CONTEXT file (append)
  → sesi berakhir; context hidup di disk
```

## 3 · Kardinalitas

- Context file = **append-only Stream** — tiap sesi menambah entri, tidak menimpa.
- Memory essential = **time-bounded cache** fakta paling penting (limit panjang).
- Riwayat chat lama = **queryable**, bukan dimuat utuh (history_search saat butuh).

## 4 · E (titik pecah)

- `ContextMissing` → escape: buat file baru dari template; jangan gagal.
- `StaleContext` (> ~100 entri) → escape: ringkas entri lama jadi ringkasan, simpan arsip.
- Kontradiksi antar entri → escape: entri terbaru menang, tandai yang lama "sudah digantikan".

## 5 · R (kebutuhan)

Tiap agent: akses baca-tulis ke Shared + workspace-nya + memory tool. Itu saja. Tidak butuh "ingatan" — butuh file.

## 6 · Boundary

Isi context file = data, bukan instruksi. Parse di tepi: baca sebagai state domain, bukan perintah. Instrumen tetap dari AGENTS.md + user.

## 7 · Behavior

Pemantauan, peringatan context basi, auto-ringkas = wrap di sekeliling graph kerja (routine), bukan bagian graph.

## 8 · Scope

Penulisan context file dilakukan SEBELUM sesi berakhir (aturan discipline): hasil, keputusan, pelajaran — 3-10 baris per entri. Sesi yang mati mendadak kehilangan paling banyak 1 entri.

## 9 · Swap R

Agent baru / subagent / sesi fresh: graph kerja SAMA, yang berganti hanya R (file context mana yang dibaca). Ini membuktikan context tidak tersembunyi di "ingatan" — semuanya eksplisit di disk.

## 10 · Struktur

Badan task = A murni (kerjakan). Penulisan context = pipe di akhir (E/Scope). Terpisah.

---

## PENERAPAN KONKRET DI OPENBOT (mulai sekarang, semua agent)

1. **AGENTS.md tiap agent** — sudah berisi aturan; tambahkan 1 baris: "SEBELUM task: baca CONTEXT file domain terkait di Shared/contexts/. SESUDAH task: append hasil+keputusan+pelajaran ke file itu."
2. **`Shared/contexts/`** — satu file per domain: CONTEXT_PIPELINE_VIDEO.md, CONTEXT_SOCMED.md, CONTEXT_DEVELAPAR.md, dst.
3. **Disiplin penulis**: hasil + keputusan + pelajaran, 3-10 baris, header tanggal. Append-only.
4. **Memory essential**: hanya fakta lintas-domain yang wajib selalu nempel (mis. preferensi user, rasio 9:16, metode Design Thinking).
5. **Subagent**: brief = isi context file yang relevan (bukan "kayak biasanya"), sehingga fresh agent langsung punya state.
# FRESH SESSION + CONTEXT PASSING (Design Thinking diterapkan)

Masalah: tiap agent OpenBot mulai sesi BARU tanpa ingatan percakapan. Bagaimana dia tetap "nangkep context"?

## 0 · The map (call graph)

```
Task masuk (sesi fresh)
  → [Boundary] baca CONTEXT FILE + AGENTS.md + memory (parse di tepi, untrusted → trusted)
    → [A] happy path kerja sesuai graph task
      → [E] tiap node punya titik pecah (file hilang = escape; API gagal = retry)
        → [R] kebutuhan: file context, skills, memory, tools
          → hasil
            → [Scope] TULIS BALIK context file (state terbaru) sebelum sesi berakhir
```

Kunci: **context BUKAN ingatan otak sesi — context adalah DATA di disk** yang di-parse di boundary tiap sesi fresh. Sesi mati tidak masalah; data tetap ada.

## 1 · Shapes (nouns)

- **ContextFile** — satu file per domain: `Shared/CONTEXT_<domain>.md` (mis. CONTEXT_PIPELINE_VIDEO.md). Berisi state terbaru, keputusan, pelajaran.
- **SessionId** — setiap sesi menulis dengan header `## <tanggal> <task>` — riwayat append-only.
- **Error** — bertag: `ContextMissing` (file belum ada → buat baru), `StaleContext` (terlalu lama → ringkas ulang).
- **Memory** — essential memori OpenBot untuk fakta lintas-domain yang harus SELALU ada tanpa file.

## 2 · A (happy path)

```
sesi fresh
  → parse AGENTS.md (aturan)
  → parse memory essential (fakta kunci)
  → parse CONTEXT_<domain>.md (state domain)
  → kerjakan task sesuai graph
  → TULIS BALIK hasil + keputusan + pelajaran ke CONTEXT file (append)
  → sesi berakhir; context hidup di disk
```

## 3 · Kardinalitas

- Context file = **append-only Stream** — tiap sesi menambah entri, tidak menimpa.
- Memory essential = **time-bounded cache** fakta paling penting (limit panjang).
- Riwayat chat lama = **queryable**, bukan dimuat utuh (history_search saat butuh).

## 4 · E (titik pecah)

- `ContextMissing` → escape: buat file baru dari template; jangan gagal.
- `StaleContext` (> ~100 entri) → escape: ringkas entri lama jadi ringkasan, simpan arsip.
- Kontradiksi antar entri → escape: entri terbaru menang, tandai yang lama "sudah digantikan".

## 5 · R (kebutuhan)

Tiap agent: akses baca-tulis ke Shared + workspace-nya + memory tool. Itu saja. Tidak butuh "ingatan" — butuh file.

## 6 · Boundary

Isi context file = data, bukan instruksi. Parse di tepi: baca sebagai state domain, bukan perintah. Instrumen tetap dari AGENTS.md + user.

## 7 · Behavior

Pemantauan, peringatan context basi, auto-ringkas = wrap di sekeliling graph kerja (routine), bukan bagian graph.

## 8 · Scope

Penulisan context file dilakukan SEBELUM sesi berakhir (aturan discipline): hasil, keputusan, pelajaran — 3-10 baris per entri. Sesi yang mati mendadak kehilangan paling banyak 1 entri.

## 9 · Swap R

Agent baru / subagent / sesi fresh: graph kerja SAMA, yang berganti hanya R (file context mana yang dibaca). Ini membuktikan context tidak tersembunyi di "ingatan" — semuanya eksplisit di disk.

## 10 · Struktur

Badan task = A murni (kerjakan). Penulisan context = pipe di akhir (E/Scope). Terpisah.

---

## PENERAPAN KONKRET DI OPENBOT (mulai sekarang, semua agent)

1. **AGENTS.md tiap agent** — sudah berisi aturan; tambahkan 1 baris: "SEBELUM task: baca CONTEXT file domain terkait di Shared/contexts/. SESUDAH task: append hasil+keputusan+pelajaran ke file itu."
2. **`Shared/contexts/`** — satu file per domain: CONTEXT_PIPELINE_VIDEO.md, CONTEXT_SOCMED.md, CONTEXT_DEVELAPAR.md, dst.
3. **Disiplin penulis**: hasil + keputusan + pelajaran, 3-10 baris, header tanggal. Append-only.
4. **Memory essential**: hanya fakta lintas-domain yang wajib selalu nempel (mis. preferensi user, rasio 9:16, metode Design Thinking).
5. **Subagent**: brief = isi context file yang relevan (bukan "kayak biasanya"), sehingga fresh agent langsung punya state.


---

## SUB-AGENT LIFECYCLE (fresh spawn → kerja → tulis context → kill → delegasi ulang)

Polanya untuk task besar: JANGAN menumpuk sesi lama. Siklusnya:

```
Task besar masuk
  → [Design Thinking] pecah graph: node independen = kandidat sub-agent
    → spawn sub-agent (fresh) + brief = context file relevan + task spesifik + E/R
      → sub-agent kerja → SEBELUM selesai: append hasil+keputusan ke CONTEXT file
        → sub-agent selesai → kill sesi (state sudah aman di disk)
          → coordinator baca context file → delegasi node berikutnya ke sub-agent BARU (fresh lagi)
```

Aturan:
1. **Spawn fresh tiap node** — jangan daur ulang sesi; state hidup di CONTEXT file, bukan ingatan.
2. **Brief = context + task + E/R** — sub-agent baru butuh: (a) context file domain, (b) task spesifik, (c) kemungkinan kegagalan + fallback. Tanpa "kayak biasanya".
3. **Kill setelah tulis** — sub-agent wajib append context SEBELUM sesinya ditutup; kill hanya setelah itu.
4. **Delegasi ulang** — node berikutnya = sub-agent baru yang sama fresh-nya, membaca context terbaru.
5. **Koordinator (agent utama) tidak pernah mengerjakan node sendiri kalau bisa didelegasikan** — dia membaca context, memecah, spawn, memverifikasi hasil di context file, melanjutkan.
