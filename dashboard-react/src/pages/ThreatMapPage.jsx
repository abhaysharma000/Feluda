import React from 'react';
import { ThreatMap } from '../components/ThreatMap';
import { Activity, Globe, ShieldAlert, Cpu, Lock } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { clsx } from 'clsx';

export const ThreatMapPage = () => {
    const { stats, logs } = useUI();

    // Filter malicious logs for urgent alerts
    const urgentAlerts = logs.filter(l => l.verdict === 'Malicious').slice(0, 3);

    return (
        <div className="h-full flex flex-col space-y-8 animate-in fade-in zoom-in-95 duration-700 pb-12">
            <header className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
                        <Globe className="text-cyan-accent w-8 h-8" />
                        Neural Matrix
                    </h2>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest italic">Deep packet inspection tracking across global consensus nodes.</p>
                </div>
                <div className="hidden lg:flex gap-4">
                    <div className="px-4 py-2 glass-card border-cyan-500/20 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Global Mesh Active</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
                {/* Main Map View */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="glass-card p-1 bg-white/[0.01] border-white/5 overflow-hidden">
                        <ThreatMap />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-card p-6 border-white/5 bg-black/40 relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors" />
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Node Saturation</h4>
                            <div className="text-2xl font-black text-white mb-2">84.2%</div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div className="h-full bg-cyan-accent" animate={{ width: '84.2%' }} />
                            </div>
                        </div>
                        <div className="glass-card p-6 border-white/5 bg-black/40 relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Encryption Load</h4>
                            <div className="text-2xl font-black text-white mb-2">92.1%</div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div className="h-full bg-purple-500" animate={{ width: '92.1%' }} />
                            </div>
                        </div>
                        <div className="glass-card p-6 border-white/5 bg-black/40 relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Sync Integrity</h4>
                            <div className="text-2xl font-black text-white mb-2">99.9%</div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div className="h-full bg-emerald-500" animate={{ width: '99.9%' }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Telemetry Sidebar */}
                <div className="space-y-6">
                    <div className="glass-card p-6 border-white/5 bg-black/40">
                        <h3 className="text-xs font-black uppercase text-slate-200 tracking-widest mb-6 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-green-accent" />
                            Node Telemetry
                        </h3>

                        <div className="space-y-4">
                            {[
                                { label: 'Latency (Avg)', val: '12ms', color: 'text-green-accent' },
                                { label: 'Threat Index', val: `${stats.avgRisk}%`, color: stats.avgRisk > 10 ? 'text-danger' : 'text-cyan-accent' },
                                { label: 'Scanned (24h)', val: stats.scanned.toLocaleString(), color: 'text-white' },
                                { label: 'Active Clusters', val: '42', color: 'text-cyan-accent' },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-default">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.label}</span>
                                    <span className={clsx("text-xs font-black uppercase", item.color)}>{item.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-6 border-danger/10 bg-danger/5 group overflow-hidden relative min-h-[200px]">
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ShieldAlert className="w-12 h-12 text-danger" />
                        </div>
                        <h3 className="text-xs font-black uppercase text-danger tracking-widest mb-6 border-b border-danger/20 pb-2">Urgent Triage</h3>
                        <div className="space-y-3">
                            {urgentAlerts.length > 0 ? urgentAlerts.map(alert => (
                                <div key={alert.id} className="p-3 rounded-lg bg-black/60 border-l-2 border-danger text-[9px] text-slate-400 animate-in slide-in-from-right-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-danger font-black uppercase tracking-widest">{alert.node}</span>
                                        <span className="text-[8px] italic">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <p className="line-clamp-2 opacity-80">{alert.vector}</p>
                                </div>
                            )) : (
                                <div className="text-center py-8">
                                    <Lock className="w-6 h-6 text-emerald-500/20 mx-auto mb-2" />
                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest italic">No active breaches</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="glass-card p-6 border-white/5 bg-black/40">
                        <h3 className="text-xs font-black uppercase text-slate-200 tracking-widest mb-4 flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-cyan-accent" />
                            Neural Backbone
                        </h3>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-cyan-accent shadow-neon-small"
                                animate={{ width: ['40%', '85%', '60%'] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            />
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Load Optimization</span>
                            <span className="text-[10px] font-black text-cyan-400">85%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
