/**
 * Storage Module
 * Manages Chrome Storage API operations
 */

const DEFAULT_SETTINGS = {
  amount: 3000,              // Income amount
  incomeType: 'biweekly',    // hourly, daily, weekly, biweekly, monthly, yearly
  hoursPerDay: 8,            // Work hours per day
  enabled: true              // Extension enabled
};

/**
 * Load settings from storage
 * @param {Function} callback - Callback with settings
 */
function loadSettings(callback) {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (result) => {
    callback(result);
  });
}

/**
 * Save settings to storage
 * @param {Object} settings - Settings to save
 * @param {Function} callback - Optional callback
 */
function saveSettings(settings, callback) {
  chrome.storage.sync.set(settings, () => {
    if (callback) callback();
  });
}

/**
 * Get specific setting
 * @param {string} key - Setting key
 * @param {Function} callback - Callback with value
 */
function getSetting(key, callback) {
  chrome.storage.sync.get([key], (result) => {
    callback(result[key]);
  });
}

/**
 * Get all settings
 * @param {Function} callback - Callback with all settings
 */
function getAllSettings(callback) {
  chrome.storage.sync.get(null, (result) => {
    callback({ ...DEFAULT_SETTINGS, ...result });
  });
}

// Export to global scope for browser
window.loadSettings = loadSettings;
window.saveSettings = saveSettings;
window.getSetting = getSetting;
window.getAllSettings = getAllSettings;
window.DEFAULT_SETTINGS = DEFAULT_SETTINGS;
