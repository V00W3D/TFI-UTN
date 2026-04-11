// @vitest-environment jsdom
/**
 * @file OrderPanel.test.tsx
 * @module Landing/Tests
 * @description Unit tests for OrderPanel component.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: order state from useOrderStore
 * outputs: cart listing, order history, checkout trigger
 * rules: toggle between cart/history; empty states for both; clear cart logic; remove item logic
 *
 * @technical
 * dependencies: @testing-library/react, vitest, orderStore, framer-motion, react-router-dom
 * flow: mock store -> render -> interact with tabs -> verify items lifecycle
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-FE-OP-01, TC-FE-OP-02, TC-FE-OP-03
 *
 * @notes
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import OrderPanel from '../../../src/modules/Landing/components/OrderPanel';
import { useOrderStore } from '../../../src/orderStore';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    aside: ({ children, ...props }: any) => <aside {...props}>{children}</aside>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock OrderCheckoutModal
vi.mock('../../../src/modules/Landing/components/OrderCheckoutModal', () => ({
  __esModule: true,
  default: ({ open }: any) => (open ? <div data-testid="checkout-modal">Checkout Modal</div> : null),
}));

// Mock OrderStore
vi.mock('../../../src/orderStore', () => ({
  useOrderStore: vi.fn(),
}));

describe('OrderPanel', () => {
  const mockSetOpen = vi.fn();
  const mockRemoveItem = vi.fn();
  const mockUpdateQuantity = vi.fn();
  const mockClearOrder = vi.fn();
  const mockSetActiveTab = vi.fn();
  const mockFetchHistory = vi.fn();

  const baseStoreState = {
    items: [],
    isOpen: true,
    setOpen: mockSetOpen,
    removeItem: mockRemoveItem,
    updateQuantity: mockUpdateQuantity,
    clearOrder: mockClearOrder,
    activeTab: 'cart',
    setActiveTab: mockSetActiveTab,
    orderHistory: [],
    fetchHistory: mockFetchHistory,
    isFetchingHistory: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-FE-OP-01: muestra estado vacio en el carrito por defecto', () => {
    (useOrderStore as any).mockReturnValue(baseStoreState);
    render(
      <MemoryRouter>
        <OrderPanel />
      </MemoryRouter>
    );

    expect(screen.getByText('Tu orden está vacía')).toBeInTheDocument();
  });

  it('TC-FE-OP-02: lista items en el carrito y permite gestionarlos', () => {
    const mockItems = [
      {
        plate: { id: 'p1', name: 'Plato A', menuPrice: 1000 },
        quantity: 2,
      },
    ];
    (useOrderStore as any).mockReturnValue({
      ...baseStoreState,
      items: mockItems,
    });

    render(
      <MemoryRouter>
        <OrderPanel />
      </MemoryRouter>
    );

    expect(screen.getByText('Plato A')).toBeInTheDocument();
    expect(screen.getByText('2 ítems')).toBeInTheDocument();

    // Remove item
    const removeBtn = screen.getByLabelText(/Quitar Plato A/i);
    fireEvent.click(removeBtn);
    expect(mockRemoveItem).toHaveBeenCalledWith('p1');

    // Update quantity (increase)
    const plusBtn = screen.getByLabelText(/Aumentar cantidad/i);
    fireEvent.click(plusBtn);
    expect(mockUpdateQuantity).toHaveBeenCalledWith('p1', 3);

    // Clear order
    const clearBtn = screen.getByText(/Vaciar/i);
    fireEvent.click(clearBtn);
    expect(mockClearOrder).toHaveBeenCalled();
  });

  it('TC-FE-OP-03: cambia al historial y maneja sus estados', async () => {
    (useOrderStore as any).mockReturnValue({
      ...baseStoreState,
      activeTab: 'history',
      isFetchingHistory: false,
      orderHistory: [
        {
          id: 'h1',
          completedAt: new Date().toISOString(),
          total: 5000,
          lines: [{ name: 'Antiguo Plato', quantity: 1 }],
        },
      ],
    });

    render(
      <MemoryRouter>
        <OrderPanel />
      </MemoryRouter>
    );

    expect(screen.getByText('Antiguo Plato')).toBeInTheDocument();
    expect(screen.getByText(/5.*000/)).toBeInTheDocument(); // Format Landing Price is $ 5.000,00 usually

    // Loading state
    (useOrderStore as any).mockReturnValue({
      ...baseStoreState,
      activeTab: 'history',
      isFetchingHistory: true,
    });
    render(
      <MemoryRouter>
        <OrderPanel />
      </MemoryRouter>
    );
    expect(screen.getByText('Cargando…')).toBeInTheDocument();
  });

  it('TC-FE-OP-04: abre el checkout modal', () => {
    const mockItems = [{ plate: { id: 'p1', name: 'A', menuPrice: 10 }, quantity: 1 }];
    (useOrderStore as any).mockReturnValue({ ...baseStoreState, items: mockItems });

    render(
      <MemoryRouter>
        <OrderPanel />
      </MemoryRouter>
    );

    const checkoutBtn = screen.getByText(/Realizar pedido/i);
    fireEvent.click(checkoutBtn);
    expect(screen.getByTestId('checkout-modal')).toBeInTheDocument();
  });
});
