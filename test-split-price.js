// Test price regex with split prices

const PRICE_REGEX = /([$£€¥₽₹₩₺₴₦₿]|CNY|USD|EUR|GBP|JPY|RMB|HKD|TWD|KRW|INR|AUD|CAD|CHF|SEK|NOK|DKK|NZD|SGD|THB|MYR|PHP|IDR|VND)[\s\u00a0]?(\d{1,3}(,\d{3})*(\.\d{1,2})?|\d+(\.\d{1,2})?)/gi;

function parsePrice(text) {
  if (!text) return null;

  var normalizedText = text.replace(/\s+/g, ' ').trim();

  PRICE_REGEX.lastIndex = 0;
  let match = PRICE_REGEX.exec(normalizedText);

  if (!match) return null;

  let symbol = match[1];
  let fullMatch = match[0];
  let matchIndex = match.index;
  let afterMatch = normalizedText.substring(matchIndex + fullMatch.length).trim();

  // Check for fractional part after match (e.g., "00" in "$1,299 00")
  let fractionalMatch = afterMatch.match(/^(\d{2})(?!\d)/);
  let fractionalValue = 0;
  if (fractionalMatch) {
    fractionalValue = parseInt(fractionalMatch[1]) / 100;
  }

  let numericPart = fullMatch.replace(/[^0-9.,]/g, '');

  let parts = numericPart.split(/[.,]/);
  let value;

  if (parts.length === 1) {
    value = parseFloat(parts[0]);
  } else if (parts.length === 2) {
    if (parts[1].length <= 2) {
      value = parseFloat(numericPart.replace(/,/g, '.'));
    } else {
      value = parseFloat(numericPart.replace(/,/g, '').replace(/\./g, ''));
    }
  } else {
    let decimalPos = numericPart.lastIndexOf('.');
    if (decimalPos === -1) decimalPos = numericPart.lastIndexOf(',');

    if (decimalPos > 0 && numericPart.length - decimalPos - 1 <= 2) {
      let intPart = numericPart.substring(0, decimalPos).replace(/,/g, '').replace(/\./g, '');
      let decPart = numericPart.substring(decimalPos + 1, decimalPos + 3);
      value = parseFloat(intPart + '.' + decPart);
    } else {
      value = parseFloat(numericPart.replace(/,/g, '').replace(/\./g, ''));
    }
  }

  value += fractionalValue;

  return { symbol, value: isNaN(value) ? 0 : value };
}

const tests = [
  '$ 1,299 00',
  "$\n1,299\n00",
  '$1,299.00',
  '$ 2,499 99',
  'USD 1,299',
  '$19.99',
  '$299',
  '$ 5,999 00'
];

console.log('=== Testing Split Price Recognition ===\n');

tests.forEach(text => {
  const result = parsePrice(text);
  console.log(`"${text}" -> ${result ? result.symbol + result.value.toFixed(2) : 'null'}`);
});
