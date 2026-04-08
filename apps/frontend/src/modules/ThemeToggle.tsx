/**
 * @file ThemeToggle.tsx
 * @module ThemeToggle.tsx
 * @description Archivo ThemeToggle alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
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
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../appStore';

/**
 * @file ThemeToggle.tsx
 * @description Floating premium theme toggle with sun and moon icons.
 */
const ThemeToggle = () => {
  const { mode, setMode } = useAppStore();

  const toggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="fixed bottom-8 left-8 z-9999">
      <motion.button
        whileHover={{ scale: 1.12, rotate: 8 }}
        whileTap={{ scale: 0.88, rotate: -8 }}
        onClick={toggleTheme}
        className="relative w-16 h-16 rounded-none bg-qart-surface border-4 border-qart-border shadow-sharp flex items-center justify-center cursor-pointer group overflow-hidden"
        aria-label="Cambiar tema"
      >
        <div className="absolute inset-0 bg-qart-accent/0 group-hover:bg-qart-accent/10 transition-colors duration-300" />

        <AnimatePresence mode="wait">
          {mode === 'light' ? (
            <motion.div
              key="sun"
              initial={{ y: 24, opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
              exit={{ y: -24, opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{
                duration: 0.45,
                ease: [0.23, 1, 0.32, 1],
                opacity: { duration: 0.2 },
              }}
              className="text-qart-accent-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
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
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ y: 24, opacity: 0, rotate: 90, scale: 0.5 }}
              animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
              exit={{ y: -24, opacity: 0, rotate: -90, scale: 0.5 }}
              transition={{
                duration: 0.45,
                ease: [0.23, 1, 0.32, 1],
                opacity: { duration: 0.2 },
              }}
              className="text-qart-accent"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default ThemeToggle;
