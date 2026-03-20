import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    base: '/dashboard/',
    build: {
        outDir: '../app/static/cyber-soc',
        emptyOutDir: true
    }
});
