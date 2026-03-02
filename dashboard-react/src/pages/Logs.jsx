import React from 'react';
import { LogsTable } from '../components/LogsTable';
import { Terminal } from 'lucide-react';

export const Logs = () => {
    return (
        <div className="space-y-8 pb-12">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 flex items-center gap-3">
                        <Terminal className="text-green-accent w-8 h-8" />
                        Entropy Logs
                    </h1>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest italic">Inbound Threat Intelligence & Event correlation</p>
                </div>

                <div className="hidden lg:flex items-center gap-4">
                    <div className="glass-card px-4 py-2 border-green-accent/20 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-accent animate-pulse" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Master Node: Active</span>
                    </div>
                </div>
            </header>

            <div className="glass-card p-1 overflow-hidden border-white/5 bg-white/[0.01]">
                <LogsTable />
            </div>
        </div>
    );
};
