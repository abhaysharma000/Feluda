import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'soc-bg': '#0B0F19',
                'soc-surface': '#111827',
                'soc-primary': '#1E3A8A',
                'soc-cyan': '#00E5FF',
                'soc-danger': '#EF4444',
                'soc-success': '#22C55E',
                'green-accent': '#10B981', // Existing color alias
                'danger': '#EF4444',       // Existing color alias
                'warning': '#F59E0B',      // Existing color alias
            },
            fontFamily: {
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                'neon-cyan': '0 0 15px rgba(0, 229, 255, 0.3)',
                'neon-danger': '0 0 15px rgba(239, 68, 68, 0.3)',
            },
            backgroundImage: {
                'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
            }
        },
    },
    plugins: [],
}
