import { motion } from 'framer-motion';

/**
 * @file Story.tsx (Repurposed as "How it Works")
 * @description Engaging, interactive 3-step flow showing the user how easy it is to build a burger.
 */
const Story = () => {
  const steps = [
    {
      title: 'Elegí tu base',
      desc: 'Milanesa de carne, de pollo, burger doble smash o medallón veggie. Vos elegís el punto de partida.',
      icon: (
        <svg
          className="w-12 h-12 text-qart-accent"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" />
        </svg>
      ),
      color: 'bg-qart-accent/10',
    },
    {
      title: 'Personalizá todo',
      desc: 'Sumá cheddar, hacela napolitana, agregá bacon crocante o salsa secreta. No hay límites para tu antojo.',
      icon: (
        <svg
          className="w-12 h-12 text-qart-accent-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      ),
      color: 'bg-qart-accent-2/10',
    },
    {
      title: 'Disfrutá donde sea',
      desc: 'Te lo enviamos volando a casa o te esperamos en nuestro local con la mesa lista. Así de simple.',
      icon: (
        <svg
          className="w-12 h-12 text-qart-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      color: 'bg-qart-primary/10',
    },
  ];

  return (
    <section id="como-funciona" className="py-32 bg-qart-bg relative overflow-hidden">
      {/* SECTION DIVIDER - Transition to FeaturedDish */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0">
        <svg
          className="relative block w-[calc(100%+1.3px)] h-15"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            fill="var(--qart-bg)"
            opacity="0.6"
          ></path>
        </svg>
      </div>
      {/* TOP DIVIDER - Clean line to transition from bg-warm */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-qart-border to-transparent opacity-50" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* HEADER */}
        <div className="text-center mb-24">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-qart-bg-warm text-qart-primary text-xs font-bold rounded-none uppercase tracking-widest mb-6 border border-qart-border"
          >
            Simple como pedir en la caja
          </motion.span>
          <h2 className="text-5xl md:text-6xl text-qart-primary mb-6">
            Armá tu plato ideal <br /> <span className="text-qart-accent">en tres pasos</span>
          </h2>
        </div>

        {/* 3 STEP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting Line (Desktop only) */}
          <div className="hidden md:block absolute top-15 left-[15%] w-[70%] h-0.5 border-t-2 border-dashed border-qart-border -z-10" />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              className="flex flex-col items-center text-center group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: idx * 0.2, type: 'spring', stiffness: 100 }}
            >
              <div className="relative shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-qart-bg-warm rounded-4xl flex items-center justify-center p-6 mb-8 group-hover:scale-110 transition-transform duration-500">
                {step.icon}
                {/* Number Badge */}
                <div className="step-badge transition-all duration-300">{idx + 1}</div>
              </div>

              <h3 className="text-2xl font-display text-qart-primary mb-4 group-hover:text-qart-accent transition-colors">
                {step.title}
              </h3>
              <p className="text-qart-text-muted text-base leading-relaxed px-4 font-medium">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Story;
