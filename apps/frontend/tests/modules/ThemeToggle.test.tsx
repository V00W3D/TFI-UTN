// @vitest-environment jsdom
/**
 * @file ThemeToggle.test.tsx
 * @module Frontend/Tests
 * @description Unit tests for ThemeToggle component.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: appStore mode ('light' | 'dark')
 * outputs: theme toggle button with animated icons
 * rules: clicking the button inverts the 'mode' stored in appStore
 *
 * @technical
 * dependencies: @testing-library/react, vitest, framer-motion, appStore
 * flow: mock store -> render -> verify icon presence -> click -> verify store change
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-FE-THEME-01, TC-FE-THEME-02
 *
 * @notes
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: any) => <>{children}</>,
  motion: {
    button: ({ children, whileHover, whileTap, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
    div: ({ children, ...props }: any) => {
      const { initial, animate, exit, transition, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
  },
}));

vi.mock('../../src/appStore', () => ({
  useAppStore: vi.fn(),
}));

import ThemeToggle from '../../src/modules/ThemeToggle';
import { useAppStore } from '../../src/appStore';

describe('ThemeToggle', () => {
  const mockSetMode = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-FE-THEME-01: cambia a dark cuando estas en light', () => {
    (useAppStore as any).mockReturnValue({ mode: 'light', setMode: mockSetMode });
    render(<ThemeToggle />);

    const btn = screen.getByLabelText('Cambiar tema');
    fireEvent.click(btn);

    expect(mockSetMode).toHaveBeenCalledWith('dark');
  });

  it('TC-FE-THEME-02: cambia a light cuando estas en dark', () => {
    (useAppStore as any).mockReturnValue({ mode: 'dark', setMode: mockSetMode });
    render(<ThemeToggle />);

    const btn = screen.getByLabelText('Cambiar tema');
    fireEvent.click(btn);

    expect(mockSetMode).toHaveBeenCalledWith('light');
  });
});
