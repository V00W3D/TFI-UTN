// @vitest-environment jsdom
/**
 * @file Hero.test.tsx
 * @module Landing/Tests
 * @description Unit tests for Hero section component.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: static presentation
 * outputs: high-impact main section with CTAs
 * rules: primary CTA to /search; secondary buttons scroll to sections
 *
 * @technical
 * dependencies: @testing-library/react, vitest, react-router-dom, framer-motion
 * flow: render -> verify text -> mock scrollIntoView -> click secondary buttons -> verify call
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 2
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-FE-HERO-01, TC-FE-HERO-02
 *
 * @notes
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Hero from '../../../src/modules/Landing/components/Hero';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}));

describe('Hero', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock scrollIntoView since JSDOM doesn't implement it
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    
    // Create elements that buttons try to find
    const featured = document.createElement('div');
    featured.id = 'destacados';
    document.body.appendChild(featured);

    const howItWorks = document.createElement('div');
    howItWorks.id = 'como-funciona';
    document.body.appendChild(howItWorks);
  });

  it('TC-FE-HERO-01: renderiza el contenido principal y CTA primario', () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );

    expect(screen.getByText(/Comé bien,/i)).toBeInTheDocument();
    expect(screen.getByText(/sin complicarte./i)).toBeInTheDocument();
    
    const cta = screen.getByText(/Pedir ahora/i);
    expect(cta.closest('a')).toHaveAttribute('href', '/search');
  });

  it('TC-FE-HERO-02: los botones secundarios disparan scrollIntoView', () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );

    const favsBtn = screen.getByText(/Favoritos/i);
    fireEvent.click(favsBtn);
    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

    vi.clearAllMocks();

    const howBtn = screen.getByText(/Cómo funciona/i);
    fireEvent.click(howBtn);
    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });
});
