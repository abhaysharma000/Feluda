import React, { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';
import { 
    ShieldCheck, Cpu, Database, Zap, 
    AlertTriangle, Fingerprint, Activity, 
    Server, Globe, Clock, BarChart3, List
} from 'lucide-react';
import { useUI } from '../context/UIContext';
import { clsx } from 'clsx';

const Counter = ({ value, prefix = "", suffix = "" }) => {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        let val = typeof value === 'string' ? parseInt(value) : value;
        if (isNaN(val) || val === undefined || val === null) val = 0;
        
        const controls = animate(0, val, {
            duration: 1,
            ease: "easeOut",
            onUpdate: (latest) => setDisplay(Math.floor(latest))
        });
        return () => controls.stop();
    }, [value]);

    return <span>{prefix}{(display || 0).toLocaleString()}{suffix}</span>;
};

export const HeroPanel = () => {
    const { isScanning, lastScanVerdict, stats, scanResult } = useUI();
    const isThreatState = lastScanVerdict === 'threat' || (scanResult && scanResult.risk_score >= 65);
    const activeColor = isScanning ? 'accent' : (isThreatState ? 'danger' : 'success');

    const statusMap = {
        accent: { text: "SIGNAL_ACQUISITION_ACTIVE", icon: Activity, color: "text-soc-accent", bg: "bg-soc-accent/[0.02]", border: "border-soc-accent/30" },
        danger: { text: "INTERCEPT_ANOMALY_CONFIRMED", icon: AlertTriangle, color: "text-soc-danger", bg: "bg-soc-danger/[0.02]", border: "border-soc-danger/30" },
        success: { text: "ENVIRONMENT_PROTECTED", icon: ShieldCheck, color: "text-soc-success", bg: "bg-soc-success/[0.02]", border: "border-soc-success/30" }
    };

    const currentStatus = statusMap[activeColor];
    const system = stats.system_health || { cpu: "8%", memory: "124MB", uptime: "---", tld_breakdown: {} };

    return (
        <section className="relative overflow-hidden">
            <div className={clsx(
                "glass-panel border-white/[0.03] p-8 lg:p-10 transition-all duration-700 bg-black/40",
                currentStatus.bg
            )}>
                {/* Tactical Sidebar Accent */}
                <div className={clsx("absolute top-0 left-0 w-1.5 h-full opacity-60",
                    activeColor === 'accent' ? "bg-soc-accent" : (activeColor === 'danger' ? "bg-soc-danger" : "bg-soc-success")
                )} />

                <div className="flex flex-col xl:flex-row items-stretch gap-10">
                    
                    {/* Left: Terminal Core */}
                    <div className="flex-1 space-y-8">
                        <header className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className={clsx("flex items-center gap-2 px-3 py-1 rounded border bg-black/40", currentStatus.border)}>
                                    <currentStatus.icon className={clsx("w-3.5 h-3.5", currentStatus.color)} />
                                    <span className={clsx("text-[9px] font-black uppercase tracking-[0.2em] tabular-nums", currentStatus.color)}>
                                        {currentStatus.text}
                                    </span>
                                </div>
                                <div className="h-px w-12 bg-white/5" />
                                <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-600 uppercase tracking-widest">
                                    <Fingerprint className="w-3 h-3 text-soc-accent/50" />
                                    SOC_Operator: ABHAY_S
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white uppercase leading-none italic">
                                    Feluda <span className="text-soc-accent">Command</span> Console
                                </h1>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] px-1">Unified Threat Intelligence & Forensic Response Terminal</p>
                            </div>
                        </header>

                        {/* Tactical Telemetry Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <TelemetryCard icon={Cpu} label="System Load" value={system.cpu} tint="accent" />
                            <TelemetryCard icon={Database} label="Mem Buffer" value={system.memory} tint="accent" />
                            <TelemetryCard icon={Clock} label="Engine Uptime" value={system.uptime} tint="success" />
                            <TelemetryCard icon={Server} label="Cluster ID" value="NODE_01_INDIA" tint="warning" />
                        </div>
                    </div>

                    {/* Right: TLD Distribution & Primary Stats */}
                    <div className="xl:w-[450px] flex flex-col gap-4">
                        <div className="flex-1 grid grid-cols-2 gap-4">
                            <StatBox 
                                label="Total Ingestion" 
                                value={stats.scanned_today} 
                                icon={Activity}
                                color="text-soc-accent"
                                subtext="Daily Unit Scans"
                            />
                            <StatBox 
                                label="Threat Blocks" 
                                value={stats?.blocked || 0} 
                                icon={AlertTriangle}
                                color="text-soc-danger"
                                subtext="Malicious Intercepts"
                                progress={((stats?.blocked || 0) / (stats?.scanned_today || 1)) * 100}
                            />
                        </div>

                        {/* TLD Ingestion Trends (Real Data from Backend) */}
                        <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.03] space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Top TLD Ingestion</span>
                                <BarChart3 className="w-3 h-3 text-slate-700" />
                            </div>
                            <div className="space-y-3">
                                {Object.entries(system.tld_breakdown || {}).map(([tld, count], i) => (
                                    <div key={tld} className="space-y-1.5">
                                        <div className="flex justify-between text-[9px] font-black uppercase">
                                            <span className="text-white opacity-40">.{tld}</span>
                                            <span className="text-soc-accent">{count}</span>
                                        </div>
                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(count / 10) * 100}%` }}
                                                className="h-full bg-soc-accent opacity-30" 
                                            />
                                        </div>
                                    </div>
                                ))}
                                {Object.keys(system.tld_breakdown || {}).length === 0 && (
                                    <div className="py-2 text-[8px] font-bold text-slate-700 uppercase tracking-widest text-center italic">Awaiting telemetry synchronization...</div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

const TelemetryCard = ({ icon: Icon, label, value, tint }) => (
    <div className="space-y-2 group">
        <div className="flex items-center gap-2">
            <Icon className={clsx("w-3.5 h-3.5", tint === 'accent' ? "text-soc-accent/40" : (tint === 'danger' ? "text-soc-danger/40" : "text-soc-success/40"))} />
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
        </div>
        <div className="text-sm font-black text-white tracking-widest tabular-nums font-mono border-l-2 border-white/5 pl-3 group-hover:border-soc-accent transition-all">
            {value}
        </div>
    </div>
);

const StatBox = ({ label, value, icon: Icon, color, subtext, progress }) => (
    <div className="p-6 rounded-2xl bg-black/20 border border-white/[0.03] hover:bg-white/[0.03] transition-all group">
        <div className="flex items-center gap-3 mb-4">
            <Icon className={clsx("w-3.5 h-3.5", color)} />
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
        </div>
        <div className={clsx("text-4xl font-black tabular-nums tracking-tighter mb-1", color)}>
            <Counter value={value} />
        </div>
        <div className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter italic">{subtext}</div>
        {progress !== undefined && (
            <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-current"
                />
            </div>
        )}
    </div>
);
