import { motion } from 'framer-motion';

/**
 * @file FeaturedDish.tsx
 * @description Showcases principal dishes in an elegant display.
 */
const FeaturedDish = () => {
  const dishes = [
    {
      title: 'The Architect Burger',
      tag: 'Signature',
      price: '$12.50',
      desc: 'Wagyu, cebolla caramelizada y emulsión de trufa.',
    },
    {
      title: 'Salmon Sillage',
      tag: 'Temporada',
      price: '$18.00',
      desc: 'Salmón salvaje con costra de finas hierbas y cítricos.',
    },
    {
      title: 'Burrata Opera',
      tag: 'Entrada',
      price: '$14.20',
      desc: 'Corazón de burrata, tomates confitados y oro líquido.',
    },
  ];

  return (
    <div className="space-y-20">
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <h2 className="text-6xl tracking-tight">Selecciones del Chef</h2>
        <div className="w-32 h-px bg-accent mx-auto" />
        <p className="text-secondary text-xl font-light">
          Una curaduría de nuestros platos más emblemáticos, donde cada bocado es una sinfonía.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {dishes.map((dish, idx) => (
          <motion.div
            key={idx}
            className="card-luxury group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.2 }}
          >
            <div className="space-y-6 flex flex-col h-full">
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold">
                  {dish.tag}
                </span>
                <span className="text-2xl font-serif text-primary/60 group-hover:text-white transition-colors">
                  0{idx + 1}
                </span>
              </div>
              <h3 className="text-3xl leading-none">{dish.title}</h3>
              <p className="text-secondary text-sm font-light flex-1">{dish.desc}</p>
              <div className="flex justify-between items-end pt-8 border-t border-border group-hover:border-white/20">
                <span className="text-2xl font-light tracking-tighter">{dish.price}</span>
                <button className="text-[10px] uppercase tracking-widest font-bold border-b border-accent pb-1 group-hover:border-white">
                  Detalles
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedDish;
