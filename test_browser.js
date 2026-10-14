const puppeteer = require('C:/WORKS/RINSHAN/mine/Img3D/node_modules/puppeteer-core');
const path = require('path');

async function runTest() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    } else {
      console.log('BROWSER CONSOLE:', msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
  });

  const url = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');
  console.log('Loading page:', url);
  await page.goto(url, { waitUntil: 'networkidle0' });

  // 1. Initial screenshot
  await page.screenshot({ path: 'assets/screen-hero.png' });
  console.log('Saved screen-hero.png');

  // 2. Scroll to About / Stats (scrollY: 900)
  await page.evaluate(() => window.scrollTo(0, 850));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'assets/screen-about.png' });
  console.log('Saved screen-about.png');

  // 3. Scroll to Categories (scrollY: 1800)
  await page.evaluate(() => window.scrollTo(0, 1800));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'assets/screen-categories.png' });
  console.log('Saved screen-categories.png');

  // 4. Scroll to Channels & Retailers (scrollY: 2900)
  await page.evaluate(() => window.scrollTo(0, 2900));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'assets/screen-retailers.png' });
  console.log('Saved screen-retailers.png');

  // 5. Scroll to Videos & Markets & Footer (scrollY: 4200)
  await page.evaluate(() => window.scrollTo(0, 4200));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'assets/screen-footer.png' });
  console.log('Saved screen-footer.png');

  // 6. Test clicking a category card to open modal
  await page.evaluate(() => {
    const card = document.querySelector('[data-cat-index="0"]');
    if (card) card.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'assets/screen-modal.png' });
  console.log('Saved screen-modal.png');

  console.log('Console Errors count:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error('Console errors detected:', consoleErrors);
  }

  await browser.close();
}

runTest().catch(console.error);
