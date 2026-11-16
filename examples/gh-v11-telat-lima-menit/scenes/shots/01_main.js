// scenes/shots/01_main.js — 12 bespoke @garishidup.idn v2.1 shots for gh-v11-telat-lima-menit (watermark: "develapar")
import { registerShot, clamp } from '/engine/core.js';
import { renderGHShot } from '/engine/gh_layouts.js';

const SPECS = [
  {
    "timerPill": "08.05",
    "sub": "LOKET PAJAK MOTOR",
    "hl": [
      "Telat *lima menit* didenda,",
      "telat *lima tahun* ditambah biaya."
    ],
    "layout": "v11_b1_hook_0805"
  },
  {
    "timerPill": "04.30",
    "sub": "MUNDUR KE SUBUH · ANTAR PAKET",
    "hl": [],
    "layout": "v11_b2_flashback_0430"
  },
  {
    "timerPill": "06.45",
    "sub": "BAN PECAH DI JALAN PROYEK",
    "hl": [],
    "layout": "v11_b3_flashback_0645"
  },
  {
    "pill": "5 TAHUN",
    "sub": "1.825 HARI MANGKRAK",
    "hl": [
      "Jalan rusak *lima tahun,*",
      "denda kontraktornya *nol rupiah.*"
    ],
    "delayedReveal": true,
    "layout": "v11_b4_mangkrak_5tahun"
  },
  {
    "timerPill": "10.00",
    "sub": "PESAN KONTRAKTOR OKNUM",
    "hl": [],
    "layout": "v11_b5_chat_tambah_biaya"
  },
  {
    "pill": "5 MENIT vs 5 TAHUN",
    "sub": "DUA STANDAR HUKUM",
    "hl": [],
    "layout": "v11_b6_opensplit_5m_vs_5y"
  },
  {
    "pill": "TIMPANG",
    "sub": "PAJAK WARGA vs KOMISI PROYEK",
    "hl": [
      "Disiplin warga *diperas habis,*",
      "kelalaian oknum *malah disubsidi.*"
    ],
    "delayedReveal": true,
    "layout": "v11_b7_siphon"
  },
  {
    "pill": "PUTAR BALIK",
    "sub": "DENDA OTOMATIS PEJABAT",
    "hl": [
      "Gimana kalau *aturan dendanya*",
      "kita *putar balik* hari ini?"
    ],
    "delayedReveal": true,
    "layout": "v11_b8_valve_reverse"
  },
  {
    "pill": "POTONG GAJI",
    "sub": "PROYEK TELAT = BAYAR WARGA",
    "hl": [],
    "layout": "v11_b9_flow_road",
    "flowLeft": "DENDA PROYEK",
    "flowTargets": [
      "ASPAL MULUS",
      "BEBAS PAJAK MOTOR",
      "GANTI BAN WARGA"
    ]
  },
  {
    "pill": "BEBAS DENDA",
    "sub": "JALAN MULUS 100%",
    "hl": [
      "Jalan berlubang *langsung mulus,*",
      "pajak motor warga *otomatis lunas.*"
    ],
    "delayedReveal": true,
    "layout": "v11_b10_smooth_road_stamped"
  },
  {
    "pill": "KUNCI HUKUM",
    "sub": "ADIL UNTUK RAKYAT",
    "hl": [
      "Rakyat telat sehari *langsung didenda.*",
      "Proyek telat lima tahun *malah minta biaya.*"
    ],
    "delayedReveal": true,
    "layout": "v11_b11_punchline_lock"
  },
  {
    "pill": "GILIRANMU",
    "sub": "PROYEK MANA DULU?",
    "hl": [
      "Kalau berlaku *besok pagi,*",
      "jalan mana *wajib kena denda?*"
    ],
    "layout": "v11_b12_cta",
    "ctaLabels": [
      "JALAN BERLUBANG",
      "JEMBATAN MANGKRAK",
      "LAMPU MATI"
    ]
  }
];

SPECS.forEach((spec, idx) => {
  const id = 's' + String(idx + 1).padStart(3, '0');
  registerShot(id, {
    draw(g, t, info) {
      const u = clamp(t / ((info && info.dur) || 5));
      renderGHShot(g, { t, u, info }, spec);
    }
  });
});
