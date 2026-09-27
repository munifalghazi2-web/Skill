"""Render index.html to an MP4 (1080x1920, 30fps, 38s) frame by frame, with the
voice-over from voiceover.py (run that first) mixed in at each line's cue.

Usage: python3 render.py            -> out/yemen-top-canva-ad.mp4
       python3 render.py --stills   -> out/still-<t>.png previews
"""
import pathlib, subprocess, sys
import imageio_ffmpeg
from playwright.sync_api import sync_playwright

HERE = pathlib.Path(__file__).resolve().parent
OUT = HERE / "out"
import os, glob
CHROME = next(iter(glob.glob("/opt/pw-browsers/chromium-*/chrome-linux*/chrome")), None)
FPS, DURATION, W, H = 30, 38, 1080, 1920
from voiceover import AUDIO, LINES


def open_page(p):
    browser = p.chromium.launch(executable_path=CHROME) if CHROME else p.chromium.launch()
    page = browser.new_page(viewport={"width": W, "height": H})
    page.goto((HERE / "index.html").as_uri())
    page.evaluate("document.fonts.ready")
    page.wait_for_timeout(300)
    print("chat overflow px:", page.evaluate("fitChat()"))
    return browser, page


def stills(times):
    OUT.mkdir(exist_ok=True)
    with sync_playwright() as p:
        browser, page = open_page(p)
        for t in times:
            page.evaluate(f"seek({t})")
            page.screenshot(path=str(OUT / f"still-{t}.png"))
        browser.close()


def audio_args():
    """ffmpeg inputs + filter placing each dialogue line at its start time over silence."""
    args, chains = ["-f", "lavfi", "-t", str(DURATION), "-i", "anullsrc=r=44100:cl=stereo"], []
    for i, (start, _, _) in enumerate(LINES):
        args += ["-i", str(AUDIO / f"line-{i}.wav")]
        ms = int(start * 1000)
        chains.append(f"[{i + 2}:a]aformat=channel_layouts=stereo,adelay={ms}|{ms}[l{i}]")
    mix = "".join(f"[l{i}]" for i in range(len(LINES)))
    chains.append(f"[1:a]{mix}amix=inputs={len(LINES) + 1}:duration=first:normalize=0,alimiter=limit=0.95[a]")
    return args + ["-filter_complex", ";".join(chains), "-map", "0:v", "-map", "[a]"]


def video():
    OUT.mkdir(exist_ok=True)
    dst = OUT / "yemen-top-canva-ad.mp4"
    ff = subprocess.Popen([
        imageio_ffmpeg.get_ffmpeg_exe(), "-y", "-loglevel", "error",
        "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "mjpeg", "-i", "-",
        *audio_args(),
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-preset", "medium",
        "-c:a", "aac", "-b:a", "160k", "-t", str(DURATION), "-movflags", "+faststart", str(dst),
    ], stdin=subprocess.PIPE)
    with sync_playwright() as p:
        browser, page = open_page(p)
        for i in range(FPS * DURATION):
            page.evaluate(f"seek({i / FPS})")
            ff.stdin.write(page.screenshot(type="jpeg", quality=92))
        browser.close()
    ff.stdin.close()
    ff.wait()
    print("wrote", dst)


if __name__ == "__main__":
    if "--stills" in sys.argv:
        stills([0.8, 2.0, 10.0, 18.0, 24.5, 29.5, 35.0])
    else:
        video()
