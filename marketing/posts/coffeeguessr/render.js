// node render.js <outdir> [t1,t2,...]   → PNG frames at FPS (or just the listed times)
const { chromium } = require('playwright'), fs = require('fs'), path = require('path');
(async () => {
  const [out = 'frames', times] = process.argv.slice(2);
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.resolve(__dirname, 'player.html'));
  await p.evaluate(() => window.ready);
  const [dur, fps] = await p.evaluate(() => [window.DURATION, window.FPS]);
  const list = times ? times.split(',').map(Number) : Array.from({ length: Math.round(dur * fps) }, (_, i) => i / fps);
  for (let i = 0; i < list.length; i++) {
    const url = await p.evaluate(t => window.frame(t), list[i]);
    fs.writeFileSync(path.join(out, times ? `t_${list[i].toFixed(2)}.png` : `f_${String(i).padStart(4, '0')}.png`), Buffer.from(url.split(',')[1], 'base64'));
  }
  await b.close();
})();
