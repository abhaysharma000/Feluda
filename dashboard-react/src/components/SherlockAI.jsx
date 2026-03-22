import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Bot, Sparkles, User, HelpCircle, Shield, FileSearch, Globe } from 'lucide-react';
import { clsx } from 'clsx';

const QUICK_REPLIES = [
    { label: "🛡️ How does Feluda protect me?", value: "how does feluda protect me" },
    { label: "📂 How to scan a file?", value: "how do i scan a file" },
    { label: "🔗 How to scan a link?", value: "how do i scan a link" },
    { label: "🚨 What is a phishing attack?", value: "what is phishing" },
    { label: "📊 What do the risk scores mean?", value: "what do risk scores mean" },
    { label: "🔒 What is File Armor?", value: "what is file armor" },
];

const LOCAL_RESPONSES = {
    "how does feluda protect me": "Feluda acts as your personal cybersecurity bodyguard! 🛡️\n\n1. **Browser Extension**: Scans every link you visit in real-time and shows a ✅ green tick for safe sites.\n2. **Neural Block**: If a site is dangerous, it intercepts your browser before the page loads.\n3. **File Armor**: Lets you scan files before opening them — even huge ones!\n4. **SOC Dashboard**: This command center shows you all threats stopped in real-time.",
    "how do i scan a file": "Easy! Here's how to use File Armor: 📂\n\n1. Go to the **Dashboard** page.\n2. Find the **File Armor** panel on the right.\n3. Drag & drop your file OR click to browse.\n4. Click **\"Initiate Full Scan\"**.\n\nFeluda will generate a digital fingerprint of your file and check it against millions of known threats in seconds! Works for files of *any* size.",
    "how do i scan a link": "To manually scan a suspicious URL: 🔗\n\n1. Go to the **Dashboard** page.\n2. Find the **URL Scanner** panel.\n3. Paste your link and press Enter.\n\nFeluda will run a full 4-layer analysis including AI, behavioral probing, and global blacklist checks. You'll get a detailed risk report!",
    "what is phishing": "Phishing is when a hacker creates a **fake website** that looks exactly like a real one (like your bank or Gmail) to steal your password or credit card. 🎣\n\nCommon tricks:\n• Fake domain names like `g00gle.com` instead of `google.com`\n• Emails with scary subject lines urging you to \"click now\"\n• Fake login pages that harvest your credentials\n\nFeluda detects these automatically using AI trained on millions of phishing patterns!",
    "what do risk scores mean": "Risk scores tell you how dangerous a site or file is: 📊\n\n• **0–30% (Green)** → SAFE. No threats detected.\n• **31–70% (Yellow)** → SUSPICIOUS. Proceed with caution.\n• **71–100% (Red)** → MALICIOUS. Feluda will block this automatically.\n\nThe score is calculated using AI, global blacklists, domain age, and behavioral analysis.",
    "what is file armor": "File Armor is Feluda's pre-execution scanner! 🔒\n\nBefore you open any file (PDF, ZIP, EXE, etc.), you can drop it into File Armor. It will:\n\n1. Generate a **SHA-256 fingerprint** of the file in your browser.\n2. Check it against **billions of known threats** in our global database.\n3. Tell you if it's **SAFE** or **MALICIOUS** in seconds.\n\nWorks for files of any size — even 1GB+!",
};

const getLocalResponse = (query) => {
    const q = query.toLowerCase().trim();
    for (const [key, value] of Object.entries(LOCAL_RESPONSES)) {
        if (q.includes(key) || key.split(' ').some(word => word.length > 4 && q.includes(word))) {
            return value;
        }
    }
    return null;
};

const formatMessage = (text) => {
    return text.split('\n').map((line, i) => {
        const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return <p key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: bold || '&nbsp;' }} />;
    });
};

export const SherlockAI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1, type: 'bot',
            text: "👋 Hey! I'm **Sherlock**, your Feluda AI assistant.\n\nI can help you understand security alerts, explain how features work, or answer any questions about threats Feluda has detected. What would you like to know?",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showQuickReplies, setShowQuickReplies] = useState(true);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const addBotMessage = (text) => {
        setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'bot',
            text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setShowQuickReplies(false);
    };

    const handleSend = async (queryText) => {
        const query = queryText || inputValue;
        if (!query.trim() || isTyping) return;

        const userMsg = {
            id: Date.now(),
            type: 'user',
            text: query,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);
        setShowQuickReplies(false);

        // Try local response first for faster UX
        const localReply = getLocalResponse(query);
        if (localReply) {
            await new Promise(r => setTimeout(r, 600));
            addBotMessage(localReply);
            setIsTyping(false);
            return;
        }

        try {
            const response = await fetch('/api/sherlock/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });

            if (response.ok) {
                const data = await response.json();
                addBotMessage(data.response);
            } else {
                addBotMessage("I'm having trouble connecting to the intelligence network right now. Please try again shortly.");
            }
        } catch (err) {
            addBotMessage("Connection error. Please check your network and try again.");
        } finally {
            setIsTyping(false);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleSend(inputValue);
    };

    return (
        <>
            {/* Floating Trigger Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className={clsx(
                    "fixed bottom-8 right-8 z-50 p-4 rounded-2xl bg-soc-accent text-soc-bg shadow-[0_0_30px_rgba(var(--soc-accent-rgb),0.5)] transition-all",
                    isOpen && "opacity-0 pointer-events-none"
                )}
                title="Ask Sherlock AI"
            >
                <div className="relative">
                    <Bot className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping" />
                </div>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.85 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.85 }}
                        transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                        className="fixed bottom-8 right-8 z-[60] w-[420px] h-[620px] glass-panel bg-soc-bg/98 border-soc-accent/20 flex flex-col shadow-[0_40px_100px_rgba(0,0,0,0.7)] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-soc-accent/10 to-transparent shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="p-2 bg-soc-accent/20 rounded-xl">
                                        <Sparkles className="w-4 h-4 text-soc-accent" />
                                    </div>
                                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-soc-bg" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-white leading-none">Sherlock AI</h3>
                                    <span className="text-[9px] font-bold text-green-400 uppercase tracking-wider">● Online — Ready to Help</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => { setMessages([{ id: 1, type: 'bot', text: "👋 Hey! I'm **Sherlock**, your Feluda AI assistant.\n\nI can help you understand security alerts, explain how features work, or answer any questions about threats Feluda has detected. What would you like to know?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]); setShowQuickReplies(true); }}
                                    className="p-1.5 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors text-[8px] font-bold uppercase tracking-widest"
                                    title="Clear chat"
                                >
                                    Clear
                                </button>
                                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                                    <X className="w-4 h-4 text-slate-500 hover:text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={clsx("flex gap-2.5", msg.type === 'user' ? "flex-row-reverse" : "")}
                                >
                                    <div className={clsx(
                                        "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-1",
                                        msg.type === 'bot' ? "bg-soc-accent/15 text-soc-accent" : "bg-white/8 text-slate-400"
                                    )}>
                                        {msg.type === 'bot' ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                                    </div>
                                    <div className={clsx("space-y-1 max-w-[82%]", msg.type === 'user' && "items-end flex flex-col")}>
                                        <div className={clsx(
                                            "px-4 py-3 rounded-2xl text-[11.5px] font-medium leading-relaxed space-y-1",
                                            msg.type === 'bot'
                                                ? "bg-white/[0.04] border border-white/8 text-slate-200 rounded-tl-sm"
                                                : "bg-soc-accent/15 border border-soc-accent/25 text-white rounded-tr-sm"
                                        )}>
                                            {formatMessage(msg.text)}
                                        </div>
                                        <span className="text-[8px] text-slate-600 px-1">{msg.time}</span>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-soc-accent/15 flex items-center justify-center shrink-0">
                                        <Bot className="w-3.5 h-3.5 text-soc-accent animate-pulse" />
                                    </div>
                                    <div className="bg-white/[0.04] border border-white/8 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center h-10">
                                        <div className="w-1.5 h-1.5 bg-soc-accent rounded-full animate-bounce" />
                                        <div className="w-1.5 h-1.5 bg-soc-accent rounded-full animate-bounce delay-100" />
                                        <div className="w-1.5 h-1.5 bg-soc-accent rounded-full animate-bounce delay-200" />
                                    </div>
                                </motion.div>
                            )}

                            {/* Quick Reply Chips */}
                            {showQuickReplies && !isTyping && (
                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 pt-2">
                                    <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold px-1">Quick Questions</p>
                                    <div className="flex flex-wrap gap-2">
                                        {QUICK_REPLIES.map((qr) => (
                                            <button
                                                key={qr.value}
                                                onClick={() => handleSend(qr.value)}
                                                className="px-3 py-1.5 text-[10px] font-bold bg-white/[0.03] border border-white/10 rounded-full text-slate-300 hover:border-soc-accent/40 hover:bg-soc-accent/5 hover:text-white transition-all"
                                            >
                                                {qr.label}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/5 bg-white/[0.01] shrink-0">
                            <form onSubmit={handleFormSubmit}>
                                <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus-within:border-soc-accent/30 transition-all">
                                    <input
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Ask me anything about security..."
                                        className="flex-1 bg-transparent text-[11px] font-medium text-white placeholder:text-slate-600 focus:outline-none"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!inputValue.trim() || isTyping}
                                        className="p-1.5 bg-soc-accent rounded-lg text-soc-bg hover:brightness-110 disabled:opacity-30 transition-all"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </form>
                            <p className="text-[8px] text-slate-700 text-center mt-2 font-medium">Powered by Feluda Intelligence Engine</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};


