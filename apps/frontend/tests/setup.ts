import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

beforeEach(() => {
  vi.stubEnv('VITE_MODE', 'dev');
  vi.stubEnv('VITE_PUBLIC_APP_SCOPE', 'full');
  vi.stubEnv('VITE_HOSTING_PROFILE', 'standard');
  vi.stubEnv('VITE_BACKEND_HOST', '');
  vi.stubEnv('VITE_BACKEND_PORT', '');
  vi.stubEnv('VITE_BACKEND_URL', '');
});

afterEach(() => {
  cleanup();
});
