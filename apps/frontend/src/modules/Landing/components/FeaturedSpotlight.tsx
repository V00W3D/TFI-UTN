/**
 * @file FeaturedSpotlight.tsx
 * @module Landing
 * @description Archivo FeaturedSpotlight alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: props de presentacion, estado derivado y callbacks
 * outputs: bloques de UI interactivos reutilizables
 * rules: mantener componentes composables y sin logica persistente
 *
 * @technical
 * dependencies: framer-motion, react, react-router-dom, sdk, orderStore, landingPlateNutrition, PlateNutritionModal, PlateRecipeModal, PlateReviewsModal
 * flow: recibe props o estado derivado; calcula etiquetas, listas o variantes visuales; renderiza la seccion interactiva; delega eventos a callbacks, stores o modales del nivel superior.
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-AUDIT-01
 *
 * @notes
 * decisions: se prioriza composicion de interfaz y reutilizacion de piezas visuales
 */
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sdk } from '../../../tools/sdk';
import { useOrderStore } from '../../../orderStore';
import { formatLandingEnum, formatLandingPrice, type LandingPlate } from './landingPlateNutrition';
import PlateNutritionModal from './PlateNutritionModal';
import PlateRecipeModal from './PlateRecipeModal';
import PlateReviewsModal from './PlateReviewsModal';
import { PlateDataIcon, StarRatingDisplay } from '../../../components/shared/PlateDataIcons';

type Modal = { plateId: string; view: 'nutrition' | 'recipe' | 'reviews' } | null;

const IconStar = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2l2.9 6.9L22 9.3l-5.6 4.9L18.2 22 12 18.6 5.8 22l1.8-7.8L2 9.3l7.1-.4L12 2z" />
  </svg>
);

const IconFlame = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden
  >
    <path d="M12 2c2 4 6 5 6 10a6 6 0 1 1-12 0c0-3 2-6 2-8 2 2 4 4 4 8" strokeLinecap="round" />
  </svg>
);

const IconPlus = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    aria-hidden
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconReviews = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden
  >
    <path d="M4 5h13v10H8l-3 3V5z" strokeLinejoin="miter" />
    <path d="M8 9h8M8 12h5" strokeLinecap="square" />
  </svg>
);

/**
 * Tres platos top ventas + reviews — cards dedicadas, estética distinta al catálogo /search.
 */
const FeaturedSpotlight = () => {
  const [modal, setModal] = useState<Modal>(null);
  const [imgErr, setImgErr] = useState<Record<string, boolean>>({});
  const { addItem, setOpen } = useOrderStore();

  useEffect(() => {
    void sdk.customers.featured({ limit: 3 });
  }, []);

  const { data, isFetching, error } = sdk.customers.featured.$use();
  const plates =
    data && 'data' in data ? (data.data as (LandingPlate & { unitsSold: number })[]) : [];
  const selected = modal ? (plates.find((p) => p.id === modal.plateId) ?? null) : null;

  const refreshFeatured = () => {
    void sdk.customers.featured({ limit: 3 });
  };

  return (
    <section id="destacados" className="spotlight-section">
      <div className="spotlight-section__inner max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="spotlight-section__head">
          <span className="spotlight-kicker">Lo que más se pide</span>
          <h2 className="spotlight-title">Favoritos de la casa</h2>
          <p className="spotlight-sub">
            Tres clásicos que la gente repite: buen puntaje, buenas ventas. El resto del menú está a
            un click, sin vueltas.
          </p>
          <Link
            to="/search"
            className="btn-outline spotlight-cta-link uppercase tracking-widest text-xs py-3 px-6 mt-6 inline-flex"
          >
            Ver menú completo
          </Link>
        </div>

        {isFetching && (
          <p className="spotlight-loading text-qart-text-muted text-sm font-bold uppercase tracking-widest">
            Cargando destacados…
          </p>
        )}
        {!isFetching && error && (
          <p className="text-qart-error text-sm font-semibold">No pudimos cargar los destacados.</p>
        )}

        <div className="spotlight-grid">
          {plates.map((plate, index) => {
            const hasImg = Boolean(plate.imageUrl && !imgErr[plate.id]);
            return (
              <article key={plate.id} className={`spotlight-card spotlight-card--${index + 1}`}>
                <div className="spotlight-card__ribbon" aria-hidden>
                  <IconFlame className="spotlight-card__ribbon-ico" />
                  Top
                </div>
                <div className="spotlight-card__media">
                  {hasImg ? (
                    <img
                      src={plate.imageUrl!}
                      alt=""
                      loading="lazy"
                      onError={() => setImgErr((s) => ({ ...s, [plate.id]: true }))}
                    />
                  ) : (
                    <div className="spotlight-card__ph" />
                  )}
                </div>
                <div className="spotlight-card__body">
                  <div className="spotlight-card__badges">
                    <span className="spotlight-badge bg-qart-surface flex items-center gap-2 pl-2">
                      <StarRatingDisplay
                         value={plate.avgRating}
                         size={16}
                         showValue={false}
                      />
                      <span className="text-[10px] font-black">{plate.avgRating.toFixed(1)}</span>
                    </span>
                    {plate.unitsSold > 0 && (
                      <span className="spotlight-badge spotlight-badge--sales">
                        {plate.unitsSold} pedidos
                      </span>
                    )}
                  </div>
                  <p className="spotlight-card__type">{formatLandingEnum(plate.recipe.type)}</p>
                  <h3 className="spotlight-card__name">{plate.name}</h3>
                  <p className="spotlight-card__price">{formatLandingPrice(plate.menuPrice)}</p>
                  
                  {/* Floating Actions Over Body */}
                  <div className="absolute right-3 top-3 flex flex-col gap-2 z-20">
                    <button
                      type="button"
                      className="w-10 h-10 bg-qart-surface/90 border border-qart-border text-qart-text flex items-center justify-center rounded-none shadow-[2px_2px_0_var(--qart-border)] transition-transform hover:-translate-y-0.5 hover:border-qart-accent hover:text-qart-accent"
                      onClick={() => setModal({ plateId: plate.id, view: 'nutrition' })}
                      title="Info"
                    >
                      <PlateDataIcon icon="info" className="w-[1.2rem] h-[1.2rem]" />
                    </button>
                    <button
                      type="button"
                      className="w-10 h-10 bg-qart-surface/90 border border-qart-border text-qart-text flex items-center justify-center rounded-none shadow-[2px_2px_0_var(--qart-border)] transition-transform hover:-translate-y-0.5 hover:border-qart-accent hover:text-qart-accent"
                      onClick={() => setModal({ plateId: plate.id, view: 'recipe' })}
                      title="Arma"
                    >
                      <PlateDataIcon icon="recipe" className="w-[1.2rem] h-[1.2rem]" />
                    </button>
                  </div>

                  <div className="spotlight-card__actions mt-auto">
                    <button
                      type="button"
                      className="spotlight-card__ghost spotlight-card__ghost--reviews"
                      onClick={() => setModal({ plateId: plate.id, view: 'reviews' })}
                      title="Ver reseñas"
                    >
                      <IconReviews className="size-5 shrink-0" />
                      <span className="text-[10px] font-black uppercase tracking-widest ml-1">{plate.ratingsCount} Reseñas</span>
                    </button>
                    <button
                      type="button"
                      className="spotlight-card__primary"
                      onClick={() => {
                        addItem(plate, 1);
                        setOpen(true);
                      }}
                    >
                      <IconPlus className="spotlight-card__plus" />
                      Agregar
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p className="spotlight-hint text-center text-qart-text-subtle text-xs font-semibold uppercase tracking-wide mt-12 max-w-xl mx-auto">
          ¿Querés ver cómo se compone un plato? Tocá <strong>Arma</strong> — es el camino al
          crafteo, sin perder el estilo del local.
        </p>
      </div>

      <AnimatePresence>
        {selected && modal?.view === 'nutrition' && (
          <PlateNutritionModal plate={selected} onClose={() => setModal(null)} />
        )}
        {selected && modal?.view === 'recipe' && (
          <PlateRecipeModal plate={selected} onClose={() => setModal(null)} />
        )}
        {selected && modal?.view === 'reviews' && (
          <PlateReviewsModal
            plate={selected}
            onClose={() => setModal(null)}
            onReviewsChanged={refreshFeatured}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default FeaturedSpotlight;
