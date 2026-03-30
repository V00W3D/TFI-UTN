import { motion } from 'framer-motion';

/**
 * @file Hero.tsx
 * @description Architectural, high-contrast hero with sharp geometry and bold typography.
 */
const Hero = () => {
  return (
    <section className="relative min-h-[84vh] flex items-center pt-20 overflow-hidden bg-qart-bg">
      {/* Structural Decor (Sharp) */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-qart-bg-warm border-l-4 border-qart-border hidden lg:block" />

      {/* CONTENT GRID */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* TEXT CONTENT */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="badge-accent mb-6 uppercase tracking-[0.3em]"
          >
            Pedí a tu manera
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl lg:text-[7rem] font-display text-qart-primary leading-[0.86] mb-8 uppercase font-black"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Armá tu plato <br />
            <span className="text-qart-accent">a tu manera.</span>
          </motion.h1>

          <motion.p
            className="text-lg text-qart-text-muted leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0 font-bold uppercase tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Elegí la base, sumá ingredientes y definí cada detalle en una experiencia simple,
            clara y pensada para pedir sin complicaciones.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <button className="btn-primary w-full sm:w-auto text-base px-8 py-4 uppercase tracking-widest">
              Empezar pedido
            </button>
            <button
              className="btn-outline w-full sm:w-auto text-base px-8 py-4 uppercase tracking-widest"
              onClick={() =>
                document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Cómo funciona
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-12 flex flex-wrap justify-center lg:justify-start gap-8"
          >
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-qart-surface border-2 border-qart-border flex items-center justify-center transition-all duration-300 group-hover:bg-qart-accent group-hover:text-white">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-qart-primary uppercase tracking-widest">
                  Envío
                </p>
                <p className="text-xs text-qart-text-muted font-bold">RÁPIDO Y CUIDADO</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-qart-surface border-2 border-qart-border flex items-center justify-center transition-all duration-300 group-hover:bg-qart-accent-2 group-hover:text-white">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-qart-primary uppercase tracking-widest">
                  En el Local
                </p>
                <p className="text-xs text-qart-text-muted font-bold">CÓMODO Y BIEN ATENDIDO</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* HERO IMAGE (Sharp Shadow) */}
        <motion.div
          className="relative lg:flex justify-end"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="relative w-full aspect-square max-w-[29rem] border-8 border-qart-border bg-qart-bg-warm">
            <img
              src="/hero.png"
              alt="Plato personalizado"
              className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
            />
            {/* Absolute accent strip */}
            <div className="absolute -bottom-5 -right-5 w-24 h-24 bg-qart-accent border-4 border-qart-border z-0" />
          </div>
        </motion.div>
      </div>

      {/* SHARP BOTTOM DIVIDER */}
      <div className="absolute bottom-0 left-0 w-full h-8 bg-qart-border" />
    </section>
  );
};

export default Hero;
