import { motion } from 'framer-motion';

/**
 * @file Hero.tsx
 * @description Sovereign V4 Fluid Hero.
 */
const Hero = () => {
  return (
    <section className="relative h-[95vh] flex items-center justify-center bg-primary overflow-hidden">
      <motion.img 
        src="/hero.png" 
        className="absolute inset-0 w-full h-full object-cover opacity-25 grayscale-[0.2]"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.25 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      
      <div className="container-sharp relative z-10 text-center flex flex-col items-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5, duration: 1 }}
        >
          <h4>Gastronomía de Autor</h4>
          <h1 className="text-on-p mb-[var(--p-6)] select-none">QART</h1>
          <div className="w-[var(--p-8)] h-[1px] bg-accent mx-auto mb-[var(--p-6)]" />
          <p className="text-[var(--f-lg)] font-light tracking-[0.1em] text-on-p opacity-60 max-w-xl mb-[var(--p-8)]">
            Donde la precisión milimétrica se encuentra con la pasión culinaria más absoluta.
          </p>
          <button className="btn-v4" onClick={() => document.getElementById('carta')?.scrollIntoView({ behavior: 'smooth' })}>
            Descubrir la Experiencia
          </button>
        </motion.div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-[var(--p-24)] bg-gradient-to-t from-surface-soft to-transparent z-1" />
    </section>
  );
};

export default Hero;
