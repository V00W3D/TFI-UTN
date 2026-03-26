import { motion } from 'framer-motion';

/**
 * @file CraftSection.tsx
 * @description Highlights the customization aspect with a premium aesthetic.
 */
const CraftSection = () => {
  return (
    <section id="reserve" className="py-24 bg-primary text-inverse overflow-hidden">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="order-2 md:order-1">
          <div className="relative">
            <motion.img
              src="/chef.png"
              alt="Chef Crafting"
              className="w-full grayscale brightness-75 hover:grayscale-0 transition-all duration-1000"
              initial={{ scale: 1.1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-accent/20 rounded-full animate-pulse" />
          </div>
        </div>

        <div className="order-1 md:order-2 space-y-8">
          <h2 className="text-6xl tracking-tight leading-none">
            Tu Visión, <br />
            <span className="text-accent italic font-serif">Nuestra Técnica</span>
          </h2>
          <div className="w-24 h-px bg-accent/40" />
          <p className="text-xl font-light opacity-80 leading-relaxed">
            Personaliza cada detalle de tu experiencia. Desde la intensidad del ahumado hasta la
            textura de las salsas artesanales. En QART, tú eres el co-autor de tu plato.
          </p>
          <ul className="space-y-4 pt-4">
            {['Ingredientes de Origen', 'Cocción de Precisión', 'Emplatado de Autor'].map(
              (item) => (
                <li
                  key={item}
                  className="flex items-center gap-4 text-sm uppercase tracking-widest opacity-60"
                >
                  <span className="size-1.5 bg-accent rounded-full" />
                  {item}
                </li>
              ),
            )}
          </ul>
          <div className="pt-8">
            <button className="btn-luxury">Diseñar mi Experiencia</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CraftSection;
