import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useUI } from '../context/UIContext';
import { motion } from 'framer-motion';

Chart.register(...registerables);

export const ChartsPanel = ({ type = 'line' }) => {
    const { stats } = useUI();
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');

        if (type === 'line') {
            const gradient = ctx.createLinearGradient(0, 0, 0, 350);
            gradient.addColorStop(0, 'rgba(0, 229, 255, 0.2)');
            gradient.addColorStop(1, 'rgba(0, 229, 255, 0)');

            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
                    datasets: [{
                        label: 'Threat Intensity',
                        data: [12, 19, 8, 15, 7, 33, 15], // Hourly buckets would require backend persistence
                        borderColor: '#00E5FF',
                        borderWidth: 2,
                        fill: true,
                        backgroundColor: gradient,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: '#00E5FF',
                        pointBorderColor: '#0B0F19',
                        pointBorderWidth: 2,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: '#FFFFFF',
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        intersect: false,
                        mode: 'index',
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(11, 15, 25, 0.9)',
                            titleFont: { size: 11, weight: 'bold', family: 'Inter' },
                            bodyFont: { size: 12, family: 'Inter' },
                            borderColor: 'rgba(255, 255, 255, 0.05)',
                            borderWidth: 1,
                            padding: 12,
                            cornerRadius: 8,
                            displayColors: false
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: {
                                color: '#64748b',
                                font: { size: 10, weight: 'bold', family: 'Inter' },
                                padding: 10
                            }
                        },
                        y: {
                            grid: { color: 'rgba(255,255,255,0.02)', drawBorder: false },
                            ticks: {
                                color: '#64748b',
                                font: { size: 10, weight: 'bold', family: 'Inter' },
                                padding: 10
                            }
                        }
                    }
                }
            });
        } else {
            const safeCount = Math.max(0, stats.scanned - stats.malicious - stats.suspicious);

            chartInstance.current = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Safe_Zone', 'Anomalous', 'Suspected'],
                    datasets: [{
                        data: [safeCount || 100, stats.malicious, stats.suspicious],
                        backgroundColor: ['#22C55E', '#EF4444', '#FACC15'],
                        borderColor: '#111827',
                        borderWidth: 4,
                        hoverOffset: 10
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '75%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#64748b',
                                font: { size: 10, weight: '600', family: 'Inter' },
                                usePointStyle: true,
                                padding: 20
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(11, 15, 25, 0.9)',
                            padding: 10,
                            cornerRadius: 8,
                            borderColor: 'rgba(255, 255, 255, 0.05)',
                            borderWidth: 1
                        }
                    }
                }
            });
        }

        return () => {
            if (chartInstance.current) chartInstance.current.destroy();
        };
    }, [type, stats]);

    return (
        <div className="w-full h-full min-h-[300px]">
            <canvas ref={chartRef} />
        </div>
    );
};
