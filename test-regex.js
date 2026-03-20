const PRICE_REGEX = /([$£€¥₽₹₩₺₴₦₿]|CNY|USD|EUR|GBP|JPY|RMB|HKD|TWD|KRW|INR|AUD|CAD|CHF|SEK|NOK|DKK|NZD|SGD|THB|MYR|PHP|IDR|VND)[\s\u00a0]?(\d{1,3}(,\d{3})*(\.\d{1,2})?|\d+(\.\d{1,2})?)/gi;

const tests = [
  '$1,299',
  '$1,299.00',
  '$19.99',
  '$299',
  '$5,999',
  '$100',
  'USD 1,299',
  'Price: $1,299.00'
];

tests.forEach(text => {
  PRICE_REGEX.lastIndex = 0;
  const match = PRICE_REGEX.exec(text);
  console.log(`"${text}" -> ${match ? '"' + match[0] + '"' : 'NO MATCH'}`);
});
