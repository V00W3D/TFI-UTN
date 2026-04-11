// @vitest-environment jsdom
/**
 * @file SectionFactory.test.tsx
 * @module Shared/Tests
 * @description Unit tests for SectionFactory component.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: array of section configurations
 * outputs: mapped layout tree
 * rules: conditionally render eyebrow, title, and description
 *
 * @technical
 * dependencies: @testing-library/react, vitest
 * flow: provide mock sections -> render -> verify output matches configuration
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-FE-SEC-01
 *
 * @notes
 */
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SectionFactory } from '../../../src/components/shared/SectionFactory';

describe('SectionFactory', () => {
  it('TC-FE-SEC-01: renderiza multiples secciones condicionalmente', () => {
    const sections = [
      {
        key: 'sec1',
        title: 'Titulo',
        content: <div data-testid="content1">C1</div>,
      },
      {
        key: 'sec2',
        eyebrow: 'Arriba',
        description: 'Abajo',
        content: <div data-testid="content2">C2</div>,
      },
    ];

    render(<SectionFactory sections={sections} className="main" />);

    expect(screen.getByText('Titulo')).toBeInTheDocument();
    expect(screen.getByTestId('content1')).toBeInTheDocument();
    expect(screen.getByText('Arriba')).toBeInTheDocument();
    expect(screen.getByText('Abajo')).toBeInTheDocument();
    expect(screen.getByTestId('content2')).toBeInTheDocument();
  });
});
