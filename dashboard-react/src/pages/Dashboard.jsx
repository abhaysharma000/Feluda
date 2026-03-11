import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HeroPanel } from '../components/HeroPanel';
import { StatsGrid } from '../components/StatsGrid';
import { LiveFeed } from '../components/LiveFeed';
import { InvestigationResults } from '../components/InvestigationResults';
import { BehavioralAnalysis } from '../components/BehavioralAnalysis';
import { Activity, Shield, Search, Send, Globe } from 'lucide-react';
import { useUI } from '../context/UIContext';

export const Dashboard = () => {
    const { addToast } = useUI();
    const [searchParams] = useSearchParams();
    const urlParam = searchParams.get('url');
    
    const [inputValue, setInputValue] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisData, setAnalysisData] = useState(null);

    const performAnalysis = async (targetUrl, source = 'manual') => {
        if (!targetUrl) return;
        setIsAnalyzing(true);
        setAnalysisData(null);
        
        try {
            const response = await fetch('http://localhost:8001/api/scan/url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: targetUrl, source })
            });
            
            if (response.ok) {
                const data = await response.json();
                setAnalysisData(data);
                addToast("Inference Complete", data.classification === 'Malicious' ? 'warning' : 'success');
            } else {
                addToast("Analysis Pipeline Failed", "danger");
            }
        } catch (err) {
            console.error("Scan failed:", err);
            addToast("Backend Connection Error", "danger");
        } finally {
            setIsAnalyzing(false);
        }
    };

    useEffect(() => {
        if (urlParam) {
            setInputValue(urlParam);
            performAnalysis(urlParam, 'extension');
        }
    }, [urlParam]);

    const handleManualSearch = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            performAnalysis(inputValue.trim(), 'manual');
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Hero & Vital Stats */}
            <HeroPanel />
            <StatsGrid />

            {/* Module 2: URL Intelligence Scanner */}
            <div className="glass-panel p-6 border-soc-accent/10 bg-soc-accent/5">
                <form onSubmit={handleManualSearch} className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex items-center gap-4 min-w-fit">
                        <div className="p-2 bg-soc-accent/10 rounded-lg">
                            <Globe className="w-5 h-5 text-soc-accent" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-tight">Investigate URL</h3>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Direct Forensic Injection</p>
                        </div>
                    </div>
                    
                    <div className="flex-1 relative w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="https://suspicious-target.com"
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm font-medium text-white placeholder:text-slate-700 focus:outline-none focus:border-soc-accent/40 transition-all shadow-inner"
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        disabled={isAnalyzing}
                        className="w-full md:w-auto soc-button px-8 py-4 rounded-xl flex items-center justify-center gap-2 group"
                    >
                        {isAnalyzing ? "Analyzing..." : "Run Analysis"}
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            </div>

            {/* Tactical Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Primary Column: Analytics & Visualization */}
                <div className="xl:col-span-8 space-y-8">
                    {/* Module 1: Current Website Investigation */}
                    <div id="investigation-module" className="glass-panel p-8 lg:p-10 min-h-[500px] relative overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between mb-10 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-soc-accent/10 rounded-lg">
                                    <Shield className="w-5 h-5 text-soc-accent" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white tracking-tight">Website Investigation</h3>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Deep structural & behavioral analysis</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 min-h-0 relative z-10">
                            <InvestigationResults data={analysisData} isLoading={isAnalyzing} />
                        </div>
                    </div>

                    {/* Threat Intelligence Table - Placeholder for Module 4 */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-soc-accent" />
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Threat Intelligence Archive</h3>
                            <div className="h-px flex-1 bg-white/[0.03]" />
                        </div>
                        <div id="threat-intelligence-table" className="glass-panel p-0 bg-black/20 border-white/[0.02] min-h-[400px]">
                            <LogsTable />
                        </div>
                    </div>
                </div>

                {/* Secondary Column: Live Stream & Health */}
                <div className="xl:col-span-4 space-y-8">
                    {/* Real-Time Threat Feed - Module 3 */}
                    <div className="glass-panel p-0 h-[550px] flex flex-col relative overflow-hidden group">
                        <div className="px-6 py-5 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.01]">
                            <div className="flex items-center gap-3">
                                <div className="flex space-x-1">
                                    <div className="w-1 h-1 rounded-full bg-soc-accent animate-ping" />
                                    <div className="w-1 h-1 rounded-full bg-soc-accent" />
                                </div>
                                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">Live Threat Feed</h3>
                            </div>
                            <div className="px-2 py-0.5 rounded border border-soc-accent/20 bg-soc-accent/5 text-soc-accent text-[8px] font-bold uppercase tracking-widest">
                                Processing Live
                            </div>
                        </div>
                        <div className="flex-1 min-h-0 p-4">
                            <LiveFeed />
                        </div>
                    </div>

                    {/* Module 5: Domain Trust & Behavioral Analysis */}
                    <div id="behavioral-analysis-module" className="glass-panel p-8 group overflow-hidden">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-soc-accent/5 rounded-lg border border-white/5">
                                <Activity className="w-4 h-4 text-soc-accent group-hover:rotate-90 transition-transform duration-500" />
                            </div>
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Trust & Behavior</h3>
                        </div>
                        
                        <BehavioralAnalysis data={analysisData} isLoading={isAnalyzing} />
                    </div>
                </div>
            </div>
        </div>
    );
};
