// @vitest-environment jsdom
/**
 * @file Story.test.tsx
 * @module Landing/Tests
 * @description Unit tests for Story (How it Works) section component.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: none (static presentation)
 * outputs: 3-step guide for the user
 * rules: show step numbers; show specific titles for each step
 *
 * @technical
 * dependencies: @testing-library/react, vitest, framer-motion
 * flow: render -> verify section header -> verify all 3 steps
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 2
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-FE-STORY-01
 *
 * @notes
 */
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Story from '../../../src/modules/Landing/components/Story';

// Mock framer-motion (inView logic)
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
}));

describe('Story', () => {
  it('TC-FE-STORY-01: renderiza correctamente los tres pasos del proceso de compra', () => {
    render(<Story />);

    // Header
    expect(screen.getByText(/Armá tu pedido/i)).toBeInTheDocument();
    
    // Steps
    expect(screen.getByText('Elegí tu base')).toBeInTheDocument();
    expect(screen.getByText('Sumá lo que quieras')).toBeInTheDocument();
    expect(screen.getByText('Recibilo o vení al local')).toBeInTheDocument();
    
    // Step numbers
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
