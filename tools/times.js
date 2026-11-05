const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('console', m => console.log('PAGE', m.type(), m.text())); p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://127.0.0.1:8131/' + (process.env.PAGE || 'index.html')); await p.evaluate(() => window.ready);
  console.log(JSON.stringify(await p.evaluate(() => ({ T: window.TIMES, D: window.DURATION, MB: window.MB })))); await b.close(); })();
