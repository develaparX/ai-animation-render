import asyncio, json, os, re, shutil, subprocess, sys
from pathlib import Path

STUDIO = Path(r"C:/Users/Admin/OpenBot/Shared/growkaz-stickman-studio")
sys.path.insert(0, str(STUDIO / "tools"))
from common import sentences_from_words, write_timeline, save_json
from transcribe import align_script

PY = sys.executable
FFMPEG_DIRS = [r"C:\Users\Admin\bin", r"C:\Users\Admin\tools\ffmpeg-9.0.2-essentials_build\bin"]

SCRIPT_LINES = [
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
]

SHOT_META = [
    {"id": "s001", "scene": "hook_empat_tangki",    "sfx": [{"at": 0.15, "name": "whoosh", "gain": -8}, {"at": 1.8, "name": "hit", "gain": -7}]},
    {"id": "s002", "scene": "subuh_ibu_ayah",       "sfx": [{"at": 0.2, "name": "footstep", "gain": -10}, {"at": 1.6, "name": "shimmer", "gain": -11}]},
    {"id": "s003", "scene": "lembur_potong_gaji",   "sfx": [{"at": 0.25, "name": "tick", "gain": -8}, {"at": 2.1, "name": "pop", "gain": -9}]},
    {"id": "s004", "scene": "tetes_kas_warga",      "sfx": [{"at": 0.3, "name": "pop", "gain": -9}, {"at": 1.9, "name": "shimmer", "gain": -10}]},
    {"id": "s005", "scene": "rapat_pena_emas",      "sfx": [{"at": 0.2, "name": "whoosh", "gain": -8}, {"at": 1.7, "name": "hit", "gain": -6}]},
    {"id": "s006", "scene": "pipa_sedot_oknum",     "sfx": [{"at": 0.2, "name": "whoosh", "gain": -7}, {"at": 2.0, "name": "buzz", "gain": -9}]},
    {"id": "s007", "scene": "split_sekolah_garasi", "sfx": [{"at": 0.25, "name": "tick", "gain": -9}, {"at": 2.1, "name": "hit", "gain": -8}]},
    {"id": "s008", "scene": "putar_katup_emas",     "sfx": [{"at": 0.15, "name": "whoosh", "gain": -6}, {"at": 1.5, "name": "ding", "gain": -6}]},
    {"id": "s009", "scene": "arus_balik_warga",     "sfx": [{"at": 0.2, "name": "shimmer", "gain": -7}, {"at": 2.0, "name": "ding", "gain": -7}]},
    {"id": "s010", "scene": "split_pulih_sita",     "sfx": [{"at": 0.2, "name": "pop", "gain": -8}, {"at": 1.9, "name": "shimmer", "gain": -8}]},
    {"id": "s011", "scene": "gembok_emas_warga",    "sfx": [{"at": 0.2, "name": "hit", "gain": -6}, {"at": 1.6, "name": "ding", "gain": -6}]},
    {"id": "s012", "scene": "cta_tiga_tangki",      "sfx": [{"at": 0.2, "name": "shimmer", "gain": -8}, {"at": 1.8, "name": "pop", "gain": -9}]},
]

def env_with_ffmpeg():
    env = os.environ.copy()
    add = os.pathsep.join([d for d in FFMPEG_DIRS if os.path.isdir(d)])
    env["PATH"] = add + os.pathsep + env.get("PATH", "")
    return env

def probe_duration(path):
    fp = shutil.which("ffprobe", path=env_with_ffmpeg().get("PATH")) or os.path.join(FFMPEG_DIRS[0], "ffprobe.exe")
    p = subprocess.run([fp, "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(path)], capture_output=True, text=True, env=env_with_ffmpeg())
    try:
        return float(p.stdout.strip())
    except Exception:
        return 0.0

async def synth_edge_with_timings(text, wav_out, rate_pct=24):
    import edge_tts
    mp3 = str(wav_out) + ".mp3"
    rate_str = f"+{rate_pct}%" if rate_pct >= 0 else f"{rate_pct}%"
    try:
        comm = edge_tts.Communicate(text, "id-ID-ArdiNeural", rate=rate_str, boundary="WordBoundary")
    except TypeError:
        comm = edge_tts.Communicate(text, "id-ID-ArdiNeural", rate=rate_str)
    raw_words = []
    raw_sents = []
    with open(mp3, "wb") as f:
        async for chunk in comm.stream():
            ctype = chunk.get("type")
            if ctype == "audio":
                f.write(chunk["data"])
            elif ctype == "WordBoundary":
                s = chunk["offset"] / 10_000_000.0
                d = chunk["duration"] / 10_000_000.0
                raw_words.append({"word": chunk["text"].strip(), "start": round(s, 3), "end": round(s + max(0.04, d), 3)})
            elif ctype == "SentenceBoundary":
                s = chunk["offset"] / 10_000_000.0
                d = chunk["duration"] / 10_000_000.0
                raw_sents.append({"text": chunk["text"].strip(), "start": round(s, 3), "end": round(s + max(0.1, d), 3)})

    ffmpeg = shutil.which("ffmpeg", path=env_with_ffmpeg().get("PATH")) or os.path.join(FFMPEG_DIRS[1], "ffmpeg.exe")
    subprocess.run([ffmpeg, "-y", "-i", mp3, "-ar", "24000", "-ac", "1", str(wav_out)], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        os.remove(mp3)
    except Exception:
        pass
    return f"edge-tts:id-ID-ArdiNeural:{rate_str}", raw_words, raw_sents

def main():
    slug = "gh-v1-pajak-warga"
    proj_dir = STUDIO / "projects" / slug
    tmp_dir = STUDIO / "build" / "gh_v1_tmp"
    tmp_dir.mkdir(parents=True, exist_ok=True)

    script_txt = "\n\n".join(SCRIPT_LINES) + "\n"
    script_path = tmp_dir / "script.txt"
    script_path.write_text(script_txt, encoding="utf-8")

    wav_path = tmp_dir / "voiceover.wav"
    words_count = len(script_txt.split())
    rate = 24
    engine, raw_words, raw_sents = asyncio.run(synth_edge_with_timings(" ".join(SCRIPT_LINES), wav_path, rate))
    dur = probe_duration(wav_path)
    wps = words_count / dur if dur > 0 else 0
    print(f"Voice synthesized: {engine}, dur={dur:.2f}s, wps={wps:.2f} ({words_count} words, word_events={len(raw_words)}, sent_events={len(raw_sents)})")

    if proj_dir.exists():
        shutil.rmtree(proj_dir, ignore_errors=True)

    subprocess.run([
        PY, "tools/new_project.py",
        "--name", slug,
        "--voice", str(wav_path),
        "--script", str(script_path),
        "--aspect", "9:16",
        "--resolution", "720p",
        "--style", "garishidup",
        "--title", "Pajak Warga Empat Tangki Satu Pipa",
        "--captions"
    ], cwd=str(STUDIO), env=env_with_ffmpeg(), check=True)

    if raw_words:
        aligned_words = align_script(script_txt, raw_words)
        src = "edge-tts:WordBoundary+script"
    elif raw_sents:
        # Distribute words inside each SentenceBoundary cue
        dist_words = []
        for c in raw_sents:
            toks = re.findall(r"\S+", c["text"])
            if not toks:
                continue
            cdur = max(0.05, c["end"] - c["start"])
            lens = [max(1, len(re.sub(r"[^\w]", "", t))) for t in toks]
            tot_l = sum(lens)
            t = c["start"]
            for tok, ln in zip(toks, lens):
                wd = cdur * (ln / tot_l)
                dist_words.append({"word": tok, "start": round(t, 3), "end": round(min(c["end"], t + wd), 3)})
                t += wd
        aligned_words = align_script(script_txt, dist_words)
        src = "edge-tts:SentenceBoundary+script"
    else:
        toks = re.findall(r"\S+", script_txt)
        lens = [max(1, len(t)) for t in toks]
        tot_l = sum(lens)
        t = 0.0
        aligned_words = []
        for tok, ln in zip(toks, lens):
            wd = (dur - 0.3) * (ln / tot_l)
            aligned_words.append({"word": tok, "start": round(t, 3), "end": round(t + wd, 3)})
            t += wd
        src = "uniform+script"

    sents = sentences_from_words(aligned_words)
    write_timeline(str(proj_dir / "timeline"), aligned_words, sents, src)

    # Build 12 exact shots matching the 12 sentences in SCRIPT_LINES
    total_dur = round(max(dur, aligned_words[-1]["end"] + 0.8), 3)
    shots = []
    word_cursor = 0
    for idx, line in enumerate(SCRIPT_LINES):
        line_toks = re.findall(r"\S+", line)
        n_toks = len(line_toks)
        chunk = aligned_words[word_cursor : word_cursor + n_toks]
        word_cursor += n_toks
        s_start = 0.0 if idx == 0 else round(max(0.0, chunk[0]["start"] - 0.10), 3)
        shots.append({
            "id": SHOT_META[idx]["id"],
            "start": s_start,
            "end": round(chunk[-1]["end"], 3),
            "line": line,
            "scene": SHOT_META[idx]["scene"],
            "set": "garishidup",
            "bars": None,
            "in": {"type": "cut" if idx == 0 else "fade", "dur": 0.25},
            "sfx": SHOT_META[idx]["sfx"],
            "notes": f"Beat {idx+1}/12 GarisHidup"
        })

    for i in range(len(shots)):
        shots[i]["end"] = shots[i + 1]["start"] if i + 1 < len(shots) else total_dur

    save_json(str(proj_dir / "timeline" / "beats.json"), [
        {"i": i, "start": s["start"], "end": s["end"], "text": s["line"]} for i, s in enumerate(shots)
    ])

    music_plan = [
        {"start": 0, "end": round(shots[6]["end"], 2), "mood": "tension", "intensity": 0.45},
        {"start": round(shots[6]["end"], 2), "end": total_dur, "mood": "hopeful", "intensity": 0.65},
    ]
    save_json(str(proj_dir / "story" / "shots.json"), {
        "title": "Pajak Warga: Empat Tangki, Satu Pipa",
        "duration": total_dur,
        "shots": shots,
        "music": music_plan
    })

    cfg_path = proj_dir / "config.json"
    cfg = json.loads(cfg_path.read_text(encoding="utf-8"))
    cfg["fadeIn"] = 0
    cfg["fadeOut"] = 0.5
    cfg["duration"] = total_dur
    cfg["style"] = "garishidup"
    cfg["captions"] = True
    cfg["captionStyle"] = {"y": 1525, "size": 62, "max": 4, "color": "#f5f2ea", "hi": "#f5a623"}
    cfg_path.write_text(json.dumps(cfg, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"Built 12 contiguous shots (total {total_dur:.2f}s, source={src}):")
    for s in shots:
        print(f"  {s['id']} [{s['start']:5.2f}s - {s['end']:5.2f}s] ({s['end']-s['start']:4.2f}s): {s['line'][:65]}...")

if __name__ == "__main__":
    main()
