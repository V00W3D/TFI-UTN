import { motion } from 'framer-motion';

/**
 * @file FeaturedDish.tsx
 * @description Symmetric Featured Dishes.
 */
const FeaturedDish = () => {
  const dishes = [
    { title: 'Architect Burger', tag: 'Signature', price: '$12.50', desc: 'Wagyu y emulsión de trufa.' },
    { title: 'Salmon Sillage', tag: 'Temporada', price: '$18.00', desc: 'Salmón salvaje y cítricos.' },
    { title: 'Burrata Opera', tag: 'Entrada', price: '$14.20', desc: 'Burrata y tomates confitados.' },
  ];

  return (
    <div className="l-section" id="menu">
      <div className="text-center mb-16 space-y-4">
        <h4>Sugerencias</h4>
        <h2 className="tracking-tight">Selecciones del Chef</h2>
        <div className="w-8 h-0.5 bg-accent mx-auto" />
      </div>

      <div className="l-menu-grid">
        {dishes.map((dish, i) => (
          <motion.div key={i} className="l-card" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
             <div className="flex flex-col h-full space-y-6">
               <div className="flex justify-between items-baseline">
                 <span className="text-[9px] uppercase font-black text-accent tracking-widest">{dish.tag}</span>
                 <span className="text-[10px] opacity-20 font-serif">0{i+1}</span>
               </div>
               <h3 className="text-xl">{dish.title}</h3>
               <p className="text-dim text-sm font-light flex-1">{dish.desc}</p>
               <div className="flex justify-between items-center pt-6 border-t border-border mt-auto">
                 <span className="text-lg font-light">{dish.price}</span>
                 <button className="text-[9px] uppercase font-bold tracking-tighter hover:text-primary">Detalles</button>
               </div>
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedDish;
