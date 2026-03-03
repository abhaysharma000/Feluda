import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useTransform, animate } from 'framer-motion';
import { ShieldCheck, Cpu, Database, Zap, AlertTriangle, Fingerprint, Activity } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { clsx } from 'clsx';

const Counter = ({ value, prefix = "", suffix = "" }) => {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        const controls = animate(0, value, {
            duration: 1.5,
            ease: "easeOut",
            onUpdate: (latest) => setDisplay(Math.floor(latest))
        });
        return () => controls.stop();
    }, [value]);

    return <span>{prefix}{display.toLocaleString()}{suffix}</span>;
};

export const HeroPanel = () => {
    const { isSimulationMode, isScanning, lastScanVerdict, stats } = useUI();
    const isThreatState = isSimulationMode || lastScanVerdict === 'threat';
    const activeColor = isScanning ? 'accent' : (isThreatState ? 'danger' : 'success');

    const statusMap = {
        accent: { text: "NEURAL SCAN ACTIVE", icon: Activity, color: "text-soc-accent", bg: "bg-soc-accent/5", border: "border-soc-accent/20" },
        danger: { text: "THREAT ANOMALY DETECTED", icon: AlertTriangle, color: "text-soc-danger", bg: "bg-soc-danger/5", border: "border-soc-danger/20" },
        success: { text: "INTELLIGENCE GRID SECURE", icon: ShieldCheck, color: "text-soc-success", bg: "bg-soc-success/5", border: "border-soc-success/20" }
    };

    const currentStatus = statusMap[activeColor];

    return (
        <section className="relative group">
            {/* Background Layered Depth */}
            <div className="absolute -inset-4 bg-gradient-to-r from-soc-accent/5 via-transparent to-soc-danger/5 opacity-50 blur-3xl rounded-[3rem] pointer-events-none" />

            <div className={clsx(
                "relative z-10 glass-panel border-white/[0.03] p-8 lg:p-12 overflow-hidden transition-all duration-700",
                currentStatus.bg
            )}>
                {/* Visual Accent */}
                <div className={clsx("absolute top-0 left-0 w-1 h-full",
                    activeColor === 'accent' ? "bg-soc-accent" : (activeColor === 'danger' ? "bg-soc-danger" : "bg-soc-success")
                )} />

                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="flex flex-col lg:flex-row items-center gap-10 flex-1">
                        {/* Status Hexagon/Circle Container */}
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                                className="w-32 h-32 rounded-full border border-dashed border-white/10 flex items-center justify-center"
                            />
                            <div className="absolute inset-2 rounded-full border border-white/5 flex items-center justify-center backdrop-blur-sm">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 4 }}
                                    className={clsx("absolute inset-4 rounded-full blur-xl opacity-20",
                                        activeColor === 'accent' ? "bg-soc-accent" : (activeColor === 'danger' ? "bg-soc-danger" : "bg-soc-success")
                                    )}
                                />
                                <currentStatus.icon className={clsx("w-12 h-12 relative z-10", currentStatus.color)} />
                            </div>

                            {/* Scanning Ring */}
                            {isScanning && (
                                <svg className="absolute inset-0 w-full h-full -rotate-90">
                                    <motion.circle
                                        cx="64" cy="64" r="62"
                                        fill="transparent"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="text-soc-accent/30"
                                        strokeDasharray="390"
                                        animate={{ strokeDashoffset: [390, 0] }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                    />
                                </svg>
                            )}
                        </div>

                        <div className="space-y-4 text-center lg:text-left">
                            <div className="flex items-center justify-center lg:justify-start gap-3">
                                <span className={clsx("text-[10px] font-bold uppercase tracking-[0.3em]", currentStatus.color)}>
                                    {currentStatus.text}
                                </span>
                                <div className="h-px w-12 bg-white/5" />
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-bold text-slate-500 uppercase">
                                    <Fingerprint className="w-3 h-3 text-soc-accent" />
                                    Auth Verified
                                </div>
                            </div>

                            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                                <span className="text-gradient">Security Operations</span>
                                <br /> Command Console
                            </h1>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-3 pt-4 text-slate-500">
                                <div className="flex items-center gap-2">
                                    <Cpu className="w-4 h-4 text-soc-accent/40" />
                                    <span className="text-[11px] font-bold uppercase tracking-wider">Latency: 0.08ms</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Database className="w-4 h-4 text-soc-accent/40" />
                                    <span className="text-[11px] font-bold uppercase tracking-wider">Cluster: Node_Alpha</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-soc-accent/40" />
                                    <span className="text-[11px] font-bold uppercase tracking-wider">Honeypots: Active</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Summary Cards */}
                    <div className="grid grid-cols-2 gap-4 w-full lg:w-96">
                        <div className="glass-panel bg-white/[0.01] p-6 hover:bg-white/[0.03] transition-colors border-white/[0.03] group">
                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Inspections</div>
                            <div className="text-3xl font-bold text-white mb-2 tabular-nums group-hover:text-soc-accent transition-colors">
                                <Counter value={stats.scanned} />
                            </div>
                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-soc-success">
                                <Activity className="w-3 h-3" />
                                <span>+12.5% LIVE</span>
                            </div>
                        </div>
                        <div className="glass-panel bg-white/[0.01] p-6 hover:bg-white/[0.03] transition-colors border-white/[0.03] group">
                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Threat Index</div>
                            <div className={clsx("text-3xl font-bold mb-2 tabular-nums transition-colors",
                                stats.avgRisk > 50 ? "text-soc-danger" : "text-soc-accent group-hover:text-white"
                            )}>
                                <Counter value={stats.avgRisk} suffix="%" />
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stats.avgRisk}%` }}
                                    className={clsx("h-full", stats.avgRisk > 50 ? "bg-soc-danger" : "bg-soc-accent")}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
