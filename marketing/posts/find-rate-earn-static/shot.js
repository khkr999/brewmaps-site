// node shot.js story-1 [story-2 ...] -> export/<name>.png
const { chromium } = require('playwright'), path = require('path'), fs = require('fs');
(async () => {
  fs.mkdirSync(path.join(__dirname, 'export'), { recursive: true });
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const n of process.argv.slice(2)) {
    await p.goto('file://' + path.join(__dirname, n + '.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(__dirname, 'export', n + '.png') });
  }
  await b.close();
})();
