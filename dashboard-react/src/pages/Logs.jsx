import React from 'react';
import { LogsTable } from '../components/LogsTable';
import { Terminal, ShieldAlert, FileText, Download, Filter, Search, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

const ActivityIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);

import { useUI } from '../context/UIContext';

export const Logs = () => {
    const { stats } = useUI();
    
    return (
        <div className="space-y-8 pb-12">
            <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-soc-accent/10 rounded-lg">
                            <Terminal className="w-5 h-5 text-soc-accent" />
                        </div>
                        <div className="h-px w-12 bg-white/5" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Forensic_Audit_Stack</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter leading-none uppercase italic">
                        Intelligence <span className="text-gradient">Audit Logs</span>
                    </h1>
                    <p className="text-slate-500 text-[10px] lg:text-xs font-black uppercase tracking-[0.3em]">Comprehensive telemetry stream from active inference clusters.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                        <input
                            placeholder="Filter by Node_ID..."
                            className="bg-white/[0.02] border border-white/[0.05] rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-soc-accent/20 transition-all w-64 uppercase tracking-widest"
                        />
                    </div>
                    <button className="soc-button soc-button-secondary py-3 px-6 rounded-xl border-white/5">
                        <Download className="w-4 h-4" />
                        <span className="text-[10px] uppercase font-black tracking-widest">Export_Audit</span>
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="xl:col-span-9">
                    <div className="glass-panel p-0 h-[700px] relative border-white/[0.03] bg-black/20">
                        <LogsTable />
                    </div>
                </div>

                <div className="xl:col-span-3 space-y-8">
                    {/* Summary Matrix */}
                    <div className="glass-panel p-8 space-y-6 border-white/[0.03]">
                        <div className="flex items-center gap-2 mb-2">
                            <ActivityIcon className="w-4 h-4 text-soc-accent" />
                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Audit_Summary</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Total_Inspections</span>
                                <span className="text-3xl font-black text-white tabular-nums tracking-tighter">{stats.scanned.toLocaleString()}</span>
                            </div>
                            <div className="h-px bg-white/[0.03]" />
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Neutralized_Threats</span>
                                <span className="text-3xl font-black text-soc-danger tabular-nums tracking-tighter">{stats.malicious.toLocaleString()}</span>
                            </div>
                            <div className="h-px bg-white/[0.03]" />
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Confidence_Interval</span>
                                <span className="text-3xl font-black text-soc-success tabular-nums tracking-tighter">99.2%</span>
                            </div>
                        </div>
                    </div>

                    {/* Alert Cluster */}
                    <div className="glass-panel p-8 bg-soc-danger/[0.02] border-soc-danger/10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-1.5 bg-soc-danger/10 rounded-lg">
                                <ShieldAlert className="w-4 h-4 text-soc-danger" />
                            </div>
                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-soc-danger">Critical Alerts</h3>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-400 font-medium">3 anomalous domain patterns detected in the last hour requiring immediate review.</p>
                        <button className="mt-6 w-full py-3 bg-soc-danger/10 border border-soc-danger/20 rounded-xl text-[10px] font-bold uppercase tracking-widest text-soc-danger hover:bg-soc-danger/20 transition-all flex items-center justify-center gap-2">
                            Investigate
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Tooling */}
                    <div className="glass-panel p-8 relative overflow-hidden group border-white/[0.03]">
                        <FileText className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-white/[0.02] -rotate-12 transition-transform duration-700 group-hover:scale-110" />
                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-white mb-6">Extraction Presets</h3>
                        <div className="space-y-3">
                            {['Standard PDF', 'Forensic CSV', 'JSON Raw Stream'].map(preset => (
                                <button key={preset} className="w-full flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {preset}
                                    <Download className="w-3 h-3 text-soc-accent/50" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

