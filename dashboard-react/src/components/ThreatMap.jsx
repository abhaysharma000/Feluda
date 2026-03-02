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
        <div className="relative w-full h-[600px] bg-soc-bg overflow-hidden border border-white/5 rounded-[2rem] group">
            {/* Ambient background glow */}
            <div className="absolute inset-0 bg-radial-gradient from-soc-cyan/5 to-transparent opacity-30" />

            <svg className="w-full h-full p-12 overflow-visible" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
                {/* Connections with moving gradients */}
                {connections.map((conn, idx) => {
                    const fromNode = nodes.find(n => n.id === conn.from);
                    const toNode = nodes.find(n => n.id === conn.to);
                    const pathData = `M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`;

                    return (
                        <g key={`conn-${idx}`}>
                            <motion.path
                                d={pathData}
                                stroke="rgba(0, 229, 255, 0.1)"
                                strokeWidth="0.5"
                                fill="none"
                            />
                            <circle r="1.5" fill="#00E5FF">
                                <animateMotion
                                    dur={`${4 + Math.random() * 3}s`}
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
                            r="15"
                            fill={node.status === 'threat' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.1)'}
                            animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0.5, 0.2] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                        {/* Core Point */}
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r="4"
                            className={node.status === 'threat' ? 'fill-soc-danger shadow-neon-danger' : 'fill-soc-success shadow-neon-cyan'}
                        />
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r="2"
                            fill="white"
                            opacity="0.8"
                        />
                        {/* Label */}
                        <text
                            x={node.x}
                            y={node.y + 35}
                            textAnchor="middle"
                            className="text-[9px] font-black uppercase tracking-[0.4em] fill-slate-500 select-none pointer-events-none italic"
                        >
                            {node.label}
                        </text>
                    </g>
                ))}
            </svg>

            {/* Matrix Overlay Data */}
            <div className="absolute bottom-12 left-12 flex gap-6">
                <div className="glass-card p-6 border-soc-success/20 bg-soc-bg/80 group-hover:bg-soc-success/5 transition-all outline outline-soc-success/10 outline-offset-4">
                    <div className="text-[9px] font-black text-soc-success uppercase tracking-[0.3em] mb-2 italic">Active Clusters</div>
                    <div className="text-3xl font-black text-white tabular-nums italic">412</div>
                </div>
                <div className="glass-card p-6 border-soc-danger/20 bg-soc-bg/80 group-hover:bg-soc-danger/5 transition-all outline outline-soc-danger/10 outline-offset-4">
                    <div className="text-[9px] font-black text-soc-danger uppercase tracking-[0.3em] mb-2 italic">Anomalous Nodes</div>
                    <div className="text-3xl font-black text-white tabular-nums animate-pulse italic">02</div>
                </div>
            </div>

            {/* Scan Line Animation */}
            <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-soc-cyan/30 to-transparent z-10"
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
};
