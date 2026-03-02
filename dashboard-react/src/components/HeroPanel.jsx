import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Radiation, Cpu, Database } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { clsx } from 'clsx';

export const HeroPanel = () => {
    const { isSimulationMode } = useUI();
    const canvasRef = useRef(null);

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

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
            }
            draw() {
                ctx.fillStyle = isSimulationMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            resize();
            particles = Array.from({ length: particleCount }, () => new Particle());
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, i) => {
                p.update();
                p.draw();
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = p.x - particles[j].x;
                    const dy = p.y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.strokeStyle = isSimulationMode
                            ? `rgba(239, 68, 68, ${0.1 * (1 - dist / 100)})`
                            : `rgba(16, 185, 129, ${0.1 * (1 - dist / 100)})`;
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
    }, [isSimulationMode]);

    return (
        <section className={clsx(
            "relative overflow-hidden p-8 rounded-[2rem] border transition-all duration-1000",
            isSimulationMode
                ? "border-danger/20 bg-danger/5 shadow-[0_0_50px_rgba(255,59,59,0.2)]"
                : "border-emerald-500/20 bg-emerald-500/5 status-glow-secure"
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
                                isSimulationMode ? "border-danger/20" : "border-emerald-500/20"
                            )}
                        />
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                            className={clsx(
                                "absolute inset-0 rounded-full border-b-4",
                                isSimulationMode ? "border-danger" : "border-emerald-500"
                            )}
                        />
                        <div className={clsx(
                            "absolute inset-2 rounded-full flex items-center justify-center",
                            isSimulationMode ? "bg-danger/20" : "bg-emerald-500/20"
                        )}>
                            {isSimulationMode ? (
                                <Radiation className="w-10 h-10 text-danger animate-pulse" />
                            ) : (
                                <ShieldCheck className="w-10 h-10 text-emerald-400" />
                            )}
                        </div>
                    </div>

                    <div>
                        <span className={clsx(
                            "text-[10px] font-bold tracking-[0.3em] uppercase",
                            isSimulationMode ? "text-danger/70" : "text-emerald-500/70"
                        )}>Intelligence Verdict</span>
                        <h1 className="text-4xl font-bold mt-1 text-white">
                            NEURAL STATUS: <span className={isSimulationMode ? "text-danger" : "text-emerald-400"}>
                                {isSimulationMode ? "BREACH ATTEMPTED" : "PROTECTED"}
                            </span>
                        </h1>
                        <div className="text-slate-400 font-medium mt-2 flex items-center gap-6">
                            <span className="flex items-center gap-2">
                                <Cpu className="w-4 h-4 text-green-accent opacity-50" />
                                Neural Latency: 114ms
                            </span>
                            <span className="flex items-center gap-2">
                                <Database className="w-4 h-4 text-green-accent opacity-50" />
                                12.8M Signatures Active
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="p-6 glass-card bg-black/20 text-center min-w-[140px]">
                        <div className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-1">Threats Blocked</div>
                        <div className="text-3xl font-bold text-white tabular-nums">423</div>
                    </div>
                    <div className="p-6 glass-card bg-black/20 text-center min-w-[140px]">
                        <div className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-1">Risk Score Avg</div>
                        <div className="text-3xl font-bold text-green-accent tabular-nums">1.4%</div>
                    </div>
                </div>
            </div>
        </section>
    );
};
