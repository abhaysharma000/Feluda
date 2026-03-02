importScripts('config.js');
const CONFIG = self.CONFIG;
const API_URL = `${CONFIG.API_BASE_URL}/api/scan/url`;

// ── Scan result cache (per session) ──────────────────────────
const scanCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

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

// ── Navigation interceptor ────────────────────────────────────
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
    if (details.frameId !== 0) return; // Main frame only

    const url = details.url;
    if (
        url.startsWith('chrome://') ||
        url.startsWith('chrome-extension://') ||
        url.startsWith('about:') ||
        url.startsWith('data:')
    ) return;

    // Check cache first
    const cached = getCached(url);
    if (cached) {
        handleScanResult(details.tabId, cached);
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
        });

        if (!response.ok) {
            console.warn(`Feluda backend returned ${response.status} for ${url}`);
            return;
        }

        const result = await response.json();
        setCache(url, result);
        handleScanResult(details.tabId, result);

    } catch (err) {
        console.warn('Feluda: Backend unreachable — skipping real-time scan.');
    }
});

// ── Result handler ────────────────────────────────────────────
function handleScanResult(tabId, result) {
    chrome.storage.local.get(['urlsScanned', 'threatsBlocked'], (data) => {
        const newScanned = (data.urlsScanned || 0) + 1;
        chrome.storage.local.set({ urlsScanned: newScanned });

        // Save last scan result for the popup
        chrome.storage.local.set({
            [`scanResult_${tabId}`]: {
                ...result,
                scannedAt: Date.now(),
            }
        });

        const isMalicious = result.classification === 'Malicious' || result.risk_score >= 65;
        const isSuspicious = result.classification === 'Suspicious' || result.risk_score >= 35;

        if (isMalicious) {
            const newBlocked = (data.threatsBlocked || 0) + 1;
            chrome.storage.local.set({ threatsBlocked: newBlocked });

            const reasons = (result.explanation && result.explanation.length > 0)
                ? encodeURIComponent(result.explanation.join('||'))
                : encodeURIComponent('Feluda AI detected malicious structural patterns.');

            const created = encodeURIComponent(
                (result.raw_features && result.raw_features.domain_creation_date) || 'Unknown'
            );
            const age = (result.raw_features && result.raw_features.domain_age_days) || 0;

            const blockUrl =
                chrome.runtime.getURL('block.html') +
                `?url=${encodeURIComponent(result.url)}` +
                `&score=${result.risk_score}` +
                `&reasons=${reasons}` +
                `&created=${created}` +
                `&age=${age}`;

            chrome.tabs.update(tabId, { url: blockUrl });

        } else if (isSuspicious) {
            const hostname = (() => {
                try { return new URL(result.url).hostname; }
                catch { return result.url; }
            })();

            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon128.png',
                title: 'Feluda AI: Suspicious Site Detected',
                message: `Caution: AI found anomalies on ${hostname}.\nRisk Score: ${result.risk_score}/100`,
                priority: 2,
            });
        }
    });
}

// ── One-time storage initialization ──────────────────────────
chrome.storage.local.get(['threatsBlocked', 'urlsScanned'], (data) => {
    if (data.threatsBlocked === undefined) chrome.storage.local.set({ threatsBlocked: 0 });
    if (data.urlsScanned === undefined) chrome.storage.local.set({ urlsScanned: 0 });
});
