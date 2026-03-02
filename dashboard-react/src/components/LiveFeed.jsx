import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Terminal as TerminalIcon } from 'lucide-react';
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
        <div className="flex flex-col h-full font-mono text-[11px]">
            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2 pt-2">
                <AnimatePresence initial={false}>
                    {logs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={clsx(
                                "flex flex-col gap-1 p-3 rounded-lg border transition-all duration-300 group",
                                log.verdict === 'Malicious'
                                    ? "bg-danger/10 border-danger/20 text-danger shadow-[0_0_15px_rgba(239,68,68,0.05)]"
                                    : "bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/10"
                            )}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <span className={clsx(
                                        "w-1.5 h-1.5 rounded-full",
                                        log.verdict === 'Malicious' ? "bg-danger animate-pulse" : "bg-emerald-500"
                                    )} />
                                    <span className="font-black text-white/40">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                                    <span className="font-bold tracking-tighter uppercase whitespace-nowrap">{log.node}</span>
                                </div>
                                <span className={clsx(
                                    "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                                    log.verdict === 'Malicious' ? "bg-danger text-white" : "bg-emerald-500/20 text-emerald-500"
                                )}>
                                    {log.verdict}
                                </span>
                            </div>
                            <div className="pl-3.5 space-y-1">
                                <p className="text-white/80 font-medium leading-relaxed break-all">
                                    <span className="text-slate-500 mr-1 opacity-50">$</span>
                                    {log.vector}
                                </p>
                                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[9px] font-bold text-slate-600 uppercase">Entropy: {(log.risk / 20).toFixed(2)}</span>
                                    <span className="text-[9px] font-bold text-slate-600 uppercase">Risk: {log.risk}%</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {logs.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-700 italic opacity-40 py-20">
                        <TerminalIcon className="w-8 h-8 mb-4 stroke-1" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Awaiting Uplink...</p>
                    </div>
                )}
            </div>

            {/* Bottom Status Status Bar for terminal */}
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-bold text-slate-600 uppercase tracking-widest bg-gradient-to-t from-black/20 to-transparent">
                <div className="flex items-center gap-2">
                    <Activity className="w-3 h-3 text-cyan-accent" />
                    <span>Neural Sync: Live</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5">
                        <div className={clsx("w-1 h-1 rounded-full", isSimulationMode ? "bg-warning animate-pulse" : "bg-emerald-500")} />
                        {isSimulationMode ? "SIM_MODE" : "REALWORLD"}
                    </span>
                    {isPlaybackPaused && <span className="text-danger">Paused</span>}
                </div>
            </div>
        </div>
    );
};
