/**
 * Debug Original Price Detection
 * Copy and paste this into browser console on Amazon or any e-commerce page
 */

console.log('=== Original Price Detection Debug ===\n');

// Check if extension functions are available
if (typeof window.isOriginalPrice !== 'function') {
  console.log('Extension not loaded. Please refresh the page after loading the extension.');
} else {
  // Find all price-like elements on the page
  const priceElements = document.querySelectorAll('[class*="price"], [class*="Price"], span, div');
  let foundPrices = 0;
  let originalPrices = 0;

  priceElements.forEach((el) => {
    const text = el.textContent.trim();
    // Check if element contains a price
    if (/[\$£€¥]\s?\d/.test(text) || /\d+[\s]?[\$£€¥]/.test(text)) {
      foundPrices++;
      const isOriginal = window.isOriginalPrice(el);
      if (isOriginal) originalPrices++;

      const style = window.getComputedStyle(el);
      console.log(`\n${foundPrices}. "${text.substring(0, 50)}"`);
      console.log(`   Element: <${el.tagName.toLowerCase()} class="${el.className}">`);
      console.log(`   isOriginalPrice: ${isOriginal ? 'YES' : 'no'}`);
      console.log(`   textDecoration: ${style.textDecoration || 'none'}`);
      console.log(`   textDecorationLine: ${style.textDecorationLine || 'none'}`);
      console.log(`   color: ${style.color}`);
    }
  });

  console.log(`\n=== Summary ===`);
  console.log(`Total price elements found: ${foundPrices}`);
  console.log(`Original prices detected: ${originalPrices}`);
  console.log(`Current prices (should show labels): ${foundPrices - originalPrices}`);
}

// Test specific price patterns
console.log('\n=== Text Node Pattern Tests ===');
const testNodes = [
  { text: '$299', expected: false },
  { text: 'Was: $299', expected: true },
  { text: 'List Price: $399', expected: true },
  { text: 'Original: $449', expected: true },
  { text: '$19.99', expected: false },
  { text: 'Regular Price: $599', expected: true }
];

testNodes.forEach(test => {
  const mockNode = { textContent: test.text };
  const result = window.isOriginalPriceNode ? window.isOriginalPriceNode(mockNode) : 'N/A';
  const ok = result === test.expected ? '✓' : '✗';
  console.log(`isOriginalPriceNode("${test.text}"): ${result} (expected: ${test.expected}) ${ok}`);
});

console.log('\n=== Debug Complete ===');
