import { motion } from 'framer-motion';

/**
 * @file Hero.tsx
 * @description The immersive 100vh Hero section, centered, majestic, and inherently responsive.
 */
const Hero = () => {
  return (
    <section className="relative w-full h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden bg-qart-surface">
      
      {/* BACKGROUND IMAGE WITH KEN BURNS EFFECT */}
      <motion.img 
        src="/hero.png" 
        alt="QART Experience" 
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.1, filter: 'brightness(0.3) grayscale(0.2)' }}
        animate={{ scale: 1, filter: 'brightness(0.4) grayscale(0)' }}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      {/* GRADIENT OVERLAY FOR TEXT READABILITY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      
      {/* CONTENT */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        <motion.span 
          className="block text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-qart-accent mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Gastronomía de Autor
        </motion.span>
        
        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl text-white mb-8 font-serif select-none drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          QART
        </motion.h1>
        
        <motion.div 
          className="w-24 h-[1px] bg-qart-accent mb-8"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 1 }}
        />

        <motion.p 
          className="text-lg md:text-xl text-gray-200 font-light tracking-[0.05em] mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          Donde la técnica milimétrica abraza la pasión culinaria.
        </motion.p>
        
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 1.4, duration: 0.8 }}
        >
          <button 
            className="btn-gold" 
            onClick={() => document.getElementById('carta')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Descubrir la Carta
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
