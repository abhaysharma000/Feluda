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
            <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2 pt-2">
                <AnimatePresence initial={false}>
                    {logs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -10, Filter: 'blur(5px)' }}
                            animate={{ opacity: 1, x: 0, Filter: 'blur(0px)' }}
                            className={clsx(
                                "flex flex-col gap-2 p-4 rounded-xl border transition-all duration-300 group relative overflow-hidden",
                                log.verdict === 'Malicious'
                                    ? "bg-soc-danger/10 border-soc-danger/20 text-soc-danger shadow-neon-danger"
                                    : "bg-white/[0.01] border-white/5 text-slate-500 hover:border-white/10 hover:bg-white/[0.03]"
                            )}
                        >
                            {log.verdict === 'Malicious' && (
                                <div className="absolute top-0 right-0 w-24 h-24 bg-soc-danger/5 rounded-full -mr-12 -mt-12 animate-pulse" />
                            )}

                            <div className="flex items-center justify-between gap-4 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className={clsx(
                                        "w-2 h-2 rounded-full",
                                        log.verdict === 'Malicious' ? "bg-soc-danger animate-pulse shadow-neon-danger" : "bg-soc-success"
                                    )} />
                                    <span className="font-black text-white/20 tracking-widest italic">[{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                                    <span className="font-black text-white/60 uppercase tracking-tighter">{log.node}</span>
                                </div>
                                <span className={clsx(
                                    "px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-[0.2em]",
                                    log.verdict === 'Malicious' ? "bg-soc-danger text-white" : "bg-soc-success/20 text-soc-success border border-soc-success/10"
                                )}>
                                    {log.verdict}
                                </span>
                            </div>

                            <div className="pl-5 space-y-2 relative z-10">
                                <p className="text-white/80 font-bold leading-relaxed break-all uppercase tracking-widest text-[10px]">
                                    <span className="text-soc-cyan/40 mr-2">$</span>
                                    {log.vector}
                                </p>
                                <div className="flex items-center gap-4 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="flex items-center gap-1">
                                        <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Risk Index:</span>
                                        <span className={clsx("text-[9px] font-black tabular-nums", log.verdict === 'Malicious' ? 'text-soc-danger' : 'text-soc-cyan')}>{log.risk}%</span>
                                    </div>
                                    <div className="h-2 w-px bg-white/5" />
                                    <div className="flex items-center gap-1">
                                        <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Protocol:</span>
                                        <span className="text-[9px] font-black text-white/50 uppercase italic">Heuristic-v4</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {logs.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-700 italic opacity-20 py-20 animate-pulse">
                        <TerminalIcon className="w-12 h-12 mb-6 stroke-1 border border-white/5 p-3 rounded-full" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em]">Establishing Uplink Connectivity...</p>
                    </div>
                )}
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between text-[9px] font-black text-slate-600 uppercase tracking-widest">
                <div className="flex items-center gap-3 group cursor-default">
                    <Activity className="w-3.5 h-3.5 text-soc-cyan animate-pulse" />
                    <span className="group-hover:text-soc-cyan transition-colors">Neural Sync: active</span>
                </div>
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2">
                        <div className={clsx("w-1.5 h-1.5 rounded-full overflow-hidden", isSimulationMode ? "bg-soc-danger animate-pulse shadow-neon-danger" : "bg-soc-success")} />
                        <span className={isSimulationMode ? "text-soc-danger" : "text-soc-success"}>{isSimulationMode ? "SIM_MODE" : "REALWORLD"}</span>
                    </div>
                    {isPlaybackPaused && <span className="text-soc-danger px-1.5 border border-soc-danger/30 rounded italic">PAUSED</span>}
                </div>
            </div>
        </div>
    );
};
