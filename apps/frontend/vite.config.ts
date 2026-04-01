import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  const hosting = env.VITE_HOSTING_PROFILE ?? 'standard';
  const tailscale = env.VITE_TAILSCALE_DEVICE_IP?.trim();
  const hostRaw = env.VITE_BACKEND_HOST?.trim();
  const host =
    hostRaw ||
    (hosting === 'local_tailscale' && tailscale ? tailscale : '') ||
    (hosting === 'replit' ? 'localhost' : 'localhost');
  const port = env.VITE_BACKEND_PORT?.trim() || '3000';
  const target = `http://${host}:${port}`;

  return {
    plugins: [react(), tailwindcss()],

    server: {
      allowedHosts: true,
      proxy: {
        '/iam': { target, changeOrigin: true, secure: false },
        '/customers': { target, changeOrigin: true, secure: false },
        '/assets': { target, changeOrigin: true, secure: false },
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
  };
});
