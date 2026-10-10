#!/bin/sh
# Rebuild the 9.6s sky Reel. Needs a full ffmpeg: pip install imageio-ffmpeg
FF=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
"$FF" -y \
 -loop 1 -framerate 30 -t 9.6 -i export/sky-plate.png \
 -loop 1 -framerate 30 -t 9.6 -i export/tease.png \
 -loop 1 -framerate 30 -t 9.6 -i export/cloud.png \
 -loop 1 -framerate 30 -t 9.6 -i export/endcard2.png \
 -filter_complex "\
 [0:v]crop=1080:1920:0:'max(0\, 980 - 980*min(1\, t/4.3))',format=yuv420p,setsar=1[bg];\
 [1:v]format=rgba,fade=t=out:st=4.2:d=0.6:alpha=1[te];\
 [bg][te]overlay=0:0:format=auto[b1];\
 [b1][2:v]overlay=x='if(lt(t,5.6),0,7*sin(4*(t-5.6)))':y='if(lt(t,4.2), 2050, if(lt(t,5.5), 2050-(2050-430)*((t-4.2)/1.3), 430+9*sin(5*(t-5.5))))':format=auto[b2];\
 [3:v]format=rgba,fade=t=in:st=8.3:d=0.7:alpha=1[ec];\
 [b2][ec]overlay=0:0:format=auto,fps=30,format=yuv420p[v]" \
 -map "[v]" -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -movflags +faststart \
 export/cloud-al-quoz.mp4
