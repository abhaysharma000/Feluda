import React from 'react';
import { ShieldAlert, Globe, ExternalLink } from 'lucide-react';
import { useUI } from '../context/UIContext';

export const TopThreatsPanel = () => {
    const { topThreats } = useUI();

    return (
        <div className="glass-panel p-8 bg-black/20 border-white/[0.03] space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ShieldAlert className="w-5 h-5 text-soc-danger" />
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Top Malicious Domains</h3>
                </div>
                <Globe className="w-4 h-4 text-slate-700" />
            </div>

            <div className="space-y-3">
                {topThreats.length > 0 ? (
                    topThreats.map((domain, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] group hover:bg-soc-danger/5 hover:border-soc-danger/20 transition-all cursor-crosshair">
                            <div className="flex items-center gap-4 overflow-hidden">
                                <span className="text-[10px] font-black text-slate-600 tabular-nums">0{i + 1}</span>
                                <span className="text-xs font-bold text-white tracking-tight truncate group-hover:text-soc-danger transition-colors">{domain}</span>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-700 group-hover:text-soc-danger transition-colors" />
                        </div>
                    ))
                ) : (
                    <div className="py-10 text-center opacity-30">
                        <p className="text-[9px] font-black uppercase tracking-widest">Awaiting intelligence data...</p>
                    </div>
                )}
            </div>

            <div className="pt-4 flex flex-col gap-2">
                <div className="h-0.5 w-full bg-white/[0.02] rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-soc-danger animate-[loading_2s_infinite]" />
                </div>
                <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.3em] text-center">Threat Intelligence Stream</span>
            </div>
        </div>
    );
};
