/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                black: '#000000',
                darkblue: {
                    900: '#050a14',
                    950: '#000000',
                },
                green: {
                    accent: '#10b981',
                    glow: '#00ff88',
                },
                danger: '#FF3B3B',
                warning: '#FACC15',
                'cyan-accent': '#00f2ff',
                'navy-950': '#020617',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Space Grotesk', 'sans-serif'],
            },
            boxShadow: {
                'neon': '0 0 15px rgba(16, 185, 129, 0.3)',
                'neon-red': '0 0 15px rgba(255, 59, 59, 0.3)',
                'neon-cyan': '0 0 15px rgba(0, 242, 255, 0.3)',
            },
            animation: {
                'spin-slow': 'spin 8s linear infinite',
            }
        },
    },
    plugins: [],
}
