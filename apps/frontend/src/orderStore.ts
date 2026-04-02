import { create } from 'zustand';
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
  saleId?: string;
  completedAt: string;
  lines: OrderHistoryLine[];
  total: number;
  fulfillment?: OrderFulfillment;
  lifecycleStatus?: OrderLifecycleStatus;
}

const ORDER_HISTORY_KEY = 'qart-order-history-v1';
const ORDER_TRIED_KEY = 'qart-tried-plates-v1';

const loadHistory = (): OrderHistoryEntry[] => {
  try {
    const raw = localStorage.getItem(ORDER_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as OrderHistoryEntry[]) : [];
  } catch {
    return [];
  }
};

const saveHistory = (entries: OrderHistoryEntry[]) => {
  try {
    localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(entries.slice(0, 50)));
  } catch {
    /* ignore quota */
  }
};

const loadTriedPlateIds = (): Set<string> => {
  try {
    const raw = localStorage.getItem(ORDER_TRIED_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    return new Set(Array.isArray(parsed) ? (parsed as string[]) : []);
  } catch {
    return new Set();
  }
};

const saveTriedPlateIds = (ids: Set<string>) => {
  try {
    localStorage.setItem(ORDER_TRIED_KEY, JSON.stringify([...ids]));
  } catch {
    /* ignore */
  }
};

interface OrderState {
  items: OrderItem[];
  isOpen: boolean;
  orderHistory: OrderHistoryEntry[];
  triedPlateIds: Set<string>;
  addItem: (plate: LandingPlate, quantity: number) => void;
  removeItem: (plateId: string) => void;
  updateQuantity: (plateId: string, quantity: number) => void;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  clearOrder: () => void;
  /** Confirma el carrito actual: guarda historial, marca platos probados y vacía la orden. */
  confirmCurrentOrder: () => void;
  /** Tras checkout en servidor: historial + probados + limpia el carrito y cierra el panel. */
  finalizeRemoteOrder: (entry: OrderHistoryEntry) => void;
  totalItems: () => number;
  totalPrice: () => number;
  hasTriedPlate: (plateId: string) => boolean;
}

const initialHistory = loadHistory();
const initialTried = loadTriedPlateIds();
for (const entry of initialHistory) {
  for (const line of entry.lines) {
    initialTried.add(line.plateId);
  }
}

export const useOrderStore = create<OrderState>((set, get) => ({
  items: [],
  isOpen: false,
  orderHistory: initialHistory,
  triedPlateIds: initialTried,

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

  confirmCurrentOrder: () => {
    const { items } = get();
    if (!items.length) return;
    const lines: OrderHistoryLine[] = items.map(({ plate, quantity }) => ({
      plateId: plate.id,
      name: plate.name,
      quantity,
      unitPrice: plate.menuPrice ?? 0,
    }));
    const total = lines.reduce((acc, l) => acc + l.unitPrice * l.quantity, 0);
    const entry: OrderHistoryEntry = {
      id: crypto.randomUUID(),
      completedAt: new Date().toISOString(),
      lines,
      total,
    };
    set((state) => {
      const nextTried = new Set(state.triedPlateIds);
      for (const line of lines) {
        nextTried.add(line.plateId);
      }
      saveTriedPlateIds(nextTried);
      const nextHistory = [entry, ...state.orderHistory].slice(0, 50);
      saveHistory(nextHistory);
      return {
        orderHistory: nextHistory,
        triedPlateIds: nextTried,
        items: [],
        isOpen: false,
      };
    });
  },

  finalizeRemoteOrder: (entry) => {
    set((state) => {
      const nextTried = new Set(state.triedPlateIds);
      for (const line of entry.lines) {
        nextTried.add(line.plateId);
      }
      saveTriedPlateIds(nextTried);
      const nextHistory = [entry, ...state.orderHistory].slice(0, 50);
      saveHistory(nextHistory);
      return {
        orderHistory: nextHistory,
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
}));
