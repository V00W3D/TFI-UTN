// @vitest-environment jsdom
/**
 * @file FloatingActions.test.tsx
 * @module Landing/Tests
 * @description Unit tests for FloatingActions component.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: mode from appStore, order state from orderStore
 * outputs: floating theme toggle and order panel trigger
 * rules: toggle switch between light/dark; show badge count in order button
 *
 * @technical
 * dependencies: @testing-library/react, vitest, appStore, orderStore, framer-motion
 * flow: mock stores -> mock portal -> render -> toggle theme -> verify order badge
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-FE-FA-01, TC-FE-FA-02
 *
 * @notes
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import FloatingActions from '../../../src/modules/Landing/components/FloatingActions';
import { useAppStore } from '../../../src/appStore';
import { useOrderStore } from '../../../src/orderStore';

// Mock Portals
vi.mock('../../../src/components/shared/Portal', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="portal-root">{children}</div>,
}));

// Mock icons
vi.mock('./OrderPanel', () => ({
  ParchmentIcon: () => <div data-testid="icon-order" />,
}));

// Mock Stores
vi.mock('../../../src/appStore', () => ({
  useAppStore: vi.fn(),
}));

vi.mock('../../../src/orderStore', () => ({
  useOrderStore: vi.fn(),
}));

describe('FloatingActions', () => {
  const mockSetMode = vi.fn();
  const mockSetOpen = vi.fn();
  const mockTotalItems = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAppStore as any).mockReturnValue({
      mode: 'light',
      setMode: mockSetMode,
    });
    (useOrderStore as any).mockReturnValue({
      isOpen: false,
      setOpen: mockSetOpen,
      totalItems: mockTotalItems,
    });
    mockTotalItems.mockReturnValue(0);
  });

  it('TC-FE-FA-01: cambia el tema cuando se clickea el botón de modo', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <FloatingActions />
      </MemoryRouter>
    );
    
    const themeBtn = screen.getByLabelText(/Cambiar a tema oscuro/i);
    fireEvent.click(themeBtn);
    
    expect(mockSetMode).toHaveBeenCalledWith('dark');
  });

  it('TC-FE-FA-02: abre el panel de órdenes y muestra el contador de items', () => {
    mockTotalItems.mockReturnValue(5);
    render(
      <MemoryRouter initialEntries={['/']}>
        <FloatingActions />
      </MemoryRouter>
    );
    
    const orderBtn = screen.getByLabelText(/Cerrar orden y ver historial/i);
    expect(screen.getByText('5')).toBeInTheDocument();
    
    fireEvent.click(orderBtn);
    expect(mockSetOpen).toHaveBeenCalledWith(true);
  });
});
