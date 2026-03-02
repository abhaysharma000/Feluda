import React, { useState } from 'react';
import { Search, Brain, Bell, User, ChevronDown, Loader2 } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { useScan } from '../hooks/useScan';
import { AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { NotificationDropdown } from './NotificationDropdown';
import { ProfileDropdown } from './ProfileDropdown';

export const Topbar = () => {
    const { isZeroDayMode, setIsZeroDayMode, isScanning, logs } = useUI();
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
                        "hidden md:flex items-center px-4 py-2 rounded-full border transition-all duration-500 group",
                        isZeroDayMode
                            ? "bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                            : "bg-white/5 border-white/10 text-slate-500 opacity-60 hover:opacity-100"
                    )}
                >
                    <Brain className={clsx("w-4 h-4 mr-2 transition-transform duration-500", isZeroDayMode ? "animate-pulse scale-110" : "group-hover:scale-110")} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Zero-Day Mode</span>
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
                            className={clsx(
                                "relative w-10 h-10 flex items-center justify-center rounded-xl transition-all",
                                isNotifyOpen ? "bg-white/10 text-white" : "hover:bg-white/5 text-slate-400 hover:text-white"
                            )}
                        >
                            <Bell className="w-5 h-5" />
                            {logs.some(l => l.verdict === 'Malicious') && (
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-danger rounded-full shadow-neon-red animate-pulse"></span>
                            )}
                        </button>

                        <AnimatePresence>
                            {isNotifyOpen && (
                                <NotificationDropdown
                                    isOpen={isNotifyOpen}
                                    onClose={() => setIsNotifyOpen(false)}
                                />
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
                            className="flex items-center gap-3 bg-white/5 p-1 pr-3 rounded-full border border-white/10 hover:border-white/20 transition-all group"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-accent/20 to-cyan-accent/20 border border-green-accent/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                                <User className="w-4 h-4 text-green-accent" />
                            </div>
                            <span className="hidden sm:block text-[10px] font-black text-slate-300 uppercase tracking-widest max-w-[80px] truncate">Admin</span>
                            <ChevronDown className={clsx("w-3 h-3 text-slate-500 transition-transform duration-300", isProfileOpen && "rotate-180")} />
                        </button>

                        <AnimatePresence>
                            {isProfileOpen && (
                                <ProfileDropdown
                                    isOpen={isProfileOpen}
                                    onClose={() => setIsProfileOpen(false)}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
};
