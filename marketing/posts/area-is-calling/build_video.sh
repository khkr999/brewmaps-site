#!/bin/sh
# Renders the 10s vertical Reel. Needs a full ffmpeg (the Playwright one is too minimal).
#   pip install imageio-ffmpeg
FF=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
"$FF" -y \
 -loop 1 -framerate 30 -t 10 -i ../../assets/screenshots/browse-top.png \
 -loop 1 -framerate 30 -t 10 -i export/banner-jumeirah.png \
 -loop 1 -framerate 30 -t 10 -i export/endcard.png \
 -filter_complex "\
 [0:v]scale=1250:-1,crop=1080:1920:85:'min(790,790*t/10)',format=yuv420p,setsar=1[bg];\
 [bg][1:v]overlay=0:0:format=auto[b1];\
 [2:v]format=rgba,fade=t=in:st=8.5:d=0.9:alpha=1[ec];\
 [b1][ec]overlay=0:0:format=auto,fps=30,format=yuv420p[v]" \
 -map "[v]" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart \
 export/jumeirah-is-calling.mp4
