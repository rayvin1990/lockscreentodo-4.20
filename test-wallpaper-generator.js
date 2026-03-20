// Test script to verify wallpaper generator functionality
const { chromium } = require('playwright');

async function testWallpaperGenerator() {
  console.log('🧪 Testing Wallpaper Generator Functionality...');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Navigate to the generator page
    console.log('📱 Opening generator page...');
    await page.goto('http://localhost:3002/en/generator');

    // Wait for page to load
    await page.waitForSelector('form', { timeout: 10000 });
    console.log('✅ Page loaded successfully');

    // Check if style buttons are visible
    const styleButtons = await page.$$('input[type="radio"][name="style"]');
    console.log(`🎨 Found ${styleButtons.length} style buttons`);

    if (styleButtons.length === 6) {
      console.log('✅ All 6 style buttons are present');
    } else {
      console.log('❌ Style buttons issue found');
    }

    // Fill in test data
    console.log('✏️ Filling in test data...');
    await page.fill('textarea[placeholder*="任务清单"]', '完成项目报告\n健身30分钟\n阅读一小时');
    await page.fill('textarea[placeholder*="灵感语录"]', '今天的努力，是明天的实力。\n专注当下，未来可期。');

    // Select a style (minimal)
    await page.check('input[id="minimal"]');
    console.log('✅ Selected minimal style');

    // Click generate button
    console.log('🚀 Clicking generate button...');
    await page.click('button[type="button"]:has-text("生成壁纸")');

    // Wait for generation to complete
    await page.waitForTimeout(3000);

    // Check if download button appears
    const downloadButton = await page.$('a:has-text("下载壁纸")');
    if (downloadButton) {
      console.log('✅ Download button appeared successfully');

      // Get canvas element
      const canvas = await page.$('canvas');
      if (canvas) {
        console.log('✅ Canvas element is present and visible');
      } else {
        console.log('❌ Canvas element not found');
      }
    } else {
      console.log('❌ Download button did not appear');
    }

    console.log('🎉 Test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testWallpaperGenerator().catch(console.error);