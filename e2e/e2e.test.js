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
    await page.setViewport({ width: 1280, height: 720 }); // Адаптация
