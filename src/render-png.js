import { readFileSync, writeFileSync } from 'fs';
import { renderHtml } from './render-html.js';

export async function renderPng(data, outputPath = 'cheatsheet.png') {
  const puppeteer = await import('puppeteer');
  const html = renderHtml(data, { forPng: true });

  const browser = await puppeteer.default.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1080, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Let CSS settle
  await page.evaluate(() => new Promise(r => setTimeout(r, 100)));

  // Get actual content height
  const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
  await page.setViewport({ width: 1400, height: bodyHeight, deviceScaleFactor: 2 });

  await page.screenshot({ path: outputPath, fullPage: true, type: 'png' });
  await browser.close();

  const stats = readFileSync(outputPath);
  console.log(`PNG generated: ${outputPath} (${(stats.length / 1024).toFixed(0)}KB)`);
}

// CLI entrypoint
if (process.argv[1] && process.argv[1].endsWith('render-png.js')) {
  const data = JSON.parse(readFileSync('cheatsheet.json', 'utf8'));
  renderPng(data).catch(console.error);
}
