// node render.js <out.png>
const { chromium } = require('playwright'), fs = require('fs'), path = require('path');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.resolve(__dirname, 'story.html')); await p.evaluate(() => window.ready);
  fs.writeFileSync(process.argv[2], Buffer.from((await p.evaluate(() => window.png())).split(',')[1], 'base64')); await b.close();
})();
