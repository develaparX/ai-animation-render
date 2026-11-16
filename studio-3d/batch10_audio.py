#!/usr/bin/env python3
"""Batch 10 video recreate: audio + Whisper timings for v06-v15 (no CTA questions, warm close only)."""
from __future__ import annotations
import asyncio, json, math, os, random, struct, subprocess, wave
from pathlib import Path
import edge_tts
from faster_whisper import WhisperModel

FFMPEG = r"C:\Users\Admin\tools\ffmpeg-9.0.2-essentials_build\bin\ffmpeg.exe"
FFPROBE = r"C:\Users\Admin\tools\ffmpeg-9.0.2-essentials_build\bin\ffprobe.exe"
VOICE = "id-ID-ArdiNeural"

VIDEOS = {
    "v06_rokok_paru": [
        ("hook", "Baru sekali hisap, paru-parumu langsung berubah begini.", "+8%", 0.20),
        ("smoke", "Asap panas masuk lewat tenggorokan, lalu menyebar ke jutaan kantung udara kecil di paru-paru.", "+4%", 0.25),
        ("tar", "Lapisan lengket menempel di dinding saluran napas, perlahan menyempitkan jalan keluar masuknya udara.", "+4%", 0.25),
        ("cilia", "Rambut-rambut halus pembersih yang biasanya menyapu kotoran mulai lumpuh dan berhenti bergerak.", "+4%", 0.25),
        ("oxygen", "Pertukaran oksigen melambat, jantung dipaksa memompa lebih keras untuk hal yang dulu mudah.", "+4%", 0.25),
        ("heal", "Kabar baiknya, begitu kamu berhenti, tubuh langsung mulai membersihkan dirinya sedikit demi sedikit.", "+2%", 0.45),
    ],
    "v07_pil_tubuh": [
        ("hook", "Baru saja kamu telan pil itu, perjalanan panjangnya dimulai.", "+8%", 0.20),
        ("dissolve", "Di lambung, lapisan luar pil larut perlahan dan melepaskan zat aktif ke cairan pencernaan.", "+4%", 0.25),
        ("absorb", "Zat itu diserap dinding usus, lalu ikut aliran darah menuju ke seluruh tubuh.", "+4%", 0.25),
        ("target", "Begitu sampai di area yang dituju, ia menempel pada reseptor dan mulai bekerja menenangkan gejala.", "+4%", 0.25),
        ("liver", "Sisa zatnya diolah hati, lalu dibuang lewat ginjal sedikit demi sedikit.", "+4%", 0.25),
        ("note", "Makanya dosis dan waktu minum itu penting — tubuhmu bekerja persis mengikuti aturannya.", "+2%", 0.45),
    ],
    "v08_otak_bicara_negatif": [
        ("hook", "Otakmu merekam semua yang kamu katakan ke diri sendiri.", "+8%", 0.20),
        ("record", "Setiap kalimat pedas yang kamu ulang-ulang perlahan jadi pola jalur saraf yang makin kuat.", "+4%", 0.25),
        ("alarm", "Sistem waspada di otak ikut menyala, seolah ancaman itu nyata dan selalu dekat.", "+4%", 0.25),
        ("body", "Bahu menegang, napas memendek, fokus menyempit — tubuhmu ikut percaya pada kata-katamu.", "+4%", 0.25),
        ("flip", "Sebaliknya, kalimat yang tenang dan jelas memberi otak peta baru yang lebih aman.", "+4%", 0.25),
        ("habit", "Bukan soal pura-pura bahagia, tapi melatih bahasa batin yang jujur dan menenangkan.", "+2%", 0.45),
    ],
    "v09_orang_pendiam": [
        ("hook", "Orang pendiam itu bukan cuek, otaknya justru bekerja lebih dalam.", "+8%", 0.20),
        ("observe", "Di keramaian, mereka sibuk membaca ekspresi, nada suara, dan bahasa tubuh orang lain.", "+4%", 0.25),
        ("process", "Informasi itu diputar ulang di kepala, disaring satu per satu sebelum jadi kata-kata.", "+4%", 0.25),
        ("selective", "Makanya mereka jarang bicara, tapi sekali bicara biasanya tepat dan jujur.", "+4%", 0.25),
        ("energy", "Keramaian menguras baterai mereka, sementara waktu sendirian justru mengisi ulang.", "+4%", 0.25),
        ("respect", "Jadi kalau punya teman pendiam, hargai jedanya — di sanalah cara mereka peduli.", "+2%", 0.45),
    ],
    "v10_procrastinate2": [
        ("hook", "Nunda kerjaan bukan berarti malas, otakmu lagi nyusun strategi.", "+8%", 0.20),
        ("load", "Di depan dua layar penuh kode, bagian depan otakmu cepat banget penuhnya.", "+4%", 0.25),
        ("walk", "Begitu kamu bangkit bikin kopi atau jalan sebentar, jaringan lain dalam otak mulai menyambung.", "+4%", 0.25),
        ("spark", "Di jeda tenang itulah potongan masalah yang buntu tiba-tiba ketemu polanya.", "+6%", 0.28),
        ("solve", "Balik ke meja dengan kepala segar, masalah yang tadi berat jadi terasa ringan.", "+4%", 0.25),
        ("rhythm", "Kerja fokus, jeda sadar, lalu balik lagi — itu ritme yang bikin otak awet seharian.", "+2%", 0.45),
    ],
    "v11_buah_obat": [
        ("hook", "Buah sederhana ini bekerja seperti obat alami di dalam tubuhmu.", "+8%", 0.20),
        ("bite", "Begitu digigit, serat dan airnya langsung turun melapisi lambung dengan lembut.", "+4%", 0.25),
        ("vitamin", "Vitamin dan antioksidannya ikut aliran darah, membantu sel melawan radikal bebas.", "+4%", 0.25),
        ("gut", "Di usus, seratnya jadi makanan bakteri baik yang menjaga pencernaan tetap lancar.", "+4%", 0.25),
        ("sugar", "Gula alaminya naik perlahan, jadi energi stabil tanpa bikin ngantuk berat.", "+4%", 0.25),
        ("daily", "Satu porsi buah tiap hari, dan tubuhmu berterima kasih dengan caranya sendiri.", "+2%", 0.45),
    ],
    "v12_buah_sahabat": [
        ("hook", "Dua buah yang beda banget ini ternyata sahabatan.", "+8%", 0.20),
        ("meet", "Yang satu manis dan ceria, satunya lagi asam dan pendiam — tapi mereka selalu bareng.", "+4%", 0.25),
        ("share", "Kalau yang satu dapat sinar matahari lebih, ia bergeser supaya temannya ikut kebagian.", "+4%", 0.25),
        ("storm", "Saat badai datang, mereka saling menahan supaya nggak ada yang jatuh duluan.", "+5%", 0.28),
        ("grow", "Musim berganti, keduanya matang bareng, manisnya pun jadi seimbang.", "+4%", 0.25),
        ("warm", "Kadang teman terbaik itu yang paling beda dari kita, tapi selalu ada di samping kita.", "+2%", 0.45),
    ],
    "v13_ai_cartoon": [
        ("hook", "Kartun ini terlihat nyata sampai kamu lupa kalau ini buatan AI.", "+8%", 0.20),
        ("sketch", "Semuanya bermula dari sketsa kasar dan beberapa kata perintah sederhana.", "+4%", 0.25),
        ("rig", "Lalu AI membangun kerangka gerak, mengisi warna, cahaya, dan bayangan frame demi frame.", "+4%", 0.25),
        ("motion", "Setiap kedipan, lambaian, dan langkah dihitung supaya terasa hidup dan konsisten.", "+4%", 0.25),
        ("polish", "Terakhir ditambahkan musik, suara, dan ritme potongan yang bikin betah nonton.", "+4%", 0.25),
        ("craft", "Di balik tiga puluh detik yang mulus, ada ribuan keputusan kecil yang dirapikan.", "+2%", 0.45),
    ],
    "v14_ai_story_moral": [
        ("hook", "Satu tes kecil ini langsung nunjukin karakter asli seseorang.", "+8%", 0.20),
        ("test", "Seorang ibu meminta anaknya melakukan hal yang tampak kurang pantas ke istrinya.", "+4%", 0.25),
        ("pause", "Anak itu berhenti sejenak, menatap ibunya, lalu menatap istrinya yang diam.", "+5%", 0.28),
        ("choice", "Alih-alih patuh mentah-mentah, ia bertanya dulu kenapa hal itu diminta.", "+4%", 0.25),
        ("reveal", "Dari satu pertanyaan sederhana itu, terlihat siapa yang menghormati dan siapa yang memerintah.", "+4%", 0.25),
        ("lesson", "Kadang kedewasaan bukan soal nurut, tapi berani bertanya dengan hormat.", "+2%", 0.45),
    ],
    "v15_teknologi_ai": [
        ("hook", "Video yang kamu tonton tiap hari ini kemungkinan besar disentuh AI.", "+8%", 0.20),
        ("capture", "Mulanya tetap dari kamera biasa, gambar nyata orang dan tempat sungguhan.", "+4%", 0.25),
        ("detect", "AI membaca tiap frame: wajah, gerakan bibir, latar, sampai arah cahaya.", "+4%", 0.25),
        ("enhance", "Lalu ia merapikan warna, menstabilkan goyangan, dan memperjelas suara otomatis.", "+4%", 0.25),
        ("generate", "Bagian yang hilang bahkan bisa digambar ulang supaya alurnya mulus.", "+4%", 0.25),
        ("blend", "Hasilnya menyatu mulus, sampai kamu nggak sadar mana yang asli mana yang dibantu.", "+2%", 0.45),
    ],
}

async def synth_one(vid_id: str, pub: Path) -> dict:
    metas = []
    for idx, (key, text, rate, gap) in enumerate(VIDEOS[vid_id]):
        assert "what if" not in text.lower()
        assert "simulasi bagaimana jika" not in text.lower()
        mp3 = pub / f"{vid_id}_s{idx}_{key}.mp3"
        wav = pub / f"{vid_id}_s{idx}_{key}.wav"
        comm = edge_tts.Communicate(text, VOICE, rate=rate)
        await comm.save(str(mp3))
        subprocess.run(
            [FFMPEG, "-y", "-i", str(mp3),
             "-af", "silenceremove=start_periods=1:start_silence=0.04:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_silence=0.04:start_threshold=-45dB,areverse,highpass=f=85,acompressor=threshold=-17dB:ratio=2.6,loudnorm=I=-14:TP=-1.2:LRA=8",
             "-ar", "48000", "-ac", "2", str(wav)],
            check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        dur = float(subprocess.check_output(
            [FFPROBE, "-v", "error", "-show_entries", "format=duration",
             "-of", "default=noprint_wrappers=1:nokey=1", str(wav)], text=True).strip())
        metas.append({"id": key, "text": text, "dur": dur, "gap": gap, "wav": wav.name})
    return metas


def mix_one(vid_id: str, metas: list[dict], pub: Path) -> dict:
    lead = pub / f"{vid_id}_lead.wav"
    subprocess.run([FFMPEG, "-y", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo",
                    "-t", "0.06", str(lead)], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    lines = [f"file '{lead.name}'"]
    cursor = 0.06
    segs = []
    for i, m in enumerate(metas):
        st = round(cursor, 3)
        en = round(cursor + m["dur"], 3)
        segs.append({"id": m["id"], "text": m["text"], "dur": m["dur"], "start": st, "end": en})
        lines.append(f"file '{m['wav']}'")
        cursor += m["dur"]
        gf = pub / f"{vid_id}_gap_{i}.wav"
        subprocess.run([FFMPEG, "-y", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo",
                        "-t", str(m["gap"]), str(gf)], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        lines.append(f"file '{gf.name}'")
        cursor += m["gap"]
    total_dur = round(cursor, 3)
    ctxt = pub / f"{vid_id}_concat.txt"
    ctxt.write_text("\n".join(lines) + "\n", encoding="utf-8")
    vwav = pub / f"{vid_id}_voice.wav"
    subprocess.run([FFMPEG, "-y", "-f", "concat", "-safe", "0", "-i", str(ctxt), "-c", "copy", str(vwav)],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # gentle cinematic bed: low root + pulsing pad
    sr = 48000
    n = int(total_dur * sr)
    rng = random.Random(hash(vid_id) & 0xFFFF)
    lp1 = 0.0
    with wave.open(str(pub / f"{vid_id}_sfx.wav"), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        buf = bytearray()
        for i in range(n):
            t = i / sr
            w = rng.uniform(-1.0, 1.0)
            lp1 = 0.987 * lp1 + 0.013 * w
            pulse = 0.70 + 0.30 * math.sin(2 * math.pi * 0.35 * t)
            swell = 0.42 if t < segs[-1]["start"] else max(0.22, 0.42 * math.exp(-(t - segs[-1]["start"]) * 0.9))
            pad = swell * pulse * 0.12 * (
                math.sin(2 * math.pi * 65.41 * t)
                + 0.45 * math.sin(2 * math.pi * 98.0 * t)
                + 0.22 * math.sin(2 * math.pi * 77.97 * t))
            buf.extend(struct.pack("<hh", int(max(-0.94, min(0.94, pad + lp1 * 0.05))) * 32767,
                                   int(max(-0.94, min(0.94, pad * 0.9 + w * 0.004))) * 32767))
        wf.writeframes(bytes(buf))

    final_mp3 = pub / f"{vid_id}.mp3"
    swav = pub / f"{vid_id}_sfx.wav"
    subprocess.run([
        FFMPEG, "-y", "-i", str(vwav), "-i", str(swav),
        "-filter_complex",
        "[1:a][0:a]sidechaincompress=threshold=0.03:ratio=4:attack=25:release=300[bg];[0:a]volume=1.1[v];[v][bg]amix=inputs=2:duration=first:dropout_transition=2,alimiter=limit=0.95[out]",
        "-map", "[out]", "-b:a", "192k", str(final_mp3)],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    model = WhisperModel("small", device="cpu", compute_type="int8")
    segs_w, _ = model.transcribe(str(vwav), language="id", word_timestamps=True)
    words = []
    for s in segs_w:
        if s.words:
            for w in s.words:
                tx = w.word.strip()
                if tx:
                    words.append({"word": tx, "start": round(w.start, 3), "end": round(w.end, 3)})
    Path(f"src/timing_{vid_id}.json").write_text(
        json.dumps({"total_dur": total_dur, "segments": segs, "words": words}, indent=2, ensure_ascii=False),
        encoding="utf-8")
    return {"ok": True, "id": vid_id, "total_dur": total_dur, "words": len(words)}


async def main() -> None:
    import sys
    pub = Path("public")
    vids = sys.argv[1:] or list(VIDEOS.keys())
    for vid in vids:
        metas = await synth_one(vid, pub)
        res = mix_one(vid, metas, pub)
        print(json.dumps(res, ensure_ascii=False), flush=True)


if __name__ == "__main__":
    asyncio.run(main())
