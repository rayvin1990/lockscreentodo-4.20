// Verify calculation for user's screenshot
// Price: $2,495, Income: $300,000/year, 8 hrs/day

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
const amount = 300000;
const incomeType = 'yearly';
const hoursPerDay = 8;

const hourlyRate = convertToHourlyRate(amount, incomeType, hoursPerDay);
const totalHours = price / hourlyRate;
const days = totalHours / hoursPerDay;
const weeks = days / 5;

console.log('=== Screenshot Test Case ===');
console.log('Price: $' + price);
console.log('Income: $' + amount + '/' + incomeType);
console.log('Hours/Day: ' + hoursPerDay);
console.log('');
console.log('Hourly Rate: $' + hourlyRate.toFixed(2) + '/hr');
console.log('Total Hours: ' + totalHours.toFixed(2) + ' hrs');
console.log('Work Days: ' + days.toFixed(1) + ' days');
console.log('Work Weeks: ' + weeks.toFixed(2) + ' weeks');
console.log('');
console.log('Current (WRONG): ≈ 1 week of work');
console.log('Expected (CORRECT): ≈ ' + days.toFixed(1) + ' workdays');
