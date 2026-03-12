import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, Shield, AlertTriangle, Globe, Cpu } from 'lucide-react';

export const GlobalTicker = () => {
    const alerts = [
        { icon: Zap, text: "Ingress Saturation: 84.2%", color: "text-soc-accent" },
        { icon: Shield, text: "Zero-Day Shield: ACTIVE", color: "text-soc-success" },
        { icon: AlertTriangle, text: "Bypass Attempt: Blocked (Node 42)", color: "text-soc-danger" },
        { icon: Globe, text: "Mesh Integrity: 99.9% Synchronized", color: "text-soc-accent" },
        { icon: Cpu, text: "Neural Latency: 1.2ms (Optimal)", color: "text-soc-success" },
        { icon: Activity, text: "Live Trace: AS2981 -> Intercepted", color: "text-soc-warning" }
    ];

    // Double the items for seamless loop
    const tickerItems = [...alerts, ...alerts, ...alerts];

    return (
        <div className="h-8 bg-black/40 border-b border-white/[0.03] overflow-hidden flex items-center relative z-50">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-soc-bg to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-soc-bg to-transparent z-10" />
            
            <motion.div 
                className="flex items-center gap-12 px-4 whitespace-nowrap"
                animate={{ x: [0, -1000] }}
                transition={{ 
                    duration: 30, 
                    repeat: Infinity, 
                    ease: "linear" 
                }}
            >
                {tickerItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <item.icon className={`w-3 h-3 ${item.color}`} />
                        <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">{item.text}</span>
                        <span className="w-1 h-1 rounded-full bg-white/10 mx-2" />
                    </div>
                ))}
            </motion.div>
        </div>
    );
};
