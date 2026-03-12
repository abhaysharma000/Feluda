const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', error => console.log('ERR:', error.message));
  page.on('requestfailed', request => console.log('REQ_FAIL:', request.url(), request.failure().errorText));
  
  await page.goto('https://feluda-u6ue.vercel.app/dashboard/', {waitUntil: 'networkidle0'});
  await browser.close();
})();
