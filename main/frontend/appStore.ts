import { create } from 'zustand';

export type AppMode = 'dark' | 'light';
export type AppModule = 'IAM' | 'POS' | 'ADMIN' | 'CORE';

interface AppState {
  mode: AppMode;
  module: AppModule;
  setMode: (mode: AppMode) => void;
  setModule: (module: AppModule) => void;
}

export const useAppStore = create<AppState>((set) => ({
  mode: 'light',
  module: 'CORE',

  setMode: (mode) => set({ mode }),
  setModule: (module) => set({ module }),
}));
