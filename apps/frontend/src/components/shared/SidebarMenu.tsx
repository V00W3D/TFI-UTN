/**
 * @file SidebarMenu.tsx
 * @module Frontend
 * @description Archivo SidebarMenu alineado a la arquitectura y trazabilidad QART.
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
 * dependencies: framer-motion, appStore, Portal
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
import { useAppStore } from '../../appStore';
import Portal from './Portal';

/**
 * @file SidebarMenu.tsx
 * @description Sidebar global con toggle de tema. Sin colores hardcodeados:
 * - bg-white → bg-qart-bg (barra del logo)
 * - bg-white → bg-qart-surface (bolita del toggle)
 * - hover:bg-qart-border-soft → style hover inline (token no declarado en @theme)
 */
interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarMenu = ({ isOpen, onClose }: SidebarMenuProps) => {
  const { mode, setMode } = useAppStore();
  const toggleTheme = () => setMode(mode === 'light' ? 'dark' : 'light');

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-80 z-70 border-r border-qart-border overflow-y-auto shadow-2xl"
              style={{ background: 'var(--qart-surface)' }}
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-qart-accent flex items-center justify-center -rotate-6">
                      {/* Barra del logo — usa qart-bg para contrastar con accent */}
                      <div
                        className="w-1.5 h-4 rounded-none"
                        style={{ background: 'var(--qart-bg)' }}
                      />
                    </div>
                    <span className="text-2xl font-display text-qart-primary tracking-tighter">
                      QART.
                    </span>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-none transition-colors text-qart-text-muted hover:text-qart-primary"
                    style={{ background: 'transparent' }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        'var(--qart-bg-warm)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    }}
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Theme toggle */}
                <div className="mb-12">
                  <p className="text-xs font-bold text-qart-text-muted uppercase tracking-widest mb-4">
                    Apariencia
                  </p>
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between p-4 rounded-none transition-all duration-300 group"
                    style={{ background: 'var(--qart-bg-warm)' }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        'var(--qart-border-subtle)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        'var(--qart-bg-warm)';
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-none flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"
                        style={{ background: 'var(--qart-surface)' }}
                      >
                        {mode === 'light' ? (
                          <svg
                            className="w-5 h-5 text-qart-accent-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5 text-qart-accent"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="font-bold text-qart-primary">
                        {mode === 'light' ? 'Tema Claro' : 'Tema Oscuro'}
                      </span>
                    </div>
                    {/* Toggle pill */}
                    <div
                      className="w-12 h-6 rounded-none relative transition-colors duration-300"
                      style={{
                        background: mode === 'light' ? 'var(--qart-border)' : 'var(--qart-accent)',
                      }}
                    >
                      <motion.div
                        animate={{ x: mode === 'light' ? 2 : 26 }}
                        className="absolute top-1 left-0 w-4 h-4 rounded-none shadow-sm"
                        style={{ background: 'var(--qart-surface)' }}
                      />
                    </div>
                  </button>
                </div>

                {/* Navegación */}
                <div className="space-y-4">
                  <p className="text-xs font-bold text-qart-text-muted uppercase tracking-widest mb-4">
                    Navegación
                  </p>
                  {['Menú', 'Cómo Funciona', 'Locales'].map((item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={onClose}
                      className="block p-4 text-xl font-display text-qart-primary hover:text-qart-accent transition-colors"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>

              {/* Decoración inferior */}
              <div className="mt-auto p-8 opacity-20 pointer-events-none">
                <div className="text-6xl font-display text-qart-primary">QART.</div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Portal>
  );
};

export default SidebarMenu;
