import React from 'react';
import { Search, Globe as GlobeIcon, Send } from 'lucide-react';
import { clsx } from 'clsx';

export const ManualScanner = ({ inputValue, setInputValue, onAnalyze, isAnalyzing }) => {
    return (
        <div className="glass-panel p-8 border-soc-accent/10 bg-soc-accent/[0.03] flex flex-col gap-8 h-full">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-soc-accent/10 rounded-xl border border-soc-accent/20 shadow-lg shadow-soc-accent/5">
                        <GlobeIcon className="w-5 h-5 text-soc-accent" />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-white uppercase tracking-tight">Manual Investigation</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Analyst Domain Sweep</p>
                    </div>
                </div>
                
                <button 
                    type="button"
                    onClick={() => onAnalyze(null, 'manual', true)}
                    disabled={isAnalyzing}
                    className={clsx(
                        "px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 border border-soc-accent/20 bg-soc-accent/5",
                        isAnalyzing ? "opacity-50 cursor-not-allowed" : "hover:bg-soc-accent/10 hover:border-soc-accent/40"
                    )}
                >
                    <Search className="w-3.5 h-3.5 text-soc-accent" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">
                        Dossier
                    </span>
                </button>
            </div>
            
            {/* Investigation Row */}
            <form onSubmit={onAnalyze} className="flex-1 flex flex-col justify-center gap-4">
                <div className="relative group/input">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/input:text-soc-accent transition-colors" />
                    <input 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Paste suspicious target URL here..."
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-white placeholder:text-slate-700 focus:outline-none focus:border-soc-accent/40 transition-all shadow-inner focus:ring-4 focus:ring-soc-accent/5"
                    />
                </div>
                
                <button 
                    type="submit"
                    disabled={isAnalyzing}
                    className={clsx(
                        "soc-button w-full py-5 rounded-2xl flex items-center justify-center gap-3 group transition-all duration-500",
                        isAnalyzing ? "opacity-50 cursor-not-allowed" : "shadow-xl shadow-soc-primary/10 hover:shadow-soc-primary/20"
                    )}
                >
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-black">
                        {isAnalyzing ? "Running Neural Sweep..." : "Initiate Forensic Trace"}
                    </span>
                    <Send className={clsx("w-4 h-4 transition-transform duration-500 text-black", !isAnalyzing && "group-hover:translate-x-1 group-hover:-translate-y-1")} />
                </button>
            </form>
        </div>
    );
};
