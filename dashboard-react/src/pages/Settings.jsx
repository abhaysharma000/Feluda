import React from 'react';
import { Settings as SettingsIcon, Shield, Cpu, Database, Bell, Eye, Lock, Globe, Zap } from 'lucide-react';

export const Settings = () => {
    return (
        <div className="space-y-6 lg:space-y-12 pb-12">
            <header className="space-y-2">
                <div className="flex items-center gap-3 text-soc-cyan/60">
                    <SettingsIcon className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Engine Control</span>
                </div>
                <h1 className="text-3xl lg:text-5xl font-black text-white uppercase tracking-tighter italic leading-tight">Configurations</h1>
                <p className="text-slate-500 text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] lg:tracking-[0.3em]">Calibrate neural filters and manage global defensive protocols.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
                <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                    <section className="glass-card p-6 lg:p-10 space-y-8 lg:space-y-10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-32 bg-soc-cyan/20" />

                        <div>
                            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 italic flex items-center gap-3">
                                <Cpu className="w-4 h-4 text-soc-cyan" />
                                Neural Engine Calibration
                            </h3>

                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggression Sensitivity</label>
                                        <span className="text-xs font-black text-soc-cyan">72%</span>
                                    </div>
                                    <input type="range" className="w-full accent-soc-cyan bg-white/5 rounded-lg h-2" defaultValue="72" />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visual Similarity Proxy</label>
                                        <span className="text-xs font-black text-soc-cyan">85%</span>
                                    </div>
                                    <input type="range" className="w-full accent-soc-cyan bg-white/5 rounded-lg h-2" defaultValue="85" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-white/5">
                            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 italic flex items-center gap-3">
                                <Shield className="w-4 h-4 text-soc-cyan" />
                                Global Defensive Protocols
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { id: 'zero-day', label: 'Zero-Day Shielding', active: true },
                                    { id: 'dns-sec', label: 'Passive DNS Intel', active: true },
                                    { id: 'entropy', label: 'URL Entropy Parsing', active: false },
                                    { id: 'behavioral', label: 'Behavioral Sandbox', active: true }
                                ].map(toggle => (
                                    <div key={toggle.id} className="flex items-center justify-between p-5 glass-card bg-white/[0.01] hover:bg-white/[0.03] transition-colors group">
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{toggle.label}</span>
                                        <div className={`w-12 h-6 rounded-full relative transition-colors duration-500 ${toggle.active ? 'bg-soc-cyan/20' : 'bg-white/10'}`}>
                                            <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-500 ${toggle.active ? 'right-1 bg-soc-cyan shadow-neon-cyan' : 'left-1 bg-slate-600'}`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    <div className="glass-card p-10 space-y-8 relative overflow-hidden group">
                        <Globe className="absolute top-[-10px] right-[-10px] w-24 h-24 text-soc-cyan/[0.03] transition-transform duration-700 group-hover:scale-110" />
                        <h3 className="text-xs font-black uppercase tracking-widest text-white italic border-b border-white/5 pb-6">Inference Node Identity</h3>

                        <div className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Node Signature</label>
                                <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs font-mono text-soc-cyan">
                                    FELUDA_SOC_ALPHA_07
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Region Allocation</label>
                                <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs font-black text-white uppercase tracking-widest">
                                    Global [Tier 1 Mesh]
                                </div>
                            </div>
                        </div>

                        <button className="w-full mt-4 py-4 bg-soc-primary/10 border border-soc-primary/20 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-soc-cyan hover:bg-soc-primary/20 transition-all shadow-lg flex items-center justify-center gap-3">
                            <Zap className="w-4 h-4" />
                            Regenerate Token
                        </button>
                    </div>

                    <div className="glass-card p-10 space-y-6 bg-soc-cyan/5 border-soc-cyan/20">
                        <div className="flex items-center gap-3 mb-2">
                            <Lock className="w-5 h-5 text-soc-cyan" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-soc-cyan italic">Security Status</h3>
                        </div>
                        <p className="text-[10px] leading-relaxed text-slate-300 font-medium opacity-80 uppercase tracking-widest">All neural configuration changes are cryptographically logged and broadcast to the defensive mesh instantly.</p>
                        <div className="pt-4 flex items-center gap-3 text-soc-success">
                            <div className="w-1.5 h-1.5 rounded-full bg-soc-success animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest italic">Encryption Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
