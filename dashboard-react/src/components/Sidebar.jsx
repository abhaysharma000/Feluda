import React from 'react';
import { motion } from 'framer-motion';
import {
    Shield,
    LayoutDashboard,
    Map,
    Activity,
    Terminal,
    Settings,
    FileShield,
    Play,
    Pause,
    FastForward
} from 'lucide-react';
import { useUI } from '../context/UIContext';
import { clsx } from 'clsx';

const navItems = [
    { id: 'dashboard', label: 'Executive Deck', icon: LayoutDashboard },
    { id: 'threat-map', label: 'Global Matrix', icon: Map },
    { id: 'live-feed', label: 'Neural Stream', icon: Activity },
    { id: 'logs', label: 'Entropy Logs', icon: Terminal },
    { id: 'admin', label: 'Core Settings', icon: Settings },
];

export const Sidebar = () => {
    const {
        activePage,
        setActivePage,
        isSimulationMode,
        toggleSimulation,
        playbackSpeed,
        setPlaybackSpeed,
        isPlaybackPaused,
        setIsPlaybackPaused
    } = useUI();

    return (
        <aside className="fixed inset-y-0 left-0 z-[100] w-64 border-r border-white/5 bg-black flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static">
            <div className="p-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-accent to-darkblue-900 flex items-center justify-center shadow-neon">
                        <Shield className="text-black w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Feluda
                    </h2>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActivePage(item.id)}
                        className={clsx(
                            "nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                            activePage === item.id ? "bg-green-accent/10 text-green-accent border-r-2 border-green-accent" : "hover:bg-white/5 text-slate-400 hover:text-green-accent"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium text-sm">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-4 mt-auto space-y-4">
                {/* Playback Controls / Simulation Mode */}
                <div className="p-4 glass-card bg-white/[0.02]">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Threat Timeline</span>
                        <div className={clsx(
                            "px-2 py-0.5 rounded text-[8px] font-black uppercase",
                            isSimulationMode ? "bg-danger/20 text-danger" : "bg-emerald-500/20 text-emerald-500"
                        )}>
                            {isSimulationMode ? 'Simulating' : 'Live'}
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                        <button
                            onClick={() => setIsPlaybackPaused(!isPlaybackPaused)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-all"
                        >
                            {isPlaybackPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                        </button>

                        <div className="flex gap-1">
                            {[1, 2, 4].map(speed => (
                                <button
                                    key={speed}
                                    onClick={() => setPlaybackSpeed(speed)}
                                    className={clsx(
                                        "text-[10px] font-bold px-2 py-1 rounded",
                                        playbackSpeed === speed ? "bg-green-accent text-black" : "bg-white/5 text-slate-500 hover:bg-white/10"
                                    )}
                                >
                                    {speed}x
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                        <div
                            onClick={toggleSimulation}
                            className={clsx(
                                "relative w-11 h-6 transition-colors rounded-full cursor-pointer",
                                isSimulationMode ? "bg-danger" : "bg-slate-700"
                            )}
                        >
                            <motion.div
                                animate={{ x: isSimulationMode ? 22 : 2 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
                            />
                        </div>
                        <span className="text-[10px] font-bold uppercase text-slate-400">Manual Override</span>
                    </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-300 hover:bg-white/10 transition-all shadow-lg active:scale-95 group">
                    <FileShield className="w-4 h-4 text-green-accent group-hover:scale-110 transition-transform" />
                    <span>Export Security Brief</span>
                </button>
            </div>
        </aside>
    );
};
