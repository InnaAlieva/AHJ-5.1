import puppeteer from 'puppeteer';
import { fork } from 'child_process';

jest.setTimeout(30000); // default puppeteer timeout

describe('test e2e', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:9000';

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on('error', reject);
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });

    browser = await puppeteer.launch({
      // headless: false, // headless, slowMo, devtools закоментировать происходит в фоновом режиме
      // slowMo: 100,
      // devtools: true, // показать devTools
    });
    page = await browser.newPage(); // открыл браузер и новую вкладку
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  test('test btnClick', async () => {
    await page.goto(baseUrl); // проверили открывается ли путь
    await page.waitForSelector('body'); // проверили есть ли тег "body"

    const popovers = await page.$('.popovers');
    const btn = await popovers.$('.btnPopovers');
    await btn.click(); //  клик на кнопке
    await page.waitForSelector('.messagePopovers'); // проверили есть ли тег с классом "messagePopovers"
  });
});
