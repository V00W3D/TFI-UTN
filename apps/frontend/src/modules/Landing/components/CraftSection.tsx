import { motion } from 'framer-motion';

/**
 * @file CraftSection.tsx (Repurposed as massive energetic CTA block)
 * @description Giant orange call to action banner driving users to the builder.
 */
const CraftSection = () => {
  return (
    <section className="py-24 md:py-32 bg-qart-accent text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <motion.h2
          className="text-5xl md:text-7xl font-display mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          Es hora de crear la tuya.
        </motion.h2>

        <motion.p
          className="text-xl md:text-2xl font-medium opacity-90 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Únete a miles de adictos a las hamburguesas que ya están diseñando su bocado perfecto capa
          por capa.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <button className="bg-white text-qart-accent font-bold px-10 py-5 rounded-full text-xl shadow-2xl hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all">
            Empezar a Armar 🍔
          </button>
        </motion.div>
      </div>

      {/* Background Graphic Elements */}
      <div className="absolute top-0 right-10 text-[20rem] opacity-10 rotate-12 -translate-y-1/2 select-none pointer-events-none">
        🍟
      </div>
      <div className="absolute bottom-0 left-10 text-[20rem] opacity-10 -rotate-12 translate-y-1/4 select-none pointer-events-none">
        🥤
      </div>
    </section>
  );
};

export default CraftSection;
