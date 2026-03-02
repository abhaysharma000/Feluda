import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { clsx } from 'clsx';

const NEURAL_LOGS = [
    "Inbound packet analysis: 192.168.1.104 -> Blocked",
    "Neural pattern match detected: Subdomain entropy spike",
    "Credential harvester signature match: 0xAEF42",
    "Cross-referencing database: 1.4B hashes synchronized",
    "Visual similarity engine: Paypal.com (94% match)",
    "Platt Scaling confidence calibrated: 0.992",
    "TCP Handshake intercepted: NODE_US_41",
    "Heuristic bypass attempt mitigated",
    "SSL Certificate mismatch: REJECTED",
    "GPT-4o behavioral parsing: PHISHING_CONFIRMED"
];

export const LiveFeed = () => {
    const { isPlaybackPaused, playbackSpeed } = useUI();
    const [logs, setLogs] = useState([]);
    const terminalRef = useRef(null);

    useEffect(() => {
        if (isPlaybackPaused) return;

        const interval = setInterval(() => {
            const entry = NEURAL_LOGS[Math.floor(Math.random() * NEURAL_LOGS.length)];
            const newLog = {
                id: Date.now(),
                timestamp: new Date().toLocaleTimeString(),
                text: entry
            };

            setLogs(prev => [newLog, ...prev.slice(0, 49)]);
        }, 2000 / playbackSpeed);

        return () => clearInterval(interval);
    }, [isPlaybackPaused, playbackSpeed]);

    return (
        <div className="glass-card overflow-hidden h-full flex flex-col bg-black/40">
            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-4">
                    <div className="relative w-3 h-3">
                        <span className="absolute inset-0 bg-green-accent rounded-full animate-ping opacity-75"></span>
                        <span className="absolute inset-0 bg-green-accent rounded-full"></span>
                    </div>
                    <h3 className="text-lg font-bold">Global Inference Stream</h3>
                </div>
                <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-green-accent animate-pulse" />
                    <span className="text-[10px] font-bold text-green-accent tracking-widest uppercase">Neural Sync Active</span>
                </div>
            </div>

            <div
                ref={terminalRef}
                className="flex-1 p-8 overflow-y-auto font-mono text-sm custom-scrollbar space-y-3"
            >
                <AnimatePresence initial={false}>
                    {logs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-4 text-slate-400 group border-l-2 border-transparent hover:border-cyan-accent pl-4 transition-colors py-1"
                        >
                            <span className="text-slate-600 font-bold shrink-0">[{log.timestamp}]</span>
                            <span className="group-hover:text-slate-200 transition-colors">{log.text}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {logs.length === 0 && (
                    <div className="h-full flex items-center justify-center text-slate-700 italic text-xs">
                        Awaiting neural stream packets...
                    </div>
                )}
            </div>
        </div>
    );
};
