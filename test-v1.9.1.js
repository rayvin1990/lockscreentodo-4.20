// Verify fix for v1.9.1
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

function calculateWorkTimeSimple(price, amount, incomeType, hoursPerDay) {
  hoursPerDay = hoursPerDay || DEFAULT_HOURS_PER_DAY;
  if (!price || price <= 0) return 'N/A';
  if (!amount || amount <= 0) return 'N/A';

  const hourlyRate = convertToHourlyRate(amount, incomeType, hoursPerDay);
  if (!hourlyRate || hourlyRate <= 0) return 'N/A';

  const totalHours = price / hourlyRate;
  if (isNaN(totalHours) || !isFinite(totalHours)) return 'N/A';

  const minutes = Math.round(totalHours * 60);
  const days = totalHours / hoursPerDay;
  const weeks = days / 5;
  const months = days / 21.75;

  // v1.9.1 thresholds
  if (totalHours < 0.1) {
    if (minutes < 1) return '≈ 1 min of work';
    return `≈ ${minutes} min of work`;
  } else if (totalHours < 1) {
    return `≈ ${minutes} min of work`;
  } else if (totalHours < 1.5) {
    return '≈ 1 hour of work';
  } else if (totalHours < 12) {
    if (totalHours < 2) return '≈ 1 hour of work';
    return `≈ ${totalHours.toFixed(1)} hours of work`;
  } else if (totalHours < 40) {
    if (days < 1.5) return '≈ 1 workday';
    if (days < 4.5) return `≈ ${days.toFixed(1)} workdays`;
    if (weeks < 1.5) return '≈ 1 week of work';
    return `≈ ${weeks.toFixed(1)} weeks of work`;
  } else if (totalHours < 174) {  // ← FIXED: was 160
    if (weeks < 2.5) return '≈ 2 weeks of work';
    if (weeks < 4.5) return `≈ ${weeks.toFixed(1)} weeks of work`;  // ← NEW
    if (months < 1.5) return '≈ 1 month of work';
    return `≈ ${months.toFixed(1)} months of work`;
  } else if (totalHours < 500) {
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
const tests = [
  { price: 2495, amount: 30000, incomeType: 'yearly', desc: 'Screenshot case' },
  { price: 2495, amount: 300000, incomeType: 'yearly', desc: '$300k/year case' },
  { price: 5999, amount: 2000, incomeType: 'biweekly', desc: 'Previous test' },
  { price: 1299, amount: 3000, incomeType: 'biweekly', desc: 'Standard test' },
];

console.log('=== v1.9.1 Verification ===\n');
tests.forEach(t => {
  const result = calculateWorkTimeSimple(t.price, t.amount, t.incomeType, 8);
  const hourlyRate = convertToHourlyRate(t.amount, t.incomeType, 8);
  const totalHours = t.price / hourlyRate;
  console.log(`$${t.price} @ $${t.amount}/${t.incomeType}`);
  console.log(`  → ${totalHours.toFixed(1)} hours → ${result}`);
  console.log(`  [${t.desc}]\n`);
});
