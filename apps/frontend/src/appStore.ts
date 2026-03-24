import { create } from 'zustand';
import type { z } from 'zod';
import type { AuthUserSchema } from '@app/contracts'; // ajustá el path

export type AppMode = 'dark' | 'light';
export type AppModule = 'IAM' | 'POS' | 'ADMIN' | 'CORE';

export type AppUser = z.infer<typeof AuthUserSchema>;

interface AppState {
  mode: AppMode;
  module: AppModule;
  user: AppUser | null;
  setMode: (mode: AppMode) => void;
  setModule: (module: AppModule) => void;
  setUser: (user: AppUser | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  mode: 'light',
  module: 'CORE',
  user: null,

  setMode: (mode) => set({ mode }),
  setModule: (module) => set({ module }),
  setUser: (user) => set({ user }),
}));
