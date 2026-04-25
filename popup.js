document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggleButton');
  const siteDisplay = document.getElementById('currentSite');
  let currentOrigin = '';

  // Function to update the button's appearance and text
  function updateButtonState(isDisabled) {
    if (isDisabled) {
      toggleButton.textContent = 'تفعيل على هذا الموقع';
      toggleButton.className = 'disabled';
    } else {
      toggleButton.textContent = 'تعطيل على هذا الموقع';
      toggleButton.className = 'enabled';
    }
  }

  // Get the current tab's URL to determine the state
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = new URL(tabs[0].url);
    currentOrigin = url.origin;
    siteDisplay.textContent = currentOrigin;

    // Ask the background script for the current state of this site
    chrome.runtime.sendMessage({ action: "getState", origin: currentOrigin }, (response) => {
      updateButtonState(response.isDisabled);
    });
  });

  // Add click listener to the button
  toggleButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "toggleSite", origin: currentOrigin }, (response) => {
      if (response.success) {
        updateButtonState(response.isDisabled);
      }
    });
  });
});
