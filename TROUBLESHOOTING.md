# Troubleshooting

## Quick Fixes

### Tooltip Not Showing

**Check:**
- [ ] Extension is enabled (toggle switch ON)
- [ ] Valid income amount is set
- [ ] Hard refresh the page (`Ctrl + Shift + R`)

---

### Wrong Calculation

**Check:**
- [ ] Pay period type is correct
- [ ] Hours per day is reasonable
- [ ] Price format is supported ($ £ € ¥)

---

### Some Prices Not Detected

**Why:**
- Non-standard formats (e.g., "19 USD")
- Dynamically loaded content (refresh page)
- Images instead of text

---

## Common Issues

### Issue: Extension Icon Not Visible

**Fix:**
1. Click Chrome puzzle icon 🧩
2. Pin "Price to Hours" to toolbar

---

### Issue: Settings Not Saving

**Fix:**
1. Make sure income is a number (no symbols)
2. Click "Save Settings" button
3. Look for "Settings saved ✓" notification

---

### Issue: Tooltips Flickering

**Why:** Rapid mouse movement

**Fix:** Normal behavior. Tooltip has 200ms delay to prevent flicker.

---

### Issue: Slow Page Performance

**Why:** Many prices on page

**Fix:** 
- Disable on specific sites (future feature)
- Or temporarily toggle off extension

---

## Still Having Issues?

**Report on GitHub:**
1. Go to repository Issues tab
2. Click "New Issue"
3. Describe the problem
4. Include:
   - Website URL
   - Screenshot
   - Browser version

---

## Known Limitations (MVP)

| Limitation | Status |
|------------|--------|
| No currency conversion | Planned |
| Limited price formats | Planned |
| Single tooltip at a time | By design |
| No price highlighting | Planned |
| No analytics | By design (privacy) |

---

_Last Updated: 2026-03-07_
