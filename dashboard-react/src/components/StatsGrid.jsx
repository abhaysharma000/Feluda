import React from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck,
    ShieldAlert,
    Globe2,
    Lock,
    TrendingUp,
    Fingerprint,
    Waves
} from 'lucide-react';
import { useUI } from '../context/UIContext';
import { clsx } from 'clsx';

export const StatsGrid = () => {
    const { stats } = useUI();

    const statsConfig = [
        {
            label: 'Assets Scanned',
            value: stats.scanned.toLocaleString(),
            icon: ShieldCheck,
            color: 'text-soc-accent',
            accent: 'bg-soc-accent/5',
            trend: '+12.4%',
            trendUp: true,
            desc: 'Real-time inspection nodes'
        },
        {
            label: 'Threats Blocked',
            value: stats.malicious.toLocaleString(),
            icon: ShieldAlert,
            color: 'text-soc-danger',
            accent: 'bg-soc-danger/5',
            trend: '+2.1%',
            trendUp: true,
            desc: 'Neutralized malicious vectors'
        },
        {
            label: 'Model Accuracy',
            value: `${(100 - stats.avgRisk / 3).toFixed(1)}%`,
            icon: TrendingUp,
            color: 'text-soc-success',
            accent: 'bg-soc-success/5',
            trend: 'Nominal',
            trendUp: true,
            desc: 'Averaged inference confidence'
        },
        {
            label: 'Neural Nodes',
            value: '42 Active',
            icon: Globe2,
            color: 'text-soc-accent',
            accent: 'bg-soc-accent/5',
            trend: 'Stable',
            trendUp: true,
            desc: 'Global intelligence cluster'
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
                        <div className={clsx(
                            "px-2 py-0.5 rounded flex items-center gap-1 border border-white/[0.05] bg-white/[0.02] text-[9px] font-bold tracking-wider uppercase leading-none",
                            stat.trendUp ? "text-soc-success" : "text-soc-danger"
                        )}>
                            {stat.trendUp && <TrendingUp className="w-2.5 h-2.5" />}
                            {stat.trend}
                        </div>
                    </div>

                    <div className="space-y-1 relative z-10">
                        <div className="text-3xl font-bold text-white tracking-tight tabular-nums transition-transform group-hover:translate-x-1 duration-300">
                            {stat.value}
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                {stat.label}
                            </span>
                            <span className="text-[9px] font-medium text-slate-600 uppercase tracking-tight leading-none">
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
