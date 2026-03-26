import { motion } from 'framer-motion';

/**
 * @file FeaturedDish.tsx
 * @description Sovereign V4 Featured Dishes.
 */
const FeaturedDish = () => {
  const dishes = [
    { title: 'Architect Burger', tag: 'Signature', price: '$12.50', desc: 'Wagyu seleccionada, cebolla caramelizada y emulsión de trufa negra.' },
    { title: 'Salmon Sillage', tag: 'Temporada', price: '$18.00', desc: 'Salmón salvaje con costra de finas hierbas, cítricos y puré de hinojo.' },
    { title: 'Burrata Opera', tag: 'Entrada', price: '$14.20', desc: 'Corazón de burrata, tomates confitados al romero y aceite de albahaca.' },
  ];

  return (
    <div className="section-sharp bg-surface-soft" id="carta">
      <div className="container-sharp">
        <div className="text-center mb-[var(--p-16)] space-y-[var(--p-4)]">
          <h4>Selecciones del Chef</h4>
          <h2 className="tracking-tight">La Carta</h2>
          <div className="w-[var(--p-8)] h-[1px] bg-accent mx-auto" />
        </div>

        <div className="grid md:grid-cols-3 gap-[var(--p-8)]">
          {dishes.map((dish, idx) => (
            <motion.div 
              key={idx} 
              className="card-v4 group"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
            >
               <div className="flex flex-col h-full gap-[var(--p-6)]">
                 <div className="flex justify-between items-baseline">
                   <span className="text-[var(--f-xs)] uppercase font-extrabold text-accent tracking-widest">{dish.tag}</span>
                   <span className="text-[var(--f-sm)] opacity-20 font-serif">0{idx+1}</span>
                 </div>
                 <h3 className="text-[var(--f-xl)] leading-none">{dish.title}</h3>
                 <p className="text-dim text-[var(--f-base)] font-light leading-relaxed flex-1">{dish.desc}</p>
                 <div className="flex justify-between items-center pt-[var(--p-6)] border-t border-border mt-auto">
                   <span className="text-[var(--f-lg)] font-light">{dish.price}</span>
                   <button className="text-[var(--f-xs)] uppercase font-extrabold tracking-widest hover:text-primary transition-colors">Ver Detalles</button>
                 </div>
               </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedDish;
