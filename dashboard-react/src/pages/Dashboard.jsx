import React from 'react';
import { motion } from 'framer-motion';
import { useUI } from '../context/UIContext';
import { HeroPanel } from '../components/HeroPanel';
import { StatsGrid } from '../components/StatsGrid';
import { ChartsPanel } from '../components/ChartsPanel';
import { ThreatMap } from '../components/ThreatMap';
import { LiveFeed } from '../components/LiveFeed';
import { ModelHealthPanel } from '../components/ModelHealthPanel';

export const Dashboard = () => {
    return (
        <div className="space-y-8 pb-12">
            {/* Hero Section */}
            <HeroPanel />

            {/* Stats Overview */}
            <StatsGrid />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Threat Analysis & Charts */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card p-8 min-h-[400px]">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold">Inbound Threat Volatility</h3>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 bg-white/5 rounded-md text-[10px] font-bold text-slate-400 hover:text-white transition-colors">24H</button>
                                <button className="px-3 py-1 bg-green-accent/10 rounded-md text-[10px] font-bold text-green-accent">7D</button>
                            </div>
                        </div>
                        <div className="h-[300px]">
                            <ChartsPanel type="line" />
                        </div>
                    </div>
                    <ThreatMap />
                </div>

                {/* Live Intelligence Feed & Health */}
                <div className="space-y-8">
                    <ModelHealthPanel />
                    <div className="glass-card p-6 h-[400px] flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-white">Live Intelligence</h3>
                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[8px] font-bold uppercase">
                                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                                Real-time
                            </span>
                        </div>
                        <div className="flex-1 min-h-0">
                            <LiveFeed />
                        </div>
                    </div>
                    <div className="glass-card p-8">
                        <h3 className="text-lg font-bold mb-8">Classification Mix</h3>
                        <div className="h-[250px]">
                            <ChartsPanel type="doughnut" />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};
