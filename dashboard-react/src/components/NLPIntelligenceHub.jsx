import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Search, ShieldCheck, AlertCircle, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { clsx } from 'clsx';

export const NLPIntelligenceHub = () => {
    const { analyzeEmail, isNLPScanning, nlpResult } = useUI();
    const [content, setContent] = useState("");

    const handleScan = () => {
        if (!content.trim() || isNLPScanning) return;
        analyzeEmail(content);
    };

    return (
        <div className="glass-panel p-8 lg:p-10 relative overflow-hidden group">
            {/* Visual Accents */}
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <Mail className="w-48 h-48 text-soc-accent -rotate-12" />
            </div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-soc-accent/10 rounded-xl border border-soc-accent/20">
                        <Sparkles className="w-6 h-6 text-soc-accent" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">Email & Text Intel Hub</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">
                            Neural Scam Pattern Recognition Engine
                        </p>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Input Area */}
                    <div className="space-y-6">
                        <div className="relative">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Paste email content or suspicious message text here..."
                                className="w-full h-48 bg-black/40 border border-white/[0.05] rounded-2xl p-6 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-soc-accent/50 transition-all resize-none custom-scrollbar"
                            />
                            <div className="absolute bottom-4 right-4 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                                Neural Input Buffer
                            </div>
                        </div>

                        <button
                            onClick={handleScan}
                            disabled={!content.trim() || isNLPScanning}
                            className={clsx(
                                "w-full py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all",
                                isNLPScanning
                                    ? "bg-white/5 text-slate-500 cursor-not-allowed"
                                    : "bg-soc-accent text-black hover:shadow-[0_0_30px_rgba(var(--soc-accent-rgb),0.3)] active:scale-95"
                            )}
                        >
                            {isNLPScanning ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Analyzing Semantic Vectors...
                                </>
                            ) : (
                                <>
                                    <Search className="w-4 h-4" />
                                    Initiate Neural Scan
                                </>
                            )}
                        </button>
                    </div>

                    {/* Results Area */}
                    <div className="glass-panel bg-white/[0.02] border-white/[0.03] p-8 flex flex-col">
                        <AnimatePresence mode="wait">
                            {nlpResult ? (
                                <motion.div
                                    key="results"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-8 h-full flex flex-col"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Classification</div>
                                            <div className={clsx(
                                                "text-2xl font-black uppercase tracking-tighter italic",
                                                nlpResult.risk_score >= 65 ? "text-soc-danger" : (nlpResult.risk_score >= 35 ? "text-soc-warning" : "text-soc-success")
                                            )}>
                                                {nlpResult.classification}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Risk Index</div>
                                            <div className="text-3xl font-bold text-white tabular-nums">
                                                {Math.floor(nlpResult.risk_score)}%
                                            </div>
                                        </div>
                                    </div>

                                    {/* Risk Bar */}
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${nlpResult.risk_score}%` }}
                                            className={clsx(
                                                "h-full",
                                                nlpResult.risk_score >= 65 ? "bg-soc-danger" : (nlpResult.risk_score >= 35 ? "bg-soc-warning" : "bg-soc-success")
                                            )}
                                        />
                                    </div>

                                    {/* Findings */}
                                    <div className="flex-1 space-y-4">
                                        <h4 className="text-[10px] font-black text-soc-accent uppercase tracking-widest">Heuristic Findings</h4>
                                        <div className="space-y-3">
                                            {nlpResult.explanation && nlpResult.explanation.map((e, i) => (
                                                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.03]">
                                                    <ChevronRight className="w-3 h-3 mt-1 text-soc-accent flex-shrink-0" />
                                                    <span className="text-[11px] text-slate-400 leading-relaxed font-medium">{e}</span>
                                                </div>
                                            ))}
                                            {(!nlpResult.explanation || nlpResult.explanation.length === 0) && (
                                                <div className="text-xs text-slate-600 italic">No significant scam identifiers found.</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-soc-accent/10 flex items-center justify-center">
                                            <ShieldCheck className="w-4 h-4 text-soc-accent" />
                                        </div>
                                        <div className="text-[9px] font-bold text-slate-500 uppercase leading-tight">
                                            Verified by Feluda NLP Core<br />
                                            <span className="text-slate-700">Model: Logistic_Regression_v2.1</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="placeholder"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full flex flex-col items-center justify-center text-center space-y-4"
                                >
                                    <div className="w-16 h-16 rounded-3xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-slate-700">
                                        <Search className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Awaiting Feed</div>
                                        <p className="text-[10px] text-slate-700 max-w-[200px] leading-relaxed font-medium">
                                            Input text vectors to begin real-time semantic analysis.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};
