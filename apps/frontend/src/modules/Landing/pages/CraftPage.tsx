import { motion } from 'framer-motion';

const CraftPage = () => {
  return (
    <div className="min-h-screen bg-qart-bg pt-24 px-6 md:px-12 pb-12 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl border-4 border-qart-border bg-qart-surface p-8 md:p-12 shadow-[12px_12px_0px_var(--qart-border)]"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-qart-accent flex items-center justify-center border-4 border-qart-border">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--qart-text-on-accent)"
              strokeWidth="2.5"
              strokeLinecap="square"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-qart-primary">
            Crafteo
          </h1>
        </div>

        <p className="text-lg md:text-xl font-bold text-qart-text mb-8 p-4 border-l-4 border-qart-accent bg-qart-surface-sunken">
          Esta zona estará dedicada a combinar items y customizar tu menú. Próximamente.
        </p>
      </motion.div>
    </div>
  );
};

export default CraftPage;
