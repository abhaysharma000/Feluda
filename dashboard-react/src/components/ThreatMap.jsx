import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Globe as GlobeIcon, MapPin, Activity, ShieldAlert } from 'lucide-react';
import { clsx } from 'clsx';

export const ThreatMap = () => {
    // Absolute nodes mapping to 800x400 viewBox
    const nodes = useMemo(() => [
        { id: 1, x: 150, y: 120, label: 'NORTH_AMERICA_WEST', status: 'secure' },
        { id: 2, x: 280, y: 280, label: 'SOUTH_AMERICA_HUB', status: 'secure' },
        { id: 3, x: 420, y: 100, label: 'EURO_CLUSTER_01', status: 'threat' },
        { id: 4, x: 450, y: 260, label: 'AFRICA_SUB_NODE', status: 'secure' },
        { id: 5, x: 620, y: 140, label: 'ASIA_PACIFIC_CORE', status: 'threat' },
        { id: 6, x: 700, y: 320, label: 'OCEANIA_BACKBONE', status: 'secure' },
    ], []);

    const connections = useMemo(() => [
        { from: 1, to: 3 }, { from: 3, to: 5 }, { from: 5, to: 6 },
        { from: 1, to: 2 }, { from: 3, to: 4 }, { from: 5, to: 1 },
    ], []);

    return (
        <div className="relative w-full h-[550px] bg-black/40 overflow-hidden rounded-[2rem] border border-white/[0.03] group backdrop-blur-sm">
            {/* Contextual Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            <svg className="w-full h-full p-12 overflow-visible relative z-10" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
                {/* Tactical Connections */}
                {connections.map((conn, idx) => {
                    const fromNode = nodes.find(n => n.id === conn.from);
                    const toNode = nodes.find(n => n.id === conn.to);
                    const pathData = `M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`;

                    return (
                        <g key={`conn-${idx}`}>
                            <motion.path
                                d={pathData}
                                stroke="rgba(0, 229, 255, 0.08)"
                                strokeWidth="1"
                                fill="none"
                            />
                            <motion.circle r="1.5" fill="#00E5FF">
                                <animateMotion
                                    dur={`${5 + Math.random() * 5}s`}
                                    repeatCount="indefinite"
                                    path={pathData}
                                />
                            </motion.circle>
                        </g>
                    );
                })}

                {/* Regional Nodes */}
                {nodes.map((node) => (
                    <g key={node.id}>
                        {/* Status Pulse */}
                        <motion.circle
                            cx={node.x}
                            cy={node.y}
                            r="12"
                            fill={node.status === 'threat' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 229, 255, 0.1)'}
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        />
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r="3"
                            className={clsx("transition-colors duration-500",
                                node.status === 'threat' ? 'fill-soc-danger' : 'fill-soc-accent'
                            )}
                        />
                        {/* Tactical Label */}
                        <g transform={`translate(${node.x}, ${node.y + 25})`}>
                            <rect x="-40" y="-8" width="80" height="16" rx="4" fill="rgba(0,0,0,0.4)" className="backdrop-blur-sm" />
                            <text
                                textAnchor="middle"
                                className="text-[7px] font-bold uppercase tracking-[0.2em] fill-slate-400 select-none pointer-events-none"
                                y="2"
                            >
                                {node.label}
                            </text>
                        </g>
                    </g>
                ))}
            </svg>

            {/* Tactical Overlays */}
            <div className="absolute top-8 left-8 flex flex-col gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-white/5 rounded-full">
                    <GlobeIcon className="w-3.5 h-3.5 text-soc-accent" />
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Global Backbone: Active</span>
                </div>
            </div>

            <div className="absolute bottom-8 right-8 flex gap-4">
                <div className="glass-panel px-6 py-4 border-white/[0.05] bg-black/40">
                    <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-3 h-3 text-soc-accent" />
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Active Links</span>
                    </div>
                    <div className="text-2xl font-bold text-white tabular-nums">1.2k</div>
                </div>
                <div className="glass-panel px-6 py-4 border-soc-danger/20 bg-soc-danger/[0.03]">
                    <div className="flex items-center gap-2 mb-1">
                        <ShieldAlert className="w-3 h-3 text-soc-danger" />
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">High Alert</span>
                    </div>
                    <div className="text-2xl font-bold text-soc-danger tabular-nums">04</div>
                </div>
            </div>

            {/* Sweep Line */}
            <motion.div
                className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-soc-accent/20 to-transparent z-10"
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
};
