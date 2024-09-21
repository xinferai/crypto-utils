// tests/browser.test.js

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

describe('browser', () => {

  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ 
        headless: true,
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
        ] 
    });
    
    page = await browser.newPage();
    await page.goto('https://www.google.com');

    // Inject browser.js as a global variable in the browser context
    let browserUtilsScript = fs.readFileSync(path.join(__dirname, '../dist/browser.js'), 'utf8');
    browserUtilsScript = browserUtilsScript.replace('module.exports', 'window.browserUtils');

    await page.evaluate(browserUtilsScript);

  });

  afterAll(async () => {
    if (page) await page.close();
    if (browser) await browser.close();
  });

  test('should encrypt and decrypt a string correctly', async () => {
    const originalText = 'Hello, world!';

    // Run encryption and decryption in the browser context
    const encryptedText = await page.evaluate(async (text) => {
        return await window.browserUtils.encryptString(text);
    }, originalText);

    const decryptedText = await page.evaluate(async (encryptedText) => {
        return await window.browserUtils.decryptString(encryptedText);
    }, encryptedText);

    expect(decryptedText).toBe(originalText);
});

test('should set and get the passphrase', async () => {
    const newPassphrase = 'my new passphrase';

    // Set passphrase in the browser context
    await page.evaluate((passphrase) => {
        window.browserUtils.setPassphrase(passphrase);
    }, newPassphrase);

    // Get passphrase and assert it's correctly set
    const passphrase = await page.evaluate(() => {
        return window.browserUtils.getPassphrase();
    });

    expect(passphrase).toBe(newPassphrase);
});
});
