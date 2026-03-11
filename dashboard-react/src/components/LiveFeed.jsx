import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Terminal as TerminalIcon, Shield } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { clsx } from 'clsx';

export const LiveFeed = () => {
    const { logs, isSimulationMode, isPlaybackPaused } = useUI();
    const terminalRef = useRef(null);

    // Auto-scroll to top when a new log arrives
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = 0;
        }
    }, [logs]);

    return (
        <div className="flex flex-col h-full font-mono">
            <div className="flex-1 overflow-y-auto space-y-3 terminal-scrollbar pr-2 pt-2">
                <AnimatePresence initial={false}>
                    {logs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={clsx(
                                "flex flex-col gap-2.5 p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group",
                                log.verdict === 'Malicious'
                                    ? "bg-soc-danger/[0.03] border-soc-danger/20"
                                    : log.verdict === 'Suspicious'
                                        ? "bg-soc-warning/[0.03] border-soc-warning/20"
                                        : "bg-white/[0.01] border-white/[0.03] hover:bg-white/[0.02] hover:border-white/[0.08]"
                            )}
                        >
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-bold text-slate-600 tabular-nums">
                                        [{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
                                    </span>
                                    <div className="flex items-center gap-1.5 translate-y-[0.5px]">
                                        <Shield className={clsx("w-2.5 h-2.5",
                                            log.source === 'extension' ? 'text-soc-accent' :
                                            log.verdict === 'Malicious' ? 'text-soc-danger' :
                                                log.verdict === 'Suspicious' ? 'text-soc-warning' : 'text-soc-accent/50'
                                        )} />
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{log.node}</span>
                                            <span className={clsx(
                                                "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase",
                                                log.source === 'extension' ? "bg-soc-accent/10 text-soc-accent border border-soc-accent/20" : "bg-white/5 text-slate-600 border border-white/5"
                                            )}>
                                                {log.source || 'manual'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <span className={clsx(
                                    "px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-widest",
                                    log.verdict === 'Malicious' ? "bg-soc-danger text-white" :
                                        log.verdict === 'Suspicious' ? "bg-soc-warning text-black" : "bg-white/5 text-slate-500 border border-white/5"
                                )}>
                                    {log.verdict}
                                </span>
                            </div>

                            <div className="pl-4 border-l border-white/[0.05] relative z-10">
                                <p className={clsx(
                                    "text-[10px] font-medium leading-relaxed break-all uppercase tracking-widest",
                                    log.verdict === 'Malicious' ? "text-soc-danger/90" : "text-slate-300"
                                )}>
                                    <span className="text-slate-600 mr-2 opacity-50">#</span>
                                    {log.vector}
                                </p>
                            </div>

                            <div className="flex items-center gap-4 mt-1 opacity-40 group-hover:opacity-100 transition-opacity relative z-10">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-slate-700" />
                                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Risk Index:</span>
                                    <span className={clsx("text-[9px] font-bold tabular-nums",
                                        log.risk >= 65 ? 'text-soc-danger' : (log.risk >= 35 ? 'text-soc-warning' : 'text-soc-success')
                                    )}>{log.risk}%</span>
                                </div>
                                <div className="hidden md:flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-slate-700" />
                                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Inference:</span>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tabular-nums">Neural v2.1.0</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {logs.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center py-20 opacity-20">
                        <TerminalIcon className="w-12 h-12 mb-6 text-slate-500" />
                        <p className="text-[9px] font-bold uppercase tracking-[0.4em]">Listening for telemetry...</p>
                    </div>
                )}
            </div>

            <div className="mt-6 pt-6 border-t border-white/[0.03] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Activity className="w-3.5 h-3.5 text-soc-accent animate-pulse" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Neural Sync Stable</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                        <div className={clsx("w-1 h-1 rounded-full", isSimulationMode ? "bg-soc-warning" : "bg-soc-success")} />
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{isSimulationMode ? "Sim_Active" : "Prod_Live"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
