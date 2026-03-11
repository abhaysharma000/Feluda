import React from 'react';
import { Activity, Code, MousePointer, ShieldAlert, CheckCircle, Smartphone } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export const BehavioralAnalysis = ({ data, isLoading }) => {
    if (isLoading) {
        return (
            <div className="space-y-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 w-full rounded-xl bg-white/[0.02] border border-white/[0.05] animate-pulse" />
                ))}
            </div>
        );
    }

    if (!data || !data.brand_analysis) {
        return (
            <div className="flex flex-col items-center justify-center py-10 opacity-30 text-center">
                <Code className="w-8 h-8 mb-4 text-slate-500" />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Pending Target Signature</p>
            </div>
        );
    }

    // Forensic indicators extracted from structural and behavioral analysis
    const behavior = data.raw_features || {};
    const findings = data.explanation?.filter(e => e.startsWith('Behavior:') || e.startsWith('Structural:')) || [];

    const stats = [
        { label: 'Form Count', value: behavior.form_count ?? 0, icon: Smartphone, color: 'text-soc-accent' },
        { label: 'Password Fields', value: behavior.password_fields ?? 0, icon: Lock, color: 'text-soc-danger' },
        { label: 'External Scripts', value: behavior.external_scripts ?? 0, icon: Code, color: 'text-soc-warning' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* Visual Indicators */}
            <div className="grid grid-cols-3 gap-4">
                {stats.map((s, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center space-y-2 group hover:bg-white/[0.04] transition-colors">
                        <s.icon className={clsx("w-4 h-4 mx-auto opacity-50 group-hover:opacity-100 transition-opacity", s.color)} />
                        <div className="text-xl font-black text-white">{s.value}</div>
                        <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Critical Findings */}
            <div className="space-y-3">
                <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Behavioral Red Flags</h4>
                <div className="grid gap-2">
                    {findings.length > 0 ? (
                        findings.map((f, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-soc-danger/5 border border-soc-danger/10">
                                <ShieldAlert className="w-3.5 h-3.5 text-soc-danger" />
                                <span className="text-[10px] font-bold text-soc-danger uppercase tracking-tight">{f.replace('Behavior: ', '').replace('Structural: ', '')}</span>
                            </div>
                        ))
                    ) : (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-soc-success/5 border border-soc-success/10">
                            <CheckCircle className="w-3.5 h-3.5 text-soc-success" />
                            <span className="text-[10px] font-bold text-soc-success uppercase tracking-tight">No malicious behaviors detected</span>
                        </div>
                    )}

                    {/* Forensic Meta-data */}
                    {data.behavioral_analysis?.redirect_chain_length > 1 && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-soc-warning/5 border border-soc-warning/10">
                            <Activity className="w-3.5 h-3.5 text-soc-warning" />
                            <span className="text-[10px] font-bold text-soc-warning uppercase tracking-tight">Redirect Chain: {data.behavioral_analysis.redirect_chain_length} hops detected</span>
                        </div>
                    )}
                </div>
            </div>

            {/* DOM Trust Score */}
            <div className="pt-4 border-t border-white/[0.03]">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">DOM Integrity Score</span>
                    <span className="text-xs font-bold text-white tracking-tight">{(100 - (data.risk_score * 0.4)).toFixed(0)}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(100 - (data.risk_score * 0.4))}%` }}
                        className={clsx("h-full", data.risk_score > 60 ? "bg-soc-danger" : "bg-soc-accent")}
                    />
                </div>
            </div>
        </motion.div>
    );
};

const Lock = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);
