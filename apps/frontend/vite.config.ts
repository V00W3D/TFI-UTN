import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
    proxy: {
      '/iam': { target: 'http://localhost:3000', changeOrigin: true, secure: false },
      '/customers': { target: 'http://localhost:3000', changeOrigin: true, secure: false },
      '/assets': { target: 'http://localhost:3000', changeOrigin: true, secure: false },
    },
  },

  resolve: {
    tsconfigPaths: true,
  },

  build: {
    sourcemap: false,
    minify: 'terser',
    cssMinify: true,

    rolldownOptions: {
      output: {
        entryFileNames: 'assets/[hash].js',
        chunkFileNames: 'assets/[hash].js',
        assetFileNames: 'assets/[hash].[ext]',
      },
    },
  },
});
