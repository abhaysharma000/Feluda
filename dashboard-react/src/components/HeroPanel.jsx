import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Radiation, Cpu, Database, Zap, AlertTriangle } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { clsx } from 'clsx';

// Particle factory function for internal canvas
function createParticle(canvas) {
    const p = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2,
    };
    p.reset = () => {
        p.x = Math.random() * canvas.width;
        p.y = Math.random() * canvas.height;
        p.vx = (Math.random() - 0.5) * 0.8;
        p.vy = (Math.random() - 0.5) * 0.8;
        p.size = Math.random() * 2;
    };
    p.update = () => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) p.reset();
    };
    p.draw = (ctx, color) => {
        ctx.fillStyle = color === 'danger' ? 'rgba(239, 68, 68, 0.4)' : (color === 'cyan' ? 'rgba(0, 229, 255, 0.4)' : 'rgba(34, 197, 94, 0.4)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    };
    return p;
}

export const HeroPanel = () => {
    const { isSimulationMode, isScanning, lastScanVerdict, stats } = useUI();
    const canvasRef = useRef(null);

    const isThreatState = isSimulationMode || lastScanVerdict === 'threat';
    const activeColor = isScanning ? 'cyan' : (isThreatState ? 'danger' : 'emerald');
    const avgRisk = stats.avgRisk.toFixed(1);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        const particleCount = 20;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        const init = () => {
            resize();
            particles = Array.from({ length: particleCount }, () => createParticle(canvas));
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, i) => {
                p.update();
                p.draw(ctx, activeColor);
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        init();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [activeColor]);

    const getStatusText = () => {
        if (isScanning) return "NEURAL SCAN IN PROGRESS";
        if (isSimulationMode) return "SIMULATION ACTIVE";
        if (lastScanVerdict === 'threat') return "SECURITY BREACH DETECTED";
        return "SYSTEM FORTIFIED";
    };

    return (
        <section className={clsx(
            "relative overflow-hidden p-6 lg:p-12 rounded-[1.5rem] lg:rounded-[2.5rem] border transition-all duration-1000",
            activeColor === 'danger' && "border-soc-danger/30 bg-soc-danger/5",
            activeColor === 'cyan' && "border-soc-cyan/30 bg-soc-cyan/5 shadow-neon-cyan",
            activeColor === 'emerald' && "border-soc-success/30 bg-soc-success/5 status-glow-secure"
        )}>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-30" />

            <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-8 lg:gap-12 text-center lg:text-left">
                <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12 w-full">
                    <div className="relative w-24 h-24 lg:w-32 lg:h-32 flex-shrink-0">
                        <motion.div
                            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                            className={clsx(
                                "absolute inset-0 rounded-full border-[6px]",
                                activeColor === 'danger' ? "border-soc-danger/20" : (activeColor === 'cyan' ? "border-soc-cyan/20" : "border-soc-success/20")
                            )}
                        />
                        <div className={clsx(
                            "absolute inset-0 rounded-full border-b-[6px] animate-[spin_4s_linear_infinite]",
                            activeColor === 'danger' ? "border-soc-danger shadow-neon-danger" : (activeColor === 'cyan' ? "border-soc-cyan shadow-neon-cyan" : "border-soc-success")
                        )} />

                        <div className={clsx(
                            "absolute inset-3 rounded-full flex items-center justify-center",
                            activeColor === 'danger' ? "bg-soc-danger/10" : (activeColor === 'cyan' ? "bg-soc-cyan/10" : "bg-soc-success/10")
                        )}>
                            {activeColor === 'danger' ? (
                                <AlertTriangle className="w-12 h-12 text-soc-danger" />
                            ) : (
                                <ShieldCheck className={clsx("w-12 h-12", activeColor === 'cyan' ? "text-soc-cyan" : "text-soc-success")} />
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <span className={clsx(
                                "text-[10px] font-black uppercase tracking-[0.4em]",
                                activeColor === 'danger' ? "text-soc-danger" : (activeColor === 'cyan' ? "text-soc-cyan" : "text-soc-success")
                            )}>
                                Master Control Node
                            </span>
                            <div className="h-px w-24 bg-white/5" />
                        </div>

                        <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tighter uppercase italic leading-tight">
                            {getStatusText()}
                        </h1>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 lg:gap-8 pt-2">
                            <div className="flex items-center gap-2.5">
                                <Cpu className="w-4 h-4 text-soc-cyan/60" />
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Latency: {isScanning ? '∞' : '14ms'}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Database className="w-4 h-4 text-soc-cyan/60" />
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{stats.scanned.toLocaleString()} Inspections</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Zap className="w-4 h-4 text-soc-cyan/60" />
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Active Link Shield</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-6 w-full xl:w-auto h-full">
                    <div className="flex-1 xl:w-48 p-7 glass-card bg-white/[0.01] flex flex-col items-center justify-center gap-2 group">
                        <div className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Neutralized</div>
                        <div className="text-4xl font-black text-white group-hover:text-soc-danger transition-colors duration-500 tabular-nums">{stats.malicious.toLocaleString()}</div>
                        <div className="w-8 h-1 bg-soc-danger/30 rounded-full" />
                    </div>
                    <div className="flex-1 xl:w-48 p-7 glass-card bg-white/[0.01] flex flex-col items-center justify-center gap-2 group">
                        <div className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Global Risk</div>
                        <div className={clsx(
                            "text-4xl font-black tabular-nums transition-colors duration-500",
                            parseFloat(avgRisk) > 50 ? "text-soc-danger" : "text-soc-cyan group-hover:text-white"
                        )}>{avgRisk}%</div>
                        <div className={clsx("w-8 h-1 rounded-full", parseFloat(avgRisk) > 50 ? "bg-soc-danger/30" : "bg-soc-cyan/30")} />
                    </div>
                </div>
            </div>
        </section>
    );
};
