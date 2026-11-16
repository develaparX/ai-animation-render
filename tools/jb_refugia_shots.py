import json
from pathlib import Path

# Root repo = dua level di atas file ini (tools/ -> root). Ganti hanya bila struktur beda.
STUDIO = Path(__file__).resolve().parents[1]
PROJ = STUDIO / "examples" / "jb-refugia-pematang"

sents = json.load(open(PROJ / "timeline" / "sentences.json", encoding="utf-8"))

# 9 beats: group sentences into shots, each map to a scene function
GROUPS = [
    ("s001", [0, 1], "jb_b1_hook_bunga_pematang"),
    ("s002", [2, 3], "jb_b2_darto_tertawa"),
    ("s003", [4, 5], "jb_b3_petani_senyum_daun"),
    ("s004", [6, 7], "jb_b4_wereng_serang"),
    ("s005", [8, 9], "jb_b5_sawah_tetap_hijau"),
    ("s006", [10, 11, 12], "jb_b6_refugia_penjelasan"),
    ("s007", [13, 14], "jb_b7_serangga_datang"),
    ("s008", [15, 16, 17], "jb_b8_aturan_penyuluh"),
    ("s009", [18, 19], "jb_b9_pagar_hidup_payoff"),
]

SFX = [
    [{"at": 0.15, "name": "whoosh", "gain": -9}, {"at": 1.4, "name": "pop", "gain": -10}],
    [{"at": 0.2, "name": "tick", "gain": -10}, {"at": 1.9, "name": "hit", "gain": -9}],
    [{"at": 0.15, "name": "pop", "gain": -9}, {"at": 2.0, "name": "shimmer", "gain": -10}],
    [{"at": 0.2, "name": "buzz", "gain": -8}, {"at": 1.8, "name": "hit", "gain": -8}],
    [{"at": 0.15, "name": "shimmer", "gain": -9}, {"at": 1.6, "name": "ding", "gain": -10}],
    [{"at": 0.15, "name": "whoosh", "gain": -9}, {"at": 2.2, "name": "pop", "gain": -9}],
    [{"at": 0.2, "name": "shimmer", "gain": -9}, {"at": 2.4, "name": "pop", "gain": -10}],
    [{"at": 0.15, "name": "tick", "gain": -10}, {"at": 2.0, "name": "ding", "gain": -9}],
    [{"at": 0.2, "name": "hit", "gain": -8}, {"at": 2.6, "name": "shimmer", "gain": -9}],
]

shots = []
for i, (sid, idxs, scene) in enumerate(GROUPS):
    start = sents[idxs[0]]["start"] - (0.12 if i > 0 else 0)
    end = sents[idxs[-1]]["end"] + 0.22
    if i < len(GROUPS) - 1:
        end = min(end, sents[GROUPS[i + 1][1][0]]["start"] - 0.14)
    line = " ".join(sents[k]["text"] for k in idxs)
    shots.append({
        "id": sid,
        "start": round(max(0.0, start), 3),
        "end": round(end, 3),
        "line": line,
        "scene": scene,
        "set": "gh3d",
        "bars": None,
        "in": {"type": "cut", "dur": 0.22},
        "sfx": SFX[i],
        "notes": f"Beat {i+1}/9 gh3d hybrid",
    })

shots[0]["start"] = 0.0
duration = round(shots[-1]["end"], 3)

story = {
    "title": "Kenapa Petani Ini Sengaja Menanam Bunga di Pematang Sawah?",
    "duration": duration,
    "shots": shots,
    "music": {"sections": [
        {"from": 0, "to": round(duration * 0.45, 2), "mood": "tension", "gain": 0.36},
        {"from": round(duration * 0.45, 2), "to": duration, "mood": "hopeful", "gain": 0.55},
    ]},
}

(PROJ / "story").mkdir(parents=True, exist_ok=True)
json.dump(story, open(PROJ / "story" / "shots.json", "w", encoding="utf-8"), indent=1, ensure_ascii=False)
print("total", duration, "shots", len(shots))
for s in shots:
    print(f"{s['id']} {s['start']}-{s['end']} ({s['end']-s['start']:.2f}s) {s['scene']}")
