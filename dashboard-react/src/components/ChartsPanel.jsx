import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { motion } from 'framer-motion';

Chart.register(...registerables);

export const ChartsPanel = ({ type = 'line' }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');

        if (type === 'line') {
            const gradient = ctx.createLinearGradient(0, 0, 0, 350);
            gradient.addColorStop(0, 'rgba(0, 229, 255, 0.4)');
            gradient.addColorStop(1, 'rgba(0, 229, 255, 0)');

            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
                    datasets: [{
                        label: 'Neural Anomalies',
                        data: [12, 19, 8, 15, 7, 33, 15],
                        borderColor: '#00E5FF',
                        borderWidth: 3,
                        fill: true,
                        backgroundColor: gradient,
                        tension: 0.5,
                        pointRadius: 6,
                        pointBackgroundColor: '#00E5FF',
                        pointBorderColor: '#0B0F19',
                        pointBorderWidth: 3,
                        pointHoverRadius: 8,
                        pointHoverBackgroundColor: '#FFFFFF',
                        pointHoverBorderColor: '#00E5FF',
                        pointHoverBorderWidth: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(17, 24, 39, 0.95)',
                            titleFont: { size: 10, weight: 'bold', family: 'Inter' },
                            bodyFont: { size: 12, family: 'Inter' },
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            borderWidth: 1,
                            padding: 12,
                            displayColors: false,
                            cornerRadius: 12
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: { color: '#64748b', font: { size: 10, weight: 'bold', family: 'Inter' } }
                        },
                        y: {
                            grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false },
                            ticks: { color: '#64748b', font: { size: 10, weight: 'bold', family: 'Inter' } }
                        }
                    }
                }
            });
        } else {
            chartInstance.current = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Safe', 'Malicious', 'Suspicious'],
                    datasets: [{
                        data: [82, 8, 10],
                        backgroundColor: ['#22C55E', '#EF4444', '#1E3A8A'],
                        borderColor: '#111827',
                        borderWidth: 8,
                        hoverOffset: 15
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '80%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: '#64748b', font: { size: 10, weight: 'bold', family: 'Inter' }, usePointStyle: true, padding: 25 }
                        }
                    }
                }
            });
        }

        return () => {
            if (chartInstance.current) chartInstance.current.destroy();
        };
    }, [type]);

    return (
        <div className="w-full h-full min-h-[350px]">
            <canvas ref={chartRef} />
        </div>
    );
};
