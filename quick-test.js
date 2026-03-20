/**
 * Quick Test for Price to Hours Extension
 * Copy and paste this into browser console on any page with prices
 */

console.log('=== Price to Hours Quick Test ===\n');

// Test 1: Check if functions exist
console.log('1. Function Availability:');
console.log('   hasPrice:', typeof window.hasPrice === 'function' ? '✓' : '✗');
console.log('   parsePrice:', typeof window.parsePrice === 'function' ? '✓' : '✗');
console.log('   calculateWorkHours:', typeof window.calculateWorkHours === 'function' ? '✓' : '✗');
console.log('   isOriginalPrice:', typeof window.isOriginalPrice === 'function' ? '✓' : '✗');

// Test 2: Price detection
console.log('\n2. Price Detection Tests:');
const priceTests = ['$299', '$19.99', '$1,299', '£49', '€89', '¥1200', 'no price'];
priceTests.forEach(test => {
  console.log(`   hasPrice("${test}"):`, window.hasPrice ? window.hasPrice(test) : 'N/A');
});

// Test 3: Price parsing
console.log('\n3. Price Parsing Tests:');
const parseTests = ['$299', '$19.99', '$1,299'];
parseTests.forEach(test => {
  console.log(`   parsePrice("${test}"):`, window.parsePrice ? JSON.stringify(window.parsePrice(test)) : 'N/A');
});

// Test 4: Work hour calculation
console.log('\n4. Work Hour Calculation Tests:');
const calcTests = [
  { price: 25, rate: 25 },
  { price: 299, rate: 25 },
  { price: 19.99, rate: 25 },
  { price: 1299, rate: 25 }
];
calcTests.forEach(test => {
  console.log(`   calculateWorkHours(${test.price}, ${test.rate}):`,
    window.calculateWorkHours ? window.calculateWorkHours(test.price, test.rate) : 'N/A');
});

// Test 5: Check if labels are on page
console.log('\n5. Label Check:');
const labels = document.querySelectorAll('.pth-worktime-label');
console.log('   Labels on page:', labels.length);

console.log('\n=== Test Complete ===');
