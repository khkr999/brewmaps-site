// node shot.js -> export/panorama.png + export/slide-1..3.png (1080×1350)
const { chromium } = require('playwright'), path = require('path'), fs = require('fs');
(async () => {
  const out = path.join(__dirname, 'export'); fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 3240, height: 1350 } });
  await p.goto('file://' + path.join(__dirname, 'carousel.html')); await p.evaluate(() => window.ready); await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(out, 'panorama.png') });
  for (let i = 0; i < 3; i++) await p.screenshot({ path: path.join(out, `slide-${i + 1}.png`), clip: { x: i * 1080, y: 0, width: 1080, height: 1350 } });
  await b.close();
})();
