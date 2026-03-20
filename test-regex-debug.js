// Debug regex test

const PRICE_REGEX_OLD = /([$£€¥₽₹₩₺₴₦₿]|CNY|USD|EUR|GBP|JPY|RMB|HKD|TWD|KRW|INR|AUD|CAD|CHF|SEK|NOK|DKK|NZD|SGD|THB|MYR|PHP|IDR|VND)[\s\u00a0]?(\d{1,3}(,\d{3})*(\.\d{1,2})?|\d+(\.\d{1,2})?)/gi;

const PRICE_REGEX_NEW = /([$£€¥₽₹₩₺₴₦₿]|CNY|USD|EUR|GBP|JPY|RMB|HKD|TWD|KRW|INR|AUD|CAD|CHF|SEK|NOK|DKK|NZD|SGD|THB|MYR|PHP|IDR|VND)[\s\u00a0]?\d{1,3}(,\d{3})*(\.\d{1,2})?/gi;

const tests = [
  '$5,999',
  '$1,299.00',
  '$299',
  '$19.99',
  '$ 1,299 00'
];

console.log('=== OLD Regex ===');
tests.forEach(text => {
  PRICE_REGEX_OLD.lastIndex = 0;
  const match = PRICE_REGEX_OLD.exec(text);
  console.log(`"${text}" -> ${match ? '"' + match[0] + '"' : 'NO MATCH'}`);
});

console.log('\n=== NEW Regex ===');
tests.forEach(text => {
  PRICE_REGEX_NEW.lastIndex = 0;
  const match = PRICE_REGEX_NEW.exec(text);
  console.log(`"${text}" -> ${match ? '"' + match[0] + '"' : 'NO MATCH'}`);
});
