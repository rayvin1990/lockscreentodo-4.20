# Price to Hours Extension - Change Log

## v1.9.3 (2026-03-07)

### Bug Fixes
- **Fixed**: Popup error "Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist."
  - Added proper error handling in `notifyAllTabs()` function
  - Content script not loaded in some tabs is now handled gracefully
  - Errors are silently ignored to prevent popup error notifications

### Files Modified
- `popup/popup.js` - Added try-catch and chrome.runtime.lastError check
- `manifest.json` - Updated version to 1.9.3

---

## v1.9.2 (2026-03-07)

### Bug Fix
- **Fixed**: Added missing `calculateWorkTimeSimple` function to `content/content.js`
  - This function was being called but not defined in the file
  - This fix ensures tooltips display correctly when hovering over prices

### Files Modified
- `content/content.js` - Added `calculateWorkTimeSimple` function
- `manifest.json` - Updated version to 1.9.2

### Testing
After reloading the extension:
1. Hover over any price on a webpage
2. You should see a tooltip showing the work time calculation
3. The toggle switch should enable/disable the extension immediately
4. Settings changes should be reflected in tooltips without page refresh

---

## v1.9.1 (Previous Version)

### Features
- Improved work time calculation thresholds
- Added support for weeks display in mid-range values (40-174 hours)
- Better display for values between 2 weeks and 1 month

---

## Quick Start

### Installation
1. Open Chrome browser
2. Go to `chrome://extensions/`
3. Enable "Developer mode" (top right toggle)
4. Click "Load unpacked"
5. Select the `price-to-hours` folder

### Usage
1. Click the extension icon in the toolbar
2. Set your income amount and type (e.g., $3000 biweekly)
3. Set hours per day (default: 8)
4. Use the "Enable Extension" toggle to turn on/off
5. Hover over prices on any webpage to see work time

### Settings
- **Income Amount**: Your income amount (e.g., 3000)
- **Income Type**: Hourly, Daily, Weekly, Biweekly, Monthly, or Yearly
- **Hours per Day**: Your work hours per day (1-24)
- **Enable Extension**: Toggle the extension on/off

---

## Architecture

### Components
1. **manifest.json** - Extension configuration
2. **content/content.js** - Content script that handles tooltips
3. **popup/popup.html** - Settings UI
4. **popup/popup.js** - Settings logic and messaging
5. **styles/tooltip.css** - Tooltip styling

### Message Flow
```
User clicks toggle in popup
    ↓
popup.js saves to chrome.storage.sync
    ↓
popup.js sends message to all tabs
    ↓
content.js receives message
    ↓
content.js adds/removes event listeners
    ↓
Tooltip shown/hidden on hover
```

### Key Functions

#### content.js
- `convertToHourlyRate(amount, incomeType, hoursPerDay)` - Convert any income type to hourly rate
- `calculateWorkTimeSimple(price, amount, incomeType, hoursPerDay)` - Calculate and format work time
- `findPriceInElement(element)` - Find price in DOM element
- `handleMouseOver(event)` - Show tooltip on hover
- `handleMouseOut(event)` - Hide tooltip

#### popup.js
- `saveSettings()` - Save income settings to storage
- `toggleExtension()` - Toggle extension enabled state
- `notifyAllTabs(message)` - Send message to all tabs

---

## Debugging

### Enable Console Logging
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for `[PTH]` prefixed logs

### Common Log Messages
- `[PTH] Price to Hours initialized` - Extension loaded
- `[PTH Debug] ✓ Price found` - Price detected on hover
- `[PTH Debug] Result: ≈ X hours` - Calculation result

### Troubleshooting
If tooltips don't show:
1. Check if extension is enabled (toggle should be on)
2. Check console for errors
3. Try refreshing the page
4. Reload the extension in `chrome://extensions/`

---

## Support
For issues or questions, please provide:
1. Chrome version
2. Extension version (1.9.2)
3. Console logs
4. Test page URL
