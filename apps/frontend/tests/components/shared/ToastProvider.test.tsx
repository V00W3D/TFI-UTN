// @vitest-environment jsdom
/**
 * @file ToastProvider.test.tsx
 * @module Shared/Tests
 * @description Unit tests for ToastProvider component.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: toasts from useToastStore
 * outputs: rendered toast notifications in #portal-root
 * rules: hide when store is empty; close button removes toast
 *
 * @technical
 * dependencies: @testing-library/react, vitest, toastStore, framer-motion
 * flow: mock store -> render -> verify toasts -> click close
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-FE-TOAST-01, TC-FE-TOAST-02, TC-FE-TOAST-03
 *
 * @notes
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: any) => <>{children}</>,
  motion: {
    div: ({ children, layout, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

vi.mock('../../../src/toastStore', () => ({
  useToastStore: vi.fn(),
}));

import ToastProvider from '../../../src/components/shared/ToastProvider';
import { useToastStore } from '../../../src/toastStore';

describe('ToastProvider', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    const root = document.createElement('div');
    root.id = 'portal-root';
    document.body.appendChild(root);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  it('TC-FE-TOAST-01: no renderiza nada si #portal-root no existe', () => {
    document.body.innerHTML = ''; // Remove portal-root
    (useToastStore as any).mockImplementation((selector?: any) => {
      if (typeof selector === 'function') return selector({ toasts: [] });
      return { toasts: [] };
    });

    const { container } = render(<ToastProvider />);
    expect(container.innerHTML).toBe('');
  });

  it('TC-FE-TOAST-02: renderiza los toasts del store', () => {
    const mockToasts = [
      { id: 't1', type: 'success', message: 'Guardado con éxito' },
      { id: 't2', type: 'error', message: 'Falló la conexión' },
    ];
    (useToastStore as any).mockImplementation((selector?: any) => {
      if (typeof selector === 'function') return selector({ toasts: mockToasts });
      return { toasts: mockToasts, removeToast: vi.fn() };
    });

    render(<ToastProvider />);

    expect(screen.getByText('Guardado con éxito')).toBeInTheDocument();
    expect(screen.getByText('Falló la conexión')).toBeInTheDocument();
  });

  it('TC-FE-TOAST-03: hacer click en cerrar invoca removeToast', () => {
    const mockRemoveToast = vi.fn();
    const mockToasts = [{ id: 't1', type: 'warning', message: 'Cuidado' }];
    
    // We mock the full store shape returned by useToastStore here
    (useToastStore as any).mockImplementation((selector: any) => {
      // If a selector is passed, it expects to select from the state
      if (typeof selector === 'function') {
        return selector({ toasts: mockToasts, removeToast: mockRemoveToast });
      }
      // If called without selector (as in ToastItem)
      return { toasts: mockToasts, removeToast: mockRemoveToast };
    });

    render(<ToastProvider />);

    const closeBtn = screen.getByLabelText('Cerrar notificación');
    fireEvent.click(closeBtn);

    expect(mockRemoveToast).toHaveBeenCalledWith('t1');
  });
});
