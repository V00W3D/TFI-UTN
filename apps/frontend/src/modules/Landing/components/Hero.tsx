import { motion } from 'framer-motion';

/**
 * @file Hero.tsx
 * @description Immersive hero section for the landing page.
 */
const Hero = () => {
  return (
    <section className="landing-hero bg-primary-dark">
      <motion.img
        src="/hero.png"
        alt="Featured Gourmet Burger"
        className="landing-hero__image"
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1.05, opacity: 0.7 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      />
      <div className="landing-hero__content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          <h1 className="landing-hero__title">
            <span>Autor Gastronomía</span>
            QART
          </h1>
        </motion.div>

        <motion.p
          className="text-2xl mb-12 opacity-80 font-light tracking-[0.2em] uppercase max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
        >
          Donde la precisión se encuentra con la pasión.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
        >
          <button
            className="btn-luxury"
            onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Descubrir el Menú
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
