const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  const slides = process.argv.slice(2);
  for (const s of slides) {
    await page.goto('file://' + path.resolve(s));
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    await page.screenshot({ path: s.replace('.html', '.png'), clip: { x: 0, y: 0, width: 1080, height: 1350 } });
    console.log('rendered', s);
  }
  await browser.close();
})();
