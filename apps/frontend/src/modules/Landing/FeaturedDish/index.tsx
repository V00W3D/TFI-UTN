/**
 * @file index.tsx
 * @module FeaturedDish
 * @description Sección de platos destacados con paginación y modales.
 */
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as qartEnv from '@/shared/utils/qartEnv';
import { sdk } from '@/shared/utils/sdk';
import { PlateCard } from '@/shared/ui/PlateCard';
import {
  PlateNutritionModal,
  PlateRecipeModal,
  PlateReviewsModal,
} from '@/shared/ui/PlateCard/modals';
import { buttonStyles } from '@/styles/components/button';
import { landingSectionStyles } from '@/styles/modules/landingSections';
import { featuredPaginationPageStyles, landingStyles } from '@/styles/modules/landing';
import { cn } from '@/styles/utils/cn';
const PLATES_PER_PAGE = 3;
type FeaturedModalView = 'nutrition' | 'recipe' | 'reviews';

export const FeaturedDish = () => {
  const { data, isFetching, error } = sdk.customers.plates.$use();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedModal, setSelectedModal] = useState<{
    plateId: string;
    view: FeaturedModalView;
  } | null>(null);

  useEffect(() => {
    void sdk.customers.plates({});
  }, []);

  const plates = data && 'data' in data ? data.data : [];
  const totalPages = Math.max(1, Math.ceil(plates.length / PLATES_PER_PAGE));
  const visiblePage = Math.min(currentPage, totalPages);
  const currentSliceStart = (visiblePage - 1) * PLATES_PER_PAGE;
  const visiblePlates = plates.slice(currentSliceStart, currentSliceStart + PLATES_PER_PAGE);
  const selectedPlate = selectedModal
    ? (plates.find((plate) => plate.id === selectedModal.plateId) ?? null)
    : null;

  useEffect(() => {
    if (!selectedPlate) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedModal(null);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPlate]);

  return (
    <section id="menu" className={landingSectionStyles.featuredSection}>
      <div className={landingSectionStyles.featuredInner}>
        <div className={landingSectionStyles.featuredHead}>
          <div className={landingSectionStyles.featuredHeadCopy}>
            <span className={landingSectionStyles.heroBadge}>
              Menú destacado
            </span>
            <h2 className={landingSectionStyles.featuredTitle}>
              Nuestros <br /> platos
            </h2>
            <p className={landingSectionStyles.featuredLead}>
              {qartEnv.PUBLIC_APP_SCOPE === 'full'
                ? 'Explorá los destacados, movete por páginas de hasta tres platos y abrí el espacio customer para el catálogo completo.'
                : 'Recorré los destacados de a tres y, si querés más detalle de armado, usá las fichas y el crafteo más abajo.'}
            </p>
          </div>

          {qartEnv.PUBLIC_APP_SCOPE === 'full' ? (
            <Link
              to="/search"
              className={cn(
                buttonStyles({ variant: 'secondary' }),
                landingSectionStyles.featuredLink,
              )}
            >
              Ver menú completo
            </Link>
          ) : (
            <button
              type="button"
              className={cn(
                buttonStyles({ variant: 'secondary' }),
                landingSectionStyles.featuredLink,
              )}
              onClick={() =>
                document.getElementById('craft')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Crafteo y detalle
            </button>
          )}
        </div>

        {isFetching && (
          <div className={cn(landingSectionStyles.featuredBanner, landingSectionStyles.featuredBannerInfo)}>
            <span className={landingSectionStyles.featuredBannerLabel}>Cargando</span>
            <p className={landingSectionStyles.featuredBannerBody}>
              Estamos cargando el menú destacado.
            </p>
          </div>
        )}

        {!isFetching && error && (
          <div className={cn(landingSectionStyles.featuredBanner, landingSectionStyles.featuredBannerError)}>
            <span className={landingSectionStyles.featuredBannerLabel}>Error</span>
            <p className={landingSectionStyles.featuredBannerBody}>
              No pudimos cargar los platos destacados en este momento.
            </p>
          </div>
        )}

        {!isFetching && !error && plates.length > 0 && (
          <>
            <div className={landingStyles.featuredPagination}>
              <div className={landingStyles.featuredPaginationStatus}>
                <span>
                  Página {visiblePage} de {totalPages}
                </span>
                <span>{plates.length} platos cargados</span>
              </div>

              {totalPages > 1 && (
                <div
                  className={landingStyles.featuredPaginationSlider}
                  aria-label="Paginación del menú destacado"
                >
                  <button
                    type="button"
                    className={buttonStyles({ variant: 'secondary', size: 'sm' })}
                    disabled={visiblePage === 1}
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  >
                    Anterior
                  </button>

                  <div className={landingStyles.featuredPaginationPages}>
                    {Array.from({ length: totalPages }, (_, index) => {
                      const pageNumber = index + 1;

                      return (
                        <button
                          key={pageNumber}
                          type="button"
                          className={featuredPaginationPageStyles({
                            active: pageNumber === visiblePage,
                          })}
                          aria-current={pageNumber === visiblePage ? 'page' : undefined}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    className={buttonStyles({ variant: 'secondary', size: 'sm' })}
                    disabled={visiblePage === totalPages}
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>

            <div className={landingStyles.plateCollection}>
              {visiblePlates.map((plate) => (
                <PlateCard
                  key={plate.id}
                  plate={plate}
                  variant="featured"
                  onNutrition={() => setSelectedModal({ plateId: plate.id, view: 'nutrition' })}
                  onRecipe={() => setSelectedModal({ plateId: plate.id, view: 'recipe' })}
                  onReviews={() => setSelectedModal({ plateId: plate.id, view: 'reviews' })}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedPlate && selectedModal?.view === 'nutrition' && (
          <PlateNutritionModal plate={selectedPlate} onClose={() => setSelectedModal(null)} />
        )}
        {selectedPlate && selectedModal?.view === 'recipe' && (
          <PlateRecipeModal plate={selectedPlate} onClose={() => setSelectedModal(null)} />
        )}
        {selectedPlate && selectedModal?.view === 'reviews' && (
          <PlateReviewsModal plate={selectedPlate} onClose={() => setSelectedModal(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default FeaturedDish;
