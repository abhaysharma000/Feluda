import React from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck,
    ShieldAlert,
    Zap,
    Globe,
    Activity,
    Lock
} from 'lucide-react';
import { useUI } from '../context/UIContext';
import { clsx } from 'clsx';

export const StatsGrid = () => {
    const { stats } = useUI();

    const statsConfig = [
        {
            label: 'Assets Inspected',
            value: stats.scanned.toLocaleString(),
            icon: ShieldCheck,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10'
        },
        {
            label: 'Threats Neutralized',
            value: stats.malicious.toLocaleString(),
            icon: ShieldAlert,
            color: 'text-danger',
            bg: 'bg-danger/10'
        },
        {
            label: 'Neural Response',
            value: `${stats.avgRisk}%`,
            icon: Activity,
            color: 'text-cyan-400',
            bg: 'bg-cyan-500/10'
        },
        {
            label: 'Global Nodes',
            value: '42 Active',
            icon: Globe,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {statsConfig.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card group hover:border-white/20 transition-all duration-500 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:via-white/20 transition-all duration-700" />

                    <div className="flex items-center justify-between mb-4">
                        <div className={clsx("p-2.5 rounded-xl border border-white/5 transition-transform duration-500 group-hover:scale-110", stat.bg)}>
                            <stat.icon className={clsx("w-5 h-5", stat.color)} />
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Status</span>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-tighter">Verified</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-2xl font-black text-white tracking-tight">{stat.value}</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                        <div className="flex -space-x-1.5 overflow-hidden">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="inline-block h-4 w-4 rounded-full ring-2 ring-black bg-white/5 border border-white/10 flex items-center justify-center">
                                    <Lock className="w-2 h-2 text-slate-500" />
                                </div>
                            ))}
                        </div>
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-tighter italic">SecOps Node {index + 1}</span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
