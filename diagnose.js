// 快速诊断脚本 - 在浏览器控制台运行
// 打开 chrome://extensions 页面，然后在控制台运行此脚本

(function() {
  console.log('=== Price to Hours Extension Diagnostic ===\n');

  // 1. Check if extension is loaded
  const extensions = chrome.runtime.getManifest();
  if (extensions) {
    console.log('✅ Chrome Extension API available');
    console.log('   API Version:', chrome.runtime.getManifest().manifest_version);
  }

  // 2. Check storage
  if (chrome.storage && chrome.storage.sync) {
    console.log('✅ Storage API available');

    chrome.storage.sync.get(['amount', 'incomeType', 'hoursPerDay', 'enabled'], (result) => {
      console.log('\n📋 Current Settings:');
      console.log('   Amount:', result.amount || 3000);
      console.log('   Income Type:', result.incomeType || 'biweekly');
      console.log('   Hours/Day:', result.hoursPerDay || 8);
      console.log('   Enabled:', result.enabled !== false);

      if (!result.enabled) {
        console.log('\n⚠️ WARNING: Extension is DISABLED!');
        console.log('   Please enable in popup settings.');
      }
    });
  } else {
    console.log('❌ Storage API NOT available');
  }

  // 3. Check content script
  setTimeout(() => {
    const tooltip = document.querySelector('.pth-tooltip');
    if (tooltip) {
      console.log('\n✅ Content script loaded');
      console.log('   Tooltip element found');
      console.log('   Display:', tooltip.style.display);
      console.log('   Position:', tooltip.style.left, tooltip.style.top);
    } else {
      console.log('\n⏳ Tooltip element not found yet');
      console.log('   This may mean:');
      console.log('   - Content script not loaded');
      console.log('   - Extension not enabled for this page');
      console.log('   - Page URL not matched');
    }

    // 4. Check for event listeners
    console.log('\n📊 Page Info:');
    console.log('   URL:', window.location.href);
    console.log('   Prices on page:', document.querySelectorAll('.price, .product-price').length);
  }, 500);

  console.log('\n📝 Debug Commands:');
  console.log('   PTH.checkTooltip() - Check tooltip status');
  console.log('   PTH.showSettings() - Show current settings');
  console.log('   PTH.forceEnable() - Force enable extension');

  // Expose debug functions
  window.PTH = {
    checkTooltip: function() {
      const tooltip = document.querySelector('.pth-tooltip');
      if (tooltip) {
        console.log('Tooltip found:', {
          display: tooltip.style.display,
          left: tooltip.style.left,
          top: tooltip.style.top,
          innerHTML: tooltip.innerHTML
        });
      } else {
        console.log('Tooltip not found');
      }
    },

    showSettings: function() {
      chrome.storage.sync.get(['amount', 'incomeType', 'hoursPerDay', 'enabled'], (result) => {
        console.log('Settings:', result);
      });
    },

    forceEnable: function() {
      chrome.storage.sync.set({ enabled: true }, () => {
        console.log('Extension enabled! Reload page to apply.');
      });
    }
  };

  console.log('\n✅ Diagnostic complete!');
})();
