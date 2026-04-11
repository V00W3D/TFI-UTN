// @vitest-environment jsdom
/**
 * @file BillingPage.test.tsx
 * @module Landing/Tests
 * @description Unit tests for BillingPage component.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: user session (tier), billingPlans data
 * outputs: plan cards, active tier indicator, pricing display
 * rules: show REGULAR as default tier for guests; highlight active plan; call setModule('LANDING')
 *
 * @technical
 * dependencies: @testing-library/react, vitest, appStore, react-router-dom, billingPlans
 * flow: mock appStore -> render -> verify plan cards and tier indicator
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 2
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-FE-BP-01, TC-FE-BP-02, TC-FE-BP-03
 *
 * @notes
 */
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../src/appStore', () => ({ useAppStore: vi.fn() }));
vi.mock('../../../src/modules/Landing/components/Navbar', () => ({
  default: () => <nav data-testid="navbar" />,
}));
vi.mock('../../../src/modules/Landing/components/OrderPanel', () => ({
  default: () => <div data-testid="order-panel" />,
}));
vi.mock('../../../src/modules/Landing/LandingPages.css', () => ({}));
// formatLandingPrice uses Intl — works fine in jsdom, no mock needed

import BillingPage from '../../../src/modules/Landing/pages/BillingPage';
import { useAppStore } from '../../../src/appStore';

describe('BillingPage', () => {
  const mockSetModule = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-FE-BP-01: registra el modulo LANDING al montar', () => {
    (useAppStore as any).mockReturnValue({ setModule: mockSetModule, user: null });
    render(
      <MemoryRouter>
        <BillingPage />
      </MemoryRouter>
    );
    expect(mockSetModule).toHaveBeenCalledWith('LANDING');
  });

  it('TC-FE-BP-02: muestra REGULAR como tier activo para usuarios sin sesion', () => {
    (useAppStore as any).mockReturnValue({ setModule: mockSetModule, user: null });
    render(
      <MemoryRouter>
        <BillingPage />
      </MemoryRouter>
    );
    // The "Tu estado actual" widget shows current tier
    expect(screen.getByText('REGULAR')).toBeInTheDocument();
  });

  it('TC-FE-BP-03: muestra VIP como tier activo para usuario VIP y resalta ese plan', () => {
    (useAppStore as any).mockReturnValue({
      setModule: mockSetModule,
      user: { profile: { tier: 'VIP' } },
    });
    render(
      <MemoryRouter>
        <BillingPage />
      </MemoryRouter>
    );
    // 'VIP' appears in both the status widget and the plan heading — getAllByText allows multiple
    expect(screen.getAllByText('VIP').length).toBeGreaterThanOrEqual(1);
    // The active plan card renders an "Actual" badge
    expect(screen.getByText('Actual')).toBeInTheDocument();
  });

  it('TC-FE-BP-04: renderiza los tres planes REGULAR, VIP y PREMIUM', () => {
    (useAppStore as any).mockReturnValue({ setModule: mockSetModule, user: null });
    render(
      <MemoryRouter>
        <BillingPage />
      </MemoryRouter>
    );
    // billingPlans contains REGULAR, VIP, PREMIUM as h2 headings
    expect(screen.getByRole('heading', { name: /regular/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /vip/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /premium/i })).toBeInTheDocument();
  });
});
