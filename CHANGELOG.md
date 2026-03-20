# Price to Hours - Changelog v1.3

## Changes from v1.2 to v1.3

### ✨ New Feature: Biweekly Income Option

**Added:** Biweekly income period (default)

**Why:** Biweekly pay is common in the US (every 2 weeks, 26 paychecks per year)

---

### 📊 Updated Income Options

| Option | Default Value | Calculation |
|--------|---------------|-------------|
| Hourly | - | Direct rate |
| Daily | - | ÷ hours/day |
| Weekly | - | ÷ 40 hours |
| **Biweekly** | **$2,000** | **÷ 80 hours** ⭐ |
| Monthly | - | ÷ 173.3 hours |
| Yearly | - | ÷ 2,080 hours |

---

### 🎯 New Defaults

**Default Settings:**
- Income: **$2,000**
- Type: **Biweekly** ⭐
- Hours/Day: **8**

**Effective Hourly Rate:**
```
$2,000 ÷ 80 hours = $25/hour
```

---

### 📁 Modified Files

| File | Change |
|------|--------|
| `popup/popup.html` | Added biweekly option, set as default |
| `popup/popup.js` | Default income: 2000, type: biweekly |
| `content/content.js` | Added biweekly calculation logic |

---

### 🧮 Calculation Logic

**Biweekly:**
```
Biweekly income: $2,000
Work days per 2 weeks: 10 days (5 days × 2)
Hours per 2 weeks: 80 hours (10 × 8)

Hourly rate: $2,000 ÷ 80 = $25/hour
```

**All Periods:**
```
Hourly:   income ÷ 1
Daily:    income ÷ hoursPerDay
Weekly:   income ÷ (5 × hoursPerDay)
Biweekly: income ÷ (10 × hoursPerDay) ← NEW
Monthly:  income ÷ (21.67 × hoursPerDay)
Yearly:   income ÷ (260 × hoursPerDay)
```

---

### 🧪 Testing

**Default Settings Test:**
- [ ] Fresh install shows $2,000 biweekly
- [ ] Effective rate is $25/hour
- [ ] $299 price shows ≈ 12h

**Biweekly Calculation:**
- [ ] Set income: 3000, type: biweekly
- [ ] Hours: 8
- [ ] Hourly rate should be: $37.50
- [ ] $300 price should show: ≈ 8h

---

### 📝 Migration Notes

**For existing users:**
- No automatic migration
- Keep their current settings
- Can manually select biweekly

**For new users:**
- Default: $2,000 biweekly
- Results in $25/hour effective rate

---

**Version:** 1.3.0
**Date:** 2026-03-06
**Status:** Ready for testing
