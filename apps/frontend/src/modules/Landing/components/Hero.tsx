import { motion } from 'framer-motion';

/**
 * @file Hero.tsx
 * @description Architectural, high-contrast hero with sharp geometry and bold typography.
 */
const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden bg-qart-bg">
      {/* Structural Decor (Sharp) */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-qart-bg-warm border-l-4 border-qart-border hidden lg:block" />

      {/* CONTENT GRID */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* TEXT CONTENT */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="badge-accent mb-8 uppercase tracking-[0.3em]"
          >
            Personalización ilimitada
          </motion.div>

          <motion.h1
            className="text-6xl md:text-7xl lg:text-9xl font-display text-qart-primary leading-[0.85] mb-10 uppercase font-black"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Tu plato, <br />
            <span className="text-qart-accent">tus reglas.</span>
          </motion.h1>

          <motion.p
            className="text-xl text-qart-text-muted leading-relaxed mb-12 max-w-lg mx-auto lg:mx-0 font-bold uppercase tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Sabor de autor, esencia de barrio. Armamos lo que se te ocurra, sin vueltas, con los
            mejores ingredientes.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <button className="btn-primary w-full sm:w-auto text-lg px-10 py-5 uppercase tracking-widest">
              Empezar a Armar
            </button>
            <button
              className="btn-outline w-full sm:w-auto text-lg px-10 py-5 uppercase tracking-widest"
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
            className="mt-16 flex flex-wrap justify-center lg:justify-start gap-10"
          >
            <div className="flex items-center gap-4 group">
              <div className="w-14 h-14 bg-qart-surface border-2 border-qart-border flex items-center justify-center transition-all duration-300 group-hover:bg-qart-accent group-hover:text-white">
                <svg
                  className="w-7 h-7"
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
                  Delivery
                </p>
                <p className="text-xs text-qart-text-muted font-bold">RÁPIDO & CALIENTE</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-14 h-14 bg-qart-surface border-2 border-qart-border flex items-center justify-center transition-all duration-300 group-hover:bg-qart-accent-2 group-hover:text-white">
                <svg
                  className="w-7 h-7"
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
                <p className="text-xs text-qart-text-muted font-bold">AMBIENTE ÚNICO</p>
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
          <div className="relative w-full aspect-square max-w-125 border-8 border-qart-border bg-qart-bg-warm">
            <img
              src="/hero.png"
              alt="Plato personalizado"
              className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
            />
            {/* Absolute accent strip */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-qart-accent border-4 border-qart-border z-0" />
          </div>
        </motion.div>
      </div>

      {/* SHARP BOTTOM DIVIDER */}
      <div className="absolute bottom-0 left-0 w-full h-8 bg-qart-border" />
    </section>
  );
};

export default Hero;
