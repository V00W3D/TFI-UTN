// @vitest-environment jsdom
/**
 * @file LandingPage.test.tsx
 * @module Landing/Tests
 * @description Unit tests for LandingPage orchestrator component.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: appStore setModule action
 * outputs: composed landing view with all child sections
 * rules: must call setModule('LANDING') on mount
 *
 * @technical
 * dependencies: @testing-library/react, vitest, appStore, react-router-dom
 * flow: render -> verify module set -> verify key sections present
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-FE-LP-01, TC-FE-LP-02
 *
 * @notes
 * decisions: all child components mocked to isolate page orchestration logic
 */
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../src/appStore', () => ({ useAppStore: vi.fn() }));

vi.mock('../../../src/modules/Landing/components/Navbar', () => ({
  default: () => <nav data-testid="navbar" />,
}));
vi.mock('../../../src/modules/Landing/components/Hero', () => ({
  default: () => <section data-testid="hero" />,
}));
vi.mock('../../../src/modules/Landing/components/Story', () => ({
  default: () => <section data-testid="story" />,
}));
vi.mock('../../../src/modules/Landing/components/HowWeServe', () => ({
  default: () => <section data-testid="how-we-serve" />,
}));
vi.mock('../../../src/modules/Landing/components/FeaturedSpotlight', () => ({
  default: () => <section data-testid="featured-spotlight" />,
}));
vi.mock('../../../src/modules/Landing/components/CraftSection', () => ({
  default: () => <section data-testid="craft-section" />,
}));
vi.mock('../../../src/modules/Landing/components/Contact', () => ({
  default: () => <section data-testid="contact" />,
}));
vi.mock('../../../src/modules/Landing/components/OrderPanel', () => ({
  default: () => <div data-testid="order-panel" />,
}));
vi.mock('../../../src/modules/Landing/LandingPages.css', () => ({}));

import LandingPage from '../../../src/modules/Landing/pages/LandingPage';
import { useAppStore } from '../../../src/appStore';

describe('LandingPage', () => {
  const mockSetModule = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAppStore as any).mockReturnValue({ setModule: mockSetModule });
  });

  it('TC-FE-LP-01: registra el modulo LANDING al montar la pagina', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    expect(mockSetModule).toHaveBeenCalledWith('LANDING');
  });

  it('TC-FE-LP-02: compone todas las secciones principales de la landing', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByTestId('story')).toBeInTheDocument();
    expect(screen.getByTestId('how-we-serve')).toBeInTheDocument();
    expect(screen.getByTestId('featured-spotlight')).toBeInTheDocument();
    expect(screen.getByTestId('craft-section')).toBeInTheDocument();
    expect(screen.getByTestId('contact')).toBeInTheDocument();
    expect(screen.getByTestId('order-panel')).toBeInTheDocument();
  });
});
