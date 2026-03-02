import React from 'react';
import { LogsTable } from '../components/LogsTable';
import { Terminal, ShieldAlert, FileText, Download, Filter } from 'lucide-react';

export const Logs = () => {
    return (
        <div className="space-y-6 lg:space-y-12 pb-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-soc-cyan/60">
                        <Terminal className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Audit Infrastructure</span>
                    </div>
                    <h1 className="text-3xl lg:text-5xl font-black text-white uppercase tracking-tighter italic leading-tight">Intelligence Audit</h1>
                    <p className="text-slate-500 text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] lg:tracking-[0.3em]">Comprehensive forensic log of all neural scan operations.</p>
                </div>

                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                        <Filter className="w-4 h-4" />
                        Filter Log
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-soc-cyan/10 border border-soc-cyan/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-soc-cyan hover:bg-soc-cyan/20 transition-all shadow-neon-cyan">
                        <Download className="w-4 h-4" />
                        Export Audit
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
                <div className="lg:col-span-3">
                    <div className="glass-card p-1 min-h-[400px] lg:min-h-[600px] relative">
                        <div className="absolute top-0 right-0 w-1 h-32 bg-soc-cyan/20" />
                        <LogsTable />
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="glass-card p-8 space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-white/5 pb-4 italic">Log Summary</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Total Entries</span>
                                <span className="text-xs font-black text-white">2,482</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Threats Flagged</span>
                                <span className="text-xs font-black text-soc-danger">128</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">False Positives</span>
                                <span className="text-xs font-black text-soc-success">14</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8 bg-soc-danger/5 border-soc-danger/20">
                        <div className="flex items-center gap-3 mb-4">
                            <ShieldAlert className="w-5 h-5 text-soc-danger" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-soc-danger italic">Critical Events</h3>
                        </div>
                        <p className="text-[10px] leading-relaxed text-slate-400 font-medium">3 anomalous domain patterns detected in the last hour requiring immediate neural review.</p>
                        <button className="mt-6 w-full py-3 bg-soc-danger/20 border border-soc-danger/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-soc-danger hover:bg-soc-danger/30 transition-all">
                            Review Intelligence
                        </button>
                    </div>

                    <div className="glass-card p-8 relative overflow-hidden group">
                        <FileText className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-white/[0.02] -rotate-12 transition-transform duration-700 group-hover:scale-110" />
                        <h3 className="text-xs font-black uppercase tracking-widest text-white mb-2 italic">Export Configuration</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-6">JSON / CSV / PDF</p>
                        <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-slate-300 focus:outline-none focus:border-soc-cyan/30 transition-all">
                            <option>Standard Forensic Report</option>
                            <option>Full Metadata Audit</option>
                            <option>Neural Pattern Analysis</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};
