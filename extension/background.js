importScripts('config.js');
const CONFIG = self.CONFIG;
const API_URL = `${CONFIG.API_BASE_URL}/api/scan/url`;

// ── State Management ──────────────────────────────────────────
const scanCache = new Map();
const bypassCache = new Set();
const CACHE_TTL_MS = 5 * 60 * 1000;

function getCached(url) {
    const entry = scanCache.get(url);
    if (!entry) return null;
    if (Date.now() - entry.ts > CACHE_TTL_MS) {
        scanCache.delete(url);
        return null;
    }
    return entry.result;
}

function setCache(url, result) {
    scanCache.set(url, { result, ts: Date.now() });
}

// ── Message Listener (Bypass Logic) ───────────────────────────
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'BYPASS_URL') {
        bypassCache.add(message.url);
        sendResponse({ success: true });
    }
});

// ── Navigation Interceptor ────────────────────────────────────
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
    if (details.frameId !== 0) return; // Main frame only

    const url = details.url;

    // Skip system/extension URLs
    if (
        url.startsWith('chrome://') ||
        url.startsWith('chrome-extension://') ||
        url.startsWith('about:') ||
        url.startsWith('data:')
    ) return;

    // Check if user already chose to bypass this specific URL in this session
    if (bypassCache.has(url)) return;

    // Check cache first for immediate decision (<10ms)
    const cached = getCached(url);
    if (cached) {
        handleScanResult(details.tabId, cached);
        return;
    }

    // Real-time async check
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5s timeout for stability

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) return;

        const result = await response.json();
        setCache(url, result);
        handleScanResult(details.tabId, result);

    } catch (err) {
        console.warn('Feluda: Scan timeout or error — defaulting to safe for performance.');
    }
});

// ── Result Handler ────────────────────────────────────────────
function handleScanResult(tabId, result) {
    chrome.storage.local.get(['urlsScanned', 'threatsBlocked'], (data) => {
        const newScanned = (data.urlsScanned || 0) + 1;
        chrome.storage.local.set({ urlsScanned: newScanned });

        chrome.storage.local.set({
            [`scanResult_${tabId}`]: {
                ...result,
                scannedAt: Date.now(),
            }
        });

        const riskScore = result.risk_score || 0;
        const isMalicious = result.classification === 'Malicious' || riskScore >= 60;
        const isSuspicious = result.classification === 'Suspicious' || (riskScore >= 35 && riskScore < 60);

        if (isMalicious) {
            const newBlocked = (data.threatsBlocked || 0) + 1;
            chrome.storage.local.set({ threatsBlocked: newBlocked });

            const reasons = (result.explanation && result.explanation.length > 0)
                ? encodeURIComponent(result.explanation.join('||'))
                : encodeURIComponent('Neural engine detected high-risk deceptive patterns.');

            // Use warning.html for real-time interception
            const warningUrl =
                chrome.runtime.getURL('warning.html') +
                `?url=${encodeURIComponent(result.url)}` +
                `&score=${riskScore}` +
                `&reasons=${reasons}`;

            chrome.tabs.update(tabId, { url: warningUrl });

        } else if (isSuspicious) {
            const hostname = (() => {
                try { return new URL(result.url).hostname; }
                catch { return result.url; }
            })();

            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon128.png',
                title: 'Feluda: Suspicious Origin',
                message: `Caution: Neural anomalies found on ${hostname}.\nRisk Score: ${riskScore}/100`,
                priority: 2,
            });
        }
    });
}

// ── Initialization ────────────────────────────────────────────
chrome.storage.local.get(['threatsBlocked', 'urlsScanned'], (data) => {
    if (data.threatsBlocked === undefined) chrome.storage.local.set({ threatsBlocked: 0 });
    if (data.urlsScanned === undefined) chrome.storage.local.set({ urlsScanned: 0 });
});
