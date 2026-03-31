import { create } from 'zustand';
import type { LandingPlate } from './modules/Landing/components/landingPlateNutrition';

export interface OrderItem {
  plate: LandingPlate;
  quantity: number;
}

interface OrderState {
  items: OrderItem[];
  isOpen: boolean;
  addItem: (plate: LandingPlate, quantity: number) => void;
  removeItem: (plateId: string) => void;
  updateQuantity: (plateId: string, quantity: number) => void;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  clearOrder: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  items: [],
  isOpen: false,

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
  clearOrder: () => set({ items: [] }),

  totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
  totalPrice: () =>
    get().items.reduce((acc, i) => acc + (i.plate.menuPrice ?? 0) * i.quantity, 0),
}));
