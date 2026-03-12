const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('LOG:', msg.text()));
    page.on('pageerror', error => console.log('ERR:', error.message));

    try {
        await page.goto('https://feluda-u6ue.vercel.app/dashboard/', { waitUntil: 'networkidle0' });
        const rootHtml = await page.evaluate(() => document.getElementById('root').innerHTML);
        console.log('ROOT_HTML_START:', rootHtml.substring(0, 500));
        
        const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
        console.log('BODY_BG:', bodyBg);

        const linkRel = await page.evaluate(() => {
            const link = document.querySelector('link[rel="stylesheet"]');
            return link ? link.href : 'NONE';
        });
        console.log('CSS_LINK:', linkRel);

    } catch (e) {
        console.log('NAV_ERR:', e.message);
    }

    await browser.close();
})();
