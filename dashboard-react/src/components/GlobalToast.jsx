import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUI } from '../context/UIContext';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const GlobalToast = () => {
    const { toasts } = useUI();

    return (
        <div className="fixed top-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        className={cn(
                            "pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl min-w-[300px]",
                            toast.type === 'success' && "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                            toast.type === 'warning' && "bg-warning/10 border-warning/20 text-warning",
                            toast.type === 'danger' && "bg-danger/10 border-danger/20 text-danger",
                            toast.type === 'info' && "bg-white/5 border-white/10 text-slate-300"
                        )}
                    >
                        {toast.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                        {toast.type === 'warning' && <AlertCircle className="w-5 h-5" />}
                        {toast.type === 'danger' && <AlertCircle className="w-5 h-5" />}
                        {toast.type === 'info' && <Info className="w-5 h-5" />}

                        <span className="text-sm font-medium flex-1">{toast.message}</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
