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
    const behavior = data.behavior || {};
    const findings = behavior.behavior_report?.findings || [];

    const stats = [
        { label: 'Form Count', value: behavior.forms_detected ?? 0, icon: Smartphone, color: 'text-soc-accent' },
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
                    <div key={i} className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.05] text-center space-y-2 group hover:bg-white/[0.03] transition-colors shadow-inner">
                        <s.icon className={clsx("w-4 h-4 mx-auto opacity-50 group-hover:opacity-100 transition-opacity", s.color)} />
                        <div className="text-xl font-black text-white tabular-nums">{s.value}</div>
                        <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Critical Findings */}
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Forensic Signal Matrix</h4>
                    {behavior.suspicious_form_action && (
                        <span className="px-2 py-0.5 rounded-full bg-soc-danger/10 text-soc-danger text-[7px] font-black uppercase tracking-widest border border-soc-danger/20 animate-pulse">
                            Suspicious Action
                        </span>
                    )}
                </div>
                
                <div className="grid gap-2">
                    {findings.length > 0 ? (
                        findings.map((f, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-soc-danger/5 border border-soc-danger/10 group hover:border-soc-danger/30 transition-all">
                                <ShieldAlert className="w-4 h-4 text-soc-danger" />
                                <span className="text-[10px] font-black text-soc-danger uppercase tracking-tight">{f}</span>
                            </div>
                        ))
                    ) : (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-soc-success/5 border border-soc-success/10">
                            <CheckCircle className="w-4 h-4 text-soc-success" />
                            <span className="text-[10px] font-black text-soc-success uppercase tracking-widest">No malicious behaviors detected in DOM</span>
                        </div>
                    )}

                    {/* Forensic Meta-data */}
                    {behavior.redirect_chains > 1 && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-soc-warning/5 border border-soc-warning/10">
                            <Activity className="w-4 h-4 text-soc-warning" />
                            <span className="text-[10px] font-black text-soc-warning uppercase tracking-tight">Redirect Chain: {behavior.redirect_chains} hops detected</span>
                        </div>
                    )}
                </div>
            </div>

            {/* DOM Trust Score */}
            <div className="pt-6 border-t border-white/5">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Behavioral Integrity</span>
                    <span className="text-xs font-black text-white tracking-tighter tabular-nums">
                        {behavior.risk === 'HIGH' ? '24%' : (behavior.risk === 'MEDIUM' ? '68%' : '98%')}
                    </span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: behavior.risk === 'HIGH' ? '24%' : (behavior.risk === 'MEDIUM' ? '68%' : '98%') }}
                        className={clsx("h-full shadow-[0_0_10px]", behavior.risk === 'HIGH' ? "bg-soc-danger shadow-soc-danger/30" : "bg-soc-accent shadow-soc-accent/30")}
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
