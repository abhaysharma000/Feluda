import React from 'react';
import { LogsTable } from '../components/LogsTable';
import { Shield, Terminal, Activity, Download } from 'lucide-react';
import { useUI } from '../context/UIContext';

export const InterceptorLogs = () => {
    const { stats, logs } = useUI();

    const handleDownloadForensics = () => {
        const extensionLogs = logs.filter(log =>
            log.source === 'extension' || log.source === 'extension_heuristic'
        );

        if (extensionLogs.length === 0) {
            alert("No intercept data available to export yet.");
            return;
        }

        // Build CSV content
        const headers = ["Timestamp", "Domain", "Classification", "Risk Score (%)", "Source", "Forensic Reasoning"];
        const rows = extensionLogs
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map(log => {
                const domain = log.domain || (log.input ? (log.input.includes('://') ? new URL(log.input).hostname : log.input) : "Unknown");
                const classification = log.classification || log.result?.classification || "Unknown";
                const risk = log.risk_score || log.result?.risk_score || 0;
                const reasons = (log.explanation || log.result?.explanation || ["Generic pattern match"]).join("; ");
                const ts = log.timestamp ? new Date(log.timestamp).toLocaleString() : "N/A";
                return [ts, domain, classification, risk, log.source || "SYSTEM", `"${reasons}"`].join(",");
            });

        const csvContent = [headers.join(","), ...rows].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `feluda_forensics_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-8 pb-12">
            <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-soc-accent/10 rounded-lg">
                            <Shield className="w-5 h-5 text-soc-accent" />
                        </div>
                        <div className="h-px w-12 bg-white/5" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Extension_Intercept_Stream</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter leading-none uppercase italic">
                        Neural <span className="text-gradient">Intercepts</span>
                    </h1>
                    <p className="text-slate-500 text-[10px] lg:text-xs font-black uppercase tracking-[0.3em]">Direct forensic telemetry from the browser extension clusters & edge nodes.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <button
                        onClick={handleDownloadForensics}
                        className="soc-button soc-button-secondary py-3 px-6 rounded-xl border-white/5 hover:border-soc-accent/30 hover:bg-soc-accent/5 transition-all group"
                    >
                        <Download className="w-4 h-4 group-hover:text-soc-accent transition-colors" />
                        <span className="text-[10px] uppercase font-black tracking-widest">Download_Forensics</span>
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="xl:col-span-9">
                    <div className="glass-panel p-0 h-[700px] relative border-white/[0.03] bg-black/20">
                        <LogsTable filterSource="extension" />
                    </div>
                </div>

                <div className="xl:col-span-3 space-y-8">
                    {/* Intercept Matrix */}
                    <div className="glass-panel p-8 space-y-6 border-white/[0.03]">
                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="w-4 h-4 text-soc-accent" />
                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Node_Metrics</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Active_Protection</span>
                                <span className="text-3xl font-black text-white tabular-nums tracking-tighter">CONNECTED</span>
                            </div>
                            <div className="h-px bg-white/[0.03]" />
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Telemetry_Latency</span>
                                <span className="text-3xl font-black text-soc-success tabular-nums tracking-tighter">{(stats?.latency_ms || 0)}ms</span>
                            </div>
                        </div>
                    </div>

                    {/* Operational Status */}
                    <div className="glass-panel p-8 bg-soc-accent/[0.02] border-soc-accent/10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-1.5 bg-soc-accent/10 rounded-lg">
                                <Terminal className="w-4 h-4 text-soc-accent" />
                            </div>
                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-soc-accent">Cluster Health</h3>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-400 font-medium italic">Handshake protocol version 2.5.0 fully synchronized with backbone services.</p>
                        <div className="mt-6 flex items-center gap-4">
                            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-soc-accent w-full" />
                            </div>
                            <span className="text-[10px] font-black text-soc-accent">100%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
