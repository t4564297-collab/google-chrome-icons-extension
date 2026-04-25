
/**
 * This content script finds and replaces text-based Google Material Icons
 * with actual SVG icons. It's designed to be resilient against modern frameworks
 * like the one used in Gemini, which frequently re-renders components.
 * 
 * Version: 2.9
 * Strategy: "CSS Hiding" with Multi-Icon Detection
 */

let debounceTimer;

/**
 * The main function that initializes all replacement logic.
 * This is called only after confirming the extension is enabled for the site.
 */
function initializeIconReplacer() {
  // Initial run after a short delay to let the page settle.
  setTimeout(runGlobalIconCheck, 500);

  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    // Use a short debounce to batch rapid-fire changes from the framework.
    debounceTimer = setTimeout(runGlobalIconCheck, 150);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  });
  
  // "Safety Net": A persistent check to catch anything the observer misses.
  setInterval(runGlobalIconCheck, 1500);
}

/**
 * The core function that scans the entire document (including shadow DOMs).
 */
function runGlobalIconCheck() {
  findAndReplaceRecursively(document.body);
}

/**
 * Finds an icon name from an element, checking text content and specific attributes.
 * @param {Element} element
 * @returns {string|null} The found icon name or null.
 */
function getIconName(element) {
  // 1. Check common attributes used by frameworks (like Angular Material).
  let name = element.getAttribute('data-mat-icon-name') || element.getAttribute('fonticon');
  if (name) return name.trim().toLowerCase();

  // 2. If no attribute, check the text content.
  name = element.textContent.trim().toLowerCase();
  
  // Sanitize text like " upload files " to "upload_file".
  return name.replace(/\s+/g, '_');
}

/**
 * Replaces text-based icons with SVG icons within a given node.
 * @param {Node} rootNode - The root node to search within (e.g., document.body or a shadow root).
 */
function replaceIconsInNode(rootNode) {
  const iconSelectors = 'mat-icon, .material-icons, .material-symbols-outlined, .material-symbols-rounded, .material-symbols-sharp';
  try {
    // We query without `:not([data-icon-fixed])` to allow re-processing elements
    // if their content is changed by the framework.
    const iconElements = rootNode.querySelectorAll(iconSelectors);

    for (const element of iconElements) {
      const text = getIconName(element);
      
      if (!text) {
        // If it was fixed before, but now has no text, clean up our wrappers.
        if (element.hasAttribute('data-icon-fixed')) {
          element.querySelectorAll('.g-icon-fixer-wrapper').forEach(w => w.remove());
          element.removeAttribute('data-icon-fixed');
        }
        continue;
      }
      
      let textToScan = text;
      const foundIcons = [];

      // Greedily find all matches from the longest key to the shortest.
      for (const key of sortedIconKeys) {
        // Use a regex to find all non-overlapping matches for the current key.
        const regex = new RegExp(key, 'g');
        const matches = textToScan.match(regex);
        if (matches) {
          foundIcons.push(...Array(matches.length).fill(key));
          // Blank out the found matches so they aren't matched again by shorter keys.
          textToScan = textToScan.replace(regex, ' '.repeat(key.length));
        }
      }

      if (foundIcons.length > 0) {
        // This attribute triggers the CSS hiding rule for the original text.
        element.setAttribute('data-icon-fixed', 'true');
        
        // Always remove old wrappers before adding new ones to handle re-renders.
        element.querySelectorAll('.g-icon-fixer-wrapper').forEach(w => w.remove());
        
        // Prepend SVG wrappers in reverse order so they appear in the original order.
        foundIcons.reverse().forEach(iconName => {
          const wrapper = document.createElement('span');
          wrapper.className = 'g-icon-fixer-wrapper';
          wrapper.innerHTML = iconMap[iconName];
          element.prepend(wrapper);
        });
      }
    }
  } catch (e) {
    // Silently catch errors from querying nodes that might be removed during a framework update.
  }
}

/**
 * Recursively traverses the DOM and Shadow DOMs to find and replace icons.
 * @param {Node} rootNode - The starting node for the traversal.
 */
function findAndReplaceRecursively(rootNode) {
  if (!rootNode || typeof rootNode.querySelectorAll !== 'function') {
    return;
  }
  
  replaceIconsInNode(rootNode);

  try {
    const allElements = rootNode.querySelectorAll('*');
    for (const element of allElements) {
      if (element.shadowRoot) {
        findAndReplaceRecursively(element.shadowRoot);
      }
    }
  } catch (e) {
    // Silently ignore errors from protected shadow roots.
  }
}

// --- ANALYSIS FEATURES ---

function analyzePageIcons() {
  const iconSelectors = 'mat-icon, .material-icons, .material-symbols-outlined, .material-symbols-rounded, .material-symbols-sharp';
  const elements = document.querySelectorAll(iconSelectors);
  const stats = {
    supported: {},
    missing: {}
  };

  elements.forEach(element => {
    const name = getIconName(element);
    if (!name) return;

    // Check if it's handled in our map
    if (iconMap[name]) {
      stats.supported[name] = (stats.supported[name] || 0) + 1;
    } else {
      // It's a potential icon name but we don't have an SVG for it
      stats.missing[name] = (stats.missing[name] || 0) + 1;
    }
  });

  showAnalysisModal(stats);
}

function showAnalysisModal(stats) {
  // Remove existing modal if present
  const existing = document.getElementById('g-icon-fixer-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'g-icon-fixer-modal';
  
  const supportedCount = Object.keys(stats.supported).length;
  const missingCount = Object.keys(stats.missing).length;
  
  const missingList = Object.entries(stats.missing)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => `<li style="color: #d32f2f; margin-bottom: 4px;"><strong>${name}</strong> (${count})</li>`)
    .join('');

  const supportedList = Object.entries(stats.supported)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => `<li style="color: #388e3c; margin-bottom: 4px;">${name} (${count})</li>`)
    .join('');

  modal.innerHTML = `
    <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); z-index: 99999; width: 400px; max-width: 90vw; font-family: sans-serif; direction: rtl; text-align: right; max-height: 80vh; display: flex; flex-direction: column;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
        <h3 style="margin: 0; color: #1a73e8;">تقرير الأيقونات</h3>
        <button id="g-icon-fixer-close" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #666;">&times;</button>
      </div>
      
      <div style="overflow-y: auto; flex: 1;">
        ${missingCount > 0 ? `
          <div style="margin-bottom: 20px;">
            <h4 style="margin: 0 0 10px 0; color: #d32f2f; display: flex; align-items: center;">
              ⚠️ أيقونات ناقصة (${missingCount})
              <span style="font-size: 11px; color: #666; margin-right: auto;">(موجودة في الصفحة ولكن غير مدعومة)</span>
            </h4>
            <ul style="list-style: none; padding: 0; margin: 0; background: #fff5f5; padding: 10px; border-radius: 6px;">
              ${missingList}
            </ul>
          </div>
        ` : '<p style="color: #388e3c; text-align: center;">✅ جميع الأيقونات المكتشفة مدعومة!</p>'}

        <div style="opacity: 0.8;">
          <h4 style="margin: 0 0 10px 0; color: #388e3c;">✓ أيقونات مفعلة (${supportedCount})</h4>
          <ul style="list-style: none; padding: 0; margin: 0; font-size: 12px; columns: 2;">
            ${supportedList || '<li style="color: #666">لم يتم العثور على أيقونات.</li>'}
          </ul>
        </div>
      </div>
      
      <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #eee; text-align: center;">
        <button id="g-icon-fixer-ok" style="background: #1a73e8; color: white; border: none; padding: 8px 20px; border-radius: 6px; cursor: pointer;">حسناً</button>
      </div>
    </div>
    <div id="g-icon-fixer-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 99998;"></div>
  `;

  document.body.appendChild(modal);

  const close = () => {
    modal.remove();
  };

  modal.querySelector('#g-icon-fixer-close').onclick = close;
  modal.querySelector('#g-icon-fixer-ok').onclick = close;
  modal.querySelector('#g-icon-fixer-overlay').onclick = close;
}

// --- SCRIPT INITIALIZATION ---

// Register the message listener immediately.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "rescanIcons") {
    runGlobalIconCheck();
    sendResponse({ success: true });
    return true; // Indicates an async response.
  }
  
  if (request.action === "analyzeIcons") {
    analyzePageIcons();
    return true;
  }
});

// Check if the extension is enabled for the current site before running.
const currentOrigin = window.location.origin;
chrome.storage.sync.get('disabledSites', (data) => {
  const disabledSites = data.disabledSites || [];
  if (!disabledSites.includes(currentOrigin)) {
    initializeIconReplacer();
  }
});
