import { motion } from 'framer-motion';

/**
 * @file Story.tsx
 * @description Narrative section explaining the brand's philosophy.
 */
const Story = () => {
  return (
    <div className="grid md:grid-cols-2 gap-24 items-center relative py-12">
      <div className="craft-deco">Q</div>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-6xl mb-10 leading-none tracking-tight">
          Nuestra Filosofía: <br />
          <span className="text-accent italic font-serif">El Arte en cada Capa</span>
        </h2>
        <div className="w-24 h-px bg-accent mb-10" />
        <p className="text-secondary leading-loose text-xl mb-8 font-light">
          En QART, no solo preparamos comida. Esculpimos sabores. Nuestra cocina se basa en la
          precisión de la técnica clásica fusionada con la libertad de la gastronomía de autor.
        </p>
        <p className="text-secondary leading-loose text-xl font-light">
          Cada ingrediente es seleccionado por su origen y carácter, permitiendo que cada plato
          cuente una historia única de frescura y sofisticación.
        </p>
      </motion.div>

      <motion.div
        className="relative"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <div className="p-2 gold-border rounded-none bg-bg relative z-10">
          <img
            src="/ambiance.png"
            alt="Restaurante Ambiance"
            className="w-full grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
          />
        </div>
        <div className="absolute -top-12 -right-12 w-full h-full border border-primary/10 -z-10" />
      </motion.div>
    </div>
  );
};

export default Story;
