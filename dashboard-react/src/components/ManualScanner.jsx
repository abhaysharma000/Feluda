import React from 'react';
import { Search, Globe, Send } from 'lucide-react';
import { clsx } from 'clsx';

export const ManualScanner = ({ inputValue, setInputValue, onAnalyze, isAnalyzing }) => {
    return (
        <div className="glass-panel p-6 border-soc-accent/10 bg-soc-accent/5">
            <form onSubmit={onAnalyze} className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex items-center gap-4 min-w-fit">
                    <div className="p-3 bg-soc-accent/10 rounded-xl border border-soc-accent/20 shadow-lg shadow-soc-accent/5">
                        <Globe className="w-6 h-6 text-soc-accent" />
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
                
                <button 
                    type="submit"
                    disabled={isAnalyzing}
                    className={clsx(
                        "w-full md:w-auto soc-button px-10 py-5 rounded-2xl flex items-center justify-center gap-3 group transition-all duration-500",
                        isAnalyzing ? "opacity-50 cursor-not-allowed" : "shadow-xl shadow-soc-primary/10 hover:shadow-soc-primary/20"
                    )}
                >
                    <span className="text-xs font-black uppercase tracking-[0.2em]">
                        {isAnalyzing ? "Processing..." : "Run Forensics"}
                    </span>
                    <Send className={clsx("w-4 h-4 transition-transform duration-500", !isAnalyzing && "group-hover:translate-x-1 group-hover:-translate-y-1")} />
                </button>
            </form>
        </div>
    );
};
