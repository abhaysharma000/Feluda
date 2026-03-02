import React from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck,
    ShieldAlert,
    Zap,
    Globe2,
    Activity,
    Lock,
    Eye,
    TrendingUp
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
            color: 'text-soc-cyan',
            accent: 'bg-soc-cyan/10',
            trend: '+12.4%',
            trendUp: true
        },
        {
            label: 'Threats Blocked',
            value: stats.malicious.toLocaleString(),
            icon: ShieldAlert,
            color: 'text-soc-danger',
            accent: 'bg-soc-danger/10',
            trend: '+2.1%',
            trendUp: true
        },
        {
            label: 'Detection Acc.',
            value: `${(100 - stats.avgRisk / 3).toFixed(1)}%`,
            icon: TrendingUp,
            color: 'text-soc-success',
            accent: 'bg-soc-success/10',
            trend: 'Nominal',
            trendUp: true
        },
        {
            label: 'Inference Nodes',
            value: '42 Active',
            icon: Globe2,
            color: 'text-soc-cyan',
            accent: 'bg-soc-cyan/10',
            trend: 'Stable',
            trendUp: true
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {statsConfig.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.8 }}
                    className="glass-card p-4 lg:p-6 glass-card-hover group relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] rounded-full -mr-8 -mt-8 group-hover:bg-soc-cyan/5 transition-all duration-500" />

                    <div className="flex items-start justify-between mb-6">
                        <div className={clsx("p-3 rounded-2xl border border-white/5 group-hover:scale-110 transition-transform duration-500", stat.accent)}>
                            <stat.icon className={clsx("w-6 h-6", stat.color)} />
                        </div>
                        <div className="text-right">
                            <span className={clsx(
                                "text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-white/5",
                                stat.trendUp ? "text-soc-success bg-soc-success/10" : "text-soc-danger bg-soc-danger/10"
                            )}>
                                {stat.trend}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-2xl lg:text-3xl font-black text-white tracking-tighter tabular-nums">{stat.value}</h3>
                        <div className="flex items-center gap-2">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                            <div className="h-px flex-1 bg-white/5" />
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <div className="flex -space-x-1">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-5 h-5 rounded-full border border-soc-bg bg-soc-surface flex items-center justify-center">
                                    <Lock className="w-2.5 h-2.5 text-slate-500" />
                                </div>
                            ))}
                        </div>
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Certified Encrypted</span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
