import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import { clsx } from 'clsx';

export const NotificationDropdown = ({ isOpen, onClose }) => {
    const { logs } = useUI();
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 glass-card bg-navy-950/90 border-white/10 overflow-hidden z-[100] shadow-neon"
        >
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="text-xs font-black uppercase tracking-widest text-white">System Alerts</h3>
                <span className="text-[8px] font-bold text-slate-500">{logs.length} Total</span>
            </div>
            <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                {logs.length > 0 ? (
                    logs.slice(0, 5).map((log) => (
                        <div
                            key={log.id}
                            className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
                            onClick={() => {
                                navigate('/intercepts');
                                onClose();
                            }}
                        >
                             <div className="flex justify-between items-start mb-1">
                                <span className={clsx(
                                    "text-[9px] font-bold uppercase",
                                    (log.classification || log.verdict) === 'Malicious' ? "text-soc-danger" : "text-soc-success"
                                )}>{(log.classification || log.verdict || 'Signal')} DETECTED</span>
                                <span className="text-[8px] text-slate-600 italic">
                                    {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : "--:--:--"}
                                </span>
                            </div>
                            <p className="text-[10px] text-slate-300 line-clamp-1 opacity-80 group-hover:opacity-100">{log.domain || log.vector || log.input}</p>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-xs text-slate-600 italic">No alerts recorded.</div>
                )}
            </div>
            <button
                onClick={() => {
                    navigate('/intercepts');
                    onClose();
                }}
                className="w-full p-3 text-[9px] font-black uppercase tracking-widest text-cyan-accent hover:bg-cyan-accent/10 transition-colors border-t border-white/5"
            >
                View Full Audit Log
            </button>
        </motion.div>
    );
};
