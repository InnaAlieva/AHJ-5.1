import { test, describe, expect, beforeAll, afterAll } from '@jest/globals';
import puppetteer from 'puppeteer';
import { fork } from 'child_process';

jest.setTimeout(30000);

describe('Testing the popover', () => {
  const baseUrl = 'http://localhost:8087';
  let browser = null;
  let page = null;
  let server = null;

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      if (server.connected) {
        process.send('ok');
        resolve();
      } else {
        reject();
      }
    });

    browser = await puppetteer.launch(
      // {
      //   headless: false,
      //   slowMo: 100,
      //   devtools: true,
      //   defaultViewport: { width: 1000, height: 1000 },
      // }
    );

    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  test('The appearance and disappearance of the popover', async () => {
    await page.goto(baseUrl);
    const popoverToggle = await page.$('.popover-toggle');

    const datasetOfPopoverToggle = await page.evaluate(() => {
      const dataset = document.querySelector('.popover-toggle').dataset;
      return Object.fromEntries(Object.entries(dataset));
    });
    expect(datasetOfPopoverToggle.title).toBeTruthy();
    expect(datasetOfPopoverToggle.info).toBeTruthy();

    await popoverToggle.click();
    expect(await page.$('.popover')).toBeTruthy();

    const datasetOfPopover = await page.evaluate(() => {
      const dataset = document.querySelector('.popover').dataset;
      return Object.fromEntries(Object.entries(dataset));
    });
    expect(datasetOfPopover.id).toBeTruthy();

    await popoverToggle.click();
    expect(await page.$('.popover')).toBeNull();
  });
});
