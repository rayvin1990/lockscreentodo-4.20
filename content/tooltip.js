/**
 * Tooltip Manager Module
 * Creates and manages floating tooltip elements
 */

class TooltipManager {
  constructor() {
    this.currentTooltip = null;
    this.showTimeout = null;
    this.currentElement = null;
  }

  /**
   * Show tooltip at position
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {string} priceText - Original price text
   * @param {string} workTimeText - Calculated work time
   */
  show(x, y, priceText, workTimeText) {
    // Remove existing tooltip
    this.hide();

    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'price-to-hours-tooltip';
    tooltip.innerHTML = `
      <div class="tooltip-price">${priceText}</div>
      <div class="tooltip-divider"></div>
      <div class="tooltip-worktime">≈ ${workTimeText}</div>
    `;

    // Position tooltip
    tooltip.style.left = `${x + 10}px`;
    tooltip.style.top = `${y + 10}px`;

    // Append to body
    document.body.appendChild(tooltip);
    this.currentTooltip = tooltip;

    // Animate in
    setTimeout(() => {
      tooltip.classList.add('tooltip-visible');
    }, 10);
  }

  /**
   * Hide tooltip
   */
  hide() {
    if (this.currentTooltip) {
      const tooltipToRemove = this.currentTooltip;
      this.currentTooltip.classList.remove('tooltip-visible');

      // Remove after animation
      setTimeout(() => {
        if (tooltipToRemove && tooltipToRemove.parentNode) {
          tooltipToRemove.remove();
        }
      }, 200);

      this.currentTooltip = null;
    }
  }

  /**
   * Show tooltip with delay
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {string} priceText - Price text
   * @param {string} workTimeText - Work time text
   * @param {number} delay - Delay in ms
   */
  showDelayed(x, y, priceText, workTimeText, delay = 200) {
    this.clearTimeout();

    this.showTimeout = setTimeout(() => {
      this.show(x, y, priceText, workTimeText);
    }, delay);
  }

  /**
   * Clear pending show timeout
   */
  clearTimeout() {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
  }
}

// Export to global scope for browser
window.TooltipManager = TooltipManager;
