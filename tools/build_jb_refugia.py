import asyncio, json, os, re, shutil, subprocess, sys, time
from pathlib import Path

# Root repo = dua level di atas file ini (tools/ -> root).
STUDIO = Path(__file__).resolve().parents[1]
THROTTLE = str(STUDIO / "tools" / "render_throttled.py")
BUILD = STUDIO / "build"
STATUS = BUILD / "jb_refugia_status.json"
LOG = BUILD / "jb_refugia.log"
SLUG = "jb-refugia-pematang"

sys.path.insert(0, str(STUDIO / "tools"))
from common import sentences_from_words, write_timeline
from transcribe import align_script

PY = sys.executable
# ffmpeg: pakai PATH; tambahkan folder lokal bila ffmpeg tidak ada di PATH.
FFMPEG_DIRS = [r"C:\Users\Admin\bin", r"C:\Users\Admin\tools\ffmpeg-9.0.2-essentials_build\bin"]


def log(msg):
    ts = time.strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line, flush=True)
    BUILD.mkdir(parents=True, exist_ok=True)
    with open(LOG, "a", encoding="utf-8") as f:
        f.write(line + "\n")


def env_ff():
    env = os.environ.copy()
    add = os.pathsep.join([d for d in FFMPEG_DIRS if os.path.isdir(d)])
    env["PATH"] = add + os.pathsep + env.get("PATH", "")
    return env


def status(st, prog, extra=None):
    d = {"slug": SLUG, "title": "Kenapa Petani Ini Sengaja Menanam Bunga di Pematang Sawah?",
         "status": st, "progress": prog, "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ"), "sent_wa": False}
    if extra:
        d.update(extra)
    BUILD.mkdir(parents=True, exist_ok=True)
    with open(STATUS, "w", encoding="utf-8") as f:
        json.dump(d, f, indent=2, ensure_ascii=False)


async def synth(wav):
    import edge_tts
    script = (BUILD / "jb_tmp" / "script.txt").read_text(encoding="utf-8")
    lines = [l.strip() for l in script.split("\n") if l.strip()]
    mp3 = str(wav) + ".mp3"
    comm = edge_tts.Communicate(" ".join(lines), "id-ID-ArdiNeural", rate="+18%", boundary="WordBoundary")
    words = []
    with open(mp3, "wb") as f:
        async for ch in comm.stream():
            if ch.get("type") == "audio":
                f.write(ch["data"])
            elif ch.get("type") == "WordBoundary":
                s = ch["offset"] / 10_000_000.0
                du = ch["duration"] / 10_000_000.0
                words.append({"word": ch["text"].strip(), "start": round(s, 3), "end": round(s + max(0.04, du), 3)})
    ff = shutil.which("ffmpeg", path=env_ff().get("PATH")) or os.path.join(FFMPEG_DIRS[1], "ffmpeg.exe")
    subprocess.run([ff, "-y", "-i", mp3, "-ar", "24000", "-ac", "1", str(wav)], check=True,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    os.path.exists(mp3) and os.remove(mp3)
    return words, lines


def probe(path):
    fp = os.path.join(FFMPEG_DIRS[1], "ffprobe.exe")
    if not os.path.exists(fp):
        fp = shutil.which("ffprobe", path=env_ff().get("PATH"))
    p = subprocess.run([fp, "-v", "error", "-show_entries", "format=duration", "-of",
                        "default=noprint_wrappers=1:nokey=1", str(path)],
                       capture_output=True, text=True, env=env_ff())
    try:
        return float(p.stdout.strip())
    except Exception:
        return 0.0


def main():
    log("=== JB REFUGIA BUILD START ===")
    status("building", "synthesizing voice")
    tmp = BUILD / "jb_tmp"
    tmp.mkdir(parents=True, exist_ok=True)
    wav = tmp / "voiceover.wav"
    words, lines = asyncio.run(synth(wav))
    dur = probe(wav)
    log(f"voice {dur:.2f}s, {len(words)} words")

    script_txt = "\n\n".join(lines) + "\n"
    sp = tmp / "script_norm.txt"
    sp.write_text(script_txt, encoding="utf-8")

    proj = STUDIO / "examples" / SLUG
    if proj.exists():
        shutil.rmtree(proj, ignore_errors=True)

    log("scaffold project")
    subprocess.run([PY, "tools/new_project.py", "--name", SLUG, "--voice", str(wav),
                    "--script", str(sp), "--aspect", "9:16", "--resolution", "720p",
                    "--style", "jadiBegini", "--title", "Kenapa Petani Ini Sengaja Menanam Bunga di Pematang Sawah?",
                    "--captions"], cwd=str(STUDIO), env=env_ff(), check=True)

    aligned = align_script(script_txt, words)
    sents = sentences_from_words(aligned)
    write_timeline(str(proj / "timeline"), aligned, sents, "edge-tts:WordBoundary+script")
    total = round(max(dur, aligned[-1]["end"] + 0.7), 3)
    log(f"aligned {len(aligned)} words, total {total:.2f}s")
    status("building", "timeline done", {"duration": total})
    log("=== BUILD PHASE DONE (shots to be written by build_jb_refugia_shots.py) ===")


if __name__ == "__main__":
    main()
