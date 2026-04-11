// @vitest-environment jsdom
/**
 * @file ConfigPage.test.tsx
 * @module Landing/Tests
 * @description Unit tests for ConfigPage component.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: tab selection (account / appearance)
 * outputs: correct section content shown per active tab
 * rules: default tab is 'account'; tab change should swap content
 *
 * @technical
 * dependencies: @testing-library/react, vitest, SettingsLayout, ConfigSectionCredentials, ConfigSectionVisual
 * flow: render -> verify default tab content -> click appearance tab -> verify content switch
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-FE-CFP-01, TC-FE-CFP-02
 *
 * @notes
 * decisions: framer-motion mocked so AnimatePresence does not block synchronous tab-content assertions
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Must be hoisted before component imports
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('../../../src/modules/Landing/components/ConfigSectionCredentials', () => ({
  ConfigSectionCredentials: () => <div data-testid="section-credentials">Credenciales</div>,
}));
vi.mock('../../../src/modules/Landing/components/ConfigSectionVisual', () => ({
  ConfigSectionVisual: () => <div data-testid="section-visual">Apariencia</div>,
}));

import ConfigPage from '../../../src/modules/Landing/pages/ConfigPage';

describe('ConfigPage', () => {
  it('TC-FE-CFP-01: muestra la seccion Mi Cuenta activa por defecto', () => {
    render(<ConfigPage />);
    expect(screen.getByTestId('section-credentials')).toBeInTheDocument();
  });

  it('TC-FE-CFP-02: cambia al contenido de Apariencia al hacer click en su tab', () => {
    render(<ConfigPage />);

    const appearanceTab = screen.getByText('Apariencia');
    fireEvent.click(appearanceTab);

    expect(screen.getByTestId('section-visual')).toBeInTheDocument();
  });
});
