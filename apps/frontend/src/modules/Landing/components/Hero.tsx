import { motion } from 'framer-motion';

/**
 * @file Hero.tsx
 * @description Immersive hero section for the landing page.
 */
const Hero = () => {
  return (
    <section className="landing-hero">
      <img src="/hero.png" alt="Featured Gourmet Burger" className="landing-hero__image" />
      <div className="landing-hero__content">
        <motion.h1
          className="landing-hero__title h1"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <span>Autor Gastronomía</span>
          QART
        </motion.h1>
        <motion.p
          className="text-xl mb-10 opacity-90 font-light tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          Experiencias culinarias diseñadas para los sentidos.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <button className="btn-premium">Reservar Mesa</button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
