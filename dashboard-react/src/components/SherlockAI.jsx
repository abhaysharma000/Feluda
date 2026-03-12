import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, Shield, Zap, Sparkles, User } from 'lucide-react';
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
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        className="fixed bottom-8 right-8 z-[60] w-[400px] h-[600px] glass-panel bg-soc-bg/95 border-soc-accent/20 flex flex-col shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-soc-accent/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-soc-accent/20 rounded-lg">
                                    <Sparkles className="w-4 h-4 text-soc-accent" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-black text-white uppercase tracking-widest leading-none">Sherlock AI</h3>
                                    <span className="text-[8px] font-black text-soc-accent uppercase tracking-tighter">Neural Ingress Active</span>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/5 rounded-full transition-colors">
                                <X className="w-5 h-5 text-slate-500 hover:text-white" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, x: msg.type === 'bot' ? -10 : 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={clsx("flex gap-3", msg.type === 'user' ? "flex-row-reverse" : "")}
                                >
                                    <div className={clsx(
                                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                        msg.type === 'bot' ? "bg-soc-accent/10 text-soc-accent" : "bg-white/5 text-slate-500"
                                    )}>
                                        {msg.type === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                    </div>
                                    <div className="space-y-2 max-w-[80%]">
                                        <div className={clsx(
                                            "p-4 rounded-2xl text-[11px] font-medium leading-relaxed tracking-wide",
                                            msg.type === 'bot' ? "bg-white/[0.03] border border-white/5 text-slate-300" : "bg-soc-accent/10 border border-soc-accent/20 text-white"
                                        )}>
                                            {msg.text}
                                        </div>
                                        {msg.insights && (
                                            <div className="grid grid-cols-2 gap-2">
                                                {msg.insights.map((insight, i) => (
                                                    <div key={i} className="px-2 py-1.5 rounded bg-soc-accent/5 border border-soc-accent/10 text-[8px] font-black text-soc-accent uppercase tracking-widest">
                                                        {insight}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-soc-accent/10 flex items-center justify-center shrink-0">
                                        <Bot className="w-4 h-4 text-soc-accent animate-pulse" />
                                    </div>
                                    <div className="bg-white/[0.03] p-4 rounded-2xl flex gap-1">
                                        <div className="w-1 h-1 bg-soc-accent rounded-full animate-bounce" />
                                        <div className="w-1 h-1 bg-soc-accent rounded-full animate-bounce delay-75" />
                                        <div className="w-1 h-1 bg-soc-accent rounded-full animate-bounce delay-150" />
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-6 border-t border-white/5 bg-white/[0.01]">
                            <div className="relative">
                                <input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Query Sherlock..."
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-5 pr-14 text-[10px] font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-soc-accent/30 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-soc-accent rounded-lg text-soc-bg hover:brightness-110 disabled:opacity-30 transition-all shadow-lg"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
