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
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
            gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');

            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
                    datasets: [{
                        label: 'Inbound Anomalies',
                        data: [12, 19, 8, 15, 7, 33, 15],
                        borderColor: '#10b981',
                        borderWidth: 3,
                        fill: true,
                        backgroundColor: gradient,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: '#10b981',
                        pointBorderColor: '#000',
                        pointBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        x: { grid: { display: false }, ticks: { color: '#475569', font: { size: 10 } } },
                        y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#475569', font: { size: 10 } } }
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
                        backgroundColor: ['#10b981', '#FF3B3B', '#FACC15'],
                        borderWidth: 0,
                        hoverOffset: 15
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '75%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: '#94a3b8', font: { size: 11 }, usePointStyle: true, padding: 20 }
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
        <div className="w-full h-full min-h-[300px]">
            <canvas ref={chartRef} />
        </div>
    );
};
