"""Generate the Arabic dialogue voice-over with edge-tts (natural speed).

Usage: SSL_CERT_FILE=/root/.ccr/ca-bundle.crt python3 voiceover.py -> audio/line-<n>.wav
Each line is silence-trimmed so speech begins exactly when its bubble pops;
render.py mixes them into the MP4 at LINES[i][0].
"""
import asyncio, os, pathlib, ssl, subprocess, wave
import edge_tts, edge_tts.communicate
import imageio_ffmpeg

# edge-tts pins certifi; honour SSL_CERT_FILE (e.g. behind a TLS-inspecting proxy).
if os.environ.get("SSL_CERT_FILE"):
    edge_tts.communicate._SSL_CTX = ssl.create_default_context(cafile=os.environ["SSL_CERT_FILE"])

HERE = pathlib.Path(__file__).resolve().parent
AUDIO = HERE / "audio"
FF = imageio_ffmpeg.get_ffmpeg_exe()
YT, CUSTOMER = "ar-YE-SalehNeural", "ar-SA-HamedNeural"
END_CARD = 32.2  # .end fade-in in index.html; the last line must finish before it

# (start seconds, voice, spoken text) — start = bubble pop time in index.html
LINES = [
    (3.0, CUSTOMER, "عندي منتجات كثيرة واحتاج الى اداة تصميم صور لكي اصمم لمنتجاتي"),
    (9.0, YT, "لا تقلق مع يمن توب رح تجد حل مشكلتك كامل، احنا موفرين لك عرض اداة كانفا افضل اداة تصميم للمنتجات"),
    (17.0, CUSTOMER, "حلو، بكم سعر الاشتراك وكم مدة الاشتراك؟"),
    (21.0, YT, "سعر الاشتراك بألف وأربعمية ريال ومدة الاشتراك سنتين"),
    (27.8, YT, "كل ما عليك هو التواصل معانا على الارقام الظاهرة على الشاشة"),
]


async def synth(text, voice, dst):
    mp3 = dst.with_suffix(".mp3")
    for attempt in range(4):  # the service occasionally stalls; retry
        try:
            await asyncio.wait_for(edge_tts.Communicate(text, voice).save(str(mp3)), 30)
            break
        except (asyncio.TimeoutError, OSError):
            if attempt == 3:
                raise
    trim = "silenceremove=start_periods=1:start_threshold=-45dB"
    subprocess.run([FF, "-y", "-loglevel", "error", "-i", str(mp3), "-af",
                    f"{trim},areverse,{trim},areverse", "-ar", "44100", "-ac", "1", str(dst)], check=True)
    mp3.unlink()
    with wave.open(str(dst)) as w:
        return w.getnframes() / w.getframerate()


async def main():
    AUDIO.mkdir(exist_ok=True)
    for i, (start, voice, text) in enumerate(LINES):
        dur = await synth(text, voice, AUDIO / f"line-{i}.wav")
        limit = LINES[i + 1][0] if i + 1 < len(LINES) else END_CARD
        print(f"line {i}: {start:.1f}-{start + dur:.2f}s (next at {limit}s)")
        if start + dur > limit:
            print(f"  WARNING: overlaps next cue by {start + dur - limit:.2f}s — shift the timings in index.html")


if __name__ == "__main__":
    asyncio.run(main())
