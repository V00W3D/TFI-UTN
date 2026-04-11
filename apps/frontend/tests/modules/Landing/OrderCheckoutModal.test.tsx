// @vitest-environment jsdom
/**
 * @file OrderCheckoutModal.test.tsx
 * @module Landing/Tests
 * @description Unit tests for OrderCheckoutModal component.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: items from prop, order state from useOrderStore
 * outputs: side-effects (store finalize), success UI
 * rules: 3 phases (review, fulfillment, done); validate successful checkout on SDK response
 *
 * @technical
 * dependencies: @testing-library/react, vitest, orderStore, sdk, framer-motion
 * flow: render -> review items -> select fulfillment -> mock success -> verify done state
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-FE-OCM-01, TC-FE-OCM-02
 *
 * @notes
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import OrderCheckoutModal from '../../../src/modules/Landing/components/OrderCheckoutModal';
import { useOrderStore } from '../../../src/orderStore';
import { sdk } from '../../../src/tools/sdk';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock sdk
vi.mock('../../../src/tools/sdk', () => ({
  sdk: {
    customers: {
      orders: vi.fn(),
    },
  },
}));

// Mock Store
vi.mock('../../../src/orderStore', () => ({
  useOrderStore: vi.fn(),
}));

describe('OrderCheckoutModal', () => {
  const mockOnClose = vi.fn();
  const mockFinalizeRemoteOrder = vi.fn();
  const mockItems = [
    {
      plate: { id: 'p1', name: 'Plato Test', menuPrice: 1200 },
      quantity: 1,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useOrderStore as any).mockImplementation((selector: any) =>
      selector({ finalizeRemoteOrder: mockFinalizeRemoteOrder })
    );
  });

  it('TC-FE-OCM-01: transiciona por todas las fases del checkout (review -> fulfillment -> done)', async () => {
    (sdk.customers.orders as any).mockResolvedValue({
      status: 200,
      data: { saleId: 'sale-123', totalAmount: 1200, lifecycleStatus: 'PENDIENTE' },
    });

    render(<OrderCheckoutModal open={true} onClose={mockOnClose} items={mockItems} />);

    // --- Phase: Review ---
    expect(screen.getByText('Tu pedido')).toBeInTheDocument();
    expect(screen.getByText('Plato Test')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Continuar'));

    // --- Phase: Fulfillment ---
    expect(screen.getByText('¿Cómo lo querés?')).toBeInTheDocument();
    
    const deliveryBtn = screen.getByText('Para recibir en mi casa');
    fireEvent.click(deliveryBtn);

    // --- Phase: Done ---
    await waitFor(() => {
      expect(screen.getByText('¡Listo!')).toBeInTheDocument();
    });
    expect(screen.getByText(/recibir en mi casa/i)).toBeInTheDocument();
    expect(mockFinalizeRemoteOrder).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Entendido'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('TC-FE-OCM-02: maneja errores de red gracefully', async () => {
    (sdk.customers.orders as any).mockRejectedValue(new Error('Network error'));

    render(<OrderCheckoutModal open={true} onClose={mockOnClose} items={mockItems} />);

    fireEvent.click(screen.getByText('Continuar'));
    fireEvent.click(screen.getByText('Para retirar del local'));

    await waitFor(() => {
      expect(screen.getByText(/Error de conexión/i)).toBeInTheDocument();
    });
  });
});
