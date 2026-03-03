import React from 'react';
import { ThreatMap } from '../components/ThreatMap';
import { Activity, Globe, ShieldAlert, Cpu, Lock, TrendingUp, Zap, Server } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export const ThreatMapPage = () => {
    const { stats, logs } = useUI();

    // Filter malicious logs for urgent alerts
    const urgentAlerts = logs.filter(l => l.verdict === 'Malicious').slice(0, 3);

    return (
        <div className="space-y-8 pb-12">
            <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-soc-accent/10 rounded-lg">
                            <Globe className="w-5 h-5 text-soc-accent" />
                        </div>
                        <div className="h-px w-12 bg-white/5" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">Global_Inference_Mesh</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-none">
                        Tactical <span className="text-gradient">Intelligence Matrix</span>
                    </h1>
                    <p className="text-slate-500 text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em]">Live heuristic mapping of distributed consensus nodes.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="px-5 py-2.5 glass-panel border-soc-accent/20 flex items-center gap-3 bg-soc-accent/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-soc-accent animate-ping" />
                        <span className="text-[10px] font-bold text-soc-accent uppercase tracking-widest">Mesh Status: Synchronized</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Main Map View */}
                <div className="xl:col-span-9 space-y-8">
                    <div className="glass-panel p-2 bg-black/20 border-white/[0.03] overflow-hidden min-h-[600px] relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-soc-accent/[0.02] to-transparent pointer-events-none" />
                        <ThreatMap />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: 'Ingress Saturation', val: '84.2%', icon: Zap, color: 'text-soc-accent' },
                            { label: 'Compute Allocation', val: '92.1%', icon: Server, color: 'text-white' },
                            { label: 'Sync Integrity', val: '99.9%', icon: Activity, color: 'text-soc-success' }
                        ].map((stat) => (
                            <div key={stat.label} className="glass-panel p-8 group relative overflow-hidden border-white/[0.03]">
                                <div className="flex items-center justify-between mb-4">
                                    <stat.icon className={clsx("w-4 h-4", stat.color)} />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                                </div>
                                <div className="text-3xl font-bold text-white mb-4 tabular-nums">{stat.val}</div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        className={clsx("h-full rounded-full transition-all duration-1000",
                                            stat.color === 'text-white' ? 'bg-white/20' :
                                                stat.color === 'text-soc-success' ? 'bg-soc-success' : 'bg-soc-accent'
                                        )}
                                        initial={{ width: 0 }}
                                        animate={{ width: stat.val }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Telemetry Sidebar */}
                <div className="xl:col-span-3 space-y-8">
                    <div className="glass-panel p-8 space-y-6 border-white/[0.03]">
                        <h3 className="text-[11px] font-bold uppercase text-white tracking-widest flex items-center gap-3 mb-2">
                            <TrendingUp className="w-4 h-4 text-soc-accent" />
                            Node Telemetry
                        </h3>

                        <div className="space-y-4">
                            {[
                                { label: 'Avg Latency', val: '12ms' },
                                { label: 'Threat Depth', val: `${stats.avgRisk}%` },
                                { label: 'Total Ingress', val: stats.scanned.toLocaleString() },
                                { label: 'Cluster Count', val: '42' },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center py-2 border-b border-white/[0.03]">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
                                    <span className="text-[10px] font-bold text-white tabular-nums tracking-widest">{item.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel p-8 bg-soc-danger/[0.02] border-soc-danger/10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-1.5 bg-soc-danger/10 rounded-lg">
                                <ShieldAlert className="w-4 h-4 text-soc-danger" />
                            </div>
                            <h3 className="text-[11px] font-bold uppercase text-soc-danger tracking-widest">Urgent Triage</h3>
                        </div>
                        <div className="space-y-4">
                            {urgentAlerts.length > 0 ? urgentAlerts.map(alert => (
                                <div key={alert.id} className="p-4 rounded-xl bg-black/40 border border-white/[0.03] group hover:border-soc-danger/30 transition-colors">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-soc-danger text-[9px] font-bold uppercase tracking-widest">{alert.node}</span>
                                        <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest tabular-nums">12:44</span>
                                    </div>
                                    <p className="line-clamp-2 text-[10px] font-medium text-slate-400 leading-relaxed uppercase tracking-widest group-hover:text-slate-300 transition-colors">{alert.vector}</p>
                                </div>
                            )) : (
                                <div className="text-center py-12 opacity-30 flex flex-col items-center">
                                    <Lock className="w-8 h-8 text-soc-success mb-3" />
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Grid Secured</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="glass-panel p-8 space-y-6 border-white/[0.03]">
                        <div className="flex items-center gap-3 mb-4">
                            <Cpu className="w-4 h-4 text-soc-accent" />
                            <h3 className="text-[11px] font-bold uppercase text-white tracking-widest">Core Utilization</h3>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-soc-accent"
                                animate={{ width: ['40%', '85%', '60%'] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>
                        <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                            <span className="text-slate-500">Neural backbone load</span>
                            <span className="text-soc-accent">Optimal (2.4s)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
