/**
 * Popup Logic for Price to Hours
 *
 * - Enable Extension toggle: Saves and applies immediately when toggled
 * - Save Settings button: Only saves Income Amount, Income Type, Hours per Day
 */

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  setupEventListeners();
});

function loadSettings() {
  chrome.storage.sync.get(['amount', 'incomeType', 'hoursPerDay', 'extensionEnabled'], (result) => {
    // Set values from storage or use defaults
    document.getElementById('amount').value = result.amount || 3000;
    document.getElementById('incomeType').value = result.incomeType || 'biweekly';
    document.getElementById('hoursPerDay').value = result.hoursPerDay || 8;

    // Load extension enabled state - default to true if not set
    const isEnabled = result.extensionEnabled !== false;
    document.getElementById('extensionToggle').checked = isEnabled;

    console.log('[Popup] Settings loaded:', {
      amount: result.amount || 3000,
      incomeType: result.incomeType || 'biweekly',
      hoursPerDay: result.hoursPerDay || 8,
      extensionEnabled: isEnabled
    });
  });
}

function setupEventListeners() {
  // Save button - only saves income settings (red box items)
  document.getElementById('saveBtn').addEventListener('click', saveSettings);

  // Extension toggle - saves and applies immediately when changed
  document.getElementById('extensionToggle').addEventListener('change', toggleExtension);
}

function saveSettings() {
  const amount = parseFloat(document.getElementById('amount').value);
  const incomeType = document.getElementById('incomeType').value;
  const hoursPerDay = parseInt(document.getElementById('hoursPerDay').value, 10);

  // Validate amount
  if (isNaN(amount) || amount <= 0) {
    showNotification('Please enter a valid amount', 'error');
    return;
  }

  // Validate hours per day
  if (isNaN(hoursPerDay) || hoursPerDay <= 0 || hoursPerDay > 24) {
    showNotification('Please enter valid hours per day (1-24)', 'error');
    return;
  }

  // Save income settings to chrome storage
  chrome.storage.sync.set({
    amount,
    incomeType,
    hoursPerDay
  }, () => {
    // Notify all tabs about the settings change
    notifyAllTabs({
      action: 'settingsUpdated',
      settings: { amount, incomeType, hoursPerDay }
    });

    showNotification('Settings saved successfully', 'success');
  });
}

function toggleExtension() {
  const extensionEnabled = document.getElementById('extensionToggle').checked;

  // Save extension enabled state immediately
  chrome.storage.sync.set({
    extensionEnabled
  }, () => {
    // Notify all tabs about the extension state change
    notifyAllTabs({
      action: 'extensionToggled',
      enabled: extensionEnabled
    });

    const message = extensionEnabled ? 'Extension enabled' : 'Extension disabled';
    showNotification(message, 'success');
  });
}

function notifyAllTabs(message) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.url && tab.url.startsWith('http')) {
        // Check for runtime.lastError to avoid "Receiving end does not exist" errors
        try {
          chrome.tabs.sendMessage(tab.id, message, (response) => {
            // Check if there was an error (like no receiver)
            if (chrome.runtime.lastError) {
              // Content script not loaded in this tab yet - this is normal
              // Silently ignore to avoid popup error notifications
              return;
            }
          });
        } catch (e) {
          // Ignore send errors - tab might not have content script
        }
      }
    });
  });
}

function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = 'notification show ' + type;

  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
}
