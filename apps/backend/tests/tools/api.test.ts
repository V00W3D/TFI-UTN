/**
 * @file api.test.ts
 * @module Backend/Tests
 * @description Unit tests for api.ts infrastructure.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18
 * rnf: RNF-05
 *
 * @business
 * inputs: none (uses env variables)
 * outputs: api instance and express app
 * rules: provides a standard server api and express middleware setup
 *
 * @technical
 * dependencies: vitest, api.ts, express, @app/sdk
 * flow: mock dependencies -> import api -> verify instance creation
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-TOOL-API-01
 * ultima prueba exitosa: 2026-04-08 14:05:00
 *
 * @notes
 */
import { describe, expect, it, vi } from 'vitest';

// Pre-mocking dependencies
vi.mock('@app/sdk/ApiServer', () => ({
  createServerApi: vi.fn().mockImplementation(() => ({
    handler: vi.fn(),
  })),
}));

vi.mock('../../src/env', () => ({
  BACKEND_URL: 'http://localhost:3000',
  BACKEND_HOST: 'localhost',
  BACKEND_PORT: 3000,
  BUN_MODE: 'dev',
  FRONTEND_HOST: 'localhost',
  FRONTEND_PORT: 5173,
  CORS_EXTRA_ORIGINS: '',
  REPLIT_DEV_DOMAIN: '',
}));

// Mock express components
vi.mock('express', () => {
    const mockRouter = vi.fn();
    const mockApp = {
        use: vi.fn(),
        post: vi.fn(),
        get: vi.fn(),
    };
    const express: any = vi.fn(() => mockApp);
    express.Router = vi.fn(() => mockRouter);
    express.json = vi.fn();
    express.urlencoded = vi.fn();
    express.static = vi.fn();
    return { default: express, Router: express.Router };
});

vi.mock('cors', () => ({ default: vi.fn() }));
vi.mock('helmet', () => ({ default: vi.fn() }));
vi.mock('cookie-parser', () => ({ default: vi.fn() }));

// Now import after mocks
import { api } from '../../src/tools/api';
import app from '../../src/tools/api';

describe('api tool', () => {
  it('TC-TOOL-API-01: exporta la instancia de api y la app de express', () => {
    expect(api).toBeDefined();
    expect(app).toBeDefined();
  });
});
