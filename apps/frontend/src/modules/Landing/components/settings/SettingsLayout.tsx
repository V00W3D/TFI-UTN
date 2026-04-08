/**
 * @file SettingsLayout.tsx
 * @module Landing
 * @description Archivo SettingsLayout alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: props de presentacion, estado derivado y callbacks
 * outputs: bloques de UI interactivos reutilizables
 * rules: mantener componentes composables y sin logica persistente
 *
 * @technical
 * dependencies: framer-motion, react
 * flow: recibe props o estado derivado; calcula etiquetas, listas o variantes visuales; renderiza la seccion interactiva; delega eventos a callbacks, stores o modales del nivel superior.
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
 * decisions: se prioriza composicion de interfaz y reutilizacion de piezas visuales
 */
import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

export interface SettingsTabDefinition<TTab extends string> {
  id: TTab;
  label: string;
  shortLabel: string;
  description: string;
  status: string;
  component: ReactNode;
}

interface SettingsLayoutProps<TTab extends string> {
  title: string;
  subtitle: string;
  moduleLabel: string;
  versionLabel: string;
  activeTab: TTab;
  onTabChange: (tab: TTab) => void;
  tabs: SettingsTabDefinition<TTab>[];
}

export const SettingsLayout = <TTab extends string>({
  title,
  subtitle,
  moduleLabel,
  versionLabel,
  activeTab,
  onTabChange,
  tabs,
}: SettingsLayoutProps<TTab>) => {
  const currentTab = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  return (
    <div className="min-h-screen bg-qart-bg-warm/10 px-4 pb-24 pt-24 lg:px-8 xl:px-10">
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-8 flex flex-col gap-5">
          <div className="h-1.5 w-20 bg-qart-accent" />
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <h1 className="mb-3 text-4xl font-black uppercase tracking-tight text-qart-primary md:text-6xl leading-[0.88]">
                {title} <span className="text-qart-accent">/</span>
              </h1>
              <p className="flex flex-wrap items-center gap-3 text-[11px] font-black uppercase tracking-[0.16em] text-qart-text-muted md:text-xs md:tracking-[0.22em]">
                <span className="h-0.5 w-8 bg-qart-primary" />
                {subtitle}
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 lg:items-end">
              <span className="border border-qart-accent/20 bg-qart-accent/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-qart-primary">
                {moduleLabel}
              </span>
              <span className="text-xs font-black font-mono text-qart-primary">{versionLabel}</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-8">
          <aside className="w-full overflow-hidden border-2 border-qart-primary bg-qart-surface xl:sticky xl:top-[108px]">
            <div className="border-b border-qart-border bg-qart-bg-warm px-5 py-5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center border-2 border-white bg-qart-primary text-white shadow-sharp">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="square"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-qart-primary leading-none">
                  Menú
                </h2>
                <p className="mt-2 text-[10px] font-black uppercase tracking-[0.14em] text-qart-text-muted">
                  Navegación simple
                </p>
              </div>
            </div>

            <nav className="flex flex-col gap-2 p-3 bg-qart-surface">
              {tabs.map((tab) => {
                const isActive = tab.id === activeTab;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onTabChange(tab.id)}
                    className={`w-full border-2 px-4 py-3 text-left transition-all ${
                      isActive
                        ? 'translate-x-1 border-qart-primary bg-qart-primary text-white shadow-sharp'
                        : 'border-transparent bg-transparent text-qart-text-muted hover:border-qart-border hover:bg-qart-bg-warm'
                    }`}
                  >
                    <span className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.14em]">
                      {isActive && <span className="w-2 h-2 bg-qart-accent" />}
                      {tab.shortLabel}
                    </span>
                    <span
                      className={`mt-1.5 block text-[10px] font-bold tracking-[0.04em] ${
                        isActive ? 'text-white/75' : 'text-qart-text-subtle'
                      }`}
                    >
                      {tab.description}
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-qart-border bg-qart-bg-warm/40 px-4 py-4">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-qart-primary">
                {currentTab?.status}
              </p>
            </div>
          </aside>

          <main className="w-full border-2 border-qart-primary bg-qart-surface p-1 shadow-[12px_12px_0px_var(--qart-primary)]">
            <div className="min-h-[680px] border border-qart-border-subtle bg-qart-surface p-5 md:p-7 xl:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.24, ease: 'easeOut' }}
                >
                  {currentTab?.component}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
