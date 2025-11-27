import puppeteer from 'puppeteer';
import { fork } from 'child_process';

jest.setTimeout(30000);

describe('test e2e', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:9000';

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);

    // Улучшенный обработчик запуска сервера
    await new Promise((resolve, reject) => {
      server.on('error', (err) => {
        console.error('Сервер упал:', err);
        reject(err);
      });

      server.on('message', (message) => {
        if (message === 'ok') {
          console.log('Сервер готов');
          resolve();
        }
      });

      // Таймаут на запуск сервера (10 секунд)
      setTimeout(() => {
        reject(new Error('Сервер не ответил за 10 секунд'));
      }, 10000);
    });

    // Запуск Puppeteer с флагами для CI/контейнеров
    browser = await puppeteer.launch({
      headless: true, // Для отладки можно поставить false
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage', // Важно для Docker
      ],
    });

    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 }); // Адаптация под экран
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
      console.log('Браузер закрыт');
    }
    if (server) {
      server.kill();
      console.log('Сервер остановлен');
    }
  });

  test('test btnClick', async () => {
    // Переход на страницу с явным таймаутом
    await page.goto(baseUrl, {
      waitUntil: 'networkidle0', // Ждём полной загрузки
      timeout: 10000,
    });

    // Проверка наличия body
    await page.waitForSelector('body', { timeout: 5000 });

    // Поиск элементов с проверкой
    const popovers = await page.$('.popovers');
    if (!popovers) {
      throw new Error('Элемент .popovers не найден');
    }

    const btn = await popovers.$('.btnPopovers');
    if (!btn) {
      throw new Error('Кнопка .btnPopovers не найдена');
    }

    // Клик и ожидание результата
    await btn.click();
    await page.waitForSelector('.messagePopovers', { timeout: 5000 });
  });
});
