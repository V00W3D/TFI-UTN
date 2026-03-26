import { motion } from 'framer-motion';

/**
 * @file Story.tsx
 * @description Sovereign V4 Story block.
 */
const Story = () => {
  return (
    <div className="section-sharp" id="legado">
      <div className="container-sharp grid lg:grid-cols-2 gap-[var(--p-16)] items-center">
        <motion.div 
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-[var(--p-6)]"
        >
          <h4>El Legado</h4>
          <h2>Esculpiendo <br /> el Futuro del Sabor</h2>
          <div className="w-12 h-0.5 bg-accent" />
          <p className="text-dim text-[var(--f-lg)] font-light leading-relaxed">
            En QART, cada plato es una declaración de principios. Fusionamos la rigurosidad 
            técnica con la libertad creativa para crear momentos irrepetibles.
          </p>
          <p className="text-dim text-[var(--f-base)] font-light">
            Seleccionamos ingredientes por su alma, no por su nombre. Nuestra meta es 
            redefinir el lujo gastronómico a través de la honestidad y la vanguardia.
          </p>
        </motion.div>
        
        <motion.div 
          className="img-frame"
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <img src="/ambiance.png" alt="QART Atmosphere" className="w-full grayscale hover:grayscale-0 transition-all duration-1000" />
        </motion.div>
      </div>
    </div>
  );
};

export default Story;
