import { motion } from 'framer-motion';

/**
 * @file FeaturedDish.tsx
 * @description The elegant, mathematically flawless 3-column menu grid.
 */
const FeaturedDish = () => {
  const dishes = [
    { title: 'The Architect Burger', tag: 'Signature', price: '$12.50', desc: 'Corte magro de Wagyu, cebolla dulce caramelizada, suave emulsión de trufa negra y pan brioche artesano.' },
    { title: 'Salmon Sillage', tag: 'Temporada', price: '$18.00', desc: 'Lomo de salmón salvaje sellado, costra crujiente de finas hierbas, cítricos y sedoso puré de hinojo dulce.' },
    { title: 'Burrata Opera', tag: 'Entrada', price: '$14.20', desc: 'Suave corazón de burrata fresca, emulsión de tomates confitados al romero y aceite puro de albahaca.' },
  ];

  return (
    <section id="carta" className="py-24 md:py-32 bg-qart-surface">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs uppercase font-bold tracking-[0.3em] text-qart-accent block mb-4">
            Sugerencias del Chef
          </span>
          <h2 className="text-4xl md:text-5xl text-qart-primary mb-6">
            Menú de Autor
          </h2>
          <div className="w-16 h-[1px] bg-qart-accent mx-auto" />
        </div>

        {/* 3 COLUMN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {dishes.map((dish, idx) => (
            <motion.div 
              key={idx} 
              className="bg-qart-bg border border-qart-border p-8 md:p-10 flex flex-col h-full group hover:border-qart-accent transition-all duration-500 shadow-sm hover:shadow-elegant rounded-[2px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.15, duration: 0.8 }}
            >
               {/* Metadata Row */}
               <div className="flex justify-between items-baseline mb-8">
                 <span className="text-[10px] sm:text-xs uppercase font-bold text-qart-accent tracking-[0.2em]">{dish.tag}</span>
                 <span className="text-sm font-serif text-qart-text-muted opacity-40 group-hover:opacity-100 transition-opacity">
                   0{idx + 1}
                 </span>
               </div>
               
               {/* Body */}
               <h3 className="text-2xl md:text-3xl text-qart-primary mb-4 leading-tight">
                 {dish.title}
               </h3>
               <p className="text-qart-text-muted text-sm md:text-base font-light flex-1 leading-relaxed mb-8">
                 {dish.desc}
               </p>
               
               {/* Footer */}
               <div className="flex justify-between items-center pt-6 border-t border-qart-border group-hover:border-qart-accent/30 transition-colors">
                 <span className="text-xl md:text-2xl text-qart-primary">{dish.price}</span>
                 <button className="text-[10px] uppercase font-bold tracking-[0.1em] text-qart-text-muted hover:text-qart-accent transition-colors">
                   Ver Detalles
                 </button>
               </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedDish;
