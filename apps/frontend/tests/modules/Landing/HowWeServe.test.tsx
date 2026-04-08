// @vitest-environment jsdom
/**
 * @file HowWeServe.test.tsx
 * @module Landing/Tests
 * @description Unit tests for HowWeServe section component.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: none (static presentation)
 * outputs: two main service modality cards
 * rules: CTAs link to /search; How to get there links to #contact
 *
 * @technical
 * dependencies: @testing-library/react, vitest, react-router-dom, framer-motion
 * flow: render -> verify titles -> verify links
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 2
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-FE-HWS-01
 *
 * @notes
 */
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import HowWeServe from '../../../src/modules/Landing/components/HowWeServe';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('HowWeServe', () => {
  it('TC-FE-HWS-01: renderiza las opciones de servicio correctamente', () => {
    render(
      <MemoryRouter>
        <HowWeServe />
      </MemoryRouter>
    );

    expect(screen.getByText('EN TU CASA')).toBeInTheDocument();
    expect(screen.getByText('EN EL LOCAL')).toBeInTheDocument();
    
    const deliveryCta = screen.getByText('Pedir con delivery');
    expect(deliveryCta).toHaveAttribute('href', '/search');
    
    const pickupCta = screen.getByText('Pedir para retiro');
    expect(pickupCta).toHaveAttribute('href', '/search');
    
    const reachCta = screen.getByText(/C.*mo llegar/i);
    expect(reachCta).toHaveAttribute('href', '#contact');
  });
});
