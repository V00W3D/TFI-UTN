// @vitest-environment jsdom
/**
 * @file Portal.test.tsx
 * @module Shared/Tests
 * @description Unit tests for Portal component.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: ReactNode children
 * outputs: children rendered in #portal-root (or directly if not found)
 * rules: fall back to normal rendering if #portal-root is missing
 *
 * @technical
 * dependencies: @testing-library/react, vitest
 * flow: render with/without #portal-root -> verify children location
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-FE-PORTAL-01, TC-FE-PORTAL-02
 *
 * @notes
 */
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import Portal from '../../../src/components/shared/Portal';

describe('Portal', () => {
  beforeEach(() => {
    // Ensure clean DOM
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('TC-FE-PORTAL-01: renderiza hijos directamente si #portal-root no existe', () => {
    render(
      <Portal>
        <div data-testid="portal-child">Test Content</div>
      </Portal>
    );

    const child = screen.getByTestId('portal-child');
    expect(child).toBeInTheDocument();
    // It should be within the normal render root (usually a div added by testing-library)
    expect(child.parentElement?.id).not.toBe('portal-root');
  });

  it('TC-FE-PORTAL-02: usa createPortal y renderiza en #portal-root si existe', () => {
    // Create the portal root
    const portalRoot = document.createElement('div');
    portalRoot.id = 'portal-root';
    document.body.appendChild(portalRoot);

    render(
      <Portal>
        <div data-testid="portal-child">Test Content</div>
      </Portal>
    );

    const child = screen.getByTestId('portal-child');
    expect(child).toBeInTheDocument();
    expect(child.parentElement?.id).toBe('portal-root');
  });
});
