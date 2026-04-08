import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// STUB ENVIRONMENT GLOBALLY AT TOP LEVEL
// This ensures that import.meta.env is populated before any module (like src/env.ts) is evaluated.
vi.stubEnv('VITE_MODE', 'dev');
vi.stubEnv('VITE_PUBLIC_APP_SCOPE', 'full');
vi.stubEnv('VITE_HOSTING_PROFILE', 'standard');
vi.stubEnv('VITE_BACKEND_HOST', '');
vi.stubEnv('VITE_BACKEND_PORT', '');
vi.stubEnv('VITE_BACKEND_URL', '');

// Also mock the env module itself for safety
vi.mock('../src/qartEnv', () => ({
  MODE: 'dev',
  PUBLIC_APP_SCOPE: 'full',
  HOSTING_PROFILE: 'standard',
  TAILSCALE_DEVICE_IP: '',
  BACKEND_HOST: 'localhost',
  BACKEND_PORT: 3000,
  BACKEND_URL: 'http://localhost:3000',
}));

vi.mock('@env', () => ({
  MODE: 'dev',
  PUBLIC_APP_SCOPE: 'full',
  BACKEND_URL: 'http://localhost:3000',
}));

beforeEach(() => {
  // Reset stubs just in case
  vi.stubEnv('VITE_MODE', 'dev');
});

afterEach(() => {
  cleanup();
});
