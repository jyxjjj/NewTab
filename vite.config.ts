import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';

export default defineConfig({
    root: './app',
    publicDir: '../public',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            input: ['./app/newtab.html'],
            output: {
                hashCharacters: 'hex',
                entryFileNames: 'newtab/[name].[hash].js',
                chunkFileNames: 'newtab/[name].[hash].js',
                assetFileNames: 'newtab/[name].[hash].[ext]',
            },
        },
    },
    plugins: [
        react(),
    ],
    resolve: {
        conditions: ['mui-modern', 'module', 'browser', 'development|production']
    },
});
