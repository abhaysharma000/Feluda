import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export const ThreatMap = () => {
    // Absolute nodes mapping to 800x400 viewBox
    const nodes = useMemo(() => [
        { id: 1, x: 150, y: 120, label: 'North America', status: 'secure' },
        { id: 2, x: 280, y: 280, label: 'South America', status: 'secure' },
        { id: 3, x: 420, y: 100, label: 'Europe Cluster', status: 'threat' },
        { id: 4, x: 450, y: 260, label: 'Africa Hub', status: 'secure' },
        { id: 5, x: 620, y: 140, label: 'Asia Core', status: 'threat' },
        { id: 6, x: 700, y: 320, label: 'Australia Node', status: 'secure' },
    ], []);

    const connections = useMemo(() => [
        { from: 1, to: 3 },
        { from: 3, to: 5 },
        { from: 5, to: 6 },
        { from: 1, to: 2 },
        { from: 3, to: 4 },
        { from: 5, to: 1 },
    ], []);

    return (
        <div className="relative w-full h-[500px] bg-black/40 rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
            {/* Grid Background */}
            <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

            <svg className="w-full h-full p-8 overflow-visible" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
                {/* Connections with moving gradients */}
                {connections.map((conn, idx) => {
                    const fromNode = nodes.find(n => n.id === conn.from);
                    const toNode = nodes.find(n => n.id === conn.to);
                    const pathId = `path-${idx}`;
                    const pathData = `M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`;

                    return (
                        <g key={pathId}>
                            <motion.path
                                d={pathData}
                                stroke="rgba(16, 185, 129, 0.2)"
                                strokeWidth="1"
                                fill="none"
                            />
                            <circle r="2" fill="#10b981">
                                <animateMotion
                                    dur={`${3 + Math.random() * 2}s`}
                                    repeatCount="indefinite"
                                    path={pathData}
                                />
                            </circle>
                        </g>
                    );
                })}

                {/* Nodes */}
                {nodes.map((node) => (
                    <g key={node.id}>
                        {/* Outer Glow */}
                        <motion.circle
                            cx={node.x}
                            cy={node.y}
                            r="12"
                            fill={node.status === 'threat' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}
                            animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                        {/* Core Point */}
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r="5"
                            fill={node.status === 'threat' ? '#ef4444' : '#10b981'}
                            style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}
                        />
                        {/* Label */}
                        <text
                            x={node.x}
                            y={node.y + 25}
                            textAnchor="middle"
                            className="text-[10px] font-black uppercase tracking-[0.2em] fill-slate-400 select-none pointer-events-none"
                            style={{ fontSize: '10px' }}
                        >
                            {node.label}
                        </text>
                    </g>
                ))}
            </svg>

            {/* Matrix Overlay Data */}
            <div className="absolute bottom-8 left-8 flex gap-4">
                <div className="glass-card p-4 border-emerald-500/20 bg-black/60 shadow-neon-small">
                    <div className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.1em] mb-1">Active Clusters</div>
                    <div className="text-xl font-bold text-white tabular-nums">412</div>
                </div>
                <div className="glass-card p-4 border-danger/20 bg-black/60 shadow-neon-red-small">
                    <div className="text-[8px] font-black text-danger uppercase tracking-[0.1em] mb-1">Inbound Breaches</div>
                    <div className="text-xl font-bold text-white tabular-nums animate-pulse">02</div>
                </div>
            </div>

            {/* Scan Line Animation */}
            <motion.div
                className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-accent/60 to-transparent z-10"
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
};
