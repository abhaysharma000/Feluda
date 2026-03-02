import React from 'react';
import { HeroPanel } from '../components/HeroPanel';
import { StatsGrid } from '../components/StatsGrid';
import { ChartsPanel } from '../components/ChartsPanel';
import { ThreatMap } from '../components/ThreatMap';
import { LiveFeed } from '../components/LiveFeed';
import { ModelHealthPanel } from '../components/ModelHealthPanel';
import { Activity, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';

export const Dashboard = () => {
    return (
        <div className="space-y-6 lg:space-y-12 pb-12">
            {/* Hero Section */}
            <HeroPanel />

            {/* Stats Overview */}
            <StatsGrid />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
                {/* Threat Analysis & Charts */}
                <div className="lg:col-span-2 space-y-6 lg:space-y-12">
                    <div className="glass-card p-6 lg:p-10 min-h-[400px] lg:min-h-[500px] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-32 bg-soc-cyan/20" />

                        <div className="flex items-center justify-between mb-10">
                            <div className="space-y-1">
                                <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Inbound Threat Volatility</h3>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Real-time heuristic analysis over the last 7 cycles.</p>
                            </div>
                            <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                                <button className="px-4 py-1.5 rounded-lg text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest">24H</button>
                                <button className="px-4 py-1.5 bg-soc-cyan/10 rounded-lg text-[10px] font-black text-soc-cyan border border-soc-cyan/10 uppercase tracking-widest">7D</button>
                            </div>
                        </div>

                        <div className="h-[350px]">
                            <ChartsPanel type="line" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 px-4">
                            <TrendingUp className="w-4 h-4 text-soc-cyan/60" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Global Threat Matrix</h3>
                            <div className="h-px flex-1 bg-white/5" />
                        </div>
                        <ThreatMap />
                    </div>
                </div>

                {/* Live Intelligence Feed & Health */}
                <div className="space-y-6 lg:space-y-12">
                    <ModelHealthPanel />

                    <div className="glass-card p-6 lg:p-8 h-[500px] flex flex-col relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-soc-cyan/5 rounded-full -mr-16 -mt-16 group-hover:bg-soc-cyan/10 transition-all duration-500" />

                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-soc-cyan animate-pulse shadow-neon-cyan" />
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Neural stream</h3>
                            </div>
                            <span className="px-2 py-0.5 rounded border border-soc-cyan/20 bg-soc-cyan/5 text-soc-cyan text-[8px] font-black uppercase tracking-widest">
                                Live Ingress
                            </span>
                        </div>
                        <div className="flex-1 min-h-0">
                            <LiveFeed />
                        </div>
                    </div>

                    <div className="glass-card p-6 lg:p-8 group">
                        <div className="flex items-center gap-3 mb-8">
                            <PieChartIcon className="w-5 h-5 text-soc-cyan/60 group-hover:rotate-45 transition-transform duration-500" />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white italic">Classification Mix</h3>
                        </div>
                        <div className="h-[250px] flex items-center justify-center">
                            <ChartsPanel type="doughnut" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
