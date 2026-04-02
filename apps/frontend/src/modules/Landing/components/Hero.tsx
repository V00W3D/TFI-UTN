import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * @file Hero.tsx
 * @description Tono rápido y juvenil (cadena / burger energy), sin perder tokens QART.
 */
const Hero = () => {
  return (
    <section className="relative min-h-[82vh] flex items-center pt-20 overflow-hidden bg-qart-bg">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-qart-bg-warm border-l-4 border-qart-border hidden lg:block" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="badge-accent mb-5 uppercase tracking-[0.28em] text-[0.7rem]"
          >
            Rápido · Rico · Sin drama
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-[4.25rem] font-display text-qart-primary leading-[0.92] mb-6 uppercase font-black"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.55 }}
          >
            Comé bien,
            <br />
            <span className="text-qart-accent">sin complicarte.</span>
          </motion.h1>

          <motion.p
            className="text-base md:text-lg text-qart-text-muted leading-snug mb-8 max-w-md mx-auto lg:mx-0 font-semibold"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            Pedidos claros, precios al frente y el mismo espíritu de barrio. Si te copa el detalle de
            armado, el crafteo está — suave, nada forzado.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.5 }}
          >
            <Link
              to="/search"
              className="btn-primary w-full sm:w-auto text-sm px-8 py-3.5 uppercase tracking-widest text-center"
            >
              Pedir ahora
            </Link>
            <button
              type="button"
              className="btn-outline w-full sm:w-auto text-sm px-8 py-3.5 uppercase tracking-widest"
              onClick={() =>
                document.getElementById('destacados')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Favoritos
            </button>
            <button
              type="button"
              className="btn-outline w-full sm:w-auto text-sm px-8 py-3.5 uppercase tracking-widest"
              onClick={() =>
                document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Cómo funciona
            </button>
          </motion.div>
        </div>

        <motion.div
          className="relative lg:flex justify-end"
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
        >
          <div className="relative w-full aspect-square max-w-[26rem] border-[6px] border-qart-border bg-qart-bg-warm mx-auto lg:mx-0">
            <img
              src="/hero.png"
              alt="Plato del menú"
              className="w-full h-full object-cover grayscale-[0.15] hover:grayscale-0 transition-all duration-500"
            />
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-qart-accent border-4 border-qart-border z-0" />
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-6 bg-qart-border" />
    </section>
  );
};

export default Hero;
