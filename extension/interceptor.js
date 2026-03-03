/**
 * Feluda AI - Real-Time Interception Logic
 * Handles the "Securing Connection" scanning state.
 */

async function performNeuralHandshake() {
    const params = new URLSearchParams(window.location.search);
    const targetUrl = params.get('url');
    const logContainer = document.getElementById('log-container');
    const urlText = document.getElementById('url-text');

    if (!targetUrl) {
        window.location.href = 'chrome://newtab';
        return;
    }

    urlText.textContent = targetUrl;

    const addLog = (msg) => {
        const div = document.createElement('div');
        div.className = 'log-entry';
        div.innerHTML = `<span>></span> ${msg}`;
        logContainer.appendChild(div);
        if (logContainer.children.length > 4) {
            logContainer.removeChild(logContainer.children[0]);
        }
    };

    try {
        addLog('Requesting prediction from neural backbone...');

        // Use the global CONFIG from config.js (loaded in HTML)
        const API_URL = `${self.CONFIG.API_BASE_URL}/api/scan/url`;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: targetUrl })
        });

        if (!response.ok) throw new Error('Network error');

        const result = await response.json();
        addLog('Inference received. Analyzing vector...');

        const riskScore = result.risk_score || 0;
        const isMalicious = result.classification === 'Malicious' || riskScore >= 60;

        // Record scan result in storage for the popup/dashboard
        chrome.storage.local.get(['urlsScanned', 'threatsBlocked'], (data) => {
            const newScanned = (data.urlsScanned || 0) + 1;
            chrome.storage.local.set({ urlsScanned: newScanned });

            if (isMalicious) {
                const newBlocked = (data.threatsBlocked || 0) + 1;
                chrome.storage.local.set({ threatsBlocked: newBlocked });
            }
        });

        // Small delay for cinematic effect if the response was too fast
        await new Promise(r => setTimeout(r, 600));

        if (isMalicious) {
            const reasons = (result.explanation && result.explanation.length > 0)
                ? encodeURIComponent(result.explanation.join('||'))
                : encodeURIComponent('Neural engine detected high-risk deceptive patterns.');

            const warningUrl = chrome.runtime.getURL('warning.html') +
                `?url=${encodeURIComponent(targetUrl)}` +
                `&score=${riskScore}` +
                `&reasons=${reasons}`;

            window.location.href = warningUrl;
        } else {
            // Success! Notify background to cache this URL and allow future navs
            chrome.runtime.sendMessage({
                type: 'CACHE_SAFE_URL',
                url: targetUrl,
                result: result
            }, () => {
                // Redirect to actual destination
                window.location.replace(targetUrl);
            });
        }

    } catch (err) {
        console.error('Feluda: Neural handshake failed.', err);
        addLog('Handshake error. Safety override active.');
        // Fallback: Allow navigation if backend is down to prevent breaking the web
        window.location.replace(targetUrl);
    }
}

// Start handshake on load
document.addEventListener('DOMContentLoaded', performNeuralHandshake);
