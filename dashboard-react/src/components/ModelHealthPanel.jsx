import React from 'react';
import { Activity, Shield, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

export const ModelHealthPanel = () => {
    return (
        <div className="glass-card p-8 group">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold">Model Health & Precision</h3>
                <span className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase">
                    <Activity className="w-3 h-3" />
                    Optimal Performance
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 group-hover:border-green-accent/20 transition-all">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Calibration</div>
                    <div className="text-xl font-bold text-white">96.4%</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 group-hover:border-green-accent/20 transition-all">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Drift Index</div>
                    <div className="text-xl font-bold text-emerald-400">0.02</div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Neural Accuracy (Platt Scaling)</span>
                    <span className="text-white font-bold">96%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-green-accent w-[96%]"></div>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <Shield className="w-3 h-3" />
                        Last Retrained: 14h ago
                    </div>
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                        <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
