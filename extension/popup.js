document.addEventListener('DOMContentLoaded', async () => {
    const riskCircle = document.getElementById('risk-circle');
    const riskScore = document.getElementById('risk-score');
    const statusBadge = document.getElementById('status-badge');
    const whyToggle = document.getElementById('why-toggle');
    const whyContent = document.getElementById('why-content');

    // ── 1. "Why" panel toggle ────────────────────────────────
    whyToggle.addEventListener('click', () => {
        const isActive = whyContent.classList.toggle('active');
        const chevron = whyToggle.querySelector('i.fa-chevron-down');
        if (chevron) chevron.style.transform = isActive ? 'rotate(180deg)' : 'rotate(0deg)';
    });

    // ── 2. Link Shield toggle ─────────────────────────────────
    const linkShieldToggle = document.getElementById('link-shield-toggle');
    chrome.storage.local.get(['linkShieldEnabled'], (result) => {
        const isEnabled = result.linkShieldEnabled || false;
        linkShieldToggle.checked = isEnabled;
        updateShieldUI(isEnabled);
    });

    function updateShieldUI(enabled) {
        const statsPanel = document.getElementById('live-scan-stats');
        const shieldStatus = document.getElementById('shield-status');
        if (enabled) {
            if (statsPanel) { statsPanel.classList.remove('hidden'); statsPanel.style.display = 'flex'; }
            if (shieldStatus) { shieldStatus.innerText = 'Neural Mesh Live Sync: Active'; shieldStatus.style.color = '#10b981'; }
        } else {
            if (statsPanel) { statsPanel.classList.add('hidden'); statsPanel.style.display = 'none'; }
            if (shieldStatus) { shieldStatus.innerText = 'Real-time scan inactive'; shieldStatus.style.color = '#64748b'; }
        }
    }

    linkShieldToggle.addEventListener('change', () => {
        const enabled = linkShieldToggle.checked;
        chrome.storage.local.set({ linkShieldEnabled: enabled });
        updateShieldUI(enabled);
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { type: 'TOGGLE_LINK_SHIELD', enabled });
            }
        });
    });

    // ── 3. Load scan result for active tab ──────────────────
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;

    chrome.storage.local.get([`scanResult_${tab.id}`], (data) => {
        const scanData = data[`scanResult_${tab.id}`];
        if (scanData && scanData.risk_score !== undefined) {
            updateUI(scanData.risk_score, scanData.classification, scanData.explanation);
        } else {
            // Graceful default — show safe state while waiting
            simulateInitialScan();
        }
    });

    // ── UI updater ────────────────────────────────────────────
    function updateUI(score, classification, explanation) {
        const circumference = 339;
        const offset = circumference - (score / 100) * circumference;
        riskCircle.style.strokeDashoffset = offset;

        const color = score >= 65
            ? '#ef4444'
            : score >= 35
                ? '#facc15'
                : '#10b981';
        riskCircle.style.stroke = color;

        if (score >= 65) {
            statusBadge.innerText = 'MALICIOUS';
            statusBadge.style.background = 'rgba(239, 68, 68, 0.1)';
            statusBadge.style.color = '#ef4444';
            statusBadge.style.borderColor = 'rgba(239, 68, 68, 0.2)';
        } else if (score >= 35) {
            statusBadge.innerText = 'SUSPICIOUS';
            statusBadge.style.background = 'rgba(250, 204, 21, 0.1)';
            statusBadge.style.color = '#facc15';
            statusBadge.style.borderColor = 'rgba(250, 204, 21, 0.2)';
        } else {
            statusBadge.innerText = 'SAFE';
            statusBadge.style.background = 'rgba(16, 185, 129, 0.1)';
            statusBadge.style.color = '#10b981';
            statusBadge.style.borderColor = 'rgba(16, 185, 129, 0.2)';
        }

        // Animated counter
        let current = 0;
        const target = Math.round(score);
        const interval = setInterval(() => {
            if (current >= target) {
                riskScore.innerText = target;
                clearInterval(interval);
            } else {
                current += Math.max(1, Math.floor((target - current) / 10));
                riskScore.innerText = Math.min(current, target);
            }
        }, 16);

        if (explanation && explanation.length > 0) {
            whyContent.innerHTML = explanation.map(e => `<p style="margin:4px 0">• ${e}</p>`).join('');
        }
    }

    // Gentle idle animation while no scan data available
    function simulateInitialScan() {
        riskScore.innerText = '--';
        statusBadge.innerText = 'SCANNING...';
        statusBadge.style.color = '#64748b';
        statusBadge.style.borderColor = '#64748b44';
    }

    // ── 4. Live link-scan counter ─────────────────────────────
    let vCount = 0;
    let tCount = 0;
    const vEl = document.getElementById('verified-count');
    const tEl = document.getElementById('threat-count');

    chrome.runtime.onMessage.addListener((message) => {
        if (message.type === 'LINK_VERIFIED') {
            vCount++;
            if (message.classification === 'Malicious') tCount++;
            if (vEl) vEl.innerText = vCount;
            if (tEl) tEl.innerText = tCount;
            if (tCount > 0) {
                statusBadge.innerText = 'THREATS ON PAGE';
                statusBadge.style.color = '#ef4444';
                statusBadge.style.borderColor = '#ef4444';
            }
        }
    });
});
