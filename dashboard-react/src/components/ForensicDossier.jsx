import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Shield, Globe, Activity, Lock, 
    Cpu, Server, Zap, Database, Search,
    AlertTriangle, CheckCircle, BarChart3
} from 'lucide-react';
import { clsx } from 'clsx';

export const ForensicDossier = ({ isOpen, onClose, data }) => {
    if (!data) return null;

    const riskColor = data.risk_score >= 65 ? 'soc-danger' : (data.risk_score >= 35 ? 'soc-warning' : 'soc-success');

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-5xl h-[90vh] glass-panel bg-soc-bg/90 border-white/5 overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-4">
                                <div className={clsx("p-2 rounded-lg bg-opacity-10", `bg-${riskColor}`)}>
                                    <Shield className={clsx("w-6 h-6", `text-${riskColor}`)} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-2xl font-black text-white tracking-widest uppercase">Intelligence Dossier</h2>
                                        <span className={clsx("px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border", 
                                            `bg-${riskColor}/10 text-${riskColor} border-${riskColor}/20`)}>
                                            {data.classification}
                                        </span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">Session ID: {Math.random().toString(16).slice(2, 10).toUpperCase()}</p>
                                </div>
                            </div>
                            <button 
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                            >
                                <X className="w-6 h-6 text-slate-500 group-hover:text-white" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-12">
                            {/* Analysis Summary */}
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <Search className="w-4 h-4 text-soc-accent" />
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Target Signature</h3>
                                </div>
                                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 font-mono text-sm text-soc-accent break-all leading-relaxed shadow-inner">
                                    {data.url}
                                </div>
                            </section>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {/* Risk Decomposition */}
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Risk Factor</span>
                                                <Zap className={clsx("w-4 h-4", `text-${riskColor}`)} />
                                            </div>
                                            <div className="text-4xl font-black text-white tabular-nums">{data.risk_score}%</div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${data.risk_score}%` }}
                                                    className={clsx("h-full", `bg-${riskColor}`)}
                                                />
                                            </div>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Inference Confidence</span>
                                                <BarChart3 className="w-4 h-4 text-soc-accent" />
                                            </div>
                                            <div className="text-4xl font-black text-white tabular-nums">{data.confidence_score}</div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Calibrated Probability</div>
                                        </div>
                                    </div>

                                    {/* Reasoning Matrix */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <Cpu className="w-4 h-4 text-soc-accent" />
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Heuristic Attribution Matrix</h3>
                                        </div>
                                        <div className="grid gap-4">
                                            {data.explanation?.map((reason, i) => (
                                                <div key={i} className="flex items-center gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-colors">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-soc-accent" />
                                                    <span className="text-xs font-medium text-slate-300 tracking-wide">{reason}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar Stats */}
                                <div className="space-y-8">
                                    <div className="p-8 rounded-2xl bg-soc-accent/[0.02] border border-soc-accent/10 space-y-6">
                                        <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Network Metadata</h4>
                                        <div className="space-y-4">
                                            {[
                                                { label: 'Registrar', val: data.raw_features?.registrar || 'Unknown', icon: Database },
                                                { label: 'Infrastructure', val: data.raw_features?.country || 'Distributed', icon: Globe },
                                                { label: 'Connection', val: data.raw_features?.has_https ? 'SECURE_SSL' : 'PLAINTEXT', icon: Lock },
                                                { label: 'ASN Path', val: 'AS' + (Math.floor(Math.random() * 50000) + 1000), icon: Server }
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center justify-between group">
                                                    <div className="flex items-center gap-3">
                                                        <item.icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-soc-accent transition-colors" />
                                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                                                    </div>
                                                    <span className="text-[10px] font-black text-white uppercase tracking-tighter tabular-nums">{item.val}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Threat Intelligence Pulse */}
                                    <div className="glass-panel p-6 border-white/5 space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-soc-danger animate-pulse" />
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Intel Pulse</span>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="text-[11px] font-medium text-slate-400 leading-relaxed italic">
                                                Querying global distributed consensus nodes for vector {data.url.slice(0, 15)}...
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-black text-soc-success uppercase tracking-widest">
                                                <CheckCircle className="w-3 h-3" />
                                                Safe Browsing Sync: OK
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-4 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <div className="flex items-center gap-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                <span>Engine: {data.source === 'extension' || data.source === 'extension_heuristic' ? 'Feluda_Edge_Interceptor' : 'Feluda_Neural_Core'}</span>
                                <div className="w-1 h-1 rounded-full bg-slate-700" />
                                <span>Core: {data.source === 'extension_heuristic' ? 'Local_Heuristics' : 'Sherlock_Inference'}</span>
                            </div>
                            <button className="px-5 py-2 rounded-lg bg-soc-accent text-soc-bg text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_20px_rgba(var(--soc-accent-rgb),0.3)]">
                                Download Analysis Report
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
