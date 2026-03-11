import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Clock, Terminal, Shield, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { useUI } from '../context/UIContext';

export const LogsTable = () => {
    const { logs, refreshTelemetry } = useUI();
    const [isLoading, setIsLoading] = useState(false);

    const fetchLogs = async () => {
        setIsLoading(true);
        await refreshTelemetry();
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col h-full glass-panel border-white/[0.03] overflow-hidden">
            {/* Terminal Header */}
            <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-soc-danger/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-soc-warning/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-soc-success/40" />
                    </div>
                    <div className="h-4 w-px bg-white/10 mx-2" />
                    <div className="flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-slate-500" />
                        <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest px-1">Neural_Inference_Stream</h3>
                    </div>
                </div>
                <button
                    onClick={fetchLogs}
                    disabled={isLoading}
                    className="soc-button soc-button-secondary py-1.5 px-3 rounded-lg text-[10px] uppercase tracking-wider"
                >
                    <RefreshCcw className={clsx("w-3 h-3", isLoading && "animate-spin")} />
                    Refresh
                </button>
            </div>

            {/* Table Container */}
            <div className="flex-1 overflow-auto terminal-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="sticky top-0 z-10 bg-soc-surface border-b border-white/[0.05]">
                        <tr className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                            <th className="px-6 py-4">Timestamp</th>
                            <th className="px-6 py-4">Node_Identifier</th>
                            <th className="px-6 py-4">Vector_Source</th>
                            <th className="px-6 py-4">Source</th>
                            <th className="px-6 py-4">Risk_Idx</th>
                            <th className="px-6 py-4">System_Verdict</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="text-[11px] font-mono divide-y divide-white/[0.02]">
                        <AnimatePresence mode="popLayout">
                            {isLoading ? (
                                <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    key="loading"
                                >
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-0.5 bg-soc-accent/20 overflow-hidden relative">
                                                <motion.div
                                                    animate={{ left: ['-100%', '100%'] }}
                                                    transition={{ repeat: Infinity, duration: 1 }}
                                                    className="absolute top-0 bottom-0 w-1/2 bg-soc-accent"
                                                />
                                            </div>
                                            <span className="text-soc-accent/50 uppercase tracking-[0.3em] font-sans font-bold">Resyncing_Matrix...</span>
                                        </div>
                                    </td>
                                </motion.tr>
                            ) : (
                                [...logs]
                                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                                    .map((log, idx) => (
                                        <motion.tr
                                            key={log.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-white/[0.02] transition-colors group cursor-default"
                                    >
                                        <td className="px-6 py-3.5 text-slate-500 tabular-nums">
                                            [{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <span className="flex items-center gap-1.5 text-slate-300">
                                                <Shield className="w-3 h-3 text-soc-accent/40" />
                                                {log.node}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5 text-slate-400">
                                            <span className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/5 group-hover:border-white/10 transition-colors">
                                                {log.vector}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <span className={clsx(
                                                "px-2 py-0.5 rounded-md text-[9px] font-bold uppercase",
                                                log.source === 'extension' ? "text-soc-accent bg-soc-accent/10 border border-soc-accent/20" : "text-slate-400 bg-white/5 border border-white/10"
                                            )}>
                                                {log.source || 'manual'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1 bg-white/5 w-12 rounded-full overflow-hidden">
                                                    <div
                                                        className={clsx("h-full", log.risk > 70 ? "bg-soc-danger" : (log.risk > 40 ? "bg-soc-warning" : "bg-soc-success"))}
                                                        style={{ width: `${log.risk}%` }}
                                                    />
                                                </div>
                                                <span className={clsx(
                                                    "font-bold min-w-[3ch] text-right",
                                                    log.risk > 70 ? "text-soc-danger" : (log.risk > 40 ? "text-soc-warning" : "text-soc-success")
                                                )}>
                                                    {log.risk}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <span className={clsx(
                                                "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider",
                                                log.verdict === 'Malicious' ? "text-soc-danger bg-soc-danger/10 border border-soc-danger/20" :
                                                    (log.verdict === 'Suspicious' ? "text-soc-warning bg-soc-warning/10 border border-soc-warning/20" : "text-soc-success bg-soc-success/10 border border-soc-success/20")
                                            )}>
                                                {log.verdict}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ArrowRight className="w-3.5 h-3.5 text-soc-accent inline" />
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Terminal Footer */}
            <div className="px-6 py-2 border-t border-white/[0.05] bg-black/10 flex items-center justify-between text-[8px] font-bold text-slate-600 uppercase tracking-widest">
                <span>Buffer Index: 0x82f4...a32</span>
                <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-soc-success animate-pulse" />
                    Link Established
                </span>
            </div>
        </div>
    );
};
