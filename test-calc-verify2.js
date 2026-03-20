// Verify calculation for user's screenshot v1.9.0
// Price: $2,495, Income: $30,000/year, 8 hrs/day

const DEFAULT_HOURS_PER_DAY = 8;

function convertToHourlyRate(amount, incomeType, hoursPerDay) {
  hoursPerDay = hoursPerDay || DEFAULT_HOURS_PER_DAY;
  if (!amount || amount <= 0) return 0;

  const hoursPerWeek = hoursPerDay * 5;
  const hoursPerBiweek = hoursPerWeek * 2;
  const hoursPerMonth = hoursPerDay * 21.75;
  const hoursPerYear = hoursPerDay * 261;

  switch (incomeType) {
    case 'hourly': return amount;
    case 'daily': return amount / hoursPerDay;
    case 'weekly': return amount / hoursPerWeek;
    case 'biweekly': return amount / hoursPerBiweek;
    case 'monthly': return amount / hoursPerMonth;
    case 'yearly': return amount / hoursPerYear;
    default: return amount;
  }
}

// Test case from screenshot
const price = 2495;
const amount = 30000;  // $30,000/year
const incomeType = 'yearly';
const hoursPerDay = 8;

const hourlyRate = convertToHourlyRate(amount, incomeType, hoursPerDay);
const totalHours = price / hourlyRate;
const days = totalHours / hoursPerDay;
const weeks = days / 5;
const months = days / 21.75;

console.log('=== Screenshot Test Case ($30k/year) ===');
console.log('Price: $' + price);
console.log('Income: $' + amount + '/' + incomeType);
console.log('Hours/Day: ' + hoursPerDay);
console.log('');
console.log('Hourly Rate: $' + hourlyRate.toFixed(2) + '/hr');
console.log('Total Hours: ' + totalHours.toFixed(2) + ' hrs');
console.log('Work Days: ' + days.toFixed(1) + ' days');
console.log('Work Weeks: ' + weeks.toFixed(1) + ' weeks');
console.log('Work Months: ' + months.toFixed(1) + ' months');
console.log('');
console.log('=== Threshold Analysis ===');
console.log('totalHours < 12? ' + (totalHours < 12) + ' → hours');
console.log('totalHours < 40? ' + (totalHours < 40) + ' → days');
console.log('totalHours < 160? ' + (totalHours < 160) + ' → weeks/months');
console.log('totalHours < 500? ' + (totalHours < 500) + ' → months');
console.log('');
console.log('Current result: ≈ 1.0 months of work');
console.log('Expected: ≈ ' + weeks.toFixed(1) + ' weeks of work (or ' + days.toFixed(1) + ' days)');
console.log('');
console.log('=== Problem ===');
console.log('173.6 hours > 160, so it enters "months" branch');
console.log('But 173.6 hours = 21.7 days = 4.3 weeks = 0.8 months');
console.log('Should show weeks, not months!');
