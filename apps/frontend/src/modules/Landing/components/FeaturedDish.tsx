import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sdk } from '../../../tools/sdk';

/**
 * @file FeaturedDish.tsx
 * @description Grid de platos. Sin colores hardcodeados — todo usa vars del tema.
 * FIX: shadow-[12px_12px_0px_#EF4444] → shadow con var(--qart-error).
 */
const FeaturedDish = () => {
  const { data, isFetching, error } = sdk.customers.plates.$use();
  const [selectedBurgerId, setSelectedBurgerId] = useState<string | null>(null);

  useEffect(() => {
    sdk.customers.plates({});
  }, []);

  const plates = data && 'data' in data ? data.data : [];

  return (
    <section
      id="menu"
      className="py-32 bg-qart-bg relative"
      style={{ '--tw-selection-color': 'var(--qart-accent)' } as React.CSSProperties}
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8 pb-12 border-b-4 border-qart-border">
          <div className="max-w-2xl">
            <span className="badge-accent mb-6 uppercase tracking-[0.3em] font-black">
              Catálogo de Autor
            </span>
            <h2 className="text-6xl md:text-8xl font-display text-qart-primary mb-8 leading-none uppercase font-black">
              Nuestros <br /> Platos
            </h2>
            <p className="text-qart-text-muted text-xl leading-snug font-bold uppercase tracking-tight">
              Creaciones brutales, sabor sin concesiones. Cada ingrediente tiene un propósito.
            </p>
          </div>
          <button className="btn-outline shrink-0 group uppercase tracking-widest py-6 px-10">
            Ver Menú Completo
            <span className="ml-4 group-hover:translate-x-2 transition-transform inline-block">
              →
            </span>
          </button>
        </div>

        {/* GRID */}
        {!isFetching && !error && plates.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {plates.map((burger, idx: number) => {
              const isSelected = selectedBurgerId === burger.id;
              return (
                <motion.div
                  key={burger.id}
                  className="card-base flex flex-col group relative"
                  style={isSelected ? { boxShadow: '12px 12px 0px var(--qart-error)' } : {}}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedBurgerId(isSelected ? null : burger.id)}
                >
                  <div className="p-10 flex-1 flex flex-col">
                    {/* Placeholder imagen */}
                    <div
                      className="relative aspect-square mb-8 border-2 flex items-center justify-center overflow-hidden"
                      style={{
                        background: 'var(--qart-bg-warm)',
                        borderColor: 'var(--qart-border-subtle)',
                      }}
                    >
                      <div
                        className="w-1/2 h-1"
                        style={{ background: 'var(--qart-accent-muted)' }}
                      />
                      <div
                        className="absolute top-4 left-4 text-[10px] font-black px-2 py-1 uppercase tracking-tighter"
                        style={{ background: 'var(--qart-primary)', color: 'var(--qart-bg)' }}
                      >
                        QART_SPEC_0{idx + 1}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-qart-accent">
                        Premium
                      </span>
                      <div
                        className="flex items-center gap-2 px-3 py-1.5 border-2 border-qart-border"
                        style={{ background: 'var(--qart-primary)', color: 'var(--qart-bg)' }}
                      >
                        <span className="text-xs font-black tracking-tighter">
                          RATING {burger.avgRating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <div className="mb-8 flex-1">
                      <h3 className="text-3xl font-display text-qart-primary leading-tight uppercase font-black mb-3">
                        {burger.name}
                      </h3>
                      <p className="text-qart-text-muted text-sm font-bold uppercase tracking-tighter leading-relaxed">
                        {burger.description || 'Sin descripción disponible.'}
                      </p>
                    </div>

                    {/* Panel nutricional */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden mb-8 border-t-2 border-qart-border pt-8"
                        >
                          <div className="grid grid-cols-2 gap-8 text-xs font-black uppercase tracking-widest">
                            {[
                              { label: 'Calories', value: burger.calories, unit: '' },
                              { label: 'Proteins', value: `${burger.proteins}g`, unit: '' },
                              { label: 'Carbs', value: `${burger.carbs}g`, unit: '' },
                              { label: 'Flavor', value: burger.flavor, accent: true },
                            ].map(({ label, value, accent }) => (
                              <div key={label}>
                                <span className="text-qart-text-muted block mb-2">{label}</span>
                                <span
                                  className={`text-2xl ${accent ? 'text-qart-accent' : 'text-qart-primary'}`}
                                >
                                  {value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Precio y acción */}
                    <div className="flex justify-between items-center pt-8 border-t-4 border-qart-border mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-qart-text-muted font-black tracking-[0.3em] uppercase mb-1">
                          Inversión
                        </span>
                        <span className="text-4xl font-display text-qart-primary font-black">
                          ${burger.price.toFixed(0)}
                        </span>
                      </div>
                      <button
                        className="w-16 h-16 flex items-center justify-center text-3xl font-black transition-all duration-300 border-4 border-qart-border"
                        style={{
                          background: isSelected ? 'var(--qart-accent)' : 'var(--qart-primary)',
                          color: isSelected ? 'var(--qart-text-on-accent)' : 'var(--qart-bg)',
                        }}
                      >
                        {isSelected ? '✓' : '+'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedDish;
