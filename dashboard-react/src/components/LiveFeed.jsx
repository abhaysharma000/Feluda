import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Terminal as TerminalIcon, Shield } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { clsx } from 'clsx';

export const LiveFeed = () => {
    const { logs } = useUI();
    const isSimulationMode = false;
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
                    {logs.map((log, index) => (
                        <motion.div
                            key={log.id || index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={clsx(
                                "flex items-center gap-4 p-3 rounded-lg border transition-all duration-300",
                                log.classification === 'Malicious'
                                    ? "bg-soc-danger/5 border-soc-danger/20 text-soc-danger"
                                    : log.classification === 'Suspicious'
                                        ? "bg-soc-warning/5 border-soc-warning/20 text-soc-warning"
                                        : "bg-white/[0.01] border-white/[0.03] text-slate-400"
                            )}
                        >
                            <span className="text-[10px] font-black tabular-nums opacity-60 min-w-[70px]">
                                [{log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' }) : "--:--"}]
                            </span>
                            
                            <span className={clsx(
                                "text-[10px] font-black uppercase tracking-widest min-w-[80px]",
                                log.classification === 'Malicious' ? "text-soc-danger" : 
                                log.classification === 'Suspicious' ? "text-soc-warning" : "text-soc-success"
                            )}>
                                {log.classification === 'Malicious' ? 'BLOCKED' : 
                                 log.classification === 'Suspicious' ? 'SUSPICIOUS' : 'SAFE'}
                            </span>

                            <span className="text-[11px] font-bold truncate flex-1 tracking-tight">
                                {log.domain}
                            </span>

                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black tabular-nums opacity-60">
                                    (Risk: {log.risk_score}%)
                                </span>
                                <span className={clsx(
                                    "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest bg-white/5 border border-white/5",
                                    log.source === 'extension' ? "text-soc-accent" : "text-slate-500"
                                )}>
                                    {log.source || 'SYS'}
                                </span>
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
