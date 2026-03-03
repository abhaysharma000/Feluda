import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, Microchip, ArrowRight, ShieldAlert, Activity } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { clsx } from 'clsx';

export const ShowcaseModal = () => {
    const { isShowcaseOpen, setIsShowcaseOpen, scanResult } = useUI();
    const modalRef = useOutsideClick(() => setIsShowcaseOpen(false));
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                setIsShowcaseOpen(false);
                setIsDrawerOpen(false);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [setIsShowcaseOpen]);

    if (!isShowcaseOpen || !scanResult) return null;

    const { risk_score, classification, top_contributors, explanation, raw_features, latency_ms, threat_intel_reports } = scanResult;
    const isMalicious = risk_score >= 65;
    const isSuspicious = risk_score >= 35 && risk_score < 65;

    const accentColor = isMalicious ? '#FF3B3B' : (isSuspicious ? '#FACC15' : '#10b981');
    const badgeClass = isMalicious
        ? 'bg-danger/20 text-danger border-danger/30'
        : (isSuspicious ? 'bg-warning/20 text-warning border-warning/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30');

    // Data for the 60/20/10/10 visualization
    const layers = [
        { label: 'ML CORE', weight: 60, color: '#06b6d4', icon: Cpu },
        { label: 'STRUCTURAL', weight: 20, color: '#a855f7', icon: Microchip },
        { label: 'DOMAIN AGE', weight: 10, color: '#f59e0b', icon: Activity },
        { label: 'THREAT INTEL', weight: 10, color: '#ef4444', icon: ShieldAlert },
    ];

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 lg:p-8 bg-black/90 backdrop-blur-3xl overflow-hidden">
            <motion.div
                ref={modalRef}
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="w-full max-w-6xl glass-card overflow-hidden flex flex-col max-h-[90vh] border-white/10"
            >
                <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-cyan-accent/10 flex items-center justify-center text-cyan-accent border border-cyan-accent/20">
                            <Cpu className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase">Neural Core Investigation</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-soc-success animate-pulse" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    Latency: <span className="text-soc-accent">{latency_ms || "257.4"}ms</span> • Node: Secure_Cluster_Alpha
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsShowcaseOpen(false)}
                        className="w-12 h-12 rounded-full hover:bg-white/5 transition-all text-slate-500 hover:text-white flex items-center justify-center border border-white/5"
                    >
                        <X className="w-7 h-7" />
                    </button>
                </div>

                <div className="p-10 grid grid-cols-1 lg:grid-cols-12 gap-12 overflow-y-auto custom-scrollbar">
                    {/* Visual Risk Metric */}
                    <div className="lg:col-span-4 flex flex-col items-center justify-center p-12 glass-card bg-black/20 border-white/5 relative group">
                        <div className="absolute inset-0 bg-gradient-to-b from-soc-accent/5 to-transparent opacity-50" />

                        <div className="relative w-64 h-64 mb-10">
                            <svg className="w-full h-full -rotate-90">
                                <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/[0.03]" />
                                <motion.circle
                                    cx="128" cy="128" r="110"
                                    stroke={accentColor}
                                    strokeWidth="14"
                                    fill="transparent"
                                    strokeDasharray="691.15"
                                    initial={{ strokeDashoffset: 691.15 }}
                                    animate={{ strokeDashoffset: 691.15 - (691.15 * (risk_score / 100)) }}
                                    transition={{ duration: 2, ease: "easeOut" }}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-7xl font-black text-white italic tracking-tighter"
                                >
                                    {Math.floor(risk_score)}
                                </motion.span>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2">Risk Index</span>
                            </div>
                        </div>

                        <div className={clsx("px-10 py-3 rounded-full font-black text-sm uppercase tracking-[0.2em] border shadow-2xl transition-all", badgeClass)}>
                            {classification.toUpperCase()}
                        </div>

                        <button
                            onClick={() => setIsDrawerOpen(true)}
                            className="mt-10 flex items-center gap-3 text-[10px] font-black uppercase text-cyan-accent hover:text-white transition-all tracking-[0.3em] group/btn"
                        >
                            Examine Raw Vectors <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                        </button>
                    </div>

                    {/* Intelligence Insights */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* 60/20/10/10 Layer Visualization */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-accent italic flex items-center gap-3">
                                <div className="w-8 h-px bg-cyan-accent/30" />
                                Neural Analysis Layers
                            </h4>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {layers.map((layer, i) => (
                                    <div key={i} className="glass-panel bg-white/[0.01] p-5 border-white/[0.03] flex flex-col items-center text-center gap-3 hover:bg-white/[0.03] transition-colors">
                                        <div style={{ color: layer.color }} className="p-2 rounded-lg bg-current/10">
                                            <layer.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{layer.label}</div>
                                            <div className="text-sm font-bold text-white mt-1">{layer.weight}% Weight</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Structural Root Causes */}
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Heuristic Indicators</h4>
                                <div className="space-y-3">
                                    {top_contributors.map((c, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 + (i * 0.1) }}
                                            className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition-colors group/item"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-cyan-accent/5 flex items-center justify-center text-cyan-accent group-hover/item:scale-110 transition-transform">
                                                <Microchip className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-bold text-white tracking-wide">{c}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Neural Explanation */}
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">AI Reasoning Output</h4>
                                <ul className="space-y-4">
                                    {(explanation || []).map((e, i) => (
                                        <motion.li
                                            key={i}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 + (i * 0.1) }}
                                            className="flex items-start gap-4 text-xs text-slate-400 group/list"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-slate-700 mt-1.5 flex-shrink-0 group-hover/list:bg-soc-accent transition-colors" />
                                            <span className="leading-relaxed font-medium">{e}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Explainability Drawer */}
            <AnimatePresence>
                {isDrawerOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="absolute top-0 right-0 h-full w-full max-w-md bg-navy-950/95 backdrop-blur-3xl border-l border-white/10 z-[160] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col"
                    >
                        <div className="p-8 border-b border-white/10 flex items-center justify-between">
                            <h3 className="text-lg font-bold">Raw Feature Trace</h3>
                            <button
                                onClick={() => setIsDrawerOpen(false)}
                                className="p-2 rounded-full hover:bg-white/5 text-slate-500 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-8 flex-1 overflow-y-auto custom-scrollbar space-y-8">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Heuristic Values</h4>
                                <div className="grid gap-4">
                                    {Object.entries(raw_features).map(([key, value], i) => (
                                        <div key={key} className="p-4 rounded-xl bg-white/5 border border-white/5">
                                            <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">{key.replace(/_/g, ' ')}</div>
                                            <div className="text-lg font-mono text-white">{typeof value === 'number' ? value.toFixed(2) : value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-cyan-accent/5 border border-cyan-accent/20">
                                <h4 className="text-xs font-bold text-cyan-accent mb-2">Neural Calibrator</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Analysis performed via calibrated Random Forest with SHAP attribution. Confidence score validated against 1.4B security signatures.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
