import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MessageSquare, Send, X, Bot, Shield, 
    Zap, Sparkles, User, Globe as GlobeIcon, 
    FileUp, ShieldAlert 
} from 'lucide-react';
import { clsx } from 'clsx';

export const SherlockAI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: "Systems online. I am Sherlock, your autonomous security assistant. How can I help you secure the perimeter today?", time: 'Now' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isTyping) return;

        const userMsg = { id: Date.now(), type: 'user', text: inputValue, time: 'Now' };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            const response = await fetch('/api/sherlock/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: inputValue })
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(prev => [...prev, { 
                    id: Date.now() + 1, 
                    type: 'bot', 
                    text: data.response, 
                    time: 'Now',
                    insights: data.insights 
                }]);
            } else {
                setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: "Error: Neural connection interrupted. Please try again.", time: 'Now' }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: "Connection error. Backbone is temporarily unreachable.", time: 'Now' }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Floating Trigger */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className={clsx(
                    "fixed bottom-8 right-8 z-50 p-4 rounded-2xl bg-soc-accent text-soc-bg shadow-[0_0_30px_rgba(var(--soc-accent-rgb),0.5)] transition-all",
                    isOpen && "opacity-0 pointer-events-none"
                )}
            >
                <div className="relative">
                    <Bot className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-soc-danger rounded-full animate-ping" />
                </div>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 100, scale: 0.9, filter: 'blur(10px)' }}
                        className="fixed bottom-6 right-6 z-[60] w-[calc(100vw-48px)] sm:w-[420px] h-[600px] glass-panel bg-soc-bg/95 border-soc-accent/20 flex flex-col shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden rounded-3xl"
                    >
                        {/* GUI Terminal Scanline Effect */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

                        {/* Header */}
                        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-soc-accent/[0.03] relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-soc-accent/50 to-transparent" />
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="p-2.5 bg-soc-accent/20 rounded-xl border border-soc-accent/20">
                                        <Sparkles className="w-4 h-4 text-soc-accent" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-soc-success rounded-full border border-soc-bg animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] leading-none">Sherlock Intelligence</h3>
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                        <div className="w-1 h-1 rounded-full bg-soc-accent animate-ping" />
                                        <span className="text-[7px] font-black text-soc-accent uppercase tracking-widest opacity-80">Neural Node Active // Node_01_Alpha</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-xl transition-all group">
                                <X className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide bg-gradient-to-b from-transparent to-black/20">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, x: msg.type === 'bot' ? -15 : 15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className={clsx("flex gap-4", msg.type === 'user' ? "flex-row-reverse" : "")}
                                >
                                    <div className={clsx(
                                        "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-500",
                                        msg.type === 'bot' 
                                            ? "bg-soc-accent/10 text-soc-accent border-soc-accent/20 shadow-[0_0_15px_rgba(45,212,191,0.1)]" 
                                            : "bg-white/5 text-slate-500 border-white/5"
                                    )}>
                                        {msg.type === 'bot' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                    </div>
                                    <div className={clsx("space-y-2 max-w-[85%]", msg.type === 'user' ? "text-right" : "text-left")}>
                                        <div className={clsx(
                                            "p-4 rounded-2xl text-[11px] font-medium leading-relaxed tracking-wide shadow-xl",
                                            msg.type === 'bot' 
                                                ? "bg-white/[0.03] border border-white/5 text-slate-300 rounded-tl-none" 
                                                : "bg-soc-accent/10 border border-soc-accent/30 text-white rounded-tr-none"
                                        )}>
                                            {msg.text}
                                        </div>
                                        {msg.insights && (
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                {msg.insights.map((insight, i) => (
                                                    <div key={i} className="px-3 py-1.5 rounded-lg bg-soc-accent/5 border border-soc-accent/10 text-[7px] font-black text-soc-accent uppercase tracking-[0.15em] hover:bg-soc-accent/10 transition-colors cursor-default">
                                                        {insight}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <span className="text-[7px] font-black text-slate-700 uppercase tracking-widest px-1 block mt-1">{msg.time}</span>
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex gap-4">
                                    <div className="w-9 h-9 rounded-xl bg-soc-accent/10 border border-soc-accent/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(45,212,191,0.1)]">
                                        <Bot className="w-5 h-5 text-soc-accent animate-pulse" />
                                    </div>
                                    <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 bg-soc-accent rounded-full" />
                                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-soc-accent rounded-full" />
                                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-soc-accent rounded-full" />
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Quick Actions */}
                        <div className="px-6 py-3 border-t border-white/5 bg-white/[0.01] flex gap-2 overflow-x-auto scrollbar-hide no-scrollbar">
                            {[
                                { label: 'Analyze URL', icon: GlobeIcon, cmd: 'Help me analyze a URL' },
                                { label: 'Audit Assets', icon: FileUp, cmd: 'Start a file scan' },
                                { label: 'View Threats', icon: ShieldAlert, cmd: 'What are the current top threats?' }
                            ].map((action, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setInputValue(action.cmd);
                                        // Wait a tick then submit? 
                                    }}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-white/5 text-[8px] font-black text-slate-500 uppercase tracking-widest hover:border-soc-accent/40 hover:text-white transition-all whitespace-nowrap"
                                >
                                    <action.icon className="w-2.5 h-2.5" />
                                    {action.label}
                                </button>
                            ))}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-6 pt-2 border-t border-white/5 bg-white/[0.02]">
                            <div className="relative group">
                                <div className="absolute -inset-[1px] bg-gradient-to-r from-soc-accent/20 via-transparent to-soc-accent/20 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                <input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Input Security Query..."
                                    className="w-full bg-black/60 border border-white/10 rounded-2xl py-4.5 pl-6 pr-14 text-[11px] font-black text-white placeholder:text-slate-700 focus:outline-none focus:border-soc-accent/40 transition-all font-mono"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isTyping}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-soc-accent rounded-xl text-soc-bg hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] disabled:opacity-20 transition-all"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="mt-4 flex items-center justify-between opacity-30">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-soc-success" />
                                    <span className="text-[7px] font-black text-white uppercase tracking-widest">Sherlock_v4.5_LTS</span>
                                </div>
                                <span className="text-[7px] font-black text-white uppercase tracking-widest italic">RSA_2048_ENCRYPTED</span>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
