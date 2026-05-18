
const playwright = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const htmlPath = path.join(__dirname, 'app/src/main/assets/PocketSubway.html');
  let htmlContent = fs.readFileSync(htmlPath, 'utf8');

  // Fast generation
  htmlContent = htmlContent.replace('let NUM_SEGMENTS = 50;', 'let NUM_SEGMENTS = 5;');

  await page.setContent(htmlContent);

  // Wait for the game to initialize and first station to exist
  await page.evaluate(async () => {
    return new Promise(resolve => {
      const checkInit = setInterval(() => {
        if (window.trackGroup && window.trackGroup.children.length > 0) {
          clearInterval(checkInit);
          resolve();
        }
      }, 100);
    });
  });

  // Jump to the first station
  await page.evaluate(() => {
    window.playerDistance = 50; // The first station is usually at 50m
    window.playerSpeed = 0;

    // Position camera to look at the platform
    // First-person camera is at playerDistance.
    // Let's force a side view of the platform.
    if (window.scene) {
        // Move camera to see people
        window.scene.children.forEach(child => {
            if (child instanceof THREE.PerspectiveCamera) {
                child.position.set(10, 3, 50);
                child.lookAt(5, 1, 50);
            }
        });
    }
  });

  // Wait for people to animate a bit
  await new Promise(resolve => setTimeout(resolve, 2000));
  await page.screenshot({ path: 'people_verification_1.png' });

  await new Promise(resolve => setTimeout(resolve, 2000));
  await page.screenshot({ path: 'people_verification_2.png' });

  console.log('Screenshots saved: people_verification_1.png, people_verification_2.png');

  await browser.close();
})();
