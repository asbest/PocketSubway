
const playwright = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Read the HTML file
  const htmlPath = path.join(__dirname, 'app/src/main/assets/PocketSubway.html');
  let htmlContent = fs.readFileSync(htmlPath, 'utf8');

  // Set a small number of segments for faster loading and force a countryside segment early
  htmlContent = htmlContent.replace('let NUM_SEGMENTS = 50;', 'let NUM_SEGMENTS = 5;');

  await page.setContent(htmlContent);

  // Wait for the game to initialize
  await page.evaluate(async () => {
    return new Promise(resolve => {
      const checkInit = setInterval(() => {
        if (window.envSegments && window.envSegments.length > 0) {
          clearInterval(checkInit);
          resolve();
        }
      }, 100);
    });
  });

  // Force a countryside segment and jump to it
  await page.evaluate(() => {
    // Ensure we have a countryside segment
    window.envSegments[1] = { start: 200, end: 1000, type: 'Countryside', theme: 'Mixed' };
    window.playerDistance = 500;
    if (typeof updateEnvironment === 'function') {
        // Run it multiple times to overcome lerping for the screenshot
        for(let i=0; i<100; i++) updateEnvironment();
    }
  });

  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 1000));

  await page.screenshot({ path: 'lighting_verification.png' });
  console.log('Screenshot saved to lighting_verification.png');

  await browser.close();
})();
