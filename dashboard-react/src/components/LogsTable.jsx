import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, ShieldAlert, ShieldCheck, Clock } from 'lucide-react';
import { clsx } from 'clsx';

const MOCK_LOGS = [
    { id: '1', timestamp: '2026-03-02 17:15:30', node: 'Node_Alpha_7', vector: 'URL_SCAN [hianimez.is]', risk: '1.4%', classification: 'Safe' },
    { id: '2', timestamp: '2026-03-02 17:10:12', node: 'Node_Gamma_2', vector: 'Visual Search [paypaal-login.com]', risk: '92.1%', classification: 'Malicious' },
    { id: '3', timestamp: '2026-03-02 17:08:45', node: 'Node_Beta_4', vector: 'GPT-4o Scan [invoice-update.zip]', risk: '65.2%', classification: 'Suspicious' },
];

import { useUI } from '../context/UIContext';

export const LogsTable = () => {
    const { logs } = useUI();
    const [isLoading, setIsLoading] = useState(false);

    const fetchLogs = async () => {
        setIsLoading(true);
        // Simulate API fetch refresh
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsLoading(false);
    };

    return (
        <div className="glass-card overflow-hidden">
            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <h3 className="text-lg font-bold">System Audit Logs</h3>
                <button
                    onClick={fetchLogs}
                    disabled={isLoading}
                    className="flex items-center gap-2 text-xs font-bold text-cyan-accent hover:text-white transition-colors disabled:opacity-50"
                >
                    <RefreshCcw className={clsx("w-3.5 h-3.5", isLoading && "animate-spin")} />
                    Sync Logs
                </button>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/[0.02] text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <tr>
                            <th className="px-8 py-5">Timestamp</th>
                            <th className="px-8 py-5">Inference Node</th>
                            <th className="px-8 py-5">Vector</th>
                            <th className="px-8 py-5">Risk</th>
                            <th className="px-8 py-5">Verdict</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-medium divide-y divide-white/5">
                        <AnimatePresence mode="popLayout">
                            {isLoading ? (
                                <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    key="loading"
                                >
                                    <td colSpan={5} className="px-8 py-16 text-center text-cyan-accent/50 italic animate-pulse">
                                        Synchronizing Neural Audit Logs...
                                    </td>
                                </motion.tr>
                            ) : (
                                logs.map((log) => (
                                    <motion.tr
                                        key={log.id}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        layout
                                        className="hover:bg-white/[0.02] transition-colors group"
                                    >
                                        <td className="px-8 py-4 text-slate-500 font-mono text-xs flex items-center gap-2 whitespace-nowrap">
                                            <Clock className="w-3 h-3 opacity-50" />
                                            {new Date(log.timestamp).toLocaleTimeString()}
                                        </td>
                                        <td className="px-8 py-4 font-bold text-white uppercase tracking-tighter">
                                            {log.node}
                                        </td>
                                        <td className="px-8 py-4 text-slate-400 group-hover:text-slate-200 transition-colors">
                                            {log.vector}
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className={clsx(
                                                "font-bold",
                                                log.risk > 70 ? "text-danger" : (log.risk > 40 ? "text-warning" : "text-emerald-400")
                                            )}>
                                                {log.risk}%
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className={clsx(
                                                "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                                log.verdict === 'Malicious' ? "bg-danger/10 text-danger" : (log.verdict === 'Suspicious' ? "bg-warning/10 text-warning" : "bg-emerald-500/10 text-emerald-500")
                                            )}>
                                                {log.verdict}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
