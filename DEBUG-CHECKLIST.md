# Price to Hours - Debug Checklist

## Common Price Recognition Issues

### Issue 1: Split Price Elements
**Amazon structure:**
```html
<span class="a-price">
  <span class="a-price-symbol">$</span>
  <span class="a-price-whole">1,299</span>
  <span class="a-price-fractional">00</span>
</span>
```
**Fix:** Already handled - combines all child text

### Issue 2: Hidden Accessible Price
```html
<span class="a-offscreen">$1,299.00</span>
```
**Fix:** Already handled - checks .a-offscreen first

### Issue 3: Price in Parent/Sibling
```html
<div class="price-block">
  <span class="currency">$</span>
  <span class="amount">1,299</span>
</div>
```
**Fix:** Already handled - checks parent and siblings

### Issue 4: Canvas/Image Price
```html
<canvas id="price-canvas"></canvas>
<img src="price.png" alt="$1,299">
```
**Fix:** Need OCR or alt text parsing

### Issue 5: JavaScript Rendered Price
```html
<span id="price" data-value="129900"></span>
<script>
  document.getElementById('price').textContent = '$1,299.00';
</script>
```
**Fix:** Use MutationObserver or data attributes

## Debug Steps

1. Open Chrome DevTools (F12)
2. Hover over the unrecognized price
3. Check Console for `[PTH Debug]` logs
4. Right-click price element → Inspect
5. Share the HTML structure

## Quick Test Commands

Run in console on Amazon page:
```javascript
// Find all price elements
$$('.a-price, .a-offscreen, [data-price]').forEach(el => {
  console.log(el.className, el.textContent);
});
```
