#!/usr/bin/env python3
"""Generate warm Indonesian neural narration (edge-tts id-ID-ArdiNeural),
custom cinematic SFX/score per topic, sidechain mix, and Whisper word timings."""
from __future__ import annotations

import asyncio
import json
import math
import random
import struct
import subprocess
import sys
import wave
from pathlib import Path

import edge_tts
from faster_whisper import WhisperModel

FFMPEG = r"C:\Users\Admin\tools\ffmpeg-9.0.2-essentials_build\bin\ffmpeg.exe"
FFPROBE = r"C:\Users\Admin\tools\ffmpeg-9.0.2-essentials_build\bin\ffprobe.exe"
VOICE = "id-ID-ArdiNeural"

VIDEOS = {
    "01_matahari": {
        "sfx": "solar",
        "segments": [
            ("hook", "Sekarang ini juga, cahaya matahari butuh delapan menit buat sampai ke matamu.", "+8%", 0.16),
            ("calm", "Artinya kalau detik ini matahari meledak, kamu masih ngopi santai tanpa tahu apa-apa.", "+4%", 0.22),
            ("flash", "Begitu menit kedelapan lewat dua puluh detik, seluruh langit mendadak putih menyilaukan!", "+5%", 0.28),
            ("boil", "Dalam hitungan menit, suhu melonjak ribuan derajat dan lautan mulai mendidih jadi uap raksasa.", "+5%", 0.25),
            ("ember", "Bumi berputar tanpa pegangan, menyisakan bara panas meluncur sendirian di ruang gelap.", "+3%", 0.35),
            ("cta", "Menurutmu, apa yang sempat kamu lakuin di delapan menit terakhir itu? Tulis di komentar.", "+4%", 0.85),
        ],
    },
    "02_lubang_hitam": {
        "sfx": "blackhole",
        "segments": [
            ("hook", "Satu detik di dekat lubang hitam bisa setara tujuh tahun di Bumi!", "+7%", 0.18),
            ("orbit", "Bayangin pesawatmu mulai mendekati cakram cahaya raksasa di tengah ruang hampa.", "+4%", 0.24),
            ("dilation", "Di luar sana waktu terus melaju, sementara jam di tanganmu melambat hampir membeku.", "+4%", 0.25),
            ("lens", "Gravitasi membelokkan seluruh cahaya bintang, membuat sekelilingmu tampak melingkar aneh.", "+5%", 0.25),
            ("tunnel", "Sekali melewati garis batasnya, bahkan cahaya pun nggak sanggup pulang lagi.", "+4%", 0.35),
            ("cta", "Kalau berani masuk dan balik lagi seratus tahun ke depan, siapa yang mau kamu temui?", "+4%", 0.85),
        ],
    },
    "03_petir": {
        "sfx": "storm",
        "segments": [
            ("hook", "Satu sambaran petir itu lima kali lebih panas daripada permukaan matahari!", "+8%", 0.16),
            ("charge", "Tepat sebelum menyambar, awan badai menumpuk tegangan hingga tiga ratus juta volt di atas kepalamu.", "+5%", 0.22),
            ("strike", "Saat jalur plasma terbuka, udara di sekitarnya meledak kejut lebih cepat dari suara!", "+7%", 0.26),
            ("shock", "Gelombang panas dua puluh tujuh ribu derajat menggetarkan tanah dan kaca dalam sekejap.", "+5%", 0.24),
            ("nerve", "Di tubuh manusia, lonjakan listrik sekuat ini langsung membajak sinyal saraf dan detak jantung.", "+4%", 0.32),
            ("cta", "Pernah ngalamin petir nyambar sedekat apa? Ceritain di kolom komentar ya.", "+4%", 0.85),
        ],
    },
    "04_menunda": {
        "sfx": "tech",
        "segments": [
            ("hook", "Sering nunda kerjaan bukan berarti malas, kadang otakmu lagi kerja diam-diam.", "+6%", 0.18),
            ("overload", "Pas kamu paksa mikir di depan dua layar penuh kode, bagian otak depan justru gampang penuh.", "+5%", 0.22),
            ("incubate", "Begitu kamu tinggal jalan sebentar atau bikin kopi, jaringan dalam otak baru mulai menyambung.", "+4%", 0.24),
            ("spark", "Di fase tenang itulah potongan ide yang tadinya buntu tiba-tiba ketemu polanya!", "+6%", 0.26),
            ("solve", "Jadi jeda sebentar sebelum balik lagi sering bikin masalah kelar lebih cepat.", "+4%", 0.32),
            ("cta", "Kamu tim langsung hajar tugas atau butuh jeda dulu baru ketemu ide? Komen di bawah.", "+4%", 0.85),
        ],
    },
    "05_kapal_pesiar": {
        "sfx": "ocean",
        "segments": [
            ("hook", "Terjatuh dari kapal pesiar tengah malam itu hampir mustahil ditemukan lagi.", "+7%", 0.18),
            ("drop", "Dari dek setinggi sepuluh lantai, benturan air laut rasanya sekeras menghantam aspal.", "+5%", 0.24),
            ("shrink", "Di antara ombak gelap, kapal raksasa itu tetap melaju dan menghilang cuma dalam satu menit.", "+5%", 0.25),
            ("underwater", "Di bawah permukaan, air dingin dua belas derajat pelan-pelan menguras tenaga dan suhu tubuhmu.", "+4%", 0.26),
            ("scale", "Dari udara, satu orang di samudra luas itu bahkan lebih kecil dari satu titik di peta.", "+4%", 0.35),
            ("cta", "Menurutmu peluang paling realistis untuk bertahan di situasi ini apa? Tulis pendapatmu.", "+4%", 0.85),
        ],
    },
}


async def synth_all(vid_id: str, pub: Path) -> list[dict]:
    cfg = VIDEOS[vid_id]
    metas = []
    for idx, (key, text, rate, gap) in enumerate(cfg["segments"]):
        assert "what if" not in text.lower()
        assert "simulasi bagaimana jika" not in text.lower()
        mp3 = pub / f"{vid_id}_s{idx}_{key}.mp3"
        wav = pub / f"{vid_id}_s{idx}_{key}.wav"
        comm = edge_tts.Communicate(text, VOICE, rate=rate)
        await comm.save(str(mp3))
        subprocess.run([
            FFMPEG, "-y", "-i", str(mp3),
            "-af", "silenceremove=start_periods=1:start_silence=0.04:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_silence=0.04:start_threshold=-45dB,areverse,highpass=f=85,acompressor=threshold=-17dB:ratio=2.6,loudnorm=I=-14:TP=-1.2:LRA=8",
            "-ar", "48000", "-ac", "2", str(wav)
        ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        dur = float(subprocess.check_output([
            FFPROBE, "-v", "error", "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1", str(wav)
        ], text=True).strip())
        metas.append({"id": key, "text": text, "dur": dur, "gap": gap, "wav": wav.name})
    return metas


def synth_sfx(sfx_kind: str, total_dur: float, segs: list[dict], out_wav: Path) -> None:
    sr = 48000
    n = int(total_dur * sr)
    rng = random.Random(hash(sfx_kind) & 0xFFFF)
    lp1 = lp2 = bp = bpv = 0.0
    hits = [(0.02, 0.28)] + [(s["start"], 0.62) for s in segs[2:-1]]
    t_peak = segs[2]["start"]
    t_cta = segs[-1]["start"]

    # Choose musical root mood by topic
    root_hz = {"solar": 58.27, "blackhole": 49.00, "storm": 55.00, "tech": 73.42, "ocean": 51.91}[sfx_kind]

    with wave.open(str(out_wav), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        buf = bytearray()
        for i in range(n):
            t = i / sr
            w = rng.uniform(-1.0, 1.0)
            lp1 = 0.985 * lp1 + 0.015 * w
            lp2 = 0.996 * lp2 + 0.004 * w

            swell = 0.35 if t < t_peak else 0.75
            if t >= t_cta:
                swell = max(0.22, 0.75 * math.exp(-(t - t_cta) * 0.9))

            if sfx_kind == "tech":
                # Clean rhythmic tech pulse
                arp = 0.5 + 0.5 * math.sin(2 * math.pi * 2.0 * t)
                pad = swell * 0.13 * (
                    math.sin(2 * math.pi * root_hz * t)
                    + 0.45 * arp * math.sin(2 * math.pi * root_hz * 1.5 * t)
                    + 0.25 * math.sin(2 * math.pi * root_hz * 2.0 * t)
                )
            else:
                pulse = 0.76 + 0.24 * math.sin(2 * math.pi * 0.36 * t)
                pad = swell * pulse * 0.15 * (
                    math.sin(2 * math.pi * root_hz * t)
                    + 0.52 * math.sin(2 * math.pi * root_hz * 1.498 * t)
                    + 0.28 * math.sin(2 * math.pi * root_hz * 1.189 * t)
                )

            imp = 0.0
            for ht, amp in hits:
                dt = t - ht
                if 0.0 <= dt < 0.8:
                    f = 140.0 * math.exp(-7.0 * dt) + 34.0
                    imp += amp * math.exp(-4.2 * dt) * math.sin(2 * math.pi * f * dt)
                    if dt < 0.14:
                        imp += amp * 0.4 * math.exp(-24.0 * dt) * lp1 * 4.5

            tex = 0.0
            if sfx_kind in ("storm", "ocean", "solar") and t >= t_peak * 0.8:
                env = min(1.0, (t - t_peak * 0.8) / 1.5)
                if t > t_cta + 0.5:
                    env *= max(0.0, 1.0 - (t - (t_cta + 0.5)) / 2.5)
                freq = 440.0 if sfx_kind == "storm" else 260.0
                wr = 2 * math.pi * freq / sr
                bpv += wr * (w * 0.4 - bp - 0.14 * bpv)
                bp += wr * bpv
                tex = env * (bp * 0.28 + lp1 * 3.0 + lp2 * 4.2)

            ml = max(-0.95, min(0.95, pad + imp + tex))
            mr = max(-0.95, min(0.95, pad + imp * 0.96 + tex * 0.88 + w * 0.004))
            buf.extend(struct.pack("<hh", int(ml * 32767), int(mr * 32767)))
        wf.writeframes(bytes(buf))


def clean_indonesian_tokens(words: list[dict]) -> list[dict]:
    rep = {
        "gak": "nggak", "ga": "nggak", "gak?": "nggak?", "bumi": "Bumi",
        "matahari": "Matahari", "manapun.": "mana pun.", "Kelihatanya": "Kelihatannya",
        "kenol": "ke nol", "ketimur": "ke timur", "lakuin": "lakuin",
    }
    out = []
    for w in words:
        t = w["word"]
        if t.startswith("-") and out:
            out[-1]["word"] += t
            out[-1]["end"] = w["end"]
            continue
        out.append({"word": rep.get(t, t), "start": w["start"], "end": w["end"]})
    return out


def build_video_audio(vid_id: str) -> None:
    pub = Path("public")
    metas = asyncio.run(synth_all(vid_id, pub))
    lead = pub / f"{vid_id}_lead.wav"
    subprocess.run([
        FFMPEG, "-y", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo", "-t", "0.06", str(lead)
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    lines = [f"file '{lead.name}'"]
    cursor = 0.06
    segs_out = []
    for i, m in enumerate(metas):
        st = round(cursor, 3)
        en = round(cursor + m["dur"], 3)
        segs_out.append({"id": m["id"], "text": m["text"], "dur": m["dur"], "start": st, "end": en})
        lines.append(f"file '{m['wav']}'")
        cursor += m["dur"]
        gf = pub / f"{vid_id}_gap_{i}.wav"
        subprocess.run([
            FFMPEG, "-y", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo", "-t", str(m["gap"]), str(gf)
        ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        lines.append(f"file '{gf.name}'")
        cursor += m["gap"]

    total_dur = round(cursor, 3)
    ctxt = pub / f"{vid_id}_concat.txt"
    ctxt.write_text("\n".join(lines) + "\n", encoding="utf-8")
    vwav = pub / f"{vid_id}_voice.wav"
    subprocess.run([
        FFMPEG, "-y", "-f", "concat", "-safe", "0", "-i", str(ctxt), "-c", "copy", str(vwav)
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    swav = pub / f"{vid_id}_sfx.wav"
    synth_sfx(VIDEOS[vid_id]["sfx"], total_dur, segs_out, swav)

    final_mp3 = pub / f"{vid_id}.mp3"
    subprocess.run([
        FFMPEG, "-y", "-i", str(vwav), "-i", str(swav),
        "-filter_complex",
        "[1:a][0:a]sidechaincompress=threshold=0.03:ratio=4:attack=25:release=300[bg];[0:a]volume=1.08[v];[v][bg]amix=inputs=2:duration=first:dropout_transition=2,alimiter=limit=0.95[out]",
        "-map", "[out]", "-b:a", "192k", str(final_mp3)
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    model = WhisperModel("small", device="cpu", compute_type="int8")
    segs, _ = model.transcribe(str(vwav), language="id", word_timestamps=True)
    words = []
    for s in segs:
        if s.words:
            for w in s.words:
                txt = w.word.strip()
                if txt:
                    words.append({"word": txt, "start": round(w.start, 3), "end": round(w.end, 3)})
    words = clean_indonesian_tokens(words)

    Path(f"src/timing_{vid_id}.json").write_text(
        json.dumps({"id": vid_id, "total_dur": total_dur, "segments": segs_out, "words": words}, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    print(json.dumps({"ok": True, "id": vid_id, "total_dur": total_dur, "words": len(words), "hook_end": segs_out[0]["end"]}, ensure_ascii=False))


if __name__ == "__main__":
    vid = sys.argv[1]
    build_video_audio(vid)
