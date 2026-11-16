# Design Thinking — standar wajib untuk semua skill di repo ini

Folder ini adalah **acuan berpikir**, bukan dokumentasi pelengkap. Setiap skill di
`skills/` (dan setiap job render yang dijalankan dari repo ini) mengikuti 10 langkah
di bawah **sebelum** menulis kode atau naskah. Kalau kode/hasil tidak cocok dengan
grafik yang sudah digambar, perbaiki grafiknya dulu — bukan menambal kode.

## 10 langkah (Rin Room)

| # | Langkah | Pertanyaan yang dijawab | Artefak |
|---|---|---|---|
| 1 | **Shapes** | Noun apa saja yang ada? Entitas, ID, varian state, error bertag. | daftar type/ID |
| 2 | **A dulu** | Bagaimana happy path sebagai call graph? | blok `ts` berpanah |
| 3 | **Kardinalitas** | Tiap node: one-shot, banyak, atau time-bounded (cache)? | anotasi 1/∞/cache |
| 4 | **E** | Di mana bisa pecah, dan apa yang terjadi (retry / escape / die)? | tabel titik pecah |
| 5 | **R** | Kebutuhan tiap node: tool, akses, file, kuota. R kosong = bisa jalan. | daftar dependency |
| 6 | **Boundary** | Input eksternal mana yang untrusted dan di-parse di tepi? | aturan validasi |
| 7 | **Behavior wrap** | Retry/log/throttle membungkus node tanpa mengubah graph. | nama pembungkus |
| 8 | **Scope** | Resource (browser, canvas, file) di-acquire & release di mana? | titik dispose |
| 9 | **Swap R** | Layer uji apa yang menggantikan resource mahal? | still/sheet, bukan render penuh |
| 10 | **A/E terpisah** | Jalur sukses bersih dari error handling? | lokasi handler |

Format call graph (plain text, panah `→` + indentasi):

```ts
Task
  → LangkahA
    → LangkahA.detail
      → LangkahB
```

## Dokumen pendukung

| File | Isi |
|---|---|
| `DESIGN_THINKING_METHODOLOGY.md` | versi panjang 10 langkah + contoh penerapan |
| `DESIGN_THINKING.md` | ringkasan prinsip & alasan (kenapa graph dulu) |
| `CONTEXT_PASSING_DESIGN.md` | context file per domain (`Shared/contexts/CONTEXT_*.md`), append-only |
| `ECALL_GRAPH.md` | pola `Effect<A, E, R>` untuk pipeline |
| `RIN_ROOM_ARTIFACT.txt` | artefak asli (rujukan historis) |
| `RIN_ROOM_MEMORY_SNIPPET.txt` | kalimat ringkas untuk disisipkan ke AGENTS.md agent baru |
| `NEW_AGENT_ONBOARDING_TEMPLATE.txt` | template brief agent baru (wajib baca Design Thinking) |
| `family-3d-AGENTS.md` | contoh blok AGENTS.md untuk agent pipeline 3D |

## Penerapan per skill

Setiap skill punya bagian **Design Thinking** yang memetakan 10 langkah ke
pipeline spesifiknya:

- `skills/animasi-2d-stick-maen/SKILL.md` → panggung 2D Canvas (`GH.stage`).
- `skills/animasi-3d-jadibegini/SKILL.md` → panggung 3D Three.js (`kind: '3d'`).

Aturan yang berlaku di keduanya, hasil dari langkah 4/7/8:

1. **Satu job render berat** pada satu waktu; render selalu di background + throttle.
2. **Swap R sebelum render penuh**: sheet 9 still (≈1-2 menit) menggantikan render
   1.500 frame (≈20-70 menit). Sheet belum dilihat = belum boleh render.
3. **Scope**: stage/mesh/geometry di-dispose per shot; canvas & browser context
   ditutup di akhir job.
4. **Boundary**: angka dan nama ilmiah hanya masuk dari sumber terverifikasi;
   naskah, `words.json`, dan `shots.json` divalidasi di tepi sebelum dipakai render.
