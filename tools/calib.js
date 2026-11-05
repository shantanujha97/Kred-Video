const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('http://127.0.0.1:8131/tools/calib.html');
  const T = JSON.parse(process.argv[2]);
  for (const t of T) { const r = await p.evaluate(a => window.calib(...a), [t.src, t.box, t.text, t.color]); console.log(t.name, JSON.stringify(r)); }
  await b.close();
})();
