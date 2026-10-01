#!/usr/bin/env python3
"""Places each voiceover take on its mark and muxes it under the V3 cut. Usage: python3 mux_vo.py paid|organic [ar|en]"""
import subprocess, sys, os, imageio_ffmpeg
end = sys.argv[1] if len(sys.argv) > 1 else 'paid'
lang = sys.argv[2] if len(sys.argv) > 2 else 'ar'
MARKS = {'01': 0.0, '02': 1.5, '03': 2.15, '04': 3.1, '05': 4.2, '06': 5.75, '07': 6.7, '08': 7.8, '09': 9.35, '10': 10.3, '11': 11.4, '12': 12.55, '13': 13.5, '14': 14.2, '15': 14.9, '16': 15.95, '17': 17.3, '18': 18.95, '19': 20.3}
MARKS.update({'20': 22.00, '21': 22.75, '22': 23.80} if end == 'paid' else {'20o': 22.00, '21o': 23.20})
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
