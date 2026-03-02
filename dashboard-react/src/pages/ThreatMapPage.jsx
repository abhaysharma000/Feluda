import React from 'react';
import { LiveFeed } from '../components/LiveFeed';

export const ThreatMapPage = () => {
    return (
        <div className="h-full flex flex-col space-y-8 animate-in fade-in zoom-in-95 duration-700">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold text-white tracking-tight uppercase">Neural Matrix Map</h2>
                <p className="text-slate-500 text-sm italic">Simulated global neural infrastructure mesh topology.</p>
            </div>

            <div className="flex-1 min-h-[500px] glass-card relative overflow-hidden group">
                <div className="absolute inset-0 grid-bg pointer-events-none z-0"></div>

                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center">
                        <div className="w-64 h-64 border-2 border-green-accent/20 rounded-full animate-spin-slow flex items-center justify-center p-8">
                            <div className="w-full h-full border-2 border-green-accent/40 rounded-full animate-reverse-spin"></div>
                        </div>
                        <div className="mt-8 text-[10px] font-black uppercase text-green-accent tracking-[0.5em] animate-pulse">
                            Neural Grid Projecting...
                        </div>
                    </div>
                </div>

                <div className="absolute top-8 right-8 space-y-4 z-20">
                    <div className="glass-card p-4 bg-black/80 border-green-accent/20 backdrop-blur-md min-w-[200px] hover:scale-105 transition-transform">
                        <div className="text-[8px] font-black text-green-accent uppercase tracking-widest mb-2">Inference Traffic</div>
                        <div className="text-2xl font-bold text-white">842.4 <span className="text-xs text-slate-500">GB/s</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
