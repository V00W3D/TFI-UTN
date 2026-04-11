// @vitest-environment jsdom
/**
 * @file SidebarMenu.test.tsx
 * @module Shared/Tests
 * @description Unit tests for SidebarMenu component.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: isOpen prop, appStore mode
 * outputs: side menu overlay, theme toggle, navigation links
 * rules: render only when isOpen=true; toggle theme should invert appStore mode
 *
 * @technical
 * dependencies: @testing-library/react, vitest, appStore, framer-motion, Portal
 * flow: mock store -> render closed -> render open -> click toggle -> click close -> verify
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-FE-SIDEBAR-01, TC-FE-SIDEBAR-02, TC-FE-SIDEBAR-03
 *
 * @notes
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: any) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: any) => {
      // Avoid passing motion props to regular DOM elements
      const { initial, animate, exit, transition, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
  },
}));

vi.mock('../../../src/appStore', () => ({
  useAppStore: vi.fn(),
}));

// We can allow Portal to behave normally since we just mock the portal root in the DOM
import SidebarMenu from '../../../src/components/shared/SidebarMenu';
import { useAppStore } from '../../../src/appStore';

describe('SidebarMenu', () => {
  const mockSetMode = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
    const root = document.createElement('div');
    root.id = 'portal-root';
    document.body.appendChild(root);
  });

  it('TC-FE-SIDEBAR-01: no renderiza nada cuando isOpen es false', () => {
    (useAppStore as any).mockReturnValue({ mode: 'light', setMode: mockSetMode });
    const { container } = render(<SidebarMenu isOpen={false} onClose={mockOnClose} />);
    
    // Nothing is added to the portal root
    expect(document.getElementById('portal-root')?.innerHTML).toBe('');
  });

  it('TC-FE-SIDEBAR-02: renderiza el menu y datos cuando isOpen es true', () => {
    (useAppStore as any).mockReturnValue({ mode: 'light', setMode: mockSetMode });
    render(<SidebarMenu isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Tema Claro')).toBeInTheDocument();
    expect(screen.getByText('Menú')).toBeInTheDocument();
    expect(screen.getByText('Cómo Funciona')).toBeInTheDocument();
    expect(screen.getByText('Locales')).toBeInTheDocument();
  });

  it('TC-FE-SIDEBAR-03: toggleTheme cambia de claro a oscuro', () => {
    (useAppStore as any).mockReturnValue({ mode: 'light', setMode: mockSetMode });
    render(<SidebarMenu isOpen={true} onClose={mockOnClose} />);

    const themeToggleBtn = screen.getByRole('button', { name: /tema claro/i });
    fireEvent.click(themeToggleBtn);

    expect(mockSetMode).toHaveBeenCalledWith('dark');
  });

  it('TC-FE-SIDEBAR-04: hacer click en el backdrop cierra el menu', () => {
    (useAppStore as any).mockReturnValue({ mode: 'light', setMode: mockSetMode });
    const { container } = render(<SidebarMenu isOpen={true} onClose={mockOnClose} />);

    // First child is our mocked motion.div backdrop inside portal
    const backdrop = document.getElementById('portal-root')?.firstElementChild as HTMLElement;
    fireEvent.click(backdrop);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
