(async function () {
  // Get DOM elements
  const toggleSwitch = document.getElementById('toggleSwitch');
  const status = document.getElementById('status');
  const forceRefreshBtn = document.getElementById('forceRefresh');
  const refreshReminder = document.getElementById('refreshReminder');

  // Load current toggle state
  let isEnabled = true; // Default to enabled
  try {
    const result = await chrome.storage.sync.get(['ytDeclutterEnabled']);
    isEnabled = result.ytDeclutterEnabled !== false; // Default to true if not set
  } catch (e) {
    console.log('Could not load settings:', e);
  }

  // Update UI based on current state
  function updateUI() {
    if (isEnabled) {
      toggleSwitch.classList.add('active');
      status.textContent = 'Extension is ACTIVE - YouTube is decluttered';
      status.style.color = '#4CAF50';
      refreshReminder.classList.remove('show');
    } else {
      toggleSwitch.classList.remove('active');
      status.textContent =
        'Extension is DISABLED - Refresh page for normal YouTube';
      status.style.color = '#f44336';
      refreshReminder.classList.add('show');
    }
  }

  // Initialize UI
  updateUI();

  // Handle toggle click
  toggleSwitch.addEventListener('click', async () => {
    isEnabled = !isEnabled;

    // Save to storage
    try {
      await chrome.storage.sync.set({ ytDeclutterEnabled: isEnabled });
    } catch (e) {
      console.log('Could not save settings:', e);
    }

    // Update UI
    updateUI();

    // Notify content script of change
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tab && /https?:\/\/(www|m)\.youtube\.com\//i.test(tab.url || '')) {
        chrome.tabs.sendMessage(tab.id, {
          type: 'toggleChanged',
          enabled: isEnabled,
        });
      }
    } catch (e) {
      console.log('Could not notify content script:', e);
    }
  });

  // Handle page reload button
  forceRefreshBtn.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tab && /https?:\/\/(www|m)\.youtube\.com\//i.test(tab.url || '')) {
        chrome.tabs.reload(tab.id);
        status.textContent = 'Page reloaded!';
        setTimeout(updateUI, 1000);
        // Close popup after reload to avoid confusion
        setTimeout(() => window.close(), 500);
      }
    } catch (e) {
      console.log('Could not reload tab:', e);
    }
  });
})();
