# Price to Hours - Quick Start Guide

## STEP 1: Project File Tree

```
price-to-hours/
├── manifest.json              ✅ Extension config (Manifest V3)
├── content/
│   ├── content.js             ✅ Main content script
│   ├── priceParser.js          ✅ Price extraction logic
│   └── tooltip.js             ✅ Tooltip manager
├── core/
│   ├── calculator.js            ✅ Work hours calculator
│   └── storage.js              ✅ Chrome Storage wrapper
├── popup/
│   ├── popup.html             ✅ Settings page UI
│   ├── popup.css             ✅ Settings page styles
│   └── popup.js              ✅ Settings page logic
├── styles/
│   └── tooltip.css            ✅ Tooltip styles
└── icons/
    └── README.md              ✅ Icon placeholder
```

## STEP 2: Complete Code Files

### 1. manifest.json ✅
```json
{
  "manifest_version": 3,
  "name": "Price to Hours",
  "version": "1.0.0",
  "description": "Convert prices into hours of work instantly",
  "permissions": ["storage"],
  "host_permissions": ["<all_urls>"],
  "action": {
    "default_popup": "popup/popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content/content.js"],
    "css": ["styles/tooltip.css"],
    "run_at": "document_end"
  }],
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

### 2. content/content.js ✅
- Event-driven mouseover detection
- Module loading via chrome.runtime.getURL()
- Settings integration
- Mouseleave handling
- Storage change listener

### 3. content/priceParser.js ✅
- Regex: `/([$£€¥])\s?\d{1,3}(,\d{3})*(\.\d{1,2})?/g`
- Comma support (e.g., $1,299)
- Float parsing
- Exported module interface

### 4. content/tooltip.js ✅
- TooltipManager class
- Delayed show (200ms)
- Smooth fade-in animation
- Black background (#111), white text
- Fixed positioning, max z-index

### 5. core/calculator.js ✅
- Work hours calculation
- Smart time formatting (minutes/hours/workdays/weeks)
- Exported module interface

### 6. core/storage.js ✅
- Chrome Storage wrapper
- Load/Save/Get functions
- Default settings (25/hour)

### 7. popup/* ✅
- **popup.html**: Settings UI with Hourly Rate input and Enable toggle
- **popup.css**: Clean, modern styling
- **popup.js**: Save validation and notification system

### 8. styles/tooltip.css ✅
- Tooltip styles (black bg, white text)
- Fade-in animation (opacity transition)
- High z-index (2147483647)

## STEP 3: How to Load Extension

### Method 1: Chrome Developer Mode

1. Open Chrome
2. Go to `chrome://extensions`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select `C:\Users\57684\price-to-hours` folder
6. Extension should appear in your extensions list

### Method 2: Verify Installation

After loading:
1. Click the extension icon in Chrome toolbar
2. Popup should open
3. Default hourly rate: 25
4. Extension should be enabled by default

## STEP 4: Testing Checklist

### Test 1: Popup Settings
- [ ] Click extension icon
- [ ] Popup opens
- [ ] Change hourly rate to 50
- [ ] Toggle Enable Extension off
- [ ] Click "Save Settings"
- [ ] See "Settings saved ✓" notification

### Test 2: Price Detection
- [ ] Go to https://www.amazon.com
- [ ] Find a product with price (e.g., $299)
- [ ] Hover over the price
- [ ] Wait 200ms
- [ ] Tooltip appears with work time
- [ ] Tooltip shows correct calculation

### Test 3: Enable/Disable
- [ ] Open popup
- [ ] Toggle Enable Extension OFF
- [ ] Hover over price (should NOT show tooltip)
- [ ] Toggle Enable Extension ON
- [ ] Hover over price (should show tooltip again)

### Test 4: Console Errors
- [ ] Press F12 to open DevTools
- [ ] Check Console tab
- [ ] No errors should appear

## STEP 5: Known Limitations (MVP)

The MVP has these limitations:

1. **No Currency Conversion**: All calculations use the raw price number. If you set hourly rate in USD but see prices in GBP, the calculation won't convert between currencies.

2. **Limited Price Formats**: Only supports standard formats like $19, $19.99, $1,299. Complex formats (e.g., "19 USD") may not be detected.

3. **Single Tooltip**: Only one tooltip can appear at a time. Moving mouse rapidly may cause flickering.

4. **No Price Highlighting**: Prices are not highlighted on the page. You need to hover to discover them.

5. **No Analytics**: No usage tracking, no error reporting.

## STEP 6: Icons (Required)

The extension needs 3 icon files:

1. **icon16.png** - 16x16 pixels
2. **icon48.png** - 48x48 pixels
3. **icon128.png** - 128x128 pixels

**Quick Generation**:
1. Visit https://favicon.io/
2. Upload or select ⏱️ emoji
3. Set background color to black (#111)
4. Download all sizes
5. Rename and place in `C:\Users\57684\price-to-hours\icons\`

## Next Steps

After successful testing:

1. **Prepare Chrome Store Submission**
   - Screenshots (1280x800)
   - Store description
   - Privacy policy page

2. **Future Features**
   - Currency conversion
   - Price highlighting
   - Purchase history
   - Analytics dashboard

---

**Project Status: MVP Complete. Ready for testing!**

_Last Updated: 2026-03-06 11:22_
