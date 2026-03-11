import React from 'react';
import { Shield, Globe, Lock, AlertTriangle, CheckCircle, Info, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export const InvestigationResults = ({ data, isLoading }) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-6">
                <div className="relative">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="w-20 h-20 rounded-full border-2 border-dashed border-soc-accent/30"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-soc-accent animate-pulse" />
                    </div>
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] animate-pulse">Analyzing Target Vector</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Running neural signature matching...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-slate-600">
                <Globe className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Awaiting investigation target...</p>
            </div>
        );
    }

    const isMalicious = data.classification === 'Malicious';
    const isSuspicious = data.classification === 'Suspicious';
    const statusColor = isMalicious ? 'text-soc-danger' : (isSuspicious ? 'text-soc-warning' : 'text-soc-success');
    const statusBg = isMalicious ? 'bg-soc-danger/10' : (isSuspicious ? 'bg-soc-warning/10' : 'bg-soc-success/10');
    const statusBorder = isMalicious ? 'border-soc-danger/20' : (isSuspicious ? 'border-soc-warning/20' : 'border-soc-success/20');

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* Header: Core Verdict */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Target Domain</span>
                        <div className="h-px w-8 bg-white/5" />
                    </div>
                    <div className="flex items-center gap-3 overflow-hidden">
                        <h2 className="text-2xl font-bold text-white tracking-tight truncate">{data.url}</h2>
                        <a href={data.url} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 transition-colors">
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right space-y-1">
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Risk_Score</div>
                        <div className={clsx("text-4xl font-black tabular-nums tracking-tighter", statusColor)}>{data.risk_score}%</div>
                    </div>
                    <div className={clsx("px-6 py-4 rounded-xl border text-center min-w-[140px] bg-black/20", statusBorder)}>
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">System_Verdict</div>
                        <div className={clsx("text-sm font-black uppercase tracking-[0.2em]", statusColor)}>
                            {data.classification}
                        </div>
                    </div>
                </div>
            </div>

            {/* Forensic Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-5 bg-white/[0.01] border-white/[0.03]">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-4 h-4 text-soc-accent" />
                        <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Integrity</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-500 font-bold uppercase">Confidence</span>
                            <span className="text-xs font-bold text-white tracking-tight">{data.confidence_score}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-500 font-bold uppercase">Latency</span>
                            <span className="text-xs font-bold text-slate-400 tabular-nums">{data.latency_ms}ms</span>
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-5 bg-white/[0.01] border-white/[0.03]">
                    <div className="flex items-center gap-3 mb-4">
                        <Globe className="w-4 h-4 text-soc-accent" />
                        <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Identity</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-500 font-bold uppercase">Domain Age</span>
                            <span className="text-xs font-bold text-white tracking-tight">{data.raw_features?.domain_age_days ?? 'N/A'} Days</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-500 font-bold uppercase">Registrar</span>
                            <span className="text-xs font-bold text-white tracking-tight truncate ml-4" title={data.raw_features?.registrar}>{data.raw_features?.registrar ?? 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-500 font-bold uppercase">Country</span>
                            <span className="text-xs font-bold text-white tracking-tight">{data.raw_features?.country ?? 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-500 font-bold uppercase">SSL Secured</span>
                            {data.raw_features?.has_https ? 
                                <CheckCircle className="w-3.5 h-3.5 text-soc-success" /> : 
                                <AlertTriangle className="w-3.5 h-3.5 text-soc-danger" />
                            }
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-5 bg-white/[0.01] border-white/[0.03]">
                    <div className="flex items-center gap-3 mb-4">
                        <Info className="w-4 h-4 text-soc-accent" />
                        <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Telemetry</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-500 font-bold uppercase">Entropy</span>
                            <span className="text-xs font-bold text-white tabular-nums">{data.raw_features?.entropy?.toFixed(2) ?? '0.00'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-500 font-bold uppercase">Subdomains</span>
                            <span className="text-xs font-bold text-white tabular-nums">{data.raw_features?.subdomain_count ?? 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Structural & Behavioral Indicators */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-soc-accent shadow-[0_0_8px_rgba(45,212,191,0.4)]" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Forensic_Indicators_Detected</h3>
                    <div className="h-px flex-1 bg-white/[0.03]" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.explanation?.map((reason, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] group hover:border-white/10 transition-colors">
                            <div className={clsx("mt-0.5 p-1 rounded bg-white/5", isMalicious ? "text-soc-danger" : "text-soc-accent")}>
                                <AlertTriangle className="w-3 h-3" />
                            </div>
                            <span className="text-[10px] font-bold leading-relaxed text-slate-300 uppercase tracking-tight">{reason}</span>
                        </div>
                    ))}
                    {(!data.explanation || data.explanation.length === 0) && (
                        <div className="col-span-2 flex items-center gap-4 p-4 rounded-xl bg-soc-success/5 border border-soc-success/10">
                            <CheckCircle className="w-4 h-4 text-soc-success" />
                            <span className="text-[10px] font-bold text-soc-success uppercase tracking-widest">No structural anomalies identified in current signature matrix.</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
