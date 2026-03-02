import { Search, Bell, Monitor, Activity, ShieldAlert, Menu, X } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { ProfileDropdown } from './ProfileDropdown';
import { NotificationDropdown } from './NotificationDropdown';

export const Topbar = () => {
    const { isSidebarOpen, setIsSidebarOpen } = useUI();

    return (
        <header className="h-20 border-b border-white/5 bg-soc-bg/80 backdrop-blur-md sticky top-0 z-40 px-6 lg:px-12 flex items-center justify-between">
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 -ml-2 mr-4 bg-white/5 rounded-xl border border-white/10 text-slate-400 hover:text-white transition-all overflow-hidden"
            >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-soc-cyan transition-colors" />
                    <input
                        type="text"
                        placeholder="Search Intelligence Nodes..."
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-soc-cyan/30 focus:bg-white/[0.05] transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-8 pl-12">
                <div className="hidden lg:flex items-center gap-6 pr-6 border-r border-white/5">
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 text-[10px] font-black text-soc-success uppercase tracking-widest">
                            <Activity className="w-3 h-3 animate-pulse" />
                            System Optimal
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Latency: 12ms</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <NotificationDropdown />
                    <ProfileDropdown />
                </div>
            </div>
        </header>
    );
};
