// Test calculation logic

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

function calculateWorkTimeSimple(price, amount, incomeType, hoursPerDay) {
  hoursPerDay = hoursPerDay || DEFAULT_HOURS_PER_DAY;
  if (!price || price <= 0) return 'N/A';
  if (!amount || amount <= 0) return 'N/A';

  const hourlyRate = convertToHourlyRate(amount, incomeType, hoursPerDay);
  if (!hourlyRate || hourlyRate <= 0) return 'N/A';

  const totalHours = price / hourlyRate;
  const minutes = Math.round(totalHours * 60);

  console.log('=== Calculation Details ===');
  console.log('Price:', price);
  console.log('Amount:', amount, '/', incomeType);
  console.log('Hours/Day:', hoursPerDay);
  console.log('Hourly Rate:', hourlyRate.toFixed(2));
  console.log('Total Hours:', totalHours.toFixed(2));
  console.log('Minutes:', minutes);
  console.log('Days (8hr):', (totalHours / 8).toFixed(1));
  console.log('Weeks:', (totalHours / 40).toFixed(1));
  console.log('Months:', (totalHours / 174).toFixed(1));
  console.log('');

  // Auto-select best time unit
  if (totalHours < 0.1) {
    if (minutes < 1) return '≈ 1 min of work';
    return `≈ ${minutes} min of work`;
  } else if (totalHours < 1) {
    return `≈ ${minutes} min of work`;
  } else if (totalHours < 1.5) {
    return '≈ 1 hour of work';
  } else if (totalHours < 8) {
    if (totalHours < 2) return '≈ 1 hour of work';
    return `≈ ${totalHours.toFixed(1)} hours of work`;
  } else if (totalHours < 16) {
    const days = totalHours / hoursPerDay;
    if (days < 1.5) return '≈ 1 workday';
    return `≈ ${days.toFixed(1)} workdays`;
  } else if (totalHours < 40) {
    const weeks = totalHours / (hoursPerDay * 5);
    if (weeks < 1.5) return '≈ 1 week of work';
    return `≈ ${weeks.toFixed(1)} weeks of work`;
  } else if (totalHours < 160) {
    const weeks = totalHours / (hoursPerDay * 5);
    if (weeks < 2.5) return '≈ 2 weeks of work';
    const months = totalHours / (hoursPerDay * 21.75);
    if (months < 1.5) return '≈ 1 month of work';
    return `≈ ${months.toFixed(1)} months of work`;
  } else if (totalHours < 500) {
    const months = totalHours / (hoursPerDay * 21.75);
    if (months < 12) return `≈ ${months.toFixed(1)} months of work`;
    const years = totalHours / (hoursPerDay * 261);
    return `≈ ${years.toFixed(1)} years of work`;
  } else {
    const years = totalHours / (hoursPerDay * 261);
    if (years < 1.5) return '≈ 1 year of work';
    return `≈ ${years.toFixed(1)} years of work`;
  }
}

// Test cases
console.log('=== Test Cases ===\n');

const tests = [
  { price: 19.99, amount: 2000, incomeType: 'biweekly' },
  { price: 299, amount: 2000, incomeType: 'biweekly' },
  { price: 1299, amount: 2000, incomeType: 'biweekly' },
  { price: 5999, amount: 2000, incomeType: 'biweekly' },
];

tests.forEach(t => {
  const result = calculateWorkTimeSimple(t.price, t.amount, t.incomeType, 8);
  console.log(`$${t.price} -> ${result}`);
  console.log('');
});
