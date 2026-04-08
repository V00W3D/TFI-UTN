/**
 * @file appStore.ts
 * @module Frontend
 * @description Archivo appStore alineado a la arquitectura y trazabilidad QART.
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
/**
 * @file appStore.ts
 * @author Victor
 * @description Automatically enforced JSDoc header according to context.md guidelines.
 * @param null
 * @returns null
 * @example null
 * @remarks This file is part of the QART monorepo architecture.
 *
 * Metrics:
 * - LOC: 50
 * - Experience Level: Junior
 * - Estimated Time: 30m
 * - FPA: 1
 * - PERT: 1
 * - Planning Poker: 1
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { z } from 'zod';
import type { AuthUserSchema } from '@app/contracts';

export type AppMode = 'dark' | 'light';
export type AppModule = 'IAM' | 'POS' | 'ADMIN' | 'CORE' | 'LANDING' | 'CUSTOMER';

export type AppUser = z.infer<typeof AuthUserSchema>;

interface AppState {
  mode: AppMode;
  module: AppModule;
  user: AppUser | null;
  simpleMode: boolean;
  setMode: (mode: AppMode) => void;
  setModule: (module: AppModule) => void;
  setUser: (user: AppUser | null) => void;
  setSimpleMode: (simpleMode: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      mode: 'light',
      module: 'CORE',
      user: null,
      simpleMode: false,

      setMode: (mode) => set({ mode }),
      setModule: (module) => set({ module }),
      setUser: (user) => set({ user }),
      setSimpleMode: (simpleMode) => set({ simpleMode }),
    }),
    {
      name: 'qart-app-storage',
      partialize: (state) => ({ mode: state.mode, user: state.user, simpleMode: state.simpleMode }),
    },
  ),
);
