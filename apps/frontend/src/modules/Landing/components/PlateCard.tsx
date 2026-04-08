/**
 * @file PlateCard.tsx
 * @module Landing
 * @description Archivo PlateCard alineado a la arquitectura y trazabilidad QART.
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
import { useState } from 'react';
import {
  PlateDataIcon,
  PlateDifficultyIcon,
  StarRatingDisplay,
  getPlateSizeIconKey,
  getPlateTypeIconKey,
} from '../../../components/shared/PlateDataIcons';
import { formatLandingEnum, formatLandingPrice, type LandingPlate } from './landingPlateNutrition';
import { useOrderStore } from '../../../orderStore';

interface PlateCardProps {
  plate: LandingPlate;
  onOpenNutrition: () => void;
  onOpenRecipe: () => void;
}

const AddToOrderIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="square"
    strokeLinejoin="miter"
    aria-hidden="true"
  >
    <path d="M6 2L3 6v14h18V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
    <line x1="12" y1="13" x2="12" y2="17" />
    <line x1="10" y1="15" x2="14" y2="15" />
  </svg>
);

const PlateCard = ({ plate, onOpenNutrition, onOpenRecipe }: PlateCardProps) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem, setOpen } = useOrderStore();

  const hasMediaImage = Boolean(plate.imageUrl && !imageFailed);
  const sizeIcon = getPlateSizeIconKey(plate.size);
  const typeIcon = getPlateTypeIconKey(plate.recipe.type);
  const leadQuote =
    plate.reviews.find((review) => review.comment)?.comment ||
    plate.recipe.assemblyNotes ||
    plate.recipe.description ||
    'Hecho para salir rico desde el primer vistazo.';

  const handleQuantityChange = (delta: number) => {
    setQuantity((q) => Math.max(1, q + delta));
  };

  const handleAdd = () => {
    addItem(plate, quantity);
    setAdded(true);
    setOpen(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <article className="featured-card">
      <div
        className={`featured-card-media${hasMediaImage ? ' featured-card-media--with-image' : ''}`}
      >
        {hasMediaImage && (
          <img
            src={plate.imageUrl!}
            alt={plate.name}
            className="featured-card-media-image"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        )}
        <div className="featured-card-media-overlay" />
        <div className="featured-card-media-badge">
          {plate.isAvailable ? 'Disponible' : 'Fuera de carta'}
        </div>
        <div className="featured-card-media-lines" />
        <div className="featured-card-media-copy">
          <span
            className="featured-card-media-symbol"
            title={`Categoria ${formatLandingEnum(plate.recipe.type)}`}
          >
            <PlateDataIcon icon={typeIcon} className="featured-card-media-icon" />
          </span>
          <span
            className="featured-card-media-symbol featured-card-media-symbol--difficulty"
            title={`Dificultad ${formatLandingEnum(plate.recipe.difficulty)}`}
          >
            <PlateDifficultyIcon
              difficulty={plate.recipe.difficulty}
              className="featured-card-media-difficulty"
            />
          </span>
        </div>
        <div className="featured-card-media-signature">
          <span>Tamano</span>
          <strong title={`Tamano ${formatLandingEnum(plate.size)}`}>
            <PlateDataIcon
              icon={sizeIcon}
              className="featured-card-media-icon featured-card-media-icon--large"
            />
          </strong>
        </div>
      </div>

      <div className="featured-card-content">
        <div className="featured-card-topline">
          <div className="featured-chip-row">
            <span className="featured-chip featured-chip--accent">
              {formatLandingEnum(plate.recipe.type)}
            </span>
            <span className="featured-chip">{formatLandingEnum(plate.size)}</span>
          </div>

          <div className="featured-rating-pill">
            <StarRatingDisplay
              className="featured-star-rating"
              value={plate.avgRating}
              size={14}
              showValue={false}
            />
            <div className="featured-rating-meta">
              <strong>{plate.avgRating.toFixed(1)}</strong>
              <span>{plate.ratingsCount} resenas</span>
            </div>
          </div>
        </div>

        <div className="featured-card-copy">
          <h3>{plate.name}</h3>
          <p>{plate.description || 'Este plato todavia no tiene descripcion.'}</p>
        </div>

        <div className="featured-card-story">
          <p className="featured-kicker">Lo que invita a pedirlo</p>
          <p className="featured-card-quote">"{leadQuote}"</p>
        </div>

        <div className="featured-card-actions featured-card-actions--pair">
          <button type="button" className="featured-card-action" onClick={onOpenNutrition}>
            <PlateDataIcon icon="info" className="featured-card-action-icon" />
            <span>Informacion nutricional</span>
          </button>
          <button
            type="button"
            className="featured-card-action featured-card-action--primary"
            onClick={onOpenRecipe}
          >
            <PlateDataIcon icon="recipe" className="featured-card-action-icon" />
            <span>Receta</span>
          </button>
        </div>

        <div className="featured-card-footer">
          <div>
            <span className="featured-price-label">Precio final</span>
            <strong className="featured-price-value">{formatLandingPrice(plate.menuPrice)}</strong>
          </div>

          <div className="featured-card-footer-meta">
            <span className="featured-footer-item">
              <PlateDataIcon icon="availability" />
              <span>{plate.isAvailable ? 'Disponible hoy' : 'Consultar disponibilidad'}</span>
            </span>
            <span className="featured-footer-item">
              <PlateDataIcon icon={plate.recipe.prepTimeMinutes != null ? 'time' : 'ingredient'} />
              <span>
                {plate.recipe.prepTimeMinutes != null
                  ? `${plate.recipe.prepTimeMinutes} min de prep`
                  : `${plate.adjustments.length} ajustes`}
              </span>
            </span>
          </div>
        </div>

        <div className="plate-order-bar">
          <div className="plate-qty-control">
            <button
              type="button"
              className="plate-qty-btn"
              onClick={() => handleQuantityChange(-1)}
              aria-label="Reducir cantidad"
            >
              −
            </button>
            <input
              type="number"
              className="plate-qty-input"
              min={1}
              value={quantity}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!isNaN(v) && v >= 1) setQuantity(v);
              }}
              aria-label="Cantidad"
            />
            <button
              type="button"
              className="plate-qty-btn"
              onClick={() => handleQuantityChange(1)}
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>

          <button
            type="button"
            className={`plate-add-btn${added ? ' plate-add-btn--added' : ''}`}
            onClick={handleAdd}
            disabled={!plate.isAvailable}
          >
            <AddToOrderIcon className="plate-add-btn-icon" />
            <span>{added ? '¡Añadido!' : 'Añadir'}</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default PlateCard;
