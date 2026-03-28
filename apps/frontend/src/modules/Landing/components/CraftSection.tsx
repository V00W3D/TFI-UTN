import { motion } from 'framer-motion';

/**
 * @file CraftSection.tsx
 * @description Massive architectural CTA block with high-contrast geometry.
 */
const CraftSection = () => {
  return (
    <section className="py-32 bg-qart-primary text-qart-text-inv overflow-hidden relative border-y-4 border-qart-border">
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <motion.h2
          className="text-6xl md:text-8xl font-display mb-10 leading-none uppercase font-black"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          ¿Qué vas a <br />
          <span className="text-qart-accent">armar hoy?</span>
        </motion.h2>

        <motion.p
          className="text-xl md:text-2xl font-bold uppercase tracking-tighter opacity-90 mb-16 max-w-2xl mx-auto leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Milanesa napolitana, burger doble smash, o lo que se te ocurra. Tu plato ideal te está esperando en QART.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <button className="btn-outline px-12 py-6 text-2xl !bg-qart-bg !text-qart-primary !border-qart-border shadow-hover uppercase tracking-[0.2em] font-black group transition-all">
            Empezar a armar
          </button>
        </motion.div>
      </div>

      {/* Background Graphic Elements (Structural) */}
      <div className="absolute top-0 right-0 w-1/4 h-full bg-qart-accent/10 border-l-2 border-qart-border hidden lg:block" />
      <div className="absolute bottom-0 left-0 w-1/4 h-full bg-qart-accent/5 border-r-2 border-qart-border hidden lg:block" />
    </section>
  );
};

export default CraftSection;
