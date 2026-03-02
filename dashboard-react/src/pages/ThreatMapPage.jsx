import React from 'react';
import MatrixWorldMap from '../components/MatrixWorldMap';
import { Activity, Globe, ShieldAlert, Cpu } from 'lucide-react';

export const ThreatMapPage = () => {
    return (
        <div className="h-full flex flex-col space-y-8 animate-in fade-in zoom-in-95 duration-700">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold text-white tracking-tight uppercase">Neural Matrix Map</h2>
                    <p className="text-slate-500 text-sm italic">Deep packet inspection tracking across global consensus nodes.</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-4 py-2 glass-card border-white/10 flex items-center gap-3">
                        <Globe className="w-4 h-4 text-cyan-accent" />
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Global Mesh</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
                {/* Main Map View */}
                <div className="lg:col-span-3">
                    <MatrixWorldMap />
                </div>

                {/* Telemetry Sidebar */}
                <div className="space-y-6">
                    <div className="glass-card p-6 border-white/5 bg-black/40">
                        <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest mb-6 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-green-accent" />
                            Node Telemetry
                        </h3>

                        <div className="space-y-4">
                            {[
                                { label: 'Latency (Avg)', val: '12ms', color: 'text-green-accent' },
                                { label: 'Packets/sec', val: '8.2M', color: 'text-white' },
                                { label: 'Cluster Health', val: '99.9%', color: 'text-green-accent' },
                                { label: 'Active Filters', val: '14,204', color: 'text-cyan-accent' },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                                    <span className="text-[10px] font-medium text-slate-400 uppercase">{item.label}</span>
                                    <span className={`text-xs font-bold ${item.color}`}>{item.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-6 border-danger/10 bg-danger/5 group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ShieldAlert className="w-12 h-12 text-danger" />
                        </div>
                        <h3 className="text-xs font-black uppercase text-danger tracking-widest mb-4">Urgent Alerts</h3>
                        <div className="space-y-3">
                            <div className="p-3 rounded-lg bg-black/40 border-l-2 border-danger text-[10px] text-slate-400">
                                <span className="text-danger font-bold block mb-1 uppercase">Node_Asia_41</span>
                                Heuristic anomaly detected in Tokyo cluster.
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6 border-white/5 bg-black/40">
                        <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest mb-4 flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-cyan-accent" />
                            Neural Backbone
                        </h3>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-cyan-accent"
                                animate={{ width: ['40%', '85%', '60%'] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            />
                        </div>
                        <div className="mt-2 text-[8px] font-bold text-slate-600 uppercase tracking-widest">Load Optimization: 85%</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
