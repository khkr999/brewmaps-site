// node shot.js -> export/slide-1..5.png (1080×1350)
const { chromium } = require('playwright'), path = require('path'), fs = require('fs');
(async () => {
  const out = path.join(__dirname, 'export'); fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (let n = 1; n <= 5; n++) {
    await p.goto('file://' + path.join(__dirname, 'slides.html') + '?n=' + n); await p.evaluate(() => window.ready); await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(out, `slide-${n}.png`) });
  }
  await b.close();
})();
