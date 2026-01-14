const { chromium } = require('playwright');
const path = require('path');

const AUTH_FILE = path.join(__dirname, '..', 'auth.json');

async function login() {
    console.log('Opening browser for Instagram login...');
    console.log('Please login to your Instagram account manually.');
    console.log('The session will be saved for future scraping.\n');

    const browser = await chromium.launch({
        headless: false, // Show the browser
        args: [
            '--disable-blink-features=AutomationControlled',
            '--no-sandbox'
        ]
    });

    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        viewport: { width: 1280, height: 800 }
    });

    const page = await context.newPage();
    await page.goto('https://www.instagram.com/accounts/login/');

    console.log('Waiting for you to login...');
    console.log('After logging in successfully, press Enter in this terminal to save the session.\n');

    // Wait for user to press Enter
    await new Promise(resolve => {
        process.stdin.once('data', () => resolve());
    });

    // Save auth state
    await context.storageState({ path: AUTH_FILE });
    console.log(`\nSession saved to ${AUTH_FILE}`);
    console.log('You can now close this window and run the scraper.');

    await browser.close();
}

login().catch(console.error);
