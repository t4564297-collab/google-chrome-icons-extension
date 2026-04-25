
document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggleButton');
  const rescanButton = document.getElementById('rescanButton');
  const analyzeButton = document.getElementById('analyzeButton');
  const siteDisplay = document.getElementById('currentSite');
  let currentOrigin = '';
  let activeTabId = null;

  function updateButtonState(isDisabled) {
    if (isDisabled) {
      toggleButton.textContent = 'تفعيل على هذا الموقع';
      toggleButton.className = 'disabled';
      rescanButton.disabled = true; // Disable rescan if extension is disabled
      analyzeButton.disabled = true;
    } else {
      toggleButton.textContent = 'تعطيل على هذا الموقع';
      toggleButton.className = 'enabled';
      rescanButton.disabled = false;
      analyzeButton.disabled = false;
    }
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0 || !tabs[0].url || !tabs[0].url.startsWith('http')) {
      siteDisplay.textContent = "صفحة غير مدعومة";
      toggleButton.disabled = true;
      rescanButton.disabled = true;
      analyzeButton.disabled = true;
      toggleButton.textContent = 'غير متاح';
      return;
    }
    const tab = tabs[0];
    activeTabId = tab.id;
    currentOrigin = new URL(tab.url).origin;
    siteDisplay.textContent = currentOrigin;

    chrome.runtime.sendMessage({ action: "getState", origin: currentOrigin }, (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        return;
      }
      if (response) {
        updateButtonState(response.isDisabled);
      }
    });
  });

  toggleButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "toggleSite", origin: currentOrigin }, (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        return;
      }
      if (response && response.success) {
        updateButtonState(response.isDisabled);
      }
    });
  });

  rescanButton.addEventListener('click', () => {
    if (activeTabId) {
      rescanButton.disabled = true;
      rescanButton.textContent = '... جارٍ الفحص';

      chrome.tabs.sendMessage(activeTabId, { action: "rescanIcons" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error(`Could not send message: ${chrome.runtime.lastError.message}`);
          rescanButton.textContent = 'خطأ! أعد تحميل الصفحة';
        } else if (response && response.success) {
          rescanButton.textContent = 'تم الفحص بنجاح!';
        } else {
          rescanButton.textContent = 'فشل الفحص';
        }

        setTimeout(() => {
          rescanButton.textContent = 'إعادة فحص الأيقونات';
          chrome.storage.sync.get('disabledSites', (data) => {
             if (!(data.disabledSites || []).includes(currentOrigin)) {
                rescanButton.disabled = false;
             }
          });
        }, 2000);
      });
    }
  });

  analyzeButton.addEventListener('click', () => {
    if (activeTabId) {
      chrome.tabs.sendMessage(activeTabId, { action: "analyzeIcons" });
      window.close(); // Close popup to let user see the modal on page
    }
  });
});
