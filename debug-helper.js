// Price to Hours - Debug Helper
// Run this in Amazon page console to test price recognition

(function() {
  console.log('=== Price to Hours Debug Helper ===\n');

  // Find all price elements on page
  const priceSelectors = [
    '.a-price',
    '.a-offscreen',
    '[class*="price"]',
    '[data-price]'
  ];

  console.log('📊 Scanning for price elements...\n');

  priceSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      console.log(`Selector "${selector}" found ${elements.length} elements:`);
      elements.forEach((el, i) => {
        console.log(`  ${i + 1}. "${el.textContent.trim()}"`);
        console.log(`     Classes: ${el.className}`);
        console.log(`     HTML: ${el.outerHTML.substring(0, 200)}...`);
      });
      console.log('');
    }
  });

  // Test PRICE_REGEX
  const PRICE_REGEX = /([$£€¥₽₹₩₺₴₦₿]|CNY|USD|EUR|GBP|JPY|RMB|HKD|TWD|KRW|INR|AUD|CAD|CHF|SEK|NOK|DKK|NZD|SGD|THB|MYR|PHP|IDR|VND)[\s\u00a0]?(\d{1,3}(,\d{3})*(\.\d{1,2})?|\d+(\.\d{1,2})?)/gi;

  console.log('🔍 Testing price regex:\n');
  const allText = document.body.textContent;
  const matches = allText.match(PRICE_REGEX);
  if (matches && matches.length > 0) {
    console.log(`Found ${matches.length} price matches on page:`);
    matches.slice(0, 20).forEach(m => console.log(`  - ${m}`));
  } else {
    console.log('No prices found with regex');
  }

  console.log('\n=== Instructions ===');
  console.log('1. Hover over any price on the page');
  console.log('2. Check console for [PTH Debug] logs');
  console.log('3. If no logs appear, the element is not being detected');
})();
