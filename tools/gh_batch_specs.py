# tools/gh_batch_specs.py — Complete specifications & bespoke @garishidup.idn 12-shot scene generators for Videos #1..#10
import json

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

VIDEOS = [
    {
        "num": 1,
        "slug": "gh-v1-pajak-warga",
        "title": "Pajak Warga Empat Tangki Satu Pipa",
        "display_title": "Pajak Warga: Empat Tangki, Satu Pipa",
        "wa_file": "gh-v1-pajak-warga.mp4",
        "caption": (
            "🎬 *PAJAK WARGA: Empat Tangki, Satu Pipa*\n\n"
            "Yang ngisi tangki pajak itu kamu sebulan penuh—dari subuh Ibu dorong gerobak sayur, Ayah berangkat kerja, sampai kamu lembur tiap malam. "
            "Tapi yang nguras habis cuma butuh satu tanda tangan.\n\n"
            "Gimana kalau hari ini katup pipa emas itu kita putar balik 180 derajat dan dikunci gembok milik warga? "
            "Kalau katup ini dipasang di daerahmu besok pagi, tangki mana dulu yang wajib diisi penuh: Sekolah, Puskesmas, atau Modal Warga? Tulis di kolom komentar! 👇\n\n"
            "#Develapar #PajakWarga #SuaraWarga #AnimasiIndonesia #EdukasiPublik #RelateBanget #FYPIndonesia #CeritaWarga"
        ),
        "lines": [
            "Yang ngisi tangki pajak itu kamu sebulan penuh, tapi yang nguras habis cuma butuh satu tanda tangan.",
            "Jam setengah lima subuh, ibu sudah dorong gerobak sayur dan ayah berangkat kerja sebelum matahari terbit.",
            "Sementara kamu duduk di depan layar sampai larut malam, mengejar gaji yang tiap bulan langsung terpotong pajak otomatis.",
            "Dari keringat pedagang, buruh, dan guru honorer, semuanya dikumpulkan setetes demi setetes ke dalam satu tangki kas warga.",
            "Tapi di satu ruang rapat tertutup tengah malam, sebatang pena emas menandatangani proyek fiktif miliaran rupiah.",
            "Seketika pipa emas di bawah meja menyedot habis tiga tangki warga sampai kering, hanya untuk memenuhi satu tangki oknum pejabat.",
            "Akibatnya atap sekolah desa dibiarkan bocor tiga tahun, sedangkan garasi rumah pribadinya penuh tiga mobil mewah.",
            "Sekarang bayangkan, gimana kalau hari ini katup pipa emas itu kita putar balik seratus delapan puluh derajat?",
            "Begitu katup sitaan dibuka, setiap rupiah yang pernah disunat mengalir deras kembali mengisi tangki sekolah, puskesmas, dan modal warga.",
            "Dalam tiga puluh hari, sekolah yang bocor langsung terang benderang, sementara garasi mewah si koruptor disita sampai kosong melompong.",
            "Katup pipanya kini dikunci gembok emas milik warga, karena tangki negara bukan celengan pribadi pejabat.",
            "Kalau katup ini dipasang di daerahmu besok pagi, tangki mana dulu yang wajib diisi penuh?",
        ],
    },
    {
        "num": 2,
        "slug": "gh-v2-satu-jembatan",
        "title": "Satu Jembatan Dua Nasib",
        "display_title": "2022-2026: Satu Jembatan, Dua Nasib",
        "wa_file": "gh-v2-satu-jembatan.mp4",
        "caption": (
            "🎬 *2022 → 2026: Satu Jembatan, Dua Nasib*\n\n"
            "Jembatan desanya retak dalam sebulan, tapi garasi rumah pejabatnya penuh mobil mewah dalam seminggu.\n\n"
            "Gimana kalau seluruh mobil mewah hasil sunatan anggaran itu dilebur jadi rangka baja emas penopang jembatan desa, dan si koruptor wajib jaga palang pintu jembatan tiap pagi? "
            "Di daerahmu ada jembatan atau jalan yang nasibnya kayak gini? 👇\n\n"
            "#Develapar #SatuJembatanDuaNasib #SuaraWarga #AnimasiIndonesia #InfrastrukturDesa #RelateBanget #FYPIndonesia"
        ),
        "lines": [
            "Jembatan desanya sudah retak dalam sebulan, tapi garasi rumah pejabatnya penuh mobil mewah dalam seminggu.",
            "Setiap jam enam pagi, kamu dan adikmu harus meniti papan jembatan kayu yang goyang di atas sungai deras.",
            "Ayah menahan napas sambil menuntun motor tuanya pelan-pelan, takut roda depannya terperosok ke celah papan yang lapuk.",
            "Padahal di papan proyek pinggir sungai, tertulis jelas anggaran pembangunan jembatan beton senilai empat miliar rupiah.",
            "Tapi di ruang belakang kantor dinas, ketebalan besi dan semennya dipangkas separuh demi komisi gelap satu tanda tangan.",
            "Hasilnya dari tahun dua ribu dua puluh dua sampai dua ribu dua puluh enam, jembatan warga makin miring sedangkan garasi dia nambah tiga mobil emas.",
            "Di kotak atas anak sekolah bertaruh nyawa menyeberang sungai, di kotak bawah dia memanaskan mesin mobil sport tiap akhir pekan.",
            "Sekarang bayangkan, gimana kalau hari ini seluruh mobil mewah di garasinya disita dan dilebur jadi rangka jembatan baja emas?",
            "Begitu katup audit warga dibuka, dana empat miliar yang dikorupsi mengalir penuh membangun jembatan beton berlapis baja kokoh.",
            "Dalam sebulan, jembatan desa berdiri megah terang benderang, sementara garasi rumah si pejabat kosong disegel warga.",
            "Dan sebagai hukuman tambahannya, si koruptor wajib berdiri di pos ujung jembatan setiap pagi untuk menyeberangkan anak-anak sekolah.",
            "Kalau aturan lebur aset kayak gini diterapkan di kotamu, proyek mangkrak mana yang paling duluan berdiri megah?",
        ],
        "shots_spec": [
            {"pill": "2022 → 2026", "sub": "ANGGARAN Rp4 MILIAR", "hl": ["Jembatannya *retak sebulan,*", "garasinya *penuh seminggu.*"], "layout": "split_bridge_garage_hook"},
            {"pill": "06:00", "sub": "BERANGKAT SEKOLAH", "hl": ["Meniti *papan kayu goyang*", "di atas *sungai deras.*"], "layout": "bridge_walk_morning"},
            {"pill": " MOTOR AYAH", "sub": "PAPAN LAPUK", "hl": ["Takut roda *terperosok*", "ke celah *jembatan kayu.*"], "layout": "bridge_scooter_risk"},
            {"pill": "Rp4 MILIAR", "sub": "PAPAN PROYEK DESA", "hl": ["Di papan tertulis *beton kokoh,*", "di sungai *tinggal kayu.*"], "layout": "project_board_irony"},
            {"pill": "KOMISI GELAP", "sub": "SUNAT SPESIFIKASI", "hl": ["Besi dan semen *dipangkas separuh*", "demi *satu tanda tangan.*"], "layout": "office_siphon_spec"},
            {"pill": "4 TAHUN", "sub": "2022 · 2024 · 2026", "hl": ["Jembatan *makin miring,*", "garasi dia *tiga mobil emas.*"], "layout": "gauges_bridge_vs_cars"},
            {"pill": "DUA NASIB", "sub": "DESA KITA vs RUMAH DIA", "hl": ["Di atas *anak bertaruh nyawa,*", "di bawah *mobil sport mengkilap.*"], "layout": "split_bridge_vs_sportcars"},
            {"pill": "PUTAR BALIK", "sub": "LEBUR ASET SITAAN", "hl": ["Gimana kalau *mobil mewahnya*", "dilebur jadi *baja jembatan?*"], "layout": "valve_melt_cars"},
            {"pill": "100% UTUH", "sub": "KEMBALI KE JEMBATAN", "hl": ["Empat miliar *mengalir balik*", "membangun *rangka baja emas.*"], "layout": "flow_to_golden_bridge"},
            {"pill": "HARI 30", "sub": "JEMBATAN PULIH", "hl": ["Jembatan desa *berdiri megah,*", "garasi koruptor *kosong disita.*"], "layout": "split_golden_bridge_empty_garage"},
            {"pill": "POS JAGA", "sub": "HUKUMAN WARGA", "hl": ["Wajib *jaga palang jembatan*", "seberangkan *anak sekolah.*"], "layout": "corruptor_guard_bridge"},
            {"pill": "GILIRANMU", "sub": "PROYEK MANA DULU?", "hl": ["Kalau diterapkan *di kotamu,*", "jembatan mana *wajib dibangun?*"], "layout": "cta_three_infrastructure"},
        ],
    },
    {
        "num": 3,
        "slug": "gh-v3-lampu-subuh",
        "title": "Lampu Subuh dan Gang Gelap",
        "display_title": "Jam 05.00 Subuh: Lampu yang Nggak Pernah Padam",
        "wa_file": "gh-v3-lampu-subuh.mp4",
        "caption": (
            "🎬 *JAM 05.00 SUBUH: Lampu yang Nggak Pernah Padam*\n\n"
            "Lampu warung Ibu nyala sebelum subuh pakai token Rp20.000, tapi lampu jalan depan warung gelap gulita lima tahun padahal anggarannya Rp1,8 miliar.\n\n"
            "Gimana kalau listrik rumah mewah si koruptor disambung kabel emas langsung buat menerangi seluruh tiang lampu gang warga? "
            "Gang di tempat tinggalmu sudah terang atau masih nunggu anggaran turun? 👇\n\n"
            "#Develapar #LampuSubuh #SuaraWarga #AnimasiIndonesia #CeritaWarga #RelateBanget #FYPIndonesia"
        ),
        "lines": [
            "Lampu warung ibumu menyala sebelum subuh, tapi lampu jalan di depan warungnya dibiarkan gelap lima tahun.",
            "Jam lima kurang sepuluh, ibu sudah menyalakan satu bohlam kecil sambil menghitung sisa token listrik dua puluh ribu rupiah.",
            "Di bawah cahaya bohlam lima watt itu, ibu menata gorengan dan nasi bungkus supaya ayah dan tetangga bisa sarapan sebelum kerja.",
            "Sementara tepat di luar pagar warung, deretan tiang lampu jalan proyek pemerintah berdiri mati seperti besi rongsokan.",
            "Di atas kertas laporan dinas, proyek penerangan jalan itu tertulis lunas satu koma delapan miliar rupiah dengan lampu kualitas terbaik.",
            "Namun kenyataannya, dana kabel dan baterainya dikuras lewat mark-up pengadaan demi menyalakan lampu kristal di vila pribadi pejabat.",
            "Akibatnya setiap malam warga pulang kerja meraba jalan gelap berlubang, sedangkan halaman rumah pejabat terang benderang sampai pagi.",
            "Sekarang bayangkan, gimana kalau meteran listrik rumah mewah si koruptor kita sambung kabel emas langsung ke seluruh tiang gang warga?",
            "Begitu sakelar sitaan ditarik warga, arus daya dari aset koruptor mengalir penuh menyalakan seratus tiang lampu desa.",
            "Seketika jalanan depan warung ibu terang benderang seperti siang hari, sementara lampu kristal di vila koruptor diputus total.",
            "Di setiap tiang lampu gang kini terpasang pelat emas bertuliskan dibiayai penuh dari sitaan mark-up pejabat.",
            "Kalau kabel sitaan ini dipasang malam ini juga, gang mana di daerahmu yang paling butuh diterangi duluan?",
        ],
        "shots_spec": [
            {"pill": "05:00 SUBUH", "sub": "WARUNG vs JALAN DESA", "hl": ["Lampu warung *nyala subuh,*", "lampu jalan *gelap lima tahun.*"], "layout": "split_warung_vs_darkstreet"},
            {"pill": "Rp20.000", "sub": "TOKEN LISTRIK IBU", "hl": ["Satu bohlam *lima watt*", "dihemat *sebulan penuh.*"], "layout": "ibu_token_bulb"},
            {"pill": "05:15", "sub": "NASI BUNGKUS SUBUH", "hl": ["Menata *sarapan warga*", "di bawah *lampu redup.*"], "layout": "warung_morning_prep"},
            {"pill": "5 TAHUN MATI", "sub": "TIANG PROYEK", "hl": ["Deretan tiang *berdiri bisu*", "seperti *besi rongsokan.*"], "layout": "dead_streetlights_row"},
            {"pill": "Rp1,8 MILIAR", "sub": "MARK-UP PENGADAAN", "hl": ["Di laporan *kualitas terbaik,*", "di lapangan *kabel kosong.*"], "layout": "office_lamp_markup"},
            {"pill": "KRISTAL MEWAH", "sub": "VILA PRIBADI DIA", "hl": ["Dana lampu gang *dikuras*", "demi *lampu kristal pejabat.*"], "layout": "siphon_lamps_to_villa"},
            {"pill": "22:30 MALAM", "sub": "GANG GELAP vs VILA TERANG", "hl": ["Warga pulang *meraba gelap,*", "halaman dia *terang benderang.*"], "layout": "split_dark_alley_bright_villa"},
            {"pill": "BALIK SAKELAR", "sub": "KABEL SITAAN WARGA", "hl": ["Gimana kalau *listrik vilanya*", "disambung ke *tiang gang warga?*"], "layout": "valve_switch_power"},
            {"pill": "100 TIANG", "sub": "ARUS BALIK EMAS", "hl": ["Arus sitaan *mengalir deras*", "menyalakan *seluruh lampu desa.*"], "layout": "flow_power_to_poles"},
            {"pill": "TERANG TOTAL", "sub": "DIALIHKAN KE WARGA", "hl": ["Depan warung ibu *terang benderang,*", "vila koruptor *gelap disita.*"], "layout": "split_bright_warung_dark_villa"},
            {"pill": "PELAT EMAS", "sub": "MILIK WARGA DESA", "hl": ["Meteran dikunci *gembok warga,*", "bukan lagi *mainan pejabat.*"], "layout": "padlock_power_meter"},
            {"pill": "GILIRANMU", "sub": "GANG MANA DULU?", "hl": ["Kalau dipasang *malam ini,*", "jalan mana *wajib terang?*"], "layout": "cta_three_streetlights"},
        ],
    },
    {
        "num": 4,
        "slug": "gh-v4-hari-gajian",
        "title": "Hari Gajian Potongan Tak Pernah Absen",
        "display_title": "Hari Gajian: Potongan yang Nggak Pernah Absen",
        "wa_file": "gh-v4-hari-gajian.mp4",
        "caption": (
            "🎬 *HARI GAJIAN: Potongan yang Nggak Pernah Absen*\n\n"
            "Gajimu bisa telat masuk, tapi potongan pajaknya nggak pernah telat sedetik pun. Sayangnya di bawah meja, dana itu bocor lewat perjalanan dinas fiktif.\n\n"
            "Gimana kalau setiap Rp1.000 pajak yang bocor otomatis memunculkan pin GPS emas di HP warga yang menunjuk langsung ke meja makan si pejabat? 👇\n\n"
            "#Develapar #HariGajian #SlipGaji #SuaraWarga #AnimasiIndonesia #RelateBanget #FYPIndonesia"
        ),
        "lines": [
            "Gaji bulananmu bisa saja telat masuk sehari, tapi potongan pajaknya tidak pernah telat sedetik pun.",
            "Setiap tanggal dua puluh lima malam, kamu menatap layar ponsel menunggu notifikasi gaji hasil lembur sebulan penuh.",
            "Begitu angka gajimu muncul, seketika baris potongan pajak langsung memangkasnya otomatis sebelum sempat kamu sentuh.",
            "Kamu ikhlas membayarnya, karena percaya potongan keringat itu akan berubah jadi obat puskesmas dan bangku sekolah adikmu.",
            "Tapi di gedung seberang sana, selembar surat perjalanan dinas fiktif sedang dicap basah untuk liburan keluarga oknum pejabat.",
            "Pipa kas negara yang seharusnya mengalir ke kampungmu justru dilubangi dari bawah untuk membiayai hotel bintang lima mereka.",
            "Di kotak atas kamu berhitung sisa gaji buat bayar kontrakan, di kotak bawah dia memesan hidangan mewah pakai uang potonganmu.",
            "Sekarang bayangkan, gimana kalau setiap seribu rupiah pajak yang bocor otomatis menyalakan alarm GPS emas di ponsel seluruh warga?",
            "Begitu uang pajak disalahgunakan, layar ponselmu, ayahmu, dan ibumu langsung menampilkan titik lokasi meja makan si pejabat secara langsung.",
            "Dalam hitungan menit, warga satu kelurahan datang mengelilingi meja makannya sambil mengangkat struk potongan pajak masing-masing.",
            "Tidak ada lagi ruang rapat gelap, karena setiap rupiah dari slip gajimu kini terpasang pelacak emas yang dikunci warga.",
            "Kalau fitur pelacak pajak ini aktif di ponselmu besok pagi, anggaran dinas mana yang pertama kali mau kamu lacak?",
        ],
        "shots_spec": [
            {"pill": "TANGGAL 25", "sub": "HARI GAJIAN", "hl": ["Gajimu *bisa telat,*", "potongannya *tak pernah telat.*"], "layout": "payslip_cut_hook"},
            {"pill": "23:40 MALAM", "sub": "MENUNGGU NOTIFIKASI", "hl": ["Sebulan penuh *lembur kerja,*", "menatap *layar ponsel.*"], "layout": "hero_waiting_phone"},
            {"pill": "POTONG OTOMATIS", "sub": "SLIP GAJI WARGA", "hl": ["Belum sempat *disentuh tangan,*", "langsung *terpotong pajak.*"], "layout": "progress_salary_cut"},
            {"pill": "HARAPAN WARGA", "sub": "SEKOLAH & PUSKESMAS", "hl": ["Ikhlas dipotong *demi warga,*", "bukan demi *liburan pejabat.*"], "layout": "three_citizen_hopes"},
            {"pill": "DINAS FIKTIF", "sub": "STEMPEL MALAM", "hl": ["Surat perjalanan *palsu dicap*", "untuk *liburan keluarga dia.*"], "layout": "fake_travel_stamp"},
            {"pill": "PIPA BOCOR", "sub": "HOTEL BINTANG LIMA", "hl": ["Kas warga *disedot ke bawah*", "bayar *kamar mewah oknum.*"], "layout": "siphon_payslip_to_hotel"},
            {"pill": "SATU MALAM", "sub": "KONTRAKAN vs JAMUAN VIP", "hl": ["Kamu hitung *sisa kontrakan,*", "dia pesan *hidangan mewah.*"], "layout": "split_rent_vs_feast"},
            {"pill": "RADAR PAJAK", "sub": "GPS EMAS AKTIF", "hl": ["Gimana kalau *tiap rupiah bocor*", "nyalakan *GPS di HP warga?*"], "layout": "valve_gps_tracker"},
            {"pill": "LOKASI TERLACAK", "sub": "SINYAL LANGSUNG", "hl": ["Layar ponsel *warga menyala*", "menunjuk *meja makan pejabat.*"], "layout": "flow_gps_to_table"},
            {"pill": "TAGIH LANGSUNG", "sub": "STRUK PAJAK WARGA", "hl": ["Warga datang *bawa struk gaji,*", "meja jamuan *langsung dibekukan.*"], "layout": "split_citizens_surround_vip"},
            {"pill": "KUNCI PELACAK", "sub": "TRANSPARAN 100%", "hl": ["Setiap rupiah *kini terlacak,*", "dikunci *gembok audit warga.*"], "layout": "padlock_payslip_radar"},
            {"pill": "GILIRANMU", "sub": "LACAK YANG MANA?", "hl": ["Kalau fitur ini *ada di HP-mu,*", "dana mana *wajib dilacak?*"], "layout": "cta_three_trackers"},
        ],
    },
    {
        "num": 5,
        "slug": "gh-v5-kursi-tunggu",
        "title": "Kursi Tunggu Siapa Duduk Siapa Berdiri",
        "display_title": "Kursi Tunggu: Siapa yang Duduk, Siapa yang Berdiri",
        "wa_file": "gh-v5-kursi-tunggu.mp4",
        "caption": (
            "🎬 *KURSI TUNGGU: Siapa yang Duduk, Siapa yang Berdiri*\n\n"
            "Ibumu antre dari jam empat pagi di bangku besi dingin memegang nomor 142, sementara oknum pejabat masuk lewat pintu belakang langsung duduk di sofa VIP.\n\n"
            "Gimana kalau sofa emas di ruang VIP itu disita buat tempat duduk lansia di loket umum, dan si koruptor wajib berdiri seharian memegang papan nomor antrean warga? 👇\n\n"
            "#Develapar #KursiTunggu #PelayananPublik #SuaraWarga #AnimasiIndonesia #RelateBanget #FYPIndonesia"
        ),
        "lines": [
            "Ibumu sudah antre dari jam empat pagi di bangku besi dingin, tapi pejabatnya masuk lewat pintu belakang tanpa nomor antrean.",
            "Saat jalanan masih gelap, ayah dan ibu sudah duduk berdesakan di ruang tunggu umum sambil menggenggam kertas nomor seratus empat puluh dua.",
            "Banyak kursi tunggu yang besinya sudah patah dan berkarat, membuat lansia terpaksa berdiri berjam-jam menunggu loket dibuka.",
            "Padahal anggaran peremajaan ruang pelayanan publik tahun ini sudah cair ratusan juta rupiah dari pajak warga.",
            "Ternyata separuh dananya dialihkan diam-diam untuk membeli sofa kulit berlapis emas dan pendingin ruangan di kamar kerja kepala kantor.",
            "Di kotak atas warga lanjut usia mengipas wajah dengan kertas antrean, di kotak bawah oknum pejabat bersandar empuk ditemani dua staf khusus.",
            "Yang punya uang pajak disuruh berdiri menunggu, sedangkan yang digaji dari pajak justru dilayani seperti raja.",
            "Sekarang bayangkan, gimana kalau hari ini seluruh sofa emas dan pendingin ruang VIP itu dipindahkan paksa ke ruang tunggu warga?",
            "Begitu putusan warga berlaku, ruang loket umum langsung berubah penuh kursi empuk berlapis emas untuk setiap lansia dan ibu hamil.",
            "Sementara ruang VIP pejabat dikosongkan, dan pintunya dibuka lebar tanpa ada lagi jalur belakang.",
            "Sebagai hukumannya, si oknum koruptor wajib berdiri delapan jam sehari di depan loket sambil memegang papan nomor antrean warga.",
            "Kalau aturan balik kursi ini berlaku besok pagi, kantor layanan mana di kotamu yang paling wajib ditukar kursinya?",
        ],
        "shots_spec": [
            {"pill": "04:00 SUBUH", "sub": "NOMOR ANTREAN 142", "hl": ["Kamu antre *dari jam empat,*", "dia masuk *pintu belakang.*"], "layout": "split_queue_vs_backdoor"},
            {"pill": "KURSI BESI", "sub": "RUANG TUNGGU UMUM", "hl": ["Duduk berdesakan *di besi dingin*", "genggam *kertas nomor 142.*"], "layout": "citizen_cold_bench"},
            {"pill": "BERKARAT", "sub": "LANSIA BERDIRI", "hl": ["Kursi tunggu *patah berkarat,*", "warga lansia *terpaksa berdiri.*"], "layout": "broken_bench_elderly"},
            {"pill": "ANGGARAN CAIR", "sub": "DANA PELAYANAN PUBLIK", "hl": ["Anggaran kursi *ratusan juta*", "sudah cair *dari pajakmu.*"], "layout": "service_budget_bar"},
            {"pill": "RUANG KEPALA", "sub": "SOFA KULIT EMAS", "hl": ["Dananya *disedot diam-diam*", "beli *sofa emas ruang VIP.*"], "layout": "siphon_bench_to_sofa"},
            {"pill": "09:30 PAGI", "sub": "LOKET UMUM vs RUANG VIP", "hl": ["Di atas *lansia kipas kertas,*", "di bawah *pejabat tidur empuk.*"], "layout": "split_elderly_fan_vs_vip_sofa"},
            {"pill": "TERBALIK", "sub": "SIAPA BAYAR SIAPA?", "hl": ["Yang bayar pajak *disuruh berdiri,*", "yang digaji pajak *jadi raja.*"], "layout": "gauges_wait_time"},
            {"pill": "TUKAR KURSI", "sub": "PUTUSAN WARGA", "hl": ["Gimana kalau *sofa emas VIP*", "dipindah ke *loket lansia?*"], "layout": "valve_swap_chairs"},
            {"pill": "PINDAH PENUH", "sub": "100% FASILITAS WARGA", "hl": ["Sofa dan AC *mengalir balik*", "ke ruang *tunggu masyarakat.*"], "layout": "flow_sofa_to_public"},
            {"pill": "HARI PERTAMA", "sub": "WARGA DUDUK NYAMAN", "hl": ["Lansia duduk *di kursi emas,*", "ruang VIP *kosong melompong.*"], "layout": "split_golden_lobby_empty_vip"},
            {"pill": "BERDIRI 8 JAM", "sub": "PEGANG PAPAN ANTREAN", "hl": ["Koruptor *wajib berdiri seharian*", "pegang *nomor antrean warga.*"], "layout": "corruptor_holding_queue_sign"},
            {"pill": "GILIRANMU", "sub": "LOKET MANA DULU?", "hl": ["Kalau diterapkan *besok pagi,*", "kantor mana *wajib ditukar?*"], "layout": "cta_three_offices"},
        ],
    },
    {
        "num": 6,
        "slug": "gh-v6-anggaran-gizi",
        "title": "Anggaran Gizi Isi Nampan Menyusut",
        "display_title": "Anggaran Gizi: Isi Nampan yang Menyusut",
        "wa_file": "gh-v6-anggaran-gizi.mp4",
        "caption": (
            "🎬 *ANGGARAN GIZI: Isi Nampan yang Menyusut*\n\n"
            "Di kertas laporan tertulis Rp25.000 per porsi lengkap empat sehat lima sempurna, tapi pas tutup nampan dibuka di meja sekolah tinggal nasi kering dan selembar kerupuk Rp6.000.\n\n"
            "Gimana kalau selama masa hukuman, menu makan si koruptor ditukar persis dengan nampan Rp6.000 hasil sunatannya, sementara selisih Rp19.000-nya kembali jadi susu dan gizi utuh buat anak-anak? 👇\n\n"
            "#Develapar #AnggaranGizi #MakanAnak #SuaraWarga #AnimasiIndonesia #RelateBanget #FYPIndonesia"
        ),
        "lines": [
            "Di kertas laporan tertulis empat sehat lima sempurna, tapi waktu tutup nampan dibuka tinggal nasi kering dan selembar kerupuk.",
            "Setiap pagi kamu melepas anakmu berangkat sekolah dengan harapan dia mendapat asupan bergizi dari program anggaran negara.",
            "Dalam dokumen pengadaan resmi, setiap nampan anak tercatat berharga dua puluh lima ribu rupiah lengkap dengan susu, ayam, dan buah segar.",
            "Namun sebelum sampai ke dapur sekolah, anggarannya dipotong berlapis-lapis oleh calo vendor dan oknum pejabat.",
            "Sembilan belas ribu rupiah per nampan menguap jadi komisi proyek, menyisakan enam ribu rupiah untuk makan siang seorang murid.",
            "Di kotak atas meja rapat pejabat penuh hidangan prasmanan mewah, di kotak bawah anak-anak menatap selembar kerupuk tipis di nampannya.",
            "Gizi masa depan satu generasi dikorbankan begitu saja demi menggemukkan rekening segelintir orang dewasa.",
            "Sekarang bayangkan, gimana kalau menu makan si koruptor selama masa hukuman ditukar persis dengan nampan enam ribu rupiah hasil sunatannya?",
            "Begitu rekening komisi vendor disita, selisih sembilan belas ribu rupiah per porsi langsung dikembalikan utuh ke dapur ibu-ibu kantin desa.",
            "Keesokan harinya, nampan di meja murid langsung penuh susu hangat, daging, dan buah segar sesuai angka dua puluh lima ribu rupiah.",
            "Sementara di ruang tahanan, si oknum pejabat duduk menatap nampan berisi selembar kerupuk yang dulu ia berikan pada anak-anak.",
            "Kalau hukum tukar nampan ini disahkan hari ini, setuju nggak berlaku untuk semua penyunat anggaran gizi dan pendidikan?",
        ],
        "shots_spec": [
            {"pill": "Rp25.000 → Rp6.000", "sub": "ISI NAMPAN MENYUSUT", "hl": ["Di laporan *lima sempurna,*", "di nampan *tinggal kerupuk.*"], "layout": "split_pdf_tray_vs_real_tray"},
            {"pill": "06:30 PAGI", "sub": "HARAPAN ORANG TUA", "hl": ["Melepas anak *berangkat sekolah*", "berharap *gizi yang layak.*"], "layout": "parents_send_child_school"},
            {"pill": "DOKUMEN RESMI", "sub": "Rp25.000 PER PORSI", "hl": ["Tertulis lengkap *susu, ayam,*", "dan *buah segar setiap hari.*"], "layout": "golden_full_tray_spec"},
            {"pill": "POTONG BERLAPIS", "sub": "KOMISI VENDOR GELAP", "hl": ["Sebelum sampai *dapur sekolah,*", "dipangkas *calo dan oknum.*"], "layout": "siphon_tray_budget"},
            {"pill": "SISA Rp6.000", "sub": "Rp19.000 MENGUAP", "hl": ["Sembilan belas ribu *jadi komisi,*", "sisa *enam ribu di meja murid.*"], "layout": "gauges_nutrition_drop"},
            {"pill": "JAM MAKAN SIANG", "sub": "PRASMANAN VIP vs MEJA SD", "hl": ["Meja rapat *penuh prasmanan,*", "meja murid *selembar kerupuk.*"], "layout": "split_vip_buffet_vs_kerupuk"},
            {"pill": "MASA DEPAN", "sub": "GIZI ANAK BANGSA", "hl": ["Gizi anak *dikuras habis*", "demi *rekening segelintir oknum.*"], "layout": "child_looking_empty_tray"},
            {"pill": "TUKAR NAMPAN", "sub": "PUTUSAN WARGA", "hl": ["Gimana kalau *menu koruptor*", "ditukar *nampan Rp6.000 itu?*"], "layout": "valve_swap_trays"},
            {"pill": "KEMBALI Rp19.000", "sub": "DAPUR KANTIN WARGA", "hl": ["Dana sitaan *mengalir balik*", "langsung ke *dapur ibu kantin.*"], "layout": "flow_money_to_school_kitchen"},
            {"pill": "GIZI 100% UTUH", "sub": "MURID vs KORUPTOR", "hl": ["Nampan murid *penuh susu emas,*", "nampan koruptor *satu kerupuk.*"], "layout": "split_full_school_tray_vs_prison_kerupuk"},
            {"pill": "KUNCI DAPUR", "sub": "AUDIT ORANG TUA", "hl": ["Anggaran gizi *dikunci ibu-ibu,*", "tak bisa *disunat calo lagi.*"], "layout": "padlock_nutrition_fund"},
            {"pill": "SETUJU?", "sub": "HUKUM TUKAR NAMPAN", "hl": ["Kalau disahkan *hari ini,*", "setuju buat *semua penyunat gizi?*"], "layout": "cta_tray_justice"},
        ],
    },
    {
        "num": 7,
        "slug": "gh-v7-aspal-dua-cm",
        "title": "Aspal Dua Centimeter Tebal di Proposal",
        "display_title": "Aspal 2 CM: Tebal di Proposal, Tipis di Jalan",
        "wa_file": "gh-v7-aspal-dua-cm.mp4",
        "caption": (
            "🎬 *ASPAL 2 CM: Tebal di Proposal, Tipis di Jalan*\n\n"
            "Di proposal tagihan tertulis tebal 15 cm kualitas utama, tapi pas kena hujan pertama langsung mengelupas sisa 2 cm sampai motor Ayah terperosok.\n\n"
            "Gimana kalau kasur tidur si koruptor dipangkas sisa 2 cm mengikuti tebal aspal yang dia sunat, sementara uang sitaannya langsung menebalkan jalan desa jadi 15 cm mulus? 👇\n\n"
            "#Develapar #AspalTipis #JalanBerlubang #SuaraWarga #AnimasiIndonesia #RelateBanget #FYPIndonesia"
        ),
        "lines": [
            "Tebal aspalnya lima belas sentimeter di kertas tagihan, tapi langsung mengelupas saat kena hujan pertama.",
            "Baru sebulan lalu jalan depan kampungmu diaspal hitam mengkilap menjelang kunjungan pejabat daerah.",
            "Namun begitu hujan deras turun semalam, lapisan atasnya langsung terkelupas seperti kerupuk basah menyisakan batu kerikil tajam.",
            "Saat ayah pulang kerja membawa karung belanjaan ibu, roda motornya menghantam lubang dalam hingga terjatuh di genangan air.",
            "Ketika diukur dengan penggaris warga, tebal aspal yang seharusnya lima belas sentimeter ternyata cuma dua sentimeter tipis.",
            "Tiga belas sentimeter sisanya telah disulap menjadi uang komisi untuk membeli kasur empuk dan perabot mewah di rumah pemborong dan oknum dinas.",
            "Di kotak atas ayah mengobati lututnya yang terluka di pinggir jalan berlubang, di kotak bawah si oknum tidur nyenyak di kasur tebal tiga puluh sentimeter.",
            "Sekarang bayangkan, gimana kalau ketebalan kasur tidur si koruptor dipotong persis mengikuti tebal aspal dua sentimeter yang ia sisakan untuk warga?",
            "Begitu aset pemborong nakal dan oknum pejabat disita, seluruh dananya langsung dicor ulang ke jalanan desa dengan pengawasan warga.",
            "Lapisan fondasi beton dan aspal mulus setebal lima belas sentimeter penuh akhirnya terbentang rata disertai lampu markah emas.",
            "Kini motor ayah dan gerobak ibu melaju mulus tanpa lubang, sementara si koruptor harus tidur di atas alas tipis dua sentimeter.",
            "Kalau penggaris audit warga ini dipakai mengukur jalan di depan rumahmu sekarang, kira-kira berapa sentimeter tebal aslinya?",
        ],
        "shots_spec": [
            {"pill": "15 CM vs 2 CM", "sub": "PROPOSAL vs KENYATAAN", "hl": ["Tebal di *kertas tagihan,*", "mengelupas pas *hujan pertama.*"], "layout": "cross_section_asphalt_hook"},
            {"pill": "SEBULAN LALU", "sub": "ASPAL KUNJUNGAN", "hl": ["Hitam mengkilap *sehari saja*", "demi foto *pejabat lewat.*"], "layout": "fresh_thin_asphalt"},
            {"pill": "HUJAN PERTAMA", "sub": "TERKELUPAS HABIS", "hl": ["Lapisan tipis *langsung hancur*", "menyisakan *lubang tajam.*"], "layout": "rain_peeling_road"},
            {"pill": "MOTOR AYAH", "sub": "JATUH DI LUBANG", "hl": ["Roda menghantam *lubang jalan,*", "belanjaan ibu *tumpah di air.*"], "layout": "father_scooter_pothole"},
            {"pill": "PENGGARIS WARGA", "sub": "CUMA 2 SENTIMETER", "hl": ["Dibayar untuk *15 sentimeter,*", "dipasang cuma *2 sentimeter.*"], "layout": "ruler_measure_2cm"},
            {"pill": "13 CM HILANG", "sub": "JADI KASUR MEWAH", "hl": ["Tiga belas senti *aspal warga*", "berubah jadi *kasur mewah dia.*"], "layout": "siphon_asphalt_to_mattress"},
            {"pill": "MALAM ITU", "sub": "LUTUT LUKA vs KASUR TEBAL", "hl": ["Ayah obati *lutut terluka,*", "dia tidur *di kasur 30 senti.*"], "layout": "split_injured_father_vs_thick_bed"},
            {"pill": "POTONG 2 CM", "sub": "HUKUM UKUR SAMA", "hl": ["Gimana kalau *kasur tidurnya*", "dipotong sisa *2 sentimeter?*"], "layout": "valve_cut_mattress"},
            {"pill": "COR ULANG", "sub": "15 CM PENUH", "hl": ["Uang sitaan *mengalir balik*", "menebalkan *jalan desa 15 senti.*"], "layout": "flow_concrete_15cm"},
            {"pill": "MULUS 100%", "sub": "JALAN EMAS vs ALAS 2 CM", "hl": ["Motor ayah *melaju mulus,*", "koruptor tidur *di alas tipis.*"], "layout": "split_smooth_road_vs_thin_mat"},
            {"pill": "GARIS AUDIT", "sub": "STANDAR WARGA", "hl": ["Ketebalan jalan *dikunci warga,*", "tak bisa *dikupas hujan lagi.*"], "layout": "padlock_road_standard"},
            {"pill": "UKUR SEKARANG", "sub": "BERAPA CM JALANMU?", "hl": ["Kalau jalan *depan rumahmu*", "diukur hari ini, *tebalnya berapa?*"], "layout": "cta_ruler_road"},
        ],
    },
    {
        "num": 8,
        "slug": "gh-v8-beasiswa-salah-rumah",
        "title": "Beasiswa Salah Rumah Siapa Belajar Siapa Dapat",
        "display_title": "Beasiswa Salah Rumah: Siapa yang Belajar, Siapa yang Dapat",
        "wa_file": "gh-v8-beasiswa-salah-rumah.mp4",
        "caption": (
            "🎬 *BEASISWA SALAH RUMAH: Siapa yang Belajar, Siapa yang Dapat*\n\n"
            "Yang belajar sampai jam dua pagi ditemani ibu menjahit justru ditolak, sedangkan yang santai main konsol lolos lewat jalur kuota titipan pejabat.\n\n"
            "Gimana kalau sistem audit terbuka memindahkan jubah toga emas dan dana beasiswa langsung ke meja anak yang lampunya menyala paling malam? 👇\n\n"
            "#Develapar #BeasiswaWarga #AnakPetani #PerjuanganKuliah #AnimasiIndonesia #RelateBanget #FYPIndonesia"
        ),
        "lines": [
            "Yang belajar sampai lampu kamarnya redup justru ditolak, sedangkan yang tidak pernah buka buku lolos lewat kuota titipan pejabat.",
            "Setiap malam sampai jam dua pagi, kamu masih mengerjakan tugas kuliah di meja kayu sambil ditemani suara mesin jahit ibu.",
            "Ayah merelakan motor satu-satunya dijual demi membayar uang semester awalmu, sambil berharap kamu mendapat beasiswa prestasi tahun ini.",
            "Nilai indeks prestasimu mencapai tiga koma sembilan dua, tertinggi di angkatanmu dan memenuhi semua syarat keluarga kurang mampu.",
            "Namun di ruang panitia tertutup, namamu dicoret dengan satu goresan pena untuk digantikan nama anak pejabat pemilik mobil mewah.",
            "Di kotak atas kamu menatap layar pengumuman bertuliskan ditolak dengan mata berkaca-kaca, di kotak bawah anak pejabat santai bermain konsol dengan status lolos.",
            "Beasiswa yang seharusnya mengangkat derajat keluarga petani justru dibelokkan menjadi uang saku tambahan bagi keluarga yang sudah berlimpah.",
            "Sekarang bayangkan, gimana kalau sistem audit warga otomatis menyalakan sensor kejujuran yang melacak jam belajar dan kondisi rumah asli pendaftar?",
            "Begitu manipulasi kuota terdeteksi, dana beasiswa dan hak kuliah emas langsung ditarik kembali dan dikirim lurus ke meja belajarmu.",
            "Sementara nama pejabat yang menitipkan kuota langsung terpampang terang di papan pengumuman gerbang kampus dan diwajibkan mengganti dua kali lipat.",
            "Empat tahun kemudian, kamu berdiri di panggung wisuda mengenakan toga emas kebanggaan ayah dan ibu yang bertepuk tangan di barisan depan.",
            "Kalau audit beasiswa terbuka ini dipasang di seluruh kampus dan sekolah, berapa banyak mimpi anak daerah yang akhirnya terselamatkan?",
        ],
        "shots_spec": [
            {"pill": "KUOTA BEASISWA", "sub": "BELAJAR vs TITIPAN", "hl": ["Yang belajar *sampai subuh ditolak,*", "yang titipan *langsung lolos.*"], "layout": "split_study_vs_console_hook"},
            {"pill": "02:00 PAGI", "sub": "SEMESTER 3", "hl": ["Belajar di *meja kayu sempit*", "ditemani *mesin jahit ibu.*"], "layout": "split_ibu_sewing_child_study"},
            {"pill": "DIJUAL", "sub": "MOTOR AYAH", "hl": ["Motor ayah *dijual rela*", "demi *uang kuliah pertama.*"], "layout": "father_sell_scooter_tuition"},
            {"pill": "IPK 3,92", "sub": "TERTINGGI DI ANGKATAN", "hl": ["Nilai *hampir sempurna,*", "syarat warga *kurang mampu lengkap.*"], "layout": "gpa_progress_high"},
            {"pill": "DICORET", "sub": "JALUR BELAKANG", "hl": ["Namamu *dihapus satu pena*", "diganti *anak oknum pejabat.*"], "layout": "office_swap_scholarship_name"},
            {"pill": "PENGUMUMAN", "sub": "DITOLAK vs LOLOS VIP", "hl": ["Di atas *menangis ditolak,*", "di bawah *santai dapat kuota.*"], "layout": "split_rejected_tear_vs_vip_pass"},
            {"pill": "SALAH ALAMAT", "sub": "DANA PENDIDIKAN", "hl": ["Hak anak *petani dan buruh*", "disedot jadi *uang jajan elit.*"], "layout": "siphon_scholarship_fund"},
            {"pill": "AUDIT TERBUKA", "sub": "SENSOR KEJUJURAN", "hl": ["Gimana kalau *kuota titipan*", "langsung *dibalik ke pemilik sah?*"], "layout": "valve_scholarship_audit"},
            {"pill": "PULIH 100%", "sub": "HAK KULIAH EMAS", "hl": ["Dana beasiswa *mengalir lurus*", "ke meja *anak yang berjuang.*"], "layout": "flow_scholarship_to_hero"},
            {"pill": "WISUDA", "sub": "SARJANA PERTAMA KELUARGA", "hl": ["Di atas *toga emas di panggung,*", "di bawah *Ayah Ibu tepuk tangan.*"], "layout": "split_graduation_stage_parents"},
            {"pill": "TOGA KITA", "sub": "BUKAN PUNYAKU SENDIRI", "hl": ["Toga ini *milik keringat Ayah Ibu,*", "dikunci *audit milik warga.*"], "layout": "hero_golden_toga_parents"},
            {"pill": "GILIRANMU", "sub": "MIMPI ANAK DAERAH", "hl": ["Kalau semua *kampus diaudit,*", "berapa juta *mimpi terselamatkan?*"], "layout": "cta_graduation_dreams"},
        ],
    },
    {
        "num": 9,
        "slug": "gh-v9-koper-dan-gerobak",
        "title": "Koper dan Gerobak Berat Sama Isi Beda",
        "display_title": "Koper & Gerobak: Berat yang Sama, Isi yang Beda",
        "wa_file": "gh-v9-koper-dan-gerobak.mp4",
        "caption": (
            "🎬 *KOPER & GEROBAK: Berat yang Sama, Isi yang Beda*\n\n"
            "Ayahmu mendorong gerobak 80 kilogram seharian di bawah terik matahari demi Rp50.000, sementara oknum pejabat mengangkat koper berisi Rp80 miliar hasil suap sekali jalan.\n\n"
            "Gimana kalau koper emas Rp80 miliar itu dibuka paksa di balai warga dan diubah menjadi 1.600 gerobak modal usaha baru untuk seluruh pedagang pasar? 👇\n\n"
            "#Develapar #KoperDanGerobak #PedagangKecil #SuaraWarga #AnimasiIndonesia #RelateBanget #FYPIndonesia"
        ),
        "lines": [
            "Ayahmu mendorong gerobak delapan puluh kilogram seharian penuh, tapi dia mengangkat koper delapan puluh miliar sekali jalan.",
            "Sejak matahari belum naik, urat tangan ayah menegang mendorong gerobak kayu melewati tanjakan pasar yang becek.",
            "Setelah sepuluh jam bermandi keringat, uang receh yang dibawa pulang ke meja dapur hanya cukup untuk beras dan lauk sederhana.",
            "Lebih perih lagi, dana bantuan modal usaha pedagang kecil yang dijanjikan pemerintah daerah tak kunjung turun selama dua tahun.",
            "Ternyata di balik pintu hotel mewah, dana ratusan miliar itu sudah dipindahkan ke dalam koper-koper rapat milik oknum pejabat.",
            "Di atas timbangan kehidupan, keringat delapan puluh kilogram gerobak ayah hanya dihargai lima puluh ribu, sedangkan koper gelapnya bernilai delapan puluh miliar.",
            "Di kotak atas gerobak pedagang digusur dari pinggir jalan, di kotak bawah koper suap masuk ke bagasi mobil dinas tanpa hambatan.",
            "Sekarang bayangkan, gimana kalau koper delapan puluh miliar itu disita warga dan dibuka paksa di tengah lapangan pasar?",
            "Begitu kunci koper emas itu dibongkar, seluruh isinya langsung dicairkan menjadi seribu enam ratus gerobak usaha baru lengkap dengan modal dagangan.",
            "Setiap pedagang pasar, ibu warung, dan tukang sayur menerima gerobak beroda emas tanpa potongan sepeser pun.",
            "Sementara si oknum pejabat harus menarik gerobak kayu kosong mengelilingi pasar untuk mengangkut sampah dagangan warga setiap pagi.",
            "Kalau satu koper sitaan bisa jadi ribuan modal usaha warga, usaha kecil apa di lingkunganmu yang paling pantas dibantu duluan?",
        ],
        "shots_spec": [
            {"pill": "80 KG vs 80 M", "sub": "GEROBAK vs KOPER", "hl": ["Ayah dorong *gerobak 80 kilo,*", "dia angkat *koper 80 miliar.*"], "layout": "giant_scale_cart_vs_briefcase"},
            {"pill": "05:30 PAGI", "sub": "TANJAKAN PASAR", "hl": ["Sepuluh jam *mandi keringat*", "dorong *gerobak kayu berat.*"], "layout": "father_pushing_heavy_cart"},
            {"pill": "Rp50.000", "sub": "HASIL SEHARIAN", "hl": ["Uang receh *di meja dapur*", "cukup buat *beras hari ini.*"], "layout": "small_coins_table"},
            {"pill": "MODAL UMKM", "sub": "2 TAHUN MACET", "hl": ["Dana bantuan *pedagang kecil*", "tak pernah *sampai ke pasar.*"], "layout": "stalled_umkm_bar"},
            {"pill": "KOPER HOTEL", "sub": "TRANSAKSI MALAM", "hl": ["Ratusan miliar *masuk ke koper*", "di balik *pintu kamar VIP.*"], "layout": "vip_briefcase_handover"},
            {"pill": "TIMBANGAN TIMPANG", "sub": "KERINGAT vs SUAP", "hl": ["Keringat warga *dihargai receh,*", "tanda tangan *bernilai miliar.*"], "layout": "gauges_cart_vs_briefcase"},
            {"pill": "DUA PEMANDANGAN", "sub": "PASAR vs LOBI HOTEL", "hl": ["Di atas *gerobak ayah digusur,*", "di bawah *koper emas masuk bagasi.*"], "layout": "split_evicted_cart_vs_hotel_trunk"},
            {"pill": "BONGKAR KOPER", "sub": "SITAAN PASAR WARGA", "hl": ["Gimana kalau *koper 80 miliar*", "dibuka paksa *di tengah pasar?*"], "layout": "valve_unlock_briefcase"},
            {"pill": "1.600 GEROBAK", "sub": "MODAL USAHA WARGA", "hl": ["Isi koper *mengalir berubah*", "jadi *ribuan gerobak modal.*"], "layout": "flow_briefcase_to_carts"},
            {"pill": "PASAR BANGKIT", "sub": "PEDAGANG vs KORUPTOR", "hl": ["Pedagang dapat *gerobak emas,*", "koruptor tarik *gerobak sampah.*"], "layout": "split_golden_carts_vs_corruptor_cart"},
            {"pill": "KUNCI MODAL", "sub": "KOPERASI WARGA", "hl": ["Dana pasar *dikunci pedagang,*", "tak bisa *dimasukkan koper lagi.*"], "layout": "padlock_market_fund"},
            {"pill": "GILIRANMU", "sub": "USAHA MANA DULU?", "hl": ["Kalau koper ini *dibagi di kotamu,*", "usaha warga mana *wajib dibantu?*"], "layout": "cta_three_carts"},
        ],
    },
    {
        "num": 10,
        "slug": "gh-v10-struk-terakhir",
        "title": "Struk Terakhir Warisan Tak Pernah Diminta",
        "display_title": "Struk Terakhir: Warisan yang Nggak Pernah Diminta",
        "wa_file": "gh-v10-struk-terakhir.mp4",
        "caption": (
            "🎬 *STRUK TERAKHIR: Warisan yang Nggak Pernah Diminta*\n\n"
            "Kakek dan Ayahmu mewariskan nama baik dan kerja keras, tapi koruptor mewariskan beban utang proyek fiktif ke pundak anak-cucumu—sementara dia cuma duduk 4 tahun lalu bebas.\n\n"
            "Gimana kalau hukuman koruptor nggak dihitung pakai tahun penjara, melainkan *Meteran Lunas Warga (0% → 100%)*: pintu selnya baru terbuka kalau setiap rupiah + bunganya sudah kembali 100% ke kas desa? 👇\n\n"
            "#Develapar #StrukTerakhir #MeteranLunas #SuaraWarga #AnimasiIndonesia #RelateBanget #FYPIndonesia"
        ),
        "lines": [
            "Ayahmu bekerja keras mewariskan nama baik, tapi koruptor mewariskan tagihan utang proyek fiktif ke pundak generasi berikutnya.",
            "Dari zaman kakekmu di tahun sembilan puluh delapan, ayahmu hari ini, sampai kamu sekarang, ketiganya tak pernah berhenti membayar pajak.",
            "Namun setiap kali proyek besar dikorupsi triliunan rupiah, lubang kerugiannya justru ditambal dari beban anggaran warga puluhan tahun ke depan.",
            "Tiga generasi keluarga sederhana berjalan membungkuk memikul batu beban bunga korupsi yang tidak pernah mereka nikmati.",
            "Sedangkan si pelaku yang menguras kas negara hanya menjalani hukuman beberapa tahun setelah dipotong remisi, lalu keluar menikmati sisa hartanya.",
            "Di kotak atas tiga generasi warga memikul beban tagihan seumur hidup, di kotak bawah si koruptor sudah tersenyum bebas di halaman vilanya.",
            "Waktu hukuman mereka selesai dalam hitungan kalender, tapi beban kerugiannya diwariskan ke pundak anak-cucu kita.",
            "Sekarang bayangkan, gimana kalau hukuman koruptor tidak lagi dihitung pakai tahun kalender, melainkan pakai meteran lunas warga?",
            "Di atas pintu selnya dipasang indikator emas nol sampai seratus persen yang terhubung langsung ke kas pengembalian uang rakyat.",
            "Seluruh aset gelap, rekening luar negeri, dan bunga kerugiannya disedot balik setiap detik untuk melunasi beban fasilitas desa.",
            "Begitu meteran emas mencapai seratus persen lunas, batu beban di pundak kakek, ayah, dan kamu langsung terangkat hilang selamanya.",
            "Kalau sistem meteran lunas seratus persen ini dijadikan hukum wajib di Indonesia, setuju nggak tidak ada satu pun koruptor yang keluar sebelum lunas?",
        ],
        "shots_spec": [
            {"pill": "1998 → 2026", "sub": "WARISAN TIGA GENERASI", "hl": ["Bapakmu wariskan *nama baik,*", "dia wariskan *utang proyek.*"], "layout": "three_generations_burden_hook"},
            {"pill": "TAHUN DEMI TAHUN", "sub": "KAKEK · AYAH · AKU", "hl": ["Tiga generasi *taat membayar,*", "tak pernah *absen pajak.*"], "layout": "three_gen_walking_tax"},
            {"pill": "LUBANG TRILIUNAN", "sub": "DITAMBAL WARGA", "hl": ["Proyek fiktif *dikorupsi oknum,*", "tagihannya *dibebankan ke warga.*"], "layout": "siphon_debt_to_citizens"},
            {"pill": "BEBAN BUNGA", "sub": "PIKULAN SEUMUR HIDUP", "hl": ["Membungkuk *pikul beban utang*", "yang tak pernah *kita nikmati.*"], "layout": "heavy_stone_three_gen"},
            {"pill": "CUMA 4 TAHUN", "sub": "POTONG REMISI", "hl": ["Mencuri *triliunan rupiah,*", "keluar cepat *nikmati sisa harta.*"], "layout": "short_sentence_calendar"},
            {"pill": "TIMPANG TOTAL", "sub": "SEUMUR HIDUP vs 4 TAHUN", "hl": ["Warga pikul *beban puluhan tahun,*", "koruptor *bebas tersenyum.*"], "layout": "split_burden_gen_vs_free_corruptor"},
            {"pill": "WARISAN SALAH", "sub": "STRUK TANPA AKHIR", "hl": ["Hukuman dia *selesai di kalender,*", "kerugiannya *turun ke cucumu.*"], "layout": "gauges_calendar_vs_debt"},
            {"pill": "METERAN LUNAS", "sub": "GANTI KALENDER PENJARA", "hl": ["Gimana kalau *hukuman diukur*", "pakai *Meteran Lunas 100%?*"], "layout": "valve_meteran_lunas"},
            {"pill": "0% → 100%", "sub": "SEDOT ASET & BUNGA", "hl": ["Seluruh aset gelap *disedot balik*", "melunasi *kas desa warga.*"], "layout": "flow_repayment_to_100"},
            {"pill": "BEBAN TERANGKAT", "sub": "WARGA TEGAK vs SEL KUNCI", "hl": ["Tiga generasi *berdiri tegak,*", "pintu sel *terkunci sampai lunas.*"], "layout": "split_upright_family_vs_locked_cell"},
            {"pill": "100% LUNAS", "sub": "GEMBOK METERAN WARGA", "hl": ["Pintu sel *dikunci gembok emas*", "sampai *rupiah terakhir kembali.*"], "layout": "padlock_100_percent_meter"},
            {"pill": "SETUJU?", "sub": "WAJIB LUNAS 100%", "hl": ["Setuju nggak *tak boleh bebas*", "sebelum *meteran warga 100%?*"], "layout": "cta_meteran_lunas"},
        ],
    },
]
