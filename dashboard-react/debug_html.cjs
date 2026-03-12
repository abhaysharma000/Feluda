const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', error => console.log('ERR:', error.message));
  
  try {
    await page.goto('https://feluda-u6ue.vercel.app/dashboard/', {waitUntil: 'domcontentloaded'});
    const content = await page.content();
    console.log('HTML_LENGTH:', content.length);
    const rootHtml = await page.evaluate(() => document.getElementById('root').innerHTML);
    console.log('ROOT_HTML:', rootHtml);
  } catch (e) {
    console.log('NAV_ERR:', e.message);
  }
  
  await browser.close();
})();
