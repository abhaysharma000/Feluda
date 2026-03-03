import React from 'react';
import { HeroPanel } from '../components/HeroPanel';
import { StatsGrid } from '../components/StatsGrid';
import { ChartsPanel } from '../components/ChartsPanel';
import { ThreatMap } from '../components/ThreatMap';
import { LiveFeed } from '../components/LiveFeed';
import { ModelHealthPanel } from '../components/ModelHealthPanel';
import { Activity, TrendingUp, PieChart as PieChartIcon, Shield, Box } from 'lucide-react';

export const Dashboard = () => {
    return (
        <div className="space-y-8 pb-12">
            {/* Hero & Vital Stats */}
            <HeroPanel />
            <StatsGrid />

            {/* Tactical Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Primary Column: Analytics & Visualization */}
                <div className="xl:col-span-8 space-y-8">
                    {/* Main Analytics Card */}
                    <div className="glass-panel p-8 lg:p-10 min-h-[500px] relative overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between mb-10 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-soc-accent/10 rounded-lg">
                                    <Activity className="w-5 h-5 text-soc-accent" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white tracking-tight">Threat Volatility Index</h3>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Real-time heuristic cluster analysis</p>
                                </div>
                            </div>
                            <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                                <button className="px-4 py-1.5 rounded-lg text-[10px] font-bold text-slate-500 hover:text-white transition-all uppercase tracking-widest">Live</button>
                                <button className="px-4 py-1.5 bg-soc-accent/10 rounded-lg text-[10px] font-bold text-soc-accent border border-soc-accent/20 uppercase tracking-widest">7D History</button>
                            </div>
                        </div>

                        <div className="flex-1 min-h-0 relative z-10">
                            <ChartsPanel type="line" />
                        </div>

                        {/* Visual Accent */}
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <Shield className="w-32 h-32 text-soc-accent" />
                        </div>
                    </div>

                    {/* Threat Map Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-soc-accent" />
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Tactical Intelligence Map</h3>
                            <div className="h-px flex-1 bg-white/[0.03]" />
                            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Global Ingress / Egress</span>
                        </div>
                        <div className="glass-panel p-4 bg-black/20 border-white/[0.02]">
                            <ThreatMap />
                        </div>
                    </div>
                </div>

                {/* Secondary Column: Live Stream & Health */}
                <div className="xl:col-span-4 space-y-8">
                    <ModelHealthPanel />

                    {/* Neural Stream Feed */}
                    <div className="glass-panel p-0 h-[550px] flex flex-col relative overflow-hidden group">
                        <div className="px-6 py-5 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.01]">
                            <div className="flex items-center gap-3">
                                <div className="flex space-x-1">
                                    <div className="w-1 h-1 rounded-full bg-soc-accent animate-ping" />
                                    <div className="w-1 h-1 rounded-full bg-soc-accent" />
                                </div>
                                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">Neural Stream</h3>
                            </div>
                            <div className="px-2 py-0.5 rounded border border-soc-accent/20 bg-soc-accent/5 text-soc-accent text-[8px] font-bold uppercase tracking-widest">
                                Processing Live
                            </div>
                        </div>
                        <div className="flex-1 min-h-0 p-4">
                            <LiveFeed />
                        </div>
                    </div>

                    {/* Distribution Summary */}
                    <div className="glass-panel p-8 group">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-soc-accent/5 rounded-lg border border-white/5">
                                <PieChartIcon className="w-4 h-4 text-soc-accent group-hover:rotate-90 transition-transform duration-500" />
                            </div>
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Classification Mix</h3>
                        </div>
                        <div className="h-[220px]">
                            <ChartsPanel type="doughnut" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
