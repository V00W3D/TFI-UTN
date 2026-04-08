/**
 * @file FeaturedDish.tsx
 * @module Landing
 * @description Archivo FeaturedDish alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: datos del modulo y dependencias compartidas
 * outputs: comportamiento o estructuras del modulo
 * rules: respetar contratos, seguridad y trazabilidad definidas en context.md
 *
 * @technical
 * dependencies: dependencias locales del archivo
 * flow: inicializa, transforma y expone la logica del modulo
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
 * decisions: bloque agregado para cumplir el formato obligatorio de context.md
 */
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { PUBLIC_APP_SCOPE } from '../../../env';
import { sdk } from '../../../tools/sdk';
import PlateCard from './PlateCard';
import PlateNutritionModal from './PlateNutritionModal';
import PlateRecipeModal from './PlateRecipeModal';

const sectionStyle = { '--tw-selection-color': 'var(--qart-accent)' } as CSSProperties;
const PLATES_PER_PAGE = 3;
type FeaturedModalView = 'nutrition' | 'recipe';

const FeaturedDish = () => {
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
              {PUBLIC_APP_SCOPE === 'full'
                ? 'Explorá los destacados, movete por páginas de hasta tres platos y abrí el espacio customer para el catálogo completo.'
                : 'Quedate en esta página: recorré los destacados de a tres y, si querés más detalle de armado, usá las fichas y el crafteo más abajo.'}
            </p>
          </div>

          {PUBLIC_APP_SCOPE === 'full' ? (
            <Link
              to="/customer"
              className="btn-outline shrink-0 group uppercase tracking-widest py-3 px-7"
            >
              Ver menú completo
              <span className="ml-4 group-hover:translate-x-2 transition-transform inline-block">
                →
              </span>
            </Link>
          ) : (
            <button
              type="button"
              className="btn-outline shrink-0 uppercase tracking-widest py-3 px-7"
              onClick={() =>
                document.getElementById('craft')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Crafteo y detalle
            </button>
          )}
        </div>

        {isFetching && (
          <div className="banner-info max-w-3xl">
            <span className="font-black uppercase tracking-[0.2em]">Cargando</span>
            <p className="font-semibold">Estamos cargando el menú destacado.</p>
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
          <>
            <div className="featured-pagination">
              <div className="featured-pagination-status">
                <span>
                  Página {visiblePage} de {totalPages}
                </span>
                <span>{plates.length} platos cargados</span>
              </div>

              {totalPages > 1 && (
                <div
                  className="featured-pagination-slider"
                  aria-label="Paginación del menú destacado"
                >
                  <button
                    type="button"
                    className="btn-outline uppercase tracking-widest py-3 px-5"
                    disabled={visiblePage === 1}
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  >
                    Anterior
                  </button>

                  <div className="featured-pagination-pages">
                    {Array.from({ length: totalPages }, (_, index) => {
                      const pageNumber = index + 1;

                      return (
                        <button
                          key={pageNumber}
                          type="button"
                          className={`featured-pagination-page ${
                            pageNumber === visiblePage ? 'featured-pagination-page--active' : ''
                          }`}
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
                    className="btn-outline uppercase tracking-widest py-3 px-5"
                    disabled={visiblePage === totalPages}
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>

            <div className="plate-collection plate-collection--grid plate-collection--paged">
              {visiblePlates.map((plate) => (
                <PlateCard
                  key={plate.id}
                  plate={plate}
                  onOpenNutrition={() => setSelectedModal({ plateId: plate.id, view: 'nutrition' })}
                  onOpenRecipe={() => setSelectedModal({ plateId: plate.id, view: 'recipe' })}
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
      </AnimatePresence>
    </section>
  );
};

export default FeaturedDish;
