import { useEffect, type CSSProperties } from 'react';
import { sdk } from '../../../tools/sdk';
import PlateCardsRenderer from './PlateCardsRenderer';

const sectionStyle = { '--tw-selection-color': 'var(--qart-accent)' } as CSSProperties;

const FeaturedDish = () => {
  const { data, isFetching, error } = sdk.customers.plates.$use();

  useEffect(() => {
    void sdk.customers.plates({});
  }, []);

  const plates = data && 'data' in data ? data.data : [];

  return (
    <section id="menu" className="py-20 bg-qart-bg relative" style={sectionStyle}>
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 pb-8 border-b-4 border-qart-border">
          <div className="max-w-3xl">
            <span className="badge-accent mb-6 uppercase tracking-[0.3em] font-black">
              Menú destacado
            </span>
            <h2 className="text-4xl md:text-5xl font-display text-qart-primary mb-5 leading-none uppercase font-black">
              Nuestros <br /> platos
            </h2>
            <p className="text-qart-text-muted text-base leading-snug font-bold uppercase tracking-tight max-w-2xl">
              Explorá platos disponibles y abrí cada ficha para ver guía, nutrición, receta,
              componentes y reseñas.
            </p>
          </div>

          <button
            type="button"
            className="btn-outline shrink-0 group uppercase tracking-widest py-3 px-7"
          >
            Ver menú completo
            <span className="ml-4 group-hover:translate-x-2 transition-transform inline-block">
              →
            </span>
          </button>
        </div>

        {isFetching && (
          <div className="banner-info max-w-3xl">
            <span className="font-black uppercase tracking-[0.2em]">Cargando</span>
            <p className="font-semibold">
              Estamos cargando el menú destacado.
            </p>
          </div>
        )}

        {!isFetching && error && (
          <div className="banner-error max-w-3xl">
            <span className="font-black uppercase tracking-[0.2em]">Error</span>
            <p className="font-semibold">
              No pudimos cargar los platos destacados en este momento.
            </p>
          </div>
        )}

        {!isFetching && !error && plates.length === 0 && (
          <div className="banner-info max-w-3xl">
            <span className="font-black uppercase tracking-[0.2em]">Sin platos</span>
            <p className="font-semibold">
              Todavía no hay platos disponibles para mostrar en esta sección.
            </p>
          </div>
        )}

        {!isFetching && !error && plates.length > 0 && (
          <PlateCardsRenderer plates={plates} layout="grid" />
        )}
      </div>
    </section>
  );
};

export default FeaturedDish;
