import React from 'react';
import { Search, Globe as GlobeIcon, Send, List } from 'lucide-react';
import { clsx } from 'clsx';

export const ManualScanner = ({ inputValue, setInputValue, onAnalyze, isAnalyzing }) => {
    return (
        <div className="glass-panel p-6 border-soc-accent/10 bg-soc-accent/5">
            <form onSubmit={onAnalyze} className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex items-center gap-4 min-w-fit">
                    <div className="p-3 bg-soc-accent/10 rounded-xl border border-soc-accent/20 shadow-lg shadow-soc-accent/5">
                        <GlobeIcon className="w-6 h-6 text-soc-accent" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-tight">Manual Investigation</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Analyst Domain Sweep</p>
                    </div>
                </div>
                
                <div className="flex-1 relative w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Paste suspicious target URL here..."
                        className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-white placeholder:text-slate-700 focus:outline-none focus:border-soc-accent/40 transition-all shadow-inner focus:ring-4 focus:ring-soc-accent/5"
                    />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <button 
                        type="submit"
                        disabled={isAnalyzing}
                        className={clsx(
                            "flex-1 md:w-[200px] soc-button px-6 py-4 rounded-xl flex items-center justify-center gap-3 group transition-all duration-500",
                            isAnalyzing ? "opacity-50 cursor-not-allowed" : "shadow-xl shadow-soc-primary/10 hover:shadow-soc-primary/20 bg-soc-accent text-black"
                        )}
                    >
                        <span className="text-[11px] font-black uppercase tracking-[0.15em]">
                            {isAnalyzing ? "Processing..." : "Run Forensics"}
                        </span>
                        <Send className={clsx("w-3.5 h-3.5 transition-transform duration-500", !isAnalyzing && "group-hover:translate-x-1 group-hover:-translate-y-1")} />
                    </button>

                    <button 
                        type="button"
                        onClick={() => onAnalyze(null, 'manual', true)}
                        disabled={isAnalyzing}
                        className={clsx(
                            "flex-1 md:w-[150px] px-6 py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-500 border border-soc-accent/20 bg-soc-accent/5",
                            isAnalyzing ? "opacity-50 cursor-not-allowed" : "hover:bg-soc-accent/10 hover:border-soc-accent/40"
                        )}
                    >
                        <List className="w-3.5 h-3.5 text-soc-accent" />
                        <span className="text-[11px] font-black uppercase tracking-[0.15em] text-white">
                            Dossier
                        </span>
                    </button>
                </div>
            </form>
        </div>
    );
};
