import React from 'react';
import { LogsTable } from '../components/LogsTable';

export const Logs = () => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold text-white tracking-tight uppercase">Entropy Audit Logs</h2>
                <p className="text-slate-500 text-sm italic">Historical neural inference trace for global vectors.</p>
            </div>
            <LogsTable />
        </div>
    );
};
