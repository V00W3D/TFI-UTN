/**
 * @file vite.config.ts
 * @module Frontend
 * @description Archivo vite.config alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-05
 *
 * @business
 * inputs: configuracion de Vite, plugins y rutas base del frontend
 * outputs: configuracion de build y dev server del frontend
 * rules: mantener el bundler alineado al stack React y al workspace
 *
 * @technical
 * dependencies: vite, @vitejs/plugin-react, @tailwindcss/vite, node:path, node:url
 * flow: define la configuracion de Vite; registra plugins y aliases necesarios; expone el comportamiento de build y desarrollo del frontend.
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-AUDIT-01
 *
 * @notes
 * decisions: la configuracion de Vite se mantiene acotada y explicita para facilitar build y DX
 */
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
