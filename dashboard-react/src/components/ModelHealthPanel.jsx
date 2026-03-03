import React, { useMemo } from 'react';
import { Activity, Shield, RefreshCw, Cpu, Zap } from 'lucide-react';
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
        <div className="glass-panel p-8 group relative overflow-hidden border-white/[0.03]">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-soc-accent/5 blur-3xl rounded-full" />

            <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                    <h3 className="text-[11px] font-bold uppercase text-white tracking-[0.2em]">Neural Telemetry</h3>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5 opacity-60">Inference engine engine</p>
                </div>
                <div className={clsx(
                    "flex items-center gap-2 text-[9px] font-bold px-3 py-1 rounded border transition-all duration-500 uppercase tracking-widest",
                    isHealthy ? "text-soc-success border-soc-success/20 bg-soc-success/5" : "text-soc-danger border-soc-danger/20 bg-soc-danger/5"
                )}>
                    <motion.div
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className={clsx("w-1.5 h-1.5 rounded-full", isHealthy ? "bg-soc-success" : "bg-soc-danger")}
                    />
                    {isHealthy ? "Operational" : "Degraded"}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors">
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                        <Cpu className="w-3 h-3 text-soc-accent/50" />
                        Calibration
                    </div>
                    <div className="text-xl font-bold text-white tabular-nums">{healthMetrics.calibration}%</div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors">
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                        <Activity className="w-3 h-3 text-soc-accent/50" />
                        Drift_Idx
                    </div>
                    <div className="text-xl font-bold text-soc-accent tabular-nums">{healthMetrics.drift}</div>
                </div>
            </div>

            <div className="space-y-5">
                <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                        <span className="text-slate-500">Inference Accuracy</span>
                        <span className="text-white tabular-nums">{healthMetrics.accuracy}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className={clsx("h-full rounded-full", isHealthy ? "bg-soc-accent" : "bg-soc-danger")}
                            initial={{ width: 0 }}
                            animate={{ width: `${healthMetrics.accuracy}%` }}
                            transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                        />
                    </div>
                </div>

                <div className="pt-6 border-t border-white/[0.03] flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                            <Shield className="w-3 h-3 text-soc-accent" />
                            Last Retrain cycle: 14h
                        </div>
                        <div className="flex items-center gap-2 text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                            <Zap className="w-3 h-3 text-soc-accent" />
                            Weights: Ver_1.0.4
                        </div>
                    </div>
                    <button className="p-2.5 rounded-lg bg-white/5 border border-white/5 hover:border-soc-accent/30 text-slate-400 hover:text-soc-accent transition-all group active:scale-95">
                        <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-700" />
                    </button>
                </div>
            </div>
        </div>
    );
};
