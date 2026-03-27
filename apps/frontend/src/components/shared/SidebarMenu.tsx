import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../appStore';
import Portal from './Portal';

/**
 * @file SidebarMenu.tsx
 * @description Global sidebar menu with theme toggle and navigation, rendered via Portal.
 */
interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarMenu = ({ isOpen, onClose }: SidebarMenuProps) => {
  const { mode, setMode } = useAppStore();

  const toggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

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
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />

            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-80 bg-qart-surface shadow-2xl z-[70] border-r border-qart-border overflow-y-auto"
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-qart-accent rounded-none flex items-center justify-center -rotate-6">
                      <div className="w-1.5 h-4 bg-white rounded-none" />
                    </div>
                    <span className="text-2xl font-display text-qart-primary tracking-tighter">QART.</span>
                  </div>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-qart-bg-warm rounded-none transition-colors text-qart-text-muted"
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

                  {/* Theme Toggle Section */}
                  <div className="mb-12">
                    <p className="text-xs font-bold text-qart-text-muted uppercase tracking-widest mb-4">
                      Aparencia
                    </p>
                    <button
                      onClick={toggleTheme}
                      className="w-full flex items-center justify-between p-4 rounded-none bg-qart-bg-warm hover:bg-qart-border-soft transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-none bg-qart-surface flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
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
                      <div
                        className={`w-12 h-6 rounded-none relative transition-colors duration-300 ${
                          mode === 'light' ? 'bg-qart-border' : 'bg-qart-accent'
                        }`}
                      >
                        <motion.div
                          animate={{ x: mode === 'light' ? 2 : 26 }}
                          className="absolute top-1 left-0 w-4 h-4 bg-white rounded-none shadow-sm"
                        />
                      </div>
                    </button>
                  </div>

                  {/* Navigation Links */}
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

              {/* Bottom Decoration */}
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
