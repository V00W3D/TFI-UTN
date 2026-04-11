// @vitest-environment jsdom
/**
 * @file CraftSection.test.tsx
 * @module Landing/Tests
 * @description Unit tests for CraftSection component.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: static CTA content
 * outputs: rendered copy, scroll-trigger button
 * rules: button click should call scrollIntoView on #destacados
 *
 * @technical
 * dependencies: @testing-library/react, vitest, framer-motion
 * flow: mock framer-motion, mock scrollIntoView -> render -> verify copy -> click button
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-FE-CS-01, TC-FE-CS-02
 *
 * @notes
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('framer-motion', () => ({
  motion: {
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

import CraftSection from '../../../src/modules/Landing/components/CraftSection';

describe('CraftSection', () => {
  it('TC-FE-CS-01: renderiza el copy principal de la seccion Crafteo', () => {
    render(<CraftSection />);
    expect(screen.getByText(/Crafteo/i)).toBeInTheDocument();
    expect(screen.getByText(/sin apuro/i)).toBeInTheDocument();
    expect(screen.getByText(/Ver favoritos/i)).toBeInTheDocument();
  });

  it('TC-FE-CS-02: el boton Ver favoritos intenta hacer scrollIntoView en #destacados', () => {
    const mockScrollIntoView = vi.fn();
    const mockGetElementById = vi
      .spyOn(document, 'getElementById')
      .mockReturnValue({ scrollIntoView: mockScrollIntoView } as any);

    render(<CraftSection />);
    fireEvent.click(screen.getByText('Ver favoritos'));

    expect(mockGetElementById).toHaveBeenCalledWith('destacados');
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

    mockGetElementById.mockRestore();
  });
});
