import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';

export default defineConfig({
    root: './app',
    publicDir: '../public',
    server: {
        host: true,
        port: 3001,
        strictPort: true,
    },
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        reportCompressedSize: true,
        rolldownOptions: {
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
});
