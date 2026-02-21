import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  root: 'frontend',
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  build: {
    outDir: '../frontend/dist',
    emptyOutDir: true,
  },
});
