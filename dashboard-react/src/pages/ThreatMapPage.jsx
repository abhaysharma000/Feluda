import React from 'react';
import { ThreatMap } from '../components/ThreatMap';
import { Activity, Globe, ShieldAlert, Cpu, Lock, TrendingUp } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export const ThreatMapPage = () => {
    const { stats, logs } = useUI();

    // Filter malicious logs for urgent alerts
    const urgentAlerts = logs.filter(l => l.verdict === 'Malicious').slice(0, 3);

    return (
        <div className="space-y-6 lg:space-y-12 pb-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-soc-cyan/60">
                        <Globe className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Global Consensus Mesh</span>
                    </div>
                    <h1 className="text-3xl lg:text-5xl font-black text-white uppercase tracking-tighter italic leading-tight">Neural Matrix</h1>
                    <p className="text-slate-500 text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] lg:tracking-[0.3em]">Deep packet inspection tracking across global consensus nodes.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="px-6 py-3 glass-card border-soc-cyan/20 flex items-center gap-3 bg-soc-cyan/5">
                        <div className="w-2 h-2 rounded-full bg-soc-cyan animate-pulse shadow-neon-cyan" />
                        <span className="text-[10px] font-black text-soc-cyan uppercase tracking-widest">Global Mesh Active</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-12">
                {/* Main Map View */}
                <div className="lg:col-span-3 space-y-6 lg:space-y-12">
                    <div className="glass-card p-1 bg-white/[0.01] border-white/5 overflow-hidden min-h-[400px] lg:min-h-[600px] relative">
                        <div className="absolute top-0 left-0 w-32 h-1 bg-soc-cyan/20" />
                        <ThreatMap />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
                        {[
                            { label: 'Node Saturation', val: '84.2%', color: 'bg-soc-cyan', shadow: 'shadow-neon-cyan' },
                            { label: 'Encryption Load', val: '92.1%', color: 'bg-soc-primary', shadow: '' },
                            { label: 'Sync Integrity', val: '99.9%', color: 'bg-soc-success', shadow: '' }
                        ].map((stat) => (
                            <div key={stat.label} className="glass-card p-6 lg:p-8 group relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/[0.01] rounded-full blur-2xl group-hover:bg-white/[0.03] transition-colors" />
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 italic">{stat.label}</h4>
                                <div className="text-3xl font-black text-white mb-4 tabular-nums italic">{stat.val}</div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        className={clsx("h-full rounded-full", stat.color, stat.shadow)}
                                        initial={{ width: 0 }}
                                        animate={{ width: stat.val }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Telemetry Sidebar */}
                <div className="space-y-6 lg:space-y-12">
                    <div className="glass-card p-6 lg:p-10 space-y-6 lg:space-y-8 relative overflow-hidden">
                        <h3 className="text-xs font-black uppercase text-white tracking-widest mb-2 italic flex items-center gap-3 border-b border-white/5 pb-4 lg:pb-6">
                            <Activity className="w-5 h-5 text-soc-success" />
                            Node Telemetry
                        </h3>

                        <div className="space-y-6">
                            {[
                                { label: 'Latency (Avg)', val: '12ms', color: 'text-soc-success' },
                                { label: 'Threat Index', val: `${stats.avgRisk}%`, color: stats.avgRisk > 10 ? 'text-soc-danger' : 'text-soc-cyan' },
                                { label: 'Scanned (24h)', val: stats.scanned.toLocaleString(), color: 'text-white' },
                                { label: 'Active Clusters', val: '42', color: 'text-soc-cyan' },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-300 transition-colors">{item.label}</span>
                                    <span className={clsx("text-xs font-black uppercase tabular-nums tracking-widest", item.color)}>{item.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-10 bg-soc-danger/5 border-soc-danger/20 group overflow-hidden relative min-h-[250px] space-y-8">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ShieldAlert className="w-16 h-16 text-soc-danger" />
                        </div>
                        <h3 className="text-xs font-black uppercase text-soc-danger tracking-widest mb-2 italic border-b border-soc-danger/20 pb-6">Urgent Triage</h3>
                        <div className="space-y-4">
                            {urgentAlerts.length > 0 ? urgentAlerts.map(alert => (
                                <div key={alert.id} className="p-4 rounded-xl bg-soc-bg border-l-2 border-soc-danger transition-all hover:bg-white/[0.02]">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-soc-danger text-[9px] font-black uppercase tracking-[0.2em]">{alert.node}</span>
                                        <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="line-clamp-2 text-[10px] font-medium text-slate-400 leading-relaxed uppercase tracking-widest">{alert.vector}</p>
                                </div>
                            )) : (
                                <div className="text-center py-10 opacity-30">
                                    <Lock className="w-10 h-10 text-soc-success mx-auto mb-4" />
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Grid Status Nominal</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="glass-card p-10 space-y-6 relative overflow-hidden group">
                        <h3 className="text-xs font-black uppercase text-white tracking-widest italic flex items-center gap-3 mb-2">
                            <Cpu className="w-5 h-5 text-soc-cyan" />
                            Neural Backbone
                        </h3>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-soc-cyan shadow-neon-cyan"
                                animate={{ width: ['40%', '85%', '60%'] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Load Optimization</span>
                            <span className="text-[10px] font-black text-soc-cyan italic">85% ACTIVE</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
