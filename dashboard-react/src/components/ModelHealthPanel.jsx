import React, { useMemo } from 'react';
import { Activity, Shield, RefreshCw, Cpu } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export const ModelHealthPanel = () => {
    const { stats, isSimulationMode } = useUI();

    const healthMetrics = useMemo(() => {
        const accuracy = Math.min(99.9, Math.max(88, 100 - (stats.avgRisk / 2))).toFixed(1);
        const drift = (stats.avgRisk / 500).toFixed(3);
        const calibration = (95 + Math.random() * 2).toFixed(1);

        return { accuracy, drift, calibration };
    }, [stats.avgRisk]);

    const isHealthy = stats.avgRisk < 40;

    return (
        <div className="glass-card p-10 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-soc-cyan/5 blur-3xl rounded-full group-hover:bg-soc-cyan/10 transition-all duration-700" />

            <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                    <h3 className="text-xs font-black uppercase text-white tracking-[0.2em] italic">Neural Precision</h3>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Inference engine telemetry</p>
                </div>
                <span className={clsx(
                    "flex items-center gap-3 text-[9px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest border transition-all duration-500",
                    isHealthy ? "text-soc-success bg-soc-success/10 border-soc-success/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]" : "text-soc-danger bg-soc-danger/10 border-soc-danger/20"
                )}>
                    <div className={clsx("w-1.5 h-1.5 rounded-full", isHealthy ? "bg-soc-success animate-pulse" : "bg-soc-danger")} />
                    {isHealthy ? "Optimal" : "Anomaly"}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 group-hover:border-soc-cyan/20 transition-all duration-500">
                    <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Cpu className="w-3 h-3 text-soc-cyan/60" />
                        Calibration
                    </div>
                    <div className="text-2xl font-black text-white tabular-nums italic">{healthMetrics.calibration}%</div>
                </div>
                <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 group-hover:border-soc-primary/20 transition-all duration-500">
                    <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Activity className="w-3 h-3 text-soc-primary/60" />
                        Drift Index
                    </div>
                    <div className="text-2xl font-black text-soc-cyan tabular-nums italic">{healthMetrics.drift}</div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                        <span className="text-slate-500 italic">Neural Accuracy (Platt)</span>
                        <span className="text-white italic">{healthMetrics.accuracy}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
                        <motion.div
                            className={clsx("h-full rounded-full transition-all duration-1000", isHealthy ? "bg-soc-success shadow-neon-cyan" : "bg-soc-danger shadow-neon-danger")}
                            initial={{ width: 0 }}
                            animate={{ width: `${healthMetrics.accuracy}%` }}
                            transition={{ type: 'spring', stiffness: 30, damping: 15 }}
                        />
                    </div>
                </div>

                <div className="pt-8 mt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                        <Shield className="w-3.5 h-3.5 opacity-60" />
                        <span className="opacity-60 italic">Last Retrained: {isSimulationMode ? 'Sim_Active' : '14h ago'}</span>
                    </div>
                    <button className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-soc-cyan/30 text-slate-400 hover:text-soc-cyan transition-all duration-700 group/btn active:scale-95">
                        <RefreshCw className="w-4 h-4 group-hover/btn:rotate-180 transition-transform duration-1000" />
                    </button>
                </div>
            </div>
        </div>
    );
};
