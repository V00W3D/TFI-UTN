import { motion } from 'framer-motion';

/**
 * @file Story.tsx
 * @description The legacy section, optically balanced with 50/50 split on desktop.
 */
const Story = () => {
  return (
    <section id="legado" className="py-24 md:py-32 bg-qart-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* TEXT CONTENT */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="order-2 lg:order-1"
        >
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-qart-accent block mb-4">
            El Legado
          </span>
          <h2 className="text-4xl md:text-5xl text-qart-primary mb-8 leading-tight">
            Esculpiendo el <br />
            <span className="italic text-qart-accent">Futuro del Sabor</span>
          </h2>
          <div className="w-16 h-[1px] bg-qart-accent mb-8" />
          
          <div className="space-y-6 text-qart-text-muted text-lg font-light leading-relaxed">
            <p>
              En QART, cada plato es una declaración de principios. Fusionamos la rigurosidad 
              técnica de la tradición clásica con la libertad creativa absoluta de la gastronomía de autor.
            </p>
            <p>
              Seleccionamos cada ingrediente por su alma y terruño, permitiendo que hable por sí mismo. 
              Nuestra meta es redefinir el lujo gastronómico a través de la honestidad y la vanguardia.
            </p>
          </div>
        </motion.div>
        
        {/* IMAGE COMPOSITION */}
        <motion.div 
          className="order-1 lg:order-2"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative p-3 bg-qart-surface border border-qart-border shadow-elegant group">
            <img 
              src="/ambiance.png" 
              alt="Ambiente QART" 
              className="w-full h-auto object-cover filter grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000" 
            />
            {/* The Golden Frame Offset */}
            <div className="absolute -inset-4 border border-qart-accent/40 rounded-sm pointer-events-none -z-10 transition-all duration-500 group-hover:-inset-3" />
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Story;
