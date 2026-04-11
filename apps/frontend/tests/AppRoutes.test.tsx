// @vitest-environment jsdom
/**
 * @file AppRoutes.test.tsx
 * @module Frontend/Tests
 * @description Unit tests for AppRoutes component.
 *
 * @tfi
 * section: IEEE 830 11 / 12.1
 * rf: RF-17
 * rnf: RNF-03
 *
 * @business
 * inputs: PUBLIC_APP_SCOPE
 * outputs: route tree passed to useRoutes
 * rules: include CustomerRoutes only if scope is 'full'
 *
 * @technical
 * dependencies: @testing-library/react, vitest, react-router-dom
 * flow: mock qartEnv, mock useRoutes -> render -> verify routes passed to useRoutes
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-ROUTES-01, TC-ROUTES-02
 *
 * @notes
 */
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

// 1. Mock dependencies
vi.mock('react-router-dom', () => ({
  useRoutes: vi.fn(() => <div data-testid="routes-root" />),
}));

// Route module mocks
vi.mock('@modules/Customer/CustomerRoutes', () => ({
  CustomerRoutes: { path: '/customer' },
}));
vi.mock('@modules/IAM/IAMRoutes', () => ({
  IAMRoutes: { path: '/iam' },
}));
vi.mock('@modules/Landing/LandingRoutes', () => ({
  LandingRoutes: { path: '/' },
}));
vi.mock('@modules/Search/SearchRoutes', () => ({
  SearchRoutes: { path: '/search' },
}));

// 2. We mock `useRoutes` out to verify what routes were passed to it.
import { useRoutes } from 'react-router-dom';

describe('AppRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-ROUTES-01: expone CustomerRoutes cuando PUBLIC_APP_SCOPE es "full"', async () => {
    // Override the mocked env just for this test
    vi.doMock('../src/qartEnv', () => ({
      PUBLIC_APP_SCOPE: 'full',
    }));
    
    // Dynamically import the module so it uses the mocked env
    const AppRoutes = (await import('../src/AppRoutes')).default;

    render(<AppRoutes />);

    expect(useRoutes).toHaveBeenCalled();
    const routesArg = (useRoutes as any).mock.calls[0][0];
    
    // Should include all routes
    const paths = routesArg.map((r: any) => r.path);
    expect(paths).toContain('/');
    expect(paths).toContain('/search');
    expect(paths).toContain('/iam');
    expect(paths).toContain('/customer');
  });

  it('TC-ROUTES-02: NO expone CustomerRoutes cuando PUBLIC_APP_SCOPE no es "full"', async () => {
    vi.resetModules();
    vi.doMock('../src/qartEnv', () => ({
      PUBLIC_APP_SCOPE: 'landing_only',
    }));

    const AppRoutes = (await import('../src/AppRoutes')).default;

    render(<AppRoutes />);

    expect(useRoutes).toHaveBeenCalled();
    const routesArg = (useRoutes as any).mock.calls[0][0];
    
    const paths = routesArg.map((r: any) => r.path);
    expect(paths).toContain('/');
    expect(paths).toContain('/search');
    expect(paths).toContain('/iam');
    expect(paths).not.toContain('/customer');
  });
});
