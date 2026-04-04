import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { ConfigSectionCredentials } from '../components/ConfigSectionCredentials';
import { ConfigSectionVisual } from '../components/ConfigSectionVisual';

type Tab = 'account' | 'appearance';

const ConfigPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('account');

  return (
    <div className="min-h-screen pt-24 px-4 lg:px-12 pb-32 bg-qart-bg-warm/20">
      <div className="max-w-[1400px] mx-auto">
        {/* ARCHITECTURAL HEADER */}
        <header className="flex flex-col gap-6 mb-16 relative">
          <div className="h-2 w-24 bg-qart-accent shadow-sharp" />
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-qart-primary leading-[0.75] mb-2">
                Ajustes <span className="text-qart-accent">/</span>
              </h1>
              <p className="text-qart-text-muted font-black text-xs uppercase tracking-[0.4em] flex items-center gap-4">
                <span className="w-12 h-0.5 bg-qart-primary" />
                Personaliza tu experiencia en el restaurant
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2">
              <span className="text-[10px] font-black uppercase text-qart-primary tracking-[0.2em] bg-qart-accent/10 px-3 py-1 border border-qart-accent/20">
                MÓDULO DE USUARIO
              </span>
              <span className="text-xs font-black font-mono text-qart-primary">
                VER_2.4.0_STABLE_BUILD
              </span>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:grid lg:grid-cols-[340px_1fr] gap-12 items-start">
          {/* NAVIGATION SIDEBAR */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full shrink-0 flex flex-col border-4 border-qart-primary bg-qart-surface shadow-[12px_12px_0px_var(--qart-primary)]"
          >
            <div className="p-10 border-b-4 border-qart-primary flex flex-col gap-6 bg-qart-bg-warm relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-qart-accent/5 rounded-full blur-2xl group-hover:bg-qart-accent/10 transition-colors" />
              <div className="w-16 h-16 bg-qart-primary flex items-center justify-center border-4 border-white shadow-sharp transform -rotate-3 group-hover:rotate-0 transition-transform">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="square"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div>
                <h2 className="text-4xl font-black uppercase tracking-tighter text-qart-primary leading-none">
                  Menú
                </h2>
                <span className="text-[11px] font-black uppercase text-qart-text-muted tracking-[0.2em] mt-2 block opacity-70">
                  Panel de Configuración
                </span>
              </div>
            </div>

            <nav className="flex flex-col p-6 gap-4 bg-qart-surface">
              <button
                onClick={() => setActiveTab('account')}
                className={`group w-full text-left px-8 py-6 font-black uppercase tracking-[0.3em] text-[0.8rem] border-4 transition-all relative ${
                  activeTab === 'account'
                    ? 'bg-qart-primary text-white border-qart-primary translate-x-4 shadow-sharp'
                    : 'bg-transparent text-qart-text-muted border-transparent hover:bg-qart-bg-warm hover:border-qart-border'
                }`}
              >
                <span className="relative z-10 flex items-center gap-3">
                   {activeTab === 'account' && <div className="w-2 h-2 bg-qart-accent" />}
                   Mi Cuenta
                </span>
              </button>
              <button
                onClick={() => setActiveTab('appearance')}
                className={`group w-full text-left px-8 py-6 font-black uppercase tracking-[0.3em] text-[0.8rem] border-4 transition-all relative ${
                  activeTab === 'appearance'
                    ? 'bg-qart-primary text-white border-qart-primary translate-x-4 shadow-sharp'
                    : 'bg-transparent text-qart-text-muted border-transparent hover:bg-qart-bg-warm hover:border-qart-border'
                }`}
              >
                <span className="relative z-10 flex items-center gap-3">
                   {activeTab === 'appearance' && <div className="w-2 h-2 bg-qart-accent" />}
                   Apariencia
                </span>
              </button>
            </nav>

            <div className="p-10 border-t-4 border-qart-border-subtle mt-auto bg-qart-bg-warm/50">
               <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-qart-success rounded-full animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-qart-primary">
                      Sesión Activa
                    </span>
                  </div>
                  <p className="text-[9px] font-bold text-qart-text-muted uppercase tracking-tight leading-relaxed">
                    Tus cambios se guardan automáticamente en la nube.
                  </p>
               </div>
            </div>
          </motion.div>

          {/* MAIN CONTENT */}
          <main className="flex-1 w-full border-4 border-qart-primary bg-qart-surface p-1 shadow-[20px_20px_0px_var(--qart-primary)] relative">
            <div className="p-8 md:p-16 bg-qart-surface border-4 border-qart-border-subtle min-h-[700px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  {activeTab === 'account' && <ConfigSectionCredentials />}
                  {activeTab === 'appearance' && <ConfigSectionVisual />}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ConfigPage;
