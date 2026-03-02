import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Radiation, Cpu, Database } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { clsx } from 'clsx';

// Particle factory function (avoids class-in-closure Rollup issue)
function createParticle(canvas) {
    const p = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2,
    };
    p.reset = () => {
        p.x = Math.random() * canvas.width;
        p.y = Math.random() * canvas.height;
        p.vx = (Math.random() - 0.5) * 0.5;
        p.vy = (Math.random() - 0.5) * 0.5;
        p.size = Math.random() * 2;
    };
    p.update = () => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) p.reset();
    };
    p.draw = (ctx, color) => {
        ctx.fillStyle = color === 'danger' ? 'rgba(239, 68, 68, 0.2)' : (color === 'cyan' ? 'rgba(0, 255, 255, 0.2)' : 'rgba(16, 185, 129, 0.2)');
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
        const particleCount = 40;

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
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = p.x - particles[j].x;
                    const dy = p.y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.strokeStyle = activeColor === 'danger'
                            ? `rgba(239, 68, 68, ${0.1 * (1 - dist / 100)})`
                            : (activeColor === 'cyan' ? `rgba(0, 255, 255, ${0.1 * (1 - dist / 100)})` : `rgba(16, 185, 129, ${0.1 * (1 - dist / 100)})`);
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
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
        if (isScanning) return "ANALYZING...";
        if (isSimulationMode) return "SIMULATION ACTIVE";
        if (lastScanVerdict === 'threat') return "THREAT IDENTIFIED";
        return "PROTECTED";
    };

    return (
        <section className={clsx(
            "relative overflow-hidden p-8 rounded-[2rem] border transition-all duration-1000",
            activeColor === 'danger' && "border-danger/20 bg-danger/5 shadow-[0_0_50px_rgba(255,59,59,0.2)]",
            activeColor === 'cyan' && "border-cyan-accent/20 bg-cyan-accent/5 shadow-[0_0_50px_rgba(0,255,255,0.2)]",
            activeColor === 'emerald' && "border-emerald-500/20 bg-emerald-500/5 status-glow-secure"
        )}>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-8">
                    <div className="relative w-24 h-24">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className={clsx(
                                "absolute inset-0 rounded-full border-4",
                                activeColor === 'danger' ? "border-danger/20" : (activeColor === 'cyan' ? "border-cyan-accent/20" : "border-emerald-500/20")
                            )}
                        />
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                            className={clsx(
                                "absolute inset-0 rounded-full border-b-4",
                                activeColor === 'danger' ? "border-danger" : (activeColor === 'cyan' ? "border-cyan-accent" : "border-emerald-500")
                            )}
                        />
                        <div className={clsx(
                            "absolute inset-2 rounded-full flex items-center justify-center",
                            activeColor === 'danger' ? "bg-danger/20" : (activeColor === 'cyan' ? "bg-cyan-accent/20" : "bg-emerald-500/20")
                        )}>
                            {activeColor === 'danger' ? (
                                <Radiation className="w-10 h-10 text-danger animate-pulse" />
                            ) : (
                                <ShieldCheck className={clsx("w-10 h-10", activeColor === 'cyan' ? "text-cyan-accent animate-pulse" : "text-emerald-400")} />
                            )}
                        </div>
                    </div>

                    <div>
                        <span className={clsx(
                            "text-[10px] font-bold tracking-[0.3em] uppercase",
                            activeColor === 'danger' ? "text-danger/70" : (activeColor === 'cyan' ? "text-cyan-accent/70" : "text-emerald-500/70")
                        )}>Neural Intelligence Stream</span>
                        <h1 className="text-4xl font-bold mt-1 text-white">
                            STATUS: <span className={clsx(
                                activeColor === 'danger' ? "text-danger" : (activeColor === 'cyan' ? "text-cyan-accent" : "text-emerald-400")
                            )}>
                                {getStatusText()}
                            </span>
                        </h1>
                        <div className="text-slate-400 font-medium mt-2 flex items-center gap-6">
                            <span className="flex items-center gap-2">
                                <Cpu className="w-4 h-4 text-green-accent opacity-50" />
                                Neural Latency: {isScanning ? '...' : (isSimulationMode ? '24ms' : '114ms')}
                            </span>
                            <span className="flex items-center gap-2">
                                <Database className="w-4 h-4 text-green-accent opacity-50" />
                                {stats.scanned.toLocaleString()} Assets Inspected
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="p-6 glass-card bg-black/20 text-center min-w-[140px]">
                        <div className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-1">Threats Blocked</div>
                        <div className="text-3xl font-bold text-white tabular-nums">{stats.malicious.toLocaleString()}</div>
                    </div>
                    <div className="p-6 glass-card bg-black/20 text-center min-w-[140px]">
                        <div className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-1">Risk Score Avg</div>
                        <div className={clsx(
                            "text-3xl font-bold tabular-nums",
                            parseFloat(avgRisk) > 50 ? "text-danger" : "text-green-accent"
                        )}>{avgRisk}%</div>
                    </div>
                </div>
            </div>
        </section>
    );
};
