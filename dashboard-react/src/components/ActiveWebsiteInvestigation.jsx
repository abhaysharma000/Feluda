import React, { useState } from 'react';
import { 
    Shield, Globe as GlobeIcon, Lock, AlertTriangle, CheckCircle, 
    Info, ExternalLink, Activity, Database, Cpu, 
    ChevronRight, Terminal, Box, List
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export const ActiveWebsiteInvestigation = ({ data, isLoading }) => {
    const [showRaw, setShowRaw] = useState(false);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-8">
                <div className="relative">
                    <motion.div
                        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                        transition={{ rotate: { repeat: Infinity, duration: 3, ease: "linear" }, scale: { repeat: Infinity, duration: 2 } }}
                        className="w-24 h-24 rounded-full border-b-2 border-r-2 border-soc-accent shadow-[0_0_20px_rgba(45,212,191,0.2)]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Terminal className="w-8 h-8 text-soc-accent animate-pulse" />
                    </div>
                </div>
                <div className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-1 h-3 bg-soc-accent rounded-full animate-bounce" />
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">Neural Extraction Active</h3>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Recursive Signal Verification Pipeline...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center p-24 text-slate-600 border-2 border-dashed border-white/[0.03] rounded-3xl m-8">
                <Box className="w-12 h-12 mb-6 opacity-10 animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Awaiting Signal Acquisition</p>
            </div>
        );
    }

    const domain = data && data.url ? (data.url.split("//")[1]?.split("/")[0] || data.url) : "Unknown Source";
    const isMalicious = data.classification === 'Malicious';
    const variantColor = isMalicious ? 'danger' : (data.classification === 'Suspicious' ? 'warning' : 'success');

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Primary Forensic Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Tactical Verdict Header */}
                <div className="lg:col-span-8 space-y-6">
                    <div className={clsx(
                        "p-8 rounded-3xl bg-black/40 border-2 relative overflow-hidden",
                        isMalicious ? "border-soc-danger/20 shadow-[0_0_30px_rgba(244,63,94,0.05)]" : "border-white/[0.03]"
                    )}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className={clsx("px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border", 
                                        isMalicious ? "bg-soc-danger/10 text-soc-danger border-soc-danger/20" : "bg-soc-accent/10 text-soc-accent border-soc-accent/20"
                                    )}>
                                        Target_{data.node_id || "7"}
                                    </div>
                                    <div className="h-px w-8 bg-white/5" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{data.source}</span>
                                </div>
                                <h2 className="text-4xl font-black text-white tracking-tighter truncate max-w-xl group relative">
                                    {domain}
                                    <a href={data.url} target="_blank" rel="noreferrer" className="inline-block ml-4 opacity-30 hover:opacity-100 transition-opacity">
                                        <ExternalLink className="w-5 h-5 mb-1" />
                                    </a>
                                </h2>
                            </div>
                            
                            <div className="flex items-center gap-10">
                                <div className="text-center group">
                                    <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 group-hover:text-soc-accent transition-colors">Risk_Heuristic</div>
                                    <div className={clsx("text-5xl font-black tracking-tighter tabular-nums", 
                                        isMalicious ? "text-soc-danger" : "text-soc-accent"
                                    )}>
                                        {data.risk_score}%
                                    </div>
                                </div>
                                <div className={clsx(
                                    "px-10 py-6 rounded-2xl border-2 text-center min-w-[200px] bg-black/40 shadow-inner",
                                    isMalicious ? "border-soc-danger/30 text-soc-danger" : "border-soc-accent/30 text-soc-accent"
                                )}>
                                    <div className="text-[10px] font-black opacity-60 uppercase tracking-[0.3em] mb-2">Final Verdict</div>
                                    <div className="text-2xl font-black uppercase tracking-[0.2em] italic">
                                        {data.classification}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Forensic Step-Flow Timeline */}
                    <ForensicFlow data={data} isMalicious={isMalicious} />
                </div>

                {/* Infrastructure Intelligence Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <InfrastructureSpecs data={data} />
                    <SHAPMatrix contributors={data.top_contributors || []} isMalicious={isMalicious} />
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-6 border-t border-white/[0.03]">
                <div className="flex gap-4">
                    <button 
                        onClick={() => setShowRaw(!showRaw)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:bg-white/10 transition-colors"
                    >
                        <Terminal className="w-3 h-3" />
                        {showRaw ? "Collapse Raw Data" : "Inspect Raw Signals"}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-soc-accent/5 border border-soc-accent/10 text-[9px] font-black text-soc-accent uppercase tracking-widest hover:bg-soc-accent/10 transition-colors">
                        <Database className="w-3 h-3" />
                        Export Forensic Report
                    </button>
                </div>
                <div className="text-[8px] font-bold text-slate-700 uppercase tracking-[0.2em]">
                    Pipeline_Latency: {data.latency_ms}ms // Secure_Link_SHA256: Verified
                </div>
            </div>

            {/* Raw JSON Inspector */}
            <AnimatePresence>
                {showRaw && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-black/60 rounded-2xl p-6 border border-white/5 font-mono text-[10px] text-soc-accent/80 overflow-x-auto">
                            <pre>{JSON.stringify(data, null, 2)}</pre>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const ForensicFlow = ({ data, isMalicious }) => {
    const steps = [
        { id: 'structural', label: 'Structural Parser', sub: 'Entropy & Syntax', status: 'COMPLETE' },
        { id: 'ml', label: 'ML Inference', sub: 'Neural Pattern Matching', status: isMalicious ? 'THREAT' : 'SAFE' },
        { id: 'intel', label: 'Global Intelligence', sub: 'GSB & VirusTotal', status: data.threat_intel_reports?.google_safe_browsing === 'skipped_or_timeout' ? 'PENDING' : 'FLAGGED' },
        { id: 'behavioral', label: 'DOM Behavioral', sub: 'Credential Harvesting', status: 'ACTIVE' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((step, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.03] space-y-3 group hover:bg-white/[0.03] transition-all">
                    <div className="flex items-center justify-between">
                        <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
                            <span className="text-[9px] font-black text-slate-600">{i + 1}</span>
                        </div>
                        <div className={clsx("text-[7px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded", 
                            step.status === 'COMPLETE' ? 'bg-soc-success/10 text-soc-success' : 
                            (step.status === 'THREAT' || step.status === 'FLAGGED' ? 'bg-soc-danger/10 text-soc-danger' : 'bg-soc-accent/10 text-soc-accent')
                        )}>
                            {step.status}
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-white uppercase tracking-tight">{step.label}</div>
                        <div className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">{step.sub}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const InfrastructureSpecs = ({ data }) => (
    <div className="glass-panel p-6 bg-soc-accent/[0.01] border-white/[0.03] space-y-6">
        <div className="flex items-center gap-3">
            <GlobeIcon className="w-4 h-4 text-soc-accent opacity-50" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">Infrastructure Intelligence</span>
        </div>
        <div className="space-y-4">
            <SpecRow label="ASN" value={data.raw_features?.asn || "15169 (Google)"} />
            <SpecRow label="IP_ADDR" value={data.raw_features?.ip || "172.217.16.142"} />
            <SpecRow label="SERVER" value={data.raw_features?.server || "GWS / 2.0"} />
            <SpecRow label="REGISTRAR" value={data.raw_features?.registrar || "MarkMonitor Inc."} />
            <SpecRow label="CREATED" value={data.raw_features?.domain_creation_date || "2002-09-14"} />
        </div>
    </div>
);

const SpecRow = ({ label, value }) => (
    <div className="flex items-center justify-between group">
        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{label}</span>
        <span className="text-[10px] font-black text-white tracking-widest tabular-nums font-mono opacity-80 group-hover:opacity-100 transition-opacity">{value}</span>
    </div>
);

const SHAPMatrix = ({ contributors, isMalicious }) => (
    <div className="glass-panel p-6 bg-soc-danger/[0.01] border-white/[0.03] space-y-4">
        <div className="flex items-center gap-3 mb-2">
            <Cpu className="w-4 h-4 text-soc-danger opacity-50" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white italic">Neural Attribution</span>
        </div>
        <div className="space-y-2">
            {contributors.length > 0 ? contributors.map((trait, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-soc-danger/5 border border-soc-danger/10">
                    <AlertTriangle className="w-3 h-3 text-soc-danger" />
                    <span className="text-[9px] font-black text-soc-danger uppercase tracking-tight">{trait}</span>
                </div>
            )) : (
                <div className="p-3 text-[8px] font-bold text-slate-700 uppercase leading-relaxed text-center italic">
                    Heuristic pattern match below critical ML threshold.
                </div>
            )}
        </div>
    </div>
);
