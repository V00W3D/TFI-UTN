/**
 * @file FloatingActions.tsx
 * @module Landing
 * @description Archivo FloatingActions alineado a la arquitectura y trazabilidad QART.
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
 * dependencies: framer-motion, appStore, orderStore, OrderPanel, Portal
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
import { useAppStore } from '../../../appStore';
import { useOrderStore } from '../../../orderStore';
import { useLocation } from 'react-router-dom';
import { ParchmentIcon } from './OrderPanel';
import Portal from '../../../components/shared/Portal';

const SunIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const FloatingActions = () => {
  const { mode, setMode } = useAppStore();
  const { isOpen, setOpen, totalItems } = useOrderStore();

  const toggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  const badgeCount = totalItems();
  const location = useLocation();
  const showOrderBtn = location.pathname === '/' || location.pathname === '/search';

  return (
    <Portal>
      <div className="floating-action-bar" role="group" aria-label="Acciones rápidas">
        <AnimatePresence>
          {!isOpen && showOrderBtn && (
            <motion.button
              key="order-panel-btn"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setOpen(true)}
              className="floating-action-btn floating-action-btn--accent"
              title="Mi Pedido e Historial"
              aria-label="Cerrar orden y ver historial"
            >
              <div className="relative">
                <ParchmentIcon className="w-6 h-6" />
                {badgeCount > 0 && <span className="floating-btn-badge">{badgeCount}</span>}
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="floating-action-btn"
          title={`Cambiar a modo ${mode === 'light' ? 'oscuro' : 'claro'}`}
          aria-label={`Cambiar a tema ${mode === 'light' ? 'oscuro' : 'claro'}`}
        >
          <motion.div
            key={mode}
            initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          >
            {mode === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
          </motion.div>
        </motion.button>
      </div>
    </Portal>
  );
};

export default FloatingActions;
