"""Render index.html to an MP4 (1080x1920, 30fps, 30s) frame by frame.

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
FPS, DURATION, W, H = 30, 30, 1080, 1920


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


def video():
    OUT.mkdir(exist_ok=True)
    dst = OUT / "yemen-top-canva-ad.mp4"
    ff = subprocess.Popen([
        imageio_ffmpeg.get_ffmpeg_exe(), "-y", "-loglevel", "error",
        "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "mjpeg", "-i", "-",
        "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-preset", "medium",
        "-c:a", "aac", "-shortest", "-movflags", "+faststart", str(dst),
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
        stills([0.8, 2.0, 7.0, 14.0, 17.0, 22.5, 28.0])
    else:
        video()
