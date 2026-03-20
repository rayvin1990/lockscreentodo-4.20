/**
 * Price Parser Module
 * Extracts price information from text content
 */

const PRICE_REGEX = /([$£€¥])\s?\d{1,3}(,\d{3})*(\.\d{1,2})?/g;

/**
 * Parse price from text
 * @param {string} text - Text content to parse
 * @returns {Object|null} - { symbol: string, value: number } or null
 */
function parsePrice(text) {
  PRICE_REGEX.lastIndex = 0;
  const match = PRICE_REGEX.exec(text);

  if (!match) {
    return null;
  }

  const symbol = match[1];
  // Remove commas and parse as float
  const numericValue = match[0].replace(/[^\d.]/g, '');

  return {
    symbol,
    value: parseFloat(numericValue)
  };
}

/**
 * Check if text contains price
 * @param {string} text - Text to check
 * @returns {boolean}
 */
function hasPrice(text) {
  PRICE_REGEX.lastIndex = 0;
  return PRICE_REGEX.test(text);
}

// Export to global scope for browser
window.parsePrice = parsePrice;
window.hasPrice = hasPrice;
