import { motion } from 'framer-motion';

/**
 * @file CraftSection.tsx
 * @description Visual teaser for the craftable dishes feature.
 */
const CraftSection = () => {
  return (
    <section className="py-24 bg-primary text-inverse overflow-hidden">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="order-2 md:order-1">
          <div className="relative">
            <motion.img
              src="/chef.png"
              className="rounded-3xl shadow-2xl relative z-20"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-1 border-accent/20 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="order-1 md:order-2 space-y-8">
          <h2 className="text-5xl leading-tight">
            Diseñe su <br />
            <span className="text-accent">Obra Maestra</span>
          </h2>
          <p className="text-lg opacity-80 leading-relaxed">
            Nuestra función de "Crafting" le permite orquestar cada nivel de su platillo. Desde la
            selección del pan artesanal hasta la emulsión final, cada elección es suya.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center gap-4">
              <span className="w-6 h-6 rounded-full border border-accent flex items-center justify-center text-[10px]">
                01
              </span>
              <span>Selección de Base Artesanal</span>
            </li>
            <li className="flex items-center gap-4">
              <span className="w-6 h-6 rounded-full border border-accent flex items-center justify-center text-[10px]">
                02
              </span>
              <span>Proteínas Signature</span>
            </li>
            <li className="flex items-center gap-4">
              <span className="w-6 h-6 rounded-full border border-accent flex items-center justify-center text-[10px]">
                03
              </span>
              <span>Toppings de Micro-Huerta</span>
            </li>
          </ul>
          <button className="btn-premium border-white bg-transparent hover:bg-white hover:text-primary mt-6">
            Empezar a Crear
          </button>
        </div>
      </div>
    </section>
  );
};

export default CraftSection;
