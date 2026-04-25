
// Initialize storage on first install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ disabledSites: [] });
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getState") {
    chrome.storage.sync.get('disabledSites', (data) => {
      const isDisabled = data.disabledSites.includes(request.origin);
      sendResponse({ isDisabled });
    });
    return true; // Indicates that the response is sent asynchronously
  }

  if (request.action === "toggleSite") {
    chrome.storage.sync.get('disabledSites', (data) => {
      let disabledSites = data.disabledSites || [];
      const origin = request.origin;

      if (disabledSites.includes(origin)) {
        // Enable it by removing from the list
        disabledSites = disabledSites.filter(site => site !== origin);
      } else {
        // Disable it by adding to the list
        disabledSites.push(origin);
      }
      
      chrome.storage.sync.set({ disabledSites }, () => {
         sendResponse({ success: true, isDisabled: disabledSites.includes(origin) });
      });
    });
    return true; // Indicates that the response is sent asynchronously
  }
});