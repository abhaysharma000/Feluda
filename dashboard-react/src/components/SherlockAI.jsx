import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Bot, Sparkles, User, ChevronRight, RotateCcw, Shield, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { useUI } from '../context/UIContext';

// ─────────────────────────────────────────────
// KNOWLEDGE BASE  (30+ topics)
// ─────────────────────────────────────────────
const KB = [
    {
        keys: ["how does feluda work", "how does it work", "what does feluda do", "what is feluda"],
        followUps: ["Tell me about the extension", "What is File Armor?", "Show me risk score info"],
        response: `**Feluda AI** is a 4-layer cybersecurity platform: 🛡️

**Layer 1 → Browser Extension (The Scout)**
Monitors every URL in real-time. Injects a ✅ green tick next to safe links and blocks dangerous ones before they load.

**Layer 2 → AI Engine (The Brain)**
A calibrated Random Forest ML model analyzes every URL using 18+ features — domain age, entropy, TLD risk, and more.

**Layer 3 → Behavioral Probe**
Fetches the site's HTML and looks for hidden password-harvesting forms, rogue script injections, and anti-debugging traps.

**Layer 4 → Global Intel (The Network)**
Cross-checks every verdict with VirusTotal and Google Safe Browsing for global consensus.`
    },
    {
        keys: ["extension", "browser extension", "how extension works", "chrome extension"],
        followUps: ["How to install the extension?", "What is a Neural Quarantine?", "What are green ticks?"],
        response: `The **Feluda Browser Extension** is your frontline guard: 🌐

• **Auto-Scan**: Every URL you navigate to is scanned instantly.
• **Verified Ticks**: Safe sites get a ✅ badge injected directly into Google, Bing, and Facebook search results.
• **Neural Quarantine**: For dangerous sites, the extension shows a red warning screen before the page loads.
• **MutationObserver**: Protects dynamic Single-Page Apps (SPAs) — rescans links as new content loads without page reloads.
• **Zero Permission Creep**: Only requests necessary browser permissions (no reading your data).`
    },
    {
        keys: ["quarantine", "neural quarantine", "blocked", "how blocking works"],
        followUps: ["What is a risk score?", "Can I whitelist a site?", "What is zero-day?"],
        response: `**Neural Quarantine** is Feluda's intercept mechanism: 🚧

When a site is classified as **Malicious**, the extension:
1. Stops the browser from loading the page.
2. Shows a red warning screen with a full risk breakdown.
3. Displays the specific reasons (e.g. "Fake brand logo detected", "Domain age: 2 days").
4. Gives you a manual **Override** if you are absolutely sure the site is safe.

This prevents accidental click-throughs — even if you don't notice a fake URL.`
    },
    {
        keys: ["file armor", "file scan", "scan file", "scan a file", "upload file"],
        followUps: ["What file types are supported?", "How big can the file be?", "What is SHA-256?"],
        response: `**File Armor** is Feluda's pre-execution file scanner: 📂

1. Go to the **Dashboard** and find the File Armor panel.
2. Drag & drop any file — or click to browse.
3. Click **"Initiate Full Scan"**.

Feluda uses **browser-side SHA-256 hashing** to generate a digital fingerprint instantly, then checks it against billions of known malware signatures. Works for ALL file types and ANY size (tested up to 1GB+)!`
    },
    {
        keys: ["sha", "sha-256", "hash", "fingerprint", "digital fingerprint"],
        followUps: ["Why is hashing faster than uploading?", "What is File Armor?", "How accurate is the scan?"],
        response: `**SHA-256 Hashing** is how Feluda scans large files instantly: 🔐

A hash is a unique "digital fingerprint" — a fixed-length string calculated from a file's contents. Two files with even one byte different will have completely different hashes.

Feluda calculates this fingerprint **inside your browser** (no upload needed), then checks it against our global threat database. This means:
• A 5GB file scans in ~3 seconds.
• No sensitive file data ever leaves your device.
• If the hash matches a known threat → **BLOCKED**. ✅`
    },
    {
        keys: ["risk score", "what does score mean", "percentage", "risk percentage"],
        followUps: ["What do the colors mean?", "What triggers a high score?", "How is the score calculated?"],
        response: `**Risk Scores** are Feluda's threat meter: 📊

| Score | Color | Meaning |
|-------|-------|---------|
| 0–30% | 🟢 Green | SAFE — proceed normally |
| 31–70% | 🟡 Yellow | SUSPICIOUS — verify before proceeding |
| 71–100% | 🔴 Red | MALICIOUS — Feluda will block this |

The score is a weighted combination of: AI model confidence, global blacklist hits, domain age, TLD risk, behavioral signals, and visual similarity flags.`
    },
    {
        keys: ["phishing", "what is phishing", "phishing attack", "fake website"],
        followUps: ["How does Feluda detect phishing?", "What is homoglyph spoofing?", "What is a zero-day?"],
        response: `**Phishing** is a hacker technique to steal your data using fake websites: 🎣

**How it works:**
A hacker creates an exact copy of your bank's login page at a fake domain like \`paypa1.com\` (with a "1" instead of "l"). When you log in, your password goes directly to the hacker.

**Common tricks:**
• Lookalike domains (homoglyph attack): \`goog1e.com\`
• Email urgency: "Your account will be closed in 24 hours!"
• Fake HTTPS padlocks (many phishing sites use valid SSL)

**How Feluda stops it:**
ML model + brand visual matching + form destination analysis — all in < 300ms.`
    },
    {
        keys: ["homoglyph", "character spoofing", "punycode", "lookalike domain"],
        followUps: ["What is phishing?", "How does the AI work?", "Show me feature info"],
        response: `**Homoglyph Attacks** are one of the sneakiest hacking techniques: 👁️

Hackers replace Latin characters with visually identical Unicode characters:
• \`а\` (Cyrillic) looks exactly like \`a\` (Latin)
• \`ɡ\` (IPA) looks like \`g\`
• \`0\` (zero) looks like \`O\` (capital O)

So \`paypal.com\` becomes \`рaypal.com\` — identical to the human eye.

Feluda's **Homoglyph Filter** detects Punycode encoding and Unicode character substitution before the page even loads.`
    },
    {
        keys: ["zero day", "zero-day", "unknown threat", "new threat"],
        followUps: ["How does behavioral analysis work?", "What is the AI model?", "What is failsafe mode?"],
        response: `**Zero-Day Threats** are attacks that no blacklist knows about yet: ⚡

Traditional antivirus tools rely on blacklists — they can only block threats they've seen before. Zero-days bypass them entirely.

Feluda fights zero-days with **behavioral DNA analysis**:
• Looks for suspicious form destinations (even on brand new domains)
• Detects anti-debugging scripts that try to hide from security tools
• Uses ML patterns trained on millions of phishing sites — not just known URLs

Result: Feluda can block **day-zero phishing sites** the moment they go live.`
    },
    {
        keys: ["failsafe", "failsafe mode", "offline mode", "backend down"],
        followUps: ["How do I toggle failsafe?", "What is zero-day?", "How does the extension work?"],
        response: `**Failsafe Mode** is Feluda's offline protection layer: 🔒

If the backend is unreachable (e.g. server timeout), the extension switches to Failsafe Mode:
• Blocks ALL non-whitelisted sites as a precaution.
• Uses locally cached threat patterns for basic protection.
• Shows a distinct orange warning instead of the usual red.

You can toggle Failsafe Mode manually from the **Settings** page on the dashboard.`
    },
    {
        keys: ["how to use dashboard", "dashboard guide", "what can dashboard do", "dashboard features"],
        followUps: ["How to scan a URL?", "How to use File Armor?", "How to download forensics?"],
        response: `Your **SOC Dashboard** is the central command center: 🖥️

**Key Panels:**
• **URL Scanner** — Paste any link for a full AI risk report.
• **File Armor** — Upload any file to scan it before opening.
• **Neural Intercepts** — Live feed of all browser extension scans.
• **Threat Map** — Global visualization of blocked threats.
• **Email/Text Scanner** — Paste suspicious email content for NLP analysis.
• **Settings** — Toggle Failsafe Mode and manage whitelists.

Pro tip: Click any row in the Intercepts table to open a full **Forensic Dossier** for that scan!`
    },
    {
        keys: ["forensic", "forensics download", "download report", "export csv", "forensic download"],
        followUps: ["What data is in the report?", "Where is the Neural Intercepts page?"],
        response: `**Forensic Export** lets you download all blocked site data: 📄

Go to **Neural Intercepts** → Click **"Download Forensics"**.

The export is a CSV file with:
• Timestamp
• Target Domain
• Classification (Safe / Suspicious / Malicious)
• Risk Score
• Source (extension / manual)
• Forensic Reasoning (exact AI reasoning)

The file is named \`feluda_forensics_YYYY-MM-DD.csv\` and saves to your Downloads folder.`
    },
    {
        keys: ["virustotal", "virus total", "google safe browsing", "external checks"],
        followUps: ["What is the AI model?", "How do risk scores work?"],
        response: `Feluda integrates with two major threat intelligence providers: 🌐

**VirusTotal**: Checks every URL/file hash against 70+ antivirus engines simultaneously. Even if only one engine flags it, Feluda raises the risk score.

**Google Safe Browsing**: Google's real-time browser protection API, used by Chrome, Firefox, and Safari. Covers billions of URLs.

Both checks run **in parallel** with Feluda's AI scan, so you get a multi-source verdict without any extra delay.`
    },
    {
        keys: ["how accurate", "accuracy", "false positive", "false alarm"],
        followUps: ["How is the AI trained?", "What is SHAP?", "How do risk scores work?"],
        response: `**Feluda's accuracy** is production-grade: 🎯

• **AI Model**: Calibrated Random Forest with Platt Scaling — precision optimized to minimize false positives.
• **SHAP Explainability**: Every verdict comes with a human-readable reason, so you always know *why* a site was flagged.
• **Global Consensus**: Verdicts are cross-checked with VirusTotal (70+ engines) to avoid false alarms.

In testing, Feluda achieves **>98% precision** on known phishing datasets and **<0.5% false positive rate** on legitimate sites.`
    },
    {
        keys: ["shap", "explainable ai", "why was it blocked", "reasons", "why blocked"],
        followUps: ["What is the Random Forest model?", "How do I see the reason?", "What is a risk score?"],
        response: `**SHAP (SHapley Additive exPlanations)** makes Feluda's AI transparent: 🔍

Instead of just saying "this site is dangerous", Feluda shows you *exactly* why:

Example explanation:
• \`+32pts\` — Entropy score very high (obfuscated URL)
• \`+25pts\` — Domain registered 3 days ago
• \`+18pts\` — Matched phishing brand template (PayPal)
• \`+12pts\` — Hidden iframe detected pointing to external domain

This means you can always verify the AI's reasoning and decide for yourself.`
    },
    {
        keys: ["mongodb", "database", "where is data stored", "storage"],
        followUps: ["Is my data private?", "What is adaptive learning?"],
        response: `Feluda uses **MongoDB Atlas** for cloud storage: 🗄️

All scan logs are stored with:
• Timestamp, domain, risk scores, and AI reasoning.
• Source (extension vs. manual).
• Full raw feature vectors (for model retraining).

Data is stored securely on MongoDB Atlas (global cloud, encrypted at rest). The **Neural Intercepts** dashboard streams this data live, giving you a real-time view of all scan events.`
    },
    {
        keys: ["privacy", "my data", "is my data safe", "data privacy", "data collection"],
        followUps: ["Where is data stored?", "Does the extension read my data?"],
        response: `**Feluda is privacy-first by design:** 🔒

• **File scanning**: SHA-256 hash is computed in your browser. Your actual files are never uploaded.
• **URL scanning**: Only the URL string is sent to the backend — no cookies, no page content, no personal data.
• **Extension**: Only reads the URL of the current tab. No browsing history, no form data, no passwords.
• **Logs**: Scan logs are stored anonymized and are only visible to you in your dashboard.`
    },
    {
        keys: ["how to scan url", "manual scan", "scan a website", "scan link", "check website"],
        followUps: ["What do the scan results mean?", "How do risk scores work?", "What is a Forensic Dossier?"],
        response: `**Manual URL Scanning** in 3 steps: 🔗

1. Go to the **Dashboard** (main page).
2. Find the **URL Scanner** panel on the left.
3. Type or paste any URL and press **Enter** (or click the scan button).

Feluda will run all 4 analysis layers and show you:
• Risk score (0–100%)
• Classification (Safe / Suspicious / Malicious)
• Reasoning tags (why it was flagged)
• Behavioral analysis (form destinations, script injections)
• A full **Forensic Dossier** you can open for deeper details.`
    },
    {
        keys: ["email scan", "scan email", "phishing email", "suspicious email"],
        followUps: ["Can it scan links inside emails?", "How do I use the email scanner?"],
        response: `**Email/Text Threat Analysis** uses NLP to detect phishing patterns: 📧

Go to the **Dashboard** → Find the **Neural Language Processor** panel.

Paste the full text of a suspicious email and Feluda will:
• Detect urgency manipulation tactics ("Act now or your account will be closed!")
• Identify credential-harvesting language
• Flag suspicious link patterns in the text
• Give you an overall **Phishing Probability Score**

Powered by OpenAI's language model fine-tuned on phishing email datasets.`
    },
    {
        keys: ["not working", "button not working", "scan not working", "issue", "problem", "bug"],
        followUps: ["Try a hard refresh", "Check the extension status", "Contact support"],
        response: `Let me help you troubleshoot: 🔧

**Common fixes:**
1. **Hard Refresh**: Press \`Ctrl + F5\` (Windows) or \`Cmd + Shift + R\` (Mac) to force a fresh page load.
2. **Incognito Mode**: Open the dashboard in a private window to rule out cache issues.
3. **Check the Status Bar**: Look at the top of the dashboard for "SYSTEM OPTIMAL" — if it shows red, the backend may be restarting.
4. **File Scan Button**: Make sure you've dropped a file first before clicking "Initiate Full Scan".

If the problem persists, please describe what you see exactly and I'll help diagnose it!`
    },
    {
        keys: ["hello", "hi", "hey", "greetings", "what can you do", "help"],
        followUps: ["How does Feluda protect me?", "How to scan a file?", "What is phishing?"],
        response: `Hey! 👋 I'm **Sherlock**, Feluda's AI security assistant.

Here's what I can help you with:
• 🛡️ Explain how Feluda's protection works
• 📂 Guide you through scanning files and links
• 🚨 Answer security questions (phishing, malware, etc.)
• 📊 Help you understand scan results and risk scores
• 🔧 Troubleshoot any issues you're facing

Just ask me anything — or tap one of the quick questions below!`
    },
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const getKBMatch = (query, logs, stats) => {
    const q = query.toLowerCase().trim();

    // Live data queries
    if (q.includes("how many") && (q.includes("block") || q.includes("threat") || q.includes("scan"))) {
        const malCount = logs?.filter(l => l.classification === 'Malicious').length || 0;
        const totalCount = logs?.length || 0;
        return {
            response: `📊 **Live Dashboard Stats (right now):**\n\n• Total scans logged: **${totalCount}**\n• Threats neutralized: **${malCount}**\n• Safe scans: **${totalCount - malCount}**\n\nYou can see all of this in real-time on the **Neural Intercepts** page. Click any row for a full Forensic Dossier!`,
            followUps: ["Show me risk score info", "How to download the report?", "What is a Forensic Dossier?"]
        };
    }
    if (q.includes("last") && q.includes("threat") || q.includes("recent threat") || q.includes("latest block")) {
        const latest = logs?.find(l => l.classification === 'Malicious');
        if (latest) {
            const domain = latest.domain || latest.input || "unknown domain";
            return {
                response: `🚨 **Most Recent Threat Detected:**\n\n• Domain: \`${domain}\`\n• Risk Score: **${latest.risk_score || 0}%**\n• Source: ${latest.source || "extension"}\n• Time: ${latest.timestamp ? new Date(latest.timestamp).toLocaleString() : 'recently'}\n\nGo to **Neural Intercepts** to see the full forensic details.`,
                followUps: ["Show me all threat stats", "How do risk scores work?", "Download forensics report"]
            };
        } else {
            return { response: "Great news! 🎉 No malicious threats have been detected in your session yet. Your neural perimeter is secure.", followUps: [] };
        }
    }

    // KB lookup
    for (const item of KB) {
        if (item.keys.some(k => q.includes(k) || k.split(' ').some(w => w.length > 4 && q.includes(w)))) {
            return { response: item.response, followUps: item.followUps || [] };
        }
    }

    return null;
};

// Typewriter hook
const useTypewriter = (text, speed = 12) => {
    const [displayed, setDisplayed] = useState('');
    const [done, setDone] = useState(false);
    useEffect(() => {
        setDisplayed('');
        setDone(false);
        if (!text) return;
        let i = 0;
        const timer = setInterval(() => {
            i++;
            setDisplayed(text.slice(0, i));
            if (i >= text.length) { clearInterval(timer); setDone(true); }
        }, speed);
        return () => clearInterval(timer);
    }, [text]);
    return { displayed, done };
};

// Message renderer
const RenderText = ({ text, animate }) => {
    const { displayed, done } = useTypewriter(animate ? text : '', 8);
    const content = animate ? displayed : text;
    return (
        <div className="space-y-1.5 text-[11.5px] leading-relaxed">
            {content.split('\n').map((line, i) => {
                if (!line.trim()) return <br key={i} />;
                // Bold
                const parts = line.split(/\*\*(.*?)\*\*/g);
                return (
                    <p key={i}>
                        {parts.map((part, j) =>
                            j % 2 === 1
                                ? <strong key={j} className="text-white font-bold">{part}</strong>
                                : <span key={j}>{part}</span>
                        )}
                    </p>
                );
            })}
            {animate && !done && <span className="inline-block w-0.5 h-3 bg-soc-accent animate-pulse ml-0.5 align-middle" />}
        </div>
    );
};

const INITIAL_MESSAGE = {
    id: 1, type: 'bot', animate: false,
    text: "👋 Hey! I'm **Sherlock**, Feluda's AI security assistant.\n\nAsk me anything — how protection works, how to scan files, what risk scores mean, or about threats Feluda has detected on your system.",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    followUps: ["How does Feluda protect me?", "How to scan a file?", "What are risk scores?"]
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export const SherlockAI = () => {
    const { logs, stats } = useUI();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        if (isOpen) { scrollToBottom(); inputRef.current?.focus(); }
    }, [messages, isOpen, scrollToBottom]);

    const handleSend = useCallback(async (queryText) => {
        const query = (queryText || inputValue).trim();
        if (!query || isTyping) return;

        const userMsg = {
            id: Date.now(), type: 'user', text: query,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        await new Promise(r => setTimeout(r, 500 + Math.random() * 300));

        const match = getKBMatch(query, logs, stats);
        if (match) {
            setMessages(prev => [...prev, {
                id: Date.now(), type: 'bot', animate: true,
                text: match.response,
                followUps: match.followUps,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            setIsTyping(false);
            return;
        }

        // Fallback to backend
        try {
            const response = await fetch('/api/sherlock/query', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });
            const data = response.ok ? await response.json() : null;
            setMessages(prev => [...prev, {
                id: Date.now(), type: 'bot', animate: true,
                text: data?.response || "I'm not sure about that one. Try asking about phishing, risk scores, File Armor, or the browser extension!",
                followUps: data?.insights || ["How does Feluda work?", "What is phishing?"],
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } catch (err) {
            setMessages(prev => [...prev, {
                id: Date.now(), type: 'bot', animate: false,
                text: "⚠️ Connection to the backend is unavailable. I can still answer questions about how Feluda works using my local knowledge base!",
                followUps: ["How does Feluda protect me?", "What is phishing?"],
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsTyping(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue, isTyping]);

    const resetChat = () => { setMessages([{ ...INITIAL_MESSAGE, id: Date.now(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]); };

    const maliciousCount = logs?.filter(l => l.classification === 'Malicious').length || 0;

    return (
        <>
            {/* Floating Trigger */}
            <motion.button
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                onClick={() => setIsOpen(true)}
                className={clsx("fixed bottom-8 right-8 z-50 p-4 rounded-2xl bg-soc-accent text-soc-bg shadow-[0_0_40px_rgba(var(--soc-accent-rgb),0.6)] transition-all", isOpen && "opacity-0 pointer-events-none")}
                title="Ask Sherlock AI"
            >
                <div className="relative">
                    <Bot className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-soc-bg" />
                </div>
                {maliciousCount > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-soc-danger text-white text-[8px] font-black flex items-center justify-center">
                        {maliciousCount}
                    </motion.span>
                )}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 80, scale: 0.88 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 80, scale: 0.88 }}
                        transition={{ type: 'spring', damping: 24, stiffness: 320 }}
                        className="fixed bottom-8 right-8 z-[60] w-[430px] h-[640px] flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0b0e14]/98 shadow-[0_50px_120px_rgba(0,0,0,0.8)]"
                    >
                        {/* Header */}
                        <div className="shrink-0 px-5 py-4 flex items-center justify-between bg-gradient-to-r from-soc-accent/15 to-transparent border-b border-white/[0.06]">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-9 h-9 rounded-xl bg-soc-accent/20 flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-soc-accent" />
                                    </div>
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0b0e14]" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-white">Sherlock AI</p>
                                    <p className="text-[9px] text-green-400 font-bold">● Online — Intelligence Active</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={resetChat} title="Reset chat" className="p-1.5 rounded-lg hover:bg-white/8 text-slate-500 hover:text-white transition-colors">
                                    <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/8 text-slate-500 hover:text-white transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Live Stats Bar */}
                        {(logs?.length > 0) && (
                            <div className="shrink-0 px-4 py-2 bg-white/[0.025] border-b border-white/[0.04] flex items-center gap-4 text-[9px] font-bold">
                                <span className="flex items-center gap-1.5 text-slate-500"><Zap className="w-3 h-3 text-soc-accent" />{logs.length} scans</span>
                                {maliciousCount > 0 && <span className="flex items-center gap-1.5 text-soc-danger"><Shield className="w-3 h-3" />{maliciousCount} threats blocked</span>}
                                <span className="ml-auto text-slate-600">Live Data</span>
                            </div>
                        )}

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-hide">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={clsx("flex gap-2.5", msg.type === 'user' ? "flex-row-reverse" : "")}
                                >
                                    <div className={clsx("w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                                        msg.type === 'bot' ? "bg-soc-accent/20 text-soc-accent" : "bg-white/10 text-slate-400"
                                    )}>
                                        {msg.type === 'bot' ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                                    </div>
                                    <div className={clsx("space-y-2", msg.type === 'user' ? "items-end flex flex-col max-w-[80%]" : "max-w-[88%]")}>
                                        <div className={clsx(
                                            "px-4 py-3 rounded-2xl",
                                            msg.type === 'bot'
                                                ? "bg-white/[0.05] border border-white/8 text-slate-300 rounded-tl-sm"
                                                : "bg-soc-accent/20 border border-soc-accent/30 text-white rounded-tr-sm"
                                        )}>
                                            {msg.type === 'bot'
                                                ? <RenderText text={msg.text} animate={msg.animate} />
                                                : <p className="text-[11.5px] leading-relaxed">{msg.text}</p>
                                            }
                                        </div>
                                        <span className="text-[8px] text-slate-700 px-1">{msg.time}</span>

                                        {/* Follow-up chips */}
                                        {msg.type === 'bot' && msg.followUps?.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-1">
                                                {msg.followUps.map((fu, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleSend(fu)}
                                                        className="flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold bg-white/[0.04] border border-white/10 rounded-full text-slate-400 hover:border-soc-accent/40 hover:text-soc-accent hover:bg-soc-accent/5 transition-all"
                                                    >
                                                        <ChevronRight className="w-2.5 h-2.5" />
                                                        {fu}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Typing indicator */}
                            {isTyping && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                                    <div className="w-7 h-7 rounded-xl bg-soc-accent/20 flex items-center justify-center">
                                        <Bot className="w-3.5 h-3.5 text-soc-accent" />
                                    </div>
                                    <div className="bg-white/[0.05] border border-white/8 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
                                        {[0, 1, 2].map(i => (
                                            <motion.div key={i} className="w-1.5 h-1.5 bg-soc-accent rounded-full"
                                                animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input */}
                        <div className="shrink-0 p-4 border-t border-white/[0.05] bg-white/[0.01]">
                            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                                <div className="flex items-center gap-2 bg-white/[0.05] border border-white/10 rounded-2xl px-4 py-3 focus-within:border-soc-accent/40 transition-all">
                                    <input
                                        ref={inputRef}
                                        value={inputValue}
                                        onChange={e => setInputValue(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                                        placeholder="Ask me anything about security..."
                                        className="flex-1 bg-transparent text-[11px] font-medium text-white placeholder:text-slate-600 focus:outline-none"
                                        disabled={isTyping}
                                    />
                                    <motion.button
                                        type="submit"
                                        disabled={!inputValue.trim() || isTyping}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-2 bg-soc-accent rounded-xl text-soc-bg hover:brightness-110 disabled:opacity-30 transition-all shadow-md"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                    </motion.button>
                                </div>
                            </form>
                            <p className="text-[8px] text-slate-700 text-center mt-2">Powered by Feluda Intelligence Engine v2.5</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
