import React, { useState } from 'react';
import { Search, Brain, Bell, User, LogOut, ChevronDown, Loader2 } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { useScan } from '../hooks/useScan';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

export const Topbar = () => {
    const { isZeroDayMode, setIsZeroDayMode, isScanning, logs, setActivePage } = useUI();
    const { triggerScan } = useScan();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifyOpen, setIsNotifyOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const profileRef = useOutsideClick(() => setIsProfileOpen(false));
    const notifyRef = useOutsideClick(() => setIsNotifyOpen(false));

    const handleScan = () => {
        if (!searchQuery || isScanning) return;
        triggerScan(searchQuery);
    };

    return (
        <header className="sticky top-0 z-50 px-8 py-4 bg-black/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-6 flex-1 max-w-2xl">
                <div className="relative w-full group hidden sm:block">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-green-accent transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                        placeholder="Inspect domain infrastructure..."
                        className="w-full bg-darkblue-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-28 outline-none focus:border-green-accent/50 focus:bg-white/10 transition-all font-medium text-sm text-slate-200"
                    />
                    <button
                        onClick={handleScan}
                        disabled={isScanning}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-accent text-black hover:bg-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isScanning ? <Loader2 className="w-3 h-3 animate-spin" /> : 'DEEP SCAN'}
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Zero Day Badge */}
                <button
                    onClick={() => setIsZeroDayMode(!isZeroDayMode)}
                    className={clsx(
                        "hidden md:flex items-center px-4 py-2 rounded-full border transition-all duration-500",
                        isZeroDayMode
                            ? "bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                            : "bg-white/5 border-white/10 text-slate-500 opacity-60 hover:opacity-100"
                    )}
                >
                    <Brain className={clsx("w-4 h-4 mr-2", isZeroDayMode && "animate-pulse")} />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Zero-Day Mode</span>
                </button>

                {/* Header Actions */}
                <div className="flex items-center gap-3">
                    {/* Notifications */}
                    <div className="relative" ref={notifyRef}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsNotifyOpen(!isNotifyOpen);
                                setIsProfileOpen(false);
                            }}
                            className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 transition-all text-slate-400 hover:text-white"
                        >
                            <Bell className="w-5 h-5 pointer-events-none" />
                            {logs.some(l => l.verdict === 'Malicious') && (
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-danger rounded-full shadow-neon-red pointer-events-none opacity-100 animate-pulse"></span>
                            )}
                        </button>

                        <AnimatePresence>
                            {isNotifyOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-3 w-80 glass-card bg-navy-950/90 border-white/10 overflow-hidden z-[100] shadow-neon"
                                >
                                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-white">System Alerts</h3>
                                        <span className="text-[8px] font-bold text-slate-500">{logs.length} Total</span>
                                    </div>
                                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                                        {logs.length > 0 ? (
                                            logs.slice(0, 5).map((log) => (
                                                <div
                                                    key={log.id}
                                                    className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
                                                    onClick={() => {
                                                        setActivePage('logs');
                                                        setIsNotifyOpen(false);
                                                    }}
                                                >
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className={clsx(
                                                            "text-[9px] font-bold uppercase",
                                                            log.verdict === 'Malicious' ? "text-danger" : "text-emerald-400"
                                                        )}>{log.verdict} DETECTED</span>
                                                        <span className="text-[8px] text-slate-600 italic">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-300 line-clamp-1 opacity-80 group-hover:opacity-100">{log.vector}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-8 text-center text-xs text-slate-600 italic">No alerts recorded.</div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => {
                                            setActivePage('logs');
                                            setIsNotifyOpen(false);
                                        }}
                                        className="w-full p-3 text-[9px] font-black uppercase tracking-widest text-cyan-accent hover:bg-cyan-accent/10 transition-colors border-t border-white/5"
                                    >
                                        View Full Audit Log
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Profile */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsProfileOpen(!isProfileOpen);
                                setIsNotifyOpen(false);
                            }}
                            className="flex items-center gap-3 bg-white/5 p-1 pr-3 rounded-full border border-white/10 hover:border-white/20 transition-all"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-accent/20 to-cyan-accent/20 border border-green-accent/30 flex items-center justify-center">
                                <User className="w-4 h-4 text-green-accent" />
                            </div>
                            <span className="hidden sm:block text-[10px] font-bold text-slate-300 uppercase tracking-widest max-w-[80px] truncate">Admin User</span>
                            <ChevronDown className={clsx("w-3 h-3 text-slate-500 transition-transform", isProfileOpen && "rotate-180")} />
                        </button>

                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-2 w-48 glass-card border-white/10 overflow-hidden shadow-2xl z-[100]"
                                >
                                    <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-sm transition-all text-slate-300">
                                        <User className="w-4 h-4" />
                                        <span>Identity Profile</span>
                                    </button>
                                    <div className="border-t border-white/5"></div>
                                    <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-sm transition-all text-danger">
                                        <LogOut className="w-4 h-4" />
                                        <span>Terminate Session</span>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
};
