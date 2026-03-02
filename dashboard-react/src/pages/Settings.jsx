import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Shield, Bell, User, Cpu, Database, Globe } from 'lucide-react';

export const Settings = () => {
    return (
        <div className="space-y-8 pb-12">
            <header>
                <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Core Settings</h1>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest italic">Neural Configuration & SecOps Parameters</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* General Settings */}
                    <div className="glass-card p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                                <Cpu className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-white uppercase tracking-widest">Neural Engine</h2>
                                <p className="text-[10px] text-slate-500 uppercase font-bold">Optimization & Inference Configuration</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-all">
                                <div>
                                    <p className="text-xs font-black text-slate-200 uppercase tracking-widest mb-1">Strict Inference Mode</p>
                                    <p className="text-[10px] text-slate-500 italic">Increases false-positive sensitivity for maximum protection.</p>
                                </div>
                                <div className="w-10 h-5 bg-emerald-500 rounded-full relative cursor-pointer">
                                    <div className="absolute top-1 left-5 w-3 h-3 bg-white rounded-full" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-all">
                                <div>
                                    <p className="text-xs font-black text-slate-200 uppercase tracking-widest mb-1">Heuristic Depth</p>
                                    <p className="text-[10px] text-slate-500 italic">Adjusts the recursion level of domain crawler.</p>
                                </div>
                                <select className="bg-black border border-white/10 text-[10px] font-bold uppercase p-2 rounded-lg outline-none focus:border-cyan-500 transition-all text-cyan-400">
                                    <option>Standard (3)</option>
                                    <option>Deep (5)</option>
                                    <option>Overkill (10)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Data Handling */}
                    <div className="glass-card p-8 border-purple-500/20">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                <Database className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-white uppercase tracking-widest">Data Retention</h2>
                                <p className="text-[10px] text-slate-500 uppercase font-bold">Privacy & Entropy Management</p>
                            </div>
                        </div>

                        <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-danger/20 hover:border-danger/30 hover:text-danger transition-all">
                            Purge Global Audit Logs
                        </button>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="glass-card p-6 border-emerald-500/20">
                        <div className="flex items-center gap-3 mb-6">
                            <Globe className="w-4 h-4 text-emerald-400" />
                            <h3 className="text-xs font-black text-white uppercase tracking-widest">Network Status</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-bold">
                                <span className="text-slate-500 uppercase">Primary Node</span>
                                <span className="text-emerald-500 uppercase">Synchronized</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-bold">
                                <span className="text-slate-500 uppercase">Latency</span>
                                <span className="text-slate-300">12ms</span>
                            </div>
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-emerald-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: '92%' }}
                                    transition={{ duration: 1.5 }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent">
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-4">SecOps Identity</h3>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full border-2 border-white/10 bg-white/5 overflow-hidden flex items-center justify-center">
                                <User className="w-6 h-6 text-slate-500" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-white uppercase tracking-widest">Admin</p>
                                <p className="text-[8px] text-slate-500 uppercase italic">Superuser Account</p>
                            </div>
                        </div>
                        <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase text-slate-400 hover:bg-white/10 transition-all">
                            Verify Identity
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
