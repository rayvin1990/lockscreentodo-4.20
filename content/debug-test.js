/**
 * Debug script to test if content script is working
 */

console.log('=== Price to Hours DEBUG TEST ===');
console.log('Script loaded!');

// Test 1: Check if functions are available
console.log('parsePrice:', typeof window.parsePrice);
console.log('hasPrice:', typeof window.hasPrice);
console.log('calculateWorkHours:', typeof window.calculateWorkHours);
console.log('TooltipManager:', typeof window.TooltipManager);
console.log('loadSettings:', typeof window.loadSettings);

// Test 2: Manual price detection test
const testPrices = ['$299', '$19.99', '£1,299', '€89'];
testPrices.forEach(price => {
  const result = window.hasPrice ? window.hasPrice(price) : 'N/A';
  console.log(`hasPrice("${price}"):`, result);
});

// Test 3: Add visual indicator
const debugBox = document.createElement('div');
debugBox.style.cssText = `
  position: fixed;
  top: 10px;
  right: 10px;
  background: #ff0;
  color: #000;
  padding: 10px;
  border: 2px solid #000;
  border-radius: 8px;
  z-index: 2147483647;
  font-size: 14px;
  font-family: sans-serif;
`;
debugBox.innerHTML = '🔍 PTH Debug Loaded<br><span id="pth-status">Checking...</span>';
document.body.appendChild(debugBox);

const statusEl = document.getElementById('pth-status');

// Check every 500ms
setTimeout(() => {
  const checks = [];
  checks.push(`parsePrice: ${typeof window.parsePrice}`);
  checks.push(`hasPrice: ${typeof window.hasPrice}`);
  checks.push(`TooltipManager: ${typeof window.TooltipManager}`);

  if (typeof window.hasPrice === 'function') {
    const testResult = window.hasPrice('$299');
    checks.push(`Test "$299": ${testResult}`);
  }

  statusEl.innerHTML = checks.join('<br>');
  console.log('Debug checks:', checks);
}, 500);

// Test 4: Manual tooltip test on click
document.addEventListener('click', (e) => {
  console.log('Click detected at:', e.pageX, e.pageY);
  console.log('Clicked element:', e.target.tagName, e.target.textContent);

  if (typeof window.TooltipManager === 'function') {
    const tm = new window.TooltipManager();
    const workTime = typeof window.calculateWorkHours === 'function'
      ? window.calculateWorkHours(299, 50)
      : 'N/A';
    tm.showDelayed(e.pageX, e.pageY, '$299', workTime);
    console.log('Tooltip triggered manually');
  }
}, true);

console.log('=== DEBUG TEST COMPLETE ===');
