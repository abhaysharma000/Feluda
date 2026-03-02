document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Flow
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view-container');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const viewId = item.getAttribute('data-view');
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            views.forEach(v => {
                const innerView = v.id === `${viewId}-view`;
                if (innerView) {
                    v.classList.remove('hidden');
                    gsap.fromTo(v, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
                } else {
                    v.classList.add('hidden');
                }
            });
        });
    });

    // 1.2 Google Login Mock/Handler
    window.onGoogleSignIn = function (response) {
        console.log("Encoded JWT ID token: " + response.credential);

        // Decode JWT for Demo (In a real app, this MUST be done on the server)
        try {
            const base64Url = response.credential.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const userData = JSON.parse(jsonPayload);

            // Update UI
            document.getElementById('logged-out-view').classList.add('hidden');
            document.getElementById('logged-in-view').classList.remove('hidden');
            document.getElementById('user-name').innerText = userData.name;
            document.getElementById('user-avatar').src = userData.picture;

            // Trigger a success notification
            const statusDisplay = document.getElementById('status-display');
            if (statusDisplay) {
                statusDisplay.innerHTML = `WELCOME, <span class="text-green-accent">${userData.given_name.toUpperCase()}</span>`;
            }
        } catch (e) {
            console.error("Auth Decode Error", e);
        }
    };

    // 1.5 Mobile Navigation Menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    if (mobileMenuBtn && sidebar && sidebarOverlay) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
            sidebarOverlay.classList.toggle('hidden');
        });

        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.add('-translate-x-full');
            sidebarOverlay.classList.add('hidden');
        });

        // Close menu when clicking nav item
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth < 1024) {
                    sidebar.classList.add('-translate-x-full');
                    sidebarOverlay.classList.add('hidden');
                }
            });
        });
    }

    // 2. Neural Background Animation (The Cinematic Edge)
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 40;

        function resize() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
            }
            draw() {
                ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function init() {
            resize();
            particles = Array.from({ length: particleCount }, () => new Particle());
            animate();
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, i) => {
                p.update();
                p.draw();
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = p.x - particles[j].x;
                    const dy = p.y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.strokeStyle = `rgba(16, 185, 129, ${0.1 * (1 - dist / 100)})`;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resize);
        init();
    }

    // 2.5 Matrix Node Canvas (Specialized 3D Neural Globe)
    const matrixCanvas = document.getElementById('matrix-node-canvas');
    if (matrixCanvas) {
        const mctx = matrixCanvas.getContext('2d');
        let nodes = [];
        let rotation = 0;
        const nodeCount = 120;
        const radius = 220;

        function resizeMatrix() {
            matrixCanvas.width = matrixCanvas.parentElement.offsetWidth;
            matrixCanvas.height = matrixCanvas.parentElement.offsetHeight;
        }

        class MatrixNode {
            constructor(isThreat = false) {
                this.isThreat = isThreat;
                this.phi = Math.random() * Math.PI * 2;
                this.theta = Math.acos((Math.random() * 2) - 1);
                this.size = isThreat ? 3 : 1.5;
                this.pulse = Math.random() * Math.PI;
            }

            project() {
                const currentPhi = this.phi + rotation;
                let x = radius * Math.sin(this.theta) * Math.cos(currentPhi);
                let y = radius * Math.cos(this.theta);
                let z = radius * Math.sin(this.theta) * Math.sin(currentPhi);

                const fov = 600;
                const perspective = fov / (fov + z);

                this.px = (x * perspective) + matrixCanvas.width / 2;
                this.py = (y * perspective) + matrixCanvas.height / 2;
                this.pz = z;
                this.pSize = this.size * perspective;
                this.visible = z < 100;
            }

            draw() {
                if (!this.visible && this.pz > 50) return;
                const alpha = (this.visible ? 0.6 : 0.1) * (0.5 + Math.sin(this.pulse) * 0.5);
                mctx.fillStyle = this.isThreat ? `rgba(239, 68, 68, ${alpha + 0.2})` : `rgba(16, 185, 129, ${alpha})`;
                mctx.beginPath();
                mctx.arc(this.px, this.py, this.pSize, 0, Math.PI * 2);
                mctx.fill();

                if (this.isThreat) {
                    mctx.shadowBlur = 10;
                    mctx.shadowColor = '#ef4444';
                    mctx.strokeStyle = `rgba(239, 68, 68, ${alpha * 0.4})`;
                    mctx.beginPath();
                    mctx.arc(this.px, this.py, this.pSize + 10 * Math.sin(this.pulse), 0, Math.PI * 2);
                    mctx.stroke();
                    mctx.shadowBlur = 0;
                }
                this.pulse += 0.03;
            }
        }

        function initMatrix() {
            resizeMatrix();
            nodes = Array.from({ length: nodeCount }, (_, i) => new MatrixNode(i < 8));
            animateMatrix();
        }

        function animateMatrix() {
            mctx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
            rotation += 0.005;
            nodes.forEach(n => n.project());

            // Draw atmospheric glow
            const glow = mctx.createRadialGradient(matrixCanvas.width / 2, matrixCanvas.height / 2, radius - 30, matrixCanvas.width / 2, matrixCanvas.height / 2, radius + 60);
            glow.addColorStop(0, 'rgba(16, 185, 129, 0)');
            glow.addColorStop(0.5, 'rgba(16, 185, 129, 0.03)');
            glow.addColorStop(1, 'rgba(16, 185, 129, 0)');
            mctx.fillStyle = glow;
            mctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

            mctx.lineWidth = 0.5;
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const n1 = nodes[i];
                    const n2 = nodes[j];
                    if (!n1.visible || !n2.visible) continue;

                    const dx = n1.px - n2.px;
                    const dy = n1.py - n2.py;
                    if (Math.abs(dx) < 60 && Math.abs(dy) < 60) {
                        const opacity = (1 - (Math.sqrt(dx * dx + dy * dy) / 60)) * 0.1;
                        mctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
                        mctx.beginPath();
                        mctx.moveTo(n1.px, n1.py);
                        mctx.lineTo(n2.px, n2.py);
                        mctx.stroke();
                    }
                }
            }
            nodes.forEach(n => n.draw());
            requestAnimationFrame(animateMatrix);
        }

        window.addEventListener('resize', resizeMatrix);
        initMatrix();
    }

    // 3. Charts Initialization
    const trendCtx = document.getElementById('threatTrendChart');
    const pieCtx = document.getElementById('classificationPieChart');

    if (trendCtx && pieCtx) {
        const trendGradient = trendCtx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        trendGradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
        trendGradient.addColorStop(1, 'rgba(16, 185, 129, 0)');

        const mitigatedGradient = trendCtx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        mitigatedGradient.addColorStop(0, 'rgba(239, 68, 68, 0.2)');
        mitigatedGradient.addColorStop(1, 'rgba(239, 68, 68, 0)');

        const threatTrendChart = new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
                datasets: [
                    {
                        label: 'Inbound Anomalies',
                        data: [12, 19, 8, 15, 7, 33, 15],
                        borderColor: '#10b981',
                        borderWidth: 3,
                        pointBackgroundColor: '#10b981',
                        pointBorderColor: '#000',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        fill: true,
                        backgroundColor: trendGradient,
                        tension: 0.4
                    },
                    {
                        label: 'Mitigated Threats',
                        data: [5, 12, 3, 8, 4, 25, 10],
                        borderColor: '#FF3B3B',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        pointRadius: 0,
                        fill: true,
                        backgroundColor: mitigatedGradient,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        align: 'end',
                        labels: { color: '#94a3b8', font: { size: 10, weight: 'bold' }, usePointStyle: true, boxWidth: 6 }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(7, 14, 27, 0.9)',
                        titleColor: '#10b981',
                        bodyColor: '#fff',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            label: (context) => ` ${context.dataset.label}: ${context.raw} Vectors`
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { color: '#475569', font: { size: 10 } } },
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false },
                        ticks: { color: '#475569', font: { size: 10 }, stepSize: 10 }
                    }
                }
            }
        });

        const classificationPieChart = new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: ['Safe', 'Malicious', 'Suspicious'],
                datasets: [{
                    data: [82, 8, 10],
                    backgroundColor: [
                        '#10b981', // Safe
                        '#FF3B3B', // Malicious
                        '#FACC15'  // Suspicious
                    ],
                    hoverBackgroundColor: [
                        '#00ff88',
                        '#ff5555',
                        '#ffdf4d'
                    ],
                    borderWidth: 8,
                    borderColor: '#0a192f',
                    hoverOffset: 15
                }]
            },
            options: {
                cutout: '75%',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: { color: '#94a3b8', font: { size: 11, weight: '500' }, padding: 20, usePointStyle: true, boxWidth: 8 }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(7, 14, 27, 0.9)',
                        padding: 12,
                        callbacks: {
                            label: (context) => ` ${context.label}: ${context.raw}%`
                        }
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    }

    // --- NEW: Data Integration ---

    // 4. Global Stats Sync
    async function fetchStats() {
        try {
            const response = await fetch('/api/analytics/stats');
            const data = await response.json();

            if (data) {
                document.getElementById('total-scanned').innerText = data.total_scanned.toLocaleString();
                document.getElementById('malicious-blocked').innerText = data.malicious_blocked.toLocaleString();
                document.getElementById('suspicious-count').innerText = data.suspicious.toLocaleString();
                document.getElementById('email-phish').innerText = data.email_phish.toLocaleString();

                // Update Hero Panel
                document.getElementById('global-deflection-count').innerText = data.malicious_blocked;
            }
        } catch (e) {
            console.error("Stats sync failed:", e);
        }
    }

    // 5. Audit Log Management
    async function refreshLogs() {
        const tableBody = document.getElementById('logs-table-body');
        if (!tableBody) return;

        tableBody.innerHTML = '<tr><td colspan="5" class="px-8 py-12 text-center text-cyan-accent/50 italic animate-pulse">Synchronizing Neural Audit Logs...</td></tr>';

        try {
            const response = await fetch('/api/analytics/logs');
            const logs = await response.json();

            tableBody.innerHTML = logs.map(log => {
                const isMalicious = log.result?.classification === 'Malicious';
                const isSuspicious = log.result?.classification === 'Suspicious';
                const badgeClass = isMalicious ? 'bg-danger/10 text-danger' : (isSuspicious ? 'bg-warning/10 text-warning' : 'bg-emerald-500/10 text-emerald-500');
                const scoreClass = isMalicious ? 'text-danger' : (isSuspicious ? 'text-warning' : 'text-emerald-400');

                return `
                    <tr class="hover:bg-white/[0.02] transition-colors border-b border-white/5">
                        <td class="px-8 py-4 text-slate-500 font-mono text-xs">${new Date(log.timestamp).toLocaleString()}</td>
                        <td class="px-8 py-4 font-bold text-white">${log._id.substring(0, 8)}</td>
                        <td class="px-8 py-4 text-slate-400 truncate max-w-[200px]" title="${log.input}">${log.input}</td>
                        <td class="px-8 py-4"><span class="${scoreClass} font-bold">${log.result?.risk_score || 0}%</span></td>
                        <td class="px-8 py-4">
                            <span class="px-2 py-0.5 rounded ${badgeClass} text-[10px] font-bold uppercase">
                                ${log.result?.classification || 'Unknown'}
                            </span>
                        </td>
                    </tr>
                `;
            }).join('');
        } catch (e) {
            tableBody.innerHTML = '<tr><td colspan="5" class="px-8 py-12 text-center text-danger/50 italic">Failed to retrieve logs. Check connectivity.</td></tr>';
        }
    }

    // 6. Blacklist Controls
    const blacklistBtn = document.getElementById('blacklist-add-btn');
    const blacklistInput = document.getElementById('blacklist-domain');

    if (blacklistBtn) {
        blacklistBtn.addEventListener('click', async () => {
            const domain = blacklistInput.value.trim();
            if (!domain) return;

            blacklistBtn.disabled = true;
            blacklistBtn.innerText = "DENYING...";

            try {
                const response = await fetch('/api/admin/blacklist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ domain: domain, reason: "Manual Administrator Override" })
                });

                if (response.ok) {
                    blacklistInput.value = "";
                    alert(`Domain ${domain} successfully blacklisted.`);
                    fetchStats(); // Update counters
                }
            } catch (e) {
                alert("Comm failed. Check backend.");
            } finally {
                blacklistBtn.disabled = false;
                blacklistBtn.innerText = "DENY";
            }
        });
    }

    document.getElementById('refresh-logs')?.addEventListener('click', refreshLogs);

    // Initial Load
    fetchStats();
    refreshLogs();

    // 7. Analysis Showcase Logic (GSAP Power)
    const showcaseOverlay = document.getElementById('showcase-overlay');
    const showcaseContent = document.getElementById('showcase-content');
    const globalAnalyzeBtn = document.getElementById('global-analyze-btn');
    const globalSearchInput = document.getElementById('global-search-input');
    const closeShowcase = document.getElementById('close-showcase');

    async function triggerAnalysis(url) {
        if (!url) return;

        // Open Overlay with Animation
        showcaseOverlay.classList.remove('hidden');
        gsap.to(showcaseContent, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' });

        // Reset/Loading State
        const demoOutput = document.getElementById('demo-output-container');
        const scoreVal = document.getElementById('demo-risk-score');
        const scoreRing = document.getElementById('score-ring-path');
        const contributors = document.getElementById('demo-contributors');
        const explanationList = document.getElementById('demo-explanation');
        const badge = document.getElementById('demo-classification-badge');

        scoreVal.innerText = "...";
        scoreRing.style.strokeDashoffset = "552.92";
        contributors.innerHTML = '<div class="h-24 flex items-center justify-center text-cyan-accent/50 italic text-xs animate-pulse">Neural Engine Processing...</div>';
        explanationList.innerHTML = "";
        badge.innerText = "Processing Data Assets...";
        badge.className = "px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest bg-white/5 text-slate-500 border border-white/10";

        try {
            const response = await fetch('/api/scan/url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: url })
            });
            const data = await response.json();
            updateShowcase(data);
        } catch (e) {
            // Mock for demo if offline
            setTimeout(() => {
                updateShowcase({
                    url: url,
                    risk_score: 91.4,
                    classification: "Malicious",
                    top_contributors: ["Domain Age Anomaly", "Excessive Subdomain Depth", "Malicious Pattern Match"],
                    explanation: ["Neural Engine detected high entropy in URL structure", "External threat intel flagged as high priority", "Recent creation date suspicious"],
                    raw_features: { domain_age_days: 2, visual_similarity: 88.5 }
                });
            }, 1800);
        }
    }

    function updateShowcase(data) {
        const score = data.risk_score;
        const color = score > 70 ? '#FF3B3B' : (score > 40 ? '#FACC15' : '#10b981');
        const badgeColor = score > 70 ? 'bg-danger/20 text-danger border-danger/30' : (score > 40 ? 'bg-warning/20 text-warning border-warning/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30');

        // Animate Score Count
        gsap.to({ val: 0 }, {
            val: score, duration: 2, ease: 'expo.out',
            onUpdate: function () {
                document.getElementById('demo-risk-score').innerText = Math.floor(this.targets()[0].val);
                const offset = 552.92 - (552.92 * (this.targets()[0].val / 100));
                document.getElementById('score-ring-path').style.strokeDashoffset = offset;
                document.getElementById('score-ring-path').style.stroke = color;
            }
        });

        const badge = document.getElementById('demo-classification-badge');
        badge.innerText = data.classification.toUpperCase();
        badge.className = `px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest border ${badgeColor}`;

        // Top Contributors (SHAP)
        const contriBox = document.getElementById('demo-contributors');
        contriBox.innerHTML = (data.top_contributors || []).map(c => `
            <div class="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 transition-colors hover:bg-white/10">
                <i class="fas fa-microchip text-xs text-cyan-accent"></i>
                <span class="text-xs font-bold text-white tracking-wide">${c}</span>
            </div>
        `).join('') || '<div class="text-xs text-slate-500">Structural patterns within normal bounds</div>';

        // Explanations
        const explBox = document.getElementById('demo-explanation');
        explBox.innerHTML = (data.explanation || []).map(r => `
            <li class="flex items-start gap-2 opacity-0 -translate-x-4">
                <i class="fas fa-arrow-right text-[8px] mt-1.5 text-slate-600"></i>
                <span class="leading-relaxed">${r}</span>
            </li>
        `).join('');

        // Animate List items in
        gsap.to("#demo-explanation li", { opacity: 1, x: 0, stagger: 0.1, duration: 0.4 });

        document.getElementById('demo-age').innerText = (data.raw_features.domain_age_days || 0) + " Days";
        document.getElementById('demo-visual').innerText = (data.visual_similarity || 0).toFixed(1) + "%";

        // Update Hero Panel Global Status if Malicious
        if (score > 70) {
            updateGlobalStatus("danger");
        }
    }

    function updateGlobalStatus(state) {
        const hero = document.getElementById('hero-panel');
        const statusDisplay = document.getElementById('status-display');
        const statusIcon = document.getElementById('status-icon');

        if (state === "danger") {
            hero.className = "relative overflow-hidden p-8 rounded-[2rem] border border-danger/20 bg-danger/5 shadow-[0_0_50px_rgba(255,59,59,0.2)] transition-all duration-1000";
            statusDisplay.innerHTML = 'AI THREAT STATUS: <span class="text-danger">BREACH ATTEMPTED</span>';
            statusIcon.className = "fas fa-radiation text-3xl text-danger animate-pulse";
            setTimeout(() => updateGlobalStatus("secure"), 10000); // Reset after 10s
        } else {
            hero.className = "relative overflow-hidden p-8 rounded-[2rem] border border-emerald-500/20 bg-emerald-500/5 status-glow-secure transition-all duration-1000";
            statusDisplay.innerHTML = 'AI STATUS: <span class="text-emerald-400">PROTECTED</span>';
            statusIcon.className = "fas fa-shield-check text-3xl text-emerald-400";
        }
    }

    globalAnalyzeBtn.addEventListener('click', () => triggerAnalysis(globalSearchInput.value));
    closeShowcase.addEventListener('click', () => {
        gsap.to(showcaseContent, { scale: 0.9, opacity: 0, duration: 0.4, onComplete: () => showcaseOverlay.classList.add('hidden') });
    });

    // 5. Neural Stream (Live Feed) Logic
    const terminal = document.getElementById('live-terminal');
    const neuralLogs = [
        "Inbound packet analysis: 192.168.1.104 -> Blocked",
        "Neural pattern match detected: Subdomain entropy spike",
        "Credential harvester signature match: 0xAEF42",
        "Cross-referencing database: 1.4B hashes synchronized",
        "Visual similarity engine: Paypal.com (94% match)",
        "Platt Scaling confidence calibrated: 0.992"
    ];

    setInterval(() => {
        if (!document.getElementById('live-feed-view').classList.contains('hidden')) {
            const entry = neuralLogs[Math.floor(Math.random() * neuralLogs.length)];
            const p = document.createElement('p');
            p.className = "text-slate-400 border-l-2 border-slate-800 pl-4 py-1 hover:border-cyan-accent transition-colors cursor-default";
            p.innerHTML = `<span class="text-slate-600 font-bold">[${new Date().toLocaleTimeString()}]</span> <span class="neural-typewriter">${entry}</span>`;
            terminal.prepend(p);

            if (terminal.children.length > 50) terminal.removeChild(terminal.lastChild);
        }
    }, 2000);

    // 6. Simulation Mode Chaos
    const simToggle = document.getElementById('attack-simulation-toggle');
    simToggle.addEventListener('change', () => {
        if (simToggle.checked) {
            updateGlobalStatus("danger");
            // Add chaos to feed
            const chaosInterval = setInterval(() => {
                if (!simToggle.checked) clearInterval(chaosInterval);
                const p = document.createElement('p');
                p.className = "text-danger font-black animate-pulse uppercase tracking-widest text-[10px]";
                p.innerText = "!! CRITICAL: NODE " + Math.floor(Math.random() * 100) + " UNDER ATTACK !!";
                terminal.prepend(p);
            }, 300);
        }
    });

    // 7. Executive Report Logic
    document.getElementById('generate-report-btn').addEventListener('click', () => {
        alert("Preparing High-Fidelity Executive Report PDF...");
        // Reuse existing report logic or trigger window.print()
        window.print();
    });
});
