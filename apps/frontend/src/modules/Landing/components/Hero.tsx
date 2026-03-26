import { motion } from 'framer-motion';

/**
 * @file Hero.tsx
 * @description Bouncy, appetizing, full-bleed hero tailored for intense UX and customization.
 */
const Hero = () => {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-qart-bg pt-20">
      {/* Playful Background Shapes */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-qart-accent/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-10 -right-20 w-120 h-120 bg-orange-400/10 rounded-full blur-[100px]" />

      {/* CONTENT GRID */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* TEXT CONTENT */}
        <div className="text-center lg:text-left pt-10 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-block bg-white text-qart-accent font-bold px-4 py-2 rounded-full shadow-sm border border-qart-accent/20 mb-6 text-sm"
          >
            🔥 100% Personalizable
          </motion.div>

          <motion.h1
            className="text-6xl md:text-7xl lg:text-8xl font-display text-qart-primary leading-[1.1] mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Diseña tu <br />
            <span className="text-qart-accent">Obra Maestra.</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-qart-text-muted leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0 font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Ingredientes de primera, pan artesanal y el poder absoluto en tus manos. Armá, pedí y
            devorá la hamburguesa de tus sueños.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <button className="btn-primary w-full sm:w-auto text-lg">Empezar Ahora</button>
            <button
              className="btn-outline w-full sm:w-auto text-lg bg-white"
              onClick={() =>
                document.getElementById('carta')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Ver Favoritas
            </button>
          </motion.div>
        </div>

        {/* HERO IMAGE COMPOSITION */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 50, rotate: -5 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.3 }}
        >
          {/* Floating Ingredients Illusion */}
          <div className="relative w-full aspect-square max-w-[600px] mx-auto">
            <img
              src="/hero.png"
              alt="Giant Burger"
              className="w-full h-full object-contain drop-shadow-2xl animate-[float_6s_ease-in-out_infinite]"
            />
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
