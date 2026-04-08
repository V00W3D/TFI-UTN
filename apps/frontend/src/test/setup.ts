import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// 1. Mock the environment GLOBALLY to avoid Zod initialization errors
// during module evaluation for tests.
vi.mock('../env', () => ({
  MODE: 'dev',
  PUBLIC_APP_SCOPE: 'full',
  HOSTING_PROFILE: 'standard',
  TAILSCALE_DEVICE_IP: '',
  BACKEND_HOST: 'localhost',
  BACKEND_PORT: 3000,
  BACKEND_URL: 'http://localhost:3000',
}));

// Re-stub for any code that specifically uses import.meta.env
vi.stubEnv('VITE_MODE', 'dev');
vi.stubEnv('VITE_PUBLIC_APP_SCOPE', 'full');
vi.stubEnv('VITE_HOSTING_PROFILE', 'standard');
vi.stubEnv('VITE_BACKEND_HOST', '');
vi.stubEnv('VITE_BACKEND_PORT', '');
vi.stubEnv('VITE_BACKEND_URL', '');

afterEach(() => {
  cleanup();
});
