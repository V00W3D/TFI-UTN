import { useState } from 'react';
import {
  PlateDataIcon,
  PlateDifficultyIcon,
  StarRatingDisplay,
  getPlateSizeIconKey,
  getPlateTypeIconKey,
} from '../../../components/shared/PlateDataIcons';
import {
  formatLandingEnum,
  formatLandingPrice,
  type LandingPlate,
} from './landingPlateNutrition';

interface PlateCardProps {
  plate: LandingPlate;
  onOpenNutrition: () => void;
  onOpenRecipe: () => void;
}

const PlateCard = ({ plate, onOpenNutrition, onOpenRecipe }: PlateCardProps) => {
  const [imageFailed, setImageFailed] = useState(false);
  const hasMediaImage = Boolean(plate.imageUrl && !imageFailed);
  const sizeIcon = getPlateSizeIconKey(plate.size);
  const typeIcon = getPlateTypeIconKey(plate.recipe.type);
  const leadQuote =
    plate.reviews.find((review) => review.comment)?.comment ||
    plate.recipe.assemblyNotes ||
    plate.recipe.description ||
    'Hecho para salir rico desde el primer vistazo.';

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
          <p className="featured-card-quote">“{leadQuote}”</p>
        </div>

        <div className="featured-card-actions featured-card-actions--pair">
          <button
            type="button"
            className="featured-card-action"
            onClick={onOpenNutrition}
          >
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
              <PlateDataIcon
                icon={plate.recipe.prepTimeMinutes != null ? 'time' : 'ingredient'}
              />
              <span>
                {plate.recipe.prepTimeMinutes != null
                  ? `${plate.recipe.prepTimeMinutes} min de prep`
                  : `${plate.adjustments.length} ajustes`}
              </span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PlateCard;
