import { motion } from 'framer-motion';

/**
 * @file CraftSection.tsx
 * @description The high-contrast dark block to break visual rhythm and emphasize exclusivity.
 */
const CraftSection = () => {
  return (
    <section id="reserva" className="py-24 md:py-32 bg-[#140b0e] text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
        
        {/* IMAGE COMPOSITION */}
        <motion.div 
           className="order-2 lg:order-1 relative"
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 1 }}
        >
          <div className="relative border border-[#3d242c] p-2 bg-[#1e1115]">
            <img 
              src="/chef.png" 
              className="w-full h-auto object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-1000" 
              alt="QART Chef in action" 
            />
            {/* Golden offset specific to dark theme */}
            <div className="absolute -inset-3 border border-[#c49a62]/30 pointer-events-none rounded-sm" />
          </div>
        </motion.div>
        
        {/* TEXT CONTENT */}
        <motion.div 
          className="order-1 lg:order-2 space-y-8"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#c49a62] block mb-4">
              Privilege
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl mb-6 text-[#f4f0f2]">
              Diseño <br />
              <span className="italic text-[#c49a62]">de Experiencia</span>
            </h2>
            <div className="w-16 h-[1px] bg-[#c49a62]" />
          </div>

          <p className="text-[#a39599] text-lg font-light leading-relaxed">
            Co-cree su plato. En QART, la precisión milimétrica de nuestra técnica se pone a entera disposición de su visión personal. El lienzo es suyo.
          </p>
          
          <ul className="grid grid-cols-2 gap-4">
            {['Cortes Exclusivos', 'Cocción al Vacío', 'Emplatado Mínimo', 'Bodega Privada'].map(it => (
              <li key={it} className="text-xs uppercase font-bold tracking-[0.1em] text-[#f4f0f2] flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-[#c49a62] rounded-full" /> {it}
              </li>
            ))}
          </ul>
          
          <div className="pt-6">
            <button className="btn-gold !bg-transparent hover:!bg-[#c49a62] hover:!text-white border-[#c49a62] text-[#c49a62]">
              Coordinar Visita
            </button>
          </div>
        </motion.div>

      </div>

      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#c49a62]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
    </section>
  );
};

export default CraftSection;
