import React from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck,
    ShieldAlert,
    Globe2,
    Lock,
    TrendingUp,
    Fingerprint,
    Waves,
    Zap
} from 'lucide-react';
import { useUI } from '../context/UIContext';
import { clsx } from 'clsx';

export const StatsGrid = () => {
    const { stats } = useUI();

    const statsConfig = [
        {
            label: 'URLs Scanned Today',
            value: stats.scanned_today.toLocaleString(),
            icon: ShieldCheck,
            color: 'text-soc-accent',
            accent: 'bg-soc-accent/5',
            desc: 'Real-time daily volume'
        },
        {
            label: 'Threats Blocked',
            value: stats.blocked.toLocaleString(),
            icon: ShieldAlert,
            color: 'text-soc-danger',
            accent: 'bg-soc-danger/5',
            desc: 'Neutralized malicious vectors'
        },
        {
            label: 'Suspicious Activities',
            value: stats.suspicious.toLocaleString(),
            icon: Globe2,
            color: 'text-soc-warning',
            accent: 'bg-soc-warning/5',
            desc: 'Awaiting deeper heuristic scan'
        },
        {
            label: 'Backend Latency',
            value: `${stats.latency_ms}ms`,
            icon: Zap,
            color: 'text-soc-accent',
            accent: 'bg-soc-accent/5',
            desc: 'API Intelligence response'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsConfig.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="glass-panel p-6 hover:bg-white/[0.04] transition-all duration-300 group relative border-white/[0.03] overflow-hidden"
                >
                    {/* Background Subtle Wave */}
                    <div className="absolute bottom-0 right-0 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                        <Waves className="w-32 h-32 rotate-12 translate-x-10 translate-y-10" />
                    </div>

                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className={clsx("p-2.5 rounded-xl border border-white/[0.05] shadow-inner", stat.accent)}>
                            <stat.icon className={clsx("w-5 h-5", stat.color)} />
                        </div>
                    </div>

                    <div className="space-y-1 relative z-10">
                        <div className="text-3xl font-black text-white tracking-tighter tabular-nums group-hover:text-soc-accent transition-colors duration-500">
                            {stat.value}
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">
                                {stat.label}
                            </span>
                            <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tight leading-none opacity-60">
                                {stat.desc}
                            </span>
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-white/[0.03] flex items-center justify-between opacity-40 group-hover:opacity-100 transition-opacity relative z-10">
                        <div className="flex items-center gap-1.5">
                            <Fingerprint className="w-3 h-3 text-slate-500" />
                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Encrypted Pipe</span>
                        </div>
                        <div className="flex gap-1">
                            <div className="w-1 h-1 rounded-full bg-soc-accent/40" />
                            <div className="w-1 h-1 rounded-full bg-soc-accent/40" />
                            <div className="w-1 h-1 rounded-full bg-soc-accent/40" />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
