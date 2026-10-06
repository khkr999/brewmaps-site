// node shot.js -> img/map.png (896×1447), then: python3 composite.py
const { chromium } = require('playwright'), path = require('path');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 896, height: 1447 } });
  await p.goto('file://' + path.join(__dirname, 'map.html')); await p.evaluate(() => window.ready); await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(__dirname, 'img', 'map.png') });
  await b.close();
})();
