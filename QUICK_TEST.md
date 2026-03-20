# Price to Hours - Quick Testing

## Icon Generation (Do This First!)

Before loading extension, you need 3 icon files:

### Quick Method (1 minute)
1. Visit: https://favicon.io/
2. Upload or select: ⏱️ emoji
3. Set background color: Black (#111)
4. Click Download
5. Download sizes: 16, 48, 128
6. Rename files to: icon16.png, icon48.png, icon128.png
7. Place in: `C:\Users\57684\price-to-hours\icons\`

---

## Load Extension (Chrome)

1. Open Chrome
2. Go to: `chrome://extensions`
3. Toggle ON: "Developer mode" (top right)
4. Click: "Load unpacked"
5. Select folder: `C:\Users\57684\price-to-hours`

---

## Quick Test Checklist

### 1. Settings Test
[ ] Click extension icon → Popup opens
[ ] Change rate to 50 → Click Save → "Settings saved ✓"

### 2. Amazon Test
[ ] Go to amazon.com → Find price $299
[ ] Hover → Wait 200ms → Black tooltip appears
[ ] Shows: "$299" and "≈ 6 hours of work"

### 3. Disable Test
[ ] Open popup → Toggle OFF → Save
[ ] Hover price → No tooltip appears

### 4. Re-enable Test
[ ] Open popup → Toggle ON → Save
[ ] Hover price → Tooltip appears again

### 5. Console Check
[ ] Press F12 → Console tab
[ ] No red errors

---

**Start with icon generation, then load extension!**

_Time: ~5 minutes_
