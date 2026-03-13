import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Clock, Terminal, Shield, ArrowRight, Globe as GlobeIcon, Search as SearchIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { useUI } from '../context/UIContext';
import { ForensicDossier } from './ForensicDossier';

export const LogsTable = ({ filterSource = null }) => {
    const { logs, refreshTelemetry } = useUI();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);

    const fetchLogs = async () => {
        setIsLoading(true);
        await refreshTelemetry();
        setIsLoading(false);
    };

    const filteredLogs = logs.filter(log => !filterSource || log.source === filterSource);

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
                        <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest px-1">
                            {filterSource === 'extension' ? 'Extension_Intercept_Stream' : 'Neural_Inference_Stream'}
                        </h3>
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
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead className="sticky top-0 z-10 bg-soc-surface border-b border-white/[0.05]">
                        <tr className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                            <th className="px-6 py-4">Timestamp</th>
                            <th className="px-6 py-4">Target Domain</th>
                            <th className="px-6 py-4 text-center">Score</th>
                            <th className="px-6 py-4">Classification</th>
                            <th className="px-6 py-4">Forensic Reasoning</th>
                            <th className="px-6 py-4 text-right">Source</th>
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
                                            <span className="text-soc-accent/50 uppercase tracking-[0.3em] font-black">Syncing_Forensic_Archive...</span>
                                        </div>
                                    </td>
                                </motion.tr>
                            ) : (
                                filteredLogs
                                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                                    .map((log, idx) => (
                                        <motion.tr
                                            key={log.id || idx}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.02 }}
                                            onClick={() => setSelectedLog(log)}
                                            className="hover:bg-soc-accent/5 transition-all group cursor-pointer border-l-2 border-transparent hover:border-soc-accent"
                                        >
                                            <td className="px-6 py-4 text-slate-500 tabular-nums">
                                                <div className="flex flex-col">
                                                    <span className="text-white/60">
                                                        {log.timestamp ? new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: '2-digit' }) : "---"}
                                                    </span>
                                                    <span className="text-[9px]">
                                                        {log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' }) : "--:--"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="flex items-center gap-2 text-white font-bold tracking-tight">
                                                    <GlobeIcon className="w-3.5 h-3.5 text-soc-accent/60 group-hover:scale-110 transition-transform" />
                                                    {log.domain || (log.input ? new URL(log.input).hostname : "Unknown")}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <span className={clsx(
                                                        "font-black tabular-nums scale-110",
                                                        (log.risk_score || log.result?.risk_score) > 70 ? "text-soc-danger" : ((log.risk_score || log.result?.risk_score) > 40 ? "text-soc-warning" : "text-soc-success")
                                                    )}>
                                                        {log.risk_score || log.result?.risk_score || 0}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={clsx(
                                                    "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                                                    (log.classification || log.result?.classification) === 'Malicious' ? "text-soc-danger bg-soc-danger/10 border border-soc-danger/20" :
                                                        ((log.classification || log.result?.classification) === 'Suspicious' ? "text-soc-warning bg-soc-warning/10 border border-soc-warning/20" : "text-soc-success bg-soc-success/10 border border-soc-success/20")
                                                )}>
                                                    {log.classification || log.result?.classification || 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1 max-w-[300px]">
                                                    {(log.explanation || log.result?.explanation) && (log.explanation || log.result?.explanation).length > 0 ? (
                                                        (log.explanation || log.result?.explanation).map((reason, ridx) => (
                                                            <span key={ridx} className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-[8px] text-slate-400">
                                                                {reason}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-slate-600 italic text-[9px]">Generic pattern match</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                               <div className="flex items-center justify-end gap-3 font-mono">
                                                    <span className={clsx(
                                                        "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-[0.1em]",
                                                        log.source === 'extension' || log.source === 'extension_heuristic' ? "text-soc-accent border border-soc-accent/20 bg-soc-accent/5" : "text-slate-500 border border-white/5 bg-white/5"
                                                     )}>
                                                         {log.source || 'SYSTEM'}
                                                    </span>
                                                    <ArrowRight className="w-3 h-3 text-slate-700 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                               </div>
                                            </td>
                                        </motion.tr>
                                    ))
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            <ForensicDossier 
                isOpen={!!selectedLog} 
                onClose={() => setSelectedLog(null)} 
                data={selectedLog ? {
                    url: selectedLog.input || selectedLog.url || selectedLog.domain,
                    classification: selectedLog.classification || selectedLog.result?.classification,
                    risk_score: selectedLog.risk_score || selectedLog.result?.risk_score || 0,
                    explanation: selectedLog.explanation || selectedLog.result?.explanation,
                    confidence_score: selectedLog.result?.confidence_score || '0.98',
                    raw_features: selectedLog.result?.raw_features,
                    source: selectedLog.source
                } : null}
            />

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
