#!/usr/bin/env python3
"""Run CPU/RAM-heavy render or audio commands under strict Windows resource limits.

- Hard CPU cap (default 45% of total machine CPU) via Win32 Job Object
- CPU affinity restricted to half the logical cores (default 2 of 4 cores: mask 0x0C)
  so OpenBot and 9router retain uncontested cores
- BELOW_NORMAL_PRIORITY_CLASS inherited by child Node, Chromium, and FFmpeg processes
- Capped Node heap (--max-old-space-size=1536) and thread pools
"""
from __future__ import annotations

import ctypes
import ctypes.wintypes as wt
import os
import shutil
import subprocess
import sys

FFMPEG_BIN = r"C:\Users\Admin\tools\ffmpeg-9.0.2-essentials_build\bin"

BELOW_NORMAL_PRIORITY_CLASS = 0x00004000
JOB_OBJECT_CPU_RATE_CONTROL_INFORMATION = 15
JOB_OBJECT_CPU_RATE_CONTROL_ENABLE = 0x1
JOB_OBJECT_CPU_RATE_CONTROL_HARD_CAP = 0x4


class JOBOBJECT_CPU_RATE_CONTROL_INFORMATION(ctypes.Structure):
    _fields_ = [
        ("ControlFlags", wt.DWORD),
        ("CpuRate", wt.DWORD),
    ]


def run_throttled(cmd: list[str], cpu_percent: int = 45, affinity_mask: int = 0x0C, max_node_mb: int = 1536) -> int:
    env = os.environ.copy()
    path = env.get("PATH", "")
    if FFMPEG_BIN.lower() not in path.lower():
        env["PATH"] = FFMPEG_BIN + os.pathsep + path
    env["NODE_OPTIONS"] = f"--max-old-space-size={max_node_mb}"
    env["UV_THREADPOOL_SIZE"] = "2"
    env["OMP_NUM_THREADS"] = "1"
    env["MKL_NUM_THREADS"] = "1"
    env["OPENBLAS_NUM_THREADS"] = "1"
    env["RAYON_NUM_THREADS"] = "1"

    kernel32 = ctypes.WinDLL("kernel32", use_last_error=True)
    kernel32.CreateJobObjectW.restype = wt.HANDLE
    kernel32.SetInformationJobObject.argtypes = [wt.HANDLE, ctypes.c_int, ctypes.c_void_p, wt.DWORD]
    kernel32.SetInformationJobObject.restype = wt.BOOL
    kernel32.AssignProcessToJobObject.argtypes = [wt.HANDLE, wt.HANDLE]
    kernel32.AssignProcessToJobObject.restype = wt.BOOL
    kernel32.SetProcessAffinityMask.argtypes = [wt.HANDLE, ctypes.c_size_t]
    kernel32.SetProcessAffinityMask.restype = wt.BOOL
    kernel32.CloseHandle.argtypes = [wt.HANDLE]

    h_job = kernel32.CreateJobObjectW(None, None)
    if h_job:
        rate_info = JOBOBJECT_CPU_RATE_CONTROL_INFORMATION(
            ControlFlags=JOB_OBJECT_CPU_RATE_CONTROL_ENABLE | JOB_OBJECT_CPU_RATE_CONTROL_HARD_CAP,
            CpuRate=max(1000, min(9000, int(cpu_percent * 100))),
        )
        ok_rate = kernel32.SetInformationJobObject(
            h_job,
            JOB_OBJECT_CPU_RATE_CONTROL_INFORMATION,
            ctypes.byref(rate_info),
            ctypes.sizeof(rate_info),
        )
        if not ok_rate:
            print(f"[throttled] warn: SetInformationJobObject failed err={ctypes.get_last_error()}", file=sys.stderr)

    resolved = list(cmd)
    if os.name == "nt":
        found = shutil.which(resolved[0] + ".cmd", path=env["PATH"]) or shutil.which(resolved[0], path=env["PATH"])
        if found:
            resolved[0] = found
    if resolved[0].lower().endswith((".cmd", ".bat")):
        resolved = ["cmd.exe", "/d", "/c", *resolved]

    proc = subprocess.Popen(
        resolved,
        env=env,
        creationflags=BELOW_NORMAL_PRIORITY_CLASS,
        shell=False,
    )
    h_proc = int(proc._handle)  # type: ignore[attr-defined]
    if h_job:
        if not kernel32.AssignProcessToJobObject(h_job, wt.HANDLE(h_proc)):
            print(f"[throttled] warn: AssignProcessToJobObject failed err={ctypes.get_last_error()}", file=sys.stderr)
    if affinity_mask > 0:
        if not kernel32.SetProcessAffinityMask(wt.HANDLE(h_proc), ctypes.c_size_t(affinity_mask)):
            print(f"[throttled] warn: SetProcessAffinityMask failed err={ctypes.get_last_error()}", file=sys.stderr)

    try:
        return proc.wait()
    finally:
        if h_job:
            kernel32.CloseHandle(h_job)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: render_throttled.py <cmd...>", file=sys.stderr)
        sys.exit(2)
    sys.exit(run_throttled(sys.argv[1:]))
