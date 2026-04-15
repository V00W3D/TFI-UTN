import { chromium } from 'playwright';

export async function screenshot(url: string) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(url);

  await page.screenshot({ path: 'screenshot.png', fullPage: true });

  await browser.close();

  return 'screenshot.png';
}
