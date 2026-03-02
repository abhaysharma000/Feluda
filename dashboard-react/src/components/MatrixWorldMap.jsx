import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const MatrixWorldMap = () => {
    // Simplified high-fidelity SVG path for the world map
    // Using a curated set of points for a "Neural Grid" look
    const nodes = useMemo(() => [
        { id: 1, x: '25%', y: '35%', label: 'North America Node', status: 'secure' },
        { id: 2, x: '35%', y: '65%', label: 'South America Node', status: 'secure' },
        { id: 3, x: '50%', y: '30%', label: 'Europe Node', status: 'threat' },
        { id: 4, x: '55%', y: '70%', label: 'Africa Node', status: 'secure' },
        { id: 5, x: '75%', y: '40%', label: 'Asia Node', status: 'threat' },
        { id: 6, x: '85%', y: '75%', label: 'Australia Node', status: 'secure' },
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
        <div className="relative w-full h-[500px] bg-black/20 rounded-3xl overflow-hidden border border-white/5">
            {/* Grid Background */}
            <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

            <svg className="w-full h-full p-12 overflow-visible" viewBox="0 0 800 400">
                {/* Connections with moving gradients */}
                {connections.map((conn, idx) => {
                    const fromNode = nodes.find(n => n.id === conn.from);
                    const toNode = nodes.find(n => n.id === conn.to);
                    return (
                        <g key={`conn-${idx}`}>
                            <line
                                x1={fromNode.x}
                                y1={fromNode.y}
                                x2={toNode.x}
                                y2={toNode.y}
                                stroke="rgba(16, 185, 129, 0.1)"
                                strokeWidth="1"
                            />
                            <motion.circle
                                r="2"
                                fill="#10b981"
                                initial={{ offsetDistance: "0%" }}
                                animate={{ offsetDistance: "100%" }}
                                transition={{
                                    duration: 3 + Math.random() * 2,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                style={{
                                    offsetPath: `path('M ${parseFloat(fromNode.x) * 8} ${parseFloat(fromNode.y) * 4} L ${parseFloat(toNode.x) * 8} ${parseFloat(toNode.y) * 4}')`
                                }}
                            />
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
                            fill={node.status === 'threat' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)'}
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        {/* Core Point */}
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r="4"
                            fill={node.status === 'threat' ? '#ef4444' : '#10b981'}
                            className="shadow-neon"
                        />
                        {/* Label */}
                        <text
                            x={node.x}
                            y={parseFloat(node.y) + 20 + '%'}
                            textAnchor="middle"
                            className="text-[8px] font-black uppercase tracking-widest fill-slate-500"
                        >
                            {node.label}
                        </text>
                    </g>
                ))}
            </svg>

            {/* Matrix Overlay Data */}
            <div className="absolute bottom-8 left-8 flex gap-6">
                <div className="glass-card p-3 border-emerald-500/20">
                    <div className="text-[8px] font-black text-emerald-500 uppercase mb-1">Active Clusters</div>
                    <div className="text-xl font-bold text-white">412 <span className="text-[10px] text-slate-500 tracking-tighter">Nodes</span></div>
                </div>
                <div className="glass-card p-3 border-danger/20">
                    <div className="text-[8px] font-black text-danger uppercase mb-1">Inbound Breaches</div>
                    <div className="text-xl font-bold text-white">02 <span className="text-[10px] text-slate-500 tracking-tighter">Live</span></div>
                </div>
            </div>

            {/* Neural Scan Line Animation */}
            <motion.div
                className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-green-accent/40 to-transparent z-10"
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
};

export default MatrixWorldMap;
