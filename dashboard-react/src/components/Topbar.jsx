import React from 'react';
import { Search, Bell, Monitor, Activity, ShieldAlert, Menu, X, Terminal, Command } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { ProfileDropdown } from './ProfileDropdown';
import { NotificationDropdown } from './NotificationDropdown';
import { motion } from 'framer-motion';

export const Topbar = () => {
    const { isSidebarOpen, setIsSidebarOpen } = useUI();

    return (
        <header className="h-20 border-b border-white/5 bg-soc-bg/[0.95] backdrop-blur-xl sticky top-0 z-40 px-6 lg:px-12 flex items-center justify-between shadow-lg">
            {/* Mobile Menu Toggle */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2.5 -ml-2 mr-4 bg-white/5 rounded-xl border border-white/10 text-slate-400 hover:text-white transition-all overflow-hidden"
            >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Global Search Container */}
            <div className="flex-1 max-w-xl group relative">
                <div className="absolute inset-0 bg-soc-accent/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center">
                    <Search className="absolute left-4 w-4 h-4 text-slate-500 group-focus-within:text-soc-accent transition-colors" />
                    <input
                        type="text"
                        placeholder="Search Intelligence Nodes (⌘ K)..."
                        className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl py-3 pl-12 pr-12 text-sm font-medium focus:outline-none focus:border-soc-accent/20 focus:bg-white/[0.04] transition-all placeholder:text-slate-600 text-white"
                    />
                    <div className="absolute right-4 flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold text-slate-500 uppercase tracking-tighter opacity-60">
                        <Command className="w-2.5 h-2.5" />
                        <span>K</span>
                    </div>
                </div>
            </div>

            {/* Right Action Cluster */}
            <div className="flex items-center gap-6 lg:gap-10 pl-6 lg:pl-12">
                {/* System Vitality - Hidden on mobile */}
                <div className="hidden sm:flex items-center gap-6 pr-6 border-r border-white/5">
                    <div className="flex flex-col items-end gap-0.5">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-soc-success uppercase tracking-widest leading-none">
                            <motion.div
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-1.5 h-1.5 rounded-full bg-soc-success"
                            />
                            System Optimal
                        </div>
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] opacity-50">Cluster_Core_Optimal</span>
                    </div>

                    <div className="flex flex-col items-end gap-0.5">
                        <div className="flex items-center gap-2 text-[10px] font-black text-soc-accent uppercase tracking-[0.2em] leading-none">
                            <Terminal className="w-3 h-3" />
                            Live_Injection
                        </div>
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] opacity-50">Inference_Ready</span>
                    </div>
                </div>

                {/* Badges & Identity */}
                <div className="flex items-center gap-2 lg:gap-4">
                    {/* Zero-Day Alert Badge */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-soc-danger/10 border border-soc-danger/20 rounded-full cursor-help group"
                    >
                        <ShieldAlert className="w-3.5 h-3.5 text-soc-danger group-hover:animate-shake" />
                        <span className="text-[9px] font-bold text-soc-danger uppercase tracking-wider">Zero-Day Shield Active</span>
                    </motion.div>

                    <NotificationDropdown />

                    <div className="w-px h-8 bg-white/5 mx-2" />

                    <ProfileDropdown />
                </div>
            </div>
        </header>
    );
};
