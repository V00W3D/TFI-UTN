import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sdk } from '../../../tools/sdk';

/**
 * @file FeaturedDish.tsx
 * @description Enterprise-grade "Top Creations" carousel displaying QART signature plates.
 * Refined to match the "Solid Pitch Black & Fast-Food Red" identity.
 */
const FeaturedDish = () => {
  // $use() subscribes to the Zustand state — it does NOT fire the request.
  // sdk.customers.plates({}) is the callable that fires the actual HTTP GET.
  const { data, isFetching, error } = sdk.customers.plates.$use();
  const [selectedBurgerId, setSelectedBurgerId] = useState<string | null>(null);

  // Trigger the actual fetch on mount
  useEffect(() => {
    sdk.customers.plates({});
  }, []);

  // Extract plates from the ApiSuccess envelope
  const plates = data && 'data' in data ? data.data : [];

  return (
    <section
      id="menu"
      className="py-32 bg-qart-bg relative selection:bg-qart-accent selection:text-white"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        {/* ENTEPRISE HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 border-b border-qart-border pb-8">
          <div className="max-w-2xl">
            <span className="text-qart-accent font-bold tracking-widest uppercase text-sm mb-3 block">
              Menú Oficial
            </span>
            <h2 className="text-5xl md:text-6xl font-display text-qart-primary mb-6 leading-tight">
              Top Creaciones
            </h2>
            <p className="text-qart-text-muted text-xl leading-relaxed">
              Descubrí las obras maestras nutricionales de QART. Diseñadas meticulosamente para
              equilibrar sabor explosivo y macros perfectos.
            </p>
          </div>
          <button className="btn-outline shrink-0 group">
            Ver Menú Completo
            <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">
              →
            </span>
          </button>
        </div>

        {/* LOADING STATE */}
        {isFetching && (
          <div className="flex justify-center items-center py-32">
            <div className="w-16 h-16 rounded-full border-4 border-qart-border border-t-qart-accent animate-spin"></div>
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="text-center py-24 bg-red-50 rounded-2xl border border-red-100">
            <h3 className="text-qart-error font-bold text-2xl mb-2">Error de Conexión</h3>
            <p className="text-red-700">No pudimos cargar el menú en este momento.</p>
          </div>
        )}

        {/* CARDS GRID */}
        {!isFetching && !error && plates.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {plates.map(
              (
                burger: {
                  id: string;
                  name: string;
                  price: number;
                  description?: string | null;
                  calories: number;
                  proteins: number;
                  carbs: number;
                  fats: number;
                  avgRating: number;
                  flavor: string;
                  recommendations: number;
                },
                idx: number,
              ) => {
                const isSelected = selectedBurgerId === burger.id;

                return (
                  <motion.div
                    key={burger.id}
                    className={`card-friendly flex flex-col group relative overflow-hidden transition-all duration-300 ${isSelected ? 'ring-2 ring-qart-primary shadow-xl scale-[1.02]' : 'hover:-translate-y-2 hover:shadow-lg cursor-pointer'}`}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ delay: idx * 0.1, type: 'spring', stiffness: 90 }}
                    onClick={() => setSelectedBurgerId(isSelected ? null : burger.id)}
                  >
                    {/* ACCENT HEADER BAR */}
                    <div className="h-2 w-full bg-linear-to-r from-qart-accent to-red-600" />

                    <div className="p-8 flex-1 flex flex-col">
                      {/* EMOJI / IMAGE PLACEHOLDER WITH SOLID BORDER */}
                      <div className="w-full h-48 mb-8 relative flex items-center justify-center bg-gray-50 rounded-xl border border-qart-border group-hover:bg-gray-100 transition-colors">
                        <div
                          className={`relative z-10 text-7xl transition-transform duration-500 ${isSelected ? 'scale-125' : 'group-hover:scale-110 group-hover:-rotate-3'}`}
                        >
                          🍔
                        </div>
                        {/* Rating Badge Overlay */}
                        <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-full border border-qart-border shadow-sm flex items-center gap-1.5">
                          <span className="text-amber-500 text-sm">★</span>
                          <span className="font-bold text-sm">{burger.avgRating.toFixed(1)}</span>
                        </div>
                      </div>

                      {/* TITLE & DESCRIPTION */}
                      <div className="mb-6 flex-1">
                        <div className="flex justify-between items-start gap-4 mb-3">
                          <h3 className="text-2xl font-display text-qart-primary leading-tight">
                            {burger.name}
                          </h3>
                        </div>
                        <p className="text-qart-text-muted text-base leading-relaxed">
                          {burger.description || 'Sin descripción disponible.'}
                        </p>
                      </div>

                      {/* INTERACTIVE MACROS PANEL */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mb-6"
                          >
                            <div className="bg-gray-50 rounded-xl p-5 border border-qart-border">
                              <div className="flex items-center justify-between mb-4 pb-3 border-b border-qart-border">
                                <span className="font-bold text-xs tracking-wider text-qart-text uppercase">
                                  Valores Físicos
                                </span>
                                <span className="text-xs font-bold text-qart-accent bg-red-50 px-2 py-1 rounded">
                                  {burger.flavor}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                                <div>
                                  <span className="block text-qart-text-muted text-xs mb-1">
                                    Calorías
                                  </span>
                                  <span className="font-bold text-qart-primary text-lg">
                                    {burger.calories}{' '}
                                    <span className="text-xs font-normal">kcal</span>
                                  </span>
                                </div>
                                <div>
                                  <span className="block text-qart-text-muted text-xs mb-1">
                                    Proteínas
                                  </span>
                                  <span className="font-bold text-qart-primary text-lg">
                                    {burger.proteins} <span className="text-xs font-normal">g</span>
                                  </span>
                                </div>
                                <div>
                                  <span className="block text-qart-text-muted text-xs mb-1">
                                    Carbs
                                  </span>
                                  <span className="font-bold text-qart-primary text-lg">
                                    {burger.carbs} <span className="text-xs font-normal">g</span>
                                  </span>
                                </div>
                                <div>
                                  <span className="block text-qart-text-muted text-xs mb-1">
                                    Grasas
                                  </span>
                                  <span className="font-bold text-qart-primary text-lg">
                                    {burger.fats} <span className="text-xs font-normal">g</span>
                                  </span>
                                </div>
                              </div>

                              <div className="mt-5 pt-3 border-t border-qart-border flex items-center justify-between text-xs text-qart-text-muted">
                                <span>{burger.recommendations} personas lo armaron</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* FOOTER: PRICE & ACTION */}
                      <div className="flex justify-between items-center pt-6 border-t border-qart-border mt-auto">
                        <div className="flex flex-col">
                          <span className="text-xs text-qart-text-muted font-bold tracking-wider uppercase mb-1">
                            Precio
                          </span>
                          <span className="text-3xl font-display text-qart-primary tracking-tight">
                            ${burger.price.toFixed(2)}
                          </span>
                        </div>
                        <button
                          className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-200 cursor-pointer shadow-sm ${
                            isSelected
                              ? 'bg-qart-primary text-white scale-95'
                              : 'bg-qart-accent text-white hover:bg-[#CC0000] hover:-translate-y-1 hover:shadow-md'
                          }`}
                          aria-label="Agregar o ver detalles"
                        >
                          {isSelected ? '✓' : '+'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              },
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedDish;
