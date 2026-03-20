import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HeroPanel } from '../components/HeroPanel';
import { StatsGrid } from '../components/StatsGrid';
import { ManualScanner } from '../components/ManualScanner';
import { ActiveWebsiteInvestigation } from '../components/ActiveWebsiteInvestigation';
import { BehavioralAnalysis } from '../components/BehavioralAnalysis';
import { TopThreatsPanel } from '../components/TopThreatsPanel';
import { LiveFeed } from '../components/LiveFeed';
import { LogsTable } from '../components/LogsTable';
import { ForensicDossier } from '../components/ForensicDossier';
import { FileScanner } from '../components/FileScanner';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Activity, Shield, Globe as GlobeIcon } from 'lucide-react';
import { useUI } from '../context/UIContext';

export const Dashboard = () => {
    const { addToast } = useUI();
    const [searchParams] = useSearchParams();
    const urlParam = searchParams.get('url');
    
    const [inputValue, setInputValue] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisData, setAnalysisData] = useState(null);
    const [isDossierOpen, setIsDossierOpen] = useState(false);

    const performAnalysis = async (targetUrl, source = 'manual', showDossier = false) => {
        const urlToScan = targetUrl || inputValue;
        if (!urlToScan) return;
        setIsAnalyzing(true);
        setAnalysisData(null);
        if (showDossier) setIsDossierOpen(false);
        
        try {
            // Run Scan and Behavior Analysis in parallel
            const [scanRes, behaviorRes] = await Promise.all([
                fetch('/api/scan/url', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: urlToScan, source })
                }),
                fetch('/api/analyze/html', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: urlToScan, source })
                })
            ]);
            
            if (scanRes.ok) {
                const scanData = await scanRes.json();
                const behaviorData = behaviorRes.ok ? await behaviorRes.json() : null;
                
                setAnalysisData({
                    ...scanData,
                    behavior: behaviorData
                });
                
                if (showDossier) setIsDossierOpen(true);
                addToast("Inference Complete", scanData.classification === 'Malicious' ? 'warning' : 'success');
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
        <div className="space-y-6 md:space-y-8 pb-12 px-4 md:px-0 max-w-[1600px] mx-auto">
            {/* Hero & Vital Stats */}
            <HeroPanel />

            {/* Module 2: URL & File Intelligence */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <ManualScanner 
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    onAnalyze={handleManualSearch}
                    isAnalyzing={isAnalyzing}
                />
                <ErrorBoundary>
                    <FileScanner />
                </ErrorBoundary>
            </div>

            <StatsGrid />

            {/* Tactical Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
                {/* Primary Column: Analytics & Visualization */}
                <div className="xl:col-span-8 space-y-6 md:space-y-8">
                    {/* Module 1: Current Website Investigation */}
                    <div id="investigation-module" className="glass-panel p-6 md:p-8 lg:p-10 min-h-[400px] md:min-h-[500px] relative overflow-hidden flex flex-col border-soc-accent/5">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 md:mb-10 relative z-10 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-soc-accent/10 rounded-lg shrink-0">
                                    <Shield className="w-5 h-5 text-soc-accent" />
                                </div>
                                <div>
                                    <h3 className="text-lg md:text-xl font-black text-white tracking-widest uppercase">Forensic Analyst</h3>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">Deep structural investigation active</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 min-h-0 relative z-10">
                            <ActiveWebsiteInvestigation data={analysisData} isLoading={isAnalyzing} />
                        </div>
                    </div>

                </div>

                {/* Secondary Column: Live Stream & Health */}
                <div className="xl:col-span-4 space-y-6 md:space-y-8">
                    {/* Top Threat Intelligence - Module 6 */}
                    <TopThreatsPanel />

                    {/* Real-Time Threat Feed - Module 3 */}
                    <div className="glass-panel p-0 h-[400px] md:h-[500px] flex flex-col relative overflow-hidden group border-soc-accent/5">
                        <div className="px-6 py-5 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <div className="flex space-x-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-soc-danger animate-pulse" />
                                </div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white italic">SOC_Stream_Pulse</h3>
                            </div>
                            <div className="hidden sm:block px-2 py-0.5 rounded border border-soc-danger/20 bg-soc-danger/5 text-soc-danger text-[7px] font-black uppercase tracking-widest">
                                Live Forensic Trace
                            </div>
                        </div>
                        <div className="flex-1 min-h-0 p-4">
                            <LiveFeed />
                        </div>
                    </div>

                    {/* Module 5: Domain Trust & Behavioral Analysis */}
                    <div id="behavioral-analysis-module" className="glass-panel p-6 md:p-8 group overflow-hidden border-soc-accent/5 bg-soc-accent/[0.02]">
                        <div className="flex items-center gap-3 mb-6 md:mb-8">
                            <div className="p-2 bg-soc-accent/5 rounded-lg border border-white/5">
                                <Activity className="w-4 h-4 text-soc-accent group-hover:rotate-90 transition-transform duration-500" />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Structural DNA Analysis</h3>
                        </div>
                        
                        <BehavioralAnalysis data={analysisData} isLoading={isAnalyzing} />
                    </div>
                </div>
            </div>

            <ForensicDossier 
                isOpen={isDossierOpen}
                onClose={() => setIsDossierOpen(false)}
                data={analysisData}
            />
        </div>
    );
};
