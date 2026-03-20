/**
 * Calculator Module
 * Calculates work hours from price and hourly rate
 */

const DEFAULT_HOURS_PER_DAY = 8;

/**
 * Convert any income type to hourly rate
 * @param {number} amount - Income amount
 * @param {string} incomeType - Income type (hourly/daily/weekly/biweekly/monthly/yearly)
 * @param {number} hoursPerDay - Work hours per day
 * @returns {number} - Hourly rate
 */
function convertToHourlyRate(amount, incomeType, hoursPerDay = DEFAULT_HOURS_PER_DAY) {
  if (!amount || amount <= 0) return 0;

  const hoursPerWeek = hoursPerDay * 5; // 5 work days per week
  const hoursPerBiweek = hoursPerWeek * 2;
  const hoursPerMonth = hoursPerDay * 21.75; // Average work days per month
  const hoursPerYear = hoursPerDay * 261; // Work days per year

  switch (incomeType) {
    case 'hourly':
      return amount;
    case 'daily':
      return amount / hoursPerDay;
    case 'weekly':
      return amount / hoursPerWeek;
    case 'biweekly':
      return amount / hoursPerBiweek;
    case 'monthly':
      return amount / hoursPerMonth;
    case 'yearly':
      return amount / hoursPerYear;
    default:
      return amount;
  }
}

/**
 * Get time unit label based on income type
 * @param {string} incomeType - Income type
 * @returns {string} - Time unit label
 */
function getTimeUnit(incomeType) {
  const labels = {
    hourly: '小时工作',
    daily: '工作日',
    weekly: '工作周',
    biweekly: '双周工作',
    monthly: '工作月',
    yearly: '工作年'
  };
  return labels[incomeType] || '小时工作';
}

/**
 * Calculate work time
 * @param {number} price - Price value
 * @param {number} amount - Income amount
 * @param {string} incomeType - Income type
 * @param {number} hoursPerDay - Work hours per day
 * @returns {string} - Formatted time string in Chinese
 */
function calculateWorkTime(price, amount, incomeType = 'biweekly', hoursPerDay = DEFAULT_HOURS_PER_DAY) {
  if (!amount || amount <= 0) {
    return '约等于 N/A';
  }

  const hourlyRate = convertToHourlyRate(amount, incomeType, hoursPerDay);

  if (hourlyRate <= 0) {
    return '约等于 N/A';
  }

  const hours = price / hourlyRate;

  // For hourly income type, show in hours/minutes
  if (incomeType === 'hourly') {
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `约等于 ${minutes} 分钟工作`;
    }
    if (hours < 8) {
      return `约等于 ${hours.toFixed(1)} 小时工作`;
    }
    if (hours <= 24) {
      const days = hours / hoursPerDay;
      return `约等于 ${days.toFixed(1)} 工作日`;
    }
    if (hours <= 40) {
      const weeks = hours / (hoursPerDay * 5);
      return `约等于 ${weeks.toFixed(1)} 工作周`;
    }
    const months = hours / (hoursPerDay * 21.75);
    return `约等于 ${months.toFixed(1)} 工作月`;
  }

  // For other income types, show in that unit
  const timeUnits = price / amount;
  const unit = getTimeUnit(incomeType);

  if (timeUnits < 0.1) {
    const percentage = Math.round(timeUnits * 100);
    return `约等于 ${percentage}% ${unit}`;
  }
  if (timeUnits < 1) {
    return `约等于 ${timeUnits.toFixed(2)} ${unit}`;
  }
  if (timeUnits <= 10) {
    return `约等于 ${timeUnits.toFixed(1)} ${unit}`;
  }
  return `约等于 ${Math.round(timeUnits)} ${unit}`;
}

// Export to global scope for browser
window.calculateWorkTime = calculateWorkTime;
window.convertToHourlyRate = convertToHourlyRate;
window.getTimeUnit = getTimeUnit;
