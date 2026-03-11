import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import {
    Shield,
    LayoutDashboard,
    Terminal,
    Settings,
    Download,
    Cpu,
    Lock
} from 'lucide-react';
import { useUI } from '../context/UIContext';
import { clsx } from 'clsx';

const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard, path: '/' },
    { id: 'logs', label: 'Forensic Audit', icon: Terminal, path: '/logs' },
    { id: 'settings', label: 'SOC Configurations', icon: Settings, path: '/settings' },
];

export const Sidebar = () => {
    const { isSidebarOpen, setIsSidebarOpen } = useUI();
    const location = useLocation();

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            <aside className={clsx(
                "fixed inset-y-0 left-0 z-50 w-72 bg-soc-surface border-r border-white/5 flex flex-col transition-all duration-500 ease-in-out transform lg:translate-x-0 shadow-2xl",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Brand Header */}
                <div className="px-8 pt-10 pb-12">
                    <div className="flex items-center gap-4 group">
                        <div className="relative w-11 h-11 rounded-2xl bg-soc-primary/10 flex items-center justify-center border border-white/10 group-hover:border-soc-accent/50 transition-colors duration-500 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-soc-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Shield className="text-soc-accent w-6 h-6 relative z-10" />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-xl font-black text-white tracking-widest leading-none">
                                FELUDA
                            </h2>
                            <span className="text-[8px] font-black text-soc-accent uppercase tracking-[0.3em] mt-1">Phish_Shield SOC</span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto terminal-scrollbar">
                    <div className="px-4 mb-3 text-[10px] font-bold text-slate-600 uppercase tracking-[0.25em]">Main Operation</div>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                        return (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                className={clsx(
                                    "relative group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 overflow-hidden",
                                    isActive
                                        ? "bg-white/[0.04] text-white"
                                        : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="indicator-line"
                                        initial={{ height: 0 }}
                                        animate={{ height: '60%' }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}

                                <div className={clsx(
                                    "p-1.5 rounded-lg transition-colors",
                                    isActive ? "text-soc-accent" : "text-slate-500 group-hover:text-slate-400"
                                )}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <span className="font-semibold text-xs tracking-wide">
                                    {item.label}
                                </span>

                                {item.id === 'threat-map' && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-soc-danger animate-pulse" />
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="p-8 mt-auto border-t border-white/5 bg-black/20">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col gap-1">
                            <span className="text-[8px] font-black uppercase text-slate-600 tracking-[0.2em]">Engine Status</span>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-soc-success animate-pulse" />
                                <span className="text-[10px] font-black text-white uppercase tracking-tight">PROTECTED</span>
                            </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-soc-success/10 text-soc-success border border-soc-success/20 shadow-lg shadow-soc-success/5">
                            <Lock className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-[8px] font-black text-slate-700 uppercase tracking-[0.3em] italic">
                        <span>Node_01_Alpha</span>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-soc-accent" />
                            <span>v2.5.0_PROD</span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};
