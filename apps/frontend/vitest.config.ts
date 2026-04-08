import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const rootPattern = rootDir.replaceAll('\\', '/');

export default defineConfig({
  root: rootDir,
  plugins: [react()],
  resolve: {
    alias: {
      '@store': path.resolve(rootDir, 'src/appStore.ts'),
      '@env': path.resolve(rootDir, 'src/qartEnv.ts'),
      '@tools': path.resolve(rootDir, 'src/tools'),
      '@modules': path.resolve(rootDir, 'src/modules'),
    },
  },
  test: {
    name: 'frontend-v2',
    environment: 'jsdom',
    globals: true,
    setupFiles: [path.resolve(rootDir, 'tests/setup.ts')],
    include: [
      `${rootPattern}/tests/**/*.{test,spec}.{ts,tsx}`,
      `${rootPattern}/src/**/*.{test,spec}.{ts,tsx}`,
    ],
    exclude: [`${rootPattern}/src/**/*.d.ts`],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: '../../coverage/frontend',
      include: [`${rootPattern}/src/**/*.{ts,tsx}`],
      exclude: [
        `${rootPattern}/src/main.tsx`,
        `${rootPattern}/src/env.ts`,
        `${rootPattern}/src/**/*.d.ts`,
        `${rootPattern}/src/assets/**`,
        `${rootPattern}/src/test/**`,
        `${rootPattern}/tests/setup.ts`,
      ],
    },
  },
});
