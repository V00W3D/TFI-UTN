/**
 * @file SearchPlateCard.tsx
 * @module Search
 * @description Archivo SearchPlateCard alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-19
 * rnf: RNF-03
 *
 * @business
 * inputs: props de presentacion, estado derivado y callbacks
 * outputs: bloques de UI interactivos reutilizables
 * rules: mantener componentes composables y sin logica persistente
 *
 * @technical
 * dependencies: react, landingPlateNutrition, orderStore, appStore
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
import { useState } from 'react';
import {
  formatLandingEnum,
  formatLandingPrice,
  type LandingPlate,
} from '../../Landing/components/landingPlateNutrition';
import { useOrderStore } from '../../../orderStore';
import { useAppStore } from '../../../appStore';

interface SearchPlateCardProps {
  plate: LandingPlate;
  onNutrition: () => void;
  onRecipe: () => void;
  onReviews: () => void;
}

const IconNutrition = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden
  >
    <path d="M4 12h4l2-8 4 16 2-8h4" strokeLinecap="square" />
  </svg>
);

const IconList = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden
  >
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
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

/**
 * Card mínima para grilla de /search — sin ruido visual.
 */
export const SearchPlateCard = ({
  plate,
  onNutrition,
  onRecipe,
  onReviews,
}: SearchPlateCardProps) => {
  const [imgErr, setImgErr] = useState(false);
  const { addItem, setOpen } = useOrderStore();
  const { simpleMode } = useAppStore();

  return (
    <article className="search-plate-card">
      <div className="search-plate-card__media">
        {plate.imageUrl && !imgErr ? (
          <img src={plate.imageUrl} alt="" loading="lazy" onError={() => setImgErr(true)} />
        ) : (
          <div className="search-plate-card__ph" aria-hidden />
        )}
      </div>
      <div className="search-plate-card__body">
        <p className="search-plate-card__meta">{formatLandingEnum(plate.recipe.type)}</p>
        <h3 className="search-plate-card__title">{plate.name}</h3>
        <p className="search-plate-card__price">{formatLandingPrice(plate.menuPrice)}</p>
        <div className="search-plate-card__actions">
          {!simpleMode && (
            <>
              <button
                type="button"
                className="search-plate-card__icon-btn"
                onClick={onNutrition}
                title="Info nutricional"
              >
                <IconNutrition className="search-plate-card__ico" />
              </button>
              <button
                type="button"
                className="search-plate-card__icon-btn"
                onClick={onRecipe}
                title="Receta"
              >
                <IconList className="search-plate-card__ico" />
              </button>
            </>
          )}
          <button
            type="button"
            className="search-plate-card__icon-btn"
            onClick={onReviews}
            title="Ver reseñas"
          >
            <IconReviews className="search-plate-card__ico" />
          </button>
          <button
            type="button"
            className="search-plate-card__add"
            onClick={() => {
              addItem(plate, 1);
              setOpen(true);
            }}
          >
            <IconPlus className="search-plate-card__ico-add" />
            <span>SUMAR</span>
          </button>
        </div>
      </div>
    </article>
  );
};
