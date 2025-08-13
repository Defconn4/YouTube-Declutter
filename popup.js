(async function () {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab && /https?:\/\/(www|m)\.youtube\.com\//i.test(tab.url || '')) {
      chrome.tabs.sendMessage(tab.id, { type: 'forceClean' });
    }
  } catch (e) {
    // ignore — popup should stay silent
  }
})();
