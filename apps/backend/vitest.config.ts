import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const rootPattern = rootDir.replaceAll('\\', '/');

export default defineConfig({
  root: rootDir,
  resolve: {
    alias: {
      '@env': path.resolve(rootDir, 'src/env.ts'),
      '@middleware': path.resolve(rootDir, 'src/middleware'),
      '@tools': path.resolve(rootDir, 'src/tools'),
      '@modules': path.resolve(rootDir, 'src/modules'),
    },
  },
  test: {
    name: 'backend',
    environment: 'node',
    globals: true,
    setupFiles: [path.resolve(rootDir, 'tests/setup.ts')],
    include: [
      `${rootPattern}/tests/**/*.{test,spec}.ts`,
      `${rootPattern}/src/**/*.{test,spec}.ts`,
    ],
    exclude: [`${rootPattern}/src/**/*.d.ts`, `${rootPattern}/prisma/generated/**`],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: '../../coverage/backend',
      include: [`${rootPattern}/src/**/*.ts`],
      exclude: [
        `${rootPattern}/src/index.ts`,
        `${rootPattern}/src/env.ts`,
        `${rootPattern}/src/**/*.d.ts`,
        `${rootPattern}/src/test/**`,
        `${rootPattern}/tests/setup.ts`,
      ],
    },
  },
});
