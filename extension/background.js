importScripts('config.js');
const CONFIG = self.CONFIG;

/**
 * PRODUCTION-GRADE REAL-TIME PHISHING PREVENTION
 * --------------------------------------------
 * This service worker implements an 'Interceptor Partition' pattern.
 * It prevents target pages from loading while an asynchronous neural scan is performed.
 */

// ── State & Caching ──────────────────────────────────────────
const scanCache = new Map(); // Global cache for high-speed lookup
const sessionBypass = new Set(); // URLs user chose to proceed anyway (cleared on reload)
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 min TTL

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

// ── Message Handlers ─────────────────────────────────────────
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'BYPASS_URL') {
        sessionBypass.add(message.url);
        sendResponse({ success: true });
    } else if (message.type === 'CACHE_SAFE_URL') {
        setCache(message.url, message.result);
        sendResponse({ success: true });
    }
    return true; // Keep channel open for async
});

// ── REAL-TIME INTERCEPTION ───────────────────────────────────
/**
 * We use webNavigation.onBeforeNavigate as the primary trigger point.
 * This is the most reliable event to intercept before the request starts.
 */
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    // 1. Only intercept the main frame of any tab
    if (details.frameId !== 0) return;

    const url = details.url;

    // 2. Performance: Skip internal and whitelisted origins
    if (
        url.startsWith('chrome://') ||
        url.startsWith('chrome-extension://') ||
        url.startsWith('about:') ||
        url.startsWith('data:') ||
        url.includes('feluda-sigma.vercel.app')
    ) return;

    // 3. Performance: Skip if user already bypassed this session
    if (sessionBypass.has(url)) return;

    // 4. Caching: Instant allow if already scanned as safe
    const cached = getCached(url);
    if (cached) {
        const riskScore = cached.risk_score || 0;
        const isMalicious = cached.classification === 'Malicious' || riskScore >= 60;
        if (!isMalicious) return; // Proceed normally to destination
    }

    // 5. BLOCKING PHASE & INITIAL SCAN
    // Calculate interceptor URL
    const interceptorUrl = chrome.runtime.getURL('interceptor.html') +
        `?url=${encodeURIComponent(url)}`;

    // Redirect current tab to the internal interceptor
    // This stops the initial network request to the potentially malicious site.
    chrome.tabs.update(details.tabId, { url: interceptorUrl });
});

// ── Statistics Management ─────────────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['threatsBlocked', 'urlsScanned'], (data) => {
        if (data.threatsBlocked === undefined) chrome.storage.local.set({ threatsBlocked: 0 });
        if (data.urlsScanned === undefined) chrome.storage.local.set({ urlsScanned: 0 });
    });
});
