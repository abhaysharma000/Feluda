import { HeroPanel } from '../components/HeroPanel';
import { ModelHealthPanel } from '../components/ModelHealthPanel';
import { ChartsPanel } from '../components/ChartsPanel';
import { Eye, Ban, AlertTriangle, Mail } from 'lucide-react';
import { clsx } from 'clsx';

const stats = [
    { id: 'scanned', label: 'Assets Scanned', value: '12,842', change: '+12%', icon: Eye, color: 'purple' },
    { id: 'malicious', label: 'Malicious Sites', value: '423', badge: 'Critical', icon: Ban, color: 'danger' },
    { id: 'suspicious', label: 'Suspicious', value: '1,102', badge: 'Review', icon: AlertTriangle, color: 'warning' },
    { id: 'email', label: 'Email Vectors', value: '89', badge: 'Dynamic', icon: Mail, color: 'blue' },
];

export const Dashboard = () => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <HeroPanel />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.id} className="glass-card p-6 border-white/5 hover:border-white/10 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={clsx(
                                "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                                stat.color === 'purple' && "bg-purple-500/10 text-purple-400",
                                stat.color === 'danger' && "bg-danger/10 text-danger",
                                stat.color === 'warning' && "bg-warning/10 text-warning",
                                stat.color === 'blue' && "bg-blue-500/10 text-blue-400"
                            )}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            {stat.change && <span className="text-xs font-bold text-emerald-400">{stat.change}</span>}
                            {stat.badge && (
                                <span className={clsx(
                                    "text-[8px] px-2 py-0.5 rounded font-black uppercase tracking-wider",
                                    stat.color === 'danger' && "bg-danger/20 text-danger",
                                    stat.color === 'warning' && "bg-warning/20 text-warning",
                                    stat.color === 'blue' && "bg-blue-500/20 text-blue-400"
                                )}>
                                    {stat.badge}
                                </span>
                            )}
                        </div>
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</h3>
                        <div className="text-3xl font-bold text-white tabular-nums">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                </div>
                <div className="space-y-8">
                    <ModelHealthPanel />
                    <div className="glass-card p-8">
                        <h3 className="text-lg font-bold mb-8">Classification Mix</h3>
                        <div className="h-[250px]">
                            <ChartsPanel type="doughnut" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
