import { motion } from 'framer-motion';

/**
 * @file CraftSection.tsx
 * @description Sovereign V4 Craft Section.
 */
const CraftSection = () => {
  return (
    <div className="section-sharp border-y border-border" id="reserva">
      <div className="container-sharp grid lg:grid-cols-2 gap-[var(--p-16)] items-center">
        <motion.div 
           className="img-frame lg:order-2"
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 1 }}
        >
          <img src="/chef.png" className="w-full grayscale brightness-90 hover:grayscale-0 transition-all duration-1000" alt="QART Chef" />
        </motion.div>
        
        <motion.div 
          className="space-y-[var(--p-8)] lg:order-1"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h4>Personalización</h4>
          <h2>Diseño <br /><span className="italic">de Experiencia</span></h2>
          <div className="w-[var(--p-12)] h-[1px] bg-accent" />
          <p className="text-dim text-[var(--f-lg)] font-light leading-relaxed">
            Co-cree su plato con la guía de nuestros expertos. En QART, la precisión de la 
            técnica se encuentra con su visión personal.
          </p>
          <ul className="grid grid-cols-2 gap-[var(--p-4)] opacity-70">
            {['Origen Certificado', 'Técnica Al Vació', 'Emplatado Mínimo', 'Artesanía Pura'].map(it => (
              <li key={it} className="text-[var(--f-xs)] uppercase font-extrabold tracking-widest flex items-center gap-3">
                <span className="size-1 bg-accent" /> {it}
              </li>
            ))}
          </ul>
          <div className="pt-[var(--p-4)]">
            <button className="btn-v4 px-[var(--p-12)]">Personalizar Reserva</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CraftSection;
