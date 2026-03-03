import React from 'react';
import { Settings as SettingsIcon, Shield, Cpu, Database, Bell, Eye, Lock, Globe, Zap, Key, Activity } from 'lucide-react';
import { clsx } from 'clsx';

export const Settings = () => {
    return (
        <div className="space-y-8 pb-12">
            <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-soc-accent/10 rounded-lg">
                            <SettingsIcon className="w-5 h-5 text-soc-accent" />
                        </div>
                        <div className="h-px w-12 bg-white/5" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">Engine_Config_Stack</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-none">
                        Engine <span className="text-gradient">Control Center</span>
                    </h1>
                    <p className="text-slate-500 text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em]">Calibrate neural response vectors and global defensive triggers.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="xl:col-span-8 space-y-8">
                    <section className="glass-panel p-8 lg:p-10 space-y-10 border-white/[0.03]">
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <Cpu className="w-4 h-4 text-soc-accent" />
                                <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.2em]">Neural Response Calibration</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-5">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Aggression_Bias</label>
                                        <span className="text-[10px] font-bold text-soc-accent tabular-nums">72.4%</span>
                                    </div>
                                    <input type="range" className="soc-slider" defaultValue="72" />
                                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">Controls the classifier's sensitivity to heuristic anomalies.</p>
                                </div>

                                <div className="space-y-5">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Visual_Similarity_Proxy</label>
                                        <span className="text-[10px] font-bold text-soc-accent tabular-nums">85.0%</span>
                                    </div>
                                    <input type="range" className="soc-slider" defaultValue="85" />
                                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">Sensitivity delta for visual-cloning detection engine.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-white/[0.03]">
                            <div className="flex items-center gap-3 mb-8">
                                <Shield className="w-4 h-4 text-soc-accent" />
                                <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.2em]">Defensive Protocol Toggles</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { id: 'zero-day', label: 'Zero-Day Active Shield', active: true },
                                    { id: 'dns-sec', label: 'Passive DNS Intelligence', active: true },
                                    { id: 'entropy', label: 'URL Entropy Analysis', active: false },
                                    { id: 'behavioral', label: 'Behavioral Sandbox', active: true }
                                ].map(toggle => (
                                    <button key={toggle.id} className="flex items-center justify-between p-5 rounded-xl bg-white/[0.01] border border-white/[0.03] hover:border-white/[0.08] transition-all group">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-200 transition-colors">{toggle.label}</span>
                                        <div className={clsx(
                                            "w-10 h-5 rounded-full relative transition-colors duration-500",
                                            toggle.active ? 'bg-soc-accent/20' : 'bg-white/10'
                                        )}>
                                            <div className={clsx(
                                                "absolute top-1 w-3 h-3 rounded-full transition-all duration-500",
                                                toggle.active ? 'right-1 bg-soc-accent' : 'left-1 bg-slate-600'
                                            )} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                <div className="xl:col-span-4 space-y-8">
                    <div className="glass-panel p-8 space-y-8 relative overflow-hidden group border-white/[0.03]">
                        <Globe className="absolute top-[-10px] right-[-10px] w-24 h-24 text-soc-accent/[0.03] transition-transform duration-700 group-hover:scale-110" />
                        <div className="flex items-center gap-3 mb-2 border-b border-white/[0.03] pb-6">
                            <Database className="w-4 h-4 text-soc-accent" />
                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-white">Node Identity</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Global Master Signature</label>
                                <div className="bg-black/40 border border-white/[0.05] rounded-lg px-4 py-3 text-[10px] font-mono text-soc-accent overflow-hidden text-ellipsis whitespace-nowrap">
                                    0x_FELUDA_SOC_ALPHA_007_X_99
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Infrastructure Allocation</label>
                                <div className="bg-black/40 border border-white/[0.05] rounded-lg px-4 py-3 text-[10px] font-bold text-white uppercase tracking-widest">
                                    Primary_Mesh [North_Euro_Zone]
                                </div>
                            </div>
                        </div>

                        <button className="soc-button w-full mt-4 py-4 rounded-xl flex items-center justify-center gap-3">
                            <Key className="w-4 h-4" />
                            Rotate Node Keys
                        </button>
                    </div>

                    <div className="glass-panel p-8 space-y-6 bg-soc-accent/[0.02] border-soc-accent/10">
                        <div className="flex items-center gap-3 mb-2">
                            <Lock className="w-4 h-4 text-soc-accent" />
                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-soc-accent">Session Security</h3>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-400 font-medium">All telemetry modifications are cryptographically signed and immutable in the audit stream.</p>
                        <div className="pt-4 flex items-center gap-3 text-soc-success border-t border-white/[0.03]">
                            <div className="w-1.5 h-1.5 rounded-full bg-soc-success animate-pulse" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Encrypted active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
