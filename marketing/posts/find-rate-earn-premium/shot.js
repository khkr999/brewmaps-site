// node shot.js -> export/story-1.png … story-3.png
const { chromium } = require('playwright'), path = require('path'), fs = require('fs');
(async () => {
  fs.mkdirSync(path.join(__dirname, 'export'), { recursive: true });
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const n of [1, 2, 3]) {
    await p.goto('file://' + path.join(__dirname, 'story.html') + '?n=' + n); await p.evaluate(() => window.ready); await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(__dirname, 'export', `story-${n}.png`) });
  }
  await b.close();
})();
