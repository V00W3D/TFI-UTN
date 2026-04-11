// @vitest-environment jsdom
/**
 * @file CraftPage.test.tsx
 * @module Landing/Tests
 * @description Unit tests for CraftPage component.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: none (static page)
 * outputs: "coming soon" information page content
 * rules: must render the Crafteo title and the "Próximamente" announcement
 *
 * @technical
 * dependencies: @testing-library/react, vitest, framer-motion
 * flow: mock framer-motion -> render -> verify static content
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-FE-CP-01
 *
 * @notes
 */
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

import CraftPage from '../../../src/modules/Landing/pages/CraftPage';

describe('CraftPage', () => {
  it('TC-FE-CP-01: renderiza el titulo y el mensaje de proximamente', () => {
    render(<CraftPage />);

    expect(screen.getByText('Crafteo')).toBeInTheDocument();
    expect(screen.getByText(/Próximamente/i)).toBeInTheDocument();
  });
});
