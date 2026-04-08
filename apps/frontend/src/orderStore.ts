/**
 * @file orderStore.ts
 * @module Frontend
 * @description Archivo orderStore alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-05
 *
 * @business
 * inputs: datos del modulo y dependencias compartidas
 * outputs: comportamiento o estructuras del modulo
 * rules: respetar contratos, seguridad y trazabilidad definidas en context.md
 *
 * @technical
 * dependencies: dependencias locales del archivo
 * flow: inicializa, transforma y expone la logica del modulo
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-AUDIT-01
 *
 * @notes
 * decisions: bloque agregado para cumplir el formato obligatorio de context.md
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { sdk } from './tools/sdk';
import { isSuccessResponse } from '@app/sdk';
import type { LandingPlate } from './modules/Landing/components/landingPlateNutrition';

export interface OrderItem {
  plate: LandingPlate;
  quantity: number;
}

export interface OrderHistoryLine {
  plateId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export type OrderFulfillment = 'dine_in' | 'pickup' | 'delivery';

export type OrderLifecycleStatus = 'PENDIENTE' | 'COMPLETADO';

export interface OrderHistoryEntry {
  id: string;
  /** Id de Sale en backend cuando el pedido se persistió en DB. */
  saleId?: string | undefined;
  completedAt: string;
  lines: OrderHistoryLine[];
  total: number;
  fulfillment?: OrderFulfillment | undefined;
  lifecycleStatus?: OrderLifecycleStatus | undefined;
}

interface OrderState {
  items: OrderItem[];
  isOpen: boolean;
  orderHistory: OrderHistoryEntry[];
  activeTab: 'cart' | 'history';
  triedPlateIds: Set<string>;
  isFetchingHistory: boolean;
  addItem: (plate: LandingPlate, quantity: number) => void;
  removeItem: (plateId: string) => void;
  updateQuantity: (plateId: string, quantity: number) => void;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  setActiveTab: (tab: 'cart' | 'history') => void;
  clearOrder: () => void;
  /** Busca el historial desde el servidor y refresca triedPlateIds. */
  fetchHistory: () => Promise<void>;
  /** Tras checkout en servidor: historial + limpia el carrito y cierra el panel. */
  finalizeRemoteOrder: (entry: OrderHistoryEntry) => void;
  totalItems: () => number;
  totalPrice: () => number;
  hasTriedPlate: (plateId: string) => boolean;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      activeTab: 'cart',
      orderHistory: [],
      triedPlateIds: new Set(),
      isFetchingHistory: false,

      addItem: (plate, quantity) => {
        if (quantity <= 0) return;
        set((state) => {
          const existing = state.items.find((i) => i.plate.id === plate.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.plate.id === plate.id ? { ...i, quantity: i.quantity + quantity } : i,
              ),
            };
          }
          return { items: [...state.items, { plate, quantity }] };
        });
      },

      removeItem: (plateId) =>
        set((state) => ({ items: state.items.filter((i) => i.plate.id !== plateId) })),

      updateQuantity: (plateId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(plateId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.plate.id === plateId ? { ...i, quantity } : i)),
        }));
      },

      toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
      setOpen: (open) => set({ isOpen: open }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      clearOrder: () => set({ items: [] }),

      fetchHistory: async () => {
        set({ isFetchingHistory: true });
        try {
          const res = await sdk.customers.history({});
          if (isSuccessResponse(res)) {
            const history = res.data;
            const tried = new Set<string>();
            for (const entry of history) {
              for (const line of entry.lines) {
                tried.add(line.plateId);
              }
            }
            set({ orderHistory: history, triedPlateIds: tried });
          }
        } finally {
          set({ isFetchingHistory: false });
        }
      },

      finalizeRemoteOrder: (entry) => {
        set((state) => {
          const nextTried = new Set(state.triedPlateIds);
          for (const line of entry.lines) {
            nextTried.add(line.plateId);
          }
          return {
            orderHistory: [entry, ...state.orderHistory].slice(0, 50),
            triedPlateIds: nextTried,
            items: [],
            isOpen: false,
          };
        });
      },

      totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce((acc, i) => acc + (i.plate.menuPrice ?? 0) * i.quantity, 0),

      hasTriedPlate: (plateId) => get().triedPlateIds.has(plateId),
    }),
    {
      name: 'qart-order-storage',
      // Personalizamos el storage para manejar el Set de triedPlateIds
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state, version } = JSON.parse(str);
          return JSON.stringify({
            state: {
              ...state,
              triedPlateIds: new Set(state.triedPlateIds),
            },
            version,
          });
        },
        setItem: (name, value) => {
          const { state, version } = JSON.parse(value);
          localStorage.setItem(
            name,
            JSON.stringify({
              state: {
                ...state,
                triedPlateIds: Array.from(state.triedPlateIds as Set<string>),
              },
              version,
            }),
          );
        },
        removeItem: (name) => localStorage.removeItem(name),
      })),
      partialize: (state) => ({
        items: state.items,
        orderHistory: state.orderHistory,
        triedPlateIds: state.triedPlateIds,
      }),
    },
  ),
);
