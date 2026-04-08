/**
 * @file orderStore.test.ts
 * @module Frontend/Tests
 * @description Unit tests for orderStore, evaluating global state interactions, Set persistence logic, and fetch/finalize actions.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18
 * rnf: RNF-05
 *
 * @business
 * inputs: order items, quantities, historical purchase data, mock fetch
 * outputs: computed cart totals, tried tags, and updated global state
 * rules: adding same plate increments quantity, items hit 0 are removed, Set serializes correctly 
 *
 * @technical
 * dependencies: vitest, orderStore, sdk
 * flow: populate cart -> assert calculations -> test mock SDK history fetch -> verify state transformation and set extraction
 *
 * @estimation
 * complexity: Medium
 * fpa: ILF
 * story_points: 2
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-ORDER-STORE-01 to TC-ORDER-STORE-03
 * ultima prueba exitosa: 2026-04-08 13:50:00
 *
 * @notes
 * decisions: SDK fetch is correctly mocked using vi.mock to decouple from actual HTTP logic.
 */
import { describe, expect, it, beforeEach, vi, Mock } from 'vitest';
import { useOrderStore } from '../../src/orderStore';
import { sdk } from '../../src/tools/sdk';
import type { LandingPlate } from '../../src/modules/Landing/components/landingPlateNutrition';
import type { OrderHistoryEntry } from '../../src/orderStore';

// Mock del SDK para fetchHistory
vi.mock('../../src/tools/sdk', () => ({
  sdk: {
    customers: {
      history: vi.fn(),
    },
  },
}));

// Mock simple de localStorage para el environment Node
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('orderStore', () => {
  const mockPlate1 = {
    id: 'p1',
    name: 'Plate 1',
    menuPrice: 10,
  } as unknown as LandingPlate;

  const mockPlate2 = {
    id: 'p2',
    name: 'Plate 2',
    menuPrice: 5,
  } as unknown as LandingPlate;

  beforeEach(() => {
    localStorage.clear();
    useOrderStore.setState({
      items: [],
      isOpen: false,
      activeTab: 'cart',
      orderHistory: [],
      triedPlateIds: new Set(),
      isFetchingHistory: false,
    });
    vi.clearAllMocks();
  });

  it('TC-ORDER-STORE-01: gestiona correctamente el carrito (add, remove, totals)', () => {
    const store = useOrderStore.getState();
    
    store.addItem(mockPlate1, 2);
    expect(useOrderStore.getState().items).toHaveLength(1);
    expect(useOrderStore.getState().totalItems()).toBe(2);
    expect(useOrderStore.getState().totalPrice()).toBe(20);

    // Add same increments quantity
    useOrderStore.getState().addItem(mockPlate1, 1);
    expect(useOrderStore.getState().items[0].quantity).toBe(3);
    expect(useOrderStore.getState().totalPrice()).toBe(30);

    // Add different plate
    useOrderStore.getState().addItem(mockPlate2, 2);
    expect(useOrderStore.getState().items).toHaveLength(2);
    expect(useOrderStore.getState().totalItems()).toBe(5);
    expect(useOrderStore.getState().totalPrice()).toBe(40);

    // Update quantity to 0 removes it
    useOrderStore.getState().updateQuantity('p1', 0);
    expect(useOrderStore.getState().items).toHaveLength(1);
    expect(useOrderStore.getState().items[0].plate.id).toBe('p2');
    
    // Clear order
    useOrderStore.getState().clearOrder();
    expect(useOrderStore.getState().items).toHaveLength(0);
  });

  it('TC-ORDER-STORE-02: fetchHistory llama a sdk y actualiza el set de triedPlateIds', async () => {
    const mockHistory: OrderHistoryEntry[] = [{
      id: 'h1',
      completedAt: '2026-04-08',
      total: 10,
      lines: [
        { plateId: 'pX', name: 'X', quantity: 1, unitPrice: 10 }
      ]
    }];

    (sdk.customers.history as unknown as Mock).mockResolvedValue({
      data: mockHistory
    });

    const store = useOrderStore.getState();
    await store.fetchHistory();

    const state = useOrderStore.getState();
    expect(state.orderHistory).toEqual(mockHistory);
    expect(state.triedPlateIds.has('pX')).toBe(true);
    expect(state.hasTriedPlate('pX')).toBe(true);
  });

  it('TC-ORDER-STORE-03: finalizeRemoteOrder almacena el historial localmente y limpia carro', () => {
    const store = useOrderStore.getState();
    store.addItem(mockPlate1, 1);
    
    const entry: OrderHistoryEntry = {
      id: 'h2',
      completedAt: '2026-04-09',
      total: 10,
      lines: [
        { plateId: 'pY', name: 'Y', quantity: 1, unitPrice: 10 }
      ]
    };

    store.finalizeRemoteOrder(entry);
    
    const state = useOrderStore.getState();
    expect(state.items).toHaveLength(0);
    expect(state.isOpen).toBe(false);
    expect(state.orderHistory[0].id).toBe('h2');
    expect(state.triedPlateIds.has('pY')).toBe(true);
  });
});
