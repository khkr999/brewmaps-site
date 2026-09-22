#!/usr/bin/env python3
"""Cuts the Arabic price ad. Edit SECONDS to re-time against a real voiceover take."""
import subprocess, sys, imageio_ffmpeg

#            hook  subject  AlQuoz  JBR   same   median  end
SECONDS   = [1.4,  1.9,     2.5,    3.0,  2.1,   3.0,    3.1]
CARDS     = ['ar-0','ar-1','ar-2','ar-3','ar-4','ar-5','ar-end']
MOTION    = ['slam','drift','slam','slam','drift','drift','drift']
FPS       = 30
AUDIO     = sys.argv[1] if len(sys.argv) > 1 else None      # optional voiceover wav/mp3
OUT       = 'export/ad-c-price-ar.mp4'

frames = [round(s*FPS) for s in SECONDS]
parts, ins = [], []
for i,(c,n,m) in enumerate(zip(CARDS, frames, MOTION)):
    ins += ['-i', f'{c}.png']
    if m == 'slam':                      # settle from oversize over the first 45% of the card
        k = 0.12/(0.45*n); z = f"max(1.12-{k:.5f}*on,1.0)"
    else:                                # drift in across the whole card
        k = 0.055/n;       z = f"min(1.0+{k:.5f}*on,1.055)"
    parts.append(f"[{i}:v]scale=1728:3072:flags=lanczos,zoompan=z='{z}':d={n}:"
                 f"x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps={FPS},setsar=1[v{i}]")
chain = ';'.join(parts) + ';' + ''.join(f'[v{i}]' for i in range(len(CARDS)))
chain += f"concat=n={len(CARDS)}:v=1:a=0,format=yuv420p[v]"

cmd = [imageio_ffmpeg.get_ffmpeg_exe(), '-hide_banner', '-loglevel', 'error', '-y'] + ins
if AUDIO: cmd += ['-i', AUDIO]
cmd += ['-filter_complex', chain, '-map', '[v]']
if AUDIO: cmd += ['-map', f'{len(CARDS)}:a', '-c:a', 'aac', '-b:a', '192k', '-shortest']
cmd += ['-r', str(FPS), '-c:v', 'libx264', '-preset', 'slow', '-crf', '18',
        '-pix_fmt', 'yuv420p', '-movflags', '+faststart', OUT]
subprocess.run(cmd, check=True)
t=0
print(f'{OUT} — {sum(SECONDS):.1f}s' + (' with audio' if AUDIO else ' silent'))
for c,s in zip(CARDS, SECONDS):
    print(f'  {t:5.1f} – {t+s:4.1f}s  {c}'); t += s
