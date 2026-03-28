const puppeteer = require('puppeteer');
const http = require('http');
const handler = require('serve-handler');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const PDF_DIR = path.join(ROOT, 'pdf');

async function startServer(port = 8080) {
  const server = http.createServer((req, res) =>
    handler(req, res, { public: ROOT })
  );
  await new Promise((r) => server.listen(port, r));
  console.log(`Server started on http://localhost:${port}`);
  return server;
}

async function generatePDF(browser, url, outputPath) {
  const page = await browser.newPage();

  console.log(`Loading: ${url}`);
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

  // Paged.js 렌더링 완료 대기
  try {
    await page.waitForSelector('.pagedjs_page', { timeout: 30000 });
    console.log('Paged.js rendering complete');
  } catch {
    console.warn('Paged.js selector not found, proceeding anyway');
  }

  // 폰트 로딩 + 이미지 렌더링 안정화 대기
  await new Promise((r) => setTimeout(r, 2000));

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await page.close();
  console.log(`Generated: ${outputPath}`);
}

async function main() {
  if (!fs.existsSync(PDF_DIR)) {
    fs.mkdirSync(PDF_DIR, { recursive: true });
  }

  const server = await startServer(8080);
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
  });

  try {
    await generatePDF(
      browser,
      'http://localhost:8080/resume.html',
      path.join(PDF_DIR, 'resume.pdf')
    );

    await generatePDF(
      browser,
      'http://localhost:8080/portfolio.html',
      path.join(PDF_DIR, 'portfolio.pdf')
    );
  } finally {
    await browser.close();
    server.close();
  }

  console.log('All PDFs generated successfully!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
