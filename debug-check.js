/**
 * Debug - Check extension status
 * Copy and paste this into browser console on Amazon page
 */

console.log('=== Price to Hours DEBUG ===');
console.log('window.hasPrice:', typeof window.hasPrice);
console.log('window.parsePrice:', typeof window.parsePrice);
console.log('window.calculateWorkHours:', typeof window.calculateWorkHours);
console.log('window.TooltipManager:', typeof window.TooltipManager);
console.log('window.loadSettings:', typeof window.loadSettings);

// Test price detection
console.log('\n=== Test hasPrice ===');
console.log('hasPrice("$299"):', window.hasPrice ? window.hasPrice('$299') : 'N/A');
console.log('hasPrice("$19.99"):', window.hasPrice ? window.hasPrice('$19.99') : 'N/A');

// Test parse
console.log('\n=== Test parsePrice ===');
console.log('parsePrice("$299"):', window.parsePrice ? window.parsePrice('$299') : 'N/A');

// Test calculate
console.log('\n=== Test calculateWorkHours ===');
console.log('calculateWorkHours(299, 25):', window.calculateWorkHours ? window.calculateWorkHours(299, 25) : 'N/A');

// Test tooltip
console.log('\n=== Test TooltipManager ===');
if (window.TooltipManager) {
  const tm = new window.TooltipManager();
  console.log('TooltipManager created:', tm);
  tm.show(100, 100, '$299', '6 hours of work');
  console.log('Tooltip should appear at (100, 100)');
}

console.log('\n=== DEBUG END ===');
