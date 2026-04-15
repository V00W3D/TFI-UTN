import { chromium } from 'playwright';

const url = process.argv[2] || 'http://localhost:5174/iam/login';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(url);
await page.screenshot({ path: 'screenshot.png', fullPage: true });
await browser.close();
console.log('Done: screenshot.png');
