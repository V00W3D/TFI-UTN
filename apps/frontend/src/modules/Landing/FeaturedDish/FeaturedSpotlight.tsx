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
import { useOrderStore } from '@/shared/store/orderStore';
import { sdk } from '@/shared/utils/sdk';
import {
  formatLandingEnum,
  formatLandingPrice,
  type LandingPlate,
} from '@/shared/utils/plateNutrition';
import {
  PlateNutritionModal,
  PlateRecipeModal,
  PlateReviewsModal,
} from '@/shared/ui/PlateCard/modals';
import { PlateDataIcon, StarRatingDisplay } from '@/shared/ui/PlateDataIcons';
import { buttonStyles } from '@/styles/components/button';
import { landingStyles } from '@/styles/modules/landing';
import { cn } from '@/styles/utils/cn';

type Modal = { plateId: string; view: 'nutrition' | 'recipe' | 'reviews' } | null;

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
    <section id="destacados" className={landingStyles.spotlightSection}>
      <div className={landingStyles.spotlightContainer}>
        <div className={landingStyles.spotlightHead}>
          <span className={landingStyles.spotlightKicker}>Lo que más se pide</span>
          <h2 className={landingStyles.spotlightTitle}>Favoritos de la casa</h2>
          <p className={landingStyles.spotlightSub}>
            Tres clásicos que la gente repite: buen puntaje, buenas ventas. El resto del menú está a
            un click, sin vueltas.
          </p>
          <Link
            to="/search"
            className={cn(
              buttonStyles({ variant: 'secondary', size: 'sm' }),
              landingStyles.spotlightCtaLink,
            )}
          >
            Ver menú completo
          </Link>
        </div>

        {isFetching && <p className={landingStyles.spotlightLoading}>Cargando destacados…</p>}
        {!isFetching && error && (
          <p className={landingStyles.spotlightError}>No pudimos cargar los destacados.</p>
        )}

        <div className={landingStyles.spotlightGrid}>
          {plates.map((plate) => {
            const hasImg = Boolean(plate.imageUrl && !imgErr[plate.id]);
            return (
              <article key={plate.id} className={landingStyles.spotlightCard}>
                <div className={landingStyles.spotlightMedia}>
                  {hasImg ? (
                    <img
                      src={plate.imageUrl!}
                      alt=""
                      loading="lazy"
                      className={landingStyles.spotlightMediaImage}
                      onError={() => setImgErr((s) => ({ ...s, [plate.id]: true }))}
                    />
                  ) : (
                    <div className={landingStyles.spotlightPlaceholder} />
                  )}
                </div>
                <div className={landingStyles.spotlightBody}>
                  <div className={landingStyles.spotlightBadges}>
                    <span className={landingStyles.spotlightBadge}>
                      <StarRatingDisplay value={plate.avgRating} size={16} showValue={false} />
                      <span className={landingStyles.spotlightRatingValue}>
                        {plate.avgRating.toFixed(1)}
                      </span>
                    </span>
                    {plate.unitsSold > 0 && (
                      <span className={landingStyles.spotlightBadgeSales}>
                        {plate.unitsSold} pedidos
                      </span>
                    )}
                  </div>
                  <p className={landingStyles.spotlightType}>
                    {formatLandingEnum(plate.recipe.type)}
                  </p>
                  <h3 className={landingStyles.spotlightName}>{plate.name}</h3>
                  <p className={landingStyles.spotlightPrice}>
                    {formatLandingPrice(plate.menuPrice)}
                  </p>

                  {/* Floating Actions Over Body */}
                  <div className={landingStyles.spotlightMediaActions}>
                    <button
                      type="button"
                      className={landingStyles.spotlightMediaAction}
                      onClick={() => setModal({ plateId: plate.id, view: 'nutrition' })}
                      title="Info"
                    >
                      <PlateDataIcon icon="info" className={landingStyles.spotlightDataIcon} />
                    </button>
                    <button
                      type="button"
                      className={landingStyles.spotlightMediaAction}
                      onClick={() => setModal({ plateId: plate.id, view: 'recipe' })}
                      title="Arma"
                    >
                      <PlateDataIcon icon="recipe" className={landingStyles.spotlightDataIcon} />
                    </button>
                  </div>

                  <div className={landingStyles.spotlightActions}>
                    <button
                      type="button"
                      className={landingStyles.spotlightGhost}
                      onClick={() => setModal({ plateId: plate.id, view: 'reviews' })}
                      title="Ver reseñas"
                    >
                      <IconReviews className={landingStyles.spotlightReviewsIcon} />
                      <span className={landingStyles.spotlightReviewsCount}>
                        {plate.ratingsCount} Reseñas
                      </span>
                    </button>
                    <button
                      type="button"
                      className={landingStyles.spotlightPrimary}
                      onClick={() => {
                        addItem(plate, 1);
                        setOpen(true);
                      }}
                    >
                      <IconPlus className={landingStyles.spotlightPlus} />
                      Agregar
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p className={landingStyles.spotlightHint}>
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
