import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import {
    Shield,
    LayoutDashboard,
    Globe2,
    Activity,
    Terminal,
    Settings,
    Download,
    Cpu,
    Zap,
    CircleStop
} from 'lucide-react';
import { useUI } from '../context/UIContext';
import { clsx } from 'clsx';

const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'threat-map', label: 'Threat Matrix', icon: Globe2, path: '/threat-map' },
    { id: 'live-feed', label: 'Neural Log', icon: Activity, path: '/live-feed' },
    { id: 'logs', label: 'System Audit', icon: Terminal, path: '/logs' },
    { id: 'admin', label: 'Configurations', icon: Settings, path: '/settings' },
];

export const Sidebar = () => {
    const { isSimulationMode, toggleSimulation, isSidebarOpen, setIsSidebarOpen } = useUI();

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={clsx(
                    "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-500",
                    isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsSidebarOpen(false)}
            />

            <aside className={clsx(
                "fixed inset-y-0 left-0 z-50 w-72 bg-soc-bg border-r border-white/5 flex flex-col transition-all duration-500 ease-in-out transform lg:translate-x-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-8 mb-4">
                    <div className="flex items-center gap-3 group">
                        <div className="w-12 h-12 rounded-xl bg-soc-primary/20 flex items-center justify-center border border-soc-cyan/30 shadow-neon-cyan group-hover:scale-110 transition-transform duration-500">
                            <Shield className="text-soc-cyan w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                                Feluda
                            </h2>
                            <span className="text-[10px] font-bold text-soc-cyan uppercase tracking-widest opacity-60">AI Defensive Mesh</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <div className="px-4 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-50">Intelligence Units</div>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            className={({ isActive }) => clsx(
                                "group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300",
                                isActive
                                    ? "bg-soc-cyan/10 text-soc-cyan border border-soc-cyan/10 shadow-[inset_0_0_20px_rgba(0,229,255,0.05)]"
                                    : "text-slate-500 hover:text-white hover:bg-white/[0.03]"
                            )}
                        >
                            <item.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                            <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
                            <div className="ml-auto w-1 h-1 rounded-full bg-soc-cyan opacity-0 group-[.active]:opacity-100 shadow-neon-cyan" />
                        </NavLink>
                    ))}
                </nav>

                <div className="p-6 mt-auto">
                    <div className="glass-card p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Active Ops</span>
                                <div className="flex items-center gap-2">
                                    <div className={clsx("w-1.5 h-1.5 rounded-full shadow-neon-cyan", isSimulationMode ? "bg-soc-cyan animate-pulse" : "bg-soc-success")} />
                                    <span className="text-xs font-black text-white uppercase">{isSimulationMode ? 'Simulation' : 'Real-time'}</span>
                                </div>
                            </div>
                            <button
                                onClick={toggleSimulation}
                                className={clsx(
                                    "p-2 rounded-lg transition-all duration-500",
                                    isSimulationMode ? "bg-soc-danger/20 text-soc-danger shadow-neon-danger border border-soc-danger/30" : "bg-white/5 text-slate-500 hover:text-white hover:bg-white/10"
                                )}
                            >
                                {isSimulationMode ? <CircleStop className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                            </button>
                        </div>

                        <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-soc-primary/10 border border-soc-primary/20 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-soc-cyan hover:bg-soc-primary/20 transition-all shadow-lg group">
                            <Download className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                            <span>Intelligence Brief</span>
                        </button>
                    </div>

                    <div className="mt-6 px-4 flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-40">
                        <span>Engine v2.4</span>
                        <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> SOC Node 1</span>
                    </div>
                </div>
            </aside>
        </>
    );
};
