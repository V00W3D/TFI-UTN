import { motion } from 'framer-motion';

/**
 * @file Hero.tsx
 * @description Symmetric Hero section.
 */
const Hero = () => {
  return (
    <section className="l-hero">
      <motion.img 
        src="/hero.png" 
        className="l-hero__bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
      />
      <div className="l-hero__content l-container">
        <motion.span className="l-hero__subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Autor Gastronomía
        </motion.span>
        <motion.h1 className="l-hero__title" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          QART
        </motion.h1>
        <motion.p className="text-lg mb-10 opacity-60 font-light tracking-widest max-w-lg mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Donde la precisión se encuentra con la pasión culinaria.
        </motion.p>
        <button className="btn btn-primary" onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}>
          Descubrir el Menú
        </button>
      </div>
    </section>
  );
};

export default Hero;
