#!/usr/bin/env python3
"""Places each voiceover take on its mark and muxes it under the V3 cut. Usage: python3 mux_vo.py paid|organic [ar|en]"""
import subprocess, sys, os, imageio_ffmpeg
end = sys.argv[1] if len(sys.argv) > 1 else 'paid'
lang = sys.argv[2] if len(sys.argv) > 2 else 'ar'
MARKS = {'01': 0.00, '02': 1.35, '03': 1.95, '04': 2.80, '05': 3.80, '06': 5.15, '07': 6.00, '08': 7.00,
         '09': 8.35, '10': 9.20, '11': 10.20, '12': 11.15, '13': 12.00, '14': 12.60, '15': 13.20,
         '16': 14.15, '17': 15.30, '18': 16.85, '19': 18.05}
MARKS.update({'20': 19.60, '21': 20.35, '22': 21.40} if end == 'paid' else {'20o': 19.60, '21o': 20.80})
video = f'export/your-order-v3-{lang}-{end}.mp4'
takes = [(k, t) for k, t in MARKS.items() if os.path.exists(f'vo/{k}.mp3')]
missing = [k for k in MARKS if not os.path.exists(f'vo/{k}.mp3')]
if missing: print('missing takes:', ' '.join(missing))
ins, parts = ['-i', video], []
for n, (k, t) in enumerate(takes, start=1):
    ins += ['-i', f'vo/{k}.mp3']; parts.append(f'[{n}:a]adelay={int(t*1000)}|{int(t*1000)}[v{n}]')
mix = ''.join(f'[v{n}]' for n in range(1, len(takes) + 1)) + f'amix=inputs={len(takes)}:normalize=0[vo]'
graph = ';'.join(parts + [mix])
music = os.path.exists('music.mp3')
if music:
    ins += ['-stream_loop', '-1', '-i', 'music.mp3']; m = len(takes) + 1
    graph += f';[{m}:a]volume=0.35[bed];[bed][vo]sidechaincompress=threshold=0.05:ratio=6:attack=20:release=300[ducked];[ducked][vo]amix=inputs=2:normalize=0[a]'
else:
    graph += ';[vo]anull[a]'
out = f'export/your-order-v3-{lang}-{end}-vo.mp4'
subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(), '-y', '-loglevel', 'error', *ins, '-filter_complex', graph,
                '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', out], check=True)
print('wrote', out)
