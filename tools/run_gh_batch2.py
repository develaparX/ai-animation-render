# tools/run_gh_batch2.py — Sequential background builder & throttled renderer for Batch 2 Videos #11..#20 (@garishidup.idn v2.1 style, watermark: "develapar")
import asyncio, json, os, re, shutil, subprocess, sys, time
from pathlib import Path

STUDIO = Path(__file__).resolve().parent.parent
WA_SEND = Path(os.environ.get("STICK2D_WA_SEND", r"C:/Users/Admin/OpenBot/Shared/wa-send"))
THROTTLE = str(Path(__file__).resolve().parent / "render_throttled.py")
STATUS_FILE = STUDIO / "build" / "gh_batch2_status.json"
LOG_FILE = STUDIO / "build" / "gh_batch2.log"

sys.path.insert(0, str(STUDIO / "tools"))
from common import sentences_from_words, write_timeline, save_json
from transcribe import align_script
from gh_batch2_specs import VIDEOS_BATCH2, SFX_CYCLE

PY = sys.executable
FFMPEG_DIRS = [r"C:\Users\Admin\bin", r"C:\Users\Admin\tools\ffmpeg-9.0.2-essentials_build\bin"]

def log(msg):
    ts = time.strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line, flush=True)
    LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(line + "\n")

def env_with_ffmpeg():
    env = os.environ.copy()
    add = os.pathsep.join([d for d in FFMPEG_DIRS if os.path.isdir(d)])
    env["PATH"] = add + os.pathsep + env.get("PATH", "")
    return env

def probe_duration(path):
    fp = shutil.which("ffprobe", path=env_with_ffmpeg().get("PATH")) or os.path.join(FFMPEG_DIRS[0], "ffprobe.exe")
    p = subprocess.run(
        [fp, "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
        capture_output=True, text=True, env=env_with_ffmpeg()
    )
    try:
        return float(p.stdout.strip())
    except Exception:
        return 0.0

async def synth_edge_with_timings(text, wav_out, rate_pct=24):
    import edge_tts
    mp3 = str(wav_out) + ".mp3"
    rate_str = f"+{rate_pct}%" if rate_pct >= 0 else f"{rate_pct}%"
    last_err = None
    for attempt in range(3):
        try:
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
            break
        except Exception as e:
            last_err = e
            await asyncio.sleep(2.0 * (attempt + 1))
    else:
        raise RuntimeError(f"edge_tts failed after 3 attempts: {last_err}")

    ffmpeg = shutil.which("ffmpeg", path=env_with_ffmpeg().get("PATH")) or os.path.join(FFMPEG_DIRS[1], "ffmpeg.exe")
    subprocess.run([ffmpeg, "-y", "-i", mp3, "-ar", "24000", "-ac", "1", str(wav_out)], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        os.remove(mp3)
    except Exception:
        pass
    return f"edge-tts:id-ID-ArdiNeural:{rate_str}", raw_words, raw_sents

def load_status():
    if STATUS_FILE.exists():
        try:
            return json.loads(STATUS_FILE.read_text(encoding="utf-8"))
        except Exception:
            pass
    items = []
    for v in VIDEOS_BATCH2:
        items.append({
            "num": v["num"],
            "slug": v["slug"],
            "display_title": v["display_title"],
            "wa_file": v["wa_file"],
            "wa_path": str(WA_SEND / v["wa_file"]),
            "caption": v["caption"],
            "status": "pending",
            "sent_wa": False,
            "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        })
    state = {"runner_active": True, "current_video": None, "videos": items}
    save_status(state)
    return state

def save_status(state):
    STATUS_FILE.parent.mkdir(parents=True, exist_ok=True)
    tmp = STATUS_FILE.with_suffix(".tmp")
    tmp.write_text(json.dumps(state, indent=2, ensure_ascii=False), encoding="utf-8")
    os.replace(tmp, STATUS_FILE)

def update_video_status(num, **kwargs):
    st = load_status()
    for item in st["videos"]:
        if item["num"] == num:
            item.update(kwargs)
            item["updated_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            break
    save_status(st)

def build_project_v11_v20(v):
    slug = v["slug"]
    proj_dir = STUDIO / "projects" / slug
    tmp_dir = STUDIO / "build" / "gh_tmp" / slug
    tmp_dir.mkdir(parents=True, exist_ok=True)

    lines = v["lines"]
    script_txt = "\n\n".join(lines) + "\n"
    script_path = tmp_dir / "script.txt"
    script_path.write_text(script_txt, encoding="utf-8")

    wav_path = tmp_dir / "voiceover.wav"
    engine, raw_words, raw_sents = asyncio.run(synth_edge_with_timings(" ".join(lines), wav_path, 24))
    dur = probe_duration(wav_path)
    words_count = len(script_txt.split())
    wps = words_count / dur if dur > 0 else 0
    log(f"[{slug}] Voice synthesized: {engine}, dur={dur:.2f}s, wps={wps:.2f} ({words_count} words)")

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
        "--title", v["title"],
        "--captions"
    ], cwd=str(STUDIO), env=env_with_ffmpeg(), check=True)

    if raw_words:
        aligned_words = align_script(script_txt, raw_words)
        src = "edge-tts:WordBoundary+script"
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

    total_dur = round(max(dur, aligned_words[-1]["end"] + 0.8), 3)
    shots = []
    word_cursor = 0
    for idx, line in enumerate(lines):
        line_toks = re.findall(r"\S+", line)
        n_toks = len(line_toks)
        chunk = aligned_words[word_cursor : word_cursor + n_toks]
        word_cursor += n_toks
        s_start = 0.0 if idx == 0 else round(max(0.0, chunk[0]["start"] - 0.10), 3)
        shots.append({
            "id": f"s{idx+1:03d}",
            "start": s_start,
            "end": round(chunk[-1]["end"], 3),
            "line": line,
            "scene": v["shots_spec"][idx]["layout"],
            "set": "garishidup",
            "bars": None,
            "in": {"type": "cut" if idx == 0 else "fade", "dur": 0.25},
            "sfx": SFX_CYCLE[idx % len(SFX_CYCLE)],
            "notes": f"Beat {idx+1}/12 GarisHidup v2.1"
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
        "title": v["display_title"],
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

    cast_js = """// scenes/cast.js — GarisHidup 3D-shaded capsule cast
import * as GH from '/engine/garishidup.js';
export const CAST = {
  aku:   (g, o = {}) => GH.figure(g, { role: 'hero',  garment: 'none',   label: 'AKU',   ...o }),
  ayah:  (g, o = {}) => GH.figure(g, { role: 'slate', garment: 'kopiah', label: 'AYAH',  ...o }),
  ibu:   (g, o = {}) => GH.figure(g, { role: 'mauve', garment: 'ibu',    label: 'IBU',   ...o }),
  oknum: (g, o = {}) => GH.figure(g, { role: 'gold',  garment: 'suit',   label: 'OKNUM', ...o }),
};
"""
    (proj_dir / "scenes" / "cast.js").write_text(cast_js, encoding="utf-8")

    default_opening = proj_dir / "scenes" / "shots" / "01_opening.js"
    if default_opening.exists():
        default_opening.unlink()

    specs_json = json.dumps(v["shots_spec"], ensure_ascii=False, indent=2)
    shots_js = f"""// scenes/shots/01_main.js — 12 bespoke @garishidup.idn v2.1 shots for {v['slug']} (watermark: "develapar")
import {{ registerShot, clamp }} from '/engine/core.js';
import {{ renderGHShot }} from '/engine/gh_layouts.js';

const SPECS = {specs_json};

SPECS.forEach((spec, idx) => {{
  const id = 's' + String(idx + 1).padStart(3, '0');
  registerShot(id, {{
    draw(g, t, info) {{
      const u = clamp(t / ((info && info.dur) || 5));
      renderGHShot(g, {{ t, u, info }}, spec);
    }}
  }});
}});
"""
    (proj_dir / "scenes" / "shots" / "01_main.js").write_text(shots_js, encoding="utf-8")
    log(f"[{slug}] Project built with 12 bespoke v2.1 shots ({total_dur:.2f}s)")

def render_and_mux(v):
    slug = v["slug"]
    proj_rel = f"projects/{slug}"
    proj_dir = STUDIO / "projects" / slug

    log(f"[{slug}] Step 1/3: Running audio/mix.py (pre-render mix.wav)...")
    subprocess.run(
        [PY, THROTTLE, PY, "audio/mix.py", "--project", proj_rel],
        cwd=str(STUDIO), env=env_with_ffmpeg(), check=True
    )

    log(f"[{slug}] Step 2/3: Rendering video_silent.mp4 (--workers 2 --format jpeg --preset veryfast)...")
    subprocess.run(
        [PY, THROTTLE, "node", "render.mjs", "--project", proj_rel, "--workers", "2", "--format", "jpeg", "--preset", "veryfast"],
        cwd=str(STUDIO), env=env_with_ffmpeg(), check=True
    )

    log(f"[{slug}] Step 3/3: Running audio/mix.py (mux final MP4)...")
    subprocess.run(
        [PY, THROTTLE, PY, "audio/mix.py", "--project", proj_rel],
        cwd=str(STUDIO), env=env_with_ffmpeg(), check=True
    )

    out_dir = proj_dir / "out"
    mp4s = list(out_dir.glob("*.mp4"))
    if not mp4s:
        raise RuntimeError(f"No output MP4 found in {out_dir}")
    src_mp4 = mp4s[0]
    WA_SEND.mkdir(parents=True, exist_ok=True)
    dst_mp4 = WA_SEND / v["wa_file"]
    shutil.copy2(src_mp4, dst_mp4)
    sz_mb = dst_mp4.stat().st_size / (1024 * 1024)
    log(f"[{slug}] COMPLETED -> {dst_mp4} ({sz_mb:.2f} MB)")

def main():
    if "--build-v11-only" in sys.argv:
        build_project_v11_v20(VIDEOS_BATCH2[0])
        return

    log("=== STARTING GARISHIDUP v2.1 (DEVELAPAR) BATCH 2 (V11..V20) RUNNER ===")
    st = load_status()
    st["runner_active"] = True
    save_status(st)

    for v in VIDEOS_BATCH2:
        num = v["num"]
        slug = v["slug"]
        cur_st = load_status()
        item = next((x for x in cur_st["videos"] if x["num"] == num), None)
        if item and item.get("status") == "rendered" and Path(item["wa_path"]).exists():
            log(f"[{slug}] Already rendered, skipping.")
            continue

        cur_st["current_video"] = slug
        save_status(cur_st)
        update_video_status(num, status="rendering", sent_wa=False)

        try:
            build_project_v11_v20(v)
            render_and_mux(v)
            update_video_status(num, status="rendered", sent_wa=False)
        except Exception as e:
            log(f"[{slug}] ERROR: {e}")
            update_video_status(num, status=f"error: {e}")

    fin = load_status()
    fin["runner_active"] = False
    fin["current_video"] = None
    save_status(fin)
    log("=== ALL 10 BATCH 2 VIDEOS (V11..V20) FINISHED ===")

if __name__ == "__main__":
    main()
