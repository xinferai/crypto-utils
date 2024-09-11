
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { encryptString, decryptString, setPassphrase } = require('../'); // Node.js decryption utility

describe('Verify crossing between nodejs and browser en/de-cryption', () => {

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
    let browserUtilsScript = fs.readFileSync(path.join(__dirname, '../browser.js'), 'utf8');
    browserUtilsScript = browserUtilsScript.replace('module.exports', 'window.browserUtils');

    await page.evaluate(browserUtilsScript);

    // Set passphrase in both Node.js and the browser environment
    const passphrase = 'test-passphrase';
    setPassphrase(passphrase);
    await page.evaluate((passphrase) => {
      window.browserUtils.setPassphrase(passphrase);
    }, passphrase);
  });

  afterAll(async () => {
    if (page) await page.close();
    if (browser) await browser.close();
  });

  it('should encrypt a string in the browser and decrypt in Node.js', async () => {
    const testString = 'Hello from the browser!';

    // Encrypt in browser using Puppeteer
    const encrypted = await page.evaluate(async (testString) => {
      return await window.browserUtils.encryptString(testString);
    }, testString);

    // Decrypt in Node.js
    const decrypted = await decryptString(encrypted);

    // Check if the decrypted value matches the original string
    expect(decrypted).toBe(testString);
  });

  it('should encrypt a string in Node.js and decrypt in the browser', async () => {
    const testString = 'Hello from Node.js!';

    // Encrypt in Node.js
    const encrypted = await encryptString(testString);

    // Decrypt in browser using Puppeteer
    const decrypted = await page.evaluate(async (encrypted) => {
      return await window.browserUtils.decryptString(encrypted);
    }, encrypted);

    // Check if the decrypted value matches the original string
    expect(decrypted).toBe(testString);
  });
});
