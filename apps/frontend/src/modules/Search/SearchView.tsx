/**
 * @file SearchView.tsx
 * @module Search
 * @description Vista principal de búsqueda y filtrado de platos.
 */
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SearchFilters } from '@/modules/Search/SearchView/SearchFilters';
import { useAppStore } from '@/shared/store/appStore';
import { SearchIcon } from '@/shared/ui/AppIcons';
import { PlateCard } from '@/shared/ui/PlateCard';
import {
  PlateNutritionModal,
  PlateRecipeModal,
  PlateReviewsModal,
} from '@/shared/ui/PlateCard/modals';
import type { LandingPlate } from '@/shared/utils/plateNutrition';
import { sdk } from '@/shared/utils/sdk';
import { searchStyles } from '@/styles/modules/search';

export const SearchView: React.FC = () => {
  const { setModule } = useAppStore();
  const [plates, setPlates] = useState<LandingPlate[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedPlate, setSelectedPlate] = useState<LandingPlate | null>(null);
  const [modalView, setModalView] = useState<'nutrition' | 'recipe' | 'reviews' | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setModule('LANDING');
    void fetchPlates();
  }, [setModule]);

  const fetchPlates = async () => {
    setIsFetching(true);
    try {
      const res = await sdk.customers.plates({});
      if ('data' in res) setPlates(res.data);
    } finally {
      setIsFetching(false);
    }
  };

  const closeModal = () => {
    setSelectedPlate(null);
    setModalView(null);
  };

  return (
    <div className={searchStyles.shell}>
      <aside className={searchStyles.aside}>
        <SearchFilters searchParams={searchParams} onReplaceParams={setSearchParams} />
      </aside>

      <main className={searchStyles.main}>
        <header className={searchStyles.header}>
          <div className={searchStyles.headerRow}>
            <Link to="/" className={searchStyles.backLink}>
              ← VOLVER AL INICIO
            </Link>
          </div>
          <h1 className={searchStyles.title}>Buscador de Platos</h1>
          <p className={searchStyles.lead}>
            Explorá nuestra carta completa. Usá los filtros para encontrar exactamente lo que
            buscás.
          </p>

          <div className={searchStyles.barWrap}>
            <SearchIcon className={searchStyles.barIcon} />
            <input
              type="text"
              className={searchStyles.barInput}
              placeholder="Buscar por nombre o ingrediente..."
            />
          </div>
        </header>

        <section className={searchStyles.resultsGrid}>
          {isFetching ? (
            <p className={searchStyles.stateText}>Cargando resultados...</p>
          ) : plates.length > 0 ? (
            plates.map((plate) => (
              <PlateCard
                key={plate.id}
                plate={plate}
                variant="compact"
                onNutrition={() => {
                  setSelectedPlate(plate);
                  setModalView('nutrition');
                }}
                onRecipe={() => {
                  setSelectedPlate(plate);
                  setModalView('recipe');
                }}
                onReviews={() => {
                  setSelectedPlate(plate);
                  setModalView('reviews');
                }}
              />
            ))
          ) : (
            <p className={searchStyles.stateText}>No se encontraron resultados.</p>
          )}
        </section>
      </main>

      {selectedPlate && modalView === 'nutrition' && (
        <PlateNutritionModal plate={selectedPlate} onClose={closeModal} />
      )}
      {selectedPlate && modalView === 'recipe' && (
        <PlateRecipeModal plate={selectedPlate} onClose={closeModal} />
      )}
      {selectedPlate && modalView === 'reviews' && (
        <PlateReviewsModal plate={selectedPlate} onClose={closeModal} />
      )}
    </div>
  );
};

export default SearchView;
