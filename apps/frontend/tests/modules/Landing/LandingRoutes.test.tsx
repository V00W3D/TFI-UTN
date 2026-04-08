// @vitest-environment jsdom
/**
 * @file LandingRoutes.test.tsx
 * @module Landing/Tests
 * @description Unit tests for LandingRoutes configuration.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: navigation paths
 * outputs: correct page components
 * rules: route index to LandingPage; others to specific craft/config/billing pages
 *
 * @technical
 * dependencies: react-router-dom, LandingRoutes, vitest
 * flow: create router with LandingRoutes -> navigate to path -> verify mock component presence
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-FE-LR-01, TC-FE-LR-02, TC-FE-LR-03, TC-FE-LR-04
 *
 * @notes
 */
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { LandingRoutes } from '../../../src/modules/Landing/LandingRoutes';

// Mock components to avoid deep rendering
vi.mock('../../../src/modules/Landing/pages/LandingPage', () => ({
  default: () => <div data-testid="landing-page">Landing Page</div>,
}));
vi.mock('../../../src/modules/Landing/pages/CraftPage', () => ({
  default: () => <div data-testid="craft-page">Craft Page</div>,
}));
vi.mock('../../../src/modules/Landing/pages/ConfigPage', () => ({
  default: () => <div data-testid="config-page">Config Page</div>,
}));
vi.mock('../../../src/modules/Landing/pages/BillingPage', () => ({
  default: () => <div data-testid="billing-page">Billing Page</div>,
}));

describe('LandingRoutes', () => {
  it('TC-FE-LR-01: rutea al index (LandingPage) correctamente', () => {
    const router = createMemoryRouter([LandingRoutes], {
      initialEntries: ['/'],
    });
    render(<RouterProvider router={router} />);
    expect(screen.getByTestId('landing-page')).toBeInTheDocument();
  });

  it('TC-FE-LR-02: rutea a /craft (CraftPage) correctamente', () => {
    const router = createMemoryRouter([LandingRoutes], {
      initialEntries: ['/craft'],
    });
    render(<RouterProvider router={router} />);
    expect(screen.getByTestId('craft-page')).toBeInTheDocument();
  });

  it('TC-FE-LR-03: rutea a /config (ConfigPage) correctamente', () => {
    const router = createMemoryRouter([LandingRoutes], {
      initialEntries: ['/config'],
    });
    render(<RouterProvider router={router} />);
    expect(screen.getByTestId('config-page')).toBeInTheDocument();
  });

  it('TC-FE-LR-04: rutea a /facturacion (BillingPage) correctamente', () => {
    const router = createMemoryRouter([LandingRoutes], {
      initialEntries: ['/facturacion'],
    });
    render(<RouterProvider router={router} />);
    expect(screen.getByTestId('billing-page')).toBeInTheDocument();
  });
});
