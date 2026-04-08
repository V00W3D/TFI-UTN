import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const rootPattern = rootDir.replaceAll('\\', '/');

export default defineConfig({
  root: rootDir,
  test: {
    name: 'shared',
    environment: 'node',
    globals: true,
    include: [
      `${rootPattern}/sdk/**/*.{test,spec}.ts`,
      `${rootPattern}/contracts/**/*.{test,spec}.ts`,
      `${rootPattern}/sdk/tests/**/*.{test,spec}.ts`,
      `${rootPattern}/contracts/tests/**/*.{test,spec}.ts`,
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: '../coverage/shared',
      include: [`${rootPattern}/sdk/**/*.ts`, `${rootPattern}/contracts/**/*.ts`],
      exclude: [`${rootPattern}/**/*.d.ts`],
    },
  },
});
