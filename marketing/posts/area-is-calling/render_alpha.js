const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  for (const s of process.argv.slice(2)) {
    await page.goto('file://' + path.resolve(s));
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(250);
    await page.screenshot({ path: s.replace('.html', '.png'), omitBackground: true });
    console.log('rendered', s);
  }
  await browser.close();
})();
