import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, Microchip, ArrowRight, ShieldAlert } from 'lucide-react';
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

    const { risk_score, classification, top_contributors, explanation, raw_features } = scanResult;
    const isMalicious = risk_score > 70;
    const isSuspicious = risk_score > 40 && risk_score <= 70;

    const accentColor = isMalicious ? '#FF3B3B' : (isSuspicious ? '#FACC15' : '#10b981');
    const badgeClass = isMalicious
        ? 'bg-danger/20 text-danger border-danger/30'
        : (isSuspicious ? 'bg-warning/20 text-warning border-warning/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30');

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 lg:p-8 bg-black/80 backdrop-blur-2xl overflow-hidden">
            <motion.div
                ref={modalRef}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-5xl glass-card overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-cyan-accent/10 flex items-center justify-center text-cyan-accent">
                            <Cpu className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold">Neural Core Investigation</h2>
                    </div>
                    <button
                        onClick={() => setIsShowcaseOpen(false)}
                        className="w-10 h-10 rounded-full hover:bg-white/10 transition-all text-slate-400 hover:text-white flex items-center justify-center"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col items-center justify-center p-12 glass-card bg-black/20 border-white/5">
                        <div className="relative w-48 h-48 mb-8">
                            <svg className="w-full h-full -rotate-90">
                                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                                <motion.circle
                                    cx="96" cy="96" r="88"
                                    stroke={accentColor}
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray="552.92"
                                    initial={{ strokeDashoffset: 552.92 }}
                                    animate={{ strokeDashoffset: 552.92 - (552.92 * (risk_score / 100)) }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-5xl font-black text-white"
                                >
                                    {Math.floor(risk_score)}%
                                </motion.span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Risk Score</span>
                            </div>
                        </div>

                        <div className={clsx("px-8 py-2 rounded-full font-black text-sm uppercase tracking-widest border", badgeClass)}>
                            {classification.toUpperCase()}
                        </div>

                        <button
                            onClick={() => setIsDrawerOpen(true)}
                            className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase text-cyan-accent hover:text-white transition-colors tracking-widest"
                        >
                            Examine Raw Vectors <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-accent italic">Structural Root Causes</h4>
                            <div className="grid gap-3">
                                {top_contributors.map((c, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 + (i * 0.1) }}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        <Microchip className="w-4 h-4 text-cyan-accent" />
                                        <span className="text-xs font-bold text-white tracking-wide">{c}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Neural Explanation</h4>
                            <ul className="space-y-3">
                                {explanation.map((e, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 + (i * 0.1) }}
                                        className="flex items-start gap-3 text-sm text-slate-400"
                                    >
                                        <ArrowRight className="w-3.5 h-3.5 mt-1 text-slate-600 flex-shrink-0" />
                                        <span className="leading-relaxed">{e}</span>
                                    </motion.li>
                                ))}
                            </ul>
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
