import { AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { sdk } from '../../../tools/sdk';
import type { InferRequest } from '@app/sdk';
import type { SearchPlatesContract } from '@app/contracts';
import { useAppStore } from '../../../appStore';
import Navbar from '../../Landing/components/Navbar';
import OrderPanel from '../../Landing/components/OrderPanel';
import PlateNutritionModal from '../../Landing/components/PlateNutritionModal';
import PlateRecipeModal from '../../Landing/components/PlateRecipeModal';
import PlateReviewsModal from '../../Landing/components/PlateReviewsModal';
import type { LandingPlate } from '../../Landing/components/landingPlateNutrition';
import { mergeSearchPayload, stringifySearchUrl } from '../searchUrl';
import { SearchFilters } from '../components/SearchFilters';
import { SearchPlateCard } from '../components/SearchPlateCard';
import '../../Landing/LandingPages.css';

type ModalState = { plateId: string; view: 'nutrition' | 'recipe' | 'reviews' } | null;

const IconSearch = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <circle cx="11" cy="11" r="7" />
    <line x1="16.5" y1="16.5" x2="21" y2="21" strokeLinecap="square" />
  </svg>
);

/**
 * Catálogo completo con filtros; estado en la query string.
 */
const SearchPage = () => {
  const { setModule } = useAppStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [qDraft, setQDraft] = useState(() => searchParams.get('q') ?? '');
  const [modal, setModal] = useState<ModalState>(null);

  const queryKey = searchParams.toString();
  const payload = useMemo(() => mergeSearchPayload(searchParams), [searchParams]);

  useEffect(() => {
    setModule('LANDING');
  }, [setModule]);

  useEffect(() => {
    setQDraft(searchParams.get('q') ?? '');
  }, [searchParams]);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearchParams((prev) => {
        const currentQ = prev.get('q') ?? '';
        if (qDraft === currentQ) return prev;
        const next = mergeSearchPayload(prev);
        next.q = qDraft.trim() || undefined;
        next.page = 1;
        return new URLSearchParams(stringifySearchUrl(next));
      });
    }, 420);
    return () => clearTimeout(t);
  }, [qDraft, setSearchParams]);

  useEffect(() => {
    void sdk.customers.search(mergeSearchPayload(searchParams) as InferRequest<typeof SearchPlatesContract>);
  }, [queryKey, searchParams]);

  const res = sdk.customers.search.$use();
  const data = res.data && 'data' in res.data ? res.data.data : null;
  const plates = data?.items ?? [];
  const total = data?.total ?? 0;
  const page = data?.page ?? payload.page;
  const pageSize = data?.pageSize ?? payload.pageSize;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const selectedPlate = modal
    ? plates.find((p) => p.id === modal.plateId) ?? null
    : null;

  const goPage = (p: number) => {
    setSearchParams((prev) => {
      const st = mergeSearchPayload(prev);
      return new URLSearchParams(stringifySearchUrl({ ...st, page: p }));
    });
  };

  const refreshSearch = () => {
    void sdk.customers.search(mergeSearchPayload(searchParams) as InferRequest<typeof SearchPlatesContract>);
  };

  return (
    <div className="min-h-screen bg-qart-bg search-page-root">
      <Navbar />
      <main className="search-shell">
        <aside className="search-shell__aside">
          <SearchFilters
            searchParams={searchParams}
            onReplaceParams={(next) => setSearchParams(next, { replace: true })}
          />
        </aside>
        <div className="search-shell__main">
          <header className="search-main-header">
            <div className="search-main-header__row">
              <Link to="/" className="search-back-link">
                ← Inicio
              </Link>
            </div>
            <h1 className="search-main-title">Menú completo</h1>
            <p className="search-main-lead">
              Pedidos rápidos, sin vueltas. Filtrá por tipo, precio y más; compartí el link con lo que
              buscás.
            </p>
            <div className="search-bar-wrap">
              <IconSearch className="search-bar-ico" />
              <input
                type="search"
                className="search-bar-input"
                placeholder="Buscar por nombre o descripción…"
                value={qDraft}
                onChange={(e) => setQDraft(e.target.value)}
                aria-label="Buscar en el menú"
              />
            </div>
            <p className="search-results-meta">
              {res.isFetching ? 'Buscando…' : `${total} resultado${total === 1 ? '' : 's'}`}
            </p>
          </header>

          {!res.isFetching && res.error && (
            <div className="banner-error max-w-xl" role="alert">
              <span className="font-black uppercase tracking-[0.2em]">Ups</span>
              <p className="font-semibold">No pudimos cargar el menú. Probá de nuevo.</p>
            </div>
          )}

          <div className="search-results-grid">
            {plates.map((plate) => (
              <SearchPlateCard
                key={plate.id}
                plate={plate as LandingPlate}
                onNutrition={() => setModal({ plateId: plate.id, view: 'nutrition' })}
                onRecipe={() => setModal({ plateId: plate.id, view: 'recipe' })}
                onReviews={() => setModal({ plateId: plate.id, view: 'reviews' })}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="search-pagination" aria-label="Páginas">
              <button
                type="button"
                className="btn-outline py-2 px-4 text-xs uppercase tracking-widest"
                disabled={page <= 1}
                onClick={() => goPage(page - 1)}
              >
                Anterior
              </button>
              <span className="search-pagination__status">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                className="btn-outline py-2 px-4 text-xs uppercase tracking-widest"
                disabled={page >= totalPages}
                onClick={() => goPage(page + 1)}
              >
                Siguiente
              </button>
            </nav>
          )}
        </div>
      </main>
      <OrderPanel />

      <AnimatePresence>
        {selectedPlate && modal?.view === 'nutrition' && (
          <PlateNutritionModal plate={selectedPlate} onClose={() => setModal(null)} />
        )}
        {selectedPlate && modal?.view === 'recipe' && (
          <PlateRecipeModal plate={selectedPlate} onClose={() => setModal(null)} />
        )}
        {selectedPlate && modal?.view === 'reviews' && (
          <PlateReviewsModal
            plate={selectedPlate}
            onClose={() => setModal(null)}
            onReviewsChanged={refreshSearch}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchPage;
