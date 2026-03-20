/**
 * Price to Hours - Content Script
 * Shows work time badge on price hover
 * Supports: Price elements and Buy buttons
 */

(function() {
  'use strict';

  // ============================================
  // Configuration
  // ============================================

  // Enhanced price regex - supports more formats
  const PRICE_REGEX = /([$£€¥₽₹₩₺₴₦₿]|CNY|USD|EUR|GBP|JPY|RMB|HKD|TWD|KRW|INR|AUD|CAD|CHF|SEK|NOK|DKK|NZD|SGD|THB|MYR|PHP|IDR|VND)[\s\u00a0]?(\d{1,3}(,\d{3})*(\.\d{1,2})?|\d+(\.\d{1,2})?)/gi;
  const DEFAULT_HOURS_PER_DAY = 8;

  // Buy button selectors for major e-commerce sites
  const BUY_BUTTON_SELECTORS = [
    'button[name="submit"]',
    'button[type="submit"]',
    '.add-to-cart',
    '.addToCart',
    '#addToCart',
    '#add-to-cart',
    '.buy-now',
    '.buyNow',
    '#buy-now',
    '#buyNow',
    '[data-action="add-to-cart"]',
    '[data-action="buy-now"]',
    'input[value="Add to Cart"]',
    'input[value="Buy Now"]',
    'input[value="Add to cart"]',
    'input[value="Buy now"]'
  ];

  // ============================================
  // Calculator Functions
  // ============================================

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
    const months = days / 21.75;
    const years = days / 261;

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
    } else if (days < 30) {
      // Less than 30 days - show in days
      if (days < 1.5) return '≈ 1 workday';
      return `≈ ${days.toFixed(1)} workdays`;
    } else if (days < 250) {
      // Less than 250 days - show in days (not months)
      return `≈ ${days.toFixed(1)} workdays`;
    } else if (days < 500) {
      // Less than 500 days - show in days
      return `≈ ${days.toFixed(1)} workdays`;
    } else {
      // 500+ days - show in years
      if (years < 1.5) return '≈ 1 year of work';
      return `≈ ${years.toFixed(1)} years of work`;
    }
  }

  // ============================================
  // Price Parser
  // ============================================

  function parsePrice(text) {
    if (!text) return null;

    // Normalize text: remove newlines, collapse spaces
    var normalizedText = text.replace(/\s+/g, ' ').trim();

    PRICE_REGEX.lastIndex = 0;
    let match = PRICE_REGEX.exec(normalizedText);

    if (!match) return null;

    let symbol = match[1];
    let fullMatch = match[0];
    let matchIndex = match.index;
    let afterMatch = normalizedText.substring(matchIndex + fullMatch.length).trim();

    // Check if there's a fractional part after the match (e.g., "00" in "$1,299 00")
    let fractionalMatch = afterMatch.match(/^(\d{2})(?!\d)/);
    let fractionalValue = 0;
    if (fractionalMatch) {
      fractionalValue = parseInt(fractionalMatch[1]) / 100;
    }

    // Extract integer value from full match
    let numericPart = fullMatch.replace(/[^0-9.,]/g, '');

    let parts = numericPart.split(/[.,]/);
    let value;

    if (parts.length === 1) {
      // No separators, just digits
      value = parseFloat(parts[0]);
    } else if (parts.length === 2) {
      // One separator - could be thousands or decimal
      if (parts[1].length <= 2) {
        // Likely decimal (e.g., "1299.99" or "1299,99")
        value = parseFloat(numericPart.replace(/,/g, '.'));
      } else {
        // Thousands separator (e.g., "1,299" -> 1299)
        value = parseFloat(numericPart.replace(/,/g, '').replace(/\./g, ''));
      }
    } else {
      // Multiple separators - assume last is decimal, others are thousands
      let decimalPos = numericPart.lastIndexOf('.');
      if (decimalPos === -1) decimalPos = numericPart.lastIndexOf(',');

      if (decimalPos > 0 && numericPart.length - decimalPos - 1 <= 2) {
        // Last separator is decimal
        let intPart = numericPart.substring(0, decimalPos).replace(/,/g, '').replace(/\./g, '');
        let decPart = numericPart.substring(decimalPos + 1, decimalPos + 3);
        value = parseFloat(intPart + '.' + decPart);
      } else {
        // All are thousands separators
        value = parseFloat(numericPart.replace(/,/g, '').replace(/\./g, ''));
      }
    }

    // Add fractional part if found
    value += fractionalValue;

    const currencyMap = {
      'CNY': '¥', 'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥',
      'RMB': '¥', 'HKD': 'HK$', 'TWD': 'NT$', 'KRW': '₩', 'INR': '₹',
      'AUD': 'A$', 'CAD': 'C$', 'CHF': 'Fr', 'SEK': 'kr', 'NOK': 'kr',
      'DKK': 'kr', 'NZD': 'NZ$', 'SGD': 'S$', 'THB': '฿', 'MYR': 'RM',
      'PHP': '₱', 'IDR': 'Rp', 'VND': '₫', 'RUB': '₽', 'BTC': '₿'
    };

    if (currencyMap[symbol.toUpperCase()]) {
      symbol = currencyMap[symbol.toUpperCase()];
    }

    return { symbol: symbol, value: isNaN(value) ? 0 : value };
  }

  function hasPrice(text) {
    if (!text) return false;

    // Normalize text: remove newlines, collapse spaces
    var normalizedText = text.replace(/\s+/g, ' ').trim();

    PRICE_REGEX.lastIndex = 0;
    return PRICE_REGEX.test(normalizedText);
  }

  // Find price in element or its children
  function findPriceInElement(element) {
    if (!element) return null;

    // Strategy 1: Check for a-offscreen class (Amazon hidden accessible price)
    var offscreenEl = element.querySelector('.a-offscreen');
    if (!offscreenEl) {
      offscreenEl = element.querySelector('[class*="offscreen"]');
    }
    if (!offscreenEl) {
      offscreenEl = element.querySelector('[class*="sr-only"]');
    }
    if (offscreenEl) {
      var offscreenText = offscreenEl.textContent.trim();
      if (offscreenText && hasPrice(offscreenText)) {
        return parsePrice(offscreenText);
      }
    }

    // Strategy 2: Check direct text content (text nodes only)
    var textContent = '';
    element.childNodes.forEach(function(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        textContent += node.textContent;
      }
    });

    if (textContent.trim() && hasPrice(textContent)) {
      return parsePrice(textContent);
    }

    // Strategy 3: Check full text content
    textContent = element.textContent.trim();
    if (textContent && hasPrice(textContent)) {
      return parsePrice(textContent);
    }

    // Strategy 4: Check child elements (for split prices like $1,299.00)
    var allText = '';
    var children = element.querySelectorAll('*');
    children.forEach(function(child) {
      allText += child.textContent;
    });

    if (allText && hasPrice(allText)) {
      return parsePrice(allText);
    }

    // Strategy 5: Check for data attributes
    var priceValue = element.getAttribute('data-price');
    var currencySymbol = element.getAttribute('data-currency-symbol') || '$';
    if (priceValue) {
      return { symbol: currencySymbol, value: parseFloat(priceValue) };
    }

    // Strategy 6: Check img alt text
    var imgEl = element.querySelector('img');
    if (imgEl) {
      var altText = imgEl.getAttribute('alt');
      if (altText && hasPrice(altText)) {
        return parsePrice(altText);
      }
    }

    // Strategy 7: Check aria-label
    var ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel && hasPrice(ariaLabel)) {
      return parsePrice(ariaLabel);
    }

    // Strategy 8: Check parent element for price
    var parent = element.parentElement;
    if (parent) {
      var parentPrice = findPriceInElement(parent);
      if (parentPrice) return parentPrice;
    }

    // Strategy 9: Check a-price-wrapper or similar Amazon containers
    var priceWrapper = element.closest('.a-price, [class*="price"]');
    if (priceWrapper && priceWrapper !== element) {
      var wrapperPrice = findPriceInElement(priceWrapper);
      if (wrapperPrice) return wrapperPrice;
    }

    return null;
  }

  // ============================================
  // Badge & Tooltip Manager
  // ============================================

  var tooltipEl = null;
  var tooltipTimeout = null;
  var hoveredEl = null;
  var hoveredPriceData = null;
  var badgeContainer = null;
  var isExtensionEnabled = true;
  var eventListenersAdded = false;

  function createTooltipElement() {
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.className = 'pth-tooltip';
      document.body.appendChild(tooltipEl);
    }
    return tooltipEl;
  }

  function showTooltip(priceText, workTimeText) {
    var tooltip = createTooltipElement();
    tooltip.innerHTML = '<span class="pth-tooltip-text">' + workTimeText + '</span>';
    tooltip.style.display = 'block';
  }

  function hideTooltip() {
    if (tooltipEl) {
      tooltipEl.style.display = 'none';
    }
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
      tooltipTimeout = null;
    }
  }

  function updateTooltipPosition(x, y) {
    if (!tooltipEl || tooltipEl.style.display === 'none') return;

    var offsetX = 10;
    var offsetY = 25;

    var rect = tooltipEl.getBoundingClientRect();
    var viewportWidth = window.innerWidth;
    var viewportHeight = window.innerHeight;

    if (x + offsetX + rect.width + 10 > viewportWidth) {
      offsetX = -rect.width - 10;
    }
    if (y + offsetY + rect.height + 10 > viewportHeight) {
      offsetY = -rect.height - 10;
    }

    tooltipEl.style.left = (x + offsetX) + 'px';
    tooltipEl.style.top = (y + offsetY) + 'px';
  }

  function scheduleTooltipShow(priceText, workTimeText, price, delay) {
    clearTimeout(tooltipTimeout);
    tooltipTimeout = setTimeout(function() {
      showTooltip(priceText, workTimeText);
    }, delay);
  }

  // ============================================
  // Main Extension Logic
  // ============================================

  var currentSettings = {
    amount: 3000,
    incomeType: 'biweekly',
    hoursPerDay: 8
  };

  function isStrikethrough(element) {
    if (!element) return false;
    try {
      var style = window.getComputedStyle(element);
      if (style.textDecorationLine === 'line-through') return true;
      if (style.textDecoration && style.textDecoration.indexOf('line-through') !== -1) return true;
      var parent = element.parentElement;
      for (var i = 0; i < 3 && parent; i++) {
        var parentStyle = window.getComputedStyle(parent);
        if (parentStyle.textDecorationLine === 'line-through') return true;
        parent = parent.parentElement;
      }
    } catch (e) {}
    return false;
  }

  function isBuyButton(element) {
    if (!element) return false;

    for (var i = 0; i < BUY_BUTTON_SELECTORS.length; i++) {
      if (element.matches(BUY_BUTTON_SELECTORS[i])) return true;
      if (element.closest(BUY_BUTTON_SELECTORS[i])) return true;
    }

    var text = element.textContent.toLowerCase();
    if (text.indexOf('add to cart') !== -1 ||
        text.indexOf('buy now') !== -1 ||
        text.indexOf('add to bag') !== -1 ||
        text.indexOf('checkout') !== -1) {
      return true;
    }

    return false;
  }

  function findPriceForButton(button) {
    var parent = button.parentElement;
    var depth = 0;

    while (parent && depth < 5) {
      var siblings = parent.children;
      for (var i = 0; i < siblings.length; i++) {
        var sibling = siblings[i];
        var priceData = findPriceInElement(sibling);
        if (priceData && priceData.value > 0) {
          return priceData;
        }

        var childElements = sibling.querySelectorAll('*');
        for (var j = 0; j < childElements.length; j++) {
          var child = childElements[j];
          var childPrice = findPriceInElement(child);
          if (childPrice && childPrice.value > 0) {
            return childPrice;
          }
        }
      }

      parent = parent.parentElement;
      depth++;
    }

    return null;
  }

  function handleMouseOver(event) {
    if (!isExtensionEnabled) {
      return;
    }

    var target = event.target;

    if (!target || target.nodeType !== Node.ELEMENT_NODE) return null;

    if (target.classList.contains('pth-tooltip') || target.classList.contains('pth-tooltip-text')) return null;

    if (isStrikethrough(target)) return null;

    var priceData = null;
    var isButton = false;

    console.log('[PTH Debug] === Hover Event ===');
    console.log('[PTH Debug] Target:', target.tagName, target.className || '', 'Text:', target.textContent.trim().substring(0, 50));

    // Check if target has price in its text
    if (hasPrice(target.textContent)) {
      priceData = findPriceInElement(target);
      if (priceData) {
        console.log('[PTH Debug] ✓ Price found in target:', priceData);
      }
    }

    // If not found, check parent elements up to 3 levels
    if (!priceData) {
      var parent = target.parentElement;
      var depth = 0;
      while (parent && depth < 3) {
        console.log('[PTH Debug] Checking parent:', parent.tagName, parent.className || '', 'Text:', parent.textContent.trim().substring(0, 50));
        if (hasPrice(parent.textContent)) {
          priceData = findPriceInElement(parent);
          if (priceData) {
            console.log('[PTH Debug] ✓ Price found in parent (depth ' + depth + '):', priceData);
            break;
          }
        }
        parent = parent.parentElement;
        depth++;
      }
    }

    // Check if it's a buy button
    if (!priceData && isBuyButton(target)) {
      isButton = true;
      priceData = findPriceForButton(target);
      if (priceData) {
        console.log('[PTH Debug] ✓ Price found for button:', priceData);
      }
    }

    if (!priceData || priceData.value <= 0) {
      console.log('[PTH Debug] ✗ No valid price found after all checks');
      return;
    }

    // Debug: Log settings and calculation
    console.log('[PTH Debug] Calculation:', {
      price: priceData.value,
      amount: currentSettings.amount,
      incomeType: currentSettings.incomeType,
      hoursPerDay: currentSettings.hoursPerDay
    });

    // Calculate simple work time for tooltip
    var workTime = calculateWorkTimeSimple(
      priceData.value,
      currentSettings.amount,
      currentSettings.incomeType,
      currentSettings.hoursPerDay
    );

    console.log('[PTH Debug] Result:', workTime);
    console.log('[PTH Debug] === End Hover Event ===\n');

    hoveredEl = target;
    hoveredPriceData = priceData;

    var displayPrice = priceData.symbol + priceData.value.toLocaleString();
    if (isButton) {
      displayPrice = 'Price: ' + displayPrice;
    }

    scheduleTooltipShow(displayPrice, workTime, priceData.value, 100);
  }

  function handleMouseMove(event) {
    if (tooltipEl && tooltipEl.style.display !== 'none') {
      updateTooltipPosition(event.clientX, event.clientY);
    }
  }

  function handleMouseOut(event) {
    if (event.target === hoveredEl) {
      hideTooltip();
      hoveredEl = null;
      hoveredPriceData = null;
    }
  }

  function setupEventListeners() {
    console.log('[PTH] setupEventListeners called, eventListenersAdded =', eventListenersAdded);
    if (eventListenersAdded) {
      console.log('[PTH] Event listeners already added, skipping');
      return;
    }
    document.addEventListener('mouseover', handleMouseOver, true);
    document.addEventListener('mousemove', handleMouseMove, true);
    document.addEventListener('mouseout', handleMouseOut, true);
    eventListenersAdded = true;
    console.log('[PTH] Event listeners added successfully');
  }

  function removeEventListeners() {
    console.log('[PTH] removeEventListeners called, eventListenersAdded =', eventListenersAdded);
    if (!eventListenersAdded) {
      console.log('[PTH] Event listeners already removed, skipping');
      return;
    }
    document.removeEventListener('mouseover', handleMouseOver, true);
    document.removeEventListener('mousemove', handleMouseMove, true);
    document.removeEventListener('mouseout', handleMouseOut, true);
    eventListenersAdded = false;
    console.log('[PTH] Event listeners removed successfully');
  }

  function initializeExtension() {
    createTooltipElement();

    // Load settings from storage
    chrome.storage.sync.get(['amount', 'incomeType', 'hoursPerDay', 'extensionEnabled'], function(result) {
      currentSettings.amount = result.amount || 3000;
      currentSettings.incomeType = result.incomeType || 'biweekly';
      currentSettings.hoursPerDay = result.hoursPerDay || 8;
      isExtensionEnabled = result.extensionEnabled !== false;

      console.log('[PTH] Settings loaded:', {
        amount: currentSettings.amount,
        incomeType: currentSettings.incomeType,
        hoursPerDay: currentSettings.hoursPerDay,
        extensionEnabled: isExtensionEnabled
      });

      if (isExtensionEnabled) {
        setupEventListeners();
      } else {
        console.log('[PTH] Extension is disabled, not adding event listeners');
      }
    });

    // Listen for storage changes
    chrome.storage.onChanged.addListener(function(changes, areaName) {
      if (areaName === 'sync') {
        if (changes.amount) currentSettings.amount = changes.amount.newValue;
        if (changes.incomeType) currentSettings.incomeType = changes.incomeType.newValue;
        if (changes.hoursPerDay) currentSettings.hoursPerDay = changes.hoursPerDay.newValue;

        if (changes.extensionEnabled !== undefined) {
          isExtensionEnabled = changes.extensionEnabled.newValue;
          console.log('[PTH] Extension state changed to:', isExtensionEnabled);

          if (isExtensionEnabled) {
            setupEventListeners();
          } else {
            removeEventListeners();
            hideTooltip();
          }
        }
      }
    });

    // Listen for direct messages from popup (for immediate response)
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
      if (message.action === 'extensionToggled') {
        // Handle extension toggle - immediate update
        isExtensionEnabled = message.enabled;
        console.log('[PTH] Extension toggled via message:', isExtensionEnabled);

        if (isExtensionEnabled) {
          setupEventListeners();
          console.log('[PTH] Event listeners added, tooltip should work now');
        } else {
          removeEventListeners();
          hideTooltip();
          console.log('[PTH] Event listeners removed');
        }
      } else if (message.action === 'settingsUpdated') {
        // Handle settings update - only update settings, don't change enabled state
        currentSettings.amount = message.settings.amount;
        currentSettings.incomeType = message.settings.incomeType;
        currentSettings.hoursPerDay = message.settings.hoursPerDay;

        console.log('[PTH] Settings updated via message:', {
          amount: currentSettings.amount,
          incomeType: currentSettings.incomeType,
          hoursPerDay: currentSettings.hoursPerDay
        });
      }
    });

    console.log('[PTH] Price to Hours initialized');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeExtension);
  } else {
    initializeExtension();
  }
})();
