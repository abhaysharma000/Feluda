const processedLinks = new Set();
let isScanning = false;
let linkShieldEnabled = false;

// Initialization: Check if enabled
chrome.storage.local.get(['linkShieldEnabled'], (result) => {
    linkShieldEnabled = result.linkShieldEnabled || false;
    if (linkShieldEnabled) {
        setTimeout(scanPageLinks, 1000);
    }
});

// Listen for toggle updates
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'TOGGLE_LINK_SHIELD') {
        linkShieldEnabled = message.enabled;
        if (linkShieldEnabled) {
            scanPageLinks();
        } else {
            // Remove existing badges if disabled
            document.querySelectorAll('.ps-badge-container').forEach(el => el.remove());
            document.querySelectorAll('.ps-malicious-link, .ps-suspicious-link, .ps-safe-link').forEach(el => {
                el.classList.remove('ps-malicious-link', 'ps-suspicious-link', 'ps-safe-link');
            });
            processedLinks.clear();
        }
    }
});

async function scanPageLinks() {
    if (!linkShieldEnabled || isScanning) return;
    isScanning = true;

    try {
        const hostname = window.location.hostname;
        let links = [];

        // Google Search specific targeting for highest fidelity
        if (hostname.includes('google.')) {
            const searchLinks = document.querySelectorAll('#search a[href^="http"]');
            links = Array.from(searchLinks).filter(link => {
                // Return main result links with an H3 title, avoid internal tools/caches
                return !link.href.includes('google.') && link.querySelector('h3');
            });
        } else {
            // Generic aggressive mode for other pages
            links = Array.from(document.querySelectorAll('a[href^="http"]'));
            links = links.filter(link => !link.href.includes(hostname));
        }

        const newLinks = links.filter(link => !processedLinks.has(link.href)).slice(0, 30);

        for (const link of newLinks) {
            processedLinks.add(link.href);

            // 1. First, inject a "Scanning" placeholder to show the user it's active
            const badgeId = `ps-badge-${Math.random().toString(36).substr(2, 9)}`;
            injectScanningState(link, badgeId);

            try {
                const response = await fetch(`${CONFIG.API_BASE_URL}/api/scan/url`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: link.href })
                });
                const data = await response.json();

                // 2. Update the "Scanning" state with actual result
                updateBadgeWithResult(badgeId, link, data);

                // 3. Notify popup about verified links count
                chrome.runtime.sendMessage({
                    type: 'LINK_VERIFIED',
                    url: link.href,
                    classification: data.classification
                });
            } catch (e) {
                // If failed, remove the scanning badge or set to "Unknown"
                const badge = document.getElementById(badgeId);
                if (badge) badge.remove();
            }
        }
    } finally {
        isScanning = false;
    }
}

function injectScanningState(link, badgeId) {
    const badgeContainer = document.createElement('span');
    badgeContainer.id = badgeId;
    badgeContainer.className = 'ps-badge-container ps-scanning';
    badgeContainer.style.cssText = `
        display: inline-block;
        margin-left: 8px;
        position: relative;
        cursor: wait;
        vertical-align: middle;
        z-index: 1000;
    `;

    const pulse = document.createElement('span');
    pulse.className = 'ps-neural-pulse';

    badgeContainer.appendChild(pulse);

    // Position beside H3 or link
    if (window.location.hostname.includes('google.')) {
        const h3 = link.querySelector('h3');
        if (h3) {
            h3.style.display = 'inline-block';
            h3.insertAdjacentElement('afterend', badgeContainer);
        } else {
            link.insertAdjacentElement('afterend', badgeContainer);
        }
    } else {
        link.insertAdjacentElement('afterend', badgeContainer);
    }
}

function updateBadgeWithResult(badgeId, link, data) {
    const badgeContainer = document.getElementById(badgeId);
    if (!badgeContainer) return;

    // Clear scanning state
    badgeContainer.innerHTML = '';
    badgeContainer.classList.remove('ps-scanning');
    badgeContainer.style.cursor = 'default';

    let color, icon, statusText, linkClass, glowClass;
    if (data.classification === 'Malicious' || data.risk_score >= 65) {
        color = '#ef4444';
        icon = '✕';
        statusText = 'HIGH THREAT DETECTED';
        linkClass = 'ps-malicious-link';
        glowClass = 'ps-glow-red';
    } else if (data.classification === 'Suspicious' || data.risk_score >= 35) {
        color = '#f59e0b';
        icon = '!';
        statusText = 'SUSPICIOUS ORIGIN';
        linkClass = 'ps-suspicious-link';
        glowClass = 'ps-glow-orange';
    } else {
        color = '#10b981';
        icon = '✓';
        statusText = 'VERIFIED SECURE';
        linkClass = 'ps-safe-link';
        glowClass = 'ps-glow-green';
    }

    if (linkClass) link.classList.add(linkClass, glowClass);

    const iconCircle = document.createElement('span');
    iconCircle.className = 'ps-badge-icon';
    iconCircle.style.cssText = `
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background-color: ${color};
        color: white;
        font-size: 10px;
        font-weight: 900;
        box-shadow: 0 0 10px ${color}44;
    `;
    iconCircle.innerText = icon;

    const tooltip = createPremiumTooltip(data, color, icon, statusText);
    badgeContainer.appendChild(iconCircle);
    badgeContainer.appendChild(tooltip);

    // Hover logic
    let timeoutId;
    badgeContainer.addEventListener('mouseenter', () => {
        clearTimeout(timeoutId);
        tooltip.style.display = 'block';
    });
    badgeContainer.addEventListener('mouseleave', () => {
        timeoutId = setTimeout(() => {
            tooltip.style.display = 'none';
        }, 150);
    });
}

function createPremiumTooltip(data, color, icon, statusText) {
    const tooltip = document.createElement('div');
    tooltip.className = 'ps-badge-tooltip';
    tooltip.style.cssText = `
        display: none;
        position: absolute;
        top: 25px;
        left: 0;
        background: rgba(10, 25, 47, 0.95);
        backdrop-filter: blur(10px);
        border: 1px solid ${color}44;
        border-radius: 12px;
        padding: 0;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 20px ${color}22;
        z-index: 999999;
        width: 280px;
        color: #e2e8f0;
        text-align: left;
        overflow: hidden;
    `;

    const header = document.createElement('div');
    header.style.cssText = `
        display: flex;
        background: rgba(255, 255, 255, 0.03);
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    `;

    const iconBox = document.createElement('div');
    iconBox.style.cssText = `
        width: 45px;
        background-color: ${color};
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: bold;
    `;
    iconBox.innerText = icon;

    const titleArea = document.createElement('div');
    titleArea.style.cssText = `padding: 12px 15px;`;
    const titleText = document.createElement('div');
    titleText.style.cssText = `font-size: 11px; font-weight: 800; color: ${color}; letter-spacing: 1px;`;
    titleText.innerText = statusText;

    const urlText = document.createElement('div');
    urlText.style.cssText = `font-size: 10px; color: #64748b; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;`;
    urlText.innerText = new URL(data.url).hostname;

    titleArea.appendChild(titleText);
    titleArea.appendChild(urlText);
    header.appendChild(iconBox);
    header.appendChild(titleArea);

    const body = document.createElement('div');
    body.style.cssText = `padding: 15px;`;

    const scoreRow = document.createElement('div');
    scoreRow.style.cssText = `display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;`;
    scoreRow.innerHTML = `<span style="font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: bold;">Neural Confidence</span> <span style="font-size: 14px; font-weight: 700; color: ${color};">${100 - data.risk_score}%</span>`;
    body.appendChild(scoreRow);

    (data.explanation || ["Neural pattern verified by Feluda AI Engines"]).slice(0, 3).forEach(reason => {
        const row = document.createElement('div');
        row.style.cssText = `font-size: 11px; color: #94a3b8; margin-bottom: 8px; display: flex; gap: 8px;`;
        row.innerHTML = `<i style="color: ${color}; font-size: 8px; margin-top: 4px;">➤</i><span>${reason}</span>`;
        body.appendChild(row);
    });

    const footer = document.createElement('div');
    footer.style.cssText = `padding: 10px 15px; background: rgba(0,0,0,0.2); font-size: 9px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between;`;
    footer.innerHTML = `<span style="font-weight: bold; color: #10b981;">CORE_PROTECTv4</span> <span style="color: #475569;">${new Date().toLocaleTimeString()}</span>`;

    tooltip.appendChild(header);
    tooltip.appendChild(body);
    tooltip.appendChild(footer);
    return tooltip;
}

// Ensure the observer is robust without freezing the browser
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttledScan = debounce(() => {
    scanPageLinks();
}, 2000);

const observer = new MutationObserver((mutations) => {
    let shouldScan = false;
    for (let m of mutations) {
        if (m.addedNodes.length > 0) {
            shouldScan = true;
            break;
        }
    }
    if (shouldScan) throttledScan();
});

observer.observe(document.body, { childList: true, subtree: true });
setTimeout(scanPageLinks, 1000); // Initial scan
console.log("Feluda AI Link Scanner Active");
