import { motion } from 'framer-motion';

/**
 * @file Story.tsx
 * @description Symmetric Story section.
 */
const Story = () => {
  return (
    <div className="l-grid-balanced" id="story">
      <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}>
        <h2 className="mb-6">Nuestra Filosofía: <br /><span className="italic">El Arte en cada Capa</span></h2>
        <div className="w-12 h-0.5 bg-accent mb-8" />
        <p className="text-dim text-lg mb-6 font-light">
          En QART, esculpimos sabores. Nuestra cocina se basa en la precisión de la técnica 
          clásica fusionada con la libertad de la gastronomía de autor.
        </p>
        <p className="text-dim text-lg font-light">
          Cada ingrediente es seleccionado por su origen, permitiendo que cada plato 
          cuente una historia única de sofisticación.
        </p>
      </motion.div>
      <motion.div className="l-image-wrap" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}>
        <img src="/ambiance.png" alt="Atmosphere" className="w-full grayscale hover:grayscale-0 transition-all duration-1000" />
      </motion.div>
    </div>
  );
};

export default Story;
