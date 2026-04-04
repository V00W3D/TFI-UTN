import { motion } from 'framer-motion';

const ConfigPage = () => {
  return (
    <div className="min-h-screen bg-qart-bg pt-24 px-6 md:px-12 pb-12 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl border-4 border-qart-border bg-qart-surface p-8 md:p-12 shadow-[12px_12px_0px_var(--qart-border)]"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-qart-accent flex items-center justify-center border-4 border-qart-border">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--qart-text-on-accent)" strokeWidth="2.5" strokeLinecap="square">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-qart-primary">Ajustes</h1>
        </div>

        <p className="text-lg md:text-xl font-bold text-qart-text mb-8 p-4 border-l-4 border-qart-accent bg-qart-surface-sunken">
          Próximamente podrás configurar tu cuenta y preferencias visuales aquí.
        </p>
      </motion.div>
    </div>
  );
};

export default ConfigPage;
