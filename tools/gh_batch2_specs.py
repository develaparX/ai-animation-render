# tools/gh_batch2_specs.py — Complete specifications & bespoke @garishidup.idn v2.1 12-shot scene specs for Batch 2 (Videos #11..#20, watermark: "develapar")

SFX_CYCLE = [
    [{"at": 0.15, "name": "whoosh", "gain": -8}, {"at": 1.8, "name": "hit", "gain": -7}],
    [{"at": 0.20, "name": "footstep", "gain": -10}, {"at": 1.6, "name": "shimmer", "gain": -11}],
    [{"at": 0.25, "name": "tick", "gain": -8}, {"at": 2.0, "name": "pop", "gain": -9}],
    [{"at": 0.25, "name": "pop", "gain": -9}, {"at": 1.9, "name": "shimmer", "gain": -10}],
    [{"at": 0.20, "name": "whoosh", "gain": -8}, {"at": 1.7, "name": "hit", "gain": -6}],
    [{"at": 0.20, "name": "whoosh", "gain": -7}, {"at": 2.0, "name": "buzz", "gain": -9}],
    [{"at": 0.25, "name": "tick", "gain": -9}, {"at": 2.0, "name": "hit", "gain": -8}],
    [{"at": 0.15, "name": "whoosh", "gain": -6}, {"at": 1.5, "name": "ding", "gain": -6}],
    [{"at": 0.20, "name": "shimmer", "gain": -7}, {"at": 2.0, "name": "ding", "gain": -7}],
    [{"at": 0.20, "name": "pop", "gain": -8}, {"at": 1.9, "name": "shimmer", "gain": -8}],
    [{"at": 0.20, "name": "hit", "gain": -6}, {"at": 1.6, "name": "ding", "gain": -6}],
    [{"at": 0.20, "name": "shimmer", "gain": -8}, {"at": 1.8, "name": "pop", "gain": -9}],
]

VIDEOS_BATCH2 = [
    # V11 — Layout D: Reverse-Chronology Flashback (Gold Timer Pill + Speech Bubble + Receipt + Blueprint)
    {
        "num": 11,
        "slug": "gh-v11-telat-lima-menit",
        "title": "Telat Lima Menit vs Lima Tahun",
        "display_title": "Jam 08.05: Telat Lima Menit vs Lima Tahun",
        "wa_file": "gh-v11-telat-lima-menit.mp4",
        "caption": (
            "🎬 *JAM 08.05: Telat Lima Menit vs Lima Tahun*\n\n"
            "Rakyat telat bayar pajak sehari langsung kena denda otomatis. Tapi proyek jalan yang bikin ban motor warga pecah mangkrak lima tahun malah minta tambah anggaran.\n\n"
            "Gimana kalau setiap 1 hari proyek jalan terlambat, denda keterlambatannya otomatis memotong gaji pejabat pembuat proyek untuk menambal jalan dan membebaskan pajak motor warga? "
            "Di daerahmu ada proyek yang telat bertahun-tahun kayak gini? 👇\n\n"
            "#Develapar #TelatLimaMenit #SuaraWarga #AnimasiIndonesia #CeritaWarga #RelateBanget #FYPIndonesia"
        ),
        "lines": [
            "Jam delapan lewat lima menit di loket pajak, kamu telat sehari saja langsung disodori struk denda tanpa ampun.",
            "Padahal coba putar waktu mundur ke jam setengah lima subuh, saat kamu sudah menembus hujan dingin mengantar paket demi cari uang pajak itu.",
            "Lalu di jam enam lewat empat puluh lima, roda motormu menghantam lubang jalan yang dalam sampai bannya pecah di tengah jalan.",
            "Ironisnya, proyek perbaikan jalan yang bikin banmu pecah itu sudah mangkrak lima tahun penuh dengan sembilan kali revisi di atas kertas.",
            "Bukannya didenda karena terlambat seribu delapan ratus hari, oknum kontraktornya malah santai kirim pesan minta tambahan biaya empat miliar lagi.",
            "Di lantai atas proyek telat lima tahun bebas sanksi, sedangkan di lantai bawah warga telat lima menit langsung dipotong denda.",
            "Disiplin warga diperas sampai tetes terakhir, sementara kelalaian pejabat justru disubsidi dari pajak yang kamu bayar.",
            "Sekarang bayangkan, gimana kalau hari ini katup aturan denda itu kita putar balik seratus delapan puluh derajat?",
            "Begitu proyek jalan terlambat satu hari saja, gaji dan tunjangan pejabat penanggung jawabnya otomatis terpotong untuk menambal jalan dan membayar pajak motor warga.",
            "Dalam sebulan, jalanan berlubang berubah mulus berlapis aspal kokoh lengkap dengan stempel bebas denda bagi warga terdampak.",
            "Rakyat telat sehari langsung didenda, jangan biarkan proyek telat lima tahun malah minta tambah biaya.",
            "Kalau aturan denda terbalik ini berlaku besok pagi, proyek mangkrak mana di kotamu yang bakal langsung kelar dalam seminggu?",
        ],
        "shots_spec": [
            {"timerPill": "08.05", "sub": "LOKET PAJAK MOTOR", "hl": ["Telat *lima menit* didenda,", "telat *lima tahun* ditambah biaya."], "layout": "v11_b1_hook_0805"},
            {"timerPill": "04.30", "sub": "MUNDUR KE SUBUH · ANTAR PAKET", "hl": [], "layout": "v11_b2_flashback_0430"},
            {"timerPill": "06.45", "sub": "BAN PECAH DI JALAN PROYEK", "hl": [], "layout": "v11_b3_flashback_0645"},
            {"pill": "5 TAHUN", "sub": "1.825 HARI MANGKRAK", "hl": ["Jalan rusak *lima tahun,*", "denda kontraktornya *nol rupiah.*"], "delayedReveal": True, "layout": "v11_b4_mangkrak_5tahun"},
            {"timerPill": "10.00", "sub": "PESAN KONTRAKTOR OKNUM", "hl": [], "layout": "v11_b5_chat_tambah_biaya"},
            {"pill": "5 MENIT vs 5 TAHUN", "sub": "DUA STANDAR HUKUM", "hl": [], "layout": "v11_b6_opensplit_5m_vs_5y"},
            {"pill": "TIMPANG", "sub": "PAJAK WARGA vs KOMISI PROYEK", "hl": ["Disiplin warga *diperas habis,*", "kelalaian oknum *malah disubsidi.*"], "delayedReveal": True, "layout": "v11_b7_siphon"},
            {"pill": "PUTAR BALIK", "sub": "DENDA OTOMATIS PEJABAT", "hl": ["Gimana kalau *aturan dendanya*", "kita *putar balik* hari ini?"], "delayedReveal": True, "layout": "v11_b8_valve_reverse"},
            {"pill": "POTONG GAJI", "sub": "PROYEK TELAT = BAYAR WARGA", "hl": [], "layout": "v11_b9_flow_road", "flowLeft": "DENDA PROYEK", "flowTargets": ["ASPAL MULUS", "BEBAS PAJAK MOTOR", "GANTI BAN WARGA"]},
            {"pill": "BEBAS DENDA", "sub": "JALAN MULUS 100%", "hl": ["Jalan berlubang *langsung mulus,*", "pajak motor warga *otomatis lunas.*"], "delayedReveal": True, "layout": "v11_b10_smooth_road_stamped"},
            {"pill": "KUNCI HUKUM", "sub": "ADIL UNTUK RAKYAT", "hl": ["Rakyat telat sehari *langsung didenda.*", "Proyek telat lima tahun *malah minta biaya.*"], "delayedReveal": True, "layout": "v11_b11_punchline_lock"},
            {"pill": "GILIRANMU", "sub": "PROYEK MANA DULU?", "hl": ["Kalau berlaku *besok pagi,*", "jalan mana *wajib kena denda?*"], "layout": "v11_b12_cta", "ctaLabels": ["JALAN BERLUBANG", "JEMBATAN MANGKRAK", "LAMPU MATI"]},
        ],
    },

    # V12 — Layout B: Borderless Open Split (Gaji Guru vs Tunjangan Rapat Hotel)
    {
        "num": 12,
        "slug": "gh-v12-slip-bulan-ini",
        "title": "Slip Bulan Ini Gajinya Beda Bebannya Terbalik",
        "display_title": "Slip Bulan Ini: Gajinya Beda, Bebannya Terbalik",
        "wa_file": "gh-v12-slip-bulan-ini.mp4",
        "caption": (
            "🎬 *SLIP BULAN INI: Gajinya Beda, Bebannya Terbalik*\n\n"
            "Yang duduk rapat tiga jam di hotel dingin dapat tunjangan puluhan juta. Yang berdiri mengajar sebulan penuh di desa malah nombok beli kapur dan buku dari dompet sendiri.\n\n"
            "Gimana kalau struktur slip gaji itu dibalik otomatis berdasarkan jumlah murid yang benar-benar diajar? "
            "Setuju nggak kalau tunjangan rapat hotel dihapus dan dialihkan penuh ke guru honorer? 👇\n\n"
            "#Develapar #SlipBulanIni #GuruHonorer #SuaraWarga #AnimasiIndonesia #EdukasiPublik #FYPIndonesia"
        ),
        "lines": [
            "Di lantai atas duduk tiga jam dapat empat puluh lima juta, di lantai bawah berdiri sebulan penuh cuma terima satu koma dua juta.",
            "Coba lihat bagian atas: oknum komisi datang ke hotel bintang lima, minum kopi hangat, tanda tangan absen rapat tiga jam langsung cair amplop tebal.",
            "Sekarang lihat bagian bawah: guru honorer desa berdiri dari pagi sampai siang, gajinya habis buat beli kapur, buku murid, dan bensin motor.",
            "Saat dua slip bulan ini dijejerkan, yang satu sisa delapan puluh lima ribu di dompet, yang satu lagi utuh empat puluh lima juta tanpa keluar keringat.",
            "Anggaran pendidikan yang harusnya memperbaiki atap kelas dan masa depan murid justru tersedot habis untuk sewa ballroom hotel.",
            "Di kotak atas mereka tertawa di bawah lampu gantung mewah, di kotak bawah guru dan murid belajar sambil menghindari tetesan air hujan.",
            "Semakin banyak rapat digelar di hotel, semakin tipis sisa anggaran yang benar-benar sampai ke papan tulis sekolah desa.",
            "Sekarang bayangkan, gimana kalau hari ini katup slip gaji dan tunjangan itu kita putar balik berdasarkan jam mengajar nyata?",
            "Begitu katup keadilan dibuka, seluruh anggaran rapat hotel disita dan dialirkan langsung ke rekening guru desa serta fasilitas sekolah.",
            "Seketika posisi panggung berbalik: guru desa menerima lima belas juta lunas tepat waktu, sementara tunjangan rapat hotel dipangkas jadi nol rupiah.",
            "Yang duduk tiga jam dapat puluhan juta, jangan sampai yang berdiri sebulan terus nombok dari dompetnya.",
            "Kalau struktur gaji ini dibalik mulai bulan depan, profesi pejuang mana lagi yang wajib dinaikkan paling pertama?",
        ],
        "shots_spec": [
            {"pill": "SLIP BULAN INI", "sub": "3 JAM vs 30 HARI", "hl": ["Duduk tiga jam *empat puluh lima juta,*", "mengajar sebulan *satu koma dua juta.*"], "layout": "v12_b1_opensplit_both"},
            {"pill": "LANTAI ATAS", "sub": "RAPAT HOTEL 3 JAM", "hl": [], "layout": "v12_b2_opensplit_top"},
            {"pill": "LANTAI BAWAH", "sub": "MENGAJAR 30 HARI", "hl": [], "layout": "v12_b3_opensplit_bot"},
            {"pill": "DUA STRUK", "sub": "SISA Rp85 RB vs Rp45 JT", "hl": ["Satu *nombok buku murid,*", "satu *utuh puluhan juta.*"], "delayedReveal": True, "layout": "v12_b4_receipt_comparison"},
            {"pill": "ANGGARAN BOCOR", "sub": "SEKOLAH KE HOTEL", "hl": [], "layout": "v12_b5_siphon"},
            {"pill": "BALLROOM vs KELAS", "sub": "DUA DUNIA PENDIDIKAN", "hl": [], "layout": "v12_b6_class_vs_ballroom"},
            {"pill": "TERBALIK", "sub": "BEBAN KERJA vs UPAH", "hl": ["Makin mewah *hotel rapatnya,*", "makin tipis *kapur di kelasnya.*"], "delayedReveal": True, "layout": "v12_b7_siphon"},
            {"pill": "PUTAR BALIK", "sub": "BAYAR SESUAI MURID", "hl": ["Gimana kalau *slip gajinya*", "kita *balik otomatis* hari ini?"], "delayedReveal": True, "layout": "v12_b8_valve_flip"},
            {"pill": "CAIR 100%", "sub": "LANGSUNG KE GURU DESA", "hl": [], "layout": "v12_b9_flow_teacher", "flowLeft": "DANA RAPAT HOTEL", "flowTargets": ["GAJI GURU Rp15 JT", "BUKU SEKOLAH", "ATAP KELAS KOKOH"]},
            {"pill": "NASIB BERBALIK", "sub": "GURU MULIA · HOTEL Rp0", "hl": ["Guru desa *lima belas juta lunas,*", "tunjangan hotel *nol rupiah.*"], "delayedReveal": True, "layout": "v12_b9_opensplit_reversed"},
            {"pill": "KUNCI KEADILAN", "sub": "HORMATI GURU KITA", "hl": ["Yang duduk tiga jam *dapat puluhan juta.*", "Yang berdiri sebulan *nombok dari dompetnya.*"], "delayedReveal": True, "layout": "v12_b11_punchline_lock"},
            {"pill": "GILIRANMU", "sub": "SIAPA WAJIB NAIK?", "hl": ["Kalau dibalik *bulan depan,*", "pejuang mana *wajib sejahtera?*"], "layout": "v12_b12_cta", "ctaLabels": ["GURU HONORER", "PERAWAT DESA", "PETANI & BURUH"]},
        ],
    },

    # V13 — Layout C: Single-Stage Time-Lapse Counter (Kios Pasar Hari 1 -> 30)
    {
        "num": 13,
        "slug": "gh-v13-kios-pasar",
        "title": "Hari 1 Sampai Hari 30 Kios Pasar yang Dipalak",
        "display_title": "Hari 1 → Hari 30: Kios Pasar yang Dipalak",
        "wa_file": "gh-v13-kios-pasar.mp4",
        "caption": (
            "🎬 *HARI 1 → HARI 30: Kios Pasar yang Dipalak*\n\n"
            "Hari pertama buka lapak, 45 pembeli antre karena harga jujur dan terjangkau. Tapi begitu pungutan liar naik 3 kali lipat, pasar perlahan mati sampai 0 pembeli.\n\n"
            "Gimana kalau seluruh uang pungli pasar disita dan dikembalikan jadi subsidi harga bahan pokok warga? "
            "Di pasar dekat rumahmu masih banyak pungutan tanpa kuitansi resmi nggak? 👇\n\n"
            "#Develapar #KiosPasar #UMKMIndonesia #SuaraWarga #AnimasiIndonesia #CeritaWarga #FYPIndonesia"
        ),
        "lines": [
            "Hari pertama ibu dan kamu membuka kios sayur di pasar, empat puluh lima pembeli langsung mengantre karena harganya jujur dan murah.",
            "Tapi masuk hari ketujuh, oknum berseragam datang menyodorkan karcis pungutan liar yang naik tiga kali lipat tanpa kuitansi resmi.",
            "Karena tak sanggup menanggung setoran harian yang mencekik, hari keempat belas harga jual terpaksa naik dan pembeli menyusut tinggal empat orang.",
            "Sampai di hari kedua puluh satu, angka di atas kios berubah menjadi nol pembeli, meninggalkan ibu duduk termenung di depan sayur yang layu.",
            "Sementara kios warga mati satu per satu, koper di ruang belakang pengelola pasar justru makin gendut oleh uang setoran gelap.",
            "Di kotak atas pedagang kecil menangis menghitung modal yang habis, di kotak bawah oknum tertawa membagi jatah preman berdasi.",
            "Tiga tangki modal pedagang pasar terkuras kering hanya untuk memberi makan satu jaringan pungutan liar setiap pagi.",
            "Sekarang bayangkan, gimana kalau di hari ketiga puluh katup sapu bersih warga kita putar seratus delapan puluh derajat?",
            "Begitu seluruh uang pungli disita dan dikembalikan menjadi subsidi modal serta potongan harga pasar, keajaiban langsung terjadi.",
            "Di hari ketiga puluh, antrean pembeli di kios ibu kembali membludak sampai delapan puluh dua orang dengan lampu kios menyala emas.",
            "Pasar sepi bukan karena dagangannya kalah, tapi karena punglinya nggak pernah kenyang.",
            "Kalau loket bebas pungli ini diterapkan di kotamu, tempat mana dulu yang wajib dibersihkan hari ini juga?",
        ],
        "shots_spec": [
            {"pill": "HARI 1", "sub": "BUKA LAPAK JUJUR", "hl": ["Hari pertama *empat puluh lima pembeli,*", "hari kedua puluh *tinggal nol.*"], "layout": "v13_b1_day1_crowded"},
            {"pill": "HARI 7", "sub": "PUNGLI NAIK 3X LIPAT", "hl": [], "layout": "v13_b2_day7_extortion"},
            {"pill": "HARI 14", "sub": "PEMBELI MENYUSUT", "hl": [], "layout": "v13_b3_day14_drop"},
            {"pill": "HARI 21", "sub": "PASAR MATI SURI", "hl": ["Bukan karena *sayurnya layu,*", "tapi karena *setoran mencekik.*"], "delayedReveal": True, "layout": "v13_b4_day21_zero"},
            {"pill": "SETORAN GELAP", "sub": "TANPA KUITANSI DESA", "hl": [], "layout": "v13_b5_siphon"},
            {"pill": "LAPAK vs KANTOR", "sub": "PEDAGANG SEPI vs OKNUM KAYA", "hl": [], "layout": "v13_b6_split_stall_vs_office"},
            {"pill": "MODAL TERKURAS", "sub": "HABIS DIKUTIP HARIAN", "hl": ["Modal pedagang *dikuras habis*", "demi *kantong pribadi oknum.*"], "delayedReveal": True, "layout": "v13_b7_siphon"},
            {"pill": "PUTAR BALIK", "sub": "SAPU BERSIH PUNGLI", "hl": ["Gimana kalau *uang punglinya*", "disita balik *buat subsidi pasar?*"], "delayedReveal": True, "layout": "v13_b8_valve_sweep"},
            {"pill": "MODAL KEMBALI", "sub": "SUBSIDI PEDAGANG & WARGA", "hl": [], "layout": "v13_b8_flow_market", "flowLeft": "SITAAN PUNGLI", "flowTargets": ["MODAL IBU PASAR", "HARGA MURAH", "KIOS BERSIH"]},
            {"pill": "HARI 30", "sub": "PASAR KEMBALI RAMAI", "hl": ["Delapan puluh dua *pembeli antre,*", "kios ibu *menyala emas.*"], "delayedReveal": True, "layout": "v13_b9_day30_boom"},
            {"pill": "BEBAS PUNGLI", "sub": "PASAR MILIK RAKYAT", "hl": ["Pasar sepi bukan karena *dagangannya kalah.*", "Tapi karena *punglinya nggak pernah kenyang.*"], "delayedReveal": True, "layout": "v13_b11_punchline_lock"},
            {"pill": "GILIRANMU", "sub": "MANA WAJIB BERSIH?", "hl": ["Kalau diterapkan *hari ini,*", "titik mana *wajib bebas pungli?*"], "layout": "v13_b12_cta", "ctaLabels": ["PASAR TRADISIONAL", "PARKIR JALAN", "LOKET IZIN USAHA"]},
        ],
    },

    # V14 — Layout F: Frame-in-Frame Live Mirror (Foto Peresmian vs Siapa yang Membangun)
    {
        "num": 14,
        "slug": "gh-v14-foto-peresmian",
        "title": "Foto Peresmian Yang Kerja Nggak Masuk Bingkai",
        "display_title": "Foto Peresmian: Yang Kerja Nggak Masuk Bingkai",
        "wa_file": "gh-v14-foto-peresmian.mp4",
        "caption": (
            "🎬 *FOTO PERESMIAN: Yang Kerja Nggak Masuk Bingkai*\n\n"
            "Enam bulan Ayah dan para tukang mandi keringat mengecor jembatan di bawah terik matahari. Tapi saat hari peresmian, pekerja disuruh minggir dari bingkai foto supaya pejabat yang baru datang 5 menit bisa rebutan gunting pita.\n\n"
            "Gimana kalau bingkai foto dan prasasti resmi otomatis menyalakan sosok emas para pekerja dan pembayar pajak asli? 👇\n\n"
            "#Develapar #FotoPeresmian #PekerjaIndonesia #SuaraWarga #AnimasiIndonesia #RelateBanget #FYPIndonesia"
        ),
        "lines": [
            "Di panggung bawah ayah dan kamu yang membangun jembatan enam bulan, tapi di bingkai foto atas tubuh kalian cuma garis putus-putus yang disuruh minggir.",
            "Bulan pertama saat tanah masih berlumpur, ayah mengangkat batu dan besi pondasi di bawah terik matahari tanpa ada satu pun kamera pejabat.",
            "Masuk bulan keenam di tengah hujan deras, tangan pekerja melepuh mengecor bentang jembatan supaya anak-anak desa bisa lewat dengan aman.",
            "Namun begitu jembatan selesai berdiri, rombongan jas rapi datang lima menit membawa pita emas sambil berteriak menyuruh tukang mundur ke belakang kamera.",
            "Saat lampu kilat kamera menyala, wajah para pekerja hilang dari bingkai prasasti, digantikan senyum pejabat yang bahkan tak pernah menyentuh semen.",
            "Di kotak atas seratus delapan puluh hari mandi keringat dilupakan, di kotak bawah lima menit pegang gunting pita diklaim sebagai jasa pribadi.",
            "Keringat tukang dan uang pajak warga yang membangun, tapi nama pejabat yang diukir paling besar di batu peresmian.",
            "Sekarang bayangkan, gimana kalau lensa kamera sejarah dan aturan prasasti negara itu kita putar balik seratus delapan puluh derajat?",
            "Begitu lensa kejujuran dinyalakan, sosok pejabat yang cuma numpang foto langsung memudar jadi bayangan kosong di pinggir bingkai.",
            "Sebaliknya, sosok ayah, para tukang, dan warga pembayar pajak menyala emas penuh di tengah bingkai foto dan prasasti jembatan.",
            "Yang bangun berbulan-bulan di bawah terik matahari, jangan dikalahkan oleh yang masuk foto cuma karena pegang gunting.",
            "Menurutmu, siapa yang namanya paling pantas diukir paling atas di setiap bangunan publik kita?",
        ],
        "shots_spec": [
            {"pill": "FOTO PERESMIAN", "sub": "BINGKAI ATAS vs PANGGUNG BAWAH", "hl": ["Yang kerja *disuruh minggir,*", "yang pegang gunting *paling depan.*"], "layout": "v14_b1_mirror_hook"},
            {"pill": "BULAN KE-1", "sub": "ANGKAT BESI & BATU", "hl": [], "layout": "v14_b2_month1_foundation"},
            {"pill": "BULAN KE-6", "sub": "COR BETON SAMPAI MALAM", "hl": [], "layout": "v14_b3_month6_rain_work"},
            {"pill": "HARI PERESMIAN", "sub": "DATANG 5 MENIT POTONG PITA", "hl": ["Enam bulan *tak pernah tampak,*", "begitu jadi *rebutan kamera.*"], "delayedReveal": True, "layout": "v14_b4_ribbon_day_shoved"},
            {"pill": "DI LUAR BINGKAI", "sub": "SILUET PUTUS-PUTUS", "hl": [], "layout": "v14_b5_mirror_dashed_workers"},
            {"pill": "180 HARI vs 5 MENIT", "sub": "KERJA NYATA vs PENCITRAAN", "hl": [], "layout": "v14_b6_split_sweat_vs_ribbon"},
            {"pill": "KLAIM SEPIHAK", "sub": "PAJAK WARGA DIKLAIM JASA DIA", "hl": ["Pajak rakyat *yang membiayai,*", "nama dia *yang dipajang besar.*"], "delayedReveal": True, "layout": "v14_b7_siphon"},
            {"pill": "PUTAR LENSA", "sub": "KAMERA AUDIT SEJARAH", "hl": ["Gimana kalau *bingkai fotonya*", "menyalakan *pekerja aslinya?*"], "delayedReveal": True, "layout": "v14_b7_valve_lens"},
            {"pill": "SOSOK EMAS", "sub": "PAHLAWAN PEMBANGUN ASLI", "hl": [], "layout": "v14_b8_mirror_gold_workers"},
            {"pill": "PRASASTI WARGA", "sub": "DIHORMATI SELURUH DESA", "hl": ["Nama tukang & warga *berpendar emas,*", "pencitraan palsu *dihapus total.*"], "delayedReveal": True, "layout": "v14_b9_plaque_stamped"},
            {"pill": "HORMAT KAMI", "sub": "UNTUK TANGAN YANG BEKERJA", "hl": ["Yang bangun *berbulan-bulan di bawah terik.*", "Yang masuk foto *cuma yang pegang gunting.*"], "delayedReveal": True, "layout": "v14_b11_punchline_lock"},
            {"pill": "GILIRANMU", "sub": "SIAPA PANTAS DIUKIR?", "hl": ["Di prasasti *jembatan kotamu,*", "nama siapa *wajib paling atas?*"], "layout": "v14_b12_cta", "ctaLabels": ["PEKERJA & TUKANG", "PEMBAYAR PAJAK", "GURU & DOKTER"]},
        ],
    },

    # V15 — Layout E: Multi-Scene 3 Latar (Motor Tua Lunas vs Mobil Sitaan)
    {
        "num": 15,
        "slug": "gh-v15-motor-tua-lunas",
        "title": "Motor Tua Lunas vs Mobil Sitaan",
        "display_title": "17.00 di Parkiran: Motor Tua Lunas vs Mobil Sitaan",
        "wa_file": "gh-v15-motor-tua-lunas.mp4",
        "caption": (
            "🎬 *17.00 DI PARKIRAN: Motor Tua Lunas vs Mobil Sitaan*\n\n"
            "Di parkiran sore, motor tua 12 tahun milikmu ditertawakan oleh oknum yang naik mobil mewah hasil komisi proyek. "
            "Tapi malam harinya, mobil mewah itu disita sirine audit, sementara kamu tidur nyenyak di rumah berstempel HALAL & LUNAS.\n\n"
            "Motornya memang keluaran lama, tapi tidurnya nggak pernah takut ketukan pintu! Setuju? 👇\n\n"
            "#Develapar #MotorTuaLunas #HidupJujur #SuaraWarga #AnimasiIndonesia #RelateBanget #FYPIndonesia"
        ),
        "lines": [
            "Jam lima sore di parkiran kantor, oknum bermobil mewah membuka kaca jendela sambil menertawakan motor tua dua belas tahun yang kamu naiki.",
            "Dengan bangga dia memamerkan mobil mengkilap seharga empat koma delapan miliar hasil sunatan anggaran proyek jalan desa.",
            "Kamu hanya tersenyum tenang sambil menyalakan mesin motor tuamu, pulang menembus sore tanpa satu rupiah pun utang maupun uang haram.",
            "Tapi baru sampai di tengah jalan raya malam itu, sirine tim audit menghentikan paksa mobil mewah si oknum di depan mata warga.",
            "Di atas kap mobil emasnya langsung ditempel berita acara penyitaan negara karena terbukti dibeli dari uang komisi gelap.",
            "Di kotak atas kamu makan malam hangat dan tidur nyenyak bersama keluarga, di kotak bawah dia gemetar setiap kali mendengar suara ketukan pintu.",
            "Harta curian yang tadinya dipamerkan di parkiran kini berubah menjadi barang bukti yang menyeretnya ke balik jeruji.",
            "Sekarang bayangkan, gimana kalau seluruh mobil mewah sitaan koruptor itu langsung dilelang terbuka di halaman desa?",
            "Begitu palu lelang diketuk warga, uang empat koma delapan miliar tadi mengalir penuh menjadi ambulans gratis dan bus sekolah anak desa.",
            "Kini di teras rumah sederhanamu terpampang stempel emas halal dan lunas, sementara si oknum lewat sambil berjalan kaki menunduk malu.",
            "Motornya memang keluaran lama, tapi tidurnya nggak pernah takut ketukan pintu.",
            "Lebih pilih mana: kendaraan sederhana tapi hati tenang, atau mewah sebentar tapi dikejar sirine seumur hidup?",
        ],
        "shots_spec": [
            {"pill": "17.00 · PARKIRAN", "sub": "MOTOR 12 TAHUN vs MOBIL Rp4,8 M", "hl": ["Motornya *ditertawakan di parkiran,*", "mobilnya *disita di tengah jalan.*"], "layout": "v15_b1_parking_1700"},
            {"pill": "PAMER HARTA", "sub": "KOMISI PROYEK GELAP", "hl": [], "layout": "v15_b2_parking_taunt"},
            {"pill": "17.45 · JALAN RAYA", "sub": "PULANG HATI TENANG", "hl": [], "layout": "v15_b3_road_rain_peace"},
            {"pill": "19.30 · DICEGAT", "sub": "SIRINE AUDIT NEGARA", "hl": ["Siang pamer *mobil komisi,*", "malam dicegat *surat sitaan.*"], "delayedReveal": True, "layout": "v15_b4_road_siren_stop"},
            {"pill": "DISITA RESMI", "sub": "BARANG BUKTI Rp4,8 MILIAR", "hl": [], "layout": "v15_b5_receipt_seized"},
            {"pill": "23.00 · MALAM", "sub": "TIDUR NYENYAK vs TAKUT KETUKAN", "hl": [], "layout": "v15_b6_split_sleep_vs_panic"},
            {"pill": "UANG PANAS", "sub": "TAK PERNAH TENANG", "hl": ["Mewah dari *keringat curian*", "ujungnya *habis di pengadilan.*"], "delayedReveal": True, "layout": "v15_b7_siphon"},
            {"pill": "LELANG WARGA", "sub": "UBAH JADI AMBULANS DESA", "hl": ["Gimana kalau *mobil sitaannya*", "dilelang jadi *ambulans gratis?*"], "delayedReveal": True, "layout": "v15_b7_valve_auction"},
            {"pill": "KEMBALI KE DESA", "sub": "AMBULANS & BUS SEKOLAH", "hl": [], "layout": "v15_b8_flow_ambulance", "flowLeft": "LELANG MOBIL SITAAN", "flowTargets": ["AMBULANS GRATIS", "BUS SEKOLAH", "JALAN DESA"]},
            {"pill": "HALAL & LUNAS", "sub": "RUMAH TENANG BEBAS UTANG", "hl": ["Rumah hangat *berstempel lunas,*", "oknum pulang *berjalan kaki.*"], "delayedReveal": True, "layout": "v15_b10_oknum_walking"},
            {"pill": "TIDUR NYENYAK", "sub": "REZEKI JUJUR TAK TERTUKAR", "hl": ["Motornya memang *keluaran lama.*", "Tapi tidurnya *nggak pernah takut ketukan pintu.*"], "delayedReveal": True, "layout": "v15_b11_punchline_lock"},
            {"pill": "PILIHANMU", "sub": "TENANG ATAU WASWAS?", "hl": ["Kalau mobil sitaan *dilelang besok,*", "fasilitas apa *paling dibutuhkan?*"], "layout": "v15_b12_cta", "ctaLabels": ["AMBULANS DESA", "BUS SEKOLAH", "MODAL UMKM"]},
        ],
    },

    # V16 — Layout A: Split-Box Active Dimming (Sawah Jam Dua Pagi vs Kamar Hotel)
    {
        "num": 16,
        "slug": "gh-v16-sawah-jam-dua",
        "title": "Sabtu Jam Dua Pagi Sawah vs Kamar Hotel",
        "display_title": "Sabtu 02.00: Sawah Petani vs Kamar Hotel",
        "wa_file": "gh-v16-sawah-jam-dua.mp4",
        "caption": (
            "🎬 *SABTU 02.00: Sawah Petani vs Kamar Hotel*\n\n"
            "Di kotak atas jam 9 malam, oknum rapat studi banding pertanian Rp3 miliar di hotel bintang lima. "
            "Di kotak bawah jam 2 pagi, Ayah petani kedinginan di pematang sawah menunggu pupuk subsidi yang tak kunjung datang.\n\n"
            "Gimana kalau dana rapat hotel itu langsung dibatalkan dan dikirim jadi ribuan karung pupuk emas langsung ke sawah petani? 👇\n\n"
            "#Develapar #PetaniIndonesia #PupukSubsidi #SuaraWarga #AnimasiIndonesia #RelateBanget #FYPIndonesia"
        ),
        "lines": [
            "Perhatikan kotak atas jam sembilan malam: mereka menggelar rapat studi banding pertanian tiga miliar rupiah di atas sofa hotel bintang lima.",
            "Sekarang nyalakan kotak bawah jam dua dini hari: ayah berdiri kedinginan di pematang sawah menjaga air irigasi di samping karung pupuk yang kosong.",
            "Sejak subuh puluhan petani sudah mengantre di kios desa, tapi papan stok selalu tertulis nol karung pupuk subsidi.",
            "Padahal di waktu yang sama, tagihan menginap dan jamuan rapat koordinasi pupuk di hotel kota mencapai delapan ratus lima puluh juta rupiah.",
            "Pipa anggaran yang seharusnya mengalirkan pupuk ke lumpur sawah justru berbelok membiayai kasur empuk dan koper perjalanan pejabat.",
            "Saat kedua kotak dinyalakan bersamaan, terlihat jelas kontras antara yang bicara soal pangan di ruang dingin dan yang menanam pangan di tengah lumpur.",
            "Semakin sering seminar pertanian digelar di hotel mewah, semakin langka pupuk yang benar-benar sampai ke tangan ayah di desa.",
            "Sekarang bayangkan, gimana kalau katup anggaran studi banding hotel itu kita putar balik seratus delapan puluh derajat langsung ke pematang sawah?",
            "Begitu seluruh rapat hotel mewah dibatalkan, dana tiga miliar mengalir utuh menjadi ribuan karung pupuk dan saluran irigasi desa.",
            "Kotak atas kini dipenuhi panen raya padi emas milik petani, sementara ruang rapat mewah oknum ditutup dan mereka wajib turun langsung ke lumpur sawah.",
            "Yang rapat soal tani tidur di kasur empuk, jangan biarkan yang nanam padi terus begadang nunggu pupuk.",
            "Kalau anggaran rapat hotel di daerahmu dialihkan hari ini, kebutuhan petani mana yang wajib dipenuhi paling dulu?",
        ],
        "shots_spec": [
            {"pill": "21.00 · HOTEL", "sub": "STUDI BANDING Rp3 MILIAR", "hl": ["Rapat taninya *di hotel mewah,*", "petani aslinya *kehabisan pupuk.*"], "layout": "v16_b1_split_dim_top"},
            {"pill": "02.00 · SAWAH", "sub": "AYAH JAGA IRIGASI MALAM", "hl": [], "layout": "v16_b2_split_dim_bot"},
            {"pill": "STOK PUPUK: 0", "sub": "ANTREAN PETANI DESA", "hl": [], "layout": "v16_b3_fertilizer_queue"},
            {"pill": "TAGIHAN HOTEL", "sub": "Rp850 JUTA · 0 KG PUPUK", "hl": ["Ratusan juta *habis di ballroom,*", "satu karung pun *tak sampai sawah.*"], "delayedReveal": True, "layout": "v16_b4_hotel_bill"},
            {"pill": "SALURAN BOCOR", "sub": "SUBSIDI TANI DIKURAS", "hl": [], "layout": "v16_b5_siphon"},
            {"pill": "DUA PANGGUNG", "sub": "KASUR EMPUK vs LUMPUR SAWAH", "hl": [], "layout": "v16_b6_split_both"},
            {"pill": "SALAH SASARAN", "sub": "SEMINAR NAIK · PANEN TURUN", "hl": ["Sibuk rapat *membahas pangan,*", "lupa siapa *yang menanam.*"], "delayedReveal": True, "layout": "v16_b7_siphon"},
            {"pill": "PUTAR BALIK", "sub": "HAPUS RAPAT HOTEL", "hl": ["Gimana kalau *dana hotelnya*", "langsung dikirim *jadi pupuk desa?*"], "delayedReveal": True, "layout": "v16_b7_valve_cancel_hotel"},
            {"pill": "100% KE SAWAH", "sub": "PUPUK & IRIGASI PETANI", "hl": [], "layout": "v16_b8_flow_paddy", "flowLeft": "DANA RAPAT Rp3 M", "flowTargets": ["PUPUK SUBSIDI", "IRIGASI SAWAH", "HARGA GABAH ADIL"]},
            {"pill": "PANEN RAYA", "sub": "LUMBUNG DESA PENUH EMAS", "hl": ["Sawah ayah *panen melimpah,*", "rapat hotel *resmi dihapus.*"], "delayedReveal": True, "layout": "v16_b9_split_reversed"},
            {"pill": "DAULAT PETANI", "sub": "KUNCI ANGGARAN TANI", "hl": ["Yang rapat soal tani *tidur di kasur empuk.*", "Yang nanam padi *begadang nunggu pupuk.*"], "delayedReveal": True, "layout": "v16_b11_punchline_lock"},
            {"pill": "GILIRANMU", "sub": "APA KEBUTUHAN PETANI?", "hl": ["Kalau dana hotel *dialihkan besok,*", "bantuan mana *wajib turun duluan?*"], "layout": "v16_b12_cta", "ctaLabels": ["PUPUK LANGSUNG", "IRIGASI SAWAH", "TRAKTOR DESA"]},
        ],
    },

    # V17 — Layout B: Borderless Open Split (Dompet Warga vs Kas Daerah Akhir Tahun)
    {
        "num": 17,
        "slug": "gh-v17-dompet-akhir-tahun",
        "title": "Masuk vs Keluar Dompet Warga vs Kas Daerah",
        "display_title": "Tanggal 1 vs Desember: Dompet Warga vs Kas Daerah",
        "wa_file": "gh-v17-dompet-akhir-tahun.mp4",
        "caption": (
            "🎬 *TANGGAL 1 vs DESEMBER: Dompet Warga vs Kas Daerah*\n\n"
            "Dompet warga masuk Rp4,2 juta di tanggal 1, langsung habis buat bayar pajak, listrik, dan sekolah anak. "
            "Tapi di bulan Desember, sisa kas daerah miliaran rupiah justru dipaksa habis dalam 7 hari lewat rapat kejar tayang supaya anggaran terlihat terserap 100%.\n\n"
            "Gimana kalau setiap rupiah sisa anggaran akhir tahun otomatis dikembalikan jadi cashback fasilitas warga? 👇\n\n"
            "#Develapar #DompetWarga #AnggaranDaerah #SuaraWarga #AnimasiIndonesia #RelateBanget #FYPIndonesia"
        ),
        "lines": [
            "Di lantai atas dompetmu terisi empat koma dua juta tanggal satu, tapi tanggal dua sudah menipis tinggal empat ratus ribu karena taat bayar pajak dan tagihan.",
            "Setiap bulan kamu dan ibu menghitung rincian pengeluaran dengan hati-hati, mulai dari pajak, listrik, ongkos kerja, sampai uang sekolah anak.",
            "Namun begitu masuk bulan Desember, pemandangan terbalik terjadi di papan rencana kantor dinas yang sibuk kejar tayang menghabiskan sisa anggaran lima miliar.",
            "Bukan dipakai menambal sekolah atau puskesmas, sisa uang pajakmu malah dikuras dalam tujuh hari untuk seminar hotel, seragam baru, dan perjalanan fiktif.",
            "Alasannya selalu sama: kalau anggaran tidak dihabiskan sampai nol sebelum akhir tahun, tahun depan jatah anggarannya takut dipotong.",
            "Warga berhemat tiga ratus enam puluh lima hari demi membayar pajak, sementara oknum menghamburkan miliaran rupiah hanya dalam seminggu terakhir.",
            "Uang yang dikumpulkan dari ribuan dompet tipis milik rakyat justru menguap lewat kuitansi rapat akhir tahun yang tak ada manfaatnya.",
            "Sekarang bayangkan, gimana kalau katup pengunci kas akhir tahun itu kita putar balik seratus delapan puluh derajat?",
            "Setiap rupiah sisa anggaran Desember yang tidak terpakai untuk pelayanan nyata otomatis dikunci dan dikembalikan sebagai cashback pembangunan desa.",
            "Dompet fasilitas warga langsung terisi penuh untuk sekolah dan jalan, sementara anggaran rapat kejar tayang Desember dikunci rapat di angka nol.",
            "Uangmu keluar buat bangun kota, jangan sampai habis buat rapat akhir tahun mereka.",
            "Kalau sisa anggaran Desember di kotamu wajib dikembalikan ke warga, mau dipakai buat fasilitas apa paling dulu?",
        ],
        "shots_spec": [
            {"pill": "MASUK vs KELUAR", "sub": "DOMPET WARGA vs KAS DAERAH", "hl": ["Warga berhemat *setahun penuh,*", "mereka kejar tayang *habiskan anggaran.*"], "layout": "v17_b1_opensplit_wallets"},
            {"pill": "TANGGAL 2", "sub": "RINCIAN BEBAN WARGA", "hl": [], "layout": "v17_b2_citizen_expense_stack"},
            {"pill": "BULAN DESEMBER", "sub": "KEJAR TAYANG Rp5 MILIAR", "hl": [], "layout": "v17_b3_december_rush_board"},
            {"pill": "7 HARI HABIS", "sub": "SEMINAR & PERJALANAN FIKTIF", "hl": ["Takut anggaran *tahun depan turun,*", "miliaran dikuras *rapat seminggu.*"], "delayedReveal": True, "layout": "v17_b5_receipt_fiktif"},
            {"pill": "KUITANSI AKHIR TAHUN", "sub": "MENGUAP TANPA HASIL", "hl": [], "layout": "v17_b5_siphon"},
            {"pill": "365 HARI vs 7 HARI", "sub": "HEMAT WARGA vs BOROS OKNUM", "hl": [], "layout": "v17_b6_opensplit_wallets"},
            {"pill": "PAJAK TERBUANG", "sub": "DOMPET TIPIS MEMBIAYAI HOTEL", "hl": ["Dikumpulkan dari *dompet tipis warga,*", "dihamburkan di *akhir Desember.*"], "delayedReveal": True, "layout": "v17_b7_siphon"},
            {"pill": "PUTAR BALIK", "sub": "KUNCI SISA ANGGARAN", "hl": ["Gimana kalau *sisa anggaran Desember*", "otomatis balik *ke dompet desa?*"], "delayedReveal": True, "layout": "v17_b7_valve_cashback"},
            {"pill": "CASHBACK WARGA", "sub": "100% KEMBALI KE PELAYANAN", "hl": [], "layout": "v17_b8_flow_cashback", "flowLeft": "SISA KAS DESEMBER", "flowTargets": ["CASHBACK PAJAK", "KLINIK & SEKOLAH", "MODAL DESA"]},
            {"pill": "STOP KEJAR TAYANG", "sub": "DOMPET WARGA TERLINDUNGI", "hl": ["Sisa anggaran *utuh kembali ke warga,*", "rapat fiktif Desember *dikunci nol.*"], "delayedReveal": True, "layout": "v17_b9_opensplit_gold"},
            {"pill": "PAJAK MILIK KITA", "sub": "BUKAN DANA LIBURAN AKHIR TAHUN", "hl": ["Uangmu keluar *buat bangun kota.*", "Jangan sampai habis *buat rapat akhir tahun mereka.*"], "delayedReveal": True, "layout": "v17_b11_punchline_lock"},
            {"pill": "GILIRANMU", "sub": "KEMANA SISA ANGGARAN?", "hl": ["Kalau sisa kas *dikembalikan besok,*", "prioritas mana *wajib didanai?*"], "layout": "v17_b12_cta", "ctaLabels": ["POTONGAN PAJAK", "SEKOLAH GRATIS", "PERBAIKAN JALAN"]},
        ],
    },

    # V18 — Layout C: Time-Lapse Counter + Scoreboard (Loket Obat vs Gudang Tertutup)
    {
        "num": 18,
        "slug": "gh-v18-loket-obat",
        "title": "Loket Obat Stok Habis di Bawah Penuh di Gudang",
        "display_title": "Loket Obat: Kosong di Depan, Penuh di Gudang",
        "wa_file": "gh-v18-loket-obat.mp4",
        "caption": (
            "🎬 *LOKET OBAT: Kosong di Depan, Penuh di Gudang*\n\n"
            "Jam 6 pagi, 64 warga dan lansia sudah mengantre di loket puskesmas, tapi layar stok tertulis 0 dan warga disuruh menebus mahal di luar. "
            "Padahal di balik dinding gudang dinas, ratusan kardus obat menumpuk tertahan tanda tangan oknum yang menunggu jatah komisi vendor.\n\n"
            "Gimana kalau pintu gudang obat itu dibuka paksa oleh audit warga sehingga stok loket langsung 100% tersedia gratis? 👇\n\n"
            "#Develapar #LoketObat #LayananPublik #SuaraWarga #AnimasiIndonesia #RelateBanget #FYPIndonesia"
        ),
        "lines": [
            "Jam enam pagi di loket obat, enam puluh empat warga dan lansia sudah mengantre panjang, tapi angka ketersediaan obat di layar tertulis nol.",
            "Ibu yang sedang sakit terpaksa memegang kertas resep dengan wajah lesu karena petugas berkata stok obat subsidi habis dan harus beli mahal di luar.",
            "Padahal kalau kamera digeser ke balik dinding gudang pengadaan, ratusan kardus obat berkualitas justru menumpuk tinggi sampai ke langit-langit.",
            "Lewat pesan singkat tersembunyi, oknum pejabat pengadaan menahan izin distribusi obat itu hanya karena menunggu uang komisi dari pihak vendor cair.",
            "Papan skor pelayanan menunjukkan angka yang menyakitkan: nol persen obat sampai di loket warga, seratus persen tertahan di gudang birokrasi.",
            "Sementara lansia menahan sakit di kursi antrean, oknum berdasi sibuk berhitung persentase jatah dari anggaran kesehatan rakyat.",
            "Obat yang sudah dibeli lunas menggunakan uang pajak warga sengaja disandera demi menggemukkan rekening satu tanda tangan.",
            "Sekarang bayangkan, gimana kalau hari ini katup segel gudang obat itu kita putar buka bersama dokter jaga dan warga?",
            "Begitu pintu gudang dibuka paksa oleh audit publik, seluruh stok obat mengalir deras langsung ke rak puskesmas tanpa komisi satu rupiah pun.",
            "Angka di atas loket seketika melonjak menjadi seratus persen tersedia gratis, dan ibu beserta seluruh lansia langsung pulang membawa obat lengkap.",
            "Obatnya bukan nggak ada di gudang, cuma ketahan tanda tangan yang minta jatah.",
            "Kalau audit gudang terbuka diterapkan di seluruh daerah, layanan kesehatan mana yang wajib diperiksa paling pertama?",
        ],
        "shots_spec": [
            {"pill": "JAM 06.00", "sub": "64 ANTRE · STOK OBAT 0", "hl": ["Di loket depan *tertulis habis,*", "di gudang belakang *menumpuk penuh.*"], "layout": "v18_b1_queue_zero_stock"},
            {"pill": "RESEP DITOLAK", "sub": "DISURUH BELI DI LUAR", "hl": [], "layout": "v18_b2_ibu_empty_prescription"},
            {"pill": "BALIK DINDING", "sub": "GUDANG PENUH OBAT EMAS", "hl": [], "layout": "v18_b3_warehouse_gold_pile"},
            {"pill": "TAHAN DISTRIBUSI", "sub": "TUNGGU KOMISI VENDOR", "hl": ["Bukan karena *obatnya langka,*", "tapi ditahan *demi komisi gelap.*"], "delayedReveal": True, "layout": "v18_b4_chat_vendor_fee"},
            {"pill": "SKOR TIMPANG", "sub": "LOKET 0% : GUDANG 100%", "hl": [], "layout": "v18_b5_scoreboard_irony"},
            {"pill": "DISANDERA", "sub": "PAJAK KESEHATAN WARGA", "hl": [], "layout": "v18_b5_siphon"},
            {"pill": "LANSIA MENUNGGU", "sub": "OBAT SUDAH DIBAYAR PAJAK", "hl": ["Obat yang dibeli *uang rakyat*", "disandera *satu tanda tangan.*"], "delayedReveal": True, "layout": "v18_b7_siphon"},
            {"pill": "BUKA SEGEL", "sub": "AUDIT GUDANG TERBUKA", "hl": ["Gimana kalau *segel gudangnya*", "dibuka paksa *oleh warga?*"], "delayedReveal": True, "layout": "v18_b7_valve_warehouse"},
            {"pill": "ALIRKAN PENUH", "sub": "TANPA POTONGAN KOMISI", "hl": [], "layout": "v18_b8_flow_medicine", "flowLeft": "STOK GUDANG OBAT", "flowTargets": ["PUSKESMAS DESA", "OBAT LANSIA", "KLINIK GRATIS"]},
            {"pill": "STOK 100%", "sub": "SEMUA WARGA TERLAYANI", "hl": ["Stok loket *seratus persen penuh,*", "ibu dan lansia *sembuh gratis.*"], "delayedReveal": True, "layout": "v18_b9_counter_100_percent"},
            {"pill": "KUNCI TRANSPARAN", "sub": "HARAM TAHAN OBAT RAKYAT", "hl": ["Obatnya bukan *nggak ada di gudang.*", "Cuma ketahan *tanda tangan yang minta jatah.*"], "delayedReveal": True, "layout": "v18_b11_punchline_lock"},
            {"pill": "GILIRANMU", "sub": "MANA WAJIB DIAUDIT?", "hl": ["Kalau diaudit *besok pagi,*", "layanan mana *wajib dicek duluan?*"], "layout": "v18_b12_cta", "ctaLabels": ["GUDANG OBAT", "ANTREAN RS", "AMBULANS DESA"]},
        ],
    },

    # V19 — Layout B + D + F: Layar 5 Jam vs 1 Menit Laporan Warga
    {
        "num": 19,
        "slug": "gh-v19-layar-lima-jam",
        "title": "Layar 5 Jam vs 1 Menit Laporan Keluhan Warga",
        "display_title": "5 Jam vs 1 Menit: Layar Pejabat vs Laporan Warga",
        "wa_file": "gh-v19-layar-lima-jam.mp4",
        "caption": (
            "🎬 *5 JAM vs 1 MENIT: Layar Pejabat vs Laporan Warga*\n\n"
            "Lima jam sehari habis buat scroll layar HP pribadi di ruang kerja dingin. Tapi saat warga kirim foto jalan banjir dan berlubang, cuma dilirik 1 detik dan dibalas bot otomatis 'Laporan Diterima' tanpa pernah ditindaklanjuti.\n\n"
            "Gimana kalau setiap laporan warga yang lewat 24 jam otomatis mengunci seluruh layar HP dan TV kantor pejabat sampai jalan tersebut selesai diperbaiki? 👇\n\n"
            "#Develapar #LaporanWarga #PelayananPublik #SuaraWarga #AnimasiIndonesia #RelateBanget #FYPIndonesia"
        ),
        "lines": [
            "Di lantai atas pejabat betah lima jam menatap layar ponsel pribadinya, tapi di lantai bawah laporan warga cuma dilirik satu detik.",
            "Pagi-pagi kamu memotret jalan desa yang rusak dan banjir, lalu mengirimkannya ke aplikasi pengaduan resmi dengan harapan segera diperbaiki.",
            "Satu detik kemudian muncul balasan pesan otomatis bertuliskan laporan diterima, namun sampai enam bulan berlalu tak ada satu pun petugas yang datang.",
            "Sementara itu di dalam ruang kerja berpendingin udara, tiga ratus empat puluh laporan warga menumpuk diabaikan karena sang oknum sibuk menonton hiburan.",
            "Di layar monitor kantor, potret warga yang kebanjiran hanya dianggap bayangan garis putus-putus yang tak penting untuk segera diurus.",
            "Waktu kerja yang dibayar penuh oleh pajak rakyat habis untuk jempol pribadi, bukan untuk menyelesaikan keluhan masyarakat.",
            "Semakin lama laporan warga didiamkan di tumpukan berkas, semakin parah kerusakan jalan yang membahayakan pengendara setiap hari.",
            "Sekarang bayangkan, gimana kalau sistem aplikasi pengaduan warga itu kita putar balik dengan kunci otomatis dua puluh empat jam?",
            "Begitu laporan jalan rusak tidak dikerjakan dalam sehari, seluruh layar ponsel dan televisi di kantor pejabat otomatis terkunci menayangkan lubang jalan itu secara langsung.",
            "Mau tak mau sang pejabat langsung turun ke lapangan membawa alat berat sampai jalanan mulus kembali dalam waktu kurang dari dua puluh empat jam.",
            "Lima jam buat scroll layar sendiri, jangan sampai satu menit pun nggak sempat baca keluhan warga.",
            "Kalau aturan kunci layar otomatis ini dipasang di kantor dinas kotamu, keluhan apa yang paling cepat beres?",
        ],
        "shots_spec": [
            {"pill": "5 JAM vs 0:01", "sub": "LAYAR PRIBADI vs KELUHAN WARGA", "hl": ["Lima jam *scroll hiburan sendiri,*", "satu detik *abaikan laporan warga.*"], "layout": "v19_b1_opensplit_screen_hook"},
            {"timerPill": "08.00", "sub": "WARGA KIRIM FOTO JALAN RUSAK", "hl": [], "layout": "v19_b2_citizen_send_photo"},
            {"timerPill": "08.01", "sub": "CUMA DIBALAS BOT OTOMATIS", "hl": [], "layout": "v19_b3_bot_auto_reply"},
            {"pill": "340 LAPORAN", "sub": "MENUMPUK DIABAIKAN 6 BULAN", "hl": ["Ratusan laporan *dibiarkan berdebu,*", "jam kerja habis *buat main ponsel.*"], "delayedReveal": True, "layout": "v19_b4_official_5hours_chill"},
            {"pill": "TAK DIGUBRIS", "sub": "WARGA DIANGGAP BAYANGAN", "hl": [], "layout": "v19_b5_mirror_ignored_report"},
            {"pill": "GAJI PAJAK", "sub": "DIBAYAR UNTUK MELAYANI", "hl": [], "layout": "v19_b6_siphon"},
            {"pill": "MAKIN PARAH", "sub": "JALAN RUSAK MEMBAHAYAKAN", "hl": ["Digaji penuh *dari pajak warga,*", "tapi tuli *saat warga melapor.*"], "delayedReveal": True, "layout": "v19_b7_siphon"},
            {"pill": "PUTAR SISTEM", "sub": "KUNCI LAYAR OTOMATIS 24 JAM", "hl": ["Gimana kalau *layar ponsel mereka*", "terkunci *tayangan lubang jalan?*"], "delayedReveal": True, "layout": "v19_b7_valve_screen"},
            {"pill": "TERKUNCI LIVE", "sub": "POTONG TUNJANGAN HARIAN", "hl": [], "layout": "v19_b8_flow_fix", "flowLeft": "SISTEM PAKSA KERJA", "flowTargets": ["RESPON 24 JAM", "JALAN MULUS", "POTONG TUNJANGAN"]},
            {"timerPill": "24 JAM", "sub": "PEJABAT TURUN LANGSUNG TUNTAS", "hl": ["Layar terkunci *sampai jalan mulus,*", "laporan warga *tuntas sehari.*"], "delayedReveal": True, "layout": "v19_b9_official_rushing_fix"},
            {"pill": "WAJIB RESPON", "sub": "JABATAN ADALAH PELAYANAN", "hl": ["Lima jam buat *scroll layar sendiri.*", "Satu menit pun *nggak sempat baca keluhan warga.*"], "delayedReveal": True, "layout": "v19_b11_punchline_lock"},
            {"pill": "GILIRANMU", "sub": "LAPORAN APA DULU?", "hl": ["Kalau layar pejabat *dikunci laporanmu,*", "masalah apa *yang langsung beres?*"], "layout": "v19_b12_cta", "ctaLabels": ["JALAN BANJIR", "SAMPAH NUMPUK", "LAMPU PADAM"]},
        ],
    },

    # V20 — Layout A: Split-Box Active Dimming (Kontrakan 3x4 vs Rumah Dinas Kosong)
    {
        "num": 20,
        "slug": "gh-v20-atap-sendiri",
        "title": "Atap Sendiri Kontrakan Tiga Kali Empat vs Rumah Dinas Kosong",
        "display_title": "Atap Sendiri: Kontrakan 3×4 vs Rumah Dinas Kosong",
        "wa_file": "gh-v20-atap-sendiri.mp4",
        "caption": (
            "🎬 *ATAP SENDIRI: Kontrakan 3×4 vs Rumah Dinas Kosong*\n\n"
            "Di kotak atas, rumah dinas mewah senilai Rp8 miliar dibiarkan kosong berdebu (0 penghuni), tapi biaya perawatannya tetap menyedot Rp480 juta pajak warga tiap tahun. "
            "Di kotak bawah, keluarga pekerja berjuang di kontrakan petak 3×4 meter demi menabung atap sendiri.\n\n"
            "Gimana kalau seluruh rumah dinas kosong dialihfungsikan jadi klinik & asrama warga, dan anggarannya jadi subsidi rumah 0% bagi pekerja? 👇\n\n"
            "#Develapar #AtapSendiri #RumahRakyat #SuaraWarga #AnimasiIndonesia #RelateBanget #FYPIndonesia"
        ),
        "lines": [
            "Di kotak atas rumah dinas senilai delapan miliar rupiah dibiarkan kosong tanpa penghuni, sedangkan di kotak bawah keluargamu berhimpitan di kontrakan petak tiga kali empat meter.",
            "Coba nyalakan kotak bawah: di bawah satu bohlam hangat, kamu dan istri menyisihkan gaji sedikit demi sedikit sambil menadah atap kontrakan yang bocor saat hujan.",
            "Sekarang nyalakan kotak atas: gedung rumah dinas yang luas dan berpagar tinggi itu kosong sepanjang tahun karena pejabatnya sudah punya tiga rumah pribadi lain.",
            "Lebih perih lagi, sementara gajimu tiga koma dua juta habis untuk sewa petak sempit, pajakmu justru dipakai membayar empat ratus delapan puluh juta biaya perawatan rumah kosong itu.",
            "Di papan rencana perumahan rakyat, program rumah terjangkau bagi pekerja terus ditunda dan direvisi, sedangkan anggaran renovasi pagar pejabat selalu cair duluan.",
            "Ribuan keluarga pekerja keras mengantre puluhan tahun demi sepetak atap sendiri, sementara aset gedung miliaran rupiah menganggur menjadi sarang debu.",
            "Pajak dari mereka yang belum punya rumah justru menyubsidi kemewahan gedung kosong milik mereka yang kelebihan rumah.",
            "Sekarang bayangkan, gimana kalau hari ini katup alih fungsi aset negara kita putar balik seratus delapan puluh derajat?",
            "Setiap rumah dinas mewah yang dibiarkan kosong otomatis diambil alih warga menjadi klinik kesehatan gratis, perpustakaan, dan asrama pelajar desa.",
            "Dan dana perawatannya yang ratusan juta dialihkan penuh menjadi program rumah milik sendiri tanpa bunga bagi keluarga pekerja yang jujur.",
            "Rumah miliaran dibiarkan kosong berdebu, sementara yang kerja keras berjuang demi petak tiga kali empat.",
            "Kalau rumah dinas kosong di kotamu dialihfungsikan besok pagi, paling cocok diubah jadi apa untuk warga?",
        ],
        "shots_spec": [
            {"pill": "ATAP SENDIRI", "sub": "RUMAH DINAS Rp8 M vs PETAK 3x4", "hl": ["Rumah miliaran *kosong berdebu,*", "keluarga pekerja *di petak tiga kali empat.*"], "layout": "v20_b1_split_both"},
            {"pill": "PETAK 3x4 METER", "sub": "SEWA Rp800 RIBU SEBULAN", "hl": [], "layout": "v20_b2_split_focus_bot"},
            {"pill": "0 PENGHUNI", "sub": "RUMAH DINAS MEWAH KOSONG", "hl": [], "layout": "v20_b3_split_focus_top"},
            {"pill": "BIAYA RAWAT", "sub": "Rp480 JUTA DARI PAJAK WARGA", "hl": ["Yang ngontrak *bayar pajak rutin,*", "buat merawat *rumah kosong pejabat.*"], "delayedReveal": True, "layout": "v20_b4_expense_rent_burden"},
            {"pill": "DITUNDA LAGI", "sub": "RUMAH SUBSIDI PEKERJA", "hl": [], "layout": "v20_b5_blueprint_rejected"},
            {"pill": "TIMPANG", "sub": "GEDUNG KOSONG vs ANTREAN KPR", "hl": [], "layout": "v20_b6_siphon"},
            {"pill": "TERBALIK", "sub": "TUNAWISMA SUBSIDI ISTANA KOSONG", "hl": ["Belum punya atap *dipajaki terus,*", "kelebihan rumah *malah disubsidi.*"], "delayedReveal": True, "layout": "v20_b7_siphon"},
            {"pill": "ALIH FUNGSI", "sub": "AMBIL ALIH ASET MENGANGGUR", "hl": ["Gimana kalau *rumah dinas kosong*", "diubah jadi *klinik & rumah warga?*"], "delayedReveal": True, "layout": "v20_b7_valve_reclaim"},
            {"pill": "SUBSIDI 0%", "sub": "ATAP LAYAK UNTUK PEKERJA", "hl": [], "layout": "v20_b8_flow_homes", "flowLeft": "DANA RUMAH DINAS", "flowTargets": ["RUMAH PEKERJA 0%", "KLINIK WARGA", "ASRAMA PELAJAR"]},
            {"pill": "MILIK SENDIRI", "sub": "BEBAS KONTRAKAN & BEBAS BOCOR", "hl": ["Rumah dinas jadi *klinik warga,*", "keluarga pekerja *punya atap sendiri.*"], "delayedReveal": True, "layout": "v20_b10_house_stamped_lunas"},
            {"pill": "HAK PAPAN WARGA", "sub": "SETIAP PEKERJA BERHAK PUNYA RUMAH", "hl": ["Rumah miliaran *dibiarkan kosong berdebu.*", "Sementara yang kerja keras *berjuang demi petak tiga kali empat.*"], "delayedReveal": True, "layout": "v20_b11_punchline_lock"},
            {"pill": "GILIRANMU", "sub": "JADI APA RUMAH KOSONG?", "hl": ["Kalau rumah dinas kosong *dialihkan,*", "paling pas *diubah jadi apa?*"], "layout": "v20_b12_cta", "ctaLabels": ["RUMAH PEKERJA", "KLINIK GRATIS", "ASRAMA PELAJAR"]},
        ],
    },
]
