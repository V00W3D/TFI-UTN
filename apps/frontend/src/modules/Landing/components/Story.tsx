import { motion } from 'framer-motion';

/**
 * @file Story.tsx (Repurposed as "How it Works")
 * @description Engaging, interactive 3-step flow showing the user how easy it is to build a burger.
 */
const Story = () => {
  const steps = [
    {
      icon: '🍞',
      title: 'Elige tu Base',
      desc: 'Brioche de papa, pan negro con sésamo o envuelto en lechuga fresca. Tú mandas.',
    },
    {
      icon: '🥩',
      title: 'Dibuja el Centro',
      desc: 'Doble smash, medallón relleno o veggie crujiente. Añade bacon, huevo y salsas secretas.',
    },
    {
      icon: '🚀',
      title: 'Devora tu Obra',
      desc: 'Nosotros la armamos con precisión milimétrica y te la enviamos volando. Así de fácil.',
    },
  ];

  return (
    <section id="como-funciona" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block bg-qart-accent/10 text-qart-accent font-bold px-4 py-2 rounded-full mb-6 text-sm"
          >
            ⚡ Rapidez y Control Absoluto
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-display text-qart-primary mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Tres Pasos para la Perfección
          </motion.h2>
        </div>

        {/* 3 STEP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
          {/* Connecting Line (Desktop only) */}
          <div className="hidden md:block absolute top-18 left-[10%] w-[80%] h-1 bg-qart-border -z-10 rounded-full" />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              className="flex flex-col items-center text-center group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: idx * 0.2, type: 'spring', stiffness: 100 }}
            >
              <div className="w-24 h-24 bg-qart-bg border-4 border-white shadow-xl rounded-full flex items-center justify-center text-4xl mb-8 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 relative">
                {step.icon}
                {/* Number Badge */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-qart-primary text-white rounded-full flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">
                  {idx + 1}
                </div>
              </div>

              <h3 className="text-2xl font-display text-qart-primary mb-4 group-hover:text-qart-accent transition-colors">
                {step.title}
              </h3>
              <p className="text-qart-text-muted text-base leading-relaxed px-4">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Story;
