import React from 'react';
import { Shield, Globe, Lock, AlertTriangle, CheckCircle, Info, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export const ActiveWebsiteInvestigation = ({ data, isLoading }) => {
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
                    <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] animate-pulse">Running Forensic Scan</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Analyzing structural entropy & WHOIS records...</p>
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
    const statusBorder = isMalicious ? 'border-soc-danger/20' : (isSuspicious ? 'border-soc-warning/20' : 'border-soc-success/20');

    const domain = data.url.split("//")[-1].split("/")[0];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
        >
            {/* SOC Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-8 rounded-3xl bg-black/40 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-soc-accent/5 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                
                <div className="space-y-3 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-soc-accent animate-pulse" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Forensic Target</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-black text-white tracking-tighter truncate max-w-md">{domain}</h2>
                        <a href={data.url} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 transition-all border border-white/5">
                            <ExternalLink className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                <div className="flex items-center gap-8 relative z-10">
                    <div className="text-right space-y-1">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Risk Score</div>
                        <div className={clsx("text-5xl font-black tabular-nums tracking-tighter", statusColor)}>{data.risk_score}%</div>
                    </div>
                    <div className={clsx("px-8 py-5 rounded-2xl border bg-black/40 text-center min-w-[160px]", statusBorder)}>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Investigation Verdict</div>
                        <div className={clsx("text-lg font-black uppercase tracking-[0.2em]", statusColor)}>
                            {data.classification}
                        </div>
                    </div>
                </div>
            </div>

            {/* Forensic Detail Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard label="Confidence" value={`${(data.confidence_score || 0).toFixed(1)}%`} icon={Shield} />
                <MetricCard label="Domain Age" value={`${data.raw_features?.domain_age_days ?? '---'} Days`} icon={Globe} />
                <MetricCard label="Registrar" value={data.raw_features?.registrar ?? 'Unknown'} icon={Info} subtext />
                <MetricCard label="Country" value={data.raw_features?.country ?? 'N/A'} icon={Globe} />
            </div>

            {/* Behavioral Indicators */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-soc-accent shadow-[0_0_8px_rgba(45,212,191,0.4)]" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">ML Intelligence Indicators</h3>
                    <div className="h-px flex-1 bg-white/[0.03]" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.explanation?.map((reason, i) => (
                        <IndicatorItem key={i} reason={reason} isMalicious={isMalicious} />
                    ))}
                    {(!data.explanation || data.explanation.length === 0) && (
                        <div className="col-span-2 flex items-center gap-4 p-5 rounded-2xl bg-soc-success/5 border border-soc-success/10">
                            <CheckCircle className="w-5 h-5 text-soc-success" />
                            <span className="text-[11px] font-black text-soc-success uppercase tracking-[0.1em]">No anomalous behavioral patterns identified in current intelligence sweep.</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const MetricCard = ({ label, value, icon: Icon, subtext = false }) => (
    <div className="glass-panel p-6 bg-white/[0.01] border-white/[0.03] hover:bg-white/[0.03] transition-all group">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-soc-accent/5 rounded-lg border border-white/5 opacity-40 group-hover:opacity-100 transition-opacity">
                <Icon className="w-4 h-4 text-soc-accent" />
            </div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</h3>
        </div>
        <div className={clsx("text-lg font-black text-white tracking-tight", subtext && "text-sm truncate")}>{value}</div>
    </div>
);

const IndicatorItem = ({ reason, isMalicious }) => (
    <div className="flex items-start gap-5 p-5 rounded-2xl bg-white/[0.01] border border-white/[0.03] group hover:border-white/10 transition-all">
        <div className={clsx("mt-0.5 p-2 rounded-xl bg-white/5", isMalicious ? "text-soc-danger" : "text-soc-accent")}>
            <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="space-y-1">
            <span className="text-[11px] font-black leading-relaxed text-slate-200 uppercase tracking-tight block">{reason}</span>
            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Confidence: HIGH</span>
        </div>
    </div>
);
